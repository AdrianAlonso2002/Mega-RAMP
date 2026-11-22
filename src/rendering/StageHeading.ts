import * as THREE from 'three';
import type {LevelData,Vector3Data} from '../levels/LevelTypes';

/** Resolve once per stage. Authored routes take priority over decorative scenery or the goal shortcut. */
export function stageStartYaw(data:LevelData,solids:THREE.Object3D[]=[]):number {
  if(typeof data.properties?.spawnYaw==='number'&&Number.isFinite(data.properties.spawnYaw))return data.properties.spawnYaw;
  const spawn=data.spawn;let best=Infinity,heading:number|undefined;
  const matrix=new THREE.Matrix4(),q=new THREE.Quaternion(),p=new THREE.Vector3();
  for(const obj of data.objects) {
    const points=obj.properties?.points as Vector3Data[]|undefined;
    if(!Array.isArray(points)||points.length<2||!points.every(v=>Number.isFinite(v?.x)&&Number.isFinite(v?.y)&&Number.isFinite(v?.z)))continue;
    q.setFromEuler(new THREE.Euler(obj.rotation.x,obj.rotation.y,obj.rotation.z));matrix.compose(new THREE.Vector3(obj.position.x,obj.position.y,obj.position.z),q,new THREE.Vector3(obj.scale.x,obj.scale.y,obj.scale.z));
    let nearest=0,distance=Infinity;
    for(let i=0;i<points.length;i++){p.set(points[i].x,points[i].y,points[i].z).applyMatrix4(matrix);const d=(p.x-spawn.x)**2+(p.z-spawn.z)**2+(p.y-spawn.y)**2;if(d<distance){distance=d;nearest=i;}}
    if(distance>25||distance>=best)continue;
    const origin=p.set(points[nearest].x,points[nearest].y,points[nearest].z).applyMatrix4(matrix).clone(),step=nearest>=points.length-2?-1:1;
    for(let i=nearest+step;i>=0&&i<points.length;i+=step){p.set(points[i].x,points[i].y,points[i].z).applyMatrix4(matrix);if(Math.hypot(p.x-origin.x,p.z-origin.z)>3){heading=Math.atan2(p.x-origin.x,origin.z-p.z);best=distance;break;}}
  }
  if(heading!==undefined)return heading;
  const goal=data.objects.find(o=>o.type==='goal'),aim=goal?Math.atan2(goal.position.x-spawn.x,spawn.z-goal.position.z):0;
  if(solids.length===0)return aim;
  const ray=new THREE.Raycaster(),origin=new THREE.Vector3(),down=new THREE.Vector3(0,-1,0),normal=new THREE.Vector3(),hits:THREE.Intersection[]=[];
  let score=-Infinity,result=aim;
  // Prefer a continuously supported straight departure; break ties towards the objective.
  for(let i=0;i<32;i++) {
    const yaw=aim+i*Math.PI/16;let length=0,previous=spawn.y-.8;
    for(let d=2;d<=14;d+=2){origin.set(spawn.x+Math.sin(yaw)*d,previous+3,spawn.z-Math.cos(yaw)*d);ray.set(origin,down);ray.far=6;hits.length=0;ray.intersectObjects(solids,false,hits);const hit=hits.find(h=>h.face&&normal.copy(h.face.normal).transformDirection(h.object.matrixWorld).y>.3);if(!hit)break;previous=hit.point.y;length=d;}
    const value=length+Math.cos(yaw-aim)*.7;if(value>score){score=value;result=yaw;}
  }
  return Math.atan2(Math.sin(result),Math.cos(result));
}
