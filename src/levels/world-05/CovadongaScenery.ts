import type {Vector3Data} from "../LevelTypes";

export interface ScenerySite {x:number;z:number;radius:number;kind:"tree"|"peak";height:number;variant:number}
export interface SceneryLake {x:number;z:number;rx:number;rz:number;y:number}
export interface SceneryGround {minX:number;minZ:number;sizeX:number;sizeZ:number;resolution:number;heights:Float32Array;lakes:SceneryLake[];sites:ScenerySite[];route:Vector3Data[];width:number}
export function distanceToSceneryRoute(points:Vector3Data[],x:number,z:number):number {
  let best=Infinity;
  if(points.length===1) return Math.hypot(x-points[0].x,z-points[0].z);
  for(let i=0;i<points.length-1;i++) {
    const a=points[i],b=points[i+1],dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz||1)));
    best=Math.min(best,Math.hypot(x-a.x-dx*t,z-a.z-dz*t));
  }
  return best;
}
export function createCovadongaGround(route:Vector3Data[],width:number,seed=1,leftOnly=false,protectedAreas:{x:number;z:number;radius:number}[]=[]):SceneryGround {
  const xs=route.map(p=>p.x),zs=route.map(p=>p.z),minX=Math.min(...xs)-360,minZ=Math.min(...zs)-360;
  const sizeX=Math.max(...xs)+360-minX,sizeZ=Math.max(...zs)+360-minZ,resolution=72,base=Math.min(...route.map(p=>p.y))-78;
  const centreX=(Math.min(...xs)+Math.max(...xs))/2,centreZ=(Math.min(...zs)+Math.max(...zs))/2;
  const clear=(x:number,z:number,radius:number)=>distanceToSceneryRoute(route,x,z)>radius+width/2+7 && protectedAreas.every(a=>Math.hypot(x-a.x,z-a.z)>a.radius+radius+5);
  const lakes:SceneryLake[]=[];
  for(let i=0;i<24 && lakes.length<2;i++) {
    const angle=(i*2.399+seed*.31),x=centreX+Math.cos(angle)*(130+i%3*28),z=centreZ+Math.sin(angle)*(130+i%3*28),r=lakes.length ? 48:75;
    if(clear(x,z,r) && lakes.every(l=>Math.hypot(x-l.x,z-l.z)>r+l.rx+12)) lakes.push({x,z,rx:r,rz:r*.67,y:base+5+lakes.length*2});
  }
  const heights=new Float32Array((resolution+1)**2);
  for(let iz=0;iz<=resolution;iz++) for(let ix=0;ix<=resolution;ix++) {
    const x=minX+sizeX*ix/resolution,z=minZ+sizeZ*iz/resolution;
    let y=base+Math.sin(x*.013+seed)*5+Math.cos(z*.017)*6+Math.sin((x+z)*.024)*2;
    for(const lake of lakes) {
      const r=Math.hypot((x-lake.x)/lake.rx,(z-lake.z)/lake.rz);
      if(r<.65) y=lake.y-4+Math.cos(r*Math.PI)*.4;
      else if(r<.9) {const t=(r-.65)/.25;y=lake.y-4+6.5*t*t*(3-2*t);}
      else if(r<1.25) y=lake.y+2.5;
      else if(r<1.6) {const t=(r-1.25)/.35;y=(lake.y+2.5)*(1-t)+y*t;}
    }
    heights[iz*(resolution+1)+ix]=y;
  }
  const sites:ScenerySite[]=[];
  const dry=(x:number,z:number,r:number)=>lakes.every(l=>Math.hypot((x-l.x)/l.rx,(z-l.z)/l.rz)>1.12+r/Math.min(l.rx,l.rz));
  for(let i=0;i<190;i++) {
    const p=route[Math.min(route.length-1,Math.floor(i/190*route.length))];
    const prev=route[Math.max(0,Math.floor(i/190*route.length)-1)],next=route[Math.min(route.length-1,Math.floor(i/190*route.length)+1)];
    const dx=next.x-prev.x,dz=next.z-prev.z,len=Math.hypot(dx,dz)||1,side=leftOnly ? -1:i%2 ? 1:-1;
    const distance=30+(i*17+seed*11)%105,x=p.x-dz/len*side*distance,z=p.z+dx/len*side*distance;
    const kind=i%5===0 ? "peak":"tree",radius=kind==="peak" ? 17+i%9:3.6;
    if(clear(x,z,radius) && dry(x,z,radius) && sites.every(s=>Math.hypot(x-s.x,z-s.z)>(kind==="tree"&&s.kind==="tree" ? 5.5:radius+s.radius*.65)))
      sites.push({x,z,kind,radius,height:kind==="peak" ? 60+i%6*10:1+(i%4)*.15,variant:i});
  }
  for(let i=0;i<24;i++) {
    const angle=i*Math.PI*2/24,r=265+(i%3)*20,x=centreX+Math.cos(angle)*r,z=centreZ+Math.sin(angle)*r,radius=38+i%4*6;
    if(clear(x,z,radius) && dry(x,z,radius)) sites.push({x,z,radius,kind:"peak",height:100+i%5*18,variant:i+190});
  }
  return {minX,minZ,sizeX,sizeZ,resolution,heights,lakes,sites,route,width};
}
/** Same two triangles as the rendered ground, so roots and hooves actually meet the surface. */
export function sceneryGroundHeight(g:SceneryGround,x:number,z:number):number {
  const gx=Math.max(0,Math.min(g.resolution-.00001,(x-g.minX)/g.sizeX*g.resolution)),gz=Math.max(0,Math.min(g.resolution-.00001,(z-g.minZ)/g.sizeZ*g.resolution));
  const ix=Math.floor(gx),iz=Math.floor(gz),u=gx-ix,v=gz-iz,n=g.resolution+1;
  const a=g.heights[iz*n+ix],b=g.heights[iz*n+ix+1],c=g.heights[(iz+1)*n+ix],d=g.heights[(iz+1)*n+ix+1];
  return v<=u ? a+(b-a)*u+(d-b)*v:a+(d-c)*u+(c-a)*v;
}
