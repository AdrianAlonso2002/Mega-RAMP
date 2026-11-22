import { assetUrl } from "../core/AssetUrl";
import * as THREE from "three";
import {stageStartYaw} from '../rendering/StageHeading';
import {fluidCameraSubmerged} from "../rendering/FluidContact";
import {loadFirstUIImage} from '../ui/UIAssets';
import type { Renderer } from "../rendering/Renderer";
import type { Camera } from "../rendering/Camera";
import type { InputManager, InputAxis } from "../input/InputManager";
import type { PhysicsWorld } from "../physics/PhysicsWorld";
import type { GameState } from "./GameState";
import type { ProgressionManager } from "../progression/ProgressionManager";
import type { HUD } from "../ui/HUD";
import type { TouchControls } from "../ui/TouchControls";
import { Player } from "../player/Player";
import { SpriteTextures } from "../rendering/SpriteTextures";
import {CollectibleVisual} from '../rendering/CollectibleVisual';
import { LevelLoader } from "../levels/LevelLoader";
import {PreparedLevel} from '../levels/PreparedLevel';
import { LevelBuilder, type BuiltLevel } from "../levels/LevelBuilder";
import { getCharacterById } from "../player/Characters";
import { getWorldById, getSkyThemeById } from "../levels/WorldDefinitions";
import { AudioManager } from "../audio/AudioManager";
import type { LevelData } from "../levels/LevelTypes";
import {artDirection} from '../rendering/ArtDirection';
import {ContactShadows} from '../rendering/ContactShadows';
import {WorldAtmosphere} from '../rendering/WorldAtmosphere';

export interface SceneContext {
  renderer: Renderer;
  camera: Camera;
  input: InputManager;
  touchControls: TouchControls;
  physics: PhysicsWorld;
  state: GameState;
  progression: ProgressionManager;
  hud: HUD;
  onStageClear: () => void;
  onGameOver: () => void;
}

export class SceneManager {
  readonly scene = new THREE.Scene();

  getPlayerSpeed():number {
    if(!this.player || this.player.isFrozen() || this.isIntroActive || this.isOutroActive) return 0;
    const velocity=this.player.linvel();
    return Math.hypot(velocity.x,velocity.y,velocity.z);
  }

  private context?: SceneContext;
  private readonly levelLoader = new LevelLoader();
  private readonly preparedLevel=new PreparedLevel((world,level,stage)=>this.levelLoader.loadStage(world,level,stage));
  private readonly levelBuilder = new LevelBuilder();
  private readonly audio = AudioManager.getInstance();

  private player: Player | null = null;
  private currentLevel: BuiltLevel | null = null;
  private currentLevelData: LevelData | null = null;

  private isStageCompleted = false;
  private isGameOverTriggered = false;
  private respawnCooldown = 0;
  private gameOverTimeoutId: number | null = null;
  private stageClearTimeoutId: number | null = null;

  private ambientLight: THREE.HemisphereLight | null = null;
  private directionalLight: THREE.DirectionalLight | null = null;
  private fillLight: THREE.DirectionalLight | null = null;
  private skydomeMesh: THREE.Mesh | null = null;
  private readonly contactShadows=new ContactShadows();
  private readonly atmosphere=new WorldAtmosphere();
  private readonly visualFocus=new THREE.Vector3();
  private readonly horizonColor={value:new THREE.Color(0xb2c9be)};
  private readonly horizonStrength={value:.14};
  private artPreview?:LevelData;
  private readonly skyboxTextureCache = new Map<string, THREE.CanvasTexture>();
  private readonly environmentLoads=new Map<string,Promise<void>>();
  private activeEnvironmentKey = "";

  // Underwater & Submerged Camera Atmosphere
  private readonly waterFog = new THREE.FogExp2(0x0077b6, 0.024);
  // Keep the same fog shader variant ready before play, avoiding compilation on water entry.
  private readonly clearFog = new THREE.FogExp2(0x0077b6, 0);
  private readonly kitsuneFog=new THREE.FogExp2(0x091431,.015);
  private kitsuneDark=false;
  private readonly honeyFog = new THREE.FogExp2(0xb45309, 0.030);
  private readonly lavaFog = new THREE.FogExp2(0xc2410c, 0.035);
  private isUnderwaterActive = false;
  private currentUnderwaterFluid: "water" | "honey" | "lava" | null = null;

  // Nocturnal Pitch-Black Route Atmosphere (M3-N4-E9: Ruta Nocturna)
  private readonly pitchBlackFog = new THREE.Fog(0x000000, 5.0, 13.5);
  private isPitchBlackMode = false;
  private playerSpotlight: THREE.SpotLight | null = null;
  private playerSpotlightTarget: THREE.Object3D | null = null;
  private playerPointLight: THREE.PointLight | null = null;
  private playerLightDisc: THREE.Mesh | null = null;

  // Pre-allocated vector for distance checks
  private readonly tempDiff = new THREE.Vector3();
  private readonly tempGoalInvQuat = new THREE.Quaternion();
  private readonly tempGoalQuat = new THREE.Quaternion();
  private readonly mergedInput: InputAxis = { horizontal: 0, vertical: 0 };

  // Cinematic 360 Fly-in Intro Animation
  private isIntroActive = false;
  private introTime = 0;
  private readonly introDuration = 5.2; // Slower, expansive cinematic 360 orbit by default
  private readonly introCenter = new THREE.Vector3();
  private readonly introSpawn = new THREE.Vector3();
  private introHeading=0;
  private isPointerRushing = false;

  // Victory 360 Orbit Outro Animation (Goal Teleport Celebration)
  private isOutroActive = false;
  private outroTime = 0;
  private readonly outroDuration = 2.4;
  private readonly outroTarget = new THREE.Vector3();
  private outroStartAngle = 0;
  private outroStartRadius = 6.8;
  private outroStartHeight = 3.2;

  // Water & Lava Interaction Timers
  private waterRippleSpawnTimer = 0;
  private waterWakeTimer = 0;
  private lavaStoppedTimer = 0;
  private flooStillTimer = 0;
  private flooPhase: "idle" | "erupting" | "destination" = "idle";
  private flooFlameTimer = 0;
  private flooDestFlameGroup: THREE.Group | null = null;
  private lastFlooAlertStep = 0;
  private playerWasInWater = false;

  // Ultra-realistic Procedural VFX Pools (zero-allocation at 60 FPS)
  private readonly vfxGroup = new THREE.Group();
  private waterRipples: Array<{
    mesh: THREE.Mesh;
    active: boolean;
    life: number;
    maxLife: number;
  }> = [];
  private splashDroplets: Array<{
    mesh: THREE.Mesh;
    active: boolean;
    vel: THREE.Vector3;
    life: number;
    maxLife: number;
    baseY: number;
  }> = [];
  private lavaSparks: Array<{
    mesh: THREE.Mesh;
    active: boolean;
    vel: THREE.Vector3;
    life: number;
    maxLife: number;
  }> = [];

  private currentQuality: "low" | "medium" | "high" = "medium";
  private currentSkyTexture: THREE.CanvasTexture | null = null;

  initialize(context: SceneContext): void {
    this.context = context;
    this.scene.fog = this.clearFog;
    this.currentQuality = this.context.progression.getGraphicsQuality();

    window.addEventListener("pointerdown", () => {
      if (this.isIntroActive) {
        this.isPointerRushing = true;
      }
    });
    window.addEventListener("pointerup", () => {
      this.isPointerRushing = false;
    });

    this.scene.background = new THREE.Color(0x81d4fa);

    // Warm ambient light
    this.ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2.2);
    this.scene.add(this.ambientLight);

    // Sunlight
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
    this.directionalLight.userData.graphicsSun=true;
    this.directionalLight.position.set(20, 35, 15);
    this.scene.add(this.directionalLight);

    // Gentle fill light
    this.fillLight = new THREE.DirectionalLight(0x90caf9, 0.8);
    this.fillLight.position.set(-20, -10, -15);
    this.scene.add(this.fillLight);

