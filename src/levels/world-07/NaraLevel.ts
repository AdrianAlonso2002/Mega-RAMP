import * as THREE from 'three';
import type RAPIER from '@dimforge/rapier3d-compat';
import type { LevelData, LevelObjectData } from '../LevelTypes';
import type { PhysicsWorld } from '../../physics/PhysicsWorld';
import type { Player } from '../../player/Player';
import type { InputAxis } from '../../input/InputManager';
import { previewNaraModel, poseNaraTrainDoors } from './NaraModels';
import { bowlHeight, naraFloatHeight, naraTrainPose, naraDoorOpen, NARA_DOOR_TIME, NARA_TRAIN_ARRIVAL, NARA_TRAIN_RELEASE } from './NaraRoutes';

interface Actor {
  obj: LevelObjectData;
  group: THREE.Group;
  part?: THREE.Object3D;
  body?: RAPIER.RigidBody;
  doors?: {part:THREE.Object3D;body:RAPIER.RigidBody|undefined}[];
  base: THREE.Vector3;
  cooldown: number;
  angle: number;
  angularSpeed: number;
}
/** Native kinematic bodies and one level clock, with no geometry uploads during play. */
export class NaraLevel {
  private time=0;
  private stopped=false;
  private readonly actors:Actor[]=[];
  private readonly temp=new THREE.Vector3();
  private readonly worldPosition=new THREE.Vector3();
  private readonly quaternion=new THREE.Quaternion();
  private passenger?: Player;
  private released=false;
  private trainClock=-1;
  private readonly trainSeat=new THREE.Vector3();
  private stickyBowl?:Actor;
  private readonly stickyAnchor=new THREE.Vector3();
  private readonly stickyVelocity=new THREE.Vector3();
  private readonly stickyMotion={position:new THREE.Vector3(),velocity:new THREE.Vector3(),fellOut:false};
  private readonly idleInput:InputAxis={horizontal:0,vertical:0};
  private readonly controlCamera=new THREE.PerspectiveCamera();
  constructor(private readonly data:LevelData,private readonly physics:PhysicsWorld) {}
  private get trainStage():boolean{return this.data.level===2&&this.data.stage===1;}
  get elapsed():number{return this.time;}
  get trainArrived():boolean{return !this.trainStage||this.trainClock>=NARA_TRAIN_ARRIVAL;}
  get trainBoarded():boolean{return this.trainClock>=0;}
  get trainCameraTarget():THREE.Vector3|null{return this.trainStage?this.actors.find(a=>a.obj.properties?.naraAction==='train')?.group.position??null:null;}

