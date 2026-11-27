import type {LevelData,LevelObjectData} from './LevelTypes';
import layouts from './CollectibleCorrections.json';
export const COLLECTIBLE_AUDIT_REVISION=1;
type Correction={keep:string[];add:LevelObjectData[]};
const plans=layouts as unknown as Record<string,Correction>;
/** One-time migration: only collectible objects change; later editor edits remain intact. */
export function applyCollectibleCorrections(data:LevelData,publishedStage?:LevelData):LevelData {
  const plan=plans[`${data.world}_${data.level}_${data.stage}`];
  if(!plan||data.properties?.collectibleAuditRevision===COLLECTIBLE_AUDIT_REVISION)return data;
  const existing=new Map(data.objects.filter(o=>o.type==='collectible').map(o=>[o.id,o]));
  const published=publishedStage;
  const fallback=new Map(published?.objects.filter(o=>o.type==='collectible').map(o=>[o.id,o])??[]);
  const retained=plan.keep.map(id=>existing.get(id)??(fallback.has(id)?structuredClone(fallback.get(id)!):undefined));
  // A detached/imported custom stage may lack the published anchors: do not erase its prizes.
  if(retained.some(o=>!o))return data;
  const additions=plan.add.map(o=>existing.get(o.id)??structuredClone(o));
  data.objects=[...data.objects.filter(o=>o.type!=='collectible'),...retained as LevelObjectData[],...additions];
  data.properties={...data.properties,collectibleAuditRevision:COLLECTIBLE_AUDIT_REVISION};
  return data;
}
