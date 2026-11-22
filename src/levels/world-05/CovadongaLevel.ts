import * as THREE from "three";
import type RAPIER from "@dimforge/rapier3d-compat";
import type {LevelData,LevelObjectData,Vector3Data} from "../LevelTypes";
import type {PhysicsWorld} from "../../physics/PhysicsWorld";
import type {Player} from "../../player/Player";
import type {InputAxis} from "../../input/InputManager";
import type {ActiveGoal} from "../LevelBuilder";
import {buildRiverFrames,sampleSellaRiver,type RiverFrame} from "./SellaRiver";
import {CovadongaPath,mineOffset,mineRockDistance,cannonPosition,cannonVelocity,type MineJunction} from "./CovadongaPath";
import {previewCovadongaActor} from "./CovadongaModels";

type Actor={obj:LevelObjectData;mesh:THREE.Object3D;body?:RAPIER.RigidBody;rotatingBodies?:{mesh:THREE.Object3D;body:RAPIER.RigidBody}[];groundHint?:number};
export interface CovadongaMotion {position:THREE.Vector3;velocity:THREE.Vector3;fellOut:boolean}
export class CovadongaLevel {
  finishRequested=false;
  broken=false;
  heading=0;
  cannonYaw=.1;
  cannonPitch=.3;
  private readonly mode:string;
  private readonly path?:CovadongaPath;
  private readonly frames:RiverFrame[];
  private readonly width:number;
  private readonly junctions:MineJunction[];
  private readonly actors:Actor[]=[];
  private readonly decisions=new Map<number,number>();
  private vehicle?:Actor;
  private passenger?:Player;
  private goal?:ActiveGoal;
  private time=0;
  private boardedAt=0;
  private stopped=false;
  private speed=0;
  private distance=0;
  private lateral=0;
  private hint=-1;
  private falling=0;
  private footHitAt=-10;
  private cannonPhase:"waiting"|"aim"|"flight"="waiting";
  private flightTime=0;
  private readonly flightOrigin=new THREE.Vector3();
  private readonly flightVelocity=new THREE.Vector3();
  private readonly position=new THREE.Vector3();
  private readonly velocity=new THREE.Vector3();
  private readonly seat=new THREE.Vector3();
  private guide?:THREE.Line<THREE.BufferGeometry,THREE.LineDashedMaterial>;
  private animationTime=NaN;
  private animationPhysical=false;

  constructor(private readonly data:LevelData,private readonly physics:PhysicsWorld) {
    this.mode=String(data.properties?.covadongaMode??"foot");
    const road=data.objects.find(o=>o.properties?.subType===(this.mode==="cart" ? "asturias_cov_mine":"asturias_cov_road"));
    const points=road?.properties?.points as Vector3Data[]|undefined;
    if(points?.length) this.path=new CovadongaPath(points);
    this.frames=points ? buildRiverFrames(points):[];
    this.width=Number(road?.properties?.width??8);
    this.junctions=road?.properties?.junctions as MineJunction[]??[];
  }
  get controlsGoal():boolean {return this.mode!=="foot";}
  get cannonAiming():boolean {return this.cannonPhase==="aim";}
  get cannonSceneActive():boolean {return this.mode==="cannon" && this.cannonPhase!=="waiting";}
  get cannonSceneOrigin():THREE.Vector3 {return this.position;}
  get cannonSceneGoal():THREE.Vector3|undefined {return this.goal?.position;}
  get vehicleMode():string {return this.mode;}
  get travelled():number {return this.distance;}

