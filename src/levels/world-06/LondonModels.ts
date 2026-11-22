import * as THREE from "three";
import {mergeGeometries} from "three/addons/utils/BufferGeometryUtils.js";
import type {LevelObjectData,Vector3Data} from "../LevelTypes";
import type {LondonMaze} from "./LondonRoutes";
import {planePose,trainPose,crowPitch,hairPose,HAIR_HOT_LENGTH,londonMaze} from "./LondonRoutes";
import {buildRiverFrames} from "../world-05/SellaRiver";

export interface LondonModel {group:THREE.Group;meshes:THREE.Mesh[]}
export {Batch as LondonBatch,label as londonLabel,pine as londonPine};
const tau=Math.PI*2,red=0xb92d36,navy=0x24384f,snow=0xe3e9e8,gold=0xe2bd70,green=0x335c47;
class Batch {
  private readonly bins=new Map<string,THREE.BufferGeometry[]>();
  add(g:THREE.BufferGeometry,c:number,p:Vector3Data={x:0,y:0,z:0},r:Vector3Data={x:0,y:0,z:0},kind="solid") {
    g.rotateX(r.x).rotateY(r.y).rotateZ(r.z).translate(p.x,p.y,p.z);
    const geo=g.index ? g.toNonIndexed():g;geo.deleteAttribute("uv");
    if(c>=0) {
      const colour=new THREE.Color(c),values=new Float32Array(geo.getAttribute("position").count*3);
      for(let i=0;i<values.length;i+=3) colour.toArray(values,i);
      geo.setAttribute("color",new THREE.BufferAttribute(values,3));
    }
    const list=this.bins.get(kind)??[];list.push(geo);this.bins.set(kind,list);if(g!==geo) g.dispose();
  }
  box(w:number,h:number,d:number,x:number,y:number,z:number,c:number,kind="solid") {this.add(new THREE.BoxGeometry(w,h,d),c,{x,y,z},undefined,kind);}
  ball(x:number,y:number,z:number,rx:number,ry:number,rz:number,c:number,kind="solid") {this.add(new THREE.SphereGeometry(1,12,8).scale(rx,ry,rz),c,{x,y,z},undefined,kind);}
  cylinder(r:number,h:number,x:number,y:number,z:number,c:number,kind="solid",segments=16) {this.add(new THREE.CylinderGeometry(r,r,h,segments),c,{x,y,z},undefined,kind);}
  ring(r:number,t:number,x:number,y:number,z:number,c:number,flat=false,kind="solid") {this.add(new THREE.TorusGeometry(r,t,7,32),c,{x,y,z},flat ? {x:Math.PI/2,y:0,z:0}:undefined,kind);}
  finish(group:THREE.Group):THREE.Mesh[] {
    const meshes:THREE.Mesh[]=[];
    for(const [kind,list] of this.bins) {
      const geometry=mergeGeometries(list);list.forEach(g=>g.dispose());if(!geometry) continue;
      const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:kind==="metal" ? .35:.82,metalness:kind==="metal" ? .5:0,side:THREE.DoubleSide,
        emissive:kind==="glow" ? 0xffd59a:0,emissiveIntensity:kind==="glow" ? .65:0});
      const mesh=new THREE.Mesh(geometry,material);mesh.name=`london-${kind}`;group.add(mesh);meshes.push(mesh);
    }
    return meshes;
  }
}
function label(group:THREE.Group,text:string,x:number,y:number,z:number,w=3,h=.65,bg="#24384f",fg="#ffffff") {
  if(typeof document==="undefined") return;
  const canvas=document.createElement("canvas");canvas.width=768;canvas.height=128;const ctx=canvas.getContext("2d");if(!ctx) return;
  ctx.fillStyle=bg;ctx.fillRect(0,0,768,128);ctx.fillStyle=fg;ctx.font="600 62px Arial";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(text,384,68,735);
  const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
  const material=new THREE.MeshBasicMaterial({map,side:THREE.DoubleSide});material.addEventListener("dispose",()=>map.dispose());
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);mesh.position.set(x,y,z);mesh.name="london-lettering";group.add(mesh);
}
function pine(b:Batch,x:number,y:number,z:number,s=1) {
  b.cylinder(.18*s,1.2*s,x,y+.6*s,z,0x68533c);
  for(let i=0;i<4;i++) {
    b.add(new THREE.ConeGeometry((1.6-i*.29)*s,2.1*s,12),green,{x,y:y+(1.65+i*.75)*s,z});
    b.add(new THREE.ConeGeometry((1.25-i*.23)*s,.45*s,12),snow,{x,y:y+(2.35+i*.75)*s,z});
  }
}
function lamp(b:Batch,x:number,y:number,z:number,s=1) {
  b.cylinder(.3*s,.35*s,x,y+.175*s,z,navy);b.cylinder(.075*s,4*s,x,y+2*s,z,navy,"metal");
  b.box(.5*s,.7*s,.5*s,x,y+4.1*s,z,0xffd99b,"glow");b.add(new THREE.ConeGeometry(.45*s,.35*s,4),navy,{x,y:y+4.63*s,z});
}
function house(b:Batch,x:number,y:number,z:number,s=1,tone=0x916d65) {
  b.box(7*s,10*s,7*s,x,y+5*s,z,tone);b.box(7.6*s,.35*s,7.6*s,x,y+10.05*s,z,snow);
  b.box(1.3*s,2.4*s,.1*s,x,y+1.2*s,z+3.55*s,navy);
  for(const dx of [-2.1,0,2.1]) for(const dy of [4.3,7.5]) {
    b.box(1.45*s,1.9*s,.08*s,x+dx*s,y+dy*s,z+3.55*s,0xffd8a0,"glow");
    b.box(.1*s,2*s,.12*s,x+dx*s,y+dy*s,z+3.6*s,snow);b.box(1.55*s,.1*s,.12*s,x+dx*s,y+dy*s,z+3.61*s,snow);
  }
  b.box(1*s,1.8*s,1*s,x+2*s,y+10.8*s,z,0x765d5b);
}
function star(b:Batch,x:number,y:number,z:number,r=1,c=gold) {
  const shape=new THREE.Shape();for(let i=0;i<10;i++) {const a=Math.PI/2+i*Math.PI/5,rr=i%2 ? r*.43:r;if(!i) shape.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);else shape.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}shape.closePath();
  b.add(new THREE.ExtrudeGeometry(shape,{depth:.1,bevelEnabled:false}),c,{x,y,z},undefined,"glow");
}
function decoration(kind:string,b:Batch,group:THREE.Group,props:Record<string,unknown>):boolean {
  switch(kind) {
    case "telephone":
      b.box(1.45,2.8,1.4,0,1.4,0,red);b.box(1.2,1.9,.04,0,1.45,.72,0x4d6670);
      for(let i=0;i<4;i++) b.box(1.25,.045,.06,0,.7+i*.45,.75,red);
      for(const x of [-.4,0,.4]) b.box(.045,1.9,.06,x,1.45,.75,red);
      b.box(1.6,.2,1.55,0,2.9,0,red);b.ball(0,3,0,.8,.25,.76,red);label(group,"TELEPHONE",0,2.65,.725,1.2,.24,"#f1e5ca","#3a3430");break;
    case "postbox":b.cylinder(.54,1.5,0,.8,0,red);b.cylinder(.63,.18,0,1.61,0,red);b.ball(0,1.72,0,.58,.16,.58,red);b.box(.58,.12,.04,0,1.25,.55,navy);label(group,"POST",0,.8,.555,.62,.28,"#b92d36");break;
    case "doubledecker":
      b.box(2.5,3.5,5.8,0,2,0,red);b.box(2.3,.8,.04,0,3.03,2.93,navy);b.box(2.3,.85,.04,0,1.75,2.93,navy);
      for(const x of [-1.26,1.26]) for(let i=0;i<5;i++) for(const y of [1.75,3.05]) b.box(.04,.8,.7,x,y,-2+i,navy);
      for(const x of [-1.3,1.3]) for(const z of [-1.8,1.8]) b.add(new THREE.CylinderGeometry(.48,.48,.18,12).rotateZ(Math.PI/2),0x292e35,{x,y:.55,z});
      label(group,"QUEEN'S PARK 6",0,2.5,2.96,2.2,.35);break;
    case "roundel":b.cylinder(.055,2,0,1,0,navy);b.ring(1,.19,0,2.6,0,red);b.box(2.6,.5,.16,0,2.6,0,props.shop ? green:navy);label(group,String(props.caption??"UNDERGROUND"),0,2.6,.09,2.55,.45,props.shop ? "#335c47":"#24384f");break;
    case "lamp":lamp(b,0,0,0);break;
    case "bench":
      for(let i=0;i<4;i++) b.box(2.6,.1,.2,0,.75,-.4+i*.23,0x826448);
      for(let i=0;i<3;i++) b.box(2.6,.16,.13,0,1.05+i*.23,-.5,0x826448);
      for(const x of [-.95,.95]) {b.box(.12,.8,.8,x,.4,0,navy);b.box(.12,.7,.12,x,1.05,-.5,navy);}break;
    case "terrace":house(b,0,0,0,.65);break;
    case "taxi":b.box(2.3,1.1,4.5,0,.95,0,0x28323b);b.box(2,1.05,2.5,0,1.9,.1,0x273943);b.box(1.85,.6,.04,0,1.95,1.38,0x839ca6);b.box(.8,.2,.4,0,2.55,0,gold);for(const x of [-1.15,1.15]) for(const z of [-1.4,1.4]) b.ball(x,.45,z,.25,.45,.45,0x151c24);break;
    case "clocktower":
      b.box(2.5,10,2.5,0,5,0,0xc9b387);b.box(3.2,2.8,3.2,0,10.5,0,0xb39b73);
      b.add(new THREE.CircleGeometry(1.1,32),snow,{x:0,y:10.5,z:1.61});b.box(.07,.85,.05,0,10.85,1.65,navy);b.box(.7,.07,.05,.3,10.5,1.66,navy);
      b.add(new THREE.ConeGeometry(2.1,4,4).rotateY(Math.PI/4),navy,{x:0,y:13.8,z:0});b.cylinder(.08,2,0,16,0,gold);break;
    case "park_gate":
      for(const x of [-3,3]) {b.box(.7,3.5,.7,x,1.75,0,0x9a8e7c);b.ball(x,3.8,0,.5,.5,.5,snow);}b.box(6.5,.55,.35,0,3.2,0,green);label(group,"QUEEN'S PARK",0,3.2,.19,5.6,.43,"#335c47");break;
    case "christmas_tree":pine(b,0,0,0);for(let i=0;i<22;i++) {const a=i*2.4,y=1+i%5*.6,r=(4.7-y)*.33;b.ball(Math.cos(a)*r,y,Math.sin(a)*r,.12,.12,.12,i%2 ? red:gold,"glow");}star(b,0,4.9,0,.5);break;
    case "wreath":b.cylinder(.055,1.8,0,.9,0,navy);b.ring(.75,.2,0,2.2,0,green);for(let i=0;i<8;i++) b.ball(Math.cos(i*tau/8)*.75,2.2+Math.sin(i*tau/8)*.75,.17,.09,.09,.09,red);b.box(.4,.22,.12,0,1.5,.18,red);break;
    case "garland":
      for(const x of [-2.5,2.5]) b.cylinder(.04,3.8,x,1.9,0,navy);
      for(let i=0;i<21;i++) {const x=-2.5+i*.25,y=3.5-.7*Math.sin(i/20*Math.PI);b.ball(x,y,0,.12,.12,.12,i%3===0 ? red:i%3===1 ? gold:snow,"glow");}break;
    case "gift":b.box(1.2,.9,1.1,0,.45,0,red);b.box(.16,.93,1.12,0,.46,0,gold);b.box(1.22,.93,.16,0,.46,0,gold);for(const x of [-.2,.2]) b.ring(.2,.06,x,1.05,0,gold);break;
    case "snowman":b.ball(0,.7,0,.8,.75,.8,snow);b.ball(0,1.65,0,.6,.6,.6,snow);b.ball(0,2.4,0,.43,.43,.43,snow);b.cylinder(.53,.15,0,2.75,0,navy);b.cylinder(.35,.45,0,3,0,navy);b.box(1.1,.2,1.1,0,1.95,0,red);for(const x of [-.14,.14]) b.ball(x,2.5,.4,.06,.06,.06,navy);b.add(new THREE.ConeGeometry(.09,.4,8).rotateX(Math.PI/2),0xe78b3f,{x:0,y:2.36,z:.58});break;
    case "star":b.cylinder(.04,2,0,1,0,navy);star(b,0,2.5,0,1);break;
    case "candycane":
      for(let i=0;i<14;i++) b.cylinder(.16,.2,0,.1+i*.2,0,i%2 ? snow:red);
      b.add(new THREE.TorusGeometry(.4,.16,8,20,Math.PI),red,{x:.4,y:2.8,z:0});b.cylinder(.16,.5,.8,2.55,0,snow);break;
    case "bauble":b.box(.5,2.7,.4,0,1.35,-.4,green);b.ball(0,1.5,0,.85,.85,.85,red);b.ring(.88,.05,0,1.5,0,gold,true);b.cylinder(.17,.25,0,2.4,0,gold);break;
    case "nutcracker":b.box(.85,1.4,.5,0,1.5,0,red);b.ball(0,2.55,0,.45,.5,.4,0xdcb595);b.cylinder(.47,.8,0,3.18,0,navy);for(const x of [-.26,.26]) {b.box(.28,.8,.3,x,.45,0,navy);b.box(.4,.18,.65,x,.1,.1,navy);}for(const x of [-.15,.15]) b.ball(x,2.7,.39,.055,.055,.055,navy);b.box(.85,.17,.05,0,1.3,.28,gold);break;
    case "lantern":b.box(.8,.15,.8,0,.15,0,green);b.box(.6,.9,.6,0,.67,0,0xffdc9a,"glow");for(const x of [-.34,.34]) for(const z of [-.34,.34]) b.box(.08,1,.08,x,.65,z,green);b.add(new THREE.ConeGeometry(.65,.5,4),green,{x:0,y:1.4,z:0});b.ring(.2,.04,0,1.8,0,gold);break;
    default:return false;
  }
  return true;
}

