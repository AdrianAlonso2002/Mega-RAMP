import { describe, expect, it } from 'vitest';
import { mattressLaunchSpeed } from '../src/levels/MattressBounce';

describe('progressive mattress launch', () => {
  it('increases over five bounces and caps further bounces at goal + 5', () => {
    for (const goalY of [12.8, 20, 30]) {
      let previous = 0;
      for (let bounce = 1; bounce <= 8; bounce++) {
        const launchY = 1.35, speed = mattressLaunchSpeed(bounce, launchY, goalY, -18);
        const apex = launchY + speed * speed / 36;
        expect(speed).toBeGreaterThanOrEqual(previous);
        expect(apex).toBeLessThanOrEqual(goalY + 5 + 1e-10);
        if (bounce >= 5) expect(apex).toBeCloseTo(goalY + 5);
        previous = speed;
      }
    }
  });
  it('accounts for launch height and gravity without launching above a lower ceiling', () => {
    for (const gravity of [-9, -18, -30]) {
      const speed = mattressLaunchSpeed(5, 3, 12.8, gravity);
      expect(3 + speed * speed / (2 * Math.abs(gravity))).toBeCloseTo(17.8);
    }
    expect(mattressLaunchSpeed(5, 20, 12.8, -18)).toBe(0);
  });
});