  private bodyFor(owner:THREE.Object3D,meshes:THREE.Mesh[]):RAPIER.RigidBody|undefined {
    owner.updateWorldMatrix(true,true);
    const inverse=owner.matrixWorld.clone().invert();let body:RAPIER.RigidBody|undefined;
    for(const mesh of meshes) {
      const geometry=mesh.geometry.clone().applyMatrix4(inverse.clone().multiply(mesh.matrixWorld));
      const vertices=new Float32Array(geometry.getAttribute('position').array),indices=geometry.index?new Uint32Array(geometry.index.array):Uint32Array.from({length:vertices.length/3},(_,i)=>i);
      if(body)this.physics.addTrimeshColliderToBody(body,vertices,indices,.8,.01);
      else body=this.physics.createKinematicTrimesh(owner.getWorldPosition(this.worldPosition),vertices,indices,.01,.8,owner.getWorldQuaternion(this.quaternion))?.body;
      geometry.dispose();
    }
    return body;
  }
  attach(obj:LevelObjectData,group:THREE.Group,meshes:THREE.Mesh[]):boolean {
    const kind=String(obj.properties?.subType??'');
    if(kind==='nara_path')return false;
    const actor:Actor={obj,group,base:group.position.clone(),cooldown:-10,angle:0,angularSpeed:0};this.actors.push(actor);
    const action=obj.properties?.naraAction;
    if(action==='train') {
      actor.body=this.bodyFor(group,meshes);actor.doors=[];
      group.traverse(part=>{if(part.userData.trainDoorDirection!==undefined)actor.doors!.push({part,body:this.physics.createKinematicBox(part.getWorldPosition(this.worldPosition),part.getWorldQuaternion(this.quaternion),{x:.12,y:1.85,z:1.5},.7,.01,{x:0,y:1.85,z:0})?.body});});
      this.poseTrain(actor,true);return true;
    }
    if(action==='seesaw'||action==='float'||action==='bowl'){actor.body=this.bodyFor(group,meshes);return true;}
    if(action==='rotor') {
      actor.part=group.getObjectByName('nara-sweep-arm');
      if(actor.part)actor.body=this.physics.createKinematicBox(actor.part.getWorldPosition(this.worldPosition),actor.part.getWorldQuaternion(this.quaternion),{x:Number(obj.properties?.length??8)/2,y:.18,z:.24},.5,.05)?.body;
      return false; // The fixed pillar is collidable too, separately from its sweeping arm.
    }
    return false;
  }
  private poseTrain(actor:Actor,immediate=false):void {
    const pose=naraTrainPose(this.trainClock-NARA_DOOR_TIME);actor.group.position.copy(actor.base);actor.group.position.z+=pose.z;
    poseNaraTrainDoors(actor.group,naraDoorOpen(this.trainClock));
    actor.group.updateWorldMatrix(true,true);
    this.poseBody(actor.body,actor.group,immediate);
    for(const door of actor.doors??[])this.poseBody(door.body,door.part,immediate);
  }
  private poseBody(body:RAPIER.RigidBody|undefined,owner:THREE.Object3D,immediate=false):void {
    if(!body)return;owner.updateWorldMatrix(true,false);owner.getWorldPosition(this.worldPosition);owner.getWorldQuaternion(this.quaternion);
    if(immediate){body.setTranslation(this.worldPosition,true);body.setRotation(this.quaternion,true);}
    body.setNextKinematicTranslation(this.worldPosition);body.setNextKinematicRotation(this.quaternion);
  }
  update(delta:number,player:Player,input:InputAxis=this.idleInput,camera:THREE.Camera=this.controlCamera):{position:THREE.Vector3;velocity:THREE.Vector3;fellOut:boolean}|undefined {
    if(this.stopped)return;
    this.time+=delta;
    const position=player.getPosition();
    if(this.trainStage&&!this.released) {
      if(this.trainClock<0) {
        const train=this.actors.find(a=>a.obj.properties?.naraAction==='train');
        if(train){train.group.worldToLocal(this.temp.copy(position));if(Math.abs(this.temp.x)<2.1&&Math.abs(this.temp.z-1.5)<2.25&&this.temp.y>.35&&this.temp.y<1.9){this.trainClock=0;this.trainSeat.set(1.4,1.05,1.5);}}
      }else this.trainClock+=delta;
    }
    for(const actor of this.actors) {
      const action=actor.obj.properties?.naraAction;
      previewNaraModel(actor.obj,actor.group,this.time);
      if(action==='train'){this.poseTrain(actor);continue;}
      if(action==='seesaw') {
        actor.group.worldToLocal(this.temp.copy(position));
        const occupied=Math.abs(this.temp.x)<14.8&&Math.abs(this.temp.z)<2.8&&this.temp.y>-.1&&this.temp.y<2.3;
        const target=occupied?THREE.MathUtils.clamp(-this.temp.x*.036,-.4,.4):Math.sin(this.time*.9)*.11;
        // Substeps make weight response stable after slow frames, without changing the collision shape.
        let remaining=Math.min(delta,.12);while(remaining>0){const dt=Math.min(remaining,1/120);actor.angularSpeed+=(target-actor.angle)*15*dt;actor.angularSpeed*=Math.exp(-1.65*dt);actor.angle=THREE.MathUtils.clamp(actor.angle+actor.angularSpeed*dt,-.43,.43);remaining-=dt;}
        actor.group.rotation.z=actor.angle;this.poseBody(actor.body,actor.group);
      }
      if(action==='float') {
        // The editor preview and the native collider share the exact same pose.
        const index=Number(actor.obj.properties?.index??Math.round(Number(actor.obj.properties?.phase??0)/.8));
        actor.group.position.y=actor.base.y+naraFloatHeight(this.time,index);this.poseBody(actor.body,actor.group);
      }
      if(action==='bowl') {
        this.poseBody(actor.body,actor.group);
      }
      if(action==='rotor'&&actor.part) {
        this.poseBody(actor.body,actor.part);
        if(this.time-actor.cooldown>.85&&actor.body&&player.getBody()&&this.physics.hasBodyContact(player.getBody()!,actor.body)) {
          const velocity=player.linvel();player.setLinearVelocity({x:velocity.x+Math.cos(this.time)*7,y:3.5,z:velocity.z+Math.sin(this.time)*7});actor.cooldown=this.time;
        }
      }
      if(action==='jump'&&this.time-actor.cooldown>1.1) {
        actor.group.worldToLocal(this.temp.copy(position));
        if(Math.abs(this.temp.x)<Number(actor.obj.properties?.width??6)/2&&Math.abs(this.temp.z)<1&&this.temp.y>.2&&this.temp.y<1.7) {
          const speed=Number(actor.obj.properties?.velocity??16.5),targetX=Number(actor.obj.properties?.targetX??position.x);
          const dx=Number(actor.obj.properties?.directionX??0),dz=Number(actor.obj.properties?.directionZ??-1);
          player.setLinearVelocity({x:dx*speed+(dx===0?THREE.MathUtils.clamp((targetX-position.x)*1.4,-4,4):0),y:Number(actor.obj.properties?.launchY??8.7),z:dz*speed});actor.cooldown=this.time;
        }
      }
    }
    if(this.trainStage&&!this.released) {
      this.passenger=player;
      if(this.trainClock<0)return undefined;
      const pose=naraTrainPose(this.trainClock-NARA_DOOR_TIME);
      const train=this.actors.find(a=>a.obj.properties?.naraAction==='train');
      if(this.trainClock<NARA_TRAIN_RELEASE&&train) {
        if(!player.isInVehicle())player.setVehicleMounted(true);
        this.temp.copy(this.trainSeat).add(train.group.position);
        player.setVehiclePose(this.temp,{x:0,y:0,z:pose.speed});
        return {position:player.getPosition(),velocity:player.getVelocity(),fellOut:false};
      }
      this.released=true;player.setVehicleMounted(false);if(train)player.teleportTo(train.group.position.x+this.trainSeat.x,train.group.position.y+this.trainSeat.y,train.group.position.z+this.trainSeat.z);
    }
    if(this.holdBowl(delta,player,input,camera))return this.stickyMotion;
    return undefined;
  }
  /** Batido's moving-frame controls, projected onto a concave surface instead of a flat ring. */
  private holdBowl(delta:number,player:Player,input:InputAxis,camera:THREE.Camera):boolean {
    const p=player.getBody()?.translation()??player.getPosition(),dt=Math.min(delta,.05);
    if(this.stickyBowl&&(Math.hypot(p.x-this.stickyAnchor.x,p.z-this.stickyAnchor.z)>2||Math.abs(p.y-this.stickyAnchor.y)>2))this.stickyBowl=undefined;
    if(!this.stickyBowl)for(const actor of this.actors) {
      if(actor.obj.properties?.naraAction!=='bowl'||!actor.obj.properties.sticky)continue;
      const radius=Number(actor.obj.properties.radius??7),scale=actor.obj.scale.x;
      const x=(p.x-actor.base.x)/scale,z=(p.z-actor.base.z)/scale;
      if(Math.hypot(x,z)>=radius-.08||Math.abs(p.y-this.bowlSurfaceY(actor,p.x,p.z,player.radius))>.45||player.linvel().y>4)continue;
      this.stickyBowl=actor;this.stickyAnchor.set(p.x,p.y,p.z);this.stickyVelocity.set(0,0,0);break;
    }
    const actor=this.stickyBowl;if(!actor)return false;
    const omega=Number(actor.obj.properties?.spinSpeed??.28),angle=omega*dt,c=Math.cos(angle),s=Math.sin(angle);
    const x=this.stickyAnchor.x-actor.base.x,z=this.stickyAnchor.z-actor.base.z;
    this.stickyAnchor.set(actor.base.x+c*x+s*z,0,actor.base.z-s*x+c*z);
    this.stickyAnchor.y=this.bowlSurfaceY(actor,this.stickyAnchor.x,this.stickyAnchor.z,player.radius);
    const vx=this.stickyVelocity.x,vz=this.stickyVelocity.z;
    this.stickyVelocity.set(c*vx+s*vz,0,-s*vx+c*vz).multiplyScalar(Math.exp(-dt*(Math.hypot(input.horizontal,input.vertical)<.03?4.5:.8)));
    player.teleportTo(this.stickyAnchor.x,this.stickyAnchor.y,this.stickyAnchor.z);player.setLinearVelocity(this.stickyVelocity);
    player.update(dt,input,camera);this.stickyVelocity.copy(player.linvel());this.stickyVelocity.y=0;
    this.stickyAnchor.addScaledVector(this.stickyVelocity,dt);
    this.stickyAnchor.y=this.bowlSurfaceY(actor,this.stickyAnchor.x,this.stickyAnchor.z,player.radius);
    player.teleportTo(this.stickyAnchor.x,this.stickyAnchor.y,this.stickyAnchor.z);
    const r=Math.hypot(this.stickyAnchor.x-actor.base.x,this.stickyAnchor.z-actor.base.z);
    if(r>=Number(actor.obj.properties?.radius??7)*actor.obj.scale.x-.06){this.stickyBowl=undefined;player.setLinearVelocity(this.stickyVelocity);}
    else {
      this.stickyMotion.velocity.set(this.stickyVelocity.x+omega*(this.stickyAnchor.z-actor.base.z),0,this.stickyVelocity.z-omega*(this.stickyAnchor.x-actor.base.x));
      player.setLinearVelocity(this.stickyMotion.velocity);
    }
    this.stickyMotion.position.copy(player.getPosition());this.stickyMotion.velocity.copy(player.linvel());return true;
  }
  private bowlSurfaceY(actor:Actor,x:number,z:number,ballRadius:number):number {
    const scale=actor.obj.scale.x,radius=Number(actor.obj.properties?.radius??7),depth=Number(actor.obj.properties?.depth??2);
    const lx=(x-actor.base.x)/scale,lz=(z-actor.base.z)/scale,slope=2*depth*Math.min(radius,Math.hypot(lx,lz))/(radius*radius);
    return actor.base.y+scale*bowlHeight(radius,depth,lx,lz)+ballRadius*Math.sqrt(1+slope*slope)+.03;
  }
  stop():void{this.stopped=true;}
  reset():void {
    this.stickyBowl=undefined;this.stickyVelocity.set(0,0,0);
    this.passenger?.setVehicleMounted(false);this.passenger=undefined;this.time=0;this.stopped=false;this.released=false;this.trainClock=-1;
    for(const a of this.actors){a.cooldown=-10;a.angle=0;a.angularSpeed=0;a.group.position.copy(a.base);a.group.rotation.set(a.obj.rotation.x,a.obj.rotation.y,a.obj.rotation.z);previewNaraModel(a.obj,a.group,0);if(a.obj.properties?.naraAction==='train')this.poseTrain(a,true);else this.poseBody(a.body,a.part??a.group,true);}
  }
  destroy():void{this.passenger?.setVehicleMounted(false);this.passenger=undefined;this.stickyBowl=undefined;this.actors.length=0;}
}
