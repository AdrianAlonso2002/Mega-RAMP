import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {UIManager} from '../src/ui/UIManager';
import {SpriteTextures} from '../src/rendering/SpriteTextures';
import {loadUIImage} from '../src/ui/UIAssets';
vi.mock('../src/ui/UIAssets',()=>({loadUIImage:vi.fn(async()=>({})),revealUIBackdrop:vi.fn(async()=>{})}));
beforeEach(()=>{vi.useFakeTimers();vi.stubGlobal('requestAnimationFrame',(cb:FrameRequestCallback)=>setTimeout(()=>cb(0),16));vi.stubGlobal('document',{});});
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();vi.restoreAllMocks();});
describe('Menu visual readiness under clouds',()=>{
  it('waits for the backdrop, portrait repaint, image decoding and two rendered frames',async()=>{
    let portraitReady:()=>void=()=>{},backdropReady:()=>void=()=>{},decodeReady:()=>void=()=>{};
    vi.spyOn(SpriteTextures,'waitForUIPortraits').mockImplementation(()=>new Promise<void>(r=>{portraitReady=r;}));
    const image={complete:false,currentSrc:'/map.jpg',style:{visibility:''},decode:vi.fn(()=>new Promise<void>(r=>{decodeReady=r;}))};
    const ui=Object.create(UIManager.prototype) as any;
    Object.assign(ui,{root:{querySelectorAll:()=>[image]},screenReadiness:[new Promise<void>(r=>{backdropReady=r;})],state:{},destroyed:false});
    let done=false;const ready=ui.waitForScreenAssets('world-select',new AbortController().signal).then(()=>{done=true;});
    await vi.advanceTimersByTimeAsync(0);portraitReady();backdropReady();await vi.advanceTimersByTimeAsync(2000);expect(done).toBe(false);
    decodeReady();await vi.advanceTimersByTimeAsync(31);expect(done).toBe(false);await vi.advanceTimersByTimeAsync(1);await ready;expect(done).toBe(true);
    expect(loadUIImage).toHaveBeenCalledWith('/map.jpg');
  });
  it('waits for character animation assets and uses a complete fallback for a failed image',async()=>{
    vi.spyOn(SpriteTextures,'waitForUIPortraits').mockResolvedValue();let readySkin:()=>void=()=>{};
    const skin=vi.spyOn(SpriteTextures,'waitForCharacterSkin').mockImplementation(()=>new Promise<void>(r=>{readySkin=r;}));
    vi.mocked(loadUIImage).mockResolvedValueOnce(null);
    const image={complete:false,currentSrc:'/missing.jpg',style:{visibility:''}};
    const ui=Object.create(UIManager.prototype) as any;Object.assign(ui,{root:{querySelectorAll:()=>[image]},screenReadiness:[],state:{selectedCharacter:'misi',selectedSkin:'normal'},destroyed:false});
    let done=false;const pending=ui.waitForScreenAssets('character-select',new AbortController().signal).then(()=>{done=true;});
    await vi.advanceTimersByTimeAsync(2000);expect(done).toBe(false);expect(image.style.visibility).toBe('hidden');expect(skin).toHaveBeenCalledWith('misi','normal');
    readySkin();await vi.advanceTimersByTimeAsync(32);await pending;expect(done).toBe(true);
  });
});
