import {pendingMapLevel} from './MapProgress';
import { assetUrl } from "../core/AssetUrl";
import { MapBackdrop } from "./MapBackdrop";
import { mapBirdsMarkup } from "./MapBirds";
import { worldMapColor, mapIcon, worldMapIcon } from "./MapIcons";
import { WORLDS, getWorldById } from "../levels/WorldDefinitions";
import { CHARACTERS } from "../player/Characters";
import { SpriteTextures } from "../rendering/SpriteTextures";
import { AudioManager } from "../audio/AudioManager";
import type { ProgressionManager } from "../progression/ProgressionManager";
import type { GameState } from "../game/GameState";

export interface MapLevelNode {
  id: string;
  world: number;
  level: number;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  mapX: number; // percentage (0 - 100)
  mapY: number; // percentage (0 - 100)
}

export interface OverworldMapCallbacks {
  onStartStage: (world: number, level: number, stage: number) => void;
  onBackToTitle: () => void;
}

export class OverworldMap {
  private readonly container: HTMLElement;
  private readonly mapCanvasWrapper: HTMLElement;
  private readonly mapSurface: HTMLElement;
  private readonly worldHubsLayer: HTMLElement;
  private readonly levelNodesLayer: HTMLElement;
  private readonly cloudsCanvas: HTMLCanvasElement;
  private readonly cloudsCtx: CanvasRenderingContext2D;
  private readonly sparklesLayer: HTMLElement;
  private readonly sidebarEl: HTMLElement;
  private readonly mapVideoEl: HTMLVideoElement | null;
  private readonly backdrop: MapBackdrop | null;
  private readonly eventCleanup = new AbortController();
  private isAnimatedMode = true;

  // Cloud blanket & realistic organic cloud puff textures
  private baseCloudCanvas: HTMLCanvasElement | null = null;
  private puffCumulusCanvas: HTMLCanvasElement | null = null;
  private puffCarveCanvas: HTMLCanvasElement | null = null;

  // Real-time atmospheric cloud motion loop
  private cloudAnimRafId: number | null = null;
  private cloudSimTime = 0;
  private activeAnimCutout: { x: number; y: number; r: number } | null = null;
  private isDestroyed = false;

  private rafPending = false;
  private panRafId: number | null = null;
  private cameraRafId: number | null = null;
  private unlockAnimRafId: number | null = null;

  private activeWorldId = 1;
  private selectedLevelNode: MapLevelNode | null = null;

  getSelectedLevelNode(): MapLevelNode | null {
    return this.selectedLevelNode;
  }

  // Huge continent map surface matching native 4K image resolution for pixel-perfect sharpness
  private readonly MAP_WIDTH = 4128;
  private readonly MAP_HEIGHT = 2304;

  // Pan & Zoom state
  private panX = 0;
  private panY = 0;
  private zoom = 0.55;
  private isDragging = false;
  private touchMode: "none" | "drag" | "pinch" = "none";
  private suppressMapTapUntil = 0;
  private isOverview = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private initialPanX = 0;
  private initialPanY = 0;

  constructor(
    private readonly root: HTMLElement,
    private readonly state: GameState,
    private readonly progression: ProgressionManager,
    private readonly callbacks: OverworldMapCallbacks
  ) {
    const pending = pendingMapLevel(this.progression);
    this.activeWorldId = pending?.world ?? (this.state.selectedWorld || 1);

    this.container = document.createElement("div");
    this.container.className = "overworld-container";

    this.container.innerHTML = `
      <div class="map-viewport" id="map-viewport">
        <div class="map-surface" id="map-surface" style="width: ${this.MAP_WIDTH}px; height: ${this.MAP_HEIGHT}px;">
          <!-- Static Background Image (displayed when animated video loop is toggled off) -->
          <img
            id="map-bg-image"
            class="map-bg-image"
            src="${assetUrl('/assets/maps/overworld_master.jpg')}"
            alt="Continente Mega RAMP"
            draggable="false"
          />

          <!-- Animated Background Video Loop (displayed when animated video loop is active) -->
          <video
            id="map-bg-video"
            class="map-bg-video"
            autoplay
            loop
            muted
            playsinline
            preload="auto"
            poster="${assetUrl('/assets/maps/overworld_master.jpg')}"
            draggable="false"
          >
            <source src="${assetUrl('/assets/maps/overworld_master_loop.mp4')}" type="video/mp4" />
          </video>

          <div class="map-distant-birds" aria-hidden="true">${mapBirdsMarkup(WORLDS)}</div>
          
          <!-- Layer 0.5: Dedicated CRT Retro Scanlines overlay exclusively for the background -->
          <div class="map-video-crt-overlay" id="map-video-crt-overlay"></div>

          <!-- Layer 1: World Hub Pins across the continent -->
          <div class="map-world-hubs-layer" id="map-world-hubs-layer"></div>

          <!-- Layer 2: 4 Landmark Levels of the active expanded World -->
          <div class="map-level-nodes-layer" id="map-level-nodes-layer"></div>

          <!-- Layer 3: Unified Canvas Cloud Blanket covering literally everything except unlocked areas -->
          <canvas class="map-clouds-canvas" id="map-clouds-canvas" width="2064" height="1152" style="width: 4128px; height: 2304px;"></canvas>

          <!-- Layer 4: Particle sparkles celebration layer -->
          <div class="map-sparkles-layer" id="map-sparkles-layer"></div>
        </div>
      </div>

      <!-- Floating Controls Top Left -->
      <div class="map-controls-hud">
        <button class="btn-map-hud" id="btn-map-back" title="Volver al Menú Principal">
          ${mapIcon("back")}<span>Menú</span>
        </button>
      </div>

      <!-- Floating World Breadcrumb Top Center -->
      <div class="map-breadcrumb-badge" id="map-breadcrumb-badge">
        <span class="breadcrumb-icon" id="breadcrumb-icon">🏘️</span>
        <div class="breadcrumb-text">
          <span class="breadcrumb-title" id="breadcrumb-title">Villamanta</span>
          <span class="breadcrumb-sub" id="breadcrumb-sub">Selecciona uno de los 4 niveles</span>
        </div>
      </div>

      <!-- Right Detail Sidebar Panel -->
      <aside class="map-detail-sidebar" id="map-detail-sidebar">
        <button class="btn-close-sidebar" id="btn-close-sidebar" title="Cerrar panel">✕</button>
        <div class="sidebar-content" id="sidebar-content">
          <!-- Populated dynamically upon selecting a level -->
        </div>
      </aside>
    `;

    this.root.appendChild(this.container);

    this.mapCanvasWrapper = this.container.querySelector("#map-viewport")!;
    this.mapSurface = this.container.querySelector("#map-surface")!;
    this.worldHubsLayer = this.container.querySelector("#map-world-hubs-layer")!;
    this.levelNodesLayer = this.container.querySelector("#map-level-nodes-layer")!;
    this.cloudsCanvas = this.container.querySelector("#map-clouds-canvas")!;
    this.cloudsCtx = this.cloudsCanvas.getContext("2d")!;
    this.sparklesLayer = this.container.querySelector("#map-sparkles-layer")!;
    this.sidebarEl = this.container.querySelector("#map-detail-sidebar")!;
    this.mapVideoEl = this.container.querySelector<HTMLVideoElement>("#map-bg-video");
    this.backdrop = this.mapVideoEl ? new MapBackdrop(this.mapVideoEl) : null;

    this.isAnimatedMode = this.progression.isMapAnimated();
    this.setMapAnimatedMode(this.isAnimatedMode);

    this.setupEvents();
    this.renderWorldHubs();
    this.expandWorld(this.activeWorldId, false, false);
    if(pending) {
      const node=this.getLevelNodesForWorld(getWorldById(pending.world)).find(n=>n.level===pending.level);
      if(node) {this.selectLevelNode(node,false,false);this.centerOnCoordinates(node.mapX,node.mapY,.95,false,false);}
    } else {
      this.isOverview=true;this.selectedLevelNode=null;
      this.levelNodesLayer.querySelectorAll('.selected').forEach(el=>el.classList.remove('selected'));
      this.worldHubsLayer.querySelectorAll('.active-hub').forEach(el=>el.classList.remove('active-hub'));
      this.centerOnCoordinates(50,50,this.getMinZoom(),false,false);
    }
    this.sidebarEl.classList.remove("open");
    this.startCloudAnimation();

    // Check if new unlocks require cloud dissipation animation
    this.checkNewlyUnlockedAnimation();
  }

