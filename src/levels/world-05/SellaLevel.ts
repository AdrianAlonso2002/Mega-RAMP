import * as THREE from "three";
import type RAPIER from "@dimforge/rapier3d-compat";
import type { PhysicsWorld } from "../../physics/PhysicsWorld";
import type { Player } from "../../player/Player";
import type { InputAxis } from "../../input/InputManager";
import type { LevelData,LevelObjectData,Vector3Data } from "../LevelTypes";
import type { ActiveGoal } from "../LevelBuilder";
import { canoePaddles,paddlePulse,sampleSellaRiver,buildRiverFrames,type RiverFrame } from "./SellaRiver";
import { animateCanoePaddles,previewSellaActor } from "./SellaModels";
import type { SellaWater } from "./SellaWater";
import { CANOE_SCALE,CANOE_PADDLE_X,CANOE_BLADE_REACH,CANOE_DESCENT_CRUISE,CANOE_BEND_CRUISE,MEGA_CANOE_MAX_SPEED,MEGA_CANOE_CURRENT_SPEED } from "./SellaCanoeTuning";

type Actor={obj:LevelObjectData;mesh:THREE.Object3D};
export interface SellaMotion {position:THREE.Vector3;velocity:THREE.Vector3;fellOut:boolean}

export class SellaLevel {
  readonly points:Vector3Data[];
  readonly width:number;
  readonly breaks:number[];
  private readonly frames:RiverFrame[];
  finishRequested=false;
  broken=false;
  heading=0;
  private readonly flow:number;
  private readonly pace:number;
  private readonly continuousSupport:boolean;
  private readonly actors:Actor[]=[];
  private readonly hazards=new Set<number>();
  private canoe?:Actor;
  private body?:RAPIER.RigidBody;
  private passenger?:Player;
  private goal?:ActiveGoal;
  private goalObj?:LevelObjectData;
  private goalBody?:RAPIER.RigidBody;
  private time=0;
  private boardedAt=0;
  private rowingSpeedAllowance=0;
  private hint=-1;
  private airborne=false;
  private airborneTime=0;
  private pitch=0;
  private roll=0;
  private water?:SellaWater;
  private readonly paddleWet=[false,false];
  private wakeTimer=0;
  private readonly ripplePoint=new THREE.Vector3();
  private capture?:{actor:Actor;start:THREE.Vector3;time:number;side:number};
  private returning?:{actor:Actor;start:THREE.Vector3;time:number};
  private ejectedAt=-1;
  private readonly previous=new THREE.Vector3();
  private readonly velocity=new THREE.Vector3();
  private readonly seat=new THREE.Vector3();
  private readonly local=new THREE.Vector3();
  private readonly previousLocal=new THREE.Vector3();
  private readonly inverse=new THREE.Quaternion();

  constructor(private readonly data:LevelData,private readonly physics:PhysicsWorld) {
    const river=data.objects.find(o=>o.properties?.subType==="asturias_sella_river");
    const matrix=new THREE.Matrix4();
    if(river) matrix.compose(new THREE.Vector3().copy(river.position),new THREE.Quaternion().setFromEuler(new THREE.Euler(river.rotation.x,river.rotation.y,river.rotation.z,"YXZ")),new THREE.Vector3().copy(river.scale));
    this.points=(river?.properties?.points as Vector3Data[]??[]).map(p=>new THREE.Vector3().copy(p).applyMatrix4(matrix));
    this.width=Number(river?.properties?.width??24)*Math.max(river?.scale.x??1,river?.scale.z??1);
    this.breaks=river?.properties?.breaks as number[]??[];
    this.frames=buildRiverFrames(this.points,this.breaks);
    this.flow=Number(river?.properties?.current??1);
    this.pace=THREE.MathUtils.clamp(Number(data.properties?.canoePace??1),1,3);
    this.continuousSupport=data.world===5 && data.level===3 && data.stage===10;
  }

