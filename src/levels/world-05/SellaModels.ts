import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { LevelObjectData,Vector3Data } from "../LevelTypes";
import { createAsturiasModel } from "./AsturiasModels";
import { SellaWater } from "./SellaWater";
import { CANOE_SCALE,CANOE_PADDLE_X } from "./SellaCanoeTuning";
import { buildRiverFrames } from "./SellaRiver";

type Model={group:THREE.Group;meshes:THREE.Mesh[]};

function colored(geometry:THREE.BufferGeometry,color:number):THREE.BufferGeometry {
  const tint=new THREE.Color(color),values=new Float32Array(geometry.getAttribute("position").count*3);
  for(let i=0;i<values.length;i+=3) tint.toArray(values,i);
  geometry.setAttribute("color",new THREE.BufferAttribute(values,3));
  return geometry;
}

function riverModel(obj:LevelObjectData):Model {
  const group=new THREE.Group(),meshes:THREE.Mesh[]=[];
  const points=obj.properties?.points as Vector3Data[]??[{x:0,y:0,z:0},{x:0,y:0,z:-40}],width=Number(obj.properties?.width??24),breaks=obj.properties?.breaks as number[]??[];
  const banks:number[]=[],colors:number[]=[];
  const frames=buildRiverFrames(points,breaks);
  const row=(i:number,across:number,up=0)=>{
    const p=points[i],frame=frames[i];
    return [p.x+frame.x*across,p.y+up,p.z+frame.z*across];
  };
  const quad=(target:number[],a:number[],b:number[],c:number[],d:number[])=>target.push(...a,...b,...c,...a,...c,...d);
  for(let i=0;i<points.length-1;i++) {
    if(breaks.includes(i)) continue;
    for(const side of [-1,1]) {
      const edge=side*width/2;
      quad(banks,row(i,edge,-.35),row(i,edge+side*2.4,1.2),row(i+1,edge+side*2.4,1.2),row(i+1,edge,-.35));
      quad(banks,row(i,edge+side*2.4,1.2),row(i,edge+side*9,2.5),row(i+1,edge+side*9,2.5),row(i+1,edge+side*2.4,1.2));
      const color=new THREE.Color(obj.properties?.urban ? 0x9aa4ab:(i%3 ? 0x65814f:0x7c8265));
      for(let k=0;k<12;k++) colors.push(color.r,color.g,color.b);
    }
  }
  const geometry=(vertices:number[])=>{
    const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));geo.computeVertexNormals();return geo;
  };
  const waves=new SellaWater(points,width,breaks,group);group.userData.sellaWater=waves;
  const surface=new THREE.Mesh(waves.createGeometry(),waves.material);
  surface.name="sella-water";surface.renderOrder=6;group.add(surface);
  const bankGeo=geometry(banks);bankGeo.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));
  const bank=new THREE.Mesh(bankGeo,new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide}));
  bank.name="sella-bank";bank.userData.blocksCameraOnSlopes=true;group.add(bank);meshes.push(bank);
  // Batch all riverside trees and pebbles into three draw calls, including the longest descent.
  if(!obj.properties?.urban) {
  const places:number[][]=[];
  for(let i=0;i<points.length;i+=3) for(const side of [-1,1]) places.push(row(i,side*(width/2+4.5+(i%4)),1.7));
  const trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.23,.35,4.1,6),new THREE.MeshLambertMaterial({color:0x71513b}),places.length);
  const leaves=new THREE.InstancedMesh(new THREE.ConeGeometry(2.4,6.7,7),new THREE.MeshLambertMaterial({color:0x38633d}),places.length);
  trunks.name="sella-trunks";leaves.name="sella-leaves";
  const pebbles=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.9,0),new THREE.MeshLambertMaterial({color:0xa5a59a}),places.length*3);
  const matrix=new THREE.Matrix4(),q=new THREE.Quaternion(),scale=new THREE.Vector3();
  places.forEach((p,i)=>{
    scale.setScalar(.75+(i%5)*.13);matrix.compose(new THREE.Vector3(p[0],p[1]+2,p[2]),q,scale);trunks.setMatrixAt(i,matrix);
    matrix.compose(new THREE.Vector3(p[0],p[1]+5.2,p[2]),q,scale);leaves.setMatrixAt(i,matrix);
    for(let j=0;j<3;j++) {
      scale.set(.5+j*.3,.4+(i%3)*.13,.8);matrix.compose(new THREE.Vector3(p[0]+j*1.1,p[1]-.4,p[2]+j*1.7),q,scale);pebbles.setMatrixAt(i*3+j,matrix);
    }
  });
  group.add(trunks,leaves,pebbles);
  }
  return {group,meshes};
}

