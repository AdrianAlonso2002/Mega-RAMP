import type { LevelData } from "../LevelTypes";
export const TGB_LAUNCH_SPEED = 16;
/** Replace super-elastic restitution with a capped, contact-driven launch. */
export function upgradeTGBBounce(data: LevelData): LevelData {
  if (
    data.world !== 4 ||
    data.level !== 4 ||
    data.stage !== 8 ||
    data.properties?.tgbBounceRevision === 1
  )
    return data;
  for (const object of data.objects)
    if (object.properties?.variant === "tgb_burger")
      object.properties = {
        ...object.properties,
        bounce: 0,
        launchSpeed: TGB_LAUNCH_SPEED,
      };
  data.properties = { ...data.properties, tgbBounceRevision: 1 };
  return data;
}
