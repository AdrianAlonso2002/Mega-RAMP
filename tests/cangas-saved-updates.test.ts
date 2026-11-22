import { describe,it,expect,vi,afterEach } from "vitest";
import { WORLD_05_LEVEL_02_STAGES as stages } from "../src/levels/world-05/level-02-stages";
import { applyRequestedStageUpdates } from "../src/levels/RequestedStageUpdates";
import { LevelLoader } from "../src/levels/LevelLoader";

afterEach(()=>vi.unstubAllGlobals());

describe("Cangas changes also reach editor-saved stages",()=>{
  it("updates the already migrated ice cream without resetting later editor changes",()=>{
    const data=structuredClone(stages[6]);
    data.customSaved=true;
    data.properties={cangasRequestedRevision:"cangas-physics-layout-2026-11-11-v1"};
    const cone=data.objects.find(o=>o.properties?.variant==="stracciatella_cone")!;
    delete cone.properties!.cangasAction;delete cone.properties!.hasCollision;
    const sign=data.objects.find(o=>o.properties?.subType==="asturias_sign")!;
    sign.position.x=123;data.spawn.x=7;
    const updated=applyRequestedStageUpdates(data,5,2,6);
    expect(cone.properties!.cangasAction).toBe("icecream");
    expect(cone.properties!.hasCollision).toBe(true);
    expect(sign.position.x).toBe(123);expect(updated.spawn.x).toBe(7);
  });
  for(const stage of [2,3,4,6,7,9,10]) {
    it(`loads updated E${stage} despite customSaved and userSaved`,async()=>{
      const saved=structuredClone(stages[stage]);
      saved.customSaved=true;saved.properties={userSaved:true,note:"keep"};
      saved.spawn.y=-99;
      for(const obj of saved.objects) {obj.position.y=-50;obj.properties={...obj.properties,width:99,windStrength:1,rails:true};}
      const extra={id:"obj-custom-decoration",type:"decoration" as const,position:{x:80,y:5,z:0},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1}};
      saved.objects.push(extra);
      if(stage===10) saved.objects=saved.objects.filter(o=>!o.id.includes("aproximacion"));
      const key=`custom_stage_5_2_${stage}`;
      vi.stubGlobal("localStorage",{getItem:(k:string)=>k===key ? JSON.stringify(saved):null});
      const loaded=await new LevelLoader().loadStage(5,2,stage);
      expect(loaded.spawn).toEqual(stages[stage].spawn);
      for(const official of stages[stage].objects) {
        const actual=loaded.objects.find(o=>o.id===official.id)!;
        expect(actual.position).toEqual(official.position);
        expect(actual.scale).toEqual(official.scale);
        expect(actual.properties).toMatchObject(official.properties??{});
      }
      expect(loaded.objects.find(o=>o.id===extra.id)).toEqual(extra);
      expect(loaded.customSaved).toBe(true);expect(loaded.properties!.note).toBe("keep");
      expect(LevelLoader.getStageCollectiblesCount(5,2,stage)).toBe(loaded.objects.filter(o=>o.type==="collectible").length);
      const editor=applyRequestedStageUpdates(structuredClone(saved),5,2,stage);
      expect(editor).toEqual(loaded);
      loaded.objects[0].position.y=123;
      expect(applyRequestedStageUpdates(loaded,5,2,stage).objects[0].position.y).toBe(123);
    });
  }
  it("leaves other Cangas stages untouched",()=>{
    const data=structuredClone(stages[5]),before=structuredClone(data);
    expect(applyRequestedStageUpdates(data,5,2,5)).toEqual(before);
  });
});
