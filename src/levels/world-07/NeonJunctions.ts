import * as THREE from "three";

interface Vertex {
  point: THREE.Vector3;
  attributes: number[][];
}
interface Face {
  vertices: Vertex[];
  normal: THREE.Vector3;
  plane: number;
  bounds: THREE.Box3;
  owner: THREE.Object3D;
  mesh: THREE.Mesh;
  offset: number;
  edge: boolean;
}
const EPS = 1e-5;
const cross = (a: THREE.Vector3, b: THREE.Vector3, p: THREE.Vector3) =>
  (b.x - a.x) * (p.z - a.z) - (b.z - a.z) * (p.x - a.x);
function interpolate(a: Vertex, b: Vertex, t: number): Vertex {
  return {
    point: a.point.clone().lerp(b.point, t),
    attributes: a.attributes.map((values, i) =>
      values.map((v, j) => v + (b.attributes[i][j] - v) * t),
    ),
  };
}
function split(
  polygon: Vertex[],
  a: THREE.Vector3,
  b: THREE.Vector3,
  sign: number,
) {
  const inside: Vertex[] = [],
    outside: Vertex[] = [];
  for (let i = 0; i < polygon.length; i++) {
    const p = polygon[i],
      q = polygon[(i + 1) % polygon.length],
      dp = cross(a, b, p.point) * sign,
      dq = cross(a, b, q.point) * sign;
    if (dp >= -EPS) inside.push(p);
    if (dp <= EPS) outside.push(p);
    if ((dp > EPS && dq < -EPS) || (dp < -EPS && dq > EPS)) {
      const v = interpolate(p, q, dp / (dp - dq));
      inside.push(v);
      outside.push(v);
    }
  }
  return { inside, outside };
}
function area(polygon: Vertex[]) {
  let result = 0;
  for (let i = 1; i < polygon.length - 1; i++)
    result +=
      Math.abs(
        cross(polygon[0].point, polygon[i].point, polygon[i + 1].point),
      ) / 2;
  return result;
}
/** Subtract one convex triangle; all returned polygons retain interpolated vertex colours/normals. */
function subtract(polygon: Vertex[], face: Face): Vertex[][] {
  const [a, b, c] = face.vertices.map((v) => v.point),
    sign = Math.sign(cross(a, b, c));
  let remaining = polygon;
  const result: Vertex[][] = [];
  for (const [p, q] of [
    [a, b],
    [b, c],
    [c, a],
  ]) {
    const parts = split(remaining, p, q, sign);
    if (area(parts.outside) > EPS) result.push(parts.outside);
    remaining = parts.inside;
    if (area(remaining) <= EPS) return [polygon];
  }
  return result;
}

/** Remove coplanar path overlap once at construction, after native collision upload.
 * Geometry is clipped in world space, leaving every physical surface and transform intact.
 * A small spatial hash avoids comparing every road triangle with every other triangle.
 */
