import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { WORLD_07_LEVEL_01_STAGES as stages } from "../src/levels/world-07/level-01-stages";
import {
  KYOTO_BUDGETS,
  KYOTO_DECORATIONS,
  KYOTO_NAMES,
} from "../src/levels/world-07/KyotoRoutes";
import { createKyotoModel } from "../src/levels/world-07/KyotoModels";
import { getBakedStage } from "../src/levels/BakedStages";
import { LevelLoader } from "../src/levels/LevelLoader";
import { applyRequestedStageUpdates } from "../src/levels/RequestedStageUpdates";
import { getCollectibleBudget } from "../src/levels/CollectibleBalance";
import type { LevelObjectData, Vector3Data } from "../src/levels/LevelTypes";
import { LevelBuilder } from "../src/levels/LevelBuilder";
import { PhysicsWorld } from "../src/physics/PhysicsWorld";
vi.mock("@dimforge/rapier3d-compat", async () => {
  const path = "../node_modules/@dimforge/rapier3d-compat/rapier.es.js";
  return import(path);
});
beforeAll(async () => {
  await RAPIER.init();
});
afterEach(() => vi.unstubAllGlobals());
function dispose(model: NonNullable<ReturnType<typeof createKyotoModel>>) {
  for (const mesh of model.meshes) {
    mesh.geometry.dispose();
    for (const mat of Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material])
      mat.dispose();
  }
}
function storage() {
  const entries = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => entries.get(k) ?? null,
    setItem: (k: string, v: string) => entries.set(k, v),
  });
  return entries;
}
function route(stage: number) {
  return stages[stage].objects.find(
    (o) => o.properties?.subType === "kyoto_path",
  )!;
}
describe("Kioto: ten complete stages with shared visual and physical routes", () => {
  it("registers the authored stages, editor names and exactly 100 prizes with a 20-prize rest stage", async () => {
    storage();
    let total = 0;
    for (let s = 1; s <= 10; s++) {
      const data = await new LevelLoader().loadStage(7, 1, s),
        coins = data.objects.filter((o) => o.type === "collectible");
      expect(data.name).toBe(KYOTO_NAMES[s - 1]);
      expect(getBakedStage(7, 1, s)?.id).toBe(data.id);
      expect(coins).toHaveLength(KYOTO_BUDGETS[s - 1]);
      expect(getCollectibleBudget(7, 1, s)).toBe(coins.length);
      expect(LevelLoader.getStageCollectiblesCount(7, 1, s)).toBe(coins.length);
      expect(new Set(data.objects.map((o) => o.id)).size).toBe(
        data.objects.length,
      );
      expect(data.objects.filter((o) => o.type === "goal")).toHaveLength(1);
      total += coins.length;
    }
    expect(total).toBe(100);
    expect(LevelLoader.getLevelMaxCollectibles(7, 1)).toBe(100);
  });
  it.each(Array.from({ length: 10 }, (_, i) => i + 1))(
    "has a continuous supported centreline, spawn, prizes and goal in E%i",
    (s) => {
      const obj = route(s),
        model = createKyotoModel(obj)!,
        scene = new THREE.Scene();
      scene.add(model.group);
      scene.updateMatrixWorld(true);
      const points = obj.properties!.points as Vector3Data[],
        ray = new THREE.Raycaster(),
        up = new THREE.Vector3(0, -1, 0);
      // Float32 triangle boundaries are tested through the inset spawn/goal below.
      for (let i = 1; i < points.length - 1; i++) {
        const p = points[i];
        ray.set(new THREE.Vector3(p.x, p.y + 0.1, p.z), up);
        const hit = ray.intersectObjects(model.meshes, false)[0];
        expect(hit, `E${s} section ${i}`).toBeDefined();
        // Curved inclined quads can intersect just beyond a Float32 cross-section boundary.
        expect(Math.abs(hit.point.y - p.y)).toBeLessThan(
          s === 3 ? 0.025 : 0.0005,
        );
        if (i)
          expect(
            Math.hypot(p.x - points[i - 1].x, p.z - points[i - 1].z),
          ).toBeLessThan(9);
      }
      for (const p of [
        stages[s].spawn,
        ...stages[s].objects
          .filter((o) => o.type === "goal" || o.type === "collectible")
          .map((o) => o.position),
      ]) {
        ray.set(new THREE.Vector3(p.x, p.y + 0.01, p.z), up);
        const hit = ray.intersectObjects(model.meshes, false)[0];
        expect(hit).toBeDefined();
        expect(p.y - hit.point.y).toBeGreaterThanOrEqual(0.08);
        expect(p.y - hit.point.y).toBeLessThan(1.2);
      }
      dispose(model);
    },
  );
  it("keeps the corkscrew separated vertically and slopes within rollable limits", () => {
    const points = route(2).properties!.points as Vector3Data[];
    expect(points[0].y - points.at(-1)!.y).toBeGreaterThan(50);
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i];
      expect((a.y - b.y) / Math.hypot(a.x - b.x, a.z - b.z)).toBeLessThan(0.3);
      if (i >= 220) expect(points[i - 220].y - b.y).toBeGreaterThan(10);
    }
  });
  it("leaves headroom at every crossing instead of overlapping coplanar track surfaces", () => {
    for (let s = 1; s <= 10; s++) {
      const points = route(s).properties!.points as Vector3Data[];
      for (let i = 0; i < points.length - 1; i++)
        for (let j = i + 25; j < points.length - 1; j++) {
          const a = points[i],
            b = points[i + 1],
            c = points[j],
            d = points[j + 1],
            ax = b.x - a.x,
            az = b.z - a.z,
            bx = d.x - c.x,
            bz = d.z - c.z,
            det = ax * bz - az * bx;
          if (Math.abs(det) < 1e-8) continue;
          const t = ((c.x - a.x) * bz - (c.z - a.z) * bx) / det,
            u = ((c.x - a.x) * az - (c.z - a.z) * ax) / det;
          if (t > 0 && t < 1 && u > 0 && u < 1)
            expect(
              Math.abs(a.y + (b.y - a.y) * t - c.y - (d.y - c.y) * u),
              `E${s} crossing ${i}/${j}`,
            ).toBeGreaterThan(3.5);
        }
    }
  });
  it("builds real triangle colliders and supports a resting ball on every route", () => {
    for (let s = 1; s <= 10; s++) {
      const model = createKyotoModel(route(s))!,
        world = new RAPIER.World({ x: 0, y: -9.81, z: 0 }),
        p = (route(s).properties!.points as Vector3Data[])[20];
      for (const mesh of model.meshes) {
        const g = mesh.geometry,
          positions = g.getAttribute("position"),
          indices = g.index
            ? new Uint32Array(g.index.array)
            : Uint32Array.from({ length: positions.count }, (_, i) => i);
        world.createCollider(
          RAPIER.ColliderDesc.trimesh(
            new Float32Array(positions.array),
            indices,
          )
            .setFriction(0.7)
            .setRestitution(0),
        );
      }
      const body = world.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic().setTranslation(p.x, p.y + 0.76, p.z),
      );
      world.createCollider(
        RAPIER.ColliderDesc.ball(0.75).setRestitution(0),
        body,
      );
      for (let frame = 0; frame < 15; frame++) world.step();
      expect(body.translation().y, `E${s}`).toBeGreaterThan(p.y + 0.5);
      world.free();
      dispose(model);
    }
  });
  it("offers at least ten detailed Japanese editor models and finite opaque geometry in every quality", () => {
    expect(KYOTO_DECORATIONS.length).toBeGreaterThanOrEqual(10);
    for (const [kind] of KYOTO_DECORATIONS)
      for (const quality of ["low", "medium", "high"]) {
        const obj: LevelObjectData = {
            id: "preview",
            type: "decoration",
            position: { x: 1, y: 2, z: 3 },
            rotation: { x: 0, y: 0.3, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            properties: { subType: `kyoto_${kind}` },
          },
          model = createKyotoModel(obj, quality)!;
        expect(model.meshes.length).toBeGreaterThan(0);
        expect(model.meshes.length).toBeLessThanOrEqual(3);
        for (const mesh of model.meshes) {
          expect(
            Array.from(mesh.geometry.getAttribute("position").array).every(
              Number.isFinite,
            ),
          ).toBe(true);
          for (const mat of Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material])
            expect(mat.transparent).toBe(false);
        }
        dispose(model);
      }
  });
  it("refreshes old procedural saves, keeps custom additions, and preserves edits to current stages", async () => {
    const entries = storage(),
      old = structuredClone(stages[3]);
    old.customSaved = true;
    delete old.properties!.kyotoRevision;
    const extra = { ...structuredClone(old.objects[0]), id: "obj-custom-tree" };
    old.objects = [extra];
    entries.set("custom_stage_7_1_3", JSON.stringify(old));
    const loaded = await new LevelLoader().loadStage(7, 1, 3);
    expect(loaded.objects.some((o) => o.id === extra.id)).toBe(true);
    expect(loaded.objects.some((o) => o.id === "w7s13-recorrido")).toBe(true);
    loaded.spawn.x += 1;
    const before = JSON.stringify(loaded);
    expect(JSON.stringify(applyRequestedStageUpdates(loaded, 7, 1, 3))).toBe(
      before,
    );
  });
  it("builds, changes quality and releases complete game scenes with supported spawns and correct goals", async () => {
    const gradient = { addColorStop: () => {} },
      context = new Proxy(
        {},
        {
          get: (_, key) =>
            key === "createLinearGradient" || key === "createRadialGradient"
              ? () => gradient
              : key === "measureText"
                ? () => ({ width: 100 })
                : () => {},
        },
      );
    vi.stubGlobal("document", {
      createElement: () => ({
        width: 128,
        height: 128,
        getContext: () => context,
      }),
    });
    const physics = new PhysicsWorld();
    await physics.waitForReady();
    try {
      for (const data of Object.values(stages)) {
        const scene = new LevelBuilder().build(
          structuredClone(data),
          physics,
          "dragon_ball",
        );
        expect(scene.goal).not.toBeNull();
        expect(scene.collectibles).toHaveLength(KYOTO_BUDGETS[data.stage - 1]);
        expect(scene.collidableMeshes.length).toBeGreaterThan(0);
        const ray = new THREE.Raycaster(
          new THREE.Vector3(data.spawn.x, data.spawn.y, data.spawn.z),
          new THREE.Vector3(0, -1, 0),
        );
        scene.group.updateMatrixWorld(true);
        const hit = ray.intersectObjects(scene.collidableMeshes, false)[0];
        expect(hit, `E${data.stage} spawn`).toBeDefined();
        expect(data.spawn.y - hit.point.y).toBeCloseTo(1.05, 2);
        for (const quality of ["low", "medium", "high"] as const) {
          scene.setQuality?.(quality);
          scene.update(1 / 60, true);
        }
        const passenger = physics.createBallBody(0.75, data.spawn)!;
        for (let frame = 0; frame < 600; frame++) physics.step(1 / 60);
        const settled = passenger.body.translation();
        expect(
          Math.hypot(settled.x - data.spawn.x, settled.z - data.spawn.z),
          `E${data.stage}: idle drift`,
        ).toBeLessThan(0.4);
        expect(settled.y, `E${data.stage}: idle support`).toBeGreaterThan(
          data.spawn.y - 0.5,
        );
        physics.getWorld()!.removeRigidBody(passenger.body);
        scene.reset?.();
        scene.destroy();
      }
    } finally {
      physics.getWorld()?.free();
    }
  }, 20000);
});
