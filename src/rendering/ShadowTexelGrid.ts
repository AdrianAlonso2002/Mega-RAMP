import * as THREE from 'three';

/** Keep directional shadow sampling anchored to world geometry as the camera moves.
 * Texels belong to the light's right/up plane, not the world's X/Z plane.
 * Reuses vectors; no scene traversal, extra shadow pass or larger texture.
 */
export class ShadowTexelGrid {
  private readonly right=new THREE.Vector3();
  private readonly up=new THREE.Vector3();
  private readonly back=new THREE.Vector3();
  private readonly worldUp=new THREE.Vector3(0,1,0);
  snap(focus:THREE.Vector3,lightOffset:THREE.Vector3,width:number,height:number,mapWidth:number,mapHeight:number):void {
    this.back.copy(lightOffset).normalize();
    if(this.back.lengthSq()<.5)return;
    // Match Three's lookAt basis, including its vertical-light degeneracy handling.
    this.right.crossVectors(this.worldUp,this.back);
    if(this.right.lengthSq()<1e-12){this.back.z+=.0001;this.back.normalize();this.right.crossVectors(this.worldUp,this.back);}
    this.right.normalize();this.up.crossVectors(this.back,this.right).normalize();
    const stepX=width/Math.max(1,mapWidth),stepY=height/Math.max(1,mapHeight),stepZ=Math.min(stepX,stepY);
    const x=Math.round(focus.dot(this.right)/stepX)*stepX;
    const y=Math.round(focus.dot(this.up)/stepY)*stepY;
    const z=Math.round(focus.dot(this.back)/stepZ)*stepZ;
    focus.copy(this.right).multiplyScalar(x).addScaledVector(this.up,y).addScaledVector(this.back,z);
  }
}
