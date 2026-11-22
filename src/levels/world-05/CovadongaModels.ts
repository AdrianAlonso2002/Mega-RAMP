import * as THREE from "three";
import {mergeGeometries} from "three/addons/utils/BufferGeometryUtils.js";
import type {LevelObjectData,Vector3Data} from "../LevelTypes";
import {buildRiverFrames} from "./SellaRiver";
import {CovadongaPath,mineOffset,mineRockDistance,type MineJunction} from "./CovadongaPath";
import {createCovadongaGround,sceneryGroundHeight} from "./CovadongaScenery";

type Model={group:THREE.Group;meshes:THREE.Mesh[]};
const tau=Math.PI*2;
const cowUnitScale=new THREE.Vector3(1,1,1);
export type CovadongaCowBreed="brown"|"dairy"|"black"|"white";
const cowColours:Record<CovadongaCowBreed,number>={brown:0xa76c42,dairy:0xeeeadd,black:0x29322e,white:0xdedfd2};
export function covadongaCowPatrol(time:number,frequency:number,phase:number,amplitude:number):{offset:number;yaw:number;stride:number} {
  const cycle=(((time*frequency+phase)/tau)%1+1)%1,forward=cycle<.5,age=(cycle*2)%1;
  const u=Math.min(1,age/.74),progress=u*u*(3-2*u),stride=6*u*(1-u)*.67;
  const offset=(forward ? -1:1)*amplitude+(forward ? 2:-2)*amplitude*progress;
  const turn=Math.max(0,(age-.74)/.26),smooth=turn*turn*(3-2*turn);
  return {offset,yaw:(forward ? -Math.PI/2:Math.PI/2)+Math.PI*smooth,stride};
}
class Parts {
  private groups=new Map<string,THREE.BufferGeometry[]>();
  add(geometry:THREE.BufferGeometry,color:number,position:Vector3Data={x:0,y:0,z:0},rotation:Vector3Data={x:0,y:0,z:0},kind="stone"):void {
    geometry.rotateX(rotation.x).rotateY(rotation.y).rotateZ(rotation.z).translate(position.x,position.y,position.z);
    const geo=geometry.index ? geometry.toNonIndexed():geometry;
    geo.deleteAttribute("uv");
    if(color>=0) {
      const values=new Float32Array(geo.getAttribute("position").count*3),tint=new THREE.Color(color);
      for(let i=0;i<values.length;i+=3) tint.toArray(values,i);
      geo.setAttribute("color",new THREE.BufferAttribute(values,3));
    }
    const list=this.groups.get(kind)??[];list.push(geo);this.groups.set(kind,list);
    if(geo!==geometry) geometry.dispose();
  }
  box(w:number,h:number,d:number,x:number,y:number,z:number,color:number,yaw=0,kind="stone"):void {
    this.add(new THREE.BoxGeometry(w,h,d),color,{x,y,z},{x:0,y:yaw,z:0},kind);
  }
  sphere(rx:number,ry:number,rz:number,x:number,y:number,z:number,color:number,kind="stone"):void {
    this.add(new THREE.SphereGeometry(1,10,7).scale(rx,ry,rz),color,{x,y,z},undefined,kind);
  }
  cylinder(r:number,h:number,x:number,y:number,z:number,color:number,kind="stone",segments=12):void {
    this.add(new THREE.CylinderGeometry(r,r,h,segments),color,{x,y,z},undefined,kind);
  }
  finish(group:THREE.Group):THREE.Mesh[] {
    const meshes:THREE.Mesh[]=[];
    for(const [kind,geometries] of this.groups) {
      const geometry=mergeGeometries(geometries);for(const g of geometries) g.dispose();if(!geometry) continue;
      const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:kind==="water" ? .24:kind==="metal" ? .36:.87,metalness:kind==="metal" ? .55:0,
        side:THREE.DoubleSide,emissive:kind==="glow" ? 0xffad4f:0,emissiveIntensity:kind==="glow" ? .65:0});
      const mesh=new THREE.Mesh(geometry,material);mesh.name=`cov-${kind}`;group.add(mesh);meshes.push(mesh);
    }
    return meshes;
  }
}

