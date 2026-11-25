import {describe,it,expect} from 'vitest';
import * as THREE from 'three';
import {createStaticStallShadow} from '../src/rendering/StaticStallShadow';
import {SceneQuality} from '../src/rendering/SceneQuality';
import {disposeStageResources} from '../src/rendering/StageResources';

describe('fixed market stall shadows',()=>{
  it.each([-Math.PI/2,Math.PI/2])('clips the softened silhouette to the plaza and keeps it fixed across quality changes at yaw %i',yaw=>{
    const scene=new THREE.Scene(),stall=new THREE.Group(),quality=new SceneQuality();
    const roof=new THREE.Mesh(new THREE.BoxGeometry(5.8,.065,5),new THREE.MeshStandardMaterial());roof.position.y=4;
    const floor=new THREE.Mesh(new THREE.BoxGeometry(5.4,.8,4.4),new THREE.MeshStandardMaterial());
    stall.add(roof,floor);stall.position.set(-7.4,0,34);stall.rotation.y=yaw;scene.add(stall);
    const bounds=new THREE.Box3(new THREE.Vector3(-10,-.4,-36),new THREE.Vector3(10,.4,36)),shadow=createStaticStallShadow(stall,[24,38,18],bounds)!;scene.add(shadow);
    const positions=shadow.geometry.getAttribute('position'),snapshot=Array.from(positions.array),color=shadow.geometry.getAttribute('color');
    expect(color.itemSize).toBe(4);expect(Array.from(color.array).some((n,i)=>i%4===3&&n===0)).toBe(true);
    for(let i=0;i<positions.count;i++){expect(positions.getX(i)).toBeGreaterThanOrEqual(-10);expect(positions.getX(i)).toBeLessThanOrEqual(10);expect(positions.getZ(i)).toBeLessThanOrEqual(36);expect(positions.getZ(i)).toBeGreaterThanOrEqual(-36);expect(positions.getY(i)).toBeCloseTo(.415);}
    const ray=new THREE.Raycaster(new THREE.Vector3(positions.getX(0),5,positions.getZ(0)),new THREE.Vector3(0,-1,0));shadow.updateMatrixWorld(true);expect(ray.intersectObject(shadow).length).toBeGreaterThan(0);
    for(const profile of ['high','medium','low','high'] as const){quality.setQuality(profile);quality.prepare(scene);for(let i=0;i<30;i++)quality.prepare(scene);expect(roof.castShadow).toBe(false);expect(roof.receiveShadow).toBe(false);expect(floor.castShadow).toBe(false);expect(shadow.castShadow).toBe(false);expect(Array.from(positions.array)).toEqual(snapshot);}
    quality.dispose();disposeStageResources(scene);
  });
});
