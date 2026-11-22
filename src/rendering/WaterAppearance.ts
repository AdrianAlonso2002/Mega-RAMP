import * as THREE from "three";

/** Bounded crossing swells, evaluated in world space so adjoining blocks stay in phase. */
export function ambientWaterWave(x:number,z:number,time:number,slope?:THREE.Vector2):number {
  const a=x*.85+z*.42+time*1.15,b=-x*1.25+z*1.7-time*1.65,c=x*3.1+z*.9+time*2.05;
  if(slope) slope.set(
    .028*.85*Math.cos(a)-.014*1.25*Math.cos(b)+.006*3.1*Math.cos(c),
    .028*.42*Math.cos(a)+.014*1.7*Math.cos(b)+.006*.9*Math.cos(c),
  );
  return .028*Math.sin(a)+.014*Math.sin(b)+.006*Math.sin(c);
}

/** Periodic, directional ripples: smooth tile boundaries without painted rings or bubbles. */
export function naturalWaterShade(u:number,v:number):number {
  const x=u*Math.PI*2,z=v*Math.PI*2;
  const warp=Math.sin(x+z)*.6+Math.sin(2*x-z)*.3;
  const broad=Math.sin(2*x+z+warp)*.45+Math.sin(3*x-2*z+warp*.7)*.25;
  const fine=Math.sin(9*x+4*z+warp)*.15+Math.sin(17*x-7*z+warp)*.09+Math.sin(29*x+13*z)*.04;
  const glint=Math.pow(Math.max(0,Math.sin(7*x+3*z+warp)*.6+Math.sin(11*x-5*z)*.4),6);
  return broad*.65+fine+glint*.3;
}

export function createNaturalWaterTexture():THREE.CanvasTexture {
  const canvas=document.createElement("canvas");canvas.width=256;canvas.height=256;
  const context=canvas.getContext("2d")!;
  const pixels=context.createImageData?.(256,256);
  if(pixels?.data) {
    for(let y=0;y<256;y++) for(let x=0;x<256;x++) {
      const shade=naturalWaterShade(x/256,y/256),i=(y*256+x)*4;
      pixels.data[i]=104+shade*24;
      pixels.data[i+1]=169+shade*28;
      pixels.data[i+2]=177+shade*30;
      pixels.data[i+3]=255;
    }
    context.putImageData(pixels,0,0);
  } else {context.fillStyle="#68a9b1";context.fillRect(0,0,256,256);}
  const texture=new THREE.CanvasTexture(canvas);
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.minFilter=THREE.LinearMipmapLinearFilter;texture.magFilter=THREE.LinearFilter;
  texture.generateMipmaps=true;
  return texture;
}