  attach(obj:LevelObjectData,mesh:THREE.Object3D):void {
    const actor={obj,mesh};this.actors.push(actor);
    if(obj.properties?.subType==="asturias_sella_river") this.water=mesh.userData.sellaWater as SellaWater;
    if(obj.properties?.sellaAction==="canoe") {
      this.canoe=actor;this.heading=obj.rotation.y;this.body=this.physics.createCanoeBody(obj.position,this.heading,CANOE_SCALE*Math.max(obj.scale.x,obj.scale.z))??undefined;
    }
    if(this.water && this.canoe) {this.canoe.mesh.updateWorldMatrix(true,false);this.water.setCanoeTransform(this.canoe.mesh.matrixWorld);}
  }

  addHazard(collider:RAPIER.Collider|null):void {if(collider) this.hazards.add(collider.handle);}

  attachGoal(obj:LevelObjectData,goal:ActiveGoal):void {
    this.goalObj=obj;this.goal=goal;
    if(obj.properties?.sellaAction==="landingGoal") {
      const frame=this.physics.createKinematicBox(obj.position,goal.mesh.quaternion,{x:.22,y:1.59,z:.22},.3,.05,{x:-1.7,y:1.59,z:0});
      if(frame) {
        this.goalBody=frame.body;
        this.physics.addBoxColliderToBody(frame.body,{x:1.7,y:1.59,z:0},{x:.22,y:1.59,z:.22},.3,.05);
        this.physics.addBoxColliderToBody(frame.body,{x:0,y:3.4,z:0},{x:1.95,y:.22,z:.24},.3,.05);
      }
    }
  }

  animate(time:number):void {
    for(const actor of this.actors) {
      if(actor===this.canoe || actor===this.capture?.actor || actor===this.returning?.actor) continue;
      previewSellaActor(actor.obj,actor.mesh,time);
      const flow=actor.mesh.getObjectByName("sella-flow") as THREE.LineSegments<THREE.BufferGeometry,THREE.LineBasicMaterial>|undefined;
      if(flow) flow.material.opacity=.3+Math.sin(time*3)*.12;
      actor.mesh.updateMatrixWorld(true);
    }
    if(this.returning) {
      const r=this.returning,t=Math.min(1,(this.time-r.time)/1.2);
      previewSellaActor(r.actor.obj,r.actor.mesh,time);
      r.actor.mesh.position.lerp(r.start,1-t*t*(3-2*t));
      if(t===1) this.returning=undefined;
    }
    if(this.goal && this.goalObj) {
      previewSellaActor(this.goalObj,this.goal.mesh,time);
      this.goal.position.copy(this.goal.mesh.position);this.goal.mesh.updateMatrixWorld(true);
      this.goalBody?.setNextKinematicTranslation(this.goal.position);
    }
  }

