import * as THREE from 'three';
import {CollectibleVisual} from './CollectibleVisual';
import {GRAPHICS_PROFILES,type GraphicsQuality} from './GraphicsQuality';
import {surfaceFamily,SURFACE_STYLES,type SurfaceFamily} from './ArtDirection';
type RenderObject=THREE.Mesh|THREE.Sprite|THREE.Points|THREE.Line;
interface MaterialEntry {source:THREE.Material;refs:number;variants:Map<GraphicsQuality,THREE.Material>;custom:boolean;bump:THREE.Texture|null;normal:THREE.Texture|null}
interface ObjectEntry {source:THREE.Material|THREE.Material[];rendered:THREE.Material|THREE.Material[];cast:boolean;receive:boolean;layers:number;detail:number}
/** Visual-only material variants. Geometry, transforms, physics and animation clocks are never edited. */
export class SceneQuality {
  private root?:THREE.Object3D;
  private quality:GraphicsQuality='medium';
  private readonly objects=new Map<RenderObject,ObjectEntry>();
  private readonly materials=new Map<THREE.Material,MaterialEntry>();
  private readonly nodes=new Set<THREE.Object3D>();
  private detailIndex=0;
  constructor(private readonly maxAnisotropy=8) {}
  private readonly added=(event:{child:THREE.Object3D})=>this.track(event.child);
  private readonly removed=(event:{child:THREE.Object3D})=>this.untrack(event.child);
  prepare(root:THREE.Object3D):void {
    if(this.root!==root) {this.dispose();this.root=root;this.track(root);}
    // Material assignments (character changes, editor selection) don't emit Object3D events.
    for(const [object,entry] of this.objects) if(object.material!==entry.rendered) {
      this.releaseMaterials(entry.source);entry.source=object.material;this.retainMaterials(entry.source);this.apply(object,entry);
    }
  }
  setQuality(quality:GraphicsQuality):void {
    if(this.quality===quality) return;this.quality=quality;
    for(const [object,entry] of this.objects) this.apply(object,entry);
    for(const node of this.nodes) {if(node instanceof CollectibleVisual)node.setQuality(quality);const water=node.userData.sellaWater as {setQuality?:(quality:GraphicsQuality)=>void}|undefined;water?.setQuality?.(quality);}
  }
  private track(node:THREE.Object3D):void {
    if(this.nodes.has(node)) return;this.nodes.add(node);
    node.addEventListener('childadded',this.added);node.addEventListener('childremoved',this.removed);
    if(node instanceof CollectibleVisual)node.setQuality(this.quality);
    if(node instanceof THREE.Mesh||node instanceof THREE.Sprite||node instanceof THREE.Points||node instanceof THREE.Line) {
      const entry:ObjectEntry={source:node.material,rendered:node.material,cast:node.castShadow,receive:node.receiveShadow,layers:node.layers.mask,detail:this.detailIndex++};
      this.objects.set(node,entry);this.retainMaterials(entry.source);this.apply(node,entry);
    }
    const water=node.userData.sellaWater as {setQuality?:(quality:GraphicsQuality)=>void}|undefined;water?.setQuality?.(this.quality);
    for(const child of node.children) this.track(child);
  }
  private untrack(node:THREE.Object3D):void {
    node.removeEventListener('childadded',this.added);node.removeEventListener('childremoved',this.removed);this.nodes.delete(node);
    if(node instanceof THREE.Mesh||node instanceof THREE.Sprite||node instanceof THREE.Points||node instanceof THREE.Line) {
      const entry=this.objects.get(node);if(entry) {node.material=entry.source;node.castShadow=entry.cast;node.receiveShadow=entry.receive;node.layers.mask=entry.layers;this.releaseMaterials(entry.source);this.objects.delete(node);}
    }
    for(const child of node.children) this.untrack(child);
  }
  private retainMaterials(value:THREE.Material|THREE.Material[]):void {
    for(const source of Array.isArray(value)?value:[value]) {
      const current=this.materials.get(source);if(current) {current.refs++;continue;}
      const lit=source as THREE.MeshStandardMaterial;
      this.materials.set(source,{source,refs:1,variants:new Map(),custom:source.onBeforeCompile!==THREE.Material.prototype.onBeforeCompile,bump:lit.bumpMap??null,normal:lit.normalMap??null});
    }
  }
  private releaseMaterials(value:THREE.Material|THREE.Material[]):void {
    for(const source of Array.isArray(value)?value:[value]) {
      const entry=this.materials.get(source);if(!entry||--entry.refs>0) continue;
      for(const variant of entry.variants.values()) if(variant!==source) variant.dispose();
      if(entry.custom) {const lit=source as THREE.MeshStandardMaterial;lit.bumpMap=entry.bump;lit.normalMap=entry.normal;}
      this.materials.delete(source);
    }
  }
  private textureSettings(material:THREE.Material):void {
    const p=GRAPHICS_PROFILES[this.quality],record=material as unknown as Record<string,unknown>;
    for(const key of ['map','alphaMap','normalMap','bumpMap','roughnessMap','metalnessMap','emissiveMap','aoMap','lightMap']) {
      const texture=record[key];if(!(texture instanceof THREE.Texture)) continue;
      const anisotropy=Math.min(this.maxAnisotropy,p.anisotropy);
      if(texture.anisotropy!==anisotropy) {texture.anisotropy=anisotropy;texture.needsUpdate=true;}
    }
  }
  private variant(source:THREE.Material):THREE.Material {
    if(source.userData.collectibleMaterial){this.textureSettings(source);return source;}
    const entry=this.materials.get(source)!;
    if(entry.custom&&source.userData.graphicsShaderCompatible!==true) {
      // River clipping and animated shader uniforms keep their original material identity.
      const lit=source as THREE.MeshStandardMaterial,normal=this.quality==='low' ? null:entry.normal,bump=this.quality==='low' ? null:entry.bump;
      if(lit.normalMap!==normal||lit.bumpMap!==bump) {lit.normalMap=normal;lit.bumpMap=bump;lit.needsUpdate=true;}
      this.textureSettings(source);return source;
    }
    if(!(source instanceof THREE.MeshStandardMaterial||source instanceof THREE.MeshPhongMaterial||source instanceof THREE.MeshLambertMaterial||source instanceof THREE.MeshToonMaterial)) {this.textureSettings(source);return source;}
    const cached=entry.variants.get(this.quality);if(cached) {this.textureSettings(cached);return cached;}
    const playerBall=source.userData.graphicsPlayerBall===true;
    const material=this.quality==='low' ? new THREE.MeshLambertMaterial():this.quality==='medium' ? new THREE.MeshPhongMaterial():source instanceof THREE.MeshPhysicalMaterial ? source.clone():playerBall ? new THREE.MeshPhysicalMaterial({clearcoat:.85,clearcoatRoughness:.12,ior:1.45}):new THREE.MeshStandardMaterial();
    const family=(source.userData.graphicsSurface as SurfaceFamily|undefined)??surfaceFamily(source.name),style=family==='neutral' ? undefined:SURFACE_STYLES[family];
    const from=source as unknown as Record<string,unknown>,to=material as unknown as Record<string,unknown>;
    for(const key of ['color','emissive','emissiveIntensity','map','alphaMap','emissiveMap','aoMap','aoMapIntensity','lightMap','lightMapIntensity','vertexColors','side','transparent','opacity','alphaTest','depthWrite','depthTest','blending','premultipliedAlpha','polygonOffset','polygonOffsetFactor','polygonOffsetUnits','fog','toneMapped','wireframe','clipShadows','clippingPlanes','clipIntersection']) {
      if(key in from&&key in to) to[key]=from[key];
    }
    // Both cached materials and mesh.material animations remain live when quality changes.
    for(const key of ['opacity','visible','emissiveIntensity','transparent','depthWrite','depthTest']) if(key in from&&key in to) Object.defineProperty(material,key,{configurable:true,enumerable:true,get:()=>from[key],set:value=>{from[key]=value;}});
    if(this.quality!=='low') for(const key of ['normalMap','normalScale','normalMapType','bumpMap','bumpScale']) if(key in from&&key in to) to[key]=from[key];
    if(material instanceof THREE.MeshPhongMaterial) {
      material.shininess=source instanceof THREE.MeshPhongMaterial ? source.shininess:Math.max(8,90*(1-Number(from.roughness??.65)));
      if(style) material.shininess=Math.max(5,100*(1-style.roughness));
      material.specular.setScalar(playerBall ? .65:style?.reflectivity??.16);material.envMap=null;
    }
    if(material instanceof THREE.MeshStandardMaterial) {
      material.roughness=typeof from.roughness==='number' ? from.roughness:source instanceof THREE.MeshPhongMaterial ? THREE.MathUtils.clamp(Math.sqrt(2/(source.shininess+2)),.24,.85):.8;
      material.metalness=Number(from.metalness??.02);material.envMapIntensity=.3;
      if(style) {material.roughness=style.roughness;material.metalness=style.metalness;material.envMapIntensity=style.reflectivity;}
      if(!source.transparent&&!source.map&&!entry.normal&&!entry.bump&&source.emissive.getHex()===0) this.addSurfaceDetail(material,family);
      if(playerBall) {
        material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\nfloat ballRim=pow(1.0-clamp(abs(dot(normal,normalize(vViewPosition))),0.0,1.0),3.0);\ntotalEmissiveRadiance+=vec3(0.035,0.055,0.07)*ballRim;');};
        material.customProgramCacheKey=()=> 'mega-ramp-ball-rim-v1';
      }
    }
    if(entry.custom) {material.onBeforeCompile=source.onBeforeCompile;material.customProgramCacheKey=source.customProgramCacheKey.bind(source);}
    material.name=`${source.name||source.type} · ${this.quality}`;entry.variants.set(this.quality,material);this.textureSettings(material);return material;
  }
  private addSurfaceDetail(material:THREE.MeshStandardMaterial,family:SurfaceFamily):void {
    material.onBeforeCompile=shader=>{
      shader.uniforms.qualityGrainScale={value:family==='wood' ? new THREE.Vector3(.8,3,14):family==='stone' ? new THREE.Vector3(3,3,3):family==='food' ? new THREE.Vector3(7,7,7):new THREE.Vector3(1,1,1)};
      shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 qualitySurfacePosition;')
        .replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvec4 qualityLocal=vec4(transformed,0.0);\n#ifdef USE_INSTANCING\nqualityLocal=instanceMatrix*qualityLocal;\n#endif\nqualitySurfacePosition=qualityLocal.xyz;');
      shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 qualitySurfacePosition;uniform vec3 qualityGrainScale;\nfloat qualityGrain(vec3 p){p*=qualityGrainScale;return sin(dot(p,vec3(17.13,31.71,11.93)))*sin(dot(p,vec3(13.57,-19.31,27.13)));}')
        .replace('#include <normal_fragment_maps>','#include <normal_fragment_maps>\nfloat qualityFade=1.0-smoothstep(12.0,55.0,length(vViewPosition));\nfloat qualityH=qualityGrain(qualitySurfacePosition)*0.013*qualityFade;\nvec3 qualityDx=dFdx(vViewPosition),qualityDy=dFdy(vViewPosition);\nnormal=normalize(normal+cross(normalize(qualityDy),normal)*dFdx(qualityH)+cross(normal,normalize(qualityDx))*dFdy(qualityH));');
    };
    material.customProgramCacheKey=()=> `mega-ramp-surface-grain-v2-${family}`;
  }
  private apply(object:RenderObject,entry:ObjectEntry):void {
    object.material=Array.isArray(entry.source) ? entry.source.map(m=>this.variant(m)):this.variant(entry.source);entry.rendered=object.material;
    const high=this.quality==='high',source=Array.isArray(entry.source)?entry.source[0]:entry.source;
    if(object instanceof THREE.Mesh) {
      if(!object.geometry.boundingSphere) object.geometry.computeBoundingSphere();
      const size=(object.geometry.boundingSphere?.radius??0)*Math.max(object.scale.x,object.scale.y,object.scale.z);
      object.castShadow=object.userData.graphicsNoShadow!==true&&high&&!source.transparent&&source.visible&&size<100&&!(source instanceof THREE.MeshBasicMaterial);
      object.receiveShadow=object.userData.graphicsNoShadow!==true&&high&&!source.transparent;
    }
    if(object.userData.graphicsDetail===true) object.layers.mask=entry.detail%GRAPHICS_PROFILES[this.quality].detailStride===0 ? entry.layers:0;
    for(const node of [object]) {const water=node.userData.sellaWater as {setQuality?:(quality:GraphicsQuality)=>void}|undefined;water?.setQuality?.(this.quality);}
  }
  dispose():void {if(this.root) this.untrack(this.root);this.root=undefined;this.detailIndex=0;}
}
