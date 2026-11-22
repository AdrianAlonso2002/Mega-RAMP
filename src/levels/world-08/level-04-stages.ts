import {registerStageSet} from '../StageRegistry';
import { AURORA_NAMES, AURORA_BUDGETS, AURORA_REVISION } from "./AuroraRoutes";
import type { LevelData, LevelObjectData, Vector3Data } from "../LevelTypes";
import { norwayPath, norwayArc, v } from "./NorwayRoutes";
type Route = ReturnType<typeof norwayPath>;
class Layout {
  objects: LevelObjectData[] = [];
  routes: Route[] = [];
  spawn = v(0, 20, 0);
  end = v(0, 19, -20);
  yaw = 0;
  constructor(readonly stage: number) {}
  add(
    name: string,
    type: LevelObjectData["type"],
    position: Vector3Data,
    scale = v(1, 1, 1),
    properties: Record<string, unknown> = {},
    yaw = 0,
  ) {
    const object: LevelObjectData = {
      id: `w8n4e${this.stage}-${name}`,
      type,
      position,
      scale,
      rotation: v(0, yaw, 0),
      properties,
    };
    this.objects.push(object);
    return object;
  }
  decor(
    name: string,
    kind: string,
    p: Vector3Data,
    properties: Record<string, unknown> = {},
    scale = 1,
    yaw = 0,
  ) {
    return this.add(
      name,
      "decoration",
      p,
      v(scale, scale, scale),
      { subType: `norway_${kind}`, hasCollision: false, ...properties },
      yaw,
    );
  }
  fjord(
    name: string,
    kind: string,
    p: Vector3Data,
    properties: Record<string, unknown> = {},
    scale = 1,
    yaw = 0,
  ) {
    return this.add(
      name,
      "decoration",
      p,
      v(scale, scale, scale),
      { subType: `fjord_${kind}`, hasCollision: false, ...properties },
      yaw,
    );
  }
  aurora(
    name: string,
    kind: string,
    p: Vector3Data,
    properties: Record<string, unknown> = {},
    scale = 1,
    yaw = 0,
  ) {
    return this.add(
      name,
      "decoration",
      p,
      v(scale, scale, scale),
      { subType: `aurora_${kind}`, hasCollision: false, ...properties },
      yaw,
    );
  }
  jump(
    name: string,
    p: Vector3Data,
    target: Vector3Data,
    width = 2,
    launchY = 11,
  ) {
    this.fjord(name, "jump", p, {
      norwayAction: "jump",
      target,
      width,
      length: 2,
      launchY,
    });
  }
  path(
    name: string,
    nodes: Vector3Data[],
    width = 2.5,
    curved = true,
    properties: Record<string, unknown> = {},
  ) {
    const route = norwayPath(nodes, width, curved);
    this.decor(name, "path", v(0, 0, 0), {
      ...route,
      hasCollision: true,
      ...properties,
    });
    this.routes.push(route);
    return route;
  }
  coin(p: Vector3Data, anchor?: string) {
    return this.add(
      `prize-${this.objects.filter((o) => o.type === "collectible").length}`,
      "collectible",
      p,
      v(1, 1, 1),
      anchor ? { norwayAnchor: anchor } : {},
    );
  }
  finish(route: Route) {
    const a = route.points[2],
      b = route.points.at(-3)!;
    this.spawn = v(a.x, a.y + 1.05, a.z);
    this.end = { ...b };
    const next = route.points[5];
    this.yaw = Math.atan2(next.x - a.x, a.z - next.z);
  }
  backdrop() {
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      this.decor(
        `summit-${i}`,
        "mountain",
        v(Math.cos(a) * 175, -50, Math.sin(a) * 155),
        { seed: i },
        1.4 + (i % 3) * 0.35,
        a,
      );
    }
    for (let i = 0; i < 5; i++) {
      this.decor(
        `pine-${i}`,
        "pine",
        v(-58 + i * 25, 0, -48 - (i % 2) * 13),
        {},
        1.1 + (i % 3) * 0.2,
      );
      this.decor(
        `crystal-${i}`,
        "crystals",
        v(-65 + i * 31, 2, 54 + (i % 2) * 10),
        {},
        1.5,
      );
    }
    this.decor("fjord", "fjord", v(0, -38, 0), {}, 3);
  }
  prizes() {
    if (this.objects.some((o) => o.type === "collectible")) return;
    const points = this.routes.flatMap((r) => r.points),
      n = AURORA_BUDGETS[this.stage - 1];
    for (let i = 0; i < n; i++) {
      const p =
        points[
          Math.floor(
            (0.07 + (0.86 * i) / Math.max(1, n - 1)) * (points.length - 1),
          )
        ];
      this.coin(v(p.x, p.y + 0.85, p.z));
    }
  }
}

