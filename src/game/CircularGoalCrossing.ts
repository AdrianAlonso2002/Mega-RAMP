import type {Vector3Like} from 'three';
/** Segment against a circular opening extruded through the same thin portal threshold. */
export function crossesCircularGoalOpening(from:Vector3Like,to:Vector3Like,radius:number,centerY:number):boolean {
 let enter=0,exit=1;
 const dz=to.z-from.z;
 if(Math.abs(dz)<1e-9){if(Math.abs(from.z)>.4)return false;}
 else {const a=(-.4-from.z)/dz,b=(.4-from.z)/dz;enter=Math.max(0,Math.min(a,b));exit=Math.min(1,Math.max(a,b));if(enter>exit)return false;}
 const dx=to.x-from.x,dy=to.y-from.y,denom=dx*dx+dy*dy;
 const closest=denom>1e-12?Math.max(enter,Math.min(exit,-(from.x*dx+(from.y-centerY)*dy)/denom)):enter;
 const x=from.x+dx*closest,y=from.y-centerY+dy*closest;
 return x*x+y*y<=radius*radius;
}
