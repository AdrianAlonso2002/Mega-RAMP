import { afterAll,beforeAll,describe,expect,it,vi } from "vitest";
import * as THREE from "three";
import type RAPIER from "@dimforge/rapier3d-compat";
import { PhysicsWorld } from "../src/physics/PhysicsWorld";
import { Player } from "../src/player/Player";
import { CHARACTERS } from "../src/player/Characters";
import { SpriteTextures } from "../src/rendering/SpriteTextures";
import { WORLD_05_LEVEL_03_STAGES as stages } from "../src/levels/world-05/level-03-stages";
import { createSellaModel,animateCanoePaddles } from "../src/levels/world-05/SellaModels";
import { SellaLevel } from "../src/levels/world-05/SellaLevel";
import { canoePaddles,sampleSellaRiver } from "../src/levels/world-05/SellaRiver";
import { getBakedStage } from "../src/levels/BakedStages";
import { applyRequestedStageUpdates } from "../src/levels/RequestedStageUpdates";
import type { ActiveGoal } from "../src/levels/LevelBuilder";
import { LevelBuilder } from "../src/levels/LevelBuilder";
import type { SellaWater } from "../src/levels/world-05/SellaWater";
import { InputManager } from "../src/input/InputManager";
import { WaterWaveSimulator } from "../src/rendering/WaterSimulator";

vi.mock("@dimforge/rapier3d-compat",async()=>{
  const entry="../node_modules/@dimforge/rapier3d-compat/rapier.es.js";return import(entry);
});
beforeAll(()=>{
  vi.spyOn(SpriteTextures,"getCharacterTexture").mockReturnValue(new THREE.Texture());
  vi.spyOn(SpriteTextures,"getSphereTexture").mockReturnValue(new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement));
});
afterAll(()=>vi.restoreAllMocks());

async function setup(stage=1,collisions=true,gulls=true,current?:number,pace?:number) {
  const data=structuredClone(stages[stage]),physics=new PhysicsWorld();await physics.waitForReady();
  if(current!==undefined) data.objects.find(o=>o.properties?.subType==="asturias_sella_river")!.properties!.current=current;
  if(pace!==undefined) data.properties={...data.properties,canoePace:pace};
  const level=new SellaLevel(data,physics),player=new Player(CHARACTERS[0],physics,data.spawn);player.respawn();
  const models:THREE.Group[]=[];
  for(const obj of data.objects) {
    if(!gulls && obj.properties?.sellaAction==="gull") continue;
    const model=createSellaModel(obj);if(!model) continue;
    model.group.name=obj.id;
    models.push(model.group);level.attach(obj,model.group);model.group.updateMatrixWorld(true);
    if(collisions && (obj.properties?.subType==="asturias_sella_river" ? obj.properties.bankCollision!==false:obj.properties?.hasCollision!==false) && obj.properties?.sellaAction!=="canoe") {
      for(const mesh of model.meshes) {
        const geo=mesh.geometry.clone().applyMatrix4(mesh.matrixWorld),points=geo.getAttribute("position");
        const index=geo.index ? new Uint32Array(geo.index.array) : Uint32Array.from({length:points.count},(_,i)=>i);
        level.addHazard(physics.createTrimeshCollider(points.array as Float32Array,index,.035,.72));geo.dispose();
      }
    }
  }
  const goalObj=data.objects.find(o=>o.type==="goal")!,mesh=new THREE.Group();mesh.position.copy(goalObj.position);mesh.rotation.y=goalObj.rotation.y;
  const goal:ActiveGoal={mesh,position:mesh.position.clone(),quaternion:mesh.quaternion.clone(),reached:false};level.attachGoal(goalObj,goal);
  const camera=new THREE.PerspectiveCamera();camera.lookAt(0,0,-1);
  let pilotLane:number|undefined;
  const step=(horizontal:number|undefined=undefined,vertical=1,dt=1/60,bothPaddles=false)=>{
    physics.step(dt);
    // Test pilot keeps its chosen lane, correcting drift and anticipating angular momentum.
    let h=horizontal??0;
    if(horizontal===undefined) {
      const craft=boat(),position=craft.translation();pilotLane??=position.x;
      const target=THREE.MathUtils.clamp((position.x-pilotLane)*.08,-.3,.3);
      h=level.heading+craft.angvel().y*.2>target ? -1:1;
    }
    const motion=level.update(dt,{horizontal:h,vertical,bothPaddles},player);
    if(!motion) return player.update(dt,{horizontal:h,vertical},camera);
    return motion;
  };
  const boat=()=>{
    let found:RAPIER.RigidBody|undefined;physics.getWorld()!.forEachRigidBody(b=>{if(b.isDynamic() && b.handle!==player.getBody()?.handle) found=b;});return found!;
  };
  const dispose=()=>{level.destroy();player.destroy();physics.getWorld()?.free();};
  return {data,level,player,physics,models,goal,step,boat,dispose};
}

