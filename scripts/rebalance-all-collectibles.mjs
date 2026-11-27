import {gunzipSync} from 'node:zlib';
import RAPIER from '../node_modules/@dimforge/rapier3d-compat/rapier.es.js';
import {resolve} from 'node:path';
import {createServer} from 'vite';
import * as THREE from 'three';
import {readFileSync,writeFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8')),stages=JSON.parse(gunzipSync(readFileSync('reports/collectibles-before-audit.json.gz')).toString('utf8')),oldPlans=read('src/levels/CollectibleLayouts.json');
const targets={
 '4_3':[8,10,10,6,20,10,12,8,8,8], '4_4':[9,8,8,8,20,10,10,8,9,10],
 '5_1':[8,10,8,4,20,10,8,16,6,10], '5_2':[10,8,8,6,20,8,8,8,10,14],
 '5_3':[6,4,8,10,24,10,6,8,8,16], '5_4':[6,8,8,8,20,18,8,8,4,12],
 '6_1':[8,4,9,10,20,8,12,5,10,14], '6_2':[8,8,8,10,20,12,8,8,6,12], '6_3':[10,6,8,10,20,8,8,8,8,14]
};
for(const t of Object.values(targets))if(t.reduce((a,b)=>a+b,0)!==100)throw Error('Invalid targets');
const gradient={addColorStop(){}},ctx=new Proxy({},{get:(_,k)=>k==='createLinearGradient'||k==='createRadialGradient'?()=>gradient:k==='measureText'?()=>({width:100}):k==='getImageData'?(_x,_y,w,h)=>({data:new Uint8ClampedArray(w*h*4),width:w,height:h}):k==='createImageData'?(w,h)=>({data:new Uint8ClampedArray(w*h*4),width:w,height:h}):()=>{}});
globalThis.document={createElement:()=>({width:128,height:128,getContext:()=>ctx})};
const server=await createServer({resolve:{alias:{'@dimforge/rapier3d-compat':resolve('node_modules/@dimforge/rapier3d-compat/rapier.es.js')}},server:{middlewareMode:true},appType:'custom'});
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z),vec=p=>new THREE.Vector3().copy(p),plans={},audit=[];
try{
 const {LevelBuilder}=await server.ssrLoadModule('/src/levels/LevelBuilder.ts'),{PhysicsWorld}=await server.ssrLoadModule('/src/physics/PhysicsWorld.ts');
 for(const [key,data] of Object.entries(stages)){
  const [w,l,e]=key.split('_').map(Number),target=targets[`${w}_${l}`]?.[e-1],original=data.objects.filter(o=>o.type==='collectible');
  if(target===undefined||target===original.length)continue;
  let chosen=structuredClone(original),added=[];
  if(chosen.length>target){
   // Keep established route ordering and sample evenly instead of deleting one entire section.
   const old=chosen;chosen=Array.from({length:target},(_,i)=>old[Math.round(i*(old.length-1)/(target-1))]);
   // Prefer the existing authored 4/5/7 noodle arrangement when its IDs still exist.
   if(key==='5_1_8'){const keep=new Map(original.map(o=>[o.id,o])),prior=oldPlans[key].map(o=>keep.get(o.id)).filter(Boolean);if(prior.length===target)chosen=prior;else chosen=Array.from({length:target},(_,i)=>old[Math.round(i*(old.length-1)/(target-1))]);}
  }
  if(chosen.length<target){
   const physics=new PhysicsWorld();await physics.waitForReady();const built=new LevelBuilder().build(structuredClone(data),physics,'dragon_ball','low');physics.step(1/60);built.group.updateMatrixWorld(true);
   const candidates=[],ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);
   const support=(p)=>{ray.set(new THREE.Vector3(p.x,p.y+1.1,p.z),down);ray.far=3.5;return ray.intersectObjects(built.collidableMeshes,false).find(h=>h.face&&h.face.normal.clone().transformDirection(h.object.matrixWorld).y>.4);};
   const offer=(p,reason='surface',properties={})=>{
    const hit=support(p);if(!hit)return;
    const point={x:p.x,y:hit.point.y+.8,z:p.z};
    if(Math.abs(point.y-p.y)>1.8)return;
    if(![[.35,0],[-.35,0],[0,.35],[0,-.35]].every(([x,z])=>{const h=support({...point,x:point.x+x,z:point.z+z});return h&&Math.abs(h.point.y-hit.point.y)<.6;}))return;
    if(data.objects.some(o=>o.type==='goal'&&distance(point,o.position)<1.8))return;
    const physical=physics.getWorld().castRayAndGetNormal(new RAPIER.Ray({...point,y:point.y+.1},{x:0,y:-1,z:0}),2.2,true);
    if(!physical||physical.normal.y<.3||physical.timeOfImpact<.25||Math.abs(physical.timeOfImpact-.9)>.5)return;
    candidates.push({p:point,reason,properties});
   };
   const aerial=(p,reason)=>candidates.push({p:{...p},reason,properties:{}});
   try{
    // Explicit trajectories for launcher stages, rather than fake support on nearby props.
    if(key==='4_3_4')for(const y of [3.2,9.7,16.2])aerial({x:0,y,z:2-(y-6.5)/13*.75},'padel-launch-arc');
    if(key==='4_3_10')for(const y of [4,7,10,13,15.5])aerial({x:0,y,z:0},'geyser-ascent');
    if(w===5&&l===3){
     const river=data.objects.find(o=>o.properties?.subType==='asturias_sella_river');
     if(river){const pts=river.properties.points,map=new THREE.Matrix4().compose(vec(river.position),new THREE.Quaternion().setFromEuler(new THREE.Euler(river.rotation.x,river.rotation.y,river.rotation.z,'YXZ')),vec(river.scale));
      const curve=(river.properties.breaks?.length?pts.slice(0,river.properties.breaks[0]+1):pts).map(p=>vec(p).applyMatrix4(map)),lengths=[0];for(let i=1;i<curve.length;i++)lengths.push(lengths[i-1]+curve[i].distanceTo(curve[i-1]));
      for(let j=0;j<target*3;j++){const d=lengths.at(-1)*(j+.5)/(target*3);let i=1;while(i<lengths.length-1&&lengths[i]<d)i++;const p=curve[i-1].clone().lerp(curve[i],(d-lengths[i-1])/(lengths[i]-lengths[i-1]));p.y+=.8;aerial(p,'canoe-river-centre');}
     }
    }
    if(key==='5_4_6'){
      const {CovadongaPath,mineOffset}=await server.ssrLoadModule('/src/levels/world-05/CovadongaPath.ts'),road=data.objects.find(o=>o.properties?.subType==='asturias_cov_mine'),path=new CovadongaPath(road.properties.points);
      for(const distance of [750,1410]){const j=road.properties.junctions.find(j=>distance>=j.start&&distance<=j.start+j.length),offset=j?mineOffset(j,(distance-j.start)/j.length,j.coins):0,p=path.at(distance,offset).position;p.y+=1.25;aerial(p,'mine-cart-route');}
    }
    for(const p of oldPlans[key]??[])offer(p.p,'authored-route',p.properties);
    for(const coin of original){
     if(Object.keys(coin.properties??{}).length)continue;
     for(const radius of [1.6,2.5,4])for(let i=0;i<8;i++)offer({x:coin.position.x+Math.cos(i*Math.PI/4)*radius,y:coin.position.y,z:coin.position.z+Math.sin(i*Math.PI/4)*radius},'spaced-near-route');
    }
    // Fill long paths at regular intervals, using actual authored path surfaces.
    for(const obj of data.objects){
     if(obj.properties?.points&&obj.properties?.subType!=='asturias_sella_river'){
      const points=obj.properties.points,map=new THREE.Matrix4().compose(vec(obj.position),new THREE.Quaternion().setFromEuler(new THREE.Euler(obj.rotation.x,obj.rotation.y,obj.rotation.z,'YXZ')),vec(obj.scale));
      for(let i=1;i<points.length;i++){const a=vec(points[i-1]).applyMatrix4(map),b=vec(points[i]).applyMatrix4(map),n=Math.max(1,Math.ceil(a.distanceTo(b)/4));for(let j=0;j<n;j++){const p=a.clone().lerp(b,(j+.5)/n);p.y+=.8;offer(p,'path-centre');}}
     }
    }
    // Ordered local rows on ordinary platforms, never approximate detailed prefabs as boxes.
    for(const obj of data.objects){
     if(!['platform','ramp'].includes(obj.type)||obj.properties?.variant||obj.properties?.platformShape||obj.properties?.shape)continue;
     const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(obj.rotation.x,obj.rotation.y,obj.rotation.z,'YXZ'));
     const nx=Math.max(1,Math.floor((obj.scale.x-1)/2.5)),nz=Math.max(1,Math.floor((obj.scale.z-1)/3));
     for(let x=0;x<nx;x++)for(let z=0;z<nz;z++){const p=new THREE.Vector3((x-(nx-1)/2)*2.5,obj.scale.y/2+.8,(z-(nz-1)/2)*3).applyQuaternion(q).add(vec(obj.position));offer(p,'platform-row');}
    }
    while(chosen.length<target){
     if(key==='5_4_6')for(let i=candidates.length-1;i>=0;i--)if(candidates[i].reason!=='mine-cart-route')candidates.splice(i,1);
     let best=-1,score=-Infinity;
     candidates.forEach((c,i)=>{const gap=chosen.length?Math.min(...chosen.map(o=>distance(o.position,c.p))):10;if(gap<1.3||chosen.some(o=>Math.hypot(o.position.x-c.p.x,o.position.z-c.p.z)<.8&&Math.abs(o.position.y-c.p.y)<2.5))return;let value=c.reason==='canoe-river-centre'?gap:Math.min(gap,12);if(c.reason==='authored-route'||c.reason.includes('arc')||c.reason.includes('ascent')||c.reason==='canoe-river-centre')value+=20;if(c.reason==='path-centre')value+=5;if(value>score){score=value;best=i;}});
     if(best<0)break;
     const c=candidates.splice(best,1)[0],coin={id:`collectible-audit-${key}-${added.length+1}`,type:'collectible',position:c.p,rotation:{x:0,y:0,z:0},scale:{x:.42,y:.42,z:.42},properties:c.properties};chosen.push(coin);added.push({id:coin.id,reason:c.reason,p:c.p});
    }
   }finally{built.destroy();physics.getWorld()?.free();}
  }
  console.log(`${key} ${data.name}: ${original.length} -> ${chosen.length}/${target}`);
  plans[key]=chosen;audit.push({key,name:data.name,before:original.length,target,after:chosen.length,added});
 }
 writeFileSync('reports/collectibles-correction-draft.json',JSON.stringify(plans)+'\n');writeFileSync('reports/collectibles-correction-audit.json',JSON.stringify(audit,null,2)+'\n');
 if(audit.some(r=>r.after!==r.target))throw Error('Some placements require manual review');
}finally{await server.close();}
