import * as THREE from "three";
import type RAPIER from "@dimforge/rapier3d-compat";
import type { PhysicsWorld } from "../../physics/PhysicsWorld";
import type { Player } from "../../player/Player";
import type { LevelObjectData } from "../LevelTypes";

const CAR_WAIT = 10;
const HATCH_WAIT = 5;
const MAFALDA_CYCLE = 2.2;
const MAFALDA_POSE_DURATION = 3.2;
const HAND_IMPACT_POSE = 1.78;
const HAND_IMPACT = HAND_IMPACT_POSE * MAFALDA_CYCLE / MAFALDA_POSE_DURATION;
const smooth = (value: number) => THREE.MathUtils.smoothstep(value, 0, 1);

export function previewOviedoActor(obj: LevelObjectData, model: THREE.Object3D, time: number): boolean {
  switch (obj.properties?.asturiasAction) {
    case "parking-car": {
      const drive = smooth((time - CAR_WAIT) / 2.6);
      model.position.z = obj.position.z - 8.2 * drive;
      return true;
    }
    case "gull": {
      const phase = Number(obj.properties.phase ?? 0);
      const angle = time * .87 + phase;
      model.position.set(obj.position.x + Math.sin(angle) * 11,
        obj.position.y + .73 - Math.cos(angle * 2) * 1.04, obj.position.z + Math.cos(angle) * 2.55);
      model.rotation.y = Math.atan2(Math.cos(angle) * 11, -Math.sin(angle) * 2.55);
      setWings(model, time);
      return true;
    }
    case "mafalda": {
      const beat = (time % MAFALDA_CYCLE) * MAFALDA_POSE_DURATION / MAFALDA_CYCLE;
      for (const [index, name] of ["hand-left","hand-right"].entries()) {
        const hand = model.getObjectByName(name);
        if (!hand) continue;
        const offset = index * .11;
        const lift = smooth((beat - .46 - offset) / 1.05);
        const drop = smooth((beat - HAND_IMPACT_POSE - offset + .15) / .15);
        const strike = drop * (1 - smooth((beat - 1.96 - offset) / .65));
        hand.position.y = 1.55 - .61 * strike;
        hand.rotation.x = -.82 * lift * (1 - drop) + 1.14 * strike;
      }
      return true;
    }
    default:
      return false;
  }
}

function setWings(model: THREE.Object3D, time: number): void {
  const flap = Math.sin(time * 14) * .65;
  const left = model.getObjectByName("wing-left"), right = model.getObjectByName("wing-right");
  if (left) left.rotation.z = flap;
  if (right) right.rotation.z = -flap;
}

type Actor = { obj: LevelObjectData; mesh: THREE.Object3D };

export class OviedoActions {
  private readonly actors: Actor[] = [];
  private car?: { actor: Actor; body: RAPIER.RigidBody };
  private hatch?: { actor: Actor; collider: RAPIER.Collider; held: number; openedAt: number | null };
  private capture?: { actor: Actor; start: THREE.Vector3; at: number; dropX: number };
  private returningGull?: { actor: Actor; start: THREE.Vector3; at: number };
  private awaitingGullRespawn = false;
  private gullCooldown = 0;
  private lastQuake = -1;
  private wave?: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;

  constructor(private readonly root: THREE.Group, private readonly physics: PhysicsWorld) {}

  attach(obj: LevelObjectData, mesh: THREE.Object3D): void {
    const actor = { obj, mesh };
    const q = mesh.quaternion;
    if (obj.properties?.asturiasAction === "hatch") {
      const s = obj.scale;
      const collider = this.physics.createBoxCollider(obj.position, q, { x: s.x / 2, y: s.y / 2, z: s.z / 2 }, .8, 0);
      if (collider) this.hatch = { actor, collider, held: 0, openedAt: null };
      return;
    }
    if (obj.properties?.asturiasAction === "parking-car") {
      const car = this.physics.createKinematicBox({ ...obj.position, y: obj.position.y + .86 }, q,
        { x: 1.56, y: .86, z: 2.65 }, .7, .05);
      if (car) this.car = { actor, ...car };
    }
    if (obj.properties?.asturiasAction === "mafalda") {
      this.wave = new THREE.Mesh(new THREE.RingGeometry(.84,1,32),new THREE.MeshBasicMaterial({
        color: 0xf7dc93, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide
      }));
      this.wave.rotation.x = -Math.PI / 2;
      this.wave.position.set(3.6, .035, obj.position.z);
      this.wave.visible = false;
      this.root.add(this.wave);
    }
    this.actors.push(actor);
  }

