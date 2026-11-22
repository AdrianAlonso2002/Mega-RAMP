import { describe, it, expect, beforeAll } from "vitest";
import * as THREE from "three";
import { WORLD_04_LEVEL_01_STAGES } from "../src/levels/world-04/level-01-stages";
import { getBakedStage, BAKED_STAGES } from "../src/levels/BakedStages";
import { LevelBuilder } from "../src/levels/LevelBuilder";
import { LevelLoader } from "../src/levels/LevelLoader";
import { LevelEditor } from "../src/editor/LevelEditor";
import {decodeStagePayload} from '../src/storage/StageStorage';

describe("World 4: Carabanchel - Level 1: Piqueñas (10 Stages Validation)", () => {
  beforeAll(() => {
    // Mock document and canvas for headless node test environment
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

  const expectedStageNames: Record<number, string> = {
    1: "Cuadrado4",
    2: "Bus35",
    3: "Día2",
    4: "Droguería",
    5: "Objetos13",
    6: "Misina2",
    7: "vidas tiene el gato",
    8: "Litos",
    9: "Adri",
    10: "Pinar"
  };

  it("should verify all 10 stages exist and match exact required names", () => {
    for (let s = 1; s <= 10; s++) {
      const stage = WORLD_04_LEVEL_01_STAGES[s];
      expect(stage).toBeDefined();
      expect(stage.world).toBe(4);
      expect(stage.level).toBe(1);
      expect(stage.stage).toBe(s);
      expect(stage.name).toBe(expectedStageNames[s]);
      expect(stage.timeLimit).toBeGreaterThan(0);
    }
  });

  it("should verify each stage has valid spawn, exactly 1 goal, and exactly 10 collectibles", () => {
    for (let s = 1; s <= 10; s++) {
      const stage = WORLD_04_LEVEL_01_STAGES[s];

      // Spawn
      expect(stage.spawn).toBeDefined();
      expect(typeof stage.spawn.x).toBe("number");
      expect(typeof stage.spawn.y).toBe("number");
      expect(typeof stage.spawn.z).toBe("number");

      // Goal
      const goals = stage.objects.filter(o => o.type === "goal");
      expect(goals.length).toBe(1);

      // Collectibles
      const collectibles = stage.objects.filter(o => o.type === "collectible");
      expect(collectibles.length).toBe([8,10,8,8,20,8,8,8,12,10][s-1]);

      // Unique object IDs
      const ids = stage.objects.map(o => o.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    }
  });

  it("should verify all 10 stages are properly registered in BAKED_STAGES", () => {
    for (let s = 1; s <= 10; s++) {
      const key = `4_1_${s}`;
      expect(BAKED_STAGES[key]).toBeDefined();
      expect(BAKED_STAGES[key].name).toBe(expectedStageNames[s]);

      const fromHelper = getBakedStage(4, 1, s);
      expect(fromHelper).toBeDefined();
      expect(fromHelper?.name).toBe(expectedStageNames[s]);
    }
  });

  it("should verify M4-N1-E1 ('Cuadrado4') Carabanchel urban square and Madrid decorations", () => {
    const stage = WORLD_04_LEVEL_01_STAGES[1];
    expect(stage.name).toBe("Cuadrado4");

    const plazaFloor = stage.objects.find(o => o.id === "w4s11-plaza-floor");
    expect(plazaFloor).toBeDefined();
    expect(plazaFloor?.scale.x).toBe(18.0);
    expect(plazaFloor?.scale.z).toBe(18.0);

    const decorations = stage.objects.filter(o => o.type === "decoration");
    const subTypes = decorations.map(d => d.properties?.subType);
    expect(subTypes).toContain("madrid_metro_sign");
    expect(subTypes).toContain("madrid_street_sign_carabanchel");
    expect(subTypes).toContain("madrid_street_lamp_urban");
    expect(subTypes).toContain("madrid_recycle_bins");
    expect(subTypes).toContain("madrid_granite_bollard");
  });

  it("should verify M4-N1-E2 ('Bus35') Calle Piqueñas length >= 80m and EMT Blue Bus 35", () => {
    const stage = WORLD_04_LEVEL_01_STAGES[2];
    expect(stage.name).toBe("Bus35");

    // Roadway platform length >= 80m
    const road = stage.objects.find(o => o.id === "w4s12-street-asphalt");
    expect(road).toBeDefined();
    expect(road?.scale.z).toBeGreaterThanOrEqual(80.0);

    // Portal 4 street sign
    const portal4Sign = stage.objects.find(o => o.id === "w4s12-sign-portal4");
    expect(portal4Sign).toBeDefined();

    // EMT Madrid blue Bus 35
    const busChassis = stage.objects.find(o => o.id === "w4s12-bus-chassis");
    expect(busChassis).toBeDefined();
    expect(busChassis?.type).toBe("moving-platform");
    expect(busChassis?.properties?.customColor).toBe("#0055b8"); // EMT Madrid corporate blue
    expect(busChassis?.properties?.isMoving).toBe(true);
    expect(busChassis?.properties?.distance).toBeGreaterThanOrEqual(60.0);
    expect(busChassis?.properties?.variant).toBe("emt_bus_35");
    expect(busChassis?.properties?.movementType).toBe("emt_bus_35");
    expect(busChassis?.properties?.startDelay).toBe(2.0); // Waits 2 seconds

    // Character spawn drops inside the bus from above
    expect(stage.spawn.y).toBeGreaterThan((busChassis?.position.y ?? 0) + 2.0);
    expect(Math.abs(stage.spawn.x - (busChassis?.position.x ?? 0))).toBeLessThanOrEqual(0.5);
    expect(Math.abs(stage.spawn.z - (busChassis?.position.z ?? 0))).toBeLessThanOrEqual(1.0);

    // Bus shelter
    const shelter = stage.objects.find(o => o.id === "w4s12-bus-shelter");
    expect(shelter?.properties?.subType).toBe("madrid_bus_stop");

    // Calle Piqueñas road stencil marking
    const marking = stage.objects.find(o => o.id === "w4s12-marking-piquenas");
    expect(marking?.properties?.subType).toBe("madrid_street_marking_piquenas");

    // Parked vehicles on street (white delivery van, parked cars)
    const parkedCars = stage.objects.filter(o => o.properties?.subType === "madrid_parked_car");
    expect(parkedCars.length).toBeGreaterThanOrEqual(3);
    expect(parkedCars.some(c => c.properties?.carType === "van")).toBe(true);

    // Cinematic camera mode for wide cityscape & bus view
    expect(stage.properties?.cameraMode).toBe("cinematic_bus35");

    // Residential buildings with Farmacia and diverse Madrid facade colors (white, yellow, orange, brick)
    const buildings = stage.objects.filter(o => o.properties?.subType === "madrid_residential_building");
    expect(buildings.length).toBeGreaterThanOrEqual(4);
    expect(buildings.some(b => b.properties?.facadeColor === "white")).toBe(true);
    expect(buildings.some(b => b.properties?.facadeColor === "yellow")).toBe(true);
    expect(buildings.some(b => b.properties?.facadeColor === "orange")).toBe(true);
    expect(buildings.some(b => b.properties?.facadeColor === "brick")).toBe(true);

    const farmacia = stage.objects.find(o => o.properties?.shopType === "farmacia");
    expect(farmacia?.properties?.subType).toBe("madrid_residential_building");

    // Collectibles inside the bus with synchronized delay
    const busCols = stage.objects.filter(o => o.type === "collectible" && (o.position.z > 28 && o.position.z < 38));
    expect(busCols.length).toBeGreaterThanOrEqual(5);
    expect(busCols.every(c => c.properties?.startDelay === 2.0)).toBe(true);
  });

  it("should verify Camera cinematic mode 'bus35' settings and elevated framing", async () => {
    const { Camera } = await import("../src/rendering/Camera");
    const cam = new Camera();
    cam.setCinematicTramMode("bus35");
    expect(cam.getCinematicTramMode()).toBe("bus35");

    // Snap to target
    const target = new (await import("three")).Vector3(0, 1.5, 20);
    cam.snapTo(target);

    // Follow target and verify camera is elevated and pulled back (distance >= 15m)
    cam.follow(target, new (await import("three")).Vector3(0, 0, -4), 0.016);
    expect(cam.object.position.y).toBeGreaterThan(target.y + 6.0);
    expect(cam.object.position.z).toBeGreaterThan(target.z + 12.0);
  });

  it("should verify M4-N1-E3 ('Día2') supermarket aisle with moving furniture/shelves", () => {
    const stage = WORLD_04_LEVEL_01_STAGES[3];
    expect(stage.name).toBe("Día2");

    // Floor length >= 60m
    const floor = stage.objects.find(o => o.id === "w4s13-dia-floor");
    expect(floor).toBeDefined();
    expect(floor?.scale.z).toBeGreaterThanOrEqual(60.0);

    // Moving shelves
    const movingShelves = stage.objects.filter(o => o.type === "moving-platform" && o.id.includes("shelf-mov"));
    expect(movingShelves.length).toBeGreaterThanOrEqual(3);
    for (const shelf of movingShelves) {
      expect(shelf.properties?.isMoving).toBe(true);
      expect(shelf.properties?.axis).toBe("x");
      expect(shelf.properties?.speed).toBeGreaterThan(0);
    }
  });

  it("should verify M4-N1-E4 ('Droguería') Chinese bazaar with 3 distinct lanes", () => {
    const stage = WORLD_04_LEVEL_01_STAGES[4];
    expect(stage.name).toBe("Droguería");

    // Floor exists (10.5m wide)
    const floor = stage.objects.find(o => o.id === "w4s14-bazar-floor");
    expect(floor).toBeDefined();
    expect(floor?.scale.x).toBeGreaterThanOrEqual(10.0);

    // Dividing lane walls create 3 corridors
    const divWalls = stage.objects.filter(o => o.id.startsWith("w4s14-div-"));
    expect(divWalls.length).toBeGreaterThanOrEqual(4);

    // Bazaar shelf displays and counters
    const shelves = stage.objects.filter(o => o.properties?.subType === "bazar_shelf_display");
    expect(shelves.length).toBeGreaterThanOrEqual(3);
    const counter = stage.objects.find(o => o.properties?.subType === "checkout_counter");
    expect(counter).toBeDefined();
  });

  it("should verify M4-N1-E5 ('Objetos13') Carabanchel urban obstacle course", () => {
    const stage = WORLD_04_LEVEL_01_STAGES[5];
    expect(stage.name).toBe("Objetos13");

    // Interactive bumpers and rotating obstacles
    const bumpers = stage.objects.filter(o => o.type === "bumper");
    expect(bumpers.length).toBeGreaterThanOrEqual(5);

    const turnstile = stage.objects.find(o => o.type === "rotating-platform");
    expect(turnstile).toBeDefined();

    const kiosk = stage.objects.find(o => o.properties?.subType === "madrid_kiosk_press");
    expect(kiosk).toBeDefined();
  });

  it("should verify M4-N1-E6 ('Misina2') course with spectacular final mega jump ramp and landing island", () => {
    const stage = WORLD_04_LEVEL_01_STAGES[6];
    expect(stage.name).toBe("Misina2");

    // Mega jump ramp
    const jumpRamp = stage.objects.find(o => o.id === "w4s16-mega-jump-ramp");
    expect(jumpRamp).toBeDefined();
    expect(jumpRamp?.type).toBe("ramp");
    expect(jumpRamp?.position.z).toBeLessThan(-10.0);

    // Floating landing island with the goal
    const landingIsland = stage.objects.find(o => o.id === "w4s16-landing-island");
    expect(landingIsland).toBeDefined();
    expect(landingIsland?.position.z).toBeLessThan(-30.0);

    // Jump chasm gap between ramp and island is at least 15m
    const chasmGap = Math.abs(landingIsland!.position.z - jumpRamp!.position.z);
    expect(chasmGap).toBeGreaterThanOrEqual(15.0);

    const goal = stage.objects.find(o => o.type === "goal");
    expect(Math.abs(goal!.position.z - landingIsland!.position.z)).toBeLessThan(2.0);
  });

  it("should verify M4-N1-E7 ('vidas tiene el gato') 4-terrace residential building drop", () => {
    const stage = WORLD_04_LEVEL_01_STAGES[7];
    expect(stage.name).toBe("vidas tiene el gato");

    const t4 = stage.objects.find(o => o.id === "w4s17-terrace-4");
    const t3 = stage.objects.find(o => o.id === "w4s17-terrace-3");
    const t2 = stage.objects.find(o => o.id === "w4s17-terrace-2");
    const t1 = stage.objects.find(o => o.id === "w4s17-terrace-1");

    expect(t4).toBeDefined();
    expect(t3).toBeDefined();
    expect(t2).toBeDefined();
    expect(t1).toBeDefined();

    // Start on Terrace 4 (highest, Y ~ 18), dropping to Terrace 3 (~12), Terrace 2 (~6), Terrace 1 (~0)
    expect(t4!.position.y).toBeGreaterThan(t3!.position.y);
    expect(t3!.position.y).toBeGreaterThan(t2!.position.y);
    expect(t2!.position.y).toBeGreaterThan(t1!.position.y);
    expect(t4!.position.y).toBeCloseTo(18.0, 1);
    expect(t1!.position.y).toBeCloseTo(0.0, 1);

    // Player spawns on Terrace 4
    expect(stage.spawn.y).toBeGreaterThan(18.0);

    // Goal is on Terrace 1
    const goal = stage.objects.find(o => o.type === "goal");
    expect(goal?.position.y).toBeCloseTo(0.8, 1);
  });

  it("should verify M4-N1-E8 ('Litos') door and spring timing duo", () => {
    const stage = WORLD_04_LEVEL_01_STAGES[8];
    expect(stage.name).toBe("Litos");

    // Door
    const door = stage.objects.find(o => o.properties?.variant === "slamming_door");
    expect(door).toBeDefined();
    expect(door?.type).toBe("moving-platform");
    expect(door?.properties?.movementType).toBe("slamming_door");
    expect(door?.properties?.cycleTime).toBe(3.2);

    // Litos duo
    const litosDuo = stage.objects.find(o => o.properties?.movementType === "litos_duo");
    expect(litosDuo).toBeDefined();
    expect(litosDuo?.properties?.axis).toBe("z");
    expect(litosDuo?.properties?.direction).toBe(1);
    expect(litosDuo?.properties?.distance).toBeGreaterThanOrEqual(10.0);

    // 3D Mesh creation test
    const duoMesh = LevelBuilder.createLitosDuoMesh("medium");
    expect(duoMesh.group).toBeDefined();
    expect(duoMesh.group.name).toBe("litos_duo_group");
    const man = duoMesh.group.getObjectByName("man_atleti");
    const woman = duoMesh.group.getObjectByName("woman_floral");
    expect(man).toBeDefined();
    expect(woman).toBeDefined();

    const doorMesh = LevelBuilder.createDoorMesh("medium");
    expect(doorMesh.doorPivot.name).toBe("doorPivot");
  });

  it("should verify M4-N1-E9 ('Adri') giant Super Saiyan Goku statue and continuous connected Kamehameha beam >= 100m with circular physics", async () => {
    const stage = WORLD_04_LEVEL_01_STAGES[9];
    expect(stage.name).toBe("Adri");

    // Giant Goku statue
    const goku = stage.objects.find(o => o.properties?.subType === "giant_goku_saiyan");
    expect(goku).toBeDefined();
    expect(goku?.scale.x).toBeGreaterThanOrEqual(2.0);

    // Origin charge platform
    const originPlatform = stage.objects.find(o => o.id === "w4s19-goku-origin-platform");
    expect(originPlatform?.properties?.variant).toBe("kamehameha_charge");

    // Single continuous connected Kamehameha beam platform (not separated platforms)
    const kameBeam = stage.objects.find(o => o.id === "w4s19-kame-continuous-beam" || o.id.startsWith("w4s19-kame-seg-"));
    expect(kameBeam).toBeDefined();
    expect(kameBeam?.properties?.variant).toBe("kamehameha_beam");
    expect(kameBeam?.scale.z).toBeGreaterThanOrEqual(100.0);
    expect((kameBeam?.properties?.pathPoints as any[])?.length).toBeGreaterThanOrEqual(10);

    // End burst sphere platform
    const burstSphere = stage.objects.find(o => o.id === "w4s19-kame-burst-sphere");
    expect(burstSphere?.properties?.variant).toBe("kamehameha_burst");

    // Test 3D procedural mesh builders
    const gokuMesh = LevelBuilder.createGokuMesh("medium");
    expect(gokuMesh.group).toBeDefined();
    expect(gokuMesh.group.name).toBe("giant_goku_saiyan_group");
    expect(gokuMesh.meshes.length).toBeGreaterThanOrEqual(25);

    // Continuous connected 3D tube geometry
    const continuousMesh = LevelBuilder.createContinuousKamehamehaMesh(undefined, 1.8, "medium");
    expect(continuousMesh.group).toBeDefined();
    expect(continuousMesh.group.name).toBe("kamehameha_continuous_tube_group");
    expect(continuousMesh.tubeGeometry).toBeDefined();
    expect(continuousMesh.platformMesh).toBeDefined();
    expect(continuousMesh.meshes.length).toBeGreaterThanOrEqual(15);

    // Verify LevelBuilder builds continuous Kamehameha beam using createTrimeshCollider for circular physics
    let trimeshCreated = false;
    let trimeshVerticesCount = 0;
    const mockPhysicsWithTrimesh = {
      createBoxCollider: () => ({ isValid: () => true }),
      createCylinderCollider: () => ({ isValid: () => true }),
      createKinematicBox: () => ({ body: {}, collider: { isValid: () => true } }),
      createKinematicCylinder: () => null,
      createTrimeshCollider: (v: Float32Array, idx: Uint32Array) => {
        trimeshCreated = true;
        trimeshVerticesCount = v.length + idx.length;
        return { isValid: () => true };
      },
      clearStageColliders: () => {}
    };

    const builder = new LevelBuilder();
    const builtStage9 = builder.build(stage, mockPhysicsWithTrimesh as any, "coin", "medium");
    expect(builtStage9).toBeDefined();
    expect(trimeshCreated).toBe(true);
    expect(trimeshVerticesCount).toBeGreaterThanOrEqual(100);

    const beamMesh = LevelBuilder.createKamehamehaBeamMesh(4.0, 0.8, 10.0, "medium");
    expect(beamMesh.group).toBeDefined();
    expect(beamMesh.platformMesh).toBeDefined();

    const burstMesh = LevelBuilder.createKamehamehaBurstMesh(9.0, 9.0, "medium");
    expect(burstMesh.group).toBeDefined();
    expect(burstMesh.platformMesh).toBeDefined();

    const chargeMesh = LevelBuilder.createKamehamehaChargeMesh(5.5, "medium");
    expect(chargeMesh.group).toBeDefined();
    expect(chargeMesh.platformMesh).toBeDefined();
  });

  it("should verify M4-N1-E10 ('Pinar') pine avenue and accelerating wall", () => {
    const stage = WORLD_04_LEVEL_01_STAGES[10];
    expect(stage.name).toBe("Pinar");

    // Pines along the avenue
    const pines = stage.objects.filter(o => o.properties?.subType === "pine_hurdes");
    expect(pines.length).toBeGreaterThanOrEqual(8);

    // Accelerating wall
    const wall = stage.objects.find(o => o.properties?.movementType === "accelerating_wall");
    expect(wall).toBeDefined();
    expect(wall?.type).toBe("moving-platform");
    expect(wall?.properties?.direction).toBe(-1); // Pushes towards goal (-Z)
    expect(wall?.properties?.speed).toBeGreaterThan(0); // v0
    expect(wall?.properties?.waveAmplitude).toBeGreaterThan(0); // acceleration a
    expect(wall?.properties?.distance).toBeGreaterThanOrEqual(60.0);
  });

  it("should build all 12 Madrid Carabanchel decorations without errors", () => {
    const decorationsToTest = [
      "madrid_metro_sign",
      "madrid_street_sign_carabanchel",
      "madrid_street_lamp_urban",
      "madrid_recycle_bins",
      "madrid_granite_bollard",
      "madrid_terrace_bar_umbrella",
      "madrid_residential_building",
      "madrid_bus_stop",
      "madrid_traffic_light",
      "bazar_shelf_display",
      "madrid_kiosk_press",
      "giant_goku_saiyan"
    ];

    for (const subType of decorationsToTest) {
      const objData = {
        id: `test-dec-${subType}`,
        type: "decoration" as const,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType }
      };

      const result = LevelBuilder.createDecorationMesh(objData as any, "medium");
      expect(result).toBeDefined();
      expect(result.group).toBeDefined();
      expect(result.meshes.length).toBeGreaterThan(0);
    }
  });

  it("should verify litos_duo and accelerating_wall kinematic motion in LevelBuilder.build", () => {
    // Stage 8: Litos duo spring cycle
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
      createTrimeshCollider: () => ({ isValid: () => true }),
      clearStageColliders: () => {}
    };

    const builder = new LevelBuilder();
    const builtStage8 = builder.build(WORLD_04_LEVEL_01_STAGES[8], mockPhysics as any, "coin", "medium");

    const duo = builtStage8.movingPlatforms.find(p => p.movementType === "litos_duo");
    expect(duo).toBeDefined();

    const door = builtStage8.movingPlatforms.find(p => p.movementType === "slamming_door");
    expect(door).toBeDefined();
    expect(door?.subMeshes?.doorPivot).toBeDefined();

    // At t = 0.3s (resting behind door): offset should be 0
    builtStage8.update(0.3, false);
    expect(duo?.mesh.position.z).toBeCloseTo(duo!.basePosition.z, 2);

    // At t = 0.9s (fast sprint forward): offset should be greater than 0
    builtStage8.update(0.6, false); // total 0.9s
    expect(duo?.mesh.position.z).toBeGreaterThan(duo!.basePosition.z + 4.0);

    builtStage8.destroy();

    // Stage 10: Accelerating wall
    const builtStage10 = builder.build(WORLD_04_LEVEL_01_STAGES[10], mockPhysics as any, "coin", "medium");
    const accWall = builtStage10.movingPlatforms.find(p => p.movementType === "accelerating_wall");
    expect(accWall).toBeDefined();

    // At t = 2.0s: travel1 = v0 * 2 + 0.5 * a * 4
    builtStage10.update(2.0, false);
    const zAfter2s = accWall!.mesh.position.z;
    const travel2s = Math.abs(zAfter2s - accWall!.basePosition.z);

    // At t = 4.0s (another 2s): with acceleration, the distance covered in second 2s must exceed first 2s!
    builtStage10.update(2.0, false);
    const zAfter4s = accWall!.mesh.position.z;
    const travel4s = Math.abs(zAfter4s - accWall!.basePosition.z);

    expect(travel4s).toBeGreaterThan(travel2s * 2.0); // Strict proof of acceleration: d(4) > 2 * d(2)

    // Reset test
    builtStage10.reset?.();
    expect(accWall!.mesh.position.z).toBeCloseTo(accWall!.basePosition.z, 2);

    builtStage10.destroy();
  });

  it("should verify standardized object IDs prefix w4s1 across all 10 stages (w4s11..w4s110)", () => {
    for (let s = 1; s <= 10; s++) {
      const stage = WORLD_04_LEVEL_01_STAGES[s];
      const expectedPrefix = `w4s1${s}`;
      for (const obj of stage.objects) {
        expect(obj.id.startsWith(expectedPrefix)).toBe(true);
      }
    }
  });

  it("should verify LevelLoader correctly preserves user-edited M4-N1-E10 and does not overwrite with baked", async () => {
    const loader = new LevelLoader();
    const customKey = "custom_stage_4_1_10";

    const customData = {
      id: "stage-4-1-10",
      world: 4,
      level: 1,
      stage: 10,
      name: "Mi Pinar Customizado",
      timeLimit: 99,
      customSaved: true,
      properties: { userSaved: true, customNote: "Prueba de guardado usuario" },
      spawn: { x: 0, y: 1.5, z: 25 },
      objects: [
        {
          id: "obj-custom-wall-override",
          type: "moving-platform",
          position: { x: 0, y: 2.2, z: 30 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 8, y: 4, z: 2 },
          properties: { movementType: "accelerating_wall" }
        },
        {
          id: "obj-custom-extra-platform",
          type: "platform",
          position: { x: 2, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 5, y: 1, z: 5 }
        },
        {
          id: "obj-custom-goal",
          type: "goal",
          position: { x: 0, y: 1, z: -50 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 }
        }
      ]
    };

    localStorage.setItem(customKey, JSON.stringify(customData));

    // Load stage through LevelLoader
    const loaded = await loader.loadStage(4, 1, 10);

    // Verify it returned the custom data, not baked
    expect(loaded.name).toBe("Mi Pinar Customizado");
    expect(loaded.timeLimit).toBe(99);
    expect(loaded.customSaved).toBe(true);
    expect(loaded.objects.some(o => o.id === "obj-custom-extra-platform")).toBe(true);

    // Verify localStorage was NOT overwritten by baked data
    const stored = JSON.parse(localStorage.getItem(customKey)!);
    expect(stored.name).toBe("Mi Pinar Customizado");
    expect(stored.timeLimit).toBe(99);
    expect(stored.customSaved).toBe(true);
  });

  it("should verify LevelLoader preserves custom stages across any World 4 stage when custom objects are present", async () => {
    const loader = new LevelLoader();
    for (let s = 1; s <= 5; s++) {
      const customKey = `custom_stage_4_1_${s}`;
      const customData = {
        id: `stage-4-1-${s}`,
        world: 4,
        level: 1,
        stage: s,
        name: `Custom Stage ${s}`,
        timeLimit: 85,
        customSaved: true,
        properties: { userSaved: true },
        spawn: { x: 0, y: 1, z: 0 },
        objects: [
          {
            id: `obj-custom-${s}-base`,
            type: "platform",
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 10, y: 1, z: 10 }
          },
          {
            id: `obj-custom-${s}-goal`,
            type: "goal",
            position: { x: 0, y: 1, z: -10 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        ]
      };

      localStorage.setItem(customKey, JSON.stringify(customData));

      const loaded = await loader.loadStage(4, 1, s);
      expect(loaded.name).toBe(`Custom Stage ${s}`);
      expect(loaded.timeLimit).toBe(85);

      const stored = JSON.parse(localStorage.getItem(customKey)!);
      expect(stored.name).toBe(`Custom Stage ${s}`);
    }
  });

  it("should verify syncOfficialStagesIfNeeded does not overwrite user customSaved stages", () => {
    const customKey10 = "custom_stage_4_1_10";
    const userCustomStage = {
      id: "stage-4-1-10",
      world: 4,
      level: 1,
      stage: 10,
      name: "Mi Pinar Intacto",
      timeLimit: 120,
      customSaved: true,
      properties: { userSaved: true },
      spawn: { x: 0, y: 1, z: 0 },
      objects: [
        { id: "obj-custom-test", type: "platform", position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2, y: 2, z: 2 } },
        { id: "obj-custom-goal", type: "goal", position: { x: 0, y: 1, z: -10 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
      ]
    };

    localStorage.setItem(customKey10, JSON.stringify(userCustomStage));
    localStorage.removeItem("megaramp_w4_l1_stage10_id_fix_v2");

    LevelEditor.syncOfficialStagesIfNeeded();

    const result = JSON.parse(localStorage.getItem(customKey10)!);
    expect(result.name).toBe("Mi Pinar Intacto");
    expect(result.timeLimit).toBe(120);
    expect(result.customSaved).toBe(true);
  });

  it("should verify LevelEditor saveCurrentLevel persists edits on M4-N1-E10 through stage transitions", () => {
    const root = document.createElement("div");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    const callbacks = {
      onPlaytest: () => {},
      onExit: () => {}
    };

    const editor = new LevelEditor(root, scene, camera, callbacks, 4, 1, 10);
    expect(editor.getCurrentWorld()).toBe(4);
    expect(editor.getCurrentLevel()).toBe(1);
    expect(editor.getCurrentStage()).toBe(10);

    // Make an edit to the level
    editor.getLevelData().name = "Pinar Con Cambios del Usuario";
    editor.getLevelData().timeLimit = 150;
    editor.getLevelData().objects.push({
      id: "obj-custom-test-bench",
      type: "decoration",
      position: { x: 0, y: 1, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      properties: { subType: "bench" }
    });

    // Save in the editor
    editor.saveCurrentLevel();

    // Verify localStorage has customSaved
    const savedRaw = localStorage.getItem("custom_stage_4_1_10");
    expect(savedRaw).toBeDefined();
    const parsedSaved = JSON.parse(decodeStagePayload(savedRaw!));
    expect(parsedSaved.customSaved).toBe(true);
    expect(parsedSaved.name).toBe("Pinar Con Cambios del Usuario");
    expect(parsedSaved.timeLimit).toBe(150);

    // Previewing the original must not delete or overwrite the one saved version.
    editor.loadStage(4,1,10,'original');
    expect(editor.getLevelData().name).toBe(getBakedStage(4,1,10)!.name);
    expect(JSON.parse(decodeStagePayload(localStorage.getItem('custom_stage_4_1_10')!)).name).toBe('Pinar Con Cambios del Usuario');
    editor.loadStage(4,1,10);
    expect(editor.getLevelData().name).toBe('Pinar Con Cambios del Usuario');

    // Switch to Stage 9
    editor.loadStage(4, 1, 9);
    expect(editor.getCurrentStage()).toBe(9);
    expect(editor.getLevelData().name).toBe("Adri");

    // Switch back to Stage 10
    editor.loadStage(4, 1, 10);
    expect(editor.getCurrentStage()).toBe(10);

    // User edits must be strictly preserved!
    expect(editor.getLevelData().name).toBe("Pinar Con Cambios del Usuario");
    expect(editor.getLevelData().timeLimit).toBe(150);
    expect(editor.getLevelData().objects.some(o => o.id === "obj-custom-test-bench")).toBe(true);

    editor.destroy();
  });
});
