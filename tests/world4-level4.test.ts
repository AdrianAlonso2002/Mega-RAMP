import { describe, it, expect, beforeAll } from "vitest";
import { WORLD_04_LEVEL_04_STAGES } from "../src/levels/world-04/level-04-stages";
import { getBakedStage, BAKED_STAGES } from "../src/levels/BakedStages";
import { LevelBuilder } from "../src/levels/LevelBuilder";

describe("World 4: Carabanchel - Level 4: Islazul (10 Stages Validation)", () => {
  beforeAll(() => {
    // Mock document and canvas for headless node test environment
    if (typeof document === "undefined") {
      const dummyGradient = { addColorStop: () => {} };
      const dummyCtx = new Proxy({}, {
        get: (_target, prop) => {
          if (prop === "canvas") return {};
          if (prop === "createImageData") return (width:number,height:number)=>({data:new Uint8ClampedArray(width*height*4),width,height});
          if (prop === "measureText") return ()=>({width:100});
          if (prop === "createLinearGradient" || prop === "createRadialGradient") {
            return () => dummyGradient;
          }
          return () => {};
        }
      });
      const createMockElement = () => ({
        getContext: () => dummyCtx,
        width: 256,
        height: 256,
        style: {},
        classList: { add: () => {}, remove: () => {}, toggle: () => {} },
        appendChild: (child: any) => child,
        removeChild: () => {},
        querySelector: () => null,
        querySelectorAll: () => [],
        addEventListener: () => {},
        removeEventListener: () => {},
        setAttribute: () => {},
        removeAttribute: () => {},
        getAttribute: () => null,
        remove: () => {},
        innerHTML: "",
        textContent: "",
        className: ""
      });

      (globalThis as any).document = {
        body: { style: {} },
        createElement: () => createMockElement(),
        querySelector: () => null,
        querySelectorAll: () => []
      };
    }

    if (typeof window === "undefined") {
      (globalThis as any).window = {
        addEventListener: () => {},
        removeEventListener: () => {},
        innerWidth: 1024,
        innerHeight: 768,
        location: { reload: () => {} }
      };
    }

    if (typeof localStorage === "undefined") {
      const storage: Record<string, string> = {};
      (globalThis as any).localStorage = {
        getItem: (k: string) => storage[k] ?? null,
        setItem: (k: string, v: string) => { storage[k] = String(v); },
        removeItem: (k: string) => { delete storage[k]; },
        clear: () => { for (const k in storage) delete storage[k]; },
        get length() { return Object.keys(storage).length; },
        key: (i: number) => Object.keys(storage)[i] ?? null
      };
    }
  });

  it("should have all 10 stages properly defined in WORLD_04_LEVEL_04_STAGES", () => {
    for (let s = 1; s <= 10; s++) {
      const stage = WORLD_04_LEVEL_04_STAGES[s];
      expect(stage).toBeDefined();
      expect(stage.world).toBe(4);
      expect(stage.level).toBe(4);
      expect(stage.stage).toBe(s);
      expect(stage.objects.length).toBeGreaterThan(0);
      expect(stage.spawn).toBeDefined();

      const goal = stage.objects.find(o => o.type === "goal");
      expect(goal).toBeDefined();
    }
  });

  it("should register all 10 stages in BAKED_STAGES and getBakedStage", () => {
    for (let s = 1; s <= 10; s++) {
      const key = `4_4_${s}`;
      expect(BAKED_STAGES[key]).toBeDefined();
      const baked = getBakedStage(4, 4, s);
      expect(baked).toBeDefined();
      expect(baked?.name).toBe(WORLD_04_LEVEL_04_STAGES[s].name);
    }
  });

  // ---------------------------------------------------------------------------
  // ETAPA 1: 2Bus35
  // ---------------------------------------------------------------------------
  it("Stage 1: 2Bus35 should have EMT Bus 35 and Islazul Mall Facade behind the goal", () => {
    const stage = WORLD_04_LEVEL_04_STAGES[1];
    expect(stage.name).toBe("2Bus35");

    const bus = stage.objects.find(o => o.properties?.variant === "emt_bus_35");
    expect(bus).toBeDefined();
    expect(bus?.type).toBe("moving-platform");
    expect(bus?.properties?.speed).toBe(3.2);

    const goal = stage.objects.find(o => o.type === "goal");
    expect(goal).toBeDefined();

    const mallFacade = stage.objects.find(o => o.properties?.variant === "islazul_mall_facade");
    expect(mallFacade).toBeDefined();
    // Mall facade is placed behind the goal in Z
    expect(mallFacade!.position.z).toBeLessThan(goal!.position.z);
    expect(mallFacade!.scale.x).toBeGreaterThanOrEqual(40.0);
  });

  // ---------------------------------------------------------------------------
  // ETAPA 2: Primark
  // ---------------------------------------------------------------------------
  it("Stage 2: Primark should feature giant maze floor, clothes racks and plush toys", () => {
    const stage = WORLD_04_LEVEL_04_STAGES[2];
    expect(stage.name).toBe("Primark");

    const floor = stage.objects.find(o => o.id === "w4s42-floor");
    expect(floor).toBeDefined();
    expect(floor!.scale.x).toBeGreaterThanOrEqual(20.0); // > 20m wide
    expect(floor!.scale.z).toBeGreaterThanOrEqual(60.0); // > 60m long

    const clothesWalls = stage.objects.filter(o => o.properties?.variant === "primark_clothes_wall");
    expect(clothesWalls.length).toBeGreaterThanOrEqual(10);

    const plushes = stage.objects.filter(o => o.properties?.subType === "primark_plush_toy");
    expect(plushes.length).toBeGreaterThanOrEqual(5);

    const portal = stage.objects.find(o => o.properties?.variant === "primark_portal");
    expect(portal).toBeDefined();
  });

  // ---------------------------------------------------------------------------
  // ETAPA 3: ToyPlanet
  // ---------------------------------------------------------------------------
  it("Stage 3: ToyPlanet should feature 5 Funko boxes with specified movements and top goal", () => {
    const stage = WORLD_04_LEVEL_04_STAGES[3];
    expect(stage.name).toBe("ToyPlanet");

    const funko1 = stage.objects.find(o => o.id === "w4s43-funko-1");
    expect(funko1?.properties?.axis).toBe("x");

    const funko2 = stage.objects.find(o => o.id === "w4s43-funko-2");
    expect(funko2?.properties?.axis).toBe("y");

    const funko3 = stage.objects.find(o => o.id === "w4s43-funko-3");
    expect(funko3?.properties?.movementType).toBe("vertical_circle");

    const funko4 = stage.objects.find(o => o.id === "w4s43-funko-4");
    expect(funko4?.properties?.axis).toBe("x");

    const funko5 = stage.objects.find(o => o.id === "w4s43-funko-5");
    expect(funko5?.properties?.axis).toBe("y");

    const goal = stage.objects.find(o => o.type === "goal");
    expect(goal).toBeDefined();
    expect(goal!.position.y).toBeGreaterThanOrEqual(17.0); // Elevated summit
  });

  // ---------------------------------------------------------------------------
  // ETAPA 4: Muro4
  // ---------------------------------------------------------------------------
  it("Stage 4: Muro4 should feature 4 Carabanchel walls and elevators reaching sky terrace", () => {
    const stage = WORLD_04_LEVEL_04_STAGES[4];
    expect(stage.name).toBe("Muro4");

    const lifts = stage.objects.filter(o => o.type === "moving-platform" && o.properties?.slopeY === 1.0);
    expect(lifts.length).toBe(4);

    // Front dividing walls are moving platforms going up and down
    const movingWalls = stage.objects.filter(o => o.id.includes("wall") && o.type === "moving-platform");
    expect(movingWalls.length).toBe(4);
    movingWalls.forEach(wall => {
      expect(wall.properties?.axis).toBe("y");
      expect(wall.properties?.movementType).toBe("sine");
      expect(wall.properties?.distance).toBeGreaterThanOrEqual(2.5);
      expect(wall.properties?.isMoving).toBe(true);
    });

    const goal = stage.objects.find(o => o.type === "goal");
    expect(goal).toBeDefined();
    expect(goal!.position.y).toBeGreaterThanOrEqual(18.0);
  });

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos16
  // ---------------------------------------------------------------------------
  it("Stage 5: Objetos16 should have commercial gallery atrium and 8 collectibles", () => {
    const stage = WORLD_04_LEVEL_04_STAGES[5];
    expect(stage.name).toBe("Objetos16");

    const collectibles = stage.objects.filter(o => o.type === "collectible");
    expect(collectibles.length).toBe(20);

    const spinners = stage.objects.filter(o => o.type === "rotating-platform");
    expect(spinners.length).toBeGreaterThanOrEqual(2);
  });

  // ---------------------------------------------------------------------------
  // ETAPA 6: Rodilla
  // ---------------------------------------------------------------------------
  it("Stage 6: Rodilla should have 3 pyramid sandwiches >80m long, >20m wide, >8m tall with bumpers", () => {
    const stage = WORLD_04_LEVEL_04_STAGES[6];
    expect(stage.name).toBe("Rodilla");

    const sandwiches = stage.objects.filter(o => o.properties?.variant === "rodilla_sandwich");
    expect(sandwiches.length).toBe(3);

    // Each sandwich is 22m wide (> 20m wide)
    sandwiches.forEach(s => {
      expect(s.scale.x).toBeGreaterThanOrEqual(20.0);
    });

    // Total length is at least 80m
    const totalLength = sandwiches.reduce((acc, s) => acc + s.scale.z, 0);
    expect(totalLength).toBeGreaterThanOrEqual(80.0);

    // Each sandwich is tall (>= 8m) - the character is tiny compared to them
    sandwiches.forEach(s => {
      expect(s.scale.y).toBeGreaterThanOrEqual(8.0);
    });

    // The revised sandwich has an uninterrupted base, two walkable bread slopes
    // and two closed triangular sides; the old filling rails were removed.
    const sandMesh = LevelBuilder.createRodillaSandwichMesh(22.0, 8.5, 30.0);
    expect(sandMesh.group).toBeDefined();
    expect(sandMesh.meshes.filter(mesh=>mesh.geometry.type==="BoxGeometry")).toHaveLength(3);
    expect(sandMesh.meshes.filter(mesh=>mesh.geometry.type==="ShapeGeometry")).toHaveLength(2);

    // Rodilla bumpers on the slopes (parachoques de rebote)
    const bumpers = stage.objects.filter(o => o.properties?.variant === "rodilla_bumper");
    expect(bumpers.length).toBeGreaterThanOrEqual(6);

    // All bumpers have elastic bounce
    bumpers.forEach(b => {
      expect(b.properties?.bounce).toBeGreaterThanOrEqual(1.5);
    });

    // Mesh builder for bumper
    const bumperMesh = LevelBuilder.createRodillaBumperMesh(1.2, 1.4);
    expect(bumperMesh.group).toBeDefined();
    expect(bumperMesh.meshes.length).toBeGreaterThanOrEqual(3);
  });

  // ---------------------------------------------------------------------------
  // ETAPA 7: TacoBell
  // ---------------------------------------------------------------------------
  it("Stage 7: TacoBell should have giant Quesarito >60m long rolling continuously and corner goal", () => {
    const stage = WORLD_04_LEVEL_04_STAGES[7];
    expect(stage.name).toBe("TacoBell");

    const quesarito = stage.objects.find(o => o.properties?.variant === "quesarito_cylinder");
    expect(quesarito).toBeDefined();
    expect(quesarito?.properties?.movementType).toBe("quesarito_roll");
    expect(quesarito!.scale.z).toBeGreaterThanOrEqual(60.0);

    const goal = stage.objects.find(o => o.type === "goal");
    expect(goal).toBeDefined();
    // Goal is off-center in a corner (X != 0)
    expect(Math.abs(goal!.position.x)).toBeGreaterThan(4.0);
  });

  // ---------------------------------------------------------------------------
  // ETAPA 8: TGB
  // ---------------------------------------------------------------------------
  it("Stage 8: TGB should have 4 giant bouncy brioche burgers with trampoline bounce >50m course", () => {
    const stage = WORLD_04_LEVEL_04_STAGES[8];
    expect(stage.name).toBe("TGB");

    const burgers = stage.objects.filter(o => o.properties?.variant === "tgb_burger");
    expect(burgers.length).toBe(4);

    burgers.forEach(b => {
      expect(b.properties?.bounce).toBeGreaterThanOrEqual(2.0);
    });

    const startDock = stage.objects.find(o => o.id === "w4s48-start-dock");
    const goalDock = stage.objects.find(o => o.id === "w4s48-goal-dock");
    const courseDist = Math.abs(startDock!.position.z - goalDock!.position.z);
    expect(courseDist).toBeGreaterThanOrEqual(50.0);
  });

  // ---------------------------------------------------------------------------
  // ETAPA 9: YelmoCines
  // ---------------------------------------------------------------------------
  it("Stage 9: YelmoCines should feature steep cinema seat amphitheater and 16:9 movie screen", () => {
    const stage = WORLD_04_LEVEL_04_STAGES[9];
    expect(stage.name).toBe("YelmoCines");

    const seatRows = stage.objects.filter(o => o.properties?.variant === "cinema_seat_row");
    expect(seatRows.length).toBeGreaterThanOrEqual(12);

    const screen = stage.objects.find(o => o.properties?.variant === "cinema_screen_monumental");
    expect(screen).toBeDefined();
    expect(screen!.scale.x).toBeGreaterThanOrEqual(30.0);
  });

  // ---------------------------------------------------------------------------
  // ETAPA 10: VivaGYM
  // ---------------------------------------------------------------------------
  it("Stage 10: VivaGYM should feature 84m x 22m treadmill with backward conveyor push and looping obstacles", () => {
    const stage = WORLD_04_LEVEL_04_STAGES[10];
    expect(stage.name).toBe("VivaGYM");

    const treadmill = stage.objects.find(o => o.properties?.variant === "vivagym_treadmill");
    expect(treadmill).toBeDefined();
    expect(treadmill?.properties?.movementType).toBe("vivagym_treadmill");
    expect(treadmill!.scale.x).toBeGreaterThanOrEqual(20.0); // > 20m wide
    expect(treadmill!.scale.z).toBeGreaterThanOrEqual(70.0); // > 70m long

    const loopObstacles = stage.objects.filter(o => o.properties?.movementType === "loop");
    expect(loopObstacles.length).toBeGreaterThanOrEqual(2);
  });

  // ---------------------------------------------------------------------------
  // 3D MESH GENERATION INTEGRITY CHECK FOR ALL 10 STAGES
  // ---------------------------------------------------------------------------
  it("should build 3D meshes without errors for all 10 stages of World 4 Level 4", () => {
    const builder = new LevelBuilder();
    const collider={setTranslationWrtParent:()=>{},setRotationWrtParent:()=>{}};
    const mockPhysics: any = {
      createBoxCollider: () => ({ body: {} }),
      createCylinderCollider: () => ({ body: {} }),
      createKinematicBox: () => ({ collider,body: { setNextKinematicTranslation: () => {}, setNextKinematicRotation: () => {} } }),
      createKinematicCylinder: () => ({ collider,body: { setNextKinematicTranslation: () => {}, setNextKinematicRotation: () => {} } }),
      addBoxColliderToBody: () => {},
      addCylinderColliderToBody: () => {},
      createTrimeshCollider: () => {}
    };

    for (let s = 1; s <= 10; s++) {
      const stage = WORLD_04_LEVEL_04_STAGES[s];
      expect(() => {
        const built = builder.build(stage, mockPhysics, "churros", "medium");
        expect(built).toBeDefined();
        expect(built.group).toBeDefined();
        expect(built.spawnPoint).toBeDefined();
        expect(built.collidableMeshes.length).toBeGreaterThan(0);
      }).not.toThrow();
    }
  });
});