function cow(parts:Parts,x=0,y=0,z=0,scale=1,sheep=false,breed:CovadongaCowBreed="brown"):void {
  const s=scale,c=sheep ? 0xe1dfcc:cowColours[breed];
  parts.sphere(1*s,.73*s,1.65*s,x,y+1.35*s,z,c);
  parts.sphere(.62*s,.6*s,.78*s,x,y+1.65*s,z-1.6*s,sheep ? 0x595b50:c);
  parts.sphere(.49*s,.24*s,.4*s,x,y+1.38*s,z-2.12*s,0xc3a08e);
  for(const side of [-1,1]) {
    for(const end of [-1,1]) {parts.cylinder(.13*s,1.15*s,x+side*.64*s,y+.58*s,z+end*.92*s,0x6a5440);parts.box(.34*s,.16*s,.43*s,x+side*.64*s,y+.08*s,z+end*.92*s,0x34352e);}
    parts.sphere(.34*s,.12*s,.22*s,x+side*.67*s,y+1.9*s,z-1.6*s,c);
    if(!sheep) parts.add(new THREE.ConeGeometry(.12*s,.5*s,6),0xe5d7a4,{x:x+side*.43*s,y:y+2.28*s,z:z-1.6*s},{x:0,y:0,z:-side*.3});
    parts.sphere(.08*s,.08*s,.07*s,x+side*.29*s,y+1.8*s,z-2.18*s,0x141b17);
  }
  if(!sheep) {if(breed==="dairy") parts.sphere(.45*s,.17*s,.75*s,x-.63*s,y+1.77*s,z+.2*s,0x303936);parts.box(.12*s,1.4*s,.12*s,x,y+1.1*s,z+1.8*s,0x69513e);}
}
function animatedCow(breed:CovadongaCowBreed):Model {
  const group=new THREE.Group(),body=new Parts(),coat=cowColours[breed];
  body.sphere(.83,.77,1.49,0,1.7,.12,coat);
  body.sphere(.73,.72,.83,0,1.74,-.72,coat);body.sphere(.76,.76,.78,0,1.65,1.05,coat);
  body.add(new THREE.CylinderGeometry(.4,.56,1.08,10),coat,{x:0,y:1.8,z:-1.2},{x:-.55,y:0,z:0});
  if(breed==="dairy" || breed==="white") {
    body.sphere(.35,.23,.5,0,1, .58,0xc8a79a);
    for(const x of [-.16,.16]) for(const z of [.35,.72]) body.cylinder(.055,.17,x,.81,z,0xb78d80);
  }
  const meshes=body.finish(group);
  if(breed==="dairy") for(const mesh of meshes) {
    const p=mesh.geometry.getAttribute("position"),color=mesh.geometry.getAttribute("color");
    const patch=new THREE.Color(0x303936);
    for(let i=0;i<p.count;i++) if(p.getY(i)>1.15 && Math.sin(p.getZ(i)*3+p.getX(i)*2.2)+Math.cos(p.getY(i)*4-p.getZ(i)*2.3)>.62) color.setXYZ(i,patch.r,patch.g,patch.b);
  }
  const head=new THREE.Group();head.name="cov-cow-head";head.position.set(0,1.98,-1.45);group.add(head);
  const face=new Parts();face.sphere(.4,.5,.58,0,.04,-.2,coat);
  face.sphere(.42,.22,.28,0,-.22,-.71,breed==="black" ? 0x756e63:0xc4a592);
  face.sphere(.12,.32,.035,0,.15,-.71,breed==="brown" ? 0xd5be8a:0xe8dfc9);
  for(const side of [-1,1]) {
    face.sphere(.07,.047,.035,side*.2,-.2,-.964,0x3b3932);
    face.sphere(.072,.093,.055,side*.31,.18,-.59,0x211e19);
    face.sphere(.023,.03,.012,side*.31+.016,.204,-.638,0xf1f0df);
    const horn=new THREE.CatmullRomCurve3([new THREE.Vector3(side*.3,.4,-.12),new THREE.Vector3(side*.5,.62,-.05),new THREE.Vector3(side*.49,.8,-.2)]);
    face.add(new THREE.TubeGeometry(horn,8,.045,5,false),0xd8caa1);
    const ear=new THREE.Group();ear.name=`cov-cow-ear-${side}`;ear.position.set(side*.43,.32,-.07);
    const parts=new Parts();parts.sphere(.26,.1,.15,side*.11,0,0,coat);parts.sphere(.18,.035,.1,side*.1,.05,-.015,0xb79585);parts.finish(ear);head.add(ear);
  }
  face.finish(head);
  const legParts=new Parts(),legHolder=new THREE.Group();
  legParts.cylinder(.12,.85,0,-.42,0,breed==="white"||breed==="dairy" ? 0xd0d0bf:0x514837);
  legParts.box(.29,.17,.39,0,-.94,-.025,0x313830);legParts.finish(legHolder);
  const template=legHolder.children[0] as THREE.Mesh;
  const legs=new THREE.InstancedMesh(template.geometry,template.material,4);legs.name="cov-cow-legs";group.add(legs);
  legs.boundingSphere=new THREE.Sphere(new THREE.Vector3(0,.5,0),2.5);
  const tail=new THREE.Group();tail.name="cov-cow-tail";tail.position.set(0,1.93,1.54);
  const tailParts=new Parts(),tailCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(),new THREE.Vector3(.1,-.55,.22),new THREE.Vector3(.1,-1.25,.15)]);
  tailParts.add(new THREE.TubeGeometry(tailCurve,9,.035,5,false),coat);tailParts.sphere(.09,.2,.08,.1,-1.27,.15,0x444536);tailParts.finish(tail);group.add(tail);
  group.userData.cowBreed=breed;group.userData.cowRig={head,legs,tail,matrix:new THREE.Matrix4(),quaternion:new THREE.Quaternion(),position:new THREE.Vector3()};
  animateCowRig(group,0,0,0);return {group,meshes};
}
function animateCowRig(mesh:THREE.Object3D,time:number,stride:number,phase:number):void {
  const rig=mesh.userData.cowRig as {head:THREE.Object3D;legs:THREE.InstancedMesh;tail:THREE.Object3D;matrix:THREE.Matrix4;quaternion:THREE.Quaternion;position:THREE.Vector3}|undefined;
  if(!rig) return;
  const gait=time*7+phase;
  rig.head.rotation.x=-.06-stride*.05+Math.sin(time*1.1+phase)*.12*(1-stride);
  rig.head.position.y=1.98+Math.sin(gait*2)*.03*stride;
  rig.tail.rotation.z=Math.sin(time*2.3+phase)*.24;rig.tail.rotation.x=Math.cos(time*1.5+phase)*.1;
  for(let i=0;i<4;i++) {
    const side=i<2 ? -1:1,front=i%2===0 ? -1:1;
    rig.position.set(side*.56,1.02,front*.95);
    const angle=Math.sin(gait+(i===0||i===3 ? 0:Math.PI))*.42*stride;
    rig.quaternion.set(Math.sin(angle/2),0,0,Math.cos(angle/2));
    rig.matrix.compose(rig.position,rig.quaternion,cowUnitScale);rig.legs.setMatrixAt(i,rig.matrix);
  }
  rig.legs.instanceMatrix.needsUpdate=true;
  for(const side of [-1,1]) {const ear=rig.head.getObjectByName(`cov-cow-ear-${side}`);if(ear) ear.rotation.z=side*(.08+Math.sin(time*3.4+phase+side)*.1);}
}
function tree(parts:Parts,x:number,y:number,z:number,scale=1):void {
  parts.cylinder(.22*scale,4.7*scale,x,y+2.35*scale,z,0x736247,"wood",7);
  for(let j=0;j<3;j++) parts.sphere((1.9+j*.15)*scale,(2.5-j*.15)*scale,1.9*scale,x+Math.sin(j*2)*scale,y+(5+j*.7)*scale,z+Math.cos(j*2)*scale,j%2 ? 0x4e773d:0x71934a,"foliage");
}
function arch(parts:Parts,x:number,y:number,z:number,width:number,height:number,color:number):void {
  parts.box(width,height-width/2,.17,x,y+(height-width/2)/2,z,color);
  parts.add(new THREE.CircleGeometry(width/2,16,0,Math.PI),color,{x,y:y+height-width/2,z});
}
function basilica(parts:Parts):void {
  const pink=0xb98e80,light=0xd7b7a4,roof=0x725f59,dark=0x344847;
  parts.box(26,1.6,46,0,.8,-12,0xada795);
  parts.box(18,25,39,0,13.9,-12,pink);
  const gable=new THREE.Shape();gable.moveTo(-9.8,0);gable.lineTo(0,7);gable.lineTo(9.8,0);gable.closePath();
  parts.add(new THREE.ExtrudeGeometry(gable,{depth:40,bevelEnabled:false}),roof,{x:0,y:26.4,z:-32});
  for(const side of [-1,1]) {
    const x=side*14;
    parts.box(8,43,10,x,23,0,pink);
    for(const y of [5,15,29,39,44.8]) parts.box(8.7,.65,10.7,x,y,0,light);
    for(const edge of [-1,1]) parts.box(.55,42,.55,x+edge*3.8,23,5.1,light);
    parts.add(new THREE.ConeGeometry(6,18,4).rotateY(Math.PI/4),roof,{x,y:54,z:0});
    parts.box(.35,3,.35,x,64,0,0xccaf6b);parts.box(1.7,.3,.3,x,64.5,0,0xccaf6b);
    for(const y of [12,24,34]) for(const dx of [-1.75,1.75]) arch(parts,x+dx,y,5.08,2.1,5.2,dark);
    parts.add(new THREE.CircleGeometry(1.55,24),0xe3d2ac,{x,y:40.2,z:5.45});
    parts.box(.13,1.2,.13,x,40.55,5.6,0x303f38);parts.box(.9,.13,.13,x+.4,40.2,5.6,0x303f38);
    for(let i=0;i<10;i++) {
      const z=-29+i*3.6;
      parts.box(.8,18,.75,side*9.5,10,z,light);
      arch(parts,side*9.08,8,z,1.4,5,dark);
    }
  }
  for(const x of [-5,0,5]) {arch(parts,x,1.6,7.7,3.6,8.5,dark);parts.add(new THREE.TorusGeometry(1.9,.18,5,20,Math.PI),light,{x,y:8.3,z:7.8});}
  parts.add(new THREE.CircleGeometry(3,32),0x405961,{x:0,y:20.5,z:7.72});
  parts.add(new THREE.TorusGeometry(3.15,.35,6,32),light,{x:0,y:20.5,z:7.8});
  for(let i=0;i<12;i++) parts.add(new THREE.BoxGeometry(.15,5.8,.13),light,{x:0,y:20.5,z:7.84},{x:0,y:0,z:i*Math.PI/6});
  for(let i=0;i<8;i++) parts.box(32, .35,3+i*2,0,1.5-i*.18,9+i*1.25,0xc2b5a3);
  parts.box(24,1.3,12,0,13,-28,pink);
  for(const x of [-7,0,7]) parts.cylinder(3.7,18,x,10,-32,pink);
}

