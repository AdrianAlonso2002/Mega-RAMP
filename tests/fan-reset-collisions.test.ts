import {afterAll,beforeAll,describe,it,expect,vi} from 'vitest';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import {PhysicsWorld} from '../src/physics/PhysicsWorld';
import {LevelBuilder} from '../src/levels/LevelBuilder';
import {WORLD_03_LEVEL_01_STAGES as stages} from '../src/levels/world-03/level-01-stages';
import {fanMotion} from '../src/levels/FanMotion';
vi.mock('@dimforge/rapier3d-compat',()=>{const entry='../node_modules/@dimforge/rapier3d-compat/rapier.es.js';return import(entry);});
beforeAll(()=>{const ctx=new Proxy({},{get:(_,k)=>k==='createLinearGradient'||k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{}});vi.stubGlobal('document',{createElement:()=>({width:128,height:128,getContext:()=>ctx})});});
afterAll(()=>vi.unstubAllGlobals());

describe('fan reset and real blade collision',()=>{
  it('keeps both fan assemblies and physical blades aligned through repeated deaths and restarts',async()=>{
    const physics=new PhysicsWorld();await physics.waitForReady();const world=physics.getWorld()!,data=structuredClone(stages[8]);
    const source=data.objects.filter(o=>o.properties?.variant==='fan_5blades');source[1].rotation={x:.1,y:.22,z:.05};
    const built=new LevelBuilder().build(data,physics,'dragon_ball','medium'),fans=built.movingPlatforms.filter(p=>p.movementType==='fan_5blades');expect(fans).toHaveLength(2);
    for(let death=0;death<5;death++) {
      for(let step=0;step<80;step++){built.update(1/60);physics.step(1/60);}
      built.group.updateMatrixWorld(true);
      for(const fan of fans){
        const rotor=fan.subMeshes!.rotor,origin=rotor.getWorldPosition(new THREE.Vector3()),rotation=rotor.getWorldQuaternion(new THREE.Quaternion());
        expect(origin.distanceTo(new THREE.Vector3().copy(fan.body.translation()))).toBeLessThan(1e-5);
        expect(rotation.angleTo(new THREE.Quaternion().copy(fan.body.rotation()).normalize())).toBeLessThan(1e-5);
        const blades:THREE.Mesh[]=[];rotor.traverse(n=>{if(n instanceof THREE.Mesh&&n.geometry instanceof THREE.BoxGeometry&&n.geometry.parameters.height>1)blades.push(n);});expect(blades).toHaveLength(5);
        const normal=new THREE.Vector3(0,0,1).applyQuaternion(rotation),direction=normal.clone().negate();
        const rendered:THREE.Mesh[]=[];rotor.traverse(n=>{if(n instanceof THREE.Mesh)rendered.push(n);});
        for(const blade of blades){blade.geometry.computeBoundingBox();const center=blade.geometry.boundingBox!.getCenter(new THREE.Vector3()).applyMatrix4(blade.matrixWorld),rayOrigin=center.addScaledVector(normal,1.5),visible=new THREE.Raycaster(rayOrigin,direction,0,3).intersectObjects(rendered,false)[0],physical=fan.body.collider(0).castRay(new RAPIER.Ray(rayOrigin,direction),3,true);expect(visible).toBeDefined();expect(physical).toBeCloseTo(visible.distance,3);}
      }
      built.reset!();physics.step(1/60);built.group.updateMatrixWorld(true);
      for(const fan of fans){expect(fan.mesh.position).toEqual(fan.basePosition);expect(fan.subMeshes!.rotor.position.length()).toBe(0);expect(fan.rotSpeed).toBe(0);expect(fan.subMeshes!.rotor.getWorldPosition(new THREE.Vector3()).distanceTo(fan.basePosition)).toBeLessThan(1e-8);expect(new THREE.Vector3().copy(fan.body.translation()).distanceTo(fan.basePosition)).toBeLessThan(1e-6);}
    }
    built.destroy();world.free();
  });
  it('does not apply phantom pushes without contact, even inside the old rectangular trigger area',async()=>{
    const physics=new PhysicsWorld();await physics.waitForReady();const world=physics.getWorld()!,built=new LevelBuilder().build(structuredClone(stages[8]),physics,'dragon_ball','medium'),push=vi.fn();
    const fan=built.movingPlatforms.find(p=>p.movementType==='fan_5blades')!,position=fan.basePosition.clone().add(new THREE.Vector3(0,-3,.5));
    built.update(.1,false,position,{getBody:()=>null,setLinearVelocity:push});expect(push).not.toHaveBeenCalled();built.destroy();world.free();
  });
  it('has a continuous speed cycle and opposite directions with an exact zero-time reset',()=>{
    const a={angle:0,speed:0,slow:false},b={...a};
    for(const t of [4,4.6,6.4,7,14]){fanMotion(t-1e-7,1,a);fanMotion(t+1e-7,1,b);expect(Math.abs(a.angle-b.angle)).toBeLessThan(2e-6);}
    fanMotion(5,1,a);fanMotion(5,-1,b);expect(a.angle).toBe(-b.angle);expect(a.slow).toBe(true);fanMotion(0,1,a);expect(a.angle).toBe(0);
  });
});
