import {FramePacer} from "../core/FramePacer";
import { Renderer } from "../rendering/Renderer";
import { Camera } from "../rendering/Camera";
import { InputManager } from "../input/InputManager";
import { PhysicsWorld } from "../physics/PhysicsWorld";
import { SceneManager } from "./SceneManager";
import { PerformanceManager } from "../core/PerformanceManager";
import { GameState } from "./GameState";
import { ProgressionManager } from "../progression/ProgressionManager";
import { UIManager } from "../ui/UIManager";
import { HUD } from "../ui/HUD";
import { TouchControls } from "../ui/TouchControls";
import type { LevelEditor } from "../editor/LevelEditor";
import { AudioManager } from "../audio/AudioManager";
import { SpriteTextures } from "../rendering/SpriteTextures";
import type { LevelData } from "../levels/LevelTypes";
import { runLoadingTransition } from "../ui/LoadingTransition";

export class Game {
  private readonly renderer: Renderer;
  private readonly camera: Camera;
  private readonly input: InputManager;
  private readonly physics: PhysicsWorld;
  private readonly scenes: SceneManager;
  private readonly performance: PerformanceManager;
  private readonly state: GameState;
  private readonly progression: ProgressionManager;
  private readonly ui: UIManager;
  private readonly hud: HUD;
  private readonly touchControls: TouchControls;

  private editor: LevelEditor | null = null;
  private animationFrame = 0;
  private previousTime = performance.now();
  private readonly framePacer=new FramePacer();
  private fpsBadgeTimer = 0;
  private speedBadgeTimer = 0;
  private destroyed = false;
  private stageLoading = false;
  private loadController?: AbortController;

  constructor(private readonly root: HTMLElement) {
    this.renderer = new Renderer(root);
    this.camera = new Camera();
    this.input = new InputManager();
    this.physics = new PhysicsWorld();
    this.scenes = new SceneManager();
    this.performance = new PerformanceManager(this.renderer);
    this.state = new GameState();
    this.progression = new ProgressionManager();

    // Sync saved character
    this.state.selectedCharacter = this.progression.getSelectedCharacter();
    this.state.selectedSkin = this.progression.getSelectedSkin(
      this.state.selectedCharacter,
    );

    // Initialize HUD & Touch Controls
    this.hud = new HUD(root, {
      onPause: () => this.pauseGame(),
    });
    this.hud.setVisible(false);

    this.touchControls = new TouchControls(root);
    this.touchControls.setVisible(false);

    // Initialize UI Manager
    this.ui = new UIManager(root, this.state, this.progression, {
      onStartStage: (w, l, s) => void this.startStage(w, l, s),
      onSelectCharacter: (charId) => {
        this.state.selectedCharacter = charId;
        this.state.selectedSkin = this.progression.getSelectedSkin(charId);
        this.scenes.changeCharacter(charId);
      },
      onOpenEditor: () => this.openEditor(),
      onResume: () => this.resumeGame(),
      onRestartStage: () => this.restartStage(),
      onRestartLevel: () => void this.restartLevel(),
      onNextStage: () => void this.nextStage(),
      onReturnToMenu: () => this.returnToTitle(),
      onChangeBGM: (trackId) => {
        this.state.selectedBGM = trackId;
        AudioManager.getInstance().setBGMTrack(trackId);
      },
      onChangeBackground: (skyThemeId) => {
        this.state.selectedSkyTheme = skyThemeId;
        this.scenes.applyBackground(skyThemeId);
      },
      onQualityChange: (quality) => {
        this.renderer.setQuality(quality);
        this.scenes.setQuality(quality);
      },
      onCameraModeChange: (mode) => this.camera.setMode(mode),
    });

    this.initialize();
  }

