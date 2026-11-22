import {registerStageSet} from '../StageRegistry';
import { CatmullRomCurve3,Vector3 } from "three";
import type { LevelData,Vector3Data } from "../LevelTypes";
import { AsturiasLayout,v } from "./AsturiasLayout";
import { alignSellaRoute,roundedSellaRoute } from "./SellaRoute";

const unit=v(1,1,1),zero=v(0,0,0);
const curve=(points:Vector3Data[],count:number)=>new CatmullRomCurve3(points.map(p=>new Vector3(p.x,p.y,p.z))).getPoints(count);

function make(stage:number,name:string,points:Vector3Data[],width:number,timeLimit:number,
  options:{foot?:boolean;shore?:boolean;breaks?:number[];current?:number;landingGoal?:boolean;basinGoal?:boolean}={},
  extra?:(l:AsturiasLayout)=>void):LevelData {
  const l=new AsturiasLayout(stage,3),start=points[0],finish=points[points.length-1];
  l.add("rio","water",zero,unit,{subType:"asturias_sella_river",points,width,breaks:options.breaks??[],current:options.current??1.4,hasCollision:false,bankCollision:true,passable:true,fluidType:"water"});
  if(!options.foot) l.decor("canoa","sella_canoe",v(start.x,start.y+.2,start.z-3),unit,{hasCollision:true,sellaAction:"canoe"});
  if(options.foot) l.decor("cartel-salida","sign",v(start.x-width/2-2,start.y+1,start.z-2),v(1.1,1.1,1.1),{
    label:name.toUpperCase(),caption:"CORRE POR LA ORILLA · AQUÍ USAS LA BOLA"
  });
  l.add("goal","goal",v(finish.x,finish.y+.07,finish.z+8),unit,{
    sellaAction:options.landingGoal ? "landingGoal" : options.basinGoal ? "basinGoal" : "finish"
  });
  const coinPoints=points.filter((_,i)=>i>0 && i<points.length-1 && i%Math.max(1,Math.floor(points.length/18))===0);
  l.coins(coinPoints.map(p=>v(p.x,p.y+.9,p.z)));
  extra?.(l);
  return {id:`world-05-level-03-stage-${String(stage).padStart(2,"0")}`,world:5,level:3,stage,name,
    spawn:options.shore ? v(start.x-10,start.y+1.52,start.z) : v(start.x,start.y+1.1,start.z-3),timeLimit,
    theme:"emerald",musicTrack:options.foot ? "arcade_rush":"sky_waltz",properties:{sellaMode:options.foot ? "foot":"canoe",boardAtSpawn:!options.shore},objects:l.objects};
}

function hazards(l:AsturiasLayout,points:Vector3Data[],width:number,step:number,gulls=0) {
  for(let i=4;i<points.length-4;i+=step) {
    const p=points[i],next=points[i+1],dx=next.x-p.x,dz=next.z-p.z,length=Math.hypot(dx,dz)||1;
    const side=Math.sin(i*2.399)*width*.29;
    l.decor(`roca-${i}`,"sella_rock",v(p.x-dz/length*side,p.y-.15,p.z+dx/length*side),
      v(1.2+(i%3)*.4,1.2+(i%4)*.28,1.25+(i%2)*.45),{hasCollision:true,sellaAction:"rock"},i*.71);
  }
  for(let i=0;i<gulls;i++) {
    const index=Math.floor((i+1)*points.length/(gulls+1)),p=points[index];
    l.decor(`gaviota-${i}`,"sella_gull",v(p.x,p.y+2,p.z),v(1.4,1.4,1.4),{
      sellaAction:"gull",phase:i*1.71,amplitude:width*.36,frequency:.73+i%3*.13,hasCollision:false
    });
  }
}

