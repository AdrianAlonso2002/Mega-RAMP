import * as THREE from 'three';
import type {LevelData,LevelObjectData,Vector3Data} from '../LevelTypes';

export const PLAZA_FINALE_REVISION='plaza-finale-v1';
export const PLAZA_PRIZES:Record<number,Vector3Data[]>={
  9:[{x:-4.5,y:7.03,z:35},{x:4.5,y:7.03,z:35},{x:0,y:4.78,z:26},{x:0,y:2.81,z:17},{x:0,y:1.28,z:7},{x:-3.2,y:1.28,z:-1},{x:3.2,y:1.28,z:-2},{x:0,y:1.28,z:-7.2}],
  10:[{x:0,y:7.46,z:52},{x:0,y:5.84,z:47},{x:0,y:3.58,z:38},{x:0,y:5.38,z:30},{x:0,y:6.2,z:23},{x:0,y:1.18,z:12.5},{x:-4.5,y:1.18,z:0},{x:4.5,y:1.18,z:0},{x:4.5,y:1.18,z:-6},{x:0,y:1.18,z:-11}],
};

/** Extends only the two requested finales; subsequent saved edits retain their own spawn and layout. */
export function applyPlazaFinale(data:LevelData):LevelData {
  if(data.world!==1||data.level!==4||![9,10].includes(data.stage)||data.properties?.plazaFinaleRevision===PLAZA_FINALE_REVISION)return data;
  const prefix=`w1finale${data.stage}-`;
  data.objects=data.objects.filter(o=>!o.id.startsWith(prefix));
  const block=(id:string,position:Vector3Data,scale:Vector3Data,color='#607d8b'):LevelObjectData=>{
    const object:LevelObjectData={id:prefix+id,type:'platform',position,rotation:{x:0,y:0,z:0},scale,properties:{theme:'custom_color',customColor:color}};
    data.objects.push(object);return object;
  };
  const ramp=(id:string,from:Vector3Data,to:Vector3Data,width:number,color:string,rails=true)=>{
    const a=new THREE.Vector3(from.x,from.y,from.z),b=new THREE.Vector3(to.x,to.y,to.z),forward=b.clone().sub(a),length=forward.length();forward.normalize();
    const right=new THREE.Vector3(forward.z,0,-forward.x).normalize(),normal=new THREE.Vector3().crossVectors(forward,right),mid=a.clone().add(b).multiplyScalar(.5);
    const euler=new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().makeBasis(right,normal,forward),'YXZ');
    const rotation={x:euler.x,y:euler.y,z:euler.z},center=mid.clone().addScaledVector(normal,-.18);
    const deck=block(id,center,{x:width,y:.36,z:length+.03},color);deck.type='ramp';deck.rotation={...rotation};
    if(rails)for(const side of [-1,1]){
      const edge=mid.clone().addScaledVector(right,side*(width/2+.04)).addScaledVector(normal,.22);
      const rail=block(`${id}-rail-${side}`,edge,{x:.16,y:.5,z:length+.03},'#a9bec7');rail.rotation={...rotation};
    }
  };
  if(data.stage===9){
    data.spawn={x:-6,y:8.05,z:40};
    block('lighting-deck',{x:0,y:6.75,z:40},{x:16,y:.5,z:4},'#455a64');
    block('deck-back-rail',{x:0,y:7.3,z:42},{x:16,y:.6,z:.2});
    for(const x of [-7,7])for(const z of [39,41])block(`tower-${x}-${z}`,{x,y:3.25,z},{x:.3,y:6.5,z:.3});
    for(const x of [-6,6])ramp(`y-arm-${x}`,{x,y:7,z:38},{x:0,y:4,z:26},3.6,'#546e7a');
    block('junction',{x:0,y:3.8,z:26},{x:4.8,y:.4,z:3},'#78909c');
    ramp('y-stem',{x:0,y:4,z:25},{x:0,y:.5,z:10},4.4,'#546e7a');
  }else{
    data.spawn={x:0,y:8.05,z:56};
    block('launch-deck',{x:0,y:6.75,z:56},{x:6,y:.5,z:6},'#90a4ae');
    block('launch-back-rail',{x:0,y:7.3,z:59},{x:6,y:.6,z:.2});
    ramp('run-in',{x:0,y:7,z:53},{x:0,y:2.8,z:40},6,'#90a4ae');
    ramp('run-out',{x:0,y:2.8,z:40},{x:0,y:2.8,z:36},6,'#b0bec5');
    ramp('take-off',{x:0,y:2.8,z:36},{x:0,y:4.6,z:30},6,'#e0bb59');
    block('landing-apron',{x:0,y:.15,z:18},{x:12,y:.5,z:4},'#cfd8dc');
    const curb=data.objects.find(o=>o.id==='s10-plaza-curb-s');
    if(curb){curb.position.x=-9;curb.scale.x=8;const right=structuredClone(curb);right.id=prefix+'receiving-curb-r';right.position.x=9;data.objects.push(right);}
    // The welcome lane must be clear of the overhead garlands while landing.
    for(const garland of data.objects.filter(o=>o.id.startsWith('s10-garland-'))){garland.type='decoration';garland.properties={...garland.properties,subType:'plaza_finale_garland',hasCollision:false};}
  }
  const ids=data.objects.filter(o=>o.type==='collectible');
  ids.forEach((prize,index)=>{const point=PLAZA_PRIZES[data.stage][index];if(point)prize.position={...point};});
  data.timeLimit=Math.max(90,data.timeLimit);
  data.properties={...data.properties,spawnYaw:0,plazaFinaleRevision:PLAZA_FINALE_REVISION};
  return data;
}
