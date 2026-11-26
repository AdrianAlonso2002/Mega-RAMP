import * as THREE from 'three';
import {assetUrl} from '../core/AssetUrl';
import {retainSharedTexture} from './StageResources';
let texture:THREE.CanvasTexture|undefined,ready:Promise<void>|undefined;
export function popeyeArtwork():THREE.CanvasTexture {
  if(texture)return texture;
  const canvas=document.createElement('canvas');canvas.width=2;canvas.height=2;
  const context=canvas.getContext('2d')!;context.fillStyle='#fff0d0';context.fillRect(0,0,2,2);
  texture=retainSharedTexture(new THREE.CanvasTexture(canvas));texture.colorSpace=THREE.SRGBColorSpace;
  ready=new Promise(resolve=>{
    if(typeof Image==='undefined'){resolve();return;}
    const image=new Image();image.onload=()=>{canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;context.drawImage(image,0,0);texture!.needsUpdate=true;resolve();};image.onerror=()=>resolve();
    image.src=assetUrl('/assets/signs/popeye-pizzeria.webp');
  });
  return texture;
}
export function preparePopeyeArtwork():Promise<void>{popeyeArtwork();return ready!;}
