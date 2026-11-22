/** Paint the cover first; prepare concurrently with the minimum visible time. */
export async function runLoadingTransition(
  prepare:(signal:AbortSignal)=>Promise<void>,
  signal:AbortSignal,
  minimumMs=3000,
  paint:()=>Promise<void>=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())))
):Promise<void> {
  if(signal.aborted)throw new DOMException('Carga cancelada','AbortError');
  const controller=new AbortController();
  let minimumTimer:ReturnType<typeof setTimeout>|undefined,timeout:ReturnType<typeof setTimeout>|undefined;
  let rejectCancellation:(error:Error)=>void=()=>{};
  const abort=()=>{controller.abort();rejectCancellation(new DOMException('Carga cancelada','AbortError'));};
  const cancelled=new Promise<never>((_,reject)=>{rejectCancellation=reject;});
  signal.addEventListener('abort',abort,{once:true});
  try {
    const minimum=new Promise<void>(resolve=>{minimumTimer=setTimeout(resolve,minimumMs);});
    const deadline=new Promise<never>((_,reject)=>{timeout=setTimeout(()=>{controller.abort();reject(new Error('El nivel está tardando demasiado en cargar.'));},30000);});
    const work=paint().then(()=>{if(controller.signal.aborted)throw new DOMException('Carga cancelada','AbortError');return prepare(controller.signal);});
    await Promise.race([Promise.all([minimum,work]),cancelled,deadline]);
  } finally {
    clearTimeout(minimumTimer);clearTimeout(timeout);signal.removeEventListener('abort',abort);controller.abort();
  }
}
