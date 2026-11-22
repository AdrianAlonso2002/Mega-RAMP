import * as THREE from "three";
import { SharedTextureCache } from "../../rendering/StageResources";
import type { GraphicsQuality } from "../../rendering/GraphicsQuality";
import type { PhysicsWorld } from "../../physics/PhysicsWorld";
import type { LevelObjectData } from "../LevelTypes";

export interface CoastalCollider {
  position: THREE.Vector3;
  halfExtents: THREE.Vector3;
}
export function attachCoastalPhysics(
  group: THREE.Group,
  obj: LevelObjectData,
  physics: PhysicsWorld,
): void {
  group.userData.levelObjectId = obj.id;
  const rotation = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(obj.rotation.x, obj.rotation.y, obj.rotation.z, "YXZ"),
  );
  for (const collider of group.userData.coastalColliders as CoastalCollider[]) {
    const position = collider.position
      .clone()
      .applyQuaternion(rotation)
      .add(group.position);
    physics.createBoxCollider(
      position,
      rotation,
      collider.halfExtents,
      0.7,
      0.04,
    );
  }
  group.updateWorldMatrix(true, true);
  for (const mesh of (group.userData.coastalTrimeshes ?? []) as THREE.Mesh[]) {
    const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld),
      vertices = Float32Array.from(geometry.getAttribute("position").array);
    const indices = geometry.index
      ? Uint32Array.from(geometry.index.array)
      : Uint32Array.from({ length: vertices.length / 3 }, (_, i) => i);
    physics.createTrimeshCollider(vertices, indices, 0.04, 0.7);
    geometry.dispose();
  }
}
const signs = new SharedTextureCache<THREE.CanvasTexture>();
function signTexture(text: string): THREE.CanvasTexture {
  const cached = signs.get(text);
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#15373f";
  ctx.fillRect(0, 0, 512, 96);
  ctx.strokeStyle = "#dfbf75";
  ctx.lineWidth = 3;
  ctx.strokeRect(7, 7, 498, 82);
  ctx.fillStyle = "#fff4d7";
  ctx.font = "bold 32px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 49, 475);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  signs.set(text, texture);
  return texture;
}
function model(name: string, quality: GraphicsQuality) {
  const group = new THREE.Group(),
    meshes: THREE.Mesh[] = [],
    colliders: CoastalCollider[] = [];
  group.name = name;
  group.userData.coastalColliders = colliders;
  const materials = new Map<string, THREE.MeshStandardMaterial>();
  const mat = (color: string, family = "stone") => {
    const key = color + family;
    let m = materials.get(key);
    if (!m) {
      m = new THREE.MeshStandardMaterial({
        color,
        roughness:
          family === "metal"
            ? 0.3
            : family === "glass"
              ? 0.23
              : family === "plastic"
                ? 0.38
                : 0.76,
        metalness: family === "metal" ? 0.65 : 0,
      });
      m.userData.graphicsSurface = family;
      materials.set(key, m);
    }
    return m;
  };
  const add = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    x: number,
    y: number,
    z: number,
  ) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  };
  const box = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    color: string,
    solid = true,
    family = "stone",
  ) => {
    const mesh = add(
      new THREE.BoxGeometry(w, h, d),
      mat(color, family),
      x,
      y,
      z,
    );
    if (solid) {
      meshes.push(mesh);
      colliders.push({
        position: new THREE.Vector3(x, y, z),
        halfExtents: new THREE.Vector3(w / 2, h / 2, d / 2),
      });
    }
    return mesh;
  };
  const ball = (
    r: number,
    x: number,
    y: number,
    z: number,
    color: string,
    sx = 1,
    sy = 1,
    sz = 1,
  ) => {
    const mesh = add(
      new THREE.SphereGeometry(
        r,
        quality === "low" ? 8 : quality === "medium" ? 12 : 18,
        quality === "low" ? 6 : 10,
      ),
      mat(color, "food"),
      x,
      y,
      z,
    );
    mesh.scale.set(sx, sy, sz);
    return mesh;
  };
  const label = (text: string, w: number, x: number, y: number, z: number) =>
    add(
      new THREE.PlaneGeometry(w, (w * 96) / 512),
      new THREE.MeshBasicMaterial({
        map: signTexture(text),
        toneMapped: false,
      }),
      x,
      y,
      z,
    );
  const cylinder = (
    radius: number,
    height: number,
    x: number,
    y: number,
    z: number,
    color: string,
  ) =>
    add(
      new THREE.CylinderGeometry(
        radius,
        radius,
        height,
        quality === "low" ? 8 : 16,
      ),
      mat(color, "wood"),
      x,
      y,
      z,
    );
  return { group, meshes, colliders, box, ball, label, cylinder, mat, add };
}