  update(time: number, delta: number, position?: THREE.Vector3, player?: Player): true | void {
    for (const actor of this.actors) previewOviedoActor(actor.obj, actor.mesh, time);
    if (this.returningGull) {
      const { actor, start, at } = this.returningGull;
      const t = smooth((time - at) / 1.65);
      actor.mesh.position.lerp(start, 1 - t);
      actor.mesh.position.y += Math.sin(Math.PI * t) * 1.5;
      if (t >= 1) this.returningGull = undefined;
    }
    if (this.car) {
      const { actor, body } = this.car;
      body.setNextKinematicTranslation({ x: actor.mesh.position.x, y: actor.mesh.position.y + .86, z: actor.mesh.position.z });
    }
    if (this.hatch) {
      const { actor, collider, openedAt } = this.hatch;
      const { obj, mesh } = actor;
      if (openedAt !== null) {
        mesh.rotation.z = -smooth((time - openedAt) / .48) * Math.PI / 2;
        mesh.position.y = obj.position.y - smooth((time - openedAt) / .72) * 4.7;
        if (time - openedAt > .8) mesh.visible = false;
      } else if (position && player && time >= CAR_WAIT) {
        const top = obj.position.y + obj.scale.y / 2;
        const inside = Math.abs(position.x - obj.position.x) <= obj.scale.x / 2 - .3 &&
          Math.abs(position.z - obj.position.z) <= obj.scale.z / 2 - .3 &&
          Math.abs(position.y - top - player.radius) < .28;
        this.hatch.held = inside ? this.hatch.held + delta : 0;
        if (this.hatch.held >= HATCH_WAIT) {
          collider.setEnabled(false);
          this.hatch.openedAt = time;
        }
      }
    }
    if (this.wave) {
      const cycle = Math.floor(time / MAFALDA_CYCLE);
      const age = time % MAFALDA_CYCLE - HAND_IMPACT;
      this.wave.visible = age >= 0 && age < .95;
      if (this.wave.visible) {
        const radius = .8 + age * 30;
        this.wave.scale.set(radius,radius,1);
        this.wave.material.opacity = .52 * (1 - age / .95);
        if (player && position && this.lastQuake !== cycle && position.y < 1.5 &&
            Math.hypot(position.x - this.wave.position.x, position.z - this.wave.position.z) <= radius) {
          const velocity = player.linvel();
          player.setLinearVelocity({ x: Math.min(velocity.x * .25 - 18, -15), y: 10.5, z: velocity.z });
          this.lastQuake = cycle;
        }
      }
    }
    if (!player || !position) return;
    if (this.awaitingGullRespawn) {
      if (position.y <= -4) {
        player.respawn();
        this.awaitingGullRespawn = false;
        this.gullCooldown = time + 2.4;
        return true;
      }
      return;
    }
    if (this.capture) {
      const { actor, start, at, dropX } = this.capture;
      const progress = Math.min(1,(time - at) / 1.15);
      const t = smooth(progress);
      const x = THREE.MathUtils.lerp(start.x,dropX,t);
      const y = start.y + Math.sin(Math.PI*t*.85)*3.1;
      const z = start.z;
      actor.mesh.position.set(x,y+1.0,z);
      actor.mesh.rotation.y = Math.sign(dropX - start.x) * Math.PI / 2;
      player.teleportTo(x,y,z);
      position.set(x,y,z);
      if (progress === 1) {
        this.capture = undefined;
        this.returningGull = { actor, start: actor.mesh.position.clone(), at: time };
        this.awaitingGullRespawn = true;
        player.setLinearVelocity({ x: Math.sign(dropX - start.x) * 7, y: -3.5, z: 0 });
      }
      return;
    }
    if (time < this.gullCooldown || Math.abs(position.x) > 15 || position.y < -.8) return;
    for (const actor of this.actors) {
      if (actor.obj.properties?.asturiasAction === "gull" &&
          Math.hypot(position.x-actor.mesh.position.x,position.z-actor.mesh.position.z) < 1.48 &&
          Math.abs(position.y + .6 - actor.mesh.position.y) < .9) {
        const dropX = position.x < 0 ? -19 : 19;
        this.capture = { actor, start: position.clone(), at: time, dropX };
        break;
      }
    }
  }
}