function pathModel(b:Batch,props:Record<string,unknown>) {
  const points=(props.points as Vector3Data[]|undefined)??[{x:0,y:0,z:0},{x:0,y:0,z:-20}],frames=buildRiverFrames(points),w=Number(props.width??3);
  const at=(i:number,s:number,y=0)=>{const local=s*(1+(Number(props.widthEnd??w)/w-1)*i/Math.max(1,points.length-1));return {x:points[i].x+frames[i].x*local,y:points[i].y+y,z:points[i].z+frames[i].z*local};};
  const vertices:number[]=[],colours:number[]=[],tint=new THREE.Color(),rim=Math.min(.1,w*.1),depth=.35;
  const quad=(a:Vector3Data,c:Vector3Data,d:Vector3Data,e:Vector3Data,color:number)=>{
    tint.setHex(color);
    for(const p of [a,c,d,a,d,e]) {vertices.push(p.x,p.y,p.z);colours.push(tint.r,tint.g,tint.b);}
  };
  // Floor, coloured edge strips and side walls share the same cross-sections.
  // Separate border boxes used to overlap the floor and one another at bends.
  for(let i=0;i<points.length-1;i++) {
    const across=[-w/2,-w/2+rim,w/2-rim,w/2];
    for(let j=0;j<3;j++) quad(at(i,across[j]),at(i,across[j+1]),at(i+1,across[j+1]),at(i+1,across[j]),j===1 ? (i%12<6 ? 0xc6bd99:0xaebeb7):navy);
    for(const side of [-1,1]) {
      if(side<0) quad(at(i,side*w/2),at(i+1,side*w/2),at(i+1,side*w/2,-depth),at(i,side*w/2,-depth),navy);
      else quad(at(i,side*w/2),at(i,side*w/2,-depth),at(i+1,side*w/2,-depth),at(i+1,side*w/2),navy);
    }
    quad(at(i,-w/2,-depth),at(i+1,-w/2,-depth),at(i+1,w/2,-depth),at(i,w/2,-depth),navy);
  }
  quad(at(0,-w/2),at(0,-w/2,-depth),at(0,w/2,-depth),at(0,w/2),navy);
  const last=points.length-1;quad(at(last,-w/2),at(last,w/2),at(last,w/2,-depth),at(last,-w/2,-depth),navy);
  const geometry=new THREE.BufferGeometry().setAttribute("position",new THREE.Float32BufferAttribute(vertices,3)).setAttribute("color",new THREE.Float32BufferAttribute(colours,3));
  geometry.computeVertexNormals();b.add(geometry,-1);
}
function train(group:THREE.Group,b:Batch):void {
  b.box(4,.4,32,0,-.2,0,0x536374);b.box(4.05,.3,32,0,-.55,0,red);
  // The low skirt sits below the door threshold; all three doorways on both
  // sides are genuinely open in the shell, rather than painted-on entrances.
  for(const side of [-1,1]) {
    for(const [z,length] of [[-13.2,5.6],[-4.5,6.2],[4.5,6.2],[13.2,5.6]]) {
      b.box(.13,2.8,length,side*1.96,1.65,z,snow);
      b.box(.14,1.05,Math.max(.6,length-.55),side*1.975,2,z,navy);
    }
    b.box(.2,.25,32,side*1.95,3.2,0,navy);
    for(let i=0;i<3;i++) {
      const door=new THREE.Group();door.name=`london-door-${side}-${i}`;door.position.set(side*2.04,0,-9+i*9);group.add(door);
      for(const direction of [-1,1]) {
        const panel=new THREE.Group();panel.name=`panel-${direction}`;panel.userData.direction=direction;
        const p=new Batch();p.box(.11,2.8,1.35,0,1.6,direction*.675,red);p.box(.13,.95,.95,0,2,direction*.675,navy);p.box(.14,.08,.15,0,1.3,direction*.1,gold);p.finish(panel);door.add(panel);
      }
    }
    for(const z of [-13.5,13.5]) b.add(new THREE.CylinderGeometry(.55,.55,.24,12).rotateZ(Math.PI/2),0x26313b,{x:side*1.5,y:-.7,z});
    for(const z of [-12,-6,3,12]) {b.box(.6,.15,2,side*1.25,.6,z,navy);b.box(.12,.8,2,side*1.6,1,z,navy);}
  }
  for(const z of [-15.9,15.9]) {b.box(4,3.2,.18,0,1.6,z,red);b.box(2.5,.8,.2,0,2.2,z,navy);}
  label(group,"BAKERLOO · QUEEN'S PARK",0,2.85,16.02,3.5,.4,"#b92d36");
}
function airplane(group:THREE.Group,b:Batch) {
  // Open cabin roof is an intentional cutaway so the seated character remains
  // visible; the side walls, underside, nose and tail are opaque and closed.
  const cabin:number[]=[],sections=[-12,-8.75,-7.25,12],point=(a:number,z:number)=>[Math.sin(a)*2.1,2.2-Math.cos(a)*2.1,z];
  for(let row=0;row<3;row++) for(let i=0;i<40;i++) {
    const a=Math.PI+.6+i/40*(tau-1.2),c=Math.PI+.6+(i+1)/40*(tau-1.2),mid=(a+c)/2,y=2.2-Math.cos(mid)*2.1;
    if(row===1&&Math.sin(mid)>.7&&y>1.3&&y<3.7) continue;
    const p=point(a,sections[row]),q=point(c,sections[row]),r=point(c,sections[row+1]),s=point(a,sections[row+1]);cabin.push(...p,...q,...r,...p,...r,...s);
  }
  const shell=new THREE.BufferGeometry().setAttribute("position",new THREE.Float32BufferAttribute(cabin,3));shell.computeVertexNormals();b.add(shell,0xe6e4dd);
  b.ball(0,2.2,-14,2.1,2.1,5,snow);b.add(new THREE.ConeGeometry(2.1,11,24).rotateX(Math.PI/2),snow,{x:0,y:2.2,z:17});
  b.box(3.4,.18,23,0,1.85,0,0xb4b8b4);b.box(2.7,.12,.8,0,2.2,-4.6,red);
  b.box(2.8,.8,.18,0,2.5,-4.1,red);b.box(3.2,.85,.15,0,3,-16.9,navy);
  for(const side of [-1,1]) {
    const wing=new THREE.Shape();wing.moveTo(0,0);wing.lineTo(side*19,8);wing.lineTo(side*19,10.5);wing.lineTo(0,5);wing.closePath();
    b.add(new THREE.ExtrudeGeometry(wing,{depth:.25,bevelEnabled:false}).rotateX(Math.PI/2),0xc5ced2,{x:side*1.3,y:1.7,z:0});
    b.add(new THREE.CylinderGeometry(1,1.1,4,20).rotateX(Math.PI/2),0xd7dcd9,{x:side*6.2,y:.75,z:0});
    b.add(new THREE.CircleGeometry(.78,20),navy,{x:side*6.2,y:.75,z:-2.02});
    for(let i=0;i<12;i++) b.box(.06,.55,.5,side*2.02,2.4,-10+i*1.7,navy);
    for(const z of [-10,5]) b.ball(side*.9,-.05,z,.28,.6,.6,navy);
    b.box(.07,.5,23,side*2.07,1.5,0,red);
  }
  const fin=new THREE.Shape();fin.moveTo(0,0);fin.lineTo(0,8);fin.lineTo(-6,0);fin.closePath();
  b.add(new THREE.ExtrudeGeometry(fin,{depth:.2,bevelEnabled:false}).rotateY(Math.PI/2),red,{x:-.1,y:2.8,z:18});
  b.box(.25,.65,3.8,0,5.2,16.2,gold);
  label(group,"IBERIA",0,4.35,-11,3.5,.8,"#e6e4dd","#b92d36");
  const door=new THREE.Group();door.name="london-plane-door";door.position.set(2.08,2.6,-8);group.add(door);
  const d=new Batch();d.box(.1,1.9,1,0,0,.5,snow);d.finish(door);
  const stairs=new THREE.Group();stairs.name="london-plane-stairs";const steps=new Batch();
  for(let i=0;i<7;i++) steps.box(.5,.16,1.8,2.6+i*.35,1.7-i*.34,-8,0xb0bbc0);
  steps.finish(stairs);stairs.visible=false;group.add(stairs);
}
function crow(group:THREE.Group,b:Batch) {
  b.ball(0,1.6,0,.65,1.1,.85,0x26303b);b.ball(0,1.6,.3,.9,.65,.55,0x343743);
  for(const x of [-.27,.27]) b.cylinder(.065,.8,x,.4,0,0x42464a);
  const head=new THREE.Group();head.name="london-crow-head";head.position.y=2.8;group.add(head);
  const h=new Batch();h.ball(0,0,0,.5,.5,.6,0x25313d);
  for(const x of [-.31,.31]) {h.ball(x,.12,-.48,.11,.11,.07,snow);h.ball(x,.12,-.54,.045,.045,.025,0x10151f);}
  h.add(new THREE.ConeGeometry(.25,3.3,5).rotateX(-Math.PI/2),0x53606a,{x:0,y:0,z:-2.05});h.finish(head);
}
function punch(b:Batch) {
  const skin=0xe2b395;
  b.ball(0,.75,0,.78,.82,.7,red);b.ball(0,1.65,0,.67,.9,.56,skin);b.ball(0,2.85,0,.67,.82,.6,red);
  b.ball(0,2.55,.44,.49,.3,.22,skin);
  b.box(1.3,.2,1.12,0,1.05,0,0x23272d);b.box(.37,.3,.08,.15,1.05,.59,gold);
  for(const side of [-1,1]) {
    b.ball(side*.8,1.95,0,.36,.38,.35,skin);b.ball(side*1.05,1.55,.12,.32,.35,.32,skin);
    b.box(.5,.12,.58,side*.85,1.78,.02,navy);
    b.ball(side*.26,2.98,.55,.25,.14,.095,snow);b.ball(side*.26,2.98,.625,.13,.07,.045,navy);
    b.add(new THREE.ConeGeometry(.14,.5,3).rotateZ(-side*.8),0x43bed0,{x:side*.47,y:3.16,z:.53});
    for(let i=0;i<3;i++) b.ball(side*.2,1.45+i*.22,.52,.18,.1,.07,0xd4a17f);
  }
  b.box(.43,.08,.04,0,2.52,.64,snow);star(b,0,3.38,.56,.2,0x46c5df);
}
function hair(group:THREE.Group,b:Batch,props:Record<string,unknown>) {
  const length=Number(props.hotLength??HAIR_HOT_LENGTH);
  b.box(6,.65,length+16,0,-.325,-length/2-3,0x352f3e);b.box(4.8,.12,length,0,.06,-length/2-4,0xc0a58f,"metal");
  for(const x of [-2.9,2.9]) b.box(.15,.25,length+14,x,.1,-length/2-3,0xc46b91);
  for(const side of [-1,1]) b.add(new THREE.CylinderGeometry(.8,.8,.8,24).rotateZ(Math.PI/2),0x5c5665,{x:side*3.2,y:.3,z:6},undefined,"metal");
  const jaw=new THREE.Group();jaw.name="london-hair-jaw";jaw.position.set(0,.65,6);group.add(jaw);
  const upper=new Batch();upper.box(6,.7,length+2,0,.35,-length/2-10,0x352f3e);upper.box(4.8,.12,length,0,-.06,-length/2-10,0xc0a58f,"metal");
  for(const x of [-2.9,2.9]) upper.box(.15,.25,length+14,x,.25,-(length+16)/2,0xc46b91);upper.finish(jaw);
  const light=new THREE.Mesh(new THREE.BoxGeometry(.8,.12,4),new THREE.MeshBasicMaterial({color:0x7bdbb4}));light.name="london-hair-charge";light.position.set(2.4,.18,1);group.add(light);
}

