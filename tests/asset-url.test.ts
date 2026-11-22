import { afterEach, describe, expect, it, vi } from 'vitest';
import { assetUrl } from '../src/core/AssetUrl';
import { characterSpritePath } from '../src/player/CharacterSkins';
import { worldMapIcon } from '../src/ui/MapIcons';

afterEach(() => vi.unstubAllEnvs());

describe('resources on project hosting', () => {
  it('keeps resources inside the GitHub Pages project', () => {
    vi.stubEnv('BASE_URL', '/Mega-RAMP/');
    expect(assetUrl('/audio/menu1.webm')).toBe('/Mega-RAMP/audio/menu1.webm');
    expect(characterSpritePath('rony', 'normal')).toBe('/Mega-RAMP/assets/characters/rony_normal.png');
    expect(worldMapIcon(8)).toContain('src="/Mega-RAMP/assets/maps/world8.jpg"');
  });
  it('supports portable relative builds and local development', () => {
    vi.stubEnv('BASE_URL', './');
    expect(assetUrl('/assets/maps/world1.jpg')).toBe('./assets/maps/world1.jpg');
    vi.stubEnv('BASE_URL', '/');
    expect(assetUrl('/assets/maps/world1.jpg')).toBe('/assets/maps/world1.jpg');
  });
});
