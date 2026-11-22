import { naraPath, nv } from "../world-07/NaraRoutes";
import type { Vector3Data } from "../LevelTypes";
export { nv as v, naraPath as norwayPath };
export const NORWAY_REVISION = "norway-mountains-v1";
export const NORWAY_NAMES = [
  "Cuadrado8",
  "Trolltunga Cliff",
  "Glacier Hike",
  "Mountain Cabins",
  "Objetos29",
  "Pulpit Rock",
  "Snowy Peaks",
  "Avalanche Run",
  "Troll Cave",
  "Lofoten Islands",
];
export const NORWAY_BUDGETS = [8, 10, 10, 8, 20, 8, 8, 10, 8, 10] as const;
export const NORWAY_DECORATIONS = [
  ["mountain", "Noruega · Pico nevado"],
  ["glacier", "Noruega · Glaciar azul"],
  ["trolltunga", "Noruega · Saliente de Trolltunga"],
  ["pulpit", "Noruega · Preikestolen"],
  ["cabin", "Noruega · Cabaña de montaña"],
  ["rorbu", "Noruega · Cabaña pesquera"],
  ["pine", "Noruega · Abeto nevado"],
  ["cave", "Noruega · Cueva de hielo"],
  ["troll", "Noruega · Trol de piedra"],
  ["fjord", "Noruega · Fiordo"],
  ["cairn", "Noruega · Hito de montaña"],
  ["lantern", "Noruega · Farol cálido"],
  ["crystals", "Noruega · Cristales de hielo"],
  ["disc", "Noruega · Disco glaciar"],
  ["funnel", "Noruega · Embudo de hielo"],
  ["tile", "Noruega · Placa basculante"],
  ["snowball", "Noruega · Bola de avalancha"],
  ["tower", "Noruega · Torre espiral giratoria"],
  ["swing_arc", "Noruega · Arco glaciar giratorio"],
  ["boost", "Noruega · Impulsor de expedición"],
] as const;
export function norwayArc(
  cx: number,
  cz: number,
  r: number,
  start: number,
  turn: number,
  y0: number,
  y1 = y0,
): Vector3Data[] {
  const count = Math.max(16, Math.ceil((Math.abs(turn) * r) / 0.65));
  return Array.from({ length: count + 1 }, (_, i) => {
    const t = i / count,
      a = start + turn * t;
    return nv(cx + Math.cos(a) * r, y0 + (y1 - y0) * t, cz + Math.sin(a) * r);
  });
}
/** Time to read the plate, a quick flip, and a full turn back to its flat pose. */
export function norwayTileAngle(
  time: number,
  index: number,
  speed = 1,
): number {
  const period = 5.8,
    t = (((time * speed + index * 0.37) % period) + period) % period;
  if (t < 2.2) return 0;
  const u = (t - 2.2) / 3.6;
  return u * u * (3 - 2 * u) * Math.PI * 2;
}
