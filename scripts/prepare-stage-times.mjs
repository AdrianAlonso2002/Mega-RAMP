import {createServer} from 'vite';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
const previous=JSON.parse(readFileSync('src/levels/StageTimeLimits.json','utf8'));
try {
 const {LevelLoader}=await server.ssrLoadModule('/src/levels/LevelLoader.ts'),loader=new LevelLoader(),limits={};
 for(let w=1;w<=8;w++)for(let l=1;l<=4;l++)for(let e=1;e<=10;e++) {
  const data=await loader.loadStage(w,l,e),prizes=data.objects.filter(o=>o.type==='collectible'),goal=data.objects.find(o=>o.type==='goal');
  const points=[data.spawn,...prizes.map(o=>o.position),...(goal?[goal.position]:[])];
  // Minimum spanning traversal estimates the detour needed to gather all prizes, not just reach the goal.
  const reached=new Set([0]);let tree=0;
  while(reached.size<points.length){let shortest=Infinity,next=-1;for(const i of reached)for(let j=0;j<points.length;j++)if(!reached.has(j)){const a=points[i],b=points[j],d=Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);if(d<shortest){shortest=d;next=j;}}tree+=shortest;reached.add(next);}
  let authoredRoute=0,moving=0;
  for(const o of data.objects){const p=o.properties??{};if(p.hasCollision===false)continue;
   const path=p.points;if(Array.isArray(path)&&path.length>1) {let length=0;for(let i=1;i<path.length;i++)length+=Math.hypot(path[i].x-path[i-1].x,path[i].y-path[i-1].y,path[i].z-path[i-1].z);authoredRoute=Math.max(authoredRoute,length);}
   if(o.type==='moving-platform'||o.type==='rotating-platform'||Object.keys(p).some(k=>k.endsWith('Action')))moving++;
  }
  const route=Math.max(tree*1.65,authoredRoute),mechanisms=Math.min(35,moving*1.5),estimate=route/4+12+prizes.length*.45+mechanisms;
  const special={ '5_3_6':150,'5_3_10':240,'5_4_6':180,'6_2_10':210,'6_3_1':150 };
  const seconds=(!process.argv.includes('--recalibrate')?previous[`${w}_${l}_${e}`]?.seconds:undefined)??special[`${w}_${l}_${e}`]??Math.max(60,Math.ceil(estimate/15)*15);
  limits[`${w}_${l}_${e}`]={name:data.name,seconds,estimatedRoute:Math.round(route),mechanismAllowance:Math.round(mechanisms),...(special[`${w}_${l}_${e}`]?{note:'Descenso/vehículo/persecución: avance efectivo más rápido que a pie.'}:{})};
 }
 writeFileSync('src/levels/StageTimeLimits.json',JSON.stringify(limits,null,2)+'\n');
 mkdirSync('reports',{recursive:true});
 let report='# Límites de tiempo bomba\n\nEdita `seconds` en `src/levels/StageTimeLimits.json` y vuelve a compilar/subir el proyecto. Es la fuente que lee el juego; no se guarda en el navegador. Las etapas personalizadas pueden usar `properties.bombTimeLimit` (segundos).\n\nPrimera calibración estimada para recoger todos los objetos y llegar a la meta: recorrido entre coleccionables, rutas definidas, velocidad efectiva prudente de 4 unidades/s, maniobras y esperas de mecanismos. Mínimo 60 s y ampliaciones de 15 s. No equivale a haber completado manualmente las 320 etapas; ajustar con pruebas reales. La pausa, la introducción y la victoria no consumen la mecha. La cuenta atrás se reinicia cada vez que se pierde una vida; el cronómetro total sigue separado y continúa acumulándose. Al explotar la bomba se cortan los efectos, pero la música continúa sin cambiar de pista. Al agotarse: bloqueo inmediato, expresión de miedo durante 1 s y una vida menos.\n\n';
 for(let w=1;w<=8;w++){report+=`## Mundo ${w}\n\n| Nivel | E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10 |\n|---|---|---|---|---|---|---|---|---|---|---|\n`;for(let l=1;l<=4;l++)report+=`| M${w}-N${l} | ${Array.from({length:10},(_,i)=>limits[`${w}_${l}_${i+1}`].seconds+' s').join(' | ')} |\n`;report+='\n';}
 writeFileSync('reports/tiempos-bomba.md',report);
 console.log('320 límites guardados. Distribución:',Object.values(limits).reduce((a,v)=>(a[v.seconds]=(a[v.seconds]??0)+1,a),{}));
} finally {await server.close();}
