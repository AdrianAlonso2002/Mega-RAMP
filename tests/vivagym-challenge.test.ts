import { describe, expect, it } from 'vitest';
import { WORLD_04_LEVEL_04_STAGES } from '../src/levels/world-04/level-04-stages';
import { sampleVivaGymObstacle } from '../src/levels/RequestedStageUpdates';
import { upgradeVivaGymChallenge } from '../src/levels/world-04/VivaGymChallenge';

describe('VivaGYM final challenge', () => {
  const data = WORLD_04_LEVEL_04_STAGES[10];
  const obstacles = data.objects.filter(o => o.properties?.movementType === 'vivagym_obstacle');
  const radius = .75;

  it('covers both former straight corridors while leaving room around each passing row', () => {
    expect(obstacles).toHaveLength(24);
    // Every fixed lateral line meets an obstacle somewhere during the circuit.
    for (let x = -9; x <= 9; x += .1) {
      expect(obstacles.some(o => Math.abs(o.position.x - x) < o.scale.x / 2 + radius), `straight lane at ${x}`).toBe(true);
    }
    for (let time = 0; time < 20; time += .4) {
      const moving = obstacles.map(o => ({ object: o, ...sampleVivaGymObstacle(time, Number(o.properties!.speed), Number(o.properties!.distance), Number(o.properties!.phase), Number(o.properties!.centerY), Number(o.properties!.centerZ)) }));
      for (let z = -35; z <= 35; z += .5) {
        const intervals = moving.filter(o => o.y + o.object.scale.y / 2 > .9 && o.y - o.object.scale.y / 2 < 2.4 && Math.abs(o.z - z) < o.object.scale.z / 2 + radius)
          .map(({object:o}) => [o.position.x - o.scale.x / 2 - radius, o.position.x + o.scale.x / 2 + radius]).sort((a,b) => a[0]-b[0]);
        let cursor = -9, widest = 0;
        for (const [left,right] of intervals) { widest = Math.max(widest, Math.min(left,9)-cursor); cursor = Math.max(cursor,right); }
        widest = Math.max(widest,9-cursor);
        expect(widest, `passable at t=${time}, z=${z}`).toBeGreaterThan(.5);
      }
    }
  });

  it('upgrades old browser saves once without accumulating speed or changing other objects', () => {
    const old = structuredClone(data);
    delete old.properties!.vivaGymChallengeRevision;
    for (const o of old.objects) if(o.properties?.movementType === 'vivagym_obstacle') { o.properties.speed = 8.5; o.scale.x = 3; }
    const untouched = old.objects.filter(o => o.properties?.movementType !== 'vivagym_obstacle').map(o=>structuredClone(o));
    upgradeVivaGymChallenge(old);
    expect(old.objects.filter(o=>o.properties?.movementType==='vivagym_obstacle').every(o=>o.properties!.speed===10.2)).toBe(true);
    expect(old.objects.filter(o=>o.properties?.movementType!=='vivagym_obstacle')).toEqual(untouched);
    const updated = structuredClone(old);
    expect(upgradeVivaGymChallenge(old)).toEqual(updated);
  });
});
