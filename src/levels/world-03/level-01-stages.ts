import {registerStageSet} from '../StageRegistry';
import type { LevelData } from "../LevelTypes";

// =============================================================================
// WORLD 3 - LEVEL 1: LA CASINA (MESEGAL - EXTREMADURA / LAS HURDES)
// Etapas 1 a 10: Pizarra rústica, fuente gigante de piedrecitas, almacén con rampas,
// explanada de objetos, escaleras continuas, salamandra, dos ventiladores gigantes
// (uno blanco y otro negro), puertas blancas con portazo y Misina con pasarela interior.
// =============================================================================

export const WORLD_03_LEVEL_01_STAGES: Record<number, LevelData> = {
  // ---------------------------------------------------------------------------
  // ETAPA 1: Cuadrado3
  // Plataforma cuadrada de pizarra viva con muretes de piedra de Las Hurdes,
  // musgo en las juntas, farolas de hierro forjado y bancos de madera.
  // ---------------------------------------------------------------------------
  1: {
    id: "world-03-level-01-stage-01",
    world: 3,
    level: 1,
    stage: 1,
    name: "Cuadrado3",
    theme: "mesegal",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 6.0 },
    objects: [
      // Plataforma cuadrada principal con textura procedural de pizarra y musgo
      {
        id: "w3s1-square-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 16.0, y: 0.8, z: 16.0 },
        properties: { theme: "mesegal" }
      },
      // Muros perimetrales de piedra seca de Las Hurdes
      { id: "w3s1-wall-back", type: "decoration", position: { x: 0.0, y: 0.4, z: 7.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 12.0, y: 1.2, z: 0.8 }, properties: { subType: "hurdes_stone_wall" } },
      { id: "w3s1-wall-left", type: "decoration", position: { x: -7.6, y: 0.4, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 12.0, y: 1.2, z: 0.8 }, properties: { subType: "hurdes_stone_wall" } },
      { id: "w3s1-wall-right", type: "decoration", position: { x: 7.6, y: 0.4, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 12.0, y: 1.2, z: 0.8 }, properties: { subType: "hurdes_stone_wall" } },
      // Farolas rústicas de pueblo en esquinas
      { id: "w3s1-lantern-1", type: "decoration", position: { x: -6.5, y: 0.4, z: 6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s1-lantern-2", type: "decoration", position: { x: 6.5, y: 0.4, z: 6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      // Bancos de madera rústicos
      { id: "w3s1-bench-1", type: "decoration", position: { x: -5.0, y: 0.4, z: 7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "wooden_bench_rustic" } },
      { id: "w3s1-bench-2", type: "decoration", position: { x: 5.0, y: 0.4, z: 7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "wooden_bench_rustic" } },
      // Parches de musgo y piedras de río
      { id: "w3s1-moss-1", type: "decoration", position: { x: -3.5, y: 0.42, z: -2.0 }, rotation: { x: 0, y: 0.4, z: 0 }, scale: { x: 1.2, y: 1, z: 1.2 }, properties: { subType: "moss_patch" } },
      { id: "w3s1-moss-2", type: "decoration", position: { x: 3.8, y: 0.42, z: 1.5 }, rotation: { x: 0, y: -0.6, z: 0 }, scale: { x: 1.4, y: 1, z: 1.4 }, properties: { subType: "moss_patch" } },
      { id: "w3s1-stones-1", type: "decoration", position: { x: -6.0, y: 0.4, z: -5.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_stones" } },
      // 10 Coleccionables
      { id: "w3s1-col-1", type: "collectible", position: { x: -4.5, y: 0.8, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s1-col-2", type: "collectible", position: { x: 0.0, y: 0.8, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s1-col-3", type: "collectible", position: { x: 4.5, y: 0.8, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s1-col-4", type: "collectible", position: { x: -4.5, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s1-col-5", type: "collectible", position: { x: 0.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s1-col-6", type: "collectible", position: { x: 4.5, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s1-col-7", type: "collectible", position: { x: -4.5, y: 0.8, z: -4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s1-col-8", type: "collectible", position: { x: 4.5, y: 0.8, z: -4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s1-col-9", type: "collectible", position: { x: -2.0, y: 0.8, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s1-col-10", type: "collectible", position: { x: 2.0, y: 0.8, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta al frente de la plaza
      {
        id: "w3s1-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 2: Callejuela
  // Callejuela empedrada continua de 48m de longitud con curvas suaves entre
  // restos de casas derruidas de pizarra, montones de escombros y farolas rústicas.
  // ---------------------------------------------------------------------------
  2: {
    id: "world-03-level-01-stage-02",
    world: 3,
    level: 1,
    stage: 2,
    name: "Callejuela",
    theme: "mesegal",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 22.0 },
    objects: [
      // Pavimento continuo de la callejuela (texturado con pizarra natural)
      {
        id: "w3s2-road",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.6, y: 0.8, z: 48.0 },
        properties: { theme: "mesegal" }
      },
      // Muros laterales de casas de pizarra derruidas
      { id: "w3s2-wall-l1", type: "decoration", position: { x: -3.0, y: 0.4, z: 18.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 10, y: 1.5, z: 0.8 }, properties: { subType: "hurdes_stone_wall" } },
      { id: "w3s2-wall-r1", type: "decoration", position: { x: 3.0, y: 0.4, z: 12.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 12, y: 1.5, z: 0.8 }, properties: { subType: "hurdes_stone_wall" } },
      { id: "w3s2-wall-l2", type: "decoration", position: { x: -3.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 14, y: 1.5, z: 0.8 }, properties: { subType: "hurdes_stone_wall" } },
      { id: "w3s2-wall-r2", type: "decoration", position: { x: 3.0, y: 0.4, z: -14.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 14, y: 1.5, z: 0.8 }, properties: { subType: "hurdes_stone_wall" } },
      // Escombros y obstáculos que obligan a esquivar con habilidad
      { id: "w3s2-rubble-1", type: "decoration", position: { x: 1.4, y: 0.4, z: 14.0 }, rotation: { x: 0, y: 0.3, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "village_stones" } },
      { id: "w3s2-rubble-2", type: "platform", position: { x: -1.6, y: 0.3, z: 7.0 }, rotation: { x: 0, y: 0.15, z: 0 }, scale: { x: 1.8, y: 0.6, z: 2.0 }, properties: { theme: "mesegal" } },
      { id: "w3s2-rubble-3", type: "decoration", position: { x: 1.4, y: 0.4, z: 0.0 }, rotation: { x: 0, y: -0.4, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "village_stones" } },
      { id: "w3s2-rubble-4", type: "platform", position: { x: -1.5, y: 0.3, z: -7.0 }, rotation: { x: 0, y: -0.1, z: 0 }, scale: { x: 1.8, y: 0.6, z: 2.0 }, properties: { theme: "mesegal" } },
      { id: "w3s2-rubble-5", type: "decoration", position: { x: 1.5, y: 0.4, z: -14.0 }, rotation: { x: 0, y: 0.4, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "village_stones" } },
      // Farolas rústicas
      { id: "w3s2-lantern-1", type: "decoration", position: { x: -2.3, y: 0.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s2-lantern-2", type: "decoration", position: { x: 2.3, y: 0.4, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      // 10 Coleccionables
      { id: "w3s2-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s2-col-2", type: "collectible", position: { x: -1.2, y: 0.8, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s2-col-3", type: "collectible", position: { x: 1.2, y: 0.8, z: 9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s2-col-4", type: "collectible", position: { x: -1.2, y: 0.8, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s2-col-5", type: "collectible", position: { x: 1.2, y: 0.8, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s2-col-6", type: "collectible", position: { x: -1.2, y: 0.8, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s2-col-7", type: "collectible", position: { x: 1.2, y: 0.8, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s2-col-8", type: "collectible", position: { x: -1.2, y: 0.8, z: -15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s2-col-9", type: "collectible", position: { x: 0.0, y: 0.8, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s2-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -20.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s2-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -22.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 3: Fuente (LA FUENTE GIGANTE DE PIEDRECITAS DE MESEGAL)
  // La etapa ENTERA es una fuente monumental construida de roquitas y piedrecitas de río.
  // Subes al brocal de la fuente, te lanzas a la pila de agua y caes por la gran rejilla
  // de desagüe donde cae el agua, llegando al interior subterráneo donde está la meta.
  // ---------------------------------------------------------------------------
  3: {
    id: "world-03-level-01-stage-03",
    world: 3,
    level: 1,
    stage: 3,
    name: "Fuente",
    theme: "village",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 4.2, z: 14.0 },
    objects: [
      // 1. Rampa y pasarela de aproximación a la fuente (textura roquitas)
      {
        id: "w3s3-approach-ramp",
        type: "ramp",
        position: { x: 0.0, y: 2.0, z: 18.0 },
        rotation: { x: -0.22, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.8, z: 10.0 },
        properties: { theme: "pebbles" }
      },
      // 2. Brocal exterior de la fuente gigante (plataforma de 22m con textura de roquitas y hueco central)
      {
        id: "w3s3-giant-fountain-basin",
        type: "platform",
        position: { x: 0.0, y: 3.2, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 22.0, y: 1.0, z: 22.0 },
        properties: {
          shape: "hollow_rect",
          platformShape: "hollow_rect",
          holeWidth: 14.0,
          holeLength: 14.0,
          holeDepth: 14.0,
          theme: "pebbles"
        }
      },
      // 3. Pila de agua en el interior de la fuente gigante
      {
        id: "w3s3-fountain-water",
        type: "water",
        position: { x: 0.0, y: 3.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 13.8, y: 0.6, z: 13.8 },
        properties: { passable: true }
      },
      // 4. Gran caño / pilar monumental de piedra rústica que arroja el agua
      {
        id: "w3s3-monumental-spout",
        type: "decoration",
        position: { x: 0.0, y: 3.6, z: -8.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.2, y: 2.2, z: 2.2 },
        properties: { subType: "village_fountain" }
      },
      // 5. La Gran Rejilla de bronce en el centro del fondo de la fuente
      {
        id: "w3s3-grate-rim",
        type: "platform",
        position: { x: 0.0, y: 2.2, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.4, z: 6.0 },
        properties: {
          shape: "hollow_rect",
          platformShape: "hollow_rect",
          holeWidth: 4.2,
          holeLength: 4.2,
          holeDepth: 4.2,
          theme: "custom_color",
          customColor: "#b45309"
        }
      },
      // 6. Cámara / aljibe subterráneo donde cae la bola a través de la rejilla
      {
        id: "w3s3-cistern-floor",
        type: "platform",
        position: { x: 0.0, y: -2.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.8, z: 10.0 },
        properties: { theme: "pebbles" }
      },
      // Decoraciones rústicas de la fuente
      { id: "w3s3-bench-l", type: "decoration", position: { x: -9.5, y: 3.7, z: 0.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "wooden_bench_rustic" } },
      { id: "w3s3-bench-r", type: "decoration", position: { x: 9.5, y: 3.7, z: 0.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "wooden_bench_rustic" } },
      { id: "w3s3-lantern-1", type: "decoration", position: { x: -8.0, y: 3.7, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s3-lantern-2", type: "decoration", position: { x: 8.0, y: 3.7, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      // 10 Coleccionables repartidos entre el brocal, el agua y la caída a la rejilla
      { id: "w3s3-col-1", type: "collectible", position: { x: 0.0, y: 4.0, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s3-col-2", type: "collectible", position: { x: -5.0, y: 4.0, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s3-col-3", type: "collectible", position: { x: 5.0, y: 4.0, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s3-col-4", type: "collectible", position: { x: -5.0, y: 3.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s3-col-5", type: "collectible", position: { x: 5.0, y: 3.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s3-col-6", type: "collectible", position: { x: 0.0, y: 3.4, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s3-col-7", type: "collectible", position: { x: -1.5, y: 2.6, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s3-col-8", type: "collectible", position: { x: 1.5, y: 2.6, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s3-col-9", type: "collectible", position: { x: 0.0, y: 0.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s3-col-10", type: "collectible", position: { x: 0.0, y: -1.2, z: 1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta situada en el aljibe inferior dentro de la rejilla
      {
        id: "w3s3-goal",
        type: "goal",
        position: { x: 0.0, y: -1.2, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 4: Almacen
  // Gran almacén de pueblo con comida gigante (quesos de cabra, jamones ibéricos, tarros de miel).
  // Se desciende de balda en balda mediante rampas de madera continuas y perfectamente rodables.
  // ---------------------------------------------------------------------------
  4: {
    id: "world-03-level-01-stage-04",
    world: 3,
    level: 1,
    stage: 4,
    name: "Almacen",
    theme: "village",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 13.5, z: 18.0 },
    objects: [
      // Balda superior (Y=12.0)
      { id: "w3s4-shelf-1", type: "platform", position: { x: 0.0, y: 12.0, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.0, y: 0.8, z: 8.0 }, properties: { theme: "custom_color", customColor: "#6d4c41" } },
      // Rampa descendente hacia balda 2
      { id: "w3s4-ramp-1", type: "ramp", position: { x: 0.0, y: 10.0, z: 8.0 }, rotation: { x: -0.28, y: 0, z: 0 }, scale: { x: 4.5, y: 0.6, z: 7.0 }, properties: { theme: "custom_color", customColor: "#8d6e63" } },
      // Balda intermedia alta (Y=8.0)
      { id: "w3s4-shelf-2", type: "platform", position: { x: 0.0, y: 8.0, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.0, y: 0.8, z: 8.0 }, properties: { theme: "custom_color", customColor: "#6d4c41" } },
      // Rampa descendente hacia balda 3
      { id: "w3s4-ramp-2", type: "ramp", position: { x: 0.0, y: 6.0, z: -6.0 }, rotation: { x: -0.28, y: 0, z: 0 }, scale: { x: 4.5, y: 0.6, z: 7.0 }, properties: { theme: "custom_color", customColor: "#8d6e63" } },
      // Balda intermedia baja (Y=4.0)
      { id: "w3s4-shelf-3", type: "platform", position: { x: 0.0, y: 4.0, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.0, y: 0.8, z: 8.0 }, properties: { theme: "custom_color", customColor: "#6d4c41" } },
      // Rampa descendente al suelo
      { id: "w3s4-ramp-3", type: "ramp", position: { x: 0.0, y: 2.0, z: -20.0 }, rotation: { x: -0.28, y: 0, z: 0 }, scale: { x: 4.5, y: 0.6, z: 7.0 }, properties: { theme: "custom_color", customColor: "#8d6e63" } },
      // Suelo del almacén (Y=0.0)
      { id: "w3s4-shelf-ground", type: "platform", position: { x: 0.0, y: 0.0, z: -27.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 10.0, y: 0.8, z: 8.0 }, properties: { theme: "custom_color", customColor: "#5d4037" } },
      // Comida gigante en los laterales (Quesos y Tarro de miel hexagonales)
      { id: "w3s4-cheese-1", type: "platform", position: { x: -2.8, y: 13.0, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.0, y: 1.2, z: 2.0 }, properties: { shape: "hexagon", platformShape: "hexagon", theme: "custom_color", customColor: "#fff176" } },
      { id: "w3s4-cheese-2", type: "platform", position: { x: 2.8, y: 9.0, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.2, y: 1.2, z: 2.2 }, properties: { shape: "hexagon", platformShape: "hexagon", theme: "custom_color", customColor: "#ffe082" } },
      { id: "w3s4-honey-jar", type: "platform", position: { x: -2.8, y: 5.0, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.0, y: 1.5, z: 2.0 }, properties: { shape: "hexagon", platformShape: "hexagon", theme: "custom_color", customColor: "#ffb300" } },
      // 10 Coleccionables
      { id: "w3s4-col-1", type: "collectible", position: { x: 0.0, y: 12.8, z: 17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s4-col-2", type: "collectible", position: { x: 2.0, y: 12.8, z: 13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s4-col-3", type: "collectible", position: { x: 0.0, y: 10.5, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s4-col-4", type: "collectible", position: { x: -2.0, y: 8.8, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s4-col-5", type: "collectible", position: { x: 0.0, y: 8.8, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s4-col-6", type: "collectible", position: { x: 0.0, y: 6.5, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s4-col-7", type: "collectible", position: { x: 2.0, y: 4.8, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s4-col-8", type: "collectible", position: { x: 0.0, y: 4.8, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s4-col-9", type: "collectible", position: { x: 0.0, y: 2.5, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s4-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s4-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -28.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos9 (ETAPA DESCANSO / BONUS RURAL)
  // Gran explanada cuadrada de 24m x 24m con empedrado de pueblo y pizarra, farolas,
  // bancos rústicos y 10 bananas para recolectar plácidamente como descanso.
  // ---------------------------------------------------------------------------
  5: {
    id: "world-03-level-01-stage-05",
    world: 3,
    level: 1,
    stage: 5,
    name: "Objetos9",
    theme: "mesegal",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 9.0 },
    objects: [
      // Gran plataforma cuadrada de 24x24m con textura de pizarra de Mesegal
      {
        id: "w3s5-square-arena",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 24.0, y: 0.8, z: 24.0 },
        properties: { theme: "mesegal" }
      },
      // Bordillos de protección
      { id: "w3s5-curb-b", type: "platform", position: { x: 0.0, y: 0.4, z: 11.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 22.0, y: 0.4, z: 0.4 }, properties: { theme: "pebbles" } },
      { id: "w3s5-curb-l", type: "platform", position: { x: -11.8, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 22.0 }, properties: { theme: "pebbles" } },
      { id: "w3s5-curb-r", type: "platform", position: { x: 11.8, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 22.0 }, properties: { theme: "pebbles" } },
      // Decoraciones rústicas en esquinas
      { id: "w3s5-lantern-1", type: "decoration", position: { x: -10.0, y: 0.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s5-lantern-2", type: "decoration", position: { x: 10.0, y: 0.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s5-bench-1", type: "decoration", position: { x: -8.0, y: 0.4, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "wooden_bench_rustic" } },
      { id: "w3s5-bench-2", type: "decoration", position: { x: 8.0, y: 0.4, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "wooden_bench_rustic" } },
      { id: "w3s5-moss-1", type: "decoration", position: { x: -5.0, y: 0.42, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.4, y: 1, z: 1.4 }, properties: { subType: "moss_patch" } },
      { id: "w3s5-moss-2", type: "decoration", position: { x: 5.0, y: 0.42, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.4, y: 1, z: 1.4 }, properties: { subType: "moss_patch" } },
      // 10 Coleccionables bien repartidos por la gran explanada
      { id: "w3s5-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s5-col-2", type: "collectible", position: { x: -6.0, y: 0.8, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s5-col-3", type: "collectible", position: { x: 6.0, y: 0.8, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s5-col-4", type: "collectible", position: { x: -8.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s5-col-5", type: "collectible", position: { x: 0.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s5-col-6", type: "collectible", position: { x: 8.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s5-col-7", type: "collectible", position: { x: -6.0, y: 0.8, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s5-col-8", type: "collectible", position: { x: 6.0, y: 0.8, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s5-col-9", type: "collectible", position: { x: -3.0, y: 0.8, z: -8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s5-col-10", type: "collectible", position: { x: 3.0, y: 0.8, z: -8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta al frente
      {
        id: "w3s5-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 6: Escaleras2
  // Escalera de pizarra de pueblo estrecha (1.8m de ancho) perfectamente conectada
  // con 4 tramos de subida y descansillos llanos en cada giro de 90° sin inclinaciones raras.
  // ---------------------------------------------------------------------------
  6: {
    id: "world-03-level-01-stage-06",
    world: 3,
    level: 1,
    stage: 6,
    name: "Escaleras2",
    theme: "mesegal",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 20.0 },
    objects: [
      // Base de salida (Y=0.0)
      { id: "w3s6-base", type: "platform", position: { x: 0.0, y: 0.0, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.5, y: 0.8, z: 4.5 }, properties: { theme: "mesegal" } },
      // Tramo 1: rampa recta frontal hacia el fondo (sube de Y=0 a Y=2.5)
      { id: "w3s6-ramp-1", type: "ramp", position: { x: 0.0, y: 1.25, z: 13.5 }, rotation: { x: 0.28, y: 0, z: 0 }, scale: { x: 1.8, y: 0.6, z: 9.0 }, properties: { theme: "mesegal" } },
      // Descansillo 1: plataforma plana a nivel (Y=2.5) para girar a la derecha
      { id: "w3s6-land-1", type: "platform", position: { x: 0.0, y: 2.5, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 0.8, z: 3.0 }, properties: { theme: "mesegal" } },
      // Tramo 2: rampa hacia la derecha (sube de Y=2.5 a Y=5.0)
      { id: "w3s6-ramp-2", type: "ramp", position: { x: 5.5, y: 3.75, z: 8.0 }, rotation: { x: -0.30, y: Math.PI / 2, z: 0 }, scale: { x: 1.8, y: 0.6, z: 8.0 }, properties: { theme: "mesegal" } },
      // Descansillo 2: plataforma plana (Y=5.0) para girar hacia el fondo
      { id: "w3s6-land-2", type: "platform", position: { x: 10.5, y: 5.0, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 0.8, z: 3.0 }, properties: { theme: "mesegal" } },
      // Tramo 3: rampa recta hacia el fondo (sube de Y=5.0 a Y=7.5)
      { id: "w3s6-ramp-3", type: "ramp", position: { x: 10.5, y: 6.25, z: 2.5 }, rotation: { x: 0.28, y: 0, z: 0 }, scale: { x: 1.8, y: 0.6, z: 8.0 }, properties: { theme: "mesegal" } },
      // Descansillo 3: plataforma plana (Y=7.5) para girar a la izquierda
      { id: "w3s6-land-3", type: "platform", position: { x: 10.5, y: 7.5, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 0.8, z: 3.0 }, properties: { theme: "mesegal" } },
      // Tramo 4: rampa hacia la izquierda (sube de Y=7.5 a Y=10.0)
      { id: "w3s6-ramp-4", type: "ramp", position: { x: 5.5, y: 8.75, z: -2.5 }, rotation: { x: -0.30, y: -Math.PI / 2, z: 0 }, scale: { x: 1.8, y: 0.6, z: 8.0 }, properties: { theme: "mesegal" } },
      // Mirador final de meta (Y=10.0)
      { id: "w3s6-top", type: "platform", position: { x: 0.5, y: 10.0, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.0, y: 0.8, z: 5.0 }, properties: { theme: "mesegal" } },
      // Farolas rústicas en los descansillos
      { id: "w3s6-lantern-1", type: "decoration", position: { x: -1.2, y: 2.9, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      { id: "w3s6-lantern-2", type: "decoration", position: { x: 10.5, y: 7.9, z: -3.7 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "village_lantern_post" } },
      // 10 Coleccionables situados en la línea de ascenso
      { id: "w3s6-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s6-col-2", type: "collectible", position: { x: 0.0, y: 1.8, z: 14.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s6-col-3", type: "collectible", position: { x: 0.0, y: 3.3, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s6-col-4", type: "collectible", position: { x: 4.5, y: 4.5, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s6-col-5", type: "collectible", position: { x: 10.5, y: 5.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s6-col-6", type: "collectible", position: { x: 10.5, y: 7.0, z: 3.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s6-col-7", type: "collectible", position: { x: 10.5, y: 8.3, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s6-col-8", type: "collectible", position: { x: 6.5, y: 9.5, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s6-col-9", type: "collectible", position: { x: 2.0, y: 10.8, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s6-col-10", type: "collectible", position: { x: 0.5, y: 10.8, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta en lo alto de las escaleras
      {
        id: "w3s6-goal",
        type: "goal",
        position: { x: -0.5, y: 10.8, z: -2.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 7: Salamandra
  // Plataforma en forma de salamandra común de Las Hurdes (Salamandra salamandra).
  // Espectacular criatura gigante de 74m (el triple de grande) con piel negra brillante
  // y manchas amarillo oro, columna vertebral sinuosa en S, 4 patas con dedos y una cola
  // que se estrecha progresivamente hasta la punta donde está la meta.
  // ---------------------------------------------------------------------------
  7: {
    id: "world-03-level-01-stage-07",
    world: 3,
    level: 1,
    stage: 7,
    name: "Salamandra",
    theme: "mesegal",
    musicTrack: "sky_waltz",
    timeLimit: 75,
    spawn: { x: 0.0, y: 1.6, z: 1.0 },
    objects: [
      // Modelo orgánico completo de la salamandra gigante (74m de largo)
      {
        id: "w3s7-salamander",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 74.0 },
        properties: { variant: "salamander_platform", length: 74.0 }
      },
      // 10 Coleccionables repartidos entre cabeza, patas, lomo sinuoso y la cola estrecha
      { id: "w3s7-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 2.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s7-col-2", type: "collectible", position: { x: -8.8, y: 1.1, z: -9.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s7-col-3", type: "collectible", position: { x: 8.8, y: 1.1, z: -9.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s7-col-4", type: "collectible", position: { x: 2.2, y: 1.2, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s7-col-5", type: "collectible", position: { x: -2.3, y: 1.2, z: -22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s7-col-6", type: "collectible", position: { x: -8.8, y: 1.1, z: -32.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s7-col-7", type: "collectible", position: { x: 8.8, y: 1.1, z: -32.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s7-col-8", type: "collectible", position: { x: 1.8, y: 1.2, z: -40.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s7-col-9", type: "collectible", position: { x: 3.4, y: 1.2, z: -52.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s7-col-10", type: "collectible", position: { x: 1.5, y: 1.2, z: -66.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta situada en la misma punta de la cola
      {
        id: "w3s7-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -74.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 8: Ventilador2
  // Pasarela continua sólida que atraviesa dos ventiladores gigantes de 5 aspas:
  // El 1º es NEGRO y gira en sentido horario; el 2º es BLANCO y gira en sentido antihorario.
  // Debes calcular la ventana de paso entre las aspas gigantes para llegar a la meta.
  // ---------------------------------------------------------------------------
  8: {
    id: "world-03-level-01-stage-08",
    world: 3,
    level: 1,
    stage: 8,
    name: "Ventilador2",
    theme: "mesegal",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 22.0 },
    objects: [
      // Plataforma de salida (Y=0.0)
      { id: "w3s8-start", type: "platform", position: { x: 0.0, y: 0.0, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      // Tramo 1 de la pasarela continua (cruza el primer ventilador)
      { id: "w3s8-bridge-1", type: "platform", position: { x: 0.0, y: 0.0, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.6, y: 0.8, z: 12.0 }, properties: { theme: "mesegal" } },
      // Bordillos guía en la pasarela 1
      { id: "w3s8-curb-1l", type: "platform", position: { x: -1.9, y: 0.35, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.2, y: 0.3, z: 12.0 }, properties: { theme: "pebbles" } },
      { id: "w3s8-curb-1r", type: "platform", position: { x: 1.9, y: 0.35, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.2, y: 0.3, z: 12.0 }, properties: { theme: "pebbles" } },
      // EL PRIMER VENTILADOR GIGANTE (NEGRO, sentido horario)
      {
        id: "w3s8-fan-black",
        type: "moving-platform",
        position: { x: 0.0, y: 1.6, z: 11.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.8, y: 4.8, z: 0.8 },
        properties: {
          isMoving: true,
          variant: "fan_5blades",
          movementType: "fan_5blades",
          direction: 1,
          customColor: "#111111"
        }
      },
      // Plataforma intermedia de descanso
      { id: "w3s8-mid", type: "platform", position: { x: 0.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      // Tramo 2 de la pasarela continua (cruza el segundo ventilador)
      { id: "w3s8-bridge-2", type: "platform", position: { x: 0.0, y: 0.0, z: -9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.6, y: 0.8, z: 12.0 }, properties: { theme: "mesegal" } },
      // Bordillos guía en la pasarela 2
      { id: "w3s8-curb-2l", type: "platform", position: { x: -1.9, y: 0.35, z: -9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.2, y: 0.3, z: 12.0 }, properties: { theme: "pebbles" } },
      { id: "w3s8-curb-2r", type: "platform", position: { x: 1.9, y: 0.35, z: -9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.2, y: 0.3, z: 12.0 }, properties: { theme: "pebbles" } },
      // EL SEGUNDO VENTILADOR GIGANTE (BLANCO, sentido antihorario)
      {
        id: "w3s8-fan-white",
        type: "moving-platform",
        position: { x: 0.0, y: 1.6, z: -9.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.8, y: 4.8, z: 0.8 },
        properties: {
          isMoving: true,
          variant: "fan_5blades",
          movementType: "fan_5blades",
          direction: -1,
          customColor: "#ffffff"
        }
      },
      // Plataforma de meta
      { id: "w3s8-end", type: "platform", position: { x: 0.0, y: 0.0, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 6.0 }, properties: { theme: "mesegal" } },
      // 10 Coleccionables
      { id: "w3s8-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s8-col-2", type: "collectible", position: { x: 0.0, y: 0.8, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s8-col-3", type: "collectible", position: { x: 0.0, y: 0.8, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s8-col-4", type: "collectible", position: { x: 0.0, y: 0.8, z: 7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s8-col-5", type: "collectible", position: { x: -1.5, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s8-col-6", type: "collectible", position: { x: 1.5, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s8-col-7", type: "collectible", position: { x: 0.0, y: 0.8, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s8-col-8", type: "collectible", position: { x: 0.0, y: 0.8, z: -9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s8-col-9", type: "collectible", position: { x: 0.0, y: 0.8, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s8-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -16.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta
      {
        id: "w3s8-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -19.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 9: Puertas Blancas
  // Pasarela con 3 puertas blancas batientes que se abren despacio y pegan portazos aleatorios.
  // Cuando están abiertas, puedes atravesar el umbral libremente; cuando dan el portazo,
  // la fuerza del golpe te empuja al vacío.
  // ---------------------------------------------------------------------------
  9: {
    id: "world-03-level-01-stage-09",
    world: 3,
    level: 1,
    stage: 9,
    name: "Puertas Blancas",
    theme: "mesegal",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 18.0 },
    objects: [
      // Pasarela principal continua (ancho 4.2m)
      { id: "w3s9-floor", type: "platform", position: { x: 0.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.2, y: 0.8, z: 42.0 }, properties: { theme: "mesegal" } },
      // 3 Puertas blancas batientes con portazo
      {
        id: "w3s9-door-1",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "slamming_door", movementType: "slamming_door", speed: 1.0, phase: 0.0 }
      },
      {
        id: "w3s9-door-2",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "slamming_door", movementType: "slamming_door", speed: 1.2, phase: 1.2 }
      },
      {
        id: "w3s9-door-3",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "slamming_door", movementType: "slamming_door", speed: 0.9, phase: 2.1 }
      },
      // 10 Coleccionables
      { id: "w3s9-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s9-col-2", type: "collectible", position: { x: 0.0, y: 0.8, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s9-col-3", type: "collectible", position: { x: 0.0, y: 0.8, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s9-col-4", type: "collectible", position: { x: 0.0, y: 0.8, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s9-col-5", type: "collectible", position: { x: 0.0, y: 0.8, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s9-col-6", type: "collectible", position: { x: 0.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s9-col-7", type: "collectible", position: { x: 0.0, y: 0.8, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s9-col-8", type: "collectible", position: { x: 0.0, y: 0.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s9-col-9", type: "collectible", position: { x: 0.0, y: 0.8, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s9-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta al fondo
      {
        id: "w3s9-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -19.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 10: Misina
  // Gran gata blanca con dientes afilados y ojos esmeralda luminosos.
  // Entras por su boca abierta y recorres una pasarela interior continua y sinuosa
  // sobre su lengua rosa con bordillos y curvas desafiantes hasta la meta en el altar.
  // ---------------------------------------------------------------------------
  10: {
    id: "world-03-level-01-stage-10",
    world: 3,
    level: 1,
    stage: 10,
    name: "Misina",
    theme: "mesegal",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 18.0 },
    objects: [
      // Plataforma exterior de entrada
      { id: "w3s10-plaza", type: "platform", position: { x: 0.0, y: 0.0, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.0, y: 0.8, z: 8.0 }, properties: { theme: "mesegal" } },
      // Monumental cabeza 3D de la gata Misina (portal de entrada)
      {
        id: "w3s10-misina-portal",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "misina_cat" }
      },
      // Pasarela interior continua sobre la lengua rosa (longitud 24m)
      {
        id: "w3s10-tongue-main",
        type: "platform",
        position: { x: 0.0, y: 0.4, z: -4.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.2, y: 0.5, z: 24.0 },
        properties: { theme: "custom_color", customColor: "#e91e63" }
      },
      // Bordillos guía interiores
      { id: "w3s10-curb-l", type: "platform", position: { x: -1.7, y: 0.7, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.2, y: 0.3, z: 24.0 }, properties: { theme: "custom_color", customColor: "#ff80ab" } },
      { id: "w3s10-curb-r", type: "platform", position: { x: 1.7, y: 0.7, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.2, y: 0.3, z: 24.0 }, properties: { theme: "custom_color", customColor: "#ff80ab" } },
      // Rampa continua hacia el altar interior
      { id: "w3s10-spine-ramp", type: "ramp", position: { x: 0.0, y: 1.1, z: -19.0 }, rotation: { x: -0.22, y: 0, z: 0 }, scale: { x: 2.6, y: 0.5, z: 6.0 }, properties: { theme: "custom_color", customColor: "#f8bbd0" } },
      // Plataforma del altar final con la meta
      { id: "w3s10-altar", type: "platform", position: { x: 0.0, y: 1.8, z: -25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.8, z: 6.0 }, properties: { platformShape: "hexagon", theme: "custom_color", customColor: "#ffd54f" } },
      // 10 Coleccionables a lo largo del recorrido continuo
      { id: "w3s10-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s10-col-2", type: "collectible", position: { x: 0.0, y: 0.8, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s10-col-3", type: "collectible", position: { x: -0.8, y: 1.0, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s10-col-4", type: "collectible", position: { x: 0.8, y: 1.0, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s10-col-5", type: "collectible", position: { x: 0.0, y: 1.0, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s10-col-6", type: "collectible", position: { x: -0.8, y: 1.0, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s10-col-7", type: "collectible", position: { x: 0.8, y: 1.0, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s10-col-8", type: "collectible", position: { x: 0.0, y: 1.2, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s10-col-9", type: "collectible", position: { x: 0.0, y: 1.8, z: -19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w3s10-col-10", type: "collectible", position: { x: 0.0, y: 2.6, z: -24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Meta en el altar
      {
        id: "w3s10-goal",
        type: "goal",
        position: { x: 0.0, y: 2.6, z: -25.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  }
};

registerStageSet(3,1,WORLD_03_LEVEL_01_STAGES);

