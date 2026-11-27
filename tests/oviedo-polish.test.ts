import {beforeAll,afterAll,describe,it,expect,vi} from 'vitest';
import * as THREE from 'three';
import {LevelBuilder} from '../src/levels/LevelBuilder';
import {PhysicsWorld} from '../src/physics/PhysicsWorld';
import {SpriteTextures} from '../src/rendering/SpriteTextures';
import {WORLD_05_LEVEL_01_STAGES} from '../src/levels/world-05/level-01-stages';
import {cachopoAngle,cachopoPivot} from '../src/levels/world-05/CachopoMotion';
vi.mock("@dimforge/rapier3d-compat", async () => {
  const path = "../node_modules/@dimforge/rapier3d-compat/rapier.es.js";
  return import(path);
});
beforeAll(() => {
  vi.spyOn(SpriteTextures, "getCharacterTexture").mockReturnValue(
    new THREE.Texture(),
  );
  vi.spyOn(SpriteTextures, "getSphereTexture").mockReturnValue(
    new THREE.CanvasTexture({ width: 1, height: 1 } as HTMLCanvasElement),
  );
  const gradient = { addColorStop: () => {} },
    context = new Proxy(
      {},
      {
        get: (_t, k) =>
          k === "createLinearGradient" || k === "createRadialGradient"
            ? () => gradient
            : k === "measureText"
              ? () => ({ width: 100 })
              : () => {},
      },
    );
  vi.stubGlobal("document", {
    createElement: () => ({
      width: 128,
      height: 128,
      getContext: () => context,
    }),
  });
});
afterAll(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});


describe('Oviedo shelves and rocking cachopo',()=>{
 it('holds each extreme for three seconds and stays smooth and bounded',()=>{
  expect(cachopoAngle(0)).toBe(0);
  for(const t of [4,5,6,7,26,27,28,29])expect(cachopoAngle(t)).toBeCloseTo(.2);
  for(const t of [15,16,17,18])expect(cachopoAngle(t)).toBeCloseTo(-.2);
  for(let t=0;t<60;t+=.013)expect(Math.abs(cachopoAngle(t))).toBeLessThanOrEqual(.200001);
  for(const t of [4,7,15,18,26])expect(Math.abs((cachopoAngle(t+.001)-cachopoAngle(t-.001))/.002)).toBeLessThan(.00001);
 });
 it('keeps the complete stage, physical surfaces, prizes and goal aligned through tilts and reset',async()=>{
  const data=structuredClone(WORLD_05_LEVEL_01_STAGES[10]),physics=new PhysicsWorld();await physics.waitForReady();
  const scene=new LevelBuilder().build(data,physics,'dragon_ball'),world=physics.getWorld()!,pivot=cachopoPivot(data);
  try {
   const {default:RAPIER}=await import('@dimforge/rapier3d-compat');
   const walls=scene.collidableMeshes.filter(mesh=>String(mesh.userData.levelObjectId??'').includes('pliegue'));
   let junctions=0;
   for(let i=0;i<walls.length;i++)for(let j=i+1;j<walls.length;j++){
    const overlap=new THREE.Box3().setFromObject(walls[i]).intersect(new THREE.Box3().setFromObject(walls[j]));
    if(overlap.isEmpty()||overlap.max.x-overlap.min.x<.01||overlap.max.z-overlap.min.z<.01)continue;
    const x=THREE.MathUtils.lerp(overlap.min.x,overlap.max.x,.413),z=THREE.MathUtils.lerp(overlap.min.z,overlap.max.z,.367);
    const hits=new THREE.Raycaster(new THREE.Vector3(x,10,z),new THREE.Vector3(0,-1,0),0,20).intersectObjects(walls);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.filter(hit=>Math.abs(hit.distance-hits[0].distance)<.00001)).toHaveLength(1);
    junctions++;
   }
   expect(junctions).toBeGreaterThan(10);
   const sample=(time:number)=>{
    scene.update(time,false);physics.step(1/60);scene.group.updateMatrixWorld(true);
    let count=0;world.forEachRigidBody(body=>{if(body.isKinematic()) {count++;expect(body.rotation().z).toBeCloseTo(scene.group.quaternion.z,5);}});expect(count).toBe(1);
    const origin=new THREE.Vector3(0,12,-30).applyMatrix4(scene.group.matrixWorld),direction=new THREE.Vector3(0,-1,0).applyQuaternion(scene.group.quaternion);
    const physical=world.castRay(new RAPIER.Ray(origin,direction),30,true);
    const visible=new THREE.Raycaster(origin,direction,0,30).intersectObjects(scene.collidableMeshes,false)[0];
    expect(physical).not.toBeNull();expect(visible).toBeDefined();expect(physical!.timeOfImpact).toBeCloseTo(visible.distance,3);
    for(const item of scene.collectibles)expect(item.position.distanceTo(item.mesh.getWorldPosition(new THREE.Vector3()))).toBeLessThan(.00001);
    expect(scene.goal!.position.distanceTo(scene.goal!.mesh.getWorldPosition(new THREE.Vector3()))).toBeLessThan(.00001);
    expect(scene.group.localToWorld(pivot.clone()).distanceTo(pivot)).toBeLessThan(.00001);
   };
   sample(4);sample(11);sample(11);
   scene.reset!();physics.step(1/60);expect(scene.group.rotation.z).toBe(0);
   world.forEachRigidBody(body=>{if(body.isKinematic())expect(body.rotation().z).toBeCloseTo(0);});
   expect(scene.collectibles).toHaveLength(data.objects.filter(o=>o.type==='collectible').length);
  }finally{scene.destroy();world.free();}
 });
 it('clips intersecting shelf tops once and keeps the display merged into few draw calls',async()=>{
  const data=structuredClone(WORLD_05_LEVEL_01_STAGES[7]),physics=new PhysicsWorld();await physics.waitForReady();const scene=new LevelBuilder().build(data,physics,'dragon_ball');
  try {
   const shelves:THREE.Object3D[]=[];scene.group.traverse(o=>{if(o.userData.neonPath&&o.userData.levelObjectId)shelves.push(o);});
   expect(shelves.length).toBeGreaterThan(20);
   expect(shelves.some(o=>o.userData.neonJunctionsClipped)).toBe(true);
   for(const shelf of shelves){let count=0;shelf.traverse(o=>{if(o instanceof THREE.Mesh){count++;for(const material of Array.isArray(o.material)?o.material:[o.material]){expect(material.polygonOffset).toBe(true);expect(material.polygonOffsetFactor).toBe(0);}}});expect(count).toBeLessThanOrEqual(2);}
  }finally{scene.destroy();physics.getWorld()?.free();}
 });
});
