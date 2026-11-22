import type { Vector3Data } from "../LevelTypes";
export const FJORD_REVISION = "norway-fjords-v1";
export const FJORD_NAMES = [
  "Steep Valley",
  "Salto8",
  "Seven Sisters",
  "Kayak Rapids",
  "Objetos30",
  "Viking Fjord",
  "Wooden Pier",
  "Cliff Jump",
  "Whale Watching",
  "Geirangerfjord",
];
export const FJORD_BUDGETS = [8, 10, 8, 10, 20, 8, 8, 8, 10, 10] as const;
export const FJORD_DECORATIONS = [
  ["loop", "Fiordos · Rizo vertical"],
  ["pipe", "Fiordos · Tubo abierto giratorio"],
  ["shifter", "Fiordos · Traviesa móvil"],
  ["pontoon", "Fiordos · Columna sumergible"],
  ["stair", "Fiordos · Escalón móvil"],
  ["roll", "Fiordos · Pasarela basculante"],
  ["jump", "Fiordos · Salto de expedición"],
  ["cliff", "Fiordos · Acantilado"],
  ["waterfalls", "Fiordos · Las siete hermanas"],
  ["kayak", "Fiordos · Kayak"],
  ["longship", "Fiordos · Drakkar"],
  ["pier", "Fiordos · Embarcadero"],
  ["whale", "Fiordos · Ballena y surtidor"],
] as const;
/** A slight axial drift separates the loop's entry and exit without a shortcut. */
export function fjordLoopPoint(
  angle: number,
  radius: number,
  drift: number,
): Vector3Data {
  return {
    x: Math.sin(angle) * radius,
    y: -Math.cos(angle) * radius,
    z: (angle / (Math.PI * 2)) * drift,
  };
}
export function fjordMotion(
  action: string,
  time: number,
  index = 0,
  speed = 1,
) {
  const phase = time * speed + index * 0.57;
  if (action === "slide") return Math.sin(phase);
  if (action === "stairs") return Math.sin(phase) * 0.22;
  if (action === "roll") return Math.sin(phase) * 0.52;
  if (action === "pipe") return time * speed;
  return 0;
}
