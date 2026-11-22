import {describe,expect,it} from 'vitest';
import {WORLD_CURIOSITIES,LEVEL_CURIOSITIES,SKIN_LOADING_TIP,GENERIC_LOADING_TIP,getLoadingTips,LoadingTipPicker} from '../src/ui/LoadingTips';
describe('Loading curiosities',()=>{
 it('has five real-place facts for every world and level, including the completed owner-supplied locations',()=>{
  expect(Object.keys(WORLD_CURIOSITIES)).toHaveLength(8);expect(Object.keys(LEVEL_CURIOSITIES)).toHaveLength(32);
  for(let w=1;w<=8;w++)for(let l=1;l<=4;l++){
   expect(WORLD_CURIOSITIES[w]).toHaveLength(5);expect(new Set(WORLD_CURIOSITIES[w]).size).toBe(5);
   const key=`${w}_${l}`,count=5;
   expect(LEVEL_CURIOSITIES[key]).toHaveLength(count);expect(new Set(LEVEL_CURIOSITIES[key]).size).toBe(count);
   const tips=getLoadingTips(w,l);expect(tips).toHaveLength(7+count);expect(new Set(tips).size).toBe(7+count);expect(tips).toContain(SKIN_LOADING_TIP);expect(tips).toContain(GENERIC_LOADING_TIP);
   for(const tip of tips){expect(tip.length).toBeLessThan(230);expect(tip).not.toMatch(/[<>]/);}
  }
 });
 it('never fills missing place facts with stage descriptions, and retains the owner’s street observations',()=>{
  const facts=[...Object.values(WORLD_CURIOSITIES).flat(),...Object.values(LEVEL_CURIOSITIES).flat()];
  for(const fact of facts)expect(fact).not.toMatch(/Mega RAMP|Cuadrado\d|Muro\d|en este nivel|este nivel|del juego|plataforma|obstáculo|el personaje|la bola|para rodar/i);
  expect(LEVEL_CURIOSITIES['1_1']).toEqual([
   'Calle Río Tajo es una calle tranquila de Villamanta.',
   'En Calle Río Tajo es habitual ver gorriones.',
   'Durante las fiestas, los toros pasan por Calle Río Tajo.',
   'La plaza de toros de Villamanta está cerca de Calle Río Tajo.',
   'El Arroyo Grande pasa cerca de Calle Río Tajo.'
  ]);
  expect(LEVEL_CURIOSITIES['3_1']).toHaveLength(5);
  expect(getLoadingTips(3,1)).toEqual([...WORLD_CURIOSITIES[3],...LEVEL_CURIOSITIES['3_1'],SKIN_LOADING_TIP,GENERIC_LOADING_TIP]);
 });
 it('uses the supplied local details only for their corresponding places',()=>{
  expect(LEVEL_CURIOSITIES['1_3']).toContain('El polideportivo de Villamanta fue arrasado por la DANA.');
  expect(LEVEL_CURIOSITIES['2_1'].join(' ')).toMatch(/novena planta/);expect(LEVEL_CURIOSITIES['2_1'].join(' ')).toMatch(/calle Arpón/);
  expect(LEVEL_CURIOSITIES['2_4']).toContain('En La Fontana se encuentra la pizzería Popeyes.');
  expect(LEVEL_CURIOSITIES['3_2']).toContain('En La Era se celebra la Carbochá.');
  expect(LEVEL_CURIOSITIES['4_1'].join(' ')).toMatch(/Adri.*Misi/);expect(LEVEL_CURIOSITIES['4_2'].join(' ')).toMatch(/Rony.*Pao/);
  expect(getLoadingTips(1,1)).not.toContain(LEVEL_CURIOSITIES['2_1'][0]);
  expect(LEVEL_CURIOSITIES['2_1']).toContain('En el apartamento se duerme con el colchón en el suelo.');
  expect(LEVEL_CURIOSITIES['3_1']).toContain('En el entorno de La casina hay muchas salamandras.');
  expect(LEVEL_CURIOSITIES['4_1']).toContain('Los Litos también viven en Piqueñas.');
  expect(LEVEL_CURIOSITIES['4_2']).toContain('Maléfica también vive en San Melitón.');
 });
 it('shows the local church facts only at the church and visits the complete pool without repeats',()=>{
  const picker=new LoadingTipPicker(()=>.3),tips=Array.from({length:12},()=>picker.next(1,2));expect(new Set(tips).size).toBe(12);
  expect(tips).toEqual(expect.arrayContaining([...LEVEL_CURIOSITIES['1_2']]));
  expect(picker.next(1,2)).not.toBe(tips.at(-1));expect(getLoadingTips(1,1)).not.toContain(LEVEL_CURIOSITIES['1_2'][0]);
 });
 it('keeps an independent bag for each destination and has a safe fallback',()=>{
  const picker=new LoadingTipPicker(()=>0),a=picker.next(6,3);picker.next(1,2);expect(picker.next(6,3)).not.toBe(a);
  expect(getLoadingTips(99,99)).toEqual([SKIN_LOADING_TIP,GENERIC_LOADING_TIP]);
 });
});
