import type { Vector3Like } from 'three';

/** Segment against the portal opening, in its local coordinates. No per-frame allocations. */
export function crossesGoalOpening(from: Vector3Like, to: Vector3Like): boolean {
  let enter = 0, exit = 1;
  for (let index=0;index<3;index++) {
    const axis=index===0?'x':index===1?'y':'z';
    const min = axis === 'y' ? 0.1 : axis === 'x' ? -1.42 : -0.4;
    const max = axis === 'y' ? 3.2 : axis === 'x' ? 1.42 : 0.4;
    const start = from[axis], change = to[axis] - start;
    if (Math.abs(change) < 1e-9) {
      if (start < min || start > max) return false;
    } else {
      const a = (min - start) / change, b = (max - start) / change;
      enter = Math.max(enter, Math.min(a, b));
      exit = Math.min(exit, Math.max(a, b));
      if (enter > exit) return false;
    }
  }
  return true;
}
