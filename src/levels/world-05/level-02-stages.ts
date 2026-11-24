import publishedEditorStages from '../editor-saved/world-05.json';
import {registerStageSet} from '../StageRegistry';
import { CatmullRomCurve3, Vector3 } from "three";
import type { LevelData, Vector3Data } from "../LevelTypes";
import { AsturiasLayout, v } from "./AsturiasLayout";

const origin = v(0, 0, 0);
const unit = v(1, 1, 1);
const stone = "#a4a091";
const grass = "#658449";
const pathColor = "#a49170";

function stage(number: number, name: string, spawn: Vector3Data, timeLimit: number, build: (layout: AsturiasLayout) => void): LevelData {
  const layout = new AsturiasLayout(number, 2);
  build(layout);
  return {
    id: `world-05-level-02-stage-${String(number).padStart(2, "0")}`,
    world: 5, level: 2, stage: number, name, spawn, timeLimit,
    theme: "emerald", musicTrack: [1, 2, 3, 4, 8, 9].includes(number) ? "arcade_rush" : "sky_waltz",
    objects: layout.objects
  };
}

function track(l: AsturiasLayout, id: string, points: Vector3Data[], width: number, style: string, options: Record<string, unknown> = {}) {
  l.decor(id, "cangas_track", origin, unit, { points, width, style, hasCollision: true, ...options });
}

function spline(points: Vector3Data[], segments: number): Vector3Data[] {
  return new CatmullRomCurve3(points.map(p => new Vector3(p.x, p.y, p.z))).getPoints(segments);
}

const raised = (p: Vector3Data, y = .62) => v(p.x, p.y + y, p.z);

