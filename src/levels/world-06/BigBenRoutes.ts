import { Vector3 } from "three";
export const BIG_BEN_REVISION = "big-ben-christmas-v2";
export const BIG_BEN_DECORATIONS = [
  ["station", "King’s Cross · Estación"],
  ["column", "Columna numerada"],
  ["steam_train", "Hogwarts · Tren de vapor"],
  ["toy_plane", "Hamleys · Avión suspendido"],
  ["chocolate", "Escaleras de chocolate"],
  ["chocolate_fall", "Cascada de chocolate"],
  ["guard", "Guardia a caballo"],
  ["palace", "Buckingham Palace"],
  ["shard", "The Shard"],
  ["bridge", "Tower Bridge"],
  ["wheel", "London Eye · Noria"],
  ["cabin", "Cabina de London Eye"],
  ["tower", "Big Ben · Interior"],
  ["clock", "Esfera de Big Ben"],
  ["trap", "Bloque del reloj"],
  ["road", "Pasarela londinense"],
] as const;
export const TOY_RADIUS = 15;
export const PORTAL_MIN_SPEED = 50 / 3.6;
export const TOY_HEIGHT = 10.9,
  TOY_HEIGHT_STEP = 2.8,
  TOY_LANDING_Y = TOY_HEIGHT - 2 * TOY_HEIGHT_STEP - 0.4;
export const toyPlaneHeight = (index: number) =>
  TOY_HEIGHT - index * TOY_HEIGHT_STEP;
export function toyPlanePose(time: number, index: number) {
  const a = time * 0.35 + index * Math.PI;
  return {
    position: new Vector3(
      Math.sin(a) * TOY_RADIUS,
      toyPlaneHeight(index),
      8 - index * 30 + Math.cos(a) * TOY_RADIUS,
    ),
    yaw: a + Math.PI / 2,
  };
}
export const EYE_CABINS = 18,
  EYE_RADIUS = 20,
  EYE_CENTRE_Y = 33,
  EYE_SPEED = 0.14,
  EYE_RIDE_TIME = Math.PI / EYE_SPEED;
export function eyeCabinPose(time: number, index: number): Vector3 {
  const angle =
    -Math.PI / 2 +
    Math.max(0, time) * EYE_SPEED +
    (index * Math.PI * 2) / EYE_CABINS;
  return new Vector3(
    Math.cos(angle) * EYE_RADIUS,
    EYE_CENTRE_Y + Math.sin(angle) * EYE_RADIUS,
    0,
  );
}
export function guardPose(time: number, index: number) {
  const phase = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3, (Math.PI * 2) / 3, 0][
    index % 5
  ];
  const a = time * 1.48 + phase;
  return {
    z: -22 + Math.sin(a) * 44,
    direction: Math.cos(a) >= 0 ? 0 : Math.PI,
  };
}
export function clockTrapExtension(time: number, index: number): number {
  const phase = (((time + index * 0.57) % 3) + 3) % 3;
  if (phase < 2.15) return 0;
  if (phase < 2.3) return (phase - 2.15) / 0.15;
  if (phase < 2.75) return 1;
  return (3 - phase) / 0.25;
}
export function chocolateRoute(lane: number): Vector3[] {
  return Array.from({ length: 241 }, (_, i) => {
    const t = i / 240,
      a = t * Math.PI * 4,
      side = lane === 0 ? 1 : -1;
    return new Vector3(
      side * 18 * Math.sin(a),
      Math.floor(
        (64 -
          54 * t +
          side * 2.4 * Math.sin(a) +
          (lane ? 5 * Math.sin(Math.PI * t) : 0)) *
          2 +
          1e-8,
      ) / 2,
      20 - 150 * t,
    );
  });
}
export function thamesRoute(): Vector3[] {
  return Array.from({ length: 241 }, (_, i) => {
    const t = i / 240;
    return new Vector3(
      Math.sin(t * Math.PI * 2) * 10,
      64 - 57 * t - 12 * Math.sin(Math.PI * t * 2),
      24 - 340 * t,
    );
  });
}
export interface TowerNode {
  point: Vector3;
  width: number;
  floor: number;
}
export const TOWER_FLOORS = 12,
  TOWER_TOP_Y = 12 + TOWER_FLOORS * 6.4,
  TOWER_HEIGHT = TOWER_TOP_Y + 13;
export const TOWER_COIN_IDS = [0, 1, 3, 4, 6, 7, 9, 10, 12, 13, 15, 16, 18, 19];
export function towerCoinPositions() {
  const route = clockTowerRoute();
  return TOWER_COIN_IDS.map((_, i) => {
    const node =
      route[
        Math.min(
          route.length - 2,
          Math.round(((i + 0.5) / TOWER_COIN_IDS.length) * (route.length - 2)),
        )
      ];
    return node.point.clone().add(new Vector3(0, 0.8, 0));
  });
}
export const towerTrapCount = (floor: number) =>
  floor <= 1 ? 0 : Math.min(5, Math.floor(floor / 2));
export function towerTraps() {
  const corners = [
      [10, 10],
      [-10, 10],
      [-10, -10],
      [10, -10],
    ],
    traps = [];
  for (let floor = 1; floor <= TOWER_FLOORS; floor++)
    for (let i = 0; i < towerTrapCount(floor); i++) {
      const edge = i % 4,
        t = i === 4 ? 0.7 : i === 0 && towerTrapCount(floor) > 4 ? 0.3 : 0.5,
        a = corners[edge],
        b = corners[(edge + 1) % 4];
      const direction = new Vector3(
        edge === 1 ? -1 : edge === 3 ? 1 : 0,
        0,
        edge === 0 ? 1 : edge === 2 ? -1 : 0,
      );
      const point = new Vector3(
        a[0] + (b[0] - a[0]) * t,
        12 + (floor - 1) * 6.4 + edge * 1.6 + ((t - 0.1) / 0.8) * 1.6 + 0.7,
        a[1] + (b[1] - a[1]) * t,
      );
      const position = point.clone().addScaledVector(direction, 4.85);
      traps.push({ floor, edge, position, direction, index: traps.length });
    }
  return traps;
}
export function clockTowerRoute(): TowerNode[] {
  const corners = [
      [10, 10],
      [-10, 10],
      [-10, -10],
      [10, -10],
    ],
    points: TowerNode[] = [];
  for (let edge = 0; edge < TOWER_FLOORS * 4; edge++) {
    const a = corners[edge % 4],
      b = corners[(edge + 1) % 4],
      height = 12 + edge * 1.6,
      floor = Math.floor(edge / 4),
      width = floor >= 9 && floor <= 10 ? 1.65 : 3.2;
    for (const t of [0, 0.1, 0.9, 1]) {
      if (edge && t === 0) continue;
      const rise = t <= 0.1 ? 0 : t >= 0.9 ? 1.6 : ((t - 0.1) / 0.8) * 1.6;
      points.push({
        point: new Vector3(
          a[0] + (b[0] - a[0]) * t,
          height + rise,
          a[1] + (b[1] - a[1]) * t,
        ),
        width,
        floor,
      });
    }
  }
  return points;
}
