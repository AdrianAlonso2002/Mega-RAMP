import * as THREE from 'three';

/** Local-space triangles for one rigid assembly; render meshes remain untouched. */
export function meshColliderData(meshes:THREE.Mesh[],root?:THREE.Object3D):{vertices:Float32Array;indices:Uint32Array} {
  root?.updateWorldMatrix(true,true);
  const inverse=root?root.matrixWorld.clone().invert():undefined,matrix=new THREE.Matrix4();
  let vertexCount=0,indexCount=0;
  for(const mesh of meshes){const count=mesh.geometry.getAttribute('position').count;vertexCount+=count;indexCount+=mesh.geometry.index?.count??count;}
  const vertices=new Float32Array(vertexCount*3),indices=new Uint32Array(indexCount),point=new THREE.Vector3();
  let vertexOffset=0,indexOffset=0;
  for(const mesh of meshes) {
    mesh.updateMatrix();const positions=mesh.geometry.getAttribute('position'),index=mesh.geometry.index;
    if(inverse)matrix.multiplyMatrices(inverse,mesh.matrixWorld);else matrix.copy(mesh.matrix);
    for(let i=0;i<positions.count;i++){point.fromBufferAttribute(positions,i).applyMatrix4(matrix);point.toArray(vertices,(vertexOffset+i)*3);}
    for(let i=0;i<(index?.count??positions.count);i++)indices[indexOffset++]=vertexOffset+(index?index.getX(i):i);
    vertexOffset+=positions.count;
  }
  return {vertices,indices};
}
