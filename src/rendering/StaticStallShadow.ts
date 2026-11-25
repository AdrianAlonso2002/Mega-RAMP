import * as THREE from 'three';

type Point={x:number;z:number};
const cross=(a:Point,b:Point,c:Point)=>(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
function hull(points:Point[]):Point[] {
  points.sort((a,b)=>a.x-b.x||a.z-b.z);
  const lower:Point[]=[],upper:Point[]=[];
  for(const p of points){while(lower.length>1&&cross(lower.at(-2)!,lower.at(-1)!,p)<=0)lower.pop();lower.push(p);}
  for(let i=points.length-1;i>=0;i--){const p=points[i];while(upper.length>1&&cross(upper.at(-2)!,upper.at(-1)!,p)<=0)upper.pop();upper.push(p);}
  lower.pop();upper.pop();return lower.concat(upper);
}
function clip(points:Point[],axis:'x'|'z',edge:number,sign:number):Point[] {
  const result:Point[]=[];
  for(let i=0;i<points.length;i++) {
    const a=points[i],b=points[(i+1)%points.length],insideA=(a[axis]-edge)*sign>=0,insideB=(b[axis]-edge)*sign>=0;
    if(insideA)result.push(a);
    if(insideA!==insideB){const t=(edge-a[axis])/(b[axis]-a[axis]);result.push({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t});}
  }
  return result;
}

/** A fixed, feathered silhouette for stationary stalls on a flat plaza.
 * One draw per stall, no shadow-map sampling, self-shadow acne or animation clock.
 * Clip to the plaza so the silhouette never floats over empty space.
 */
export function createStaticStallShadow(stall:THREE.Group,sun:readonly [number,number,number],receiver:THREE.Box3):THREE.Mesh|null {
  if(sun[1]<=0)return null;
  stall.updateMatrixWorld(true);
  const points:Point[]=[],point=new THREE.Vector3(),floor=receiver.max.y;
  stall.traverse(node=>{
    if(!(node instanceof THREE.Mesh))return;
    node.geometry.computeBoundingBox();const box=node.geometry.boundingBox!;
    for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]) {
      point.set(x,y,z).applyMatrix4(node.matrixWorld);
      const rise=Math.max(0,point.y-floor);
      points.push({x:point.x-sun[0]/sun[1]*rise,z:point.z-sun[2]/sun[1]*rise});
    }
  });
  if(points.length<3)return null;
  let silhouette=hull(points);
  silhouette=clip(silhouette,'x',receiver.min.x,1);silhouette=clip(silhouette,'x',receiver.max.x,-1);
  silhouette=clip(silhouette,'z',receiver.min.z,1);silhouette=clip(silhouette,'z',receiver.max.z,-1);
  if(silhouette.length<3)return null;
  const center=silhouette.reduce((a,p)=>({x:a.x+p.x/silhouette.length,z:a.z+p.z/silhouette.length}),{x:0,z:0});
  const positions:number[]=[center.x,floor+.015,center.z],colors:number[]=[0,0,0,1],indices:number[]=[],n=silhouette.length;
  for(const p of silhouette){const dx=center.x-p.x,dz=center.z-p.z,k=Math.min(.45,.12/Math.max(.001,Math.hypot(dx,dz)));positions.push(p.x+dx*k,floor+.015,p.z+dz*k);colors.push(0,0,0,1);}
  for(const p of silhouette){positions.push(p.x,floor+.015,p.z);colors.push(0,0,0,0);}
  for(let i=0;i<n;i++){const next=(i+1)%n,a=1+i,b=1+next,c=1+n+i,d=1+n+next;indices.push(0,b,a,a,d,c,a,b,d);}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,4));geometry.setIndex(indices);geometry.computeVertexNormals();
  const material=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.25,depthWrite:false,toneMapped:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3});
  const shadow=new THREE.Mesh(geometry,material);shadow.name='market-static-shadow';shadow.renderOrder=2;shadow.userData.graphicsNoShadow=true;
  // Keep illumination on the model, but replace unstable dynamic self/projection shadows.
  stall.traverse(node=>{if(node instanceof THREE.Mesh)node.userData.graphicsNoShadow=true;});
  return shadow;
}
