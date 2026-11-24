import publishedEditorStages from '../editor-saved/world-05.json';
import {registerStageSet} from '../StageRegistry';
import type { LevelData, Vector3Data } from "../LevelTypes";

import { AsturiasLayout, v } from "./AsturiasLayout";

function stage(number: number, name: string, spawn: Vector3Data, timeLimit: number, design: (layout: AsturiasLayout) => void): LevelData {
  const layout = new AsturiasLayout(number, 1);
  design(layout);
  return {
    id: `world-05-level-01-stage-${String(number).padStart(2, "0")}`,
    world: 5, level: 1, stage: number, name, spawn, timeLimit,
    theme: "emerald", musicTrack: number === 2 || number === 9 ? "arcade_rush" : "sky_waltz",
    objects: layout.objects
  };
}

const limestone = "#c7c4b7";
const asphalt = "#303840";

export const WORLD_05_LEVEL_01_STAGES: Record<number, LevelData> = {
  1: stage(1, "Cuadrado5", v(0, 1.15, 9), 65, l => {
    l.block("plaza", v(0, -0.4, 0), v(24, 0.8, 24), limestone, { theme: "pebbles" });
    l.block("plaza-inlay", v(0, 0.02, 0), v(5.5, 0.04, 5.5), "#aac2bb", { shape: "cylinder" });
    for (const x of [-11.8, 11.8]) l.block(`curb-${x}`, v(x, 0.15, 0), v(0.4, 0.3, 24), limestone);
    l.decor("cathedral", "cathedral", v(0, 0, -15), v(1.6, 1.6, 1.6));
    l.decor("fountain", "fountain", v(0, 0.04, 0));
    l.decor("city-sign", "sign", v(-8, 0, 9), v(1, 1, 1), { label: "OVIEDO · UVIÉU" });
    l.decor("sidreria", "sidreria", v(-9, 0, -8));
    l.decor("bronze", "bronze", v(8, 0, -7));
    l.decor("flag", "flag", v(9, 0, -10));
    for (const [index, x] of [-9, 9].entries()) {
      l.decor(`lamp-${index}`, "lamp", v(x, 0, 5));
      l.decor(`bench-${index}`, "bench", v(x, 0, 2), v(1, 1, 1), {}, x < 0 ? Math.PI / 2 : -Math.PI / 2);
      l.decor(`planter-${index}`, "apple_tree", v(x, 0, -2));
    }
    l.coins([v(-5, .55, 7), v(0, .55, 6), v(5, .55, 7), v(-5, .55, 2), v(5, .55, 2),
      v(-5, .55, -3), v(5, .55, -3), v(-4, .55, -7), v(4, .55, -7), v(0, .55, -8)]);
    l.goal(v(0, 0.1, -10));
  }),

  2: stage(2, "Bajada Autopista", v(0, 71.4, 4), 95, l => {
    const corners = [v(0, 70, 0), v(0, 51, -43), v(28, 33, -75), v(8, 15, -111), v(23, 0, -153)];
    l.block("salida", v(0, 69.75, 4), v(10, 0.5, 9), asphalt);
    for (let i = 0; i < corners.length - 1; i++) {
      const a = corners[i], b = corners[i + 1];
      l.route(`autopista-${i}`, a, b, 9.5, asphalt, 0.65);
      if (i > 0) l.block(`curva-pico-${i}`, v(a.x, a.y, a.z), v(9.5, 0.65, 9.5), asphalt);
      const length = Math.hypot(b.x - a.x, b.z - a.z);
      const right = v((a.z - b.z) / length, 0, (b.x - a.x) / length);
      for (let j = 1; j <= 4; j++) {
        const t = j / 5;
        const p = v(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
        l.decor(`linea-${i}-${j}`, "marking", v(p.x, p.y + 0.38, p.z), v(0.16, 1, 2.2),
          { pitch: -Math.atan2(b.y - a.y, length) }, Math.atan2(b.x - a.x, b.z - a.z));
        l.decor(`montana-${i}-${j}`, "peak", v(p.x + right.x * 11, p.y - 4, p.z + right.z * 11), v(9, 15 + j * 1.6, 10), { solid: true });
      }
      l.coins([v((a.x + b.x) / 2 - right.x * 1.3, (a.y + b.y) / 2 + 0.9, (a.z + b.z) / 2 - right.z * 1.3)]);
    }
    l.block("arcen-final", v(23, -0.1, -158), v(12, 0.8, 12), asphalt);
    l.goal(v(23, 0.4, -160));
  }),

  3: stage(3, "Picos", v(0, 1.1, 13), 90, l => {
    l.block("valle", v(0, -0.5, -22), v(24, 1, 78), "#728071", { theme: "asturias" });
    const gaps = [-6, 5, 0, -5, 6, 1, -5, 4];
    gaps.forEach((gap, row) => {
      const z = 6 - row * 8;
      for (let column = 0; column < 5; column++) {
        const x = (column - 2) * 5.2;
        if (Math.abs(x - gap) < 3) continue;
        l.decor(`pico-${row}-${column}`, "peak", v(x, -0.15, z), v(2.45, 4 + (row * 7 + column * 3) % 5, 2.75),
          { solid: true, stone: row + column }, column * 0.6);
      }
    });
    l.coins(gaps.map((x, i) => v(x, .65, 6 - i * 8)));
    l.goal(v(0, 0.12, -57));
  }),

  4: stage(4, "Aparcamiento", v(-3.5, 1.1, 10), 70, l => {
    l.block("carretera", v(-3.9, -.4, 0), v(8.2, .8, 30), asphalt);
    l.block("acera-lateral", v(7.25, -.4, 0), v(3.5, .8, 30), limestone);
    for (const z of [-10, 10]) l.block(`bahia-${z}`, v(2.85, -.4, z), v(5.3, .8, 10), asphalt);
    l.block("plaza-basculante", v(2.85, -.4, 0), v(5.3, .8, 10), "#505965", { asturiasAction: "hatch", asturiasFinish: "parking" });
    l.decor("coche", "car", v(2.85, 0, 0), v(1, 1, 1), { asturiasAction: "parking-car" });
    l.decor("indicaciones", "sign", v(6.9, 0, 4), v(1.15, 1.15, 1.15), { label: "P · ESPERA 10 s", caption: "QUÉDATE 5 s EN LA PLAZA" });
    l.decor("luz", "lamp", v(7, 0, -6));
    l.block("refugio", v(2.85, -6.65, 0), v(5.8, 1, 10.8), "#7b8d91");
    for (const z of [-5.55, 5.55]) {
      l.block(`refugio-frente-${z}`, v(2.85, -3.49, z), v(6.15, 5.35, .35), "#718285");
    }
    for (const x of [-.07, 5.77]) {
      l.block(`refugio-lateral-${x}`, v(x, -3.49, 0), v(.35, 5.35, 10.8), "#718285");
    }
    l.coins([v(-3.5,.6,6), v(-3.5,.6,1), v(-3.5,.6,-5), v(2.85,-5.5,2)]);
    l.goal(v(2.85, -6.05, -3));
  }),

  5: stage(5, "Objetos17", v(0, 1.15, 13), 75, l => {
    l.block("merendero", v(0,-.4,0), v(30,.8,30), "#709166", { theme: "asturias" });
    l.block("patio", v(0,.03,0), v(13,.06,17), "#c9baa1", { theme: "pebbles" });
    l.decor("horreo", "horreo", v(-10,0,-8), v(1.3,1.3,1.3));
    l.decor("sidra", "cider", v(9,0,3), v(1.45,1.45,1.45));
    l.decor("queso", "cheese", v(-8,0,3));
    l.decor("gaita", "bagpipe", v(9,0,-3));
    l.decor("pumar", "apple_tree", v(10,0,-9), v(1.3,1.3,1.3));
    l.decor("vaca", "cow", v(-10,0,10), v(1.3,1.3,1.3), {}, 0.55);
    l.decor("muro", "stone_wall", v(-12,0,-1), v(1.8,1,1), {}, Math.PI / 2);
    l.decor("carro", "cart", v(9,0,10), v(1.1,1.1,1.1));
    l.decor("escudo", "flag", v(5,0,-12));
    l.decor("banco", "bench", v(-5,0,-12));
    l.coins(Array.from({ length: 14 }, (_, i) => v(Math.sin(i * Math.PI / 7) * 7, .65, Math.cos(i * Math.PI / 7) * 10)));
    l.goal(v(0,.13,-12));
  }),

  6: stage(6, "Gijón", v(0,1.12,23), 95, l => {
    l.block("arena", v(0,-.5,9), v(27,1,36), "#e0be82");
    l.block("fondo-marino", v(0,-1.05,-27), v(30,.6,38), "#5d9a98");
    l.add("mar", "water", v(0,-.49,-27), v(30,.97,38), { color: "#2b9eb1", opacity: .72 });
    l.block("islote-meta", v(0,-.48,-42), v(5.5,1.2,6), "#bfa883", { shape: "cylinder" });
    l.route("subida-islote", v(0,-.97,-35), v(0,-.06,-40.2), 4.8, "#bfa883", .34);
    l.decor("entrada", "sign", v(-9,0,22), v(1,1,1), { label: "GIJÓN · XIXÓN", caption: "ESQUIVA LAS GAVIOTAS HASTA EL ISLOTE" });
    l.decor("sombrilla", "beach", v(10,0,15));
    l.decor("faro", "lighthouse", v(-16,-.5,-17), v(1.25,1.25,1.25));
    l.decor("boya-izquierda", "buoy", v(-7,0,-33));
    l.decor("boya-derecha", "buoy", v(7,0,-33));
    [16, 9, 2, -5, -15, -24, -34].forEach((z, i) => {
      l.decor(`gaviota-${i}`, "gull", v(0,i < 4 ? 2 : 1.48,z), v(1.25,1.25,1.25),
        { asturiasAction: "gull", phase: i * 1.7 });
    });
    l.coins([v(-7,.65,18),v(5,.65,14),v(-5,.65,9),v(6,.65,5),v(-4,.65,0),v(0,.65,-5),
      v(-3,.15,-13),v(3,.15,-21),v(0,.15,-30),v(0,.7,-39)]);
    l.goal(v(0,.18,-43));
  }),

  7: stage(7, "Alimerka", v(0,1.12,16.2), 150, l => {
    const grid = 7;
    const cell = 4.5;
    const edge = grid * cell / 2;
    l.block("suelo-super", v(0,-.4,0), v(34,.8,36), "#e7e5d6");
    l.decor("letrero", "sign", v(-5,0,17.1), v(1.3,1.3,1.3), { label: "ALIMERKA", caption: "ENCUENTRA LA SALIDA EN EL CENTRO", yellow: true });
    const visited = new Set<number>();
    const passages = new Set<string>();
    const connection = (a: number, b: number) => `${Math.min(a,b)}-${Math.max(a,b)}`;
    let seed = 7293;
    const walk = (id: number) => {
      visited.add(id);
      const col = id % grid, row = Math.floor(id / grid);
      const candidates = [col > 0 ? id - 1 : -1, row > 0 ? id - grid : -1,
        col < grid - 1 ? id + 1 : -1, row < grid - 1 ? id + grid : -1];
      for (let i = 3; i > 0; i--) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const j = seed % (i + 1);
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      }
      for (const next of candidates) {
        if (next < 0 || visited.has(next)) continue;
        passages.add(connection(id, next));
        walk(next);
      }
    };
    walk(45);
    const shelf = (name: string, x: number, z: number, yaw: number, length = cell + .24) =>
      l.decor(name, "shelf", v(x,0,z), v(length, 2, 1), { solid: true }, yaw);
    shelf("norte",0,-edge,0,grid*cell+.4);
    shelf("oeste",-edge,0,Math.PI/2,grid*cell+.4);
    shelf("este",edge,0,Math.PI/2,grid*cell+.4);
    shelf("sur-izquierda",-9,edge,0,13.9);
    shelf("sur-derecha",9,edge,0,13.9);
    for (let row = 0; row < grid; row++) {
      for (let col = 0; col < grid; col++) {
        const id = row * grid + col;
        const x = (col - 3) * cell, z = (row - 3) * cell;
        if (col < 6 && !passages.has(connection(id,id+1))) shelf(`e-${id}`,x+cell/2,z,Math.PI/2);
        if (row < 6 && !passages.has(connection(id,id+grid))) shelf(`s-${id}`,x,z+cell/2,0);
      }
    }
    l.coins([0,4,7,13,16,20,28,35,40,47].map(id => v((id%7-3)*cell,.6,(Math.floor(id/7)-3)*cell)));
    l.goal(v(0,.12,0));
  }),

  8: stage(8, "Tallarines", v(0,21.2,6), 100, l => {
    l.decor("sarten", "pan", v(0,18,2));
    l.block("zona-sarten", v(0,19.65,3), v(15,.7,15), "#d9a44b", { shape: "cylinder" });
    const path = [v(0,20,-3.8),v(-1,19,-9),v(-4.6,17.4,-14),v(-3.5,15.8,-20),v(1.2,14,-25),
      v(4.4,12.1,-29),v(4,10.4,-35),v(-.7,8.4,-41),v(-4,6.6,-46),v(-2,4.8,-52),v(1.5,2.7,-57),v(0,0.2,-63)];
    const left = [v(-4.6,20,-2.4),v(-7.5,18.8,-8),v(-11.2,17,-13),v(-13.3,15.3,-19),
      v(-10.5,13.5,-25),v(-14.5,11.5,-31),v(-12,9.7,-37),v(-15.3,7.8,-43),
      v(-11.6,5.9,-49),v(-12.8,4,-54),v(-9.6,2.25,-59),v(-6.7,.2,-63)];
    const right = [v(4.6,20,-2.4),v(7.3,18.6,-7),v(11,17.1,-11),v(13.8,15.7,-16),v(11.2,14,-21),
      v(15,12.4,-26),v(12.5,10.8,-31),v(15.2,9.2,-36),v(11.4,7.5,-41),v(14,5.8,-46),
      v(10.6,4.2,-51),v(12.3,2.6,-55),v(9.5,1.35,-59),v(6.8,.2,-63)];
    const routes = [
      { name: "centro", path, width: 1.62, color: "#edbf58", bonus: 0 },
      { name: "izquierda", path: left, width: 1.30, color: "#e8a653", bonus: 3 },
      { name: "derecha", path: right, width: 1.08, color: "#f2cc78", bonus: 5 }
    ];
    for (const route of routes) {
      const rewards: Vector3Data[] = [];
      for (let i = 1; i < route.path.length; i++) {
        const from = route.path[i - 1], to = route.path[i];
        l.route(`tallarin-${route.name}-${i}`, from, to, route.width, route.color, .42);
        l.block(`nudo-${route.name}-${i}`, to, v(route.width, .42, route.width), route.color, { shape: "cylinder" });
        rewards.push(v(to.x, to.y + .68, to.z));
        if (i <= route.bonus) rewards.push(v((from.x + to.x) / 2, (from.y + to.y) / 2 + .68, (from.z + to.z) / 2));
      }
      l.coins(rewards);
    }
    l.decor("queso-rallado", "cheese", v(-5,20,5), v(.8,.8,.8));
    l.block("plato-meta", v(0,-.3,-66), v(17,1,17), "#e2e5df", { shape: "cylinder" });
    l.goal(v(0,.25,-69));
  }),

  9: stage(9, "Mafalda", v(0,1.12,13), 80, l => {
    l.block("paseo",v(0,-.4,-18),v(8.5,.8,68),"#afac9d",{ theme: "pebbles" });
    l.decor("mafalda", "mafalda", v(6.45,-.15,-20), v(4.2,4.2,4.2), { asturiasAction: "mafalda" }, -Math.PI / 2);
    l.decor("aviso", "sign", v(3.25,0,12), v(.85,.85,.85), { label: "CAMPO SAN FRANCISCO", caption: "ESQUIVA LAS SACUDIDAS" });
    l.decor("banco", "bench", v(2.7,0,-47));
    l.decor("farola", "lamp", v(-3.5,0,-45));
    l.coins(Array.from({ length: 10 }, (_, i) => v(i%2 ? -1.7 : 1.7,.65,10-i*6)));
    l.goal(v(0,.12,-49));
  }),

  10: stage(10, "Cachopo", v(0,1.12,23), 150, l => {
    const cols = 5, rows = 19, cell = 4.4;
    const width = cols * cell, length = rows * cell, front = 16, back = front - length;
    const center = (front + back) / 2;
    const entry = (rows - 1) * cols + 2, exit = 2;
    const parent = new Map<number, number>([[entry, -1]]);
    let seed = 17;
    function carve(id: number): void {
      const col = id % cols, row = Math.floor(id / cols);
      const neighbors = [col > 0 ? id - 1 : -1, col < cols - 1 ? id + 1 : -1,
        row > 0 ? id - cols : -1, row < rows - 1 ? id + cols : -1];
      for (let i = 3; i > 0; i--) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const j = (seed >>> 16) % (i + 1);
        [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
      }
      for (const next of neighbors) {
        if (next < 0 || parent.has(next)) continue;
        parent.set(next, id);
        carve(next);
      }
    }
    carve(entry);
    const open = (a: number, b: number) => parent.get(a) === b || parent.get(b) === a;
    const tile = (id: number) => v((id % cols - 2) * cell, .68, back + (Math.floor(id / cols) + .5) * cell);
    const filling = (name: string, x: number, z: number, w: number, d: number, ham: boolean) =>
      l.block(name, v(x,1.36,z), v(w,2.72,d), ham ? "#c9717c" : "#f4bd50", { asturiasFinish: ham ? "ham" : "cheese" });

    l.decor("plato", "plate", v(0,-1.6,center), v(17,1,55));
    l.block("entrada",v(0,-.4,21),v(11,.8,10),"#e9e6d5");
    l.block("base-empanada",v(0,-.75,center),v(width+4,1.1,length),"#a95c29",{ asturiasFinish: "crumb" });
    l.block("suelo-queso",v(0,-.18,center),v(width+1,.36,length),"#f4be4a",{ asturiasFinish: "cheese" });
    for (const side of [-1,1]) {
      filling(`corte-lateral-${side}`, side * (width / 2 + .54), center, 1.8, length + .5, true);
      for (const end of [front,back]) {
        filling(`boca-${side}-${end}`, side * (width + cell) / 4, end, (width - cell) / 2, .76, true);
      }
    }
    for (let i=0; i<5; i++) {
      l.block(`tapa-${i}`,v(0,4.42,back+(i+.5)*length/5),v(width+3,1.5,length/5-1.5),
        "#bf7633",{ asturiasFinish: "crumb" });
    }
    for (let id=0; id<cols*rows; id++) {
      const point = tile(id);
      if (id%cols < cols-1 && !open(id,id+1)) {
        filling(`pliegue-e-${id}`,point.x+cell/2,point.z,.72,cell+.24,id%3!==0);
      }
      if (id+cols < cols*rows && !open(id,id+cols)) {
        filling(`pliegue-s-${id}`,point.x,point.z+cell/2,cell+.24,.72,id%3===0);
      }
    }
    const route: number[] = [];
    for (let id=exit; id>=0; id=parent.get(id) ?? -1) route.push(id);
    l.coins(route.filter((_,i) => i%4===0).map(tile));
    l.decor("cartel", "sign", v(4.5,0,20),v(.95,.95,.95),{ label: "CACHOPO", caption: "ENCUENTRA LA SALIDA ENTRE EL RELLENO" });
    l.block("salida",v(0,-.4,back-3.5),v(11,.8,7),"#eae7d9");
    l.goal(v(0,.12,back-4.5));
  })
};

// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('5_1_')) Object.assign(WORLD_05_LEVEL_01_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(5,1,WORLD_05_LEVEL_01_STAGES);

