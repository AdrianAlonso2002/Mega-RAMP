import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import * as THREE from "three";
import type RAPIER from "@dimforge/rapier3d-compat";
import { PhysicsWorld } from "../src/physics/PhysicsWorld";
import { WORLD_05_LEVEL_02_STAGES as stages } from "../src/levels/world-05/level-02-stages";
import { createCangasModel } from "../src/levels/world-05/CangasModels";
import { CangasActions, previewCangasActor } from "../src/levels/world-05/CangasActions";
import { Player } from "../src/player/Player";
import { PLAYER_TOP_SPEED } from "../src/player/PlayerTuning";
import { CHARACTERS } from "../src/player/Characters";
import { SpriteTextures } from "../src/rendering/SpriteTextures";
import { LevelBuilder } from "../src/levels/LevelBuilder";
import { Camera } from "../src/rendering/Camera";
import type { ActiveGoal } from "../src/levels/LevelBuilder";
import type { LevelObjectData } from "../src/levels/LevelTypes";

// The package's CommonJS entry has a .js extension inside an ESM package.
// Use its browser ESM entry so Node runs the same engine as the game.
vi.mock("@dimforge/rapier3d-compat",async()=>{
  const entry="../node_modules/@dimforge/rapier3d-compat/rapier.es.js";
  return import(entry);
});
beforeAll(()=>{
  vi.spyOn(SpriteTextures,"getCharacterTexture").mockReturnValue(new THREE.Texture());
  vi.spyOn(SpriteTextures,"getSphereTexture").mockReturnValue(new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement));
});
afterAll(()=>vi.restoreAllMocks());

function terrain(physics:PhysicsWorld,obj:LevelObjectData):RAPIER.Collider[] {
  const result:RAPIER.Collider[]=[];
  if(obj.properties?.subType==="asturias_cangas_track") {
    const model=createCangasModel(obj)!;
    model.group.updateMatrixWorld(true);
    for(const mesh of model.meshes) {
      const geo=mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
      const vertices=geo.getAttribute("position").array as Float32Array;
      const indices=geo.index ? new Uint32Array(geo.index.array) : Uint32Array.from({length:vertices.length/3},(_,i)=>i);
      result.push(physics.createTrimeshCollider(vertices,indices,0,.65)!);
      geo.dispose();mesh.geometry.dispose();
    }
  } else if(obj.type==="platform") {
    const {position:p,scale:s}=obj;
    const add=(x:number,z:number,w:number,d:number)=>result.push(physics.createBoxCollider(
      {x,y:p.y,z},new THREE.Quaternion(),{x:w/2,y:s.y/2,z:d/2})!);
    if(obj.properties?.platformShape==="hollow_rect") {
      const w=Number(obj.properties.holeWidth),d=Number(obj.properties.holeDepth);
      for(const side of [-1,1]) {
        add(p.x+side*(s.x+w)/4,p.z,(s.x-w)/2,s.z);
        add(p.x,p.z+side*(s.z+d)/4,w,(s.z-d)/2);
      }
    } else add(p.x,p.z,s.x,s.z);
  }
  return result;
}

