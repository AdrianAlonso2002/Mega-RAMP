import {describe,it,expect} from 'vitest';
import * as THREE from 'three';
import {ShadowTexelGrid} from '../src/rendering/ShadowTexelGrid';

describe('stable directional shadow texels',()=>{
  it.each([[20,35,15],[-25,40,10],[12,25,-30]])('keeps a stationary world point at the same texel phase under light %j',(...values)=>{
    const offset=new THREE.Vector3(...values),grid=new ShadowTexelGrid(),sun=new THREE.DirectionalLight(),focus=new THREE.Vector3(),point=new THREE.Vector3(5,.4,-12),uv=new THREE.Vector3();
    Object.assign(sun.shadow.camera,{left:-36,right:36,top:36,bottom:-36,near:1,far:150});sun.shadow.camera.updateProjectionMatrix();
    let firstX=0,firstY=0;
    for(let i=0;i<300;i++) {
      focus.set(Math.sin(i*.017)*30,8+Math.sin(i*.03)*6,i*.08);grid.snap(focus,offset,72,72,2048,2048);
      sun.position.copy(focus).add(offset);sun.target.position.copy(focus);sun.updateMatrixWorld(true);sun.target.updateMatrixWorld(true);sun.shadow.updateMatrices(sun);
      uv.copy(point).applyMatrix4(sun.shadow.matrix).multiplyScalar(2048);
      if(!i){firstX=uv.x;firstY=uv.y;}
      const dx=uv.x-firstX,dy=uv.y-firstY;
      expect(Math.abs(dx-Math.round(dx))).toBeLessThan(1e-7);
      expect(Math.abs(dy-Math.round(dy))).toBeLessThan(1e-7);
    }
  });
  it('holds the same shadow origin for sub-texel camera movements',()=>{
    const grid=new ShadowTexelGrid(),offset=new THREE.Vector3(20,35,15),a=new THREE.Vector3(),b=new THREE.Vector3(.001,.001,.001);
    grid.snap(a,offset,72,72,2048,2048);grid.snap(b,offset,72,72,2048,2048);expect(a.distanceTo(b)).toBeLessThan(1e-10);
  });
});
