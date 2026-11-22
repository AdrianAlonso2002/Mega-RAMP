import * as THREE from "three";
import { trimNeonJunctions } from "./NeonJunctions";
/** Colour only the overlap graph, so depth bias stays small even in large maps. */
export function stabilizeNeonSurfaces(root: THREE.Object3D): void {
  trimNeonJunctions(root);
  root.updateWorldMatrix(true, true);
  const surfaces: {
    object: THREE.Object3D;
    bounds: THREE.Box3;
    id: string;
    layer: number;
    neighbours: number[];
  }[] = [];
  root.traverse((object) => {
    if (typeof object.userData.neonSurface === "string") {
      const bounds = new THREE.Box3().setFromObject(object);
      bounds.expandByScalar(Number(object.userData.neonSweepRadius ?? 0));
      surfaces.push({
        object,
        bounds,
        id: object.userData.neonSurface,
        layer: 0,
        neighbours: [],
      });
    }
  });
  surfaces.sort((a, b) => a.id.localeCompare(b.id));
  for (let i = 0; i < surfaces.length; i++)
    for (let j = i + 1; j < surfaces.length; j++) {
      const a = surfaces[i].bounds,
        b = surfaces[j].bounds;
      if (
        a.intersectsBox(b) &&
        Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x) > 0.001 &&
        Math.min(a.max.z, b.max.z) - Math.max(a.min.z, b.min.z) > 0.001
      ) {
        surfaces[i].neighbours.push(j);
        surfaces[j].neighbours.push(i);
      }
    }
  const order = surfaces
    .map((_, i) => i)
    .sort(
      (a, b) =>
        surfaces[b].neighbours.length - surfaces[a].neighbours.length || a - b,
    );
  for (const i of order) {
    const used = new Set(surfaces[i].neighbours.map((j) => surfaces[j].layer));
    let layer = 1;
    while (used.has(layer)) layer++;
    surfaces[i].layer = layer;
    surfaces[i].object.userData.neonDepthLayer = layer;
  }
  const variants = new Map<THREE.Material, Map<number, THREE.Material>>();
  for (const surface of surfaces)
    surface.object.traverse((object) => {
      if (!(object instanceof THREE.Mesh) || object.userData.noCollision)
        return;
      const materialFor = (material: THREE.Material) => {
        let layers = variants.get(material);
        if (!layers) {
          layers = new Map();
          variants.set(material, layers);
        }
        let variant = layers.get(surface.layer);
        if (!variant) {
          variant = layers.size ? material.clone() : material;
          variant.polygonOffset = true;
          variant.polygonOffsetFactor = 0;
          variant.polygonOffsetUnits = -2 * surface.layer;
          layers.set(surface.layer, variant);
        }
        return variant;
      };
      object.material = Array.isArray(object.material)
        ? object.material.map(materialFor)
        : materialFor(object.material);
    });
}
