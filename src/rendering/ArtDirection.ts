import type {LevelData} from '../levels/LevelTypes';
export interface ArtDirection {
  sky:number;ground:number;sun:number;fill:number;horizon:number;
  ambient:number;sunIntensity:number;fillIntensity:number;exposure:number;
  sunOffset:readonly [number,number,number];interior:boolean;dark:boolean;weather:'motes'|'snow'|'petals'|'none';
}
const PALETTES=[
  [0xfff3df,0x69513d,0xffdfac,0xb4cede,0xc6ccb3],
  [0xdff4ff,0x92764f,0xffe7bc,0x8cc8dc,0xb1d4d3],
  [0xe1eee4,0x3e5141,0xffedd0,0xa8c5bf,0xa9c4b6],
  [0xe8eef6,0x555865,0xffe3bf,0xb2bfd3,0xc5c9cb],
  [0xe4f0ed,0x345248,0xffedcf,0xa0c9c8,0xb2c9be],
  [0xe7edf8,0x525767,0xffdfb4,0xa5bfd7,0xcbd4df],
  [0xffebef,0x765b61,0xffe2bc,0xc6bedc,0xe4cbd8],
  [0xd3e9f3,0x33546c,0xd3ecff,0x86b8ce,0xb4d1dc]
] as const;
export function artDirection(world:number,level:number,data?:LevelData|null):ArtDirection {
  const p=PALETTES[Math.max(0,Math.min(7,world-1))],name=(data?.name??'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
  const dark=Boolean(data?.properties?.pitchBlack)||name==='ruta nocturna'||(world===3&&level===4&&data?.stage===9);
  const interior=/museum|library|underground|tinieblas|great hall|bear inn|souvenir|mercadona|carrefour|alimerka|primark|mina|cine|m&s/.test(name)||world===6&&level===2;
  const neon=world===7&&level>=3;
  if(world===8&&level===4)return {sky:0x12243e,ground:0x24394e,sun:0xc1e4ff,fill:0x8de3c4,horizon:0x18354a,ambient:1.05,sunIntensity:1.1,fillIntensity:.45,exposure:1.05,sunOffset:[-32,45,20],interior:false,dark:false,weather:'snow'};
  if(world===8&&level===3)return {sky:0xc9dfe8,ground:0x3f586b,sun:0xffe5bc,fill:0x9bc5d6,horizon:0xb3c9d7,ambient:1.12,sunIntensity:1.25,fillIntensity:.4,exposure:1,sunOffset:[-32,45,20],interior:false,dark:false,weather:'snow'};
  if(world===8&&level===2)return {sky:0xc3e4eb,ground:0x294f65,sun:0xffe5bd,fill:0x8fc7d7,horizon:0x9dbfcc,ambient:1.1,sunIntensity:1.3,fillIntensity:.4,exposure:1,sunOffset:[-32,45,20],interior:false,dark:false,weather:'snow'};
  if(world===8&&level===1)return {sky:0xc5dfed,ground:0x34516a,sun:0xe5efff,fill:0x94bfd7,horizon:0xadcbdc,ambient:1.1,sunIntensity:1.25,fillIntensity:.38,exposure:1,sunOffset:[-32,45,20],interior:false,dark:false,weather:'snow'};
  if(world===7&&level===4)return {sky:0x99b9df,ground:0x1f2e49,sun:0xd2e5ff,fill:0xe7aed0,horizon:0x314762,ambient:1.05,sunIntensity:.9,fillIntensity:.35,exposure:1.05,sunOffset:[-24,38,18],interior:false,dark:false,weather:'none'};
  if(world===7&&level===3)return {sky:0x99b8dd,ground:0x19253e,sun:0xc2d5f1,fill:0xda8fc5,horizon:0x263753,ambient:.95,sunIntensity:.85,fillIntensity:.32,exposure:1.04,sunOffset:[-24,38,18],interior:false,dark:false,weather:'none'};
  const mood=[['warm','warm','clear','dusk'],['clear','warm','clear','dusk'],['warm','clear','forest','forest'],['warm','dusk','forest','interior'],['dusk','warm','forest','cold'],['cold','interior','warm','dusk']][world-1]?.[level-1]??'warm';
  const tint=mood==='dusk'?0xffcca2:mood==='cold'?0xd7eaff:mood==='forest'?0xd8eee1:mood==='interior'?0xffdab6:p[2];
  const fill=mood==='dusk'?0x9da9db:mood==='forest'?0xa4d4c4:mood==='interior'?0xa8bfd6:p[3];
  return {sky:neon ? 0x8eb3d1:p[0],ground:p[1],sun:tint,fill:neon ? 0xd89bd4:fill,horizon:p[4],
    ambient:interior ? .95:mood==='dusk'?1:1.08,sunIntensity:interior ? .65:world===2 ? 1.85:1.65,fillIntensity:interior ? .28:.32,
    exposure:dark ? 1:interior ? 1.08:1.02,sunOffset:interior ? [16,32,10]:mood==='dusk'?[-30,22,22]:world===6 ? [-24,32,18]:[24,38,18],
    interior,dark,weather:interior||dark ? 'none':world===6||world===8 ? 'snow':world===7&&level<3 ? 'petals':'motes'};
}
export type SurfaceFamily='wood'|'stone'|'metal'|'paintedMetal'|'food'|'plastic'|'cloth'|'glass'|'liquid'|'foliage'|'ice'|'neutral';
export function surfaceFamily(hint:string):SurfaceFamily {
  const text=hint.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
  if(/water|agua|river|fountain|milk_ring|(?:^|[ _-])mar(?:$|[ _-])|honey/.test(text)) return 'liquid';
  if(/glacier|glaciar|hielo|ice[ _-]|ice$|aurora_gear|norway_path|norway_disc/.test(text))return 'ice';
  if(/glass|cristal|player-ball/.test(text)) return 'glass';
  if(/chainstays|top-tube|front-fork|painted.metal/.test(text)) return 'paintedMetal';
  if(/steel|chrome|metal|acero|hierro|alumin/.test(text)) return 'metal';
  if(/tree|arbol|pine|bush|grass|hoja|vegetation/.test(text)) return 'foliage';
  if(/wood|madera|table|mesa|bookshelf|shelf|fence|bench|posavasos|basket|cesta|puerta/.test(text)) return 'wood';
  if(/stone|piedra|rock|roca|pier|college|campus|castle|muro|roman|pyramid|column|concrete|cement/.test(text)) return 'stone';
  if(/bread|(?:^|[ _-])pan(?:$|[ _-])|sandwich|quesarito|cachopo|food|pizza|helado|fabada|burger|noodle/.test(text)) return 'food';
  if(/cloth|fabric|towel|ropa|ties|corbata/.test(text)) return 'cloth';
  if(/plastic|buzz|toy|juguete/.test(text)) return 'plastic';
  return 'neutral';
}
export const SURFACE_STYLES:Record<Exclude<SurfaceFamily,'neutral'>,{roughness:number;metalness:number;reflectivity:number}>={
  ice:{roughness:.25,metalness:.08,reflectivity:.52},
  wood:{roughness:.78,metalness:0,reflectivity:.16},stone:{roughness:.88,metalness:0,reflectivity:.12},
  metal:{roughness:.32,metalness:.68,reflectivity:.45},paintedMetal:{roughness:.42,metalness:.22,reflectivity:.3},
  food:{roughness:.69,metalness:0,reflectivity:.14},plastic:{roughness:.43,metalness:0,reflectivity:.26},
  cloth:{roughness:.94,metalness:0,reflectivity:.08},glass:{roughness:.14,metalness:0,reflectivity:.5},liquid:{roughness:.22,metalness:0,reflectivity:.34},foliage:{roughness:.86,metalness:0,reflectivity:.12}
};




