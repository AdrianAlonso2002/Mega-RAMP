import {describe,it,expect,vi} from 'vitest';
import {StageClock,stageTimeLimit} from '../src/game/StageClock';
import {SceneManager} from '../src/game/SceneManager';
import {GameState} from '../src/game/GameState';
import {HUD} from '../src/ui/HUD';
import * as THREE from 'three';
import limits from '../src/levels/StageTimeLimits.json';
import type {LevelData} from '../src/levels/LevelTypes';

describe('bomb clock',()=>{
 it('has explicit editable limits for every one of the 320 stages',()=>{
  expect(Object.keys(limits)).toHaveLength(320);
  for(let w=1;w<=8;w++)for(let l=1;l<=4;l++)for(let e=1;e<=10;e++)expect(stageTimeLimit({world:w,level:l,stage:e} as LevelData)).toBeGreaterThanOrEqual(60);
  expect(stageTimeLimit({world:1,level:1,stage:1,properties:{bombTimeLimit:123}} as unknown as LevelData)).toBe(123);
 });
 it('expires once, clamps remaining time and waits one active second before retry',()=>{
  const clock=new StageClock(60);
  expect(clock.tick(59.99)).toBe('running');expect(clock.tick(.02)).toBe('expired');
  expect(clock.elapsed).toBe(60);expect(clock.remaining).toBe(0);
  expect(clock.tick(.99)).toBe('expired');expect(clock.tick(.02)).toBe('restart');
 });
 it('emits exactly one warning at each remaining second from ten to one',()=>{
  const clock=new StageClock(60),warnings:number[]=[];
  for(let frame=0;frame<3601;frame++){
    clock.tick(1/60);const warning=clock.takeWarningSecond();if(warning!==null)warnings.push(warning);
    expect(clock.takeWarningSecond()).toBeNull();
  }
  expect(warnings).toEqual([10,9,8,7,6,5,4,3,2,1]);
 });
 it('blocks input, goals and collectibles on the expiry frame, freezes through pause, then deducts exactly one life',()=>{
  const state=new GameState();state.screen='gameplay';state.stageCollectibles=3;state.levelRunCollectibles=8;
  const showTimeout=vi.fn(),load=vi.fn(),hud={showTimeout:vi.fn(),update:vi.fn()},clock=new StageClock(60);clock.elapsed=59.99;
  const scene=Object.create(SceneManager.prototype) as any;
  Object.assign(scene,{stageClock:clock,timeoutShown:false,player:{showTimeout},currentLevel:{collectibles:[],goal:{}},currentLevelData:{id:'same-stage'},isStageCompleted:false,isGameOverTriggered:false,isIntroActive:false,isOutroActive:false,respawnCooldown:0,audio:{stopSnoring:vi.fn(),beginBombTimeout:vi.fn(),updateRoll:vi.fn()},context:{state,hud,progression:{getLevelMaxCollectibles:()=>100},input:{getAxis:()=>{throw Error('Input/goal work must not execute after expiry');}},onGameOver:vi.fn()},loadCustomLevel:load});
  scene.update(.02);expect(showTimeout).toHaveBeenCalledTimes(1);expect(state.lives).toBe(5);
  state.screen='pause';scene.update(20);expect(state.lives).toBe(5);expect(load).not.toHaveBeenCalled();
  state.screen='gameplay';scene.update(.99);expect(load).not.toHaveBeenCalled();scene.update(.02);
  expect(state.lives).toBe(4);expect(state.levelRunCollectibles).toBe(5);expect(state.stageCollectibles).toBe(0);expect(load).toHaveBeenCalledTimes(1);expect(hud.showTimeout).toHaveBeenCalledTimes(1);expect(scene.audio.beginBombTimeout).toHaveBeenCalledTimes(1);
  expect(load).toHaveBeenCalledWith(scene.currentLevelData,{preserveMusic:true});
 });
 it.each(['fall','lava','enemy','canoe','vehicle','cold','crush','painting','rex'])('resets the fuse and warnings on %s without resetting the total elapsed timer',reason=>{
  const state=new GameState();state.elapsedTime=55;state.stageCollectibles=4;state.levelRunCollectibles=8;
  const clock=new StageClock(60);clock.tick(55);expect(clock.takeWarningSecond()).toBe(5);
  const hud={setBombLimit:vi.fn(),update:vi.fn(),showBanner:vi.fn()},respawn=vi.fn(),scene=Object.create(SceneManager.prototype) as any;
  Object.assign(scene,{stageClock:clock,isStageCompleted:false,isGameOverTriggered:false,currentLevel:{reset:vi.fn()},player:{respawn,getPosition:()=>new THREE.Vector3()},updateKitsuneLighting:vi.fn(),audio:{playFall:vi.fn(),playLavaBurn:vi.fn()},context:{state,hud,camera:{snapTo:vi.fn()},progression:{getLevelMaxCollectibles:()=>100}}});
  scene.handlePlayerDeath(reason);
  expect(state.lives).toBe(4);expect(clock.remaining).toBe(60);expect(clock.expired).toBe(false);
  expect(state.elapsedTime).toBe(55);expect(state.stageCollectibles).toBe(4);expect(state.levelRunCollectibles).toBe(8);
  expect(hud.update).toHaveBeenCalledWith(4,8,55,100,0);expect(respawn).toHaveBeenCalledOnce();
  clock.tick(50);expect(clock.takeWarningSecond()).toBe(10);
 });
 it('displays the renewed bomb independently from the cumulative elapsed timer',()=>{
  const hud=Object.create(HUD.prototype) as any;
  Object.assign(hud,{bombLimit:60,lastBombTick:-1,livesEl:{},itemsEl:{},timeEl:{},fuse:{style:{}},bombTime:{parentElement:{classList:{toggle:vi.fn()}}}});
  hud.update(4,8,55,100,0);expect(hud.timeEl.textContent).toBe('00:55.00');expect(hud.bombTime.textContent).toBe('01:00');expect(hud.fuse.style.strokeDashoffset).toBe('0');
  hud.update(4,8,62,100,7);expect(hud.timeEl.textContent).toBe('01:02.00');expect(hud.bombTime.textContent).toBe('00:53');
 });
});
