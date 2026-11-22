import {registerStageSet} from '../StageRegistry';
import type { LevelData } from "../LevelTypes";

// =============================================================================
// WORLD 3 - LEVEL 3: PINOFRANQUEADO (EXTREMADURA / LAS HURDES)
// Etapas 1 a 10: Camino con bancos y farolas, polideportivo fútbol+pádel, correr3,
// encrucijada de Cuatro Caminos, descanso fluvial de objetos11, Plaza Mayor de
// Pinofranqueado, supermercado SPAR, Río Los Ángeles (144m), Turrón el gato naranja
// y Mirador nocturno sobre el valle.
// =============================================================================

export const WORLD_03_LEVEL_03_STAGES: Record<number, LevelData> = {
  // ---------------------------------------------------------------------------
  // ETAPA 1: Camino
  // Paseo principal de Pinofranqueado: avenida recta de 62m de largo de losas de pizarra
  // ("mesegal") con bordillo de cantos rodados, farolas rústicas, bancos y pinos serranos.
  // ---------------------------------------------------------------------------
  1: {
    id: "world-03-level-03-stage-01",
    world: 3,
    level: 3,
    stage: 1,
    name: "Camino",
    theme: "forest",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 28.0 },
    objects: [
      // Paseo principal de losas de pizarra
      { id: "w3s21-path", type: "platform", position: { x: 0.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 62.0 }, properties: { theme: "mesegal" } },
      // Bordillos de cantos de río
      { id: "w3s21-curb-l", type: "platform", position: { x: -3.2, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 62.0 }, properties: { theme: "pebbles" } },
      { id: "w3s21-curb-r", type: "platform", position: { x: 3.2, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 62.0 }, properties: { theme: "pebbles" } },
      // Farolas rústicas a los lados
      { id: "w3s21-lantern-1", type: "decoration", position: { x: -3.8, y: 0.4, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s21-lantern-2", type: "decoration", position: { x: 3.8, y: 0.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s21-lantern-3", type: "decoration", position: { x: -3.8, y: 0.4, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s21-lantern-4", type: "decoration", position: { x: 3.8, y: 0.4, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s21-lantern-5", type: "decoration", position: { x: -3.8, y: 0.4, z: -24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      // Bancos de madera rústicos
      { id: "w3s21-bench-1", type: "decoration", position: { x: 3.8, y: 0.4, z: 20.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "wooden_bench_rustic" } },
      { id: "w3s21-bench-2", type: "decoration", position: { x: -3.8, y: 0.4, z: 8.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "wooden_bench_rustic" } },
      { id: "w3s21-bench-3", type: "decoration", position: { x: 3.8, y: 0.4, z: -4.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "wooden_bench_rustic" } },
      { id: "w3s21-bench-4", type: "decoration", position: { x: -3.8, y: 0.4, z: -16.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "wooden_bench_rustic" } },
      // Pinos de Las Hurdes
      { id: "w3s21-pine-1", type: "decoration", position: { x: -5.5, y: 0.0, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      { id: "w3s21-pine-2", type: "decoration", position: { x: 5.5, y: 0.0, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      // 10 Coleccionables a lo largo del camino
      { id: "w3s21-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s21-col-2", type: "collectible", position: { x: -1.5, y: 0.8, z: 19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s21-col-3", type: "collectible", position: { x: 1.5, y: 0.8, z: 13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s21-col-4", type: "collectible", position: { x: 0.0, y: 0.8, z: 7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s21-col-5", type: "collectible", position: { x: -1.5, y: 0.8, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s21-col-6", type: "collectible", position: { x: 1.5, y: 0.8, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s21-col-7", type: "collectible", position: { x: 0.0, y: 0.8, z: -11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s21-col-8", type: "collectible", position: { x: -1.5, y: 0.8, z: -17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s21-col-9", type: "collectible", position: { x: 1.5, y: 0.8, z: -23.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s21-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -27.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s21-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -29.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 2: Polideportivo
  // Fusión entre campo de fútbol y pista de pádel:
  // Parte 1: Campo de césped verde defendido por 4 perros patrulleros.
  // Rampa de conexión continua que sube a la pista de pádel azul con cristaleras
  // y pala de pádel oscilante que te propulsa a la plataforma exterior de meta.
  // ---------------------------------------------------------------------------
  2: {
    id: "world-03-level-03-stage-02",
    world: 3,
    level: 3,
    stage: 2,
    name: "Polideportivo",
    theme: "village",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 26.0 },
    objects: [
      // Zona 1: Campo de fútbol de césped verde
      { id: "w3s22-pitch", type: "platform", position: { x: 0.0, y: 0.0, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 0.8, z: 28.0 }, properties: { theme: "custom_color", customColor: "#2e7d32" } },
      // Muros laterales del polideportivo
      { id: "w3s22-wall-l", type: "platform", position: { x: -7.2, y: 0.6, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 1.2, z: 28.0 }, properties: { theme: "pebbles" } },
      { id: "w3s22-wall-r", type: "platform", position: { x: 7.2, y: 0.6, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 1.2, z: 28.0 }, properties: { theme: "pebbles" } },
      // 4 Perros defendiendo el campo de fútbol
      { id: "w3s22-dog-1", type: "moving-platform", position: { x: -4.0, y: 0.4, z: 21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { variant: "village_dogs", movementType: "village_dogs", distance: 8.0, speed: 4.5, breedIdx: 0 } },
      { id: "w3s22-dog-2", type: "moving-platform", position: { x: 4.0, y: 0.4, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { variant: "village_dogs", movementType: "village_dogs", distance: 8.0, speed: 5.0, direction: -1, breedIdx: 1 } },
      { id: "w3s22-dog-3", type: "moving-platform", position: { x: -4.0, y: 0.4, z: 9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { variant: "village_dogs", movementType: "village_dogs", distance: 8.0, speed: 4.2, breedIdx: 2 } },
      { id: "w3s22-dog-4", type: "moving-platform", position: { x: 4.0, y: 0.4, z: 3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { variant: "village_dogs", movementType: "village_dogs", distance: 8.0, speed: 5.5, direction: -1, breedIdx: 4 } },
      // Rampa continua de acceso hacia la pista de pádel
      { id: "w3s22-ramp-to-padel", type: "ramp", position: { x: 0.0, y: 0.5, z: -1.0 }, rotation: { x: 0.12, y: 0, z: 0 }, scale: { x: 10.0, y: 0.8, z: 4.0 }, properties: { theme: "pebbles" } },
      // Zona 2: Pista de pádel azul profesional
      { id: "w3s22-padel-court", type: "platform", position: { x: 0.0, y: 1.0, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 10.0, y: 0.8, z: 20.0 }, properties: { theme: "custom_color", customColor: "#0288d1" } },
      // Red de pádel blanca
      { id: "w3s22-padel-net", type: "platform", position: { x: 0.0, y: 1.7, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 9.6, y: 0.6, z: 0.2 }, properties: { theme: "custom_color", customColor: "#ffffff" } },
      // Pala de pádel oscilante lanzadera
      {
        id: "w3s22-racket",
        type: "moving-platform",
        position: { x: 0.0, y: 1.4, z: -19.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "padel_racket", movementType: "padel_racket", speed: 2.2 }
      },
      // Plataforma de meta exterior detrás del cristal
      { id: "w3s22-goal-pad", type: "platform", position: { x: 0.0, y: 2.5, z: -27.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.0, y: 0.8, z: 7.0 }, properties: { theme: "pebbles" } },
      // 10 Coleccionables
      { id: "w3s22-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s22-col-2", type: "collectible", position: { x: -3.0, y: 0.8, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s22-col-3", type: "collectible", position: { x: 3.0, y: 0.8, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s22-col-4", type: "collectible", position: { x: 0.0, y: 0.8, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s22-col-5", type: "collectible", position: { x: 0.0, y: 1.2, z: 0.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s22-col-6", type: "collectible", position: { x: -2.5, y: 1.8, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s22-col-7", type: "collectible", position: { x: 2.5, y: 1.8, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s22-col-8", type: "collectible", position: { x: 0.0, y: 2.2, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s22-col-9", type: "collectible", position: { x: 0.0, y: 2.0, z: -18.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s22-col-10", type: "collectible", position: { x: 0.0, y: 3.3, z: -26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s22-goal",
        type: "goal",
        position: { x: 0.0, y: 3.3, z: -27.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 3: Correr3
  // Pista de carreras rural de montaña mejorada entre pinares con peraltes y velocidad.
  // ---------------------------------------------------------------------------
  3: {
    id: "world-03-level-03-stage-03",
    world: 3,
    level: 3,
    stage: 3,
    name: "Correr3",
    theme: "forest",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 26.0 },
    objects: [
      { id: "w3s23-sec-1", type: "platform", position: { x: 0.0, y: 0.0, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 14.0 }, properties: { theme: "mesegal" } },
      { id: "w3s23-sec-2", type: "ramp", position: { x: 2.0, y: 1.2, z: 8.0 }, rotation: { x: 0.15, y: -0.2, z: 0 }, scale: { x: 5.5, y: 0.8, z: 12.0 }, properties: { theme: "mesegal" } },
      { id: "w3s23-sec-3", type: "platform", position: { x: 4.5, y: 2.2, z: -2.0 }, rotation: { x: 0, y: -0.2, z: 0 }, scale: { x: 6.0, y: 0.8, z: 10.0 }, properties: { theme: "mesegal" } },
      { id: "w3s23-sec-4", type: "ramp", position: { x: 2.0, y: 1.2, z: -12.0 }, rotation: { x: -0.15, y: 0.25, z: 0 }, scale: { x: 5.5, y: 0.8, z: 12.0 }, properties: { theme: "mesegal" } },
      { id: "w3s23-sec-5", type: "platform", position: { x: 0.0, y: 0.0, z: -22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.0, y: 0.8, z: 10.0 }, properties: { theme: "mesegal" } },
      // Pinos de Las Hurdes
      { id: "w3s23-pine-1", type: "decoration", position: { x: -4.5, y: 0.0, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      { id: "w3s23-pine-2", type: "decoration", position: { x: 8.0, y: 2.2, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      // 10 Coleccionables
      { id: "w3s23-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s23-col-2", type: "collectible", position: { x: 0.0, y: 0.8, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s23-col-3", type: "collectible", position: { x: 1.5, y: 1.2, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s23-col-4", type: "collectible", position: { x: 3.0, y: 2.0, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s23-col-5", type: "collectible", position: { x: 4.5, y: 2.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s23-col-6", type: "collectible", position: { x: 4.5, y: 2.8, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s23-col-7", type: "collectible", position: { x: 2.5, y: 2.0, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s23-col-8", type: "collectible", position: { x: 0.5, y: 1.0, z: -15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s23-col-9", type: "collectible", position: { x: 0.0, y: 0.8, z: -19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s23-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -23.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s23-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -25.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 4: Cuatro Caminos
  // La famosa encrucijada de Pinofranqueado: una cruz central con 4 caminos.
  // Cada camino tiene un gran agujero central: en Sur, Este y Oeste caes al vacío,
  // pero en el brazo Norte caes directamente sobre una plataforma secreta inferior
  // donde te espera la meta.
  // ---------------------------------------------------------------------------
  4: {
    id: "world-03-level-03-stage-04",
    world: 3,
    level: 3,
    stage: 4,
    name: "Cuatro Caminos",
    theme: "village",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 0.0 },
    objects: [
      // Intersección central de la encrucijada
      { id: "w3s24-cross-center", type: "platform", position: { x: 0.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      // Brazo Sur (Trampa - agujero sin suelo al vacío)
      { id: "w3s24-arm-s", type: "platform", position: { x: 0.0, y: 0.0, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.5, y: 0.8, z: 8.0 }, properties: { platformShape: "hollow_rect", holeWidth: 2.8, holeLength: 5.5, theme: "pebbles" } },
      // Brazo Este (Trampa - agujero sin suelo al vacío)
      { id: "w3s24-arm-e", type: "platform", position: { x: 10.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.0, y: 0.8, z: 4.5 }, properties: { platformShape: "hollow_rect", holeWidth: 5.5, holeLength: 2.8, theme: "pebbles" } },
      // Brazo Oeste (Trampa - agujero sin suelo al vacío)
      { id: "w3s24-arm-w", type: "platform", position: { x: -10.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.0, y: 0.8, z: 4.5 }, properties: { platformShape: "hollow_rect", holeWidth: 5.5, holeLength: 2.8, theme: "pebbles" } },
      // Brazo Norte (El camino correcto con hueco)
      { id: "w3s24-arm-n", type: "platform", position: { x: 0.0, y: 0.0, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.5, y: 0.8, z: 8.0 }, properties: { platformShape: "hollow_rect", holeWidth: 2.8, holeLength: 5.5, theme: "pebbles" } },
      // Plataforma secreta debajo del brazo Norte con la meta
      { id: "w3s24-secret-lower", type: "platform", position: { x: 0.0, y: -4.0, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 7.0 }, properties: { theme: "mesegal" } },
      // Farolas en las esquinas de la encrucijada
      { id: "w3s24-lantern-1", type: "decoration", position: { x: -3.5, y: 0.4, z: -3.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s24-lantern-2", type: "decoration", position: { x: 3.5, y: 0.4, z: -3.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s24-lantern-3", type: "decoration", position: { x: -3.5, y: 0.4, z: 3.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s24-lantern-4", type: "decoration", position: { x: 3.5, y: 0.4, z: 3.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      // 10 Coleccionables
      { id: "w3s24-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s24-col-2", type: "collectible", position: { x: -1.8, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s24-col-3", type: "collectible", position: { x: 1.8, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s24-col-4", type: "collectible", position: { x: 0.0, y: 0.8, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s24-col-5", type: "collectible", position: { x: 0.0, y: 0.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s24-col-6", type: "collectible", position: { x: 8.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s24-col-7", type: "collectible", position: { x: -8.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s24-col-8", type: "collectible", position: { x: 0.0, y: 0.8, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s24-col-9", type: "collectible", position: { x: 0.0, y: -2.0, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s24-col-10", type: "collectible", position: { x: 0.0, y: -3.2, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s24-goal",
        type: "goal",
        position: { x: 0.0, y: -3.2, z: -11.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos11
  // "El Parque Fluvial": Gran arena cuadrada única (24x24m) a orillas del río de
  // Pinofranqueado. Etapa bonus de descanso puro con cantos de río ("pebbles"),
  // pinos serranos, bancos rústicos y 10 plátanos en rombo armónico.
  // ---------------------------------------------------------------------------
  5: {
    id: "world-03-level-03-stage-05",
    world: 3,
    level: 3,
    stage: 5,
    name: "Objetos11",
    theme: "forest",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 8.0 },
    objects: [
      // Gran arena cuadrada única de descanso (24x24m)
      {
        id: "w3s25-arena",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 24.0, y: 0.8, z: 24.0 },
        properties: { theme: "pebbles" }
      },
      // Zócalo central de losas de pizarra ("mesegal")
      {
        id: "w3s25-center-slate",
        type: "platform",
        position: { x: 0.0, y: 0.42, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.05, z: 10.0 },
        properties: { platformShape: "hexagon", theme: "mesegal" }
      },
      // Muros perimetrales bajos de piedra seca
      { id: "w3s25-wall-s", type: "decoration", position: { x: 0.0, y: 0.4, z: 11.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20, y: 1.0, z: 0.6 }, properties: { subType: "hurdes_stone_wall" } },
      { id: "w3s25-wall-w", type: "decoration", position: { x: -11.5, y: 0.4, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 20, y: 1.0, z: 0.6 }, properties: { subType: "hurdes_stone_wall" } },
      { id: "w3s25-wall-e", type: "decoration", position: { x: 11.5, y: 0.4, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 20, y: 1.0, z: 0.6 }, properties: { subType: "hurdes_stone_wall" } },
      // Pinos de Las Hurdes en el parque
      { id: "w3s25-pine-1", type: "decoration", position: { x: -8.5, y: 0.4, z: 8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      { id: "w3s25-pine-2", type: "decoration", position: { x: 8.5, y: 0.4, z: 8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      { id: "w3s25-pine-3", type: "decoration", position: { x: -8.5, y: 0.4, z: -8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      { id: "w3s25-pine-4", type: "decoration", position: { x: 8.5, y: 0.4, z: -8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      // Bancos rústicos
      { id: "w3s25-bench-1", type: "decoration", position: { x: -9.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "wooden_bench_rustic" } },
      { id: "w3s25-bench-2", type: "decoration", position: { x: 9.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "wooden_bench_rustic" } },
      // Farolas de pueblo
      { id: "w3s25-lantern-1", type: "decoration", position: { x: -6.0, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s25-lantern-2", type: "decoration", position: { x: 6.0, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      // 10 Coleccionables distribuidos en rombo armónico
      { id: "w3s25-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s25-col-2", type: "collectible", position: { x: -2.5, y: 0.8, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s25-col-3", type: "collectible", position: { x: 2.5, y: 0.8, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s25-col-4", type: "collectible", position: { x: -5.5, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s25-col-5", type: "collectible", position: { x: 0.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s25-col-6", type: "collectible", position: { x: 5.5, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s25-col-7", type: "collectible", position: { x: -2.5, y: 0.8, z: -4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s25-col-8", type: "collectible", position: { x: 2.5, y: 0.8, z: -4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s25-col-9", type: "collectible", position: { x: 0.0, y: 0.8, z: -6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s25-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s25-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 6: Plaza2
  // La gran Plaza Mayor de Pinofranqueado: con la emblemática torre campanario de la iglesia
  // de fondo, dos terrazas de bares de pueblo con toldos, mesas y sillas, y postes verdes de pérgola.
  // ---------------------------------------------------------------------------
  6: {
    id: "world-03-level-03-stage-06",
    world: 3,
    level: 3,
    stage: 6,
    name: "Plaza2",
    theme: "village",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 18.0 },
    objects: [
      // Pavimento noble de la Plaza Mayor (cantos de río y losas de pizarra)
      { id: "w3s26-square", type: "platform", position: { x: 0.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 26.0, y: 0.8, z: 42.0 }, properties: { theme: "pebbles" } },
      // Torre campanario de la iglesia de Pinofranqueado al fondo
      { id: "w3s26-church-tower", type: "decoration", position: { x: 0.0, y: 0.4, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "village_church_tower" } },
      // Dos terrazas de bares con mesas, sillas y sombrillas
      { id: "w3s26-terrace-1", type: "decoration", position: { x: -8.0, y: 0.4, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "terrace_table_set" } },
      { id: "w3s26-terrace-2", type: "decoration", position: { x: 8.0, y: 0.4, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "terrace_table_set" } },
      // Postes verdes de pérgola de la plaza
      { id: "w3s26-pergola-1", type: "decoration", position: { x: -6.0, y: 0.4, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "pergola_green_post" } },
      { id: "w3s26-pergola-2", type: "decoration", position: { x: 6.0, y: 0.4, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "pergola_green_post" } },
      { id: "w3s26-pergola-3", type: "decoration", position: { x: -6.0, y: 0.4, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "pergola_green_post" } },
      { id: "w3s26-pergola-4", type: "decoration", position: { x: 6.0, y: 0.4, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "pergola_green_post" } },
      // Farolas y bancos
      { id: "w3s26-lantern-1", type: "decoration", position: { x: -11.0, y: 0.4, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s26-lantern-2", type: "decoration", position: { x: 11.0, y: 0.4, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      // 10 Coleccionables
      { id: "w3s26-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s26-col-2", type: "collectible", position: { x: -8.0, y: 0.8, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s26-col-3", type: "collectible", position: { x: 8.0, y: 0.8, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s26-col-4", type: "collectible", position: { x: -8.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s26-col-5", type: "collectible", position: { x: 0.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s26-col-6", type: "collectible", position: { x: 8.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s26-col-7", type: "collectible", position: { x: -4.0, y: 0.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s26-col-8", type: "collectible", position: { x: 4.0, y: 0.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s26-col-9", type: "collectible", position: { x: -2.0, y: 0.8, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s26-col-10", type: "collectible", position: { x: 2.0, y: 0.8, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta al pie del campanario
      {
        id: "w3s26-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -16.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 7: Spar
  // Supermercado SPAR de Pinofranqueado: tienda amplia con cartel de SPAR,
  // pasillos con estantes de miel, embutidos y quesos, y línea de cajas hacia la meta.
  // ---------------------------------------------------------------------------
  7: {
    id: "world-03-level-03-stage-07",
    world: 3,
    level: 3,
    stage: 7,
    name: "Spar",
    theme: "village",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 18.0 },
    objects: [
      // Suelo de linóleo pulido del supermercado
      { id: "w3s27-floor", type: "platform", position: { x: 0.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 16.0, y: 0.8, z: 40.0 }, properties: { theme: "custom_color", customColor: "#f8fafc" } },
      // Gran cartel luminoso de SPAR en la entrada
      { id: "w3s27-spar-sign", type: "decoration", position: { x: 0.0, y: 2.5, z: 19.5 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 1.4, y: 1.4, z: 1.4 }, properties: { subType: "spar_supermarket_sign" } },
      // Estanterías de supermercado formando pasillos
      { id: "w3s27-shelf-l1", type: "platform", position: { x: -4.0, y: 1.0, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.4, y: 2.0, z: 12.0 }, properties: { theme: "custom_color", customColor: "#dc2626" } },
      { id: "w3s27-shelf-r1", type: "platform", position: { x: 4.0, y: 1.0, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.4, y: 2.0, z: 12.0 }, properties: { theme: "custom_color", customColor: "#16a34a" } },
      { id: "w3s27-shelf-l2", type: "platform", position: { x: -4.0, y: 1.0, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.4, y: 2.0, z: 12.0 }, properties: { theme: "custom_color", customColor: "#dc2626" } },
      { id: "w3s27-shelf-r2", type: "platform", position: { x: 4.0, y: 1.0, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.4, y: 2.0, z: 12.0 }, properties: { theme: "custom_color", customColor: "#16a34a" } },
      // Línea de cajas registradoras
      { id: "w3s27-checkout-1", type: "platform", position: { x: -2.5, y: 0.5, z: -15.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.2, y: 1.0, z: 1.2 }, properties: { theme: "custom_color", customColor: "#94a3b8" } },
      { id: "w3s27-checkout-2", type: "platform", position: { x: 2.5, y: 0.5, z: -15.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.2, y: 1.0, z: 1.2 }, properties: { theme: "custom_color", customColor: "#94a3b8" } },
      // 10 Coleccionables distribuidos por los pasillos
      { id: "w3s27-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s27-col-2", type: "collectible", position: { x: -1.5, y: 0.8, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s27-col-3", type: "collectible", position: { x: 1.5, y: 0.8, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s27-col-4", type: "collectible", position: { x: 0.0, y: 0.8, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s27-col-5", type: "collectible", position: { x: -1.5, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s27-col-6", type: "collectible", position: { x: 1.5, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s27-col-7", type: "collectible", position: { x: 0.0, y: 0.8, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s27-col-8", type: "collectible", position: { x: -1.5, y: 0.8, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s27-col-9", type: "collectible", position: { x: 1.5, y: 0.8, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s27-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -15.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta al salir por las cajas
      {
        id: "w3s27-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -18.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 8: Río Los Ángeles
  // Descenso escalonado por el Río Los Ángeles de Pinofranqueado:
  // 1. Empieza cayendo desde el risco superior directamente al agua rápida (Poza Alta).
  // 2. Continúa por el cauce y cae en cascada a un segundo nivel de agua (Poza Baja).
  // 3. Da la curva y yendo hacia atrás cae a una playa de piedras y pizarras de río.
  // 4. Desde la piedra entra directo bajo el gran arco del histórico puente medieval
  //    de Pinofranqueado (hacia dentro del arco atravesable con físicas reales en pilares),
  //    donde se encuentra la meta.
  // ---------------------------------------------------------------------------
  8: {
    id: "world-03-level-03-stage-08",
    world: 3,
    level: 3,
    stage: 8,
    name: "Río Los Ángeles",
    theme: "forest",
    musicTrack: "sky_waltz",
    timeLimit: 85,
    spawn: { x: 0.0, y: 16.2, z: 46.0 },
    objects: [
      // Plataforma superior de salida sobre el risco (Z=46, Y=15)
      {
        id: "w3s28-start-pl",
        type: "platform",
        position: { x: 0.0, y: 15.0, z: 46.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.8, z: 6.0 },
        properties: { theme: "era_slate" }
      },

      // --- NIVEL 1: PRIMER AGUA (Poza Alta del Río Los Ángeles) ---
      // El jugador cae desde Y=16 al agua transparente a Y=10.4 (Z=36 a 16)
      {
        id: "w3s28-pool1-bed",
        type: "platform",
        position: { x: 0.0, y: 9.0, z: 26.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.5, y: 0.8, z: 20.0 },
        properties: { theme: "pebbles" }
      },
      {
        id: "w3s28-water-1",
        type: "water",
        position: { x: 0.0, y: 10.4, z: 26.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.5, y: 2.2, z: 20.0 },
        properties: { fluidType: "water", dragFactor: 2.4 }
      },
      // Muretes laterales de pizarra para guiar el curso de la Poza Alta
      { id: "w3s28-bank1-l", type: "platform", position: { x: -3.6, y: 10.4, z: 26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 2.8, z: 20.0 }, properties: { theme: "era_slate" } },
      { id: "w3s28-bank1-r", type: "platform", position: { x: 3.6, y: 10.4, z: 26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 2.8, z: 20.0 }, properties: { theme: "era_slate" } },

      // --- NIVEL 2: SEGUNDO AGUA (Poza Baja tras la cascada) ---
      // Caída en cascada de Y=10 a Y=5.8 (Z=11 a -13)
      {
        id: "w3s28-pool2-bed",
        type: "platform",
        position: { x: 0.0, y: 4.4, z: -1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.5, y: 0.8, z: 24.0 },
        properties: { theme: "pebbles" }
      },
      {
        id: "w3s28-water-2",
        type: "water",
        position: { x: 0.0, y: 5.8, z: -1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.5, y: 2.2, z: 24.0 },
        properties: { fluidType: "water", dragFactor: 2.4 }
      },
      // Ribera lateral de la Poza Baja
      { id: "w3s28-bank2-l", type: "platform", position: { x: -4.1, y: 5.8, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 2.8, z: 24.0 }, properties: { theme: "era_slate" } },
      { id: "w3s28-bank2-r", type: "platform", position: { x: 4.1, y: 5.8, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 2.8, z: 24.0 }, properties: { theme: "era_slate" } },

      // --- NIVEL 3: GIRO HACIA ATRÁS Y CAÍDA A PIEDRA ---
      // Curva natural de ribera que gira 180° ("yendo para atrás") hacia +Z
      {
        id: "w3s28-turn-1",
        type: "platform",
        position: { x: 2.8, y: 4.4, z: -16.0 },
        rotation: { x: 0, y: -0.45, z: 0 },
        scale: { x: 5.5, y: 0.8, z: 6.0 },
        properties: { theme: "pebbles" }
      },
      {
        id: "w3s28-turn-2",
        type: "platform",
        position: { x: 7.5, y: 4.4, z: -14.0 },
        rotation: { x: 0, y: -0.9, z: 0 },
        scale: { x: 5.5, y: 0.8, z: 6.0 },
        properties: { theme: "pebbles" }
      },
      {
        id: "w3s28-guard-turn",
        type: "platform",
        position: { x: 5.5, y: 5.4, z: -18.5 },
        rotation: { x: 0, y: -0.2, z: 0 },
        scale: { x: 10.0, y: 1.4, z: 0.8 },
        properties: { theme: "era_slate" }
      },

      // Salto / caída desde Y=4.4 a Y=0.8 a la terraza de pizarra ("caes a piedra")
      {
        id: "w3s28-stone-bed",
        type: "platform",
        position: { x: 7.5, y: 0.4, z: -2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.8, z: 18.0 },
        properties: { theme: "era_slate" }
      },
      // Lecho bajo el puente que conduce a la meta
      {
        id: "w3s28-arch-floor",
        type: "platform",
        position: { x: 7.5, y: 0.4, z: 8.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.6, y: 0.8, z: 6.0 },
        properties: { theme: "mesegal" }
      },

      // --- PUENTE DE PIEDRA DE PINOFRANQUEADO Y META ---
      // Monumental arco de piedra con físicas en pilares y hueco atravesable
      {
        id: "w3s28-bridge-arch",
        type: "decoration",
        position: { x: 7.5, y: 0.8, z: 8.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.0, y: 1.0, z: 1.0 },
        properties: { subType: "stone_bridge_arch" }
      },
      // Meta situada en el interior del arco del puente
      {
        id: "w3s28-goal",
        type: "goal",
        position: { x: 7.5, y: 0.8, z: 8.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },

      // --- VEGETACIÓN Y ELEMENTOS RÚSTICOS DE LAS HURDES ---
      { id: "w3s28-pine-1", type: "decoration", position: { x: -6.0, y: 9.0, z: 32.0 }, rotation: { x: 0, y: 0.3, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "pine_hurdes" } },
      { id: "w3s28-pine-2", type: "decoration", position: { x: 6.0, y: 9.0, z: 22.0 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "pine_hurdes" } },
      { id: "w3s28-pine-3", type: "decoration", position: { x: -6.5, y: 4.4, z: -4.0 }, rotation: { x: 0, y: 0.8, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      { id: "w3s28-pine-4", type: "decoration", position: { x: 13.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: -0.2, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "pine_hurdes" } },
      { id: "w3s28-rock-1", type: "decoration", position: { x: -2.2, y: 9.4, z: 22.0 }, rotation: { x: 0, y: 0.4, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "village_stones" } },
      { id: "w3s28-rock-2", type: "decoration", position: { x: 2.5, y: 4.8, z: 2.0 }, rotation: { x: 0, y: -0.6, z: 0 }, scale: { x: 1.4, y: 1.4, z: 1.4 }, properties: { subType: "village_stones" } },
      { id: "w3s28-rock-3", type: "decoration", position: { x: 9.5, y: 0.8, z: -5.0 }, rotation: { x: 0, y: 0.2, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "village_stones" } },
      { id: "w3s28-moss-1", type: "decoration", position: { x: -3.4, y: 9.8, z: 30.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1, z: 1.2 }, properties: { subType: "moss_patch" } },
      { id: "w3s28-moss-2", type: "decoration", position: { x: 3.9, y: 5.2, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1, z: 1.2 }, properties: { subType: "moss_patch" } },

      // --- 10 COLECCIONABLES A LO LARGO DEL RECORRIDO ---
      { id: "w3s28-col-1", type: "collectible", position: { x: 0.0, y: 13.0, z: 38.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s28-col-2", type: "collectible", position: { x: 0.0, y: 10.8, z: 28.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s28-col-3", type: "collectible", position: { x: 0.0, y: 10.8, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s28-col-4", type: "collectible", position: { x: 0.0, y: 7.2, z: 13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s28-col-5", type: "collectible", position: { x: -1.5, y: 6.2, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s28-col-6", type: "collectible", position: { x: 1.5, y: 6.2, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s28-col-7", type: "collectible", position: { x: 7.5, y: 5.2, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s28-col-8", type: "collectible", position: { x: 7.5, y: 2.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s28-col-9", type: "collectible", position: { x: 7.5, y: 1.4, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s28-col-10", type: "collectible", position: { x: 7.5, y: 1.4, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 9: Turrón
  // Caminito de piedras al lado del Río Los Ángeles. A la derecha, un muro de piedras secas;
  // a la izquierda, el río transparente donde caes al vacío.
  // En medio patrulla "Turrón", un gato naranja delgado que te empuja al agua si te alcanza.
  // ---------------------------------------------------------------------------
  9: {
    id: "world-03-level-03-stage-09",
    world: 3,
    level: 3,
    stage: 9,
    name: "Turrón",
    theme: "forest",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 20.0 },
    objects: [
      // Caminito de piedras estrecho
      { id: "w3s29-path", type: "platform", position: { x: 0.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.8, y: 0.8, z: 46.0 }, properties: { theme: "pebbles" } },
      // Muro de piedras secas a la derecha
      { id: "w3s29-wall-r", type: "decoration", position: { x: 2.2, y: 0.4, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 46, y: 1.4, z: 0.8 }, properties: { subType: "hurdes_stone_wall" } },
      // Agua del río a la izquierda (caída libre)
      { id: "w3s29-river-water", type: "water", position: { x: -4.0, y: -0.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.0, y: 0.4, z: 46.0 } },
      // "Turrón", el gato atigrado naranja patrullando la orilla
      {
        id: "w3s29-cat-turron",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "turron_cat", movementType: "turron_cat", distance: 16.0, speed: 4.8 }
      },
      // 10 Coleccionables a lo largo del sendero
      { id: "w3s29-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s29-col-2", type: "collectible", position: { x: -0.8, y: 0.8, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s29-col-3", type: "collectible", position: { x: 0.8, y: 0.8, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s29-col-4", type: "collectible", position: { x: -0.8, y: 0.8, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s29-col-5", type: "collectible", position: { x: 0.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s29-col-6", type: "collectible", position: { x: 0.8, y: 0.8, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s29-col-7", type: "collectible", position: { x: -0.8, y: 0.8, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s29-col-8", type: "collectible", position: { x: 0.8, y: 0.8, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s29-col-9", type: "collectible", position: { x: -0.8, y: 0.8, z: -17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s29-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -19.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s29-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -21.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 10: Mirador
  // Mirador nocturno de Pinofranqueado: laberinto de piedra bajo el cielo estrellado
  // con farolas rústicas que conduce a una cima de rocas donde se alza la meta con vistas al valle.
  // ---------------------------------------------------------------------------
  10: {
    id: "world-03-level-03-stage-10",
    world: 3,
    level: 3,
    stage: 10,
    name: "Mirador",
    theme: "night",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 18.0 },
    objects: [
      // Entrada al mirador
      { id: "w3s30-entry", type: "platform", position: { x: 0.0, y: 0.0, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      // Laberinto de pasillos de piedra de pizarra
      { id: "w3s30-maze-floor", type: "platform", position: { x: 0.0, y: 0.0, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20.0, y: 0.8, z: 22.0 }, properties: { theme: "mesegal" } },
      // Muros laberínticos
      { id: "w3s30-m-wall-1", type: "platform", position: { x: -3.5, y: 0.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 11.0, y: 1.2, z: 0.8 }, properties: { theme: "pebbles" } },
      { id: "w3s30-m-wall-2", type: "platform", position: { x: 3.5, y: 0.8, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 11.0, y: 1.2, z: 0.8 }, properties: { theme: "pebbles" } },
      { id: "w3s30-m-wall-3", type: "platform", position: { x: -3.5, y: 0.8, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 11.0, y: 1.2, z: 0.8 }, properties: { theme: "pebbles" } },
      // Rampa ascendente hacia las rocas del mirador
      { id: "w3s30-ramp-up", type: "ramp", position: { x: 0.0, y: 1.5, z: -11.0 }, rotation: { x: 0.25, y: 0, z: 0 }, scale: { x: 4.5, y: 0.8, z: 8.0 }, properties: { theme: "mesegal" } },
      // Cima rocosa del mirador
      { id: "w3s30-summit", type: "platform", position: { x: 0.0, y: 2.8, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.0, y: 0.8, z: 8.0 }, properties: { platformShape: "hexagon", theme: "pebbles" } },
      // Farolas nocturnas iluminando el mirador
      { id: "w3s30-lantern-1", type: "decoration", position: { x: -2.5, y: 0.4, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s24-lantern-2", type: "decoration", position: { x: 2.5, y: 0.4, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s30-lantern-summit", type: "decoration", position: { x: -3.2, y: 3.2, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      // 10 Coleccionables
      { id: "w3s30-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s30-col-2", type: "collectible", position: { x: 5.5, y: 0.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s30-col-3", type: "collectible", position: { x: 5.5, y: 0.8, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s30-col-4", type: "collectible", position: { x: -5.5, y: 0.8, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s30-col-5", type: "collectible", position: { x: -5.5, y: 0.8, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s30-col-6", type: "collectible", position: { x: 5.5, y: 0.8, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s30-col-7", type: "collectible", position: { x: 0.0, y: 0.8, z: -6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s30-col-8", type: "collectible", position: { x: 0.0, y: 1.6, z: -11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s30-col-9", type: "collectible", position: { x: -1.5, y: 3.6, z: -17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s30-col-10", type: "collectible", position: { x: 1.5, y: 3.6, z: -17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta en el mirador
      {
        id: "w3s30-goal",
        type: "goal",
        position: { x: 0.0, y: 3.6, z: -18.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  }
};

registerStageSet(3,3,WORLD_03_LEVEL_03_STAGES);

