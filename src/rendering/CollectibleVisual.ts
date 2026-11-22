import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { collectibleKind, type CollectibleKind } from "./CollectibleArt";
import { SpriteTextures } from "./SpriteTextures";
import type { GraphicsQuality } from "./GraphicsQuality";

const templates = new Map<string, THREE.BufferGeometry>();
function starShape(radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 + Math.PI / 2,
      r = i % 2 ? radius * 0.44 : radius;
    const x = Math.cos(a) * r,
      y = Math.sin(a) * r;
    if (i) shape.lineTo(x, y);
    else shape.moveTo(x, y);
  }
  shape.closePath();
  return shape;
}
function modelGeometry(
  kind: CollectibleKind,
  high: boolean,
): THREE.BufferGeometry {
  const key = `${kind}-${high}`;
  const cached = templates.get(key);
  if (cached) return cached.clone();
  const parts: THREE.BufferGeometry[] = [],
    color = new THREE.Color(),
    q = new THREE.Quaternion(),
    matrix = new THREE.Matrix4();
  const add = (
    source: THREE.BufferGeometry,
    hex: string,
    position = new THREE.Vector3(),
    scale = new THREE.Vector3(1, 1, 1),
    rotation = new THREE.Euler(),
  ) => {
    let g = source;
    if (g.index) {
      g = source.toNonIndexed();
      source.dispose();
    }
    g.deleteAttribute("uv");
    q.setFromEuler(rotation);
    matrix.compose(position, q, scale);
    g.applyMatrix4(matrix);
    color.set(hex);
    const colors = new Float32Array(g.getAttribute("position").count * 3);
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    parts.push(g);
  };
  const ball = (
    hex: string,
    x: number,
    y: number,
    z: number,
    sx: number,
    sy: number,
    sz: number,
  ) =>
    add(
      new THREE.SphereGeometry(1, high ? 16 : 10, high ? 10 : 6),
      hex,
      new THREE.Vector3(x, y, z),
      new THREE.Vector3(sx, sy, sz),
    );
  if (kind === "pan") {
    const profile = [
        [-0.46, 0.3],
        [-0.25, 0.36],
        [0.04, 0.34],
        [0.3, 0.24],
        [0.5, 0.09],
        [0.55, 0.005],
      ],
      segments = high ? 24 : 14,
      positions: number[] = [],
      indices: number[] = [];
    profile.forEach(([x, r], i) => {
      for (let j = 0; j <= segments; j++) {
        const a = (j / segments) * Math.PI * 2;
        positions.push(x, Math.cos(a) * r, Math.sin(a) * r * 0.83);
        if (i && j) {
          const n = i * (segments + 1) + j;
          indices.push(
            n - 1,
            n - segments - 2,
            n,
            n,
            n - segments - 2,
            n - segments - 1,
          );
        }
      }
    });
    const crust = new THREE.BufferGeometry();
    crust.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    crust.setIndex(indices);
    crust.computeVertexNormals();
    add(crust, "#d79a48");
    add(
      new THREE.CircleGeometry(0.283, segments),
      "#f7e4ad",
      new THREE.Vector3(-0.464, 0, 0),
      new THREE.Vector3(0.83, 1, 1),
      new THREE.Euler(0, -Math.PI / 2, 0),
    );
    for (let i = 0; i < (high ? 24 : 10); i++) {
      const a = i * 2.4,
        r = 0.06 + (i % 4) * 0.045;
      ball(
        i % 3 ? "#cbb27c" : "#b3955f",
        -0.468,
        Math.cos(a) * r,
        Math.sin(a) * r * 0.8,
        0.003,
        0.012 + (i % 2) * 0.008,
        0.016,
      );
    }
    for (const x of [-0.17, 0.12])
      add(
        new THREE.TorusGeometry(0.28, 0.014, 5, high ? 22 : 12, 1.7),
        "#f4d399",
        new THREE.Vector3(x, 0.045, 0),
        new THREE.Vector3(1, 1, 0.83),
        new THREE.Euler(0, Math.PI / 2, -0.84),
      );
  } else if (kind === "dragon_ball") {
    add(
      new THREE.SphereGeometry(0.46, high ? 32 : 18, high ? 20 : 12),
      "#f5a21d",
    );
    for (const [x, y] of [
      [0, 0.17],
      [-0.17, 0],
      [0.17, 0],
      [0, -0.17],
    ]) {
      const g = new THREE.ShapeGeometry(starShape(0.075)),
        p = g.getAttribute("position");
      for (let i = 0; i < p.count; i++) {
        const xx = p.getX(i) + x,
          yy = p.getY(i) + y;
        p.setXYZ(i, xx, yy, Math.sqrt(0.46 * 0.46 - xx * xx - yy * yy) + 0.004);
      }
      g.computeVertexNormals();
      add(g, "#bb181c");
    }
    ball("#fff3cd", -0.17, 0.23, 0.363, 0.105, 0.035, 0.01);
  } else if (kind === "lonchas_pavo") {
    for (let sheet = 0; sheet < 2; sheet++) {
      const across = high ? 18 : 10,
        around = high ? 26 : 14,
        vertices: number[] = [],
        indices: number[] = [];
      for (let u = 0; u <= across; u++)
        for (let v = 0; v <= around; v++) {
          const t = u / across,
            theta = -1.7 + (v / around) * 4.6,
            r = 0.2 + (v / around) * 0.035,
            width = Math.sin(t * Math.PI) * 0.09;
          vertices.push(
            (t - 0.5) * 0.82,
            Math.cos(theta) * r * (0.82 + width),
            Math.sin(theta) * r,
          );
          if (u && v) {
            const n = u * (around + 1) + v;
            indices.push(
              n - 1,
              n - around - 2,
              n,
              n,
              n - around - 2,
              n - around - 1,
            );
          }
        }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
      g.setIndex(indices);
      g.computeVertexNormals();
      add(
        g,
        sheet ? "#f5c8b6" : "#dba697",
        new THREE.Vector3(
          sheet ? 0.08 : -0.07,
          sheet ? 0.14 : -0.13,
          sheet ? -0.06 : 0.1,
        ),
        new THREE.Vector3(1, 1, 1),
        new THREE.Euler(0.15, sheet ? -0.22 : 0.2, sheet ? 0.23 : -0.23),
      );
    }
  } else {
    add(
      new THREE.CylinderGeometry(0.025, 0.033, 0.78, high ? 12 : 8),
      "#9a75bd",
      new THREE.Vector3(0, -0.16, 0),
    );
    for (const y of [-0.49, -0.43, 0.13])
      add(
        new THREE.CylinderGeometry(0.037, 0.037, 0.022, 10),
        "#f2c568",
        new THREE.Vector3(0, y, 0),
      );
    const g = new THREE.ExtrudeGeometry(starShape(0.26), {
      depth: 0.075,
      bevelEnabled: true,
      bevelSize: high ? 0.018 : 0.012,
      bevelThickness: 0.015,
      bevelSegments: high ? 2 : 1,
      steps: 1,
    });
    add(g, "#ffd56b", new THREE.Vector3(0, 0.36, -0.04));
    ball("#fff1b9", -0.045, 0.45, 0.058, 0.06, 0.018, 0.005);
  }
  const merged = mergeGeometries(parts, false)!;
  parts.forEach((g) => g.dispose());
  merged.computeBoundingSphere();
  templates.set(key, merged);
  return merged.clone();
}