export function createSellaModel(obj:LevelObjectData):Model|null {
  const kind=String(obj.properties?.subType??"");
  if(!kind.startsWith("asturias_sella_")) return null;
  if(kind.endsWith("_gull")) return createAsturiasModel({...obj,properties:{...obj.properties,subType:"asturias_gull"}});
  let result:Model;
  if(kind.endsWith("_river")) result=riverModel(obj);
  else {
    const group=new THREE.Group(),meshes:THREE.Mesh[]=[],parts:THREE.BufferGeometry[]=[];
    const box=(w:number,h:number,d:number,x:number,y:number,z:number,color:number)=>parts.push(colored(new THREE.BoxGeometry(w,h,d).translate(x,y,z),color));
    if(kind.endsWith("_canoe")) {
      const sections=[[-2.65,.035],[-2,.5],[-1,.76],[.6,.8],[1.7,.58],[2.65,.035]],vertices:number[]=[];
      const quad=(a:number[],b:number[],c:number[],d:number[])=>vertices.push(...a,...b,...c,...a,...c,...d);
      for(let i=0;i<sections.length-1;i++) {
        const [z,w]=sections[i],[nz,nw]=sections[i+1];
        for(const side of [-1,1]) quad([side*w,.38,z],[side*w*.61,-.22,z],[side*nw*.61,-.22,nz],[side*nw,.38,nz]);
        quad([-w*.61,-.22,z],[w*.61,-.22,z],[nw*.61,-.22,nz],[-nw*.61,-.22,nz]);
      }
      for(const [z,w] of [sections[0],sections[sections.length-1]]) {
        quad([-w,.38,z],[w,.38,z],[w*.61,-.22,z],[-w*.61,-.22,z]);
      }
      const hull=new THREE.BufferGeometry();hull.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));hull.computeVertexNormals();parts.push(colored(hull,0xe77b27));
      for(const side of [-1,1]) {
        const curve=new THREE.CatmullRomCurve3(sections.map(([z,w])=>new THREE.Vector3(side*w,.4,z)));
        parts.push(colored(new THREE.TubeGeometry(curve,28,.055,5,false),0x1e6d71));
      }
      box(1.1,.14,.45,0,.06,.65,0x8b633e);box(.95,.14,.4,0,.06,-1.1,0x8b633e);
      box(.7,.12,1.3,0,-.11,-.15,0x383f3c);
      for(const side of [-1,1]) {
        const paddle=new THREE.Group();paddle.name=side<0 ? "paddle-left":"paddle-right";
        const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.032,.032,1.45,7),new THREE.MeshLambertMaterial({color:0xe3c18c}));
        const blade=new THREE.Mesh(new THREE.BoxGeometry(.24,.5,.065),new THREE.MeshLambertMaterial({color:0x246c78}));
        blade.position.y=-.62;paddle.add(shaft,blade);paddle.position.set(side*CANOE_PADDLE_X,.56,.1);paddle.rotation.z=side*.38;
        group.add(paddle);
      }
    } else if(kind.endsWith("_rock")) {
      parts.push(colored(new THREE.DodecahedronGeometry(1,0).scale(1.1,1,1.2),0x8c9188));
      parts.push(colored(new THREE.DodecahedronGeometry(1,0).scale(.6,.18,.67).translate(.1,.76,.1),0x62745a));
    } else if(kind.endsWith("_waterfall")) {
      const curtain=new THREE.Mesh(new THREE.PlaneGeometry(1,1,10,12),new THREE.MeshPhongMaterial({color:0x94e9e0,transparent:true,opacity:.65,side:THREE.DoubleSide,depthWrite:false}));
      curtain.position.y=.5;group.add(curtain);
      const spray=new THREE.Mesh(new THREE.TorusGeometry(.5,.06,5,40),new THREE.MeshBasicMaterial({color:0xe2ffff,transparent:true,opacity:.6}));
      spray.rotation.x=-Math.PI/2;spray.scale.set(1,.11,1);group.add(spray);
    } else return null;
    if(parts.length) {
      const sources=parts.map(p=>{const source=p.index ? p.toNonIndexed():p;source.deleteAttribute("uv");return source;});
      const geo=mergeGeometries(sources);
      if(geo) {const mesh=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide}));group.add(mesh);meshes.push(mesh);}
      for(const source of sources) if(!parts.includes(source)) source.dispose();
      for(const part of parts) part.dispose();
    }
    result={group,meshes};
  }
  result.group.position.copy(obj.position);result.group.rotation.set(obj.rotation.x,obj.rotation.y,obj.rotation.z,"YXZ");result.group.scale.copy(obj.scale);
  if(kind.endsWith("_canoe")) result.group.scale.multiplyScalar(CANOE_SCALE);
  result.group.traverse(child=>{child.userData.sellaAsset=true;});
  return result;
}

