import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { WORLD_07_LEVEL_01_STAGES as stages } from "../src/levels/world-07/level-01-stages";
import {
  TEA_PIVOT,
  TEA_TILT_LIMIT,
  teaTilt,
  kitsuneFireActive,
  kitsuneEliminationActive,
  katanaPose,
  KATANA_CUT_TIME,
  KATANA_RETURN_TIME,
  KATANA_CYCLE,
} from "../src/levels/world-07/KyotoRoutes";
import { LevelBuilder } from "../src/levels/LevelBuilder";
import { PhysicsWorld } from "../src/physics/PhysicsWorld";
import { Player } from "../src/player/Player";
import { CHARACTERS } from "../src/player/Characters";
import { SpriteTextures } from "../src/rendering/SpriteTextures";
import { InputManager, type InputAxis } from "../src/input/InputManager";
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
});
afterEach(() => vi.unstubAllGlobals());
async function fixture(stage: number) {
  const gradient = { addColorStop: () => {} },
    ctx = new Proxy(
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
    createElement: () => ({ width: 128, height: 128, getContext: () => ctx }),
  });
  const physics = new PhysicsWorld();
  await physics.waitForReady();
  const scene = new LevelBuilder().build(
      structuredClone(stages[stage]),
      physics,
      "dragon_ball",
    ),
    runtime = scene.kyoto!,
    player = new Player(CHARACTERS[0], physics, scene.spawnPoint),
    camera = new THREE.PerspectiveCamera();
  player.respawn();
  const step = (
    dt = 1 / 60,
    input: InputAxis = { horizontal: 0, vertical: 0 },
  ) => {
    runtime.update(dt, player, input);
    player.update(dt, input, camera);
    scene.update(dt, false, player.getPosition(), player);
    physics.step(dt);
  };
  const dispose = () => {
    player.destroy();
    scene.destroy();
    physics.getWorld()?.free();
  };
  return { scene, runtime, player, physics, step, dispose };
}
describe("Kioto: additional physical challenges", () => {
  it("alternates the four bamboo turns high/low/high/low without abrupt steps", () => {
    const points = stages[3].objects.find(
      (o) => o.properties?.subType === "kyoto_path",
    )!.properties!.points as THREE.Vector3[];
    const nearest = (x: number, z: number) =>
      points.reduce((best, p) =>
        (p.x - x) ** 2 + (p.z - z) ** 2 < (best.x - x) ** 2 + (best.z - z) ** 2
          ? p
          : best,
      );
    const heights = [
      nearest(-22, -27).y,
      nearest(-7, 26).y,
      nearest(8, -26).y,
      nearest(28, 26).y,
    ];
    expect(heights[0] - heights[1]).toBeGreaterThan(5);
    expect(heights[2] - heights[1]).toBeGreaterThan(6);
    expect(heights[2] - heights[3]).toBeGreaterThan(7);
    for (let i = 1; i < points.length; i++)
      expect(Math.abs(points[i].y - points[i - 1].y)).toBeLessThan(0.3);
  });
  it("distributes cherry bumpers and progressively narrows the spiral from double to half its previous width", () => {
    const bumpers = stages[4].objects.filter((o) => o.type === "bumper");
    expect(bumpers.length).toBeGreaterThanOrEqual(20);
    const route = stages[8].objects.find(
        (o) => o.properties?.subType === "kyoto_path",
      )!,
      widths = route.properties!.widths as number[];
    const points = route.properties!.points as { x: number }[],
      start = points.findIndex((p) => p.x <= 27);
    expect(widths[start]).toBeCloseTo(2.7);
    expect(widths.at(-1)).toBeCloseTo(0.675);
    for (let i = start + 1; i < widths.length; i++)
      expect(widths[i]).toBeLessThanOrEqual(widths[i - 1]);
    const middle = Math.floor((start + widths.length - 5) / 2);
    expect(widths[middle]).toBeCloseTo(1.6875, 2);
    expect(
      stages[9].objects.filter((o) => o.properties?.kyotoAction === "katana"),
    ).toHaveLength(6);
  });
  it("tilts smoothly and holds each side for exactly two seconds", () => {
    expect(teaTilt(0)).toBeCloseTo(0);
    for (const t of [4, 4.5, 5, 5.999])
      expect(teaTilt(t)).toBeCloseTo(TEA_TILT_LIMIT);
    for (const t of [14, 14.5, 15, 15.999])
      expect(teaTilt(t)).toBeCloseTo(-TEA_TILT_LIMIT);
    expect(teaTilt(6.01)).toBeLessThan(TEA_TILT_LIMIT);
    expect(teaTilt(16.01)).toBeGreaterThan(-TEA_TILT_LIMIT);
    for (let t = 0; t < 40; t += 0.05) {
      expect(Math.abs(teaTilt(t + 0.05) - teaTilt(t))).toBeLessThan(0.0021);
      expect(teaTilt(t + 20)).toBeCloseTo(teaTilt(t));
    }
  });
  it("keeps the moving road, native collider, prizes and goal aligned, and restores them on reset", async () => {
    const f = await fixture(7);
    try {
      const road = f.scene.group.getObjectByName("kyoto-path")!,
        pivot = new THREE.Vector3(TEA_PIVOT.x, TEA_PIVOT.y, TEA_PIVOT.z);
      for (let i = 0; i < 120; i++) f.step();
      expect(road.rotation.z).toBeCloseTo(teaTilt(2));
      // The same pose drives all native moving road triangles, not a static collision substitute.
      let roadRotation: THREE.Quaternion | undefined;
      f.physics.getWorld()!.forEachRigidBody((b) => {
        if (
          b.isKinematic() &&
          new THREE.Vector3().copy(b.translation()).distanceTo(pivot) < 0.001
        )
          roadRotation = new THREE.Quaternion().copy(b.rotation());
      });
      expect(roadRotation).toBeDefined();
      expect(roadRotation!.angleTo(road.quaternion)).toBeLessThan(0.0001);
      expect(
        f.physics.getGroundContact(f.player.getBody()!, 1.2),
      ).not.toBeNull();
      for (const coin of f.scene.collectibles) {
        const p = new THREE.Vector3(coin.baseX, coin.baseY, coin.baseZ)
          .sub(pivot)
          .applyQuaternion(road.quaternion)
          .add(pivot);
        expect(coin.position.distanceTo(p)).toBeLessThan(0.001);
      }
      const original = stages[7].objects.find((o) => o.type === "goal")!,
        goal = f.scene.goal!,
        expected = new THREE.Vector3(
          original.position.x,
          original.position.y,
          original.position.z,
        )
          .sub(pivot)
          .applyQuaternion(road.quaternion)
          .add(pivot);
      expect(goal.position.distanceTo(expected)).toBeLessThan(0.001);
      expect(goal.quaternion!.angleTo(goal.mesh.quaternion)).toBeLessThan(
        0.001,
      );
      f.scene.reset?.();
      f.physics.step(1 / 60);
      expect(road.rotation.z).toBeCloseTo(0);
      expect(goal.position.y).toBeCloseTo(original.position.y);
    } finally {
      f.dispose();
    }
  });
  it("launches a player struck by an actual sweeping katana and respects a hit cooldown", async () => {
    const f = await fixture(9);
    try {
      const object = stages[9].objects.find(
          (o) => o.properties?.kyotoAction === "katana",
        )!,
        model = f.scene.group.children.find(
          (o) => o.userData.levelObjectId === object.id,
        )!;
      f.runtime.update(0.13, f.player);
      model.updateWorldMatrix(true, true);
      const hit = new THREE.Vector3(-3.5, 0.04, 0).applyMatrix4(
        model.getObjectByName("kyoto-katana-blade")!.matrixWorld,
      );
      f.player.teleportTo(hit.x, hit.y, hit.z);
      f.runtime.update(0.005, f.player);
      const velocity = f.player.linvel();
      expect(velocity.y).toBe(10);
      expect(Math.hypot(velocity.x, velocity.z)).toBeCloseTo(18);
      f.player.setLinearVelocity({ x: 1, y: 2, z: 3 });
      f.runtime.update(0.005, f.player);
      expect(f.player.linvel().y).toBe(2);
    } finally {
      f.dispose();
    }
  });
  it("makes a readable diagonal downstroke while leaving the supporting base fixed", async () => {
    const f = await fixture(9);
    try {
      const object = stages[9].objects.find(
          (o) => o.properties?.kyotoAction === "katana",
        )!,
        model = f.scene.group.children.find(
          (o) => o.userData.levelObjectId === object.id,
        )!,
        blade = model.getObjectByName("kyoto-katana-blade")!,
        basePosition = model.position.clone(),
        baseRotation = model.quaternion.clone();
      let previous = Infinity;
      for (let i = 0; i <= 14; i++) {
        const time = (i * KATANA_CUT_TIME) / 14;
        f.runtime.reset();
        f.runtime.update(time, f.player);
        const tip = new THREE.Vector3(-6, 0.04, 0).applyMatrix4(
          blade.matrixWorld,
        );
        expect(tip.y).toBeLessThanOrEqual(previous + 0.00001);
        previous = tip.y;
        expect(model.position.distanceTo(basePosition)).toBe(0);
        expect(model.quaternion.angleTo(baseRotation)).toBeLessThan(0.000001);
      }
      expect(katanaPose(0, 0).yaw).toBeLessThan(
        katanaPose(KATANA_CUT_TIME, 0).yaw,
      );
      for (const t of [0.2, 0.5, 1.5, KATANA_CYCLE - 0.001]) {
        expect(katanaPose(t, 0).striking).toBe(false);
      }
      for (const t of [0.001, 0.08, 0.15])
        expect(katanaPose(t, 0).striking).toBe(true);
      expect(KATANA_CUT_TIME).toBeLessThan(0.2);
      expect(KATANA_RETURN_TIME).toBe(2);
      expect(katanaPose(KATANA_CUT_TIME + 1, 0).roll).toBeCloseTo(-0.63);
      expect(katanaPose(KATANA_CYCLE, 0).roll).toBeCloseTo(-1.24);
      expect(katanaPose(KATANA_CYCLE + 0.01, 0).striking).toBe(true);
    } finally {
      f.dispose();
    }
  });
  it("still registers the fast downstroke at 30, 60 and 120 frames per second", async () => {
    for (const fps of [30, 60, 120]) {
      const f = await fixture(9);
      try {
        const object = stages[9].objects.find(
            (o) => o.properties?.kyotoAction === "katana",
          )!,
          root = f.scene.group.children.find(
            (o) => o.userData.levelObjectId === object.id,
          )!,
          pose = katanaPose(KATANA_CUT_TIME, 0);
        root.updateWorldMatrix(true, true);
        const endRotation = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(0, pose.yaw, pose.roll, "YXZ"),
        );
        const target = new THREE.Vector3(-3.5, -0.2, 0)
          .applyQuaternion(endRotation)
          .add(new THREE.Vector3(0, 0.98, 0))
          .applyMatrix4(root.matrixWorld);
        f.player.teleportTo(target.x, target.y, target.z);
        let peak = 0;
        for (let frame = 0; frame < Math.ceil(fps * 0.25); frame++) {
          f.step(1 / fps);
          peak = Math.max(peak, f.player.linvel().y);
        }
        expect(peak, `${fps} fps`).toBeGreaterThan(8);
      } finally {
        f.dispose();
      }
    }
  });
  it("opens the actual collision corridor when raised and aligns the collider throughout the cut", async () => {
    const f = await fixture(9);
    try {
      const object = stages[9].objects.find(
          (o) => o.properties?.kyotoAction === "katana",
        )!,
        model = f.scene.group.children.find(
          (o) => o.userData.levelObjectId === object.id,
        )!,
        blade = model.getObjectByName("kyoto-katana-blade")!,
        world = f.physics.getWorld()!;
      const pivot = blade.getWorldPosition(new THREE.Vector3());
      let swordBody: RAPIER.RigidBody | undefined;
      world.forEachRigidBody((body) => {
        if (
          body.isKinematic() &&
          new THREE.Vector3().copy(body.translation()).distanceTo(pivot) < 0.001
        )
          swordBody = body;
      });
      expect(swordBody).toBeDefined();
      const normal = new THREE.Vector3(1, 0, 0).applyQuaternion(
          model.quaternion,
        ),
        tangent = new THREE.Vector3(0, 0, 1).applyQuaternion(model.quaternion),
        probes: THREE.Vector3[] = [];
      for (const across of [-0.8, 0, 0.8])
        for (const along of [-2, 0, 2])
          probes.push(
            model.position
              .clone()
              .addScaledVector(normal, -3.4 + across)
              .addScaledVector(tangent, along)
              .add(new THREE.Vector3(0, 0.78, 0)),
          );
      const blocked = (point: THREE.Vector3) =>
        world.intersectionWithShape(
          point,
          { x: 0, y: 0, z: 0, w: 1 },
          new RAPIER.Ball(0.75),
          undefined,
          undefined,
          undefined,
          f.player.getBody()!,
          (collider) => collider.parent()?.handle === swordBody!.handle,
        ) !== null;
      f.physics.step(1 / 60);
      expect(probes.some(blocked)).toBe(false);
      f.runtime.update(KATANA_CUT_TIME, f.player);
      f.physics.step(1 / 60);
      expect(probes.some(blocked)).toBe(true);
      for (let frame = 0; frame < 120; frame++) {
        f.step();
        const rotation = blade.getWorldQuaternion(new THREE.Quaternion());
        expect(
          new THREE.Quaternion()
            .copy(swordBody!.rotation())
            .normalize()
            .angleTo(rotation.normalize()),
        ).toBeLessThan(0.0001);
        expect(
          new THREE.Vector3()
            .copy(swordBody!.translation())
            .distanceTo(blade.getWorldPosition(new THREE.Vector3())),
        ).toBeLessThan(0.0001);
      }
      expect(probes.some(blocked)).toBe(false);
      f.runtime.reset();
      f.physics.step(1 / 60);
      expect(probes.some(blocked)).toBe(false);
    } finally {
      f.dispose();
    }
  });
  it("runs five normal seconds followed by two blue seconds, repeats and permits input after the warning", async () => {
    for (const t of [0, 4.999, 7, 11.999, 14])
      expect(kitsuneFireActive(t)).toBe(false);
    for (const t of [5, 6.999, 12, 13.999])
      expect(kitsuneFireActive(t)).toBe(true);
    const f = await fixture(10);
    try {
      f.runtime.update(5.01, f.player);
      expect(f.runtime.blueActive).toBe(true);
      const flames: THREE.Object3D[] = [];
      f.scene.group.traverse((o) => {
        if (o.name === "kyoto-blue-fire") flames.push(o);
      });
      expect(flames).toHaveLength(10);
      expect(flames.every((o) => o.visible)).toBe(true);
      f.runtime.update(2, f.player, { horizontal: 1, vertical: 0 });
      expect(f.runtime.blueActive).toBe(false);
      expect(f.runtime.collapsed).toBe(false);
      expect(flames.every((o) => !o.visible)).toBe(true);
      f.runtime.update(5, f.player);
      expect(f.runtime.blueActive).toBe(true);
      expect(f.runtime.collapsed).toBe(false);
    } finally {
      f.dispose();
    }
  });
  it("collapses visibly and physically on any key, causes a real fall, and resets cleanly", async () => {
    const f = await fixture(10);
    try {
      for (let i = 0; i < 20; i++) f.step();
      f.runtime.update(5.2, f.player, {
        horizontal: 0,
        vertical: 0,
        anyKey: true,
      });
      f.scene.update(0);
      expect(f.runtime.collapsed).toBe(true);
      expect(f.scene.group.getObjectByName("kyoto-path")!.visible).toBe(false);
      expect(f.scene.goal!.mesh.visible).toBe(false);
      for (let i = 0; i < 240; i++) {
        f.physics.step(1 / 60);
        f.player.update(
          1 / 60,
          { horizontal: 0, vertical: 0 },
          new THREE.Camera(),
        );
      }
      expect(f.player.getBody()!.translation().y).toBeLessThan(-12);
      f.scene.reset?.();
      f.player.respawn();
      expect(f.runtime.collapsed).toBe(false);
      expect(f.runtime.blueActive).toBe(false);
      expect(f.scene.goal!.mesh.visible).toBe(true);
      for (let i = 0; i < 120; i++) f.step();
      expect(f.player.getBody()!.translation().y).toBeGreaterThan(
        f.scene.spawnPoint.y - 0.5,
      );
    } finally {
      f.dispose();
    }
  });
  it("shows fire for two seconds but gives the first half-second as input grace", async () => {
    for (const t of [5, 5.1, 5.499, 12, 12.499]) {
      expect(kitsuneFireActive(t)).toBe(true);
      expect(kitsuneEliminationActive(t)).toBe(false);
    }
    for (const t of [5.5, 6.999, 12.5, 13.999])
      expect(kitsuneEliminationActive(t)).toBe(true);
    expect(kitsuneEliminationActive(7)).toBe(false);
    const f = await fixture(10);
    try {
      f.runtime.update(5.1, f.player, {
        horizontal: 0,
        vertical: 0,
        anyKey: true,
      });
      expect(f.runtime.blueActive).toBe(true);
      expect(f.runtime.collapsed).toBe(false);
      f.runtime.update(0.39, f.player, { horizontal: 1, vertical: 0 });
      expect(f.runtime.collapsed).toBe(false);
      f.runtime.update(0.02, f.player);
      expect(f.runtime.collapsed).toBe(false);
      f.runtime.update(0.01, f.player, {
        horizontal: 0,
        vertical: 0,
        anyKey: true,
      });
      expect(f.runtime.collapsed).toBe(true);
      f.runtime.reset();
      f.runtime.update(5.49, f.player, { horizontal: 1, vertical: 0 });
      expect(f.runtime.collapsed).toBe(false);
      f.runtime.update(0.02, f.player, { horizontal: 1, vertical: 0 });
      expect(f.runtime.collapsed).toBe(true);
    } finally {
      f.dispose();
    }
  });
  it("recognises a non-movement key and opposing held movement keys", () => {
    const handlers = new Map<string, (event: { code: string }) => void>();
    vi.stubGlobal("window", {
      addEventListener: (
        event: string,
        fn: (event: { code: string }) => void,
      ) => handlers.set(event, fn),
      removeEventListener: () => {},
    });
    const input = new InputManager();
    handlers.get("keydown")!({ code: "KeyQ" });
    expect(input.isAnyKeyPressed()).toBe(true);
    expect(input.isMovementKeyPressed()).toBe(false);
    handlers.get("keyup")!({ code: "KeyQ" });
    expect(input.isAnyKeyPressed()).toBe(false);
    // A complete down/up pair between simulation frames must still count once.
    input.update();
    expect(input.isAnyKeyPressed()).toBe(true);
    input.update();
    expect(input.isAnyKeyPressed()).toBe(false);
    handlers.get("keydown")!({ code: "KeyA" });
    handlers.get("keydown")!({ code: "KeyD" });
    input.update();
    expect(input.getAxis().horizontal).toBe(0);
    expect(input.isAnyKeyPressed()).toBe(true);
    input.destroy();
  });
});
