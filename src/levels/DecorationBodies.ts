import * as THREE from "three";
import type RAPIER from "@dimforge/rapier3d-compat";
import type { PhysicsWorld } from "../physics/PhysicsWorld";

/** Fallback surfaces follow animated decorations that have no dedicated physics. */
export class DecorationBodies {
  private readonly parts: { mesh: THREE.Mesh; body: RAPIER.RigidBody }[] = [];
  private readonly position = new THREE.Vector3();
  private readonly rotation = new THREE.Quaternion();
  private readonly scale = new THREE.Vector3();

  constructor(private readonly physics: PhysicsWorld) {}

  attach(mesh: THREE.Mesh): void {
    mesh.updateWorldMatrix(true, false);
    mesh.matrixWorld.decompose(this.position, this.rotation, this.scale);
    const geometry = mesh.geometry
      .clone()
      .scale(this.scale.x, this.scale.y, this.scale.z);
    const vertices = new Float32Array(geometry.getAttribute("position").array);
    const indices = geometry.index
      ? new Uint32Array(geometry.index.array)
      : Uint32Array.from({ length: vertices.length / 3 }, (_, i) => i);
    const created = this.physics.createKinematicTrimesh(
      this.position,
      vertices,
      indices,
      0.035,
      0.72,
      this.rotation,
    );
    geometry.dispose();
    if (created) this.parts.push({ mesh, body: created.body });
  }

  update(): void {
    for (const { mesh, body } of this.parts) {
      mesh.updateWorldMatrix(true, false);
      mesh.matrixWorld.decompose(this.position, this.rotation, this.scale);
      body.setNextKinematicTranslation(this.position);
      body.setNextKinematicRotation(this.rotation);
    }
  }
}
