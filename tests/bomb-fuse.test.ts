import {it,expect,vi} from 'vitest';
import {bombFuse} from '../src/ui/BombFuse';
import {HUD} from '../src/ui/HUD';

it('keeps the remaining border connected to the bomb until the exact zero frame',()=>{
 for(const limit of [60,105,300,10.05])for(const elapsed of [0,limit*.1,limit*.5,limit*.99,limit-.001,limit]){
  const fuse=bombFuse(elapsed,limit),[rope,ash]=fuse.dash.split(' ').map(Number);
  expect(rope+ash).toBeCloseTo(1000,6);
  expect(-Number(fuse.offset)+rope).toBeCloseTo(1000,6);
  if(elapsed<limit)expect(rope).toBeGreaterThan(0);else expect(rope).toBe(0);
 }
});
it('updates the border every rendered frame and handles a fractional limit without finishing early',()=>{
 const hud=Object.create(HUD.prototype) as any;
 Object.assign(hud,{bombLimit:10.05,lastBombTick:-1,lastBombElapsed:-1,livesEl:{},itemsEl:{},timeEl:{},fuse:{style:{}},bombTime:{parentElement:{classList:{toggle:vi.fn()}}}});
 hud.update(5,0,10.01,100,10.01);const first=hud.fuse.style.strokeDasharray;
 hud.update(5,0,10.04,100,10.04);expect(hud.fuse.style.strokeDasharray).not.toBe(first);expect(hud.fuse.style.visibility).toBe('visible');expect(hud.bombTime.textContent).toBe('00:01');
 hud.update(5,0,10.05,100,10.05);expect(hud.fuse.style.visibility).toBe('hidden');expect(hud.bombTime.textContent).toBe('00:00');
});
