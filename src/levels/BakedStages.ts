import {WORLD_08_LEVEL_04_STAGES} from './world-08/level-04-stages';
import {WORLD_08_LEVEL_03_STAGES} from './world-08/level-03-stages';
import {WORLD_08_LEVEL_02_STAGES} from './world-08/level-02-stages';
import {WORLD_08_LEVEL_01_STAGES} from './world-08/level-01-stages';
import {WORLD_07_LEVEL_04_STAGES} from './world-07/level-04-stages';
import type { LevelData } from "./LevelTypes";
import {applyCollectibleBalance} from './CollectibleBalance';
import { WORLD_01_LEVEL_01_STAGES } from "./world-01/level-01-stages";
import { WORLD_01_LEVEL_02_STAGES } from "./world-01/level-02-stages";
import { WORLD_01_LEVEL_03_STAGES } from "./world-01/level-03-stages";
import { WORLD_01_LEVEL_04_STAGES } from "./world-01/level-04-stages";
import { WORLD_02_LEVEL_01_STAGES } from "./world-02/level-01-stages";
import { WORLD_02_LEVEL_02_STAGES } from "./world-02/level-02-stages";
import { WORLD_02_LEVEL_03_STAGES } from "./world-02/level-03-stages";
import { WORLD_02_LEVEL_04_STAGES } from "./world-02/level-04-stages";
import { WORLD_03_LEVEL_01_STAGES } from "./world-03/level-01-stages";
import { WORLD_03_LEVEL_02_STAGES } from "./world-03/level-02-stages";
import { WORLD_03_LEVEL_03_STAGES } from "./world-03/level-03-stages";
import { WORLD_03_LEVEL_04_STAGES } from "./world-03/level-04-stages";
import { WORLD_04_LEVEL_01_STAGES } from "./world-04/level-01-stages";
import { WORLD_04_LEVEL_02_STAGES } from "./world-04/level-02-stages";
import { WORLD_04_LEVEL_03_STAGES } from "./world-04/level-03-stages";
import { WORLD_04_LEVEL_04_STAGES } from "./world-04/level-04-stages";
import { WORLD_05_LEVEL_01_STAGES } from "./world-05/level-01-stages";
import { WORLD_05_LEVEL_02_STAGES } from "./world-05/level-02-stages";
import { WORLD_05_LEVEL_03_STAGES } from "./world-05/level-03-stages";
import { WORLD_05_LEVEL_04_STAGES } from "./world-05/level-04-stages";
import { WORLD_06_LEVEL_01_STAGES } from "./world-06/level-01-stages";
import { WORLD_06_LEVEL_02_STAGES } from "./world-06/level-02-stages";
import { WORLD_06_LEVEL_03_STAGES } from "./world-06/level-03-stages";
import {WORLD_06_LEVEL_04_STAGES} from './world-06/level-04-stages';
import {WORLD_07_LEVEL_01_STAGES} from './world-07/level-01-stages';
import {WORLD_07_LEVEL_02_STAGES} from './world-07/level-02-stages';
import {WORLD_07_LEVEL_03_STAGES} from './world-07/level-03-stages';

/**
 * Baked Custom Stages for the Final Production Game.
 * Levels created or modified with the 3D Editor can be registered here
 * so they are bundled permanently into the game for all players without needing LocalStorage or an editor.
 */
