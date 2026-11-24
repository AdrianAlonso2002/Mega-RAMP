import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {UIManager} from '../src/ui/UIManager';
import {optionalReadiness} from '../src/ui/OptionalReadiness';

beforeEach(()=>vi.useFakeTimers());
afterEach(()=>{vi.useRealTimers();vi.restoreAllMocks();});

it('covers the return from character selection to pause and waits for its assets',async()=>{
  const ui=Object.create(UIManager.prototype) as any;
  const root={inert:false,setAttribute:vi.fn(),removeAttribute:vi.fn(),querySelector:()=>null};
  let ready:()=>void=()=>{};
  const wait=vi.fn(()=>new Promise<void>(resolve=>{ready=resolve;}));
  const clouds={active:false,run:vi.fn(async(_direction:string,prepare:(signal:AbortSignal)=>Promise<void>)=>{await prepare(new AbortController().signal);})};
  Object.assign(ui,{root,clouds,displayedScreen:'character-select',renderScreen:vi.fn(),waitForScreenAssets:wait});
  ui.showScreen('pause');expect(clouds.run).toHaveBeenCalledWith('back',expect.any(Function),false);
  expect(root.inert).toBe(true);expect(wait).toHaveBeenCalledWith('pause',expect.any(AbortSignal));
  ready();await vi.runAllTimersAsync();expect(root.inert).toBe(false);expect(root.removeAttribute).toHaveBeenCalledWith('inert');
});

it('does not leave optional font decoding waiting forever on an installed mobile app',async()=>{
  let ready=false;const pending=optionalReadiness(new Promise(()=>{}),new AbortController().signal).then(()=>{ready=true;});
  await vi.advanceTimersByTimeAsync(4999);expect(ready).toBe(false);
  await vi.advanceTimersByTimeAsync(1);await pending;expect(ready).toBe(true);expect(vi.getTimerCount()).toBe(0);
});

it('cancels optional UI waits immediately when navigating away',async()=>{
  const controller=new AbortController();const pending=optionalReadiness(new Promise(()=>{}),controller.signal);
  controller.abort();await pending;expect(vi.getTimerCount()).toBe(0);
});