function build(stage: number): LevelData {
  const l = new Layout(stage);
  switch (stage) {
    case 1: {
      // Four shallow steps, with chamfered approaches suitable for a rolling sphere.
      const nodes = [
        v(-46, 24, 0),
        v(-28, 24, 0),
        v(-27.3, 24.3, 0),
        v(-12, 24.3, 0),
        v(-11.3, 24.6, 0),
        v(5, 24.6, 0),
        v(5.7, 24.9, 0),
        v(22, 24.9, 0),
        v(22.7, 25.2, 0),
        v(43, 25.2, 0),
      ];
      l.finish(
        l.path("four-shallow-stairs", nodes, 4.2, false, { snow: true }),
      );
      l.aurora("arctic-tundra", "tundra", v(0, 2, -56), {}, 1.1);
      break;
    }
    case 2: {
      l.finish(l.path("sled-entry", [v(40, 54, 0), v(15, 54, 0)], 2.2, false));
      const turns = 1.75,
        total = turns * Math.PI * 2,
        n = 7;
      for (let i = 0; i < n; i++) {
        const a = (i * total) / n,
          b = ((i + 1) * total) / n - (i === n - 1 ? 0 : 0.22),
          points = norwayArc(
            0,
            0,
            15,
            a,
            b - a,
            54 - (a / total) * 40,
            54 - (b / total) * 40,
          );
        const route = l.path(
          `broken-helix-${i}`,
          points,
          2.6 - i * 0.15,
          false,
        );
        if (i < n - 1) {
          const next = ((i + 1) * total) / n + 0.09,
            target = v(
              Math.cos(next) * 15,
              54 - (next / total) * 40,
              Math.sin(next) * 15,
            ),
            p = route.points.at(-5)!;
          l.jump(`helix-hop-${i}`, p, target, 2.2, 5);
          l.objects.at(-1)!.rotation.y = Math.atan2(-Math.cos(b), -Math.sin(b));
        } else l.end = { ...route.points.at(-5)! };
      }
      l.add("spiral-mast", "cylinder", v(0, 25, 0), v(1.2, 65, 1.2), {
        color: "#a7cde2",
      });
      l.aurora("husky-team", "sled", v(-37, 13, -31), {}, 1.2);
      break;
    }
    case 3: {
      for (let i = 0; i < 5; i++) {
        const x = i * 35,
          y = 55 - i * 7,
          width = 9 - i * 0.9;
        l.aurora(`ice-skyscraper-${i}`, "scraper", v(x, y, 0), {
          hasCollision: true,
          width,
        });
        l.routes.push(
          norwayPath(
            [
              v(x + 1, y, 0),
              v(x + 6, y, 0),
              v(x + 22, y - 12, 0),
              v(x + 25, y - 12, 0),
            ],
            width,
            false,
          ),
        );
        if (i < 4)
          l.jump(
            `tower-takeoff-${i}`,
            v(x + 23.4, y - 11.97, 0),
            v(x + 37, y - 7, 0),
            2.6 - i * 0.2,
            16,
          );
      }
      l.spawn = v(2, 56.05, 0);
      l.yaw = Math.PI / 2;
      l.end = v(4 * 35 + 23, 15, 0);
      l.aurora("arctic-ice-hotel", "hotel", v(76, 3, -52), {}, 1.3);
      break;
    }
    case 4: {
      const route = l.path(
        "muro8-ball-width",
        [v(-80, 26, 0), v(80, 26, 0)],
        1.5,
        false,
      );
      l.finish(route);
      for (let i = 0; i < 7; i++)
        for (let row = 0; row < 2; row++)
          l.aurora(
            `double-wall-${i}-${row}`,
            "wall",
            v(-56 + i * 18 + row * 3, 26, 0),
            {
              hasCollision: true,
              norwayAction: "wall",
              speed: 0.8 + (i % 3) * 0.47 + row * 0.23,
              index: i * 2 + row,
              amplitude: 4,
            },
          );
      l.aurora("wall-tundra", "tundra", v(0, -2, -58));
      break;
    }
    case 5: {
      l.finish(
        l.path("snow-crystal-arena", [v(0, 24, 22), v(0, 24, -22)], 40, false, {
          snow: true,
        }),
      );
      // Five balanced arms: four prizes on each, forming a snow crystal.
      for (let arm = 0; arm < 5; arm++)
        for (let j = 0; j < 4; j++) {
          const a = (arm * Math.PI * 2) / 5 + Math.PI / 10,
            r = 4 + j * 3.4;
          l.coin(v(Math.cos(a) * r, 24.9, Math.sin(a) * r));
        }
      l.aurora("collection-hotel", "hotel", v(56, -1, 0), {}, 0.8, Math.PI / 2);
      break;
    }
    case 6: {
      l.finish(
        l.path("bypass-entry", [v(-22, 24, 0), v(-7.1, 24, 0)], 2.6, false),
      );
      for (let i = 0; i < 5; i++) {
        const o = l.aurora(`rotary-bypass-${i}`, "bypass", v(i * 14.2, 29, 0), {
          hasCollision: true,
          norwayAction: "bypass",
          length: 14,
          radius: 5,
          speed: 0.68,
          index: i,
          amplitude: 0.7,
          friction: 0.85,
        });
        // Prizes follow their actual moving deck; all start poses are authored below.
        const a = i * 0.55;
        l.coin(v(i * 14.2, 29 - 5 * Math.cos(a) + 0.9, 5 * Math.sin(a)), o.id);
      }
      l.path("bypass-exit", [v(63.9, 24, 0), v(79, 24, 0)], 2.6, false);
      l.end = v(76, 24, 0);
      for (const x of [-18, 69, 74]) l.coin(v(x, 24.9, 0));
      l.aurora("reindeer-herd", "reindeer", v(25, 10, -33), {}, 1.1);
      break;
    }
    case 7: {
      const points = [
        v(-74, 28, 40),
        v(-74, 28, -30),
        v(-34, 28, -30),
        v(-34, 28, 28),
        v(25, 28, 28),
        v(25, 28, -18),
        v(-19, 28, -18),
        v(-19, 28, 16),
        v(12, 28, 16),
        v(12, 28, -7),
        v(-7, 28, -7),
        v(-7, 34, 5),
        v(49, 34, 5),
      ];
      l.finish(l.path("road-to-nowhere", points, 1.8, false));
      l.aurora("frozen-lake", "lake", v(0, -7, -73), {}, 1.2);
      break;
    }
    case 8: {
      l.finish(
        l.path(
          "pendulum-start",
          [v(-46, 24, -1.05), v(-32.2, 24, -1.05)],
          3.6,
          false,
        ),
      );
      for (let i = 0; i < 2; i++)
        l.aurora(
          `newton-walkway-${i}`,
          "pendulum",
          v(0, 28, i === 0 ? -1.05 : 1.05),
          {
            hasCollision: true,
            norwayAction: "pendulum",
            length: 64,
            offset: 4,
            index: i,
            speed: 1,
            friction: 0.85,
          },
        );
      l.path("pendulum-goal", [v(32.2, 24, 1.05), v(46, 24, 1.05)], 3.6, false);
      l.end = v(43, 24, 1.05);
      // Prizes along the resting first deck, outside the central support.
      for (let i = 0; i < 8; i++)
        l.coin(v(-28 + i * 8, 24.9, -1.05), `w8n4e8-newton-walkway-0`);
      l.aurora("snowmobile-team", "snowmobile", v(-9, 12, -33), {}, 1.3);
      break;
    }
    case 9: {
      const radii = [17, 14, 11, 8, 5],
        centers = [0];
      for (let i = 1; i < 5; i++)
        centers.push(centers[i - 1] + radii[i - 1] + radii[i] - 0.8);
      l.finish(
        l.path("gear-entry", [v(-31, 24, 0), v(-17.7, 24, 0)], 2.5, false),
      );
      for (let i = 0; i < 5; i++) {
        const o = l.aurora(
          `motion-gear-${i}`,
          "gear",
          v(centers[i], 24 + i * 0.14, 0),
          {
            hasCollision: true,
            norwayAction: "spin",
            radius: radii[i],
            width: 2.3,
            speed: (i % 2 ? -1 : 1) * (0.15 + i * 0.025),
            friction: 0.95,
          },
        );
        for (const a of [Math.PI / 3, (Math.PI * 2) / 3])
          l.coin(
            v(
              centers[i] + Math.cos(a) * (radii[i] - 1.1),
              24.9 + i * 0.14,
              Math.sin(a) * (radii[i] - 1.1),
            ),
            o.id,
          );
      }
      const x = centers[4] + radii[4];
      l.path(
        "cape-finish",
        [v(x - 0.2, 24.56, 0), v(x + 16, 24.56, 0)],
        2.4,
        false,
      );
      l.end = v(x + 13, 24.56, 0);
      l.aurora("north-cape-globe", "cape", v(44, 3, -55), {}, 1.2);
      break;
    }
    case 10: {
      l.finish(
        l.path(
          "starlight-long-approach",
          [v(-53, 38, 0), v(36, 38, 0)],
          1.8,
          false,
        ),
      );
      const nodes = Array.from({ length: 1051 }, (_, i) => {
        const t = i / 1050,
          a = t * Math.PI * 6,
          r = 36 - t * 28;
        return v(Math.cos(a) * r, 38 - t * 23, Math.sin(a) * r);
      });
      const spiral = l.path("starlight-descending-spiral", nodes, 1.8, false);
      l.end = { ...spiral.points.at(-4)! };
      l.aurora("final-north-cape", "cape", v(0, -8, -73), {}, 1.5);
      // Larger final curtain, always decorative: the finish remains physically unobstructed.
      l.aurora(
        "final-curtain",
        "ribbons",
        v(0, 85, -150),
        { norwayAction: "aurora" },
        1.7,
      );
      break;
    }
  }
  l.aurora(
    "boreal-sky",
    "ribbons",
    v(0, 85, -145),
    { norwayAction: "aurora" },
    1.35,
  );
  l.prizes();
  l.backdrop();
  // Keep the skyline beyond the whole course, including elevated crossings.
  const navigation = l.routes.flatMap((r) => r.points).concat(l.spawn, l.end);
  for (const o of l.objects)
    if (o.properties?.hasCollision && o.properties?.subType !== "norway_path")
      navigation.push(o.position);
  for (const o of l.objects)
    if (o.properties?.norwayAction === "ferry")
      navigation.push(...(o.properties.points as Vector3Data[]));
  const minX = Math.min(...navigation.map((p) => p.x)),
    maxX = Math.max(...navigation.map((p) => p.x)),
    minZ = Math.min(...navigation.map((p) => p.z)),
    maxZ = Math.max(...navigation.map((p) => p.z)),
    cx = (minX + maxX) / 2,
    cz = (minZ + maxZ) / 2;
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2,
      peak = l.objects.find((o) => o.id.endsWith(`summit-${i}`))!;
    peak.position.x = cx + Math.cos(a) * ((maxX - minX) / 2 + 180);
    peak.position.z = cz + Math.sin(a) * ((maxZ - minZ) / 2 + 180);
  }
  const sea = l.objects.find((o) => o.id.endsWith("-fjord"))!;
  sea.position.x = cx;
  sea.position.z = cz;
  sea.scale = v(
    Math.max(3, (maxX - minX + 650) / 160),
    3,
    Math.max(3, (maxZ - minZ + 650) / 160),
  );
  for (const o of l.objects) {
    if (o.properties?.subType === "norway_pine") o.position.y = -36.8;
    if (o.properties?.subType === "norway_crystals") o.position.y = -37.8;
  }
  let yaw = 0,
    best = Infinity;
  for (const r of l.routes)
    for (let i = 3; i < r.points.length; i++) {
      const p = r.points[i],
        d = (p.x - l.end.x) ** 2 + (p.y - l.end.y) ** 2 + (p.z - l.end.z) ** 2;
      if (d < best) {
        best = d;
        const q = r.points[i - 3];
        yaw = Math.atan2(q.x - p.x, q.z - p.z);
      }
    }
  l.add(
    "goal",
    "goal",
    v(l.end.x, l.end.y + 0.1, l.end.z),
    v(1, 1, 1),
    {},
    yaw,
  );
  return {
    id: `world-08-level-04-stage-${String(stage).padStart(2, "0")}`,
    world: 8,
    level: 4,
    stage,
    name: AURORA_NAMES[stage - 1],
    theme: "aurora",
    musicTrack: "sky_waltz",
    spawn: l.spawn,
    timeLimit: stage === 5 ? 150 : stage === 3 || stage === 9 ? 300 : 240,
    objects: l.objects,
    properties: { auroraRevision: AURORA_REVISION, spawnYaw: l.yaw },
  };
}
export const WORLD_08_LEVEL_04_STAGES: Record<number, LevelData> =
  Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => [i + 1, build(i + 1)]),
  );

registerStageSet(8,4,WORLD_08_LEVEL_04_STAGES);

