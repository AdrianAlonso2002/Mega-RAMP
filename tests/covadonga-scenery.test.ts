import {describe,it,expect} from "vitest";
import * as THREE from "three";
import {WORLD_05_LEVEL_04_STAGES as stages} from "../src/levels/world-05/level-04-stages";
import {createCovadongaModel,previewCovadongaActor,covadongaCowPatrol} from "../src/levels/world-05/CovadongaModels";
import {distanceToSceneryRoute,sceneryGroundHeight,type SceneryGround} from "../src/levels/world-05/CovadongaScenery";
import {applyRequestedStageUpdates} from "../src/levels/RequestedStageUpdates";
import {buildRiverFrames} from "../src/levels/world-05/SellaRiver";

describe("Grounded Covadonga scenery and cows",()=>{
  it("renders one mountain top below each cannon-stage platform, without overlapping rock and grass caps",()=>{
    const outcrops=stages[9].objects.filter(o=>o.properties?.subType==="asturias_cov_outcrop");
    expect(outcrops).toHaveLength(2);
    for(const object of outcrops) {
      const model=createCovadongaModel(object)!;model.group.updateMatrixWorld(true);
      for(const [x,z] of [[.73,-8.19],[8.13,-19.73],[-9.27,-4.31]]) {
        const origin=model.group.localToWorld(new THREE.Vector3(x,.5,z));
        const ray=new THREE.Raycaster(origin,new THREE.Vector3(0,-1,0),0,object.scale.y);
        const hits=ray.intersectObjects(model.meshes,false);
        expect(hits).toHaveLength(1);
        expect(hits[0].point.y).toBeCloseTo(object.position.y-.12*object.scale.y,4);
        expect(hits[0].point.y).toBeLessThan(object.position.y-.05);
      }
    }
  });
  it("keeps animated water out of all seven fountain holes and leaves gravity-driven droplets outside the solid colliders",()=>{
    const source=stages[8].objects.find(o=>o.properties?.covadongaAction==="fountain")!,model=createCovadongaModel(source)!;
    previewCovadongaActor(source,model.group,1);model.group.updateMatrixWorld(true);
    const tiers=model.group.userData.fountainTiers as THREE.Group[];
    for(let i=0;i<7;i++) {
      const tier=tiers[i],water=tier.getObjectByName("cov-fountain-water") as THREE.Mesh;
      const y=50-i*6.5,angle=i*Math.PI*2/7,local=new THREE.Vector3(Math.cos(angle)*5.2,y+.4,Math.sin(angle)*5.2);
      const ray=new THREE.Raycaster(tier.localToWorld(local),new THREE.Vector3(0,-1,0),0,1);
      expect(ray.intersectObject(water,false)).toHaveLength(0);
      ray.set(tier.localToWorld(new THREE.Vector3(3,y+.4,0)),new THREE.Vector3(0,-1,0));
      if(i!==0) expect(ray.intersectObject(water,false).length).toBeGreaterThan(0);
      expect(model.meshes.includes(water)).toBe(false);
      const drops=tier.getObjectByName("cov-fountain-droplets") as THREE.InstancedMesh,matrix=new THREE.Matrix4();drops.getMatrixAt(0,matrix);
      expect(matrix.elements[13]).toBeLessThan(y);expect(matrix.elements[13]).toBeGreaterThan(y-7);
    }
  });
  it("gives the cannon opaque inner walls and a closed breech",()=>{
    const object=stages[9].objects.find(o=>o.properties?.covadongaAction==="cannon")!,model=createCovadongaModel(object)!;
    model.group.updateMatrixWorld(true);
    const barrel=model.group.getObjectByName("cov-cannon-barrel")!;
    const origin=barrel.localToWorld(new THREE.Vector3(0,0,-3.6)),direction=new THREE.Vector3(0,0,1);
    const ray=new THREE.Raycaster(origin,direction,0,7);
    expect(ray.intersectObject(barrel,true).length).toBeGreaterThan(0);
    barrel.traverse(o=>{if(o instanceof THREE.Mesh) for(const m of Array.isArray(o.material) ? o.material:[o.material]) {expect(m.transparent).toBe(false);expect(m.opacity).toBe(1);}});
  });
  it("updates saved mine rails and goal together while preserving custom decorations",()=>{
    const saved=structuredClone(stages[6]);delete saved.properties!.covadongaMineRevision;
    const extra={...structuredClone(saved.objects[0]),id:"obj-custom-mine"};saved.objects.push(extra);
    saved.objects.find(o=>o.type==="goal")!.position.z=0;
    const updated=applyRequestedStageUpdates(saved,5,4,6);
    expect(updated.objects.find(o=>o.type==="goal")).toEqual(stages[6].objects.find(o=>o.type==="goal"));
    expect(updated.objects.find(o=>o.id===extra.id)).toEqual(extra);
  });
  it("keeps the DS reference straight, outer bend and tight inner loop continuous with genuinely narrow edges",()=>{
    const road=stages[10].objects.find(o=>o.id==="w5s410-back-round")!;
    const points=road.properties!.points as THREE.Vector3[],widths=road.properties!.widths as number[],frames=buildRiverFrames(points);
    expect(widths[0]).toBe(12);expect(widths.at(-1)).toBeCloseTo(.6);
    expect(widths.filter(w=>w<1.5).length).toBeGreaterThan(90);
    const model=createCovadongaModel(road)!;model.group.updateMatrixWorld(true);
    const surface=model.group.getObjectByName("cov-road-surface")!;
    for(let i=1;i<points.length-1;i++) {
      const ray=new THREE.Raycaster(new THREE.Vector3(points[i].x,29,points[i].z),new THREE.Vector3(0,-1,0),0,2);
      expect(ray.intersectObject(surface,false).length,`support at ${i}`).toBeGreaterThan(0);
      expect(widths[i]).toBeLessThanOrEqual(widths[i-1]+1e-8);
    }
    for(const i of [340,360,380]) {
      const p=points[i],f=frames[i],offset=widths[i]/2+.15;
      const ray=new THREE.Raycaster(new THREE.Vector3(p.x+f.x*offset,29,p.z+f.z*offset),new THREE.Vector3(0,-1,0),0,2);
      expect(ray.intersectObject(surface,false)).toHaveLength(0);
    }
  });
  it("replaces saved finale geometry and relocates the goal in game and editor while retaining custom objects",()=>{
    const saved=structuredClone(stages[10]);delete saved.properties!.backRoundRouteRevision;
    saved.spawn.z=24;
    const road=saved.objects.find(o=>o.id==="w5s410-back-round")!;road.properties!.widths=[6.3,1.3];
    const extra={...structuredClone(saved.objects[0]),id:"obj-custom-keep"};saved.objects.push(extra);
    const updated=applyRequestedStageUpdates(saved,5,4,10);
    expect(updated.objects.find(o=>o.id===extra.id)).toEqual(extra);
    expect(updated.objects.find(o=>o.id===road.id)).toEqual(stages[10].objects.find(o=>o.id===road.id));
    expect(updated.spawn).toEqual(stages[10].spawn);
    expect(applyRequestedStageUpdates(structuredClone(updated),5,4,10)).toEqual(updated);
  });
  it("keeps every decorative peak outside the entire finale spiral and roots trees on rendered ground",()=>{
    const object=stages[10].objects.find(o=>o.properties?.subType==="asturias_cov_landscape")!;
    const model=createCovadongaModel(object)!,ground=model.group.userData.covadongaGround as SceneryGround;
    model.group.updateMatrixWorld(true);
    const solid=model.group.getObjectByName("cov-stone")!;
    expect(ground.sites.some(s=>s.kind==="tree")).toBe(true);expect(ground.sites.some(s=>s.kind==="peak")).toBe(true);
    expect(ground.lakes).toHaveLength(2);
    for(const site of ground.sites) {
      expect(distanceToSceneryRoute(ground.route,site.x,site.z)-site.radius).toBeGreaterThan(ground.width/2+6.9);
      if(site.kind==="tree") {
        const y=sceneryGroundHeight(ground,site.x,site.z),ray=new THREE.Raycaster(new THREE.Vector3(site.x,y+2,site.z),new THREE.Vector3(0,-1,0),0,5);
        const hit=ray.intersectObject(solid,false)[0];expect(hit).toBeDefined();expect(hit.point.y).toBeCloseTo(y,3);
      }
    }
    for(const lake of ground.lakes) {
      expect(sceneryGroundHeight(ground,lake.x,lake.z)).toBeLessThan(lake.y-2);
      expect(sceneryGroundHeight(ground,lake.x+lake.rx*1.06,lake.z)).toBeGreaterThan(lake.y-.3);
    }
  });
  it("provides all four distinct coats with articulated head, tail and batched animated legs",()=>{
    expect(new Set(stages[7].objects.filter(o=>o.properties?.covadongaAction==="cow").map(o=>o.properties!.cowBreed))).toEqual(new Set(["brown","dairy","black","white"]));
    const source=stages[7].objects.find(o=>o.properties?.covadongaAction==="cow")!;
    const colours=new Set<string>();
    for(const breed of ["brown","dairy","black","white"]) {
      const object=structuredClone(source);object.properties!.cowBreed=breed;
      const model=createCovadongaModel(object)!,legs=model.group.getObjectByName("cov-cow-legs") as THREE.InstancedMesh;
      expect(legs.count).toBe(4);expect(model.group.getObjectByName("cov-cow-head")).toBeDefined();expect(model.group.getObjectByName("cov-cow-tail")).toBeDefined();
      const matrix=new THREE.Matrix4();legs.getMatrixAt(0,matrix);const before=matrix.toArray();
      previewCovadongaActor(object,model.group,1.3);legs.getMatrixAt(0,matrix);expect(matrix.toArray()).not.toEqual(before);
      const body=model.meshes[0].geometry.getAttribute("color");colours.add([body.getX(0),body.getY(0),body.getZ(0)].join(","));
      let calls=0;model.group.traverse(child=>{if(child instanceof THREE.Mesh) calls++;});expect(calls).toBeLessThanOrEqual(7);
    }
    expect(colours.size).toBe(4);
  });
  it("brakes and turns around continuously instead of flipping instantly at patrol ends",()=>{
    const period=Math.PI*2/.6,eps=.0001;
    for(const t of [period*.37,period*.5,period*.87,period]) {
      const a=covadongaCowPatrol(t-eps,.6,0,3),b=covadongaCowPatrol(t+eps,.6,0,3);
      expect(Math.abs(a.offset-b.offset)).toBeLessThan(.001);
      expect(Math.abs(Math.atan2(Math.sin(a.yaw-b.yaw),Math.cos(a.yaw-b.yaw)))).toBeLessThan(.001);
    }
  });
  it("upgrades old scenery and adds the basilica rock without overwriting edited paths or custom objects",()=>{
    const saved=structuredClone(stages[9]);delete saved.properties!.covadongaSceneryRevision;
    saved.objects=saved.objects.filter(o=>o.properties?.subType!=="asturias_cov_outcrop");
    const extra={...structuredClone(saved.objects[0]),id:"obj-custom-keep"};saved.objects.push(extra);
    const original=structuredClone(saved.objects.find(o=>o.properties?.subType==="asturias_cov_basilica"));
    const updated=applyRequestedStageUpdates(saved,5,4,9);
    expect(updated.objects.find(o=>o.id===extra.id)).toEqual(extra);
    expect(updated.objects.find(o=>o.properties?.subType==="asturias_cov_basilica")).toEqual(original);
    expect(updated.objects.filter(o=>o.properties?.subType==="asturias_cov_outcrop")).toHaveLength(2);
    expect(updated.properties!.covadongaSceneryRevision).toBe("grounded-picos-v2");
  });
});
