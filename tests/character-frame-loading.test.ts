import {describe,it,expect,vi} from 'vitest';
import {CharacterFrameCache} from '../src/rendering/CharacterFrameCache';

function setup() {
  const callbacks=new Map<string,{loaded:(image:CanvasImageSource)=>void;failed:()=>void}>(),contexts=new Map<HTMLCanvasElement,{drawImage:ReturnType<typeof vi.fn>}>();
  const fallback={width:512,height:512} as HTMLCanvasElement;
  const load=vi.fn((url:string,loaded:(image:CanvasImageSource)=>void,failed:()=>void)=>{callbacks.set(url.split('?')[0],{loaded,failed});});
  const cache=new CharacterFrameCache({load,fallback:()=>fallback,canvas:()=>{
    const context={clearRect:vi.fn(),drawImage:vi.fn()},canvas={width:0,height:0,getContext:()=>context} as unknown as HTMLCanvasElement;
    contexts.set(canvas,context);return canvas;
  }});
  return {cache,callbacks,contexts,load,fallback};
}
describe('Stable character frame uploads',()=>{
  it('waits for every selected skin pose before declaring it ready, including fallback on a missing frame',async()=>{
    const {cache,callbacks}=setup();let ready=false;
    const pending=cache.waitForSkin('adri','ssj').then(()=>{ready=true;});
    const image={width:512,height:512} as HTMLCanvasElement;
    for(const state of ['normal','move1','move2','scary1','scary2'])callbacks.get(`/assets/characters/adri_ssj_${state}.png`)!.loaded(image);
    callbacks.get('/assets/characters/adri_ssj_sleep.webp')!.loaded(image);
    await Promise.resolve();expect(ready).toBe(false);callbacks.get('/assets/characters/adri_ssj_happy.png')!.failed();await pending;expect(ready).toBe(true);
  });
  it('paints a visible image immediately and keeps the GPU image and dimensions when larger images arrive',()=>{
    const {cache,callbacks,contexts,fallback}=setup(),normal=cache.get('adri','normal','ssj'),canvas=normal.image;
    expect(canvas.width).toBe(1024);expect(canvas.height).toBe(1024);
    expect(contexts.get(canvas)!.drawImage).toHaveBeenLastCalledWith(fallback,0,0,1024,1024);
    const before=normal.version,image={width:2048,height:2048} as HTMLCanvasElement;
    callbacks.get('/assets/characters/adri_ssj_normal.png')!.loaded(image);
    expect(normal.image).toBe(canvas);expect(normal.image.width).toBe(1024);expect(normal.image.height).toBe(1024);
    expect(contexts.get(canvas)!.drawImage).toHaveBeenLastCalledWith(image,0,0,1024,1024);
    expect(normal.version).toBeGreaterThan(before);
  });
  it('shows the same neutral skin until each idle, moving, frightened and happy frame is ready, regardless of load order',()=>{
    const {cache,callbacks,contexts,load}=setup();
    const normal=cache.get('pao','normal','hp');
    const states=['move1','move2','scary1','scary2','happy'] as const;
    const frames=states.map(state=>cache.get('pao',state,'hp'));
    const happyImage={width:512,height:512} as HTMLCanvasElement;
    callbacks.get('/assets/characters/pao_hp_happy.png')!.loaded(happyImage);
    const happyVersion=frames[4].version;
    callbacks.get('/assets/characters/pao_hp_normal.png')!.loaded({width:1024,height:1024} as HTMLCanvasElement);
    expect(frames[4].version).toBe(happyVersion);
    for(let i=0;i<4;i++)expect(contexts.get(frames[i].image)!.drawImage).toHaveBeenLastCalledWith(normal.image,0,0,1024,1024);
    callbacks.get('/assets/characters/pao_hp_move2.png')!.failed();
    expect(contexts.get(frames[1].image)!.drawImage).toHaveBeenLastCalledWith(normal.image,0,0,1024,1024);
    for(const state of states)expect(cache.get('pao',state,'hp')).toBe(frames[states.indexOf(state)]);
    expect(load).toHaveBeenCalledTimes(6);
  });
  it('never substitutes a different character or form when pending animations finish',()=>{
    const {cache,callbacks,contexts}=setup(),blue=cache.get('rony','move1','blue'),baby=cache.get('rony','normal','bebe');
    const version=blue.version;
    callbacks.get('/assets/characters/rony_bebe_normal.png')!.loaded({width:512,height:512} as HTMLCanvasElement);
    expect(blue.version).toBe(version);expect(blue.image).not.toBe(baby.image);
    const neutralBlue=cache.get('rony','normal','blue');
    callbacks.get('/assets/characters/rony_blue_normal.png')!.loaded({width:512,height:512} as HTMLCanvasElement);
    expect(contexts.get(blue.image)!.drawImage).toHaveBeenLastCalledWith(neutralBlue.image,0,0,1024,1024);
  });
  it.each([true,false])('keeps Adri\'s neutral ears and head during walking, neutral loads first: %s',normalFirst=>{
    const {cache,callbacks,contexts}=setup(),normal=cache.get('adri'),moving=cache.get('adri','move1');
    const head={width:1024,height:1024} as HTMLCanvasElement,body={width:1024,height:1024} as HTMLCanvasElement;
    const loadNormal=()=>callbacks.get('/assets/characters/adri_normal.png')!.loaded(head);
    const loadMoving=()=>callbacks.get('/assets/characters/adri_move1.png')!.loaded(body);
    if(normalFirst){loadNormal();loadMoving();}else{loadMoving();loadNormal();}
    const calls=contexts.get(moving.image)!.drawImage;
    expect(calls).toHaveBeenCalledWith(body,0,0,1024,1024);
    const height=Math.round(1024*.56);
    expect(calls).toHaveBeenLastCalledWith(normal.image,0,0,1024,height,0,0,1024,height);
    expect(moving.image.width).toBe(1024);
  });
});
