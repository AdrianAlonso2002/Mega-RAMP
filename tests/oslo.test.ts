import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { WORLD_08_LEVEL_03_STAGES as stages } from "../src/levels/world-08/level-03-stages";
import {
  OSLO_BUDGETS,
  OSLO_DECORATIONS,
  OSLO_NAMES,
} from "../src/levels/world-08/OsloRoutes";
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

describe("Oslo: ten authored Ultra Heaven adaptations", () => {
  it("removes the duplicate visible floor at pointy-road corners without changing native support", async () => {
    const f = await fixture(7);
    try {
      const hits = new THREE.Raycaster(
        new THREE.Vector3(43.3, 27, 11.5),
        new THREE.Vector3(0, -1, 0),
      )
        .intersectObjects(f.scene.collidableMeshes, false)
        .filter((h) => Math.abs(h.point.y - 25) < 0.0001);
      expect(hits).toHaveLength(1);
      f.player.teleportTo(43.3, 25.9, 11.5);
      for (let i = 0; i < 60; i++) f.step();
      expect(f.player.getPosition().y).toBeGreaterThan(25.5);
    } finally {
      f.dispose();
    }
  });
  it("keeps every skyline mountain away from spawn, goals and the full ferry track", () => {
    for (const stage of Object.values(stages)) {
      const probes = [
        stage.spawn,
        ...stage.objects
          .filter((o) => o.type === "goal")
          .map((o) => o.position),
      ];
      for (const o of stage.objects)
        if (o.properties?.norwayAction === "ferry")
          probes.push(
            ...(o.properties.points as { x: number; y: number; z: number }[]),
          );
      for (const o of stage.objects.filter(
        (o) => o.properties?.subType === "norway_mountain",
      )) {
        const model = createNorwayModel(o)!;
        try {
          const bounds = new THREE.Box3()
            .setFromObject(model.group)
            .expandByScalar(3);
          for (const p of probes)
            expect(
              bounds.containsPoint(new THREE.Vector3(p.x, p.y, p.z)),
              o.id,
            ).toBe(false);
        } finally {
          disposeStageResources(model.group);
        }
      }
    }
  });
  it("can jump through both uphill fortress apertures while staying on the authored route", async () => {
    const f = await fixture(10);
    try {
      for (let index = 0; index < 2; index++) {
        f.scene.reset!();
        const gate = stages[10].objects.find((o) =>
            o.id.endsWith(`fortress-uphill-gate-${index}`),
          )!,
          pad = stages[10].objects.find((o) =>
            o.id.endsWith(`fortress-uphill-hop-${index}`),
          )!,
          target = pad.properties!.target as {
            x: number;
            y: number;
            z: number;
          };
        f.player.teleportTo(
          pad.position.x,
          pad.position.y + 0.85,
          pad.position.z,
        );
        f.player.setLinearVelocity(v(0, 0, 0));
        let passed = false;
        const dx = target.x - pad.position.x,
          dz = target.z - pad.position.z,
          d = Math.hypot(dx, dz);
        for (let i = 0; i < 100; i++) {
          f.step();
          const p = f.player.getPosition();
          if (
            ((p.x - gate.position.x) * dx) / d +
              ((p.z - gate.position.z) * dz) / d >
            1
          ) {
            passed = true;
            break;
          }
        }
        expect(passed, gate.id).toBe(true);
      }
    } finally {
      f.dispose();
    }
  });
  it("crosses the complete diagonal square section with native ball-floor collisions", async () => {
    const f = await fixture(4);
    try {
      const targets = stages[4].objects
        .filter((o) => o.id.includes("diagonal-square-"))
        .map((o) => o.position);
      f.player.teleportTo(targets[0].x, targets[0].y + 0.85, targets[0].z);
      let index = 1;
      for (let frame = 0; frame < 6000 && index < targets.length; frame++) {
        const p = f.player.getPosition(),
          t = targets[index],
          dx = t.x - p.x,
          dz = t.z - p.z,
          d = Math.hypot(dx, dz);
        if (d < 0.4) {
          index++;
          continue;
        }
        f.player.setLinearVelocity({
          x: (dx / d) * 3.5,
          y: f.player.linvel().y,
          z: (dz / d) * 3.5,
        });
        f.step();
        if (p.y < 23) break;
      }
      expect(index).toBe(targets.length);
    } finally {
      f.dispose();
    }
  });
  it("chains the pointy island jumps and can ascend the entire studded ski ramp", async () => {
    const f = await fixture(7);
    try {
      f.player.teleportTo(-25, 25.85, -23);
      f.player.setLinearVelocity(v(0, 0, 0));
      let landed = false;
      for (let i = 0; i < 360; i++) {
        f.step();
        const p = f.player.getPosition();
        if (p.x < -72 && p.y > 25) {
          landed = true;
          break;
        }
        if (p.y < 24) break;
      }
      expect(landed).toBe(true);
      f.scene.reset!();
      f.player.teleportTo(-82, 25.85, -10);
      f.player.setLinearVelocity(v(0, 0, 4));
      for (let i = 0; i < 500; i++) {
        f.step(1 / 60, { horizontal: 0, vertical: -1 });
        if (f.player.getPosition().z > 52) break;
      }
      expect(f.player.getPosition().z).toBeGreaterThan(52);
      expect(f.player.getPosition().y).toBeGreaterThan(39);
    } finally {
      f.dispose();
    }
  });
  it("carries a resting ball around the first orbital platform until the transfer window", async () => {
    const f = await fixture(9);
    try {
      f.player.teleportTo(-57, 24.85, 0);
      f.player.setLinearVelocity(v(0, 0, 0));
      for (let i = 0; i < 460; i++) {
        f.step();
        if (f.player.getPosition().y < 23) break;
      }
      const p = f.player.getPosition();
      expect(p.y).toBeGreaterThan(24.4);
      expect(p.x).toBeGreaterThan(-27);
    } finally {
      f.dispose();
    }
  });
  it("can walk from the harbor ring along a rotating spoke into the central goal", async () => {
    const f = await fixture(8);
    try {
      f.player.teleportTo(36, 24.85, 0);
      f.player.setLinearVelocity(v(0, 0, 0));
      let reached = false;
      for (let i = 0; i < 900; i++) {
        const p = f.player.getPosition(),
          d = Math.hypot(p.x, p.z),
          omega = 0.35;
        f.player.setLinearVelocity({
          x: omega * p.z - (p.x / Math.max(d, 1)) * 3,
          y: f.player.linvel().y,
          z: -omega * p.x - (p.z / Math.max(d, 1)) * 3,
        });
        f.step();
        if (d < 2) {
          reached = true;
          break;
        }
        if (p.y < 23) break;
      }
      expect(reached).toBe(true);
    } finally {
      f.dispose();
    }
  });
  it("registers all stages, names, narrow Correr8 and 100 collectibles without replacing user saves", () => {
    let count = 0;
    for (let n = 1; n <= 10; n++) {
      const data = stages[n];
      expect(data.name).toBe(OSLO_NAMES[n - 1]);
      expect(getBakedStage(8, 3, n)?.name).toBe(data.name);
      const coins = data.objects.filter((o) => o.type === "collectible");
      expect(coins).toHaveLength(OSLO_BUDGETS[n - 1]);
      count += coins.length;
      expect(LevelLoader.getStageCollectiblesCount(8, 3, n)).toBe(coins.length);
      expect(new Set(data.objects.map((o) => o.id)).size).toBe(
        data.objects.length,
      );
      const legacy = {
        ...structuredClone(data),
        properties: {},
        name: "Legacy",
      };
      expect(applyRequestedStageUpdates(legacy, 8, 3, n).name).toBe(data.name);
      const saved = {
        ...structuredClone(data),
        customSaved: true,
        name: "My Oslo",
        properties: {},
      };
      expect(applyRequestedStageUpdates(saved, 8, 3, n).name).toBe("My Oslo");
    }
    expect(count).toBe(100);
    const run = stages[3].objects.find((o) => o.id.endsWith("correr-oslo"))!;
    expect((run.properties!.widths as number[]).every((w) => w === 1.5)).toBe(
      true,
    );
    const prizes = stages[5].objects.filter((o) => o.type === "collectible");
    for (const c of prizes)
      expect(
        prizes.some(
          (o) =>
            Math.abs(o.position.x + c.position.x) < 0.001 &&
            Math.abs(o.position.z + c.position.z) < 0.001,
        ),
      ).toBe(true);
  });
  it("builds finite shared models at every quality and never replaces geometry while animating", () => {
    for (const quality of ["low", "medium", "high"])
      for (const [kind] of OSLO_DECORATIONS) {
        const obj = {
          id: kind,
          type: "decoration" as const,
          position: v(0, 0, 0),
          rotation: v(0, 0, 0),
          scale: v(1, 1, 1),
          properties: {
            subType: `oslo_${kind}`,
            norwayAction: (
              {
                swing: "swing",
                drum: "drum",
                ferry: "ferry",
                spokes: "spin",
                orbit_arm: "spin",
                bridge: "sway",
                rotor: "spin",
                sauna: "steam",
              } as Record<string, string>
            )[kind],
          },
        };
        const model = createNorwayModel(obj, quality)!;
        expect(model).toBeTruthy();
        const geometry = model.meshes.map((m) => m.geometry);
        for (const mesh of model.meshes)
          expect(
            Array.from(mesh.geometry.getAttribute("position").array).every(
              Number.isFinite,
            ),
          ).toBe(true);
        for (const t of [0, 3, 12, 18, 27, 36])
          previewNorwayModel(obj, model.group, t);
        expect(model.meshes.map((m) => m.geometry)).toEqual(geometry);
        disposeStageResources(model.group);
      }
  });
  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])(
    "has supported spawn, goal and prizes and stays stable in stage %i",
    async (stage) => {
      const f = await fixture(stage);
      try {
        const probes = [
            stages[stage].spawn,
            ...stages[stage].objects
              .filter((o) => o.type === "collectible" || o.type === "goal")
              .map((o) => o.position),
          ],
          ray = new THREE.Raycaster();
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
          stages[stage].spawn.y - 6,
        );
      } finally {
        f.dispose();
      }
    },
  );
  it("keeps launch markers on each suspended bridge and lands its first transfer", async () => {
    const f = await fixture(1);
    try {
      const swing = f.scene.group.getObjectByName("oslo-swing")!,
        jump = f.scene.group.children
          .flatMap((n) => n.children)
          .find((n) => n.parent === swing && n.name === "fjord-jump");
      expect(jump).toBeTruthy();
      const local = jump!.position.clone();
      for (let i = 0; i < 180; i++) f.step();
      expect(jump!.position.distanceTo(local)).toBeLessThan(0.001);
      expect(Math.abs(swing.rotation.z)).toBeGreaterThan(0.03);
      f.scene.reset!();
      const pad = stages[1].objects.find((o) =>
        o.id.endsWith("first-transfer"),
      )!;
      f.player.teleportTo(
        pad.position.x,
        pad.position.y + 0.85,
        pad.position.z,
      );
      f.player.setLinearVelocity(v(0, 0, 0));
      f.step();
      expect(f.player.linvel().y).toBeGreaterThan(7);
      for (let i = 0; i < 100; i++) f.step();
      expect(f.player.getPosition().y).toBeGreaterThan(36.7);
    } finally {
      f.dispose();
    }
  });
  it("crosses the lattice drums using physical colliders, including the perpendicular drum", async () => {
    const f = await fixture(6);
    try {
      for (const o of stages[6].objects.filter(
        (o) => o.properties?.subType === "oslo_drum",
      )) {
        f.scene.reset!();
        const transverse = Math.abs(o.rotation.y) > 1,
          dir = new THREE.Vector3(1, 0, 0).applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            o.rotation.y,
          );
        f.player.teleportTo(
          o.position.x - dir.x * 10,
          24.9,
          o.position.z - dir.z * 10,
        );
        f.player.setLinearVelocity(v(0, 0, 0));
        for (let i = 0; i < 115; i++) {
          const p = f.player.getPosition();
          f.player.setLinearVelocity({
            x:
              dir.x * 12 +
              (transverse
                ? THREE.MathUtils.clamp((o.position.x - p.x) * 5, -8, 8)
                : 0),
            y: f.player.linvel().y,
            z:
              dir.z * 12 +
              (!transverse
                ? THREE.MathUtils.clamp((o.position.z - p.z) * 5, -8, 8)
                : 0),
          });
          f.step();
        }
        const end = f.player.getPosition();
        expect(
          (end.x - o.position.x) * dir.x + (end.z - o.position.z) * dir.z,
          o.id,
        ).toBeGreaterThan(9);
        expect(end.y, o.id).toBeGreaterThan(23.4);
      }
    } finally {
      f.dispose();
    }
  });
  it("carries the player to the end of the sauna ferry and launches only at arrival", async () => {
    const f = await fixture(9);
    try {
      f.player.teleportTo(32, 18.9, 42);
      f.player.setLinearVelocity(v(0, 0, 0));
      let reached = false;
      for (let frame = 0; frame < 1350; frame++) {
        f.step();
        const p = f.player.getPosition();
        if (frame < 900) expect(f.player.linvel().y).toBeLessThan(4);
        if (p.z > 156 && p.y > 16) {
          reached = true;
          break;
        }
        if (p.y < 12) break;
      }
      expect(reached).toBe(true);
      f.scene.reset!();
      expect(f.scene.group.getObjectByName("oslo-ferry")!.position.z).toBe(42);
    } finally {
      f.dispose();
    }
  });
  it("allows the intended automatic hop through a circular gate without crossing solid fence geometry", async () => {
    const f = await fixture(10);
    try {
      const p = stages[10].objects.find((o) =>
        o.id.endsWith("fortress-gate-hop-1"),
      )!.position;
      f.player.teleportTo(p.x, p.y + 0.85, p.z);
      f.player.setLinearVelocity(v(0, 0, 0));
      f.step();
      expect(f.player.linvel().y).toBeGreaterThan(4);
      for (let i = 0; i < 70; i++) f.step();
      expect(f.player.getPosition().x).toBeLessThan(42);
      expect(f.player.getPosition().y).toBeGreaterThan(29);
    } finally {
      f.dispose();
    }
  });
});
