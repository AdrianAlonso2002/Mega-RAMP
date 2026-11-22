import {registerStageSet} from '../StageRegistry';
import type { LevelData, LevelObjectData, Vector3Data } from "../LevelTypes";
import { buildRiverFrames } from "../world-05/SellaRiver";
import {
  KYOTO_BUDGETS,
  KYOTO_NAMES,
  KYOTO_REVISION,
  kyotoRoute,
  v,
} from "./KyotoRoutes";
import { kyotoPathProperties } from "./KyotoModels";

class Layout {
  readonly objects: LevelObjectData[] = [];
  constructor(private readonly stage: number) {}
  add(
    name: string,
    type: LevelObjectData["type"],
    position: Vector3Data,
    scale = v(1, 1, 1),
    properties: Record<string, unknown> = {},
    yaw = 0,
  ) {
    this.objects.push({
      id: `w7s1${this.stage}-${name}`,
      type,
      position,
      scale,
      rotation: v(0, yaw, 0),
      properties,
    });
  }
  decor(
    name: string,
    kind: string,
    position: Vector3Data,
    scale = 1,
    yaw = 0,
    properties: Record<string, unknown> = {},
  ) {
    this.add(
      name,
      "decoration",
      position,
      v(scale, scale, scale),
      { subType: `kyoto_${kind}`, hasCollision: false, ...properties },
      yaw,
    );
  }
  island(
    name: string,
    kind: string,
    position: Vector3Data,
    scale = 1,
    yaw = 0,
  ) {
    // Scenery has a visible foundation; its base always meets the island surface.
    this.decor(`${name}-island`, "island", position, scale);
    this.decor(name, kind, position, scale, yaw);
  }
  coin(position: Vector3Data) {
    this.add(
      `coin-${this.objects.filter((o) => o.type === "collectible").length}`,
      "collectible",
      position,
    );
  }
}

