import {Vector3} from "three";
export const OXFORD_REVISION="oxford-christmas-v2";
export const OXFORD_TRAIN_LENGTH=940;
export const OXFORD_BEAR_RATE=1.3*1.6;
export function milkRingSpeed(index:number):number {return (index%2 ? -1:1)*(1.3+index*.5);}
export const OXFORD_DECORATIONS=[['campus','Paisaje universitario'],['trail','Trail · Pasarela con huecos'],['railway','Tres vías de ferrocarril'],['pier','Pilar universitario'],['basket','Cesta de bicicleta'],['college','College de Oxford'],['radcliffe','Biblioteca circular'],['bridge','Puente universitario'],['station','Estación de Oxford'],['train','Tren interurbano'],['buzz','BuzzBallz'],['magnet','Imán de souvenir'],['pub','The Bear Inn 1242'],['bear','Oso tabernero'],['table','Mesa basculante'],['milk_ring','Franja de batido'],['cup','Vaso Moo-Moos'],['straw','Pajita lanzadora'],['hall','Great Hall'],['ties','Corbatas del pub'],['shop','Souvenir Shop'],['bicycle','Bicicleta de paseo']] as const;
export function oxfordTrainZ(time:number):number {
  // Leave immediately, ease into the station, then wait for the player.
  const t=Math.min(29,Math.max(0,time));
  return -70-(OXFORD_TRAIN_LENGTH-70)*(1-Math.pow(1-t/29,1.15));
}
export function buzzPosition(time:number,index:number):Vector3 {
  if(index===0) return new Vector3(0,7,0);
  const a=(index===2 ? 0:Math.PI/2)+time*.32,radius=index===1 ? 12:24;
  return new Vector3(0,7+Math.sin(a)*radius,Math.cos(a)*radius);
}
export function oxfordMagnetY(time:number,index:number):number {
  const cycle=2.5+(index%5)*.37,phase=time*(1+.15*Math.sin(time*.43+index))+index*.87;
  const t=((phase%cycle)+cycle)%cycle/cycle;
  return .8+6.5*Math.pow((Math.cos(t*Math.PI*2)+1)/2,.55);
}
export function universityRoute():Vector3[] {
  return Array.from({length:241},(_,i)=>{
    const t=i/240,envelope=Math.sin(Math.PI*t);
    return new Vector3(Math.sin(t*Math.PI*3)*12*envelope,12+Math.sin(t*Math.PI*5)*3.4*envelope,22-220*t);
  });
}
export const TRAIL_HOLES=[{z:-8,length:16,x:-.8,width:2.8,sideHoles:false},{z:-36,length:20,x:.9,width:3,sideHoles:false},{z:-65,length:14,x:0,width:2.6,sideHoles:true},{z:-94,length:22,x:1,width:3.2,sideHoles:false},{z:-123,length:16,x:-1,width:2.8,sideHoles:false},{z:-150,length:18,x:0,width:3.1,sideHoles:true}];
export function trailHeight(z:number,x=0):number {const t=(18-z)/180;return 12+Math.sin(t*Math.PI*6)*.9+x/4*Math.sin(t*Math.PI*5+.4)*1.35;}
export function trailHalfWidth(z:number):number {return 4.1+Math.sin((24-z)*.08)*.3;}
export function trailHoleAt(z:number) {return TRAIL_HOLES.find(h=>Math.abs(z-h.z)<h.length/2);}
export function trailHole(z:number,x=0):boolean {const h=trailHoleAt(z);return !!h&&(h.sideHoles ? Math.abs(x)>h.width/2&&Math.abs(x)<trailHalfWidth(z):Math.abs(x-h.x)<h.width/2);}
export function strawPose(time:number) {return {x:Math.sin(time*3.3)*3.1,tilt:Math.sin(time*3.3)*.4};}
