import type { LevelData } from "../LevelTypes";

/** One-time upgrade shared by published layouts, browser saves and editor sync. */
export function upgradeVivaGymChallenge(data: LevelData): LevelData {
  if (data.world !== 4 || data.level !== 4 || data.stage !== 10 || data.properties?.vivaGymChallengeRevision === 1) return data;
  for (const object of data.objects) {
    if (object.properties?.movementType !== "vivagym_obstacle") continue;
    object.properties = { ...object.properties, speed: Number(object.properties.speed ?? 8.5) * 1.2 };
    const oldWidth = object.scale.x;
    object.scale.x = object.properties.obstacleForm === "bar" ? Math.max(6.8, oldWidth * 1.3) : oldWidth * 1.3;
    // Cylinders use their X diameter for both the visual and physical footprint.
    if (object.properties.obstacleForm === "drum") object.scale.z = object.scale.x;
  }
  data.properties = { ...data.properties, vivaGymChallengeRevision: 1 };
  return data;
}
