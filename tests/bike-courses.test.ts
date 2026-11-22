import {beforeAll,afterAll,describe,it,expect,vi} from 'vitest';
import * as THREE from 'three';
import {WORLD_02_LEVEL_02_STAGES} from '../src/levels/world-02/level-02-stages';
import {WORLD_04_LEVEL_03_STAGES} from '../src/levels/world-04/level-03-stages';
import {WORLD_06_LEVEL_03_STAGES} from '../src/levels/world-06/level-03-stages';
import {bikeWheelPose,BIKE_REVISION} from '../src/levels/BikeCourse';
import {LevelBuilder} from '../src/levels/LevelBuilder';
import {PhysicsWorld} from '../src/physics/PhysicsWorld';
import {Player} from '../src/player/Player';
import {CHARACTERS} from '../src/player/Characters';
import {SpriteTextures} from '../src/rendering/SpriteTextures';
import {applyRequestedStageUpdates} from '../src/levels/RequestedStageUpdates';
vi.mock('@dimforge/rapier3d-compat',async()=>{const path='../node_modules/@dimforge/rapier3d-compat/rapier.es.js';return import(path);});
const courses=[WORLD_02_LEVEL_02_STAGES[6],WORLD_04_LEVEL_03_STAGES[1],WORLD_06_LEVEL_03_STAGES[4]];
beforeAll(()=>{
  vi.spyOn(SpriteTextures,'getCharacterTexture').mockReturnValue(new THREE.Texture());vi.spyOn(SpriteTextures,'getSphereTexture').mockReturnValue(new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement));
  const gradient={addColorStop:()=>{}},context=new Proxy({}, {get:(_t,k)=>k==='createLinearGradient'||k==='createRadialGradient' ? ()=>gradient:k==='measureText' ? ()=>({width:100}):()=>{}});
  vi.stubGlobal('document',{createElement:()=>({width:128,height:128,getContext:()=>context})});
});
afterAll(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});
describe('Reachable Bici, Bici2 and Bici3 transfers',()=>{
  it('keeps both wheel tops level with their receiving platforms and gives time to board at each end',()=>{
    for(const data of courses) {
      const h=data.spawn.y-1.05,wheels=data.objects.filter(o=>o.properties?.movementType==='bike_wheel_vertical');expect(wheels).toHaveLength(2);
      for(const wheel of wheels) expect(wheel.position.y+Number(wheel.properties!.radius)).toBeCloseTo(h);
      expect(bikeWheelPose(.8,12,1,5.5).offset).toBeCloseTo(0);expect(bikeWheelPose(10,12,1,5.5).offset).toBe(-12);
      expect(bikeWheelPose(10.1,12,1,5.5).pitch).toBe(bikeWheelPose(10,12,1,5.5).pitch);
    }
  });
  it('upgrades saved original bicycle courses while preserving custom additions',()=>{
    for(const source of courses.slice(0,2)) {const data=structuredClone(source);delete data.properties!.bikeRevision;data.objects.push({...structuredClone(data.objects[0]),id:'obj-custom-bike'});
      const fixed=applyRequestedStageUpdates(data,data.world,data.level,data.stage);expect(fixed.properties!.bikeRevision).toBe(BIKE_REVISION);expect(fixed.objects.some(o=>o.id==='obj-custom-bike')).toBe(true);
    }
  });
  for(const data of courses) it(`${data.name}: can ride each translating wheel to the next platform and either pedal to the front frame`,async()=>{
    const physics=new PhysicsWorld();await physics.waitForReady();const scene=new LevelBuilder().build(structuredClone(data),physics,'dragon_ball'),player=new Player(CHARACTERS[1],physics,data.spawn),camera=new THREE.PerspectiveCamera(),h=data.spawn.y-1.05;
    const step=(x:number,z:number)=>{physics.step(1/60);const motion=player.update(1/60,{horizontal:x,vertical:z},camera);scene.update(1/60,false,motion.position,player);return motion;};
    const steer=(targetX:number,targetZ:number,feedZ=0)=>{const p=player.getPosition(),v=player.linvel();return step(THREE.MathUtils.clamp((targetX-p.x)*.7-v.x*.4,-1,1),THREE.MathUtils.clamp((p.z-targetZ)*.7+(v.z-feedZ)*.9,-1,1));};
    try {
      for(const wheel of scene.movingPlatforms.filter(p=>p.movementType==='bike_wheel_vertical')) {
        scene.reset?.();player.respawn();if(wheel.basePosition.z<0) player.teleportTo(0,h+1.05,-10);
        let landed=false,exiting=false;const trace:unknown[]=[];
        for(let i=0;i<1500;i++) {
          exiting ||= wheel.mesh.position.z<wheel.basePosition.z-10.5;
          const target=exiting ? wheel.basePosition.z-17:wheel.mesh.position.z+.7;
          if(i%30===0) trace.push({t:i/60,p:player.getPosition().toArray(),w:wheel.mesh.position.z});
          expect(steer(0,target,exiting ? 0:wheel.body.linvel().z).fellOut,`${data.name} wheel ${wheel.id} ${JSON.stringify(trace)}`).toBe(false);
          const p=player.getPosition();if(p.z<wheel.basePosition.z-14&&p.y>h+.55) {landed=true;break;}
        }
        expect(landed,`${data.name} ${wheel.id} ${JSON.stringify(trace)}`).toBe(true);
      }
      for(const pedal of scene.movingPlatforms.filter(p=>p.movementType==='bike_pedal')) {
        scene.reset?.();player.respawn();scene.update(0,false,undefined,player);physics.step(1/60);
        const start=pedal.mesh.position;player.teleportTo(start.x,h+1.05,9);
        let landed=false,boarded=false,exiting=false;
        for(let i=0;i<1500;i++) {
          boarded ||= pedal.mesh.position.z>6.2&&pedal.mesh.position.y<h-2.5&&pedal.mesh.position.y>h-4.5&&pedal.body.linvel().y>0;
          exiting ||= boarded&&pedal.mesh.position.z<-1.8&&pedal.mesh.position.y>h+.3;
          const p=player.getPosition();expect(steer(exiting ? 0:pedal.mesh.position.x,exiting ? -8:boarded ? pedal.mesh.position.z:9,boarded&&!exiting ? pedal.body.linvel().z:0).fellOut,`${data.name} pedal ${pedal.id} ${JSON.stringify(p)}`).toBe(false);
          if(p.z<-4&&p.y>h+.55&&Math.abs(p.x)<3.5) {landed=true;break;}
        }
        expect(landed,`${data.name} pedal ${pedal.id}`).toBe(true);
      }
    } finally {player.destroy();scene.destroy();physics.getWorld()?.free();}
  },15000);
});
