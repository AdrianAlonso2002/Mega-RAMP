import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { WORLD_08_LEVEL_02_STAGES as stages } from "../src/levels/world-08/level-02-stages";
import {
  FJORD_BUDGETS,
  FJORD_DECORATIONS,
  FJORD_NAMES,
} from "../src/levels/world-08/FjordRoutes";
import { v } from "../src/levels/world-08/NorwayRoutes";
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
import type { Vector3Data } from "../src/levels/LevelTypes";
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

describe("M8-N2 Norwegian fjords", () => {
  it("can cross all sinking stepping stones using native floor contacts", async () => {
    const f = await fixture(4);
    try {
      f.player.teleportTo(-56, 25.9, 0);
      let index = 0;
      const targets = stages[4].objects
        .filter((o) => o.id.includes("sinking-column-"))
        .map((o) => o.position);
      for (let frame = 0; frame < 4200 && index < targets.length; frame++) {
        const p = f.player.getPosition(),
          t = targets[index],
          dx = t.x - p.x,
          dz = t.z - p.z,
          d = Math.hypot(dx, dz);
        if (d < 0.5) {
          index++;
          continue;
        }
        f.player.setLinearVelocity({
          x: (dx / d) * 5,
          y: f.player.linvel().y,
          z: (dz / d) * 5,
        });
        f.step();
        if (p.y < 23) break;
      }
      expect(index).toBe(targets.length);
    } finally {
      f.dispose();
    }
  });
  it("has a physical timing window through each of the three open pipes", async () => {
    const f = await fixture(9);
    try {
      for (const o of stages[9].objects.filter(
        (o) => o.properties?.subType === "fjord_pipe",
      )) {
        f.scene.reset!();
        const start = o.position;
        f.player.teleportTo(start.x - 10, 24.9, start.z);
        f.player.setLinearVelocity(v(0, 0, 0));
        for (let frame = 0; frame < 110; frame++) {
          const p = f.player.getPosition();
          f.player.setLinearVelocity({
            x: 12,
            y: f.player.linvel().y,
            z: THREE.MathUtils.clamp((start.z - p.z) * 3, -4, 4),
          });
          f.step();
        }
        expect(f.player.getPosition().x, o.id).toBeGreaterThan(start.x + 10);
        expect(f.player.getPosition().y, o.id).toBeGreaterThan(23.5);
      }
    } finally {
      f.dispose();
    }
  });
  it("registers ten authored stages and exactly 100 ordered collectibles", () => {
    let total = 0;
    for (const [i, data] of Object.values(stages).entries()) {
      expect(data.name).toBe(FJORD_NAMES[i]);
      expect(getBakedStage(8, 2, i + 1)?.name).toBe(data.name);
      const coins = data.objects.filter((o) => o.type === "collectible");
      expect(coins).toHaveLength(FJORD_BUDGETS[i]);
      total += coins.length;
      expect(new Set(data.objects.map((o) => o.id)).size).toBe(
        data.objects.length,
      );
      expect(data.objects.filter((o) => o.type === "goal")).toHaveLength(1);
      expect(
        applyRequestedStageUpdates(
          { ...structuredClone(data), properties: {} },
          8,
          2,
          i + 1,
        ).name,
      ).toBe(data.name);
      expect(LevelLoader.getStageCollectiblesCount(8, 2, i + 1)).toBe(
        coins.length,
      );
    }
    expect(total).toBe(100);
    const coins = stages[5].objects.filter((o) => o.type === "collectible");
    for (const c of coins)
      expect(
        coins.some(
          (o) =>
            Math.abs(o.position.x + c.position.x) < 0.001 &&
            o.position.z === c.position.z,
        ),
      ).toBe(true);
    for (const o of stages[2].objects.filter((o) => o.properties?.points))
      expect((o.properties!.widths as number[]).every((w) => w === 1.5)).toBe(
        true,
      );
  });
  it("builds finite, stable geometry for every scenery and mechanism at all quality levels", () => {
    for (const quality of ["low", "medium", "high"])
      for (const [kind] of FJORD_DECORATIONS) {
        const o = {
          id: kind,
          type: "decoration" as const,
          position: v(0, 0, 0),
          rotation: v(0, 0, 0),
          scale: v(1, 1, 1),
          properties: {
            subType: `fjord_${kind}`,
            norwayAction:
              kind === "pipe"
                ? "pipe"
                : kind === "roll"
                  ? "roll"
                  : kind === "waterfalls"
                    ? "waterfall"
                    : kind === "whale"
                      ? "whale"
                      : undefined,
          },
        };
        const model = createNorwayModel(o, quality)!;
        expect(model).toBeTruthy();
        const geometries = model.meshes.map((m) => m.geometry);
        for (const g of geometries)
          expect(
            Array.from(g.getAttribute("position").array).every(Number.isFinite),
          ).toBe(true);
        for (const t of [0, 1, 3, 6, 12]) previewNorwayModel(o, model.group, t);
        expect(model.meshes.map((m) => m.geometry)).toEqual(geometries);
        disposeStageResources(model.group);
      }
  });
  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])(
    "supports the spawn, goal and prizes in stage %i",
    async (stage) => {
      const f = await fixture(stage);
      try {
        const ray = new THREE.Raycaster();
        const probes = [
          stages[stage].spawn,
          ...stages[stage].objects
            .filter((o) => o.type === "goal" || o.type === "collectible")
            .map((o) => o.position),
        ];
        for (const p of probes) {
          ray.set(
            new THREE.Vector3(p.x, p.y + 1, p.z),
            new THREE.Vector3(0, -1, 0),
          );
          const hits = ray.intersectObjects(f.scene.collidableMeshes, false);
          expect(
            hits.some((h) => h.distance < 5),
            JSON.stringify(p),
          ).toBe(true);
        }
        for (let i = 0; i < 90; i++) f.step();
        expect(f.player.getPosition().y).toBeGreaterThan(
          stages[stage].spawn.y - 5,
        );
      } finally {
        f.dispose();
      }
    },
  );
  it("launches and lands every precision jump with native gravity and collision", async () => {
    const f = await fixture(2);
    try {
      for (const o of stages[2].objects.filter(
        (o) => o.properties?.norwayAction === "jump",
      )) {
        f.scene.reset!();
        f.player.teleportTo(o.position.x, o.position.y + 0.85, o.position.z);
        f.player.setLinearVelocity(v(0, 0, 0));
        f.step();
        expect(f.player.linvel().y).toBeGreaterThan(8);
        const target = o.properties!.target as Vector3Data;
        for (let i = 0; i < 85; i++) f.step();
        const p = f.player.getPosition();
        expect(p.y, o.id + JSON.stringify(p)).toBeGreaterThan(target.y + 0.55);
        expect(Math.abs(p.x - target.x)).toBeLessThan(0.8);
      }
    } finally {
      f.dispose();
    }
  });
  it.each([1, 8, 10])(
    "lands the large gap in stage %i without teleportation",
    async (stage) => {
      const f = await fixture(stage);
      try {
        const o = stages[stage].objects.find(
            (o) => o.properties?.norwayAction === "jump",
          )!,
          target = o.properties!.target as Vector3Data;
        f.player.teleportTo(o.position.x, o.position.y + 0.85, o.position.z);
        f.player.setLinearVelocity(v(0, 0, 0));
        f.step();
        expect(f.player.linvel().y).toBeGreaterThan(8);
        for (let i = 0; i < 95; i++) f.step();
        expect(f.player.getPosition().y).toBeGreaterThan(target.y - 2);
      } finally {
        f.dispose();
      }
    },
  );
  it("completes the vertical loop using the approach boost and real collision", async () => {
    const f = await fixture(6);
    try {
      f.player.teleportTo(-8, 24.85, 0);
      f.player.setLinearVelocity(v(0, 0, 0));
      let highest = 0,
        reached = false;
      for (let i = 0; i < 360; i++) {
        f.step();
        const p = f.player.getPosition();
        highest = Math.max(highest, p.y);
        if (highest > 46.8 && p.y < 27 && p.x > 1 && p.z > 4) {
          reached = true;
          break;
        }
      }
      expect(highest).toBeGreaterThan(46.8);
      expect(reached).toBe(true);
    } finally {
      f.dispose();
    }
  });
  it("sinks an occupied column, restores it after departure, and resets its anchored reward", async () => {
    const f = await fixture(4);
    try {
      const obj = stages[4].objects.find((o) =>
          o.id.endsWith("sinking-column-1"),
        )!,
        column = f.scene.group.getObjectByName("fjord-pontoon")!;
      const groups: THREE.Object3D[] = [];
      f.scene.group.traverse((n) => {
        if (n.name === "fjord-pontoon") groups.push(n);
      });
      const owner = groups.find(
        (n) => Math.abs(n.position.x - obj.position.x) < 0.1,
      )!;
      const coin = f.scene.collectibles.find(
        (c) => Math.abs(c.position.x - obj.position.x) < 0.1,
      )!;
      const y = coin.position.y;
      expect(column).toBeTruthy();
      f.player.teleportTo(obj.position.x, 25.9, obj.position.z);
      for (let i = 0; i < 80; i++) f.step();
      expect(owner.position.y).toBeLessThan(24.8);
      expect(coin.position.y).toBeLessThan(y - 0.2);
      f.player.teleportTo(-64, 26, 0);
      for (let i = 0; i < 100; i++) f.step();
      expect(owner.position.y).toBeCloseTo(25, 1);
      f.scene.reset!();
      expect(coin.baseY).toBeCloseTo(y, 2);
    } finally {
      f.dispose();
    }
  });
  it("rotates three native open pipes, pauses and restores all actor poses", async () => {
    const f = await fixture(9);
    try {
      const pipes: THREE.Object3D[] = [];
      f.scene.group.traverse((n) => {
        if (n.name === "fjord-pipe") pipes.push(n);
      });
      expect(pipes).toHaveLength(3);
      for (let i = 0; i < 120; i++) f.step();
      expect(pipes.every((p) => Math.abs(p.rotation.x) > 1)).toBe(true);
      f.scene.norway!.stop();
      const angle = pipes[0].rotation.x;
      f.step();
      expect(pipes[0].rotation.x).toBe(angle);
      f.scene.reset!();
      expect(pipes.every((p) => p.rotation.x === 0)).toBe(true);
    } finally {
      f.dispose();
    }
  });
});