describe("Sella: ten stages and shared models",()=>{
  it("builds all ten complete game scenes with their vehicle, collisions and collectibles",async()=>{
    const gradient={addColorStop:()=>{}};
    const context=new Proxy({}, {get:(_target,key)=>key==="createLinearGradient" || key==="createRadialGradient" ? ()=>gradient : key==="measureText" ? ()=>({width:100}) : ()=>{}});
    vi.stubGlobal("document",{createElement:()=>({width:128,height:128,getContext:()=>context})});
    const texture=new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement);
    const blocks=vi.spyOn(SpriteTextures,"getWorldBlockSet").mockReturnValue({top:texture,sideX:texture,sideZ:texture,bottom:texture,emissiveColor:new THREE.Color(),movingEmissiveColor:new THREE.Color()});
    const collectible=vi.spyOn(SpriteTextures,"getCollectibleTexture").mockReturnValue(texture);
    const physics=new PhysicsWorld();await physics.waitForReady();
    try {
      for(const data of Object.values(stages)) {
        const scene=new LevelBuilder().build(structuredClone(data),physics,"pan");
        expect(scene.canoe).toBeDefined();expect(scene.goal).not.toBeNull();
        expect(scene.collectibles.length).toBe(data.objects.filter(o=>o.type==="collectible").length);
        expect(scene.collidableMeshes.length).toBeGreaterThan(1);
        expect(scene.waterBlocks).toHaveLength(1);
        expect(scene.waterBlocks[0].river).toBeDefined();expect(scene.waterBlocks[0].passable).toBe(true);
        if(data.stage===3) {
          const leaves=scene.group.getObjectByName("sella-leaves") as THREE.InstancedMesh;
          const matrix=new THREE.Matrix4();leaves.getMatrixAt(leaves.count-1,matrix);matrix.premultiply(leaves.matrixWorld);
          const position=new THREE.Vector3(0,5.35,0).applyMatrix4(matrix),ball=physics.createBallBody(.75,position)!;
          physics.step(1/60);
          const tree=physics.getGroundContact(ball.body,3.5);
          expect(tree,"the actual last tree crown must have collision, not just the bank").not.toBeNull();
          expect(tree!.distance).toBeLessThan(3.3);
          physics.removeRigidBody(ball.body);
          expect(scene.collidableMeshes).toContain(leaves);
        }
        scene.update(1/60,true);scene.reset?.();scene.destroy();
      }
    } finally {physics.getWorld()?.free();blocks.mockRestore();collectible.mockRestore();vi.unstubAllGlobals();}
  });
  it("registers all stages, keeps Correr5 on foot, and upgrades old saved drafts",()=>{
    for(let stage=1;stage<=10;stage++) {
      const data=stages[stage];expect(getBakedStage(5,3,stage)?.name).toBe(data.name);
      expect(new Set(data.objects.map(o=>o.id)).size).toBe(data.objects.length);
      expect(data.objects.filter(o=>o.type==="goal")).toHaveLength(1);
      expect(data.objects.filter(o=>o.type==="collectible").length).toBe([6,4,8,10,24,10,6,8,8,16][stage-1]);
      expect(data.properties!.sellaMode).toBe(stage===3 ? "foot":"canoe");
      const extra={...data.objects[0],id:"obj-custom-extra"};
      const updated=applyRequestedStageUpdates({...structuredClone(data),customSaved:true,objects:[extra],properties:{userSaved:true}},5,3,stage);
      expect(updated.objects.find(o=>o.id===extra.id)).toEqual(extra);
      expect(updated.properties!.sellaRevision).toBe("sella-canoe-v1");
      const again=applyRequestedStageUpdates(updated,5,3,stage);expect(again).toBe(updated);
    }
  });

  it("creates complete canoe, bank, rock and waterfall meshes without invalid vertices",()=>{
    for(const stage of Object.values(stages)) for(const obj of stage.objects) {
      const model=createSellaModel(obj);if(!model) continue;
      if(obj.properties?.sellaAction==="canoe") expect(model.meshes.length).toBeGreaterThan(0);
      model.group.traverse(child=>{
        if(child instanceof THREE.Mesh) {
          child.geometry.computeBoundingSphere();expect(Number.isFinite(child.geometry.boundingSphere!.radius)).toBe(true);
        }
      });
    }
    const a=stages[7].objects.find(o=>o.properties?.subType==="asturias_sella_river")!.properties!.points as THREE.Vector3[];
    const b=stages[10].objects.find(o=>o.properties?.subType==="asturias_sella_river")!.properties!.points as THREE.Vector3[];
    const length=(p:THREE.Vector3[])=>p.slice(1).reduce((sum,v,i)=>sum+Math.hypot(v.x-p[i].x,v.y-p[i].y,v.z-p[i].z),0);
    expect(length(b)).toBeGreaterThan(length(a)*6);
    expect(length(b)).toBeLessThan(1700);
  });

  it("maps rowing and braking to the physically correct paddle side",()=>{
    expect(canoePaddles(0,1,true)).toEqual({left:1,right:1});
    expect(canoePaddles(0,-1,true)).toEqual({left:-1,right:-1});
    expect(canoePaddles(-1,1)).toEqual({left:1,right:0});
    expect(canoePaddles(1,1)).toEqual({left:0,right:1});
    expect(canoePaddles(-1,-1)).toEqual({left:-1,right:0});
    expect(canoePaddles(1,-1)).toEqual({left:0,right:-1});
    expect(canoePaddles(0,1)).toEqual({left:0,right:0});expect(canoePaddles(0,-1)).toEqual({left:0,right:0});
    expect(canoePaddles(-Math.SQRT1_2,Math.SQRT1_2)).toEqual(canoePaddles(-1,1));
  });

  it("preserves overlapping waves when moving the local river simulation window",()=>{
    const simulation=new WaterWaveSimulator(24,48,64);
    simulation.disturbWorld(0,8,-.18,1);
    const height=simulation.sampleHeight(0,8);
    simulation.shiftCenterZ(12);
    expect(simulation.sampleHeight(0,8)).toBeCloseTo(height,5);
    simulation.shiftCenterZ(200);
    expect(simulation.getHeightData().every(value=>value===0)).toBe(true);
  });

  it("deforms the actual water mesh and its normals with the live wave field",()=>{
    const river=stages[1].objects.find(o=>o.properties?.subType==="asturias_sella_river")!;
    const model=createSellaModel(river)!,water=model.group.userData.sellaWater as SellaWater;
    const surface=model.group.getObjectByName("sella-water") as THREE.Mesh;
    for(const name of ["riverCoord","riverSide","riverForward"]) expect(surface.geometry.getAttribute(name).count).toBe(surface.geometry.getAttribute("position").count);
    const before=surface.geometry.getAttribute("position").array.slice(),normals=surface.geometry.getAttribute("normal").array.slice();
    water.update(.3);
    expect(surface.geometry.getAttribute("position").array.some((value,i)=>i%3===1 && Math.abs(value-before[i])>.025)).toBe(true);
    expect(surface.geometry.getAttribute("normal").array.some((value,i)=>Math.abs(value-normals[i])>.02)).toBe(true);
    expect(water.surfaceHeight({x:0,y:12,z:10})).toBeGreaterThan(11.5);water.dispose();
  });

  it("clips only local water inside the canoe, with no screen stencil holes or transparent lower river turns",()=>{
    const canoe=stages[1].objects.find(o=>o.properties?.sellaAction==="canoe")!,river=stages[1].objects.find(o=>o.type==="water")!;
    const boat=createSellaModel(canoe)!.group,water=createSellaModel(river)!.group.userData.sellaWater as SellaWater;
    expect(boat.scale.x).toBeCloseTo(.9);expect(boat.scale.z).toBeCloseTo(.9);
    expect(boat.getObjectByName("canoe-dry-interior")).toBeUndefined();
    expect(water.material.stencilWrite).toBe(false);
    expect(water.material.transparent).toBe(false);expect(water.material.depthWrite).toBe(true);
    boat.rotation.set(-.4,.8,.1);boat.updateWorldMatrix(true,false);water.setCanoeTransform(boat.matrixWorld);
    const shader={uniforms:{},vertexShader:THREE.ShaderLib.phong.vertexShader,fragmentShader:THREE.ShaderLib.phong.fragmentShader} as Parameters<THREE.Material["onBeforeCompile"]>[0];
    water.material.onBeforeCompile(shader,null as unknown as THREE.WebGLRenderer);
    expect(shader.vertexShader).toContain("sellaWaterWorld=(modelMatrix*vec4(transformed,1.0)).xyz;");
    expect(shader.fragmentShader).toContain("sellaCanoeInverse*vec4(sellaWaterWorld,1.0)");
    expect(shader.fragmentShader).toContain("hull.y>-.235 && hull.y<.42");
    expect(shader.uniforms.sellaCanoeVisible.value).toBe(1);
    const inverse=shader.uniforms.sellaCanoeInverse.value as THREE.Matrix4;
    const local=new THREE.Vector3(0,0,0).applyMatrix4(boat.matrixWorld).applyMatrix4(inverse);
    expect(local.length()).toBeLessThan(.00001);
    const distant=new THREE.Vector3(0,-100,0).applyMatrix4(boat.matrixWorld).applyMatrix4(inverse);
    expect(distant.y).toBeLessThan(-99);
    water.setCanoeTransform(null);expect(shader.uniforms.sellaCanoeVisible.value).toBe(0);
    for(const name of ["paddle-left","paddle-right"]) {
      const paddle=boat.getObjectByName(name)!;expect(Math.abs(paddle.position.x)).toBeGreaterThan(.9);expect(Math.abs(paddle.position.x)).toBeLessThan(1.05);
    }
  });

  it("closes both pointed hull ends and keeps the entire paddle sweep outside the hull",()=>{
    const object=stages[1].objects.find(o=>o.properties?.sellaAction==="canoe")!;
    const boat=createSellaModel(object)!.group;
    const hull=boat.children.find(child=>child instanceof THREE.Mesh) as THREE.Mesh;
    boat.updateMatrixWorld(true);
    for(const z of [-2.6,2.6]) {
      const ray=new THREE.Raycaster(new THREE.Vector3(0,2,z).applyMatrix4(boat.matrixWorld),new THREE.Vector3(0,-1,0).transformDirection(boat.matrixWorld));
      expect(ray.intersectObject(hull).length).toBeGreaterThan(0);
    }
    const endRay=new THREE.Raycaster(new THREE.Vector3(0,0,3.5).applyMatrix4(boat.matrixWorld),new THREE.Vector3(0,0,-1).transformDirection(boat.matrixWorld));
    expect(endRay.intersectObject(hull).length).toBeGreaterThan(0);
    for(const force of [-1,0,1]) for(let i=0;i<36;i++) {
      animateCanoePaddles(boat,i*.02,force,force);boat.updateMatrixWorld(true);
      for(const name of ["paddle-left","paddle-right"]) {
        boat.getObjectByName(name)!.traverse(child=>{
          if(!(child instanceof THREE.Mesh)) return;
          const positions=child.geometry.getAttribute("position");
          for(let j=0;j<positions.count;j++) {
            const p=boat.worldToLocal(new THREE.Vector3().fromBufferAttribute(positions,j).applyMatrix4(child.matrixWorld));
            if(p.y<.44 && p.y>-.25 && Math.abs(p.z)<2.65) expect(Math.abs(p.x)).toBeGreaterThan(.83);
          }
        });
      }
    }
  });

  it("removes all canoe control signs from both fresh stages and saved stages",()=>{
    for(const stage of [1,2,4,5,6,7,8,9,10]) {
      const source=stages[stage];expect(source.objects.some(o=>o.id.endsWith("cartel-salida"))).toBe(false);
      const saved=structuredClone(source);saved.properties={...saved.properties,sellaRevision:"sella-canoe-v1"};
      saved.objects.push({...structuredClone(source.objects[0]),id:`w5s3${stage}-cartel-salida`,type:"decoration",properties:{subType:"asturias_sign",caption:"W: REMAR"}});
      const upgraded=applyRequestedStageUpdates(saved,5,3,stage);
      expect(upgraded.objects.some(o=>o.id.endsWith("cartel-salida"))).toBe(false);
    }
  });

  it("converts already-saved decorative rivers into native physical water without resetting custom objects",()=>{
    for(const data of Object.values(stages)) {
      const saved=structuredClone(data);saved.customSaved=true;saved.properties={...saved.properties,sellaRevision:"sella-canoe-v1"};
      const old=saved.objects.find(o=>o.properties?.subType==="asturias_sella_river")!;old.type="decoration";
      old.properties!.hasCollision=true;delete old.properties!.bankCollision;
      const extra={...structuredClone(saved.objects[0]),id:"obj-custom-water-test"};saved.objects.push(extra);
      const updated=applyRequestedStageUpdates(saved,5,3,data.stage),water=updated.objects.find(o=>o.id===old.id)!;
      expect(water.type).toBe("water");expect(water.properties!.passable).toBe(true);expect(water.properties!.hasCollision).toBe(false);
      expect(water.properties!.bankCollision).toBe(true);expect(updated.objects.find(o=>o.id===extra.id)).toEqual(extra);
    }
  });

  it("uses the same paddle with WASD, arrow keys and a diagonal touch axis",()=>{
    const target=new EventTarget();vi.stubGlobal("window",target);
    try {
      for(const codes of [["KeyW","KeyA"],["ArrowUp","ArrowLeft"]]) {
        const input=new InputManager();
        for(const code of codes) target.dispatchEvent(Object.assign(new Event("keydown"),{code}));
        input.update();const axis=input.getAxis();
        expect(canoePaddles(axis.horizontal,axis.vertical)).toEqual({left:1,right:0});input.destroy();
      }
    } finally {vi.unstubAllGlobals();}
  });

  it("retains simultaneous left/right keys for both rowing and braking",()=>{
    const target=new EventTarget();vi.stubGlobal("window",target);
    try {
      for(const codes of [["KeyA","KeyD"],["ArrowLeft","ArrowRight"]]) {
        const input=new InputManager();
        try {
          for(const code of codes) target.dispatchEvent(Object.assign(new Event("keydown"),{code}));
          for(const [code,power] of [["KeyW",1],["KeyS",-1]] as const) {
            target.dispatchEvent(Object.assign(new Event("keydown"),{code}));input.update();
            const axis=input.getAxis();
            expect(canoePaddles(axis.horizontal,axis.vertical,axis.bothPaddles)).toEqual({left:power,right:power});
            target.dispatchEvent(Object.assign(new Event("keyup"),{code}));
          }
          target.dispatchEvent(Object.assign(new Event("keyup"),{code:codes[1]}));input.update();
          expect(input.getAxis().bothPaddles).toBe(false);
        } finally {input.destroy();}
      }
    } finally {vi.unstubAllGlobals();}
  });

  it("restores original dense rocks in saved descents while preserving the river and custom scenery",()=>{
    for(const stage of [4,6,7,8,9,10]) {
      const source=stages[stage],river=source.objects.find(o=>o.type==="water")!;
      const rocks=source.objects.filter(o=>o.properties?.sellaAction==="rock");
      expect(rocks.length).toBeGreaterThan(0);
      if(stage===4) expect(rocks).toHaveLength(21);
      if(stage===8) expect(rocks).toHaveLength(62);
      const points=river.properties!.points as THREE.Vector3[],width=Number(river.properties!.width);
      const dx=points[5].x-points[4].x,dz=points[5].z-points[4].z,side=Math.sin(4*2.399)*width*.29;
      if(stage!==10) {
        expect(rocks[0].position.x).toBeCloseTo(points[4].x-dz/Math.hypot(dx,dz)*side);
        expect(rocks[0].position.z).toBeCloseTo(points[4].z+dx/Math.hypot(dx,dz)*side);
      }
      const saved=structuredClone(source);saved.properties={...saved.properties,sellaRevision:"sella-canoe-v1",sellaRocksRevision:"readable-rocks-v2"};
      saved.objects=saved.objects.filter((o,i)=>!o.id.startsWith(`w5s3${stage}-roca-`) || i%2===0);
      const custom={...structuredClone(rocks[0]),id:"obj-custom-rock"};saved.objects.push(custom);
      for(const rock of saved.objects) if(rock.id.startsWith(`w5s3${stage}-roca-`)) rock.position.x=999;
      const updated=applyRequestedStageUpdates(saved,5,3,stage);
      expect(updated.objects.find(o=>o.id===custom.id)).toEqual(custom);
      expect(updated.objects.filter(o=>o.id.startsWith(`w5s3${stage}-roca-`))).toEqual(rocks);
      expect(updated.objects.find(o=>o.id===river.id)).toEqual(river);
      expect(updated.properties!.sellaRocksRevision).toBe(source.properties!.sellaRocksRevision);
    }
  });

  it("upgrades saved E2 into a half-length course with a long rocky bank and a short canoe finish",()=>{
    const old=structuredClone(stages[2]);old.properties={sellaRevision:"sella-canoe-v1",userSaved:true};
    const extra={...structuredClone(old.objects[0]),id:"obj-custom-sign"};old.objects.push(extra);old.spawn.z=99;
    const upgraded=applyRequestedStageUpdates(old,5,3,2);
    const river=upgraded.objects.find(o=>o.properties?.subType==="asturias_sella_river")!,points=river.properties!.points as THREE.Vector3[];
    expect(points[0].z-points[points.length-1].z).toBe(87.5);
    const canoe=upgraded.objects.find(o=>o.properties?.sellaAction==="canoe")!,goal=upgraded.objects.find(o=>o.type==="goal")!;
    expect(Math.abs(canoe.position.z-goal.position.z)).toBeLessThan(25);
    expect(Math.abs(upgraded.spawn.z-canoe.position.z)).toBeGreaterThan(50);
    expect(upgraded.objects.filter(o=>o.id.includes("roca-terreno")).length).toBeGreaterThanOrEqual(5);
    expect(upgraded.objects.find(o=>o.id===extra.id)).toEqual(extra);
    expect(applyRequestedStageUpdates(upgraded,5,3,2)).toBe(upgraded);
  });

  it("upgrades saved MegaBajada to fewer mixed rocks and a faster current without replacing its river layout",()=>{
    const source=stages[10],old=structuredClone(source),river=old.objects.find(o=>o.type==="water")!;
    old.properties={...old.properties,sellaRevision:"sella-canoe-v1",sellaRocksRevision:"original-rocks-v3",sellaMegaRevision:"old",canoePace:1};
    river.properties!.current=8;
    const route=structuredClone(river.properties!.points),rocks=source.objects.filter(o=>o.properties?.sellaAction==="rock");
    const points=route as THREE.Vector3[];
    expect(rocks.length).toBeLessThan((points.length-8)/6);
    expect(rocks.some(o=>o.scale.x>=3)).toBe(true);
    expect(rocks.some(o=>o.scale.x<1)).toBe(true);
    const updated=applyRequestedStageUpdates(old,5,3,10);
    expect(updated.properties!.canoePace).toBe(1.35);
    expect(updated.objects.find(o=>o.id===river.id)!.properties!.current).toBeCloseTo(60/3.6);
    expect(updated.objects.find(o=>o.id===river.id)!.properties!.points).toEqual(route);
    expect(updated.objects.filter(o=>o.properties?.sellaAction==="rock")).toEqual(rocks);
  });

  it("loads the one-minute MegaBajada in saved game/editor stages while retaining custom additions",()=>{
    const source=stages[10],saved=structuredClone(source);
    saved.properties={...saved.properties,sellaRevision:"sella-canoe-v1",sellaRouteRevision:"old-long-route",customNote:"keep"};
    const river=saved.objects.find(o=>o.type==="water")!;
    for(const p of river.properties!.points as THREE.Vector3[]) {p.x*=1.65;p.y=12+(p.y-12)*1.65;p.z=18+(p.z-18)*1.65;}
    saved.spawn.y*=1.65;
    const extra={...structuredClone(saved.objects[0]),id:"obj-custom-river-sign"};saved.objects.push(extra);
    const updated=applyRequestedStageUpdates(saved,5,3,10);
    expect(updated.objects.filter(o=>o.id.startsWith("w5s310-"))).toEqual(source.objects);
    expect(updated.objects.find(o=>o.id===extra.id)).toEqual(extra);
    expect(updated.spawn).toEqual(source.spawn);
    expect(updated.properties!.customNote).toBe("keep");
    expect(updated.properties!.sellaRouteRevision).toBe("mega-aligned-river-v7");
    expect(applyRequestedStageUpdates(updated,5,3,10).objects).toHaveLength(source.objects.length+1);
  });

  it("measures approximately one minute at 100 km/h while preserving both spiral revolutions",()=>{
    const data=stages[10],points=data.objects.find(o=>o.type==="water")!.properties!.points as THREE.Vector3[];
    const arc=[0];for(let i=1;i<points.length;i++) arc.push(arc[i-1]+Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y,points[i].z-points[i-1].z));
    const project=(p:THREE.Vector3)=>{
      let nearest=Infinity,distance=0;
      for(let i=0;i<points.length-1;i++) {
        const a=points[i],b=points[i+1],dx=b.x-a.x,dz=b.z-a.z;
        const t=THREE.MathUtils.clamp(((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz),0,1);
        const error=Math.hypot(p.x-a.x-dx*t,p.z-a.z-dz*t,p.y-a.y-(b.y-a.y)*t);
        if(error<nearest) {nearest=error;distance=arc[i]+(arc[i+1]-arc[i])*t;}
      }
      return distance;
    };
    const boat=data.objects.find(o=>o.properties?.sellaAction==="canoe")!,goal=data.objects.find(o=>o.type==="goal")!;
    const metres=project(new THREE.Vector3().copy(goal.position))-project(new THREE.Vector3().copy(boat.position));
    expect(metres/(100/3.6)).toBeCloseTo(60,0);
    let winding=0,last=Math.atan2(points[1].z-points[0].z,points[1].x-points[0].x);
    for(let i=1;i<points.length-1;i++) {
      const angle=Math.atan2(points[i+1].z-points[i].z,points[i+1].x-points[i].x);
      winding+=Math.atan2(Math.sin(angle-last),Math.cos(angle-last));last=angle;
      expect(points[i+1].y).toBeLessThanOrEqual(points[i].y+.0001);
    }
    expect(Math.abs(winding)).toBeGreaterThan(Math.PI*3.8);
    expect(Math.abs(winding)).toBeLessThan(Math.PI*4.2);
    expect(data.objects.filter(o=>o.properties?.sellaAction==="rock")).toHaveLength(22);
    expect(data.objects.filter(o=>o.properties?.sellaAction==="gull")).toHaveLength(10);
  });
});