describe("Cangas: physically reachable jumps and synchronized hazards",()=>{
  it("magnets have independent repeatable rhythms, with faster irregular strokes in the middle",()=>{
    const magnets=stages[4].objects.filter(o=>o.properties?.cangasAction==="magnet");
    const traces=magnets.map(obj=>{
      const mesh=new THREE.Group();
      const trace=[];
      for(let i=0;i<240;i++) {previewCangasActor(obj,mesh,i/20);trace.push(mesh.position.y.toFixed(3));}
      return trace.join(",");
    });
    expect(new Set(traces).size).toBe(8);
    for(const index of [3,4]) {
      const obj=magnets[index],mesh=new THREE.Group();
      previewCangasActor(obj,mesh,2.1);const y=mesh.position.y;
      previewCangasActor(obj,mesh,15.7);previewCangasActor(obj,mesh,2.1);
      expect(mesh.position.y).toBe(y);
      expect(Number(obj.properties!.descent)).toBeLessThan(Number(magnets[0].properties!.descent));
      expect(Number(obj.properties!.irregularity)).toBeGreaterThan(.3);
    }
  });

  it("the rotating ice cream has solid curved geometry and blocks the camera",async()=>{
    const physics=new PhysicsWorld();await physics.waitForReady();
    try {
      const obj=stages[6].objects.find(o=>o.properties?.cangasAction==="icecream")!;
      const model=LevelBuilder.createStracciatellaConeMesh(Number(obj.properties!.coneHeight),Number(obj.properties!.scoopRadius));
      model.group.position.copy(obj.position);
      for(const mesh of model.meshes) mesh.userData.blocksCameraOnSlopes=true;
      const actions=new CangasActions(physics);actions.attach(obj,model.group,model.meshes);
      for(let frame=0;frame<60;frame++) {actions.update(frame/60,1/60);physics.step(1/60);}
      expect(model.group.rotation.y).toBeGreaterThan(.45);
      const world=physics.getWorld()!;let body:RAPIER.RigidBody|undefined;
      world.forEachRigidBody(b=>{if(b.isKinematic()) body=b;});
      expect(body!.numColliders()).toBe(model.meshes.length);
      expect(Math.abs(body!.rotation().y)).toBeGreaterThan(.2);
      const ball=physics.createBallBody(.75,{x:4.9,y:15.8,z:0})!;
      for(let frame=0;frame<12;frame++) physics.step(1/60);
      expect(ball.body.translation().x).toBeGreaterThan(5.3);
      const camera=new Camera(),position=new THREE.Vector3(0,15.8,-6.4);
      camera.snapTo(position,model.meshes);
      camera.follow(position,new THREE.Vector3(),1/60,model.meshes);
      expect(camera.object.position.z).toBeLessThan(-4.5);
      actions.reset();expect(model.group.rotation.y).toBe(0);
    } finally {physics.getWorld()?.free();}
  });

  for(const stageNumber of [2,10]) {
    const stage=stages[stageNumber];
    const pads=stage.objects.filter(o=>o.properties?.cangasAction==="launch");
    pads.forEach((pad,index)=>it(`E${stageNumber}: jump ${index+1} lands with the slowest character`,async()=>{
      const physics=new PhysicsWorld();await physics.waitForReady();
      try {
        let target:RAPIER.Collider[]=[];
        for(const obj of stage.objects) {
          // Bridge appearance uses canvas textures; the approach uses the exact generated ramps and islands.
          if(obj.properties?.style==="bridge") continue;
          const colliders=terrain(physics,obj);
          const targetName=stageNumber===2 ? index===3 ? "aterrizaje" : `pista-${index+1}` : `aproximacion-${index+1}`;
          if(colliders.length && obj.id.endsWith(`-${targetName}`)) target=colliders;
        }
        const props=pad.properties!;
        const direction=new THREE.Vector3(Number(props.launchX??0),0,Number(props.launchZ??-Number(props.velocity))).normalize();
        const start=new THREE.Vector3().copy(pad.position).addScaledVector(direction,-1.2);
        start.y+=.4;
        const player=new Player(CHARACTERS[2],physics,start);
        const body=player.getBody()!,collider=body.collider(0);
        body.setLinvel({x:direction.x*8.5,y:0,z:direction.z*8.5},true);
        const camera=new THREE.PerspectiveCamera();camera.position.copy(start);camera.lookAt(start.clone().add(direction));
        const actions=new CangasActions(physics);
        actions.attach(pad,createCangasModel(pad)!.group);
        let landed=false,launched=false;
        for(let frame=0;frame<180;frame++) {
          player.update(1/60,{horizontal:0,vertical:1},camera);
          actions.update(frame/60,1/60,new THREE.Vector3().copy(body.translation()),player);
          if(body.linvel().y>7.5) launched=true;
          physics.step(1/60);
          for(const destination of target) physics.getWorld()!.contactPair(collider,destination,manifold=>{
            if(manifold.numSolverContacts()>0) landed=true;
          });
          if(landed) break;
        }
        expect(launched,"pad must trigger on approach").toBe(true);
        expect(landed,`landing missed: ${JSON.stringify(body.translation())}`).toBe(true);
      } finally {physics.getWorld()?.free();}
    }));
  }

  it("third gust blows for four seconds then pauses for exactly two",()=>{
    const jet=stages[3].objects.find(o=>o.id.endsWith("chorro-3"))!;
    const model=createCangasModel(jet)!;
    const stream=model.group.getObjectByName("air-stream")!;
    const phase=Number(jet.properties!.phase);
    for(const [age,visible] of [[.1,true],[3.99,true],[4.01,false],[5.99,false],[6.1,true]] as const) {
      previewCangasActor(jet,model.group,phase+age);
      expect(stream.visible).toBe(visible);
    }
  });

  it("deep bowl supports the player; goal detection, frame and dish rotate together and reset",async()=>{
    const physics=new PhysicsWorld();await physics.waitForReady();
    try {
      const obj=stages[9].objects.find(o=>o.properties?.cangasAction==="fabada")!;
      const actions=new CangasActions(physics),model=createCangasModel(obj)!;
      actions.attach(obj,model.group);
      const goalObj=stages[9].objects.find(o=>o.type==="goal")!;
      const mesh=new THREE.Group();mesh.position.copy(goalObj.position);mesh.rotation.y=goalObj.rotation.y;
      const goal:ActiveGoal={mesh,position:mesh.position.clone(),quaternion:mesh.quaternion.clone(),reached:false};
      actions.attachGoal(goal);
      const ball=physics.createBallBody(.75,{x:0,y:-2,z:0})!;
      for(let i=0;i<180;i++) {actions.update(i/60,1/60);physics.step(1/60);}
      expect(ball.body.translation().y).toBeGreaterThan(-3.6);
      expect(ball.body.translation().y).toBeLessThan(-3.2);
      expect(goal.position.distanceTo(new THREE.Vector3().copy(goalObj.position))).toBeGreaterThan(10);
      expect(goal.mesh.position.distanceTo(goal.position)).toBeLessThan(.001);
      const world=physics.getWorld()!;
      let aligned=false;
      const post=new THREE.Vector3(-1.7,1.59,0).applyQuaternion(goal.quaternion!).add(goal.position);
      world.forEachCollider(c=>{if(new THREE.Vector3().copy(c.translation()).distanceTo(post)<.08) aligned=true;});
      expect(aligned,"moving physical goal frame must match the visible frame").toBe(true);
      actions.reset();
      expect(goal.position.distanceTo(new THREE.Vector3().copy(goalObj.position))).toBeLessThan(.001);
    } finally {physics.getWorld()?.free();}
  });

  it("the player can steer across the rotating stew instead of being dragged around by its floor",async()=>{
    const physics=new PhysicsWorld();await physics.waitForReady();
    const player=new Player(CHARACTERS[2],physics,{x:0,y:-3.4,z:0});
    try {
      const obj=stages[9].objects.find(o=>o.properties?.cangasAction==="fabada")!;
      const actions=new CangasActions(physics);actions.attach(obj,createCangasModel(obj)!.group);
      const camera=new THREE.PerspectiveCamera();camera.lookAt(0,0,-1);
      for(let i=0;i<180;i++) {
        player.update(1/60,{horizontal:-1,vertical:0},camera);
        actions.update(i/60,1/60,player.getPosition(),player);physics.step(1/60);
      }
      expect(player.getBody()!.translation().x).toBeLessThan(-3);
      expect(player.getBody()!.translation().y).toBeGreaterThan(-3.6);
      const honey=stages[9].objects.find(o=>o.type==="honey")!;
      expect(honey.position.y-honey.scale.y/2).toBeGreaterThan(player.getBody()!.translation().y);
      expect(honey.properties!.hasCollision).toBe(false);
    } finally {player.destroy();physics.getWorld()?.free();}
  });
});

