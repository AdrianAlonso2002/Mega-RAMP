import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

/** One animated assembly and one precise compound triangle surface, shared with the editor. */
export function createConcertModel(){
  const group=new THREE.Group(),meshes:THREE.Mesh[]=[];
  const red=new THREE.MeshStandardMaterial({color:0xb92f39,metalness:.42,roughness:.38});
  const chrome=new THREE.MeshStandardMaterial({color:0xb5c9cf,metalness:.72,roughness:.3});
  const gold=new THREE.MeshStandardMaterial({color:0xe9bc4c,metalness:.7,roughness:.28});
  const skin=new THREE.MeshStandardMaterial({color:0xf3e9d8,roughness:.8});
  const dark=new THREE.MeshStandardMaterial({color:0x263238,roughness:.65});
  const add=(name:string,geometry:THREE.BufferGeometry,material:THREE.Material,x:number,y:number,z:number)=>{
    const mesh=new THREE.Mesh(geometry,material);mesh.name=name;mesh.position.set(x,y,z);group.add(mesh);meshes.push(mesh);return mesh;
  };
  add('bass-drum',new THREE.CylinderGeometry(.85,.85,.8,20),red,0,1.45,-4.5).rotation.x=Math.PI/2;
  add('drum-skin',new THREE.CylinderGeometry(.81,.81,.025,20),skin,0,1.45,-4.085).rotation.x=Math.PI/2;
  for(const side of [-1,1]){
    add(`tom-${side}`,new THREE.CylinderGeometry(.34,.34,.42,16),red,side*.52,2.18,-4.55);
    add(`cymbal-${side}`,new THREE.CylinderGeometry(.57,.57,.035,20),gold,side*1.35,2.72,-4.4).rotation.z=side*.12;
    add(`cymbal-stand-${side}`,new THREE.CylinderGeometry(.045,.045,2.08,8),chrome,side*1.35,1.64,-4.4);
    add(`cymbal-foot-${side}`,new THREE.CylinderGeometry(.27,.27,.065,12),dark,side*1.35,.63,-4.4);
  }
  const shape=new THREE.Shape();shape.moveTo(0,-.45);shape.bezierCurveTo(-.55,-.5,-.55,.05,-.25,.16);shape.bezierCurveTo(-.42,.5,-.2,.62,0,.39);shape.bezierCurveTo(.2,.62,.42,.5,.25,.16);shape.bezierCurveTo(.55,.05,.55,-.5,0,-.45);
  const guitar=add('guitar-body',new THREE.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:true,bevelSize:.035,bevelThickness:.025,bevelSegments:2,curveSegments:8}),red,-3.8,1.08,1.5);guitar.rotation.z=.15;
  add('guitar-neck',new THREE.BoxGeometry(.14,1.05,.12),dark,-3.9,1.88,1.56).rotation.z=.15;
  add('guitar-base',new THREE.CylinderGeometry(.35,.35,.08,12),dark,-3.8,.04,1.5);
  add('guitar-stand',new THREE.CylinderGeometry(.045,.045,.68,8),chrome,-3.8,.38,1.5);
  add('microphone-base',new THREE.CylinderGeometry(.32,.32,.08,12),dark,0,.04,1);
  add('microphone-stand',new THREE.CylinderGeometry(.04,.04,1.9,8),chrome,0,.99,1);
  add('microphone-head',new THREE.CapsuleGeometry(.09,.18,3,8),dark,0,2,1).rotation.z=Math.PI/2;
  group.updateMatrixWorld(true);
  const parts=meshes.map(mesh=>{
    const geometry=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry.clone();geometry.applyMatrix4(mesh.matrix);return geometry;
  });
  const collisionGeometry=mergeGeometries(parts,false)!;
  // The kit moves as one piece: batch its visible parts into just five material draws.
  const batches=new Map<THREE.Material,THREE.BufferGeometry[]>();
  meshes.forEach((mesh,index)=>{const material=mesh.material as THREE.Material;const batch=batches.get(material)??[];batch.push(parts[index]);batches.set(material,batch);});
  group.clear();meshes.forEach(mesh=>mesh.geometry.dispose());meshes.length=0;
  for(const [material,geometries]of batches){const mesh=new THREE.Mesh(mergeGeometries(geometries,false)!,material);group.add(mesh);meshes.push(mesh);}
  parts.forEach(part=>part.dispose());
  return {group,meshes,collisionGeometry};
}

export function concertLift(time:number,speed=1.33):number{
  const phase=(time*Math.max(.25,speed))%1;
  return phase<.32 ? Math.sin(Math.PI*phase/.32)**2*.045:0;
}

/** Decorative flags never become invisible walls across the landing lane. */
export function createPlazaGarland(width:number){
  const group=new THREE.Group();
  const path=new THREE.CatmullRomCurve3([new THREE.Vector3(-width/2,0,0),new THREE.Vector3(0,-.45,0),new THREE.Vector3(width/2,0,0)]);
  const rope=new THREE.Mesh(new THREE.TubeGeometry(path,24,.025,5,false),new THREE.MeshStandardMaterial({color:0x607d8b,roughness:.8}));group.add(rope);
  const positions:number[]=[],colors:number[]=[];
  for(let i=0;i<12;i++){
    const point=path.getPoint((i+.5)/12),color=new THREE.Color(i%2?0xf0be3a:0xc94743);
    positions.push(point.x-.28,point.y-.04,0,point.x+.28,point.y-.04,0,point.x,point.y-.65,0);
    for(let n=0;n<3;n++)colors.push(color.r,color.g,color.b);
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();
  const flags=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,roughness:.85}));group.add(flags);
  return {group,meshes:[rope,flags]};
}
