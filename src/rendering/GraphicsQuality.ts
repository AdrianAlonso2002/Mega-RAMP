export type GraphicsQuality='low'|'medium'|'high';
export const GRAPHICS_PROFILES={
  low:{longEdge:1280,shortEdge:720,maxPixelRatio:.75,anisotropy:1,shadows:false,shadowSize:0,waterVisualHz:20,waterNormals:false,detailStride:4},
  medium:{longEdge:1600,shortEdge:900,maxPixelRatio:1,anisotropy:4,shadows:false,shadowSize:0,waterVisualHz:30,waterNormals:true,detailStride:2},
  high:{longEdge:1920,shortEdge:1080,maxPixelRatio:2,anisotropy:8,shadows:true,shadowSize:2048,waterVisualHz:60,waterNormals:true,detailStride:1}
} as const;
/** Bound GPU work by the selected output resolution, also on Retina and portrait displays. */
export function graphicsPixelRatio(width:number,height:number,quality:GraphicsQuality):number {
  const p=GRAPHICS_PROFILES[quality],long=Math.max(1,width,height),short=Math.max(1,Math.min(width,height));
  return Math.max(.1,Math.min(p.maxPixelRatio,p.longEdge/long,p.shortEdge/short));
}
