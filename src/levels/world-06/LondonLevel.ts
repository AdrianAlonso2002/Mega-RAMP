import * as THREE from "three";
import type RAPIER from "@dimforge/rapier3d-compat";
import type {LevelData,LevelObjectData} from "../LevelTypes";
import type {PhysicsWorld} from "../../physics/PhysicsWorld";
import type {Player} from "../../player/Player";
import type {ActiveCollectible,ActiveGoal} from "../LevelBuilder";
import {previewLondonActor} from "./LondonModels";
import {planePose,FLIGHT_END,trainPose,hairPose} from "./LondonRoutes";

interface Actor {obj:LevelObjectData;mesh:THREE.Group;body?:RAPIER.RigidBody;movingPart?:THREE.Object3D;doors?:RAPIER.Collider[];hairStart?:number;compression?:number}
export interface LondonMotion {position:THREE.Vector3;velocity:THREE.Vector3;fellOut:boolean}
export class LondonLevel {
  finishRequested=false;
  failed=false;
  failure:"cold"|"crush"|"fall"="fall";
  heading=0;
  private time=0;
  private stopped=false;
  private passenger?:Player;
  private flightReleased=false;
  private goal?:ActiveGoal;
  private readonly actors:Actor[]=[];
  private readonly completedTrains=new Set<number>();
  private readonly boardedTrains=new Set<number>();
  private readonly trainCoins=new Map<string,string>();
  private readonly temp=new THREE.Vector3();
  private readonly other=new THREE.Vector3();
  private readonly quaternion=new THREE.Quaternion();
  private crowHitAt=-10;
  private ice?:THREE.Mesh<THREE.IcosahedronGeometry,THREE.MeshStandardMaterial>;
  constructor(private readonly data:LevelData,private readonly physics:PhysicsWorld,root:THREE.Group) {
    for(const o of data.objects) if(typeof o.properties?.londonTrain==="string") this.trainCoins.set(o.id,o.properties.londonTrain);
    if(data.properties?.londonMode==="cold") {
      this.ice=new THREE.Mesh(new THREE.IcosahedronGeometry(.8,2),new THREE.MeshStandardMaterial({color:0x9cdef1,transparent:true,opacity:0,roughness:.25,metalness:.12,depthWrite:false}));
      this.ice.name="london-progressive-frost";this.ice.renderOrder=23;root.add(this.ice);
    }
  }
  get controlsGoal():boolean {return this.data.properties?.londonMode==="underground" || this.data.properties?.londonMode==="plane" && !this.flightReleased;}
  get flying():boolean {return this.data.properties?.londonMode==="plane"&&!this.flightReleased;}
  get elapsed():number {return this.time;}
  get completedJourneys():number {return this.completedTrains.size;}
  attachGoal(goal:ActiveGoal):void {this.goal=goal;}

