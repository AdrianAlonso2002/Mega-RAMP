import { beforeAll, afterAll, describe, it, expect, vi } from "vitest";
import * as THREE from "three";
import type { LevelData, LevelObjectData } from "../src/levels/LevelTypes";
import { LevelBuilder } from "../src/levels/LevelBuilder";
import { PhysicsWorld } from "../src/physics/PhysicsWorld";
import { SpriteTextures } from "../src/rendering/SpriteTextures";
import { decorationHasCollision } from "../src/levels/DecorationCollision";
import { DecorationBodies } from "../src/levels/DecorationBodies";
vi.mock("@dimforge/rapier3d-compat", async () => {
  const path = "../node_modules/@dimforge/rapier3d-compat/rapier.es.js";
  return import(path);
});
beforeAll(() => {
  vi.spyOn(SpriteTextures, "getCharacterTexture").mockReturnValue(
    new THREE.Texture(),
  );
  vi.spyOn(SpriteTextures, "getSphereTexture").mockReturnValue(
    new THREE.CanvasTexture({ width: 1, height: 1 } as HTMLCanvasElement),
  );
  const gradient = { addColorStop: () => {} },
    context = new Proxy(
      {},
      {
        get: (_t, k) =>
          k === "createLinearGradient" || k === "createRadialGradient"
            ? () => gradient
            : k === "measureText"
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
});
afterAll(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function stage(world: number, object: LevelObjectData): LevelData {
  return {
    id: "collision-test",
    world,
    level: 1,
    stage: 1,
    name: "Collision test",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 100,
    spawn: { x: 10, y: 5, z: 10 },
    objects: [object],
  } as LevelData;
}
function object(subType: string, hasCollision?: boolean): LevelObjectData {
  return {
    id: "decoration-test",
    type: "decoration",
    position: { x: 3, y: 2, z: -4 },
    rotation: { x: 0, y: 0.37, z: 0 },
    scale: { x: 1.3, y: 1.2, z: 0.9 },
    properties: {
      subType,
      ...(hasCollision === undefined ? {} : { hasCollision }),
    },
  };
}
describe("decoration collision editor contract", () => {
  it("keeps a disabled train non-solid even if its controller re-enables doors", async () => {
    const physics = new PhysicsWorld(); await physics.waitForReady();
    const model = object("london_train", false);
    model.properties!.londonAction = "train";
    const scene = new LevelBuilder().build(stage(6, model), physics, "dragon_ball"), world = physics.getWorld()!;
    try {
      let count = 0;
      scene.reset!();
      world.forEachCollider(c => { count++; c.setEnabled(true); expect(c.collisionGroups()).toBe(0); expect(c.solverGroups()).toBe(0); });
      expect(count).toBeGreaterThan(1);
    } finally { scene.destroy(); world.free(); }
  });
  it("moves fallback colliders with animated meshes instead of leaving invisible walls behind", async () => {
    const physics = new PhysicsWorld(); await physics.waitForReady();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(2,2,2));
    const surfaces = new DecorationBodies(physics), world = physics.getWorld()!;
    try {
      surfaces.attach(mesh); mesh.position.set(12,3,4); mesh.rotation.y = .4;
      surfaces.update(); physics.step(1/60);
      world.forEachCollider(c => {
        expect(c.translation().x).toBeCloseTo(12); expect(c.translation().y).toBeCloseTo(3); expect(c.translation().z).toBeCloseTo(4);
      });
    } finally { mesh.geometry.dispose(); world.free(); }
  });
  for (const [world, kind] of [
    [1, "bench"],
    [2, "beach_umbrella"],
    [3, "village_stones"],
    [4, "bench"],
    [5, "asturias_lamp"],
    [5, "asturias_bench"],
    [6, "london_telephone"],
    [7, "kyoto_torii"],
    [8, "norway_path"],
  ] as const) {
    it("honors on/off for world " + world + " " + kind, async () => {
      for (const enabled of [true, false]) {
        const physics = new PhysicsWorld();
        await physics.waitForReady();
        const model = object(kind, enabled);
        if (kind === "norway_path")
          model.properties = {
            ...model.properties,
            points: [
              { x: 0, y: 0, z: 0 },
              { x: 0, y: 0, z: 10 },
            ],
            width: 3,
            widths: [3, 3],
          };
        const scene = new LevelBuilder().build(
            stage(world, model),
            physics,
            "dragon_ball",
          ),
          worldPhysics = physics.getWorld()!;
        try {
          const count = () => {
            let count = 0;
            worldPhysics.forEachCollider((c) => {
              if (c.isEnabled() && c.collisionGroups() !== 0) count++;
            });
            return count;
          };
          if (!enabled) expect(count(), kind).toBe(0);
          if (enabled) expect(count(), kind).toBeGreaterThan(0);
          scene.update(0.1, false);
          scene.reset!();
          scene.update(0.1, false);
          if (!enabled) expect(count(), kind + " after reset").toBe(0);
        } finally {
          scene.destroy();
          worldPhysics.free();
        }
      }
    });
  }
  it("keeps the open space beneath the Asturias bench and respects rotation/scale", async () => {
    const physics = new PhysicsWorld();
    await physics.waitForReady();
    const model = object("asturias_bench", true),
      scene = new LevelBuilder().build(stage(5, model), physics, "dragon_ball"),
      world = physics.getWorld()!;
    try {
      physics.step(1 / 60);
      const { default: RAPIER } = await import("@dimforge/rapier3d-compat");
      const pose = new THREE.Matrix4().compose(
        new THREE.Vector3().copy(model.position),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.37, 0)),
        new THREE.Vector3(1.3, 1.2, 0.9),
      );
      const hits = (x: number, y: number) => {
        const origin = new THREE.Vector3(x, y, 2).applyMatrix4(pose),
          direction = new THREE.Vector3(0, 0, -1).transformDirection(pose);
        return world.castRay(new RAPIER.Ray(origin, direction), 5, true);
      };
      expect(hits(0, 0.3)).toBeNull();
      expect(hits(1.07, 0.3)).not.toBeNull();
      expect(hits(0, 0.65)).not.toBeNull();
    } finally {
      scene.destroy();
      world.free();
    }
  });
  it("shares the same defaults as the editor while explicit choices override them", () => {
    expect(decorationHasCollision(object("bench"))).toBe(true);
    expect(decorationHasCollision(object("asturias_lamp"))).toBe(false);
    expect(decorationHasCollision(object("asturias_lamp", true))).toBe(true);
    expect(decorationHasCollision(object("bench", false))).toBe(false);
  });
});
