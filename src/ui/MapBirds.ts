type BirdKind = 'owl' | 'gull' | 'falcon' | 'pigeon' | 'stork' | 'crow' | 'swallow' | 'eagle';

// Small overhead silhouettes, rather than detailed foreground animals.
const silhouettes: Record<BirdKind, string> = {
  owl: 'M19 10 17 7 17 11C12 7 5 8 1 14L3 19C9 17 12 19 17 17L17 23 23 23 23 17C28 19 31 17 37 19L39 14C35 8 28 7 23 11L23 7 21 10Z',
  gull: 'M19 14C12 5 6 6 0 13 9 9 13 12 18 17L18 22 22 22 22 17C27 12 31 9 40 13 34 6 28 5 21 14L20 10Z',
  falcon: 'M18 12 6 3 0 7 14 17 18 18 17 26 20 24 23 26 22 18 26 17 40 7 34 3 22 12 21 8 19 8Z',
  pigeon: 'M18 13C13 6 8 3 3 6L1 10 14 18 18 18 17 25 23 25 22 18 26 18 39 10 37 6C32 3 27 6 22 13L22 9 20 7 18 9Z',
  stork: 'M19 12 18 5 20 1 23 1 21 3 21 12C29 9 32 4 39 6L40 9 26 17 22 17 22 29 21 31 20 21 19 31 18 29 18 17 14 17 0 9 1 6C8 4 11 9 19 12Z',
  crow: 'M18 12 10 7 2 7 0 9 5 10 0 12 7 13 3 15 14 18 18 17 16 24 20 27 24 24 22 17 26 18 37 15 33 13 40 12 35 10 40 9 38 7 30 7 22 12 22 8 20 7 18 9Z',
  swallow: 'M18 13 5 2 0 5 14 18 18 17 15 28 20 23 25 28 22 17 26 18 40 5 35 2 22 13 21 9 19 9Z',
  eagle: 'M18 12 9 5 1 3 0 6 4 8 0 9 7 12 3 13 14 18 18 17 17 25 23 25 22 17 26 18 37 13 33 12 40 9 36 8 40 6 39 3 31 5 22 12 22 8 20 7 18 8Z',
};

interface DistantBird {
  kind: BirdKind;
  dx: number;
  dy: number;
  radius: number;
  seconds: number;
  phase: number;
  size: number;
  reverse?: boolean;
}

// Sparse, irregular groups; time offsets prevent a synchronised flock.
const birdsByWorld: Record<number, DistantBird[]> = {
  1: [
    { kind: 'owl', dx: 5, dy: -5, radius: 76, seconds: 66, phase: 12, size: 13 },
  ],
  2: [
    { kind: 'gull', dx: 1, dy: -4, radius: 112, seconds: 58, phase: 6, size: 12 },
    { kind: 'gull', dx: 1.6, dy: -3, radius: 98, seconds: 63, phase: 24, size: 10 },
  ],
  3: [
    { kind: 'falcon', dx: 4, dy: -3, radius: 102, seconds: 84, phase: 31, size: 14 },
  ],
  4: [
    { kind: 'pigeon', dx: -.5, dy: -4, radius: 70, seconds: 49, phase: 17, size: 10 },
    { kind: 'pigeon', dx: .2, dy: -3.6, radius: 62, seconds: 53, phase: 28, size: 9 },
    { kind: 'pigeon', dx: -.7, dy: -3.3, radius: 81, seconds: 61, phase: 42, size: 10 },
  ],
  5: [
    { kind: 'gull', dx: 3, dy: -2, radius: 109, seconds: 70, phase: 35, size: 12 },
    { kind: 'stork', dx: -3, dy: 1, radius: 90, seconds: 96, phase: 8, size: 15, reverse: true },
  ],
  6: [
    { kind: 'crow', dx: -3, dy: 1, radius: 75, seconds: 59, phase: 4, size: 11 },
    { kind: 'crow', dx: -2.4, dy: .4, radius: 93, seconds: 73, phase: 36, size: 10 },
  ],
  7: [
    { kind: 'swallow', dx: 1, dy: -3, radius: 86, seconds: 47, phase: 26, size: 11 },
    { kind: 'swallow', dx: 1.4, dy: -2.5, radius: 105, seconds: 56, phase: 10, size: 9 },
  ],
  8: [
    { kind: 'eagle', dx: 2, dy: 2, radius: 118, seconds: 105, phase: 48, size: 14, reverse: true },
  ],
};

/** Fixed markup: all motion uses small CSS transforms; no timers, frame loop or textures. */
export function mapBirdsMarkup(worlds: readonly { id: number; mapX?: number; mapY?: number }[]): string {
  const individualBirds = worlds.map(world => (birdsByWorld[world.id] ?? []).map(bird => `
    <span class="map-bird-anchor" style="left:${(world.mapX ?? 50) + bird.dx}%;top:${(world.mapY ?? 50) + bird.dy}%;--bird-radius:${bird.radius}px;--bird-period:${bird.seconds}s;--bird-phase:-${bird.phase}s;--bird-size:${bird.size}px;--bird-direction:${bird.reverse ? 'reverse' : 'normal'};--bird-heading:${bird.reverse ? '0deg' : '180deg'}">
      <span class="map-bird-orbit"><svg class="map-distant-bird" viewBox="0 0 40 32" aria-hidden="true"><path d="${silhouettes[bird.kind]}" /></svg></span>
    </span>`).join('')).join('');

  // Each flock has ONE shared orbit, so its members cannot drift apart.
  const flocks: { world: number; kind: BirdKind; count: number; dx: number; dy: number; radius: number; seconds: number; phase: number }[] = [
    { world: 1, kind: 'swallow', count: 9, dx: 5, dy: 3, radius: 132, seconds: 89, phase: 23 },
    { world: 2, kind: 'gull', count: 6, dx: -2, dy: -6, radius: 151, seconds: 107, phase: 61 },
  ];
  const formations = flocks.map(flock => {
    const world = worlds.find(region => region.id === flock.world);
    if (!world) return '';
    const members = Array.from({ length: flock.count }, (_, index) => {
      const rank = Math.ceil(index / 2);
      const side = index % 2 === 1 ? -1 : 1;
      const x = rank * side * 13 + (index === 0 ? 0 : (index % 3) - 1);
      const y = -rank * 15 - (index % 2) * 2;
      return `<svg class="map-distant-bird" style="left:${x}px;top:${y}px;--bird-size:${8 + index % 3}px" viewBox="0 0 40 32" aria-hidden="true"><path d="${silhouettes[flock.kind]}" /></svg>`;
    }).join('');
    return `<span class="map-bird-anchor map-bird-flock" data-flock-size="${flock.count}" style="left:${(world.mapX ?? 50) + flock.dx}%;top:${(world.mapY ?? 50) + flock.dy}%;--bird-radius:${flock.radius}px;--bird-period:${flock.seconds}s;--bird-phase:-${flock.phase}s;--bird-direction:normal;--bird-heading:180deg"><span class="map-bird-orbit">${members}</span></span>`;
  }).join('');
  return individualBirds + formations;
}
