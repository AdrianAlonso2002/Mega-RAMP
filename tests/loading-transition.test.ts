import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {runLoadingTransition} from '../src/ui/LoadingTransition';
beforeEach(()=>vi.useFakeTimers());
afterEach(()=>vi.useRealTimers());
const paint=()=>Promise.resolve();
describe('Covered level transitions',()=>{
  it('reveals the next stage immediately after preparation without the initial three-second wait',async()=>{
    let revealed=false;const prepare=vi.fn(async()=>{});
    const pending=runLoadingTransition(prepare,new AbortController().signal,0,paint).then(()=>{revealed=true;});
    await vi.advanceTimersByTimeAsync(0);await pending;
    expect(prepare).toHaveBeenCalledOnce();expect(revealed).toBe(true);expect(vi.getTimerCount()).toBe(0);
  });
  it('prepares concurrently but never reveals before three seconds',async()=>{
    const prepare=vi.fn(async()=>{}),controller=new AbortController();let revealed=false;
    const pending=runLoadingTransition(prepare,controller.signal,3000,paint).then(()=>{revealed=true;});
    await vi.advanceTimersByTimeAsync(2999);expect(prepare).toHaveBeenCalledTimes(1);expect(revealed).toBe(false);
    await vi.advanceTimersByTimeAsync(1);await pending;expect(revealed).toBe(true);expect(vi.getTimerCount()).toBe(0);
  });
  it('keeps the cover until slow scene preparation completes',async()=>{
    let ready:()=>void=()=>{},revealed=false;
    const pending=runLoadingTransition(()=>new Promise<void>(resolve=>{ready=resolve;}),new AbortController().signal,3000,paint).then(()=>{revealed=true;});
    await vi.advanceTimersByTimeAsync(4000);expect(revealed).toBe(false);ready();await pending;expect(revealed).toBe(true);
  });
  it('cancels abandoned navigation and clears all cover timers',async()=>{
    const controller=new AbortController();let workSignal:AbortSignal|undefined;
    const pending=runLoadingTransition(async signal=>{workSignal=signal;await new Promise(()=>{});},controller.signal,3000,paint);
    const rejected=expect(pending).rejects.toMatchObject({name:'AbortError'});
    await vi.advanceTimersByTimeAsync(0);controller.abort();await rejected;
    expect(workSignal!.aborted).toBe(true);expect(vi.getTimerCount()).toBe(0);
  });
  it('exposes preparation errors immediately and allows recovery instead of an infinite spinner',async()=>{
    await expect(runLoadingTransition(async()=>{throw new Error('broken scene');},new AbortController().signal,3000,paint)).rejects.toThrow('broken scene');
    expect(vi.getTimerCount()).toBe(0);
  });
  it('bounds a stalled load and aborts any unfinished preparation',async()=>{
    let workSignal:AbortSignal|undefined;
    const pending=runLoadingTransition(async signal=>{workSignal=signal;await new Promise(()=>{});},new AbortController().signal,3000,paint);
    const rejected=expect(pending).rejects.toThrow('demasiado');
    await vi.advanceTimersByTimeAsync(30000);await rejected;expect(workSignal!.aborted).toBe(true);expect(vi.getTimerCount()).toBe(0);
  });
});
