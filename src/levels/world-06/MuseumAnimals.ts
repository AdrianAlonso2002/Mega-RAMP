import * as THREE from "three";
import type {LevelObjectData} from "../LevelTypes";
import {LondonBatch,type LondonModel} from "./LondonModels";
import type {MuseumAnimal} from "./MuseumRoutes";
import {createMuseumTrex} from "./MuseumTrex";
const tones:Record<MuseumAnimal,number>={trex:0x62724e,triceratops:0x89785b,sabretooth:0xba995d,mammoth:0x78604b,stegosaurus:0x64806b,ankylosaurus:0x8a8268,raptor:0x8c765e,brachiosaurus:0x7e9580,pteranodon:0x867b70,woolly_rhino:0x8b8172,megatherium:0x9c896e};
export function createMuseumAnimal(obj:LevelObjectData):LondonModel {
  if(obj.properties?.species==="trex") return createMuseumTrex(obj);
  const species=String(obj.properties?.species??"triceratops") as MuseumAnimal,biped=species==="trex"||species==="raptor",c=tones[species]??tones.triceratops;
  const group=new THREE.Group(),body=new LondonBatch(),legs:THREE.Group[]=[];
  const bodyY=biped ? 2.3:1.65,length=species==="brachiosaurus" ? 2:species==="sabretooth" ? 1.3:1.7;
  body.ball(0,bodyY,0,.95,biped ? 1.15:.9,length,c);
  body.ball(0,bodyY+.15,-.7,.8,.8,1,c);
  if(species==="mammoth"||species==="woolly_rhino"||species==="megatherium") {
    for(let i=0;i<30;i++) {const a=i*2.4;body.add(new THREE.ConeGeometry(.12,.6,5),i%2 ? c:0x706355,{x:Math.sin(a)*.85,y:bodyY+.2+(i%4)*.15,z:Math.cos(a)*length},{x:Math.PI,y:0,z:Math.sin(a)*.3});}
  }
  if(species==="stegosaurus") for(let i=0;i<7;i++) body.add(new THREE.ConeGeometry(.5,1.3,3).scale(.5,1,1),0xa18a6b,{x:i%2 ? -.2:.2,y:bodyY+1.1,z:-1.3+i*.43});
  if(species==="ankylosaurus") {
    body.ball(0,bodyY+.45,.1,1.14,.6,1.6,0x8e8d76);
    for(let i=0;i<16;i++) {const a=i*Math.PI*2/16;body.add(new THREE.ConeGeometry(.16,.65,5),0xc2b49a,{x:Math.cos(a),y:bodyY+.5,z:Math.sin(a)*1.4},{x:Math.sin(a)*.7,y:0,z:-Math.cos(a)*.7});}
  }
  const meshes=body.finish(group);
  for(const side of [-1,1]) for(const end of biped ? [0]:[-1,1]) {
    const leg=new THREE.Group();leg.position.set(side*.65,biped ? 1.7:1.15,end*.95);leg.name="museum-animal-leg";
    const p=new LondonBatch();p.ball(0,-.4,0,.3,.65,.35,c);p.ball(0,-(biped ? 1.45:.96),-.15,.32,.23,.5,0x4e554a);
    for(const x of [-.16,0,.16]) p.add(new THREE.ConeGeometry(.065,.24,5).rotateX(-Math.PI/2),0xdbc9a6,{x,y:-(biped ? 1.5:1),z:-.6});
    p.finish(leg);group.add(leg);legs.push(leg);
  }
  if(biped) for(const side of [-1,1]) {
    const p=new LondonBatch();p.ball(side*.65,bodyY+.3,-1,.18,.42,.23,c);p.ball(side*.65,bodyY,-1.35,.17,.16,.27,c);p.finish(group);
  }
  const head=new THREE.Group();head.name="museum-animal-head";head.position.set(0,biped ? 3.65:2.2,-1.55);group.add(head);const h=new LondonBatch();
  const neck=species==="brachiosaurus" ? 3:species==="megatherium" ? .6:0;
  if(neck) {h.cylinder(.4,neck,0,neck/2,-.2,c);head.userData.longNeck=neck;}
  h.ball(0,neck,0,biped ? .7:.6,biped ? .65:.55,biped ? 1:.7,c);
  h.ball(0,neck-.28,-.52,biped ? .61:.48,.23,biped ? .92:.56,c);
  for(const side of [-1,1]) {
    h.ball(side*(biped ? .55:.43),neck+.2,-.48,.13,.13,.075,0xe8d7a1);h.ball(side*(biped ? .55:.43),neck+.2,-.54,.055,.065,.035,0x172325);
    if(biped) for(let i=0;i<8;i++) h.add(new THREE.ConeGeometry(.055,.24,5),0xf2e7ce,{x:side*.45,y:neck-.29,z:-.1-i*.2},{x:Math.PI,y:0,z:0});
    if(species==="sabretooth") {h.add(new THREE.ConeGeometry(.08,.8,8),0xe9debf,{x:side*.34,y:neck-.55,z:-.75},{x:Math.PI,y:0,z:0});h.ball(side*.43,neck+.4,.1,.23,.25,.13,c);}
    if(species==="mammoth") {
      h.ball(side*.7,neck,.1,.6,.7,.2,c);
      const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(side*.3,-.2,-.5),new THREE.Vector3(side*.7,-.5,-1.2),new THREE.Vector3(side*.75,-.1,-1.8)]);
      h.add(new THREE.TubeGeometry(curve,12,.1,6,false),0xe9dec6);
    }
    if(species==="triceratops") h.add(new THREE.ConeGeometry(.14,1.25,10).rotateX(-.7),0xded2b4,{x:side*.38,y:.56,z:-.35});
  }
  if(species==="triceratops") {h.ball(0,.3,.55,1,.95,.22,c);h.add(new THREE.ConeGeometry(.15,.55,8).rotateX(-.7),0xe1d5b7,{x:0,y:.2,z:-.85});}
  if(species==="woolly_rhino") h.add(new THREE.ConeGeometry(.23,1.1,10),0xc5bda6,{x:0,y:.55,z:-.7});
  if(species==="mammoth") {
    const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,-.65),new THREE.Vector3(0,-.8,-1),new THREE.Vector3(.2,-1.4,-1.4)]);h.add(new THREE.TubeGeometry(curve,12,.2,8,false),c);
  }
  if(species==="pteranodon") h.add(new THREE.ConeGeometry(.16,1.5,5).rotateX(-Math.PI/2),0xb5a786,{x:0,y:0,z:-1.2});
  if(obj.properties?.santa) {
    h.cylinder(.72,.26,0,neck+.7,.1,0xe6e7db);h.add(new THREE.ConeGeometry(.7,1.8,20),0xb92d36,{x:.15,y:neck+1.6,z:.1},{x:0,y:0,z:-.25});h.ball(.38,neck+2.48,.1,.26,.26,.26,0xf4f0de);
  }
  h.finish(head);
  const tail=new THREE.Group();tail.name="museum-animal-tail";tail.position.set(0,bodyY-.1,length*.75);group.add(tail);
  const t=new LondonBatch();t.add(new THREE.ConeGeometry(.4,biped ? 3.2:1.8,12).rotateX(Math.PI/2),c,{x:0,y:0,z:biped ? 1.3:.7});if(species==="ankylosaurus") t.ball(0,0,1.6,.5,.32,.55,0x85816e);t.finish(tail);
  if(species==="pteranodon") for(const side of [-1,1]) {
    const wing=new THREE.Group();wing.name=`museum-animal-wing-${side}`;wing.position.y=bodyY+.5;
    const shape=new THREE.Shape();shape.moveTo(0,0);shape.lineTo(side*4,-.8);shape.lineTo(side*1.3,-1.8);shape.closePath();
    const p=new LondonBatch();p.add(new THREE.ShapeGeometry(shape).rotateX(Math.PI/2),0xa69c86);p.finish(wing);group.add(wing);
  }
  group.userData.animalRig={legs,head,tail,headY:head.position.y,species};group.userData.animalRadius=species==="brachiosaurus"||species==="mammoth" ? 2.1:1.6;
  group.position.copy(obj.position);group.rotation.set(obj.rotation.x,obj.rotation.y,obj.rotation.z,"YXZ");group.scale.copy(obj.scale);return {group,meshes};
}
export function animateMuseumAnimal(group:THREE.Object3D,time:number):void {
  const rig=group.userData.animalRig as {legs:THREE.Group[];head:THREE.Group;tail:THREE.Group;headY:number;species:string;jaw?:THREE.Group;arms?:THREE.Group[]}|undefined;if(!rig) return;
  rig.legs.forEach((leg,i)=>leg.rotation.x=Math.sin(time*6+i*Math.PI)*.43);rig.head.position.y=rig.headY+Math.sin(time*6)*.065;rig.tail.rotation.y=Math.sin(time*2)*.18;
  if(rig.jaw) rig.jaw.rotation.x=-.18-.16*(.5+.5*Math.sin(time*3.1));
  rig.arms?.forEach((arm,i)=>arm.rotation.x=Math.sin(time*6+i*Math.PI)*.12);
  for(const side of [-1,1]) {const wing=group.getObjectByName(`museum-animal-wing-${side}`);if(wing) wing.rotation.z=side*Math.sin(time*3)*.35;}
}
