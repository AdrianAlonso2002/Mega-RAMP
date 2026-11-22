import {describe,it,expect,vi} from 'vitest';
import * as THREE from 'three';
import {SharedTextureCache,disposeStageResources} from '../src/rendering/StageResources';
import {ContactShadows} from '../src/rendering/ContactShadows';
import type {LevelData} from '../src/levels/LevelTypes';

describe('Stage transition resource lifetime',()=>{
  it('preserves cached textures across repeated stages and disposes repeated meshes only once',()=>{
    const cache=new SharedTextureCache<THREE.Texture>(),texture=new THREE.Texture();cache.set('wood',texture);
    const disposedTexture=vi.fn();texture.addEventListener('dispose',disposedTexture);
    for(let stage=0;stage<3;stage++){
      const root=new THREE.Group(),geometry=new THREE.BoxGeometry(),material=new THREE.MeshStandardMaterial({map:cache.get('wood')});
      const disposedGeometry=vi.fn(),disposedMaterial=vi.fn();geometry.addEventListener('dispose',disposedGeometry);material.addEventListener('dispose',disposedMaterial);
      for(let i=0;i<100;i++)root.add(new THREE.Mesh(geometry,material));
      disposeStageResources(root);
      expect(disposedGeometry).toHaveBeenCalledOnce();expect(disposedMaterial).toHaveBeenCalledOnce();
      expect(disposedTexture).not.toHaveBeenCalled();expect(cache.get('wood')).toBe(texture);
    }
    texture.dispose();
  });
  it('releases uncached stage textures, including normal maps, exactly once',()=>{
    const root=new THREE.Group(),texture=new THREE.Texture(),normal=new THREE.Texture(),dispose=vi.fn(),disposeNormal=vi.fn();
    texture.addEventListener('dispose',dispose);normal.addEventListener('dispose',disposeNormal);
    root.add(new THREE.Mesh(new THREE.BoxGeometry(),[
      new THREE.MeshStandardMaterial({map:texture,normalMap:normal}),new THREE.MeshBasicMaterial({map:texture}),
    ]));
    disposeStageResources(root);expect(dispose).toHaveBeenCalledOnce();expect(disposeNormal).toHaveBeenCalledOnce();
  });
  it('defers decorative raycasts until after stage entry and cancels them on navigation',()=>{
    const root=new THREE.Group(),floor=new THREE.Mesh(new THREE.BoxGeometry(10,.2,10)),props:THREE.Mesh[]=[],objects:LevelData['objects']=[];
    floor.position.y=-.1;root.add(floor);
    for(let i=0;i<3;i++){
      const prop=new THREE.Mesh(new THREE.BoxGeometry(1,1,1));prop.position.set(i*2,.5,0);prop.userData.levelObjectId=`prop-${i}`;root.add(prop);props.push(prop);
      objects.push({id:`prop-${i}`,type:'decoration',position:{x:i*2,y:.5,z:0},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1},properties:{hasCollision:true}});
    }
    const data:LevelData={id:'transition',world:1,level:1,stage:1,name:'transition',timeLimit:60,spawn:{x:0,y:1,z:0},objects};
    const raycast=vi.spyOn(floor,'raycast'),shadows=new ContactShadows();
    shadows.bind(data,root,[floor,...props],true);expect(raycast).not.toHaveBeenCalled();
    for(let i=0;i<5;i++)shadows.update(1/60);
    expect(shadows.group.children[0].children).toHaveLength(3);
    shadows.bind(data,root,[floor,...props],true);shadows.clear();const before=raycast.mock.calls.length;
    shadows.update(1/60);expect(raycast).toHaveBeenCalledTimes(before);
    shadows.dispose();root.traverse(node=>{if(node instanceof THREE.Mesh){node.geometry.dispose();(node.material as THREE.Material).dispose();}});
  });
});