  private readonly backgroundPause = (event?: Event): void => {
    this.input.reset();
    this.touchControls.reset();
    if (document.hidden || event?.type === "blur") this.pauseGame();
    this.previousTime = performance.now();
  };
  private initialize(): void {
    document.addEventListener("visibilitychange", this.backgroundPause);
    window.addEventListener("blur", this.backgroundPause);
    SpriteTextures.preloadCharacterTextures();
    const quality = this.progression.getGraphicsQuality();
    this.camera.setMode(this.progression.getCameraMode());
    this.renderer.setQuality(quality);
    this.scenes.setQuality(quality);
    this.renderer.attachCamera(this.camera.object);

    this.scenes.initialize({
      renderer: this.renderer,
      camera: this.camera,
      input: this.input,
      touchControls: this.touchControls,
      physics: this.physics,
      state: this.state,
      progression: this.progression,
      hud: this.hud,
      onStageClear: () => this.onStageClear(),
      onGameOver: () => this.onGameOver(),
    });

    // Start on title screen
    this.ui.showScreen("title");
  }

  start(): void {
    if (this.destroyed) {
      throw new Error("Cannot start a destroyed game.");
    }

    this.previousTime = performance.now();
    this.animationFrame = requestAnimationFrame(this.loop);
  }

  private async startStage(
    world: number,
    level: number,
    stage: number,
    continuation = false,
  ): Promise<void> {
    await this.enterStage(
      world,
      level,
      stage,
      async (signal) => {
        if (!continuation) await this.scenes.prepareLevel(world, level, signal);
        if (signal.aborted) return;
        await this.scenes.loadStage(world, level, stage, {
          signal,
          deferIntro: true,
        });
      },
      continuation,
    );
  }

  private async enterStage(
    world: number,
    level: number,
    stage: number,
    prepare: (signal: AbortSignal) => Promise<void>,
    continuation = false,
  ): Promise<void> {
    if (this.stageLoading || this.destroyed) return;
    this.stageLoading = true;
    const controller = new AbortController();
    this.loadController = controller;
    this.state.selectedWorld = world;
    this.state.selectedLevel = level;
    this.state.selectedStage = stage;
    this.state.elapsedTime = 0;
    this.state.stageCollectibles = 0;
    if (!continuation || stage === 1) {
      this.state.resetLevelRun();
    }
    this.hud.setVisible(false);
    this.touchControls.setVisible(false);
    if (continuation) this.ui.beginStageTransition();
    else this.ui.showLevelLoading(world, level, stage);

    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }

