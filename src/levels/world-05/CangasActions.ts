import * as THREE from "three";
import type RAPIER from "@dimforge/rapier3d-compat";
import type { Player } from "../../player/Player";
import type { PhysicsWorld } from "../../physics/PhysicsWorld";
import type { LevelObjectData } from "../LevelTypes";
import { fabadaIngredients, createFabadaBowlGeometry, createFabadaIngredientGeometry, FABADA_FLOOR_Y } from "./CangasModels";
import type { ActiveGoal } from "../LevelBuilder";

const FAN_CYCLE = 4.2;
const WIND_TIME = 1.35;
const MAGNET_CYCLE = 4.25;
const ROTATION_SPEED = .31;
const smooth = (t: number) => THREE.MathUtils.smoothstep(t, 0, 1);
const beat = (time: number, phase: number, cycle: number) => ((time - phase) % cycle + cycle) % cycle;
const fanAge = (obj: LevelObjectData, time: number) => beat(time, Number(obj.properties?.phase ?? 0), Number(obj.properties?.windCycle ?? FAN_CYCLE));

function windFront(age: number): number {
  return Math.min(12, age * 21);
}

export function previewCangasActor(obj: LevelObjectData, mesh: THREE.Object3D, time: number): boolean {
  switch (obj.properties?.cangasAction) {
    case "wind": {
      const age = fanAge(obj, time);
      const duration=Number(obj.properties?.windTime ?? WIND_TIME);
      const stream = mesh.getObjectByName("air-stream") as THREE.LineSegments<THREE.BufferGeometry,THREE.LineBasicMaterial> | undefined;
      if (stream) {
        stream.visible = age > .02 && age < duration;
        stream.scale.x = windFront(age) / 12.4;
        stream.position.y = Math.sin(age * 34) * .12;
        stream.material.opacity = Math.min(.9, .3 + .55 * (1 - age / duration));
      }
      return true;
    }
    case "magnet": {
      const props=obj.properties,cycle=Number(props.cycle ?? MAGNET_CYCLE),phase=Number(props.phase ?? 0);
      const age = beat(time,phase,cycle),lap=Math.floor((time-phase)/cycle);
      const seed=Math.sin(lap*12.9898+phase*78.233)*43758.5453;
      const variation=((seed-Math.floor(seed))*2-1)*Number(props.irregularity ?? 0);
      const down=Number(props.descent ?? .83)*(1+variation*.7);
      const hold=Number(props.hold ?? .47)*(1-variation*.65);
      const up=Number(props.ascent ?? .77)*(1-variation*.5);
      const delay=.38+variation*.35;
      const stroke = smooth((age-delay)/down)*(1-smooth((age-delay-down-hold)/up));
      mesh.position.y = obj.position.y - stroke * 3.72;
      return true;
    }
    case "icecream":
      mesh.rotation.y=obj.rotation.y+time*Number(obj.properties.rotationSpeed ?? .48);
      return true;
    case "fabada":
      mesh.rotation.y = obj.rotation.y + time * ROTATION_SPEED;
      return true;
    case "fabadaGoal": {
      const q=new THREE.Quaternion().setFromAxisAngle(THREE.Object3D.DEFAULT_UP,time*ROTATION_SPEED);
      mesh.position.copy(obj.position).applyQuaternion(q);
      mesh.quaternion.setFromEuler(new THREE.Euler(obj.rotation.x,obj.rotation.y,obj.rotation.z,"YXZ")).premultiply(q);
      return true;
    }
    case "launch":
      return true;
    default:
      return false;
  }
}

type Actor = { obj: LevelObjectData; mesh: THREE.Object3D; body?: RAPIER.RigidBody; lastLaunch: number };

export class CangasActions {
  private readonly actors: Actor[] = [];
  private captured?: { actor: Actor; x: number; y: number; z: number; time: number };
  private magnetCooldown = 0;
  private movingGoal?: {goal:ActiveGoal; dish:Actor; position:THREE.Vector3; rotation:THREE.Quaternion};

  constructor(private readonly physics: PhysicsWorld) {}

