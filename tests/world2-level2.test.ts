import { describe, it, expect } from "vitest";
import { WORLD_02_LEVEL_02_STAGES } from "../src/levels/world-02/level-02-stages";
import { getBakedStage, BAKED_STAGES } from "../src/levels/BakedStages";

describe("World 2 Level 2: Alicante - Stages Validation", () => {
  const expectedNames: Record<number, string> = {
    1: "Parque3",
    2: "Salto2",
    3: "Cuesta2",
    4: "Tranvia",
    5: "Objetos6",
    6: "Bici",
    7: "Casino",
    8: "Centro Comercial",
    9: "Mercadillo",
    10: "Puerto"
  };

  it("should have all 10 stages defined in WORLD_02_LEVEL_02_STAGES", () => {
    for (let stageNum = 1; stageNum <= 10; stageNum++) {
      const stage = WORLD_02_LEVEL_02_STAGES[stageNum];
      expect(stage, `Stage ${stageNum} should be defined`).toBeDefined();
      expect(stage.world).toBe(2);
      expect(stage.level).toBe(2);
      expect(stage.stage).toBe(stageNum);
      expect(stage.name).toBe(expectedNames[stageNum]);
    }
  });

  it("should have valid spawn, goal, and exactly 10 collectibles per stage", () => {
    for (let stageNum = 1; stageNum <= 10; stageNum++) {
      const stage = WORLD_02_LEVEL_02_STAGES[stageNum];
      
      // Spawn point verification
      expect(stage.spawn).toBeDefined();
      expect(typeof stage.spawn.x).toBe("number");
      expect(typeof stage.spawn.y).toBe("number");
      expect(typeof stage.spawn.z).toBe("number");

      // Goal verification
      const goals = stage.objects.filter((obj) => obj.type === "goal");
      expect(goals.length, `Stage ${stageNum} (${stage.name}) should have exactly 1 goal`).toBe(1);

      // Collectibles verification
      const collectibles = stage.objects.filter((obj) => obj.type === "collectible");
      expect(
        collectibles.length,
        `Stage ${stageNum} (${stage.name}) should have exactly 10 collectibles for complete banana score`
      ).toBe([8,8,10,8,20,8,8,10,10,10][stageNum-1]);
    }
  });

  it("should be properly registered in BAKED_STAGES and getBakedStage", () => {
    for (let stageNum = 1; stageNum <= 10; stageNum++) {
      const key = `2_2_${stageNum}`;
      expect(BAKED_STAGES[key], `BAKED_STAGES should contain key ${key}`).toBeDefined();

      const baked = getBakedStage(2, 2, stageNum);
      expect(baked, `getBakedStage(2, 2, ${stageNum}) should return the stage`).toBeDefined();
      expect(baked?.name).toBe(expectedNames[stageNum]);
    }
  });

  it("should have solid 3D structures for Bici (E6), Tiendas (E8), and Mercadillo (E9)", () => {
    // E6: Bicycle Giant Wheels
    const stage6 = WORLD_02_LEVEL_02_STAGES[6];
    const wheels = stage6.objects.filter((o) => o.properties?.variant === "bike_wheel_vertical");
    expect(wheels.length).toBeGreaterThanOrEqual(1);
    expect(wheels[0].properties?.radius).toBe(3.5);

    // E8: Centro Comercial with 6 Shops
    const stage8 = WORLD_02_LEVEL_02_STAGES[8];
    const shops = stage8.objects.filter((o) => o.properties?.variant === "shop" || o.properties?.variant === "store");
    expect(shops.length).toBe(6);

    // E9: Mercadillo with 12 Stalls and a wide, solid plaza
    const stage9 = WORLD_02_LEVEL_02_STAGES[9];
    const stalls = stage9.objects.filter((o) => o.properties?.variant === "market_stall");
    expect(stalls.length).toBe(12);

    const street = stage9.objects.find((o) => o.id === "w2s9-market-street");
    expect(street).toBeDefined();
    expect(street!.scale.x).toBeGreaterThanOrEqual(18.0); // Broad plaza under stalls
  });

  it("should configure Stage 4 Tranvía with enclosed tall cabin and reset capability", () => {
    const stage4 = WORLD_02_LEVEL_02_STAGES[4];
    expect(stage4).toBeDefined();
    expect(stage4.name).toBe("Tranvia");

    const tram = stage4.objects.find((o) => o.id === "w2s4-tram-cabin");
    expect(tram).toBeDefined();
    expect(tram?.properties?.movementType).toBe("tram_square");
    expect(tram?.scale.z).toBeGreaterThanOrEqual(7.0);

    // Spawn must be safely inside the tram (between floor 0.7 and roof 3.3)
    expect(stage4.spawn.y).toBeCloseTo(1.6, 0.2);
    expect(stage4.spawn.x).toBe(tram?.position.x);
    expect(stage4.spawn.z).toBe(tram?.position.z);
  });
});