describe("Sella canoe real physics",()=>{
  for(const fps of [30,60,120]) it(`supports the canoe across every MegaBajada river section at ${fps} fps without sinking`,async()=>{
    const scene=await setup(10,false,false);
    try {
      scene.step(0,0,1/fps);
      for(let i=1;i<scene.level.points.length-2;i++) {
        const a=scene.level.points[i],b=scene.level.points[i+1],dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz);
        scene.boat().setTranslation({x:a.x+dx*.1,y:a.y+(b.y-a.y)*.1+.2,z:a.z+dz*.1},true);
        scene.boat().setLinvel({x:dx/length*26,y:(b.y-a.y)/length*26-60,z:dz/length*26},true);
        const motion=scene.step(0,0,1/fps);
        const p=scene.boat().translation(),surface=sampleSellaRiver(scene.level.points,p)!;
        expect(motion.fellOut,`section ${i}`).toBe(false);
        expect(p.y-surface.y,`section ${i}`).toBeGreaterThan(-.15);
        const v=scene.boat().linvel();expect(Math.hypot(v.x,v.y,v.z)*3.6).toBeLessThanOrEqual(60.0001);
      }
    } finally {scene.dispose();}
  });

  it("drifts at 60 km/h, reaches 100 by rowing, and keeps carrying a braking canoe",async()=>{
    const speeds:number[]=[];
    let rowingPeak=0;
    for(const mode of [0,1,-1]) {
      const scene=await setup(10,false,false);
      try {
        for(let i=0;i<360;i++) {
          scene.step(0,mode,1/60,mode!==0);
          const v=scene.boat().linvel();
          const kmh=Math.hypot(v.x,v.y,v.z)*3.6;
          expect(kmh).toBeLessThanOrEqual(mode>0 ? 100.0001:60.0001);
          if(mode===1) rowingPeak=Math.max(rowingPeak,kmh);
          const displayed=scene.player.linvel();
          expect(Math.hypot(displayed.x,displayed.y,displayed.z)*3.6).toBeLessThanOrEqual(100.0001);
        }
        const velocity=scene.boat().linvel();speeds.push(Math.hypot(velocity.x,velocity.y,velocity.z));
        expect(scene.level.broken).toBe(false);
        expect(-scene.boat().linvel().z).toBeGreaterThan(mode<0 ? 2:8);
      } finally {scene.dispose();}
    }
    expect(speeds[0]*3.6).toBeGreaterThan(50);
    expect(speeds[0]*3.6).toBeLessThan(61);
    expect(rowingPeak).toBeGreaterThan(99);
    expect(speeds[2]).toBeLessThan(speeds[0]*.85);
  });

  it("returns progressively to the current's 60 km/h after releasing both paddles",async()=>{
    const scene=await setup(10,false,false);
    const speed=()=>{const v=scene.boat().linvel();return Math.hypot(v.x,v.y,v.z)*3.6;};
    try {
      for(let i=0;i<300;i++) scene.step(0,1,1/60,true);
      const before=speed();expect(before).toBeGreaterThan(65);
      scene.step(0,0);expect(speed()).toBeGreaterThan(before-5);
      for(let i=0;i<90;i++) scene.step(0,0);
      expect(speed()).toBeGreaterThan(55);expect(speed()).toBeLessThan(65);
      expect(scene.level.broken).toBe(false);
    } finally {scene.dispose();}
  });

  for(const side of [-1,1]) for(const vertical of [1,-1]) it(`keeps MegaBajada's ${side<0 ? "left":"right"} paddle effective at the new speed while ${vertical>0 ? "rowing":"braking"}`,async()=>{
    const scene=await setup(10,false,false);
    try {
      scene.step(0,0);scene.boat().setLinvel({x:0,y:0,z:-14},true);
      for(let i=0;i<20;i++) scene.step(side,vertical);
      if(vertical>0) expect(scene.level.heading*side).toBeGreaterThan(.03);
      else {
        expect(scene.level.heading*side).toBeLessThan(-.03);
        const v=scene.boat().linvel();expect(Math.hypot(v.x,v.y,v.z)).toBeLessThanOrEqual(60/3.6+.0001);
      }
      expect(scene.level.broken).toBe(false);
    } finally {scene.dispose();}
  });

  for(const [keys,turn,leftActive,rightActive] of [
    [["KeyW","KeyA"],1,true,false],
    [["KeyW","KeyD"],-1,false,true],
    [["KeyW","KeyA","KeyD"],0,true,true],
    [["KeyS","KeyA"],-1,true,false],
    [["KeyS","KeyD"],1,false,true],
    [["KeyS","KeyA","KeyD"],0,true,true]
  ] as const) it(`matches ${keys.join("+")} to the requested paddle animation, thrust and turn`,async()=>{
    const scene=await setup(1,false,false,0),target=new EventTarget();
    vi.stubGlobal("window",target);const input=new InputManager();
    try {
      const braking=keys[0]==="KeyS";
      scene.step(0,0);
      if(braking) scene.boat().setLinvel({x:0,y:0,z:-8},true);
      for(const code of keys) target.dispatchEvent(Object.assign(new Event("keydown"),{code}));
      input.update();const axis=input.getAxis();
      for(let i=0;i<60;i++) scene.step(axis.horizontal,axis.vertical,1/60,axis.bothPaddles);
      const speed=Math.hypot(scene.boat().linvel().x,scene.boat().linvel().z);
      if(braking) expect(speed).toBeLessThan(6);
      else expect(-scene.boat().linvel().z).toBeGreaterThan(1);
      if(turn===0) expect(Math.abs(scene.level.heading)).toBeLessThan(.01);
      else {
        expect(scene.level.heading*turn).toBeLessThan(-.03);
        expect(scene.player.getPosition().x*turn).toBeGreaterThan(.02);
      }
      const model=scene.models.find(m=>m.getObjectByName("paddle-left"))!;
      for(const [name,active] of [["paddle-left",leftActive],["paddle-right",rightActive]] as const) {
        const angle=model.getObjectByName(name)!.rotation.x;
        if(active) expect(Math.abs(angle-1.15)).toBeGreaterThan(.1);
        else expect(angle).toBeCloseTo(1.15);
      }
    } finally {input.destroy();vi.unstubAllGlobals();scene.dispose();}
  });

  it("can follow the original Bajada al Descenso curves using paddle corrections",async()=>{
    const scene=await setup(4,false,false);
    try {
      let failed=false;
      for(let i=0;i<7200 && !scene.level.finishRequested;i++) {
        const position=scene.boat().translation(),sample=sampleSellaRiver(scene.level.points,position)!;
        const aim=sample.segment>scene.level.points.length-9 ? scene.goal.position
          :scene.level.points[Math.min(sample.segment+3,scene.level.points.length-1)];
        const desired=Math.atan2(position.x-aim.x,position.z-aim.z);
        const error=Math.atan2(Math.sin(desired-scene.level.heading),Math.cos(desired-scene.level.heading));
        const straight=Math.abs(error)<.07;
        if(scene.step(straight ? 0:error>0 ? 1:-1,1,1/60,straight).fellOut) {failed=true;break;}
      }
      expect(failed,JSON.stringify(scene.player.getPosition().toArray())).toBe(false);
      expect(scene.level.finishRequested).toBe(true);
    } finally {scene.dispose();}
  });

  it("rows with both blades symmetrically and brakes with both without turning",async()=>{
    const scene=await setup(1,false,false,0);
    try {
      for(let i=0;i<180;i++) scene.step(0,1,1/60,true);
      const speed=-scene.boat().linvel().z;
      expect(speed).toBeGreaterThan(4);
      expect(Math.abs(scene.level.heading)).toBeLessThan(.01);
      for(let i=0;i<45;i++) scene.step(0,-1,1/60,true);
      expect(-scene.boat().linvel().z).toBeLessThan(speed*.2);
      expect(Math.abs(scene.level.heading)).toBeLessThan(.01);
      expect(scene.level.broken).toBe(false);
    } finally {scene.dispose();}
  });

  it("arrests rotational momentum promptly when the steering paddle is released",async()=>{
    const scene=await setup(1,false,false,0);
    try {
      for(let i=0;i<60;i++) scene.step(-1,1);
      const turning=Math.abs(scene.boat().angvel().y),heading=scene.level.heading;
      expect(turning).toBeGreaterThan(.05);
      for(let i=0;i<45;i++) scene.step(0,0);
      expect(Math.abs(scene.boat().angvel().y)).toBeLessThan(turning*.1);
      expect(Math.abs(scene.level.heading-heading)).toBeLessThan(turning*.3);
    } finally {scene.dispose();}
  });

  it("gives time to react after boarding a descent and then moderates downhill speed",async()=>{
    const scene=await setup(6,false,false);
    try {
      scene.step(0,0);
      const start=scene.boat().translation();
      for(let i=0;i<60;i++) scene.step(0,0);
      const early=scene.boat().translation();
      expect(Math.hypot(early.x-start.x,early.z-start.z)).toBeLessThan(1);
      for(let i=0;i<600;i++) scene.step(0,0);
      const velocity=scene.boat().linvel(),speed=Math.hypot(velocity.x,velocity.z);
      expect(scene.level.broken).toBe(false);
      expect(speed).toBeGreaterThan(3);
      expect(speed).toBeLessThan(11);
      const heading=scene.level.heading;
      for(let i=0;i<20;i++) scene.step(-1,-1);
      const braking=scene.boat().linvel();
      expect(Math.hypot(braking.x,braking.z)).toBeLessThan(speed*.85);
      expect(scene.level.heading).toBeGreaterThan(heading+.03);
    } finally {scene.dispose();}
  });

  it("floats, gains speed with strokes, crosses the tutorial goal and resets cleanly",async()=>{
    const f=await setup();
    try {
      let failed=false;
      for(let i=0;i<2400 && !f.level.finishRequested;i++) {if(f.step().fellOut) {failed=true;break;}}
      expect(failed,JSON.stringify({position:f.player.getPosition().toArray(),heading:f.level.heading,goal:f.goal.position.toArray()})).toBe(false);expect(f.player.isInVehicle()).toBe(true);
      expect(f.player.linvel().z).toBeLessThan(-5);expect(f.player.getPosition().y).toBeGreaterThan(12.4);
      expect(f.level.finishRequested).toBe(true);
      f.level.reset();f.player.respawn();expect(f.player.isInVehicle()).toBe(false);
      f.step();expect(f.player.isInVehicle()).toBe(true);expect(f.player.getPosition().z).toBeGreaterThan(10);
    } finally {f.dispose();}
  });

  for(const side of [-1,1]) for(const speed of [0,8]) it(`rowing with the ${side<0 ? "left":"right"} blade at ${speed} m/s turns away from that blade`,async()=>{
    const f=await setup();try {
      f.step(0,0);f.boat().setLinvel({x:0,y:0,z:-speed},true);
      for(let i=0;i<100;i++) f.step(side,1);
      expect(f.level.heading*side).toBeGreaterThan(.15);
      expect(f.player.getPosition().x*side).toBeLessThan(-.15);
    } finally {f.dispose();}
  });

  it("reverse strokes brake more than coasting",async()=>{
    const speeds:number[]=[];
    for(const command of [0,-1]) {
      const f=await setup();try {
        f.step();f.boat().setLinvel({x:0,y:0,z:-8},true);
        for(let i=0;i<60;i++) f.step(command===0 ? 0:-1,command);
        speeds.push(Math.abs(f.player.linvel().z));
      } finally {f.dispose();}
    }
    expect(speeds[1]).toBeLessThan(speeds[0]-1);
  });

  for(const side of [-1,1]) it(`holding the ${side<0 ? "left":"right"} blade brakes continuously and turns toward it`,async()=>{
    const f=await setup(1,true,true,0);try {
      f.step(0,0);f.boat().setLinvel({x:0,y:0,z:-8},true);f.boat().setAngvel({x:0,y:0,z:0},true);
      for(let i=0;i<50;i++) f.step(side,-1);
      expect(f.level.heading*side).toBeLessThan(-.1);
      expect(Math.abs(f.level.heading)).toBeLessThan(.8);
      expect(Math.abs(f.boat().angvel().y)).toBeLessThan(1);
      expect(Math.hypot(f.player.linvel().x,f.player.linvel().z)).toBeLessThan(6.5);
    } finally {f.dispose();}
  });

  for(const stage of [1,4,6]) for(const side of [-1,1]) it(`never reverses the ${side<0 ? "left":"right"} braking turn while stage ${stage}'s current starts flowing`,async()=>{
    const scene=await setup(stage,false,false);
    try {
      scene.step(0,0);
      // Start below the water's speed: the previous relative-water drag pushed this blade forward.
      for(let i=0;i<150;i++) {
        scene.step(side,-1);
        expect(scene.boat().angvel().y*side).toBeLessThanOrEqual(.0001);
      }
      // Weak tutorial current produces only a small turn; its direction must still be correct.
      expect(scene.level.heading*side).toBeLessThan(-.0001);
      expect(scene.level.broken).toBe(false);
    } finally {scene.dispose();}
  });

  it("W or S alone produces no motor thrust, and a planted blade cannot propel a still canoe backward",async()=>{
    for(const [h,v] of [[0,1],[0,-1],[-1,-1]]) {
      const f=await setup(1,true,true,0);try {
        for(let i=0;i<90;i++) f.step(h,v);
        expect(Math.hypot(f.player.linvel().x,f.player.linvel().z)).toBeLessThan(.05);
      } finally {f.dispose();}
    }
  });

  it("paddle entry creates propagated waves, and buoyancy follows the moving water",async()=>{
    const f=await setup(1,true,true,0);try {
      const water=f.models.find(m=>m.userData.sellaWater)!.userData.sellaWater as SellaWater;
      f.step(-1,1);
      expect(Math.max(...water.simulator.getHeightData().map(Math.abs))).toBeGreaterThan(.04);
      const initial=water.simulator.getHeightData().slice();
      for(let i=0;i<25;i++) f.step(0,0);
      expect(water.simulator.getHeightData().some((v,i)=>Math.abs(v-initial[i])>.01)).toBe(true);
      expect(Math.max(...water.simulator.getHeightData().map(Math.abs))).toBeLessThanOrEqual(.301);
      f.level.reset();f.player.respawn();let low=Infinity,high=-Infinity;
      for(let i=0;i<180;i++) {f.step(0,0);low=Math.min(low,f.player.getPosition().y);high=Math.max(high,f.player.getPosition().y);}
      expect(high-low).toBeGreaterThan(.02);expect(low).toBeGreaterThan(12.3);
    } finally {f.dispose();}
  });

  it("starts E2 on shore and boards only when the character reaches the canoe",async()=>{
    const f=await setup(2);try {
      f.step(0,0);expect(f.player.isInVehicle()).toBe(false);
      f.player.teleportTo(0,13.1,-43.1);f.step(0,0);expect(f.player.isInVehicle()).toBe(true);
    } finally {f.dispose();}
  });

  it("breaks against rocks and shores and restores the vehicle on reset",async()=>{
    const f=await setup(4);try {
      f.step();const rock=f.data.objects.find(o=>o.properties?.sellaAction==="rock")!;
      f.boat().setTranslation({...rock.position,y:rock.position.y+.45},true);
      let failed=false;for(let i=0;i<8;i++) if(f.step(0,0).fellOut) failed=true;
      expect(failed).toBe(true);expect(f.level.broken).toBe(true);
      f.level.reset();f.player.respawn();f.step(0,0);expect(f.level.broken).toBe(false);
      const p=f.boat().translation();f.boat().setTranslation({x:f.level.width/2,y:p.y,z:p.z},true);
      expect(f.step(0,0).fellOut).toBe(true);
    } finally {f.dispose();}
  });

  it("keeps Correr5 on foot and treats falling into the river as a loss",async()=>{
    const f=await setup(3);try {
      f.step(0,0);expect(f.player.isInVehicle()).toBe(false);
      f.player.teleportTo(0,8.1,15);expect(f.step(0,0).fellOut).toBe(true);
    } finally {f.dispose();}
  });

  it("falls from the waterfall and wins on contacting the lower basin",async()=>{
    const f=await setup(9,false,false);try {
      let failed=false,minY=Infinity;
      for(let i=0;i<2400 && !f.level.finishRequested;i++) {if(f.step().fellOut) {failed=true;break;}minY=Math.min(minY,f.player.getPosition().y);}
      expect(failed).toBe(false);expect(minY).toBeLessThan(14);expect(f.level.finishRequested).toBe(true);
    } finally {f.dispose();}
  });

  it("can land through the moving SuperBajada goal",async()=>{
    const f=await setup(7,false,false);try {
      // Aim for the target's arrival phase under the current downhill/steering tuning.
      const start=f.boat().translation();f.boat().setTranslation({x:-2.5,y:start.y,z:start.z},true);
      let failed=false;
      for(let i=0;i<2400 && !f.level.finishRequested;i++) {if(f.step().fellOut) {failed=true;break;}}
      expect(failed,JSON.stringify({position:f.player.getPosition().toArray(),heading:f.level.heading,goal:f.goal.position.toArray()})).toBe(false);expect(f.level.finishRequested).toBe(true);
    } finally {f.dispose();}
  });

  it("gulls lift the passenger out of the canoe, throw them off the river and return",async()=>{
    const f=await setup(6,false,true);try {
      for(let i=0;i<120;i++) f.step(0,0);
      const gull=f.models.find(m=>m.name.endsWith("gaviota-0"))!;
      const sample=sampleSellaRiver(f.level.points,gull.position,f.level.breaks)!;
      f.boat().setTranslation({x:gull.position.x,y:sample.y+.2,z:gull.position.z},true);
      for(let i=0;i<8 && f.player.isInVehicle();i++) f.step(0,0);
      expect(f.player.isInVehicle()).toBe(false);
      let fell=false,maxX=0;
      for(let i=0;i<220;i++) {if(f.step(0,0).fellOut) fell=true;maxX=Math.max(maxX,Math.abs(f.player.getPosition().x));}
      expect(maxX).toBeGreaterThan(f.level.width/2+5);expect(fell).toBe(true);
      expect(Math.abs(gull.position.x)).toBeLessThan(f.level.width/2);
    } finally {f.dispose();}
  });

  it("moves the SuperBajada goal with its physical frame",async()=>{
    const f=await setup(7,false,false);try {
      f.level.animate(1.5);f.physics.step(1/60);
      expect(Math.abs(f.goal.position.x)).toBeGreaterThan(5);
      let matching=false;
      f.physics.getWorld()!.forEachRigidBody(body=>{if(body.isKinematic() && Math.abs(body.translation().x-f.goal.position.x)<.01) matching=true;});
      expect(matching).toBe(true);
      const sample=sampleSellaRiver(f.level.points,{x:0,y:12,z:-190},f.level.breaks);
      expect(sample!.segment).toBeGreaterThan(f.level.breaks[0]);
    } finally {f.dispose();}
  });
});
