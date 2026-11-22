import type { Vector3Data } from "../LevelTypes";

export interface RiverSample {x:number;y:number;z:number;dx:number;dy:number;dz:number;distance:number;side:number;segment:number;t:number}
export interface RiverFrame {x:number;z:number}

/** Equal-weight incoming/outgoing tangents keep short sections and sharp joins from tilting the banks. */
function riverFrame(points:Vector3Data[],i:number,breaks:readonly number[]):RiverFrame {
  const p=points[i],a=i===0 || breaks.includes(i-1) ? p:points[i-1],b=i===points.length-1 || breaks.includes(i) ? p:points[i+1];
  const il=Math.hypot(p.x-a.x,p.z-a.z),ol=Math.hypot(b.x-p.x,b.z-p.z);
  const ix=il>.001 ? (p.x-a.x)/il:(b.x-p.x)/(ol||1),iz=il>.001 ? (p.z-a.z)/il:(b.z-p.z)/(ol||1);
  const ox=ol>.001 ? (b.x-p.x)/ol:ix,oz=ol>.001 ? (b.z-p.z)/ol:iz;
  const length=Math.hypot(ix+ox,iz+oz)||1,tx=(ix+ox)/length,tz=(iz+oz)/length;
  const miter=1/Math.max(.67,tx*ox+tz*oz);
  return {x:-tz*miter,z:tx*miter};
}

export function buildRiverFrames(points:Vector3Data[],breaks:readonly number[]=[]):RiverFrame[] {
  return points.map((_,i)=>riverFrame(points,i,breaks));
}

/** Nearest navigable cross-section. Height disambiguates stacked spiral sections. */
export function sampleSellaRiver(points:Vector3Data[],position:Vector3Data,breaks:readonly number[]=[],hint=-1,frames?:readonly RiverFrame[],width=24):RiverSample|null {
  let best:RiverSample|null=null,bestScore=Infinity;
  const start=hint<0 ? 0 : Math.max(0,hint-7),end=hint<0 ? points.length-1 : Math.min(points.length-1,hint+12);
  for(let i=start;i<end;i++) {
    if(breaks.includes(i)) continue;
    const a=points[i],b=points[i+1],dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz);
    if(length<.01) continue;
    const fa=frames?.[i]??riverFrame(points,i,breaks),fb=frames?.[i+1]??riverFrame(points,i+1,breaks);
    const nx=fb.x-fa.x,nz=fb.z-fa.z;
    let t=((position.x-a.x)*dx+(position.z-a.z)*dz)/(length*length);
    let side=((position.x-a.x-dx*t)*fa.x+(position.z-a.z-dz*t)*fa.z)/(fa.x*fa.x+fa.z*fa.z);
    // Invert the same bilinear ribbon used by the rendered water, not a perpendicular centre-line projection.
    for(let iteration=0;iteration<5;iteration++) {
      const sx=fa.x+nx*t,sz=fa.z+nz*t,tx=dx+nx*side,tz=dz+nz*side,det=tx*sz-tz*sx;
      if(Math.abs(det)<.00001) break;
      const ex=a.x+dx*t+side*sx-position.x,ez=a.z+dz*t+side*sz-position.z;
      const dt=(ex*sz-ez*sx)/det,ds=(tx*ez-tz*ex)/det;
      t-=dt;side-=ds;
      if(Math.abs(dt)<.000001 && Math.abs(ds)<.000001) break;
    }
    if(!Number.isFinite(t) || !Number.isFinite(side)) continue;
    const rawT=t;t=Math.max(0,Math.min(1,t));
    const sx=fa.x+nx*t,sz=fa.z+nz*t;
    side=((position.x-a.x-dx*t)*sx+(position.z-a.z-dz*t)*sz)/(sx*sx+sz*sz);
    const x=a.x+dx*t,y=a.y+(b.y-a.y)*t,z=a.z+dz*t;
    const error=Math.hypot(position.x-x-side*sx,position.z-z-side*sz);
    const inside=rawT>=-.0001 && rawT<=1.0001 && Math.abs(side)<=width/2+.01 && error<.02;
    const distance=Math.hypot(side,error),score=error*error+Math.pow((position.y-y)*.45,2)+(inside ? 0:width*width*4);
    if(score<bestScore) {
      bestScore=score;
      const tx=dx+nx*side,tz=dz+nz*side,tl=Math.hypot(tx,tz)||length;
      best={x,y,z,dx:tx/tl,dy:(b.y-a.y)/tl,dz:tz/tl,distance,side,segment:i,t};
    }
  }
  return best;
}

/** A/left always selects the left blade, D/right always selects the right blade.
 * A forward stroke turns away from that blade; a planted braking blade turns toward it.
 * The same normalized axes are supplied by keys, arrows and the touch joystick. */
export function canoePaddles(horizontal:number,vertical:number,bothPaddles=false):{left:number;right:number} {
  const h=Math.max(-1,Math.min(1,horizontal)),v=Math.max(-1,Math.min(1,vertical));
  if(bothPaddles) {
    const power=Math.abs(v)<.08 ? 0:Math.sign(v)*Math.min(1,Math.abs(v)/.65);
    return {left:power,right:power};
  }
  if(Math.abs(v)<.08 || Math.abs(h)<.08) return {left:0,right:0};
  const power=Math.sign(v)*Math.min(1,Math.abs(v)/.65)*Math.min(1,Math.abs(h)/.65);
  return h<0 ? {left:power,right:0} : {left:0,right:power};
}

export function paddlePulse(time:number,phase:number):number {
  const stroke=((time+phase)% .72+.72)%.72;
  return stroke<.3 ? Math.sin(stroke/.3*Math.PI) : 0;
}
