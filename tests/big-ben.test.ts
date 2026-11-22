import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { WORLD_06_LEVEL_04_STAGES as stages } from "../src/levels/world-06/level-04-stages";
import {
  createBigBenModel,
  previewBigBenActor,
} from "../src/levels/world-06/BigBenModels";
import {
  BIG_BEN_DECORATIONS,
  clockTowerRoute,
  chocolateRoute,
  toyPlanePose,
  eyeCabinPose,
  EYE_RIDE_TIME,
  EYE_CABINS,
  clockTrapExtension,
  thamesRoute,
  guardPose,
  towerTraps,
  towerTrapCount,
  TOY_HEIGHT_STEP,
  TOY_LANDING_Y,
  PORTAL_MIN_SPEED,
} from "../src/levels/world-06/BigBenRoutes";
import { getBakedStage } from "../src/levels/BakedStages";
import { LevelLoader } from "../src/levels/LevelLoader";
import { applyRequestedStageUpdates } from "../src/levels/RequestedStageUpdates";
import { LevelBuilder } from "../src/levels/LevelBuilder";
import { PhysicsWorld } from "../src/physics/PhysicsWorld";
import { Player } from "../src/player/Player";
import { CHARACTERS } from "../src/player/Characters";
import { SpriteTextures } from "../src/rendering/SpriteTextures";
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
afterAll(() => vi.restoreAllMocks());
function fakeCanvas() {
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
}
async function fixture(stage: number) {
  fakeCanvas();
  const physics = new PhysicsWorld();
  await physics.waitForReady();
  const scene = new LevelBuilder().build(
    structuredClone(stages[stage]),
    physics,
    "dragon_ball",
  );
  const player = new Player(CHARACTERS[1], physics, stages[stage].spawn);
  player.respawn();
  const camera = new THREE.PerspectiveCamera();
  const step = (x = 0, z = 0) => {
    physics.step(1 / 60);
    const input = { horizontal: x, vertical: z };
    const motion =
      scene.canoe?.update(1 / 60, input, player) ??
      scene.bigben!.update(1 / 60, player, input, camera) ??
      player.update(1 / 60, input, camera);
    scene.update(1 / 60, false);
    return motion;
  };
  const dispose = () => {
    player.destroy();
    scene.destroy();
    physics.getWorld()?.free();
    vi.unstubAllGlobals();
  };
  return { physics, scene, player, step, dispose };
}
describe("Big Ben: definitions, graphics and shared editor assets", () => {
  it("groups guard phases symmetrically and covers a complete lane with each formation", () => {
    for (const t of [0, 0.5, 2, 6, 10]) {
      expect(guardPose(t, 0).z).toBeCloseTo(guardPose(t, 4).z);
      expect(guardPose(t, 1).z).toBeCloseTo(guardPose(t, 3).z);
    }
    expect(guardPose(0, 2).z).not.toBeCloseTo(guardPose(0, 1).z);
    const model = createBigBenModel(
      stages[7].objects.find((o) => o.properties?.benAction === "guard")!,
    )!;
    const width = new THREE.Box3()
      .setFromObject(model.group)
      .getSize(new THREE.Vector3()).x;
    expect(width + 1.5).toBeGreaterThan(6);
  });
  it("narrows the final chocolate loop and the Thames while retaining their central routes", () => {
    const road = stages[6].objects.find((o) => o.id.endsWith("trenza-0"))!,
      widths = road.properties!.widths as number[];
    expect(widths[0]).toBe(3.4);
    expect(widths.at(-1)).toBeCloseTo(2);
    expect(
      stages[8].objects.find((o) => o.id.endsWith("tamesis"))!.properties!
        .width,
    ).toBe(6.2);
  });
  it("increases trap counts by floor and leaves actual wall openings around the complete block", () => {
    expect(Array.from({ length: 12 }, (_, i) => towerTrapCount(i + 1))).toEqual(
      [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5],
    );
    const tower = createBigBenModel(
      stages[10].objects.find((o) => o.id.endsWith("torre"))!,
    )!;
    tower.group.updateWorldMatrix(true, true);
    for (const trap of towerTraps()) {
      const lateral = new THREE.Vector3(trap.direction.z, 0, -trap.direction.x);
      for (const x of [-1.48, 1.48])
        for (const y of [-0.64, 0.64]) {
          const origin = trap.position
            .clone()
            .addScaledVector(trap.direction, -2.0)
            .addScaledVector(lateral, x)
            .add(new THREE.Vector3(0, y, 0));
          expect(
            new THREE.Raycaster(
              origin,
              trap.direction,
              0,
              2.5,
            ).intersectObjects(tower.meshes, false),
            `floor ${trap.floor}, edge ${trap.edge}`,
          ).toHaveLength(0);
        }
    }
  });
  it("keeps adjacent upright cabins separated throughout the full wheel cycle", () => {
    for (let t = 0; t < EYE_RIDE_TIME * 2; t += 0.3)
      for (let i = 0; i < EYE_CABINS; i++) {
        const a = eyeCabinPose(t, i),
          b = eyeCabinPose(t, (i + 1) % EYE_CABINS);
        expect(Math.abs(a.x - b.x) > 5.38 || Math.abs(a.y - b.y) > 4.075).toBe(
          true,
        );
      }
  });
  it("registers all ten stages with one goal, finite transforms and distinct IDs", () => {
    for (let n = 1; n <= 10; n++) {
      expect(getBakedStage(6, 4, n)).toBe(stages[n]);
      expect(stages[n].objects.filter((o) => o.type === "goal")).toHaveLength(
        1,
      );
      expect(new Set(stages[n].objects.map((o) => o.id)).size).toBe(
        stages[n].objects.length,
      );
      for (const o of stages[n].objects)
        for (const value of [
          ...Object.values(o.position),
          ...Object.values(o.rotation),
          ...Object.values(o.scale),
        ])
          expect(Number.isFinite(value)).toBe(true);
    }
    expect(
      stages[5].objects.filter((o) => o.type === "collectible"),
    ).toHaveLength(20);
    expect(
      Object.values(stages).reduce(
        (sum, data) =>
          sum + data.objects.filter((o) => o.type === "collectible").length,
        0,
      ),
    ).toBe(100);
  });
  it("updates old drafts and preserves current editor saves and custom additions", async () => {
    const data = structuredClone(stages[1]),
      custom = { ...structuredClone(data.objects[0]), id: "obj-custom-kept" };
    data.properties = {};
    data.objects = [custom];
    const updated = applyRequestedStageUpdates(data, 6, 4, 1);
    expect(updated.objects).toContainEqual(custom);
    expect(updated.objects.some((o) => o.properties?.number === 9)).toBe(true);
    const current = structuredClone(stages[2]);
    current.customSaved = true;
    current.objects[0].position.x = 17;
    vi.stubGlobal("localStorage", { getItem: () => JSON.stringify(current) });
    try {
      expect(
        (await new LevelLoader().loadStage(6, 4, 2)).objects[0].position.x,
      ).toBe(17);
    } finally {
      vi.unstubAllGlobals();
    }
  });
  it("builds and destroys all ten complete collision scenes and all sixteen editor models", async () => {
    fakeCanvas();
    const physics = new PhysicsWorld();
    await physics.waitForReady();
    try {
      for (const [kind] of BIG_BEN_DECORATIONS) {
        const obj = {
            ...structuredClone(stages[1].objects[0]),
            properties: {
              subType: `bigben_${kind}`,
              direction: { x: 1, y: 0, z: 0 },
            },
          },
          model = createBigBenModel(obj);
        expect(model, kind).not.toBeNull();
        model!.group.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.geometry.computeBoundingSphere();
            expect(
              Number.isFinite(node.geometry.boundingSphere!.radius),
              kind,
            ).toBe(true);
          }
        });
      }
      for (const data of Object.values(stages)) {
        const scene = new LevelBuilder().build(
          structuredClone(data),
          physics,
          "dragon_ball",
        );
        expect(scene.bigben).toBeDefined();
        expect(scene.goal).not.toBeNull();
        if (data.stage === 8) expect(scene.canoe).toBeDefined();
        scene.update(1 / 60, true);
        scene.reset?.();
        scene.destroy();
      }
    } finally {
      physics.getWorld()?.free();
      vi.unstubAllGlobals();
    }
  }, 20000);
  it("has a twelve-floor continuous ascent, flat corner landings and narrower clock levels", () => {
    const route = clockTowerRoute();
    expect(new Set(route.map((n) => n.floor)).size).toBe(12);
    expect(route.at(-1)!.point.y - route[0].point.y).toBeCloseTo(76.8);
    expect(Math.min(...route.map((n) => n.width))).toBe(1.65);
    for (let i = 1; i < route.length; i++) {
      const a = route[i - 1].point,
        b = route[i].point;
      expect(
        Math.abs(b.y - a.y) / Math.hypot(b.x - a.x, b.z - a.z),
      ).toBeLessThan(0.11);
    }
    const obj = stages[10].objects.find((o) => o.id.endsWith("-ascenso"))!,
      model = createBigBenModel(obj)!;
    model.group.updateWorldMatrix(true, true);
    for (let i = 1; i < route.length - 1; i += 9) {
      const p = route[i].point.clone().lerp(route[i + 1].point, 0.5);
      const hit = new THREE.Raycaster(
        p.clone().add(new THREE.Vector3(0, 1, 0)),
        new THREE.Vector3(0, -1, 0),
        0,
        2,
      ).intersectObjects(model.meshes, false);
      expect(hit.length, `tower segment ${i}`).toBeGreaterThan(0);
      expect(hit[0].point.y).toBeCloseTo(p.y, 3);
    }
  });
  it("creates two separate intertwined chocolate routes with real step drops and no large discontinuities", () => {
    for (let lane = 0; lane < 2; lane++) {
      const route = chocolateRoute(lane);
      expect(route[0].y).toBe(64);
      expect(route.at(-1)!.y).toBe(10);
      for (let i = 1; i < route.length; i++) {
        expect(Math.abs(route[i].y - route[i - 1].y)).toBeLessThanOrEqual(0.5);
        expect(route[i].y).toBeLessThanOrEqual(route[i - 1].y);
      }
    }
    expect(chocolateRoute(0)[60].y).not.toBe(chocolateRoute(1)[60].y);
  });
  it("offers synchronized transfers between the three toy planes while their decks stay upright", () => {
    for (const [time, first] of [
      [Math.PI / 0.35, 0],
      [(Math.PI * 2) / 0.35, 1],
    ]) {
      const a = toyPlanePose(time, first).position,
        b = toyPlanePose(time, first + 1).position;
      expect(Math.hypot(a.x - b.x, a.z - b.z)).toBeLessThan(0.001);
      expect(a.y - b.y).toBeCloseTo(TOY_HEIGHT_STEP);
      const models = [first, first + 1].map((index) => {
        const object = stages[2].objects.find(
            (o) =>
              o.properties?.benAction === "plane" &&
              o.properties.index === index,
          )!,
          model = createBigBenModel(object)!;
        previewBigBenActor(object, model.group, time);
        model.group.updateWorldMatrix(true, true);
        return new THREE.Box3().setFromObject(model.meshes[0]);
      });
      expect(models[0].min.y - models[1].max.y).toBeGreaterThan(0.15);
    }
    expect(
      toyPlanePose(0, 2).position.y - 0.21 - TOY_LANDING_Y,
    ).toBeGreaterThan(0.15);
    const obj = stages[2].objects.find(
        (o) => o.properties?.benAction === "plane",
      )!,
      model = createBigBenModel(obj)!;
    for (const t of [0, 1, 5, 10]) {
      previewBigBenActor(obj, model.group, t);
      expect(model.group.rotation.x).toBe(0);
      expect(model.group.rotation.z).toBe(0);
    }
  });
  it("continues turning past the top while supports and cabins stay upright", () => {
    expect(eyeCabinPose(EYE_RIDE_TIME, 0).y).toBeCloseTo(53);
    expect(eyeCabinPose(EYE_RIDE_TIME + 5, 0).y).toBeLessThan(53);
    const obj = stages[9].objects.find(
        (o) => o.properties?.benAction === "wheel",
      )!,
      model = createBigBenModel(obj)!;
    previewBigBenActor(obj, model.group, 10);
    expect(model.group.rotation.z).toBe(0);
    expect(
      model.group.getObjectByName("ben-wheel-rotor")!.rotation.z,
    ).toBeCloseTo(1.4);
  });
  it("gives clock traps three-second cycles with a clear rest and quick extension", () => {
    expect(clockTrapExtension(0, 0)).toBe(0);
    expect(clockTrapExtension(2.4, 0)).toBe(1);
    expect(clockTrapExtension(3.1, 0)).toBe(0);
    for (let i = 0; i < 24; i++)
      expect(clockTrapExtension(1, i)).toBeCloseTo(clockTrapExtension(4, i));
  });
  it("keeps every Thames section continuous and the uphill wave gentle enough to paddle", () => {
    const route = thamesRoute();
    for (let i = 1; i < route.length; i++) {
      const a = route[i - 1],
        b = route[i];
      expect(a.distanceTo(b)).toBeLessThan(1.7);
      expect((b.y - a.y) / Math.hypot(b.x - a.x, b.z - a.z)).toBeLessThan(0.06);
    }
  });
});
describe("Big Ben: real passenger physics and stage mechanisms", () => {
  it("supports landings on cabin roofs and blocks movement through the glass side panels", async () => {
    const f = await fixture(9);
    try {
      f.player.teleportTo(0, 19, 0);
      f.player.setLinearVelocity({ x: 0, y: 0, z: 0 });
      for (let i = 0; i < 240; i++) f.step();
      const pose = eyeCabinPose(f.scene.bigben!.wheelElapsed, 0);
      expect(f.player.getPosition().y - pose.y).toBeCloseTo(4.475, 1);
      const start = eyeCabinPose(f.scene.bigben!.wheelElapsed, 0);
      f.player.teleportTo(start.x, start.y + 0.75, 0);
      f.player.setLinearVelocity({ x: 0, y: 0, z: 0 });
      for (let i = 0; i < 100; i++) f.step(1, 0);
      const current = eyeCabinPose(f.scene.bigben!.wheelElapsed, 0);
      expect(Math.abs(f.player.getPosition().x - current.x)).toBeLessThan(1.85);
      expect(
        Math.abs(f.player.getPosition().y - current.y - 0.75),
      ).toBeLessThan(0.15);
    } finally {
      f.dispose();
    }
  });
  it("boards the Thames canoe and actually carries its passenger down the river", async () => {
    const f = await fixture(8);
    try {
      const start = f.player.getPosition().clone();
      f.step();
      expect(f.player.isInVehicle()).toBe(true);
      for (let i = 0; i < 240; i++) expect(f.step().fellOut).toBe(false);
      expect(f.player.isInVehicle()).toBe(true);
      expect(f.player.getPosition().z).toBeLessThan(start.z - 3);
      expect(f.player.getPosition().y).toBeGreaterThan(45);
    } finally {
      f.dispose();
    }
  });
  it("teleports only through column nine and resets cleanly", async () => {
    const f = await fixture(1);
    try {
      f.player.teleportTo(0, 13, 8);
      f.step();
      expect(f.player.getPosition().x).toBeLessThan(10);
      f.player.teleportTo(0, 13, -66);
      f.player.setLinearVelocity({ x: 0, y: 0, z: -10 });
      for (let i = 0; i < 90; i++) f.step();
      expect(f.player.getPosition().x).toBeLessThan(10);
      expect(f.player.getPosition().z).toBeGreaterThan(-70.5);
      f.scene.reset?.();
      f.player.teleportTo(0, 13, -66);
      f.player.setLinearVelocity({ x: 0, y: 0, z: -24 });
      for (let i = 0; i < 20 && f.player.getPosition().x < 20; i++) f.step();
      expect(f.player.getPosition().x).toBeCloseTo(80);
      expect(f.player.getPosition().z).toBeCloseTo(5);
    } finally {
      f.dispose();
    }
  });
  it("requires a real horizontal speed of at least 50 km/h at the column", async () => {
    const f = await fixture(1);
    try {
      for (const speed of [0, 49.9, 50, 50.1]) {
        f.scene.reset?.();
        f.player.teleportTo(0, 13, -72);
        f.player.setLinearVelocity({ x: 0, y: 0, z: -speed / 3.6 });
        f.scene.bigben!.update(1 / 60, f.player);
        expect(f.player.getPosition().x > 70, `${speed} km/h`).toBe(
          speed / 3.6 >= PORTAL_MIN_SPEED,
        );
      }
    } finally {
      f.dispose();
    }
  });
  it("lowers saved Hamleys planes and goal without replacing unrelated editor changes", () => {
    const saved = structuredClone(stages[2]);
    delete saved.properties!.hamleysRevision;
    saved.objects[0].properties!.customColor = "#123456";
    for (const object of saved.objects)
      if (object.properties?.benAction === "plane") object.position.y = 12;
    const result = applyRequestedStageUpdates(saved, 6, 4, 2);
    expect(result.objects[0].properties!.customColor).toBe("#123456");
    for (const object of result.objects.filter(
      (o) => o.properties?.benAction === "plane",
    ))
      expect(object.position.y).toBeCloseTo(
        toyPlanePose(0, Number(object.properties!.index)).position.y,
      );
    expect(
      result.objects.find((o) => o.type === "goal")!.position.y,
    ).toBeCloseTo(TOY_LANDING_Y + 0.1);
  });
  it("carries a stationary passenger around a full toy-plane orbit without bouncing away", async () => {
    const f = await fixture(2);
    try {
      const plane = stages[2].objects.find(
          (o) => o.properties?.benAction === "plane",
        )!,
        pose = toyPlanePose(0, 0),
        q = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          pose.yaw,
        ),
        p = new THREE.Vector3(3, 0.985, 0)
          .applyQuaternion(q)
          .add(pose.position);
      f.player.teleportTo(p.x, p.y, p.z);
      f.player.setLinearVelocity({ x: 0, y: 0, z: 0 });
      for (let i = 0; i < 1080; i++) f.step();
      const actor = f.scene.group.children.find(
        (o) => o.userData.levelObjectId === plane.id,
      );
      const target = toyPlanePose(18, 0),
        inv = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          -target.yaw,
        ),
        local = f.player
          .getPosition()
          .clone()
          .sub(target.position)
          .applyQuaternion(inv);
      expect(actor ?? f.scene.bigben).toBeDefined();
      expect(local.x).toBeCloseTo(3, 1);
      expect(Math.abs(local.z)).toBeLessThan(0.2);
      expect(local.y).toBeCloseTo(0.985, 1);
    } finally {
      f.dispose();
    }
  });
  it("turns before boarding and carries a stationary passenger through a full uninterrupted orbit", async () => {
    const f = await fixture(9);
    try {
      for (let i = 0; i < 60; i++) f.step();
      expect(f.scene.bigben!.wheelElapsed).toBeCloseTo(1);
      const start = eyeCabinPose(1, 0);
      f.player.teleportTo(start.x, start.y + 0.75, 0);
      f.player.setLinearVelocity({ x: 0, y: 0, z: 0 });
      for (let i = 0; i < Math.ceil(EYE_RIDE_TIME * 2 * 60); i++) {
        expect(f.step().fellOut).toBe(false);
        const expected = eyeCabinPose(f.scene.bigben!.wheelElapsed, 0);
        expect(
          f.player
            .getPosition()
            .distanceTo(expected.add(new THREE.Vector3(0, 0.75, 0))),
          JSON.stringify({
            i,
            p: f.player.getPosition(),
            expected,
            v: f.player.linvel(),
          }),
        ).toBeLessThan(0.25);
      }
      expect(f.scene.bigben!.wheelElapsed).toBeGreaterThan(EYE_RIDE_TIME * 2);
      f.player.teleportTo(0, 13.8, -12);
      f.step();
      expect(f.scene.bigben!.finishRequested).toBe(true);
      f.scene.reset?.();
      expect(f.scene.bigben!.finishRequested).toBe(false);
      expect(f.scene.bigben!.wheelElapsed).toBe(0);
    } finally {
      f.dispose();
    }
  });
  it("matches cockpit, wing and tail collision heights to the actual plane surfaces", async () => {
    const f = await fixture(2);
    try {
      const pose = toyPlanePose(0, 0),
        q = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          pose.yaw,
        );
      f.physics.step(1 / 60);
      for (const [x, z, minHeight, maxHeight] of [
        [0, -1, 1.4, 1.8],
        [3, 0, 0.15, 0.3],
        [0, 3.7, 2, 2.3],
      ]) {
        const origin = new THREE.Vector3(x, 6, z)
          .applyQuaternion(q)
          .add(pose.position);
        const hit = f.physics
          .getWorld()!
          .castRay(
            new RAPIER.Ray(origin, { x: 0, y: -1, z: 0 }),
            8,
            true,
            undefined,
            undefined,
            undefined,
            f.player.getBody()!,
          );
        expect(hit).not.toBeNull();
        const height = 6 - hit!.timeOfImpact;
        expect(height).toBeGreaterThan(minHeight);
        expect(height).toBeLessThan(maxHeight);
      }
    } finally {
      f.dispose();
    }
  });
  it("mounted guards push the ball sideways and upward rather than immediately killing it", async () => {
    const f = await fixture(7);
    try {
      f.player.teleportTo(0, 13.1, guardPose(1 / 60, 2).z);
      f.player.setLinearVelocity({ x: 0, y: 0, z: 0 });
      f.step();
      expect(Math.abs(f.player.linvel().x)).toBeGreaterThan(15);
      expect(f.player.linvel().y).toBeGreaterThan(5);
      expect(f.scene.bigben!.failed).toBe(false);
    } finally {
      f.dispose();
    }
  });
  it("treats the falling hot chocolate as a hazard while leaving both stairways usable", async () => {
    const f = await fixture(6);
    try {
      f.player.teleportTo(0, 20, 1.25);
      expect(f.step().fellOut).toBe(true);
      expect(f.scene.bigben!.failed).toBe(true);
    } finally {
      f.dispose();
    }
  });
});
