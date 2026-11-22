import {registerStageSet} from '../StageRegistry';
import {Vector3} from "three";
import type {LevelData,Vector3Data} from "../LevelTypes";
import {AsturiasLayout,v} from "./AsturiasLayout";
import {roundedSellaRoute} from "./SellaRoute";
import {CovadongaPath,mineJunctions,mineOffset,stretchMineRoute} from "./CovadongaPath";
import {WORLD_04_LEVEL_04_STAGES} from "../world-04/level-04-stages";
import {WORLD_05_LEVEL_02_STAGES} from "./level-02-stages";
import {createBackRoundRoute} from "./BackRoundRoute";

const zero=v(0,0,0),unit=v(1,1,1);
const names=["Bus Asturiano","Curvas en Bus","Curvas y Vacas en Bus","Muro5","Objetos20","Mina","Vaques","Fuente 7 caños","Covadonga","Picos de Covadonga"];
function stage(n:number,spawn:Vector3Data,time:number,build:(l:AsturiasLayout)=>void,properties:Record<string,unknown>={}):LevelData {
  const l=new AsturiasLayout(n,4);build(l);
  const road=l.objects.find(o=>o.properties?.subType==="asturias_cov_road");
  if(n!==6) l.decor("paisaje","cov_landscape",zero,unit,{hasCollision:false,seed:n,routeWidth:road?.properties?.width??12,
    points:road?.properties?.points??[spawn],mountainSide:n===2||n===3 ? "left":"both",
    protectedAreas:n===9 ? [{x:0,z:-210,radius:52},{x:0,z:15,radius:13}]:[]});
  l.objects.filter(o=>o.properties?.covadongaAction==="cow").forEach((cow,i)=>{cow.properties!.cowBreed=["brown","dairy","black","white"][i%4];});
  return {id:`world-05-level-04-stage-${String(n).padStart(2,"0")}`,world:5,level:4,stage:n,name:names[n-1],
    spawn,timeLimit:time,theme:"emerald",musicTrack:n===6 ? "arcade_rush":"sky_waltz",properties:{covadongaRevision:"picos-covadonga-v1",covadongaSceneryRevision:"grounded-picos-v2",...properties},objects:l.objects};
}
const busRoad1=Array.from({length:69},(_,i)=>v(Math.sin(i/68*Math.PI)*5,12+i/68*8,24-i*4));
const busRoad2=roundedSellaRoute([v(0,32,24),v(0,36,-35),v(42,50,-85),v(-42,66,-135),v(42,82,-185),v(-42,98,-235),v(0,114,-300),v(0,116,-350)],24);
const busRoad3=busRoad2.map(p=>({...p,y:p.y+10}));
const minePoints=stretchMineRoute(Array.from({length:301},(_,i)=>{const t=i/300;return v(Math.sin(t*Math.PI*7)*14,90-t*48,20-t*1320);}));
const minePath=new CovadongaPath(minePoints);
function roadStage(l:AsturiasLayout,points:Vector3Data[],width:number,cows=false) {
  const path=new CovadongaPath(points),bus=path.at(8);
  l.decor("carretera","cov_road",zero,unit,{points,width,hasCollision:true,cliffLeft:true});
  l.decor("autobus","cov_bus",bus.position,unit,{covadongaAction:"bus",hasCollision:false},bus.heading);
  l.decor("parada","sign",v(points[0].x-width/2-2,points[0].y,points[0].z),unit,{label:"LAGOS DE COVADONGA",caption:"SERVICIO DE MONTAÑA"});
  l.coins(Array.from({length:26},(_,i)=>path.at(18+(path.length-34)*i/25,Math.sin(i*1.7)*width*.16).position.add(new Vector3(0,1.9,0))));
  for(let i=0;i<(cows ? 5:4);i++) {
    const p=path.at(45+i*(path.length-75)/(cows ? 5:4),i%2 ? width*.28:-width*.28);
    l.decor(`roca-${i}`,"sella_rock",p.position,v(.65,.8,.75),{covadongaAction:"rock",hasCollision:true});
  }
  if(cows) for(let i=0;i<12;i++) {
    const p=path.at(42+i*(path.length-75)/12);
    l.decor(`vaca-${i}`,"cov_cow",p.position,unit,{covadongaAction:"cow",amplitude:width*.37,phase:i*1.37,frequency:.45+(i%3)*.11,hasCollision:false},p.heading);
  }
  const end=path.at(path.length-5).position;l.goal(end.clone().add(new Vector3(0,.12,0)));
}
export const WORLD_05_LEVEL_04_STAGES:Record<number,LevelData>={
  1:stage(1,v(0,13.12,24),100,l=>roadStage(l,busRoad1,12),{covadongaMode:"bus",minimumTravelTime:15,boardAtSpawn:false}),
  2:stage(2,v(0,33.12,16),160,l=>roadStage(l,busRoad2,5.4),{covadongaMode:"bus",minimumTravelTime:30,boardAtSpawn:true}),
  3:stage(3,v(0,43.12,16),170,l=>roadStage(l,busRoad3,10.8,true),{covadongaMode:"bus",minimumTravelTime:30,boardAtSpawn:true}),
  4:stage(4,{...WORLD_04_LEVEL_04_STAGES[4].spawn},110,l=>{
    for(const original of WORLD_04_LEVEL_04_STAGES[4].objects) {
      const o=structuredClone(original);o.id=o.id.replace(/^w4s44-/,"w5s44-");
      if(o.type==="platform" || o.type==="moving-platform") o.properties={...o.properties,theme:"custom_color",customColor:o.id.includes("wall") ? "#8c9580":"#bec4b0"};
      if(o.type!=="decoration") l.objects.push(o);
    }
    for(let i=0;i<5;i++) {
      l.decor(`hayas-${i}`,"cov_beech",v(-9,i*4.5,24-i*18),v(1.2,1.2,1.2),{hasCollision:false});
      l.decor(`capilla-${i}`,"cov_waymarker",v(8,i*4.5,21-i*18),unit,{hasCollision:false});
    }
  }),
  5:stage(5,v(0,1.12,14),95,l=>{
    for(const original of WORLD_05_LEVEL_02_STAGES[5].objects) {
      const o=structuredClone(original);o.id=o.id.replace(/^w5s25-/,"w5s45-");
      if(o.properties?.subType==="asturias_sign") o.properties={...o.properties,label:"PICOS DE COVADONGA",caption:"ENOL · ERCINA · LA SANTINA"};
      l.objects.push(o);
    }
    l.decor("basilica-miniatura","cov_basilica",v(0,0,-16),v(.13,.13,.13),{hasCollision:false});
    l.decor("rebeco","cov_chamois",v(11,0,5),unit,{hasCollision:false});
    l.decor("fuente-miniatura","cov_spring",v(-7,0,-5),v(.5,.5,.5),{hasCollision:true});
    l.decor("oveja","cov_sheep",v(6,0,11),unit,{hasCollision:false});
  }),
  6:stage(6,v(0,91.12,18),130,l=>{
    l.block("anden",v(0,89.6,19),v(9,.8,14),"#706654");
    l.decor("vias","cov_mine",zero,unit,{points:minePoints,junctions:mineJunctions(),hasCollision:false});
    l.decor("vagoneta","cov_cart",minePath.at(4).position,unit,{covadongaAction:"cart",hasCollision:false});
    const junctions=mineJunctions();
    for(let i=0;i<junctions.length;i++) {
      const j=junctions[i],side=j.kind==="cross" ? j.coins:j.blocked ? -j.blocked:1;
      for(const t of [.2,.4,.6,.8]) l.coins([minePath.at(j.start+j.length*t,mineOffset(j,t,side)).position.add(new Vector3(0,1.55,0))]);
    }
    l.coins(Array.from({length:12},(_,i)=>minePath.at(4+i*1.4).position.add(new Vector3(0,1.55,0))));
    const goal=minePath.at(minePath.length-5).position;l.goal(goal.clone().add(new Vector3(0,.2,0)));
    l.decor("luz-salida","cov_mine_exit",minePath.at(minePath.length-15).position,unit,{hasCollision:false});
  },{covadongaMode:"cart",minimumTravelTime:60,boardAtSpawn:true,covadongaMineRevision:"paced-mine-v2"}),
  7:stage(7,v(0,31.12,20),120,l=>{
    const points=Array.from({length:71},(_,i)=>v(Math.sin(i/70*Math.PI*2)*7,30-i*.06,22-i*3.6));
    l.decor("senda","cov_road",zero,unit,{points,width:8,style:"trail",hasCollision:true});
    const path=new CovadongaPath(points);
    for(let i=0;i<15;i++) {
      const p=path.at(24+i*14.5);
      l.decor(`vaca-${i}`,"cov_cow",p.position,unit,{covadongaAction:"cow",amplitude:2.95,frequency:.5+(i%4)*.12,phase:i*1.2,hasCollision:false},p.heading);
    }
    for(let i=0;i<6;i++) l.decor(`roca-${i}`,"sella_rock",path.at(35+i*32,i%2 ? 2.6:-2.6).position,v(.8,.8,.8),{hasCollision:true});
    l.coins(Array.from({length:26},(_,i)=>path.at(10+i*9).position.add(new Vector3(0,.7,0))));
    l.goal(path.at(path.length-5).position.add(new Vector3(0,.1,0)));
  }),
  8:stage(8,v(0,51.12,0),180,l=>{
    l.decor("fuente-siete-canos","cov_fountain",zero,unit,{covadongaAction:"fountain",rotationSpeed:.22,hasCollision:true});
    l.block("pilona-inferior",v(0,3.6,0),v(19,.8,19),"#ada78c",{shape:"cylinder"});
    for(let tier=0;tier<7;tier++) {
      const angle=tier*Math.PI*2/7;
      l.coins([v(Math.cos(angle)*3,50-tier*6.5+.7,Math.sin(angle)*3)]);
    }
    l.goal(v(0,4.08,0));
  }),
  9:stage(9,v(3,31.12,17),100,l=>{
    l.block("mirador-canon",v(0,29.6,15),v(17,.8,19),"#9e9e87");
    l.decor("canon","cov_cannon",v(0,30,11),unit,{covadongaAction:"cannon",hasCollision:false});
    l.decor("basilica","cov_basilica",v(0,4,-210),unit,{hasCollision:true});
    l.decor("roquedo-basilica","cov_outcrop",v(0,4,-210),unit,{hasCollision:true});
    l.decor("roquedo-mirador","cov_outcrop",v(0,30,15),v(.36,.9,.3),{hasCollision:false});
    l.add("meta-entre-torres","goal",v(0,39,-210),v(4,4,4),{covadongaAction:"cannonGoal"});
    l.coins([v(-4,30.7,15),v(4,30.7,12),v(0,30.7,19),v(-5,30.7,19),v(5,30.7,19),v(0,30.7,20)]);
  },{covadongaMode:"cannon",boardAtSpawn:false}),
  10:stage(10,v(0,29.12,0),150,l=>{
    const {points,widths,width}=createBackRoundRoute();
    l.block("salida-picos",v(0,27.6,0),v(12,.8,6),"#adb8a2");
    l.decor("back-round","cov_road",zero,unit,{points,width,widths,style:"finale",hasCollision:true});
    const path=new CovadongaPath(points);
    for(let i=0;i<3;i++) l.decor(`roca-inicial-${i}`,"sella_rock",path.at(8+i*8,i%2 ? 1.8:-1.8).position,v(.45,.6,.6),{hasCollision:true});
    l.decor("vaca-inicial","cov_cow",path.at(12,1.4).position,v(.7,.7,.7),{covadongaAction:"cow",amplitude:.55,frequency:.5,phase:0,hasCollision:false});
    l.coins(Array.from({length:25},(_,i)=>path.at(3+(path.length-6)*i/24).position.add(new Vector3(0,.7,0))));
    const finish=path.at(path.length).position;
    l.block("cumbre-final",v(finish.x,27.6,finish.z),v(3.6,.8,3.6),"#bfc6a5",{shape:"cylinder"});
    l.goal(finish.clone().add(new Vector3(0,.12,0)));
    l.decor("cruz-cumbre","cangas_cross",v(finish.x+3,28,finish.z-2),v(1.4,1.4,1.4),{hasCollision:false});
  },{backRoundRouteRevision:"ds-reference-v3"})
};

registerStageSet(5,4,WORLD_05_LEVEL_04_STAGES);

