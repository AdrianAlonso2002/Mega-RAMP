import * as THREE from "three";
import {createCharacterSpriteMaterial} from '../rendering/CharacterOutline';
import { getCharacterById } from "../player/Characters";
import type { CharacterDefinition } from "../player/PlayerTypes";
import { PLAYER_TOP_SPEED, PLAYER_DRIVE_FORCE, PLAYER_ROLLING_TORQUE } from "../player/PlayerTuning";
import { SpriteTextures, type CharacterState } from "../rendering/SpriteTextures";
import { AudioManager } from "../audio/AudioManager";
import {CollectibleVisual} from '../rendering/CollectibleVisual';
import type {GraphicsQuality} from '../rendering/GraphicsQuality';

export interface CharacterPreviewCallbacks {
  onConfirm?: (characterId: string) => void;
  onCharacterChanged?: (characterId: string) => void;
}

export class CharacterPreview {
  private readonly container: HTMLElement;
  private readonly callbacks: CharacterPreviewCallbacks;
  private currentChar: CharacterDefinition;

  // DOM Elements
  private cardEl!: HTMLElement;
  private canvasWrapEl!: HTMLElement;
  private canvasEl!: HTMLCanvasElement;
  private badgeNameEl!: HTMLElement;
  private badgeEmojiEl!: HTMLElement;
  private scoreCountEl!: HTMLElement;
  private scoreEmojiEl!: HTMLElement;
  private joystickEl!: HTMLElement;
  private joystickKnobEl!: HTMLElement;

  // Three.js Core
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animRafId: number | null = null;
  private isDestroyed = false;

  // 3D Objects
  private ballGroup!: THREE.Group;
  private ballMesh!: THREE.Mesh;
  private sprite!: THREE.Sprite;
  private shadowMesh!: THREE.Mesh;
  private platformGroup!: THREE.Group;
  private arenaRingMesh!: THREE.Mesh;
  private themePointLight!: THREE.PointLight;

  // Collectibles Array
  private collectibles: Array<{
    sprite: CollectibleVisual;
    pos: THREE.Vector3;
    phase: number;
  }> = [];

  // Particles
  private sparkles: Array<{
    mesh: THREE.Mesh;
    vel: THREE.Vector3;
    life: number;
    maxLife: number;
  }> = [];

  // Physics & Movement Simulation (Expansive Arena R = 6.8m, exact in-game Player.ts physics)
  private readonly ballRadius = 0.75;
  private readonly arenaRadius = 6.8;
  private readonly baseScale = this.ballRadius * 1.85;
  private readonly velocity = new THREE.Vector3();
  private smoothedInputX = 0;
  private smoothedInputZ = 0;
  private throttleFactor = 0;
  private collectedCount = 0;
  private lastTime = performance.now();
  private simTime = 0;

  // Animation State (normal, move, scary, happy)
  private animState: CharacterState = "normal";
  private currentTextureKey = "";
  private happyTimer = 0;
  private flipTimer = 0;

  // Input State
  private readonly keysDown = new Set<string>();
  private isPointerDown = false;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private pointerAxisX = 0;
  private pointerAxisZ = 0;

  // Bound Event Handlers for Cleanup
  private readonly handleKeyDown = (e: KeyboardEvent) => this.onKeyDown(e);
  private readonly handleKeyUp = (e: KeyboardEvent) => this.onKeyUp(e);
  private readonly handlePointerDown = (e: PointerEvent) => this.onPointerDown(e);
  private readonly handlePointerMove = (e: PointerEvent) => this.onPointerMove(e);
  private readonly handlePointerUp = (e: PointerEvent) => this.onPointerUp(e);
  private readonly handleResize = () => this.onResize();

  constructor(
    parent: HTMLElement,
    initialCharId: string,
    callbacks: CharacterPreviewCallbacks,
    initialSkinId = "normal",
    private readonly graphicsQuality:GraphicsQuality='medium'
  ) {
    this.container = parent;
    this.callbacks = callbacks;
    this.currentChar = getCharacterById(initialCharId, initialSkinId);
    SpriteTextures.preloadCharacterSkin(this.currentChar.id, this.currentChar.skinId);

    this.buildDOM();
    this.initThree();
    this.bindEvents();
    this.updateCharacterVisuals();
    this.startLoop();
  }

