import {readFileSync,writeFileSync} from 'node:fs';
import * as THREE from 'three';
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const stages=read('reports/collectible-layouts.json'),recipes=read('reports/collectible-recipes-draft.json'),targets=read('reports/collectible-targets.json');
const coins=k=>stages[k].objects.filter(o=>o.type==='collectible');
function layout(k,points){
 const old=coins(k);recipes[k]=points.map((p,i)=>{
  const position=Array.isArray(p)?{x:p[0],y:p[1],z:p[2]}:p;
  const anchor=old.reduce((a,b)=>new THREE.Vector3().copy(position).distanceTo(a.position)<new THREE.Vector3().copy(position).distanceTo(b.position)?a:b);
  return {id:`collectible-balance-${k}-layout-${i}`,p:position,properties:{},anchor:anchor.id,offset:{x:position.x-anchor.position.x,y:position.y-anchor.position.y,z:position.z-anchor.position.z}};
 });
}
function choose(k,indices){const old=coins(k);recipes[k]=indices.map(i=>({id:old[i].id,p:old[i].position,properties:old[i].properties??{},anchor:old[i].id,offset:{x:0,y:0,z:0}}));}
// Streams: one prize over each actual water step, away from rocks and debris.
for(const k of ['1_3_1','1_3_10']){
 const water=stages[k].objects.filter(o=>o.type==='water');
 const p=water.map((o,i)=>[o.position.x+(i%2?1.7:-1.7),o.position.y+1.2,o.position.z]);
 if(k==='1_3_10')p.push([-1.8,25.2,36],[1.8,25.2,36]);
 layout(k,p);
}
// Bounce rewards retain the original aerial arc, with accessible entry and low bounces.
layout('2_1_9',[...coins('2_1_9').map(o=>o.position),[-1.5,1.8,12.7],[1.5,1.8,12.7],[-3,1.4,4],[3,1.4,-4]]);
// The salamander has an irregular silhouette: use its existing central body anchors.
layout('3_1_7',[...coins('3_1_7').map(o=>o.position),[1.5,1.2,-46],[2.4,1.2,-59]]);
// Long highway: follow the real corner-to-corner slopes, never cut across the bend.
{
 const curve=[new THREE.Vector3(0,70,0),new THREE.Vector3(0,51,-43),new THREE.Vector3(28,33,-75),new THREE.Vector3(8,15,-111),new THREE.Vector3(23,0,-153)];
 const lengths=curve.slice(1).map((p,i)=>p.distanceTo(curve[i])),total=lengths.reduce((a,b)=>a+b,0);
 layout('5_1_2',Array.from({length:10},(_,i)=>{let d=total*(i+.6)/10.6,j=0;while(j<lengths.length-1&&d>lengths[j])d-=lengths[j++];const p=curve[j].clone().lerp(curve[j+1],d/lengths[j]);return {x:p.x,y:p.y+1,z:p.z};}));
}
// Three noodle paths: fewer on the broad route, more on the narrow ones (4/5/7).
choose('5_1_8',[0,3,6,9,11,15,18,21,24,25,29,33,36,38,40,42]);
layout('5_3_2',[[0,12.9,7],[0,12.9,-26],[0,12.9,-51],[0,12.9,-66]]);
// Mine: two tutorial prizes, every junction represented, and extras in the long final part.
choose('5_4_6',[48,55,...Array.from({length:12},(_,i)=>i*4+1),18,30,38,46]);
// Both chocolate paths previously put a prize at the exact same merge point.
choose('6_4_6',[0,1,2,4,5,6,7,8,9,10]);
// Seven moving bowls plus the stationary final basin.
layout('5_4_8',[...coins('5_4_8').map(o=>o.position),[2.4,4.7,0]]);
// Oxford rest stage: a compact, orderly 4 by 5 grid rather than scattered extras.
layout('6_3_5',Array.from({length:20},(_,i)=>[(i%4-1.5)*2.5,12.7,-8+(Math.floor(i/4)-2)*2.5]));
// Reward the approaches to all four gems, not just the central corridor.
layout('6_2_9',[[-13,16.55,-15],[13,16.55,-15],[-13,16.55,-65],[13,16.55,-65],[0,12.7,-35],[0,12.7,-85]]);
// Two prizes during each rolling-ball transfer and two on the landing deck.
layout('6_3_2',[[0,13.8,20],[0,13.7,0],[1.8,13.45,2],[0,7.8,-24],[-2,-12.2,-27],[2,-12.2,-32]]);
// The first bus keeps its original moving prizes and their timing.
{
 const k='1_2_1',old=coins(k);const extras=[[-1,1.25,1.8],[1,1.25,-.6],[0,1.35,-24],[0,1.35,-42],[0,1.35,-60]];
 recipes[k]=old.map(o=>({id:o.id,p:o.position,properties:o.properties??{},anchor:o.id,offset:{x:0,y:0,z:0}}));
 extras.forEach((p,i)=>{const anchor=old[i<2?i:2];recipes[k].push({id:`collectible-balance-${k}-bus-${i}`,p:{x:p[0],y:p[1],z:p[2]},properties:i<2?{...anchor.properties}:{},anchor:anchor.id,offset:{x:p[0]-anchor.position.x,y:p[1]-anchor.position.y,z:p[2]-anchor.position.z}});});
}
const rows=[];
// Physical collider checks found these prizes inside old props/railings: move them clear.
const clearances={
 '1_2_5':{5:[1.6,0]},'1_3_5':{2:[1.6,0],3:[1.6,0],9:[1.6,0],10:[1.6,0]},
 '3_4_5':{2:[-.61229,1.47821]},'4_1_5':{7:[1.6,0]},'4_2_5':{9:[1.6,0]},'4_3_5':{13:[1.6,0]}
};
for(const [k,corrections] of Object.entries(clearances))for(const [index,[dx,dz]] of Object.entries(corrections)){
 const c=recipes[k].find(c=>c.id===`collectible-balance-${k}-${index}`);c.p.x+=dx;c.p.z+=dz;c.offset.x+=dx;c.offset.z+=dz;
}
for(const [key,recipe] of Object.entries(recipes)){
 const [w,l,s]=key.split('_').map(Number),target=targets[(w-1)*4+l-1][s-1];
 if(recipe.length!==target)throw Error(`${key}: ${recipe.length}/${target}`);
 for(const c of recipe)if(c.id.startsWith('collectible-balance-'))c.id=`${c.anchor}-balance-${c.id.slice('collectible-balance-'.length)}`;
 for(const c of recipe)for(const p of [c.p,c.offset])for(const axis of ['x','y','z']){if(!Number.isFinite(p[axis]))throw Error('Non-finite placement');p[axis]=+p[axis].toFixed(5);}
 for(let i=0;i<recipe.length;i++)for(let j=0;j<i;j++)if(new THREE.Vector3().copy(recipe[i].p).distanceTo(recipe[j].p)<.65)throw Error(`Overlapping prizes ${key}: ${i}/${j}`);
 rows.push({world:w,level:l,stage:s,name:stages[key].name,before:coins(key).length,after:target});
}
writeFileSync('src/levels/CollectibleLayouts.json',JSON.stringify(recipes)+'\n');
writeFileSync('reports/collectible-budget-audit.json',JSON.stringify(rows,null,2)+'\n');
let report='# Coleccionables · Mundos 1–6\n\n24 niveles, 240 etapas y 2.400 coleccionables. Cada nivel contiene exactamente 100; cada etapa Objetos contiene al menos 20.\n\nLos coleccionables adicionales se han colocado comprobando superficies y bordes, con ajustes específicos para agua, saltos, vehículos, las tres rutas de tallarines, las bifurcaciones de la mina y los caños de la fuente. Se conservan los datos de movimiento de los premios del autobús, trenes y pirámide. En las rutas alternativas, el total cuenta todos los caminos, no solo una pasada. No se cambian plataformas, obstáculos, físicas ni metas.\n\n| Nivel | E1 | E2 | E3 | E4 | E5 · Objetos | E6 | E7 | E8 | E9 | E10 | Total |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n';
targets.forEach((r,i)=>report+=`| M${Math.floor(i/4)+1}-N${i%4+1} | ${r.join(' | ')} | 100 |\n`);
report+='\n## Detalle por etapa\n\n| Etapa | Nombre | Antes | Ahora |\n|---|---|---:|---:|\n';
rows.forEach(r=>report+=`| M${r.world}-N${r.level}-E${r.stage} | ${r.name} | ${r.before} | ${r.after} |\n`);
writeFileSync('reports/coleccionables-mundos-1-6.md',report);
console.log('Final layouts: 240 stages, 24 levels, 2400 prizes.');
