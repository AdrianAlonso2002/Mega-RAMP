import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { WORLD_08_LEVEL_04_STAGES as stages } from "../src/levels/world-08/level-04-stages";
import {
  AURORA_BUDGETS,
  AURORA_DECORATIONS,
  AURORA_NAMES,
} from "../src/levels/world-08/AuroraRoutes";
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

describe("Auroras: final ten stages", () => {
  it("loads ten authored stages with exactly 100 ordered collectibles and preserves user edits", () => {
    expect(Object.keys(stages)).toHaveLength(10);
    let total = 0;
    for (const stage of Object.values(stages)) {
      expect(stage.name).toBe(AURORA_NAMES[stage.stage - 1]);
      expect(getBakedStage(8, 4, stage.stage)?.name).toBe(stage.name);
      expect(new LevelLoader().loadFromJSON(JSON.stringify(stage)).name).toBe(
        stage.name,
      );
      const count = stage.objects.filter(
        (o) => o.type === "collectible",
      ).length;
      total += count;
      expect(count).toBe(AURORA_BUDGETS[stage.stage - 1]);
      expect(new Set(stage.objects.map((o) => o.id)).size).toBe(
        stage.objects.length,
      );
      expect(stage.objects.filter((o) => o.type === "goal")).toHaveLength(1);
      const old = structuredClone(stage);
      delete old.properties!.auroraRevision;
      old.name = "old";
      expect(applyRequestedStageUpdates(old, 8, 4, stage.stage).name).toBe(
        stage.name,
      );
      old.customSaved = true;
      expect(applyRequestedStageUpdates(old, 8, 4, stage.stage).name).toBe(
        "old",
      );
    }
    expect(total).toBe(100);
  });
  it("supports every spawn and goal with actual collision geometry", async () => {
    for (let i = 1; i <= 10; i++) {
      const f = await fixture(i);
      try {
        for (const p of [
          stages[i].spawn,
          stages[i].objects.find((o) => o.type === "goal")!.position,
        ]) {
          const hits = new THREE.Raycaster(
            new THREE.Vector3(p.x, p.y + 2, p.z),
            new THREE.Vector3(0, -1, 0),
          ).intersectObjects(f.scene.collidableMeshes, false);
          expect(
            hits.length,
            `stage ${i} ${JSON.stringify(p)}`,
          ).toBeGreaterThan(0);
          expect(hits[0].distance, `stage ${i}`).toBeLessThan(4);
        }
        for (let n = 0; n < 50; n++) f.step();
        expect(f.player.getPosition().y, `spawn ${i}`).toBeGreaterThan(
          stages[i].spawn.y - 3,
        );
      } finally {
        f.dispose();
      }
    }
  });
  it("keeps decorative landmarks out of physics and all animated geometry finite and reusable", () => {
    documentStub();
    for (const quality of ["low", "medium", "high"])
      for (const stage of Object.values(stages))
        for (const o of stage.objects.filter((o) => o.type === "decoration")) {
          const model = createNorwayModel(o, quality);
          expect(model, o.id).not.toBeNull();
          if (!model) continue;
          const geometry = model.meshes.map((m) => m.geometry);
          for (const t of [0, 0.6, 2, 7, 15])
            previewNorwayModel(o, model.group, t);
          expect(model.meshes.map((m) => m.geometry)).toEqual(geometry);
          for (const mesh of model.meshes)
            expect(
              Array.from(mesh.geometry.attributes.position.array).every(
                Number.isFinite,
              ),
              o.id,
            ).toBe(true);
          disposeStageResources(model.group);
        }
    expect(AURORA_DECORATIONS.length).toBeGreaterThan(10);
  });
  it("ascends all four shallow stairs without a jump or teleport", async () => {
    const f = await fixture(1);
    try {
      for (let i = 0; i < 1800 && f.player.getPosition().x < 39; i++) {
        f.player.setLinearVelocity(v(5, f.player.linvel().y, 0));
        f.step();
      }
      expect(f.player.getPosition().x).toBeGreaterThan(38);
      expect(f.player.getPosition().y).toBeGreaterThan(25.7);
    } finally {
      f.dispose();
    }
  });
  it("launches and lands the four progressively narrower skyscraper transfers", async () => {
    const f = await fixture(3);
    try {
      const pads = stages[3].objects.filter(
        (o) => o.properties?.norwayAction === "jump",
      );
      for (const pad of pads) {
        f.scene.reset!();
        const target = pad.properties!.target as {
          x: number;
          y: number;
          z: number;
        };
        f.player.teleportTo(
          pad.position.x,
          pad.position.y + 0.9,
          pad.position.z,
        );
        f.player.setLinearVelocity(v(0, 0, 0));
        let landed = false;
        for (let i = 0; i < 160; i++) {
          f.step();
          const p = f.player.getPosition();
          if (
            p.x > target.x - 1 &&
            p.x < target.x + 8 &&
            Math.abs(p.y - target.y - 0.8) < 1 &&
            f.player.linvel().y < 1
          ) {
            landed = true;
            break;
          }
          if (i > 20 && p.y < target.y - 3) break;
        }
        expect(landed, pad.id).toBe(true);
      }
    } finally {
      f.dispose();
    }
  });
  it("keeps the complete final spiral walkable beneath its elevated approach", async () => {
    const f = await fixture(10);
    try {
      const points = stages[10].objects.find((o) =>
        o.id.endsWith("starlight-descending-spiral"),
      )!.properties!.points as { x: number; y: number; z: number }[];
      f.player.teleportTo(points[1].x, points[1].y + 0.85, points[1].z);
      let index = 3;
      for (let i = 0; i < 12000 && index < points.length - 3; i++) {
        const p = f.player.getPosition(),
          t = points[index],
          dx = t.x - p.x,
          dz = t.z - p.z,
          d = Math.hypot(dx, dz);
        if (d < 0.45) {
          index = Math.min(index + 2, points.length - 2);
          continue;
        }
        f.player.setLinearVelocity(
          v((dx / d) * 4, f.player.linvel().y, (dz / d) * 4),
        );
        f.step();
        if (p.y < t.y - 2) break;
      }
      expect(index).toBeGreaterThan(points.length - 8);
      expect(f.player.getPosition().y).toBeGreaterThan(15.4);
    } finally {
      f.dispose();
    }
  });
  it("makes the upright bypass orbit both above and below its fixed frame and resets its prizes", async () => {
    const f = await fixture(6);
    try {
      const deck = f.scene.group.getObjectByName("aurora-bypass")!,
        frame = deck.getObjectByName("bypass-frame")!,
        before = frame.getWorldPosition(new THREE.Vector3());
      f.scene.norway!.update(4.6, f.player);
      expect(deck.position.y).toBeGreaterThan(38);
      expect(
        frame.getWorldPosition(new THREE.Vector3()).distanceTo(before),
      ).toBeLessThan(0.001);
      f.scene.reset!();
      expect(deck.position.y).toBeCloseTo(29);
    } finally {
      f.dispose();
    }
  });
  it("lets the resting pendulum support the player while the other swings away", async () => {
    const f = await fixture(8);
    try {
      f.player.teleportTo(-18, 24.9, 1.05);
      f.player.setLinearVelocity(v(0, 0, 0));
      for (let i = 0; i < 95; i++) f.step();
      expect(f.player.getPosition().y).toBeGreaterThan(24.5);
      const decks: THREE.Object3D[] = [];
      f.scene.group.traverse((o) => {
        if (o.name === "aurora-pendulum") decks.push(o);
      });
      expect(Math.abs(decks[0].rotation.x)).toBeGreaterThan(0.3);
      expect(Math.abs(decks[1].rotation.x)).toBeLessThan(0.01);
      f.scene.norway!.stop();
      const old = decks[0].rotation.x;
      f.scene.norway!.update(0.5, f.player);
      expect(decks[0].rotation.x).toBe(old);
      f.scene.reset!();
      expect(Math.abs(decks[0].rotation.x)).toBeLessThan(0.01);
    } finally {
      f.dispose();
    }
  });
  it("carries a resting player with the first real gear instead of a visual-only rotation", async () => {
    const f = await fixture(9);
    try {
      f.player.teleportTo(0, 24.9, 16);
      f.player.setLinearVelocity(v(0, 0, 0));
      for (let i = 0; i < 120; i++) f.step();
      expect(f.player.getPosition().x).toBeGreaterThan(2);
      expect(f.player.getPosition().y).toBeGreaterThan(24.5);
    } finally {
      f.dispose();
    }
  });
});

