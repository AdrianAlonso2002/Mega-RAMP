import {registerStageSet} from '../StageRegistry';
import {Vector3} from "three";
import type {LevelData,Vector3Data} from "../LevelTypes";
import {LondonLayout,v} from "./LondonLayout";
import {CovadongaPath} from "../world-05/CovadongaPath";
import {MUSEUM_REVISION,MUSEUM_CHASE_LENGTH,MUSEUM_ANIMALS,gyrationRoute,romanRail,basinHeight,paintingAnswer,gemGapAngle} from "./MuseumRoutes";
class MuseumLayout extends LondonLayout {
  constructor(stage:number) {super(stage,2);}
  museum(name:string,kind:string,position:Vector3Data,scale=v(1,1,1),properties:Record<string,unknown>={},yaw=0) {
    this.add(name,"decoration",position,scale,{subType:`museum_${kind}`,hasCollision:false,...properties},v(0,yaw,0));
  }
}
const names=["Library","Salto6","Ancient Egypt","Ancient Greece","Objetos22","Ancient Roma","Museum Café","Art Paintings","Precious Gems","Night at the Museum"];
const zero=v(0,0,0),unit=v(1,1,1);
function stage(n:number,spawn:Vector3Data,time:number,build:(l:MuseumLayout)=>void,properties:Record<string,unknown>={}):LevelData {
  const l=new MuseumLayout(n);build(l);
  if(n!==8&&n!==10) l.museum("sala-museo","hall",v(0,-8,-25),unit,{variant:n});
  return {id:`world-06-level-02-stage-${String(n).padStart(2,"0")}`,world:6,level:2,stage:n,name:names[n-1],theme:"winter",musicTrack:n===10 ? "arcade_rush":"sky_waltz",spawn,timeLimit:time,
    properties:{museumRevision:MUSEUM_REVISION,...properties},objects:l.objects};
}
export const WORLD_06_LEVEL_02_STAGES:Record<number,LevelData>={
  1:stage(1,v(0,13.05,25),100,l=>{
    l.museum("hollow-diamond","diamond",v(0,12,0),unit,{hasCollision:true});
    l.museum("reading-room","reading_room",v(0,12,0));
    for(let i=0;i<8;i++) {const a=i*Math.PI/4;l.museum(`libros-${i}`,"bookshelf",v(Math.cos(a)*20,12,Math.sin(a)*20),v(.8,.8,.8),{hasCollision:true},-a);}
    l.decor("arbol-navidad","christmas_tree",v(-20,12,0),v(.8,.8,.8));
    l.coins([v(-9,12.7,19),v(9,12.7,19),v(-16,12.7,9),v(16,12.7,9),v(-19,12.7,0),v(19,12.7,0),v(-16,12.7,-9),v(16,12.7,-9),v(-9,12.7,-19),v(9,12.7,-19)]);
    l.goal(v(0,12.1,-25));
  }),
  2:stage(2,v(0,13.05,22),110,l=>{
    for(let i=0;i<5;i++) {
      const z=10-i*24,y=12+i*1.2,width=6.3;
      l.decor(`rampa-${i}`,"path",zero,unit,{hasCollision:true,width,points:[v(0,y+.2,z+14),v(0,y,z+5),v(0,y+2.2,z)]});
      l.museum(`salto-${i}`,"jump_pad",v(0,y+2.22,z+.35),unit,{museumAction:"jump",hasCollision:false,width,launchY:9.2,velocity:16.5});
      l.museum(`columna-${i}`,"column",v(-5,y-5,z+5),v(.8,1.4,.8));
      l.coins([v(0,y+.8,z+9),v(0,y+3,z-2),v(0,y+3.6,z-7)]);
    }
    l.block("llegada",v(0,17.65,-107),v(11,.8,20),"#d5cbb4");l.goal(v(0,18.15,-112));
  }),
  3:stage(3,v(0,13.05,27),180,l=>{
    l.block("entrada",v(0,11.6,27),v(9,.8,8),"#c3a879");
    l.museum("piramide","pyramid",v(0,12,0),unit,{hasCollision:true,museumAction:"pyramid"});
    for(let i=0;i<8;i++) l.coins([v(0,12+i*1.2+.8,22.5-i*3)] ,{museumTier:i});
    l.museum("obelisco","obelisk",v(-31,12,-8),v(1.5,1.5,1.5));l.museum("sarcophago","sarcophagus",v(30,12,6),v(1.4,1.4,1.4));
    l.add("goal","goal",v(0,20.5,0),unit,{museumGoal:"pyramid"});
  }),
  4:stage(4,v(22,13.05,24),130,l=>{
    const points=gyrationRoute(),path=new CovadongaPath(points);
    l.decor("gyration","path",zero,unit,{hasCollision:true,points,width:5});
    l.museum("partenon","parthenon",v(-15,10,0),v(1.1,1.1,1.1));
    l.museum("atenea","statue",v(10,9,-35),v(2,2,2));
    l.coins(Array.from({length:24},(_,i)=>path.at(5+(path.length-10)*i/23).position.add(new Vector3(0,.7,0))));
    const end=path.at(path.length).position;l.block("llegada",v(end.x,11.65,end.z),v(7,.8,7),"#d8d3c4");l.goal(v(end.x,12.1,end.z));
  }),
  5:stage(5,v(0,13.05,10),140,l=>{
    const points=Array.from({length:101},(_,i)=>v(Math.sin(i/100*Math.PI*3)*5,12,10-i*1.5));
    l.decor("pasarela-coleccion","path",zero,unit,{points,width:3.2,hasCollision:true});
    l.museum("estanque-galeria","reflecting_pool",v(0,6,-65),v(1,1,1));
    const types=["amphora","sarcophagus","obelisk","column","fossil","statue","roman_arch","parthenon","bookshelf","display_case"];
    types.forEach((type,i)=>{const p=points[5+i*10],side=i%2 ? 1:-1;
      l.block(`balsa-${i}`,v(p.x+side*5,11.75,p.z),v(6,.6,7),"#9a7954");
      l.decor(`puente-${i}`,"path",zero,unit,{points:[v(p.x,12.1,p.z),v(p.x+side*5,12.1,p.z)],width:1.9,hasCollision:true});
      l.museum(`objeto-${i}`,type,v(p.x+side*5,12.05,p.z),v(.65,.65,.65),{hasCollision:true});
      l.coins([v(p.x+side*3.5,12.8,p.z-1.5),v(p.x,12.7,p.z)]);
    });
    const p=points.at(-1)!;l.block("llegada",v(p.x,11.65,p.z),v(6,.8,8));l.goal(v(p.x,12.1,p.z));
  }),
  6:stage(6,v(0,13.05,24),130,l=>{
    l.block("salida",v(0,11.65,21),v(30,.8,22),"#d1c3a8");l.block("llegada",v(0,11.65,-137),v(30,.8,22),"#d1c3a8");
    for(let lane=0;lane<4;lane++) {
      const points=romanRail(lane);l.decor(`rail-${lane}`,"path",zero,unit,{points,width:[3.5,2.2,1.25,.65][lane],hasCollision:true});
      l.coins(points.filter((_,i)=>i>10&&i<175&&i%18===0).map(p=>v(p.x,p.y+.7,p.z)));
    }
    for(const side of [-1,1]) for(let i=0;i<5;i++) l.museum(`arco-${side}-${i}`,"roman_arch",v(side*23,5,-15-i*25),v(1.5,1.8,1.5));
    l.goal(v(0,12.1,-143));
  }),
  7:stage(7,v(0,19.05,10),100,l=>{
    l.block("entrada",v(0,17.65,7),v(7,.8,18),"#b6c7ba");
    l.museum("basin","basin",v(0,0,-20),unit,{hasCollision:true});
    for(let i=0;i<15;i++) {const a=i*Math.PI*2/15,r=i%2 ? 11:15,x=Math.cos(a)*r,z=Math.sin(a)*r;l.coins([v(x,basinHeight(x,z)+.7,z-20)]);}
    l.museum("taza-cafe","coffee",v(24,6,-20),v(4,4,4));l.decor("regalo","gift",v(3,18.1,8),v(.7,.7,.7));
    l.goal(v(0,basinHeight(0,-12)+.1,-32));
  }),
  8:stage(8,v(0,13.05,10),260,l=>{
    for(let row=0;row<8;row++) {
      const z=-20*row,correct=paintingAnswer(row);
      l.block(`sala-${row}`,v(0,11.6,z+8),v(18,.8,14),"#c4b89f");
      l.block(`paso-oculto-${row}`,v((correct-1)*5,11.54,z-3),v(4,.8,6),"#c4b89f",{museumHiddenFloor:true});
      l.museum(`cuadros-${row}`,"painting_wall",v(0,12,z),unit,{hasCollision:true,museumAction:"painting",row,correct});
      l.coins([v(0,12.7,z+7)]);
    }
    l.block("sala-final",v(0,11.6,-153),v(18,.8,18),"#c4b89f");l.goal(v(0,12.1,-157));
  },{museumMode:"paintings"}),
  9:stage(9,v(-6,13.1,29),210,l=>{
    l.block("galeria",v(0,11.6,-45),v(8,.8,120),"#c4c9c4");l.block("entrada",v(0,11.65,25),v(20,.8,20),"#c4c9c4");
    for(let i=0;i<4;i++) {
      const side=i%2===0 ? -1:1,z=i<2 ? -15:-65,x=side*26;
      l.decor(`rampa-${i}`,"path",zero,unit,{points:[v(side*3,12.05,z),v(side*19,18,z)],width:4,hasCollision:true});
      l.museum(`gema-${i}`,"gem_disk",v(x,18.04,z),unit,{hasCollision:true,museumAction:"gem",gemIndex:i,gapAngle:gemGapAngle(i)});
    }
    l.museum("cristal-meta","goal_glass",v(0,12.05,26),unit,{hasCollision:true,museumAction:"glass"});
    l.coins([v(0,12.7,6),v(0,12.7,-35),v(0,12.7,-95)]);l.goal(v(0,12.15,26));
  },{museumMode:"gems"}),
  10:stage(10,v(0,1.05,12),180,l=>{
    l.block("suelo-museo",v(0,-.5,12-MUSEUM_CHASE_LENGTH/2),v(29,1,MUSEUM_CHASE_LENGTH+32),"#bbb3a6");
    l.museum("hintze-hall","chase_hall",zero,unit,{hasCollision:true,length:MUSEUM_CHASE_LENGTH});
    l.museum("trex-santa","animal",v(0,0,50),v(1.7,1.7,1.7),{museumAction:"rex",species:"trex",santa:true});
    for(let i=0;i<20;i++) l.museum(`animal-${i}`,"animal",v(i%2 ? -3:3,0,-105-i*83),unit,{museumAction:"animal",hasCollision:true,species:MUSEUM_ANIMALS[i%10],amplitude:5.5,frequency:.3+(i%4)*.09,phase:i*1.37});
    l.coins(Array.from({length:55},(_,i)=>v(i%2 ? 2:-2,.75,-30-i*(MUSEUM_CHASE_LENGTH-70)/54)));
    l.goal(v(0,.1,12-MUSEUM_CHASE_LENGTH));
  },{museumMode:"chase",noFall:true})
};

registerStageSet(6,2,WORLD_06_LEVEL_02_STAGES);

