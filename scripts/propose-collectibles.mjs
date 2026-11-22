import {readFileSync,writeFileSync} from 'node:fs';
const rows=JSON.parse(readFileSync('reports/collectibles-worlds-1-5-source.json','utf8'));
// Design proposal only: never writes stage files or editor overrides.
const targets=[
  [8,8,10,10,20,8,10,8,8,10], [10,8,8,10,20,8,8,8,8,12],
  [10,6,12,10,20,8,8,6,6,14], [8,10,10,8,20,8,10,8,8,10],
  [8,10,10,10,20,8,6,10,8,10], [8,8,10,8,20,8,8,10,10,10],
  [8,10,12,8,20,6,6,10,10,10], [12,8,10,8,20,10,8,8,6,10],
  [8,8,8,10,20,8,12,8,8,10], [8,8,10,8,20,8,8,8,10,12],
  [10,8,12,8,20,8,8,10,8,8], [10,10,8,8,20,10,6,10,8,10],
  [8,10,8,8,20,8,8,8,12,10], [10,10,8,10,20,8,6,8,10,10],
  [8,8,12,6,20,10,12,8,8,8], [10,8,8,8,20,12,8,8,8,10],
  [8,10,8,4,20,10,8,16,6,10], [10,8,8,6,20,8,8,8,10,14],
  [6,4,8,10,24,10,6,8,8,16], [6,8,8,8,20,18,8,8,4,12]
];
const notes={
  '1_1_1':'Introducción: pequeño anillo de aprendizaje, sin llenar la salida.',
  '1_2_1':'Línea de recogida durante el viaje y salida del autobús.',
  '1_3_2':'Callejón compacto: menos desvíos y separación suficiente.',
  '1_3_8':'Reparto corto en el campo; evitar grupos amontonados.',
  '1_3_9':'Premios en las zonas seguras del pádel.',
  '2_1_7':'Ascensor: seis a alturas distintas, lejos de las zonas de aplastamiento.',
  '2_2_6':'Premiar las transferencias entre ruedas, cuadro y pedales.',
  '2_3_6':'Sombrilla compacta: seis bien visibles en zonas transitables.',
  '2_3_7':'Toalla: reparto corto para no saturar una superficie pequeña.',
  '2_4_1':'Trayecto largo del tranvía: línea de premios durante el viaje.',
  '3_1_3':'Fuente: premios accesibles sin colocarlos dentro de los chorros.',
  '3_1_7':'Camino largo: conservar una recompensa por cada tramo.',
  '3_2_10':'Zona amplia: doce repartidos entre las rutas transitables.',
  '3_4_7':'Prueba compacta: reducir la acumulación en muy poco espacio.',
  '3_4_9':'Guiar en la oscuridad con ocho premios dentro del alcance de la luz.',
  '4_1_9':'Recorrido largo del Kamehameha: doce marcando las zonas seguras.',
  '4_2_7':'Recorrido corto: seis con margen frente a los obstáculos.',
  '4_3_1':'Bici2: recompensar las transferencias, sin exigir saltos imposibles.',
  '4_3_4':'Campo corto: seis en lugar de concentrar diez.',
  '4_3_7':'Supermercado grande: doce en pasillos y desvíos accesibles.',
  '4_4_6':'Tres sándwiches: cuatro por sándwich, adaptados a su inclinación.',
  '4_4_7':'Quesarito: ocho siguiendo la superficie, sin obligar a frenar en el giro.',
  '4_4_9':'Ocho como guía de descenso por las butacas transitables.',
  '4_4_10':'Cinta: diez en líneas legibles, separados de la aparición de obstáculos.',
  '5_1_2':'Bajada larga: diez anticipando las curvas y sin acercarse al borde abierto.',
  '5_1_3':'Ocho para guiar de pico en pico, sin meterlos en la roca.',
  '5_1_4':'Prueba de espera: cuatro entre aparcamiento y plataforma oculta.',
  '5_1_8':'Tres rutas: 4 centro, 5 izquierda y 7 derecha; mayor premio a menor anchura.',
  '5_1_9':'Seis: evitar exigir giros extra durante los terremotos.',
  '5_2_4':'Seis en pausas seguras: los imanes erráticos ya exigen atención.',
  '5_2_7':'Sendero estrecho: ocho en la línea de avance, sin desvíos laterales.',
  '5_2_8':'Ocho siguiendo la espiral y alejados de los huecos.',
  '5_2_9':'Diez dentro del plato; mantener la lectura del giro y de la meta.',
  '5_2_10':'Catorce: aproximación de plataformas, saltos y travesía del puente.',
  '5_3_1':'Tutorial: seis premios grandes y espaciados para aprender a remar.',
  '5_3_2':'Cuatro: dos en tierra y dos después de embarcar.',
  '5_3_4':'Diez en la trayectoria segura del descenso, con aviso antes de las curvas.',
  '5_3_5':'Veinticuatro en una zona de agua tranquila y ancha; descanso real.',
  '5_3_6':'Diez en grupos separados a lo largo de la recta de 630 m.',
  '5_3_7':'Seis en la línea del salto; no distraer del aterrizaje móvil.',
  '5_3_8':'Ocho en el carril navegable, lejos de las rocas que rompen la canoa.',
  '5_3_9':'Ocho en aproximación y caída; evitar treinta premios en caída automática.',
  '5_3_10':'Dieciséis por curvas, descensos y espiral; preservar la lectura a 100 km/h.',
  '5_4_1':'Seis durante la introducción del autobús; dejar espacio para aprender.',
  '5_4_2':'Ocho en las curvas con espacio suficiente para corregir el autobús.',
  '5_4_3':'Ocho en la trayectoria segura, sin mezclarlos con vacas móviles.',
  '5_4_6':'Dieciocho: dos de introducción, uno por cada uno de los 12 desvíos y cuatro de salida; favorecer el carril correcto y las variantes con premio.',
  '5_4_7':'Ocho en huecos seguros entre las vacas, sin exigir rodearlas.',
  '5_4_8':'Ocho: uno por caño y uno en la plataforma fija final.',
  '5_4_9':'Cuatro en la plataforma inicial; sin premios que desvíen del disparo.',
  '5_4_10':'Doce siguiendo el recorrido que se estrecha, sin llenar los bordes.'
};
function reason(r) {
  const key=`${r.world}_${r.level}_${r.stage}`;
  if(notes[key])return notes[key];
  if(/^Objetos/i.test(r.name))return 'Descanso: cuadrícula o grupos amplios de 20, sin obligar a arriesgar vidas.';
  if(/^Correr/i.test(r.name))return 'Marcar el avance con una línea de premios y algún pequeño desvío seguro.';
  if(/^Salto/i.test(r.name))return 'Premiar cada recepción; evitar premios suspendidos fuera del alcance de salto.';
  if(/^Muro/i.test(r.name))return 'Repartir entre aproximación y pasos transitables del muro.';
  if(/Cuesta|Bajada|Curvas/.test(r.name))return 'Guiar la trazada de bajadas y curvas sin concentrar premios en el borde.';
  return r.proposed<r.current ? 'Espaciar los premios en los puntos clave; priorizar la lectura de los obstáculos.' : 'Repartir entre la ruta principal y pequeños desvíos seguros, evitando acumulaciones.';
}
if(rows.length!==200)throw new Error('Expected 200 stages');
for(let i=0;i<targets.length;i++) {
  const group=rows.slice(i*10,i*10+10),target=targets[i];
  if(target.length!==10||target.reduce((a,b)=>a+b,0)!==100)throw new Error(`Bad level ${i+1}`);
  group.forEach((r,j)=>{r.proposed=target[j];r.delta=r.proposed-r.current;r.reason=reason(r);if(/^Objetos/i.test(r.name)&&r.proposed<20)throw new Error('Rest stage under budget');});
}
const total=rows.reduce((s,r)=>s+r.current,0);
let md='# Propuesta de coleccionables · Mundos 1–5\n\n';
md+='Revisión de las 200 etapas oficiales del repositorio, cargadas mediante LevelLoader y sus actualizaciones vigentes. No se han modificado cantidades, niveles ni guardados del editor. Las personalizaciones guardadas únicamente en Chrome no se han podido contrastar: esta auditoría usa la versión oficial del proyecto, no un volcado de tu navegador.\n\n';
md+='## Criterio\n\n- **100 coleccionables por nivel completo** (10 etapas), no por etapa: 2.000 en los cinco mundos.\n- **Objetos: mínimo 20**, fáciles de recoger. Objetos19: 24 por su extensión.\n- Más premios en rutas largas y varias secciones; menos en pruebas compactas, de precisión, disparo o caída automática.\n- Cada 10 recogidos dan una vida con las reglas actuales: 100 disponibles equivalen a hasta 10 vidas extra por nivel si se recogen todos. Por eso el descanso concede al menos dos vidas y no conviene amontonar premios en las pruebas más peligrosas.\n- Son cantidades propuestas, pendientes de tu revisión y de probar su colocación. No certifican que todos los premios actuales sean alcanzables.\n- «100 disponibles» no garantiza 100 recogibles en una sola pasada. Tallarines ofrece rutas alternativas: reparto propuesto 4/5/7. Si quieres que el jugador pueda conseguir 100 en una pasada, habrá que definir cómo puntúan esas rutas antes de colocarlos.\n- Aplico el objetivo de 100 también al nivel de canoas y al de vehículos para comparar todo con la misma regla. Sus tramos largos quedarán deliberadamente menos densos; si la recogida pierde ritmo, convendría tratarlos como excepción.\n\n';
md+=`**Actual oficial: ${total}. Propuesta: 2.000. Diferencia: ${2000-total>=0?'+':''}${2000-total}.**\n\n## Resumen por nivel\n\n| Nivel | Nombre | Actual | Propuesta | Cambio |\n|---|---|---:|---:|---:|\n`;
for(let i=0;i<rows.length;i+=10){const g=rows.slice(i,i+10),r=g[0],n=g.reduce((s,r)=>s+r.current,0);md+=`| M${r.world}-N${r.level} | ${r.levelName} | ${n} | 100 | ${100-n>0?'+':''}${100-n} |\n`;}
for(let i=0;i<rows.length;i+=10) {
  const group=rows.slice(i,i+10),r=group[0];
  md+=`\n## M${r.world} · ${r.worldName} / N${r.level} · ${r.levelName}\n\n| Etapa | Nombre oficial | Actual | Propuesta | Cambio | Criterio de colocación |\n|---|---|---:|---:|---:|---|\n`;
  for(const r of group)md+=`| M${r.world}-N${r.level}-E${r.stage} | ${r.name} | ${r.current} | **${r.proposed}** | ${r.delta>0?'+':''}${r.delta} | ${r.reason} |\n`;
  md+=`| **Total** | | **${group.reduce((s,r)=>s+r.current,0)}** | **100** | | |\n`;
}
const quote=x=>'"'+String(x).replaceAll('"','""')+'"';
const csv=[['Etapa','Mundo','Nivel','Nombre','Actual','Propuesta','Cambio','Criterio'],...rows.map(r=>[`M${r.world}-N${r.level}-E${r.stage}`,r.worldName,r.levelName,r.name,r.current,r.proposed,r.delta,r.reason])].map(r=>r.map(quote).join(';')).join('\r\n');
writeFileSync('reports/coleccionables-mundos-1-5.md',md);
writeFileSync('reports/coleccionables-mundos-1-5.csv','\uFEFF'+csv+'\r\n');
console.log(`200 etapas; ${total} actuales -> 2000 propuestos; 20 niveles de 100; mínimo 20 en Objetos.`);
console.log(rows.filter(r=>r.stage===1).map((r,i)=>`M${r.world}-N${r.level} ${r.levelName}: ${targets[i].join(', ')}`).join('\n'));
