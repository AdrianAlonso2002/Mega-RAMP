import * as THREE from 'three';
import type {ArtDirection} from './ArtDirection';
import type {GraphicsQuality} from './GraphicsQuality';
import type {ActiveGoal} from '../levels/LevelBuilder';

/** Fixed, small pools: no physical objects, gameplay lights, or per-frame allocations. */
export class WorldAtmosphere {
  readonly group=new THREE.Group();
  private readonly positions=new Float32Array(96*3);
  private readonly geometry=new THREE.BufferGeometry();
  private readonly glowTexture:THREE.DataTexture;
  private readonly cloudTexture:THREE.DataTexture;
  private readonly particles:THREE.Points<THREE.BufferGeometry,THREE.PointsMaterial>;
  private readonly goalParticles:THREE.Points<THREE.BufferGeometry,THREE.PointsMaterial>;
  private readonly goalPositions=new Float32Array(16*3);
  private readonly halo:THREE.Sprite;
  private readonly clouds:THREE.Sprite[]=[];
  private quality:GraphicsQuality='medium';
  private palette?:ArtDirection;
  private time=0;
  constructor() {
    const glow=new Uint8Array(32*32*4);for(let y=0;y<32;y++) for(let x=0;x<32;x++) {const r=Math.hypot((x-15.5)/15.5,(y-15.5)/15.5),i=(y*32+x)*4;glow[i]=glow[i+1]=glow[i+2]=255;glow[i+3]=Math.round(255*Math.exp(-r*r*5)*Math.max(0,1-r));}
    this.glowTexture=new THREE.DataTexture(glow,32,32,THREE.RGBAFormat);this.glowTexture.minFilter=THREE.LinearFilter;this.glowTexture.magFilter=THREE.LinearFilter;this.glowTexture.needsUpdate=true;
    const cloud=new Uint8Array(128*64*4);for(let y=0;y<64;y++) for(let x=0;x<128;x++) {let alpha=0;for(const [cx,cy,rx,ry] of [[34,36,23,17],[57,27,27,22],[83,35,28,17],[103,39,17,12]]) {const d=((x-cx)/rx)**2+((y-cy)/ry)**2;alpha=Math.max(alpha,Math.max(0,1-d)**2);}const i=(y*128+x)*4;cloud[i]=cloud[i+1]=cloud[i+2]=255;cloud[i+3]=Math.round(alpha*255);}
    this.cloudTexture=new THREE.DataTexture(cloud,128,64,THREE.RGBAFormat);this.cloudTexture.minFilter=THREE.LinearFilter;this.cloudTexture.magFilter=THREE.LinearFilter;this.cloudTexture.needsUpdate=true;
    this.geometry.setAttribute('position',new THREE.BufferAttribute(this.positions,3).setUsage(THREE.DynamicDrawUsage));
    this.particles=new THREE.Points(this.geometry,new THREE.PointsMaterial({map:this.glowTexture,size:.09,transparent:true,opacity:.4,depthWrite:false,toneMapped:false}));this.particles.frustumCulled=false;
    const goalGeometry=new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(this.goalPositions,3).setUsage(THREE.DynamicDrawUsage));
    this.goalParticles=new THREE.Points(goalGeometry,new THREE.PointsMaterial({map:this.glowTexture,color:0xffd790,size:.11,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));this.goalParticles.frustumCulled=false;
    this.halo=new THREE.Sprite(new THREE.SpriteMaterial({map:this.glowTexture,color:0xa8dbed,transparent:true,opacity:.11,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));this.halo.scale.set(6,6,1);this.halo.renderOrder=6;
    this.group.name='visual-world-atmosphere';this.group.userData.graphicsOnly=true;this.group.add(this.particles,this.goalParticles,this.halo);
    for(let i=0;i<4;i++) {const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:this.cloudTexture,color:0xe9eff2,opacity:.18,transparent:true,depthWrite:false,fog:false,toneMapped:false}));sprite.scale.set(70+i*12,35+i*6,1);this.clouds.push(sprite);this.group.add(sprite);}
  }
  configure(palette:ArtDirection):void {this.palette=palette;this.time=0;this.particles.material.color.setHex(palette.weather==='snow' ? 0xeaf5ff:palette.weather==='petals' ? 0xf2bfd3:0xe0d4a9);this.particles.material.size=palette.weather==='snow' ? .12:.07;}
  setQuality(quality:GraphicsQuality):void {this.quality=quality;}
  update(delta:number,focus:THREE.Vector3,goal?:ActiveGoal|null):void {
    this.time+=Math.min(delta,.05);const p=this.palette;if(!p) {this.group.visible=false;return;}this.group.visible=!p.dark;
    const count=this.quality==='high' ? 96:this.quality==='medium' ? 32:0;
    this.geometry.setDrawRange(0,count);this.particles.visible=p.weather!=='none'&&count>0;
    if(this.particles.visible) {
      const speed=p.weather==='snow' ? 1.1:p.weather==='petals' ? .4:-.12;
      for(let i=0;i<count;i++) {
        this.positions[i*3]=focus.x+((i*13.713+this.time*.2)%44)-22+Math.sin(this.time*.35+i)*.4;
        this.positions[i*3+1]=focus.y+((i*5.731-this.time*speed)%18+18)%18;
        this.positions[i*3+2]=focus.z+((i*17.319+this.time*.12)%44)-22;
      }
      this.geometry.getAttribute('position').needsUpdate=true;
    }
    this.clouds.forEach((cloud,i)=>{cloud.visible=!p.interior&&this.quality!=='low'&&(this.quality==='high'||i<2);const angle=i*1.7+this.time*.002;cloud.position.set(focus.x+Math.sin(angle)*180,focus.y+65+i*9,focus.z+Math.cos(angle)*180);});
    const showGoal=!!goal&&goal.mesh.visible&&goal.mesh.userData.searchHidden!==true&&goal.portalMesh?.visible!==false&&this.quality!=='low'&&!p.dark;
    this.halo.visible=showGoal;this.goalParticles.visible=showGoal;
    if(showGoal&&goal) {
      this.halo.position.copy(goal.position);this.halo.position.y+=1.6;this.halo.material.opacity=(goal.reached ? .2:.1)+Math.sin(this.time*1.5)*.012;
      const n=this.quality==='high' ? 16:6;this.goalParticles.geometry.setDrawRange(0,n);
      for(let i=0;i<n;i++) {const a=i*2.399+this.time*.25;this.goalPositions[i*3]=goal.position.x+Math.cos(a)*(1.9+i%3*.18);this.goalPositions[i*3+1]=goal.position.y+.3+(i*.31+this.time*.38)%3.5;this.goalPositions[i*3+2]=goal.position.z+Math.sin(a)*.7;}
      this.goalParticles.geometry.getAttribute('position').needsUpdate=true;
    }
  }
  dispose():void {this.geometry.dispose();this.particles.material.dispose();this.goalParticles.geometry.dispose();this.goalParticles.material.dispose();this.halo.material.dispose();for(const c of this.clouds) c.material.dispose();this.glowTexture.dispose();this.cloudTexture.dispose();}
}
