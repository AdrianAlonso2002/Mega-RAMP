import {registerStageSet} from '../StageRegistry';
import {Vector3} from "three";
import type {LevelData,Vector3Data} from "../LevelTypes";
import {LondonLayout,v} from "./LondonLayout";
import {LONDON_REVISION,COLD_RUN_LENGTH,HAIR_HOT_LENGTH,londonMaze,mazeCell,millipedeRoute} from "./LondonRoutes";
import {CovadongaPath} from "../world-05/CovadongaPath";

export const LONDON_DECORATIONS=[
  ["telephone","Cabina telefónica roja"],["postbox","Buzón real"],["doubledecker","Autobús de dos pisos"],
  ["roundel","Cartel Underground"],["lamp","Farola victoriana"],["bench","Banco de Queens Park"],
  ["terrace","Casa londinense"],["taxi","Taxi negro"],["clocktower","Torre del reloj"],["park_gate","Entrada del parque"]
] as const;
export const CHRISTMAS_DECORATIONS=[
  ["christmas_tree","Abeto de Navidad"],["wreath","Corona navideña"],["garland","Guirnalda de luces"],
  ["gift","Regalo"],["snowman","Muñeco de nieve"],["star","Estrella luminosa"],
  ["candycane","Bastón de caramelo"],["bauble","Bola de Navidad"],["nutcracker","Cascanueces"],["lantern","Farol navideño"]
] as const;
const names=["Cuadrado6","Airport","Underground","M&S","Objetos21","Freaking Cold","Crows","Primo Punch","Plancha de pelo","Tinieblas"];
function stage(n:number,spawn:Vector3Data,timeLimit:number,design:(l:LondonLayout)=>void,properties:Record<string,unknown>={}):LevelData {
  const l=new LondonLayout(n);design(l);
  if(n!==10) l.decor("ambiente","scenery",v(0,0,0),v(1,1,1),{variant:n});
  return {id:`world-06-level-01-stage-${String(n).padStart(2,"0")}`,world:6,level:1,stage:n,name:names[n-1],theme:"winter",musicTrack:"sky_waltz",spawn,timeLimit,
    properties:{londonRevision:LONDON_REVISION,...properties},objects:l.objects};
}
const shopMaze=londonMaze(611),darkMaze=londonMaze(61010);
const startMaze=mazeCell(shopMaze,0),startDark=mazeCell(darkMaze,0);
export const WORLD_06_LEVEL_01_STAGES:Record<number,LevelData>={
  1:stage(1,v(0,1.05,11),75,l=>{
    l.block("plaza",v(0,-.4,0),v(30,.8,30),"#b7c1c5");
    l.block("sendero",v(0,.015,0),v(5,.03,27),"#e8e5dc");
    l.decor("arbol-central","christmas_tree",v(0,0,0),v(1.25,1.25,1.25),{hasCollision:true});
    LONDON_DECORATIONS.forEach(([kind],i)=>l.decor(`londres-${kind}`,kind,v(i<5 ? -12:12,0,10-(i%5)*5),v(.7,.7,.7),{hasCollision:true},i<5 ? Math.PI/2:-Math.PI/2));
    CHRISTMAS_DECORATIONS.forEach(([kind],i)=>l.decor(`navidad-${kind}`,kind,v(i%2 ? 6.8:-6.8,0,10-Math.floor(i/2)*5),v(.7,.7,.7),{hasCollision:i%3===0}));
    l.coins(Array.from({length:14},(_,i)=>v(i%2 ? 3.8:-3.8,.7,10-Math.floor(i/2)*3.2)));
    l.goal(v(0,.1,-12));
  }),
  2:stage(2,v(0,83.1,-5),160,l=>{
    l.block("pista",v(0,-.4,-130),v(42,.8,210),"#525e6c");
    for(let i=0;i<17;i++) l.block(`marcas-${i}`,v(0,.015,-40-i*10),v(.4,.03,5),"#eef1e8");
    l.block("terminal",v(14,-.25,-173),v(22,.74,25),"#c6cbd0");
    l.decor("iberia","plane",v(0,80,0),v(1,1,1),{londonAction:"plane"});
    l.decor("pasarela","roundel",v(12,0,-181),v(.8,.8,.8),{caption:"WELCOME TO LONDON"});
    l.coins([v(5.5,.7,-170),v(5.5,.7,-173),v(5.5,.7,-176)]);l.goal(v(5.5,.1,-179));
  },{londonMode:"plane"}),
  3:stage(3,v(4,1.05,8),210,l=>{
    for(let i=0;i<4;i++) {
      const x=i===0 ? 4:i===3 ? 20:4+(i-1)*8,z=-120*i;
      l.block(`anden-${i}`,v(x,-.3,z),v(4.2,.6,40),"#cbc8bb");
      l.decor(`estacion-${i}`,"station",v(x,0,z),v(1,1,1),{caption:["PADDINGTON","BAKER STREET","KILBURN PARK","QUEEN'S PARK"][i],outdoor:i===3});
    }
    for(let i=0;i<3;i++) {
      const id=`w6s13-tren-${i}`;
      l.decor(`tren-${i}`,"train",v(i*8,0,-i*120),v(1,1,1),{londonAction:"train",hasCollision:true,phase:i*8,journey:120,trainIndex:i});
      l.coins([-9,0,9].map(z=>v(i*8,.9,-i*120+z)),{londonTrain:id,trainPhase:i*8});
    }
    l.goal(v(20,.1,-375));
  },{londonMode:"underground"}),
  4:stage(4,v(startMaze.x,1.05,startMaze.z),210,l=>{
    l.block("suelo",v(0,-.4,0),v(44,.8,44),"#e5ddc5");
    l.decor("supermercado","maze",v(0,0,0),v(1,1,1),{hasCollision:true,maze:shopMaze,shop:true});
    l.decor("entrada-ms","roundel",v(startMaze.x-1.1,0,startMaze.z+1.8),v(.7,.7,.7),{caption:"M&S FOODHALL",shop:true});
    shopMaze.solution.filter((_,i)=>i%3===0).forEach((cell,i)=>{const p=mazeCell(shopMaze,cell);l.coins([v(p.x,.7,p.z)]);if(i>1&&i%2===0) l.decor(`trampa-${i}`,"trap",p,v(1,1,1),{londonAction:"trap",hasCollision:true,phase:i*1.3});});
    l.goal(v(0,.1,0));
  }),
  5:stage(5,v(0,9.05,7),145,l=>{
    const points=[v(0,8,7),v(0,8,-10),v(12,8,-22),v(-8,8,-38),v(10,8,-55),v(0,8,-75)];
    l.decor("ruta-objetos","path",v(0,0,0),v(1,1,1),{hasCollision:true,points,width:2.4});
    const path=new CovadongaPath(points);
    for(let i=0;i<10;i++) {
      const p=path.at(5+i*(path.length-10)/9).position;
      l.block(`pedestal-${i}`,v(p.x,p.y-.31,p.z),v(7,.7,7),i%2 ? "#dee1d4":"#a5b5aa",{shape:"cylinder"});
      l.decor(`objeto-${i}`,LONDON_DECORATIONS[i][0],v(p.x+1.7,p.y,p.z),v(.5,.5,.5),{hasCollision:true});
      l.decor(`regalo-${i}`,CHRISTMAS_DECORATIONS[i][0],v(p.x-2,p.y,p.z+1),v(.45,.45,.45));
      l.coins([v(p.x-.9,p.y+.7,p.z),v(p.x-1.7,p.y+.7,p.z-1)]);
    }
    l.goal(path.at(path.length).position.add(new Vector3(0,.1,0)));
    l.block("llegada",v(0,7.65,-75),v(6,.8,7));
  }),
  6:stage(6,v(0,1.05,8),15,l=>{
    l.block("calle",v(0,-.4,8-COLD_RUN_LENGTH/2),v(12,.8,COLD_RUN_LENGTH+12),"#aab7c2");
    l.decor("calle-nevada","street",v(0,0,8),v(1,1,1),{length:COLD_RUN_LENGTH});
    l.coins(Array.from({length:18},(_,i)=>v(i%3===0 ? 2.6:i%3===1 ? -2.6:0,.7,2-i*(COLD_RUN_LENGTH-10)/18)));
    l.goal(v(0,.1,8-COLD_RUN_LENGTH));
  },{londonMode:"cold",freezeAfter:15}),
  7:stage(7,v(0,13.05,0),160,l=>{
    const points=millipedeRoute(),path=new CovadongaPath(points);
    l.decor("millipede","path",v(0,0,0),v(1,1,1),{points,width:3.1,hasCollision:true});
    l.block("salida",v(0,11.64,0),v(5,.8,6));
    for(let i=0;i<16;i++) {
      const side=i%2 ? 1:-1,p=path.at(18+i*(path.length-30)/16,side*2.9),toward=p.right.clone().multiplyScalar(-side);
      l.decor(`cuervo-${i}`,"crow",p.position,v(1,1,1),{londonAction:"crow",hasCollision:true,phase:i*1.37},Math.atan2(-toward.x,-toward.z));
    }
    l.coins(Array.from({length:24},(_,i)=>path.at(4+i*(path.length-8)/24).position.add(new Vector3(0,.7,0))));
    const end=path.at(path.length).position;l.block("llegada",v(end.x,11.64,end.z),v(5,.8,5));l.goal(end.add(new Vector3(0,.1,0)));
  }),
  8:stage(8,v(0,1.05,8),100,l=>{
    l.block("salida",v(0,-.36,8),v(6,.8,7));
    l.block("equilibrio",v(0,-.35,-17),v(.95,.7,48),"#d2b39c");
    l.block("meta-plaza",v(0,-.36,-44),v(6,.8,7));
    l.decor("primo","punch",v(0,0,-17),v(1,1,1),{londonAction:"punch",hasCollision:true});
    l.coins([v(0,.7,3),v(0,.7,-4),v(0,.7,-11),v(0,.7,-25),v(0,.7,-33)]);l.goal(v(0,.1,-45));
  }),
  9:stage(9,v(0,1.05,12),100,l=>{
    l.block("espera",v(0,-.36,6),v(9,.8,18),"#c5bdcb");
    l.decor("plancha","hair",v(0,0,-4),v(1,1,1),{londonAction:"hair",hotLength:HAIR_HOT_LENGTH,hasCollision:true});
    l.block("salida-plancha",v(0,-.36,-HAIR_HOT_LENGTH-15),v(9,.8,14),"#c5bdcb");
    l.coins(Array.from({length:20},(_,i)=>v(i%2 ? .8:-.8,.7,-10-i*(HAIR_HOT_LENGTH-8)/20)));
    l.goal(v(0,.1,-HAIR_HOT_LENGTH-15));
  }),
  10:stage(10,v(startDark.x,1.05,startDark.z),240,l=>{
    l.block("suelo",v(0,-.4,0),v(44,.8,44),"#f4f5f6");
    l.decor("laberinto-blanco","maze",v(0,0,0),v(1,1,1),{hasCollision:true,maze:darkMaze,shop:false});
    darkMaze.solution.filter((_,i)=>i%4===0).forEach(cell=>{const p=mazeCell(darkMaze,cell);l.coins([v(p.x,.7,p.z)]);});
    l.goal(v(0,.1,0));
  },{pitchBlack:true})
};

registerStageSet(6,1,WORLD_06_LEVEL_01_STAGES);

