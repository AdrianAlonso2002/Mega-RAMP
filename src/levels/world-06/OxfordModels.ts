import * as THREE from "three";
import type {LevelObjectData} from "../LevelTypes";
import {LondonBatch,londonLabel,londonPine,type LondonModel} from "./LondonModels";
import {buzzPosition,oxfordTrainZ,oxfordMagnetY,strawPose,trailHeight,trailHoleAt,trailHalfWidth,OXFORD_BEAR_RATE,milkRingSpeed} from "./OxfordRoutes";
const stone=0xc5b18d,cream=0xe9dcc4,dark=0x283c48,wood=0x765239,gold=0xcda861,green=0x315d58,tau=Math.PI*2;
export function createOxfordSkyGoal():THREE.Group {
  const group=new THREE.Group(),ring=new THREE.Mesh(new THREE.TorusGeometry(4.2,.22,10,64),new THREE.MeshStandardMaterial({color:0xe2b45c,emissive:0xc49a45,emissiveIntensity:.65,metalness:.65,roughness:.3}));
  ring.rotation.x=Math.PI/2;ring.name='oxford-sky-goal';group.add(ring);
  const starGeometry=new THREE.OctahedronGeometry(.23),starMaterial=new THREE.MeshBasicMaterial({color:0xffe6ac});
  for(let i=0;i<12;i++) {const star=new THREE.Mesh(starGeometry,starMaterial),a=i*Math.PI/6;star.position.set(Math.cos(a)*4.2,0,Math.sin(a)*4.2);group.add(star);}
  return group;
}
function buzzLabel(group:THREE.Group,index:number):void {
  if(typeof document==='undefined') return;
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=320;const ctx=canvas.getContext('2d');if(!ctx) return;
  ctx.fillStyle='#f5e8cf';ctx.fillRect(0,0,768,320);ctx.strokeStyle='#b99e67';ctx.lineWidth=9;ctx.strokeRect(10,10,748,300);
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#283c48';ctx.font='bold 112px Georgia';ctx.fillText('BuzzBallz',384,125,720);
  ctx.font='bold 36px Arial';ctx.fillText(['CHERRY','BLUE','CITRUS'][index%3],384,240);
  const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
  const material=new THREE.MeshStandardMaterial({map,roughness:.7,side:THREE.DoubleSide});material.addEventListener('dispose',()=>map.dispose());
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(6.035,32,16,Math.PI*.27,Math.PI*.46,Math.PI*.32,Math.PI*.31),material);group.add(mesh);
}
function spire(b:LondonBatch,x:number,y:number,z:number,h=15) {
  b.box(3,h+.1,3,x,y+(h-.1)/2,z,stone);b.box(3.5,.45,3.5,x,y+h,z,cream);
  for(const dx of [-1.25,1.25]) for(const dz of [-1.25,1.25]) b.add(new THREE.ConeGeometry(.38,3,6),stone,{x:x+dx,y:y+h+1.65,z:z+dz});
  for(let i=0;i<3;i++) b.box(.7,1.8,.08,x,y+3+i*3,z+1.565,dark);
}
function arch(b:LondonBatch,x:number,y:number,z:number,width:number,height:number) {
  for(const side of [-1,1]) b.box(.55,height,width*.18,x+side*width/2,y+height/2,z,stone);
  for(let i=0;i<14;i++) {const a=(i+.5)*Math.PI/14;b.add(new THREE.BoxGeometry(width*.125,.6,width*.18),cream,{x:x+Math.cos(a)*width/2,y:y+height+Math.sin(a)*width/2,z},{x:0,y:0,z:a-Math.PI/2});}
}
function college(b:LondonBatch,g:THREE.Group) {
  b.box(19,11.1,5,0,5.45,0,stone);b.box(20.6,.4,5.6,0,11,0,cream);
  for(const x of [-8.5,8.5]) spire(b,x,0,0,14);
  for(const x of [-5.7,-2.8,0,2.8,5.7]) for(const y of [4,8]) {
    b.box(1.4,2.4,.09,x,y,2.55,dark);b.box(.08,2.5,.15,x,y,2.62,cream);b.box(1.5,.08,.15,x,y,2.63,cream);
    b.add(new THREE.SphereGeometry(.71,10,6,0,tau,0,Math.PI/2).scale(1,.7,.08),dark,{x,y:y+1.2,z:2.55});
  }
  b.box(2.7,3.2,.1,0,1.6,2.6,wood);arch(b,0,0,2.7,3.2,3.1);londonLabel(g,'OXFORD',0,10.2,2.57,6,.7,'#c5b18d','#273d48');
}
function train(b:LondonBatch,g:THREE.Group) {
  b.box(4.5,.35,36,0,1.025,0,0x647479);b.box(4.7,.4,36,0,.35,0,dark);
  // Open interior, solid window panels and end doorway. No coplanar glazing.
  for(const x of [-2.2,2.2]) {
    b.box(.22,1.2,36,x,1.8,0,green);b.box(.22,.45,36,x,4.4,0,cream);
    for(let i=0;i<12;i++) {const z=-16.5+i*3;b.box(.24,1.95,.13,x,3.2,z,cream);b.box(.12,1.45,2.65,x,3.23,z+1.47,0x526d78);}
    b.box(.25,.13,36,x,2.44,0,gold);
    for(let i=0;i<8;i++) {b.box(.8,.4,1.7,x*.72,1.5,-13+i*3.5,0x815857);b.box(.25,1.1,1.7,x*.86,1.9,-13+i*3.5,0x815857);}
  }
  b.box(4.5,.28,36,0,4.75,0,cream);
  for(const x of [-1.75,1.75]) for(const z of [-12,-9,9,12]) b.add(new THREE.CylinderGeometry(.6,.6,.25,12).rotateZ(Math.PI/2),0x222b31,{x,y:.55,z});
  b.box(4.5,3.4,.3,0,2.9,-18,green);
  for(const x of [-1.95,1.95]) b.box(.55,3.3,.3,x,2.9,18,green);
  const doors=new THREE.Group();doors.name='oxford-train-door';const db=new LondonBatch();
  for(const x of [-.82,.82]) db.box(1.65,3.3,.24,x,2.9,18,green);db.finish(doors);g.add(doors);
  for(const x of [-1.5,1.5]) b.ball(x,2.2,-18.18,.2,.15,.08,0xffe0a2,'glow');
  londonLabel(g,'OXFORD',0,4.15,18.17,3,.45,'#315d58');
}
function bear(b:LondonBatch,g:THREE.Group) {
  b.ball(0,3.7,0,2.25,3.1,1.7,0x75513c);b.ball(0,6.9,-.5,1.8,1.65,1.5,0x825b41);
  for(const x of [-1.25,1.25]) {b.ball(x,8,-.3,.6,.65,.45,0x6b4937);b.ball(x,7.97,-.65,.33,.35,.17,0xc59f7e);b.ball(x,1.2,-.3,.9,1.3,1.1,0x694734);}
  b.ball(0,6.5,-1.8,1.1,.8,.6,0xc6a47c);b.ball(0,6.8,-2.33,.5,.3,.22,0x252b2d);
  for(const x of [-.65,.65]) {b.ball(x,7.22,-1.72,.15,.18,.12,0x181f24);b.ball(x-.03,7.28,-1.82,.045,.05,.03,cream);}
  b.ball(0,3.8,-1.45,1.55,2.2,.35,green);b.box(2.8,.2,.15,0,4.4,-1.81,gold);
  for(const side of [-1,1]) {
    const arm=new THREE.Group();arm.name=`oxford-bear-arm-${side}`;arm.position.set(side*1.8,5.3,-.3);
    const a=new LondonBatch();a.ball(side*.7,-.7,-1.1,.85,1.5,1.35,0x79543c);a.ball(side*.9,-1.6,-2.8,.95,.65,1.2,0x644430);
    for(let i=0;i<4;i++) a.ball(side*.9-.5+i*.32,-1.65,-3.9,.12,.18,.25,0xdfc89e);a.finish(arm);g.add(arm);
  }
  londonLabel(g,'THE BEAR · 1242',0,4.3,-1.96,2.6,.4,'#315d58','#e9dcc4');
}
function milkRing(b:LondonBatch,index:number) {
  const inner=index*4.25,outer=(index+1)*4.25,shape=new THREE.Shape();shape.absarc(0,0,outer,0,tau,false);
  if(inner>0) {const hole=new THREE.Path();hole.absarc(0,0,inner,0,tau,true);shape.holes.push(hole);}
  b.add(new THREE.ExtrudeGeometry(shape,{depth:.48,bevelEnabled:false,curveSegments:64}).rotateX(Math.PI/2),index%2 ? 0xe3a1b9:0xf3c4d0);
  for(let i=0;i<16;i++) {const a=i*tau/16,r=(inner+outer)/2;b.ball(Math.cos(a)*r,.11,Math.sin(a)*r,.35,.11,.17,index%2 ? 0xf6dfcf:0xbb7189);}
}
function trail(b:LondonBatch) {
  const vertices:number[]=[],colors:number[]=[],colour=new THREE.Color();
  const quad=(x0:number,x1:number,z0:number,z1:number,c:number)=>{
    colour.setHex(c);
    const edge=(x:number,z:number)=>Math.abs(x)>3.6&&(Math.abs(x-x0)<1e-6||Math.abs(x-x1)<1e-6) ? Math.sign(x)*trailHalfWidth(z):x,cells=Math.ceil((x1-x0)/.6);
    for(let i=0;i<cells;i++) {
      const left=THREE.MathUtils.lerp(x0,x1,i/cells),right=THREE.MathUtils.lerp(x0,x1,(i+1)/cells);
      const a=[edge(left,z0),trailHeight(z0,edge(left,z0)),z0],d=[edge(right,z0),trailHeight(z0,edge(right,z0)),z0],e=[edge(right,z1),trailHeight(z1,edge(right,z1)),z1],f=[edge(left,z1),trailHeight(z1,edge(left,z1)),z1];
      for(const p of [a,d,e,a,e,f]) {vertices.push(...p);colors.push(colour.r,colour.g,colour.b);}
    }
    // Downward edge fascia gives the walkway thickness without hidden duplicate faces.
    for(const x of [x0,x1]) for(const p of [[edge(x,z0),trailHeight(z0,edge(x,z0)),z0],[edge(x,z1),trailHeight(z1,edge(x,z1)),z1],[edge(x,z1),trailHeight(z1,edge(x,z1))-.55,z1],[edge(x,z0),trailHeight(z0,edge(x,z0)),z0],[edge(x,z1),trailHeight(z1,edge(x,z1))-.55,z1],[edge(x,z0),trailHeight(z0,edge(x,z0))-.55,z0]]) {vertices.push(...p);colors.push(colour.r*.65,colour.g*.65,colour.b*.65);}
  };
  for(let z=24;z>-170;z--) {
    const mid=z-.5,width=trailHalfWidth(mid),hole=trailHoleAt(mid);
    if(hole?.sideHoles) quad(-hole.width/2,hole.width/2,z,z-1,0xb79660);
    else if(hole) {quad(-width,hole.x-hole.width/2,z,z-1,0xb79660);quad(hole.x+hole.width/2,width,z,z-1,0xb79660);}
    else quad(-width,width,z,z-1,Math.floor((24-z)/9)%2 ? 0xcfb57f:0xbba273);
  }
  const geo=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(vertices,3)).setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.computeVertexNormals();b.add(geo,-1);
}
export function createOxfordModel(obj:LevelObjectData):LondonModel|null {
  const sub=String(obj.properties?.subType??'');if(!sub.startsWith('oxford_')) return null;
  const kind=sub.slice(7),g=new THREE.Group(),b=new LondonBatch(),p=obj.properties??{};let collision:THREE.Mesh[]|undefined;
  switch(kind) {
    case 'train':train(b,g);break;
    case 'railway': {
      const length=Number(p.length??940);
      for(const lane of [-1,0,1]) {for(const side of [-1,1]) b.box(.12,.13,length+38,lane*5.5+side*.95,.12,-length/2+12,0xaab0b0,'metal');
        for(let i=0;i<length/3;i++) b.box(2.65,.13,.3,lane*5.5,.03,12-i*3,0x665343);}
      for(let i=0;i<20;i++) {const z=-i*49;for(const side of [-1,1]) {b.box(8,1.2,32,side*18,-.8,z,0x86917a);londonPine(b,side*19,-.2,z,1.6);}}
      collision=[];break;
    }
    case 'station': {
      for(const side of [-1,1]) {b.box(9,1.2,68,side*14,-.48,0,stone);for(let i=0;i<8;i++) b.cylinder(.12,7,side*11,3.5,25-i*7,dark);b.box(10,.35,70,side*14,7.1,0,green);}
      londonLabel(g,p.destination ? 'OXFORD':'LONDON · OXFORD',-11,5.5,19,6,1,'#315d58');collision=[];break;
    }
    case 'buzz': {
      const index=Number(p.index??0),c=[0xbd314d,0x2570b4,0xdfb637][index%3];
      b.add(new THREE.SphereGeometry(6,40,28),c);b.cylinder(2.2,.8,0,5.7,0,0xc6c9c4,'metal',32);b.cylinder(2.7,.45,0,6,0,0xc6c9c4,'metal',32);b.cylinder(2.2,.12,0,6.3,0,0x737e80,'metal',32);
      b.ring(4.55,.08,0,3.8,0,cream,true);b.ring(5.7,.07,0,-1.7,0,cream,true);
      buzzLabel(g,index);break;
    }
    case 'college':college(b,g);break;
    case 'radcliffe':
      b.cylinder(7,.7,0,.35,0,stone,'solid',40);b.cylinder(6.4,9,0,5.2,0,cream,'solid',40);
      for(let i=0;i<16;i++) {const a=i*tau/16;b.cylinder(.3,8,Math.cos(a)*6.4,5,Math.sin(a)*6.4,stone);}
      b.cylinder(6.9,.7,0,9.5,0,stone,'solid',40);b.add(new THREE.SphereGeometry(6.6,40,20,0,tau,0,Math.PI/2).scale(1,.65,1),0x788b87,{x:0,y:9.8,z:0});b.cylinder(.7,2,0,14.7,0,stone);break;
    case 'bridge':
      for(const x of [-6,6]) b.box(1.1,9,3,x,4.5,0,stone);b.box(13,1,3,0,9,0,stone);arch(b,0,5.7,0,11,1.4);
      for(let i=0;i<7;i++) {b.box(.18,2.7,.18,-4.5+i*1.5,10.8,1.4,cream);b.box(.18,2.7,.18,-4.5+i*1.5,10.8,-1.4,cream);}b.box(13,.3,3.4,0,12.3,0,cream);break;
    case 'pier':b.box(2,17.68,2,0,8.84,0,stone);break;
    case 'shop':
      b.box(10,8,5,0,4,0,stone);b.box(9,3,.12,0,2.3,2.56,green);b.box(9,1.3,.18,0,5,2.6,green);
      for(let i=0;i<6;i++) b.box(.13,3,.2,-4+i*1.6,2.3,2.65,cream);
      for(let i=0;i<5;i++) b.ball(-3.4+i*1.7,2.5,2.8,.4,.65,.3,[0xb94d46,gold,green][i%3]);
      londonLabel(g,'OXFORD SOUVENIRS',0,5,2.71,8.7,1.1,'#315d58');break;
    case 'magnet': {
      const i=Number(p.index??0);b.box(4.1,.65,2.8,0,0,0,[green,0x8c393f,0x315783][i%3]);
      b.box(3.7,.1,2.4,0,-.37,0,gold);b.add(new THREE.TorusGeometry(.7,.17,8,24,Math.PI),0xa7a8a2,{x:0,y:.4,z:0},{x:Math.PI/2,y:0,z:0});
      londonLabel(g,['OXFORD','UNIVERSITY','THE BEAR','ENGLAND'][i%4],0,.05,1.42,3.8,.5,'#315d58');break;
    }
    case 'pub':
      for(const side of [-1,1]) {b.box(3,17,115,side*15,8.5,0,wood);for(let i=0;i<12;i++) {b.box(.18,14,.25,side*13.45,7,-51+i*9,cream);b.box(.15,.3,7,side*13.3,5,-51+i*9,cream);}}
      b.box(32,.5,115,0,18,0,0x392e29);londonLabel(g,'THE BEAR INN · 1242',0,16,-54,22,1.8,'#315d58');
      for(let i=0;i<36;i++) {const x=-12+i%9*3,z=-48+Math.floor(i/9)*26;b.box(1,.18,2,x,17,z,0x342b27);b.ball(x,16.5,z,.25,.6,.25,0xffd89e,'glow');}collision=[];break;
    case 'table':b.box(7,.7,16,0,-.35,0,wood);b.box(7.2,.14,16.2,0,.07,0,0x9c764c);for(const x of [-2.4,2.4]) for(const z of [-5.8,5.8]) b.box(.4,8,.4,x,-4.5,z,dark);b.ring(1.5,.06,0,.16,0,gold,true);break;
    case 'basket':
      b.box(4,.6,4,0,.3,0,0xa7885a);
      for(let i=0;i<9;i++) for(const side of [-1,1]) {
        b.box(.12,2.3,.11,-1.9+i*.475,1.5,side*1.95,0xc7a777);if(Math.abs(-1.9+i*.475)>1) b.box(.11,2.3,.12,side*1.95,1.5,-1.9+i*.475,0xc7a777);
      }
      for(let i=0;i<7;i++) for(const side of [-1,1]) {b.box(4,.1,.15,0,.65+i*.3,side*1.95,0x96754f);for(const end of [-1,1]) b.box(.15,.1,1,side*1.95,.65+i*.3,end*1.5,0x96754f);}break;
    case 'bear':bear(b,g);collision=[];break;
    case 'ties':
      b.box(7,5,.4,0,2.5,0,wood);for(let i=0;i<12;i++) {const x=-3+i%6*1.2,y=1+Math.floor(i/6)*2.3;const shape=new THREE.Shape();shape.moveTo(-.2,0);shape.lineTo(.2,0);shape.lineTo(.3,-1.4);shape.lineTo(0,-1.7);shape.lineTo(-.3,-1.4);shape.closePath();b.add(new THREE.ExtrudeGeometry(shape,{depth:.06,bevelEnabled:false}),[green,gold,0x913b45][i%3],{x,y:y+1.5,z:.24});}break;
    case 'milk_ring':milkRing(b,Number(p.index??0));break;
    case 'cup':
      b.add(new THREE.CylinderGeometry(17.4,12.5,24,72,1,true),0xf4e3d3,{x:0,y:-12.55,z:0});b.ring(17.35,.22,0,-.3,0,cream,true);londonLabel(g,'MOO-MOOS',0,-7,15.7,18,3,'#df9db5','#493c4b');collision=[];break;
    case 'straw': {
      const tube=new THREE.Group();tube.name='oxford-straw-tube';const tb=new LondonBatch();
      tb.add(new THREE.CylinderGeometry(1.25,1.25,7,32,1,true),0xf5e5cb,{x:0,y:3.5,z:0});
      for(let i=0;i<7;i++) tb.add(new THREE.CylinderGeometry(1.27,1.27,.35,32,1,true),0xc95874,{x:0,y:.5+i,z:0});tb.ring(1.25,.13,0,7,0,gold,true);tb.finish(tube);g.add(tube);collision=[];break;
    }
    case 'trail':trail(b);break;
    case 'hall':
      for(const side of [-1,1]) {
        b.box(1.1,37,210,side*20,4.5,0,stone);
        for(let i=0;i<16;i++) {
          const z=-99+i*13;b.box(.25,11,4.5,side*19.4,13,z,0x425c76);b.box(.35,12,.13,side*19.2,13,z,cream);b.box(.35,.18,4.7,side*19.2,12,z,cream);
          for(const dz of [-2.3,2.3]) b.box(.4,12,.3,side*19.2,13,z+dz,cream);
          b.box(1.4,32,1.5,side*18.5,4,z,cream);
          b.box(7,.6,8,side*13,7,z,wood);for(const dx of [-2.5,2.5]) b.box(.3,7,.3,side*13+dx,3.2,z,wood);
        }
      }
      for(let i=0;i<13;i++) {const z=-102+i*17;for(const side of [-1,1]) b.add(new THREE.BoxGeometry(22,.8,.9),wood,{x:side*10,y:31,z},{x:0,y:0,z:side*.34});}
      for(let i=0;i<100;i++) {
        const x=Math.sin(i*2.399)*15,z=-100+(i*37%195),y=21+(i%5)*1.2;
        b.cylinder(.12,.9,x,y,z,cream,'solid',7);b.ball(x,y+.65,z,.12,.25,.12,0xffcd78,'glow');
      }
      collision=[];break;
    case 'bicycle': {
      for(const z of [-6,6]) {b.add(new THREE.TorusGeometry(5.2,.24,7,40),dark,{x:0,y:5.3,z},{x:0,y:Math.PI/2,z:0});for(let i=0;i<10;i++) {const a=i*Math.PI/10;b.add(new THREE.CylinderGeometry(.025,.025,10.1,5),0xaaa99d,{x:0,y:5.3,z},{x:a,y:0,z:0});}}
      for(const [a,c] of [[new THREE.Vector3(0,5.3,-6),new THREE.Vector3(0,8,0)],[new THREE.Vector3(0,8,0),new THREE.Vector3(0,5.3,6)],[new THREE.Vector3(0,8,0),new THREE.Vector3(0,11,-2)]]) {
        const d=c.clone().sub(a),geo=new THREE.CylinderGeometry(.22,.22,d.length(),8);geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));b.add(geo,green,a.clone().add(c).multiplyScalar(.5));
      }b.box(1.8,.3,2,0,11,-2,wood);collision=[];break;
    }
    case 'campus': {
      b.box(250,4,600,0,-2,-110,0xd4ddd5);
      for(let i=0;i<10;i++) {const x=i%2 ? -50:50,z=35-Math.floor(i/2)*75;const subg=new THREE.Group(),subb=new LondonBatch();college(subb,subg);subb.finish(subg);subg.position.set(x,0,z);subg.rotation.y=x<0 ? Math.PI/2:-Math.PI/2;g.add(subg);londonPine(b,x*.65,0,z-22,2);}
      const dome=new THREE.Group(),model=createOxfordModel({...obj,position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1},properties:{subType:'oxford_radcliffe'}});if(model) {dome.add(model.group);dome.position.set(-50,0,-160);g.add(dome);}collision=[];break;
    }
    default:return null;
  }
  const meshes=b.finish(g);g.position.copy(obj.position);g.rotation.set(obj.rotation.x,obj.rotation.y,obj.rotation.z,'YXZ');g.scale.copy(obj.scale);
  g.userData.oxfordAsset=true;previewOxfordActor(obj,g,0);
  return {group:g,meshes:collision??meshes};
}
export function previewOxfordActor(obj:LevelObjectData,g:THREE.Object3D,time:number):boolean {
  const p=obj.properties??{},index=Number(p.index??0);
  switch(p.oxfordAction) {
    case 'destination':g.position.z=obj.position.z+oxfordTrainZ(time)+70;{const d=g.getObjectByName('oxford-train-door');if(d) d.visible=time<29;}return true;
    case 'traffic':g.position.z=obj.position.z+time*Number(p.trafficSpeed??18);return true;
    case 'buzz':{const pose=buzzPosition(time,index);g.position.set(obj.position.x+pose.x,obj.position.y+pose.y-7,obj.position.z+pose.z);g.rotation.set(obj.rotation.x,obj.rotation.y,obj.rotation.z);return true;}
    case 'magnet':g.position.y=obj.position.y-6+oxfordMagnetY(time,index);return true;
    case 'ring':g.rotation.y=obj.rotation.y+time*milkRingSpeed(index);return true;
    case 'table':g.rotation.x=obj.rotation.x;g.rotation.z=obj.rotation.z;return true;
    case 'bear':for(const side of [-1,1]) {const arm=g.getObjectByName(`oxford-bear-arm-${side}`);if(arm) arm.rotation.x=-.2-Math.max(0,Math.sin(time*OXFORD_BEAR_RATE+index*1.2+side))*.85;}return true;
    case 'straw':{const pose=strawPose(time);g.position.x=obj.position.x+pose.x;const tube=g.getObjectByName('oxford-straw-tube');if(tube) tube.rotation.z=pose.tilt;return true;}
    default:return false;
  }
}
