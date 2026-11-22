import {beforeAll,afterAll,describe,it,expect,vi} from 'vitest';
import * as THREE from 'three';
import {WORLD_06_LEVEL_03_STAGES as stages} from '../src/levels/world-06/level-03-stages';
import {OxfordLevel} from '../src/levels/world-06/OxfordLevel';
import {createOxfordModel,previewOxfordActor} from '../src/levels/world-06/OxfordModels';
import {createLondonModel} from '../src/levels/world-06/LondonModels';
import {buzzPosition,oxfordTrainZ,oxfordMagnetY,universityRoute,trailHeight,trailHole,OXFORD_TRAIN_LENGTH,TRAIL_HOLES} from '../src/levels/world-06/OxfordRoutes';
import {PhysicsWorld} from '../src/physics/PhysicsWorld';
import {Player} from '../src/player/Player';
import {CHARACTERS} from '../src/player/Characters';
import {SpriteTextures} from '../src/rendering/SpriteTextures';
import {LevelBuilder} from '../src/levels/LevelBuilder';
import {getBakedStage} from '../src/levels/BakedStages';
import {LevelLoader} from '../src/levels/LevelLoader';
import {applyRequestedStageUpdates} from '../src/levels/RequestedStageUpdates';
vi.mock('@dimforge/rapier3d-compat',async()=>{const path='../node_modules/@dimforge/rapier3d-compat/rapier.es.js';return import(path);});
beforeAll(()=>{
  vi.spyOn(SpriteTextures,'getCharacterTexture').mockReturnValue(new THREE.Texture());
  vi.spyOn(SpriteTextures,'getSphereTexture').mockReturnValue(new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement));
});
afterAll(()=>vi.restoreAllMocks());
async function fixture(n:number) {
  const data=structuredClone(stages[n]),physics=new PhysicsWorld();await physics.waitForReady();
  const runtime=new OxfordLevel(data,physics),player=new Player(CHARACTERS[1],physics,data.spawn),models=new Map<string,THREE.Group>();player.respawn();
  for(const obj of data.objects) {
    if(obj.type==='platform') physics.createBoxCollider(obj.position,{x:0,y:0,z:0,w:1},{x:obj.scale.x/2,y:obj.scale.y/2,z:obj.scale.z/2},.65,0);
    const model=createOxfordModel(obj)??createLondonModel(obj);if(!model) continue;models.set(obj.id,model.group);
    const owns=runtime.attach(obj,model.group,model.meshes);
    if(!owns&&obj.properties?.hasCollision===true) for(const mesh of model.meshes) {
      mesh.updateWorldMatrix(true,false);const geo=mesh.geometry.clone().applyMatrix4(mesh.matrixWorld),vertices=geo.getAttribute('position').array as Float32Array;
      physics.createTrimeshCollider(vertices,geo.index ? new Uint32Array(geo.index.array):Uint32Array.from({length:vertices.length/3},(_,i)=>i),.02,.72);geo.dispose();
    }
  }
  const obj=data.objects.find(o=>o.type==='goal')!,goal={mesh:new THREE.Group(),position:new THREE.Vector3().copy(obj.position),reached:false};goal.mesh.position.copy(obj.position);runtime.attachGoal(obj,goal);
  const camera=new THREE.PerspectiveCamera();
  const step=(x=0,z=0)=>{physics.step(1/60);return runtime.update(1/60,player,{horizontal:x,vertical:z},camera)??player.update(1/60,{horizontal:x,vertical:z},camera);};
  const dispose=()=>{runtime.destroy();player.destroy();physics.clearStageColliders();physics.getWorld()?.free();};
  return {data,physics,runtime,player,models,goal,step,dispose};
}
describe('Oxford shared stages, geometry and editor data',()=>{
  it('registers ten stages and upgrades obsolete drafts while retaining custom editor additions',()=>{
    for(let n=1;n<=10;n++) {
      const data=stages[n];expect(getBakedStage(6,3,n)).toBe(data);expect(data.objects.filter(o=>o.type==='goal')).toHaveLength(1);
      expect(new Set(data.objects.map(o=>o.id)).size).toBe(data.objects.length);
      const old=structuredClone(data);delete old.properties!.oxfordRevision;const custom={...structuredClone(data.objects[0]),id:'obj-custom-statue'};old.objects=[custom];
      const migrated=applyRequestedStageUpdates(old,6,3,n);expect(migrated.name).toBe(data.name);expect(migrated.objects).toContainEqual(custom);
      expect(applyRequestedStageUpdates(data,6,3,n)).toBe(data);
    }
  });
  it('serves the same Oxford stage through the normal loader including old saved levels',async()=>{
    vi.stubGlobal('localStorage',{getItem:()=>JSON.stringify({...stages[8],properties:{},customSaved:true,objects:[]})});
    try {expect((await new LevelLoader().loadStage(6,3,8)).objects).toEqual(stages[8].objects);} finally {vi.unstubAllGlobals();}
  });
  it('builds finite batched models and all ten complete physics scenes',async()=>{
    const gradient={addColorStop:()=>{}},context=new Proxy({}, {get:(_target,key)=>key==='createLinearGradient'||key==='createRadialGradient' ? ()=>gradient:key==='measureText' ? ()=>({width:100}):()=>{}});
    vi.stubGlobal('document',{createElement:()=>({width:128,height:128,getContext:()=>context})});
    const physics=new PhysicsWorld();await physics.waitForReady();
    try {for(const data of Object.values(stages)) {
      for(const obj of data.objects) {const model=createOxfordModel(obj);if(!model) continue;model.group.traverse(o=>{if(o instanceof THREE.Mesh) {o.geometry.computeBoundingSphere();expect(Number.isFinite(o.geometry.boundingSphere!.radius)).toBe(true);}});}
      const scene=new LevelBuilder().build(structuredClone(data),physics,'dragon_ball');expect(scene.oxford).toBeDefined();expect(scene.goal).not.toBeNull();scene.update(1/60,true);scene.reset?.();scene.destroy();
    }} finally {physics.getWorld()?.free();vi.unstubAllGlobals();}
  },20000);
  it('matches real holes and raised walkways across every Trail section, including two central bridges',()=>{
    const obj=stages[10].objects.find(o=>o.properties?.subType==='oxford_trail')!,model=createOxfordModel(obj)!;model.group.updateWorldMatrix(true,true);
    for(let z=17.5;z>-164;z--) {
      const at=(x:number)=>new THREE.Raycaster(new THREE.Vector3(x,20,z),new THREE.Vector3(0,-1,0),0,12).intersectObjects(model.meshes,false);
      for(const x of [0,-2.8,2.8]) {
        const hits=at(x);expect(hits.length>0,`hole x=${x}, z=${z}`).toBe(!trailHole(z,x));
        if(hits.length) {for(const hit of hits) expect(hit.point.distanceTo(hits[0].point)).toBeLessThan(.00001);expect(hits[0].point.y).toBeCloseTo(trailHeight(z,x),2);}
      }
    }
  });
  it('has a continuously undulating university route with usable slopes and no abrupt steps',()=>{
    const points=universityRoute();expect(Math.max(...points.map(p=>p.y))-Math.min(...points.map(p=>p.y))).toBeGreaterThan(5);
    for(let i=1;i<points.length;i++) {const a=points[i-1],b=points[i];expect(Math.abs(b.y-a.y)/Math.hypot(b.x-a.x,b.z-a.z)).toBeLessThan(.45);}
  });
  it('keeps the base static and halves the former yellow orbit speed while preserving the blue speed',()=>{
    expect(buzzPosition(1,0)).toEqual(buzzPosition(10,0));
    for(const i of [1,2]) {const a=buzzPosition(0,i).sub(new THREE.Vector3(0,7,0)),b=buzzPosition(.1,i).sub(new THREE.Vector3(0,7,0));expect(a.angleTo(b)).toBeCloseTo(.032,4);expect(a.length()).toBeCloseTo(12*i);}
  });
  it('removes the BuzzBallz access ramp, keeps their labels upright, and lowers the landing below the yellow ball',()=>{
    expect(stages[2].objects.some(o=>o.id.endsWith('-acceso'))).toBe(false);
    const yellow=stages[2].objects.find(o=>o.id.endsWith('-buzz-2'))!,model=createOxfordModel(yellow)!;
    expect(model.group.position.z).toBeCloseTo(24);
    for(const t of [0,1,3,7]) {previewOxfordActor(yellow,model.group,t);expect(model.group.rotation.x).toBe(0);expect(model.group.rotation.y).toBe(0);}
    expect(stages[2].objects.find(o=>o.type==='goal')!.position.y).toBeLessThan(-11);
  });
  it('lays out twenty central coins, souvenir coins at ±1.2, and spaced University coins while tapering to half a character width',()=>{
    const grid=stages[5].objects.filter(o=>o.type==='collectible');expect(grid).toHaveLength(20);
    expect(new Set(grid.map(o=>o.position.x)).size).toBe(4);expect(new Set(grid.map(o=>o.position.z)).size).toBe(5);
    for(const o of stages[6].objects.filter(o=>o.type==='collectible')) expect(Math.abs(o.position.x)).toBe(1.2);
    expect(stages[9].objects.filter(o=>o.type==='collectible')).toHaveLength(8);
    const obj=stages[9].objects.find(o=>o.properties?.subType==='london_path')!,model=createLondonModel(obj)!;model.group.updateWorldMatrix(true,true);
    const points=obj.properties!.points as THREE.Vector3[];
    for(const i of [0,60,120,180,240]) {
      const p=points[i],ray=new THREE.Raycaster(new THREE.Vector3(p.x,p.y+3,p.z),new THREE.Vector3(0,-1,0),0,4);expect(ray.intersectObjects(model.meshes,false).length).toBeGreaterThan(0);
    }
    expect(obj.properties!.widthEnd).toBe(.75);
    expect(new Set(TRAIL_HOLES.map(h=>h.x)).size).toBeGreaterThan(4);expect(Math.abs(trailHeight(-36,-3)-trailHeight(-36,3))).toBeGreaterThan(.7);
  });
  it('separates station pavement and scenery surfaces at both ends of the railway',()=>{
    const railway=stages[1].objects.find(o=>o.properties?.subType==='oxford_railway')!,rail=createOxfordModel(railway)!;rail.group.updateWorldMatrix(true,true);
    for(const station of stages[1].objects.filter(o=>o.properties?.subType==='oxford_station')) {
      const model=createOxfordModel(station)!;model.group.updateWorldMatrix(true,true);
      const ray=new THREE.Raycaster(new THREE.Vector3(17,1,station.position.z),new THREE.Vector3(0,-1,0),0,2);
      const pavement=ray.intersectObjects(model.group.children,true).filter(h=>h.point.y>-.1),ground=ray.intersectObjects(rail.group.children,true).filter(h=>h.point.y<0);
      expect(pavement[0].point.y).toBeCloseTo(.12);if(ground.length) expect(pavement[0].point.y-ground[0].point.y).toBeGreaterThan(.25);
    }
  });
  it('keeps the campus cornice off the tower faces and every pier below its walkway',()=>{
    const college=createOxfordModel({...structuredClone(stages[5].objects.find(o=>o.properties?.subType==='oxford_college')!),position:{x:0,y:0,z:0},scale:{x:1,y:1,z:1},rotation:{x:0,y:0,z:0}})!;college.group.updateWorldMatrix(true,true);
    const hits=new THREE.Raycaster(new THREE.Vector3(14,10.9,0),new THREE.Vector3(-1,0,0),0,30).intersectObjects(college.meshes,false);
    expect(hits.filter(h=>Math.abs(h.point.x-10)<.001)).toHaveLength(1);expect(hits.some(h=>Math.abs(h.point.x-10.3)<.001)).toBe(true);
    for(const obj of stages[9].objects.filter(o=>o.properties?.subType==='oxford_pier')) {const model=createOxfordModel(obj)!;model.group.updateWorldMatrix(true,true);expect(new THREE.Box3().setFromObject(model.group).max.y).toBeLessThan(obj.position.y+17.7);}
  });
});
describe('Oxford interactive physics',()=>{
  it('offers a complete pursuit through three lanes to the open Oxford train',async()=>{
    const f=await fixture(1);try {
      let won=false;
      for(let i=0;i<4200;i++) {
        const p=f.player.getPosition(),v=f.player.linvel(),trains=[...f.models.entries()].filter(([id])=>/tren-\d/.test(id)).map(([,g])=>g);
        const danger=trains.filter(t=>t.position.z<p.z+30&&t.position.z>p.z-105);
        const lanes=p.z<-870 ? [0]:[-5.5,0,5.5];
        const target=lanes.sort((a,b)=>{
          const cost=(x:number)=>Math.abs(x-p.x)*.2+danger.reduce((n,t)=>n+(Math.abs(t.position.x-x)<2.6 ? 200/(1+Math.abs(t.position.z-p.z)/40):0),0);
          return cost(a)-cost(b);
        })[0];
        expect(f.step(THREE.MathUtils.clamp((target-p.x)*.7-v.x*.28,-1,1),1).fellOut,`train ${i/60}s ${JSON.stringify(p)}`).toBe(false);
        if(p.z<f.goal.position.z+.4&&Math.abs(p.x)<1.4&&p.y>1.7) {won=true;break;}
      }
      expect(won).toBe(true);expect(f.runtime.elapsed).toBeGreaterThan(28);expect(f.runtime.elapsed).toBeLessThan(45);expect(f.runtime.controlsGoal).toBe(false);
    } finally {f.dispose();}
  },15000);
  it('can traverse the campus run and undulating road using ordinary ball controls',async()=>{
    for(const n of [3,9]) {const f=await fixture(n);try {
      const route=f.data.objects.find(o=>o.properties?.subType==='london_path')!.properties!.points as THREE.Vector3[];
      let won=false;
      for(let i=0;i<4200;i++) {
        const p=f.player.getPosition(),v=f.player.linvel(),targetZ=p.z-3;
        let k=route.findIndex(q=>q.z<=targetZ);if(k<0) k=route.length-1;
        const target=route[k],inputX=THREE.MathUtils.clamp((target.x-p.x)*.6-v.x*.22,-1,1),inputZ=THREE.MathUtils.clamp((9+v.z)*.35,-1,1);
        expect(f.step(inputX,inputZ).fellOut,`stage ${n}, ${JSON.stringify(p)}`).toBe(false);
        if(p.z<=f.goal.position.z+.5) {won=true;break;}
      }
      expect(won,`stage ${n}`).toBe(true);
    } finally {f.dispose();}}
  },15000);
  it('can follow a narrow bypass for the full Great Hall and really falls through a central hole',async()=>{
    const f=await fixture(10);try {
      f.player.teleportTo(2.8,13.1,18);let won=false;
      for(let i=0;i<3000;i++) {
        const p=f.player.getPosition(),v=f.player.linvel(),central=TRAIL_HOLES.some(h=>h.sideHoles&&p.z<h.z+h.length/2+10&&p.z>h.z-h.length/2-2),target=central ? 0:2.8;
        expect(f.step(THREE.MathUtils.clamp((target-p.x)*.9-v.x*.4,-1,1),THREE.MathUtils.clamp((6+v.z)*.35,-1,1)).fellOut,`Trail ${JSON.stringify(p)}`).toBe(false);
        if(p.z<=-163) {won=true;break;}
      }
      expect(won).toBe(true);f.runtime.reset();f.player.teleportTo(0,13,-4);f.player.setLinearVelocity({x:0,y:0,z:0});
      let fell=false;for(let i=0;i<180;i++) if(f.step().fellOut) {fell=true;break;}expect(fell).toBe(true);
    } finally {f.dispose();}
  },15000);
  it('times the departing train for a thirty-second pursuit, then holds its doors open',async()=>{
    expect(oxfordTrainZ(0)).toBe(-70);expect(oxfordTrainZ(29)).toBe(-OXFORD_TRAIN_LENGTH);expect(oxfordTrainZ(100)).toBe(-OXFORD_TRAIN_LENGTH);
    const f=await fixture(1);try {
      f.player.teleportTo(25,1,12);expect(f.runtime.controlsGoal).toBe(true);
      for(let i=0;i<1800;i++) f.step();
      const train=f.models.get('w6s31-tren-perdido')!;expect(train.position.z).toBe(-940);expect(train.getObjectByName('oxford-train-door')!.visible).toBe(false);expect(f.runtime.controlsGoal).toBe(false);
      f.player.teleportTo(0,1.95,-925);for(let i=0;i<60;i++) f.step();expect(f.player.getPosition().y).toBeGreaterThan(1.8);
      f.runtime.reset();expect(train.getObjectByName('oxford-train-door')!.visible).toBe(true);expect(f.runtime.controlsGoal).toBe(true);
    } finally {f.dispose();}
  },15000);
  it('makes oncoming trains lethal at ground level while allowing their roofs',async()=>{
    const f=await fixture(1);try {
      const train=f.models.get('w6s31-tren-0')!;f.player.teleportTo(train.position.x,2,train.position.z);expect(f.step().fellOut).toBe(true);
      f.runtime.reset();f.player.teleportTo(train.position.x,5,train.position.z);expect(f.step().fellOut).toBe(false);
    } finally {f.dispose();}
  });
  it('synchronises each moving BuzzBallz body with its rendered orbital position',async()=>{
    const f=await fixture(2);try {
      for(let i=0;i<120;i++) f.step();f.physics.step(1/60);
      const bodies:THREE.Vector3[]=[];f.physics.getWorld()!.forEachRigidBody(b=>{if(b.isKinematic()) bodies.push(new THREE.Vector3().copy(b.translation()));});
      for(let i=0;i<3;i++) expect(bodies.some(p=>p.distanceTo(f.models.get(`w6s32-buzz-${i}`)!.position)<.001)).toBe(true);
    } finally {f.dispose();}
  });
  it('rests on smooth BuzzBallz caps without repeated bounce, including the moving yellow ball',async()=>{
    for(const index of [0,2]) {
      const f=await fixture(2);try {
        f.data.objects.filter(o=>o.properties?.oxfordAction==='buzz'&&Number(o.properties.index)!==index).forEach(o=>o.position.x=1000);
        f.runtime.reset();f.player.respawn();const ball=f.models.get(`w6s32-buzz-${index}`)!;
        f.player.teleportTo(ball.position.x,ball.position.y+7.14,ball.position.z);let low=Infinity,high=-Infinity;
        for(let i=0;i<240;i++) {expect(f.step().fellOut).toBe(false);if(i>30) {const relative=f.player.getPosition().y-ball.position.y;low=Math.min(low,relative);high=Math.max(high,relative);}}
        expect(high-low,`ball ${index}: ${low}..${high}`).toBeLessThan(.22);expect(low).toBeGreaterThan(6.8);
      } finally {f.dispose();}
    }
  });
  it('allows a timed crossing of the orbiting BuzzBallz to the landing platform',async()=>{
    const f=await fixture(2);try {
      let won=false;const attempts:unknown[]=[];
      for(const wait of [0,1,2,3,4,5,6,7,8,9,10,11]) {
        f.runtime.reset();f.player.respawn();for(let i=0;i<wait*60;i++) f.step();
        for(let i=0;i<1500;i++) {
          const p=f.player.getPosition(),v=f.player.linvel(),input=p.z>10 ? 1:THREE.MathUtils.clamp((12+v.z)*.3,-1,1);
          const motion=f.step(0,input);if(motion.fellOut) break;
          if(p.z<-33&&p.z>-40&&p.y>f.goal.position.y+.5&&p.y<f.goal.position.y+3) {won=true;break;}
        }
        attempts.push({wait,p:f.player.getPosition().toArray()});if(won) break;
      }
      expect(won,JSON.stringify(attempts)).toBe(true);
    } finally {f.dispose();}
  },15000);
  it('tips a table towards the player in both axes, and only its paired bear shakes it',async()=>{
    const f=await fixture(7);try {
      const bears=f.data.objects.filter(o=>o.properties?.oxfordAction==='bear');bears.forEach(o=>o.properties!.oxfordAction='idle');
      const table=f.models.get('w6s37-mesa-0')!,other=f.models.get('w6s37-mesa-1')!;
      for(let i=0;i<160;i++) {table.updateWorldMatrix(true,false);const point=table.localToWorld(new THREE.Vector3(2,1,4));f.player.teleportTo(point.x,point.y,point.z);f.step();}
      expect(table.rotation.x).toBeGreaterThan(.04);expect(table.rotation.z).toBeLessThan(-.1);expect(other.rotation.x).toBeCloseTo(0);expect(other.rotation.z).toBeCloseTo(0);
      f.runtime.reset();f.player.respawn();bears[0].properties!.oxfordAction='bear';for(let i=0;i<96;i++) f.step();
      expect(table.rotation.z).toBeLessThan(-.01);expect(other.rotation.z).toBeCloseTo(0);
    } finally {f.dispose();}
  });
  it('strikes 60 percent sooner and delivers twice the former table impulse',async()=>{
    const f=await fixture(7);try {
      f.data.objects.filter(o=>o.properties?.oxfordAction==='bear'&&o.properties.index!==0).forEach(o=>o.properties!.oxfordAction='idle');
      for(let i=0;i<51;i++) f.step();const table=f.models.get('w6s37-mesa-0')!;
      expect(table.rotation.z).toBeLessThan(-.025);expect(table.rotation.x).toBeGreaterThan(.006);
    } finally {f.dispose();}
  });
  it('adheres to the fast milk rotation without drifting off, while permitting forward and reverse control',async()=>{
    const f=await fixture(8);try {
      f.player.teleportTo(10,12.8,0);
      for(let i=0;i<1200;i++) {expect(f.step().fellOut).toBe(false);const p=f.player.getPosition();expect(Math.hypot(p.x,p.z)).toBeCloseTo(10,1);expect(p.y).toBeCloseTo(12.78,2);}
      const p=f.player.getPosition();expect(p.x).toBeCloseTo(10*Math.cos(f.runtime.elapsed*2.3),1);expect(p.z).toBeCloseTo(-10*Math.sin(f.runtime.elapsed*2.3),1);
      for(let i=0;i<90;i++) {const p=f.player.getPosition(),r=Math.hypot(p.x,p.z);expect(f.step(-p.x/r,p.z/r).fellOut).toBe(false);}
      const inner=Math.hypot(f.player.getPosition().x,f.player.getPosition().z);expect(inner).toBeLessThan(9);
      for(let i=0;i<120;i++) {const p=f.player.getPosition(),r=Math.hypot(p.x,p.z);expect(f.step(p.x/r,-p.z/r).fellOut).toBe(false);}
      expect(Math.hypot(f.player.getPosition().x,f.player.getPosition().z)).toBeGreaterThan(inner+1);
      f.runtime.reset();f.player.teleportTo(20,12.8,0);let fell=false;for(let i=0;i<180;i++) if(f.step().fellOut) {fell=true;break;}expect(fell).toBe(true);
    } finally {f.dispose();}
  },15000);
  it('detects a fast sky-ring crossing at the plane, including a descent, without accepting a miss',async()=>{
    const f=await fixture(8);try {
      f.player.teleportTo(0,12.9,0);f.step();
      f.player.teleportTo(0,29,0);f.step();f.player.teleportTo(0,33,0);f.step();expect(f.runtime.finishRequested).toBe(true);
      f.runtime.reset();f.player.teleportTo(0,12.9,0);f.step();f.player.teleportTo(7,29,0);f.step();f.player.teleportTo(7,33,0);f.step();expect(f.runtime.finishRequested).toBe(false);
      f.player.teleportTo(0,33,0);f.step();f.player.teleportTo(0,29,0);f.step();expect(f.runtime.finishRequested).toBe(true);
    } finally {f.dispose();}
  });
  it('uses distinct irregular magnet timings and throws a caught player sideways',async()=>{
    expect(new Set(Array.from({length:12},(_,i)=>oxfordMagnetY(3.8,i).toFixed(2))).size).toBe(12);
    const f=await fixture(6);try {
      let thrown=false;for(let i=0;i<600;i++) {const magnet=f.models.get('w6s36-iman-0')!;f.player.teleportTo(0,12.8,magnet.position.z);f.step();if(Math.abs(f.player.linvel().x)>10) {thrown=true;break;}}
      expect(thrown).toBe(true);
    } finally {f.dispose();}
  });
  it('rotates milk rings in opposite directions with matching colliders and launches through the sky goal',async()=>{
    const f=await fixture(8);try {
      const rings=[0,1,2,3].map(i=>f.models.get(`w6s38-franja-${i}`)!);for(let i=0;i<20;i++) f.step();expect(rings[0].rotation.y*rings[1].rotation.y).toBeLessThan(0);
      rings.forEach((ring,i)=>expect(Math.abs(ring.rotation.y)).toBeCloseTo(f.runtime.elapsed*(1.3+i*.5)));
      expect(f.models.get('w6s38-pajita')!.position.x).toBeCloseTo(Math.sin(f.runtime.elapsed*3.3)*3.1);
      f.runtime.reset();f.player.teleportTo(0,12.9,0);f.step();expect(f.player.linvel().y).toBeGreaterThan(25);
      for(let i=0;i<180&&!f.runtime.finishRequested;i++) f.step();expect(f.runtime.finishRequested).toBe(true);
      expect(f.goal.mesh.getObjectByName('oxford-sky-goal')).toBeDefined();f.runtime.reset();expect(f.runtime.finishRequested).toBe(false);
    } finally {f.dispose();}
  });
  it('previews the same individual motion in the editor and resets it deterministically',()=>{
    for(const stage of Object.values(stages)) for(const obj of stage.objects.filter(o=>o.properties?.oxfordAction)) {
      const model=createOxfordModel(obj)!;previewOxfordActor(obj,model.group,1);const p=model.group.position.clone(),q=model.group.quaternion.clone();
      previewOxfordActor(obj,model.group,5);previewOxfordActor(obj,model.group,1);expect(model.group.position.distanceTo(p)).toBeLessThan(.00001);expect(model.group.quaternion.angleTo(q)).toBeLessThan(.00001);
    }
  });
});
