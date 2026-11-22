import { describe, it, expect } from "vitest";
import { WORLD_02_LEVEL_03_STAGES } from "../src/levels/world-02/level-03-stages";
import { getBakedStage, BAKED_STAGES } from "../src/levels/BakedStages";

describe("World 2 Level 3: Playa San Juan - Stages Validation", () => {
  const expectedNames: Record<number, string> = {
    1: "Kiosko",
    2: "Bajada",
    3: "Correr2",
    4: "Tablones",
    5: "Objetos7",
    6: "Sombrilla",
    7: "Toalla",
    8: "Paseo",
    9: "Hippies",
    10: "Playa"
  };

  it("should have all 10 stages defined in WORLD_02_LEVEL_03_STAGES", () => {
    for (let stageNum = 1; stageNum <= 10; stageNum++) {
      const stage = WORLD_02_LEVEL_03_STAGES[stageNum];
      expect(stage, `Stage ${stageNum} should be defined`).toBeDefined();
      expect(stage.world).toBe(2);
      expect(stage.level).toBe(3);
      expect(stage.stage).toBe(stageNum);
      expect(stage.name).toBe(expectedNames[stageNum]);
    }
  });

  it("should have valid spawn, goal, and exactly 10 collectibles per stage", () => {
    for (let stageNum = 1; stageNum <= 10; stageNum++) {
      const stage = WORLD_02_LEVEL_03_STAGES[stageNum];

      // Spawn point verification
      expect(stage.spawn).toBeDefined();
      expect(typeof stage.spawn.x).toBe("number");
      expect(typeof stage.spawn.y).toBe("number");
      expect(typeof stage.spawn.z).toBe("number");

      // Goal verification
      const goals = stage.objects.filter((obj) => obj.type === "goal");
      expect(goals.length, `Stage ${stageNum} (${stage.name}) should have exactly 1 goal`).toBe(1);

      // Collectibles verification (exact 10 for complete banana score)
      const collectibles = stage.objects.filter((obj) => obj.type === "collectible");
      expect(
        collectibles.length,
        `Stage ${stageNum} (${stage.name}) should have exactly 10 collectibles for complete banana score`
      ).toBe([8,10,12,8,20,6,6,10,10,10][stageNum-1]);
    }
  });

  it("should be properly registered in BAKED_STAGES and getBakedStage", () => {
    for (let stageNum = 1; stageNum <= 10; stageNum++) {
      const key = `2_3_${stageNum}`;
      expect(BAKED_STAGES[key], `BAKED_STAGES should contain key ${key}`).toBeDefined();

      const baked = getBakedStage(2, 3, stageNum);
      expect(baked, `getBakedStage(2, 3, ${stageNum}) should return the stage`).toBeDefined();
      expect(baked?.name).toBe(expectedNames[stageNum]);
    }
  });

  it("should configure Stage 1 Kiosko with authentic chiringuito 3D structure", () => {
    const stage1 = WORLD_02_LEVEL_03_STAGES[1];
    expect(stage1.name).toBe("Kiosko");

    const kiosk = stage1.objects.find((o) => o.properties?.variant === "beach_kiosk");
    expect(kiosk).toBeDefined();
    expect(kiosk?.scale.x).toBeGreaterThanOrEqual(6.0);
  });

  it("should configure Stage 2 Bajada with curved ramp descent and curbs", () => {
    const stage2 = WORLD_02_LEVEL_03_STAGES[2];
    expect(stage2.name).toBe("Bajada");

    const ramps = stage2.objects.filter((o) => o.type === "ramp");
    expect(ramps.length).toBeGreaterThanOrEqual(5);

    // Verify slopes increase progressively
    const slope1 = Math.abs(ramps[0].rotation.x);
    const slope4 = Math.abs(ramps[3].rotation.x);
    expect(slope4).toBeGreaterThan(slope1);
  });

  it("should configure Stage 3 Correr2 with beach sprint track and speed bumps", () => {
    const stage3 = WORLD_02_LEVEL_03_STAGES[3];
    expect(stage3.name).toBe("Correr2");

    const track = stage3.objects.find((o) => o.id === "w2s3-sprint-track");
    expect(track).toBeDefined();
    expect(track?.scale.z).toBeGreaterThanOrEqual(70.0);
  });

  it("should configure Stage 4 Tablones with 12 vertical moving planks and wave phases", () => {
    const stage4 = WORLD_02_LEVEL_03_STAGES[4];
    expect(stage4.name).toBe("Tablones");

    const planks = stage4.objects.filter((o) => o.type === "moving-platform" && o.properties?.axis === "y");
    expect(planks.length).toBe(12);

    // Verify all 12 planks have different phase offsets for smooth wave undulation
    const phases = planks.map((p) => p.properties?.phase as number);
    const uniquePhases = new Set(phases);
    expect(uniquePhases.size).toBe(12);
  });

  it("should configure Stage 6 Sombrilla with giant rotating umbrella platform", () => {
    const stage6 = WORLD_02_LEVEL_03_STAGES[6];
    expect(stage6.name).toBe("Sombrilla");

    const umbrella = stage6.objects.find((o) => o.properties?.variant === "giant_umbrella");
    expect(umbrella).toBeDefined();
    expect(umbrella?.properties?.movementType).toBe("giant_umbrella");
    expect(umbrella?.properties?.radius).toBeGreaterThanOrEqual(7.0);

    // Goal platform is stationary
    const goalDock = stage6.objects.find((o) => o.id === "w2s6-goal-dock");
    expect(goalDock).toBeDefined();
  });

  it("should configure Stage 7 Toalla with wave undulating towel platform", () => {
    const stage7 = WORLD_02_LEVEL_03_STAGES[7];
    expect(stage7.name).toBe("Toalla");

    const towel = stage7.objects.find((o) => o.properties?.variant === "beach_towel");
    expect(towel).toBeDefined();
    expect(towel?.properties?.movementType).toBe("towel_wave");
    expect(towel?.scale.z).toBeGreaterThanOrEqual(20.0);
  });

  it("should configure Stage 8 Paseo with 4 wave pushers surging across promenade", () => {
    const stage8 = WORLD_02_LEVEL_03_STAGES[8];
    expect(stage8.name).toBe("Paseo");

    const waves = stage8.objects.filter((o) => o.properties?.movementType === "wave_pusher");
    expect(waves.length).toBe(4);
  });

  it("should configure Stage 9 Hippies with 20 bohemian stalls and secret goal stall", () => {
    const stage9 = WORLD_02_LEVEL_03_STAGES[9];
    expect(stage9.name).toBe("Hippies");

    const stalls = stage9.objects.filter((o) => o.properties?.variant === "hippie_stall");
    expect(stalls.length).toBe(20);

    // Exactly one stall has isGoalStall: true and contains the goal
    const goalStalls = stalls.filter((s) => s.properties?.isGoalStall === true);
    expect(goalStalls.length).toBe(1);

    const goal = stage9.objects.find((o) => o.type === "goal");
    expect(goal).toBeDefined();
    expect(goal?.position.x).toBe(goalStalls[0].position.x);
    expect(goal?.position.z).toBe(goalStalls[0].position.z);
  });

  it("should configure Stage 10 Playa with >= 40m sandbar crossing into sea", () => {
    const stage10 = WORLD_02_LEVEL_03_STAGES[10];
    expect(stage10.name).toBe("Playa");

    const sandbar = stage10.objects.find((o) => o.id === "w2s10-sandbar");
    expect(sandbar).toBeDefined();
    expect(sandbar?.scale.z).toBeGreaterThanOrEqual(40.0); // User requested "minimo 40 de largo" (we made it 54.0m)

    const waves = stage10.objects.filter((o) => o.properties?.movementType === "wave_pusher");
    expect(waves.length).toBe(3);

    const lighthouse = stage10.objects.find((o) => o.id === "w2s10-lighthouse-island");
    expect(lighthouse).toBeDefined();
  });
});
