import {afterAll,beforeAll,describe,it,expect,vi} from 'vitest';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import {PhysicsWorld} from '../src/physics/PhysicsWorld';
import {LevelBuilder} from '../src/levels/LevelBuilder';
import {WORLD_03_LEVEL_01_STAGES as stages} from '../src/levels/world-03/level-01-stages';
vi.mock('@dimforge/rapier3d-compat',()=>{const entry='../node_modules/@dimforge/rapier3d-compat/rapier.es.js';return import(entry);});
beforeAll(()=>{const ctx=new Proxy({},{get:(_,k)=>k==='createLinearGradient'||k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{}});vi.stubGlobal('document',{createElement:()=>({width:128,height:128,getContext:()=>ctx})});});
afterAll(()=>vi.unstubAllGlobals());


describe('slamming door clearance and collision',()=>{
  async function fixture(rotated=false){
    const physics=new PhysicsWorld();await physics.waitForReady();const world=physics.getWorld()!,data=structuredClone(stages[9]);
    data.objects=data.objects.filter(o=>o.properties?.variant==='slamming_door').slice(0,1);
    const source=data.objects[0];source.position={x:4,y:2,z:-3};source.rotation=rotated?{x:.12,y:.7,z:.06}:{x:0,y:0,z:0};source.properties={...source.properties,speed:1,phase:0};
    const built=new LevelBuilder().build(data,physics,'dragon_ball','medium'),door=built.movingPlatforms[0];return {physics,world,built,door};
  }
  it('leaves a ball diameter plus .2 useful clearance including the handle when fully open',async()=>{
    const {physics,world,built,door}=await fixture();built.update(2.2);physics.step(1/60);built.group.updateMatrixWorld(true);
    const pivot=door.subMeshes!.doorPivot,box=new THREE.Box3().setFromObject(pivot),right=door.basePosition.x+.95;
    expect(right-box.max.x).toBeGreaterThanOrEqual(1.7);
    const center=(right+box.max.x)/2,shape=new RAPIER.Ball(.75);
    for(let z=-2;z<=2;z+=.1){const position={x:center,y:door.basePosition.y+1.3,z:door.basePosition.z+z};world.colliders.forEach(c=>expect(c.intersectsShape(shape,position,{x:0,y:0,z:0,w:1})).toBe(false));}
    built.destroy();world.free();
  });
  it('matches rendered leaf/handle and frame under authored rotation and repeated resets',async()=>{
    const {physics,world,built,door}=await fixture(true);
    for(let reset=0;reset<3;reset++){
      for(let step=0;step<145;step++){built.update(1/60);physics.step(1/60);}
      built.group.updateMatrixWorld(true);const pivot=door.subMeshes!.doorPivot;
      expect(pivot.getWorldPosition(new THREE.Vector3()).distanceTo(new THREE.Vector3().copy(door.body.translation()))).toBeLessThan(1e-5);
      expect(pivot.getWorldQuaternion(new THREE.Quaternion()).angleTo(new THREE.Quaternion().copy(door.body.rotation()).normalize())).toBeLessThan(1e-5);
      const mesh=pivot.children[0] as THREE.Mesh;mesh.geometry.computeBoundingBox();const center=mesh.geometry.boundingBox!.getCenter(new THREE.Vector3()).applyMatrix4(mesh.matrixWorld),normal=new THREE.Vector3(0,0,1).transformDirection(mesh.matrixWorld),origin=center.clone().addScaledVector(normal,2),direction=normal.negate();
      const visible=new THREE.Raycaster(origin,direction,0,4).intersectObject(mesh)[0],hit=door.body.collider(0).castRay(new RAPIER.Ray(origin,direction),4,true);expect(hit).toBeCloseTo(visible.distance,4);
      built.reset!();expect(pivot.getWorldPosition(new THREE.Vector3()).distanceTo(new THREE.Vector3().copy(door.body.translation()))).toBeLessThan(1e-5);
    }
    const frame=door.mesh.children.find(n=>n instanceof THREE.Mesh) as THREE.Mesh,center=frame.getWorldPosition(new THREE.Vector3()),normal=new THREE.Vector3(0,0,1).applyQuaternion(door.mesh.quaternion),ray=new RAPIER.Ray(center.clone().addScaledVector(normal,1),normal.negate());
    let frameHit=false;world.colliders.forEach(c=>{if(!c.parent() && c.castRay(ray,2,true)!==null)frameHit=true;});expect(frameHit).toBe(true);
    built.destroy();world.free();
  });
  it('does not launch a nearby ball without a physical door contact',async()=>{
    const {world,built,door}=await fixture(),push=vi.fn();built.update(2.25,false,door.basePosition.clone(),{getBody:()=>null,setLinearVelocity:push});expect(push).not.toHaveBeenCalled();built.destroy();world.free();
  });
});
