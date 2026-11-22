import {createServer} from 'vite';
import {writeFileSync} from 'node:fs';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
globalThis.localStorage={getItem:()=>null,setItem:()=>{}};
try {
  const {LevelLoader}=await server.ssrLoadModule('/src/levels/LevelLoader.ts');
  const loader=new LevelLoader(),stages={};
  for(let w=1;w<=6;w++)for(let l=1;l<=4;l++)for(let s=1;s<=10;s++)stages[`${w}_${l}_${s}`]=await loader.loadStage(w,l,s);
  writeFileSync('reports/collectible-layouts.json',JSON.stringify(stages));
  for(let w=1;w<=6;w++)for(let l=1;l<=4;l++)console.log(`M${w}N${l}: `+Array.from({length:10},(_,s)=>{const d=stages[`${w}_${l}_${s+1}`];return `${d.name}=${d.objects.filter(o=>o.type==='collectible').length}`;}).join(' | '));
}finally{await server.close();}
