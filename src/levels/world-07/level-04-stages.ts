import publishedEditorStages from '../editor-saved/world-07.json';
import {registerStageSet} from '../StageRegistry';
import type {LevelData,LevelObjectData,Vector3Data} from '../LevelTypes';
import {TOKYO_NAMES,TOKYO_BUDGETS,TOKYO_REVISION,TOKYO_POLISH_REVISION,TOKYO_MACHINE_REVISION,TOKYO_ARCADE_REVISION,TOKYO_ACTION_REVISION,TOKYO_FUTURE_REVISION,tokyoGateSpeed,PINBALL_SLOPE,pinballHeight,tokyoPath,tv as v} from './TokyoRoutes';
type Route=ReturnType<typeof tokyoPath>;
class Layout {
 objects:LevelObjectData[]=[];routes:Route[]=[];spawn=v(0,17,20);end=v(0,16,-20);yaw=0;
 constructor(readonly stage:number){}
 add(name:string,type:LevelObjectData['type'],position:Vector3Data,scale=v(1,1,1),properties:Record<string,unknown>={},yaw=0){const o:LevelObjectData={id:`w7n4e${this.stage}-${name}`,type,position,scale,rotation:v(0,yaw,0),properties};this.objects.push(o);return o;}
 decor(name:string,kind:string,p:Vector3Data,properties:Record<string,unknown>={},scale=1,yaw=0){return this.add(name,'decoration',p,v(scale,scale,scale),{subType:`tokyo_${kind}`,hasCollision:false,...properties},yaw);}
 path(name:string,points:Vector3Data[],width=3,curved=true){const r=tokyoPath(points,width,curved);this.decor(name,'path',v(0,0,0),{...r,hasCollision:true});this.routes.push(r);return r;}
 floor(name:string,p:Vector3Data,w:number,d:number,color='#34536d'){return this.add(name,'platform',v(p.x,p.y-.4,p.z),v(w,.8,d),{theme:'custom_color',customColor:color,color});}
 coin(p:Vector3Data){this.add(`prize-${this.objects.filter(o=>o.type==='collectible').length}`,'collectible',p);}
 finish(r:Route){const a=r.points[2],b=r.points.at(-3)!,c=r.points.at(-4)!;this.spawn=v(a.x,a.y+1.05,a.z);this.end={...b};this.yaw=Math.atan2(c.x-b.x,c.z-b.z);}
 city(x=0,z=0,span=100){for(const side of [-1,1])for(let i=0;i<5;i++)this.decor(`skyline-${side}-${i}`,'building',v(x+side*(span/2+18),0,z-60+i*30),{height:25+(i*13%27),width:9+i%3*3,accent:i%2?0xe59ebf:0x77d9de},1,side>0?-Math.PI/2:Math.PI/2);}
}
function build(stage:number):LevelData {
 const l=new Layout(stage);
 switch(stage){
 case 1:{
  l.floor('arrival',v(0,16,8),12,14);l.floor('exit',v(0,16,-62),12,14);l.spawn=v(0,17.05,10);l.end=v(0,16,-63);l.decor('scramble-streets','streets',v(0,0,-28));
  for(let i=0;i<16;i++){const z=-i*3.55;l.decor(`crossing-${i}`,'stripe',v(0,16,z),{width:11,depth:3.05,index:i,tokyoAction:'stripe',hasCollision:true});l.decor(`walker-${i}`,'pedestrian',v(0,16,z),{index:i,tokyoAction:'pedestrian',hasCollision:true});if(i%2===0)l.coin(v([-3.8,0,3.8,0][i/2%4],17.15,z));}
  l.decor('shibuya-screen','billboard',v(-19,17,-25),{text:'SHIBUYA  TOKYO'},1.7,Math.PI/2);for(const x of [-9,9])l.decor(`signal-${x}`,'signal',v(x,16,-59));l.city(0,-25,47);break;
 }
 case 2:{
  l.floor('machine-floor',v(0,10,0),24,24,'#647f9d');l.spawn=v(0,11.1,0);l.end=v(9,10,-9);
  for(const x of [-12,12])l.floor(`wall-x-${x}`,v(x,13,0),.5,24).scale.y=6;
  for(const z of [-12,12])l.floor(`wall-z-${z}`,v(0,13,z),24,.5).scale.y=6;
  l.decor('ufo-catcher','cabinet',v(0,10,0));l.decor('automatic-claw','claw',v(0,27,0),{tokyoAction:'claw'});
  for(const p of [v(-8,11,7),v(-8,11,-7),v(7,11,7),v(7,11,-7),v(-4,11,0),v(4,11,0),v(0,11,-4),v(0,11,4)])l.coin(p);
  l.city(0,0,80);break;
 }
 case 3:{
  const y=pinballHeight,pitch=Math.atan(PINBALL_SLOPE);
  const approach=l.path('pinball-approach',[v(-28,16,40),v(-28,24,17),v(-28,y(0),0),v(-18,y(0),0),v(-12.04,y(0),0)],3.6,false);l.finish(approach);
  const table=l.decor('pachinko-table','pinball_table',v(0,y(-20),-20),{width:24,length:64*Math.hypot(1,PINBALL_SLOPE),hasCollision:true});table.rotation.x=pitch;
  for(const [name,x,z,depth] of [['left-low',-12.3,8.75,9.5],['left-high',-12.3,-28.5,49],['right',12.3,-20,67]] as const){const o=l.floor(`table-wall-${name}`,v(x,y(z)+1.5,z),.5,depth*Math.hypot(1,PINBALL_SLOPE));o.scale.y=2.5;o.rotation.x=pitch;}
  l.floor('table-back',v(0,y(-52)+1.7,-53),25,.6).scale.y=3;
  l.floor('drain-guard',v(0,16.5,13),25,1).scale.y=2;
  for(const side of [-1,1]){const paddle=l.decor(`flipper-${side}`,'flipper',v(side*11.8,y(8)+.23,8),{side,length:10.8,tokyoAction:'flipper',hasCollision:true});paddle.rotation.x=pitch;}
  for(let i=0;i<7;i++){const z=-8-i*5,x=i%2?-6:5;l.add(`pachinko-pin-${i}`,'bumper',v(x,y(z)+.7,z),v(1.3,1.3,1.3),{color:i%2?'#eaa5ca':'#86e1e6'});}
  l.end=v(0,y(-47),-47);l.yaw=0;l.decor('pachinko-neon','billboard',v(0,y(-52)+2,-58),{text:'PACHINKO'},1.4);l.city(0,-20,88);
  for(let i=0;i<10;i++){const z=4-i*5;l.coin(v(i%2?-2:2,y(z)+.9,z));}break;
 }
 case 4:{
  const r=l.path('double-wall-course',[v(0,18,22),v(0,18,0),v(0,19,-32),v(13,21,-52),v(0,23,-72),v(0,24,-105)],5,false);l.finish(r);
  for(let i=0;i<7;i++)for(let row=0;row<2;row++){const p=r.points[Math.floor(r.points.length*(.18+i*.105+row*.025))];l.decor(`double-gate-${i}-${row}`,'tile',v(p.x,p.y+2.4,p.z),{width:3.6,depth:.55,height:2.4,axis:'gate',index:i*2+row,speed:tokyoGateSpeed(i*2+row),tokyoAction:'gate',hasCollision:true});}
  l.city(0,-40,90);break;
 }
 case 5:{
  l.floor('akihabara-arcade',v(0,14,0),38,54);l.spawn=v(0,15.05,22);l.end=v(0,14,-22);
  // Twenty prizes draw a symmetrical torii, with a curved lintel and two straight pillars.
  for(const [x,z] of [[-12,-14],[-8,-13],[-4,-12],[0,-12],[4,-12],[8,-13],[12,-14],[-8,-7],[-4,-7],[0,-7],[4,-7],[8,-7]])l.coin(v(x,14.85,z));
  for(const z of [-2,3,8,13])for(const x of [-8,8])l.coin(v(x,14.85,z));
  for(const x of [-16,16])for(let i=0;i<5;i++)l.decor(`arcade-${x}-${i}`,i%2?'vending':'capsules',v(x,14,-18+i*9),{},.8,x>0?-Math.PI/2:Math.PI/2);l.city();break;
 }
 case 6:{
  const r=l.path('vending-single-route',[v(-82,19,0),v(-66,19,0),v(-58,17,0),v(-58,17,-8),v(-38,17,-8),v(-38,17,8),v(-18,18,14),v(-18,17,8),v(2,17,-8),v(22,17,-8),v(22,17,8),v(42,18,14),v(42,17,8),v(62,17,8),v(62,17,0),v(83,17,0)],2.4,false);l.finish(r);
  for(let i=0;i<7;i++){const x=-58+i*20;for(const side of [-1,1]){
   l.decor(`vending-${i}-${side}`,'vending',v(x,17,side>0&&(i===2||i===5)?18:side*11),{color:i%2?0xa8d9d6:0xd9a0c5},1,side>0?Math.PI:0);
   if(i===1||i===4)l.decor(`vending-pair-${i}-${side}`,'vending',v(x+3,17,side*11),{color:0xc7b8df},1,side>0?Math.PI:0);
  }}
  for(const [x,z,index] of [[-48,-8,0],[12,-8,1],[72,0,2]])l.add(`beam-rotor-${index}`,'decoration',v(x,17,z),v(1,1,1),{subType:'nara_rotor',naraAction:'rotor',length:5,index,hasCollision:true});
  l.city(0,0,220);break;
 }
 case 7:{
  const a=l.path('capsule-arrival',[v(-65,23,-42),v(-60,23,-34),v(-50,23,-34),v(-50,23,-24),v(-40,23,-24),v(-40,23,-10),v(-30,23,-10)],3,false);l.finish(a);
  for(let i=0;i<12;i++)l.decor(`articulated-${i}`,'tile',v(-28.5+i*3,23,-10),{width:3.1,depth:3.6,index:i,chain:true,chainCount:12,tokyoAction:'tile',hasCollision:true});
  l.path('capsule-turn',[v(6,23,-10),v(12,23,-10),v(12,23,0),v(6,23,0)],2.8,false);
  for(let i=0;i<20;i++)l.decor(`return-tile-${i}`,'tile',v(4.5-i*3,23,0),{width:3.1,depth:3.6,index:i,chain:true,chainCount:20,chainOffset:2,tokyoAction:'tile',hasCollision:true});
  const end=l.path('capsule-exit',[v(-54,23,0),v(-61,23,0)],3,false);l.end={...end.points.at(-3)!};l.yaw=Math.PI/2;
  for(let i=0;i<6;i++)l.decor(`capsule-hotel-${i}`,'capsules',v(-50+i*20,5,-58),{},2);l.city(0,0,180);break;
 }
 case 8:{
  const bowls=[v(-46,24,0),v(-9,22,-8),v(28,19,1)];
  bowls.forEach((p,i)=>{l.add(`drift-bowl-${i}`,'decoration',p,v(1,1,1),{subType:'nara_bowl',radius:10,depth:3,hasCollision:true});l.decor(`drift-car-${i}`,'car',p,{radius:7.2,depth:3,index:i,speed:i%2?-3:3.1,color:[0x39ff52,0x22bfff,0xff32bc][i],tokyoAction:'car',hasCollision:true});if(i){const b=bowls[i-1];l.path(`drift-link-${i}`,[v(b.x+9,b.y,b.z),v((b.x+p.x)/2,(b.y+p.y)/2,b.z+3),v(p.x-9,p.y,p.z)],2.25,true);}});
  l.floor('drift-start',v(-62,24,0),14,7);l.path('drift-onramp',[v(-62,24,0),v(-55,24,0)],3,false);l.spawn=v(-64,25.05,0);
  const end=l.path('drift-drop',[v(37,19,1),v(48,18,8),v(53,12,28),v(69,9,41),v(85,9,39)],2.15,true);l.end={...end.points.at(-3)!};l.yaw=-Math.PI/2;
  for(const p of bowls)for(const side of [-1,1])l.coin(v(p.x,p.y-3+.85,p.z+side*1.5));for(const t of [.4,.8]){const p=end.points[Math.floor(t*(end.points.length-1))];l.coin(v(p.x,p.y+.85,p.z));}l.city(10,0,220);break;
 }
 case 9:{
  const nodes=[v(74,31,32),v(54,29,25),v(32,27,20),v(0,25,25),v(-30,24,25),v(-47,24,12),v(-42,24,-8),v(-20,24,-16),v(4,24,-10),v(25,24,-17),v(28,24,-37),v(8,24,-48),v(-18,24,-42),v(-42,24,-48),v(-55,24,-69),v(-35,24,-81)];
  const r=l.path('shinjuku-hairpins',nodes,2.2,true);l.finish(r);l.floor('shinjuku-landing',v(-14,24,-81),20,7);l.end=v(-9,24,-81);l.yaw=-Math.PI/2;
  l.add('shinjuku-jump','decoration',v(-35.3,23.95,-81),v(1,1,1),{subType:'nara_jump_pad',hasCollision:true,naraAction:'jump',width:2.5,velocity:18.5,launchY:8.3,directionX:1,directionZ:0},-Math.PI/2);
  l.decor('shinjuku-monster','godzilla',v(0,0,-58),{tokyoAction:'monster'},2.2,Math.PI);
  for(let i=0;i<3;i++){const p=r.points[Math.floor(r.points.length*(.25+i*.23))];l.add(`tail-rotor-${i}`,'decoration',p,v(1,1,1),{subType:'nara_rotor',naraAction:'rotor',length:5,index:i,hasCollision:true});}for(let i=0;i<2;i++){const p=r.points[Math.floor(r.points.length*(.38+i*.32))];l.decor('pulse-'+i,'pulse_emitter',p,{index:i,tokyoAction:'pulse'});}l.city(0,-30,195);break;
 }
 case 10:{
  for(let island=0;island<3;island++){const x=-64+island*64,w=2.5-island*.15;
   for(let i=0;i<4;i++){const start=i===3?-6:i===2&&island%2?-6:-18,end=i===0&&island%2===0?6:i===2?6:18;l.path(`grid-${island}-${i}`,[v(x+start,22,-18+i*12),v(x+end,22,-18+i*12)],w,false);}
   for(let i=0;i<4;i++)l.path(`cross-${island}-${i}`,[v(x-18+i*12,22,i===2?-6:-18),v(x-18+i*12,22,i===0?6:18)],w,false);
   if(island<2)for(let j=0;j<8;j++)l.decor(`bridge-${island}-${j}`,'tile',v(x+20+j*3.5,22,0),{width:3.6,depth:2.8,index:j,chain:true,chainCount:8,chainOffset:island*1.7,tokyoAction:'tile',hasCollision:true});
   for(const [dx,z] of [[-12,-18],[-6,12],[12,-6],[18,12]])l.coin(v(x+dx,22.85,z));
  }
  [[-70,-6],[-58,18],[-46,-12],[-6,6],[6,-6],[18,12],[58,-12],[70,6]].forEach(([x,z],i)=>l.add('final-rotor-'+i,'decoration',v(x,22,z),v(1,1,1),{subType:'nara_rotor',naraAction:'rotor',length:5.5,index:i,hasCollision:true}));
  [[-82,-12],[-70,6],[-52,-6],[-12,-6],[12,18],[46,-12],[64,-6],[82,12]].forEach(([x,z],i)=>l.decor('pulse-'+i,'pulse_emitter',v(x,22,z),{index:i,tokyoAction:'pulse'}));
  l.spawn=v(-82,23.05,0);const end=l.path('tokyo-finale',[v(82,22,0),v(94,24,0),v(104,28,0),v(115,30,0)],2.4,false);l.end={...end.points.at(-3)!};l.yaw=-Math.PI/2;
  l.decor('tokyo-tower','tower',v(133,0,-30),{},2);l.decor('mount-fuji','fuji',v(170,-16,-150),{},3);l.city(0,0,260);break;
 }
 }
 if(!l.objects.some(o=>o.type==='collectible')){const points=l.routes.flatMap(r=>r.points);for(let i=0;i<TOKYO_BUDGETS[stage-1];i++){const p=points[Math.floor((.08+.84*i/Math.max(1,TOKYO_BUDGETS[stage-1]-1))*(points.length-1))];l.coin(v(p.x,p.y+.85,p.z));}}
 l.add('goal','goal',v(l.end.x,l.end.y+.1,l.end.z),v(1,1,1),stage===3?{tokyoAction:'pinballGoal'}:{},l.yaw);
 for(const object of l.objects)if(object.properties?.subType==='nara_rotor')Object.assign(object.properties,{neonRotor:true,neonAccent:0x73e5f2});
 return {id:`world-07-level-04-stage-${String(stage).padStart(2,'0')}`,world:7,level:4,stage,name:TOKYO_NAMES[stage-1],theme:'cherry_blossom',musicTrack:'sky_waltz',timeLimit:stage===2?300:240,spawn:l.spawn,objects:l.objects,properties:{tokyoRevision:TOKYO_REVISION,tokyoPolishRevision:TOKYO_POLISH_REVISION,tokyoMachineRevision:TOKYO_MACHINE_REVISION,tokyoArcadeRevision:TOKYO_ARCADE_REVISION,tokyoFutureRevision:TOKYO_FUTURE_REVISION,tokyoActionRevision:TOKYO_ACTION_REVISION}};
}
export const WORLD_07_LEVEL_04_STAGES:Record<number,LevelData>=Object.fromEntries(Array.from({length:10},(_,i)=>[i+1,build(i+1)]));

// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('7_4_')) Object.assign(WORLD_07_LEVEL_04_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(7,4,WORLD_07_LEVEL_04_STAGES);

