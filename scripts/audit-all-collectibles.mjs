import {createServer} from 'vite';
import {mkdirSync,writeFileSync} from 'node:fs';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {LevelLoader}=await server.ssrLoadModule('/src/levels/LevelLoader.ts');
 const loader=new LevelLoader(),rows=[];
 for(let w=1;w<=8;w++)for(let l=1;l<=4;l++){
  const counts=[];
  for(let e=1;e<=10;e++){const data=await loader.loadStage(w,l,e);counts.push(data.objects.filter(o=>o.type==='collectible').length);}
  rows.push({world:w,level:l,counts,total:counts.reduce((a,b)=>a+b,0)});
  console.log(`M${w}-N${l}: ${counts.join(',')} = ${rows.at(-1).total}`);
 }
 mkdirSync('reports',{recursive:true});writeFileSync('reports/collectibles-verified-counts.json',JSON.stringify(rows,null,2)+'\n');
  if(rows.some(r=>r.total!==100))throw Error('Hay niveles que no suman 100 coleccionables');
}finally{await server.close();}
