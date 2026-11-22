export interface LevelSound {
  id: string;
  bpm: number;
  melody: number[];
  bass: number[];
  wave: OscillatorType;
  ambient: "wind" | "water" | "city" | "room";
}
const scales = [
  [0, 2, 4, 7, 9],
  [0, 3, 5, 7, 10],
  [0, 2, 5, 7, 9],
  [0, 2, 3, 7, 10],
];
/** Thirty-two reproducible arrangements; no audio file downloads or per-note allocations. */
export function levelSound(world: number, level: number): LevelSound {
  const w = Math.max(1, Math.min(8, world)),
    l = Math.max(1, Math.min(4, level)),
    scale = scales[(w + l) % 4],
    root = [48, 53, 45, 50, 48, 55, 57, 50][w - 1] + l - 1;
  const hz = (m: number) => 440 * 2 ** ((m - 69) / 12),
    melody: number[] = [],
    bass: number[] = [];
  for (let step = 0; step < 32; step++) {
    const degree =
      (step * ((l % 3) + 1) + Math.floor(step / 8) * w) % scale.length;
    melody.push((step + w + l) % 5 === 0 ? 0 : hz(root + 12 + scale[degree]));
    bass.push(
      step % 4 === 0 ? hz(root + (Math.floor(step / 8) % 2 ? 7 : 0) - 12) : 0,
    );
  }
  return {
    id: `level_${w}_${l}`,
    bpm:
      w === 8
        ? 82 + l * 6
        : w === 7
          ? 108 + l * 8
          : 92 + ((w * 7 + l * 5) % 36),
    melody,
    bass,
    wave: w === 7 ? "sine" : w === 8 ? "sine" : "triangle",
    ambient:
      w === 2 || (w === 5 && l === 3)
        ? "water"
        : w === 4 || (w === 7 && l >= 3)
          ? "city"
          : w === 6 && l === 2
            ? "room"
            : "wind",
  };
}
export function soundFromId(id: string): LevelSound | undefined {
  const m = /^level_([1-8])_([1-4])$/.exec(id);
  return m ? levelSound(Number(m[1]), Number(m[2])) : undefined;
}
