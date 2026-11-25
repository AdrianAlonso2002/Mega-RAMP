import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {ProgressionManager} from '../src/progression/ProgressionManager';
import {getCollectibleBudget} from '../src/levels/CollectibleBalance';
import {getCharacterSkin,getCharacterSkins} from '../src/player/CharacterSkins';
beforeEach(()=>{const storage=new Map<string,string>();vi.stubGlobal('localStorage',{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,value)});});
afterEach(()=>vi.unstubAllGlobals());
const rewards=[['rony','blue',1],['rony','bebe',2],['misi','bebe',3],['adri','especial',4],['pao','especial',5],['pao','hp',6],['adri','ssj',7],['misi','negra',8]] as const;
function collectCount(progress:ProgressionManager,world:number,count:number){
 for(let level=1;level<=4;level++)for(let stage=1;stage<=10;stage++){
  const take=Math.min(count,getCollectibleBudget(world,level,stage)??10);if(take>0)progress.completeStage(world,level,stage,30,take);count-=take;
 }
}
describe('World skin rewards at eighty percent',()=>{
 it.each(rewards)('unlocks %s %s only at eighty percent in world %i', (character,skin,world)=>{
  const progress=new ProgressionManager();expect(getCharacterSkin(character,skin).unlock).toEqual({world,percent:80});
  expect(progress.isSkinUnlocked(character,skin)).toBe(false);progress.setSelectedSkin(character,skin);expect(progress.getSelectedSkin(character)).toBe('normal');
  const total=progress.getWorldCollectionProgress(world).total,threshold=Math.ceil(total*.8);
  collectCount(progress,world,threshold-1);expect(progress.getWorldCollectionProgress(world)).toEqual({collected:threshold-1,total});expect(progress.isSkinUnlocked(character,skin)).toBe(false);
  collectCount(progress,world,threshold);expect(progress.isSkinUnlocked(character,skin)).toBe(true);progress.setSelectedSkin(character,skin);
  const reload=new ProgressionManager();expect(reload.getSelectedSkin(character)).toBe(skin);
  for(const [otherChar,otherSkin,otherWorld] of rewards)if(otherWorld!==world)expect(reload.isSkinUnlocked(otherChar,otherSkin)).toBe(false);
 });
 it('keeps normal forms available and rejects invalid skin identifiers',()=>{
  const progress=new ProgressionManager();for(const id of ['adri','pao','misi','rony']){
   expect(progress.isSkinUnlocked(id,'normal')).toBe(true);expect(getCharacterSkins(id).filter(s=>progress.isSkinUnlocked(id,s.id))).toHaveLength(1);
  }
  expect(progress.isSkinUnlocked('rony','invalid')).toBe(false);
 });
 it('unions alternative-route pickups across retries and reloads without requiring a stage clear',()=>{
  const progress=new ProgressionManager();progress.recordCollectedItem(5,1,8,'left-path');progress.recordCollectedItem(5,1,8,'left-path');
  expect(progress.getStage(5,1,8)).toMatchObject({completed:false,collectibles:1,collectedIds:['left-path']});
  const reload=new ProgressionManager();reload.recordCollectedItem(5,1,8,'right-path');reload.completeStage(5,1,8,30,1);
  expect(reload.getStage(5,1,8)).toMatchObject({completed:true,collectibles:2,collectedIds:['left-path','right-path']});
  expect(reload.getWorldCollectionProgress(5).collected).toBe(2);
 });
 it('preserves legacy best counts, clamps obsolete excesses, and falls back from previously selected locked skins',()=>{
  localStorage.setItem('monkey-ball-progress-v1',JSON.stringify({selectedCharacter:'rony',characterSkins:{rony:'blue'},worlds:{1:{1:{1:{completed:true,bestTime:10,collectibles:999}}}}}));
  const progress=new ProgressionManager();expect(progress.getWorldCollectionProgress(1).collected).toBe(8);expect(progress.getSelectedSkin('rony')).toBe('normal');
  progress.recordCollectedItem(1,1,1,'first');expect(progress.getStage(1,1,1)?.collectibles).toBe(8);expect(progress.getStage(1,1,1)?.completed).toBe(true);
 });
 it('awards a skin on the threshold pickup itself, even before completing its stage',()=>{
  const progress=new ProgressionManager();collectCount(progress,1,319);
  expect(progress.isWorldCompleted(1)).toBe(false);expect(progress.isSkinUnlocked('rony','blue')).toBe(false);
  progress.recordCollectedItem(1,4,10,'final-route');
  expect(progress.getWorldCollectionProgress(1).collected).toBe(320);expect(progress.getStage(1,4,10)?.completed).toBe(false);
  expect(progress.isSkinUnlocked('rony','blue')).toBe(true);
 });
 it('clears pickup caches when progress is reset',()=>{
  const progress=new ProgressionManager();progress.recordCollectedItem(1,1,1,'first');progress.resetToDefaultProgression();progress.recordCollectedItem(1,1,1,'first');
  expect(progress.getWorldCollectionProgress(1).collected).toBe(1);
 });
});