export const BAKED_STAGES: Record<string, LevelData> = {
  ...Object.fromEntries(Object.entries(WORLD_08_LEVEL_04_STAGES).map(([stage,data])=>[`8_4_${stage}`,data])),
  ...Object.fromEntries(Object.entries(WORLD_08_LEVEL_03_STAGES).map(([stage,data])=>[`8_3_${stage}`,data])), 
  ...Object.fromEntries(Object.entries(WORLD_08_LEVEL_02_STAGES).map(([stage,data])=>[`8_2_${stage}`,data])), 
  ...Object.fromEntries(Object.entries(WORLD_08_LEVEL_01_STAGES).map(([stage,data])=>[`8_1_${stage}`,data])), 
  "1_1_1": WORLD_01_LEVEL_01_STAGES[1],
  "1_1_2": WORLD_01_LEVEL_01_STAGES[2],
  "1_1_3": WORLD_01_LEVEL_01_STAGES[3],
  "1_1_4": WORLD_01_LEVEL_01_STAGES[4],
  "1_1_5": WORLD_01_LEVEL_01_STAGES[5],
  "1_1_6": WORLD_01_LEVEL_01_STAGES[6],
  "1_1_7": WORLD_01_LEVEL_01_STAGES[7],
  "1_1_8": WORLD_01_LEVEL_01_STAGES[8],
  "1_1_9": WORLD_01_LEVEL_01_STAGES[9],
  "1_1_10": WORLD_01_LEVEL_01_STAGES[10],
  "1_2_1": WORLD_01_LEVEL_02_STAGES[1],
  "1_2_2": WORLD_01_LEVEL_02_STAGES[2],
  "1_2_3": WORLD_01_LEVEL_02_STAGES[3],
  "1_2_4": WORLD_01_LEVEL_02_STAGES[4],
  "1_2_5": WORLD_01_LEVEL_02_STAGES[5],
  "1_2_6": WORLD_01_LEVEL_02_STAGES[6],
  "1_2_7": WORLD_01_LEVEL_02_STAGES[7],
  "1_2_8": WORLD_01_LEVEL_02_STAGES[8],
  "1_2_9": WORLD_01_LEVEL_02_STAGES[9],
  "1_2_10": WORLD_01_LEVEL_02_STAGES[10],
  "1_3_1": WORLD_01_LEVEL_03_STAGES[1],
  "1_3_2": WORLD_01_LEVEL_03_STAGES[2],
  "1_3_3": WORLD_01_LEVEL_03_STAGES[3],
  "1_3_4": WORLD_01_LEVEL_03_STAGES[4],
  "1_3_5": WORLD_01_LEVEL_03_STAGES[5],
  "1_3_6": WORLD_01_LEVEL_03_STAGES[6],
  "1_3_7": WORLD_01_LEVEL_03_STAGES[7],
  "1_3_8": WORLD_01_LEVEL_03_STAGES[8],
  "1_3_9": WORLD_01_LEVEL_03_STAGES[9],
  "1_3_10": WORLD_01_LEVEL_03_STAGES[10],
  "1_4_1": WORLD_01_LEVEL_04_STAGES[1],
  "1_4_2": WORLD_01_LEVEL_04_STAGES[2],
  "1_4_3": WORLD_01_LEVEL_04_STAGES[3],
  "1_4_4": WORLD_01_LEVEL_04_STAGES[4],
  "1_4_5": WORLD_01_LEVEL_04_STAGES[5],
  "1_4_6": WORLD_01_LEVEL_04_STAGES[6],
  "1_4_7": WORLD_01_LEVEL_04_STAGES[7],
  "1_4_8": WORLD_01_LEVEL_04_STAGES[8],
  "1_4_9": WORLD_01_LEVEL_04_STAGES[9],
  "1_4_10": WORLD_01_LEVEL_04_STAGES[10],
  "2_1_1": WORLD_02_LEVEL_01_STAGES[1],
  "2_1_2": WORLD_02_LEVEL_01_STAGES[2],
  "2_1_3": WORLD_02_LEVEL_01_STAGES[3],
  "2_1_4": WORLD_02_LEVEL_01_STAGES[4],
  "2_1_5": WORLD_02_LEVEL_01_STAGES[5],
  "2_1_6": WORLD_02_LEVEL_01_STAGES[6],
  "2_1_7": WORLD_02_LEVEL_01_STAGES[7],
  "2_1_8": WORLD_02_LEVEL_01_STAGES[8],
  "2_1_9": WORLD_02_LEVEL_01_STAGES[9],
  "2_1_10": WORLD_02_LEVEL_01_STAGES[10],
  "2_2_1": WORLD_02_LEVEL_02_STAGES[1],
  "2_2_2": WORLD_02_LEVEL_02_STAGES[2],
  "2_2_3": WORLD_02_LEVEL_02_STAGES[3],
  "2_2_4": WORLD_02_LEVEL_02_STAGES[4],
  "2_2_5": WORLD_02_LEVEL_02_STAGES[5],
  "2_2_6": WORLD_02_LEVEL_02_STAGES[6],
  "2_2_7": WORLD_02_LEVEL_02_STAGES[7],
  "2_2_8": WORLD_02_LEVEL_02_STAGES[8],
  "2_2_9": WORLD_02_LEVEL_02_STAGES[9],
  "2_2_10": WORLD_02_LEVEL_02_STAGES[10],
  "2_3_1": WORLD_02_LEVEL_03_STAGES[1],
  "2_3_2": WORLD_02_LEVEL_03_STAGES[2],
  "2_3_3": WORLD_02_LEVEL_03_STAGES[3],
  "2_3_4": WORLD_02_LEVEL_03_STAGES[4],
  "2_3_5": WORLD_02_LEVEL_03_STAGES[5],
  "2_3_6": WORLD_02_LEVEL_03_STAGES[6],
  "2_3_7": WORLD_02_LEVEL_03_STAGES[7],
  "2_3_8": WORLD_02_LEVEL_03_STAGES[8],
  "2_3_9": WORLD_02_LEVEL_03_STAGES[9],
  "2_3_10": WORLD_02_LEVEL_03_STAGES[10],
  "2_4_1": WORLD_02_LEVEL_04_STAGES[1],
  "2_4_2": WORLD_02_LEVEL_04_STAGES[2],
  "2_4_3": WORLD_02_LEVEL_04_STAGES[3],
  "2_4_4": WORLD_02_LEVEL_04_STAGES[4],
  "2_4_5": WORLD_02_LEVEL_04_STAGES[5],
  "2_4_6": WORLD_02_LEVEL_04_STAGES[6],
  "2_4_7": WORLD_02_LEVEL_04_STAGES[7],
  "2_4_8": WORLD_02_LEVEL_04_STAGES[8],
  "2_4_9": WORLD_02_LEVEL_04_STAGES[9],
  "2_4_10": WORLD_02_LEVEL_04_STAGES[10],
  "3_1_1": WORLD_03_LEVEL_01_STAGES[1],
  "3_1_2": WORLD_03_LEVEL_01_STAGES[2],
  "3_1_3": WORLD_03_LEVEL_01_STAGES[3],
  "3_1_4": WORLD_03_LEVEL_01_STAGES[4],
  "3_1_5": WORLD_03_LEVEL_01_STAGES[5],
  "3_1_6": WORLD_03_LEVEL_01_STAGES[6],
  "3_1_7": WORLD_03_LEVEL_01_STAGES[7],
  "3_1_8": WORLD_03_LEVEL_01_STAGES[8],
  "3_1_9": WORLD_03_LEVEL_01_STAGES[9],
  "3_1_10": WORLD_03_LEVEL_01_STAGES[10],
  "3_2_1": WORLD_03_LEVEL_02_STAGES[1],
  "3_2_2": WORLD_03_LEVEL_02_STAGES[2],
  "3_2_3": WORLD_03_LEVEL_02_STAGES[3],
  "3_2_4": WORLD_03_LEVEL_02_STAGES[4],
  "3_2_5": WORLD_03_LEVEL_02_STAGES[5],
  "3_2_6": WORLD_03_LEVEL_02_STAGES[6],
  "3_2_7": WORLD_03_LEVEL_02_STAGES[7],
  "3_2_8": WORLD_03_LEVEL_02_STAGES[8],
  "3_2_9": WORLD_03_LEVEL_02_STAGES[9],
  "3_2_10": WORLD_03_LEVEL_02_STAGES[10],
  "3_3_1": WORLD_03_LEVEL_03_STAGES[1],
  "3_3_2": WORLD_03_LEVEL_03_STAGES[2],
  "3_3_3": WORLD_03_LEVEL_03_STAGES[3],
  "3_3_4": WORLD_03_LEVEL_03_STAGES[4],
  "3_3_5": WORLD_03_LEVEL_03_STAGES[5],
  "3_3_6": WORLD_03_LEVEL_03_STAGES[6],
  "3_3_7": WORLD_03_LEVEL_03_STAGES[7],
  "3_3_8": WORLD_03_LEVEL_03_STAGES[8],
  "3_3_9": WORLD_03_LEVEL_03_STAGES[9],
  "3_3_10": WORLD_03_LEVEL_03_STAGES[10],
  "3_4_1": WORLD_03_LEVEL_04_STAGES[1],
  "3_4_2": WORLD_03_LEVEL_04_STAGES[2],
  "3_4_3": WORLD_03_LEVEL_04_STAGES[3],
  "3_4_4": WORLD_03_LEVEL_04_STAGES[4],
  "3_4_5": WORLD_03_LEVEL_04_STAGES[5],
  "3_4_6": WORLD_03_LEVEL_04_STAGES[6],
  "3_4_7": WORLD_03_LEVEL_04_STAGES[7],
  "3_4_8": WORLD_03_LEVEL_04_STAGES[8],
  "3_4_9": WORLD_03_LEVEL_04_STAGES[9],
  "3_4_10": WORLD_03_LEVEL_04_STAGES[10],
  "4_1_1": WORLD_04_LEVEL_01_STAGES[1],
  "4_1_2": WORLD_04_LEVEL_01_STAGES[2],
  "4_1_3": WORLD_04_LEVEL_01_STAGES[3],
  "4_1_4": WORLD_04_LEVEL_01_STAGES[4],
  "4_1_5": WORLD_04_LEVEL_01_STAGES[5],
  "4_1_6": WORLD_04_LEVEL_01_STAGES[6],
  "4_1_7": WORLD_04_LEVEL_01_STAGES[7],
  "4_1_8": WORLD_04_LEVEL_01_STAGES[8],
  "4_1_9": WORLD_04_LEVEL_01_STAGES[9],
  "4_1_10": WORLD_04_LEVEL_01_STAGES[10],
  "4_2_1": WORLD_04_LEVEL_02_STAGES[1],
  "4_2_2": WORLD_04_LEVEL_02_STAGES[2],
  "4_2_3": WORLD_04_LEVEL_02_STAGES[3],
  "4_2_4": WORLD_04_LEVEL_02_STAGES[4],
  "4_2_5": WORLD_04_LEVEL_02_STAGES[5],
  "4_2_6": WORLD_04_LEVEL_02_STAGES[6],
  "4_2_7": WORLD_04_LEVEL_02_STAGES[7],
  "4_2_8": WORLD_04_LEVEL_02_STAGES[8],
  "4_2_9": WORLD_04_LEVEL_02_STAGES[9],
  "4_2_10": WORLD_04_LEVEL_02_STAGES[10],
  "4_3_1": WORLD_04_LEVEL_03_STAGES[1],
  "4_3_2": WORLD_04_LEVEL_03_STAGES[2],
  "4_3_3": WORLD_04_LEVEL_03_STAGES[3],
  "4_3_4": WORLD_04_LEVEL_03_STAGES[4],
  "4_3_5": WORLD_04_LEVEL_03_STAGES[5],
  "4_3_6": WORLD_04_LEVEL_03_STAGES[6],
  "4_3_7": WORLD_04_LEVEL_03_STAGES[7],
  "4_3_8": WORLD_04_LEVEL_03_STAGES[8],
  "4_3_9": WORLD_04_LEVEL_03_STAGES[9],
  "4_3_10": WORLD_04_LEVEL_03_STAGES[10],
  "4_4_1": WORLD_04_LEVEL_04_STAGES[1],
  "4_4_2": WORLD_04_LEVEL_04_STAGES[2],
  "4_4_3": WORLD_04_LEVEL_04_STAGES[3],
  "4_4_4": WORLD_04_LEVEL_04_STAGES[4],
  "4_4_5": WORLD_04_LEVEL_04_STAGES[5],
  "4_4_6": WORLD_04_LEVEL_04_STAGES[6],
  "4_4_7": WORLD_04_LEVEL_04_STAGES[7],
  "4_4_8": WORLD_04_LEVEL_04_STAGES[8],
  "4_4_9": WORLD_04_LEVEL_04_STAGES[9],
  "4_4_10": WORLD_04_LEVEL_04_STAGES[10],
  "5_1_1": WORLD_05_LEVEL_01_STAGES[1],
  "5_1_2": WORLD_05_LEVEL_01_STAGES[2],
  "5_1_3": WORLD_05_LEVEL_01_STAGES[3],
  "5_1_4": WORLD_05_LEVEL_01_STAGES[4],
  "5_1_5": WORLD_05_LEVEL_01_STAGES[5],
  "5_1_6": WORLD_05_LEVEL_01_STAGES[6],
  "5_1_7": WORLD_05_LEVEL_01_STAGES[7],
  "5_1_8": WORLD_05_LEVEL_01_STAGES[8],
  "5_1_9": WORLD_05_LEVEL_01_STAGES[9],
  "5_1_10": WORLD_05_LEVEL_01_STAGES[10],
  "5_2_1": WORLD_05_LEVEL_02_STAGES[1],
  "5_2_2": WORLD_05_LEVEL_02_STAGES[2],
  "5_2_3": WORLD_05_LEVEL_02_STAGES[3],
  "5_2_4": WORLD_05_LEVEL_02_STAGES[4],
  "5_2_5": WORLD_05_LEVEL_02_STAGES[5],
  "5_2_6": WORLD_05_LEVEL_02_STAGES[6],
  "5_2_7": WORLD_05_LEVEL_02_STAGES[7],
  "5_2_8": WORLD_05_LEVEL_02_STAGES[8],
  "5_2_9": WORLD_05_LEVEL_02_STAGES[9],
  "5_2_10": WORLD_05_LEVEL_02_STAGES[10],
  ...Object.fromEntries(Object.entries(WORLD_05_LEVEL_03_STAGES).map(([stage,data])=>[`5_3_${stage}`,data])),
  ...Object.fromEntries(Object.entries(WORLD_05_LEVEL_04_STAGES).map(([stage,data])=>[`5_4_${stage}`,data])),
  ...Object.fromEntries(Object.entries(WORLD_06_LEVEL_01_STAGES).map(([stage,data])=>[`6_1_${stage}`,data])),
  ...Object.fromEntries(Object.entries(WORLD_06_LEVEL_02_STAGES).map(([stage,data])=>[`6_2_${stage}`,data])),
  ...Object.fromEntries(Object.entries(WORLD_06_LEVEL_03_STAGES).map(([stage,data])=>[`6_3_${stage}`,data])),
  ...Object.fromEntries(Object.entries(WORLD_06_LEVEL_04_STAGES).map(([stage,data])=>[`6_4_${stage}`,data])),
  ...Object.fromEntries(Object.entries(WORLD_07_LEVEL_01_STAGES).map(([stage,data])=>[`7_1_${stage}`,data])),
  ...Object.fromEntries(Object.entries(WORLD_07_LEVEL_02_STAGES).map(([stage,data])=>[`7_2_${stage}`,data])),
  ...Object.fromEntries(Object.entries(WORLD_07_LEVEL_04_STAGES).map(([stage,data])=>[`7_4_${stage}`,data])),
  ...Object.fromEntries(Object.entries(WORLD_07_LEVEL_03_STAGES).map(([stage,data])=>[`7_3_${stage}`,data]))
};

// Normalize the official objects once; direct stage references share the same layouts.
for(const data of Object.values(BAKED_STAGES))applyCollectibleBalance(data);

export function getBakedStage(world: number, level: number, stage: number): LevelData | null {
  const key = `${world}_${level}_${stage}`;
  return BAKED_STAGES[key] ?? null;
}



