import publishedEditorStages from '../editor-saved/world-03.json';
import {registerStageSet} from '../StageRegistry';
import type { LevelData } from "../LevelTypes";

// =============================================================================
// WORLD 3 - LEVEL 4: CHORRITO DE OVEJUELA (EXTREMADURA / LAS HURDES)
// Etapas 1 a 10: Bazar Gigante artesano, Cuesta3 en zig-zag, Niños veloces con gafas
// y rubio, Muro3 (3 murallas con elevadores), descanso en cumbre de Objetos12 (bonus arena),
// 12 Curvas que se estrechan, Sin Cobertura (salto de fe >200m), Cuesta4 extrema,
// Ruta Nocturna guiada por farolas y musgo, y El Gran Chorrito de Ovejuela (cascada de 50m).
// =============================================================================

export const WORLD_03_LEVEL_04_STAGES: Record<number, LevelData> = {
  // ---------------------------------------------------------------------------
  // ETAPA 1: Bazar Gigante
  // Gran bazar artesano de Ovejuela: laberinto gigante de puestos con cerámica tradicional,
  // mantas hurdanas, tarros de miel y cestería de castaño. Paved with river pebbles.
  // ---------------------------------------------------------------------------
  1: {
    id: "world-03-level-04-stage-01",
    world: 3,
    level: 4,
    stage: 1,
    name: "Bazar Gigante",
    theme: "village",
    musicTrack: "arcade_rush",
    timeLimit: 90,
    spawn: { x: 0.0, y: 1.5, z: 22.0 },
    objects: [
      // Pavimento del bazar artesano (amplio y continuo)
      { id: "w3s31-floor", type: "platform", position: { x: 0.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 28.0, y: 0.8, z: 50.0 }, properties: { theme: "pebbles" } },
      // Puestos de artesanía formando calles y encrucijadas
      { id: "w3s31-stall-1", type: "platform", position: { x: -6.0, y: 1.0, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.0, y: 2.0, z: 8.0 }, properties: { theme: "wood" } },
      { id: "w3s31-stall-2", type: "platform", position: { x: 6.0, y: 1.0, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.0, y: 2.0, z: 8.0 }, properties: { theme: "wood" } },
      { id: "w3s31-stall-3", type: "platform", position: { x: -6.0, y: 1.0, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.0, y: 2.0, z: 12.0 }, properties: { theme: "wood" } },
      { id: "w3s31-stall-4", type: "platform", position: { x: 6.0, y: 1.0, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.0, y: 2.0, z: 12.0 }, properties: { theme: "wood" } },
      { id: "w3s31-stall-5", type: "platform", position: { x: 0.0, y: 1.0, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 2.0, z: 4.0 }, properties: { theme: "wood" } },
      // Toldos de colores del bazar
      { id: "w3s31-awning-1", type: "platform", position: { x: -6.0, y: 2.2, z: 12.0 }, rotation: { x: 0.1, y: 0, z: 0 }, scale: { x: 4.6, y: 0.2, z: 8.6 }, properties: { theme: "custom_color", customColor: "#d97706" } },
      { id: "w3s31-awning-2", type: "platform", position: { x: 6.0, y: 2.2, z: 12.0 }, rotation: { x: 0.1, y: 0, z: 0 }, scale: { x: 4.6, y: 0.2, z: 8.6 }, properties: { theme: "custom_color", customColor: "#b45309" } },
      { id: "w3s31-awning-3", type: "platform", position: { x: -6.0, y: 2.2, z: -4.0 }, rotation: { x: 0.1, y: 0, z: 0 }, scale: { x: 4.6, y: 0.2, z: 12.6 }, properties: { theme: "custom_color", customColor: "#2563eb" } },
      { id: "w3s31-awning-4", type: "platform", position: { x: 6.0, y: 2.2, z: -4.0 }, rotation: { x: 0.1, y: 0, z: 0 }, scale: { x: 4.6, y: 0.2, z: 12.6 }, properties: { theme: "custom_color", customColor: "#16a34a" } },
      // Farolas rústicas iluminando el bazar
      { id: "w3s31-lantern-1", type: "decoration", position: { x: -11.0, y: 0.4, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s31-lantern-2", type: "decoration", position: { x: 11.0, y: 0.4, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      // 10 Coleccionables
      { id: "w3s31-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s31-col-2", type: "collectible", position: { x: -1.5, y: 0.8, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s31-col-3", type: "collectible", position: { x: 1.5, y: 0.8, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s31-col-4", type: "collectible", position: { x: -10.0, y: 0.8, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s31-col-5", type: "collectible", position: { x: 10.0, y: 0.8, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s31-col-6", type: "collectible", position: { x: 0.0, y: 0.8, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s31-col-7", type: "collectible", position: { x: -1.8, y: 0.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s31-col-8", type: "collectible", position: { x: 1.8, y: 0.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s31-col-9", type: "collectible", position: { x: -6.0, y: 0.8, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s31-col-10", type: "collectible", position: { x: 6.0, y: 0.8, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s31-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -21.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 2: Cuesta3
  // Gran cuesta de montaña hacia el Chorrito de Ovejuela: ascensión en zig-zag continua
  // con muretes de contención de pizarra, descansillos de giro y rampas de pizarra ("mesegal").
  // ---------------------------------------------------------------------------
  2: {
    id: "world-03-level-04-stage-02",
    world: 3,
    level: 4,
    stage: 2,
    name: "Cuesta3",
    theme: "village",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 24.0 },
    objects: [
      // Base inicial
      { id: "w3s32-base", type: "platform", position: { x: 0.0, y: 0.0, z: 24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      // Rampa 1 empinada
      { id: "w3s32-ramp-1", type: "ramp", position: { x: 0.0, y: 2.0, z: 14.0 }, rotation: { x: -0.26, y: 0, z: 0 }, scale: { x: 5.5, y: 0.8, z: 14.0 }, properties: { theme: "mesegal" } },
      // Descansillo intermedio 1 (conecta a ras)
      { id: "w3s32-mid-1", type: "platform", position: { x: 2.0, y: 4.0, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.5, y: 0.8, z: 6.0 }, properties: { theme: "pebbles" } },
      // Rampa 2 en diagonal ascendente
      { id: "w3s32-ramp-2", type: "ramp", position: { x: 4.0, y: 6.2, z: -4.0 }, rotation: { x: -0.26, y: -0.15, z: 0 }, scale: { x: 5.5, y: 0.8, z: 14.0 }, properties: { theme: "mesegal" } },
      // Descansillo intermedio 2
      { id: "w3s32-mid-2", type: "platform", position: { x: 2.0, y: 8.4, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.5, y: 0.8, z: 6.0 }, properties: { theme: "pebbles" } },
      // Rampa 3 final hacia la cumbre
      { id: "w3s32-ramp-3", type: "ramp", position: { x: 0.0, y: 10.6, z: -21.0 }, rotation: { x: -0.26, y: 0, z: 0 }, scale: { x: 5.5, y: 0.8, z: 12.0 }, properties: { theme: "mesegal" } },
      // Cumbre de meta
      { id: "w3s32-top", type: "platform", position: { x: 0.0, y: 12.4, z: -29.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.5, y: 0.8, z: 7.5 }, properties: { theme: "mesegal" } },
      // 10 Coleccionables
      { id: "w3s32-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s32-col-2", type: "collectible", position: { x: 0.0, y: 1.8, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s32-col-3", type: "collectible", position: { x: 0.0, y: 3.2, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s32-col-4", type: "collectible", position: { x: 2.0, y: 4.8, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s32-col-5", type: "collectible", position: { x: 3.5, y: 6.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s32-col-6", type: "collectible", position: { x: 4.5, y: 7.4, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s32-col-7", type: "collectible", position: { x: 2.0, y: 9.2, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s32-col-8", type: "collectible", position: { x: 0.0, y: 10.4, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s32-col-9", type: "collectible", position: { x: 0.0, y: 11.8, z: -24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s32-col-10", type: "collectible", position: { x: 0.0, y: 13.2, z: -27.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s32-goal",
        type: "goal",
        position: { x: 0.0, y: 13.2, z: -30.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 3: Niños
  // Dos niños traviesos de pueblo corriendo a gran velocidad por la pasarela:
  // Uno delgado con gafas y pelo negro, y otro más robusto con pelo rubio.
  // Son más veloces que las niñas y te embisten con fuerza para tirarte al barranco.
  // ---------------------------------------------------------------------------
  3: {
    id: "world-03-level-04-stage-03",
    world: 3,
    level: 4,
    stage: 3,
    name: "Niños",
    theme: "village",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 18.0 },
    objects: [
      // Pasarela de pizarra suspendida
      { id: "w3s33-ridge", type: "platform", position: { x: 0.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.8, y: 0.8, z: 42.0 }, properties: { theme: "mesegal" } },
      // Bahías de esquive con cantos de río
      { id: "w3s33-bay-l", type: "platform", position: { x: -2.6, y: 0.0, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 0.8, z: 5.0 }, properties: { theme: "pebbles" } },
      { id: "w3s33-bay-r", type: "platform", position: { x: 2.6, y: 0.0, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 0.8, z: 5.0 }, properties: { theme: "pebbles" } },
      // Niño 1: Delgado, pelo negro, gafas
      {
        id: "w3s33-boy-1",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: 8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "village_boys", movementType: "village_boys", distance: 11.0, speed: 5.2, isBoy2: false }
      },
      // Niño 2: Robusto, pelo rubio, camiseta amarilla
      {
        id: "w3s33-boy-2",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: -8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "village_boys", movementType: "village_boys", distance: 11.0, speed: 5.6, direction: -1, isBoy2: true }
      },
      // 10 Coleccionables
      { id: "w3s33-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s33-col-2", type: "collectible", position: { x: -1.2, y: 0.8, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s33-col-3", type: "collectible", position: { x: 1.2, y: 0.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s33-col-4", type: "collectible", position: { x: 0.0, y: 0.8, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s33-col-5", type: "collectible", position: { x: -2.0, y: 0.8, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s33-col-6", type: "collectible", position: { x: 2.0, y: 0.8, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s33-col-7", type: "collectible", position: { x: 0.0, y: 0.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s33-col-8", type: "collectible", position: { x: -1.2, y: 0.8, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s33-col-9", type: "collectible", position: { x: 1.2, y: 0.8, z: -15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s33-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -17.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s33-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -19.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 4: Muro3
  // 3 grandes murallas de pizarra escalonadas con plataformas móviles verticales continuas.
  // Los elevadores suben y bajan suavemente para permitir rodar sin caídas forzadas.
  // ---------------------------------------------------------------------------
  4: {
    id: "world-03-level-04-stage-04",
    world: 3,
    level: 4,
    stage: 4,
    name: "Muro3",
    theme: "village",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 20.0 },
    objects: [
      // Plataforma nivel 1
      { id: "w3s34-plat-1", type: "platform", position: { x: 0.0, y: 0.0, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      // Elevador 1 (sube de Y=0 a Y=3.5)
      { id: "w3s34-lift-1", type: "moving-platform", position: { x: 0.0, y: 1.8, z: 11.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.5, y: 0.4, z: 4.0 }, properties: { movementType: "sine", distance: 3.5, speed: 1.2, slopeY: 1.0, theme: "wood" } },
      // Plataforma nivel 2
      { id: "w3s34-plat-2", type: "platform", position: { x: 0.0, y: 3.5, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      // Elevador 2 (sube de Y=3.5 a Y=7.0)
      { id: "w3s34-lift-2", type: "moving-platform", position: { x: 0.0, y: 5.2, z: -1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.5, y: 0.4, z: 4.0 }, properties: { movementType: "sine", distance: 3.5, speed: 1.3, slopeY: 1.0, direction: -1, theme: "wood" } },
      // Plataforma nivel 3
      { id: "w3s34-plat-3", type: "platform", position: { x: 0.0, y: 7.0, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      // Elevador 3 (sube de Y=7.0 a Y=10.5)
      { id: "w3s34-lift-3", type: "moving-platform", position: { x: 0.0, y: 8.8, z: -14.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.5, y: 0.4, z: 4.0 }, properties: { movementType: "sine", distance: 3.5, speed: 1.4, slopeY: 1.0, theme: "wood" } },
      // Plataforma final superior con meta
      { id: "w3s34-plat-top", type: "platform", position: { x: 0.0, y: 10.5, z: -21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.0, y: 0.8, z: 7.0 }, properties: { theme: "mesegal" } },
      // 10 Coleccionables
      { id: "w3s34-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s34-col-2", type: "collectible", position: { x: 0.0, y: 1.5, z: 14.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s34-col-3", type: "collectible", position: { x: 0.0, y: 2.5, z: 11.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s34-col-4", type: "collectible", position: { x: 0.0, y: 4.3, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s34-col-5", type: "collectible", position: { x: 0.0, y: 5.0, z: 1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s34-col-6", type: "collectible", position: { x: 0.0, y: 6.0, z: -1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s34-col-7", type: "collectible", position: { x: 0.0, y: 7.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s34-col-8", type: "collectible", position: { x: 0.0, y: 8.5, z: -11.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s34-col-9", type: "collectible", position: { x: 0.0, y: 9.5, z: -14.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s34-col-10", type: "collectible", position: { x: 0.0, y: 11.3, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s34-goal",
        type: "goal",
        position: { x: 0.0, y: 11.3, z: -22.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos12
  // "El Mirador de las Cumbres": Gran arena cuadrada única (24x24m) suspendida entre las
  // peñas altas de Ovejuela. Etapa bonus de descanso y recolección pura antes de los desafíos
  // finales, con losas de pizarra ("mesegal"), cantos rodados, pinos, bancos y 10 plátanos en estrella.
  // ---------------------------------------------------------------------------
  5: {
    id: "world-03-level-04-stage-05",
    world: 3,
    level: 4,
    stage: 5,
    name: "Objetos12",
    theme: "village",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 8.0 },
    objects: [
      // Gran arena cuadrada única de descanso (24x24m)
      {
        id: "w3s35-arena",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 24.0, y: 0.8, z: 24.0 },
        properties: { theme: "mesegal" }
      },
      // Zócalo central ornamental de cantos de río
      {
        id: "w3s35-center-plaque",
        type: "platform",
        position: { x: 0.0, y: 0.42, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.05, z: 10.0 },
        properties: { platformShape: "hexagon", theme: "pebbles" }
      },
      // Muretes bajos tradicionales de pizarra
      { id: "w3s35-wall-s", type: "decoration", position: { x: 0.0, y: 0.4, z: 11.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20, y: 1.0, z: 0.6 }, properties: { subType: "hurdes_stone_wall" } },
      { id: "w3s35-wall-w", type: "decoration", position: { x: -11.5, y: 0.4, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 20, y: 1.0, z: 0.6 }, properties: { subType: "hurdes_stone_wall" } },
      { id: "w3s35-wall-e", type: "decoration", position: { x: 11.5, y: 0.4, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 20, y: 1.0, z: 0.6 }, properties: { subType: "hurdes_stone_wall" } },
      // Pinos de Las Hurdes en los cantiles del mirador
      { id: "w3s35-pine-1", type: "decoration", position: { x: -8.5, y: 0.4, z: 8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      { id: "w3s35-pine-2", type: "decoration", position: { x: 8.5, y: 0.4, z: 8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      { id: "w3s35-pine-3", type: "decoration", position: { x: -8.5, y: 0.4, z: -8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      { id: "w3s35-pine-4", type: "decoration", position: { x: 8.5, y: 0.4, z: -8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      // Bancos rústicos de madera
      { id: "w3s35-bench-1", type: "decoration", position: { x: -9.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "wooden_bench_rustic" } },
      { id: "w3s35-bench-2", type: "decoration", position: { x: 9.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "wooden_bench_rustic" } },
      // Farolas rústicas
      { id: "w3s35-lantern-1", type: "decoration", position: { x: -6.0, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s35-lantern-2", type: "decoration", position: { x: 6.0, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      // 10 Coleccionables en una estrella armónica
      { id: "w3s35-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s35-col-2", type: "collectible", position: { x: 3.8, y: 0.8, z: 3.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s35-col-3", type: "collectible", position: { x: 6.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s35-col-4", type: "collectible", position: { x: 3.8, y: 0.8, z: -3.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s35-col-5", type: "collectible", position: { x: 0.0, y: 0.8, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s35-col-6", type: "collectible", position: { x: -3.8, y: 0.8, z: -3.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s35-col-7", type: "collectible", position: { x: -6.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s35-col-8", type: "collectible", position: { x: -3.8, y: 0.8, z: 3.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s35-col-9", type: "collectible", position: { x: 0.0, y: 0.8, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s35-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s35-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 6: Curvas
  // 12 curvas serpenteantes sucesivas que se van estrechando progresivamente:
  // desde 4.8m de anchura al principio hasta una fina laja de pizarra de 1.2m al final.
  // Conexión continua sin huecos de caída artificiales.
  // ---------------------------------------------------------------------------
  6: {
    id: "world-03-level-04-stage-06",
    world: 3,
    level: 4,
    stage: 6,
    name: "Curvas",
    theme: "village",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 32.0 },
    objects: [
      { id: "w3s36-start", type: "platform", position: { x: 0.0, y: 0.0, z: 31.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.5, y: 0.8, z: 5.5 }, properties: { theme: "pebbles" } },
      // 12 Curvas serpenteantes con anchura decreciente continua (solapamiento longitudinal)
      { id: "w3s36-c-1", type: "platform", position: { x: -1.8, y: 0.0, z: 26.0 }, rotation: { x: 0, y: 0.32, z: 0 }, scale: { x: 4.8, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      { id: "w3s36-c-2", type: "platform", position: { x: 1.8, y: 0.0, z: 21.0 }, rotation: { x: 0, y: -0.32, z: 0 }, scale: { x: 4.4, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      { id: "w3s36-c-3", type: "platform", position: { x: -2.0, y: 0.0, z: 16.0 }, rotation: { x: 0, y: 0.36, z: 0 }, scale: { x: 4.0, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      { id: "w3s36-c-4", type: "platform", position: { x: 2.0, y: 0.0, z: 11.0 }, rotation: { x: 0, y: -0.36, z: 0 }, scale: { x: 3.6, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      { id: "w3s36-c-5", type: "platform", position: { x: -2.2, y: 0.0, z: 6.0 }, rotation: { x: 0, y: 0.40, z: 0 }, scale: { x: 3.2, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      { id: "w3s36-c-6", type: "platform", position: { x: 2.2, y: 0.0, z: 1.0 }, rotation: { x: 0, y: -0.40, z: 0 }, scale: { x: 2.8, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      { id: "w3s36-c-7", type: "platform", position: { x: -2.2, y: 0.0, z: -4.0 }, rotation: { x: 0, y: 0.45, z: 0 }, scale: { x: 2.5, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      { id: "w3s36-c-8", type: "platform", position: { x: 2.2, y: 0.0, z: -9.0 }, rotation: { x: 0, y: -0.45, z: 0 }, scale: { x: 2.2, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      { id: "w3s36-c-9", type: "platform", position: { x: -2.0, y: 0.0, z: -14.0 }, rotation: { x: 0, y: 0.50, z: 0 }, scale: { x: 1.9, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      { id: "w3s36-c-10", type: "platform", position: { x: 2.0, y: 0.0, z: -19.0 }, rotation: { x: 0, y: -0.50, z: 0 }, scale: { x: 1.6, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      { id: "w3s36-c-11", type: "platform", position: { x: -1.6, y: 0.0, z: -24.0 }, rotation: { x: 0, y: 0.55, z: 0 }, scale: { x: 1.4, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      { id: "w3s36-c-12", type: "platform", position: { x: 0.0, y: 0.0, z: -29.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      // Meta
      { id: "w3s36-end", type: "platform", position: { x: 0.0, y: 0.0, z: -33.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.0, y: 0.8, z: 5.0 }, properties: { theme: "pebbles" } },
      // 10 Coleccionables en los vértices de las curvas
      { id: "w3s36-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 30.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s36-col-2", type: "collectible", position: { x: -1.8, y: 0.8, z: 26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s36-col-3", type: "collectible", position: { x: 1.8, y: 0.8, z: 21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s36-col-4", type: "collectible", position: { x: -2.0, y: 0.8, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s36-col-5", type: "collectible", position: { x: 2.0, y: 0.8, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s36-col-6", type: "collectible", position: { x: -2.2, y: 0.8, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s36-col-7", type: "collectible", position: { x: 2.2, y: 0.8, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s36-col-8", type: "collectible", position: { x: -2.2, y: 0.8, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s36-col-9", type: "collectible", position: { x: 2.0, y: 0.8, z: -9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s36-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -29.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s36-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -34.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 7: Sin Cobertura
  // Un acto de fe radical: el jugador aparece en una solitaria plataforma a 220 metros
  // de altura en las nubes. No hay suelo visible alrededor. Te lanzas al vacío vertical;
  // más de 200 metros por debajo te espera una gran plataforma acolchada con agua y la meta!
  // ---------------------------------------------------------------------------
  7: {
    id: "world-03-level-04-stage-07",
    world: 3,
    level: 4,
    stage: 7,
    name: "Sin Cobertura",
    theme: "canyon",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 221.5, z: 0.0 },
    objects: [
      // Plataforma solitaria en la estratosfera (Y=220.0)
      {
        id: "w3s37-stratosphere-pad",
        type: "platform",
        position: { x: 0.0, y: 220.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.0, y: 0.8, z: 5.0 },
        properties: { platformShape: "hexagon", theme: "mesegal" }
      },
      // Plataforma objetivo en el fondo del valle (Y=1.0)
      {
        id: "w3s37-valley-landing",
        type: "platform",
        position: { x: 0.0, y: 1.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 20.0, y: 1.0, z: 20.0 },
        properties: { platformShape: "hexagon", theme: "pebbles" }
      },
      // Cojín de agua cristalina en el suelo para frenar el impacto
      {
        id: "w3s37-landing-water",
        type: "water",
        position: { x: 0.0, y: 1.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 18.0, y: 0.6, z: 18.0 }
      },
      // 10 Coleccionables cayendo en la vertical del salto de fe
      { id: "w3s37-col-1", type: "collectible", position: { x: 0.0, y: 220.8, z: 1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s37-col-2", type: "collectible", position: { x: 0.0, y: 190.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s37-col-3", type: "collectible", position: { x: 0.0, y: 160.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s37-col-4", type: "collectible", position: { x: 0.0, y: 130.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s37-col-5", type: "collectible", position: { x: 0.0, y: 100.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s37-col-6", type: "collectible", position: { x: 0.0, y: 70.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s37-col-7", type: "collectible", position: { x: 0.0, y: 40.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s37-col-8", type: "collectible", position: { x: 0.0, y: 15.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s37-col-9", type: "collectible", position: { x: -3.0, y: 2.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s37-col-10", type: "collectible", position: { x: 3.0, y: 2.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta en la plataforma del valle
      {
        id: "w3s37-goal",
        type: "goal",
        position: { x: 0.0, y: 2.0, z: -5.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 8: Cuesta4
  // Gran Rampa Basculante Mecánica de Las Hurdes con oscilación dinámica de inclinación X:
  // En su posición baja reposa nivelada con la plataforma de salida para subirte sin esfuerzo;
  // luego eleva su inclinación transportándote suavemente en ascenso hasta conectar con la
  // cima a 16 metros de altura donde se sitúa la meta. Incorpora bordillos de contención
  // laterales y travesaños de tracción que basculan conjuntamente.
  // ---------------------------------------------------------------------------
  8: {
    id: "world-03-level-04-stage-08",
    world: 3,
    level: 4,
    stage: 8,
    name: "Cuesta4",
    theme: "village",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 24.0 },
    objects: [
      // Plataforma base de salida
      { id: "w3s38-base", type: "platform", position: { x: 0.0, y: 0.0, z: 24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 6.0 }, properties: { theme: "pebbles" } },

      // Rampa basculante dinámica con oscilación de inclinación X
      {
        id: "w3s38-mega-slope",
        type: "ramp",
        position: { x: 0.0, y: 8.35, z: 2.36 },
        rotation: { x: 0.388, y: 0, z: 0 },
        scale: { x: 5.5, y: 0.8, z: 42.0 },
        properties: {
          theme: "mesegal",
          movementType: "tilt_x",
          isMoving: true,
          minAngle: 0.03,
          maxAngle: 0.388,
          hingeZ: 21.8,
          hingeY: 0.4,
          cycleTime: 8.0,
          pauseBottom: 1.5,
          riseTime: 2.5,
          pauseTop: 1.5,
          fallTime: 2.5,
          hasCurbs: true,
          hasSteps: true
        }
      },

      // Cima con meta
      { id: "w3s38-top", type: "platform", position: { x: 0.0, y: 16.0, z: -21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.5, y: 0.8, z: 7.5 }, properties: { theme: "pebbles" } },

      // Elementos decorativos serranos de Las Hurdes
      { id: "w3s38-lantern-1", type: "decoration", position: { x: -2.6, y: 0.4, z: 25.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s38-lantern-2", type: "decoration", position: { x: 2.6, y: 0.4, z: 25.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s38-lantern-top-l", type: "decoration", position: { x: -3.2, y: 16.4, z: -21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s38-lantern-top-r", type: "decoration", position: { x: 3.2, y: 16.4, z: -21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s38-pine-1", type: "decoration", position: { x: -5.5, y: 0.0, z: 21.0 }, rotation: { x: 0, y: 0.3, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "pine_hurdes" } },
      { id: "w3s38-pine-2", type: "decoration", position: { x: 5.5, y: 0.0, z: 21.0 }, rotation: { x: 0, y: -0.4, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "pine_hurdes" } },
      { id: "w3s38-rock-top", type: "decoration", position: { x: -3.0, y: 16.4, z: -23.5 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "village_stones" } },

      // 10 Coleccionables ascendentes
      { id: "w3s38-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s38-col-2", type: "collectible", position: { x: 0.0, y: 2.5, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s38-col-3", type: "collectible", position: { x: 0.0, y: 4.8, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s38-col-4", type: "collectible", position: { x: 0.0, y: 6.5, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s38-col-5", type: "collectible", position: { x: 0.0, y: 8.6, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s38-col-6", type: "collectible", position: { x: 0.0, y: 10.5, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s38-col-7", type: "collectible", position: { x: 0.0, y: 12.4, z: -7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s38-col-8", type: "collectible", position: { x: 0.0, y: 14.5, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s38-col-9", type: "collectible", position: { x: 0.0, y: 16.8, z: -19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s38-col-10", type: "collectible", position: { x: 0.0, y: 16.8, z: -21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta
      {
        id: "w3s38-goal",
        type: "goal",
        position: { x: 0.0, y: 16.8, z: -22.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 9: Ruta Nocturna
  // Más de 48m de lajas de pizarra continuas en la penumbra montañosa.
  // Guiado por farolas rústicas puntuales y parches de musgo bioluminiscente.
  // Conexión continua sin caídas ciegas forzadas.
  // ---------------------------------------------------------------------------
  9: {
    id: "world-03-level-04-stage-09",
    world: 3,
    level: 4,
    stage: 9,
    name: "Ruta Nocturna",
    theme: "night",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    properties: {
      pitchBlack: true,
      darknessMode: "spotlight_under"
    },
    spawn: { x: 0.0, y: 1.5, z: 24.0 },
    objects: [
      // Pistas continuas de pizarra oscura con textura auténtica de Las Hurdes
      { id: "w3s39-p1", type: "platform", position: { x: 0.0, y: 0.0, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.0, y: 0.8, z: 7.0 }, properties: { theme: "mesegal" } },

      // Rampa de enlace terraza 1 -> 2
      { id: "w3s39-r12", type: "ramp", position: { x: -1.25, y: 0.2, z: 18.5 }, rotation: { x: 0.18, y: 0, z: 0 }, scale: { x: 3.5, y: 0.6, z: 2.2 }, properties: { theme: "mesegal" } },
      { id: "w3s39-p2", type: "platform", position: { x: -2.5, y: 0.4, z: 14.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.0, y: 0.8, z: 9.0 }, properties: { theme: "mesegal" } },

      // Rampa de enlace terraza 2 -> 3
      { id: "w3s39-r23", type: "ramp", position: { x: -0.25, y: 0.6, z: 10.2 }, rotation: { x: 0.18, y: 0, z: 0 }, scale: { x: 3.5, y: 0.6, z: 2.2 }, properties: { theme: "mesegal" } },
      { id: "w3s39-p3", type: "platform", position: { x: 2.0, y: 0.8, z: 6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.0, y: 0.8, z: 9.0 }, properties: { theme: "mesegal" } },

      // Rampa de enlace terraza 3 -> 4
      { id: "w3s39-r34", type: "ramp", position: { x: 0.0, y: 1.0, z: 2.2 }, rotation: { x: 0.18, y: 0, z: 0 }, scale: { x: 3.5, y: 0.6, z: 2.2 }, properties: { theme: "mesegal" } },
      { id: "w3s39-p4", type: "platform", position: { x: -2.0, y: 1.2, z: -1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.0, y: 0.8, z: 9.0 }, properties: { theme: "mesegal" } },

      // Rampa de enlace terraza 4 -> 5
      { id: "w3s39-r45", type: "ramp", position: { x: 0.25, y: 1.4, z: -5.8 }, rotation: { x: 0.18, y: 0, z: 0 }, scale: { x: 3.5, y: 0.6, z: 2.2 }, properties: { theme: "mesegal" } },
      { id: "w3s39-p5", type: "platform", position: { x: 2.5, y: 1.6, z: -9.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.0, y: 0.8, z: 9.0 }, properties: { theme: "mesegal" } },

      // Rampa de enlace terraza 5 -> 6
      { id: "w3s39-r56", type: "ramp", position: { x: 1.25, y: 1.8, z: -13.8 }, rotation: { x: 0.18, y: 0, z: 0 }, scale: { x: 3.5, y: 0.6, z: 2.2 }, properties: { theme: "mesegal" } },
      { id: "w3s39-p6", type: "platform", position: { x: 0.0, y: 2.0, z: -17.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.5, y: 0.8, z: 8.0 }, properties: { theme: "mesegal" } },

      // Rampa de enlace terraza 6 -> cima final
      { id: "w3s39-r6end", type: "ramp", position: { x: 0.0, y: 2.2, z: -21.8 }, rotation: { x: 0.18, y: 0, z: 0 }, scale: { x: 4.5, y: 0.6, z: 2.2 }, properties: { theme: "mesegal" } },
      { id: "w3s39-end", type: "platform", position: { x: 0.0, y: 2.4, z: -25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 6.0 }, properties: { theme: "pebbles" } },

      // Mojones y piedras de pizarra serrana como balizas en curvas del sendero
      { id: "w3s39-stones-1", type: "decoration", position: { x: 2.2, y: 0.4, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "village_stones" } },
      { id: "w3s39-stones-2", type: "decoration", position: { x: -4.2, y: 0.8, z: 14.5 }, rotation: { x: 0, y: 0.4, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "village_stones" } },
      { id: "w3s39-stones-3", type: "decoration", position: { x: 3.8, y: 1.2, z: 6.5 }, rotation: { x: 0, y: -0.3, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "village_stones" } },
      { id: "w3s39-stones-4", type: "decoration", position: { x: -3.8, y: 1.6, z: -1.5 }, rotation: { x: 0, y: 0.2, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "village_stones" } },
      { id: "w3s39-stones-5", type: "decoration", position: { x: 4.2, y: 2.0, z: -9.5 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "village_stones" } },

      // 10 Coleccionables que guían el avance por la oscuridad
      { id: "w3s39-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s39-col-2", type: "collectible", position: { x: -1.5, y: 1.0, z: 17.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s39-col-3", type: "collectible", position: { x: -2.5, y: 1.2, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s39-col-4", type: "collectible", position: { x: 0.0, y: 1.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s39-col-5", type: "collectible", position: { x: 2.0, y: 1.6, z: 6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s39-col-6", type: "collectible", position: { x: 0.0, y: 1.8, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s39-col-7", type: "collectible", position: { x: -2.0, y: 2.0, z: -1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s39-col-8", type: "collectible", position: { x: 0.5, y: 2.2, z: -5.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s39-col-9", type: "collectible", position: { x: 2.5, y: 2.4, z: -9.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s39-col-10", type: "collectible", position: { x: 0.0, y: 2.8, z: -17.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta en la terraza superior
      {
        id: "w3s39-goal",
        type: "goal",
        position: { x: 0.0, y: 3.2, z: -25.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 10: El Chorrito
  // La cascada más mítica de Las Hurdes: El Chorrito de Ovejuela.
  // Entras en una laguna superior de aguas cristalinas, te dejas arrastrar por la corriente
  // y caes en picado por una cascada vertical colosal de 50m entre impresionantes cantiles
  // rocosos hasta la laguna inferior donde resplandece la meta triunfal del Mundo 3.
  // ---------------------------------------------------------------------------
  10: {
    id: "world-03-level-04-stage-10",
    world: 3,
    level: 4,
    stage: 10,
    name: "Chorrito",
    theme: "canyon",
    musicTrack: "sky_waltz",
    timeLimit: 90,
    spawn: { x: 0.0, y: 53.5, z: 18.0 },
    objects: [
      // Laguna superior en la alta montaña (Y=52.0)
      {
        id: "w3s40-upper-lake-basin",
        type: "platform",
        position: { x: 0.0, y: 52.0, z: 14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 16.0, y: 1.0, z: 16.0 },
        properties: { theme: "pebbles" }
      },
      // Agua de la laguna superior
      {
        id: "w3s40-upper-water",
        type: "water",
        position: { x: 0.0, y: 52.6, z: 14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 15.0, y: 0.6, z: 15.0 }
      },
      // Desfiladero de salida del agua hacia el chorro
      {
        id: "w3s40-lip",
        type: "ramp",
        position: { x: 0.0, y: 51.5, z: 4.0 },
        rotation: { x: 0.35, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.8, z: 6.0 },
        properties: { theme: "mesegal" }
      },
      // La gran cascada vertical de 50 metros (El Chorrito)
      {
        id: "w3s40-waterfall-drop",
        type: "water",
        position: { x: 0.0, y: 26.0, z: -1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.0, y: 50.0, z: 4.0 }
      },
      // Farallones de roca y cantiles a los lados de la cascada
      {
        id: "w3s40-cliff-l",
        type: "decoration",
        position: { x: -6.5, y: 26.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.8, y: 2.2, z: 1.8 },
        properties: { subType: "waterfall_rock_cliff" }
      },
      {
        id: "w3s40-cliff-r",
        type: "decoration",
        position: { x: 6.5, y: 26.0, z: 0.0 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: { x: 1.8, y: 2.2, z: 1.8 },
        properties: { subType: "waterfall_rock_cliff" }
      },
      // Laguna inferior épica en el valle (Y=1.0)
      {
        id: "w3s40-lower-lagoon-basin",
        type: "platform",
        position: { x: 0.0, y: 1.0, z: -12.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 24.0, y: 1.0, z: 24.0 },
        properties: { platformShape: "hexagon", theme: "pebbles" }
      },
      // Agua cristalina turquesa de la laguna inferior
      {
        id: "w3s40-lower-water",
        type: "water",
        position: { x: 0.0, y: 1.6, z: -12.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 22.0, y: 0.6, z: 22.0 }
      },
      // Isla de meta en el centro de la laguna inferior
      {
        id: "w3s40-island-goal",
        type: "platform",
        position: { x: 0.0, y: 1.8, z: -18.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.8, z: 6.0 },
        properties: { platformShape: "hexagon", theme: "mesegal" }
      },
      // 10 Coleccionables (en la laguna alta, a lo largo de la cascada de 50m y en la laguna baja)
      { id: "w3s40-col-1", type: "collectible", position: { x: 0.0, y: 53.0, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s40-col-2", type: "collectible", position: { x: -3.5, y: 53.0, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s40-col-3", type: "collectible", position: { x: 3.5, y: 53.0, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s40-col-4", type: "collectible", position: { x: 0.0, y: 51.5, z: 3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s40-col-5", type: "collectible", position: { x: 0.0, y: 40.0, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s40-col-6", type: "collectible", position: { x: 0.0, y: 28.0, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s40-col-7", type: "collectible", position: { x: 0.0, y: 16.0, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s40-col-8", type: "collectible", position: { x: 0.0, y: 3.0, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s40-col-9", type: "collectible", position: { x: -4.0, y: 2.2, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s40-col-10", type: "collectible", position: { x: 4.0, y: 2.2, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta en la isla de la laguna inferior
      {
        id: "w3s40-goal",
        type: "goal",
        position: { x: 0.0, y: 2.6, z: -18.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  }
};

// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('3_4_')) Object.assign(WORLD_03_LEVEL_04_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(3,4,WORLD_03_LEVEL_04_STAGES);

