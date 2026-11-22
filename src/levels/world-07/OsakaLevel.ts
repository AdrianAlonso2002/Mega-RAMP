import * as THREE from 'three';
import type RAPIER from '@dimforge/rapier3d-compat';
import type {LevelObjectData} from '../LevelTypes';
import type {PhysicsWorld} from '../../physics/PhysicsWorld';
import type {Player} from '../../player/Player';
import {previewOsakaModel} from './OsakaModels';
import {osakaBladePose} from './OsakaRoutes';
interface Actor {obj:LevelObjectData;group:THREE.Group;owner:THREE.Object3D;body?:RAPIER.RigidBody;cooldown:number}
/** Fixed collision geometry is uploaded once; only kinematic transforms move during play. */
export class OsakaLevel {
  private time=0;private stopped=false;private readonly actors:Actor[]=[];
  private readonly position=new THREE.Vector3();private readonly rotation=new THREE.Quaternion();
  private readonly contactPoint=new THREE.Vector3();private readonly kickDirection=new THREE.Vector3();
  constructor(private readonly physics:PhysicsWorld){}
  get elapsed():number{return this.time;}
  attach(obj:LevelObjectData,group:THREE.Group,meshes:THREE.Mesh[]):boolean {
    const action=obj.properties?.osakaAction;
    if(!action||obj.properties?.hasCollision!==true){if(action||['osaka_sushi_belt','osaka_ramen_stall'].includes(String(obj.properties?.subType)))this.actors.push({obj,group,owner:group,cooldown:-10});return false;}
    const owner=action==='blade'?group.getObjectByName('osaka-ninja-edge')!:group;
    owner.updateWorldMatrix(true,true);const inverse=owner.matrixWorld.clone().invert();let body:RAPIER.RigidBody|undefined;
    for(const mesh of meshes) {
      if(action==='blade'&&mesh.parent!==owner) {
        mesh.updateWorldMatrix(true,false);const geo=mesh.geometry.clone().applyMatrix4(mesh.matrixWorld),positions=new Float32Array(geo.getAttribute('position').array),indices=geo.index?new Uint32Array(geo.index.array):Uint32Array.from({length:positions.length/3},(_,i)=>i);
        this.physics.createTrimeshCollider(positions,indices,.01,.8);geo.dispose();continue;
      }
      const geo=mesh.geometry.clone().applyMatrix4(inverse.clone().multiply(mesh.matrixWorld)),positions=new Float32Array(geo.getAttribute('position').array),indices=geo.index?new Uint32Array(geo.index.array):Uint32Array.from({length:positions.length/3},(_,i)=>i);
      if(body)this.physics.addTrimeshColliderToBody(body,positions,indices,.85,.01);
      else body=this.physics.createKinematicTrimesh(owner.getWorldPosition(this.position),positions,indices,.01,.85,owner.getWorldQuaternion(this.rotation))?.body;
      geo.dispose();
    }
    this.actors.push({obj,group,owner,body,cooldown:-10});return true;
  }
  private pose(actor:Actor,immediate=false):void {
    if(!actor.body)return;actor.owner.updateWorldMatrix(true,false);actor.owner.getWorldPosition(this.position);actor.owner.getWorldQuaternion(this.rotation);
    if(immediate){actor.body.setTranslation(this.position,true);actor.body.setRotation(this.rotation,true);}
    actor.body.setNextKinematicTranslation(this.position);actor.body.setNextKinematicRotation(this.rotation);
  }
  update(delta:number,player:Player):void {
    if(this.stopped)return;this.time+=delta;
    for(const actor of this.actors) {
      previewOsakaModel(actor.obj,actor.group,this.time);this.pose(actor);
      if(actor.obj.properties?.osakaAction==='blade'&&osakaBladePose(this.time,Number(actor.obj.properties.index??0)).active&&this.time-actor.cooldown>.8&&actor.body&&player.getBody()) {
        actor.owner.worldToLocal(this.contactPoint.copy(player.getBody()!.translation()));
        const distance=Math.hypot(Math.max(0,Math.abs(this.contactPoint.x)-Number(actor.obj.properties.length??5)/2),Math.max(0,Math.abs(this.contactPoint.y)-.12),Math.max(0,Math.abs(this.contactPoint.z)-.16));
        if(distance<=player.radius+.03||this.physics.hasBodyContact(player.getBody()!,actor.body)) {
          // Resolve out of the thin blade before launching, so the descending solid cannot
          // immediately cancel the knockback by pinning the ball against the floor.
          const side=Math.sign(this.contactPoint.z)||1,velocity=player.linvel(),vx=velocity.x,vz=velocity.z;
          this.contactPoint.z=side*(player.radius+.24);actor.owner.localToWorld(this.contactPoint);
          this.kickDirection.set(0,0,side).applyQuaternion(actor.owner.getWorldQuaternion(this.rotation));
          player.teleportTo(this.contactPoint.x,this.contactPoint.y,this.contactPoint.z);
          player.setLinearVelocity({x:vx+this.kickDirection.x*11,y:7,z:vz+this.kickDirection.z*11});actor.cooldown=this.time;
        }
      }
    }
  }
  stop():void{this.stopped=true;}
  reset():void{this.time=0;this.stopped=false;for(const actor of this.actors){actor.cooldown=-10;previewOsakaModel(actor.obj,actor.group,0);this.pose(actor,true);}}
  destroy():void{this.actors.length=0;}
}
