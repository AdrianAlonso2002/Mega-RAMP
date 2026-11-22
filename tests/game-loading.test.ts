import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {Game} from '../src/game/Game';
import {GameState} from '../src/game/GameState';
import {SpriteTextures} from '../src/rendering/SpriteTextures';
vi.mock('../src/physics/PhysicsWorld',()=>({PhysicsWorld:class {}}));
vi.mock('../src/game/SceneManager',()=>({SceneManager:class {}}));
vi.mock('../src/editor/LevelEditor',()=>({LevelEditor:class {}}));
beforeEach(()=>{
  vi.useFakeTimers();
  vi.stubGlobal('requestAnimationFrame',(callback:FrameRequestCallback)=>setTimeout(()=>callback(0),0));
  vi.spyOn(SpriteTextures,'waitForCharacterSkin').mockResolvedValue();
});
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();vi.restoreAllMocks();});
function setup(){
  // Exercise actual Game entry methods without a GPU or a constructed UI.
  const game=Object.create(Game.prototype) as any,state=new GameState();
  state.selectedCharacter='pao';state.selectedSkin='hp';
  const ui={showLevelLoading:vi.fn(()=>{state.screen='loading';}),beginStageTransition:vi.fn(()=>{state.screen='loading';}),showScreen:vi.fn(screen=>{state.screen=screen;}),showLoadingError:vi.fn()};
  const scenes={scene:{},prepareLevel:vi.fn(async()=>{}),loadStage:vi.fn(async()=>{}),loadCustomLevel:vi.fn(),applyLevelEnvironment:vi.fn(async()=>{}),beginStageIntro:vi.fn()};
  Object.assign(game,{state,ui,scenes,physics:{waitForReady:vi.fn(async()=>{})},hud:{setVisible:vi.fn()},touchControls:{setVisible:vi.fn()},renderer:{render:vi.fn()},camera:{object:{}},editor:null});
  return {game,state,ui,scenes};
}
describe('Game entry is covered until ready',()=>{
  it('holds gameplay, HUD and intro until readiness and three seconds, and ignores duplicate starts',async()=>{
    const {game,state,ui,scenes}=setup();let ready:()=>void=()=>{};
    game.physics.waitForReady.mockImplementation(()=>new Promise<void>(resolve=>{ready=resolve;}));
    const pending=game.startStage(6,2,1);await game.startStage(6,3,1);
    expect(ui.showLevelLoading).toHaveBeenCalledTimes(1);expect(state.screen).toBe('loading');
    expect(game.hud.setVisible).toHaveBeenLastCalledWith(false);
    await vi.advanceTimersByTimeAsync(10);expect(scenes.loadStage).not.toHaveBeenCalled();
    ready();await vi.advanceTimersByTimeAsync(2989);
    expect(SpriteTextures.waitForCharacterSkin).toHaveBeenCalledWith('pao','hp');
    expect(scenes.loadStage).toHaveBeenCalledTimes(1);expect(scenes.beginStageIntro).not.toHaveBeenCalled();expect(state.elapsedTime).toBe(0);
    await vi.advanceTimersByTimeAsync(1);await pending;
    expect(state.screen).toBe('gameplay');expect(scenes.beginStageIntro).toHaveBeenCalledOnce();expect(game.hud.setVisible).toHaveBeenLastCalledWith(true);
  });
  it('never opens a pending scene after navigation cancels the entry',async()=>{
    const {game,state,scenes}=setup();
    const pending=game.startStage(1,1,1);game.cancelStageLoad();state.screen='title';await pending;
    await vi.advanceTimersByTimeAsync(3000);expect(state.screen).toBe('title');expect(scenes.loadStage).not.toHaveBeenCalled();expect(scenes.beginStageIntro).not.toHaveBeenCalled();
  });
  it('prepares all ten stages at level entry and swaps subsequent stages without a loading cover or three-second delay',async()=>{
    const {game,state,ui,scenes}=setup();
    const first=game.startStage(6,3,1);await vi.advanceTimersByTimeAsync(3000);await first;
    expect(scenes.prepareLevel).toHaveBeenCalledTimes(1);expect(scenes.prepareLevel.mock.calls[0].slice(0,2)).toEqual([6,3]);
    ui.showLevelLoading.mockClear();scenes.beginStageIntro.mockClear();state.screen='victory';
    const next=game.nextStage();expect(ui.showLevelLoading).not.toHaveBeenCalled();expect(ui.beginStageTransition).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(50);await next;
    expect(state.selectedStage).toBe(2);expect(state.screen).toBe('gameplay');expect(scenes.prepareLevel).toHaveBeenCalledTimes(1);expect(scenes.beginStageIntro).toHaveBeenCalledOnce();
  });
  it('shows the full three-second cover again when moving to a different level',async()=>{
    const {game,state,ui}=setup();state.selectedWorld=5;state.selectedLevel=2;state.selectedStage=10;
    const next=game.nextStage();expect(ui.showLevelLoading).toHaveBeenCalledWith(5,3,1);
    await vi.advanceTimersByTimeAsync(2999);expect(state.screen).toBe('loading');
    await vi.advanceTimersByTimeAsync(1);await next;expect(state.screen).toBe('gameplay');
  });
  it('uses the same complete loading flow for an editor playtest and preserves its custom data',async()=>{
    const {game,state,scenes}=setup(),data={world:5,level:4,stage:1,name:'User-saved stage'};
    const editor={destroy:vi.fn()};game.editor=editor;
    game.playtestCustomLevel(data);expect(state.screen).toBe('loading');expect(editor.destroy).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(3000);
    expect(scenes.loadCustomLevel).toHaveBeenCalledWith(data,{deferIntro:true});expect(scenes.loadStage).not.toHaveBeenCalled();
    expect(state.screen).toBe('gameplay');expect(scenes.beginStageIntro).toHaveBeenCalledOnce();
  });
});
