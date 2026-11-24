import publishedEditorStages from '../editor-saved/world-08.json';
import {registerStageSet} from '../StageRegistry';
import {
  OSLO_NAMES,
  OSLO_BUDGETS,
  OSLO_REVISION,
  osloFerryTrack,
} from "./OsloRoutes";
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
      id: `w8n3e${this.stage}-${name}`,
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
  oslo(
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
      { subType: `oslo_${kind}`, hasCollision: false, ...properties },
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
    this.decor(
      name,
      "boost",
      p,
      {
        norwayAction: "boost",
        direction: v(Math.hypot(direction.x, direction.z), direction.y, 0),
        speed,
        width,
        length: 7,
      },
      1,
      Math.atan2(-direction.z, direction.x),
    );
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
      n = OSLO_BUDGETS[this.stage - 1];
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
        l.path("museum-entry", [v(-112, 40, 0), v(-85, 40, 0)], 3, false),
      );
      for (let i = 0; i < 6; i++) {
        const x = -70 + i * 28,
          y = 37 - i * 3;
        const swing = l.oslo(`suspended-${i}`, "swing", v(x, y, 0), {
          hasCollision: true,
          norwayAction: "swing",
          index: i,
          speed: 0.75 + i * 0.035,
          length: 22,
          width: 3,
          amplitude: 0.085,
        });
        l.coin(v(x, y + 0.9, 0), swing.id);
        if (i < 5) {
          const angle = Math.sin(i * 0.65) * 0.085;
          l.jump(
            `swing-transfer-${i}`,
            v(
              x + 9.6 * Math.cos(angle) - 2.3 * Math.sin(angle),
              y + 9.6 * Math.sin(angle) + 2.3 * Math.cos(angle),
              0,
            ),
            v(x + 28, y - 3, 0),
            2.6,
            10,
          );
          l.objects.at(-1)!.properties!.osloAnchor = swing.id;
          l.objects.at(-1)!.rotation.z = angle;
        }
      }
      l.jump("first-transfer", v(-87, 40.02, 0), v(-70, 37, 0), 3, 9);
      const exit = l.path(
        "museum-hook",
        [
          v(81, 25, 0),
          v(91, 25, 0),
          v(104, 25, 8),
          v(106, 25, 23),
          v(94, 25, 32),
          v(81, 25, 26),
        ],
        2.5,
      );
      l.end = { ...exit.points.at(-4)! };
      l.coin(v(-103, 40.9, 0));
      l.coin(v(94, 25.9, 32));
      l.oslo("viking-museum", "museum", v(-22, -8, -58), {}, 1.6);
      break;
    }
    case 2: {
      const nodes = [
        v(73, 24, 15),
        v(57, 24, 15),
        v(40, 24, 15),
        v(14, 24, 15),
        v(-18, 24, 15),
        v(-37, 24, 4),
        v(-39, 24, -14),
        v(-25, 24, -27),
        v(0, 24, -28),
        v(30, 24, -28),
        v(61, 24, -28),
        v(69, 26, -25),
        v(66, 30, -20),
        v(53, 32, -20),
        v(20, 32, -20),
        v(-9, 32, -20),
        v(-22, 32, -9),
        v(-22, 32, 5),
        v(-8, 32, 15),
        v(20, 32, 15),
        v(52, 32, 15),
        v(75, 32, 15),
      ];
      const r = l.path("opera-double-hairpin", nodes, 2.5);
      l.finish(r);
      for (const [i, p] of [
        v(33, 24, 15),
        v(-1, 24, -28),
        v(28, 32, -20),
        v(39, 32, 15),
      ].entries()) {
        l.oslo(`opera-hurdle-${i}`, "tile", v(p.x, p.y + 0.65, p.z), {
          hasCollision: true,
          length: 1.1,
          width: 2.5,
        });
        const dir = i === 0 || i === 2 ? -1 : 1;
        l.jump(
          `opera-hop-${i}`,
          v(p.x - dir * 3, p.y + 0.02, p.z),
          v(p.x + dir * 4, p.y, p.z),
          2.5,
          6,
        );
      }
      l.oslo("oslo-opera-house", "opera", v(4, -8, -69), {}, 1.8);
      break;
    }
    case 3: {
      const nodes = Array.from({ length: 261 }, (_, i) => {
        const t = i / 260;
        return v(
          Math.sin(t * Math.PI * 5) * 8,
          26 + Math.sin(t * Math.PI * 4) * 3,
          30 - t * 540,
        );
      });
      const r = l.path("correr-oslo", nodes, 1.5, false);
      l.finish(r);
      for (let i = 0; i < 6; i++) {
        const p = r.points[Math.floor(r.points.length * (0.15 + i * 0.13))];
        l.oslo(
          `run-rotor-${i}`,
          "rotor",
          v(p.x + (i % 2 ? -3.3 : 3.3), p.y, p.z),
          {
            hasCollision: true,
            norwayAction: "spin",
            speed: (i % 2 ? -1 : 1) * (1.1 + i * 0.08),
            length: 6.4,
          },
        );
      }
      for (let i = 0; i < 8; i++)
        l.oslo(
          `harbor-facade-${i}`,
          "building",
          v(i % 2 ? 32 : -32, -8, -20 - i * 64),
          { height: 17 + (i % 3) * 3, colour: i % 2 ? 0xc5a77e : 0xb17f7f },
          1.15,
          i % 2 ? -Math.PI / 2 : Math.PI / 2,
        );
      break;
    }
    case 4: {
      l.finish(
        l.path(
          "vigeland-narrow-steps",
          [
            v(-80, 38, -18),
            v(-63, 38, -18),
            v(-58, 32, -18),
            v(-41, 32, -18),
            v(-41, 30, 3),
            v(-19, 30, 3),
            v(-19, 27, 22),
            v(0, 27, 22),
          ],
          1.8,
          false,
        ),
      );
      for (let i = 0; i < 8; i++)
        l.oslo(
          `descending-step-${i}`,
          "tile",
          v(2 + i * 2.8, 27 - i * 0.32, 22),
          { hasCollision: true, length: 2.2, width: 2.2 },
        );
      l.path(
        "sculpture-rest",
        [
          v(24.4, 24.76, 22),
          v(33, 24.76, 22),
          v(33, 24.76, 4),
          v(44, 24.76, 4),
        ],
        1.8,
        false,
      );
      for (let i = 0; i < 23; i++)
        l.oslo(
          `diagonal-square-${i}`,
          "tile",
          v(
            46.5 + i * 2.8,
            24.76 + Math.max(0, i - 12) * 0.12,
            4 + (i % 2 ? 1.15 : -1.15),
          ),
          { hasCollision: true, length: 2.5, width: 2.5 },
          1,
          Math.PI / 4,
        );
      l.path(
        "park-finish",
        [v(108, 25.96, 2.85), v(117, 25.96, 2.85)],
        2.4,
        false,
      );
      l.end = v(115, 25.96, 2.85);
      for (const [i, a, c] of [
        [0, v(-63, 38, -18), v(-63, 38, -28)],
        [1, v(-19, 30, 3), v(-9, 30, 3)],
        [2, v(33, 24.76, 22), v(44, 24.76, 22)],
      ] as const) {
        l.path(`sculpture-side-arm-${i}`, [a, c], 1.8, false);
        l.coin(v(c.x, c.y + 0.9, c.z));
      }
      for (let i = 0; i < 7; i++)
        l.coin(
          v(
            46.5 + i * 8.4,
            24.76 + Math.max(0, i * 3 - 12) * 0.12 + 0.9,
            4 + (i % 2 ? 1.15 : -1.15),
          ),
        );
      l.oslo("vigeland-sculpture-park", "sculptures", v(-4, -8, -50), {}, 1.7);
      break;
    }
    case 5: {
      l.finish(
        l.path(
          "nordic-knot-collection",
          [v(0, 24, 22), v(0, 24, -22)],
          40,
          false,
          { snow: true },
        ),
      );
      for (const [count, radius, phase] of [
        [12, 13, Math.PI / 12],
        [8, 6, 0],
      ])
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2 + phase;
          l.coin(v(Math.cos(a) * radius, 24.9, Math.sin(a) * radius));
        }
      l.oslo("rest-opera", "opera", v(46, -8, 0), {}, 1.35, -Math.PI / 2);
      l.oslo("rest-statues", "sculptures", v(-48, -8, 0), {}, 1.2);
      break;
    }
    case 6: {
      l.finish(
        l.path(
          "palace-entry",
          [v(-92, 28, 0), v(-77, 24, 0), v(-60, 24, 0)],
          2.8,
        ),
      );
      for (let i = 0; i < 2; i++)
        l.oslo(`royal-drum-${i}`, "drum", v(-48 + i * 25, 30, 0), {
          hasCollision: true,
          norwayAction: "drum",
          radius: 6,
          length: 24,
          speed: i ? -0.8 : 0.7,
          friction: 0.8,
        });
      l.path("drum-seam", [v(-36, 24, 0), v(-35, 24, 0)], 2.6, false);
      l.path(
        "palace-corner",
        [v(-11, 24, 0), v(3, 24, 0), v(3, 24, 12)],
        2.6,
        false,
      );
      l.oslo(
        "royal-drum-2",
        "drum",
        v(3, 30, 24),
        {
          hasCollision: true,
          norwayAction: "drum",
          radius: 6,
          length: 24,
          speed: 0.75,
          friction: 0.8,
        },
        1,
        -Math.PI / 2,
      );
      l.path(
        "palace-second-corner",
        [v(3, 24, 36), v(3, 24, 44), v(16, 24, 44)],
        2.6,
        false,
      );
      l.oslo("royal-drum-3", "drum", v(28, 30, 44), {
        hasCollision: true,
        norwayAction: "drum",
        radius: 6,
        length: 24,
        speed: -0.85,
        friction: 0.8,
      });
      const r = l.path(
        "palace-finish",
        [v(40, 24, 44), v(55, 23, 44), v(67, 22, 44)],
        2.8,
      );
      l.end = { ...r.points.at(-4)! };
      l.oslo("royal-palace", "palace", v(-13, -8, -61), {}, 1.5);
      for (const p of [
        v(-53, 24, 0),
        v(-43, 24, 0),
        v(-28, 24, 0),
        v(-18, 24, 0),
        v(3, 24, 19),
        v(3, 24, 29),
        v(23, 24, 44),
        v(33, 24, 44),
      ])
        l.coin(v(p.x, p.y + 0.9, p.z));
      break;
    }
    case 7: {
      l.disc("ski-start", v(65, 25, 25), 4);
      l.spawn = v(66, 26.05, 25);
      l.yaw = -Math.PI / 2;
      const nodes = [
        v(65, 25, 25),
        v(44, 25, 25),
        v(44, 25, 11),
        v(20, 25, 11),
        v(20, 25, -6),
        v(-2, 25, -6),
        v(-2, 25, -23),
        v(-24, 25, -23),
      ];
      for (let i = 1; i < nodes.length; i++) {
        const a = nodes[i - 1],
          c = nodes[i],
          length = Math.hypot(c.x - a.x, c.z - a.z),
          yaw = Math.atan2(-(c.z - a.z), c.x - a.x);
        l.oslo(
          `pointy-road-${i}`,
          "studded",
          v((a.x + c.x) / 2, 25, (a.z + c.z) / 2),
          { hasCollision: true, length, width: 3.2, restitution: 0.45 },
          1,
          yaw,
        );
      }
      for (const p of [v(44, 25, 25), v(20, 25, 11), v(-2, 25, -6)])
        l.disc(`ski-rest-${p.x}`, p, 2.8);
      for (let i = 0; i < 5; i++) {
        const x = -31 - i * 8;
        l.oslo(`pointy-island-${i}`, "studded", v(x, 25, -23), {
          hasCollision: true,
          length: 3.3,
          width: 3.3,
          restitution: 0.45,
        });
        l.jump(
          `island-hop-${i}`,
          v(i === 0 ? -25 : x + 8, 25.03, -23),
          v(x, 25, -23),
          2.8,
          6,
        );
      }
      l.jump("last-island-hop", v(-63, 25.03, -23), v(-74, 25, -23), 2.8, 7);
      l.path(
        "ski-final-turn",
        [v(-72, 25, -23), v(-82, 25, -23), v(-82, 25, -11)],
        2.7,
      );
      const climb = l.path(
        "pointy-climb-support",
        [v(-82, 25, -11), v(-82, 41, 55)],
        2.8,
        false,
      );
      l.end = { ...climb.points.at(-4)! };
      l.objects = l.objects.filter(
        (o) => !o.id.endsWith("pointy-climb-support"),
      );
      const ramp = l.oslo(
        "pointy-final-climb",
        "studded",
        v(-82, 33, 22),
        {
          hasCollision: true,
          length: Math.hypot(66, 16),
          width: 2.8,
          restitution: 0.4,
        },
        1,
        -Math.PI / 2,
      );
      ramp.rotation.z = Math.atan2(16, 66);
      for (let i = 0; i < 4; i++) {
        const z = -4 + i * 16,
          y = 25 + ((z + 11) * 16) / 66;
        l.boost(
          `ski-climb-boost-${i}`,
          v(-82, y + 0.03, z),
          v(0, 0.24, 1),
          23,
          2.6,
        );
      }
      l.oslo("holmenkollen-ski-jump", "ski_jump", v(27, -8, -72), {}, 1.4);
      l.routes.push({
        points: nodes,
        widths: nodes.map(() => 3.2),
        banks: nodes.map(() => 0),
      });
      break;
    }
    case 8: {
      const approach = l.path(
        "harbor-approach",
        [v(-80, 29, -12), v(-65, 28, -12), v(-58, 24, -12), v(-43, 24, -12)],
        2.2,
      );
      l.finish(approach);
      l.path(
        "harbor-ring",
        norwayArc(0, 0, 38, Math.PI, Math.PI * 2, 24),
        2.6,
        false,
      );
      l.jump("ring-entry-hop", v(-44, 24.03, -12), v(-37, 24, -8), 2.1, 6);
      l.oslo("radial-harbor-spokes", "spokes", v(0, 24, 0), {
        hasCollision: true,
        norwayAction: "spin",
        radius: 37,
        width: 1.8,
        speed: 0.35,
        friction: 0.95,
      });
      l.disc("harbor-goal-island", v(0, 24, 0), 3);
      l.end = v(0, 24, 0);
      l.oslo("oslo-harbor", "harbor", v(0, -8, -78), {}, 1.6);
      break;
    }
    case 9: {
      l.finish(
        l.path(
          "sauna-hills",
          [
            v(-106, 30, 0),
            v(-95, 27, 0),
            v(-84, 26, 0),
            v(-74, 30, 0),
            v(-66, 26, 0),
            v(-60, 24, 0),
          ],
          2.5,
        ),
      );
      l.boost("sauna-hill-boost", v(-88, 26.3, 0), v(1, 0, 0), 23, 2.3);
      l.oslo(
        "sauna-orbit-0",
        "orbit_arm",
        v(-40, 24, 0),
        {
          hasCollision: true,
          norwayAction: "spin",
          radius: 17,
          width: 1.8,
          speed: 0.4,
          friction: 0.95,
        },
        1,
        Math.PI,
      );
      l.oslo("sauna-orbit-1", "orbit_arm", v(-5, 24, 0), {
        hasCollision: true,
        norwayAction: "spin",
        radius: 17,
        width: 1.8,
        speed: 0.4,
        friction: 0.95,
      });
      l.path(
        "sauna-station",
        [
          v(15, 24, 0),
          v(27, 24, 0),
          v(33, 23, 13),
          v(27, 18, 27),
          v(32, 18, 39),
        ],
        2.1,
      );
      const points = osloFerryTrack([
          v(32, 18, 42),
          v(26, 18, 75),
          v(36, 18, 110),
          v(20, 17, 145),
        ]),
        boat = l.oslo("sauna-ferry", "ferry", points[0], {
          hasCollision: true,
          norwayAction: "ferry",
          points,
          period: 36,
          friction: 0.95,
        });
      l.jump("ferry-disembark", v(32, 18.03, 42), v(20, 16, 160), 2.2, 9);
      l.objects.at(-1)!.properties = {
        ...l.objects.at(-1)!.properties,
        osloAnchor: boat.id,
        waitForArrival: true,
        triggerWidth: 6,
        triggerLength: 6,
      };
      l.disc("sauna-goal", v(20, 16, 160), 3.8);
      l.end = v(20, 16, 160);
      for (const p of [
        v(-40, 24, 0),
        v(-5, 24, 0),
        v(15, 24, 0),
        v(27, 18, 27),
      ])
        l.coin(v(p.x, p.y + 0.9, p.z));
      l.coin(v(32, 18.9, 42), boat.id);
      l.coin(v(20, 16.9, 160));
      l.coin(v(-99, 28.9, 0));
      l.coin(v(-67, 27.4, 0));
      l.oslo(
        "floating-nordic-sauna",
        "sauna",
        v(-25, -8, 80),
        { norwayAction: "steam" },
        1.5,
      );
      break;
    }
    case 10: {
      const first = l.path(
        "fortress-arrival",
        [
          v(90, 36, -20),
          v(71, 33, -20),
          v(57, 30, -20),
          v(41, 30, -20),
          v(27, 28, -8),
          v(34, 25, 10),
          v(17, 24, 23),
          v(-5, 24, 18),
          v(-17, 24, 4),
          v(-11, 24, -15),
          v(-27, 24, -26),
          v(-45, 24, -17),
        ],
        2.2,
      );
      l.finish(first);
      for (const [i, p] of [
        v(64, 31.5, -20),
        v(43, 30, -20),
        v(4, 24, 20),
      ].entries()) {
        l.oslo(`fortress-gate-${i}`, "gate", p, { hasCollision: true });
        l.jump(
          `fortress-gate-hop-${i}`,
          v(p.x + 3, p.y + 0.03, p.z),
          v(p.x - 4, p.y, p.z),
          2.2,
          6,
        );
      }
      const bridge = l.oslo(
        "fortress-moving-bridge",
        "bridge",
        v(-53, 24, -17),
        {
          hasCollision: true,
          norwayAction: "sway",
          speed: 0.55,
          amplitude: 0.2,
          length: 22,
          width: 2.1,
        },
      );
      l.jump("bridge-gate-hop", v(-49, 24.03, -17), v(-57, 24, -17), 2.1, 6);
      l.objects.at(-1)!.properties!.osloAnchor = bridge.id;
      const exit = l.path(
        "fortress-final-climb",
        [
          v(-64, 24, -17),
          v(-79, 25, -17),
          v(-85, 29, -4),
          v(-80, 34, 13),
          v(-65, 38, 20),
        ],
        2.2,
      );
      l.end = { ...exit.points.at(-4)! };
      for (const [i, fraction] of [0.45, 0.8].entries()) {
        const index = Math.floor(exit.points.length * fraction),
          p = exit.points[index],
          before = exit.points[index - 5],
          after = exit.points[index + 7],
          yaw = Math.atan2(-(after.z - before.z), after.x - before.x);
        l.oslo(
          `fortress-uphill-gate-${i}`,
          "gate",
          { ...p },
          { hasCollision: true },
          1,
          yaw,
        );
        l.jump(
          `fortress-uphill-hop-${i}`,
          v(before.x, before.y + 0.03, before.z),
          { ...after },
          2.1,
          9,
        );
        l.objects.at(-1)!.rotation.y = yaw;
      }
      l.oslo("akershus-fortress", "fortress", v(-9, -8, 72), {}, 1.65);
      break;
    }
  }
  l.prizes();
  l.backdrop();
  // Keep the skyline beyond the whole course, including the ferry and Correr8.
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
    id: `world-08-level-03-stage-${String(stage).padStart(2, "0")}`,
    world: 8,
    level: 3,
    stage,
    name: OSLO_NAMES[stage - 1],
    theme: "aurora",
    musicTrack: "sky_waltz",
    spawn: l.spawn,
    timeLimit: stage === 5 ? 150 : stage === 3 || stage === 9 ? 300 : 240,
    objects: l.objects,
    properties: { osloRevision: OSLO_REVISION, spawnYaw: l.yaw },
  };
}
export const WORLD_08_LEVEL_03_STAGES: Record<number, LevelData> =
  Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => [i + 1, build(i + 1)]),
  );

// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('8_3_')) Object.assign(WORLD_08_LEVEL_03_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(8,3,WORLD_08_LEVEL_03_STAGES);

