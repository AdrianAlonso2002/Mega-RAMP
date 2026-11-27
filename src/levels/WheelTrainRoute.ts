import type {LevelData,LevelObjectData} from './LevelTypes';
export const WHEEL_TRAIN_REVISION=1;
/** Four fixed axles; equal forward tread speed keeps transfers predictable. */
export function rebuildWheelTrain(data:LevelData):LevelData {
  if(data.world!==4||data.level!==3||data.stage!==1||data.properties?.wheelTrainRevision===WHEEL_TRAIN_REVISION)return data;
  const objects:LevelObjectData[]=[],v=(x:number,y:number,z:number)=>({x,y,z});
  const add=(id:string,type:LevelObjectData['type'],x:number,y:number,z:number,sx:number,sy:number,sz:number,properties:Record<string,unknown>={})=>objects.push({id:`w4s31-${id}`,type,position:v(x,y,z),rotation:v(0,0,0),scale:v(sx,sy,sz),properties});
  const radii=[5.5,6.5,5.8,4.5],top=12;
  let z=28,previous=radii[0];
  for(let i=0;i<4;i++) {
    const radius=radii[i];
    if(i)z-=Math.sqrt((previous+radius+.18)**2-(previous-radius)**2);
    // Stagger the widths so adjacent raised rings never share a coplanar side face.
    const width=i%2===0?4.6:5.2;
    add(`wheel-${i+1}`,'moving-platform',0,top-radius,z,width,1,1,{variant:'bike_wheel_vertical',movementType:'bike_wheel_vertical',radius,continuousRoll:true,distance:0,speed:-2.2/radius});
    // Ordered prizes on the upper arc; alternate lanes, always inside the walls.
    for(let j=0;j<2;j++) {
      const angle=j===0?.38:-.38;
      add(`col-${i*2+j+1}`,'collectible',j===0?-.8:.8,top-radius+Math.cos(angle)*(radius+.95),z+Math.sin(angle)*(radius+.95),.42,.42,.42);
    }
    previous=radius;
  }
  const dock=(id:string,cz:number)=>{
    add(id,'platform',0,top-.4,cz,6,.8,6,{theme:'carabanchel'});
    for(const side of [-1,1])add(`${id}-wall-${side}`,'platform',side*2.9,top+.45,cz,.2,.9,6,{theme:'custom_color',customColor:'#e9a52c'});
  };
  dock('start-dock',32.5);dock('goal-dock',z-4.5);
  add('goal','goal',0,top+.1,z-5.2,1,1,1);
  return {...data,spawn:v(0,top+1.05,33.5),timeLimit:110,objects,properties:{...data.properties,wheelTrainRevision:WHEEL_TRAIN_REVISION,editorPublished:true}};
}
