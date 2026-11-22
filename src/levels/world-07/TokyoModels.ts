import * as THREE from 'three';
import type {LevelObjectData} from '../LevelTypes';
import {LondonBatch,londonLabel} from '../world-06/LondonModels';
import {createOsakaModel} from './OsakaModels';
import {clawCycle,tokyoPedestrianPose,tokyoFlipperAngle,tokyoFoldAngle,tokyoChainAngle,tokyoPulsePose} from './TokyoRoutes';
import {buildTokyoKaiju,poseTokyoKaiju} from './TokyoKaiju';
const navy=0x24364e,cyan=0x81dfe2,pink=0xe7a0c8,white=0xe5e9ea;
function beam(b:LondonBatch,a:THREE.Vector3,c:THREE.Vector3,color:number,r=.14){const d=c.clone().sub(a),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());b.add(new THREE.CylinderGeometry(r,r,d.length(),6),color,a.clone().add(c).multiplyScalar(.5),new THREE.Euler().setFromQuaternion(q));}
export function createTokyoModel(obj:LevelObjectData,quality='medium'):{group:THREE.Group;meshes:THREE.Mesh[]}|null {
 const type=String(obj.properties?.subType??'');if(!type.startsWith('tokyo_'))return null;
 const kind=type.slice(6),p=obj.properties??{};
 if(kind==='path'||kind==='building')return createOsakaModel({...obj,properties:{...p,subType:`osaka_${kind}`}},quality);
 const group=new THREE.Group(),b=new LondonBatch();
 switch(kind){
 case 'pulse_emitter':{
  b.ball(0,3.6,0,.72,.3,.72,navy);b.ring(.78,.07,0,3.6,0,cyan,true,'glow');b.cylinder(.22,.35,0,3.25,0,pink,'glow');
  for(let j=0;j<3;j++){const a=j*Math.PI*2/3;b.box(.24,.2,.6,Math.cos(a)*.9,3.6,Math.sin(a)*.9,cyan,'glow');}
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.07,6,quality==='low'?32:64).rotateX(Math.PI/2),new THREE.MeshBasicMaterial({color:0x4ff5ff,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));ring.name='tokyo-shockwave';ring.position.y=.55;ring.userData.noCollision=true;group.add(ring);
  const charge=new THREE.Mesh(new THREE.TorusGeometry(.55,.045,6,32).rotateX(Math.PI/2),new THREE.MeshBasicMaterial({color:0xff84df,transparent:true,depthWrite:false,toneMapped:false}));charge.name='tokyo-pulse-charge';charge.position.y=.06;charge.userData.noCollision=true;group.add(charge);break;
 }
 case 'pinball_table':{
  const w=Number(p.width??24),length=Number(p.length??98);b.box(w,.8,length,0,-.4,0,0x385c79);
  const lines:number[]=[];for(let x=-w/2+2;x<w/2;x+=2)lines.push(x,.018,-length/2,x,.018,length/2);for(let z=-length/2+2;z<length/2;z+=2)lines.push(-w/2,.018,z,w/2,.018,z);
  const grid=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(lines,3)),new THREE.LineBasicMaterial({color:0x7ecdd6,transparent:true,opacity:.55}));group.add(grid);break;
 }
 case 'streets':{
  b.box(100,.5,100,0,-.3,0,0x334454);for(const x of [-36,36])for(const z of [-36,36])b.box(24,.3,24,x,.2,z,0x657481);
  for(let i=0;i<14;i++){const x=-20+i*3;b.box(1.6,.03,13,x,.01,-25,white);b.box(1.6,.03,13,x,.01,25,white);b.box(13,.03,1.6,-25,.01,x,white);b.box(13,.03,1.6,25,.01,x,white);}
  for(const side of [-1,1])for(let i=0;i<10;i++)b.add(new THREE.BoxGeometry(1.6,.03,6),white,{x:side*(-13+i*2.8),y:.02,z:-13+i*2.8},{x:0,y:side*Math.PI/4,z:0});break;
 }
 case 'stripe':case 'tile':{const w=Number(p.width??3),d=Number(p.depth??3),h=Number(p.height??.38);b.box(w,h,d,0,-h/2,0,kind==='stripe'?white:navy);if(kind==='tile'){b.box(w-.12,.025,d-.12,0,.015,0,cyan,'glow');for(const x of [-w/2,w/2])b.box(.08,.08,d,x,.02,0,pink,'glow');if(p.chain)for(const side of [-1,1])b.box(w,.22,.1,0,.11,side*(d/2-.05),cyan,'glow');}break;}
 case 'pedestrian':{
  for(const pose of [0,1,-1]){const icon=new THREE.Group(),s=new LondonBatch();icon.name=pose===0?'signal-stop':pose===1?'signal-walk-a':'signal-walk-b';
   s.ball(0,2.05,0,.28,.28,.16,0xffffff);s.box(.46,.85,.24,0,1.32,0,0xffffff);
   for(const side of [-1,1]){const stride=pose*side;s.add(new THREE.BoxGeometry(.22,.95,.22),0xffffff,{x:side*(pose?.32:.14),y:.48,z:0},{x:0,y:0,z:pose?stride*.5:0});s.add(new THREE.BoxGeometry(.2,.8,.2),0xffffff,{x:side*(pose?.45:.34),y:1.35,z:0},{x:0,y:0,z:pose?-stride*.65:side*.08});}
   for(const mesh of s.finish(icon)){const old=mesh.material;mesh.material=new THREE.MeshBasicMaterial({color:pose?0x41ef95:0xff566e,vertexColors:true,toneMapped:false});if(!Array.isArray(old))old.dispose();}group.add(icon);
  }break;
 }
 case 'vending':{
  b.box(2.8,5.3,2,0,2.65,0,Number(p.color??0xa9cddd));b.box(2.3,3,.12,0,3.2,1.06,navy);for(let i=0;i<3;i++)for(let j=0;j<4;j++){b.cylinder(.14,.4,-.8+j*.54,2.25+i*.8,1.15,[pink,cyan,0xe5c791][(i+j)%3]);b.box(.18,.07,.08,-.8+j*.54,1.98+i*.8,1.23,cyan,'glow');}b.box(1.7,.5,.13,0,.8,1.08,navy);b.box(.24,.6,.15,1,1.4,1.1,white);londonLabel(group,'TOKYO DRINKS',0,4.9,1.03,2.3,.35,'#28415c');break;
 }
 case 'capsules':{
  b.box(9,7,3.3,0,3.5,0,navy);for(let row=0;row<3;row++)for(let col=0;col<3;col++){const x=-3+col*3,y=1.25+row*2.2;b.box(2.7,1.8,.12,x,y,1.72,cyan,'glow');b.box(2.35,1.45,.15,x,y,1.83,0x47617c);b.box(2,.18,.8,x,y-.47,1.5,white);b.box(.55,.3,.5,x-.65,y-.24,1.7,pink);}londonLabel(group,'CAPSULE  24H',0,7.5,1.7,7,.6,'#283e62');break;
 }
 case 'billboard':b.box(13,8,.6,0,4,0,navy);b.box(12.3,7.3,.1,0,4,.35,0x527b9c,'glow');londonLabel(group,String(p.text??'AKIHABARA'),0,4,.44,11,2,'#37557f','#f1d8e6');break;
 case 'signal':b.cylinder(.1,5,0,2.5,0,navy);b.box(.6,1.6,.5,0,4.6,0,navy);b.ball(0,4.95,.3,.19,.19,.06,pink,'glow');b.ball(0,4.3,.3,.19,.19,.06,cyan,'glow');break;
 case 'cabinet':{
  for(const x of [-12,12])for(const z of [-12,12])b.box(.55,19,.55,x,9.5,z,pink,'glow');
  for(const x of [-12,12])b.box(.5,.5,24,x,17,0,navy);for(const z of [-12,12])b.box(24,.5,.5,0,17,z,navy);
  for(const x of [-10,10])b.box(.2,.25,23,x,16.6,0,cyan,'glow');b.box(7,.04,7,8.5,.02,-8.5,cyan,'glow');
  const glass=new THREE.Mesh(new THREE.BoxGeometry(24,6,.05),new THREE.MeshBasicMaterial({color:0xb4dbe9,transparent:true,opacity:.09,depthWrite:false,side:THREE.DoubleSide}));glass.position.set(0,3,-11.9);group.add(glass);
  londonLabel(group,'UFO CATCHER',0,19,-12,19,1.6,'#385780');londonLabel(group,'SUELTA AQUÍ',8.4,2,-11.5,6,.7,'#467b82');break;
 }
 case 'claw':{
  b.box(3,.5,2,0,.3,0,navy);b.cylinder(.14,2,0,-1,0,white);b.ball(0,-2.1,0,.5,.3,.5,pink,'glow');
  const cable=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,1,6),new THREE.MeshStandardMaterial({color:navy}));cable.name='claw-cable';group.add(cable);
  for(let i=0;i<3;i++){const a=i*Math.PI*2/3,g=new THREE.Group(),s=new LondonBatch();g.name=`claw-finger-${i}`;g.position.y=-1.5;g.rotation.y=a;s.box(.16,1.6,.16,0,-.7,.7,white);s.box(.18,.18,.65,0,-1.45,.45,white);s.finish(g);group.add(g);}break;
 }
 case 'flipper':{const side=Number(p.side??1),length=Number(p.length??10.8);b.box(length,.65,1.1,-side*length/2,.1,0,side<0?cyan:pink,'glow');b.cylinder(.55,.8,0,.2,0,white);b.ball(-side*length,.1,0,.52,.33,.54,side<0?cyan:pink,'glow');break;}
 case 'car':{
  const color=Number(p.color??cyan);b.box(2,.65,4,0,.6,0,color,'glow');b.box(1.7,.7,1.9,0,1.2,.1,navy);b.box(1.6,.4,.05,0,1.25,-.9,0xb5dbe0);b.box(1.9,.055,3.5,0,.16,0,color,'glow');
  for(const x of [-1,1])for(const z of [-1.2,1.2]){b.ball(x,.35,z,.22,.35,.35,0x222a36);b.add(new THREE.TorusGeometry(.22,.025,5,18),color,{x:x*1.2,y:.35,z},{x:0,y:Math.PI/2,z:0},'glow');}
  for(const x of [-.65,.65])b.box(.45,.14,.08,x,.65,-2.05,white,'glow');b.box(2.3,.13,.4,0,1.15,1.8,navy);
  const canvas=document.createElement('canvas');canvas.width=canvas.height=32;const context=canvas.getContext('2d')!,gradient=context.createRadialGradient(16,16,0,16,16,16);gradient.addColorStop(0,'rgba(255,255,255,.8)');gradient.addColorStop(1,'rgba(255,255,255,0)');context.fillStyle=gradient;context.fillRect(0,0,32,32);
  const smoke=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(new Float32Array(36),3).setUsage(THREE.DynamicDrawUsage)),new THREE.PointsMaterial({map:new THREE.CanvasTexture(canvas),color:0xc6e3ec,size:.85,transparent:true,opacity:.36,depthWrite:false}));smoke.name='tokyo-tyre-smoke';smoke.frustumCulled=false;group.add(smoke);break;
 }
 case 'godzilla':{
  buildTokyoKaiju(group);break;
 }
 case 'tower':{
  for(let tier=0;tier<10;tier++){const y=tier*4,r=8*(1-tier/12),next=8*(1-(tier+1)/12),color=tier>=6&&tier%2===0?white:0xd07863;
   for(const x of [-1,1])for(const z of [-1,1])beam(b,new THREE.Vector3(x*r,y,z*r),new THREE.Vector3(x*next,y+4,z*next),color,.22);
   for(const side of [-1,1]){b.box(r*2,.18,.18,0,y,side*r,color);b.box(.18,.18,r*2,side*r,y,0,color);for(const diagonal of [-1,1]){beam(b,new THREE.Vector3(diagonal*r,y,side*r),new THREE.Vector3(-diagonal*next,y+4,side*next),color,.1);beam(b,new THREE.Vector3(side*r,y,diagonal*r),new THREE.Vector3(side*next,y+4,-diagonal*next),color,.1);}}
  }b.box(10,2.3,10,0,24,0,white);b.box(10.2,.5,10.2,0,25.3,0,0xd07863);b.box(9,.8,9,0,24.2,0,navy);b.box(6,2,6,0,37,0,white);b.cylinder(.18,18,0,47,0,0xd07863);break;
 }
 case 'fuji':{
  b.add(new THREE.ConeGeometry(36,32,64),0x7f9bb2,{x:0,y:16,z:0});
  const vertices:number[]=[];for(let i=0;i<64;i++){const a=i/64*Math.PI*2,c=(i+1)/64*Math.PI*2,ra=12.8+Math.sin(a*7)*1.1,rc=12.8+Math.sin(c*7)*1.1;vertices.push(0,32.4,0,Math.cos(c)*rc,32-rc/1.125+.4,Math.sin(c)*rc,Math.cos(a)*ra,32-ra/1.125+.4,Math.sin(a)*ra);}
  const snow=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));snow.computeVertexNormals();b.add(snow,0xf0eef0);break;
 }
 default:return null;
 }
 if(kind==='tile'&&p.axis!=='gate'){group.userData.neonSurface=obj.id;group.userData.neonSweepRadius=p.chain?Number(p.width??3)/2:0;}
 b.finish(group);group.name=`tokyo-${kind}`;group.position.copy(obj.position);group.rotation.set(obj.rotation.x,obj.rotation.y,obj.rotation.z);group.scale.copy(obj.scale);
 group.traverse(node=>{if(node instanceof THREE.Mesh){node.castShadow=false;node.receiveShadow=true;node.userData.graphicsNoShadow=true;if(node.name==='london-glow'){const old=node.material;node.material=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false});if(!Array.isArray(old))old.dispose();}}});
 previewTokyoModel(obj,group,0);group.updateMatrixWorld(true);const meshes:THREE.Mesh[]=[];group.traverse(node=>{if(node instanceof THREE.Mesh&&!node.userData.noCollision)meshes.push(node);});return {group,meshes};
}
export function previewTokyoModel(obj:LevelObjectData,group:THREE.Object3D,time:number):boolean {
 if(obj.type==='goal'&&obj.properties?.tokyoAction==='pinballGoal'){group.position.x=obj.position.x+Math.sin(time*.7)*6;return true;}
 const kind=String(obj.properties?.subType??'');if(!kind.startsWith('tokyo_'))return false;const p=obj.properties??{},i=Number(p.index??0);
 if(kind==='tokyo_stripe'||kind==='tokyo_pedestrian')group.position.y=obj.position.y+Math.sin(time*1.15+i*.48)*.65;
 if(kind==='tokyo_pedestrian'){const pose=tokyoPedestrianPose(time,i);group.position.x=obj.position.x+pose.x;const frame=Math.floor(time*7)%2===0;for(const name of ['signal-stop','signal-walk-a','signal-walk-b']){const icon=group.getObjectByName(name);if(icon)icon.visible=name==='signal-stop'?!pose.walking:pose.walking&&(name==='signal-walk-a'?frame:!frame);}}
 if(kind==='tokyo_pulse_emitter'){const pose=tokyoPulsePose(time,i),ring=group.getObjectByName('tokyo-shockwave') as THREE.Mesh,charge=group.getObjectByName('tokyo-pulse-charge') as THREE.Mesh;ring.visible=pose.active;ring.scale.set(pose.radius,1,pose.radius);(ring.material as THREE.MeshBasicMaterial).opacity=pose.opacity;charge.scale.setScalar(.7+pose.charge*1.5);(charge.material as THREE.MeshBasicMaterial).opacity=.15+pose.charge*.7;}
 if(kind==='tokyo_tile'){
  if(p.axis==='gate')group.position.x=obj.position.x+Math.sin(time*Number(p.speed??.9)+i*1.2)*3.4;
  else if(p.chain)group.rotation.z=obj.rotation.z+tokyoChainAngle(time,i,Number(p.chainCount??12),Number(p.chainOffset??0));
  else if(p.restDock)group.rotation.z=obj.rotation.z;
  else if(p.folding)group.rotation.z=obj.rotation.z+tokyoFoldAngle(time,Number(p.cyclePhase??0));
  else group.rotation.z=obj.rotation.z+Math.sin(time*1.25+i*.65)*.23;
 }
 if(kind==='tokyo_flipper')group.rotation.y=obj.rotation.y+tokyoFlipperAngle(time,Number(p.side??1));
 if(kind==='tokyo_car'){const speed=Number(p.speed??3),a=time*speed+i*Math.PI,r=Number(p.radius??7.2);group.position.set(obj.position.x+Math.cos(a)*r,obj.position.y-Number(p.depth??3)*(1-r*r/100)+.12,obj.position.z+Math.sin(a)*r);group.rotation.y=-a+(speed<0?.5:Math.PI-.5);const smoke=group.getObjectByName('tokyo-tyre-smoke') as THREE.Points|undefined;if(smoke){const positions=smoke.geometry.getAttribute('position') as THREE.BufferAttribute;for(let j=0;j<12;j++){const age=(time*1.5+j/12)%1;positions.setXYZ(j,(j%2?1:-1)*.95+Math.sin(j+age*6)*.2,.35+age*1.7,1.1+age*4.8);}positions.needsUpdate=true;}}
 if(kind==='tokyo_godzilla'){group.rotation.y=obj.rotation.y+Math.sin(time*.23)*.1;poseTokyoKaiju(group,time);}
 if(kind==='tokyo_claw'){const cycle=clawCycle(time);group.position.y=obj.position.y-cycle.depth*13.25;for(let j=0;j<3;j++){const f=group.getObjectByName(`claw-finger-${j}`);if(f)f.scale.set(1,1,cycle.closed?.5:1.7);}poseClawCable(group);}
 return true;
}
export function poseClawCable(group:THREE.Object3D):void {const cable=group.getObjectByName('claw-cable');if(cable){const length=Math.max(.1,27-group.position.y);cable.scale.y=length;cable.position.y=length/2+.5;}}
