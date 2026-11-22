// Packaging only: split generated animation sheets, align frames, preserve alpha.
const fs=require('node:fs'),path=require('node:path');
const decoderSource=fs.readFileSync(path.join(__dirname,'batch_clean_characters.cjs'),'utf8').split('/**')[0];
const {decodePNG,encodePNG}=new Function('require',decoderSource+'\nreturn {decodePNG,encodePNG};')(require);
const revision=fs.existsSync('art/character-skins/generation-v2.json') ? 2:1;
const manifest=JSON.parse(fs.readFileSync(`art/character-skins/generation${revision===2?'-v2':''}.json`,'utf8'));
const overrides=fs.existsSync('art/character-skins/generation-v3.json') ? JSON.parse(fs.readFileSync('art/character-skins/generation-v3.json','utf8')).assets:[];
const updated=new Set(overrides.map(asset=>asset.key));
manifest.assets=manifest.assets.map(asset=>overrides.find(updated=>updated.key===asset.key)??asset);
const outDir='public/assets/characters',sourceDir=`art/character-skins/sheets${revision===2?'-v2':''}`;fs.mkdirSync(sourceDir,{recursive:true});
// Eye centres measured on neutral source cells; all resulting crop coordinates are normalized.
const portrait={adri_especial:[256,143,.48],adri_ssj:[273,165,.52],pao_especial:[263,179,.46],pao_hp:[258,137,.64],misi_bebe:[270,188,.48],misi_negra:[258,139,.56],rony_bebe:[284,170,.48],rony_blue:[268,161,.59]};
const faceV2={adri_especial:[256,167,95,172],adri_ssj:[284,210,132,180],pao_especial:[256,197,105,174],pao_hp:[256,197,105,174],misi_bebe:[256,181,70,210],misi_negra:[255,141,60,172],rony_bebe:[274,156,100,180],rony_blue:[263,161,100,180]};
function largestSilhouette(raw,w,h) {
  const visited=new Uint8Array(w*h),queue=new Int32Array(w*h);let largest=[];
  for(let i=0;i<w*h;i++) {
    if(visited[i]||raw[i*4+3]<24)continue;
    let head=0,tail=1;queue[0]=i;visited[i]=1;
    while(head<tail) {const at=queue[head++],x=at%w,y=Math.floor(at/w);
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++) {const nx=x+dx,ny=y+dy,n=ny*w+nx;
        if(nx>=0&&ny>=0&&nx<w&&ny<h&&!visited[n]&&raw[n*4+3]>=24){visited[n]=1;queue[tail++]=n;}
      }
    }
    if(tail>largest.length)largest=Array.from(queue.subarray(0,tail));
  }
  if(largest.length<w*h*.08)throw new Error('Missing character silhouette');
  const keep=new Uint8Array(w*h);let minX=w,minY=h,maxX=0,maxY=0;
  for(const i of largest) {const x=i%w,y=Math.floor(i/w);minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
    for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(x+dx>=0&&x+dx<w&&y+dy>=0&&y+dy<h)keep[(y+dy)*w+x+dx]=1;
  }
  for(let i=0;i<w*h;i++)if(!keep[i]||raw[i*4+3]<8)raw.fill(0,i*4,i*4+4);
  return {raw,w,h,minX,minY,maxX,maxY};
}
function headCentre(frame) {
  let left=frame.w,right=0;
  const end=Math.round(frame.minY+(frame.maxY-frame.minY)*.48);
  for(let y=frame.minY;y<=end;y++)for(let x=0;x<frame.w;x++)if(frame.raw[(y*frame.w+x)*4+3]>=24){left=Math.min(left,x);right=Math.max(right,x);}
  return (left+right)/2;
}
function raster(frame,scale,bottom=480,top) {
  const out=Buffer.alloc(512*512*4);
  for(let y=0;y<512;y++)for(let x=0;x<512;x++) {
    const sx=(x-256)/scale+(frame.anchorX??frame.w/2),sy=top===undefined ? (y-bottom)/scale+frame.maxY:(y-top)/scale+frame.minY;
    if(sx<0||sy<0||sx>=frame.w-1||sy>=frame.h-1)continue;
    const ix=Math.floor(sx),iy=Math.floor(sy),fx=sx-ix,fy=sy-iy,values=[0,0,0,0];
    for(let dy=0;dy<=1;dy++)for(let dx=0;dx<=1;dx++) {
      const index=((iy+dy)*frame.w+ix+dx)*4,weight=(dx?fx:1-fx)*(dy?fy:1-fy),a=frame.raw[index+3]/255;
      values[3]+=a*weight;
      for(let c=0;c<3;c++)values[c]+=frame.raw[index+c]*a*weight;
    }
    const dest=(y*512+x)*4;if(values[3]<.01)continue;
    out[dest+3]=Math.round(values[3]*255);for(let c=0;c<3;c++)out[dest+c]=Math.round(values[c]/values[3]);
  }
  return out;
}
const crops={},review=Buffer.alloc(4*512*2*512*4);
for(let index=0;index<manifest.assets.length;index++) {
  const asset=manifest.assets[index],folder=updated.has(asset.key)?'art/character-skins/sheets-v3':sourceDir;
  fs.mkdirSync(folder,{recursive:true});
  const source=path.join(folder,asset.key+'.png');
  if(!fs.existsSync(source))fs.copyFileSync(asset.path,source);
  const header=fs.readFileSync(source);if(header[24]!==8||header[25]!==6||header[28]!==0)throw new Error('Expected non-interlaced RGBA8');
  const sheet=decodePNG(source),w=sheet.width/3,h=sheet.height/2;
  if(!Number.isInteger(w)||!Number.isInteger(h))throw new Error('Invalid sheet grid');
  const frames=manifest.states.map((state,i)=>{
    const raw=Buffer.alloc(w*h*4),ox=i%3*w,oy=Math.floor(i/3)*h;
    for(let y=0;y<h;y++)sheet.raw.copy(raw,y*w*4,((oy+y)*sheet.width+ox)*4,((oy+y)*sheet.width+ox+w)*4);
    return largestSilhouette(raw,w,h);
  });
  if(revision===2)frames.forEach(frame=>{frame.anchorX=headCentre(frame);});
  const maxHeight=Math.max(...frames.map(f=>f.maxY-f.minY+1)),halfWidth=Math.max(...frames.flatMap(f=>[(f.anchorX??w/2)-f.minX,f.maxX-(f.anchorX??w/2)]));
  const scale=Math.min(448/maxHeight,224/halfWidth)*(asset.key.endsWith('_bebe')?.78:1);
  const fixedTop=revision===2 ? 480-maxHeight*scale:undefined;
  frames.forEach((frame,i)=>{
    const raw=raster(frame,scale,480,fixedTop);fs.writeFileSync(path.join(outDir,`${asset.key}_${manifest.states[i]}.png`),encodePNG(512,512,raw));
    if(i===0){const ox=index%4*512,oy=Math.floor(index/4)*512;for(let y=0;y<512;y++)raw.copy(review,((oy+y)*2048+ox)*4,y*512*4,(y+1)*512*4);}
  });
  const [eyeX,eyeY,headWidth]=portrait[asset.key],x=(256+(eyeX-w/2)*scale)/512,y=(480-(frames[0].maxY-eyeY)*scale)/512;
  const size=headWidth*(asset.key.endsWith('_bebe')?.78:1);
  crops[asset.key]={avatar:[x-size/2,y-size*.42,size],eyes:[x-.16*scale,y-.04*scale,.32*scale,.08*scale]};
  if(revision===2){
    const [ex,ey,faceTop,faceSize]=faceV2[asset.key],normal=frames[0];
    const cx=(256+(ex-normal.anchorX)*scale)/512,cy=(fixedTop+(ey-normal.minY)*scale)/512,s=faceSize*scale/512;
    crops[asset.key]={avatar:[cx-s/2,(fixedTop+(faceTop-normal.minY)*scale)/512,s],eyes:[cx-.14*scale,cy-.034*scale,.28*scale,.068*scale]};
  }
  console.log(asset.key,`scale ${scale.toFixed(3)}, head registration and face crop ready`);
}
fs.writeFileSync('art/character-skins/crops.json',JSON.stringify(crops,null,2)+'\n');
fs.writeFileSync('src/player/CharacterSkinCrops.json',JSON.stringify(crops,null,2)+'\n');
fs.writeFileSync('art/character-skins/preview.png',encodePNG(2048,1024,review));
const portraits=Buffer.alloc(576*768*4),normalFaces={adri:[.33,.225,.34],pao:[.33,.22,.34],misi:[.345,.18,.31],rony:[.34,.255,.32]};
const skinNames={adri:['especial','ssj'],pao:['especial','hp'],misi:['bebe','negra'],rony:['bebe','blue']};
Object.keys(normalFaces).forEach((id,row)=>{
  ['normal',...skinNames[id]].forEach((skin,col)=>{
    const base=skin==='normal' ? id:`${id}_${skin}`,image=decodePNG(`${outDir}/${base}_normal.png`),rect=skin==='normal' ? normalFaces[id]:crops[base].avatar;
    for(let y=0;y<192;y++)for(let x=0;x<192;x++) {
      if(Math.hypot(x-95.5,y-95.5)>95)continue;
      const sx=Math.min(image.width-1,Math.max(0,Math.floor((rect[0]+(x+.5)/192*rect[2])*image.width))),sy=Math.min(image.height-1,Math.max(0,Math.floor((rect[1]+(y+.5)/192*rect[2])*image.height)));
      image.raw.copy(portraits,(((row*192+y)*576)+col*192+x)*4,(sy*image.width+sx)*4,(sy*image.width+sx)*4+4);
    }
  });
});
fs.writeFileSync('art/character-skins/portraits-preview.png',encodePNG(576,768,portraits));
console.log('Packaged 48 transparent 512×512 animation frames; original characters unchanged.');
// Preserve the reviewed fixed-face running pairs when rebuilding the original sheets.
if(fs.existsSync('art/character-skins/generation-v4.json'))require('node:child_process').execFileSync(process.execPath,['scripts/package-scary-skins.cjs'],{stdio:'inherit'});