export function createLondonModel(obj:LevelObjectData):LondonModel|null {
  const subtype=String(obj.properties?.subType??"");if(!subtype.startsWith("london_")) return null;
  const kind=subtype.slice(7),p=obj.properties??{},group=new THREE.Group(),b=new Batch();let solids:THREE.Mesh[]|undefined;
  if(!decoration(kind,b,group,p)) switch(kind) {
    case "path":pathModel(b,p);break;
    case "plane":airplane(group,b);break;
    case "train":train(group,b);break;
    case "crow":crow(group,b);break;
    case "punch":punch(b);break;
    case "hair":hair(group,b,p);break;
    case "trap":b.cylinder(.65,1.5,0,.75,0,red);b.ring(.68,.08,0,1.5,0,gold,true);break;
    case "maze": {
      const maze=(p.maze as LondonMaze|undefined)??londonMaze(611);
      for(const wall of maze.walls) {
        b.box(wall.w,3.6,wall.d,wall.x,1.8,wall.z,p.shop ? 0x536c56:0xe8ebed);
        if(p.shop) {
          for(const y of [.5,1.4,2.3,3.2]) {
            b.box(wall.w+.2,.08,wall.d+.2,wall.x,y,wall.z,0xc9cfba);
            const alongX=wall.w>wall.d,count=4;
            for(let k=0;k<count;k++) {
              const offset=(k-(count-1)/2)*.8;
              b.box(alongX ? .45:.55,.45,alongX ? .55:.45,wall.x+(alongX ? offset:0),y+.26,wall.z+(alongX ? 0:offset),[0xc39967,0xd9bba0,0x8fa284,0xbd806d][k]);
            }
          }
        }
      }
      break;
    }
    case "station": {
      for(const side of [-1,1]) {
        b.box(.17,.03,39,side*1.8,.02,0,gold);
        for(const z of [-16,16]) b.cylinder(.14,p.outdoor ? 4.2:6.5,side*1.55,(p.outdoor ? 4.2:6.5)/2,z,green);
      }
      b.box(5.5,.25,38,0,p.outdoor ? 4.3:6.7,0,p.outdoor ? green:0xe1dcca);
      if(!p.outdoor) {b.box(5.5,6.8,.3,0,3.4,-19.3,0xd1ccba);for(let i=0;i<20;i++) b.box(5.4,.035,.015,0,.3+i*.3,-19.12,0xa6a79e);}
      b.ring(.9,.16,0,3.2,-18.9,red);label(group,String(p.caption),0,3.2,-18.7,4.4,.52);
      for(const z of [-10,10]) {b.box(1.7,.7,2,0,.35,z,0x727c7d);b.box(1.7,.75,.18,0,.95,z-.8,0x727c7d);}
      if(p.outdoor) {pine(b,5,0,-12,1.4);lamp(b,3,0,10);}
      break;
    }
    case "street": {
      const length=Number(p.length??112);
      for(let i=0;i<Math.ceil(length/9);i++) for(const side of [-1,1]) {
        const z=-i*9;b.box(4,.3,9,side*8,.15,z,snow);house(b,side*15,0,z,.9,i%2 ? 0x8a766f:0x827c78);
        if(i%2===0) {lamp(b,side*7,0,z);pine(b,side*10,0,z+3,.65);}
      }
      break;
    }
    case "scenery": {
      const variant=Number(p.variant??1),centre=variant===2 ? -120:variant===3 ? -175:variant===6 ? -105:variant===9 ? -150:-25;
      b.box(400,2,520,0,-10,centre,0xb9c8ce);
      for(let i=0;i<20;i++) {
        const side=i%2 ? 1:-1,z=centre+100-Math.floor(i/2)*24;
        house(b,side*(variant===3 ? 42:50),-9,z,1.7,i%3 ? 0x8d7c78:0x7d8588);
        pine(b,side*35,-9,z+9,2);lamp(b,side*30,-9,z,1.6);
        for(let j=0;j<6;j++) b.ball(side*30+j,2.5+Math.sin(j)*.2,z,.13,.13,.13,j%2 ? gold:red,"glow");
      }
      solids=[];break;
    }
    default:return null;
  }
  const meshes=b.finish(group);
  group.position.copy(obj.position);group.rotation.set(obj.rotation.x,obj.rotation.y,obj.rotation.z,"YXZ");group.scale.copy(obj.scale);
  group.traverse(child=>child.userData.londonAsset=true);
  if(obj.properties?.londonAction) previewLondonActor(obj,group,0);
  return {group,meshes:solids??meshes};
}

