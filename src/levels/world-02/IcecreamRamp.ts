import * as THREE from 'three';
import {icecreamRoute} from './CoastalFinale';

/** A single closed ribbon, with shared cross sections and no overlapping ramp ends. */
export function createIcecreamRamp():THREE.Mesh {
  const points=icecreamRoute(),positions:number[]=[],indices:number[]=[],tangent=new THREE.Vector3();
  for(let i=0;i<points.length;i++) {
    const point=points[i],previous=points[Math.max(0,i-1)],next=points[Math.min(points.length-1,i+1)];
    tangent.set(next.x-previous.x,0,next.z-previous.z).normalize();
    const nx=-tangent.z,nz=tangent.x;
    for(const [sign,drop]of [[-1,0],[1,0],[-1,-.3],[1,-.3]])positions.push(point.x+nx*point.width/2*sign,point.y+drop,point.z+nz*point.width/2*sign);
    if(i){const a=(i-1)*4,b=i*4;for(const [u,v]of [[0,1],[1,3],[3,2],[2,0]])indices.push(a+u,a+v,b+u,a+v,b+v,b+u);}
  }
  const last=(points.length-1)*4;indices.push(0,1,2,2,1,3,last,last+2,last+1,last+1,last+2,last+3);
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
  const material=new THREE.MeshStandardMaterial({color:0xf1e4ce,roughness:.7});material.userData.graphicsSurface='stone';
  const mesh=new THREE.Mesh(geometry,material);mesh.name='icecream-continuous-ramp';return mesh;
}
