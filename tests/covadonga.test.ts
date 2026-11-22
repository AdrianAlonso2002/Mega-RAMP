import {afterAll,beforeAll,describe,it,expect,vi} from "vitest";
import * as THREE from "three";
import {WORLD_05_LEVEL_04_STAGES as stages} from "../src/levels/world-05/level-04-stages";
import {createCovadongaModel} from "../src/levels/world-05/CovadongaModels";
import {CovadongaLevel} from "../src/levels/world-05/CovadongaLevel";
import {CovadongaPath,mineJunctions,mineRockDistance,cannonVelocity,cannonPosition} from "../src/levels/world-05/CovadongaPath";
import {getBakedStage} from "../src/levels/BakedStages";
import {applyRequestedStageUpdates} from "../src/levels/RequestedStageUpdates";
import {PhysicsWorld} from "../src/physics/PhysicsWorld";
import {LevelBuilder,type ActiveGoal} from "../src/levels/LevelBuilder";
import {Player} from "../src/player/Player";
import {CHARACTERS} from "../src/player/Characters";
import {SpriteTextures} from "../src/rendering/SpriteTextures";
import type {InputAxis} from "../src/input/InputManager";

vi.mock("@dimforge/rapier3d-compat",async()=>{const path="../node_modules/@dimforge/rapier3d-compat/rapier.es.js";return import(path);});
beforeAll(()=>{
  vi.spyOn(SpriteTextures,"getCharacterTexture").mockReturnValue(new THREE.Texture());
  vi.spyOn(SpriteTextures,"getSphereTexture").mockReturnValue(new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement));
});
afterAll(()=>vi.restoreAllMocks());

async function fixture(stage:number,obstacles=true) {
  const data=structuredClone(stages[stage]),physics=new PhysicsWorld();await physics.waitForReady();
  if(!obstacles) data.objects=data.objects.filter(o=>!["cow","rock"].includes(String(o.properties?.covadongaAction)));
  const level=new CovadongaLevel(data,physics),player=new Player(CHARACTERS[0],physics,data.spawn);player.respawn();
  const models:THREE.Group[]=[];
  for(const object of data.objects) {
    const model=createCovadongaModel(object);if(model) {model.group.name=object.id;models.push(model.group);level.attach(object,model.group,model.meshes);}
  }
  const object=data.objects.find(o=>o.type==="goal")!,mesh=new THREE.Group();mesh.position.copy(object.position);
  const goal:ActiveGoal={mesh,position:mesh.position.clone(),quaternion:mesh.quaternion.clone(),reached:false};level.attachGoal(object,goal);
  const step=(input:InputAxis,dt=1/60)=>{physics.step(dt);return level.update(dt,input,player);};
  const dispose=()=>{level.destroy();player.destroy();physics.getWorld()?.free();};
  return {data,level,player,physics,models,goal,step,dispose};
}