  attach(obj:LevelObjectData,mesh:THREE.Object3D,solids:THREE.Mesh[]=[]):void {
    const action=obj.properties?.covadongaAction;if(!action) return;
    const actor:Actor={obj,mesh};this.actors.push(actor);
    if(["bus","cart","cannon"].includes(String(action))) {
      this.vehicle=actor;this.position.copy(obj.position);this.heading=obj.rotation.y;
      if(action==="cart") this.distance=4;
      if(action==="cannon") {
        this.guide=new THREE.Line(new THREE.BufferGeometry().setAttribute("position",new THREE.BufferAttribute(new Float32Array(49*3),3)),
          new THREE.LineDashedMaterial({color:0xf3d879,dashSize:1.5,gapSize:1,transparent:true,opacity:.75,depthWrite:false}));
        this.guide.name="cov-cannon-trajectory";this.guide.visible=false;mesh.parent?.add(this.guide);
      }
    }
    if(action==="fountain" && solids.length) {
      mesh.updateWorldMatrix(true,true);const inverse=mesh.matrixWorld.clone().invert();
      const owners=new Map<THREE.Object3D,RAPIER.RigidBody>();actor.rotatingBodies=[];
      for(const solid of solids) {
        const geometry=solid.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,solid.matrixWorld)).scale(mesh.scale.x,mesh.scale.y,mesh.scale.z);
        const vertices=geometry.getAttribute("position").array as Float32Array;
        const indices=geometry.index ? new Uint32Array(geometry.index.array):Uint32Array.from({length:vertices.length/3},(_,i)=>i);
        const owner=solid.parent??mesh,body=owners.get(owner);
        if(body) this.physics.addTrimeshColliderToBody(body,vertices,indices,.55,.02);
        else {
          const created=this.physics.createKinematicTrimesh(obj.position,vertices,indices,.02,.55,mesh.quaternion)?.body;
          if(created) {owners.set(owner,created);actor.rotatingBodies.push({mesh:owner,body:created});}
        }
        geometry.dispose();
      }
    }
  }

  attachGoal(obj:LevelObjectData,goal:ActiveGoal):void {
    this.goal=goal;
    if(obj.properties?.covadongaAction==="cannonGoal") {
      goal.mesh.scale.copy(obj.scale);goal.mesh.updateWorldMatrix(true,true);
      const q=goal.mesh.quaternion;
      for(const [x,y,hx,hy,hz] of [[-6.8,6.36,.88,6.36,.88],[6.8,6.36,.88,6.36,.88],[0,13.6,7.8,.88,.88]]) {
        this.physics.createBoxCollider({x:obj.position.x+x,y:obj.position.y+y,z:obj.position.z},q,{x:hx,y:hy,z:hz},.6,.1);
      }
    }
  }
  animate(time:number,physical=true):void {
    if(time===this.animationTime && (!physical || this.animationPhysical)) return;
    this.animationTime=time;this.animationPhysical=physical;
    for(const actor of this.actors) {
      if(actor===this.vehicle) continue;
      previewCovadongaActor(actor.obj,actor.mesh,time);actor.mesh.updateMatrixWorld(true);
      if(actor.obj.properties?.covadongaAction==="cow" && this.path) {
        const ground=sampleSellaRiver(this.path.points,actor.mesh.position,[],actor.groundHint??-1,this.frames,this.width);
        if(ground) {actor.groundHint=ground.segment;if(ground.distance<this.width/2) actor.mesh.position.y=ground.y;}
      }
      if(actor.body && physical) actor.body.setNextKinematicRotation(actor.mesh.quaternion);
      if(physical) for(const part of actor.rotatingBodies??[]) part.body.setNextKinematicRotation(part.mesh.getWorldQuaternion(new THREE.Quaternion()));
    }
  }

  update(delta:number,input:InputAxis,player:Player):CovadongaMotion|undefined {
    if(this.stopped) return this.mode==="foot" ? undefined:this.motion(player);
    this.time+=delta;this.animate(this.time);
    if(this.broken) return this.motion(player,true);
    if(this.mode==="foot") {
      const p=player.getPosition();
      if(this.time-this.footHitAt>.85) for(const actor of this.actors) if(actor.obj.properties?.covadongaAction==="cow") {
        if(Math.abs(p.y-actor.mesh.position.y)<3 && p.distanceToSquared(actor.mesh.position.clone().add(new THREE.Vector3(0,1,0)))<9) {
          const side=actor.mesh.position.x>p.x ? -1:1;
          player.setLinearVelocity({x:side*22,y:6,z:-2});this.footHitAt=this.time;break;
        }
      }
      return undefined;
    }
    if(!this.vehicle) return undefined;
    if(this.cannonPhase==="flight") return this.updateFlight(delta,player);
    if(!player.isInVehicle()) {
      const p=player.getPosition();
      if(this.data.properties?.boardAtSpawn || (p.distanceToSquared(this.position.clone().add(new THREE.Vector3(0,1,0)))<16)) {
        this.passenger=player;player.setVehicleMounted(true);this.boardedAt=this.time;
        if(this.mode==="cannon") this.cannonPhase="aim";
      } else return undefined;
    }
    if(this.mode==="bus") return this.updateBus(delta,input,player);
    if(this.mode==="cart") return this.updateCart(delta,input,player);
    return this.updateCannon(delta,input,player);
  }

  private updateBus(delta:number,input:InputAxis,player:Player):CovadongaMotion {
    if(!this.path || !this.vehicle) return this.fail(player);
    const previous=this.position.clone();
    if(this.falling>0) {
      this.falling+=delta;this.velocity.y-=18*delta;this.position.addScaledVector(this.velocity,delta);
      this.pose(player,1.9);return this.motion(player,this.falling>.9);
    }
    const throttle=input.vertical,steer=input.horizontal;
    if(throttle>0) this.speed=Math.min(12,this.speed+4.2*throttle*delta);
    else if(throttle<0) this.speed=Math.max(-3,this.speed+6*throttle*delta);
    else this.speed*=Math.exp(-.32*delta);
    this.heading-=steer*.95*(.18+.82*Math.min(1,Math.abs(this.speed)/5))*Math.sign(this.speed||1)*delta;
    this.position.x-=Math.sin(this.heading)*this.speed*delta;this.position.z-=Math.cos(this.heading)*this.speed*delta;
    const sample=sampleSellaRiver(this.path.points,this.position,[],this.hint,this.frames,this.width);
    if(!sample) return this.fail(player);this.hint=sample.segment;
    this.distance=this.path.arc[sample.segment]+(this.path.arc[sample.segment+1]-this.path.arc[sample.segment])*sample.t;
    const margin=this.width/2-1.3;
    if(sample.side < -margin) {
      const pose=this.path.at(this.distance,-margin);this.position.x=pose.position.x;this.position.z=pose.position.z;this.speed*=.65;
    }
    if(sample.side>margin+.25 || sample.distance>this.width/2+1) {this.falling=delta;this.velocity.copy(this.position).sub(previous).divideScalar(delta);}
    else this.position.y=sample.y;
    this.vehicle.mesh.rotation.set(Math.atan(sample.dy*(-Math.sin(this.heading)*sample.dx-Math.cos(this.heading)*sample.dz)),this.heading,0,"YXZ");
    this.velocity.copy(this.position).sub(previous).divideScalar(delta);
    for(const actor of this.actors) if(["rock","cow"].includes(String(actor.obj.properties?.covadongaAction))) {
      const q=actor.mesh.position.clone().sub(this.position),c=Math.cos(this.heading),s=Math.sin(this.heading);
      const x=q.x*c-q.z*s,z=q.x*s+q.z*c,r=actor.obj.properties?.covadongaAction==="cow" ? 1.25:Math.max(actor.obj.scale.x,actor.obj.scale.z);
      if(Math.abs(q.y)<3.5 && Math.abs(x)<1.25+r && Math.abs(z)<2.8+r) return this.fail(player);
    }
    this.pose(player,1.9);
    for(const wheel of this.vehicle.mesh.children.filter(c=>c.name==="cov-wheel")) wheel.rotation.x+=this.speed*delta/.58;
    if(this.distance>this.path.length-9 && this.time-this.boardedAt>=Number(this.data.properties?.minimumTravelTime??0)) this.finishRequested=true;
    return this.motion(player);
  }

  private updateCart(delta:number,input:InputAxis,player:Player):CovadongaMotion {
    if(!this.path || !this.vehicle) return this.fail(player);
    const age=this.time-this.boardedAt;
    const completed=(index:number)=>this.junctions[index] && this.distance>=this.junctions[index].start+this.junctions[index].length;
    const multiplier=completed(6) ? 3:completed(3) ? 2:1;
    const target=age<10 ? 4:THREE.MathUtils.lerp(4,23*multiplier,THREE.MathUtils.smoothstep(age,10,11.4));
    this.speed=age<=11.4 ? target:Math.min(target,this.speed+30*delta);
    this.distance=Math.min(this.path.length-4,this.distance+this.speed*delta);
    this.lateral=THREE.MathUtils.clamp(this.lateral+input.horizontal*2.3*delta,-.85,.85);
    let offset=0,offsetAhead=0;
    for(const [index,j] of this.junctions.entries()) {
      const t=(this.distance-j.start)/j.length;
      if(t<0 || t>1) continue;
      if(!this.decisions.has(index)) this.decisions.set(index,this.lateral>=0 ? 1:-1);
      const choice=this.decisions.get(index)!;
      offset=mineOffset(j,t,choice);offsetAhead=mineOffset(j,Math.min(1,t+2/j.length),choice);
      if(j.blocked===choice && this.distance>=mineRockDistance(j)-2.6) return this.fail(player);
    }
    const p=this.path.at(this.distance,offset),ahead=this.path.at(Math.min(this.path.length,this.distance+2),offsetAhead);
    const previous=this.position.clone();this.position.copy(p.position);this.velocity.copy(this.position).sub(previous).divideScalar(delta);
    this.heading=Math.atan2(this.position.x-ahead.position.x,this.position.z-ahead.position.z);
    this.vehicle.mesh.rotation.set(Math.atan2(ahead.position.y-p.position.y,2),this.heading,Math.sin(this.time*17)*.035*Math.min(1,this.speed/20),"YXZ");
    this.pose(player,1.5,this.lateral);
    if(this.distance>=this.path.length-4.01 && age>=Number(this.data.properties?.minimumTravelTime??60)) this.finishRequested=true;
    return this.motion(player);
  }

  private updateCannon(delta:number,input:InputAxis,player:Player):CovadongaMotion {
    if(!this.vehicle) return this.fail(player);
    this.cannonYaw=THREE.MathUtils.clamp(this.cannonYaw-input.horizontal*.32*delta,-.42,.42);
    this.cannonPitch=THREE.MathUtils.clamp(this.cannonPitch+input.vertical*.22*delta,.08,.62);
    this.heading=this.cannonYaw;
    const barrel=this.vehicle.mesh.getObjectByName("cov-cannon-barrel");if(barrel) barrel.rotation.set(this.cannonPitch,this.cannonYaw,0,"YXZ");
    this.velocity.set(0,0,0);this.pose(player,1.7);
    const direction=cannonVelocity(this.cannonYaw,this.cannonPitch);
    const muzzle=this.position.clone().add(new THREE.Vector3(0,1.7,0)).addScaledVector(direction.clone().normalize(),3.7);
    if(this.guide) {
      this.guide.visible=true;const attribute=this.guide.geometry.getAttribute("position") as THREE.BufferAttribute;
      for(let i=0;i<49;i++) {const p=cannonPosition(muzzle,direction,i/12);attribute.setXYZ(i,p.x,p.y,p.z);}
      attribute.needsUpdate=true;this.guide.computeLineDistances();this.guide.geometry.computeBoundingSphere();
    }
    if(input.action && this.time-this.boardedAt>.3) {
      this.cannonPhase="flight";this.flightTime=0;this.flightOrigin.copy(muzzle);this.flightVelocity.copy(direction);
      player.setVehicleMounted(false);player.teleportTo(muzzle.x,muzzle.y,muzzle.z);player.setLinearVelocity(direction);
      if(this.guide) this.guide.visible=false;
    }
    return this.motion(player);
  }

  private updateFlight(delta:number,player:Player):CovadongaMotion {
    const before=this.flightTime;this.flightTime+=delta;
    const p=cannonPosition(this.flightOrigin,this.flightVelocity,this.flightTime),v=this.flightVelocity.clone();v.y-=18*this.flightTime;
    player.teleportTo(p.x,p.y,p.z);player.setLinearVelocity(v);this.velocity.copy(v);
    if(this.goal) {
      const crossing=(this.goal.position.z-this.flightOrigin.z)/this.flightVelocity.z;
      if(crossing>=before && crossing<=this.flightTime) {
        const hit=cannonPosition(this.flightOrigin,this.flightVelocity,crossing).sub(this.goal.position);
        if(Math.abs(hit.x)<5.68 && hit.y>.4 && hit.y<12.8) this.finishRequested=true;
        else return this.fail(player);
      }
    }
    return this.motion(player,this.flightTime>6 || p.y<-20);
  }
  private pose(player:Player,height:number,lateral=0):void {
    if(this.vehicle) {this.vehicle.mesh.position.copy(this.position);this.vehicle.mesh.updateMatrixWorld(true);}
    this.seat.set(this.position.x+Math.cos(this.heading)*lateral,this.position.y+height,this.position.z-Math.sin(this.heading)*lateral);
    player.setVehiclePose(this.seat,this.velocity);
  }
  private motion(player:Player,fellOut=false):CovadongaMotion {return {position:player.getPosition(),velocity:this.velocity,fellOut};}
  private fail(player:Player):CovadongaMotion {this.broken=true;return this.motion(player,true);}
  stop():void {this.stopped=true;}
  reset():void {
    this.animationTime=NaN;this.animationPhysical=false;
    this.passenger?.setVehicleMounted(false);this.passenger=undefined;this.time=0;this.boardedAt=0;this.speed=0;this.distance=0;this.lateral=0;this.hint=-1;
    this.falling=0;this.footHitAt=-10;this.broken=false;this.finishRequested=false;this.stopped=false;this.decisions.clear();
    this.cannonPhase="waiting";this.cannonYaw=.1;this.cannonPitch=.3;this.flightTime=0;if(this.guide) this.guide.visible=false;
    if(this.vehicle) {this.position.copy(this.vehicle.obj.position);this.heading=this.vehicle.obj.rotation.y;this.vehicle.mesh.position.copy(this.position);this.vehicle.mesh.rotation.set(0,this.heading,0);}
    if(this.mode==="cart") this.distance=4;
    for(const actor of this.actors) {
      actor.mesh.position.copy(actor.obj.position);actor.mesh.rotation.set(actor.obj.rotation.x,actor.obj.rotation.y,actor.obj.rotation.z);
      if(actor.obj.properties?.covadongaAction==="fountain") previewCovadongaActor(actor.obj,actor.mesh,0);
      if(actor.body) actor.body.setRotation(actor.mesh.quaternion,true);
      for(const part of actor.rotatingBodies??[]) {
        const q=part.mesh.getWorldQuaternion(new THREE.Quaternion());part.body.setRotation(q,true);part.body.setNextKinematicRotation(q);
      }
    }
    this.velocity.set(0,0,0);
  }
  destroy():void {
    // Fountain bodies are registered with PhysicsWorld and released once by clearStageColliders.
    this.guide?.removeFromParent();this.guide?.geometry.dispose();this.guide?.material.dispose();this.actors.length=0;
  }
}
