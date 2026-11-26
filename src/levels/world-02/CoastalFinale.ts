import type {LevelData} from '../LevelTypes';

export const COASTAL_FINALE_REVISION=2;
export const ICECREAM_RAMP_HEIGHT=19.6;
export function icecreamRoute():Array<{x:number;y:number;z:number;width:number}> {
  const points=[{x:-1.5,y:.8,z:8.5,width:2.8},{x:-.75,y:.8,z:8.5,width:2.8}];
  for(let i=0;i<=240;i++){
    const t=i/240,angle=t*Math.PI*6,radius=8.5-1.9*t;
    points.push({x:Math.sin(angle)*radius,y:.8+(ICECREAM_RAMP_HEIGHT-.8)*t,z:Math.cos(angle)*radius,width:2.8});
  }
  points.push({x:3.3,y:ICECREAM_RAMP_HEIGHT,z:6.6,width:2.8});
  for(let i=1;i<=40;i++){const a=Math.PI/2-Math.PI*i/40;points.push({x:3.3+3.3*Math.cos(a),y:ICECREAM_RAMP_HEIGHT,z:3.3+3.3*Math.sin(a),width:2.8});}
  points.push({x:0,y:ICECREAM_RAMP_HEIGHT,z:0,width:4.8});
  return points;
}

/** Apply this requested course change once, also to published/local editor saves. */
export function upgradeCoastalFinale(data:LevelData):LevelData {
  if(data.world===2&&data.level===4&&data.stage===2&&data.properties?.palmCollisionRevision!==1) {
    const palms=data.objects.filter(o=>o.properties?.variant==='giant_bouncy_palm');
    for(const pad of data.objects.filter(o=>o.type==='bumper')) {
      const index=Number(pad.id.match(/leaf-(\d)/)?.[1]);
      const palm=palms.find(o=>Number(o.properties?.palmIndex)===index)??palms.reduce<typeof palms[number]|undefined>((best,p)=>!best||Math.hypot(p.position.x-pad.position.x,p.position.z-pad.position.z)<Math.hypot(best.position.x-pad.position.x,best.position.z-pad.position.z)?p:best,undefined);
      if(palm){const dx=pad.position.x-palm.position.x,dz=pad.position.z-palm.position.z,distance=Math.hypot(dx,dz);if(distance>.01&&distance<5.8){pad.position.x=palm.position.x+dx/distance*5.8;pad.position.z=palm.position.z+dz/distance*5.8;}}
      pad.properties={...pad.properties,bounce:0,launchMode:'uniform'};
    }
    data.properties={...data.properties,palmCollisionRevision:1};
  }
  if(data.world!==2||data.level!==4||data.stage!==10||data.properties?.coastalFinaleRevision===COASTAL_FINALE_REVISION)return data;
  data.objects=data.objects.filter(o=>!/^w2s4e10-ramp-\d+$/.test(o.id)&&o.id!=='w2s4e10-apex-cherry');
  if(!data.objects.some(o=>o.id==='w2s4e10-continuous-ramp'))data.objects.push({id:'w2s4e10-continuous-ramp',type:'platform',position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0},scale:{x:20,y:20,z:26},properties:{variant:'icecream_spiral'}});
  const monument=data.objects.find(o=>o.properties?.variant==='stracciatella_cone');
  if(monument)monument.properties={...monument.properties,spinSpeed:.24};
  const patio=data.objects.find(o=>o.id==='w2s4e10-start-patio');if(patio)patio.position={x:-5,y:.4,z:8.5};
  data.spawn={x:-5,y:1.55,z:8.5};
  const goal=data.objects.find(o=>o.type==='goal');if(goal){goal.position={x:1.3,y:ICECREAM_RAMP_HEIGHT,z:0};goal.rotation={x:0,y:Math.PI/2,z:0};}
  const prizes=data.objects.filter(o=>o.type==='collectible'),route=icecreamRoute();
  prizes.forEach((prize,index)=>{const point=route[2+Math.round((index+1)/(prizes.length+1)*240)];prize.position={x:point.x,y:point.y+.85,z:point.z};});
  data.timeLimit=Math.max(data.timeLimit,120);data.properties={...data.properties,coastalFinaleRevision:COASTAL_FINALE_REVISION};return data;
}
