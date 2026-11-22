import { CatmullRomCurve3, Vector3 } from 'three';
import type { Vector3Data } from '../LevelTypes';
import type { KyotoRoute } from './KyotoRoutes';

export const NARA_REVISION = 'nara-v1';
export const NARA_CHALLENGE_REVISION = 'nara-challenges-v4';
export const NARA_STATION_REVISION = 'station-collision-rails-v1';
export const NARA_NAMES = ['Train to Nara', 'Salto7', 'Bowing Deer', 'Deer Crackers', 'Objetos26', 'Giant Lanterns', 'Mochi Pounding', 'Pagoda Climb', 'Koi Pond', 'Great Buddha'];
export const NARA_BUDGETS = [6, 10, 10, 10, 20, 10, 8, 8, 8, 10] as const;
export const NARA_DOOR_TIME = .65;
export const NARA_TRAIN_ARRIVAL = NARA_DOOR_TIME + 3;
export const NARA_TRAIN_RELEASE = NARA_TRAIN_ARRIVAL + NARA_DOOR_TIME;
export function naraDoorOpen(clock:number):number {
  const ease=(t:number)=>{const x=Math.max(0,Math.min(1,t));return x*x*(3-2*x);};
  if(clock<0)return 1;
  if(clock<NARA_DOOR_TIME)return 1-ease(clock/NARA_DOOR_TIME);
  return ease((clock-NARA_TRAIN_ARRIVAL)/NARA_DOOR_TIME);
}
export const NARA_DECORATIONS = [
  ['deer', 'Nara · Ciervo que hace reverencias'], ['cracker', 'Nara · Galleta shika senbei'],
  ['lantern_field', 'Nara · Jardín de farolillos de Kasuga'], ['mochi', 'Nara · Ceremonia del mochi'],
  ['pagoda', 'Nara · Pagoda de madera'], ['buddha', 'Nara · Gran Buda de bronce'],
  ['pond', 'Nara · Estanque de carpas koi'], ['train', 'Nara · Tren bala'],
  ['station', 'Nara · Estación'], ['bell', 'Nara · Campana de templo'],
  ['tracks', 'Nara · Vías del tren bala'],
  ['seesaw', 'Nara · Puente balancín'], ['rotor', 'Nara · Barrera giratoria'],
  ['jump_pad', 'Nara · Rampa de salto'], ['bowl', 'Nara · Cuenco de piedra'],
] as const;
export const nv = (x: number, y: number, z: number): Vector3Data => ({ x, y, z });

export function naraPath(nodes: Vector3Data[], width = 4, curved = true): KyotoRoute {
  const curve = new CatmullRomCurve3(nodes.map(p => new Vector3(p.x, p.y, p.z)), false, 'centripetal');
  const points: Vector3Data[] = [];
  if (curved) {
    const samples = Math.max(12, Math.ceil(curve.getLength() / .65));
    for (const p of curve.getSpacedPoints(samples)) points.push(nv(p.x, p.y, p.z));
  } else {
    for (let k = 1; k < nodes.length; k++) {
      const a = nodes[k - 1], b = nodes[k], count = Math.max(1, Math.ceil(Math.hypot(b.x-a.x, b.y-a.y, b.z-a.z) / .65));
      for (let j = k === 1 ? 0 : 1; j <= count; j++) points.push(nv(a.x+(b.x-a.x)*j/count, a.y+(b.y-a.y)*j/count, a.z+(b.z-a.z)*j/count));
    }
  }
  return { points, widths: points.map(() => width), banks: points.map(() => 0) };
}

/** Three seconds, including acceleration and braking; no accumulated movement error. */
export function naraTrainPose(seconds: number): { z: number; speed: number; arrived: boolean } {
  const t = Math.max(0, Math.min(1, seconds / 3));
  return { z: -240 * (.5 - .5 * Math.cos(Math.PI * t)), speed: seconds > 0 && seconds < 3 ? -40 * Math.PI * Math.sin(Math.PI*t) : 0, arrived: seconds >= 3 };
}

export function naraSweep(time: number, index: number): number {
  return index === 2 ? Math.sin(time * 1.25) * .9 : time * (index % 2 ? -.95 : .8) + index * 1.8;
}

export function bowlHeight(radius: number, depth: number, x: number, z: number): number {
  const t = Math.min(1, Math.hypot(x, z) / radius);
  return -depth * (1 - t*t);
}

/** Alternating elevators: neighbours always travel in opposite directions. */
export function naraFloatHeight(time:number,index:number):number {return Math.sin(time*3.4)*(index%2===0?1:-1)*1.65;}
