import * as THREE from "three";
import { LondonBatch } from "../world-06/LondonModels";
import type { LevelObjectData, Vector3Data } from "../LevelTypes";
import { buildRiverFrames } from "../world-05/SellaRiver";
import { katanaPose, type KatanaPose, type KyotoRoute } from "./KyotoRoutes";

const vermilion = 0xbb462c,
  wood = 0x664331,
  dark = 0x303d3b,
  gold = 0xc9a454,
  stone = 0x9b9f8b,
  cream = 0xe2d4b1;
function roof(b: LondonBatch, y: number, w: number, d: number, c = dark) {
  // Sloping tiled roofs with lifted eaves, built as solid wedges rather than transparent planes.
  for (const side of [-1, 1]) {
    b.add(
      new THREE.BoxGeometry(w, 0.26, d * 0.56),
      c,
      { x: 0, y: y + 0.85, z: side * d * 0.23 },
      { x: side * 0.29, y: 0, z: 0 },
    );
    b.box(w + 0.6, 0.18, 0.32, 0, y + 0.23, side * d * 0.5, c);
  }
  b.box(w + 0.25, 0.24, 0.22, 0, y + 1.25, 0, c);
}
function house(b: LondonBatch, shrine = false) {
  b.box(9, 0.6, 7, 0, 0.3, 0, stone);
  b.box(7.8, 4.3, 5.8, 0, 2.65, 0, shrine ? vermilion : cream);
  for (const x of [-3.75, -2.5, 0, 2.5, 3.75])
    b.box(0.18, 4.4, 0.23, x, 2.7, 3, wood);
  b.box(8, 0.2, 0.25, 0, 1.1, 3.03, wood);
  b.box(8, 0.2, 0.25, 0, 4.5, 3.03, wood);
  for (const x of [-2.5, 0, 2.5]) {
    b.box(1.8, 2.4, 0.08, x, 2.6, 3.05, 0xdcc9a0, "glow");
    for (let j = 0; j < 5; j++)
      b.box(0.045, 2.45, 0.1, x - 0.78 + j * 0.39, 2.6, 3.11, wood);
    for (const y of [1.8, 2.6, 3.4]) b.box(1.85, 0.045, 0.11, x, y, 3.12, wood);
  }
  roof(b, 4.5, 9.3, 7.3, shrine ? 0x4b6251 : dark);
}
function torii(b: LondonBatch, w: number) {
  b.box(w + 0.65, 0.2, 0.85, 0, -0.3, 0, dark);
  for (const x of [-w / 2, w / 2]) {
    b.cylinder(0.22, 5, x, 2.5, 0, vermilion);
    b.cylinder(0.25, 0.9, x, 0.25, 0, dark);
  }
  b.box(w + 1, 0.25, 0.36, 0, 4.02, 0, vermilion);
  b.box(w + 1.7, 0.32, 0.62, 0, 5, 0, vermilion);
  for (const side of [-1, 1])
    b.add(
      new THREE.BoxGeometry(1.3, 0.3, 0.64),
      dark,
      { x: side * (w / 2 + 0.45), y: 5.23, z: 0 },
      { x: 0, y: 0, z: side * 0.15 },
    );
  b.box(w + 0.2, 0.22, 0.64, 0, 5.12, 0, dark);
  b.box(0.5, 0.85, 0.13, 0, 4.55, 0.26, gold);
}
function fox(b: LondonBatch) {
  b.box(2, 0.35, 2.2, 0, 0.175, 0, stone);
  b.ball(0, 1.05, 0, 0.55, 0.9, 0.54, cream);
  b.ball(0, 1.95, 0.15, 0.5, 0.55, 0.48, cream);
  for (const x of [-0.32, 0.32]) {
    b.add(new THREE.ConeGeometry(0.27, 0.85, 4), cream, { x, y: 2.6, z: 0.08 });
    b.ball(x * 0.66, 2.08, 0.54, 0.065, 0.075, 0.045, dark);
  }
  b.add(new THREE.ConeGeometry(0.33, 0.65, 12).rotateX(Math.PI / 2), cream, {
    x: 0,
    y: 1.87,
    z: 0.6,
  });
  b.ball(0, 1.87, 0.94, 0.08, 0.065, 0.065, dark);
  b.box(0.92, 0.25, 0.8, 0, 1.56, 0.08, vermilion);
  b.box(0.35, 0.6, 0.12, 0, 1.28, 0.51, vermilion);
  b.ball(0.5, 0.85, -0.45, 0.3, 0.9, 0.35, cream);
}
function ribbon(b: LondonBatch, p: Record<string, unknown>) {
  const points = p.points as Vector3Data[],
    frames = buildRiverFrames(points),
    widths = p.widths as number[],
    banks = p.banks as number[];
  const vertices: number[] = [],
    colors: number[] = [],
    color = new THREE.Color();
  const at = (i: number, s: number, dy = 0) =>
    new THREE.Vector3(
      points[i].x + frames[i].x * s,
      points[i].y + dy + (banks?.[i] ?? 0) * s,
      points[i].z + frames[i].z * s,
    );
  const quad = (
    a: THREE.Vector3,
    c: THREE.Vector3,
    d: THREE.Vector3,
    e: THREE.Vector3,
    tint: number,
  ) => {
    color.setHex(tint);
    for (const q of [a, c, d, a, d, e]) {
      vertices.push(q.x, q.y, q.z);
      colors.push(color.r, color.g, color.b);
    }
  };
  for (let i = 0; i < points.length - 1; i++) {
    const wa = widths[i] / 2,
      wb = widths[i + 1] / 2;
    const aa = [-wa, -wa + 0.1, wa - 0.1, wa],
      bb = [-wb, -wb + 0.1, wb - 0.1, wb];
    for (let j = 0; j < 3; j++)
      quad(
        at(i, aa[j]),
        at(i, aa[j + 1]),
        at(i + 1, bb[j + 1]),
        at(i + 1, bb[j]),
        j === 1
          ? p.wood
            ? i % 8 < 4
              ? 0xb28b61
              : 0xa88056
            : i % 10 < 5
              ? Number(p.surfaceColor??0xbabca5)
              : Number(p.surfaceAltColor??0xb4b69f)
          : Number(p.edgeColor??vermilion),
      );
    for (const side of [-1, 1])
      quad(
        at(i, side * wa),
        at(i + 1, side * wb),
        at(i + 1, side * wb, -0.45),
        at(i, side * wa, -0.45),
        Number(p.sideColor??dark),
      );
    quad(
      at(i, -wa, -0.45),
      at(i + 1, -wb, -0.45),
      at(i + 1, wb, -0.45),
      at(i, wa, -0.45),
      dark,
    );
    if (p.rails && i % 60 < 38) {
      for (const side of [-1, 1])
        quad(
          at(i, side * wa, 0.38),
          at(i + 1, side * wb, 0.38),
          at(i + 1, side * wb, 0.22),
          at(i, side * wa, 0.22),
          vermilion,
        );
    }
  }
  for (const i of [0, points.length - 1])
    quad(
      at(i, -widths[i] / 2),
      at(i, widths[i] / 2),
      at(i, widths[i] / 2, -0.45),
      at(i, -widths[i] / 2, -0.45),
      dark,
    );
  const geo = new THREE.BufferGeometry()
    .setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))
    .setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  b.add(geo, -1);
}

