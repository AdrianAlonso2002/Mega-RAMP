import { CatmullRomCurve3, Vector3 } from "three";
import type { Vector3Data } from "../LevelTypes";

export const KYOTO_REVISION = "kyoto-challenges-v3";
export const TEA_TILT_LIMIT = 0.11;
export const TEA_PIVOT = { x: 8, y: 16, z: 0 };
/** Eight-second transfers and exactly two seconds resting at each side. */
export function teaTilt(time: number): number {
  const t = (((time + 4) % 20) + 20) % 20,
    smooth = (x: number) => x * x * (3 - 2 * x);
  return t < 8
    ? -TEA_TILT_LIMIT + 2 * TEA_TILT_LIMIT * smooth(t / 8)
    : t < 10
      ? TEA_TILT_LIMIT
      : t < 18
        ? TEA_TILT_LIMIT - 2 * TEA_TILT_LIMIT * smooth((t - 10) / 8)
        : -TEA_TILT_LIMIT;
}
export const kitsuneFireActive = (time: number) => ((time % 7) + 7) % 7 >= 5;
export const kitsuneEliminationActive = (time: number) =>
  ((time % 7) + 7) % 7 >= 5.5;
export interface KatanaPose {
  yaw: number;
  roll: number;
  striking: boolean;
}
export const KATANA_CUT_TIME = 0.16;
export const KATANA_RETURN_TIME = 2;
export const KATANA_CYCLE = KATANA_CUT_TIME + KATANA_RETURN_TIME;
/** A sharp diagonal cut, two seconds returning, and the next cut without a pause. */
export function katanaPose(time: number, index: number): KatanaPose {
  const t =
      (((time + (index * KATANA_CYCLE) / 6) % KATANA_CYCLE) + KATANA_CYCLE) %
      KATANA_CYCLE,
    smooth = (x: number) => x * x * (3 - 2 * x);
  if (t < KATANA_CUT_TIME) {
    const u = smooth(t / KATANA_CUT_TIME);
    return { yaw: -0.44 + 0.88 * u, roll: -1.24 + 1.22 * u, striking: true };
  }
  const u = smooth((t - KATANA_CUT_TIME) / KATANA_RETURN_TIME);
  return { yaw: 0.44 - 0.88 * u, roll: -0.02 - 1.22 * u, striking: false };
}
export const KYOTO_BUDGETS = [8, 10, 10, 10, 20, 8, 8, 8, 8, 10] as const;
export const KYOTO_NAMES = [
  "Cuadrado7",
  "Torii Gates",
  "Bamboo Forest",
  "Cherry Blossoms",
  "Objetos25",
  "Geisha District",
  "Tea Ceremony",
  "Golden Pavilion",
  "Katana Dojo",
  "Kitsune Shrine",
];
export const KYOTO_DECORATIONS = [
  ["torii", "Kioto · Torii bermellón"],
  ["bamboo", "Kioto · Bambú de Arashiyama"],
  ["sakura", "Kioto · Cerezo en flor"],
  ["lantern", "Kioto · Farol de piedra"],
  ["machiya", "Kioto · Casa tradicional de Gion"],
  ["pavilion", "Kioto · Pabellón dorado"],
  ["teahouse", "Kioto · Casa del té"],
  ["matcha", "Kioto · Cuenco de matcha"],
  ["kitsune", "Kioto · Zorro del santuario"],
  ["dojo", "Kioto · Dojo de madera"],
  ["katana", "Kioto · Expositor de katanas"],
  ["sweeping_katana", "Kioto · Katana de barrido"],
  ["zen", "Kioto · Jardín de piedras"],
  ["bridge", "Kioto · Puente de jardín"],
  ["shrine", "Kioto · Santuario"],
  ["paper_lantern", "Kioto · Farol de papel"],
  ["pine", "Kioto · Pino japonés"],
] as const;
export const v = (x: number, y: number, z: number): Vector3Data => ({
  x,
  y,
  z,
});
export interface KyotoRoute {
  points: Vector3Data[];
  widths: number[];
  banks: number[];
}