  update(delta:number,input:InputAxis,player:Player):SellaMotion|undefined {
    this.time+=delta;
    this.animate(this.time);
    if(this.capture) return this.carryGull(player);
    if(this.ejectedAt>=0) {
      if(this.time-this.ejectedAt>1.25) return this.motion(player,true);
      return undefined;
    }
    if(this.data.properties?.sellaMode==="foot") {
      const p=player.getPosition(),river=sampleSellaRiver(this.points,p,this.breaks);
      if(river && p.y<river.y+.35) return this.motion(player,true);
      return undefined;
    }
    if(!this.body || !this.canoe) return undefined;
    if(this.broken) return this.motion(player,true);
    if(!player.isInVehicle()) {
      const boat=this.body.translation(),p=player.getPosition();
      if(this.data.properties?.boardAtSpawn || (Math.hypot(p.x-boat.x,p.z-boat.z)<3.2 && Math.abs(p.y-boat.y)<2.4)) {
        this.passenger=player;player.setVehicleMounted(true);this.body.setEnabled(true);this.previous.copy(boat);this.boardedAt=this.time;
      } else return undefined;
    }
    const body=this.body,p=body.translation(),lv=body.linvel(),sample=sampleSellaRiver(this.points,p,this.breaks,this.hint,this.frames,this.width);
    if(!sample) return this.fail(player);
    this.hint=sample.segment;
    const end=this.points[sample.segment+1],start=this.points[sample.segment];
    const ahead=(p.x-end.x)*sample.dx+(p.z-end.z)*sample.dz;
    const behind=(p.x-start.x)*sample.dx+(p.z-start.z)*sample.dz;
    const endsHere=sample.segment===this.points.length-2 || this.breaks.includes(sample.segment+1);
    const startsHere=sample.segment===0 || this.breaks.includes(sample.segment-1);
    const withinEnds=!(endsHere && sample.t>.999 && ahead>.3) && !(startsHere && sample.t<.001 && behind<-.3);
    // Connected river sections are a continuous supporting surface for the final descent.
    // Resolve penetration before buoyancy classification, including a fast step across a steep join.
    if(this.continuousSupport && withinEnds && sample.distance<this.width/2-.25 &&
      (!this.airborne || p.y>sample.y-4)) {
      const floor=sample.y+(this.water?.sample(p,this.hint)??0)+.2;
      if(p.y<floor) {
        p.y=floor;body.setTranslation(p,true);
        const alongY=(lv.x*sample.dx+lv.z*sample.dz)*sample.dy;
        if(lv.y<alongY) {lv.y=alongY;body.setLinvel(lv,true);}
      }
    }
    const onWater=withinEnds && sample.distance<this.width/2-.25 && p.y<sample.y+Math.max(1.3,Math.abs(sample.dy)*Math.hypot(lv.x,lv.z)*.3) && p.y>sample.y-4;
    const rotation=body.rotation();this.heading=2*Math.atan2(rotation.y,rotation.w);
    const fx=-Math.sin(this.heading),fz=-Math.cos(this.heading),rx=Math.cos(this.heading),rz=-Math.sin(this.heading);
    const mass=body.mass();
    const commands=canoePaddles(input.horizontal,input.vertical,input.bothPaddles);
    if(this.continuousSupport) {
      const rowing=onWater && (commands.left>.08 || commands.right>.08);
      this.rowingSpeedAllowance=rowing ? 1:this.rowingSpeedAllowance*Math.exp(-2*delta);
    }
    let wavePitch=0,waveRoll=0;
    if(onWater) {
      if(this.airborne && this.airborneTime>.22) {
        if(this.goalObj?.properties?.sellaAction==="basinGoal" && sample.segment>this.breaks[0]) this.finishRequested=true;
        if(this.goalObj?.properties?.sellaAction==="landingGoal" && sample.segment>this.breaks[0]) {
          if(this.goal && Math.abs(p.x-this.goal.position.x)<2.5 && Math.abs(p.z-this.goal.position.z)<9) this.finishRequested=true;
          else return this.fail(player);
        }
      }
      this.airborne=false;this.airborneTime=0;
      this.water?.focus(p,this.hint);
      const wave=this.water?.sample(p,this.hint)??0;
      const at=(x:number,z:number)=>{
        this.ripplePoint.set(p.x+x,p.y,p.z+z);return this.water?.sample(this.ripplePoint,this.hint)??0;
      };
      wavePitch=Math.atan((at(fx*2,fz*2)-at(-fx*2,-fz*2))/4);
      waveRoll=Math.atan((at(-rx*.8,-rz*.8)-at(rx*.8,rz*.8))/1.6);
      const targetVy=(lv.x*sample.dx+lv.z*sample.dz)*sample.dy;
      const lift=THREE.MathUtils.clamp(18+(sample.y+wave+.2-p.y)*65+(targetVy-lv.y)*13,-65,95);
      const descent=THREE.MathUtils.smoothstep(-sample.dy,.025,.14);
      // Give the player a moment to choose a paddle before gravity/current takes over.
      const departure=THREE.MathUtils.smoothstep(this.time-this.boardedAt,.45,2);
      let aheadDistance=0,bend=0,launchDistance=Infinity;
      for(let i=sample.segment;i<Math.min(this.points.length-1,sample.segment+16);i++) {
        const a=this.points[i],b=this.points[i+1];
        if(this.breaks.includes(i)) {launchDistance=aheadDistance;break;}
        const dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz);
        if(length>.001 && aheadDistance<24) bend=Math.max(bend,Math.acos(THREE.MathUtils.clamp((dx*sample.dx+dz*sample.dz)/length,-1,1)));
        aheadDistance+=length*(i===sample.segment ? 1-sample.t:1);
        if(aheadDistance>55) break;
      }
      // Release the speed assistance gradually before a designed launch, preserving jump reach.
      const launch=Number.isFinite(launchDistance) ? 1-THREE.MathUtils.smoothstep(launchDistance,12,38):0;
      const assistance=descent*(1-launch);
      // MegaBajada's current is a persistent transport velocity along the 3D river tangent.
      const current=(this.continuousSupport ? this.flow/Math.hypot(1,sample.dy)
        : THREE.MathUtils.lerp(this.flow,Math.min(this.flow,2.5*this.pace),assistance))*departure;
      const relX=lv.x-sample.dx*current,relZ=lv.z-sample.dz*current;
      const longitudinal=relX*fx+relZ*fz,lateral=relX*rx+relZ*rz;
      const drag=-.025*longitudinal*Math.abs(longitudinal),keel=-lateral*6*this.pace;
      const slope=this.continuousSupport ? 0 : -18*sample.dy/(1+sample.dy*sample.dy)*THREE.MathUtils.lerp(1,.65,assistance)*departure*this.pace*this.pace;
      const downstream=lv.x*sample.dx+lv.z*sample.dz;
      const cruise=THREE.MathUtils.lerp(CANOE_DESCENT_CRUISE,CANOE_BEND_CRUISE,THREE.MathUtils.smoothstep(bend,.15,.65))*this.pace;
      const resistance=this.continuousSupport ? 0:Math.max(0,downstream-cruise)*3*this.pace*assistance;
      const carry=this.continuousSupport ? (current-downstream)*2.4:0;
      body.applyImpulse({x:(fx*drag+rx*keel+sample.dx*(slope-resistance+carry))*mass*delta,y:lift*mass*delta,z:(fz*drag+rz*keel+sample.dz*(slope-resistance+carry))*mass*delta},true);
      const steering=Math.abs(commands.left-commands.right)>.08;
      // A longer effective blade moment helps initiate a correction; hull drag arrests yaw after release.
      body.setAngularDamping((steering ? 1.8:4.5)*this.pace+Math.hypot(lv.x,lv.z)*.025);
      const lever=CANOE_PADDLE_X*this.canoe.mesh.scale.x,reach=CANOE_BLADE_REACH*this.canoe.mesh.scale.x;
      const rowingOmega=body.angvel().y;
      const forwardSpeed=lv.x*fx+lv.z*fz;
      for(const [side,command,phase] of [[-1,commands.left,0],[1,commands.right,0]]) {
        // Keep the brake's stopping force, but use a gentler yaw response than a forward stroke.
        const moment=lever*(command<0 ? .4:1.6);
        const pulse=paddlePulse(this.time,phase),index=side<0 ? 0:1;
        const wet=command<-.02 || (command>.02 && pulse>.025);
        const x=p.x+rx*side*reach,z=p.z+rz*side*reach;
        this.ripplePoint.set(x,p.y,z);
        if(wet && !this.paddleWet[index]) this.water?.disturb(this.ripplePoint,-.16*Math.abs(command),.85,this.hint);
        else if(!wet && this.paddleWet[index]) this.water?.disturb(this.ripplePoint,.07,.8,this.hint);
        this.paddleWet[index]=wet;
        let impulse=command>0 ? command*pulse*8*mass*delta*this.pace*this.pace : 0;
        if(command<0) {
          // Brake the boat's forward motion, not its velocity relative to the current:
          // slower-than-water boats must not receive a forward braking impulse and reverse their turn.
          // Both blades must read the same pre-stroke state, rather than the first blade's impulse.
          const bladeSpeed=Math.max(0,forwardSpeed+rowingOmega*side*moment);
          impulse=-bladeSpeed*Math.min(.3,2.1*delta*this.pace)*Math.abs(command)*mass;
        }
        body.applyImpulseAtPoint({x:fx*impulse,y:0,z:fz*impulse},{x:p.x+rx*side*moment,y:p.y,z:p.z+rz*side*moment},true);
        if(this.continuousSupport && command>0) {
          // Extra forward stroke power over the 60 km/h current, without amplifying steering torque.
          const thrust=command*pulse*40*mass*delta;
          body.applyImpulse({x:fx*thrust,y:0,z:fz*thrust},true);
        }
      }
      this.wakeTimer+=delta;
      if(this.wakeTimer>=.08) {
        this.wakeTimer%=.08;
        const strength=Math.min(1,Math.hypot(relX,relZ)/8);
        if(strength>.05) for(const side of [-1,1]) {
          this.ripplePoint.set(p.x-fx*1.9*CANOE_SCALE+rx*side*.55*CANOE_SCALE,p.y,p.z-fz*1.9*CANOE_SCALE+rz*side*.55*CANOE_SCALE);
          this.water?.disturb(this.ripplePoint,-.055*strength,.72,this.hint);
        }
        if(commands.left<0 || commands.right<0) {
          const side=commands.left<0 ? -1:1;
          this.ripplePoint.set(p.x+rx*side*reach,p.y,p.z+rz*side*reach);this.water?.disturb(this.ripplePoint,-.06*strength,.85,this.hint);
        }
      }
      animateCanoePaddles(this.canoe.mesh,this.time,commands.left,commands.right);
    } else {
      this.airborne=true;this.airborneTime+=delta;
      this.paddleWet.fill(false);
      animateCanoePaddles(this.canoe.mesh,this.time,0,0);
      const launchEnd=this.breaks.includes(sample.segment) || this.breaks.includes(sample.segment+1);
      // Only a marked waterfall/launch may leave the water longitudinally.
      if((sample.distance>this.width/2+1 && !launchEnd && this.airborneTime>.18) || this.airborneTime>6 || p.y<5) return this.fail(player);
    }
    if(this.continuousSupport) {
      const actual=body.linvel(),speed=Math.hypot(actual.x,actual.y,actual.z);
      const limit=MEGA_CANOE_CURRENT_SPEED+(MEGA_CANOE_MAX_SPEED-MEGA_CANOE_CURRENT_SPEED)*this.rowingSpeedAllowance;
      if(speed>limit) {
        const ratio=limit/speed;
        actual.x*=ratio;actual.y*=ratio;actual.z*=ratio;body.setLinvel(actual,true);
      }
      // Report the capped 3D velocity too, so downhill vertical speed cannot inflate the speed display.
      lv.x=actual.x;lv.y=actual.y;lv.z=actual.z;
    }
    if(Math.abs(sample.side)>this.width/2-.65 && withinEnds && Math.abs(p.y-sample.y)<3) return this.fail(player);
    let contact=false;
    const world=this.physics.getWorld(),hull=body.collider(0);
    world?.contactPairsWith(hull,hazard=>{
      if(this.hazards.has(hazard.handle)) world.contactPair(hull,hazard,manifold=>{if(manifold.numSolverContacts()>0) contact=true;});
    });
    if(contact) return this.fail(player);
    this.canoe.mesh.position.copy(p);
    const pitch=onWater ? Math.atan(sample.dy*(fx*sample.dx+fz*sample.dz))+wavePitch : 0;
    this.pitch+=(pitch-this.pitch)*(1-Math.exp(-8*delta));
    this.roll+=(waveRoll-this.roll)*(1-Math.exp(-6*delta));
    this.canoe.mesh.rotation.set(this.pitch,this.heading,this.roll,"YXZ");
    this.canoe.mesh.updateMatrixWorld(true);
    this.water?.setCanoeTransform(this.canoe.mesh.matrixWorld);
    this.seat.set(p.x,p.y+.6*this.canoe.mesh.scale.y,p.z);this.velocity.copy(lv);player.setVehiclePose(this.seat,this.velocity);
    this.checkFinish(this.previous,this.seat);this.previous.copy(this.seat);
    for(const gull of this.actors) if(gull.obj.properties?.sellaAction==="gull" && gull.mesh.position.distanceToSquared(this.seat)<6.25) {
      this.capture={actor:gull,start:this.seat.clone(),time:this.time,side:sample.side<0 ? -1:1};
      player.setVehicleMounted(false);player.setFrozen(true);body.setEnabled(false);break;
    }
    return {position:player.getPosition(),velocity:this.velocity,fellOut:false};
  }

  private checkFinish(previous:THREE.Vector3,position:THREE.Vector3):void {
    if(!this.goal || this.goalObj?.properties?.sellaAction!=="finish") return;
    this.inverse.copy(this.goal.quaternion??this.goal.mesh.quaternion).invert();
    this.local.copy(position).sub(this.goal.position).applyQuaternion(this.inverse);
    this.previousLocal.copy(previous).sub(this.goal.position).applyQuaternion(this.inverse);
    const a=this.previousLocal,b=this.local;
    if(a.z*b.z<=0 && Math.abs(a.z-b.z)>.0001) {
      const t=a.z/(a.z-b.z),x=THREE.MathUtils.lerp(a.x,b.x,t),y=THREE.MathUtils.lerp(a.y,b.y,t);
      if(Math.abs(x)<1.42 && y>.1 && y<3.2) this.finishRequested=true;
    }
  }

  private carryGull(player:Player):SellaMotion {
    const capture=this.capture!,t=Math.min(1,(this.time-capture.time)/1.6),smooth=t*t*(3-2*t);
    const x=capture.start.x+capture.side*(this.width*.7+10)*smooth,y=capture.start.y+Math.sin(t*Math.PI*.7)*9;
    player.teleportTo(x,y,capture.start.z-8*smooth);
    capture.actor.mesh.position.set(x,y+1.1,capture.start.z-8*smooth);
    if(t===1) {
      this.returning={actor:capture.actor,start:capture.actor.mesh.position.clone(),time:this.time};
      player.setFrozen(false);player.setLinearVelocity({x:capture.side*18,y:2,z:-3});this.ejectedAt=this.time;this.capture=undefined;
    }
    return this.motion(player,false);
  }

  private motion(player:Player,fellOut:boolean):SellaMotion {
    this.velocity.copy(player.linvel());return {position:player.getPosition(),velocity:this.velocity,fellOut};
  }

  private fail(player:Player):SellaMotion {this.broken=true;this.body?.setEnabled(false);return this.motion(player,true);}

  stop():void {this.body?.setEnabled(false);}

  reset():void {
    this.passenger?.setVehicleMounted(false);this.passenger=undefined;
    this.finishRequested=false;this.broken=false;this.time=0;this.boardedAt=0;this.hint=-1;this.airborne=false;this.airborneTime=0;this.pitch=0;
    this.roll=0;this.wakeTimer=0;this.rowingSpeedAllowance=0;this.paddleWet.fill(false);this.water?.reset();
    this.capture=undefined;this.returning=undefined;this.ejectedAt=-1;
    if(this.canoe && this.body) {
      this.body.setEnabled(false);this.body.setTranslation(this.canoe.obj.position,true);
      this.heading=this.canoe.obj.rotation.y;this.body.setRotation({x:0,y:Math.sin(this.heading/2),z:0,w:Math.cos(this.heading/2)},true);
      this.body.setLinvel({x:0,y:0,z:0},true);this.body.setAngvel({x:0,y:0,z:0},true);
      this.canoe.mesh.position.copy(this.canoe.obj.position);this.canoe.mesh.rotation.set(0,this.heading,0);
      this.canoe.mesh.updateWorldMatrix(true,false);this.water?.setCanoeTransform(this.canoe.mesh.matrixWorld);
    }
    this.animate(0);
  }

  destroy():void {if(this.body) this.physics.removeRigidBody(this.body);this.body=undefined;}
}
