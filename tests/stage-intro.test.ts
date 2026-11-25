import {describe,it,expect} from 'vitest';
import * as THREE from 'three';
import {introBounds,StageIntroPlan} from '../src/rendering/StageIntro';
import type {LevelData} from '../src/levels/LevelTypes';

describe('stage-sized introduction',()=>{
  it('excludes enormous scenery and water from playable framing',()=>{
    const data={objects:[{type:'platform',position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0},scale:{x:20,y:1,z:30}},{type:'water',position:{x:0,y:0,z:0},scale:{x:3000,y:1,z:3000}},{type:'decoration',position:{x:500,y:0,z:0},scale:{x:1000,y:1000,z:1000}}]} as LevelData;
    expect(introBounds(data,new THREE.Vector3()).getSize(new THREE.Vector3())).toEqual(new THREE.Vector3(20,1,30));
  });
  it('expands the overview for wide, tall and portrait stages and ends at the gameplay shot',()=>{
    const spawn=new THREE.Vector3(0,1,0),small=new THREE.Box3(new THREE.Vector3(-5,0,-5),new THREE.Vector3(5,1,5)),wide=new THREE.Box3(new THREE.Vector3(-40,0,-40),new THREE.Vector3(40,20,40));
    const a=new StageIntroPlan(small,spawn,0,56,1.8),b=new StageIntroPlan(wide,spawn,0,56,1.8),portrait=new StageIntroPlan(wide,spawn,0,56,.6);
    expect(b.radius).toBeGreaterThan(a.radius*2);expect(b.height).toBeGreaterThan(a.height);expect(portrait.radius).toBeGreaterThan(b.radius);
    const position=new THREE.Vector3(),look=new THREE.Vector3();b.sample(1,position,look);expect(look).toEqual(spawn);expect(position.distanceTo(new THREE.Vector3(0,4.2,6.5))).toBeLessThan(1e-8);
  });
  it('plans a smooth elevated exterior route around a wall instead of changing sides per frame',()=>{
    const wall=new THREE.Mesh(new THREE.BoxGeometry(20,15,.5),new THREE.MeshBasicMaterial());wall.position.set(0,3,3);wall.updateMatrixWorld(true);
    const bounds=new THREE.Box3(new THREE.Vector3(-10,0,-10),new THREE.Vector3(10,10,10)),spawn=new THREE.Vector3(),plan=new StageIntroPlan(bounds,spawn,0,56,1.6,6.5,3.2,[wall]);
    const ray=new THREE.Raycaster(),position=new THREE.Vector3(),previous=new THREE.Vector3(),look=new THREE.Vector3(),pivot=new THREE.Vector3(0,.65,0);
    for(let i=0;i<=300;i++){plan.sample(i/600,position,look);if(i)expect(position.distanceTo(previous)).toBeLessThan(1);previous.copy(position);ray.set(pivot,position.clone().sub(pivot).normalize());ray.far=position.distanceTo(pivot);expect(ray.intersectObject(wall)).toHaveLength(0);}
    wall.geometry.dispose();wall.material.dispose();
  });
  it('presents the exterior of a closed cabin and settles to the real player pivot',()=>{
    const cabin=new THREE.Mesh(new THREE.BoxGeometry(5,5,8),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));cabin.position.y=2;cabin.updateMatrixWorld(true);
    const spawn=new THREE.Vector3(0,1,0),plan=new StageIntroPlan(new THREE.Box3().setFromObject(cabin),spawn,0,56,1.6,6.5,3.2,[cabin]),pivot=new THREE.Vector3();
    plan.obstructionTarget(0,pivot);expect(pivot.y).toBeGreaterThan(4.5);
    plan.obstructionTarget(1,pivot);expect(pivot).toEqual(spawn);
    cabin.geometry.dispose();cabin.material.dispose();
  });
});
