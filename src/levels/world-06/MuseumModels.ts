import * as THREE from "three";
import type {LevelObjectData} from "../LevelTypes";
import {LondonBatch,londonLabel,londonPine,type LondonModel} from "./LondonModels";
import {createMuseumAnimal,animateMuseumAnimal} from "./MuseumAnimals";
import {museumPaintingTexture,MUSEUM_PAINTING_TITLES} from "./MuseumPaintings";
import {pyramidMotion,pyramidBlockMotion,pyramidSurfaceMotion,PYRAMID_BLOCKS,PYRAMID_BLOCK_HEIGHT,basinHeight,gemGapAngle,gemSpeed} from "./MuseumRoutes";
import {covadongaCowPatrol} from "../world-05/CovadongaModels";
const tau=Math.PI*2,stone=0xc9bda7,white=0xe5e1d6,gold=0xc3a268,green=0x365746,red=0xae3843;

function surface(b:LondonBatch,vertices:number[],colors:number[]) {
  const geometry=new THREE.BufferGeometry().setAttribute("position",new THREE.Float32BufferAttribute(vertices,3)).setAttribute("color",new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();b.add(geometry,-1);
}
function column(b:LondonBatch,x:number,y:number,z:number,s=1) {
  b.box(2*s,.35*s,2*s,x,y+.175*s,z,stone);b.cylinder(.8*s,.3*s,x,y+.5*s,z,white);b.cylinder(.55*s,6*s,x,y+3.6*s,z,stone);
  for(let i=0;i<12;i++) {const a=i*tau/12;b.cylinder(.045*s,5.7*s,x+Math.cos(a)*.56*s,y+3.6*s,z+Math.sin(a)*.56*s,white,"solid",5);}
  b.box(1.65*s,.5*s,1.65*s,x,y+6.8*s,z,white);
}
function artifact(kind:string,b:LondonBatch):boolean {
  switch(kind) {
    case "column":column(b,0,0,0);break;
    case "amphora": {
      const p=[[0,0],[.45,0],[.95,.7],[1,1.45],[.65,2.1],[.3,2.5],[.3,2.8],[.5,2.85]];
      b.add(new THREE.LatheGeometry(p.map(([r,y])=>new THREE.Vector2(r,y)),28),0xab7856);
      for(const side of [-1,1]) b.add(new THREE.TorusGeometry(.46,.11,7,20,Math.PI*1.7),0xb18a62,{x:side*.62,y:2.1,z:0},{x:0,y:0,z:side*Math.PI/2});
      for(const y of [.7,1.4,2]) b.ring(y===2 ? .7:.95,.045,0,y,0,0x5b4b3e,true);break;
    }
    case "sarcophagus":
      b.box(1.9,.5,4.4,0,.25,0,0x8b7959);b.ball(0,.8,-1.1,.73,.45,.75,gold);b.ball(0,.7,.55,.78,.3,1.55,gold);
      for(let i=0;i<9;i++) b.box(1.45,.05,.13,0,1.03,-.1+i*.31,i%2 ? 0x33576a:0xd0aa5f);
      for(const x of [-.23,.23]) b.ball(x,1.16,-1.27,.11,.03,.15,0x33434e);break;
    case "obelisk":
      b.box(2.5,.5,2.5,0,.25,0,stone);b.add(new THREE.CylinderGeometry(.65,1,8,4).rotateY(Math.PI/4),0xb79e77,{x:0,y:4.5,z:0});b.add(new THREE.ConeGeometry(.92,1.5,4).rotateY(Math.PI/4),gold,{x:0,y:9.25,z:0});
      for(let i=0;i<8;i++) {b.box(.35,.05,.025,0,1.5+i*.8,.9-i*.025,0x776449);b.box(.05,.25,.025,0,1.5+i*.8,.92-i*.025,0x776449);}break;
    case "statue":
      b.box(2.5,.7,2.5,0,.35,0,white);b.ball(0,3,0,.7,1.5,.55,stone);b.ball(0,4.7,0,.5,.65,.48,white);b.ball(0,5.05,.05,.56,.38,.5,stone);
      for(const side of [-1,1]) {b.cylinder(.22,1.9,side*.34,1.55,0,white);b.ball(side*.78,3.4,0,.25,.9,.25,white);}
      for(let i=0;i<8;i++) b.box(.055,2,.07,-.55+i*.15,2.6,.52,0xb6ae9d);b.cylinder(.045,5,1.1,2.8,.1,gold);break;
    case "fossil":
      b.box(3,.4,4,0,.2,0,0x8b887b);for(let i=0;i<12;i++) {const z=-1.5+i*.27;b.ball(0,.52,z,.12,.12,.17,0xdfd0ab);for(const side of [-1,1]) b.add(new THREE.TorusGeometry(.6-i*.025,.045,5,12,Math.PI),0xd5c7a2,{x:side*.35,y:.5,z},{x:Math.PI/2,y:0,z:side*Math.PI/2});}break;
    case "display_case":
      b.box(3,.6,3,0,.3,0,0x6c6359);for(const x of [-1.35,1.35]) for(const z of [-1.35,1.35]) b.box(.08,2.5,.08,x,1.85,z,gold);b.box(3,.12,3,0,3.15,0,white);b.add(new THREE.OctahedronGeometry(.7),0x719d96,{x:0,y:1.6,z:0});break;
    case "bookshelf":
      b.box(4,4,.4,0,2,-.55,0x594838);for(const y of [.2,1.2,2.2,3.2,4]) b.box(4.2,.15,1.4,0,y,0,0x816844);
      for(let row=0;row<3;row++) for(let book=0;book<13;book++) b.box(.2,.65+(book%3)*.07,.8,-1.8+book*.3,.6+row,0,[0x42625f,0xa15c4e,0x9b8751,0x485a76][book%4]);break;
    case "parthenon":
      for(let i=0;i<3;i++) b.box(15-i*.7,.4,20-i*.7,0,.2+i*.4,0,stone);
      for(const x of [-6,6]) for(let i=0;i<7;i++) column(b,x,1.2,-8+i*2.65,.72);
      for(const z of [-8,8]) for(const x of [-3.6,-1.2,1.2,3.6]) column(b,x,1.2,z,.72);
      b.box(14,.7,19,0,6.45,0,white);
      {const roof=new THREE.Shape();roof.moveTo(-7,0);roof.lineTo(0,3);roof.lineTo(7,0);roof.closePath();b.add(new THREE.ExtrudeGeometry(roof,{depth:19,bevelEnabled:false}),stone,{x:0,y:6.8,z:-9.5});}break;
    case "roman_arch": {
      for(const x of [-3.3,3.3]) {b.box(1.6,5.3,2,x,2.65,0,stone);b.box(2.1,.35,2.4,x,.175,0,white);}
      for(let i=0;i<14;i++) {const a=i/13*Math.PI,p={x:Math.cos(a)*3.25,y:5.1+Math.sin(a)*3.25,z:0};b.add(new THREE.BoxGeometry(.76,1.4,2.1),i%2 ? stone:white,p,{x:0,y:0,z:a-Math.PI/2});}break;
    }
    case "coffee":b.add(new THREE.LatheGeometry([[0,0],[.7,0],[.85,.2],[1,1.5],[.85,1.5],[.75,.25]].map(([r,y])=>new THREE.Vector2(r,y)),32),white);b.ring(.6,.15,1,1,0,white);b.cylinder(.78,.03,0,1.34,0,0x65503c);break;
    default:return false;
  }
  return true;
}
function diamond(b:LondonBatch) {
  const shape=new THREE.Shape();const outer=[[0,-31],[4,-29],[29,-4],[31,0],[29,4],[4,29],[0,31],[-4,29],[-29,4],[-31,0],[-29,-4],[-4,-29]];
  outer.forEach(([x,z],i)=>i ? shape.lineTo(x,z):shape.moveTo(x,z));shape.closePath();const hole=new THREE.Path();hole.moveTo(0,-9);hole.lineTo(-9,0);hole.lineTo(0,9);hole.lineTo(9,0);hole.closePath();shape.holes.push(hole);
  b.add(new THREE.ExtrudeGeometry(shape,{depth:.65,bevelEnabled:false}).rotateX(Math.PI/2),0xd2c6a8);
  for(const outline of [outer,[[0,-9],[-9,0],[0,9],[9,0]]]) {
    const points=outline.map(([x,z])=>new THREE.Vector3(x,.06,z));points.push(points[0].clone());b.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points,false,"centripetal"),outline.length*6,.065,5,false),gold);
  }
}
function pyramid(group:THREE.Group):THREE.Mesh[] {
  const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.92}),PYRAMID_BLOCKS.length);
  mesh.name="museum-pyramid-blocks";mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const matrix=new THREE.Matrix4(),colour=new THREE.Color();
  PYRAMID_BLOCKS.forEach((block,i)=>{
    matrix.makeScale(block.width,PYRAMID_BLOCK_HEIGHT,block.depth);matrix.setPosition(block.x,block.y-PYRAMID_BLOCK_HEIGHT/2,block.z);mesh.setMatrixAt(i,matrix);
    colour.setHex((block.index+block.tier)%3 ? 0xbfa57d:0xcbb78d);mesh.setColorAt(i,colour);
  });
  mesh.computeBoundingBox();mesh.boundingBox!.expandByScalar(1.4);mesh.boundingSphere=mesh.boundingBox!.getBoundingSphere(new THREE.Sphere());
  group.add(mesh);group.userData.pyramidBlocks=PYRAMID_BLOCKS;group.userData.pyramidInstances=mesh;group.userData.pyramidMatrix=matrix;return [mesh];
}
function basin(b:LondonBatch) {
  const vertices:number[]=[],colors:number[]=[],colour=new THREE.Color();
  const p=(r:number,a:number)=>new THREE.Vector3(Math.cos(a)*r,basinHeight(Math.cos(a)*r,Math.sin(a)*r),Math.sin(a)*r);
  for(let ring=0;ring<36;ring++) for(let i=0;i<96;i++) {
    const r=18*ring/36,nr=18*(ring+1)/36,a=i*tau/96,na=(i+1)*tau/96,A=p(r,a),B=p(nr,a),C=p(nr,na),D=p(r,na);
    colour.setHex((Math.floor(i/12)+Math.floor(ring/9))%2 ? 0xe4e3d6:0xd4d9cf);
    for(const v of [A,D,C,A,C,B]) {vertices.push(v.x,v.y,v.z);colors.push(colour.r,colour.g,colour.b);}
  }
  surface(b,vertices,colors);
  const gap=Math.asin(7.4/36),rim=new THREE.CatmullRomCurve3(Array.from({length:100},(_,i)=>{const a=Math.PI/2+gap+(tau-2*gap)*i/99;return new THREE.Vector3(Math.cos(a)*18,18.1,Math.sin(a)*18);}));
  b.add(new THREE.TubeGeometry(rim,160,.22,7,false),white);
  b.add(new THREE.CylinderGeometry(18.15,8,10.25,64,1,true),0xb9c8bd,{x:0,y:12.775,z:0});b.cylinder(7.9,.5,0,7.4,0,0xc7c6b6);
}
function gemDisk(group:THREE.Group,index:number,angle:number):THREE.Mesh[] {
  const floor=new LondonBatch(),verts:number[]=[],colors:number[]=[],colour=new THREE.Color();
  for(let i=0;i<96;i++) {
    colour.setHex(Math.floor(i/12)%2 ? 0xd6c5a4:0xa9b6ab);
    for(const p of [[0,0,0],[Math.cos((i+1)*tau/96)*7.5,0,Math.sin((i+1)*tau/96)*7.5],[Math.cos(i*tau/96)*7.5,0,Math.sin(i*tau/96)*7.5]]) {verts.push(...p);colors.push(colour.r,colour.g,colour.b);}
  }
  surface(floor,verts,colors);floor.add(new THREE.CylinderGeometry(7.5,7.5,.6,64,1,true),stone,{x:0,y:-.3,z:0});
  const meshes=floor.finish(group),bumper=new LondonBatch(),r=6.8,half=Math.asin(2.4/(2*r));
  const curve=new THREE.CatmullRomCurve3(Array.from({length:121},(_,i)=>{const a=angle+half+(tau-2*half)*i/120;return new THREE.Vector3(Math.cos(a)*r,.6,Math.sin(a)*r);}));
  bumper.add(new THREE.TubeGeometry(curve,160,.24,7,false),0x9d6951);
  for(let i=1;i<28;i++) {const a=angle+half+(tau-2*half)*i/28;bumper.cylinder(.1,.55,Math.cos(a)*r,.275,Math.sin(a)*r,gold);}
  for(const mesh of bumper.finish(group)) {mesh.userData.museumRestitution=1.2;meshes.push(mesh);}
  const pedestal=new LondonBatch();pedestal.cylinder(.5,.25,0,.125,0,gold);pedestal.finish(group);
  const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.85,0).scale(1,1.35,1),new THREE.MeshStandardMaterial({color:[0xc83e46,0x31926b,0x3b78c5,0xe3bd44][index%4],roughness:.15,metalness:.22}));
  gem.name="museum-gem";gem.position.y=1.2;group.add(gem);return meshes;
}
function paintingWall(group:THREE.Group,b:LondonBatch,row:number,correct:number) {
  // Opaque ceiling, outer skirts and deep partitions prevent viewing the floor
  // behind a canvas from above, beside it or from a neighbouring wrong passage.
  b.box(18.8,.4,14,0,6.7,-1,stone);
  b.box(18.5,3.745,.55,0,4.6275,-.24,stone);
  for(const x of [-9.25,9.25]) b.box(.5,30.5,14,x,-8.75,-1,stone);
  for(const x of [-2.5,2.5]) b.box(.5,30.5,6,x,-8.75,-3,stone);
  b.box(18,.35,12,0,-23,-2,0x34312e);
  // Cover every strip outside the three canvases, including their outer sides
  // and the entire space below floor level. No doorway reveals a hidden floor.
  for(const [left,right] of [[-9.5,-6.9],[-3.1,-1.9],[1.9,3.1],[6.9,9.5]]) b.box(right-left,30.5,.55,(left+right)/2,-8.75,-.24,stone);
  b.box(18.8,24,.55,0,-12,-.24,stone);
  const cameraMeshes:THREE.Mesh[]=[];
  for(let i=0;i<3;i++) {
    const x=(i-1)*5;
    for(const side of [-1,1]) b.box(.19,2.85,.22,x+side*1.99,1.33,.13,gold);
    for(const y of [-.02,2.68]) b.box(4.17,.15,.22,x,y,.13,gold);
    const painting=new THREE.Mesh(new THREE.PlaneGeometry(3.8,2.55),new THREE.MeshStandardMaterial({map:museumPaintingTexture(row,i===correct),color:0xffffff,roughness:1,side:THREE.DoubleSide}));
    painting.position.set(x,1.33,.075);painting.name=`museum-painting-${row}-${i}`;painting.userData.different=i===correct;group.add(painting);cameraMeshes.push(painting);
    londonLabel(group,MUSEUM_PAINTING_TITLES[row],x,3,.06,3.2,.15,"#8d7956","#eee7d5");
  }
  group.userData.museumCameraMeshes=cameraMeshes;
}
function hall(b:LondonBatch,group:THREE.Group,length:number,chase=false) {
  if(!chase) {
    // A tall atrium surrounds the elevated exhibits. Its ceiling must stay well
    // above every course instead of intersecting their playable floors.
    b.box(140,1,270,0,-2,-70,0xaba89c);
    for(const side of [-1,1]) b.box(1,86,270,side*64,41,-70,0xaaa18f);
    for(let i=0;i<10;i++) {
      const z=55-i*24;
      for(const side of [-1,1]) {column(b,side*55,0,z,8);b.box(.3,12,6,side*63,39,z,0xd7c99f,"glow");if(i%2===0) b.ring(2,.4,side*63,23,z+6,green);}
      const curve=new THREE.CatmullRomCurve3(Array.from({length:33},(_,j)=>{const a=j*Math.PI/32;return new THREE.Vector3(Math.cos(a)*55,54+Math.sin(a)*30,z);}));
      b.add(new THREE.TubeGeometry(curve,48,.35,6,false),0xbca98d);b.box(126,.3,24.1,0,84.2,z-12,0xd4d3c7);
    }
    londonLabel(group,"MUSEUM · CHRISTMAS",0,25,56,28,2,"#685b4b");return;
  }
  if(chase) {
    for(const side of [-1,1]) b.box(.8,17,length+40,side*14.5,8.5,12-length/2,stone);
    for(const z of [30,-length-10]) b.box(29,17,.6,0,8.5,z,stone);
  }
  const count=chase ? Math.ceil(length/60):5,step=chase ? 60:22;
  for(let i=0;i<count;i++) {
    const z=chase ? 12-i*step:25-i*step;
    for(const side of [-1,1]) {
      column(b,side*13,0,z,1.35);
      b.box(.45,9,.45,side*13,12,z,0x9e8b73);
      b.box(.25,1.1,.65,side*13.4,6.8,z,0xf3d9a4,"glow");
      if(i%2===0) {b.ring(.8,.18,side*13.8,5,z+3,green);b.box(.4,.2,.1,side*13.8,4.3,z+3,red);}
    }
    const curve=new THREE.CatmullRomCurve3(Array.from({length:25},(_,j)=>{const a=j*Math.PI/24;return new THREE.Vector3(Math.cos(a)*13,9+Math.sin(a)*10,z);}));
    b.add(new THREE.TubeGeometry(curve,32,.2,6,false),0xbca98d);b.box(27,.25,step+.2,0,19,z-step/2,0xd4d3c7);
    for(let j=0;j<7;j++) b.ball(-9+j*3,14.5+Math.sin(j*Math.PI/6)*1.2,z,.09,.09,.09,j%2 ? gold:red,"glow");
    if(i%4===0) londonPine(b,11,0,z-12,1.2);
  }
}

