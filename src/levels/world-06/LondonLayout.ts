import type {LevelObjectData,Vector3Data} from "../LevelTypes";
export const v=(x:number,y:number,z:number):Vector3Data=>({x,y,z});
export class LondonLayout {
  readonly objects:LevelObjectData[]=[];
  constructor(private readonly stage:number,private readonly level=1) {}
  add(name:string,type:LevelObjectData["type"],position:Vector3Data,scale=v(1,1,1),properties:Record<string,unknown>={},rotation=v(0,0,0)) {
    this.objects.push({id:`w6s${this.level}${this.stage}-${name}`,type,position,rotation,scale,properties});
  }
  block(name:string,position:Vector3Data,scale:Vector3Data,color="#bfc8d0",properties:Record<string,unknown>={}) {
    this.add(name,"platform",position,scale,{theme:"custom_color",customColor:color,...properties});
  }
  decor(name:string,kind:string,position:Vector3Data,scale=v(1,1,1),properties:Record<string,unknown>={},yaw=0) {
    this.add(name,"decoration",position,scale,{subType:`london_${kind}`,hasCollision:false,...properties},v(0,yaw,0));
  }
  coins(points:Vector3Data[],properties:Record<string,unknown>={}) {
    const offset=this.objects.filter(o=>o.type==="collectible").length;
    points.forEach((p,i)=>this.add(`coin-${offset+i}`,"collectible",p,v(.42,.42,.42),properties));
  }
  goal(position:Vector3Data) {this.add("goal","goal",position);}
}