    try {
      await runLoadingTransition(
        async (signal) => {
          await Promise.all([
            this.physics.waitForReady(),
            SpriteTextures.waitForCharacterSkin(
              this.state.selectedCharacter,
              this.state.selectedSkin,
            ),
          ]);
          if (signal.aborted) return;
          await prepare(signal);
          if (signal.aborted) return;
          await this.renderer.prepareScene(this.scenes.scene,this.camera.object);
          if (signal.aborted) return;
          // Upload scene resources behind the cover, without advancing physics or the timer.
          this.renderer.render(this.scenes.scene, this.camera.object);
        },
        controller.signal,
        continuation ? 0 : 3000,
      );
      if (controller.signal.aborted || this.destroyed) return;
      this.scenes.beginStageIntro();
      this.ui.showScreen("gameplay");
      this.hud.setVisible(true);
      this.touchControls.setVisible(true);
      this.previousTime = performance.now();
    } catch (error) {
      if (controller.signal.aborted || this.destroyed) return;
      console.error("No se ha podido preparar el nivel.", error);
      this.scenes.cleanupCurrentStage();
      AudioManager.getInstance().stopBGM();
      if (continuation) this.ui.showLevelLoading(world, level, stage);
      this.ui.showLoadingError(
        () => void this.enterStage(world, level, stage, prepare, continuation),
        () => this.returnToTitle(),
      );
    } finally {
      if (this.loadController === controller) {
        this.stageLoading = false;
        this.loadController = undefined;
      }
    }
  }

  private cancelStageLoad(): void {
    this.loadController?.abort();
    this.loadController = undefined;
    this.stageLoading = false;
  }

  private async openEditor(): Promise<void> {
    if (this.stageLoading || this.destroyed) return;
    this.cancelStageLoad();
    this.hud.setVisible(false);
    this.touchControls.setVisible(false);
    try {
      await this.ui.prepareEditor(async () => {
        const { LevelEditor } = await import("../editor/LevelEditor");
        if (this.destroyed) return;
        this.editor?.destroy();
        this.editor = null;
        this.scenes.cleanupCurrentStage();
        this.editor = new LevelEditor(
          this.root,
          this.scenes.scene,
          this.camera.object,
          {
            onPlaytest: (data: LevelData) => this.playtestCustomLevel(data),
            onExit: () => this.returnToTitle(),
            onEnvironmentChange: (world: number, level: number) => {
              void this.scenes.applyLevelEnvironment(world, level);
            },
          },
          this.state.selectedWorld || 1,
          this.state.selectedLevel || 1,
          this.state.selectedStage || 1,
        );
        await this.scenes.applyLevelEnvironment(
          this.state.selectedWorld || 1,
          this.state.selectedLevel || 1,
        );
        if (!this.destroyed)
          this.renderer.render(this.scenes.scene, this.camera.object);
      });
    } catch (error) {
      console.error("No se ha podido abrir el editor.", error);
      if (!this.destroyed) this.ui.showScreen("title");
    }
  }
  private playtestCustomLevel(data: LevelData): void {
    void this.enterStage(
      data.world || 1,
      data.level || 1,
      data.stage || 1,
      async (signal) => {
        if (signal.aborted) return;
        await this.scenes.prepareLevel(data.world||1,data.level||1,signal);
        if(signal.aborted)return;
        await SpriteTextures.prepareLevelAssets([data]);
        if(signal.aborted)return;
        this.scenes.loadCustomLevel(data, { deferIntro: true });
        await this.scenes.applyLevelEnvironment(
          data.world || 1,
          data.level || 1,
        );
      },
    );
  }

  private pauseGame(): void {
    AudioManager.getInstance().stopSnoring();
    if (this.state.screen === "gameplay") {
      this.state.screen = "pause";
      this.input.reset();
      this.touchControls.reset();
      this.hud.setVisible(false);
      this.touchControls.setVisible(false);
      this.ui.showScreen("pause");
    }
  }

  private resumeGame(): void {
    this.input.reset();
    this.touchControls.reset();
    this.previousTime = performance.now();
    this.state.screen = "gameplay";
    this.ui.showScreen("gameplay");
    this.hud.setVisible(true);
    this.touchControls.setVisible(true);
  }

  private restartStage(): void {
    this.state.lives = 5;
    this.state.elapsedTime = 0;
    this.state.screen = "gameplay";
    this.ui.showScreen("gameplay");
    this.hud.setVisible(true);
    this.touchControls.setVisible(true);
    this.scenes.restartCurrentStage();
  }

  private async restartLevel(): Promise<void> {
    this.state.lives = 5;
    this.state.elapsedTime = 0;
    this.state.stageCollectibles = 0;
    this.state.resetLevelRun();
    await this.startStage(
      this.state.selectedWorld,
      this.state.selectedLevel,
      1,
    );
  }

  private async nextStage(): Promise<void> {
    let w = this.state.selectedWorld;
    let l = this.state.selectedLevel;
    let s = this.state.selectedStage;

    if (s < 10) {
      s++;
    } else if (l < 4) {
      l++;
      s = 1;
    } else if (w < 8) {
      w++;
      l = 1;
      s = 1;
    } else {
      // Finished all 320 stages!
      this.scenes.cleanupCurrentStage();
      AudioManager.getInstance().stopBGM();
      this.hud.setVisible(false);
      this.touchControls.setVisible(false);
      this.state.screen = "game-clear";
      this.ui.showScreen("game-clear");
      return;
    }

    await this.startStage(w, l, s, s > 1);
  }

  private onStageClear(): void {
    if (this.state.selectedStage === 10) {
      // Beaten all 10 stages of the Level! Commit all 10 stages and record level statistics
      const w = this.state.selectedWorld;
      const l = this.state.selectedLevel;

      for (let s = 1; s <= 10; s++) {
        if (this.state.runStageTimes[s] === undefined) continue;
        const stageTime = this.state.runStageTimes[s] ?? 0;
        const stageCol = this.state.runStageCollectibles[s] ?? 0;
        this.progression.completeStage(w, l, s, stageTime, stageCol);
      }

      this.progression.recordLevelCompletion(
        w,
        l,
        this.state.levelRunTime,
        this.state.levelRunCollectibles,
        this.state.selectedCharacter,
      );

      this.hud.setVisible(false);
      this.touchControls.setVisible(false);
      this.state.screen = "level-clear";
      this.ui.showScreen("level-clear");
    } else {
      // Stages 1-9: Dynamic progression! Automatically advances without interrupting modal card
      void this.nextStage();
    }
  }

  private onGameOver(): void {
    this.state.selectedStage = 1;
    this.state.resetLevelRun();
    this.state.screen = "gameover";
    this.hud.setVisible(false);
    this.touchControls.setVisible(false);
    this.ui.showScreen("gameover");
  }

  private returnToTitle(): void {
    this.cancelStageLoad();
    AudioManager.getInstance().stopBGM();
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
    this.scenes.cleanupCurrentStage();
    this.state.selectedStage = 1;
    this.state.lives = 5;
    this.state.screen = "title";
    this.hud.setVisible(false);
    this.touchControls.setVisible(false);
    this.ui.showScreen("title");
  }

  private readonly loop = (currentTime: number): void => {
    if (this.destroyed) {
      return;
    }

    const fpsLimit = this.progression.getFPSLimit();
    if (!this.framePacer.shouldRender(currentTime,Number(fpsLimit))) {
      this.animationFrame = requestAnimationFrame(this.loop);
      return;
    }

    const frameDelta = (currentTime - this.previousTime) / 1000;
    const delta = Math.min(frameDelta, 0.05);
    this.previousTime = currentTime;

    this.input.update();
    if (this.state.screen === "gameplay") this.physics.step(delta);
    const drawScene =
      this.state.screen === "gameplay" || this.state.screen === "editor";
    if (drawScene) this.scenes.update(delta);
    if (this.editor) {
      this.editor.update(delta);
    }
    if (drawScene) this.scenes.updateVisuals(delta);

    this.performance.update(
      frameDelta,
      fpsLimit,
      drawScene && !this.stageLoading,
    );

    if (drawScene) this.renderer.render(this.scenes.scene, this.camera.object);

    // Update FPS display badge smoothly (4 times per second)
    this.fpsBadgeTimer += delta;
    if (this.fpsBadgeTimer >= 0.25) {
      this.fpsBadgeTimer = 0;
      this.hud.updateFPS(
        this.performance.getFPS(),
        this.progression.isShowFPS(),
      );
    }
    // Refresh at 10 Hz; avoid DOM writes and physics reads at the render frame rate.
    this.speedBadgeTimer += delta;
    if (this.speedBadgeTimer >= 0.1) {
      this.speedBadgeTimer %= 0.1;
      const showSpeed =
        this.progression.isShowSpeed() &&
        this.state.screen === "gameplay" &&
        !this.editor;
      this.hud.updateSpeed(
        showSpeed ? this.scenes.getPlayerSpeed() : 0,
        showSpeed,
      );
    }

    this.animationFrame = requestAnimationFrame(this.loop);
  };

  destroy(): void {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    document.removeEventListener("visibilitychange", this.backgroundPause);
    window.removeEventListener("blur", this.backgroundPause);
    this.cancelStageLoad();

    cancelAnimationFrame(this.animationFrame);

    if (this.editor) {
      this.editor.destroy();
    }
    this.input.destroy();
    this.physics.destroy();
    this.scenes.destroy();
    this.ui.destroy();
    this.hud.destroy();
    this.touchControls.destroy();
    this.renderer.destroy();
  }
}
