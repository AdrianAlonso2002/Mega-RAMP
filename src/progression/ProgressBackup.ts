import type {
  GameProgress,
  LevelRecord,
  StageProgress,
} from "./ProgressionData";
const characters = ["rony", "adri", "misi", "pao"];
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
function assert(ok: unknown): asserts ok {
  if (!ok) throw new Error("La copia de partida no tiene un formato válido.");
}
const number = (v: unknown, max: number) =>
  typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= max;
const strings = (v: unknown, max: number) =>
  Array.isArray(v) &&
  v.length <= max &&
  v.every((s) => typeof s === "string" && s.length <= 200);
/** Reconstruct known fields only. Untrusted backup keys never reach application objects. */
export function validateProgress(input: unknown): GameProgress {
  assert(
    object(input) &&
      characters.includes(String(input.selectedCharacter)) &&
      object(input.worlds),
  );
  const out: GameProgress = {
    selectedCharacter: String(input.selectedCharacter),
    worlds: {},
    levelRecords: {},
  };
  for (const [w, levels] of Object.entries(input.worlds)) {
    assert(/^[1-8]$/.test(w) && object(levels));
    out.worlds[w] = {};
    for (const [l, stages] of Object.entries(levels)) {
      assert(/^[1-4]$/.test(l) && object(stages));
      out.worlds[w][l] = {};
      for (const [s, value] of Object.entries(stages)) {
        assert(
          /^(10|[1-9])$/.test(s) &&
            object(value) &&
            typeof value.completed === "boolean" &&
            (value.bestTime === null || number(value.bestTime, 86400)) &&
            number(value.collectibles, 1000),
        );
        const stage: StageProgress = {
          completed: value.completed,
          bestTime: value.bestTime as number | null,
          collectibles: value.collectibles as number,
        };
        if (value.collectedIds !== undefined) {
          assert(strings(value.collectedIds, 1000));
          stage.collectedIds = [...new Set(value.collectedIds as string[])];
        }
        out.worlds[w][l][s] = stage;
      }
    }
  }
  if (input.characterSkins !== undefined) {
    assert(object(input.characterSkins));
    out.characterSkins = {};
    for (const [c, s] of Object.entries(input.characterSkins)) {
      assert(
        characters.includes(c) &&
          typeof s === "string" &&
          /^[a-z_]{1,40}$/.test(s),
      );
      out.characterSkins[c] = s;
    }
  }
  if (input.announcedSkinRewards !== undefined) {
    assert(strings(input.announcedSkinRewards, 32));
    out.announcedSkinRewards = [...(input.announcedSkinRewards as string[])];
  }
  if (input.levelRecords !== undefined) {
    assert(object(input.levelRecords));
    for (const [key, value] of Object.entries(input.levelRecords)) {
      assert(
        /^[1-8]-[1-4]$/.test(key) &&
          object(value) &&
          typeof value.completed === "boolean" &&
          (value.bestTime === null || number(value.bestTime, 864000)) &&
          number(value.totalCollectibles, 1000) &&
          number(value.clearCount, 1e9) &&
          strings(value.completedCharacters, 4) &&
          (value.completedCharacters as string[]).every((c) =>
            characters.includes(c),
          ),
      );
      out.levelRecords![key] = {
        completed: value.completed,
        bestTime: value.bestTime,
        totalCollectibles: Math.min(100,Math.floor(value.totalCollectibles as number)),
        clearCount: value.clearCount,
        completedCharacters: [...(value.completedCharacters as string[])],
      } as LevelRecord;
    }
  }
  return out;
}
export function readProgressBackup(text: string): GameProgress {
  assert(text.length < 2_000_000);
  const data: unknown = JSON.parse(text);
  if (object(data) && data.format === "mega-ramp-progress") {
    assert(data.version === 1);
    return validateProgress(data.progress);
  }
  return validateProgress(data);
}