/** Stable root keeps pickup position, linked-platform animation and visibility unchanged across LOD swaps. */
export class CollectibleVisual extends THREE.Group {
  private kind: CollectibleKind;
  private quality: GraphicsQuality;
  private visual?: THREE.Mesh | THREE.Sprite;
  constructor(id: string, quality: GraphicsQuality = "medium") {
    super();
    this.kind = collectibleKind(id);
    this.quality = quality;
    this.name = `collectible:${this.kind}`;
    this.rebuild();
  }
  setKind(id: string): void {
    const kind = collectibleKind(id);
    if (kind !== this.kind) {
      this.kind = kind;
      this.name = `collectible:${kind}`;
      this.rebuild();
    }
  }
  setQuality(quality: GraphicsQuality): void {
    if (this.quality !== quality) {
      this.quality = quality;
      this.rebuild();
    }
  }
  animate(time: number, phase = 0): void {
    if (this.visual instanceof THREE.Mesh)
      this.visual.rotation.y = 0.45 + time * 0.65 + phase;
  }
  private rebuild(): void {
    this.dispose();
    if (this.quality === "low") {
      const material = new THREE.SpriteMaterial({
        map: SpriteTextures.getCollectibleTexture(this.kind),
        alphaTest: 0.12,
        transparent: false,
        depthWrite: true,
      });
      this.visual = new THREE.Sprite(material);
      this.visual.scale.set(1.18, 1.18, 1);
    } else {
      const food = this.kind === "pan" || this.kind === "lonchas_pavo";
      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: food ? 0.68 : this.kind === "dragon_ball" ? 0.2 : 0.32,
        metalness: food ? 0 : 0.15,
        side: THREE.DoubleSide,
      });
      material.name = `collectible-${this.kind}`;
      material.userData.collectibleMaterial = true;
      this.visual = new THREE.Mesh(
        modelGeometry(this.kind, this.quality === "high"),
        material,
      );
      this.visual.castShadow = this.quality === "high";
      this.visual.receiveShadow = this.quality === "high";
      this.visual.rotation.y = 0.45;
    }
    this.add(this.visual);
  }
  dispose(): void {
    if (!this.visual) return;
    const previous = this.visual;
    this.remove(previous);
    if (previous instanceof THREE.Mesh) previous.geometry.dispose();
    for (const material of Array.isArray(previous.material)
      ? previous.material
      : [previous.material])
      material.dispose();
    this.visual = undefined;
  }
}
