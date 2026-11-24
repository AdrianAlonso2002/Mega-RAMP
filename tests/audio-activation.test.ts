import {afterEach,describe,expect,it,vi} from 'vitest';

afterEach(()=>{vi.unstubAllGlobals();vi.restoreAllMocks();});
async function setup(suspended=false) {
  vi.resetModules();
  const handlers=new Map<string,(event:{isTrusted:boolean})=>void>(),add=vi.fn((name:string,handler:(event:{isTrusted:boolean})=>void)=>handlers.set(name,handler));
  const gain=()=>({gain:{setValueAtTime:vi.fn(),setTargetAtTime:vi.fn(),exponentialRampToValueAtTime:vi.fn()},connect:vi.fn()});
  const instances:FakeContext[]=[];
  class FakeContext {
    state='running';currentTime=0;destination={};
    createGain=vi.fn(gain);
    createOscillator=vi.fn(()=>({frequency:{setValueAtTime:vi.fn(),exponentialRampToValueAtTime:vi.fn(),setTargetAtTime:vi.fn()},connect:vi.fn(),start:vi.fn(),stop:vi.fn()}));
    resume=vi.fn(()=>Promise.resolve());suspend=vi.fn(()=>Promise.resolve());
    constructor(){this.state=suspended?'suspended':'running';instances.push(this);}
  }
  const interval=vi.fn(()=>1),clearInterval=vi.fn();
  const media:FakeAudio[]=[];
  class FakeAudio {
    paused=true;ended=false;loop=false;preload='';volume=1;currentTime=0;
    events=new Map<string,()=>void>();
    addEventListener=(name:string,callback:()=>void)=>{this.events.set(name,callback);};
    play=vi.fn(()=>{this.paused=false;return Promise.resolve();});
    pause=vi.fn(()=>{this.paused=true;});
    constructor(readonly src:string){media.push(this);}
  }
  vi.stubGlobal('Audio',FakeAudio);
  vi.stubGlobal('window',{AudioContext:FakeContext,addEventListener:add,setInterval:interval,clearInterval});
  const visibility={hidden:false,addEventListener:add};vi.stubGlobal('document',visibility);
  const activation={isActive:true};vi.stubGlobal('navigator',{userActivation:activation});
  vi.stubGlobal('localStorage',{getItem:()=>null});
  const {AudioManager}=await import('../src/audio/AudioManager');
  return {audio:AudioManager.getInstance(),handlers,instances,add,interval,activation,media,visibility};
}
describe('Audio activation in the browser gesture',()=>{
  it('starts the Play-gated menu song inside its click even while Web Audio is resuming',async()=>{
    const {audio,handlers,media,instances}=await setup(true);
    handlers.get('pointerdown')!({isTrusted:true});expect(instances[0].state).toBe('suspended');
    audio.startMenuBGM(true);expect(media).toHaveLength(1);expect(media[0].play).toHaveBeenCalledOnce();
    audio.stopBGM();
  });
  it('loops the attached menu song after a gesture, keeps it across menu pages, and stops for a stage',async()=>{
    const {audio,handlers,media,interval}=await setup();
    audio.startMenuBGM();expect(media).toHaveLength(0);
    handlers.get('pointerdown')!({isTrusted:true});
    expect(media).toHaveLength(1);expect(media[0].src).toBe('/audio/menu1.mp3');expect(media[0].loop).toBe(true);
    await Promise.resolve();await Promise.resolve();
    media[0].currentTime=12;audio.startMenuBGM();
    expect(media[0].play).toHaveBeenCalledTimes(1);expect(media[0].currentTime).toBe(12);
    audio.setBGMVolume(.35);expect(media[0].volume).toBe(.35);
    audio.setMuted(true);expect(media[0].paused).toBe(true);
    audio.setMuted(false);expect(media[0].paused).toBe(false);
    audio.startBGM('arcade_rush');expect(media[0].paused).toBe(true);expect(media[0].currentTime).toBe(0);expect(interval.mock.calls.filter(call=>(call as unknown[])[1]===25)).toHaveLength(1);
    audio.startMenuBGM();audio.stopBGM();expect(media[0].paused).toBe(true);
  });
  it('retries denied menu playback on a later gesture and never starts it after leaving the menu',async()=>{
    const {audio,handlers,media}=await setup();
    audio.startMenuBGM();handlers.get('pointerdown')!({isTrusted:true});
    await Promise.resolve();await Promise.resolve();
    media[0].paused=true;media[0].play.mockRejectedValueOnce(new Error('autoplay denied'));
    handlers.get('keydown')!({isTrusted:true});await Promise.resolve();await Promise.resolve();await Promise.resolve();
    handlers.get('pointerdown')!({isTrusted:true});expect(media[0].play).toHaveBeenCalledTimes(3);
    audio.stopMenuBGM();await Promise.resolve();await Promise.resolve();
    handlers.get('keydown')!({isTrusted:true});expect(media[0].play).toHaveBeenCalledTimes(3);expect(media[0].paused).toBe(true);
  });
  it('creates audio inside the first trusted gesture and remembers music requested before it',async()=>{
    const {audio,handlers,instances,add,interval,activation}=await setup();
    audio.playClick();audio.startBGM('arcade_rush');audio.updateRoll(8);
    expect(instances).toHaveLength(0);
    handlers.get('keydown')!({isTrusted:false});expect(instances).toHaveLength(0);
    activation.isActive=false;handlers.get('keydown')!({isTrusted:true});expect(instances).toHaveLength(0);
    activation.isActive=true;
    handlers.get('pointerdown')!({isTrusted:true});
    expect(instances).toHaveLength(1);expect(instances[0].resume).not.toHaveBeenCalled();
    expect(add.mock.calls.filter(call=>(call as unknown[])[0]!=='visibilitychange').every(call=>(call as unknown[])[2]&&((call as unknown[])[2] as {capture:boolean}).capture)).toBe(true);
    expect(interval).toHaveBeenCalledTimes(1);
    const scheduled=instances[0].createOscillator.mock.calls.length;
    audio.playClick();expect(instances[0].createOscillator).toHaveBeenCalledTimes(scheduled+1);
    audio.stopBGM();
  });
  it('never resumes from rendering, delayed stage loading or a sound effect, and retries a denied resume on a later gesture',async()=>{
    const {audio,handlers,instances}=await setup(true);
    handlers.get('pointerdown')!({isTrusted:true});
    const ctx=instances[0];expect(ctx.resume).toHaveBeenCalledTimes(1);
    await Promise.resolve();await Promise.resolve();await Promise.resolve();
    ctx.resume.mockRejectedValueOnce(new Error('activation denied'));
    handlers.get('keydown')!({isTrusted:true});
    await Promise.resolve();await Promise.resolve();await Promise.resolve();
    const count=ctx.resume.mock.calls.length;
    audio.playClick();audio.startBGM();for(let i=0;i<20;i++)audio.updateRoll(12);
    expect(ctx.resume).toHaveBeenCalledTimes(count);expect(ctx.createOscillator).not.toHaveBeenCalled();
    ctx.resume.mockImplementationOnce(()=>{ctx.state='running';return Promise.resolve();});
    handlers.get('pointerdown')!({isTrusted:true});
    expect(ctx.resume).toHaveBeenCalledTimes(count+1);audio.stopBGM();
  });
});


