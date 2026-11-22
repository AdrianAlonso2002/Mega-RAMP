import {CatmullRomCurve3,Vector3} from "three";

/** Centre-line traced from the supplied DS overview. Image coordinates describe
 * proportions, not extracted game data; ground depth compensates for the view. */
export function createBackRoundRoute() {
  const anchors=[
    [670,575,12],[480,545,11],[267,520,10],
    [210,420,9],[208,310,8],[263,211,7],[365,144,6],
    [500,115,5.4],[629,141,4.8],[699,204,4.4],
    [710,258,4],[670,308,3.6],[598,333,3.3],
    [531,326,3],[479,301,2.7],[446,276,2.4],
    [401,274,2.1],[369,292,1.8],[353,323,1.5],
    [361,355,1.2],[389,373,.95],[417,361,.75],
    [429,340,.65],[421,319,.6],[434,308,.6],[459,309,.6]
  ];
  const curve=new CatmullRomCurve3(anchors.map(([x,y])=>new Vector3((y-575)*.24,28,(x-670)*.18)),false,"centripetal");
  const points=curve.getPoints(400).map(p=>({x:p.x,y:p.y,z:p.z}));
  const widths=points.map((_,i)=>{
    const t=i/(points.length-1)*(anchors.length-1),a=Math.min(anchors.length-2,Math.floor(t));
    return anchors[a][2]+(anchors[a+1][2]-anchors[a][2])*(t-a);
  });
  return {points,widths,width:12};
}
