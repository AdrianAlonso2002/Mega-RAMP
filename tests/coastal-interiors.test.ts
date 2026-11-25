import { afterAll, beforeAll, describe, it, expect, vi } from "vitest";
import * as THREE from "three";
import {
  coastalShop,
  coastalStall,
  coastalYacht,
  type CoastalCollider,
} from "../src/levels/world-02/CoastalModels";
import { LevelBuilder } from "../src/levels/LevelBuilder";
import { applyRequestedStageUpdates } from "../src/levels/RequestedStageUpdates";
import { WORLD_02_LEVEL_02_STAGES as stages } from "../src/levels/world-02/level-02-stages";
import { disposeStageResources } from "../src/rendering/StageResources";
import { PhysicsWorld } from "../src/physics/PhysicsWorld";
vi.mock("@dimforge/rapier3d-compat", () => {
  const entry = "../node_modules/@dimforge/rapier3d-compat/rapier.es.js";
  return import(entry);
});

beforeAll(() => {
  const ctx = new Proxy(
    {},
    {
      get: (_, key) =>
        key === "createLinearGradient" || key === "createRadialGradient"
          ? () => ({ addColorStop() {} })
          : () => {},
    },
  );
  vi.stubGlobal("document", {
    createElement: () => ({ width: 512, height: 96, getContext: () => ctx }),
  });
});
afterAll(() => vi.unstubAllGlobals());

function reachable(group: THREE.Group, stall = false): boolean {
  const colliders = group.userData.coastalColliders as CoastalCollider[],
    step = 0.1,
    startZ = stall ? 3 : 4,
    goalZ = stall ? -1.1 : -1.85,
    limit = stall ? 1.9 : 2.8;
  // Follow the actual walkable deck, including the stall's small raised finish.
  const floorTop=stall?Math.max(.4,...colliders.filter(c=>c.halfExtents.x>=2.6&&c.halfExtents.z>=2.1&&c.position.y+c.halfExtents.y<.6).map(c=>c.position.y+c.halfExtents.y)):.4;
  const free = (x: number, z: number) =>
    colliders.every(({ position: p, halfExtents: h }) => {
      const dx = Math.max(0, Math.abs(x - p.x) - h.x),
        dy = Math.max(0, Math.abs(floorTop + .75 - p.y) - h.y),
        dz = Math.max(0, Math.abs(z - p.z) - h.z);
      return dx * dx + dy * dy + dz * dz >= 0.75 * 0.75 - 0.00001;
    });
  const queue: [[number, number]] = [[0, 0]],
    seen = new Set(["0,0"]);
  for (let index = 0; index < queue.length; index++) {
    const [ix, iz] = queue[index],
      x = ix * step,
      z = startZ + iz * step;
    if (Math.abs(x) < 0.15 && Math.abs(z - goalZ) < 0.15) return true;
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = ix + dx,
        nz = iz + dz,
        key = `${nx},${nz}`,
        wx = nx * step,
        wz = startZ + nz * step;
      if (
        Math.abs(wx) > limit ||
        wz > startZ ||
        wz < (stall ? -1.25 : -2.65) ||
        seen.has(key) ||
        !free(wx, wz)
      )
        continue;
      seen.add(key);
      queue.push([nx, nz]);
    }
  }
  return false;
}