function road(obj:LevelObjectData):Model {
  const group=new THREE.Group(),parts=new Parts(),points=(obj.properties!.points as Vector3Data[]|undefined)??[{x:0,y:0,z:10},{x:0,y:0,z:-10}],width=Number(obj.properties!.width??8),widths=obj.properties!.widths as number[]|undefined,frames=buildRiverFrames(points);
  const vertices:number[]=[],colors:number[]=[],grassColour=new THREE.Color(0x52713d);
  const tint=new THREE.Color(),style=obj.properties!.style;
  const at=(i:number,s:number,y=0)=>{const p=points[i];return [p.x+frames[i].x*s,p.y+y,p.z+frames[i].z*s];};
  const quad=(a:number[],b:number[],c:number[],d:number[],color:number)=>{vertices.push(...a,...b,...c,...a,...c,...d);tint.set(color);for(let j=0;j<6;j++) colors.push(tint.r,tint.g,tint.b);};
  const slope=(i:number,u:number)=>{
    const p=at(i,-(widths?.[i]??width)/2-.2-u*19);
    p[1]+=u===0 ? -.5:Math.pow(u,.76)*(25+3*Math.sin(p[0]*.14+p[2]*.08)+2*Math.cos(p[2]*.22));
    return p;
  };
  const mountainQuad=(a:number[],b:number[],c:number[],d:number[])=>{
    for(const p of [a,b,c,a,c,d]) {
      vertices.push(...p);
      const patch=Math.sin(p[0]*.31+Math.sin(p[2]*.17)*2)+Math.cos(p[2]*.39+p[0]*.12)+.5*Math.sin((p[0]+p[2])*.93);
      tint.setHex(0x8e9484).lerp(grassColour,THREE.MathUtils.smoothstep(patch,-.8,1.4));
      tint.multiplyScalar(.94+.06*Math.cos(p[0]*.8-p[2]*.6));colors.push(tint.r,tint.g,tint.b);
    }
  };
  for(let i=0;i<points.length-1;i++) {
    const w=widths?.[i]??width,nw=widths?.[i+1]??width;
    for(let col=0;col<4;col++) {
      const a=(col/4-.5),b=((col+1)/4-.5);
      const color=style==="finale" ? ((i+col)%2 ? 0x92aa80:0xb9c4a4):style==="trail" ? (i%2 ? 0xb5aa85:0xaaa17c):0x535d5b;
      quad(at(i,a*w),at(i,b*w),at(i+1,b*nw),at(i+1,a*nw),color);
    }
    for(const side of [-1,1]) {
      quad(at(i,side*w/2),at(i,side*w/2,-.5),at(i+1,side*nw/2,-.5),at(i+1,side*nw/2),0x8d9381);
      if(!style) quad(at(i,side*(w/2-.17),.012),at(i,side*(w/2-.08),.012),at(i+1,side*(nw/2-.08),.012),at(i+1,side*(nw/2-.17),.012),0xd4d9c9);
    }
    if(obj.properties!.cliffLeft) {
      for(let j=0;j<7;j++) mountainQuad(slope(i,j/7),slope(i,(j+1)/7),slope(i+1,(j+1)/7),slope(i+1,j/7));
      if(i%3===0) {
        const u=.08+.21*(.5+.5*Math.sin(i*2.37)),p=slope(i,u),r=.5+.6*(.5+.5*Math.sin(i*4.1));
        parts.add(new THREE.DodecahedronGeometry(r,0).scale(1,.8,1.2),0x939986,{x:p[0],y:p[1]+r*.3,z:p[2]});
        const b=slope(i,.14+.18*(.5+.5*Math.cos(i*1.7)));
        parts.sphere(.85,.55,.8,b[0],b[1]+.3,b[2],0x4d6c35,"foliage");
        for(let k=0;k<4;k++) parts.add(new THREE.ConeGeometry(.12,.65,4),k%2 ? 0x758644:0x5f7c3c,{x:b[0]+Math.sin(k*2)*1.1,y:b[1]+.2,z:b[2]+Math.cos(k*2)*1.1});
      }
      if(i%12===0) {const p=slope(i,.67);tree(parts,p[0],p[1]-.2,p[2],.8);}
    }
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();
  const mesh=new THREE.Mesh(geometry,new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide}));mesh.name="cov-road-surface";mesh.userData.blocksCameraOnSlopes=true;group.add(mesh);parts.finish(group);
  return {group,meshes:[mesh]};
}

