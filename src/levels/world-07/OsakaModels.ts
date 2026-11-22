import type { LevelObjectData } from "../LevelTypes";
import * as THREE from "three";
import { LondonBatch, londonLabel } from "../world-06/LondonModels";
import { createKyotoModel } from "./KyotoModels";
import { osakaBladePose, osakaDomeHeight } from "./OsakaRoutes";
const navy = 1518405,
  wood = 6832694,
  gold = 13741410,
  pink = 16016556,
  cyan = 6935775,
  white = 15065037;
function beam(
  r: LondonBatch,
  e: THREE.Vector3,
  s: THREE.Vector3,
  o: number,
  t: number,
  a = "solid",
) {
  const i = s.clone().sub(e),
    n = new THREE.Euler().setFromQuaternion(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        i.clone().normalize(),
      ),
    );
  r.add(
    new THREE.CylinderGeometry(o, o, i.length(), 8),
    t,
    e.clone().add(s).multiplyScalar(0.5),
    n,
    a,
  );
}
function pagodaRoof(r: LondonBatch, e: number, s: number, o: number) {
  for (const t of [-1, 1])
    (r.add(
      new THREE.BoxGeometry(s, 0.3, o * 0.58),
      3963242,
      { x: 0, y: e + 0.75, z: t * o * 0.23 },
      { x: t * 0.3, y: 0, z: 0 },
    ),
      r.box(s + 0.5, 0.14, 0.25, 0, e + 0.2, t * o * 0.52, gold));
  r.box(s + 0.3, 0.2, 0.24, 0, e + 1.25, 0, gold);
}
function foodStall(r: LondonBatch, e: boolean) {
  (r.box(7, 0.35, 5, 0, -0.2, 0, navy),
    r.box(5.5, 2, 2.2, 0, 1, 0, wood),
    r.box(6, 0.22, 2.7, 0, 2.12, 0, 10643521));
  for (const s of [-2.8, 2.8]) r.box(0.2, 4.2, 0.2, s, 2.1, 0, wood);
  (r.box(6.6, 0.25, 4, 0, 4.2, 0, navy),
    r.box(6.5, 0.8, 0.12, 0, 3.65, 1.8, e ? 10369846 : 9728562));
  for (let s = 0; s < 6; s++)
    r.box(0.035, 0.75, 0.15, -2.7 + s * 1.1, 3.65, 1.9, gold);
  for (const s of [-2.65, 2.65])
    (r.ball(s, 3, 1.5, 0.37, 0.6, 0.37, 15120010, "glow"),
      r.box(0.4, 0.1, 0.4, s, 3.6, 1.5, navy));
  if (e) {
    (r.add(new THREE.CylinderGeometry(0.9, 0.46, 0.55, 24), 6196906, {
      x: 0,
      y: 2.5,
      z: 0.3,
    }),
      r.cylinder(0.79, 0.035, 0, 2.79, 0.3, 13805927));
    for (let s = 0; s < 6; s++)
      r.add(
        new THREE.TorusGeometry(0.2 + s * 0.06, 0.035, 4, 18, Math.PI * 1.6),
        14994055,
        { x: 0, y: 2.83, z: 0.3 },
        { x: Math.PI / 2, y: 0, z: s * 0.5 },
      );
    for (const s of [-0.3, 0.3])
      r.ball(s, 2.86, 0.3, 0.22, 0.035, 0.3, 15130026);
    for (let s = 0; s < 3; s++)
      r.box(0.07, 0.07, 2.7, -0.5 + s * 0.15, 3, 0.1, wood);
  } else {
    r.box(4, 0.09, 1.4, 0, 2.28, 0.2, 3291204);
    for (let s = 0; s < 6; s++)
      for (let o = 0; o < 2; o++) {
        const t = -1.65 + s * 0.65,
          a = -0.15 + o * 0.65;
        (r.ball(t, 2.45, a, 0.25, 0.23, 0.25, 12024633),
          r.ball(t + 0.04, 2.63, a, 0.2, 0.025, 0.17, 7685931),
          r.box(0.08, 0.035, 0.2, t, 2.67, a, 6588746));
      }
    r.ball(0, 5.2, 0, 1.1, 1.1, 0.5, 11424079);
    for (let s = 0; s < 6; s++)
      r.ball((s - 2.5) * 0.38, 4.35, 0.1, 0.16, 0.45, 0.2, 11424079);
    for (const s of [-0.4, 0.4])
      (r.ball(s, 5.35, 0.47, 0.21, 0.25, 0.08, white),
        r.ball(s, 5.35, 0.55, 0.09, 0.13, 0.04, navy));
  }
}
function walkableDome(r: LondonBatch, e: number, s: number) {
  const o: number[] = [],
    i = (c: number, d: number) =>
      new THREE.Vector3(
        Math.cos(d) * c,
        osakaDomeHeight(e, s, Math.cos(d) * c, Math.sin(d) * c),
        Math.sin(d) * c,
      ),
    n = (c: THREE.Vector3, d: THREE.Vector3, f: THREE.Vector3) =>
      o.push(...c.toArray(), ...d.toArray(), ...f.toArray());
  for (let c = 0; c < 10; c++)
    for (let d = 0; d < 48; d++) {
      const f = (d / 48) * Math.PI * 2,
        u = ((d + 1) / 48) * Math.PI * 2,
        g = (c / 10) * e,
        y = ((c + 1) / 10) * e,
        p = i(g, f),
        b = i(y, f),
        k = i(y, u),
        S = i(g, u);
      (c && n(p, S, k), n(p, k, b));
    }
  const l = new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.Float32BufferAttribute(o, 3),
  );
  (l.computeVertexNormals(),
    r.add(l, 8436651),
    r.add(new THREE.CylinderGeometry(e, e, 0.5, 48), navy, {
      x: 0,
      y: -0.25,
      z: 0,
    }),
    r.ring(e, 0.055, 0, 0.015, 0, gold, !0, "glow"));
}
export function createOsakaModel(obj: LevelObjectData, quality = "medium") {
  const subtype = String(obj.properties?.subType ?? "");
  if (!subtype.startsWith("osaka_")) return null;
  const kind = subtype.slice(6),
    properties = obj.properties ?? {};
  if (kind === "path") {
    const c = createKyotoModel(
      {
        ...obj,
        properties: {
          ...properties,
          subType: "kyoto_path",
          surfaceColor: 5603218,
          surfaceAltColor: 6327710,
          edgeColor: 7526878,
          sideColor: navy,
        },
      },
      quality,
    )!;
    for (const d of c.meshes)
      for (const f of Array.isArray(d.material) ? d.material : [d.material])
        f instanceof THREE.MeshStandardMaterial &&
          (f.emissive.setHex(341313),
          (f.emissiveIntensity = 0.22),
          (f.roughness = 0.5));
    return (
      (c.group.name = "osaka-path"),
      (c.group.userData.neonSurface = obj.id),
      (c.group.userData.neonPath = true),
      c
    );
  }
  const group = new THREE.Group(),
    batch = new LondonBatch(),
    extraMeshes: THREE.Mesh[] = [];
  switch (kind) {
    case "takoyaki_stall":
      (foodStall(batch, !1),
        londonLabel(group, "TAKOYAKI", 0, 3.7, 1.91, 4.7, 0.5, "#80612c"));
      break;
    case "ramen_stall": {
      (foodStall(batch, !0),
        londonLabel(group, "RAMEN", 0, 3.7, 1.91, 4.7, 0.5, "#8b302d"));
      const c = new THREE.Group(),
        d = new LondonBatch();
      c.name = "osaka-steam";
      for (let f = 0; f < 4; f++)
        d.add(
          new THREE.TorusGeometry(0.23, 0.045, 4, 12, Math.PI * 1.3),
          12244185,
          { x: ((f % 2) - 0.5) * 0.6, y: 3.25 + f * 0.36, z: 0.3 },
          { x: 0, y: f, z: f * 0.7 },
          "steam",
        );
      for (const f of d.finish(c)) {
        const u = f.material as THREE.Material;
        ((u.transparent = !0),
          (u.opacity = 0.22),
          (u.depthWrite = !1),
          (f.castShadow = !1));
      }
      group.add(c);
      break;
    }
    case "glico": {
      (batch.box(9.3, 17, 0.8, 0, 8.5, 0, navy),
        batch.box(8.7, 16.5, 0.08, 0, 8.5, 0.45, 2509195),
        batch.add(
          new THREE.TorusGeometry(1, 0.035, 6, 48).scale(3.1, 6, 1),
          white,
          { x: 0, y: 8.6, z: 0.55 },
          void 0,
          "glow",
        ),
        batch.ball(0, 11.7, 0.7, 0.58, 0.65, 0.15, white, "glow"));
      const c = [
        [
          [0, 11, 0],
          [0, 8.1, 0],
        ],
        [
          [-0.2, 10.7, 0],
          [-2.6, 13.5, 0],
        ],
        [
          [0.2, 10.7, 0],
          [2.6, 13.5, 0],
        ],
        [
          [0, 8.1, 0],
          [-1.3, 5.8, 0],
        ],
        [
          [-1.3, 5.8, 0],
          [-2.2, 5.8, 0],
        ],
        [
          [0, 8.1, 0],
          [1.4, 7.2, 0],
        ],
        [
          [1.4, 7.2, 0],
          [1.7, 5.4, 0],
        ],
      ];
      for (const [d, f] of c)
        beam(
          batch,
          new THREE.Vector3(d[0], d[1], 0.73),
          new THREE.Vector3(f[0], f[1], 0.73),
          0.2,
          white,
          "glow",
        );
      batch.ball(0, 9.6, 0.96, 0.6, 0.65, 0.05, 11748425, "glow");
      for (const d of [-4.6, 4.6])
        batch.box(0.12, 17.2, 0.14, d, 8.5, 0.5, cyan, "glow");
      londonLabel(group, "GLICO", 0, 2.5, 0.51, 6, 1.3, "#26498b");
      break;
    }
    case "sushi_belt": {
      const c = Number(properties.length ?? 12);
      (batch.box(c, 0.65, 2.8, 0, 1, 0, wood),
        batch.box(c + 0.3, 0.14, 3.1, 0, 1.38, 0, 8886942),
        batch.box(c, 0.08, 1.3, 0, 1.48, 0, navy));
      for (const d of [-1.5, 1.5])
        batch.box(c, 0.1, 0.08, 0, 1.54, d, cyan, "glow");
      for (let d = 0; d < 8; d++) {
        const f = new THREE.Group(),
          u = new LondonBatch();
        ((f.userData.sushiIndex = d),
          (f.name = "osaka-sushi-plate"),
          u.cylinder(
            0.48,
            0.07,
            0,
            0,
            0,
            d % 2 ? 12617084 : 8826813,
            "solid",
            16,
          ),
          u.ball(0, 0.13, 0, 0.26, 0.12, 0.2, white),
          u.box(0.6, 0.11, 0.38, 0, 0.24, 0, d % 3 ? 14122603 : 9223558),
          u.finish(f),
          group.add(f));
      }
      break;
    }
    case "building": {
      const width=Number(properties.width??9),height=Number(properties.height??22),bodyColor=Number(properties.color??3424343),accent=Number(properties.accent??pink);
      batch.box(width,height,7,0,height/2,0,bodyColor);batch.box(width+.4,.3,7.3,0,height,0,navy);
      // Front-only luminous panels have an actual gap from the facade: no hidden
      // coplanar back faces competing with the building, even from far away.
      for(let row=0;row<Math.floor(height/3)-1;row++)for(const x of [-width*.3,0,width*.3])batch.add(new THREE.PlaneGeometry(width*.18,1.3),row%3?10266792:accent,{x,y:2.5+row*3,z:3.56},undefined,'glow');
      batch.add(new THREE.PlaneGeometry(1.7,height*.7),accent,{x:-width*.42,y:height*.52,z:3.66},undefined,'glow');
      for(let row=0;row<5;row++)batch.add(new THREE.PlaneGeometry(1,.13),white,{x:-width*.42,y:height*.25+row*height*.12,z:3.72});
      break;
    }
    case "canal": {
      const c = Number(properties.width ?? 125),
        d = Number(properties.length ?? 140);
      batch.box(c, 0.3, d, 0, -0.35, 0, 1589075);
      for (const f of [-1, 1])
        (batch.box(5, 3, d, f * (c / 2 + 2), 1, 0, 3359060),
          batch.box(0.12, 0.08, d, f * (c / 2 - 0.3), 0.08, 0, cyan, "glow"));
      for (let f = 0; f < 16; f++)
        batch.box(
          0.25,
          0.015,
          7 + (f % 4) * 3,
          ((f % 4) - 1.5) * c * 0.22,
          0.015,
          (Math.floor(f / 4) - 1.5) * d * 0.23,
          f % 2 ? 3692410 : 6769013,
          "glow",
        );
      break;
    }
    case "lantern":
      (batch.cylinder(0.08, 5, 0, 2.5, 0, wood, "solid", 8),
        batch.box(1.2, 0.12, 0.2, 0.5, 5, 0, wood),
        batch.ball(0.9, 4.15, 0, 0.44, 0.65, 0.44, 14134395, "glow"));
      for (const c of [3.5, 4.8]) batch.box(0.65, 0.1, 0.65, 0.9, c, 0, navy);
      break;
    case "arch": {
      const c = Number(properties.width ?? 8);
      for (const d of [-c / 2, c / 2]) batch.box(0.25, 5, 0.3, d, 2.5, 0, navy);
      (batch.box(c, 0.3, 0.5, 0, 5, 0, navy),
        batch.box(c + 0.2, 0.08, 0.12, 0, 5.2, 0.3, pink, "glow"));
      for (const d of [-c / 2, c / 2])
        batch.box(0.08, 4.9, 0.08, d, 2.5, 0.2, cyan, "glow");
      break;
    }
    case "castle": {
      batch.box(19, 4, 16, 0, 2, 0, 6844788);
      for (let c = 0; c < 4; c++)
        for (let d = 0; d < 10; d++)
          batch.box(
            1.7,
            0.75,
            0.08,
            -8.5 + d * 1.9 + (c % 2) * 0.2,
            0.5 + c,
            8.05,
            c % 2 ? 8291713 : 7830645,
          );
      for (let c = 0; c < 5; c++) {
        const d = 15 - c * 2.2,
          f = 12 - c * 1.7,
          u = 4 + c * 3.7;
        batch.box(d, 3.3, f, 0, u + 1.65, 0, white);
        for (const g of [-1, 1]) {
          batch.box(d, 0.2, 0.15, 0, u + 0.3, g * (f / 2 + 0.05), navy);
          for (let y = -2; y <= 2; y++)
            batch.box(
              0.6,
              1.05,
              0.08,
              y * d * 0.16,
              u + 1.8,
              g * (f / 2 + 0.06),
              navy,
            );
        }
        pagodaRoof(batch, u + 3.1, d + 2, f + 2);
        for (const g of [-1, 1])
          batch.add(
            new THREE.ConeGeometry(0.18, 0.8, 6),
            gold,
            { x: g * (d / 2 + 0.5), y: u + 4, z: 0 },
            { x: 0, y: 0, z: g * 0.4 },
            "metal",
          );
      }
      for (const c of [-1, 1])
        batch.ball(c * 1.4, 24.5, 0, 0.25, 0.6, 0.2, gold, "metal");
      break;
    }
    case "pipe": {
      const c = Number(properties.height ?? 4);
      (batch.cylinder(1.4, c, 0, c / 2, 0, 423e4, "solid", 20),
        batch.cylinder(1.7, 0.65, 0, c, 0, 5939837, "solid", 20),
        batch.cylinder(1.1, 0.025, 0, c + 0.34, 0, navy, "solid", 20));
      break;
    }
    case "globe": {
      (batch.cylinder(3.5, 0.6, 0, 0.3, 0, navy),
        batch.cylinder(0.55, 2, 0, 1.5, 0, gold),
        batch.ball(0, 5, 0, 3, 3, 3, 4746906, "metal"));
      for (let c = 0; c < 10; c++) {
        const d = c * 2.399;
        batch.ball(
          Math.cos(d) * 2.6,
          4 + (c % 3),
          Math.sin(d) * 2.6,
          0.6,
          0.5,
          0.3,
          9283736,
          "metal",
        );
      }
      (batch.ring(3.3, 0.09, 0, 5, 0, gold, !1, "metal"),
        londonLabel(group, "OSAKA PARK", 0, 2.7, 3.2, 7, 0.8, "#24384f"));
      break;
    }
    case "roller": {
      const c = Number(properties.radius ?? 1.4),
        d = Number(properties.length ?? 7.2),
        f = String(properties.axis ?? "x");
      batch.add(
        new THREE.CylinderGeometry(c, c, d, 32).rotateZ(Math.PI / 2),
        8736861,
        void 0,
        f === "z" ? { x: 0, y: Math.PI / 2, z: 0 } : void 0,
      );
      for (let u = 0; u < 8; u++) {
        const g = (u * Math.PI) / 4,
          y = f === "x" ? 0 : Math.cos(g) * c,
          p = f === "x" ? Math.cos(g) * c : 0;
        batch.box(
          f === "x" ? d : 0.075,
          0.075,
          f === "x" ? 0.075 : d,
          y,
          Math.sin(g) * c,
          p,
          u % 2 ? gold : cyan,
          "glow",
        );
      }
      break;
    }
    case "ninja_blade": {
      const c = new THREE.Group(),
        d = new LondonBatch();
      ((c.name = "osaka-ninja-edge"),
        d.box(
          Number(properties.length ?? 5),
          0.18,
          0.26,
          0,
          0,
          0,
          12964310,
          "metal",
        ),
        d.box(
          Number(properties.length ?? 5),
          0.055,
          0.035,
          0,
          -0.12,
          0.12,
          pink,
          "glow",
        ),
        d.box(0.55, 0.35, 0.7, -Number(properties.length ?? 5) / 2, 0, 0, wood),
        extraMeshes.push(...d.finish(c)),
        group.add(c));
      for (const f of [-1, 1])
        batch.box(
          0.2,
          5,
          0.3,
          f * (Number(properties.length ?? 5) / 2 + 0.8),
          2.5,
          0,
          navy,
        );
      break;
    }
    case "dome":
      walkableDome(
        batch,
        Number(properties.radius ?? 3),
        Number(properties.height ?? 1),
      );
      break;
    default:
      return null;
  }
  const meshes = batch.finish(group);
  ((group.userData.neonSurface = kind === "dome" ? obj.id : undefined),
    (group.name = `osaka-${kind}`),
    group.position.copy(obj.position),
    group.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z),
    group.scale.copy(obj.scale),
    group.traverse((c) => {
      if (c instanceof THREE.Mesh && c.name === "london-glow") {
        const d = c.material;
        ((c.material = new THREE.MeshBasicMaterial({
          vertexColors: !0,
          toneMapped: !1,
        })),
          (Array.isArray(d) ? d : [d]).forEach((material) =>
            material.dispose(),
          ),
          (c.castShadow = !1));
      }
    }));
  if(kind==="building")for(const mesh of meshes)for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material])material.side=THREE.FrontSide;
  for (const c of meshes)
    ((c.castShadow = !["canal", "building"].includes(kind)),
      (c.receiveShadow = !0),
      ["canal", "building"].includes(kind) &&
        (c.userData.graphicsNoShadow = !0));
  return (
    previewOsakaModel(obj, group, 0),
    group.updateMatrixWorld(!0),
    { group: group, meshes: [...meshes, ...extraMeshes] }
  );
}
export function previewOsakaModel(
  r: LevelObjectData,
  e: THREE.Object3D,
  s: number,
) {
  const o = String(r.properties?.subType ?? "");
  if (!o.startsWith("osaka_")) return !1;
  const t = r.properties ?? {};
  if (o === "osaka_roller") {
    const n = t.axis === "z" ? "z" : "x";
    e.rotation[n] = r.rotation[n] + s * Number(t.speed ?? 0.8);
  }
  const a = e.getObjectByName("osaka-ninja-edge");
  if (a) {
    const n = osakaBladePose(s, Number(t.index ?? 0));
    ((a.position.y = Math.max(
      n.height,
      (Math.sin(Math.abs(n.angle)) * Number(t.length ?? 5)) / 2 + 0.12,
    )),
      (a.rotation.z = n.angle));
  }
  const i = e.getObjectByName("osaka-steam");
  i &&
    ((i.position.y = (s * 0.35) % 1),
    i.scale.setScalar(0.85 + ((s * 0.35) % 1) * 0.25));
  for (const n of e.children)
    if (typeof n.userData.sushiIndex == "number") {
      const l = s * 0.4 + (n.userData.sushiIndex * Math.PI) / 4;
      (n.position.set(
        Math.cos(l) * (Number(t.length ?? 12) / 2 - 0.7),
        1.6,
        Math.sin(l) * 0.8,
      ),
        (n.rotation.y = -l));
    }
  return !0;
}
