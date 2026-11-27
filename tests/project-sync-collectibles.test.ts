import {EventEmitter} from 'node:events';
import {join} from 'node:path';
import {describe,it,expect,vi} from 'vitest';
import {LevelLoader} from '../src/levels/LevelLoader';
import corrections from '../src/levels/CollectibleCorrections.json';
const files=vi.hoisted(()=>new Map<string,string>());
vi.mock('node:fs/promises',()=>({mkdir:async()=>{},readFile:async(p:string)=>{if(!files.has(p))throw Error(p);return files.get(p)!;},writeFile:async(p:string,s:string)=>{files.set(p,s);},rename:async(a:string,b:string)=>{files.set(b,files.get(a)!);files.delete(a);}}));
import {editorStageSync} from '../scripts/editor-stage-sync';
describe('project sync collectible migration',()=>{
 it('cannot overwrite corrected prize counts with an old open editor tab',async()=>{
  const official=await new LevelLoader().loadStage(4,3,3),old=structuredClone(official);delete old.properties!.collectibleAuditRevision;
  old.objects=old.objects.filter(o=>!corrections['4_3_3'].add.some(c=>c.id===o.id));old.objects[0].position.x+=.25;
  const root='test-project';files.clear();
  for(let w=1;w<=8;w++)files.set(join(root,`src/levels/editor-saved/world-${String(w).padStart(2,'0')}.json`),JSON.stringify(w===4?{'4_3_3':official}:{}));
  const metadata=join(root,'src/levels/StageBudgets.json');files.set(metadata,JSON.stringify({'4_3_3':{name:old.name,count:9}}));
  let handler:(req:any,res:any)=>void=()=>{};
  const plugin=editorStageSync(),configure=plugin.configureServer as (server:unknown)=>void;
  configure({config:{root},middlewares:{use:(_path:string,callback:typeof handler)=>{handler=callback;}}});
  const req=Object.assign(new EventEmitter(),{method:'POST',headers:{host:'localhost:5173',origin:'http://localhost:5173','content-type':'application/json'},socket:{remoteAddress:'127.0.0.1'}});
  let status=0;
  await new Promise<void>(resolve=>{
   const res={headersSent:false,writeHead(code:number){status=code;this.headersSent=true;return this;},end(){resolve();}};
   handler(req,res);req.emit('data',JSON.stringify({stages:[old]}));req.emit('end');
  });
  expect(status).toBe(200);const saved=JSON.parse(files.get(join(root,'src/levels/editor-saved/world-04.json'))!)['4_3_3'];
  expect(saved.objects.filter((o:{type:string})=>o.type==='collectible')).toHaveLength(10);
  expect(saved.properties.collectibleAuditRevision).toBe(1);expect(saved.objects[0].position.x).toBe(old.objects[0].position.x);
  expect(JSON.parse(files.get(metadata)!)['4_3_3'].count).toBe(10);
 });
});
