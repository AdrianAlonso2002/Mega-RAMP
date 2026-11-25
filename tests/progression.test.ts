import { describe, expect, it, vi } from "vitest";
import { ProgressionManager } from "../src/progression/ProgressionManager";
import { GameState } from "../src/game/GameState";
import { LevelGenerator } from "../src/levels/LevelGenerator";
import { CHARACTERS, getCharacterById } from "../src/player/Characters";
import { WORLDS } from "../src/levels/WorldDefinitions";

describe("ProgressionManager", () => {
  it("unlocks the first stage by default", () => {
    const progression = new ProgressionManager();
    expect(progression.isStageUnlocked(1, 1, 1)).toBe(true);
  });

  it("locks stage 2 until stage 1 is completed", () => {
    const progression = new ProgressionManager();
    // In fresh progression, stage 2 is locked
    const isUnlocked = progression.isStageUnlocked(1, 1, 2);
    expect(isUnlocked).toBe(false);

    // Complete stage 1
    progression.completeStage(1, 1, 1, 25.5, 8);
    expect(progression.isStageUnlocked(1, 1, 2)).toBe(true);
  });

  it("checks world 1 is always unlocked initially", () => {
    const progression = new ProgressionManager();
    expect(progression.isWorldUnlocked(1)).toBe(true);
  });

  it("has 8 worlds defined with 4 landmark levels each", () => {
    expect(WORLDS.length).toBe(8);
    expect(WORLDS[0].name).toBe("Villamanta");
    expect(WORLDS[1].name).toBe("San Juan");
    expect(WORLDS[2].name).toBe("Mesegal");
    expect(WORLDS[3].name).toBe("Carabanchel");
    expect(WORLDS[4].name).toBe("Asturias");
    expect(WORLDS[5].name).toBe("Londres");
    expect(WORLDS[6].name).toBe("Japón");
    expect(WORLDS[7].name).toBe("Noruega");

    WORLDS.forEach(w => {
      expect(w.levels).toBeDefined();
      expect(w.levels?.length).toBe(4);
      w.levels?.forEach((lvl, idx) => {
        expect(lvl.level).toBe(idx + 1);
        expect(lvl.name).toBeTruthy();
        expect(lvl.mapX).toBeGreaterThanOrEqual(0);
        expect(lvl.mapX).toBeLessThanOrEqual(100);
        expect(lvl.mapY).toBeGreaterThanOrEqual(0);
        expect(lvl.mapY).toBeLessThanOrEqual(100);
      });
    });
  });

  it("has high-definition level background images configured for every level of all 8 worlds", () => {
    WORLDS.forEach(w => {
      expect(w.image).toBe(`/assets/maps/world${w.id}.jpg`);
      expect(w.levels).toBeDefined();
      w.levels?.forEach(lvl => {
        expect(lvl.image).toBe(`/assets/maps/world${w.id}level${lvl.level}.jpg`);
      });
    });
  });

  it("records level completion stats and tracks character completions", () => {
    const progression = new ProgressionManager();
    progression.recordLevelCompletion(1, 1, 95.4, 88, "rony");
    let rec = progression.getLevelRecord(1, 1);
    expect(rec.completed).toBe(true);
    expect(rec.bestTime).toBe(95.4);
    expect(rec.totalCollectibles).toBe(88);
    expect(rec.completedCharacters).toContain("rony");
    expect(rec.clearCount).toBe(1);

    // Complete again with a faster time and adri
    progression.recordLevelCompletion(1, 1, 82.1, 95, "adri");
    rec = progression.getLevelRecord(1, 1);
    expect(rec.bestTime).toBe(82.1);
    expect(rec.totalCollectibles).toBe(95);
    expect(rec.completedCharacters).toContain("rony");
    expect(rec.completedCharacters).toContain("adri");
    expect(rec.clearCount).toBe(2);

    // Run 3: Slower time and fewer items (worse attempt) -> records MUST NOT be degraded!
    progression.recordLevelCompletion(1, 1, 115.0, 70, "rony");
    rec = progression.getLevelRecord(1, 1);
    expect(rec.bestTime).toBe(82.1); // Best time preserved!
    expect(rec.totalCollectibles).toBe(95); // A worse run cannot lower the prize record.
    expect(rec.clearCount).toBe(3);

    // Run 4: Faster time only (75.5s), but only 40 items -> bestTime updates independently of the prize record!
    progression.recordLevelCompletion(1, 1, 75.5, 40, "rony");
    rec = progression.getLevelRecord(1, 1);
    expect(rec.bestTime).toBe(75.5); // New best time!
    expect(rec.totalCollectibles).toBe(95); // Faster time does not lower the prize record.
    expect(rec.clearCount).toBe(4);

    // Run 5: More collectibles only (99 items), but slow run (130s) -> collectibles updates, time preserved!
    progression.recordLevelCompletion(1, 1, 130.0, 99, "rony");
    rec = progression.getLevelRecord(1, 1);
    expect(rec.bestTime).toBe(75.5); // All-time best time preserved!
    expect(rec.totalCollectibles).toBe(99); // New collectibles record!
    expect(rec.clearCount).toBe(5);
  });

  it("can toggle unlock all and reset to default progression", () => {
    const progression = new ProgressionManager();
    progression.resetToDefaultProgression();
    expect(progression.isAllUnlocked()).toBe(false);
    expect(progression.isWorldUnlocked(1)).toBe(true);
    expect(progression.isWorldUnlocked(2)).toBe(false);

    progression.unlockAll();
    expect(progression.isAllUnlocked()).toBe(true);
    expect(progression.isWorldUnlocked(8)).toBe(true);
    expect(progression.getSeenNodes()).toContain("w8");
    expect(progression.getSeenNodes()).toContain("w8-l4");

    progression.resetToDefaultProgression();
    expect(progression.isAllUnlocked()).toBe(false);
    expect(progression.isWorldUnlocked(2)).toBe(false);
  });

  it("manages seen nodes for cloud reveals", () => {
    const progression = new ProgressionManager();
    progression.resetSeenNodes();
    expect(progression.getSeenNodes()).toContain("w1");
    expect(progression.getSeenNodes()).toContain("w1-l1");

    progression.markNodeSeen("w1-l2");
    expect(progression.getSeenNodes()).toContain("w1-l2");
  });
});