const straight=(length:number,drop:number,segments:number,startY=12)=>Array.from({length:segments+1},(_,i)=>v(0,startY-drop*i/segments,18-length*i/segments));
const downhill=curve([v(0,120,18),v(0,117,-28),v(-20,95,-90),v(14,65,-165),v(-17,37,-245),v(0,12,-330)],90);
const recta=straight(680,155,136,167);
const superTop=straight(180,100,45,127);
const superPoints=[...superTop,v(0,12,-174),v(0,12,-194),v(0,12,-215)];
const stones=curve([v(0,180,18),v(0,175,-40),v(18,150,-120),v(-16,114,-210),v(13,76,-300),v(-8,42,-400),v(0,12,-520)],130);
const waterfall=[...straight(110,0,28,110),v(0,12,-102),v(0,12,-130),v(0,12,-160),v(0,12,-200)];

// Preserve the full sequence of drops, turns and two spiral revolutions in a shorter final course.
const mega:Vector3Data[]=roundedSellaRoute([
  v(0,1042,18),v(0,932,-162),v(0,900,-230),v(-80,860,-310),v(70,780,-440),
  v(70,710,-590),v(-30,650,-590),v(-30,590,-730),v(-110,510,-850),v(-40,450,-1050),v(65,390,-1050)
],60);
for(let i=1;i<=120;i++) {
  const t=i/120,angle=t*Math.PI*4;
  mega.push(v(65+Math.sin(angle)*65,390-t*300,-1115+Math.cos(angle)*65));
}
mega.push(...roundedSellaRoute([mega[mega.length-1],v(145,65,-1050),v(150,50,-1250),v(-25,32,-1350),v(0,12,-1510),v(0,12,-1580)],60).slice(1));
const megaLength=mega.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p.x-mega[i].x,p.y-mega[i].y,p.z-mega[i].z),0);
// One minute at 100 km/h, allowing 12 m for the fixed boat/portal offsets inside the river ends.
const megaScale=(100/3.6*60+12)/megaLength;
for(const p of mega) {p.x*=megaScale;p.y=12+(p.y-12)*megaScale;p.z=18+(p.z-18)*megaScale;}
const alignedMega=alignSellaRoute(mega);
const alignedLength=alignedMega.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p.x-alignedMega[i].x,p.y-alignedMega[i].y,p.z-alignedMega[i].z),0);
const alignedScale=(100/3.6*60+12)/alignedLength;
mega.splice(0,mega.length,...alignedMega.map(p=>v(p.x*alignedScale,12+(p.y-12)*alignedScale,18+(p.z-18)*alignedScale)));

