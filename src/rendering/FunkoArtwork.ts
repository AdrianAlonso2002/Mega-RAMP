import * as THREE from 'three';
import {assetUrl} from '../core/AssetUrl';
import {retainSharedTexture} from './StageResources';
import type {LevelObjectData} from '../levels/LevelTypes';
export const FUNKO_ART={
 'goku-948':{name:'SUPER SAIYAN GOKU',series:'DRAGON BALL Z',number:'948',color:'#ed7a14',ink:'#171717',wide:false},
 'elliot-et-1252':{name:'ELLIOTT & E.T.',series:'E.T.',number:'1252',color:'#18263f',ink:'#ffffff',wide:false},
 'scarlet-witch-1034':{name:'SCARLET WITCH',series:'MARVEL',number:'1034',color:'#9f142d',ink:'#ffffff',wide:false},
 'hermione-113':{name:'HERMIONE GRANGER',series:'HARRY POTTER',number:'113',color:'#d8d5c7',ink:'#796032',wide:false},
 'kamehameha-2223':{name:'FATHER-SON KAMEHAMEHA',series:'DRAGON BALL Z',number:'2223',color:'#ed7a14',ink:'#171717',wide:true}
} as const;
export type FunkoArtworkId=keyof typeof FUNKO_ART;
const stageArt:FunkoArtworkId[]=['goku-948','elliot-et-1252','scarlet-witch-1034','kamehameha-2223','hermione-113'];
/** Use the existing wide fourth platform for the wide deluxe package. */
export function funkoArtworkFor(object:Pick<LevelObjectData,'id'|'properties'>):FunkoArtworkId|undefined {
 const art=object.properties?.funkoArtwork;
 if(typeof art==='string'&&Object.hasOwn(FUNKO_ART,art))return art as FunkoArtworkId;
 const index=/^w4s43-funko-([1-5])$/.exec(object.id);
 return index?stageArt[Number(index[1])-1]:undefined;
}
export interface FunkoArtwork {front:THREE.CanvasTexture;side:THREE.CanvasTexture;top:THREE.CanvasTexture;back:THREE.CanvasTexture;ready:Promise<void>}
const cache=new Map<FunkoArtworkId,FunkoArtwork>();
export function funkoArtwork(id:FunkoArtworkId):FunkoArtwork {
 const cached=cache.get(id);if(cached)return cached;
 const style=FUNKO_ART[id];
 const canvas=(w:number,h:number)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d')!;ctx.fillStyle='#f7f5ef';ctx.fillRect(0,0,w,h);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';return c;};
 const front=canvas(style.wide?1280:768,style.wide?640:960),side=canvas(384,512),top=canvas(512,256),back=canvas(512,640);
 const make=(c:HTMLCanvasElement)=>{const texture=retainSharedTexture(new THREE.CanvasTexture(c));texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;return texture;};
 const entry:FunkoArtwork={front:make(front),side:make(side),top:make(top),back:make(back),ready:Promise.resolve()};
 cache.set(id,entry);
 entry.ready=new Promise(resolve=>{
  if(typeof Image==='undefined'){resolve();return;}
  const image=new Image();image.onload=()=>{
   front.getContext('2d')!.drawImage(image,0,0,front.width,front.height);
   // Matching printed carton panels, derived once from the same sharp front image.
   const ctx=side.getContext('2d')!;ctx.scale(1.5,1);ctx.fillStyle=style.color;ctx.fillRect(10,10,236,492);
   ctx.drawImage(image,0,0,image.naturalWidth*.34,image.naturalHeight*.23,18,18,138,106);
   ctx.fillStyle=style.ink;ctx.textAlign='center';ctx.font='bold 24px Arial';ctx.fillText(style.number,205,74,78);
   ctx.save();ctx.translate(128,156);ctx.rotate(Math.PI/2);ctx.font='bold 20px Arial';ctx.fillText(style.name,120,0,242);ctx.restore();
   const cropX=image.naturalWidth*.22,cropY=image.naturalHeight*.23;
   ctx.drawImage(image,cropX,cropY,image.naturalWidth*.62,image.naturalHeight*.55,24,310,208,170);
   const lid=top.getContext('2d')!;lid.drawImage(image,0,0,image.naturalWidth,image.naturalHeight*.19,12,12,488,112);
   lid.fillStyle=style.color;lid.fillRect(12,132,488,112);lid.fillStyle=style.ink;lid.textAlign='center';lid.font='bold 24px Arial';lid.fillText(style.name,256,193,464);
   const rear=back.getContext('2d')!;rear.fillStyle=style.color;rear.fillRect(12,12,488,616);rear.drawImage(image,0,0,image.naturalWidth,image.naturalHeight*.2,24,24,464,120);
   rear.drawImage(image,image.naturalWidth*.2,image.naturalHeight*.23,image.naturalWidth*.73,image.naturalHeight*.55,70,170,372,344);
   rear.fillStyle=style.ink;rear.textAlign='center';rear.font='bold 23px Arial';rear.fillText(style.name,256,555,460);rear.font='16px Arial';rear.fillText(style.series+'  /  '+style.number,256,594,450);
   for(const texture of [entry.front,entry.side,entry.top,entry.back])texture.needsUpdate=true;
   resolve();
  };image.onerror=()=>resolve();image.src=assetUrl(`/assets/toys/${id}.webp`);
 });
 return entry;
}

/** Fit artwork into existing box faces; white carton borders absorb any aspect mismatch. */
export function applyFunkoBoxUV(geometry:THREE.BoxGeometry,width:number,height:number,depth:number,id:FunkoArtworkId):void {
 const uv=geometry.getAttribute('uv'),index=geometry.getIndex()!;
 const faces=[{shape:depth/height,image:.75},{shape:depth/height,image:.75},{shape:width/depth,image:2},null,{shape:width/height,image:FUNKO_ART[id].wide?2:.8},{shape:width/height,image:.8}];
 for(const group of geometry.groups){
  const face=faces[group.materialIndex??0];if(!face)continue;
  const vertices=new Set<number>();for(let i=group.start;i<group.start+group.count;i++)vertices.add(index.getX(i));
  for(const vertex of vertices){
   let u=.5+(uv.getX(vertex)-.5)*Math.max(1,face.shape/face.image),v=.5+(uv.getY(vertex)-.5)*Math.max(1,face.image/face.shape);
   if(id==='scarlet-witch-1034'&&group.materialIndex===4){
    // Front quadrilateral of the untouched 333x424 reference. Subdivision removes its camera shear.
    u=THREE.MathUtils.clamp(u,0,1);v=THREE.MathUtils.clamp(v,0,1);
    const x=57+(331-57)*u,bottom=422+(400-422)*u,top=44+(19-44)*u;
    u=x/333;v=1-(bottom+(top-bottom)*v)/424;
   }
   uv.setXY(vertex,u,v);
  }
 }
 uv.needsUpdate=true;
}
