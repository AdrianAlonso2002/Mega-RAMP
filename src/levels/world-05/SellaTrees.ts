import * as THREE from "three";
import type RAPIER from "@dimforge/rapier3d-compat";
import type { PhysicsWorld } from "../../physics/PhysicsWorld";

/** Keep the instanced rendering, but give every trunk and crown its actual convex collision shape. */
export function attachSellaTrees(group:THREE.Object3D,physics:PhysicsWorld,cameraMeshes:THREE.Mesh[],hazard?:(collider:RAPIER.Collider|null)=>void):void {
  group.updateWorldMatrix(true,true);
  const instance=new THREE.Matrix4(),world=new THREE.Matrix4();
  for(const name of ["sella-trunks","sella-leaves"]) {
    const mesh=group.getObjectByName(name);
    if(!(mesh instanceof THREE.InstancedMesh)) continue;
    mesh.userData.blocksCameraOnSlopes=true;cameraMeshes.push(mesh);
    for(let i=0;i<mesh.count;i++) {
      mesh.getMatrixAt(i,instance);world.multiplyMatrices(mesh.matrixWorld,instance);
      const geometry=mesh.geometry.clone().applyMatrix4(world);
      const collider=physics.createConvexCollider(geometry.getAttribute("position").array as Float32Array);
      hazard?.(collider);geometry.dispose();
    }
  }
}