export function coastalShop(
  quality: GraphicsQuality,
  type: string,
  color: string,
) {
  const m = model(`coastal-shop-${type}`, quality),
    { box, ball, label } = m;
  const names: Record<string, string> = {
    icecream: "HELADERÍA",
    surf: "SURF & PLAYA",
    arcade: "RECREATIVOS",
    bakery: "CAFÉ & PAN",
    fashion: "MODA",
    jewelry: "JOYERÍA",
  };
  box(7.2, 0.8, 7.2, 0, 0, 0, "#d3c5ad");
  box(3, 0.12, 0.55, 0, 0.34, 3.65, "#d3c5ad"); // Level threshold to the gallery.
  box(7.2, 4.6, 0.22, 0, 2.7, -3.49, "#eee6d3");
  for (const side of [-1, 1]) {
    box(0.22, 4.6, 7.2, side * 3.49, 2.7, 0, "#eee6d3");
    box(0.12, 0.42, 7.25, side * 3.65, 0.61, 0, "#b4a98e", false);
    for (const z of [-3.22, 3.22])
      box(0.12, 4.2, 0.23, side * 3.65, 2.9, z, "#d6c9ad", false);
    box(2.1, 3.65, 0.18, side * 2.5, 2.225, 3.5, "#325966", true, "glass");
    box(0.14, 3.65, 0.24, side * 1.41, 2.225, 3.54, "#c6ab6b", false, "metal");
    box(2.1, 0.1, 0.18, side * 2.5, 1.1, 3.66, "#c6ab6b", false, "metal");
    box(2.1, 0.1, 0.18, side * 2.5, 3.75, 3.66, "#c6ab6b", false, "metal");
    if (type === "surf")
      ball(0.27, side * 2.5, 2.25, 3.64, "#efba62", 0.7, 3.5, 0.23);
    else if (type === "fashion") {
      ball(0.16, side * 2.5, 2.55, 3.66, "#d7ae8c");
      box(0.48, 0.7, 0.1, side * 2.5, 2.02, 3.66, color, false);
    } else if (type === "arcade") {
      box(0.85, 1.2, 0.15, side * 2.5, 1.8, 3.65, "#303848", false);
      box(0.64, 0.44, 0.025, side * 2.5, 2, 3.744, "#83c9c2", false);
    } else if (type === "jewelry") {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.28, 0.045, 6, 18),
        m.mat("#d6b364", "metal"),
      );
      ring.position.set(side * 2.5, 2.1, 3.66);
      m.group.add(ring);
      ball(0.12, side * 2.5, 2.4, 3.66, "#85c6d0");
    } else
      for (let i = 0; i < 3; i++)
        ball(
          0.19,
          side * 2.5 + (i - 1) * 0.44,
          1.45,
          3.66,
          type === "icecream"
            ? ["#e0bc82", "#c6d4a2", "#e8a8ba"][i]
            : "#d4a56a",
          1,
          type === "bakery" ? 0.5 : 1,
          0.5,
        );
    box(0.64, 0.85, 0.7, side * 2.86, 0.825, -2.5, color, true, "wood");
    box(0.73, 0.09, 0.78, side * 2.86, 1.295, -2.5, "#efe5cd", false);
    for (let i = 0; i < 3; i++) {
      const z = -2.7 + i * 0.2;
      if (type === "surf") {
        const board = ball(
          0.33,
          side * 3.12,
          1.95,
          z,
          i % 2 ? "#f3ba52" : color,
          0.25,
          2.4,
          0.9,
        );
        board.rotation.z = side * 0.12;
      } else if (type === "arcade") {
        box(0.48, 0.75, 0.48, side * 2.9, 1.7, z, "#243449", false);
        box(
          0.4,
          0.3,
          0.035,
          side * 2.9,
          1.85,
          z + 0.255,
          i % 2 ? "#da81dc" : "#56cdd1",
          false,
        );
      } else if (type === "fashion") {
        ball(0.23, side * 2.9, 1.85, z, "#d7ae8c", 0.7, 1, 0.7);
        box(
          0.35,
          0.42,
          0.19,
          side * 2.9,
          1.47,
          z,
          i % 2 ? "#e68e88" : color,
          false,
        );
      } else if (type === "jewelry") {
        ball(0.15, side * 2.9, 1.6, z, "#d0aa55", 1, 0.55, 1);
        ball(0.09, side * 2.9, 1.74, z, "#5aa5b8");
      } else {
        ball(
          0.18,
          side * 2.9,
          1.5,
          z,
          type === "icecream"
            ? ["#efacb6", "#e4d2a0", "#977353"][i]
            : "#c99654",
          1,
          type === "bakery" ? 0.5 : 1,
          1,
        );
      }
    }
  }
  // Display screen hides the rear alcove. Both side passages remain > two metres wide.
  box(2.4, 2.8, 0.2, 0, 1.8, 0.1, color, true, "wood");
  label(names[type] ?? "ALICANTE", 2.05, 0, 2.45, 0.212);
  box(7.4, 0.22, 7.5, 0, 5.1, 0, "#e5ddc9");
  box(7.3, 0.85, 0.35, 0, 4.55, 3.62, color);
  label(names[type] ?? "ALICANTE", 5.7, 0, 4.55, 3.805);
  box(6.7, 0.055, 0.1, 0, 4.04, 3.7, "#fff0b6", false);
  // Raised trim and inset ceiling panels avoid coplanar surfaces.
  if (quality !== "low")
    for (const z of [-2, 1])
      box(4.8, 0.05, 0.55, 0, 4.965, z, "#fff2c9", false);
  return { group: m.group, meshes: m.meshes };
}

