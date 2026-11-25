import {beforeAll,afterAll,describe,it,expect,vi} from 'vitest';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import {LevelBuilder} from '../src/levels/LevelBuilder';
import {PhysicsWorld} from '../src/physics/PhysicsWorld';
import {WORLD_02_LEVEL_03_STAGES as stages} from '../src/levels/world-02/level-03-stages';
import {disposeStageResources} from '../src/rendering/StageResources';
vi.mock('@dimforge/rapier3d-compat',()=>{const entry='../node_modules/@dimforge/rapier3d-compat/rapier.es.js';return import(entry);});
beforeAll(()=>{
  const context=new Proxy({},{get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>({addColorStop(){}}):()=>{}});
  vi.stubGlobal('document',{createElement:()=>({width:256,height:128,getContext:()=>context})});
});
afterAll(()=>vi.unstubAllGlobals());

describe('beach model collisions',()=>{
  it('makes umbrella ray hits agree with the sloped model, mast, rim and cap before and after rotation',async()=>{
    const physics=new PhysicsWorld();await physics.waitForReady();
    const data=structuredClone(stages[6]);data.objects=data.objects.filter(o=>o.properties?.variant==='giant_umbrella');
    data.objects[0].rotation={x:.08,y:.25,z:.04};
    const built=new LevelBuilder().build(data,physics,'dragon_ball','medium'),umbrella=built.movingPlatforms[0],world=physics.getWorld()!;
    for(const time of [0,.7,1.2]) {
      built.update(time);physics.step(1/60);built.group.updateMatrixWorld(true);
      for(const [x,z]of [[0,0],[3,0],[6,0],[-4,2]]) {
        const origin=new THREE.Vector3(x,12,z),direction=new THREE.Vector3(0,-1,0),ray=new THREE.Raycaster(origin,direction),visible=ray.intersectObjects(built.collidableMeshes,false)[0];
        const hit=world.castRay(new RAPIER.Ray(origin,direction),20,true);
        expect(hit,`physics hit at ${x},${z}`).not.toBeNull();expect(visible).toBeDefined();
        expect(hit!.timeOfImpact).toBeCloseTo(visible.distance,2);
      }
      expect(umbrella.body.collider(0).restitution()).toBeCloseTo(.02);
      expect(umbrella.mesh.quaternion.angleTo(new THREE.Quaternion().copy(umbrella.body.rotation()))).toBeLessThan(1e-5);
    }
    built.destroy();world.free();
  });
  it.each([false,true])('blocks all four side posts in a rotated hippie stall (goal=%s), while keeping the doorway open',async isGoal=>{
    const physics=new PhysicsWorld();await physics.waitForReady();const world=physics.getWorld()!;
    const data=structuredClone(stages[9]),object=structuredClone(data.objects.find(o=>o.properties?.variant==='hippie_stall')!);
    object.position={x:0,y:.4,z:0};object.rotation.y=-Math.PI/2;object.properties!.isGoalStall=isGoal;data.objects=[object];
    const built=new LevelBuilder().build(data,physics,'dragon_ball','medium');physics.step(1/60);
    const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(0,object.rotation.y,0)),offset=new THREE.Vector3().copy(object.position);
    for(const x of [-2.2,2.2])for(const z of [-1.6,1.6]) {
      const sign=Math.sign(x),origin=new THREE.Vector3(sign*4,1.4,z).applyQuaternion(q).add(offset),direction=new THREE.Vector3(-sign,0,0).applyQuaternion(q);
      const hit=world.castRay(new RAPIER.Ray(origin,direction),3,true);expect(hit).not.toBeNull();expect(hit!.timeOfImpact).toBeCloseTo(1.71,2);
    }
    if(isGoal){const origin=new THREE.Vector3(0,1.2,3).applyQuaternion(q).add(offset),direction=new THREE.Vector3(0,0,-1).applyQuaternion(q);expect(world.castRay(new RAPIER.Ray(origin,direction),2.7,true)).toBeNull();}
    built.destroy();world.free();
  });
  it('keeps wave ends rounded and removes the intersecting duplicate foam lip',()=>{
    const wave=LevelBuilder.createWaveMesh(2.8,.55,4.5,'medium');expect(wave.group.children).toHaveLength(2);
    expect((wave.waveMesh.material as THREE.Material).depthWrite).toBe(false);
    const crest=wave.group.children[1] as THREE.Mesh;expect(crest.geometry.type).toBe('CapsuleGeometry');
    for(const mesh of wave.meshes)for(const value of mesh.geometry.getAttribute('position').array)expect(Number.isFinite(value)).toBe(true);
    disposeStageResources(wave.group);
  });
});
