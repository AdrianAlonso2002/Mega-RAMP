import {getRegisteredStage,stageMetadata,setStageNormalizer} from './StageRegistry';
import type {LevelData,LevelObjectData,Vector3Data} from './LevelTypes';
import layouts from './CollectibleLayouts.json';

export const COLLECTIBLE_BALANCE_REVISION='worlds-1-6-hundred-v1';
interface Placement {id:string;p:Vector3Data;properties:Record<string,unknown>;anchor:string;offset:Vector3Data}
const plans:Record<string,Placement[]>=layouts;
/** Baked placements have no geometry sampling or randomness at game runtime. */
export function applyCollectibleBalance(data:LevelData,world=data.world,level=data.level,stage=data.stage):LevelData {
 if(data.properties?.editorPublished || data.customSaved || data.properties?.userSaved)return data;
 const official=getRegisteredStage(world,level,stage);
 const plan=plans[`${world}_${level}_${stage}`]??official?.objects.filter(o=>o.type==='collectible').map(o=>({id:o.id,p:o.position,properties:o.properties??{},anchor:o.id,offset:{x:0,y:0,z:0}}));
 if(!plan)return data;
 if(data.properties?.collectibleBalanceRevision===COLLECTIBLE_BALANCE_REVISION&&data.objects.filter(o=>o.type==='collectible').length===plan.length)return data;
 const existing=new Map(data.objects.filter(o=>o.type==='collectible').map(o=>[o.id,o]));
 const prizes:LevelObjectData[]=plan.map(item=>{
  const original=existing.get(item.id),anchor=existing.get(item.anchor);
  // Preserve the local offset of prizes anchored to a user's moved original prize.
  const position=anchor?{x:anchor.position.x+item.offset.x,y:anchor.position.y+item.offset.y,z:anchor.position.z+item.offset.z}:{...item.p};
  return {id:item.id,type:'collectible',position,rotation:original?{...original.rotation}:{x:0,y:0,z:0},scale:original?{...original.scale}:{x:1,y:1,z:1},properties:{...item.properties,...original?.properties}};
 });
 data.objects=[...data.objects.filter(o=>o.type!=='collectible'),...prizes];
 data.properties={...data.properties,collectibleBalanceRevision:COLLECTIBLE_BALANCE_REVISION};
 return data;
}

export function getCollectibleBudget(world:number,level:number,stage:number):number|undefined {
 return stageMetadata(world,level,stage)?.count;
}
setStageNormalizer(data=>{applyCollectibleBalance(data);});





