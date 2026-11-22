import { afterEach,describe,expect,it,vi } from "vitest";
import { HUD } from "../src/ui/HUD";
import { SceneManager } from "../src/game/SceneManager";
import { ProgressionManager } from "../src/progression/ProgressionManager";

afterEach(()=>vi.unstubAllGlobals());

describe("Optional speed display",()=>{
  it("shows the physical 3D speed in km/h independently of FPS",()=>{
    const scene=Object.assign(Object.create(SceneManager.prototype),{
      player:{isFrozen:()=>false,linvel:()=>({x:3,y:-4,z:12})}
    }) as SceneManager;
    const value={textContent:""},speedBadge={style:{display:"none"}},fpsBadge={style:{display:"none"}};
    const hud=Object.assign(Object.create(HUD.prototype),{speedValue:value,speedBadge,fpsBadge,lastSpeed:-1}) as HUD;
    hud.updateSpeed(scene.getPlayerSpeed(),true);
    expect(value.textContent).toBe("47"); // 13 m/s = 46.8 km/h.
    expect(speedBadge.style.display).toBe("flex");expect(fpsBadge.style.display).toBe("none");
    hud.updateSpeed(0,true);expect(value.textContent).toBe("0");
    hud.updateSpeed(15,false);expect(speedBadge.style.display).toBe("none");
  });

  it("saves the setting across sessions without enabling FPS",()=>{
    const values=new Map<string,string>();
    vi.stubGlobal("localStorage",{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value)});
    const first=new ProgressionManager();expect(first.isShowSpeed()).toBe(false);
    first.setShowSpeed(true);
    const next=new ProgressionManager();expect(next.isShowSpeed()).toBe(true);expect(next.isShowFPS()).toBe(false);
    next.setShowSpeed(false);expect(new ProgressionManager().isShowSpeed()).toBe(false);
  });

  it("keeps the setting usable when browser storage is unavailable",()=>{
    vi.stubGlobal("localStorage",{getItem:()=>{throw new Error("unavailable");},setItem:()=>{throw new Error("unavailable");}});
    const preferences=new ProgressionManager();preferences.setShowSpeed(true);
    expect(preferences.isShowSpeed()).toBe(true);
    preferences.setShowSpeed(false);expect(preferences.isShowSpeed()).toBe(false);
  });
});
