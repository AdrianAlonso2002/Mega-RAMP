import {bombFuse} from "./BombFuse";
import { SpriteTextures } from "../rendering/SpriteTextures";

export interface GoalBeamOrigin {
  left: { x: number; y: number };
  right: { x: number; y: number };
  center: { x: number; y: number };
}

export interface HUDCallbacks {
  onPause: () => void;
  onRestart?: () => void;
}

export class HUD {
  private readonly root: HTMLElement;
  private readonly livesEl: HTMLElement;
  private readonly itemsEl: HTMLElement;
  private readonly timeEl: HTMLElement;
  private readonly stageEl: HTMLElement;
  private readonly itemIconEl: HTMLElement;
  private readonly bannerEl: HTMLElement;
  private readonly teleportEl: HTMLElement;
  private readonly confettiCanvas: HTMLCanvasElement;
  private confettiCtx: CanvasRenderingContext2D | null = null;
  private confettiAnimId: number | null = null;
  private readonly fpsBadge: HTMLElement;
  private readonly metrics:HTMLElement;
  private readonly speedBadge:HTMLElement;
  private readonly speedValue:HTMLElement;
  private lastSpeed=-1;
  private readonly cannonPanel:HTMLElement;
  private cannonFire=false;
  private readonly underwaterOverlay: HTMLElement;
  private readonly pitchBlackOverlay: HTMLElement;
  private readonly bombTime:HTMLElement;
  private readonly fuse:SVGPathElement;
  private readonly timeoutCard:HTMLElement;
  private bombLimit=60;
  private lastBombTick=-1;
  private lastBombElapsed=-1;

  private bannerTimeout = 0;
  private teleportTimeout: number | null = null;

