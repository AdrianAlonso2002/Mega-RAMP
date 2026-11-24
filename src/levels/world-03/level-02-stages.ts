import publishedEditorStages from '../editor-saved/world-03.json';
import {registerStageSet} from '../StageRegistry';
import type { LevelData } from "../LevelTypes";

// =============================================================================
// WORLD 3 - LEVEL 2: LA ERA (MESEGAL - EXTREMADURA / LAS HURDES)
// Etapas 1 a 10: Callejuela inversa, salto triple, perros del pueblo, miel densa,
// gran era de descanso (bonus objetos), plaza mayor de Mesegal, 10 folios de dibujos
// de flores continuos, niñas con coletitas, bajada peraltada y la histórica Era de trillar.
// =============================================================================

export const WORLD_03_LEVEL_02_STAGES: Record<number, LevelData> = {
  // ---------------------------------------------------------------------------
  // ETAPA 1: Callejuela2
  // La Callejuela 1 pero literalmente al revés: ascendiendo en pendiente continua
  // desde el extremo bajo hacia las ruinas altas de pizarra de Mesegal.
  // Rica textura de pizarra hurdana ("mesegal") y muretes de piedra seca.
  // ---------------------------------------------------------------------------
  1: {
    id: "world-03-level-02-stage-01",
    world: 3,
    level: 2,
    stage: 1,
    name: "Callejuela2",
    theme: "village",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: -22.0 },
    objects: [
      // Calle empedrada continua ascendente en pendiente suave (48m de largo)
      {
        id: "w3s11-road",
        type: "ramp",
        position: { x: 0.0, y: 1.5, z: 0.0 },
        rotation: { x: -0.065, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.8, z: 48.0 },
        properties: { theme: "mesegal" }
      },
      // Muretes laterales de contención de pizarra tradicional
      { id: "w3s11-curb-l", type: "platform", position: { x: -3.2, y: 1.8, z: 0.0 }, rotation: { x: -0.065, y: 0, z: 0 }, scale: { x: 0.4, y: 0.6, z: 48.0 }, properties: { theme: "pebbles" } },
      { id: "w3s11-curb-r", type: "platform", position: { x: 3.2, y: 1.8, z: 0.0 }, rotation: { x: -0.065, y: 0, z: 0 }, scale: { x: 0.4, y: 0.6, z: 48.0 }, properties: { theme: "pebbles" } },
      // Muros de piedra de casas de pizarra derruidas
      { id: "w3s11-wall-l1", type: "decoration", position: { x: -3.8, y: 1.8, z: -14.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 14, y: 1.5, z: 0.8 }, properties: { subType: "hurdes_stone_wall" } },
      { id: "w3s11-wall-r1", type: "decoration", position: { x: 3.8, y: 1.8, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 14, y: 1.5, z: 0.8 }, properties: { subType: "hurdes_stone_wall" } },
      { id: "w3s11-wall-l2", type: "decoration", position: { x: -3.8, y: 2.2, z: 12.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 12, y: 1.5, z: 0.8 }, properties: { subType: "hurdes_stone_wall" } },
      { id: "w3s11-wall-r2", type: "decoration", position: { x: 3.8, y: 2.2, z: 18.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 10, y: 1.5, z: 0.8 }, properties: { subType: "hurdes_stone_wall" } },
      // Obstáculos de escombros de pizarra que esquivar al subir
      { id: "w3s11-rubble-1", type: "decoration", position: { x: -1.6, y: 0.8, z: -14.0 }, rotation: { x: 0, y: -0.4, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "village_stones" } },
      { id: "w3s11-rubble-2", type: "platform", position: { x: 1.4, y: 1.3, z: -7.0 }, rotation: { x: -0.065, y: 0.1, z: 0 }, scale: { x: 2.0, y: 0.6, z: 2.2 }, properties: { theme: "mesegal" } },
      { id: "w3s11-rubble-3", type: "decoration", position: { x: -1.5, y: 1.8, z: 1.0 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "village_stones" } },
      { id: "w3s11-rubble-4", type: "platform", position: { x: 1.5, y: 2.3, z: 8.0 }, rotation: { x: -0.065, y: -0.2, z: 0 }, scale: { x: 1.8, y: 0.6, z: 2.0 }, properties: { theme: "mesegal" } },
      { id: "w3s11-rubble-5", type: "decoration", position: { x: -1.4, y: 2.8, z: 15.0 }, rotation: { x: 0, y: -0.3, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "village_stones" } },
      // Farolas clásicas y bancos
      { id: "w3s11-lantern-1", type: "decoration", position: { x: 2.5, y: 0.8, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s11-lantern-2", type: "decoration", position: { x: -2.5, y: 2.8, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s11-bench", type: "decoration", position: { x: 2.5, y: 2.6, z: 16.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "wooden_bench_rustic" } },
      // 10 Coleccionables invertidos
      { id: "w3s11-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s11-col-2", type: "collectible", position: { x: 1.2, y: 1.1, z: -15.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s11-col-3", type: "collectible", position: { x: -1.3, y: 1.4, z: -10.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s11-col-4", type: "collectible", position: { x: 1.3, y: 1.7, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s11-col-5", type: "collectible", position: { x: -1.2, y: 2.1, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s11-col-6", type: "collectible", position: { x: 1.2, y: 2.5, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s11-col-7", type: "collectible", position: { x: -1.4, y: 2.8, z: 9.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s11-col-8", type: "collectible", position: { x: 1.4, y: 3.1, z: 14.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s11-col-9", type: "collectible", position: { x: 0.0, y: 3.3, z: 19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s11-col-10", type: "collectible", position: { x: 0.0, y: 3.5, z: 21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta al final en la parte alta
      {
        id: "w3s11-goal",
        type: "goal",
        position: { x: 0.0, y: 3.8, z: 23.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 2: Salto3
  // Triple salto sobre barrancos de montaña mejorado: 3 pistas de despegue y aterrizaje
  // con rampas de recepción suaves que absorben el impacto y guías laterales protectoras.
  // ---------------------------------------------------------------------------
  2: {
    id: "world-03-level-02-stage-02",
    world: 3,
    level: 2,
    stage: 2,
    name: "Salto3",
    theme: "village",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 28.0 },
    objects: [
      // Pista de despegue 1
      { id: "w3s12-run-1", type: "platform", position: { x: 0.0, y: 0.0, z: 24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 10.0 }, properties: { theme: "mesegal" } },
      { id: "w3s12-ramp-1", type: "ramp", position: { x: 0.0, y: 0.8, z: 16.5 }, rotation: { x: 0.22, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 6.0 }, properties: { theme: "wood" } },
      // Aterrizaje 1 (con rampa de recepción en bajada) / Despegue 2
      { id: "w3s12-catch-1", type: "ramp", position: { x: 0.0, y: 1.2, z: 10.5 }, rotation: { x: -0.15, y: 0, z: 0 }, scale: { x: 7.0, y: 0.8, z: 5.0 }, properties: { theme: "mesegal" } },
      { id: "w3s12-land-1", type: "platform", position: { x: 0.0, y: 1.2, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.0, y: 0.8, z: 5.0 }, properties: { theme: "mesegal" } },
      { id: "w3s12-ramp-2", type: "ramp", position: { x: 0.0, y: 2.0, z: 1.0 }, rotation: { x: 0.24, y: 0, z: 0 }, scale: { x: 6.5, y: 0.8, z: 6.0 }, properties: { theme: "wood" } },
      // Aterrizaje 2 / Despegue 3
      { id: "w3s12-catch-2", type: "ramp", position: { x: 0.0, y: 2.6, z: -5.0 }, rotation: { x: -0.16, y: 0, z: 0 }, scale: { x: 7.5, y: 0.8, z: 5.0 }, properties: { theme: "mesegal" } },
      { id: "w3s12-land-2", type: "platform", position: { x: 0.0, y: 2.6, z: -9.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.5, y: 0.8, z: 5.0 }, properties: { theme: "mesegal" } },
      { id: "w3s12-ramp-3", type: "ramp", position: { x: 0.0, y: 3.5, z: -14.5 }, rotation: { x: 0.26, y: 0, z: 0 }, scale: { x: 7.0, y: 0.8, z: 6.0 }, properties: { theme: "wood" } },
      // Aterrizaje final 3 y gran plataforma de meta
      { id: "w3s12-catch-3", type: "ramp", position: { x: 0.0, y: 4.2, z: -20.5 }, rotation: { x: -0.15, y: 0, z: 0 }, scale: { x: 8.5, y: 0.8, z: 5.0 }, properties: { theme: "mesegal" } },
      { id: "w3s12-end", type: "platform", position: { x: 0.0, y: 4.2, z: -26.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 9.0, y: 0.8, z: 8.0 }, properties: { theme: "mesegal" } },
      // Pinos de Las Hurdes en los riscos laterales
      { id: "w3s12-pine-1", type: "decoration", position: { x: -5.0, y: 4.2, z: -26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      { id: "w3s12-pine-2", type: "decoration", position: { x: 5.0, y: 4.2, z: -26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      // 10 Coleccionables en los arcos de salto
      { id: "w3s12-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s12-col-2", type: "collectible", position: { x: 0.0, y: 1.4, z: 17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s12-col-3", type: "collectible", position: { x: 0.0, y: 2.4, z: 13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s12-col-4", type: "collectible", position: { x: 0.0, y: 2.0, z: 7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s12-col-5", type: "collectible", position: { x: 0.0, y: 2.8, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s12-col-6", type: "collectible", position: { x: 0.0, y: 3.8, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s12-col-7", type: "collectible", position: { x: 0.0, y: 3.4, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s12-col-8", type: "collectible", position: { x: 0.0, y: 4.4, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s12-col-9", type: "collectible", position: { x: 0.0, y: 5.2, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s12-col-10", type: "collectible", position: { x: 0.0, y: 5.0, z: -24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s12-goal",
        type: "goal",
        position: { x: 0.0, y: 5.0, z: -28.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 3: Perros
  // Explanada rectangular empedrada con cantos de río ("pebbles") flanqueada por muretes
  // de pizarra. 6 perros del pueblo de razas distintas patrullan transversalmente.
  // ---------------------------------------------------------------------------
  3: {
    id: "world-03-level-02-stage-03",
    world: 3,
    level: 2,
    stage: 3,
    name: "Perros",
    theme: "village",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 20.0 },
    objects: [
      // Explanada rectangular de cantos rodados de río
      { id: "w3s13-floor", type: "platform", position: { x: 0.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 0.8, z: 46.0 }, properties: { theme: "pebbles" } },
      // Muros laterales tradicionales de pizarra
      { id: "w3s13-wall-l", type: "decoration", position: { x: -7.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 44, y: 1.2, z: 0.8 }, properties: { subType: "hurdes_stone_wall" } },
      { id: "w3s13-wall-r", type: "decoration", position: { x: 7.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 44, y: 1.2, z: 0.8 }, properties: { subType: "hurdes_stone_wall" } },
      // Farolas rústicas de pueblo
      { id: "w3s13-lantern-1", type: "decoration", position: { x: -6.0, y: 0.4, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s13-lantern-2", type: "decoration", position: { x: 6.0, y: 0.4, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s13-lantern-3", type: "decoration", position: { x: -6.0, y: 0.4, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s13-lantern-4", type: "decoration", position: { x: 6.0, y: 0.4, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      // 6 Perros del pueblo patrullando a distintas posiciones Z y velocidades
      {
        id: "w3s13-dog-1",
        type: "moving-platform",
        position: { x: -4.5, y: 0.4, z: 14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "village_dogs", movementType: "village_dogs", distance: 9.0, speed: 4.0, phase: 0.0, breedIdx: 0 } // Mastín
      },
      {
        id: "w3s13-dog-2",
        type: "moving-platform",
        position: { x: 4.5, y: 0.4, z: 8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "village_dogs", movementType: "village_dogs", distance: 9.0, speed: 5.2, direction: -1, phase: 0.5, breedIdx: 1 } // Podenco
      },
      {
        id: "w3s13-dog-3",
        type: "moving-platform",
        position: { x: -4.5, y: 0.4, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "village_dogs", movementType: "village_dogs", distance: 9.0, speed: 4.6, phase: 1.1, breedIdx: 2 } // Pastor
      },
      {
        id: "w3s13-dog-4",
        type: "moving-platform",
        position: { x: 4.5, y: 0.4, z: -4.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "village_dogs", movementType: "village_dogs", distance: 9.0, speed: 5.0, direction: -1, phase: 0.7, breedIdx: 3 } // Manchado
      },
      {
        id: "w3s13-dog-5",
        type: "moving-platform",
        position: { x: -4.5, y: 0.4, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "village_dogs", movementType: "village_dogs", distance: 9.0, speed: 4.2, phase: 1.5, breedIdx: 4 } // Cazador
      },
      {
        id: "w3s13-dog-6",
        type: "moving-platform",
        position: { x: 4.5, y: 0.4, z: -16.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "village_dogs", movementType: "village_dogs", distance: 9.0, speed: 5.8, direction: -1, phase: 0.3, breedIdx: 5 } // Pachón
      },
      // 10 Coleccionables
      { id: "w3s13-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s13-col-2", type: "collectible", position: { x: -3.0, y: 0.8, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s13-col-3", type: "collectible", position: { x: 3.0, y: 0.8, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s13-col-4", type: "collectible", position: { x: 0.0, y: 0.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s13-col-5", type: "collectible", position: { x: -3.5, y: 0.8, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s13-col-6", type: "collectible", position: { x: 3.5, y: 0.8, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s13-col-7", type: "collectible", position: { x: 0.0, y: 0.8, z: -7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s13-col-8", type: "collectible", position: { x: -3.0, y: 0.8, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s13-col-9", type: "collectible", position: { x: 3.0, y: 0.8, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s13-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -18.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s13-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -21.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 4: Miel
  // Plataforma circular de madera rústica y pizarra, recubierta de miel densa dorada
  // de Las Hurdes con dos cascadas de miel cayendo desde las peñas laterales.
  // La miel tiene viscosidad y resistencia superior al agua (dragFactor: 8.5).
  // ---------------------------------------------------------------------------
  4: {
    id: "world-03-level-02-stage-04",
    world: 3,
    level: 2,
    stage: 4,
    name: "Miel",
    theme: "village",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 13.0 },
    objects: [
      // Muelle de entrada de madera rústica
      { id: "w3s14-dock-in", type: "platform", position: { x: 0.0, y: 0.0, z: 13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 4.0 }, properties: { theme: "wood" } },
      // Gran tina circular (hexagonal) de madera y pizarra para macerar la miel
      {
        id: "w3s14-basin",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 18.0, y: 0.8, z: 18.0 },
        properties: { platformShape: "hexagon", theme: "wood" }
      },
      // Borde exterior de piedra de la tina
      { id: "w3s14-rim-l", type: "platform", position: { x: -8.8, y: 0.6, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 0.6, z: 12.0 }, properties: { theme: "mesegal" } },
      { id: "w3s14-rim-r", type: "platform", position: { x: 8.8, y: 0.6, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 0.6, z: 12.0 }, properties: { theme: "mesegal" } },
      // Capa de miel densa sobre toda la plataforma circular
      {
        id: "w3s14-honey-pool",
        type: "honey",
        position: { x: 0.0, y: 0.45, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 16.5, y: 0.5, z: 16.5 },
        properties: { dragFactor: 8.5 }
      },
      // Dos cascadas de miel cayendo desde rocas elevadas
      {
        id: "w3s14-honeyfall-l",
        type: "honey",
        position: { x: -8.0, y: 3.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: -0.2 },
        scale: { x: 1.6, y: 6.0, z: 2.4 },
        properties: { dragFactor: 9.0 }
      },
      {
        id: "w3s14-honeyfall-r",
        type: "honey",
        position: { x: 8.0, y: 3.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0.2 },
        scale: { x: 1.6, y: 6.0, z: 2.4 },
        properties: { dragFactor: 9.0 }
      },
      // Riscos de pizarra y colmenas de donde mana la miel
      { id: "w3s14-cliff-l", type: "platform", position: { x: -8.5, y: 6.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.5, y: 1.5, z: 4.0 }, properties: { theme: "mesegal" } },
      { id: "w3s14-cliff-r", type: "platform", position: { x: 8.5, y: 6.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.5, y: 1.5, z: 4.0 }, properties: { theme: "mesegal" } },
      // Muelle de salida de madera con meta
      { id: "w3s14-dock-out", type: "platform", position: { x: 0.0, y: 0.0, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 4.0 }, properties: { theme: "wood" } },
      // 10 Coleccionables inmersos en la miel
      { id: "w3s14-col-1", type: "collectible", position: { x: 0.0, y: 0.9, z: 11.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s14-col-2", type: "collectible", position: { x: -3.5, y: 0.9, z: 6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s14-col-3", type: "collectible", position: { x: 3.5, y: 0.9, z: 6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s14-col-4", type: "collectible", position: { x: -6.0, y: 0.9, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s14-col-5", type: "collectible", position: { x: 0.0, y: 0.9, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s14-col-6", type: "collectible", position: { x: 6.0, y: 0.9, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s14-col-7", type: "collectible", position: { x: -3.5, y: 0.9, z: -6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s14-col-8", type: "collectible", position: { x: 3.5, y: 0.9, z: -6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s14-col-9", type: "collectible", position: { x: 0.0, y: 0.9, z: -9.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s14-col-10", type: "collectible", position: { x: 0.0, y: 0.9, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s14-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -13.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos10
  // "El Descanso de la Era": Gran terraza cuadrada única (24x24m) de pizarra hurdana
  // y mosaico de cantos rodados, concebida como un placentero oasis de descanso (bonus arena)
  // al más puro estilo Super Monkey Ball con 10 plátanos en corona circular.
  // ---------------------------------------------------------------------------
  5: {
    id: "world-03-level-02-stage-05",
    world: 3,
    level: 2,
    stage: 5,
    name: "Objetos10",
    theme: "village",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 8.0 },
    objects: [
      // Gran arena cuadrada única de descanso (24x24m)
      {
        id: "w3s15-arena",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 24.0, y: 0.8, z: 24.0 },
        properties: { theme: "mesegal" }
      },
      // Zócalo central decorativo de mosaico de cantos de río
      {
        id: "w3s15-center-plaque",
        type: "platform",
        position: { x: 0.0, y: 0.42, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.05, z: 10.0 },
        properties: { platformShape: "hexagon", theme: "pebbles" }
      },
      // Muretes bajos de protección de pizarra en el perímetro
      { id: "w3s15-wall-s", type: "decoration", position: { x: 0.0, y: 0.4, z: 11.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20, y: 1.0, z: 0.6 }, properties: { subType: "hurdes_stone_wall" } },
      { id: "w3s15-wall-w", type: "decoration", position: { x: -11.5, y: 0.4, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 20, y: 1.0, z: 0.6 }, properties: { subType: "hurdes_stone_wall" } },
      { id: "w3s15-wall-e", type: "decoration", position: { x: 11.5, y: 0.4, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 20, y: 1.0, z: 0.6 }, properties: { subType: "hurdes_stone_wall" } },
      // Bancos rústicos de madera para el descanso
      { id: "w3s15-bench-1", type: "decoration", position: { x: -9.0, y: 0.4, z: 8.0 }, rotation: { x: 0, y: Math.PI / 4, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "wooden_bench_rustic" } },
      { id: "w3s15-bench-2", type: "decoration", position: { x: 9.0, y: 0.4, z: 8.0 }, rotation: { x: 0, y: -Math.PI / 4, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "wooden_bench_rustic" } },
      // Farolas rústicas en las esquinas
      { id: "w3s15-lantern-1", type: "decoration", position: { x: -10.0, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s15-lantern-2", type: "decoration", position: { x: 10.0, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      // Pinos de Las Hurdes flanqueando el descanso
      { id: "w3s15-pine-l", type: "decoration", position: { x: -8.5, y: 0.4, z: -8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "pine_hurdes" } },
      { id: "w3s15-pine-r", type: "decoration", position: { x: 8.5, y: 0.4, z: -8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "pine_hurdes" } },
      // Parches de musgo serrano
      { id: "w3s15-moss-1", type: "decoration", position: { x: -5.0, y: 0.42, z: 4.0 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 1.5, y: 1, z: 1.5 }, properties: { subType: "moss_patch" } },
      { id: "w3s15-moss-2", type: "decoration", position: { x: 5.0, y: 0.42, z: -4.0 }, rotation: { x: 0, y: -0.3, z: 0 }, scale: { x: 1.5, y: 1, z: 1.5 }, properties: { subType: "moss_patch" } },
      // 10 Coleccionables en corona armónica alrededor del centro
      { id: "w3s15-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s15-col-2", type: "collectible", position: { x: 3.5, y: 0.8, z: 4.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s15-col-3", type: "collectible", position: { x: 5.8, y: 0.8, z: 1.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s15-col-4", type: "collectible", position: { x: 5.8, y: 0.8, z: -1.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s15-col-5", type: "collectible", position: { x: 3.5, y: 0.8, z: -4.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s15-col-6", type: "collectible", position: { x: 0.0, y: 0.8, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s15-col-7", type: "collectible", position: { x: -3.5, y: 0.8, z: -4.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s15-col-8", type: "collectible", position: { x: -5.8, y: 0.8, z: -1.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s15-col-9", type: "collectible", position: { x: -5.8, y: 0.8, z: 1.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s15-col-10", type: "collectible", position: { x: -3.5, y: 0.8, z: 4.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta situada en la terraza norte
      {
        id: "w3s15-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -9.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 6: Plaza
  // Plaza central de Mesegal: pavimentada con cantos rodados de río ("pebbles") y losas
  // de pizarra. Fuente tradicional en el centro, mesas de terraza, bancos rústicos y farolas.
  // ---------------------------------------------------------------------------
  6: {
    id: "world-03-level-02-stage-06",
    world: 3,
    level: 2,
    stage: 6,
    name: "Plaza",
    theme: "village",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 15.0 },
    objects: [
      // Pavimento noble de la plaza en mosaico de cantos de río
      { id: "w3s16-floor", type: "platform", position: { x: 0.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 22.0, y: 0.8, z: 34.0 }, properties: { theme: "pebbles" } },
      // Fuente tradicional de piedra de Mesegal en el centro
      { id: "w3s16-fountain", type: "decoration", position: { x: 0.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "village_fountain" } },
      // Muros laterales de casas de pizarra
      { id: "w3s16-wall-l", type: "decoration", position: { x: -10.5, y: 0.4, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 32, y: 1.2, z: 0.8 }, properties: { subType: "hurdes_stone_wall" } },
      { id: "w3s16-wall-r", type: "decoration", position: { x: 10.5, y: 0.4, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 32, y: 1.2, z: 0.8 }, properties: { subType: "hurdes_stone_wall" } },
      // Farolas rústicas de pueblo
      { id: "w3s16-lantern-1", type: "decoration", position: { x: -8.0, y: 0.4, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s16-lantern-2", type: "decoration", position: { x: 8.0, y: 0.4, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s16-lantern-3", type: "decoration", position: { x: -8.0, y: 0.4, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s16-lantern-4", type: "decoration", position: { x: 8.0, y: 0.4, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      // Mesas y sillas de terraza de bar
      { id: "w3s16-terrace-1", type: "decoration", position: { x: -6.5, y: 0.4, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "terrace_table_set" } },
      { id: "w3s16-terrace-2", type: "decoration", position: { x: 6.5, y: 0.4, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "terrace_table_set" } },
      // Bancos rústicos
      { id: "w3s16-bench-1", type: "decoration", position: { x: -5.0, y: 0.4, z: -4.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "wooden_bench_rustic" } },
      { id: "w3s16-bench-2", type: "decoration", position: { x: 5.0, y: 0.4, z: -4.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "wooden_bench_rustic" } },
      // 10 Coleccionables
      { id: "w3s16-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s16-col-2", type: "collectible", position: { x: -5.0, y: 0.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s16-col-3", type: "collectible", position: { x: 5.0, y: 0.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s16-col-4", type: "collectible", position: { x: -3.5, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s16-col-5", type: "collectible", position: { x: 3.5, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s16-col-6", type: "collectible", position: { x: 0.0, y: 0.8, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s16-col-7", type: "collectible", position: { x: -6.0, y: 0.8, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s16-col-8", type: "collectible", position: { x: 6.0, y: 0.8, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s16-col-9", type: "collectible", position: { x: -2.0, y: 0.8, z: -11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s16-col-10", type: "collectible", position: { x: 2.0, y: 0.8, z: -11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s16-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 7: Dibujos
  // 10 láminas A4 con auténticos dibujos botánicos para colorear de Las Hurdes
  // (flores campestres, mandalas con mariposas y herbarios con hojas de geranio y helecho).
  // Cada lámina A4 tiene proporciones DIN A4 (1:1.414), sujetapapeles metálico dorado
  // y lápiz de madera afilado en su margen. Al desplazarse en vaivén horizontal,
  // su solapamiento en Z permite a la bola rodar de una a otra con fluidez.
  // ---------------------------------------------------------------------------
  7: {
    id: "world-03-level-02-stage-07",
    world: 3,
    level: 2,
    stage: 7,
    name: "Dibujos",
    theme: "village",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.0, z: 22.0 },
    objects: [
      // Mesa de dibujo de madera (plataforma de inicio)
      { id: "w3s17-start", type: "platform", position: { x: 0.0, y: -0.32, z: 22.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.0, y: 0.8, z: 5.6 }, properties: { theme: "wood" } },
      // 10 Láminas A4 con dibujos botánicos para colorear (anchura 3.8m, longitud Z 5.38m, proporción DIN A4 exacta 1:1.414)
      { id: "w3s17-paper-1", type: "moving-platform", position: { x: -2.0, y: 0.0, z: 17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.8, y: 0.16, z: 5.38 }, properties: { variant: "a4_sheet", theme: "drawing_sheet", sheetIndex: 1, pencilColor: "#e53935", movementType: "sine", distance: 4.2, speed: 1.2 } },
      { id: "w3s17-paper-2", type: "moving-platform", position: { x: 2.0, y: 0.0, z: 13.4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.8, y: 0.16, z: 5.38 }, properties: { variant: "a4_sheet", theme: "drawing_sheet", sheetIndex: 2, pencilColor: "#1e88e5", movementType: "sine", distance: 4.2, speed: 1.35, direction: -1 } },
      { id: "w3s17-paper-3", type: "moving-platform", position: { x: -2.0, y: 0.0, z: 9.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.8, y: 0.16, z: 5.38 }, properties: { variant: "a4_sheet", theme: "drawing_sheet", sheetIndex: 3, pencilColor: "#43a047", movementType: "sine", distance: 4.2, speed: 1.15 } },
      { id: "w3s17-paper-4", type: "moving-platform", position: { x: 2.0, y: 0.0, z: 6.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.8, y: 0.16, z: 5.38 }, properties: { variant: "a4_sheet", theme: "drawing_sheet", sheetIndex: 1, pencilColor: "#fdd835", movementType: "sine", distance: 4.2, speed: 1.3, direction: -1 } },
      { id: "w3s17-paper-5", type: "moving-platform", position: { x: -2.0, y: 0.0, z: 2.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.8, y: 0.16, z: 5.38 }, properties: { variant: "a4_sheet", theme: "drawing_sheet", sheetIndex: 2, pencilColor: "#8e24aa", movementType: "sine", distance: 4.2, speed: 1.25 } },
      { id: "w3s17-paper-6", type: "moving-platform", position: { x: 2.0, y: 0.0, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.8, y: 0.16, z: 5.38 }, properties: { variant: "a4_sheet", theme: "drawing_sheet", sheetIndex: 3, pencilColor: "#fb8c00", movementType: "sine", distance: 4.2, speed: 1.45, direction: -1 } },
      { id: "w3s17-paper-7", type: "moving-platform", position: { x: -2.0, y: 0.0, z: -4.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.8, y: 0.16, z: 5.38 }, properties: { variant: "a4_sheet", theme: "drawing_sheet", sheetIndex: 1, pencilColor: "#00acc1", movementType: "sine", distance: 4.2, speed: 1.2 } },
      { id: "w3s17-paper-8", type: "moving-platform", position: { x: 2.0, y: 0.0, z: -8.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.8, y: 0.16, z: 5.38 }, properties: { variant: "a4_sheet", theme: "drawing_sheet", sheetIndex: 2, pencilColor: "#d81b60", movementType: "sine", distance: 4.2, speed: 1.4, direction: -1 } },
      { id: "w3s17-paper-9", type: "moving-platform", position: { x: -2.0, y: 0.0, z: -11.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.8, y: 0.16, z: 5.38 }, properties: { variant: "a4_sheet", theme: "drawing_sheet", sheetIndex: 3, pencilColor: "#3949ab", movementType: "sine", distance: 4.2, speed: 1.3 } },
      { id: "w3s17-paper-10", type: "moving-platform", position: { x: 2.0, y: 0.0, z: -15.4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.8, y: 0.16, z: 5.38 }, properties: { variant: "a4_sheet", theme: "drawing_sheet", sheetIndex: 2, pencilColor: "#00897b", movementType: "sine", distance: 4.2, speed: 1.35, direction: -1 } },
      // Mesa de dibujo de meta
      { id: "w3s17-end", type: "platform", position: { x: 0.0, y: -0.32, z: -20.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.0, y: 0.8, z: 5.6 }, properties: { theme: "wood" } },
      // 10 Coleccionables (uno por cada lámina A4 de dibujo botánico)
      { id: "w3s17-col-1", type: "collectible", position: { x: 0.0, y: 0.60, z: 17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s17-col-2", type: "collectible", position: { x: 0.0, y: 0.60, z: 13.4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s17-col-3", type: "collectible", position: { x: 0.0, y: 0.60, z: 9.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s17-col-4", type: "collectible", position: { x: 0.0, y: 0.60, z: 6.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s17-col-5", type: "collectible", position: { x: 0.0, y: 0.60, z: 2.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s17-col-6", type: "collectible", position: { x: 0.0, y: 0.60, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s17-col-7", type: "collectible", position: { x: 0.0, y: 0.60, z: -4.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s17-col-8", type: "collectible", position: { x: 0.0, y: 0.60, z: -8.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s17-col-9", type: "collectible", position: { x: 0.0, y: 0.60, z: -11.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s17-col-10", type: "collectible", position: { x: 0.0, y: 0.60, z: -15.4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s17-goal",
        type: "goal",
        position: { x: 0.0, y: 0.08, z: -20.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 8: Niñas
  // Pasarela de piedra pizarra de montaña vigilada por dos niñas pequeñas con gafas
  // y coletitas rubias que patrullan incansablemente. Si te tocan, te empujan con fuerza.
  // ---------------------------------------------------------------------------
  8: {
    id: "world-03-level-02-stage-08",
    world: 3,
    level: 2,
    stage: 8,
    name: "Niñas",
    theme: "village",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 18.0 },
    objects: [
      // Pasarela principal de pizarra con textura mesegal
      { id: "w3s18-bridge", type: "platform", position: { x: 0.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.8, y: 0.8, z: 42.0 }, properties: { theme: "mesegal" } },
      // Bahías de esquive laterales
      { id: "w3s18-bay-l", type: "platform", position: { x: -2.6, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 0.8, z: 5.0 }, properties: { theme: "pebbles" } },
      { id: "w3s18-bay-r", type: "platform", position: { x: 2.6, y: 0.0, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 0.8, z: 5.0 }, properties: { theme: "pebbles" } },
      // Dos niñas con coletitas rubias y gafas patrullando
      {
        id: "w3s18-girl-1",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: 8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "village_girls", movementType: "village_girls", distance: 10.0, speed: 3.8, isGirl2: false }
      },
      {
        id: "w3s18-girl-2",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: -8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "village_girls", movementType: "village_girls", distance: 10.0, speed: 4.2, direction: -1, isGirl2: true }
      },
      // 10 Coleccionables
      { id: "w3s18-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s18-col-2", type: "collectible", position: { x: -1.2, y: 0.8, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s18-col-3", type: "collectible", position: { x: 1.2, y: 0.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s18-col-4", type: "collectible", position: { x: 0.0, y: 0.8, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s18-col-5", type: "collectible", position: { x: -2.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s18-col-6", type: "collectible", position: { x: 2.0, y: 0.8, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s18-col-7", type: "collectible", position: { x: 0.0, y: 0.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s18-col-8", type: "collectible", position: { x: -1.2, y: 0.8, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s18-col-9", type: "collectible", position: { x: 1.2, y: 0.8, z: -15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s18-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -17.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s18-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -19.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 9: Bajada2
  // Bajada vertiginosa estilo Super Monkey Ball: tobogán de montaña tallado en pizarra
  // con curvas peraltadas y transiciones fluidas a alta velocidad.
  // ---------------------------------------------------------------------------
  9: {
    id: "world-03-level-02-stage-09",
    world: 3,
    level: 2,
    stage: 9,
    name: "Bajada2",
    theme: "village",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 17.5, z: 26.0 },
    objects: [
      // Plataforma superior de salida (Y=16.0)
      { id: "w3s19-top", type: "platform", position: { x: 0.0, y: 16.0, z: 25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      // Tramo 1 pendiente fuerte hacia abajo
      { id: "w3s19-slope-1", type: "ramp", position: { x: 0.0, y: 13.0, z: 16.0 }, rotation: { x: 0.35, y: 0, z: 0 }, scale: { x: 5.5, y: 0.8, z: 14.0 }, properties: { theme: "mesegal" } },
      // Curva peraltada 1 (gira a la derecha con peralte para retener la bola)
      { id: "w3s19-turn-1", type: "platform", position: { x: 4.0, y: 9.8, z: 6.0 }, rotation: { x: 0.15, y: -0.4, z: -0.15 }, scale: { x: 7.0, y: 0.8, z: 8.0 }, properties: { theme: "mesegal" } },
      { id: "w3s19-guard-1", type: "platform", position: { x: 7.5, y: 10.4, z: 6.0 }, rotation: { x: 0.15, y: -0.4, z: 0 }, scale: { x: 0.5, y: 1.4, z: 8.0 }, properties: { theme: "pebbles" } },
      // Tramo 2 pendiente transversal
      { id: "w3s19-slope-2", type: "ramp", position: { x: 5.0, y: 7.0, z: -2.0 }, rotation: { x: 0.3, y: 0, z: 0 }, scale: { x: 5.5, y: 0.8, z: 12.0 }, properties: { theme: "mesegal" } },
      // Curva peraltada 2 (gira a la izquierda)
      { id: "w3s19-turn-2", type: "platform", position: { x: 1.0, y: 4.2, z: -11.0 }, rotation: { x: 0.15, y: 0.45, z: 0.15 }, scale: { x: 7.5, y: 0.8, z: 8.0 }, properties: { theme: "mesegal" } },
      { id: "w3s19-guard-2", type: "platform", position: { x: -3.0, y: 4.8, z: -11.0 }, rotation: { x: 0.15, y: 0.45, z: 0 }, scale: { x: 0.5, y: 1.4, z: 8.0 }, properties: { theme: "pebbles" } },
      // Tramo 3 pendiente final hacia meta
      { id: "w3s19-slope-3", type: "ramp", position: { x: -1.0, y: 1.8, z: -19.0 }, rotation: { x: 0.25, y: 0, z: 0 }, scale: { x: 5.5, y: 0.8, z: 12.0 }, properties: { theme: "mesegal" } },
      // Base inferior con meta
      { id: "w3s19-bottom", type: "platform", position: { x: -1.0, y: 0.0, z: -28.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.0, y: 0.8, z: 8.0 }, properties: { theme: "mesegal" } },
      // 10 Coleccionables siguiendo la trayectoria de aceleración
      { id: "w3s19-col-1", type: "collectible", position: { x: 0.0, y: 16.8, z: 23.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s19-col-2", type: "collectible", position: { x: 0.0, y: 14.5, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s19-col-3", type: "collectible", position: { x: 1.0, y: 12.0, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s19-col-4", type: "collectible", position: { x: 4.0, y: 10.5, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s19-col-5", type: "collectible", position: { x: 5.0, y: 8.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s19-col-6", type: "collectible", position: { x: 4.0, y: 5.8, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s19-col-7", type: "collectible", position: { x: 1.0, y: 4.8, z: -11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s19-col-8", type: "collectible", position: { x: -0.5, y: 3.0, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s19-col-9", type: "collectible", position: { x: -1.0, y: 1.2, z: -22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s19-col-10", type: "collectible", position: { x: -1.0, y: 0.8, z: -26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s19-goal",
        type: "goal",
        position: { x: -1.0, y: 0.8, z: -28.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 10: La Era
  // La monumental Era de trillar de Mesegal (Las Hurdes) inspirada en la fotografía histórica:
  // Foso circular de miel dorada atravesable de 64m de diámetro (mínimo 60m).
  // Una imponente espiral descendente de 32 losas de pizarra rústica (era_slate)
  // con líquenes y musgo se eleva sobre el lago de miel.
  // El jugador comienza desde el exterior de la espiral (Y=6.4, Z=36.0), desciende
  // en espiral bordeando la era hasta llegar al centro (Y=0.8, Z=0.0) donde descansan
  // el rodillo tradicional de granito y la meta.
  // ---------------------------------------------------------------------------
  10: {
    id: "world-03-level-02-stage-10",
    world: 3,
    level: 2,
    stage: 10,
    name: "La Era",
    theme: "village",
    musicTrack: "sky_waltz",
    timeLimit: 75,
    spawn: { x: 0.0, y: 6.4, z: 36.0 },
    objects: [
      // Foso / lago circular de miel atravesable (diámetro 64m >= 60m solicitado)
      {
        id: "w3s20-honey-pool",
        type: "honey",
        position: { x: 0.0, y: -0.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 64.0, y: 1.6, z: 64.0 },
        properties: {
          shape: "cylinder",
          fluidType: "honey",
          passable: true
        }
      },

      // Plataforma exterior de spawn elevada fuera de la era (Z=36.0, Y=5.2)
      {
        id: "w3s20-spawn-pl",
        type: "platform",
        position: { x: 0.0, y: 5.2, z: 36.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.8, z: 6.0 },
        properties: { theme: "era_slate" }
      },

      // Rampa suave de conexión que emboca la espiral de pizarra (Z=31.0)
      {
        id: "w3s20-entry-ramp",
        type: "ramp",
        position: { x: 0.0, y: 5.0, z: 31.0 },
        rotation: { x: 0.08, y: 0, z: 0 },
        scale: { x: 5.2, y: 0.6, z: 6.5 },
        properties: { theme: "era_slate" }
      },

      // Muro de contención perimetral de piedra estilo anfiteatro hurdano (R=32.5m, radio exterior de la era)
      { id: "w3s20-wall-1", type: "platform", position: { x: 12.44, y: 0.0, z: 30.03 }, rotation: { x: 0, y: 1.963, z: 0 }, scale: { x: 13.0, y: 1.8, z: 1.6 }, properties: { theme: "era_slate" } },
      { id: "w3s20-wall-2", type: "platform", position: { x: 22.98, y: 0.0, z: 22.98 }, rotation: { x: 0, y: 2.356, z: 0 }, scale: { x: 13.0, y: 1.8, z: 1.6 }, properties: { theme: "era_slate" } },
      { id: "w3s20-wall-3", type: "platform", position: { x: 30.03, y: 0.0, z: 12.44 }, rotation: { x: 0, y: 2.749, z: 0 }, scale: { x: 13.0, y: 1.8, z: 1.6 }, properties: { theme: "era_slate" } },
      { id: "w3s20-wall-4", type: "platform", position: { x: 32.50, y: 0.0, z: 0.00 }, rotation: { x: 0, y: 3.142, z: 0 }, scale: { x: 13.0, y: 1.8, z: 1.6 }, properties: { theme: "era_slate" } },
      { id: "w3s20-wall-5", type: "platform", position: { x: 30.03, y: 0.0, z: -12.44 }, rotation: { x: 0, y: 3.534, z: 0 }, scale: { x: 13.0, y: 1.8, z: 1.6 }, properties: { theme: "era_slate" } },
      { id: "w3s20-wall-6", type: "platform", position: { x: 22.98, y: 0.0, z: -22.98 }, rotation: { x: 0, y: 3.927, z: 0 }, scale: { x: 13.0, y: 1.8, z: 1.6 }, properties: { theme: "era_slate" } },
      { id: "w3s20-wall-7", type: "platform", position: { x: 12.44, y: 0.0, z: -30.03 }, rotation: { x: 0, y: 4.320, z: 0 }, scale: { x: 13.0, y: 1.8, z: 1.6 }, properties: { theme: "era_slate" } },
      { id: "w3s20-wall-8", type: "platform", position: { x: 0.00, y: 0.0, z: -32.50 }, rotation: { x: 0, y: 4.712, z: 0 }, scale: { x: 13.0, y: 1.8, z: 1.6 }, properties: { theme: "era_slate" } },
      { id: "w3s20-wall-9", type: "platform", position: { x: -12.44, y: 0.0, z: -30.03 }, rotation: { x: 0, y: 5.105, z: 0 }, scale: { x: 13.0, y: 1.8, z: 1.6 }, properties: { theme: "era_slate" } },
      { id: "w3s20-wall-10", type: "platform", position: { x: -22.98, y: 0.0, z: -22.98 }, rotation: { x: 0, y: 5.498, z: 0 }, scale: { x: 13.0, y: 1.8, z: 1.6 }, properties: { theme: "era_slate" } },
      { id: "w3s20-wall-11", type: "platform", position: { x: -30.03, y: 0.0, z: -12.44 }, rotation: { x: 0, y: 5.890, z: 0 }, scale: { x: 13.0, y: 1.8, z: 1.6 }, properties: { theme: "era_slate" } },
      { id: "w3s20-wall-12", type: "platform", position: { x: -32.50, y: 0.0, z: -0.00 }, rotation: { x: 0, y: 6.283, z: 0 }, scale: { x: 13.0, y: 1.8, z: 1.6 }, properties: { theme: "era_slate" } },
      { id: "w3s20-wall-13", type: "platform", position: { x: -30.03, y: 0.0, z: 12.44 }, rotation: { x: 0, y: 6.676, z: 0 }, scale: { x: 13.0, y: 1.8, z: 1.6 }, properties: { theme: "era_slate" } },
      { id: "w3s20-wall-14", type: "platform", position: { x: -22.98, y: 0.0, z: 22.98 }, rotation: { x: 0, y: 7.069, z: 0 }, scale: { x: 13.0, y: 1.8, z: 1.6 }, properties: { theme: "era_slate" } },
      { id: "w3s20-wall-15", type: "platform", position: { x: -12.44, y: 0.0, z: 30.03 }, rotation: { x: 0, y: 7.461, z: 0 }, scale: { x: 13.0, y: 1.8, z: 1.6 }, properties: { theme: "era_slate" } },

      // 32 losas de pizarra descendentes en espiral hacia el centro de la era
      { id: "w3s20-slate-1", type: "platform", position: { x: 2.39, y: 4.76, z: 25.57 }, rotation: { x: 0.015, y: 1.747, z: 0 }, scale: { x: 4.20, y: 0.6, z: 5.76 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-2", type: "platform", position: { x: 7.05, y: 4.69, z: 24.28 }, rotation: { x: 0.015, y: 1.938, z: 0 }, scale: { x: 4.19, y: 0.6, z: 5.76 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-3", type: "platform", position: { x: 11.37, y: 4.61, z: 22.11 }, rotation: { x: 0.016, y: 2.132, z: 0 }, scale: { x: 4.17, y: 0.6, z: 5.76 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-4", type: "platform", position: { x: 15.19, y: 4.54, z: 19.15 }, rotation: { x: 0.016, y: 2.329, z: 0 }, scale: { x: 4.16, y: 0.6, z: 5.76 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-5", type: "platform", position: { x: 18.35, y: 4.46, z: 15.50 }, rotation: { x: 0.016, y: 2.529, z: 0 }, scale: { x: 4.15, y: 0.6, z: 5.75 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-6", type: "platform", position: { x: 20.70, y: 4.38, z: 11.28 }, rotation: { x: 0.017, y: 2.733, z: 0 }, scale: { x: 4.14, y: 0.6, z: 5.75 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-7", type: "platform", position: { x: 22.15, y: 4.30, z: 6.68 }, rotation: { x: 0.017, y: 2.941, z: 0 }, scale: { x: 4.13, y: 0.6, z: 5.75 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-8", type: "platform", position: { x: 22.60, y: 4.21, z: 1.87 }, rotation: { x: 0.017, y: -3.130, z: 0 }, scale: { x: 4.11, y: 0.6, z: 5.75 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-9", type: "platform", position: { x: 22.03, y: 4.13, z: -2.92 }, rotation: { x: 0.018, y: -2.914, z: 0 }, scale: { x: 4.10, y: 0.6, z: 5.75 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-10", type: "platform", position: { x: 20.43, y: 4.04, z: -7.47 }, rotation: { x: 0.018, y: -2.693, z: 0 }, scale: { x: 4.09, y: 0.6, z: 5.75 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-11", type: "platform", position: { x: 17.86, y: 3.96, z: -11.55 }, rotation: { x: 0.018, y: -2.467, z: 0 }, scale: { x: 4.08, y: 0.6, z: 5.75 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-12", type: "platform", position: { x: 14.43, y: 3.87, z: -14.94 }, rotation: { x: 0.019, y: -2.236, z: 0 }, scale: { x: 4.06, y: 0.6, z: 5.75 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-13", type: "platform", position: { x: 10.32, y: 3.77, z: -17.45 }, rotation: { x: 0.019, y: -1.999, z: 0 }, scale: { x: 4.05, y: 0.6, z: 5.75 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-14", type: "platform", position: { x: 5.73, y: 3.68, z: -18.90 }, rotation: { x: 0.020, y: -1.757, z: 0 }, scale: { x: 4.04, y: 0.6, z: 5.75 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-15", type: "platform", position: { x: 0.92, y: 3.58, z: -19.20 }, rotation: { x: 0.020, y: -1.508, z: 0 }, scale: { x: 4.03, y: 0.6, z: 5.75 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-16", type: "platform", position: { x: -3.80, y: 3.48, z: -18.28 }, rotation: { x: 0.021, y: -1.251, z: 0 }, scale: { x: 4.01, y: 0.6, z: 5.75 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-17", type: "platform", position: { x: -8.12, y: 3.38, z: -16.19 }, rotation: { x: 0.021, y: -0.988, z: 0 }, scale: { x: 4.00, y: 0.6, z: 5.75 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-18", type: "platform", position: { x: -11.74, y: 3.28, z: -13.02 }, rotation: { x: 0.022, y: -0.715, z: 0 }, scale: { x: 3.99, y: 0.6, z: 5.75 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-19", type: "platform", position: { x: -14.35, y: 3.17, z: -8.99 }, rotation: { x: 0.023, y: -0.434, z: 0 }, scale: { x: 3.98, y: 0.6, z: 5.75 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-20", type: "platform", position: { x: -15.71, y: 3.05, z: -4.40 }, rotation: { x: 0.024, y: -0.142, z: 0 }, scale: { x: 3.96, y: 0.6, z: 5.75 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-21", type: "platform", position: { x: -15.66, y: 2.94, z: 0.39 }, rotation: { x: 0.025, y: 0.162, z: 0 }, scale: { x: 3.95, y: 0.6, z: 5.74 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-22", type: "platform", position: { x: -14.16, y: 2.81, z: 4.93 }, rotation: { x: 0.026, y: 0.478, z: 0 }, scale: { x: 3.94, y: 0.6, z: 5.74 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-23", type: "platform", position: { x: -11.29, y: 2.69, z: 8.75 }, rotation: { x: 0.027, y: 0.809, z: 0 }, scale: { x: 3.93, y: 0.6, z: 5.74 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-24", type: "platform", position: { x: -7.33, y: 2.55, z: 11.40 }, rotation: { x: 0.028, y: 1.157, z: 0 }, scale: { x: 3.91, y: 0.6, z: 5.74 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-25", type: "platform", position: { x: -2.70, y: 2.41, z: 12.48 }, rotation: { x: 0.030, y: 1.525, z: 0 }, scale: { x: 3.90, y: 0.6, z: 5.73 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-26", type: "platform", position: { x: 1.99, y: 2.26, z: 11.77 }, rotation: { x: 0.032, y: 1.917, z: 0 }, scale: { x: 3.89, y: 0.6, z: 5.73 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-27", type: "platform", position: { x: 6.00, y: 2.10, z: 9.27 }, rotation: { x: 0.034, y: 2.338, z: 0 }, scale: { x: 3.88, y: 0.6, z: 5.72 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-28", type: "platform", position: { x: 8.55, y: 1.93, z: 5.33 }, rotation: { x: 0.038, y: 2.795, z: 0 }, scale: { x: 3.86, y: 0.6, z: 5.72 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-29", type: "platform", position: { x: 8.99, y: 1.74, z: 0.70 }, rotation: { x: 0.042, y: -2.982, z: 0 }, scale: { x: 3.85, y: 0.6, z: 5.71 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-30", type: "platform", position: { x: 7.01, y: 1.52, z: -3.46 }, rotation: { x: 0.047, y: -2.411, z: 0 }, scale: { x: 3.84, y: 0.6, z: 5.69 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-31", type: "platform", position: { x: 3.07, y: 1.28, z: -5.63 }, rotation: { x: 0.056, y: -1.737, z: 0 }, scale: { x: 3.83, y: 0.6, z: 5.65 }, properties: { theme: "era_slate" } },
      { id: "w3s20-slate-32", type: "platform", position: { x: -1.08, y: 0.97, z: -4.54 }, rotation: { x: 0.073, y: -0.881, z: 0 }, scale: { x: 3.81, y: 0.6, z: 5.56 }, properties: { theme: "era_slate" } },

      // Núcleo central circular de la Era (superficie superior en Y=0.8)
      {
        id: "w3s20-center-hub",
        type: "platform",
        position: { x: 0.0, y: 0.4, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.0, y: 0.8, z: 9.0 },
        properties: {
          platformShape: "cylinder",
          theme: "era_slate"
        }
      },

      // 8 losas radiales de piedra (radios de la era tradicional vistos en la foto)
      { id: "w3s20-spoke-1", type: "platform", position: { x: 0.00, y: 0.76, z: 3.60 }, rotation: { x: 0, y: 0.000, z: 0 }, scale: { x: 1.8, y: 0.12, z: 3.2 }, properties: { theme: "era_slate" } },
      { id: "w3s20-spoke-2", type: "platform", position: { x: 2.55, y: 0.76, z: 2.55 }, rotation: { x: 0, y: 0.785, z: 0 }, scale: { x: 1.8, y: 0.12, z: 3.2 }, properties: { theme: "era_slate" } },
      { id: "w3s20-spoke-3", type: "platform", position: { x: 3.60, y: 0.76, z: 0.00 }, rotation: { x: 0, y: 1.571, z: 0 }, scale: { x: 1.8, y: 0.12, z: 3.2 }, properties: { theme: "era_slate" } },
      { id: "w3s20-spoke-4", type: "platform", position: { x: 2.55, y: 0.76, z: -2.55 }, rotation: { x: 0, y: 2.356, z: 0 }, scale: { x: 1.8, y: 0.12, z: 3.2 }, properties: { theme: "era_slate" } },
      { id: "w3s20-spoke-5", type: "platform", position: { x: 0.00, y: 0.76, z: -3.60 }, rotation: { x: 0, y: 3.142, z: 0 }, scale: { x: 1.8, y: 0.12, z: 3.2 }, properties: { theme: "era_slate" } },
      { id: "w3s20-spoke-6", type: "platform", position: { x: -2.55, y: 0.76, z: -2.55 }, rotation: { x: 0, y: 3.927, z: 0 }, scale: { x: 1.8, y: 0.12, z: 3.2 }, properties: { theme: "era_slate" } },
      { id: "w3s20-spoke-7", type: "platform", position: { x: -3.60, y: 0.76, z: -0.00 }, rotation: { x: 0, y: 4.712, z: 0 }, scale: { x: 1.8, y: 0.12, z: 3.2 }, properties: { theme: "era_slate" } },
      { id: "w3s20-spoke-8", type: "platform", position: { x: -2.55, y: 0.76, z: 2.55 }, rotation: { x: 0, y: 5.498, z: 0 }, scale: { x: 1.8, y: 0.12, z: 3.2 }, properties: { theme: "era_slate" } },

      // Rodillo cilíndrico de trillar tradicional de granito blanco
      {
        id: "w3s20-roller",
        type: "platform",
        position: { x: -2.8, y: 1.15, z: 0.0 },
        rotation: { x: 0, y: 0, z: Math.PI / 2 },
        scale: { x: 0.7, y: 2.8, z: 0.7 },
        properties: { theme: "custom_color", customColor: "#f1f5f9" }
      },

      // Decoraciones rústicas de la Era de Mesegal: faroles sobre pilares y piedras con musgo
      { id: "w3s20-lantern-1", type: "decoration", position: { x: 6.0, y: 5.2, z: 36.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s20-lantern-2", type: "decoration", position: { x: -6.0, y: 5.2, z: 36.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s20-moss-1", type: "decoration", position: { x: 2.6, y: 0.8, z: -2.0 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 1.2, y: 1, z: 1.2 }, properties: { subType: "moss_patch" } },
      { id: "w3s20-moss-2", type: "decoration", position: { x: -2.6, y: 0.8, z: 2.0 }, rotation: { x: 0, y: -0.4, z: 0 }, scale: { x: 1.2, y: 1, z: 1.2 }, properties: { subType: "moss_patch" } },
      { id: "w3s20-stones-1", type: "decoration", position: { x: 28.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "village_stones" } },
      { id: "w3s20-stones-2", type: "decoration", position: { x: -28.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "village_stones" } },

      // 10 Coleccionables guiando la trayectoria en espiral desde la cima exterior hasta la meta
      { id: "w3s20-col-1", type: "collectible", position: { x: 7.05, y: 5.3, z: 24.28 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s20-col-2", type: "collectible", position: { x: 20.70, y: 5.0, z: 11.28 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s20-col-3", type: "collectible", position: { x: 20.43, y: 4.65, z: -7.47 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s20-col-4", type: "collectible", position: { x: 5.73, y: 4.3, z: -18.90 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s20-col-5", type: "collectible", position: { x: -11.74, y: 3.9, z: -13.02 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s20-col-6", type: "collectible", position: { x: -14.16, y: 3.4, z: 4.93 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s20-col-7", type: "collectible", position: { x: -2.70, y: 3.0, z: 12.48 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s20-col-8", type: "collectible", position: { x: 8.55, y: 2.5, z: 5.33 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s20-col-9", type: "collectible", position: { x: 3.07, y: 1.9, z: -5.63 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s20-col-10", type: "collectible", position: { x: 0.0, y: 1.4, z: 1.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta en el corazón de la Era
      {
        id: "w3s20-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  }
};

// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('3_2_')) Object.assign(WORLD_03_LEVEL_02_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(3,2,WORLD_03_LEVEL_02_STAGES);

