import publishedEditorStages from '../editor-saved/world-08.json';
import {registerStageSet} from '../StageRegistry';
import { FJORD_NAMES, FJORD_BUDGETS, FJORD_REVISION } from "./FjordRoutes";
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
      id: `w8n2e${this.stage}-${name}`,
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
  disc(
    name: string,
    p: Vector3Data,
    radius: number,
    properties: Record<string, unknown> = {},
  ) {
    return this.decor(name, "disc", p, {
      radius,
      hasCollision: true,
      ...properties,
    });
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
  boost(
    name: string,
    p: Vector3Data,
    direction: Vector3Data,
    speed = 27,
    width = 3,
  ) {
    this.decor(name, "boost", p, {
      norwayAction: "boost",
      direction,
      speed,
      width,
      length: 7,
    });
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
      n = FJORD_BUDGETS[this.stage - 1];
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
      l.finish(
        l.path(
          "valley-descent",
          [
            v(-104, 43, 0),
            v(-95, 42, 0),
            v(-79, 27, 0),
            v(-62, 25, 0),
            v(-12, 25, 0),
          ],
          2.3,
        ),
      );
      l.jump("fjord-gap", v(-13, 25.02, 0), v(8, 25, 0), 2.3, 11);
      const r = l.path(
        "landing-curve",
        [
          v(5, 25, 0),
          v(17, 25, 0),
          v(26, 25, 7),
          v(27, 25, 18),
          v(17, 25, 25),
          v(10, 25, 18),
          v(18, 25, 11),
          v(40, 27, 11),
          v(62, 34, 11),
        ],
        2.3,
      );
      l.end = { ...r.points.at(-4)! };
      for (let i = 0; i < 7; i++)
        l.fjord(`sweeper-${i}`, "shifter", v(-57 + i * 6.5, 25.86, 0), {
          hasCollision: true,
          norwayAction: "slide",
          length: 2,
          width: 6,
          speed: 1.2 + (i % 3) * 0.35,
          index: i,
          amplitude: 7,
        });
      l.fjord("landing-sweeper", "shifter", v(17, 25.86, 0), {
        hasCollision: true,
        norwayAction: "slide",
        length: 2,
        width: 7,
        speed: 1.8,
        amplitude: 8,
      });
      l.fjord("steep-valley", "cliff", v(-34, -37, -62), {}, 1.5);
      break;
    }
    case 2: {
      for (let i = 0; i < 6; i++) {
        const x = i % 2 ? 1.2 : -1.2,
          z = 18 - i * 21,
          y = 24 + i * 0.65;
        const r = l.path(
          `jump-run-${i}`,
          [v(x, y, z + 11), v(x, y, z + 3), v(x, y + 0.6, z)],
          1.5,
          false,
        );
        if (!i) l.finish(r);
        const target =
          i < 5 ? v(i % 2 ? -1.2 : 1.2, y + 0.65, z - 15) : v(x, y, z - 15);
        l.jump(
          `precision-launch-${i}`,
          v(x, y + 0.61, z + 0.3),
          target,
          1.5,
          10.4,
        );
        if (i < 5) {
          l.coin(v(x, y + 0.9, z + 7));
          l.coin(v(x, y + 0.9, z + 3));
        }
      }
      const r = l.path(
        "last-landing",
        [v(1.2, 27.25, -99), v(1.2, 27.25, -115)],
        1.5,
        false,
      );
      l.end = { ...r.points.at(-4)! };
      l.fjord("jump-valley", "cliff", v(45, -37, -45), {}, 1.6, Math.PI / 2);
      break;
    }
    case 3: {
      const nodes = Array.from({ length: 81 }, (_, i) =>
        v(
          105 - i * 2.6,
          42 - i * 0.34 + Math.sin(i * 0.8) * (0.15 + i * 0.005),
          Math.sin(i / 15) * 12,
        ),
      );
      l.finish(l.path("irregular-river-ridge", nodes, 1.85, false));
      l.fjord(
        "seven-sisters",
        "waterfalls",
        v(-10, -37, -62),
        { norwayAction: "waterfall" },
        1.4,
      );
      break;
    }
    case 4: {
      l.finish(l.path("kayak-entry", [v(-65, 25, 0), v(-57, 25, 0)], 3, false));
      const positions: ReturnType<typeof v>[] = [];
      for (let i = 0; i < 22; i++) {
        const p = v(-53 + i * 5, 25, Math.sin(i * 0.8) * 2.3),
          radius = 2.7 - (i % 3) * 0.25;
        const o = l.fjord(`sinking-column-${i}`, "pontoon", p, {
          hasCollision: true,
          norwayAction: "sink",
          radius,
          height: 7,
          sinkMax: 0.45,
          sinkSpeed: 0.7,
        });
        positions.push(p);
        if (i % 3 === 1) l.coin(v(p.x, p.y + 0.95, p.z), o.id);
      }
      for (const [j, i] of [4, 10, 16].entries()) {
        const p = positions[i];
        l.fjord(`side-column-${i}`, "pontoon", v(p.x, 25, p.z + 5), {
          hasCollision: true,
          radius: 2.4,
          height: 8,
        });
        l.coin(v(p.x, 25.9, p.z + 5));
        l.fjord(
          `kayak-${j}`,
          "kayak",
          v(p.x, -35, 30 + j * 9),
          {},
          1.5,
          j * 0.6,
        );
      }
      l.path(
        "kayak-exit",
        [positions.at(-1)!, v(62, 25, positions.at(-1)!.z)],
        3,
        false,
      );
      l.end = v(60, 25, positions.at(-1)!.z);
      break;
    }
    case 5: {
      l.finish(
        l.path(
          "longship-collection",
          [v(0, 24, 24), v(0, 24, -24)],
          38,
          false,
          { snow: true },
        ),
      );
      // Symmetrical gunwales and oars form an ordered longship motif.
      for (let i = 0; i < 8; i++)
        for (const side of [-1, 1])
          l.coin(
            v(side * (3 + Math.sin((i / 7) * Math.PI) * 6), 24.9, -14 + i * 4),
          );
      for (const x of [-14, -11, 11, 14]) l.coin(v(x, 24.9, 0));
      l.fjord(
        "collection-drakkar",
        "longship",
        v(39, -34, 0),
        {},
        1.6,
        Math.PI / 2,
      );
      break;
    }
    case 6: {
      l.finish(
        l.path(
          "loop-approach",
          [v(-65, 24, 0), v(-45, 24, 0), v(-18, 24, 0), v(0, 24, 0)],
          3,
          false,
        ),
      );
      l.fjord("vertical-loop", "loop", v(0, 36, 0), {
        hasCollision: true,
        friction: 0.08,
        radius: 12,
        width: 3,
        drift: 7,
      });
      l.boost("loop-accelerator", v(-8, 24.03, 0), v(1, 0, 0.075), 70, 2.8);
      const r = l.path(
        "loop-exit",
        [
          v(0, 24, 7),
          v(15, 24, 7),
          v(23, 25, 17),
          v(12, 26, 29),
          v(-1, 27, 20),
          v(9, 28, 11),
          v(29, 29, 20),
          v(38, 30, 34),
          v(24, 30, 44),
          v(13, 30, 35),
          v(24, 30, 29),
          v(50, 30, 29),
        ],
        2.3,
      );
      r.banks = r.points.map(
        (_, i) => Math.sin((i / r.points.length) * Math.PI * 4) * 0.35,
      );
      l.objects.find((o) => o.id.endsWith("loop-exit"))!.properties!.banks =
        r.banks;
      l.boost("loop-exit-brake", v(5, 24.03, 7), v(1, 0, 0), 12, 4);
      l.end = { ...r.points.at(-4)! };
      l.fjord("viking-longship", "longship", v(-25, -34, -38), {}, 2);
      break;
    }
    case 7: {
      const r = l.path(
        "banked-wooden-pier",
        [
          v(85, 43, 0),
          v(69, 40, 0),
          v(52, 37, 4),
          v(30, 34, -5),
          v(15, 32, -23),
          v(-3, 30, -35),
          v(-22, 28, -18),
          v(-2, 26, 3),
          v(-10, 24, 23),
          v(-40, 22, 18),
          v(-53, 21, 0),
          v(-70, 20, -5),
          v(-85, 19, 8),
        ],
        2.1,
        true,
        { wood: true },
      );
      r.banks = r.points.map(
        (_, i) =>
          Math.sin((i / r.points.length) * Math.PI * 5) *
          (0.15 + (0.6 * i) / r.points.length),
      );
      l.objects.find((o) =>
        o.id.endsWith("banked-wooden-pier"),
      )!.properties!.banks = r.banks;
      l.finish(r);
      for (let i = 0; i < 4; i++)
        l.fjord(
          `wooden-pier-${i}`,
          "pier",
          v(60 - i * 38, -34, 55),
          {},
          1.3,
          i * 0.2,
        );
      break;
    }
    case 8: {
      l.disc("cliff-start", v(72, 38, -18), 4);
      l.finish(
        l.path(
          "cliff-descent",
          [v(72, 38, -18), v(61, 32, -18), v(43, 27, -10), v(34, 27, 0)],
          2.1,
        ),
      );
      l.spawn = v(72, 39.05, -18);
      l.disc("turn-disc", v(34, 27, 0), 4);
      l.path(
        "return-ridge",
        [v(34, 27, 0), v(20, 27, 5), v(4, 27, 5), v(-7, 27, 0)],
        2.1,
      );
      for (let i = 0; i < 11; i++)
        l.fjord(`rising-step-${i}`, "stair", v(-9 - i * 3, 27 + i * 0.35, 0), {
          hasCollision: true,
          norwayAction: "stairs",
          length: 3,
          width: 2.1,
          index: i,
          speed: 1.15,
        });
      l.disc("cliff-top", v(-43, 30.5, 0), 4);
      l.jump("cliff-jump", v(-45, 30.52, 0), v(-61, 29, 0), 2.1, 10);
      const r = l.path(
        "cliff-hook",
        [
          v(-58, 29, 0),
          v(-75, 28, 0),
          v(-85, 25, 10),
          v(-77, 22, 24),
          v(-57, 21, 24),
        ],
        2.1,
      );
      l.end = { ...r.points.at(-4)! };
      l.fjord("jump-cliff", "cliff", v(-22, -37, -60), {}, 1.5);
      break;
    }
    case 9: {
      l.finish(
        l.path(
          "whale-approach",
          [v(-91, 28, 0), v(-76, 24, 0), v(-59, 24, 0)],
          2.8,
        ),
      );
      for (let i = 0; i < 2; i++)
        l.fjord(`rotating-pipe-${i}`, "pipe", v(-48 + i * 25, 30, 0), {
          hasCollision: true,
          norwayAction: "pipe",
          length: 22,
          radius: 6,
          speed: i ? -0.72 : 0.65,
          steps: i ? 4 : 2,
        });
      l.path("pipe-junction", [v(-37, 24, 0), v(-34, 24, 0)], 2.6, false);
      l.path(
        "pier-corner",
        [v(-12, 24, 0), v(0, 24, 0), v(12, 24, 12), v(39, 24, 12)],
        2.6,
      );
      l.fjord("rotating-pipe-2", "pipe", v(50, 30, 12), {
        hasCollision: true,
        norwayAction: "pipe",
        length: 22,
        radius: 6,
        speed: 0.8,
        gaps: true,
      });
      const r = l.path(
        "whale-finish",
        [v(61, 24, 12), v(74, 23, 12), v(86, 18, 12)],
        2.8,
      );
      l.end = { ...r.points.at(-4)! };
      for (let i = 0; i < 3; i++)
        l.fjord(
          `breaching-whale-${i}`,
          "whale",
          v(-35 + i * 43, -35, -42 - i * 12),
          { norwayAction: "whale", index: i },
          1.2,
          i * 0.3,
        );
      break;
    }
    case 10: {
      l.finish(
        l.path(
          "geiranger-approach",
          [v(-111, 24, 0), v(-92, 24, 0), v(-65, 24, 0), v(-48, 24, 0)],
          2.2,
        ),
      );
      const spiral = norwayArc(-34, 0, 14, Math.PI, Math.PI * 2.5, 24, 38);
      l.path("fjord-spiral", spiral, 2.2, false);
      const tip = spiral.at(-1)!;
      l.path("spiral-takeoff", [tip, v(tip.x + 10, 38, tip.z)], 2.2, false);
      l.jump(
        "final-fjord-gap",
        v(tip.x + 8, 38.02, tip.z),
        v(tip.x + 24, 38, tip.z),
        2.2,
        10,
      );
      const x0 = tip.x + 22;
      for (let i = 0; i < 19; i++) {
        const o = l.fjord(`fjord-tilt-${i}`, "roll", v(x0 + i * 5, 38, tip.z), {
          hasCollision: true,
          norwayAction: "roll",
          length: 5,
          width: 2.2,
          index: i * 0.5,
          speed: 0.8,
          wall: i % 4 === 2 ? (i % 8 === 2 ? 1 : -1) : 0,
        });
        if (i % 3 === 0) l.coin(v(o.position.x, 38.95, tip.z), o.id);
      }
      const r = l.path(
        "final-pier",
        [v(x0 + 92.5, 38, tip.z), v(x0 + 107, 38, tip.z)],
        2.2,
        false,
      );
      l.end = { ...r.points.at(-4)! };
      for (let i = 0; i < 3; i++) l.coin(v(-85 + i * 12, 24.9, 0));
      l.fjord("geiranger-walls", "cliff", v(23, -37, -62), {}, 2.1);
      l.fjord(
        "geiranger-waterfall",
        "waterfalls",
        v(60, -37, 72),
        { norwayAction: "waterfall" },
        1.3,
        Math.PI,
      );
      for (let i = 0; i < 4; i++)
        l.decor(
          `geiranger-rorbu-${i}`,
          "rorbu",
          v(40 + i * 15, -35, -34),
          {},
          1.4,
        );
      break;
    }
  }
  l.prizes();
  l.backdrop();
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
    id: `world-08-level-02-stage-${String(stage).padStart(2, "0")}`,
    world: 8,
    level: 2,
    stage,
    name: FJORD_NAMES[stage - 1],
    theme: "aurora",
    musicTrack: "cyber_wave",
    spawn: l.spawn,
    timeLimit: stage === 5 ? 150 : stage === 6 || stage === 9 ? 300 : 240,
    objects: l.objects,
    properties: { fjordRevision: FJORD_REVISION, spawnYaw: l.yaw },
  };
}
export const WORLD_08_LEVEL_02_STAGES: Record<number, LevelData> =
  Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => [i + 1, build(i + 1)]),
  );

// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('8_2_')) Object.assign(WORLD_08_LEVEL_02_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(8,2,WORLD_08_LEVEL_02_STAGES);