describe("Covadonga stage definitions and shared editor models",()=>{
  it("registers all ten stages with one goal, collectibles, scenery and unique IDs",()=>{
    for(let n=1;n<=10;n++) {
      const data=stages[n];expect(getBakedStage(5,4,n)?.name).toBe(data.name);
      expect(data.objects.filter(o=>o.type==="goal")).toHaveLength(1);
      expect(data.objects.filter(o=>o.type==="collectible").length).toBe([6,8,8,8,20,18,8,8,4,12][n-1]);
      expect(new Set(data.objects.map(o=>o.id)).size).toBe(data.objects.length);
      if(n!==6) expect(data.objects.some(o=>o.properties?.subType==="asturias_cov_landscape")).toBe(true);
      const old={...structuredClone(data),properties:{userSaved:true},objects:[{...structuredClone(data.objects[0]),id:"obj-custom-decoration"}]};
      const updated=applyRequestedStageUpdates(old,5,4,n);
      expect(updated.properties!.covadongaRevision).toBe("picos-covadonga-v1");
      expect(updated.objects.some(o=>o.id==="obj-custom-decoration")).toBe(true);
    }
  });
  it("keeps each bus route physically longer than its minimum duration at maximum speed",()=>{
    for(const n of [1,2,3]) {
      const data=stages[n],route=data.objects.find(o=>o.properties?.subType==="asturias_cov_road")!;
      const path=new CovadongaPath(route.properties!.points as THREE.Vector3[]);
      expect((path.length-17)/12).toBeGreaterThan(Number(data.properties!.minimumTravelTime));
    }
    const width=(n:number)=>Number(stages[n].objects.find(o=>o.properties?.subType==="asturias_cov_road")!.properties!.width);
    expect(width(3)).toBe(width(2)*2);
    expect(stages[7].objects.filter(o=>o.properties?.covadongaAction==="cow").length).toBeGreaterThanOrEqual(13);
  });
  it("creates finite shared models with batched landscape and actual fountain holes",()=>{
    for(const stage of Object.values(stages)) for(const object of stage.objects) {
      if(!String(object.properties?.subType).startsWith("asturias_cov_")) continue;
      const model=createCovadongaModel(object)!;expect(model).not.toBeNull();
      let count=0;
      model.group.traverse(child=>{
        if(child instanceof THREE.Mesh) {child.geometry.computeBoundingSphere();expect(Number.isFinite(child.geometry.boundingSphere!.radius)).toBe(true);count++;}
      });
      if(object.properties?.subType==="asturias_cov_landscape") expect(count).toBeLessThanOrEqual(5);
      model.group.traverse(child=>{if(child instanceof THREE.Mesh) {child.geometry.dispose();const materials=Array.isArray(child.material) ? child.material:[child.material];materials.forEach(m=>m.dispose());}});
    }
    const fountain=stages[8].objects.find(o=>o.properties?.covadongaAction==="fountain")!,model=createCovadongaModel(fountain)!;
    model.group.updateMatrixWorld(true);
    for(let tier=0;tier<7;tier++) {
      const y=50-tier*6.5,angle=tier*Math.PI*2/7;
      const ray=new THREE.Raycaster(new THREE.Vector3(Math.cos(angle)*5.2,y+.3,Math.sin(angle)*5.2),new THREE.Vector3(0,-1,0),0,1);
      expect(ray.intersectObjects(model.meshes,false)).toHaveLength(0);
      ray.set(new THREE.Vector3(3,y+.3,0),new THREE.Vector3(0,-1,0));
      if(tier!==0) expect(ray.intersectObjects(model.meshes,false).length).toBeGreaterThan(0);
    }
  });
  it("builds all complete game scenes with collisions and runtime hooks",async()=>{
    const gradient={addColorStop:()=>{}},context=new Proxy({}, {get:(_target,key)=>key==="createLinearGradient"||key==="createRadialGradient" ? ()=>gradient:key==="measureText" ? ()=>({width:100}):()=>{}});
    vi.stubGlobal("document",{createElement:()=>({width:128,height:128,getContext:()=>context})});
    const texture=new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement);
    const blocks=vi.spyOn(SpriteTextures,"getWorldBlockSet").mockReturnValue({top:texture,sideX:texture,sideZ:texture,bottom:texture,emissiveColor:new THREE.Color(),movingEmissiveColor:new THREE.Color()});
    const collectible=vi.spyOn(SpriteTextures,"getCollectibleTexture").mockReturnValue(texture);
    const physics=new PhysicsWorld();await physics.waitForReady();
    try {for(const data of Object.values(stages)) {
      const scene=new LevelBuilder().build(structuredClone(data),physics,"pan");
      expect(scene.covadonga).toBeDefined();expect(scene.goal).not.toBeNull();
      expect(scene.collectibles.length).toBe(data.objects.filter(o=>o.type==="collectible").length);
      expect(scene.collidableMeshes.length).toBeGreaterThan(0);
      scene.update(1/60,true);scene.reset?.();scene.destroy();
    }} finally {physics.getWorld()?.free();blocks.mockRestore();collectible.mockRestore();vi.unstubAllGlobals();}
  },20000);
});

