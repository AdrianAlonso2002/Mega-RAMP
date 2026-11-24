import publishedEditorStages from '../editor-saved/world-07.json';
import {registerStageSet} from '../StageRegistry';
import type { LevelData, LevelObjectData, Vector3Data } from '../LevelTypes';
import { buildRiverFrames } from '../world-05/SellaRiver';
import { NARA_BUDGETS, NARA_NAMES, NARA_REVISION, NARA_STATION_REVISION, NARA_CHALLENGE_REVISION, bowlHeight, naraPath, nv as v } from './NaraRoutes';

class NaraLayout {
  readonly objects: LevelObjectData[]=[];
  readonly prizeRoutes: Vector3Data[][]=[];
  spawn=v(0,13.05,10);
  end=v(0,12,-10);
  endYaw=0;
  constructor(readonly stage: number) {}
  add(name:string,type:LevelObjectData['type'],position:Vector3Data,scale=v(1,1,1),properties:Record<string,unknown>={},yaw=0) {
    const o:LevelObjectData={id:`w7n2e${this.stage}-${name}`,type,position,scale,rotation:v(0,yaw,0),properties};this.objects.push(o);return o;
  }
  decor(name:string,kind:string,position:Vector3Data,scale=1,properties:Record<string,unknown>={},yaw=0) {
    return this.add(name,'decoration',position,v(scale,scale,scale),{subType:`nara_${kind}`,hasCollision:false,...properties},yaw);
  }
  kyoto(name:string,kind:string,position:Vector3Data,scale=1,yaw=0) {
    this.add(`${name}-base`,'decoration',v(position.x,position.y-.05,position.z),v(scale,scale,scale),{subType:'kyoto_island',hasCollision:false});
    return this.add(name,'decoration',position,v(scale,scale,scale),{subType:`kyoto_${kind}`,hasCollision:false},yaw);
  }
  path(name:string,nodes:Vector3Data[],width=4,wood=false,curved=true,rails=false) {
    const route=naraPath(nodes,width,curved);
    this.decor(name,'path',v(0,0,0),1,{...route,wood,rails,hasCollision:true});this.prizeRoutes.push(route.points);return route;
  }
  block(name:string,top:Vector3Data,width:number,depth:number,color='#a6a58c') {
    return this.add(name,'platform',v(top.x,top.y-.35,top.z),v(width,.7,depth),{color});
  }
  coin(point:Vector3Data,properties:Record<string,unknown>={}) {
    this.add(`prize-${this.objects.filter(o=>o.type==='collectible').length}`,'collectible',point,v(1,1,1),properties);
  }
  endpoint(route:ReturnType<typeof naraPath>) {
    const a=route.points[4],b=route.points.at(-5)!,prev=route.points.at(-6)!;
    this.spawn=v(a.x,a.y+1.05,a.z);this.end={...b};this.endYaw=Math.atan2(prev.x-b.x,prev.z-b.z);
  }
  flank(route:ReturnType<typeof naraPath>,kind:string,stride:number,gap:number,scale=1) {
    const frames=buildRiverFrames(route.points);
    for(let i=14;i<route.points.length-14;i+=stride)for(const side of [-1,1]) {
      const p=route.points[i],f=frames[i],distance=route.widths[i]/2+gap;
      const at=v(p.x+f.x*distance*side,p.y-.3,p.z+f.z*distance*side);
      this.kyoto(`${kind}-base-${i}-${side}`,'zen',v(at.x,at.y-1,at.z),scale*.55);
      if(kind==='deer')this.decor(`deer-${i}-${side}`,kind,at,scale,{phase:i*.17},Math.atan2(-f.x*side,-f.z*side));
      else this.kyoto(`${kind}-${i}-${side}`,kind,at,scale);
    }
  }
}