  private makeBody(owner:THREE.Object3D,meshes:THREE.Mesh[],friction=.6):RAPIER.RigidBody|undefined {
    owner.updateWorldMatrix(true,true);const inv=owner.matrixWorld.clone().invert(),scale=owner.getWorldScale(new THREE.Vector3());
    let body:RAPIER.RigidBody|undefined;
    for(const mesh of meshes) {
      mesh.updateWorldMatrix(true,false);
      const geometry=mesh.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv,mesh.matrixWorld)).scale(scale.x,scale.y,scale.z);
      const vertices=geometry.getAttribute("position").array as Float32Array,indices=geometry.index ? new Uint32Array(geometry.index.array):Uint32Array.from({length:vertices.length/3},(_,i)=>i);
      if(!body) body=this.physics.createKinematicTrimesh(owner.getWorldPosition(this.temp),vertices,indices,.01,friction,owner.getWorldQuaternion(this.quaternion))?.body;
      else this.physics.addTrimeshColliderToBody(body,vertices,indices,friction,.01);
      geometry.dispose();
    }
    return body;
  }
  /** Returns true when this runtime owns the object's moving colliders. */
  attach(obj:LevelObjectData,mesh:THREE.Group,solids:THREE.Mesh[]):boolean {
    const action=obj.properties?.londonAction;if(!action) return false;
    const actor:Actor={obj,mesh};this.actors.push(actor);
    if(action==="train") {
      actor.body=this.makeBody(mesh,solids,0);actor.doors=[];
      if(actor.body) {
        this.physics.setPassengerFloorFriction(actor.body);
        for(const side of [-1,1]) for(const z of [-9,0,9]) {
          const door=this.physics.addBoxColliderToBody(actor.body,{x:side*2.04,y:1.6,z},{x:.08,y:1.4,z:1.35},0,.01);
          if(door) actor.doors.push(door);
        }
      }
      this.poseCollider(actor);return true;
    }
    if(action==="hair") {
      actor.movingPart=mesh.getObjectByName("london-hair-jaw");
      if(actor.movingPart) actor.body=this.makeBody(actor.movingPart,actor.movingPart.children.filter(c=>c instanceof THREE.Mesh) as THREE.Mesh[]);
      return false;
    }
    if(action==="punch") {actor.body=this.physics.createInflatableBody(obj.position,Math.max(obj.scale.x,obj.scale.y,obj.scale.z))??undefined;return true;}
    if(action==="trap") {actor.body=this.makeBody(mesh,solids);return true;}
    if(action==="crow") {
      actor.movingPart=mesh.getObjectByName("london-crow-head");
      if(actor.movingPart) {
        const centre=actor.movingPart.localToWorld(new THREE.Vector3(0,0,-2));
        actor.body=this.physics.createKinematicBox(centre,actor.movingPart.getWorldQuaternion(this.quaternion),{x:.22,y:.22,z:1.65},.4,.15)?.body;
      }
      return true;
    }
    return false;
  }
  private poseCollider(actor:Actor):void {
    if(!actor.body) return;
    const action=actor.obj.properties?.londonAction;
    const owner=actor.movingPart??actor.mesh;owner.updateWorldMatrix(true,false);
    const position=action==="crow" ? owner.localToWorld(this.temp.set(0,0,-2)):owner.getWorldPosition(this.temp);
    actor.body.setNextKinematicTranslation(position);actor.body.setNextKinematicRotation(owner.getWorldQuaternion(this.quaternion));
    if(action==="train") for(const door of actor.doors??[]) door.setEnabled(!trainPose(this.time,Number(actor.obj.properties?.phase??0)).doors);
  }
  animatePreview(time:number):void {
    for(const actor of this.actors) if(actor.obj.properties?.londonAction!=="punch") previewLondonActor(actor.obj,actor.mesh,time);
  }
  updateCollectibles(items:ActiveCollectible[],hoverTime:number):void {
    for(const item of items) {
      const trainId=this.trainCoins.get(item.id);if(!trainId||item.collected) continue;
      const actor=this.actors.find(a=>a.obj.id===trainId);if(!actor) continue;
      item.position.set(item.baseX,item.baseY+Math.sin(hoverTime*4+item.baseX)*.12,item.baseZ+actor.mesh.position.z-actor.obj.position.z);item.mesh.position.copy(item.position);
    }
  }
  update(delta:number,player:Player):LondonMotion|undefined {
    if(this.stopped) return;
    this.time+=delta;
    const p=player.getBody()?.translation()??player.getPosition();
    for(const actor of this.actors) {
      const action=actor.obj.properties?.londonAction;
      if(action==="punch") {this.updatePunch(actor,delta,player);continue;}
      if(action==="train") {
        const oldZ=actor.mesh.position.z,inside=Math.abs(p.x-actor.mesh.position.x)<1.9 && Math.abs(p.z-oldZ)<15.5 && p.y>-.1&&p.y<3.4;
        previewLondonActor(actor.obj,actor.mesh,this.time);const pose=trainPose(this.time,Number(actor.obj.properties?.phase??0)),index=Number(actor.obj.properties?.trainIndex??0);
        if(inside) {
          const v=player.linvel(),velocity={x:v.x,y:v.y,z:v.z};
          player.teleportTo(p.x,p.y,p.z+actor.mesh.position.z-oldZ);player.setLinearVelocity(velocity);
          if(pose.atStart&&(index===0||this.completedTrains.has(index-1))) this.boardedTrains.add(index);
          if(pose.atEnd&&this.boardedTrains.has(index)) this.completedTrains.add(index);
        }
      } else if(action==="hair") {
        const local=actor.mesh.worldToLocal(this.temp.copy(p)),length=Number(actor.obj.properties?.hotLength??134);
        const inHot=Math.abs(local.x)<2.9&&local.z<=-4&&local.z>=-length-4&&local.y<3;
        if(inHot && actor.hairStart===undefined) actor.hairStart=this.time;
        const age=actor.hairStart===undefined ? 0:this.time-actor.hairStart;
        previewLondonActor(actor.obj,actor.mesh,age);
        if(inHot&&hairPose(age).crushing) {this.failed=true;this.failure="crush";}
      } else {
        previewLondonActor(actor.obj,actor.mesh,this.time);
      }
      actor.mesh.updateMatrixWorld(true);this.poseCollider(actor);
      if(action==="crow"&&actor.movingPart&&this.time-this.crowHitAt>.9) {
        const from=actor.movingPart.getWorldPosition(new THREE.Vector3()),to=actor.movingPart.localToWorld(new THREE.Vector3(0,0,-3.7));
        const line=new THREE.Line3(from,to),nearest=line.closestPointToPoint(new THREE.Vector3().copy(p),true,this.temp);
        if(nearest.distanceToSquared(p)<1) {
          this.other.copy(to).sub(from);this.other.y=0;this.other.normalize().multiplyScalar(17);this.other.y=4.5;
          player.setLinearVelocity(this.other);this.crowHitAt=this.time;
        }
      }
    }
    if(this.ice) {
      this.ice.position.copy(player.getPosition());this.ice.material.opacity=.6*Math.min(1,this.time/15);this.ice.rotation.y=this.time*.15;
      if(this.time>=15) {this.failed=true;this.failure="cold";}
    }
    if(this.flying) return this.updatePlane(player);
    if(this.data.properties?.londonMode==="underground") {
      if(p.y<-.85) this.failed=true;
      if(this.completedTrains.size===3 && this.goal && Math.abs(p.x-this.goal.position.x)<1.4&&Math.abs(p.z-this.goal.position.z)<.7) this.finishRequested=true;
    }
    if(this.failed) return {position:player.getPosition(),velocity:new THREE.Vector3(),fellOut:true};
    return;
  }
  private updatePlane(player:Player):LondonMotion|undefined {
    const actor=this.actors.find(a=>a.obj.properties?.londonAction==="plane");if(!actor) return;
    const pose=planePose(this.time);this.heading=pose.yaw;
    if(!this.passenger) {this.passenger=player;player.setVehicleMounted(true);}
    actor.mesh.updateWorldMatrix(true,false);
    const seat=actor.mesh.localToWorld(this.temp.set(0,3.1,-5)),velocity=this.other.set(-Math.sin(pose.yaw)*29.67,0,-Math.cos(pose.yaw)*29.67);
    if(this.time>FLIGHT_END) {
      const u=Math.min(1,(this.time-FLIGHT_END)/1.5);
      if(u<.4) seat.lerp(new THREE.Vector3(1.7,3.1,-168),u/.4);
      else seat.set(1.7,3.1,-168).lerp(new THREE.Vector3(5.5,.95,-168),(u-.4)/.6);
      velocity.set(0,0,0);
      if(u>=1) {this.flightReleased=true;player.setVehicleMounted(false);player.teleportTo(5.5,.95,-168);return;}
    }
    player.setVehiclePose(seat,velocity);return {position:player.getPosition(),velocity:player.getVelocity(),fellOut:false};
  }
  private updatePunch(actor:Actor,delta:number,player:Player):void {
    if(!actor.body) return;
    const body=actor.body,p=body.translation(),q=body.rotation();actor.mesh.position.copy(p);actor.mesh.quaternion.copy(q);
    const pos=player.getBody()?.translation()??player.getPosition(),contact=Math.hypot(pos.x-p.x,pos.z-p.z)<1.65&&Math.abs(pos.y-(p.y+1))<2;
    const target=contact ? .9:0;
    actor.compression=THREE.MathUtils.damp(actor.compression??0,target,contact ? 12:5,delta);
    const squash=1-.2*actor.compression,swell=1/Math.sqrt(squash);actor.mesh.scale.set(actor.obj.scale.x*swell,actor.obj.scale.y*squash,actor.obj.scale.z*swell);
    const up=this.temp.set(0,1,0).applyQuaternion(actor.mesh.quaternion);
    // Restore orientation softly, never position: an inflatable pushed over the
    // edge really falls and cannot snap back onto the narrow path.
    if(up.y>.15&&p.y>-.5) body.applyTorqueImpulse({x:up.z*-.9*delta,y:0,z:up.x*.9*delta},true);
    if(p.y<-30) {body.setEnabled(false);actor.mesh.visible=false;}
  }
  stop():void {this.stopped=true;}
  reset():void {
    this.passenger?.setVehicleMounted(false);this.passenger=undefined;this.flightReleased=false;this.time=0;this.stopped=false;this.failed=false;this.finishRequested=false;this.failure="fall";
    this.completedTrains.clear();this.boardedTrains.clear();this.crowHitAt=-10;if(this.ice) this.ice.material.opacity=0;
    for(const actor of this.actors) {
      actor.hairStart=undefined;actor.compression=0;actor.mesh.visible=true;actor.mesh.position.copy(actor.obj.position);actor.mesh.rotation.set(actor.obj.rotation.x,actor.obj.rotation.y,actor.obj.rotation.z);actor.mesh.scale.copy(actor.obj.scale);
      if(actor.obj.properties?.londonAction!=="punch") previewLondonActor(actor.obj,actor.mesh,0);
      if(actor.body) {
        if(actor.obj.properties?.londonAction==="punch") {actor.body.setEnabled(true);actor.body.setTranslation(actor.obj.position,true);actor.body.setRotation(actor.mesh.quaternion,true);actor.body.setLinvel({x:0,y:0,z:0},true);actor.body.setAngvel({x:0,y:0,z:0},true);}
        else {
          this.poseCollider(actor);
          const owner=actor.movingPart??actor.mesh,position=actor.obj.properties?.londonAction==="crow" ? owner.localToWorld(this.temp.set(0,0,-2)):owner.getWorldPosition(this.temp);
          actor.body.setTranslation(position,true);actor.body.setRotation(owner.getWorldQuaternion(this.quaternion),true);
        }
      }
    }
  }
  destroy():void {this.passenger?.setVehicleMounted(false);this.actors.length=0;this.trainCoins.clear();}
}
