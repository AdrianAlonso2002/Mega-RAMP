/** One fixed launch velocity for every palm pad, including linear air damping. */
export function palmLaunchSpeed(rise:number,gravity=18,damping=.12):number {
  if(rise<=0||!Number.isFinite(rise))return 0;
  const g=Math.abs(gravity);
  let low=0,high=Math.sqrt(2*g*rise)*2+1;
  for(let i=0;i<28;i++) {
    const speed=(low+high)/2;
    const height=damping>0?speed/damping-g/(damping*damping)*Math.log1p(damping*speed/g):speed*speed/(2*g);
    if(height<rise)low=speed;else high=speed;
  }
  return (low+high)/2;
}
