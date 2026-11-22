import * as THREE from "three";
import type { LevelObjectData, Vector3Data } from "../LevelTypes";
import { LondonBatch } from "../world-06/LondonModels";
import { createFjordModel } from "./FjordModels";
import { osloFerryPose } from "./OsloRoutes";
import { v } from "./NorwayRoutes";
const snow = 0xeaf1f2,
  ice = 0x8db7c7,
  stone = 0x78909b,
  dark = 0x294557,
  wood = 0x94775c,
  warm = 0xf1ce89;
function floor(b: LondonBatch, length: number, width: number) {
  b.box(length, 0.45, width, 0, -0.225, 0, snow);
  for (const z of [-width / 2, width / 2])
    b.box(length, 0.12, 0.09, 0, 0.06, z, ice);
}
function ribbon(
  b: LondonBatch,
  points: Vector3Data[],
  width: number,
  tone = snow,
) {
  const vertices: number[] = [];
  const tri = (a: Vector3Data, c: Vector3Data, d: Vector3Data) =>
    vertices.push(a.x, a.y, a.z, c.x, c.y, c.z, d.x, d.y, d.z);
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1],
      c = points[i],
      p = (q: Vector3Data, s: number, dy = 0) =>
        v(q.x, q.y + dy, q.z + (s * width) / 2);
    const al = p(a, -1),
      ar = p(a, 1),
      cl = p(c, -1),
      cr = p(c, 1);
    tri(al, ar, cr);
    tri(al, cr, cl);
    for (const s of [-1, 1]) {
      const aa = p(a, s),
        cc = p(c, s),
        ab = p(a, s, -0.35),
        cb = p(c, s, -0.35);
      tri(aa, cc, cb);
      tri(aa, cb, ab);
    }
    tri(p(a, -1, -0.35), p(c, 1, -0.35), p(a, 1, -0.35));
    tri(p(a, -1, -0.35), p(c, -1, -0.35), p(c, 1, -0.35));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  g.computeVertexNormals();
  b.add(g, tone);
}
function gate(b: LondonBatch, x = 0) {
  const shape = new THREE.Shape();
  shape.moveTo(-3.4, 0);
  shape.lineTo(3.4, 0);
  shape.lineTo(3.4, 5.3);
  shape.lineTo(-3.4, 5.3);
  shape.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, 2.3, 1.65, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  b.add(
    new THREE.ExtrudeGeometry(shape, {
      depth: 0.45,
      bevelEnabled: false,
      curveSegments: 32,
    }),
    ice,
    v(x - 0.225, 0, 0),
    v(0, Math.PI / 2, 0),
  );
  b.add(
    new THREE.TorusGeometry(1.65, 0.12, 6, 40),
    warm,
    v(x, 2.3, 0),
    v(0, Math.PI / 2, 0),
  );
}
function statue(b: LondonBatch, x: number, z: number, pose: number) {
  b.box(2.2, 0.7, 2.2, x, 0.35, z, stone);
  b.ball(x, 2.5, z, 0.6, 1.15, 0.5, stone);
  b.ball(x, 4, z, 0.48, 0.55, 0.46, stone);
  for (const s of [-1, 1]) {
    b.add(
      new THREE.CylinderGeometry(0.18, 0.22, 1.7, 7),
      stone,
      v(x + s * 0.55, 2.7, z),
      v(0, 0, s * (0.4 + pose * 0.3)),
    );
    b.cylinder(0.22, 1.7, x + s * 0.3, 1.3, z, stone);
  }
}
function foundation(b: LondonBatch, r = 24) {
  b.add(new THREE.CylinderGeometry(r, r * 0.78, 32, 10), dark, v(0, -16.3, 0));
  b.cylinder(r, 0.3, 0, -0.15, 0, snow, "solid", 10);
}
function house(b: LondonBatch, colour: number, width = 12, height = 17) {
  b.box(width, height, 9, 0, height / 2, 0, colour);
  b.box(width + 0.6, 0.4, 9.6, 0, height + 0.2, 0, dark);
  for (let row = 0; row < Math.max(2, Math.floor((height - 2) / 3.5)); row++)
    for (let col = 0; col < 4; col++)
      b.box(
        1.1,
        1.65,
        0.09,
        -width * 0.34 + col * width * 0.225,
        2.6 + row * 3.5,
        4.56,
        row % 2 ? warm : 0x92b9ca,
        "glow",
      );
}
export function createOsloModel(obj: LevelObjectData, _quality = "medium") {
  const p = obj.properties ?? {},
    type = String(p.subType ?? "");
  if (!type.startsWith("oslo_")) return null;
  const kind = type.slice(5),
    b = new LondonBatch(),
    group = new THREE.Group();
  switch (kind) {
    case "swing": {
      const length = Number(p.length ?? 22),
        width = Number(p.width ?? 3);
      ribbon(
        b,
        Array.from({ length: 49 }, (_, i) => {
          const x = -length / 2 + (i * length) / 48;
          return v(x, 3 * (x / (length / 2)) ** 2, 0);
        }),
        width,
      );
      for (const x of [-length / 2, length / 2])
        for (const z of [-width / 2, width / 2]) {
          b.cylinder(0.045, 12, x, 9, z, wood);
          b.ball(x, 15, z, 0.18, 0.18, 0.18, warm);
        }
      break;
    }
    case "tile":
      floor(b, Number(p.length ?? 2.2), Number(p.width ?? 2.2));
      break;
    case "rotor":
      for (let i = 0; i < 2; i++)
        b.add(
          new THREE.BoxGeometry(Number(p.length ?? 7), 0.65, 0.4),
          ice,
          v(0, 0.8, 0),
          v(0, (i * Math.PI) / 2, 0),
        );
      b.cylinder(0.4, 1.4, 0, 0.7, 0, dark);
      break;
    case "gate":
      gate(b);
      break;
    case "bridge":
      floor(b, Number(p.length ?? 22), Number(p.width ?? 2.1));
      gate(b);
      break;
    case "spokes":
    case "orbit_arm": {
      const radius = Number(p.radius ?? 18),
        count = kind === "spokes" ? 3 : 1,
        width = Number(p.width ?? 1.8);
      for (let i = 0; i < count; i++) {
        const a = (i * Math.PI * 2) / count;
        b.add(
          new THREE.BoxGeometry(radius, 0.45, width),
          snow,
          v((Math.cos(a) * radius) / 2, -0.225, (-Math.sin(a) * radius) / 2),
          v(0, a, 0),
        );
        if (kind === "orbit_arm") {
          b.cylinder(
            3,
            0.45,
            Math.cos(a) * radius,
            -0.225,
            -Math.sin(a) * radius,
            ice,
            "solid",
            32,
          );
          b.ring(
            2.7,
            0.07,
            Math.cos(a) * radius,
            0.04,
            -Math.sin(a) * radius,
            warm,
            true,
          );
        }
      }
      b.cylinder(2, 0.5, 0, -0.25, 0, stone);
      break;
    }
    case "ferry":
      b.cylinder(3.2, 0.65, 0, -0.325, 0, wood, "solid", 32);
      b.ring(3, 0.1, 0, 0.03, 0, ice, true);
      b.box(3, 0.05, 1, 0, 0.03, 0, warm);
      break;
    case "drum": {
      const radius = Number(p.radius ?? 6),
        length = Number(p.length ?? 24);
      // Structural lattice rather than transparent overlapping cylinder skins.
      for (let j = 0; j < 64; j++) {
        const a = (j * Math.PI * 2) / 64;
        b.add(
          new THREE.BoxGeometry(length, 0.15, 0.16),
          ice,
          v(0, -Math.cos(a) * radius, Math.sin(a) * radius),
          v(a, 0, 0),
        );
      }
      for (let i = 0; i <= 12; i++)
        b.add(
          new THREE.TorusGeometry(radius, 0.1, 5, 64),
          i % 3 ? stone : wood,
          v(-length / 2 + (i * length) / 12, 0, 0),
          v(0, Math.PI / 2, 0),
        );
      break;
    }
    case "studded": {
      const length = Number(p.length ?? 14),
        width = Number(p.width ?? 3.4);
      floor(b, length, width);
      const n = Math.floor(length / 1.1),
        vertices: number[] = [];
      for (let i = 0; i < n; i++)
        for (const side of [-1, 1]) {
          const x = -length / 2 + ((i + 0.5) * length) / n,
            z = side * (width / 2 - 0.48),
            h = Number(p.height ?? 0.35),
            r = 0.44;
          for (let face = 0; face < 4; face++) {
            const a = (face * Math.PI) / 2 + Math.PI / 4,
              c = a + Math.PI / 2;
            vertices.push(
              x,
              h,
              z,
              x + Math.cos(a) * r,
              0.02,
              z + Math.sin(a) * r,
              x + Math.cos(c) * r,
              0.02,
              z + Math.sin(c) * r,
            );
          }
        }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
      g.computeVertexNormals();
      b.add(g, warm);
      break;
    }
    case "museum": {
      foundation(b);
      b.box(37, 11, 23, 0, 5.5, 0, 0xcac6b6);
      for (const x of [-12, 0, 12]) {
        b.add(
          new THREE.CylinderGeometry(5.5, 5.5, 22, 16, 1, false, 0, Math.PI),
          snow,
          v(x, 11, 0),
          v(Math.PI / 2, 0, 0),
        );
        b.box(7, 6, 0.1, x, 4, 11.56, dark);
      }
      const ship = createFjordModel({
        ...obj,
        position: v(0, 1, 14),
        rotation: v(0, 0, 0),
        scale: v(0.6, 0.6, 0.6),
        properties: { subType: "fjord_longship" },
      })!;
      group.add(ship.group);
      break;
    }
    case "opera": {
      foundation(b, 29);
      b.box(34, 8, 21, 0, 4, 0, 0x658593);
      for (let i = 0; i < 15; i++)
        b.box(0.1, 7, 0.14, -16 + i * 2.3, 3.9, 10.58, ice);
      for (const side of [-1, 1]) {
        const g = new THREE.BufferGeometry().setAttribute(
          "position",
          new THREE.Float32BufferAttribute(
            [
              side * 24,
              0,
              17,
              side * 3,
              11,
              4,
              side * 3,
              11,
              -15,
              side * 24,
              0,
              17,
              side * 3,
              11,
              -15,
              side * 24,
              0,
              -15,
            ],
            3,
          ),
        );
        g.computeVertexNormals();
        b.add(g, snow);
      }
      b.box(10, 13, 18, 0, 6.5, -3, snow);
      break;
    }
    case "sculptures":
      foundation(b, 25);
      for (let i = 0; i < 7; i++)
        statue(
          b,
          Math.cos((i / 7) * Math.PI * 2) * 15,
          Math.sin((i / 7) * Math.PI * 2) * 15,
          i % 3,
        );
      b.cylinder(1.7, 15, 0, 7.5, 0, stone);
      for (let i = 0; i < 8; i++)
        b.ball(
          Math.sin(i * 2) * 1.1,
          1 + i * 1.7,
          Math.cos(i * 2) * 1.1,
          0.8,
          0.9,
          0.8,
          snow,
        );
      break;
    case "palace": {
      foundation(b, 30);
      house(b, 0xe1cd99, 48, 18);
      b.box(18, 1, 6, 0, 14, 7, snow);
      for (let i = 0; i < 6; i++)
        b.cylinder(0.45, 10, -7.5 + i * 3, 8.5, 8, snow);
      const pediment = new THREE.Shape();
      pediment.moveTo(-10, 0);
      pediment.lineTo(10, 0);
      pediment.lineTo(0, 4);
      pediment.closePath();
      b.add(
        new THREE.ExtrudeGeometry(pediment, { depth: 1, bevelEnabled: false }),
        snow,
        v(0, 14.5, 9.5),
      );
      b.cylinder(0.09, 9, 0, 23, 0, wood);
      b.box(5, 3, 0.08, 2.5, 25, 0, 0xab4451);
      b.box(0.55, 3, 0.1, 1.6, 25, 0.08, snow);
      b.box(5, 0.55, 0.1, 2.5, 25, 0.08, snow);
      b.box(0.27, 3, 0.12, 1.6, 25, 0.15, dark);
      b.box(5, 0.27, 0.12, 2.5, 25, 0.15, dark);
      break;
    }
    case "ski_jump": {
      foundation(b, 22);
      for (const x of [-10, 10])
        b.add(
          new THREE.BoxGeometry(3, 57, 3),
          stone,
          v(x, 26, 0),
          v(0, 0, x * 0.025),
        );
      ribbon(
        b,
        Array.from({ length: 49 }, (_, i) => {
          const x = -30 + i * 1.4;
          return v(x, 52 - Math.sin(((i / 48) * Math.PI) / 2) * 44, 0);
        }),
        5,
      );
      b.box(10, 4, 8, -30, 54, 0, dark);
      break;
    }
    case "harbor": {
      foundation(b, 26);
      for (let i = 0; i < 3; i++) {
        b.box(40, 0.5, 4, 0, 0.25, -14 + i * 14, wood);
        for (const x of [-16, -8, 0, 8, 16])
          b.cylinder(0.25, 7, x, -3, -14 + i * 14, dark);
      }
      for (const side of [-1, 1]) {
        b.box(10, 8, 12, side * 13, 4, 0, side > 0 ? 0xb45d5e : 0xd9c48c);
        b.box(11, 0.4, 13, side * 13, 8.2, 0, snow);
      }
      break;
    }
    case "sauna": {
      foundation(b, 17);
      house(b, wood, 12, 10);
      b.box(8, 0.4, 9, 0, 0.2, 10, wood);
      b.box(4, 3, 0.12, 0, 4, 4.65, warm, "glow");
      b.cylinder(0.45, 6, 3, 12, -1, dark);
      const steam = new THREE.Group(),
        batch = new LondonBatch();
      steam.name = "oslo-steam";
      for (let i = 0; i < 5; i++)
        batch.ball(
          Math.sin(i) * 0.7,
          i * 1.3,
          Math.cos(i) * 0.5,
          0.75 + i * 0.15,
          0.6 + i * 0.15,
          0.7,
          snow,
        );
      batch.finish(steam);
      steam.position.set(3, 15, -1);
      group.add(steam);
      break;
    }
    case "fortress": {
      foundation(b, 29);
      b.box(44, 12, 27, 0, 6, 0, 0x8f8173);
      for (const x of [-19, 19])
        for (const z of [-11, 11]) {
          b.box(9, 22, 9, x, 11, z, stone);
          b.add(
            new THREE.ConeGeometry(7.4, 8, 4),
            dark,
            v(x, 26, z),
            v(0, Math.PI / 4, 0),
          );
        }
      for (let i = 0; i < 12; i++)
        b.box(2, 2, 1, -21 + i * 3.8, 13, 13.4, snow);
      for (let i = 0; i < 9; i++)
        b.box(0.9, 2, 0.1, -16 + i * 4, 7, 13.56, dark);
      break;
    }
    case "building":
      foundation(b, 10);
      house(b, Number(p.colour ?? 0xbc9290), 12, Number(p.height ?? 19));
      break;
    default:
      return null;
  }
  const meshes = b.finish(group);
  group.name = `oslo-${kind}`;
  if (!p.norwayAction && ["tile", "studded"].includes(kind)) {
    group.userData.neonSurface = obj.id;
    group.userData.neonPath = true;
  }
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
  previewOsloModel(obj, group, 0);
  group.updateMatrixWorld(true);
  return { group, meshes };
}
export function previewOsloModel(
  obj: LevelObjectData,
  group: THREE.Object3D,
  time: number,
): boolean {
  const p = obj.properties ?? {};
  if (!String(p.subType ?? "").startsWith("oslo_")) return false;
  const action = p.norwayAction,
    index = Number(p.index ?? 0),
    speed = Number(p.speed ?? 0.6);
  if (action === "swing")
    group.rotation.z =
      obj.rotation.z +
      Math.sin(time * speed + index * 0.65) * Number(p.amplitude ?? 0.1);
  if (action === "spin") group.rotation.y = obj.rotation.y + time * speed;
  if (action === "sway")
    group.rotation.y =
      obj.rotation.y + Math.sin(time * speed) * Number(p.amplitude ?? 0.24);
  if (action === "drum") {
    group.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
    group.rotateX(time * speed);
  }
  if (action === "ferry") {
    const pose = osloFerryPose(
      time,
      (p.points as Vector3Data[] | undefined) ?? [
        obj.position,
        v(obj.position.x + 30, obj.position.y, obj.position.z),
      ],
      Number(p.period ?? 36),
    );
    group.position.copy(pose.position);
    group.rotation.z = obj.rotation.z + pose.tilt;
  }
  if (action === "steam") {
    const steam = group.getObjectByName("oslo-steam");
    if (steam) {
      steam.position.y = 15 + Math.sin(time * 0.7) * 0.45;
      steam.scale.setScalar(1 + Math.sin(time * 0.6) * 0.08);
    }
  }
  return true;
}
