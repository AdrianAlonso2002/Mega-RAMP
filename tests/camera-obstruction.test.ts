import {describe,it,expect} from 'vitest';
import * as THREE from 'three';
import {Camera} from '../src/rendering/Camera';

const zero=new THREE.Vector3();
function wall() {
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(20,15,.5),new THREE.MeshBasicMaterial());
  mesh.position.set(0,3,3);mesh.updateMatrixWorld(true);return mesh;
}
function dispose(mesh:THREE.Mesh<THREE.BoxGeometry,THREE.MeshBasicMaterial>){mesh.geometry.dispose();mesh.material.dispose();}
describe('Stable shared camera obstruction',()=>{
  it.each([30,60,120])('anticipates a wall at a corner before it blocks the player at %i FPS',fps=>{
    const camera=new Camera(),mesh=wall(),player=new THREE.Vector3(-12,0,0),velocity=new THREE.Vector3(6,0,0);
    try {
      camera.snapTo(player,[mesh]);let maximumRetraction=0,lastZ=camera.object.position.z;
      for(let i=0;i<fps*5;i++) {
        player.x+=6/fps;camera.follow(player,velocity,1/fps,[mesh]);
        maximumRetraction=Math.max(maximumRetraction,lastZ-camera.object.position.z);lastZ=camera.object.position.z;
      }
      // At this speed a hard unanticipated clamp traverses several metres in a frame.
      expect(maximumRetraction).toBeLessThan(1.1);
    }finally{dispose(mesh);}
  });
  it.each([30,60,120])('keeps the player visible during an entire introductory orbit at %i FPS',fps=>{
    const camera=new Camera(),mesh=wall(),desired=new THREE.Vector3(),look=new THREE.Vector3(0,0,-8),pivot=new THREE.Vector3(0,.65,0),ray=new THREE.Raycaster(),direction=new THREE.Vector3();
    try {
      for(let i=0;i<=fps*5;i++) {
        const angle=i/(fps*5)*Math.PI*2;
        desired.set(Math.sin(angle)*16,6,Math.cos(angle)*16);
        camera.frameIntro(desired,look,zero,i===0?0:1/fps,[mesh]);
        direction.subVectors(camera.object.position,pivot);
        ray.set(pivot,direction.clone().normalize());ray.far=direction.length();
        expect(ray.intersectObject(mesh)).toHaveLength(0);
        if(camera.object.position.z>0&&Math.abs(camera.object.position.x)<4) {
          camera.object.updateMatrixWorld(true);
          const screen=pivot.clone().project(camera.object);
          expect(Math.abs(screen.x)).toBeLessThan(1);expect(Math.abs(screen.y)).toBeLessThan(1);
        }
      }
    } finally {dispose(mesh);}
  });
  it('does not zoom out during brief gaps between adjacent obstructions',()=>{
    const camera=new Camera(),mesh=wall();
    try {
      camera.snapTo(zero,[mesh]);
      for(let i=0;i<120;i++)camera.follow(zero,zero,1/60,[mesh]);
      const close=camera.object.position.clone();
      for(let i=0;i<120;i++)camera.follow(zero,zero,1/60,i%3===0?[]:[mesh]);
      expect(camera.object.position.distanceTo(close)).toBeLessThan(.025);
      for(let i=0;i<120;i++)camera.follow(zero,zero,1/60,[]);
      expect(camera.object.position.z).toBeGreaterThan(6.3);
    } finally {dispose(mesh);}
  });
  it.each([30,60,120])('filters small wall vibrations instead of shaking at %i FPS',fps=>{
    const camera=new Camera(),mesh=wall();
    try {
      camera.snapTo(zero,[mesh]);
      for(let i=0;i<fps;i++)camera.follow(zero,zero,1/fps,[mesh]);
      let min=Infinity,max=-Infinity;
      for(let i=0;i<fps*2;i++) {
        mesh.position.z=3+Math.sin(i*1.7)*.02;mesh.updateMatrixWorld(true);
        camera.follow(zero,zero,1/fps,[mesh]);
        min=Math.min(min,camera.object.position.z);max=Math.max(max,camera.object.position.z);
        expect(camera.object.position.z).toBeLessThan(mesh.position.z-.25);
      }
      expect(max-min).toBeLessThan(.025);
    } finally {dispose(mesh);}
  });
  it('keeps the authored orbit unchanged in open space, including elevated spawns',()=>{
    const camera=new Camera(),spawn=new THREE.Vector3(50,20,-40),desired=new THREE.Vector3(65,30,-25),look=new THREE.Vector3(50,20,-48);
    camera.frameIntro(desired,look,spawn,0,[]);
    expect(camera.object.position).toEqual(desired);
    camera.object.updateMatrixWorld(true);
    expect(camera.object.getWorldDirection(new THREE.Vector3()).dot(look.clone().sub(desired).normalize())).toBeGreaterThan(.9999);
  });
  it('preserves the current shot when handing the introduction over to gameplay',()=>{
    const camera=new Camera(),mesh=wall();
    try {
      camera.frameIntro(new THREE.Vector3(2,8,16),zero,zero,0,[mesh]);
      const position=camera.object.position.clone(),rotation=camera.object.quaternion.clone();
      camera.snapTo(zero,[mesh],true);
      expect(camera.object.position).toEqual(position);
      expect(camera.object.quaternion.angleTo(rotation)).toBeLessThan(.00001);
      for(let i=0;i<120;i++)camera.follow(zero,zero,1/60,[mesh]);
      expect(camera.object.position.z).toBeLessThan(2.75);
    }finally{dispose(mesh);}
  });
});
