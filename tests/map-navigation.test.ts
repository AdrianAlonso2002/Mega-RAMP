import {afterEach,describe,it,expect,vi} from 'vitest';
import {pendingMapLevel} from '../src/ui/MapProgress';
import {OverworldMap} from '../src/ui/OverworldMap';
afterEach(()=>vi.unstubAllGlobals());
function harness(width=400,height=800){
 const viewport=Object.assign(new EventTarget(),{style:{cursor:''},clientWidth:width,clientHeight:height,getBoundingClientRect:()=>({left:10,top:20})}),win=Object.assign(new EventTarget(),{innerWidth:width,innerHeight:height});
 vi.stubGlobal('window',win);vi.stubGlobal('document',new EventTarget());
 const frames:FrameRequestCallback[]=[];vi.stubGlobal('requestAnimationFrame',(f:FrameRequestCallback)=>{frames.push(f);return frames.length;});
 const map=Object.assign(Object.create(OverworldMap.prototype),{mapCanvasWrapper:viewport,mapSurface:{style:{transform:'',setProperty(){}}},container:{querySelector:()=>null},eventCleanup:new AbortController(),MAP_WIDTH:4128,MAP_HEIGHT:2304,zoom:.8,panX:-1000,panY:-500,isDragging:false,touchMode:'none',suppressMapTapUntil:0,isOverview:false,isDestroyed:false,rafPending:false,cameraRafId:null,stopCameraAnimation:vi.fn()});
 map.syncAmbientPlayback=()=>{};map.onWindowResize=()=>map.resizeMap();map.setupEvents();
 const touch=(target:EventTarget,type:string,points:number[][])=>{const event=new Event(type,{cancelable:true});Object.defineProperty(event,'touches',{value:points.map(([clientX,clientY])=>({clientX,clientY}))});target.dispatchEvent(event);return event;};
 return {map,viewport,win,touch,frames};
}
describe('map progress and mobile zoom',()=>{
 it('finds the next pending level across world boundaries and returns an overview after all 32',()=>{
  expect(pendingMapLevel({isLevelCompleted:()=>false})).toEqual({world:1,level:1});
  expect(pendingMapLevel({isLevelCompleted:(w,l)=>w<5||w===5&&l<3})).toEqual({world:5,level:3});
  expect(pendingMapLevel({isLevelCompleted:w=>w<8})).toEqual({world:8,level:1});
  expect(pendingMapLevel({isLevelCompleted:()=>true})).toBeNull();
 });
 it('zooms around the fingers and pans with their midpoint, using one render per animation frame',()=>{
  const {map,viewport,win,touch,frames}=harness();const x=(200-10-map.panX)/map.zoom,y=(300-20-map.panY)/map.zoom;
  touch(viewport,'touchstart',[[150,300],[250,300]]);
  const event=touch(win,'touchmove',[[130,310],[280,310]]);
  expect(event.defaultPrevented).toBe(true);expect(map.zoom).toBeCloseTo(1.2);
  expect((205-10-map.panX)/map.zoom).toBeCloseTo(x);expect((310-20-map.panY)/map.zoom).toBeCloseTo(y);
  touch(win,'touchmove',[[130,310],[280,310]]);expect(frames).toHaveLength(1);expect(map.suppressMapTapUntil).toBeGreaterThan(performance.now());
  map.eventCleanup.abort();
 });
 it('can zoom in and out to both limits and change from two fingers to one without a jump',()=>{
  const {map,viewport,win,touch}=harness();touch(viewport,'touchstart',[[100,300],[200,300]]);
  touch(win,'touchmove',[[0,300],[1000,300]]);expect(map.zoom).toBe(1.6);
  touch(win,'touchmove',[[100,300],[101,300]]);expect(map.zoom).toBeCloseTo(801/2304);
  map.zoom=.8;map.panX=-1000;map.panY=-500;
  touch(win,'touchend',[[100,300]]);const old=map.panX;
  touch(win,'touchmove',[[110,300]]);expect(map.panX-old).toBe(10);
  touch(win,'touchcancel',[]);const before=map.panX;touch(win,'touchmove',[[150,300]]);expect(map.panX).toBe(before);
  map.eventCleanup.abort();
 });
 it('centres the completed-game overview at maximum zoom-out on mobile and after resizing',()=>{
  const {map}=harness();map.isOverview=true;map.onWindowResize();
  expect(map.zoom).toBeCloseTo(801/2304);expect(map.panX).toBeCloseTo((400-4128*map.zoom)/2);
  expect(map.panY).toBeCloseTo((800-2304*map.zoom)/2);
  map.mapCanvasWrapper.clientWidth=1000;map.mapCanvasWrapper.clientHeight=500;map.onWindowResize();
  expect(map.zoom).toBeCloseTo(1001/4128);expect(map.panX).toBeCloseTo((1000-4128*map.zoom)/2);expect(map.panY).toBeCloseTo((500-2304*map.zoom)/2);
  expect(4128*map.zoom).toBeGreaterThanOrEqual(1000);expect(2304*map.zoom).toBeGreaterThanOrEqual(500);
  map.eventCleanup.abort();
 });
 it('removes the window gesture handlers when the map is destroyed',()=>{
  const {map,viewport,win,touch}=harness();touch(viewport,'touchstart',[[150,300],[250,300]]);map.eventCleanup.abort();const z=map.zoom;touch(win,'touchmove',[[100,300],[300,300]]);expect(map.zoom).toBe(z);
 });
});
