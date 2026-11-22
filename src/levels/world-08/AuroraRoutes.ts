export const AURORA_REVISION = "aurora-finale-v1";
export const AURORA_NAMES = [
  "Arctic Tundra",
  "Husky Sled",
  "Ice Hotel",
  "Muro8",
  "Objetos32",
  "Reindeer Herd",
  "Frozen Lake",
  "Snowmobile Chase",
  "North Cape",
  "Northern Lights",
];
export const AURORA_BUDGETS = [8, 8, 10, 10, 20, 8, 8, 8, 10, 10] as const;
export const AURORA_DECORATIONS = [
  ["bypass", "Auroras · Pasarela en aro basculante"],
  ["scraper", "Auroras · Torre con rampa descendente"],
  ["pendulum", "Auroras · Pasarela péndulo"],
  ["gear", "Auroras · Engranaje de hielo"],
  ["wall", "Auroras · Muro lateral"],
  ["ribbons", "Auroras · Cortinas boreales"],
  ["tundra", "Auroras · Tundra ártica"],
  ["sled", "Auroras · Trineo y huskies"],
  ["hotel", "Auroras · Hotel de hielo"],
  ["reindeer", "Auroras · Manada de renos"],
  ["lake", "Auroras · Lago congelado"],
  ["snowmobile", "Auroras · Motos de nieve"],
  ["cape", "Auroras · Cabo Norte"],
] as const;
/** Adjacent pendulums strike their horizontal rest in alternation (four-second cycle). */
export function auroraPendulumAngle(time: number, index: number, speed = 1) {
  const phase = (time * speed * Math.PI) / 2 + (index % 2) * Math.PI;
  return Math.max(0, Math.sin(phase)) * 0.95 * (index % 2 === 0 ? 1 : -1);
}
