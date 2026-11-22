import {registerStageSet} from '../StageRegistry';
import type { LevelData, Vector3Data } from "../LevelTypes";
import { LondonLayout, v } from "./LondonLayout";
import { WORLD_05_LEVEL_04_STAGES } from "../world-05/level-04-stages";
import {
  BIG_BEN_REVISION,
  EYE_CABINS,
  EYE_CENTRE_Y,
  EYE_RADIUS,
  chocolateRoute,
  clockTowerRoute,
  thamesRoute,
  toyPlaneHeight,
  TOY_LANDING_Y,
  TOWER_TOP_Y,
  towerTraps,
  TOWER_COIN_IDS,
  towerCoinPositions,
} from "./BigBenRoutes";
class Layout extends LondonLayout {
  constructor(n: number) {
    super(n, 4);
  }
  ben(
    name: string,
    kind: string,
    p: Vector3Data,
    scale = v(1, 1, 1),
    props: Record<string, unknown> = {},
    yaw = 0,
  ) {
    this.add(
      name,
      "decoration",
      p,
      scale,
      { subType: `bigben_${kind}`, hasCollision: false, ...props },
      v(0, yaw, 0),
    );
  }
  path(
    name: string,
    points: Vector3Data[],
    width: number,
    props: Record<string, unknown> = {},
  ) {
    this.ben(name, "road", v(0, 0, 0), v(1, 1, 1), {
      points,
      width,
      hasCollision: true,
      ...props,
    });
  }
}
const names = [
  "King’s Cross",
  "Hamleys",
  "Oxford Street",
  "Muro6",
  "Objetos24",
  "Expensive Chocolate",
  "Buckingham Palace",
  "River Thames",
  "London Eye",
  "Big Ben",
];
function stage(
  n: number,
  spawn: Vector3Data,
  timeLimit: number,
  build: (l: Layout) => void,
  properties: Record<string, unknown> = {},
): LevelData {
  const l = new Layout(n);
  build(l);
  if (![1, 8, 10].includes(n))
    for (const side of [-1, 1])
      l.decor(
        `navidad-${side}`,
        "christmas_tree",
        v(side * 26, -5, -25),
        v(2.5, 2.5, 2.5),
      );
  return {
    id: `world-06-level-04-stage-${String(n).padStart(2, "0")}`,
    world: 6,
    level: 4,
    stage: n,
    name: names[n - 1],
    theme: "winter",
    musicTrack: n === 8 ? "arcade_rush" : "sky_waltz",
    spawn,
    timeLimit,
    objects: l.objects,
    properties: { bigBenRevision: BIG_BEN_REVISION, ...properties },
  };
}
export const WORLD_06_LEVEL_04_STAGES: Record<number, LevelData> = {
  1: stage(1, v(0, 13.05, 23), 130, (l) => {
    l.block("anden", v(0, 11.6, -32), v(28, 0.8, 124), "#b9b4a7");
    l.ben("estacion", "station", v(0, 12, -30));
    for (const side of [-1, 1])
      l.ben(
        `tren-cerrado-${side}`,
        "steam_train",
        v(side * 11, 12, -30),
        v(1, 1, 2.2),
        { closed: true, modern: true, hasCollision: true },
      );
    for (let i = 1; i <= 10; i++)
      l.ben(`columna-${i}`, "column", v(0, 12, 18 - i * 10), v(1, 1, 1), {
        number: i,
        hasCollision: true,
        benAction: i === 9 ? "portal" : undefined,
      });
    l.block("anden-magico", v(80, 11.6, -6), v(18, 0.8, 48), "#bdac8e");
    l.ben("columna-secreta", "column", v(85, 12, 14), v(1, 1, 1), {
      number: "9 ¾",
      hasCollision: true,
    });
    l.ben("expreso", "steam_train", v(80, 12, -14), v(1, 1, 1), {
      hasCollision: true,
    });
    l.path("acceso-expreso", [v(80, 12, 1), v(80, 12.5, -4)], 3.6);
    l.decor("estrella-magica", "star", v(80, 21, -12), v(2, 2, 2));
    l.coins([v(3, 12.8, -12), v(-3, 12.8, -42), v(80, 13.3, -10)]);
    l.goal(v(80, 12.6, -19));
  }),
  2: stage(
    2,
    v(0, 13.05, 33),
    150,
    (l) => {
      l.block("salida", v(0, 11.6, 32), v(12, 0.8, 14), "#b24d62");
      l.block(
        "llegada",
        v(0, TOY_LANDING_Y - 0.4, -76),
        v(12, 0.8, 16),
        "#c8b06b",
      );
      for (let i = 0; i < 3; i++) {
        l.ben(
          `avion-${i}`,
          "toy_plane",
          v(0, toyPlaneHeight(i), 8 - i * 30),
          v(1, 1, 1),
          { index: i, benAction: "plane", hasCollision: true },
        );
        l.ben(
          `techo-${i}`,
          "column",
          v(24, 12, 8 - i * 30),
          v(0.65, 2.8, 0.65),
          { number: "HAMLEYS" },
        );
      }
      l.decor("hamleys", "terrace", v(28, 0, -22), v(2, 2, 2));
      l.coins([
        v(0, 12.8, 26),
        v(0, toyPlaneHeight(1) + 0.8, -7),
        v(0, toyPlaneHeight(2) + 0.8, -37),
        v(0, TOY_LANDING_Y + 0.8, -69),
      ]);
      l.goal(v(0, TOY_LANDING_Y + 0.1, -79));
    },
    { hamleysRevision: 2 },
  ),
  3: stage(3, v(0, 13.05, 24), 120, (l) => {
    const heights = [12, 16, 11, 15];
    heights.forEach((y, i) => {
      const z = 24 - i * 40;
      l.block(`isla-${i}`, v(0, y - 0.4, z), v(14, 0.8, 14), "#b5bea6");
      if (i < 3) {
        const x = i % 2 ? -4 : 4;
        l.path(
          `inclinado-${i}`,
          [v(x, y, z - 7), v(x, heights[i + 1], z - 33)],
          i === 2 ? 1.65 : 2.3,
          { bank: i % 2 ? -0.14 : 0.14 },
        );
      }
      l.coins([v(i % 2 ? -4 : 4, y + 0.8, z)]);
    });
    for (const side of [-1, 1])
      l.decor(
        `oxford-street-${side}`,
        "terrace",
        v(side * 30, -13, -35),
        v(2, 2, 2),
        {},
        side > 0 ? -Math.PI / 2 : Math.PI / 2,
      );
    l.goal(v(0, 15.1, -98));
  }),
  4: stage(4, { ...WORLD_05_LEVEL_04_STAGES[4].spawn }, 150, (l) => {
    for (const obj of structuredClone(WORLD_05_LEVEL_04_STAGES[4].objects)) {
      if (obj.type === "decoration") continue;
      obj.id = `w6s44-${obj.id}`;
      if (
        obj.type === "platform" ||
        obj.type === "ramp" ||
        obj.type === "moving-platform"
      )
        obj.properties = {
          ...obj.properties,
          theme: "custom_color",
          customColor: obj.id.includes("wall")
            ? "#a28d6c"
            : obj.id.includes("lift")
              ? "#546f7c"
              : "#b5aa90",
        };
      if (obj.id.includes("wall")) {
        obj.scale.y *= 1.1;
        obj.properties = {
          ...obj.properties,
          speed: Number(obj.properties?.speed ?? 1) * 1.08,
        };
      }
      l.objects.push(obj);
    }
    l.objects
      .filter((o) => o.type === "platform")
      .forEach((o, i) =>
        l.decor(
          `farol-${i}`,
          "lamp",
          v(
            o.position.x + o.scale.x / 2 - 0.8,
            o.position.y + o.scale.y / 2,
            o.position.z,
          ),
          v(1.3, 1.3, 1.3),
        ),
      );
    l.ben("palacio", "palace", v(0, -25, -55), v(2, 2, 2));
  }),
  5: stage(5, v(0, 13.05, 21), 120, (l) => {
    l.block("plaza", v(0, 11.6, -8), v(42, 0.8, 64), "#b9ad93");
    for (let i = 0; i < 20; i++)
      l.coins([v(((i % 4) - 1.5) * 3, 12.8, 5 - Math.floor(i / 4) * 6)]);
    l.coins([v(0, 12.8, -7)]);
    l.ben("big-ben", "clock", v(-15, 12, -9), v(0.8, 0.8, 0.8), {
      hasCollision: true,
    });
    l.ben("tower-bridge", "bridge", v(14, 12, -20), v(0.3, 0.3, 0.3), {
      hasCollision: true,
    });
    l.ben("shard", "shard", v(15, 12, 7), v(0.35, 0.35, 0.35), {
      hasCollision: true,
    });
    l.decor("cabina", "telephone", v(-15, 12, 10), v(1.2, 1.2, 1.2));
    l.goal(v(0, 12.1, -35));
  }),
  6: stage(6, v(0, 65.05, 27), 170, (l) => {
    l.block("salida", v(0, 63.6, 27), v(10, 0.8, 14), "#613722");
    for (let lane = 0; lane < 2; lane++) {
      const points = chocolateRoute(lane);
      l.path(`trenza-${lane}`, points, 3.4, {
        stairs: true,
        chocolate: true,
        widths: points.map(
          (_, i) =>
            3.4 - 1.4 * Math.max(0, Math.min(1, (i / 240 - 0.45) / 0.1)),
        ),
      });
    }
    for (let i = 0; i < 4; i++)
      l.ben(
        `chocolate-${i}`,
        "chocolate_fall",
        v(0, -16, 20 - 150 * (0.125 + i * 0.25)),
        v(1, 1, 1),
        { benAction: "chocolate", height: 86, index: i },
      );
    l.block("llegada", v(0, 9.6, -134), v(10, 0.8, 14), "#613722");
    l.goal(v(0, 10.1, -137));
    l.coins(
      [0, 1].flatMap((lane) =>
        chocolateRoute(lane)
          .filter((_, i) => i > 0 && i % 40 === 0)
          .map((p) => v(p.x, p.y + 0.8, p.z)),
      ),
    );
  }),
  7: stage(7, v(0, 14.05, 39), 130, (l) => {
    l.path(
      "pista",
      [v(0, 14, 44), v(0, 12, 30), v(0, 12, -78), v(0, 15, -95)],
      32,
    );
    for (let i = 0; i < 5; i++)
      l.ben(`guardia-${i}`, "guard", v((i - 2) * 6, 12, -22), v(1, 1, 1), {
        benAction: "guard",
        index: i,
        hasCollision: true,
      });
    for (const x of [-9, -3, 3, 9])
      l.block(`separador-${x}`, v(x, 12.28, -24), v(0.14, 0.56, 94), "#b49b6b");
    l.ben("buckingham", "palace", v(0, -2, -127), v(2, 2, 2));
    l.coins(
      Array.from({ length: 10 }, (_, i) =>
        v(((i % 5) - 2) * 6, 12.85, 15 - Math.floor(i / 5) * 67),
      ),
    );
    l.goal(v(0, 13, -83));
  }),
  8: stage(
    8,
    v(0, 65.05, 24),
    130,
    (l) => {
      const points = thamesRoute();
      l.add("tamesis", "decoration", v(0, 0, 0), v(1, 1, 1), {
        subType: "asturias_sella_river",
        hasCollision: true,
        points,
        width: 6.2,
        current: 9,
        urban: true,
      });
      l.add("canoa", "decoration", v(0, 64, 24), v(1, 1, 1), {
        subType: "asturias_sella_canoe",
        sellaAction: "canoe",
        hasCollision: true,
      });
      for (const side of [-1, 1])
        l.ben(
          `shard-${side}`,
          "shard",
          v(side * 40, -12, -130),
          v(2.5, 2.5, 2.5),
        );
      l.ben("london-eye", "wheel", v(-70, 25, -280), v(2, 2, 2));
      l.ben("big-ben", "clock", v(48, -5, -300), v(2, 2, 2));
      const end = points.at(-1)!;
      l.ben("tower-bridge", "bridge", v(end.x, end.y, -294), v(1, 1, 1));
      l.coins(
        points
          .filter((_, i) => i > 0 && i % 22 === 0)
          .map((p) => v(p.x, p.y + 0.85, p.z)),
      );
      l.goal(v(end.x, end.y + 0.35, -311));
    },
    { sellaCanoe: true, boardAtSpawn: true },
  ),
  9: stage(9, v(0, 14.05, 12), 180, (l) => {
    l.block("embarque", v(0, 12.6, 12), v(9, 0.8, 20), "#a9c1c1");
    l.block("salida", v(0, 12.6, -9), v(8, 0.8, 12), "#a9c1c1");
    l.ben("noria", "wheel", v(0, EYE_CENTRE_Y, 0), v(1, 1, 1), {
      benAction: "wheel",
    });
    for (let i = 0; i < EYE_CABINS; i++)
      l.ben(`cabina-${i}`, "cabin", v(0, EYE_CENTRE_Y, 0), v(1, 1, 1), {
        benAction: "cabin",
        index: i,
        hasCollision: true,
      });
    l.coins(
      [
        (Math.PI * 2) / 3,
        Math.PI,
        (Math.PI * 4) / 3,
        Math.PI / 3,
        0,
        -Math.PI / 3,
      ].map((a) =>
        v(
          Math.cos(a) * EYE_RADIUS,
          EYE_CENTRE_Y + Math.sin(a) * EYE_RADIUS + 0.8,
          0,
        ),
      ),
    );
    l.goal(v(0, 13.1, -12));
  }),
  10: stage(10, v(10, 13.05, 10), 240, (l) => {
    const route = clockTowerRoute();
    l.path(
      "ascenso",
      route.map((n) => n.point),
      3.2,
      { widths: route.map((n) => n.width), antique: true },
    );
    l.ben("torre", "tower", v(0, 0, 0), v(1, 1, 1), { hasCollision: true });
    for (const trap of towerTraps())
      l.ben(
        `bloque-${trap.index}`,
        "trap",
        trap.position,
        v(1, 1, 1),
        {
          benAction: "trap",
          index: trap.index,
          direction: trap.direction,
          floor: trap.floor,
          hasCollision: true,
        },
        Math.atan2(trap.direction.x, trap.direction.z),
      );
    towerCoinPositions().forEach((point, i) =>
      l.add(
        `coin-${TOWER_COIN_IDS[i]}`,
        "collectible",
        point,
        v(0.42, 0.42, 0.42),
      ),
    );
    l.block(
      "campanario",
      v(10, TOWER_TOP_Y - 0.4, 10),
      v(6, 0.8, 6),
      "#b59a67",
    );
    l.goal(v(10, TOWER_TOP_Y + 0.1, 10));
  }),
};

registerStageSet(6,4,WORLD_06_LEVEL_04_STAGES);

