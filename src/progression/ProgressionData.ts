export interface StageProgress {
  completed: boolean;
  bestTime: number | null;
  collectibles: number;
  /** Persistent unique prizes, including collections on alternative routes and failed runs. */
  collectedIds?: string[];
}

export interface LevelRecord {
  completed: boolean;
  bestTime: number | null;
  totalCollectibles: number;
  completedCharacters: string[];
  clearCount: number;
}

export interface GameProgress {
  selectedCharacter: string;
  characterSkins?: Record<string, string>;
  announcedSkinRewards?: string[];
  worlds: Record<
    string,
    Record<
      string,
      Record<string, StageProgress>
    >
  >;
  levelRecords?: Record<
    string,
    LevelRecord
  >;
}

export interface SkinReward {characterId:string;skinId:string}
