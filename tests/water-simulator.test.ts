import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { WaterWaveSimulator } from "../src/rendering/WaterSimulator";
import { LevelBuilder } from "../src/levels/LevelBuilder";
import type { LevelData } from "../src/levels/LevelTypes";

describe("WaterWaveSimulator", () => {
  it("initializes with valid dimensions and grid points", () => {
    const sim = new WaterWaveSimulator(4, 4, 32);
    expect(sim.width).toBe(4);
    expect(sim.depth).toBe(4);
    expect(sim.gridX).toBeGreaterThanOrEqual(14);
    expect(sim.gridZ).toBeGreaterThanOrEqual(14);
  });

  it("propagates disturbance over time without exploding", () => {
    const sim = new WaterWaveSimulator(6, 6, 24);
    sim.disturb(0, 0, 0.5, 0.8);

    // Step several seconds of physics simulation
    for (let i = 0; i < 60; i++) {
      sim.step(1 / 60);
    }

    // Must not produce NaN or Infinity
    const plane = sim.createSurfaceGeometry();
    sim.applyToGeometry(plane, 1.0);

    const pos = plane.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      expect(Number.isFinite(pos.getY(i))).toBe(true);
      expect(Math.abs(pos.getY(i))).toBeLessThanOrEqual(0.15);
    }
  });

  it("remains stable under continuous moving wake disturbances without runaway spikes", () => {
    const sim = new WaterWaveSimulator(8, 8, 28);
    const plane = sim.createSurfaceGeometry();

    // Simulate player rolling across water for 120 frames with continuous wake disturbance
    for (let frame = 0; frame < 120; frame++) {
      const posX = -3.0 + (frame / 120) * 6.0;
      const posZ = Math.sin(frame * 0.1) * 2.0;

      // Moving wake disturbance
      sim.disturb(posX, posZ, -0.03, 0.5);
      sim.step(1 / 60);
    }

    sim.applyToGeometry(plane, 2.0);
    const pos = plane.getAttribute("position") as THREE.BufferAttribute;

    let maxDisplacement = 0;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      expect(Number.isFinite(y)).toBe(true);
      maxDisplacement = Math.max(maxDisplacement, Math.abs(y));
    }

    // Must remain bounded within realistic liquid range (never spike up into giant mountains)
    expect(maxDisplacement).toBeLessThanOrEqual(0.15);
  });

  it("generates normalized analytical normals for specular lighting", () => {
    const sim = new WaterWaveSimulator(4, 4, 20);
    sim.disturb(0, 0, 0.4, 0.6);
    sim.step(0.05);

    const plane = sim.createSurfaceGeometry();
    sim.applyToGeometry(plane, 0.5);

    const norm = plane.getAttribute("normal") as THREE.BufferAttribute;
    for (let i = 0; i < norm.count; i++) {
      const nx = norm.getX(i);
      const ny = norm.getY(i);
      const nz = norm.getZ(i);
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      expect(len).toBeCloseTo(1.0, 3);
    }
  });

  it("creates fused surface geometry spanning clustered water boxes", () => {
    const sim = new WaterWaveSimulator(10, 6, 32);
    const boxes = [
      { minX: -5, maxX: 0, minZ: -3, maxZ: 3 },
      { minX: -1, maxX: 5, minZ: -3, maxZ: 3 }
    ];

    const fusedGeo = sim.createFusedSurfaceGeometry(boxes, 0, 0);
    expect(fusedGeo).toBeDefined();

    const pos = fusedGeo.getAttribute("position");
    const uvs = fusedGeo.getAttribute("uv");
    const index = fusedGeo.getIndex();

    expect(pos.count).toBe(sim.gridX * sim.gridZ);
    expect(uvs.count).toBe(sim.gridX * sim.gridZ);
    expect(index).toBeDefined();
    expect(index!.count).toBeGreaterThan(0);

    // Apply simulation to fused geometry
    sim.disturb(0, 0, 0.08, 0.6);
    sim.step(0.05);
    sim.applyToGeometry(fusedGeo, 1.0);

    const posArr = pos.array as Float32Array;
    for (let i = 0; i < posArr.length; i++) {
      expect(Number.isFinite(posArr[i])).toBe(true);
    }
  });
});

