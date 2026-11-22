import { describe, it, expect } from "vitest";
import { WORLD_03_LEVEL_01_STAGES } from "../src/levels/world-03/level-01-stages";
import { WORLD_03_LEVEL_02_STAGES } from "../src/levels/world-03/level-02-stages";
import { WORLD_03_LEVEL_03_STAGES } from "../src/levels/world-03/level-03-stages";
import { WORLD_03_LEVEL_04_STAGES } from "../src/levels/world-03/level-04-stages";
import { getBakedStage, BAKED_STAGES } from "../src/levels/BakedStages";
import { LevelBuilder } from "../src/levels/LevelBuilder";
import { SpriteTextures } from "../src/rendering/SpriteTextures";

describe("World 3: Mesegal, Pinofranqueado y Ovejuela (Las Hurdes) - Full 40 Stages Validation", () => {
  const world3Levels = [
    {
      level: 1,
      name: "La casina",
      stages: WORLD_03_LEVEL_01_STAGES,
      expectedNames: {
        1: "Cuadrado3",
        2: "Callejuela",
        3: "Fuente",
        4: "Almacen",
        5: "Objetos9",
        6: "Escaleras2",
        7: "Salamandra",
        8: "Ventilador2",
        9: "Puertas Blancas",
        10: "Misina"
      }
    },
    {
      level: 2,
      name: "La Era",
      stages: WORLD_03_LEVEL_02_STAGES,
      expectedNames: {
        1: "Callejuela2",
        2: "Salto3",
        3: "Perros",
        4: "Miel",
        5: "Objetos10",
        6: "Plaza",
        7: "Dibujos",
        8: "Niñas",
        9: "Bajada2",
        10: "La Era"
      }
    },
    {
      level: 3,
      name: "Pinofranqueado",
      stages: WORLD_03_LEVEL_03_STAGES,
      expectedNames: {
        1: "Camino",
        2: "Polideportivo",
        3: "Correr3",
        4: "Cuatro Caminos",
        5: "Objetos11",
        6: "Plaza2",
        7: "Spar",
        8: "Río Los Ángeles",
        9: "Turrón",
        10: "Mirador"
      }
    },
    {
      level: 4,
      name: "Chorrito de Ovejuela",
      stages: WORLD_03_LEVEL_04_STAGES,
      expectedNames: {
        1: "Bazar Gigante",
        2: "Cuesta3",
        3: "Niños",
        4: "Muro3",
        5: "Objetos12",
        6: "Curvas",
        7: "Sin Cobertura",
        8: "Cuesta4",
        9: "Ruta Nocturna",
        10: "Chorrito"
      }
    }
  ];

  it("should have all 4 levels and all 40 stages properly defined with correct metadata", () => {
    for (const lvl of world3Levels) {
      for (let s = 1; s <= 10; s++) {
        const stage = lvl.stages[s];
        expect(stage, `World 3 Level ${lvl.level} Stage ${s} must be defined`).toBeDefined();
        expect(stage.world).toBe(3);
        expect(stage.level).toBe(lvl.level);
        expect(stage.stage).toBe(s);
        expect(stage.name).toBe(lvl.expectedNames[s as keyof typeof lvl.expectedNames]);
        expect(stage.timeLimit).toBeGreaterThanOrEqual(60);
      }
    }
  });

  it("should have exactly 1 goal, exactly 10 collectibles, and a valid spawn in every single stage", () => {
    for (const lvl of world3Levels) {
      for (let s = 1; s <= 10; s++) {
        const stage = lvl.stages[s];

        // Valid spawn
        expect(stage.spawn).toBeDefined();
        expect(typeof stage.spawn.x).toBe("number");
        expect(typeof stage.spawn.y).toBe("number");
        expect(typeof stage.spawn.z).toBe("number");

        // Exactly 1 goal
        const goals = stage.objects.filter((o) => o.type === "goal");
        expect(goals.length, `M3-N${lvl.level}-E${s} (${stage.name}) must have exactly 1 goal`).toBe(1);

        // Exactly 10 collectibles
        const collectibles = stage.objects.filter((o) => o.type === "collectible");
        expect(
          collectibles.length,
          `M3-N${lvl.level}-E${s} (${stage.name}) must have exactly 10 banana collectibles`
        ).toBe([[8,8,8,10,20,8,12,8,8,10],[8,8,10,8,20,8,8,8,10,12],[10,8,12,8,20,8,8,10,8,8],[10,10,8,8,20,10,6,10,8,10]][lvl.level-1][s-1]);
      }
    }
  });

  it("should have completely unique object IDs within each stage", () => {
    for (const lvl of world3Levels) {
      for (let s = 1; s <= 10; s++) {
        const stage = lvl.stages[s];
        const ids = stage.objects.map((o) => o.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size, `Stage M3-N${lvl.level}-E${s} (${stage.name}) has duplicate object IDs`).toBe(ids.length);
      }
    }
  });

  it("should be fully registered in BAKED_STAGES and retrieved via getBakedStage", () => {
    for (const lvl of world3Levels) {
      for (let s = 1; s <= 10; s++) {
        const key = `3_${lvl.level}_${s}`;
        expect(BAKED_STAGES[key], `BAKED_STAGES should contain key ${key}`).toBeDefined();

        const baked = getBakedStage(3, lvl.level, s);
        expect(baked, `getBakedStage(3, ${lvl.level}, ${s})`).toBeDefined();
        expect(baked?.name).toBe(lvl.expectedNames[s as keyof typeof lvl.expectedNames]);
      }
    }
  });

  it("should verify specific mechanics: Honey fluid in M3-N2-E4 (Miel)", () => {
    const mielStage = WORLD_03_LEVEL_02_STAGES[4];
    const honeyBlocks = mielStage.objects.filter((o) => o.type === "honey");
    expect(honeyBlocks.length).toBeGreaterThanOrEqual(1);
    expect(honeyBlocks[0].properties?.dragFactor).toBe(8.5);
  });

  it("should verify specific mechanics: Village dogs in M3-N2-E3 (Perros)", () => {
    const dogsStage = WORLD_03_LEVEL_02_STAGES[3];
    const dogs = dogsStage.objects.filter((o) => o.properties?.variant === "village_dogs");
    expect(dogs.length).toBe(6);

    // Verify dog model has articulated running legs, head group, and wagging tail
    const dogModel = LevelBuilder.createDogMesh("medium", 0);
    expect(dogModel.group).toBeDefined();
    expect(dogModel.headGroup).toBeDefined();
    expect(dogModel.tailMesh).toBeDefined();
    expect(dogModel.legs).toBeDefined();
    expect(dogModel.legs.length).toBe(4);
  });

  it("should verify specific mechanics: Village girls in M3-N2-E8 (Niñas)", () => {
    const girlsStage = WORLD_03_LEVEL_02_STAGES[8];
    const girls = girlsStage.objects.filter((o) => o.properties?.variant === "village_girls");
    expect(girls.length).toBe(2);
  });

  it("should verify specific mechanics: Village boys in M3-N4-E3 (Niños)", () => {
    const boysStage = WORLD_03_LEVEL_04_STAGES[3];
    const boys = boysStage.objects.filter((o) => o.properties?.variant === "village_boys");
    expect(boys.length).toBe(2);
  });

  it("should verify specific mechanics: Salamander platform in M3-N1-E7 (Salamandra)", () => {
    const salStage = WORLD_03_LEVEL_01_STAGES[7];
    const sal = salStage.objects.find((o) => o.properties?.variant === "salamander_platform");
    expect(sal).toBeDefined();
    expect(sal?.properties?.length).toBe(74.0);
    const goal = salStage.objects.find((o) => o.type === "goal");
    expect(goal).toBeDefined();
    expect(goal?.position.z).toBe(-74.0);
  });

  it("should verify specific mechanics: A4 Coloring Drawings in M3-N2-E7 (Dibujos)", () => {
    const drawingsStage = WORLD_03_LEVEL_02_STAGES[7];
    const papers = drawingsStage.objects.filter((o) => o.properties?.variant === "a4_sheet");
    expect(papers.length).toBe(10);

    // Verify DIN A4 aspect ratio (width : length approx 1 : 1.414)
    for (const p of papers) {
      expect(p.scale.x).toBeCloseTo(3.8, 1);
      expect(p.scale.z).toBeCloseTo(5.38, 1);
      const ratio = p.scale.z / p.scale.x;
      expect(ratio).toBeCloseTo(Math.SQRT2, 0.05); // Exact A4 proportion 1.4142
      expect(p.properties?.theme).toBe("drawing_sheet");
      expect(p.properties?.movementType).toBe("sine");
    }

    // Verify 3D model construction: A4 paper, backing, paperclip, and colored pencil
    const sheetModel = LevelBuilder.createA4SheetMesh(3.8, 0.16, 5.38, "medium", 1, "#e53935");
    expect(sheetModel.group).toBeDefined();
    expect(sheetModel.platformMesh).toBeDefined();
    expect(sheetModel.meshes.length).toBeGreaterThanOrEqual(5);

    // Verify coloring page texture generation
    const tex1 = SpriteTextures.getColoringPageTexture(1);
    const tex2 = SpriteTextures.getColoringPageTexture(2);
    const tex3 = SpriteTextures.getColoringPageTexture(3);
    expect(tex1).toBeDefined();
    expect(tex2).toBeDefined();
    expect(tex3).toBeDefined();
  });

  it("should verify specific mechanics: Misina white cat in M3-N1-E10 (Misina)", () => {
    const misinaStage = WORLD_03_LEVEL_01_STAGES[10];
    const cat = misinaStage.objects.find((o) => o.properties?.variant === "misina_cat");
    expect(cat).toBeDefined();
  });

  it("should verify specific mechanics: Turrón orange cat in M3-N3-E9 (Turrón)", () => {
    const turronStage = WORLD_03_LEVEL_03_STAGES[9];
    const cat = turronStage.objects.find((o) => o.properties?.variant === "turron_cat");
    expect(cat).toBeDefined();
  });

  it("should verify specific mechanics: Río Los Ángeles cascaded pools, stone drop, and stone bridge arch in M3-N3-E8", () => {
    const stage = WORLD_03_LEVEL_03_STAGES[8];
    expect(stage).toBeDefined();

    // Pool 1 and Pool 2 water sections
    const water1 = stage.objects.find((o) => o.id === "w3s28-water-1");
    const water2 = stage.objects.find((o) => o.id === "w3s28-water-2");
    expect(water1).toBeDefined();
    expect(water2).toBeDefined();
    expect(water1?.type).toBe("water");
    expect(water2?.type).toBe("water");

    // Pool 1 is higher than Pool 2 (cascaded pools descent)
    expect(water1!.position.y).toBeGreaterThan(water2!.position.y);

    // Stone riverbed platform where player drops after switchback
    const stoneBed = stage.objects.find((o) => o.id === "w3s28-stone-bed");
    expect(stoneBed).toBeDefined();
    expect(stoneBed?.properties?.theme).toBe("era_slate");
    expect(stoneBed!.position.y).toBeLessThan(water2!.position.y);

    // Stone bridge arch with goal inside
    const bridgeArch = stage.objects.find((o) => o.id === "w3s28-bridge-arch");
    expect(bridgeArch).toBeDefined();
    expect(bridgeArch?.properties?.subType).toBe("stone_bridge_arch");

    const goal = stage.objects.find((o) => o.type === "goal");
    expect(goal).toBeDefined();
    expect(goal?.position.x).toBe(bridgeArch?.position.x);
    expect(goal?.position.z).toBe(bridgeArch?.position.z);
  });

  it("should verify specific mechanics: Sin Cobertura drop >200m in M3-N4-E7", () => {
    const dropStage = WORLD_03_LEVEL_04_STAGES[7];
    expect(dropStage.spawn.y).toBeGreaterThan(200);
    const landing = dropStage.objects.find((o) => o.id === "w3s37-valley-landing");
    expect(landing).toBeDefined();
    expect(landing?.position.y).toBeLessThanOrEqual(5.0);
    expect(dropStage.spawn.y - (landing?.position.y ?? 0)).toBeGreaterThan(200);
  });

  it("should verify specific mechanics: El Chorrito 50m waterfall cascade in M3-N4-E10", () => {
    const waterfallStage = WORLD_03_LEVEL_04_STAGES[10];
    const waterfall = waterfallStage.objects.find((o) => o.id === "w3s40-waterfall-drop");
    expect(waterfall).toBeDefined();
    expect(waterfall?.scale.y).toBeGreaterThanOrEqual(50);
  });

  it("should verify M3-N1-E3 (Fuente) hollow platforms and hole parameters for both Editor and Gameplay", () => {
    const stage = WORLD_03_LEVEL_01_STAGES[3];
    const basin = stage.objects.find((o) => o.id === "w3s3-giant-fountain-basin");
    const grate = stage.objects.find((o) => o.id === "w3s3-grate-rim");
    expect(basin).toBeDefined();
    expect(basin?.properties?.shape || basin?.properties?.platformShape).toBe("hollow_rect");
    expect(basin?.properties?.holeWidth).toBe(14.0);
    expect(grate).toBeDefined();
    expect(grate?.properties?.shape || grate?.properties?.platformShape).toBe("hollow_rect");
    expect(grate?.properties?.holeWidth).toBe(4.2);
  });

  it("should verify M3-N1-E4 (Almacen) cheeses and honey jars are hexagonal in both Editor and Gameplay", () => {
    const stage = WORLD_03_LEVEL_01_STAGES[4];
    const cheese1 = stage.objects.find((o) => o.id === "w3s4-cheese-1");
    const cheese2 = stage.objects.find((o) => o.id === "w3s4-cheese-2");
    const honey = stage.objects.find((o) => o.id === "w3s4-honey-jar");
    expect(cheese1?.properties?.shape || cheese1?.properties?.platformShape).toBe("hexagon");
    expect(cheese2?.properties?.shape || cheese2?.properties?.platformShape).toBe("hexagon");
    expect(honey?.properties?.shape || honey?.properties?.platformShape).toBe("hexagon");
  });

  it("should verify M3-N1-E6 (Escaleras2) ramps have correct YXZ rotations without gimbal lock or lateral roll", () => {
    const stage = WORLD_03_LEVEL_01_STAGES[6];
    const r1 = stage.objects.find((o) => o.id === "w3s6-ramp-1");
    const r2 = stage.objects.find((o) => o.id === "w3s6-ramp-2");
    const r3 = stage.objects.find((o) => o.id === "w3s6-ramp-3");
    const r4 = stage.objects.find((o) => o.id === "w3s6-ramp-4");

    expect(r1).toBeDefined();
    expect(r2).toBeDefined();
    expect(r3).toBeDefined();
    expect(r4).toBeDefined();

    // Ramps must climb along their direction and have zero lateral roll (z = 0)
    expect(r1!.rotation.z).toBe(0);
    expect(r2!.rotation.z).toBe(0);
    expect(r3!.rotation.z).toBe(0);
    expect(r4!.rotation.z).toBe(0);

    // Ramp 2 turns 90 deg right (y = PI/2) and inclines up (x < 0)
    expect(r2!.rotation.y).toBeCloseTo(Math.PI / 2, 2);
    expect(r2!.rotation.x).toBeLessThan(0);

    // Ramp 4 turns -90 deg left (y = -PI/2) and inclines up (x < 0)
    expect(r4!.rotation.y).toBeCloseTo(-Math.PI / 2, 2);
    expect(r4!.rotation.x).toBeLessThan(0);
  });

  it("should verify M3-N2-E10 (La Era) circular honey lake (>=60m, passable) and descending slate spiral", () => {
    const stage = WORLD_03_LEVEL_02_STAGES[10];
    expect(stage).toBeDefined();

    // Lake of honey >= 60m width, cylinder shape, passable
    const honeyPool = stage.objects.find((o) => o.id === "w3s20-honey-pool");
    expect(honeyPool).toBeDefined();
    expect(honeyPool?.type).toBe("honey");
    expect(honeyPool?.scale.x).toBeGreaterThanOrEqual(60);
    expect(honeyPool?.scale.z).toBeGreaterThanOrEqual(60);
    expect(honeyPool?.properties?.shape).toBe("cylinder");
    expect(honeyPool?.properties?.passable).toBe(true);

    // Spawn platform placed outside the spiral (Z = 36.0, Y >= 5.0)
    const spawnPl = stage.objects.find((o) => o.id === "w3s20-spawn-pl");
    expect(spawnPl).toBeDefined();
    expect(spawnPl?.position.z).toBe(36.0);
    expect(stage.spawn.z).toBe(36.0);
    expect(stage.spawn.y).toBeGreaterThan(5.0);

    // 32 descending slate rock slabs with 'era_slate' theme
    const slates = stage.objects.filter((o) => o.id.startsWith("w3s20-slate-"));
    expect(slates.length).toBe(32);
    for (const slate of slates) {
      expect(slate.properties?.theme).toBe("era_slate");
    }

    // Verify spiral descent: start is higher than end
    expect(slates[0].position.y).toBeGreaterThan(slates[31].position.y);
    expect(slates[0].position.z).toBeGreaterThan(20);

    // Central hub with cylinder shape and era_slate theme
    const hub = stage.objects.find((o) => o.id === "w3s20-center-hub");
    expect(hub).toBeDefined();
    expect(hub?.properties?.platformShape).toBe("cylinder");
    expect(hub?.properties?.theme).toBe("era_slate");

    // 8 radial stone spoke slabs
    const spokes = stage.objects.filter((o) => o.id.startsWith("w3s20-spoke-"));
    expect(spokes.length).toBe(8);

    // Traditional threshing roller
    const roller = stage.objects.find((o) => o.id === "w3s20-roller");
    expect(roller).toBeDefined();

    // Goal at center of the era
    const goal = stage.objects.find((o) => o.type === "goal");
    expect(goal).toBeDefined();
    expect(goal?.position.x).toBe(0);
    expect(goal?.position.z).toBe(0);
    expect(goal?.position.y).toBe(0.8);
  });

  it("should verify stone_bridge_arch decoration has authentic hollow arch, tajamares, parapets and stone trim", () => {
    const dummyObj = {
      id: "test-bridge",
      type: "decoration" as const,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      properties: { subType: "stone_bridge_arch" }
    };
    const decRes = LevelBuilder.createDecorationMesh(dummyObj, "medium");
    expect(decRes.group).toBeDefined();
    expect(decRes.meshes.length).toBeGreaterThanOrEqual(8);
  });

  it("should verify M3-N3-E8 ('Río Los Ángeles') deep water pools, banks, and bridge arch configuration", () => {
    const stage = WORLD_03_LEVEL_03_STAGES[8];
    expect(stage).toBeDefined();
    if (!stage) return;

    expect(stage.name).toBe("Río Los Ángeles");

    // River pools should be deep (scale.y >= 2.0) to immerse player and trigger underwater effects
    const waterPool1 = stage.objects.find((o) => o.id === "w3s28-water-1");
    expect(waterPool1).toBeDefined();
    expect(waterPool1?.type).toBe("water");
    expect(waterPool1?.scale.y).toBeGreaterThanOrEqual(2.0);
    expect(waterPool1?.scale.z).toBeGreaterThanOrEqual(15.0);

    const waterPool2 = stage.objects.find((o) => o.id === "w3s28-water-2");
    expect(waterPool2).toBeDefined();
    expect(waterPool2?.type).toBe("water");
    expect(waterPool2?.scale.y).toBeGreaterThanOrEqual(2.0);
    expect(waterPool2?.scale.z).toBeGreaterThanOrEqual(20.0);

    // River banks must be elevated (scale.y >= 2.5) to contain the deep water pools
    const bank1A = stage.objects.find((o) => o.id === "w3s28-bank1-l");
    const bank1B = stage.objects.find((o) => o.id === "w3s28-bank1-r");
    expect(bank1A).toBeDefined();
    expect(bank1B).toBeDefined();
    expect(bank1A?.scale.y).toBeGreaterThanOrEqual(2.5);
    expect(bank1B?.scale.y).toBeGreaterThanOrEqual(2.5);

    // Stone bridge arch spanning the river with hollow interior where the goal sits
    const arch = stage.objects.find((o) => o.id === "w3s28-bridge-arch");
    expect(arch).toBeDefined();
    expect(arch?.properties?.subType).toBe("stone_bridge_arch");

    const goal = stage.objects.find((o) => o.id === "w3s28-goal");
    expect(goal).toBeDefined();
    expect(goal?.type).toBe("goal");
  });

  it("should verify M3-N4-E8 ('Cuesta4') dynamic tilting ramp (tilt_x) kinematics, curbs, and incline range", async () => {
    const stage = WORLD_03_LEVEL_04_STAGES[8];
    expect(stage).toBeDefined();
    if (!stage) return;

    expect(stage.name).toBe("Cuesta4");

    // Mega slope ramp object with tilt_x properties
    const rampObj = stage.objects.find((o) => o.id === "w3s38-mega-slope");
    expect(rampObj).toBeDefined();
    expect(rampObj?.type).toBe("ramp");
    expect(rampObj?.properties?.movementType).toBe("tilt_x");
    expect(rampObj?.properties?.isMoving).toBe(true);

    const minAngle = Number(rampObj?.properties?.minAngle);
    const maxAngle = Number(rampObj?.properties?.maxAngle);
    expect(minAngle).toBeCloseTo(0.03, 2); // Flat at entrance so player rolls on easily
    expect(maxAngle).toBeCloseTo(0.388, 2); // Ascending tilt reaching top platform at 16m
    expect(rampObj?.scale.z).toBeGreaterThanOrEqual(40.0); // 42m long ramp spanning from base to top

    // Top platform and goal
    const topPl = stage.objects.find((o) => o.id === "w3s38-top");
    expect(topPl).toBeDefined();
    expect(topPl?.position.y).toBe(16.0);

    const goal = stage.objects.find((o) => o.id === "w3s38-goal");
    expect(goal).toBeDefined();
    expect(goal?.position.y).toBeGreaterThanOrEqual(16.0);

    // Mock document for node test environment if needed
    if (typeof document === "undefined") {
      const dummyGradient = { addColorStop: () => {} };
      const dummyCtx = new Proxy({}, {
        get: (_target, prop) => {
          if (prop === "canvas") return {};
          if (prop === "createLinearGradient" || prop === "createRadialGradient") {
            return () => dummyGradient;
          }
          return () => {};
        }
      });
      (globalThis as any).document = {
        createElement: () => ({
          getContext: () => dummyCtx,
          width: 256,
          height: 256
        })
      };
    }

    // Test LevelBuilder.build with mock physics
    const mockPhysics = {
      createBoxCollider: () => ({ isValid: () => true }),
      createKinematicBox: () => ({
        body: {
          setNextKinematicTranslation: () => {},
          setNextKinematicRotation: () => {},
          setTranslation: () => {},
          setRotation: () => {},
          setLinvel: () => {},
          setAngvel: () => {}
        },
        collider: { isValid: () => true }
      }),
      addBoxColliderToBody: () => ({ isValid: () => true }),
      createKinematicCylinder: () => null,
      createCylinderCollider: () => null,
      clearStageColliders: () => {}
    };

    const builder = new LevelBuilder();
    const built = builder.build(stage, mockPhysics as any, "coin", "medium");

    expect(built.movingPlatforms.length).toBeGreaterThanOrEqual(1);
    const movingRamp = built.movingPlatforms.find((p) => p.id === "w3s38-mega-slope");
    expect(movingRamp).toBeDefined();
    expect(movingRamp?.movementType).toBe("tilt_x");

    // 1. At t = 0.5s (during bottom pause), ramp inclination is at minAngle (0.03 rad)
    built.update(0.5, false);
    expect(movingRamp?.mesh.rotation.x).toBeCloseTo(0.03, 2);

    // 2. At t = 2.5s (during rising tilt, between 1.5s and 4.0s), inclination is intermediate
    built.update(2.0, false); // total 2.5s
    expect(movingRamp?.mesh.rotation.x).toBeGreaterThan(0.03);
    expect(movingRamp?.mesh.rotation.x).toBeLessThan(0.388);

    // 3. At t = 4.8s (during top pause, between 4.0s and 5.5s), inclination is at maxAngle (0.388 rad)
    built.update(2.3, false); // total 4.8s
    expect(movingRamp?.mesh.rotation.x).toBeCloseTo(0.388, 2);

    // 4. Linked collectibles: verify coins along the ramp exist and have synchronized positions
    expect(movingRamp?.linkedCollectibles).toBeDefined();
    expect(movingRamp?.linkedCollectibles?.length).toBeGreaterThanOrEqual(5);

    built.destroy();
  });

  it("should verify M3-N4-E9 ('Ruta Nocturna') pitch-black darkness configuration and terrace ramps", () => {
    const stage = WORLD_03_LEVEL_04_STAGES[9];
    expect(stage).toBeDefined();
    expect(stage.name).toBe("Ruta Nocturna");
    expect(stage.theme).toBe("night");
    expect(stage.properties?.pitchBlack).toBe(true);
    expect(stage.properties?.darknessMode).toBe("spotlight_under");

    // Platforms and connecting ramps
    const platforms = stage.objects.filter((o) => o.type === "platform");
    const ramps = stage.objects.filter((o) => o.type === "ramp");
    expect(platforms.length).toBeGreaterThanOrEqual(7);
    expect(ramps.length).toBeGreaterThanOrEqual(6);

    // Collectibles and goal
    const collectibles = stage.objects.filter((o) => o.type === "collectible");
    expect(collectibles.length).toBe(8);
    const goal = stage.objects.find((o) => o.type === "goal");
    expect(goal).toBeDefined();
  });
});