  constructor(container: HTMLElement, callbacks: HUDCallbacks) {
    this.metrics=document.createElement("div");
    this.metrics.className="hud-metrics";
    container.appendChild(this.metrics);
    this.fpsBadge = document.createElement("div");
    this.fpsBadge.className = "hud-fps-badge";
    this.fpsBadge.style.display = "none";
    this.fpsBadge.innerHTML = `<span data-fps-val>60</span><span style="font-size: 0.72em; opacity: 0.8; margin-left: 2px;">FPS</span>`;
    this.metrics.appendChild(this.fpsBadge);
    this.speedBadge=document.createElement("div");
    this.speedBadge.className="hud-speed-badge";
    this.speedBadge.style.display="none";
    this.speedBadge.setAttribute("aria-label","Velocidad en kilómetros por hora");
    this.speedBadge.innerHTML=`<span data-speed-val>0</span><span class="hud-metric-unit">km/h</span>`;
    this.speedValue=this.speedBadge.querySelector("[data-speed-val]")!;
    this.metrics.appendChild(this.speedBadge);

    this.root = document.createElement("div");
    this.root.className = "game-hud";

    this.root.innerHTML = `
      <canvas class="hud-confetti-canvas"></canvas>
      <div class="hud-underwater-overlay" data-underwater style="opacity: 0; pointer-events: none;"></div>
      <div class="hud-pitch-black-overlay" data-pitch-black style="opacity: 0; pointer-events: none;"></div>

      <div class="hud-teleport-overlay" data-teleport style="display: none;">
        <div class="teleport-hyperspace"></div>
        <div class="teleport-vortex"></div>
        <div class="teleport-shockwave"></div>
        <div class="teleport-shockwave shockwave-delay"></div>
        <div class="teleport-flash"></div>
      </div>

      <div class="hud-top-bar">
        <div class="hud-badge hud-lives">
          <span class="hud-icon">❤️</span>
          <span class="hud-val" data-lives>5</span>
        </div>

        <div class="hud-badge hud-items">
          <span class="hud-icon" data-item-icon>🥖</span>
          <span class="hud-val" data-collectibles>0/10</span>
        </div>

        <div class="hud-badge hud-stage">
          <span data-stage-badge>M1-N1-E1</span>
        </div>

        <div class="hud-badge hud-bomb" role="timer" aria-label="Tiempo restante">
          <svg viewBox="0 0 220 56" preserveAspectRatio="none" class="hud-fuse" aria-hidden="true"><path class="hud-fuse-ash" d="M194 6 H18 Q6 6 6 18 V38 Q6 50 18 50 H202 Q214 50 214 38 V18 Q214 6 202 6 H194"/><path data-fuse pathLength="1000" d="M194 6 H18 Q6 6 6 18 V38 Q6 50 18 50 H202 Q214 50 214 38 V18 Q214 6 202 6 H194"/></svg>
          <span class="hud-bomb-icon" aria-hidden="true">💣</span><span class="hud-val" data-bomb-time>01:00</span>
        </div>

        <div class="hud-actions">
          <button class="btn-hud" id="hud-btn-pause" title="Pausar">⏸️</button>
        </div>
      </div>

      <div class="hud-badge hud-time hud-elapsed" aria-label="Tiempo total de la etapa"><span aria-hidden="true">⏱️</span><span class="hud-val" data-time>00:00.00</span></div>
      <div class="hud-timeout" data-timeout hidden role="alert"><div>💣<strong>¡SE ACABÓ EL TIEMPO!</strong></div></div>

      <div class="hud-banner" data-banner style="display: none;"></div>
      <div class="hud-cannon-panel" data-cannon-panel hidden><span>Apunta con WASD, flechas o joystick · <b data-cannon-angle></b></span><button class="btn-hud" data-cannon-fire>Disparar · Espacio</button></div>
    `;

    container.appendChild(this.root);

    this.livesEl = this.root.querySelector("[data-lives]")!;
    this.itemsEl = this.root.querySelector("[data-collectibles]")!;
    this.timeEl = this.root.querySelector("[data-time]")!;
    this.bombTime=this.root.querySelector('[data-bomb-time]')!;
    this.fuse=this.root.querySelector('[data-fuse]')!;
    this.timeoutCard=this.root.querySelector('[data-timeout]')!;
    this.stageEl = this.root.querySelector("[data-stage-badge]")!;
    this.itemIconEl = this.root.querySelector("[data-item-icon]")!;
    this.bannerEl = this.root.querySelector("[data-banner]")!;
    this.cannonPanel=this.root.querySelector("[data-cannon-panel]")!;
    this.root.querySelector("[data-cannon-fire]")!.addEventListener("pointerdown",event=>{event.preventDefault();event.stopPropagation();this.cannonFire=true;});
    this.teleportEl = this.root.querySelector("[data-teleport]")!;
    this.underwaterOverlay = this.root.querySelector("[data-underwater]")!;
    this.pitchBlackOverlay = this.root.querySelector("[data-pitch-black]")!;
    this.confettiCanvas = this.root.querySelector(".hud-confetti-canvas")!;
    this.confettiCtx = this.confettiCanvas.getContext("2d");

    this.root.querySelector("#hud-btn-pause")?.addEventListener("click", () => {
      callbacks.onPause();
    });
  }

  setItemIcon(emoji: string, itemId?: string): void {
    if (itemId) {
      const cvs = SpriteTextures.getCollectibleCanvas(itemId, 24);
      cvs.style.cssText = "display: inline-block; vertical-align: middle; width: 22px; height: 22px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));";
      this.itemIconEl.innerHTML = "";
      this.itemIconEl.appendChild(cvs);
    } else {
      this.itemIconEl.textContent = emoji;
    }
  }

  private currentStageMax = 10;

  setBombLimit(seconds:number):void {this.bombLimit=seconds;this.lastBombTick=-1;this.lastBombElapsed=-1;this.hideTimeout();}
  showTimeout():void {this.timeoutCard.hidden=false;}
  hideTimeout():void {this.timeoutCard.hidden=true;}