function mine(obj:LevelObjectData):Model {
  const group=new THREE.Group(),parts=new Parts(),path=new CovadongaPath((obj.properties!.points as Vector3Data[]|undefined)??[{x:0,y:0,z:10},{x:0,y:0,z:-80}]),junctions=(obj.properties!.junctions as MineJunction[]|undefined)??[];
  const curve=new THREE.CatmullRomCurve3(path.points.map(p=>new THREE.Vector3(p.x,p.y+4,p.z)));
  const tunnel=new THREE.Mesh(new THREE.TubeGeometry(curve,300,8,12,false),new THREE.MeshLambertMaterial({color:0x625c4d,side:THREE.BackSide}));
  tunnel.name="cov-mine-tunnel";group.add(tunnel);
  const rail=(positions:THREE.Vector3[])=>{
    for(const side of [-1,1]) {
      const line=positions.map((p,i)=>{
        const a=positions[Math.max(0,i-1)],b=positions[Math.min(positions.length-1,i+1)],d=b.clone().sub(a).normalize();
        return p.clone().add(new THREE.Vector3(-d.z,0,d.x).multiplyScalar(side*.77)).add(new THREE.Vector3(0,.23,0));
      });
      parts.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(line),Math.max(12,positions.length*2),.095,5,false),0xaaa995,undefined,undefined,"metal");
    }
  };
  let current=0;
  for(const j of [...junctions,{start:path.length,length:0,kind:"tutorial",blocked:0,coins:0} as MineJunction]) {
    if(j.start>current) {const count=Math.max(3,Math.ceil((j.start-current)/4));rail(Array.from({length:count},(_,i)=>path.at(current+(j.start-current)*i/(count-1)).position));}
    if(j.length) for(const side of [-1,1]) rail(Array.from({length:25},(_,i)=>path.at(j.start+j.length*i/24,mineOffset(j,i/24,side)).position));
    current=j.start+j.length;
    if(j.blocked) {
      const s=mineRockDistance(j),p=path.at(s,mineOffset(j,(s-j.start)/j.length,j.blocked)).position;
      parts.add(new THREE.DodecahedronGeometry(2.2,0).scale(1,1.2,.9),0x665d4d,{x:p.x,y:p.y+1.8,z:p.z});
    }
  }
  for(let s=0;s<path.length;s+=3.5) {
    const p=path.at(s);parts.box(2.6,.2,.3,p.position.x,p.position.y+.02,p.position.z,0x65513c,p.heading,"wood");
    if(Math.round(s/3.5)%5===0) {
      for(const side of [-1,1]) {
        const q=p.position.clone().addScaledVector(p.right,side*5.6);
        parts.box(.4,6.9,.4,q.x,q.y+3.2,q.z,0x8a7250,p.heading,"wood");
        parts.sphere(.2,.28,.2,q.x,q.y+3.4,q.z,0xffc06b,"glow");
      }
      parts.box(11.6,.42,.45,p.position.x,p.position.y+6.7,p.position.z,0x8a7250,p.heading,"wood");
    }
  }
  parts.finish(group);return {group,meshes:[]};
}

