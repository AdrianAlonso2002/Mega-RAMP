import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root=path.resolve('art/source/media/assets/toys'),out=path.resolve('public/assets/toys');
await fs.mkdir(out,{recursive:true});
let total=0;
for(const id of ['goku-948','elliot-et-1252','scarlet-witch-1034','hermione-113','kamehameha-2223']){
 const source=path.join(root,id+(id==='scarlet-witch-1034'?'.jpg':'.png'));
 const data=await sharp(source).resize({width:id==='kamehameha-2223'?1280:768,withoutEnlargement:true}).webp({quality:92,effort:6}).toBuffer();
 await fs.writeFile(path.join(out,id+'.webp'),data);total+=data.length;
 console.log(id+': '+data.length+' bytes');
}
console.log('Total '+total+' bytes');
