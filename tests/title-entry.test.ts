import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {UIManager} from '../src/ui/UIManager';
import {GameState} from '../src/game/GameState';
import {SpriteTextures} from '../src/rendering/SpriteTextures';
vi.mock('../src/ui/UIAssets',()=>({revealUIBackdrop:vi.fn(async()=>{})}));
beforeEach(()=>{
  vi.useFakeTimers();
  vi.stubGlobal('window',{matchMedia:()=>({matches:false})});
  vi.spyOn(SpriteTextures,'getCharacterAvatarCanvas').mockImplementation(()=>({style:{}} as HTMLCanvasElement));
});
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();vi.restoreAllMocks();});
function setup(){
  const state=new GameState(),audio={startMenuBGM:vi.fn(),stopMenuBGM:vi.fn(),playClick:vi.fn(),updateRoll:vi.fn()};
  const makeNode=()=>({inert:false,isConnected:true,style:{},innerHTML:'',focus:vi.fn(),appendChild:vi.fn(),addEventListener:vi.fn(),removeAttribute:vi.fn(),setAttribute:vi.fn(),classList:{remove:vi.fn()}});
  const screen=makeNode(),panel=makeNode(),entry=makeNode(),play=makeNode(),avatar=makeNode(),backdrop=makeNode();
  let writes=0,html='';
  const root={
    get innerHTML(){return html;},set innerHTML(value:string){html=value;writes++;panel.inert=value.includes('inert aria-hidden="true"');},
    querySelector:(selector:string)=>({'#btn-enter-menu':html.includes('id="btn-enter-menu"')?entry:null,'#btn-play-game':play,'.title-screen-refined':screen,'.title-menu-panel':panel,'#title-char-avatar':avatar,'.menu-landscape':backdrop}[selector]??null),
    querySelectorAll:()=>[],removeAttribute:vi.fn(),remove:vi.fn(),
  };
  const ui=Object.create(UIManager.prototype) as any;
  Object.assign(ui,{root,state,audio,titleEntered:false,progression:{getSelectedSkin:()=> 'normal',isSkinUnlocked:()=>true},overworldMap:null,characterPreview:null,charSelectOrigin:'title'});
  return {ui,state,audio,root,screen,panel,entry,play,writes:()=>writes};
}
describe('First website entry',()=>{
  it('opens with the large title and one Play gate, then keeps the orbit DOM through the menu reveal',()=>{
    const f=setup();f.ui.showScreen('title');
    expect(f.root.innerHTML).toContain('has-title-entry is-title-intro');expect(f.root.innerHTML).toContain('Rony Adri Misi Pao');
    expect(f.entry.focus).toHaveBeenCalledOnce();expect(f.panel.inert).toBe(true);expect(f.audio.startMenuBGM).not.toHaveBeenCalled();
    const renders=f.writes();const handler=f.entry.addEventListener.mock.calls.find(c=>c[0]==='click')![1];handler();
    expect(f.audio.startMenuBGM).toHaveBeenCalledOnce();expect(f.screen.classList.remove).toHaveBeenCalledWith('is-title-intro');expect(f.panel.inert).toBe(false);
    expect(f.writes()).toBe(renders); // No replacement of the animated portrait elements.
    handler();expect(f.audio.startMenuBGM).toHaveBeenCalledOnce();
    vi.advanceTimersByTime(800);expect(f.play.focus).toHaveBeenCalledOnce();
  });
  it('returns directly to the menu after leaving it and shows the gate again only in a fresh UI',()=>{
    const f=setup();f.ui.showScreen('title');f.ui.enterTitleMenu();
    f.ui.showScreen('gameplay');f.ui.showScreen('title');
    expect(f.root.innerHTML).not.toContain('id="btn-enter-menu"');expect(f.root.innerHTML).not.toContain('is-title-intro');expect(f.panel.inert).toBe(false);
    const fresh=setup();fresh.ui.showScreen('title');expect(fresh.root.innerHTML).toContain('id="btn-enter-menu"');
  });
  it('cancels deferred focus when navigating away and honours reduced motion',()=>{
    const f=setup();f.ui.showScreen('title');f.ui.enterTitleMenu();f.ui.showScreen('gameplay');vi.advanceTimersByTime(1000);expect(f.play.focus).not.toHaveBeenCalled();
    vi.stubGlobal('window',{matchMedia:()=>({matches:true})});
    const reduced=setup();reduced.ui.showScreen('title');reduced.ui.enterTitleMenu();vi.advanceTimersByTime(0);expect(reduced.play.focus).toHaveBeenCalledOnce();
  });
});
