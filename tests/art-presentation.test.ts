import {describe,it,expect} from 'vitest';
import * as THREE from 'three';
import {artDirection,surfaceFamily,SURFACE_STYLES} from '../src/rendering/ArtDirection';
import {ContactShadows} from '../src/rendering/ContactShadows';
import {WorldAtmosphere} from '../src/rendering/WorldAtmosphere';
import {SceneQuality} from '../src/rendering/SceneQuality';
import type {LevelData} from '../src/levels/LevelTypes';
const data:LevelData={id:'visual-test',world:6,level:3,stage:1,name:'Oxford',timeLimit:100,spawn:{x:0,y:1,z:0},objects:[]};
describe('Art direction and visual-only presentation',()=>{
  it('uses distinct world palettes, balanced sunlight and softer interiors without reclassifying dark stages',()=>{
    expect(new Set(Array.from({length:8},(_,i)=>artDirection(i+1,1).horizon)).size).toBe(8);
    const outdoor=artDirection(6,3,data),indoor=artDirection(6,3,{...data,name:'The Great Hall'}),night=artDirection(6,1,{...data,name:'Tinieblas',properties:{pitchBlack:true}});
    expect(outdoor.ambient+outdoor.sunIntensity+outdoor.fillIntensity).toBeLessThan(4);expect(indoor.interior).toBe(true);expect(indoor.sunIntensity).toBeLessThan(outdoor.sunIntensity);expect(indoor.weather).toBe('none');expect(night.dark).toBe(true);expect(night.weather).toBe('none');
    expect(artDirection(3,4,{...data,world:3,level:4,stage:9,name:'Ruta Nocturna'}).dark).toBe(true);
  });
  it('gives wood, stone, foliage, food, metal and glass coherent surface responses',()=>{
    for(const [hint,family] of [['mesa-madera','wood'],['oxford_college','stone'],['metal-acero','metal'],['Rodilla-sandwich','food'],['oxford_buzz','plastic'],['cristal','glass'],['árbol','foliage'],['river','liquid']] as const) expect(surfaceFamily(hint)).toBe(family);
    expect(surfaceFamily('market-sign')).not.toBe('liquid');expect(surfaceFamily('panel')).not.toBe('food');
    expect(SURFACE_STYLES.stone.roughness).toBeGreaterThan(SURFACE_STYLES.metal.roughness);expect(SURFACE_STYLES.foliage.metalness).toBe(0);
    const source=new THREE.MeshStandardMaterial({roughness:.3,metalness:.6});source.userData.graphicsSurface='wood';const mesh=new THREE.Mesh(new THREE.BoxGeometry(),source),quality=new SceneQuality();quality.setQuality('high');quality.prepare(mesh);
    expect(mesh.material.roughness).toBe(.78);expect(mesh.material.metalness).toBe(0);expect(source.roughness).toBe(.3);expect(source.metalness).toBe(.6);quality.dispose();
  });
  it('adds a clear coat and restrained rim to the player only at high quality, retaining its transparent shell and sprite',()=>{
    const source=new THREE.MeshPhongMaterial({transparent:true,opacity:.55,depthWrite:false});source.userData.graphicsSurface='glass';source.userData.graphicsPlayerBall=true;
    const mesh:THREE.Mesh=new THREE.Mesh(new THREE.SphereGeometry(),source),sprite=new THREE.Sprite(new THREE.SpriteMaterial()),root=new THREE.Group(),quality=new SceneQuality();root.add(mesh,sprite);quality.prepare(root);const originalSprite=sprite.material;
    quality.setQuality('high');expect(mesh.material).toBeInstanceOf(THREE.MeshPhysicalMaterial);const high=mesh.material as THREE.MeshPhysicalMaterial;expect(high.clearcoat).toBe(.85);expect(high.opacity).toBe(.55);expect(high.depthWrite).toBe(false);expect(high.customProgramCacheKey()).toContain('ball-rim');expect(sprite.material).toBe(originalSprite);
    quality.setQuality('low');expect(mesh.material).toBeInstanceOf(THREE.MeshLambertMaterial);quality.dispose();expect(mesh.material).toBe(source);
  });
  it('clips the contact shadow to a narrow walkway rather than painting over the void',()=>{
    const root=new THREE.Group(),floor=new THREE.Mesh(new THREE.BoxGeometry(.6,.2,8),new THREE.MeshBasicMaterial());floor.position.y=-.1;root.add(floor);root.updateWorldMatrix(true,true);
    const service=new ContactShadows();service.bind(data,root,[floor]);service.update(1,new THREE.Vector3(0,1,0));const shadow=service.group.children[1] as THREE.Mesh;
    expect(shadow.visible).toBe(true);const positions=shadow.geometry.getAttribute('position');expect(positions.count).toBeGreaterThan(0);
    const cached=shadow.geometry;service.update(1,new THREE.Vector3(0,1,0));expect(shadow.geometry).toBe(cached);
    for(let i=0;i<positions.count;i++) expect(Math.abs(positions.getX(i))).toBeLessThanOrEqual(.301);
    for(let i=0;i<positions.count;i++) expect(positions.getY(i)).toBeGreaterThan(.002); // Physically separated from the floor: no coplanar flicker.
    service.update(1,new THREE.Vector3(2,1,0));expect(shadow.visible).toBe(false);service.dispose();
  });
  it('follows a moved receiver and fades with height, without changing its geometry or transform',()=>{
    const root=new THREE.Group(),floor=new THREE.Mesh(new THREE.BoxGeometry(6,.2,8),new THREE.MeshBasicMaterial());floor.position.y=-.1;root.add(floor);root.updateWorldMatrix(true,true);
    const geometry=floor.geometry,vertices=Float32Array.from(geometry.getAttribute('position').array),service=new ContactShadows();service.bind(data,root,[floor]);service.update(1,new THREE.Vector3(0,1,0));const shadow=service.group.children[1] as THREE.Mesh,close=(shadow.material as THREE.MeshBasicMaterial).opacity;
    service.update(1,new THREE.Vector3(0,5,0));expect((shadow.material as THREE.MeshBasicMaterial).opacity).toBeLessThan(close);
    floor.position.y=2;root.updateWorldMatrix(true,true);service.update(1,new THREE.Vector3(0,3,0));expect(shadow.geometry.getAttribute('position').getY(0)).toBeCloseTo(2.1);
    expect(floor.geometry).toBe(geometry);expect(geometry.getAttribute('position').array).toEqual(vertices);expect(floor.position.y).toBe(2);service.dispose();
  });
  it('projects static contact shadows only under resting props and removes their cost in low mode',()=>{
    const root=new THREE.Group(),floor=new THREE.Mesh(new THREE.BoxGeometry(10,.2,10),new THREE.MeshBasicMaterial()),prop=new THREE.Mesh(new THREE.BoxGeometry(2,1,2),new THREE.MeshBasicMaterial());floor.position.y=-.1;prop.position.y=.5;prop.userData.levelObjectId='test-table';root.add(floor,prop);root.updateWorldMatrix(true,true);
    const stage:LevelData={...data,objects:[{id:'test-table',type:'decoration',position:{x:0,y:.5,z:0},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1},properties:{hasCollision:true,subType:'table'}}]};
    const service=new ContactShadows();service.bind(stage,root,[floor,prop]);expect(service.group.children[0].children).toHaveLength(1);service.setQuality('low');expect(service.group.children[0].children).toHaveLength(0);service.setQuality('high');expect(service.group.children[0].children).toHaveLength(1);service.dispose();
  });
  it('uses fixed particle budgets and suppresses weather and clouds inside or in darkness',()=>{
    const service=new WorldAtmosphere(),focus=new THREE.Vector3(),goal={mesh:new THREE.Group(),position:new THREE.Vector3(),reached:false};service.configure(artDirection(6,3,data));
    const particles=service.group.children[0] as THREE.Points;
    for(const [quality,count] of [['low',0],['medium',32],['high',96]] as const) {service.setQuality(quality);service.update(.1,focus,goal);expect(particles.geometry.drawRange.count).toBe(count);}
    service.configure(artDirection(6,3,{...data,name:'The Great Hall'}));service.update(.1,focus,goal);expect(particles.visible).toBe(false);expect(service.group.children.slice(3).every(c=>!c.visible)).toBe(true);
    service.configure(artDirection(6,1,{...data,properties:{pitchBlack:true}}));service.update(.1,focus,goal);expect(service.group.visible).toBe(false);service.dispose();
  });
});
