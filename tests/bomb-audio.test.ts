import {describe,it,expect,vi} from 'vitest';
import {AudioManager} from '../src/audio/AudioManager';

function setup(){
 const gain=()=>({gain:{setValueAtTime:vi.fn()},connect:vi.fn(),disconnect:vi.fn()});
 const created:ReturnType<typeof gain>[]=[],old=gain(),ambient=gain(),master=gain(),bgm=gain(),roll={stop:vi.fn(),disconnect:vi.fn()},snore={stop:vi.fn(),disconnect:vi.fn()};
 const audio=Object.create(AudioManager.prototype) as any;
 Object.assign(audio,{ctx:{state:'running',currentTime:100,createGain:()=>{const node=gain();created.push(node);return node;}},sfxGain:old,ambientGain:ambient,masterGain:master,bgmGain:bgm,sfxVolume:.8,effectsBlocked:false,isMuted:false,rollOsc:roll,rollGain:gain(),snoreOsc:snore,snoreGain:gain(),note:vi.fn()});
 return {audio,old,ambient,master,bgm,roll,snore,created};
}

describe('bomb countdown audio',()=>{
 it('raises pitch, duration and intensity on each of the ten warnings',()=>{
  const {audio}=setup();for(let second=10;second>=1;second--)audio.playBombWarning(second);
  const calls=audio.note.mock.calls;expect(calls).toHaveLength(10);
  for(let i=1;i<calls.length;i++){expect(calls[i][0]).toBeGreaterThan(calls[i-1][0]);expect(calls[i][2]).toBeGreaterThan(calls[i-1][2]);expect(calls[i][3]).toBeGreaterThan(calls[i-1][3]);}
 });
 it('cuts all old effects immediately, plays only the final whistle and creates a fresh bus on retry',()=>{
  const {audio,old,ambient,master,bgm,roll,snore,created}=setup();
  audio.beginBombTimeout();audio.beginBombTimeout();
  expect(old.disconnect).toHaveBeenCalledTimes(1);expect(roll.stop).toHaveBeenCalledTimes(1);expect(snore.stop).toHaveBeenCalledTimes(1);expect(ambient.disconnect).toHaveBeenCalledTimes(1);
  expect(created[0].connect).not.toHaveBeenCalled();expect(audio.note).toHaveBeenCalledTimes(1);
  expect(audio.note).toHaveBeenCalledWith(2200,100,.72,.8*.35*.19,'sine',master);
  audio.playBombWarning(1);expect(audio.note).toHaveBeenCalledTimes(1);
  audio.endBombTimeout();expect(created).toHaveLength(2);expect(created[1].connect).toHaveBeenCalledWith(master);expect(old.connect).not.toHaveBeenCalled();expect(ambient.connect).toHaveBeenCalledWith(bgm);
  expect(bgm.disconnect).not.toHaveBeenCalled();expect(master.disconnect).not.toHaveBeenCalled();
 });
 it('respects mute for the final whistle while still cutting existing effects',()=>{
  const {audio,old}=setup();audio.isMuted=true;audio.beginBombTimeout();expect(old.disconnect).toHaveBeenCalled();expect(audio.note).not.toHaveBeenCalled();
 });
});
