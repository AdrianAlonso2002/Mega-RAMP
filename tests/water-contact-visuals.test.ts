import {describe,it,expect} from 'vitest';
import * as THREE from 'three';
import {fluidCameraSubmerged} from '../src/rendering/FluidContact';
import {ambientWaterWave} from '../src/rendering/WaterAppearance';
import {WaterWaveSimulator} from '../src/rendering/WaterSimulator';

describe('Water surface and submerged camera separation',()=>{
  it('never tints solid water, including a camera clipping through its surface',()=>{
    for(const y of [2,1,.5,0,-1]) expect(fluidCameraSubmerged(y,1,-2,false,true)).toBe(false);
  });
  it('only enters under the surface and uses hysteresis without extending below the volume',()=>{
    expect(fluidCameraSubmerged(1.75,1,-2,true,false)).toBe(false);
    expect(fluidCameraSubmerged(.9,1,-2,true,false)).toBe(false);
    expect(fluidCameraSubmerged(.8,1,-2,true,false)).toBe(true);
    expect(fluidCameraSubmerged(.9,1,-2,true,true)).toBe(true);
    expect(fluidCameraSubmerged(.98,1,-2,true,true)).toBe(false);
    expect(fluidCameraSubmerged(-3,1,-2,true,true)).toBe(false);
  });
  it('keeps visible ambient swells bounded and their lighting normals aligned',()=>{
    const slope=new THREE.Vector2(),eps=.0001;
    let min=Infinity,max=-Infinity;
    for(let t=0;t<20;t+=.3){
      const height=ambientWaterWave(2,3,t,slope);min=Math.min(min,height);max=Math.max(max,height);
      expect(Math.abs(height)).toBeLessThanOrEqual(.048);
      expect(slope.x).toBeCloseTo((ambientWaterWave(2+eps,3,t)-ambientWaterWave(2-eps,3,t))/(2*eps),6);
      expect(slope.y).toBeCloseTo((ambientWaterWave(2,3+eps,t)-ambientWaterWave(2,3-eps,t))/(2*eps),6);
    }
    expect(max-min).toBeGreaterThan(.04);
  });
  it('joins adjacent block meshes without a height or normal seam',()=>{
    const simulator=new WaterWaveSimulator(8,4,24),left=new THREE.Mesh(new THREE.PlaneGeometry(4,4,8,8).rotateX(-Math.PI/2)),right=left.clone();right.geometry=left.geometry.clone();
    simulator.applyToMesh(left,-2,0,1.4);simulator.applyToMesh(right,2,0,1.4);
    const lp=left.geometry.getAttribute('position'),rp=right.geometry.getAttribute('position'),ln=left.geometry.getAttribute('normal'),rn=right.geometry.getAttribute('normal');
    for(let row=0;row<9;row++){
      const a=row*9+8,b=row*9;
      expect(lp.getY(a)).toBeCloseTo(rp.getY(b),7);
      expect(ln.getX(a)).toBeCloseTo(rn.getX(b),7);expect(ln.getZ(a)).toBeCloseTo(rn.getZ(b),7);
    }
    left.geometry.dispose();right.geometry.dispose();
  });
});
