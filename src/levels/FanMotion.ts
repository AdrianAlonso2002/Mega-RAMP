export interface FanPose {angle:number;speed:number;slow:boolean}
/** Integral of the seven-second speed cycle: deterministic after reset and at any FPS. */
export function fanMotion(time:number,direction:number,out:FanPose):FanPose {
  const elapsed=Math.max(0,time),cycles=Math.floor(elapsed/7),t=elapsed-cycles*7;
  let angle=0,speed=7;
  if(t<4){angle=7*t;}
  else if(t<4.6){const u=t-4;speed=7-6.45*u/.6;angle=28+7*u-6.45*u*u/1.2;}
  else if(t<6.4){speed=.55;angle=30.265+.55*(t-4.6);}
  else {const u=t-6.4;speed=.55+6.45*u/.6;angle=31.255+.55*u+6.45*u*u/1.2;}
  out.angle=(cycles*33.52+angle)*direction||0;out.speed=speed*direction;out.slow=t>=4.6&&t<6.4;return out;
}
