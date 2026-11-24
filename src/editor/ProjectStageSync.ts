import {stageStorage} from '../storage/StageStorage';

// Injected by Vite only in development. Production never exposes a write endpoint.
let pending = false;
let again = false;
async function sync(): Promise<void> {
  if (!['localhost','127.0.0.1'].includes(location.hostname)) return;
  if (pending) { again=true; return; }
  pending=true;
  try {
    const stages = Object.keys(localStorage).filter(key=>/^custom_stage_\d+_\d+_\d+$/.test(key)).sort().flatMap(key=>{
      const data=JSON.parse(stageStorage.getItem(key) ?? 'null');
      return data && (data.customSaved || data.properties?.userSaved || data.objects?.some((o:{id:string})=>o.id?.startsWith('obj-custom'))) ? [data] : [];
    });
    const response=await fetch('/__editor-stage-sync',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({stages})});
    if(!response.ok)throw Error(await response.text());
    const result=await response.json();
    document.documentElement.dataset.projectStages=String(result.stages);
    document.documentElement.dataset.projectStageSync='ok';
    document.getElementById('project-sync-error')?.remove();
    console.info(`Mega RAMP: ${result.stages} etapas guardadas incorporadas al proyecto para GitHub.`);
  } catch(error) {
    document.documentElement.dataset.projectStageSync='error';
    console.error('No se han podido incorporar las etapas al proyecto.',error);
    const notice=document.getElementById('project-sync-error')??document.body.appendChild(Object.assign(document.createElement('div'),{id:'project-sync-error'}));
    notice.textContent='No se han podido copiar los niveles al proyecto. Tus cambios siguen guardados en este navegador. Revisa la consola antes de publicar.';
    notice.setAttribute('role','alert');
    notice.style.cssText='position:fixed;bottom:15px;left:15px;right:15px;z-index:20000;padding:16px;background:#721c24;color:white;border-radius:10px';
  } finally { pending=false; if(again){again=false;void sync();} }
}
window.addEventListener('mega-ramp:stage-saved',()=>void sync());
void sync();
