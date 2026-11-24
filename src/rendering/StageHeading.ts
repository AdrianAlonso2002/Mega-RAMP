import type * as THREE from 'three';
import type {LevelData} from '../levels/LevelTypes';

/** Spawn direction is authored explicitly; moving the spawn never infers a new heading. */
export function stageStartYaw(data:LevelData,_solids:THREE.Object3D[]=[]):number {
  const yaw=data.properties?.spawnYaw;
  return typeof yaw==='number'&&Number.isFinite(yaw)?yaw:0;
}
