import * as THREE from 'three';
import type {Vector3Data} from '../levels/LevelTypes';

export const SPAWN_SELECTION=-2;
/** The saved spawn is the ball centre; yaw follows the same +X / -Z convention as gameplay. */
export function createSpawnMarker(position:Vector3Data,yaw:number,selected:boolean):THREE.Group {
  const group=new THREE.Group();group.name='editor-spawn';group.userData.objectIndex=SPAWN_SELECTION;group.position.set(position.x,position.y,position.z);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.85,selected?1.3:1.15,32).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:selected?0xffd54f:0x00e5ff,side:THREE.DoubleSide}));ring.position.y=-.73;group.add(ring);
  group.add(new THREE.Mesh(new THREE.SphereGeometry(.75,16,12),new THREE.MeshStandardMaterial({color:selected?0xffd54f:0x00e5ff,roughness:.3,transparent:true,opacity:selected?.8:.55})));
  const arrow=new THREE.ArrowHelper(new THREE.Vector3(Math.sin(yaw),0,-Math.cos(yaw)),new THREE.Vector3(0,.1,0),2.6,0xffeb3b,.7,.5);
  arrow.line.geometry=arrow.line.geometry.clone();arrow.cone.geometry=arrow.cone.geometry.clone();arrow.name='spawn-direction';group.add(arrow);
  return group;
}
