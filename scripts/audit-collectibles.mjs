import {createServer} from 'vite';
import {writeFileSync, mkdirSync} from 'node:fs';
const server = await createServer({server:{middlewareMode:true}, appType:'custom'});
try {
  const {LevelLoader} = await server.ssrLoadModule('/src/levels/LevelLoader.ts');
  const {WORLDS} = await server.ssrLoadModule('/src/levels/WorldDefinitions.ts');
  const storage = new Map();
  globalThis.localStorage = {getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)};
  const loader = new LevelLoader(), rows=[];
  for (let world=1;world<=5;world++) for(let level=1;level<=4;level++) for(let stage=1;stage<=10;stage++) {
    const data=await loader.loadStage(world,level,stage);
    const collectibles=data.objects.filter(o=>o.type==='collectible');
    const goals=data.objects.filter(o=>o.type==='goal');
    const xs=collectibles.map(o=>o.position.x),zs=collectibles.map(o=>o.position.z);
    rows.push({world,worldName:WORLDS[world-1].name,level,levelName:WORLDS[world-1].levels[level-1].name,stage,name:data.name,current:collectibles.length,timeLimit:data.timeLimit,
      span:collectibles.length ? [Math.round(Math.max(...xs)-Math.min(...xs)),Math.round(Math.max(...zs)-Math.min(...zs))]:[0,0],
      goal:goals.map(g=>g.position),properties:data.properties??{},types:[...new Set(data.objects.map(o=>o.type))]});
  }
  mkdirSync('reports',{recursive:true});
  writeFileSync('reports/collectibles-worlds-1-5-source.json',JSON.stringify(rows,null,2)+'\n');
  for(let i=0;i<rows.length;i+=10) console.log(rows.slice(i,i+10).map(r=>`M${r.world}-N${r.level}-E${r.stage} ${r.name}: ${r.current} (${r.span.join('x')}m)`).join('\n'));
} finally {await server.close();}
