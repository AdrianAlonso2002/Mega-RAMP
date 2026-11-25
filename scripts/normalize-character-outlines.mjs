import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {normalizeCharacterOutline} from './character-outline-pixels.mjs';

export async function normalizeCharacterAssets(root=process.cwd()) {
  const folder=path.join(root,'public/assets/characters'),archive=path.join(root,'art/character-outlines');
  await fs.mkdir(path.join(archive,'originals'),{recursive:true});
  const manifestFile=path.join(archive,'manifest.json');
  let previous={};try{previous=JSON.parse(await fs.readFile(manifestFile,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
  const locks=JSON.parse(await fs.readFile(path.join(root,'art/character-skins/generation-v4.json'),'utf8')).assets;
  const entries={...previous.files},changedFiles=new Set();
  for(const file of (await fs.readdir(folder)).filter(f=>f.endsWith('.png')).sort()) {
    const target=path.join(folder,file),current=await fs.readFile(target);
    let original=current,hash=createHash('sha256').update(current).digest('hex');
    if(entries[file]?.after===hash){
      if(previous.revision===3)continue;
      original=await fs.readFile(path.join(archive,'originals',entries[file].backup));
      hash=createHash('sha256').update(original).digest('hex');
    }
    const backup=`${path.basename(file,'.png')}-${hash.slice(0,12)}.png`;
    try{await fs.writeFile(path.join(archive,'originals',backup),original,{flag:'wx'});}catch(error){if(error.code!=='EEXIST')throw error;}
    const {data,info}=await sharp(original).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const result=normalizeCharacterOutline(data,info.width,info.height,/_scary[12]\.png$/.test(file)?(locks.find(a=>file===a.key+'_scary1.png'||file===a.key+'_scary2.png')?.lockThrough??0):0);
    const output=await sharp(result.pixels,{raw:{width:info.width,height:info.height,channels:4}}).png({compressionLevel:9}).toBuffer();
    await fs.writeFile(target,output);
    entries[file]={before:hash,after:createHash('sha256').update(output).digest('hex'),backup,width:info.width,height:info.height,stroke:result.stroke,changedPixels:result.changed,recoveredPixels:result.recovered};
    changedFiles.add(file);
  }
  await fs.writeFile(manifestFile,JSON.stringify({revision:3,method:'original-ink-with-edge-antialiasing',files:entries},null,2)+'\n');
  return {processed:changedFiles.size,total:Object.keys(entries).length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(await normalizeCharacterAssets());
