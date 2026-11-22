/** Surface contact creates a wake; only a submerged camera inside passable fluid gets a tint. */
export function fluidCameraSubmerged(
  cameraY: number,
  surfaceY: number,
  bottomY: number,
  passable: boolean,
  alreadySubmerged: boolean,
): boolean {
  return passable && cameraY >= bottomY &&
    cameraY < surfaceY - (alreadySubmerged ? 0.04 : 0.14);
}