  attach(obj: LevelObjectData, mesh: THREE.Object3D, solids?:THREE.Mesh[]): void {
    const actor: Actor = { obj, mesh, lastLaunch: -Infinity };
    if (obj.properties?.cangasAction === "fabada" && obj.properties.hasCollision !== false) {
      const geometry=createFabadaBowlGeometry(false);
      const vertices=geometry.getAttribute("position").array as Float32Array;
      const indices=Uint32Array.from({length:vertices.length/3},(_,i)=>i);
      // One continuous floor avoids catching the ball on rotating radial triangle seams.
      const dish = this.physics.createKinematicCylinder(obj.position,15.8,.2,.015,.09,mesh.quaternion,true);
      if (dish) {
        actor.body = dish.body;
        dish.collider.setTranslationWrtParent({x:0,y:FABADA_FLOOR_Y-.2,z:0});
        this.physics.addTrimeshColliderToBody(dish.body,vertices,indices,.09,.015,true);
        for (const ingredient of fabadaIngredients()) {
          const geometry=createFabadaIngredientGeometry(ingredient);
          this.physics.addConvexColliderToBody(dish.body,geometry.getAttribute("position").array as Float32Array,.24,.025,true);
          geometry.dispose();
        }
      }
      geometry.dispose();
    }
    if(obj.properties?.cangasAction==="icecream" && obj.properties.hasCollision!==false && solids?.length) {
      mesh.updateWorldMatrix(true,true);
      const inverse=mesh.matrixWorld.clone().invert();
      for(const [index,solid] of solids.entries()) {
        const geometry=solid.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,solid.matrixWorld));
        const vertices=geometry.getAttribute("position").array as Float32Array;
        if(index===0) {
          const indices=geometry.index ? new Uint32Array(geometry.index.array) : Uint32Array.from({length:vertices.length/3},(_,i)=>i);
          actor.body=this.physics.createKinematicTrimesh(obj.position,vertices,indices,.025,.3,mesh.quaternion)?.body;
        } else if(actor.body) this.physics.addConvexColliderToBody(actor.body,vertices,.3,.025);
        geometry.dispose();
      }
    }
    this.actors.push(actor);
  }

  attachGoal(goal:ActiveGoal): void {
    const dish=this.actors.find(a=>a.obj.properties?.cangasAction==="fabada" && a.body);
    if(!dish?.body) return;
    const inverse=dish.mesh.quaternion.clone().invert();
    const position=goal.position.clone().sub(dish.mesh.position).applyQuaternion(inverse);
    const rotation=inverse.clone().multiply(goal.mesh.quaternion);
    this.movingGoal={goal,dish,position,rotation};
    for(const [x,y,hx,hy,hz] of [[-1.7,1.59,.22,1.59,.22],[1.7,1.59,.22,1.59,.22],[0,3.4,1.95,.22,.24]]) {
      const offset=new THREE.Vector3(x,y,0).applyQuaternion(rotation).add(position);
      this.physics.addBoxColliderToBody(dish.body,offset,{x:hx,y:hy,z:hz},.75,.4,rotation);
    }
    this.updateGoal();
  }

  private updateGoal(): void {
    const g=this.movingGoal;
    if(!g) return;
    g.goal.position.copy(g.position).applyQuaternion(g.dish.mesh.quaternion).add(g.dish.mesh.position);
    g.goal.mesh.position.copy(g.goal.position);
    g.goal.mesh.quaternion.copy(g.dish.mesh.quaternion).multiply(g.rotation);
    g.goal.quaternion?.copy(g.goal.mesh.quaternion);
    g.goal.rotationY=g.goal.mesh.rotation.y;
  }

  reset(): void {
    this.captured = undefined;
    this.magnetCooldown = 0;
    for (const actor of this.actors) {
      actor.lastLaunch = -Infinity;
      previewCangasActor(actor.obj, actor.mesh, 0);
      if (actor.body) {
        actor.body.setRotation(actor.mesh.quaternion, true);
        actor.body.setNextKinematicRotation(actor.mesh.quaternion);
      }
    }
    this.updateGoal();
  }

  update(time: number, delta: number, position?: THREE.Vector3, player?: Player): void {
    for (const actor of this.actors) {
      previewCangasActor(actor.obj, actor.mesh, time);
      actor.body?.setNextKinematicRotation(actor.mesh.quaternion);
      actor.mesh.updateMatrixWorld(true);
    }
    this.updateGoal();
    if (!player || !position) return;
    if (this.captured) {
      const { actor,x,y,z,time:started } = this.captured;
      const t = Math.min(1,(time-started)/.8);
      player.teleportTo(x,THREE.MathUtils.lerp(y,Math.max(y,actor.mesh.position.y-.65),smooth(t)),z);
      if (t === 1) {
        const direction = Math.abs(x) > .5 ? Math.sign(x) : Number(actor.obj.properties?.side ?? 1);
        player.setLinearVelocity({x:direction*18,y:7,z:-1.1});
        this.magnetCooldown = time + 1.25;
        this.captured = undefined;
      }
      return;
    }
    for (const actor of this.actors) {
      const { obj,mesh } = actor;
      const dx=position.x-obj.position.x, dy=position.y-obj.position.y, dz=position.z-obj.position.z;
      switch (obj.properties?.cangasAction) {
        case "wind": {
          const age=fanAge(obj,time);
          const crossed = -dx;
          if (age < Number(obj.properties.windTime ?? WIND_TIME) && crossed > 0 && crossed < windFront(age) && Math.abs(dz)<1.54 && Math.abs(dy)<1.37) {
            const velocity=player.linvel();
            player.setLinearVelocity({x:velocity.x-Number(obj.properties.windStrength ?? 26)*delta,y:velocity.y,z:velocity.z});
          }
          break;
        }
        case "magnet":
          if (time>=this.magnetCooldown && mesh.position.y<1.85 && position.y>0 && position.y<1.4 &&
              Math.abs(dx)<1.36*obj.scale.x && Math.abs(dz)<1.04*obj.scale.z) {
            this.captured={actor,x:position.x,y:position.y,z:position.z,time};
            return;
          }
          break;
        case "launch": {
          const props=obj.properties,yaw=obj.rotation.y,c=Math.cos(yaw),s=Math.sin(yaw);
          const localX=c*dx-s*dz,localZ=s*dx+c*dz;
          const launchX=Number(props.launchX ?? 0),launchZ=Number(props.launchZ ?? -Number(props.velocity));
          const velocity=player.linvel();
          if (time-actor.lastLaunch>1.7 && Math.abs(localX)<Number(props.padWidth)/2 &&
              Math.abs(localZ)<Number(props.padDepth ?? .6) && dy>.26 && dy<1.2 &&
              velocity.x*launchX+velocity.z*launchZ>.25) {
            player.setLinearVelocity({x:launchX,y:Number(props.launchY ?? 7.6),z:launchZ});
            actor.lastLaunch=time;
          }
          break;
        }
      }
    }
  }
}