describe("LevelBuilder water clustering and fusion", () => {
  it("seamlessly fuses intersecting water blocks into a single unified water cluster", () => {
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

    const builder = new LevelBuilder();
    const mockPhysics: any = {
      createBoxCollider: () => {},
      createCylinderCollider: () => {},
      createKinematicBox: () => null,
      clearStageColliders: () => {}
    };

    const levelData: LevelData = {
      id: "test_water_fusion",
      name: "Water Fusion Test",
      world: 1,
      level: 1,
      stage: 1,
      timeLimit: 60,
      spawn: { x: 0, y: 2, z: 0 },
      objects: [
        // Two intersecting water blocks at the same elevation
        {
          id: "water_1",
          type: "water",
          position: { x: 0, y: 0, z: 0 },
          scale: { x: 4, y: 1, z: 4 },
          rotation: { x: 0, y: 0, z: 0 }
        },
        {
          id: "water_2",
          type: "water",
          position: { x: 3, y: 0, z: 0 }, // overlaps by 1 unit with water_1
          scale: { x: 4, y: 1, z: 4 },
          rotation: { x: 0, y: 0, z: 0 }
        }
      ]
    };

    const built = builder.build(levelData, mockPhysics, "baguette");

    expect(built.waterBlocks.length).toBe(2);

    const wb1 = built.waterBlocks[0];
    const wb2 = built.waterBlocks[1];

    // Both intersecting water blocks MUST share the exact same unified simulator and cluster centers!
    expect(wb1.simulator).toBe(wb2.simulator);
    expect(wb1.surfaceMesh).toBeDefined();
    expect(wb2.surfaceMesh).toBeDefined();

    // Each block has its own precision surface mesh so it NEVER overhangs beyond block boundaries
    expect(wb1.surfaceMesh.position.x).toBeCloseTo(0, 1);
    expect(wb2.surfaceMesh.position.x).toBeCloseTo(3, 1);

    // Cluster centers match the combined bounding box
    expect(wb1.clusterCenterX).toBeCloseTo(1.5, 1);
    expect(wb1.clusterCenterZ).toBeCloseTo(0, 1);

    // Deep meshes must have depthWrite: false so internal boundary walls are never rendered
    const deepMat1 = wb1.mesh.material as THREE.MeshStandardMaterial;
    const deepMat2 = wb2.mesh.material as THREE.MeshStandardMaterial;
    expect(deepMat1.depthWrite).toBe(false);
    expect(deepMat2.depthWrite).toBe(false);

    // Test update loop runs cleanly without errors
    built.update(1 / 60);

    built.destroy();
  });

  it("respects passable vs solid water configuration for Rapier colliders", () => {
    const builder = new LevelBuilder();
    let colliderCount = 0;
    const mockPhysics: any = {
      createBoxCollider: () => {
        colliderCount++;
      },
      createCylinderCollider: () => {},
      createKinematicBox: () => null,
      clearStageColliders: () => {}
    };

    const levelData: LevelData = {
      id: "test_water_passable",
      name: "Water Passable Test",
      world: 2,
      level: 2,
      stage: 6,
      timeLimit: 60,
      spawn: { x: 0, y: 2, z: 0 },
      objects: [
        // Water 1: Passable (default or explicit passable: true) -> NO box collider created!
        {
          id: "sea_passable",
          type: "water",
          position: { x: 0, y: -2, z: 0 },
          scale: { x: 10, y: 1, z: 10 },
          rotation: { x: 0, y: 0, z: 0 },
          properties: { passable: true, hasCollision: false }
        },
        // Water 2: Solid (passable: false or hasCollision: true) -> Solid box collider IS created!
        {
          id: "pool_solid",
          type: "water",
          position: { x: 30, y: 0, z: 0 },
          scale: { x: 8, y: 1, z: 8 },
          rotation: { x: 0, y: 0, z: 0 },
          properties: { passable: false, hasCollision: true }
        }
      ]
    };

    const built = builder.build(levelData, mockPhysics, "baguette");
    expect(built.waterBlocks.length).toBe(2);

    const passableWater = built.waterBlocks.find(wb => wb.id === "sea_passable");
    const solidWater = built.waterBlocks.find(wb => wb.id === "pool_solid");

    expect(passableWater?.passable).toBe(true);
    expect(solidWater?.passable).toBe(false);

    // Exactly 1 collider created (for the solid water), and 0 for the passable water!
    expect(colliderCount).toBe(1);

    built.destroy();
  });
});
