import * as THREE from "three";

type Vertex = { point: THREE.Vector3; values: number[][] };
const EPS = 1e-5;
const axes = ["x", "y", "z"] as const;
function split(polygon: Vertex[], axis: "x"|"y"|"z", limit: number, sign: number): {inside: Vertex[]; outside: Vertex[]} {
  if(polygon.every(v=>Math.abs(v.point[axis]-limit)<=EPS))return {inside:polygon,outside:[]};
  const inside:Vertex[]=[],outside:Vertex[]=[];
  for(let i=0;i<polygon.length;i++) {
    const a=polygon[i],b=polygon[(i+1)%polygon.length],da=(a.point[axis]-limit)*sign,db=(b.point[axis]-limit)*sign;
    if(da<=EPS)inside.push(a);
    if(da>=-EPS)outside.push(a);
    if((da>EPS&&db<-EPS)||(da<-EPS&&db>EPS)) {
      const t=da/(da-db),v={point:a.point.clone().lerp(b.point,t),values:a.values.map((values,j)=>values.map((value,k)=>THREE.MathUtils.lerp(value,b.values[j][k],t)))};
      inside.push(v);outside.push(v);
    }
  }
  return {inside,outside};
}
function area(p:Vertex[]):number {
  let result=0;
  for(let i=1;i+1<p.length;i++)result+=p[i].point.clone().sub(p[0].point).cross(p[i+1].point.clone().sub(p[0].point)).length()/2;
  return result;
}
/** Remove faces inside adjoining boxes on all six sides, including shared vertical walls.
 * Authored transforms, collision boxes, UVs and material groups remain unchanged.
 * Runs once when constructing the scene, never during the rocking animation.
 */
export function trimCachopoSurfaces(meshes:THREE.Mesh[]):void {
  const entries=meshes.map((mesh,index)=>{
    mesh.updateWorldMatrix(true,false);
    const e=mesh.matrixWorld.elements;
    // An AABB is exact only for axis-aligned authored boxes; leave other shapes intact.
    const aligned=[0,4,8].every(i=>[e[i],e[i+1],e[i+2]].filter(v=>Math.abs(v)>EPS).length===1);
    return {mesh,index,aligned,bounds:new THREE.Box3().setFromObject(mesh)};
  }).filter(e=>e.aligned);
  for(const entry of entries) {
    const {mesh,bounds}=entry,geometry=mesh.geometry;
    const neighbours=entries.filter(e=>e!==entry&&bounds.intersectsBox(e.bounds));
    if(!neighbours.length)continue;
    const names=Object.keys(geometry.attributes),attrs=names.map(n=>geometry.getAttribute(n) as THREE.BufferAttribute),output=names.map(()=>[] as number[]),inverse=mesh.matrixWorld.clone().invert();
    const result=new THREE.BufferGeometry();let written=0;
    for(let offset=0;offset<(geometry.index?.count??attrs[0].count);offset+=3) {
      const triangle=[0,1,2].map(i=>{
        const idx=geometry.index?.getX(offset+i)??offset+i;
        return {point:new THREE.Vector3().fromBufferAttribute(geometry.getAttribute("position"),idx).applyMatrix4(mesh.matrixWorld),values:attrs.map(a=>Array.from({length:a.itemSize},(_,k)=>a.getComponent(idx,k)))};
      });
      const normal=triangle[1].point.clone().sub(triangle[0].point).cross(triangle[2].point.clone().sub(triangle[0].point)).normalize();
      let polygons=[triangle];
      for(const neighbour of neighbours) {
        const box=neighbour.bounds;
        const sameOuterFace=axes.some(axis=>(triangle.every(v=>Math.abs(v.point[axis]-box.min[axis])<EPS)&&normal[axis]<-.999)||(triangle.every(v=>Math.abs(v.point[axis]-box.max[axis])<EPS)&&normal[axis]>.999));
        if(sameOuterFace&&entry.index<neighbour.index)continue;
        polygons=polygons.flatMap(polygon=>{
          let remaining=polygon;const outside:Vertex[][]=[];
          for(const axis of axes)for(const side of [-1,1]) {
            const parts=split(remaining,axis,side<0?box.min[axis]:box.max[axis],side);
            if(area(parts.outside)>EPS)outside.push(parts.outside);
            remaining=parts.inside;
            if(area(remaining)<=EPS)return [polygon];
          }
          return outside;
        });
        if(!polygons.length)break;
      }
      const start=written;
      for(const polygon of polygons)for(let i=1;i+1<polygon.length;i++)for(const vertex of [polygon[0],polygon[i],polygon[i+1]]) {
        const point=vertex.point.clone().applyMatrix4(inverse);
        attrs.forEach((_,j)=>output[j].push(...(names[j]==="position"?point.toArray():vertex.values[j])));written++;
      }
      const group=geometry.groups.find(g=>offset>=g.start&&offset<g.start+g.count);
      if(written>start)result.addGroup(start,written-start,group?.materialIndex??0);
    }
    names.forEach((name,i)=>result.setAttribute(name,new THREE.Float32BufferAttribute(output[i],attrs[i].itemSize)));
    result.computeBoundingBox();result.computeBoundingSphere();mesh.geometry=result;mesh.userData.cachopoSurfacesTrimmed=true;geometry.dispose();
  }
}
