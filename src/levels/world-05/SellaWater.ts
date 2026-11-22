import * as THREE from "three";
import type { Vector3Data } from "../LevelTypes";
import { WaterWaveSimulator } from "../../rendering/WaterSimulator";
import { sampleSellaRiver,buildRiverFrames,type RiverFrame } from "./SellaRiver";
import {GRAPHICS_PROFILES,type GraphicsQuality} from '../../rendering/GraphicsQuality';

/** Native water-block wave solver mapped to a curved river. Geometry and normals are deformed
 * directly, with a bounded local simulation and a 30 Hz visual update on long descents. */
export class SellaWater {
  readonly simulator:WaterWaveSimulator;
  readonly arc:number[]=[0];
  readonly material:THREE.MeshPhongMaterial;
  private readonly frames:RiverFrame[];
  private geometry?:THREE.BufferGeometry;
  private baseY?:Float32Array;
  private geometryTime=-Infinity;
  private time=0;
  private quality:GraphicsQuality='medium';
  private readonly inverse=new THREE.Matrix4();
  private readonly point=new THREE.Vector3();
  private readonly canoeInverse={value:new THREE.Matrix4()};
  private readonly canoeVisible={value:0};

  constructor(readonly points:Vector3Data[],readonly width:number,readonly breaks:readonly number[],private readonly group:THREE.Group) {
    this.frames=buildRiverFrames(points,breaks);
    for(let i=0;i<points.length-1;i++) this.arc.push(this.arc[i]+(breaks.includes(i) ? 64:Math.hypot(points[i+1].x-points[i].x,points[i+1].z-points[i].z)));
    this.simulator=new WaterWaveSimulator(width,48,64,0,0);
    // Opaque depth-tested surface prevents lower river turns showing through the current one.
    this.material=new THREE.MeshPhongMaterial({color:0xc2e4e5,shininess:90,specular:0xd5e8ed,bumpScale:.07,
      transparent:false,opacity:1,depthWrite:true,side:THREE.DoubleSide});
    this.material.userData.graphicsShaderCompatible=true;
    this.material.onBeforeCompile=shader=>{
      shader.uniforms.sellaCanoeInverse=this.canoeInverse;shader.uniforms.sellaCanoeVisible=this.canoeVisible;
      shader.vertexShader=shader.vertexShader.replace("#include <common>","#include <common>\nvarying vec3 sellaWaterWorld;")
        .replace("#include <worldpos_vertex>","#include <worldpos_vertex>\nsellaWaterWorld=(modelMatrix*vec4(transformed,1.0)).xyz;");
      shader.fragmentShader=shader.fragmentShader.replace("#include <common>",`#include <common>
        varying vec3 sellaWaterWorld;
        uniform mat4 sellaCanoeInverse;
        uniform float sellaCanoeVisible;
      `).replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
        vec3 hull=(sellaCanoeInverse*vec4(sellaWaterWorld,1.0)).xyz;
        if(sellaCanoeVisible>0.5 && hull.y>-.235 && hull.y<.42 && hull.z>=-2.65 && hull.z<=2.65) {
          float w;
          if(hull.z < -2.0) w=mix(.035,.5,(hull.z+2.65)/.65);
          else if(hull.z < -1.0) w=mix(.5,.76,hull.z+2.0);
          else if(hull.z < .6) w=mix(.76,.8,(hull.z+1.0)/1.6);
          else if(hull.z < 1.7) w=mix(.8,.58,(hull.z-.6)/1.1);
          else w=mix(.58,.035,(hull.z-1.7)/.95);
          w*=mix(.61,1.0,clamp((hull.y+.22)/.6,0.0,1.0));
          if(abs(hull.x)<w+.005) discard;
        }
      `);
    };
    this.material.customProgramCacheKey=()=>"sella-local-hull-clip-v2";
  }

  setCanoeTransform(matrix:THREE.Matrix4|null):void {
    this.canoeVisible.value=matrix ? 1:0;
    if(matrix) this.canoeInverse.value.copy(matrix).invert();
  }

  createGeometry():THREE.BufferGeometry {
    const vertices:number[]=[],coords:number[]=[],forward:number[]=[],sides:number[]=[],indices:number[]=[];
    const columns=Math.min(32,Math.max(16,Math.ceil(this.width)))+1;
    const frames=this.frames;
    const row=(i:number,t:number)=>{
      const a=this.points[i],b=this.points[i+1],dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz)||1;
      const nx=THREE.MathUtils.lerp(frames[i].x,frames[i+1].x,t),nz=THREE.MathUtils.lerp(frames[i].z,frames[i+1].z,t);
      const x=THREE.MathUtils.lerp(a.x,b.x,t),y=THREE.MathUtils.lerp(a.y,b.y,t),z=THREE.MathUtils.lerp(a.z,b.z,t);
      for(let col=0;col<columns;col++) {
        const across=(col/(columns-1)-.5)*this.width;
        vertices.push(x+nx*across,y,z+nz*across);coords.push(across,this.arc[i]+length*t);
        forward.push((dx+across*(frames[i+1].x-frames[i].x))/length,(b.y-a.y)/length,
          (dz+across*(frames[i+1].z-frames[i].z))/length);sides.push(nx,0,nz);
      }
    };
    for(let i=0;i<this.points.length-1;i++) {
      if(this.breaks.includes(i)) continue;
      const count=Math.max(1,Math.ceil((this.arc[i+1]-this.arc[i])/1.8)),offset=vertices.length/3;
      for(let j=0;j<=count;j++) row(i,j/count);
      for(let j=0;j<count;j++) for(let col=0;col<columns-1;col++) {
        const a=offset+j*columns+col,b=a+1,c=a+columns,d=c+1;indices.push(a,b,d,a,d,c);
      }
    }
    const geometry=new THREE.BufferGeometry();geometry.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));
    geometry.setAttribute("riverCoord",new THREE.Float32BufferAttribute(coords,2));geometry.setAttribute("riverForward",new THREE.Float32BufferAttribute(forward,3));
    geometry.setAttribute("riverSide",new THREE.Float32BufferAttribute(sides,3));geometry.setIndex(indices);geometry.computeVertexNormals();
    geometry.setAttribute("uv",new THREE.Float32BufferAttribute(coords.map(value=>value/4),2));
    this.geometry=geometry;this.baseY=Float32Array.from({length:vertices.length/3},(_,i)=>vertices[i*3+1]);
    (geometry.getAttribute("position") as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
    (geometry.getAttribute("normal") as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
    this.deform(0);
    geometry.computeBoundingBox();geometry.boundingBox?.expandByScalar(.5);geometry.computeBoundingSphere();if(geometry.boundingSphere) geometry.boundingSphere.radius+=.5;
    return geometry;
  }

  private coordinates(world:Vector3Data,hint=-1):{across:number;s:number;baseY:number}|null {
    this.group.updateWorldMatrix(true,false);this.inverse.copy(this.group.matrixWorld).invert();this.point.copy(world).applyMatrix4(this.inverse);
    const sample=sampleSellaRiver(this.points,this.point,this.breaks,hint,this.frames,this.width);
    if(!sample || sample.distance>this.width/2+.6) return null;
    const a=this.points[sample.segment],b=this.points[sample.segment+1];
    if((sample.segment===this.points.length-2 || this.breaks.includes(sample.segment+1)) && sample.t>.999 && (this.point.x-b.x)*sample.dx+(this.point.z-b.z)*sample.dz>.3) return null;
    if((sample.segment===0 || this.breaks.includes(sample.segment-1)) && sample.t<.001 && (this.point.x-a.x)*sample.dx+(this.point.z-a.z)*sample.dz<-.3) return null;
    const length=this.arc[sample.segment+1]-this.arc[sample.segment];
    return {across:sample.side,s:this.arc[sample.segment]+length*sample.t,baseY:sample.y};
  }

  focus(world:Vector3Data,hint=-1):void {
    const c=this.coordinates(world,hint);if(!c) return;
    if(Math.abs(c.s-this.simulator.centerZ)>12) this.simulator.shiftCenterZ(c.s);
  }

  disturb(world:Vector3Data,impulse:number,radius=.9,hint=-1):void {
    const c=this.coordinates(world,hint);if(c) this.simulator.disturbWorld(c.across,c.s,impulse,radius);
  }

  sample(world:Vector3Data,hint=-1):number {
    const c=this.coordinates(world,hint);if(!c) return 0;
    return this.height(c.across,c.s)*this.group.scale.y;
  }

  surfaceHeight(world:Vector3Data,hint=-1):number|null {
    const c=this.coordinates(world,hint);if(!c) return null;
    this.point.y=c.baseY+this.height(c.across,c.s);this.point.applyMatrix4(this.group.matrixWorld);return this.point.y;
  }

  private height(across:number,s:number):number {
    return this.simulator.sampleHeight(across,s)+Math.sin(across*.75+s*.4-this.time*2)*.075+Math.sin(s*.9+across*.4+this.time*1.7)*.045;
  }

  private deform(time:number):void {
    if(!this.geometry || !this.baseY) return;
    const pos=this.geometry.getAttribute("position") as THREE.BufferAttribute,norm=this.geometry.getAttribute("normal") as THREE.BufferAttribute;
    const coords=this.geometry.getAttribute("riverCoord"),forward=this.geometry.getAttribute("riverForward"),side=this.geometry.getAttribute("riverSide");
    const positions=pos.array as Float32Array,normals=norm.array as Float32Array;
    const eps=Math.max(.12,this.simulator.dx*.8);
    for(let i=0;i<pos.count;i++) {
      const across=coords.getX(i),s=coords.getY(i),u=across*.75+s*.4-time*2,v=s*.9+across*.4+time*1.7;
      const local=Math.abs(s-this.simulator.centerZ)<24;
      const wave=local ? this.simulator.sampleHeight(across,s):0;
      positions[i*3+1]=this.baseY[i]+wave+Math.sin(u)*.075+Math.sin(v)*.045;
      if(!GRAPHICS_PROFILES[this.quality].waterNormals) continue;
      let dA=Math.cos(u)*.075*.75+Math.cos(v)*.045*.4,dS=Math.cos(u)*.075*.4+Math.cos(v)*.045*.9;
      if(local) {
        dA+=(this.simulator.sampleHeight(across+eps,s)-this.simulator.sampleHeight(across-eps,s))/(2*eps);
        dS+=(this.simulator.sampleHeight(across,s+eps)-this.simulator.sampleHeight(across,s-eps))/(2*eps);
      }
      const sx=side.getX(i),sz=side.getZ(i),fx=forward.getX(i),fz=forward.getZ(i),fy=forward.getY(i)+dS;
      const nx=dA*fz-sz*fy,ny=sz*fx-sx*fz,nz=sx*fy-dA*fx,length=Math.hypot(nx,ny,nz)||1;
      normals[i*3]=nx/length;normals[i*3+1]=ny/length;normals[i*3+2]=nz/length;
    }
    pos.needsUpdate=true;norm.needsUpdate=GRAPHICS_PROFILES[this.quality].waterNormals;this.geometryTime=time;
  }

  update(time:number):void {
    if(time===this.time) return;
    if(time<this.time) this.simulator.reset();
    this.simulator.step(Math.max(0,time-this.time));this.time=time;
    if(Math.abs(time-this.geometryTime)>=1/GRAPHICS_PROFILES[this.quality].waterVisualHz) this.deform(time);
  }

  setQuality(quality:GraphicsQuality):void {if(this.quality===quality) return;this.quality=quality;this.deform(this.time);}

  reset():void {this.simulator.reset();this.time=0;this.deform(0);}
  dispose():void {this.geometry=undefined;this.baseY=undefined;}
}
