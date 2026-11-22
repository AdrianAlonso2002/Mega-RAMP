import * as THREE from 'three';
import type RAPIER from '@dimforge/rapier3d-compat';
import type {LevelData,LevelObjectData} from '../LevelTypes';
import type {PhysicsWorld} from '../../physics/PhysicsWorld';
import type {Player} from '../../player/Player';
import type {ActiveGoal} from '../LevelBuilder';
import {previewOxfordActor,createOxfordSkyGoal} from './OxfordModels';
import {strawPose,buzzPosition,OXFORD_BEAR_RATE,milkRingSpeed} from './OxfordRoutes';
import type {InputAxis} from '../../input/InputManager';
interface Actor {obj:LevelObjectData;mesh:THREE.Group;body?:RAPIER.RigidBody;door?:RAPIER.Collider;cooldown:number;tiltX?:number;tiltZ?:number;velocityX?:number;velocityZ?:number;strike?:number;strikeOther?:number}
export interface OxfordMotion {position:THREE.Vector3;velocity:THREE.Vector3;fellOut:boolean}
export class OxfordLevel {
  finishRequested=false;
  failed=false;
  private time=0;
  private stopped=false;
  private launched=false;
  private previousY=0;
  private readonly previousPosition=new THREE.Vector3();
  private readonly actors:Actor[]=[];
  private readonly point=new THREE.Vector3();
  private readonly quaternion=new THREE.Quaternion();
  private readonly controlCamera=new THREE.PerspectiveCamera();
  private readonly idleInput:InputAxis={horizontal:0,vertical:0};
  private readonly milkAnchor=new THREE.Vector3();
  private readonly milkRelativeVelocity=new THREE.Vector3();
  private readonly stickyMotion:OxfordMotion={position:new THREE.Vector3(),velocity:new THREE.Vector3(),fellOut:false};
  private milkSurface?:Actor;
  private milkAttached=false;
  private buzzRider?:Actor;
  private readonly buzzOffset=new THREE.Vector3();
  private readonly buzzRelativeVelocity=new THREE.Vector3();
  private readonly buzzCentre=new THREE.Vector3();
  private readonly buzzCarrierVelocity=new THREE.Vector3();
  private goal?:ActiveGoal;
  constructor(private readonly data:LevelData,private readonly physics:PhysicsWorld) {this.previousY=data.spawn.y;this.previousPosition.copy(data.spawn);}
  get controlsGoal():boolean {return this.data.properties?.oxfordMode==='milkshake'||this.data.properties?.oxfordMode==='train'&&this.time<29;}
  get elapsed():number {return this.time;}
  attach(obj:LevelObjectData,mesh:THREE.Group,solids:THREE.Mesh[]):boolean {
    const action=obj.properties?.oxfordAction;if(!action) return false;
    const actor:Actor={obj,mesh,cooldown:-10};this.actors.push(actor);
    if(action==='ring'&&Number(obj.properties?.index??0)===0) this.milkSurface=actor;
    if(action==='buzz'&&obj.properties?.hasCollision===true) {
      const scale=obj.scale.x,made=this.physics.createKinematicSphere(mesh.position,6*scale,.9);actor.body=made?.body;
      if(actor.body) {
        this.physics.addCylinderColliderToBody(actor.body,{x:0,y:6*scale,z:0},2.7*scale,.225*scale);
        this.physics.addCylinderColliderToBody(actor.body,{x:0,y:6.3*scale,z:0},2.2*scale,.06*scale);
      }
      return true;
    }
    if(obj.properties?.hasCollision===true) {
      mesh.updateWorldMatrix(true,true);const inverse=mesh.matrixWorld.clone().invert(),scale=mesh.getWorldScale(new THREE.Vector3());
      for(const solid of solids) {
        const geometry=solid.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,solid.matrixWorld)).scale(scale.x,scale.y,scale.z);
        const vertices=geometry.getAttribute('position').array as Float32Array,indices=geometry.index ? new Uint32Array(geometry.index.array):Uint32Array.from({length:vertices.length/3},(_,i)=>i);
        if(!actor.body) actor.body=this.physics.createKinematicTrimesh(mesh.position,vertices,indices,.04,.75,mesh.quaternion)?.body;
        else this.physics.addTrimeshColliderToBody(actor.body,vertices,indices,.75,.04);
        geometry.dispose();
      }
      if(action==='destination'&&actor.body) actor.door=this.physics.addBoxColliderToBody(actor.body,{x:0,y:2.8,z:18},{x:1.65,y:1.6,z:.15},.75,0)??undefined;
    }
    return true;
  }
  attachGoal(obj:LevelObjectData,goal:ActiveGoal):void {
    this.goal=goal;
    if(obj.properties?.oxfordGoal==='sky') {
      for(const child of goal.mesh.children) child.visible=false;
      goal.mesh.add(createOxfordSkyGoal());
    }
  }
  animatePreview(time:number):void {for(const a of this.actors) previewOxfordActor(a.obj,a.mesh,time);}
  update(delta:number,player:Player,input:InputAxis=this.idleInput,camera:THREE.Camera=this.controlCamera):OxfordMotion|undefined {
    if(this.stopped) return;
    if(this.data.stage===2) player.setFallHeight(-38);
    this.time+=delta;let p=player.getBody()?.translation()??player.getPosition();const oldY=this.previousY;this.previousY=p.y;
    if(this.launched&&this.goal) {
      const dy=p.y-this.previousPosition.y,t=Math.abs(dy)>1e-6 ? (this.goal.position.y-this.previousPosition.y)/dy:-1;
      if(t>=0&&t<=1) {
        const x=THREE.MathUtils.lerp(this.previousPosition.x,p.x,t),z=THREE.MathUtils.lerp(this.previousPosition.z,p.z,t);
        if(Math.hypot(x-this.goal.position.x,z-this.goal.position.z)<3.98) this.finishRequested=true;
      }
    }
    this.previousPosition.copy(p);
    if(this.launched&&p.y<13.8&&oldY>p.y) this.launched=false;
    const supported=this.holdMilkSurface(delta,player,input,camera)||this.holdBuzzCap(delta,player,input,camera);
    if(supported) p=player.getBody()!.translation();
    for(const actor of this.actors) {
      const action=actor.obj.properties?.oxfordAction,index=Number(actor.obj.properties?.index??0);
      previewOxfordActor(actor.obj,actor.mesh,this.time);
      if(action==='table') {
        const local=actor.mesh.worldToLocal(this.point.copy(p)),loaded=Math.abs(local.z)<8&&Math.abs(local.x)<3.6&&local.y>.25&&local.y<2.1;
        const targetX=loaded ? THREE.MathUtils.clamp(local.z*.025,-.18,.18):0,targetZ=loaded ? THREE.MathUtils.clamp(-local.x*.1,-.32,.32):0;
        const dt=Math.min(delta,.05);
        actor.velocityX=((actor.velocityX??0)+(targetX-(actor.tiltX??0))*9*dt)*Math.exp(-3.2*dt);
        actor.velocityZ=((actor.velocityZ??0)+(targetZ-(actor.tiltZ??0))*9*dt)*Math.exp(-3.2*dt);
        actor.tiltX=THREE.MathUtils.clamp((actor.tiltX??0)+actor.velocityX*dt,-.28,.28);actor.tiltZ=THREE.MathUtils.clamp((actor.tiltZ??0)+actor.velocityZ*dt,-.45,.45);
        actor.mesh.rotation.x=actor.obj.rotation.x+actor.tiltX;actor.mesh.rotation.z=actor.obj.rotation.z+actor.tiltZ;
      }
      if(actor.body) {actor.mesh.getWorldQuaternion(this.quaternion);actor.body.setNextKinematicTranslation(actor.mesh.position);actor.body.setNextKinematicRotation(this.quaternion);}
      if(actor.door) actor.door.setEnabled(this.time<29);
      if(action==='traffic') {
        const local=actor.mesh.worldToLocal(this.point.copy(p));
        if(Math.abs(local.x)<2.2&&Math.abs(local.z)<18.7&&local.y>.25&&local.y<4.65) this.failed=true;
      }
      if(action==='magnet'&&this.time-actor.cooldown>1.25) {
        if(Math.abs(p.x-actor.mesh.position.x)<2.4&&Math.abs(p.z-actor.mesh.position.z)<1.9&&actor.mesh.position.y-p.y<1.7&&actor.mesh.position.y>p.y-.5) {
          actor.cooldown=this.time;player.setLinearVelocity({x:index%2 ? -17:17,y:10,z:-2});
        }
      }
      if(action==='bear') {
        for(const side of [-1,1]) {
        const key=side<0 ? 'strike':'strikeOther',strike=Math.floor((this.time*OXFORD_BEAR_RATE+index*1.2+side-Math.asin(.65))/(Math.PI*2));
        if(actor[key]===undefined) actor[key]=Math.floor((index*1.2+side-Math.asin(.65))/(Math.PI*2));
        if(strike>actor[key]!) {
          actor[key]=strike;
          const table=this.actors.find(a=>a.obj.properties?.oxfordAction==='table'&&Number(a.obj.properties.index)===index);
          if(table) {table.velocityZ=(table.velocityZ??0)+(actor.mesh.position.x>table.mesh.position.x ? -1.9:1.9);table.velocityX=(table.velocityX??0)+.48;}
          if(Math.abs(p.z-actor.mesh.position.z)<3.5&&Math.abs(p.x-actor.mesh.position.x)<6.4) {const v=player.linvel();player.setLinearVelocity({x:actor.mesh.position.x>0 ? -11:11,y:Math.max(v.y,4),z:v.z*.5});}
        }
        }
      }
      if(action==='straw'&&!this.launched&&Math.hypot(p.x-actor.mesh.position.x,p.z-actor.mesh.position.z)<1.2&&p.y>11.5&&p.y<14.5) {
        this.launched=true;const pose=strawPose(this.time),speed=29;
        player.teleportTo(actor.mesh.position.x,13.1,actor.mesh.position.z);player.setLinearVelocity({x:-Math.sin(pose.tilt)*speed,y:Math.cos(pose.tilt)*speed,z:0});
        this.previousY=13.1;
        this.previousPosition.set(actor.mesh.position.x,13.1,actor.mesh.position.z);
        this.milkAttached=false;
      }
    }
    if(this.failed) return {position:player.getPosition(),velocity:new THREE.Vector3(),fellOut:true};
    if(supported) {this.stickyMotion.position.copy(player.getPosition());this.stickyMotion.velocity.copy(player.linvel());return this.stickyMotion;}
    return;
  }
  private holdBuzzCap(delta:number,player:Player,input:InputAxis,camera:THREE.Camera):boolean {
    const p=player.getBody()?.translation()??player.getPosition(),dt=Math.min(delta,.05);
    if(this.buzzRider) {
      const old=this.buzzRider.mesh.position;
      if(Math.hypot(p.x-old.x-this.buzzOffset.x,p.z-old.z-this.buzzOffset.z)>1.5||Math.abs(p.y-old.y-6.36*this.buzzRider.obj.scale.x-player.radius)>.8) this.buzzRider=undefined;
    }
    if(!this.buzzRider) {
      const actor=this.actors.find(a=>a.obj.properties?.oxfordAction==='buzz'&&Math.hypot(p.x-a.mesh.position.x,p.z-a.mesh.position.z)<2.1*a.obj.scale.x&&
        p.y-a.mesh.position.y>6.36*a.obj.scale.x+player.radius-.15&&p.y-a.mesh.position.y<6.36*a.obj.scale.x+player.radius+.4&&Math.abs(player.linvel().y-(a.body?.linvel().y??0))<2);
      if(!actor) return false;
      this.buzzRider=actor;this.buzzOffset.set(p.x-actor.mesh.position.x,0,p.z-actor.mesh.position.z);this.buzzRelativeVelocity.set(0,0,0);
    }
    const actor=this.buzzRider,scale=actor.obj.scale.x;
    this.buzzCentre.copy(buzzPosition(this.time,Number(actor.obj.properties?.index??0)));this.buzzCentre.x+=actor.obj.position.x;this.buzzCentre.y+=actor.obj.position.y-7;this.buzzCentre.z+=actor.obj.position.z;
    this.buzzCarrierVelocity.copy(this.buzzCentre).sub(actor.mesh.position).divideScalar(Math.max(delta,.00001));
    player.teleportTo(this.buzzCentre.x+this.buzzOffset.x,this.buzzCentre.y+6.36*scale+player.radius+.03,this.buzzCentre.z+this.buzzOffset.z);
    this.buzzRelativeVelocity.multiplyScalar(Math.exp(-dt*1.5));player.setLinearVelocity(this.buzzRelativeVelocity);player.update(dt,input,camera);
    this.buzzRelativeVelocity.copy(player.linvel());this.buzzRelativeVelocity.y=0;this.buzzOffset.addScaledVector(this.buzzRelativeVelocity,dt);
    player.teleportTo(this.buzzCentre.x+this.buzzOffset.x,this.buzzCentre.y+6.36*scale+player.radius+.03,this.buzzCentre.z+this.buzzOffset.z);
    if(Math.hypot(this.buzzOffset.x,this.buzzOffset.z)>2.2*scale) this.buzzRider=undefined;
    this.stickyMotion.velocity.copy(this.buzzCarrierVelocity).add(this.buzzRelativeVelocity);player.setLinearVelocity(this.stickyMotion.velocity);
    return true;
  }
  /** Carry position with the liquid, while applying the usual controls in its moving frame.
   * Contact impulses cannot turn the ring's tangential speed into a centrifugal launch. */
  private holdMilkSurface(delta:number,player:Player,input:InputAxis,camera:THREE.Camera):boolean {
    const surface=this.milkSurface;
    if(!surface||this.launched) {this.milkAttached=false;return false;}
    const centre=surface.obj.position,scale=surface.obj.scale.x,dt=Math.min(delta,.05),bodyPosition=player.getBody()?.translation()??player.getPosition();
    if(!this.milkAttached) {
      const radius=Math.hypot(bodyPosition.x-centre.x,bodyPosition.z-centre.z)/scale;
      if(radius>=17||bodyPosition.y<centre.y+.4||bodyPosition.y>centre.y+1.4||player.linvel().y>4) return false;
      this.milkAnchor.copy(bodyPosition);this.milkRelativeVelocity.set(0,0,0);
      this.milkAttached=true;
    }
    const x=this.milkAnchor.x-centre.x,z=this.milkAnchor.z-centre.z,radius=Math.hypot(x,z)/scale,index=Math.min(3,Math.floor(radius/4.25)),omega=milkRingSpeed(index),angle=omega*dt,c=Math.cos(angle),s=Math.sin(angle);
    this.milkAnchor.set(centre.x+c*x+s*z,centre.y+player.radius+.03,centre.z-s*x+c*z);
    const vx=this.milkRelativeVelocity.x,vz=this.milkRelativeVelocity.z;
    this.milkRelativeVelocity.set(c*vx+s*vz,0,-s*vx+c*vz);
    this.milkRelativeVelocity.multiplyScalar(Math.exp(-dt*(Math.hypot(input.horizontal,input.vertical)<.03 ? 4.5:.8)));
    player.teleportTo(this.milkAnchor.x,this.milkAnchor.y,this.milkAnchor.z);player.setLinearVelocity(this.milkRelativeVelocity);
    player.update(dt,input,camera);this.milkRelativeVelocity.copy(player.linvel());this.milkRelativeVelocity.y=0;
    this.milkAnchor.addScaledVector(this.milkRelativeVelocity,dt);
    player.teleportTo(this.milkAnchor.x,this.milkAnchor.y,this.milkAnchor.z);
    if(Math.hypot(this.milkAnchor.x-centre.x,this.milkAnchor.z-centre.z)>=17*scale) {
      this.milkAttached=false;player.setLinearVelocity(this.milkRelativeVelocity);
    } else {
      this.stickyMotion.velocity.set(this.milkRelativeVelocity.x+omega*(this.milkAnchor.z-centre.z),0,this.milkRelativeVelocity.z-omega*(this.milkAnchor.x-centre.x));
      player.setLinearVelocity(this.stickyMotion.velocity);
    }
    return true;
  }
  stop():void {this.stopped=true;}
  reset():void {
    this.time=0;this.failed=false;this.finishRequested=false;this.stopped=false;this.launched=false;this.previousY=this.data.spawn.y;
    this.previousPosition.copy(this.data.spawn);
    this.milkAttached=false;this.milkRelativeVelocity.set(0,0,0);
    this.buzzRider=undefined;this.buzzRelativeVelocity.set(0,0,0);
    for(const a of this.actors) {
      a.cooldown=-10;a.tiltX=0;a.tiltZ=0;a.velocityX=0;a.velocityZ=0;a.strike=undefined;a.strikeOther=undefined;a.mesh.position.copy(a.obj.position);a.mesh.rotation.set(a.obj.rotation.x,a.obj.rotation.y,a.obj.rotation.z,'YXZ');previewOxfordActor(a.obj,a.mesh,0);
      a.body?.setTranslation(a.mesh.position,true);a.body?.setRotation(a.mesh.quaternion,true);a.body?.setNextKinematicTranslation(a.mesh.position);a.body?.setNextKinematicRotation(a.mesh.quaternion);a.door?.setEnabled(true);
    }
  }
  destroy():void {this.actors.length=0;}
}