  setStageInfo(world: number, level: number, stage: number, maxCollectibles = 10, stageName?: string): void {
    const stageCode = `M${world}-N${level}-E${stage}`;
    if (stageName) {
      this.stageEl.innerHTML = `<span class="hud-stage-code">${stageCode}</span><span class="hud-stage-sep">:</span><span class="hud-stage-name">${stageName}</span>`;
    } else {
      this.stageEl.innerHTML = `<span class="hud-stage-code">${stageCode}</span>`;
    }
    this.currentStageMax = maxCollectibles;
    this.itemsEl.textContent = `0/${maxCollectibles}`;
  }

  clearBanner(): void {
    clearTimeout(this.bannerTimeout);
    this.bannerEl.style.display = "none";
  }

  private mechanicEl:HTMLElement|null=null;
  setMechanicHint(text:string|null):void {
    if(!text){if(this.mechanicEl)this.mechanicEl.hidden=true;return;}
    if(!this.mechanicEl){this.mechanicEl=document.createElement('div');this.mechanicEl.className='hud-mechanic-hint';this.mechanicEl.style.cssText='position:absolute;bottom:28px;left:50%;transform:translateX(-50%);max-width:680px;width:80%;padding:14px 20px;border:1px solid #91dfdf80;border-radius:16px;background:#21334ee8;color:#f0edf5;font-size:15px;text-align:center;pointer-events:none';this.root.appendChild(this.mechanicEl);}
    if(this.mechanicEl.textContent!==text)this.mechanicEl.textContent=text;this.mechanicEl.hidden=false;
  }

  showBanner(text: string, durationMs = 1200, color = "#ffeb3b"): void {
    clearTimeout(this.bannerTimeout);
    this.bannerEl.textContent = text;
    this.bannerEl.style.color = color;
    this.bannerEl.style.display = "block";
    this.bannerEl.classList.remove("banner-pop");
    // Trigger reflow
    void this.bannerEl.offsetWidth;
    this.bannerEl.classList.add("banner-pop");

    this.bannerTimeout = window.setTimeout(() => {
      this.bannerEl.style.display = "none";
    }, durationMs);
  }

  /**
   * Triggers the fullscreen cosmic teleportation warp animation when clearing the goal
   */
  triggerTeleport(durationMs = 1300): void {
    if (!this.teleportEl) return;
    this.clearTeleport();
    this.teleportEl.style.display = "flex";
    this.teleportTimeout = window.setTimeout(() => {
      this.clearTeleport();
    }, durationMs);
  }

  clearTeleport(): void {
    if (this.teleportTimeout !== null) {
      clearTimeout(this.teleportTimeout);
      this.teleportTimeout = null;
    }
    if (this.teleportEl) {
      this.teleportEl.style.display = "none";
    }
  }

  /**
   * Activates or deactivates the underwater / submerged fluid camera overlay tint
   */
  setUnderwater(active: boolean, fluidType: "water" | "honey" | "lava" = "water"): void {
    if (!this.underwaterOverlay) return;
    if (active) {
      this.underwaterOverlay.classList.remove("fluid-water", "fluid-honey", "fluid-lava");
      this.underwaterOverlay.classList.add(`fluid-${fluidType}`);
      this.underwaterOverlay.classList.add("active");
    } else {
      this.underwaterOverlay.classList.remove("active");
    }
  }

  /**
   * Activates or deactivates the nocturnal pitch-black route vignette overlay (M3-N4-E9)
   */
  setPitchBlack(active: boolean): void {
    if (!this.pitchBlackOverlay) return;
    if (active) {
      this.pitchBlackOverlay.classList.add("active");
    } else {
      this.pitchBlackOverlay.classList.remove("active");
    }
  }