export function trimNeonJunctions(root: THREE.Object3D): void {
  root.updateWorldMatrix(true, true);
  const paths: { owner: THREE.Object3D; bounds: THREE.Box3 }[] = [];
  root.traverse((owner) => {
    if (owner.userData.neonPath)
      paths.push({ owner, bounds: new THREE.Box3().setFromObject(owner) });
  });
  const candidates = paths.filter(
    (a) =>
      !a.owner.userData.neonJunctionsClipped &&
      paths.some(
        (b) =>
          a !== b &&
          a.bounds.intersectsBox(b.bounds) &&
          Math.min(a.bounds.max.x, b.bounds.max.x) -
            Math.max(a.bounds.min.x, b.bounds.min.x) >
            EPS &&
          Math.min(a.bounds.max.z, b.bounds.max.z) -
            Math.max(a.bounds.min.z, b.bounds.min.z) >
            EPS,
      ),
  );
  if (candidates.length < 2) return;
  const faces: Face[] = [],
    meshes = new Map<
      THREE.Mesh,
      {
        names: string[];
        attributes: THREE.BufferAttribute[];
        faces: Map<number, Face>;
        changed: boolean;
      }
    >(),
    edgeColor = new THREE.Color(0x72d9de);
  for (const { owner } of candidates) {
    owner.userData.neonJunctionsClipped = true;
    owner.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;
      const geometry = node.geometry,
        names = Object.keys(geometry.attributes),
        attributes = names.map(
          (name) => geometry.getAttribute(name) as THREE.BufferAttribute,
        ),
        position = geometry.getAttribute("position"),
        color = geometry.getAttribute("color"),
        count = geometry.index?.count ?? position.count,
        entry = {
          names,
          attributes,
          faces: new Map<number, Face>(),
          changed: false,
        };
      meshes.set(node, entry);
      for (let offset = 0; offset < count; offset += 3) {
        const indices = [0, 1, 2].map(
            (i) => geometry.index?.getX(offset + i) ?? offset + i,
          ),
          vertices = indices.map((i) => ({
            point: new THREE.Vector3()
              .fromBufferAttribute(position, i)
              .applyMatrix4(node.matrixWorld),
            attributes: attributes.map((attr) =>
              Array.from({ length: attr.itemSize }, (_, k) =>
                attr.getComponent(i, k),
              ),
            ),
          })),
          normal = vertices[1].point
            .clone()
            .sub(vertices[0].point)
            .cross(vertices[2].point.clone().sub(vertices[0].point))
            .normalize();
        if (Math.abs(normal.y) < 0.5) continue;
        if (normal.y < 0) normal.negate();
        const face: Face = {
          vertices,
          normal,
          plane: normal.dot(vertices[0].point),
          bounds: new THREE.Box3().setFromPoints(vertices.map((v) => v.point)),
          owner,
          mesh: node,
          offset,
          edge:
            !!color &&
            indices.every(
              (i) =>
                Math.abs(color.getX(i) - edgeColor.r) +
                  Math.abs(color.getY(i) - edgeColor.g) +
                  Math.abs(color.getZ(i) - edgeColor.b) <
                1e-5,
            ),
        };
        faces.push(face);
        entry.faces.set(offset, face);
      }
    });
  }
  // Road centres win over painted edge strips: junctions have no stripe through the lane.
  faces.sort(
    (a, b) =>
      Number(a.edge) - Number(b.edge) ||
      String(a.owner.userData.neonSurface).localeCompare(
        String(b.owner.userData.neonSurface),
      ) ||
      a.offset - b.offset,
  );
  const cells = new Map<string, Face[]>(),
    clipped = new Map<Face, Vertex[][]>();
  const keys = (bounds: THREE.Box3) => {
    const result: string[] = [];
    for (
      let x = Math.floor(bounds.min.x / 8);
      x <= Math.floor(bounds.max.x / 8);
      x++
    )
      for (
        let z = Math.floor(bounds.min.z / 8);
        z <= Math.floor(bounds.max.z / 8);
        z++
      )
        result.push(`${x}:${z}`);
    return result;
  };
  for (const face of faces) {
    let polygons = [face.vertices];
    const occupied = keys(face.bounds),
      candidates = new Set(occupied.flatMap((key) => cells.get(key) ?? []));
    for (const prior of candidates) {
      if (
        prior.owner === face.owner ||
        !face.bounds.intersectsBox(prior.bounds) ||
        face.normal.dot(prior.normal) < 0.999999 ||
        face.vertices.some(
          (v) => Math.abs(prior.normal.dot(v.point) - prior.plane) > EPS,
        )
      )
        continue;
      polygons = polygons.flatMap((polygon) => subtract(polygon, prior));
      if (!polygons.length) break;
    }
    if (
      Math.abs(
        polygons.reduce((sum, p) => sum + area(p), 0) - area(face.vertices),
      ) > EPS
    ) {
      clipped.set(face, polygons);
      meshes.get(face.mesh)!.changed = true;
    }
    for (const key of occupied) {
      const list = cells.get(key) ?? [];
      list.push(face);
      cells.set(key, list);
    }
  }
  for (const [mesh, entry] of meshes) {
    if (!entry.changed) continue;
    const original = mesh.geometry,
      output = entry.names.map(() => [] as number[]),
      count = original.index?.count ?? original.getAttribute("position").count;
    const groups: { start: number; count: number; materialIndex: number }[] =
      [];
    let written = 0;
    const emit = (vertex: Vertex) =>
      vertex.attributes.forEach((values, i) => output[i].push(...values));
    for (let offset = 0; offset < count; offset += 3) {
      const start = output[0].length / entry.attributes[0].itemSize;
      const face = entry.faces.get(offset),
        polygons = face ? clipped.get(face) : undefined;
      if (polygons) {
        for (const polygon of polygons)
          for (let i = 1; i < polygon.length - 1; i++)
            for (const v of [polygon[0], polygon[i], polygon[i + 1]]) emit(v);
      } else
        for (let i = 0; i < 3; i++) {
          const index = original.index?.getX(offset + i) ?? offset + i;
          entry.attributes.forEach((attr, j) => {
            for (let k = 0; k < attr.itemSize; k++)
              output[j].push(attr.getComponent(index, k));
          });
        }
      written = output[0].length / entry.attributes[0].itemSize;
      if (written > start) {
        const materialIndex =
            original.groups.find(
              (group) =>
                offset >= group.start && offset < group.start + group.count,
            )?.materialIndex ?? 0,
          previous = groups.at(-1);
        if (previous && previous.materialIndex === materialIndex)
          previous.count += written - start;
        else groups.push({ start, count: written - start, materialIndex });
      }
    }
    const geometry = new THREE.BufferGeometry();
    if (Array.isArray(mesh.material))
      for (const group of groups)
        geometry.addGroup(group.start, group.count, group.materialIndex);
    entry.names.forEach((name, i) =>
      geometry.setAttribute(
        name,
        new THREE.Float32BufferAttribute(
          output[i],
          entry.attributes[i].itemSize,
        ),
      ),
    );
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    mesh.geometry = geometry;
    original.dispose();
  }
}
