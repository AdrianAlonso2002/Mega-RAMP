import {describe,it,expect} from 'vitest';
import {FramePacer} from '../src/core/FramePacer';
import {PerformanceManager} from '../src/core/PerformanceManager';

describe('frame pacing across desktop and phone refresh rates',()=>{
 for(const refresh of [60,75,90,120,144,165,240])for(const cap of [30,60])it(`${cap} FPS on a ${refresh} Hz screen`,()=>{
  const pacer=new FramePacer();let rendered=0;
  for(let frame=0;frame<refresh*20;frame++)if(pacer.shouldRender(frame*1000/refresh,cap))rendered++;
  expect(Math.abs(rendered/20-cap)).toBeLessThan(.1);
 });
 it('survives jitter, a suspended tab and changing the limit without a catch-up burst',()=>{
  const pacer=new FramePacer();let rendered=0;
  for(let frame=0;frame<1800;frame++)if(pacer.shouldRender(frame*1000/90+Math.sin(frame)*.6,60))rendered++;
  expect(Math.abs(rendered/20-60)).toBeLessThan(.2);
  expect(pacer.shouldRender(50000,30)).toBe(true);expect(pacer.shouldRender(50000,30)).toBe(false);expect(pacer.shouldRender(50001,30)).toBe(false);
 });
 it('judges 30 FPS against the selected cap rather than lowering quality as if 60 were required',()=>{
  let scale=1;const performance=new PerformanceManager({getResolutionScale:()=>scale,setResolutionScale:(value:number)=>{scale=value;}} as any);
  for(let i=0;i<30*10;i++)performance.update(1/30,'30',true);
  expect(scale).toBeGreaterThanOrEqual(1);
 });
});