function build(stage:number):LevelData {
  const l=new NaraLayout(stage), count=NARA_BUDGETS[stage-1];
  switch(stage) {
    case 1: {
      l.decor('shinkansen','train',v(0,12,0),1,{hasCollision:true,naraAction:'train'});
      l.decor('nara-station','station',v(0,12,-240),1,{hasCollision:true});
      l.decor('kioto-station','station',v(0,12,0),1,{hasCollision:true});
      l.decor('railway','tracks',v(0,11,-120),1,{hasCollision:true,length:284});
      l.spawn=v(6.3,13.05,1.5);l.end=v(9,12,-248);l.endYaw=Math.PI;
      for(let i=0;i<6;i++)l.coin(v(5.3+(i%2)*3,12.85,-236-Math.floor(i/2)*4));
      for(let i=0;i<12;i++)for(const side of [-1,1])l.kyoto(`trees-${i}-${side}`,i%3?'pine':'sakura',v(side*(16+i%3*2),5,-i*22),1.4);
      l.kyoto('temple-arrival','shrine',v(22,9,-246),1.6);
      for(const obj of l.objects)if(obj.type==='decoration'&&String(obj.properties?.subType).startsWith('kyoto_'))obj.properties={...obj.properties,hasCollision:true};
      break;
    }
    case 2: {
      for(let i=0;i<5;i++) {
        const x=i%2?2.4:0,z=12-i*21,y=12+i*.8;
        l.path(`approach-${i}`,[v(x,y,z+12),v(x,y,z+4),v(x,y+1.7,z)],6-i*.25,true,false);
        l.decor(`launch-${i}`,'jump_pad',v(x,y+1.71,z+.4),1,{naraAction:'jump',width:6-i*.25,launchY:8.7,velocity:16.5,targetX:i===4?0:(i%2?0:2.4)});
        l.coin(v(x,y+.85,z+7));l.coin(v(x,y+2.55,z-.4));
        l.kyoto(`pine-${i}`,'pine',v(x-8,y-3,z+4),1.1);l.decor(`bow-${i}`,'deer',v(x+8,y-2,z+5),1,{phase:i});
      }
      l.block('finish',v(0,16,-98),11,19,'#ad8a63');l.spawn=v(0,13.05,22);l.end=v(0,16,-103);
      l.kyoto('jump-temple','shrine',v(0,10,-116),1.6);break;
    }
    case 3: {
      const route=l.path('bowing-path',[v(-37,14,24),v(-21,14,24),v(-9,15,18),v(-6,16,5),v(-12,16,-8),v(-4,16,-21),v(13,15,-22),v(29,14,-15),v(34,14,-4),v(42,14,-4)],4.3);
      l.endpoint(route);l.flank(route,'deer',23,4.5,1.15);
      const landing=l.path('bowing-gap-landing',[v(45,13,-4),v(55,13,-4)],4.3,false,false);
      l.decor('bowing-gap-launch','jump_pad',v(41,14.01,-4),1,{naraAction:'jump',width:4.3,launchY:4.2,velocity:8.5,directionX:1,directionZ:0},Math.PI/2);
      l.end={...landing.points.at(-4)!};l.endYaw=-Math.PI/2;
      for(let i=0;i<3;i++){const p=route.points[Math.floor(route.points.length*(.23+i*.23))];l.decor(`sweeper-${i}`,'rotor',v(p.x,p.y,p.z),1,{hasCollision:true,naraAction:'rotor',length:7.8,index:i});}
      l.kyoto('deer-temple','shrine',v(14,6,9),1.8);break;
    }
    case 4: {
      const centres=[v(-35,15,17),v(-16,15,13),v(3,15,5),v(22,15,9),v(40,15,-1)];
      centres.forEach((p,i)=>{
        l.decor(`senbei-${i}`,'cracker',p,1,{radius:6.2,hasCollision:true});
        l.decor(`deer-${i}`,'deer',v(p.x,p.y,p.z+3.7),.85,{phase:i*.8});
        if(i===1||i===3)l.decor(`sweeper-${i}`,'rotor',v(p.x,p.y,p.z),1,{naraAction:'rotor',hasCollision:true,length:8,index:i});
        if(i){const a=centres[i-1],d=Math.hypot(p.x-a.x,p.z-a.z),dx=(p.x-a.x)/d,dz=(p.z-a.z)/d;
          // The neck is slightly recessed: no coplanar overlap with the cracker top.
          l.path(`neck-${i}`,[v(a.x+dx*5.7,14.98,a.z+dz*5.7),v(p.x-dx*5.7,14.98,p.z-dz*5.7)],3.2,true,false,true);
        }
        for(const side of [-1,1])l.coin(v(p.x+side*2.1,15.85,p.z-1.5));
      });
      l.spawn=v(-37,16.05,17);l.end=v(42,15,-1);l.endYaw=-Math.PI/2;
      for(let i=0;i<3;i++)l.kyoto(`garden-${i}`,'pine',v(-26+i*30,8,-11),1.8);break;
    }
    case 5: {
      const route=l.path('rest-garden',[v(0,12,13),v(0,12,-14)],25,false,false);l.endpoint(route);
      // Twenty prizes in two staggered diamonds, rather than the previous rectangular grid.
      for(const centre of [-6,6])for(let row=-2;row<=2;row++)for(let col=0;col<2;col++)l.coin(v(centre+(col?1:-1)*(3-Math.abs(row)*.85),12.85,row*3));
      l.kyoto('senbei-shop','teahouse',v(-21,9,-4),1.5);l.decor('cracker-display','cracker',v(-20,11,2),.6);l.decor('rest-deer','deer',v(17,11,4),1.4);l.kyoto('rest-sakura','sakura',v(19,9,-10),1.5);break;
    }
    case 6: {
      const r1=l.path('lantern-descent',[v(27,25,-35),v(27,25,-22),v(27,21,5),v(27,19,24),v(18,19,29),v(2,19,29),v(-1,19,17),v(-1,22,-19)],4.7,false,true,true);
      const r2=l.path('lantern-return',[v(-20,24,-19),v(-20,24,-7),v(-20,19,12),v(-20,17,29),v(-28,17,34)],4.3,false,true,true);
      for(let i=0;i<10;i++){const x=-2.1-i*1.79,y=22+i*.2;l.block(`stair-${i}`,v(x,y,-19),1.82,4.7,'#a5a68d');}
      l.decor('kasuga-east','lantern_field',v(52,8,-2),1);l.decor('kasuga-west','lantern_field',v(-45,8,0),1);
      l.spawn=v(27,26.05,-32);l.end={...r2.points.at(-4)!};l.endYaw=-Math.PI/2;
      l.flank(r1,'pine',55,7,.8);l.kyoto('kasuga-shrine','shrine',v(0,8,-43),2.1);break;
    }
    case 7: {
      const right=l.path('mochi-east',[v(39,16,25),v(26,16,25),v(22,16,10),v(26,16,-6),v(19,16,-13),v(14,16,-7),v(14,16,0)],4.6,true,true);
      // Original landing height: crossing the more unstable seesaw requires momentum and timing.
      const left=l.path('mochi-west',[v(-14,14,0),v(-14,14,9),v(-24,14,18),v(-37,14,17),v(-43,14,6),v(-36,14,-9),v(-44,14,-19)],4.6,true,true);
      l.decor('bridge-balancier','seesaw',v(0,16,0),1,{length:28,width:4.6,hasCollision:true,naraAction:'seesaw'});
      l.add('balance-pivot','cylinder',v(0,12.7,0),v(1.2,6,1.2),{color:'#796747'});
      l.spawn=v(right.points[4].x,17.05,right.points[4].z);l.end={...left.points.at(-5)!};l.endYaw=-Math.PI/2;
      for(const side of [-1,1])for(let i=0;i<3;i++)l.decor(`mochi-show-${side}-${i}`,'mochi',v(side*(15+i*12),12,side===1?-24:29),1.25,{phase:i*.43+side});
      l.kyoto('mochi-house','teahouse',v(0,6,22),2);break;
    }
    case 8: {
      const route=l.path('pagoda-descent',[
        v(-26,35,-30),v(-7,35,-30),v(21,34,-30),v(28,32,-20),v(28,29,11),v(20,28,20),v(-21,28,20),v(-29,27,10),
        v(-29,23,-14),v(-20,22,-20),v(14,22,-20),v(19,20,-13),v(19,17,25),v(12,16,32),v(-17,16,32),v(-20,15,24),
        v(-20,11,0),v(-10,10,-5),v(6,10,-5),v(10,9,1),v(10,7,17),v(18,7,22),v(32,7,22),
      ],3.7,true,true,true);
      l.endpoint(route);l.decor('pagoda-tower','pagoda',v(-5,2,4),1.25,{floors:7});
      for(const [i,fraction] of [.18,.45,.76].entries()){const p=route.points[Math.floor(route.points.length*fraction)];l.decor(`pagoda-rotor-${i}`,'rotor',v(p.x,p.y,p.z),1,{hasCollision:true,naraAction:'rotor',length:6.8,index:i});}
      for(const x of [-34,34])for(const z of [-33,34])l.kyoto(`cedar-${x}-${z}`,'pine',v(x,0,z),2.4);
      for(const x of [-26,26])for(const z of [-24,24])l.add(`support-${x}-${z}`,'cylinder',v(x,12,z),v(.4,24,.4),{color:'#76503a'});
      break;
    }
    case 9: {
      const left=l.path('koi-left',[v(-39,16,-26),v(-32,16,-26),v(-24,16,-20),v(-26,16,-7),v(-32,16,9),v(-24,16,20),v(-12,16,16),v(-10,16,8),v(-10,16,0)],4.4,false,true,true);
      const right=l.path('koi-right',[v(10,16,0),v(10,16,-10),v(22,16,-17),v(32,16,-10),v(29,16,5),v(21,16,20),v(28,16,28),v(43,16,28)],4.4,false,true,true);
      for(const [i,route] of [left,right].entries()) {const p=route.points[Math.floor(route.points.length*.45)];l.decor(`koi-rotor-${i}`,'rotor',v(p.x,p.y,p.z),1,{hasCollision:true,naraAction:'rotor',length:7.2,index:i+1});}
      for(let i=0;i<5;i++)l.decor(`floating-bridge-${i}`,'seesaw',v(-8+i*4,16,0),1,{length:3.8,width:2.5,hasCollision:true,naraAction:'float',phase:i*.8});
      l.decor('koi-garden','pond',v(0,9,0),1,{width:103,depth:76});
      l.spawn=v(left.points[4].x,17.05,left.points[4].z);l.end={...right.points.at(-5)!};l.endYaw=-Math.PI/2;
      l.kyoto('koi-teahouse','teahouse',v(-5,8.5,44),1.4);for(const side of [-1,1])l.kyoto(`koi-sakura-${side}`,'sakura',v(side*47,9.1,5),1.5);break;
    }
    case 10: {
      const route=l.path('buddha-approach',[v(37,24,25),v(24,24,25),v(17,24,17),v(22,24,5),v(27,24,-8),v(20,24,-20),v(7,24,-20),v(-4,23,-12),v(-13,21,-10),v(-24,20,-10)],4.5,false,true,true);
      l.spawn=v(route.points[4].x,25.05,route.points[4].z);
      const basins=[{x:-30,r:6,d:2},{x:-46,r:5,d:2.2},{x:-70,r:13,d:5}];
      for(let i=0;i<basins.length;i++){
        const b=basins[i];l.decor(`basin-${i}`,'bowl',v(b.x,20,-10),1,{radius:b.r,depth:b.d,hasCollision:true,naraAction:'bowl',spinSpeed:i===1?-1.8:1.5,sticky:true});
        if(i){const a=basins[i-1];l.path(`basin-neck-${i}`,[v(a.x-a.r+.08,19.98,-10),v(b.x+b.r-.08,19.98,-10)],2.8,false,false);}
      }
      l.end=v(-70,15,-10);l.endYaw=Math.PI/2;
      l.decor('todai-ji-buddha','buddha',v(-70,4,-36),3.8);l.kyoto('todai-ji-hall','shrine',v(-70,3,-67),4.5);l.decor('great-bell','bell',v(-89,10,-3),1.7);
      // Seven on the approach, then the floor of each bowl; all remain within reach.
      for(let i=0;i<7;i++){const p=route.points[Math.floor((.09+i*.12)*(route.points.length-1))];l.coin(v(p.x,p.y+.85,p.z));}
      for(const b of basins)l.coin(v(b.x,20+bowlHeight(b.r,b.d,0,0)+.85,-10));
      break;
    }
  }
  if(!l.objects.some(o=>o.type==='collectible')) {
    const samples=l.prizeRoutes.flat();
    for(let i=0;i<count;i++) {const p=samples[Math.floor((.07+.85*i/Math.max(1,count-1))*(samples.length-1))];l.coin(v(p.x,p.y+.85,p.z));}
  }
  l.add('goal','goal',v(l.end.x,l.end.y+.1,l.end.z),v(1,1,1),{},l.endYaw);
  return {id:`world-07-level-02-stage-${String(stage).padStart(2,'0')}`,world:7,level:2,stage,name:NARA_NAMES[stage-1],theme:'cherry_blossom',musicTrack:'sky_waltz',timeLimit:stage===1?80:stage===8?240:180,spawn:l.spawn,objects:l.objects,properties:{naraRevision:NARA_REVISION,naraChallengeRevision:NARA_CHALLENGE_REVISION,...(stage===1?{naraStationRevision:NARA_STATION_REVISION}:{})}};
}
export const WORLD_07_LEVEL_02_STAGES:Record<number,LevelData>=Object.fromEntries(Array.from({length:10},(_,i)=>[i+1,build(i+1)]));

// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('7_2_')) Object.assign(WORLD_07_LEVEL_02_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(7,2,WORLD_07_LEVEL_02_STAGES);

