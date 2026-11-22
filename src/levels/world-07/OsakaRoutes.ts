import {nv,naraPath} from './NaraRoutes';
import type {Vector3Data} from '../LevelTypes';
export {nv as ov,naraPath as osakaPath};
export const OSAKA_REVISION='osaka-v1';
export const OSAKA_NAMES=['Takoyaki Stand','Glico Man','Correr7','Conveyor Sushi','Objetos27','Neon Canal','Ramen Shop','Universal Park','Ninja Trap','Osaka Castle'];
export const OSAKA_BUDGETS=[8,8,10,10,20,8,8,10,8,10] as const;
export const OSAKA_DECORATIONS=[['takoyaki_stall','Osaka · Puesto de takoyaki'],['glico','Osaka · Cartel del corredor Glico'],['sushi_belt','Osaka · Cinta de sushi'],['ramen_stall','Osaka · Puesto de ramen'],['building','Osaka · Edificio de neón'],['canal','Osaka · Canal nocturno'],['lantern','Osaka · Farol japonés'],['castle','Osaka · Castillo'],['pipe','Osaka · Tubería de parque'],['globe','Osaka · Globo de parque'],['arch','Osaka · Arco de neón'],['roller','Osaka · Rodillo giratorio'],['ninja_blade','Osaka · Trampa ninja'],['dome','Osaka · Cúpula transitable']] as const;
export function osakaArc(cx:number,cz:number,radius:number,start:number,turn:number,y0:number,y1=y0):Vector3Data[] {
  const count=Math.max(12,Math.ceil(Math.abs(turn)*radius/.6));
  return Array.from({length:count+1},(_,i)=>{const t=i/count,a=start+turn*t;return nv(cx+Math.cos(a)*radius,y0+(y1-y0)*t,cz+Math.sin(a)*radius);});
}
export function osakaBladePose(time:number,index:number):{height:number;angle:number;active:boolean} {
  const phase=((time+index*.73)%3.2+3.2)%3.2;
  // A readable raised pause, quick downward slash and a slower return.
  const cut=phase<1.35?0:phase<1.55?(phase-1.35)/.2:phase<1.95?1:1-(phase-1.95)/1.25;
  return {height:3.8-cut*3,angle:-.35+cut*.7,active:phase>=1.35&&phase<2.3};
}
export function osakaDomeHeight(radius:number,height:number,x:number,z:number):number {return height*Math.max(0,1-(x*x+z*z)/(radius*radius));}
