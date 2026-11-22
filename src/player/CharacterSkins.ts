import crops from './CharacterSkinCrops.json';

export interface CharacterSkin {
  id: string;
  name: string;
  spriteBase: string;
  /** World collection reward; normal forms are always available. */
  unlock?:{world:number;percent:number};
  /** Normalized square region for UI portraits and narrow eye previews. */
  avatar?: readonly [number, number, number];
  eyes?: readonly [number, number, number, number];
}

const forms = (character: string, variants: readonly [string, string][]): CharacterSkin[] =>
  [{id: 'normal', name: 'Normal', spriteBase: character, avatar: NORMAL_PORTRAITS[character]},
    ...variants.map(([id, name]) => {
      const spriteBase = `${character}_${id}`;
      const crop = crops[spriteBase as keyof typeof crops];
      return {id, name, spriteBase, unlock:{world:SKIN_REWARD_WORLDS[spriteBase],percent:80}, avatar: crop.avatar as [number,number,number], eyes: crop.eyes as [number,number,number,number]};
    })];

// Tight face-only portraits, shared by the title and all character cards.
const NORMAL_PORTRAITS: Record<string, readonly [number,number,number]> = {
  adri: [.33,.225,.34], pao: [.33,.22,.34],
  misi: [.345,.18,.31], rony: [.34,.255,.32]
};

const SKIN_REWARD_WORLDS:Record<string,number>={
 rony_blue:1,rony_bebe:2,misi_bebe:3,adri_especial:4,
 pao_especial:5,pao_hp:6,adri_ssj:7,misi_negra:8
};

export const CHARACTER_SKINS: Readonly<Record<string, readonly CharacterSkin[]>> = {
  adri: forms('adri', [['especial', 'Especial'], ['ssj', 'Ssj']]),
  pao: forms('pao', [['especial', 'Especial'], ['hp', 'HP']]),
  misi: forms('misi', [['bebe', 'Bebé'], ['negra', 'Negra']]),
  rony: forms('rony', [['bebe', 'Bebé'], ['blue', 'Blue']])
};

export function getCharacterSkins(characterId: string): readonly CharacterSkin[] {
  return Object.hasOwn(CHARACTER_SKINS, characterId) ? CHARACTER_SKINS[characterId] : CHARACTER_SKINS.rony;
}

export function getCharacterSkin(characterId: string, skinId = 'normal'): CharacterSkin {
  const skins = getCharacterSkins(characterId);
  const migrated = characterId === 'adri' && skinId === 'londres' || characterId === 'pao' && skinId === 'noruega'
    ? 'especial' : characterId === 'pao' && skinId === 'ssj' ? 'hp' : skinId;
  return skins.find(skin => skin.id === migrated) ?? skins[0];
}

export function characterSpritePath(characterId: string, skinId = 'normal', state = 'normal'): string {
  return `/assets/characters/${getCharacterSkin(characterId, skinId).spriteBase}_${state}.png`;
}
