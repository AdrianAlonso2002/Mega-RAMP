import { TGB_LAUNCH_SPEED } from "../src/levels/world-04/TGBBounceSettings";
import { beforeAll, afterAll, describe, it, expect, vi } from "vitest";
import * as THREE from "three";
import { WORLD_04_LEVEL_04_STAGES } from "../src/levels/world-04/level-04-stages";
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

describe("fixed TGB brioche bounce", () => {
  it("keeps the same impulse and bounded height through eight successive rebounds and hard falls", async () => {
    const source = structuredClone(WORLD_04_LEVEL_04_STAGES[8]),
      burger = source.objects.find(
        (o) => o.properties?.variant === "tgb_burger",
      )!;
    source.objects = [burger];
    const physics = new PhysicsWorld();
    await physics.waitForReady();
    const scene = new LevelBuilder().build(source, physics, "dragon_ball"),
      world = physics.getWorld()!;
    try {
      const top = burger.position.y + burger.scale.y,
        ball = physics.createBallBody(0.75, {
          x: burger.position.x,
          y: top + 0.8,
          z: burger.position.z,
        })!.body,
        position = new THREE.Vector3(),
        launches: number[] = [],
        peaks: number[] = [];
      const player = {
        radius: 0.75,
        getBody: () => ball,
        setLinearVelocity: (v: { x: number; y: number; z: number }) => {
          launches.push(v.y);
          ball.setLinvel(v, true);
        },
      };
      let peak = -Infinity,
        lastCount = 0;
      for (let i = 0; i < 1800 && launches.length < 9; i++) {
        physics.step(1 / 60);
        position.copy(ball.translation());
        scene.update(1 / 60, false, position, player);
        if (launches.length !== lastCount) {
          if (lastCount) peaks.push(peak);
          peak = position.y;
          lastCount = launches.length;
        }
        peak = Math.max(peak, position.y);
      }
      expect(launches.length).toBeGreaterThanOrEqual(8);
      expect(launches.every((v) => v === TGB_LAUNCH_SPEED)).toBe(true);
      expect(Math.max(...peaks) - Math.min(...peaks)).toBeLessThan(0.12);
      expect(Math.max(...peaks) - top).toBeLessThan(8);
      for (const falling of [-15, -40, -65]) {
        scene.reset!();
        ball.setTranslation(
          { x: burger.position.x, y: top + 1, z: burger.position.z },
          true,
        );
        ball.setLinvel({ x: 0, y: falling, z: 0 }, true);
        const count = launches.length;
        for (let i = 0; i < 30 && launches.length === count; i++) {
          physics.step(1 / 60);
          position.copy(ball.translation());
          scene.update(1 / 60, false, position, player);
        }
        expect(launches.length).toBe(count + 1);
        expect(launches.at(-1)).toBe(TGB_LAUNCH_SPEED);
      }
    } finally {
      scene.destroy();
      world.free();
    }
  });
  it("can reach successive burgers and the finishing dock with player steering", async () => {
    const data = structuredClone(WORLD_04_LEVEL_04_STAGES[8]),
      burgers = data.objects.filter(
        (o) => o.properties?.variant === "tgb_burger",
      ),
      goal = data.objects.find((o) => o.type === "goal")!,
      physics = new PhysicsWorld();
    await physics.waitForReady();
    const scene = new LevelBuilder().build(data, physics, "dragon_ball"),
      player = new Player(CHARACTERS[1], physics, data.spawn),
      camera = new THREE.PerspectiveCamera(),
      trace: unknown[] = [];
    let target = 0,
      reached = false;
    try {
      for (let i = 0; i < 2400; i++) {
        physics.step(1 / 60);
        const p = player.getPosition(),
          v = player.linvel(),
          next = burgers[target] ?? goal;
        const motion = player.update(
          1 / 60,
          {
            horizontal: THREE.MathUtils.clamp(
              (next.position.x - p.x) * 0.8 - v.x * 0.25,
              -1,
              1,
            ),
            vertical: THREE.MathUtils.clamp(
              (p.z - next.position.z) * 0.8 + v.z * 0.25,
              -1,
              1,
            ),
          },
          camera,
        );
        const before = player.linvel().y;
        scene.update(1 / 60, false, motion.position, player);
        if (
          before <= 1 &&
          player.linvel().y >= TGB_LAUNCH_SPEED - 0.01 &&
          target < burgers.length
        )
          target++;
        if (i % 60 === 0) trace.push({ p: motion.position.toArray(), target });
        expect(motion.fellOut, JSON.stringify(trace)).toBe(false);
        if (
          motion.position.z < goal.position.z + 3 &&
          motion.position.y > goal.position.y
        ) {
          reached = true;
          break;
        }
      }
      expect(reached, JSON.stringify(trace)).toBe(true);
      expect(target).toBe(4);
    } finally {
      player.destroy();
      scene.destroy();
      physics.getWorld()?.free();
    }
  });
});
