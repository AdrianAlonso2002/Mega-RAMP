import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { Camera } from '../src/rendering/Camera';
import { naraTrainPose, NARA_DOOR_TIME } from '../src/levels/world-07/NaraRoutes';

describe('Nara train cinematic camera',()=>{
  it.each([16/9,9/16])('frames the claw tray from a closer elevated front camera at aspect %f',aspect=>{const camera=new Camera(),origin=new THREE.Vector3(0,15,0);camera.object.aspect=aspect;camera.object.updateProjectionMatrix();camera.setNaraTrainView(origin,true);camera.snapTo(origin);const direction=camera.object.getWorldDirection(new THREE.Vector3());expect(-direction.y).toBeGreaterThan(.8);expect(-direction.y).toBeLessThan(.97);expect(camera.object.position.x).toBe(0);expect(camera.object.position.z).toBe(16);const tray=[new THREE.Vector3(-12,10,-12),new THREE.Vector3(12,10,12)];for(const p of tray){p.project(camera.object);expect(Math.abs(p.x)).toBeLessThan(1);expect(Math.abs(p.y)).toBeLessThan(1);}camera.setNaraTrainView(null);camera.snapTo(origin);expect(camera.object.position.y-origin.y).toBeLessThan(5);});
  it.each([30,60,120])('keeps a stable elevated exterior frame at %i fps, without lagging behind the train',fps=>{
    const camera=new Camera(),origin=new THREE.Vector3(0,12,0),velocity=new THREE.Vector3();
    const roof=new THREE.Mesh(new THREE.BoxGeometry(7,.3,25),new THREE.MeshBasicMaterial());roof.position.set(0,16,0);roof.updateMatrixWorld(true);
    for(let frame=0;frame<fps*5;frame++) {
      const pose=naraTrainPose(frame/fps-NARA_DOOR_TIME);origin.z=pose.z;
      camera.setNaraTrainView(origin);camera.follow(origin,velocity.set(0,0,pose.speed),1/fps,[roof]);
      expect(camera.object.position.y-origin.y).toBeCloseTo(27);
      expect(camera.object.position.z-origin.z).toBeCloseTo(29);
      expect(camera.object.position.x-origin.x).toBeCloseTo(22);
    }
    const direction=camera.object.getWorldDirection(new THREE.Vector3());expect(-direction.y).toBeGreaterThan(.55);
    camera.setNaraTrainView(null);camera.snapTo(origin,[]);camera.follow(origin,velocity.set(0,0,0),1/60,[]);
    expect(camera.object.position.y-origin.y).toBeLessThan(5);
    roof.geometry.dispose();(roof.material as THREE.Material).dispose();
  });
  it('preserves the cinematic framing on respawn and returns normal framing after a stage change',()=>{
    const camera=new Camera(),origin=new THREE.Vector3(0,12,-240);camera.setNaraTrainView(origin);camera.snapTo(new THREE.Vector3(7,13,-239));
    expect(camera.object.position.y).toBe(39);expect(camera.object.position.z).toBe(-211);
    camera.setNaraTrainView(null);camera.snapTo(new THREE.Vector3(0,12,0));expect(camera.object.position.y).toBeCloseTo(15.2);
  });
});

