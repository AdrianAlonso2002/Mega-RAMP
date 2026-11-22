import * as THREE from 'three';
import { LondonBatch } from '../world-06/LondonModels';
import type { LevelObjectData } from '../LevelTypes';
import { createKyotoModel } from './KyotoModels';
import { bowlHeight, naraFloatHeight, naraSweep, naraTrainPose, naraDoorOpen, NARA_DOOR_TIME } from './NaraRoutes';

const wood = 0x76503a, dark = 0x3e423b, stone = 0xa5aa96, cream = 0xe3d6b6, moss = 0x6b8052, bronze = 0x74654b;
type Model = { group: THREE.Group; meshes: THREE.Mesh[] };
function roof(b: LondonBatch, y: number, width: number, depth: number, x=0, z=0) {
  for (const side of [-1, 1]) {
    b.add(new THREE.BoxGeometry(width, .22, depth*.58), dark, { x, y: y+.65, z: z+side*depth*.23 }, { x: side*.28, y: 0, z: 0 });
    b.box(width+.5, .17, .25, x, y+.12, z+side*depth*.5, wood);
  }
  b.box(width+.2, .22, .28, x, y+1.05, z, dark);
}
function lantern(b: LondonBatch) {
  b.box(.8, .2, .8, 0, .1, 0, stone);
  b.cylinder(.16, .8, 0, .6, 0, stone, 'solid', 6);
  b.box(.65, .16, .65, 0, 1.05, 0, stone);
  b.box(.4, .42, .4, 0, 1.33, 0, 0xe0bd79, 'glow');
  for (const x of [-.26, .26]) for (const z of [-.26, .26]) b.box(.1, .55, .1, x, 1.35, z, stone);
  b.add(new THREE.ConeGeometry(.63, .42, 4).rotateY(Math.PI/4), stone, { x: 0, y: 1.8, z: 0 });
  b.add(new THREE.ConeGeometry(.12,.3,4),dark,{x:0,y:2.08,z:0});
}
function deer(b: LondonBatch, group: THREE.Group) {
  b.ball(0, 1.4, 0, .48, .58, .95, 0xaa7950);
  b.ball(0, 1.2, .55, .32, .39, .42, cream);
  for (const x of [-.3,.3]) for (const z of [-.61,.56]) {
    b.cylinder(.095, 1.07, x, .57, z, 0x9e704c, 'solid', 8);
    b.box(.18, .14, .24, x, .1, z+.015, dark);
  }
  for (let i=0; i<14; i++) {
    const a=i*2.399, z=-.65+(i%7)*.19;
    b.ball(Math.sin(a)*.4, 1.65+(i%3)*.08, z, .07,.055,.07,0xe8d8ac);
  }
  b.ball(0,1.6,-.97,.15,.13,.26,cream);
  const head = new THREE.Group(), h = new LondonBatch(); head.name='nara-deer-head'; head.position.set(0,1.78,.65);
  h.ball(0,.23,.17,.24,.5,.28,0xad8058);
  h.ball(0,.6,.36,.28,.3,.38,0xb78b61);
  h.ball(0,.48,.66,.21,.16,.2,cream); h.ball(0,.5,.81,.09,.07,.06,dark);
  for (const side of [-1,1]) {
    h.ball(side*.3,.85,.2,.26,.11,.15,0xaa7950);
    h.ball(side*.25,.67,.52,.045,.055,.035,0x20271f);
    h.cylinder(.045,.56,side*.16,1.11,.23,0x85694b,'solid',6);
    h.add(new THREE.CylinderGeometry(.035,.035,.28,6),0x85694b,{x:side*.24,y:1.23,z:.23},{x:0,y:0,z:side*.65});
  }
  h.finish(head); group.add(head);
}
function train(b: LondonBatch, group: THREE.Group) {
  // A solid open interior: the side doorway is a real opening, not a painted window.
  b.box(6,.45,24,0,-.225,0,0xe1ded2);
  for(const z of [-8.6,-7.2,7.2,8.6]) {
    b.box(4.35,.25,.45,0,-.48,z,dark);
    for(const side of [-1,1])b.add(new THREE.CylinderGeometry(.38,.38,.24,16).rotateZ(Math.PI/2),0x444a4c,{x:side*1.98,y:-.5,z},undefined,'metal');
  }
  b.box(6.1,.25,24,0,4.25,0,0xf2efdf);
  for (const side of [-1,1]) {
    b.box(.2,3.9,10.5,side*3,2,-6.75,0xe8e7db);b.box(.2,3.9,7.5,side*3,2,8.25,0xe8e7db);
    for (const z of [-10,-7,-4,6,9]) {
      b.box(.24,1.15,1.75,side*3.01,2.5,z,0x637e84);
      b.box(.25,.14,1.75,side*3.02,3.1,z,0xc8d8d3);
      b.box(1.1,.55,1.2,side*2.15,.65,z,0x506b68);
      b.box(.22,1.2,1.2,side*2.67,1.32,z,0x526c69);
    }
    b.box(.24,.2,10.5,side*3.05,.65,-6.75,0x377c8b);b.box(.24,.2,7.5,side*3.05,.65,8.25,0x377c8b);
  }
  b.box(5.8,3.7,.3,0,1.9,12,cream);
  b.box(5.8,3.7,.2,0,1.9,-11.9,0xd3dbd2);b.box(1.4,2.8,.06,0,1.4,-11.76,0xbfcfcb);b.box(.85,.9,.08,0,2.1,-11.71,0x637e84);
  b.ball(0,1.5,-16.1,3,1.8,4.1,0xe9eee6);
  b.ball(0,2.6,-16.5,2.3,.65,1.8,0x46626b);
  for (const x of [-1.9,1.9]) b.ball(x,.9,-18.4,.4,.17,.3,0xe9db9a,'glow');
  for(const side of [-1,1]) {
    const door=new THREE.Group();door.name=side===1?'nara-train-door':'nara-train-door-opposite';door.position.set(side*3,0,1.5);
    for(const direction of [-1,1]) {
      const leaf=new THREE.Group(),d=new LondonBatch();leaf.name=`nara-door-leaf-${side}-${direction}`;
      leaf.userData.trainDoorDirection=direction;leaf.userData.trainDoorSide=side;
      d.box(.19,3.7,3,0,1.85,0,0xd6dfda);d.box(.21,1.25,1.8,0,2.4,0,0x6b8588);
      d.box(.23,.13,2.9,0,.65,0,0x377c8b);d.box(.24,.65,.055,0,1.25,-direction*1.25,0xa1b4ac);
      d.finish(leaf);door.add(leaf);
    }
    group.add(door);
  }
  poseNaraTrainDoors(group,1);
}

