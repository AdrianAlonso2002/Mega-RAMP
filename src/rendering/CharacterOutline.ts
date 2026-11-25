import * as THREE from 'three';

/** The PNG artwork contains its normalized outline; do not add a second stroke. */
export function createCharacterSpriteMaterial(map:THREE.Texture):THREE.SpriteMaterial {
  return new THREE.SpriteMaterial({map,transparent:true,depthTest:true,depthWrite:false,alphaTest:.04});
}
