import publishedEditorStages from '../editor-saved/world-02.json';
import {registerStageSet} from '../StageRegistry';
import type { LevelData } from "../LevelTypes";

export const WORLD_02_LEVEL_04_STAGES: Record<number, LevelData> = {
  // ---------------------------------------------------------------------------
  // ETAPA 1: Tranvia2
  // "Es con el tranvia de la etapa Tranvia pero llendo recto hacia la meta como
  // la etapa Bus pero que sea el doble de largo el trayecto"
  // Trayecto recto de 144 metros por la costa hasta la Estación Fontana.
  // ---------------------------------------------------------------------------
  1: {
    id: "world-02-level-04-stage-01",
    world: 2,
    level: 4,
    stage: 1,
    name: "Tranvia2",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 90,
    spawn: { x: 0.0, y: 1.95, z: 62.0 },
    objects: [
      // Balasto y plataforma base del ferrocarril (144 metros de longitud)
      {
        id: "w2s4e1-track-bed",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.8, z: 144.0 },
        properties: { theme: "alicante" }
      },

      // Raíles rectos continuos de tranvía con traviesas y postes de catenaria
      {
        id: "w2s4e1-straight-rails",
        type: "platform",
        position: { x: 0.0, y: 0.4, z: -8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.8, y: 0.3, z: 144.0 },
        properties: { variant: "tram_straight_rails", length: 144.0 }
      },

      // Faldones de seguridad y aceras a ambos lados
      { id: "w2s4e1-curb-l", type: "platform", position: { x: -4.0, y: 0.5, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 144.0 }, properties: { theme: "custom_color", customColor: "#006064" } },
      { id: "w2s4e1-curb-r", type: "platform", position: { x: 4.0, y: 0.5, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 144.0 }, properties: { theme: "custom_color", customColor: "#006064" } },

      // Mar oceánico en todo el fondo horizontal a la izquierda
      {
        id: "w2s4e1-sea",
        type: "water",
        position: { x: -32.0, y: -0.8, z: -8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 56.0, y: 1.0, z: 160.0 },
        properties: { passable: true, hasCollision: false }
      },

      // CABINA OFICIAL DEL TRAM DE ALICANTE (Movimiento lineal recto hacia la meta)
      // Doble de largo que el autobús (distancia 136 metros a 5.5 m/s)
      {
        id: "w2s4e1-tram-cabin",
        type: "moving-platform",
        position: { x: 0.0, y: 0.95, z: 62.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.6, y: 0.4, z: 7.2 },
        properties: {
          variant: "tram_square",
          movementType: "tram_linear",
          direction: -1,
          distance: 136.0,
          speed: 5.5,
          startDelay: 3.5,
          customColor: "#ffffff",
          stripeColor: "#f37021"
        }
      },

      // Palmeras costeras en la orilla del mar (en el fondo detrás del tranvía)
      { id: "w2s4e1-palm-1", type: "decoration", position: { x: -5.8, y: 0.4, z: 50.0 }, rotation: { x: 0, y: -0.4, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s4e1-palm-2", type: "decoration", position: { x: -5.8, y: 0.4, z: 20.0 }, rotation: { x: 0, y: 0.3, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s4e1-palm-3", type: "decoration", position: { x: -5.8, y: 0.4, z: -10.0 }, rotation: { x: 0, y: -0.2, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s4e1-palm-4", type: "decoration", position: { x: -5.8, y: 0.4, z: -40.0 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "palm_tree", hasCollision: true } },

      // 10 Coleccionables (dentro del tranvía y a lo largo de la travesía)
      { id: "w2s4e1-col-1", type: "collectible", position: { x: 0.0, y: 1.85, z: 64.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e1-col-2", type: "collectible", position: { x: 0.0, y: 1.85, z: 60.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e1-col-3", type: "collectible", position: { x: -0.8, y: 1.85, z: 42.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e1-col-4", type: "collectible", position: { x: 0.8, y: 1.85, z: 24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e1-col-5", type: "collectible", position: { x: 0.0, y: 1.85, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e1-col-6", type: "collectible", position: { x: -0.8, y: 1.85, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e1-col-7", type: "collectible", position: { x: 0.8, y: 1.85, z: -30.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e1-col-8", type: "collectible", position: { x: 0.0, y: 1.85, z: -48.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e1-col-9", type: "collectible", position: { x: -0.8, y: 1.85, z: -64.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e1-col-10", type: "collectible", position: { x: 0.0, y: 1.85, z: -76.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Estación Terminal Fontana (Fin de Línea)
      {
        id: "w2s4e1-end-station",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -80.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 12.0, y: 0.8, z: 14.0 },
        properties: { theme: "alicante" }
      },

      // Meta en el andén de la Estación Fontana
      {
        id: "w2s4e1-goal",
        type: "goal",
        position: { x: 0.0, y: 0.4, z: -83.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 2: Palmeras
  // "Hay unas palmeras gigantes, cada hoja de la palmera te hace saltar y estan
  // separadas las palmeras con hojas pon 4 palmeras y al otro lado esta la meta"
  // ---------------------------------------------------------------------------
  2: {
    id: "world-02-level-04-stage-02",
    world: 2,
    level: 4,
    stage: 2,
    name: "Palmeras",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 75,
    spawn: { x: 0.0, y: 1.5, z: 30.0 },
    objects: [
      // Muelle de lanzamiento
      {
        id: "w2s4e2-start-dock",
        type: "platform",
        position: { x: 0.0, y: 0.8, z: 30.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.8, z: 6.0 },
        properties: { theme: "alicante" }
      },

      // Mar oceánico en la base (traspasable)
      {
        id: "w2s4e2-ocean",
        type: "water",
        position: { x: 0.0, y: -1.2, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 40.0, y: 1.0, z: 76.0 },
        properties: { passable: true, hasCollision: false }
      },

      // 4 PALMERAS GIGANTES CON HOJAS ELÁSTICAS CATAPULTA (Bouncers)
      // Palmera 1
      {
        id: "w2s4e2-palm-1",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 18.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 5.0, z: 8.0 },
        properties: { variant: "giant_bouncy_palm", palmIndex: 1 }
      },
      // Hojas elásticas de la Palmera 1
      { id: "w2s4e2-leaf-1a", type: "bumper", position: { x: 0.0, y: 2.2, z: 22.0 }, rotation: { x: -0.15, y: 0, z: 0 }, scale: { x: 2.8, y: 0.5, z: 3.2 }, properties: { color: "#2e7d32", bounce: 1.6 } },
      { id: "w2s4e2-leaf-1b", type: "bumper", position: { x: 0.0, y: 3.2, z: 14.0 }, rotation: { x: 0.25, y: 0, z: 0 }, scale: { x: 2.8, y: 0.5, z: 3.2 }, properties: { color: "#43a047", bounce: 1.8 } },

      // Palmera 2 (ligeramente a la izquierda)
      {
        id: "w2s4e2-palm-2",
        type: "platform",
        position: { x: -3.5, y: 0.0, z: 6.0 },
        rotation: { x: 0, y: 0.5, z: 0 },
        scale: { x: 8.0, y: 5.5, z: 8.0 },
        properties: { variant: "giant_bouncy_palm", palmIndex: 2 }
      },
      // Hojas elásticas de la Palmera 2
      { id: "w2s4e2-leaf-2a", type: "bumper", position: { x: -2.5, y: 3.4, z: 9.5 }, rotation: { x: -0.2, y: 0.3, z: 0 }, scale: { x: 2.8, y: 0.5, z: 3.2 }, properties: { color: "#2e7d32", bounce: 1.7 } },
      { id: "w2s4e2-leaf-2b", type: "bumper", position: { x: -1.5, y: 4.2, z: 2.5 }, rotation: { x: 0.25, y: -0.3, z: 0 }, scale: { x: 2.8, y: 0.5, z: 3.2 }, properties: { color: "#43a047", bounce: 1.9 } },

      // Palmera 3 (ligeramente a la derecha)
      {
        id: "w2s4e2-palm-3",
        type: "platform",
        position: { x: 3.5, y: 0.0, z: -6.0 },
        rotation: { x: 0, y: -0.5, z: 0 },
        scale: { x: 8.0, y: 5.5, z: 8.0 },
        properties: { variant: "giant_bouncy_palm", palmIndex: 3 }
      },
      // Hojas elásticas de la Palmera 3
      { id: "w2s4e2-leaf-3a", type: "bumper", position: { x: 2.0, y: 3.8, z: -2.5 }, rotation: { x: -0.2, y: -0.3, z: 0 }, scale: { x: 2.8, y: 0.5, z: 3.2 }, properties: { color: "#2e7d32", bounce: 1.7 } },
      { id: "w2s4e2-leaf-3b", type: "bumper", position: { x: 1.0, y: 4.5, z: -9.5 }, rotation: { x: 0.25, y: 0.3, z: 0 }, scale: { x: 2.8, y: 0.5, z: 3.2 }, properties: { color: "#43a047", bounce: 1.9 } },

      // Palmera 4 (centro alineada con la meta)
      {
        id: "w2s4e2-palm-4",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -18.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 5.0, z: 8.0 },
        properties: { variant: "giant_bouncy_palm", palmIndex: 4 }
      },
      // Hojas elásticas de la Palmera 4
      { id: "w2s4e2-leaf-4a", type: "bumper", position: { x: 0.0, y: 3.6, z: -14.0 }, rotation: { x: -0.15, y: 0, z: 0 }, scale: { x: 2.8, y: 0.5, z: 3.2 }, properties: { color: "#2e7d32", bounce: 1.8 } },
      { id: "w2s4e2-leaf-4b", type: "bumper", position: { x: 0.0, y: 4.2, z: -22.0 }, rotation: { x: 0.3, y: 0, z: 0 }, scale: { x: 2.8, y: 0.5, z: 3.2 }, properties: { color: "#43a047", bounce: 2.0 } },

      // Isla oasis de llegada al otro lado
      {
        id: "w2s4e2-goal-island",
        type: "platform",
        position: { x: 0.0, y: 1.0, z: -30.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 12.0, y: 0.8, z: 8.0 },
        properties: { theme: "alicante" }
      },

      // 10 Coleccionables en los arcos de salto sobre las hojas
      { id: "w2s4e2-col-1", type: "collectible", position: { x: 0.0, y: 3.2, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e2-col-2", type: "collectible", position: { x: 0.0, y: 4.8, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e2-col-3", type: "collectible", position: { x: 0.0, y: 4.2, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e2-col-4", type: "collectible", position: { x: -2.0, y: 5.2, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e2-col-5", type: "collectible", position: { x: -1.0, y: 6.0, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e2-col-6", type: "collectible", position: { x: 1.0, y: 6.0, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e2-col-7", type: "collectible", position: { x: 2.0, y: 5.2, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e2-col-8", type: "collectible", position: { x: 0.0, y: 4.5, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e2-col-9", type: "collectible", position: { x: 0.0, y: 5.6, z: -22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e2-col-10", type: "collectible", position: { x: 0.0, y: 2.5, z: -28.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta en la isla oasis
      {
        id: "w2s4e2-goal",
        type: "goal",
        position: { x: 0.0, y: 1.4, z: -31.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 3: Mercadona
  // "Como la etapa centro comercial pero estilo mercadona y más grande"
  // ---------------------------------------------------------------------------
  3: {
    id: "world-02-level-04-stage-03",
    world: 2,
    level: 4,
    stage: 3,
    name: "Mercadona",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 85,
    spawn: { x: 0.0, y: 1.5, z: 22.0 },
    objects: [
      // Gran suelo de gres pulido de supermercado Mercadona (30m de ancho x 52m de largo)
      {
        id: "w2s4e3-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 30.0, y: 0.8, z: 52.0 },
        properties: { theme: "custom_color", customColor: "#eceff1" }
      },

      // Paredes perimetrales del hipermercado
      { id: "w2s4e3-wall-back", type: "platform", position: { x: 0.0, y: 2.0, z: -25.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 30.0, y: 4.0, z: 0.8 }, properties: { theme: "custom_color", customColor: "#007a3d" } },
      { id: "w2s4e3-wall-left", type: "platform", position: { x: -14.6, y: 2.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 4.0, z: 52.0 }, properties: { theme: "custom_color", customColor: "#007a3d" } },
      { id: "w2s4e3-wall-right", type: "platform", position: { x: 14.6, y: 2.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 4.0, z: 52.0 }, properties: { theme: "custom_color", customColor: "#007a3d" } },

      // Entrada con carros de la compra
      { id: "w2s4e3-carts-l", type: "platform", position: { x: -8.0, y: 0.4, z: 21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.5, y: 0.8, z: 4.0 }, properties: { variant: "shopping_carts" } },
      { id: "w2s4e3-carts-r", type: "platform", position: { x: 8.0, y: 0.4, z: 21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.5, y: 0.8, z: 4.0 }, properties: { variant: "shopping_carts" } },

      // GÓNDOLAS DE ESTANTERÍAS MERCADONA (Pasillos de productos con colores verde y amarillo)
      // Fila 1 Izquierda: Frutería y Horno
      { id: "w2s4e3-shelf-1", type: "platform", position: { x: -8.5, y: 0.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.6, y: 2.4, z: 12.0 }, properties: { variant: "mercadona_shelves", department: "fruit" } },
      // Fila 1 Centro: Pescadería y Carnicería
      { id: "w2s4e3-shelf-2", type: "platform", position: { x: 0.0, y: 0.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.6, y: 2.4, z: 12.0 }, properties: { variant: "mercadona_shelves", department: "fish" } },
      // Fila 1 Derecha: Charcutería
      { id: "w2s4e3-shelf-3", type: "platform", position: { x: 8.5, y: 0.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.6, y: 2.4, z: 12.0 }, properties: { variant: "mercadona_shelves", department: "meat" } },

      // Fila 2 Izquierda: Lácteos Hacendado
      { id: "w2s4e3-shelf-4", type: "platform", position: { x: -8.5, y: 0.4, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.6, y: 2.4, z: 12.0 }, properties: { variant: "mercadona_shelves", department: "dairy" } },
      // Fila 2 Centro: Perfumería Deliplus
      { id: "w2s4e3-shelf-5", type: "platform", position: { x: 0.0, y: 0.4, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.6, y: 2.4, z: 12.0 }, properties: { variant: "mercadona_shelves", department: "perfume" } },
      // Fila 2 Derecha: Congelados
      { id: "w2s4e3-shelf-6", type: "platform", position: { x: 8.5, y: 0.4, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.6, y: 2.4, z: 12.0 }, properties: { variant: "mercadona_shelves", department: "frozen" } },

      // 4 LÍNEAS DE CAJA REGISTRADORA MERCADONA (Checkouts)
      { id: "w2s4e3-checkout-1", type: "platform", position: { x: -7.5, y: 0.4, z: -17.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.6, y: 1.1, z: 3.8 }, properties: { variant: "supermarket_checkout" } },
      { id: "w2s4e3-checkout-2", type: "platform", position: { x: -2.5, y: 0.4, z: -17.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.6, y: 1.1, z: 3.8 }, properties: { variant: "supermarket_checkout" } },
      { id: "w2s4e3-checkout-3", type: "platform", position: { x: 2.5, y: 0.4, z: -17.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.6, y: 1.1, z: 3.8 }, properties: { variant: "supermarket_checkout" } },
      { id: "w2s4e3-checkout-4", type: "platform", position: { x: 7.5, y: 0.4, z: -17.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.6, y: 1.1, z: 3.8 }, properties: { variant: "supermarket_checkout" } },

      // 10 Coleccionables distribuidos por los pasillos y departamentos
      { id: "w2s4e3-col-1", type: "collectible", position: { x: -4.2, y: 1.2, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e3-col-2", type: "collectible", position: { x: 4.2, y: 1.2, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e3-col-3", type: "collectible", position: { x: -12.5, y: 1.2, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e3-col-4", type: "collectible", position: { x: 12.5, y: 1.2, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e3-col-5", type: "collectible", position: { x: -4.2, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e3-col-6", type: "collectible", position: { x: 4.2, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e3-col-7", type: "collectible", position: { x: -12.5, y: 1.2, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e3-col-8", type: "collectible", position: { x: 12.5, y: 1.2, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e3-col-9", type: "collectible", position: { x: -4.2, y: 1.2, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e3-col-10", type: "collectible", position: { x: 4.2, y: 1.2, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta en la plaza de salida tras las cajas
      {
        id: "w2s4e3-goal",
        type: "goal",
        position: { x: 0.0, y: 0.4, z: -22.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 4: Muro2
  // "Como la etapa Muro pero playera y mejorada"
  // Acantilado de piedra costera de 12 metros de altura con túneles de agua y
  // maquinaria de transporte móvil.
  // ---------------------------------------------------------------------------
  4: {
    id: "world-02-level-04-stage-04",
    world: 2,
    level: 4,
    stage: 4,
    name: "Muro2",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 80,
    spawn: { x: 0.0, y: 1.5, z: 12.0 },
    objects: [
      // Explanada playera de salida
      {
        id: "w2s4e4-start-plaza",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 12.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 16.0, y: 0.8, z: 10.0 },
        properties: { theme: "alicante" }
      },

      // Agua marina al pie del acantilado (traspasable)
      {
        id: "w2s4e4-sea",
        type: "water",
        position: { x: 0.0, y: -1.2, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 36.0, y: 1.0, z: 40.0 },
        properties: { passable: true, hasCollision: false }
      },

      // EL GRAN MURO COSTERO (Acantilado de arenisca con 3 compuertas circulares a nivel del mar)
      // Pilar izquierdo
      { id: "w2s4e4-wall-l", type: "platform", position: { x: -6.0, y: 4.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.4, y: 9.0, z: 2.0 }, properties: { theme: "alicante" } },
      // Pilares intermedios
      { id: "w2s4e4-wall-m1", type: "platform", position: { x: -2.0, y: 4.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 9.0, z: 2.0 }, properties: { theme: "alicante" } },
      { id: "w2s4e4-wall-m2", type: "platform", position: { x: 2.0, y: 4.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 9.0, z: 2.0 }, properties: { theme: "alicante" } },
      // Pilar derecho
      { id: "w2s4e4-wall-r", type: "platform", position: { x: 6.0, y: 4.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.4, y: 9.0, z: 2.0 }, properties: { theme: "alicante" } },
      // Dintel superior del acantilado
      { id: "w2s4e4-wall-top", type: "platform", position: { x: 0.0, y: 7.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.4, y: 3.0, z: 2.2 }, properties: { theme: "alicante" } },

      // TUBO MÓVIL MARINO DE TRANSPORTE (Shuttle abierto que viaja entre los 3 arcos)
      {
        id: "w2s4e4-pipe-shuttle",
        type: "moving-platform",
        position: { x: 0.0, y: 1.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.0, y: 3.0, z: 4.0 },
        properties: {
          isMoving: true,
          variant: "pipe_shuttle",
          movementType: "pipe_shuttle",
          customColor: "#00b4d8"
        }
      },

      // Terrazas y cornisas costeras al otro lado del muro
      { id: "w2s4e4-step-1", type: "platform", position: { x: 0.0, y: 0.0, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 12.0, y: 0.8, z: 8.0 }, properties: { theme: "alicante" } },
      { id: "w2s4e4-step-2", type: "platform", position: { x: -3.5, y: 1.8, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.0, y: 0.8, z: 5.0 }, properties: { theme: "alicante" } },
      { id: "w2s4e4-step-3", type: "platform", position: { x: 3.5, y: 3.4, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.0, y: 0.8, z: 5.0 }, properties: { theme: "alicante" } },

      // Sombrilla elástica en terraza
      { id: "w2s4e4-umb-bounce", type: "bumper", position: { x: 0.0, y: 4.8, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.5, y: 1.2, z: 2.5 }, properties: { color: "#ff3d00", bounce: 1.6 } },

      // Terraza superior del mirador
      {
        id: "w2s4e4-top-terrace",
        type: "platform",
        position: { x: 0.0, y: 6.8, z: -22.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.8, z: 8.0 },
        properties: { theme: "alicante" }
      },

      // 10 Coleccionables
      { id: "w2s4e4-col-1", type: "collectible", position: { x: -4.0, y: 1.2, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e4-col-2", type: "collectible", position: { x: 4.0, y: 1.2, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e4-col-3", type: "collectible", position: { x: 0.0, y: 1.8, z: 2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e4-col-4", type: "collectible", position: { x: 0.0, y: 1.8, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e4-col-5", type: "collectible", position: { x: -3.5, y: 1.2, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e4-col-6", type: "collectible", position: { x: 3.5, y: 1.2, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e4-col-7", type: "collectible", position: { x: -3.5, y: 3.0, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e4-col-8", type: "collectible", position: { x: 3.5, y: 4.6, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e4-col-9", type: "collectible", position: { x: 0.0, y: 6.8, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e4-col-10", type: "collectible", position: { x: 0.0, y: 8.0, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta en el mirador superior del acantilado
      {
        id: "w2s4e4-goal",
        type: "goal",
        position: { x: 0.0, y: 7.2, z: -24.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos8
  // "Parecido a Objetos 7 pero con olas que te empujan"
  // Explanada de arena y dunas con 4 rompientes de olas cinemáticas.
  // ---------------------------------------------------------------------------
  5: {
    id: "world-02-level-04-stage-05",
    world: 2,
    level: 4,
    stage: 5,
    name: "Objetos8",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 75,
    spawn: { x: 0.0, y: 1.5, z: 24.0 },
    objects: [
      // Explanada principal de arena
      {
        id: "w2s4e5-arena",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 24.0, y: 0.8, z: 56.0 },
        properties: { theme: "alicante" }
      },

      // Mar a ambos lados (traspasable)
      { id: "w2s4e5-sea-l", type: "water", position: { x: -18.0, y: -0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 1.0, z: 62.0 }, properties: { passable: true, hasCollision: false } },
      { id: "w2s4e5-sea-r", type: "water", position: { x: 18.0, y: -0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 1.0, z: 62.0 }, properties: { passable: true, hasCollision: false } },

      // 4 Olas cinemáticas transversales que barren la arena
      { id: "w2s4e5-wave-1", type: "moving-platform", position: { x: 7.0, y: 0.55, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.8, y: 0.55, z: 4.5 }, properties: { movementType: "wave_pusher", distance: 11.0, cycleTime: 3.4, theme: "custom_color", customColor: "#00b4d8" } },
      { id: "w2s4e5-wave-2", type: "moving-platform", position: { x: -7.0, y: 0.55, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.8, y: 0.55, z: 4.5 }, properties: { movementType: "wave_pusher", distance: -11.0, cycleTime: 3.8, theme: "custom_color", customColor: "#00b4d8" } },
      { id: "w2s4e5-wave-3", type: "moving-platform", position: { x: 7.0, y: 0.55, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.8, y: 0.55, z: 4.5 }, properties: { movementType: "wave_pusher", distance: 11.0, cycleTime: 3.2, theme: "custom_color", customColor: "#00b4d8" } },
      { id: "w2s4e5-wave-4", type: "moving-platform", position: { x: -7.0, y: 0.55, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.8, y: 0.55, z: 4.5 }, properties: { movementType: "wave_pusher", distance: -11.0, cycleTime: 3.6, theme: "custom_color", customColor: "#00b4d8" } },

      // Espigones / bloques de roca que ofrecen protección
      { id: "w2s4e5-rock-1", type: "platform", position: { x: 0.0, y: 0.6, z: 9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 0.6, z: 3.0 }, properties: { theme: "custom_color", customColor: "#455a64" } },
      { id: "w2s4e5-rock-2", type: "platform", position: { x: 0.0, y: 0.6, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 0.6, z: 3.0 }, properties: { theme: "custom_color", customColor: "#455a64" } },
      { id: "w2s4e5-rock-3", type: "platform", position: { x: 0.0, y: 0.6, z: -11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 0.6, z: 3.0 }, properties: { theme: "custom_color", customColor: "#455a64" } },

      // Decoración playera
      { id: "w2s4e5-palm-1", type: "decoration", position: { x: -8.0, y: 0.4, z: 20.0 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s4e5-palm-2", type: "decoration", position: { x: 8.0, y: 0.4, z: 20.0 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "palm_tree", hasCollision: true } },

      // 10 Coleccionables
      { id: "w2s4e5-col-1", type: "collectible", position: { x: -4.5, y: 1.2, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e5-col-2", type: "collectible", position: { x: 4.5, y: 1.2, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e5-col-3", type: "collectible", position: { x: 0.0, y: 1.6, z: 9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e5-col-4", type: "collectible", position: { x: -5.0, y: 1.2, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e5-col-5", type: "collectible", position: { x: 5.0, y: 1.2, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e5-col-6", type: "collectible", position: { x: 0.0, y: 1.6, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e5-col-7", type: "collectible", position: { x: -5.0, y: 1.2, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e5-col-8", type: "collectible", position: { x: 5.0, y: 1.2, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e5-col-9", type: "collectible", position: { x: 0.0, y: 1.6, z: -11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e5-col-10", type: "collectible", position: { x: 0.0, y: 1.2, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al fondo en duna elevada
      {
        id: "w2s4e5-goal",
        type: "goal",
        position: { x: 0.0, y: 0.4, z: -24.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 6: Mercado
  // "Como la etapa hippies pero del mercado de la Fontana en san juan alicante"
  // Mercadillo tradicional de verano de La Fontana con 14 puestos mediterráneos.
  // ---------------------------------------------------------------------------
  6: {
    id: "world-02-level-04-stage-06",
    world: 2,
    level: 4,
    stage: 6,
    name: "Mercado",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 85,
    spawn: { x: 0.0, y: 1.5, z: 28.0 },
    objects: [
      // Plaza central del Mercado de la Fontana
      {
        id: "w2s4e6-plaza",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 20.0, y: 0.8, z: 62.0 },
        properties: { theme: "alicante" }
      },

      // 14 PUESTOS DEL MERCADO DE LA FONTANA (7 a cada lado)
      // Izquierda (x = -7.0, rotY = Math.PI / 2)
      { id: "w2s4e6-stall-01", type: "platform", position: { x: -7.0, y: 0.4, z: 22.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "market_stall", stallType: "fruit", customColor: "#0288d1" } },
      { id: "w2s4e6-stall-02", type: "platform", position: { x: -7.0, y: 0.4, z: 15.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "market_stall", stallType: "pottery", customColor: "#d84315" } },
      { id: "w2s4e6-stall-03", type: "platform", position: { x: -7.0, y: 0.4, z: 8.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "market_stall", stallType: "textile", customColor: "#388e3c" } },
      { id: "w2s4e6-stall-04", type: "platform", position: { x: -7.0, y: 0.4, z: 1.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "market_stall", stallType: "hats", customColor: "#fbc02d" } },
      { id: "w2s4e6-stall-05", type: "platform", position: { x: -7.0, y: 0.4, z: -6.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "market_stall", stallType: "turron", customColor: "#8d6e63" } },
      { id: "w2s4e6-stall-06", type: "platform", position: { x: -7.0, y: 0.4, z: -13.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "market_stall", stallType: "fruit", customColor: "#7b1fa2" } },
      { id: "w2s4e6-stall-07", type: "platform", position: { x: -7.0, y: 0.4, z: -20.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "market_stall", stallType: "pottery", customColor: "#00897b" } },

      // Derecha (x = 7.0, rotY = -Math.PI / 2)
      { id: "w2s4e6-stall-08", type: "platform", position: { x: 7.0, y: 0.4, z: 22.0 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "market_stall", stallType: "textile", customColor: "#e53935" } },
      { id: "w2s4e6-stall-09", type: "platform", position: { x: 7.0, y: 0.4, z: 15.0 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "market_stall", stallType: "hats", customColor: "#00acc1" } },
      { id: "w2s4e6-stall-10", type: "platform", position: { x: 7.0, y: 0.4, z: 8.0 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "market_stall", stallType: "turron", customColor: "#fb8c00" } },
      { id: "w2s4e6-stall-11", type: "platform", position: { x: 7.0, y: 0.4, z: 1.0 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "market_stall", stallType: "fruit", customColor: "#43a047" } },
      { id: "w2s4e6-stall-12", type: "platform", position: { x: 7.0, y: 0.4, z: -6.0 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "market_stall", stallType: "pottery", customColor: "#c2185b" } },
      { id: "w2s4e6-stall-13", type: "platform", position: { x: 7.0, y: 0.4, z: -13.0 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "market_stall", stallType: "textile", customColor: "#3949ab" } },
      { id: "w2s4e6-stall-14", type: "platform", position: { x: 7.0, y: 0.4, z: -20.0 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "market_stall", stallType: "hats", customColor: "#00838f" } },

      // Fuente central ornamental de La Fontana
      {
        id: "w2s4e6-fountain",
        type: "platform",
        position: { x: 0.0, y: 0.4, z: 1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.5, y: 0.8, z: 4.5 },
        properties: { theme: "alicante", shape: "cylinder" }
      },

      // 10 Coleccionables
      { id: "w2s4e6-col-1", type: "collectible", position: { x: -2.5, y: 1.2, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e6-col-2", type: "collectible", position: { x: 2.5, y: 1.2, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e6-col-3", type: "collectible", position: { x: -2.5, y: 1.2, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e6-col-4", type: "collectible", position: { x: 2.5, y: 1.2, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e6-col-5", type: "collectible", position: { x: 0.0, y: 1.6, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }, // En la fuente
      { id: "w2s4e6-col-6", type: "collectible", position: { x: -2.5, y: 1.2, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e6-col-7", type: "collectible", position: { x: 2.5, y: 1.2, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e6-col-8", type: "collectible", position: { x: -2.5, y: 1.2, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e6-col-9", type: "collectible", position: { x: 2.5, y: 1.2, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e6-col-10", type: "collectible", position: { x: 0.0, y: 1.2, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al fondo de la plaza de La Fontana
      {
        id: "w2s4e6-goal",
        type: "goal",
        position: { x: 0.0, y: 0.4, z: -26.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 7: Bazar
  // "Un laberinto con pasillos de un bazar"
  // Laberinto de estanterías abarrotadas de alfombras, lámparas, juguetes y recuerdos.
  // ---------------------------------------------------------------------------
  7: {
    id: "world-02-level-04-stage-07",
    world: 2,
    level: 4,
    stage: 7,
    name: "Bazar",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 90,
    spawn: { x: -9.0, y: 1.5, z: 20.0 },
    objects: [
      // Suelo del bazar (24m x 44m)
      {
        id: "w2s4e7-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 24.0, y: 0.8, z: 46.0 },
        properties: { theme: "custom_color", customColor: "#fff8e1" }
      },

      // Muros perimetrales del bazar
      { id: "w2s4e7-wall-n", type: "platform", position: { x: 0.0, y: 1.8, z: -22.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 24.0, y: 3.6, z: 0.8 }, properties: { theme: "custom_color", customColor: "#d84315" } },
      { id: "w2s4e7-wall-s", type: "platform", position: { x: 0.0, y: 1.8, z: 22.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 24.0, y: 3.6, z: 0.8 }, properties: { theme: "custom_color", customColor: "#d84315" } },
      { id: "w2s4e7-wall-w", type: "platform", position: { x: -11.6, y: 1.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 3.6, z: 46.0 }, properties: { theme: "custom_color", customColor: "#d84315" } },
      { id: "w2s4e7-wall-e", type: "platform", position: { x: 11.6, y: 1.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 3.6, z: 46.0 }, properties: { theme: "custom_color", customColor: "#d84315" } },

      // ESTANTERÍAS ALTAS QUE FORMAN EL LABERINTO DEL BAZAR
      // Pasillo Entrada
      { id: "w2s4e7-bazar-01", type: "platform", position: { x: -5.0, y: 0.4, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 2.8, z: 12.0 }, properties: { variant: "bazar_shelves" } },
      { id: "w2s4e7-bazar-02", type: "platform", position: { x: 1.0, y: 0.4, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 2.8, z: 6.0 }, properties: { variant: "bazar_shelves" } },
      { id: "w2s4e7-bazar-03", type: "platform", position: { x: 7.0, y: 0.4, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 2.8, z: 16.0 }, properties: { variant: "bazar_shelves" } },

      // Tabiques transversales del laberinto
      { id: "w2s4e7-bazar-04", type: "platform", position: { x: -8.0, y: 0.4, z: 7.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 1.6, y: 2.8, z: 6.0 }, properties: { variant: "bazar_shelves" } },
      { id: "w2s4e7-bazar-05", type: "platform", position: { x: -1.0, y: 0.4, z: 8.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 1.6, y: 2.8, z: 6.0 }, properties: { variant: "bazar_shelves" } },
      { id: "w2s4e7-bazar-06", type: "platform", position: { x: 4.0, y: 0.4, z: 3.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 1.6, y: 2.8, z: 6.0 }, properties: { variant: "bazar_shelves" } },

      // Zona central del laberinto
      { id: "w2s4e7-bazar-07", type: "platform", position: { x: -6.0, y: 0.4, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 2.8, z: 14.0 }, properties: { variant: "bazar_shelves" } },
      { id: "w2s4e7-bazar-08", type: "platform", position: { x: 0.0, y: 0.4, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 2.8, z: 12.0 }, properties: { variant: "bazar_shelves" } },
      { id: "w2s4e7-bazar-09", type: "platform", position: { x: 6.0, y: 0.4, z: -7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 2.8, z: 12.0 }, properties: { variant: "bazar_shelves" } },

      // Pasillos de salida hacia la meta
      { id: "w2s4e7-bazar-10", type: "platform", position: { x: -2.0, y: 0.4, z: -14.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 1.6, y: 2.8, z: 8.0 }, properties: { variant: "bazar_shelves" } },
      { id: "w2s4e7-bazar-11", type: "platform", position: { x: 4.0, y: 0.4, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 2.8, z: 8.0 }, properties: { variant: "bazar_shelves" } },

      // 10 Coleccionables en los recovecos y callejones sin salida del laberinto
      { id: "w2s4e7-col-1", type: "collectible", position: { x: -9.0, y: 1.2, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e7-col-2", type: "collectible", position: { x: -2.0, y: 1.2, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e7-col-3", type: "collectible", position: { x: 4.0, y: 1.2, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e7-col-4", type: "collectible", position: { x: 9.0, y: 1.2, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e7-col-5", type: "collectible", position: { x: 3.0, y: 1.2, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e7-col-6", type: "collectible", position: { x: -9.0, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e7-col-7", type: "collectible", position: { x: -3.0, y: 1.2, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e7-col-8", type: "collectible", position: { x: 3.0, y: 1.2, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e7-col-9", type: "collectible", position: { x: 9.0, y: 1.2, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e7-col-10", type: "collectible", position: { x: -6.0, y: 1.2, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta en el mostrador de salida del bazar
      {
        id: "w2s4e7-goal",
        type: "goal",
        position: { x: 0.0, y: 0.4, z: -19.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 8: Ropa
  // "Unos tendederos con ropa que al pasarla tienen fisicas como tela y no te
  // deja ver si hay un agujero al atravesarla o no todo recto y que haya 6 tendederos"
  // ---------------------------------------------------------------------------
  8: {
    id: "world-02-level-04-stage-08",
    world: 2,
    level: 4,
    stage: 8,
    name: "Ropa",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 75,
    spawn: { x: 0.0, y: 1.5, z: 27.0 },
    objects: [
      // Pasarela de azotea recta con huecos estratégicos
      // Tramo 1 (Antes del tendedero 1 y 2)
      { id: "w2s4e8-floor-1", type: "platform", position: { x: 0.0, y: 0.0, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.2, y: 0.8, z: 14.0 }, properties: { theme: "alicante" } },
      // HUECO 1 detrás del tendedero 2 (z = 11.0 a 8.5) -> Tramo con hueco central y paso estrecho por los laterales
      { id: "w2s4e8-bridge-2l", type: "platform", position: { x: -2.2, y: 0.0, z: 9.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.8, y: 0.8, z: 4.0 }, properties: { theme: "alicante" } },
      { id: "w2s4e8-bridge-2r", type: "platform", position: { x: 2.2, y: 0.0, z: 9.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.8, y: 0.8, z: 4.0 }, properties: { theme: "alicante" } },

      // Tramo 2 (Entre tendedero 2 y 3)
      { id: "w2s4e8-floor-2", type: "platform", position: { x: 0.0, y: 0.0, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.2, y: 0.8, z: 7.5 }, properties: { theme: "alicante" } },

      // HUECO 2 detrás del tendedero 4 (z = -3.5 a -6.5) -> Paso sólo por el centro (estrecho 2.0m)
      { id: "w2s4e8-bridge-4c", type: "platform", position: { x: 0.0, y: 0.0, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.2, y: 0.8, z: 4.5 }, properties: { theme: "alicante" } },

      // Tramo 3 (Entre tendedero 4 y 5)
      { id: "w2s4e8-floor-3", type: "platform", position: { x: 0.0, y: 0.0, z: -10.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.2, y: 0.8, z: 6.5 }, properties: { theme: "alicante" } },

      // HUECO 3 detrás del tendedero 5 (z = -15.0 a -18.0) -> Paso zig-zag a la derecha
      { id: "w2s4e8-bridge-5r", type: "platform", position: { x: 1.8, y: 0.0, z: -16.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.5, y: 0.8, z: 5.5 }, properties: { theme: "alicante" } },

      // Tramo Final (Tendedero 6 y llegada)
      { id: "w2s4e8-floor-4", type: "platform", position: { x: 0.0, y: 0.0, z: -24.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.0, y: 0.8, z: 10.5 }, properties: { theme: "alicante" } },

      // Muros laterales blancos de azotea
      { id: "w2s4e8-wall-l", type: "platform", position: { x: -3.3, y: 1.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 2.0, z: 58.0 }, properties: { theme: "custom_color", customColor: "#f5f5f5" } },
      { id: "w2s4e8-wall-r", type: "platform", position: { x: 3.3, y: 1.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 2.0, z: 58.0 }, properties: { theme: "custom_color", customColor: "#f5f5f5" } },

      // 6 TENDEDEROS CON ROPA COLGADA (Sábanas, camisetas y toallas con simulación de tela)
      { id: "w2s4e8-line-1", type: "platform", position: { x: 0.0, y: 0.4, z: 19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.2, y: 2.4, z: 0.6 }, properties: { variant: "clothesline", lineIndex: 1, clothColor: "#ffffff" } },
      { id: "w2s4e8-line-2", type: "platform", position: { x: 0.0, y: 0.4, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.2, y: 2.4, z: 0.6 }, properties: { variant: "clothesline", lineIndex: 2, clothColor: "#0288d1" } },
      { id: "w2s4e8-line-3", type: "platform", position: { x: 0.0, y: 0.4, z: 3.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.2, y: 2.4, z: 0.6 }, properties: { variant: "clothesline", lineIndex: 3, clothColor: "#e91e63" } },
      { id: "w2s4e8-line-4", type: "platform", position: { x: 0.0, y: 0.4, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.2, y: 2.4, z: 0.6 }, properties: { variant: "clothesline", lineIndex: 4, clothColor: "#fdd835" } },
      { id: "w2s4e8-line-5", type: "platform", position: { x: 0.0, y: 0.4, z: -13.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.2, y: 2.4, z: 0.6 }, properties: { variant: "clothesline", lineIndex: 5, clothColor: "#43a047" } },
      { id: "w2s4e8-line-6", type: "platform", position: { x: 0.0, y: 0.4, z: -20.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.2, y: 2.4, z: 0.6 }, properties: { variant: "clothesline", lineIndex: 6, clothColor: "#7e57c2" } },

      // 10 Coleccionables
      { id: "w2s4e8-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 23.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e8-col-2", type: "collectible", position: { x: -1.5, y: 1.2, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e8-col-3", type: "collectible", position: { x: 1.5, y: 1.2, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e8-col-4", type: "collectible", position: { x: -2.0, y: 1.2, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e8-col-5", type: "collectible", position: { x: 0.0, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e8-col-6", type: "collectible", position: { x: 0.0, y: 1.2, z: -7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e8-col-7", type: "collectible", position: { x: 1.8, y: 1.2, z: -15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e8-col-8", type: "collectible", position: { x: -1.5, y: 1.2, z: -19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e8-col-9", type: "collectible", position: { x: 1.5, y: 1.2, z: -19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e8-col-10", type: "collectible", position: { x: 0.0, y: 1.2, z: -25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al final de la terraza de la azotea
      {
        id: "w2s4e8-goal",
        type: "goal",
        position: { x: 0.0, y: 0.4, z: -28.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 9: Popeye
  // "Una pizza gigante y de fondo un cartel de pizzeria popeye de San Juan
  // Alicante, la pizza está troceada en 8 trozos que suben y bajan verticalemente
  // mientras gira sobre si misma y la meta esta al final por encima."
  // ---------------------------------------------------------------------------
  9: {
    id: "world-02-level-04-stage-09",
    world: 2,
    level: 4,
    stage: 9,
    name: "Popeye",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 85,
    spawn: { x: 0.0, y: 2.2, z: 13.0 },
    objects: [
      // Plataforma de entrada del restaurante
      {
        id: "w2s4e9-entry-terrace",
        type: "platform",
        position: { x: 0.0, y: 1.0, z: 13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.5, y: 0.8, z: 5.0 },
        properties: { theme: "alicante" }
      },

      // Gran mar o abismo debajo de la pizza (traspasable)
      {
        id: "w2s4e9-sea",
        type: "water",
        position: { x: 0.0, y: -1.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 38.0, y: 1.0, z: 46.0 },
        properties: { passable: true, hasCollision: false }
      },

      // LA PIZZA GIGANTE DE 8 TROZOS EN ROTACIÓN Y ONDULACIÓN VERTICAL
      {
        id: "w2s4e9-giant-pizza",
        type: "moving-platform",
        position: { x: 0.0, y: 0.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 16.0, y: 0.8, z: 16.0 },
        properties: {
          variant: "popeye_pizza",
          movementType: "popeye_pizza",
          radius: 8.0,
          rotSpeed: 0.45,
          waveAmplitude: 0.65,
          waveSpeed: 2.2
        }
      },

      // CARTEL ILUMINADO RETRO "PIZZERÍA POPEYE - SAN JUAN ALICANTE" DE FONDO
      {
        id: "w2s4e9-billboard",
        type: "platform",
        position: { x: 0.0, y: 5.5, z: -14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 14.0, y: 4.8, z: 0.8 },
        properties: { variant: "popeye_billboard" }
      },

      // Balcón elevado del horno de piedra donde está la Meta
      {
        id: "w2s4e9-oven-balcony",
        type: "platform",
        position: { x: 0.0, y: 2.4, z: -11.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.8, z: 5.0 },
        properties: { theme: "custom_color", customColor: "#b71c1c" }
      },

      // 10 Coleccionables repartidos sobre los trozos de pizza
      { id: "w2s4e9-col-1", type: "collectible", position: { x: 0.0, y: 2.0, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e9-col-2", type: "collectible", position: { x: -3.2, y: 2.0, z: 3.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e9-col-3", type: "collectible", position: { x: 3.2, y: 2.0, z: 3.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e9-col-4", type: "collectible", position: { x: -5.0, y: 2.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e9-col-5", type: "collectible", position: { x: 5.0, y: 2.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e9-col-6", type: "collectible", position: { x: -3.2, y: 2.0, z: -3.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e9-col-7", type: "collectible", position: { x: 3.2, y: 2.0, z: -3.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e9-col-8", type: "collectible", position: { x: 0.0, y: 2.0, z: -4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e9-col-9", type: "collectible", position: { x: -1.8, y: 2.8, z: -9.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e9-col-10", type: "collectible", position: { x: 1.8, y: 2.8, z: -9.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta elevada en el balcón del horno
      {
        id: "w2s4e9-goal",
        type: "goal",
        position: { x: 0.0, y: 2.8, z: -12.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 10: Helado
  // "Un helado con cucurucho de Stragiatella el cual es gigante y debes ir
  // subiendolo por los bordes poco a poco hasta la punta que esta la meta"
  // ---------------------------------------------------------------------------
  10: {
    id: "world-02-level-04-stage-10",
    world: 2,
    level: 4,
    stage: 10,
    name: "Helado",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 90,
    spawn: { x: 0.0, y: 1.5, z: 13.0 },
    objects: [
      // Terraza de salida al pie del helado
      {
        id: "w2s4e10-start-patio",
        type: "platform",
        position: { x: 0.0, y: 0.4, z: 13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.8, z: 6.0 },
        properties: { theme: "alicante" }
      },

      // Mar oceánico en la base (traspasable)
      {
        id: "w2s4e10-sea",
        type: "water",
        position: { x: 0.0, y: -1.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 42.0, y: 1.0, z: 42.0 },
        properties: { passable: true, hasCollision: false }
      },

      // MONUMENTO 3D: CUCURUCHO GIGANTE DE STRACCIATELLA
      {
        id: "w2s4e10-icecream-monument",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 16.0, y: 16.0, z: 16.0 },
        properties: { variant: "stracciatella_cone", coneHeight: 10.0, scoopRadius: 4.8 }
      },

      // RAMPA ESPIRAL HELICOIDAL ASCENDENTE (Rodea el cucurucho y la bola de Stracciatella)
      // Nivel 1: Base del cucurucho (y: 1.2 a 3.5, radio ~7.2)
      { id: "w2s4e10-ramp-1", type: "ramp", position: { x: 5.2, y: 1.6, z: 6.0 }, rotation: { x: 0.18, y: -0.8, z: 0.1 }, scale: { x: 3.2, y: 0.5, z: 6.0 }, properties: { theme: "custom_color", customColor: "#d7ccc8" } },
      { id: "w2s4e10-ramp-2", type: "ramp", position: { x: 6.8, y: 2.8, z: -0.5 }, rotation: { x: 0.18, y: -1.6, z: 0.1 }, scale: { x: 3.2, y: 0.5, z: 6.0 }, properties: { theme: "custom_color", customColor: "#d7ccc8" } },
      { id: "w2s4e10-ramp-3", type: "ramp", position: { x: 4.8, y: 4.2, z: -6.2 }, rotation: { x: 0.18, y: -2.4, z: 0.1 }, scale: { x: 3.2, y: 0.5, z: 6.0 }, properties: { theme: "custom_color", customColor: "#d7ccc8" } },

      // Nivel 2: Media altura del cucurucho (y: 5.6 a 8.5, radio ~5.8)
      { id: "w2s4e10-ramp-4", type: "ramp", position: { x: -1.5, y: 5.6, z: -6.5 }, rotation: { x: 0.18, y: -3.14, z: 0.1 }, scale: { x: 3.0, y: 0.5, z: 5.5 }, properties: { theme: "custom_color", customColor: "#d7ccc8" } },
      { id: "w2s4e10-ramp-5", type: "ramp", position: { x: -5.8, y: 7.0, z: -2.0 }, rotation: { x: 0.18, y: 2.4, z: 0.1 }, scale: { x: 3.0, y: 0.5, z: 5.5 }, properties: { theme: "custom_color", customColor: "#d7ccc8" } },
      { id: "w2s4e10-ramp-6", type: "ramp", position: { x: -5.5, y: 8.4, z: 4.0 }, rotation: { x: 0.18, y: 1.6, z: 0.1 }, scale: { x: 3.0, y: 0.5, z: 5.5 }, properties: { theme: "custom_color", customColor: "#d7ccc8" } },

      // Nivel 3: Borde de la bola de helado Stracciatella (y: 9.8 a 13.5, radio ~4.2)
      { id: "w2s4e10-ramp-7", type: "ramp", position: { x: -0.5, y: 9.8, z: 5.2 }, rotation: { x: 0.22, y: 0.8, z: 0.1 }, scale: { x: 2.8, y: 0.5, z: 5.0 }, properties: { theme: "custom_color", customColor: "#f5f5f5" } },
      { id: "w2s4e10-ramp-8", type: "ramp", position: { x: 4.0, y: 11.2, z: 2.2 }, rotation: { x: 0.22, y: 0.0, z: 0.1 }, scale: { x: 2.6, y: 0.5, z: 4.8 }, properties: { theme: "custom_color", customColor: "#f5f5f5" } },
      { id: "w2s4e10-ramp-9", type: "ramp", position: { x: 3.2, y: 12.6, z: -2.8 }, rotation: { x: 0.22, y: -0.8, z: 0.1 }, scale: { x: 2.4, y: 0.5, z: 4.5 }, properties: { theme: "custom_color", customColor: "#f5f5f5" } },
      { id: "w2s4e10-ramp-10", type: "ramp", position: { x: -1.2, y: 14.0, z: -3.0 }, rotation: { x: 0.22, y: -1.8, z: 0.1 }, scale: { x: 2.4, y: 0.5, z: 4.2 }, properties: { theme: "custom_color", customColor: "#f5f5f5" } },

      // Cúpula superior y terraza de la guinda (y = 15.2, x = 0, z = 0)
      {
        id: "w2s4e10-apex-cherry",
        type: "platform",
        position: { x: 0.0, y: 15.2, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.6, y: 0.8, z: 3.6 },
        properties: { theme: "custom_color", customColor: "#d50000", shape: "cylinder" }
      },

      // 10 Coleccionables siguiendo la espiral ascendente
      { id: "w2s4e10-col-1", type: "collectible", position: { x: 2.5, y: 2.0, z: 9.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e10-col-2", type: "collectible", position: { x: 5.5, y: 2.6, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e10-col-3", type: "collectible", position: { x: 6.8, y: 3.8, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e10-col-4", type: "collectible", position: { x: 3.5, y: 5.2, z: -6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e10-col-5", type: "collectible", position: { x: -3.5, y: 6.8, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e10-col-6", type: "collectible", position: { x: -5.8, y: 8.2, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e10-col-7", type: "collectible", position: { x: -3.5, y: 9.6, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e10-col-8", type: "collectible", position: { x: 2.8, y: 11.2, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e10-col-9", type: "collectible", position: { x: 3.0, y: 12.8, z: -1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4e10-col-10", type: "collectible", position: { x: 0.0, y: 14.8, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta en la punta superior del helado sobre la guinda
      {
        id: "w2s4e10-goal",
        type: "goal",
        position: { x: 0.0, y: 16.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  }
};

// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('2_4_')) Object.assign(WORLD_02_LEVEL_04_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(2,4,WORLD_02_LEVEL_04_STAGES);