    // Panoramic 360° skydome that wraps the entire world
    const skyGeo = new THREE.SphereGeometry(600, 48, 24);
    const skyMat = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false
    });
    this.skydomeMesh = new THREE.Mesh(skyGeo, skyMat);
    skyMat.onBeforeCompile=shader=>{
      shader.uniforms.artHorizonColor=this.horizonColor;shader.uniforms.artHorizonStrength=this.horizonStrength;
      shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform vec3 artHorizonColor;uniform float artHorizonStrength;')
        .replace('#include <map_fragment>','#include <map_fragment>\n#ifdef USE_MAP\nfloat artHorizon=exp(-pow((vMapUv.y-.48)*5.0,2.0));\ndiffuseColor.rgb=mix(diffuseColor.rgb,artHorizonColor,artHorizon*artHorizonStrength);\n#endif');
    };
    skyMat.customProgramCacheKey=()=> 'mega-ramp-horizon-v1';
    this.skydomeMesh.renderOrder = -1000;
    this.scene.add(this.skydomeMesh);
    this.scene.add(this.contactShadows.group,this.atmosphere.group);
    this.contactShadows.setQuality(this.currentQuality);this.atmosphere.setQuality(this.currentQuality);

    // Add VFX pool to scene
    this.scene.add(this.vfxGroup);
    this.initVFXPool();
  }

  async loadStage(world: number, level: number, stage: number, options:{signal?:AbortSignal;deferIntro?:boolean}={}): Promise<void> {
    if (!this.context) return;

    this.isStageCompleted = false;
    this.isGameOverTriggered = false;
    this.respawnCooldown = 2.0; // 2 seconds grace buffer on load

    // Reset stage timer & collectibles for each stage
    this.context.state.elapsedTime = 0;
    this.context.state.stageCollectibles = 0;
    this.context.hud.clearBanner();

    // 1. Clean previous stage & player and cancel any pending timers
    this.cleanupCurrentStage();

    // 2. Load World & Character definitions
    this.context.state.selectedSkin=this.context.progression.getSelectedSkin(this.context.state.selectedCharacter);
    const charDef = getCharacterById(this.context.state.selectedCharacter, this.context.state.selectedSkin);

    // Wrap the 3D world with the level panorama image and atmospheric depth blur
    const environmentReady=this.applyLevelEnvironment(world, level);
    this.audio.startLevel(world,level);

    // 3. Load Level Data (file or procedural)
    const levelData = await this.preparedLevel.getStage(world, level, stage);
    if(options.signal?.aborted||!this.context)return;
    this.currentLevelData = levelData;
    delete this.scene.userData.artPreviewData;this.artPreview=undefined;
    this.applyWorldLighting(world,level);

    // Configure cinematic camera mode for Tram, Bus, and Padel stages (Tranvia, Tranvia2, Bus35, Bus34, La Mina, Padel3)
    const stageName = levelData?.name || "";
    const isTranvia1 = stageName === "Tranvia" || (world === 2 && level === 2 && stage === 4);
    const isTranvia2 = stageName === "Tranvia2" || (world === 2 && level === 4 && stage === 1);
    const isBus35 = stageName === "Bus35" || (world === 4 && level === 1 && stage === 2) || (levelData?.id === "world-04-level-01-stage-02") || (levelData?.properties?.cameraMode === "cinematic_bus35");
    const isBus34 = stageName === "Bus34" || (world === 4 && level === 2 && stage === 1) || (levelData?.id === "world-04-level-02-stage-01") || (levelData?.properties?.cameraMode === "cinematic_bus34");
    const isMina = stageName === "La Mina" || (world === 4 && level === 2 && stage === 4) || (levelData?.id === "world-04-level-02-stage-04") || (levelData?.properties?.cameraMode === "cinematic_mina");
    const isPadel3 = stageName === "Padel3" || (world === 4 && level === 3 && stage === 4) || (levelData?.id === "world-04-level-03-stage-04") || (levelData?.properties?.cameraMode === "fixed_padel");
    this.context.camera.setCinematicTramMode(
      isTranvia1 ? "tranvia1" : isTranvia2 ? "tranvia2" : isBus35 ? "bus35" : isBus34 ? "bus34" : isMina ? "mina" : isPadel3 ? "fixed_padel" : null
    );

    // 4. Build Level 3D meshes & physics colliders
    this.currentLevel = this.levelBuilder.build(
      levelData,
      this.context.physics,
      charDef.collectibleId,
      this.currentQuality
    );
    this.scene.add(this.currentLevel.group);

    // 5. Create Player with glossy monkey ball & 2D billboard sprite
    this.player = new Player(
      charDef,
      this.context.physics,
      this.currentLevel.spawnPoint
    );
    this.scene.add(this.player.object);

    // 5.5. Configure nocturnal pitch-black route atmosphere (M3-N4-E9: Ruta Nocturna)
    this.checkAndApplyPitchBlackMode(world, level, stage, levelData);
    this.contactShadows.bind(levelData,this.currentLevel.group,this.currentLevel.collidableMeshes,true);

    // 6. Camera 360 Fly-in Intro Animation
    await environmentReady;
    if(options.signal?.aborted||!this.context)return;
    if(!options.deferIntro)this.startIntroAnimation();

    // 7. Update HUD (Displaying cumulative run collectibles over entire level total)
    const maxCol = this.getLevelMaxCollectibles();
    this.context.hud.setItemIcon(charDef.collectibleEmoji, charDef.collectibleId);
    this.context.hud.setStageInfo(world, level, stage, maxCol, levelData?.name);
    this.context.hud.update(
      this.context.state.lives,
      this.context.state.levelRunCollectibles,
      0,
      maxCol
    );
  }

  beginStageIntro():void {this.startIntroAnimation();}

  async prepareLevel(world:number,level:number,signal?:AbortSignal):Promise<void> {
    const stages=await this.preparedLevel.prepare(world,level,signal);
    if(signal?.aborted)return;
    await Promise.all([this.applyLevelEnvironment(world,level),SpriteTextures.prepareLevelAssets(stages)]);
  }

  loadCustomLevel(data: LevelData,options:{deferIntro?:boolean}={}): void {
    if (!this.context) return;

    this.isStageCompleted = false;
    this.respawnCooldown = 0;
    this.context.state.elapsedTime = 0;
    this.context.state.stageCollectibles = 0;
    this.context.hud.clearBanner();
    this.cleanupCurrentStage();

    this.context.state.selectedSkin=this.context.progression.getSelectedSkin(this.context.state.selectedCharacter);
    const charDef = getCharacterById(this.context.state.selectedCharacter, this.context.state.selectedSkin);
    this.currentLevelData = data;
    delete this.scene.userData.artPreviewData;this.artPreview=undefined;

    // Configure cinematic camera mode for Tram, Bus, and Padel stages (Tranvia, Tranvia2, Bus35, Bus34, La Mina, Padel3)
    const customStageName = data?.name || "";
    const isCustomTranvia1 = customStageName === "Tranvia" || (data.world === 2 && data.level === 2 && data.stage === 4);
    const isCustomTranvia2 = customStageName === "Tranvia2" || (data.world === 2 && data.level === 4 && data.stage === 1);
    const isCustomBus35 = customStageName === "Bus35" || (data.world === 4 && data.level === 1 && data.stage === 2) || (data.id === "world-04-level-01-stage-02") || (data.properties?.cameraMode === "cinematic_bus35");
    const isCustomBus34 = customStageName === "Bus34" || (data.world === 4 && data.level === 2 && data.stage === 1) || (data.id === "world-04-level-02-stage-01") || (data.properties?.cameraMode === "cinematic_bus34");
    const isCustomMina = customStageName === "La Mina" || (data.world === 4 && data.level === 2 && data.stage === 4) || (data.id === "world-04-level-02-stage-04") || (data.properties?.cameraMode === "cinematic_mina");
    const isCustomPadel3 = customStageName === "Padel3" || (data.world === 4 && data.level === 3 && data.stage === 4) || (data.id === "world-04-level-03-stage-04") || (data.properties?.cameraMode === "fixed_padel");
    this.context.camera.setCinematicTramMode(
      isCustomTranvia1 ? "tranvia1" : isCustomTranvia2 ? "tranvia2" : isCustomBus35 ? "bus35" : isCustomBus34 ? "bus34" : isCustomMina ? "mina" : isCustomPadel3 ? "fixed_padel" : null
    );

    this.currentLevel = this.levelBuilder.build(
      data,
      this.context.physics,
      charDef.collectibleId,
      this.currentQuality
    );
    this.scene.add(this.currentLevel.group);

    this.player = new Player(
      charDef,
      this.context.physics,
      this.currentLevel.spawnPoint
    );
    this.scene.add(this.player.object);

    this.applyLevelEnvironment(data.world || 1, data.level || 1);
    if(data.musicTrack)this.audio.startBGM(data.musicTrack);else this.audio.startLevel(data.world||1,data.level||1);

    // Configure nocturnal pitch-black route atmosphere (M3-N4-E9: Ruta Nocturna)
    this.checkAndApplyPitchBlackMode(data.world || 1, data.level || 1, data.stage || 1, data);
    this.contactShadows.bind(data,this.currentLevel.group,this.currentLevel.collidableMeshes,true);

    // Camera 360 Fly-in Intro Animation
    if(!options.deferIntro)this.startIntroAnimation();
    const maxCol = this.getLevelMaxCollectibles();
    this.context.hud.setItemIcon(charDef.collectibleEmoji, charDef.collectibleId);
    this.context.hud.setStageInfo(data.world, data.level, data.stage, maxCol, data.name);
    this.context.hud.update(
      this.context.state.lives,
      this.context.state.levelRunCollectibles,
      0,
      maxCol
    );
  }

  /**
   * Seamlessly switches the character in the active game without exiting or reloading the stage,
   * updating the player ball, stats, stage collectibles, and HUD icon.
   */
  changeCharacter(charId: string): void {
    if (!this.context) return;
    this.context.state.selectedSkin=this.context.progression.getSelectedSkin(charId);
    const charDef = getCharacterById(charId, this.context.state.selectedSkin);
    this.context.state.selectedCharacter = charId;

    // 1. Update player mesh, textures, and stats
    if (this.player) {
      this.player.setCharacter(charDef);
    }

    // 2. Update all uncollected collectibles in the stage to match the new character's item
    if (this.currentLevel?.collectibles) {
      const colTex = SpriteTextures.getCollectibleTexture(charDef.collectibleId);
      for (const item of this.currentLevel.collectibles) {
        if(item.mesh instanceof CollectibleVisual){item.mesh.setKind(charDef.collectibleId);continue;}
        if (!item.collected && item.mesh instanceof THREE.Sprite) {
          (item.mesh.material as THREE.SpriteMaterial).map = colTex;
          (item.mesh.material as THREE.SpriteMaterial).needsUpdate = true;
        }
      }
    }

    // 3. Update HUD item icon
    this.context.hud.setItemIcon(charDef.collectibleEmoji, charDef.collectibleId);
  }

  setQuality(quality: "low" | "medium" | "high"): void {
    this.currentQuality = quality;
    this.contactShadows.setQuality(quality);this.atmosphere.setQuality(quality);this.horizonStrength.value=quality==='low' ? .1:quality==='medium' ? .14:.18;
    this.scene.environment = !this.isPitchBlackMode&&quality === "high" && this.currentSkyTexture ? this.currentSkyTexture : null;
    if (this.currentLevel && this.currentLevel.setQuality) {
      this.currentLevel.setQuality(quality);
    }
  }

  applyBackground(themeId: string): void {
    if (!this.context) return;
    const skyTheme = getSkyThemeById(themeId);
    const texture = this.createFallbackSkyTexture(skyTheme.skyColor, skyTheme.horizonColor);
    this.applyTextureToScene(texture);
    this.context.state.selectedSkyTheme = themeId;
    this.horizonColor.value.set(skyTheme.horizonColor);
  }

  updateVisuals(delta:number):void {
    if(!this.context) return;
    const preview=this.scene.userData.artPreviewData as LevelData|undefined;
    if(preview&&preview!==this.artPreview) {this.artPreview=preview;this.applyWorldLighting(preview.world,preview.level);}
    const art=this.scene.userData.artDirection as ReturnType<typeof artDirection>|undefined;
    this.scene.userData.artDark=this.isPitchBlackMode||art?.dark===true;
    this.visualFocus.copy(this.player?.getPosition()??this.context.camera.object.position);
    this.atmosphere.update(delta,this.visualFocus,this.currentLevel?.goal);
    this.contactShadows.update(delta,this.player&&!this.player.isInVehicle()&&!this.isIntroActive ? this.player.getPosition():undefined,!this.isPitchBlackMode&&art?.dark!==true);
  }

  update(delta: number): void {
    // Keep skydome centered around camera position with subtle celestial slow rotation
    if (this.skydomeMesh && this.context) {
      this.skydomeMesh.position.copy(this.context.camera.object.position);
      this.skydomeMesh.rotation.y += delta * 0.008;
    }

    if (!this.context || this.context.state.screen !== "gameplay") {
      this.audio.updateRoll(0);
      return;
    }

    if (!this.player || !this.currentLevel) {
      return;
    }

    if (this.isPitchBlackMode) {
      this.updatePitchBlackLights();
    }

    // Fly-in cinematic 360 camera intro animation
    if (this.isIntroActive) {
      this.player.respawn();

      // Check if user is rushing the intro with WASD, Arrow keys, screen touch or joystick
      const kbAxis = this.context.input.getAxis();
      const isKeyRushing =
        this.context.input.isMovementKeyPressed() ||
        Math.abs(kbAxis.horizontal) > 0.05 ||
        Math.abs(kbAxis.vertical) > 0.05;

      const touchAxis = this.context.touchControls.getAxis();
      const isTouchRushing =
        this.context.touchControls.isPressed() ||
        Math.abs(touchAxis.horizontal) > 0.05 ||
        Math.abs(touchAxis.vertical) > 0.05 ||
        this.isPointerRushing;

      // 1.0x by default (slower cinematic sweep), 4.0x when rushed by user
      const speedMultiplier = isKeyRushing || isTouchRushing ? 4.0 : 1.0;

      this.updateIntroCamera(delta * speedMultiplier);
      this.currentLevel.update(delta, true);
      this.context.hud.update(
        this.context.state.lives,
        this.context.state.levelRunCollectibles,
        0,
        this.getLevelMaxCollectibles()
      );
      return;
    }

    // Victory 360 camera outro orbit around character while teleporting
    if (this.isOutroActive) {
      this.updateOutroCamera(delta);
      this.currentLevel.update(delta);
      this.context.hud.update(
        this.context.state.lives,
        this.context.state.levelRunCollectibles,
        this.context.state.elapsedTime,
        this.getLevelMaxCollectibles()
      );
      return;
    }

    if (this.respawnCooldown > 0) {
      this.respawnCooldown -= delta;
    }

    if (!this.isStageCompleted) {
      this.context.state.elapsedTime += delta;
    }

    // Merge keyboard and touch input
    const kbAxis = this.context.input.getAxis();
    const touchAxis = this.context.touchControls.getAxis();

    this.mergedInput.horizontal =
      Math.abs(touchAxis.horizontal) > 0.05 ? touchAxis.horizontal : kbAxis.horizontal;
    this.mergedInput.vertical =
      Math.abs(touchAxis.vertical) > 0.05 ? touchAxis.vertical : kbAxis.vertical;
    this.mergedInput.bothPaddles=Math.abs(touchAxis.vertical)>.05 || Math.abs(touchAxis.horizontal)>.05
      ? Math.abs(touchAxis.horizontal)<.15 : kbAxis.bothPaddles;
    this.mergedInput.action=this.context.input.isPressed("Space") || this.context.input.isPressed("Enter") || this.context.hud.consumeCannonFire();
    this.mergedInput.anyKey=this.context.input.isAnyKeyPressed()||this.context.touchControls.isPressed();
    this.currentLevel.kyoto?.update(delta,this.player,this.mergedInput);
    this.updateKitsuneLighting(this.currentLevel.kyoto?.blueActive??false);

    // Update Player physics & visual roll
    const canoeMotion=this.currentLevel.canoe?.update(delta,this.mergedInput,this.player);
    const covadongaMotion=this.currentLevel.covadonga?.update(delta,this.mergedInput,this.player);
    const londonMotion=this.currentLevel.london?.update(delta,this.player);
    const museumMotion=this.currentLevel.museum?.update(delta,this.player);
    const bigBenMotion=this.currentLevel.bigben?.update(delta,this.player,this.mergedInput,this.context.camera.object);
    const oxfordMotion=this.currentLevel.oxford?.update(delta,this.player,this.mergedInput,this.context.camera.object);
    const tokyoMotion=this.currentLevel.tokyo?.update(delta,this.player,this.mergedInput,this.context.camera.object);
    this.context.hud.setMechanicHint(this.currentLevel.norway?.mechanicHint??this.currentLevel.tokyo?.mechanicHint??null);
    const naraMotion=this.currentLevel.nara?.update(delta,this.player,this.mergedInput,this.context.camera.object);
    this.currentLevel.norway?.update(delta,this.player,this.mergedInput);
    this.currentLevel.osaka?.update(delta,this.player);
    this.context.hud.updateCannon(this.currentLevel.covadonga?.cannonAiming??false,this.currentLevel.covadonga?.cannonPitch??0);
    const { position: playerPos, velocity: playerVel, fellOut } = tokyoMotion ?? naraMotion ?? canoeMotion ?? covadongaMotion ?? londonMotion ?? museumMotion ?? oxfordMotion ?? bigBenMotion ?? this.player.update(
      delta,
      this.currentLevel.museum?.chasing ? this.currentLevel.museum.mapChaseInput(this.mergedInput):this.mergedInput,
      this.currentLevel.museum?.chasing ? this.currentLevel.museum.movementCamera:this.context.camera.object
    );

    // Audio roll hum
    this.audio.updateRoll(this.player.getSpeed());

    // Update Level animations (collectibles hover, goal ribbon, interactive padel racket)
    const stageRespawn = this.currentLevel.update(delta, false, playerPos, this.player);
    if (stageRespawn) this.context.camera.snapTo(playerPos, this.currentLevel.collidableMeshes);
    // Moving geometry must be current before probing camera obstructions.
    const cinematicCanoe=this.currentLevelData?.world===5 && this.currentLevelData.level===3 &&
      (this.currentLevelData.stage===7 || this.currentLevelData.stage===10);
    this.context.camera.setCanoeHeading(this.player.isInVehicle() ? this.currentLevel.canoe?.heading??this.currentLevel.covadonga?.heading??this.currentLevel.london?.heading??null : null,
      delta,cinematicCanoe||this.currentLevel.covadonga?.vehicleMode==="bus",cinematicCanoe && this.currentLevelData?.stage===10);
    this.context.camera.setFlightView(this.currentLevel.london?.flying??false);
    this.context.camera.setNaraTrainView(this.currentLevel.tokyo?.machineCameraTarget??this.currentLevel.nara?.trainCameraTarget??null,Boolean(this.currentLevel.tokyo?.machineCameraTarget));
    this.context.camera.setMuseumChase(this.currentLevel.museum?.chasing??false);
    const cannonScene=this.currentLevel.covadonga;
    this.context.camera.setCannonScene(cannonScene?.cannonSceneActive ? cannonScene.cannonSceneOrigin:null,
      cannonScene?.cannonSceneActive ? cannonScene.cannonSceneGoal??null:null);
    this.context.camera.follow(playerPos,playerVel,delta,this.currentLevel.collidableMeshes,this.mergedInput.horizontal);

    // 1. Check Collectibles collision
    for (const item of this.currentLevel.collectibles) {
      if (!item.collected) {
        this.tempDiff.subVectors(playerPos, item.position);
        if (this.tempDiff.lengthSq() < 2.0) {
          item.collected = true;
          item.mesh.visible = false;

          this.context.progression.recordCollectedItem(
            this.context.state.selectedWorld,this.context.state.selectedLevel,this.context.state.selectedStage,item.id
          );

          const got1Up = this.context.state.addCollectible();
          if (got1Up) {
            this.audio.playLifeUp();
            this.context.hud.showBanner("+1 VIDA", 1500, "#00e676");
          } else {
            this.audio.playCollect();
          }
        }
      }
    }

    // 2. Check Goal collision (activates when half or more of the ball crosses the portal opening)
    if (this.currentLevel.goal && !this.currentLevel.goal.reached && !this.isStageCompleted && !this.currentLevel.kyoto?.collapsed) {
      const goal = this.currentLevel.goal;
      this.tempDiff.subVectors(playerPos, goal.position);
      if (goal.quaternion) {
        this.tempGoalInvQuat.copy(goal.quaternion).invert();
        this.tempDiff.applyQuaternion(this.tempGoalInvQuat);
      } else {
        const rotY = -(goal.rotationY ?? 0);
        this.tempGoalInvQuat.setFromEuler(new THREE.Euler(0, rotY, 0, "YXZ"));
        this.tempDiff.applyQuaternion(this.tempGoalInvQuat);
      }
      if(goal.mesh.userData.searchHidden===true)this.tempDiff.divide(goal.mesh.scale);
      const localX = this.tempDiff.x;
      const localY = this.tempDiff.y;
      const localZ = this.tempDiff.z;

      // Crossing through portal frame opening:
      // Inner post clear width is |localX| <= 1.42
      // Vertical height opening is localY between 0.1 and 3.2
      // Half or more of the ball (radius 0.5) must cross the portal threshold: |localZ| <= 0.40
      if (
        this.currentLevel.tokyo?.finishRequested || this.currentLevel.bigben?.finishRequested || this.currentLevel.oxford?.finishRequested || this.currentLevel.museum?.finishRequested || this.currentLevel.london?.finishRequested || this.currentLevel.covadonga?.finishRequested || this.currentLevel.canoe?.finishRequested || (!this.currentLevel.tokyo?.controlsGoal && !this.currentLevel.bigben?.failed && !this.currentLevel.bigben?.controlsGoal && !this.currentLevel.oxford?.failed && !this.currentLevel.oxford?.controlsGoal && !this.currentLevel.museum?.failed && !this.currentLevel.museum?.controlsGoal && !this.currentLevel.london?.failed && !this.currentLevel.london?.controlsGoal && !this.currentLevel.covadonga?.controlsGoal && Math.abs(localX) <= 1.42 &&
        localY >= 0.1 &&
        localY <= 3.2 &&
        Math.abs(localZ) <= 0.40)
      ) {
        goal.reached = true;
        this.isStageCompleted = true;
        this.player.setFrozen(true);
        this.currentLevel.canoe?.stop();
        this.currentLevel.covadonga?.stop();
        this.currentLevel.london?.stop();
        this.currentLevel.museum?.stop();
        this.currentLevel.oxford?.stop();
        this.currentLevel.bigben?.stop();
        this.currentLevel.kyoto?.stop();
        this.currentLevel.nara?.stop();
        this.currentLevel.tokyo?.stop();
        this.currentLevel.norway?.stop();
        this.currentLevel.osaka?.stop();
        this.updateKitsuneLighting(false);
        this.player.setHappy(true);
        this.audio.updateRoll(0);
        this.audio.playGoal();
        this.audio.playTeleport();

        // Project the 3D Goal's top lintel beam into screen coordinates so confetti erupts from above the portal
        const goalQuat = goal.quaternion || this.tempGoalQuat.setFromEuler(new THREE.Euler(0, goal.rotationY ?? 0, 0, "YXZ"));
        const leftWorld = new THREE.Vector3(-1.7, 3.45, 0).applyQuaternion(goalQuat).add(goal.position);
        const rightWorld = new THREE.Vector3(1.7, 3.45, 0).applyQuaternion(goalQuat).add(goal.position);
        const centerWorld = new THREE.Vector3(0, 3.45, 0).applyQuaternion(goalQuat).add(goal.position);

        const cam = this.context.camera.object;
        leftWorld.project(cam);
        rightWorld.project(cam);
        centerWorld.project(cam);

        const toScreen = (v: THREE.Vector3) => ({
          x: (v.x * 0.5 + 0.5) * window.innerWidth,
          y: (-v.y * 0.5 + 0.5) * window.innerHeight,
          inFront: v.z < 1.0
        });

        const leftScreen = toScreen(leftWorld);
        const rightScreen = toScreen(rightWorld);
        const centerScreen = toScreen(centerWorld);

        const goalBeamOrigin =
          centerScreen.inFront && leftScreen.inFront && rightScreen.inFront
            ? { left: leftScreen, right: rightScreen, center: centerScreen }
            : undefined;

        this.context.hud.triggerConfetti(goalBeamOrigin);
        this.context.hud.triggerTeleport(2500);
        this.context.hud.showBanner("¡META!", 2100, "#ffd700");

        // Record stage metrics into the run accumulator (only committed upon completing stage 10)
        const currentStage = this.context.state.selectedStage;
        this.context.state.runStageTimes[currentStage] = this.context.state.elapsedTime;
        this.context.state.runStageCollectibles[currentStage] = this.context.state.stageCollectibles;
        this.context.state.levelRunTime += this.context.state.elapsedTime;

        // Start dynamic 360 victory camera orbit focusing on character while teleportation runs
        this.startOutroAnimation();
      }
    }

    // 3. Water Blocks Interaction (slows down ball, splashes physical 3D wave ripples)
    let isInWaterThisFrame = false;
    let isCameraInWater = false;
    let waterFluidType: "water" | "honey" = "water";
    const camPos = this.context.camera.object.position;

    if (this.currentLevel.waterBlocks && this.currentLevel.waterBlocks.length > 0) {
      for (const wb of this.currentLevel.waterBlocks) {
        const halfX = wb.scale.x / 2 + 0.35;
        const halfZ = wb.scale.z / 2 + 0.35;
        const riverPlayerHeight=wb.river?.surfaceHeight(playerPos),riverCameraHeight=wb.river?.surfaceHeight(camPos);
        const topY = riverPlayerHeight ?? riverCameraHeight ?? wb.position.y + wb.scale.y / 2;
        const botY = wb.river ? topY-6:wb.position.y - wb.scale.y / 2 - 0.2;

        const isPlayerInside = !this.player.isInVehicle() && (wb.river ? riverPlayerHeight!=null && playerPos.y-.75<=riverPlayerHeight+.25 && playerPos.y+.75>=riverPlayerHeight-6 :
          Math.abs(playerPos.x - wb.position.x) <= halfX &&
          Math.abs(playerPos.z - wb.position.z) <= halfZ &&
          (playerPos.y - 0.75) <= (topY + 0.25) &&
          (playerPos.y + 0.75) >= botY);

        const cameraWithinBounds = wb.river ? riverCameraHeight!=null :
          Math.abs(camPos.x - wb.position.x) <= (wb.scale.x / 2 + 0.3) &&
          Math.abs(camPos.z - wb.position.z) <= (wb.scale.z / 2 + 0.3);
        const cameraTop = riverCameraHeight ?? wb.position.y + wb.scale.y / 2;
        const isCamInside = cameraWithinBounds && fluidCameraSubmerged(
          camPos.y, cameraTop, wb.river ? cameraTop-6 : botY,
          wb.passable !== false, this.isUnderwaterActive,
        );

        if (isPlayerInside || isCamInside) {
          isInWaterThisFrame = isPlayerInside;
          isCameraInWater = isCamInside;
          waterFluidType = wb.fluidType === "honey" ? "honey" : "water";

          if (isPlayerInside) {
            // Apply realistic hydrodynamic fluid drag: slows down movement smoothly (honey is much denser!)
            const drag = wb.dragFactor ?? (wb.fluidType === "honey" ? 8.5 : 3.4);
            if(wb.passable !== false) this.player.applyDrag(drag * delta);

            const speed = this.player.getSpeed();
            const vy = this.player.getVelocity().y;

            // Physical wave ripple generation in WaterWaveSimulator
            if(wb.river) {
              this.waterWakeTimer+=delta;
              if(!this.playerWasInWater || this.waterWakeTimer>=.08) {
                wb.river.focus(playerPos);wb.river.disturb(playerPos,-Math.min(.25,.06+Math.abs(vy)*.03),.85);this.waterWakeTimer=0;
              }
            } else if (wb.simulator) {
              const simCenterX = wb.clusterCenterX !== undefined ? wb.clusterCenterX : wb.position.x;
              const simCenterZ = wb.clusterCenterZ !== undefined ? wb.clusterCenterZ : wb.position.z;

              if (!this.playerWasInWater || vy < -0.3) {
                // Ball dropping into water from air -> clean, realistic splash wave!
                const impactStrength = Math.min(0.28, Math.max(0.12, Math.abs(vy) * 0.08 + 0.12));
                wb.simulator.disturbWorld(playerPos.x, playerPos.z, simCenterX, simCenterZ, -impactStrength, 0.85);
              } else if (speed > 0.15) {
                // Continuous wake ripple while rolling (throttled to 12.5Hz for smooth wave trails)
                this.waterWakeTimer += delta;
                if (this.waterWakeTimer >= 0.08) {
                  this.waterWakeTimer = 0;
                  const wakeImpulse = -0.065 * Math.min(speed / 2.5, 1.0);
                  wb.simulator.disturbWorld(playerPos.x, playerPos.z, simCenterX, simCenterZ, wakeImpulse, 0.55);
                }
              }
            }

            // Visual ripples and droplets on water surface (silent)
            this.spawnWaterVFX(playerPos, topY, speed, delta);
          }
          break;
        }
      }
    }
    if (!isInWaterThisFrame) {
      this.waterWakeTimer = 0;
    }
    this.playerWasInWater = isInWaterThisFrame;

    // 4. Lava Blocks Interaction (viscous drag, embers & burns player if speed reaches 0)
    let isInLava = false;
    if (this.currentLevel.lavaBlocks && this.currentLevel.lavaBlocks.length > 0) {
      for (const lb of this.currentLevel.lavaBlocks) {
        const halfX = lb.scale.x / 2 + 0.35;
        const halfZ = lb.scale.z / 2 + 0.35;
        const topY = lb.position.y + lb.scale.y / 2;
        const botY = lb.position.y - lb.scale.y / 2 - 0.2;

        const isPlayerInLava =
          Math.abs(playerPos.x - lb.position.x) <= halfX &&
          Math.abs(playerPos.z - lb.position.z) <= halfZ &&
          (playerPos.y - 0.75) <= (topY + 0.2) &&
          (playerPos.y + 0.75) >= botY;

        const isCamInLava =
          Math.abs(camPos.x - lb.position.x) <= (lb.scale.x / 2 + 0.3) &&
          Math.abs(camPos.z - lb.position.z) <= (lb.scale.z / 2 + 0.3) &&
          camPos.y <= (topY + 0.2) &&
          camPos.y >= (lb.position.y - lb.scale.y / 2 - 0.2);

        if (isPlayerInLava || isCamInLava) {
          isInLava = true;
          if (isPlayerInLava) {
            // Magmatic viscous drag: slows down movement
            this.player.applyDrag(2.6 * delta);

            const speed = this.player.getSpeed();
            // Visual embers/sparks from lava
            this.spawnLavaVFX(playerPos, topY, delta);

            // "si te quedas a 0 te quema y pierdes la vida"
            if (speed < 0.22) {
              this.lavaStoppedTimer += delta;
              if (this.lavaStoppedTimer >= 0.35 && this.respawnCooldown <= 0) {
                this.handlePlayerDeath("lava");
              }
            } else {
              this.lavaStoppedTimer = Math.max(0, this.lavaStoppedTimer - delta * 2.0);
            }
          }
          break;
        }
      }
    }
    if (!isInLava) {
      this.lavaStoppedTimer = 0;
    }

    // 4.5. Fluid Underwater / Submerged Camera Atmosphere
    if (isCameraInWater) {
      if (!this.isUnderwaterActive || this.currentUnderwaterFluid !== waterFluidType) {
        this.isUnderwaterActive = true;
        this.currentUnderwaterFluid = waterFluidType;
        this.context.hud.setUnderwater(true, waterFluidType);
        this.scene.fog = waterFluidType === "honey" ? this.honeyFog : this.waterFog;
      }
    } else if (isInLava) {
      if (!this.isUnderwaterActive || this.currentUnderwaterFluid !== "lava") {
        this.isUnderwaterActive = true;
        this.currentUnderwaterFluid = "lava";
        this.context.hud.setUnderwater(true, "lava");
        this.scene.fog = this.lavaFog;
      }
    } else {
      if (this.isUnderwaterActive) {
        this.isUnderwaterActive = false;
        this.currentUnderwaterFluid = null;
        this.context.hud.setUnderwater(false);
        this.scene.fog = this.isPitchBlackMode ? this.pitchBlackFog : this.clearFog;
      }
    }

    // 5. Check Fall Out
    const isTramStage = this.currentLevel?.movingPlatforms?.some(
      p => p.movementType === "tram_square" || p.movementType === "tram_circle" || p.movementType === "tram_linear"
    );
    const fellOutCondition = fellOut || (isTramStage && playerPos.y < -0.4);

    if (
      !stageRespawn && fellOutCondition &&
      this.respawnCooldown <= 0 &&
      !this.isStageCompleted &&
      !this.isGameOverTriggered
    ) {
      this.handlePlayerDeath(this.currentLevel.museum?.failed ? this.currentLevel.museum.failure:this.currentLevel.london?.failed ? this.currentLevel.london.failure:this.currentLevel.covadonga?.broken ? "vehicle":this.currentLevel.canoe?.broken ? "canoe":"fall");
    }

    // 5.1. Check contact with eliminating enemies (M4-N2-E10 Ninanos: hooded men & dogs)
    if (
      this.currentLevel?.movingPlatforms &&
      this.respawnCooldown <= 0 &&
      !this.isStageCompleted &&
      !this.isGameOverTriggered
    ) {
      for (const mp of this.currentLevel.movingPlatforms) {
        if (mp.eliminatesPlayer) {
          const ep = mp.mesh.position;
          const dx = playerPos.x - ep.x;
          const dy = playerPos.y - ep.y;
          const dz = playerPos.z - ep.z;
          if (Math.abs(dx) < 1.05 && Math.abs(dz) < 1.05 && dy >= -0.2 && dy < 2.0) {
            this.handlePlayerDeath("enemy");
            break;
          }
        }
      }
    }

    // 5.0. Chorro Propulsor Acuático del Lago (M4-N3-E10 Lago)
    const hasLakeGeyser = this.currentLevelData?.objects?.some(
      (o: any) => o.properties?.variant === "water_geyser" || o.id === "w4s310-lake-geyser"
    );
    if (hasLakeGeyser && !this.isStageCompleted && !this.isGameOverTriggered && this.respawnCooldown <= 0) {
      const geyserObj = this.currentLevelData?.objects?.find(
        (o: any) => o.properties?.variant === "water_geyser" || o.id === "w4s310-lake-geyser"
      );
      const gx = geyserObj?.position?.x ?? 0.0;
      const gz = geyserObj?.position?.z ?? 0.0;
      const gy = geyserObj?.position?.y ?? 0.0;
      const distHoriz = Math.hypot(playerPos.x - gx, playerPos.z - gz);
      if (distHoriz <= 3.2 && playerPos.y >= gy - 0.5 && playerPos.y <= gy + 18.0) {
        if (this.player) {
          const upwardVelocity = Math.max(16.5, 21.0 - (playerPos.y - gy) * 0.35);
          this.player.setLinearVelocity({
            x: (gx - playerPos.x) * 1.8,
            y: upwardVelocity,
            z: (gz - playerPos.z) * 1.8
          });
          if (Math.random() < 0.12) {
            this.audio.playBounce();
          }
        }
      }
    }

    // 5.1. Teletransporte con Polvos Floo y Llamas Verdes (M4-N2-E9 Pao)
    // 5s quieto -> llamas verdes devoran la chimenea -> 1s después teletransporte con llamas verdes -> desaparecen
    const hasFlooFireplace = this.currentLevelData?.objects?.some(
      (o: any) => o.properties?.variant === "floo_fireplace" || o.id === "w4s29-floo-fireplace"
    );
    if (hasFlooFireplace && !this.isStageCompleted && !this.isGameOverTriggered && this.respawnCooldown <= 0) {
      const inHearth =
        Math.abs(playerPos.x) < 1.4 &&
        playerPos.z >= -6.4 &&
        playerPos.z <= -3.6 &&
        playerPos.y >= 0.0 &&
        playerPos.y <= 3.2;

      const hearthFlame = this.currentLevel?.group?.getObjectByName("floo_green_flame_group") as THREE.Group | undefined;
      const flameLight = hearthFlame?.getObjectByName("floo_flame_light") as THREE.PointLight | undefined;

      if (this.flooPhase === "idle") {
        if (inHearth) {
          const vel = this.player?.getVelocity() || { x: 0, y: 0, z: 0 };
          const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);
          if (speed < 0.5) {
            this.flooStillTimer += delta;
            // Primeros 2 segundos: SIN ALERTAS (silencio total)
            if (this.flooStillTimer >= 2.0 && this.flooStillTimer < 3.5) {
              // Alerta 1: CA...
              if (this.lastFlooAlertStep < 1) {
                this.lastFlooAlertStep = 1;
                this.context.hud.showBanner("CA...", 1400, "#00e620");
              }
            } else if (this.flooStillTimer >= 3.5 && this.flooStillTimer < 5.0) {
              // Alerta 2: CALLE...
              if (this.lastFlooAlertStep < 2) {
                this.lastFlooAlertStep = 2;
                this.context.hud.showBanner("CALLE...", 1400, "#00e620");
              }
            } else if (this.flooStillTimer >= 5.0) {
              // Alerta 3: ¡Callejón Diagon! y brota la llama verde devorando por dentro de la chimenea
              this.flooPhase = "erupting";
              this.flooFlameTimer = 0;
              this.lastFlooAlertStep = 3;
              this.audio.playTeleport();
              this.context.hud.showBanner("¡Callejón Diagon!", 2000, "#00e620");
              if (hearthFlame) {
                hearthFlame.visible = true;
                hearthFlame.scale.set(1.0, 1.0, 1.0);
              }
              if (flameLight) {
                flameLight.intensity = 5.0;
              }
            }
          } else {
            this.flooStillTimer = Math.max(0, this.flooStillTimer - delta * 1.5);
            if (this.flooStillTimer < 2.0) {
              this.lastFlooAlertStep = 0;
            }
          }
        } else {
          this.flooStillTimer = 0;
          this.lastFlooAlertStep = 0;
        }
      } else if (this.flooPhase === "erupting") {
        this.flooFlameTimer += delta;
        // Retener al personaje en el centro del hogar mientras es devorado por las llamas verdes
        if (this.player) {
          this.player.setLinearVelocity({ x: 0, y: 0, z: 0 });
          this.player.getBody()?.setTranslation({ x: 0, y: Math.max(playerPos.y, 0.65), z: -4.8 }, true);
        }
        // Llamas verdes devoran y chisporrotean dentro de la chimenea
        if (hearthFlame) {
          const flicker = 1.0 + Math.sin(this.flooFlameTimer * 28.0) * 0.22;
          const scaleY = (0.7 + this.flooFlameTimer * 0.7) * flicker;
          hearthFlame.scale.set(flicker, scaleY, flicker);
        }
        if (flameLight) {
          flameLight.intensity = 4.5 + Math.sin(this.flooFlameTimer * 30.0) * 1.5;
        }

        // Exactamente 1 segundo después: teletransporte junto a la llama verde (sin más alertas)
        if (this.flooFlameTimer >= 1.0) {
          this.flooPhase = "destination";
          this.flooFlameTimer = 0;

          const target = { x: 0.0, y: 28.5, z: -20.0 };
          this.player?.teleportTo(target.x, target.y, target.z);
          if (this.player) {
            this.context.camera.snapTo(this.player.getPosition(), this.currentLevel?.collidableMeshes);
          }
          this.audio.playTeleport();

          // La llama en el hogar de abajo se apaga
          if (hearthFlame) {
            hearthFlame.visible = false;
          }

          // La llama verde aparece en el destino alrededor del personaje
          if (!this.flooDestFlameGroup && this.currentLevel?.group) {
            this.flooDestFlameGroup = LevelBuilder.createFlooFlameGroup();
            this.currentLevel.group.add(this.flooDestFlameGroup);
          }
          if (this.flooDestFlameGroup) {
            this.flooDestFlameGroup.position.set(target.x, target.y - 0.2, target.z);
            this.flooDestFlameGroup.visible = true;
            this.flooDestFlameGroup.scale.set(1.5, 1.8, 1.5);
          }
        }
      } else if (this.flooPhase === "destination") {
        this.flooFlameTimer += delta;
        // La llama verde se disipa rápidamente (0.8s), desaparece y permite continuar moviéndose
        if (this.flooDestFlameGroup) {
          const progress = this.flooFlameTimer / 0.8;
          const scale = Math.max(0.001, (1.0 - progress) * 1.6);
          this.flooDestFlameGroup.scale.set(scale, scale, scale);
        }
        if (this.flooFlameTimer >= 0.8) {
          if (this.flooDestFlameGroup) {
            this.flooDestFlameGroup.visible = false;
          }
          this.flooPhase = "idle";
          this.flooStillTimer = 0;
          this.flooFlameTimer = 0;
          this.lastFlooAlertStep = 0;
        }
      }
    } else {
      if (this.flooPhase !== "destination") {
        this.flooPhase = "idle";
        this.flooStillTimer = 0;
        this.flooFlameTimer = 0;
        this.lastFlooAlertStep = 0;
      }
    }

    // 6. Update VFX particle systems
    this.updateVFX(delta);

    // 7. Update HUD values
    this.context.hud.update(
      this.context.state.lives,
      this.context.state.levelRunCollectibles,
      this.context.state.elapsedTime,
      this.getLevelMaxCollectibles()
    );
  }

  async restartCurrentStage(): Promise<void> {
    if (!this.context || !this.currentLevelData) return;
    this.context.state.lives = 5;
    this.context.state.resetStage();
    await this.loadStage(
      this.context.state.selectedWorld,
      this.context.state.selectedLevel,
      this.context.state.selectedStage
    );
  }

  cleanupCurrentStage(): void {
    this.updateKitsuneLighting(false);
    this.contactShadows.clear();
    if (this.gameOverTimeoutId !== null) {
      window.clearTimeout(this.gameOverTimeoutId);
      this.gameOverTimeoutId = null;
    }

    if (this.stageClearTimeoutId !== null) {
      window.clearTimeout(this.stageClearTimeoutId);
      this.stageClearTimeoutId = null;
    }

    this.isGameOverTriggered = false;
    this.isStageCompleted = false;
    this.isIntroActive = false;
    this.introTime = 0;
    this.isOutroActive = false;
    this.outroTime = 0;
    this.context?.hud.clearTeleport();
    this.context?.camera.setCinematicTramMode(null);
    this.context?.camera.setCanoeHeading(null,0);
    this.context?.camera.setNaraTrainView(null);
    this.context?.hud.setMechanicHint(null);

    if (this.isUnderwaterActive) {
      this.isUnderwaterActive = false;
      this.currentUnderwaterFluid = null;
      this.context?.hud.setUnderwater(false);
      this.scene.fog = this.clearFog;
    }

    this.disablePitchBlackMode();

    // Reset VFX and interaction timers
    this.waterRipples.forEach(r => { r.active = false; r.mesh.visible = false; });
    this.splashDroplets.forEach(d => { d.active = false; d.mesh.visible = false; });
    this.lavaSparks.forEach(s => { s.active = false; s.mesh.visible = false; });
    this.waterRippleSpawnTimer = 0;
    this.lavaStoppedTimer = 0;
    this.flooStillTimer = 0;
    this.flooPhase = "idle";
    this.flooFlameTimer = 0;
    this.lastFlooAlertStep = 0;
    if (this.flooDestFlameGroup) {
      if (this.flooDestFlameGroup.parent) {
        this.flooDestFlameGroup.parent.remove(this.flooDestFlameGroup);
      }
      this.flooDestFlameGroup = null;
    }
    this.playerWasInWater = false;

    if (this.player) {
      this.scene.remove(this.player.object);
      this.player.destroy();
      this.player = null;
    }
    if(this.context)SpriteTextures.keepCharacterSkin(this.context.state.selectedCharacter,this.context.state.selectedSkin);

    if (this.currentLevel) {
      this.scene.remove(this.currentLevel.group);
      this.currentLevel.destroy();
      this.currentLevel = null;
    }
  }

  private handlePlayerDeath(reason: "fall" | "lava" | "enemy" | "canoe" | "vehicle" | "cold" | "crush" | "painting" | "rex"): void {
    if (!this.context || this.isStageCompleted || this.isGameOverTriggered) return;

    this.respawnCooldown = 1.4;
    this.lavaStoppedTimer = 0;
    this.flooStillTimer = 0;
    this.flooPhase = "idle";
    this.flooFlameTimer = 0;
    this.lastFlooAlertStep = 0;
    if (this.flooDestFlameGroup) {
      this.flooDestFlameGroup.visible = false;
    }

    if (this.isUnderwaterActive) {
      this.isUnderwaterActive = false;
      this.currentUnderwaterFluid = null;
      this.context.hud.setUnderwater(false);
      this.scene.fog = this.isPitchBlackMode ? this.pitchBlackFog : this.clearFog;
    }

    // Reset moving platforms and trams immediately back to starting station!
    this.currentLevel?.reset?.();
    this.updateKitsuneLighting(false);

    if (reason === "lava") {
      this.audio.playLavaBurn();
    } else {
      this.audio.playFall();
    }

    const isGameOver = this.context.state.loseLife();

    if (isGameOver) {
      this.isGameOverTriggered = true;
      this.player?.respawn();
      this.respawnCooldown = 999;
      this.context.hud.showBanner("¡FIN!", 2000, "#ff5252");

      if (this.gameOverTimeoutId !== null) {
        window.clearTimeout(this.gameOverTimeoutId);
      }
      this.gameOverTimeoutId = window.setTimeout(() => {
        this.gameOverTimeoutId = null;
        this.context?.onGameOver();
      }, 900);
    } else {
      const bannerText = reason === "painting" ? "¡CUADRO INCORRECTO!":reason === "rex" ? "¡EL T-REX TE HA ALCANZADO!":reason === "cold" ? "❄️ ¡CONGELADO!":reason === "crush" ? "⚠️ ¡APLASTADO!":reason === "vehicle" ? "⚠️ ¡ACCIDENTE!" : reason === "canoe" ? "🛶 ¡CANOA ROTA!" : reason === "lava" ? "🔥 ¡QUEMADO EN LA LAVA!" : reason === "enemy" ? "⚠️ ¡TE HAN PILLADO!" : "¡CAÍDA!";
      const bannerColor = reason === "lava" ? "#ff3d00" : reason === "enemy" ? "#d32f2f" : "#ff5252";
      this.context.hud.showBanner(bannerText, 1400, bannerColor);
      this.player?.respawn();
      if (this.player) {
        this.context.camera.snapTo(this.player.getPosition(), this.currentLevel?.collidableMeshes);
        if (this.isPitchBlackMode) {
          this.updatePitchBlackLights();
        }
      }
    }
  }

  private getLevelMaxCollectibles(): number {
    if (!this.context) return 0;
    const w = this.context.state.selectedWorld;
    const l = this.context.state.selectedLevel;
    if (w >= 1 && w <= 8 && l >= 1 && l <= 4) {
      const maxCol = this.context.progression.getLevelMaxCollectibles(w, l);
      if (maxCol > 0) return maxCol;
    }
    return this.currentLevel?.collectibles.length ?? 0;
  }

  private initVFXPool(): void {
    // 1. Water Surface Ripple Rings (subtle, delicate surface caustics)
    const rippleGeo = new THREE.RingGeometry(0.16, 0.36, 24);
    rippleGeo.rotateX(-Math.PI / 2);
    for (let i = 0; i < 10; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xb2ebf2,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(rippleGeo, mat);
      mesh.renderOrder = 1;
      mesh.visible = false;
      mesh.userData.graphicsDetail=true;
      this.vfxGroup.add(mesh);
      this.waterRipples.push({ mesh, active: false, life: 0, maxLife: 0.45 });
    }

    // 2. Water Splash Droplets
    const dropGeo = new THREE.SphereGeometry(0.06, 6, 6);
    for (let i = 0; i < 16; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xe0f7fa,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(dropGeo, mat);
      mesh.renderOrder = 2;
      mesh.visible = false;
      mesh.userData.graphicsDetail=true;
      this.vfxGroup.add(mesh);
      this.splashDroplets.push({
        mesh,
        active: false,
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 0.4,
        baseY: 0
      });
    }

    // 3. Lava Glowing Ember Sparks
    const sparkGeo = new THREE.SphereGeometry(0.08, 6, 6);
    for (let i = 0; i < 12; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xff6d00,
        transparent: true,
        opacity: 0.95,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(sparkGeo, mat);
      mesh.renderOrder = 2;
      mesh.visible = false;
      mesh.userData.graphicsDetail=true;
      this.vfxGroup.add(mesh);
      this.lavaSparks.push({
        mesh,
        active: false,
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 0.5
      });
    }
  }

  private spawnWaterVFX(pos: THREE.Vector3, surfaceY: number, speed: number, delta: number): void {
    this.waterRippleSpawnTimer -= delta;
    if (this.waterRippleSpawnTimer <= 0) {
      this.waterRippleSpawnTimer = 0.16;
      const ripple = this.waterRipples.find(r => !r.active);
      if (ripple) {
        ripple.mesh.position.set(pos.x, surfaceY + 0.015, pos.z);
        ripple.mesh.scale.set(1, 1, 1);
        ripple.life = 0;
        ripple.maxLife = 0.45;
        (ripple.mesh.material as THREE.MeshBasicMaterial).opacity = 0.45;
        ripple.mesh.visible = true;
        ripple.active = true;
      }
    }

    if (speed > 2.0) {
      const drop = this.splashDroplets.find(d => !d.active);
      if (drop) {
        drop.mesh.position.set(
          pos.x + (Math.random() - 0.5) * 0.35,
          surfaceY + 0.06,
          pos.z + (Math.random() - 0.5) * 0.35
        );
        drop.vel.set(
          (Math.random() - 0.5) * 2.2,
          2.0 + Math.random() * 1.8,
          (Math.random() - 0.5) * 2.2
        );
        drop.baseY = surfaceY;
        drop.life = 0;
        drop.maxLife = 0.38;
        drop.mesh.visible = true;
        drop.active = true;
      }
    }
  }

  private spawnLavaVFX(pos: THREE.Vector3, surfaceY: number, _delta: number): void {
    if (Math.random() < 0.35) {
      const spark = this.lavaSparks.find(s => !s.active);
      if (spark) {
        spark.mesh.position.set(
          pos.x + (Math.random() - 0.5) * 0.55,
          surfaceY + 0.05,
          pos.z + (Math.random() - 0.5) * 0.55
        );
        spark.vel.set(
          (Math.random() - 0.5) * 0.8,
          1.2 + Math.random() * 1.6,
          (Math.random() - 0.5) * 0.8
        );
        spark.life = 0;
        spark.maxLife = 0.48;
        (spark.mesh.material as THREE.MeshBasicMaterial).opacity = 0.95;
        spark.mesh.visible = true;
        spark.active = true;
      }
    }
  }

  private updateVFX(delta: number): void {
    // Water Ripples
    for (const ripple of this.waterRipples) {
      if (!ripple.active) continue;
      ripple.life += delta;
      const t = ripple.life / ripple.maxLife;
      if (t >= 1) {
        ripple.active = false;
        ripple.mesh.visible = false;
      } else {
        const s = 1 + t * 1.4;
        ripple.mesh.scale.set(s, s, s);
        (ripple.mesh.material as THREE.MeshBasicMaterial).opacity = 0.45 * (1 - t);
      }
    }

    // Splash Droplets
    for (const drop of this.splashDroplets) {
      if (!drop.active) continue;
      drop.life += delta;
      drop.vel.y -= 13.0 * delta;
      drop.mesh.position.addScaledVector(drop.vel, delta);
      if (drop.life >= drop.maxLife || drop.mesh.position.y <= drop.baseY) {
        drop.active = false;
        drop.mesh.visible = false;
      }
    }

    // Lava Sparks
    for (const spark of this.lavaSparks) {
      if (!spark.active) continue;
      spark.life += delta;
      spark.mesh.position.addScaledVector(spark.vel, delta);
      const t = spark.life / spark.maxLife;
      if (t >= 1) {
        spark.active = false;
        spark.mesh.visible = false;
      } else {
        (spark.mesh.material as THREE.MeshBasicMaterial).opacity = 0.95 * (1 - t);
      }
    }
  }

  /**
   * Starts a dynamic 360-degree fly-in camera orbit around the stage,
   * providing a cinematic perspective before settling behind the player.
   */
  private startIntroAnimation(): void {
    if (!this.currentLevel || !this.context) return;

    this.isIntroActive = true;
    this.introTime = 0;
    this.introSpawn.copy(this.currentLevel.spawnPoint);
    if(this.currentLevelData){this.currentLevel.group.updateMatrixWorld(true);this.introHeading=stageStartYaw(this.currentLevelData,this.currentLevel.collidableMeshes);this.context.camera.setStageHeading(this.introHeading);}

    // Calculate level bounding center for orbit focus
    const isFixedPadel = this.context.camera.getCinematicTramMode() === "fixed_padel";
    if(this.currentLevel.canoe || this.currentLevel.covadonga || this.currentLevel.london || this.currentLevel.museum || this.currentLevel.bigben) {
      this.introCenter.copy(this.introSpawn).add(new THREE.Vector3(0,-2,-14));
    } else if (isFixedPadel) {
      this.introCenter.set(0.0, 14.0, 0.0);
    } else {
      try {
        const box = new THREE.Box3().setFromObject(this.currentLevel.group);
        if (!box.isEmpty() && Number.isFinite(box.min.x)) {
          box.getCenter(this.introCenter);
          // Keep orbit center reasonably close to spawn so large stages orbit cleanly
          if (this.introCenter.distanceTo(this.introSpawn) > 28) {
            this.introCenter.lerpVectors(this.introSpawn, this.introCenter, 0.35);
          }
        } else {
          this.introCenter.copy(this.introSpawn);
        }
      } catch {
        this.introCenter.copy(this.introSpawn);
      }
    }

    if (this.player) {
      this.player.respawn();
    }

    this.context.hud.showBanner("¡PREPARADOS!", 5200, "#00e5ff");
    this.updateIntroCamera(0);
  }

  /**
   * Updates the 360-degree camera sweep during stage intro.
   */
  private updateIntroCamera(delta: number): void {
    if (!this.context) return;
    this.introTime += delta;
    const t = Math.min(this.introTime / this.introDuration, 1.0);
    const trainTarget=this.currentLevel?.tokyo?.machineCameraTarget??this.currentLevel?.nara?.trainCameraTarget;
    if(trainTarget){this.context.camera.setNaraTrainView(trainTarget,Boolean(this.currentLevel?.tokyo?.machineCameraTarget));this.context.camera.follow(this.introSpawn,this.tempDiff.set(0,0,0),delta);if(t>=1)this.finishIntroAnimation();return;}

    // Smooth cubic ease in-out
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const isFixedPadel = this.context.camera.getCinematicTramMode() === "fixed_padel";
    const isTranvia2 = this.context.camera.getCinematicTramMode() === "tranvia2";
    const baseAngle = isTranvia2 ? -Math.PI / 2 : this.context.camera.getCinematicTramMode()?0:-this.introHeading;
    const angle = baseAngle + (1 - ease) * Math.PI * 2;
    const finalRadius = isFixedPadel ? 40.0 : isTranvia2 ? 11.5 : 6.5;
    const finalHeight = isFixedPadel ? 3.5 : isTranvia2 ? 3.6 : 3.2;
    const radius = finalRadius + (1 - ease) * (isFixedPadel ? 12.0 : 17.5);
    const height = finalHeight + (1 - ease) * (isFixedPadel ? 15.0 : 9.8);

    const targetLook = isFixedPadel ? new THREE.Vector3(0.0, 13.0, 0.0) : this.introSpawn;
    const lookX = this.introCenter.x + (targetLook.x - this.introCenter.x) * ease;
    const lookY = this.introCenter.y + (targetLook.y - this.introCenter.y) * ease;
    const lookZ = this.introCenter.z + (targetLook.z - this.introCenter.z) * ease;

    const camX = lookX + Math.sin(angle) * radius;
    const camZ = lookZ + Math.cos(angle) * radius;
    const camY = lookY + height;

    this.context.camera.object.position.set(camX, camY, camZ);
    this.context.camera.object.lookAt(lookX, lookY, lookZ);

    if (t >= 1.0) {
      this.finishIntroAnimation();
    }
  }

  private finishIntroAnimation(): void {
    this.isIntroActive = false;
    this.introTime = 0;
    this.isPointerRushing = false;
    if (this.context && this.player) {
      this.context.camera.snapTo(this.player.getPosition(), this.currentLevel?.collidableMeshes);
      this.context.hud.showBanner("¡YA!", 1000, "#00e676");
    }
  }

  /**
   * Starts a dynamic 360-degree victory camera orbit sweep around the character,
   * focusing on the player while the cosmic teleportation warp and confetti burst unfold.
   */
  private startOutroAnimation(): void {
    if (!this.context || !this.player) return;

    this.isOutroActive = true;
    this.outroTime = 0;
    this.outroTarget.copy(this.player.getPosition());

    if (this.isUnderwaterActive) {
      this.isUnderwaterActive = false;
      this.currentUnderwaterFluid = null;
      this.context.hud.setUnderwater(false);
      this.scene.fog = this.isPitchBlackMode ? this.pitchBlackFog : this.clearFog;
    }

    const camPos = this.context.camera.object.position;
    const dx = camPos.x - this.outroTarget.x;
    const dz = camPos.z - this.outroTarget.z;
    this.outroStartAngle = Math.atan2(dx, dz);
    this.outroStartRadius = Math.max(5.5, Math.hypot(dx, dz));
    this.outroStartHeight = Math.max(2.2, camPos.y - this.outroTarget.y);

    if (this.stageClearTimeoutId !== null) {
      window.clearTimeout(this.stageClearTimeoutId);
    }
    // Transition smoothly to next stage at 2.1s (during the screen flash bloom peak)
    this.stageClearTimeoutId = window.setTimeout(() => {
      this.stageClearTimeoutId = null;
      this.isOutroActive = false;
      this.context?.onStageClear();
    }, 2100);
  }

  /**
   * Updates the 360-degree victory camera sweep around the character during teleportation.
   */
  private updateOutroCamera(delta: number): void {
    if (!this.context) return;
    this.outroTime += delta;
    const t = Math.min(this.outroTime / this.outroDuration, 1.0);

    // Smooth cubic ease in-out
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // 360 degree orbit around the character
    const angle = this.outroStartAngle + ease * Math.PI * 2;
    // Maintain gentle, cinematic radius and height tightening slightly for focus
    const radius = this.outroStartRadius - ease * 1.0;
    const height = this.outroStartHeight + Math.sin(ease * Math.PI) * 0.8;

    const lookX = this.outroTarget.x;
    const lookY = this.outroTarget.y + 0.55;
    const lookZ = this.outroTarget.z;

    const camX = lookX + Math.sin(angle) * radius;
    const camZ = lookZ + Math.cos(angle) * radius;
    const camY = lookY + height;

    this.context.camera.object.position.set(camX, camY, camZ);
    this.context.camera.object.lookAt(lookX, lookY, lookZ);
  }

  destroy(): void {
    this.preparedLevel.clear();
    this.cleanupCurrentStage();
    this.contactShadows.dispose();this.atmosphere.dispose();
    this.vfxGroup.clear();
    this.waterRipples = [];
    this.splashDroplets = [];
    this.lavaSparks = [];
    this.scene.clear();
    this.skyboxTextureCache.forEach(texture=>texture.dispose());this.skyboxTextureCache.clear();
    this.environmentLoads.clear();
    this.context = undefined;
  }

  /**
   * Loads and wraps the 3D level environment in its dedicated world/level image,
   * applying atmospheric depth blur and world-matched lighting.
   */
  async applyLevelEnvironment(world: number, level: number): Promise<void> {
    const key = `w${world}_l${level}`;
    this.activeEnvironmentKey = key;

    // Harmonize ambient, sun, and fill lighting with the world
    this.applyWorldLighting(world, level);

    // Check if texture was already generated and cached
    const cached = this.skyboxTextureCache.get(key);
    if (cached) {
      this.applyTextureToScene(cached);
      return;
    }

    const pending=this.environmentLoads.get(key);if(pending)return pending;

    // Set immediate atmospheric color/gradient while image is loading
    const worldDef = getWorldById(world);
    const placeholderTexture = this.createFallbackSkyTexture(
      world===7&&level===3?'#0b1832':worldDef.skyColor,
      world===7&&level===3?'#293d5c':worldDef.horizonColor
    );
    this.applyTextureToScene(placeholderTexture);

    // Load level background image from assets
    const primarySrc = assetUrl(`/assets/maps/world${world}level${level}.jpg`);
    const fallbackSrc = assetUrl(`/assets/maps/world${world}.jpg`);
    const load=loadFirstUIImage([primarySrc,fallbackSrc]).then(img=>{
      if(!this.context){placeholderTexture.dispose();return;}
      if(img) {
        const processedTexture=this.generatePanoramicTexture(img,world,level);
        this.skyboxTextureCache.set(key,processedTexture);
        while(this.skyboxTextureCache.size>4){const oldest=[...this.skyboxTextureCache.keys()].find(k=>k!==key&&k!==this.activeEnvironmentKey);if(!oldest)break;this.skyboxTextureCache.get(oldest)?.dispose();this.skyboxTextureCache.delete(oldest);}
        if(this.activeEnvironmentKey===key)this.applyTextureToScene(processedTexture);
      }
      // The panoramic result replaces this temporary texture; dispose only when no longer active.
      if(img||this.activeEnvironmentKey!==key)placeholderTexture.dispose();
    }).finally(()=>{this.environmentLoads.delete(key);});
    this.environmentLoads.set(key,load);
    await load;
  }

  /**
   * Seamlessly paints the level image across a 360-degree panorama
   * with soft atmospheric depth blur and altitude gradient haze.
   */
  private generatePanoramicTexture(
    img: HTMLImageElement,
    world: number,
    level: number
  ): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;

    // 1. Soft atmospheric depth blur so foreground track & player ball stand out with great contrast
    ctx.filter = "blur(3.5px)";

    // Seamless 360 wrap: draw image mirrored horizontally
    // Left half (0 to 1024)
    ctx.drawImage(img, 0, 0, 1024, 1024);

    // Right half (1024 to 2048) flipped horizontally so edge 1024 and 0/2048 match seamlessly
    ctx.save();
    ctx.translate(2048, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, 1024, 1024);
    ctx.restore();

    ctx.filter = "none";

    if(world===7&&level===3){ctx.fillStyle='rgba(6,14,37,0.66)';ctx.fillRect(0,0,2048,1024);}

    // 2. Atmospheric haze gradient at horizon / bottom
    const hazeColors: Record<number, string> = {
      1: "rgba(224, 122, 95, 0.45)",  // Villamanta warm clay
      2: "rgba(0, 188, 212, 0.45)",   // San Juan turquoise sea
      3: "rgba(34, 197, 94, 0.45)",   // Mesegal green valley
      4: "rgba(100, 116, 139, 0.45)", // Carabanchel urban slate
      5: "rgba(22, 163, 74, 0.50)",   // Asturias emerald mountains
      6: "rgba(203, 213, 225, 0.55)", // Londres winter snow
      7: "rgba(244, 114, 182, 0.45)", // Japón sakura petals
      8: "rgba(14, 165, 233, 0.55)"   // Noruega arctic glacier
    };
    const hazeColor = hazeColors[world] || "rgba(129, 212, 250, 0.4)";

    // Bottom atmospheric mist
    const bottomHaze = ctx.createLinearGradient(0, 700, 0, 1024);
    bottomHaze.addColorStop(0, "rgba(0, 0, 0, 0)");
    bottomHaze.addColorStop(0.5, hazeColor);
    bottomHaze.addColorStop(1, "rgba(15, 23, 42, 0.85)");
    ctx.fillStyle = bottomHaze;
    ctx.fillRect(0, 700, 2048, 324);

    // Top zenith sky tint
    const topZenith = ctx.createLinearGradient(0, 0, 0, 220);
    topZenith.addColorStop(0, "rgba(15, 23, 42, 0.4)");
    topZenith.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = topZenith;
    ctx.fillRect(0, 0, 2048, 220);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    return texture;
  }

  /**
   * Generates a fast celestial gradient fallback texture while the high-res image loads.
   */
  private createFallbackSkyTexture(skyColor: string, horizonColor: string): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, skyColor);
    grad.addColorStop(0.7, horizonColor);
    grad.addColorStop(1, "#1e293b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    return texture;
  }

  /**
   * Applies the texture to the skydome sphere mesh and the scene background/environment.
   */
  private applyTextureToScene(texture: THREE.CanvasTexture): void {
    this.currentSkyTexture = texture;
    if (this.skydomeMesh) {
      const mat = this.skydomeMesh.material as THREE.MeshBasicMaterial;
      mat.map = texture;
      mat.needsUpdate = true;
    }
    this.scene.background = this.isPitchBlackMode ? new THREE.Color(0x000000):texture;
    this.scene.environment = !this.isPitchBlackMode&&this.currentQuality === "high" ? texture : null;
  }

  /**
   * Dynamically tunes world lighting to harmonize with each environment theme.
   */
  private applyWorldLighting(world: number, level: number): void {
    if (!this.ambientLight || !this.directionalLight || !this.fillLight) return;

    const preview=this.scene.userData.artPreviewData as LevelData|undefined;
    const data=preview??(this.currentLevelData?.world===world&&this.currentLevelData.level===level ? this.currentLevelData:undefined);
    const art=artDirection(world,level,data);this.scene.userData.artDirection=art;
    this.ambientLight.color.setHex(art.sky);this.ambientLight.groundColor.setHex(art.ground);this.ambientLight.intensity=art.ambient;
    this.directionalLight.color.setHex(art.sun);this.directionalLight.intensity=art.sunIntensity;
    this.directionalLight.position.set(...art.sunOffset);this.fillLight.color.setHex(art.fill);this.fillLight.intensity=art.fillIntensity;
    this.horizonColor.value.setHex(art.horizon);this.atmosphere.configure(art);
  }

  private updateKitsuneLighting(active:boolean):void {
    if(active===this.kitsuneDark)return;
    this.kitsuneDark=active;
    if(this.skydomeMesh)for(const material of Array.isArray(this.skydomeMesh.material)?this.skydomeMesh.material:[this.skydomeMesh.material]) {
      const tinted=material as THREE.MeshBasicMaterial;tinted.color?.setHex(active?0x243e85:0xffffff);
    }
    if(active) {
      this.scene.fog=this.kitsuneFog;
      if(this.ambientLight){this.ambientLight.color.setHex(0x658cdb);this.ambientLight.groundColor.setHex(0x080f2a);this.ambientLight.intensity=.42;}
      if(this.directionalLight){this.directionalLight.color.setHex(0x658dff);this.directionalLight.intensity=.28;}
      if(this.fillLight){this.fillLight.color.setHex(0x1d60cc);this.fillLight.intensity=.18;}
      this.horizonColor.value.setHex(0x0b1944);
    } else {
      if(this.scene.fog===this.kitsuneFog)this.scene.fog=this.clearFog;
      if(this.currentLevelData)this.applyWorldLighting(this.currentLevelData.world,this.currentLevelData.level);
    }
  }

  /**
   * Checks whether the current stage should run the pitch-black nocturnal flashlight mode (M3-N4-E9).
   */
  private checkAndApplyPitchBlackMode(world: number, level: number, stage: number, data: LevelData | null): void {
    const isPitchBlack =
      (world === 3 && level === 4 && stage === 9) ||
      Boolean(data?.properties?.pitchBlack) ||
      data?.name === "Ruta Nocturna";

    if (isPitchBlack) {
      this.setupPitchBlackMode();
    } else {
      this.disablePitchBlackMode();
    }
  }

  /**
   * Initializes the immersive pitch-black mountain atmosphere with a focused flashlight directly beneath the player.
   */
  private setupPitchBlackMode(): void {
    this.isPitchBlackMode = true;

    // Dim ambient and kill directional sun light
    if (this.ambientLight) {
      this.ambientLight.color.setHex(0x020306);
      this.ambientLight.groundColor.setHex(0x000000);
      this.ambientLight.intensity = 0.04;
    }
    if (this.directionalLight) {
      this.directionalLight.intensity = 0.0;
    }
    if (this.fillLight) {
      this.fillLight.intensity = 0.0;
    }

    // Set background to pure pitch-black and hide celestial skydome
    if (this.skydomeMesh) {
      this.skydomeMesh.visible = false;
    }
    this.scene.background = new THREE.Color(0x000000);
    this.scene.environment = null;
    this.scene.fog = this.pitchBlackFog;

    // Create downward-facing spot lantern shining directly on the ground beneath the ball
    if (!this.playerSpotlight) {
      this.playerSpotlightTarget = new THREE.Object3D();
      this.scene.add(this.playerSpotlightTarget);

      this.playerSpotlight = new THREE.SpotLight(0xffeedd, 14.0, 22.0, Math.PI / 4.5, 0.88, 1.2);
      this.playerSpotlight.target = this.playerSpotlightTarget;
      this.scene.add(this.playerSpotlight);
    }

    // Create localized sphere point light to softly illuminate ball shell and contact point
    if (!this.playerPointLight) {
      this.playerPointLight = new THREE.PointLight(0xffeedd, 3.5, 5.5, 2.0);
      this.scene.add(this.playerPointLight);
    }

    // Create procedural soft illuminated circular ground pool decal directly beneath character
    if (!this.playerLightDisc) {
      const discGeo = new THREE.PlaneGeometry(5.2, 5.2);
      discGeo.rotateX(-Math.PI / 2);

      const discCanvas = document.createElement("canvas");
      discCanvas.width = 128;
      discCanvas.height = 128;
      const ctx = discCanvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, "rgba(255, 240, 200, 0.75)");
        grad.addColorStop(0.25, "rgba(255, 225, 170, 0.45)");
        grad.addColorStop(0.55, "rgba(255, 200, 130, 0.18)");
        grad.addColorStop(0.85, "rgba(255, 170, 90, 0.04)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);

        const discTex = new THREE.CanvasTexture(discCanvas);
        const discMat = new THREE.MeshBasicMaterial({
          map: discTex,
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });
        this.playerLightDisc = new THREE.Mesh(discGeo, discMat);
        this.scene.add(this.playerLightDisc);
      }
    }

    this.updatePitchBlackLights();

    if (this.context) {
      this.context.hud.setPitchBlack(true);
    }
  }

  /**
   * Restores normal environment and removes pitch-black flashlight elements.
   */
  private disablePitchBlackMode(): void {
    if (!this.isPitchBlackMode) return;
    this.isPitchBlackMode = false;

    if (this.playerSpotlight) {
      this.scene.remove(this.playerSpotlight);
      this.playerSpotlight.dispose();
      this.playerSpotlight = null;
    }
    if (this.playerSpotlightTarget) {
      this.scene.remove(this.playerSpotlightTarget);
      this.playerSpotlightTarget = null;
    }
    if (this.playerPointLight) {
      this.scene.remove(this.playerPointLight);
      this.playerPointLight.dispose();
      this.playerPointLight = null;
    }
    if (this.playerLightDisc) {
      this.scene.remove(this.playerLightDisc);
      if (this.playerLightDisc.material instanceof THREE.Material) {
        this.playerLightDisc.material.dispose();
      }
      this.playerLightDisc.geometry.dispose();
      this.playerLightDisc = null;
    }

    if (this.scene.fog === this.pitchBlackFog) {
      this.scene.fog = this.clearFog;
    }
    if (this.skydomeMesh) {
      this.skydomeMesh.visible = true;
    }
    if (this.context) {
      this.context.hud.setPitchBlack(false);
    }
  }

  /**
   * Synchronously moves the downward flashlight and ground light pool with the player ball.
   */
  private updatePitchBlackLights(): void {
    if (!this.player) return;
    const pPos = this.player.getPosition();
    if (this.playerSpotlight && this.playerSpotlightTarget) {
      this.playerSpotlight.position.set(pPos.x, pPos.y + 4.2, pPos.z);
      this.playerSpotlightTarget.position.set(pPos.x, pPos.y - 1.5, pPos.z);
    }
    if (this.playerPointLight) {
      this.playerPointLight.position.set(pPos.x, pPos.y + 0.35, pPos.z);
    }
    if (this.playerLightDisc) {
      this.playerLightDisc.position.set(pPos.x, pPos.y - 0.48, pPos.z);
    }
  }
}



