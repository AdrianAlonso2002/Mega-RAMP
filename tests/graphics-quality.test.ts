import {afterAll,beforeAll,describe,it,expect,vi} from 'vitest';
import * as THREE from 'three';
import {GRAPHICS_PROFILES,graphicsPixelRatio,type GraphicsQuality} from '../src/rendering/GraphicsQuality';
import {SceneQuality} from '../src/rendering/SceneQuality';
import {LevelBuilder} from '../src/levels/LevelBuilder';
import {PhysicsWorld} from '../src/physics/PhysicsWorld';
import {SpriteTextures} from '../src/rendering/SpriteTextures';
import {WORLD_06_LEVEL_03_STAGES} from '../src/levels/world-06/level-03-stages';
import {WORLD_05_LEVEL_03_STAGES} from '../src/levels/world-05/level-03-stages';
import {WORLD_06_LEVEL_02_STAGES} from '../src/levels/world-06/level-02-stages';
import {SellaWater} from '../src/levels/world-05/SellaWater';
import type {LevelData} from '../src/levels/LevelTypes';
vi.mock('@dimforge/rapier3d-compat',async()=>{const path='../node_modules/@dimforge/rapier3d-compat/rapier.es.js';return import(path);});
const profiles:GraphicsQuality[]=['low','medium','high'];
beforeAll(()=>{
  const gradient={addColorStop:()=>{}},context=new Proxy({}, {get:(_t,k)=>k==='createLinearGradient'||k==='createRadialGradient' ? ()=>gradient:k==='measureText' ? ()=>({width:100}):()=>{}});
  vi.stubGlobal('document',{createElement:()=>({width:128,height:128,getContext:()=>context})});
  vi.spyOn(SpriteTextures,'getCharacterTexture').mockReturnValue(new THREE.Texture());vi.spyOn(SpriteTextures,'getSphereTexture').mockReturnValue(new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement));
});
afterAll(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});
describe('Visual quality profiles',()=>{
  it('bounds rendering work by the chosen resolution, including 4K, Retina and portrait windows',()=>{
    for(const [w,h] of [[1920,1080],[3840,2160],[1366,768],[1080,1920],[800,600]]) for(const quality of profiles) {
      const ratio=graphicsPixelRatio(w,h,quality),p=GRAPHICS_PROFILES[quality];expect(Math.max(w,h)*ratio).toBeLessThanOrEqual(p.longEdge+.001);expect(Math.min(w,h)*ratio).toBeLessThanOrEqual(p.shortEdge+.001);
    }
    expect(graphicsPixelRatio(1920,1080,'high')).toBe(1);expect(graphicsPixelRatio(1366,768,'high')).toBeGreaterThan(1);
    expect(graphicsPixelRatio(1920,1080,'low')).toBeLessThan(graphicsPixelRatio(1920,1080,'medium'));
  });
  it('covers custom models and mixed-material meshes, using cached variants while preserving live animations',()=>{
    const root=new THREE.Group(),source=new THREE.MeshStandardMaterial({vertexColors:true,transparent:true,opacity:.7}),label=new THREE.MeshBasicMaterial(),texture=new THREE.Texture();source.map=texture;
    const a=new THREE.Mesh(new THREE.BoxGeometry(),[source,label]),b=new THREE.Mesh(new THREE.SphereGeometry(),source);root.add(a,b);const quality=new SceneQuality(4);quality.prepare(root);
    expect(b.material).toBeInstanceOf(THREE.MeshPhongMaterial);source.opacity=.25;expect(b.material.opacity).toBe(.25);b.material.opacity=.4;expect(source.opacity).toBe(.4);
    quality.setQuality('low');const cheap=b.material;expect(cheap).toBeInstanceOf(THREE.MeshLambertMaterial);expect(texture.anisotropy).toBe(1);expect(a.material[1]).toBe(label);
    quality.setQuality('high');expect(b.material).toBeInstanceOf(THREE.MeshStandardMaterial);expect(b.material).not.toBe(source);expect(texture.anisotropy).toBe(4);
    quality.setQuality('low');expect(b.material).toBe(cheap);quality.dispose();expect(b.material).toBe(source);expect(a.material[0]).toBe(source);
  });
  it('automatically applies to editor rebuilds, newly spawned effects, and material changes',()=>{
    const scene=new THREE.Scene(),group=new THREE.Group(),quality=new SceneQuality();quality.setQuality('low');scene.add(group);quality.prepare(scene);
    const mesh:THREE.Mesh<THREE.BoxGeometry,THREE.MeshStandardMaterial|THREE.MeshPhongMaterial|THREE.MeshLambertMaterial>=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial());const original=mesh.material;group.add(mesh);expect(mesh.material).toBeInstanceOf(THREE.MeshLambertMaterial);
    const replacement=new THREE.MeshPhongMaterial({color:0xff3333});mesh.material=replacement;quality.prepare(scene);expect(mesh.material).toBeInstanceOf(THREE.MeshLambertMaterial);expect(mesh.material.color).toBe(replacement.color);
    group.remove(mesh);expect(mesh.material).toBe(replacement);group.add(mesh);quality.setQuality('high');expect(mesh.castShadow).toBe(true);
    quality.dispose();expect(mesh.castShadow).toBe(false);original.dispose();
  });
  it('keeps custom shader hooks, shared uniforms, text, transparent surfaces and masks intact',()=>{
    const root=new THREE.Group(),source=new THREE.MeshPhongMaterial({transparent:true,opacity:.65,depthWrite:false,side:THREE.DoubleSide}),uniform={value:1};
    source.userData.graphicsShaderCompatible=true;source.onBeforeCompile=shader=>{shader.uniforms.testUniform=uniform;};
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(),source),sprite=new THREE.Sprite(new THREE.SpriteMaterial());root.add(mesh,sprite);const spriteMaterial=sprite.material,quality=new SceneQuality();quality.prepare(root);
    for(const profile of profiles) {quality.setQuality(profile);expect(mesh.material.transparent).toBe(true);expect(mesh.material.depthWrite).toBe(false);expect(mesh.material.side).toBe(THREE.DoubleSide);expect(mesh.material.onBeforeCompile).toBe(source.onBeforeCompile);expect(sprite.material).toBe(spriteMaterial);}
    quality.dispose();
  });
  it('limits only tagged cosmetic particles; never hides gameplay objects',()=>{
    const root=new THREE.Group(),fx=Array.from({length:12},()=>new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial()));fx.forEach(m=>{m.userData.graphicsDetail=true;root.add(m);});
    const obstacle=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial());root.add(obstacle);const quality=new SceneQuality();quality.setQuality('low');quality.prepare(root);
    expect(fx.filter(m=>m.layers.mask!==0)).toHaveLength(3);expect(obstacle.layers.mask).toBe(1);quality.setQuality('high');expect(fx.every(m=>m.layers.mask===1)).toBe(true);quality.dispose();
  });
  it('adds distance-faded surface detail with instancing support, without touching geometry',()=>{
    const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial(),2),geometry=mesh.geometry,positions=Float32Array.from(geometry.getAttribute('position').array);
    const quality=new SceneQuality();quality.setQuality('high');quality.prepare(mesh);
    const shader={vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader,uniforms:{}};
    mesh.material.onBeforeCompile(shader as Parameters<THREE.Material['onBeforeCompile']>[0],{} as THREE.WebGLRenderer);
    expect(shader.vertexShader).toContain('instanceMatrix*qualityLocal');expect(shader.fragmentShader).toContain('qualityFade');expect(mesh.geometry).toBe(geometry);expect(geometry.getAttribute('position').array).toEqual(positions);quality.dispose();
  });
  it('changes river visual cadence and normals without changing its wave solver or surface heights',()=>{
    const samples:Map<number,number>[]=[];
    for(const profile of profiles) {
      const group=new THREE.Group(),water=new SellaWater([{x:0,y:0,z:10},{x:0,y:-3,z:-50}],18,[],group);water.createGeometry();water.setQuality(profile);water.simulator.disturb(0,15,.7,2);
      const values=new Map<number,number>();for(let i=1;i<=90;i++) {water.update(i/60);if(i%15===0) values.set(i,water.surfaceHeight({x:1,y:0,z:-10})!);}
      samples.push(values);water.dispose();
    }
    expect(samples[0]).toEqual(samples[1]);expect(samples[1]).toEqual(samples[2]);
  });
  it('preserves every collider, actor, position and collision mesh when selecting or switching quality',async()=>{
    const fixtures:LevelData[]=[WORLD_06_LEVEL_03_STAGES[2],WORLD_06_LEVEL_03_STAGES[7],WORLD_06_LEVEL_03_STAGES[8],WORLD_06_LEVEL_02_STAGES[3],WORLD_05_LEVEL_03_STAGES[1]];
    for(const data of fixtures) {
      const snapshots:string[]=[];
      for(const profile of profiles) {
        const physics=new PhysicsWorld();await physics.waitForReady();const level=new LevelBuilder().build(structuredClone(data),physics,'dragon_ball',profile);
        const snapshot=()=>{const colliders:unknown[]=[];physics.getWorld()!.forEachCollider(c=>colliders.push([c.shapeType(),c.translation(),c.rotation()]));return JSON.stringify({colliders,meshes:level.collidableMeshes.map(m=>[m.geometry.getAttribute('position').count,m.position.toArray(),m.scale.toArray()]),spawn:level.spawnPoint.toArray(),goal:level.goal?.position.toArray()});};
        const original=snapshot();for(const next of profiles) {level.setQuality?.(next);expect(snapshot()).toBe(original);}snapshots.push(original);level.destroy();physics.getWorld()?.free();
      }
      expect(snapshots[0],data.name).toBe(snapshots[1]);expect(snapshots[1],data.name).toBe(snapshots[2]);
    }
  },30000);
});
