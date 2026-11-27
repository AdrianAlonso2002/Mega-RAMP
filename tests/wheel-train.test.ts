import {rebuildWheelTrain,WHEEL_TRAIN_REVISION} from '../src/levels/WheelTrainRoute';
import {beforeAll,afterAll,describe,it,expect,vi} from 'vitest';
import * as THREE from 'three';
import {WORLD_04_LEVEL_03_STAGES} from '../src/levels/world-04/level-03-stages';
import {LevelBuilder} from '../src/levels/LevelBuilder';
import {PhysicsWorld} from '../src/physics/PhysicsWorld';
import {Player} from '../src/player/Player';
import {CHARACTERS} from '../src/player/Characters';
import {SpriteTextures} from '../src/rendering/SpriteTextures';
import {applyRequestedStageUpdates} from '../src/levels/RequestedStageUpdates';
vi.mock('@dimforge/rapier3d-compat',async()=>{const path='../node_modules/@dimforge/rapier3d-compat/rapier.es.js';return import(path);});
beforeAll(()=>{
  vi.spyOn(SpriteTextures,'getCharacterTexture').mockReturnValue(new THREE.Texture());vi.spyOn(SpriteTextures,'getSphereTexture').mockReturnValue(new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement));
  const gradient={addColorStop:()=>{}},context=new Proxy({}, {get:(_t,k)=>k==='createLinearGradient'||k==='createRadialGradient' ? ()=>gradient:k==='measureText' ? ()=>({width:100}):()=>{}});
  vi.stubGlobal('document',{createElement:()=>({width:128,height:128,getContext:()=>context})});
});
afterAll(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});

describe('four wheel train',()=>{
 it('replaces old published and browser designs once and preserves later edits',()=>{
  const source=structuredClone(WORLD_04_LEVEL_03_STAGES[1]);delete source.properties!.wheelTrainRevision;source.objects=[];source.customSaved=true;
  const updated=applyRequestedStageUpdates(source,4,3,1);expect(updated.properties!.wheelTrainRevision).toBe(WHEEL_TRAIN_REVISION);expect(updated.objects.filter(o=>o.type==='moving-platform')).toHaveLength(4);
  updated.spawn.x=.5;expect(rebuildWheelTrain(updated)).toBe(updated);expect(rebuildWheelTrain(updated).spawn.x).toBe(.5);
 });
 it('can drive from the starting dock through all four wheels to the goal dock',async()=>{
  const data=WORLD_04_LEVEL_03_STAGES[1],physics=new PhysicsWorld();await physics.waitForReady();const scene=new LevelBuilder().build(structuredClone(data),physics,'dragon_ball'),player=new Player(CHARACTERS[1],physics,data.spawn),camera=new THREE.PerspectiveCamera(),goal=data.objects.find(o=>o.type==='goal')!,trace:unknown[]=[];let reached=false;
  try{
   for(let i=0;i<3600;i++){
    physics.step(1/60);const p=player.getPosition(),v=player.linvel(),motion=player.update(1/60,{horizontal:THREE.MathUtils.clamp(-p.x*.7-v.x*.4,-1,1),vertical:THREE.MathUtils.clamp((5+v.z)*.6,-1,1)},camera);scene.update(1/60,false,motion.position,player);
    if(i%120===0)trace.push({t:i/60,p:p.toArray()});
    expect(motion.fellOut,JSON.stringify(trace)).toBe(false);
    if(p.z<goal.position.z+1&&p.y>11){reached=true;break;}
   }
   expect(reached,JSON.stringify(trace)).toBe(true);
  }finally{player.destroy();scene.destroy();physics.getWorld()?.free();}
 });
 it('keeps fixed axles and exact visual/physical rotation through repeated restarts',async()=>{
  const data=WORLD_04_LEVEL_03_STAGES[1],physics=new PhysicsWorld();await physics.waitForReady();const scene=new LevelBuilder().build(structuredClone(data),physics,'dragon_ball');
  try{expect(scene.movingPlatforms).toHaveLength(4);for(let reset=0;reset<3;reset++){
   for(let i=0;i<180;i++){scene.update(1/60);physics.step(1/60);}
   for(const wheel of scene.movingPlatforms){expect(wheel.mesh.position.distanceTo(wheel.basePosition)).toBe(0);expect(wheel.mesh.quaternion.angleTo(new THREE.Quaternion().copy(wheel.body.rotation()).normalize())).toBeLessThan(1e-5);expect(wheel.body.numColliders()).toBe(1);}
   scene.reset!();physics.step(1/60);
  }}finally{scene.destroy();physics.getWorld()?.free();}
 });
});
