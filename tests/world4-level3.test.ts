import { describe, it, expect, beforeAll } from "vitest";
import * as THREE from "three";
import { WORLD_04_LEVEL_03_STAGES } from "../src/levels/world-04/level-03-stages";
import { getBakedStage, BAKED_STAGES } from "../src/levels/BakedStages";
import { LevelBuilder } from "../src/levels/LevelBuilder";
import { Camera } from "../src/rendering/Camera";

describe("World 4: Carabanchel - Level 3: Las Cruces (10 Stages Validation)", () => {
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

  it("should have all 10 stages properly defined in WORLD_04_LEVEL_03_STAGES", () => {
    for (let s = 1; s <= 10; s++) {
      const stage = WORLD_04_LEVEL_03_STAGES[s];
      expect(stage).toBeDefined();
      expect(stage.world).toBe(4);
      expect(stage.level).toBe(3);
      expect(stage.stage).toBe(s);
      expect(stage.objects.length).toBeGreaterThan(0);
      expect(stage.spawn).toBeDefined();

      const goal = stage.objects.find(o => o.type === "goal");
      expect(goal).toBeDefined();
    }
  });

  it("should register all 10 stages in BAKED_STAGES and getBakedStage", () => {
    for (let s = 1; s <= 10; s++) {
      const key = `4_3_${s}`;
      expect(BAKED_STAGES[key]).toBeDefined();
      const baked = getBakedStage(4, 3, s);
      expect(baked).toBeDefined();
      expect(baked?.name).toBe(WORLD_04_LEVEL_03_STAGES[s].name);
    }
  });

  // ---------------------------------------------------------------------------
  // ETAPA 1: Bici2
  // ---------------------------------------------------------------------------
  it("E1 (Bici2) should feature large vertical bike wheels, frame, pedals and goal dock", () => {
    const e1 = WORLD_04_LEVEL_03_STAGES[1];
    expect(e1.name).toBe("Bici2");

    const verticalWheels = e1.objects.filter(o => o.properties?.variant === "bike_wheel_vertical");
    expect(verticalWheels.length).toBeGreaterThanOrEqual(2);

    const r1 = verticalWheels[0].properties?.radius as number;
    const r2 = verticalWheels[1].properties?.radius as number;
    expect(Math.max(r1, r2)).toBeGreaterThanOrEqual(6.0);
    expect(Math.min(r1, r2)).toBeGreaterThanOrEqual(5.5);

    const pedals = e1.objects.filter(o => o.properties?.variant === "bike_pedal");
    expect(pedals.length).toBeGreaterThanOrEqual(2);

    const frameBars = e1.objects.filter(o => 
      o.id?.startsWith("w4s31-top-tube") || 
      o.id?.startsWith("w4s31-chainstays") || 
      o.id?.startsWith("w4s31-handlebar") || 
      o.id?.startsWith("w4s31-front-fork")
    );
    expect(frameBars.length).toBeGreaterThanOrEqual(2);
  });

  // ---------------------------------------------------------------------------
  // ETAPA 2: Alba de Tormes
  // ---------------------------------------------------------------------------
  it("E2 (Alba de Tormes) should feature a circular platform with bouncy membrillo jelly bumpers and center goal", () => {
    const e2 = WORLD_04_LEVEL_03_STAGES[2];
    expect(e2.name).toBe("Alba de Tormes");

    const membrilloBumpers = e2.objects.filter(o => o.properties?.variant === "membrillo_cube");
    expect(membrilloBumpers.length).toBeGreaterThanOrEqual(16);

    for (const b of membrilloBumpers) {
      expect(b.properties?.bounce).toBeGreaterThanOrEqual(1.8);
    }

    const goal = e2.objects.find(o => o.type === "goal");
    expect(goal).toBeDefined();
    expect(Math.abs(goal!.position.x)).toBeLessThanOrEqual(1.0);
    expect(Math.abs(goal!.position.z)).toBeLessThanOrEqual(1.0);
  });

  // ---------------------------------------------------------------------------
  // ETAPA 3: Correr4
  // ---------------------------------------------------------------------------
  it("E3 (Correr4) should be a long sprint path (> 90m total length) with banked curves and park crests", () => {
    const e3 = WORLD_04_LEVEL_03_STAGES[3];
    expect(e3.name).toBe("Correr4");

    const pathSegments = e3.objects.filter(o => (o.type === "platform" || o.type === "ramp") && o.properties?.theme === "carabanchel");
    expect(pathSegments.length).toBeGreaterThanOrEqual(7);

    const minZ = Math.min(...e3.objects.map(o => o.position.z));
    const maxZ = Math.max(...e3.objects.map(o => o.position.z));
    expect(maxZ - minZ).toBeGreaterThanOrEqual(90);
  });

  // ---------------------------------------------------------------------------
  // ETAPA 4: Padel3
  // ---------------------------------------------------------------------------
  it("E4 (Padel3) should feature a vertical padel court with vertical rocket paddle launcher into upper terrace goal and fixed camera", () => {
    const e4 = WORLD_04_LEVEL_03_STAGES[4];
    expect(e4.name).toBe("Padel3");
    expect(e4.properties?.cameraMode).toBe("fixed_padel");

    const verticalTurf = e4.objects.find(o => o.id === "w4s34-vertical-court-turf");
    expect(verticalTurf).toBeDefined();
    expect(Math.abs(verticalTurf!.rotation.x)).toBeCloseTo(Math.PI / 2, 2);

    const verticalPaddle = e4.objects.find(o => o.properties?.variant === "padel_racket");
    expect(verticalPaddle).toBeDefined();
    expect(verticalPaddle!.properties?.launchMode).toBe("vertical");
    expect(verticalPaddle!.properties?.verticalImpulse).toBeGreaterThanOrEqual(24.0);

    const goal = e4.objects.find(o => o.type === "goal");
    expect(goal).toBeDefined();
    expect(goal!.position.y).toBeGreaterThanOrEqual(24.0);
  });

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos15
  // ---------------------------------------------------------------------------
  it("E5 (Objetos15) should have playground obstacles and exactly 5 collectibles", () => {
    const e5 = WORLD_04_LEVEL_03_STAGES[5];
    expect(e5.name).toBe("Objetos15");

    const collectibles = e5.objects.filter(o => o.type === "collectible");
    expect(collectibles.length).toBe(20);

    const carousel = e5.objects.find(o => o.id === "w4s35-carousel-spinner");
    expect(carousel).toBeDefined();
  });

  // ---------------------------------------------------------------------------
  // ETAPA 6: Parque Pirata
  // ---------------------------------------------------------------------------
  it("E6 (Parque Pirata) should feature pirate ship mesh and horizontal moving platforms", () => {
    const e6 = WORLD_04_LEVEL_03_STAGES[6];
    expect(e6.name).toBe("Parque Pirata");

    const pirateShip = e6.objects.find(o => o.properties?.variant === "pirate_ship");
    expect(pirateShip).toBeDefined();

    const horizontalMovers = e6.objects.filter(o => o.type === "moving-platform" && o.properties?.axis === "x");
    expect(horizontalMovers.length).toBeGreaterThanOrEqual(3);
  });

  // ---------------------------------------------------------------------------
  // ETAPA 7: Carrefour
  // ---------------------------------------------------------------------------
  it("E7 (Carrefour) should be a giant supermarket maze (>= 100 wide and >= 50 long) with Pokemon booster walls", () => {
    const e7 = WORLD_04_LEVEL_03_STAGES[7];
    expect(e7.name).toBe("Carrefour");

    const floor = e7.objects.find(o => o.id === "w4s37-carrefour-floor");
    expect(floor).toBeDefined();
    expect(floor!.scale.x).toBeGreaterThanOrEqual(100);
    expect(floor!.scale.z).toBeGreaterThanOrEqual(50);

    const boosterWalls = e7.objects.filter(o => o.properties?.variant === "pokemon_booster_wall");
    expect(boosterWalls.length).toBeGreaterThanOrEqual(20);

    const arch = e7.objects.find(o => o.properties?.variant === "carrefour_arch");
    expect(arch).toBeDefined();
  });

  // ---------------------------------------------------------------------------
  // ETAPA 8: Escaleras Republicanas
  // ---------------------------------------------------------------------------
  it("E8 (Escaleras Republicanas) should have 24 descending steps replicating the amphitheater photo with Republican flag colors, diminishing thickness/tread by quarters, fanning width, and goal on the 24th step", () => {
    const e8 = WORLD_04_LEVEL_03_STAGES[8];
    expect(e8.name).toBe("Escaleras Republicanas");

    const steps = e8.objects.filter(o => o.id?.startsWith("w4s38-step-"));
    expect(steps.length).toBe(24);

    // 8 red steps, 8 yellow steps, 8 purple steps
    const redSteps = steps.slice(0, 8);
    const yellowSteps = steps.slice(8, 16);
    const purpleSteps = steps.slice(16, 24);

    redSteps.forEach(s => expect(["#e53935", "#d32f2f"]).toContain(s.properties?.customColor));
    yellowSteps.forEach(s => expect(["#fbc02d", "#ffeb3b"]).toContain(s.properties?.customColor));
    purpleSteps.forEach(s => expect(["#7b1fa2", "#6a1b9a"]).toContain(s.properties?.customColor));

    // Verify descending height and position
    for (let i = 0; i < steps.length - 1; i++) {
      expect(steps[i].position.y).toBeGreaterThan(steps[i + 1].position.y);
      expect(steps[i].position.z).toBeGreaterThan(steps[i + 1].position.z);
      // Fanning out wider in X
      expect(steps[i + 1].scale.x).toBeGreaterThan(steps[i].scale.x);
      // Becoming less thick in Y (diminishing by quarters)
      expect(steps[i].scale.y).toBeGreaterThan(steps[i + 1].scale.y);
      // Becoming less deep/tread in Z
      expect(steps[i].scale.z).toBeGreaterThan(steps[i + 1].scale.z);
    }

    // First step is gordo (thick and deep)
    expect(steps[0].scale.y).toBe(1.20);
    expect(steps[0].scale.z).toBe(3.20);
    expect(steps[0].scale.x).toBe(14.0);

    // Final 24th step is thin (1/4 thickness) and wide
    expect(steps[23].scale.y).toBe(0.30); // exact 1/4 of 1.20
    expect(steps[23].scale.z).toBe(0.80); // exact 1/4 of 3.20
    expect(steps[23].scale.x).toBe(34.0); // fanned out

    // Goal is directly on the 24th step
    const goal = e8.objects.find(o => o.type === "goal");
    expect(goal).toBeDefined();
    expect(goal!.position.z).toBe(steps[23].position.z);
    expect(goal!.position.y).toBeCloseTo(0.80, 2);

    // Spawn at the top
    expect(e8.spawn.y).toBeGreaterThan(steps[0].position.y);
    expect(e8.spawn.z).toBeGreaterThan(steps[0].position.z);
  });

  // ---------------------------------------------------------------------------
  // ETAPA 9: Parque Aluche
  // ---------------------------------------------------------------------------
  it("E9 (Parque Aluche) should feature steep carril bici descent (length >= 40m) and goal placed below at bottom of slope", () => {
    const e9 = WORLD_04_LEVEL_03_STAGES[9];
    expect(e9.name).toBe("Parque Aluche");

    const bikeSegments = e9.objects.filter(o => o.properties?.theme === "carril_bici");
    expect(bikeSegments.length).toBeGreaterThanOrEqual(4);

    const minZ = Math.min(...bikeSegments.map(s => s.position.z));
    const maxZ = Math.max(...bikeSegments.map(s => s.position.z));
    expect(maxZ - minZ).toBeGreaterThanOrEqual(40);

    const goal = e9.objects.find(o => o.type === "goal");
    expect(goal).toBeDefined();
    expect(goal!.position.y).toBe(30.0);
    expect(e9.spawn.y).toBe(69.5);
  });

  // ---------------------------------------------------------------------------
  // ETAPA 10: Lago
  // ---------------------------------------------------------------------------
  it("E10 (Lago) should feature giant lake water basin, vertical water geyser shooter, and 3 circular moving stepping stones", () => {
    const e10 = WORLD_04_LEVEL_03_STAGES[10];
    expect(e10.name).toBe("Lago");

    const geyser = e10.objects.find(o => o.properties?.variant === "water_geyser");
    expect(geyser).toBeDefined();
    expect(geyser!.properties?.geyserForce).toBeGreaterThanOrEqual(20);

    const goal = e10.objects.find(o => o.type === "goal");
    expect(goal).toBeDefined();
    expect(goal!.position.y).toBeGreaterThanOrEqual(15.0);

    // 3 bloques circulares móviles que orbitan la fuente a diferentes velocidades
    const stone1 = e10.objects.find(o => o.id === "w4s310-step-stone-1");
    const stone2 = e10.objects.find(o => o.id === "w4s310-step-stone-2");
    const stone3 = e10.objects.find(o => o.id === "w4s310-step-stone-3");

    expect(stone1).toBeDefined();
    expect(stone2).toBeDefined();
    expect(stone3).toBeDefined();

    expect(stone1!.type).toBe("moving-platform");
    expect(stone2!.type).toBe("moving-platform");
    expect(stone3!.type).toBe("moving-platform");

    expect(stone1!.properties?.movementType).toBe("circular");
    expect(stone2!.properties?.movementType).toBe("circular");
    expect(stone3!.properties?.movementType).toBe("circular");

    expect(stone1!.properties?.platformShape).toBe("cylinder");
    expect(stone2!.properties?.platformShape).toBe("cylinder");
    expect(stone3!.properties?.platformShape).toBe("cylinder");

    // Distintas velocidades y radios concéntricos alrededor del géiser (0, 0)
    expect(stone1!.properties?.radius).toBe(19.0);
    expect(stone2!.properties?.radius).toBe(12.0);
    expect(stone3!.properties?.radius).toBe(5.5);

    const s1Speed = Number(stone1!.properties?.speed);
    const s2Speed = Number(stone2!.properties?.speed);
    const s3Speed = Number(stone3!.properties?.speed);
    expect(s1Speed).not.toBe(s2Speed);
    expect(s2Speed).not.toBe(s3Speed);
    expect(s1Speed).not.toBe(s3Speed);

    // Sentidos de giro (anillo intermedio gira en sentido inverso)
    expect(stone1!.properties?.direction).toBe(1);
    expect(stone2!.properties?.direction).toBe(-1);
    expect(stone3!.properties?.direction).toBe(1);
  });

  it("should dynamically derive orbital radius and starting position from moved block position without teleporting on play", () => {
    const builder = new LevelBuilder();
    const mockCollider = { isValid: () => true };
    const mockKinematicBody = {
      setNextKinematicTranslation: () => {},
      setNextKinematicRotation: () => {},
      setTranslation: () => {},
      setRotation: () => {},
      setLinvel: () => {},
      setAngvel: () => {}
    };
    const mockPhysics = {
      createBoxCollider: () => mockCollider,
      createSphereCollider: () => mockCollider,
      createCylinderCollider: () => mockCollider,
      createTrimeshCollider: () => mockCollider,
      createKinematicBox: () => ({ body: mockKinematicBody, collider: mockCollider }),
      createKinematicCylinder: () => ({ body: mockKinematicBody, collider: mockCollider }),
      addBoxColliderToBody: () => mockCollider,
      clearStageColliders: () => {}
    };

    // User moved stone 1 to z = 22.0 and stone 3 to z = 4.0
    const customStage = JSON.parse(JSON.stringify(WORLD_04_LEVEL_03_STAGES[10]));
    const customStone1 = customStage.objects.find((o: any) => o.id === "w4s310-step-stone-1");
    customStone1.position.z = 22.0;

    const customStone3 = customStage.objects.find((o: any) => o.id === "w4s310-step-stone-3");
    customStone3.position.x = 3.0;
    customStone3.position.z = 4.0;

    const built = builder.build(customStage, mockPhysics as any, "churros", "medium");
    const p1 = built.movingPlatforms.find(p => p.id === "w4s310-step-stone-1");
    const p3 = built.movingPlatforms.find(p => p.id === "w4s310-step-stone-3");

    expect(p1).toBeDefined();
    expect(p1!.radius).toBeCloseTo(22.0);
    expect(p1!.mesh.position.z).toBeCloseTo(22.0);

    expect(p3).toBeDefined();
    expect(p3!.radius).toBeCloseTo(5.0); // hypot(3, 4) = 5.0
    expect(p3!.mesh.position.x).toBeCloseTo(3.0);
    expect(p3!.mesh.position.z).toBeCloseTo(4.0);

    // On initial update at t = 0 (before gameplay move time), mesh must remain exactly where placed!
    built.update(0, true);
    expect(p1!.mesh.position.x).toBeCloseTo(0.0);
    expect(p1!.mesh.position.z).toBeCloseTo(22.0);
    expect(p3!.mesh.position.x).toBeCloseTo(3.0);
    expect(p3!.mesh.position.z).toBeCloseTo(4.0);

    built.destroy();
  });

  // ---------------------------------------------------------------------------
  // Mesh Generation & LevelBuilder Integration
  // ---------------------------------------------------------------------------
  it("should build LevelBuilder meshes for all 10 stages without error", () => {
    const mockCollider = { isValid: () => true };
    const mockKinematicBody = {
      setNextKinematicTranslation: () => {},
      setNextKinematicRotation: () => {},
      setTranslation: () => {},
      setRotation: () => {},
      setLinvel: () => {},
      setAngvel: () => {}
    };
    const mockPhysics = {
      createBoxCollider: () => mockCollider,
      createSphereCollider: () => mockCollider,
      createCylinderCollider: () => mockCollider,
      createTrimeshCollider: () => mockCollider,
      createKinematicBox: () => ({ body: mockKinematicBody, collider: mockCollider }),
      createKinematicCylinder: () => ({ body: mockKinematicBody, collider: mockCollider }),
      addBoxColliderToBody: () => mockCollider,
      clearStageColliders: () => {}
    };

    const builder = new LevelBuilder();
    for (let s = 1; s <= 10; s++) {
      const stage = WORLD_04_LEVEL_03_STAGES[s];
      expect(() => {
        const built = builder.build(stage, mockPhysics as any, "churros", "medium");
        built.destroy();
      }).not.toThrow();
    }
  });

  it("should generate custom meshes for new variants without throwing", () => {
    expect(() => LevelBuilder.createMembrilloBumperMesh(2.4, 1.4, 2.4, "medium")).not.toThrow();
    expect(() => LevelBuilder.createPokemonBoosterWallMesh(8.0, 3.4, 0.6, 0, "medium")).not.toThrow();
    expect(() => LevelBuilder.createPokemonBoosterWallMesh(8.0, 3.4, 0.6, 1, "medium")).not.toThrow();
    expect(() => LevelBuilder.createPirateShipMesh("medium")).not.toThrow();
    expect(() => LevelBuilder.createWaterGeyserMesh(2.4, 16.0, "medium")).not.toThrow();
    expect(() => LevelBuilder.createCarrefourArchMesh(16.0, 6.5, "medium")).not.toThrow();
  });

  it("should configure fixed, stationary pulled-back camera mode for Padel3 (fixed_padel)", () => {
    const camera = new Camera();
    camera.setCinematicTramMode("fixed_padel");
    expect(camera.getCinematicTramMode()).toBe("fixed_padel");

    // Camera is initially positioned pulled back and elevated facing -Z
    expect(camera.object.position.x).toBeCloseTo(0.0);
    expect(camera.object.position.y).toBeCloseTo(16.5);
    expect(camera.object.position.z).toBeCloseTo(40.0);

    // Snap to player (e.g. spawn at 0, 1.5, 12) maintains fixed camera
    const playerPos = { x: 0.0, y: 1.5, z: 12.0 } as any;
    camera.snapTo(playerPos);
    expect(camera.object.position.x).toBeCloseTo(0.0);
    expect(camera.object.position.y).toBeCloseTo(16.5);
    expect(camera.object.position.z).toBeCloseTo(40.0);

    // Follow player when launched 25m up into the air: camera stays STILL ("quieta")
    const launchedPos = { x: 0.0, y: 26.0, z: -5.0 } as any;
    const vel = { x: 0.0, y: 15.0, z: -2.0 } as any;
    camera.follow(launchedPos, vel, 0.016);
    expect(camera.object.position.x).toBeCloseTo(0.0);
    expect(camera.object.position.y).toBeCloseTo(16.5);
    expect(camera.object.position.z).toBeCloseTo(40.0);

    // rotateYaw is disabled in fixed mode
    camera.rotateYaw(0.5);
    camera.follow(launchedPos, vel, 0.016);
    expect(camera.object.position.x).toBeCloseTo(0.0);
    expect(camera.object.position.z).toBeCloseTo(40.0);
  });

  it("should verify rotated goal physical colliders match visual post and beam positions for any rotation", () => {
    const builder = new LevelBuilder();
    const testAngles = [0, Math.PI / 4, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

    for (const rotY of testAngles) {
      const createdColliders: Array<{ position: THREE.Vector3; halfExtents: any }> = [];
      const mockPhysics = {
        createBoxCollider: (pos: any, _quat: any, halfExtents: any) => {
          createdColliders.push({
            position: new THREE.Vector3(pos.x, pos.y, pos.z),
            halfExtents
          });
          return { isValid: () => true };
        }
      };

      const goalObj: any = {
        id: "test-goal",
        type: "goal",
        position: { x: 10.0, y: 0.4, z: 20.0 },
        rotation: { x: 0, y: rotY, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      };

      const tempEuler = new THREE.Euler(0, rotY, 0, "YXZ");
      const tempQuat = new THREE.Quaternion().setFromEuler(tempEuler);
      const res = (builder as any).createGoalPortal(goalObj, mockPhysics, tempEuler, tempQuat);

      // Verify 3 colliders were created: left post, right post, beam
      expect(createdColliders.length).toBe(3);

      // Verify left post collider matches visual left post world position
      res.group.updateMatrixWorld(true);
      const expectedLeft = new THREE.Vector3(-1.7, 1.59, 0).applyQuaternion(tempQuat).add(new THREE.Vector3(10.0, 0.4, 20.0));
      expect(createdColliders[0].position.distanceTo(expectedLeft)).toBeLessThan(1e-4);

      // Verify right post collider matches visual right post world position
      const expectedRight = new THREE.Vector3(1.7, 1.59, 0).applyQuaternion(tempQuat).add(new THREE.Vector3(10.0, 0.4, 20.0));
      expect(createdColliders[1].position.distanceTo(expectedRight)).toBeLessThan(1e-4);

      // Verify beam collider matches visual top beam world position
      const expectedBeam = new THREE.Vector3(0, 3.40, 0).applyQuaternion(tempQuat).add(new THREE.Vector3(10.0, 0.4, 20.0));
      expect(createdColliders[2].position.distanceTo(expectedBeam)).toBeLessThan(1e-4);
    }
  });

  it("should accurately detect player entering a rotated goal from both front and back directions", () => {
    // Test rotated goal at 90 deg (facing +X / -X opening)
    const goalPos = new THREE.Vector3(15.0, 2.0, 25.0);
    const rotY = Math.PI / 2;
    const goalQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotY, 0, "YXZ"));
    const invQuat = goalQuat.clone().invert();

    const isInsideGoal = (playerPos: THREE.Vector3) => {
      const diff = playerPos.clone().sub(goalPos).applyQuaternion(invQuat);
      return Math.abs(diff.x) <= 1.42 && diff.y >= 0.1 && diff.y <= 3.2 && Math.abs(diff.z) <= 0.40;
    };

    // 1. Entering from front (local -Z direction, which in world is +X direction)
    const frontPos = new THREE.Vector3(15.0 + 0.25, 2.0 + 1.2, 25.0);
    expect(isInsideGoal(frontPos)).toBe(true);

    // 2. Entering from back (local +Z direction, which in world is -X direction)
    const backPos = new THREE.Vector3(15.0 - 0.25, 2.0 + 1.2, 25.0);
    expect(isInsideGoal(backPos)).toBe(true);

    // 3. Player outside opening laterally (colliding with posts at localX = 1.8)
    const postHitPos = new THREE.Vector3(15.0, 2.0 + 1.2, 25.0 + 1.8);
    expect(isInsideGoal(postHitPos)).toBe(false);

    // 4. Player too far before crossing (localZ = 2.0)
    const approachPos = new THREE.Vector3(15.0 + 2.0, 2.0 + 1.2, 25.0);
    expect(isInsideGoal(approachPos)).toBe(false);
  });

  // ---------------------------------------------------------------------------
  // Moving Platform Rotation & Inclination Preservation
  // ---------------------------------------------------------------------------
  it("moving platforms with inclination should preserve their rotation in mesh and kinematic physics during reset and update", () => {
    let lastKinematicRotation: any = null;
    let lastSetRotation: any = null;

    const mockBody: any = {
      setTranslation: () => {},
      setRotation: (q: any) => { lastSetRotation = { ...q }; },
      setLinvel: () => {},
      setAngvel: () => {},
      setNextKinematicTranslation: () => {},
      setNextKinematicRotation: (q: any) => { lastKinematicRotation = { ...q }; }
    };

    const mockPhysics: any = {
      createKinematicBox: () => ({ body: mockBody }),
      createBoxCollider: () => ({}),
      createCylinderCollider: () => ({}),
      createStaticPlane: () => ({}),
      clearStageColliders: () => {}
    };

    const rotEuler = new THREE.Euler(0.28, 0.45, -0.18, "YXZ");
    const expectedQuat = new THREE.Quaternion().setFromEuler(rotEuler);

    const testLevelData: any = {
      id: "test-inclined-moving-platform",
      world: 4,
      level: 3,
      stage: 1,
      name: "Inclined Platform Test",
      theme: "city",
      timeLimit: 60,
      spawn: { x: 0, y: 2, z: 0 },
      objects: [
        {
          id: "inclined-mover-1",
          type: "moving-platform",
          position: { x: 5.0, y: 3.0, z: -10.0 },
          rotation: { x: rotEuler.x, y: rotEuler.y, z: rotEuler.z },
          scale: { x: 6.0, y: 0.8, z: 6.0 },
          properties: {
            axis: "x",
            distance: 5.0,
            speed: 2.0
          }
        }
      ]
    };

    const builder = new LevelBuilder();
    const built = builder.build(testLevelData, mockPhysics, "churros", "medium");
    expect(built.movingPlatforms.length).toBe(1);

    const mover = built.movingPlatforms[0];
    expect(mover.baseQuaternion).toBeDefined();
    expect(mover.baseRotation).toBeDefined();
    expect(mover.baseQuaternion!.x).toBeCloseTo(expectedQuat.x, 4);
    expect(mover.baseQuaternion!.y).toBeCloseTo(expectedQuat.y, 4);
    expect(mover.baseQuaternion!.z).toBeCloseTo(expectedQuat.z, 4);
    expect(mover.baseQuaternion!.w).toBeCloseTo(expectedQuat.w, 4);

    // 1. Verify reset() restores inclination
    built.reset?.();
    expect(mover.mesh.quaternion.x).toBeCloseTo(expectedQuat.x, 4);
    expect(mover.mesh.quaternion.y).toBeCloseTo(expectedQuat.y, 4);
    expect(mover.mesh.quaternion.z).toBeCloseTo(expectedQuat.z, 4);
    expect(mover.mesh.quaternion.w).toBeCloseTo(expectedQuat.w, 4);
    expect(lastSetRotation.x).toBeCloseTo(expectedQuat.x, 4);
    expect(lastSetRotation.y).toBeCloseTo(expectedQuat.y, 4);

    // 2. Verify update() keeps mesh and kinematic rotation aligned to base inclination
    built.update(0.16);
    expect(mover.mesh.quaternion.x).toBeCloseTo(expectedQuat.x, 4);
    expect(mover.mesh.quaternion.y).toBeCloseTo(expectedQuat.y, 4);
    expect(lastKinematicRotation).toBeDefined();
    expect(lastKinematicRotation.x).toBeCloseTo(expectedQuat.x, 4);
    expect(lastKinematicRotation.y).toBeCloseTo(expectedQuat.y, 4);
    expect(lastKinematicRotation.z).toBeCloseTo(expectedQuat.z, 4);
    expect(lastKinematicRotation.w).toBeCloseTo(expectedQuat.w, 4);

    built.destroy();
  });

  // ---------------------------------------------------------------------------
  // Pirate Ship Side Wall Colliders & Hull Geometry
  // ---------------------------------------------------------------------------
  it("pirate ship structure should generate physical side wall colliders to prevent falling off the sides", () => {
    const createdColliders: Array<{ pos: THREE.Vector3; halfExtents: any }> = [];

    const mockPhysics: any = {
      createBoxCollider: (pos: THREE.Vector3, _rot: any, halfExtents: any) => {
        createdColliders.push({ pos: pos.clone(), halfExtents: { ...halfExtents } });
        return {};
      },
      createCylinderCollider: () => ({}),
      createKinematicBox: () => ({ body: { setTranslation: () => {}, setRotation: () => {} } }),
      createStaticPlane: () => ({}),
      clearStageColliders: () => {}
    };

    const testStage: any = {
      id: "test-pirate-ship",
      world: 4,
      level: 3,
      stage: 6,
      name: "Parque Pirata Test",
      theme: "city",
      timeLimit: 60,
      spawn: { x: 0, y: 3, z: 20 },
      objects: [
        {
          id: "pirate-ship-obj",
          type: "platform",
          position: { x: 0.0, y: 0.0, z: 0.0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          properties: { variant: "pirate_ship" }
        }
      ]
    };

    const builder = new LevelBuilder();
    const built = builder.build(testStage, mockPhysics, "churros", "medium");

    // Must generate full ship colliders: decks, side walls, front/back walls, bowsprit, masts, sails, cannons, wheel, keel
    expect(createdColliders.length).toBeGreaterThanOrEqual(18);

    // Verify Port side wall (x ≈ -4.675) and Starboard side wall (x ≈ +4.675)
    const portWall = createdColliders.find(c => Math.abs(c.pos.x - (-4.675)) < 0.1);
    expect(portWall).toBeDefined();
    expect(portWall!.halfExtents.z).toBeGreaterThanOrEqual(14.0);
    expect(portWall!.halfExtents.y).toBeGreaterThanOrEqual(1.4);

    const starboardWall = createdColliders.find(c => Math.abs(c.pos.x - 4.675) < 0.1);
    expect(starboardWall).toBeDefined();
    expect(starboardWall!.halfExtents.z).toBeGreaterThanOrEqual(14.0);
    expect(starboardWall!.halfExtents.y).toBeGreaterThanOrEqual(1.4);

    // Verify Muro de Detrás (Popa / Stern Transom Back Wall at z ≈ 13.9)
    const backWall = createdColliders.find(c => Math.abs(c.pos.z - 13.9) < 0.1 && c.halfExtents.x >= 4.5);
    expect(backWall).toBeDefined();

    // Verify Muro de Alante (Proa / Bow Front Wall at z ≈ -13.9)
    const frontWall = createdColliders.find(c => Math.abs(c.pos.z - (-13.9)) < 0.1 && c.halfExtents.x >= 4.4);
    expect(frontWall).toBeDefined();

    // Verify Palo de Alante (Bauprés / Bowsprit Front Pole at z ≈ -16.5, y ≈ 3.2)
    const bowsprit = createdColliders.find(c => Math.abs(c.pos.z - (-16.5)) < 0.2 && Math.abs(c.pos.y - 3.2) < 0.2);
    expect(bowsprit).toBeDefined();
    expect(bowsprit!.halfExtents.y).toBeGreaterThanOrEqual(3.0);

    // Verify Velas (Sails for Main Mast at z ≈ 2.1 and Foremast at z ≈ -5.4)
    const mainSail = createdColliders.find(c => Math.abs(c.pos.z - 2.1) < 0.15 && c.halfExtents.x >= 3.0);
    expect(mainSail).toBeDefined();
    const foreSail = createdColliders.find(c => Math.abs(c.pos.z - (-5.4)) < 0.15 && c.halfExtents.x >= 2.5);
    expect(foreSail).toBeDefined();

    // Verify Mástiles (Main Mast at z ≈ 2.0 and Foremast at z ≈ -5.5)
    const mainMast = createdColliders.find(c => Math.abs(c.pos.z - 2.0) < 0.1 && c.halfExtents.y >= 6.0);
    expect(mainMast).toBeDefined();
    const foreMast = createdColliders.find(c => Math.abs(c.pos.z - (-5.5)) < 0.1 && c.halfExtents.y >= 5.0);
    expect(foreMast).toBeDefined();

    // Verify 3D pirate ship mesh includes keel, lower hull belly, stern transom, and bow prow
    const shipRes = LevelBuilder.createPirateShipMesh("high");
    expect(shipRes.group.name).toBe("pirate_ship_structure_group");
    expect(shipRes.meshes.length).toBeGreaterThanOrEqual(18);

    built.destroy();
  });

  // ---------------------------------------------------------------------------
  // M4-N3-E9 Parque Aluche Elevation & LevelEditor Synchronization
  // ---------------------------------------------------------------------------
  it("M4-N3-E9 Parque Aluche should be elevated (+20m over 48.5, start at 68.5, goal below at 30.0)", () => {
    const stage9 = WORLD_04_LEVEL_03_STAGES[9];
    expect(stage9).toBeDefined();
    expect(stage9.spawn.y).toBe(69.5);

    // Highest block is start-hill at 68.5 (48.5 + 20)
    const startHill = stage9.objects.find(o => o.id === "w4s39-start-hill");
    expect(startHill).toBeDefined();
    expect(startHill!.position.y).toBe(68.5);

    // Verify all platforms, ramps, and goal are elevated >= 30m to avoid instant death
    const allObjectsAboveOrAt30 = stage9.objects.every(obj => obj.position.y >= 30.0);
    expect(allObjectsAboveOrAt30).toBe(true);

    // Goal should be at the bottom (meta por debajo) at y = 30.0
    const goal = stage9.objects.find(o => o.type === "goal");
    expect(goal).toBeDefined();
    expect(goal!.position.y).toBe(30.0);
    expect(goal!.position.z).toBe(-43.0);

    // Verify LevelEditor sync key V4 updates stale local storage
    const mockStorage: Record<string, string> = {
      "megaramp_w4_l3_las_cruces_stages_v2": "true",
      "custom_stage_4_3_9": JSON.stringify({
        id: "world-04-level-03-stage-09",
        world: 4,
        level: 3,
        stage: 9,
        spawn: { x: 0, y: 49.5, z: 20 },
        objects: [{ id: "old-ramp", type: "ramp", position: { x: 0, y: 48.5, z: 10 } }]
      })
    };

    // Simulate what syncOfficialStagesIfNeeded does
    const SYNC_KEY_W4L3_V4 = "megaramp_w4_l3_parque_aluche_restored_user_68_5_v4";
    if (mockStorage[SYNC_KEY_W4L3_V4] !== "true") {
      const baked = WORLD_04_LEVEL_03_STAGES[9];
      mockStorage["custom_stage_4_3_9"] = JSON.stringify(baked);
      mockStorage[SYNC_KEY_W4L3_V4] = "true";
    }

    const updated = JSON.parse(mockStorage["custom_stage_4_3_9"]);
    expect(updated.spawn.y).toBe(69.5);
    expect(mockStorage[SYNC_KEY_W4L3_V4]).toBe("true");
  });

  it("should verify M4-N3-E8 Escaleras Republicanas replicates the authentic photo with 24 decreasing steps, 3 aisles, fronton, wings, railing and cypresses", () => {
    const stage8 = WORLD_04_LEVEL_03_STAGES[8];
    expect(stage8).toBeDefined();
    expect(stage8.name).toBe("Escaleras Republicanas");

    // 1. Frontón superior curvo rojo ("VIVA LA TERCERA REPUBLICA")
    const frontonObj = stage8.objects.find(o => o.id === "w4s38-top-red-parapet");
    expect(frontonObj).toBeDefined();
    expect(frontonObj!.properties?.variant).toBe("republican_fronton");
    const frontonMesh = LevelBuilder.createRepublicanFrontonMesh(frontonObj!.scale.x, frontonObj!.scale.y, frontonObj!.scale.z);
    expect(frontonMesh.group).toBeDefined();
    expect(frontonMesh.group.name).toBe("republican_fronton_group");
    expect(frontonMesh.meshes.length).toBeGreaterThanOrEqual(2);

    // 2. Exactly 24 steps with authentic Republican tricolor bands (8 red, 8 yellow, 8 purple)
    const stepObjs = stage8.objects.filter(o => o.id.startsWith("w4s38-step-"));
    expect(stepObjs.length).toBe(24);

    for (let i = 1; i <= 24; i++) {
      const step = stepObjs[i - 1];
      expect(step.properties?.variant).toBe("republican_step");
      expect(step.properties?.stepNumber).toBe(i);
      if (i <= 8) {
        expect(step.properties?.band).toBe("rojo");
      } else if (i <= 16) {
        expect(step.properties?.band).toBe("amarillo");
      } else {
        expect(step.properties?.band).toBe("morado");
      }

      // Decreasing thickness / tread downwards
      if (i > 1) {
        const prevStep = stepObjs[i - 2];
        expect(step.scale.y).toBeLessThanOrEqual(prevStep.scale.y);
        expect(step.scale.z).toBeLessThanOrEqual(prevStep.scale.z);
        expect(step.scale.x).toBeGreaterThan(prevStep.scale.x); // Fanning out crescent bowl
      }

      // Step mesh generator with 3 concrete aisles (left, center, right)
      const stepMesh = LevelBuilder.createRepublicanStepMesh(step.scale.x, step.scale.y, step.scale.z, step.properties?.band as string, i);
      expect(stepMesh.group).toBeDefined();
      expect(stepMesh.group.name).toBe(`republican_step_${i}_group`);
      expect(stepMesh.meshes.length).toBeGreaterThanOrEqual(4); // 3 aisles + bleachers
    }

    // 3. Lateral retaining wings (left & right)
    const wingLeft = stage8.objects.find(o => o.id === "w4s38-wing-left");
    const wingRight = stage8.objects.find(o => o.id === "w4s38-wing-right");
    expect(wingLeft).toBeDefined();
    expect(wingRight).toBeDefined();
    expect(wingLeft!.properties?.variant).toBe("amphitheater_wing");
    expect(wingRight!.properties?.variant).toBe("amphitheater_wing");
    const wingMesh = LevelBuilder.createAmphitheaterWingMesh("left", 52.0, 8.5);
    expect(wingMesh.group.name).toContain("amphitheater_wing");

    // 4. Lake promenade wooden railing
    const railing = stage8.objects.find(o => o.id === "w4s38-lake-railing");
    expect(railing).toBeDefined();
    expect(railing!.properties?.variant).toBe("lake_wooden_railing");
    const railingMesh = LevelBuilder.createLakeWoodenRailingMesh(38.0, 1.1, 0.35);
    expect(railingMesh.group.name).toBe("lake_wooden_railing_group");

    // 5. Tall Cypresses matching the photo
    const mainCypress = stage8.objects.find(o => o.id === "w4s38-cypress-main");
    expect(mainCypress).toBeDefined();
    expect(mainCypress!.properties?.subType).toBe("cruces_cypress");
    const cypressMesh = LevelBuilder.createCrucesCypressMesh(14.0);
    expect(cypressMesh.group.name).toBe("cruces_cypress_group");

    // 6. Lake Cruces water in front
    const lakeWater = stage8.objects.find(o => o.id === "w4s38-lake-water");
    expect(lakeWater).toBeDefined();
    expect(lakeWater!.type).toBe("water");

    // 7. Goal situated at the 24th step
    const goalObj = stage8.objects.find(o => o.type === "goal");
    expect(goalObj).toBeDefined();
    const lastStep = stepObjs[23];
    expect(goalObj!.position.z).toBeCloseTo(lastStep.position.z, 1);
  });
});
