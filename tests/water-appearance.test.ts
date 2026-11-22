import {describe,it,expect,vi} from "vitest";
import {naturalWaterShade,createNaturalWaterTexture} from "../src/rendering/WaterAppearance";

describe("Natural water appearance",()=>{
  it("has seamless value and slope across repeated texture edges",()=>{
    const eps=.00001;
    for(let i=0;i<24;i++) {
      const t=i/24;
      expect(naturalWaterShade(0,t)).toBeCloseTo(naturalWaterShade(1,t),8);
      expect(naturalWaterShade(t,0)).toBeCloseTo(naturalWaterShade(t,1),8);
      expect(naturalWaterShade(eps,t)-naturalWaterShade(-eps,t)).toBeCloseTo(naturalWaterShade(1+eps,t)-naturalWaterShade(1-eps,t),8);
    }
  });
  it("creates an opaque blue-green texture with subtle contrast and no drawn circles",()=>{
    const data=new Uint8ClampedArray(256*256*4);
    const context={createImageData:()=>({data}),putImageData:vi.fn()};
    vi.stubGlobal("document",{createElement:()=>({getContext:()=>context})});
    try {
      const texture=createNaturalWaterTexture();
      expect(context.putImageData).toHaveBeenCalledOnce();
      let min=255,max=0;
      for(let i=0;i<data.length;i+=4) {
        expect(data[i+3]).toBe(255);
        expect(data[i+2]).toBeGreaterThan(data[i]);
        min=Math.min(min,data[i+1]);max=Math.max(max,data[i+1]);
      }
      expect(max-min).toBeGreaterThan(20);expect(max-min).toBeLessThan(60);
      texture.dispose();
    } finally {vi.unstubAllGlobals();}
  });
});
