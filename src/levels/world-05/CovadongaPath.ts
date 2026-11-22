import * as THREE from "three";
import type {Vector3Data} from "../LevelTypes";

export interface MineJunction {start:number;length:number;kind:"tutorial"|"near"|"hidden"|"cross";blocked:number;coins:number}
export class CovadongaPath {
  readonly arc:number[]=[0];
  readonly length:number;
  constructor(readonly points:Vector3Data[]) {
    for(let i=1;i<points.length;i++) this.arc.push(this.arc[i-1]+Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y,points[i].z-points[i-1].z));
    this.length=this.arc[this.arc.length-1]??0;
  }
  at(distance:number,side=0):{position:THREE.Vector3;forward:THREE.Vector3;right:THREE.Vector3;heading:number;segment:number} {
    const s=THREE.MathUtils.clamp(distance,0,this.length);let lo=0,hi=this.arc.length-1;
    while(lo+1<hi) {const mid=(lo+hi)>>1;if(this.arc[mid]<=s) lo=mid;else hi=mid;}
    const a=this.points[lo],b=this.points[Math.min(lo+1,this.points.length-1)],t=(s-this.arc[lo])/(this.arc[lo+1]-this.arc[lo]||1);
    const forward=new THREE.Vector3(b.x-a.x,b.y-a.y,b.z-a.z).normalize(),horizontal=Math.hypot(forward.x,forward.z)||1;
    const right=new THREE.Vector3(-forward.z/horizontal,0,forward.x/horizontal);
    return {position:new THREE.Vector3().lerpVectors(a,b,t).addScaledVector(right,side),forward,right,heading:Math.atan2(-forward.x,-forward.z),segment:lo};
  }
}
export function mineJunctions():MineJunction[] {
  return Array.from({length:12},(_,i)=>{const start=25+i*94;return {start:mineDistance(start),length:mineDistance(start+68)-mineDistance(start),kind:i<2 ? "tutorial":i<8 ? "near":i<10 ? "hidden":"cross",blocked:i<2 || i>=10 ? 0:i%2 ? 1:-1,coins:i%2 ? -1:1};});
}
/** Preserve reaction time and the minute-long ride as later sections accelerate. */
export function mineDistance(s:number):number {return s+Math.max(0,s-375)+Math.max(0,s-657);}
export function stretchMineRoute(points:Vector3Data[]):Vector3Data[] {
  const original=new CovadongaPath(points),distances=[...original.arc,375,657].filter(s=>s<=original.length).sort((a,b)=>a-b);
  const result:Vector3Data[]=[{...points[0]}];
  for(let i=1;i<distances.length;i++) {
    const a=original.at(distances[i-1]).position,b=original.at(distances[i]).position;
    const factor=(mineDistance(distances[i])-mineDistance(distances[i-1]))/(distances[i]-distances[i-1]||1),last=result[result.length-1];
    result.push({x:last.x+(b.x-a.x)*factor,y:last.y+(b.y-a.y)*factor,z:last.z+(b.z-a.z)*factor});
  }
  return result;
}
export function mineOffset(junction:MineJunction,t:number,side:number):number {
  return side*4.4*Math.sin(Math.PI*THREE.MathUtils.clamp(t,0,1)*(junction.kind==="cross" ? 2:1));
}
export function mineRockDistance(junction:MineJunction):number {
  return junction.start+junction.length*(junction.kind==="hidden" ? .79:.32);
}
export function cannonVelocity(yaw:number,pitch:number,speed=85):THREE.Vector3 {
  return new THREE.Vector3(-Math.sin(yaw)*Math.cos(pitch)*speed,Math.sin(pitch)*speed,-Math.cos(yaw)*Math.cos(pitch)*speed);
}
export function cannonPosition(origin:THREE.Vector3,velocity:THREE.Vector3,time:number):THREE.Vector3 {
  return origin.clone().addScaledVector(velocity,time).add(new THREE.Vector3(0,-9*time*time,0));
}
