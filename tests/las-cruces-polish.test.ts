import RAPIER from '@dimforge/rapier3d-compat';
import {crossesCircularGoalOpening} from '../src/game/CircularGoalCrossing';
import {beforeAll,afterAll,describe,it,expect,vi} from 'vitest';
import * as THREE from 'three';
import {WORLD_04_LEVEL_03_STAGES} from '../src/levels/world-04/level-03-stages';
import {LevelBuilder} from '../src/levels/LevelBuilder';
import {PhysicsWorld} from '../src/physics/PhysicsWorld';
import {Player} from '../src/player/Player';
import {CHARACTERS} from '../src/player/Characters';
import {SpriteTextures} from '../src/rendering/SpriteTextures';
vi.mock('@dimforge/rapier3d-compat',async()=>{const path='../node_modules/@dimforge/rapier3d-compat/rapier.es.js';return import(path);});
beforeAll(()=>{
  vi.spyOn(SpriteTextures,'getCharacterTexture').mockReturnValue(new THREE.Texture());vi.spyOn(SpriteTextures,'getSphereTexture').mockReturnValue(new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement));
  const gradient={addColorStop:()=>{}},context=new Proxy({}, {get:(_t,k)=>k==='createLinearGradient'||k==='createRadialGradient' ? ()=>gradient:k==='measureText' ? ()=>({width:100}):()=>{}});
  vi.stubGlobal('document',{createElement:()=>({width:128,height:128,getContext:()=>context})});
});
afterAll(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});


describe('Las Cruces graphics and descending stages',()=>{
 it('matches visible stern and bow barriers with their real colliders',async()=>{
  const data=structuredClone(WORLD_04_LEVEL_03_STAGES[6]);data.objects=data.objects.filter(o=>o.properties?.variant==='pirate_ship');data.objects[0].rotation.y=.3;
  const physics=new PhysicsWorld();await physics.waitForReady();const scene=new LevelBuilder().build(data,physics,'dragon_ball'),ship=scene.group.getObjectByName('pirate_ship_structure_group')!;
  try{physics.step(1/60);ship.updateWorldMatrix(true,true);
   for(const [name,z,dz,y] of [['stern-bulkhead',10,1,2.8],['bow-bulkhead',-10,-1,2.5]] as const){
    const wall=ship.getObjectByName(name) as THREE.Mesh;expect(wall).toBeDefined();
    const origin=new THREE.Vector3(2,y,z).applyMatrix4(ship.matrixWorld),direction=new THREE.Vector3(0,0,dz).transformDirection(ship.matrixWorld);
    const visible=new THREE.Raycaster(origin,direction,0,8).intersectObject(wall)[0],physical=physics.getWorld()!.castRay(new RAPIER.Ray(origin,direction),8,true);
    expect(visible).toBeDefined();expect(physical!.timeOfImpact).toBeCloseTo(visible.distance,2);
   }
  }finally{scene.destroy();physics.getWorld()?.free();}
 });
 it('descends multiple steps from rest without input and keeps falling towards the final step',async()=>{
  const data=structuredClone(WORLD_04_LEVEL_03_STAGES[8]),first=data.objects.find(o=>o.properties?.stepNumber===1)!;
  const z=first.position.z+.4,y=first.position.y+first.scale.y/Math.cos(first.rotation.x)-Math.tan(first.rotation.x)*(z-first.position.z)+.76;
  const physics=new PhysicsWorld();await physics.waitForReady();const scene=new LevelBuilder().build(data,physics,'dragon_ball'),player=new Player(CHARACTERS[1],physics,{x:0,y,z}),camera=new THREE.PerspectiveCamera(),trace:unknown[]=[];
  try{let reached=false;
   for(let i=0;i<2400;i++){
    physics.step(1/60);const motion=player.update(1/60,{horizontal:0,vertical:0},camera);scene.update(1/60,false,motion.position,player);
    if(i%120===0)trace.push(motion.position.toArray());
    expect(motion.fellOut,JSON.stringify(trace)).toBe(false);
    if(motion.position.z<-14.5){reached=true;break;}
   }
   expect(reached,JSON.stringify(trace)).toBe(true);
   expect(data.objects.filter(o=>o.type==='collectible')).toHaveLength(8);
  }finally{player.destroy();scene.destroy();physics.getWorld()?.free();}
 });
 it('has a circular goal 1.5 times the reference size, with a hollow physical centre',async()=>{
  const data=structuredClone(WORLD_04_LEVEL_03_STAGES[9]);data.objects=data.objects.filter(o=>o.type==='goal');
  const physics=new PhysicsWorld();await physics.waitForReady();const scene=new LevelBuilder().build(data,physics,'dragon_ball');
  try{physics.step(1/60);const goal=scene.goal!,circle=goal.mesh.userData.goalCircle;
   expect(circle.radius).toBeCloseTo(1.6*1.5);expect(goal.portalMesh!.geometry).toBeInstanceOf(THREE.CircleGeometry);
   const origin=goal.position.clone().add(new THREE.Vector3(0,circle.centerY,2));expect(physics.getWorld()!.castRay(new RAPIER.Ray(origin,{x:0,y:0,z:-1}),4,true)).toBeNull();
   origin.x+=circle.radius+.15;expect(physics.getWorld()!.castRay(new RAPIER.Ray(origin,{x:0,y:0,z:-1}),4,true)).not.toBeNull();
  }finally{scene.destroy();physics.getWorld()?.free();}
  expect(crossesCircularGoalOpening({x:2,y:2.7,z:30},{x:2,y:2.7,z:-30},2.4,2.7)).toBe(true);
  expect(crossesCircularGoalOpening({x:2.3,y:5,z:30},{x:2.3,y:5,z:-30},2.4,2.7)).toBe(false);
  expect(crossesCircularGoalOpening({x:0,y:2.7,z:-20},{x:0,y:2.7,z:20},2.4,2.7)).toBe(true);
 });
 it('keeps the Carrefour logo clear of the header and ends its pillars below the beam',()=>{
  const {meshes}=LevelBuilder.createCarrefourArchMesh(16,6.5);
  const logo=meshes.find(m=>m.name==='carrefour-logo')!;expect(logo.geometry).toBeInstanceOf(THREE.PlaneGeometry);
  for(const mesh of meshes)mesh.updateMatrixWorld(true);
  const beam=new THREE.Box3().setFromObject(meshes[2]),sign=new THREE.Box3().setFromObject(meshes[3]);
  expect(sign.min.z).toBeGreaterThan(beam.max.z);expect(logo.position.z).toBeGreaterThan(sign.max.z);
  for(const pillar of meshes.slice(0,2))expect(new THREE.Box3().setFromObject(pillar).max.y).toBeCloseTo(beam.min.y);
 });
});
