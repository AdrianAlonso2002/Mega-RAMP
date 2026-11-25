import * as THREE from 'three';
import type { LevelData } from '../levels/LevelTypes';

/** Bounds of playable geometry, excluding skies, water planes and side landmarks. */
export function introBounds(data:LevelData|undefined,spawn:THREE.Vector3):THREE.Box3 {
  const bounds=new THREE.Box3().expandByPoint(spawn),box=new THREE.Box3(),matrix=new THREE.Matrix4(),q=new THREE.Quaternion(),euler=new THREE.Euler();
  for(const object of data?.objects??[]) {
    if(!['platform','ramp','cylinder','moving-platform','rotating-platform','goal','spawn','collectible'].includes(object.type))continue;
    const {position:p,rotation:r,scale:s}=object;
    if(![p.x,p.y,p.z,s.x,s.y,s.z].every(Number.isFinite))continue;
    q.setFromEuler(euler.set(r.x,r.y,r.z));matrix.compose(new THREE.Vector3(p.x,p.y,p.z),q,new THREE.Vector3(Math.abs(s.x),Math.abs(s.y),Math.abs(s.z)));
    box.min.set(-.5,-.5,-.5);box.max.set(.5,.5,.5);box.applyMatrix4(matrix);bounds.union(box);
  }
  return bounds;
}

/** Plans one smooth exterior sweep on stage entry; runtime only evaluates two vectors.
 * Search the whole route for a better side/elevation instead of changing sides mid-shot.
 * The camera's existing spring arm remains the final safeguard for enclosed interiors.
 */
export class StageIntroPlan {
  readonly center=new THREE.Vector3();
  readonly radius:number;
  readonly height:number;
  private phase=0;
  private lift=0;
  private exteriorOnly=false;
  private roofY=0;
  private readonly look=new THREE.Vector3();
  private readonly desired=new THREE.Vector3();
  private readonly pivot=new THREE.Vector3();
  private readonly direction=new THREE.Vector3();
  constructor(bounds:THREE.Box3,private spawn:THREE.Vector3,private baseAngle:number,fov:number,aspect:number,private finalRadius=6.5,private finalHeight=3.2,meshes:THREE.Object3D[]=[],private finalLook=spawn) {
    bounds.getCenter(this.center);
    this.roofY=bounds.max.y+4;
    const size=bounds.getSize(new THREE.Vector3());
    const halfFov=Math.min(THREE.MathUtils.degToRad(fov/2),Math.atan(Math.tan(THREE.MathUtils.degToRad(fov/2))*Math.max(.35,aspect)));
    // Fit the playable bounding sphere; generous enough to reveal tall and wide maps.
    this.radius=THREE.MathUtils.clamp(size.length()*.5/Math.sin(halfFov),24,480);
    this.height=Math.max(13,bounds.max.y-this.center.y+8,this.radius*.42);
    if(!meshes.length)return;
    const caster=new THREE.Raycaster(),hits:THREE.Intersection[]=[],normal=new THREE.Vector3(),normalMatrix=new THREE.Matrix3();
    this.pivot.copy(spawn);this.pivot.y+=.65;
    // Cache broad-phase bounds once. No per-frame geometry traversal or route search.
    const obstacles=meshes.map(mesh=>({mesh,box:new THREE.Box3().setFromObject(mesh)}));
    let best=Infinity;
    for(const phase of [0,Math.PI/4,-Math.PI/4,Math.PI/2,-Math.PI/2])for(const lift of [0,12,30,60]) {
      this.phase=phase;this.lift=lift;let blocked=0;
      for(let i=0;i<12;i++) {
        this.sample(i/14,this.desired,this.look);
        this.direction.subVectors(this.desired,this.pivot);const distance=this.direction.length();
        if(distance<1)continue;this.direction.divideScalar(distance);caster.set(this.pivot,this.direction);caster.near=.3;caster.far=distance+.35;
        let obstructed=false;
        for(const {mesh,box}of obstacles) {
          if(!caster.ray.intersectsBox(box))continue;
          hits.length=0;caster.intersectObject(mesh,false,hits);
          if(hits.some(hit=>{
            if(hit.face){normal.copy(hit.face.normal).applyNormalMatrix(normalMatrix.getNormalMatrix(hit.object.matrixWorld));if(normal.y>.4&&hit.point.y<=this.pivot.y+.15)return false;}
            return true;
          })){obstructed=true;break;}
        }
        if(obstructed)blocked++;
      }
      const score=blocked*100+lift*.12+Math.abs(phase)*2;
      if(score<best){best=score;this.bestPhase=phase;this.bestLift=lift;}
    }
    this.phase=this.bestPhase;this.lift=this.bestLift;
    this.exteriorOnly=best>=100;
  }
  private bestPhase=0;
  private bestLift=0;
  sample(progress:number,position:THREE.Vector3,lookAt:THREE.Vector3):void {
    const t=THREE.MathUtils.clamp(progress,0,1);
    // Hold the overview before flying in. Zero endpoint derivatives avoid a camera snap.
    const approach=THREE.MathUtils.smootherstep(t,.28,1),outside=1-approach;
    const angle=this.baseAngle+(1-THREE.MathUtils.smootherstep(t,0,1))*Math.PI*2+this.phase*outside;
    const radius=THREE.MathUtils.lerp(this.finalRadius,this.radius,outside);
    const height=THREE.MathUtils.lerp(this.finalHeight,this.height+this.lift,outside);
    lookAt.lerpVectors(this.center,this.finalLook,approach);
    position.set(lookAt.x+Math.sin(angle)*radius,lookAt.y+height,lookAt.z+Math.cos(angle)*radius);
  }
  obstructionTarget(progress:number,out:THREE.Vector3):void {
    out.copy(this.spawn);
    // A closed cabin/room cannot offer line of sight from any exterior angle.
    // Present its exterior first instead of shrinking the entire overview into the cabin.
    if(this.exteriorOnly)out.y=THREE.MathUtils.lerp(this.roofY,this.spawn.y,THREE.MathUtils.smootherstep(progress,.5,1));
  }
}
