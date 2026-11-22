import type { CharacterDefinition } from "./PlayerTypes";
import {getCharacterSkin, characterSpritePath} from './CharacterSkins';

export const CHARACTERS: CharacterDefinition[] = [
  {
    id: "rony",
    name: "Rony",
    description: "Ronaldo es un Yorkshire con cara nardo, dispuesto a correr hasta que no pueda más.",
    themeColor: "#B45309",
    speed: 0.85,
    acceleration: 1.0,
    handling: 0.85,
    collectibleId: "pan",
    collectibleName: "Pan",
    collectibleEmoji: "🥖",
    spritePath: "/assets/characters/rony_normal.png"
  },
  {
    id: "adri",
    name: "Adri",
    description: "Quiere demostrar que tanto entrenamiento ha servido para este momento...",
    themeColor: "#E53935",
    speed: 1.0,
    acceleration: 0.95,
    handling: 0.75,
    collectibleId: "dragon_ball",
    collectibleName: "Bolas de Dragón",
    collectibleEmoji: "🔮",
    spritePath: "/assets/characters/adri_normal.png"
  },
  {
    id: "misi",
    name: "Misi",
    description: "Aunque este como una bola ¡Siempre cae de pie!",
    themeColor: "#EC4899",
    speed: 0.80,
    acceleration: 0.80,
    handling: 0.95,
    collectibleId: "lonchas_pavo",
    collectibleName: "Pavo",
    collectibleEmoji: "🍗",
    spritePath: "/assets/characters/misi_normal.png"
  },
  {
    id: "pao",
    name: "Pao",
    description: "Siempre pensando en llegar a la meta y ser la vencedora.",
    themeColor: "#9333EA",
    speed: 0.85,
    acceleration: 0.90,
    handling: 0.90,
    collectibleId: "varitas_estrella",
    collectibleName: "Varitas",
    collectibleEmoji: "🪄",
    spritePath: "/assets/characters/pao_normal.png"
  }
];

export function getCharacterById(id: string, skinId = 'normal'): CharacterDefinition {
  const character = CHARACTERS.find(c => c.id === id) ?? CHARACTERS[0];
  const skin = getCharacterSkin(character.id, skinId);
  return skin.id === 'normal' ? character : {...character, skinId: skin.id, spritePath: characterSpritePath(character.id, skin.id)};
}
