import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {ProgressionManager} from '../src/progression/ProgressionManager';
import {getCollectibleBudget} from '../src/levels/CollectibleBalance';
import {UIManager} from '../src/ui/UIManager';
import {GameState} from '../src/game/GameState';
import {SpriteTextures} from '../src/rendering/SpriteTextures';
beforeEach(()=>{const memory=new Map<string,string>();vi.stubGlobal('localStorage',{getItem:(key:string)=>memory.get(key)??null,setItem:(key:string,value:string)=>memory.set(key,value)});});
afterEach(()=>{vi.unstubAllGlobals();vi.restoreAllMocks();});
function earn(progress:ProgressionManager,world:number,count:number){
 for(let l=1;l<=4;l++)for(let s=1;s<=10&&count>0;s++){const n=Math.min(count,getCollectibleBudget(world,l,s)??10);progress.completeStage(world,l,s,10,n);count-=n;}
}
function render(progress:ProgressionManager){
 const state=new GameState();state.selectedWorld=1;state.selectedLevel=4;state.levelRunTime=70;
 const slots:{dataset:{rewardCharacter:string;rewardSkin:string};appendChild:ReturnType<typeof vi.fn>}[]=[];
 const root={innerHTML:'',querySelector:(selector:string)=>selector==='#confetti-canvas'?null:{addEventListener:vi.fn()},querySelectorAll:()=>{
  slots.splice(0,slots.length,...[...root.innerHTML.matchAll(/data-reward-character="([^"]+)" data-reward-skin="([^"]+)"/g)].map(m=>({dataset:{rewardCharacter:m[1],rewardSkin:m[2]},appendChild:vi.fn()})));return slots;
 }};
 const ui=Object.create(UIManager.prototype) as any;Object.assign(ui,{root,state,progression:progress,confettiAnimationId:null});ui.renderLevelClearScreen();return {html:root.innerHTML,slots};
}
describe('New-skin announcement on level completion',()=>{
 it('waits until eighty percent, keeps a pending reward through reloads, and acknowledges it only once',()=>{
  const progress=new ProgressionManager();earn(progress,1,319);expect(progress.getUnannouncedSkinRewards(1)).toEqual([]);
  progress.recordCollectedItem(1,4,10,'threshold');expect(progress.getUnannouncedSkinRewards(1)).toEqual([{characterId:'rony',skinId:'blue'}]);
  const reload=new ProgressionManager();expect(reload.getUnannouncedSkinRewards(1)).toHaveLength(1);expect(reload.getUnannouncedSkinRewards(2)).toEqual([]);
  reload.markSkinRewardsAnnounced([{characterId:'rony',skinId:'blue'}]);expect(new ProgressionManager().getUnannouncedSkinRewards(1)).toEqual([]);
 });
 it('renders the original completion screen plus the golden card and the correct skin portrait',()=>{
  const avatar=vi.spyOn(SpriteTextures,'getCharacterAvatarCanvas').mockReturnValue({} as HTMLCanvasElement),progress=new ProgressionManager();earn(progress,1,320);
  const result=render(progress);expect(result.html).toContain('¡NIVEL COMPLETADO!');expect(result.html).toContain('skin-reward-card');expect(result.html).toContain('¡Nueva skin desbloqueada!');expect(result.html).toContain('Rony · Blue');
  expect(avatar).toHaveBeenCalledWith('rony',160,'blue');expect(result.slots[0].appendChild).toHaveBeenCalledOnce();expect(progress.getUnannouncedSkinRewards(1)).toEqual([]);
  expect(render(progress).html).not.toContain('skin-reward-card');
 });
 it('does not announce a locked skin and permits a fresh celebration after resetting progress',()=>{
  vi.spyOn(SpriteTextures,'getCharacterAvatarCanvas').mockReturnValue({} as HTMLCanvasElement);
  const progress=new ProgressionManager();progress.markSkinRewardsAnnounced([{characterId:'rony',skinId:'blue'}]);expect(render(progress).html).not.toContain('skin-reward-card');
  earn(progress,1,320);render(progress);progress.resetToDefaultProgression();earn(progress,1,320);expect(progress.getUnannouncedSkinRewards(1)).toHaveLength(1);
 });
});
