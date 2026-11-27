import {describe,it,expect} from 'vitest';
import {createServer} from 'vite';
describe('saving levels without resetting the editor',()=>{
 it('keeps saved world data and collectible budgets out of the Vite configuration dependency graph',async()=>{
  const server=await createServer({server:{middlewareMode:true},appType:'custom'});
  try{
   expect(server.config.configFileDependencies.some(p=>p.endsWith('editor-stage-sync.ts'))).toBe(true);
   expect(server.config.configFileDependencies.filter(p=>/StageRegistry|StageBudgets|editor-saved/.test(p))).toEqual([]);
   const plugin=server.config.plugins.find(p=>p.name==='editor-stage-sync')!,hook=plugin.handleHotUpdate;
   const handler=typeof hook==='function'?hook:hook!.handler;
   for(const file of ['C:/project/src/levels/StageBudgets.json','C:/project/src/levels/editor-saved/world-04.json']){
    expect(await handler.call({} as never,{file} as never)).toEqual([]);
   }
  }finally{await server.close();}
 },15000);
});
