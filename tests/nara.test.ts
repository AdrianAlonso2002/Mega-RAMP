import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { WORLD_07_LEVEL_02_STAGES as stages } from '../src/levels/world-07/level-02-stages';
import { NARA_BUDGETS, NARA_NAMES, NARA_DECORATIONS, naraTrainPose, naraPath, nv } from '../src/levels/world-07/NaraRoutes';
import { createNaraModel, previewNaraModel } from '../src/levels/world-07/NaraModels';
import { LevelBuilder } from '../src/levels/LevelBuilder';
import { LevelLoader } from '../src/levels/LevelLoader';
import { getBakedStage } from '../src/levels/BakedStages';
import { PhysicsWorld } from '../src/physics/PhysicsWorld';
import { Player } from '../src/player/Player';
import { CHARACTERS } from '../src/player/Characters';
import { SpriteTextures } from '../src/rendering/SpriteTextures';
import { disposeStageResources } from '../src/rendering/StageResources';
import { SceneQuality } from '../src/rendering/SceneQuality';
import { applyRequestedStageUpdates } from '../src/levels/RequestedStageUpdates';
import type { LevelObjectData, Vector3Data } from '../src/levels/LevelTypes';
vi.mock('@dimforge/rapier3d-compat',async()=>{const path='../node_modules/@dimforge/rapier3d-compat/rapier.es.js';return import(path);});
beforeAll(async()=>{
  await RAPIER.init();
  vi.spyOn(SpriteTextures,'getCharacterTexture').mockReturnValue(new THREE.Texture());
  vi.spyOn(SpriteTextures,'getSphereTexture').mockReturnValue(new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement));
});
afterEach(()=>vi.unstubAllGlobals());
function stubDocument() {
  const gradient={addColorStop:()=>{}},ctx=new Proxy({}, {get:(_,k)=>k==='createLinearGradient'||k==='createRadialGradient'?()=>gradient:k==='measureText'?()=>({width:100}):()=>{}});
  vi.stubGlobal('document',{createElement:()=>({width:128,height:128,getContext:()=>ctx})});
}
async function fixture(stage:number) {
  stubDocument();const physics=new PhysicsWorld();await physics.waitForReady();
  const scene=new LevelBuilder().build(structuredClone(stages[stage]),physics,'dragon_ball'),runtime=scene.nara!,player=new Player(CHARACTERS[0],physics,scene.spawnPoint),camera=new THREE.PerspectiveCamera();player.respawn();
  const step=(dt=1/60,input={horizontal:0,vertical:0})=>{const motion=runtime.update(dt,player,input,camera);if(!motion)player.update(dt,input,camera);scene.update(dt,false,player.getPosition(),player);physics.step(dt);};
  return {physics,scene,runtime,player,camera,step,dispose:()=>{scene.destroy();player.destroy();physics.getWorld()?.free();}};
}
describe('Nara: ten authored, playable stages',()=>{
  it('registers all names, a hundred prizes and the twenty-prize rest stage',async()=>{
    vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{}});
    let total=0;
    for(let s=1;s<=10;s++) {
      const data=await new LevelLoader().loadStage(7,2,s);
      expect(data.name).toBe(NARA_NAMES[s-1]);expect(getBakedStage(7,2,s)?.id).toBe(data.id);
      expect(data.objects.filter(o=>o.type==='collectible')).toHaveLength(NARA_BUDGETS[s-1]);
      expect(data.objects.filter(o=>o.type==='goal')).toHaveLength(1);
      expect(new Set(data.objects.map(o=>o.id)).size).toBe(data.objects.length);
      expect(LevelLoader.getStageCollectiblesCount(7,2,s)).toBe(NARA_BUDGETS[s-1]);total+=NARA_BUDGETS[s-1];
    }
    expect(total).toBe(100);expect(LevelLoader.getLevelMaxCollectibles(7,2)).toBe(100);
  });
  it.each([1,2,3,4,5,6,7,8,9,10])('builds finite geometry, real colliders and supported start/finish in E%i',async(stage)=>{
    const f=await fixture(stage);
    try {
      expect(f.scene.nara).toBeDefined();expect(f.physics.getWorld()!.colliders.len()).toBeGreaterThan(0);
      f.scene.group.updateMatrixWorld(true);
      f.scene.group.traverse(node=>{if(node instanceof THREE.Mesh)expect(Array.from(node.geometry.getAttribute('position').array).every(Number.isFinite),node.name).toBe(true);});
      const ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);
      for(const point of [stages[stage].spawn,stages[stage].objects.find(o=>o.type==='goal')!.position]) {
        ray.set(new THREE.Vector3(point.x,point.y+.01,point.z),down);
        const hit=ray.intersectObjects(f.scene.collidableMeshes,false)[0];
        expect(hit,`E${stage} start/finish at ${JSON.stringify(point)}`).toBeDefined();
        expect(point.y-hit.point.y).toBeGreaterThanOrEqual(.03);expect(point.y-hit.point.y).toBeLessThan(1.5);
      }
      for(let i=0;i<20;i++)f.step();
      expect(f.player.getPosition().y).toBeGreaterThan(stages[stage].spawn.y-2);
      f.scene.reset?.();expect(f.runtime.elapsed).toBe(0);
    }finally{f.dispose();}
  });
  it('keeps prizes supported, except intentional launch arcs, in every stage',async()=>{
    for(const s of [1,3,4,5,6,7,8,9,10]) {
      const f=await fixture(s);
      try {
        f.scene.group.updateMatrixWorld(true);const ray=new THREE.Raycaster();
        for(const coin of stages[s].objects.filter(o=>o.type==='collectible')) {
          ray.set(new THREE.Vector3(coin.position.x,coin.position.y+.03,coin.position.z),new THREE.Vector3(0,-1,0));
          const hit=ray.intersectObjects(f.scene.collidableMeshes,false)[0];
          expect(hit,`E${s} ${coin.id}`).toBeDefined();expect(coin.position.y-hit.point.y,`E${s} ${coin.id}`).toBeLessThan(1.4);
        }
      }finally{f.dispose();}
    }
  });
  it('boards through the open doors, closes before a three-second trip and opens only at Nara',async()=>{
    expect(naraTrainPose(0).z).toBeCloseTo(0);expect(naraTrainPose(3).z).toBe(-240);expect(naraTrainPose(1.5).speed).toBeLessThan(-120);
    const f=await fixture(1);
    try {
      const train=f.scene.group.getObjectByName('nara-train')!,door=train.getObjectByName('nara-train-door')!;
      for(let i=0;i<60;i++)f.step();
      expect(f.runtime.trainBoarded).toBe(false);expect(train.position.z).toBe(0);
      expect(Math.abs(door.children[0].position.z)).toBeCloseTo(4.4);
      // Enter from the actual platform without teleporting through a door or a wall.
      for(let i=0;i<180&&!f.runtime.trainBoarded;i++){f.player.setLinearVelocity({x:-3,y:f.player.linvel().y,z:0});f.step();}
      expect(f.runtime.trainBoarded).toBe(true);expect(f.player.isInVehicle()).toBe(true);
      const boardedAt=f.runtime.elapsed;
      while(f.runtime.elapsed-boardedAt<.6)f.step();
      expect(train.position.z).toBe(0);expect(Math.abs(door.children[0].position.z)).toBeLessThan(1.6);
      while(f.runtime.elapsed-boardedAt<3.63)f.step();
      expect(f.runtime.trainArrived).toBe(false);expect(Math.abs(door.children[0].position.z)).toBeCloseTo(1.5);
      while(f.runtime.elapsed-boardedAt<3.7)f.step();
      expect(f.runtime.trainArrived).toBe(true);expect(f.player.isInVehicle()).toBe(true);
      while(f.runtime.elapsed-boardedAt<4.35)f.step();
      expect(f.player.isInVehicle()).toBe(false);expect(Math.abs(door.children[0].position.z)).toBeCloseTo(4.4);
      expect(f.player.getPosition().z).toBeCloseTo(-238.5,0);
      // The opposite side stays shut; the platform-side opening really is traversable.
      f.player.teleportTo(-1.7,12.8,-238.5);
      for(let i=0;i<70;i++){f.player.setLinearVelocity({x:-4,y:f.player.linvel().y,z:0});f.step();}
      expect(f.player.getPosition().x).toBeGreaterThan(-2.3);
      f.player.teleportTo(1.4,12.8,-238.5);
      for(let i=0;i<70;i++){f.player.setLinearVelocity({x:4,y:f.player.linvel().y,z:0});f.step();}
      expect(f.player.getPosition().x).toBeGreaterThan(4);expect(f.player.getPosition().y).toBeGreaterThan(12.4);
      f.runtime.reset();expect(f.runtime.trainBoarded).toBe(false);expect(Math.abs(door.children[0].position.z)).toBeCloseTo(4.4);
    }finally{f.dispose();}
  });
  it('supports the starting platform, blocks its pillars, and gives the nearby garden real ground',async()=>{
    const f=await fixture(1);
    try {
      for(let i=0;i<180;i++)f.step();expect(f.player.getPosition().y).toBeGreaterThan(12.6);expect(f.runtime.trainBoarded).toBe(false);
      const pillar=f.physics.getWorld()!.castRay(new RAPIER.Ray({x:11,y:14,z:0},{x:1,y:0,z:0}),5,true);
      expect(pillar).not.toBeNull();expect(pillar!.timeOfImpact).toBeCloseTo(1.88,2);
      f.player.teleportTo(11,12.8,0);
      for(let i=0;i<80;i++){
        f.player.setLinearVelocity({x:3,y:f.player.linvel().y,z:0});f.step();
        const p=f.player.getBody()!.translation(),dx=Math.max(Math.abs(p.x-13)-.12,0),dz=Math.max(Math.abs(p.z)-.12,0);
        expect(Math.hypot(dx,dz)).toBeGreaterThan(.69);
      }
      const garden=stages[1].objects.find(o=>o.id.endsWith('trees-0-1-base'))!;
      f.player.teleportTo(garden.position.x+3.4*garden.scale.x,garden.position.y+1,garden.position.z);
      for(let i=0;i<90;i++)f.step();expect(f.player.getPosition().y).toBeGreaterThan(garden.position.y+.55);
    }finally{f.dispose();}
  });
  it('has continuous 3D rails from the departure station to the arrival and native rail collision',async()=>{
    const f=await fixture(1);
    try {
      const object=stages[1].objects.find(o=>o.properties?.subType==='nara_tracks')!,model=f.scene.group.getObjectByName('nara-tracks')!;
      expect(Number(object.properties?.length)).toBeGreaterThan(270);
      model.updateWorldMatrix(true,true);const meshes=model.children.filter(c=>c instanceof THREE.Mesh) as THREE.Mesh[];
      expect(meshes.length).toBeLessThanOrEqual(3);
      const ray=new THREE.Raycaster();
      for(const x of [-1.98,1.98])for(let z=15;z>=-255;z-=15) {
        ray.set(new THREE.Vector3(x,13,z),new THREE.Vector3(0,-1,0));
        const hit=ray.intersectObjects(meshes,false)[0];expect(hit).toBeDefined();expect(hit.point.y).toBeCloseTo(11.12,3);
      }
      f.player.teleportTo(1.98,12,-120);for(let i=0;i<35;i++)f.step();expect(f.player.getPosition().y).toBeGreaterThan(11.65);
    }finally{f.dispose();}
  });
  it('repairs old saved station collisions, adds the railway once and preserves moved scenery',()=>{
    const saved=structuredClone(stages[1]);saved.customSaved=true;delete saved.properties!.naraStationRevision;
    saved.objects=saved.objects.filter(o=>o.properties?.subType!=='nara_tracks');
    const station=saved.objects.find(o=>o.id.endsWith('kioto-station'))!;station.position.x=1;station.properties!.hasCollision=false;
    const tree=saved.objects.find(o=>o.properties?.subType==='kyoto_pine')!;tree.position.x+=2;tree.properties!.hasCollision=false;const treePosition={...tree.position};
    saved.spawn={x:0,y:13.05,z:5};
    const updated=applyRequestedStageUpdates(saved,7,2,1);
    expect(station.properties!.hasCollision).toBe(true);expect(tree.properties!.hasCollision).toBe(true);expect(tree.position).toEqual(treePosition);expect(station.position.x).toBe(1);
    expect(updated.spawn).toEqual({x:7.3,y:13.05,z:1.5});expect(updated.objects.filter(o=>o.properties?.subType==='nara_tracks')).toHaveLength(1);
    const count=updated.objects.length;applyRequestedStageUpdates(updated,7,2,1);expect(updated.objects.length).toBe(count);
  });
  it('responds to weight on the seesaw, and its physical surface follows the visible tilt',async()=>{
    const f=await fixture(7);
    try {
      const bridge=f.scene.group.getObjectByName('nara-seesaw')!;
      // Keep weight on the visible surface; the more sensitive bridge can lift its far end
      // above the old fixed teleport height.
      for(let i=0;i<90;i++){const p=bridge.localToWorld(new THREE.Vector3(9,.8,0));f.player.teleportTo(p.x,p.y,p.z);f.step();}expect(bridge.rotation.z).toBeLessThan(-.15);
      for(let i=0;i<120;i++){const p=bridge.localToWorld(new THREE.Vector3(-9,.8,0));f.player.teleportTo(p.x,p.y,p.z);f.step();}expect(bridge.rotation.z).toBeGreaterThan(.15);
      const p=bridge.localToWorld(new THREE.Vector3(-8,.8,0));f.player.teleportTo(p.x,p.y,p.z);
      for(let i=0;i<20;i++)f.step();
      const local=bridge.worldToLocal(f.player.getPosition().clone());expect(local.y).toBeGreaterThan(.55);expect(local.y).toBeLessThan(1.2);
    }finally{f.dispose();}
  });
  it('adds three pagoda and two pond sweepers with native moving collisions',async()=>{
    for(const [stage,count] of [[8,3],[9,2]]) {
      const f=await fixture(stage);
      try {
        const rotors=stages[stage].objects.filter(o=>o.properties?.naraAction==='rotor');expect(rotors).toHaveLength(count);
        const arms:THREE.Object3D[]=[];f.scene.group.traverse(o=>{if(o.name==='nara-sweep-arm')arms.push(o);});expect(arms).toHaveLength(count);
        const before=arms.map(a=>a.rotation.y);for(let i=0;i<30;i++)f.step();
        arms.forEach((a,i)=>expect(a.rotation.y).not.toBe(before[i]));
        const save=structuredClone(stages[stage]);delete save.properties!.naraChallengeRevision;save.objects=save.objects.filter(o=>o.properties?.naraAction!=='rotor');save.customSaved=true;
        applyRequestedStageUpdates(save,7,2,stage);applyRequestedStageUpdates(save,7,2,stage);
        expect(save.objects.filter(o=>o.properties?.naraAction==='rotor')).toHaveLength(count);
      }finally{f.dispose();}
    }
  });
  it('rotates all three sticky bowls, carries a resting ball and resets their poses',async()=>{
    const f=await fixture(10);
    try {
      const bowls:THREE.Object3D[]=[];f.scene.group.traverse(o=>{if(o.name==='nara-bowl')bowls.push(o);});expect(bowls).toHaveLength(3);
      // First basin, halfway down its slope. Native contact must keep the ball supported
      // while the moving sticky surface introduces tangential motion.
      f.player.teleportTo(-27,19.25, -10);
      for(let i=0;i<90;i++)f.step();
      expect(bowls[0].rotation.y).toBeCloseTo(2.25);expect(bowls[1].rotation.y).toBeCloseTo(-2.7);
      expect(f.player.getPosition().y).toBeGreaterThan(18.4);expect(Math.abs(f.player.getPosition().z+10)).toBeGreaterThan(.15);
      f.scene.reset?.();bowls.forEach(b=>expect(b.rotation.y).toBe(0));
    }finally{f.dispose();}
  });
  it.each([30,60,120])('keeps an idle ball glued to the rotating bowl at %i fps and allows forward/backward controls',async(fps)=>{
    const f=await fixture(10);
    try {
      f.player.teleportTo(-27,19.325,-10);
      for(let i=0;i<fps*4;i++)f.step(1/fps);
      const p=f.player.getPosition();expect(Math.hypot(p.x+30,p.z+10)).toBeCloseTo(3,1);
      expect(Math.atan2(-(p.z+10),p.x+30)).toBeCloseTo(Math.atan2(Math.sin(1.5*4),Math.cos(1.5*4)),1);
      for(let i=0;i<fps;i++)f.step(1/fps,{horizontal:0,vertical:1});
      const forward=f.player.getPosition().z;
      for(let i=0;i<fps*2;i++)f.step(1/fps,{horizontal:0,vertical:-1});
      expect(f.player.getPosition().z).toBeGreaterThan(forward+.2);
      f.player.teleportTo(37,25.05,25);f.step(1/fps);expect(f.player.getPosition().x).toBeGreaterThan(30);
    }finally{f.dispose();}
  });
  it('moves odd and even pond elevators in opposite directions with a large supported travel',async()=>{
    const f=await fixture(9);
    try {
      const bridges:THREE.Object3D[]=[];f.scene.group.traverse(o=>{if(o.name==='nara-seesaw')bridges.push(o);});
      for(let i=0;i<28;i++)f.step();
      expect(bridges[0].position.y).toBeGreaterThan(17.6);expect(bridges[1].position.y).toBeLessThan(14.4);
      for(let i=0;i<4;i++)expect(bridges[i].position.y+bridges[i+1].position.y).toBeCloseTo(32);
      const y=bridges[0].position.y;for(let i=0;i<56;i++)f.step();expect(bridges[0].position.y).toBeLessThan(y-3.1);
    }finally{f.dispose();}
  });
  it('launches across all five gaps in Salto7 using the real normal character',async()=>{
    const f=await fixture(2);
    try {
      for(let i=0;i<5;i++) {
        const pad=stages[2].objects.find(o=>o.id.endsWith(`launch-${i}`))!;
        f.player.teleportTo(pad.position.x,pad.position.y+.8,pad.position.z);
        f.step();expect(f.player.linvel().y).toBeGreaterThan(7);
        let landed=false;
        for(let k=0;k<135;k++) {
          f.step();const p=f.player.getPosition();
          if(k>25&&p.z<pad.position.z-9&&f.player.linvel().y>-.8&&p.y>11){landed=true;break;}
        }
        expect(landed,`jump ${i+1}`).toBe(true);
      }
    }finally{f.dispose();}
  });
  it('uses bounded poses and instancing for the lanterns at all three qualities',()=>{
    for(const quality of ['low','medium','high'])for(const [kind] of NARA_DECORATIONS) {
      const obj:LevelObjectData={id:'preview',type:'decoration',position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1},properties:{subType:`nara_${kind}`}};
      const model=createNaraModel(obj,quality)!;expect(model).not.toBeNull();
      model.group.traverse(node=>{if(node instanceof THREE.Mesh)expect(Array.from(node.geometry.getAttribute('position').array).every(Number.isFinite)).toBe(true);});
      if(kind==='lantern_field') {
        const lamps=model.group.children.filter(o=>o instanceof THREE.InstancedMesh) as THREE.InstancedMesh[];
        expect(lamps).toHaveLength(16);expect(lamps.reduce((sum,mesh)=>sum+mesh.count,0)).toBe(2*(quality==='high'?1200:quality==='low'?180:600));
        expect(new Set(lamps.map(l=>l.geometry)).size).toBe(2);
        lamps.forEach(l=>{expect(l.userData.graphicsNoShadow).toBe(true);expect(l.castShadow).toBe(false);expect(l.boundingSphere!.radius).toBeLessThan(20);});
        expect(lamps[0].geometry.getAttribute('position').count+lamps[1].geometry.getAttribute('position').count).toBeLessThan(450);
        const lighting=new SceneQuality();lighting.prepare(model.group);lighting.setQuality('high');lamps.forEach(l=>{expect(l.castShadow).toBe(false);expect(l.receiveShadow).toBe(false);});lighting.dispose();
      }
      if(kind==='deer'){const head=model.group.getObjectByName('nara-deer-head')!;previewNaraModel(obj,model.group,2.2);expect(head.rotation.x).toBeGreaterThan(.5);}
      disposeStageResources(model.group);
    }
  });
  it('crosses the final Bowing Deer gap with its physical launch pad',async()=>{
    const f=await fixture(3);
    try {
      f.player.teleportTo(41,14.81,-4);f.step();expect(f.player.linvel().x).toBeGreaterThan(7);
      let landed=false;
      for(let i=0;i<100;i++){f.step();const p=f.player.getPosition();if(p.x>46&&p.y>13.5&&p.y<14.2&&Math.abs(f.player.linvel().y)<.8){landed=true;break;}}
      expect(landed).toBe(true);
    }finally{f.dispose();}
  });
  it('crosses the stairs, seesaw, pagoda and pond using native ball-floor collisions',async()=>{
    for(const s of [6,7,8,9]) {
      const f=await fixture(s);
      try {
        const paths=stages[s].objects.filter(o=>o.properties?.subType==='nara_path').map(o=>o.properties!.points as Vector3Data[]);
        const route=s===6?[...paths[0],...Array.from({length:20},(_,i)=>({x:-1-i,y:22+2*i/19,z:-19})),...paths[1]]:
          s===7?[...paths[0],...Array.from({length:29},(_,i)=>({x:14-i,y:16,z:0})),...paths[1]]:
          s===9?[...paths[0],...Array.from({length:21},(_,i)=>({x:-10+i,y:16,z:0})),...paths[1]]:paths[0];
        let index=4,won=false;
        for(let i=0;i<14000;i++) {
          const p=f.player.getPosition();
          while(index<route.length-5&&Math.hypot(route[index].x-p.x,route[index].z-p.z)<1)index++;
          const target=route[index],dx=target.x-p.x,dz=target.z-p.z,distance=Math.hypot(dx,dz)||1;
          // With the original higher exit restored, carry momentum across the unstable bridge.
          let speed=s===7&&index>=paths[0].length-2&&index<paths[0].length+34?30:s===9&&index>=paths[0].length-2&&index<paths[0].length+25?10:3;
          if(s===9&&index>=paths[0].length-2&&index<paths[0].length+25) {
            const j=Math.min(5,Math.max(0,Math.floor((p.x+10)/4)+1)),edge=-10+(j-1)*4;
            const next=j===5?16:16+Math.sin((f.runtime.elapsed+1/60)*3.4)*(j%2===0?1:-1)*1.65;
            if(p.x>edge-1.1&&next>p.y-.55)speed=0;
          }
          f.player.setLinearVelocity({x:dx/distance*speed,y:f.player.linvel().y,z:dz/distance*speed});f.step();
          const floor=s===7&&index>=paths[0].length&&index<paths[0].length+29?10:s===9?12.8:target.y-2.3;
          expect(f.player.getPosition().y,`E${s} section ${index} paths=${paths[0].length}, p=${JSON.stringify(f.player.getPosition())}, t=${f.runtime.elapsed}`).toBeGreaterThan(floor);
          if(index>=route.length-5&&distance<1.2){won=true;break;}
        }
        expect(won,`E${s} section ${index}, ball ${JSON.stringify(f.player.getPosition())}, target ${JSON.stringify(route[index])}`).toBe(true);
      }finally{f.dispose();}
    }
  },15000);
  it('updates unsaved placeholders and preserves actual editor saves',()=>{
    const draft=structuredClone(stages[3]);delete draft.properties!.naraRevision;draft.name='Generated placeholder';draft.objects=[];
    expect(applyRequestedStageUpdates(draft,7,2,3).name).toBe('Bowing Deer');
    const save=structuredClone(draft);save.customSaved=true;save.properties!.userSaved=true;
    const original=JSON.stringify(save.objects.filter(o=>o.type!=='collectible'));
    expect(applyRequestedStageUpdates(save,7,2,3).name).toBe('Generated placeholder');
    expect(JSON.stringify(save.objects.filter(o=>o.type!=='collectible'))).toBe(original);
  });
  it('restores the old E7 landing profile in saved stages once, retaining custom height offsets',()=>{
    const save=structuredClone(stages[7]);save.properties!.naraChallengeRevision='nara-challenges-v3';save.customSaved=true;
    const exit=save.objects.find(o=>o.id==='w7n2e7-mochi-west')!;
    const old=naraPath([nv(-14,10,0),nv(-14,10,9),nv(-24,12,18),nv(-37,14,17),nv(-43,14,6),nv(-36,14,-9),nv(-44,14,-19)],4.6,true).points;
    exit.properties!.points=old.map(p=>({...p,y:p.y+1.25}));
    applyRequestedStageUpdates(save,7,2,7);
    expect((exit.properties!.points as Vector3Data[]).every(p=>Math.abs(p.y-15.25)<.0001)).toBe(true);
    const once=JSON.stringify(exit);applyRequestedStageUpdates(save,7,2,7);expect(JSON.stringify(exit)).toBe(once);
  });
});
