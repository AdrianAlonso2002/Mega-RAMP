import type {LevelData} from '../LevelTypes';
/** One-time Las Cruces polish; keep subsequent editor changes and prize counts. */
export function polishLasCruces(data:LevelData):LevelData {
 if(data.world!==4||data.level!==3)return data;
 if(data.stage===8&&data.properties?.crucesDescentRevision!==1){
  const steps=data.objects.filter(o=>o.properties?.variant==='republican_step');
  for(const step of steps){step.rotation.x=-Math.atan(.16/step.scale.z);step.properties={...step.properties,slopedDescent:true};}
  for(const coin of data.objects.filter(o=>o.type==='collectible')){
   if(!steps.length)break;
   const step=steps.reduce((a,b)=>Math.abs(a.position.z-coin.position.z)<Math.abs(b.position.z-coin.position.z)?a:b);
   if(step){const angle=step.rotation.x;coin.position.y=step.position.y+step.scale.y/Math.cos(angle)-Math.tan(angle)*(coin.position.z-step.position.z)+.85;}
  }
  data.properties={...data.properties,crucesDescentRevision:1};
 }
 if(data.stage===9&&data.properties?.crucesCircleGoalRevision!==1){
  for(const goal of data.objects.filter(o=>o.type==='goal'))goal.properties={...goal.properties,goalShape:'circle',goalSize:1.5};
  data.properties={...data.properties,crucesCircleGoalRevision:1};
 }
 return data;
}
