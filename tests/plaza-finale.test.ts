import {beforeAll,afterAll,describe,it,expect,vi} from 'vitest';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import {WORLD_01_LEVEL_04_STAGES} from '../src/levels/world-01/level-04-stages';
import {applyPlazaFinale,PLAZA_FINALE_REVISION} from '../src/levels/world-01/PlazaFinale';
import {createConcertModel,concertLift} from '../src/levels/world-01/ConcertModel';
import {LevelBuilder} from '../src/levels/LevelBuilder';
import {PhysicsWorld} from '../src/physics/PhysicsWorld';
import {Player} from '../src/player/Player';
import {CHARACTERS} from '../src/player/Characters';
import {SpriteTextures} from '../src/rendering/SpriteTextures';
import {disposeStageResources} from '../src/rendering/StageResources';
import {applyRequestedStageUpdates} from '../src/levels/RequestedStageUpdates';
vi.mock('@dimforge/rapier3d-compat',async()=>{const path='../node_modules/@dimforge/rapier3d-compat/rapier.es.js';return import(path);});
beforeAll(()=>{
  vi.spyOn(SpriteTextures,'getCharacterTexture').mockReturnValue(new THREE.Texture());vi.spyOn(SpriteTextures,'getSphereTexture').mockReturnValue(new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement));
  const gradient={addColorStop:()=>{}},context=new Proxy({}, {get:(_t,k)=>k==='createLinearGradient'||k==='createRadialGradient'?()=>gradient:k==='measureText'?()=>({width:100}):()=>{}});
  vi.stubGlobal('document',{createElement:()=>({width:128,height:128,getContext:()=>context})});
});
afterAll(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});

async function fixture(stage:number,character=0,fps=60){
  const data=structuredClone(WORLD_01_LEVEL_04_STAGES[stage]),physics=new PhysicsWorld();await physics.waitForReady();
  const level=new LevelBuilder().build(data,physics,CHARACTERS[character].collectibleId),player=new Player(CHARACTERS[character],physics,data.spawn),camera=new THREE.PerspectiveCamera();
  return {data,physics,level,player,step:(x=0,z=0)=>{physics.step(1/fps);const motion=player.update(1/fps,{horizontal:x,vertical:z},camera);level.update(1/fps,false,motion.position,player);return motion;},dispose:()=>{player.destroy();level.destroy();physics.destroy();}};
}

describe('Villamanta finale routes',()=>{
  it('upgrades old saved finales once, preserving unrelated additions and subsequent edits',()=>{
    const data=structuredClone(WORLD_01_LEVEL_04_STAGES[9]);delete data.properties!.plazaFinaleRevision;
    data.objects.push({...structuredClone(data.objects[0]),id:'obj-custom-user'});
    const patched=applyRequestedStageUpdates(data,1,4,9);expect(patched.properties!.plazaFinaleRevision).toBe(PLAZA_FINALE_REVISION);expect(patched.objects.some(o=>o.id==='obj-custom-user')).toBe(true);
    patched.spawn.x=3;expect(applyPlazaFinale(patched).spawn.x).toBe(3);
    expect(new Set(patched.objects.map(o=>o.id)).size).toBe(patched.objects.length);
  });
  it('has a bounded smooth vibration and collision triangles matching the visible instruments',()=>{
    const model=createConcertModel();try{
      const vertices=model.collisionGeometry.getAttribute('position');expect(vertices.count).toBeGreaterThan(300);
      model.collisionGeometry.computeBoundingBox();const visible=new THREE.Box3().setFromObject(model.group,true);
      expect(model.meshes).toHaveLength(5);
      expect(model.collisionGeometry.boundingBox!.min.distanceTo(visible.min)).toBeLessThan(.001);
      expect(model.collisionGeometry.boundingBox!.max.distanceTo(visible.max)).toBeLessThan(.001);
      for(let i=0;i<1000;i++)expect(concertLift(i/240)).toBeGreaterThanOrEqual(0);
      expect(concertLift(.32/1.33-.00001)).toBeLessThan(.00001);
    }finally{model.collisionGeometry.dispose();disposeStageResources(model.group);}
  });
  it('leaves the microphone lane open rather than creating the old invisible central box',async()=>{
    const f=await fixture(9);try{
      f.player.teleportTo(1.2,1.3,4);let crossed=false;
      for(let i=0;i<300;i++){f.step(0,.45);if(f.player.getPosition().z<-1){crossed=true;break;}}
      expect(crossed,JSON.stringify(f.player.getPosition())).toBe(true);
    }finally{f.dispose();}
  });
  it('collides with the actual drum, cymbal, guitar and microphone while leaving empty floor clear',async()=>{
    const f=await fixture(9);try{
      f.step();
      for(const [x,z,minimum]of [[0,-4.5,2.7],[1.35,-4.4,3.1],[-3.8,1.5,1.6],[0,1,2.3],[1.2,0,.49]]){
        const hit=f.physics.getWorld()!.castRay(new RAPIER.Ray({x,y:6,z},{x:0,y:-1,z:0}),10,true);
        expect(hit).not.toBeNull();const y=6-hit!.timeOfImpact;
        expect(y).toBeGreaterThan(minimum);if(x===1.2)expect(y).toBeLessThan(.55);
      }
    }finally{f.dispose();}
  });
  it.each([30,60,120])('can descend the Y approach using normal ball physics at %i FPS',async fps=>{
    const f=await fixture(9,0,fps);try{
      let arrived=false;const trace:unknown[]=[];
      for(let i=0;i<fps*18;i++){
        const p=f.player.getPosition(),v=f.player.linvel(),targetX=p.z>26?-6*THREE.MathUtils.clamp((p.z-26)/12,0,1):0;
        const x=THREE.MathUtils.clamp((targetX-p.x)*1.5-v.x*.5,-1,1),forward=THREE.MathUtils.clamp((10+v.z)*.2,-1,1);
        f.step(x,forward);if(i%fps===0)trace.push(p.toArray());
        if(p.z<9&&p.y>.9&&p.y<2){arrived=true;break;}if(p.y<-3)break;
      }
      expect(arrived,JSON.stringify(trace)).toBe(true);
    }finally{f.dispose();}
  });
  it.each([0,1,2,3])('can make the long jump with character %i without artificial teleportation',async character=>{
    const f=await fixture(10,character);try{
      let airborne=false,landed=false;const trace:unknown[]=[];
      for(let i=0;i<600;i++){
        const p=f.player.getPosition();f.step(0,1);if(i%30===0)trace.push(p.toArray());
        if(p.z<28&&p.z>20&&p.y>3)airborne=true;
        if(airborne&&p.z<19&&p.z>-13&&p.y>1&&p.y<1.6){landed=true;break;}
        if(p.y<-3)break;
      }
      expect(landed,JSON.stringify(trace)).toBe(true);
    }finally{f.dispose();}
  });
});
