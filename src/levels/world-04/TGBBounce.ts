import * as THREE from "three";
import type RAPIER from "@dimforge/rapier3d-compat";
import type { PhysicsWorld } from "../../physics/PhysicsWorld";
import { TGB_LAUNCH_SPEED } from "./TGBBounceSettings";
interface Pad {
  collider: RAPIER.Collider;
  center: THREE.Vector3;
  inverse: THREE.Quaternion;
  radius: number;
  halfHeight: number;
  last: number;
}
interface BouncingPlayer {
  radius?: number;
  getBody(): RAPIER.RigidBody | null | undefined;
  setLinearVelocity(velocity: { x: number; y: number; z: number }): void;
}
/** Static burgers keep zero restitution: falling speed can never amplify the next bounce. */
export class TGBBounce {
  private pads: Pad[] = [];
  private readonly local = new THREE.Vector3();
  constructor(private readonly physics: PhysicsWorld) {}
  add(collider: RAPIER.Collider, radius: number, halfHeight: number): void {
    this.pads.push({
      collider,
      center: new THREE.Vector3().copy(collider.translation()),
      inverse: new THREE.Quaternion().copy(collider.rotation()).invert(),
      radius,
      halfHeight,
      last: -Infinity,
    });
  }
  update(
    time: number,
    position: THREE.Vector3 | undefined,
    player: BouncingPlayer | undefined,
  ): void {
    const body = player?.getBody(),
      world = this.physics.getWorld();
    if (!body || !world || !position || body.numColliders() === 0) return;
    const velocity = body.linvel();
    if (velocity.y > 1) return;
    const radius = player?.radius ?? 0.75;
    for (const pad of this.pads) {
      if (time - pad.last < 0.25) continue;
      this.local.copy(position).sub(pad.center).applyQuaternion(pad.inverse);
      if (
        this.local.y < pad.halfHeight + radius * 0.35 ||
        this.local.y > pad.halfHeight + radius + 0.2 ||
        Math.hypot(this.local.x, this.local.z) > pad.radius + radius * 0.5
      )
        continue;
      let contact = false;
      world.contactPair(body.collider(0), pad.collider, (manifold) => {
        for (let i = 0; i < manifold.numSolverContacts(); i++)
          if (manifold.solverContactDist(i) <= 0.06) contact = true;
      });
      if (!contact) continue;
      player!.setLinearVelocity({
        x: velocity.x,
        y: TGB_LAUNCH_SPEED,
        z: velocity.z,
      });
      pad.last = time;
      return;
    }
  }
  reset(): void {
    for (const pad of this.pads) pad.last = -Infinity;
  }
}
