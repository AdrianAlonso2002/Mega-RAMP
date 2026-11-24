/** Decorative font/image decoding must not trap installed apps behind an inert menu. */
export async function optionalReadiness(work:PromiseLike<unknown>,signal:AbortSignal,milliseconds=5000):Promise<void>{
  if(signal.aborted)return;
  let timer:ReturnType<typeof setTimeout>|undefined,abort=()=>{};
  try{
    await Promise.race([
      Promise.resolve(work).catch(()=>{}),
      new Promise<void>(resolve=>{abort=resolve;timer=setTimeout(resolve,milliseconds);signal.addEventListener('abort',abort,{once:true});}),
    ]);
  }finally{clearTimeout(timer);signal.removeEventListener('abort',abort);}
}
