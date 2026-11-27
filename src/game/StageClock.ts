import limits from "../levels/StageTimeLimits.json";
import type { LevelData } from "../levels/LevelTypes";

/** Explicit per-stage seconds. Custom editor stages can override with bombTimeLimit. */
export function stageTimeLimit(data: LevelData): number {
  const override = Number(data.properties?.bombTimeLimit);
  if (Number.isFinite(override) && override >= 10) return override;
  const entry = (limits as Record<string,{seconds:number}>)[`${data.world}_${data.level}_${data.stage}`];
  return entry?.seconds ?? Math.max(60, Number(data.timeLimit) || 60);
}

/** Expiry wins before goal/collectible checks; presentation uses simulation time, so pause is safe. */
export class StageClock {
  elapsed = 0;
  private expiredFor: number | null = null;
  private lastWarningSecond=11;
  constructor(public readonly limit: number) {}
  get expired(): boolean { return this.expiredFor !== null; }
  get remaining(): number { return Math.max(0, this.limit-this.elapsed); }
  reset():void {this.elapsed=0;this.expiredFor=null;this.lastWarningSecond=11;}
  takeWarningSecond():number|null {
    const second=Math.ceil(this.remaining);
    if(this.expired||second<1||second>10||second>=this.lastWarningSecond)return null;
    this.lastWarningSecond=second;return second;
  }
  tick(delta:number): "running"|"expired"|"restart" {
    if (this.expiredFor !== null) {this.expiredFor+=Math.max(0,delta);return this.expiredFor>=1?"restart":"expired";}
    this.elapsed=Math.min(this.limit,this.elapsed+Math.max(0,delta));
    if(this.elapsed>=this.limit){this.expiredFor=0;return "expired";}
    return "running";
  }
}
