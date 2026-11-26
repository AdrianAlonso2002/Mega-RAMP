import {beforeAll,afterAll,describe,it,expect,vi} from 'vitest';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import {LevelBuilder} from '../src/levels/LevelBuilder';
import {PhysicsWorld} from '../src/physics/PhysicsWorld';
import {WORLD_02_LEVEL_04_STAGES as stages} from '../src/levels/world-02/level-04-stages';
import {icecreamRoute,upgradeCoastalFinale} from '../src/levels/world-02/CoastalFinale';
vi.mock('@dimforge/rapier3d-compat',()=>{const entry='../node_modules/@dimforge/rapier3d-compat/rapier.es.js';return import(entry);});
beforeAll(()=>{const context=new Proxy({},{get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>({addColorStop(){}}):()=>{}});vi.stubGlobal('document',{createElement:()=>({width:256,height:128,getContext:()=>context})});});
afterAll(()=>vi.unstubAllGlobals());

describe('coastal finale course',()=>{
  it('has a continuous walkable spiral and matching physical surface all the way to the goal',async()=>{
    const physics=new PhysicsWorld();await physics.waitForReady();const world=physics.getWorld()!;
    const built=new LevelBuilder().build(structuredClone(stages[10]),physics,'dragon_ball','medium');physics.step(1/60);built.group.updateMatrixWorld(true);
    const route=icecreamRoute();
    for(let i=0;i<route.length-1;i++) {
      const a=route[i],b=route[i+1],point={x:(a.x+b.x)/2,y:(a.y+b.y)/2,z:(a.z+b.z)/2};
      const hit=world.castRay(new RAPIER.Ray({x:point.x,y:point.y+1,z:point.z},{x:0,y:-1,z:0}),1.5,true);
      expect(hit,JSON.stringify(point)).not.toBeNull();expect(hit!.timeOfImpact,JSON.stringify(point)).toBeCloseTo(1,1);
    }
    for(let i=3;i<243;i++){expect(Math.hypot(route[i].x-route[i-1].x,route[i].z-route[i-1].z)).toBeLessThan(.7);expect(route[i].y).toBeGreaterThanOrEqual(route[i-1].y);expect(route[i].y-route[i-1].y).toBeLessThan(.1);}
    const ice=built.movingPlatforms.find(p=>p.movementType==='icecream_spin')!;expect(ice).toBeDefined();
    built.update(.6);physics.step(1/60);expect(ice.mesh.quaternion.angleTo(new THREE.Quaternion())).toBeGreaterThan(.1);expect(ice.mesh.quaternion.angleTo(new THREE.Quaternion().copy(ice.body.rotation()).normalize())).toBeLessThan(1e-5);
    expect(built.goal!.position.y).toBe(19.6);built.destroy();world.free();
  });
  it('upgrades editor saves once, preserving extra objects and collectible count',()=>{
    const data=structuredClone(stages[10]);delete data.properties!.coastalFinaleRevision;data.objects.push({id:'obj-custom-keep',type:'decoration',position:{x:30,y:0,z:0},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1}});
    const count=data.objects.filter(o=>o.type==='collectible').length;upgradeCoastalFinale(data);const first=JSON.stringify(data);upgradeCoastalFinale(data);expect(JSON.stringify(data)).toBe(first);expect(data.objects.some(o=>o.id==='obj-custom-keep')).toBe(true);expect(data.objects.filter(o=>o.type==='collectible')).toHaveLength(count);
  });
  it('gives all pads the same launch velocity without amplifying the fall',async()=>{
    const physics=new PhysicsWorld();await physics.waitForReady();const world=physics.getWorld()!;
    const built=new LevelBuilder().build(structuredClone(stages[2]),physics,'dragon_ball','medium');
    const pads=built.movingPlatforms.filter(p=>p.movementType==='palm_bouncer'),speeds:number[]=[];
    expect(pads).toHaveLength(8);
    for(const pad of pads){const spy=vi.spyOn(physics,'hasBodyContact').mockImplementation((_,body)=>body.handle===pad.body.handle);const pos=pad.basePosition.clone().add(new THREE.Vector3(0,1,0));built.update(.4,false,pos,{getBody:()=>({}),getVelocity:()=>new THREE.Vector3(2,-30,3),setLinearVelocity:(v:THREE.Vector3)=>speeds.push(v.y)});spy.mockRestore();}
    expect(speeds).toHaveLength(8);for(const speed of speeds){expect(speed).toBeCloseTo(speeds[0]);expect(speed).toBeGreaterThan(12);expect(speed).toBeLessThan(18);}
    built.destroy();world.free();
  });
  it('makes the nested palm fronds physically solid at their visible locations',async()=>{
    const physics=new PhysicsWorld();await physics.waitForReady();const world=physics.getWorld()!;
    const data=structuredClone(stages[2]);data.objects=data.objects.filter(o=>o.properties?.variant==='giant_bouncy_palm');
    const built=new LevelBuilder().build(data,physics,'dragon_ball','medium');physics.step(1/60);built.group.updateMatrixWorld(true);
    const fronds=built.collidableMeshes.filter(mesh=>mesh.geometry instanceof THREE.BoxGeometry&&Math.abs(mesh.geometry.parameters.width-1.6)<.01);
    expect(fronds).toHaveLength(24);
    for(const leaf of fronds){leaf.geometry.computeBoundingBox();const point=leaf.geometry.boundingBox!.getCenter(new THREE.Vector3()).applyMatrix4(leaf.matrixWorld),origin=point.clone();origin.y=12;const direction=new THREE.Vector3(0,-1,0),visual=new THREE.Raycaster(origin,direction).intersectObjects(built.collidableMeshes,false)[0],physical=world.castRay(new RAPIER.Ray(origin,direction),20,true);expect(physical).not.toBeNull();expect(visual).toBeDefined();expect(physical!.timeOfImpact).toBeCloseTo(visual.distance,2);}

    built.destroy();world.free();
  });
  it('allows every rebound to clear the leaves rather than hit their underside',async()=>{
    const physics=new PhysicsWorld();await physics.waitForReady();const world=physics.getWorld()!;
    const data=structuredClone(stages[2]),pads=data.objects.filter(o=>o.type==='bumper');
    const built=new LevelBuilder().build(data,physics,'dragon_ball','medium');
    for(const pad of pads){
      const ball=physics.createBallBody(.75,{x:pad.position.x,y:pad.position.y+1.1,z:pad.position.z})!.body;
      const position=new THREE.Vector3(),velocity=new THREE.Vector3();let peak=-Infinity;
      const player={radius:.75,getBody:()=>ball,getVelocity:()=>velocity.copy(ball.linvel()),setLinearVelocity:(v:THREE.Vector3)=>ball.setLinvel(v,true)};
      for(let i=0;i<220;i++){physics.step(1/60);position.copy(ball.translation());built.update(1/60,false,position,player);peak=Math.max(peak,position.y);}
      expect(peak,pad.id).toBeGreaterThan(9.5);physics.removeRigidBody(ball);
    }
    built.destroy();world.free();
  });
});