export function createKyotoModel(
  obj: LevelObjectData,
  quality: string = "medium",
): { group: THREE.Group; meshes: THREE.Mesh[] } | null {
  const type = String(obj.properties?.subType ?? "");
  if (!type.startsWith("kyoto_")) return null;
  const kind = type.slice(6),
    p = obj.properties ?? {},
    b = new LondonBatch(),
    g = new THREE.Group(),
    detail = quality === "low" ? 0 : quality === "high" ? 2 : 1;
  const movingMeshes: THREE.Mesh[] = [];
  switch (kind) {
    case "island":
      b.add(new THREE.CylinderGeometry(5, 4.2, 1.6, 12, 1, true), 0x747967, {
        x: 0,
        y: -0.8,
        z: 0,
      });
      b.add(
        new THREE.CircleGeometry(5, 12),
        0x65765a,
        { x: 0, y: 0, z: 0 },
        { x: -Math.PI / 2, y: 0, z: 0 },
      );
      b.add(
        new THREE.CircleGeometry(4.2, 12),
        0x555c51,
        { x: 0, y: -1.6, z: 0 },
        { x: Math.PI / 2, y: 0, z: 0 },
      );
      break;
    case "path":
      ribbon(b, p);
      break;
    case "torii":
      torii(b, Number(p.width ?? 4));
      break;
    case "bamboo":
      b.cylinder(2, 0.44, 0, -0.18, 0, 0x687749, "solid", 12);
      for (let i = 0; i < 5 + detail * 2; i++) {
        const a = i * 2.4,
          r = 0.4 + (i % 3) * 0.48,
          x = Math.cos(a) * r,
          z = Math.sin(a) * r,
          h = 7 + (i % 4) * 1.35;
        b.cylinder(
          0.12,
          h,
          x,
          h / 2,
          z,
          i % 2 ? 0x668b47 : 0x78934b,
          "solid",
          8,
        );
        for (let j = 1; j < h; j += 1.35)
          b.cylinder(0.14, 0.08, x, j, z, 0x9da665, "solid", 8);
        for (let j = 0; j < 2 + detail; j++)
          b.add(
            new THREE.SphereGeometry(1, 6, 4).scale(1.3, 0.13, 0.3),
            0x446b43,
            { x: x + (j % 2 ? 0.65 : -0.65), y: h - 1 - j * 0.7, z },
            { x: 0, y: j * 1.7, z: j % 2 ? 0.3 : -0.3 },
          );
      }
      break;
    case "sakura":
    case "pine": {
      const sakura = kind === "sakura";
      b.cylinder(0.32, 5, 0, 2.5, 0, wood, "solid", 10);
      for (let i = 0; i < 6 + detail * 3; i++) {
        const a = i * 2.4,
          r = 1 + (i % 3) * 0.75,
          x = Math.cos(a) * r,
          z = Math.sin(a) * r,
          y = 4.7 + (i % 3) * 0.7;
        b.add(
          new THREE.CylinderGeometry(0.1, 0.18, 3, 7),
          wood,
          { x: x * 0.5, y: 3.8, z: z * 0.5 },
          { x: z * 0.19, y: 0, z: -x * 0.19 },
        );
        b.ball(
          x,
          y,
          z,
          1.45,
          sakura ? 1.1 : 0.6,
          1.4,
          sakura ? [0xeeb7be, 0xe7a5b0, 0xf2c9cd][i % 3] : 0x42634b,
        );
      }
      break;
    }
    case "lantern":
      b.box(1.25, 0.25, 1.25, 0, 0.125, 0, stone);
      b.cylinder(0.23, 1.7, 0, 1.1, 0, stone);
      b.box(0.9, 0.25, 0.9, 0, 1.95, 0, stone);
      b.box(0.65, 0.7, 0.65, 0, 2.4, 0, 0xffcc80, "glow");
      for (const x of [-0.37, 0.37])
        for (const z of [-0.37, 0.37])
          b.box(0.12, 0.85, 0.12, x, 2.4, z, stone);
      roof(b, 2.5, 1.5, 1.5, stone);
      b.ball(0, 3.9, 0, 0.18, 0.26, 0.18, stone);
      break;
    case "machiya":
      house(b);
      break;
    case "shrine":
      house(b, true);
      torii(b, 5.8);
      break;
    case "teahouse":
      house(b);
      b.box(5, 0.25, 3, 0, 0.8, 5, wood);
      for (const x of [-1.8, 1.8]) b.box(0.3, 0.8, 2.4, x, 0.4, 5, wood);
      break;
    case "pavilion":
      b.box(14, 0.8, 11, 0, 0.4, 0, stone);
      for (let floor = 0; floor < 3; floor++) {
        const w = 12 - floor * 2,
          d = 9 - floor * 1.4,
          y = 0.8 + floor * 4.2;
        b.box(
          w,
          3,
          d,
          0,
          y + 1.5,
          0,
          floor ? gold : cream,
          floor ? "metal" : "solid",
        );
        for (const side of [-1, 1])
          for (let i = 0; i < 5; i++)
            b.box(
              0.65,
              1.7,
              0.08,
              -w * 0.38 + i * w * 0.19,
              y + 1.7,
              side * (d / 2 + 0.05),
              dark,
            );
        roof(b, y + 2.8, w + 2, d + 2);
        b.box(w + 1, 0.18, d + 1, 0, y + 0.25, 0, gold);
      }
      b.ball(0, 14.9, 0, 0.3, 0.5, 0.3, gold, "metal");
      for (const side of [-1, 1])
        b.add(
          new THREE.ConeGeometry(0.6, 2.4, 3),
          gold,
          { x: side * 0.8, y: 15, z: 0 },
          { x: 0, y: 0, z: side * 1.1 },
          "metal",
        );
      break;
    case "matcha":
      b.cylinder(2.3, 0.15, 0, 0.1, 0, wood);
      b.add(
        new THREE.LatheGeometry(
          [
            new THREE.Vector2(0.9, 0),
            new THREE.Vector2(1.3, 0.25),
            new THREE.Vector2(1.55, 1.2),
            new THREE.Vector2(1.42, 1.2),
            new THREE.Vector2(1.18, 0.3),
          ],
          24,
        ),
        0x8a9e73,
        { x: 0, y: 0.2, z: 0 },
      );
      b.cylinder(1.36, 0.05, 0, 1.25, 0, 0x718943);
      for (let i = 0; i < 8; i++)
        b.cylinder(
          0.035,
          1.6,
          1.7 + Math.sin(i) * 0.1,
          1.2,
          Math.cos(i) * 0.1,
          0xc1a26c,
          "solid",
          6,
        );
      break;
    case "kitsune":
      fox(b);
      break;
    case "dojo":
      house(b);
      roof(b, 5.4, 11, 9);
      b.box(2.7, 0.8, 0.2, 0, 4, 3.3, dark);
      break;
    case "katana":
      for (const x of [-1.3, 1.3]) {
        b.box(0.18, 1.7, 0.4, x, 0.9, 0, wood);
        b.box(0.65, 0.15, 0.8, x, 0.15, 0, wood);
      }
      for (const y of [0.9, 1.5]) {
        b.box(2.6, 0.07, 0.13, 0.3, y, 0.1, 0xc8d1c9, "metal");
        b.box(0.75, 0.16, 0.18, -1.32, y, 0.1, dark);
        b.box(0.12, 0.45, 0.4, -0.92, y, 0.1, gold, "metal");
      }
      break;
    case "sweeping_katana": {
      b.box(1.3, 0.5, 1.3, 0, -0.25, 0, stone);
      b.cylinder(0.18, 0.9, 0, 0.45, 0, wood, "solid", 10);
      const sword = new THREE.Group(),
        steel = new LondonBatch();
      sword.name = "kyoto-katana-blade";
      sword.position.y = 0.98;
      g.add(sword);
      const blade = new THREE.Shape();
      blade.moveTo(-0.65, 0);
      blade.lineTo(-6.5, 0.04);
      blade.lineTo(-7, 0.38);
      blade.lineTo(-6.3, 0.23);
      blade.lineTo(-0.65, 0.18);
      blade.closePath();
      steel.add(
        new THREE.ExtrudeGeometry(blade, { depth: 0.12, bevelEnabled: false }),
        0xc3d8dd,
        { x: 0, y: -0.13, z: -0.06 },
        undefined,
        "metal",
      );
      steel.box(0.16, 0.65, 0.55, -0.55, 0, 0, gold, "metal");
      steel.box(1.1, 0.22, 0.25, 0.08, 0, 0, vermilion);
      for (let i = 0; i < 5; i++)
        steel.box(0.07, 0.24, 0.27, -0.3 + i * 0.19, 0, 0, cream);
      movingMeshes.push(...steel.finish(sword));
      break;
    }
    case "zen":
      b.box(6, 0.3, 5, 0, 0.15, 0, 0xc9c4a7);
      for (let i = 0; i < 5 + detail * 3; i++)
        b.ring(0.5 + i * 0.2, 0.025, 0, 0.32, 0, 0xa6a58d, true);
      for (let i = 0; i < 3; i++)
        b.ball(
          -1 + i * 1.1,
          0.6,
          -0.5 + i * 0.4,
          0.6,
          0.6 + i * 0.1,
          0.5,
          stone,
        );
      break;
    case "bridge":
      for (let i = 0; i < 15; i++) {
        const x = -3.5 + i * 0.5,
          y = Math.sin((i / 14) * Math.PI) * 1.3;
        b.box(0.49, 0.2, 2, x, y, 0, wood);
        for (const z of [-1.15, 1.15])
          b.box(0.49, 0.16, 0.16, x, y + 0.8, z, vermilion);
      }
      break;
    case "paper_lantern":
      b.cylinder(0.055, 3.6, 0, 1.8, 0, dark, "solid", 8);
      b.box(1.1, 0.09, 0.09, 0.5, 3.5, 0, dark);
      b.ball(1, 2.8, 0, 0.5, 0.7, 0.5, 0xe5a16d, "glow");
      for (let i = 0; i < 7; i++)
        b.ring(
          0.49 * Math.sqrt(1 - ((i - 3) / 4) ** 2),
          0.025,
          1,
          2.8 + (i - 3) * 0.17,
          0,
          vermilion,
          true,
        );
      break;
    default:
      return null;
  }
  const meshes = [...b.finish(g), ...movingMeshes];
  if (kind === "kitsune") {
    const fire = new THREE.Group(),
      flame = new LondonBatch();
    fire.name = "kyoto-blue-fire";
    fire.position.set(0, 1.8, 0.9);
    fire.visible = false;
    const profile = [
      [0.03, 0],
      [0.18, 0.1],
      [0.34, 0.36],
      [0.24, 0.67],
      [0.11, 1],
      [0.055, 1.25],
      [0, 1.55],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    flame.add(new THREE.LatheGeometry(profile, 12), 0x167dff);
    flame.add(
      new THREE.LatheGeometry(profile, 10).scale(0.5, 0.7, 0.5),
      0xabefff,
      { x: 0, y: 0.05, z: 0.14 },
      { x: 0.12, y: 0, z: 0.18 },
    );
    for (const mesh of flame.finish(fire)) {
      (mesh.material as THREE.Material).dispose();
      mesh.material = new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
    }
    g.add(fire);
  }
  for (const mesh of meshes) {
    mesh.name = `kyoto-${kind}`;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  }
  g.name = `kyoto-${kind}`;
  g.position.set(obj.position.x, obj.position.y, obj.position.z);
  g.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
  g.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
  previewKyotoKatana(obj, g, 0);
  g.updateMatrixWorld(true);
  return { group: g, meshes };
}

/** Shared by the editor and gameplay so the preview shows the same safe passing window. */
export function previewKyotoKatana(
  obj: LevelObjectData,
  group: THREE.Object3D,
  time: number,
): KatanaPose | undefined {
  if (obj.properties?.subType !== "kyoto_sweeping_katana") return;
  const blade = group.getObjectByName("kyoto-katana-blade");
  if (!blade) return;
  const pose = katanaPose(time, Number(obj.properties?.index ?? 0));
  blade.rotation.set(0, pose.yaw, pose.roll, "YXZ");
  return pose;
}

export function kyotoPathProperties(
  route: KyotoRoute,
  wooden = false,
  rails = false,
): Record<string, unknown> {
  return {
    ...route,
    wood: wooden,
    rails,
    subType: "kyoto_path",
    hasCollision: true,
  };
}