  private setupEvents(): void {
    document.addEventListener("visibilitychange", this.syncAmbientPlayback, { signal: this.eventCleanup.signal });
    // Mouse drag
    this.mapCanvasWrapper.addEventListener("mousedown", e => {
      if (
        (e.target as HTMLElement).closest(".map-node") ||
        (e.target as HTMLElement).closest(".map-world-hub") ||
        (e.target as HTMLElement).closest(".map-controls-hud") ||
        (e.target as HTMLElement).closest(".map-detail-sidebar")
      ) {
        return;
      }
      this.isDragging = true;
      this.isOverview = false;
      this.stopCameraAnimation();
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.initialPanX = this.panX;
      this.initialPanY = this.panY;
      this.mapCanvasWrapper.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", e => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.dragStartX;
      const dy = e.clientY - this.dragStartY;
      this.panX = this.initialPanX + dx;
      this.panY = this.initialPanY + dy;
      this.requestPanUpdate();
    }, { signal: this.eventCleanup.signal });

    window.addEventListener("mouseup", () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.mapCanvasWrapper.style.cursor = "grab";
      }
    }, { signal: this.eventCleanup.signal });

    // Anchor zoom to the moving midpoint, rather than the viewport centre.
    let lastX=0,lastY=0,lastDistance=0;
    const rebaseTouch=(touches:TouchList)=>{
      if(touches.length>=2){
        const a=touches[0],b=touches[1];lastX=(a.clientX+b.clientX)/2;lastY=(a.clientY+b.clientY)/2;
        lastDistance=Math.max(1,Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY));this.touchMode='pinch';
        this.suppressMapTapUntil=performance.now()+400;
      }else if(touches.length===1){lastX=touches[0].clientX;lastY=touches[0].clientY;this.touchMode='drag';}
      else this.touchMode='none';
      this.isDragging=false;
    };
    this.mapCanvasWrapper.addEventListener('touchstart',e=>{
      this.stopCameraAnimation();this.isOverview=false;rebaseTouch(e.touches);
      if(e.touches.length>=2&&e.cancelable)e.preventDefault();
    },{passive:false,signal:this.eventCleanup.signal});
    window.addEventListener('touchmove',e=>{
      if(this.touchMode==='none')return;
      if(e.cancelable)e.preventDefault();
      const mode=e.touches.length>=2?'pinch':e.touches.length===1?'drag':'none';
      if(mode!==this.touchMode){rebaseTouch(e.touches);return;}
      if(mode==='pinch'){
        const a=e.touches[0],b=e.touches[1],x=(a.clientX+b.clientX)/2,y=(a.clientY+b.clientY)/2;
        const distance=Math.max(1,Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY));
        const zoom=Math.max(this.getMinZoom(),Math.min(1.6,this.zoom*distance/lastDistance)),factor=zoom/this.zoom;
        const rect=this.mapCanvasWrapper.getBoundingClientRect();
        this.panX=x-rect.left-(lastX-rect.left-this.panX)*factor;
        this.panY=y-rect.top-(lastY-rect.top-this.panY)*factor;
        this.zoom=zoom;lastX=x;lastY=y;lastDistance=distance;
        this.suppressMapTapUntil=performance.now()+400;
      }else if(mode==='drag'){
        const t=e.touches[0],dx=t.clientX-lastX,dy=t.clientY-lastY;
        this.panX+=dx;this.panY+=dy;lastX=t.clientX;lastY=t.clientY;
        if(Math.hypot(dx,dy)>2)this.suppressMapTapUntil=performance.now()+400;
      }
      this.clampPan();this.requestPanUpdate();
    },{passive:false,signal:this.eventCleanup.signal});
    window.addEventListener('touchend',e=>{
      if(this.touchMode==='none')return;
      if(this.touchMode==='pinch')this.suppressMapTapUntil=performance.now()+400;
      rebaseTouch(e.touches);
    },{signal:this.eventCleanup.signal});
    window.addEventListener('touchcancel',()=>{
      this.touchMode='none';this.isDragging=false;this.suppressMapTapUntil=performance.now()+400;
    },{signal:this.eventCleanup.signal});

    // Mouse wheel zoom
    this.mapCanvasWrapper.addEventListener(
      "wheel",
      e => {
        e.preventDefault();
        this.isOverview = false;
        this.stopCameraAnimation();
        const minZ = this.getMinZoom();
        const maxZ = 1.6;
        const zoomDelta = e.deltaY < 0 ? 0.06 : -0.06;
        const newZoom = Math.max(minZ, Math.min(maxZ, this.zoom + zoomDelta));
        if (newZoom !== this.zoom) {
          const rect = this.mapCanvasWrapper.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          const factor = newZoom / this.zoom;
          this.panX = mouseX - (mouseX - this.panX) * factor;
          this.panY = mouseY - (mouseY - this.panY) * factor;
          this.zoom = newZoom;

          this.clampPan();
          this.applyTransform();
        }
      },
      { passive: false }
    );

    this.container.querySelector("#btn-map-back")?.addEventListener("click", () => {
      this.callbacks.onBackToTitle();
    });

    this.container.querySelector("#btn-close-sidebar")?.addEventListener("click", () => {
      this.sidebarEl.classList.remove("open");
    });

    window.addEventListener("resize", this.onWindowResize, { signal: this.eventCleanup.signal });
  }

  setMapAnimatedMode(animated: boolean): void {
    this.isAnimatedMode = animated;
    this.progression.setMapAnimated(animated);
    this.backdrop?.setMode(this.isAnimatedMode);
    this.syncAmbientPlayback();
  }

  private readonly syncAmbientPlayback = (): void => {
    this.container.classList.toggle("map-ambient-paused", document.hidden || !this.isAnimatedMode);
  };

  private readonly onWindowResize = (): void => this.resizeMap();

  private resizeMap(): void {
    if(this.isOverview){this.centerOnCoordinates(50,50,this.getMinZoom(),false,false);return;}
    const minZ = this.getMinZoom();
    if (this.zoom < minZ) {
      this.zoom = minZ;
    }
    this.clampPan();
    this.applyTransform();
  }

  private requestPanUpdate(): void {
    if (this.rafPending) return;
    this.rafPending = true;
    this.panRafId = requestAnimationFrame(() => {
      this.panRafId = null;
      if(this.isDestroyed)return;
      this.clampPan();
      this.applyTransform();
      this.rafPending = false;
    });
  };

  private getMinZoom(): number {
    const vpW = (this.mapCanvasWrapper ? this.mapCanvasWrapper.clientWidth : 0) || window.innerWidth;
    const vpH = (this.mapCanvasWrapper ? this.mapCanvasWrapper.clientHeight : 0) || window.innerHeight;
    // Stop at full viewport coverage; one extra pixel prevents rounding seams.
    return Math.max((vpW + 1) / this.MAP_WIDTH, (vpH + 1) / this.MAP_HEIGHT);
  }

  private clampPan(): void {
    const vpW = (this.mapCanvasWrapper ? this.mapCanvasWrapper.clientWidth : 0) || window.innerWidth;
    const vpH = (this.mapCanvasWrapper ? this.mapCanvasWrapper.clientHeight : 0) || window.innerHeight;
    const scaledW = this.MAP_WIDTH * this.zoom;
    const scaledH = this.MAP_HEIGHT * this.zoom;

    // Bound larger axes and centre smaller axes in the full-continent overview.
    if (scaledW <= vpW) {
      this.panX = (vpW - scaledW) / 2;
    } else {
      const minX = vpW - scaledW;
      const maxX = 0;
      this.panX = Math.min(maxX, Math.max(minX, this.panX));
    }

    if (scaledH <= vpH) {
      this.panY = (vpH - scaledH) / 2;
    } else {
      const minY = vpH - scaledH;
      const maxY = 0;
      this.panY = Math.min(maxY, Math.max(minY, this.panY));
    }
  }

  private applyTransform(): void {
    this.mapSurface.style.transform = `translate3d(${this.panX}px, ${this.panY}px, 0) scale(${this.zoom})`;
    this.mapSurface.style.setProperty("--map-marker-scale", String(Math.max(.62, Math.min(1.4, .9 / this.zoom))));
    this.mapSurface.style.setProperty("--map-crt-line", `${4 / this.zoom}px`);
    this.mapSurface.style.setProperty("--map-crt-mask", `${3 / this.zoom}px`);
  }

  // --- World Hubs Rendering ---
  private renderWorldHubs(): void {
    this.worldHubsLayer.innerHTML = "";
    const isAllUnlocked = this.progression.isAllUnlocked();
    const seenNodes = this.progression.getSeenNodes();

    WORLDS.forEach(wDef => {
      const isUnlocked = isAllUnlocked || this.progression.isWorldUnlocked(wDef.id);
      // Locked worlds are completely hidden under the clouds - no button displayed!
      if (!isUnlocked) {
        return;
      }

      const isCompleted = this.progression.isWorldCompleted(wDef.id);
      const isCurrentActive = wDef.id === this.activeWorldId;
      const isSeen = isAllUnlocked || seenNodes.includes(`w${wDef.id}`);

      const el = document.createElement("div");
      el.className = `map-world-hub unlocked ${isCompleted ? "completed" : ""} ${isCurrentActive ? "active-hub" : ""}`;
      el.id = `hub-w${wDef.id}`;
      el.setAttribute("role", "button");
      el.tabIndex = isSeen ? 0 : -1;
      el.setAttribute("aria-label", `Explorar ${wDef.name}`);
      el.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          AudioManager.getInstance().playCollect();
          this.expandWorld(wDef.id, true);
        }
      });
      el.style.left = `${wDef.mapX ?? 50}%`;
      el.style.top = `${wDef.mapY ?? 50}%`;
      if (!isSeen) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
      }

      el.innerHTML = `
        <div class="hub-pin-pulse"></div>
        <div class="hub-pin-emblem" style="--map-world-color: ${worldMapColor(wDef.id)};">
          ${isCompleted ? `<span class="hub-crown">${mapIcon("crown")}</span>` : ""}
          <span class="hub-icon">${worldMapIcon(wDef.id)}</span>
        </div>
        <div class="hub-label">
          <span class="hub-label-text">${wDef.name}</span>
        </div>
      `;

      let downX = 0;
      let downY = 0;
      let isPointerDown = false;

      el.addEventListener("pointerdown", e => {
        downX = e.clientX;
        downY = e.clientY;
        isPointerDown = true;
      });

      el.addEventListener("pointerup", e => {
        if (!isPointerDown) return;
        isPointerDown = false;
        const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
        if (dist < 12 && performance.now() >= this.suppressMapTapUntil) {
          AudioManager.getInstance().playCollect();
          this.expandWorld(wDef.id, true);
        }
      });

      el.addEventListener("click", e => {
        e.stopPropagation();
      });

      this.worldHubsLayer.appendChild(el);
    });
  }

  // --- Expand World: Reveals its 4 Levels on the map ---
  expandWorld(worldId: number, smoothAnimate = true, openSidebar = false): void {
    this.isOverview = false;
    this.activeWorldId = worldId;
    this.state.selectedWorld = worldId;

    // Highlight active world hub
    this.worldHubsLayer.querySelectorAll(".map-world-hub").forEach(el => el.classList.remove("active-hub"));
    const hubEl = this.worldHubsLayer.querySelector(`#hub-w${worldId}`);
    if (hubEl) {
      hubEl.classList.add("active-hub");
    }

    const worldDef = getWorldById(worldId);

    // Update Top Breadcrumb
    const bcIcon = this.container.querySelector("#breadcrumb-icon");
    const bcTitle = this.container.querySelector("#breadcrumb-title");
    const bcSub = this.container.querySelector("#breadcrumb-sub");
    if (bcIcon) bcIcon.innerHTML = worldMapIcon(worldDef.id);
    if (bcTitle) bcTitle.textContent = worldDef.name;
    if (bcSub) bcSub.textContent = `${worldDef.subtitle ?? "4 Niveles"} • Selecciona un nivel`;

    // Render all unlocked levels for all unlocked worlds
    this.renderWorldLevels();

    // Center camera on this world
    this.centerOnWorld(worldId, smoothAnimate);

    // Auto-select first unlocked uncompleted level (or first unlocked level)
    const levelNodes = this.getLevelNodesForWorld(worldDef);
    const unlockedNodes = levelNodes.filter(n => this.progression.isLevelUnlocked(worldId, n.level));
    const firstPlayable = unlockedNodes.find(n => !this.progression.isLevelCompleted(worldId, n.level)) ?? unlockedNodes[0];
    if (firstPlayable) {
      this.selectLevelNode(firstPlayable, false, openSidebar);
    } else {
      this.sidebarEl.classList.remove("open");
    }
  }

  private getLevelNodesForWorld(worldDef: typeof WORLDS[0]): MapLevelNode[] {
    const list: MapLevelNode[] = [];
    const levels = worldDef.levels || [];

    levels.forEach(lvl => {
      list.push({
        id: `w${worldDef.id}-l${lvl.level}`,
        world: worldDef.id,
        level: lvl.level,
        name: lvl.name,
        subtitle: lvl.subtitle,
        description: lvl.description,
        image: lvl.image || worldDef.image || assetUrl("/assets/maps/overworld_master.jpg"),
        mapX: lvl.mapX,
        mapY: lvl.mapY
      });
    });

    return list;
  }

  private renderWorldLevels(): void {
    this.levelNodesLayer.innerHTML = "";
    const isAllUnlocked = this.progression.isAllUnlocked();
    const seenNodes = this.progression.getSeenNodes();

    WORLDS.forEach(wDef => {
      const isWorldUnlocked = isAllUnlocked || this.progression.isWorldUnlocked(wDef.id);
      if (!isWorldUnlocked) return;

      const levels = this.getLevelNodesForWorld(wDef);
      levels.forEach(lvl => {
        const isUnlocked = isAllUnlocked || this.progression.isLevelUnlocked(wDef.id, lvl.level);
        if (!isUnlocked) {
          return;
        }

        const isCompleted = this.progression.isLevelCompleted(wDef.id, lvl.level);
        // Active world levels are always seen and clickable
        const isSeen = isAllUnlocked || seenNodes.includes(lvl.id) || wDef.id === this.activeWorldId;

        const el = document.createElement("div");
        el.className = `map-node level-pin unlocked ${isCompleted ? "completed" : ""}`;
        el.id = `node-${lvl.id}`;
        el.style.setProperty('--map-world-color', worldMapColor(wDef.id));
        el.setAttribute("role", "button");
        el.tabIndex = isSeen ? 0 : -1;
        el.setAttribute("aria-label", `${wDef.name}, nivel ${lvl.level}: ${lvl.name}`);
        el.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            AudioManager.getInstance().playCollect();
            this.selectLevelNode(lvl, true, true);
          }
        });
        el.style.left = `${lvl.mapX}%`;
        el.style.top = `${lvl.mapY}%`;
        if (!isSeen) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
        }

        el.innerHTML = `
          <div class="node-pin-pulse"></div>
          <div class="node-pin-body">
            <img class="level-art-icon" src="${lvl.image}" alt="" width="48" height="48" decoding="async" draggable="false" />
            ${isCompleted ? `<span class="node-crown">${mapIcon("crown")}</span>` : ""}
            <span class="node-badge-text">${lvl.level}</span>
          </div>
          <div class="node-label">
            <span class="node-label-num">M${wDef.id}·N${lvl.level}</span>
            <span class="node-label-title">${lvl.name}</span>
          </div>
        `;

        let downX = 0;
        let downY = 0;
        let isPointerDown = false;

        el.addEventListener("pointerdown", e => {
          downX = e.clientX;
          downY = e.clientY;
          isPointerDown = true;
        });

        el.addEventListener("pointerup", e => {
          if (!isPointerDown) return;
          isPointerDown = false;
          const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
          if (dist < 12 && performance.now() >= this.suppressMapTapUntil) {
            AudioManager.getInstance().playCollect();
            this.selectLevelNode(lvl, true, true);
          }
        });

        el.addEventListener("click", e => {
          e.stopPropagation();
        });

        this.levelNodesLayer.appendChild(el);
      });
    });

    // Re-render clouds so locked levels in this world also get covered
    this.renderClouds();
  }

  private selectLevelNode(node: MapLevelNode, userTriggered = true, openSidebar = true): void {
    if (!this.progression.isAllUnlocked() && !this.progression.isLevelUnlocked(node.world, node.level)) {
      return;
    }

    if(userTriggered)this.isOverview=false;
    this.selectedLevelNode = node;
    this.state.selectedWorld = node.world;
    this.state.selectedLevel = node.level;
    this.activeWorldId = node.world;

    // Highlight active world hub
    this.worldHubsLayer.querySelectorAll(".map-world-hub").forEach(el => el.classList.remove("active-hub"));
    const hubEl = this.worldHubsLayer.querySelector(`#hub-w${node.world}`);
    if (hubEl) {
      hubEl.classList.add("active-hub");
    }

    // Update Top Breadcrumb
    const worldDef = getWorldById(node.world);
    const bcIcon = this.container.querySelector("#breadcrumb-icon");
    const bcTitle = this.container.querySelector("#breadcrumb-title");
    const bcSub = this.container.querySelector("#breadcrumb-sub");
    if (bcIcon) bcIcon.innerHTML = worldMapIcon(worldDef.id);
    if (bcTitle) bcTitle.textContent = worldDef.name;
    if (bcSub) bcSub.textContent = `${worldDef.subtitle ?? "4 Niveles"} • Nivel ${node.level}`;

    // Highlight node
    this.levelNodesLayer.querySelectorAll(".map-node").forEach(el => el.classList.remove("selected"));
    const activeEl = this.levelNodesLayer.querySelector(`#node-${node.id}`);
    if (activeEl) {
      activeEl.classList.add("selected");
    }

    if (userTriggered) {
      this.centerOnCoordinates(node.mapX, node.mapY, 0.95, true);
    }

    this.renderSidebar(node);
    if (openSidebar) {
      this.sidebarEl.classList.add("open");
    } else {
      this.sidebarEl.classList.remove("open");
    }
  }

  private initCloudAssets(): void {
    if (this.puffCumulusCanvas && this.baseCloudCanvas) return;

    // Helper: Paint authentic multi-lobed cumulus cloud silhouettes (not circles!)
    const drawMultiLobedCloud = (
      targetCtx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      mode: "volumetric" | "carve"
    ) => {
      // 6 overlapping organic cumulus lobes forming the iconic silhouette of a real cloud
      const lobes = [
        { ox: 0,   oy: 35,  r: 108 }, // Base central pillow
        { ox: -92, oy: 40,  r: 72  }, // Left billow
        { ox: 92,  oy: 40,  r: 74  }, // Right billow
        { ox: -55, oy: -18, r: 84  }, // Upper-left dome
        { ox: 58,  oy: -18, r: 80  }, // Upper-right dome
        { ox: 4,   oy: -55, r: 92  }, // Central summit crest
      ];

      lobes.forEach(({ ox, oy, r: lr }) => {
        const lx = cx + ox;
        const ly = cy + oy;

        if (mode === "carve") {
          const cGrad = targetCtx.createRadialGradient(lx, ly, 0, lx, ly, lr);
          cGrad.addColorStop(0.0, "rgba(0, 0, 0, 1.0)");
          cGrad.addColorStop(0.70, "rgba(0, 0, 0, 1.0)");
          cGrad.addColorStop(0.90, "rgba(0, 0, 0, 0.45)");
          cGrad.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");
          targetCtx.fillStyle = cGrad;
          targetCtx.beginPath();
          targetCtx.arc(lx, ly, lr, 0, Math.PI * 2);
          targetCtx.fill();
        } else {
          // 1. Ambient underside depth shadow
          const sGrad = targetCtx.createRadialGradient(lx + lr * 0.16, ly + lr * 0.20, lr * 0.1, lx, ly, lr);
          sGrad.addColorStop(0.0, "rgba(180, 202, 228, 0.85)");
          sGrad.addColorStop(0.60, "rgba(205, 222, 242, 0.45)");
          sGrad.addColorStop(1.0, "rgba(215, 230, 248, 0.0)");
          targetCtx.fillStyle = sGrad;
          targetCtx.beginPath();
          targetCtx.arc(lx, ly, lr, 0, Math.PI * 2);
          targetCtx.fill();

          // 2. Dense white body
          const bGrad = targetCtx.createRadialGradient(lx - lr * 0.14, ly - lr * 0.16, lr * 0.06, lx, ly, lr);
          bGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.98)");
          bGrad.addColorStop(0.40, "rgba(252, 254, 255, 0.94)");
          bGrad.addColorStop(0.72, "rgba(238, 245, 252, 0.70)");
          bGrad.addColorStop(0.90, "rgba(215, 228, 244, 0.25)");
          bGrad.addColorStop(1.0, "rgba(200, 218, 240, 0.0)");
          targetCtx.fillStyle = bGrad;
          targetCtx.beginPath();
          targetCtx.arc(lx, ly, lr, 0, Math.PI * 2);
          targetCtx.fill();

          // 3. Sunlit crest highlight
          const hGrad = targetCtx.createRadialGradient(lx - lr * 0.25, ly - lr * 0.30, 2, lx - lr * 0.25, ly - lr * 0.30, lr * 0.7);
          hGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.92)");
          hGrad.addColorStop(0.45, "rgba(255, 253, 246, 0.45)");
          hGrad.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
          targetCtx.fillStyle = hGrad;
          targetCtx.beginPath();
          targetCtx.arc(lx, ly, lr, 0, Math.PI * 2);
          targetCtx.fill();
        }
      });
    };

    // 1. Offscreen Sprite: Volumetric 3D Cumulus Cloudlet (512x512) for base blanket
    this.puffCumulusCanvas = document.createElement("canvas");
    this.puffCumulusCanvas.width = 512;
    this.puffCumulusCanvas.height = 512;
    drawMultiLobedCloud(this.puffCumulusCanvas.getContext("2d")!, 256, 256, "volumetric");

    // 2. Offscreen Sprite: Feathered Cloud Eraser Mask for Destination-Out (512x512)
    this.puffCarveCanvas = document.createElement("canvas");
    this.puffCarveCanvas.width = 512;
    this.puffCarveCanvas.height = 512;
    drawMultiLobedCloud(this.puffCarveCanvas.getContext("2d")!, 256, 256, "carve");

    // 5. Pre-rendered Base Cloud Blanket covering the 4128 x 2304 continent
    this.baseCloudCanvas = document.createElement("canvas");
    this.baseCloudCanvas.width = this.MAP_WIDTH;
    this.baseCloudCanvas.height = this.MAP_HEIGHT;
    const bctx = this.baseCloudCanvas.getContext("2d")!;

    // Atmospheric soft base tone
    const bgGrad = bctx.createLinearGradient(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT);
    bgGrad.addColorStop(0, "#f8fafc");
    bgGrad.addColorStop(0.5, "#e2e8f0");
    bgGrad.addColorStop(1, "#cbd5e1");
    bctx.fillStyle = bgGrad;
    bctx.fillRect(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT);

    // Dense organic billowing clouds across the whole canvas using pre-rendered cumulus sprites
    const rows = 14;
    const cols = 24;
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const jitterX = ((r * 17 + c * 31) % 64) - 32;
        const jitterY = ((r * 43 + c * 19) % 54) - 27;
        const px = (c / cols) * this.MAP_WIDTH + jitterX;
        const py = (r / rows) * this.MAP_HEIGHT + jitterY;
        const puffRadius = 340 + ((r * 23 + c * 41) % 190);
        const puffDia = puffRadius * 2;
        bctx.drawImage(this.puffCumulusCanvas, px - puffRadius, py - puffRadius, puffDia, puffDia);
      }
    }
  }

  // --- High-Performance Cloud Blanket Rendering ---
  private startCloudAnimation(): void {
    if (this.progression.isAllUnlocked()) {
      this.cloudsCtx.clearRect(0, 0, 2064, 1152);
      return;
    }

    // Render clouds cleanly on start
    this.renderClouds();
  }

  private stopCloudAnimation(): void {
    if (this.cloudAnimRafId !== null) {
      cancelAnimationFrame(this.cloudAnimRafId);
      this.cloudAnimRafId = null;
    }
  }

  // --- Render Unified High-Performance Cloud Blanket with Organic, Realistic Billowing Openings ---
  renderClouds(animCutout?: { x: number; y: number; r: number }): void {
    if (!this.baseCloudCanvas || !this.puffCumulusCanvas) {
      this.initCloudAssets();
    }

    const CW = this.MAP_WIDTH;   // 4128
    const CH = this.MAP_HEIGHT;  // 2304
    const ctx = this.cloudsCtx;

    const isAllUnlocked = this.progression.isAllUnlocked();

    // Las nubes al completarlo todo desaparecen del todo
    if (isAllUnlocked) {
      ctx.clearRect(0, 0, 2064, 1152);
      return;
    }

    ctx.save();
    ctx.scale(0.5, 0.5);
    ctx.clearRect(0, 0, CW, CH);

    // 1. Paint dense continuous cloud blanket covering literally everything
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(this.baseCloudCanvas!, 0, 0);

    // Collect all cleared windows:
    interface HoleCutout { x: number; y: number; r: number }
    const cutouts: HoleCutout[] = [];
    const seenNodes = this.progression.getSeenNodes();

    const activeAnim = animCutout ?? this.activeAnimCutout;

    WORLDS.forEach(wDef => {
      const isWorldUnlocked = isAllUnlocked || this.progression.isWorldUnlocked(wDef.id);
      if (isWorldUnlocked) {
        const wx = ((wDef.mapX ?? 50) / 100) * CW;
        const wy = ((wDef.mapY ?? 50) / 100) * CH;
        const isWorldSeen = isAllUnlocked || seenNodes.includes(`w${wDef.id}`);

        // Cleared window where the world hub is located
        if (activeAnim && Math.hypot(wx - activeAnim.x, wy - activeAnim.y) < 6) {
          cutouts.push({ x: wx, y: wy, r: activeAnim.r });
        } else if (isWorldSeen) {
          cutouts.push({ x: wx, y: wy, r: 340 });
        }

        // Cleared windows for unlocked levels
        const worldLevels = wDef.levels || [];
        worldLevels.forEach(lvl => {
          const isLvlUnlocked = isAllUnlocked || this.progression.isLevelUnlocked(wDef.id, lvl.level);
          if (isLvlUnlocked) {
            const lx = (lvl.mapX / 100) * CW;
            const ly = (lvl.mapY / 100) * CH;
            const lvlNodeId = `w${wDef.id}-l${lvl.level}`;
            const isLvlSeen = isAllUnlocked || seenNodes.includes(lvlNodeId);

            if (activeAnim && Math.hypot(lx - activeAnim.x, ly - activeAnim.y) < 6) {
              cutouts.push({ x: lx, y: ly, r: activeAnim.r });
            } else if (isLvlSeen) {
              cutouts.push({ x: lx, y: ly, r: 300 });
            }
          }
        });
      }
    });

    if (cutouts.length === 0) {
      ctx.restore();
      return;
    }

    const t = this.cloudSimTime;
    const numLobes = 28;

    // Helper: calculate realistic non-circular, organic undulating radius at angle phi
    const getOrganicRadius = (phi: number, baseR: number, seed: number) => {
      // Natural geographic asymmetry (multi-harmonic oval/cumulus bay contour)
      const asym1 = Math.sin(2 * phi + seed * 0.35) * 0.12;
      const asym2 = Math.cos(3 * phi + seed * 0.72) * 0.08;
      const asym3 = Math.sin(5 * phi + seed * 1.15) * 0.05;

      // Realistic fluid atmospheric motion: gentle breathing and slow billowing undulation
      const wave1 = Math.sin(3 * phi + t * 0.45 + seed) * 0.045;
      const wave2 = Math.cos(5 * phi - t * 0.35 + seed * 1.4) * 0.035;
      const wave3 = Math.sin(7 * phi + t * 0.60 + seed * 2.2) * 0.02;

      return baseR * (1.0 + asym1 + asym2 + asym3 + wave1 + wave2 + wave3);
    };

    // -------------------------------------------------------------
    // PHASE 1: CARVE THE ORGANIC HOLE (destination-out)
    // -------------------------------------------------------------
    ctx.globalCompositeOperation = "destination-out";

    cutouts.forEach(({ x, y, r: R }) => {
      if (R <= 20) return;
      const seed = Math.abs(Math.sin(x * 0.0071 + y * 0.0137)) * 1000;

      // A) Carve out the organic undulating central polygon
      ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
      ctx.beginPath();
      const polySteps = 36;
      for (let k = 0; k < polySteps; k++) {
        const phi = (k / polySteps) * Math.PI * 2;
        const rad = getOrganicRadius(phi, R, seed) * 0.90;
        const px = x + Math.cos(phi) * rad;
        const py = y + Math.sin(phi) * rad;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // B) Carve soft scalloped cloud bays along the perimeter using the cloud carve mask
      for (let i = 0; i < numLobes; i++) {
        const theta0 = (i / numLobes) * Math.PI * 2;
        const theta = theta0 + Math.sin(i * 4.7 + seed) * 0.05 + Math.sin(t * 0.22 + i) * 0.02;
        const rimR = getOrganicRadius(theta, R, seed);
        const carveDist = rimR * 0.88;
        const cx = x + Math.cos(theta) * carveDist;
        const cy = y + Math.sin(theta) * carveDist;
        const carveSize = R * (0.28 + Math.cos(i * 3.1 + seed) * 0.05);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(theta + Math.PI / 2);
        ctx.drawImage(this.puffCarveCanvas!, -carveSize / 2, -carveSize / 2, carveSize, carveSize);
        ctx.restore();
      }
    });

    // -------------------------------------------------------------
    // PHASE 2: CRYSTAL-CLEAR INTERIOR PASS (destination-out)
    // -------------------------------------------------------------
    cutouts.forEach(({ x, y, r: R }) => {
      if (R <= 20) return;
      const clearR = R * 0.68;
      ctx.drawImage(this.puffCarveCanvas!, x - clearR, y - clearR, clearR * 2, clearR * 2);
    });

    ctx.restore();
  }

  // --- Right-Hand Detail Sidebar (Requested by User) ---
  private renderSidebar(node: MapLevelNode): void {
    const isUnlocked = this.progression.isLevelUnlocked(node.world, node.level);
    const isCompleted = this.progression.isLevelCompleted(node.world, node.level);
    const worldDef = getWorldById(node.world);
    const record = this.progression.getLevelRecord(node.world, node.level);

    const content = this.sidebarEl.querySelector("#sidebar-content");
    if (!content) return;

    // Format best time (only recorded when level is fully completed!)
    let timeText = "--:--.--";
    if (isCompleted && record.bestTime !== null && record.bestTime !== undefined && record.bestTime > 0) {
      const mins = Math.floor(record.bestTime / 60);
      const secs = (record.bestTime % 60).toFixed(2);
      timeText = `${mins > 0 ? `${mins}m ` : ""}${secs}s`;
    }

    // Characters completed with (only recorded when level is fully completed!)
    let charactersHtml = `<span class="stat-empty">Sin superar</span>`;
    if (isCompleted && record.completedCharacters && record.completedCharacters.length > 0) {
      charactersHtml = record.completedCharacters
        .map(cid => {
          const c = CHARACTERS.find(ch => ch.id === cid);
          return `<span class="char-clear-tag" data-item-slot="${c?.collectibleId ?? ''}"><span class="tag-icon-slot"></span><span class="tag-name">${c?.name ?? cid}</span></span>`;
        })
        .join(" ");
    }

    // Collectibles text: Only recorded when level is fully completed!
    const maxLevelCollectibles = Math.min(100,this.progression.getLevelMaxCollectibles(node.world, node.level));
    const effectiveCollectibles = isCompleted ? (record.totalCollectibles || 0) : 0;
    const collectiblesText = isCompleted
      ? `${effectiveCollectibles} / ${maxLevelCollectibles}`
      : `0 / ${maxLevelCollectibles}`;

    // Clear count
    const clearCountText = isCompleted
      ? `${record.clearCount || 1} ${record.clearCount === 1 ? "vez" : "veces"}`
      : "0 veces";

    content.innerHTML = `
      <div class="sidebar-header">
        <span class="sidebar-badge" style="background: ${worldDef.primaryColor};">
          ${worldMapIcon(worldDef.id)} ${worldDef.name} • Nivel ${node.level}
        </span>
        <h2 class="sidebar-title">${node.name}</h2>
        <div class="sidebar-subtitle">${node.subtitle}</div>
      </div>

      <!-- Preview Image Box on the Right with Retro CRT Scanlines Effect -->
      <div class="sidebar-preview-box">
        <img src="${node.image}" alt="${node.name}" class="sidebar-preview-img" />
        <div class="sidebar-preview-crt-overlay"></div>
        <div class="sidebar-preview-overlay">
          ${
            isCompleted
              ? `<span class="badge-status-completed">${mapIcon("crown")} COMPLETADO</span>`
              : isUnlocked
              ? `<span class="badge-status-unlocked">${mapIcon("sparkles")} DESBLOQUEADO</span>`
              : `<span class="badge-status-locked">${mapIcon("lock")} CUBIERTO POR NUBES</span>`
          }
        </div>
      </div>

      <p class="sidebar-description">${node.description}</p>

      <!-- Level Record Statistics (User requested: time record, collectibles, completed characters, clear count) -->
      <div class="sidebar-records-panel">
        <div class="record-panel-title">${mapIcon("chart")} Récords del nivel</div>
        
        <div class="record-grid">
          <div class="record-card">
            <span class="record-label">${mapIcon("clock")} Mejor tiempo · 10 etapas</span>
            <span class="record-value ${record.bestTime ? "highlight-gold" : ""}">${timeText}</span>
          </div>

          <div class="record-card">
            <span class="record-label"><span data-map-collectible></span> Objetos Conseguidos</span>
            <span class="record-value ${isCompleted ? "highlight-cyan" : ""}">${collectiblesText}</span>
          </div>

          <div class="record-card full-width">
            <span class="record-label">${mapIcon("crown")} Superado con</span>
            <div class="record-chars-row">${charactersHtml}</div>
          </div>

          <div class="record-card full-width">
            <span class="record-label">${mapIcon("repeat")} Veces completado</span>
            <span class="record-value">${clearCountText}</span>
          </div>
        </div>
      </div>

      <!-- Main Action JUGAR Button -->
      <div class="sidebar-action-box">
        ${
          isUnlocked
            ? `
            <button class="btn btn-test-clear" id="btn-test-clear-level" title="Superar este nivel instantáneamente para pruebas">
              Superar nivel (Test)
            </button>
            <button class="btn btn-main btn-glow btn-play-map" id="btn-start-level">
              ${mapIcon("play")} JUGAR NIVEL
            </button>
          `
            : `
            <div class="locked-map-banner">
              🔒 <strong>BLOQUEADO POR NUBES</strong><br />
              Supera el nivel anterior para despejar las nubes de este territorio.
            </div>
          `
        }
      </div>
    `;

    // Mount collectible custom canvas icons for completed characters
    const collectibleSlot=content.querySelector<HTMLElement>('[data-map-collectible]');
    if(collectibleSlot){
      const character=CHARACTERS.find(c=>c.id===this.state.selectedCharacter)??CHARACTERS[0];
      const icon=SpriteTextures.getCollectibleCanvas(character.collectibleId,20);icon.style.cssText='display:inline-block;width:20px;height:20px;vertical-align:middle';collectibleSlot.appendChild(icon);
    }
    content.querySelectorAll<HTMLElement>(".char-clear-tag").forEach(tag => {
      const slot = tag.querySelector<HTMLElement>(".tag-icon-slot");
      const itemId = tag.getAttribute("data-item-slot");
      if (slot && itemId) {
        slot.innerHTML = "";
        const cvs = SpriteTextures.getCollectibleCanvas(itemId, 18);
        cvs.style.cssText = "display: block; width: 18px; height: 18px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));";
        slot.appendChild(cvs);
      }
    });

    // Test Clear Level Click -> Completes level instantly, unlocks records and next stages/worlds
    content.querySelector("#btn-test-clear-level")?.addEventListener("click", () => {
      AudioManager.getInstance().playGoal();
      this.spawnUnlockSparkles(node.mapX, node.mapY);

      const charId = this.progression.getSelectedCharacter() || "rony";
      this.progression.completeLevel(node.world, node.level, 36.5, undefined, charId);

      // Re-render pins & hubs to reflect crown/clear
      this.renderWorldHubs();
      this.renderWorldLevels();

      // Check if new unlocks require cloud dissipation
      this.checkNewlyUnlockedAnimation();

      // Refresh sidebar with updated records & completion tag
      this.renderSidebar(node);

      // Trigger cloud re-render
      this.renderClouds();
    });

    // Play Level Click -> Starts stage 1 (first uncompleted or stage 1)
    content.querySelector("#btn-start-level")?.addEventListener("click", () => {
      AudioManager.getInstance().playGoal();
      this.state.selectedWorld = node.world;
      this.state.selectedLevel = node.level;

      // Always starts from stage 1 with full 5 lives!
      this.state.selectedStage = 1;
      this.state.resetLives();
      this.state.elapsedTime = 0;
      this.state.stageCollectibles = 0;
      this.callbacks.onStartStage(node.world, node.level, 1);
    });
  }

  // --- Smooth Camera Positioning Helpers ---
  centerOnWorld(worldId: number, smooth = true): void {
    const wDef = getWorldById(worldId);
    const targetX = wDef.mapX ?? 50;
    const targetY = wDef.mapY ?? 50;
    this.centerOnCoordinates(targetX, targetY, 0.85, smooth);
  }

  private centerOnCoordinates(pctX: number, pctY: number, targetZoom: number, smooth = true, reserveSidebar = true): void {
    const vpW = (this.mapCanvasWrapper ? this.mapCanvasWrapper.clientWidth : 0) || window.innerWidth;
    const vpH = (this.mapCanvasWrapper ? this.mapCanvasWrapper.clientHeight : 0) || window.innerHeight;
    const sidebarOffset = reserveSidebar && vpW > 860 ? 120 : 0;

    const minZ = this.getMinZoom();
    const clampedZoom = Math.max(minZ, Math.min(1.6, targetZoom));

    const targetPxX = (pctX / 100) * this.MAP_WIDTH;
    const targetPxY = (pctY / 100) * this.MAP_HEIGHT;

    const scaledW = this.MAP_WIDTH * clampedZoom;
    const scaledH = this.MAP_HEIGHT * clampedZoom;

    let targetPanX = vpW * 0.5 - targetPxX * clampedZoom - sidebarOffset;
    let targetPanY = vpH * 0.5 - targetPxY * clampedZoom;

    // Keep the visible continent bounded, with centred margins when zoomed out.
    if (scaledW <= vpW) {
      targetPanX = (vpW - scaledW) / 2;
    } else {
      targetPanX = Math.min(0, Math.max(vpW - scaledW, targetPanX));
    }

    if (scaledH <= vpH) {
      targetPanY = (vpH - scaledH) / 2;
    } else {
      targetPanY = Math.min(0, Math.max(vpH - scaledH, targetPanY));
    }

    if (smooth) {
      this.animatePanTo(targetPanX, targetPanY, clampedZoom);
    } else {
      this.zoom = clampedZoom;
      this.panX = targetPanX;
      this.panY = targetPanY;
      this.clampPan();
      this.applyTransform();
    }
  }

  private animatePanTo(targetX: number, targetY: number, targetZoom: number): void {
    this.stopCameraAnimation();
    const startX = this.panX;
    const startY = this.panY;
    const startZ = this.zoom;
    let startTime: number | null = null;
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500;

    const step = (now: number) => {
      this.cameraRafId = null;
      if (this.isDestroyed) return;
      startTime ??= now;
      const elapsed = now - startTime;
      const progress = duration === 0 ? 1 : Math.max(0, Math.min(1.0, elapsed / duration));
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      this.panX = startX + (targetX - startX) * ease;
      this.panY = startY + (targetY - startY) * ease;
      this.zoom = startZ + (targetZoom - startZ) * ease;

      this.clampPan();
      this.applyTransform();

      if (progress < 1.0) {
        this.cameraRafId = requestAnimationFrame(step);
      }
    };

    this.cameraRafId = requestAnimationFrame(step);
  }

  private stopCameraAnimation(): void {
    if (this.cameraRafId !== null) cancelAnimationFrame(this.cameraRafId);
    this.cameraRafId = null;
  }


  private checkNewlyUnlockedAnimation(): void {
    if (this.isOverview || this.progression.isAllUnlocked()) {
      return;
    }
    const seenNodes = this.progression.getSeenNodes();

    // 1. Check if a new world was unlocked and hasn't been revealed yet
    const newlyUnlockedWorld = WORLDS.find(w => w.id===this.activeWorldId && this.progression.isWorldUnlocked(w.id) && !seenNodes.includes(`w${w.id}`));
    if (newlyUnlockedWorld) {
      setTimeout(() => {
        this.progression.markNodeSeen(`w${newlyUnlockedWorld.id}`);
        this.progression.markNodeSeen(`w${newlyUnlockedWorld.id}-l1`);
        this.playWorldCloudDissipation(newlyUnlockedWorld);
      }, 400);
      return;
    }

    // 2. Check if a level in the active world was newly unlocked
    const activeWorldDef = getWorldById(this.activeWorldId);
    const levels = this.getLevelNodesForWorld(activeWorldDef);
    const newlyUnlocked = levels.find(l => this.progression.isLevelUnlocked(l.world, l.level) && !seenNodes.includes(l.id));

    if (newlyUnlocked) {
      setTimeout(() => {
        this.playCloudDissipation(newlyUnlocked);
        this.progression.markNodeSeen(newlyUnlocked.id);
      }, 400);
    }
  }

  playWorldCloudDissipation(worldDef: typeof WORLDS[0]): void {
    if (this.unlockAnimRafId !== null) {
      cancelAnimationFrame(this.unlockAnimRafId);
      this.unlockAnimRafId = null;
    }

    const targetX = ((worldDef.mapX ?? 50) / 100) * this.MAP_WIDTH;
    const targetY = ((worldDef.mapY ?? 50) / 100) * this.MAP_HEIGHT;
    const targetR = 340;
    const startTime = performance.now();
    const duration = 1200;

    AudioManager.getInstance().playGoal();
    this.spawnUnlockSparkles(worldDef.mapX ?? 50, worldDef.mapY ?? 50);

    const hubEl = this.worldHubsLayer.querySelector(`#hub-w${worldDef.id}`) as HTMLElement | null;
    if (hubEl) {
      hubEl.style.pointerEvents = "auto";
      hubEl.style.opacity = "1";
      hubEl.style.animation = "level-pin-appear 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both";
    }

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentR = ease * targetR;

      this.activeAnimCutout = { x: targetX, y: targetY, r: currentR };
      this.renderClouds(this.activeAnimCutout);

      if (progress < 1.0) {
        this.unlockAnimRafId = requestAnimationFrame(animate);
      } else {
        this.unlockAnimRafId = null;
        this.activeAnimCutout = null;
        // Refresh visibility without overriding the progress focus or a camera gesture.
        this.renderWorldLevels();
        if(this.selectedLevelNode)this.levelNodesLayer.querySelector(`#node-${this.selectedLevelNode.id}`)?.classList.add("selected");
        this.renderClouds(); // Final static pass
      }
    };

    this.unlockAnimRafId = requestAnimationFrame(animate);
  }

  playCloudDissipation(node: MapLevelNode): void {
    if (this.unlockAnimRafId !== null) {
      cancelAnimationFrame(this.unlockAnimRafId);
      this.unlockAnimRafId = null;
    }

    const targetX = (node.mapX / 100) * this.MAP_WIDTH;
    const targetY = (node.mapY / 100) * this.MAP_HEIGHT;
    const targetR = 300;
    const startTime = performance.now();
    const duration = 1100;

    AudioManager.getInstance().playGoal();
    this.spawnUnlockSparkles(node.mapX, node.mapY);

    const nodeEl = this.levelNodesLayer.querySelector(`#node-${node.id}`) as HTMLElement | null;
    if (nodeEl) {
      nodeEl.style.pointerEvents = "auto";
      nodeEl.style.opacity = "1";
      nodeEl.style.animation = "level-pin-appear 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both";
    }

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentR = ease * targetR;

      this.activeAnimCutout = { x: targetX, y: targetY, r: currentR };
      this.renderClouds(this.activeAnimCutout);

      if (progress < 1.0) {
        this.unlockAnimRafId = requestAnimationFrame(animate);
      } else {
        this.unlockAnimRafId = null;
        this.activeAnimCutout = null;
        this.renderClouds(); // Final static pass
      }
    };

    this.unlockAnimRafId = requestAnimationFrame(animate);
  }

  private spawnUnlockSparkles(mapX: number, mapY: number): void {
    const colors = ["#ffd700", "#ffeb3b", "#00e5ff", "#ffffff", "#ff4081"];
    const originX = (mapX / 100) * this.MAP_WIDTH;
    const originY = (mapY / 100) * this.MAP_HEIGHT;

    for (let i = 0; i < 22; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "cloud-unlock-sparkle";
      sparkle.style.left = `${originX}px`;
      sparkle.style.top = `${originY}px`;
      sparkle.style.background = colors[i % colors.length];
      const angle = (i / 22) * Math.PI * 2;
      const dist = 55 + Math.random() * 105;
      sparkle.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
      sparkle.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
      sparkle.style.animationDelay = `${Math.random() * 0.3}s`;
      this.sparklesLayer.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 1900);
    }
  }

  destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this.stopCloudAnimation();
    this.eventCleanup.abort();
    this.stopCameraAnimation();
    if (this.panRafId !== null) cancelAnimationFrame(this.panRafId);
    this.backdrop?.destroy();
    if (this.mapVideoEl) {
      try {
        this.mapVideoEl.pause();
        this.mapVideoEl.src = "";
        this.mapVideoEl.load();
      } catch {
        // ignore
      }
    }
    if (this.unlockAnimRafId !== null) {
      cancelAnimationFrame(this.unlockAnimRafId);
      this.unlockAnimRafId = null;
    }
    window.removeEventListener("resize", this.onWindowResize);
    this.baseCloudCanvas = null;
    this.puffCumulusCanvas = null;
    this.puffCarveCanvas = null;
    this.container.remove();
  }
}
