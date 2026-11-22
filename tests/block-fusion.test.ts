import { describe, it, expect, vi } from "vitest";
import * as THREE from "three";
import { LevelBuilder } from "../src/levels/LevelBuilder";
import { SpriteTextures } from "../src/rendering/SpriteTextures";

describe("Block Fusion & Continuous World UV Mapping", () => {
  it("aligns UV coordinates perfectly across the boundary between two adjacent blocks", () => {
    // Block 1 placed at (0, 0.5, 0) with size (2, 1, 2). Bounds: x in [-1, 1], z in [-1, 1].
    const geo1 = new THREE.BoxGeometry(2, 1, 2);
    LevelBuilder.applyContinuousWorldUVs(
      geo1,
      { x: 0, y: 0.5, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 2, y: 1, z: 2 },
      4.0 // tileSize
    );

    // Block 2 placed adjacent at (2, 0.5, 0) with size (2, 1, 2). Bounds: x in [1, 3], z in [-1, 1].
    // They meet at the seam x = 1.0!
    const geo2 = new THREE.BoxGeometry(2, 1, 2);
    LevelBuilder.applyContinuousWorldUVs(
      geo2,
      { x: 2, y: 0.5, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 2, y: 1, z: 2 },
      4.0
    );

    const pos1 = geo1.getAttribute("position") as THREE.BufferAttribute;
    const norm1 = geo1.getAttribute("normal") as THREE.BufferAttribute;
    const uv1 = geo1.getAttribute("uv") as THREE.BufferAttribute;

    const pos2 = geo2.getAttribute("position") as THREE.BufferAttribute;
    const norm2 = geo2.getAttribute("normal") as THREE.BufferAttribute;
    const uv2 = geo2.getAttribute("uv") as THREE.BufferAttribute;

    // Find top-face vertices at seam x = 1.0 on Block 1 (local x = 1)
    const seamUVsBlock1: Array<{ u: number; v: number }> = [];
    for (let i = 0; i < pos1.count; i++) {
      if (norm1.getY(i) > 0.5 && Math.abs(pos1.getX(i) - 1.0) < 0.001) {
        seamUVsBlock1.push({ u: uv1.getX(i), v: uv1.getY(i) });
      }
    }

    // Find top-face vertices at seam x = 1.0 on Block 2 (local x = -1, world x = 2 - 1 = 1)
    const seamUVsBlock2: Array<{ u: number; v: number }> = [];
    for (let i = 0; i < pos2.count; i++) {
      if (norm2.getY(i) > 0.5 && Math.abs(pos2.getX(i) - (-1.0)) < 0.001) {
        seamUVsBlock2.push({ u: uv2.getX(i), v: uv2.getY(i) });
      }
    }

    expect(seamUVsBlock1.length).toBeGreaterThanOrEqual(2);
    expect(seamUVsBlock2.length).toBeGreaterThanOrEqual(2);

    // Sort by V to compare matching points along the seam
    seamUVsBlock1.sort((a, b) => a.v - b.v);
    seamUVsBlock2.sort((a, b) => a.v - b.v);

    for (let i = 0; i < seamUVsBlock1.length; i++) {
      // The U and V coordinates must be identical down to floating point precision
      expect(seamUVsBlock1[i].u).toBeCloseTo(seamUVsBlock2[i].u, 5);
      expect(seamUVsBlock1[i].v).toBeCloseTo(seamUVsBlock2[i].v, 5);
    }
  });

  it("ensures a 4x4 platform has continuous world UVs across its full expanse", () => {
    const geo4x4 = new THREE.BoxGeometry(4, 1, 4);
    LevelBuilder.applyContinuousWorldUVs(
      geo4x4,
      { x: 0, y: 0.5, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 4, y: 1, z: 4 },
      4.0
    );

    const uv = geo4x4.getAttribute("uv") as THREE.BufferAttribute;
    const norm = geo4x4.getAttribute("normal") as THREE.BufferAttribute;

    let minU = Infinity, maxU = -Infinity;
    let minV = Infinity, maxV = -Infinity;

    for (let i = 0; i < uv.count; i++) {
      if (norm.getY(i) > 0.5) {
        minU = Math.min(minU, uv.getX(i));
        maxU = Math.max(maxU, uv.getX(i));
        minV = Math.min(minV, uv.getY(i));
        maxV = Math.max(maxV, uv.getY(i));
      }
    }

    // On a 4x4 platform with tileSize 4.0, UVs span exactly from -0.5 to 0.5 (span = 1.0)
    expect(maxU - minU).toBeCloseTo(1.0, 5);
    expect(maxV - minV).toBeCloseTo(1.0, 5);
  });
});

describe("Decoration Collisions (tree, fence, lantern)", () => {
  it("automatically creates solid colliders for tree, fence, and lantern", () => {
    vi.spyOn(SpriteTextures, "getWorldBlockSet").mockReturnValue({
      top: new THREE.CanvasTexture({ width: 1, height: 1 } as any),
      bottom: new THREE.CanvasTexture({ width: 1, height: 1 } as any),
      sideX: new THREE.CanvasTexture({ width: 1, height: 1 } as any),
      sideZ: new THREE.CanvasTexture({ width: 1, height: 1 } as any),
      emissiveColor: new THREE.Color(0),
      movingEmissiveColor: new THREE.Color(0)
    });

    const builder = new LevelBuilder();
    const createdColliders: Array<{ position: any; halfExtents: any }> = [];
    const mockPhysics = {
      createBoxCollider: (pos: any, _rot: any, halfExtents: any) => {
        createdColliders.push({ position: pos, halfExtents });
        return {} as any;
      },
      createCylinderCollider: () => null,
      createDynamicSphere: () => null,
      createKinematicBox: () => null
    } as any;

    const levelData: any = {
      world: 1,
      level: 1,
      stage: 1,
      name: "Deco Collision Test",
      timeLimit: 60,
      spawn: { x: 0, y: 1.5, z: 0 },
      objects: [
        {
          id: "dec-tree",
          type: "decoration",
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          properties: { subType: "tree" }
        },
        {
          id: "dec-fence",
          type: "decoration",
          position: { x: 5, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          properties: { subType: "fence" }
        },
        {
          id: "dec-lantern",
          type: "decoration",
          position: { x: -5, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          properties: { subType: "lantern" }
        },
        {
          id: "dec-flower",
          type: "decoration",
          position: { x: 2, y: 0, z: 2 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          properties: { subType: "flower" }
        },
        {
          id: "dec-tree-noncollidable",
          type: "decoration",
          position: { x: 10, y: 0, z: 10 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          properties: { subType: "tree", hasCollision: false }
        }
      ]
    };

    builder.build(levelData, mockPhysics, "gold");

    // Exactly 3 colliders should have been created (tree, fence, lantern; not flower, not noncollidable tree)
    expect(createdColliders.length).toBe(3);

    // Tree collider check
    const treeCol = createdColliders.find(c => c.position.x === 0);
    expect(treeCol).toBeDefined();
    expect(treeCol!.halfExtents.x).toBeCloseTo(0.35, 2);

    // Fence collider check
    const fenceCol = createdColliders.find(c => c.position.x === 5);
    expect(fenceCol).toBeDefined();
    expect(fenceCol!.halfExtents.x).toBeCloseTo(1.5, 2);

    // Lantern collider check
    const lanternCol = createdColliders.find(c => c.position.x === -5);
    expect(lanternCol).toBeDefined();
    expect(lanternCol!.halfExtents.x).toBeCloseTo(0.25, 2);
  });
});
