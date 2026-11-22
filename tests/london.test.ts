import {beforeAll,afterAll,describe,it,expect,vi} from "vitest";
import * as THREE from "three";
import {WORLD_06_LEVEL_01_STAGES as stages,LONDON_DECORATIONS,CHRISTMAS_DECORATIONS} from "../src/levels/world-06/level-01-stages";
import {createLondonModel,previewLondonActor} from "../src/levels/world-06/LondonModels";
import {LondonLevel} from "../src/levels/world-06/LondonLevel";
import {COLD_RUN_LENGTH,HAIR_HOT_LENGTH,FLIGHT_END,planePose,trainPose,londonMaze} from "../src/levels/world-06/LondonRoutes";
import {getBakedStage} from "../src/levels/BakedStages";
import {applyRequestedStageUpdates} from "../src/levels/RequestedStageUpdates";
import {PhysicsWorld} from "../src/physics/PhysicsWorld";
import {Player} from "../src/player/Player";
import {CHARACTERS} from "../src/player/Characters";
import {SpriteTextures} from "../src/rendering/SpriteTextures";
import {LevelBuilder,type ActiveCollectible} from "../src/levels/LevelBuilder";
import {buildRiverFrames} from "../src/levels/world-05/SellaRiver";

vi.mock("@dimforge/rapier3d-compat",async()=>{const path="../node_modules/@dimforge/rapier3d-compat/rapier.es.js";return import(path);});
beforeAll(()=>{
  vi.spyOn(SpriteTextures,"getCharacterTexture").mockReturnValue(new THREE.Texture());
  vi.spyOn(SpriteTextures,"getSphereTexture").mockReturnValue(new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement));
});
afterAll(()=>vi.restoreAllMocks());
const camera=new THREE.PerspectiveCamera();camera.position.set(0,4,10);camera.lookAt(0,1,0);
async function fixture(n:number) {
  const data=structuredClone(stages[n]),physics=new PhysicsWorld();await physics.waitForReady();
  const root=new THREE.Group(),level=new LondonLevel(data,physics,root),models=new Map<string,THREE.Group>();
  const player=new Player(CHARACTERS[1],physics,data.spawn);player.respawn();
  for(const obj of data.objects) {
    if(obj.type==="platform") physics.createBoxCollider(obj.position,{x:0,y:0,z:0,w:1},{x:obj.scale.x/2,y:obj.scale.y/2,z:obj.scale.z/2},.65,0);
    if(obj.type==="decoration") {
      const model=createLondonModel(obj);if(!model) continue;root.add(model.group);models.set(obj.id,model.group);
      const owned=level.attach(obj,model.group,model.meshes);
      if(!owned&&obj.properties?.hasCollision===true) for(const m of model.meshes) {
        m.updateWorldMatrix(true,false);const g=m.geometry.clone().applyMatrix4(m.matrixWorld),vertices=g.getAttribute("position").array as Float32Array;
        physics.createTrimeshCollider(vertices,g.index ? new Uint32Array(g.index.array):Uint32Array.from({length:vertices.length/3},(_,i)=>i),.035,.72);g.dispose();
      }
    }
  }
  const goalObj=data.objects.find(o=>o.type==="goal")!,goal={mesh:new THREE.Group(),position:new THREE.Vector3().copy(goalObj.position),reached:false};level.attachGoal(goal);
  const step=(horizontal=0,vertical=0)=>{physics.step(1/60);const motion=level.update(1/60,player);return motion??player.update(1/60,{horizontal,vertical},camera);};
  const dispose=()=>{level.destroy();player.destroy();physics.clearStageColliders();physics.getWorld()?.free();};
  return {data,physics,root,level,player,models,goal,step,dispose};
}
describe("London stage definitions and models",()=>{
  it("gives london_path a single upward-facing floor at the centre and borders, including curved joins",()=>{
    for(const stage of [stages[5],stages[7]]) {
      const obj=stage.objects.find(o=>o.properties?.subType==="london_path")!,model=createLondonModel(obj)!;
      model.group.updateMatrixWorld(true);
      const points=obj.properties!.points as THREE.Vector3[],frames=buildRiverFrames(points),width=Number(obj.properties!.width);
      for(let i=0;i<points.length-1;i+=Math.max(1,Math.floor(points.length/40))) for(const side of [-.49,0,.49]) {
        const a=points[i],c=points[i+1],x=(a.x+c.x)/2+(frames[i].x+frames[i+1].x)/2*width*side,z=(a.z+c.z)/2+(frames[i].z+frames[i+1].z)/2*width*side,y=(a.y+c.y)/2;
        const ray=new THREE.Raycaster(new THREE.Vector3(x,y+1,z),new THREE.Vector3(0,-1,0),0,1.1);
        const hits=ray.intersectObjects(model.meshes,false);
        expect(hits,`stage ${stage.stage} segment ${i} side ${side}`).toHaveLength(1);
        expect(hits[0].point.y).toBeCloseTo(y,4);expect(hits[0].face!.normal.y).toBeGreaterThan(.99);
      }
    }
  });
  it("registers ten stages and twenty reusable decorations, including saved-stage migration",()=>{
    expect(LONDON_DECORATIONS).toHaveLength(10);expect(CHRISTMAS_DECORATIONS).toHaveLength(10);
    for(let n=1;n<=10;n++) {
      const data=stages[n];expect(getBakedStage(6,1,n)).toBe(data);expect(data.objects.filter(o=>o.type==="goal")).toHaveLength(1);
      expect(new Set(data.objects.map(o=>o.id)).size).toBe(data.objects.length);
      const saved=structuredClone(data);delete saved.properties!.londonRevision;
      const custom={...structuredClone(saved.objects[0]),id:"obj-custom-keep"};saved.objects=[custom];
      const updated=applyRequestedStageUpdates(saved,6,1,n);expect(updated.objects.some(o=>o.id===custom.id)).toBe(true);expect(updated.name).toBe(data.name);
    }
    for(const [kind] of [...LONDON_DECORATIONS,...CHRISTMAS_DECORATIONS]) expect(stages[1].objects.some(o=>o.properties?.subType===`london_${kind}`)).toBe(true);
  });
  it("makes two distinct equally sized mazes with exactly one route to the central goal",()=>{
    const a=londonMaze(611),b=londonMaze(61010);expect(a.size).toBe(b.size);expect(a.walls).not.toEqual(b.walls);
    for(const maze of [a,b]) {
      expect(maze.links.reduce((sum,l)=>sum+l.length,0)/2).toBe(maze.size**2-1);
      expect(maze.solution[0]).toBe(0);expect(maze.solution.at(-1)).toBe(40);expect(maze.solution.length).toBeGreaterThan(15);
      for(let i=1;i<maze.solution.length;i++) expect(maze.links[maze.solution[i-1]]).toContain(maze.solution[i]);
    }
    expect(stages[10].properties!.pitchBlack).toBe(true);
  });
  it("creates finite batched models and leaves all train doorways physically open in the shell",()=>{
    for(const stage of Object.values(stages)) for(const obj of stage.objects) {
      const model=createLondonModel(obj);if(!model) continue;
      let drawCalls=0;model.group.traverse(o=>{if(o instanceof THREE.Mesh) {o.geometry.computeBoundingSphere();expect(Number.isFinite(o.geometry.boundingSphere!.radius)).toBe(true);drawCalls++;}});
      if(obj.properties?.subType==="london_scenery") expect(drawCalls).toBeLessThanOrEqual(3);
      if(obj.properties?.londonAction==="train") {
        model.group.updateWorldMatrix(true,true);
        for(const z of [-9,0,9]) {
          const origin=new THREE.Vector3(obj.position.x+4,1,obj.position.z+z),ray=new THREE.Raycaster(origin,new THREE.Vector3(-1,0,0),0,3);
          if(Number(obj.properties.trainIndex)===0) expect(ray.intersectObjects(model.meshes,false)).toHaveLength(0);
        }
      }
    }
  });
  it("builds and releases all ten complete game scenes with London runtimes",async()=>{
    const gradient={addColorStop:()=>{}},context=new Proxy({}, {get:(_target,key)=>key==="createLinearGradient"||key==="createRadialGradient" ? ()=>gradient:key==="measureText" ? ()=>({width:100}):()=>{}});
    vi.stubGlobal("document",{createElement:()=>({width:128,height:128,getContext:()=>context})});
    const physics=new PhysicsWorld();await physics.waitForReady();
    try {for(const data of Object.values(stages)) {const scene=new LevelBuilder().build(structuredClone(data),physics,"dragon_ball");expect(scene.london).toBeDefined();expect(scene.goal).not.toBeNull();scene.update(1/60,true);scene.reset?.();scene.destroy();}} finally {physics.getWorld()?.free();vi.unstubAllGlobals();}
  });
});
describe("London mechanics",()=>{
  it("calibrates both straight timed challenges using Adri's real movement",async()=>{
    const physics=new PhysicsWorld();await physics.waitForReady();physics.createBoxCollider({x:0,y:-.4,z:-300},{x:0,y:0,z:0,w:1},{x:10,y:.4,z:500},.65,0);
    const player=new Player(CHARACTERS[1],physics,{x:0,y:1.05,z:8});player.respawn();let cold=0,hot=0,entry=-1;
    for(let frame=1;frame<=1100;frame++) {
      physics.step(1/60);player.update(1/60,{horizontal:0,vertical:1},camera);const z=player.getPosition().z;
      if(frame===600) cold=8-z;
      if(entry<0&&z<=-8) entry=frame;
      if(frame===entry+600) hot=-8-z;
    }
    expect(cold).toBeCloseTo(COLD_RUN_LENGTH,0);expect(hot).toBeCloseTo(HAIR_HOT_LENGTH,0);
    player.destroy();physics.clearStageColliders();physics.getWorld()?.free();
  });
  it("flies exactly four full slow laps before landing and releasing the player beside the goal",async()=>{
    const f=await fixture(2);try {
      for(let lap=1;lap<=4;lap++) expect(planePose(lap*18).position.distanceTo(new THREE.Vector3(0,80,0))).toBeLessThan(.001);
      for(let i=0;i<Math.ceil((FLIGHT_END+1.6)*60);i++) expect(f.step().fellOut).toBe(false);
      expect(f.player.isInVehicle()).toBe(false);expect(f.level.flying).toBe(false);expect(f.level.controlsGoal).toBe(false);
      expect(f.player.getPosition().x).toBeCloseTo(5.5,1);expect(f.player.getPosition().z).toBeCloseTo(-168,1);
      const plane=f.models.get("w6s12-iberia")!;expect(plane.position.y).toBeCloseTo(.6);expect(plane.getObjectByName("london-plane-door")!.rotation.y).toBeGreaterThan(1);
    } finally {f.dispose();}
  });
  it("opens train doors for two seconds and takes ten seconds per journey",()=>{
    expect(trainPose(0).doors).toBe(true);expect(trainPose(1.999).doors).toBe(true);expect(trainPose(2).doors).toBe(false);
    expect(trainPose(12).atEnd).toBe(true);expect(trainPose(13.999).doors).toBe(true);expect(trainPose(14).doors).toBe(false);expect(trainPose(24).atStart).toBe(true);
    expect(trainPose(7).progress).toBeCloseTo(.5);
  });
  it("carries the ball and the three collectibles with each train and requires all three complete journeys",async()=>{
    const f=await fixture(3);try {
      const items:ActiveCollectible[]=f.data.objects.filter(o=>o.properties?.londonTrain).map(o=>({id:o.id,position:new THREE.Vector3().copy(o.position),mesh:new THREE.Group(),collected:false,baseX:o.position.x,baseY:o.position.y,baseZ:o.position.z}));
      for(let index=0;index<3;index++) {
        let attempts=0;while(!trainPose(f.level.elapsed,index*8).atStart && attempts++<1500) {f.player.teleportTo(index*8+4,.95,-index*120);expect(f.step().fellOut).toBe(false);}
        f.player.teleportTo(index*8,.85,-index*120);
        for(let frame=0;frame<850 && f.level.completedJourneys<=index;frame++) expect(f.step().fellOut,`train ${index} frame ${frame}`).toBe(false);
        expect(f.level.completedJourneys).toBe(index+1);
        expect(f.player.getPosition().z).toBeCloseTo(-120*(index+1),0);
        f.level.updateCollectibles(items,f.level.elapsed);
        const coin=items[index*3+1];expect(coin.position.z).toBeCloseTo(-120*(index+1),0);
        f.player.teleportTo(index*8+4,.95,-120*(index+1));
      }
      f.player.teleportTo(20,.9,-375);f.step();expect(f.level.finishRequested).toBe(true);
      f.level.reset();expect(f.level.completedJourneys).toBe(0);expect(f.level.finishRequested).toBe(false);
    } finally {f.dispose();}
  });
  it("progressively freezes the ball and loses a life after fifteen gameplay seconds",async()=>{
    const f=await fixture(6);try {
      for(let i=0;i<600;i++) expect(f.step().fellOut).toBe(false);
      const frost=f.root.getObjectByName("london-progressive-frost") as THREE.Mesh;
      expect((frost.material as THREE.MeshStandardMaterial).opacity).toBeGreaterThan(.35);
      let dead=false;for(let i=0;i<310;i++) dead ||= f.step().fellOut;
      expect(dead).toBe(true);expect(f.level.failure).toBe("cold");f.level.reset();expect((frost.material as THREE.MeshStandardMaterial).opacity).toBe(0);
    } finally {f.dispose();}
  });
  it("lets Adri reach the cold goal in ten seconds and leave the hot plate before its eleven-second snap",async()=>{
    for(const n of [6,9]) {
      const f=await fixture(n);try {
        const goal=f.goal.position;let frames=0,entered=-1,exit=-1;
        while(frames<1000&&f.player.getPosition().z>goal.z) {
          expect(f.step(0,1).fellOut,`stage ${n}, frame ${frames}`).toBe(false);frames++;
          if(n===9&&entered<0&&f.player.getPosition().z<=-8) entered=frames;
          if(n===9&&exit<0&&f.player.getPosition().z<=-HAIR_HOT_LENGTH-8) exit=frames;
        }
        if(n===6) expect(frames/60).toBeCloseTo(10,0);
        else {expect(exit).toBeGreaterThan(entered);expect((exit-entered)/60).toBeGreaterThan(9.5);expect((exit-entered)/60).toBeLessThan(10.6);}
      } finally {f.dispose();}
    }
  });
  it("makes the inflatable squash on contact and really fall off the narrow path instead of snapping back",async()=>{
    const f=await fixture(8);try {
      const toy=f.models.get("w6s18-primo")!;
      f.player.teleportTo(-1.3,.9,-17);
      for(let i=0;i<15;i++) {f.player.setLinearVelocity({x:3,y:0,z:0});f.step();}
      expect(toy.scale.y).toBeLessThan(.98);
      for(let i=0;i<240;i++) {f.player.setLinearVelocity({x:4,y:0,z:0});f.step();}
      expect(Math.abs(toy.position.x)).toBeGreaterThan(.6);expect(toy.position.y).toBeLessThan(-2);
      f.level.reset();expect(toy.position.x).toBe(0);expect(toy.position.z).toBe(-17);expect(toy.scale.y).toBe(1);
    } finally {f.dispose();}
  });
  it("the hair straightener charges on entry, crushes only inside, and reopens for the next cycle",async()=>{
    const f=await fixture(9);try {
      for(let i=0;i<120;i++) f.step();expect(f.level.failed).toBe(false);
      f.player.teleportTo(0,.95,-25);
      let dead=false;for(let i=0;i<680;i++) {f.player.teleportTo(0,.95,-25);dead ||= f.step().fellOut;}
      expect(dead).toBe(true);expect(f.level.failure).toBe("crush");
      f.level.reset();expect(f.level.failed).toBe(false);
      const obj=f.data.objects.find(o=>o.properties?.londonAction==="hair")!,model=f.models.get(obj.id)!;
      previewLondonActor(obj,model,11.5);expect(model.getObjectByName("london-hair-jaw")!.rotation.x).toBeCloseTo(.36);
    } finally {f.dispose();}
  });
  it("gives the DS-inspired crow path alternating animated beaks that knock the ball off",async()=>{
    const f=await fixture(7);try {
      const crow=f.models.get("w6s17-cuervo-0")!,head=crow.getObjectByName("london-crow-head")!;
      for(let i=0;i<170;i++) f.step();head.updateWorldMatrix(true,false);
      const hit=head.localToWorld(new THREE.Vector3(0,0,-3.2));f.player.teleportTo(hit.x,hit.y,hit.z);f.step();
      expect(Math.hypot(f.player.linvel().x,f.player.linvel().z)).toBeGreaterThan(10);
    } finally {f.dispose();}
  });
});
