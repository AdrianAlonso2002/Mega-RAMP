import {gunzipSync} from 'node:zlib';
import {readFileSync,writeFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8')),before=JSON.parse(gunzipSync(readFileSync('reports/collectibles-before-audit.json.gz')).toString('utf8')),plans=read('reports/collectibles-correction-draft.json'),budgets=read('src/levels/StageBudgets.json'),worlds=new Map(),corrections={};
for(const [key,coins] of Object.entries(plans)){
 const data=before[key],w=data.world,path=`src/levels/editor-saved/world-${String(w).padStart(2,'0')}.json`;
 if(!worlds.has(path))worlds.set(path,read(path));
 const originals=new Set(data.objects.filter(o=>o.type==='collectible').map(o=>o.id));
 corrections[key]={keep:coins.filter(o=>originals.has(o.id)).map(o=>o.id),add:coins.filter(o=>!originals.has(o.id))};
 const saved=worlds.get(path),stage=saved[key]??structuredClone(data);
 stage.objects=[...stage.objects.filter(o=>o.type!=='collectible'),...coins];stage.properties={...stage.properties,collectibleAuditRevision:1};saved[key]=stage;
 if(JSON.stringify(stage.objects.filter(o=>o.type!=='collectible'))!==JSON.stringify(data.objects.filter(o=>o.type!=='collectible')))throw Error(`Geometry changed ${key}`);
}
let md='# Reparto verificado de coleccionables · Mundos 1–8\n\n';
md+='100 coleccionables por nivel (10 etapas), 400 por mundo y 3.200 en total. Recuento de las 320 etapas cargadas por LevelLoader, usando los diseños publicados del editor.\n\nSe conservan los 23 niveles que ya sumaban 100. Se corrigen los nueve restantes y se mantiene un mínimo de 20 en cada etapa Objetos (24 en Objetos19). La tabla sustituye los repartos provisionales repetidos de M6–M8. En rutas alternativas, el total incluye todos los ramales; no implica recogerlos todos en una sola pasada.\n\nLas incorporaciones sobre suelo se contrastaron con mallas visibles, normales, márgenes y colisiones reales. Las de canoa, vagoneta, géiser y pádel siguen sus rutas o trayectorias específicas. Esto no sustituye una partida manual completa de las 320 etapas.\n\n| Nivel | E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10 | Total |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n';
const rows=[];
for(let w=1;w<=8;w++)for(let l=1;l<=4;l++){
 const counts=[];let old=0;
 for(let e=1;e<=10;e++){
  const key=`${w}_${l}_${e}`,data=before[key],coins=plans[key]??data.objects.filter(o=>o.type==='collectible');counts.push(coins.length);old+=data.objects.filter(o=>o.type==='collectible').length;budgets[key]={name:data.name,count:coins.length};
 }
 if(counts.reduce((a,b)=>a+b,0)!==100)throw Error(`Bad level ${w}_${l}`);
 rows.push({world:w,level:l,before:old,counts,total:100});md+=`| M${w}-N${l} | ${counts.map(n=>String(n).padStart(2,'0')).join(' | ')} | **100** |\n`;
}
md+='\n## Niveles corregidos\n\n| Nivel | Antes | Ahora |\n|---|---:|---:|\n';for(const r of rows.filter(r=>r.before!==100))md+=`| M${r.world}-N${r.level} | ${r.before} | 100 |\n`;
for(const [path,data] of worlds)writeFileSync(path,JSON.stringify(data)+'\n');
writeFileSync('src/levels/CollectibleCorrections.json',JSON.stringify(corrections)+'\n');writeFileSync('src/levels/StageBudgets.json',JSON.stringify(budgets)+'\n');
writeFileSync('reports/coleccionables-mundos-1-8.md',md);writeFileSync('reports/coleccionables-mundos-1-8.json',JSON.stringify(rows,null,2)+'\n');
writeFileSync('reports/coleccionables-mundos-1-8.csv','\uFEFFNivel;E1;E2;E3;E4;E5;E6;E7;E8;E9;E10;Total\r\n'+rows.map(r=>`M${r.world}-N${r.level};${r.counts.join(';')};100`).join('\r\n')+'\r\n');
console.log(JSON.stringify({levels:rows.length,stages:320,correctedLevels:rows.filter(r=>r.before!==100).length,correctedStages:Object.keys(plans).length,added:Object.values(corrections).reduce((s,c)=>s+c.add.length,0),before:rows.reduce((s,r)=>s+r.before,0),after:3200}));
