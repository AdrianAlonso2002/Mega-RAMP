import {registerStageSet} from '../StageRegistry';
import type { LevelData, LevelObjectData, Vector3Data } from "../LevelTypes";
import {
  NORWAY_NAMES,
  NORWAY_BUDGETS,
  NORWAY_REVISION,
  norwayPath,
  norwayArc,
  v,
} from "./NorwayRoutes";
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
      id: `w8n1e${this.stage}-${name}`,
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
      n = NORWAY_BUDGETS[this.stage - 1];
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
      const r = l.path(
        "snow-square",
        [v(0, 18, 15), v(0, 18, -15)],
        30,
        false,
        { snow: true },
      );
      l.finish(r);
      for (const side of [-1, 1])
        for (let i = 0; i < 3; i++) {
          l.decor(
            `cabin-${side}-${i}`,
            "cabin",
            v(side * 24, 10, -24 + i * 23),
            {},
            1.3,
            side > 0 ? -Math.PI / 2 : Math.PI / 2,
          );
          l.decor(
            `cairn-${side}-${i}`,
            "cairn",
            v(side * 16, 18, -12 + i * 12),
            {},
            0.65,
          );
        }
      l.end = v(0, 18, -12);
      break;
    }
    case 2: {
      const r = l.path(
        "trolltunga-rollercoaster",
        [
          v(-150, 38, 0),
          v(-140, 32, 0),
          v(-120, 27, 0),
          v(-98, 27, 0),
          v(-78, 27, 0),
          v(-64, 46, 0),
          v(-42, 15, 0),
          v(-20, 56, 0),
          v(8, 15, 0),
          v(40, 75, 0),
          v(64, 60, 0),
          v(78, 52, 0),
          v(95, 52, 0),
        ],
        3.4,
        true,
      );
      l.finish(r);
      for (const [i, x, y, dy] of [
        [0, -112, 27, 0],
        [1, -83, 27, 12],
        [2, -43, 15, 17],
        [3, 8, 15, 20],
      ])
        l.boost(
          `boost-${i}`,
          v(x, y + 0.03, 0),
          v(1, dy / 22, 0),
          i < 2 ? 36 : i === 2 ? 60 : 72,
          3.2,
        );
      l.decor("ice-funnel", "funnel", v(112, 52, 0), {
        radius: 17,
        depth: 12,
        hasCollision: true,
      });
      const exit = l.path(
        "funnel-drain",
        [
          v(112, 40, 0),
          v(116, 34, 10),
          v(132, 24, 17),
          v(148, 18, 13),
          v(160, 18, 20),
        ],
        2.3,
        true,
        { rails: true },
      );
      l.end = { ...exit.points.at(-3)! };
      l.decor(
        "trolltunga",
        "trolltunga",
        v(15, -52, -57),
        {},
        2.4,
        Math.PI / 2,
      );
      l.prizes();
      break;
    }
    case 3: {
      const start = l.path(
        "glacier-approach",
        [v(-112, 27, 0), v(-98, 25, 0), v(-80, 25, 0)],
        4,
        false,
      );
      l.finish(start);
      for (const side of [-1, 1])
        l.path(
          `parallel-${side}`,
          [v(-80, 25, side * 0.85), v(-50, 25, side * 0.85)],
          0.6,
          false,
        );
      l.disc("first-rest", v(-46, 25, 0), 4);
      l.path("narrow-beam", [v(-42, 25, 0), v(-12, 25, 0)], 1.35, false);
      l.path(
        "first-ring",
        norwayArc(-3, 0, 9, Math.PI, Math.PI * 2, 25),
        1.55,
        false,
      );
      l.path("descending-beam", [v(6, 25, 0), v(30, 18, 0)], 1.3, false);
      l.disc("second-rest", v(34, 18, 0), 4);
      const wave = Array.from({ length: 61 }, (_, i) =>
        v(38 + (i * 28) / 60, 18, Math.sin((i / 60) * Math.PI * 4) * 1.7),
      );
      l.path("wavy-beam", wave, 1.35, false);
      l.path(
        "snowball-ring",
        norwayArc(76, 0, 10, Math.PI, Math.PI * 2, 18),
        1.55,
        false,
      );
      l.decor("ring-snowball", "snowball", v(76, 18, 0), {
        norwayAction: "orbit",
        radius: 10,
        speed: 1.65,
        size: 1.1,
        hasCollision: true,
      });
      const exit = l.path(
        "glacier-finish",
        [v(86, 18, 0), v(101, 18, 0)],
        2,
        false,
      );
      l.end = { ...exit.points.at(-3)! };
      l.decor("glacier", "glacier", v(0, -8, -45), {}, 3.6);
      l.prizes();
      break;
    }
    case 4: {
      const start = l.path(
        "cabins-approach",
        [v(-70, 62, 0), v(-53, 62, 0), v(-37, 62, 0)],
        5,
        false,
      );
      l.finish(start);
      l.path(
        "suspension-bridge",
        [v(-37, 62, 0), v(-22, 60, 0), v(-1, 62, 0)],
        2.7,
        true,
        { rails: true, wood: true },
      );
      for (let i = 0; i < 4; i++) {
        const p = v(10 + (i % 2 ? 2 : -2), 62 - i * 9, 0);
        l.disc(`descending-disc-${i}`, p, 11 - i, {
          norwayAction: "spin",
          speed: i % 2 ? -0.48 : 0.42,
        });
        for (const side of [-1, 1]) l.coin(v(p.x + side * 4, p.y + 0.85, 2));
      }
      l.decor("cabins-funnel", "funnel", v(10, 24, 0), {
        radius: 15,
        depth: 10,
        hasCollision: true,
      });
      l.path(
        "cabin-drain",
        [v(10, 14, 0), v(22, 12, 8), v(41, 12, 8)],
        2.3,
        true,
      );
      l.end = v(38, 12, 8);
      for (let i = 0; i < 4; i++)
        l.decor(
          `mountain-cabin-${i}`,
          "cabin",
          v(-43 + i * 22, 48, -28),
          {},
          1.3,
        );
      break;
    }
    case 5: {
      const r = l.path(
        "snowflake-field",
        [v(0, 17, 19), v(0, 17, -19)],
        38,
        false,
        { snow: true },
      );
      l.finish(r);
      for (let arm = 0; arm < 6; arm++)
        for (let i = 1; i <= 3; i++) {
          const a = (arm * Math.PI) / 3;
          l.coin(v(Math.cos(a) * i * 4.5, 17.85, Math.sin(a) * i * 4.5));
        }
      l.coin(v(-1.3, 17.85, 0));
      l.coin(v(1.3, 17.85, 0));
      l.end = v(0, 17, -16);
      for (const x of [-26, 26]) {
        l.decor(`cabin-${x}`, "cabin", v(x, 10, -8), {}, 1.4);
        l.decor(`lantern-${x}`, "lantern", v(x * 0.8, 17, 18), {}, 1.4);
      }
      break;
    }
    case 6: {
      l.spawn = v(-42, 85.05, 0);
      l.disc("first-summit", v(-42, 84, 0), 2.6);
      l.path(
        "first-descent",
        norwayArc(-32, 0, 10, Math.PI, Math.PI * 3, 84, 74),
        2.6,
        false,
        { rails: true },
      );
      l.decor("first-shaft", "ice_column", v(-32, 6, 0), {
        radius: 8.5,
        height: 77,
      });
      l.path("summit-bridge", [v(-22, 74, 0), v(-12, 74, 0)], 2.7, false, {
        rails: true,
        wood: true,
      });
      l.path(
        "descent-tower",
        norwayArc(0, 0, 12, Math.PI, Math.PI * 6, 74, 25),
        2.6,
        false,
        { rails: true },
      );
      l.decor("second-shaft", "ice_column", v(0, 17, 0), {
        radius: 10.5,
        height: 57,
      });
      l.path(
        "rock-neck",
        [v(-12, 25, 0), v(-25, 23, -9), v(-30, 20, -25)],
        2.2,
        true,
      );
      const coil = norwayArc(-30, -35, 10, Math.PI / 2, Math.PI * 3.4, 20, 7);
      l.path("thin-coil", coil, 1.85, false, { rails: true });
      l.end = { ...coil.at(-3)! };
      l.disc("rock-goal", l.end, 2.7);
      l.yaw = 0;
      l.decor("preikestolen", "pulpit", v(48, -50, -50), {}, 2.6);
      l.prizes();
      break;
    }
    case 7: {
      const start = l.path(
        "snow-steps-in",
        [
          v(-76, 35, 27),
          v(-76, 34, 8),
          v(-58, 34, 8),
          v(-58, 34, 0),
          v(-48, 34, 0),
        ],
        3,
        false,
      );
      l.finish(start);
      for (let i = 0; i < 28; i++) {
        const width = 3.6 - Math.sin((i / 27) * Math.PI) * 1.8,
          stable = i % (i < 12 ? 4 : 7) === 0;
        l.decor(`flip-tile-${i}`, "tile", v(-46.3 + i * 3.4, 34, 0), {
          width: 3.4,
          depth: width,
          hasCollision: true,
          ...(stable
            ? {}
            : { norwayAction: "flip", index: i, speed: 0.9 + i * 0.018 }),
        });
      }
      const exit = l.path(
        "snow-steps-out",
        [v(47.2, 34, 0), v(60, 34, 0), v(60, 35, -12), v(77, 36, -12)],
        2.25,
        false,
      );
      l.end = { ...exit.points.at(-3)! };
      l.coin(v(-65, 34.85, 8));
      for (const i of [0, 4, 8, 14, 21]) l.coin(v(-46.3 + i * 3.4, 34.85, 0));
      l.coin(v(58, 34.85, 0));
      l.coin(v(70, 36.3, -12));
      l.decor("snowy-peaks", "mountain", v(0, -28, -46), {}, 2.8);
      break;
    }
    case 8: {
      const start = l.path(
        "avalanche-runup",
        [v(-100, 38, 0), v(-85, 34, 0), v(-55, 34, 0)],
        4,
        false,
      );
      l.finish(start);
      l.boost("avalanche-boost", v(-77, 34.03, 0), v(1, 0, 0), 18, 3.5);
      for (const x of [-50, -15, 20])
        l.disc(`rail-rest-${x}`, v(x, 34, 0), 4.6);
      for (const side of [-1, 1]) {
        l.path(
          `high-rail-${side}`,
          [v(-50, 34, side * 0.85), v(20, 34, side * 0.85)],
          0.65,
          false,
        );
        l.path(
          `down-rail-${side}`,
          [v(20 + side * 0.85, 34, 0), v(20 + side * 0.85, 22, -40)],
          0.65,
          false,
        );
        l.path(
          `final-rail-${side}`,
          [v(20, 22, -40 + side * 0.85), v(64, 22, -40 + side * 0.85)],
          0.65,
          false,
        );
      }
      l.disc("avalanche-turn", v(20, 22, -40), 4);
      l.disc("avalanche-goal", v(66, 22, -40), 4);
      l.end = v(67, 22, -40);
      for (let i = 0; i < 3; i++)
        l.decor(`avalanche-${i}`, "snowball", v(-36 + i * 22, 35.4, 0), {
          norwayAction: "avalanche",
          index: i,
          speed: 0.85 + i * 0.18,
          size: 1.4,
          hasCollision: true,
        });
      for (const [x, y, z] of [
        [-90, 35.34, 0],
        [-62, 34, 0],
        [-38, 34, 0.85],
        [-15, 34, 0],
        [9, 34, -0.85],
        [20.85, 31, -10],
        [19.15, 28, -20],
        [20.85, 24.5, -32],
        [37, 22, -39.15],
        [56, 22, -40.85],
      ])
        l.coin(v(x, y + 0.85, z));
      l.decor("avalanche-slope", "glacier", v(-10, 1, -39), {}, 3.5);
      break;
    }
    case 9: {
      const start = l.path(
        "troll-approach",
        [v(-48, 14, 0), v(-32, 14, 0), v(-14, 14, 0)],
        2.8,
        false,
        { rails: true },
      );
      l.finish(start);
      l.path(
        "tower-boarding",
        norwayArc(0, 0, 11, 0, Math.PI * 2, 14),
        3.5,
        false,
      );
      const tower = l.decor("troll-tower", "tower", v(0, 14, 0), {
        norwayAction: "spin",
        radius: 11,
        height: 48,
        turns: 4,
        width: 2.4,
        speed: 0.42,
        hasCollision: true,
      });
      l.end = v(0, 62, 0);
      const helix = norwayArc(0, 0, 11, Math.PI, Math.PI * 8, 14, 62);
      for (let i = 0; i < 8; i++) {
        const p = helix[Math.floor((0.07 + i * 0.12) * (helix.length - 1))];
        l.coin(v(p.x, p.y + 0.85, p.z), tower.id);
      }
      l.decor("troll-cave", "cave", v(0, 0, -44), {}, 3.2);
      l.decor("stone-troll", "troll", v(34, -5, -24), {}, 3);
      break;
    }
    case 10: {
      const start = l.path(
        "lofoten-runup",
        [v(-78, 36, 38), v(-78, 32, 12), v(-65, 32, 0), v(-27, 32, 0)],
        2.4,
        true,
      );
      l.finish(start);
      l.disc("arc-dock-a", v(-27, 32, 0), 2.6);
      const a = l.decor("first-crescent", "swing_arc", v(-5, 32, 0), {
        norwayAction: "spin",
        radius: 22,
        width: 1.9,
        speed: 0.34,
        hasCollision: true,
      });
      l.disc("arc-transfer-a", v(17, 32, 0), 2.6);
      l.path(
        "lofoten-transfer",
        [v(17, 32, 0), v(36, 30, 0), v(52, 22, 0), v(66, 18, 0)],
        1.9,
        true,
      );
      l.disc("arc-dock-b", v(66, 18, 0), 2.6);
      const b = l.decor("second-crescent", "swing_arc", v(94, 18, 0), {
        norwayAction: "spin",
        radius: 28,
        width: 1.65,
        speed: -0.29,
        hasCollision: true,
      });
      l.disc("arc-exit-b", v(94, 18, 28), 2.8);
      const exit = l.path(
        "lofoten-home",
        [v(94, 18, 28), v(111, 16, 40), v(136, 16, 42)],
        2,
        true,
      );
      l.end = { ...exit.points.at(-3)! };
      const runup = l.routes[0].points,
        transfer = l.routes[1].points,
        first = runup[Math.floor(runup.length * 0.65)],
        second = transfer[Math.floor(transfer.length * 0.55)];
      l.coin(v(first.x, first.y + 0.85, first.z));
      l.coin(v(second.x, second.y + 0.85, second.z));
      for (const [object, radius] of [
        [a, 22],
        [b, 28],
      ] as const)
        for (let i = 0; i < 4; i++) {
          const angle = Math.PI + (0.15 + i * 0.22) * Math.PI * 1.5;
          l.coin(
            v(
              object.position.x + Math.cos(angle) * radius,
              object.position.y + 0.85,
              Math.sin(angle) * radius,
            ),
            object.id,
          );
        }
      for (let i = 0; i < 6; i++)
        l.decor(
          `rorbu-${i}`,
          "rorbu",
          v(68 + i * 15, -36.8, -52 - (i % 2) * 6),
          {},
          1.6,
          (i % 2) * 0.15,
        );
      l.decor("lofoten-spire", "mountain", v(106, -36, -85), {}, 3.6);
      break;
    }
  }
  l.prizes();
  l.backdrop();
  let goalYaw = 0,
    best = Infinity;
  for (const route of l.routes)
    for (let i = 3; i < route.points.length; i++) {
      const p = route.points[i],
        distance =
          (p.x - l.end.x) ** 2 + (p.y - l.end.y) ** 2 + (p.z - l.end.z) ** 2;
      if (distance < best) {
        best = distance;
        const previous = route.points[i - 3];
        goalYaw = Math.atan2(previous.x - p.x, previous.z - p.z);
      }
    }
  l.add(
    "goal",
    "goal",
    v(l.end.x, l.end.y + 0.1, l.end.z),
    v(1, 1, 1),
    stage === 9 ? { norwayGoal: true, norwayAction: "spin", speed: 0.42 } : {},
    stage === 9 ? 0 : goalYaw,
  );
  return {
    id: `world-08-level-01-stage-${String(stage).padStart(2, "0")}`,
    world: 8,
    level: 1,
    stage,
    name: NORWAY_NAMES[stage - 1],
    theme: "aurora",
    musicTrack: "cyber_wave",
    timeLimit: stage === 5 ? 150 : stage === 6 || stage === 9 ? 300 : 240,
    spawn: l.spawn,
    objects: l.objects,
    properties: { norwayRevision: NORWAY_REVISION, spawnYaw: l.yaw },
  };
}
export const WORLD_08_LEVEL_01_STAGES: Record<number, LevelData> =
  Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => [i + 1, build(i + 1)]),
  );

registerStageSet(8,1,WORLD_08_LEVEL_01_STAGES);

