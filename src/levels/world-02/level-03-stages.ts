import publishedEditorStages from '../editor-saved/world-02.json';
import {registerStageSet} from '../StageRegistry';
import type { LevelData } from "../LevelTypes";

export const WORLD_02_LEVEL_03_STAGES: Record<number, LevelData> = {
  // ---------------------------------------------------------------------------
  // ETAPA 1: Kiosko
  // "Una plataforma rectangular, con un kiosko de frente con objetos como tenia
  // la Etapa Mercadillo o Centro Comercial"
  // ---------------------------------------------------------------------------
  1: {
    id: "world-02-level-03-stage-01",
    world: 2,
    level: 3,
    stage: 1,
    name: "Kiosko",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 18.0 },
    objects: [
      // Paseo marítimo de entrada
      {
        id: "w2s1-boardwalk",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.8, z: 42.0 },
        properties: { theme: "alicante" }
      },

      // Agua marina a ambos lados (traspasable)
      {
        id: "w2s1-sea-l",
        type: "water",
        position: { x: -16.0, y: -0.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 20.0, y: 1.0, z: 50.0 },
        properties: { passable: true, hasCollision: false }
      },
      {
        id: "w2s1-sea-r",
        type: "water",
        position: { x: 16.0, y: -0.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 20.0, y: 1.0, z: 50.0 },
        properties: { passable: true, hasCollision: false }
      },

      // 3D Kiosko de Playa / Chiringuito del Sol
      {
        id: "w2s1-kiosk",
        type: "platform",
        position: { x: 0.0, y: 0.4, z: -12.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.4, y: 0.8, z: 4.8 },
        properties: {
          variant: "beach_kiosk",
          customColor: "#00b4d8",
          stripeColor: "#ffffff"
        }
      },

      // Decoración playera: palmeras, sombrillas y tumbonas
      { id: "w2s1-palm-1", type: "decoration", position: { x: -3.8, y: 0.4, z: 14.0 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s1-palm-2", type: "decoration", position: { x: 3.8, y: 0.4, z: 14.0 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s1-umb-1", type: "decoration", position: { x: -3.6, y: 0.4, z: 6.0 }, rotation: { x: 0, y: 0.2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "beach_umbrella", hasCollision: true } },
      { id: "w2s1-umb-2", type: "decoration", position: { x: 3.6, y: 0.4, z: 6.0 }, rotation: { x: 0, y: -0.2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "beach_umbrella", hasCollision: true } },
      { id: "w2s1-sunbed-1", type: "decoration", position: { x: -3.6, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0.3, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "sunbed", hasCollision: true } },
      { id: "w2s1-sunbed-2", type: "decoration", position: { x: 3.6, y: 0.4, z: 0.0 }, rotation: { x: 0, y: -0.3, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "sunbed", hasCollision: true } },

      // 10 Coleccionables
      { id: "w2s1-col-1", type: "collectible", position: { x: -2.0, y: 1.2, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-2", type: "collectible", position: { x: 2.0, y: 1.2, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-3", type: "collectible", position: { x: 0.0, y: 1.2, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-4", type: "collectible", position: { x: -2.5, y: 1.2, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-5", type: "collectible", position: { x: 2.5, y: 1.2, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-6", type: "collectible", position: { x: 0.0, y: 1.2, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-7", type: "collectible", position: { x: -2.2, y: 1.2, z: -9.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-8", type: "collectible", position: { x: 2.2, y: 1.2, z: -9.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-9", type: "collectible", position: { x: -1.5, y: 1.2, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s1-col-10", type: "collectible", position: { x: 1.5, y: 1.2, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta detrás del kiosko en mirador panorámico
      {
        id: "w2s1-goal",
        type: "goal",
        position: { x: 0.0, y: 0.4, z: -18.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 2: Bajada
  // "Una bajada curvada que cada vez tiene más inclinación"
  // ---------------------------------------------------------------------------
  2: {
    id: "world-02-level-03-stage-02",
    world: 2,
    level: 3,
    stage: 2,
    name: "Bajada",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 13.5, z: 24.0 },
    objects: [
      // Plataforma superior de lanzamiento
      {
        id: "w2s2-start-dune",
        type: "platform",
        position: { x: 0.0, y: 12.0, z: 24.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.8, z: 8.0 },
        properties: { theme: "alicante" }
      },

      // Bajada en 5 tramos curvos progresivamente más inclinados
      // Tramo 1 (inclinación suave ~8°)
      {
        id: "w2s2-ramp-1",
        type: "ramp",
        position: { x: 0.0, y: 11.0, z: 16.5 },
        rotation: { x: 0.14, y: 0.0, z: 0.0 },
        scale: { x: 6.0, y: 0.8, z: 8.0 },
        properties: { theme: "alicante" }
      },
      // Tramo 2 (inclinación media ~16° curvando a la derecha)
      {
        id: "w2s2-ramp-2",
        type: "ramp",
        position: { x: 1.5, y: 8.8, z: 9.0 },
        rotation: { x: 0.28, y: 0.2, z: -0.05 },
        scale: { x: 6.0, y: 0.8, z: 8.0 },
        properties: { theme: "alicante" }
      },
      // Tramo 3 (inclinación fuerte ~24° curva pronunciada)
      {
        id: "w2s2-ramp-3",
        type: "ramp",
        position: { x: 4.5, y: 6.0, z: 1.5 },
        rotation: { x: 0.42, y: 0.35, z: -0.08 },
        scale: { x: 6.0, y: 0.8, z: 8.5 },
        properties: { theme: "alicante" }
      },
      // Tramo 4 (inclinación vertiginosa ~32° descenso empinado)
      {
        id: "w2s2-ramp-4",
        type: "ramp",
        position: { x: 7.5, y: 2.6, z: -6.5 },
        rotation: { x: 0.56, y: 0.22, z: -0.06 },
        scale: { x: 6.0, y: 0.8, z: 9.0 },
        properties: { theme: "alicante" }
      },
      // Tramo 5 (salida y transición a nivel de playa ~14°)
      {
        id: "w2s2-ramp-5",
        type: "ramp",
        position: { x: 6.5, y: 0.5, z: -15.0 },
        rotation: { x: 0.24, y: 0.0, z: 0.0 },
        scale: { x: 6.5, y: 0.8, z: 9.0 },
        properties: { theme: "alicante" }
      },

      // Peraltes exteriores protectores en las curvas
      { id: "w2s2-curb-1", type: "platform", position: { x: -3.2, y: 11.5, z: 16.5 }, rotation: { x: 0.14, y: 0.0, z: 0.0 }, scale: { x: 0.4, y: 0.6, z: 8.0 }, properties: { theme: "custom_color", customColor: "#006064" } },
      { id: "w2s2-curb-2", type: "platform", position: { x: -1.7, y: 9.3, z: 9.0 }, rotation: { x: 0.28, y: 0.2, z: -0.05 }, scale: { x: 0.4, y: 0.6, z: 8.0 }, properties: { theme: "custom_color", customColor: "#006064" } },
      { id: "w2s2-curb-3", type: "platform", position: { x: 1.2, y: 6.5, z: 1.5 }, rotation: { x: 0.42, y: 0.35, z: -0.08 }, scale: { x: 0.4, y: 0.6, z: 8.5 }, properties: { theme: "custom_color", customColor: "#006064" } },
      { id: "w2s2-curb-4", type: "platform", position: { x: 10.8, y: 3.1, z: -6.5 }, rotation: { x: 0.56, y: 0.22, z: -0.06 }, scale: { x: 0.4, y: 0.6, z: 9.0 }, properties: { theme: "custom_color", customColor: "#006064" } },

      // Plaza de llegada en la orilla
      {
        id: "w2s2-landing-plaza",
        type: "platform",
        position: { x: 5.0, y: 0.0, z: -23.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 14.0, y: 0.8, z: 12.0 },
        properties: { theme: "alicante" }
      },

      // Mar oceánico en la base (traspasable)
      {
        id: "w2s2-sea",
        type: "water",
        position: { x: 5.0, y: -1.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 42.0, y: 1.0, z: 64.0 },
        properties: { passable: true, hasCollision: false }
      },

      // 10 Coleccionables siguiendo el peralte de la bajada
      { id: "w2s2-col-1", type: "collectible", position: { x: 0.0, y: 12.0, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-2", type: "collectible", position: { x: 0.0, y: 11.2, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-3", type: "collectible", position: { x: 1.2, y: 9.8, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-4", type: "collectible", position: { x: 2.5, y: 8.6, z: 6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-5", type: "collectible", position: { x: 4.2, y: 7.0, z: 2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-6", type: "collectible", position: { x: 5.8, y: 5.2, z: -1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-7", type: "collectible", position: { x: 7.2, y: 3.5, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-8", type: "collectible", position: { x: 7.2, y: 1.8, z: -11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-9", type: "collectible", position: { x: 6.0, y: 1.0, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s2-col-10", type: "collectible", position: { x: 5.0, y: 1.0, z: -21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta en la plaza de llegada
      {
        id: "w2s2-goal",
        type: "goal",
        position: { x: 5.0, y: 0.4, z: -26.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 3: Correr2
  // "Como Correr1 pero playera y mejorada"
  // ---------------------------------------------------------------------------
  3: {
    id: "world-02-level-03-stage-03",
    world: 2,
    level: 3,
    stage: 3,
    name: "Correr2",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 32.0 },
    objects: [
      // Gran pista de sprint playero (72 metros de longitud)
      {
        id: "w2s3-sprint-track",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.4, y: 0.8, z: 72.0 },
        properties: { theme: "custom_color", customColor: "#ffcc80" }
      },

      // Faldones / bordillos protectores a ambos lados
      { id: "w2s3-curb-l", type: "platform", position: { x: -3.2, y: 0.55, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 72.0 }, properties: { theme: "custom_color", customColor: "#006064" } },
      { id: "w2s3-curb-r", type: "platform", position: { x: 3.2, y: 0.55, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 72.0 }, properties: { theme: "custom_color", customColor: "#006064" } },

      // Minirampas de velocidad / saltos de adrenalina sobre la pista
      { id: "w2s3-hump-1a", type: "ramp", position: { x: 0.0, y: 0.6, z: 17.5 }, rotation: { x: 0.18, y: 0, z: 0 }, scale: { x: 5.6, y: 0.4, z: 3.2 }, properties: { theme: "alicante" } },
      { id: "w2s3-hump-1b", type: "ramp", position: { x: 0.0, y: 0.6, z: 14.5 }, rotation: { x: -0.18, y: 0, z: 0 }, scale: { x: 5.6, y: 0.4, z: 3.2 }, properties: { theme: "alicante" } },

      { id: "w2s3-hump-2a", type: "ramp", position: { x: 0.0, y: 0.6, z: -6.5 }, rotation: { x: 0.18, y: 0, z: 0 }, scale: { x: 5.6, y: 0.4, z: 3.2 }, properties: { theme: "alicante" } },
      { id: "w2s3-hump-2b", type: "ramp", position: { x: 0.0, y: 0.6, z: -9.5 }, rotation: { x: -0.18, y: 0, z: 0 }, scale: { x: 5.6, y: 0.4, z: 3.2 }, properties: { theme: "alicante" } },

      // Parachoques boyas marinas
      { id: "w2s3-bumper-1", type: "bumper", position: { x: -2.0, y: 0.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.4, y: 1.4, z: 1.4 }, properties: { color: "#ff3d00", bounce: 1.2 } },
      { id: "w2s3-bumper-2", type: "bumper", position: { x: 2.0, y: 0.8, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.4, y: 1.4, z: 1.4 }, properties: { color: "#00e5ff", bounce: 1.2 } },

      // Palmeras costeras bordeando el sprint
      { id: "w2s3-palm-1", type: "decoration", position: { x: -4.5, y: 0.4, z: 24.0 }, rotation: { x: 0, y: 0.4, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s3-palm-2", type: "decoration", position: { x: 4.5, y: 0.4, z: 24.0 }, rotation: { x: 0, y: -0.4, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s3-palm-3", type: "decoration", position: { x: -4.5, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0.6, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s3-palm-4", type: "decoration", position: { x: 4.5, y: 0.4, z: 0.0 }, rotation: { x: 0, y: -0.6, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s3-palm-5", type: "decoration", position: { x: -4.5, y: 0.4, z: -24.0 }, rotation: { x: 0, y: 0.2, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s3-palm-6", type: "decoration", position: { x: 4.5, y: 0.4, z: -24.0 }, rotation: { x: 0, y: -0.2, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "palm_tree", hasCollision: true } },

      // 10 Coleccionables en línea de velocidad
      { id: "w2s3-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-2", type: "collectible", position: { x: 0.0, y: 1.2, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-3", type: "collectible", position: { x: 0.0, y: 1.8, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }, // En el salto 1
      { id: "w2s3-col-4", type: "collectible", position: { x: -1.2, y: 1.2, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-5", type: "collectible", position: { x: 1.2, y: 1.2, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-6", type: "collectible", position: { x: -1.2, y: 1.2, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-7", type: "collectible", position: { x: 0.0, y: 1.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }, // En el salto 2
      { id: "w2s3-col-8", type: "collectible", position: { x: 1.2, y: 1.2, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-9", type: "collectible", position: { x: -1.2, y: 1.2, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s3-col-10", type: "collectible", position: { x: 0.0, y: 1.2, z: -27.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al final del sprint
      {
        id: "w2s3-goal",
        type: "goal",
        position: { x: 0.0, y: 0.4, z: -33.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 4: Tablones
  // "Tablones de madera para la playa, suben y bajan lentamente verticalmente
  // y tienes que llegar al otro lado con 12 tablones"
  // ---------------------------------------------------------------------------
  4: {
    id: "world-02-level-03-stage-04",
    world: 2,
    level: 3,
    stage: 4,
    name: "Tablones",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 75,
    spawn: { x: 0.0, y: 1.5, z: 24.0 },
    objects: [
      // Muelle de salida
      {
        id: "w2s4-start-dock",
        type: "platform",
        position: { x: 0.0, y: 0.5, z: 24.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.8, z: 6.0 },
        properties: { theme: "alicante" }
      },

      // Agua marina oceánica bajo los 12 tablones (traspasable)
      {
        id: "w2s4-ocean-water",
        type: "water",
        position: { x: 0.0, y: -1.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 36.0, y: 1.0, z: 64.0 },
        properties: { passable: true, hasCollision: false }
      },

      // 12 TABLONES MÓVILES VERTICALES
      { id: "w2s4-plank-01", type: "moving-platform", position: { x: 0.0, y: 0.5, z: 19.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.2, y: 0.45, z: 2.2 }, properties: { axis: "y", speed: 1.5, distance: 1.1, phase: 0.00, theme: "custom_color", customColor: "#795548" } },
      { id: "w2s4-plank-02", type: "moving-platform", position: { x: 0.0, y: 0.5, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.2, y: 0.45, z: 2.2 }, properties: { axis: "y", speed: 1.5, distance: 1.1, phase: 0.52, theme: "custom_color", customColor: "#8d6e63" } },
      { id: "w2s4-plank-03", type: "moving-platform", position: { x: 0.0, y: 0.5, z: 12.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.2, y: 0.45, z: 2.2 }, properties: { axis: "y", speed: 1.5, distance: 1.1, phase: 1.05, theme: "custom_color", customColor: "#795548" } },
      { id: "w2s4-plank-04", type: "moving-platform", position: { x: 0.0, y: 0.5, z: 9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.2, y: 0.45, z: 2.2 }, properties: { axis: "y", speed: 1.5, distance: 1.1, phase: 1.57, theme: "custom_color", customColor: "#8d6e63" } },
      { id: "w2s4-plank-05", type: "moving-platform", position: { x: 0.0, y: 0.5, z: 5.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.2, y: 0.45, z: 2.2 }, properties: { axis: "y", speed: 1.5, distance: 1.1, phase: 2.09, theme: "custom_color", customColor: "#795548" } },
      { id: "w2s4-plank-06", type: "moving-platform", position: { x: 0.0, y: 0.5, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.2, y: 0.45, z: 2.2 }, properties: { axis: "y", speed: 1.5, distance: 1.1, phase: 2.62, theme: "custom_color", customColor: "#8d6e63" } },
      { id: "w2s4-plank-07", type: "moving-platform", position: { x: 0.0, y: 0.5, z: -1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.2, y: 0.45, z: 2.2 }, properties: { axis: "y", speed: 1.5, distance: 1.1, phase: 3.14, theme: "custom_color", customColor: "#795548" } },
      { id: "w2s4-plank-08", type: "moving-platform", position: { x: 0.0, y: 0.5, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.2, y: 0.45, z: 2.2 }, properties: { axis: "y", speed: 1.5, distance: 1.1, phase: 3.66, theme: "custom_color", customColor: "#8d6e63" } },
      { id: "w2s4-plank-09", type: "moving-platform", position: { x: 0.0, y: 0.5, z: -8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.2, y: 0.45, z: 2.2 }, properties: { axis: "y", speed: 1.5, distance: 1.1, phase: 4.19, theme: "custom_color", customColor: "#795548" } },
      { id: "w2s4-plank-10", type: "moving-platform", position: { x: 0.0, y: 0.5, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.2, y: 0.45, z: 2.2 }, properties: { axis: "y", speed: 1.5, distance: 1.1, phase: 4.71, theme: "custom_color", customColor: "#8d6e63" } },
      { id: "w2s4-plank-11", type: "moving-platform", position: { x: 0.0, y: 0.5, z: -15.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.2, y: 0.45, z: 2.2 }, properties: { axis: "y", speed: 1.5, distance: 1.1, phase: 5.23, theme: "custom_color", customColor: "#795548" } },
      { id: "w2s4-plank-12", type: "moving-platform", position: { x: 0.0, y: 0.5, z: -19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.2, y: 0.45, z: 2.2 }, properties: { axis: "y", speed: 1.5, distance: 1.1, phase: 5.76, theme: "custom_color", customColor: "#8d6e63" } },

      // Muelle de llegada
      {
        id: "w2s4-end-pier",
        type: "platform",
        position: { x: 0.0, y: 0.5, z: -23.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.8, z: 6.5 },
        properties: { theme: "alicante" }
      },

      // 10 Coleccionables flotando sobre los tablones
      { id: "w2s4-col-1", type: "collectible", position: { x: 0.0, y: 1.8, z: 19.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-2", type: "collectible", position: { x: 0.0, y: 1.8, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-3", type: "collectible", position: { x: 0.0, y: 1.8, z: 12.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-4", type: "collectible", position: { x: 0.0, y: 1.8, z: 5.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-5", type: "collectible", position: { x: 0.0, y: 1.8, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-6", type: "collectible", position: { x: 0.0, y: 1.8, z: -1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-7", type: "collectible", position: { x: 0.0, y: 1.8, z: -8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-8", type: "collectible", position: { x: 0.0, y: 1.8, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-9", type: "collectible", position: { x: 0.0, y: 1.8, z: -15.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s4-col-10", type: "collectible", position: { x: 0.0, y: 1.8, z: -19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al final del muelle
      {
        id: "w2s4-goal",
        type: "goal",
        position: { x: 0.0, y: 0.9, z: -25.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos7
  // "Como Objetos6 pero con menos coleccionables" (precisión y armonía)
  // ---------------------------------------------------------------------------
  5: {
    id: "world-02-level-03-stage-05",
    world: 2,
    level: 3,
    stage: 5,
    name: "Objetos7",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 20.0 },
    objects: [
      // Gran explanada de arena fina y dunas
      {
        id: "w2s5-arena",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 24.0, y: 0.8, z: 48.0 },
        properties: { theme: "alicante" }
      },

      // Dunas / colinas suaves que articulan el espacio
      { id: "w2s5-ridge-l", type: "platform", position: { x: -6.0, y: 0.4, z: 4.0 }, rotation: { x: 0, y: 0.1, z: 0 }, scale: { x: 6.0, y: 0.6, z: 14.0 }, properties: { theme: "custom_color", customColor: "#ffe082" } },
      { id: "w2s5-ridge-r", type: "platform", position: { x: 6.0, y: 0.4, z: -4.0 }, rotation: { x: 0, y: -0.1, z: 0 }, scale: { x: 6.0, y: 0.6, z: 14.0 }, properties: { theme: "custom_color", customColor: "#ffe082" } },

      // Decoración playera armoniosa
      { id: "w2s5-palm-c1", type: "decoration", position: { x: 0.0, y: 0.4, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s5-palm-c2", type: "decoration", position: { x: 0.0, y: 0.4, z: -4.0 }, rotation: { x: 0, y: 0.8, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s5-chair", type: "decoration", position: { x: -8.0, y: 0.4, z: 12.0 }, rotation: { x: 0, y: 0.4, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "lifeguard_chair", hasCollision: true } },
      { id: "w2s5-umb-l", type: "decoration", position: { x: -7.0, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0.2, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "beach_umbrella", hasCollision: true } },
      { id: "w2s5-umb-r", type: "decoration", position: { x: 7.0, y: 0.4, z: 10.0 }, rotation: { x: 0, y: -0.2, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "beach_umbrella", hasCollision: true } },

      // 10 Coleccionables trazados en curvas limpias y elegantes
      { id: "w2s5-col-1", type: "collectible", position: { x: -4.5, y: 1.2, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-2", type: "collectible", position: { x: 4.5, y: 1.2, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-3", type: "collectible", position: { x: -7.0, y: 1.2, z: 7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-4", type: "collectible", position: { x: 7.0, y: 1.2, z: 7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-5", type: "collectible", position: { x: -3.5, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-6", type: "collectible", position: { x: 3.5, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-7", type: "collectible", position: { x: -7.0, y: 1.2, z: -7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-8", type: "collectible", position: { x: 7.0, y: 1.2, z: -7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-9", type: "collectible", position: { x: -4.5, y: 1.2, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s5-col-10", type: "collectible", position: { x: 4.5, y: 1.2, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al fondo en terraza elevada
      {
        id: "w2s5-goal",
        type: "goal",
        position: { x: 0.0, y: 0.5, z: -20.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 6: Sombrilla
  // "La plataforma es una sombrilla gigante que va girando y la meta esta quieta
  // en un punto y mientras gira la sombrilla gigante calcular la meta"
  // ---------------------------------------------------------------------------
  6: {
    id: "world-02-level-03-stage-06",
    world: 2,
    level: 3,
    stage: 6,
    name: "Sombrilla",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 65,
    spawn: { x: 0.0, y: 2.2, z: 12.5 },
    objects: [
      // Muelle de entrada
      {
        id: "w2s6-start-deck",
        type: "platform",
        position: { x: 0.0, y: 1.0, z: 12.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.8, z: 5.0 },
        properties: { theme: "alicante" }
      },

      // Mar oceánico en la base (traspasable)
      {
        id: "w2s6-ocean",
        type: "water",
        position: { x: 0.0, y: -1.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 40.0, y: 1.0, z: 46.0 },
        properties: { passable: true, hasCollision: false }
      },

      // SOMBRILLA GIGANTE GIRATORIA
      {
        id: "w2s6-giant-umbrella",
        type: "moving-platform",
        position: { x: 0.0, y: 0.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 15.0, y: 0.8, z: 15.0 },
        properties: {
          variant: "giant_umbrella",
          movementType: "giant_umbrella",
          radius: 7.5,
          rotSpeed: 0.45,
          customColor: "#ff3d00",
          stripeColor: "#ffea00"
        }
      },

      // Muelle fijo de la meta
      {
        id: "w2s6-goal-dock",
        type: "platform",
        position: { x: 0.0, y: 1.0, z: -11.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.8, z: 5.0 },
        properties: { theme: "alicante" }
      },

      // 10 Coleccionables distribuidos radialmente sobre la sombrilla
      { id: "w2s6-col-1", type: "collectible", position: { x: 0.0, y: 2.0, z: 3.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-2", type: "collectible", position: { x: -3.0, y: 2.0, z: 1.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-3", type: "collectible", position: { x: 3.0, y: 2.0, z: 1.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-4", type: "collectible", position: { x: -4.8, y: 1.8, z: -1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-5", type: "collectible", position: { x: 4.8, y: 1.8, z: -1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-6", type: "collectible", position: { x: 0.0, y: 1.8, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-7", type: "collectible", position: { x: -5.8, y: 1.6, z: 2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-8", type: "collectible", position: { x: 5.8, y: 1.6, z: 2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-9", type: "collectible", position: { x: -3.8, y: 1.6, z: -5.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s6-col-10", type: "collectible", position: { x: 3.8, y: 1.6, z: -5.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta quieta en el muelle
      {
        id: "w2s6-goal",
        type: "goal",
        position: { x: 0.0, y: 1.4, z: -12.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 7: Toalla
  // "Una plataforma que se mueve en forma de olas en contra del jugador y
  // el personaje tiene que llegar al otro lado de la toalla."
  // ---------------------------------------------------------------------------
  7: {
    id: "world-02-level-03-stage-07",
    world: 2,
    level: 3,
    stage: 7,
    name: "Toalla",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 65,
    spawn: { x: 0.0, y: 1.5, z: 16.0 },
    objects: [
      // Plataforma de salida
      {
        id: "w2s7-start-terrace",
        type: "platform",
        position: { x: 0.0, y: 0.6, z: 16.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.8, z: 5.0 },
        properties: { theme: "alicante" }
      },

      // Mar oceánico en la base (traspasable)
      {
        id: "w2s7-ocean",
        type: "water",
        position: { x: 0.0, y: -1.2, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 38.0, y: 1.0, z: 50.0 },
        properties: { passable: true, hasCollision: false }
      },

      // TOALLA GIGANTE CON MOVIMIENTO DE OLAS EN CONTRA
      {
        id: "w2s7-beach-towel",
        type: "moving-platform",
        position: { x: 0.0, y: 0.6, z: 1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.8, y: 0.45, z: 24.0 },
        properties: {
          variant: "beach_towel",
          movementType: "towel_wave",
          speed: 2.0,
          distance: 0.8
        }
      },

      // Plataforma de meta
      {
        id: "w2s7-end-terrace",
        type: "platform",
        position: { x: 0.0, y: 0.6, z: -14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.8, z: 5.0 },
        properties: { theme: "alicante" }
      },

      // 10 Coleccionables surfeando sobre la toalla
      { id: "w2s7-col-1", type: "collectible", position: { x: 0.0, y: 1.4, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-col-2", type: "collectible", position: { x: -1.5, y: 1.4, z: 8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-col-3", type: "collectible", position: { x: 1.5, y: 1.4, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-col-4", type: "collectible", position: { x: 0.0, y: 1.4, z: 3.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-col-5", type: "collectible", position: { x: -1.5, y: 1.4, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-col-6", type: "collectible", position: { x: 1.5, y: 1.4, z: -1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-col-7", type: "collectible", position: { x: 0.0, y: 1.4, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-col-8", type: "collectible", position: { x: -1.5, y: 1.4, z: -6.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-col-9", type: "collectible", position: { x: 1.5, y: 1.4, z: -9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s7-col-10", type: "collectible", position: { x: 0.0, y: 1.4, z: -11.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al otro lado de la toalla
      {
        id: "w2s7-goal",
        type: "goal",
        position: { x: 0.0, y: 1.0, z: -15.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 8: Paseo
  // "Es el paseo maritimo de arena de la playa, a la derecha las olas te
  // empujan y tiran por la izquierda."
  // ---------------------------------------------------------------------------
  8: {
    id: "world-02-level-03-stage-08",
    world: 2,
    level: 3,
    stage: 8,
    name: "Paseo",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 70,
    spawn: { x: 0.0, y: 1.5, z: 27.0 },
    objects: [
      // Paseo marítimo de arena
      {
        id: "w2s8-promenade",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.5, y: 0.8, z: 62.0 },
        properties: { theme: "alicante" }
      },

      // Mar oceánico a la izquierda (abismo traspasable)
      {
        id: "w2s8-sea-left",
        type: "water",
        position: { x: -16.0, y: -0.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 20.0, y: 1.0, z: 70.0 },
        properties: { passable: true, hasCollision: false }
      },
      // Zona de oleaje a la derecha
      {
        id: "w2s8-surf-right",
        type: "water",
        position: { x: 14.0, y: -0.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 18.0, y: 1.0, z: 70.0 },
        properties: { passable: true, hasCollision: false }
      },

      // 4 Olas cinemáticas que barren de derecha a izquierda empujando al jugador
      { id: "w2s8-wave-1", type: "moving-platform", position: { x: 6.0, y: 0.55, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.8, y: 0.55, z: 4.5 }, properties: { movementType: "wave_pusher", distance: 9.5, cycleTime: 3.4, theme: "custom_color", customColor: "#00b4d8" } },
      { id: "w2s8-wave-2", type: "moving-platform", position: { x: 6.0, y: 0.55, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.8, y: 0.55, z: 4.5 }, properties: { movementType: "wave_pusher", distance: 9.5, cycleTime: 3.1, theme: "custom_color", customColor: "#00b4d8" } },
      { id: "w2s8-wave-3", type: "moving-platform", position: { x: 6.0, y: 0.55, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.8, y: 0.55, z: 4.5 }, properties: { movementType: "wave_pusher", distance: 9.5, cycleTime: 3.6, theme: "custom_color", customColor: "#00b4d8" } },
      { id: "w2s8-wave-4", type: "moving-platform", position: { x: 6.0, y: 0.55, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.8, y: 0.55, z: 4.5 }, properties: { movementType: "wave_pusher", distance: 9.5, cycleTime: 3.3, theme: "custom_color", customColor: "#00b4d8" } },

      // Espigones / bloques de roca que ofrecen refugio contra el empuje
      { id: "w2s8-rock-1", type: "platform", position: { x: 2.8, y: 0.6, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 0.6, z: 2.5 }, properties: { theme: "custom_color", customColor: "#455a64" } },
      { id: "w2s8-rock-2", type: "platform", position: { x: 2.8, y: 0.6, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 0.6, z: 2.5 }, properties: { theme: "custom_color", customColor: "#455a64" } },
      { id: "w2s8-rock-3", type: "platform", position: { x: 2.8, y: 0.6, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.6, y: 0.6, z: 2.5 }, properties: { theme: "custom_color", customColor: "#455a64" } },

      // 10 Coleccionables
      { id: "w2s8-col-1", type: "collectible", position: { x: 1.0, y: 1.2, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s8-col-2", type: "collectible", position: { x: -1.0, y: 1.2, z: 17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s8-col-3", type: "collectible", position: { x: 1.5, y: 1.2, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s8-col-4", type: "collectible", position: { x: -1.2, y: 1.2, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s8-col-5", type: "collectible", position: { x: 1.5, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s8-col-6", type: "collectible", position: { x: -1.2, y: 1.2, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s8-col-7", type: "collectible", position: { x: 1.5, y: 1.2, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s8-col-8", type: "collectible", position: { x: -1.0, y: 1.2, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s8-col-9", type: "collectible", position: { x: 1.0, y: 1.2, z: -22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s8-col-10", type: "collectible", position: { x: 0.0, y: 1.2, z: -25.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Plaza de meta al final
      {
        id: "w2s8-end-plaza",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -28.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 12.0, y: 0.8, z: 8.0 },
        properties: { theme: "alicante" }
      },
      {
        id: "w2s8-goal",
        type: "goal",
        position: { x: 0.0, y: 0.4, z: -29.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 9: Hippies
  // "Son los hippies de la playa de san juan, pon un plataforma recta y
  // rectangular y 20 hippies (es como en Mercadillo) y en uno de ellos está la meta)."
  // ---------------------------------------------------------------------------
  9: {
    id: "world-02-level-03-stage-09",
    world: 2,
    level: 3,
    stage: 9,
    name: "Hippies",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 85,
    spawn: { x: 0.0, y: 1.5, z: 30.0 },
    objects: [
      // Gran calle de mercadillo artesano hippie
      {
        id: "w2s9-street",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 18.0, y: 0.8, z: 68.0 },
        properties: { theme: "alicante" }
      },

      // 20 PUESTOS HIPPIES (10 a la izquierda, 10 a la derecha)
      // En el Puesto 15 (izquierda, z = -14.4) se oculta la Meta!
      // Izquierda (x = -6.2, orientados hacia x = 0 con rotY = Math.PI / 2)
      { id: "w2s9-stall-01", type: "platform", position: { x: -6.2, y: 0.4, z: 26.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 1, customColor: "#ab47bc" } },
      { id: "w2s9-stall-02", type: "platform", position: { x: -6.2, y: 0.4, z: 20.2 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 2, customColor: "#e91e63" } },
      { id: "w2s9-stall-03", type: "platform", position: { x: -6.2, y: 0.4, z: 14.4 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 3, customColor: "#00b0ff" } },
      { id: "w2s9-stall-04", type: "platform", position: { x: -6.2, y: 0.4, z: 8.6 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 4, customColor: "#00e676" } },
      { id: "w2s9-stall-05", type: "platform", position: { x: -6.2, y: 0.4, z: 2.8 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 5, customColor: "#ff9100" } },
      { id: "w2s9-stall-06", type: "platform", position: { x: -6.2, y: 0.4, z: -3.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 6, customColor: "#7c4dff" } },
      { id: "w2s9-stall-07", type: "platform", position: { x: -6.2, y: 0.4, z: -8.8 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 7, customColor: "#f50057" } },
      // Puesto 15 (El de la meta)
      { id: "w2s9-stall-08", type: "platform", position: { x: -6.2, y: 0.4, z: -14.4 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 8, customColor: "#ffd700", isGoalStall: true } },
      { id: "w2s9-stall-09", type: "platform", position: { x: -6.2, y: 0.4, z: -20.2 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 9, customColor: "#00b4d8" } },
      { id: "w2s9-stall-10", type: "platform", position: { x: -6.2, y: 0.4, z: -26.0 }, rotation: { x: 0, y: 1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 10, customColor: "#76ff03" } },

      // Derecha (x = 6.2, orientados hacia x = 0 con rotY = -Math.PI / 2)
      { id: "w2s9-stall-11", type: "platform", position: { x: 6.2, y: 0.4, z: 26.0 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 11, customColor: "#ff4081" } },
      { id: "w2s9-stall-12", type: "platform", position: { x: 6.2, y: 0.4, z: 20.2 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 12, customColor: "#651fff" } },
      { id: "w2s9-stall-13", type: "platform", position: { x: 6.2, y: 0.4, z: 14.4 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 13, customColor: "#00e5ff" } },
      { id: "w2s9-stall-14", type: "platform", position: { x: 6.2, y: 0.4, z: 8.6 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 14, customColor: "#ffeb3b" } },
      { id: "w2s9-stall-15", type: "platform", position: { x: 6.2, y: 0.4, z: 2.8 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 15, customColor: "#ff6d00" } },
      { id: "w2s9-stall-16", type: "platform", position: { x: 6.2, y: 0.4, z: -3.0 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 16, customColor: "#00c853" } },
      { id: "w2s9-stall-17", type: "platform", position: { x: 6.2, y: 0.4, z: -8.8 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 17, customColor: "#d500f9" } },
      { id: "w2s9-stall-18", type: "platform", position: { x: 6.2, y: 0.4, z: -14.4 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 18, customColor: "#ff1744" } },
      { id: "w2s9-stall-19", type: "platform", position: { x: 6.2, y: 0.4, z: -20.2 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 19, customColor: "#304ffe" } },
      { id: "w2s9-stall-20", type: "platform", position: { x: 6.2, y: 0.4, z: -26.0 }, rotation: { x: 0, y: -1.57, z: 0 }, scale: { x: 4.8, y: 0.8, z: 3.6 }, properties: { variant: "hippie_stall", stallIndex: 20, customColor: "#ffab00" } },

      // 10 Coleccionables escondidos dentro de diversos puestos
      { id: "w2s9-col-1", type: "collectible", position: { x: -6.2, y: 1.2, z: 26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s9-col-2", type: "collectible", position: { x: 6.2, y: 1.2, z: 20.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s9-col-3", type: "collectible", position: { x: -6.2, y: 1.2, z: 14.4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s9-col-4", type: "collectible", position: { x: 6.2, y: 1.2, z: 8.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s9-col-5", type: "collectible", position: { x: -6.2, y: 1.2, z: 2.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s9-col-6", type: "collectible", position: { x: 6.2, y: 1.2, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s9-col-7", type: "collectible", position: { x: -6.2, y: 1.2, z: -8.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s9-col-8", type: "collectible", position: { x: 6.2, y: 1.2, z: -14.4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s9-col-9", type: "collectible", position: { x: -6.2, y: 1.2, z: -20.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s9-col-10", type: "collectible", position: { x: 6.2, y: 1.2, z: -26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // META SECRETA DENTRO DEL PUESTO 15 (x = -6.2, z = -14.4)
      {
        id: "w2s9-goal",
        type: "goal",
        position: { x: -6.2, y: 0.4, z: -14.4 },
        rotation: { x: 0, y: 1.57, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 10: Playa
  // "De frente tienes el mar y estas en la orilla, tienes que atravesar el mar
  // para llegar a la meta si nque las olas te empujen, minimo 40 de largo"
  // ---------------------------------------------------------------------------
  10: {
    id: "world-02-level-03-stage-10",
    world: 2,
    level: 3,
    stage: 10,
    name: "Playa",
    theme: "beach",
    musicTrack: "jungle_groove",
    timeLimit: 80,
    spawn: { x: 0.0, y: 1.5, z: 27.0 },
    objects: [
      // Dunas de la orilla de salida
      {
        id: "w2s10-shore-dune",
        type: "platform",
        position: { x: 0.0, y: 0.4, z: 27.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.8, z: 6.0 },
        properties: { theme: "alicante" }
      },

      // GRAN PASARELA / BARRA DE ARENA QUE ATRAVIESA EL MAR (54 metros de largo)
      {
        id: "w2s10-sandbar",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.2, y: 0.8, z: 54.0 },
        properties: { theme: "alicante" }
      },

      // Gran mar mediterráneo que rodea la pasarela (traspasable)
      {
        id: "w2s10-sea-water",
        type: "water",
        position: { x: 0.0, y: -0.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 50.0, y: 1.0, z: 72.0 },
        properties: { passable: true, hasCollision: false }
      },

      // 3 Vados someros donde el agua cubre la arena con salpicaduras
      { id: "w2s10-ford-1", type: "water", position: { x: 0.0, y: 0.25, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.3, z: 4.5 }, properties: { passable: true, hasCollision: false } },
      { id: "w2s10-ford-2", type: "water", position: { x: 0.0, y: 0.25, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.3, z: 4.5 }, properties: { passable: true, hasCollision: false } },
      { id: "w2s10-ford-3", type: "water", position: { x: 0.0, y: 0.25, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.0, y: 0.3, z: 4.5 }, properties: { passable: true, hasCollision: false } },

      // 3 Olas de marea / rompientes que cruzan la barra de arena
      { id: "w2s10-wave-1", type: "moving-platform", position: { x: 4.8, y: 0.45, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.5, y: 0.5, z: 3.8 }, properties: { movementType: "wave_pusher", distance: 8.5, cycleTime: 3.5, theme: "custom_color", customColor: "#00b4d8" } },
      { id: "w2s10-wave-2", type: "moving-platform", position: { x: -4.8, y: 0.45, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.5, y: 0.5, z: 3.8 }, properties: { movementType: "wave_pusher", distance: -8.5, cycleTime: 3.8, theme: "custom_color", customColor: "#00b4d8" } },
      { id: "w2s10-wave-3", type: "moving-platform", position: { x: 4.8, y: 0.45, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.5, y: 0.5, z: 3.8 }, properties: { movementType: "wave_pusher", distance: 8.5, cycleTime: 3.2, theme: "custom_color", customColor: "#00b4d8" } },

      // Espigones de roca marina
      { id: "w2s10-rock-1", type: "platform", position: { x: -3.6, y: 0.3, z: 8.0 }, rotation: { x: 0, y: 0.3, z: 0 }, scale: { x: 2.0, y: 0.8, z: 3.5 }, properties: { theme: "custom_color", customColor: "#546e7a" } },
      { id: "w2s10-rock-2", type: "platform", position: { x: 3.6, y: 0.3, z: -6.0 }, rotation: { x: 0, y: -0.3, z: 0 }, scale: { x: 2.0, y: 0.8, z: 3.5 }, properties: { theme: "custom_color", customColor: "#546e7a" } },

      // Isla del Faro al final del mar (más de 50 metros mar adentro!)
      {
        id: "w2s10-lighthouse-island",
        type: "platform",
        position: { x: 0.0, y: 0.2, z: -27.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 14.0, y: 0.8, z: 10.0 },
        properties: { theme: "alicante", shape: "cylinder" }
      },

      // Palmeras en el faro
      { id: "w2s10-palm-1", type: "decoration", position: { x: -4.5, y: 0.6, z: -27.0 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "palm_tree", hasCollision: true } },
      { id: "w2s10-palm-2", type: "decoration", position: { x: 4.5, y: 0.6, z: -27.0 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1.3 }, properties: { subType: "palm_tree", hasCollision: true } },

      // 10 Coleccionables a lo largo de la travesía del mar
      { id: "w2s10-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-2", type: "collectible", position: { x: -1.2, y: 1.2, z: 17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-3", type: "collectible", position: { x: 0.0, y: 1.2, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-4", type: "collectible", position: { x: 1.2, y: 1.2, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-5", type: "collectible", position: { x: 0.0, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-6", type: "collectible", position: { x: -1.2, y: 1.2, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-7", type: "collectible", position: { x: 1.2, y: 1.2, z: -11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-8", type: "collectible", position: { x: 0.0, y: 1.2, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-9", type: "collectible", position: { x: -1.0, y: 1.2, z: -21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "w2s10-col-10", type: "collectible", position: { x: 0.0, y: 1.2, z: -25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta en la Isla del Faro
      {
        id: "w2s10-goal",
        type: "goal",
        position: { x: 0.0, y: 0.6, z: -28.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  }
};

// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('2_3_')) Object.assign(WORLD_02_LEVEL_03_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(2,3,WORLD_02_LEVEL_03_STAGES);

