import {afterEach,describe,expect,it,vi} from 'vitest';
import {readFileSync} from 'node:fs';
import {getBakedStage} from '../src/levels/BakedStages';
import {LevelLoader} from '../src/levels/LevelLoader';
import {applyRequestedStageUpdates} from '../src/levels/RequestedStageUpdates';
import {applyCollectibleBalance} from '../src/levels/CollectibleBalance';
import {stageMetadata} from '../src/levels/StageRegistry';
import type {LevelData} from '../src/levels/LevelTypes';
import {publishedStageVersion,preferPublishedStage} from '../src/levels/PublishedStageVersion';
import {LevelEditor} from '../src/editor/LevelEditor';

afterEach(()=>{vi.unstubAllGlobals();vi.restoreAllMocks();});
describe('Published designs recovered from the 3D editor',()=>{
  it('loads every saved stage exactly, including geometry, spawn, prizes and mechanisms, with empty browser storage',async()=>{
    vi.stubGlobal('localStorage',{getItem:()=>null});
    const loader=new LevelLoader();let count=0;
    for(let w=1;w<=8;w++) {
      const stages:Record<string,LevelData>=JSON.parse(readFileSync(`src/levels/editor-saved/world-${String(w).padStart(2,'0')}.json`,'utf8'));
      for(const data of Object.values(stages)) {
        expect(getBakedStage(data.world,data.level,data.stage),data.id).toEqual(data);
        expect(await loader.loadStage(data.world,data.level,data.stage),data.id).toEqual(data);
        const copy=structuredClone(data);
        expect(applyRequestedStageUpdates(copy,data.world,data.level,data.stage)).toEqual(data);
        expect(applyCollectibleBalance(copy)).toEqual(data);
        expect(stageMetadata(data.world,data.level,data.stage)?.count).toBe(data.objects.filter(o=>o.type==='collectible').length);
        count++;
      }
    }
    expect(count).toBeGreaterThanOrEqual(187);
  });
  it('publishes the saved pool platforms at 0.5 rather than the old 0.8',()=>{
    const stage=getBakedStage(1,1,2)!;
    expect(stage.objects.find(o=>o.id==='platform-200')?.position.y).toBe(.5);
    expect(stage.objects.find(o=>o.id==='platform-211')?.position.y).toBe(.5);
  });
  it('preserves future browser saves without reintroducing old geometry or prize layouts',async()=>{
    const data=structuredClone(getBakedStage(1,1,2)!);
    delete data.properties!.editorPublished;
    data.customSaved=true;
    data.objects[0].position.y=.35;
    data.objects=data.objects.filter(o=>o.type!=='collectible');
    vi.stubGlobal('localStorage',{getItem:(key:string)=>key==='custom_stage_1_1_2'?JSON.stringify(data):null});
    expect(await new LevelLoader().loadStage(1,1,2)).toEqual(data);
    expect(LevelLoader.getStageCollectiblesCount(1,1,2)).toBe(0);
  });
  it('uses the deployed pool in game, editor and counts when GitHub has an old saved override, without deleting it',async()=>{
    vi.stubGlobal('location',{hostname:'adrianalonso2002.github.io'});
    const official=getBakedStage(1,1,2)!,old=structuredClone(official);
    delete old.properties!.publishedBase;
    old.customSaved=true;old.lastModified=Date.now()+100000;
    old.objects[0].position.y=.8;
    old.objects=old.objects.filter(o=>o.type!=='collectible');
    const raw=JSON.stringify(old),getItem=(key:string)=>key==='custom_stage_1_1_2'?raw:null;
    const removeItem=vi.fn(),setItem=vi.fn();
    vi.stubGlobal('localStorage',{getItem,removeItem,setItem});
    vi.spyOn(LevelEditor,'syncOfficialStagesIfNeeded').mockImplementation(()=>{});
    const editor=LevelEditor.prototype as unknown as {getOrUpdateStageData:(w:number,l:number,s:number,forceSaved?:boolean)=>LevelData};
    expect(await new LevelLoader().loadStage(1,1,2)).toEqual(official);
    expect(editor.getOrUpdateStageData(1,1,2)).toEqual(official);
    expect(editor.getOrUpdateStageData(1,1,2,true)).toEqual(old);
    expect(LevelLoader.getStageCollectiblesCount(1,1,2)).toBe(official.objects.filter(o=>o.type==='collectible').length);
    expect(removeItem).not.toHaveBeenCalled();expect(setItem).not.toHaveBeenCalled();
  });
  it('keeps local authoring and deliberate edits based on the current published version',async()=>{
    const official=getBakedStage(1,1,2)!,saved=structuredClone(official);
    saved.objects[0].position.y=.25;
    vi.stubGlobal('location',{hostname:'localhost'});
    expect(preferPublishedStage(official,saved)).toBe(false);
    vi.stubGlobal('location',{hostname:'adrianalonso2002.github.io'});
    saved.properties!.publishedBase=publishedStageVersion(official);
    expect(preferPublishedStage(official,saved)).toBe(false);
    vi.stubGlobal('localStorage',{getItem:(key:string)=>key==='custom_stage_1_1_2'?JSON.stringify(saved):null});
    expect(await new LevelLoader().loadStage(1,1,2)).toEqual(saved);
    const updated=structuredClone(official);updated.objects[0].position.y=.1;
    expect(publishedStageVersion(updated)).not.toBe(publishedStageVersion(official));
    expect(preferPublishedStage(updated,saved)).toBe(true);
  });
});