  /**
   * Spawns an energetic celebratory confetti burst shooting directly from above the Goal portal
   */
  triggerConfetti(goalOrigin?: GoalBeamOrigin): void {
    if (this.confettiAnimId !== null) {
      cancelAnimationFrame(this.confettiAnimId);
      this.confettiAnimId = null;
    }

    if (!this.confettiCtx) return;

    const w = (this.confettiCanvas.width = window.innerWidth);
    const h = (this.confettiCanvas.height = window.innerHeight);

    const colors = [
      "#ffd700", // Gold
      "#00e5ff", // Neon Cyan
      "#ff1744", // Ruby Red
      "#76ff03", // Emerald Green
      "#d500f9", // Electric Purple
      "#ff9100", // Orange
      "#ffffff", // Shimmer White
      "#ff4081"  // Hot Pink
    ];

    const particleCount = 135;
    const particles = Array.from({ length: particleCount }, () => {
      let startX: number;
      let startY: number;
      let baseVx = 0;

      if (goalOrigin) {
        // Interpolate along the top lintel beam of the goal
        const t = Math.random();
        startX = goalOrigin.left.x + t * (goalOrigin.right.x - goalOrigin.left.x) + (Math.random() - 0.5) * 18;
        startY = goalOrigin.left.y + t * (goalOrigin.right.y - goalOrigin.left.y) - 6 - Math.random() * 14;
        baseVx = (t - 0.5) * 12; // Outward fountain fan spread
      } else {
        // Fallback: top center of screen
        startX = w * 0.5 + (Math.random() - 0.5) * (w * 0.45);
        startY = h * 0.22 + Math.random() * 25;
      }

      const shapeType: "rect" | "circle" | "star" =
        Math.random() < 0.25 ? "star" : Math.random() < 0.5 ? "circle" : "rect";

      return {
        x: startX,
        y: startY,
        vx: baseVx + (Math.random() - 0.5) * 14,
        vy: -9 - Math.random() * 11, // Strong upward fountain eruption from above the goal
        gravity: 0.33,
        size: 7 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.22,
        tilt: Math.random() * Math.PI,
        tiltSpeed: 0.06 + Math.random() * 0.08,
        shape: shapeType,
        alpha: 1.0
      };
    });

    const render = () => {
      if (!this.confettiCtx) return;
      this.confettiCtx.clearRect(0, 0, w, h);

      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        p.tilt += p.tiltSpeed;
        p.alpha -= 0.013;

        if (p.alpha > 0) {
          alive = true;
          this.confettiCtx.save();
          this.confettiCtx.globalAlpha = Math.max(0, p.alpha);
          this.confettiCtx.translate(p.x, p.y);
          this.confettiCtx.rotate(p.rot);
          this.confettiCtx.fillStyle = p.color;

          // 3D paper flutter simulation
          const scaleY = Math.cos(p.tilt);

          if (p.shape === "rect") {
            this.confettiCtx.fillRect(-p.size / 2, (-p.size * 0.6 * scaleY) / 2, p.size, p.size * 0.6 * scaleY);
          } else if (p.shape === "circle") {
            this.confettiCtx.beginPath();
            this.confettiCtx.ellipse(0, 0, p.size * 0.45, Math.abs(p.size * 0.45 * scaleY), 0, 0, Math.PI * 2);
            this.confettiCtx.fill();
          } else {
            // Sparkling star
            const r = p.size * 0.6;
            this.confettiCtx.beginPath();
            this.confettiCtx.moveTo(0, -r * scaleY);
            this.confettiCtx.lineTo(r * 0.3, -r * 0.3 * scaleY);
            this.confettiCtx.lineTo(r, 0);
            this.confettiCtx.lineTo(r * 0.3, r * 0.3 * scaleY);
            this.confettiCtx.lineTo(0, r * scaleY);
            this.confettiCtx.lineTo(-r * 0.3, r * 0.3 * scaleY);
            this.confettiCtx.lineTo(-r, 0);
            this.confettiCtx.lineTo(-r * 0.3, -r * 0.3 * scaleY);
            this.confettiCtx.closePath();
            this.confettiCtx.fill();
          }
          this.confettiCtx.restore();
        }
      }

      if (alive) {
        this.confettiAnimId = requestAnimationFrame(render);
      } else {
        this.confettiCtx.clearRect(0, 0, w, h);
        this.confettiAnimId = null;
      }
    };

