import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { stabilizeNeonSurfaces } from "../src/levels/world-07/NeonSurfaces";
import { LevelBuilder } from "../src/levels/LevelBuilder";
import { WORLD_07_LEVEL_03_STAGES as osaka } from "../src/levels/world-07/level-03-stages";
import { WORLD_07_LEVEL_04_STAGES as tokyo } from "../src/levels/world-07/level-04-stages";
import { disposeStageResources } from "../src/rendering/StageResources";
import { createOsakaModel } from "../src/levels/world-07/OsakaModels";
import { naraPath, nv } from "../src/levels/world-07/NaraRoutes";
import type { LevelObjectData } from "../src/levels/LevelTypes";
describe("Neon surfaces and context-sensitive rotors", () => {
  it("preserves grouped platform materials when trimming their actual intersection", () => {
    const root = new THREE.Group();
    for (let i = 0; i < 2; i++) {
      const materials = Array.from(
          { length: 6 },
          () => new THREE.MeshStandardMaterial({ side: THREE.DoubleSide }),
        ),
        mesh = new THREE.Mesh(new THREE.BoxGeometry(12, 0.5, 4), materials);
      mesh.rotation.y = (i * Math.PI) / 2;
      mesh.userData.neonPath = true;
      mesh.userData.neonSurface = String(i);
      root.add(mesh);
    }
    root.rotation.set(0.08, 0.32, 0.12);
    stabilizeNeonSurfaces(root);
    const point = root.localToWorld(new THREE.Vector3(0.17, 1, 0.31)),
      direction = new THREE.Vector3(0, -1, 0).transformDirection(
        root.matrixWorld,
      ),
      hits = new THREE.Raycaster(point, direction)
        .intersectObject(root, true)
        .filter(
          (hit) =>
            Math.abs(root.worldToLocal(hit.point.clone()).y - 0.25) < 1e-4,
        );
    expect(hits).toHaveLength(1);
    for (const child of root.children) {
      const mesh = child as THREE.Mesh;
      expect(mesh.geometry.groups.length).toBeGreaterThan(0);
      expect(
        mesh.geometry.groups.every((group) => (group.materialIndex ?? 0) < 6),
      ).toBe(true);
      for (const value of mesh.geometry.getAttribute("position").array)
        expect(Number.isFinite(value)).toBe(true);
    }
    disposeStageResources(root);
  });
  it("removes actual coplanar overlap and internal edge stripes at road junctions", () => {
    const root = new THREE.Group();
    for (const [id, points] of [
      ["horizontal", [nv(-6, 0, 0), nv(6, 0, 0)]],
      ["vertical", [nv(0, 0, -6), nv(0, 0, 6)]],
    ] as const) {
      const object: LevelObjectData = {
        id,
        type: "decoration",
        position: nv(0, 0, 0),
        rotation: nv(0, 0, 0),
        scale: nv(1, 1, 1),
        properties: {
          subType: "osaka_path",
          ...naraPath([...points], 4, false),
        },
      };
      root.add(createOsakaModel(object)!.group);
    }
    root.updateMatrixWorld(true);
    const ray = new THREE.Raycaster(
        new THREE.Vector3(0.17, 1, 0.31),
        new THREE.Vector3(0, -1, 0),
      ),
      topHits = () =>
        ray
          .intersectObject(root, true)
          .filter((hit) => Math.abs(hit.point.y) < 1e-4);
    expect(topHits()).toHaveLength(2);
    stabilizeNeonSurfaces(root);
    expect(topHits()).toHaveLength(1);
    let area = 0;
    root.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;
      const p = node.geometry.getAttribute("position");
      for (let i = 0; i < p.count; i += 3) {
        const a = new THREE.Vector3().fromBufferAttribute(p, i),
          b = new THREE.Vector3().fromBufferAttribute(p, i + 1),
          c = new THREE.Vector3().fromBufferAttribute(p, i + 2);
        if ([a, b, c].every((v) => Math.abs(v.y) < 1e-5))
          area += b.sub(a).cross(c.sub(a)).length() / 2;
      }
    });
    expect(area).toBeCloseTo(80, 3);
    const geometries: THREE.BufferGeometry[] = [];
    root.traverse((o) => {
      if (o instanceof THREE.Mesh) geometries.push(o.geometry);
    });
    stabilizeNeonSurfaces(root);
    let index = 0;
    root.traverse((o) => {
      if (o instanceof THREE.Mesh) expect(o.geometry).toBe(geometries[index++]);
    });
    disposeStageResources(root);
  });
  it("uses front-only facade panels with a real separation from the building wall", () => {
    const object: LevelObjectData = {
      id: "tower",
      type: "decoration",
      position: nv(0, 0, 0),
      rotation: nv(0, 0, 0),
      scale: nv(1, 1, 1),
      properties: { subType: "osaka_building" },
    };
    const model = createOsakaModel(object)!;
    const glow = model.group.getObjectByName("london-glow") as THREE.Mesh,
      positions = glow.geometry.getAttribute("position");
    for (let i = 0; i < positions.count; i++)
      expect(positions.getZ(i)).toBeGreaterThan(3.54);
    model.group.traverse((o) => {
      if (o instanceof THREE.Mesh)
        for (const m of Array.isArray(o.material) ? o.material : [o.material])
          expect(m.side).toBe(THREE.FrontSide);
    });
    disposeStageResources(model.group);
  });
  it("separates overlapping shared materials with bounded depth layers without changing geometry", () => {
    const root = new THREE.Group(),
      material = new THREE.MeshStandardMaterial(),
      geometry = new THREE.BoxGeometry(12, 0.5, 2);
    for (let i = 0; i < 3; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData.neonSurface = String(i);
      mesh.rotation.y = ((i % 2) * Math.PI) / 2;
      if (i === 2) mesh.position.x = 30;
      root.add(mesh);
    }
    const before = root.children.map((o) => o.matrixWorld.clone()),
      positions = geometry.getAttribute("position").array.slice();
    stabilizeNeonSurfaces(root);
    expect(root.children[0].userData.neonDepthLayer).not.toBe(
      root.children[1].userData.neonDepthLayer,
    );
    expect(
      Math.max(...root.children.map((o) => o.userData.neonDepthLayer)),
    ).toBe(2);
    expect(geometry.getAttribute("position").array).toEqual(positions);
    root.children.forEach((o, i) =>
      expect(o.position.y).toBe(before[i].elements[13]),
    );
    const materials = root.children.map((o) => (o as THREE.Mesh).material);
    stabilizeNeonSurfaces(root);
    root.children.forEach((o, i) =>
      expect((o as THREE.Mesh).material).toBe(materials[i]),
    );
    disposeStageResources(root);
  });
  it("uses neon throughout Osaka and Tokyo, including editor additions, and forces wood elsewhere", () => {
    for (const stages of [osaka, tokyo])
      for (const stage of Object.values(stages))
        for (const object of stage.objects.filter(
          (o) => o.properties?.subType === "nara_rotor",
        ))
          expect(object.properties?.neonRotor).toBe(true);
    const object = structuredClone(
      tokyo[10].objects.find((o) => o.properties?.subType === "nara_rotor")!,
    );
    for (const [world, level, neon] of [
      [7, 3, true],
      [7, 4, true],
      [7, 2, false],
      [6, 4, false],
    ] as const) {
      const model = LevelBuilder.createDecorationMesh(object, "medium", {
        world,
        level,
      });
      let glowing = 0;
      model.group.traverse((o) => {
        if (
          o instanceof THREE.Mesh &&
          o.material instanceof THREE.MeshBasicMaterial
        )
          glowing++;
      });
      expect(glowing > 0).toBe(neon);
      expect(model.group.getObjectByName("nara-sweep-arm")).toBeDefined();
      disposeStageResources(model.group);
    }
  });
});
