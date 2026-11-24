import {describe,expect,it,vi} from 'vitest';
import {PreparedLevel} from '../src/levels/PreparedLevel';
import type {LevelData} from '../src/levels/LevelTypes';
function stage(world:number,level:number,index:number):LevelData {
  return {id:`${world}-${level}-${index}`,world,level,stage:index,name:`Stage ${index}`,timeLimit:60,spawn:{x:0,y:1,z:0},objects:[]};
}
describe('Prepared ten-stage levels',()=>{
  it('prepares all ten stages once and returns independent copies without reparsing at each transition',async()=>{
    const load=vi.fn(async(w,l,s)=>stage(w,l,s)),cache=new PreparedLevel(load,()=>null);
    const prepared=await cache.prepare(6,3);expect(prepared).toHaveLength(10);expect(load).toHaveBeenCalledTimes(10);
    prepared[4].name='runtime mutation';const fresh=await cache.getStage(6,3,5);expect(fresh.name).toBe('Stage 5');
    fresh.spawn.y=999;expect((await cache.getStage(6,3,5)).spawn.y).toBe(1);expect(load).toHaveBeenCalledTimes(10);
  });
  it('always replaces a prepared snapshot with a newer editor save',async()=>{
    let saved='original';const load=vi.fn(async(w,l,s)=>({...stage(w,l,s),name:saved}));
    const cache=new PreparedLevel(load,()=>saved);await cache.prepare(5,4);
    saved='newest user-saved version';expect((await cache.getStage(5,4,7)).name).toBe(saved);expect(load).toHaveBeenCalledTimes(11);
  });
  it('retains only the current level instead of accumulating every world',async()=>{
    const load=vi.fn(async(w,l,s)=>stage(w,l,s)),cache=new PreparedLevel(load,()=>null);
    await cache.prepare(1,1);await cache.prepare(1,2);await cache.getStage(1,1,2);
    expect(load).toHaveBeenCalledTimes(21);cache.clear();await cache.getStage(1,1,2);expect(load).toHaveBeenCalledTimes(22);
  });
  it('stops preparation after abandoned navigation',async()=>{
    const controller=new AbortController(),load=vi.fn(async(w,l,s)=>{if(s===2)controller.abort();return stage(w,l,s);});
    const cache=new PreparedLevel(load,()=>null);
    await expect(cache.prepare(1,1,controller.signal)).rejects.toMatchObject({name:'AbortError'});expect(load).toHaveBeenCalledTimes(2);
  });
});


it('does not report readiness until the tenth stage finishes loading',async()=>{
  let finish:()=>void=()=>{},reached:()=>void=()=>{},ready=false;
  const tenthRequested=new Promise<void>(resolve=>{reached=resolve;});
  const cache=new PreparedLevel(async(w,l,s)=>{if(s===10)await new Promise<void>(resolve=>{finish=resolve;reached();});return stage(w,l,s);},()=>null);
  const pending=cache.prepare(8,4).then(stages=>{ready=true;return stages;});
  await tenthRequested;expect(ready).toBe(false);
  finish();expect(await pending).toHaveLength(10);expect(ready).toBe(true);
});