export function previewSellaActor(obj:LevelObjectData,mesh:THREE.Object3D,time:number):boolean {
  if(obj.properties?.subType==="asturias_sella_river") {
    (mesh.userData.sellaWater as SellaWater|undefined)?.update(time);return true;
  }
  if(obj.properties?.sellaAction==="gull") {
    const phase=Number(obj.properties.phase??0),angle=time*Number(obj.properties.frequency??.8)+phase;
    mesh.position.set(obj.position.x+Math.sin(angle)*Number(obj.properties.amplitude??7),obj.position.y+.8+Math.cos(angle*2)*1.2,obj.position.z+Math.cos(angle)*4);
    mesh.rotation.y=Math.atan2(Math.cos(angle),-Math.sin(angle)*.4);
    const left=mesh.getObjectByName("wing-left"),right=mesh.getObjectByName("wing-right");
    if(left) left.rotation.z=Math.sin(time*13)*.65;if(right) right.rotation.z=-Math.sin(time*13)*.65;
    return true;
  }
  if(obj.properties?.sellaAction==="canoe") {
    animateCanoePaddles(mesh,time,1,1);return true;
  }
  if(obj.properties?.sellaAction==="landingGoal") {
    mesh.position.x=obj.position.x+Math.sin(time*Number(obj.properties.speed??.85))*Number(obj.properties.amplitude??7);return true;
  }
  return false;
}

export function animateCanoePaddles(mesh:THREE.Object3D,time:number,left:number,right:number):void {
  for(const [name,force,phase] of [["paddle-left",left,0],["paddle-right",right,0]] as const) {
    const paddle=mesh.getObjectByName(name);if(!paddle) continue;
    const stroke=((time+phase)%.72+.72)%.72;
    paddle.position.y=force<-.03 ? .48 : .56;
    paddle.rotation.x=Math.abs(force)<.03 ? 1.15 : force<0 ? -.08 : stroke<.3 ? .72-stroke/.3*1.45 : -.73+(stroke-.3)/.42*1.45;
    if(force>0 && stroke>=.3) paddle.rotation.x+=Math.sin((stroke-.3)/.42*Math.PI)*1.0;
    paddle.rotation.y=0;
  }
}
