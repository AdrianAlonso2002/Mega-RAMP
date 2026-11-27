import type {ProgressionManager} from '../progression/ProgressionManager';
/** Ordered progression, independent of the last world browsed or debug unlocks. */
export function pendingMapLevel(progress:Pick<ProgressionManager,'isLevelCompleted'>):{world:number;level:number}|null {
  for(let world=1;world<=8;world++)for(let level=1;level<=4;level++)if(!progress.isLevelCompleted(world,level))return {world,level};
  return null;
}