export function createMuseumModel(obj:LevelObjectData):LondonModel|null {
  const subtype=String(obj.properties?.subType??"");if(!subtype.startsWith("museum_")) return null;
  const kind=subtype.slice(7);if(kind==="animal") return createMuseumAnimal(obj);
  const group=new THREE.Group(),b=new LondonBatch(),props=obj.properties??{};let solids:THREE.Mesh[]|undefined;
  if(!artifact(kind,b)) switch(kind) {
    case "diamond":diamond(b);break;
    case "pyramid":solids=pyramid(group);break;
    case "basin":basin(b);break;
    case "gem_disk":solids=gemDisk(group,Number(props.gemIndex??0),Number(props.gapAngle??gemGapAngle(Number(props.gemIndex??0))));break;
    case "painting_wall":paintingWall(group,b,Number(props.row??0),Number(props.correct??1));break;
    case "reading_room": {
      b.add(new THREE.CylinderGeometry(44,44,22,64,1,true),0x9f9077,{x:0,y:11,z:0});
      b.add(new THREE.SphereGeometry(44,64,20,0,tau,0,Math.PI/2).scale(1,.35,1),0xc5bc9f,{x:0,y:22,z:0});
      for(let i=0;i<24;i++) {const a=i*tau/24;column(b,Math.cos(a)*42,0,Math.sin(a)*42,2);}
      londonLabel(group,"THE READING ROOM",0,10,-42,14,1.2,"#7a6950");break;
    }
    case "jump_pad":
      b.box(Number(props.width??6),.08,1.5,0,-.04,0,0x557e79);for(const x of [-1.5,0,1.5]) b.add(new THREE.ConeGeometry(.35,.65,3).rotateX(-Math.PI/2),gold,{x,y:.06,z:0});break;
    case "goal_glass": {
      const glass=new THREE.Mesh(new THREE.BoxGeometry(6.4,5,6.4),new THREE.MeshStandardMaterial({color:0x9bc6c5,transparent:true,opacity:.2,depthWrite:false,roughness:.12,metalness:.05}));glass.position.y=2.56;glass.name="museum-goal-glass";group.add(glass);
      for(const x of [-3.23,3.23]) for(const z of [-3.23,3.23]) b.box(.08,5.1,.08,x,2.55,z,gold);
      for(const y of [.05,5.1]) {for(const x of [-3.23,3.23]) b.box(.08,.08,6.5,x,y,0,gold);for(const z of [-3.23,3.23]) b.box(6.5,.08,.08,0,y,z,gold);}break;
    }
    case "hall":hall(b,group,100);solids=[];break;
    case "chase_hall":hall(b,group,Number(props.length??1845),true);break;
    case "reflecting_pool":
      b.box(42,.4,165,0,-.2,0,0x536d6e);b.box(40,.04,163,0,.06,0,0x91b4b8);for(const side of [-1,1]) b.box(.6,1,165,side*21,.3,0,stone);break;
    default:return null;
  }
  const meshes=b.finish(group);group.position.copy(obj.position);group.rotation.set(obj.rotation.x,obj.rotation.y,obj.rotation.z,"YXZ");group.scale.copy(obj.scale);
  group.traverse(child=>child.userData.museumAsset=true);
  if(props.museumAction) previewMuseumActor(obj,group,0);
  return {group,meshes:solids??meshes};
}
export function previewMuseumActor(obj:LevelObjectData,group:THREE.Object3D,time:number,animateRig=true):boolean {
  if(obj.properties?.museumGoal==="pyramid") {group.position.y=obj.position.y+pyramidMotion(time,7);return true;}
  if(typeof obj.properties?.museumTier==="number") {group.position.y=obj.position.y+pyramidSurfaceMotion(time,obj.properties.museumTier,obj.position.x,obj.position.z);return true;}
  switch(obj.properties?.museumAction) {
    case "pyramid": {
      const mesh=group.userData.pyramidInstances as THREE.InstancedMesh,matrix=group.userData.pyramidMatrix as THREE.Matrix4;
      PYRAMID_BLOCKS.forEach((block,i)=>{matrix.makeScale(block.width,PYRAMID_BLOCK_HEIGHT,block.depth);matrix.setPosition(block.x,block.y-PYRAMID_BLOCK_HEIGHT/2+pyramidBlockMotion(time,block.tier,block.index),block.z);mesh.setMatrixAt(i,matrix);});
      mesh.instanceMatrix.needsUpdate=true;return true;
    }
    case "gem":group.rotation.y=obj.rotation.y+time*gemSpeed(Number(obj.properties.gemIndex??0));return true;
    case "animal": {
      const pose=covadongaCowPatrol(time,Number(obj.properties.frequency??.4),Number(obj.properties.phase??0),Number(obj.properties.amplitude??4));
      group.position.x=obj.position.x+pose.offset;group.rotation.y=obj.rotation.y+pose.yaw;if(animateRig) animateMuseumAnimal(group,time);return true;
    }
    case "rex":animateMuseumAnimal(group,time);return true;
    case "painting":case "glass":case "jump":return true;
    default:return false;
  }
}
