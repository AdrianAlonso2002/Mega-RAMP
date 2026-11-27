import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { trimCachopoSurfaces } from "../src/levels/world-05/CachopoSurfaces";

describe("cachopo overlapping yellow and pink platforms", () => {
  it("leaves a single surface on shared tops and sides and removes buried end faces", () => {
    const root = new THREE.Group(), material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide});
    const a = new THREE.Mesh(new THREE.BoxGeometry(4,2,1),material),b = new THREE.Mesh(new THREE.BoxGeometry(4,2,1),material);
    b.position.x=1; root.add(a,b); root.updateMatrixWorld(true);
    const hits=(from:THREE.Vector3,direction:THREE.Vector3)=>new THREE.Raycaster(from,direction,0,20).intersectObjects([a,b]).map(hit=>hit.distance).filter((value,i,all)=>i===0||Math.abs(value-all[i-1])>.00001);
    expect(hits(new THREE.Vector3(1,0,5),new THREE.Vector3(0,0,-1))).toHaveLength(2);
    trimCachopoSurfaces([a,b]);
    // Both triangles of each shared wall used to be rendered twice at the same depth.
    const front = new THREE.Raycaster(new THREE.Vector3(.63,.23,5),new THREE.Vector3(0,0,-1),0,20).intersectObjects([a,b]);
    expect(front).toHaveLength(2); // one front face, one back face
    const top = new THREE.Raycaster(new THREE.Vector3(.63,5,.23),new THREE.Vector3(0,-1,0),0,20).intersectObjects([a,b]);
    expect(top).toHaveLength(2);
    expect(hits(new THREE.Vector3(5,.23,.13),new THREE.Vector3(-1,0,0))).toEqual([2,7]);
    root.rotation.z=.2;root.updateMatrixWorld(true);
    const origin=root.localToWorld(new THREE.Vector3(.63,.23,5)),direction=new THREE.Vector3(0,0,-1).applyQuaternion(root.quaternion);
    expect(new THREE.Raycaster(origin,direction,0,20).intersectObjects([a,b])).toHaveLength(2);
    a.geometry.dispose();b.geometry.dispose();material.dispose();
  });
});