export function coastalStall(
  quality: GraphicsQuality,
  type: string,
  color: string,
  stripe: string,
) {
  const m = model(`coastal-stall-${type}`, quality),
    { box, ball, cylinder, label } = m;
  box(5.4, 0.8, 4.4, 0, 0, 0, "#a17b51", true, "wood");
  box(3.5, 0.12, 0.4, 0, 0.34, 2.25, "#a17b51", true, "wood");
  for (const x of [-2.55, 2.55])
    for (const z of [-2.05, 2.05])
      box(0.16, 3.6, 0.16, x, 2.2, z, "#6f4d32", true, "wood");
  box(5.2, 3.2, 0.12, 0, 2, -2.05, stripe);
  box(0.12, 3.2, 4.1, -2.55, 2, 0, color);
  // Side counter leaves a full-width entrance and a clear route to the rear bay.
  box(0.9, 0.85, 2.3, -1.9, 0.825, -0.3, "#8f6842", true, "wood");
  box(1.05, 0.09, 2.4, -1.9, 1.295, -0.3, "#c59c65", false, "wood");
  box(1.4, 2.6, 0.14, 0, 1.7, 0.8, color);
  const products = quality === "low" ? 4 : 7;
  for (let i = 0; i < products; i++) {
    const z = -1.15 + (i * 1.7) / (products - 1),
      x = -1.9 + (i % 2) * 0.17;
    if (type === "pottery") {
      cylinder(0.18, 0.3, x, 1.5, z, "#be7952");
      cylinder(0.11, 0.08, x, 1.69, z, "#c78d65");
    } else if (type === "hats") {
      cylinder(0.28, 0.035, x, 1.38, z, "#e2c383");
      cylinder(0.16, 0.13, x, 1.46, z, "#e2c383");
    } else if (type === "flowers") {
      cylinder(0.12, 0.23, x, 1.46, z, "#a6b8ac");
      box(0.025, 0.45, 0.025, x, 1.77, z, "#688d52", false);
      ball(0.13, x, 2.02, z, i % 2 ? "#e6abcb" : "#ebce7a");
    } else {
      ball(0.15, x, 1.5, z, i % 3 ? "#ed9d43" : "#98b555");
      ball(0.12, x + 0.1, 1.65, z, "#edbd57");
    }
  }
  const names: Record<string, string> = {
    fruit: "FRUTA DE TEMPORADA",
    pottery: "CERÁMICA",
    hats: "ARTESANÍA",
    flowers: "FLORES",
    goal: "ARTESANÍA",
  };
  label(names[type] ?? "MERCADILLO", 2.65, 0, 3.45, 2.42);
  // Separate sloping fabric strips, with a valance; no overlapping painted planes.
  const ceiling = box(5.8, 0.05, 5, 0, 3.77, 0, stripe, false); // Continuous inner lining also closes strip seams from above.
  m.meshes.push(ceiling);
  const strips = quality === "low" ? 6 : 10,
    width = 5.8 / strips;
  for (let i = 0; i < strips; i++)
    for (const side of [-1, 1]) {
      const roof = box(
        width,
        0.065,
        2.55,
        -2.9 + width * (i + 0.5),
        4.05,
        side * 1.22,
        i % 2 ? stripe : color,
        false,
      );
      roof.rotation.x = side * 0.16;
      m.meshes.push(roof);
    }
  box(5.8, 0.29, 0.07, 0, 3.72, 2.48, color, false);
  m.colliders.push({
    position: new THREE.Vector3(0, 4.05, 0),
    halfExtents: new THREE.Vector3(2.9, 0.23, 2.5),
  });
  return { group: m.group, meshes: m.meshes };
}

