import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
beforeEach(()=>{vi.useFakeTimers();vi.resetModules();});
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();});
async function setup() {
  class FakeImage {
    static instances:FakeImage[]=[];src='';naturalWidth=128;decoding='';onload:(()=>void)|null=null;onerror:(()=>void)|null=null;
    constructor(){FakeImage.instances.push(this);}
  }
  vi.stubGlobal('Image',FakeImage);
  return {...await import('../src/ui/UIAssets'),FakeImage};
}
describe('Screen image readiness',()=>{
  it('coalesces concurrent map/menu/environment requests and retains only successful images',async()=>{
    const {loadUIImage,FakeImage}=await setup(),a=loadUIImage('/level.jpg'),b=loadUIImage('/level.jpg');
    expect(a).toBe(b);expect(FakeImage.instances).toHaveLength(1);FakeImage.instances[0].onload!();
    await expect(a).resolves.toBe(FakeImage.instances[0]);expect(loadUIImage('/level.jpg')).toBe(a);expect(vi.getTimerCount()).toBe(0);
  });
  it('falls back to the world image and allows retrying a missing image',async()=>{
    const {loadFirstUIImage,loadUIImage,FakeImage}=await setup();
    const pending=loadFirstUIImage(['/missing.jpg','/world.jpg']);FakeImage.instances[0].onerror!();
    await vi.advanceTimersByTimeAsync(0);FakeImage.instances[1].onload!();await expect(pending).resolves.toBe(FakeImage.instances[1]);
    loadUIImage('/missing.jpg');expect(FakeImage.instances).toHaveLength(3);
    FakeImage.instances[2].onerror!();await vi.advanceTimersByTimeAsync(0);expect(vi.getTimerCount()).toBe(0);
  });
  it('times out a stuck image and never repaints a detached screen',async()=>{
    const {revealUIBackdrop,loadUIImage,FakeImage}=await setup();
    const element={isConnected:false,style:{backgroundImage:''},classList:{add:vi.fn()}} as unknown as HTMLElement;
    const pending=revealUIBackdrop(element,['/late.jpg']);FakeImage.instances[0].onload!();await pending;
    expect(element.style.backgroundImage).toBe('');expect(element.classList.add).not.toHaveBeenCalled();
    const stuck=loadUIImage('/stuck.jpg');await vi.advanceTimersByTimeAsync(8000);await expect(stuck).resolves.toBe(null);expect(vi.getTimerCount()).toBe(0);
  });
});
