import type { LevelData } from "./LevelTypes";
import {stageStorage as localStorage} from '../storage/StageStorage';
import {getRegisteredStage as getBakedStage,loadWorldStages,stageMetadata} from './StageRegistry';
import { applyRequestedStageUpdates } from "./RequestedStageUpdates";
import {applyCollectibleBalance} from './CollectibleBalance';

export class LevelLoader {
  /**
   * Loads a stage either by fetching local JSON, baked stages, or generating it deterministically.
   */
  async loadStage(world: number, level: number, stage: number): Promise<LevelData> {
    await loadWorldStages(world);
    const baked = getBakedStage(world, level, stage);

    // 1. Check if custom override exists in localStorage (active development mode)
    const customKey = `custom_stage_${world}_${level}_${stage}`;
    const customJson = localStorage.getItem(customKey);
    if (customJson) {
      try {
        const parsed = JSON.parse(customJson);
        this.validate(parsed);

        // If explicitly saved or customized by the user in the 3D editor, ALWAYS preserve and return it
        const hasCustomObjects = Array.isArray(parsed.objects) && parsed.objects.some((o: any) => o.id?.startsWith("obj-custom"));
        if (parsed.customSaved || parsed.properties?.userSaved || hasCustomObjects) {
          return applyRequestedStageUpdates(parsed as LevelData, world, level, stage);
        }
        if ((world === 5 && level<=4 || world===6&&level<=4) && baked) return applyRequestedStageUpdates(structuredClone(baked),world,level,stage);

        // If baked stage exists (such as M1-N2-E1 Bus or M1-N1 decorated stages) and the saved custom level is an obsolete draft
        if (baked && world === 1 && level === 2 && stage === 1) {
          const hasBus = Array.isArray(parsed.objects) && parsed.objects.some((o: any) => o.id?.startsWith("bus-"));
          if (!hasBus) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            return baked;
          }
        }
        if (baked && world === 1 && level === 2 && stage === 6) {
          const hasMovingGates = Array.isArray(parsed.objects) && parsed.objects.some((o: any) => o.id?.startsWith("s6-gate") && o.type === "moving-platform");
          if (!hasMovingGates) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            return baked;
          }
        }
        if (baked && world === 1 && level === 2 && stage === 9) {
          const hasTeleferico = Array.isArray(parsed.objects) && parsed.objects.some((o: any) => o.properties?.variant === "teleferico" && o.type === "moving-platform");
          if (!hasTeleferico) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            return baked;
          }
        }
        if (baked && world === 3 && level === 4 && stage === 8) {
          const hasTiltingRamp =
            Array.isArray(parsed.objects) &&
            parsed.objects.some(
              (o: any) =>
                o.id === "w3s38-mega-slope" &&
                o.properties?.movementType === "tilt_x" &&
                Number(o.properties?.maxAngle) > 0
            );
          if (!hasTiltingRamp) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            return baked;
          }
        }
        if (baked && world === 3 && level === 4 && stage === 9) {
          const hasPitchBlack = Boolean(parsed.properties?.pitchBlack);
          if (!hasPitchBlack) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            return baked;
          }
        }
        if (baked && world === 4 && (level === 1 || level === 2)) {
          const hasW4Objects = Array.isArray(parsed.objects) && parsed.objects.some((o: any) => o.id?.startsWith("w4s"));
          if (!hasW4Objects) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            return baked;
          }
        }
        if (baked && (world === 1 || world === 2 || world === 3 || world === 4) && parsed.name !== "Custom Stage Test" && !parsed.customSaved && !parsed.properties?.userSaved) {
          if (parsed.name !== baked.name) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            return baked;
          }
        }
        return applyRequestedStageUpdates(parsed as LevelData, world, level, stage);
      } catch {
        // Fallback
      }
    }

    // 2. Check if a finalized stage is baked into the code for the final game
    if (baked) {
      return applyRequestedStageUpdates(JSON.parse(JSON.stringify(baked)) as LevelData, world, level, stage);
    }

    // 3. Fallback to procedurally generated stage
    const {LevelGenerator}=await import('./LevelGenerator');
    return applyRequestedStageUpdates(LevelGenerator.generateStage(world, level, stage), world, level, stage);
  }

  loadFromJSON(jsonString: string): LevelData {
    const data = JSON.parse(jsonString);
    this.validate(data);
    return data as LevelData;
  }

  async load(path: string): Promise<LevelData> {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Unable to load level: ${path}`);
    }
    const data = await response.json();
    this.validate(data);
    return data as LevelData;
  }

  private validate(data: unknown): void {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid level data.");
    }

    const level = data as Partial<LevelData>;

    if (
      typeof level.id !== "string" ||
      !Array.isArray(level.objects) ||
      typeof level.timeLimit !== "number"
    ) {
      throw new Error("Malformed level data.");
    }
  }

  /**
   * Retrieves the number of collectible items in a given stage,
   * checking user-customized stages first (e.g. from 3D Level Editor), then baked stages, then generated.
   */
  static getStageCollectiblesCount(world: number, level: number, stage: number): number {
    const baked = getBakedStage(world, level, stage);
    if(!baked&&stageMetadata(world,level,stage))return stageMetadata(world,level,stage)!.count;
    try {
      if (typeof localStorage !== "undefined") {
        const customKey = `custom_stage_${world}_${level}_${stage}`;
        const customJson = localStorage.getItem(customKey);
        if (customJson) {
          const parsed = JSON.parse(customJson);
          if (Array.isArray(parsed?.objects)) {
            if((world>=1&&world<=6&&level>=1&&level<=4)||(world===7&&level<=4)||(world===8&&(level>=1&&level<=4))) {
              return applyCollectibleBalance(parsed as LevelData,world,level,stage).objects.filter(o=>o.type==='collectible').length;
            }
            if(world===5 && (level===2 || level===3 || level===4) || world===6&&level<=3) {
              const updated=applyRequestedStageUpdates(parsed as LevelData,world,level,stage);
              return updated.objects.filter(object=>object.type==="collectible").length;
            }
            if (world === 5 && (level === 1 || level === 2) && baked && !parsed.customSaved && !parsed.properties?.userSaved &&
                !parsed.objects.some((object: { id?: string }) => object.id?.startsWith("obj-custom"))) {
              return baked.objects.filter(object => object.type === "collectible").length;
            }
            if (baked && world === 1 && level === 2 && stage === 1) {
              const hasBus = parsed.objects.some((o: any) => o.id?.startsWith("bus-"));
              if (!hasBus) {
                return baked.objects.filter(o => o && o.type === "collectible").length;
              }
            }
            if (baked && world === 1 && level === 2 && stage === 6) {
              const hasMovingGates = Array.isArray(parsed.objects) && parsed.objects.some((o: any) => o.id?.startsWith("s6-gate") && o.type === "moving-platform");
              if (!hasMovingGates) {
                return baked.objects.filter(o => o && o.type === "collectible").length;
              }
            }
            if (baked && world === 1 && level === 2 && stage === 9) {
              const hasTeleferico = Array.isArray(parsed.objects) && parsed.objects.some((o: any) => o.properties?.variant === "teleferico" && o.type === "moving-platform");
              if (!hasTeleferico) {
                return baked.objects.filter(o => o && o.type === "collectible").length;
              }
            }
        if (baked && world === 1 && (level === 1 || level === 2 || level === 3) && parsed.name !== "Custom Stage Test") {
              if (parsed.name !== baked.name) {
                return baked.objects.filter(o => o && o.type === "collectible").length;
              }
            }
            return parsed.objects.filter((o: any) => o && o.type === "collectible").length;
          }
        }
      }
    } catch {
      // Fallback
    }

    if (baked && Array.isArray(baked.objects)) {
      return baked.objects.filter(o => o && o.type === "collectible").length;
    }

    return stageMetadata(world,level,stage)?.count??0;
  }

  /**
   * Retrieves the total sum of collectible items across all 10 stages of a level.
   */
  static getLevelMaxCollectibles(world: number, level: number): number {
    let total = 0;
    for (let s = 1; s <= 10; s++) {
      total += LevelLoader.getStageCollectiblesCount(world, level, s);
    }
    return total;
  }
}




