import {afterEach,beforeEach,describe,it,expect,vi} from 'vitest';
import {ProgressionManager} from '../src/progression/ProgressionManager';

beforeEach(()=>{
  const values=new Map<string,string>();vi.stubGlobal('localStorage',{getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>values.set(k,v)});
});
afterEach(()=>vi.unstubAllGlobals());
describe('independent whole-level personal bests',()=>{
  it('keeps the fastest time and richest single run separately after reload and backup import',()=>{
    const p=new ProgressionManager();
    p.recordLevelCompletion(1,1,120,85,'rony');
    p.recordLevelCompletion(1,1,95,30,'adri');
    expect(p.getLevelRecord(1,1)).toMatchObject({bestTime:95,totalCollectibles:85});
    p.recordLevelCompletion(1,1,150,98,'misi');
    expect(p.getLevelRecord(1,1)).toMatchObject({bestTime:95,totalCollectibles:98});
    p.recordLevelCompletion(1,1,200,98,'pao');
    p.recordLevelCompletion(1,1,250,20,'pao');
    const loaded=new ProgressionManager();expect(loaded.getLevelRecord(1,1)).toMatchObject({bestTime:95,totalCollectibles:98,clearCount:5});
    loaded.importBackup(p.exportBackup());expect(loaded.getLevelRecord(1,1)).toMatchObject({bestTime:95,totalCollectibles:98});
    p.recordLevelCompletion(1,1,90,200,'rony');expect(p.getLevelRecord(1,1)).toMatchObject({bestTime:90,totalCollectibles:100});
  });
  it('does not count the sum of historical stage records as a new attempt',()=>{
    const p=new ProgressionManager();
    for(let stage=1;stage<=10;stage++)p.completeStage(1,1,stage,15,10);
    p.recordLevelCompletion(1,1,150,40,'rony');
    p.completeLevel(1,1,100,20,'adri');
    expect(p.getLevelRecord(1,1)).toMatchObject({bestTime:100,totalCollectibles:40});
  });
  it('clamps existing oversized level records on import without changing their time',()=>{
    const p=new ProgressionManager();p.recordLevelCompletion(1,1,90,30,'adri');
    const backup=JSON.parse(p.exportBackup());backup.progress.levelRecords['1-1'].totalCollectibles=180;
    p.importBackup(JSON.stringify(backup));expect(p.getLevelRecord(1,1)).toMatchObject({bestTime:90,totalCollectibles:100});
    expect(JSON.parse(p.exportBackup()).progress.levelRecords['1-1'].totalCollectibles).toBe(100);
  });
});
