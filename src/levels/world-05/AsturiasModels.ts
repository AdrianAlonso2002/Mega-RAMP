import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { LevelObjectData } from "../LevelTypes";

const textures = new Map<string, THREE.CanvasTexture>();

export function getAsturiasFinish(finish: string): THREE.CanvasTexture {
  const cached = textures.get(finish);
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const base = finish === "parking" ? "#4d5661" : finish === "crumb" ? "#d29249" : finish === "ham" ? "#c9717c" : "#f4bd50";
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 128, 128);
  let seed = 3129;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; finish !== "parking" && i < 650; i++) {
    const x = random() * 128, y = random() * 128;
    const r = 0.45 + random() * (finish === "crumb" ? 2.6 : 1.3);
    ctx.fillStyle = i % 3 === 0 ? "#fff2b56e" : finish === "crumb" ? "#66310c8a" : "#963d202b";
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * (finish === "ham" ? 0.34 : 0.7), 0.15, 0, Math.PI * 2);
    ctx.fill();
  }
  if (finish === "parking") {
    ctx.strokeStyle = "#f4eed4";
    ctx.lineWidth = 4;
    ctx.strokeRect(7, 7, 114, 114);
    ctx.fillStyle = "#f4eed4";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 52px sans-serif";
    ctx.fillText("P", 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  textures.set(finish, texture);
  return texture;
}

export function createAsturiasModel(obj: LevelObjectData): { group: THREE.Group; meshes: THREE.Mesh[] } | null {
  const model = String(obj.properties?.subType ?? "");
  if (!model.startsWith("asturias_")) return null;
  const group = new THREE.Group();
  const meshes: THREE.Mesh[] = [];
  const buckets = new Map<number, THREE.BufferGeometry[]>();
  const shape = (geometry: THREE.BufferGeometry, color: number, x: number, y: number, z: number) => {
    geometry.translate(x, y, z);
    const list = buckets.get(color) ?? [];
    list.push(geometry);
    buckets.set(color, list);
  };
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, color: number, rz = 0) =>
    shape(new THREE.BoxGeometry(w, h, d).rotateZ(rz), color, x, y, z);
  const oval = (w: number, h: number, d: number, x: number, y: number, z: number, color: number) =>
    shape(new THREE.SphereGeometry(1, 10, 7).scale(w, h, d), color, x, y, z);
  const tube = (a: number, b: number, height: number, x: number, y: number, z: number, color: number, axis = "y", sides = 12) => {
    const geometry = new THREE.CylinderGeometry(a, b, height, sides);
    if (axis === "z") geometry.rotateX(Math.PI / 2);
    if (axis === "x") geometry.rotateZ(Math.PI / 2);
    shape(geometry, color, x, y, z);
  };
  const plaque = (label: string, caption: string, x: number, y: number, z: number, yellow = false) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 144;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = yellow ? "#f7c827" : "#164657";
    ctx.fillRect(0, 0, 512, 144);
    ctx.strokeStyle = yellow ? "#393228" : "#f1dfb1";
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 496, 128);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = yellow ? "#33281d" : "#fff5d7";
    ctx.font = "bold 47px sans-serif";
    ctx.fillText(label, 256, caption ? 53 : 72, 459);
    if (caption) {
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(caption, 256, 105, 451);
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.02), new THREE.MeshBasicMaterial({ map }));
    mesh.position.set(x, y, z);
    group.add(mesh); meshes.push(mesh);
  };
  const wood = 0x805037, slate = 0x454e56, stone = 0xb6aa93, green = 0x3f743c;
  const ivory = 0xf5eedb, iron = 0x31393d, blue = 0x2571ac, gold = 0xe9b246;

  switch (model.slice(9)) {
    case "peak": {
      const n = 9, positions: number[] = [], colors: number[] = [];
      const seed = Number(obj.properties?.stone ?? 0);
      const point = (i: number, ridge: boolean) => {
        const t = i * Math.PI * 2 / n;
        const radius = ridge ? 0.50 + 0.12 * Math.sin(i * 4.2 + seed) : 1;
        return [Math.cos(t) * radius, ridge ? 0.47 + 0.15 * Math.sin(i * 2.5 + seed) : 0, Math.sin(t) * radius];
      };
      const face = (a: number[], b: number[], c: number[], shade: number) => {
        positions.push(...a, ...b, ...c);
        const tint = new THREE.Color(shade);
        for (let i = 0; i < 3; i++) colors.push(tint.r, tint.g, tint.b);
      };
      const rock = [0x727b7b,0x8c8f85,0x9b9d90,0x687372,0xb1b4a8];
      for (let i = 0; i < n; i++) {
        const a = point(i,false), b = point(i+1,false), c = point(i,true), d = point(i+1,true);
        face(a,c,b,rock[i%5]); face(b,c,d,rock[(i+1)%5]);
        face(c,[0.14,1,-0.12],d,rock[(i+2)%5]);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));
      geometry.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));
      geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry,new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }));
      group.add(mesh); meshes.push(mesh);
      break;
    }
    case "cathedral":
      box(5.8,5,3.2,0,2.5,0,stone);
      box(1.7,8.8,2,1.65,4.4,0.45,0xc1b69f);
      tube(0,.96,2.55,1.65,10.07,.45,slate,"y",4);
      for (const x of [-1.65,-.35,1.65]) {
        box(.6,1.7,.08,x,3,1.64,slate);
        box(.82,.16,.16,x,3.9,1.7,ivory);
      }
      oval(.53,.53,.05,-.82,4.2,1.66,0x4a5e73);
      box(1.2,2.2,.13,-.82,1.1,1.68,wood);
      box(6,0.18,3.4,0,4.95,0,slate);
      break;
    case "fountain":
      tube(1.64,1.76,.26,0,.13,0,stone);
      tube(1.43,1.43,.035,0,.27,0,0x5aabb5);
      tube(.20,.38,.72,0,.49,0,stone);
      tube(.73,.4,.18,0,.84,0,ivory);
      oval(.08,.66,.08,0,1.2,0,0xafe4e1);
      break;
    case "sign":
      for (const x of [-1.4,1.4]) box(.10,1.85,.10,x,.93,-.07,iron);
      box(3.66,1.08,.12,0,1.56,0,iron);
      plaque(String(obj.properties?.label ?? "ASTURIAS"), String(obj.properties?.caption ?? ""), 0,1.56,.065,Boolean(obj.properties?.yellow));
      break;
    case "sidreria":
      box(4.8,3.35,2.4,0,1.67,0,0xc2a07e);
      box(4.95,.25,2.6,0,3.36,0,slate);
      box(1.1,1.85,.12,0,.93,1.21,wood);
      for (const x of [-1.55,1.55]) box(.95,.82,.09,x,1.47,1.22,0x37565d);
      box(4.4,.13,.7,0,1.99,1.48,0x557348);
      plaque("SIDRERÍA","LLAGAR ASTURIANU",0,2.63,1.23);
      break;
    case "bronze":
      box(1.7,.55,1.3,0,.28,0,stone);
      oval(.34,.66,.26,0,1.25,0,0x52746b);
      oval(.24,.25,.22,0,1.98,0,0x62827a);
      for (const x of [-.19,.19]) box(.21,.68,.23,x,.82,0,0x4b6d62);
      break;
    case "flag":
      tube(.06,.07,3.4,0,1.7,0,iron);
      box(1.62,.98,.055,.84,2.82,0,blue);
      box(.10,.66,.06,.79,2.82,.033,gold);
      box(.47,.10,.06,.79,2.89,.034,gold);
      break;
    case "lamp":
      tube(.06,.16,2.65,0,1.32,0,iron);
      box(.34,.41,.34,0,2.81,0,0xffe2a5);
      tube(.03,.28,.22,0,3.1,0,iron,"y",4);
      break;
    case "bench":
      for (const x of [-1.07,1.07]) box(.15,.6,.65,x,.31,0,iron);
      for (let i=0;i<3;i++) box(2.65,.1,.20,0,.65,(i-1)*.23,wood);
      for (let i=0;i<2;i++) box(2.65,.15,.09,0,.94+i*.22,-.36,wood);
      break;
    case "apple_tree":
      tube(.13,.27,2,0,1,0,wood,"y",8);
      for (const [i,x] of [-.72,0,.72].entries()) oval(.95,1.10,.95,x,2.36+(i%2)*.46,0,green);
      for (let i=0;i<12;i++) oval(.105,.105,.1,Math.sin(i*2.4)*1.23,2+i%4*.34,Math.cos(i*2.4)*.88,0xc74432);
      break;
    case "horreo":
      for (const x of [-1.32,1.32]) for (const z of [-.87,.87]) {
        tube(.14,.23,1.2,x,.61,z,stone,"y",4);
        tube(.33,.33,.13,x,1.27,z,stone);
      }
      box(3.4,1.35,2.45,0,2.05,0,wood);
      for (let i=0;i<8;i++) box(.08,1.25,.06,(i-3.5)*.4,2.05,1.25,0x543727);
      shape(new THREE.CylinderGeometry(0,2.67,1.1,4).rotateY(Math.PI/4).scale(1,1,.75),slate,0,3.1,0);
      break;
    case "cider":
      tube(.76,.72,1.25,-.7,.66,0,wood);
      for (const y of [.24,1.08]) tube(.79,.79,.09,-.7,y,0,iron);
      for (const x of [.35,.86,1.37]) {
        tube(.16,.19,.69,x,.35,0,0x54713d);
        tube(.076,.15,.16,x,.77,0,0x54713d);
        tube(.07,.075,.27,x,.96,0,0x54713d);
        box(.19,.22,.025,x,.39,.182,ivory);
      }
      break;
    case "cheese":
      tube(.87,.87,.32,0,.19,0,0xb4a882);
      tube(.78,.78,.042,0,.36,0,ivory);
      for (let i=0;i<12;i++) oval(.032,.018,.04,Math.sin(i*4)*.65,.386,Math.cos(i*2.3)*.58,0x63857f);
      break;
    case "bagpipe":
      oval(.69,.42,.35,0,.46,0,0x9f283b);
      for (let i=0;i<3;i++) {
        tube(.045,.057,.95+i*.21,-.35+i*.28,1.03+i*.12,0,wood);
        tube(.075,.075,.07,-.35+i*.28,1.5+i*.22,0,ivory);
      }
      break;
    case "cow":
      oval(1.1,.66,.55,0,1.04,0,ivory);
      oval(.48,.47,.43,1.02,1.24,0,ivory);
      oval(.27,.19,.31,1.37,1.11,0,0xd99d91);
      for (const x of [-.65,.65]) for (const z of [-.34,.34]) box(.15,.64,.16,x,.35,z,slate);
      oval(.4,.45,.16,-.43,1.08,.45,0x464440);
      oval(.37,.31,.15,.46,1.19,-.46,0x464440);
      for (const z of [-.39,.39]) oval(.15,.085,.16,1,1.49,z,0x735544);
      break;
    case "stone_wall":
      for (let row=0;row<3;row++) for (let i=0;i<8;i++)
        box(.43,.24,.46,(i-3.5)*.46+(row%2)*.15,.13+row*.23,0,(i+row)%2 ? stone : 0x828478);
      break;
    case "cart":
      box(2.5,.24,1.25,0,.68,0,wood);
      for (const z of [-.72,.72]) tube(.54,.54,.12,0,.55,z,iron,"z");
      for (const x of [-.3,.3]) box(.11,.11,1.4,x,.65,1.09,wood);
      break;
    case "marking":
      box(1,.015,1,0,0,0,ivory);
      break;
    case "car":
      box(2.9,.68,5.3,0,.68,0,0x47717e);
      box(2.51,.77,2.83,0,1.39,-.26,0x284a58);
      box(2.64,.12,3,0,1.82,-.24,0x47717e);
      for (const x of [-1.4,1.4]) for (const z of [-1.68,1.68]) tube(.42,.42,.28,x,.42,z,iron,"x");
      for (const x of [-.99,.99]) box(.48,.23,.07,x,.72,-2.67,ivory);
      break;
    case "beach":
      tube(.06,.065,2.23,0,1.11,0,wood);
      tube(.02,1.35,.56,0,2.30,0,0xe6a44b,"y",8);
      box(1.45,.15,.62,.9,.33,.25,ivory);
      break;
    case "lighthouse":
      tube(.65,.95,5,0,2.5,0,ivory);
      tube(.68,.69,.67,0,3.45,0,0xb65347);
      tube(.52,.52,.76,0,5.36,0,0xffd382);
      tube(.06,.78,.65,0,6.02,0,slate);
      break;
    case "buoy":
      oval(.48,.56,.48,0,.2,0,0xef794c);
      tube(.045,.045,.72,0,.79,0,iron);
      oval(.14,.14,.14,0,1.18,0,ivory);
      break;
    case "gull":
      oval(.32,.23,.54,0,0,0,ivory);
      oval(.21,.22,.25,0,.19,.36,ivory);
      tube(0,.088,.29,0,.17,.66,gold,"z",7);
      for (const side of [-1,1]) {
        const wing = new THREE.Group();
        wing.name = side < 0 ? "wing-left" : "wing-right";
        const feather = new THREE.Mesh(new THREE.SphereGeometry(1,8,5),new THREE.MeshLambertMaterial({ color: 0xa6afaf }));
        feather.scale.set(.68,.07,.28);
        feather.position.x = side*.59;
        wing.add(feather); group.add(wing); meshes.push(feather);
      }
      break;
    case "shelf": {
      // Length is baked into the model so repeating packs keep their size.
      const length = obj.scale.x;
      box(length,2.95,.52,0,1.48,0,0xe2ab19);
      for (const y of [.46,1.29,2.10,2.93]) box(length,.10,.81,0,y,0,0xffd64b);
      const count = Math.min(48,Math.floor(length/.49));
      const packs = [0x50767d,0xc45a47,0xe7dfb9,0x658147];
      for (let i=0;i<count;i++) for (let row=0;row<3;row++) {
        const x = (i+.5)*length/count-length/2;
        box(.27,.30+(i%3)*.045,.07,x,.67+row*.82,.29,packs[(i+row)%4]);
        box(.27,.30+(i%3)*.045,.07,x,.67+row*.82,-.29,packs[(i+row+2)%4]);
      }
      break;
    }
    case "pan":
      tube(8.4,7.5,1.2,0,1.1,0,iron,"y",32);
      tube(8.4,8.35,.15,0,1.77,0,slate,"y",32);
      box(3,1.2,8,0,1,11,iron);
      for (let i=0;i<14;i++) {
        const curve = new THREE.CatmullRomCurve3(Array.from({length:12},(_,j)=> {
          const t=j/11*5.2;
          return new THREE.Vector3(Math.cos(t+i)* (2.4+i*.28),2.06+Math.sin(t*3+i)*.065,Math.sin(t+i)*(2.4+i*.28));
        }));
        shape(new THREE.TubeGeometry(curve,20,.075,4), i%2 ? gold : 0xe9c371,0,0,0);
      }
      break;
    case "mafalda":
      oval(.62,.79,.37,0,1.14,0,0xc74643);
      oval(.72,.72,.52,0,2.39,-.12,0x292522);
      oval(.58,.53,.34,0,2.34,.22,0xefbd90);
      for (const x of [-.24,.24]) oval(.05,.085,.038,x,2.4,.53,0x272420);
      for (const x of [-.36,-.08,.22]) oval(.24,.17,.19,x,2.72,.34,0x292522);
      oval(.24,.14,.13,-.59,2.83,-.01,0xdd544b);
      for (const x of [-.27,.27]) {
        oval(.16,.38,.14,x,.49,0,0xf0d7b8);
        oval(.22,.16,.34,x,.17,.12,0x302a29);
        const arm = new THREE.Group();
        arm.name = x < 0 ? "hand-left" : "hand-right";
        arm.position.set(x*1.87,1.55,.12);
        const hand = new THREE.Mesh(new THREE.CapsuleGeometry(.15,.68,3,8),new THREE.MeshLambertMaterial({ color: 0xefbd90 }));
        hand.rotation.x = Math.PI/2;
        hand.position.z = .55;
        arm.add(hand); group.add(arm); meshes.push(hand);
      }
      break;
    case "plate":
      tube(.99,.81,.34,0,.12,0,ivory,"y",32);
      tube(.94,.94,.035,0,.31,0,0x658fa1,"y",32);
      tube(.88,.88,.045,0,.34,0,ivory,"y",32);
      break;
    default:
      return null;
  }
  if (buckets.size > 0) {
    const parts: THREE.BufferGeometry[] = [];
    for (const [color, geometries] of buckets) {
      const tint = new THREE.Color(color);
      for (const geometry of geometries) {
        const count = geometry.getAttribute("position").count;
        const colors = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) tint.toArray(colors, i * 3);
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        parts.push(geometry);
      }
    }
    const merged = mergeGeometries(parts);
    for (const geometry of parts) geometry.dispose();
    if (merged) {
      const mesh = new THREE.Mesh(merged, new THREE.MeshLambertMaterial({ vertexColors: true }));
      group.add(mesh);
      meshes.push(mesh);
    }
  }
  group.position.set(obj.position.x,obj.position.y,obj.position.z);
  group.rotation.set(Number(obj.properties?.pitch ?? obj.rotation.x),obj.rotation.y,obj.rotation.z,"YXZ");
  group.scale.set(model === "asturias_shelf" ? 1 : obj.scale.x,obj.scale.y,obj.scale.z);
  return { group, meshes };
}
