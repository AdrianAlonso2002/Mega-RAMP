import {afterAll,beforeAll,expect,it,vi} from 'vitest';
import RAPIER from '@dimforge/rapier3d-compat';
import {LevelLoader} from '../src/levels/LevelLoader';
import {LevelBuilder} from '../src/levels/LevelBuilder';
import {PhysicsWorld} from '../src/physics/PhysicsWorld';
import {sampleSellaRiver} from '../src/levels/world-05/SellaRiver';
import audit from '../reports/collectibles-correction-audit.json';
vi.mock('@dimforge/rapier3d-compat',async()=>{const path='../node_modules/@dimforge/rapier3d-compat/rapier.es.js';return import(path);});
beforeAll(()=>{
 const gradient={addColorStop(){}},ctx=new Proxy({},{get:(_,k)=>k==='createLinearGradient'||k==='createRadialGradient'?()=>gradient:k==='measureText'?()=>({width:100}):k==='getImageData'?(_x:number,_y:number,w:number,h:number)=>({data:new Uint8ClampedArray(w*h*4)}):k==='createImageData'?(w:number,h:number)=>({data:new Uint8ClampedArray(w*h*4)}):()=>{}});
 vi.stubGlobal('document',{createElement:()=>({width:128,height:128,getContext:()=>ctx})});vi.stubGlobal('localStorage',{getItem:()=>null});
});
afterAll(()=>vi.unstubAllGlobals());
it('supports every new surface prize with actual collisions, and keeps vehicle/launch rewards on their dedicated routes',async()=>{
 const loader=new LevelLoader(),failures:string[]=[];let checked=0;
 for(const row of audit.filter(r=>r.added.length)){
  const [w,l,e]=row.key.split('_').map(Number),data=await loader.loadStage(w,l,e),physics=new PhysicsWorld();await physics.waitForReady();const scene=new LevelBuilder().build(data,physics,'dragon_ball','low');
  try{
   physics.step(1/60);
   for(const extra of row.added){
    const coin=data.objects.find(o=>o.id===extra.id)!;expect(coin,extra.id).toBeDefined();checked++;
    if(extra.reason==='canoe-river-centre'){
     const river=data.objects.find(o=>o.properties?.subType==='asturias_sella_river')!,points=river.properties!.points as {x:number;y:number;z:number}[],sample=sampleSellaRiver(points,coin.position,river.properties!.breaks as number[]);
     expect(sample,extra.id).not.toBeNull();expect(Math.abs(sample!.side),extra.id).toBeLessThan(.01);expect(coin.position.y-sample!.y,extra.id).toBeCloseTo(.8,4);continue;
    }
    if(extra.reason==='mine-cart-route'){expect(coin.position.z).toBeLessThan(-500);expect(coin.position.z).toBeGreaterThan(-1700);continue;}
    if(extra.reason==='padel-launch-arc'||extra.reason==='geyser-ascent'){expect(coin.position.x).toBe(0);expect(coin.position.y).toBeGreaterThan(1);continue;}
    const hit=physics.getWorld()!.castRayAndGetNormal(new RAPIER.Ray({...coin.position,y:coin.position.y+.1},{x:0,y:-1,z:0}),2.2,true);
    if(!hit||hit.timeOfImpact<.25||Math.abs(hit.timeOfImpact-.9)>.5||hit.normal.y<.3)failures.push(`${row.key} ${extra.id}: ${hit?.timeOfImpact}/${hit?.normal.y}`);
   }
  }finally{scene.destroy();physics.getWorld()?.free();}
 }
 expect(checked).toBe(109);expect(failures).toEqual([]);
},30000);