describe("Player rolling momentum",()=>{
  async function setup(angle=0,character=CHARACTERS[2]) {
    const physics=new PhysicsWorld();await physics.waitForReady();
    const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),angle);
    physics.createBoxCollider({x:0,y:10,z:0},q,{x:1000,y:.3,z:10});
    const start=new THREE.Vector3(-25,10-25*Math.tan(angle)+.3/Math.cos(angle)+.77,0);
    const player=new Player(character,physics,start);
    const camera=new THREE.PerspectiveCamera();camera.lookAt(0,0,-1);
    return {physics,player,camera};
  }

  async function run(input:{horizontal:number;vertical:number},angle=0,seconds=1) {
    const {physics,player,camera}=await setup(angle);
    try {
      const body=player.getBody()!;
      body.setLinvel({x:10*Math.cos(angle),y:10*Math.sin(angle),z:0},true);
      body.setAngvel({x:0,y:0,z:-10/.75},true);
      for(let i=0;i<seconds*60;i++) {player.update(1/60,input,camera);physics.step(1/60);}
      return player.linvel();
    } finally {player.destroy();physics.getWorld()?.free();}
  }

  it("coasts without automatic braking and still brakes when reversing input",async()=>{
    const coast=await run({horizontal:0,vertical:0});
    const brake=await run({horizontal:-1,vertical:0});
    expect(coast.x).toBeGreaterThan(8);
    expect(brake.x).toBeLessThan(coast.x*.65);
  });

  it("continues accelerating downhill without input, beyond the driven speed limit",async()=>{
    const velocity=await run({horizontal:0,vertical:0},-.34,10);
    expect(velocity.x).toBeGreaterThan(PLAYER_TOP_SPEED*CHARACTERS[2].speed+1);
    expect(velocity.y).toBeLessThan(-1);
  });

  it("preserves external impulses instead of clamping them to walking speed",async()=>{
    const {physics,player,camera}=await setup();
    try {
      player.setLinearVelocity({x:22,y:7,z:0});
      player.update(1/60,{horizontal:0,vertical:0},camera);
      expect(player.linvel().x).toBeCloseTo(22);
      expect(player.linvel().y).toBeCloseTo(7);
    } finally {player.destroy();physics.getWorld()?.free();}
  });

  it("small steering corrections do not brake a ball above its propulsion speed",async()=>{
    const {physics,player,camera}=await setup();
    try {
      player.setLinearVelocity({x:30,y:0,z:0});
      player.update(1/60,{horizontal:1,vertical:.03},camera);
      expect(player.linvel().x).toBeGreaterThan(29.8);
    } finally {player.destroy();physics.getWorld()?.free();}
  });

  for(const character of CHARACTERS) it(`${character.name} keeps gaining downhill speed with and without forward input`,async()=>{
    for(const accelerate of [false,true]) {
      const {physics,player,camera}=await setup(-.34,character);
      try {
        const body=player.getBody()!;
        body.setLinvel({x:8*Math.cos(.34),y:-8*Math.sin(.34),z:0},true);
        body.setAngvel({x:0,y:0,z:-8/.75},true);
        const samples:number[]=[];
        for(let frame=0;frame<360;frame++) {
          player.update(1/60,{horizontal:accelerate ? 1 : 0,vertical:0},camera);physics.step(1/60);
          if(frame===119 || frame===239 || frame===359) samples.push(Math.hypot(body.linvel().x,body.linvel().y));
        }
        expect(samples[1]).toBeGreaterThan(samples[0]+3);
        expect(samples[2]).toBeGreaterThan(samples[1]+3);
        expect(samples[2]).toBeGreaterThan(20);
      } finally {player.destroy();physics.getWorld()?.free();}
    }
  });

  it("reaches percentage-based top speeds on flat ground while retaining acceleration and handling differences",async()=>{
    const measured:Record<string,{kmh:number;earlySpeed:number;lateral:number}>={};
    for(const character of CHARACTERS) {
      const {physics,player,camera}=await setup(0,character);
      try {
        let earlySpeed=0;
        for(let frame=0;frame<1800;frame++) {
          player.update(1/60,{horizontal:1,vertical:0},camera);physics.step(1/60);
          if(frame===179) earlySpeed=player.linvel().x;
        }
        const kmh=player.linvel().x*3.6;
        // Clear the previous input smoothing before measuring a common turning manoeuvre.
        player.respawn();player.setLinearVelocity({x:20,y:0,z:0});
        for(let frame=0;frame<30;frame++) {player.update(1/60,{horizontal:0,vertical:1},camera);physics.step(1/60);}
        measured[character.id]={kmh,earlySpeed,lateral:player.linvel().x};
        expect(Math.abs(kmh-120*character.speed),`${character.name} cruise speed`).toBeLessThan(1);
      } finally {player.destroy();physics.getWorld()?.free();}
    }
    expect(measured.rony.earlySpeed).toBeGreaterThan(measured.adri.earlySpeed);
    expect(measured.adri.earlySpeed).toBeGreaterThan(measured.pao.earlySpeed);
    expect(measured.pao.earlySpeed).toBeGreaterThan(measured.misi.earlySpeed);
    expect(measured.misi.lateral).toBeLessThan(measured.pao.lateral);
    expect(measured.pao.lateral).toBeLessThan(measured.rony.lateral);
    expect(measured.rony.lateral).toBeLessThan(measured.adri.lateral);
  });

  it("keeps Adri's real top speed consistent at 30 and 120 frames per second",async()=>{
    for(const fps of [30,120]) {
      const {physics,player,camera}=await setup(0,CHARACTERS.find(c=>c.id==="adri")!);
      try {
        for(let frame=0;frame<fps*25;frame++) {player.update(1/fps,{horizontal:1,vertical:0},camera);physics.step(1/fps);}
        expect(Math.abs(player.linvel().x*3.6-120)).toBeLessThan(1);
      } finally {player.destroy();physics.getWorld()?.free();}
    }
  });
});
