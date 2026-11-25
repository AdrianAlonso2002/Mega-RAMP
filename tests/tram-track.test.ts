import {describe,it,expect} from 'vitest';
import * as THREE from 'three';
import {tramTrack,createClosedTramRails,TramPassengerGuard} from '../src/levels/TramTrack';

describe('closed tram circuit and cabin',()=>{
  it('joins every straight and corner continuously, with a closed tangent',()=>{
    const track=tramTrack(24,24,4),a={x:0,z:0,yaw:0},b={...a};
    for(let d=0;d<track.perimeter;d+=.01){track.sample(d,a);track.sample(d+.01,b);expect(Math.hypot(a.x-b.x,a.z-b.z)).toBeLessThanOrEqual(.010001);expect(Math.cos(a.yaw-b.yaw)).toBeGreaterThan(.99999);}
    track.sample(0,a);track.sample(track.perimeter,b);expect(a).toEqual(b);
    expect(a.x).toBe(-8);expect(a.z).toBe(12);
  });
  it('renders a closed bed, two complete rails and instanced ties in three draw calls',()=>{
    const group=createClosedTramRails(24,24,4);expect(group.children).toHaveLength(3);
    const bed=group.children[0] as THREE.Mesh,positions=bed.geometry.getAttribute('position');
    for(let i=0;i<4;i++)for(let axis=0;axis<3;axis++)expect(positions.getComponent(i,axis)).toBeCloseTo(positions.getComponent(positions.count-4+i,axis));
    group.updateMatrixWorld(true);const ray=new THREE.Raycaster(new THREE.Vector3(12,5,8),new THREE.Vector3(0,-1,0));expect(ray.intersectObject(bed).length).toBeGreaterThan(0);
    group.traverse(node=>{if(node instanceof THREE.Mesh){node.geometry.dispose();for(const material of Array.isArray(node.material)?node.material:[node.material])material.dispose();}});
  });
  it.each([30,60,120])('keeps a fast ball inside the floor, walls and roof through turns at %i FPS',fps=>{
    const guard=new TramPassengerGuard(3.6,.4,7.2),track=tramTrack(24,24,4),pose={x:0,z:0,yaw:0},q=new THREE.Quaternion(),origin=new THREE.Vector3(),local=new THREE.Vector3(),position=new THREE.Vector3(-8,1.6,12),velocity=new THREE.Vector3();
    for(let i=0;i<fps*30;i++) {
      track.sample(i/fps*4.2,pose);origin.set(pose.x,.65,pose.z);q.setFromAxisAngle(new THREE.Vector3(0,1,0),pose.yaw);
      velocity.set(35*Math.sin(i*.4),i%2?20:-20,35*Math.cos(i*.4));position.addScaledVector(velocity,1/fps);
      guard.constrain(position,velocity,origin,q);
      local.copy(position).sub(origin).applyQuaternion(q.clone().invert());
      expect(Math.abs(local.x)).toBeLessThanOrEqual(.790001);expect(Math.abs(local.z)).toBeLessThanOrEqual(2.590001);expect(local.y).toBeGreaterThanOrEqual(.959999);expect(local.y).toBeLessThanOrEqual(1.890001);
    }
    guard.reset();position.set(100,0,100);expect(guard.constrain(position,velocity,origin,q)).toBe(false);
  });
});