it("lands on each real helix segment after its automatic gap jump", async () => {
  const f = await fixture(2);
  try {
    for (const pad of stages[2].objects.filter(
      (o) => o.properties?.norwayAction === "jump",
    )) {
      f.scene.reset!();
      const target = pad.properties!.target as {
        x: number;
        y: number;
        z: number;
      };
      f.player.teleportTo(pad.position.x, pad.position.y + 0.9, pad.position.z);
      f.player.setLinearVelocity(v(0, 0, 0));
      let landed = false;
      for (let i = 0; i < 100; i++) {
        f.step();
        const p = f.player.getPosition();
        if (
          i > 15 &&
          Math.hypot(p.x - target.x, p.z - target.z) < 2 &&
          p.y > target.y + 0.4 &&
          p.y < target.y + 1.6 &&
          f.player.linvel().y < 1
        ) {
          landed = true;
          break;
        }
        if (i > 20 && p.y < target.y - 2) break;
      }
      expect(landed, pad.id).toBe(true);
    }
  } finally {
    f.dispose();
  }
});
it("carries the player on the lower arc of a moving bypass carriage", async () => {
  const f = await fixture(6);
  try {
    f.player.teleportTo(0, 24.9, 0);
    f.player.setLinearVelocity(v(0, 0, 0));
    for (let i = 0; i < 85; i++) f.step();
    const deck = f.scene.group.getObjectByName("aurora-bypass")!,
      p = deck.worldToLocal(f.player.getPosition().clone());
    expect(Math.abs(p.z)).toBeLessThan(1.8);
    expect(p.y).toBeGreaterThan(-4.4);
    expect(p.y).toBeLessThan(-3.5);
  } finally {
    f.dispose();
  }
});
it("crosses every gear contact without falling through intersecting teeth", async () => {
  const f = await fixture(9);
  try {
    const gears = stages[9].objects.filter(
      (o) => o.properties?.subType === "aurora_gear",
    );
    for (let j = 0; j < 4; j++) {
      f.scene.reset!();
      const a = gears[j],
        b = gears[j + 1],
        r = Number(a.properties!.radius),
        x = a.position.x + r - 1.6;
      f.player.teleportTo(x, a.position.y + 0.9, 0);
      f.player.setLinearVelocity(v(0, 0, 0));
      for (let i = 0; i < 90; i++) {
        const p = f.player.getPosition();
        f.player.setLinearVelocity(v(3.5, f.player.linvel().y, -p.z * 4));
        f.step();
        if (p.x > b.position.x - Number(b.properties!.radius) + 1.2) break;
      }
      expect(f.player.getPosition().x, a.id).toBeGreaterThan(
        b.position.x - Number(b.properties!.radius) + 0.8,
      );
      expect(f.player.getPosition().y).toBeGreaterThan(24.5);
    }
  } finally {
    f.dispose();
  }
});
it("traverses every sharp turn and the raised exit of Road to Nowhere", async () => {
  const f = await fixture(7);
  try {
    const points = stages[7].objects.find((o) =>
      o.id.endsWith("road-to-nowhere"),
    )!.properties!.points as { x: number; y: number; z: number }[];
    f.player.teleportTo(points[1].x, points[1].y + 0.85, points[1].z);
    let index = 3;
    for (let i = 0; i < 13000 && index < points.length - 3; i++) {
      const p = f.player.getPosition(),
        t = points[index],
        dx = t.x - p.x,
        dz = t.z - p.z,
        d = Math.hypot(dx, dz);
      if (d < 0.35) {
        index = Math.min(index + 1, points.length - 2);
        continue;
      }
      f.player.setLinearVelocity(
        v((dx / d) * 3.5, f.player.linvel().y, (dz / d) * 3.5),
      );
      f.step();
      if (p.y < t.y - 2) break;
    }
    expect(index).toBeGreaterThan(points.length - 7);
    expect(f.player.getPosition().y).toBeGreaterThan(34.4);
  } finally {
    f.dispose();
  }
});
it("allows a timed native transfer between neighboring orbital decks", async () => {
  const f = await fixture(6);
  try {
    for (let j = 0; j < 4; j++) {
      f.scene.reset!();
      const time = (Math.PI * 2 - 0.275 - j * 0.55) / 0.68 - 0.15;
      f.scene.norway!.update(time, f.player);
      f.physics.step(1 / 60);
      const a = stages[6].objects.find((o) =>
          o.id.endsWith(`rotary-bypass-${j}`),
        )!,
        startX = a.position.x + 5.6;
      const phase = time * 0.68 + j * 0.55,
        z = 5 * Math.sin(phase),
        y = 29 - 5 * Math.cos(phase);
      f.player.teleportTo(startX, y + 0.9, z + 1.2);
      f.player.setLinearVelocity(v(0, 0, 0));
      for (let i = 0; i < 35; i++) {
        const p = f.player.getPosition(),
          nextPhase = f.scene.norway!.elapsed * 0.68 + (j + 1) * 0.55,
          nextZ = 5 * Math.sin(nextPhase);
        f.player.setLinearVelocity(
          v(
            7,
            f.player.linvel().y,
            Math.max(-7, Math.min(7, (nextZ - p.z) * 5)),
          ),
        );
        f.step();
      }
      const p = f.player.getPosition();
      expect(p.x).toBeGreaterThan(startX + 3);
      expect(p.y).toBeGreaterThan(24);
    }
  } finally {
    f.dispose();
  }
});
it("permits switching past the central pendulum supports during the alternate rest windows", async () => {
  const f = await fixture(8);
  try {
    // Advance through the central supports on the resting right-hand deck.
    f.player.teleportTo(-5, 24.9, 1.05);
    f.player.setLinearVelocity(v(0, 0, 0));
    for (let i = 0; i < 75; i++) {
      const p = f.player.getPosition(),
        targetZ = p.x < 1.4 ? 0 : 1.05;
      f.player.setLinearVelocity(
        v(6, f.player.linvel().y, (targetZ - p.z) * 8),
      );
      f.step();
    }
    expect(f.player.getPosition().x).toBeGreaterThan(2);
    expect(f.player.getPosition().y).toBeGreaterThan(24.5);
    // As the other deck returns, the small lateral gap is rollable without a jump.
    for (let i = 0; i < 40; i++) {
      f.player.setLinearVelocity(v(0, f.player.linvel().y, 0));
      f.step();
    }
    for (let i = 0; i < 20; i++) {
      f.player.setLinearVelocity(v(0, f.player.linvel().y, -6));
      f.step();
    }
    expect(f.player.getPosition().z).toBeLessThan(-0.5);
    expect(f.player.getPosition().y).toBeGreaterThan(23.9);
  } finally {
    f.dispose();
  }
});
