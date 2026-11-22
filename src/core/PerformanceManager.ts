import type { Renderer } from "../rendering/Renderer";
/** Resolution reacts to sustained frame pressure, relative to the player's chosen cap. */
export class PerformanceManager {
  private accumulator = 0;
  private frames = 0;
  private fps = 60;
  private pressure = 0;
  private headroom = 0;
  private target = 60;
  constructor(private readonly renderer: Renderer) {}
  update(delta: number, limit: string = "60", active = true): void {
    const target = limit === "30" ? 30 : 60;
    if (target !== this.target || !active) {
      this.target = target;
      this.accumulator = 0;
      this.frames = 0;
      this.pressure = 0;
      this.headroom = 0;
      if (!active) return;
    }
    this.accumulator += delta;
    this.frames++;
    if (this.accumulator < 1) return;
    this.fps = this.frames / this.accumulator;
    this.accumulator = 0;
    this.frames = 0;
    this.pressure = this.fps < target * 0.8 ? this.pressure + 1 : 0;
    this.headroom = this.fps > target * 0.94 ? this.headroom + 1 : 0;
    if (this.pressure >= 2) {
      this.renderer.setResolutionScale(
        this.renderer.getResolutionScale() - 0.08,
      );
      this.pressure = 0;
      this.headroom = 0;
    }
    if (this.headroom >= 8) {
      this.renderer.setResolutionScale(
        this.renderer.getResolutionScale() + 0.04,
      );
      this.headroom = 0;
    }
  }
  getFPS(): number {
    return this.fps;
  }
}
