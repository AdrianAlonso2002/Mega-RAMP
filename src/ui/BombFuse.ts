/** pathLength normalizes the SVG geometry to 1000 units on every viewport. */
export function bombFuse(elapsed:number,limit:number):{remaining:number;dash:string;offset:string} {
  const progress=Math.min(1,Math.max(0,elapsed/Math.max(1,limit)));
  return {remaining:Math.max(0,limit-elapsed),dash:`${1000*(1-progress)} ${1000*progress}`,offset:String(-1000*progress)};
}
