/** Five progressively higher bounces, bounded by the actual goal height.
 * Gravity-only launch is a conservative ceiling: air damping lowers the apex.
 * Falling speed deliberately does not feed back into the next launch.
 */
export function mattressLaunchSpeed(bounce: number, launchY: number, goalY: number, gravity: number): number {
  const ceiling = Math.max(0, goalY + 5 - launchY);
  const firstRise = Math.min(4, ceiling);
  const progress = (Math.max(1, Math.min(5, bounce)) - 1) / 4;
  const rise = firstRise + (ceiling - firstRise) * progress;
  return Math.sqrt(2 * Math.abs(gravity) * rise);
}
