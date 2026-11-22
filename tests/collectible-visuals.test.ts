import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import { CollectibleVisual } from "../src/rendering/CollectibleVisual";
import { SceneQuality } from "../src/rendering/SceneQuality";
import { SpriteTextures } from "../src/rendering/SpriteTextures";
import { collectibleKind } from "../src/rendering/CollectibleArt";
beforeEach(() => {
  vi.spyOn(SpriteTextures, "getCollectibleTexture").mockReturnValue(
    new THREE.CanvasTexture({ width: 256, height: 256 } as HTMLCanvasElement),
  );
});
afterEach(() => vi.restoreAllMocks());
const ids = ["pan", "dragon_ball", "lonchas_pavo", "varitas_estrella"];
describe("Collectible quality and character changes", () => {
  it.each(ids)(
    "keeps %s finite and within pickup bounds with one draw per object at each quality",
    (id) => {
      const item = new CollectibleVisual(id, "low");
      expect(item.children[0]).toBeInstanceOf(THREE.Sprite);
      let mediumVertices = 0;
      for (const quality of ["medium", "high"] as const) {
        item.setQuality(quality);
        expect(item.children).toHaveLength(1);
        const mesh = item.children[0] as THREE.Mesh;
        expect(mesh).toBeInstanceOf(THREE.Mesh);
        expect(Array.isArray(mesh.material)).toBe(false);
        expect(mesh.geometry.groups).toHaveLength(0);
        const positions = mesh.geometry.getAttribute("position");
        for (const value of positions.array)
          expect(Number.isFinite(value)).toBe(true);
        expect(mesh.geometry.getAttribute("normal").count).toBe(
          positions.count,
        );
        expect(mesh.geometry.getAttribute("color").count).toBe(positions.count);
        expect(mesh.geometry.boundingSphere!.radius).toBeLessThan(1);
        if (quality === "medium") mediumVertices = positions.count;
        else expect(positions.count).toBeGreaterThan(mediumVertices);
      }
      item.dispose();
    },
  );
  it("preserves the pickup root, transforms and hidden state during quality and character changes", () => {
    const item = new CollectibleVisual("pan");
    item.position.set(4, 8, 12);
    item.visible = false;
    for (const quality of ["low", "medium", "high"] as const)
      for (const id of ids) {
        item.setQuality(quality);
        item.setKind(id);
        item.animate(30);
        expect(item.position.toArray()).toEqual([4, 8, 12]);
        expect(item.visible).toBe(false);
        expect(item.children).toHaveLength(1);
      }
    item.dispose();
  });
  it("updates editor and dynamic objects through SceneQuality and releases replaced models", () => {
    const root = new THREE.Group(),
      quality = new SceneQuality(),
      item = new CollectibleVisual("pan");
    root.add(item);
    quality.prepare(root);
    const old = item.children[0] as THREE.Mesh,
      dispose = vi.spyOn(old.geometry, "dispose");
    quality.setQuality("low");
    expect(dispose).toHaveBeenCalledOnce();
    expect(item.children[0]).toBeInstanceOf(THREE.Sprite);
    quality.setQuality("high");
    expect(item.children[0]).toBeInstanceOf(THREE.Mesh);
    item.setKind("dragon_ball");
    expect(item.name).toBe("collectible:dragon_ball");
    expect(item.children).toHaveLength(1);
    quality.dispose();
    item.dispose();
  });
  it("keeps cached model instances independent and resolves every UI alias to the same design", () => {
    const first = new CollectibleVisual("pan", "high"),
      second = new CollectibleVisual("rony", "high");
    expect((first.children[0] as THREE.Mesh).geometry).not.toBe(
      (second.children[0] as THREE.Mesh).geometry,
    );
    first.dispose();
    expect(
      (second.children[0] as THREE.Mesh).geometry.getAttribute("position")
        .count,
    ).toBeGreaterThan(0);
    second.dispose();
    expect(collectibleKind("adri")).toBe("dragon_ball");
    expect(collectibleKind("misi")).toBe("lonchas_pavo");
    expect(collectibleKind("pao")).toBe("varitas_estrella");
  });
});
