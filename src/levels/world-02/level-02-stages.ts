import publishedEditorStages from '../editor-saved/world-02.json';
import {registerStageSet} from '../StageRegistry';
import {rebuildBikeCourse} from "../BikeCourse";
import type { LevelData } from "../LevelTypes";

// =============================================================================
// WORLD 2 - LEVEL 2: ALICANTE (COSTA, PUERTO Y CIUDAD MEDITERRÁNEA)
// 10 Etapas completas con nivel de detalle profesional 3D:
// 1: Parque3 (Parque playero con palmeras, sombrillas y mármol)
// 2: Salto2 (Doble salto acrobático sobre el mar con dianas acolchadas)
// 3: Cuesta2 (Subida de montaña en forma de 'S' hacia el mirador)
// 4: Tranvia (TRAM de Alicante sobre raíles de acero reales con giros de 90°)
// 5: Objetos6 (Bulevar ancho con coleccionables en los extremos laterales)
// 6: Bici (Bicicleta gigante completa con rueda vertical giratoria y pedaleo)
// 7: Casino (Ruleta de casino 3D con tapete de apuestas, dados, fichas y agujero en el 0)
// 8: Centro Comercial (Galería con 6 tiendas 3D completas y meta escondida en Joyería)
// 9: Mercadillo (12 puestos de mercadillo con toldos a rayas, mercancía y meta final)
// 10: Puerto (Muelles en forma de 3 'E' con 6 yates de lujo 3D y faro marítimo)
// =============================================================================