export function previewLondonActor(obj:LevelObjectData,group:THREE.Object3D,time:number):boolean {
  if(obj.properties?.londonTrain) {
    const pose=trainPose(time,Number(obj.properties.trainPhase??0));group.position.set(obj.position.x,obj.position.y,obj.position.z-120*pose.progress);return true;
  }
  switch(obj.properties?.londonAction) {
    case "plane": {
      const pose=planePose(time);group.position.copy(pose.position);group.rotation.set(0,pose.yaw,pose.bank,"YXZ");
      const door=group.getObjectByName("london-plane-door");if(door) door.rotation.y=pose.landed ? Math.PI/2:0;
      const stairs=group.getObjectByName("london-plane-stairs");if(stairs) stairs.visible=pose.landed;return true;
    }
    case "train": {
      const pose=trainPose(time,Number(obj.properties.phase??0));group.position.set(obj.position.x,obj.position.y,obj.position.z-Number(obj.properties.journey??120)*pose.progress);
      for(const side of [-1,1]) for(let i=0;i<3;i++) {
        const door=group.getObjectByName(`london-door-${side}-${i}`);
        for(const panel of door?.children??[]) panel.position.z=pose.doors ? Number(panel.userData.direction)*1.42:0;
      }
      return true;
    }
    case "crow": {const head=group.getObjectByName("london-crow-head");if(head) head.rotation.x=crowPitch(time,Number(obj.properties.phase??0));return true;}
    case "hair": {
      const pose=hairPose(time),jaw=group.getObjectByName("london-hair-jaw"),light=group.getObjectByName("london-hair-charge") as THREE.Mesh;
      if(jaw) jaw.rotation.x=pose.angle;
      if(light) (light.material as THREE.MeshBasicMaterial).color.setHex(0x73d8ad).lerp(new THREE.Color(0xf14545),pose.charge);
      return true;
    }
    case "trap":group.position.y=obj.position.y-1.6+1.6*THREE.MathUtils.smoothstep(Math.sin(time*1.9+Number(obj.properties.phase??0)),0,.65);return true;
    case "punch":group.rotation.z=obj.rotation.z+Math.sin(time*1.7)*.045;return true;
    default:return false;
  }
}