export function fountainTierSpeed(index:number,base=.22):number {return base*(1+index*.55);}
function fountain(group:THREE.Group):THREE.Mesh[] {
  const solids:THREE.Mesh[]=[],tiers:THREE.Group[]=[],parts=new Parts(),waterTime={value:0};
  const water=new THREE.MeshStandardMaterial({color:0x66bfc5,roughness:.2,metalness:.12,transparent:true,opacity:.78,depthWrite:false,side:THREE.DoubleSide});
  water.userData.graphicsShaderCompatible=true;
  water.onBeforeCompile=shader=>{
    shader.uniforms.fountainTime=waterTime;
    shader.vertexShader=shader.vertexShader.replace("#include <common>","#include <common>\nvarying vec3 vFountainPosition;")
      .replace("#include <begin_vertex>","#include <begin_vertex>\nvFountainPosition=position;");
    shader.fragmentShader=shader.fragmentShader.replace("#include <common>","#include <common>\nvarying vec3 vFountainPosition; uniform float fountainTime;")
      .replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        float ripple=sin(vFountainPosition.x*3.1+vFountainPosition.z*2.2-fountainTime*2.3);
        float crossRipple=cos(vFountainPosition.z*4.3-vFountainPosition.x*1.7+fountainTime*1.7);
        normal=normalize(normal+vec3(ripple*.13,crossRipple*.03,crossRipple*.11));`)
      .replace("#include <color_fragment>",`#include <color_fragment>
        float glint=pow(max(0.0,sin(vFountainPosition.x*5.0+vFountainPosition.z*3.7+vFountainPosition.y*2.3+fountainTime*6.0)),14.0);
        diffuseColor.rgb+=glint*.1;`);
  };
  group.userData.fountainWaterTime=waterTime;group.userData.fountainTiers=tiers;
  for(let i=0;i<7;i++) {
    const tier=new THREE.Group(),stone=new Parts();tier.name=`cov-fountain-tier-${i}`;tiers.push(tier);group.add(tier);
    const y=50-i*6.5,angle=i*tau/7,x=Math.cos(angle)*5.2,z=Math.sin(angle)*5.2;
    const shape=new THREE.Shape();shape.absarc(0,0,7.6,0,tau,false);
    const hole=new THREE.Path();hole.absarc(x,z,1.65,0,tau,true);shape.holes.push(hole);
    stone.add(new THREE.ExtrudeGeometry(shape,{depth:.4,bevelEnabled:false,curveSegments:36}).rotateX(Math.PI/2),0xbab79c,{x:0,y,z:0});
    stone.add(new THREE.TorusGeometry(7.6,.2,6,64).rotateX(Math.PI/2),0x7f9073,{x:0,y:y+.14,z:0});
    stone.add(new THREE.CylinderGeometry(1.65,1.65,1.4,24,1,true),0x9a9679,{x,y:y-.7,z});
    solids.push(...stone.finish(tier));
    const surface=new THREE.Mesh(new THREE.ShapeGeometry(shape,36).rotateX(Math.PI/2),water);
    surface.position.y=y+.075;surface.name="cov-fountain-water";tier.add(surface);
    const flow=new Parts(),fallHeight=i===6 ? 7:6.5;
    for(let jet=0;jet<8;jet++) {
      const a=jet*tau/8;
      flow.add(new THREE.CylinderGeometry(.055,.12,fallHeight-.25,5),0x8ed5d5,{x:x+Math.cos(a)*1.49,y:y-(fallHeight+.05)/2,z:z+Math.sin(a)*1.49},undefined,"waterfall");
    }
    const streams=flow.finish(tier);for(const stream of streams) {(stream.material as THREE.Material).dispose();stream.material=water;stream.name="cov-fountain-falling-water";}
    const drops=new THREE.InstancedMesh(new THREE.SphereGeometry(1,5,4),new THREE.MeshStandardMaterial({color:0xb8e5df,roughness:.25}),40);
    drops.name="cov-fountain-droplets";drops.instanceMatrix.setUsage(THREE.DynamicDrawUsage);drops.frustumCulled=false;
    drops.userData.fountainOutlet={x,y,z,fallHeight};tier.add(drops);
  }
  // Keep the centre column cap below the first floor: overlapping coplanar
  // stone faces caused the noisy patch in the supplied screenshot.
  parts.cylinder(.85,45.6,0,26.9,0,0x899075);
  parts.cylinder(1.2,.55,0,50.3,2.6,0xc1bca0);
  parts.add(new THREE.SphereGeometry(1.2,20,10,0,tau,0,Math.PI/2).scale(1,.45,1),0xa3a48b,{x:0,y:50.575,z:2.6});
  parts.box(.16,1.12,.16,0,51.56,2.6,0xc5b579);parts.box(.16,.42,.16,0,52.49,2.6,0xc5b579);
  parts.box(.9,.16,.16,0,52.2,2.6,0xc5b579);
  solids.push(...parts.finish(group));return solids;
}

export function createCovadongaModel(obj:LevelObjectData):Model|null {
  const subtype=String(obj.properties?.subType??"");if(!subtype.startsWith("asturias_cov_")) return null;
  const kind=subtype.slice("asturias_cov_".length);let result:Model;
  if(kind==="road") result=road(obj);
  else if(kind==="mine") result=mine(obj);
  else if(kind==="cow") {
    const breed=String(obj.properties?.cowBreed??"brown") as CovadongaCowBreed;
    result=animatedCow(breed in cowColours ? breed:"brown");
  }
  else {
    const group=new THREE.Group(),parts=new Parts();let solids:THREE.Mesh[]|undefined;
    switch(kind) {
      case "bus": {
        parts.box(2.8,1.05,6.6,0,1.2,0,0x82bdd4);parts.box(2.68,1.6,6.35,0,2.47,0,0xa6d7e5);
        parts.box(2.55,.8,.08,0,2.55,-3.21,0x253f4b);parts.box(2.55,.65,.08,0,2.55,3.21,0x304f5b);
        for(const side of [-1,1]) for(let i=0;i<5;i++) parts.box(.07,.8,.82,side*1.35,2.6,-2.1+i*1.04,0x2c4b55);
        parts.box(2.74,.18,6.45,0,3.35,0,0xc5e5e6);parts.box(2.88,.3,.15,0,.95,-3.35,0x536567);
        for(const x of [-.97,.97]) parts.box(.5,.22,.12,x,1.35,-3.39,0xffedaf);
        for(const side of [-1,1]) for(const z of [-2.18,2.18]) {
          const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.58,.58,.26,16).rotateZ(Math.PI/2),new THREE.MeshStandardMaterial({color:0x283333,roughness:.85}));
          wheel.position.set(side*1.4,.62,z);wheel.name="cov-wheel";group.add(wheel);
          parts.add(new THREE.CylinderGeometry(.26,.26,.29,10).rotateZ(Math.PI/2),0xaab9b7,{x:side*1.42,y:.62,z},undefined,"metal");
        }
        parts.box(.17,.9,.7,1.48,2.1,-2.7,0x6b8c98);parts.box(.6,.15,.3,-1.65,2.6,-2.6,0x37545b);
        parts.box(1.3,.14,.7,0,1.55,-1.9,0x68765a);parts.box(1.3,.7,.14,0,1.9,-1.55,0x68765a);
        break;
      }
      case "sheep": cow(parts,0,0,0,.65,true);break;
      case "chamois": cow(parts,0,0,0,.65);parts.add(new THREE.ConeGeometry(.08,.65,6),0x453d31,{x:.2,y:2.1,z:-1.1});break;
      case "beech": tree(parts,0,0,0);break;
      case "waymarker": parts.box(.75,1.3,.5,0,.65,0,0xa6a48c);parts.box(.18,.7,.03,0,.8,.27,0xe7c65a);parts.box(.55,.16,.03,0,.9,.27,0xe7c65a);break;
      case "basilica": basilica(parts);break;
      case "fountain": solids=fountain(group);break;
      case "spring": parts.cylinder(2,.6,0,.3,0,0xb7b196);parts.cylinder(.7,2.2,0,1.5,0,0xa39d81);parts.add(new THREE.TorusGeometry(1.6,.3,6,28).rotateX(Math.PI/2),0xadb69b,{x:0,y:2.3,z:0});break;
      case "cart":
        parts.box(2.3,.3,3.3,0,.65,0,0x727a78,0,"metal");
        for(const side of [-1,1]) {parts.box(.16,1.15,3.3,side*1.1,1.2,0,0x68736b);parts.box(2.3,1.15,.16,0,1.2,side*1.6,0x7d887b);}
        parts.box(1.9,.17,.8,0,1.1,.65,0x89704e);for(const x of [-1,1]) for(const z of [-1.1,1.1]) parts.add(new THREE.CylinderGeometry(.37,.37,.17,10).rotateZ(Math.PI/2),0x343b36,{x,y:.35,z},undefined,"metal");break;
      case "cannon": {
        parts.box(3.1,.45,3.5,0,.4,0,0x80684b);
        for(const x of [-1.4,1.4]) {
          parts.add(new THREE.CylinderGeometry(.8,.8,.3,24).rotateZ(Math.PI/2),0x544a37,{x,y:.8,z:0});
          parts.add(new THREE.TorusGeometry(.73,.095,8,24).rotateY(Math.PI/2),0x454d49,{x:x+Math.sign(x)*.17,y:.8,z:0},undefined,"metal");
          parts.add(new THREE.CylinderGeometry(.2,.2,.4,12).rotateZ(Math.PI/2),0xa98b53,{x,y:.8,z:0},undefined,"metal");
          parts.box(.32,1.25,2.2,x*.7,1.05,0,0x71563b);
        }
        const barrel=new THREE.Group();barrel.name="cov-cannon-barrel";barrel.position.y=1.7;
        const metal=new Parts();
        // A closed cross-section gives the muzzle a real inner wall and a sealed
        // breech, so the world cannot show through an infinitely thin tube.
        const profile=[[.78,-2.1],[.87,-1.95],[.73,.3],[.58,1.7],[.35,2.1],[0,2.25],[0,1.85],[.3,1.65],[.47,.3],[.59,-1.95],[.6,-2.1],[.78,-2.1]];
        metal.add(new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),40).rotateX(Math.PI/2),0x354c4d,{x:0,y:0,z:-1.3},undefined,"metal");
        for(const [z,r] of [[-3.27,.8],[-.6,.68],[.32,.54]]) metal.add(new THREE.TorusGeometry(r,.065,8,40),0xb19455,{x:0,y:0,z},undefined,"metal");
        metal.add(new THREE.CylinderGeometry(.24,.24,2.5,16).rotateZ(Math.PI/2),0x53615a,undefined,undefined,"metal");
        metal.finish(barrel);group.add(barrel);break;
      }
      case "mine_exit": parts.box(12,10,.4,0,4,0,0xe0d8a4,0,"glow");break;
      case "outcrop": {
        // A single closed shell replaces the two overlapping cylinder caps.
        // Its top also sits below the lookout floor instead of sharing its plane.
        const profile=[[0,-100],[1.9,-100],[1.03,-1],[1,-.12],[0,-.12]];
        const rock=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),28).scale(28,1,42);
        const positions=rock.getAttribute("position"),colours=new Float32Array(positions.count*3);
        const stone=new THREE.Color(0x7c8372),grass=new THREE.Color(0x839562),tint=new THREE.Color();
        for(let i=0;i<positions.count;i++) {
          tint.copy(stone).lerp(grass,THREE.MathUtils.smoothstep(positions.getY(i),-1.1,-.2));tint.toArray(colours,i*3);
        }
        rock.setAttribute("color",new THREE.BufferAttribute(colours,3));parts.add(rock,-1,{x:0,y:0,z:-12});
        for(let i=0;i<9;i++) {const a=i*tau/9;parts.add(new THREE.DodecahedronGeometry(1,0).scale(6,18+i%3*7,7),i%2 ? 0x919683:0xa2a58d,{x:Math.cos(a)*23,y:-18-i%3*15,z:-12+Math.sin(a)*33});}
        break;
      }
      case "landscape": {
        const source=(obj.properties?.points as Vector3Data[]|undefined)??[{x:0,y:0,z:0}],path=new CovadongaPath(source.length>1 ? source:[source[0],{...source[0],z:source[0].z-40}]);
        const ground=createCovadongaGround(path.points,Number(obj.properties?.routeWidth??12),Number(obj.properties?.seed??1),obj.properties?.mountainSide==="left",
          (obj.properties?.protectedAreas as {x:number;z:number;radius:number}[]|undefined)??[]);
        group.userData.covadongaGround=ground;
        const vertices:number[]=[],colors:number[]=[],indices:number[]=[],n=ground.resolution+1;
        const tint=new THREE.Color();
        for(let iz=0;iz<n;iz++) for(let ix=0;ix<n;ix++) {
          const y=ground.heights[iz*n+ix];vertices.push(ground.minX+ground.sizeX*ix/ground.resolution,y,ground.minZ+ground.sizeZ*iz/ground.resolution);
          tint.setHex((ix+iz)%4===0 ? 0x69854c:0x799158);tint.multiplyScalar(.94+.06*Math.sin(ix*.7+iz));colors.push(tint.r,tint.g,tint.b);
        }
        for(let iz=0;iz<n-1;iz++) for(let ix=0;ix<n-1;ix++) {const a=iz*n+ix,b=a+1,c=a+n,d=c+1;indices.push(a,d,b,a,c,d);}
        const terrain=new THREE.BufferGeometry();terrain.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));terrain.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));terrain.setIndex(indices);terrain.computeVertexNormals();parts.add(terrain,-1);
        for(const site of ground.sites) {
          const y=sceneryGroundHeight(ground,site.x,site.z),x=site.x,z=site.z;
          if(site.kind==="tree") {
            tree(parts,x,y,z,site.height);
            if(site.variant%13===0) cow(parts,x+1.5,sceneryGroundHeight(ground,x+1.5,z),z,.7,site.variant%26===0,(["brown","dairy","black","white"] as CovadongaCowBreed[])[site.variant%4]);
            if(site.variant%5===0) for(let j=0;j<5;j++) {const px=x+j*.3,pz=z+Math.sin(j)*.6;parts.sphere(.16,.16,.16,px,sceneryGroundHeight(ground,px,pz)+.1,pz,0xd7b352,"foliage");}
          } else {
            const r=site.radius,h=site.height;
            parts.add(new THREE.DodecahedronGeometry(1,1).scale(r,h*.65,r*.85),site.variant%2 ? 0x929d8c:0xb0b5a2,{x,y:y+h*.42,z});
            parts.sphere(r*.95,8,r*.85,x,y+1,z,0x65814f,"foliage");
          }
        }
        for(const lake of ground.lakes) parts.add(new THREE.CircleGeometry(1,72).rotateX(-Math.PI/2).scale(lake.rx,1,lake.rz),0x4d9693,{x:lake.x,y:lake.y,z:lake.z},undefined,"water");
        break;
      }
      default:return null;
    }
    const meshes=parts.finish(group);result={group,meshes:solids??meshes};
  }
  result.group.position.copy(obj.position);result.group.rotation.set(obj.rotation.x,obj.rotation.y,obj.rotation.z,"YXZ");result.group.scale.copy(obj.scale);
  result.group.traverse(child=>child.userData.covadongaAsset=true);
  if(obj.properties?.covadongaAction==="fountain") previewCovadongaActor(obj,result.group,0);
  return result;
}

export function previewCovadongaActor(obj:LevelObjectData,mesh:THREE.Object3D,time:number):boolean {
  if(obj.properties?.covadongaAction==="cow") {
    const phase=Number(obj.properties.phase??0),pose=covadongaCowPatrol(time,Number(obj.properties.frequency??.6),phase,Number(obj.properties.amplitude??3));
    mesh.position.set(obj.position.x+Math.cos(obj.rotation.y)*pose.offset,obj.position.y,obj.position.z-Math.sin(obj.rotation.y)*pose.offset);
    mesh.rotation.y=obj.rotation.y+pose.yaw;mesh.rotation.z=Math.sin(time*7+phase)*.025*pose.stride;
    animateCowRig(mesh,time,pose.stride,phase);return true;
  }
  if(obj.properties?.covadongaAction==="fountain") {
    const tiers=mesh.userData.fountainTiers as THREE.Group[]|undefined;
    if(mesh.userData.fountainWaterTime) mesh.userData.fountainWaterTime.value=time;
    for(const [i,tier] of (tiers??[]).entries()) {
      tier.rotation.y=time*fountainTierSpeed(i,Number(obj.properties.rotationSpeed??.22));
      const drops=tier.getObjectByName("cov-fountain-droplets") as THREE.InstancedMesh;
      if(!drops) continue;
      const {x,y,z,fallHeight}=drops.userData.fountainOutlet,matrix=new THREE.Matrix4();
      for(let j=0;j<drops.count;j++) {
        const t=(time*.9+j*.61803398875)%1,a=j*2.39996323;
        // Free fall under gravity, then a short upward splash at the next basin.
        const splash=j>=32,age=splash ? t*.44:t*Math.sqrt((fallHeight-.2)/4.9);
        const dropY=splash ? y-fallHeight+.09+2.2*age-4.9*age*age:y-.1-4.9*age*age;
        const radius=1.42+(splash ? age*.7:.08*Math.sin(j));
        matrix.makeScale(.045,splash ? .055:.09+t*.06,.045);matrix.setPosition(x+Math.cos(a)*radius,dropY,z+Math.sin(a)*radius);drops.setMatrixAt(j,matrix);
      }
      drops.instanceMatrix.needsUpdate=true;
    }
    return true;
  }
  return ["bus","cart","cannon"].includes(String(obj.properties?.covadongaAction));
}
