import {afterAll,beforeAll,describe,it,expect,vi} from 'vitest';
import * as THREE from 'three';
import {statSync} from 'node:fs';
import sharp from 'sharp';
import {FUNKO_ART,funkoArtwork,funkoArtworkFor,applyFunkoBoxUV,type FunkoArtworkId} from '../src/rendering/FunkoArtwork';
import {SpriteTextures} from '../src/rendering/SpriteTextures';
import {LevelBuilder} from '../src/levels/LevelBuilder';
import {WORLD_04_LEVEL_04_STAGES} from '../src/levels/world-04/level-04-stages';
import {upgradeToyPlanetArt} from '../src/levels/world-04/ToyPlanetArtwork';
const requests:{src:string;onload:(()=>void)|null;naturalWidth:number;naturalHeight:number}[]=[];
beforeAll(()=>{
 const gradient={addColorStop(){}},context=new Proxy({},{get:(_,k)=>k==='createLinearGradient'||k==='createRadialGradient'?()=>gradient:k==='measureText'?()=>({width:100}):()=>{}});
 vi.stubGlobal('document',{createElement:()=>({width:128,height:128,getContext:()=>context})});
 vi.stubGlobal('Image',class{onload:(()=>void)|null=null;onerror:(()=>void)|null=null;naturalWidth=768;naturalHeight=960;private url='';constructor(){requests.push(this);}get src(){return this.url;}set src(value:string){this.url=value;if(value.includes('kamehameha')){this.naturalWidth=1280;this.naturalHeight=640;}}});
});
afterAll(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});
describe('ToyPlanet reference packaging',()=>{
 it('includes all five optimized assets within an 0.8 MB combined budget',async()=>{
  let bytes=0;for(const id of Object.keys(FUNKO_ART)){const file=`public/assets/toys/${id}.webp`,meta=await sharp(file).metadata();expect(meta.format).toBe('webp');expect(meta.width).toBeGreaterThanOrEqual(id==='scarlet-witch-1034'?300:768);bytes+=statSync(file).size;}
  expect(bytes).toBeLessThan(800000);
 });
 it('waits for all five image loads and uploads the cached face textures before releasing level preload',async()=>{
  const texture=new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement);vi.spyOn(SpriteTextures,'getWorldBlockSet').mockReturnValue({top:texture,sideX:texture,sideZ:texture,bottom:texture,emissiveColor:new THREE.Color(0),movingEmissiveColor:new THREE.Color(0)});
  let finished=false;const upload=vi.fn(),ready=SpriteTextures.prepareLevelAssets([WORLD_04_LEVEL_04_STAGES[3]],upload).then(()=>{finished=true;});
  expect(requests).toHaveLength(5);expect(new Set(requests.map(r=>r.src)).size).toBe(5);expect(requests.every(r=>r.src.includes('/assets/toys/'))).toBe(true);
  for(const image of requests.slice(0,4))image.onload!();await Promise.resolve();expect(finished).toBe(false);
  requests[4].onload!();await ready;expect(finished).toBe(true);expect(upload).toHaveBeenCalledTimes(21);
  const art=funkoArtwork('goku-948');expect(funkoArtwork('goku-948')).toBe(art);expect(art.front).not.toBe(art.side);expect(art.side).not.toBe(art.top);expect(requests).toHaveLength(5);
 });
 it('uses five distinct references and fits the deluxe artwork to the existing wide fourth box',()=>{
  const boxes=WORLD_04_LEVEL_04_STAGES[3].objects.filter(o=>o.properties?.variant==='funko_pop_box');
  expect(boxes).toHaveLength(5);expect(new Set(boxes.map(funkoArtworkFor)).size).toBe(5);expect(funkoArtworkFor(boxes[3])).toBe('kamehameha-2223');
  for(const box of boxes){const id=funkoArtworkFor(box)!,result=LevelBuilder.createFunkoBoxMesh(box.scale.x,box.scale.y,box.scale.z,'medium','dragon_ball',id),mesh=result.meshes[0];
   expect(result.meshes).toHaveLength(1);mesh.geometry.computeBoundingBox();const size=mesh.geometry.boundingBox!.getSize(new THREE.Vector3());expect(size.x).toBeCloseTo(box.scale.x);expect(size.y).toBeCloseTo(box.scale.y);expect(size.z).toBeCloseTo(box.scale.z);
   const materials=mesh.material as THREE.MeshStandardMaterial[];expect(materials[4].map).toBe(funkoArtwork(id).front);expect(materials[0].map).toBe(funkoArtwork(id).side);expect(materials[2].map).toBe(funkoArtwork(id).top);
  }
  expect(requests).toHaveLength(5);
 });
 it('rectifies the original Scarlet Witch photo through UVs, without creating extra overlapping surfaces',()=>{
  const geometry=new THREE.BoxGeometry(4.4,5.2,3.8,8,8,1);applyFunkoBoxUV(geometry,4.4,5.2,3.8,'scarlet-witch-1034');
  const uv=geometry.getAttribute('uv'),index=geometry.getIndex()!,front=geometry.groups.find(g=>g.materialIndex===4)!;
  for(let i=front.start;i<front.start+front.count;i++){const vertex=index.getX(i);expect(uv.getX(vertex)).toBeGreaterThanOrEqual(57/333-1e-6);expect(uv.getX(vertex)).toBeLessThanOrEqual(331/333+1e-6);expect(uv.getY(vertex)).toBeGreaterThanOrEqual(1-422/424-1e-6);expect(uv.getY(vertex)).toBeLessThanOrEqual(1-19/424+1e-6);}
 });
 it('preserves dimensions, routes and prizes when assigning the new artwork, and allows later edits',()=>{
  const data=structuredClone(WORLD_04_LEVEL_04_STAGES[3]);delete data.properties!.toyPlanetArtRevision;
  const before=data.objects.map(o=>({id:o.id,p:o.position,r:o.rotation,s:o.scale,type:o.type}));upgradeToyPlanetArt(data);
  expect(data.objects.map(o=>({id:o.id,p:o.position,r:o.rotation,s:o.scale,type:o.type}))).toEqual(before);
  const first=data.objects.find(o=>o.properties?.funkoArtwork)!;first.properties!.funkoArtwork='hermione-113' as FunkoArtworkId;
  upgradeToyPlanetArt(data);expect(first.properties!.funkoArtwork).toBe('hermione-113');
 });
});
