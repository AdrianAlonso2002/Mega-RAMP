import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
/** Closed annular tread and tall sidewalls: smooth seam and a hollow centre. */
export function createWheelTrainMesh(radius:number,width:number,quality:'low'|'medium'|'high'='medium') {
  const group=new THREE.Group();group.name='wheel-train';
  const segments=quality==='low'?64:quality==='high'?128:96;
  const ring=(inner:number,outer:number,left:number,right:number)=>{
    const positions:number[]=[],indices:number[]=[];
    for(let i=0;i<=segments;i++){
      const a=i*2*Math.PI/segments,c=Math.cos(a),s=Math.sin(a);
      for(const [x,r] of [[left,inner],[left,outer],[right,outer],[right,inner]])positions.push(x,c*r,s*r);
    }
    for(let i=0;i<segments;i++)for(let face=0;face<4;face++){
      const a=i*4+face,b=i*4+(face+1)%4,c=b+4,d=a+4;
      indices.push(a,c,b,a,d,c);
    }
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
    // Weld lighting across the duplicated 0/2pi seam without changing collision topology.
    const normals=geometry.getAttribute('normal');
    for(let j=0;j<4;j++){
      const last=segments*4+j,n=new THREE.Vector3().fromBufferAttribute(normals,j).add(new THREE.Vector3().fromBufferAttribute(normals,last)).normalize();
      normals.setXYZ(j,n.x,n.y,n.z);normals.setXYZ(last,n.x,n.y,n.z);
    }
    return geometry;
  };
  const tireMat=new THREE.MeshStandardMaterial({color:0x33434c,roughness:.85});
  const brassMat=new THREE.MeshStandardMaterial({color:0xe9a52c,roughness:.55,metalness:.15});
  const tread=new THREE.Mesh(ring(radius-.32,radius,-width/2,width/2),tireMat);tread.name='wheel-tread';group.add(tread);
  const walls=[ring(radius-.32,radius+.9,-width/2-.15,-width/2),ring(radius-.32,radius+.9,width/2,width/2+.15)];
  const rim=new THREE.Mesh(mergeGeometries(walls),brassMat);rim.name='wheel-sidewalls';group.add(rim);walls.forEach(g=>g.dispose());
  const pieces:THREE.BufferGeometry[]=[];
  // Spokes are recessed inside the ring; shallow transverse cleats help the ball climb.
  for(let i=0;i<12;i++){
    const a=i*2*Math.PI/12;
    if(i<6){const spoke=new THREE.BoxGeometry(.18,radius*1.92,.14);spoke.rotateX(a);pieces.push(spoke);}
    const cleat=new THREE.BoxGeometry(width,.28,.18);cleat.translate(0,radius+.14,0);cleat.rotateX(a);pieces.push(cleat);
  }
  const fittings=new THREE.Mesh(mergeGeometries(pieces),brassMat);fittings.name='wheel-spokes-cleats';group.add(fittings);pieces.forEach(g=>g.dispose());
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,width+.4,16),brassMat);hub.rotation.z=Math.PI/2;group.add(hub);
  const meshes=[tread,rim,fittings,hub];return {group,meshes,tireMesh:tread};
}
