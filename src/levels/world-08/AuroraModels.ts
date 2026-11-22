import * as THREE from "three";
import type { LevelObjectData } from "../LevelTypes";
import { LondonBatch } from "../world-06/LondonModels";
import { auroraPendulumAngle } from "./AuroraRoutes";
import { v } from "./NorwayRoutes";
const snow = 0xe9f7ff,
  ice = 0x88cde0,
  dark = 0x263f59,
  mint = 0x71efc5,
  violet = 0xb49fee;
function animal(b: LondonBatch, x: number, z: number, reindeer: boolean) {
  const fur = reindeer ? 0xa68b79 : 0x65788a;
  b.ball(x, 2, z, 1.6, 0.9, 0.65, fur);
  b.ball(x + 1.5, 2.6, z, 0.65, 0.75, 0.55, fur);
  b.ball(x + 1.97, 2.58, z + 0.1, 0.22, 0.24, 0.28, dark);
  for (const dx of [-1, 1])
    for (const dz of [-0.45, 0.45])
      b.box(0.22, 1.4, 0.22, x + dx, 0.8, z + dz, fur);
  for (const dz of [-0.38, 0.38]) {
    if (reindeer) {
      b.box(0.13, 1.6, 0.13, x + 1.4, 3.8, z + dz, fur);
    } else
      b.add(
        new THREE.ConeGeometry(0.27, 0.7, 4),
        snow,
        v(x + 1.5, 3.35, z + dz),
      );
    if (reindeer)
      for (const s of [-1, 1])
        b.add(
          new THREE.BoxGeometry(0.13, 0.85, 0.13),
          fur,
          v(x + 1.4 + s * 0.25, 4, z + dz),
          v(0, 0, s * 0.6),
        );
  }
}
function ribbonGeometry(index: number): THREE.BufferGeometry {
  const positions: number[] = [],
    colors: number[] = [],
    c = new THREE.Color(),
    green = new THREE.Color(index % 2 ? 0x5bdfbd : 0x71f6b4),
    purple = new THREE.Color(0xb092ef);
  const sample = (t: number, h: number) =>
    v(
      -180 + 360 * t,
      26 * Math.sin(t * 9 + index) + h * 46,
      18 * Math.sin(t * 11 + index * 2) + h * 3 * Math.sin(t * 23),
    );
  // Alpha fades at all four edges; narrow vertical rays avoid a flat sheet silhouette.
  for (let i = 0; i < 72; i++)
    for (let row = 0; row < 6; row++) {
      const t = i / 72,
        u = (i + 1) / 72,
        h = row / 6,
        k = (row + 1) / 6;
      for (const [s, height] of [
        [t, h],
        [u, h],
        [t, k],
        [u, h],
        [u, k],
        [t, k],
      ]) {
        const p = sample(s, height);
        positions.push(p.x, p.y, p.z);
        c.copy(green).lerp(purple, height * 0.8);
        const ray = 0.6 + 0.4 * Math.sin(s * 220 + index) ** 2,
          alpha =
            Math.pow(Math.sin(Math.PI * height), 1.3) *
            Math.pow(Math.sin(Math.PI * s), 0.6) *
            ray;
        colors.push(c.r, c.g, c.b, alpha);
      }
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 4));
  g.computeVertexNormals();
  return g;
}
export function createAuroraModel(
  obj: LevelObjectData,
  _quality = "medium",
): { group: THREE.Group; meshes: THREE.Mesh[] } | null {
  const p = obj.properties ?? {},
    type = String(p.subType ?? "");
  if (!type.startsWith("aurora_")) return null;
  const kind = type.slice(7),
    group = new THREE.Group(),
    b = new LondonBatch();
  switch (kind) {
    case "scraper": {
      const width = Number(p.width ?? 8),
        shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(6, 0);
      shape.lineTo(22, -12);
      shape.lineTo(25, -12);
      shape.lineTo(25, -44);
      shape.lineTo(0, -44);
      shape.closePath();
      b.add(
        new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: false }),
        ice,
        v(0, 0, -width / 2),
      );
      // Flush edge marks, raised enough to avoid depth conflicts with the ramp surface.
      for (const z of [-width / 2, width / 2])
        b.add(
          new THREE.BoxGeometry(20, 0.1, 0.12),
          mint,
          v(14, -5.96, z),
          v(0, 0, -Math.atan2(12, 16)),
        );
      break;
    }
    case "gear": {
      const r = Number(p.radius ?? 12),
        w = Number(p.width ?? 2.2),
        shape = new THREE.Shape();
      // One watertight toothed annulus. No coplanar teeth or duplicate ice skins.
      const n = 12;
      for (let i = 0; i < n * 4; i++) {
        const a = (i / (n * 4)) * Math.PI * 2,
          rr = r + (i % 4 === 1 || i % 4 === 2 ? 1 : 0);
        if (i === 0) shape.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
        else shape.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      shape.closePath();
      const hole = new THREE.Path();
      hole.absarc(0, 0, r - w, 0, Math.PI * 2, true);
      shape.holes.push(hole);
      b.add(
        new THREE.ExtrudeGeometry(shape, {
          depth: 0.55,
          bevelEnabled: false,
          curveSegments: 48,
        }),
        ice,
        v(0, 0, 0),
        v(Math.PI / 2, 0, 0),
      );
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        b.add(
          new THREE.BoxGeometry(0.15, 0.05, w * 0.6),
          mint,
          v(Math.cos(a) * (r - w / 2), 0.035, Math.sin(a) * (r - w / 2)),
          v(0, -a + Math.PI / 2, 0),
        );
      }
      break;
    }
    case "bypass": {
      const length = Number(p.length ?? 14),
        r = Number(p.radius ?? 5);
      b.box(length, 0.5, 3.6, 0, -r - 0.25, 0, snow);
      for (const z of [-1.8, 1.8])
        b.box(length, 0.14, 0.12, 0, -r + 0.07, z, mint);
      const frame = new THREE.Group(),
        rings = new LondonBatch();
      frame.name = "bypass-frame";
      for (const x of [-length / 2 + 0.15, length / 2 - 0.15])
        rings.add(
          new THREE.TorusGeometry(r, 0.09, 5, 56),
          mint,
          v(x, 0, 0),
          v(0, Math.PI / 2, 0),
        );
      rings.finish(frame);
      group.add(frame);
      break;
    }
    case "pendulum": {
      const length = Number(p.length ?? 64),
        offset = Number(p.offset ?? 4);
      b.box(length, 0.45, 1.9, 0, -offset - 0.225, 0, snow);
      for (const z of [-0.94, 0.94])
        b.box(length, 0.1, 0.08, 0, -offset + 0.05, z, mint);
      // The middle arm obstructs the transfer: switch before or after it.
      b.box(1, offset, 0.42, 0, -offset / 2, 0, dark);
      b.cylinder(0.55, 1.8, 0, 0.15, 0, violet);
      break;
    }
    case "wall":
      b.box(0.55, 4, 3.8, 0, 2, 0, ice);
      b.box(0.6, 0.16, 3.9, 0, 4.08, 0, mint);
      break;
    case "ribbons": {
      for (let i = 0; i < 3; i++) {
        const mesh = new THREE.Mesh(
          ribbonGeometry(i),
          new THREE.MeshBasicMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.72,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        );
        mesh.name = `boreal-${i}`;
        mesh.position.set(0, i * 15, -i * 32);
        mesh.renderOrder = -2;
        group.add(mesh);
      }
      const stars: number[] = [];
      for (let i = 0; i < 110; i++) {
        const a = i * 2.39996;
        stars.push(
          Math.cos(a) * (90 + i * 0.9),
          40 + (i % 13) * 6,
          -90 - Math.sin(a) * 50,
        );
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(stars, 3));
      group.add(
        new THREE.Points(
          g,
          new THREE.PointsMaterial({
            color: 0xd7efff,
            size: 0.7,
            sizeAttenuation: true,
            depthWrite: false,
          }),
        ),
      );
      break;
    }
    case "tundra":
    case "lake": {
      b.add(new THREE.CylinderGeometry(34, 27, 10, 32), dark, v(0, -5, 0));
      b.cylinder(
        34,
        0.3,
        0,
        0.03,
        0,
        kind === "lake" ? 0x91cbd8 : snow,
        "solid",
        48,
      );
      for (let i = 0; i < 9; i++) {
        const a = i * 2.4;
        b.add(
          new THREE.ConeGeometry(3 + (i % 3), 5, 6),
          snow,
          v(Math.cos(a) * 27, 2, Math.sin(a) * 27),
        );
      }
      if (kind === "lake")
        for (let i = 0; i < 5; i++)
          b.add(
            new THREE.BoxGeometry(9, 0.04, 0.07),
            snow,
            v(-15 + i * 7, 0.21, (i % 2) * 9 - 4),
            v(0, i * 0.8, 0),
          );
      break;
    }
    case "sled": {
      b.add(new THREE.CylinderGeometry(18, 14, 5, 12), snow, v(5, -2.5, 0));
      for (const z of [-1.4, 1.4]) b.box(8, 0.22, 0.22, 0, 0.2, z, dark);
      b.box(6, 0.3, 2.6, 0, 1.1, 0, 0xc18967);
      b.box(0.4, 2.4, 2.7, -2.7, 2, 0, 0x8a5555);
      for (let i = 0; i < 4; i++) {
        const x = 7 + Math.floor(i / 2) * 5,
          z = i % 2 ? 2 : -2;
        animal(b, x, z, false);
        b.add(new THREE.BoxGeometry(5, 0.08, 0.08), mint, v(x - 3, 1.6, z));
      }
      break;
    }
    case "hotel": {
      b.box(44, 2, 24, 0, -1, 0, dark);
      for (let i = 0; i < 5; i++) {
        const x = -16 + i * 8;
        b.box(7.8, 9, 18, x, 4.5, 0, i % 2 ? ice : 0xb1e3ed);
        b.add(
          new THREE.ConeGeometry(6.2, 5, 4),
          snow,
          v(x, 11, 0),
          v(0, Math.PI / 4, 0),
        );
        b.box(3, 4, 0.14, x, 2, -9.08, mint);
      }
      for (const x of [-22, 22]) b.cylinder(3, 15, x, 7.5, 0, ice);
      break;
    }
    case "reindeer":
      b.add(new THREE.CylinderGeometry(17, 12, 6, 12), snow, v(0, -3, 4));
      for (let i = 0; i < 7; i++)
        animal(b, (i % 3) * 6 - 6, Math.floor(i / 3) * 5, true);
      break;
    case "snowmobile": {
      b.add(new THREE.CylinderGeometry(18, 14, 5, 12), snow, v(8, -2.5, 0));
      for (let i = 0; i < 3; i++) {
        const x = i * 8;
        for (const z of [-1.1, 1.1]) b.box(4, 0.2, 0.22, x, 0.3, z, dark);
        b.ball(x, 1, 0, 2.1, 0.7, 1, i % 2 ? mint : violet);
        b.box(2, 0.25, 1, x - 0.5, 1.8, 0, dark);
        b.add(
          new THREE.BoxGeometry(0.1, 0.8, 1.8),
          ice,
          v(x + 1, 2, 0),
          v(0, 0, -0.5),
        );
      }
      break;
    }
    case "cape": {
      b.add(new THREE.CylinderGeometry(22, 28, 40, 9), dark, v(0, -20, 0));
      b.cylinder(22, 0.4, 0, 0.1, 0, snow, "solid", 9);
      for (const x of [-2, 2]) b.box(0.35, 7, 0.35, x, 3.5, 0, ice);
      for (const a of [0, Math.PI / 3, (Math.PI * 2) / 3])
        b.add(
          new THREE.TorusGeometry(4.2, 0.12, 6, 48),
          mint,
          v(0, 8, 0),
          v(0, a, 0),
        );
      for (let i = 1; i < 4; i++)
        b.ring(
          4.2 * Math.sin((i * Math.PI) / 4),
          0.08,
          0,
          8 + 4.2 * Math.cos((i * Math.PI) / 4),
          0,
          mint,
          true,
        );
      break;
    }
    default:
      return null;
  }
  const meshes = b.finish(group);
  group.traverse((n) => {
    if (n instanceof THREE.Mesh) {
      n.castShadow = p.hasCollision === true;
      n.receiveShadow = true;
      if (!p.hasCollision) n.userData.graphicsNoShadow = true;
    }
  });
  group.position.copy(obj.position);
  group.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
  group.scale.copy(obj.scale);
  group.name = `aurora-${kind}`;
  previewAuroraModel(obj, group, 0);
  group.updateMatrixWorld(true);
  return { group, meshes };
}
export function previewAuroraModel(
  obj: LevelObjectData,
  group: THREE.Object3D,
  time: number,
): boolean {
  const p = obj.properties ?? {};
  if (!String(p.subType ?? "").startsWith("aurora_")) return false;
  const speed = Number(p.speed ?? 0.5),
    index = Number(p.index ?? 0);
  if (p.norwayAction === "spin")
    group.rotation.y = obj.rotation.y + time * speed;
  if (p.norwayAction === "bypass") {
    const r = Number(p.radius ?? 5),
      a = time * speed + index * 0.55,
      dy = r * (1 - Math.cos(a)),
      dz = r * Math.sin(a);
    group.position.y = obj.position.y + dy;
    group.position.z = obj.position.z + dz;
    // The carriage orbits upright inside a fixed hoop, including the upper half.
    group.getObjectByName("bypass-frame")?.position.set(0, -dy, -dz);
  }
  if (p.norwayAction === "pendulum")
    group.rotation.x = obj.rotation.x + auroraPendulumAngle(time, index, speed);
  if (p.norwayAction === "wall")
    group.position.z =
      obj.position.z +
      Math.sin(time * speed + index * 1.1) * Number(p.amplitude ?? 4);
  if (p.norwayAction === "aurora")
    for (let i = 0; i < 3; i++) {
      const ribbon = group.getObjectByName(`boreal-${i}`);
      if (ribbon) {
        ribbon.position.y = i * 15 + Math.sin(time * 0.17 + i) * 3;
        ribbon.rotation.y = Math.sin(time * 0.08 + i) * 0.035;
      }
    }
  return true;
}
