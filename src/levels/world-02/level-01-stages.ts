import publishedEditorStages from '../editor-saved/world-02.json';
import {registerStageSet} from '../StageRegistry';
import type { LevelData } from "../LevelTypes";

// =============================================================================
// WORLD 2 - LEVEL 1: APARTAMENTO (SAN JUAN - PLAYA Y SOL)
// Etapas 1 a 10 con temática mediterránea, piscinas, terrazas y costa
// =============================================================================

export const WORLD_02_LEVEL_01_STAGES: Record<number, LevelData> = {
  // ---------------------------------------------------------------------------
  // ETAPA 1: Cuadrado2
  // Plataforma cuadrada de mármol travertino con bordillos costeros, palmeras,
  // sombrillas de playa, conchas en el suelo y 4 coleccionables en las esquinas.
  // ---------------------------------------------------------------------------
  1: {
    id: "world-02-level-01-stage-01",
    world: 2,
    level: 1,
    stage: 1,
    name: "Cuadrado2",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 5.5 },
    objects: [
      // Plataforma cuadrada principal (Travertino dorado Alicante)
      {
        id: "w2s1-square-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 14.0, y: 0.8, z: 14.0 },
        properties: { theme: "alicante" }
      },
      // Bordillos de protección con vanos en esquinas
      {
        id: "w2s1-curb-back",
        type: "platform",
        position: { x: 0.0, y: 0.55, z: 6.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.5, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#f5d77f" }
      },
      {
        id: "w2s1-curb-front",
        type: "platform",
        position: { x: 0.0, y: 0.55, z: -6.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.5, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#f5d77f" }
      },
      {
        id: "w2s1-curb-left",
        type: "platform",
        position: { x: -6.8, y: 0.55, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.5, z: 10.0 },
        properties: { theme: "custom_color", customColor: "#f5d77f" }
      },
      {
        id: "w2s1-curb-right",
        type: "platform",
        position: { x: 6.8, y: 0.55, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.5, z: 10.0 },
        properties: { theme: "custom_color", customColor: "#f5d77f" }
      },

      // Decoraciones de playa y costa
      {
        id: "w2s1-palm-1",
        type: "decoration",
        position: { x: -5.4, y: 0.4, z: 5.4 },
        rotation: { x: 0, y: 0.5, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "palm_tree", hasCollision: true }
      },
      {
        id: "w2s1-palm-2",
        type: "decoration",
        position: { x: 5.4, y: 0.4, z: -5.4 },
        rotation: { x: 0, y: -0.8, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "palm_tree", hasCollision: true }
      },
      {
        id: "w2s1-umbrella",
        type: "decoration",
        position: { x: -5.2, y: 0.4, z: -4.8 },
        rotation: { x: 0, y: 0.3, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "beach_umbrella", hasCollision: true }
      },
      {
        id: "w2s1-sunbed",
        type: "decoration",
        position: { x: 5.2, y: 0.4, z: 4.8 },
        rotation: { x: 0, y: -0.4, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "sunbed", hasCollision: true }
      },
      {
        id: "w2s1-shell-1",
        type: "decoration",
        position: { x: -2.0, y: 0.4, z: 2.5 },
        rotation: { x: 0, y: 0.6, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "seashell", hasCollision: false }
      },
      {
        id: "w2s1-shell-2",
        type: "decoration",
        position: { x: 2.4, y: 0.4, z: -1.5 },
        rotation: { x: 0, y: -1.2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "seashell", hasCollision: false }
      },
      {
        id: "w2s1-float-ring",
        type: "decoration",
        position: { x: 4.0, y: 0.4, z: 1.0 },
        rotation: { x: 0, y: 0.2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "float_ring", hasCollision: true }
      },

      // 4 Coleccionables en las esquinas
      { id: "w2s1-col-1", type: "collectible", position: { x: -4.8, y: 1.2, z: 4.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-2", type: "collectible", position: { x: 4.8, y: 1.2, z: 4.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-3", type: "collectible", position: { x: -4.8, y: 1.2, z: -4.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-4", type: "collectible", position: { x: 4.8, y: 1.2, z: -4.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al norte
      {
        id: "w2s1-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -5.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 2: Arpón (Laguna Mediterránea y Arpón de Alta Competición)
  // Rehecho entero:
  // - Laguna marina de agua turquesa cristalina y fondo de arena bajo todo el nivel.
  // - Muelle costero de salida con palmeras y terraza de travertino.
  // - Réplica aerodinámica y estilizada de un arpón submarino de competición:
  //   * Talón de carga ergonómico con pad antideslizante y ribete neón cian.
  //   * Empuñadura anatómica de buceo y guardamonte visible bajo el culatín.
  //   * Fuste de carbono marino cilíndrico (redondo y ancho con físicas cilíndricas reales).
  //   * Doble banda elástica de látex rojo submarino con obuses metálicos.
  //   * Tetón tahitiano / pincho central con ensanchamiento lateral para esquivarlo.
  //   * Cabezal abierto hidrodinámico y flecha de acero inox con aletillas dobles.
  //   * La meta en la punta misma de la flecha sobre el agua cristalina.
  // ---------------------------------------------------------------------------
  2: {
    id: "world-02-level-01-stage-02",
    world: 2,
    level: 1,
    stage: 2,
    name: "Arpón",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 2.8, z: 19.5 },
    objects: [
      // 0. ENTORNO MARINO: Laguna de agua turquesa cristalina bajo todo el nivel
      {
        id: "w2s2-lagoon-water",
        type: "water",
        position: { x: 0.0, y: -1.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 40.0, y: 0.6, z: 64.0 }
      },
      // Lecho arenoso del fondo marino
      {
        id: "w2s2-seabed-floor",
        type: "platform",
        position: { x: 0.0, y: -2.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 40.0, y: 0.8, z: 64.0 },
        properties: { theme: "alicante" }
      },

      // Isletas costeras de ambientación en la bahía
      {
        id: "w2s2-islet-left",
        type: "platform",
        position: { x: -14.0, y: -0.8, z: 2.0 },
        rotation: { x: 0, y: 0.3, z: 0 },
        scale: { x: 8.0, y: 1.6, z: 12.0 },
        properties: { theme: "alicante" }
      },
      {
        id: "w2s2-palm-islet-l",
        type: "decoration",
        position: { x: -14.0, y: 0.0, z: 2.0 },
        rotation: { x: 0, y: 0.6, z: 0 },
        scale: { x: 1.2, y: 1.2, z: 1.2 },
        properties: { subType: "palm_tree", hasCollision: true }
      },
      {
        id: "w2s2-islet-right",
        type: "platform",
        position: { x: 14.0, y: -0.8, z: -6.0 },
        rotation: { x: 0, y: -0.4, z: 0 },
        scale: { x: 8.0, y: 1.6, z: 12.0 },
        properties: { theme: "alicante" }
      },
      {
        id: "w2s2-palm-islet-r",
        type: "decoration",
        position: { x: 14.0, y: 0.0, z: -6.0 },
        rotation: { x: 0, y: -0.8, z: 0 },
        scale: { x: 1.2, y: 1.2, z: 1.2 },
        properties: { subType: "palm_tree", hasCollision: true }
      },

      // Flotadores y boyas de buceo balizando el agua (chocables)
      { id: "w2s2-buoy-1", type: "decoration", position: { x: -7.5, y: -1.6, z: 6.0 }, rotation: { x: 0, y: 0.4, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "float_ring", hasCollision: true } },
      { id: "w2s2-buoy-2", type: "decoration", position: { x: 7.5, y: -1.6, z: -8.0 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "float_ring", hasCollision: true } },

      // 1. MUELLE COSTERO DE SALIDA (Terraza de travertino donde spawnea el jugador, Y surface = 1.9m)
      {
        id: "w2s2-start-pier",
        type: "platform",
        position: { x: 0.0, y: 1.5, z: 19.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.5, y: 0.8, z: 5.5 },
        properties: { theme: "alicante" }
      },
      {
        id: "w2s2-pier-umbrella",
        type: "decoration",
        position: { x: -3.4, y: 1.9, z: 20.0 },
        rotation: { x: 0, y: 0.2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "beach_umbrella", hasCollision: true }
      },
      {
        id: "w2s2-pier-palm",
        type: "decoration",
        position: { x: 3.4, y: 1.9, z: 20.0 },
        rotation: { x: 0, y: -0.5, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "palm_tree", hasCollision: true }
      },

      // 2. TALÓN DE CARGA DEL ARPÓN (Base circular en Z = 15.0, Y surface = 1.9m)
      {
        id: "w2s2-harpoon-butt",
        type: "platform",
        position: { x: 0.0, y: 1.5, z: 15.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.2, y: 0.8, z: 7.2 },
        properties: { theme: "custom_color", customColor: "#1e272c", shape: "cylinder" }
      },
      // Inserto de goma de carga antideslizante con ribete cian
      {
        id: "w2s2-butt-pad",
        type: "platform",
        position: { x: 0.0, y: 1.92, z: 15.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.4, y: 0.06, z: 5.4 },
        properties: { theme: "custom_color", customColor: "#37474f", shape: "cylinder" }
      },
      {
        id: "w2s2-butt-rim",
        type: "platform",
        position: { x: 0.0, y: 1.94, z: 15.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.8, y: 0.04, z: 6.8 },
        properties: { theme: "custom_color", customColor: "#00e5ff", shape: "cylinder" }
      },
      // Empuñadura anatómica y guardamonte visible bajo el talón
      {
        id: "w2s2-grip-body",
        type: "platform",
        position: { x: 0.0, y: 0.7, z: 13.8 },
        rotation: { x: 0.28, y: 0, z: 0 },
        scale: { x: 1.6, y: 1.8, z: 3.2 },
        properties: { theme: "custom_color", customColor: "#eceff1" }
      },
      {
        id: "w2s2-trigger-guard",
        type: "platform",
        position: { x: 0.0, y: 0.15, z: 13.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.45, y: 0.7, z: 1.6 },
        properties: { theme: "custom_color", customColor: "#263238" }
      },

      // 3. FUSTE / CAÑÓN CILÍNDRICO DE FIBRA DE CARBONO Y TEAL MARINO
      // Cilindro horizontal acostado a lo largo de Z (radio 1.9m, corona superior en Y = 1.9m)
      // ¡SUPERFICIE FÍSICAMENTE REDONDA! Si te desvías a los lados, la curvatura real te hace resbalar al agua.
      {
        id: "w2s2-harpoon-barrel",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: Math.PI / 2, y: 0, z: 0 },
        scale: { x: 3.8, y: 24.0, z: 3.8 },
        properties: { theme: "custom_color", customColor: "#004d40", shape: "cylinder" }
      },

      // 4. GOMAS ELÁSTICAS LATERALES DE LÁTEX SUBMARINO (Rojo coral brillante)
      {
        id: "w2s2-latex-band-left",
        type: "platform",
        position: { x: -2.2, y: 1.0, z: -2.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.38, y: 0.38, z: 18.0 },
        properties: { theme: "custom_color", customColor: "#d32f2f" }
      },
      {
        id: "w2s2-latex-band-right",
        type: "platform",
        position: { x: 2.2, y: 1.0, z: -2.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.38, y: 0.38, z: 18.0 },
        properties: { theme: "custom_color", customColor: "#d32f2f" }
      },

      // 5. EL PINCHO DEL MEDIO (Aletilla tahitiana / Tetón central con bahías de esquiva)
      // Plataformas cilíndricas laterales para esquivar el pincho con habilidad
      {
        id: "w2s2-evasion-step-l",
        type: "platform",
        position: { x: -1.75, y: 1.5, z: 1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.2, y: 0.3, z: 3.8 },
        properties: { theme: "custom_color", customColor: "#006064", shape: "cylinder" }
      },
      {
        id: "w2s2-evasion-step-r",
        type: "platform",
        position: { x: 1.75, y: 1.5, z: 1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.2, y: 0.3, z: 3.8 },
        properties: { theme: "custom_color", customColor: "#006064", shape: "cylinder" }
      },
      // Base cilíndrica del pincho central
      {
        id: "w2s2-mid-spike-base",
        type: "platform",
        position: { x: 0.0, y: 2.05, z: 1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 0.35, z: 0.9 },
        properties: { theme: "custom_color", customColor: "#212121", shape: "cylinder" }
      },
      // Púa afilada / bumper de alta repulsión
      {
        id: "w2s2-mid-spike-horn",
        type: "bumper",
        position: { x: 0.0, y: 2.9, z: 1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.55, y: 1.8, z: 0.55 },
        properties: { customColor: "#ff1744", restitution: 1.75 }
      },

      // 6. CABEZAL ABIERTO (Open Muzzle en Z = -12.5)
      {
        id: "w2s2-open-muzzle",
        type: "platform",
        position: { x: 0.0, y: 1.5, z: -12.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.2, y: 0.8, z: 2.6 },
        properties: { theme: "custom_color", customColor: "#263238" }
      },

      // 7. FLECHA / VARILLA DE ACERO INOXIDABLE Y ALETILLAS TAHITIANAS
      // Varilla cilíndrica extendida sobre el mar (radio 0.8m, corona a Y = 1.8m)
      {
        id: "w2s2-spear-shaft",
        type: "platform",
        position: { x: 0.0, y: 1.0, z: -16.5 },
        rotation: { x: Math.PI / 2, y: 0, z: 0 },
        scale: { x: 1.6, y: 7.5, z: 1.6 },
        properties: { theme: "custom_color", customColor: "#eceff1", shape: "cylinder" }
      },
      // Aletilla lateral izquierda
      {
        id: "w2s2-flopper-l",
        type: "platform",
        position: { x: -1.6, y: 1.7, z: -15.5 },
        rotation: { x: 0, y: -0.5, z: 0 },
        scale: { x: 0.8, y: 0.25, z: 3.6 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },
      // Aletilla lateral derecha
      {
        id: "w2s2-flopper-r",
        type: "platform",
        position: { x: 1.6, y: 1.7, z: -15.5 },
        rotation: { x: 0, y: 0.5, z: 0 },
        scale: { x: 0.8, y: 0.25, z: 3.6 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },
      // Punta cónica de acero templado
      {
        id: "w2s2-spear-tip",
        type: "platform",
        position: { x: 0.0, y: 1.6, z: -20.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.2, y: 0.5, z: 3.0 },
        properties: { theme: "custom_color", customColor: "#b0bec5" }
      },

      // COLECCIONABLES
      { id: "w2s2-col-1", type: "collectible", position: { x: 0.0, y: 2.6, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-2", type: "collectible", position: { x: -1.6, y: 2.3, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-3", type: "collectible", position: { x: 1.6, y: 2.3, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-4", type: "collectible", position: { x: 0.0, y: 2.5, z: -14.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // META FLOTANTE AL FINAL EN LA PUNTA MISMA DEL ARPÓN
      {
        id: "w2s2-goal",
        type: "goal",
        position: { x: 0.0, y: 2.0, z: -20.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 3: Piscina3
  // Gran piscina residencial alargada verticalmente con agua turquesa cristalina,
  // palmeras a ambos lados, plataformas de baño y un socorrista en su torre.
  // ---------------------------------------------------------------------------
  3: {
    id: "world-02-level-01-stage-03",
    world: 2,
    level: 1,
    stage: 3,
    name: "Piscina3",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 20.0 },
    objects: [
      // Terraza de salida junto al agua
      {
        id: "w2s3-deck-start",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 20.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 12.0, y: 0.8, z: 6.0 },
        properties: { theme: "alicante" }
      },

      // Vaso / Canal de la piscina alargada (44m de longitud)
      {
        id: "w2s3-pool-water",
        type: "water",
        position: { x: 0.0, y: -0.1, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.2, y: 0.5, z: 34.0 }
      },
      // Fondo de mosaico azul de la piscina
      {
        id: "w2s3-pool-floor",
        type: "platform",
        position: { x: 0.0, y: -0.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.2, y: 0.4, z: 34.0 },
        properties: { theme: "custom_color", customColor: "#0288d1" }
      },

      // Paseo de travertino lateral izquierdo
      {
        id: "w2s3-deck-left",
        type: "platform",
        position: { x: -4.8, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.4, y: 0.8, z: 34.0 },
        properties: { theme: "alicante" }
      },
      // Paseo de travertino lateral derecho
      {
        id: "w2s3-deck-right",
        type: "platform",
        position: { x: 4.8, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.4, y: 0.8, z: 34.0 },
        properties: { theme: "alicante" }
      },

      // Trampolines y plataformas flotantes sobre el agua de la piscina
      {
        id: "w2s3-float-plat-1",
        type: "platform",
        position: { x: 0.0, y: 0.3, z: 11.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.8, y: 0.4, z: 3.5 },
        properties: { theme: "custom_color", customColor: "#fff176" }
      },
      {
        id: "w2s3-float-plat-2",
        type: "platform",
        position: { x: -1.6, y: 0.3, z: 2.0 },
        rotation: { x: 0, y: 0.2, z: 0 },
        scale: { x: 2.6, y: 0.4, z: 3.2 },
        properties: { theme: "custom_color", customColor: "#ff8a80" }
      },
      {
        id: "w2s3-float-plat-3",
        type: "platform",
        position: { x: 1.6, y: 0.3, z: -7.0 },
        rotation: { x: 0, y: -0.2, z: 0 },
        scale: { x: 2.6, y: 0.4, z: 3.2 },
        properties: { theme: "custom_color", customColor: "#80d8ff" }
      },

      // Fila de palmeras a ambos lados
      { id: "w2s3-palm-l1", type: "decoration", position: { x: -5.0, y: 0.4, z: 12.0 }, rotation: { x: 0, y: 0.4, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s3-palm-l2", type: "decoration", position: { x: -5.0, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 1.2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s3-palm-r1", type: "decoration", position: { x: 5.0, y: 0.4, z: 12.0 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s3-palm-r2", type: "decoration", position: { x: 5.0, y: 0.4, z: -10.0 }, rotation: { x: 0, y: -1.4, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },

      // EL SOCORRISTA SENTADO A UN LADO EN SU TORRE ALTA
      {
        id: "w2s3-lifeguard-chair",
        type: "decoration",
        position: { x: -4.8, y: 0.4, z: 0.0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1.2, y: 1.2, z: 1.2 },
        properties: { subType: "lifeguard_chair", hasCollision: true }
      },

      // Tumbonas y flotadores (chocables)
      { id: "w2s3-sunbed-1", type: "decoration", position: { x: 4.8, y: 0.4, z: 4.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "sunbed", hasCollision: true } },
      { id: "w2s3-sunbed-2", type: "decoration", position: { x: 4.8, y: 0.4, z: -4.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "sunbed", hasCollision: true } },
      { id: "w2s3-ring-water", type: "decoration", position: { x: 0.0, y: 0.0, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "float_ring", hasCollision: true } },

      // Terraza de llegada con la meta
      {
        id: "w2s3-deck-goal",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -20.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 12.0, y: 0.8, z: 6.0 },
        properties: { theme: "alicante" }
      },

      // Coleccionables
      { id: "w2s3-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-2", type: "collectible", position: { x: -1.6, y: 1.2, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-3", type: "collectible", position: { x: 1.6, y: 1.2, z: -7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-4", type: "collectible", position: { x: 0.0, y: 1.2, z: -15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al fondo de la piscina
      {
        id: "w2s3-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -20.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 4: Socorrista
  // Plataforma de césped donde un socorrista gigante barre con su escoba;
  // si te alcanza te barre fuera de la plataforma. Esquívalo para alcanzar la meta.
  // ---------------------------------------------------------------------------
  4: {
    id: "world-02-level-01-stage-04",
    world: 2,
    level: 1,
    stage: 4,
    name: "Socorrista",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 15.0 },
    objects: [
      // Pradera de césped verde de la urbanización
      {
        id: "w2s4-lawn-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.5, y: 0.8, z: 36.0 },
        properties: { theme: "grass" }
      },
      // Bordillos decorativos de terracota a los lados
      {
        id: "w2s4-curb-left",
        type: "platform",
        position: { x: -5.1, y: 0.55, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.5, z: 36.0 },
        properties: { theme: "custom_color", customColor: "#d84315" }
      },
      {
        id: "w2s4-curb-right",
        type: "platform",
        position: { x: 5.1, y: 0.55, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.5, z: 36.0 },
        properties: { theme: "custom_color", customColor: "#d84315" }
      },

      // EL SOCORRISTA GIGANTE CON SU ESCOBA BARRIENDO
      {
        id: "w2s4-lifeguard-sweeper",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.6, y: 3.6, z: 3.0 },
        properties: {
          isMoving: true,
          variant: "lifeguard_sweeper",
          movementType: "lifeguard_sweeper",
          distance: 3.6,
          speed: 1.8
        }
      },

      // Palmeras y sombrillas en los extremos del césped
      { id: "w2s4-palm-1", type: "decoration", position: { x: -4.5, y: 0.4, z: 12.0 }, rotation: { x: 0, y: 0.3, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s4-palm-2", type: "decoration", position: { x: 4.5, y: 0.4, z: -12.0 }, rotation: { x: 0, y: -0.6, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s4-umbrella-1", type: "decoration", position: { x: 4.2, y: 0.4, z: 9.0 }, rotation: { x: 0, y: 0.2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "beach_umbrella", hasCollision: true } },
      { id: "w2s4-umbrella-2", type: "decoration", position: { x: -4.2, y: 0.4, z: -9.0 }, rotation: { x: 0, y: -0.4, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "beach_umbrella", hasCollision: true } },

      // Coleccionables
      { id: "w2s4-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-2", type: "collectible", position: { x: -2.8, y: 1.2, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-3", type: "collectible", position: { x: 2.8, y: 1.2, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-4", type: "collectible", position: { x: 0.0, y: 1.2, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al final del césped
      {
        id: "w2s4-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -15.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos5
  // Terraza mediterránea donde los coleccionables están colocados en líneas
  // diagonales cruzadas (patrón en X) con jardineras, conchas y palmeras.
  // ---------------------------------------------------------------------------
  5: {
    id: "world-02-level-01-stage-05",
    world: 2,
    level: 1,
    stage: 5,
    name: "Objetos5",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 10.0 },
    objects: [
      // Gran terraza de travertino
      {
        id: "w2s5-terrace-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 18.0, y: 0.8, z: 24.0 },
        properties: { theme: "alicante" }
      },

      // Jardinera central decorativa con fuente
      {
        id: "w2s5-center-planter",
        type: "platform",
        position: { x: 0.0, y: 0.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.4, y: 0.6, z: 3.4 },
        properties: { theme: "custom_color", customColor: "#00838f", shape: "cylinder" }
      },
      {
        id: "w2s5-center-palm",
        type: "decoration",
        position: { x: 0.0, y: 0.9, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.1, y: 1.1, z: 1.1 },
        properties: { subType: "palm_tree", hasCollision: true }
      },

      // Jardineras en las esquinas
      {
        id: "w2s5-corner-1",
        type: "platform",
        position: { x: -6.5, y: 0.5, z: 9.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.2, y: 0.6, z: 2.2 },
        properties: { theme: "custom_color", customColor: "#006064" }
      },
      {
        id: "w2s5-corner-2",
        type: "platform",
        position: { x: 6.5, y: 0.5, z: 9.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.2, y: 0.6, z: 2.2 },
        properties: { theme: "custom_color", customColor: "#006064" }
      },
      {
        id: "w2s5-corner-3",
        type: "platform",
        position: { x: -6.5, y: 0.5, z: -9.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.2, y: 0.6, z: 2.2 },
        properties: { theme: "custom_color", customColor: "#006064" }
      },
      {
        id: "w2s5-corner-4",
        type: "platform",
        position: { x: 6.5, y: 0.5, z: -9.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.2, y: 0.6, z: 2.2 },
        properties: { theme: "custom_color", customColor: "#006064" }
      },

      // Sombrillas y conchas marinas
      { id: "w2s5-umbrella-1", type: "decoration", position: { x: -7.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0.2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "beach_umbrella", hasCollision: true } },
      { id: "w2s5-umbrella-2", type: "decoration", position: { x: 7.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: -0.2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "beach_umbrella", hasCollision: true } },
      { id: "w2s5-shell-1", type: "decoration", position: { x: -3.0, y: 0.4, z: 6.0 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "seashell", hasCollision: false } },
      { id: "w2s5-shell-2", type: "decoration", position: { x: 3.0, y: 0.4, z: 6.0 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "seashell", hasCollision: false } },

      // COLECCIONABLES EN DIAGONALES (Patrón diagonal en X)
      // Diagonal A (Noroeste a Sureste)
      { id: "w2s5-col-diag-1", type: "collectible", position: { x: -5.0, y: 1.2, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-diag-2", type: "collectible", position: { x: -2.5, y: 1.2, z: 3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-diag-3", type: "collectible", position: { x: 2.5, y: 1.2, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-diag-4", type: "collectible", position: { x: 5.0, y: 1.2, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Diagonal B (Noreste a Suroeste)
      { id: "w2s5-col-diag-5", type: "collectible", position: { x: 5.0, y: 1.2, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-diag-6", type: "collectible", position: { x: 2.5, y: 1.2, z: 3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-diag-7", type: "collectible", position: { x: -2.5, y: 1.2, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-diag-8", type: "collectible", position: { x: -5.0, y: 1.2, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al norte
      {
        id: "w2s5-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -9.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 6: Erizo
  // Pasarela vertical con un erizo de mar en el centro.
  // El erizo despliega sus pinchos durante 3 segundos (¡si te tocan te hacen volar!),
  // luego los retrae durante 1,5 segundos (ventana segura para cruzar) y ¡PAM! otra vez.
  // ---------------------------------------------------------------------------
  6: {
    id: "world-02-level-01-stage-06",
    world: 2,
    level: 1,
    stage: 6,
    name: "Erizo",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 17.0 },
    objects: [
      // Pasarela vertical costera
      {
        id: "w2s6-bridge-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.2, y: 0.8, z: 38.0 },
        properties: { theme: "alicante" }
      },
      // Bordillos de protección laterales
      {
        id: "w2s6-curb-left",
        type: "platform",
        position: { x: -3.4, y: 0.55, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.5, z: 38.0 },
        properties: { theme: "custom_color", customColor: "#006064" }
      },
      {
        id: "w2s6-curb-right",
        type: "platform",
        position: { x: 3.4, y: 0.55, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.5, z: 38.0 },
        properties: { theme: "custom_color", customColor: "#006064" }
      },

      // EL ERIZO CON PINCHOS RETRÁCTILES (En medio de la pasarela)
      {
        id: "w2s6-sea-urchin",
        type: "moving-platform",
        position: { x: 0.0, y: 1.2, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.4, y: 2.4, z: 2.4 },
        properties: {
          isMoving: true,
          variant: "sea_urchin",
          movementType: "sea_urchin"
        }
      },

      // Elementos decorativos marinos
      { id: "w2s6-shell-1", type: "decoration", position: { x: -2.0, y: 0.4, z: 12.0 }, rotation: { x: 0, y: 0.4, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "seashell", hasCollision: false } },
      { id: "w2s6-shell-2", type: "decoration", position: { x: 2.0, y: 0.4, z: 10.0 }, rotation: { x: 0, y: -0.8, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "seashell", hasCollision: false } },
      { id: "w2s6-shell-3", type: "decoration", position: { x: -2.2, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0.9, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "seashell", hasCollision: false } },
      { id: "w2s6-shell-4", type: "decoration", position: { x: 2.2, y: 0.4, z: -12.0 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "seashell", hasCollision: false } },

      // Coleccionables
      { id: "w2s6-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-2", type: "collectible", position: { x: -2.0, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-3", type: "collectible", position: { x: 2.0, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-4", type: "collectible", position: { x: 0.0, y: 1.2, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al final de la pasarela
      {
        id: "w2s6-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -16.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 7: Ascensor
  // Torre de apartamentos de 9 pisos. Entras en la cabina panorámica del ascensor,
  // te sube piso a piso; en cada piso sales a la terraza para recoger el coleccionable,
  // y al volver a entrar el ascensor avanza al siguiente piso hasta el piso 9 con la meta.
  // ---------------------------------------------------------------------------
  7: {
    id: "world-02-level-01-stage-07",
    world: 2,
    level: 1,
    stage: 7,
    name: "Ascensor",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 90,
    spawn: { x: 0.0, y: 1.5, z: 5.0 },
    objects: [
      // Patio / Recepción del edificio en Planta Baja (Piso 1)
      {
        id: "w2s7-ground-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 3.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.8, z: 8.0 },
        properties: { theme: "alicante" }
      },

      // CABINA DEL ASCENSOR INTERACTIVO (Recorre los 9 pisos)
      {
        id: "w2s7-elevator-cabin",
        type: "moving-platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.8, y: 3.2, z: 2.8 },
        properties: {
          isMoving: true,
          variant: "apartment_elevator",
          movementType: "apartment_elevator"
        }
      },

      // PISO 1 (Y = 0.0): Terraza y coleccionable
      { id: "w2s7-col-p1", type: "collectible", position: { x: 0.0, y: 1.2, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-landing-p1", type: "platform", position: { x: 0.0, y: 0.0, z: -3.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.5, y: 0.6, z: 3.5 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },

      // PISO 2 (Y = 3.5)
      { id: "w2s7-landing-p2", type: "platform", position: { x: 0.0, y: 3.5, z: -3.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.5, y: 0.6, z: 3.5 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w2s7-col-p2", type: "collectible", position: { x: 0.0, y: 4.7, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // PISO 3 (Y = 7.0)
      { id: "w2s7-landing-p3", type: "platform", position: { x: 0.0, y: 7.0, z: -3.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.5, y: 0.6, z: 3.5 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w2s7-col-p3", type: "collectible", position: { x: 0.0, y: 8.2, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // PISO 4 (Y = 10.5)
      { id: "w2s7-landing-p4", type: "platform", position: { x: 0.0, y: 10.5, z: -3.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.5, y: 0.6, z: 3.5 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w2s7-col-p4", type: "collectible", position: { x: 0.0, y: 11.7, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // PISO 5 (Y = 14.0)
      { id: "w2s7-landing-p5", type: "platform", position: { x: 0.0, y: 14.0, z: -3.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.5, y: 0.6, z: 3.5 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w2s7-col-p5", type: "collectible", position: { x: 0.0, y: 15.2, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // PISO 6 (Y = 17.5)
      { id: "w2s7-landing-p6", type: "platform", position: { x: 0.0, y: 17.5, z: -3.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.5, y: 0.6, z: 3.5 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w2s7-col-p6", type: "collectible", position: { x: 0.0, y: 18.7, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // PISO 7 (Y = 21.0)
      { id: "w2s7-landing-p7", type: "platform", position: { x: 0.0, y: 21.0, z: -3.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.5, y: 0.6, z: 3.5 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w2s7-col-p7", type: "collectible", position: { x: 0.0, y: 22.2, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // PISO 8 (Y = 24.5)
      { id: "w2s7-landing-p8", type: "platform", position: { x: 0.0, y: 24.5, z: -3.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.5, y: 0.6, z: 3.5 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w2s7-col-p8", type: "collectible", position: { x: 0.0, y: 25.7, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // PISO 9 (Y = 28.0): Terraza del Ático con la Meta
      {
        id: "w2s7-rooftop-penthouse",
        type: "platform",
        position: { x: 0.0, y: 28.0, z: -4.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.0, y: 0.8, z: 7.0 },
        properties: { theme: "alicante" }
      },
      {
        id: "w2s7-penthouse-palm",
        type: "decoration",
        position: { x: 3.4, y: 28.4, z: -5.0 },
        rotation: { x: 0, y: 0.5, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "palm_tree", hasCollision: true }
      },
      {
        id: "w2s7-penthouse-umbrella",
        type: "decoration",
        position: { x: -3.4, y: 28.4, z: -5.0 },
        rotation: { x: 0, y: -0.4, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "beach_umbrella", hasCollision: true }
      },
      {
        id: "w2s7-goal",
        type: "goal",
        position: { x: 0.0, y: 28.8, z: -5.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 8: Noveno
  // Mapa de gran altitud y vértigo. La pasarela describe la forma exacta del
  // número 9 sobre el vacío: bucle superior circular y larga cola curvada hacia la meta.
  // ---------------------------------------------------------------------------
  8: {
    id: "world-02-level-01-stage-08",
    world: 2,
    level: 1,
    stage: 8,
    name: "Noveno",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 5.5, y: 33.5, z: 7.0 },
    objects: [
      // Plataforma de salida en el lado derecho del bucle del "9"
      {
        id: "w2s8-spawn-pad",
        type: "platform",
        position: { x: 5.5, y: 32.0, z: 7.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.2, y: 0.8, z: 3.2 },
        properties: { theme: "alicante" }
      },

      // BUCLE SUPERIOR DEL "9" (Círculo de radio 5.5m a 32m de altitud)
      // Segmentos del anillo norte, oeste, sur y este
      {
        id: "w2s8-loop-n",
        type: "platform",
        position: { x: 0.0, y: 32.0, z: 12.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.6, z: 1.8 },
        properties: { theme: "alicante" }
      },
      {
        id: "w2s8-loop-nw",
        type: "platform",
        position: { x: -4.0, y: 32.0, z: 10.5 },
        rotation: { x: 0, y: 0.785, z: 0 },
        scale: { x: 4.5, y: 0.6, z: 1.8 },
        properties: { theme: "alicante" }
      },
      {
        id: "w2s8-loop-w",
        type: "platform",
        position: { x: -5.5, y: 32.0, z: 6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.8, y: 0.6, z: 6.0 },
        properties: { theme: "alicante" }
      },
      {
        id: "w2s8-loop-sw",
        type: "platform",
        position: { x: -4.0, y: 32.0, z: 1.5 },
        rotation: { x: 0, y: -0.785, z: 0 },
        scale: { x: 4.5, y: 0.6, z: 1.8 },
        properties: { theme: "alicante" }
      },
      {
        id: "w2s8-loop-s",
        type: "platform",
        position: { x: 0.0, y: 32.0, z: -0.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.6, z: 1.8 },
        properties: { theme: "alicante" }
      },
      {
        id: "w2s8-loop-ne",
        type: "platform",
        position: { x: 4.0, y: 32.0, z: 10.5 },
        rotation: { x: 0, y: -0.785, z: 0 },
        scale: { x: 4.5, y: 0.6, z: 1.8 },
        properties: { theme: "alicante" }
      },

      // LA COLA CURVADA DESCENDENTE DEL "9" (Empieza en X = 5.5 y desciende hacia Z negativo)
      {
        id: "w2s8-stem-1",
        type: "platform",
        position: { x: 5.5, y: 31.4, z: 1.5 },
        rotation: { x: 0.1, y: 0, z: 0 },
        scale: { x: 1.8, y: 0.6, z: 5.0 },
        properties: { theme: "alicante" }
      },
      {
        id: "w2s8-stem-2",
        type: "platform",
        position: { x: 4.8, y: 30.5, z: -3.5 },
        rotation: { x: 0.12, y: -0.15, z: 0 },
        scale: { x: 1.8, y: 0.6, z: 5.5 },
        properties: { theme: "alicante" }
      },
      {
        id: "w2s8-stem-3",
        type: "platform",
        position: { x: 3.2, y: 29.5, z: -8.5 },
        rotation: { x: 0.12, y: -0.3, z: 0 },
        scale: { x: 1.8, y: 0.6, z: 5.5 },
        properties: { theme: "alicante" }
      },
      {
        id: "w2s8-stem-4",
        type: "platform",
        position: { x: 0.8, y: 28.5, z: -13.0 },
        rotation: { x: 0.1, y: -0.5, z: 0 },
        scale: { x: 1.8, y: 0.6, z: 5.0 },
        properties: { theme: "alicante" }
      },

      // Gancho inferior del "9" hacia la izquierda
      {
        id: "w2s8-hook-base",
        type: "platform",
        position: { x: -2.0, y: 27.8, z: -16.0 },
        rotation: { x: 0, y: -0.7, z: 0 },
        scale: { x: 2.0, y: 0.6, z: 4.5 },
        properties: { theme: "alicante" }
      },

      // Terraza panorámica de meta
      {
        id: "w2s8-goal-pad",
        type: "platform",
        position: { x: -5.0, y: 27.5, z: -17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.0, y: 0.8, z: 5.0 },
        properties: { theme: "alicante" }
      },

      // Coleccionables a lo largo del "9"
      { id: "w2s8-col-1", type: "collectible", position: { x: 0.0, y: 33.2, z: 12.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s8-col-2", type: "collectible", position: { x: -5.5, y: 33.2, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s8-col-3", type: "collectible", position: { x: 0.0, y: 33.2, z: -0.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s8-col-4", type: "collectible", position: { x: 3.2, y: 30.7, z: -8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al final del "9"
      {
        id: "w2s8-goal",
        type: "goal",
        position: { x: -5.0, y: 28.3, z: -17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 9: Colchón
  // Un colchón elástico gigante en el que nunca te puedes quedar quieto.
  // Cada bote te impulsa más alto; los coleccionables flotan a gran altura y
  // con el impulso máximo alcanzas la terraza superior donde está la meta.
  // ---------------------------------------------------------------------------
  9: {
    id: "world-02-level-01-stage-09",
    world: 2,
    level: 1,
    stage: 9,
    name: "Colchón",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 2.0, z: 13.0 },
    objects: [
      // Plataforma de salto inicial
      {
        id: "w2s9-start-pad",
        type: "platform",
        position: { x: 0.0, y: 0.6, z: 13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.8, z: 3.5 },
        properties: { theme: "alicante" }
      },

      // EL COLCHÓN ELÁSTICO GIGANTE (Impulso continuo ascendente)
      {
        id: "w2s9-spring-mattress",
        type: "moving-platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 13.0, y: 1.2, z: 21.0 },
        properties: {
          isMoving: true,
          variant: "mattress_bouncer",
          movementType: "mattress_bouncer"
        }
      },

      // Bordillos de protección perimetral del colchón
      {
        id: "w2s9-border-l",
        type: "platform",
        position: { x: -7.0, y: 0.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.6, y: 1.2, z: 21.0 },
        properties: { theme: "custom_color", customColor: "#0288d1" }
      },
      {
        id: "w2s9-border-r",
        type: "platform",
        position: { x: 7.0, y: 0.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.6, y: 1.2, z: 21.0 },
        properties: { theme: "custom_color", customColor: "#0288d1" }
      },

      // Sombrillas y palmeras festivas en los laterales
      { id: "w2s9-palm-l", type: "decoration", position: { x: -8.5, y: 0.4, z: 5.0 }, rotation: { x: 0, y: 0.4, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s9-palm-r", type: "decoration", position: { x: 8.5, y: 0.4, z: -5.0 }, rotation: { x: 0, y: -0.6, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },

      // COLECCIONABLES SUSPENDIDOS EN EL AIRE (Se cogen saltando en el colchón)
      { id: "w2s9-col-1", type: "collectible", position: { x: 0.0, y: 4.8, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s9-col-2", type: "collectible", position: { x: -3.0, y: 8.0, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s9-col-3", type: "collectible", position: { x: 3.0, y: 11.5, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s9-col-4", type: "collectible", position: { x: 0.0, y: 14.5, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Terraza elevada del ático donde se encuentra la meta (Y = 12.0)
      {
        id: "w2s9-goal-terrace",
        type: "platform",
        position: { x: 0.0, y: 12.0, z: -15.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.8, z: 6.0 },
        properties: { theme: "alicante" }
      },
      {
        id: "w2s9-terrace-umbrella",
        type: "decoration",
        position: { x: -3.0, y: 12.4, z: -15.0 },
        rotation: { x: 0, y: 0.2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "beach_umbrella", hasCollision: true }
      },

      // Meta en la terraza elevada
      {
        id: "w2s9-goal",
        type: "goal",
        position: { x: 0.0, y: 12.8, z: -15.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 10: Ventilador
  // Ventilador gigante de 5 aspas que gira a gran velocidad y periódicamente
  // reduce el ritmo a paso lento creando la ventana perfecta para cruzar a la meta.
  // ---------------------------------------------------------------------------
  10: {
    id: "world-02-level-01-stage-10",
    world: 2,
    level: 1,
    stage: 10,
    name: "Ventilador",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 14.0 },
    objects: [
      // Patio de salida
      {
        id: "w2s10-start-patio",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.8, z: 10.0 },
        properties: { theme: "alicante" }
      },

      // Pasarela de cruce que pasa por el centro del ventilador
      {
        id: "w2s10-mid-bridge",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.8, y: 0.8, z: 10.0 },
        properties: { theme: "alicante" }
      },
      // Bordillos guía en la pasarela del ventilador
      {
        id: "w2s10-bridge-curb-l",
        type: "platform",
        position: { x: -2.3, y: 0.55, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.25, y: 0.35, z: 10.0 },
        properties: { theme: "custom_color", customColor: "#00838f" }
      },
      {
        id: "w2s10-bridge-curb-r",
        type: "platform",
        position: { x: 2.3, y: 0.55, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.25, y: 0.35, z: 10.0 },
        properties: { theme: "custom_color", customColor: "#00838f" }
      },

      // Pórtico estructural del ventilador (Postes laterales y viga)
      {
        id: "w2s10-arch-col-l",
        type: "platform",
        position: { x: -5.5, y: 3.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.2, y: 7.0, z: 1.2 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      {
        id: "w2s10-arch-col-r",
        type: "platform",
        position: { x: 5.5, y: 3.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.2, y: 7.0, z: 1.2 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      {
        id: "w2s10-arch-beam",
        type: "platform",
        position: { x: 0.0, y: 7.2, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 12.2, y: 0.8, z: 1.4 },
        properties: { theme: "custom_color", customColor: "#263238" }
      },

      // EL VENTILADOR GIGANTE DE 5 CUCHILLAS (Alterna rápido / lento)
      {
        id: "w2s10-fan-5blades",
        type: "moving-platform",
        position: { x: 0.0, y: 3.2, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.8, y: 4.8, z: 0.8 },
        properties: {
          isMoving: true,
          variant: "fan_5blades",
          movementType: "fan_5blades"
        }
      },

      // Patio de llegada con la meta
      {
        id: "w2s10-goal-patio",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.8, z: 10.0 },
        properties: { theme: "alicante" }
      },

      // Decoraciones costeras
      { id: "w2s10-palm-1", type: "decoration", position: { x: -4.0, y: 0.4, z: 13.0 }, rotation: { x: 0, y: 0.4, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s10-palm-2", type: "decoration", position: { x: 4.0, y: 0.4, z: -13.0 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s10-shell-1", type: "decoration", position: { x: 2.5, y: 0.4, z: 8.0 }, rotation: { x: 0, y: 0.3, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "seashell", hasCollision: false } },
      { id: "w2s10-shell-2", type: "decoration", position: { x: -2.5, y: 0.4, z: -8.0 }, rotation: { x: 0, y: -0.6, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "seashell", hasCollision: false } },

      // Coleccionables
      { id: "w2s10-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-2", type: "collectible", position: { x: -1.6, y: 1.2, z: 3.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-3", type: "collectible", position: { x: 1.6, y: 1.2, z: -3.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-4", type: "collectible", position: { x: 0.0, y: 1.2, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al fondo tras atravesar el ventilador
      {
        id: "w2s10-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  }
};

// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('2_1_')) Object.assign(WORLD_02_LEVEL_01_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(2,1,WORLD_02_LEVEL_01_STAGES);

