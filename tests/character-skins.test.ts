import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import * as THREE from 'three';
import {CHARACTERS, getCharacterById} from '../src/player/Characters';
import {characterSpritePath, getCharacterSkin, getCharacterSkins} from '../src/player/CharacterSkins';
import {ProgressionManager} from '../src/progression/ProgressionManager';
import {SpriteTextures, type CharacterState} from '../src/rendering/SpriteTextures';
import {Player} from '../src/player/Player';
import type {PhysicsWorld} from '../src/physics/PhysicsWorld';

afterEach(()=>{vi.unstubAllGlobals();vi.restoreAllMocks();});
beforeEach(()=>{
  const canvas=()=>({width:512,height:512,getContext:()=>({clearRect:vi.fn(),drawImage:vi.fn(),strokeText:vi.fn(),fillText:vi.fn()})}) as unknown as HTMLCanvasElement;
  vi.stubGlobal('document',{createElement:()=>canvas()});
  vi.spyOn(SpriteTextures,'getCharacterFullCanvas').mockImplementation(()=>canvas());
});
describe('Unlocked character forms',()=>{
  it('offers the exact three forms per character and preserves every gameplay characteristic',()=>{
    const names:Record<string,string[]>={adri:['Normal','Especial','Ssj'],pao:['Normal','Especial','HP'],misi:['Normal','Bebé','Negra'],rony:['Normal','Bebé','Blue']};
    for(const character of CHARACTERS) {
      expect(getCharacterSkins(character.id).map(s=>s.name)).toEqual(names[character.id]);
      for(const skin of getCharacterSkins(character.id)) {
        const resolved=getCharacterById(character.id,skin.id);
        for(const key of ['id','speed','acceleration','handling','collectibleId'] as const) expect(resolved[key]).toBe(character[key]);
        expect(resolved.spritePath).toBe(characterSpritePath(character.id,skin.id));
      }
    }
  });
  it('migrates old saves without losing progression, remembers each form, and falls back safely',()=>{
    const storage=new Map<string,string>();
    storage.set('monkey-ball-progress-v1',JSON.stringify({selectedCharacter:'adri',worlds:{1:{1:{1:{completed:true,bestTime:12,collectibles:3}}}}}));
    vi.stubGlobal('localStorage',{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,value)});
    const progress=new ProgressionManager();expect(progress.getSelectedSkin('adri')).toBe('normal');
    progress.unlockAll(); // Reward skins are selectable only after their world threshold is earned.
    progress.setSelectedSkin('adri','londres');progress.setSelectedSkin('pao','ssj');progress.setSelectedSkin('misi','negra');progress.setSelectedSkin('rony','blue');
    const reloaded=new ProgressionManager();
    expect(reloaded.getSelectedCharacter()).toBe('adri');expect(reloaded.getStage(1,1,1)?.completed).toBe(true);
    expect(['adri','pao','misi','rony'].map(id=>reloaded.getSelectedSkin(id))).toEqual(['especial','hp','negra','blue']);
    reloaded.setSelectedSkin('adri','invalid');expect(reloaded.getSelectedSkin('adri')).toBe('normal');expect(reloaded.getSelectedSkin('pao')).toBe('hp');
    expect(getCharacterSkin('pao','noruega').id).toBe('especial');
    expect(getCharacterSkin('toString','invalid').id).toBe('normal');
  });
  it('loads distinct skin animations once and reuses cached textures for repeated switches',()=>{
    const load=vi.spyOn(THREE.TextureLoader.prototype,'load').mockImplementation(()=>new THREE.Texture());
    const states:CharacterState[]=['normal','move1','move2','scary1','scary2','happy','sleep'];
    for(const c of CHARACTERS) for(const state of states) {
      const normal=SpriteTextures.getCharacterTexture(c.id,state);
      for(const skin of getCharacterSkins(c.id)) {
        expect(characterSpritePath(c.id,skin.id,state)).toBe(`/assets/characters/${skin.spriteBase}_${state}.${state==='sleep'?'webp':'png'}?art=ink2`);
        const texture=SpriteTextures.getCharacterTexture(c.id,state,skin.id);
        expect(SpriteTextures.getCharacterTexture(c.id,state,skin.id)).toBe(texture);
        if(skin.id==='normal')expect(texture).toBe(normal);else expect(texture).not.toBe(normal);
      }
    }
    expect(load).toHaveBeenCalledTimes(84);
    for(const c of CHARACTERS) for(const skin of getCharacterSkins(c.id)) SpriteTextures.preloadCharacterSkin(c.id,skin.id);
    expect(load).toHaveBeenCalledTimes(84);
  });
  it('changes the live player art even during movement and celebration without recreating physics',()=>{
    vi.spyOn(THREE.TextureLoader.prototype,'load').mockImplementation(()=>new THREE.Texture());
    vi.spyOn(SpriteTextures,'getSphereTexture').mockReturnValue(new THREE.CanvasTexture({width:1,height:1} as HTMLCanvasElement));
    const createBallBody=vi.fn(()=>null),physics={createBallBody} as unknown as PhysicsWorld;
    const player=new Player(getCharacterById('adri','ssj'),physics),sprite=player.object.children.find(o=>o instanceof THREE.Sprite) as THREE.Sprite;
    for(const c of CHARACTERS) for(const skin of getCharacterSkins(c.id)) {
      player.setVehiclePose({x:3,y:5,z:7},{x:4,y:0,z:0});
      player.setCharacter(getCharacterById(c.id,skin.id));
      expect(sprite.material.map).toBe(SpriteTextures.getCharacterTexture(c.id,'move1',skin.id));
      expect(player.object.position.toArray()).toEqual([3,5,7]);
      player.setHappy(true);player.setCharacter(getCharacterById(c.id,skin.id));
      expect(sprite.material.map).toBe(SpriteTextures.getCharacterTexture(c.id,'happy',skin.id));
    }
    expect(createBallBody).toHaveBeenCalledTimes(1);expect(player.radius).toBe(.75);player.destroy();
  });
});