describe('menu music recovery',()=>{
  it('resumes automatically when returning from a hidden tab after unlocking audio',async()=>{
    const {audio,handlers,media,visibility}=await setup();
    audio.startMenuBGM();handlers.get('pointerdown')!({isTrusted:true});
    await Promise.resolve();await Promise.resolve();
    media[0].currentTime=90;visibility.hidden=true;handlers.get('visibilitychange')!({isTrusted:false});
    expect(media[0].paused).toBe(true);
    visibility.hidden=false;handlers.get('visibilitychange')!({isTrusted:false});
    expect(media[0].paused).toBe(false);expect(media[0].currentTime).toBe(90);
    audio.stopBGM();
  });
  it('restarts an unexpected end and recovers a paused track without starting after leaving menus',async()=>{
    const {audio,handlers,media,interval}=await setup();
    audio.startMenuBGM();handlers.get('pointerdown')!({isTrusted:true});
    await Promise.resolve();await Promise.resolve();
    media[0].paused=true;media[0].ended=true;media[0].currentTime=360;
    media[0].events.get('ended')!();expect(media[0].currentTime).toBe(0);expect(media[0].paused).toBe(false);
    await Promise.resolve();await Promise.resolve();
    const recover=(interval.mock.calls.find(call=>(call as unknown[])[1]===2500) as unknown[])[0] as ()=>void;
    media[0].paused=true;recover();expect(media[0].paused).toBe(false);
    audio.stopBGM();const plays=media[0].play.mock.calls.length;recover();media[0].events.get('ended')!();
    expect(media[0].play).toHaveBeenCalledTimes(plays);
  });
});
