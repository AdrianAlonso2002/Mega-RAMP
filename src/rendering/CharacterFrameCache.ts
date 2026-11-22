import * as THREE from 'three';
import {retainSharedTexture} from './StageResources';
import {characterSpritePath,getCharacterSkin} from '../player/CharacterSkins';
import type {CharacterState} from './SpriteTextures';

interface Frame {
  base:string;
  canvas:HTMLCanvasElement;
  context:CanvasRenderingContext2D;
  texture:THREE.CanvasTexture;
  ready:boolean;
  settled:Promise<void>;
}
interface FrameSources {
  canvas:()=>HTMLCanvasElement;
  fallback:(character:string)=>CanvasImageSource;
  load:(url:string,loaded:(image:CanvasImageSource)=>void,failed:()=>void)=>void;
}

/** Fixed-size GPU storage: async images only repaint a 512px canvas, never resize a texture. */
export class CharacterFrameCache {
  private readonly frames=new Map<string,Frame>();
  constructor(private readonly sources:FrameSources) {}
  /** Called after the old player is destroyed, before preparing the next selected skin. */
  keepSkin(character:string,skinId:string):void{const base=getCharacterSkin(character,skinId).spriteBase;for(const [key,frame]of this.frames)if(frame.base!==base){frame.texture.dispose();this.frames.delete(key);}}

  get(character:string,state:CharacterState='normal',skinId='normal'):THREE.CanvasTexture {
    const skin=getCharacterSkin(character,skinId),key=`${skin.spriteBase}_${state}`;
    const cached=this.frames.get(key);
    if(cached)return cached.texture;
    const neutral=state==='normal' ? undefined:this.get(character,'normal',skin.id);
    const canvas=this.sources.canvas();canvas.width=canvas.height=512;
    const context=canvas.getContext('2d')!;
    context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';
    const texture=retainSharedTexture(new THREE.CanvasTexture(canvas));
    texture.colorSpace=THREE.SRGBColorSpace;
    texture.minFilter=THREE.LinearMipmapLinearFilter;texture.magFilter=THREE.LinearFilter;
    texture.generateMipmaps=true;
    let resolveReady:()=>void=()=>{};
    const settled=new Promise<void>(resolve=>{resolveReady=resolve;});
    const frame:Frame={base:skin.spriteBase,canvas,context,texture,ready:false,settled};
    this.frames.set(key,frame);
    this.paint(frame,neutral?.image??this.sources.fallback(character));
    this.sources.load(characterSpritePath(character,skin.id,state),image=>{
      if(this.frames.get(key)!==frame){resolveReady();return;}
      this.paint(frame,image);frame.ready=true;
      if(state==='normal') {
        // Pending/failed animation poses follow the visible neutral skin until their own image arrives.
        for(const pending of this.frames.values())if(pending!==frame&&pending.base===frame.base&&!pending.ready)this.paint(pending,canvas);
      }
      resolveReady();
    },()=>{
      const normal=this.frames.get(`${skin.spriteBase}_normal`);
      if(normal&&normal!==frame)this.paint(frame,normal.canvas);
      resolveReady();
    });
    return texture;
  }

  async waitForSkin(character:string,skinId:string):Promise<void> {
    const states:CharacterState[]=['normal','move1','move2','scary1','scary2','happy'];
    const pending=states.map(state=>{this.get(character,state,skinId);return this.frames.get(`${getCharacterSkin(character,skinId).spriteBase}_${state}`)!.settled;});
    let timer:ReturnType<typeof setTimeout>|undefined;
    try {await Promise.race([Promise.all(pending),new Promise<void>(resolve=>{timer=setTimeout(resolve,8000);})]);}
    finally {clearTimeout(timer);}
  }

  private paint(frame:Frame,image:CanvasImageSource):void {
    frame.context.clearRect(0,0,512,512);
    frame.context.drawImage(image,0,0,512,512);
    frame.texture.needsUpdate=true;
  }
}
