import { describe, it, expect, beforeAll } from "vitest";
import * as THREE from "three";
import { WORLD_04_LEVEL_02_STAGES } from "../src/levels/world-04/level-02-stages";
import { getBakedStage, BAKED_STAGES } from "../src/levels/BakedStages";
import { LevelBuilder } from "../src/levels/LevelBuilder";
import { LevelLoader } from "../src/levels/LevelLoader";
import { LevelEditor } from "../src/editor/LevelEditor";

describe("World 4: Carabanchel - Level 2: San Melitón (10 Stages Validation)", () => {
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
    1: "Bus34",
    2: "Salto4",
    3: "Padel2",
    4: "La Mina",
    5: "Objetos14",
    6: "Galway",
    7: "13 2B",
    8: "Rony",
    9: "Pao",
    10: "Ninanos"
  };

  it("should verify all 10 stages exist and match exact required names", () => {
    for (let s = 1; s <= 10; s++) {
      const stage = WORLD_04_LEVEL_02_STAGES[s];
      expect(stage).toBeDefined();
      expect(stage.world).toBe(4);
      expect(stage.level).toBe(2);
      expect(stage.stage).toBe(s);
      expect(stage.name).toBe(expectedStageNames[s]);
      expect(stage.timeLimit).toBeGreaterThan(0);
    }
  });

  it("should verify each stage has valid spawn, exactly 1 goal, and correct collectibles count", () => {
    for (let s = 1; s <= 10; s++) {
      const stage = WORLD_04_LEVEL_02_STAGES[s];

      // Spawn
      expect(stage.spawn).toBeDefined();
      expect(typeof stage.spawn.x).toBe("number");
      expect(typeof stage.spawn.y).toBe("number");
      expect(typeof stage.spawn.z).toBe("number");

      // Goal
      const goals = stage.objects.filter(o => o.type === "goal");
      expect(goals.length).toBe(1);

      // Stage budgets sum to 100, with twenty in the rest stage.
      const collectibles = stage.objects.filter(o => o.type === "collectible");
      expect(collectibles.length).toBe([10,10,8,10,20,8,6,8,10,10][s-1]);

      // Unique object IDs
      const ids = stage.objects.map(o => o.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    }
  });

  it("should verify all 10 stages are properly registered in BAKED_STAGES", () => {
    for (let s = 1; s <= 10; s++) {
      const key = `4_2_${s}`;
      expect(BAKED_STAGES[key]).toBeDefined();
      expect(BAKED_STAGES[key].name).toBe(expectedStageNames[s]);

      const fromHelper = getBakedStage(4, 2, s);
      expect(fromHelper).toBeDefined();
      expect(fromHelper?.name).toBe(expectedStageNames[s]);
    }
  });

  it("should verify M4-N2-E1 ('Bus34') narrow street, yellow/orange buildings, Bus 34 and cinematic camera", () => {
    const stage = WORLD_04_LEVEL_02_STAGES[1];
    expect(stage.name).toBe("Bus34");

    // Roadway platform length >= 80m and narrower street (width 7.2m vs 9.6m on Bus35)
    const road = stage.objects.find(o => o.id === "w4s21-street-roadway");
    expect(road).toBeDefined();
    expect(road?.scale.z).toBeGreaterThanOrEqual(80.0);
    expect(road?.scale.x).toBeLessThan(8.0);

    // EMT Madrid blue Bus 34
    const busChassis = stage.objects.find(o => o.id === "w4s21-bus-34");
    expect(busChassis).toBeDefined();
    expect(busChassis?.type).toBe("moving-platform");
    expect(busChassis?.properties?.customColor).toBe("#0072ce");
    expect(busChassis?.properties?.isMoving).toBe(true);
    expect(busChassis?.properties?.distance).toBeGreaterThanOrEqual(80.0);
    expect(busChassis?.properties?.variant).toBe("emt_bus_34");
    expect(busChassis?.properties?.movementType).toBe("emt_bus_34");
    expect(busChassis?.properties?.startDelay).toBe(2.0); // Waits 2 seconds

    // Character spawn drops inside the bus from above
    expect(stage.spawn.y).toBeGreaterThan((busChassis?.position.y ?? 0) + 2.0);
    expect(Math.abs(stage.spawn.x - (busChassis?.position.x ?? 0))).toBeLessThanOrEqual(0.5);

    // Cinematic camera mode
    expect(stage.properties?.cameraMode).toBe("cinematic_bus34");

    // Only yellow and orange buildings, no ground shops
    const buildings = stage.objects.filter(o => o.properties?.subType === "madrid_residential_building");
    expect(buildings.length).toBeGreaterThanOrEqual(6);
    const colors = buildings.map(b => b.properties?.facadeColor);
    colors.forEach(col => {
      // Must be warm yellow or orange tones
      expect(["yellow", "orange"]).toContain(col);
    });
    // No shops
    const hasShop = buildings.some(b => b.properties?.shopType && b.properties.shopType !== "portal");
    expect(hasShop).toBe(false);
  });

  it("should verify M4-N2-E2 ('Salto4') 4 escalating rooftop jump sections", () => {
    const stage = WORLD_04_LEVEL_02_STAGES[2];
    expect(stage.name).toBe("Salto4");

    const runs = stage.objects.filter(o => o.id.startsWith("w4s22-run-"));
    const ramps = stage.objects.filter(o => o.id.startsWith("w4s22-ramp-"));

    expect(runs.length).toBeGreaterThanOrEqual(4);
    expect(ramps.length).toBeGreaterThanOrEqual(4);

    // Escalating height across ramps
    expect(ramps[1].position.y).toBeGreaterThan(ramps[0].position.y);
    expect(ramps[2].position.y).toBeGreaterThan(ramps[1].position.y);
    expect(ramps[3].position.y).toBeGreaterThan(ramps[2].position.y);
  });

  it("should verify M4-N2-E3 ('Padel2') double sized padel court and 2x padel racket", () => {
    const stage = WORLD_04_LEVEL_02_STAGES[3];
    expect(stage.name).toBe("Padel2");

    // 2x larger court (22m wide x 44m long)
    const turf = stage.objects.find(o => o.id === "w4s23-court-floor");
    expect(turf).toBeDefined();
    expect(turf?.scale.x).toBeGreaterThanOrEqual(20.0);
    expect(turf?.scale.z).toBeGreaterThanOrEqual(40.0);

    // 2x larger padel racket catapult (width ~7.6m vs ~3.8m)
    const racket = stage.objects.find(o => o.id === "w4s23-giant-padel-racket");
    expect(racket).toBeDefined();
    expect(racket?.properties?.variant).toBe("padel_racket");
    expect(racket?.scale.x).toBeGreaterThanOrEqual(7.0);
    expect(racket?.scale.z).toBeGreaterThanOrEqual(8.0);
  });

  it("should verify M4-N2-E4 ('La Mina') 44x44m alley labyrinth and cinematic overview camera", () => {
    const stage = WORLD_04_LEVEL_02_STAGES[4];
    expect(stage.name).toBe("La Mina");

    // Dark alley labyrinth base
    const floor = stage.objects.find(o => o.id === "w4s24-maze-floor");
    expect(floor).toBeDefined();
    expect(floor?.scale.x).toBeGreaterThanOrEqual(40.0);
    expect(floor?.scale.z).toBeGreaterThanOrEqual(40.0);

    // Maze walls
    const walls = stage.objects.filter(o => o.id.startsWith("w4s24-maze-w"));
    expect(walls.length).toBeGreaterThanOrEqual(13);

    // Cinematic overview camera
    expect(stage.properties?.cameraMode).toBe("cinematic_mina");
  });

  it("should verify M4-N2-E5 ('Objetos14') twenty collectibles in distinct layout", () => {
    const stage = WORLD_04_LEVEL_02_STAGES[5];
    expect(stage.name).toBe("Objetos14");

    const collectibles = stage.objects.filter(o => o.type === "collectible");
    expect(collectibles.length).toBe(20);

    // Distinct positions and heights
    const uniquePositions = new Set(collectibles.map(c => `${c.position.x},${c.position.y},${c.position.z}`));
    expect(uniquePositions.size).toBe(20);
  });

  it("should verify M4-N2-E6 ('Galway') blackboard platform and giant green clapping gloves", () => {
    const stage = WORLD_04_LEVEL_02_STAGES[6];
    expect(stage.name).toBe("Galway");

    // Blackboard platform
    const board = stage.objects.find(o => o.id === "w4s26-chalkboard-floor");
    expect(board).toBeDefined();
    expect(board?.properties?.variant).toBe("chalkboard_platform");

    // 2 Giant clapping gloves (left and right)
    const gloveL = stage.objects.find(o => o.id === "w4s26-glove-left");
    const gloveR = stage.objects.find(o => o.id === "w4s26-glove-right");
    expect(gloveL).toBeDefined();
    expect(gloveR).toBeDefined();
    expect(gloveL?.properties?.variant).toBe("clapping_gloves");
    expect(gloveR?.properties?.variant).toBe("clapping_gloves");
    expect(gloveL?.properties?.side).toBe("left");
    expect(gloveR?.properties?.side).toBe("right");

    // English classroom chalkboard mesh generation
    const chalkRes = LevelBuilder.createChalkboardMesh(11.0, 0.8, 42.0, "medium");
    expect(chalkRes).toBeDefined();
    expect(chalkRes.group.name).toBe("chalkboard_platform_group");
    expect(chalkRes.boardMesh).toBeDefined();
    expect(chalkRes.meshes.length).toBeGreaterThanOrEqual(4);
  });

  it("should verify M4-N2-E7 ('13 2B') 2-stop elevator, door, and Real Madrid + tiger dress duo", () => {
    const stage = WORLD_04_LEVEL_02_STAGES[7];
    expect(stage.name).toBe("13 2B");

    // 2-stop elevator
    const elevator = stage.objects.find(o => o.id === "w4s27-elevator-car");
    expect(elevator).toBeDefined();
    expect(elevator?.properties?.variant).toBe("residential_elevator_2f");
    expect(elevator?.properties?.movementType).toBe("residential_elevator_2f");

    // Doorway
    const door = stage.objects.find(o => o.id === "w4s27-door-portal");
    expect(door).toBeDefined();
    expect(door?.properties?.variant).toBe("slamming_door");

    // Madrid duo
    const duo = stage.objects.find(o => o.id === "w4s27-madrid-duo");
    expect(duo).toBeDefined();
    expect(duo?.properties?.variant).toBe("madrid_duo_132b");
    expect(duo?.properties?.movementType).toBe("litos_duo");
  });

  it("should verify M4-N2-E8 ('Rony') Yorkshire terrier statue with >= 30m continuous tongue and mouth launch", () => {
    const stage = WORLD_04_LEVEL_02_STAGES[8];
    expect(stage.name).toBe("Rony");

    // Continuous serpentine tongue >= 30m (single unbroken surface)
    const tongue = stage.objects.find(o => o.id === "w4s28-continuous-tongue" || o.properties?.variant === "continuous_tongue");
    expect(tongue).toBeDefined();
    expect(tongue?.properties?.variant).toBe("continuous_tongue");

    const pts = tongue?.properties?.pathPoints as Array<{ x: number; y: number; z: number }>;
    expect(Array.isArray(pts)).toBe(true);
    expect(pts.length).toBeGreaterThanOrEqual(5);

    // Compute path length
    let totalLength = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      totalLength += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y, pts[i + 1].z - pts[i].z);
    }
    expect(totalLength).toBeGreaterThanOrEqual(30.0);

    // Yorkshire head statue with realistic Yorkie features and hollow mouth
    const statue = stage.objects.find(o => o.id === "w4s28-yorkshire-rony-portal");
    expect(statue).toBeDefined();
    expect(statue?.properties?.variant).toBe("yorkshire_rony_statue");

    const ronyRes = LevelBuilder.createYorkshireRonyMesh("medium");
    expect(ronyRes.group.name).toBe("yorkshire_rony_statue_group");
    expect(ronyRes.mouthPortal).toBeDefined();
    expect(ronyRes.meshes.length).toBeGreaterThanOrEqual(15);
    // Verified 3D stylized Yorkie structure (without 2D spherical texture distortion)
    expect(ronyRes.meshes.some(m => (m.material as any)?.color?.getHexString() === "edb868")).toBe(true); // honey-tan fur
    expect(ronyRes.meshes.some(m => (m.material as any)?.color?.getHexString() === "334155")).toBe(true); // steel-blue cap
    expect(ronyRes.meshes.some(m => (m.material as any)?.color?.getHexString() === "e11d48")).toBe(true); // red topknot bow
    expect(ronyRes.meshes.some(m => (m.material as any)?.color?.getHexString() === "78350f")).toBe(true); // chestnut ears
    expect(ronyRes.meshes.some(m => (m.material as any)?.color?.getHexString() === "0f172a")).toBe(true); // black button nose

    // Continuous tongue mesh generation
    const tongueRes = LevelBuilder.createContinuousTongueMesh(pts, 4.2, "medium");
    expect(tongueRes.group.name).toBe("continuous_tongue_group");
    expect(tongueRes.platformMesh).toBeDefined();
    expect(tongueRes.ribbonGeometry).toBeDefined();

    // Launch ramp inside mouth with elevated jump trajectory
    const launchRamp = stage.objects.find(o => o.id === "w4s28-mouth-launch-ramp");
    expect(launchRamp).toBeDefined();
    expect(launchRamp?.type).toBe("ramp");
    expect(launchRamp?.properties?.variant).toBe("mouth_booster");
  });

  it("should verify M4-N2-E9 ('Pao') Floo fireplace with 5s still trigger, green flame and high rooftop alley", () => {
    const stage = WORLD_04_LEVEL_02_STAGES[9];
    expect(stage.name).toBe("Pao");

    // Floo fireplace
    const fireplace = stage.objects.find(o => o.id === "w4s29-floo-fireplace");
    expect(fireplace).toBeDefined();
    expect(fireplace?.properties?.variant).toBe("floo_fireplace");
    expect(fireplace?.properties?.teleportTarget).toEqual({ x: 0.0, y: 28.5, z: -20.0 });

    const fireRes = LevelBuilder.createFlooFireplaceMesh("medium");
    expect(fireRes.group.name).toBe("floo_fireplace_group");
    expect(fireRes.flooFlameGroup).toBeDefined();
    expect(fireRes.flooFlameGroup.name).toBe("floo_green_flame_group");

    // High alley landing platform at Y = 28.0
    const highAlley = stage.objects.find(o => o.id === "w4s29-high-alley-landing");
    expect(highAlley).toBeDefined();
    expect(highAlley?.position.y).toBe(28.0);
  });

  it("should verify M4-N2-E10 ('Ninanos') 6 hooded men and 3 dogs with eliminatesPlayer = true", () => {
    const stage = WORLD_04_LEVEL_02_STAGES[10];
    expect(stage.name).toBe("Ninanos");

    // 6 Hooded men
    const men = stage.objects.filter(o => o.properties?.variant === "carabanchel_hooded_man");
    expect(men.length).toBe(6);
    men.forEach(man => {
      expect(man.properties?.movementType).toBe("street_patrol_man");
      expect(man.properties?.eliminatesPlayer).toBe(true);
    });

    // 3 Dogs
    const dogs = stage.objects.filter(o => o.properties?.variant === "carabanchel_dog");
    expect(dogs.length).toBe(3);
    dogs.forEach(dog => {
      expect(dog.properties?.movementType).toBe("village_dogs");
      expect(dog.properties?.eliminatesPlayer).toBe(true);
    });
  });

  it("should build 3D meshes without errors for all 10 stages of World 4 Level 2", () => {
    const builder = new LevelBuilder();
    const mockPhysics: any = {
      createBoxCollider: () => ({ body: {} }),
      createCylinderCollider: () => ({ body: {} }),
      createKinematicBox: () => ({ body: { setNextKinematicTranslation: () => {}, setNextKinematicRotation: () => {} } }),
      createKinematicCylinder: () => ({ body: { setNextKinematicTranslation: () => {} } }),
      addBoxColliderToBody: () => {},
      addCylinderColliderToBody: () => {},
      createTrimeshCollider: () => {}
    };

    for (let s = 1; s <= 10; s++) {
      const stage = WORLD_04_LEVEL_02_STAGES[s];
      expect(() => {
        const built = builder.build(stage, mockPhysics, "churros", "medium");
        expect(built).toBeDefined();
        expect(built.group).toBeDefined();
        expect(built.spawnPoint).toBeDefined();
        expect(built.collidableMeshes.length).toBeGreaterThan(0);
      }).not.toThrow();
    }
  });

  it("should preserve custom stages for World 4 Level 2 in LevelLoader", async () => {
    const loader = new LevelLoader();
    const mockCustomStage: any = {
      id: "w4s21-custom-preserved",
      name: "Custom Bus34 Test",
      world: 4,
      level: 2,
      stage: 1,
      timeLimit: 60,
      customSaved: true,
      properties: { userSaved: true },
      spawn: { x: 0, y: 3.5, z: 32 },
      objects: [
        { id: "w4s21-custom-road", type: "platform", position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6, y: 0.8, z: 80 } },
        { id: "w4s21-custom-goal", type: "goal", position: { x: 0, y: 1, z: -40 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2, y: 2, z: 2 } }
      ]
    };

    localStorage.setItem("custom_stage_4_2_1", JSON.stringify(mockCustomStage));
    const loaded = await loader.loadStage(4, 2, 1);
    expect(loaded).toBeDefined();
    expect(loaded.name).toBe("Custom Bus34 Test");
  });

  it("should preserve custom position, rotation, and apply directional launch for padel_racket", () => {
    const builder = new LevelBuilder();
    let currentTranslation = { x: 0, y: 0, z: 0 };
    let currentRotation = { x: 0, y: 0, z: 0, w: 1 };

    const mockPhysics: any = {
      createBoxCollider: () => ({ body: {} }),
      createCylinderCollider: () => ({ body: {} }),
      createKinematicBox: (pos: any, rot: any) => {
        currentTranslation = { ...pos };
        currentRotation = { ...rot };
        return {
          body: {
            setNextKinematicTranslation: (t: any) => { currentTranslation = { ...t }; },
            setNextKinematicRotation: (r: any) => { currentRotation = { ...r }; }
          }
        };
      },
      createKinematicCylinder: () => ({ body: {} }),
      addBoxColliderToBody: () => {},
      addCylinderColliderToBody: () => {},
      createTrimeshCollider: () => {}
    };

    // Custom stage with padel_racket placed further back (z: 16.0) and rotated 90 degrees (y: PI/2)
    const customStage: any = {
      id: "w4s23-test-padel-custom",
      name: "Custom Padel2",
      world: 4,
      level: 2,
      stage: 3,
      timeLimit: 60,
      spawn: { x: 0, y: 2, z: 20 },
      objects: [
        {
          id: "custom-racket",
          type: "moving-platform",
          position: { x: 5.0, y: 0.5, z: 16.0 },
          rotation: { x: 0, y: Math.PI / 2, z: 0 },
          scale: { x: 7.6, y: 0.35, z: 8.4 },
          properties: {
            variant: "padel_racket",
            movementType: "padel_racket",
            isMoving: true
          }
        },
        {
          id: "custom-goal",
          type: "goal",
          position: { x: -20.0, y: 1.0, z: 16.0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 }
        }
      ]
    };

    const built = builder.build(customStage, mockPhysics, "churros", "medium");
    expect(built).toBeDefined();

    // In ground rest phase (t = 0.5s), position and rotation must stay exactly where set in editor
    built.update(0.5, false);
    expect(currentTranslation.x).toBeCloseTo(5.0, 2);
    expect(currentTranslation.y).toBeCloseTo(0.5, 2);
    expect(currentTranslation.z).toBeCloseTo(16.0, 2);
    // Rotation around Y by PI/2 means quat.y ≈ sin(PI/4) ≈ 0.7071 and quat.w ≈ 0.7071
    expect(Math.abs(currentRotation.y)).toBeCloseTo(Math.sin(Math.PI / 4), 2);
    expect(Math.abs(currentRotation.w)).toBeCloseTo(Math.cos(Math.PI / 4), 2);

    // Test catapult launch with player standing on rotated racket blade
    // Racket is at (5, 0.5, 16) rotated 90 deg clockwise (facing -X in world coords)
    // Blade extends in local -Z, which in world coords is -X direction from 5 to (5 - 8.4 = -3.4)
    // Place mock player at x = 1.0, y = 0.8, z = 16.0 (right on the blade)
    let appliedVelocity: any = null;
    const mockPlayer = {
      setLinearVelocity: (v: any) => { appliedVelocity = v; },
      getVelocity: () => ({ x: 0, y: 0, z: 0 })
    };

    const playerPos = { x: 1.0, y: 0.8, z: 16.0 } as any;
    // Advance to scoop apex (t = 2.9s in cycle)
    built.update(2.4, false, playerPos, mockPlayer);

    expect(appliedVelocity).toBeDefined();
    // Velocity must launch upwards (y >= 14) and towards -X (where the rotated racket is facing towards goal)
    expect(appliedVelocity.y).toBeGreaterThanOrEqual(14.0);
    expect(appliedVelocity.x).toBeLessThan(-10.0);
  });

  it("should verify M4-N2-E4 ('La Mina') maze walls in LevelEditor use 6-face multi-material preserving red brick side textures", () => {
    const root = document.createElement("div");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    const editor = new LevelEditor(
      root,
      scene,
      camera,
      { onPlaytest: () => {}, onExit: () => {} },
      4,
      2,
      4
    );

    expect(editor).toBeDefined();
    expect(editor.getCurrentWorld()).toBe(4);
    expect(editor.getCurrentLevel()).toBe(2);

    // Find the back wall mesh in editorGroup (w4s24-wall-back)
    const stage = WORLD_04_LEVEL_02_STAGES[4];
    const wallObjIdx = stage.objects.findIndex(o => o.id === "w4s24-wall-back");
    expect(wallObjIdx).toBeGreaterThanOrEqual(0);

    let wallMesh: THREE.Mesh | null = null;
    (editor as any).editorGroup.traverse((child: any) => {
      if (child instanceof THREE.Mesh && child.userData?.objectIndex === wallObjIdx) {
        wallMesh = child;
      }
    });

    expect(wallMesh).toBeDefined();
    // Material must be an array of 6 materials (Three.js BoxGeometry face groups) so vertical sides display red brick
    expect(Array.isArray(wallMesh!.material)).toBe(true);
    const mats = wallMesh!.material as THREE.Material[];
    expect(mats.length).toBe(6);
    // Index 0 & 1 (+X, -X) and index 4 & 5 (+Z, -Z) are the side faces (red brick)
    expect(mats[0]).toBeDefined();
    expect(mats[4]).toBeDefined();

    editor.destroy();
  });
});
