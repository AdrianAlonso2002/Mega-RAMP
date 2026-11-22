import {afterAll,beforeAll,expect,it,vi} from 'vitest';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import {LevelLoader} from '../src/levels/LevelLoader';
import {LevelBuilder} from '../src/levels/LevelBuilder';
import {PhysicsWorld} from '../src/physics/PhysicsWorld';
import {SpriteTextures} from '../src/rendering/SpriteTextures';
vi.mock('@dimforge/rapier3d-compat',async()=>{const path='../node_modules/@dimforge/rapier3d-compat/rapier.es.js';return import(path);});
beforeAll(()=>{
 const gradient={addColorStop:()=>{}},context=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>gradient:key==='measureText'?()=>({width:100}):()=>{}});
 vi.stubGlobal('document',{createElement:()=>({width:128,height:128,getContext:()=>context})});vi.stubGlobal('localStorage',{getItem:()=>null});
 vi.spyOn(SpriteTextures,'getCollectibleTexture').mockReturnValue(new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement));
});
afterAll(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});
it('places the new rest-stage rewards above actual physical surfaces, including the canoe rest river',async()=>{
 const loader=new LevelLoader(),unsupported:string[]=[];
 for(let w=1;w<=6;w++)for(let l=1;l<=4;l++){
  const data=await loader.loadStage(w,l,5),physics=new PhysicsWorld();await physics.waitForReady();
  const scene=new LevelBuilder().build(data,physics,'dragon_ball');
  try{
   physics.step(1/60);
   for(const coin of data.objects.filter(o=>o.type==='collectible'&&o.id.includes('-balance-'))){
    // The Sella water uses its continuous buoyancy surface rather than solid colliders.
    if(w===5&&l===3)continue;
    const hit=physics.getWorld()!.castRayAndGetNormal(new RAPIER.Ray({x:coin.position.x,y:coin.position.y+.05,z:coin.position.z},{x:0,y:-1,z:0}),2.2,true);
    if(!hit||hit.timeOfImpact<.18||hit.normal.y<.25)unsupported.push(`M${w}-N${l} ${coin.id}: ${JSON.stringify(coin.position)}`);
   }
  }finally{scene.destroy();physics.getWorld()?.free();}
 }
 expect(unsupported).toEqual([]);
},20000);
