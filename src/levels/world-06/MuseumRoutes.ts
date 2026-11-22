import {CatmullRomCurve3,Vector3} from "three";
import type {Vector3Data} from "../LevelTypes";
export const MUSEUM_REVISION="museum-christmas-v1";
export const MUSEUM_CHASE_LENGTH=1845;
// The exit zone spans the hall, twelve metres before its end wall.
export const MUSEUM_CHASE_FINISH_Z=2-MUSEUM_CHASE_LENGTH;
export const MUSEUM_ANIMALS=["triceratops","sabretooth","mammoth","stegosaurus","ankylosaurus","raptor","brachiosaurus","pteranodon","woolly_rhino","megatherium"] as const;
export type MuseumAnimal=typeof MUSEUM_ANIMALS[number]|"trex";
export interface PyramidBlock {tier:number;index:number;x:number;y:number;z:number;width:number;depth:number}
export const PYRAMID_BLOCK_HEIGHT=4.2;
export const PYRAMID_BLOCKS:PyramidBlock[]=(()=>{
  const blocks:PyramidBlock[]=[];
  for(let tier=0;tier<8;tier++) {
    let index=0;const r=24-tier*3;
    const row=(cx:number,cz:number,w:number,d:number)=>{
      const count=Math.max(1,Math.round(Math.max(w,d)/3));
      for(let n=0;n<count;n++) {const width=w>d ? w/count:w,depth=d>=w ? d/count:d;
        blocks.push({tier,index:index++,x:cx+(w>d ? (n+.5)*width-w/2:0),y:tier*1.2,z:cz+(d>=w ? (n+.5)*depth-d/2:0),width:width-.025,depth:depth-.025});}
    };
    if(tier===7) blocks.push({tier,index:0,x:0,y:tier*1.2,z:0,width:5.975,depth:5.975});
    else {row(0,r-1.5,r*2,3);row(0,-r+1.5,r*2,3);row(-r+1.5,0,3,(r-3)*2);row(r-1.5,0,3,(r-3)*2);}
  }
  return blocks;
})();
export function pyramidBlockMotion(t:number,tier:number,index:number):number {
  const phase=(index*2.3999632297+tier*.41)%(Math.PI*2),frequency=(.42+tier*.12)*(1+.065*Math.sin(index*1.7));
  const fade=Math.min(1,Math.max(0,t/1.5));
  return 1.25*Math.sin(t*frequency+phase)*fade*fade*(3-2*fade);
}
export function pyramidMotion(t:number,tier:number):number {return pyramidBlockMotion(t,tier,0);}
export function pyramidSurfaceMotion(t:number,tier:number,x:number,z:number):number {
  let top=-Infinity;
  for(const block of PYRAMID_BLOCKS) if(block.tier===tier&&Math.abs(x-block.x)<=block.width/2+.04&&Math.abs(z-block.z)<=block.depth/2+.04) top=Math.max(top,pyramidBlockMotion(t,tier,block.index));
  return Number.isFinite(top) ? top:pyramidMotion(t,tier);
}
export const PAINTING_ANSWERS=[1,2,0,2,1,0,0,2];
export function paintingAnswer(row:number):number {return PAINTING_ANSWERS[row%8];}
export function basinHeight(x:number,z:number,radius=18,depth=10,bottom=8):number {return bottom+depth*Math.min(1,(x*x+z*z)/(radius*radius));}
export function gyrationRoute():Vector3Data[] {
  // The two opposed, almost complete circles in the supplied Gyration overview.
  const points:Vector3[]=[new Vector3(22,12,24),new Vector3(9,12,18.7)];
  const first={x:-15,z:0,r:17};
  for(let i=0;i<=24;i++) {const a=.9+i/24*(Math.PI*1.5-.9);points.push(new Vector3(first.x+Math.cos(a)*first.r,12,first.z+Math.sin(a)*first.r));}
  const second={x:10,z:-35,r:15};
  for(let i=0;i<=24;i++) {const a=Math.PI/2-i/24*(Math.PI*1.25);points.push(new Vector3(second.x+Math.cos(a)*second.r,12,second.z+Math.sin(a)*second.r));}
  points.push(new Vector3(-14,12,-35),new Vector3(-30,12,-35));
  return new CatmullRomCurve3(points,false,"centripetal").getSpacedPoints(400).map(p=>({x:p.x,y:p.y,z:p.z}));
}
export function romanRail(index:number):Vector3Data[] {
  return Array.from({length:181},(_,i)=>{const t=i/180;return {x:(index-1.5)*6+Math.sin(t*Math.PI*2)*4,y:12+Math.sin(t*Math.PI)**2*1.8,z:10-t*140};});
}
export function gemGapAngle(index:number):number {return index%2===0 ? 0:Math.PI;}
export function gemSpeed(index:number):number {return .32+index*.17;}