export function poseNaraTrainDoors(group:THREE.Object3D,openness:number):void {
  for(const name of ['nara-train-door','nara-train-door-opposite']) {
    const door=group.getObjectByName(name);if(!door)continue;
    for(const leaf of door.children){const direction=Number(leaf.userData.trainDoorDirection);leaf.position.z=direction*(1.5+(leaf.userData.trainDoorSide===1?openness*2.9:0));}
  }
}
function bowl(b: LondonBatch, radius: number, depth: number) {
  const segments=96, rings=20, vertices:number[]=[];
  const point=(r:number,a:number)=>new THREE.Vector3(Math.cos(a)*r,bowlHeight(radius,depth,Math.cos(a)*r,Math.sin(a)*r),Math.sin(a)*r);
  const tri=(a:THREE.Vector3,c:THREE.Vector3,d:THREE.Vector3)=>vertices.push(...a.toArray(),...c.toArray(),...d.toArray());
  for(let j=0;j<rings;j++) for(let i=0;i<segments;i++) {
    const a=i/segments*Math.PI*2,c=(i+1)/segments*Math.PI*2,r0=j/rings*radius,r1=(j+1)/rings*radius;
    const aa=point(r0,a),bb=point(r1,a),cc=point(r1,c),dd=point(r0,c);
    if(j>0)tri(aa,dd,cc); tri(aa,cc,bb);
  }
  const colors:number[]=[],color=new THREE.Color(0xb7b49c);
  for(let i=0;i<vertices.length;i+=3){const t=Math.hypot(vertices[i],vertices[i+2])/radius,angle=Math.atan2(vertices[i+2],vertices[i]),shade=.84+.08*Math.cos(t*Math.PI*12)+.07*Math.cos(angle*12);colors.push(color.r*shade,color.g*shade,color.b*shade);}
  const g=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(vertices,3)).setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.computeVertexNormals();b.add(g,-1);
  b.add(new THREE.CylinderGeometry(radius,radius*.98,.35,96,1,true),dark,{x:0,y:-.18,z:0});
  b.ring(radius,.12,0,.02,0,0xb6a476,true);
}

