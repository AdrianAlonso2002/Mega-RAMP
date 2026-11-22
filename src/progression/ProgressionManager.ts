import {validateProgress,readProgressBackup} from './ProgressBackup';
import type { GameProgress, StageProgress, LevelRecord, SkinReward } from "./ProgressionData";
import { LevelLoader } from "../levels/LevelLoader";
import {getCharacterSkin, CHARACTER_SKINS} from '../player/CharacterSkins';
import {stageMetadata} from '../levels/StageRegistry';
const getCollectibleBudget=(w:number,l:number,s:number)=>stageMetadata(w,l,s)?.count;

const STORAGE_KEY = "monkey-ball-progress-v1";

export class ProgressionManager {
  private data: GameProgress;
  private readonly collectedIds=new Map<string,Set<string>>();
  private recoveryPayload?:string;
  private storageWarning='';
  getStorageWarning():string{return this.storageWarning;}

  constructor() {
    this.data = this.load();
  }

  private createDefault(): GameProgress {
    return {
      selectedCharacter: "rony",
      worlds: {
        "1": {
          "1": {
            "1": {
              completed: false,
              bestTime: null,
              collectibles: 0
            }
          }
        }
      },
      levelRecords: {}
    };
  }

  private load(): GameProgress {
    let raw:string|null=null;
    try {
      if(typeof localStorage==='undefined')return this.createDefault();
      raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return this.createDefault();
      }

      return validateProgress(JSON.parse(raw));
    } catch {
      this.recoveryPayload=raw??undefined;
      this.storageWarning=raw?'El guardado no se ha podido leer. Conservaremos una copia de recuperación antes de guardar de nuevo.':'El navegador no permite acceder a la partida guardada. Puedes exportar una copia desde Opciones.';
      return this.createDefault();
    }
  }

  save(): void {
    try {
      if(this.recoveryPayload){localStorage.setItem(STORAGE_KEY+'-recovery',this.recoveryPayload);this.recoveryPayload=undefined;}
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(this.data)
      );
    } catch {
      if(typeof window!=='undefined')window.dispatchEvent(new Event('mega-ramp-save-error'));
      // In-memory progress remains available for export.
    }
  }

  exportBackup():string{return JSON.stringify({format:'mega-ramp-progress',version:1,createdAt:new Date().toISOString(),progress:this.data},null,2);}
  importBackup(text:string):void{const next=readProgressBackup(text);localStorage.setItem(STORAGE_KEY,JSON.stringify(next));this.data=next;this.collectedIds.clear();}
  getSummary(){let completed=0,collectibles=0,time=0;for(const levels of Object.values(this.data.worlds))for(const stages of Object.values(levels))for(const stage of Object.values(stages)){if(stage.completed)completed++;collectibles+=stage.collectibles;time+=stage.bestTime??0;}return {completed,collectibles,time,characters:new Set(Object.values(this.data.levelRecords??{}).flatMap(r=>r.completedCharacters)).size};}
  getStage(
    world: number,
    level: number,
    stage: number
  ): StageProgress | null {
    return (
      this.data.worlds[world]?.[level]?.[stage] ??
      null
    );
  }

  completeStage(
    world: number,
    level: number,
    stage: number,
    time: number,
    collectibles: number
  ): void {
    if (!this.data.worlds[world]) {
      this.data.worlds[world] = {};
    }

    if (!this.data.worlds[world][level]) {
      this.data.worlds[world][level] = {};
    }

    const previous = this.data.worlds[world][level][stage];

    this.data.worlds[world][level][stage] = {
      ...previous,
      completed: true,
      bestTime:
        previous?.bestTime === null || previous?.bestTime === undefined
          ? time
          : Math.min(previous.bestTime, time),
      collectibles: Math.max(
        previous?.collectibles ?? 0,
        collectibles
      )
    };

    this.save();
  }

  isWorldUnlocked(world: number): boolean {
    if (world === 1) return true;
    return this.isWorldCompleted(world - 1);
  }

  isLevelUnlocked(world: number, level: number): boolean {
    if (!this.isWorldUnlocked(world)) return false;
    if (level === 1) return true;
    return this.isLevelCompleted(world, level - 1);
  }

  isStageUnlocked(
    world: number,
    level: number,
    stage: number
  ): boolean {
    if (world === 1 && level === 1 && stage === 1) {
      return true;
    }

    if (stage > 1) {
      return Boolean(
        this.getStage(world, level, stage - 1)?.completed
      );
    }

    if (level > 1) {
      return this.isLevelCompleted(world, level - 1);
    }

    return world > 1 ? this.isWorldCompleted(world - 1) : false;
  }

  isLevelCompleted(
    world: number,
    level: number
  ): boolean {
    for (let stage = 1; stage <= 10; stage++) {
      if (!this.getStage(world, level, stage)?.completed) {
        return false;
      }
    }

    return true;
  }

  isWorldCompleted(world: number): boolean {
    for (let level = 1; level <= 4; level++) {
      if (!this.isLevelCompleted(world, level)) {
        return false;
      }
    }

    return true;
  }

  getWorldCompletedCount(world: number): number {
    let count = 0;
    for (let level = 1; level <= 4; level++) {
      for (let stage = 1; stage <= 10; stage++) {
        if (this.getStage(world, level, stage)?.completed) {
          count++;
        }
      }
    }
    return count;
  }

  getSelectedCharacter(): string {
    return this.data.selectedCharacter ?? "rony";
  }

  getSelectedSkin(charId: string): string {
    const skin=getCharacterSkin(charId, this.data.characterSkins?.[charId]);
    return this.isSkinUnlocked(charId,skin.id)?skin.id:'normal';
  }

  isSkinUnlocked(charId:string,skinId:string):boolean {
    const skin=Object.hasOwn(CHARACTER_SKINS,charId)?CHARACTER_SKINS[charId].find(form=>form.id===skinId):undefined;
    if(!skin)return false;
    if(!skin.unlock)return true;
    const progress=this.getWorldCollectionProgress(skin.unlock.world);
    return progress.collected>=Math.ceil(progress.total*skin.unlock.percent/100);
  }

  getWorldCollectionProgress(world:number):{collected:number;total:number} {
    let collected=0,total=0;
    for(let level=1;level<=4;level++)for(let stage=1;stage<=10;stage++){
      const max=getCollectibleBudget(world,level,stage)??10;
      const saved=this.getStage(world,level,stage),count=saved?.collectibles??0;
      collected+=Math.min(max,Math.max(0,Number.isFinite(count)?Math.floor(count):0,saved?.collectedIds?.length??0));total+=max;
    }
    return {collected,total};
  }

  /** The level-clear screen announces earned rewards once, including rewards earned on earlier retries. */
  getUnannouncedSkinRewards(world:number):SkinReward[] {
    const announced=new Set(this.data.announcedSkinRewards??[]),rewards:SkinReward[]=[];
    for(const [characterId,skins] of Object.entries(CHARACTER_SKINS))for(const skin of skins){
      if(skin.unlock?.world===world&&!announced.has(`${characterId}:${skin.id}`)&&this.isSkinUnlocked(characterId,skin.id))rewards.push({characterId,skinId:skin.id});
    }
    return rewards;
  }

  markSkinRewardsAnnounced(rewards:readonly SkinReward[]):void {
    const announced=new Set(this.data.announcedSkinRewards??[]);const before=announced.size;
    for(const reward of rewards)if(getCharacterSkin(reward.characterId,reward.skinId).id===reward.skinId&&this.isSkinUnlocked(reward.characterId,reward.skinId))announced.add(`${reward.characterId}:${reward.skinId}`);
    if(announced.size!==before){this.data.announcedSkinRewards=[...announced];this.save();}
  }

  /** A repeated pickup still earns normal run rewards, but never counts twice towards a skin. */
  recordCollectedItem(world:number,level:number,stage:number,id:string):void {
    if(world<1||world>8||level<1||level>4||stage<1||stage>10||!id)return;
    const key=`${world}_${level}_${stage}`,previous=this.getStage(world,level,stage);
    let ids=this.collectedIds.get(key);
    if(!ids){ids=new Set(previous?.collectedIds??[]);this.collectedIds.set(key,ids);}
    const max=getCollectibleBudget(world,level,stage)??10;
    if(ids.has(id)||ids.size>=max)return;
    ids.add(id);
    this.data.worlds[world]??={};this.data.worlds[world][level]??={};
    this.data.worlds[world][level][stage]={
      completed:previous?.completed??false,bestTime:previous?.bestTime??null,
      // Legacy saves contain counts without identities: retain their best count, never add it twice.
      collectibles:Math.min(max,Math.max(previous?.collectibles??0,ids.size)),collectedIds:[...ids]
    };
    this.save();
  }

  setSelectedSkin(charId: string, skinId: string): void {
    if (!Object.hasOwn(CHARACTER_SKINS, charId)) return;
    const skin=getCharacterSkin(charId,skinId);
    if(!this.isSkinUnlocked(charId,skin.id))return;
    this.data.characterSkins ??= {};
    this.data.characterSkins[charId] = skin.id;
    this.save();
  }

  setSelectedCharacter(charId: string): void {
    this.data.selectedCharacter = charId;
    this.save();
  }

  markAllNodesSeen(): void {
    const all: string[] = [];
    for (let w = 1; w <= 8; w++) {
      all.push(`w${w}`);
      for (let l = 1; l <= 4; l++) {
        all.push(`w${w}-l${l}`);
      }
    }
    this.seenNodesMemory = all;
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("mega-ramp-seen-nodes", JSON.stringify(all));
      }
    } catch {
      // ignore
    }
  }

  unlockAll(): void {
    this.collectedIds.clear();
    for (let w = 1; w <= 8; w++) {
      if (!this.data.worlds[w]) this.data.worlds[w] = {};
      for (let l = 1; l <= 4; l++) {
        if (!this.data.worlds[w][l]) this.data.worlds[w][l] = {};
        for (let s = 1; s <= 10; s++) {
          this.data.worlds[w][l][s] = {
            completed: true,
            bestTime: 30.0,
            collectibles: 10
          };
        }
      }
    }
    this.save();
    this.markAllNodesSeen();
  }

  isAllUnlocked(): boolean {
    for (let w = 1; w <= 8; w++) {
      if (!this.isWorldUnlocked(w) || !this.isWorldCompleted(w)) {
        return false;
      }
    }
    return true;
  }

  resetToDefaultProgression(): void {
    this.collectedIds.clear();
    this.data = this.createDefault();
    this.save();
    this.resetSeenNodes();
  }

  recordLevelCompletion(
    world: number,
    level: number,
    time: number,
    collectibles: number,
    characterId: string
  ): void {
    if (!this.data.levelRecords) {
      this.data.levelRecords = {};
    }
    const key = `${world}-${level}`;
    const prev = this.data.levelRecords[key] || {
      completed: false,
      bestTime: null,
      totalCollectibles: 0,
      completedCharacters: [],
      clearCount: 0
    };

    const newCharacters = prev.completedCharacters.includes(characterId)
      ? prev.completedCharacters
      : [...prev.completedCharacters, characterId];

    this.data.levelRecords[key] = {
      completed: true,
      bestTime: prev.bestTime === null ? time : Math.min(prev.bestTime, time),
      totalCollectibles: Math.max(prev.totalCollectibles, collectibles),
      completedCharacters: newCharacters,
      clearCount: (prev.clearCount || 0) + 1
    };

    this.save();
  }

  completeLevel(
    world: number,
    level: number,
    time = 42.5,
    collectibles?: number,
    characterId = "rony"
  ): void {
    if (!this.data.worlds[world]) {
      this.data.worlds[world] = {};
    }
    if (!this.data.worlds[world][level]) {
      this.data.worlds[world][level] = {};
    }
    for (let s = 1; s <= 10; s++) {
      const prevCol = this.data.worlds[world][level][s]?.collectibles ?? 0;
      const stageMax = this.getStageMaxCollectibles(world, level, s);
      const stageCol = collectibles !== undefined ? Math.ceil(collectibles / 10) : Math.max(prevCol, stageMax);
      this.completeStage(world, level, s, time / 10, stageCol);
    }
    const totalCol = this.getLevelTotalCollectibles(world, level);
    this.recordLevelCompletion(world, level, time, totalCol, characterId);
  }

  /**
   * Returns the maximum collectible count for a specific stage,
   * detecting custom user modifications from the 3D level editor dynamically.
   */
  getStageMaxCollectibles(world: number, level: number, stage: number): number {
    return LevelLoader.getStageCollectiblesCount(world, level, stage);
  }

  /**
   * Returns the maximum collectible count for a level across all 10 stages,
   * detecting custom user modifications from the 3D level editor dynamically.
   */
  getLevelMaxCollectibles(world: number, level: number): number {
    return LevelLoader.getLevelMaxCollectibles(world, level);
  }

  /**
   * Calculates the total sum of stage times for all stages in a level (sum of stages 1 to 10).
   */
  getLevelTotalTime(world: number, level: number): number {
    let total = 0;
    const stages = this.data.worlds[world]?.[level];
    if (stages) {
      for (let s = 1; s <= 10; s++) {
        const bTime = stages[s]?.bestTime;
        if (typeof bTime === "number") {
          total += bTime;
        }
      }
    }
    return total;
  }

  /**
   * Calculates the total sum of collectibles across all stages in a level (sum of stages 1 to 10).
   */
  getLevelTotalCollectibles(world: number, level: number): number {
    let total = 0;
    const stages = this.data.worlds[world]?.[level];
    if (stages) {
      for (let s = 1; s <= 10; s++) {
        const col = stages[s]?.collectibles;
        if (typeof col === "number") {
          total += col;
        }
      }
    }
    return total;
  }

  getLevelRecord(world: number, level: number): LevelRecord {
    const key = `${world}-${level}`;
    const record = this.data.levelRecords?.[key];
    const isCompleted = this.isLevelCompleted(world, level);

    if (record) {
      return {
        ...record,
        completed: true,
        bestTime: record.bestTime,
        totalCollectibles: record.totalCollectibles,
        completedCharacters: record.completedCharacters || [],
        clearCount: record.clearCount || 1
      };
    }

    if (isCompleted) {
      const sumTime = this.getLevelTotalTime(world, level);
      const sumCollectibles = this.getLevelTotalCollectibles(world, level);
      return {
        completed: true,
        bestTime: sumTime > 0 ? sumTime : null,
        totalCollectibles: sumCollectibles,
        completedCharacters: [],
        clearCount: 1
      };
    }

    return {
      completed: false,
      bestTime: null,
      totalCollectibles: 0,
      completedCharacters: [],
      clearCount: 0
    };
  }

  private seenNodesMemory: string[] = ["w1", "w1-l1"];

  getSeenNodes(): string[] {
    if (this.isAllUnlocked()) {
      const all: string[] = [];
      for (let w = 1; w <= 8; w++) {
        all.push(`w${w}`);
        for (let l = 1; l <= 4; l++) {
          all.push(`w${w}-l${l}`);
        }
      }
      return all;
    }
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem("mega-ramp-seen-nodes");
        if (raw) return JSON.parse(raw) as string[];
      }
      return this.seenNodesMemory;
    } catch {
      return this.seenNodesMemory;
    }
  }

  markNodeSeen(nodeId: string): void {
    try {
      const seen = this.getSeenNodes();
      if (!seen.includes(nodeId)) {
        seen.push(nodeId);
        this.seenNodesMemory = [...seen];
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("mega-ramp-seen-nodes", JSON.stringify(seen));
        }
      }
    } catch {
      if (!this.seenNodesMemory.includes(nodeId)) {
        this.seenNodesMemory.push(nodeId);
      }
    }
  }

  resetSeenNodes(): void {
    this.seenNodesMemory = ["w1", "w1-l1"];
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("mega-ramp-seen-nodes", JSON.stringify(["w1", "w1-l1"]));
      }
    } catch {
      // ignore
    }
  }

  isMapAnimated(): boolean {
    return true;
  }

  setMapAnimated(_animated: boolean): void {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("mega-ramp-map-animated", "true");
      }
    } catch {
      // ignore
    }
  }

  private showFPSMemory = false;
  private showSpeedMemory = false;
  private fpsLimitMemory: "60" | "30" = "60";

  isShowSpeed():boolean {
    try {
      if(typeof localStorage!=="undefined") {
        const value=localStorage.getItem("mega-ramp-show-speed");
        if(value!==null) return value==="true";
      }
    } catch { /* Use the session preference if storage is unavailable. */ }
    return this.showSpeedMemory;
  }

  setShowSpeed(show:boolean):void {
    this.showSpeedMemory=show;
    try {
      if(typeof localStorage!=="undefined") localStorage.setItem("mega-ramp-show-speed",show ? "true" : "false");
    } catch { /* The preference remains available for this session. */ }
  }

  isShowFPS(): boolean {
    try {
      if (typeof localStorage !== "undefined") {
        const val = localStorage.getItem("mega-ramp-show-fps");
        if (val !== null) return val === "true";
      }
      return this.showFPSMemory;
    } catch {
      return this.showFPSMemory;
    }
  }

  setShowFPS(show: boolean): void {
    this.showFPSMemory = show;
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("mega-ramp-show-fps", show ? "true" : "false");
      }
    } catch {
      // ignore
    }
  }

  getFPSLimit(): "60" | "30" {
    try {
      if (typeof localStorage !== "undefined") {
        const val = localStorage.getItem("mega-ramp-fps-limit");
        if (val === "60" || val === "30") {
          return val;
        }
      }
      return this.fpsLimitMemory;
    } catch {
      return this.fpsLimitMemory;
    }
  }

  setFPSLimit(limit: "60" | "30"): void {
    this.fpsLimitMemory = limit;
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("mega-ramp-fps-limit", limit);
      }
    } catch {
      // ignore
    }
  }

  private graphicsQualityMemory: "low" | "medium" | "high" = "medium";
  private cameraModeMemory:1|2=1;
  getCameraMode():1|2 {
    try {
      const value=localStorage.getItem('mega-ramp-camera-mode-v2');if(value==='1'||value==='2')return value==='1'?1:2;
      const previous=localStorage.getItem('mega-ramp-camera-mode');return previous==='2'?1:previous==='1'?2:this.cameraModeMemory;
    }catch{return this.cameraModeMemory;}
  }
  setCameraMode(mode:1|2):void {
    this.cameraModeMemory=mode===2?2:1;
    try{localStorage.setItem('mega-ramp-camera-mode-v2',String(this.cameraModeMemory));}catch{/* Keep the selection when browser storage is full. */}
  }

  getGraphicsQuality(): "low" | "medium" | "high" {
    try {
      if (typeof localStorage !== "undefined") {
        const val = localStorage.getItem("mega-ramp-graphics-quality");
        if (val === "low" || val === "medium" || val === "high") {
          return val;
        }
      }
      return this.graphicsQualityMemory;
    } catch {
      return this.graphicsQualityMemory;
    }
  }

  setGraphicsQuality(quality: "low" | "medium" | "high"): void {
    this.graphicsQualityMemory = quality;
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("mega-ramp-graphics-quality", quality);
      }
    } catch {
      // ignore
    }
  }
}


