import * as THREE from "three";
import type { LevelObjectData } from "../LevelTypes";
import { LondonBatch } from "../world-06/LondonModels";
import { fjordLoopPoint, fjordMotion } from "./FjordRoutes";
import { v } from "./NorwayRoutes";
const snow = 0xe9f3f5,
  ice = 0x91cad7,
  rock = 0x405b6b,
  wood = 0x806654,
  navy = 0x213b50,
  warm = 0xf0d1a1;
/** Closed ribbon solid; shared topology gives coplanar faces one owner. */
function shell(
  b: LondonBatch,
  point: (u: number, t: number, outer: boolean) => THREE.Vector3,
  nu: number,
  nt: number,
  colour: number,
) {
  const vertices: number[] = [];
  const quad = (
    a: THREE.Vector3,
    c: THREE.Vector3,
    d: THREE.Vector3,
    e: THREE.Vector3,
  ) =>
    vertices.push(
      ...a.toArray(),
      ...c.toArray(),
      ...d.toArray(),
      ...a.toArray(),
      ...d.toArray(),
      ...e.toArray(),
    );
  for (let i = 0; i < nu; i++)
    for (let j = 0; j < nt; j++)
      for (const outer of [false, true]) {
        const a = point(i / nu, j / nt, outer),
          c = point((i + 1) / nu, j / nt, outer),
          d = point((i + 1) / nu, (j + 1) / nt, outer),
          e = point(i / nu, (j + 1) / nt, outer);
        if (outer) quad(e, d, c, a);
        else quad(a, c, d, e);
      }
  for (let i = 0; i < nu; i++)
    for (const edge of [0, 1])
      quad(
        point(i / nu, edge, false),
        point((i + 1) / nu, edge, false),
        point((i + 1) / nu, edge, true),
        point(i / nu, edge, true),
      );
  for (let j = 0; j < nt; j++)
    for (const end of [0, 1])
      quad(
        point(end, j / nt, false),
        point(end, (j + 1) / nt, false),
        point(end, (j + 1) / nt, true),
        point(end, j / nt, true),
      );
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  g.computeVertexNormals();
  b.add(g, colour);
}
export function createFjordModel(obj: LevelObjectData, _quality = "medium") {
  const p = obj.properties ?? {},
    type = String(p.subType ?? "");
  if (!type.startsWith("fjord_")) return null;
  const kind = type.slice(6),
    b = new LondonBatch(),
    group = new THREE.Group();
  switch (kind) {
    case "loop": {
      const r = Number(p.radius ?? 12),
        w = Number(p.width ?? 3),
        drift = Number(p.drift ?? 6);
      shell(
        b,
        (u, t, outer) => {
          const a = u * Math.PI * 2,
            q = fjordLoopPoint(a, r + (outer ? 0.4 : 0), drift);
          return new THREE.Vector3(q.x, q.y, q.z + (t - 0.5) * w);
        },
        192,
        1,
        ice,
      );
      // Narrow contrasting edge strips follow the surface without overlapping it.
      for (const side of [-1, 1])
        shell(
          b,
          (u, t, outer) => {
            const q = fjordLoopPoint(
              u * Math.PI * 2,
              r + (outer ? 0.42 : -0.7),
              drift,
            );
            return new THREE.Vector3(
              q.x,
              q.y,
              q.z + side * (w / 2 + 0.06) + (t - 0.5) * 0.12,
            );
          },
          192,
          1,
          navy,
        );
      break;
    }
    case "pipe": {
      const r = Number(p.radius ?? 6),
        length = Number(p.length ?? 22),
        steps = Number(p.steps ?? 0),
        gaps = Boolean(p.gaps);
      const panels = gaps ? 4 : 1;
      for (let panel = 0; panel < panels; panel++) {
        const a = -length / 2 + (panel * length) / panels,
          span = length / panels - (gaps ? 0.65 : 0);
        shell(
          b,
          (u, t, outer) => {
            const theta = ((t - 0.5) * Math.PI * 4) / 3,
              rr = r + (outer ? 0.35 : 0);
            return new THREE.Vector3(
              a + u * span,
              -Math.cos(theta) * rr,
              Math.sin(theta) * rr,
            );
          },
          1,
          64,
          ice,
        );
      }
      for (let i = 0; i < steps; i++)
        b.box(
          0.65,
          0.16 + i * 0.06,
          r * 0.95,
          -length * 0.3 + i * length * 0.25,
          -r + 0.06 + i * 0.03,
          0,
          wood,
        );
      if (gaps)
        for (let i = 1; i < 4; i++)
          b.box(
            1,
            0.2,
            1.6,
            -length / 2 + (i * length) / 4 - 0.3,
            -r - 0.05,
            0,
            wood,
          );
      for (const x of [-length / 2, length / 2])
        b.add(
          new THREE.TorusGeometry(r + 0.18, 0.12, 6, 48, (Math.PI * 4) / 3),
          navy,
          v(x, 0, 0),
          v(0, Math.PI / 2, -Math.PI / 6),
        );
      break;
    }
    case "shifter":
    case "stair":
    case "roll": {
      const length = Number(p.length ?? 4),
        width = Number(p.width ?? 3),
        depth = Number(p.depth ?? 0.5);
      b.box(
        length,
        depth,
        width,
        0,
        -depth / 2,
        0,
        kind === "shifter" ? ice : wood,
      );
      // Inlaid planks are separate spans rather than coincident full-size plates.
      for (let i = 0; i < Math.ceil(length); i++)
        b.box(0.04, 0.018, width - 0.12, -length / 2 + 0.2 + i, 0.014, 0, navy);
      for (const z of [-width / 2, width / 2])
        b.box(length, 0.07, 0.07, 0, 0.035, z, snow);
      if (kind === "roll" && p.wall)
        b.box(
          0.3,
          1.4,
          width * 0.25,
          0,
          0.7,
          width * 0.375 * Number(p.wall),
          ice,
        );
      break;
    }
    case "pontoon": {
      const r = Number(p.radius ?? 2),
        height = Number(p.height ?? 6);
      b.cylinder(r, height, 0, -height / 2, 0, rock, "solid", 24);
      b.cylinder(r, 0.08, 0, 0.04, 0, snow, "solid", 24);
      b.ring(r * 0.82, 0.05, 0, 0.09, 0, ice, true);
      break;
    }
    case "jump": {
      const length = Number(p.length ?? 2),
        width = Number(p.width ?? 1.5);
      b.box(length, 0.025, width, 0, 0.018, 0, ice);
      for (let i = 0; i < 3; i++)
        b.box(
          0.12,
          0.025,
          width * 0.75,
          -length * 0.3 + i * length * 0.3,
          0.043,
          0,
          warm,
          "glow",
        );
      break;
    }
    case "cliff":
    case "waterfalls": {
      const count = kind === "waterfalls" ? 7 : 5;
      for (let i = 0; i < count; i++) {
        const x = (i - (count - 1) / 2) * 8,
          h = 48 + (i % 3) * 9;
        b.add(new THREE.CylinderGeometry(7, 10, h, 6), rock, v(x, h / 2, 0));
        b.cylinder(7, 0.5, x, h + 0.25, 0, snow, "solid", 6);
        if (kind === "waterfalls") {
          b.box(1.1, h - 3, 0.16, x, (h - 3) / 2, 8.1, 0xa9e8ed, "water");
          for (let j = 0; j < 8; j++)
            b.box(
              0.5,
              0.8,
              0.025,
              x,
              ((j + 0.3) * (h - 3)) / 8,
              8.2,
              0xe7fbff,
              "foam",
            );
          b.ball(x, 0.5, 8.2, 2.1, 0.35, 1.6, snow, "water");
        }
      }
      break;
    }
    case "kayak": {
      b.ball(0, 0.4, 0, 4, 0.6, 0.8, 0xd4a15d);
      b.ball(0, 0.8, 0, 1, 0.25, 0.6, navy);
      b.ball(0, 1.25, 0, 0.45, 0.7, 0.4, 0x659aab);
      b.ball(0, 2.1, 0, 0.35, 0.35, 0.35, warm);
      b.add(
        new THREE.BoxGeometry(0.1, 0.1, 5),
        wood,
        v(0, 1.5, 0),
        v(0.15, 0.4, 0.2),
      );
      break;
    }
    case "longship": {
      for (let i = 0; i < 7; i++) {
        const x = (i - 3) * 3,
          r = 1 - Math.pow(Math.abs(x) / 12, 2) * 0.65;
        b.ball(x, 1, 0, 2, 1.8 * r, 3 * r, wood);
      }
      b.box(16, 0.25, 4, 0, 2.05, 0, 0x9b8060);
      b.cylinder(0.18, 14, 0, 9, 0, wood);
      b.add(new THREE.PlaneGeometry(10, 8, 8, 1), 0xad5b5d, v(0, 10, 0.1));
      for (let i = 0; i < 5; i++)
        b.box(0.85, 8, 0.04, -4 + i * 2, 10, 0.14, snow);
      for (const side of [-1, 1])
        for (let i = 0; i < 6; i++) {
          b.add(
            new THREE.CylinderGeometry(0.7, 0.7, 0.2, 12),
            i % 2 ? navy : 0xad5b5d,
            v(-7.5 + i * 3, 2.2, side * 2.8),
            v(Math.PI / 2, 0, 0),
          );
          b.add(
            new THREE.BoxGeometry(0.12, 0.12, 5),
            wood,
            v(-7.5 + i * 3, 1, side * 4),
            v(0, side * 0.35, side * 0.2),
          );
        }
      b.ball(11, 3, 0, 1, 2, 0.7, wood);
      b.ball(11.5, 5, 0, 1.2, 0.7, 0.6, wood);
      break;
    }
    case "pier": {
      b.box(24, 0.4, 5, 0, 3, 0, wood);
      for (let i = 0; i < 20; i++)
        b.box(0.055, 0.025, 4.9, -11.5 + i * 1.2, 3.22, 0, navy);
      for (const x of [-10, -5, 0, 5, 10])
        for (const z of [-1.8, 1.8]) b.cylinder(0.2, 10, x, -1, z, wood);
      for (const x of [-10, 0, 10]) b.box(0.35, 1, 0.35, x, 3.8, 2, navy);
      break;
    }
    case "whale": {
      b.ball(0, 0, 0, 9, 2.7, 3, navy);
      b.ball(-3, -0.8, 0, 5, 1.7, 2.6, 0x7ca0af);
      for (const side of [-1, 1]) {
        b.add(
          new THREE.ConeGeometry(2, 6, 4),
          navy,
          v(9, 0.5, side * 1.6),
          v(side * 0.7, 0, Math.PI / 2),
        );
        b.add(
          new THREE.ConeGeometry(1, 5, 4),
          navy,
          v(-1, -0.3, side * 3),
          v(side * 0.8, 0, 0.5),
        );
      }
      b.ball(-6, 0.7, 2.3, 0.16, 0.16, 0.1, snow);
      const spout = new THREE.Group();
      spout.name = "fjord-spout";
      const spray = new LondonBatch();
      spray.add(new THREE.ConeGeometry(0.5, 8, 8), ice, v(-5, 6, 0));
      for (const side of [-1, 1])
        spray.ball(-5, 10, side * 1.1, 1.2, 0.4, 1.7, snow);
      spray.finish(spout);
      group.add(spout);
      break;
    }
    default:
      return null;
  }
  const meshes = b.finish(group);
  group.name = `fjord-${kind}`;
  group.position.copy(obj.position);
  group.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
  group.scale.copy(obj.scale);
  group.traverse((n) => {
    if (n instanceof THREE.Mesh) {
      n.castShadow = p.hasCollision === true;
      n.receiveShadow = true;
      if (!p.hasCollision) n.userData.graphicsNoShadow = true;
    }
  });
  previewFjordModel(obj, group, 0);
  group.updateMatrixWorld(true);
  return { group, meshes };
}
export function previewFjordModel(
  obj: LevelObjectData,
  group: THREE.Object3D,
  time: number,
): boolean {
  const p = obj.properties ?? {};
  if (!String(p.subType ?? "").startsWith("fjord_")) return false;
  const action = String(p.norwayAction ?? ""),
    motion = fjordMotion(
      action,
      time,
      Number(p.index ?? 0),
      Number(p.speed ?? 1),
    );
  if (action === "slide")
    group.position.z = obj.position.z + motion * Number(p.amplitude ?? 5);
  if (action === "stairs") group.position.y = obj.position.y + motion;
  if (action === "roll" || action === "pipe")
    group.rotation.x = obj.rotation.x + motion;
  if (action === "whale") {
    const phase = (time + Number(p.index ?? 0) * 3) % 12,
      breach = phase < 5 ? Math.sin((phase / 5) * Math.PI) : 0;
    group.position.y = obj.position.y + breach * 8;
    group.rotation.z = obj.rotation.z + breach * 0.28;
    const spout = group.getObjectByName("fjord-spout");
    if (spout) {
      spout.visible = phase > 5 && phase < 8;
      spout.scale.y = 0.7 + Math.sin(time * 4) * 0.2;
    }
  }
  if (action === "waterfall")
    group.traverse((n) => {
      if (n instanceof THREE.Mesh && n.name === "london-foam")
        n.position.y = -((time * 7) % 5);
    });
  return true;
}
