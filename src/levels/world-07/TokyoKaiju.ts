import * as THREE from 'three';
import {LondonBatch} from '../world-06/LondonModels';
import {tokyoKaijuPose} from './TokyoRoutes';
const skin=0x29414a,ridge=0x3c5960,claw=0xc9c8b3;
function flesh(b:LondonBatch,x:number,y:number,z:number,rx:number,ry:number,rz:number,color=skin){b.add(new THREE.SphereGeometry(1,24,16).scale(rx,ry,rz),color,{x,y,z});}
function finish(b:LondonBatch,group:THREE.Group){b.finish(group);}
/** Sculpted, articulated scenery: all buffers are built once and never enter the physics world. */
export function buildTokyoKaiju(root:THREE.Group):void {
 const torso=new THREE.Group(),body=new LondonBatch();torso.name='kaiju-torso';root.add(torso);
 const profile=[[2.5,2],[4.8,4],[5.7,8],[5.1,12],[4.2,16],[3.1,20],[2.2,23]].map(([r,y])=>new THREE.Vector2(r,y));
 body.add(new THREE.LatheGeometry(profile,40).scale(1,1,.85),skin);
 flesh(body,0,14,-2.5,3.8,6,2.1,ridge);flesh(body,0,21,-.7,2.4,3.2,2.5);
 for(const side of [-1,1]){
  flesh(body,side*3.6,6.3,.7,2.7,5.7,3);flesh(body,side*3.4,2.8,-.8,1.9,2.8,2.3);flesh(body,side*3.4,1,-2.1,2.2,1,3.1);
  for(let i=0;i<3;i++)body.add(new THREE.ConeGeometry(.25,.95,10),claw,{x:side*3.4+(i-1)*.85,y:.65,z:-5.1},{x:-Math.PI/2,y:0,z:0});
  flesh(body,side*4.1,16,-1.3,1.4,2.8,1.6);flesh(body,side*5,13.9,-2.6,1,2,1.1);flesh(body,side*5.1,12.5,-3.6,1,.8,1.25);
  for(let i=0;i<3;i++)body.add(new THREE.ConeGeometry(.16,.8,8),claw,{x:side*5.1+(i-1)*.5,y:12.2,z:-4.7},{x:-Math.PI/2,y:0,z:0});
  for(let i=0;i<7;i++)flesh(body,side*(3.4-i*.17),7+i*1.7,-3.6,.7,.22,.2,ridge);
 }
 finish(body,torso);
 const head=new THREE.Group(),skull=new LondonBatch();head.name='kaiju-head';head.position.set(0,23,-1.2);root.add(head);
 flesh(skull,0,1,0,2.1,2.2,2.4);flesh(skull,0,.65,-2,1.75,.85,2.4);flesh(skull,0,-.15,-2.5,1.4,.3,1.6,0x102029);
 for(const side of [-1,1]){
  flesh(skull,side*1.64,1.3,-1.45,.45,.32,.6,0x102029);flesh(skull,side*1.82,1.35,-1.9,.22,.17,.22,0xffbc5b);
  skull.add(new THREE.BoxGeometry(1,.25,1),ridge,{x:side*1.3,y:1.8,z:-1.9},{x:0,y:0,z:side*.18});
  for(let i=0;i<5;i++)skull.add(new THREE.ConeGeometry(.12,.4,8),claw,{x:side*1.2,y:-.26,z:-.8-i*.65},{x:Math.PI,y:0,z:0});
 }
 finish(skull,head);
 const jaw=new THREE.Group(),lower=new LondonBatch();jaw.name='kaiju-jaw';jaw.position.set(0,-.6,-.5);head.add(jaw);
 flesh(lower,0,0,-1.7,1.5,.5,1.8);flesh(lower,0,.3,-1.8,1.15,.1,1.35,0x183c4b);
 for(const side of [-1,1])for(let i=0;i<4;i++)lower.add(new THREE.ConeGeometry(.12,.38,8),claw,{x:side*1.12,y:.45,z:-.5-i*.7});finish(lower,jaw);
 const spines=new THREE.Group(),plates=new LondonBatch();spines.name='kaiju-spines';root.add(spines);
 const outline=new THREE.Shape();outline.moveTo(-.4,-1.2);outline.lineTo(-1.7,-.3);outline.lineTo(-1.1,.3);outline.lineTo(-2.1,1);outline.lineTo(-.6,.85);outline.lineTo(0,1.8);outline.lineTo(.6,.8);outline.lineTo(1.5,1.1);outline.lineTo(1,.1);outline.lineTo(.6,-1);outline.closePath();
 for(let row=-1;row<=1;row++)for(let i=0;i<7;i++){
  const size=(row===0?1.15:.65)*(1-Math.abs(i-3)*.1),geometry=new THREE.ExtrudeGeometry(outline,{depth:.28,bevelEnabled:true,bevelSize:.1,bevelThickness:.08,bevelSegments:1,steps:1}).scale(size,size,size);
  plates.add(geometry,0x55c9ee,{x:row*1.7,y:6+i*2.5,z:3.3-Math.max(0,i-3)*.15},{x:0,y:Math.PI/2,z:0},'glow');
 }finish(plates,spines);
 let parent:THREE.Group=root;
 for(let i=0;i<8;i++){const segment=new THREE.Group(),tail=new LondonBatch(),r=2.3*(1-i/9);segment.name=`kaiju-tail-${i}`;segment.position.set(0,i===0?4:-.25,i===0?3.2:4.6);parent.add(segment);tail.add(new THREE.CylinderGeometry(Math.max(.1,r-.25),r,4.9,20).rotateX(Math.PI/2),skin,{x:0,y:0,z:2.3});finish(tail,segment);parent=segment;}
 const ray=new THREE.Group();ray.name='kaiju-ray';ray.position.set(0,-.2,-4.15);head.add(ray);
 const core=new THREE.MeshBasicMaterial({color:0xc5fbff,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false});
 const halo=new THREE.MeshBasicMaterial({color:0x218dff,transparent:true,opacity:.22,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false});
 for(const [radius,material] of [[.48,core],[1.2,halo]] as const){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius*.8,radius,1,20,1,true).rotateX(-Math.PI/2).translate(0,0,-.5),material);mesh.userData.noCollision=true;ray.add(mesh);}
 for(let i=0;i<3;i++){const wave=new THREE.Mesh(new THREE.TorusGeometry(1,.07,6,40),halo);wave.name=`kaiju-ray-wave-${i}`;wave.userData.noCollision=true;ray.add(wave);}
 poseTokyoKaiju(root,0);
}
export function poseTokyoKaiju(root:THREE.Object3D,time:number):void {
 const pose=tokyoKaijuPose(time),head=root.getObjectByName('kaiju-head'),jaw=root.getObjectByName('kaiju-jaw'),torso=root.getObjectByName('kaiju-torso'),spines=root.getObjectByName('kaiju-spines'),ray=root.getObjectByName('kaiju-ray');
 if(torso)torso.scale.y=1+Math.sin(time*.9)*.012;
 if(head){head.rotation.x=.05+pose.pitch;head.rotation.y=Math.sin(time*.33)*.07*(1-pose.charge);}
 if(jaw)jaw.rotation.x=-.08-.42*pose.charge;
 if(spines)spines.traverse(node=>{if(node instanceof THREE.Mesh)(node.material as THREE.MeshBasicMaterial).color.setScalar(.3+pose.charge*.7+pose.blast*.3);});
 for(let i=0;i<8;i++){const tail=root.getObjectByName(`kaiju-tail-${i}`);if(tail)tail.rotation.y=Math.sin(time*.65-i*.6)*(.05+i*.005);}
 if(ray){ray.visible=pose.blast>.001;const flicker=1+Math.sin(time*45)*.04;ray.scale.set(flicker,flicker,110*pose.blast);for(let i=0;i<3;i++){const wave=ray.getObjectByName(`kaiju-ray-wave-${i}`);if(wave){const t=(time*.7+i/3)%1;wave.position.z=-t;wave.scale.set(1+t*1.6,1+t*1.6,.01);}}}
}
