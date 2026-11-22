import type {Vector3Data} from "../LevelTypes";

/** Circular fillets with straight tangent approaches; never introduce a cusp at a curve endpoint. */
export function roundedSellaRoute(nodes:Vector3Data[],radius:number):Vector3Data[] {
  const result:Vector3Data[]=[{...nodes[0]}];
  for(let i=1;i<nodes.length-1;i++) {
    const a=nodes[i-1],p=nodes[i],b=nodes[i+1],al=Math.hypot(p.x-a.x,p.z-a.z),bl=Math.hypot(b.x-p.x,b.z-p.z);
    const ux=(p.x-a.x)/al,uz=(p.z-a.z)/al,vx=(b.x-p.x)/bl,vz=(b.z-p.z)/bl;
    const angle=Math.acos(Math.max(-1,Math.min(1,ux*vx+uz*vz)));
    if(angle<.001) {result.push({...p});continue;}
    const cut=Math.min(radius*Math.tan(angle/2),al*.42,bl*.42),r=cut/Math.tan(angle/2),sign=Math.sign(ux*vz-uz*vx);
    const entry={x:p.x-ux*cut,y:p.y+(a.y-p.y)*cut/al,z:p.z-uz*cut};
    const exit={x:p.x+vx*cut,y:p.y+(b.y-p.y)*cut/bl,z:p.z+vz*cut};
    const cx=entry.x-uz*sign*r,cz=entry.z+ux*sign*r,start=Math.atan2(entry.z-cz,entry.x-cx),steps=Math.max(4,Math.ceil(r*angle/4));
    result.push(entry);
    for(let j=1;j<=steps;j++) {
      const t=j/steps,theta=start+sign*angle*t;
      result.push({x:cx+Math.cos(theta)*r,y:entry.y+(exit.y-entry.y)*t,z:cz+Math.sin(theta)*r});
    }
  }
  result.push({...nodes[nodes.length-1]});return result;
}

function resample(points:Vector3Data[],segments:number):Vector3Data[] {
  const arc=[0];for(let i=1;i<points.length;i++) arc.push(arc[i-1]+Math.hypot(points[i].x-points[i-1].x,points[i].z-points[i-1].z));
  let index=0;
  return Array.from({length:segments+1},(_,i)=>{
    const s=arc[arc.length-1]*i/segments;
    while(index<points.length-2 && arc[index+1]<s) index++;
    const a=points[index],b=points[index+1],t=(s-arc[index])/(arc[index+1]-arc[index]||1);
    return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t};
  });
}

/** Equal spacing and continuous downhill heights; horizontal bends are authored with matching tangents. */
export function alignSellaRoute(source:Vector3Data[]):Vector3Data[] {
  let horizontal=0;for(let i=1;i<source.length;i++) horizontal+=Math.hypot(source[i].x-source[i-1].x,source[i].z-source[i-1].z);
  const points=resample(source,Math.ceil(horizontal/3));
  const bottom=source[source.length-1].y;
  for(let i=1;i<points.length;i++) points[i].y=Math.min(points[i-1].y,Math.max(bottom,points[i].y));
  for(let iteration=0;iteration<12;iteration++) {
    const heights=points.map(p=>p.y);
    for(let i=1;i<points.length-1;i++) points[i].y=heights[i]*.5+(heights[i-1]+heights[i+1])*.25;
  }
  return resample(points,330);
}
