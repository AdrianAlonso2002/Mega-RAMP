import type { LevelData } from "./LevelTypes";
import metadata from "./StageBudgets.json";
const stages = new Map<string, LevelData>();
let normalize: ((data: LevelData) => void) | undefined;
export function setStageNormalizer(callback: (data: LevelData) => void): void {
  normalize = callback;
  for (const data of stages.values()) callback(data);
}
const pending = new Map<number, Promise<void>>();
export function registerStageSet(
  world: number,
  level: number,
  data: Record<number, LevelData>,
): void {
  for (const [stage, value] of Object.entries(data)) {
    stages.set(`${world}_${level}_${stage}`, value);
    normalize?.(value);
  }
}
export function getRegisteredStage(
  world: number,
  level: number,
  stage: number,
): LevelData | null {
  return stages.get(`${world}_${level}_${stage}`) ?? null;
}
export function registeredLevel(
  world: number,
  level: number,
): Record<number, LevelData> {
  return new Proxy({} as Record<number, LevelData>, {
    get: (_, stage) =>
      getRegisteredStage(world, level, Number(stage)) ?? undefined,
  });
}
export function stageMetadata(world: number, level: number, stage: number) {
  return (metadata as Record<string, { count: number; name: string }>)[
    `${world}_${level}_${stage}`
  ];
}
const loaders: Record<number, Array<() => Promise<unknown>>> = {
  1: [
    () => import("./world-01/level-01-stages"),
    () => import("./world-01/level-02-stages"),
    () => import("./world-01/level-03-stages"),
    () => import("./world-01/level-04-stages"),
  ],
  2: [
    () => import("./world-02/level-01-stages"),
    () => import("./world-02/level-02-stages"),
    () => import("./world-02/level-03-stages"),
    () => import("./world-02/level-04-stages"),
  ],
  3: [
    () => import("./world-03/level-01-stages"),
    () => import("./world-03/level-02-stages"),
    () => import("./world-03/level-03-stages"),
    () => import("./world-03/level-04-stages"),
  ],
  4: [
    () => import("./world-04/level-01-stages"),
    () => import("./world-04/level-02-stages"),
    () => import("./world-04/level-03-stages"),
    () => import("./world-04/level-04-stages"),
  ],
  5: [
    () => import("./world-05/level-01-stages"),
    () => import("./world-05/level-02-stages"),
    () => import("./world-05/level-03-stages"),
    () => import("./world-05/level-04-stages"),
  ],
  6: [
    () => import("./world-06/level-01-stages"),
    () => import("./world-06/level-02-stages"),
    () => import("./world-06/level-03-stages"),
    () => import("./world-06/level-04-stages"),
  ],
  7: [
    () => import("./world-07/level-01-stages"),
    () => import("./world-07/level-02-stages"),
    () => import("./world-07/level-03-stages"),
    () => import("./world-07/level-04-stages"),
  ],
  8: [
    () => import("./world-08/level-01-stages"),
    () => import("./world-08/level-02-stages"),
    () => import("./world-08/level-03-stages"),
    () => import("./world-08/level-04-stages"),
  ],
};
export async function loadWorldStages(world: number): Promise<void> {
  if (!loaders[world]) throw new Error("Mundo desconocido");
  let promise = pending.get(world);
  if (!promise) {
    promise = Promise.all(loaders[world].map((load) => load()))
      .then(() => {})
      .catch((error) => {
        pending.delete(world);
        throw error;
      });
    pending.set(world, promise);
  }
  await promise;
}
