import type {LevelData,LevelObjectData,Vector3Data} from './LevelTypes';
export const BIKE_REVISION='reachable-transfers-v2';
export function bikeWheelPose(time:number,distance:number,speed:number,radius:number) {
  const dwell=1.8,travel=8/Math.max(.25,speed),period=2*(dwell+travel),t=((time%period)+period)%period;
  const progress=t<dwell ? 0:t<dwell+travel ? (1-Math.cos((t-dwell)/travel*Math.PI))/2:t<2*dwell+travel ? 1:(1+Math.cos((t-2*dwell-travel)/travel*Math.PI))/2;
  const offset=-distance*progress;
  return {offset,pitch:offset/radius};
}
/** A common, measured route: wheel → rear frame → either pedal → front frame → wheel. */
export function rebuildBikeCourse(data:LevelData):LevelData {
  const big=data.name!=='Bici',h=big ? 12:8,prefix=data.world===2 ? 'w2s6':data.world===4 ? 'w4s31':'w6s34';
  const objects:LevelObjectData[]=[],v=(x:number,y:number,z:number):Vector3Data=>({x,y,z});
  const add=(name:string,type:LevelObjectData['type'],position:Vector3Data,scale:Vector3Data,properties:Record<string,unknown>={})=>objects.push({id:`${prefix}-${name}`,type,position,rotation:v(0,0,0),scale,properties});
  const color=data.world===6 ? '#315d58':'#bc433e';
  const floor=(name:string,x:number,z:number,w:number,d:number,c=color,y=h)=>add(name,'platform',v(x,y-.4,z),v(w,.8,d),{theme:'custom_color',customColor:c});
  floor('start-dock',0,40,8,12,'#bcaa81');
  floor('chainstays',0,14,7,12);floor('saddle',0,13,4,3,'#3b302b',h+.15);
  floor('top-tube',0,-8,7,16);floor('handlebar-stem',0,-10,9,1.8,'#3c4951',h+.1);
  floor('goal-dock',0,-38,10,16,'#c5ab69');
  floor('crank-hub',0,1,3.6,3.6,'#49545b',h-5);
  for(const [name,z,r] of [['rear-vertical-wheel',32,big ? 5.5:3.5],['front-vertical-wheel',-18,big ? 6:4]] as const) {
    add(name,'moving-platform',v(0,h-r,z),v(big ? 3.4:3,.5,3),{variant:'bike_wheel_vertical',movementType:'bike_wheel_vertical',radius:r,distance:12,speed:big ? 1:.65});
  }
  for(const side of [-1,1]) add(side<0 ? 'pedal-left':'pedal-right','moving-platform',v(side*2.3,h-2,1),v(3.5,.45,3.8),{variant:'bike_pedal',movementType:'bike_pedal',radius:6,speed:.6,phase:side<0 ? Math.PI:0});
  for(const [i,p] of [v(0,h+.75,35),v(0,h+.75,26),v(0,h+.9,15),v(-2.3,h+.8,7),v(2.3,h+.8,7),v(0,h+.75,-6),v(0,h+.75,-14),v(0,h+.75,-23),v(0,h+.75,-33),v(0,h+.75,-41)].entries()) add(`col-${i+1}`,'collectible',p,v(.42,.42,.42));
  add('goal','goal',v(0,h+.1,-41),v(1,1,1));
  const extras=data.objects.filter(o=>o.id.startsWith('obj-custom'));
  return {...data,spawn:v(0,h+1.05,40),timeLimit:Math.max(110,data.timeLimit??0),properties:{...data.properties,bikeRevision:BIKE_REVISION},objects:[...objects,...extras]};
}