describe("GameState", () => {
  it("starts with 5 lives and 0 collectibles", () => {
    const state = new GameState();
    expect(state.lives).toBe(5);
    expect(state.collectibles).toBe(0);
  });

  it("grants 1 extra life when 10 collectibles are reached", () => {
    const state = new GameState();
    let got1Up = false;

    // Collect 9 items
    for (let i = 0; i < 9; i++) {
      got1Up = state.addCollectible();
      expect(got1Up).toBe(false);
    }
    expect(state.lives).toBe(5);
    expect(state.collectibles).toBe(9);

    // Collect 10th item
    got1Up = state.addCollectible();
    expect(got1Up).toBe(true);
    expect(state.lives).toBe(6);
    expect(state.collectibles).toBe(0); // Wraps around
  });

  it("deducts lives and detects game over at 0 lives", () => {
    const state = new GameState();
    expect(state.loseLife()).toBe(false); // 4
    expect(state.loseLife()).toBe(false); // 3
    expect(state.loseLife()).toBe(false); // 2
    expect(state.loseLife()).toBe(false); // 1
    const gameOver = state.loseLife(); // 0
    expect(gameOver).toBe(true);
    expect(state.lives).toBe(0);
  });

  it("resets stage timer and stage collectibles on resetStage", () => {
    const state = new GameState();
    state.elapsedTime = 42.5;
    state.stageCollectibles = 7;
    state.resetStage();
    expect(state.elapsedTime).toBe(0);
    expect(state.stageCollectibles).toBe(0);
  });

  it("resets lives to 5 and timer to 0 on resetGame", () => {
    const state = new GameState();
    state.lives = 1;
    state.elapsedTime = 55.2;
    state.collectibles = 8;
    state.resetGame();
    expect(state.lives).toBe(5);
    expect(state.elapsedTime).toBe(0);
    expect(state.collectibles).toBe(0);
  });
});

