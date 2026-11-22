import {afterEach,describe,expect,it,vi} from 'vitest';
import {BAKED_STAGES,getBakedStage} from '../src/levels/BakedStages';
import {LevelLoader} from '../src/levels/LevelLoader';
import {applyRequestedStageUpdates} from '../src/levels/RequestedStageUpdates';
import {applyCollectibleBalance,getCollectibleBudget,COLLECTIBLE_BALANCE_REVISION} from '../src/levels/CollectibleBalance';
import type {LevelData} from '../src/levels/LevelTypes';

afterEach(()=>vi.unstubAllGlobals());
function storage(){const values=new Map<string,string>();vi.stubGlobal('localStorage',{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value)});return values;}
const prizes=(data:LevelData)=>data.objects.filter(o=>o.type==='collectible');
describe('100 collectibles in each completed world 1–6 level',()=>{
 it('loads all 240 stages with the agreed budgets and the same editor and HUD counts',async()=>{
  storage();const loader=new LevelLoader();let grandTotal=0;
  for(let w=1;w<=6;w++)for(let l=1;l<=4;l++){
   let total=0;
   for(let s=1;s<=10;s++){
    const loaded=await loader.loadStage(w,l,s),editor=applyRequestedStageUpdates(structuredClone(getBakedStage(w,l,s)!),w,l,s),coins=prizes(loaded);
    expect(coins.length,`M${w}-N${l}-E${s}`).toBe(getCollectibleBudget(w,l,s));
    expect(prizes(editor)).toEqual(coins);expect(LevelLoader.getStageCollectiblesCount(w,l,s)).toBe(coins.length);
    expect(new Set(loaded.objects.map(o=>o.id)).size).toBe(loaded.objects.length);
    if(s===5)expect(coins.length).toBeGreaterThanOrEqual(20);
    for(const coin of coins)for(const n of Object.values(coin.position))expect(Number.isFinite(n)).toBe(true);
    total+=coins.length;
   }
   expect(total,`M${w}-N${l}`).toBe(100);expect(LevelLoader.getLevelMaxCollectibles(w,l)).toBe(100);grandTotal+=total;
  }
  expect(grandTotal).toBe(2400);
 });
 it('updates old browser saves without modifying any non-collectible object or custom settings',async()=>{
  const values=storage(),loader=new LevelLoader();
  for(const original of Object.values(BAKED_STAGES)){
   const data=applyRequestedStageUpdates(structuredClone(original),original.world,original.level,original.stage);delete data.properties!.collectibleBalanceRevision;
   data.customSaved=true;data.properties!.customUserSetting='keep';data.objects=data.objects.filter(o=>o.type!=='collectible');
   const nonCoins=JSON.parse(JSON.stringify(data.objects)),key=`custom_stage_${data.world}_${data.level}_${data.stage}`;
   values.set(key,JSON.stringify(data));const loaded=await loader.loadStage(data.world,data.level,data.stage);
   expect(loaded.objects.filter(o=>o.type!=='collectible'),key).toEqual(nonCoins);
   expect(loaded.properties!.customUserSetting).toBe('keep');expect(prizes(loaded)).toHaveLength(getCollectibleBudget(data.world,data.level,data.stage)!);
   expect(LevelLoader.getStageCollectiblesCount(data.world,data.level,data.stage)).toBe(prizes(loaded).length);
  }
 });
 it('is idempotent, leaves future worlds alone and preserves edited prize positions after migration',()=>{
  const data=structuredClone(getBakedStage(1,1,1)!);prizes(data)[0].position.x=50;
  const before=JSON.stringify(data);expect(applyCollectibleBalance(data)).toBe(data);expect(JSON.stringify(data)).toBe(before);
  const future={...structuredClone(data),world:8};delete future.properties!.collectibleBalanceRevision;
  expect(applyCollectibleBalance(future)).toEqual(future);
  const old=structuredClone(data);delete old.properties!.collectibleBalanceRevision;
  applyCollectibleBalance(old);expect(old.properties!.collectibleBalanceRevision).toBe(COLLECTIBLE_BALANCE_REVISION);
 });
 it('keeps three train prizes in each train and the eight individually animated pyramid tiers',()=>{
  const trains=prizes(getBakedStage(6,1,3)!);expect(trains).toHaveLength(9);expect(trains.every(o=>typeof o.properties?.londonTrain==='string')).toBe(true);
  const pyramid=prizes(getBakedStage(6,2,3)!);expect(pyramid.map(o=>o.properties?.museumTier)).toEqual([0,1,2,3,4,5,6,7]);
  const movingBus=prizes(getBakedStage(1,2,1)!).filter(o=>o.properties?.axis==='z');expect(movingBus).toHaveLength(4);expect(movingBus.every(o=>o.properties?.speed===6&&o.properties?.startDelay===2)).toBe(true);
 });
 it('rewards the three noodle paths with 4/5/7, and includes every mine junction and the last fountain basin',()=>{
  const noodles=prizes(getBakedStage(5,1,8)!);expect(noodles.filter(o=>o.position.x>-6&&o.position.x<6)).toHaveLength(4);expect(noodles.filter(o=>o.position.x<=-6)).toHaveLength(5);expect(noodles.filter(o=>o.position.x>=6)).toHaveLength(7);
  const mine=prizes(getBakedStage(5,4,6)!);for(let i=0;i<12;i++)expect(mine.some(o=>o.id===`w5s46-col-${i*4+2}`)).toBe(true);
  expect(prizes(getBakedStage(5,4,8)!).some(o=>o.position.y<5)).toBe(true);
 });
});
