import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { WORLD_08_LEVEL_01_STAGES as stages } from "../src/levels/world-08/level-01-stages";
import {
  NORWAY_BUDGETS,
  NORWAY_DECORATIONS,
  NORWAY_NAMES,
  norwayTileAngle,
  norwayArc,
  v,
} from "../src/levels/world-08/NorwayRoutes";
import {
  createNorwayModel,
  previewNorwayModel,
} from "../src/levels/world-08/NorwayModels";
import { LevelBuilder } from "../src/levels/LevelBuilder";
import { LevelLoader } from "../src/levels/LevelLoader";
import { applyRequestedStageUpdates } from "../src/levels/RequestedStageUpdates";
import { getBakedStage } from "../src/levels/BakedStages";
import { PhysicsWorld } from "../src/physics/PhysicsWorld";
import { Player } from "../src/player/Player";
import { CHARACTERS } from "../src/player/Characters";
import { SpriteTextures } from "../src/rendering/SpriteTextures";
import { disposeStageResources } from "../src/rendering/StageResources";
import type { LevelObjectData, Vector3Data } from "../src/levels/LevelTypes";
vi.mock("@dimforge/rapier3d-compat", async () => {
  const path = "../node_modules/@dimforge/rapier3d-compat/rapier.es.js";
  return import(path);
});
beforeAll(async () => {
  await RAPIER.init();
  vi.spyOn(SpriteTextures, "getCharacterTexture").mockReturnValue(
    new THREE.Texture(),
  );
  vi.spyOn(SpriteTextures, "getSphereTexture").mockReturnValue(
    new THREE.CanvasTexture({ width: 1, height: 1 } as HTMLCanvasElement),
  );
});
afterEach(() => vi.unstubAllGlobals());
function documentStub() {
  const gradient = { addColorStop: () => {} };
  const ctx = new Proxy(
    {},
    {
      get: (_, k) =>
        k === "createLinearGradient" || k === "createRadialGradient"
          ? () => gradient
          : k === "measureText"
            ? () => ({ width: 100 })
            : () => {},
    },
  );
  vi.stubGlobal("document", {
    createElement: () => ({ width: 128, height: 128, getContext: () => ctx }),
  });
}
async function fixture(stage: number) {
  documentStub();
  const physics = new PhysicsWorld();
  await physics.waitForReady();
  const scene = new LevelBuilder().build(
      structuredClone(stages[stage]),
      physics,
      "dragon_ball",
    ),
    player = new Player(CHARACTERS[0], physics, scene.spawnPoint),
    camera = new THREE.PerspectiveCamera();
  player.respawn();
  const step = (dt = 1 / 60, input = { horizontal: 0, vertical: 0 }) => {
    scene.norway?.update(dt, player, input);
    player.update(dt, input, camera);
    scene.update(dt, false, player.getPosition(), player);
    physics.step(dt);
  };
  return {
    scene,
    physics,
    player,
    step,
    dispose: () => {
      scene.destroy();
      player.destroy();
      physics.getWorld()?.free();
    },
  };
}
describe("Norway: ten snowy mountain courses and native mechanisms", () => {
  it('renders distant snowy summits with one exposed surface instead of overlapping snow and rock skins', () => {
    for(const quality of ['low','medium','high'])for(let seed=0;seed<9;seed++) {
      const object:LevelObjectData={id:`summit-${seed}`,type:'decoration',position:v(0,-50,0),rotation:v(0,seed*.4,0),scale:v(2.1,2.1,2.1),properties:{subType:'norway_mountain',seed}};
      const model=createNorwayModel(object,quality)!;
      try {
        expect(model.meshes).toHaveLength(1);
        for(const radius of [3,5,7])for(let sample=0;sample<7;sample++) {
          const angle=sample*Math.PI*2/7+.137;
          const origin=model.group.localToWorld(new THREE.Vector3(-18+Math.cos(angle)*radius,100,Math.sin(angle)*radius));
          const hits=new THREE.Raycaster(origin,new THREE.Vector3(0,-1,0)).intersectObject(model.group,true);
          expect(hits.length).toBeGreaterThan(1);
          // A thin snow overlay used to produce two almost identical depths here.
          expect(hits[1].distance-hits[0].distance).toBeGreaterThan(.3);
        }
      } finally {disposeStageResources(model.group);}
    }
  });
  it("has a native timing window across the complete rotating plate bridge", async () => {
    const f = await fixture(7);
    try {
      let crossed = false;
      for (const delay of [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5]) {
        f.scene.reset!();
        f.player.teleportTo(-49, 34.85, 0);
        f.player.setLinearVelocity({ x: 0, y: 0, z: 0 });
        for (let i = 0; i < Math.floor(delay * 60); i++) f.step();
        let reached = false;
        for (let i = 0; i < 750; i++) {
          f.player.setLinearVelocity({ x: 12, y: f.player.linvel().y, z: 0 });
          f.step();
          const p = f.player.getPosition();
          if (p.y < 31) break;
          if (p.x > 49) {
            reached = true;
            break;
          }
        }
        if (reached) {
          for (let i = 0; i < 90; i++) {
            f.player.setLinearVelocity({ x: 0, y: f.player.linvel().y, z: 0 });
            f.step();
          }
          if (f.player.getPosition().y > 33.5) {
            crossed = true;
            break;
          }
        }
      }
      expect(crossed).toBe(true);
    } finally {
      f.dispose();
    }
  }, 15000);
  it("can ascend the complete moving troll spiral under native collision", async () => {
    const f = await fixture(9);
    try {
      const tower = f.scene.group.getObjectByName("norway-tower")!,
        points = norwayArc(0, 0, 11, Math.PI, Math.PI * 8, 0, 48);
      f.player.teleportTo(-11, 14.9, 0);
      let index = 1,
        reached = false;
      for (let frame = 0; frame < 12000; frame++) {
        const p = f.player.getPosition(),
          target = tower.localToWorld(
            new THREE.Vector3(
              points[index].x,
              points[index].y,
              points[index].z,
            ),
          );
        if (
          Math.hypot(target.x - p.x, target.z - p.z) < 0.55 &&
          index < points.length - 1
        )
          index++;
        const dx = target.x - p.x,
          dz = target.z - p.z,
          d = Math.hypot(dx, dz) || 1;
        f.player.setLinearVelocity({
          x: (dx / d) * 6 + 0.42 * p.z,
          y: f.player.linvel().y,
          z: (dz / d) * 6 - 0.42 * p.x,
        });
        f.step(1 / 60, { horizontal: 0.1, vertical: 0 });
        expect(
          f.player.getPosition().y,
          `spiral at ${index}: ${JSON.stringify(p)}`,
        ).toBeGreaterThan(target.y - 2);
        if (index === points.length - 1 && f.player.getPosition().y > 61) {
          reached = true;
          break;
        }
      }
      expect(
        reached,
        JSON.stringify({ index, position: f.player.getPosition() }),
      ).toBe(true);
    } finally {
      f.dispose();
    }
  }, 15000);
  it("can clear the three Trolltunga hills using real drive and the authored boosters", async () => {
    const f = await fixture(2);
    try {
      let peak = 0,
        reached = false;
      for (let frame = 0; frame < 9000; frame++) {
        f.step(1 / 60, {
          horizontal: 1,
          vertical: THREE.MathUtils.clamp(
            f.player.getPosition().z * 0.6,
            -0.6,
            0.6,
          ),
        });
        const p = f.player.getPosition();
        peak = Math.max(peak, p.y);
        if (p.y < 0) break;
        if (p.x > 80) {
          reached = true;
          break;
        }
      }
      expect(reached, JSON.stringify(f.player.getPosition())).toBe(true);
      expect(peak).toBeGreaterThan(70);
    } finally {
      f.dispose();
    }
  }, 15000);
  it("carries a resting ball on a rotating crescent with native contact", async () => {
    const f = await fixture(10);
    try {
      f.player.teleportTo(-27, 32.95, -4);
      let moved = false;
      for (let i = 0; i < 180; i++) {
        f.step();
        const p = f.player.getPosition();
        expect(p.y).toBeGreaterThan(30);
        if (Math.abs(p.z + 4) > 4) moved = true;
      }
      expect(moved).toBe(true);
    } finally {
      f.dispose();
    }
  });
  it("registers all ten named stages and exactly one hundred supported reward placements", async () => {
    vi.stubGlobal("localStorage", { getItem: () => null, setItem: () => {} });
    let total = 0;
    for (let stage = 1; stage <= 10; stage++) {
      const data = await new LevelLoader().loadStage(8, 1, stage);
      expect(data.name).toBe(NORWAY_NAMES[stage - 1]);
      expect(getBakedStage(8, 1, stage)?.id).toBe(data.id);
      expect(data.objects.filter((o) => o.type === "collectible")).toHaveLength(
        NORWAY_BUDGETS[stage - 1],
      );
      expect(new Set(data.objects.map((o) => o.id)).size).toBe(
        data.objects.length,
      );
      expect(
        data.objects.some(
          (o) => o.type === "lava" || o.properties?.subType === "tokyo_path",
        ),
      ).toBe(false);
      total += LevelLoader.getStageCollectiblesCount(8, 1, stage);
    }
    expect(total).toBe(100);
  });
  it("upgrades obsolete generated drafts and preserves deliberate editor saves", () => {
    const draft = {
      ...structuredClone(stages[2]),
      name: "old",
      properties: {},
      objects: [],
    };
    expect(applyRequestedStageUpdates(draft, 8, 1, 2).name).toBe(
      NORWAY_NAMES[1],
    );
    const custom = { ...structuredClone(draft), customSaved: true };
    expect(applyRequestedStageUpdates(custom, 8, 1, 2).name).toBe("old");
  });
  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])(
    "builds E%i with finite geometry, a supported spawn, goal and every prize",
    async (stage) => {
      const f = await fixture(stage);
      try {
        expect(f.scene.norway).toBeDefined();
        const ray = new THREE.Raycaster(),
          down = new THREE.Vector3(0, -1, 0);
        f.scene.group.updateMatrixWorld(true);
        for (const point of [
          stages[stage].spawn,
          ...stages[stage].objects
            .filter((o) => o.type === "collectible" || o.type === "goal")
            .map((o) => o.position),
        ]) {
          ray.set(new THREE.Vector3(point.x, point.y + 0.05, point.z), down);
          const hits = ray.intersectObjects(f.scene.collidableMeshes, false),
            hit = hits[0];
          expect(hit, `E${stage}: ${JSON.stringify(point)}`).toBeDefined();
          expect(
            point.y - hit.point.y,
            `E${stage}: ${JSON.stringify(point)} versus ${hit?.point.y}`,
          ).toBeLessThan(2);
        }
        f.scene.group.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            expect(
              Array.from(node.geometry.getAttribute("position").array).every(
                Number.isFinite,
              ),
            ).toBe(true);
          }
        });
        for (let i = 0; i < 30; i++) f.step();
        expect(f.player.getPosition().y).toBeGreaterThan(
          stages[stage].spawn.y - 2,
        );
      } finally {
        f.dispose();
      }
    },
  );
  it("builds every reusable winter element at all qualities and keeps animated geometry immutable", () => {
    documentStub();
    for (const quality of ["low", "medium", "high"])
      for (const [kind] of NORWAY_DECORATIONS) {
        const obj: LevelObjectData = {
          id: kind,
          type: "decoration",
          position: v(0, 0, 0),
          rotation: v(0, 0, 0),
          scale: v(1, 1, 1),
          properties: {
            subType: `norway_${kind}`,
            norwayAction:
              kind === "tile"
                ? "flip"
                : kind === "tower" || kind === "swing_arc"
                  ? "spin"
                  : kind === "snowball"
                    ? "orbit"
                    : undefined,
          },
        };
        const model = createNorwayModel(obj, quality)!;
        expect(model).toBeTruthy();
        const buffers = model.meshes.map((mesh) => mesh.geometry);
        for (const time of [0, 1, 3, 6])
          previewNorwayModel(obj, model.group, time);
        expect(model.meshes.map((mesh) => mesh.geometry)).toEqual(buffers);
        disposeStageResources(model.group);
      }
  });
  it("offers stationary resting plates, complete flip cycles and narrowing in the middle", () => {
    expect(norwayTileAngle(0, 0)).toBe(0);
    expect(norwayTileAngle(3.9, 0)).toBeGreaterThan(2);
    expect(norwayTileAngle(5.8, 0)).toBe(0);
    const tiles = stages[7].objects.filter(
      (o) => o.properties?.subType === "norway_tile",
    );
    expect(tiles).toHaveLength(28);
    expect(
      tiles.filter((o) => !o.properties?.norwayAction).length,
    ).toBeGreaterThan(3);
    expect(Number(tiles[14].properties?.depth)).toBeLessThan(
      Number(tiles[0].properties?.depth),
    );
  });
  it("updates and resets the spinning tower, its native body, moving goal and anchored prizes", async () => {
    const f = await fixture(9);
    try {
      const tower = f.scene.group.getObjectByName("norway-tower")!,
        coin = f.scene.collectibles[0],
        start = coin.position.clone(),
        buffers: THREE.BufferGeometry[] = [];
      tower.traverse((node) => {
        if (node instanceof THREE.Mesh) buffers.push(node.geometry);
      });
      for (let i = 0; i < 120; i++) f.step();
      expect(Math.abs(tower.rotation.y)).toBeGreaterThan(0.7);
      expect(coin.position.distanceTo(start)).toBeGreaterThan(5);
      expect(f.scene.goal!.rotationY).toBeCloseTo(tower.rotation.y);
      const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(
        f.scene.goal!.quaternion!,
      );
      expect(Math.abs(normal.x)).toBeGreaterThan(0.5);
      f.scene.reset!();
      expect(tower.rotation.y).toBe(0);
      expect(f.scene.goal!.rotationY).toBe(0);
      expect(
        new THREE.Vector3(coin.baseX, coin.baseY, coin.baseZ).distanceTo(start),
      ).toBeLessThan(0.01);
      let index = 0;
      tower.traverse((node) => {
        if (node instanceof THREE.Mesh)
          expect(node.geometry).toBe(buffers[index++]);
      });
    } finally {
      f.dispose();
    }
  });
  it("boosts and physically pushes the ball on contact with the avalanche", async () => {
    const f = await fixture(8);
    try {
      f.player.teleportTo(-77, 34.9, 0);
      f.step();
      expect(f.player.linvel().x).toBeGreaterThan(15);
      const snowball = f.scene.group.getObjectByName("norway-snowball")!;
      f.player.teleportTo(
        snowball.position.x + 0.8,
        snowball.position.y,
        snowball.position.z,
      );
      f.step();
      expect(f.player.linvel().y).toBeGreaterThan(6);
      expect(
        Math.hypot(f.player.linvel().x, f.player.linvel().z),
      ).toBeGreaterThan(18);
    } finally {
      f.dispose();
    }
  });
  it("can cross the thin paired glacier rails using native collisions", async () => {
    const f = await fixture(3);
    try {
      f.player.teleportTo(-78, 25.9, 0);
      for (let frame = 0; frame < 600; frame++) {
        f.player.setLinearVelocity({ x: 3, y: f.player.linvel().y, z: 0 });
        f.step();
        expect(f.player.getPosition().y).toBeGreaterThan(24.4);
        if (f.player.getPosition().x > -51) break;
      }
      expect(f.player.getPosition().x).toBeGreaterThan(-51);
    } finally {
      f.dispose();
    }
  });
  it("walks the long descending spiral with native ball-floor collision", async () => {
    const f = await fixture(6);
    try {
      const road = stages[6].objects.find((o) =>
          o.id.endsWith("-descent-tower"),
        )!,
        points = road.properties!.points as Vector3Data[];
      f.player.teleportTo(points[0].x, points[0].y + 1.05, points[0].z);
      let index = 1;
      for (let frame = 0; frame < 10000; frame++) {
        const p = f.player.getPosition();
        while (
          index < points.length - 1 &&
          Math.hypot(points[index].x - p.x, points[index].z - p.z) < 0.45
        )
          index++;
        const t = points[index],
          dx = t.x - p.x,
          dz = t.z - p.z,
          d = Math.hypot(dx, dz) || 1;
        f.player.setLinearVelocity({
          x: (dx / d) * 4,
          y: f.player.linvel().y,
          z: (dz / d) * 4,
        });
        f.step();
        expect(f.player.getPosition().y).toBeGreaterThan(t.y - 2);
        if (index === points.length - 1 && d < 0.7) break;
      }
      expect(index).toBe(points.length - 1);
    } finally {
      f.dispose();
    }
  }, 15000);
});
