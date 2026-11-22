/** Illustrated medallions reuse the game's world artwork and browser image cache. */
export function worldMapIcon(world: number): string {
  const id = Number.isInteger(world) && world >= 1 && world <= 8 ? world : 1;
  return `<img class="world-art-icon" src="/assets/maps/world${id}.jpg" alt="" width="80" height="80" decoding="async" draggable="false" />`;
}

/** Each world keeps its own pastel across its hub and all its levels. */
export function worldMapColor(world: number): string {
  // Green, blue, yellow, orange, red, purple, pink and neutral pearl.
  return ["#b8dbb3", "#b4d4ed", "#eee3a4", "#edc19a", "#e9aaa4", "#cab7e5", "#eec6dc", "#dad7d2"][world - 1] ?? "#b8dbb3";
}

export function mapIcon(name: 'back' | 'focus' | 'film' | 'plus' | 'minus' | 'crown' | 'play' | 'clock' | 'chart' | 'repeat' | 'lock' | 'sparkles'): string {
  const paths = {
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>',
    chart: '<path d="M4 4v16h17M8 15v-4m5 4V7m5 8V5"/>',
    repeat: '<path d="m18 2 3 4-3 4M3 11V9a3 3 0 0 1 3-3h15M6 22l-3-4 3-4m15-1v2a3 3 0 0 1-3 3H3"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
    sparkles: '<path d="m12 3 3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/>',
    back: '<path d="m12 5-7 7 7 7M5 12h15"/>',
    focus: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M10 7v6m-3-3h6"/>',
    film: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    crown: '<path d="m3 6 5 5 4-7 4 7 5-5-2 13H5zM6 16h12"/>',
    play: '<path d="m8 4 12 8-12 8z"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}
