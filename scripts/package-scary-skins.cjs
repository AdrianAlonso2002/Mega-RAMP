// Offline sprite packaging: identical upper body, two opposite steps, no runtime image work.
const fs=require('node:fs');
const decoder=fs.readFileSync('scripts/batch_clean_characters.cjs','utf8').split('/**')[0];
const {decodePNG,encodePNG}=new Function('require',decoder+'\nreturn {decodePNG,encodePNG}')(require);
const manifest=JSON.parse(fs.readFileSync('art/character-skins/generation-v4.json','utf8'));
const reference=decodePNG(manifest.reference),steps=decodePNG(manifest.steps);
function cell(sheet,index) {
  const raw=Buffer.alloc(512*512*4);
  for(let y=0;y<512;y++)for(let x=0;x<512;x++) {
    const sx=Math.floor((index%4+(x+.5)/512)*sheet.width/4),sy=Math.floor((Math.floor(index/4)+(y+.5)/512)*sheet.height/2);
    const p=(sy*sheet.width+sx)*4,q=(y*512+x)*4;
    if(sheet.raw[p+3]>=8)sheet.raw.copy(raw,q,p,p+4);
  }
  return raw;
}
function bounds(raw) {
  let left=512,right=0,top=512,bottom=0;
  for(let y=0;y<512;y++)for(let x=0;x<512;x++)if(raw[(y*512+x)*4+3]>=24) {
    left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
  }
  return {left,right,top,bottom};
}
function sample(raw,x,y) {
  if(x<0||y<0||x>=511||y>=511)return [0,0,0,0];
  const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,out=[0,0,0,0];
  for(let dy=0;dy<=1;dy++)for(let dx=0;dx<=1;dx++) {
    const p=((iy+dy)*512+ix+dx)*4,w=(dx?fx:1-fx)*(dy?fy:1-fy),a=raw[p+3]/255;
    out[3]+=a*w;for(let c=0;c<3;c++)out[c]+=raw[p+c]*a*w;
  }
  if(out[3]<.03)return [0,0,0,0];
  return [out[0]/out[3],out[1]/out[3],out[2]/out[3],out[3]*255];
}
const preview=Buffer.alloc(1024*4096*4);
manifest.assets.forEach(({key,lockThrough},index)=>{
  const original=cell(reference,index),step=cell(steps,index),a=bounds(original),b=bounds(step);
  for(let phase=0;phase<2;phase++) {
    const out=Buffer.from(original);
    for(let y=lockThrough;y<512;y++)for(let x=0;x<512;x++) {
      const sourceX=phase===0?x:a.left+a.right-x;
      const sx=b.left+(sourceX-a.left)*(b.right-b.left)/(a.right-a.left);
      const sy=b.top+(y-a.top)*(b.bottom-b.top)/(a.bottom-a.top);
      const pixel=sample(step,sx,sy),q=(y*512+x)*4;
      // Transition stays below the locked head/torso and never changes their pixels.
      const t=Math.min(1,(y-lockThrough)/12),alpha=(original[q+3]*(1-t)+pixel[3]*t)/255;
      for(let c=0;c<3;c++)out[q+c]=alpha>0?(original[q+c]*original[q+3]/255*(1-t)+pixel[c]*pixel[3]/255*t)/alpha:0;
      out[q+3]=alpha*255;
      if(out[q+3]<8)out.fill(0,q,q+4);
    }
    fs.writeFileSync(`public/assets/characters/${key}_scary${phase+1}.png`,encodePNG(512,512,out));
    for(let y=0;y<512;y++)out.copy(preview,((index*512+y)*1024+phase*512)*4,y*2048,(y+1)*2048);
  }
  console.log(`${key}: locked upper ${lockThrough}px; opposite leg/paw steps`);
});
fs.writeFileSync('art/character-skins/scary-pairs-v4.png',encodePNG(1024,4096,preview));
