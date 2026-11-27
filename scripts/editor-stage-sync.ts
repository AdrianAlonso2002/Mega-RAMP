import type { Plugin } from 'vite';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';
import {applyCollectibleCorrections} from '../src/levels/CollectibleCorrections';
import type {LevelData} from '../src/levels/LevelTypes';
import {upgradeCoastalFinale} from '../src/levels/world-02/CoastalFinale';
import {rebuildWheelTrain} from '../src/levels/WheelTrainRoute';

/** Development only: same-origin, loopback-only bridge to fixed project data files. */
export function editorStageSync(): Plugin {
  let queue = Promise.resolve();
  return {
    name: 'editor-stage-sync',
    apply: 'serve',
    handleHotUpdate(context) {
      // Saving a level must not reload the editor and discard work in progress.
      if (/[/\\]levels[/\\](editor-saved[/\\]world-\d+|StageBudgets)\.json$/.test(context.file)) return [];
    },
    transformIndexHtml: () => [{tag:'script',attrs:{type:'module',src:'/src/editor/ProjectStageSync.ts'},injectTo:'body'}],
    configureServer(server) {
      server.middlewares.use('/__editor-stage-sync', (req, res) => {
        const host = req.headers.host ?? '';
        if (req.method !== 'POST' || !['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress ?? '') || !/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) ||
            req.headers.origin !== `http://${host}` || !req.headers['content-type']?.startsWith('application/json')) {
          res.writeHead(403).end(); return;
        }
        let body = '';
        req.on('data', chunk => { body += chunk; if (Buffer.byteLength(body) > 24 * 1024 * 1024) req.destroy(); });
        req.on('end', () => {
          const task = queue.then(async () => {
            const payload = JSON.parse(body);
            if (!Array.isArray(payload.stages) || payload.stages.length > 320) throw Error('Exportación inválida');
            const incoming = new Map<string, Record<string, any>>();
            const vector = (v:any) => v && ['x','y','z'].every(k => typeof v[k] === 'number' && Number.isFinite(v[k]));
            for (const data of payload.stages) {
              if (!data || !Number.isInteger(data.world) || data.world < 1 || data.world > 8 ||
                  !Number.isInteger(data.level) || data.level < 1 || data.level > 4 ||
                  !Number.isInteger(data.stage) || data.stage < 1 || data.stage > 10 ||
                  typeof data.id !== 'string' || typeof data.name !== 'string' ||
                  !Number.isFinite(data.timeLimit) || !vector(data.spawn) || !Array.isArray(data.objects) ||
                  !data.objects.every((o:any) => o && typeof o.id === 'string' && typeof o.type === 'string' && vector(o.position) && vector(o.rotation) && vector(o.scale))) throw Error('Etapa inválida');
              const key = `${data.world}_${data.level}_${data.stage}`;
              if (incoming.has(key)) throw Error('Etapa duplicada');
              incoming.set(key, data);
            }
            const folder = join(server.config.root, 'src/levels/editor-saved');
            await mkdir(folder, {recursive:true});
            let changed = 0;
            for (const world of new Set([...incoming.values()].map(data=>data.world as number))) {
              const file = join(folder, `world-${String(world).padStart(2,'0')}.json`);
              const previous = await readFile(file,'utf8');
              const saved = JSON.parse(previous);
              for (const [key, data] of incoming) if (data.world === world) {
                // An already-open tab may still send the previous prize layout after a project update.
                // Apply the same one-time migration as the game before writing data or HUD budgets.
                const normalized=rebuildWheelTrain(data as LevelData);
                upgradeCoastalFinale(normalized);
                applyCollectibleCorrections(normalized, saved[key]);
                incoming.set(key, normalized);
                saved[key] = {...normalized,properties:{...normalized.properties,editorPublished:true}};
              }
              const next = JSON.stringify(Object.fromEntries(Object.entries(saved).sort(([a],[b])=>a.localeCompare(b)))) + '\n';
              if (next !== previous) { await writeFile(file+'.tmp',next); await rename(file+'.tmp',file); changed++; }
            }
            const metadataFile=join(server.config.root,'src/levels/StageBudgets.json');
            const previousMetadata=await readFile(metadataFile,'utf8');
            const metadata=JSON.parse(previousMetadata);
            for(const [key,data] of incoming) metadata[key]={count:data.objects.filter((o:any)=>o.type==='collectible').length,name:data.name};
            const nextMetadata=JSON.stringify(metadata)+'\n';
            if(nextMetadata!==previousMetadata){await writeFile(metadataFile+'.tmp',nextMetadata);await rename(metadataFile+'.tmp',metadataFile);}
            res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({stages:incoming.size,changed}));
          });
          queue = task.catch(error => { if(!res.headersSent)res.writeHead(400,{'Content-Type':'application/json'}).end(JSON.stringify({error:String(error)})); });
        });
      });
    },
  };
}
