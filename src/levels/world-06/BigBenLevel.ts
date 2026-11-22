import * as THREE from "three";
import type RAPIER from "@dimforge/rapier3d-compat";
import type { LevelData, LevelObjectData } from "../LevelTypes";
import type { PhysicsWorld } from "../../physics/PhysicsWorld";
import type { Player } from "../../player/Player";
import type { ActiveGoal } from "../LevelBuilder";
import { previewBigBenActor } from "./BigBenModels";
import { EYE_RADIUS, EYE_CENTRE_Y, PORTAL_MIN_SPEED } from "./BigBenRoutes";
import type { InputAxis } from "../../input/InputManager";
interface Actor {
  obj: LevelObjectData;
  mesh: THREE.Group;
  body?: RAPIER.RigidBody;
  barrier?: RAPIER.Collider;
  previous: THREE.Matrix4;
  cooldown: number;
}
const planeFootprint = (x: number, z: number) =>
  (Math.abs(x) < 6.7 && Math.abs(z) < 2.7) ||
  (Math.abs(x) < 1.25 && Math.abs(z) < 5.8) ||
  (Math.abs(x) < 2.2 && z > 2.6 && z < 4.8);
export class BigBenLevel {
  finishRequested = false;
  failed = false;
  private time = 0;
  private stopped = false;
  private wheelVisitedTop = false;
  private readonly actors: Actor[] = [];
  private readonly local = new THREE.Vector3();
  private readonly point = new THREE.Vector3();
  private readonly inverse = new THREE.Matrix4();
  private readonly quaternion = new THREE.Quaternion();
  private goal?: ActiveGoal;
  private rider?: Actor;
  private readonly riderLocal = new THREE.Vector3();
  private readonly riderVelocity = new THREE.Vector3();
  private readonly oldPoint = new THREE.Vector3();
  private readonly carrierVelocity = new THREE.Vector3();
  constructor(
    private readonly data: LevelData,
    private readonly physics: PhysicsWorld,
  ) {}
  get controlsGoal(): boolean {
    return this.data.stage === 9;
  }
  get wheelElapsed(): number {
    return this.time;
  }
  attach(
    obj: LevelObjectData,
    mesh: THREE.Group,
    solids: THREE.Mesh[] = [],
  ): boolean {
    const action = obj.properties?.benAction;
    if (!action) return false;
    mesh.updateWorldMatrix(true, true);
    const actor: Actor = {
      obj,
      mesh,
      previous: mesh.matrixWorld.clone(),
      cooldown: -10,
    };
    this.actors.push(actor);
    if (action === "portal") {
      const gate = this.physics.createKinematicBox(
        mesh.position,
        mesh.quaternion,
        { x: 1, y: 4.5, z: 1 },
        0.7,
        0,
        { x: 0, y: 4.5, z: 0 },
      );
      actor.body = gate?.body;
      actor.barrier = gate?.collider;
    } else if (action === "plane") {
      // Use the actual wing, fuselage, cockpit, nose and tail geometry as the moving collider.
      const inverse = mesh.matrixWorld.clone().invert(),
        scale = mesh.getWorldScale(new THREE.Vector3());
      for (const solid of solids) {
        const geometry = solid.geometry
          .clone()
          .applyMatrix4(
            new THREE.Matrix4().multiplyMatrices(inverse, solid.matrixWorld),
          )
          .scale(scale.x, scale.y, scale.z);
        const vertices = geometry.getAttribute("position")
            .array as Float32Array,
          indices = geometry.index
            ? new Uint32Array(geometry.index.array)
            : Uint32Array.from({ length: vertices.length / 3 }, (_, i) => i);
        if (!actor.body)
          actor.body = this.physics.createKinematicTrimesh(
            mesh.position,
            vertices,
            indices,
            0,
            0,
            mesh.quaternion,
          )?.body;
        else
          this.physics.addTrimeshColliderToBody(
            actor.body,
            vertices,
            indices,
            0,
            0,
          );
        geometry.dispose();
      }
      if (actor.body) this.physics.setPassengerFloorFriction(actor.body);
    } else if (action === "cabin") {
      // Analytic boxes match the visible shell without internal triangle edges on the floor.
      actor.body = this.physics.createKinematicBox(
        mesh.position,
        mesh.quaternion,
        { x: 2.5, y: 0.175, z: 2.1 },
        0,
        0,
        { x: 0, y: -0.175, z: 0 },
      )?.body;
      if (actor.body) {
        const box = (
          x: number,
          y: number,
          z: number,
          hx: number,
          hy: number,
          hz: number,
        ) =>
          this.physics.addBoxColliderToBody(
            actor.body!,
            { x, y, z },
            { x: hx, y: hy, z: hz },
            0,
            0,
          );
        box(0, 3.6, 0, 2.6, 0.125, 2.2);
        for (const z of [-2, 2]) {
          box(0, 3.4, z, 2.5, 0.09, 0.1);
          for (const x of [-1.9, 1.9]) box(x, 0.55, z, 0.6, 0.325, 0.075);
          for (const x of [-2.3, 2.3]) box(x, 1.7, z, 0.06, 1.75, 0.06);
        }
        for (const side of [-1, 1]) {
          box(side * 2.45, 0.525, 0, 0.075, 0.525, 2);
          box(side * 2.45, 2.15, 0, 0.0325, 1.05, 1.95);
          box(side * 2.6, 3.4, 0, 0.09, 0.15, 2.2);
        }
        this.physics.setPassengerFloorFriction(actor.body);
      }
    } else if (action === "guard")
      actor.body = this.physics.createKinematicBox(
        mesh.position,
        mesh.quaternion,
        { x: 2.6, y: 1.8, z: 2.7 },
        0.6,
        0,
        { x: 0, y: 2, z: 0 },
      )?.body;
    else if (action === "trap")
      actor.body = this.physics.createKinematicBox(
        mesh.position,
        mesh.quaternion,
        { x: 1.5, y: 0.65, z: 1.2 },
        0.8,
        0.4,
      )?.body;
    return true;
  }
  attachGoal(goal: ActiveGoal): void {
    this.goal = goal;
  }
  animatePreview(time: number): void {
    for (const a of this.actors) previewBigBenActor(a.obj, a.mesh, time);
  }
  update(
    delta: number,
    player: Player,
    input: InputAxis = { horizontal: 0, vertical: 0 },
    camera: THREE.Camera = new THREE.Camera(),
  ):
    | { position: THREE.Vector3; velocity: THREE.Vector3; fellOut: boolean }
    | undefined {
    if (this.stopped) return;
    this.time += delta;
    let candidate: Actor | undefined;
    for (const a of this.actors) {
      const action = a.obj.properties?.benAction;
      const position = player.getBody()?.translation() ?? player.getPosition();
      this.inverse.copy(a.previous).invert();
      this.local.copy(position).applyMatrix4(this.inverse);
      const onPlane =
        action === "plane" &&
        planeFootprint(this.local.x, this.local.z) &&
        this.local.y > 0.5 &&
        this.local.y < 3.4;
      const onCabin =
        action === "cabin" &&
        Math.abs(this.local.x) < 2.5 &&
        Math.abs(this.local.z) < 2.1 &&
        (Math.abs(this.local.y - 0.75) < 0.22 ||
          Math.abs(this.local.y - 4.475) < 0.22);
      const animationTime =
        action === "wheel" || action === "cabin"
          ? this.wheelElapsed
          : this.time;
      previewBigBenActor(a.obj, a.mesh, animationTime);
      a.mesh.updateWorldMatrix(true, true);
      if (
        (onPlane || onCabin) &&
        player.linvel().y < 5 &&
        (!candidate || a === this.rider)
      )
        candidate = a;
      if (a.body) {
        a.mesh.getWorldQuaternion(this.quaternion);
        a.body.setNextKinematicTranslation(a.mesh.position);
        a.body.setNextKinematicRotation(this.quaternion);
      }
      const p = player.getBody()?.translation() ?? player.getPosition();
      const velocity = player.linvel(),
        fastEnough =
          Math.hypot(velocity.x, velocity.z) >= PORTAL_MIN_SPEED - 1e-6;
      a.barrier?.setEnabled(!fastEnough);
      if (
        action === "portal" &&
        fastEnough &&
        Math.abs(p.x - a.obj.position.x) < 1.8 &&
        Math.abs(p.z - a.obj.position.z) < 1.8 &&
        p.y > 11 &&
        p.y < 20
      ) {
        player.teleportTo(80, 13.1, 5);
        player.setLinearVelocity({ x: 0, y: 0, z: -2 });
      }
      if (
        action === "guard" &&
        this.time - a.cooldown > 0.8 &&
        Math.abs(p.x - a.mesh.position.x) < 3.35 &&
        Math.abs(p.z - a.mesh.position.z) < 3.5 &&
        p.y < 18 &&
        p.y > 11
      ) {
        a.cooldown = this.time;
        const side = p.x >= a.mesh.position.x ? 1 : -1;
        player.setLinearVelocity({
          x: side * 22,
          y: 7,
          z: (p.z >= a.mesh.position.z ? 1 : -1) * 7,
        });
      }
      if (
        action === "chocolate" &&
        Math.hypot(p.x - a.mesh.position.x, p.z - a.mesh.position.z) < 1.5 &&
        p.y > a.mesh.position.y &&
        p.y < a.mesh.position.y + Number(a.obj.properties?.height ?? 66)
      )
        this.failed = true;
    }
    let motion: ReturnType<Player["update"]> | undefined;
    if (this.rider && !candidate) {
      if (this.rider.obj.properties?.benAction === "cabin") {
        this.riderVelocity.copy(player.linvel()).add(this.carrierVelocity);
        player.setLinearVelocity(this.riderVelocity);
      }
      this.rider = undefined;
    }
    if (candidate) {
      this.rider = candidate;
      // Physics already integrated the relative walk and contacts; only add carrier displacement.
      // Reintegrating a second walk here would allow the ball to pass through the plane's body.
      this.inverse.copy(candidate.previous).invert();
      this.riderLocal
        .copy(player.getBody()!.translation())
        .applyMatrix4(this.inverse);
      this.riderVelocity.copy(player.linvel());
      const cabin = candidate.obj.properties?.benAction === "cabin";
      if (cabin) {
        this.oldPoint.copy(this.riderLocal).applyMatrix4(candidate.previous);
        this.riderLocal.y = this.riderLocal.y > 2 ? 4.475 : 0.75;
        this.point
          .copy(this.riderLocal)
          .applyMatrix4(candidate.mesh.matrixWorld);
        this.carrierVelocity
          .copy(this.point)
          .sub(this.oldPoint)
          .divideScalar(Math.max(delta, 0.001));
        this.riderVelocity.y = 0;
        if (candidate.mesh.position.y > EYE_CENTRE_Y + EYE_RADIUS - 4)
          this.wheelVisitedTop = true;
      }
      this.point.copy(this.riderLocal).applyMatrix4(candidate.mesh.matrixWorld);
      player.teleportTo(this.point.x, this.point.y, this.point.z);
      player.setLinearVelocity(this.riderVelocity);
      motion = player.update(delta, input, camera);
    }
    for (const a of this.actors) a.previous.copy(a.mesh.matrixWorld);
    const p = player.getBody()?.translation() ?? player.getPosition();
    if (
      this.data.stage === 9 &&
      this.wheelVisitedTop &&
      this.goal &&
      p.y < 17 &&
      Math.hypot(p.x - this.goal.position.x, p.z - this.goal.position.z) < 2
    )
      this.finishRequested = true;
    if (this.failed)
      return {
        position: new THREE.Vector3().copy(p),
        velocity: new THREE.Vector3().copy(player.linvel()),
        fellOut: true,
      };
    return motion;
  }
  stop(): void {
    this.stopped = true;
  }
  reset(): void {
    this.time = 0;
    this.stopped = false;
    this.failed = false;
    this.finishRequested = false;
    this.wheelVisitedTop = false;
    this.rider = undefined;
    this.riderVelocity.set(0, 0, 0);
    this.carrierVelocity.set(0, 0, 0);
    for (const a of this.actors) {
      a.cooldown = -10;
      a.barrier?.setEnabled(true);
      previewBigBenActor(a.obj, a.mesh, 0);
      a.mesh.updateWorldMatrix(true, true);
      a.previous.copy(a.mesh.matrixWorld);
      if (a.body) {
        a.body.setTranslation(a.mesh.position, true);
        a.body.setRotation(a.mesh.quaternion, true);
      }
    }
  }
  destroy(): void {
    this.actors.length = 0;
    this.goal = undefined;
  }
}
