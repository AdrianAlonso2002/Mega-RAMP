import { describe, it, expect } from "vitest";
import { WORLD_02_LEVEL_04_STAGES } from "../src/levels/world-02/level-04-stages";
import { getBakedStage, BAKED_STAGES } from "../src/levels/BakedStages";

describe("World 2 Level 4: Fontana - Stages Validation", () => {
  const expectedNames: Record<number, string> = {
    1: "Tranvia2",
    2: "Palmeras",
    3: "Mercadona",
    4: "Muro2",
    5: "Objetos8",
    6: "Mercado",
    7: "Bazar",
    8: "Ropa",
    9: "Popeye",
    10: "Helado"
  };

  it("should have all 10 stages defined in WORLD_02_LEVEL_04_STAGES", () => {
    for (let stageNum = 1; stageNum <= 10; stageNum++) {
      const stage = WORLD_02_LEVEL_04_STAGES[stageNum];
      expect(stage, `Stage ${stageNum} should be defined`).toBeDefined();
      expect(stage.world).toBe(2);
      expect(stage.level).toBe(4);
      expect(stage.stage).toBe(stageNum);
      expect(stage.name).toBe(expectedNames[stageNum]);
    }
  });

  it("should have valid spawn, goal, and exactly 10 collectibles per stage", () => {
    for (let stageNum = 1; stageNum <= 10; stageNum++) {
      const stage = WORLD_02_LEVEL_04_STAGES[stageNum];

      // Spawn point verification
      expect(stage.spawn).toBeDefined();
      expect(typeof stage.spawn.x).toBe("number");
      expect(typeof stage.spawn.y).toBe("number");
      expect(typeof stage.spawn.z).toBe("number");

      // Goal verification (exactly 1 goal per stage)
      const goals = stage.objects.filter((obj) => obj.type === "goal");
      expect(goals.length, `Stage ${stageNum} (${stage.name}) should have exactly 1 goal`).toBe(1);

      // Collectibles verification (exact 10 for complete banana score)
      const collectibles = stage.objects.filter((obj) => obj.type === "collectible");
      expect(
        collectibles.length,
        `Stage ${stageNum} (${stage.name}) should have exactly 10 collectibles for complete banana score`
      ).toBe([12,8,10,8,20,10,8,8,6,10][stageNum-1]);
    }
  });

  it("should be properly registered in BAKED_STAGES and getBakedStage", () => {
    for (let stageNum = 1; stageNum <= 10; stageNum++) {
      const key = `2_4_${stageNum}`;
      expect(BAKED_STAGES[key], `BAKED_STAGES should contain key ${key}`).toBeDefined();

      const baked = getBakedStage(2, 4, stageNum);
      expect(baked, `getBakedStage(2, 4, ${stageNum}) should return the stage`).toBeDefined();
      expect(baked?.name).toBe(expectedNames[stageNum]);
    }
  });

  it("should configure Stage 1 Tranvia2 with 144m railway track and Alicante TRAM cabin", () => {
    const stage1 = WORLD_02_LEVEL_04_STAGES[1];
    expect(stage1.name).toBe("Tranvia2");

    const trackBed = stage1.objects.find((o) => o.id === "w2s4e1-track-bed");
    expect(trackBed).toBeDefined();
    expect(trackBed?.scale.z).toBeGreaterThanOrEqual(140.0);

    const rails = stage1.objects.find((o) => o.properties?.variant === "tram_straight_rails");
    expect(rails).toBeDefined();
    expect(rails?.scale.z).toBeGreaterThanOrEqual(140.0);

    const tram = stage1.objects.find((o) => o.properties?.movementType === "tram_linear");
    expect(tram).toBeDefined();
    expect(tram?.properties?.distance).toBeGreaterThanOrEqual(130.0);
  });

  it("should configure Stage 2 Palmeras with 4 giant bouncy palms and leaf trampolines", () => {
    const stage2 = WORLD_02_LEVEL_04_STAGES[2];
    expect(stage2.name).toBe("Palmeras");

    const palms = stage2.objects.filter((o) => o.properties?.variant === "giant_bouncy_palm");
    expect(palms.length).toBe(4);

    const bumpers = stage2.objects.filter((o) => o.type === "bumper");
    expect(bumpers.length).toBeGreaterThanOrEqual(4);
  });

  it("should configure Stage 3 Mercadona with supermarket aisles, checkouts, and shopping carts", () => {
    const stage3 = WORLD_02_LEVEL_04_STAGES[3];
    expect(stage3.name).toBe("Mercadona");

    const shelves = stage3.objects.filter((o) => o.properties?.variant === "mercadona_shelves");
    expect(shelves.length).toBeGreaterThanOrEqual(6);

    const checkouts = stage3.objects.filter((o) => o.properties?.variant === "supermarket_checkout");
    expect(checkouts.length).toBeGreaterThanOrEqual(2);

    const carts = stage3.objects.filter((o) => o.properties?.variant === "shopping_carts");
    expect(carts.length).toBeGreaterThanOrEqual(1);
  });

  it("should configure Stage 4 Muro2 with Mediterranean sea wall and moving pipe shuttle", () => {
    const stage4 = WORLD_02_LEVEL_04_STAGES[4];
    expect(stage4.name).toBe("Muro2");

    const wallTop = stage4.objects.find((o) => o.id === "w2s4e4-wall-top");
    expect(wallTop).toBeDefined();
    expect(wallTop?.position.y).toBeGreaterThanOrEqual(7.0);

    const shuttle = stage4.objects.find((o) => o.properties?.variant === "pipe_shuttle");
    expect(shuttle).toBeDefined();
  });

  it("should configure Stage 5 Objetos8 with beach dunes and 4 ocean wave pushers", () => {
    const stage5 = WORLD_02_LEVEL_04_STAGES[5];
    expect(stage5.name).toBe("Objetos8");

    const waves = stage5.objects.filter((o) => o.properties?.movementType === "wave_pusher");
    expect(waves.length).toBe(4);
  });

  it("should configure Stage 6 Mercado with 14 artisan market stalls of La Fontana", () => {
    const stage6 = WORLD_02_LEVEL_04_STAGES[6];
    expect(stage6.name).toBe("Mercado");

    const stalls = stage6.objects.filter((o) => o.properties?.variant === "market_stall");
    expect(stalls.length).toBe(14);
  });

  it("should configure Stage 7 Bazar with winding maze bazar shelving units", () => {
    const stage7 = WORLD_02_LEVEL_04_STAGES[7];
    expect(stage7.name).toBe("Bazar");

    const bazarUnits = stage7.objects.filter((o) => o.properties?.variant === "bazar_shelves");
    expect(bazarUnits.length).toBeGreaterThanOrEqual(8);
  });

  it("should configure Stage 8 Ropa with 6 clotheslines and gap hazards", () => {
    const stage8 = WORLD_02_LEVEL_04_STAGES[8];
    expect(stage8.name).toBe("Ropa");

    const lines = stage8.objects.filter((o) => o.properties?.variant === "clothesline");
    expect(lines.length).toBe(6);
  });

  it("should configure Stage 9 Popeye with 8-slice rotating undulating pizza and neon billboard", () => {
    const stage9 = WORLD_02_LEVEL_04_STAGES[9];
    expect(stage9.name).toBe("Popeye");

    const pizza = stage9.objects.find((o) => o.properties?.variant === "popeye_pizza");
    expect(pizza).toBeDefined();
    expect(pizza?.properties?.rotSpeed).toBeDefined();
    expect(pizza?.properties?.waveAmplitude).toBeDefined();

    const billboard = stage9.objects.find((o) => o.properties?.variant === "popeye_billboard");
    expect(billboard).toBeDefined();
  });

  it("should configure Stage 10 Helado with monumental Stracciatella cone and spiral ascent", () => {
    const stage10 = WORLD_02_LEVEL_04_STAGES[10];
    expect(stage10.name).toBe("Helado");

    const cone = stage10.objects.find((o) => o.properties?.variant === "stracciatella_cone");
    expect(cone).toBeDefined();

    const ramps = stage10.objects.filter((o) => o.properties?.variant === 'icecream_spiral');
    expect(ramps).toHaveLength(1);
    expect(stage10.objects.some(o=>/^w2s4e10-ramp-\d+$/.test(o.id))).toBe(false);
  });
});
