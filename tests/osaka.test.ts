import {afterEach,beforeAll,describe,expect,it,vi} from 'vitest';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import {WORLD_07_LEVEL_03_STAGES as stages} from '../src/levels/world-07/level-03-stages';
import {OSAKA_NAMES,OSAKA_BUDGETS,OSAKA_DECORATIONS,osakaBladePose,osakaDomeHeight,osakaArc} from '../src/levels/world-07/OsakaRoutes';
import {createOsakaModel,previewOsakaModel} from '../src/levels/world-07/OsakaModels';
import {LevelBuilder} from '../src/levels/LevelBuilder';
import {LevelLoader} from '../src/levels/LevelLoader';
import {getBakedStage} from '../src/levels/BakedStages';
import {PhysicsWorld} from '../src/physics/PhysicsWorld';
import {Player} from '../src/player/Player';
import {CHARACTERS} from '../src/player/Characters';
import {SpriteTextures} from '../src/rendering/SpriteTextures';
import {disposeStageResources} from '../src/rendering/StageResources';
import {applyRequestedStageUpdates} from '../src/levels/RequestedStageUpdates';
import type {LevelObjectData,Vector3Data} from '../src/levels/LevelTypes';
vi.mock('@dimforge/rapier3d-compat',async()=>{const path='../node_modules/@dimforge/rapier3d-compat/rapier.es.js';return import(path);});
beforeAll(async()=>{await RAPIER.init();vi.spyOn(SpriteTextures,'getCharacterTexture').mockReturnValue(new THREE.Texture());vi.spyOn(SpriteTextures,'getSphereTexture').mockReturnValue(new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement));});
afterEach(()=>vi.unstubAllGlobals());
function documentStub(){const gradient={addColorStop:()=>{}},ctx=new Proxy({}, {get:(_,k)=>k==='createLinearGradient'||k==='createRadialGradient'?()=>gradient:k==='measureText'?()=>({width:100}):()=>{}});vi.stubGlobal('document',{createElement:()=>({width:128,height:128,getContext:()=>ctx})});}
async function fixture(stage:number){documentStub();const physics=new PhysicsWorld();await physics.waitForReady();const scene=new LevelBuilder().build(structuredClone(stages[stage]),physics,'dragon_ball'),player=new Player(CHARACTERS[0],physics,scene.spawnPoint),camera=new THREE.PerspectiveCamera();player.respawn();
  const step=(dt=1/60)=>{const motion=scene.nara?.update(dt,player,{horizontal:0,vertical:0},camera);scene.osaka?.update(dt,player);if(!motion)player.update(dt,{horizontal:0,vertical:0},camera);scene.update(dt,false,player.getPosition(),player);physics.step(dt);};
  return {scene,physics,player,step,dispose:()=>{scene.destroy();player.destroy();physics.getWorld()?.free();}};
}
describe('Osaka: ten authored courses and shared native assets',()=>{
  it('registers every name, ten stages and exactly one hundred collectibles',async()=>{
    vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{}});let total=0;
    for(let stage=1;stage<=10;stage++){const data=await new LevelLoader().loadStage(7,3,stage);expect(data.name).toBe(OSAKA_NAMES[stage-1]);expect(getBakedStage(7,3,stage)?.id).toBe(data.id);expect(data.objects.filter(o=>o.type==='collectible')).toHaveLength(OSAKA_BUDGETS[stage-1]);expect(new Set(data.objects.map(o=>o.id)).size).toBe(data.objects.length);total+=LevelLoader.getStageCollectiblesCount(7,3,stage);}
    expect(total).toBe(100);expect(LevelLoader.getLevelMaxCollectibles(7,3)).toBe(100);
  });
  it.each([1,2,3,4,5,6,7,8,9,10])('builds E%i with supported spawn, goal and prizes, and no invalid geometry',async(stage)=>{
    const f=await fixture(stage);
    try {
      expect(f.scene.osaka).toBeDefined();expect(f.scene.nara?.trainCameraTarget).toBeNull();f.scene.group.updateMatrixWorld(true);
      f.scene.group.traverse(o=>{if(o instanceof THREE.Mesh)expect(Array.from(o.geometry.getAttribute('position').array).every(Number.isFinite),o.name).toBe(true);});
      const ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0),data=stages[stage];
      const points=[data.spawn,...data.objects.filter(o=>o.type==='goal'||o.type==='collectible').map(o=>o.position)];
      for(const point of points){ray.set(new THREE.Vector3(point.x,point.y+.04,point.z),down);const hit=ray.intersectObjects(f.scene.collidableMeshes,false)[0];expect(hit,`E${stage}: ${JSON.stringify(point)}`).toBeDefined();expect(point.y-hit.point.y,`E${stage}: ${JSON.stringify(point)}`).toBeGreaterThan(.03);expect(point.y-hit.point.y,`E${stage}: ${JSON.stringify(point)}`).toBeLessThan(1.5);}
      for(let i=0;i<30;i++)f.step();expect(f.player.getPosition().y).toBeGreaterThan(data.spawn.y-2);
    }finally{f.dispose();}
  });
  it('keeps all reusable decoration geometry finite and animation transforms bounded at every quality',()=>{
    documentStub();for(const quality of ['low','medium','high'])for(const [kind] of OSAKA_DECORATIONS){const obj:LevelObjectData={id:'preview',type:'decoration',position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1},properties:{subType:`osaka_${kind}`}};const model=createOsakaModel(obj,quality)!;expect(model).not.toBeNull();for(const t of [0,1,2,3,1000])previewOsakaModel(obj,model.group,t);model.group.updateMatrixWorld(true);model.group.traverse(o=>{expect(o.matrixWorld.elements.every(Number.isFinite)).toBe(true);if(o instanceof THREE.Mesh)expect(Array.from(o.geometry.getAttribute('position').array).every(Number.isFinite)).toBe(true);});disposeStageResources(model.group);}
  });
  it('has a readable raised pause and a fast physical ninja slash',()=>{
    expect(osakaBladePose(.5,0).height).toBeGreaterThan(3.7);expect(osakaBladePose(1.6,0).height).toBeLessThan(.9);expect(osakaBladePose(1.6,0).active).toBe(true);expect(osakaBladePose(3.19,0).height).toBeGreaterThan(3.7);
  });
  it('hits the ball with the actual moving ninja blade, and does not rebuild geometry during animation',async()=>{
    const f=await fixture(9);try {
      const geometries=new Map<THREE.Mesh,THREE.BufferAttribute>();f.scene.group.traverse(o=>{if(o instanceof THREE.Mesh)geometries.set(o,o.geometry.getAttribute('position') as THREE.BufferAttribute);});
      for(let i=0;i<72;i++)f.step();const blade=stages[9].objects.find(o=>o.properties?.osakaAction==='blade')!;
      f.player.teleportTo(blade.position.x+.5,blade.position.y+1,blade.position.z);let kicked=false;
      for(let i=0;i<60;i++){f.step();if(f.player.linvel().y>5)kicked=true;}
      expect(kicked).toBe(true);for(const [mesh,attribute] of geometries)expect(mesh.geometry.getAttribute('position')).toBe(attribute);
    }finally{f.dispose();}
  });
  it('spins real roller colliders and returns all native actors to their initial pose on reset',async()=>{
    const f=await fixture(7);try {const rollers:THREE.Object3D[]=[];f.scene.group.traverse(o=>{if(o.name==='osaka-roller')rollers.push(o);});expect(rollers).toHaveLength(4);for(let i=0;i<60;i++)f.step();expect(Math.abs(rollers[0].rotation.x)).toBeGreaterThan(.7);expect(f.scene.osaka!.elapsed).toBeGreaterThan(.9);f.scene.reset?.();expect(f.scene.osaka!.elapsed).toBe(0);for(const r of rollers)expect(r.rotation.x+r.rotation.z).toBe(0);}finally{f.dispose();}
  });
  it('launches the normal ball over the Ninja Trap final gap onto its real landing',async()=>{
    const f=await fixture(9);try{f.player.teleportTo(49.3,21.75,0);for(let i=0;i<2;i++)f.step();expect(f.player.linvel().x).toBeGreaterThan(10);expect(f.player.linvel().y).toBeGreaterThan(4);let landed=false;for(let i=0;i<130;i++){f.step();const p=f.player.getPosition();if(p.x>61&&p.x<80&&p.y>20.5&&p.y<21.1&&Math.abs(f.player.linvel().y)<1){landed=true;break;}}expect(landed,JSON.stringify(f.player.getPosition())).toBe(true);}finally{f.dispose();}
  });
  it('updates generated placeholders and keeps existing editor geometry intact',()=>{
    const data=structuredClone(stages[1]);data.objects=[];delete data.properties!.osakaRevision;expect(applyRequestedStageUpdates(data,7,3,1).name).toBe('Takoyaki Stand');
    data.customSaved=true;data.objects=[{id:'obj-custom',type:'platform',position:{x:7,y:8,z:9},rotation:{x:0,y:0,z:0},scale:{x:3,y:1,z:3}}];const before=JSON.stringify(data.objects);applyRequestedStageUpdates(data,7,3,1);expect(JSON.stringify(data.objects.filter(o=>o.type!=='collectible'))).toBe(before);
  });
  it('crosses the sushi bridges, ramen rollers, park rings and castle stepping domes with native ball collisions',async()=>{
    const interpolate=(a:Vector3Data,b:Vector3Data)=>{const count=Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.6);return Array.from({length:count+1},(_,i)=>{const t=i/Math.max(1,count);return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t};});};
    for(const stage of [4,7,8,10]) {
      const f=await fixture(stage);try {
        const paths=stages[stage].objects.filter(o=>o.properties?.subType==='osaka_path').map(o=>o.properties!.points as Vector3Data[]);let route:Vector3Data[]=[];
        if(stage===4){const centers=stages[4].objects.filter(o=>o.type==='cylinder').map(o=>({...o.position,y:16}));route=centers.flatMap((p,i)=>i?interpolate(centers[i-1],p):[p]);}
        if(stage===7)route=[...paths[0],...interpolate(paths[0].at(-1)!,paths[1][0]),...paths[1],...interpolate(paths[1].at(-1)!,paths[2][0]),...paths[2]];
        if(stage===8){const rings=[[-50,0,11],[-27,14,5],[-4,-4,9],[20,17,12],[43,0,5],[65,15,13]];for(let i=0;i<rings.length;i++){const [x,z,r]=rings[i],prev=rings[i-1],next=rings[i+1],entry=prev?Math.atan2(prev[1]-z,prev[0]-x):Math.PI,exit=next?Math.atan2(next[1]-z,next[0]-x):0,turn=Math.atan2(Math.sin(exit-entry),Math.cos(exit-entry)),arc=osakaArc(x,z,r,entry,turn,18);if(route.length)route.push(...interpolate(route.at(-1)!,arc[0]));route.push(...arc);}}
        if(stage===10){route=[...paths[0],...osakaArc(0,0,22,0,Math.PI,16),...paths[2]];const domes=stages[10].objects.filter(o=>o.id.includes('last-dome'));for(const dome of domes){const p={...dome.position,y:dome.position.y+.6};route.push(...interpolate(route.at(-1)!,p));}}
        const first=route[0];f.player.teleportTo(first.x,first.y+1.05,first.z);let index=1,won=false;
        for(let i=0;i<12000;i++){const p=f.player.getPosition();while(index<route.length-1&&Math.hypot(route[index].x-p.x,route[index].z-p.z)<.7)index++;const target=route[index],dx=target.x-p.x,dz=target.z-p.z,d=Math.hypot(dx,dz)||1;f.player.setLinearVelocity({x:dx/d*3,y:f.player.linvel().y,z:dz/d*3});f.step();expect(f.player.getPosition().y,`E${stage}, section ${index}, ${JSON.stringify(f.player.getPosition())}`).toBeGreaterThan(target.y-2);if(index>=route.length-1&&d<1){won=true;break;}}
        expect(won,`E${stage} section ${index}, ball=${JSON.stringify(f.player.getPosition())}, target=${JSON.stringify(route[index])}, count=${route.length}`).toBe(true);
      }finally{f.dispose();}
    }
  },15000);
  it('keeps the castle stepping domes continuous and their analytical floor equal to the mesh',()=>{
    const domes=stages[10].objects.filter(o=>o.id.includes('last-dome'));expect(domes).toHaveLength(5);for(let i=1;i<domes.length;i++)expect(Math.abs(domes[i].position.x-domes[i-1].position.x)-Number(domes[i].properties!.radius)-Number(domes[i-1].properties!.radius)).toBeLessThan(.4);
    for(const d of domes)expect(osakaDomeHeight(Number(d.properties!.radius),Number(d.properties!.height),0,0)).toBeCloseTo(.6);
  });
});