function build(stage: number): LevelData {
  const l = new Layout(stage),
    route = kyotoRoute(stage),
    points = route.points,
    last = points.length - 1;
  if (stage === 1) route.widths = points.map(() => 28);
  const landingSamples = Math.min(12, Math.floor(last / 3));
  const startY = points[landingSamples].y,
    endY = points[last - landingSamples].y;
  for (let i = 0; i <= landingSamples; i++) {
    points[i].y = startY;
    points[last - i].y = endY;
    route.banks[i] = 0;
    route.banks[last - i] = 0;
  }
  // Wide, level landing areas are part of the ribbon, so there are no doubled floor faces.
  if (stage !== 1 && stage !== 5 && stage !== 8)
    for (let i = 0; i <= last; i++) {
      const endDistance = Math.min(i, last - i) * 0.7;
      route.widths[i] = Math.max(
        route.widths[i],
        5.8 - Math.min(5.8, endDistance * 0.65),
      );
      if (endDistance < 4) route.banks[i] = 0;
    }
  l.add(
    "recorrido",
    "decoration",
    v(0, 0, 0),
    v(1, 1, 1),
    kyotoPathProperties(
      route,
      [5, 6, 7, 9, 10].includes(stage),
      stage === 2 || stage === 9,
    ),
  );
  const frames = buildRiverFrames(points),
    end = points[last - 4],
    start = points[4];
  const sample = (t: number) => Math.min(last, Math.floor(t * last));
  const flank = (index: number, side: number, gap = 4) => {
    const p = points[index],
      f = frames[index],
      distance = route.widths[index] / 2 + gap;
    return v(
      p.x + f.x * distance * side,
      p.y - 2.4,
      p.z + f.z * distance * side,
    );
  };
  switch (stage) {
    case 1:
      l.decor("entrada", "torii", v(0, 12, 9), 1, 0, {
        width: 6,
        hasCollision: true,
      });
      for (let i = 0; i < 4; i++)
        for (const side of [-1, 1])
          l.island(
            `jardin-${side}-${i}`,
            ["sakura", "lantern", "zen", "pine"][i],
            v(side * 20, 9, 11 - i * 8),
            0.85,
          );
      l.island("santuario", "shrine", v(0, 9, -24), 1.2);
      break;
    case 2:
      for (let i = 12; i < last - 12; i += 21) {
        const p = points[i],
          a = points[i - 1],
          c = points[i + 1];
        l.decor(`torii-${i}`, "torii", p, 1, Math.atan2(c.x - a.x, c.z - a.z), {
          width: route.widths[i] + 1.3,
          hasCollision: true,
        });
      }
      l.island("santuario-inari", "shrine", v(0, 3, 0), 1.4);
      l.island("zorro-inari", "kitsune", v(-7, 3, 6), 1.3);
      break;
    case 3:
      for (let i = 12; i < last - 12; i += 19)
        for (const side of [-1, 1])
          l.island(`bambu-${side}-${i}`, "bamboo", flank(i, side, 4), 0.7);
      l.island("casa-arashiyama", "teahouse", v(-39, 8, -24), 1.3);
      break;
    case 4:
      for (let i = 25, row = 0; i < last - 18; i += 14, row++) {
        if (
          Array.from({ length: 10 }, (_, j) =>
            sample(0.08 + (0.82 * j) / 9),
          ).some((index) => Math.abs(index - i) < 5)
        )
          continue;
        const p = points[i],
          f = frames[i],
          width = route.widths[i];
        for (const side of row % 3 === 1 ? [0] : [-1, 1]) {
          const across = side * width * 0.32;
          l.add(
            `sakura-bumper-${i}-${side}`,
            "bumper",
            v(
              p.x + f.x * across,
              p.y + (route.banks[i] ?? 0) * across + 0.5,
              p.z + f.z * across,
            ),
            v(1.1, 1, 1.1),
            { color: "#b85e78", bounce: 1.1 },
          );
        }
      }
      for (let i = 12; i < last - 12; i += 26)
        for (const side of [-1, 1])
          l.island(`sakura-${side}-${i}`, "sakura", flank(i, side, 5), 0.85);
      for (const t of [0.85, 0.9, 0.95])
        for (const side of [-1, 1]) {
          const i = sample(t),
            p = points[i],
            f = frames[i];
          l.add(
            `parachoques-${side}-${i}`,
            "bumper",
            v(p.x + side * f.x * 3.6, p.y + 0.55, p.z + side * f.z * 3.6),
            v(1.3, 1, 1.3),
            { color: "#b85e78" },
          );
        }
      break;
    case 5:
      l.island("jardin-zen", "zen", v(-15, 9, 0), 1.8);
      l.island("te-matcha", "matcha", v(14, 10, -5), 2);
      l.island("farol", "paper_lantern", v(10, 10, 10), 1.2);
      l.island("templo", "shrine", v(0, 8, -24), 1.5);
      break;
    case 6:
      for (let i = 0; i < 8; i++)
        l.island(
          `gion-${i}`,
          "machiya",
          v(-36 + i * 10, 7, i % 2 ? -27 : 34),
          1.1,
          i % 2 ? 0 : Math.PI,
        );
      for (let i = 20; i < last; i += 34)
        l.island(`farol-${i}`, "paper_lantern", flank(i, 1, 3), 0.9);
      break;
    case 7:
      l.island("casa-te", "teahouse", v(-17, 8, 5), 1.6);
      l.island("ceremonia", "matcha", v(8, 11, 1), 2.8);
      l.island("jardin-te", "zen", v(34, 13, 0), 2);
      l.island("puente-jardin", "bridge", v(3, 11, 36), 1.8);
      for (const t of [0.1, 0.3, 0.5, 0.7, 0.9])
        l.island(`pino-${t}`, "pine", flank(sample(t), -1, 6), 1);
      break;
    case 8:
      l.island("kinkakuji", "pavilion", v(0, -10, 0), 1.5);
      for (const side of [-1, 1]) {
        l.island(`ala-${side}`, "zen", v(side * 37, 13, -12), 1.6);
        l.island(`pino-${side}`, "pine", v(side * 32, 8, 22), 1.4);
      }
      break;
    case 9:
      for (let index = 0; index < 6; index++) {
        const i = sample(0.16 + index * 0.125),
          p = points[i],
          f = frames[i],
          out = route.widths[i] / 2 + 1.7;
        l.decor(
          `katana-movil-${index}`,
          "sweeping_katana",
          v(p.x + f.x * out, p.y, p.z + f.z * out),
          1,
          Math.atan2(-f.z, f.x),
          { kyotoAction: "katana", hasCollision: true, index },
        );
      }
      l.island("dojo", "dojo", v(-36, 19, -17), 2.2);
      l.island("katanas", "katana", v(35, 9, 19), 2.4);
      for (let i = 20; i < last; i += 36)
        l.island(`lampara-${i}`, "lantern", flank(i, i % 2 ? 1 : -1, 4), 1.1);
      break;
    case 10:
      l.island("santuario-kitsune", "shrine", v(6, 17, -59), 2.3);
      for (const t of [0.1, 0.29, 0.48, 0.68, 0.88])
        for (const side of [-1, 1])
          l.island(
            `kitsune-${t}-${side}`,
            "kitsune",
            flank(sample(t), side, 4.5),
            1.3,
          );
      for (const t of [0.16, 0.37, 0.59, 0.8]) {
        const i = sample(t),
          p = points[i],
          a = points[i - 1],
          c = points[i + 1];
        l.decor(
          `arco-${t}`,
          "torii",
          p,
          0.95,
          Math.atan2(c.x - a.x, c.z - a.z),
          { hasCollision: true, width: 4 },
        );
      }
      break;
  }
  const count = KYOTO_BUDGETS[stage - 1];
  if (stage === 1) {
    for (const x of [-4.5, 4.5])
      for (const z of [8, 3, -3, -8]) l.coin(v(x, 12.85, z));
  } else if (stage === 5) {
    for (let z = 0; z < 5; z++)
      for (let x = 0; x < 4; x++) l.coin(v(-3.6 + x * 2.4, 12.8, 6 - z * 3));
  } else
    for (let i = 0; i < count; i++) {
      const p = points[sample(0.08 + (0.82 * i) / (count - 1))];
      l.coin(v(p.x, p.y + 0.85, p.z));
    }
  const previous = points[last - 5];
  l.add(
    "meta",
    "goal",
    v(end.x, end.y + 0.1, end.z),
    v(1, 1, 1),
    {},
    Math.atan2(previous.x - end.x, previous.z - end.z),
  );
  return {
    id: `world-07-level-01-stage-${String(stage).padStart(2, "0")}`,
    world: 7,
    level: 1,
    stage,
    name: KYOTO_NAMES[stage - 1],
    theme: "cherry_blossom",
    musicTrack: "sky_waltz",
    timeLimit: stage === 2 ? 210 : stage === 10 ? 240 : 180,
    spawn: v(start.x, start.y + 1.05, start.z),
    objects: l.objects,
    properties: {
      kyotoRevision: KYOTO_REVISION,
      ...(stage === 8 ? { spiralWidthRevision: "progressive-v1" } : {}),
    },
  };
}
export const WORLD_07_LEVEL_01_STAGES: Record<number, LevelData> =
  Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => [i + 1, build(i + 1)]),
  );

registerStageSet(7,1,WORLD_07_LEVEL_01_STAGES);

