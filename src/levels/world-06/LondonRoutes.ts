import {CatmullRomCurve3,Vector3} from "three";
import type {Vector3Data} from "../LevelTypes";

export const LONDON_REVISION="queens-christmas-v1";
export const COLD_RUN_LENGTH=211.5;
export const HAIR_HOT_LENGTH=289.3;
export const FLIGHT_LAP_SECONDS=18;
export const FLIGHT_LANDING_SECONDS=12;
export const FLIGHT_END=4*FLIGHT_LAP_SECONDS+FLIGHT_LANDING_SECONDS;
export function planePose(time:number) {
  const t=Math.max(0,time),angle=Math.min(t,72)/FLIGHT_LAP_SECONDS*Math.PI*2;
  if(t<=72) return {position:new Vector3(-85+85*Math.cos(angle),80+Math.sin(angle)*3,-85*Math.sin(angle)),yaw:angle,bank:-.12,landed:false};
  const u=Math.min(1,(t-72)/FLIGHT_LANDING_SECONDS),s=u*u*(3-2*u);
  return {position:new Vector3(0,80+( .6-80)*s,-160*u),yaw:0,bank:0,landed:u>=1};
}
/** Two seconds at each station, ten seconds per journey, including easing. */
export function trainPose(time:number,phase=0) {
  const t=((time+phase)%24+24)%24;
  const u=t<2 ? 0:t<12 ? (t-2)/10:t<14 ? 1:1-(t-14)/10;
  const progress=u*u*(3-2*u),doors=t<2 || t>=12 && t<14;
  return {progress,doors,atEnd:t>=12 && t<14,atStart:t<2};
}
export function crowPitch(time:number,phase=0):number {
  const t=time*1.15+phase;
  return .2+.95*Math.cos(t);
}
export function hairPose(age:number) {
  const t=((age%11.5)+11.5)%11.5;
  const angle=t<11 ? .36:t<11.18 ? .36*(1-(t-11)/.18):t<11.26 ? 0:.36*Math.min(1,(t-11.26)/.24);
  return {angle,crushing:t>=11.1 && t<11.34,charge:Math.min(1,t/11)};
}
export function millipedeRoute():Vector3Data[] {
  // Trace of the user's DS overview: long straight approach followed by the
  // alternating shallow bends and the final tighter left/right turn.
  const anchors=[[910,420],[760,373],[620,336],[540,318],[475,307],[425,269],[345,251],[295,245],[267,188],[235,156],[100,131]];
  return new CatmullRomCurve3(anchors.map(([x,y])=>new Vector3((y-420)*.22,12,(x-910)*.18)),false,"centripetal").getPoints(240).map(p=>({x:p.x,y:p.y,z:p.z}));
}

export interface MazeWall {x:number;z:number;w:number;d:number}
export interface LondonMaze {size:number;cell:number;walls:MazeWall[];links:number[][];solution:number[]}
export function londonMaze(seed:number,size=9,cell=4.8):LondonMaze {
  let state=seed>>>0;
  const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
  const links=Array.from({length:size*size},()=>[] as number[]),seen=new Set([0]),stack=[0];
  while(stack.length) {
    const a=stack[stack.length-1],x=a%size,z=Math.floor(a/size),options:number[]=[];
    if(x>0&&!seen.has(a-1)) options.push(a-1);if(x<size-1&&!seen.has(a+1)) options.push(a+1);
    if(z>0&&!seen.has(a-size)) options.push(a-size);if(z<size-1&&!seen.has(a+size)) options.push(a+size);
    if(!options.length) {stack.pop();continue;}
    const b=options[Math.floor(random()*options.length)];links[a].push(b);links[b].push(a);seen.add(b);stack.push(b);
  }
  const walls:MazeWall[]=[],half=size*cell/2;
  for(let z=0;z<size;z++) for(let x=0;x<size;x++) {
    const a=z*size+x,cx=-half+(x+.5)*cell,cz=half-(z+.5)*cell;
    if(x===0) walls.push({x:cx-cell/2,z:cz,w:.4,d:cell+.4});
    if(z===0) walls.push({x:cx,z:cz+cell/2,w:cell+.4,d:.4});
    if(x===size-1||!links[a].includes(a+1)) walls.push({x:cx+cell/2,z:cz,w:.4,d:cell+.4});
    if(z===size-1||!links[a].includes(a+size)) walls.push({x:cx,z:cz-cell/2,w:cell+.4,d:.4});
  }
  const target=Math.floor(size*size/2),parents=new Map<number,number>([[0,-1]]),queue=[0];
  for(let i=0;i<queue.length;i++) for(const b of links[queue[i]]) if(!parents.has(b)) {parents.set(b,queue[i]);queue.push(b);}
  const solution:number[]=[];for(let n=target;n!==-1;n=parents.get(n)!) solution.unshift(n);
  return {size,cell,walls,links,solution};
}
export function mazeCell(maze:LondonMaze,index:number):Vector3Data {
  return {x:(index%maze.size-(maze.size-1)/2)*maze.cell,y:0,z:((maze.size-1)/2-Math.floor(index/maze.size))*maze.cell};
}
