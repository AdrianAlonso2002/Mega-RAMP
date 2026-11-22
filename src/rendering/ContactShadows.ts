import * as THREE from 'three';
import {DecalGeometry} from 'three/addons/geometries/DecalGeometry.js';
import type {LevelData} from '../levels/LevelTypes';
import type {GraphicsQuality} from './GraphicsQuality';

/** Projected shadows are clipped to the actual receiver, including narrow paths and holes. */
export class ContactShadows {
  readonly group=new THREE.Group();
  private readonly ray=new THREE.Raycaster();
  private readonly normal=new THREE.Vector3();
  private readonly normalMatrix=new THREE.Matrix3();
  private readonly position=new THREE.Vector3();
  private readonly rotation=new THREE.Quaternion();
  private readonly orientation=new THREE.Euler();
  private readonly proxy=new THREE.Mesh();
  private readonly instanceMatrix=new THREE.Matrix4();
  private readonly texture:THREE.DataTexture;
  private readonly playerMaterial:THREE.MeshBasicMaterial;
  private readonly objectMaterial:THREE.MeshBasicMaterial;
  private readonly playerShadow:THREE.Mesh;
  private readonly staticShadows=new THREE.Group();
  private receivers:THREE.Mesh[]=[];
  private levelRoot?:THREE.Group;
  private data?:LevelData;
  private elapsed=0;
  private lastProjection=-Infinity;
  private readonly lastPlayerPosition=new THREE.Vector3(Infinity,Infinity,Infinity);
  private readonly lastReceiverMatrix=new THREE.Matrix4();
  private lastReceiver?:THREE.Mesh;
  private lastVertexVersion=-1;
  private quality:GraphicsQuality='medium';
  private deferredStatic=false;
  private pendingStatic?:Generator<void>;
  constructor() {
    const pixels=new Uint8Array(64*64*4);
    for(let y=0;y<64;y++) for(let x=0;x<64;x++) {const r=Math.hypot((x-31.5)/31.5,(y-31.5)/31.5),i=(y*64+x)*4;pixels[i+3]=Math.round(255*Math.exp(-r*r*5)*Math.max(0,1-r));}
    this.texture=new THREE.DataTexture(pixels,64,64,THREE.RGBAFormat);this.texture.minFilter=THREE.LinearFilter;this.texture.magFilter=THREE.LinearFilter;this.texture.needsUpdate=true;
    this.playerMaterial=new THREE.MeshBasicMaterial({map:this.texture,transparent:true,opacity:.38,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,toneMapped:false});
    this.objectMaterial=this.playerMaterial.clone();this.objectMaterial.opacity=.22;
    this.playerShadow=new THREE.Mesh(new THREE.BufferGeometry(),this.playerMaterial);this.playerShadow.visible=false;this.playerShadow.renderOrder=2;
    this.group.name='visual-contact-shadows';this.group.userData.graphicsOnly=true;this.group.add(this.staticShadows,this.playerShadow);
  }
  bind(data:LevelData,root:THREE.Group,receivers:THREE.Mesh[],deferStatic=false):void {this.clear();this.deferredStatic=deferStatic;this.data=data;this.levelRoot=root;this.receivers=receivers.filter(m=>m.geometry.getAttribute('position').count<=60000);this.buildStatic();}
  setQuality(quality:GraphicsQuality):void {if(this.quality===quality) return;this.quality=quality;this.lastProjection=-Infinity;this.buildStatic();}
  private hit(origin:THREE.Vector3,maxDistance:number,exclude?:Set<THREE.Object3D>):THREE.Intersection|undefined {
    this.ray.set(origin,this.normal.set(0,-1,0));this.ray.far=maxDistance;
    return this.ray.intersectObjects(exclude ? this.receivers.filter(m=>!exclude.has(m)):this.receivers,false).find(h=>h.face&&h.face.normal.y>-.8);
  }
  private project(hit:THREE.Intersection,width:number,depth:number):THREE.BufferGeometry {
    let receiver=hit.object as THREE.Mesh;
    if(receiver instanceof THREE.InstancedMesh&&hit.instanceId!==undefined) {receiver.getMatrixAt(hit.instanceId,this.instanceMatrix);this.proxy.geometry=receiver.geometry;this.proxy.matrixWorld.multiplyMatrices(receiver.matrixWorld,this.instanceMatrix);receiver=this.proxy;}
    let patch:THREE.BufferGeometry|undefined;
    if(receiver.geometry.getAttribute('position').count>12000&&hit.faceIndex!==undefined&&hit.faceIndex!==null) {
      const original=receiver.geometry,indices=original.index?.array,faces=(indices?.length??original.getAttribute('position').count)/3,start=Math.max(0,hit.faceIndex-128)*3,end=Math.min(faces,hit.faceIndex+129)*3;
      patch=new THREE.BufferGeometry().setAttribute('position',original.getAttribute('position')).setAttribute('normal',original.getAttribute('normal'));
      patch.setIndex(indices ? Array.from(indices.slice(start,end)):Array.from({length:end-start},(_,i)=>start+i));
      this.proxy.matrixWorld.copy(receiver.matrixWorld);this.proxy.geometry=patch;receiver=this.proxy;
    }
    this.normal.copy(hit.face!.normal).applyNormalMatrix(this.normalMatrix.getNormalMatrix(receiver.matrixWorld));
    this.rotation.setFromUnitVectors(new THREE.Vector3(0,0,1),this.normal);this.orientation.setFromQuaternion(this.rotation);
    this.position.copy(hit.point).addScaledVector(this.normal,.008);
    const geometry=new DecalGeometry(receiver,this.position,this.orientation,new THREE.Vector3(width,depth,.12));
    // Do not wrap the ground shadow down the vertical sides of a narrow platform.
    const normals=geometry.getAttribute('normal'),kept:number[]=[];
    for(let i=0;i<normals.count;i+=3) {
      const alignment=(normals.getX(i)+normals.getX(i+1)+normals.getX(i+2))*this.normal.x+
        (normals.getY(i)+normals.getY(i+1)+normals.getY(i+2))*this.normal.y+
        (normals.getZ(i)+normals.getZ(i+1)+normals.getZ(i+2))*this.normal.z;
      if(alignment>.75) kept.push(i,i+1,i+2);
    }
    for(const name of ['position','normal','uv']) {
      const source=geometry.getAttribute(name),values=new Float32Array(kept.length*source.itemSize);
      kept.forEach((index,i)=>{for(let c=0;c<source.itemSize;c++) values[i*source.itemSize+c]=source.array[index*source.itemSize+c];});
      geometry.setAttribute(name,new THREE.BufferAttribute(values,source.itemSize));
    }
    // Projector offset only moves the clipping box. Lift the actual vertices as well;
    // otherwise the decal is coplanar and flickers on slopes and moving platforms.
    geometry.translate(this.normal.x*.003,this.normal.y*.003,this.normal.z*.003);
    geometry.computeBoundingSphere();patch?.dispose();return geometry;
  }
  update(delta:number,playerPosition?:THREE.Vector3,enabled=true):void {
    this.elapsed+=delta;this.group.visible=enabled;
    // Decorative shadows can fill in during the intro instead of blocking stage entry.
    if(enabled&&this.pendingStatic?.next().done)this.pendingStatic=undefined;
    if(!enabled||!playerPosition) {this.playerShadow.visible=false;return;}
    const hz=this.quality==='low' ? 12:this.quality==='medium' ? 20:30;
    if(this.elapsed-this.lastProjection<1/hz) return;this.lastProjection=this.elapsed;
    if(this.playerShadow.visible&&this.lastReceiver&&this.lastPlayerPosition.distanceToSquared(playerPosition)<.00001&&this.lastReceiver.matrixWorld.equals(this.lastReceiverMatrix)&&(this.lastReceiver.geometry.getAttribute('position') as THREE.BufferAttribute).version===this.lastVertexVersion) return;
    const hit=this.hit(playerPosition,12);if(!hit) {this.playerShadow.visible=false;return;}
    const height=Math.max(0,hit.distance-.75),size=1.7+Math.min(2,height*.12);
    const geometry=this.project(hit,size,size);this.playerShadow.geometry.dispose();this.playerShadow.geometry=geometry;
    this.playerShadow.visible=geometry.getAttribute('position').count>0;this.playerMaterial.opacity=.4/(1+height*.85);
    this.lastPlayerPosition.copy(playerPosition);this.lastReceiver=hit.object as THREE.Mesh;this.lastReceiverMatrix.copy(this.lastReceiver.matrixWorld);this.lastVertexVersion=(this.lastReceiver.geometry.getAttribute('position') as THREE.BufferAttribute).version;
  }
  private buildStatic():void {
    this.pendingStatic=undefined;
    for(const mesh of [...this.staticShadows.children]) {if(mesh instanceof THREE.Mesh) mesh.geometry.dispose();this.staticShadows.remove(mesh);}
    this.pendingStatic=this.generateStatic();
    if(!this.deferredStatic){for(const _ of this.pendingStatic){}this.pendingStatic=undefined;}
  }
  private *generateStatic():Generator<void> {
    if(!this.data||!this.levelRoot||this.quality==='low') return;
    this.levelRoot.updateWorldMatrix(true,true);const nodes=new Map<string,THREE.Object3D>();this.levelRoot.traverse(n=>{if(typeof n.userData.levelObjectId==='string') nodes.set(n.userData.levelObjectId,n);});
    const budget=this.quality==='high' ? 32:12;let count=0;
    for(const obj of this.data.objects) {
      if(count>=budget) break;
      if(obj.type!=='decoration'||obj.properties?.hasCollision!==true||Object.keys(obj.properties??{}).some(k=>k.endsWith('Action')&&obj.properties![k])) continue;
      yield;
      const node=nodes.get(obj.id);if(!node) continue;const bounds=new THREE.Box3().setFromObject(node),size=bounds.getSize(new THREE.Vector3()),centre=bounds.getCenter(new THREE.Vector3());
      if(Math.max(size.x,size.z)>18||Math.min(size.x,size.z)<.3) continue;
      const excluded=new Set<THREE.Object3D>();node.traverse(n=>excluded.add(n));centre.y=bounds.min.y+.08;
      const hit=this.hit(centre,.65,excluded);if(!hit) continue;
      const shadow=new THREE.Mesh(this.project(hit,Math.max(1,size.x*1.3),Math.max(1,size.z*1.3)),this.objectMaterial);shadow.renderOrder=1;this.staticShadows.add(shadow);count++;
    }
  }
  clear():void {
    this.pendingStatic=undefined;
    this.receivers=[];this.levelRoot=undefined;this.data=undefined;this.playerShadow.visible=false;this.lastProjection=-Infinity;this.lastReceiver=undefined;
    for(const mesh of [...this.staticShadows.children]) {if(mesh instanceof THREE.Mesh) mesh.geometry.dispose();this.staticShadows.remove(mesh);}
  }
  dispose():void {this.clear();this.playerShadow.geometry.dispose();this.playerMaterial.dispose();this.objectMaterial.dispose();this.texture.dispose();}
}
