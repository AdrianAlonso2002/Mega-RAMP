import {afterEach,describe,expect,it,vi} from 'vitest';
import {getRegisteredStage,loadWorldStages} from '../src/levels/StageRegistry';
import {LevelLoader} from '../src/levels/LevelLoader';
import {applyRequestedStageUpdates} from '../src/levels/RequestedStageUpdates';
import {getCollectibleBudget} from '../src/levels/CollectibleBalance';
import {applyCollectibleCorrections,COLLECTIBLE_AUDIT_REVISION} from '../src/levels/CollectibleCorrections';
import corrections from '../src/levels/CollectibleCorrections.json';
import table from '../reports/coleccionables-mundos-1-8.json';
import type {LevelData} from '../src/levels/LevelTypes';
afterEach(()=>vi.unstubAllGlobals());
const coins=(d:LevelData)=>d.objects.filter(o=>o.type==='collectible');
describe('100 collectibles in every complete level, all eight worlds',()=>{
 it('agrees across all 320 stages, saved designs, metadata, editor, HUD and corrected table',async()=>{
  const loader=new LevelLoader();let grandTotal=0;
  for(let w=1;w<=8;w++)for(let l=1;l<=4;l++){
   let total=0;
   for(let e=1;e<=10;e++){
    const data=await loader.loadStage(w,l,e),count=coins(data).length,published=getRegisteredStage(w,l,e)!,editor=applyRequestedStageUpdates(structuredClone(published),w,l,e);
    expect(count,`M${w}-N${l}-E${e}`).toBe(getCollectibleBudget(w,l,e));
    expect(count).toBe(table.find(r=>r.world===w&&r.level===l)!.counts[e-1]);
    expect(coins(editor)).toEqual(coins(data));expect(LevelLoader.getStageCollectiblesCount(w,l,e)).toBe(count);
    expect(new Set(data.objects.map(o=>o.id)).size).toBe(data.objects.length);
    if(e===5)expect(count).toBeGreaterThanOrEqual(20);
    total+=count;
   }
   expect(total,`M${w}-N${l}`).toBe(100);expect(LevelLoader.getLevelMaxCollectibles(w,l)).toBe(100);grandTotal+=total;
  }
  expect(grandTotal).toBe(3200);
 });
 it('migrates every corrected old browser design once, preserving geometry, settings and edited retained prizes',async()=>{
  const loader=new LevelLoader();
  for(const [key,plan] of Object.entries(corrections)){
   const [w,l,e]=key.split('_').map(Number),data=await loader.loadStage(w,l,e);delete data.properties!.collectibleAuditRevision;
   data.customSaved=true;data.properties!.customUserSetting='keep';
   data.objects=data.objects.filter(o=>!plan.add.some(c=>c.id===o.id));
   const retained=coins(data)[0];if(retained)retained.position.x+=.2;
   const geometry=JSON.stringify(data.objects.filter(o=>o.type!=='collectible')),position=retained?{...retained.position}:undefined;
   applyRequestedStageUpdates(data,w,l,e);
   expect(data.properties!.collectibleAuditRevision).toBe(COLLECTIBLE_AUDIT_REVISION);
   expect(JSON.stringify(data.objects.filter(o=>o.type!=='collectible'))).toBe(geometry);
   expect(data.properties!.customUserSetting).toBe('keep');if(retained)expect(coins(data).find(o=>o.id===retained.id)!.position).toEqual(position);
   expect(coins(data)).toHaveLength(getCollectibleBudget(w,l,e)!);
   const after=JSON.stringify(data);applyCollectibleCorrections(data);expect(JSON.stringify(data)).toBe(after);
  }
 });
 it('restores missing old anchors by copying published prizes, and keeps later editor changes',async()=>{
  const loader=new LevelLoader(),published=await loader.loadStage(4,3,3),data=structuredClone(published);delete data.properties!.collectibleAuditRevision;
  data.objects=data.objects.filter(o=>o.type!=='collectible');applyCollectibleCorrections(data,published);
  expect(coins(data)).toHaveLength(10);coins(data)[0].position.x+=20;expect(coins(published)[0].position.x).not.toBe(coins(data)[0].position.x);
  const after=JSON.stringify(data);applyCollectibleCorrections(data);expect(JSON.stringify(data)).toBe(after);
 });
 it('preserves train, bus and pyramid movement metadata',async()=>{
  await loadWorldStages(1);await loadWorldStages(6);
  const train=coins(getRegisteredStage(6,1,3)!);expect(train).toHaveLength(9);expect(train.every(o=>typeof o.properties?.londonTrain==='string')).toBe(true);
  expect(coins(getRegisteredStage(6,2,3)!).map(o=>o.properties?.museumTier)).toEqual([0,1,2,3,4,5,6,7]);
  const bus=coins(getRegisteredStage(1,2,1)!).filter(o=>o.properties?.axis==='z');expect(bus).toHaveLength(4);expect(bus.every(o=>o.properties?.speed===6&&o.properties?.startDelay===2)).toBe(true);
 });
});