describe("San Juan casino and searchable interiors", () => {
  it.each(["low", "medium", "high"] as const)(
    "keeps finite detailed models and ball-width entry routes in %s quality",
    (quality) => {
      for (const [kind, factory] of [
        ["shop", () => coastalShop(quality, "jewelry", "#537e8b")],
        ["stall", () => coastalStall(quality, "pottery", "#537e8b", "#f1e7ce")],
        ["yacht", () => coastalYacht(quality, "#ffffff", "#537e8b", "#274357")],
      ] as const) {
        const model = factory();
        model.group.updateMatrixWorld(true);
        model.group.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            const positions = node.geometry.getAttribute("position");
            expect(positions.count).toBeGreaterThan(0);
            for (const n of positions.array)
              expect(Number.isFinite(n)).toBe(true);
          }
        });
        if (kind !== "yacht")
          expect(
            reachable(model.group, kind === "stall"),
            `${kind} must admit the actual 1.5m ball`,
          ).toBe(true);
        disposeStageResources(model.group);
      }
    },
  );
  it("occludes rear prizes from the entrance and from overhead views", () => {
    for (const model of [
      coastalShop("medium", "icecream", "#4e9bab"),
      coastalStall("medium", "fruit", "#be715f", "#eee2c5"),
    ]) {
      model.group.updateMatrixWorld(true);
      const front = new THREE.Raycaster(
        new THREE.Vector3(0, 1.2, 5),
        new THREE.Vector3(0, 0, -1),
        0,
        6,
      );
      expect(
        front.intersectObjects(model.meshes, false).length,
      ).toBeGreaterThan(0);
      const above = new THREE.Raycaster(
        new THREE.Vector3(0, 10, -1.1),
        new THREE.Vector3(0, -1, 0),
        0,
        8,
      );
      expect(
        above.intersectObjects(model.meshes, false).length,
      ).toBeGreaterThan(0);
      disposeStageResources(model.group);
    }
  });
  it("migrates saved stages once, keeps collectible budgets and preserves unrelated editor additions", () => {
    for (const stage of [8, 9]) {
      const data = structuredClone(stages[stage]),
        custom = {
          id: "obj-custom-test",
          type: "decoration" as const,
          position: { x: 50, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
        };
      data.objects.push(custom);
      const count = data.objects.filter((o) => o.type === "collectible").length,
        updated = applyRequestedStageUpdates(data, 2, 2, stage),
        goal = updated.objects.find((o) => o.type === "goal")!;
      expect(updated.objects).toContain(custom);
      expect(
        updated.objects.filter((o) => o.type === "collectible"),
      ).toHaveLength(count);
      expect(goal.properties?.searchHidden).toBe(true);
      expect(
        updated.objects.some((o) => o.properties?.stallType === "goal"),
      ).toBe(false);
      const positions = updated.objects.map((o) => ({ ...o.position }));
      applyRequestedStageUpdates(updated, 2, 2, stage);
      expect(updated.objects.map((o) => o.position)).toEqual(positions);
    }
  });
  it("leaves a true zero-sector hole, with a level rim and half-height solid dividers", () => {
    const model = LevelBuilder.createCasinoRouletteMesh(8, 0.8);
    model.group.updateMatrixWorld(true);
    const ray = new THREE.Raycaster(
      new THREE.Vector3(0, 6, 5),
      new THREE.Vector3(0, -1, 0),
    );
    expect(ray.intersectObjects(model.meshes, false)).toHaveLength(0);
    ray.set(new THREE.Vector3(5, 6, 0), new THREE.Vector3(0, -1, 0));
    expect(ray.intersectObjects(model.meshes, false).length).toBeGreaterThan(0);
    const dividers = model.group.children.filter(
      (n) => n.name === "roulette-divider",
    ) as THREE.Mesh[];
    expect(dividers).toHaveLength(11);
    for (const divider of dividers) {
      expect(model.meshes).toContain(divider);
      expect(
        new THREE.Box3().setFromObject(divider).getSize(new THREE.Vector3()).y,
      ).toBeCloseTo(0.25);
    }
    const rim = model.meshes[1];
    expect(
      new THREE.Box3().setFromObject(rim).getSize(new THREE.Vector3()).y,
    ).toBeCloseTo(0.4);
    disposeStageResources(model.group);
  });
  it("builds and updates all four full stages using real colliders, including the rotating walls", async () => {
    const physics = new PhysicsWorld();
    await physics.waitForReady();
    const builder = new LevelBuilder();
    for (const stage of [7, 8, 9, 10]) {
      const data = applyRequestedStageUpdates(
          structuredClone(stages[stage]),
          2,
          2,
          stage,
        ),
        built = builder.build(data, physics, "pan", "medium");
      expect(physics.getWorld()!.colliders.len()).toBeGreaterThan(10);
      built.update(1 / 60);
      if (stage === 7) {
        const wheel = built.movingPlatforms.find(
          (p) => p.movementType === "casino_roulette",
        )!;
        expect(wheel.body.numColliders()).toBeGreaterThan(22);
        expect(wheel.mesh.quaternion.y).not.toBe(0);
      }
      if (stage === 8 || stage === 9) {
        expect(built.goal!.mesh.userData.searchHidden).toBe(true);
        expect(built.goal!.position.y).toBeCloseTo(.4);
        expect((1.15-built.goal!.position.y)/built.goal!.mesh.scale.y).toBeGreaterThan(.1);
        const store=data.objects.find(obj=>obj.id===(stage===8?'w2s8-shop-6':'w2s9-stall-12'))!;
        const inverse=new THREE.Quaternion().setFromEuler(new THREE.Euler(0,store.rotation.y,0)).invert(),boxes:CoastalCollider[]=[];
        physics.getWorld()!.colliders.forEach(collider=>{
          const half=(collider.shape as {halfExtents?:{x:number;y:number;z:number}}).halfExtents;if(!half)return;
          const q=collider.rotation(),rotation=new THREE.Quaternion(q.x,q.y,q.z,q.w),position=collider.translation(),bounds=new THREE.Box3();
          for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])bounds.expandByPoint(new THREE.Vector3(x*half.x,y*half.y,z*half.z).applyQuaternion(rotation).add(position).sub(new THREE.Vector3().copy(store.position)).applyQuaternion(inverse));
          boxes.push({position:bounds.getCenter(new THREE.Vector3()),halfExtents:bounds.getSize(new THREE.Vector3()).multiplyScalar(.5)});
        });
        const probe=new THREE.Group();probe.userData.coastalColliders=boxes;
        expect(reachable(probe,stage===9),'The real goal posts and room colliders must leave a ball-sized route').toBe(true);
        if(stage===9)expect(new THREE.Box3().setFromObject(built.goal!.mesh).max.y).toBeLessThan(3.74);
      }
      built.destroy();
      expect(physics.getWorld()!.colliders.len()).toBe(0);
    }
    physics.getWorld()!.free();
  });
});