describe("Characters", () => {
  it("defines the 4 characters with their unique collectibles", () => {
    expect(CHARACTERS.length).toBe(4);

    const rony = getCharacterById("rony");
    expect(rony.collectibleId).toBe("pan");

    const adri = getCharacterById("adri");
    expect(adri.collectibleId).toBe("dragon_ball");
    expect(adri.collectibleName).toBe("Bolas de Dragón");

    const misi = getCharacterById("misi");
    expect(misi.collectibleId).toBe("lonchas_pavo");
    expect(misi.collectibleName).toBe("Pavo");

    const pao = getCharacterById("pao");
    expect(pao.collectibleId).toBe("varitas_estrella");
    expect(pao.collectibleName).toBe("Varitas");
  });

  it("correctly computes the sum of times and collectibles across all 10 stages of a level", () => {
    const progression = new ProgressionManager();
    progression.resetToDefaultProgression();

    // Complete stages 1 through 10 with known times and collectibles
    let expectedTotalTime = 0;
    let expectedTotalCollectibles = 0;
    for (let s = 1; s <= 10; s++) {
      const time = 10 + s * 1.5;
      const col = s;
      expectedTotalTime += time;
      expectedTotalCollectibles += col;
      progression.completeStage(1, 1, s, time, col);
    }

    const calculatedTotalTime = progression.getLevelTotalTime(1, 1);
    const calculatedTotalCol = progression.getLevelTotalCollectibles(1, 1);

    expect(calculatedTotalTime).toBeCloseTo(expectedTotalTime, 2);
    expect(calculatedTotalCol).toBe(expectedTotalCollectibles);

    const record = progression.getLevelRecord(1, 1);
    expect(record.completed).toBe(true);
    expect(record.bestTime).toBeCloseTo(expectedTotalTime, 2);
    expect(record.totalCollectibles).toBe(expectedTotalCollectibles);
  });

  it("dynamically detects max collectibles from stages and custom edits in localStorage", () => {
    const progression = new ProgressionManager();
    const defaultStage1Col = progression.getStageMaxCollectibles(1, 1, 1);
    expect(defaultStage1Col).toBeGreaterThan(0);

    const defaultLevelCol = progression.getLevelMaxCollectibles(1, 1);
    expect(defaultLevelCol).toBeGreaterThan(0);

    // Mock localStorage in Node test environment
    const store = new Map<string, string>();
    const originalLocalStorage = globalThis.localStorage;
    (globalThis as any).localStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
      clear: () => store.clear()
    };

    // Mock a custom stage with 17 collectibles saved by 3D Level Editor
    const customStageData = {
      id: "w1-l1-s1",
      world: 1,
      level: 1,
      stage: 1,
      name: "Custom Stage Test",
      timeLimit: 60,
      objects: Array.from({ length: 17 }, (_, i) => ({
        id: `col-${i}`,
        type: "collectible",
        position: { x: i, y: 0.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }))
    };

    localStorage.setItem("custom_stage_1_1_1", JSON.stringify(customStageData));

    // Old saves migrate to the agreed eight-prize stage budget.
    const customStageCol = progression.getStageMaxCollectibles(1, 1, 1);
    expect(customStageCol).toBe(8);

    // The migrated level still has exactly 100 available prizes.
    const customLevelCol = progression.getLevelMaxCollectibles(1, 1);
    expect(customLevelCol).toBe(defaultLevelCol);

    // Cleanup
    (globalThis as any).localStorage = originalLocalStorage;
  });

  it("manages FPS display toggle and FPS limiter options with localStorage persistence", () => {
    const progression = new ProgressionManager();

    // Default values
    expect(progression.isShowFPS()).toBe(false);
    expect(progression.getFPSLimit()).toBe("60");

    // Toggle FPS
    progression.setShowFPS(true);
    expect(progression.isShowFPS()).toBe(true);

    // Change FPS limit options (only 60 and 30)
    progression.setFPSLimit("30");
    expect(progression.getFPSLimit()).toBe("30");

    progression.setFPSLimit("60");
    expect(progression.getFPSLimit()).toBe("60");

    progression.setShowFPS(false);
    expect(progression.isShowFPS()).toBe(false);
  });
});

