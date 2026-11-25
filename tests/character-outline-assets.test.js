import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {distanceToBackground,normalizeCharacterOutline} from '../scripts/character-outline-pixels.mjs';

describe('Deterministic original PNG contour repair',()=>{
 it('keeps all original interior artwork pixels, frame dimensions and recoverable originals across all 72 assets',async()=>{
  const manifest=JSON.parse(readFileSync('art/character-outlines/manifest.json','utf8'));
  expect(Object.keys(manifest.files)).toHaveLength(72);
  for(const [file,entry]of Object.entries(manifest.files)) {
   const before=readFileSync('art/character-outlines/originals/'+entry.backup),after=readFileSync('public/assets/characters/'+file);
   expect(createHash('sha256').update(before).digest('hex'),file+' backup').toBe(entry.before);
   expect(createHash('sha256').update(after).digest('hex'),file+' published').toBe(entry.after);
   const old=await sharp(before).ensureAlpha().raw().toBuffer({resolveWithObject:true}),next=await sharp(after).ensureAlpha().raw().toBuffer({resolveWithObject:true});
   expect(next.info.width).toBe(old.info.width);expect(next.info.height).toBe(old.info.height);
   const distances=distanceToBackground(old.data,old.info.width,old.info.height),band=7*Math.max(old.info.width,old.info.height)/1024;
   let altered=0,checked=0;
   for(let i=0;i<distances.length;i++)if(old.data[i*4+3]>=128&&Math.sqrt(distances[i])-.5>band) {
    checked++;for(let c=0;c<4;c++)if(old.data[i*4+c]!==next.data[i*4+c])altered++;
   }
   expect(checked,file+' interior coverage').toBeGreaterThan(1000);
   expect(altered,file+' unchanged interior').toBe(0);
  }
 },30000);
 it('retains each original border thickness and smooths only exterior alpha',()=>{
  const widths=[];
  for(const oldStroke of [2,5,7]) {
   const width=1024,height=128,input=Buffer.alloc(width*height*4);
   for(let y=20;y<108;y++)for(let x=40;x<984;x++) {
    const i=(y*width+x)*4,ink=x<40+oldStroke||x>=984-oldStroke||y<20+oldStroke||y>=108-oldStroke;
    input[i]=ink?0:240;input[i+1]=ink?0:120;input[i+2]=ink?0:80;input[i+3]=255;
   }
   const {pixels}=normalizeCharacterOutline(input,width,height);
   let start=0;while(pixels[(64*width+start)*4+3]<128)start++;
   let end=start;while(pixels[(64*width+end)*4]<100)end++;
   widths.push(end-start);
   expect(end-start).toBe(oldStroke);
   expect(pixels[(64*width+39)*4+3]).toBeGreaterThan(0);
   expect(pixels[(64*width+40)*4+3]).toBeLessThan(255);
   let changedColors=0;for(let i=0;i<input.length;i+=4)if(input[i+3]>0)for(let c=0;c<3;c++)if(pixels[i+c]!==input[i+c])changedColors++;
   expect(changedColors).toBe(0);
   expect(pixels.subarray((64*width+500)*4,(64*width+500)*4+4)).toEqual(input.subarray((64*width+500)*4,(64*width+500)*4+4));
  }
  expect(widths).toEqual([2,5,7]);
  for(const width of widths)expect(width).toBeGreaterThanOrEqual(2);
 });
});