export const WORLD_02_LEVEL_02_STAGES: Record<number, LevelData> = {
  // ---------------------------------------------------------------------------
  // ETAPA 1: Parque3
  // Parque playero mediterráneo junto a la playa del Postiguet en Alicante:
  // suelo de travertino, palmeras, sombrillas, tumbonas, vallas costeras y mar.
  // ---------------------------------------------------------------------------
  1: {
    id: "world-02-level-02-stage-01",
    world: 2,
    level: 2,
    stage: 1,
    name: "Parque3",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 18.0 },
    objects: [
      // Paseo marítimo principal
      {
        id: "w2s1-promenade",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 18.0, y: 0.8, z: 42.0 },
        properties: { theme: "alicante" }
      },
      // Bordillos de protección
      {
        id: "w2s1-curb-left",
        type: "platform",
        position: { x: -8.8, y: 0.55, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.5, z: 42.0 },
        properties: { theme: "custom_color", customColor: "#00838f" }
      },
      {
        id: "w2s1-curb-right",
        type: "platform",
        position: { x: 8.8, y: 0.55, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.5, z: 42.0 },
        properties: { theme: "custom_color", customColor: "#00838f" }
      },
      {
        id: "w2s1-curb-back",
        type: "platform",
        position: { x: 0.0, y: 0.55, z: 20.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 18.0, y: 0.5, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#00838f" }
      },

      // Agua del mar a ambos lados (traspasable)
      {
        id: "w2s1-water-left",
        type: "water",
        position: { x: -18.0, y: -0.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 18.0, y: 1.0, z: 46.0 },
        properties: { passable: true, hasCollision: false }
      },
      {
        id: "w2s1-water-right",
        type: "water",
        position: { x: 18.0, y: -0.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 18.0, y: 1.0, z: 46.0 },
        properties: { passable: true, hasCollision: false }
      },

      // Jardineras y palmeras
      { id: "w2s1-palm-1", type: "decoration", position: { x: -6.5, y: 0.4, z: 14.0 }, rotation: { x: 0, y: 0.3, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s1-palm-2", type: "decoration", position: { x: 6.5, y: 0.4, z: 14.0 }, rotation: { x: 0, y: -0.3, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s1-palm-3", type: "decoration", position: { x: -6.5, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s1-palm-4", type: "decoration", position: { x: 6.5, y: 0.4, z: 0.0 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s1-palm-5", type: "decoration", position: { x: -6.5, y: 0.4, z: -14.0 }, rotation: { x: 0, y: 0.2, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s1-palm-6", type: "decoration", position: { x: 6.5, y: 0.4, z: -14.0 }, rotation: { x: 0, y: -0.2, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },

      // Sombrillas y tumbonas de playa
      { id: "w2s1-umb-1", type: "decoration", position: { x: -4.0, y: 0.4, z: 8.0 }, rotation: { x: 0, y: 0.4, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "beach_umbrella", hasCollision: true } },
      { id: "w2s1-bed-1", type: "decoration", position: { x: -4.0, y: 0.4, z: 6.2 }, rotation: { x: 0, y: 0.0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "sunbed", hasCollision: true } },
      { id: "w2s1-umb-2", type: "decoration", position: { x: 4.0, y: 0.4, z: -6.0 }, rotation: { x: 0, y: -0.4, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "beach_umbrella", hasCollision: true } },
      { id: "w2s1-bed-2", type: "decoration", position: { x: 4.0, y: 0.4, z: -4.2 }, rotation: { x: 0, y: 3.14, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "sunbed", hasCollision: true } },

      // Farolas y fuente
      { id: "w2s1-lamp-1", type: "decoration", position: { x: -7.5, y: 0.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "w2s1-lamp-2", type: "decoration", position: { x: 7.5, y: 0.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "w2s1-lamp-3", type: "decoration", position: { x: -7.5, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "w2s1-lamp-4", type: "decoration", position: { x: 7.5, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },

      // Fuente central decorativa de piedra
      {
        id: "w2s1-fountain-basin",
        type: "platform",
        position: { x: 0.0, y: 0.35, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.2, y: 0.4, z: 4.2 },
        properties: { theme: "custom_color", customColor: "#00695c", shape: "cylinder" }
      },
      {
        id: "w2s1-fountain-water",
        type: "water",
        position: { x: 0.0, y: 0.45, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.6, y: 0.2, z: 3.6 }
      },

      // 10 Coleccionables distribuidos por el parque costero
      { id: "w2s1-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-2", type: "collectible", position: { x: -4.5, y: 1.2, z: 9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-3", type: "collectible", position: { x: 4.5, y: 1.2, z: 9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-4", type: "collectible", position: { x: -3.0, y: 1.2, z: 2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-5", type: "collectible", position: { x: 3.0, y: 1.2, z: 2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-6", type: "collectible", position: { x: -3.0, y: 1.2, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-7", type: "collectible", position: { x: 3.0, y: 1.2, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-8", type: "collectible", position: { x: -4.5, y: 1.2, z: -9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-9", type: "collectible", position: { x: 4.5, y: 1.2, z: -9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-10", type: "collectible", position: { x: 0.0, y: 1.2, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al final del parque
      {
        id: "w2s1-goal",
        type: "goal",
        position: { x: 0.0, y: 1.5, z: -17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 2: Salto2
  // "Como Salto1 pero con dos saltos y más altos":
  // Plataforma alta (Y=14) -> Salto 1 en rampa -> Plataforma intermedia (Y=7) ->
  // Salto 2 en rampa -> Gran plataforma final (Y=0) con la meta sobre el mar.
  // ---------------------------------------------------------------------------
  2: {
    id: "world-02-level-02-stage-02",
    world: 2,
    level: 2,
    stage: 2,
    name: "Salto2",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 15.5, z: 34.0 },
    objects: [
      // 1. PLATAFORMA DE SALIDA ALTA (Y = 14.0, Z = 34.0)
      {
        id: "w2s2-plat-top",
        type: "platform",
        position: { x: 0.0, y: 14.0, z: 34.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.0, y: 0.8, z: 10.0 },
        properties: { theme: "alicante" }
      },
      // Bordillos de seguridad plataforma superior
      { id: "w2s2-curb-top-b", type: "platform", position: { x: 0.0, y: 14.6, z: 38.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 9.0, y: 0.5, z: 0.4 }, properties: { theme: "custom_color", customColor: "#00acc1" } },
      { id: "w2s2-curb-top-l", type: "platform", position: { x: -4.3, y: 14.6, z: 34.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 10.0 }, properties: { theme: "custom_color", customColor: "#00acc1" } },
      { id: "w2s2-curb-top-r", type: "platform", position: { x: 4.3, y: 14.6, z: 34.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 10.0 }, properties: { theme: "custom_color", customColor: "#00acc1" } },

      // Columnas de soporte de la torre alta
      { id: "w2s2-pillar-top", type: "platform", position: { x: 0.0, y: 6.8, z: 34.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.0, y: 13.6, z: 4.0 }, properties: { theme: "custom_color", customColor: "#37474f" } },

      // RAMPA 1 DE LANZAMIENTO
      { id: "w2s2-ramp-1", type: "ramp", position: { x: 0.0, y: 13.5, z: 26.5 }, rotation: { x: 0.22, y: 0, z: 0 }, scale: { x: 7.5, y: 0.7, z: 7.0 }, properties: { theme: "custom_color", customColor: "#fdd835" } },
      { id: "w2s2-ramp1-curb-l", type: "platform", position: { x: -3.6, y: 13.9, z: 26.5 }, rotation: { x: 0.22, y: 0, z: 0 }, scale: { x: 0.35, y: 0.6, z: 7.0 }, properties: { theme: "custom_color", customColor: "#e65100" } },
      { id: "w2s2-ramp1-curb-r", type: "platform", position: { x: 3.6, y: 13.9, z: 26.5 }, rotation: { x: 0.22, y: 0, z: 0 }, scale: { x: 0.35, y: 0.6, z: 7.0 }, properties: { theme: "custom_color", customColor: "#e65100" } },

      // Coleccionables en arco en el aire durante el SALTO 1
      { id: "w2s2-col-1", type: "collectible", position: { x: 0.0, y: 14.5, z: 21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-2", type: "collectible", position: { x: 0.0, y: 13.2, z: 17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-3", type: "collectible", position: { x: 0.0, y: 10.8, z: 13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // 2. PLATAFORMA INTERMEDIA DE ATERRIZAJE (Y = 7.0, Z = 5.0)
      { id: "w2s2-plat-mid", type: "platform", position: { x: 0.0, y: 7.0, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 11.0, y: 0.8, z: 14.0 }, properties: { theme: "alicante" } },
      { id: "w2s2-landing-mat-1", type: "platform", position: { x: 0.0, y: 7.42, z: 8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.0, y: 0.05, z: 6.0 }, properties: { theme: "custom_color", customColor: "#2e7d32" } },
      { id: "w2s2-curb-mid-l", type: "platform", position: { x: -5.3, y: 7.55, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 14.0 }, properties: { theme: "custom_color", customColor: "#00acc1" } },
      { id: "w2s2-curb-mid-r", type: "platform", position: { x: 5.3, y: 7.55, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 14.0 }, properties: { theme: "custom_color", customColor: "#00acc1" } },
      { id: "w2s2-pillar-mid", type: "platform", position: { x: 0.0, y: 3.3, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.0, y: 6.6, z: 5.0 }, properties: { theme: "custom_color", customColor: "#37474f" } },

      // Coleccionables en la plataforma intermedia
      { id: "w2s2-col-4", type: "collectible", position: { x: -2.5, y: 8.2, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-5", type: "collectible", position: { x: 2.5, y: 8.2, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // RAMPA 2 DE LANZAMIENTO
      { id: "w2s2-ramp-2", type: "ramp", position: { x: 0.0, y: 6.5, z: -1.5 }, rotation: { x: 0.24, y: 0, z: 0 }, scale: { x: 8.0, y: 0.7, z: 7.0 }, properties: { theme: "custom_color", customColor: "#fdd835" } },
      { id: "w2s2-ramp2-curb-l", type: "platform", position: { x: -3.8, y: 6.9, z: -1.5 }, rotation: { x: 0.24, y: 0, z: 0 }, scale: { x: 0.35, y: 0.6, z: 7.0 }, properties: { theme: "custom_color", customColor: "#e65100" } },
      { id: "w2s2-ramp2-curb-r", type: "platform", position: { x: 3.8, y: 6.9, z: -1.5 }, rotation: { x: 0.24, y: 0, z: 0 }, scale: { x: 0.35, y: 0.6, z: 7.0 }, properties: { theme: "custom_color", customColor: "#e65100" } },

      // Coleccionables en arco en el aire durante el SALTO 2
      { id: "w2s2-col-6", type: "collectible", position: { x: 0.0, y: 7.5, z: -7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-7", type: "collectible", position: { x: 0.0, y: 6.2, z: -11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-8", type: "collectible", position: { x: 0.0, y: 4.2, z: -15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // 3. PLATAFORMA FINAL DE LLEGADA CON META (Y = 0.0, Z = -25.0)
      { id: "w2s2-plat-bot", type: "platform", position: { x: 0.0, y: 0.0, z: -25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 0.8, z: 16.0 }, properties: { theme: "alicante" } },
      { id: "w2s2-landing-mat-2", type: "platform", position: { x: 0.0, y: 0.42, z: -19.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 10.0, y: 0.05, z: 6.0 }, properties: { theme: "custom_color", customColor: "#2e7d32" } },
      { id: "w2s2-curb-bot-f", type: "platform", position: { x: 0.0, y: 0.55, z: -32.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 0.5, z: 0.4 }, properties: { theme: "custom_color", customColor: "#00acc1" } },
      { id: "w2s2-curb-bot-l", type: "platform", position: { x: -6.8, y: 0.55, z: -25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 16.0 }, properties: { theme: "custom_color", customColor: "#00acc1" } },
      { id: "w2s2-curb-bot-r", type: "platform", position: { x: 6.8, y: 0.55, z: -25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 16.0 }, properties: { theme: "custom_color", customColor: "#00acc1" } },

      // Palmeras
      { id: "w2s2-palm-bot-1", type: "decoration", position: { x: -5.0, y: 0.4, z: -29.0 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s2-palm-bot-2", type: "decoration", position: { x: 5.0, y: 0.4, z: -29.0 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },

      // Agua marina oceánica (traspasable)
      { id: "w2s2-water-ocean", type: "water", position: { x: 0.0, y: -2.0, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 38.0, y: 1.0, z: 72.0 }, properties: { passable: true, hasCollision: false } },

      // 2 Coleccionables finales en la terraza de la meta
      { id: "w2s2-col-9", type: "collectible", position: { x: -3.0, y: 1.2, z: -26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-10", type: "collectible", position: { x: 3.0, y: 1.2, z: -26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta final
      { id: "w2s2-goal", type: "goal", position: { x: 0.0, y: 1.5, z: -29.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 3: Cuesta2
  // "Como cuesta 1, pero en forma de S para arriba":
  // Carretera de montaña costera serpenteante en forma de 'S' que asciende
  // desde Y = 0.0 hasta el mirador de la cumbre a Y = 13.5.
  // ---------------------------------------------------------------------------
  3: {
    id: "world-02-level-02-stage-03",
    world: 2,
    level: 2,
    stage: 3,
    name: "Cuesta2",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 30.0 },
    objects: [
      { id: "w2s3-plat-start", type: "platform", position: { x: 0.0, y: 0.0, z: 30.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 9.0, y: 0.8, z: 8.0 }, properties: { theme: "alicante" } },
      { id: "w2s3-curb-start-b", type: "platform", position: { x: 0.0, y: 0.55, z: 33.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 9.0, y: 0.5, z: 0.4 }, properties: { theme: "custom_color", customColor: "#00838f" } },

      // TRAMO 1 DE LA 'S'
      { id: "w2s3-ramp-1", type: "ramp", position: { x: 2.2, y: 2.2, z: 19.0 }, rotation: { x: -0.28, y: -0.22, z: 0 }, scale: { x: 6.8, y: 0.8, z: 16.0 }, properties: { theme: "custom_color", customColor: "#eceff1" } },
      { id: "w2s3-guard-1-l", type: "platform", position: { x: -1.0, y: 2.65, z: 19.0 }, rotation: { x: -0.28, y: -0.22, z: 0 }, scale: { x: 0.35, y: 0.7, z: 16.0 }, properties: { theme: "custom_color", customColor: "#006064" } },
      { id: "w2s3-guard-1-r", type: "platform", position: { x: 5.4, y: 2.65, z: 19.0 }, rotation: { x: -0.28, y: -0.22, z: 0 }, scale: { x: 0.35, y: 0.7, z: 16.0 }, properties: { theme: "custom_color", customColor: "#006064" } },

      // CURVA 1 DE LA 'S'
      { id: "w2s3-turn-1", type: "platform", position: { x: 5.0, y: 4.5, z: 9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 9.0, y: 0.8, z: 9.0 }, properties: { theme: "alicante" } },
      { id: "w2s3-curb-turn1-out", type: "platform", position: { x: 9.3, y: 5.05, z: 9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.6, z: 9.0 }, properties: { theme: "custom_color", customColor: "#d32f2f" } },
      { id: "w2s3-palm-turn1", type: "decoration", position: { x: 7.8, y: 4.9, z: 7.5 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },

      // TRAMO 2 DE LA 'S'
      { id: "w2s3-ramp-2", type: "ramp", position: { x: 0.0, y: 6.8, z: -2.0 }, rotation: { x: -0.28, y: 0.38, z: 0 }, scale: { x: 6.8, y: 0.8, z: 17.0 }, properties: { theme: "custom_color", customColor: "#eceff1" } },
      { id: "w2s3-guard-2-l", type: "platform", position: { x: -3.2, y: 7.25, z: -2.0 }, rotation: { x: -0.28, y: 0.38, z: 0 }, scale: { x: 0.35, y: 0.7, z: 17.0 }, properties: { theme: "custom_color", customColor: "#006064" } },
      { id: "w2s3-guard-2-r", type: "platform", position: { x: 3.2, y: 7.25, z: -2.0 }, rotation: { x: -0.28, y: 0.38, z: 0 }, scale: { x: 0.35, y: 0.7, z: 17.0 }, properties: { theme: "custom_color", customColor: "#006064" } },

      // CURVA 2 DE LA 'S'
      { id: "w2s3-turn-2", type: "platform", position: { x: -5.0, y: 9.2, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 9.0, y: 0.8, z: 9.0 }, properties: { theme: "alicante" } },
      { id: "w2s3-curb-turn2-out", type: "platform", position: { x: -9.3, y: 9.75, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.6, z: 9.0 }, properties: { theme: "custom_color", customColor: "#d32f2f" } },
      { id: "w2s3-palm-turn2", type: "decoration", position: { x: -7.8, y: 9.6, z: -14.5 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },

      // TRAMO 3 DE LA 'S'
      { id: "w2s3-ramp-3", type: "ramp", position: { x: -2.5, y: 11.3, z: -22.0 }, rotation: { x: -0.28, y: -0.25, z: 0 }, scale: { x: 6.8, y: 0.8, z: 14.0 }, properties: { theme: "custom_color", customColor: "#eceff1" } },
      { id: "w2s3-guard-3-l", type: "platform", position: { x: -5.6, y: 11.75, z: -22.0 }, rotation: { x: -0.28, y: -0.25, z: 0 }, scale: { x: 0.35, y: 0.7, z: 14.0 }, properties: { theme: "custom_color", customColor: "#006064" } },
      { id: "w2s3-guard-3-r", type: "platform", position: { x: 0.6, y: 11.75, z: -22.0 }, rotation: { x: -0.28, y: -0.25, z: 0 }, scale: { x: 0.35, y: 0.7, z: 14.0 }, properties: { theme: "custom_color", customColor: "#006064" } },

      // MIRADOR DE LA CUMBRE
      { id: "w2s3-summit", type: "platform", position: { x: 0.0, y: 13.5, z: -33.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 12.0, y: 0.8, z: 12.0 }, properties: { theme: "alicante" } },
      { id: "w2s3-balustrade-f", type: "platform", position: { x: 0.0, y: 14.1, z: -38.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 12.0, y: 0.6, z: 0.4 }, properties: { theme: "custom_color", customColor: "#00838f" } },
      { id: "w2s3-balustrade-l", type: "platform", position: { x: -5.8, y: 14.1, z: -33.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.6, z: 12.0 }, properties: { theme: "custom_color", customColor: "#00838f" } },
      { id: "w2s3-balustrade-r", type: "platform", position: { x: 5.8, y: 14.1, z: -33.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.6, z: 12.0 }, properties: { theme: "custom_color", customColor: "#00838f" } },

      { id: "w2s3-lamp-s1", type: "decoration", position: { x: -4.5, y: 13.9, z: -37.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "w2s3-lamp-s2", type: "decoration", position: { x: 4.5, y: 13.9, z: -37.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "w2s3-palm-s1", type: "decoration", position: { x: -4.5, y: 13.9, z: -31.0 }, rotation: { x: 0, y: 0.8, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s3-palm-s2", type: "decoration", position: { x: 4.5, y: 13.9, z: -31.0 }, rotation: { x: 0, y: -0.8, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },

      // 10 Coleccionables a lo largo de las curvas
      { id: "w2s3-col-1", type: "collectible", position: { x: 1.0, y: 1.8, z: 24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-2", type: "collectible", position: { x: 3.2, y: 3.2, z: 17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-3", type: "collectible", position: { x: 5.0, y: 5.6, z: 9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-4", type: "collectible", position: { x: 3.0, y: 7.2, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-5", type: "collectible", position: { x: 0.0, y: 8.2, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-6", type: "collectible", position: { x: -3.0, y: 9.2, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-7", type: "collectible", position: { x: -5.0, y: 10.4, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-8", type: "collectible", position: { x: -2.5, y: 12.4, z: -21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-9", type: "collectible", position: { x: -2.0, y: 14.6, z: -33.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-10", type: "collectible", position: { x: 2.0, y: 14.6, z: -33.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta en la cumbre
      { id: "w2s3-goal", type: "goal", position: { x: 0.0, y: 15.0, z: -36.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 4: Tranvia
  // "El tranvía tiene que ir por unos raíles, y tiene que girar 90 grados el tranvía."
  // Raíles reales 3D de acero y traviesas en circuito rectangular con giros de 90°.
  // El tranvía viaja sobre los raíles, gira 90° en cada esquina y el jugador se mueve dentro.
  // ---------------------------------------------------------------------------
  4: {
    id: "world-02-level-02-stage-04",
    world: 2,
    level: 2,
    stage: 4,
    name: "Tranvia",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: -8.0, y: 1.6, z: 12.0 }, // El jugador empieza dentro del vagón sobre los raíles norte
    objects: [
      // 1. RAÍLES 3D REALES DE ACERO CON TRAVIESAS Y BALASTO (Circuito con giros de 90°)
      {
        id: "w2s4-steel-rails",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 24.0, y: 0.8, z: 24.0 },
        properties: { variant: "tram_rails", cornerRadius: 4.0 }
      },

      // 2. EL TRANVÍA DE ALICANTE (TRAM móvil sobre los raíles que gira 90° en cada esquina)
      {
        id: "w2s4-tram-cabin",
        type: "moving-platform",
        position: { x: -8.0, y: 0.65, z: 12.0 },
        rotation: { x: 0, y: 1.57, z: 0 },
        scale: { x: 3.6, y: 0.4, z: 7.2 },
        properties: {
          variant: "tram_square",
          movementType: "tram_square",
          trackWidth: 24.0,
          trackLength: 24.0,
          cornerRadius: 4.0,
          speed: 4.2, // Velocidad elegante y ágil para el tranvía
          startDelay: 2.2, // Breve parada en la estación antes de arrancar
          direction: 1
        }
      },

      // 3. PLAZA CENTRAL CON FUENTE Y PALMERAS
      {
        id: "w2s4-central-plaza",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 14.0, y: 0.8, z: 14.0 },
        properties: { theme: "alicante", shape: "cylinder" }
      },
      {
        id: "w2s4-fountain-hub",
        type: "platform",
        position: { x: 0.0, y: 0.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.6, y: 0.6, z: 4.6 },
        properties: { theme: "custom_color", customColor: "#00838f", shape: "cylinder" }
      },
      {
        id: "w2s4-fountain-water",
        type: "water",
        position: { x: 0.0, y: 0.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.8, y: 0.3, z: 3.8 }
      },
      { id: "w2s4-palm-c1", type: "decoration", position: { x: -3.5, y: 0.4, z: 3.5 }, rotation: { x: 0, y: 0.3, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s4-palm-c2", type: "decoration", position: { x: 3.5, y: 0.4, z: 3.5 }, rotation: { x: 0, y: -0.3, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s4-palm-c3", type: "decoration", position: { x: -3.5, y: 0.4, z: -3.5 }, rotation: { x: 0, y: 0.8, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s4-palm-c4", type: "decoration", position: { x: 3.5, y: 0.4, z: -3.5 }, rotation: { x: 0, y: -0.8, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },

      // Agua marina rodeando la rotonda del tranvía (traspasable)
      { id: "w2s4-sea-around", type: "water", position: { x: 0.0, y: -1.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 50.0, y: 1.0, z: 50.0 }, properties: { passable: true, hasCollision: false } },

      // 10 Coleccionables situados a lo largo de los raíles y en las curvas de 90°
      { id: "w2s4-col-1", type: "collectible", position: { x: 0.0, y: 1.9, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-2", type: "collectible", position: { x: 6.0, y: 1.9, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-3", type: "collectible", position: { x: 10.8, y: 1.9, z: 10.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }, // En la curva de 90° NE
      { id: "w2s4-col-4", type: "collectible", position: { x: 12.0, y: 1.9, z: 3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-5", type: "collectible", position: { x: 12.0, y: 1.9, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-6", type: "collectible", position: { x: 10.8, y: 1.9, z: -10.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }, // En la curva de 90° SE
      { id: "w2s4-col-7", type: "collectible", position: { x: 0.0, y: 1.9, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-8", type: "collectible", position: { x: -6.0, y: 1.9, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-9", type: "collectible", position: { x: -10.8, y: 1.9, z: -10.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }, // En la curva de 90° SW
      { id: "w2s4-col-10", type: "collectible", position: { x: -12.0, y: 1.9, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta sobre las vías del tranvía
      {
        id: "w2s4-goal",
        type: "goal",
        position: { x: -12.0, y: 0.4, z: 6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.4, y: 1.25, z: 1.0 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos6
  // "Cómo objetos 5 pero con plátanos más a los lados":
  // Gran bulevar costero con 10 coleccionables colocados bien a los extremos
  // izquierdo y derecho, requiriendo zigzaguear y maniobrar con precisión.
  // ---------------------------------------------------------------------------
  5: {
    id: "world-02-level-02-stage-05",
    world: 2,
    level: 2,
    stage: 5,
    name: "Objetos6",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 22.0 },
    objects: [
      { id: "w2s5-boulevard", type: "platform", position: { x: 0.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 24.0, y: 0.8, z: 48.0 }, properties: { theme: "alicante" } },
      { id: "w2s5-curb-l", type: "platform", position: { x: -11.8, y: 0.55, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 48.0 }, properties: { theme: "custom_color", customColor: "#006064" } },
      { id: "w2s5-curb-r", type: "platform", position: { x: 11.8, y: 0.55, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 48.0 }, properties: { theme: "custom_color", customColor: "#006064" } },
      { id: "w2s5-curb-b", type: "platform", position: { x: 0.0, y: 0.55, z: 23.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 24.0, y: 0.5, z: 0.4 }, properties: { theme: "custom_color", customColor: "#006064" } },

      // Isletas ajardinadas centrales
      { id: "w2s5-island-1", type: "platform", position: { x: 0.0, y: 0.45, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.2, y: 0.4, z: 3.2 }, properties: { theme: "custom_color", customColor: "#00838f", shape: "cylinder" } },
      { id: "w2s5-palm-c1", type: "decoration", position: { x: 0.0, y: 0.7, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },

      { id: "w2s5-island-2", type: "platform", position: { x: 0.0, y: 0.45, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.6, y: 0.4, z: 3.6 }, properties: { theme: "custom_color", customColor: "#00838f", shape: "cylinder" } },
      { id: "w2s5-palm-c2", type: "decoration", position: { x: 0.0, y: 0.7, z: 0.0 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "palm_tree", hasCollision: true } },

      { id: "w2s5-island-3", type: "platform", position: { x: 0.0, y: 0.45, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.2, y: 0.4, z: 3.2 }, properties: { theme: "custom_color", customColor: "#00838f", shape: "cylinder" } },
      { id: "w2s5-palm-c3", type: "decoration", position: { x: 0.0, y: 0.7, z: -12.0 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },

      // 10 Coleccionables en los extremos bien a los lados
      { id: "w2s5-col-l1", type: "collectible", position: { x: -8.8, y: 1.2, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-l2", type: "collectible", position: { x: -8.2, y: 1.2, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-l3", type: "collectible", position: { x: -9.0, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-l4", type: "collectible", position: { x: -8.2, y: 1.2, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-l5", type: "collectible", position: { x: -8.8, y: 1.2, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      { id: "w2s5-col-r1", type: "collectible", position: { x: 8.8, y: 1.2, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-r2", type: "collectible", position: { x: 8.2, y: 1.2, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-r3", type: "collectible", position: { x: 9.0, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-r4", type: "collectible", position: { x: 8.2, y: 1.2, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-r5", type: "collectible", position: { x: 8.8, y: 1.2, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al final del bulevar
      { id: "w2s5-goal", type: "goal", position: { x: 0.0, y: 1.5, z: -21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 6: Bici
  // "Una bicicleta gigante literalmente: sales de la plataforma, hay una rueda
  // en vertical que gira sobre sí misma y te lleva hacia el otro lado y avanza lentamente,
  // las dos ruedas, y los pedales pueden verse mejor."
  // ---------------------------------------------------------------------------
  6: {
    id: "world-02-level-02-stage-06",
    world: 2,
    level: 2,
    stage: 6,
    name: "Bici",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 7.2, z: 35.0 }, // El jugador empieza en la plataforma muelle de salida a la altura superior de la rueda
    objects: [
      // Muelle de salida elevado
      {
        id: "w2s6-start-dock",
        type: "platform",
        position: { x: 0.0, y: 6.8, z: 35.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.8, z: 6.0 },
        properties: { theme: "alicante" }
      },
      { id: "w2s6-start-curb-b", type: "platform", position: { x: 0.0, y: 7.35, z: 37.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.0, y: 0.5, z: 0.4 }, properties: { theme: "custom_color", customColor: "#e53935" } },

      // 1. RUEDA TRASERA VERTICAL QUE GIRA SOBRE SÍ MISMA Y AVANZA LENTAMENTE
      {
        id: "w2s6-rear-vertical-wheel",
        type: "moving-platform",
        position: { x: 0.0, y: 3.5, z: 28.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.6, y: 0.4, z: 2.6 },
        properties: {
          variant: "bike_wheel_vertical",
          movementType: "bike_wheel_vertical",
          radius: 3.5, // Radio de 3.5m (altura total 7m de rueda gigante)
          distance: 10.0,
          speed: 1.8
        }
      },
      { id: "w2s6-col-1", type: "collectible", position: { x: 0.0, y: 7.8, z: 28.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-2", type: "collectible", position: { x: 0.0, y: 7.8, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // 2. CUADRO DE LA BICI TRASERO (Vainas y tubo del sillín)
      {
        id: "w2s6-frame-stays",
        type: "platform",
        position: { x: 0.0, y: 6.2, z: 16.0 },
        rotation: { x: -0.22, y: 0, z: 0 },
        scale: { x: 2.4, y: 0.6, z: 8.0 },
        properties: { theme: "custom_color", customColor: "#e53935" } // Rojo carrera
      },
      // Sillín de bicicleta negro con remaches
      {
        id: "w2s6-saddle",
        type: "platform",
        position: { x: 0.0, y: 7.6, z: 12.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.6, y: 0.5, z: 4.2 },
        properties: { theme: "custom_color", customColor: "#212121" }
      },

      // Eje del pedalier
      {
        id: "w2s6-crank-hub",
        type: "platform",
        position: { x: 0.0, y: 4.2, z: 9.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.6, y: 0.8, z: 3.6 },
        properties: { theme: "custom_color", customColor: "#37474f", shape: "cylinder" }
      },

      // 3. LOS PEDALES GIRATORIOS REALES (Con reflectores y rotación de cadencia)
      // Pedal Izquierdo (Fase PI)
      {
        id: "w2s6-pedal-left",
        type: "moving-platform",
        position: { x: -2.6, y: 4.2, z: 9.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.2, y: 0.35, z: 1.8 },
        properties: {
          variant: "bike_pedal",
          movementType: "bike_pedal",
          radius: 1.6,
          speed: 1.8,
          phase: 3.14159
        }
      },
      // Pedal Derecho (Fase 0)
      {
        id: "w2s6-pedal-right",
        type: "moving-platform",
        position: { x: 2.6, y: 4.2, z: 9.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.2, y: 0.35, z: 1.8 },
        properties: {
          variant: "bike_pedal",
          movementType: "bike_pedal",
          radius: 1.6,
          speed: 1.8,
          phase: 0.0
        }
      },
      { id: "w2s6-col-3", type: "collectible", position: { x: -2.6, y: 5.6, z: 9.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-4", type: "collectible", position: { x: 2.6, y: 5.6, z: 9.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // 4. TUBO DIAGONAL / SUPERIOR DEL CUADRO
      {
        id: "w2s6-frame-top-tube",
        type: "platform",
        position: { x: 0.0, y: 6.2, z: 4.0 },
        rotation: { x: 0.12, y: 0, z: 0 },
        scale: { x: 2.4, y: 0.6, z: 8.0 },
        properties: { theme: "custom_color", customColor: "#e53935" }
      },
      { id: "w2s6-col-5", type: "collectible", position: { x: 0.0, y: 7.2, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // 5. RUEDA DELANTERA VERTICAL (Segunda rueda vertical gigante)
      {
        id: "w2s6-front-vertical-wheel",
        type: "moving-platform",
        position: { x: 0.0, y: 3.5, z: -4.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.6, y: 0.4, z: 2.6 },
        properties: {
          variant: "bike_wheel_vertical",
          movementType: "bike_wheel_vertical",
          radius: 3.5,
          distance: 8.0,
          speed: 1.8
        }
      },
      { id: "w2s6-col-6", type: "collectible", position: { x: 0.0, y: 7.8, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-7", type: "collectible", position: { x: 0.0, y: 7.8, z: -9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // 6. POTENCIA Y HORQUILLA DELANTERA
      {
        id: "w2s6-fork-stem",
        type: "platform",
        position: { x: 0.0, y: 6.8, z: -14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.2, y: 0.8, z: 3.2 },
        properties: { theme: "custom_color", customColor: "#37474f", shape: "cylinder" }
      },

      // 7. LOS DOS MANILLARES CON PUÑOS
      {
        id: "w2s6-handlebar-l",
        type: "platform",
        position: { x: -4.0, y: 7.2, z: -15.5 },
        rotation: { x: 0, y: -0.25, z: 0 },
        scale: { x: 4.8, y: 0.5, z: 1.8 },
        properties: { theme: "custom_color", customColor: "#212121" }
      },
      {
        id: "w2s6-handlebar-r",
        type: "platform",
        position: { x: 4.0, y: 7.2, z: -15.5 },
        rotation: { x: 0, y: 0.25, z: 0 },
        scale: { x: 4.8, y: 0.5, z: 1.8 },
        properties: { theme: "custom_color", customColor: "#212121" }
      },
      { id: "w2s6-col-8", type: "collectible", position: { x: -4.5, y: 8.2, z: -15.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-9", type: "collectible", position: { x: 4.5, y: 8.2, z: -15.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-10", type: "collectible", position: { x: 0.0, y: 8.2, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Plataforma final de la meta
      {
        id: "w2s6-goal-platform",
        type: "platform",
        position: { x: 0.0, y: 7.2, z: -19.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.5, y: 0.6, z: 5.5 },
        properties: { theme: "alicante" }
      },
      { id: "w2s6-goal-curb", type: "platform", position: { x: 0.0, y: 7.7, z: -22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.5, y: 0.5, z: 0.4 }, properties: { theme: "custom_color", customColor: "#e53935" } },

      // Mar oceánico bajo la bicicleta (traspasable)
      { id: "w2s6-sea-water", type: "water", position: { x: 0.0, y: -2.0, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 38.0, y: 1.0, z: 68.0 }, properties: { passable: true, hasCollision: false } },

      // Meta en la potencia central
      { id: "w2s6-goal", type: "goal", position: { x: 0.0, y: 8.4, z: -19.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 7: Casino
  // "Una ruleta del casino que se mueve todo el rato, solo hay un agujero en
  // el número 0 y al tirarte por el agujero caerás a una plataforma debajo
  // donde está la meta."
  // Sala de casino profesional: mesa de ruleta con tapete de apuestas 1-36,
  // fichas gigantes apiladas, dados 3D, postes dorados con cordón de terciopelo.
  // ---------------------------------------------------------------------------
  7: {
    id: "world-02-level-02-stage-07",
    world: 2,
    level: 2,
    stage: 7,
    name: "Casino",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 5.5, z: 14.0 },
    objects: [
      // Pasarela de entrada alfombrada con terciopelo rojo
      {
        id: "w2s7-entrance-catwalk",
        type: "platform",
        position: { x: 0.0, y: 4.2, z: 14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.5, y: 0.6, z: 6.0 },
        properties: { theme: "custom_color", customColor: "#b71c1c" } // Alfombra roja casino
      },
      { id: "w2s7-catwalk-curb-b", type: "platform", position: { x: 0.0, y: 4.7, z: 16.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.5, y: 0.4, z: 0.4 }, properties: { theme: "custom_color", customColor: "#ffd54f" } },
      { id: "w2s7-col-1", type: "collectible", position: { x: 0.0, y: 5.5, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // 1. LA RULETA GIGANTE PROFESIONAL 3D (Giratoria con hueco abierto en el número 0)
      {
        id: "w2s7-roulette-wheel",
        type: "moving-platform",
        position: { x: 0.0, y: 4.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 16.0, y: 0.8, z: 16.0 },
        properties: {
          variant: "casino_roulette",
          movementType: "casino_roulette",
          rotSpeed: 0.65
        }
      },

      // Coleccionables alrededor de la ruleta giratoria
      { id: "w2s7-col-2", type: "collectible", position: { x: 0.0, y: 5.2, z: 5.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-col-3", type: "collectible", position: { x: 5.0, y: 5.2, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-col-4", type: "collectible", position: { x: 4.0, y: 5.2, z: -3.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-col-5", type: "collectible", position: { x: -4.0, y: 5.2, z: -3.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-col-6", type: "collectible", position: { x: -5.0, y: 5.2, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-col-7", type: "collectible", position: { x: 0.0, y: 5.2, z: -5.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // 2. SALA INFERIOR DEL CASINO / BÓVEDA VIP (DEBAJO DE LA RULETA A Y = 0.0)
      {
        id: "w2s7-vault-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 16.0, y: 0.8, z: 16.0 },
        properties: { theme: "custom_color", customColor: "#1b5e20" } // Verde fieltro tapete
      },
      { id: "w2s7-reception-mat", type: "platform", position: { x: 0.0, y: 0.42, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 12.0, y: 0.05, z: 12.0 }, properties: { theme: "custom_color", customColor: "#2e7d32" } },

      // Muros perimetrales dorados de la sala inferior
      { id: "w2s7-vault-wall-b", type: "platform", position: { x: 0.0, y: 0.55, z: 7.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 16.0, y: 0.5, z: 0.4 }, properties: { theme: "custom_color", customColor: "#ffd54f" } },
      { id: "w2s7-vault-wall-f", type: "platform", position: { x: 0.0, y: 0.55, z: -7.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 16.0, y: 0.5, z: 0.4 }, properties: { theme: "custom_color", customColor: "#ffd54f" } },
      { id: "w2s7-vault-wall-l", type: "platform", position: { x: -7.8, y: 0.55, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 16.0 }, properties: { theme: "custom_color", customColor: "#ffd54f" } },
      { id: "w2s7-vault-wall-r", type: "platform", position: { x: 7.8, y: 0.55, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 16.0 }, properties: { theme: "custom_color", customColor: "#ffd54f" } },

      // Pilas de fichas gigantes y dados en la sala inferior
      { id: "w2s7-chip-red", type: "platform", position: { x: -4.5, y: 0.65, z: -4.5 }, rotation: { x: 0, y: 0.4, z: 0 }, scale: { x: 2.2, y: 0.5, z: 2.2 }, properties: { theme: "custom_color", customColor: "#d32f2f", shape: "cylinder" } },
      { id: "w2s7-chip-blue", type: "platform", position: { x: 4.5, y: 0.65, z: -4.5 }, rotation: { x: 0, y: -0.4, z: 0 }, scale: { x: 2.2, y: 0.5, z: 2.2 }, properties: { theme: "custom_color", customColor: "#1976d2", shape: "cylinder" } },

      // Coleccionables en la sala inferior
      { id: "w2s7-col-8", type: "collectible", position: { x: -3.0, y: 1.2, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-col-9", type: "collectible", position: { x: 3.0, y: 1.2, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-col-10", type: "collectible", position: { x: 0.0, y: 1.2, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta en la sala inferior debajo del agujero del 0
      { id: "w2s7-goal", type: "goal", position: { x: 0.0, y: 1.5, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 8: Centro Comercial
  // "Un centro comercial con un pasillo y 6 tiendas 3 a la izquierda y 3 a la
  // derecha y en una de las tiendas está la meta escondida, y en las otras un coleccionable."
  // 6 Tiendas 3D completas: vitrinas de cristal, letreros neón 3D y mobiliario interior.
  // ---------------------------------------------------------------------------
  8: {
    id: "world-02-level-02-stage-08",
    world: 2,
    level: 2,
    stage: 8,
    name: "Centro Comercial",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 22.0 },
    objects: [
      // 1. PASILLO CENTRAL DEL CENTRO COMERCIAL
      {
        id: "w2s8-corridor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.5, y: 0.8, z: 48.0 },
        properties: { theme: "alicante" }
      },
      { id: "w2s8-wall-entrance", type: "platform", position: { x: 0.0, y: 1.0, z: 24.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.5, y: 1.4, z: 0.4 }, properties: { theme: "custom_color", customColor: "#00838f" } },
      { id: "w2s8-wall-end", type: "platform", position: { x: 0.0, y: 1.0, z: -24.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.5, y: 1.4, z: 0.4 }, properties: { theme: "custom_color", customColor: "#00838f" } },

      // Decoraciones del pasillo central
      { id: "w2s8-palm-1", type: "decoration", position: { x: 0.0, y: 0.4, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s8-palm-2", type: "decoration", position: { x: 0.0, y: 0.4, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },

      // =========================================================================
      // LAS 6 TIENDAS 3D COMPLETAS (3 IZQUIERDA Y 3 DERECHA)
      // =========================================================================

      // TIENDA 1 (Izq 1, Z = 12.0): "Heladería Alicante" (Mostrador de helados con 4 sabores)
      {
        id: "w2s8-shop-1",
        type: "platform",
        position: { x: -7.5, y: 0.0, z: 12.0 },
        rotation: { x: 0, y: 1.57, z: 0 },
        scale: { x: 7.2, y: 0.8, z: 7.2 },
        properties: { variant: "shop", shopType: "icecream", customColor: "#00bcd4" }
      },
      { id: "w2s8-dec-gelato", type: "decoration", position: { x: -8.8, y: 0.4, z: 13.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "gelato_display", hasCollision: true } },
      { id: "w2s8-dec-pos1", type: "decoration", position: { x: -6.2, y: 0.4, z: 13.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "checkout_counter", hasCollision: true } },
      { id: "w2s8-col-shop1", type: "collectible", position: { x: -7.5, y: 1.2, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // TIENDA 2 (Izq 2, Z = 0.0): "Surf & Beachwear" (Expositor con 3 tablas de surf)
      {
        id: "w2s8-shop-2",
        type: "platform",
        position: { x: -7.5, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 1.57, z: 0 },
        scale: { x: 7.2, y: 0.8, z: 7.2 },
        properties: { variant: "shop", shopType: "surf", customColor: "#ff9800" }
      },
      { id: "w2s8-dec-surf", type: "decoration", position: { x: -8.8, y: 0.4, z: 1.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "surf_rack", hasCollision: true } },
      { id: "w2s8-dec-shelf2", type: "decoration", position: { x: -8.8, y: 0.4, z: -1.8 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "store_shelf", hasCollision: true } },
      { id: "w2s8-col-shop2", type: "collectible", position: { x: -7.5, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // TIENDA 3 (Izq 3, Z = -12.0): "Arcade Recreativos" (Máquinas recreativas retro arcade con pantalla neón)
      {
        id: "w2s8-shop-3",
        type: "platform",
        position: { x: -7.5, y: 0.0, z: -12.0 },
        rotation: { x: 0, y: 1.57, z: 0 },
        scale: { x: 7.2, y: 0.8, z: 7.2 },
        properties: { variant: "shop", shopType: "arcade", customColor: "#ab47bc" }
      },
      { id: "w2s8-dec-arcade1", type: "decoration", position: { x: -8.8, y: 0.4, z: -10.5 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "arcade_cabinet", hasCollision: true } },
      { id: "w2s8-dec-arcade2", type: "decoration", position: { x: -8.8, y: 0.4, z: -13.5 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "arcade_cabinet", hasCollision: true } },
      { id: "w2s8-col-shop3", type: "collectible", position: { x: -7.5, y: 1.2, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // TIENDA 4 (Der 1, Z = 12.0): "Café & Bakery" (Cafetería con máquina espresso y croissants)
      {
        id: "w2s8-shop-4",
        type: "platform",
        position: { x: 7.5, y: 0.0, z: 12.0 },
        rotation: { x: 0, y: -1.57, z: 0 },
        scale: { x: 7.2, y: 0.8, z: 7.2 },
        properties: { variant: "shop", shopType: "bakery", customColor: "#ffb300" }
      },
      { id: "w2s8-dec-bakery", type: "decoration", position: { x: 8.8, y: 0.4, z: 13.8 }, rotation: { x: 0, y: 3.14, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "bakery_counter", hasCollision: true } },
      { id: "w2s8-dec-pos4", type: "decoration", position: { x: 6.2, y: 0.4, z: 13.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "checkout_counter", hasCollision: true } },
      { id: "w2s8-col-shop4", type: "collectible", position: { x: 7.5, y: 1.2, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // TIENDA 5 (Der 2, Z = 0.0): "Boutique Moda Alicante" (Podio con maniquí y vestidos)
      {
        id: "w2s8-shop-5",
        type: "platform",
        position: { x: 7.5, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: -1.57, z: 0 },
        scale: { x: 7.2, y: 0.8, z: 7.2 },
        properties: { variant: "shop", shopType: "fashion", customColor: "#e91e63" }
      },
      { id: "w2s8-dec-mannequin", type: "decoration", position: { x: 8.8, y: 0.4, z: 1.8 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "fashion_mannequin", hasCollision: true } },
      { id: "w2s8-dec-sneaker", type: "decoration", position: { x: 8.8, y: 0.4, z: -1.8 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "sneaker_rack", hasCollision: true } },
      { id: "w2s8-col-shop5", type: "collectible", position: { x: 7.5, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // TIENDA 6 (Der 3, Z = -12.0): "Joyería Real VIP" -> ¡AQUÍ ESTÁ LA META ESCONDIDA!
      {
        id: "w2s8-shop-6",
        type: "platform",
        position: { x: 7.5, y: 0.0, z: -12.0 },
        rotation: { x: 0, y: -1.57, z: 0 },
        scale: { x: 7.2, y: 0.8, z: 7.2 },
        properties: { variant: "shop", shopType: "jewelry", customColor: "#7e57c2" }
      },
      { id: "w2s8-dec-jewelry", type: "decoration", position: { x: 8.8, y: 0.4, z: -10.5 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "jewelry_bust", hasCollision: true } },
      { id: "w2s8-dec-plush", type: "decoration", position: { x: 8.8, y: 0.4, z: -13.5 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "plush_bear", hasCollision: true } },
      // META ESCONDIDA EN LA TIENDA 6
      // META ESCONDIDA EN LA TIENDA 6
      {
        id: "w2s8-hidden-goal",
        type: "goal",
        position: { x: 7.5, y: 1.2, z: -12.0 },
        rotation: { x: 0, y: -1.57, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },

      // 5 Coleccionables en el pasillo central
      { id: "w2s8-col-corr-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s8-col-corr-2", type: "collectible", position: { x: 0.0, y: 1.2, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s8-col-corr-3", type: "collectible", position: { x: 0.0, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s8-col-corr-4", type: "collectible", position: { x: 0.0, y: 1.2, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s8-col-corr-5", type: "collectible", position: { x: 0.0, y: 1.2, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 9: Mercadillo
  // "Es igual que el de Centro Comercial pero con 12 puestos de mercadillo
  // que al entrar pues pasa lo mismo."
  // 12 Puestos 3D reales con 4 postes de madera, toldos a rayas de colores,
  // mostradores de madera y mercancía real en 3D (frutas, cerámica, sombreros, etc.).
  // ---------------------------------------------------------------------------
  9: {
    id: "world-02-level-02-stage-09",
    world: 2,
    level: 2,
    stage: 9,
    name: "Mercadillo",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 34.0 },
    objects: [
      // Plaza comercial empedrada principal del mercadillo callejero (amplia, sólida y transitable)
      {
        id: "w2s9-market-street",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 20.0, y: 0.8, z: 72.0 },
        properties: { theme: "alicante" }
      },
      { id: "w2s9-street-b", type: "platform", position: { x: 0.0, y: 0.55, z: 36.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20.6, y: 0.5, z: 0.4 }, properties: { theme: "custom_color", customColor: "#00695c" } },
      { id: "w2s9-street-f", type: "platform", position: { x: 0.0, y: 0.55, z: -36.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20.6, y: 0.5, z: 0.4 }, properties: { theme: "custom_color", customColor: "#00695c" } },
      { id: "w2s9-curb-l", type: "platform", position: { x: -10.1, y: 0.55, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 72.0 }, properties: { theme: "custom_color", customColor: "#00695c" } },
      { id: "w2s9-curb-r", type: "platform", position: { x: 10.1, y: 0.55, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 72.0 }, properties: { theme: "custom_color", customColor: "#00695c" } },

      // Palmeras y farolas decorando la calle del mercadillo
      { id: "w2s9-palm-1", type: "decoration", position: { x: 0.0, y: 0.4, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s9-palm-2", type: "decoration", position: { x: 0.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s9-palm-3", type: "decoration", position: { x: 0.0, y: 0.4, z: -20.0 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },

      // =========================================================================
      // LOS 12 PUESTOS DE MERCADILLO 3D REALES (6 IZQUIERDA Y 6 DERECHA)
      // =========================================================================

      // Puesto 1 (Izq, Z = 25.0): Frutería (Toldo rojo y blanco, cajas de naranjas)
      { id: "w2s9-stall-1", type: "platform", position: { x: -5.8, y: 0.0, z: 25.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 5.5, y: 0.8, z: 5.0 }, properties: { variant: "market_stall", stallType: "fruit", customColor: "#e53935", stripeColor: "#ffffff" } },
      { id: "w2s9-col-1", type: "collectible", position: { x: -5.8, y: 1.5, z: 25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Puesto 2 (Der, Z = 25.0): Cerámica (Toldo azul y blanco, vasijas de barro)
      { id: "w2s9-stall-2", type: "platform", position: { x: 5.8, y: 0.0, z: 25.0 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 5.5, y: 0.8, z: 5.0 }, properties: { variant: "market_stall", stallType: "pottery", customColor: "#1e88e5", stripeColor: "#ffffff" } },
      { id: "w2s9-col-2", type: "collectible", position: { x: 5.8, y: 1.5, z: 25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Puesto 3 (Izq, Z = 15.0): Sombreros (Toldo amarillo y blanco, sombreros de paja)
      { id: "w2s9-stall-3", type: "platform", position: { x: -5.8, y: 0.0, z: 15.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 5.5, y: 0.8, z: 5.0 }, properties: { variant: "market_stall", stallType: "hats", customColor: "#fbc02d", stripeColor: "#ffffff" } },
      { id: "w2s9-col-3", type: "collectible", position: { x: -5.8, y: 1.5, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Puesto 4 (Der, Z = 15.0): Flores (Toldo verde y blanco, cubos con flores)
      { id: "w2s9-stall-4", type: "platform", position: { x: 5.8, y: 0.0, z: 15.0 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 5.5, y: 0.8, z: 5.0 }, properties: { variant: "market_stall", stallType: "flowers", customColor: "#43a047", stripeColor: "#ffffff" } },
      { id: "w2s9-col-4", type: "collectible", position: { x: 5.8, y: 1.5, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Puesto 5 (Izq, Z = 5.0): Frutas Mediterráneas (Toldo naranja y blanco)
      { id: "w2s9-stall-5", type: "platform", position: { x: -5.8, y: 0.0, z: 5.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 5.5, y: 0.8, z: 5.0 }, properties: { variant: "market_stall", stallType: "fruit", customColor: "#fb8c00", stripeColor: "#ffffff" } },
      { id: "w2s9-col-5", type: "collectible", position: { x: -5.8, y: 1.5, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Puesto 6 (Der, Z = 5.0): Cerámica Pintada (Toldo morado y blanco)
      { id: "w2s9-stall-6", type: "platform", position: { x: 5.8, y: 0.0, z: 5.0 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 5.5, y: 0.8, z: 5.0 }, properties: { variant: "market_stall", stallType: "pottery", customColor: "#8e24aa", stripeColor: "#ffffff" } },
      { id: "w2s9-col-6", type: "collectible", position: { x: 5.8, y: 1.5, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Puesto 7 (Izq, Z = -5.0): Artesanía Marina (Toldo cian y blanco)
      { id: "w2s9-stall-7", type: "platform", position: { x: -5.8, y: 0.0, z: -5.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 5.5, y: 0.8, z: 5.0 }, properties: { variant: "market_stall", stallType: "hats", customColor: "#00acc1", stripeColor: "#ffffff" } },
      { id: "w2s9-col-7", type: "collectible", position: { x: -5.8, y: 1.5, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Puesto 8 (Der, Z = -5.0): Flores de la Costa (Toldo rosa y blanco)
      { id: "w2s9-stall-8", type: "platform", position: { x: 5.8, y: 0.0, z: -5.0 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 5.5, y: 0.8, z: 5.0 }, properties: { variant: "market_stall", stallType: "flowers", customColor: "#d81b60", stripeColor: "#ffffff" } },
      { id: "w2s9-col-8", type: "collectible", position: { x: 5.8, y: 1.5, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Puesto 9 (Izq, Z = -15.0): Cestería Tradicional
      { id: "w2s9-stall-9", type: "platform", position: { x: -5.8, y: 0.0, z: -15.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 5.5, y: 0.8, z: 5.0 }, properties: { variant: "market_stall", stallType: "hats", customColor: "#6d4c41", stripeColor: "#ffffff" } },

      // Puesto 10 (Der, Z = -15.0): Cítricos de Alicante
      { id: "w2s9-stall-10", type: "platform", position: { x: 5.8, y: 0.0, z: -15.0 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 5.5, y: 0.8, z: 5.0 }, properties: { variant: "market_stall", stallType: "fruit", customColor: "#f4511e", stripeColor: "#ffffff" } },

      // Puesto 11 (Izq, Z = -25.0): Cerámica Artesana
      { id: "w2s9-stall-11", type: "platform", position: { x: -5.8, y: 0.0, z: -25.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 5.5, y: 0.8, z: 5.0 }, properties: { variant: "market_stall", stallType: "pottery", customColor: "#00897b", stripeColor: "#ffffff" } },

      // Puesto 12 (Der, Z = -25.0): PUESTO DE HONOR DORADO -> ¡AQUÍ ESTÁ LA META ESCONDIDA!
      { id: "w2s9-stall-12", type: "platform", position: { x: 5.8, y: 0.0, z: -25.0 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 5.5, y: 0.8, z: 5.0 }, properties: { variant: "market_stall", stallType: "goal", customColor: "#ffd54f", stripeColor: "#ff6f00" } },
      // META ESCONDIDA DENTRO DEL PUESTO 12
      {
        id: "w2s9-hidden-goal",
        type: "goal",
        position: { x: 5.8, y: 1.5, z: -25.0 },
        rotation: { x: 0, y: -1.57, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },

      // 2 Coleccionables en la calle central
      { id: "w2s9-col-street-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 30.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s9-col-street-2", type: "collectible", position: { x: 0.0, y: 1.2, z: -30.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 10: Puerto
  // "El puerto de Alicante con muchos yates donde tienes que ir por donde el
  // puerto que son en forma de 3 E juntas hasta llegar a la meta."
  // Muelles náuticos en 3 'E' con 6 yates de recreo 3D de lujo y faro con meta.
  // ---------------------------------------------------------------------------
  10: {
    id: "world-02-level-02-stage-10",
    world: 2,
    level: 2,
    stage: 10,
    name: "Puerto",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 75,
    spawn: { x: -12.0, y: 1.5, z: 30.0 },
    objects: [
      // Mar del puerto deportivo (traspasable)
      {
        id: "w2s10-marina-water",
        type: "water",
        position: { x: 0.0, y: -0.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 48.0, y: 1.0, z: 76.0 },
        properties: { passable: true, hasCollision: false }
      },

      // ESPINA CENTRAL DEL MUELLE
      {
        id: "w2s10-main-spine",
        type: "platform",
        position: { x: -12.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.2, y: 0.8, z: 64.0 },
        properties: { theme: "alicante" }
      },
      { id: "w2s10-spine-curb-out", type: "platform", position: { x: -14.1, y: 0.55, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 64.0 }, properties: { theme: "custom_color", customColor: "#0277bd" } },

      // =========================================================================
      // SECCIÓN E1 (Z = 28.0 a 12.0): Primera 'E' con 2 YATES DE LUJO 3D
      // =========================================================================
      { id: "w2s10-e1-arm1", type: "platform", position: { x: -1.0, y: 0.0, z: 26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 18.0, y: 0.8, z: 3.2 }, properties: { theme: "alicante" } },
      { id: "w2s10-e1-arm2", type: "platform", position: { x: -3.0, y: 0.0, z: 19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 0.8, z: 3.0 }, properties: { theme: "alicante" } },
      { id: "w2s10-e1-arm3", type: "platform", position: { x: -1.0, y: 0.0, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 18.0, y: 0.8, z: 3.2 }, properties: { theme: "alicante" } },
      { id: "w2s10-e1-outer", type: "platform", position: { x: 7.0, y: 0.0, z: 19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.2, y: 0.8, z: 14.0 }, properties: { theme: "alicante" } },

      // YATES 3D REALES EN LA SECCIÓN E1
      // Yate 1 (Azul Marino)
      {
        id: "w2s10-yacht-1",
        type: "platform",
        position: { x: -1.0, y: 0.0, z: 22.5 },
        rotation: { x: 0, y: 1.57, z: 0 },
        scale: { x: 4.2, y: 1.4, z: 9.5 },
        properties: { variant: "yacht", customColor: "#ffffff", cabinColor: "#0277bd", stripeColor: "#01579b" }
      },
      // Yate 2 (Azul Real)
      {
        id: "w2s10-yacht-2",
        type: "platform",
        position: { x: -1.0, y: 0.0, z: 15.5 },
        rotation: { x: 0, y: 1.57, z: 0 },
        scale: { x: 4.2, y: 1.4, z: 9.5 },
        properties: { variant: "yacht", customColor: "#ffffff", cabinColor: "#0288d1", stripeColor: "#0277bd" }
      },

      // Coleccionables en la E1
      { id: "w2s10-col-1", type: "collectible", position: { x: 5.0, y: 1.2, z: 26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-2", type: "collectible", position: { x: 2.0, y: 1.2, z: 19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-3", type: "collectible", position: { x: 5.0, y: 1.2, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // =========================================================================
      // SECCIÓN E2 (Z = 8.0 a -8.0): Segunda 'E' con 2 YATES DE LUJO 3D
      // =========================================================================
      { id: "w2s10-e2-arm1", type: "platform", position: { x: -1.0, y: 0.0, z: 7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 18.0, y: 0.8, z: 3.2 }, properties: { theme: "alicante" } },
      { id: "w2s10-e2-arm2", type: "platform", position: { x: -3.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 0.8, z: 3.0 }, properties: { theme: "alicante" } },
      { id: "w2s10-e2-arm3", type: "platform", position: { x: -1.0, y: 0.0, z: -7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 18.0, y: 0.8, z: 3.2 }, properties: { theme: "alicante" } },
      { id: "w2s10-e2-outer", type: "platform", position: { x: 7.0, y: 0.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.2, y: 0.8, z: 14.0 }, properties: { theme: "alicante" } },

      // YATES 3D REALES EN LA SECCIÓN E2
      // Yate 3 (Rojo Deportivo)
      {
        id: "w2s10-yacht-3",
        type: "platform",
        position: { x: -1.0, y: 0.0, z: 3.5 },
        rotation: { x: 0, y: 1.57, z: 0 },
        scale: { x: 4.2, y: 1.4, z: 9.5 },
        properties: { variant: "yacht", customColor: "#ffffff", cabinColor: "#d32f2f", stripeColor: "#b71c1c" }
      },
      // Yate 4 (Naranja Atardecer)
      {
        id: "w2s10-yacht-4",
        type: "platform",
        position: { x: -1.0, y: 0.0, z: -3.5 },
        rotation: { x: 0, y: 1.57, z: 0 },
        scale: { x: 4.2, y: 1.4, z: 9.5 },
        properties: { variant: "yacht", customColor: "#ffffff", cabinColor: "#f57c00", stripeColor: "#e65100" }
      },

      // Coleccionables en la E2
      { id: "w2s10-col-4", type: "collectible", position: { x: 5.0, y: 1.2, z: 7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-5", type: "collectible", position: { x: 2.0, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-6", type: "collectible", position: { x: 5.0, y: 1.2, z: -7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // =========================================================================
      // SECCIÓN E3 (Z = -12.0 a -28.0): Tercera 'E' con 2 YATES DE LUJO 3D
      // =========================================================================
      { id: "w2s10-e3-arm1", type: "platform", position: { x: -1.0, y: 0.0, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 18.0, y: 0.8, z: 3.2 }, properties: { theme: "alicante" } },
      { id: "w2s10-e3-arm2", type: "platform", position: { x: -3.0, y: 0.0, z: -19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 0.8, z: 3.0 }, properties: { theme: "alicante" } },
      { id: "w2s10-e3-arm3", type: "platform", position: { x: 0.0, y: 0.0, z: -26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20.0, y: 0.8, z: 3.6 }, properties: { theme: "alicante" } },
      { id: "w2s10-e3-outer", type: "platform", position: { x: 7.0, y: 0.0, z: -19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.2, y: 0.8, z: 14.0 }, properties: { theme: "alicante" } },

      // YATES 3D REALES EN LA SECCIÓN E3
      // Yate 5 (Verde Esmeralda Náutico)
      {
        id: "w2s10-yacht-5",
        type: "platform",
        position: { x: -1.0, y: 0.0, z: -15.5 },
        rotation: { x: 0, y: 1.57, z: 0 },
        scale: { x: 4.2, y: 1.4, z: 9.5 },
        properties: { variant: "yacht", customColor: "#ffffff", cabinColor: "#00796b", stripeColor: "#004d40" }
      },
      // Yate 6 (Grafito Elegance)
      {
        id: "w2s10-yacht-6",
        type: "platform",
        position: { x: -1.0, y: 0.0, z: -22.5 },
        rotation: { x: 0, y: 1.57, z: 0 },
        scale: { x: 4.2, y: 1.4, z: 9.5 },
        properties: { variant: "yacht", customColor: "#ffffff", cabinColor: "#37474f", stripeColor: "#212121" }
      },

      // Coleccionables en la E3
      { id: "w2s10-col-7", type: "collectible", position: { x: 5.0, y: 1.2, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-8", type: "collectible", position: { x: 2.0, y: 1.2, z: -19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-9", type: "collectible", position: { x: 5.0, y: 1.2, z: -26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // =========================================================================
      // FARO DEL PUERTO Y META FINAL
      // =========================================================================
      {
        id: "w2s10-lighthouse-pier",
        type: "platform",
        position: { x: 11.5, y: 0.0, z: -26.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.5, y: 0.8, z: 6.5 },
        properties: { theme: "alicante", shape: "cylinder" }
      },
      {
        id: "w2s10-lighthouse-base",
        type: "platform",
        position: { x: 13.5, y: 2.5, z: -26.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.2, y: 4.2, z: 2.2 },
        properties: { theme: "custom_color", customColor: "#f5f5f5", shape: "cylinder" }
      },
      {
        id: "w2s10-lighthouse-top",
        type: "platform",
        position: { x: 13.5, y: 4.8, z: -26.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.6, y: 0.8, z: 2.6 },
        properties: { theme: "custom_color", customColor: "#d32f2f", shape: "cylinder" }
      },

      // Último coleccionable en el faro
      { id: "w2s10-col-10", type: "collectible", position: { x: 10.5, y: 1.2, z: -26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta frente al faro de Alicante
      {
        id: "w2s10-goal",
        type: "goal",
        position: { x: 10.0, y: 1.5, z: -26.0 },
        rotation: { x: 0, y: 1.57, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  }
};

WORLD_02_LEVEL_02_STAGES[6]=rebuildBikeCourse(WORLD_02_LEVEL_02_STAGES[6]);
// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('2_2_')) Object.assign(WORLD_02_LEVEL_02_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(2,2,WORLD_02_LEVEL_02_STAGES);

