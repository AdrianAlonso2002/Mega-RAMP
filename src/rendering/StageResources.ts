import * as THREE from 'three';

const sharedTextures=new WeakSet<THREE.Texture>();
export function retainSharedTexture<T extends THREE.Texture>(texture:T):T {
  sharedTextures.add(texture);return texture;
}

/** The cache owns these textures across stages; a stage only owns its materials. */
export class SharedTextureCache<T extends THREE.Texture> extends Map<string,T> {
  override set(key:string,texture:T):this {retainSharedTexture(texture);return super.set(key,texture);}
}

/** Release each owned GPU resource once, preserving cached textures for the next stage. */
export function disposeStageResources(root:THREE.Object3D):void {
  const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();
  root.traverse(node=>{
    node.userData.sellaWater?.dispose();
    if(node instanceof THREE.InstancedMesh)node.dispose();
    if(node instanceof THREE.Mesh||node instanceof THREE.Points||node instanceof THREE.Line)geometries.add(node.geometry);
    if(node instanceof THREE.Mesh||node instanceof THREE.Sprite||node instanceof THREE.Points||node instanceof THREE.Line){
      for(const material of Array.isArray(node.material)?node.material:[node.material])materials.add(material);
    }
  });
  for(const material of materials){
    for(const value of Object.values(material))if(value instanceof THREE.Texture&&!sharedTextures.has(value))textures.add(value);
    material.dispose();
  }
  for(const texture of textures)texture.dispose();
  for(const geometry of geometries)geometry.dispose();
}
