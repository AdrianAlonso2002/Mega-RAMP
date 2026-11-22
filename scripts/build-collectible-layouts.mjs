import {createServer} from 'vite';
import * as THREE from 'three';
import {readFileSync,writeFileSync} from 'node:fs';
const stages=JSON.parse(readFileSync('reports/collectible-layouts.json','utf8'));
const targets=[
 [8,8,10,10,20,8,10,8,8,10],[10,8,8,10,20,8,8,8,8,12],
 [10,6,12,10,20,8,8,6,6,14],[8,10,10,8,20,8,10,8,8,10],
 [8,10,10,10,20,8,6,10,8,10],[8,8,10,8,20,8,8,10,10,10],
 [8,10,12,8,20,6,6,10,10,10],[12,8,10,8,20,10,8,8,6,10],
 [8,8,8,10,20,8,12,8,8,10],[8,8,10,8,20,8,8,8,10,12],
 [10,8,12,8,20,8,8,10,8,8],[10,10,8,8,20,10,6,10,8,10],
 [8,10,8,8,20,8,8,8,12,10],[10,10,8,10,20,8,6,8,10,10],
 [8,8,12,6,20,10,12,8,8,8],[10,8,8,8,20,12,8,8,8,10],
 [8,10,8,4,20,10,8,16,6,10],[10,8,8,6,20,8,8,8,10,14],
 [6,4,8,10,24,10,6,8,8,16],[6,8,8,8,20,18,8,8,4,12],
 [8,4,9,10,20,8,12,5,10,14],[8,8,8,10,20,12,8,8,6,12],
 [10,6,8,10,20,8,8,8,8,14],[8,8,8,8,20,10,8,8,8,14]
];
for(const row of targets)if(row.reduce((a,b)=>a+b,0)!==100)throw Error('Invalid level budget');
const gradient={addColorStop(){}};
const context=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>gradient:key==='measureText'?()=>({width:100}):()=>{}});
globalThis.document={createElement:()=>({width:128,height:128,getContext:()=>context})};
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {LevelBuilder}=await server.ssrLoadModule('/src/levels/LevelBuilder.ts');
 const ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0),recipes={},audit=[];
 const vector=p=>new THREE.Vector3(p.x,p.y,p.z);
 const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
 for(const [key,data] of Object.entries(stages)){
  const [w,l,s]=key.split('_').map(Number),target=targets[(w-1)*4+l-1][s-1],original=data.objects.filter(o=>o.type==='collectible'),meshes=[],roots=[];
  const recipe=original.map(o=>({id:o.id,p:{...o.position},properties:o.properties??{},anchor:o.id,offset:{x:0,y:0,z:0}}));
  if(recipe.length>target){const selected=Array.from({length:target},(_,i)=>recipe[Math.round(i*(recipe.length-1)/(target-1))]);recipe.splice(0,recipe.length,...selected);}
  if(recipe.length<target){
   for(const obj of data.objects){
    if(['platform','ramp','moving-platform','rotating-platform','cylinder'].includes(obj.type)){
     // Detailed prefabs are not boxes; their nearby original anchors are used instead.
     if(obj.properties?.variant||obj.type==='cylinder')continue;
     const mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));
     mesh.position.copy(obj.position);mesh.rotation.set(obj.rotation.x,obj.rotation.y,obj.rotation.z);mesh.scale.copy(obj.scale);mesh.updateMatrixWorld();meshes.push(mesh);roots.push(mesh);
    }else if(obj.type==='decoration'&&obj.properties?.hasCollision===true){
     try{const model=LevelBuilder.createDecorationMesh(obj);model.group.updateWorldMatrix(true,true);meshes.push(...model.meshes);roots.push(model.group);}catch{}
    }
   }
   const surface=(p)=>{
    ray.set(new THREE.Vector3(p.x,p.y+1.3,p.z),down);ray.far=4;
    return ray.intersectObjects(meshes,false).find(hit=>hit.point.y<=p.y-.15&&hit.point.y>=p.y-1.8&&hit.face&&hit.face.normal.clone().transformDirection(hit.object.matrixWorld).y>.35);
   };
   const candidates=[];
   const offer=(p,anchor,kind)=>{
    const hit=surface(p);if(!hit)return;
    const position={x:p.x,y:hit.point.y+.78,z:p.z};
    if(data.objects.some(o=>o.type==='goal'&&distance(position,o.position)<1.8))return;
    // Leave enough support around the prize; avoid platform edges and holes.
    if(![[.3,0],[-.3,0],[0,.3],[0,-.3]].every(([x,z])=>{const h=surface({...position,x:p.x+x,z:p.z+z});return h&&Math.abs(h.point.y-hit.point.y)<.55;}))return;
    candidates.push({p:position,anchor,kind});
   };
   for(const o of original){
    // Keep transport-specific animation properties on every added prize.
    const dynamic=o.properties?.axis||o.properties?.trainId!==undefined||o.properties?.museumTier!==undefined;
    if(dynamic)continue;
    for(const radius of [1.6,2.6,4,5.5])for(let a=0;a<8;a++)offer({x:o.position.x+Math.cos(a*Math.PI/4)*radius,y:o.position.y,z:o.position.z+Math.sin(a*Math.PI/4)*radius},o,1);
    const near=original.filter(b=>b!==o&&distance(o.position,b.position)<24).sort((a,b)=>distance(o.position,a.position)-distance(o.position,b.position)).slice(0,3);
    for(const b of near)for(const f of [.25,.5,.75])offer(vector(o.position).lerp(vector(b.position),f),o,2);
   }
   let added=0;
   while(recipe.length<target&&candidates.length){
    let best=-1,score=0;
    candidates.forEach((c,i)=>{const separation=Math.min(...recipe.map(r=>distance(c.p,r.p)));const value=separation*(c.kind===2?1.15:1);if(separation>=1.35&&value>score){best=i;score=value;}});
    if(best<0)break;
    const c=candidates.splice(best,1)[0];recipe.push({id:`collectible-balance-${key}-${++added}`,p:c.p,properties:{...c.anchor.properties},anchor:c.anchor.id,offset:vector(c.p).sub(vector(c.anchor.position))});
   }
   if(recipe.length<target)console.log(`MANUAL ${key} ${data.name}: ${recipe.length}/${target}`);
  }
  recipes[key]=recipe;audit.push({key,name:data.name,before:original.length,target,actual:recipe.length});
  const geometries=new Set(),materials=new Set();for(const root of roots)root.traverse(o=>{if(o.isMesh){geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});for(const g of geometries)g.dispose();for(const m of materials)m.dispose();
 }
 writeFileSync('reports/collectible-recipes-draft.json',JSON.stringify(recipes));
 writeFileSync('reports/collectible-budget-audit.json',JSON.stringify(audit,null,2)+'\n');
 writeFileSync('reports/collectible-targets.json',JSON.stringify(targets));
 console.log('Draft generated: '+audit.filter(r=>r.actual<r.target).length+' stages need manual layouts.');
}finally{await server.close();}