describe("Covadonga gameplay",()=>{
  it("boards the bus by proximity and reaches the first goal after at least 15 seconds",async()=>{
    const f=await fixture(1,false);try {
      f.step({horizontal:0,vertical:0});expect(f.player.isInVehicle()).toBe(false);
      const bus=f.data.objects.find(o=>o.properties?.covadongaAction==="bus")!;
      f.player.teleportTo(bus.position.x,bus.position.y+1,bus.position.z+2);
      let frames=0;
      const route=new CovadongaPath(f.data.objects.find(o=>o.properties?.subType==="asturias_cov_road")!.properties!.points as THREE.Vector3[]);
      while(frames<3000 && !f.level.finishRequested) {
        const ahead=route.at(Math.min(route.length,f.level.travelled+12)).position,p=f.player.getPosition();
        const desired=Math.atan2(p.x-ahead.x,p.z-ahead.z),error=Math.atan2(Math.sin(desired-f.level.heading),Math.cos(desired-f.level.heading));
        const m=f.step({horizontal:THREE.MathUtils.clamp(-error*3,-1,1),vertical:1});expect(m?.fellOut,`bus at ${f.level.travelled}`).toBe(false);frames++;
      }
      expect(f.player.isInVehicle()).toBe(true);expect(f.level.finishRequested).toBe(true);expect(frames/60).toBeGreaterThanOrEqual(15);
      f.level.reset();f.player.respawn();expect(f.player.isInVehicle()).toBe(false);
    } finally {f.dispose();}
  });
  it("the bus steers, brakes, reverses and loses a life after falling over the open road edge",async()=>{
    const f=await fixture(2,false);try {
      for(let i=0;i<120;i++) f.step({horizontal:0,vertical:1});
      const speed=f.player.getSpeed();
      for(let i=0;i<30;i++) f.step({horizontal:0,vertical:-1});
      expect(f.player.getSpeed()).toBeLessThan(speed);
      let failed=false;for(let i=0;i<1200;i++) if(f.step({horizontal:1,vertical:1})?.fellOut) {failed=true;break;}
      expect(failed).toBe(true);
    } finally {f.dispose();}
  });
  it("colliding with a moving cow breaks the bus and resets cleanly",async()=>{
    const f=await fixture(3);try {
      const bus=f.data.objects.find(o=>o.properties?.covadongaAction==="bus")!,cow=f.data.objects.find(o=>o.properties?.covadongaAction==="cow")!;
      cow.position={...bus.position};cow.properties!.amplitude=0;
      expect(f.step({horizontal:0,vertical:0})?.fellOut).toBe(true);expect(f.level.broken).toBe(true);
      f.level.reset();expect(f.level.broken).toBe(false);
    } finally {f.dispose();}
  });
  it("keeps the fountain's physics stationary during the intro and lets the ball fall through the first spout",async()=>{
    const f=await fixture(8);try {
      f.level.animate(2,false);f.physics.step(1/60);
      f.physics.getWorld()!.forEachRigidBody(body=>{if(body.isKinematic()) expect(Math.abs(body.rotation().y)).toBeLessThan(.0001);});
      f.level.reset();f.player.respawn();f.player.teleportTo(5.2,51.12,0);
      for(let i=0;i<100;i++) f.step({horizontal:0,vertical:0});
      const y=f.player.getBody()!.translation().y;expect(y).toBeLessThan(46);expect(y).toBeGreaterThan(40);
    } finally {f.dispose();}
  });
  it("rotates each fountain tier and its own collider faster downwards while the centre remains fixed",async()=>{
    const f=await fixture(8);try {
      const mesh=f.models.find(m=>m.name.includes("fuente-siete-canos"))!,tiers=mesh.userData.fountainTiers as THREE.Group[];
      f.level.animate(1);f.physics.step(1/60);mesh.updateMatrixWorld(true);
      const rotations:number[]=[];f.physics.getWorld()!.forEachRigidBody(body=>{if(body.isKinematic()) rotations.push(body.rotation().y);});
      expect(tiers).toHaveLength(7);expect(rotations).toHaveLength(8);
      for(let i=0;i<7;i++) {
        if(i) expect(tiers[i].rotation.y).toBeGreaterThan(tiers[i-1].rotation.y);
        const q=tiers[i].getWorldQuaternion(new THREE.Quaternion());
        expect(rotations.some(y=>Math.abs(y-q.y)<1e-5)).toBe(true);
      }
      expect(rotations.some(y=>Math.abs(y)<1e-5)).toBe(true);expect(mesh.rotation.y).toBe(0);
      f.level.reset();f.physics.step(1/60);
      f.physics.getWorld()!.forEachRigidBody(body=>{if(body.isKinematic()) expect(Math.abs(body.rotation().y)).toBeLessThan(.0001);});
    } finally {f.dispose();}
  });
  it("has twelve real mine branches with nearby, hidden and crossed rails",()=>{
    const j=mineJunctions();expect(j).toHaveLength(12);
    expect(j.filter(x=>x.kind==="tutorial")).toHaveLength(2);expect(j.filter(x=>x.kind==="near")).toHaveLength(6);
    expect(j.filter(x=>x.kind==="hidden")).toHaveLength(2);expect(j.filter(x=>x.kind==="cross")).toHaveLength(2);
    expect(mineRockDistance(j[8])-j[8].start).toBeGreaterThan(mineRockDistance(j[2])-j[2].start);
  });
  it("the mine starts slowly for ten seconds and permits a complete correct route lasting at least a minute",async()=>{
    const f=await fixture(6);try {
      const j=mineJunctions();let frames=0,earlyDistance=0;const speeds=[0,0,0];
      while(frames<6000 && !f.level.finishRequested) {
        const upcoming=j.find(x=>x.start>=f.level.travelled-1)??j[j.length-1];
        const side=upcoming.blocked ? -upcoming.blocked:upcoming.coins;
        const before=f.level.travelled,result=f.step({horizontal:side,vertical:0});
        const speed=(f.level.travelled-before)*60;
        if(before>100 && before<j[3].start) speeds[0]=Math.max(speeds[0],speed);
        if(before>j[3].start+j[3].length+40 && before<j[6].start) speeds[1]=Math.max(speeds[1],speed);
        if(before>j[6].start+j[6].length+60) speeds[2]=Math.max(speeds[2],speed);
        expect(result?.fellOut,`cart distance ${f.level.travelled}`).toBe(false);
        frames++;if(frames===600) earlyDistance=f.level.travelled;
      }
      expect(earlyDistance).toBeLessThan(46);expect(f.level.finishRequested).toBe(true);expect(frames/60).toBeGreaterThanOrEqual(60);
      expect(speeds[0]).toBeCloseTo(23,3);expect(speeds[1]).toBeCloseTo(46,3);expect(speeds[2]).toBeCloseTo(69,3);
    } finally {f.dispose();}
  });
  it("the wrong mine branch breaks the cart and reset clears the decision",async()=>{
    const f=await fixture(6);try {
      let failed=false;for(let i=0;i<2400;i++) if(f.step({horizontal:mineJunctions()[2].blocked,vertical:0})?.fellOut) {failed=true;break;}
      expect(failed).toBe(true);expect(f.level.broken).toBe(true);f.level.reset();f.player.respawn();
      f.step({horizontal:0,vertical:0});expect(f.level.broken).toBe(false);expect(f.player.isInVehicle()).toBe(true);
    } finally {f.dispose();}
  });
  it("a cow knocks the normal character sideways",async()=>{
    const f=await fixture(7);try {
      const cow=f.models.find(g=>g.name.includes("vaca-0"))!;
      f.level.animate(0);f.player.teleportTo(cow.position.x,cow.position.y+1,cow.position.z);
      f.step({horizontal:0,vertical:0});expect(Math.abs(f.player.linvel().x)).toBeGreaterThan(18);
    } finally {f.dispose();}
  });
  it("the cannon has a real ballistic solution between the towers and wins only on a correct shot",async()=>{
    const f=await fixture(9);try {
      const cannon=f.data.objects.find(o=>o.properties?.covadongaAction==="cannon")!;
      f.player.teleportTo(cannon.position.x,cannon.position.y+1,cannon.position.z+2);
      for(let i=0;i<30;i++) f.step({horizontal:0,vertical:0});
      f.level.cannonYaw=0;
      let best=.3,error=Infinity;
      for(let pitch=.08;pitch<.62;pitch+=.001) {
        const velocity=cannonVelocity(0,pitch),origin=new THREE.Vector3().copy(cannon.position).add(new THREE.Vector3(0,1.7,0)).addScaledVector(velocity.clone().normalize(),3.7);
        const t=(f.goal.position.z-origin.z)/velocity.z,p=cannonPosition(origin,velocity,t),e=Math.abs(p.y-(f.goal.position.y+6));
        if(e<error) {error=e;best=pitch;}
      }
      f.level.cannonPitch=best;f.step({horizontal:0,vertical:0,action:true});
      for(let i=0;i<300 && !f.level.finishRequested;i++) expect(f.step({horizontal:0,vertical:0})?.fellOut).toBe(false);
      expect(f.level.finishRequested).toBe(true);expect(f.player.isInVehicle()).toBe(false);
    } finally {f.dispose();}
  });
  it("a missed cannon shot costs a life instead of accepting a near miss",async()=>{
    const f=await fixture(9);try {
      const cannon=f.data.objects.find(o=>o.properties?.covadongaAction==="cannon")!;
      f.player.teleportTo(cannon.position.x,cannon.position.y+1,cannon.position.z+2);
      for(let i=0;i<30;i++) f.step({horizontal:0,vertical:0});
      f.level.cannonYaw=.35;f.level.cannonPitch=.35;f.step({horizontal:0,vertical:0,action:true});
      let failed=false;for(let i=0;i<360;i++) if(f.step({horizontal:0,vertical:0})?.fellOut) {failed=true;break;}
      expect(failed).toBe(true);expect(f.level.finishRequested).toBe(false);
    } finally {f.dispose();}
  });
});
