// Small shared cache: only requested images are decoded, failed requests can be retried.
const images=new Map<string,Promise<HTMLImageElement|null>>();
export function loadUIImage(src:string):Promise<HTMLImageElement|null> {
  const existing=images.get(src);if(existing)return existing;
  const promise=new Promise<HTMLImageElement|null>(resolve=>{
    const image=new Image();image.decoding='async';
    const finish=(ok:boolean)=>{clearTimeout(timer);image.onload=image.onerror=null;resolve(ok?image:null);};
    const timer=setTimeout(()=>finish(false),8000);
    image.onload=()=>finish(image.naturalWidth>0);image.onerror=()=>finish(false);image.src=src;
  });
  images.set(src,promise);
  void promise.then(image=>{if(!image&&images.get(src)===promise)images.delete(src);});
  return promise;
}
export async function loadFirstUIImage(sources:readonly string[]):Promise<HTMLImageElement|null> {
  for(const src of new Set(sources)){const image=await loadUIImage(src);if(image)return image;}
  return null;
}
export async function revealUIBackdrop(element:HTMLElement,sources:readonly string[]):Promise<void> {
  const image=await loadFirstUIImage(sources);
  // Detached screens must never affect the current screen when a late image arrives.
  if(image&&element.isConnected){element.style.backgroundImage=`url("${image.src}")`;element.classList.add('is-ready');}
}
