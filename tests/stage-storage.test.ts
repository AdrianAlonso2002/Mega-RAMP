import { afterEach, describe, expect, it, vi } from "vitest";
import {
  encodeStagePayload,
  decodeStagePayload,
  stageStorage,
  compactStageStorage,
  retireStageHistory,
} from "../src/storage/StageStorage";
import { LevelEditor } from "../src/editor/LevelEditor";
import { LevelLoader } from "../src/levels/LevelLoader";
import { PreparedLevel } from "../src/levels/PreparedLevel";
import { WORLD_07_LEVEL_01_STAGES as stages } from "../src/levels/world-07/level-01-stages";

class LimitedStorage implements Storage {
  readonly entries = new Map<string, string>();
  limit = Infinity;
  fail?: (key: string) => boolean;
  readonly removed: string[] = [];
  get length() {
    return this.entries.size;
  }
  get size() {
    return [...this.entries].reduce(
      (sum, [key, value]) => sum + key.length + value.length,
      0,
    );
  }
  key(index: number) {
    return [...this.entries.keys()][index] ?? null;
  }
  getItem(key: string) {
    return this.entries.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    const old = this.entries.get(key),
      size =
        this.size -
        (old === undefined ? 0 : key.length + old.length) +
        key.length +
        value.length;
    if (size > this.limit || this.fail?.(key))
      throw new DOMException("Storage is full", "QuotaExceededError");
    this.entries.set(key, value);
  }
  removeItem(key: string) {
    this.removed.push(key);
    this.entries.delete(key);
  }
  clear() {
    this.entries.clear();
  }
}
afterEach(() => vi.unstubAllGlobals());
function setup() {
  const storage = new LimitedStorage();
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("alert", vi.fn());
  return storage;
}
function editor() {
  const state = {
    levelData: structuredClone(stages[9]),
    currentWorld: 7,
    currentLevel: 1,
    currentStage: 9,
    renderUI: vi.fn(),
    showToast: vi.fn(),
  };
  return {
    ...state,
    save: () =>
      LevelEditor.prototype.saveCurrentLevel.call(
        state as unknown as LevelEditor,
      ),
  };
}
describe("Editor storage under browser quota pressure", () => {
  it("roundtrips full stages, Unicode and dictionary resets without losing coordinates", () => {
    const entropy = Array.from(
      { length: 90000 },
      (_, i) => ((i * 7919) % 104729).toString(36) + "-",
    ).join("");
    for (const value of [
      "",
      "small",
      JSON.stringify(stages[9]),
      JSON.stringify({ name: "Kioto · 🌸 日本 · Bebé", data: entropy }),
    ])
      expect(decodeStagePayload(encodeStagePayload(value))).toBe(value);
    const raw = JSON.stringify(stages[9]);
    expect(encodeStagePayload(raw).length).toBeLessThan(raw.length * 0.6);
    const unpaired = "x".repeat(300) + "\ud800";
    expect(encodeStagePayload(unpaired)).toBe(unpaired);
    expect(() => decodeStagePayload("!MR-LZW1!999999999:abc")).toThrow();
  });
  it("frees space by losslessly compacting legacy histories and never deletes saves or progress", () => {
    const storage = setup(),
      legacy = JSON.stringify(
        Array.from({ length: 4 }, (_, i) => ({
          id: `old-${i}`,
          data: stages[9],
        })),
      );
    storage.setItem("stage_snapshots_6_4_9", legacy);
    storage.setItem("monkey-ball-progress-v1", '{"lives":5,"skins":["hp"]}');
    const progress = storage.getItem("monkey-ball-progress-v1"),
      raw = JSON.stringify(stages[9]);
    storage.limit =
      storage.size + Math.floor(encodeStagePayload(raw).length * 0.5);
    stageStorage.setItem("custom_stage_7_1_9", raw);
    expect(stageStorage.getItem("custom_stage_7_1_9")).toBe(raw);
    expect(stageStorage.getItem("stage_snapshots_6_4_9")).toBe(legacy);
    expect(storage.getItem("monkey-ball-progress-v1")).toBe(progress);
    expect(storage.removed).toEqual([]);
    expect(storage.size).toBeLessThanOrEqual(storage.limit);
    expect(compactStageStorage(storage)).toBe(0);
  });
  it("keeps a single saved E9 while the original stays available without stored copies", async () => {
    const storage = setup(),
      e = editor();
    e.save();
    e.save();
    expect(stageStorage.getItem("stage_snapshots_7_1_9")).toBeNull();
    for (let i = 0; i < 3; i++) {
      e.levelData.name = `Edited E9 ${i}`;
      e.save();
    }
    expect(stageStorage.getItem("stage_snapshots_7_1_9")).toBeNull();
    expect(
      [...storage.entries.keys()].filter((key) => key === "custom_stage_7_1_9"),
    ).toHaveLength(1);
    expect(globalThis.alert).not.toHaveBeenCalled();
    expect(storage.getItem("custom_stage_7_1_9")).not.toBe(
      stageStorage.getItem("custom_stage_7_1_9"),
    );
    const loader = new LevelLoader();
    expect((await loader.loadStage(7, 1, 9)).name).toBe("Edited E9 2");
    const prepared = new PreparedLevel((w, l, s) => loader.loadStage(w, l, s));
    expect((await prepared.getStage(7, 1, 9)).name).toBe("Edited E9 2");
    e.levelData.name = "Newest E9";
    e.save();
    expect((await prepared.getStage(7, 1, 9)).name).toBe("Newest E9");
  });
  it("saves changes without requiring space for any additional history copy", async () => {
    const storage = setup(),
      old = JSON.stringify([
        {
          id: "old",
          timestamp: 1,
          dateStr: "before",
          name: "previous",
          data: stages[9],
        },
      ]);
    storage.setItem("stage_snapshots_7_1_9", old);
    storage.fail = (key) => key.startsWith("stage_snapshots_");
    const e = editor();
    e.levelData.name = "Changes that must survive";
    e.save();
    expect((await new LevelLoader().loadStage(7, 1, 9)).name).toBe(
      "Changes that must survive",
    );
    expect(stageStorage.getItem("stage_snapshots_7_1_9")).toBeNull();
    expect(globalThis.alert).not.toHaveBeenCalled();
    expect(e.showToast).toHaveBeenCalledWith(
      expect.stringContaining("Versión guardada actualizada"),
      expect.any(String),
    );
    expect(storage.removed).toContain("stage_snapshots_7_1_9");
  });
  it("cleans histories across stages, preserves the active version and recovers an orphaned newest version", () => {
    const storage = setup(),
      active = { ...structuredClone(stages[9]), name: "Current user changes" },
      older = { ...structuredClone(stages[9]), name: "Older snapshot" },
      newer = {
        ...structuredClone(stages[8]),
        name: "Recovered newest version",
      };
    storage.setItem("custom_stage_7_1_9", JSON.stringify(active));
    storage.setItem(
      "stage_snapshots_7_1_9",
      JSON.stringify([{ timestamp: 1, data: older }]),
    );
    storage.setItem(
      "stage_snapshots_7_1_8",
      encodeStagePayload(
        JSON.stringify([
          { timestamp: 1, data: stages[8] },
          { timestamp: 2, data: newer },
        ]),
      ),
    );
    storage.setItem("monkey-ball-progress-v1", '{"skins":["ssj"]}');
    expect(retireStageHistory()).toBe(2);
    expect(JSON.parse(stageStorage.getItem("custom_stage_7_1_9")!)).toEqual(
      active,
    );
    expect(JSON.parse(stageStorage.getItem("custom_stage_7_1_8")!).name).toBe(
      newer.name,
    );
    expect(storage.getItem("monkey-ball-progress-v1")).toBe(
      '{"skins":["ssj"]}',
    );
    expect(
      [...storage.entries.keys()].some((key) =>
        key.startsWith("stage_snapshots_"),
      ),
    ).toBe(false);
    stageStorage.setItem(
      "stage_snapshots_7_1_9",
      JSON.stringify([{ data: active }]),
    );
    expect(storage.getItem("stage_snapshots_7_1_9")).toBeNull();
    expect(retireStageHistory()).toBe(0);
  });
  it("retains the only remaining snapshot if recovery cannot be written", () => {
    const storage = setup(),
      legacy = JSON.stringify([{ timestamp: 1, data: stages[9] }]);
    storage.setItem("stage_snapshots_7_1_9", legacy);
    storage.fail = (key) => key.startsWith("custom_stage_");
    expect(retireStageHistory()).toBe(0);
    expect(stageStorage.getItem("stage_snapshots_7_1_9")).toBe(legacy);
    expect(storage.removed).toEqual([]);
  });
  it("reports a failed primary write honestly and preserves the previous saved version", () => {
    const storage = setup(),
      old = JSON.stringify(stages[9]);
    storage.setItem("custom_stage_7_1_9", old);
    storage.fail = () => true;
    const e = editor();
    e.levelData.name = "Not persisted";
    e.save();
    expect(globalThis.alert).toHaveBeenCalledOnce();
    expect(e.showToast).not.toHaveBeenCalled();
    expect(storage.getItem("custom_stage_7_1_9")).toBe(old);
  });
});
