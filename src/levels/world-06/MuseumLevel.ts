import * as THREE from "three";
import type RAPIER from "@dimforge/rapier3d-compat";
import type {LevelData,LevelObjectData} from "../LevelTypes";
import type {Player} from "../../player/Player";
import type {PhysicsWorld} from "../../physics/PhysicsWorld";
import type {ActiveGoal,ActiveCollectible} from "../LevelBuilder";
import {previewMuseumActor} from "./MuseumModels";
import {animateMuseumAnimal} from "./MuseumAnimals";
import {pyramidMotion,pyramidBlockMotion,pyramidSurfaceMotion,PYRAMID_BLOCKS,PYRAMID_BLOCK_HEIGHT,type PyramidBlock,MUSEUM_CHASE_FINISH_Z} from "./MuseumRoutes";
import {PLAYER_TOP_SPEED} from "../../player/PlayerTuning";
import type {InputAxis} from "../../input/InputManager";
interface Part {mesh:THREE.Object3D;body:RAPIER.RigidBody;block?:PyramidBlock}
interface Actor {obj:LevelObjectData;mesh:THREE.Group;parts:Part[];collider?:RAPIER.Collider;cooldown?:number}
interface Commit {actor:Actor;choice:number;correct:boolean;age:number;origin:THREE.Vector3}
export interface MuseumMotion {position:THREE.Vector3;velocity:THREE.Vector3;fellOut:boolean}
export class MuseumLevel {
  readonly movementCamera=new THREE.PerspectiveCamera();
  private readonly chaseInput:InputAxis={horizontal:0,vertical:0};
  mapChaseInput(input:InputAxis):InputAxis {
    this.chaseInput.horizontal=-input.horizontal;this.chaseInput.vertical=input.vertical;return this.chaseInput;
  }
  finishRequested=false;
  failed=false;
  failure:"painting"|"rex"|"fall"="fall";
  private time=0;
  private stopped=false;
  private readonly actors:Actor[]=[];
  private readonly gems=new Set<number>();
  private paintingRow=0;
  private commit?:Commit;
  private goal?:ActiveGoal;
  private goalObj?:LevelObjectData;
  private goalBody?:RAPIER.RigidBody;
  private rexProgress=-38;
  private rexSpeed=0;
  private lastAnimalPush=-10;
  private readonly temp=new THREE.Vector3();
  private readonly quat=new THREE.Quaternion();
  private readonly paintingTarget=new THREE.Vector3();
  private readonly lastPlayerPosition=new THREE.Vector3();
  private readonly previousPlayerPosition=new THREE.Vector3();
  private readonly tierCoins=new Map<string,number>();
  constructor(private readonly data:LevelData,private readonly physics:PhysicsWorld) {
    this.lastPlayerPosition.copy(data.spawn);
    for(const o of data.objects) if(o.type==="collectible"&&typeof o.properties?.museumTier==="number") this.tierCoins.set(o.id,o.properties.museumTier);
  }
  get controlsGoal():boolean {return this.chasing || this.data.properties?.museumMode==="gems"&&this.gems.size<4 || this.data.properties?.museumMode==="paintings"&&this.paintingRow<8;}
  get gemCount():number {return this.gems.size;}
  get solvedPaintings():number {return this.paintingRow;}
  get crossingPainting():boolean {return this.commit!==undefined;}
  get elapsed():number {return this.time;}
  get chasing():boolean {return this.data.properties?.museumMode==="chase";}
  private makeBody(owner:THREE.Object3D,meshes:THREE.Mesh[]):RAPIER.RigidBody|undefined {
    owner.updateWorldMatrix(true,true);const inv=owner.matrixWorld.clone().invert(),scale=owner.getWorldScale(new THREE.Vector3());let body:RAPIER.RigidBody|undefined;
    for(const m of meshes) {
      m.updateWorldMatrix(true,false);const g=m.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv,m.matrixWorld)).scale(scale.x,scale.y,scale.z);
      const vertices=g.getAttribute("position").array as Float32Array,indices=g.index ? new Uint32Array(g.index.array):Uint32Array.from({length:vertices.length/3},(_,i)=>i),bounce=Number(m.userData.museumRestitution??.02);
      if(!body) body=this.physics.createKinematicTrimesh(owner.getWorldPosition(this.temp),vertices,indices,bounce,.65,owner.getWorldQuaternion(this.quat))?.body;
      else this.physics.addTrimeshColliderToBody(body,vertices,indices,.65,bounce);g.dispose();
    }
    return body;
  }
  attach(obj:LevelObjectData,mesh:THREE.Group,solids:THREE.Mesh[]):boolean {
    const action=obj.properties?.museumAction;if(!action) return false;
    const actor:Actor={obj,mesh,parts:[]};this.actors.push(actor);
    if(action==="pyramid") {
      mesh.updateWorldMatrix(true,false);const scale=mesh.getWorldScale(new THREE.Vector3());
      for(const block of PYRAMID_BLOCKS) {
        const p=this.temp.set(block.x,block.y-PYRAMID_BLOCK_HEIGHT/2,block.z).applyMatrix4(mesh.matrixWorld);
        const made=this.physics.createKinematicBox(p,mesh.getWorldQuaternion(this.quat),{x:block.width*scale.x/2,y:PYRAMID_BLOCK_HEIGHT*scale.y/2,z:block.depth*scale.z/2},.65,.02);
        if(made) actor.parts.push({mesh,body:made.body,block});
      }
      return true;
    }
    if(action==="gem") {const body=this.makeBody(mesh,solids);if(body) actor.parts.push({mesh,body});return true;}
    if(action==="glass") {
      const made=this.physics.createKinematicBox(obj.position,mesh.quaternion,{x:3.24,y:2.55,z:3.24},.5,0,{x:0,y:2.55,z:0});
      if(made) {actor.parts.push({mesh,body:made.body});actor.collider=made.collider;}return true;
    }
    if(action==="animal") {
      const made=this.physics.createKinematicBox(mesh.position,mesh.quaternion,{x:.95,y:1.25,z:1.65},.5,.12,{x:0,y:1.25,z:0});if(made) actor.parts.push({mesh,body:made.body});return true;
    }
    return false;
  }
  attachGoal(obj:LevelObjectData,goal:ActiveGoal):void {
    this.goal=goal;this.goalObj=obj;
    if(this.chasing) {goal.mesh.visible=false;goal.position.z=MUSEUM_CHASE_FINISH_Z;goal.mesh.position.copy(goal.position);}
    if(obj.properties?.museumGoal==="pyramid") {
      const made=this.physics.createKinematicBox(goal.position,goal.mesh.quaternion,{x:.22,y:1.59,z:.22},.75,.1,{x:-1.7,y:1.59,z:0});this.goalBody=made?.body;
      if(this.goalBody) {
        this.physics.addBoxColliderToBody(this.goalBody,{x:1.7,y:1.59,z:0},{x:.22,y:1.59,z:.22},.75,.1);
        this.physics.addBoxColliderToBody(this.goalBody,{x:0,y:3.4,z:0},{x:1.95,y:.22,z:.24},.75,.1);
      }
    }
  }
  private moveParts(actor:Actor,snap=false):void {
    actor.mesh.updateWorldMatrix(true,true);
    const rootRotation=actor.mesh.getWorldQuaternion(this.quat);
    for(const part of actor.parts) {
      const block=part.block,p=block ? this.temp.set(block.x,block.y-PYRAMID_BLOCK_HEIGHT/2+pyramidBlockMotion(this.time,block.tier,block.index),block.z).applyMatrix4(actor.mesh.matrixWorld):part.mesh.getWorldPosition(this.temp),q=block ? rootRotation:part.mesh.getWorldQuaternion(this.quat);
      part.body.setNextKinematicTranslation(p);part.body.setNextKinematicRotation(q);
      if(snap) {part.body.setTranslation(p,true);part.body.setRotation(q,true);part.body.setLinvel({x:0,y:0,z:0},true);part.body.setAngvel({x:0,y:0,z:0},true);}
    }
  }
  animatePreview(time:number):void {for(const actor of this.actors) previewMuseumActor(actor.obj,actor.mesh,time);}
  updateCollectibles(items:ActiveCollectible[],hoverTime:number):void {
    for(const item of items) {
      const tier=this.tierCoins.get(item.id);if(tier===undefined||item.collected) continue;
      item.position.set(item.baseX,item.baseY+pyramidSurfaceMotion(this.time,tier,item.baseX,item.baseZ)+Math.sin(hoverTime*4+item.baseX)*.12,item.baseZ);item.mesh.position.copy(item.position);
    }
  }
  update(delta:number,player:Player):MuseumMotion|undefined {
    if(this.stopped) return;
    this.time+=delta;let p=player.getBody()?.translation()??player.getPosition();
    this.previousPlayerPosition.copy(this.lastPlayerPosition);this.lastPlayerPosition.copy(p);
    if(this.data.properties?.museumMode==="chase") {
      const x=THREE.MathUtils.clamp(p.x,-12.9,12.9),z=THREE.MathUtils.clamp(p.z,MUSEUM_CHASE_FINISH_Z-5,22),y=Math.max(.76,p.y);
      if(x!==p.x||z!==p.z||y!==p.y) {const v=player.linvel(),velocity={x:v.x,y:y!==p.y ? Math.max(0,v.y):v.y,z:v.z};player.teleportTo(x,y,z);player.setLinearVelocity(velocity);p=player.getBody()!.translation();}
      // Arrival takes priority over pursuer contact on the same frame, in every lane.
      if(!this.failed&&p.z<=MUSEUM_CHASE_FINISH_Z) {
        this.finishRequested=true;
        player.teleportTo(p.x,p.y,p.z);player.setLinearVelocity({x:0,y:0,z:0});
        return {position:player.getPosition(),velocity:new THREE.Vector3(),fellOut:false};
      }
    }
    for(const actor of this.actors) {
      const action=actor.obj.properties?.museumAction;
      if(action!=="rex") previewMuseumActor(actor.obj,actor.mesh,this.time,action!=="animal"||Math.abs(p.z-actor.obj.position.z)<170);
      if(action==="animal") {
        const near=Math.abs(p.z-actor.mesh.position.z)<170;actor.mesh.visible=near;
        for(const part of actor.parts) if(part.body.isEnabled()!==near) part.body.setEnabled(near);
        if(!near) continue;
        if(near&&this.time-(actor.cooldown??-10)>.9&&Math.hypot(p.x-actor.mesh.position.x,p.z-actor.mesh.position.z)<2.8&&Math.abs(p.y-actor.mesh.position.y)<3) {
          const v=player.linvel(),side=p.x>=actor.mesh.position.x ? 1:-1;player.setLinearVelocity({x:side*9,y:Math.max(v.y,2),z:Math.min(v.z,-PLAYER_TOP_SPEED*player.getCharacter().speed*.65)});actor.cooldown=this.time;this.lastAnimalPush=this.time;
        }
      }
      if(action==="rex") this.updateRex(actor,delta,player,p);
      if(action==="jump"&&this.time-(actor.cooldown??-10)>1.1) {
        const local=actor.mesh.worldToLocal(this.temp.copy(p)),width=Number(actor.obj.properties?.width??6);
        if(Math.abs(local.x)<width/2&&Math.abs(local.z)<1.05&&local.y>.25&&local.y<1.65) {
          const v=player.linvel();player.setLinearVelocity({x:THREE.MathUtils.clamp(v.x,-3,3),y:Number(actor.obj.properties?.launchY??9.2),z:-Number(actor.obj.properties?.velocity??16.5)});actor.cooldown=this.time;
        }
      }
      if(action==="gem"&&!this.gems.has(Number(actor.obj.properties?.gemIndex))) {
        const centre=actor.mesh.position;
        if(Math.hypot(p.x-centre.x,p.z-centre.z)<1.55&&p.y>centre.y&&p.y<centre.y+3) {
          this.gems.add(Number(actor.obj.properties?.gemIndex));const gem=actor.mesh.getObjectByName("museum-gem");if(gem) gem.visible=false;
        }
      }
      if(action==="glass") {const open=this.gems.size===4;actor.mesh.visible=!open;actor.collider?.setEnabled(!open);}
      this.moveParts(actor);
    }
    if(this.goal&&this.goalObj?.properties?.museumGoal==="pyramid") {
      this.goal.position.y=this.goalObj.position.y+pyramidMotion(this.time,7);this.goal.mesh.position.copy(this.goal.position);this.goalBody?.setNextKinematicTranslation(this.goal.position);
    }
    if(this.failed) return this.failureMotion(player);
    if(this.commit) return this.advancePainting(delta,player);
    if(this.data.properties?.museumMode==="paintings") {
      const actor=this.actors.find(a=>a.obj.properties?.museumAction==="painting"&&a.obj.properties.row===this.paintingRow);
      if(actor) {
        const local=actor.mesh.worldToLocal(this.temp.copy(p));
        const plane=actor.obj.position.z+.9,swept=this.previousPlayerPosition.z>=plane&&p.z<plane;
        const crossingX=swept ? THREE.MathUtils.lerp(this.previousPlayerPosition.x,p.x,(this.previousPlayerPosition.z-plane)/(this.previousPlayerPosition.z-p.z||1))-actor.obj.position.x:local.x;
        const choice=Math.round(crossingX/5)+1;
        if(choice>=0&&choice<3&&Math.abs(crossingX-(choice-1)*5)<1.95&&(local.z<.9&&local.z>-.5||swept)&&local.y>.3&&local.y<3) {
          this.commit={actor,choice,correct:choice===Number(actor.obj.properties?.correct),age:0,origin:new THREE.Vector3().copy(p)};return this.advancePainting(delta,player);
        }
      }
    }
    return;
  }
  private advancePainting(delta:number,player:Player):MuseumMotion {
    const commit=this.commit!;commit.age+=delta;const duration=commit.correct ? .75:1.1,t=Math.min(1,commit.age/duration),z=commit.actor.obj.position.z;
    const destination=this.paintingTarget.set((commit.choice-1)*5,commit.actor.obj.position.y+.8,z-5.7),point=this.temp.copy(commit.origin).lerp(destination,t);
    // Keep the good crossing level; a wrong choice commits to a visible drop.
    point.y=commit.correct ? destination.y:commit.origin.y-13*t*t;
    player.teleportTo(point.x,point.y,point.z);player.setLinearVelocity({x:0,y:0,z:0});
    if(t>=1) {
      if(commit.correct) {this.paintingRow++;this.commit=undefined;}
      else {this.failed=true;this.failure="painting";}
    }
    return {position:player.getPosition(),velocity:new THREE.Vector3(),fellOut:this.failed};
  }
  private updateRex(actor:Actor,delta:number,player:Player,p:{x:number;y:number;z:number}):void {
    if(this.time<3) {animateMuseumAnimal(actor.mesh,this.time);return;}
    const progress=12-p.z,gap=progress-this.rexProgress,top=PLAYER_TOP_SPEED*player.getCharacter().speed;
    const recovery=this.time-this.lastAnimalPush<1 ? .8:1;
    const target=Math.min(top*1.15,top*.78+Math.max(0,gap-22)*.38)*recovery;
    this.rexSpeed=THREE.MathUtils.damp(this.rexSpeed,target,1.5,delta);this.rexProgress+=this.rexSpeed*delta;
    actor.mesh.position.set(THREE.MathUtils.damp(actor.mesh.position.x,p.x,1.2,delta),0,12-this.rexProgress);actor.mesh.rotation.y=0;animateMuseumAnimal(actor.mesh,this.time*1.4);
    if(progress-this.rexProgress<5.3&&Math.abs(p.x-actor.mesh.position.x)<3.5) {this.failed=true;this.failure="rex";}
  }
  private failureMotion(player:Player):MuseumMotion {return {position:player.getPosition(),velocity:new THREE.Vector3(),fellOut:true};}
  stop():void {this.stopped=true;}
  reset():void {
    this.time=0;this.stopped=false;this.failed=false;this.failure="fall";this.finishRequested=false;this.paintingRow=0;this.commit=undefined;this.gems.clear();this.rexProgress=-38;this.rexSpeed=0;this.lastAnimalPush=-10;
    this.lastPlayerPosition.copy(this.data.spawn);this.previousPlayerPosition.copy(this.data.spawn);
    for(const actor of this.actors) {
      actor.cooldown=undefined;actor.mesh.visible=true;actor.mesh.position.copy(actor.obj.position);actor.mesh.rotation.set(actor.obj.rotation.x,actor.obj.rotation.y,actor.obj.rotation.z);previewMuseumActor(actor.obj,actor.mesh,0);
      for(const part of actor.parts) part.body.setEnabled(true);actor.collider?.setEnabled(true);const gem=actor.mesh.getObjectByName("museum-gem");if(gem) gem.visible=true;this.moveParts(actor,true);
    }
    if(this.goal&&this.goalObj) {this.goal.position.copy(this.goalObj.position);this.goal.mesh.position.copy(this.goal.position);this.goalBody?.setTranslation(this.goal.position,true);this.goalBody?.setNextKinematicTranslation(this.goal.position);}
    if(this.chasing&&this.goal) {this.goal.mesh.visible=false;this.goal.position.z=MUSEUM_CHASE_FINISH_Z;this.goal.mesh.position.copy(this.goal.position);}
  }
  destroy():void {this.actors.length=0;this.tierCoins.clear();}
}