/** Sampled once when the level bundle is imported; never regenerated per frame. */
function smooth(
  nodes: Vector3Data[],
  width: number,
  wave = 0,
  bank = 0,
): KyotoRoute {
  const curve = new CatmullRomCurve3(
    nodes.map((p) => new Vector3(p.x, p.y, p.z)),
    false,
    "centripetal",
  );
  const count = Math.max(24, Math.ceil(curve.getLength() / 0.7));
  const points = curve
    .getSpacedPoints(count)
    .map((p, i) =>
      v(p.x, p.y + wave * Math.sin((i / count) * Math.PI * 6) ** 2, p.z),
    );
  return {
    points,
    widths: points.map(() => width),
    banks: points.map((_, i) => bank * Math.sin((i / count) * Math.PI * 8)),
  };
}
function polar(
  turns: number,
  r0: number,
  r1: number,
  y0: number,
  y1: number,
  width: number,
): KyotoRoute {
  const count = Math.ceil(turns * 220),
    points = Array.from({ length: count + 1 }, (_, i) => {
      const t = i / count,
        a = t * turns * Math.PI * 2,
        r = r0 + (r1 - r0) * t;
      return v(Math.cos(a) * r, y0 + (y1 - y0) * t, Math.sin(a) * r);
    });
  return {
    points,
    widths: points.map(() => width),
    banks: points.map(() => 0),
  };
}
export function kyotoRoute(stage: number): KyotoRoute {
  switch (stage) {
    case 1:
      return smooth([v(0, 12, 14), v(0, 12, -14)], 8);
    case 2:
      return polar(4, 23, 10, 64, 12, 3.1);
    case 3: {
      const route = smooth(
        [
          v(-28, 14, 27),
          v(-28, 17, -21),
          v(-27, 17, -27),
          v(-16, 17, -27),
          v(-15, 17, -21),
          v(-15, 11, 20),
          v(-14, 11, 26),
          v(0, 11, 26),
          v(1, 11, 20),
          v(1, 18, -20),
          v(2, 18, -26),
          v(14, 18, -26),
          v(15, 18, -20),
          v(15, 10.5, 20),
          v(18, 10.5, 26),
          v(35, 10.5, 26),
          v(49, 11, 15),
          v(49, 12, -3),
          v(35, 14, -14),
          v(28, 14, -18),
          v(31, 14, -27),
          v(39, 14, -27),
        ],
        1.7,
      );
      // Rest islands at reversals, smoothly joined to the same ribbon rather than overlapping slabs.
      route.widths = route.points.map((p) =>
        p.z > 20 || p.z < -21 ? 5.8 : 1.7,
      );
      return route;
    }
    case 4: {
      const r = smooth(
        [
          v(-30, 22, 27),
          v(-30, 22, 9),
          v(-32, 22, -9),
          v(-25, 22, -20),
          v(-13, 22, -20),
          v(-9, 21, -12),
          v(-5, 18, 0),
          v(3, 15, 7),
          v(22, 15, 7),
          v(34, 15, 2),
          v(38, 16, -9),
          v(33, 17, -21),
          v(22, 17, -25),
          v(7, 17, -25),
          v(-3, 17, -25),
        ],
        5.5,
        1.8,
        0.1,
      );
      r.widths = r.points.map((_, i) =>
        i / r.points.length > 0.81 ? 12 : 5.5,
      );
      return r;
    }
    case 5:
      return smooth([v(0, 12, 12), v(0, 12, -12)], 13);
    case 6:
      return smooth(
        [
          v(-38, 15, 12),
          v(-22, 16, 12),
          v(-22, 17, -4),
          v(-16, 18, -11),
          v(-6, 18, -9),
          v(-5, 17, 2),
          v(-5, 16, 14),
          v(7, 16, 21),
          v(25, 17, 21),
          v(36, 19, 11),
          v(36, 22, -4),
          v(25, 24, -12),
          v(7, 24, -12),
          v(-10, 24, -12),
          v(-25, 24, -12),
          v(-39, 24, -12),
        ],
        3.2,
        1.1,
      );
    case 7:
      return smooth(
        [
          v(-30, 12, -23),
          v(-30, 12, 16),
          v(-23, 13, 25),
          v(-13, 14, 25),
          v(-5, 15, 16),
          v(-5, 16, -16),
          v(3, 17, -25),
          v(13, 17, -25),
          v(21, 18, -16),
          v(21, 19, 16),
          v(29, 20, 25),
          v(39, 20, 25),
          v(46, 21, 16),
          v(46, 21, -24),
        ],
        5.2,
        0.65,
      );
    case 8: {
      // Saturn-like concentric galleries, linked by the spiral with open gaps between rings.
      const r = polar(2.6, 27, 8, 18, 18, 2.7);
      const first = r.points[0],
        last = r.points[r.points.length - 1];
      r.points.unshift(
        v(first.x + 16, 18, first.z),
        v(first.x + 8, 18, first.z),
      );
      r.points.push(v(last.x * 0.55, 18, last.z * 0.55));
      const joined = smooth(r.points, 1.35);
      const spiralStart = joined.points.findIndex((p) => p.x <= 27),
        spiralEnd = joined.points.length - 5;
      joined.widths = joined.points.map((_, i) => {
        if (i < spiralStart) return 5.8 + ((2.7 - 5.8) * i) / spiralStart;
        const progress = Math.min(
          1,
          (i - spiralStart) / Math.max(1, spiralEnd - spiralStart),
        );
        return 2.7 + (0.675 - 2.7) * progress;
      });
      return joined;
    }
    case 9:
      return smooth(
        [
          v(-24, 35, 28),
          v(-24, 35, 12),
          v(-16, 32, 3),
          v(-10, 28, -7),
          v(-17, 26, -18),
          v(-17, 26, -26),
          v(-4, 26, -26),
          v(7, 25, -26),
          v(15, 24, -19),
          v(15, 21, -7),
          v(25, 18, 4),
          v(25, 15, 17),
          v(17, 12, 25),
          v(7, 12, 25),
          v(7, 12, 12),
          v(0, 12, 6),
          v(-5, 12, 12),
          v(-5, 12, 25),
          v(-12, 12, 32),
        ],
        3.4,
        0.5,
        0.24,
      );
    case 10:
      return smooth(
        [
          v(-37, 14, 30),
          v(-37, 14, 9),
          v(-27, 15, 0),
          v(-9, 17, 0),
          v(9, 20, 0),
          v(28, 22, -5),
          v(36, 22, -17),
          v(30, 22, -30),
          v(12, 22, -33),
          v(-4, 23, -25),
          v(-4, 25, -8),
          v(-4, 26, 9),
          v(8, 26, 18),
          v(22, 26, 12),
          v(22, 28, -4),
          v(12, 32, -15),
          v(-10, 32, -15),
          v(-24, 33, -21),
          v(-24, 35, -38),
          v(-10, 36, -44),
          v(8, 36, -44),
        ],
        2.5,
        0.4,
      );
    default:
      throw new Error(`Unknown Kyoto stage: ${stage}`);
  }
}
