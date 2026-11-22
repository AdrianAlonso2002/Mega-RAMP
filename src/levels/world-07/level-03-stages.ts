import {registerStageSet} from '../StageRegistry';
import type {LevelData,LevelObjectData,Vector3Data} from '../LevelTypes';
import {buildRiverFrames} from '../world-05/SellaRiver';
import {OSAKA_BUDGETS,OSAKA_NAMES,OSAKA_REVISION,osakaArc,osakaPath,ov as v} from './OsakaRoutes';
type Route=ReturnType<typeof osakaPath>;
class OsakaLayout {
  objects:LevelObjectData[]=[];routes:Route[]=[];spawn=v(0,17,20);end=v(0,16,-20);yaw=0;
  constructor(readonly stage:number){}
  add(name:string,type:LevelObjectData['type'],position:Vector3Data,scale=v(1,1,1),properties:Record<string,unknown>={},yaw=0){const obj:LevelObjectData={id:`w7n3e${this.stage}-${name}`,type,position,scale,rotation:v(0,yaw,0),properties};this.objects.push(obj);return obj;}
  decor(name:string,kind:string,position:Vector3Data,properties:Record<string,unknown>={},scale=1,yaw=0){return this.add(name,'decoration',position,v(scale,scale,scale),{subType:`osaka_${kind}`,hasCollision:false,...properties},yaw);}
  path(name:string,nodes:Vector3Data[],width=3.5,curved=true):Route{const route=osakaPath(nodes,width,curved);this.decor(name,'path',v(0,0,0),{...route,hasCollision:true});this.routes.push(route);return route;}
  finish(route:Route){const a=route.points[3],b=route.points.at(-4)!,c=route.points.at(-5)!;this.spawn=v(a.x,a.y+1.05,a.z);this.end={...b};this.yaw=Math.atan2(c.x-b.x,c.z-b.z);}
  floor(name:string,position:Vector3Data,width:number,depth:number){return this.add(name,'platform',v(position.x,position.y-.4,position.z),v(width,.8,depth),{theme:'custom_color',customColor:'#345069',color:'#345069'});}
  disk(name:string,point:Vector3Data,radius:number){return this.add(name,'cylinder',v(point.x,point.y-.4,point.z),v(radius*2,.8,radius*2),{color:'#486c7c',bounce:.01});}
  coin(point:Vector3Data){this.add(`prize-${this.objects.filter(o=>o.type==='collectible').length}`,'collectible',point);}
  rotor(name:string,point:Vector3Data,index:number,length=6.5){this.add(name,'decoration',point,v(1,1,1),{subType:'nara_rotor',naraAction:'rotor',hasCollision:true,index,length});}
  flank(route:Route,kind:string,stride=45,gap=5,scale=1){const frames=buildRiverFrames(route.points);for(let i=12;i<route.points.length-12;i+=stride)for(const side of [-1,1]){const p=route.points[i],f=frames[i],d=route.widths[i]/2+gap;this.decor(`${kind}-${i}-${side}`,kind,v(p.x+side*f.x*d,p.y,p.z+side*f.z*d),{},scale,Math.atan2(-side*f.x,-side*f.z));}}
  city(centerX=0,centerZ=0,span=90){
    this.decor('night-canal','canal',v(centerX,0,centerZ),{width:span+30,length:140});
    for(const side of [-1,1])for(let i=0;i<5;i++)this.decor(`neon-${side}-${i}`,'building',v(centerX+side*(span/2+19),1,centerZ-56+i*26),{height:17+(i*7%18),accent:i%2?0x74cfdf:0xdd85b5},1,side===1?-Math.PI/2:Math.PI/2);
  }
}
function build(stage:number):LevelData {
  const l=new OsakaLayout(stage),count=OSAKA_BUDGETS[stage-1];
  switch(stage){
    case 1:{
      const route=l.path('takoyaki-switchbacks',[v(62,17,-25),v(47,16,-25),v(35,12,-25),v(12,12,-25),v(-17,12,-25),v(-32,12,-23),v(-39,12,-11),v(-32,12,1),v(-15,12,3),v(15,12,3),v(36,12,3),v(44,12,13),v(35,12,23),v(10,14,25),v(-15,14,25),v(-31,17,25),v(-38,20,17),v(-31,21,9),v(-6,21,9),v(10,21,9),v(14,24,1),v(4,24,-7),v(-18,24,-7),v(-39,24,-7),v(-58,24,-7)],4.8,true);
      l.finish(route);l.flank(route,'takoyaki_stall',70,7,.85);l.city(0,0,150);break;
    }
    case 2:{
      const lead=l.path('glico-arrival',[v(-70,34,-24),v(-55,33,-24),v(-35,32,-24),v(-10,32,-24)],4.5,true);
      l.path('glico-spiral-one',osakaArc(-10,0,24,-Math.PI/2,Math.PI*2,32,24),4.2,false);
      l.path('glico-link',[v(-10,24,-24),v(12,24,-24),v(28,23,-19),v(43,22,-17)],3.6,true);
      l.path('glico-spiral-two',osakaArc(43,0,17,-Math.PI/2,Math.PI*2,22,15),3.4,false);
      const exit=l.path('glico-finish',[v(43,15,-17),v(61,14,-17),v(80,14,-17)],4.2,true);
      l.finish(lead);l.end={...exit.points.at(-4)!};l.yaw=-Math.PI/2;l.decor('glico-sign','glico',v(-9,3,48),{},2.4);l.city(0,0,190);break;
    }
    case 3:{
      const nodes=Array.from({length:241},(_,i)=>{const t=i/240;return v(Math.sin(t*Math.PI*5)*11,18+Math.sin(t*Math.PI*4)*2.6,28-t*520);});
      const route=l.path('correr-dotonbori',nodes,4.1,false);l.finish(route);
      for(let i=0;i<6;i++){const p=route.points[Math.floor(route.points.length*(.16+i*.125))];l.rotor(`run-rotor-${i}`,{...p},i,7);}
      l.flank(route,'arch',90,0,1.15);for(let i=0;i<8;i++)l.decor(`running-sign-${i}`,'building',v(i%2?28:-28,5,-25-i*60),{height:18+i%3*5,accent:i%2?0xef75ac:0x64d5dd},1,i%2?-Math.PI/2:Math.PI/2);break;
    }
    case 4:{
      const points=[v(-45,16,-20),v(-20,16,-30),v(4,16,-22),v(9,16,3),v(33,16,10),v(43,16,-15)];
      points.forEach((p,i)=>{const radius=i===0||i===5?6:4.5;l.disk(`sushi-island-${i}`,p,radius);if(i&&i<5){for(const side of [-1,1])l.add(`wasabi-bumper-${i}-${side}`,'bumper',v(p.x+side*2.5,p.y+.5,p.z),v(.85,.85,.85),{color:'#dcac6b'});}l.decor(`belt-${i}`,'sushi_belt',v(p.x,p.y,p.z+radius+4),{length:12},.9);});
      for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz),ra=i===1?5.5:4,rb=i===5?5.5:4;l.path(`sushi-bridge-${i}`,[v(a.x+dx/d*ra,16,a.z+dz/d*ra),v(b.x-dx/d*rb,16,b.z-dz/d*rb)],i<3?2.65:2.3,false);}
      l.spawn=v(-47,17.05,-20);l.end=v(44,16,-16);l.yaw=0;l.city(0,0,145);break;
    }
    case 5:{
      l.floor('market-rest',v(0,12,0),42,62);l.spawn=v(0,13.05,25);l.end=v(0,12,-25);
      for(const x of [-16,16])for(const z of [-20,20])l.decor(`market-${x}-${z}`,z>0?'takoyaki_stall':'ramen_stall',v(x,12,z),{},.8,x>0?-Math.PI/2:Math.PI/2);
      for(let row=0;row<4;row++)for(let col=0;col<5;col++)l.coin(v(-8+col*4+(row%2?1.25:0),12.85,15-row*10));
      for(const x of [-19,19])for(const z of [-27,-9,9,27])l.decor(`market-lantern-${x}-${z}`,'lantern',v(x,12,z));l.city();break;
    }
    case 6:{
      const route=l.path('neon-double-hairpin',[v(58,19,4),v(42,18,4),v(23,17,4),v(9,17,0),v(-7,17,-14),v(-18,17,-19),v(-29,17,-12),v(-29,17,1),v(-18,17,9),v(-4,17,9),v(7,17,20),v(3,17,32),v(-10,17,37),v(-24,17,31),v(-34,17,24),v(-55,17,24)],2.9,true);l.finish(route);
      for(let i=0;i<4;i++){const p=route.points[Math.floor(route.points.length*(.22+i*.18))];l.rotor(`canal-sweeper-${i}`,{...p},i,6);}
      l.flank(route,'lantern',35,2.2,.8);l.city(0,0,155);l.decor('canal-glico','glico',v(13,3,-45),{},1.8);break;
    }
    case 7:{
      const start=l.path('ramen-start',[v(-45,24,30),v(-45,24,8),v(-45,24,-25),v(-28,24,-25),v(-28,24,-13),v(-26.4,24,-13)],3.2,false);
      for(let i=0;i<3;i++)l.decor(`ramen-roller-${i}`,'roller',v(-23+i*7,22.6,-13),{length:7.3,radius:1.4,axis:'x',speed:i%2?-.95:.85,osakaAction:'roller',hasCollision:true});
      l.path('ramen-middle',[v(-5.5,24,-13),v(7,24,-13),v(7,24,22),v(33,24,22),v(33,24,-9.7)],2.7,false);
      l.decor('ramen-long-roller','roller',v(33,22.6,-15),{length:11,radius:1.4,axis:'z',speed:-.8,osakaAction:'roller',hasCollision:true});
      const exit=l.path('ramen-finish',[v(33,24,-20.3),v(33,24,-36),v(55,24,-36)],2.5,false);
      l.finish(start);l.end={...exit.points.at(-4)!};l.yaw=-Math.PI/2;l.decor('ramen-master','ramen_stall',v(-4,6,28),{},3.1);l.city(0,0,160);break;
    }
    case 8:{
      const rings=[{x:-50,z:0,r:11},{x:-27,z:14,r:5},{x:-4,z:-4,r:9},{x:20,z:17,r:12},{x:43,z:0,r:5},{x:65,z:15,r:13}];
      for(let i=0;i<rings.length;i++){const a=rings[i];l.path(`park-ring-${i}`,osakaArc(a.x,a.z,a.r,0,Math.PI*2,18),i<2?3:2.35,false);if(i){const b=rings[i-1],dx=a.x-b.x,dz=a.z-b.z,d=Math.hypot(dx,dz);l.path(`park-bridge-${i}`,[v(b.x+dx/d*b.r,18,b.z+dz/d*b.r),v(a.x-dx/d*a.r,18,a.z-dz/d*a.r)],2.2,false);}l.decor(`park-pipe-${i}`,'pipe',v(a.x,9,a.z),{height:6+i%3});}
      l.spawn=v(-61,19.05,0);l.end=v(78,18,15);l.yaw=Math.PI;l.decor('park-globe','globe',v(14,3,-37),{},2.6);
      for(let i=0;i<7;i++){const x=-62+i*23;l.floor(`park-block-${i}`,v(x,4,47),7,7);l.decor(`park-lantern-${i}`,'lantern',v(x,4,47),{},1.3);}l.city(10,5,200);break;
    }
    case 9:{
      const helix=l.path('ninja-helix',osakaArc(-45,0,10,Math.PI,Math.PI*6,46,22),2.8,false);
      const valley=l.path('ninja-valley',[v(-55,22,0),v(-55,19,-17),v(-39,17,-24),v(-18,15,-16),v(4,12,-9),v(22,12,-8),v(34,14,-5),v(43,18,0),v(50,21,0)],2.6,true);
      l.finish(helix);l.floor('ninja-landing',v(70,20,0),20,8);l.end=v(74,20,0);l.yaw=-Math.PI/2;
      for(let i=0;i<4;i++){const r=i<2?helix:valley,p=r.points[Math.floor(r.points.length*(i<2?.26+i*.24:.3+(i-2)*.35))];l.decor(`ninja-slash-${i}`,'ninja_blade',{...p},{length:4.5,index:i,osakaAction:'blade',hasCollision:true});}
      l.add('ninja-jump','decoration',v(49.3,20.95,0),v(1,1,1),{subType:'nara_jump_pad',hasCollision:true,naraAction:'jump',width:3,velocity:18.5,launchY:8.3,directionX:1,directionZ:0},-Math.PI/2);
      l.decor('ninja-pagoda','building',v(-45,0,0),{width:9,height:42,accent:0xb19ed5},.8);l.city(0,0,175);break;
    }
    case 10:{
      const approach=l.path('castle-arrival',[v(52,22,30),v(52,22,12),v(50,22,0),v(39,20,0),v(29,17,0),v(22,16,0)],2.8,false);
      l.path('castle-moat-ring',osakaArc(0,0,22,0,Math.PI*2,16),2.65,false);
      l.path('castle-exit',[v(-22,16,0),v(-30,14,0),v(-40,12.2,0)],2.3,false);
      for(let i=0;i<8;i++){const a=i/8*Math.PI*2,r=9+(i%2)*4;l.decor(`castle-inner-dome-${i}`,'dome',v(Math.cos(a)*r,14,Math.sin(a)*r),{radius:2.2+i%3*.7,height:1.4+i%2,hasCollision:true});}
      const xs=[-43,-49,-54,-58.5,-63],rs=[3.4,2.8,2.4,2,2.2];
      xs.forEach((x,i)=>l.decor(`castle-last-dome-${i}`,'dome',v(x,12,0),{radius:rs[i],height:.6,hasCollision:true}));
      l.finish(approach);l.end=v(-63,12.6,0);l.yaw=Math.PI/2;
      l.decor('osaka-keep','castle',v(1,1,-78),{},2.8);l.city(0,0,190);
      // A readable reward trail along the approach, upper moat and final precise stepping domes.
      for(const t of [.12,.4,.7]){const p=approach.points[Math.floor(t*(approach.points.length-1))];l.coin(v(p.x,p.y+.85,p.z));}
      for(const a of [Math.PI*.25,Math.PI*.5,Math.PI*.75])l.coin(v(Math.cos(a)*22,16.85,Math.sin(a)*22));
      for(let i=0;i<4;i++)l.coin(v(xs[i],12.6+.85,0));break;
    }
  }
  if(!l.objects.some(o=>o.type==='collectible')) {
    const points=l.routes.flatMap(r=>r.points);
    for(let i=0;i<count;i++){const p=points[Math.floor((.08+.84*i/Math.max(1,count-1))*(points.length-1))];l.coin(v(p.x,p.y+.85,p.z));}
  }
  l.add('goal','goal',v(l.end.x,l.end.y+.1,l.end.z),v(1,1,1),{},l.yaw);
  for(const object of l.objects)if(object.properties?.subType==='nara_rotor')Object.assign(object.properties,{neonRotor:true,neonAccent:0xff79d5});
 return {id:`world-07-level-03-stage-${String(stage).padStart(2,'0')}`,world:7,level:3,stage,name:OSAKA_NAMES[stage-1],theme:'cherry_blossom',musicTrack:'sky_waltz',timeLimit:stage===3?120:stage===9?240:210,spawn:l.spawn,objects:l.objects,properties:{osakaRevision:OSAKA_REVISION}};
}
export const WORLD_07_LEVEL_03_STAGES:Record<number,LevelData>=Object.fromEntries(Array.from({length:10},(_,i)=>[i+1,build(i+1)]));

registerStageSet(7,3,WORLD_07_LEVEL_03_STAGES);

