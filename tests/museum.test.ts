import {beforeAll,afterAll,describe,it,expect,vi} from "vitest";
import * as THREE from "three";
import {WORLD_06_LEVEL_02_STAGES as stages} from "../src/levels/world-06/level-02-stages";
import {MuseumLevel} from "../src/levels/world-06/MuseumLevel";
import {createMuseumModel,previewMuseumActor} from "../src/levels/world-06/MuseumModels";
import {createLondonModel} from "../src/levels/world-06/LondonModels";
import {MUSEUM_ANIMALS,MUSEUM_CHASE_LENGTH,MUSEUM_CHASE_FINISH_Z,paintingAnswer,pyramidMotion,pyramidBlockMotion,pyramidSurfaceMotion,PYRAMID_BLOCKS,PYRAMID_BLOCK_HEIGHT,basinHeight,gemGapAngle} from "../src/levels/world-06/MuseumRoutes";
import {PhysicsWorld} from "../src/physics/PhysicsWorld";
import {LevelBuilder,type ActiveCollectible} from "../src/levels/LevelBuilder";
import {Player} from "../src/player/Player";
import {CHARACTERS} from "../src/player/Characters";
import {SpriteTextures} from "../src/rendering/SpriteTextures";
import {getBakedStage} from "../src/levels/BakedStages";
import {applyRequestedStageUpdates} from "../src/levels/RequestedStageUpdates";
import {getWorldById} from "../src/levels/WorldDefinitions";
import {Camera} from "../src/rendering/Camera";
import {buildRiverFrames} from "../src/levels/world-05/SellaRiver";
vi.mock("@dimforge/rapier3d-compat",async()=>{const path="../node_modules/@dimforge/rapier3d-compat/rapier.es.js";return import(path);});
beforeAll(()=>{
  vi.spyOn(SpriteTextures,"getCharacterTexture").mockReturnValue(new THREE.Texture());
  vi.spyOn(SpriteTextures,"getSphereTexture").mockReturnValue(new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement));
});
afterAll(()=>vi.restoreAllMocks());
async function fixture(n:number) {
  const data=structuredClone(stages[n]),physics=new PhysicsWorld();await physics.waitForReady();
  const runtime=new MuseumLevel(data,physics),models=new Map<string,THREE.Group>(),player=new Player(CHARACTERS[1],physics,data.spawn);player.respawn();
  for(const obj of data.objects) {
    if(obj.type==="platform") physics.createBoxCollider(obj.position,{x:0,y:0,z:0,w:1},{x:obj.scale.x/2,y:obj.scale.y/2,z:obj.scale.z/2},.65,0);
    const model=createMuseumModel(obj)??createLondonModel(obj);if(!model) continue;models.set(obj.id,model.group);
    const owns=runtime.attach(obj,model.group,model.meshes);
    if(!owns&&obj.properties?.hasCollision===true) for(const m of model.meshes) {
      m.updateWorldMatrix(true,false);const g=m.geometry.clone().applyMatrix4(m.matrixWorld),vertices=g.getAttribute("position").array as Float32Array;
      physics.createTrimeshCollider(vertices,g.index ? new Uint32Array(g.index.array):Uint32Array.from({length:vertices.length/3},(_,i)=>i),.035,.72);g.dispose();
    }
  }
  const obj=data.objects.find(o=>o.type==="goal")!,goal={mesh:new THREE.Group(),position:new THREE.Vector3().copy(obj.position),reached:false};goal.mesh.position.copy(obj.position);runtime.attachGoal(obj,goal);
  const step=(horizontal=0,vertical=0)=>{physics.step(1/60);const motion=runtime.update(1/60,player);return motion??player.update(1/60,{horizontal,vertical},runtime.movementCamera);};
  const dispose=()=>{runtime.destroy();player.destroy();physics.clearStageColliders();physics.getWorld()?.free();};
  return {data,physics,runtime,models,player,goal,step,dispose};
}
describe("Museum definitions and shared models",()=>{
  it("registers Museum and all ten stages, migrating both old drafts and saved editor levels without losing custom objects",()=>{
    expect(getWorldById(6).levels![1].name).toBe("Museum");
    for(let n=1;n<=10;n++) {
      const data=stages[n];expect(getBakedStage(6,2,n)).toBe(data);expect(data.objects.filter(o=>o.type==="goal")).toHaveLength(1);
      expect(new Set(data.objects.map(o=>o.id)).size).toBe(data.objects.length);expect(data.objects.some(o=>o.type==="collectible")).toBe(true);
      const saved=structuredClone(data);delete saved.properties!.museumRevision;const custom={...structuredClone(saved.objects[0]),id:"obj-custom-sculpture"};saved.objects=[custom];
      const upgraded=applyRequestedStageUpdates(saved,6,2,n);expect(upgraded.name).toBe(data.name);expect(upgraded.objects.find(o=>o.id===custom.id)).toEqual(custom);
    }
  });
  it("builds finite models including all ten articulated prehistoric species and Santa's T-Rex",()=>{
    for(const data of Object.values(stages)) for(const obj of data.objects) {
      const model=createMuseumModel(obj);if(!model) continue;
      model.group.traverse(o=>{if(o instanceof THREE.Mesh) {o.geometry.computeBoundingSphere();expect(Number.isFinite(o.geometry.boundingSphere!.radius)).toBe(true);}});
    }
    const animals=stages[10].objects.filter(o=>o.properties?.museumAction==="animal");expect(new Set(animals.map(o=>o.properties?.species))).toEqual(new Set(MUSEUM_ANIMALS));
    for(const obj of animals.slice(0,10)) {const model=createMuseumModel(obj)!;const leg=model.group.getObjectByName("museum-animal-leg")!;previewMuseumActor(obj,model.group,.2);const a=leg.rotation.x;previewMuseumActor(obj,model.group,.4);expect(leg.rotation.x).not.toBe(a);}
    expect(stages[10].objects.find(o=>o.properties?.species==="trex")!.properties!.santa).toBe(true);
  });
  it("keeps Hollow Diamond's central hole open and provides one stable floor around it",()=>{
    const obj=stages[1].objects.find(o=>o.properties?.subType==="museum_diamond")!,model=createMuseumModel(obj)!;model.group.updateWorldMatrix(true,true);
    const ray=new THREE.Raycaster(new THREE.Vector3(0,15,0),new THREE.Vector3(0,-1,0),0,4);expect(ray.intersectObjects(model.meshes,false)).toHaveLength(0);
    for(const [x,z] of [[13.13,.37],[-13.17,.29],[.23,16.41],[-.33,-16.27]]) {ray.set(new THREE.Vector3(x,13,z),new THREE.Vector3(0,-1,0));const hits=ray.intersectObjects(model.meshes,false).filter(h=>Math.abs(h.point.y-12)<.01);expect(hits).toHaveLength(1);}
  });
  it("preserves all four Roman routes and matches the deep dish's visible surface to its analytic profile",()=>{
    for(const obj of stages[6].objects.filter(o=>o.properties?.subType==="london_path")) {
      const model=createLondonModel(obj)!;model.group.updateWorldMatrix(true,true);const points=obj.properties!.points as THREE.Vector3[];
      for(let i=4;i<points.length-4;i+=12) {const p=points[i],ray=new THREE.Raycaster(new THREE.Vector3(p.x,p.y+1,p.z),new THREE.Vector3(0,-1,0),0,1.1);const hits=ray.intersectObjects(model.meshes,false);expect(hits.length).toBeGreaterThan(0);expect(hits[0].point.y).toBeCloseTo(p.y,3);}
    }
    const obj=stages[7].objects.find(o=>o.properties?.subType==="museum_basin")!,model=createMuseumModel(obj)!;model.group.updateWorldMatrix(true,true);
    for(const r of [0,3,6,9,12,15,17]) {
      const ray=new THREE.Raycaster(new THREE.Vector3(r,22,-20),new THREE.Vector3(0,-1,0),0,20),hit=ray.intersectObjects(model.meshes,false)[0];expect(hit.point.y).toBeCloseTo(basinHeight(r,0),1);
    }
  });
  it("keeps Gyration's two circular curves continuous without duplicate coplanar walkable faces",()=>{
    const obj=stages[4].objects.find(o=>o.id==="w6s24-gyration")!,model=createLondonModel(obj)!;
    const points=obj.properties!.points as THREE.Vector3[],frames=buildRiverFrames(points);model.group.updateWorldMatrix(true,true);
    for(let i=0;i<points.length-1;i+=3) {
      const p=new THREE.Vector3().copy(points[i]).lerp(points[i+1],.5);p.x+=(frames[i].x+frames[i+1].x)*.15;p.z+=(frames[i].z+frames[i+1].z)*.15;
      const ray=new THREE.Raycaster(p.clone().add(new THREE.Vector3(0,1,0)),new THREE.Vector3(0,-1,0),0,1.05),hits=ray.intersectObjects(model.meshes,false);
      expect(hits,`Greek curve section ${i}`).toHaveLength(1);expect(hits[0].face!.normal.y).toBeGreaterThan(.99);
    }
  });
  it("leaves a genuinely passable gap in every rotating bumper ring",()=>{
    for(const obj of stages[9].objects.filter(o=>o.properties?.museumAction==="gem")) {
      const index=Number(obj.properties!.gemIndex),model=createMuseumModel(obj)!,angle=gemGapAngle(index);model.group.updateWorldMatrix(true,true);
      const rayAt=(a:number)=>new THREE.Raycaster(new THREE.Vector3(obj.position.x+Math.cos(a)*9,obj.position.y+.6,obj.position.z+Math.sin(a)*9),new THREE.Vector3(-Math.cos(a),0,-Math.sin(a)),0,4);
      expect(rayAt(angle).intersectObjects(model.meshes,false)).toHaveLength(0);expect(rayAt(angle+Math.PI/2).intersectObjects(model.meshes,false).length).toBeGreaterThan(0);
    }
  });
  it("occludes the hidden floors behind all three paintings with an opaque roof and deep side partitions",()=>{
    const obj=stages[8].objects.find(o=>o.properties?.museumAction==="painting")!,model=createMuseumModel(obj)!;model.group.updateWorldMatrix(true,true);
    for(const x of [-5,0,5]) {const ray=new THREE.Raycaster(new THREE.Vector3(x,30,-3),new THREE.Vector3(0,-1,0),0,25),hit=ray.intersectObjects(model.meshes,false)[0];expect(hit.point.y).toBeGreaterThan(18);}
    const from=new THREE.Vector3(0,17.8,3),towards=new THREE.Vector3(0,12,-3).sub(from).normalize(),peek=new THREE.Raycaster(from,towards,0,12);
    expect(peek.intersectObjects(model.meshes,false)[0].point.z).toBeGreaterThan(0);
    expect(model.group.userData.museumCameraMeshes).toHaveLength(3);
    const all=[...model.meshes,...model.group.userData.museumCameraMeshes];
    for(let x=-9;x<=9;x+=.31) for(const y of [-.2,.025,.1,.7,1.4,2.65,2.8,4,6.3]) {
      const ray=new THREE.Raycaster(new THREE.Vector3(x,12+y,3),new THREE.Vector3(0,0,-1),0,4);
      expect(ray.intersectObjects(all,false).length,`uncovered facade x=${x}, y=${y}`).toBeGreaterThan(0);
    }
  });
  it("gives the hero T-Rex a solid sculpted skull, two curved tooth rows, claws and an animated lower jaw",()=>{
    const obj=stages[10].objects.find(o=>o.properties?.species==="trex")!,model=createMuseumModel(obj)!;
    const head=model.group.getObjectByName("museum-animal-head")!,jaw=model.group.getObjectByName("museum-trex-jaw")!;
    expect(head.children.some(o=>o.name==="london-ivory")).toBe(true);expect(jaw.children.some(o=>o.name==="london-ivory")).toBe(true);
    for(const o of [head,jaw]) o.traverse(child=>{if(child instanceof THREE.Mesh) for(const m of Array.isArray(child.material) ? child.material:[child.material]) expect(m.transparent).toBe(false);});
    previewMuseumActor(obj,model.group,.2);const before=jaw.rotation.x;previewMuseumActor(obj,model.group,.7);expect(jaw.rotation.x).not.toBe(before);
    expect(model.group.children.filter(o=>o.name==="museum-trex-arm")).toHaveLength(2);
  });
  it("builds and destroys all ten full scenes including their colliders, moving goals and camera blockers",async()=>{
    const gradient={addColorStop:()=>{}},context=new Proxy({}, {get:(_target,key)=>key==="createLinearGradient"||key==="createRadialGradient" ? ()=>gradient:key==="measureText" ? ()=>({width:100}):()=>{}});
    vi.stubGlobal("document",{createElement:()=>({width:128,height:128,getContext:()=>context})});
    const physics=new PhysicsWorld();await physics.waitForReady();
    try {for(const data of Object.values(stages)) {const scene=new LevelBuilder().build(structuredClone(data),physics,"dragon_ball");expect(scene.museum).toBeDefined();expect(scene.goal).not.toBeNull();expect(scene.collidableMeshes.length).toBeGreaterThan(0);scene.update(1/60,true);scene.reset?.();scene.destroy();}} finally {physics.getWorld()?.free();vi.unstubAllGlobals();}
  });
});
describe("Museum physics and challenges",()=>{
  it("can complete all five improved jump-pad transfers with Adri",async()=>{
    const f=await fixture(2);try {
      let won=false;for(let i=0;i<2400;i++) {
        const motion=f.step(0,1);expect(motion.fellOut,`jump position ${JSON.stringify(f.player.getPosition())}`).toBe(false);
        if(f.player.getPosition().z<f.goal.position.z+.5&&Math.abs(f.player.getPosition().y-(f.goal.position.y+.75))<2) {won=true;break;}
      }
      expect(won).toBe(true);
    } finally {f.dispose();}
  });
  it("moves all 253 pyramid blocks independently using one instanced draw and synchronised box colliders",async()=>{
    const f=await fixture(3);try {
      for(let i=0;i<240;i++) f.step();
      const root=f.models.get("w6s23-piramide")!,mesh=root.userData.pyramidInstances as THREE.InstancedMesh;expect(mesh.count).toBe(253);expect(root.children).toHaveLength(1);
      const matrix=new THREE.Matrix4(),positions:THREE.Vector3[]=[];
      PYRAMID_BLOCKS.forEach((block,i)=>{mesh.getMatrixAt(i,matrix);const p=new THREE.Vector3().setFromMatrixPosition(matrix);expect(p.y).toBeCloseTo(block.y-PYRAMID_BLOCK_HEIGHT/2+pyramidBlockMotion(f.runtime.elapsed,block.tier,block.index),4);positions.push(p);});
      expect(new Set(positions.slice(0,16).map(p=>p.y.toFixed(3))).size).toBeGreaterThan(12);
      expect(f.goal.position.y).toBeCloseTo(20.5+pyramidMotion(f.runtime.elapsed,7),5);
      f.physics.step(1/60);const bodies:THREE.Vector3[]=[];f.physics.getWorld()!.forEachRigidBody(b=>{if(b.isKinematic()) bodies.push(new THREE.Vector3().copy(b.translation()));});
      expect(bodies).toHaveLength(254);for(const p of positions) expect(bodies.some(b=>b.distanceTo(new THREE.Vector3(p.x,p.y+12,p.z))<.01)).toBe(true);
      const source=f.data.objects.find(o=>o.properties?.museumTier===4)!,item:ActiveCollectible={id:source.id,position:new THREE.Vector3(),mesh:new THREE.Group(),collected:false,baseX:source.position.x,baseY:source.position.y,baseZ:source.position.z};
      f.runtime.updateCollectibles([item],0);expect(item.position.y).toBeCloseTo(item.baseY+pyramidSurfaceMotion(f.runtime.elapsed,4,item.baseX,item.baseZ));f.runtime.reset();expect(f.goal.position.y).toBe(20.5);
    } finally {f.dispose();}
  });
  it("can ascend the eight timed pyramid levels without requiring a jump button",async()=>{
    const f=await fixture(3);try {
      let won=false;for(let i=0;i<10800;i++) {
        const p=f.player.getPosition(),motion=f.step(0,p.z>1 ? .42:p.z<-.5 ? -.25:0);
        if(motion.fellOut) break;
        if(Math.abs(p.z)<1&&Math.abs(p.y-f.goal.position.y)<2.5) {won=true;break;}
      }
      expect(won,`last pyramid position ${JSON.stringify(f.player.getPosition())}`).toBe(true);
    } finally {f.dispose();}
  },15000);
  it("makes a painting touch irreversible and permits all eight correct crossings",async()=>{
    const f=await fixture(8);try {
      for(let row=0;row<8;row++) {
        f.player.teleportTo((paintingAnswer(row)-1)*5,12.8,-row*20+.7);f.step();expect(f.runtime.crossingPainting).toBe(true);
        for(let i=0;i<47;i++) expect(f.step(0,-1).fellOut).toBe(false);
        expect(f.runtime.solvedPaintings).toBe(row+1);expect(f.player.getPosition().z).toBeLessThan(-row*20-5);
      }
      expect(f.runtime.controlsGoal).toBe(false);f.runtime.reset();expect(f.runtime.controlsGoal).toBe(true);expect(f.runtime.solvedPaintings).toBe(0);
    } finally {f.dispose();}
  });
  it("drops the player after a wrong picture even if they try to reverse during the forced crossing",async()=>{
    const f=await fixture(8);try {
      const wrong=(paintingAnswer(0)+1)%3;f.player.teleportTo((wrong-1)*5,12.8,.7);f.step();let fell=false;
      for(let i=0;i<75;i++) fell ||= f.step(0,-1).fellOut;
      expect(fell).toBe(true);expect(f.runtime.failure).toBe("painting");expect(f.runtime.solvedPaintings).toBe(0);expect(f.player.getPosition().y).toBeLessThan(2);
    } finally {f.dispose();}
  });
  it("commits to a picture even when a fast ball crosses the trigger between rendered frames",async()=>{
    const f=await fixture(8);try {
      f.player.teleportTo(0,12.8,2);f.step();f.player.setLinearVelocity({x:0,y:0,z:-70});f.physics.step(.05);
      f.runtime.update(.05,f.player);expect(f.runtime.crossingPainting).toBe(true);
      for(let i=0;i<50;i++) f.step(0,-1);expect(f.runtime.solvedPaintings).toBe(1);
    } finally {f.dispose();}
  });
  it("unlocks and physically removes the glass only after all four coloured gems, then resets it",async()=>{
    const f=await fixture(9);try {
      const glass=f.models.get("w6s29-cristal-meta")!;expect(f.runtime.controlsGoal).toBe(true);
      const gems=f.data.objects.filter(o=>o.properties?.museumAction==="gem");
      for(const [i,obj] of gems.entries()) {f.player.teleportTo(obj.position.x,obj.position.y+.9,obj.position.z);f.step();expect(f.runtime.gemCount).toBe(i+1);expect(glass.visible).toBe(i<3);}
      expect(f.runtime.controlsGoal).toBe(false);
      let enabledGlass=false;f.physics.getWorld()!.forEachCollider(c=>{const p=c.parent()?.translation();if(p&&Math.abs(p.y-12.05)<.01&&Math.abs(p.z-26)<.01) enabledGlass ||= c.isEnabled();});expect(enabledGlass).toBe(false);
      f.runtime.reset();expect(glass.visible).toBe(true);expect(f.runtime.gemCount).toBe(0);
    } finally {f.dispose();}
  });
  it("has no fall death in the chase; animals push and the T-Rex is the only lethal pursuer",async()=>{
    const f=await fixture(10);try {
      f.player.teleportTo(100,-50,12);expect(f.step().fellOut).toBe(false);expect(f.player.getPosition().y).toBeGreaterThan(.7);expect(Math.abs(f.player.getPosition().x)).toBeLessThan(13.1);
      const animal=f.models.get("w6s210-animal-0")!;f.player.teleportTo(animal.position.x,.9,animal.position.z);expect(f.step().fellOut).toBe(false);expect(Math.abs(f.player.linvel().x)).toBeGreaterThan(5);
      f.runtime.reset();f.player.respawn();let caught=false;for(let i=0;i<1500;i++) if(f.step().fellOut) {caught=true;break;}
      expect(caught).toBe(true);expect(f.runtime.failure).toBe("rex");
    } finally {f.dispose();}
  });
  it("can evade the moving prehistoric animals and finish the full chase",async()=>{
    const f=await fixture(10);try {
      let won=false;
      for(let i=0;i<5400;i++) {
        const p=f.player.getPosition(),near=[...f.models.entries()].filter(([id,g])=>id.includes("animal-")&&g.position.z<p.z&&p.z-g.position.z<55).sort((a,b)=>b[1].position.z-a[1].position.z)[0];
        const target=near ? (near[1].position.x>=0 ? -7:7):0,v=f.player.linvel();
        expect(f.step(THREE.MathUtils.clamp((target-p.x)*.17-v.x*.04,-.7,.7),1).fellOut,`chase ${i/60}s`).toBe(false);
        if(f.runtime.finishRequested) {won=true;break;}
      }
      expect(won).toBe(true);
    } finally {f.dispose();}
  },15000);
  it("keeps the unobstructed run close to a minute and frames both the ball and chasing T-Rex",async()=>{
    const f=await fixture(10);try {
      // Remove only optional animal contacts for a repeatable timing calibration.
      const animals=f.data.objects.filter(o=>o.properties?.museumAction==="animal");animals.forEach(o=>{o.position.x=1000;o.properties!.amplitude=0;});
      let frames=0;while(frames<4500&&!f.runtime.finishRequested) {expect(f.step(0,1).fellOut).toBe(false);frames++;}
      expect(f.runtime.finishRequested).toBe(true);
      expect(frames/60).toBeGreaterThan(56);expect(frames/60).toBeLessThan(65);
      const camera=new Camera();camera.object.aspect=16/9;camera.object.updateProjectionMatrix();camera.setMuseumChase(true);
      const p=f.player.getPosition();camera.follow(p,new THREE.Vector3(0,0,-30),1/60);camera.object.updateMatrixWorld(true);
      const ball=p.clone().project(camera.object),rex=p.clone().add(new THREE.Vector3(0,7,28)).project(camera.object);
      for(const point of [ball,rex]) {expect(Math.abs(point.x)).toBeLessThan(.9);expect(Math.abs(point.y)).toBeLessThan(.9);}
      camera.setMuseumChase(false);for(let i=0;i<60;i++) camera.follow(p,new THREE.Vector3(0,0,-1),1/60);expect(camera.object.position.z).toBeGreaterThan(p.z);
    } finally {f.dispose();}
  },15000);
  it("finishes before the end wall across the whole hall, without a portal, and resets safely",async()=>{
    const f=await fixture(10);try {
      expect(f.goal.mesh.visible).toBe(false);expect(f.runtime.controlsGoal).toBe(true);
      for(const x of [-12,0,12]) {
        f.runtime.reset();
        f.player.teleportTo(x,.9,12-MUSEUM_CHASE_LENGTH);f.step();
        expect(f.runtime.finishRequested).toBe(false);
        f.player.teleportTo(x,.9,MUSEUM_CHASE_FINISH_Z+.5);f.step();
        expect(f.runtime.finishRequested).toBe(false);
        f.player.teleportTo(x,.9,MUSEUM_CHASE_FINISH_Z-.1);const motion=f.step();
        expect(f.runtime.finishRequested).toBe(true);expect(motion.fellOut).toBe(false);expect(f.runtime.failed).toBe(false);
      }
      f.runtime.reset();f.player.respawn();f.step();
      expect(f.runtime.finishRequested).toBe(false);expect(f.goal.mesh.visible).toBe(false);expect(f.goal.position.z).toBe(MUSEUM_CHASE_FINISH_Z);
    } finally {f.dispose();}
  });
});