export function createNaraModel(obj: LevelObjectData, quality: string='medium'): Model | null {
  const type=String(obj.properties?.subType??''); if(!type.startsWith('nara_'))return null;
  const kind=type.slice(5),p=obj.properties??{};
  if(kind==='path') return createKyotoModel({...obj,properties:{...p,subType:'kyoto_path'}},quality);
  const group=new THREE.Group(),b=new LondonBatch();
  switch(kind) {
    case 'deer': deer(b,group); break;
    case 'cracker': {
      const r=Number(p.radius??6);b.add(new THREE.CylinderGeometry(r,r,.65,64),0xc89855,{x:0,y:-.325,z:0});
      b.ring(r-.15,.08,0,-.02,0,0x977145,true);
      for(let i=0;i<75;i++){const a=i*2.399,r1=Math.sqrt((i+.5)/75)*(r-.5);b.ball(Math.cos(a)*r1,.018,Math.sin(a)*r1,.09,.025,.07,i%2?0xa57a43:0xdbb371);}
      break;
    }
    case 'bowl': bowl(b,Number(p.radius??7),Number(p.depth??2)); break;
    case 'lantern_field': {
      const prototype=new THREE.Group(),lamp=new LondonBatch();lantern(lamp);const originals=lamp.finish(prototype),matrix=new THREE.Matrix4();
      // Eight spatial tiles can be culled individually. Geometry/materials are shared,
      // and the distant ornaments never enter the expensive shadow pass.
      const tiles:THREE.InstancedMesh[][]=[];
      for(let tile=0;tile<8;tile++) {
        const rowTile=tile%2,columnTile=Math.floor(tile/2),batches=originals.map(mesh=>{
          const batch=new THREE.InstancedMesh(mesh.geometry,mesh.material,150);batch.position.set((rowTile-.5)*17,0,(columnTile-1.5)*31.5);
          batch.userData.graphicsNoShadow=true;batch.castShadow=false;batch.receiveShadow=false;group.add(batch);return batch;
        });
        for(let i=0;i<150;i++){const at=i*89%150;matrix.makeTranslation((Math.floor(at/15)-4.5)*1.7,0,(at%15-7)*2.1);for(const mesh of batches)mesh.setMatrixAt(i,matrix);}
        for(const mesh of batches){mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();}tiles.push(batches);
      }
      const setQuality=(q:string)=>{const total=q==='low'?180:q==='high'?1200:600;tiles.forEach((tile,i)=>{for(const mesh of tile)mesh.count=Math.floor(total*(i+1)/8)-Math.floor(total*i/8);});};
      group.userData.naraSetQuality=setQuality;setQuality(quality);
      b.box(35,.5,128,0,-.3,0,moss); break;
    }
    case 'mochi': {
      b.box(6,.25,6,0,-.15,0,wood);b.cylinder(.95,1.2,0,.6,0,0x8a7353);b.cylinder(.7,.12,0,1.22,0,0xb7d07a);
      for(const side of [-1,1]) {
        const x=side*1.8;b.ball(x,1.2,0,.5,.85,.4,side===1?0x436b7b:0xc7bfa6);b.ball(x,2.3,0,.35,.4,.34,0xccaa82);b.box(.8,.16,.7,x,2.6,0,cream);
        for(const dx of [-.23,.23])b.box(.25,.7,.3,x+dx,.35,0,dark);
      }
      const hammer=new THREE.Group(),h=new LondonBatch();hammer.name='nara-mochi-hammer';hammer.position.set(1.3,2.1,0);
      h.cylinder(.065,1.7,0,.1,0,wood);h.add(new THREE.CylinderGeometry(.24,.24,.8,12).rotateZ(Math.PI/2),0xad8b5b,{x:0,y:-.72,z:0});h.finish(hammer);group.add(hammer);break;
    }
    case 'pagoda': {
      const floors=Number(p.floors??5);
      b.box(11,.7,10,0,-.4,0,stone);
      for(let i=0;i<floors;i++){const w=9-i*.7,y=i*4;for(const x of [-1,1])for(const z of [-1,1])b.box(.3,3.6,.3,x*w*.35,y+1.8,z*w*.31,wood);b.box(w*.75,2.6,w*.62,0,y+1.5,0,0xc4aa7c);roof(b,y+3.25,w+2,w+1.6);}
      b.cylinder(.1,3,0,floors*4+1,0,0xbba15e);for(let i=0;i<5;i++)b.ring(.4-i*.05,.05,0,floors*4+i*.42,0,0xbba15e,true);break;
    }
    case 'buddha': {
      b.cylinder(3.7,.8,0,.4,0,stone, 'solid',48);b.cylinder(3.4,.6,0,1.1,0,bronze,'metal',48);
      b.ball(-1.55,1.8,.35,2,.65,1.2,bronze,'metal');b.ball(1.55,1.8,.35,2,.65,1.2,bronze,'metal');
      b.add(new THREE.SphereGeometry(1,32,24).scale(1.85,2.3,1.2),bronze,{x:0,y:3.75,z:0},undefined,'metal');
      b.add(new THREE.SphereGeometry(1,32,24).scale(1,1.3,.95),bronze,{x:0,y:6.55,z:.03},undefined,'metal');
      for(const side of [-1,1]){b.ball(side*1.05,6.3,0,.22,.65,.23,bronze,'metal');b.ball(side*.35,6.6,.84,.25,.07,.07,0x403d30);b.ball(side*1.7,3.7,.3,.42,1.3,.45,bronze,'metal');}
      b.ball(0,6.3,.95,.17,.3,.16,bronze,'metal');b.ball(0,5.97,.87,.29,.05,.06,0x484335);b.ball(0,6.93,.9,.07,.07,.03,0xc2a467,'metal');
      b.ball(1.9,4.7,.7,.35,.7,.22,bronze,'metal');for(let i=0;i<4;i++)b.ball(1.7+i*.12,5.27,.72,.055,.26,.06,bronze,'metal');
      b.ball(-1,2.7,1,.65,.2,.45,bronze,'metal');
      for(let j=0;j<5;j++)for(let i=0;i<14;i++){const a=i/14*Math.PI*2,r=.91*Math.cos(j*.2);b.ball(Math.cos(a)*r,7+j*.19,Math.sin(a)*r,.13,.14,.13,0x4b5142,'metal');}
      b.ball(0,7.95,0,.35,.3,.35,0x4b5142,'metal');
      for(let i=0;i<8;i++)b.ring(2.2-i*.06,.025,0,2.4+i*.17,.06,0xa28b60,true,'metal');break;
    }
    case 'pond': {
      const w=Number(p.width??95),d=Number(p.depth??70);
      b.box(w,.5,d,0,-.7,0,0x335e58);
      for(const side of [-1,1]){b.box(.45,.4,d+.5,side*(w/2+.15),0,0,stone);b.box(w,.4,.45,0,0,side*(d/2+.15),stone);}
      const surface=new THREE.Mesh(new THREE.PlaneGeometry(w,d).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({color:0x76aaa0,transparent:true,opacity:.46,depthWrite:false,roughness:.24}));surface.position.y=.06;surface.name='nara-pond-surface';group.add(surface);
      for(let i=0;i<16;i++) {const koi=new THREE.Group(),fish=new LondonBatch();koi.name=`nara-koi-${i}`;
        fish.ball(0,0,0,.22,.12,.65,i%3===0?0xe8ddbf:0xd28048);fish.ball(.04,.05,.1,.17,.09,.19,i%3===0?0xce7542:0xebe2c9);fish.add(new THREE.ConeGeometry(.23,.4,3).rotateX(Math.PI/2),0xd7b381,{x:0,y:0,z:.72});fish.finish(koi);koi.userData.koiIndex=i;group.add(koi);}
      for(let i=0;i<12;i++)b.ball(Math.cos(i)*w*.35,-.1,Math.sin(i*1.8)*d*.36,1.1,.07,.9,0x668559);break;
    }
    case 'train': train(b,group);break;
    case 'tracks': {
      const length=THREE.MathUtils.clamp(Number(p.length??284),24,800);
      const cross=new THREE.Shape();cross.moveTo(-3,-.3);cross.lineTo(3,-.3);cross.lineTo(3.7,-.7);cross.lineTo(-3.7,-.7);cross.closePath();
      b.add(new THREE.ExtrudeGeometry(cross,{depth:length,bevelEnabled:false,steps:1}).translate(0,0,-length/2),0x777b72);
      const ties=Math.floor(length/1.25);
      for(let i=0;i<ties;i++)b.box(5.1,.16,.3,0,-.24,-length/2+.6+i*1.25,i%3===0?0x79634d:0x685b49);
      for(const side of [-1,1]) {
        const x=side*1.98;
        b.box(.3,.06,length,x,-.16,0,0x727b7f,'metal');
        b.box(.075,.2,length,x,-.05,0,0x5a6368,'metal');
        b.box(.17,.1,length,x,.07,0,0xa9b3b5,'metal');
      }
      break;
    }
    case 'station': {
      b.box(12,.6,40,9.2,-.3,0,stone);b.box(.65,.04,40,3.7,.025,0,0xd4b766);
      for(const z of [-16,-8,0,8,16]){b.box(.24,5,.24,13,2.5,z,dark);b.box(6,.2,.4,10.5,5,z,wood);}
      // Two end canopies keep the boarding area, collectibles and goal visible from above.
      for(const z of [-15,15])roof(b,5,7,9,10.5,z);
      b.box(5,1.1,.2,9,3.4,-14,0x33564f);break;
    }
    case 'bell': {
      for(const x of [-2,2])b.box(.4,4.7,.4,x,2.35,0,wood);b.box(5,.5,.6,0,4.4,0,wood);roof(b,4.8,6,4);
      b.add(new THREE.CylinderGeometry(.8,1.1,1.9,24),bronze,{x:0,y:3.1,z:0},undefined,'metal');b.ring(1.1,.08,0,2.14,0,bronze,true,'metal');break;
    }
    case 'seesaw': {
      const length=Number(p.length??28),width=Number(p.width??4.4);b.box(length,.45,width,0,-.225,0,0xb08b59);
      for(let i=0;i<Math.floor(length/.8);i++)b.box(.035,.008,width-.1,-length/2+.4+i*.8,.006,0,0x7d6547);break;
    }
    case 'rotor': {
      const neon=p.neonRotor===true,accent=Number(p.neonAccent??0x73e5f2),length=Number(p.length??8);
      b.cylinder(.25,2.6,0,1.3,0,neon?0x273f58:wood);const arm=new THREE.Group(),a=new LondonBatch();arm.name='nara-sweep-arm';arm.position.y=.8;
      a.box(length,.35,.45,0,0,0,neon?0x354d69:0xa16d47);for(const x of [-1,1])a.box(.3,.42,.52,x*(length/2-.2),0,0,neon?accent:0xb99a65,neon?'glow':'solid');
      if(neon){a.box(length-.3,.05,.46,0,.16,0,accent,'glow');b.ring(.34,.055,0,2.55,0,accent,true,'glow');b.ring(.34,.055,0,.2,0,accent,true,'glow');}
      a.finish(arm);group.add(arm);break;
    }
    case 'jump_pad': {
      b.box(Number(p.width??6),.12,1.4,0,-.08,0,0x9e7347);for(let i=0;i<3;i++)b.box(Number(p.width??6)-.7,.035,.14,0,.003,-.45+i*.4,0xdfb658);break;
    }
    default: return null;
  }
  const meshes=b.finish(group);
  if(kind==='rotor'&&p.neonRotor===true)group.traverse(node=>{if(node instanceof THREE.Mesh&&node.name==='london-glow'){const old=node.material;node.material=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false});if(!Array.isArray(old))old.dispose();node.castShadow=false;node.userData.graphicsNoShadow=true;}});
  for(const mesh of meshes){mesh.castShadow=kind!=='pond';mesh.receiveShadow=true;}
  group.name=`nara-${kind}`;group.position.set(obj.position.x,obj.position.y,obj.position.z);group.rotation.set(obj.rotation.x,obj.rotation.y,obj.rotation.z);group.scale.set(obj.scale.x,obj.scale.y,obj.scale.z);
  previewNaraModel(obj,group,0);group.updateMatrixWorld(true);return {group,meshes};
}

