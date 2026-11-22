import {describe,expect,it} from 'vitest';
import * as THREE from 'three';
import {Camera} from '../src/rendering/Camera';
function simulate(velocity:THREE.Vector3,fps=60,jitter=false){
  const camera=new Camera(),target=new THREE.Vector3();camera.snapTo(target);
  for(let i=0;i<fps;i++){target.addScaledVector(velocity,1/fps);camera.follow(target,velocity,1/fps,[]);}
  const movingOffset=camera.object.position.clone().sub(target);
  for(let i=0;i<fps*4;i++)camera.follow(target,jitter?new THREE.Vector3(Math.sin(i)*.04,0,Math.cos(i)*.04):new THREE.Vector3(),1/fps,[]);
  const direction=camera.object.getWorldDirection(new THREE.Vector3());direction.y=0;direction.normalize();
  return {camera,target,direction,movingOffset};
}
describe('Idle camera remembers the actual last movement',()=>{
  it.each([[-5,0],[5,0],[0,5],[0,-5],[-3,-4],[3,4],[-.8,0]])('faces movement (%s,%s) after stopping, with the correct lateral sign',(x,z)=>{
    const velocity=new THREE.Vector3(x,0,z),result=simulate(velocity);
    expect(result.direction.dot(velocity.clone().normalize())).toBeGreaterThan(.995);
    expect(Math.abs(result.movingOffset.x)).toBeLessThan(.5);
  });
  it('ignores tiny resting contact jitter and converges consistently at 30 and 120 fps',()=>{
    const velocity=new THREE.Vector3(-4,0,-3),slow=simulate(velocity,30,true),fast=simulate(velocity,120,true);
    expect(slow.direction.dot(velocity.clone().normalize())).toBeGreaterThan(.995);
    expect(slow.camera.object.position.distanceTo(fast.camera.object.position)).toBeLessThan(.05);
  });
  it('waits briefly before aligning and preserves a manually chosen idle view',()=>{
    const camera=new Camera(),target=new THREE.Vector3();camera.snapTo(target);
    camera.follow(target,new THREE.Vector3(-5,0,0),1/60,[]);
    for(let i=0;i<30;i++)camera.follow(target,new THREE.Vector3(),1/60,[]);
    expect(Math.abs(camera.object.position.x)).toBeLessThan(.01);
    camera.rotateYaw(.6);for(let i=0;i<240;i++)camera.follow(target,new THREE.Vector3(),1/60,[]);
    expect(Math.atan2(-camera.object.position.x,camera.object.position.z)).toBeCloseTo(.6,3);
  });
});
