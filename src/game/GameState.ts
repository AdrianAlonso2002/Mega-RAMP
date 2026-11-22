export type GameScreen =
  | "title"
  | "character-select"
  | "world-select"
  | "level-select"
  | "stage-select"
  | "loading"
  | "gameplay"
  | "victory"
  | "level-clear"
  | "game-clear"
  | "gameover"
  | "pause"
  | "editor"
  | "options";

export class GameState {
  screen: GameScreen = "title";

  selectedCharacter = "rony";
  selectedSkin = "normal";
  selectedWorld = 1;
  selectedLevel = 1;
  selectedStage = 1;

  lives = 5;
  collectibles = 0;
  stageCollectibles = 0;
  levelRunCollectibles = 0;
  levelRunTime = 0; // Cumulative time across stages of the active level run

  // Per-stage stats accumulated during the active run (only committed upon beating stage 10)
  runStageTimes: number[] = [];
  runStageCollectibles: number[] = [];

  elapsedTime = 0;
  timeLimit = 60;
  score = 0;

  // Customization: Background & Music
  selectedBGM = "jungle_groove";
  selectedSkyTheme = "jungle";

  // Visual options
  crtFilter = false;

  resetLives(): void {
    this.lives = 5;
  }

  resetLevelRun(): void {
    this.lives = 5;
    this.collectibles = 0;
    this.stageCollectibles = 0;
    this.levelRunCollectibles = 0;
    this.levelRunTime = 0;
    this.runStageTimes = [];
    this.runStageCollectibles = [];
    this.elapsedTime = 0;
  }

  resetGame(): void {
    this.resetLevelRun();
    this.score = 0;
  }

  resetStage(): void {
    this.levelRunCollectibles = Math.max(0, this.levelRunCollectibles - this.stageCollectibles);
    this.stageCollectibles = 0;
    this.elapsedTime = 0;
  }

  /**
   * Adds collectible item.
   * Every 10 items grants 1 extra life!
   * Returns true if 1UP was awarded.
   */
  addCollectible(): boolean {
    this.stageCollectibles++;
    this.levelRunCollectibles++;
    this.collectibles++;
    this.score += 100;

    if (this.collectibles >= 10) {
      this.collectibles = 0;
      this.lives++;
      return true;
    }
    return false;
  }

  /**
   * Deducts 1 life.
   * Returns true if lives are exhausted (game over).
   */
  loseLife(): boolean {
    this.lives = Math.max(0, this.lives - 1);
    return this.lives <= 0;
  }
}