describe("LevelGenerator", () => {
  it("generates deterministic stages with platforms, collectibles and goal", () => {
    const stage = LevelGenerator.generateStage(1, 1, 1);
    expect(stage.world).toBe(1);
    expect(stage.level).toBe(1);
    expect(stage.stage).toBe(1);
    expect(stage.objects.length).toBeGreaterThan(5);

    const goalObj = stage.objects.find(o => o.type === "goal");
    expect(goalObj).toBeDefined();

    const collectibles = stage.objects.filter(o => o.type === "collectible");
    expect(collectibles.length).toBeGreaterThanOrEqual(3);
  });

  it("ensures all platforms in all 10 stage archetypes are at uniform height y = 0", () => {
    for (let s = 1; s <= 10; s++) {
      const stage = LevelGenerator.generateStage(2, 1, s);
      const platforms = stage.objects.filter(o => o.type === "platform" || o.type === "moving-platform");
      for (const plat of platforms) {
        expect(plat.position.y).toBe(0);
      }
    }
  });

  it("verifies World 1 Level 3 Polideportivo Villamanta has all 10 custom stages baked", async () => {
    const { getBakedStage } = await import("../src/levels/BakedStages");
    const expectedNames = [
      "Arroyo",
      "Callejón",
      "Correr1",
      "Feria",
      "Objetos3",
      "Chiringuito",
      "Piscina2",
      "Futbol",
      "Padel",
      "Dana"
    ];

    for (let s = 1; s <= 10; s++) {
      const stage = getBakedStage(1, 3, s);
      expect(stage).toBeDefined();
      expect(stage?.world).toBe(1);
      expect(stage?.level).toBe(3);
      expect(stage?.stage).toBe(s);
      expect(stage?.name).toBe(expectedNames[s - 1]);
      expect(stage?.spawn).toBeDefined();

      const goal = stage?.objects.find(o => o.type === "goal");
      expect(goal).toBeDefined();

      const collectibles = stage?.objects.filter(o => o.type === "collectible") || [];
      expect(collectibles.length).toBeGreaterThanOrEqual(3);
    }

    // Specific stage assertions
    // Stage 1: Arroyo >= 30 blocks
    const s1 = getBakedStage(1, 3, 1)!;
    expect(s1.objects.length).toBeGreaterThanOrEqual(30);
    expect(s1.objects.some(o => o.type === "water")).toBe(true);

    // Stage 4: Feria has La Olla
    const s4 = getBakedStage(1, 3, 4)!;
    expect(s4.objects.some(o => o.properties?.variant === "olla")).toBe(true);

    // Rest stages have at least twenty collectibles.
    const s5 = getBakedStage(1, 3, 5)!;
    expect(s5.objects.filter(o => o.type === "collectible").length).toBe(20);

    // Stage 8: Futbol has patrolling bulls
    const s8 = getBakedStage(1, 3, 8)!;
    expect(s8.objects.some(o => o.properties?.variant === "bull")).toBe(true);

    // Stage 9: Padel has padel racket
    const s9 = getBakedStage(1, 3, 9)!;
    expect(s9.objects.some(o => o.properties?.variant === "padel_racket")).toBe(true);

    // Stage 10: Dana has heavy flood with >= 45 blocks
    const s10 = getBakedStage(1, 3, 10)!;
    expect(s10.objects.length).toBeGreaterThanOrEqual(45);
    expect(s10.objects.filter(o => o.type === "water").length).toBeGreaterThanOrEqual(8);
  });

  it("verifies World 1 Level 4 Plaza de Villamanta has all 10 custom stages baked", async () => {
    const { getBakedStage } = await import("../src/levels/BakedStages");
    const expectedNames = [
      "Bar",
      "Panadería",
      "Cuesta",
      "Muro1",
      "Objetos4",
      "Día",
      "Ayuntamiento",
      "Cojera",
      "Concierto",
      "Banderitas"
    ];

    for (let s = 1; s <= 10; s++) {
      const stage = getBakedStage(1, 4, s);
      expect(stage).toBeDefined();
      expect(stage?.world).toBe(1);
      expect(stage?.level).toBe(4);
      expect(stage?.stage).toBe(s);
      expect(stage?.name).toBe(expectedNames[s - 1]);
      expect(stage?.spawn).toBeDefined();

      const goal = stage?.objects.find((o: any) => o.type === "goal");
      expect(goal).toBeDefined();

      const collectibles = stage?.objects.filter((o: any) => o.type === "collectible") || [];
      expect(collectibles.length).toBeGreaterThanOrEqual(3);
    }

    // Specific stage assertions
    // Stage 1: Bar circular terrace
    const s1 = getBakedStage(1, 4, 1)!;
    expect(s1.objects.some((o: any) => o.properties?.shape === "cylinder")).toBe(true);

    // Stage 2: Panadería has bread rollers
    const s2 = getBakedStage(1, 4, 2)!;
    expect(s2.objects.some((o: any) => o.properties?.variant === "bread_roller")).toBe(true);

    // Stage 3: Cuesta has 0.35 slope
    const s3 = getBakedStage(1, 4, 3)!;
    expect(s3.objects.some((o: any) => Math.abs((o.rotation?.x || 0) - (-0.35)) < 0.01)).toBe(true);

    // Stage 4: Muro1 has pipe shuttle
    const s4 = getBakedStage(1, 4, 4)!;
    expect(s4.objects.some((o: any) => o.properties?.variant === "pipe_shuttle")).toBe(true);

    // Stage 6: Día aisle length >= 35m
    const s6 = getBakedStage(1, 4, 6)!;
    const aisle = s6.objects.find((o: any) => o.id === "s6-dia-aisle")!;
    expect(aisle.scale.z).toBeGreaterThanOrEqual(35);

    // Stage 7: Ayuntamiento has clock hands
    const s7 = getBakedStage(1, 4, 7)!;
    expect(s7.objects.some((o: any) => o.properties?.variant === "clock_hand")).toBe(true);

    // Stage 8: Cojera has limp kicker character
    const s8 = getBakedStage(1, 4, 8)!;
    expect(s8.objects.some((o: any) => o.properties?.variant === "limp_kicker")).toBe(true);

    // Stage 9: Concierto has vibrating concert stage
    const s9 = getBakedStage(1, 4, 9)!;
    expect(s9.objects.some((o: any) => o.properties?.variant === "concert_vibe")).toBe(true);

    // Stage 10: Banderitas has fountain
    const s10 = getBakedStage(1, 4, 10)!;
    expect(s10.objects.some((o: any) => o.type === "water")).toBe(true);
  });
});


it('caps old and new level records and retains the best single attempt prize count',()=>{
  const values=new Map<string,string>();vi.stubGlobal('localStorage',{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value)});
  const progression=new ProgressionManager();
  progression.recordLevelCompletion(1,1,100,185,'rony');expect(progression.getLevelRecord(1,1).totalCollectibles).toBe(100);
  progression.recordLevelCompletion(1,1,110,23,'rony');expect(progression.getLevelRecord(1,1).totalCollectibles).toBe(100);
  expect(new ProgressionManager().getLevelRecord(1,1).totalCollectibles).toBe(100);
  (progression as any).data.levelRecords['1-1'].totalCollectibles=140;
  expect(progression.getLevelRecord(1,1).totalCollectibles).toBe(100);
  vi.unstubAllGlobals();
});