  private buildDOM(): void {
    this.container.innerHTML = `
      <div class="char-preview-card" style="--theme-color: ${this.currentChar.themeColor}">
        <div class="char-preview-header">
          <div class="char-preview-badge">
            <span class="char-preview-badge-emoji">${this.currentChar.collectibleEmoji}</span>
            <span class="char-preview-badge-name">${this.currentChar.name}</span>
          </div>
          <div class="char-preview-status">
            <span class="char-status-dot"></span>
            <span>Área de Prueba 3D</span>
          </div>
        </div>

        <div class="char-preview-canvas-wrap">
          <canvas class="char-preview-canvas"></canvas>

          <!-- Controls Guide Overlay -->
          <div class="char-preview-guide">
            <span class="guide-key">W</span>
            <span class="guide-key">A</span>
            <span class="guide-key">S</span>
            <span class="guide-key">D</span>
            <span class="guide-sep">/</span>
            <span class="guide-text">Flechas o Arrastra el ratón / táctil</span>
          </div>

          <!-- Virtual Joystick Indicator for Pointer Drag -->
          <div class="char-preview-joystick" style="display: none;">
            <div class="char-joystick-knob"></div>
          </div>

          <!-- Mini Collectible Counter -->
          <div class="char-preview-score" title="¡Recoge los objetos en el circuito!">
            <span class="char-score-emoji">${this.currentChar.collectibleEmoji}</span>
            <span class="char-score-count">0</span>
          </div>

          <!-- Quick Reset Ball Button -->
          <button class="char-btn-reset-ball" title="Centrar bola y reiniciar objetos">↺</button>
        </div>
      </div>
    `;

    this.cardEl = this.container.querySelector(".char-preview-card")!;
    this.canvasWrapEl = this.container.querySelector(".char-preview-canvas-wrap")!;
    this.canvasEl = this.container.querySelector(".char-preview-canvas")!;
    this.badgeNameEl = this.container.querySelector(".char-preview-badge-name")!;
    this.badgeEmojiEl = this.container.querySelector(".char-preview-badge-emoji")!;
    this.scoreCountEl = this.container.querySelector(".char-score-count")!;
    this.scoreEmojiEl = this.container.querySelector(".char-score-emoji")!;
    this.joystickEl = this.container.querySelector(".char-preview-joystick")!;
    this.joystickKnobEl = this.container.querySelector(".char-joystick-knob")!;

    this.container.querySelector(".char-btn-reset-ball")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.resetBallPosition();
    });

    this.renderCollectibleIcons();
  }

  private initThree(): void {
    const width = this.canvasWrapEl.clientWidth || 440;
    const height = this.canvasWrapEl.clientHeight || 420;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera (Zoomed in on character for heroic character-select framing)
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 80);
    this.camera.position.set(0, this.ballRadius + 2.3, 4.8);
    this.camera.lookAt(0, this.ballRadius + 0.15, 0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasEl,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(6, 12, 8);
    this.scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x90caf9, 0.7);
    fillLight.position.set(-8, 8, -6);
    this.scene.add(fillLight);

    this.themePointLight = new THREE.PointLight(
      new THREE.Color(this.currentChar.themeColor),
      3.5,
      22.0
    );
    this.themePointLight.position.set(0, 4.0, 0);
    this.scene.add(this.themePointLight);

    // 5. Build Arena Platform (Expansive R = 7.2m)
    this.buildArenaPlatform();

    // 6. Build Player Ball & Character Sprite
    this.buildPlayerBall();

    // 7. Build Multiple Collectibles around the track
    this.buildCollectibles();
  }

  private buildArenaPlatform(): void {
    this.platformGroup = new THREE.Group();

    // Main circular base (Radius 7.2m)
    const baseGeo = new THREE.CylinderGeometry(7.2, 7.35, 0.45, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x141d2b,
      roughness: 0.35,
      metalness: 0.45
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.225;
    this.platformGroup.add(baseMesh);

    // Checkered / radial disc surface
    const floorCanvas = document.createElement("canvas");
    floorCanvas.width = 512;
    floorCanvas.height = 512;
    const ctx = floorCanvas.getContext("2d")!;
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 512, 512);

    // Concentric circle tracks & radial spokes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 2.5;
    for (let r = 35; r < 250; r += 28) {
      ctx.beginPath();
      ctx.arc(256, 256, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let i = 0; i < 12; i++) {
      const ang = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(256, 256);
      ctx.lineTo(256 + Math.cos(ang) * 250, 256 + Math.sin(ang) * 250);
      ctx.stroke();
    }

    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    const topFloorGeo = new THREE.CircleGeometry(7.2, 64);
    const topFloorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.2,
      metalness: 0.5
    });
    const topFloor = new THREE.Mesh(topFloorGeo, topFloorMat);
    topFloor.rotation.x = -Math.PI / 2;
    topFloor.position.y = 0.001;
    this.platformGroup.add(topFloor);

    // Glowing rim neon ring
    const ringGeo = new THREE.RingGeometry(7.05, 7.25, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.currentChar.themeColor),
      side: THREE.DoubleSide
    });
    this.arenaRingMesh = new THREE.Mesh(ringGeo, ringMat);
    this.arenaRingMesh.rotation.x = -Math.PI / 2;
    this.arenaRingMesh.position.y = 0.003;
    this.platformGroup.add(this.arenaRingMesh);

    // Platform drop shadow underneath
    const shadowGeo = new THREE.RingGeometry(0, 7.6, 64);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide
    });
    const platformShadow = new THREE.Mesh(shadowGeo, shadowMat);
    platformShadow.rotation.x = -Math.PI / 2;
    platformShadow.position.y = -0.46;
    this.platformGroup.add(platformShadow);

    this.scene.add(this.platformGroup);
  }

  private buildPlayerBall(): void {
    this.ballGroup = new THREE.Group();
    this.ballGroup.position.set(0, this.ballRadius, 0);

    // 1. Inner 2D Billboard Sprite
    const spriteTexture = SpriteTextures.getCharacterTexture(this.currentChar.id, "normal", this.currentChar.skinId);
    const spriteMaterial = createCharacterSpriteMaterial(spriteTexture);
    this.sprite = new THREE.Sprite(spriteMaterial);
    this.sprite.scale.set(this.baseScale, this.baseScale, 1);
    this.sprite.position.set(0, 0, 0);
    this.sprite.renderOrder = 20;
    this.ballGroup.add(this.sprite);

    // 2. Transparent Glossy Outer Ball Mesh with character-custom stripe
    const sphereGeometry = new THREE.SphereGeometry(this.ballRadius, 32, 24);
    const sphereTexture = SpriteTextures.getSphereTexture(this.currentChar.id);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      map: sphereTexture,
      transparent: true,
      opacity: 0.55,
      shininess: 95,
      specular: new THREE.Color(0xffffff),
      depthWrite: false,
      side: THREE.FrontSide
    });
    this.ballMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.ballMesh.renderOrder = 21;
    this.ballGroup.add(this.ballMesh);

    this.scene.add(this.ballGroup);

    // 3. Drop Shadow Mesh below the ball on the platform
    const shadowGeo = new THREE.CircleGeometry(0.68, 28);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.42
    });
    this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowMesh.rotation.x = -Math.PI / 2;
    this.shadowMesh.position.set(0, 0.005, 0);
    this.scene.add(this.shadowMesh);
  }

  private buildCollectibles(): void {
    this.collectibles = [];

    // Place 3 floating collectibles at different angles around the expanded arena
    const initialAngles = [0.2, (Math.PI * 2) / 3, (Math.PI * 4) / 3 + 0.4];
    initialAngles.forEach((ang, idx) => {
      const sprite = new CollectibleVisual(this.currentChar.collectibleId,this.graphicsQuality);
      sprite.scale.setScalar(.9);

      const rad = 3.2 + (idx % 2) * 0.8;
      const pos = new THREE.Vector3(Math.cos(ang) * rad, 0.65, Math.sin(ang) * rad);
      sprite.position.copy(pos);
      sprite.renderOrder = 18;

      this.scene.add(sprite);
      this.collectibles.push({
        sprite,
        pos,
        phase: idx * 1.5
      });
    });
  }

  /**
   * Switch the active previewed character dynamically!
   */
  setCharacter(charId: string, skinId = "normal"): void {
    const next = getCharacterById(charId, skinId);
    if (this.currentChar.id === next.id && this.currentChar.skinId === next.skinId) return;
    SpriteTextures.preloadCharacterSkin(next.id, next.skinId);
    if (this.currentChar.id === next.id) {
      this.currentChar = next;
      this.currentTextureKey = "";
      this.updateCharacterVisuals();
      return;
    }
    this.currentChar = next;
    this.collectedCount = 0;
    this.scoreCountEl.textContent = "0";
    this.throttleFactor = 0;
    this.smoothedInputX = 0;
    this.smoothedInputZ = 0;
    this.velocity.set(0, 0, 0);
    this.ballGroup.position.set(0, this.ballRadius, 0);
    this.shadowMesh.position.set(0, 0.005, 0);
    this.camera.position.set(0, this.ballRadius + 2.3, 4.8);
    this.camera.lookAt(0, this.ballRadius + 0.15, 0);
    this.animState = "happy";
    this.currentTextureKey = "";
    this.happyTimer = 0.8;
    this.updateCharacterVisuals();
    this.spawnSparkleBurst(this.ballGroup.position, 14, this.currentChar.themeColor);
    this.callbacks.onCharacterChanged?.(charId);
  }

  private setAnimationState(state: CharacterState): void {
    if (this.currentTextureKey === state) return;
    this.currentTextureKey = state;
    this.animState = state;
    const tex = SpriteTextures.getCharacterTexture(this.currentChar.id, state, this.currentChar.skinId);
    this.sprite.material.map = tex;
    this.sprite.material.needsUpdate = true;
  }

  private updateCharacterVisuals(): void {
    // 1. Update DOM texts & theme color
    this.cardEl.style.setProperty("--theme-color", this.currentChar.themeColor);
    this.badgeNameEl.textContent = this.currentChar.name;
    this.renderCollectibleIcons();

    // 2. Update Inner 3D Character Sprite
    const newTex = SpriteTextures.getCharacterTexture(this.currentChar.id, this.animState, this.currentChar.skinId);
    this.sprite.material.map = newTex;
    this.sprite.material.needsUpdate = true;

    // 3. Update Point Light & Platform Rim Color
    const themeCol = new THREE.Color(this.currentChar.themeColor);
    this.themePointLight.color.copy(themeCol);
    (this.arenaRingMesh.material as THREE.MeshBasicMaterial).color.copy(themeCol);

    // 4. Update Collectibles Texture
    this.collectibles.forEach(c => {
      c.sprite.setKind(this.currentChar.collectibleId);
    });

    // 5. Update Outer Ball Mesh Stripe Texture per character
    const newSphereTex = SpriteTextures.getSphereTexture(this.currentChar.id);
    (this.ballMesh.material as THREE.MeshPhongMaterial).map = newSphereTex;
    (this.ballMesh.material as THREE.MeshPhongMaterial).needsUpdate = true;
  }

  private renderCollectibleIcons(): void {
    if (this.badgeEmojiEl) {
      const itemCvs1 = SpriteTextures.getCollectibleCanvas(this.currentChar.collectibleId, 22);
      itemCvs1.style.cssText = "display: block; width: 22px; height: 22px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.45));";
      this.badgeEmojiEl.innerHTML = "";
      this.badgeEmojiEl.appendChild(itemCvs1);
    }
    if (this.scoreEmojiEl) {
      const itemCvs2 = SpriteTextures.getCollectibleCanvas(this.currentChar.collectibleId, 20);
      itemCvs2.style.cssText = "display: block; width: 20px; height: 20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.45));";
      this.scoreEmojiEl.innerHTML = "";
      this.scoreEmojiEl.appendChild(itemCvs2);
    }
  }

  private resetBallPosition(): void {
    this.ballGroup.position.set(0, this.ballRadius, 0);
    this.velocity.set(0, 0, 0);
    this.smoothedInputX = 0;
    this.smoothedInputZ = 0;
    this.throttleFactor = 0;
    this.animState = "normal";
    this.happyTimer = 0;
    this.setAnimationState("normal");
    this.ballMesh.rotation.set(0, 0, 0);
    this.shadowMesh.position.set(0, 0.005, 0);
    this.camera.position.set(0, this.ballRadius + 2.3, 4.8);
    this.camera.lookAt(0, this.ballRadius + 0.15, 0);
    this.collectedCount = 0;
    this.scoreCountEl.textContent = "0";

    // Reset collectibles positions
    const initialAngles = [0.2, (Math.PI * 2) / 3, (Math.PI * 4) / 3 + 0.4];
    this.collectibles.forEach((c, idx) => {
      const rad = 3.6 + (idx % 2) * 0.8;
      c.pos.set(Math.cos(initialAngles[idx]) * rad, 0.65, Math.sin(initialAngles[idx]) * rad);
      c.sprite.position.copy(c.pos);
    });

    AudioManager.getInstance().playClick();
  }

  private bindEvents(): void {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("resize", this.handleResize);

    // Pointer events on canvas container for mouse/touch virtual joystick & drag
    this.canvasWrapEl.addEventListener("pointerdown", this.handlePointerDown);
    window.addEventListener("pointermove", this.handlePointerMove);
    window.addEventListener("pointerup", this.handlePointerUp);
    window.addEventListener("pointercancel", this.handlePointerUp);
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    const code = e.code;
    if (
      code === "KeyW" || code === "KeyA" || code === "KeyS" || code === "KeyD" ||
      code === "ArrowUp" || code === "ArrowLeft" || code === "ArrowDown" || code === "ArrowRight"
    ) {
      this.keysDown.add(code);
      e.preventDefault();
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.keysDown.delete(e.code);
  }

  private onPointerDown(e: PointerEvent): void {
    this.isPointerDown = true;
    const rect = this.canvasWrapEl.getBoundingClientRect();
    this.pointerStartX = e.clientX - rect.left;
    this.pointerStartY = e.clientY - rect.top;

    this.joystickEl.style.display = "block";
    this.joystickEl.style.left = `${this.pointerStartX}px`;
    this.joystickEl.style.top = `${this.pointerStartY}px`;
    this.joystickKnobEl.style.transform = `translate(0px, 0px)`;

    this.pointerAxisX = 0;
    this.pointerAxisZ = 0;
  }

  private onPointerMove(e: PointerEvent): void {
    if (!this.isPointerDown) return;
    const rect = this.canvasWrapEl.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    const dx = curX - this.pointerStartX;
    const dy = curY - this.pointerStartY;
    const maxRadius = 45;
    const dist = Math.hypot(dx, dy);

    let clampedDist = dist;
    let normX = 0;
    let normY = 0;
    if (dist > 0.001) {
      normX = dx / dist;
      normY = dy / dist;
      clampedDist = Math.min(dist, maxRadius);
    }

    const knobX = normX * clampedDist;
    const knobY = normY * clampedDist;
    this.joystickKnobEl.style.transform = `translate(${knobX}px, ${knobY}px)`;

    this.pointerAxisX = (knobX / maxRadius);
    this.pointerAxisZ = (knobY / maxRadius);
  }

  private onPointerUp(_e: PointerEvent): void {
    this.isPointerDown = false;
    this.pointerAxisX = 0;
    this.pointerAxisZ = 0;
    this.joystickEl.style.display = "none";
  }

  private onResize(): void {
    if (this.isDestroyed || !this.renderer) return;
    const width = this.canvasWrapEl.clientWidth || 440;
    const height = this.canvasWrapEl.clientHeight || 420;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private startLoop(): void {
    const loop = (time: number) => {
      if (this.isDestroyed) return;
      const dt = Math.min(0.05, (time - this.lastTime) / 1000);
      this.lastTime = time;
      this.simTime += dt;

      this.updatePhysics(dt);
      this.updateCollectibles();
      this.updateSparkles(dt);

      this.renderer.render(this.scene, this.camera);
      this.animRafId = requestAnimationFrame(loop);
    };

    this.animRafId = requestAnimationFrame(loop);
  }

  private updatePhysics(dt: number): void {
    // 1. Gather raw input from keyboard
    let keyX = 0;
    let keyZ = 0;
    if (this.keysDown.has("KeyA") || this.keysDown.has("ArrowLeft")) keyX -= 1;
    if (this.keysDown.has("KeyD") || this.keysDown.has("ArrowRight")) keyX += 1;
    if (this.keysDown.has("KeyW") || this.keysDown.has("ArrowUp")) keyZ -= 1;
    if (this.keysDown.has("KeyS") || this.keysDown.has("ArrowDown")) keyZ += 1;

    // Combine keyboard and pointer/joystick input
    let rawX = keyX + this.pointerAxisX;
    let rawZ = keyZ + this.pointerAxisZ;
    const rawMag = Math.hypot(rawX, rawZ);
    if (rawMag > 1.0) {
      rawX /= rawMag;
      rawZ /= rawMag;
    }

    // 2. Progressive input smoothing (simulates stage tilt inertia with fine precision, exact match to Player.ts)
    const isReversingX = (rawX > 0 && this.smoothedInputX < 0) || (rawX < 0 && this.smoothedInputX > 0);
    const isReversingZ = (rawZ > 0 && this.smoothedInputZ < 0) || (rawZ < 0 && this.smoothedInputZ > 0);

    const handlingMod = 0.55 + 0.55 * this.currentChar.handling;
    const rampSpeed = ((rawX === 0 && rawZ === 0) ? 6.0 : (isReversingX || isReversingZ) ? 8.5 : 2.5) * handlingMod;
    const lerpFactor = 1-Math.exp(-dt*rampSpeed);

    this.smoothedInputX += (rawX - this.smoothedInputX) * lerpFactor;
    this.smoothedInputZ += (rawZ - this.smoothedInputZ) * lerpFactor;

    const inputMagnitude = Math.hypot(this.smoothedInputX, this.smoothedInputZ);

    // 3. Staged progressive throttle ramp-up matching in-game Player.ts
    if (inputMagnitude > 0.02 && rawMag>.02) {
      this.throttleFactor = Math.min(1.0, this.throttleFactor + dt * 0.85);

      const normX = this.smoothedInputX / inputMagnitude;
      const normZ = this.smoothedInputZ / inputMagnitude;

      // Progressive curve matching Player.ts:
      // Tier 1 (micro-corrections): gentle 24% power floor
      // Tier 2 (steady roll): progressive rise as throttle accumulates
      // Tier 3 (fast cruise): full top speed matching normal in-game stages
      const progressivePower = (0.24 + 0.86 * Math.pow(this.throttleFactor, 1.25)) * Math.min(1.0, Math.pow(inputMagnitude, 1.1));
      // Lightweight rolling approximation for the small preview arena, using the game's tuning.
      const rollingMass=(4/3)*Math.PI*Math.pow(.75,3)*1.4;
      const baseAccel = PLAYER_DRIVE_FORCE*this.currentChar.acceleration*
        (1+PLAYER_ROLLING_TORQUE*this.currentChar.handling)/rollingMass;
      const appliedAcceleration = baseAccel * progressivePower;

      let forceX = normX * appliedAcceleration * dt;
      let forceZ = normZ * appliedAcceleration * dt;

      const curSpeed = Math.hypot(this.velocity.x, this.velocity.z);

      // Active Counter-Braking: If user steers opposite to moving direction, apply responsive braking scaled by handling
      const moveDot = (this.velocity.x * forceX + this.velocity.z * forceZ);
      if (moveDot < 0 && curSpeed > 0.6) {
        const brakeMult = 1.0 + 2.5 * Math.pow(this.currentChar.handling, 2);
        forceX *= brakeMult;
        forceZ *= brakeMult;
      }

      // Active Handling Mechanics: Lateral Grip vs Centrifugal Drift (Exact match to Player.ts)
      // High handling (Misi 0.95, Pao 0.90) grips and snaps trajectory tightly into corners.
      // Lower handling (Adri 0.75) drifts outwards with heavier momentum in fast turns.
      if (curSpeed > 0.6) {
        const forceMag = Math.hypot(forceX, forceZ);
        if (forceMag > 0.0001) {
          const uFx = forceX / forceMag;
          const uFz = forceZ / forceMag;

          // Decompose velocity into forward and lateral components
          const forwardDot = (this.velocity.x * uFx + this.velocity.z * uFz);
          const lateralVelX = this.velocity.x - forwardDot * uFx;
          const lateralVelZ = this.velocity.z - forwardDot * uFz;

          const gripFactor = Math.pow(this.currentChar.handling, 3.2) * 1.25;
          const lateralCorrection = 1-Math.exp(-dt*4.8*gripFactor*Math.min(1,rawMag));

          this.velocity.x -= lateralVelX * lateralCorrection;
          this.velocity.z -= lateralVelZ * lateralCorrection;
        }
      }

      this.velocity.x += forceX;
      this.velocity.z += forceZ;
    } else {
      // Fade throttle accumulator when input is released
      this.throttleFactor = Math.max(0, this.throttleFactor - dt * 2.5);
    }

    // Approximate the combined linear/angular resistance of a rolling sphere on flat ground.
    const damping = Math.exp(-((.12+.4*.16)/1.4)*dt);
    this.velocity.x *= damping;
    this.velocity.z *= damping;

    // The same top-speed percentages as the real character: 120 / 102 / 102 / 96 km/h.
    const maxSpeed = PLAYER_TOP_SPEED * this.currentChar.speed;
    const newSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    if (newSpeed > maxSpeed) {
      const scale = maxSpeed / newSpeed;
      this.velocity.x *= scale;
      this.velocity.z *= scale;
    }

    // Stop tiny residual crawl when idle
    if (inputMagnitude <= 0.02 && newSpeed < 0.04) {
      this.velocity.set(0, 0, 0);
    }

    // 6. Integrate position
    this.ballGroup.position.x += this.velocity.x * dt;
    this.ballGroup.position.z += this.velocity.z * dt;

    // 7. Arena Circular Boundary constraint & elastic rebound (R = 6.8m)
    const distFromCenter = Math.hypot(this.ballGroup.position.x, this.ballGroup.position.z);
    if (distFromCenter > this.arenaRadius) {
      const nx = this.ballGroup.position.x / distFromCenter;
      const nz = this.ballGroup.position.z / distFromCenter;
      this.ballGroup.position.x = nx * this.arenaRadius;
      this.ballGroup.position.z = nz * this.arenaRadius;

      // Cushioned rebound bounce
      const dot = this.velocity.x * nx + this.velocity.z * nz;
      if (dot > 0) {
        this.velocity.x -= 1.25 * dot * nx;
        this.velocity.z -= 1.25 * dot * nz;
        if (newSpeed > 1.2) {
          AudioManager.getInstance().playBounce();
          this.spawnSparkleBurst(this.ballGroup.position, 6, "#ffffff");
        }
      }
    }

    // 8. 3D Ball Mesh Visual Rotation (matches physical rolling)
    const finalSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    if (finalSpeed > 0.01) {
      const rollAngle = (finalSpeed * dt) / this.ballRadius;
      const rotAxis = new THREE.Vector3(-this.velocity.z, 0, this.velocity.x).normalize();
      this.ballMesh.rotateOnWorldAxis(rotAxis, rollAngle);
    }

    // 9. Dynamic Character Animation State Machine inside the ball:
    // 1. happy: Collecting item or victory bounce
    // 2. scary1 / scary2: High speed (>= 9.0), alternating frames
    // 3. move1 / move2: Walking/running, alternating stride steps
    // 4. normal: Idle breathing / bobbing
    if (this.happyTimer > 0) {
      this.happyTimer -= dt;
      this.setAnimationState("happy");
      this.sprite.position.x = 0;
      this.sprite.position.y = Math.abs(Math.sin(this.simTime * 10.0)) * 0.035;
    } else if (finalSpeed >= 9.0) {
      this.flipTimer += dt * 12.0;
      const isAlt = (Math.floor(this.flipTimer) % 2) === 1;
      this.setAnimationState(isAlt ? "scary2" : "scary1");
      this.sprite.position.x = 0;
      this.sprite.position.y = Math.abs(Math.sin(this.flipTimer * Math.PI)) * 0.008;
    } else if (finalSpeed >= 0.35) {
      const stepRate = 3.2 + (finalSpeed / 9.0) * 6.5;
      this.flipTimer += dt * stepRate;
      const isAlt = (Math.floor(this.flipTimer) % 2) === 1;
      this.setAnimationState(isAlt ? "move2" : "move1");
      this.sprite.position.x = 0;
      this.sprite.position.y = Math.abs(Math.sin(this.flipTimer * Math.PI)) * 0.012;
    } else {
      this.setAnimationState("normal");
      this.sprite.position.x = 0;
      this.sprite.position.y = Math.sin(this.simTime * 3.5) * 0.006;
    }

    // The illustrated character faces the camera; rolling belongs to the outer ball.
    this.sprite.material.rotation = 0;

    // 10. Drop Shadow tracking
    this.shadowMesh.position.x = this.ballGroup.position.x;
    this.shadowMesh.position.z = this.ballGroup.position.z;

    // 11. Point Light following character with glow
    this.themePointLight.position.set(
      this.ballGroup.position.x,
      this.ballGroup.position.y + 2.5,
      this.ballGroup.position.z + 1.2
    );

    // 12. Zoomed-in Camera Follow (Heroic Character-Select Framing)
    const targetCamX = this.ballGroup.position.x;
    const targetCamY = this.ballGroup.position.y + 2.3;
    const targetCamZ = this.ballGroup.position.z + 4.8;
    const camFollowSpeed = 12.0;
    const camFactor = 1 - Math.exp(-camFollowSpeed * dt);

    this.camera.position.x += (targetCamX - this.camera.position.x) * camFactor;
    this.camera.position.y += (targetCamY - this.camera.position.y) * camFactor;
    this.camera.position.z += (targetCamZ - this.camera.position.z) * camFactor;

    this.camera.lookAt(
      this.ballGroup.position.x,
      this.ballGroup.position.y + 0.15,
      this.ballGroup.position.z
    );
  }

  private updateCollectibles(): void {
    this.collectibles.forEach(c => {
      // Bobbing
      c.sprite.position.y = 0.65 + Math.sin(this.simTime * 3.2 + c.phase) * 0.12;
      c.sprite.animate(this.simTime,c.phase);

      // Check collision with player ball
      const dist = Math.hypot(
        this.ballGroup.position.x - c.sprite.position.x,
        this.ballGroup.position.z - c.sprite.position.z
      );

      if (dist < 1.1) {
        // Pick up item!
        this.collectedCount++;
        this.scoreCountEl.textContent = String(this.collectedCount);
        this.happyTimer = 1.2; // Celebratory victory smile & hop
        AudioManager.getInstance().playCollect();

        // Sparkle burst
        this.spawnSparkleBurst(c.sprite.position, 14, this.currentChar.themeColor);

        // Relocate item to a new random spot on the platform
        const ang = Math.random() * Math.PI * 2;
        const rad = 2.8 + Math.random() * 3.2;
        c.pos.set(Math.cos(ang) * rad, 0.65, Math.sin(ang) * rad);
        c.sprite.position.copy(c.pos);
      }
    });
  }

  private spawnSparkleBurst(center: THREE.Vector3, count = 10, colorHex = "#ffd700"): void {
    const geo = new THREE.SphereGeometry(0.08, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(colorHex) });

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(center);
      mesh.position.y += 0.2;

      const ang = Math.random() * Math.PI * 2;
      const speed = 1.4 + Math.random() * 2.8;
      const vel = new THREE.Vector3(
        Math.cos(ang) * speed,
        1.8 + Math.random() * 2.2,
        Math.sin(ang) * speed
      );

      this.scene.add(mesh);
      this.sparkles.push({
        mesh,
        vel,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.3
      });
    }
  }

  private updateSparkles(dt: number): void {
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const sp = this.sparkles[i];
      sp.life += dt;
      if (sp.life >= sp.maxLife) {
        this.scene.remove(sp.mesh);
        sp.mesh.geometry.dispose();
        this.sparkles.splice(i, 1);
        continue;
      }

      sp.vel.y -= 7.0 * dt; // Gravity
      sp.mesh.position.x += sp.vel.x * dt;
      sp.mesh.position.y += sp.vel.y * dt;
      sp.mesh.position.z += sp.vel.z * dt;

      const progress = sp.life / sp.maxLife;
      const scale = (1.0 - progress) * 0.08;
      sp.mesh.scale.set(scale, scale, scale);
    }
  }

  destroy(): void {
    this.isDestroyed = true;
    if (this.animRafId !== null) {
      cancelAnimationFrame(this.animRafId);
      this.animRafId = null;
    }

    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("resize", this.handleResize);

    this.canvasWrapEl.removeEventListener("pointerdown", this.handlePointerDown);
    window.removeEventListener("pointermove", this.handlePointerMove);
    window.removeEventListener("pointerup", this.handlePointerUp);
    window.removeEventListener("pointercancel", this.handlePointerUp);

    // Dispose sparkles
    for (const sp of this.sparkles) {
      this.scene.remove(sp.mesh);
      sp.mesh.geometry.dispose();
    }
    this.sparkles = [];

    // Dispose collectibles
    for (const col of this.collectibles) {
      this.scene.remove(col.sprite);
      col.sprite.dispose();
    }
    this.collectibles = [];

    // Dispose Three.js objects
    if (this.renderer) {
      this.renderer.dispose();
    }
    this.container.innerHTML = "";
  }
}
