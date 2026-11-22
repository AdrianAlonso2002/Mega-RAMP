import {createAuroraModel,previewAuroraModel} from './AuroraModels';
import * as THREE from "three";
import type { LevelObjectData } from "../LevelTypes";
import { LondonBatch, londonLabel } from "../world-06/LondonModels";
import { createKyotoModel } from "../world-07/KyotoModels";
import { norwayArc, norwayPath, norwayTileAngle, v } from "./NorwayRoutes";
import { createFjordModel, previewFjordModel } from "./FjordModels";
import { createOsloModel, previewOsloModel } from "./OsloModels";
const snow = 0xecf5f8,
  ice = 0x8fbdd3,
  blue = 0x568ba8,
  rock = 0x435c70,
  dark = 0x263e54,
  wood = 0x78564b,
  warm = 0xf6cc8e;
function roof(b: LondonBatch, y: number, w: number, d: number) {
  for (const side of [-1, 1]) {
    b.add(
      new THREE.BoxGeometry(w, 0.28, d * 0.59),
      dark,
      v(0, y + 0.85, side * d * 0.23),
      v(side * 0.4, 0, 0),
    );
    b.add(
      new THREE.BoxGeometry(w + 0.25, 0.17, d * 0.6),
      snow,
      v(0, y + 1.02, side * d * 0.23),
      v(side * 0.4, 0, 0),
    );
  }
}
function cabin(b: LondonBatch, group: THREE.Group, rorbu = false) {
  if (rorbu) {
    for (const x of [-2.5, 2.5])
      for (const z of [-2, 2]) b.cylinder(0.2, 4, x, 0, z, wood);
    b.box(8, 0.28, 7, 0, 1, 0, wood);
  }
  if (!rorbu) {
    b.add(new THREE.CylinderGeometry(5.3, 2, 9, 7), rock, v(0, -4.7, 0));
    b.cylinder(5.4, 0.18, 0, -0.11, 0, snow, "solid", 7);
  }
  const base = rorbu ? 1.2 : 0;
  b.box(6, 4, 4.5, 0, base + 2, 0, rorbu ? 0x9e4e51 : 0x866b5b);
  roof(b, base + 4, 7, 5.3);
  b.box(0.9, 2.2, 0.12, 0, base + 1.1, 2.32, dark);
  for (const x of [-1.9, 1.9]) {
    b.add(
      new THREE.PlaneGeometry(1.1, 1.25),
      warm,
      v(x, base + 2.4, 2.34),
      undefined,
      "glow",
    );
    b.box(0.08, 1.3, 0.13, x, base + 2.4, 2.38, wood);
    b.box(1.17, 0.07, 0.13, x, base + 2.4, 2.38, wood);
  }
  for (let i = 0; i < 10; i++)
    b.box(
      6,
      0.035,
      0.05,
      0,
      base + 0.3 + i * 0.36,
      2.28,
      rorbu ? 0x6f3940 : 0x5a4941,
    );
  b.box(0.7, 2, 0.7, 1.5, base + 5.3, -0.8, rock);
  b.box(0.95, 0.15, 0.95, 1.5, base + 6.3, -0.8, snow);
  b.box(6.6, 0.15, 0.7, 0, base + 0.12, 2.55, snow);
  if (!rorbu)
    londonLabel(
      group,
      "FJELLHYTTE",
      0,
      base + 3.7,
      2.34,
      3,
      0.32,
      "#684f42",
      "#ecddbd",
    );
}
function mountain(b: LondonBatch, seed: number) {
  for (let i = 0; i < 3; i++) {
    const height = 42 - i * 7 + (seed % 3) * 3,
      radius = 26 - i * 4,
      x = (i - 1) * 18,
      z = (i % 2) * 8,
      segments = 7 + i,
      apex = new THREE.Vector3(x, height, z),
      vertices: number[] = [],
      colors: number[] = [],
      color = new THREE.Color();
    const triangle = (
      a: THREE.Vector3,
      c: THREE.Vector3,
      d: THREE.Vector3,
      tone: number,
    ) => {
      vertices.push(...a.toArray(), ...c.toArray(), ...d.toArray());
      color.setHex(tone);
      for (let n = 0; n < 3; n++) color.toArray(colors, colors.length);
    };
    const base = (j: number) => {
      const angle =
        ((j % segments) / segments) * Math.PI * 2 + seed * 0.43 + i * 0.7;
      return new THREE.Vector3(
        x + Math.sin(angle) * radius,
        0,
        z + Math.cos(angle) * radius,
      );
    };
    const snowline = (j: number) =>
      apex
        .clone()
        .lerp(base(j), 0.48 + 0.07 * Math.sin((j % segments) * 2 + seed));
    // Snow replaces the upper rock faces. Both colours share the exact same
    // boundary; there is no second skin for the depth buffer to alternate with.
    for (let j = 0; j < segments; j++) {
      const a = base(j),
        c = base(j + 1),
        sa = snowline(j),
        sc = snowline(j + 1),
        tone = i % 2 ? rock : 0x567389;
      triangle(apex, sa, sc, snow);
      triangle(sa, a, c, tone);
      triangle(sa, c, sc, tone);
      triangle(new THREE.Vector3(x, 0, z), c, a, tone);
    }
    const geometry = new THREE.BufferGeometry().setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    b.add(geometry, -1);
  }
}
function frozenBowl(b: LondonBatch, radius: number, depth: number) {
  const vertices: number[] = [],
    point = (r: number, a: number) =>
      v(
        Math.cos(a) * r,
        -depth * (1 - (r * r) / (radius * radius)),
        Math.sin(a) * r,
      ),
    push = (
      a: ReturnType<typeof v>,
      c: ReturnType<typeof v>,
      d: ReturnType<typeof v>,
    ) => vertices.push(a.x, a.y, a.z, c.x, c.y, c.z, d.x, d.y, d.z);
  for (let ring = 0; ring < 12; ring++)
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * Math.PI * 2,
        c = ((i + 1) / 64) * Math.PI * 2,
        r0 = 1.5 + ((radius - 1.5) * ring) / 12,
        r1 = 1.5 + ((radius - 1.5) * (ring + 1)) / 12;
      push(point(r0, a), point(r1, a), point(r1, c));
      push(point(r0, a), point(r1, c), point(r0, c));
    }
  const geo = new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geo.computeVertexNormals();
  b.add(geo, ice);
  b.ring(radius, 0.14, 0, 0, 0, snow, true);
}
export function createNorwayModel(
  obj: LevelObjectData,
  quality = "medium",
): { group: THREE.Group; meshes: THREE.Mesh[] } | null {
  const aurora=createAuroraModel(obj,quality);if(aurora)return aurora;
  const oslo = createOsloModel(obj, quality);
  if (oslo) return oslo;
  const fjord = createFjordModel(obj, quality);
  if (fjord) return fjord;
  const type = String(obj.properties?.subType ?? "");
  if (!type.startsWith("norway_")) return null;
  const kind = type.slice(7),
    p = obj.properties ?? {};
  if (kind === "path") {
    const model = createKyotoModel(
      {
        ...obj,
        properties: {
          ...p,
          subType: "kyoto_path",
          surfaceColor: p.wood ? 0x99836c : p.snow ? snow : 0xd2e5ee,
          surfaceAltColor: p.wood ? 0x85705c : p.snow ? 0xe0edf4 : 0xbcd5e2,
          edgeColor: ice,
          sideColor: dark,
        },
      },
      quality,
    )!;
    model.group.name = "norway-path";
    model.group.userData.neonSurface = obj.id;
    model.group.userData.neonPath = true;
    return model;
  }
  const group = new THREE.Group(),
    b = new LondonBatch();
  switch (kind) {
    case "mountain":
      mountain(b, Number(p.seed ?? 0));
      break;
    case "glacier":
      for (let i = 0; i < 14; i++) {
        const h = 12 + Math.sin(i * 2.13) * 5,
          x = ((i % 7) - 3) * 5,
          z = Math.floor(i / 7) * 7;
        b.add(
          new THREE.CylinderGeometry(2.1, 3.5, h, 5),
          i % 2 ? ice : blue,
          v(x, h / 2, z),
          v(0.1 * Math.sin(i), i * 0.7, 0.06 * Math.cos(i)),
        );
        b.add(new THREE.ConeGeometry(2.4, 3.4, 5), snow, v(x, h + 1.5, z));
      }
      break;
    case "trolltunga":
      b.add(new THREE.CylinderGeometry(10, 17, 38, 7), rock, v(-4, 19, 0));
      b.add(
        new THREE.BoxGeometry(31, 2.5, 7.5),
        rock,
        v(9, 37, 0),
        v(0, 0, 0.035),
      );
      b.add(
        new THREE.BoxGeometry(30, 0.25, 7.3),
        snow,
        v(9, 38.4, 0),
        v(0, 0, 0.035),
      );
      break;
    case "pulpit":
      b.add(
        new THREE.CylinderGeometry(11, 15, 43, 4),
        rock,
        v(0, 21.5, 0),
        v(0, Math.PI / 4, 0),
      );
      b.box(16, 0.3, 16, 0, 43.1, 0, snow);
      for (let i = 0; i < 5; i++)
        b.box(0.16, 22 + i * 3, 0.12, -6 + i * 3, 14, 8.02, dark);
      break;
    case "cabin":
    case "rorbu":
      cabin(b, group, kind === "rorbu");
      break;
    case "pine":
      b.add(new THREE.CylinderGeometry(3.1, 0.7, 7, 7), rock, v(0, -3.7, 0));
      b.cylinder(3.15, 0.17, 0, -0.11, 0, snow, "solid", 7);
      b.cylinder(0.24, 3, 0, 1.5, 0, wood);
      for (let i = 0; i < 4; i++) {
        const r = 2.7 - i * 0.5,
          y = 3 + i * 1.5;
        b.add(new THREE.ConeGeometry(r, 3.5, 9), 0x35575a, v(0, y, 0));
        b.add(new THREE.ConeGeometry(r * 0.88, 2.5, 9), snow, v(0, y + 0.6, 0));
      }
      break;
    case "cairn":
      for (let i = 0; i < 5; i++)
        b.ball(
          0,
          0.24 + i * 0.34,
          0,
          0.7 - i * 0.1,
          0.25,
          0.55 - i * 0.07,
          rock,
        );
      b.box(0.8, 0.1, 0.7, 0, 1.82, 0, snow);
      break;
    case "lantern":
      b.cylinder(0.08, 3.5, 0, 1.75, 0, dark);
      b.box(0.6, 0.8, 0.6, 0, 3.4, 0, warm, "glow");
      b.add(new THREE.ConeGeometry(0.6, 0.45, 4), snow, v(0, 4, 0));
      break;
    case "crystals":
      for (let i = 0; i < 7; i++) {
        const a = i * 2.399,
          r = i === 0 ? 0 : 1.3;
        b.add(
          new THREE.CylinderGeometry(0.4, 0.7, 2.4 + (i % 3), 5),
          i % 2 ? ice : 0xcce7ed,
          v(Math.cos(a) * r, 1.2 + (i % 3) * 0.5, Math.sin(a) * r),
          v(0.14 * Math.sin(a), a, 0.14 * Math.cos(a)),
        );
      }
      break;
    case "cave":
      for (const side of [-1, 1]) {
        b.ball(side * 6, 5, 0, 4.1, 7, 5, rock);
        b.ball(side * 4, 10, 0, 4.3, 3.5, 5, snow);
      }
      b.ball(0, 12, 0, 5, 3, 5, rock);
      for (let i = 0; i < 7; i++)
        b.add(
          new THREE.ConeGeometry(0.25, 2 + (i % 3) * 0.6, 6),
          ice,
          v(-4.5 + i * 1.5, 9, 2),
          v(Math.PI, 0, 0),
        );
      break;
    case "troll":
      b.ball(0, 6, 0, 4.5, 6, 3, rock);
      b.ball(0, 13, 0, 3.7, 3.8, 3.1, rock);
      b.ball(0, 12.5, 3.2, 1, 1, 1.8, rock);
      for (const side of [-1, 1]) {
        b.ball(side * 4.4, 5.8, 0, 1.3, 4, 1.7, rock);
        b.ball(side * 1.5, 13.6, 2.85, 0.45, 0.3, 0.15, warm, "glow");
        b.add(
          new THREE.BoxGeometry(1.9, 0.45, 0.7),
          snow,
          v(side * 1.5, 14.3, 2.8),
          v(0, 0, -side * 0.2),
        );
        b.ball(side * 2.8, 15, 0, 1.4, 1.2, 2, snow);
      }
      break;
    case "fjord":
      b.add(
        new THREE.PlaneGeometry(160, 160),
        0x315b78,
        v(0, 0, 0),
        v(-Math.PI / 2, 0, 0),
      );
      for (let i = 0; i < 18; i++) {
        const a = i * 2.399,
          r = 25 + i * 2.2;
        b.add(
          new THREE.CylinderGeometry(1.8, 3, 1, 5),
          i % 2 ? ice : snow,
          v(Math.cos(a) * r, 0.18, Math.sin(a) * r),
        );
      }
      break;
    case "ice_column": {
      const r = Number(p.radius ?? 10),
        h = Number(p.height ?? 40);
      b.cylinder(r, h, 0, h / 2, 0, blue, "solid", 32);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        b.box(
          0.13,
          h,
          0.13,
          Math.cos(a) * (r + 0.02),
          h / 2,
          Math.sin(a) * (r + 0.02),
          ice,
        );
      }
      break;
    }
    case "disc": {
      const r = Number(p.radius ?? 6);
      b.cylinder(r, 0.65, 0, -0.325, 0, ice, "solid", 48);
      b.cylinder(r - 0.12, 0.08, 0, 0.04, 0, snow, "solid", 48);
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        b.box(
          0.08,
          0.025,
          r * 0.4,
          Math.sin(a) * r * 0.55,
          0.09,
          Math.cos(a) * r * 0.55,
          0xa9cadc,
        );
      }
      break;
    }
    case "funnel":
      frozenBowl(b, Number(p.radius ?? 15), Number(p.depth ?? 10));
      break;
    case "tile": {
      const w = Number(p.width ?? 3.4),
        d = Number(p.depth ?? 2.5);
      b.box(w, 0.42, d, 0, -0.21, 0, p.norwayAction ? blue : rock);
      b.box(w - 0.1, 0.04, d - 0.1, 0, 0.02, 0, p.norwayAction ? ice : snow);
      for (const x of [-w / 2 + 0.2, w / 2 - 0.2])
        b.box(0.13, 0.03, d - 0.2, x, 0.055, 0, warm);
      break;
    }
    case "snowball": {
      const r = Number(p.size ?? 1.4);
      b.add(new THREE.IcosahedronGeometry(r, quality === "low" ? 1 : 2), snow);
      for (let i = 0; i < 5; i++) {
        const a = i * 2.399;
        b.ball(
          Math.cos(a) * r * 0.75,
          Math.sin(a) * r * 0.3,
          Math.sin(a) * r * 0.75,
          r * 0.28,
          r * 0.3,
          r * 0.28,
          ice,
        );
      }
      break;
    }
    case "tower":
    case "swing_arc": {
      const r = Number(p.radius ?? 11),
        h = kind === "tower" ? Number(p.height ?? 48) : 0,
        width = Number(p.width ?? 2.4),
        turn =
          kind === "tower" ? Math.PI * 2 * Number(p.turns ?? 4) : Math.PI * 1.5,
        points = norwayArc(0, 0, r, Math.PI, turn, 0, h),
        road = createKyotoModel(
          {
            ...obj,
            position: v(0, 0, 0),
            rotation: v(0, 0, 0),
            scale: v(1, 1, 1),
            properties: {
              subType: "kyoto_path",
              ...norwayPath(points, width, false),
              surfaceColor: snow,
              surfaceAltColor: 0xc5dce9,
              sideColor: dark,
              edgeColor: ice,
              rails: true,
            },
          },
          quality,
        )!;
      for (const mesh of road.meshes) {
        b.add(mesh.geometry.clone(), -1);
        mesh.geometry.dispose();
        for (const material of Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material])
          material.dispose();
      }
      if (kind === "tower") {
        b.cylinder(r - width / 2 - 0.12, h, 0, h / 2, 0, blue, "solid", 48);
        b.cylinder(
          r - width / 2 - 0.12,
          0.3,
          0,
          h - 0.15,
          0,
          snow,
          "solid",
          48,
        );
      } else
        for (let i = 0; i < 8; i++) {
          const a = Math.PI + (i / 7) * turn;
          b.add(
            new THREE.ConeGeometry(0.35, 2.5, 5),
            ice,
            v(Math.cos(a) * (r + 0.7), -1.4, Math.sin(a) * (r + 0.7)),
            v(Math.PI, 0, 0),
          );
        }
      break;
    }
    case "boost": {
      const w = Number(p.width ?? 3),
        length = Number(p.length ?? 3);
      b.box(length, 0.04, w, 0, 0.025, 0, 0x7399ac);
      for (let i = 0; i < 3; i++) {
        for (const side of [-1, 1])
          b.add(
            new THREE.BoxGeometry(0.12, 0.025, w * 0.38),
            warm,
            v(-0.7 + i * 0.65, 0.06, side * w * 0.15),
            v(0, side * -0.55, 0),
            "glow",
          );
      }
      break;
    }
    default:
      return null;
  }
  const meshes = b.finish(group);
  group.name = `norway-${kind}`;
  group.position.copy(obj.position);
  group.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
  group.scale.copy(obj.scale);
  group.traverse((node) => {
    if (!(node instanceof THREE.Mesh)) return;
    node.castShadow = p.hasCollision === true;
    node.receiveShadow = true;
    if (p.hasCollision !== true) node.userData.graphicsNoShadow = true;
    if (node.name === "london-glow") {
      const old = node.material;
      node.material = new THREE.MeshBasicMaterial({
        vertexColors: true,
        toneMapped: false,
      });
      for (const material of Array.isArray(old) ? old : [old])
        material.dispose();
    }
  });
  previewNorwayModel(obj, group, 0);
  group.updateMatrixWorld(true);
  return { group, meshes };
}
export function previewNorwayModel(
  obj: LevelObjectData,
  group: THREE.Object3D,
  time: number,
): boolean {
  if(previewAuroraModel(obj,group,time))return true;
  if (previewOsloModel(obj, group, time)) return true;
  if (previewFjordModel(obj, group, time)) return true;
  const p = obj.properties ?? {},
    type = String(p.subType ?? "");
  if (!type.startsWith("norway_") && !p.norwayGoal) return false;
  if (p.norwayAction === "spin")
    group.rotation.y = obj.rotation.y + time * Number(p.speed ?? 0.42);
  if (p.norwayAction === "flip")
    group.rotation.z =
      obj.rotation.z +
      norwayTileAngle(time, Number(p.index ?? 0), Number(p.speed ?? 1));
  if (p.norwayAction === "orbit") {
    const a = time * Number(p.speed ?? 1.5),
      r = Number(p.radius ?? 10);
    group.position.set(
      obj.position.x + Math.cos(a) * r,
      obj.position.y + Number(p.size ?? 1.4),
      obj.position.z + Math.sin(a) * r,
    );
    group.rotation.z = -time * 2;
  }
  if (p.norwayAction === "avalanche") {
    group.position.z =
      obj.position.z +
      Math.sin(time * Number(p.speed ?? 1) + Number(p.index ?? 0) * 1.8) * 13;
    group.rotation.x = time * 3;
  }
  return true;
}