export const WORLD_05_LEVEL_02_STAGES: Record<number, LevelData> = {
  1: stage(1, "Giros Inesperados", v(-2, 63.12, 10), 105, l => {
    const points = [v(-2,62,12), v(-2,62,5)];
    for (let i = 0; i <= 125; i++) {
      const t = i / 125;
      points.push(v(-2 + Math.sin(t * 5 * Math.PI) * 14, 62 - t * 61, 1 - t * 185));
    }
    points.push(v(-3,.7,-192), v(-3,.7,-202));
    track(l, "carretera", points, 10.2, "road");
    for (let i = 8; i <= 120; i += 8) {
      const p = points[i], next = points[i + 1];
      const dx = next.x - p.x, dz = next.z - p.z, mag = Math.hypot(dx,dz);
      for (const side of [-1, 1]) {
        const x = p.x - side * dz / mag * 13;
        const z = p.z + side * dx / mag * 13;
        l.decor(`pico-${i}-${side}`, "peak", v(x,p.y-5,z), v(6.4,10+i%7,7.5), { hasCollision: true, stone: i });
      }
    }
    l.decor("cartel", "sign", v(-5.2,62,6), unit, { label: "GIROS INESPERADOS", caption: "CINCO CURVAS ENTRE PICOS" });
    l.coins(points.filter((_,i) => i > 6 && i < 126 && i % 10 === 0).map(p => raised(p)));
    l.goal(v(-3,.77,-198.5));
  }),

  2: stage(2, "Salto5", v(0,1.12,31), 80, l => {
    for (let i = 0; i < 4; i++) {
      const z = 16 - i * 24;
      const height = i * 1.55;
      const width = 7.2 + i * .7;
      track(l, `pista-${i}`, [v(0,height+.2,z+17.8),v(0,height,z+12),v(0,height,z+5),v(0,height+2.3,z-.35)], width, "jump");
      l.decor(`impulsor-${i}`, "cangas_jump_pad", v(0,height+2.12,z+.15), v(width-.32,1,1),
        { cangasAction: "launch", padWidth: width, velocity: 14.5 + i*.2, launchY:9.2, pitch: .406 }, 0);
      l.decor(`puerta-${i}`, "flag", v(-width/2+.5,height,z+9), v(.7,.7,.7));
      l.coins([v(0,height+.65,z+10),v(0,height+2.35,z),v(0,height+3.25,z-4.7)]);
    }
    track(l,"aterrizaje",[v(0,6.55,-63.8),v(0,6.2,-69),v(0,6.2,-83)],11.2,"jump",{ rails: true });
    l.block("tope",v(0,6.9,-82.4),v(11.2,1.4,.6),"#324940");
    l.decor("aviso", "sign", v(3,0,28), v(.75,.75,.75), { label: "SALTO 5", caption: "CUATRO RAMPAS DE IMPULSO" });
    l.goal(v(0,6.28,-78));
  }),

  3: stage(3, "Aire Acondicionado", v(0,1.12,13), 80, l => {
    l.block("pasarela",v(0,-.42,-22),v(11,.84,76),"#55727a");
    l.decor("equipo", "cangas_aircon", v(7.2,0,-19), unit);
    [2,-12,-26,-40].forEach((z,i) => {
      l.decor(`chorro-${i+1}`,"cangas_air_jet",v(6,1.0,z),unit,{
        cangasAction:"wind", phase:i*.82, windTime:i===2 ? 4 : 1.35, windCycle:i===2 ? 6 : 4.2, windStrength:46
      });
      l.coins([v(i%2 ? -2.7:2.7,.63,z-4.2)]);
    });
    l.decor("aviso","sign",v(3.2,0,11),v(.85,.85,.85),{label:"AIRE ACONDICIONADO",caption:"CRUZA ENTRE RÁFAGAS"});
    l.coins([v(0,.62,8),v(0,.62,-48),v(-1.5,.62,-52)]);
    l.goal(v(0,.08,-56));
  }),

  4: stage(4, "Imanes", v(0,1.12,14), 95, l => {
    l.block("frigorifico",v(0,-.4,-22),v(5.4,.8,78),"#c8d5d0");
    for (let i = 0; i < 8; i++) {
      const x = [-.35,.35,0,.35,-.35,0,-.35,.35][i];
      const z = 5 - i * 7.9;
      const rhythms=[
        [4.7,.82,.64,.88,0],[4.13,.58,.43,1.1,.14],[3.47,.37,.29,.61,.27],[2.81,.28,.48,.39,.34],
        [3.19,.31,.22,.51,.38],[3.73,.44,.38,.68,.31],[4.39,.66,.53,.72,.19],[5.03,.91,.72,.96,.08]
      ][i];
      const [cycle,descent,hold,ascent,irregularity]=rhythms;
      l.decor(`iman-${i+1}`,"cangas_magnet",v(x,5.1,z),v(2.7,1,1.35),{
        cangasAction:"magnet",phase:i*.69,badge:i%4,side:i%2 ? 1 : -1,cycle,descent,hold,ascent,irregularity
      });
      l.decor(`marca-${i+1}`,"cangas_magnet_zone",v(x,.025,z),v(2.35,1,1.35));
      l.coins([v(x > 0 ? -1.4 : 1.4,.64,z)]);
    }
    l.decor("aviso","sign",v(0,0,17.2),v(.92,.92,.92),{label:"IMANES DE ASTURIAS",caption:"ESPERA A QUE SUBAN PARA CRUZAR"});
    l.coins([v(0,.6,10),v(0,.6,-55)]);
    l.goal(v(0,.1,-58));
  }),

  5: stage(5, "Objetos18", v(0,1.12,14), 80, l => {
    l.block("plaza-del-sella",v(0,-.4,0),v(33,.8,33),stone,{theme:"pebbles"});
    l.block("jardin-central",v(0,.05,0),v(9,.1,9),grass,{theme:"asturias",shape:"cylinder"});
    l.decor("ermita","cangas_chapel",v(0,0,-13));
    l.decor("cruz","cangas_cross",v(0,.15,0),v(.95,.95,.95));
    l.decor("dolmen","cangas_dolmen",v(-10,0,-4));
    l.decor("piragua","cangas_kayak",v(9,0,8),v(1.3,1.3,1.3),{},.7);
    l.decor("horreo","horreo",v(-11,0,8));
    l.decor("sidra","cider",v(10,0,1));
    l.decor("gaita","bagpipe",v(10,0,-5));
    l.decor("pumar","apple_tree",v(-11,0,-11));
    l.decor("bandera","flag",v(10,0,-11));
    l.decor("banco","bench",v(5,0,-7),unit,{},Math.PI/2);
    l.decor("faro-de-plaza","lamp",v(-7,0,9));
    l.decor("cartel","sign",v(-7,0,13),unit,{label:"CANGAS DE ONÍS",caption:"DEL SELLA A LA SANTA CRUZ"});
    l.coins(Array.from({length:14},(_,i)=>v(Math.sin(i*Math.PI/7)*7.4,.65,Math.cos(i*Math.PI/7)*11)));
    l.goal(v(0,.1,-10));
  }),

  6: stage(6, "Helado2", v(0,1.12,15), 100, l => {
    l.block("terraza",v(0,-.4,13.4),v(8,.8,10),"#d7c8aa");
    l.add("cucurucho","platform",origin,v(11,22,11),{
      variant:"stracciatella_cone",coneHeight:12,scoopRadius:5.1,cangasAction:"icecream",rotationSpeed:.48,hasCollision:true
    });
    const points: Vector3Data[] = [v(0,0,13),v(0,.1,10.2)];
    for (let i=0;i<=112;i++) {
      const t=i/112, angle=t*4*Math.PI;
      const radius=9.1-t*1.9;
      points.push(v(Math.sin(angle)*radius,.32+t*21.2,Math.cos(angle)*radius));
    }
    points.push(v(-.22,21.85,5.2),v(0,22.12,2.35),v(0,22.12,0));
    track(l,"espiral-cremosa",points,3.45,"ice",{rails:false});
    l.block("guinda-meta",v(0,21.95,0),v(4.3,.34,4.3),"#bd3044",{shape:"cylinder"});
    l.decor("cartel","sign",v(-3.5,0,15),v(.78,.78,.78),{label:"HELADO 2",caption:"SUBE HASTA LA GUINDA"});
    l.coins(points.filter((_,i)=>i>4 && i%9===0).map(p=>raised(p)));
    l.goal(v(0,22.2,-.65));
  }),

  7: stage(7, "Sendero", v(0,27.12,14), 100, l => {
    const points=spline([v(0,26,16),v(0,26,8),v(-5,24,-2),v(-13,24,-11),v(-12,20,-25),v(-4,17,-35),
      v(6,16,-37),v(13,12,-48),v(11,10,-59),v(2,7,-65),v(-6,5,-74),v(-4,4,-87),v(0,3,-96)],108);
    track(l,"sendero",points,2.325,"trail",{taper:true});
    for (let i=9;i<points.length-5;i+=8) {
      const p=points[i], n=points[i+1], dx=n.x-p.x, dz=n.z-p.z, mag=Math.hypot(dx,dz);
      const side=i%3===0 ? -1:1;
      l.decor(`riscos-${i}`,"peak",v(p.x-side*dz/mag*7,p.y-5,p.z+side*dx/mag*7),v(4.7,9+i%5,5.2),{hasCollision:true,stone:i});
    }
    l.block("mirador",v(0,2.69,-98.5),v(8,.62,7),pathColor);
    l.decor("hito","stone_wall",v(2.9,3,-100),v(.8,.8,.8),{},Math.PI/2);
    l.coins(points.filter((_,i)=>i>5&&i%8===0).map(p=>raised(p)));
    l.goal(v(0,3.08,-100.5));
  }),

  8: stage(8, "Hórreo", v(0,39.12,21), 115, l => {
    l.block("acceso",v(0,37.65,18.9),v(10,.7,11.8),pathColor);
    l.decor("horreo","cangas_open_horreo",v(0,33.8,9.5),v(3.1,1.68,2.7));
    l.block("altillo",v(0,37.65,9.5),v(11,.7,7.3),"#88634a",
      { platformShape:"hollow_rect",holeWidth:4.2,holeDepth:3.5 });
    const points: Vector3Data[] = [];
    for (let i=0;i<=125;i++) {
      const t=i/125, angle=t*5*Math.PI;
      points.push(v(Math.sin(angle)*9.5,34.2-t*33.4,Math.cos(angle)*9.5));
    }
    points.push(v(-2,.62,-9.5),v(-5,.46,-9.5),v(-9,.46,-9.5));
    track(l,"tuberia",points,7.6,"pipe",{holes:[16,33,51,68,86,105,116]});
    l.block("llegada",v(-10,.1,-9.5),v(7,.72,8),"#a6a694");
    l.decor("cartel","sign",v(3.2,38,20),v(.82,.82,.82),{label:"HÓRREO",caption:"BAJA POR EL HUECO Y ESQUIVA LOS CORTES"});
    l.coins(points.filter((_,i)=>i>5&&i%10===0).map(p=>raised(p)));
    l.goal(v(-12,.55,-9.5));
  }),

  9: stage(9, "Fabada", v(0,2.12,26.5), 115, l => {
    l.block("tabla-de-salida",v(0,.6,24.5),v(9,.8,9.5),"#8e684e");
    l.decor("fabada","cangas_fabada",origin,unit,{cangasAction:"fabada",hasCollision:true});
    l.add("miel-superior","honey",v(0,-.12,0),v(39.8,.32,39.8),{
      shape:"cylinder",passable:true,hasCollision:false,dragFactor:.3,surfaceOpacity:.55,bodyOpacity:.26
    });
    l.decor("cartel","sign",v(-3.1,1,27),v(.83,.83,.83),{label:"FABADA",caption:"BAJA AL PLATO Y ALCANZA LA META GIRATORIA"});
    l.coins([v(0,-1.7,18),v(0,-3.5,14),v(-4,-3.5,10),v(-8,-3.5,6),v(-6,-3.5,0),
      v(0,-3.5,-4),v(5,-3.5,-8),v(10,-3.5,-7),v(13,-3.5,-4)]);
    l.add("goal","goal",v(13.5,-4.1,-3),unit,{cangasAction:"fabadaGoal"},v(0,Math.PI/2,0));
  }),

  10: stage(10, "Puente", v(43,12.92,72), 125, l => {
    const bridgeYaw=Math.PI/2, bridgeZ=-10;
    const islands=[v(43,11.8,70),v(38,11,57),v(43,10.3,44),v(36,9.6,31),v(39,9,18),v(32,9,5)];
    islands.forEach((p,i)=>{
      const hollow=i===1||i===3;
      l.block(`aproximacion-${i}`,v(p.x,p.y-.4,p.z),v(8.6,.8,8.6),stone,
        hollow ? {platformShape:"hollow_rect",holeWidth:2,holeDepth:2,theme:"pebbles"} : {theme:"pebbles"});
      if(i===islands.length-1) return;
      const next=islands[i+1], dx=next.x-p.x, dz=next.z-p.z, length=Math.hypot(dx,dz);
      const nx=dx/length,nz=dz/length,yaw=Math.atan2(-nx,-nz);
      const launch=v(p.x+nx*3.45,p.y+.65,p.z+nz*3.45);
      track(l,`trampolin-${i}`,[v(p.x+nx*1.45,p.y,p.z+nz*1.45),launch],3.8,"jump");
      l.decor(`salto-aproximacion-${i}`,"cangas_jump_pad",raised(launch,.035),v(3.7,1,1),{
        cangasAction:"launch",padWidth:3.8,padDepth:.6,launchX:nx*11.4,launchZ:nz*11.4,launchY:8.1,pitch:.315
      },yaw);
      l.coins([v(p.x-1.9,p.y+.65,p.z+1.1),raised(launch)]);
    });
    track(l,"enlace-puente",[v(32,9,5),v(32,9,-10),v(29,9,-10)],5.2,"trail");
    l.decor("cartel-inicio","sign",v(46,11.8,73),v(.84,.84,.84),{label:"HACIA EL PUENTE",caption:"ISLAS · HUECOS · CINCO SALTOS"});
    l.add("sella","water",v(0,-1.05,-10),v(42,.8,92),{passable:true,hasCollision:false});
    l.block("orilla-entrada",v(32,8.55,-10),v(13,.9,18),grass,{theme:"asturias"});
    l.block("orilla-salida",v(-32,8.55,-10),v(13,.9,18),grass,{theme:"asturias"});
    const points=Array.from({length:57},(_,i)=>{
      const z=29-i*58/56;
      return v(z,9+7.25*(1-Math.pow(Math.abs(z)/29,1.55)),bridgeZ);
    });
    track(l,"tablero-adoquin",points,7.2,"bridge",{rails:true});
    l.decor("arcos","cangas_bridge",v(0,0,bridgeZ),unit,{},bridgeYaw);
    l.decor("cruz-de-la-victoria","cangas_cross",v(0,3.25,bridgeZ-4.1),v(1.75,1.75,1.75),{},Math.PI);
    l.decor("cartel","sign",v(33,9,-16),unit,{label:"PUENTE ROMANO",caption:"CANGAS DE ONÍS · RÍO SELLA"},Math.PI/2);
    for (const x of [-32,32]) {
      l.decor(`pumar-${x}`,"apple_tree",v(x,9,-16.8));
      l.decor(`faro-${x}`,"lamp",v(x,9,-5.2));
    }
    l.coins(points.filter((_,i)=>i%5===2).map(p=>raised(p)));
    l.add("goal","goal",v(-35,9.1,bridgeZ),unit,{},v(0,Math.PI/2,0));
  })
};

// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('5_2_')) Object.assign(WORLD_05_LEVEL_02_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(5,2,WORLD_05_LEVEL_02_STAGES);

