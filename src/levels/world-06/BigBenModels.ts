import * as THREE from "three";
import type { LevelObjectData, Vector3Data } from "../LevelTypes";
import { LondonBatch, londonLabel, type LondonModel } from "./LondonModels";
import { buildRiverFrames } from "../world-05/SellaRiver";
import {
  toyPlanePose,
  toyPlaneHeight,
  eyeCabinPose,
  EYE_CABINS,
  EYE_RADIUS,
  EYE_CENTRE_Y,
  EYE_SPEED,
  guardPose,
  clockTrapExtension,
  chocolateRoute,
  TOWER_FLOORS,
  TOWER_TOP_Y,
  TOWER_HEIGHT,
  towerTraps,
} from "./BigBenRoutes";
const tau = Math.PI * 2,
  stone = 0xbbae94,
  gold = 0xc4a465,
  navy = 0x263a4b,
  white = 0xe2e9e6;
function road(b: LondonBatch, p: Record<string, unknown>) {
  const points = (p.points as Vector3Data[]) ?? [
      { x: 0, y: 0, z: 8 },
      { x: 0, y: 0, z: -8 },
    ],
    width = Number(p.width ?? 3),
    widths = p.widths as number[] | undefined,
    frames = buildRiverFrames(points),
    vertices: number[] = [],
    colors: number[] = [],
    colour = new THREE.Color();
  const at = (i: number, across: number, up = 0, y?: number) =>
    new THREE.Vector3(
      points[i].x + frames[i].x * across,
      (y ?? points[i].y) + up + Number(p.bank ?? 0) * across,
      points[i].z + frames[i].z * across,
    );
  const quad = (
    a: THREE.Vector3,
    c: THREE.Vector3,
    d: THREE.Vector3,
    e: THREE.Vector3,
    tone: number,
  ) => {
    colour.setHex(tone);
    for (const q of [a, c, d, a, d, e]) {
      vertices.push(q.x, q.y, q.z);
      colors.push(colour.r, colour.g, colour.b);
    }
  };
  for (let i = 0; i < points.length - 1; i++) {
    const wa = widths?.[i] ?? width,
      wb = widths?.[i + 1] ?? width,
      y = p.stairs ? points[i].y : undefined;
    const aa = [-wa / 2, -wa / 2 + 0.09, wa / 2 - 0.09, wa / 2],
      bb = [-wb / 2, -wb / 2 + 0.09, wb / 2 - 0.09, wb / 2];
    for (let j = 0; j < 3; j++)
      quad(
        at(i, aa[j]),
        at(i, aa[j + 1]),
        at(i + 1, bb[j + 1], 0, y),
        at(i + 1, bb[j], 0, y),
        j === 1
          ? p.chocolate
            ? 0x593423
            : p.antique
              ? 0xb29a74
              : 0xbfc3b0
          : p.chocolate
            ? 0xbd8150
            : p.antique
              ? 0x786147
              : gold,
      );
    for (const side of [-1, 1])
      quad(
        at(i, (side * wa) / 2),
        at(i + 1, (side * wb) / 2, 0, y),
        at(i + 1, (side * wb) / 2, -0.35, y),
        at(i, (side * wa) / 2, -0.35),
        p.chocolate ? 0x39251d : navy,
      );
    if (p.stairs && points[i + 1].y !== points[i].y)
      quad(
        at(i + 1, -wb / 2, 0, y),
        at(i + 1, wb / 2, 0, y),
        at(i + 1, wb / 2),
        at(i + 1, -wb / 2),
        0x7d4c32,
      );
  }
  const geometry = new THREE.BufferGeometry()
    .setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))
    .setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  b.add(geometry, -1);
}
function clockFace(b: LondonBatch, y: number, z: number, r: number) {
  b.add(
    new THREE.CylinderGeometry(r, r, 0.12, 48),
    0xf0deb0,
    { x: 0, y, z },
    { x: Math.PI / 2, y: 0, z: 0 },
  );
  b.ring(r, 0.12, 0, y, z + 0.1, gold);
  for (let i = 0; i < 12; i++) {
    const a = (i * tau) / 12;
    b.add(
      new THREE.BoxGeometry(0.12, r * 0.18, 0.08),
      navy,
      { x: Math.sin(a) * r * 0.81, y: y + Math.cos(a) * r * 0.81, z: z + 0.12 },
      { x: 0, y: 0, z: -a },
    );
  }
  b.box(0.12, r * 0.7, 0.1, 0, y + r * 0.28, z + 0.2, navy);
  b.box(r * 0.65, 0.13, 0.12, r * 0.25, y, z + 0.22, navy);
  b.ball(0, y, z + 0.3, 0.16, 0.16, 0.07, gold);
}
function landmarkClock(b: LondonBatch) {
  b.box(8, 34, 8, 0, 17, 0, stone);
  for (const y of [2, 8, 16, 24, 34]) b.box(8.8, 0.5, 8.8, 0, y, 0, gold);
  for (const x of [-3.2, 3.2])
    for (const z of [-3.2, 3.2]) b.box(0.5, 36, 0.5, x, 18, z, 0xd7c5a3);
  for (let i = 0; i < 6; i++)
    for (const x of [-1.8, 1.8])
      b.box(0.8, 2, 0.08, x, 4 + i * 3.2, 4.06, navy);
  clockFace(b, 29, 4.12, 3.15);
  b.add(new THREE.ConeGeometry(6.1, 9, 4).rotateY(Math.PI / 4), 0x455461, {
    x: 0,
    y: 39,
    z: 0,
  });
  b.cylinder(0.14, 6, 0, 46, 0, gold);
}
function train(
  b: LondonBatch,
  g: THREE.Group,
  closed: boolean,
  modern: boolean,
) {
  const tone = modern ? 0xc8d3d9 : 0x8f2434;
  b.box(5.5, 0.5, 23, 0, 0.25, 0, 0x4b3b30);
  if (closed) b.box(5.5, 4.5, 23, 0, 2.7, 0, tone);
  else {
    for (const x of [-2.65, 2.65]) {
      b.box(0.25, 1.7, 23, x, 1.1, 0, tone);
      for (let i = 0; i < 8; i++)
        b.box(0.28, 2.5, 0.26, x, 2.9, -10 + i * 3, tone);
    }
    b.box(5.5, 3.5, 0.3, 0, 2, -11.4, tone);
    b.box(5.8, 0.4, 23.5, 0, 4.5, 0, 0x393b3a);
    for (const x of [-1.8, 1.8])
      for (const z of [-7, -2, 3]) b.box(1.2, 0.6, 1.8, x, 0.8, z, 0x714c40);
  }
  for (const x of [-2.8, 2.8]) {
    for (let i = 0; i < 7; i++)
      b.box(0.04, 1.25, 1.5, x, 3, -9 + i * 3, 0x63818c);
    for (const z of [-8, -4, 4, 8])
      b.add(
        new THREE.CylinderGeometry(0.65, 0.65, 0.35, 16),
        0x202b33,
        { x, y: 0.15, z },
        { x: 0, y: 0, z: Math.PI / 2 },
      );
  }
  if (!modern) {
    b.add(
      new THREE.CylinderGeometry(1.8, 1.8, 9, 24),
      0x31463d,
      { x: 0, y: 2, z: -17 },
      { x: Math.PI / 2, y: 0, z: 0 },
    );
    b.cylinder(0.45, 2, 0, 4, -19, navy);
    b.ball(0, 5, -19, 0.7, 0.8, 0.7, 0xc3c6c5);
    londonLabel(
      g,
      "HOGWARTS EXPRESS",
      0,
      3.1,
      11.7,
      4.7,
      0.55,
      "#702333",
      "#f6d383",
    );
  }
}
function plane(b: LondonBatch, g: THREE.Group, index: number) {
  const color = [0xff4bc1, 0x70ff4b, 0xffed39][index % 3];
  b.box(13, 0.42, 5, 0, 0, 0, color);
  b.ball(0, 0.5, 0, 1.1, 0.8, 4.7, color);
  b.box(4, 0.25, 2, 0, 0.4, 3.6, color);
  b.box(0.2, 2, 2, 0, 1.2, 3.7, color);
  b.ball(0, 1.1, -1, 0.7, 0.6, 1.1, 0x487b93);
  b.add(new THREE.ConeGeometry(0.9, 1.7, 20).rotateX(Math.PI / 2), color, {
    x: 0,
    y: 0.5,
    z: -4.8,
  });
  const rope = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 1, 5),
    new THREE.MeshStandardMaterial({ color: 0x746d60 }),
  );
  rope.name = "ben-plane-rope";
  g.add(rope);
  b.box(2.2, 0.2, 0.25, 0, 0.5, -5.6, navy);
  londonLabel(g, "HAMLEYS", 0, 0.26, 1, 3, 0.5, "#b6283c");
}
function horse(g: THREE.Group, b: LondonBatch, index: number) {
  const brown = [0x674936, 0x303432, 0xbbad96, 0x74503b, 0xede1c6][index % 5];
  b.ball(0, 1.8, 0, 0.85, 0.9, 1.85, brown);
  b.ball(0, 2.8, -1.5, 0.55, 1, 0.65, brown);
  b.ball(0, 3.4, -2, 0.45, 0.6, 0.75, brown);
  b.ball(0, 3.1, -2.65, 0.42, 0.35, 0.45, 0x38352f);
  for (const x of [-0.2, 0.2]) {
    b.add(new THREE.ConeGeometry(0.15, 0.65, 8), brown, { x, y: 4.1, z: -1.8 });
    b.ball(x * 2.3, 3.58, -2.35, 0.055, 0.065, 0.07, 0x141a20);
  }
  for (let i = 0; i < 4; i++) {
    const leg = new THREE.Group(),
      part = new LondonBatch();
    part.box(0.28, 1.35, 0.3, 0, -0.65, 0, brown);
    part.box(0.4, 0.22, 0.5, 0, -1.35, -0.1, navy);
    part.finish(leg);
    leg.position.set(i % 2 ? -0.55 : 0.55, 1.5, i < 2 ? -1.1 : 1.1);
    leg.name = `ben-horse-leg-${i}`;
    g.add(leg);
  }
  b.ball(0, 1.85, 1.9, 0.22, 0.3, 1, 0x312e29);
  b.box(1.2, 0.35, 1.1, 0, 2.7, 0.1, navy);
  b.box(0.9, 1.25, 0.6, 0, 3.45, 0.1, 0xbb2e3b);
  b.ball(0, 4.35, 0.1, 0.4, 0.45, 0.38, 0xe3b38c);
  b.cylinder(0.48, 1.1, 0, 5, 0.1, 0x24262a);
  for (const side of [-1, 1]) {
    b.ball(side * 0.6, 3.3, 0.05, 0.18, 0.65, 0.18, 0xb62636);
    b.box(0.2, 0.9, 0.25, side * 0.47, 2.4, 0.3, navy);
  }
  for (let i = 0; i < 4; i++)
    b.ball(0, 3.12 + i * 0.2, -0.24, 0.055, 0.055, 0.035, gold);
}
function antiqueTower(g: THREE.Group, b: LondonBatch) {
  const slots = towerTraps(),
    wallStone = 0xa18b69,
    trim = 0xc5b18a,
    bronze = 0x816641;
  // Build wall strips around real openings rather than letting blocks pass through solid masonry.
  for (let wall = 0; wall < 4; wall++) {
    const holes = slots
      .filter((t) => t.edge === wall)
      .map((t) => ({
        u: wall % 2 ? t.position.z : t.position.x,
        y: t.position.y,
      }));
    const heights = [
      0,
      TOWER_HEIGHT,
      ...holes.flatMap((h) => [h.y - 0.8, h.y + 0.8]),
    ].sort((a, c) => a - c);
    const panel = (
      u: number,
      y: number,
      w: number,
      h: number,
      c: number,
      depth = 1,
      inset = 14,
    ) => {
      if (w < 0.001 || h < 0.001) return;
      if (wall % 2) b.box(depth, h, w, wall === 1 ? -inset : inset, y, u, c);
      else b.box(w, h, depth, u, y, wall === 0 ? inset : -inset, c);
    };
    for (let i = 1; i < heights.length; i++) {
      const bottom = heights[i - 1],
        top = heights[i],
        y = (bottom + top) / 2;
      let cursor = -14.5;
      for (const hole of holes
        .filter((h) => Math.abs(h.y - y) < 0.8)
        .sort((a, c) => a.u - c.u)) {
        panel(
          (cursor + hole.u - 1.67) / 2,
          y,
          hole.u - 1.67 - cursor,
          top - bottom,
          wallStone,
        );
        cursor = hole.u + 1.67;
      }
      panel((cursor + 14.5) / 2, y, 14.5 - cursor, top - bottom, wallStone);
    }
    for (const hole of holes) {
      for (const side of [-1, 1])
        panel(hole.u + side * 1.77, hole.y, 0.18, 1.94, bronze, 0.24, 13.44);
      for (const side of [-1, 1])
        panel(hole.u, hole.y + side * 0.91, 3.72, 0.18, trim, 0.24, 13.44);
      // Exterior housing encloses the retracted mechanism behind each opening.
      panel(hole.u, hole.y, 3.75, 1.95, wallStone, 0.22, 16.18);
    }
    for (let floor = 0; floor <= TOWER_FLOORS; floor++) {
      const y = 11.35 + floor * 6.4;
      if (!holes.some((h) => Math.abs(h.y - y) < 1.15))
        panel(0, y, 28.8, 0.22, bronze, 0.18, 13.43);
    }
    for (const u of [-12.35, 12.35])
      panel(u, TOWER_HEIGHT / 2, 0.48, TOWER_HEIGHT, trim, 0.35, 13.38);
    for (let floor = 0; floor < TOWER_FLOORS; floor++)
      for (const u of [-7.4, 7.4]) {
        const y = 15.6 + floor * 6.4;
        panel(u, y, 0.5, 1.1, bronze, 0.28, 13.18);
        if (wall % 2)
          b.box(
            0.18,
            0.65,
            0.28,
            wall === 1 ? -13.0 : 13.0,
            y,
            u,
            0xffd49a,
            "glow",
          );
        else
          b.box(
            0.28,
            0.65,
            0.18,
            u,
            y,
            wall === 0 ? 13.0 : -13.0,
            0xffd49a,
            "glow",
          );
      }
  }
  for (const side of [-1, 1])
    for (const other of [-1, 1]) {
      b.box(
        0.8,
        TOWER_HEIGHT + 1,
        0.8,
        side * 14.1,
        TOWER_HEIGHT / 2,
        other * 14.1,
        trim,
      );
      b.add(new THREE.ConeGeometry(1.25, 6, 4).rotateY(Math.PI / 4), bronze, {
        x: side * 13.8,
        y: TOWER_HEIGHT + 3,
        z: other * 13.8,
      });
    }
  b.box(30, 0.65, 30, 0, TOWER_HEIGHT, 0, bronze);
  for (let side = 0; side < 4; side++) {
    const face = new THREE.Group(),
      batch = new LondonBatch();
    clockFace(batch, TOWER_TOP_Y + 6, 14.66, 5.2);
    batch.finish(face);
    face.rotation.y = (side * Math.PI) / 2;
    g.add(face);
  }
  b.add(new THREE.ConeGeometry(19.5, 14, 4).rotateY(Math.PI / 4), 0x485750, {
    x: 0,
    y: TOWER_HEIGHT + 7,
    z: 0,
  });
  b.cylinder(0.16, 5, 0, TOWER_HEIGHT + 16, 0, bronze);
  b.ball(0, TOWER_HEIGHT + 18.6, 0, 0.35, 0.35, 0.35, gold, "metal");
}
export function createBigBenModel(obj: LevelObjectData): LondonModel | null {
  const type = String(obj.properties?.subType ?? "");
  if (!type.startsWith("bigben_")) return null;
  const kind = type.slice(7),
    p = obj.properties ?? {},
    b = new LondonBatch(),
    g = new THREE.Group(),
    extraSolids: THREE.Mesh[] = [];
  let collision: THREE.Mesh[] | undefined;
  switch (kind) {
    case "road":
      road(b, p);
      break;
    case "chocolate":
      road(b, {
        points: chocolateRoute(0),
        width: 3.4,
        stairs: true,
        chocolate: true,
      });
      break;
    case "column":
      b.box(2, 9, 2, 0, 4.5, 0, 0x947b65);
      b.box(2.5, 0.35, 2.5, 0, 0.175, 0, stone);
      b.box(2.6, 0.4, 2.6, 0, 8.9, 0, stone);
      londonLabel(
        g,
        String(p.number ?? 9),
        0,
        6.5,
        1.04,
        2.5,
        1.1,
        "#263a4b",
        "#f5dd9d",
      );
      break;
    case "station":
      for (const side of [-1, 1])
        for (let i = 0; i < 7; i++) {
          b.box(0.6, 15, 0.6, side * 15, 7.5, -54 + i * 18, 0x6c655b);
          b.add(new THREE.TorusGeometry(15, 0.16, 6, 36, Math.PI), 0x46535c, {
            x: 0,
            y: 15,
            z: -54 + i * 18,
          });
        }
      for (const x of [-12, 0, 12]) b.box(0.2, 0.3, 124, x, 15, -2, 0x8e9b9c);
      londonLabel(g, "KING’S CROSS", 0, 11, 28, 16, 1.5);
      collision = [];
      break;
    case "steam_train":
      train(b, g, p.closed === true, p.modern === true);
      break;
    case "toy_plane":
      plane(b, g, Number(p.index ?? 0));
      break;
    case "chocolate_fall": {
      const height = Number(p.height ?? 66);
      b.cylinder(0.9, height, 0, height / 2, 0, 0x64341d);
      b.cylinder(1.4, 0.4, 0, 0.2, 0, 0x58331f);
      b.ring(1.25, 0.12, 0, 0.4, 0, 0x9e6535, true);
      for (let i = 0; i < 8; i++) {
        const drop = new THREE.Mesh(
          new THREE.SphereGeometry(0.15, 8, 6),
          new THREE.MeshStandardMaterial({ color: 0xac7143, roughness: 0.25 }),
        );
        drop.name = `ben-choc-drop-${i}`;
        drop.position.set(
          Math.sin(i) * 0.65,
          (i * height) / 8,
          Math.cos(i) * 0.65,
        );
        g.add(drop);
      }
      collision = [];
      break;
    }
    case "guard":
      for (let member = 0; member < 3; member++) {
        const troop = new THREE.Group(),
          batch = new LondonBatch();
        troop.name = `ben-guard-member-${member}`;
        horse(troop, batch, Number(p.index ?? 0) + member);
        extraSolids.push(...batch.finish(troop));
        troop.position.x = (member - 1) * 1.65;
        g.add(troop);
      }
      break;
    case "palace":
      b.box(68, 18, 12, 0, 9, 0, stone);
      b.box(75, 1, 15, 0, 18.5, 0, 0xe1d1b5);
      for (const x of [-30, -15, 0, 15, 30])
        b.box(9, 21, 16, x, 10.5, 0, 0xc8b99c);
      for (let row = 0; row < 3; row++)
        for (let i = 0; i < 21; i++) {
          const x = -31 + i * 3.1;
          b.box(1.3, 2.5, 0.12, x, 3 + row * 5.1, 8.08, navy);
          b.box(1.6, 0.15, 0.3, x, 1.7 + row * 5.1, 8.1, gold);
        }
      for (const x of [-6, -3, 0, 3, 6])
        b.cylinder(0.42, 9, x, 5, 10, 0xe2d5bd);
      b.box(17, 0.8, 6, 0, 10, 10, 0xe2d5bd);
      b.cylinder(0.1, 10, 0, 25, 0, navy);
      b.box(5, 2.4, 0.07, 2.5, 28.2, 0, 0xa82b39);
      break;
    case "shard": {
      b.add(new THREE.ConeGeometry(8, 68, 4).rotateY(Math.PI / 4), 0x557e91, {
        x: 0,
        y: 34,
        z: 0,
      });
      for (let i = 1; i < 30; i++) {
        const w = 11 * (1 - i / 31);
        b.box(w, 0.1, w, 0, i * 2.1, 0, 0x9cb7c5);
      }
      b.box(1, 70, 1, 0, 35, 0, 0xadcbd1);
      break;
    }
    case "bridge":
      for (const x of [-13, 13]) {
        b.box(6, 27, 9, x, 13.5, 0, stone);
        b.box(7, 0.8, 10, x, 24, 0, gold);
        for (const dx of [-2, 2])
          for (const z of [-3, 3])
            b.add(
              new THREE.ConeGeometry(1.6, 5, 4).rotateY(Math.PI / 4),
              0x346d87,
              { x: x + dx, y: 29, z },
            );
        b.box(3, 6, 0.15, x, 13, 4.6, navy);
      }
      b.box(32, 1, 7, 0, 22.5, 0, 0x5d93a3);
      for (const z of [-3, 3]) {
        b.box(32, 0.3, 0.3, 0, 25, z, 0x8db5b9);
        for (let i = 0; i < 15; i++)
          b.box(0.14, 2.5, 0.14, -14 + i * 2, 23.8, z, 0xc3e0df);
      }
      for (const side of [-1, 1])
        for (let i = 0; i < 14; i++) {
          const t = i / 13;
          b.box(
            0.14,
            13 * (1 - t) + 1,
            0.14,
            side * (14 + 20 * t),
            7 * (1 - t) + 4,
            0,
            0x70b1bf,
          );
        }
      break;
    case "wheel": {
      const rotor = new THREE.Group(),
        rb = new LondonBatch();
      rotor.name = "ben-wheel-rotor";
      for (const z of [-1, 1]) {
        rb.ring(EYE_RADIUS, 0.24, 0, 0, z, white);
        rb.ring(EYE_RADIUS - 0.7, 0.08, 0, 0, z, 0x8dcaca);
      }
      for (let i = 0; i < EYE_CABINS; i++) {
        const a = -Math.PI / 2 + (i * tau) / EYE_CABINS;
        rb.add(
          new THREE.BoxGeometry(0.08, EYE_RADIUS, 0.08),
          0xc8d7d6,
          {
            x: (Math.cos(a) * EYE_RADIUS) / 2,
            y: (Math.sin(a) * EYE_RADIUS) / 2,
            z: 0,
          },
          { x: 0, y: 0, z: a - Math.PI / 2 },
        );
        rb.ball(
          Math.cos(a) * EYE_RADIUS,
          Math.sin(a) * EYE_RADIUS,
          0,
          0.23,
          0.23,
          0.23,
          0x77dadd,
          "glow",
        );
      }
      rb.finish(rotor);
      g.add(rotor);
      if (!p.benAction)
        for (let i = 0; i < 24; i++) {
          const a = (i * tau) / 24,
            x = Math.cos(a) * EYE_RADIUS,
            y = Math.sin(a) * EYE_RADIUS;
          b.box(2.5, 1.8, 1.8, x, y - 0.9, 0, 0x7cabb9);
          b.box(2.7, 0.18, 2, x, y + 0.05, 0, white);
          b.box(2.7, 0.18, 2, x, y - 1.85, 0, white);
        }
      b.cylinder(1, 3, 0, 0, 0, navy);
      for (const side of [-1, 1])
        b.add(
          new THREE.CylinderGeometry(0.45, 0.65, 34, 10),
          white,
          { x: side * 6, y: -14, z: 3 },
          { x: 0, y: 0, z: -side * 0.4 },
        );
      collision = [];
      break;
    }
    case "cabin": {
      b.box(5, 0.35, 4.2, 0, -0.175, 0, white);
      for (const z of [-2, 2]) {
        for (const x of [-1.9, 1.9])
          b.box(1.2, 0.65, 0.15, x, 0.55, z, 0x7aafb9);
        b.box(5, 0.18, 0.2, 0, 3.4, z, white);
        for (const x of [-2.3, 2.3]) b.box(0.12, 3.5, 0.12, x, 1.7, z, white);
      }
      b.box(5.2, 0.25, 4.4, 0, 3.6, 0, white);
      for (const side of [-1, 1]) {
        b.box(0.18, 0.3, 4.4, side * 2.6, 3.4, 0, 0xc5e9e0);
        b.box(0.15, 1.05, 4, side * 2.45, 0.525, 0, 0x7aafb9);
        const glass = new THREE.Mesh(
          new THREE.BoxGeometry(0.065, 2.1, 3.9),
          new THREE.MeshStandardMaterial({
            color: 0x99cbd3,
            transparent: true,
            opacity: 0.2,
            roughness: 0.25,
            metalness: 0.08,
            depthWrite: false,
          }),
        );
        glass.position.set(side * 2.45, 2.15, 0);
        g.add(glass);
        extraSolids.push(glass);
      }
      break;
    }
    case "clock":
      landmarkClock(b);
      break;
    case "tower":
      antiqueTower(g, b);
      break;
    case "trap":
      b.box(3, 1.3, 2.4, 0, 0, 0, 0x8e795c);
      b.box(2.76, 1.06, 0.08, 0, 0, -1.245, 0xb8985b, "metal");
      for (const x of [-1.1, 1.1])
        for (const y of [-0.38, 0.38])
          b.ball(x, y, -1.3, 0.065, 0.065, 0.045, 0x5d513e, "metal");
      break;
    default:
      return null;
  }
  const meshes = b.finish(g);
  g.position.copy(obj.position);
  g.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z, "YXZ");
  g.scale.copy(obj.scale);
  g.userData.bigBenAsset = true;
  previewBigBenActor(obj, g, 0);
  return { group: g, meshes: collision ?? [...meshes, ...extraSolids] };
}
export function previewBigBenActor(
  obj: LevelObjectData,
  g: THREE.Object3D,
  time: number,
): boolean {
  const p = obj.properties ?? {},
    index = Number(p.index ?? 0);
  switch (p.benAction) {
    case "plane": {
      const pose = toyPlanePose(time, index);
      g.position.set(
        obj.position.x + pose.position.x,
        obj.position.y + pose.position.y - toyPlaneHeight(index),
        obj.position.z + pose.position.z - (8 - index * 30),
      );
      g.rotation.y = obj.rotation.y + pose.yaw;
      const rope = g.getObjectByName("ben-plane-rope");
      if (rope) {
        g.updateWorldMatrix(true, false);
        const target = g.worldToLocal(
            new THREE.Vector3(
              obj.position.x,
              obj.position.y + 20,
              obj.position.z,
            ),
          ),
          start = new THREE.Vector3(0, 1.2, 0),
          direction = target.clone().sub(start);
        rope.position.copy(start).addScaledVector(direction, 0.5);
        rope.scale.y = direction.length();
        rope.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction.normalize(),
        );
      }
      return true;
    }
    case "cabin": {
      const pose = eyeCabinPose(time, index);
      g.position.set(
        obj.position.x + pose.x,
        obj.position.y + pose.y - EYE_CENTRE_Y,
        obj.position.z + pose.z,
      );
      return true;
    }
    case "wheel": {
      const rotor = g.getObjectByName("ben-wheel-rotor");
      if (rotor) rotor.rotation.z = Math.max(0, time) * EYE_SPEED;
      return true;
    }
    case "guard": {
      const pose = guardPose(time, index);
      g.position.z = obj.position.z + pose.z + 22;
      g.rotation.y = pose.direction;
      for (let m = 0; m < 3; m++)
        for (let i = 0; i < 4; i++) {
          const leg = g
            .getObjectByName(`ben-guard-member-${m}`)
            ?.getObjectByName(`ben-horse-leg-${i}`);
          if (leg)
            leg.rotation.x =
              Math.sin(time * 15 + (i % 2) * Math.PI + m * 0.3) * 0.35;
        }
      return true;
    }
    case "trap": {
      const extension = clockTrapExtension(time, index),
        d = p.direction as Vector3Data;
      g.position.set(
        obj.position.x - d.x * 4.2 * extension,
        obj.position.y,
        obj.position.z - d.z * 4.2 * extension,
      );
      return true;
    }
    case "chocolate": {
      const h = Number(p.height ?? 66);
      for (let i = 0; i < 8; i++) {
        const drop = g.getObjectByName(`ben-choc-drop-${i}`);
        if (drop) drop.position.y = ((((i * h) / 8 - time * 9) % h) + h) % h;
      }
      return true;
    }
    default:
      return false;
  }
}