export const WORLD_05_LEVEL_03_STAGES:Record<number,LevelData>={
  1:make(1,"Canoa",straight(145,0,29),24,100,{current:1}),
  2:make(2,"Sin Bañador",straight(87.5,0,35),26,90,{shore:true,current:.8},l=>{
    l.block("embarcadero",v(0,12,-11),v(25,.8,64),"#929076",{theme:"pebbles"});
    const canoe=l.objects.find(o=>o.properties?.sellaAction==="canoe")!;canoe.position=v(0,12.2,-46);
    l.decor("bandera-embarque","flag",v(4,12.4,-40));
    [8,-3,-14,-25,-34].forEach((z,i)=>l.decor(`roca-terreno-${i}`,"sella_rock",v(i%2 ? 5.5:-5,13,z),v(1.8,1.7,2.1),{hasCollision:true,sellaAction:"rock"},i*.7));
  }),
  3:make(3,"Correr5",curve([v(0,8,18),v(0,8,-30),v(-12,8,-80),v(10,8,-140),v(-12,8,-200),v(0,8,-255)],70),25,85,{foot:true},l=>{
    const path=curve([v(0,13,18),v(0,13,-22),v(-8,18,-65),v(8,12,-115),v(-9,17,-165),v(6,12,-210),v(0,13,-255)],95);
    l.decor("sendero-de-carrera","cangas_track",zero,unit,{points:path,width:5.5,style:"trail",hasCollision:true});
    const goal=l.objects.find(o=>o.type==="goal")!;goal.position=v(0,13.08,-250);
    for(const object of l.objects) if(object.type==="collectible") {
      const p=path.reduce((a,b)=>Math.abs(a.z-object.position.z)<Math.abs(b.z-object.position.z) ? a:b);
      object.position=v(p.x,p.y+.65,p.z);
    }
  }),
  4:make(4,"Bajada al Descenso",downhill,21,120,{current:5},l=>hazards(l,downhill,21,4)),
  5:make(5,"Objetos19",straight(160,0,32),42,120,{current:.5},l=>{
    const types=["cangas_kayak","cider","bagpipe","horreo","cangas_cross","cheese","bench","flag","cangas_dolmen","cangas_chapel"];
    types.forEach((type,i)=>{
      const p=v((i%2 ? 1:-1)*(8+i%3*2),12,-5-i*12);
      l.block(`balsa-${i}`,v(p.x,11.85,p.z),v(5,.7,6),"#88633f");
      l.decor(`objeto-${i}`,type,v(p.x,12.2,p.z),v(.8,.8,.8));
      l.decor(`roca-balsa-${i}`,"sella_rock",v(p.x,12,p.z),v(2.6,.7,3),{hasCollision:true,sellaAction:"rock"});
    });
  }),
  6:make(6,"Recta del Descenso",recta,23,160,{current:6},l=>hazards(l,recta,23,4,8)),
  7:make(7,"SuperBajada",superPoints,22,105,{breaks:[superTop.length-1],current:8,landingGoal:true},l=>{
    hazards(l,superTop,22,5);
    const goal=l.objects.find(o=>o.type==="goal")!;goal.position=v(0,12.07,-182);
    goal.properties={...goal.properties,sellaAction:"landingGoal",amplitude:7,speed:.85};
  }),
  8:make(8,"Piedras",stones,19,160,{current:6.5},l=>hazards(l,stones,19,2,7)),
  9:make(9,"Caída Libre",waterfall,38,120,{breaks:[28],current:7,basinGoal:true},l=>{
    hazards(l,waterfall.slice(0,29),38,5,3);
    l.decor("cascada","sella_waterfall",v(0,12,-92),v(36,98,1),{hasCollision:false});
    const goal=l.objects.find(o=>o.type==="goal")!;goal.position=v(0,12.07,-152);
  }),
  10:make(10,"MegaBajada",mega,25,480,{current:60/3.6},l=>{
    hazards(l,mega,25,15,10);
    let index=0;
    for(const rock of l.objects.filter(o=>o.properties?.sellaAction==="rock")) {
      const size=[2,.5,1.35,.9][index++%4];
      rock.scale=v(rock.scale.x*size,rock.scale.y*size,rock.scale.z*size);
      if(size===2) {
        const i=Number(rock.id.split("-").pop()),p=mega[i],next=mega[i+1];
        const dx=next.x-p.x,dz=next.z-p.z,length=Math.hypot(dx,dz)||1,side=(Math.sin(i*2.399)<0 ? -1:1)*25*.34;
        rock.position=v(p.x-dz/length*side,p.y-.15,p.z+dx/length*side);
      }
    }
  })
};
WORLD_05_LEVEL_03_STAGES[3].spawn=v(0,14.12,15);
WORLD_05_LEVEL_03_STAGES[2].spawn=v(0,13.52,16);
WORLD_05_LEVEL_03_STAGES[2].properties!.sellaE2Revision="sella-land-short-v2";
for(const stage of [4,6,7,8,9,10]) WORLD_05_LEVEL_03_STAGES[stage].properties!.sellaRocksRevision="original-rocks-v3";
WORLD_05_LEVEL_03_STAGES[10].properties={...WORLD_05_LEVEL_03_STAGES[10].properties,
  canoePace:1.35,sellaMegaRevision:"mega-current-60-v5",sellaRocksRevision:"mega-mixed-rocks-v4"};
WORLD_05_LEVEL_03_STAGES[10].properties!.sellaRouteRevision="mega-aligned-river-v7";

registerStageSet(5,3,WORLD_05_LEVEL_03_STAGES);

