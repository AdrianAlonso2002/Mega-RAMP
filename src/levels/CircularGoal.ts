import * as THREE from 'three';
/** Local-space model shared by gameplay and the 3D editor. */
export function createCircularGoal(size=1.5):{group:THREE.Group;portalMesh:THREE.Mesh} {
 const group=new THREE.Group(),radius=1.6*size,centerY=1.8*size;
 group.name='circular-goal';group.userData.goalCircle={radius,centerY};
 const frame=new THREE.Mesh(new THREE.TorusGeometry(1.7*size,.1*size,12,64),new THREE.MeshStandardMaterial({color:0xffd700,metalness:.65,roughness:.35}));
 frame.name='circular-goal-frame';frame.position.y=centerY;group.add(frame);
 const neon=new THREE.Mesh(new THREE.TorusGeometry(1.605*size,.018*size,6,64),new THREE.MeshBasicMaterial({color:0x00e5ff}));
 neon.position.set(0,centerY,.04*size);group.add(neon);
 const portalMesh=new THREE.Mesh(new THREE.CircleGeometry(radius,64),new THREE.MeshBasicMaterial({color:0x68e9ff,transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide}));
 portalMesh.name='goalPortal';portalMesh.position.y=centerY;portalMesh.renderOrder=8;group.add(portalMesh);
 return {group,portalMesh};
}
