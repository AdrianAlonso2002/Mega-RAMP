import {afterEach,describe,expect,it,vi} from 'vitest';
import * as THREE from 'three';
import {createSpawnMarker,SPAWN_SELECTION} from '../src/editor/SpawnMarker';
import {LevelEditor} from '../src/editor/LevelEditor';
import {stageStartYaw} from '../src/rendering/StageHeading';
import {Camera} from '../src/rendering/Camera';
import {disposeStageResources} from '../src/rendering/StageResources';
import {WORLD_07_LEVEL_02_STAGES as stages} from '../src/levels/world-07/level-02-stages';
afterEach(()=>vi.unstubAllGlobals());
describe('Selectable editor spawn and matching departure direction',()=>{
  it.each([0,Math.PI/2,-Math.PI/2,Math.PI,1.3])('points the yellow arrow along the gameplay heading %s',yaw=>{
    const data=structuredClone(stages[8]);data.properties={...data.properties,spawnYaw:yaw};
    const marker=createSpawnMarker(data.spawn,stageStartYaw(data),true),arrow=marker.getObjectByName('spawn-direction')!;
    marker.updateMatrixWorld(true);
    const direction=new THREE.Vector3(0,1,0).applyQuaternion(arrow.getWorldQuaternion(new THREE.Quaternion()));
    const camera=new Camera();camera.setStageHeading(stageStartYaw(data));camera.snapTo(new THREE.Vector3(data.spawn.x,data.spawn.y,data.spawn.z));
    const view=camera.object.getWorldDirection(new THREE.Vector3());view.y=0;
    expect(direction.dot(view.normalize())).toBeGreaterThan(.9999);expect(marker.userData.objectIndex).toBe(SPAWN_SELECTION);
    const ball=marker.children.find(o=>o instanceof THREE.Mesh&&o.geometry.type==='SphereGeometry')!;expect(ball.position.y).toBe(0);
    disposeStageResources(marker);
  });
  it('selects the spawn by clicking its 3D sphere, then deselects on empty space',()=>{
    vi.stubGlobal('window',{innerWidth:1000,innerHeight:1000});
    const editor=Object.create(LevelEditor.prototype),group=new THREE.Group(),position={x:0,y:1,z:0},marker=createSpawnMarker(position,0,false);
    group.add(marker);group.updateMatrixWorld(true);
    const camera=new THREE.PerspectiveCamera(56,1,.1,100);camera.position.set(0,3,8);camera.lookAt(0,1,0);camera.updateMatrixWorld(true);
    Object.assign(editor,{editorGroup:group,camera,levelData:{objects:[],spawn:position},selectedObjectIndex:-1,container:{querySelector:()=>null},render3DObjects:vi.fn(),renderUI:vi.fn()});
    expect(editor.checkObjectUnderCursor(500,500)).toBe(true);editor.handleClickRaycast(500,500);
    expect(editor.selectedObjectIndex).toBe(SPAWN_SELECTION);expect(editor.renderUI).toHaveBeenCalledOnce();
    editor.handleClickRaycast(1,1);expect(editor.selectedObjectIndex).toBe(-1);
    disposeStageResources(marker);
  });
});
