import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/** The rendered rails and the carriage use exactly the same closed centreline. */
export function tramTrack(width:number,length:number,radius:number) {
  const w=Math.max(4,width),l=Math.max(4,length),r=Math.max(.1,Math.min(radius,w/2-.1,l/2-.1));
  const sx=w-2*r,sz=l-2*r,arc=Math.PI*r/2,perimeter=2*sx+2*sz+4*arc;
  function sample(distance:number,out:{x:number;z:number;yaw:number}) {
    let d=((distance%perimeter)+perimeter)%perimeter;
    const lengths=[sx,arc,sz,arc,sx,arc,sz,arc];
    const corners=[[w/2-r,l/2-r],[w/2-r,-l/2+r],[-w/2+r,-l/2+r],[-w/2+r,l/2-r]];
    for(let segment=0;segment<8;segment++) {
      if(d>lengths[segment]&&segment<7){d-=lengths[segment];continue;}
      if(segment%2){const c=(segment-1)/2,a=Math.PI/2-c*Math.PI/2-d/r;
        out.x=corners[c][0]+r*Math.cos(a);out.z=corners[c][1]+r*Math.sin(a);out.yaw=Math.PI/2+c*Math.PI/2+d/r;
      }else {const side=segment/2;out.yaw=Math.PI/2+side*Math.PI/2;
        if(side===0){out.x=-w/2+r+d;out.z=l/2;}
        else if(side===1){out.x=w/2;out.z=l/2-r-d;}
        else if(side===2){out.x=w/2-r-d;out.z=-l/2;}
        else {out.x=-w/2;out.z=-l/2+r+d;}
      }
      return out;
    }
    return out;
  }
  return {perimeter,sample};
}

export function createClosedTramRails(width:number,length:number,radius:number):THREE.Group {
  const group=new THREE.Group(),track=tramTrack(width,length,radius),pose={x:0,z:0,yaw:0};
  const steps=Math.max(96,Math.ceil(track.perimeter/.35));
  function strip(offset:number,halfWidth:number,bottom:number,top:number) {
    const positions:number[]=[],indices:number[]=[];
    for(let i=0;i<=steps;i++) {
      track.sample(i/steps*track.perimeter,pose);
      const nx=Math.cos(pose.yaw),nz=-Math.sin(pose.yaw);
      for(const [side,y] of [[-1,bottom],[1,bottom],[-1,top],[1,top]])positions.push(pose.x+nx*(offset+side*halfWidth),y,pose.z+nz*(offset+side*halfWidth));
      if(i){const a=(i-1)*4,b=i*4;for(const [u,v]of [[0,1],[1,3],[3,2],[2,0]])indices.push(a+u,a+v,b+u,a+v,b+v,b+u);}
    }
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
  }
  const bed=new THREE.Mesh(strip(0,1.6,0,.18),new THREE.MeshStandardMaterial({color:0x455a64,roughness:.8}));
  const railParts=[strip(-1.1,.05,.29,.41),strip(1.1,.05,.29,.41)];
  const rails=new THREE.Mesh(mergeGeometries(railParts),new THREE.MeshStandardMaterial({color:0xcfd8dc,roughness:.25,metalness:.85}));railParts.forEach(g=>g.dispose());
  const count=Math.ceil(track.perimeter/1.4),ties=new THREE.InstancedMesh(new THREE.BoxGeometry(2.8,.14,.35),new THREE.MeshStandardMaterial({color:0x5d4037,roughness:.65}),count);
  const matrix=new THREE.Matrix4(),q=new THREE.Quaternion(),yAxis=new THREE.Vector3(0,1,0),position=new THREE.Vector3(),scale=new THREE.Vector3(1,1,1);
  for(let i=0;i<count;i++){track.sample(i/count*track.perimeter,pose);position.set(pose.x,.22,pose.z);q.setFromAxisAngle(yAxis,pose.yaw);ties.setMatrixAt(i,matrix.compose(position,q,scale));}
  ties.computeBoundingSphere();group.add(bed,ties,rails);return group;
}

/** Physical cabin walls remain active; this guard closes numerical tunnelling gaps. */
export class TramPassengerGuard {
  private attached=false;
  private readonly local=new THREE.Vector3();private readonly velocity=new THREE.Vector3();private readonly inverse=new THREE.Quaternion();
  constructor(private width:number,private height:number,private length:number){}
  reset(){this.attached=false;}
  constrain(position:THREE.Vector3,velocity:THREE.Vector3,origin:{x:number;y:number;z:number},rotation:{x:number;y:number;z:number;w:number},radius=.75):boolean {
    this.inverse.set(rotation.x,rotation.y,rotation.z,rotation.w).invert();
    this.local.copy(position).sub(origin).applyQuaternion(this.inverse);
    if(!this.attached){this.attached=Math.abs(this.local.x)<this.width/2&&Math.abs(this.local.z)<this.length/2&&this.local.y>-.5&&this.local.y<this.height/2+2.6;if(!this.attached)return false;}
    const x=Math.max(0,this.width/2-.24-radius-.02),z=Math.max(0,this.length/2-.24-radius-.02),bottom=this.height/2+radius+.01,top=Math.max(bottom,this.height/2+2.45-radius-.01);
    this.velocity.copy(velocity).applyQuaternion(this.inverse);let changed=false;
    for(const [axis,low,high]of [['x',-x,x],['y',bottom,top],['z',-z,z]] as const){const v=this.local[axis],clamped=THREE.MathUtils.clamp(v,low,high);if(v!==clamped){this.local[axis]=clamped;if(v<low&&this.velocity[axis]<0||v>high&&this.velocity[axis]>0)this.velocity[axis]=0;changed=true;}}
    if(changed){this.inverse.invert();position.copy(this.local).applyQuaternion(this.inverse).add(origin);velocity.copy(this.velocity).applyQuaternion(this.inverse);}
    return changed;
  }
}
