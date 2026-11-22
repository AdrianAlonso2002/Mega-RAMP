export interface CharacterDefinition {
  id: string;
  name: string;
  description: string;
  themeColor: string;

  speed: number;
  acceleration: number;
  handling: number;

  collectibleId: string;
  collectibleName: string;
  collectibleEmoji: string;

  spritePath: string;
  skinId?: string;
}
