import type {LevelData} from './LevelTypes';
import {stageStorage as localStorage} from '../storage/StageStorage';

type LoadStage=(world:number,level:number,stage:number)=>Promise<LevelData>;
/** Only one ten-stage level is retained; live editor saves always supersede a prepared snapshot. */
export class PreparedLevel {
  private key='';
  private generation=0;
  private readonly stages=new Map<number,{signature:string|null;data:LevelData}>();
  constructor(private readonly load:LoadStage,private readonly signature=(w:number,l:number,s:number)=>{
    try{return localStorage.getItem(`custom_stage_${w}_${l}_${s}`);}catch{return null;}
  }){}

  async getStage(world:number,level:number,stage:number):Promise<LevelData> {
    this.select(world,level);
    const generation=this.generation,cached=this.stages.get(stage);
    if(cached&&cached.signature===this.signature(world,level,stage))return structuredClone(cached.data);
    const data=await this.load(world,level,stage);
    if(generation===this.generation)this.stages.set(stage,{signature:this.signature(world,level,stage),data:structuredClone(data)});
    return data;
  }

  async prepare(world:number,level:number,signal?:AbortSignal):Promise<LevelData[]> {
    this.select(world,level);const generation=this.generation,result:LevelData[]=[];
    for(let stage=1;stage<=10;stage++) {
      if(signal?.aborted||generation!==this.generation)throw new DOMException('Carga cancelada','AbortError');
      result.push(await this.getStage(world,level,stage));
      // Give the loading animation a frame between small batches instead of blocking the UI.
      if(stage%2===0&&stage<10)await new Promise(resolve=>setTimeout(resolve,0));
    }
    return result;
  }

  clear():void {this.key='';this.generation++;this.stages.clear();}
  private select(world:number,level:number):void {
    const key=`${world}:${level}`;
    if(this.key!==key){this.clear();this.key=key;}
  }
}
