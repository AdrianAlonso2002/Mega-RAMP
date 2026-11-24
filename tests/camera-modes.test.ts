import {afterEach,describe,expect,it,vi} from 'vitest';
import * as THREE from 'three';
import {Camera} from '../src/rendering/Camera';
import {stageStartYaw} from '../src/rendering/StageHeading';
import {ProgressionManager} from '../src/progression/ProgressionManager';
import {WORLD_07_LEVEL_02_STAGES as stages} from '../src/levels/world-07/level-02-stages';
afterEach(()=>vi.unstubAllGlobals());
describe('Selectable chase camera and stage departure framing',()=>{
  it('ignores tiny steering corrections and eases into a real turn',()=>{
    const camera=new Camera(),target=new THREE.Vector3();camera.setMode(1);camera.snapTo(target);
    for(let i=0;i<120;i++){const a=Math.sin(i)*.05;camera.follow(target,new THREE.Vector3(Math.sin(a)*8,0,-Math.cos(a)*8),1/60,[]);}
    expect(Math.abs(camera.object.position.x)).toBeLessThan(.01);
    for(let i=0;i<30;i++)camera.follow(target,new THREE.Vector3(8,0,0),1/60,[]);
    const angle=Math.atan2(-camera.object.position.x,camera.object.position.z);expect(angle).toBeGreaterThan(.1);expect(angle).toBeLessThan(1.1*.5);
  });
  it.each([30,60,120])('follows turns during movement at %i fps, pulls back with speed, and holds when stopped',fps=>{
    const camera=new Camera(),target=new THREE.Vector3(),v=new THREE.Vector3(8,0,0);camera.setMode(1);camera.snapTo(target);
    for(let i=0;i<fps*3;i++){target.addScaledVector(v,1/fps);camera.follow(target,v,1/fps,[]);}
    const direction=camera.object.getWorldDirection(new THREE.Vector3());direction.y=0;expect(direction.normalize().dot(v.clone().normalize())).toBeGreaterThan(.99);
    const slow=camera.object.position.clone().sub(target).length();
    v.set(28,0,0);for(let i=0;i<fps*3;i++){target.addScaledVector(v,1/fps);camera.follow(target,v,1/fps,[]);}
    expect(camera.object.position.distanceTo(target)).toBeGreaterThan(slow+2);
    for(let i=0;i<fps*2;i++)camera.follow(target,new THREE.Vector3(),1/fps,[]);
    expect(camera.object.position.x).toBeLessThan(target.x-6);
    camera.setMode(2);camera.setStageHeading(-Math.PI/2);camera.snapTo(target);expect(camera.object.position.x).toBeGreaterThan(target.x+6);
  });
  it('keeps explicit spawn headings without automatically aiming at routes',()=>{
    for(const stage of [2,3,6,7,8,9,10]) {
      const data=stages[stage],yaw=stageStartYaw(data);expect(Number.isFinite(yaw)).toBe(true);
      const camera=new Camera();camera.setStageHeading(yaw);camera.snapTo(new THREE.Vector3(data.spawn.x,data.spawn.y,data.spawn.z));
      const view=camera.object.getWorldDirection(new THREE.Vector3());view.y=0;expect(view.normalize().dot(new THREE.Vector3(Math.sin(yaw),0,-Math.cos(yaw)))).toBeGreaterThan(.99);
    }
    expect(stageStartYaw(stages[8])).toBe(stages[8].properties?.spawnYaw??0);
    const custom=structuredClone(stages[8]);custom.properties={spawnYaw:1.2};expect(stageStartYaw(custom)).toBe(1.2);
  });
  it('does not infer a heading from a floor or a nearby goal',()=>{
    const data=structuredClone(stages[8]);data.spawn={x:0,y:1,z:0};data.objects=[{id:'goal',type:'goal',position:{x:40,y:0,z:0},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1}}];
    const floor=new THREE.Mesh(new THREE.BoxGeometry(40,1,4),new THREE.MeshBasicMaterial());floor.position.set(15,-.25,0);floor.updateMatrixWorld();
    expect(stageStartYaw(data,[floor])).toBe(0);floor.geometry.dispose();(floor.material as THREE.Material).dispose();
  });
  it('persists the selected camera and retains it if storage is unavailable',()=>{
    const values=new Map<string,string>();vi.stubGlobal('localStorage',{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,v:string)=>values.set(key,v)});
    const first=new ProgressionManager();expect(first.getCameraMode()).toBe(1);first.setCameraMode(2);expect(new ProgressionManager().getCameraMode()).toBe(2);
    vi.stubGlobal('localStorage',{getItem:()=>{throw Error('blocked');},setItem:()=>{throw Error('full');}});first.setCameraMode(1);expect(first.getCameraMode()).toBe(1);
  });
  it.each([-1,1])('camera 1 turns with lateral input %i even before the ball moves',side=>{
    const camera=new Camera(),target=new THREE.Vector3();camera.setMode(1);camera.snapTo(target);
    for(let i=0;i<120;i++)camera.follow(target,new THREE.Vector3(),1/60,[],side);
    const yaw=Math.atan2(-camera.object.position.x,camera.object.position.z);expect(yaw*side).toBeGreaterThan(.9);
    const classic=new Camera();classic.setMode(2);classic.snapTo(target);
    for(let i=0;i<120;i++)classic.follow(target,new THREE.Vector3(),1/60,[],side);
    expect(classic.object.position.x).toBe(0);
  });
  it('swaps legacy camera numbers while preserving the previously chosen behaviour',()=>{
    const values=new Map([['mega-ramp-camera-mode','2']]);vi.stubGlobal('localStorage',{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value)});
    const progression=new ProgressionManager();expect(progression.getCameraMode()).toBe(1);
    values.set('mega-ramp-camera-mode','1');expect(progression.getCameraMode()).toBe(2);
    progression.setCameraMode(1);expect(progression.getCameraMode()).toBe(1);
  });
});
