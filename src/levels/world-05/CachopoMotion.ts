import * as THREE from "three";
import type { LevelData } from "../LevelTypes";

export function isCachopoStage(data: Pick<LevelData, "world" | "level" | "stage">): boolean {
  return data.world === 5 && data.level === 1 && data.stage === 10;
}

const smooth = (t: number) => { const u = Math.max(0, Math.min(1, t)); return u*u*u*(u*(u*6-15)+10); };
/** Begin level; four-second half-travel, three seconds at each extreme. */
export function cachopoAngle(time: number): number {
  if (time < 4) return .2 * smooth(time / 4);
  const phase = (time - 4) % 22;
  if (phase < 3) return .2;
  if (phase < 11) return .2 - .4 * smooth((phase - 3) / 8);
  if (phase < 14) return -.2;
  return -.2 + .4 * smooth((phase - 14) / 8);
}

export function cachopoPivot(data: LevelData): THREE.Vector3 {
  const plate = data.objects.find(o => o.properties?.subType === "asturias_plate");
  return new THREE.Vector3().copy(plate?.position ?? {x:0,y:-1.6,z:-25.8});
}

/** Rotate world-authored children about the plate centre without changing their saved coordinates. */
export function poseCachopo(root: THREE.Object3D, pivot: THREE.Vector3, time: number): void {
  root.rotation.set(0,0,cachopoAngle(time));
  root.position.copy(pivot).applyQuaternion(root.quaternion).multiplyScalar(-1).add(pivot);
  root.updateMatrixWorld(true);
}