/** The editor and game use the same animation poses. Dynamic solids get native colliders. */
export function previewNaraModel(obj: LevelObjectData, group: THREE.Object3D, time: number): boolean {
  const kind=String(obj.properties?.subType??'');if(!kind.startsWith('nara_'))return false;
  const phase=Number(obj.properties?.phase??0);
  if(kind==='nara_train') {group.position.z=obj.position.z+naraTrainPose(time-NARA_DOOR_TIME).z;poseNaraTrainDoors(group,naraDoorOpen(time));}
  if(kind==='nara_bowl'&&obj.properties?.naraAction==='bowl')group.rotation.y=obj.rotation.y+time*Number(obj.properties.spinSpeed??.28);
  if(kind==='nara_seesaw'&&obj.properties?.naraAction==='float'){const index=Number(obj.properties.index??Math.round(phase/.8));group.position.y=obj.position.y+naraFloatHeight(time,index);group.rotation.z=obj.rotation.z+Math.sin(time*.9+phase)*.045;}
  const head=group.getObjectByName('nara-deer-head');if(head)head.rotation.x=.12+.62*((1-Math.cos((time+phase)*1.3))*.5)**3;
  const hammer=group.getObjectByName('nara-mochi-hammer');if(hammer){const cycle=((time+phase)%2.4)/2.4;hammer.rotation.z=cycle<.18?-.25-cycle/.18*1.15:-1.4+(cycle-.18)/.82*1.15;}
  const sweep=group.getObjectByName('nara-sweep-arm');if(sweep)sweep.rotation.y=naraSweep(time,Number(obj.properties?.index??0));
  if(kind==='nara_pond')for(const koi of group.children)if(typeof koi.userData.koiIndex==='number'){
    const i=koi.userData.koiIndex,a=time*(.09+(i%4)*.014)+i*2.399,w=Number(obj.properties?.width??95),d=Number(obj.properties?.depth??70);
    koi.position.set(Math.cos(a)*w*(.13+(i%4)*.07),-.1+Math.sin(time+i)*.025,Math.sin(a)*d*(.13+(i%3)*.08));koi.rotation.y=-a-Math.PI/2;
  }
  return true;
}