export function coastalYacht(
  quality: GraphicsQuality,
  hullColor: string,
  cabinColor: string,
  stripeColor: string,
) {
  const m = model("coastal-yacht", quality),
    { box, ball, cylinder } = m;
  const outline = new THREE.Shape();
  outline.moveTo(-1.85, 4.6);
  outline.lineTo(1.85, 4.6);
  outline.lineTo(2.1, 1);
  outline.quadraticCurveTo(2, -3.3, 0, -5.1);
  outline.quadraticCurveTo(-2, -3.3, -2.1, 1);
  outline.closePath();
  const hullGeometry = new THREE.ExtrudeGeometry(outline, {
    depth: 0.95,
    steps: 1,
    bevelEnabled: quality !== "low",
    bevelSize: 0.09,
    bevelThickness: 0.08,
    bevelSegments: quality === "high" ? 3 : 1,
    curveSegments: quality === "low" ? 5 : 10,
  });
  hullGeometry.rotateX(Math.PI / 2);
  hullGeometry.translate(0, 0.38, 0);
  const hull = m.add(hullGeometry, m.mat(hullColor, "plastic"), 0, 0, 0);
  hull.name = "yacht-hull";
  m.meshes.push(hull);
  m.group.userData.coastalTrimeshes = [hull];
  box(3.7, 0.12, 7.3, 0, 0.42, 0.8, "#b7966a", true, "wood");
  for (const side of [-1, 1]) {
    box(
      0.07,
      0.18,
      6.8,
      side * 1.97,
      0.12,
      0.65,
      stripeColor,
      false,
      "plastic",
    );
    box(0.18, 1.9, 3.3, side * 1.51, 1.43, -0.8, hullColor);
    box(0.035, 0.68, 2.6, side * 1.615, 1.78, -0.9, "#2a5265", false, "glass");
    for (let j = 0; j < 4; j++) {
      const post = cylinder(
        0.025,
        0.68,
        side * 1.8,
        0.83,
        0.7 + j * 1.05,
        "#c3cecc",
      );
      post.material = m.mat("#c3cecc", "metal");
    }
    box(0.035, 0.035, 3.8, side * 1.8, 1.18, 2.22, "#c3cecc", false, "metal");
    for (let j = 0; j < 3; j++) {
      const fender = ball(
        0.13,
        side * 2.12,
        0.12,
        1 + j * 1.1,
        "#e2dfd3",
        1,
        2.4,
        1,
      );
      fender.name = "mooring-fender";
    }
  }
  box(3.12, 1.9, 0.15, 0, 1.43, -2.45, hullColor);
  box(2.85, 0.68, 0.035, 0, 1.78, -2.54, "#2a5265", false, "glass");
  // Open aft cabin doorway and a walkable cockpit at dock height.
  for (const side of [-1, 1])
    box(0.55, 1.9, 0.15, side * 1.23, 1.43, 0.87, hullColor);
  box(3.3, 0.16, 3.6, 0, 2.47, -0.75, hullColor);
  box(3.35, 0.09, 0.3, 0, 2.59, 0.6, stripeColor, false, "plastic");
  for (const side of [-1, 1]) {
    box(0.52, 0.45, 1.1, side * 1.25, 0.77, 2.9, cabinColor);
    box(0.12, 0.7, 1.1, side * 1.55, 1.06, 2.9, hullColor, false);
  }
  box(1.05, 0.5, 0.6, 0, 0.82, -1.2, cabinColor);
  const wheel = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.024, 5, quality === "low" ? 10 : 18),
    m.mat("#b7c6c7", "metal"),
  );
  wheel.position.set(0, 1.35, -1.45);
  wheel.rotation.x = -0.4;
  m.group.add(wheel);
  box(0.13, 0.85, 0.13, 0, 2.95, -0.3, "#c3cecc", false, "metal");
  box(0.9, 0.1, 0.13, 0, 3.35, -0.3, "#e3e8df", false);
  if (quality !== "low")
    for (let i = 0; i < 9; i++)
      box(
        3.4,
        0.008,
        0.018,
        0,
        0.485,
        1.1 + i * 0.36,
        "#79654b",
        false,
        "wood",
      );
  return { group: m.group, meshes: m.meshes };
}
