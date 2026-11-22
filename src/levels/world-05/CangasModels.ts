import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { LevelObjectData, Vector3Data } from "../LevelTypes";

type Model = { group: THREE.Group; meshes: THREE.Mesh[] };
type Point = [number, number, number];
const tau = Math.PI * 2;

class ColoredSurface {
  private readonly vertices: number[] = [];
  private readonly colors: number[] = [];
  private readonly uv: number[] = [];
  private readonly tint = new THREE.Color();

  quad(a: Point, b: Point, c: Point, d: Point, color: number, u0 = 0, u1 = 1, v0 = 0, v1 = 1): void {
    this.vertices.push(...a, ...b, ...c, ...a, ...c, ...d);
    this.tint.setHex(color);
    for (let i = 0; i < 6; i++) this.colors.push(this.tint.r, this.tint.g, this.tint.b);
    this.uv.push(u0,v0,u1,v0,u1,v1,u0,v0,u1,v1,u0,v1);
  }

  geometry(): THREE.BufferGeometry {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(this.vertices,3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(this.colors,3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(this.uv,2));
    geo.computeVertexNormals();
    return geo;
  }

  mesh(map?: THREE.Texture): THREE.Mesh {
    return new THREE.Mesh(this.geometry(),new THREE.MeshLambertMaterial({ vertexColors:true, side:THREE.DoubleSide, map:map ?? null }));
  }
}

let cobbleTexture: THREE.CanvasTexture | undefined;
function cobbles(): THREE.CanvasTexture {
  if (cobbleTexture) return cobbleTexture;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#514e48";
  ctx.fillRect(0,0,256,256);
  const shades = ["#a39a88","#8e877b","#b5ad99","#96968b","#b4aa92"];
  for (let row=0;row<8;row++) for (let col=-1;col<8;col++) {
    const x=col*32+(row%2)*16, y=row*32;
    ctx.fillStyle=shades[((row*13+col*7)%5+5)%5];
    ctx.beginPath();
    ctx.roundRect(x+1.4,y+1.4,29,29,4);
    ctx.fill();
    for (let i=0;i<13;i++) {
      ctx.fillStyle=i%2 ? "#30281b26" : "#eae4c937";
      ctx.fillRect(x+4+(i*17)%23,y+4+(i*11)%23,1+i%3,1);
    }
  }
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS=map.wrapT=THREE.RepeatWrapping;
  map.colorSpace=THREE.SRGBColorSpace;
  map.anisotropy=4;
  cobbleTexture=map;
  return map;
}

function createTrack(obj: LevelObjectData): THREE.Mesh {
  const surface = new ColoredSurface();
  const props = obj.properties ?? {};
  const points = Array.isArray(props.points) ? props.points as Vector3Data[] : [];
  const width = Number(props.width ?? 6);
  const style = props.style;
  const holes = Array.isArray(props.holes) ? props.holes as number[] : [];
  const rows = points.map((p,i) => {
    const a=points[Math.max(0,i-1)], b=points[Math.min(points.length-1,i+1)];
    const dx=b.x-a.x, dz=b.z-a.z, length=Math.hypot(dx,dz) || 1;
    const taper=props.taper ? .8+.2*(.5+.5*Math.cos(i*.16)) : 1;
    return { p, nx:-dz/length, nz:dx/length, half:width*taper/2 };
  });
  const vertex = (row: number, across: number, up=0): Point => {
    const { p,nx,nz,half }=rows[row];
    const bank = style === "pipe" ? .65 * across * across : 0;
    return [p.x+nx*across*half,p.y+up+bank,p.z+nz*across*half];
  };
  let distance = 0;
  for (let i=0;i<rows.length-1;i++) {
    const start=distance;
    const p=points[i], n=points[i+1];
    distance+=Math.hypot(n.x-p.x,n.y-p.y,n.z-p.z);
    const strip = (lo: number, hi: number, color: number) =>
      surface.quad(vertex(i,lo),vertex(i,hi),vertex(i+1,hi),vertex(i+1,lo),color,lo*width/4,hi*width/4,start/2,distance/2);
    if (style==="pipe") {
      const hole = holes.findIndex(at=>i>=at && i<at+3);
      for (let lane=0;lane<4;lane++) {
        if (hole>=0 && (hole%2===0 ? lane<2 : lane>=2)) continue;
        strip(lane*.5-1,(lane+1)*.5-1,hole>=0 ? 0xe8ad52 : lane%2 ? 0x738a89 : 0x7f9692);
      }
    } else if (style==="road") {
      strip(-1,-.91,0xd1c6a9); strip(-.91,-.016,0x343d45);
      strip(-.016,.016,start%7<3.5 ? 0xf1c463 : 0x343d45);
      strip(.016,.91,0x343d45); strip(.91,1,0xd1c6a9);
    } else if (style==="trail") {
      strip(-1,-.77,0x759655); strip(-.77,.77,i%3===0 ? 0xb1a47e : 0xa89b74); strip(.77,1,0x759655);
    } else if (style === "ice") {
      strip(-.94,.94,0xeac593);
      for (const side of [-1,1]) for (let k=0;k<4;k++) {
        const a=k*Math.PI/8,b=(k+1)*Math.PI/8;
        const acrossA=side*(.94+.06*Math.sin(a)),acrossB=side*(.94+.06*Math.sin(b));
        surface.quad(vertex(i,acrossA,-.14*(1-Math.cos(a))),vertex(i,acrossB,-.14*(1-Math.cos(b))),
          vertex(i+1,acrossB,-.14*(1-Math.cos(b))),vertex(i+1,acrossA,-.14*(1-Math.cos(a))),0xe4b986);
      }
    } else {
      strip(-1,1,style==="bridge" ? 0xffffff : style==="ice" ? 0xeac593 : i%4===0 ? 0x89a188 : 0x778f78);
    }
    for (const side of [-1,1]) {
      // A shallow side skirt gives the road and trail depth without adding a second collider.
      const top=style==="ice" ? -.14 : 0;
      surface.quad(vertex(i,side,-.36),vertex(i,side,top),vertex(i+1,side,top),vertex(i+1,side,-.36),
        style==="trail" ? 0x796d56 : style==="bridge" ? 0xbeb5a3 : 0x475557);
      if (style==="pipe" || props.rails) {
        const height=style==="bridge" ? .9 : style==="pipe" ? 1.35 : .45;
        const color=style==="bridge" ? 0xe2daca : style==="ice" ? 0xf8dfb1 : 0x95a9a2;
        surface.quad(vertex(i,side),vertex(i,side,height),vertex(i+1,side,height),vertex(i+1,side),color,
          0,.5,start/2,distance/2);
      }
    }
  }
  return surface.mesh(style==="bridge" ? cobbles() : undefined);
}

export const FABADA_FLOOR_Y = -4.2;

export function createFabadaIngredientGeometry(ingredient:ReturnType<typeof fabadaIngredients>[number]):THREE.BufferGeometry {
  const [w,h,d]=ingredient.size;
  return new THREE.SphereGeometry(1,12,8).scale(w,h,d).rotateY(ingredient.yaw)
    .translate(ingredient.x,FABADA_FLOOR_Y+h*.74,ingredient.z);
}

/** Shared visible and physical bowl surface, including its sloping interior. */
export function createFabadaBowlGeometry(includeFloor=true): THREE.BufferGeometry {
  const surface=new ColoredSurface();
  const profile=[[0,-4.2],[15.8,-4.2],[17.3,-3.9],[19,-2.3],[20.5,.8],[21.4,1.1],[21.6,.9],[20.2,-4.9]];
  for(let i=0;i<72;i++) {
    const a=i*tau/72,b=(i+1)*tau/72;
    for(let j=includeFloor ? 0 : 1;j<profile.length-1;j++) {
      const [r,y]=profile[j],[s,z]=profile[j+1];
      surface.quad([Math.sin(a)*r,y,Math.cos(a)*r],[Math.sin(b)*r,y,Math.cos(b)*r],
        [Math.sin(b)*s,z,Math.cos(b)*s],[Math.sin(a)*s,z,Math.cos(a)*s],
        j<2 ? 0xb86b36 : j<4 ? 0xd49a5b : j===5 ? 0x457b89 : 0xf0dfbf);
    }
  }
  return surface.geometry();
}

export function fabadaIngredients() {
  return Array.from({length:44},(_,i) => {
    const angle=i*2.399963;
    const radius=2.6+Math.sqrt(i/43)*11.7;
    const meat=i%5===0;
    return { x:Math.sin(angle)*radius, z:Math.cos(angle)*radius, yaw:angle,
      size:meat ? [1.95,1.05,1.4] : [1.3+(i%3)*.16,.64,.9],
      color:meat ? (i%2 ? 0x80373b : 0xa3432d) : (i%3 ? 0xf3d4a4 : 0xfce5bd) };
  }).filter(p=>Math.hypot(p.x-13.5,p.z+3)>3.3);
}

let badges: THREE.CanvasTexture[] | undefined;
function magnetBadges(): THREE.CanvasTexture[] {
  if (badges) return badges;
  badges = ["ASTURIAS","PICU URRIELLU","HÓRREO","CANGAS"].map((label,i) => {
    const canvas=document.createElement("canvas");
    canvas.width=256;canvas.height=128;
    const ctx=canvas.getContext("2d")!;
    ctx.fillStyle=["#17577d","#386858","#9d6140","#65567b"][i];
    ctx.fillRect(0,0,256,128);
    ctx.strokeStyle="#f9db8e";ctx.lineWidth=3;ctx.strokeRect(8,8,240,112);
    ctx.fillStyle="#ffdf86";
    if (i===0) {
      ctx.fillRect(123,19,10,48);ctx.fillRect(102,34,52,9);
    } else if (i===1) {
      ctx.beginPath();ctx.moveTo(85,68);ctx.lineTo(120,21);ctx.lineTo(143,45);ctx.lineTo(155,34);ctx.lineTo(175,68);ctx.fill();
    } else if (i===2) {
      ctx.fillRect(100,41,56,22);ctx.fillRect(105,63,7,8);ctx.fillRect(144,63,7,8);
      ctx.beginPath();ctx.moveTo(94,42);ctx.lineTo(128,22);ctx.lineTo(162,42);ctx.fill();
    } else {
      ctx.beginPath();ctx.arc(128,69,35,Math.PI,2*Math.PI);ctx.lineWidth=8;ctx.stroke();
    }
    ctx.font="900 24px sans-serif";ctx.textAlign="center";ctx.fillText(label,128,102,230);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    return texture;
  });
  return badges;
}

function bridgeArch(): THREE.Mesh {
  const surface=new ColoredSurface();
  const deck=(z: number)=>9+7.25*(1-Math.pow(Math.abs(z)/29,1.55))-.19;
  const underside=(z: number)=>{
    const absolute=Math.abs(z);
    if (absolute<=17) return .9+12.25*Math.sqrt(Math.max(0,1-(absolute/17)**2));
    if (absolute>=18 && absolute<=28) return .9+5.8*Math.sqrt(Math.max(0,1-((absolute-23)/5)**2));
    return .9;
  };
  const shades=[0xa69b86,0xb8ab93,0x9e9689,0xb9b3a3];
  for (let i=0;i<116;i++) {
    const a=-29+i*.5,b=a+.5;
    for (const x of [-3.62,3.62]) {
      surface.quad([x,underside(a),a],[x,underside(b),b],[x,deck(b),b],[x,deck(a),a],
        shades[(i*13)%4],a/2,b/2,0,3.5);
      surface.quad([x*1.018,underside(a),a],[x*1.018,underside(b),b],[x*1.018,underside(b)+.54,b],[x*1.018,underside(a)+.54,a],
        i%3 ? 0xe3d3b4 : 0xad9c7d,a/2,b/2,0,.5);
    }
    surface.quad([-3.62,underside(a),a],[3.62,underside(a),a],[3.62,underside(b),b],[-3.62,underside(b),b],0x8c8677);
  }
  return surface.mesh(cobbles());
}

export function createCangasModel(obj: LevelObjectData): Model | null {
  const kind=String(obj.properties?.subType ?? "");
  if (!kind.startsWith("asturias_cangas_")) return null;
  const group=new THREE.Group(), meshes:THREE.Mesh[]=[];
  const parts:THREE.BufferGeometry[]=[];
  const tint=new THREE.Color();
  const part=(geo:THREE.BufferGeometry,color:number,x=0,y=0,z=0)=>{
    geo.translate(x,y,z);
    const count=geo.getAttribute("position").count;
    const colors=new Float32Array(count*3);
    tint.setHex(color);
    for (let i=0;i<count;i++) tint.toArray(colors,i*3);
    geo.setAttribute("color",new THREE.BufferAttribute(colors,3));
    parts.push(geo);
  };
  const box=(w:number,h:number,d:number,x:number,y:number,z:number,color:number)=>
    part(new THREE.BoxGeometry(w,h,d),color,x,y,z);
  const oval=(w:number,h:number,d:number,x:number,y:number,z:number,color:number,yaw=0)=>
    part(new THREE.SphereGeometry(1,12,8).scale(w,h,d).rotateY(yaw),color,x,y,z);
  const ring=(radius:number,thickness:number,color:number,y:number)=>{
    part(new THREE.TorusGeometry(radius,thickness,5,44).rotateX(-Math.PI/2),color,0,y,0);
  };
  const mesh=(geometry:THREE.BufferGeometry,material:THREE.Material,name?:string)=>{
    const item=new THREE.Mesh(geometry,material);
    if(name) item.name=name;
    group.add(item);meshes.push(item);
    return item;
  };
  switch (kind.slice(16)) {
    case "track": {
      const deck=createTrack(obj); group.add(deck); meshes.push(deck); break;
    }
    case "bridge": {
      const arch=bridgeArch(); group.add(arch); meshes.push(arch);
      box(.055,5.05,.055,4.1,10.64,0,0x554c39);
      break;
    }
    case "cross":
      box(.23,2.8,.13,0,1.39,0,0xe6bd56);
      box(1.65,.23,.13,0,1.77,0,0xf3c861);
      for (const x of [-.74,.74]) {
        box(.08,.49,.10,x,1.40,0,0xe6bd56);
        oval(.13,.14,.065,x,1.15,0,0xf3c861);
      }
      oval(.15,.15,.08,0,1.77,.1,0x4b83a4);
      break;
    case "chapel":
      box(6,3.55,4.2,0,1.77,0,0xbfb09a);
      part(new THREE.CylinderGeometry(0,3.9,1.4,4).rotateY(Math.PI/4).scale(1,1,.73),0x715549,0,4.12,0);
      box(2.2,1.65,.5,0,4.55,1.7,0xbfb09a);
      box(.75,.81,.57,0,4.52,1.7,0x504738);
      box(1.35,1.95,.1,0,.98,2.13,0x71513e);
      break;
    case "dolmen":
      for (const x of [-1.35,1.35]) part(new THREE.DodecahedronGeometry(1,0).scale(.46,1.09,.72),0x918d7f,x,1,0);
      part(new THREE.DodecahedronGeometry(1,0).scale(2.12,.45,1.22),0xb4ad9b,0,2.09,0);
      break;
    case "kayak":
      oval(.49,.25,2.23,0,.28,0,0xe57d35);
      oval(.27,.08,.57,0,.53,.12,0x3d4650);
      part(new THREE.CylinderGeometry(.035,.035,3.1,7).rotateZ(Math.PI/2),0xc7b898,0,.61,-.28);
      for (const x of [-1.39,1.39]) oval(.31,.06,.14,x,.61,-.28,0x26798e);
      break;
    case "open_horreo":
      for (const x of [-1.35,1.35]) for (const z of [-1.2,1.2]) {
        box(.29,1.65,.29,x,.84,z,0x9e9d8f);
        box(.55,.15,.55,x,1.67,z,0xb5ac98);
      }
      box(3.5,1.50,.16,0,3.16,-1.35,0x8d6748);
      for (const x of [-1.67,1.67]) box(.19,1.50,2.65,x,3.16,0,0x8d6748);
      for (const x of [-1.32,1.32]) box(.70,1.5,.16,x,3.16,1.37,0x986e4d);
      part(new THREE.CylinderGeometry(0,2.8,1.05,4).rotateY(Math.PI/4),0x494b4b,0,4.24,0);
      break;
    case "jump_pad":
      box(obj.scale.x,.035,.66,0,0,0,0xd58337);
      for (let i=0;i<3;i++) box(.55,.04,.16,(i-1)*1.12,.022,0,0xffe1a1);
      break;
    case "aircon":
      box(3.3,5.1,57,0,2.55,0,0xdbe4df);
      box(3.35,.38,57.15,0,4.87,0,0x75969c);
      for (const z of [21,7,-7,-21]) {
        box(.11,2.30,4.65,-1.67,1.57,z,0x263c47);
        for (let k=0;k<9;k++) box(.14,.09,4.37,-1.76,.6+k*.24,z,0x77949b);
        box(.14,.18,.37,-1.77,3.42,z,0x65d3cd);
      }
      break;
    case "air_jet": {
      const vertices:number[]=[];
      for (let i=0;i<22;i++) {
        const x=-((i*17.37)%11.8), y=((i*5.3)%1.85)-.66, z=((i*1.139)%2.7)-1.35;
        vertices.push(x,y,z,x-.65-(i%4)*.19,y+.1,z);
      }
      const geo=new THREE.BufferGeometry();
      geo.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));
      const lines=new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:0xaeefff,transparent:true,opacity:.8,depthWrite:false}));
      lines.name="air-stream";group.add(lines);break;
    }
    case "magnet": {
      box(2.62,.56,1.83,0,.36,0,0x315a70);
      for (const x of [-.91,.91]) box(.46,.52,.67,x,.09,0,0xcd5a49);
      const badge=Number(obj.properties?.badge ?? 0);
      const label=mesh(new THREE.PlaneGeometry(2.44,.8),new THREE.MeshBasicMaterial({map:magnetBadges()[badge%4],side:THREE.DoubleSide}));
      label.position.set(0,.47,.922);
      break;
    }
    case "magnet_zone":
      ring(1.51,.032,0xc56f51,0);
      break;
    case "fabada":
      mesh(createFabadaBowlGeometry(),new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide}));
      ring(21.35,.13,0x417685,1.1);
      for (let i=0;i<32;i++) {
        const a=i*tau/32;
        oval(.44,.022,.24,Math.sin(a)*15.1,FABADA_FLOOR_Y+.009,Math.cos(a)*15.1,0xdd9654,a);
      }
      for (const ingredient of fabadaIngredients()) {
        const [w,h,d]=ingredient.size;
        part(createFabadaIngredientGeometry(ingredient),ingredient.color);
        oval(w*.6,.06,d*.55,ingredient.x,FABADA_FLOOR_Y+h*1.61,ingredient.z,0xe0a879,ingredient.yaw);
      }
      break;
    default:
      return null;
  }
  if (parts.length) {
    const geometry=mergeGeometries(parts);
    if(geometry) mesh(geometry,new THREE.MeshLambertMaterial({vertexColors:true}));
    for(const source of parts) source.dispose();
  }
  group.position.copy(obj.position);
  group.rotation.set(Number(obj.properties?.pitch ?? obj.rotation.x),obj.rotation.y,obj.rotation.z,"YXZ");
  group.scale.set(kind==="asturias_cangas_jump_pad" ? 1 : obj.scale.x,obj.scale.y,obj.scale.z);
  return {group,meshes};
}
