import * as THREE from 'three';
import type RAPIER from '@dimforge/rapier3d-compat';
import type {LevelData,LevelObjectData} from '../LevelTypes';
import type {PhysicsWorld} from '../../physics/PhysicsWorld';
import type {Player} from '../../player/Player';
import type {InputAxis} from '../../input/InputManager';
import type {ActiveGoal} from '../LevelBuilder';
import {SpriteTextures} from '../../rendering/SpriteTextures';
import {previewTokyoModel,poseClawCable} from './TokyoModels';
import {clawCycle,tokyoPedestrianPose,CLAW_TRAVEL_LIMIT,pinballHeight,tokyoPulsePose} from './TokyoRoutes';
interface Actor {obj:LevelObjectData;group:THREE.Group;body?:RAPIER.RigidBody;cooldown:number}
interface PrizeBall {body:RAPIER.RigidBody;mesh:THREE.Group;start:THREE.Vector3}
/** Native solids retain their uploaded geometry. Animation changes only rigid transforms. */
export class TokyoLevel {
 private time=0;private stopped=false;private actors:Actor[]=[];private goal?:ActiveGoal;private goalOrigin=new THREE.Vector3();
 private balls:PrizeBall[]=[];private cabinet?:THREE.Group;private initialized=false;private claw?:THREE.Group;private fingers:RAPIER.RigidBody[]=[];private targetMarker?:THREE.Mesh;
 private gantry=new THREE.Vector3(0,27,0);private grabHeight=13.75;private held:PrizeBall|'player'|null=null;private wasClosed=false;private finished=false;private player?:Player;
 private readonly pos=new THREE.Vector3();private readonly quat=new THREE.Quaternion();private readonly velocity=new THREE.Vector3();
 private readonly idle:InputAxis={horizontal:0,vertical:0};private readonly cameraOrigin=new THREE.Vector3(0,15,0);
 constructor(private readonly physics:PhysicsWorld,private readonly data:LevelData){}
 get controlsGoal(){return this.data.stage===2;}
 get finishRequested(){return this.finished;}
 get machineCameraTarget(){return this.data.stage===2?this.cameraOrigin:null;}
 get mechanicHint(){return this.data.stage===2?'Mueve el gancho con WASD o las flechas. Aparta las bolas, recoge la tuya y suéltala en la esquina iluminada.':null;}
 attachGoal(goal:ActiveGoal){this.goal=goal;this.goalOrigin.copy(goal.position);if(this.data.stage===2)goal.mesh.visible=false;}
 attach(obj:LevelObjectData,group:THREE.Group,meshes:THREE.Mesh[]):boolean {
  const kind=String(obj.properties?.subType);if(kind==='tokyo_cabinet')this.cabinet=group;if(kind==='tokyo_claw'){this.claw=group;for(let i=0;i<3;i++){const native=this.physics.createKinematicBox({x:0,y:25,z:0},new THREE.Quaternion(),{x:.11,y:.8,z:.11},.6,.01);if(native)this.fingers.push(native.body);}}
  if(!obj.properties?.tokyoAction)return false;
  const actor:Actor={obj,group,cooldown:-10};
  if(obj.properties.hasCollision===true){group.updateWorldMatrix(true,true);const inverse=new THREE.Matrix4().compose(group.getWorldPosition(this.pos),group.getWorldQuaternion(this.quat),new THREE.Vector3(1,1,1)).invert();for(const mesh of meshes){const geo=mesh.geometry.clone().applyMatrix4(inverse.clone().multiply(mesh.matrixWorld)),vertices=new Float32Array(geo.getAttribute('position').array),indices=geo.index?new Uint32Array(geo.index.array):Uint32Array.from({length:vertices.length/3},(_,i)=>i);if(actor.body)this.physics.addTrimeshColliderToBody(actor.body,vertices,indices,.85,.01);else actor.body=this.physics.createKinematicTrimesh(group.getWorldPosition(this.pos),vertices,indices,.01,.85,group.getWorldQuaternion(this.quat))?.body;geo.dispose();}}
  this.actors.push(actor);return true;
 }
 private initializeBalls(player:Player){
  if(this.initialized||!this.cabinet)return;this.initialized=true;
  const ids=['rony','adri','misi','pao'].filter(id=>id!==player.characterId);
  const geometry=new THREE.SphereGeometry(.9,20,12),materials=ids.map(id=>new THREE.MeshPhongMaterial({map:SpriteTextures.getSphereTexture(id),transparent:true,opacity:.65,shininess:95,specular:0xffffff,depthWrite:false}));
  this.targetMarker=new THREE.Mesh(new THREE.TorusGeometry(.88,.035,6,48),new THREE.MeshBasicMaterial({color:0xffdd89,toneMapped:false}));this.targetMarker.position.copy(player.getPosition());this.cabinet.add(this.targetMarker);
  for(let layer=0;layer<3;layer++)for(let i=0;i<9;i++){
   const x=(i%3-1)*1.85+(layer%2?.3:0),z=(Math.floor(i/3)-1)*1.85,start=new THREE.Vector3(x,12.6+layer*1.65,z),native=this.physics.createBallBody(.9,start);if(!native)continue;
   const mesh=new THREE.Group(),shell=new THREE.Mesh(geometry,materials[(i+layer)%ids.length]);shell.renderOrder=21;mesh.add(shell);const face=new THREE.Sprite(new THREE.SpriteMaterial({map:SpriteTextures.getCharacterTexture(ids[(i+layer)%ids.length],'normal'),depthWrite:false}));face.scale.setScalar(1.55);mesh.add(face);this.cabinet.add(mesh);this.balls.push({body:native.body,mesh,start});
  }
 }
 private release(player:Player){if(this.held==='player'){player.setVehicleMounted(false);player.teleportTo(this.gantry.x,this.gantry.y-2.85,this.gantry.z);}else if(this.held){this.held.body.setEnabled(true);this.held.body.setLinvel({x:0,y:0,z:0},true);}this.held=null;}
 private machine(delta:number,player:Player,input:InputAxis,camera:THREE.Camera){
  this.initializeBalls(player);this.gantry.x=THREE.MathUtils.clamp(this.gantry.x+input.horizontal*7*delta,-CLAW_TRAVEL_LIMIT,CLAW_TRAVEL_LIMIT);this.gantry.z=THREE.MathUtils.clamp(this.gantry.z-input.vertical*7*delta,-CLAW_TRAVEL_LIMIT,CLAW_TRAVEL_LIMIT);
  const cycle=clawCycle(this.time);this.gantry.y=27-cycle.depth*13.25;
  // The first ball below the fingers arrests descent, so buried targets require clearing decoys.
  let candidate:PrizeBall|'player'|null=null,highest=-Infinity;
  const test=(body:RAPIER.RigidBody,owner:PrizeBall|'player')=>{const p=body.translation();if(Math.hypot(p.x-this.gantry.x,p.z-this.gantry.z)<1.2&&p.y>highest&&p.y<25){highest=p.y;candidate=owner;}};
  for(const b of this.balls)if(b!==this.held)test(b.body,b);if(player.getBody()&&this.held!=='player')test(player.getBody()!,'player');
  if(cycle.phase<2.6&&candidate)this.gantry.y=Math.max(this.gantry.y,highest+2.85);
  if(cycle.closed&&!this.wasClosed&&candidate&&Math.abs(highest-(this.gantry.y-2.85))<1.3){this.held=candidate;this.grabHeight=this.gantry.y;if(candidate==='player')player.setVehicleMounted(true,true);else (candidate as PrizeBall).body.setEnabled(false);}
  if(this.held&&cycle.closed)this.gantry.y=this.grabHeight+(27-this.grabHeight)*THREE.MathUtils.clamp((cycle.phase-2.6)/2,0,1);
  if(!cycle.closed&&this.wasClosed)this.release(player);this.wasClosed=cycle.closed;
  if(this.claw){this.claw.position.copy(this.gantry);poseClawCable(this.claw);for(let i=0;i<3;i++){const f=this.claw.getObjectByName(`claw-finger-${i}`),a=i*Math.PI*2/3,dx=Math.sin(a),dz=Math.cos(a),clearanceX=(11.6-Math.sign(dx)*this.gantry.x)/Math.max(.001,Math.abs(dx)),clearanceZ=(11.6-Math.sign(dz)*this.gantry.z)/Math.max(.001,Math.abs(dz)),r=Math.min(cycle.closed?.35:1.19,clearanceX,clearanceZ);if(f)f.scale.z=r/.7;this.pos.set(this.gantry.x+dx*r,this.gantry.y-2.2,this.gantry.z+dz*r);this.fingers[i]?.setNextKinematicTranslation(this.pos);}}
  this.pos.copy(this.gantry);this.pos.y-=2.85;
  if(this.held&&this.held!=='player'){this.pos.x=THREE.MathUtils.clamp(this.pos.x,-10.82,10.82);this.pos.z=THREE.MathUtils.clamp(this.pos.z,-10.82,10.82);}
  if(this.held==='player')player.setVehiclePose(this.pos,this.velocity.set(0,0,0));else if(this.held)this.held.body.setTranslation(this.pos,true);
  for(const b of this.balls){b.mesh.position.copy(b.body.translation());this.cabinet!.worldToLocal(b.mesh.position);b.mesh.quaternion.copy(b.body.rotation());}
  const motion=this.held==='player'?{position:player.getPosition(),velocity:player.getVelocity(),fellOut:false}:player.update(delta,this.idle,camera);
  const p=player.getPosition();if(this.targetMarker){this.targetMarker.position.copy(p);this.cabinet!.worldToLocal(this.targetMarker.position);this.targetMarker.quaternion.copy(camera.quaternion);}
  if(this.goal&&this.held!=='player'&&Math.abs(p.x-this.goalOrigin.x)<2.5&&Math.abs(p.z-this.goalOrigin.z)<2.5&&p.y<12)this.finished=true;
  return motion;
 }
 update(delta:number,player:Player,input:InputAxis,camera:THREE.Camera){
  if(this.stopped)return;this.player=player;this.time+=delta;
  if(this.controlsGoal)return this.machine(delta,player,input,camera);
  for(const a of this.actors){previewTokyoModel(a.obj,a.group,this.time);if(a.body){a.group.getWorldPosition(this.pos);a.group.getWorldQuaternion(this.quat);a.body.setNextKinematicTranslation(this.pos);a.body.setNextKinematicRotation(this.quat);}
   const kind=String(a.obj.properties?.subType);let paddleContact=false,signalContact=false,carContact=false,tip=0;
   if(kind==='tokyo_pulse_emitter'&&player.getBody()&&this.time-a.cooldown>.9){const pose=tokyoPulsePose(this.time,Number(a.obj.properties?.index??0));a.group.worldToLocal(this.pos.copy(player.getPosition()));if(pose.active&&Math.abs(this.pos.y-.55)<1.1&&Math.abs(Math.hypot(this.pos.x,this.pos.z)-pose.radius)<player.radius+.12){this.velocity.set(this.pos.x,0,this.pos.z);if(this.velocity.lengthSq()<.001)this.velocity.set(1,0,0);this.velocity.normalize().applyQuaternion(a.group.getWorldQuaternion(this.quat));player.setLinearVelocity({x:this.velocity.x*30,y:8,z:this.velocity.z*30});a.cooldown=this.time;}}
   if(kind==='tokyo_flipper'){a.group.worldToLocal(this.pos.copy(player.getPosition()));const side=Number(a.obj.properties?.side??1),length=Number(a.obj.properties?.length??10.8);tip=THREE.MathUtils.clamp(-side*this.pos.x/length,0,1);paddleContact=Math.hypot(Math.max(0,Math.abs(this.pos.x+side*length/2)-length/2-.3),Math.max(0,Math.abs(this.pos.y-.1)-.325),Math.max(0,Math.abs(this.pos.z)-.55))<player.radius+.05;}
   if(kind==='tokyo_pedestrian'){a.group.worldToLocal(this.pos.copy(player.getPosition()));signalContact=Math.hypot(Math.max(0,Math.abs(this.pos.x)-.55),Math.max(0,Math.abs(this.pos.y-1.15)-1.15),Math.max(0,Math.abs(this.pos.z)-.18))<player.radius+.04;}
   if(kind==='tokyo_car'){a.group.worldToLocal(this.pos.copy(player.getPosition()));carContact=Math.hypot(Math.max(0,Math.abs(this.pos.x)-1.1),Math.max(0,Math.abs(this.pos.y-.8)-.8),Math.max(0,Math.abs(this.pos.z)-2.15))<player.radius+.05;}
   if((kind==='tokyo_pedestrian'||kind==='tokyo_car'||kind==='tokyo_flipper')&&a.body&&player.getBody()&&this.time-a.cooldown>.65&&(paddleContact||signalContact||carContact||this.physics.hasBodyContact(player.getBody()!,a.body))){
    const v=player.linvel();
    if(kind==='tokyo_flipper'){
      a.group.worldToLocal(this.pos.copy(player.getPosition()));this.pos.y=Math.max(this.pos.y,1.3);a.group.localToWorld(this.pos);player.teleportTo(this.pos.x,this.pos.y,this.pos.z-.2);
      // Native ballistic flight up the steep table, strongest at the tip.
      const flight=1.8,damping=.12,factor=(1-Math.exp(-damping*flight))/damping,power=.4+.6*tip,vy=(pinballHeight(-47)+1.5-this.pos.y+18/damping*(flight-factor))/factor;
      player.setLinearVelocity({x:-Number(a.obj.properties?.side)*1.5,y:vy*power,z:(-47-this.pos.z)/factor*power});
    }
    else if(kind==='tokyo_pedestrian'){const pose=tokyoPedestrianPose(this.time,Number(a.obj.properties?.index??0)),p=player.getPosition(),side=Math.sign(p.z-a.group.position.z)||1;player.setLinearVelocity({x:v.x+pose.direction*15,y:5.5,z:v.z+side*6});}
    else {const p=player.getPosition(),d=this.pos.copy(p).sub(a.group.position).setY(0);if(d.lengthSq()<.01)d.set(0,0,-1).applyQuaternion(a.group.quaternion);d.normalize();player.setLinearVelocity({x:v.x*.2+d.x*33,y:11,z:v.z*.2+d.z*33});}a.cooldown=this.time;
   }
  }
  if(this.data.stage===3&&this.goal){this.goal.position.x=this.goalOrigin.x+Math.sin(this.time*.7)*6;this.goal.mesh.position.x=this.goal.position.x;}
 }
 stop(){this.stopped=true;}
 reset(){
  if(this.player&&this.held)this.release(this.player);this.time=0;this.stopped=false;this.finished=false;this.wasClosed=false;this.gantry.set(0,27,0);
  if(this.goal){this.goal.position.copy(this.goalOrigin);this.goal.mesh.position.copy(this.goalOrigin);}
  for(let i=0;i<this.fingers.length;i++){const a=i*Math.PI*2/3;this.pos.set(Math.sin(a)*1.19,24.8,Math.cos(a)*1.19);this.fingers[i].setTranslation(this.pos,true);this.fingers[i].setNextKinematicTranslation(this.pos);}
  for(const b of this.balls){b.body.setEnabled(true);b.body.setTranslation(b.start,true);b.body.setRotation({x:0,y:0,z:0,w:1},true);b.body.setLinvel({x:0,y:0,z:0},true);b.body.setAngvel({x:0,y:0,z:0},true);}
  for(const a of this.actors){a.cooldown=-10;previewTokyoModel(a.obj,a.group,0);if(a.body){a.group.getWorldPosition(this.pos);a.group.getWorldQuaternion(this.quat);a.body.setTranslation(this.pos,true);a.body.setRotation(this.quat,true);a.body.setNextKinematicTranslation(this.pos);a.body.setNextKinematicRotation(this.quat);}}
 }
 destroy(){if(this.player?.isInVehicle()&&this.controlsGoal)this.player.setVehicleMounted(false);const world=this.physics.getWorld();for(const b of this.balls)if(world?.getRigidBody(b.body.handle))world.removeRigidBody(b.body);this.balls.length=0;this.actors.length=0;}
}
