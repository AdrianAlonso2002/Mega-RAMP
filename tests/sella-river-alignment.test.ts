import {describe,it,expect} from "vitest";
import * as THREE from "three";
import {WORLD_05_LEVEL_03_STAGES as stages} from "../src/levels/world-05/level-03-stages";
import {createSellaModel} from "../src/levels/world-05/SellaModels";
import {buildRiverFrames,sampleSellaRiver} from "../src/levels/world-05/SellaRiver";
import type {SellaWater} from "../src/levels/world-05/SellaWater";

describe("Rendered Sella river / current alignment",()=>{
  it("matches water height, slope and flow across the full width of every MegaBajada section",()=>{
    const river=stages[10].objects.find(o=>o.type==="water")!,points=river.properties!.points as THREE.Vector3[];
    const group=createSellaModel(river)!.group,water=group.userData.sellaWater as SellaWater;
    const mesh=group.getObjectByName("sella-water") as THREE.Mesh;
    const geometry=mesh.geometry,index=geometry.index!,position=geometry.getAttribute("position"),coord=geometry.getAttribute("riverCoord"),forward=geometry.getAttribute("riverForward");
    const frames=buildRiverFrames(points),width=Number(river.properties!.width);
    water.update(1.4);
    for(let n=0;n<index.count;n+=3) {
      const a=index.getX(n),b=index.getX(n+1),c=index.getX(n+2);
      const abx=position.getX(b)-position.getX(a),abz=position.getZ(b)-position.getZ(a);
      const acx=position.getX(c)-position.getX(a),acz=position.getZ(c)-position.getZ(a);
      expect(abz*acx-abx*acz,`folded water triangle ${n/3}`).toBeGreaterThan(.00001);
    }
    const covered=new Set<number>();
    for(let n=0;n<index.count;n+=3*19) {
      const ids=[index.getX(n),index.getX(n+1),index.getX(n+2)];
      const p=new THREE.Vector3(),flow=new THREE.Vector3();let s=0;
      for(const id of ids) {p.add(new THREE.Vector3().fromBufferAttribute(position,id));flow.add(new THREE.Vector3().fromBufferAttribute(forward,id));s+=coord.getY(id);}
      p.multiplyScalar(1/3);flow.multiplyScalar(1/3);s/=3;
      let segment=0;while(segment<points.length-2 && water.arc[segment+1]<s) segment++;
      covered.add(segment);
      const sample=sampleSellaRiver(points,p,[],segment,frames,width)!;
      const height=water.surfaceHeight(p,segment);
      expect(height,`water support at section ${segment}`).not.toBeNull();
      expect(Math.abs(height!-p.y),JSON.stringify({segment,s,p:p.toArray(),height,sample})).toBeLessThan(.08);
      const horizontal=Math.hypot(flow.x,flow.z);
      expect(sample.dx*flow.x/horizontal+sample.dz*flow.z/horizontal,`current direction at ${segment}`).toBeGreaterThan(.999);
      expect(sample.dy,`slope at ${segment}`).toBeCloseTo(flow.y/horizontal,3);
    }
    expect(covered.size).toBe(points.length-1);
    water.dispose();
  });

  it("keeps connected steep joins wet on both sides of a right-angle bend",()=>{
    const points=[new THREE.Vector3(0,30,20),new THREE.Vector3(0,20,0),new THREE.Vector3(30,0,0)],frames=buildRiverFrames(points);
    for(const segment of [0,1]) for(const t of [.02,.2,.8,.98]) for(const side of [-8,0,8]) {
      const a=points[segment],b=points[segment+1],fa=frames[segment],fb=frames[segment+1];
      const p=new THREE.Vector3().lerpVectors(a,b,t);
      p.x+=THREE.MathUtils.lerp(fa.x,fb.x,t)*side;p.z+=THREE.MathUtils.lerp(fa.z,fb.z,t)*side;
      const sample=sampleSellaRiver(points,p,[],segment,frames,24)!;
      expect(sample.y).toBeCloseTo(p.y,6);expect(sample.t).toBeCloseTo(t,6);
      expect(sample.side).toBeCloseTo(side,6);
    }
  });
});
