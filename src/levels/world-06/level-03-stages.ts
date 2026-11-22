import {registerStageSet} from '../StageRegistry';
import type {LevelData,Vector3Data} from "../LevelTypes";
import {LondonLayout,v} from "./LondonLayout";
import {WORLD_04_LEVEL_03_STAGES} from "../world-04/level-03-stages";
import {OXFORD_REVISION,OXFORD_TRAIN_LENGTH,universityRoute,trailHeight} from "./OxfordRoutes";
class OxfordLayout extends LondonLayout {
  constructor(n:number) {super(n,3);}
  ox(name:string,kind:string,p:Vector3Data,scale=v(1,1,1),props:Record<string,unknown>={},yaw=0) {
    this.add(name,"decoration",p,scale,{subType:`oxford_${kind}`,hasCollision:false,...props},v(0,yaw,0));
  }
  path(name:string,points:Vector3Data[],width:number) {this.decor(name,"path",v(0,0,0),v(1,1,1),{hasCollision:true,points,width});}
}
const names=['Missed Train','BuzzBallz','Correr6','Bici3','Objetos23','Souvenir Shop','The Bear Inn 1242','Moo-Moos','University','The Great Hall'];
function stage(n:number,spawn:Vector3Data,time:number,build:(l:OxfordLayout)=>void,props:Record<string,unknown>={}):LevelData {
  const l=new OxfordLayout(n);build(l);
  if(![1,7,10].includes(n)) {
    l.ox('paisaje','campus',v(0,-23,-50),v(1,1,1),{variant:n});
    l.decor('navidad','christmas_tree',v(-18,-22,-30),v(2.2,2.2,2.2));
  }
  return {id:`world-06-level-03-stage-${String(n).padStart(2,'0')}`,world:6,level:3,stage:n,name:names[n-1],theme:'winter',musicTrack:n===1||n===3 ? 'arcade_rush':'sky_waltz',spawn,timeLimit:time,properties:{oxfordRevision:OXFORD_REVISION,...props},objects:l.objects};
}
export const WORLD_06_LEVEL_03_STAGES:Record<number,LevelData>={
  1:stage(1,v(0,1.05,12),100,l=>{
    l.block('balasto',v(0,-.5,-465),v(18,1,990),'#777b7e');
    l.ox('vias','railway',v(0,0,0),v(1,1,1),{length:OXFORD_TRAIN_LENGTH});
    l.ox('salida','station',v(0,0,10));l.ox('oxford','station',v(0,0,-940),v(1,1,1),{destination:true});
    for(const z of [14,-930]) l.decor(`navidad-estacion-${z}`,'garland',v(-14,3.3,z),v(1.4,1,1));
    l.ox('tren-perdido','train',v(0,0,-70),v(1,1,1),{oxfordAction:'destination',hasCollision:true});
    for(let i=0;i<8;i++) {
      const wave=Math.floor(i/2),safe=[-1,0,1,-1][wave],lane=[-1,0,1].filter(l=>l!==safe)[i%2],z=-180-wave*220;
      l.ox(`tren-${i}`,'train',v(lane*5.5,0,z),v(.85,.85,.85),{oxfordAction:'traffic',hasCollision:true,index:i,trafficSpeed:12+wave%2*2});
      if(i%2===0) {
        const rampLane=wave%2 ? -5.5:5.5;
        l.path(`rampa-${wave}`,[v(rampLane,0,z+32),v(rampLane,4.4,z+14),v(rampLane,4.4,z-12),v(rampLane,0,z-30)],3.7);
        l.coins([v(rampLane,5.1,z),v(safe*5.5,.8,z-36)]);
      }
    }
    l.path('subir-tren',[v(0,0,-908),v(0,1.2,-924)],3.8);
    l.coins([v(0,1.9,-931),v(0,1.9,-942),v(0,1.9,-951)]);
    l.goal(v(0,1.3,-946));
  },{oxfordMode:'train'}),
  2:stage(2,v(0,14.05,35),150,l=>{
    l.block('salida',v(0,12.6,32),v(9,.8,12),'#d2c5a5');
    for(let i=0;i<3;i++) l.ox(`buzz-${i}`,'buzz',v(0,7,0),v(1,1,1),{index:i,hasCollision:true,oxfordAction:'buzz'});
    l.block('llegada',v(0,-13.4,-31),v(12,.8,24),'#d2c5a5');l.goal(v(0,-12.9,-37));
    l.coins([v(0,13.7,0),v(0,13.8,20),v(0,7.8,-24)]);
  }),
  3:stage(3,v(0,13.05,22),90,l=>{
    const p=Array.from({length:201},(_,i)=>v(Math.sin(i/200*Math.PI*4)*10,12+Math.sin(i/200*Math.PI*3)*2,22-i*2.3));
    l.path('correr-oxford',p,4.4);
    for(let i=0;i<10;i++) {const q=p[10+i*18];l.ox(`arco-${i}`,'bridge',v(q.x,q.y,q.z),v(.55,.55,.55));l.coins([v(q.x,q.y+.7,q.z)]);}
    const end=p.at(-1)!;l.goal(v(end.x,end.y+.1,end.z+2));
  }),
  4:stage(4,v(0,13.05,40),130,l=>{
    const original=structuredClone(WORLD_04_LEVEL_03_STAGES[1]);
    for(const obj of original.objects) {
      obj.id=obj.id.replace('w4s31-','w6s34-');obj.properties={...obj.properties};
      if(obj.properties.theme==='carabanchel'||obj.properties.customColor==='#d32f2f') {obj.properties.theme='custom_color';obj.properties.customColor='#315d58';}
      l.objects.push(obj);
    }
    l.ox('bici-detallada','bicycle',v(32,-22,-45),v(2.8,2.8,2.8));
    for(const x of [-6,6]) {
      l.ox(`cesta-${x}`,'basket',v(x,11.5,14),v(1,1,1),{hasCollision:true});
      l.path(`acceso-cesta-${x}`,[v(0,12.15,14),v(x,12.15,14)],1.6);
      l.coins([v(x,12.85,14)]);l.decor(`regalo-${x}`,'gift',v(x,12.2,15.3),v(.65,.65,.65));
    }
    l.decor('guirnalda','garland',v(0,13,-4),v(1.5,1,1));
  }),
  5:stage(5,v(0,13.05,20),130,l=>{
    l.block('patio',v(0,11.6,-8),v(43,.8,68),'#bcac8e');
    const types=['radcliffe','college','bicycle','shop','bridge','ties'];
    types.forEach((type,i)=>{const x=i%2 ? 12:-12,z=8-Math.floor(i/2)*20;l.ox(`objeto-${i}`,type,v(x,12,z),v(.55,.55,.55),{hasCollision:true});});
    l.coins(Array.from({length:9},(_,i)=>v((i%3-1)*2.5,12.7,-8+(Math.floor(i/3)-1)*2.5)));
    l.goal(v(0,12.1,-36));
  }),
  6:stage(6,v(0,13.05,14),150,l=>{
    l.block('mostrador',v(0,11.6,-33),v(2.75,.8,103),'#b78f66');
    for(let i=0;i<12;i++) {const z=4-i*7.1;l.ox(`iman-${i}`,'magnet',v(0,18,z),v(1,1,1),{oxfordAction:'magnet',index:i,hasCollision:true});l.coins([v(i%2 ? -1.2:1.2,12.7,z-3)]);}
    for(const x of [-11,11]) l.ox(`tienda-${x}`,'shop',v(x,3,-30),v(1.6,1.6,1.6),{},x>0 ? -Math.PI/2:Math.PI/2);
    l.goal(v(0,12.1,-80));
  }),
  7:stage(7,v(0,13.05,22),180,l=>{
    l.block('entrada',v(0,11.6,20),v(9,.8,12),'#694c35');
    l.ox('taberna','pub',v(0,12,-35));
    for(const side of [-1,1]) {
      l.ox(`corbatas-${side}`,'ties',v(side*13.25,15,-35),v(1.3,1.3,1.3),{},-side*Math.PI/2);
      l.decor(`guirnalda-${side}`,'garland',v(side*11.5,22,-15),v(1.5,1.5,1.5),{},-side*Math.PI/2);
    }
    for(let i=0;i<5;i++) {
      l.ox(`mesa-${i}`,'table',v(0,12,8-i*17),v(1,1,1),{oxfordAction:'table',index:i,hasCollision:true});
      l.block(`posavasos-${i}`,v(0,11.6,-.5-i*17),v(5,.8,2),'#a28654');
      l.ox(`oso-${i}`,'bear',v(i%2 ? -6.4:6.4,12,5-i*17),v(1,1,1),{oxfordAction:'bear',index:i},i%2 ? -Math.PI/2:Math.PI/2);
      l.coins([v(i%2 ? -2.6:2.6,13,8-i*17)]);
    }
    l.block('salida',v(0,11.6,-79),v(9,.8,15),'#694c35');l.goal(v(0,12.1,-83));
  }),
  8:stage(8,v(0,13.05,23),150,l=>{
    l.block('entrada',v(0,11.6,23),v(7,.8,12),'#e0c0ca');
    l.ox('vaso','cup',v(0,12,0));
    for(let i=0;i<4;i++) l.ox(`franja-${i}`,'milk_ring',v(0,12,0),v(1,1,1),{index:i,oxfordAction:'ring',hasCollision:true});
    l.ox('pajita','straw',v(0,12,0),v(1,1,1),{oxfordAction:'straw'});
    l.add('goal','goal',v(0,31,0),v(1,1,1),{oxfordGoal:'sky'});
    l.coins(Array.from({length:20},(_,i)=>{const a=i*Math.PI*2/20,r=6+(i%3)*4;return v(Math.cos(a)*r,12.8,Math.sin(a)*r);}));
  },{oxfordMode:'milkshake'}),
  9:stage(9,v(0,13.05,22),140,l=>{
    const points=universityRoute();l.path('undulating-road',points,3.2);
    l.objects.at(-1)!.properties!.widthEnd=.75;
    for(let i=0;i<10;i++) {const p=points[10+i*23];l.ox(`contrafuerte-${i}`,'pier',v(p.x,p.y-18,p.z),v(1,1,1));}
    l.coins(points.filter((_,i)=>i>0&&i%26===0).map(p=>v(p.x,p.y+.75,p.z)));
    const end=points.at(-1)!;l.goal(v(end.x,end.y+.1,end.z+1));
    l.ox('college','college',v(27,-5,-95),v(2,2,2),{},-Math.PI/2);
  }),
  10:stage(10,v(0,trailHeight(18)+1.05,18),180,l=>{
    l.ox('trail','trail',v(0,0,0),v(1,1,1),{hasCollision:true});
    l.ox('great-hall','hall',v(0,0,-70));
    for(let i=0;i<6;i++) {const z=-8-i*28,x=i%2 ? -2.8:2.8;l.coins([v(x,trailHeight(z,x)+.75,z)]);}
    l.coins([v(0,13,10),v(0,trailHeight(-161)+.8,-161)]);
    l.goal(v(0,trailHeight(-163)+.1,-163));
  })
};

registerStageSet(6,3,WORLD_06_LEVEL_03_STAGES);