    this.confettiAnimId = requestAnimationFrame(render);
  }

  update(
    lives: number,
    collectibles: number,
    time: number,
    maxCollectibles?: number,
    bombElapsed = time
  ): void {
    if (typeof maxCollectibles === "number" && maxCollectibles > 0) {
      this.currentStageMax = maxCollectibles;
    }
    this.livesEl.textContent = String(lives);
    this.itemsEl.textContent = `${collectibles}/${this.currentStageMax}`;

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.timeEl.textContent = `${String(minutes).padStart(2, "0")}:${seconds
      .toFixed(2)
      .padStart(5, "0")}`;
    const fuse=bombFuse(bombElapsed,this.bombLimit);
    if(bombElapsed!==this.lastBombElapsed){
      this.lastBombElapsed=bombElapsed;
      this.fuse.style.strokeDasharray=fuse.dash;
      this.fuse.style.strokeDashoffset=fuse.offset;
      this.fuse.style.visibility=fuse.remaining===0?'hidden':'visible';
    }
    const tick=fuse.remaining===0?Infinity:Math.floor(bombElapsed*10);
    if(tick!==this.lastBombTick) {
      this.lastBombTick=tick;
      const remaining=fuse.remaining,whole=Math.ceil(remaining);
      this.bombTime.textContent=`${String(Math.floor(whole/60)).padStart(2,'0')}:${String(whole%60).padStart(2,'0')}`;
      this.bombTime.parentElement!.classList.toggle('is-urgent',remaining<=10);
    }
  }

  updateFPS(fps: number, show: boolean): void {
    if (!show) {
      this.fpsBadge.style.display = "none";
      return;
    }
    this.fpsBadge.style.display = "flex";
    const rounded = Math.max(0, Math.round(fps));
    const valEl = this.fpsBadge.querySelector("[data-fps-val]");
    if (valEl) {
      valEl.textContent = String(rounded);
    }
    if (rounded >= 55) {
      this.fpsBadge.style.color = "#00e5ff";
      this.fpsBadge.style.borderColor = "rgba(0, 229, 255, 0.4)";
    } else if (rounded >= 30) {
      this.fpsBadge.style.color = "#ffd700";
      this.fpsBadge.style.borderColor = "rgba(255, 215, 0, 0.4)";
    } else {
      this.fpsBadge.style.color = "#ff5252";
      this.fpsBadge.style.borderColor = "rgba(255, 82, 82, 0.4)";
    }
  }

  setVisible(visible: boolean): void {
    this.root.style.display = visible ? "block" : "none";
    if(!visible) this.updateSpeed(0,false);
    if(!visible) {this.cannonPanel.hidden=true;this.cannonFire=false;}
  }

  updateSpeed(metersPerSecond:number,show:boolean):void {
    this.speedBadge.style.display=show ? "flex" : "none";
    if(!show) return;
    // One world unit represents one metre; include vertical motion on slopes and jumps.
    const kmh=Number.isFinite(metersPerSecond) ? Math.round(Math.max(0,metersPerSecond)*3.6) : 0;
    if(kmh!==this.lastSpeed) {
      this.speedValue.textContent=String(kmh);
      this.lastSpeed=kmh;
    }
  }
  updateCannon(visible:boolean,pitch:number):void {
    if(this.cannonPanel.hidden===visible) this.cannonPanel.hidden=!visible;
    if(visible) this.cannonPanel.querySelector("[data-cannon-angle]")!.textContent=`${Math.round(pitch*180/Math.PI)}°`;
    else this.cannonFire=false;
  }
  consumeCannonFire():boolean {const fire=this.cannonFire;this.cannonFire=false;return fire;}


  destroy(): void {
    clearTimeout(this.bannerTimeout);
    this.clearTeleport();
    if (this.confettiAnimId !== null) {
      cancelAnimationFrame(this.confettiAnimId);
      this.confettiAnimId = null;
    }
    this.metrics.remove();
    this.root.remove();
  }
}
