import * as THREE from "three";
let letter:THREE.CanvasTexture|undefined;
/** Three recycled letters; no DOM nodes, per-frame allocations or extra render loop. */
export class SleepEffect {
  readonly group=new THREE.Group();
  private time=0;
  constructor() {
    if(!letter){const canvas=document.createElement('canvas');canvas.width=canvas.height=64;const ctx=canvas.getContext('2d')!;ctx.font='bold 48px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=5;ctx.strokeStyle='#254353';ctx.strokeText('Z',32,33);ctx.fillStyle='#e2faff';ctx.fillText('Z',32,33);letter=new THREE.CanvasTexture(canvas);letter.colorSpace=THREE.SRGBColorSpace;}
    for(let i=0;i<3;i++){const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:letter,transparent:true,depthWrite:false}));sprite.renderOrder=21;this.group.add(sprite);}
    this.group.visible=false;
  }
  update(delta:number,active:boolean):void {
    this.group.visible=active;if(!active){this.time=0;return;}
    this.time+=delta;
    this.group.children.forEach((child,i)=>{const sprite=child as THREE.Sprite,p=(this.time/2.7+i/3)%1;sprite.position.set(.35+p*.55,.65+p*1.25,0);sprite.scale.setScalar(.17+p*.18);sprite.material.opacity=Math.sin(Math.PI*p)*.8;});
  }
  destroy():void {for(const child of this.group.children)(child as THREE.Sprite).material.dispose();this.group.clear();}
}
