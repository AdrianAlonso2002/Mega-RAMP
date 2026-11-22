export {nv as tv,naraPath as tokyoPath} from './NaraRoutes';
export const TOKYO_REVISION='tokyo-v1';
export const TOKYO_POLISH_REVISION='tokyo-crossing-pinball-v2';
export const TOKYO_MACHINE_REVISION='tokyo-steep-pinball-edge-claw-v3';
export const PINBALL_SLOPE=1.15;
export const pinballHeight=(z:number)=>16+(12-z)*PINBALL_SLOPE;
export const CLAW_TRAVEL_LIMIT=10.95;
export const TOKYO_ARCADE_REVISION='tokyo-routes-folding-v4';
export const TOKYO_ACTION_REVISION='tokyo-chain-drift-kaiju-v5';
export const TOKYO_FUTURE_REVISION='tokyo-neon-pulses-v6';
export function tokyoPulsePose(time:number,index=0){const phase=((time+index*.61)%4.6+4.6)%4.6,active=phase>=1&&phase<2.3;return {active,radius:active?.8+(phase-1)/1.3*4.2:.8,charge:phase<1?phase:active?1:0,opacity:active?1-(phase-1)/1.3:0};}
export const CHAIN_DELAY=.46;
export function tokyoChainPeriod(count:number){return count*CHAIN_DELAY+4.96;}
export function tokyoChainAngle(time:number,index:number,count:number,offset=0){
 const period=tokyoChainPeriod(count),t=((time-offset-index*CHAIN_DELAY)%period+period)%period;
 const smooth=(u:number)=>u*u*(3-2*u);
 if(t<1.8)return (1-smooth(t/1.8))*Math.PI/2;
 if(t<2.8)return 0;
 if(t<2.96)return smooth((t-2.8)/.16)*Math.PI/2;
 return Math.PI/2;
}
export function tokyoKaijuPose(time:number){
 const t=((time%15)+15)%15,smooth=(a:number,b:number)=>{const u=Math.max(0,Math.min(1,(t-a)/(b-a)));return u*u*(3-2*u);};
 const charge=smooth(6,8.5)*(1-smooth(10.7,13)),blast=smooth(8.5,8.7)*(1-smooth(10.4,10.7));
 return {charge,blast,pitch:charge*1.35};
}
export const tokyoGateSpeed=(index:number)=>[.42,1.35,.7,1.95,.55,1.65,.95][index%7];
/** A usable crossing window, a smooth lift, a vertical pause and a smooth return. */
export function tokyoFoldAngle(time:number,phase=0):number {
 const t=((time+phase)%9.2+9.2)%9.2;
 const u=t<5.4?0:t<6.4?t-5.4:t<8.2?1:1-(t-8.2);
 const eased=u*u*(3-2*u);return eased*Math.PI/2;
}
/** Alternating travel and genuine red pauses; neighbouring lanes start at different phases. */
export function tokyoPedestrianPose(time:number,index:number){
 const phase=((time+index*.31)%4+4)%4,returning=phase>=2,t=phase%2,walking=t<1.35,u=Math.min(1,t/1.35),ease=u*u*(3-2*u),direction=returning?-1:1;
 return {x:(returning?1:-1)*(4.6-9.2*ease),walking,direction,speed:walking?direction*9.2*6*u*(1-u)/1.35:0};
}
export function tokyoFlipperAngle(time:number,side:number){const t=((time%1.8)+1.8)%1.8,swing=t<.7?0:t<.88?(t-.7)/.18:t<1.06?1:1-(t-1.06)/.74;return side*(.22-.74*swing);}
export const TOKYO_NAMES=['Shibuya Crossing','Claw Machine','Pachinko Pinball','Muro7','Objetos28','Vending Machines','Capsule Hotel','Tokyo Drift','Godzilla Attack','Mount Fuji / Tokyo Tower'];
export const TOKYO_BUDGETS=[8,8,10,8,20,8,10,8,8,12] as const;
export const TOKYO_DECORATIONS=[['pulse_emitter','Tokio · Emisor de ondas de choque'],['building','Tokio · Rascacielos luminoso'],['vending','Tokio · Máquina expendedora'],['capsules','Tokio · Hotel cápsula'],['billboard','Tokio · Pantalla de Akihabara'],['signal','Tokio · Semáforo'],['stripe','Tokio · Paso de cebra móvil'],['pedestrian','Tokio · Peatón'],['cabinet','Tokio · Máquina de gancho'],['claw','Tokio · Gancho automático'],['flipper','Tokio · Paleta de pinball'],['tile','Tokio · Puente articulado'],['car','Tokio · Coche de drift'],['godzilla','Tokio · Monstruo de Shinjuku'],['tower','Tokio · Torre de Tokio'],['fuji','Tokio · Monte Fuji']] as const;
export function clawCycle(time:number){const t=((time%8)+8)%8;return {phase:t,depth:t<2?t/2:t<2.6?1:t<4.6?1-(t-2.6)/2:0,closed:t>=2&&t<6};}
