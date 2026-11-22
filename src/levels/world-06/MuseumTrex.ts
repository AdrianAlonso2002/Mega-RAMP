import * as THREE from "three";
import type {LevelObjectData} from "../LevelTypes";
import {LondonBatch,type LondonModel} from "./LondonModels";

let scales:THREE.CanvasTexture|null=null;
function scaleTexture():THREE.CanvasTexture|null {
  if(scales) return scales;if(typeof document==="undefined") return null;
  const canvas=document.createElement("canvas");canvas.width=128;canvas.height=128;const c=canvas.getContext("2d");if(!c) return null;
  c.fillStyle="#a9afa5";c.fillRect(0,0,128,128);
  for(let row=-1;row<18;row++) for(let col=-1;col<18;col++) {
    const x=col*8+(row%2)*4,y=row*8;c.fillStyle="#808e7b";c.beginPath();c.ellipse(x,y,3.9,3.4,0,0,Math.PI*2);c.fill();
    c.fillStyle=(row+col)%3 ? "#c8cdbb":"#b7c1ac";c.beginPath();c.ellipse(x-.4,y-.5,3.3,2.8,0,0,Math.PI*2);c.fill();
  }
  scales=new THREE.CanvasTexture(canvas);scales.wrapS=scales.wrapT=THREE.RepeatWrapping;scales.colorSpace=THREE.SRGBColorSpace;return scales;
}
function finish(b:LondonBatch,group:THREE.Group):THREE.Mesh[] {
  const meshes=b.finish(group);
  for(const mesh of meshes) {
    const mat=mesh.material as THREE.MeshStandardMaterial;
    if(mesh.name==="london-skin") {
      const positions=mesh.geometry.getAttribute("position"),uv=new Float32Array(positions.count*2),colour=mesh.geometry.getAttribute("color");
      for(let i=0;i<positions.count;i++) {
        const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i),shade=.94+.06*Math.sin(x*9+Math.sin(z*7)+y*13);
        uv[i*2]=Math.atan2(x,z)/Math.PI*2;uv[i*2+1]=y*.85;colour.setXYZ(i,colour.getX(i)*shade,colour.getY(i)*shade,colour.getZ(i)*shade);
      }
      mesh.geometry.setAttribute("uv",new THREE.BufferAttribute(uv,2));mat.map=scaleTexture();mat.bumpMap=mat.map;mat.bumpScale=.035;mat.roughness=.88;
    } else if(mesh.name==="london-ivory") mat.roughness=.35;
    else if(mesh.name==="london-eye") mat.roughness=.18;
  }
  return meshes;
}
function ellipsoid(b:LondonBatch,x:number,y:number,z:number,rx:number,ry:number,rz:number,color:number,kind="skin") {
  b.add(new THREE.SphereGeometry(1,24,16).scale(rx,ry,rz),color,{x,y,z},undefined,kind);
}
function tooth(b:LondonBatch,x:number,y:number,z:number,length:number,down:boolean) {
  const geometry=new THREE.ConeGeometry(.075,length,9,3).translate(0,length/2,0),p=geometry.getAttribute("position");
  for(let i=0;i<p.count;i++) p.setZ(i,p.getZ(i)+.09*(p.getY(i)/length)**2);
  if(down) geometry.rotateZ(Math.PI);geometry.computeVertexNormals();b.add(geometry,0xe9ddbd,{x,y,z},undefined,"ivory");
}
/** Detailed hero creature; independent from the lighter background-animal rigs. */
export function createMuseumTrex(obj:LevelObjectData):LondonModel {
  const group=new THREE.Group(),body=new LondonBatch(),skin=0x667652,belly=0x9b9c72,legs:THREE.Group[]=[],arms:THREE.Group[]=[];
  ellipsoid(body,0,2.6,.1,.96,1.22,1.8,skin);ellipsoid(body,0,2.95,-.9,.83,.95,.9,skin);ellipsoid(body,0,2.1,1,1.03,.93,1,skin);
  ellipsoid(body,0,2.05,-.15,.77,.88,1.43,belly);
  const neck=new THREE.CatmullRomCurve3([new THREE.Vector3(0,2.9,-1),new THREE.Vector3(0,3.45,-1.3),new THREE.Vector3(0,3.8,-1.9)]);
  body.add(new THREE.TubeGeometry(neck,18,.53,16,false),skin,undefined,undefined,"skin");
  for(let i=0;i<11;i++) ellipsoid(body,0,3.55-i*.06,-.9+i*.27,.12,.19,.14,0x526246);
  const meshes=finish(body,group);
  for(const side of [-1,1]) {
    const leg=new THREE.Group();leg.name="museum-animal-leg";leg.position.set(side*.77,1.9,.85);const b=new LondonBatch();
    ellipsoid(b,0,-.25,0,.48,.78,.6,skin);ellipsoid(b,0,-1.02,-.1,.23,.55,.28,skin);ellipsoid(b,0,-1.72,-.32,.3,.18,.66,0x5c684b);
    for(const x of [-.22,0,.22]) {
      ellipsoid(b,x,-1.77,-.7,.09,.1,.4,0x73805b);
      b.add(new THREE.ConeGeometry(.07,.32,9).rotateX(-Math.PI/2),0x4d4b3c,{x,y:-1.74,z:-1.13},undefined,"ivory");
    }
    finish(b,leg);group.add(leg);legs.push(leg);
    const arm=new THREE.Group();arm.name="museum-trex-arm";arm.position.set(side*.75,2.8,-1.37);const a=new LondonBatch();
    ellipsoid(a,0,-.16,-.03,.18,.31,.22,skin);ellipsoid(a,0,-.4,-.27,.13,.16,.29,skin);
    for(const dx of [-.085,.085]) {ellipsoid(a,dx,-.4,-.56,.055,.07,.18,skin);a.add(new THREE.ConeGeometry(.045,.22,8).rotateX(-Math.PI/2),0x423e31,{x:dx,y:-.42,z:-.78},undefined,"ivory");}
    finish(a,arm);group.add(arm);arms.push(arm);
  }
  const head=new THREE.Group();head.name="museum-animal-head";head.position.set(0,3.8,-1.85);group.add(head);const h=new LondonBatch();
  ellipsoid(h,0,.18,-.12,.67,.62,.74,skin);ellipsoid(h,0,.12,-1.05,.57,.36,1.14,skin);
  ellipsoid(h,0,-.18,-1.03,.49,.085,1.06,0x342f27,"mouth");
  for(const side of [-1,1]) {
    ellipsoid(h,side*.48,.52,-.46,.22,.14,.41,0x596947);
    ellipsoid(h,side*.596,.32,-.43,.065,.16,.14,0xc9a852,"eye");ellipsoid(h,side*.65,.32,-.46,.025,.115,.045,0x19211d,"eye");
    ellipsoid(h,side*.3,.22,-1.93,.14,.11,.18,skin);ellipsoid(h,side*.32,.3,-1.98,.085,.045,.06,0x34402d,"mouth");
    ellipsoid(h,side*.48,-.22,-.04,.23,.28,.29,0x67754f);
    for(let i=0;i<12;i++) {
      const z=-.28-i*.15,x=side*(.44-.08*(i/11)**2),length=.27+.14*Math.sin(i/11*Math.PI)+(i===8 ? .07:0);
      tooth(h,x,-.19,z,length,true);
    }
  }
  const gum=new THREE.CatmullRomCurve3([new THREE.Vector3(-.46,-.17,-.2),new THREE.Vector3(-.43,-.2,-1.62),new THREE.Vector3(0,-.2,-2.06),new THREE.Vector3(.43,-.2,-1.62),new THREE.Vector3(.46,-.17,-.2)]);
  h.add(new THREE.TubeGeometry(gum,28,.045,7,false),0x8d7563,undefined,undefined,"mouth");
  const jaw=new THREE.Group();jaw.name="museum-trex-jaw";jaw.position.set(0,-.78,.12);head.add(jaw);const j=new LondonBatch();
  ellipsoid(j,0,-.08,-1.12,.52,.17,1.18,0x85906a);ellipsoid(j,0,.07,-1.15,.43,.045,1.03,0x49342f,"mouth");ellipsoid(j,0,.12,-.94,.3,.045,.7,0x8e665a,"mouth");
  for(const side of [-1,1]) ellipsoid(j,side*.42,.15,-.03,.17,.22,.2,skin);
  for(const side of [-1,1]) for(let i=0;i<11;i++) tooth(j,side*(.42-.07*(i/10)**2),.12,-.32-i*.16,.2+.12*Math.sin(i/10*Math.PI),false);
  finish(j,jaw);
  if(obj.properties?.santa) {
    h.cylinder(.73,.25,0,.84,.05,0xeee9d9,"cloth");h.add(new THREE.ConeGeometry(.7,1.65,24),0xb52b37,{x:.15,y:1.75,z:.05},{x:0,y:0,z:-.25},"cloth");ellipsoid(h,.37,2.53,.05,.25,.25,.25,0xf5efdf,"cloth");
  }
  finish(h,head);
  const tail=new THREE.Group();tail.name="museum-animal-tail";tail.position.set(0,2.3,1.25);group.add(tail);
  const t=new LondonBatch(),profile=[[.69,0],[.59,.8],[.4,1.8],[.22,3.0],[.045,4.5],[0,4.7]];
  t.add(new THREE.LatheGeometry(profile.map(([r,z])=>new THREE.Vector2(r,z)),20).rotateX(Math.PI/2),skin,undefined,undefined,"skin");finish(t,tail);
  group.userData.animalRig={legs,head,tail,headY:head.position.y,species:"trex",jaw,arms};group.userData.animalRadius=2;
  group.position.copy(obj.position);group.rotation.set(obj.rotation.x,obj.rotation.y,obj.rotation.z,"YXZ");group.scale.copy(obj.scale);return {group,meshes};
}
