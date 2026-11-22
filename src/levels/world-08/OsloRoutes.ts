import { Vector3, CatmullRomCurve3 } from "three";
import type { Vector3Data } from "../LevelTypes";
export const OSLO_REVISION = "oslo-ultra-v1";
export const OSLO_NAMES = [
  "Viking Museum",
  "Opera House",
  "Correr8",
  "Sculpture Park",
  "Objetos31",
  "Royal Palace",
  "Ski Jump",
  "Harbor Docks",
  "Nordic Sauna",
  "Akershus Fortress",
];
export const OSLO_BUDGETS = [8, 8, 10, 10, 20, 8, 10, 8, 8, 10] as const;
export const OSLO_DECORATIONS = [
  ["swing", "Oslo · Puente cóncavo suspendido"],
  ["tile", "Oslo · Baldosa de precisión"],
  ["drum", "Oslo · Tambor giratorio"],
  ["studded", "Oslo · Baldosas puntiagudas"],
  ["spokes", "Oslo · Pasarelas radiales giratorias"],
  ["orbit_arm", "Oslo · Brazo y plataforma orbital"],
  ["ferry", "Oslo · Plataforma de transporte"],
  ["gate", "Oslo · Valla con hueco circular"],
  ["bridge", "Oslo · Puente giratorio con valla"],
  ["rotor", "Oslo · Rotor glaciar"],
  ["museum", "Oslo · Museo vikingo"],
  ["opera", "Oslo · Ópera"],
  ["sculptures", "Oslo · Parque de esculturas"],
  ["palace", "Oslo · Palacio Real"],
  ["ski_jump", "Oslo · Holmenkollen"],
  ["harbor", "Oslo · Muelles"],
  ["sauna", "Oslo · Sauna nórdica"],
  ["fortress", "Oslo · Fortaleza de Akershus"],
  ["building", "Oslo · Fachada del puerto"],
] as const;
export function osloFerryPose(
  time: number,
  points: Vector3Data[],
  period = 36,
) {
  if (!points || points.length < 2)
    points = [
      { x: 0, y: 0, z: 0 },
      { x: 30, y: 0, z: 0 },
    ];
  const t = ((time % period) + period) % period,
    travel = (period - 8) / 2;
  const progress =
    t < 4
      ? 0
      : t < 4 + travel
        ? (t - 4) / travel
        : t < 8 + travel
          ? 1
          : 1 - (t - 8 - travel) / travel;
  const scaled = Math.max(0, Math.min(1, progress)) * (points.length - 1),
    index = Math.min(points.length - 2, Math.floor(scaled)),
    a = points[index],
    b = points[index + 1],
    f = scaled - index;
  return {
    position: {
      x: a.x + (b.x - a.x) * f,
      y: a.y + (b.y - a.y) * f,
      z: a.z + (b.z - a.z) * f,
    },
    arrival: t >= 4 + travel && t < 8 + travel,
    tilt:
      t >= 5 + travel && t < 8 + travel
        ? Math.sin(((t - 5 - travel) / 3) * Math.PI) * 0.18
        : 0,
  };
}
/** Pre-sample curves once; moving ferries interpolate these stored world-space points. */
export function osloFerryTrack(nodes: Vector3Data[]) {
  const curve = new CatmullRomCurve3(
    nodes.map((p) => new Vector3(p.x, p.y, p.z)),
    false,
    "centripetal",
  );
  return curve.getSpacedPoints(100).map((p) => ({ x: p.x, y: p.y, z: p.z }));
}
