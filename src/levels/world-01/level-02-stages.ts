import publishedEditorStages from '../editor-saved/world-01.json';
import {registerStageSet} from '../StageRegistry';
import type { LevelData } from "../LevelTypes";
import { WORLD_01_LEVEL_02_STAGE_01 } from "./level-02-stage-01";

// =============================================================================
// WORLD 1 - LEVEL 2: PARROQUIA SANTA CATALINA (ETAPAS 1 A 10)
// =============================================================================

export const WORLD_01_LEVEL_02_STAGES: Record<number, LevelData> = {
  // ---------------------------------------------------------------------------
  // ETAPA 1: Autobús a Santa Catalina (Bus)
  // ---------------------------------------------------------------------------
  1: WORLD_01_LEVEL_02_STAGE_01,

  // ---------------------------------------------------------------------------
  // ETAPA 2: Salto1
  // Plataforma superior sobre columna masiva, caída al vacío recogiendo
  // coleccionables en arco hacia la plataforma inferior donde está la meta.
  // ---------------------------------------------------------------------------
  2: {
    id: "world-01-level-02-stage-02",
    world: 1,
    level: 2,
    stage: 2,
    name: "Salto1",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0, y: 8.2, z: 15.5 },
    objects: [
      // Plataforma superior
      {
        id: "s2-plat-top",
        type: "platform",
        position: { x: 0, y: 7.0, z: 14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.8, z: 8.0 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      // Bordes de seguridad plataforma superior (trasero e izquiero/derecho)
      {
        id: "s2-curb-back",
        type: "platform",
        position: { x: 0, y: 7.6, z: 17.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.4, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      {
        id: "s2-curb-left",
        type: "platform",
        position: { x: -3.8, y: 7.6, z: 14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 8.0 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      {
        id: "s2-curb-right",
        type: "platform",
        position: { x: 3.8, y: 7.6, z: 14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 8.0 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      // Columna de soporte masiva
      {
        id: "s2-pillar",
        type: "platform",
        position: { x: 0, y: 3.5, z: 14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.8, y: 7.0, z: 2.8 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },
      {
        id: "s2-pillar-base",
        type: "platform",
        position: { x: 0, y: 0.4, z: 14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.2, y: 0.8, z: 4.2 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },
      // Farolas y vallas en la plataforma alta
      {
        id: "s2-dec-lamp-tl",
        type: "decoration",
        position: { x: -3.2, y: 7.4, z: 17.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.8, y: 0.8, z: 0.8 },
        properties: { subType: "lantern" }
      },
      {
        id: "s2-dec-lamp-tr",
        type: "decoration",
        position: { x: 3.2, y: 7.4, z: 17.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.8, y: 0.8, z: 0.8 },
        properties: { subType: "lantern" }
      },
      {
        id: "s2-dec-fence-l",
        type: "decoration",
        position: { x: -3.6, y: 7.4, z: 14.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence" }
      },
      {
        id: "s2-dec-fence-r",
        type: "decoration",
        position: { x: 3.6, y: 7.4, z: 14.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence" }
      },
      // Plataforma inferior donde se aterriza y está la meta
      {
        id: "s2-plat-bottom",
        type: "platform",
        position: { x: 0, y: 0.0, z: -6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.8, z: 24.0 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },
      // Zona de diana / aterrizaje en la plataforma inferior
      {
        id: "s2-landing-mat",
        type: "platform",
        position: { x: 0, y: 0.42, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.04, z: 6.0 },
        properties: { theme: "custom_color", customColor: "#388e3c" }
      },
      // Bordillos laterales de la plataforma inferior
      {
        id: "s2-curb-bot-l",
        type: "platform",
        position: { x: -4.8, y: 0.5, z: -6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.6, z: 24.0 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },
      {
        id: "s2-curb-bot-r",
        type: "platform",
        position: { x: 4.8, y: 0.5, z: -6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.6, z: 24.0 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },
      // Decoraciones en plataforma inferior
      {
        id: "s2-dec-tree-1",
        type: "decoration",
        position: { x: -3.8, y: 0.4, z: -10 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 0.9, z: 0.9 },
        properties: { subType: "tree" }
      },
      {
        id: "s2-dec-tree-2",
        type: "decoration",
        position: { x: 3.8, y: 0.4, z: -10 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 0.9, z: 0.9 },
        properties: { subType: "tree" }
      },
      {
        id: "s2-dec-flower-1",
        type: "decoration",
        position: { x: -3.5, y: 0.4, z: -2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "flower" }
      },
      {
        id: "s2-dec-flower-2",
        type: "decoration",
        position: { x: 3.5, y: 0.4, z: -2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "flower" }
      },
      {
        id: "s2-dec-bird",
        type: "decoration",
        position: { x: -4.8, y: 0.8, z: -6 },
        rotation: { x: 0, y: 1.2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "bird", variant: "canary" }
      },
      {
        id: "s2-dec-lamp-g1",
        type: "decoration",
        position: { x: -3.8, y: 0.4, z: -16 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s2-dec-lamp-g2",
        type: "decoration",
        position: { x: 3.8, y: 0.4, z: -16 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      // Coleccionables puestos en arco en el aire para recogerlos al saltar
      {
        id: "s2-col-1",
        type: "collectible",
        position: { x: 0, y: 6.4, z: 9.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s2-col-2",
        type: "collectible",
        position: { x: 0, y: 4.8, z: 7.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s2-col-3",
        type: "collectible",
        position: { x: 0, y: 3.2, z: 4.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s2-col-4",
        type: "collectible",
        position: { x: 0, y: 1.6, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Meta
      {
        id: "s2-goal",
        type: "goal",
        position: { x: 0, y: 0.8, z: -15.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 3: Escaleras
  // Gran escalinata de 10 escalones de piedra hacia abajo y la meta al fondo.
  // ---------------------------------------------------------------------------
  3: {
    id: "world-01-level-02-stage-03",
    world: 1,
    level: 2,
    stage: 3,
    name: "Escaleras",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0, y: 6.7, z: 19.0 },
    objects: [
      // Plataforma superior de salida
      {
        id: "s3-plat-start",
        type: "platform",
        position: { x: 0, y: 5.5, z: 18.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.5, y: 0.8, z: 5.0 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      {
        id: "s3-start-curb-l",
        type: "platform",
        position: { x: -3.0, y: 6.0, z: 18.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.6, z: 5.0 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      {
        id: "s3-start-curb-r",
        type: "platform",
        position: { x: 3.0, y: 6.0, z: 18.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.6, z: 5.0 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      // 10 Escalones descendentes hacia abajo
      // Escalón 1 (Y: 5.0, Z: 14.0)
      {
        id: "s3-step-1",
        type: "platform",
        position: { x: 0, y: 5.0, z: 14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.5, y: 0.5, z: 2.4 },
        properties: { theme: "custom_color", customColor: "#b0bec5" }
      },
      // Escalón 2 (Y: 4.5, Z: 11.6)
      {
        id: "s3-step-2",
        type: "platform",
        position: { x: 0, y: 4.5, z: 11.6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.5, y: 0.5, z: 2.4 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      // Escalón 3 (Y: 4.0, Z: 9.2)
      {
        id: "s3-step-3",
        type: "platform",
        position: { x: 0, y: 4.0, z: 9.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.5, y: 0.5, z: 2.4 },
        properties: { theme: "custom_color", customColor: "#b0bec5" }
      },
      // Escalón 4 (Y: 3.5, Z: 6.8)
      {
        id: "s3-step-4",
        type: "platform",
        position: { x: 0, y: 3.5, z: 6.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.5, y: 0.5, z: 2.4 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      // Escalón 5 (Y: 3.0, Z: 4.4)
      {
        id: "s3-step-5",
        type: "platform",
        position: { x: 0, y: 3.0, z: 4.4 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.5, y: 0.5, z: 2.4 },
        properties: { theme: "custom_color", customColor: "#b0bec5" }
      },
      // Escalón 6 (Y: 2.5, Z: 2.0)
      {
        id: "s3-step-6",
        type: "platform",
        position: { x: 0, y: 2.5, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.5, y: 0.5, z: 2.4 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      // Escalón 7 (Y: 2.0, Z: -0.4)
      {
        id: "s3-step-7",
        type: "platform",
        position: { x: 0, y: 2.0, z: -0.4 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.5, y: 0.5, z: 2.4 },
        properties: { theme: "custom_color", customColor: "#b0bec5" }
      },
      // Escalón 8 (Y: 1.5, Z: -2.8)
      {
        id: "s3-step-8",
        type: "platform",
        position: { x: 0, y: 1.5, z: -2.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.5, y: 0.5, z: 2.4 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      // Escalón 9 (Y: 1.0, Z: -5.2)
      {
        id: "s3-step-9",
        type: "platform",
        position: { x: 0, y: 1.0, z: -5.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.5, y: 0.5, z: 2.4 },
        properties: { theme: "custom_color", customColor: "#b0bec5" }
      },
      // Escalón 10 (Y: 0.5, Z: -7.6)
      {
        id: "s3-step-10",
        type: "platform",
        position: { x: 0, y: 0.5, z: -7.6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.5, y: 0.5, z: 2.4 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      // Barandillas laterales continuas en rampa que encierran los escalones
      {
        id: "s3-rail-l",
        type: "ramp",
        position: { x: -2.8, y: 3.3, z: 3.2 },
        rotation: { x: -0.203, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.6, z: 24.5 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },
      {
        id: "s3-rail-r",
        type: "ramp",
        position: { x: 2.8, y: 3.3, z: 3.2 },
        rotation: { x: -0.203, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.6, z: 24.5 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },
      // Plataforma final de llegada
      {
        id: "s3-plat-end",
        type: "platform",
        position: { x: 0, y: 0.0, z: -13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.8, z: 8.0 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },
      {
        id: "s3-end-curb-l",
        type: "platform",
        position: { x: -3.8, y: 0.5, z: -13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.6, z: 8.0 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },
      {
        id: "s3-end-curb-r",
        type: "platform",
        position: { x: 3.8, y: 0.5, z: -13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.6, z: 8.0 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },
      {
        id: "s3-end-curb-back",
        type: "platform",
        position: { x: 0, y: 0.5, z: -16.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.6, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },
      // Farolas rústicas a lo largo de las escaleras
      {
        id: "s3-dec-lamp-1",
        type: "decoration",
        position: { x: -3.4, y: 4.3, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.85, y: 0.85, z: 0.85 },
        properties: { subType: "lantern" }
      },
      {
        id: "s3-dec-lamp-2",
        type: "decoration",
        position: { x: 3.4, y: 4.3, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.85, y: 0.85, z: 0.85 },
        properties: { subType: "lantern" }
      },
      {
        id: "s3-dec-lamp-3",
        type: "decoration",
        position: { x: -3.4, y: 2.3, z: -0.4 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.85, y: 0.85, z: 0.85 },
        properties: { subType: "lantern" }
      },
      {
        id: "s3-dec-lamp-4",
        type: "decoration",
        position: { x: 3.4, y: 2.3, z: -0.4 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.85, y: 0.85, z: 0.85 },
        properties: { subType: "lantern" }
      },
      {
        id: "s3-dec-tree-1",
        type: "decoration",
        position: { x: -4.8, y: 0.4, z: -13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "tree" }
      },
      {
        id: "s3-dec-tree-2",
        type: "decoration",
        position: { x: 4.8, y: 0.4, z: -13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "tree" }
      },
      // Coleccionables escalonados a lo largo del descenso
      {
        id: "s3-col-1",
        type: "collectible",
        position: { x: 0, y: 5.6, z: 11.6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s3-col-2",
        type: "collectible",
        position: { x: -1.2, y: 4.1, z: 6.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s3-col-3",
        type: "collectible",
        position: { x: 1.2, y: 3.1, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s3-col-4",
        type: "collectible",
        position: { x: 0, y: 2.1, z: -2.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s3-col-5",
        type: "collectible",
        position: { x: 0, y: 1.1, z: -7.6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Meta abajo al final de la escalinata
      {
        id: "s3-goal",
        type: "goal",
        position: { x: 0, y: 0.8, z: -14.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 4: Parque2
  // Versión ampliada y mejorada de Parque1: más grande, con más obstáculos
  // y vallas de colores verde, rojo, azul y amarillo en los bordes.
  // ---------------------------------------------------------------------------
  4: {
    id: "world-01-level-02-stage-04",
    world: 1,
    level: 2,
    stage: 4,
    name: "Parque2",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0, y: 1.5, z: 15.0 },
    objects: [
      // Plataforma principal del parque ampliada
      {
        id: "s4-plat-park",
        type: "platform",
        position: { x: 0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 22.0, y: 0.8, z: 36.0 },
        properties: { theme: "custom_color", customColor: "#66bb6a" }
      },
      // VALLAS DE COLORES AL BORDE:
      // Lateral Izquierdo: Verde (#4caf50) y Azul (#2196f3)
      {
        id: "s4-fence-left-1",
        type: "decoration",
        position: { x: -10.5, y: 0.4, z: 14 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#4caf50" }
      },
      {
        id: "s4-fence-left-2",
        type: "decoration",
        position: { x: -10.5, y: 0.4, z: 8 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#2196f3" }
      },
      {
        id: "s4-fence-left-3",
        type: "decoration",
        position: { x: -10.5, y: 0.4, z: 2 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#4caf50" }
      },
      {
        id: "s4-fence-left-4",
        type: "decoration",
        position: { x: -10.5, y: 0.4, z: -4 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#2196f3" }
      },
      {
        id: "s4-fence-left-5",
        type: "decoration",
        position: { x: -10.5, y: 0.4, z: -10 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#4caf50" }
      },
      {
        id: "s4-fence-left-6",
        type: "decoration",
        position: { x: -10.5, y: 0.4, z: -15 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#2196f3" }
      },
      // Lateral Derecho: Rojo (#f44336) y Amarillo (#ffeb3b)
      {
        id: "s4-fence-right-1",
        type: "decoration",
        position: { x: 10.5, y: 0.4, z: 14 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#f44336" }
      },
      {
        id: "s4-fence-right-2",
        type: "decoration",
        position: { x: 10.5, y: 0.4, z: 8 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#ffeb3b" }
      },
      {
        id: "s4-fence-right-3",
        type: "decoration",
        position: { x: 10.5, y: 0.4, z: 2 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#f44336" }
      },
      {
        id: "s4-fence-right-4",
        type: "decoration",
        position: { x: 10.5, y: 0.4, z: -4 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#ffeb3b" }
      },
      {
        id: "s4-fence-right-5",
        type: "decoration",
        position: { x: 10.5, y: 0.4, z: -10 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#f44336" }
      },
      {
        id: "s4-fence-right-6",
        type: "decoration",
        position: { x: 10.5, y: 0.4, z: -15 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#ffeb3b" }
      },
      // Bordes Frontal y Trasero
      {
        id: "s4-fence-back-l",
        type: "decoration",
        position: { x: -6.0, y: 0.4, z: 17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#4caf50" }
      },
      {
        id: "s4-fence-back-r",
        type: "decoration",
        position: { x: 6.0, y: 0.4, z: 17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#ffeb3b" }
      },
      {
        id: "s4-fence-front-l",
        type: "decoration",
        position: { x: -6.0, y: 0.4, z: -17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#2196f3" }
      },
      {
        id: "s4-fence-front-r",
        type: "decoration",
        position: { x: 6.0, y: 0.4, z: -17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#f44336" }
      },
      // OBSTÁCULOS DEL PARQUE 2:
      // 1. Tobogán Rojo Grande con rampa y meseta
      {
        id: "s4-slide-ramp-1",
        type: "ramp",
        position: { x: -5.0, y: 0.8, z: 8.0 },
        rotation: { x: -0.25, y: 0, z: 0 },
        scale: { x: 3.5, y: 0.8, z: 6.0 },
        properties: { theme: "custom_color", customColor: "#ff5722" }
      },
      {
        id: "s4-slide-plat-1",
        type: "platform",
        position: { x: -5.0, y: 1.5, z: 11.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.5, y: 0.8, z: 2.0 },
        properties: { theme: "custom_color", customColor: "#ffeb3b" }
      },
      // 2. Tobogán Azul / Zigzag
      {
        id: "s4-slide-ramp-2",
        type: "ramp",
        position: { x: 5.0, y: 0.8, z: 8.0 },
        rotation: { x: -0.25, y: 0, z: 0 },
        scale: { x: 3.5, y: 0.8, z: 6.0 },
        properties: { theme: "custom_color", customColor: "#0288d1" }
      },
      {
        id: "s4-slide-plat-2",
        type: "platform",
        position: { x: 5.0, y: 1.5, z: 11.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.5, y: 0.8, z: 2.0 },
        properties: { theme: "custom_color", customColor: "#ffca28" }
      },
      // 3. Columpio Doble (Postes y Travesaños)
      {
        id: "s4-swing-post-1",
        type: "platform",
        position: { x: -7.5, y: 1.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.35, y: 3.2, z: 0.35 },
        properties: { theme: "custom_color", customColor: "#795548" }
      },
      {
        id: "s4-swing-post-2",
        type: "platform",
        position: { x: -3.5, y: 1.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.35, y: 3.2, z: 0.35 },
        properties: { theme: "custom_color", customColor: "#795548" }
      },
      {
        id: "s4-swing-bar-1",
        type: "platform",
        position: { x: -5.5, y: 3.1, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.4, y: 0.3, z: 0.35 },
        properties: { theme: "custom_color", customColor: "#e91e63" }
      },
      // Segundo columpio al otro lado
      {
        id: "s4-swing-post-3",
        type: "platform",
        position: { x: 3.5, y: 1.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.35, y: 3.2, z: 0.35 },
        properties: { theme: "custom_color", customColor: "#795548" }
      },
      {
        id: "s4-swing-post-4",
        type: "platform",
        position: { x: 7.5, y: 1.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.35, y: 3.2, z: 0.35 },
        properties: { theme: "custom_color", customColor: "#795548" }
      },
      {
        id: "s4-swing-bar-2",
        type: "platform",
        position: { x: 5.5, y: 3.1, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.4, y: 0.3, z: 0.35 },
        properties: { theme: "custom_color", customColor: "#29b6f6" }
      },
      // 4. Parachoques alegres del parque (Cilindros de colores)
      {
        id: "s4-bumper-1",
        type: "bumper",
        position: { x: -2.5, y: 0.8, z: 3.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.6, y: 1.5, z: 1.6 },
        properties: { color: "#e91e63", bounce: 1.2 }
      },
      {
        id: "s4-bumper-2",
        type: "bumper",
        position: { x: 2.5, y: 0.8, z: 3.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.6, y: 1.5, z: 1.6 },
        properties: { color: "#00e5ff", bounce: 1.2 }
      },
      {
        id: "s4-bumper-3",
        type: "bumper",
        position: { x: 0, y: 0.8, z: -4.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.8, y: 1.5, z: 1.8 },
        properties: { color: "#ffeb3b", bounce: 1.2 }
      },
      // 5. Cubos de psicomotricidad / escalada en el centro
      {
        id: "s4-play-cube-1",
        type: "platform",
        position: { x: -4.5, y: 0.6, z: -7.5 },
        rotation: { x: 0, y: 0.2, z: 0 },
        scale: { x: 2.2, y: 1.2, z: 2.2 },
        properties: { theme: "custom_color", customColor: "#ab47bc" }
      },
      {
        id: "s4-play-cube-2",
        type: "platform",
        position: { x: 4.5, y: 0.6, z: -7.5 },
        rotation: { x: 0, y: -0.2, z: 0 },
        scale: { x: 2.2, y: 1.2, z: 2.2 },
        properties: { theme: "custom_color", customColor: "#26a69a" }
      },
      // 6. Arenero / Banco
      {
        id: "s4-sandbox",
        type: "platform",
        position: { x: 0, y: 0.45, z: -9.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.5, y: 0.1, z: 3.5 },
        properties: { theme: "custom_color", customColor: "#ffe082" }
      },
      // Decoraciones de árboles, flores, farolas y pájaros
      {
        id: "s4-tree-1",
        type: "decoration",
        position: { x: -8.5, y: 0.4, z: 6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.1, y: 1.1, z: 1.1 },
        properties: { subType: "tree" }
      },
      {
        id: "s4-tree-2",
        type: "decoration",
        position: { x: 8.5, y: 0.4, z: 6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.1, y: 1.1, z: 1.1 },
        properties: { subType: "tree" }
      },
      {
        id: "s4-flower-1",
        type: "decoration",
        position: { x: -7.5, y: 0.4, z: -12.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "flower" }
      },
      {
        id: "s4-flower-2",
        type: "decoration",
        position: { x: 7.5, y: 0.4, z: -12.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "flower" }
      },
      {
        id: "s4-lamp-1",
        type: "decoration",
        position: { x: -8.5, y: 0.4, z: -14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s4-lamp-2",
        type: "decoration",
        position: { x: 8.5, y: 0.4, z: -14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s4-bird-1",
        type: "decoration",
        position: { x: -10.5, y: 1.1, z: 2.0 },
        rotation: { x: 0, y: 1.0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "bird", variant: "robin" }
      },
      {
        id: "s4-bird-2",
        type: "decoration",
        position: { x: 10.5, y: 1.1, z: -4.0 },
        rotation: { x: 0, y: -1.0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "bird", variant: "bluebird" }
      },
      // Coleccionables
      {
        id: "s4-col-1",
        type: "collectible",
        position: { x: -5.0, y: 2.4, z: 11.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s4-col-2",
        type: "collectible",
        position: { x: 5.0, y: 2.4, z: 11.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s4-col-3",
        type: "collectible",
        position: { x: 0, y: 1.2, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s4-col-4",
        type: "collectible",
        position: { x: -4.5, y: 1.8, z: -7.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s4-col-5",
        type: "collectible",
        position: { x: 4.5, y: 1.8, z: -7.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Meta al fondo del parque
      {
        id: "s4-goal",
        type: "goal",
        position: { x: 0, y: 0.8, z: -14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos2
  // Copia fiel de Objetos1 con exactamente 4 coleccionables menos (12 en vez de 16).
  // ---------------------------------------------------------------------------
  5: {
    id: "world-01-level-02-stage-05",
    world: 1,
    level: 2,
    stage: 5,
    name: "Objetos2",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0, y: 1.5, z: 9.5 },
    objects: [
      {
        id: "s5-platform-main",
        type: "platform",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 24, y: 0.8, z: 24 }
      },
      // Vallas perimetrales
      {
        id: "s5-dec-fence-1",
        type: "decoration",
        position: { x: -11.5, y: 0.4, z: 8 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence" }
      },
      {
        id: "s5-dec-fence-2",
        type: "decoration",
        position: { x: -11.5, y: 0.4, z: 0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence" }
      },
      {
        id: "s5-dec-fence-3",
        type: "decoration",
        position: { x: -11.5, y: 0.4, z: -8 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence" }
      },
      {
        id: "s5-dec-fence-4",
        type: "decoration",
        position: { x: 11.5, y: 0.4, z: 8 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence" }
      },
      {
        id: "s5-dec-fence-5",
        type: "decoration",
        position: { x: 11.5, y: 0.4, z: 0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence" }
      },
      {
        id: "s5-dec-fence-6",
        type: "decoration",
        position: { x: 11.5, y: 0.4, z: -8 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence" }
      },
      {
        id: "s5-dec-fence-7",
        type: "decoration",
        position: { x: 0, y: 0.4, z: 11.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence" }
      },
      {
        id: "s5-dec-fence-8",
        type: "decoration",
        position: { x: 0, y: 0.4, z: -11.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence" }
      },
      // Farolas en esquinas
      {
        id: "s5-dec-lamp-1",
        type: "decoration",
        position: { x: -10.5, y: 0.4, z: 10.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s5-dec-lamp-2",
        type: "decoration",
        position: { x: 10.5, y: 0.4, z: 10.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s5-dec-lamp-3",
        type: "decoration",
        position: { x: -10.5, y: 0.4, z: -10.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s5-dec-lamp-4",
        type: "decoration",
        position: { x: 10.5, y: 0.4, z: -10.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      // Árboles y arbustos
      {
        id: "s5-dec-tree-1",
        type: "decoration",
        position: { x: -8.5, y: 0.4, z: 8.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "tree" }
      },
      {
        id: "s5-dec-tree-2",
        type: "decoration",
        position: { x: 8.5, y: 0.4, z: 8.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "tree" }
      },
      {
        id: "s5-dec-tree-3",
        type: "decoration",
        position: { x: -8.5, y: 0.4, z: -8.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "tree" }
      },
      {
        id: "s5-dec-tree-4",
        type: "decoration",
        position: { x: 8.5, y: 0.4, z: -8.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "tree" }
      },
      {
        id: "s5-dec-bush-1",
        type: "decoration",
        position: { x: -4, y: 0.4, z: 4 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "bush" }
      },
      {
        id: "s5-dec-bush-2",
        type: "decoration",
        position: { x: 4, y: 0.4, z: 4 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "bush" }
      },
      // 12 Coleccionables dispuestos armoniosamente (16 - 4 = 12)
      { id: "s5-col-1", type: "collectible", position: { x: -6, y: 1.2, z: 6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-2", type: "collectible", position: { x: 0, y: 1.2, z: 6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-3", type: "collectible", position: { x: 6, y: 1.2, z: 6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-4", type: "collectible", position: { x: -6, y: 1.2, z: 2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-5", type: "collectible", position: { x: -2, y: 1.2, z: 2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-6", type: "collectible", position: { x: 2, y: 1.2, z: 2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-7", type: "collectible", position: { x: 6, y: 1.2, z: 2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-8", type: "collectible", position: { x: -6, y: 1.2, z: -2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-9", type: "collectible", position: { x: -2, y: 1.2, z: -2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-10", type: "collectible", position: { x: 2, y: 1.2, z: -2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-11", type: "collectible", position: { x: 6, y: 1.2, z: -2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-12", type: "collectible", position: { x: 0, y: 1.2, z: -6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      // Meta
      {
        id: "s5-goal",
        type: "goal",
        position: { x: 0, y: 0.8, z: -9.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 6: Rejas
  // Plataforma corrida con 3 rejas verticales móviles que suben y bajan,
  // bloqueando o permitiendo el paso al jugador con timming dinámico.
  // ---------------------------------------------------------------------------
  6: {
    id: "world-01-level-02-stage-06",
    world: 1,
    level: 2,
    stage: 6,
    name: "Rejas",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0, y: 1.5, z: 18.0 },
    objects: [
      // Plataforma principal de carrera
      {
        id: "s6-plat-track",
        type: "platform",
        position: { x: 0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.5, y: 0.8, z: 42.0 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },
      // Bordillos laterales protectores
      {
        id: "s6-curb-left",
        type: "platform",
        position: { x: -3.3, y: 0.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.6, z: 42.0 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },
      {
        id: "s6-curb-right",
        type: "platform",
        position: { x: 3.3, y: 0.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.6, z: 42.0 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },
      // ESTRUCTURA Y REJA 1 (Z = 10.0, desfase 0.0s)
      {
        id: "s6-pillar-1l",
        type: "platform",
        position: { x: -3.1, y: 2.1, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.6, y: 4.2, z: 0.6 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      {
        id: "s6-pillar-1r",
        type: "platform",
        position: { x: 3.1, y: 2.1, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.6, y: 4.2, z: 0.6 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      {
        id: "s6-arch-1",
        type: "platform",
        position: { x: 0, y: 4.1, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.8, y: 0.6, z: 0.6 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },
      // Reja 1 móvil que sube y baja verticalmente
      {
        id: "s6-gate-1",
        type: "moving-platform",
        position: { x: 0, y: 1.4, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.6, y: 2.4, z: 0.35 },
        properties: {
          isMoving: true,
          axis: "y",
          distance: 2.3,
          speed: 1.8,
          movementType: "gate",
          startDelay: 0.0,
          theme: "custom_color",
          customColor: "#212121"
        }
      },
      // ESTRUCTURA Y REJA 2 (Z = 0.0, desfase 1.1s)
      {
        id: "s6-pillar-2l",
        type: "platform",
        position: { x: -3.1, y: 2.1, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.6, y: 4.2, z: 0.6 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      {
        id: "s6-pillar-2r",
        type: "platform",
        position: { x: 3.1, y: 2.1, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.6, y: 4.2, z: 0.6 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      {
        id: "s6-arch-2",
        type: "platform",
        position: { x: 0, y: 4.1, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.8, y: 0.6, z: 0.6 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },
      // Reja 2 móvil
      {
        id: "s6-gate-2",
        type: "moving-platform",
        position: { x: 0, y: 1.4, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.6, y: 2.4, z: 0.35 },
        properties: {
          isMoving: true,
          axis: "y",
          distance: 2.3,
          speed: 1.8,
          movementType: "gate",
          startDelay: 1.1,
          theme: "custom_color",
          customColor: "#263238"
        }
      },
      // ESTRUCTURA Y REJA 3 (Z = -10.0, desfase 2.2s)
      {
        id: "s6-pillar-3l",
        type: "platform",
        position: { x: -3.1, y: 2.1, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.6, y: 4.2, z: 0.6 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      {
        id: "s6-pillar-3r",
        type: "platform",
        position: { x: 3.1, y: 2.1, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.6, y: 4.2, z: 0.6 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      {
        id: "s6-arch-3",
        type: "platform",
        position: { x: 0, y: 4.1, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.8, y: 0.6, z: 0.6 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },
      // Reja 3 móvil
      {
        id: "s6-gate-3",
        type: "moving-platform",
        position: { x: 0, y: 1.4, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.6, y: 2.4, z: 0.35 },
        properties: {
          isMoving: true,
          axis: "y",
          distance: 2.3,
          speed: 1.8,
          movementType: "gate",
          startDelay: 2.2,
          theme: "custom_color",
          customColor: "#212121"
        }
      },
      // Farolas y decoraciones entre arcos
      {
        id: "s6-lamp-1",
        type: "decoration",
        position: { x: -3.5, y: 0.4, z: 15.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s6-lamp-2",
        type: "decoration",
        position: { x: 3.5, y: 0.4, z: 15.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s6-lamp-3",
        type: "decoration",
        position: { x: -3.5, y: 0.4, z: 5.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s6-lamp-4",
        type: "decoration",
        position: { x: 3.5, y: 0.4, z: 5.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s6-lamp-5",
        type: "decoration",
        position: { x: -3.5, y: 0.4, z: -5.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s6-lamp-6",
        type: "decoration",
        position: { x: 3.5, y: 0.4, z: -5.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      // Coleccionables situados estratégicamente entre cada reja
      {
        id: "s6-col-1",
        type: "collectible",
        position: { x: 0, y: 1.2, z: 15.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s6-col-2",
        type: "collectible",
        position: { x: 0, y: 1.2, z: 5.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s6-col-3",
        type: "collectible",
        position: { x: 0, y: 1.2, z: -5.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s6-col-4",
        type: "collectible",
        position: { x: 0, y: 1.2, z: -15.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Meta al final del pasaje de rejas
      {
        id: "s6-goal",
        type: "goal",
        position: { x: 0, y: 0.8, z: -18.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 7: Capilla
  // Capilla solemne y preciosa con nave de piedra, alfombra roja central,
  // columnata románica, bancos de iglesia, altar escalonado y la Santa Cruz.
  // ---------------------------------------------------------------------------
  7: {
    id: "world-01-level-02-stage-07",
    world: 1,
    level: 2,
    stage: 7,
    name: "Capilla",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0, y: 1.5, z: 15.0 },
    objects: [
      // Nave central de la capilla (suelo de losas de piedra)
      {
        id: "s7-plat-nave",
        type: "platform",
        position: { x: 0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 14.0, y: 0.8, z: 38.0 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      // Alfombra roja litúrgica central hacia el altar
      {
        id: "s7-carpet",
        type: "platform",
        position: { x: 0, y: 0.42, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.6, y: 0.05, z: 28.0 },
        properties: { theme: "custom_color", customColor: "#b71c1c" }
      },
      // Muros laterales de la capilla
      {
        id: "s7-wall-l",
        type: "platform",
        position: { x: -6.8, y: 1.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.6, y: 2.5, z: 38.0 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      {
        id: "s7-wall-r",
        type: "platform",
        position: { x: 6.8, y: 1.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.6, y: 2.5, z: 38.0 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      {
        id: "s7-wall-back",
        type: "platform",
        position: { x: 0, y: 1.5, z: 18.7 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 14.0, y: 2.5, z: 0.6 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      // Columnatas románicas a ambos lados del pasillo central
      // Lado izquierdo
      {
        id: "s7-col-l1",
        type: "platform",
        position: { x: -3.5, y: 2.0, z: 12.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.8, y: 4.0, z: 0.8 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },
      {
        id: "s7-col-l2",
        type: "platform",
        position: { x: -3.5, y: 2.0, z: 5.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.8, y: 4.0, z: 0.8 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },
      {
        id: "s7-col-l3",
        type: "platform",
        position: { x: -3.5, y: 2.0, z: -2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.8, y: 4.0, z: 0.8 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },
      {
        id: "s7-col-l4",
        type: "platform",
        position: { x: -3.5, y: 2.0, z: -9.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.8, y: 4.0, z: 0.8 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },
      // Lado derecho
      {
        id: "s7-col-r1",
        type: "platform",
        position: { x: 3.5, y: 2.0, z: 12.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.8, y: 4.0, z: 0.8 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },
      {
        id: "s7-col-r2",
        type: "platform",
        position: { x: 3.5, y: 2.0, z: 5.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.8, y: 4.0, z: 0.8 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },
      {
        id: "s7-col-r3",
        type: "platform",
        position: { x: 3.5, y: 2.0, z: -2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.8, y: 4.0, z: 0.8 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },
      {
        id: "s7-col-r4",
        type: "platform",
        position: { x: 3.5, y: 2.0, z: -9.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.8, y: 4.0, z: 0.8 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },
      // Bancos de madera de iglesia a ambos lados del pasillo central
      {
        id: "s7-pew-l1",
        type: "platform",
        position: { x: -5.0, y: 0.6, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.8, y: 0.45, z: 0.8 },
        properties: { theme: "custom_color", customColor: "#5d4037" }
      },
      {
        id: "s7-pew-l2",
        type: "platform",
        position: { x: -5.0, y: 0.6, z: 6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.8, y: 0.45, z: 0.8 },
        properties: { theme: "custom_color", customColor: "#5d4037" }
      },
      {
        id: "s7-pew-l3",
        type: "platform",
        position: { x: -5.0, y: 0.6, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.8, y: 0.45, z: 0.8 },
        properties: { theme: "custom_color", customColor: "#5d4037" }
      },
      {
        id: "s7-pew-r1",
        type: "platform",
        position: { x: 5.0, y: 0.6, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.8, y: 0.45, z: 0.8 },
        properties: { theme: "custom_color", customColor: "#5d4037" }
      },
      {
        id: "s7-pew-r2",
        type: "platform",
        position: { x: 5.0, y: 0.6, z: 6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.8, y: 0.45, z: 0.8 },
        properties: { theme: "custom_color", customColor: "#5d4037" }
      },
      {
        id: "s7-pew-r3",
        type: "platform",
        position: { x: 5.0, y: 0.6, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.8, y: 0.45, z: 0.8 },
        properties: { theme: "custom_color", customColor: "#5d4037" }
      },
      // ZONA DEL ALTAR MAYOR (Gradas de piedra blanca)
      {
        id: "s7-altar-step-1",
        type: "platform",
        position: { x: 0, y: 0.55, z: -13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.0, y: 0.35, z: 6.0 },
        properties: { theme: "custom_color", customColor: "#eceff1" }
      },
      {
        id: "s7-altar-step-2",
        type: "platform",
        position: { x: 0, y: 0.85, z: -14.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.35, z: 3.5 },
        properties: { theme: "custom_color", customColor: "#ffffff" }
      },
      // Mesa del Altar
      {
        id: "s7-altar-table",
        type: "platform",
        position: { x: 0, y: 1.45, z: -15.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.2, y: 0.85, z: 1.4 },
        properties: { theme: "custom_color", customColor: "#fafafa" }
      },
      // LA SANTA CRUZ DE LA CAPILLA (Madera noble con detalles dorados)
      {
        id: "s7-cross-vert",
        type: "platform",
        position: { x: 0, y: 3.6, z: -17.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 3.6, z: 0.3 },
        properties: { theme: "custom_color", customColor: "#ffd700" }
      },
      {
        id: "s7-cross-horiz",
        type: "platform",
        position: { x: 0, y: 4.4, z: -17.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.4, y: 0.4, z: 0.3 },
        properties: { theme: "custom_color", customColor: "#ffd700" }
      },
      // Farolas y candelabros que iluminan la capilla cálidamente
      {
        id: "s7-lamp-altar-l",
        type: "decoration",
        position: { x: -2.8, y: 0.7, z: -14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 0.9, z: 0.9 },
        properties: { subType: "lantern" }
      },
      {
        id: "s7-lamp-altar-r",
        type: "decoration",
        position: { x: 2.8, y: 0.7, z: -14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 0.9, z: 0.9 },
        properties: { subType: "lantern" }
      },
      {
        id: "s7-lamp-nave-l",
        type: "decoration",
        position: { x: -3.5, y: 0.4, z: 8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 0.9, z: 0.9 },
        properties: { subType: "lantern" }
      },
      {
        id: "s7-lamp-nave-r",
        type: "decoration",
        position: { x: 3.5, y: 0.4, z: 8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 0.9, z: 0.9 },
        properties: { subType: "lantern" }
      },
      // Coleccionables litúrgicos a lo largo del pasillo
      {
        id: "s7-col-1",
        type: "collectible",
        position: { x: 0, y: 1.2, z: 12.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s7-col-2",
        type: "collectible",
        position: { x: 0, y: 1.2, z: 6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s7-col-3",
        type: "collectible",
        position: { x: 0, y: 1.2, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s7-col-4",
        type: "collectible",
        position: { x: 0, y: 1.2, z: -6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Meta situada frente a las gradas del altar
      {
        id: "s7-goal",
        type: "goal",
        position: { x: 0, y: 0.8, z: -10.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 8: Barras
  // Parque de calistenia y street workout completo con barras paralelas,
  // estación de dominadas, escalera monkey bars, bancos de abdominales y obstáculos.
  // ---------------------------------------------------------------------------
  8: {
    id: "world-01-level-02-stage-08",
    world: 1,
    level: 2,
    stage: 8,
    name: "Barras",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0, y: 1.5, z: 15.0 },
    objects: [
      // Plataforma del parque de calistenia con suelo de caucho deportivo
      {
        id: "s8-plat-ground",
        type: "platform",
        position: { x: 0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 16.0, y: 0.8, z: 36.0 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      // Pista central de tartán azul / caucho
      {
        id: "s8-tartan-track",
        type: "platform",
        position: { x: 0, y: 0.42, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.05, z: 32.0 },
        properties: { theme: "custom_color", customColor: "#0288d1" }
      },
      // Vallas perimetrales del parque
      {
        id: "s8-fence-l1",
        type: "decoration",
        position: { x: -7.5, y: 0.4, z: 12.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#78909c" }
      },
      {
        id: "s8-fence-l2",
        type: "decoration",
        position: { x: -7.5, y: 0.4, z: 4.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#78909c" }
      },
      {
        id: "s8-fence-l3",
        type: "decoration",
        position: { x: -7.5, y: 0.4, z: -4.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#78909c" }
      },
      {
        id: "s8-fence-l4",
        type: "decoration",
        position: { x: -7.5, y: 0.4, z: -12.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#78909c" }
      },
      {
        id: "s8-fence-r1",
        type: "decoration",
        position: { x: 7.5, y: 0.4, z: 12.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#78909c" }
      },
      {
        id: "s8-fence-r2",
        type: "decoration",
        position: { x: 7.5, y: 0.4, z: 4.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#78909c" }
      },
      {
        id: "s8-fence-r3",
        type: "decoration",
        position: { x: 7.5, y: 0.4, z: -4.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#78909c" }
      },
      {
        id: "s8-fence-r4",
        type: "decoration",
        position: { x: 7.5, y: 0.4, z: -12.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#78909c" }
      },
      // ESTACIÓN 1: Barras Paralelas de Fondos (Z = 10.0)
      // Barra izquierda
      {
        id: "s8-dip-post-l1",
        type: "platform",
        position: { x: -1.4, y: 0.9, z: 11.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.16, y: 1.2, z: 0.16 },
        properties: { theme: "custom_color", customColor: "#eceff1" }
      },
      {
        id: "s8-dip-post-l2",
        type: "platform",
        position: { x: -1.4, y: 0.9, z: 8.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.16, y: 1.2, z: 0.16 },
        properties: { theme: "custom_color", customColor: "#eceff1" }
      },
      {
        id: "s8-dip-bar-l",
        type: "platform",
        position: { x: -1.4, y: 1.5, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.16, y: 0.16, z: 3.2 },
        properties: { theme: "custom_color", customColor: "#ff9800" }
      },
      // Barra derecha
      {
        id: "s8-dip-post-r1",
        type: "platform",
        position: { x: 1.4, y: 0.9, z: 11.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.16, y: 1.2, z: 0.16 },
        properties: { theme: "custom_color", customColor: "#eceff1" }
      },
      {
        id: "s8-dip-post-r2",
        type: "platform",
        position: { x: 1.4, y: 0.9, z: 8.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.16, y: 1.2, z: 0.16 },
        properties: { theme: "custom_color", customColor: "#eceff1" }
      },
      {
        id: "s8-dip-bar-r",
        type: "platform",
        position: { x: 1.4, y: 1.5, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.16, y: 0.16, z: 3.2 },
        properties: { theme: "custom_color", customColor: "#ff9800" }
      },
      // ESTACIÓN 2: Escalera Horizontal / Monkey Bars (Z = 2.0)
      {
        id: "s8-mb-post-1",
        type: "platform",
        position: { x: -2.2, y: 1.8, z: 4.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.2, y: 2.8, z: 0.2 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },
      {
        id: "s8-mb-post-2",
        type: "platform",
        position: { x: 2.2, y: 1.8, z: 4.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.2, y: 2.8, z: 0.2 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },
      {
        id: "s8-mb-post-3",
        type: "platform",
        position: { x: -2.2, y: 1.8, z: -0.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.2, y: 2.8, z: 0.2 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },
      {
        id: "s8-mb-post-4",
        type: "platform",
        position: { x: 2.2, y: 1.8, z: -0.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.2, y: 2.8, z: 0.2 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },
      // Travesaños longitudinales de la monkey bar
      {
        id: "s8-mb-rail-l",
        type: "platform",
        position: { x: -2.2, y: 3.1, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.2, y: 0.2, z: 5.2 },
        properties: { theme: "custom_color", customColor: "#e53935" }
      },
      {
        id: "s8-mb-rail-r",
        type: "platform",
        position: { x: 2.2, y: 3.1, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.2, y: 0.2, z: 5.2 },
        properties: { theme: "custom_color", customColor: "#e53935" }
      },
      // Peldaños elevados de la escalera
      {
        id: "s8-mb-rung-1",
        type: "platform",
        position: { x: 0, y: 3.1, z: 4.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.2, y: 0.15, z: 0.15 },
        properties: { theme: "custom_color", customColor: "#ffd54f" }
      },
      {
        id: "s8-mb-rung-2",
        type: "platform",
        position: { x: 0, y: 3.1, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.2, y: 0.15, z: 0.15 },
        properties: { theme: "custom_color", customColor: "#ffd54f" }
      },
      {
        id: "s8-mb-rung-3",
        type: "platform",
        position: { x: 0, y: 3.1, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.2, y: 0.15, z: 0.15 },
        properties: { theme: "custom_color", customColor: "#ffd54f" }
      },
      // ESTACIÓN 3: Racks de Dominadas y Muscle-Up (Z = -5.5)
      {
        id: "s8-pu-post-l",
        type: "platform",
        position: { x: -4.0, y: 1.8, z: -5.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.2, y: 3.2, z: 0.2 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      {
        id: "s8-pu-post-c",
        type: "platform",
        position: { x: 0.0, y: 2.0, z: -5.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.2, y: 3.6, z: 0.2 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      {
        id: "s8-pu-post-r",
        type: "platform",
        position: { x: 4.0, y: 1.8, z: -5.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.2, y: 3.2, z: 0.2 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      // Barra alta izquierda
      {
        id: "s8-pu-bar-l",
        type: "platform",
        position: { x: -2.0, y: 3.0, z: -5.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.8, y: 0.16, z: 0.16 },
        properties: { theme: "custom_color", customColor: "#00e676" }
      },
      // Barra alta derecha
      {
        id: "s8-pu-bar-r",
        type: "platform",
        position: { x: 2.0, y: 3.4, z: -5.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.8, y: 0.16, z: 0.16 },
        properties: { theme: "custom_color", customColor: "#00e676" }
      },
      // ESTACIÓN 4: Banco inclinado de abdominales (Z = -9.5)
      {
        id: "s8-abs-bench",
        type: "ramp",
        position: { x: -3.5, y: 0.65, z: -9.5 },
        rotation: { x: 0.22, y: 0, z: 0 },
        scale: { x: 1.4, y: 0.3, z: 3.2 },
        properties: { theme: "custom_color", customColor: "#5d4037" }
      },
      // Banco de abdominales plano
      {
        id: "s8-flat-bench",
        type: "platform",
        position: { x: 3.5, y: 0.65, z: -9.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.4, y: 0.3, z: 3.2 },
        properties: { theme: "custom_color", customColor: "#5d4037" }
      },
      // Farolas y árboles del parque
      {
        id: "s8-lamp-1",
        type: "decoration",
        position: { x: -6.5, y: 0.4, z: 14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s8-lamp-2",
        type: "decoration",
        position: { x: 6.5, y: 0.4, z: 14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s8-lamp-3",
        type: "decoration",
        position: { x: -6.5, y: 0.4, z: -14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s8-lamp-4",
        type: "decoration",
        position: { x: 6.5, y: 0.4, z: -14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s8-tree-1",
        type: "decoration",
        position: { x: -6.2, y: 0.4, z: -1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "tree" }
      },
      {
        id: "s8-tree-2",
        type: "decoration",
        position: { x: 6.2, y: 0.4, z: -1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "tree" }
      },
      // Coleccionables a lo largo del circuito de calistenia
      {
        id: "s8-col-1",
        type: "collectible",
        position: { x: 0, y: 1.2, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s8-col-2",
        type: "collectible",
        position: { x: 0, y: 1.2, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s8-col-3",
        type: "collectible",
        position: { x: -2.0, y: 1.2, z: -5.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s8-col-4",
        type: "collectible",
        position: { x: 2.0, y: 1.2, z: -5.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s8-col-5",
        type: "collectible",
        position: { x: 0, y: 1.2, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Meta al fondo del parque
      {
        id: "s8-goal",
        type: "goal",
        position: { x: 0, y: 0.8, z: -14.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 9: Tirolina
  // Plataforma superior, abismo completo debajo y una caja de teleférico / tirolina
  // que te transporta deslizándose por el cable hasta la plataforma inferior con la meta.
  // ---------------------------------------------------------------------------
  9: {
    id: "world-01-level-02-stage-09",
    world: 1,
    level: 2,
    stage: 9,
    name: "Tirolina",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0, y: 8.2, z: 17.5 },
    objects: [
      // ESTACIÓN SUPERIOR (Y = 7.0, Z = 16.0)
      {
        id: "s9-plat-top",
        type: "platform",
        position: { x: 0, y: 7.0, z: 16.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.8, z: 7.0 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      // Bordillos estación superior
      {
        id: "s9-curb-top-back",
        type: "platform",
        position: { x: 0, y: 7.6, z: 19.3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.4, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      {
        id: "s9-curb-top-l",
        type: "platform",
        position: { x: -3.3, y: 7.6, z: 16.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 7.0 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      {
        id: "s9-curb-top-r",
        type: "platform",
        position: { x: 3.3, y: 7.6, z: 16.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 7.0 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      // Torre soporte de la tirolina superior
      {
        id: "s9-tower-top-l",
        type: "platform",
        position: { x: -2.6, y: 9.8, z: 13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 5.6, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      {
        id: "s9-tower-top-r",
        type: "platform",
        position: { x: 2.6, y: 9.8, z: 13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 5.6, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      {
        id: "s9-tower-top-beam",
        type: "platform",
        position: { x: 0, y: 12.4, z: 13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.6, y: 0.4, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },
      // ESTACIÓN INFERIOR (Y = 0.0, Z = -16.0)
      {
        id: "s9-plat-bot",
        type: "platform",
        position: { x: 0, y: 0.0, z: -16.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.8, z: 7.0 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },
      // Bordillos estación inferior
      {
        id: "s9-curb-bot-back",
        type: "platform",
        position: { x: 0, y: 0.5, z: -19.3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.4, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },
      {
        id: "s9-curb-bot-l",
        type: "platform",
        position: { x: -3.3, y: 0.5, z: -16.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 7.0 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },
      {
        id: "s9-curb-bot-r",
        type: "platform",
        position: { x: 3.3, y: 0.5, z: -16.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 7.0 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },
      // Torre soporte de la tirolina inferior
      {
        id: "s9-tower-bot-l",
        type: "platform",
        position: { x: -2.6, y: 2.8, z: -13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 5.6, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      {
        id: "s9-tower-bot-r",
        type: "platform",
        position: { x: 2.6, y: 2.8, z: -13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 5.6, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      {
        id: "s9-tower-bot-beam",
        type: "platform",
        position: { x: 0, y: 5.4, z: -13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.6, y: 0.4, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },
      // CABLE DIAGONAL DE LA TIROLINA ENTRE AMBAS TORRES
      {
        id: "s9-cable-overhead",
        type: "ramp",
        position: { x: 0, y: 8.9, z: 0.0 },
        rotation: { x: -0.263, y: 0, z: 0 },
        scale: { x: 0.12, y: 0.12, z: 26.9 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      // CAJA DE TELEFÉRICO / TIROLINA MÓVIL (Viaja a lo largo de Z e Y)
      // Cabina completa con paredes de protección, techo y polea que recoge al jugador
      {
        id: "s9-cablecar-floor",
        type: "moving-platform",
        position: { x: 0, y: 3.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.2, y: 0.4, z: 4.0 },
        properties: {
          isMoving: true,
          variant: "teleferico",
          movementType: "teleferico",
          axis: "yz",
          distance: 12.5,
          speed: 1.0,
          slopeY: 0.28,
          theme: "custom_color",
          customColor: "#d32f2f"
        }
      },
      // Farolas decorativas en las estaciones
      {
        id: "s9-lamp-top-1",
        type: "decoration",
        position: { x: -2.8, y: 7.4, z: 18.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 0.9, z: 0.9 },
        properties: { subType: "lantern" }
      },
      {
        id: "s9-lamp-top-2",
        type: "decoration",
        position: { x: 2.8, y: 7.4, z: 18.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 0.9, z: 0.9 },
        properties: { subType: "lantern" }
      },
      {
        id: "s9-lamp-bot-1",
        type: "decoration",
        position: { x: -2.8, y: 0.4, z: -18.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 0.9, z: 0.9 },
        properties: { subType: "lantern" }
      },
      {
        id: "s9-lamp-bot-2",
        type: "decoration",
        position: { x: 2.8, y: 0.4, z: -18.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 0.9, z: 0.9 },
        properties: { subType: "lantern" }
      },
      // Coleccionables
      {
        id: "s9-col-1",
        type: "collectible",
        position: { x: 0, y: 8.2, z: 14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s9-col-2",
        type: "collectible",
        position: { x: 0, y: 4.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s9-col-3",
        type: "collectible",
        position: { x: 0, y: 1.2, z: -14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Meta en la estación inferior
      {
        id: "s9-goal",
        type: "goal",
        position: { x: 0, y: 0.8, z: -17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 10: Fuegos Artificiales
  // La Parroquia Santa Catalina de fondo con su majestuoso campanario y fachada,
  // la meta delante en la plaza, cohetes decorativos y fuegos artificiales en el cielo.
  // ---------------------------------------------------------------------------
  10: {
    id: "world-01-level-02-stage-10",
    world: 1,
    level: 2,
    stage: 10,
    name: "Fuegos Artificiales",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0, y: 1.5, z: 14.0 },
    objects: [
      // Plaza Mayor de Santa Catalina
      {
        id: "s10-plat-plaza",
        type: "platform",
        position: { x: 0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 18.0, y: 0.8, z: 36.0 },
        properties: { theme: "custom_color", customColor: "#b0bec5" }
      },
      // Camino ornamental de adoquines en el centro
      {
        id: "s10-plaza-paving",
        type: "platform",
        position: { x: 0, y: 0.42, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.04, z: 32.0 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      // FACHADA MONUMENTAL DE LA PARROQUIA SANTA CATALINA (Z = -17.0)
      // Muro principal de la iglesia
      {
        id: "s10-church-facade",
        type: "platform",
        position: { x: -1.0, y: 5.4, z: -17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 12.0, y: 10.0, z: 2.0 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },
      // Portada / Portón de madera noble de la iglesia
      {
        id: "s10-church-door",
        type: "platform",
        position: { x: 0, y: 2.2, z: -16.4 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.6, y: 4.0, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#4e342e" }
      },
      // Frontón triangular superior del templo
      {
        id: "s10-church-pediment",
        type: "platform",
        position: { x: -1.0, y: 11.5, z: -17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.0, y: 2.4, z: 2.0 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      // Cruz dorada sobre el frontón
      {
        id: "s10-church-cross",
        type: "platform",
        position: { x: -1.0, y: 13.5, z: -17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.35, y: 1.8, z: 0.2 },
        properties: { theme: "custom_color", customColor: "#ffd700" }
      },
      {
        id: "s10-church-cross-h",
        type: "platform",
        position: { x: -1.0, y: 13.9, z: -17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.2, y: 0.3, z: 0.2 },
        properties: { theme: "custom_color", customColor: "#ffd700" }
      },
      // CAMPANARIO EMBLEMÁTICO DE VILLAMANTA (Torre de Santa Catalina)
      {
        id: "s10-tower-body",
        type: "platform",
        position: { x: 6.2, y: 8.5, z: -17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.2, y: 17.0, z: 4.2 },
        properties: { theme: "custom_color", customColor: "#607d8b" }
      },
      // Aguja / tejado del campanario
      {
        id: "s10-tower-roof",
        type: "platform",
        position: { x: 6.2, y: 18.2, z: -17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.5, y: 2.5, z: 4.5 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      // Campana dorada visible en el campanario
      {
        id: "s10-church-bell",
        type: "platform",
        position: { x: 6.2, y: 15.0, z: -15.3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.2, y: 1.4, z: 1.2 },
        properties: { theme: "custom_color", customColor: "#ffd700" }
      },
      // Cruz sobre el campanario
      {
        id: "s10-tower-cross",
        type: "platform",
        position: { x: 6.2, y: 20.2, z: -17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.3, y: 1.6, z: 0.2 },
        properties: { theme: "custom_color", customColor: "#ffd700" }
      },
      // Gradas solemnes de entrada a la parroquia
      {
        id: "s10-steps-1",
        type: "platform",
        position: { x: 0, y: 0.55, z: -14.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.35, z: 2.4 },
        properties: { theme: "custom_color", customColor: "#eceff1" }
      },
      {
        id: "s10-steps-2",
        type: "platform",
        position: { x: 0, y: 0.85, z: -15.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.0, y: 0.35, z: 1.8 },
        properties: { theme: "custom_color", customColor: "#ffffff" }
      },
      // VALLAS FESTIVAS PERIMETRALES
      {
        id: "s10-fence-l1",
        type: "decoration",
        position: { x: -8.5, y: 0.4, z: 12.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#ffd54f" }
      },
      {
        id: "s10-fence-l2",
        type: "decoration",
        position: { x: -8.5, y: 0.4, z: 4.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#e53935" }
      },
      {
        id: "s10-fence-l3",
        type: "decoration",
        position: { x: -8.5, y: 0.4, z: -4.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#00e5ff" }
      },
      {
        id: "s10-fence-r1",
        type: "decoration",
        position: { x: 8.5, y: 0.4, z: 12.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#ffd54f" }
      },
      {
        id: "s10-fence-r2",
        type: "decoration",
        position: { x: 8.5, y: 0.4, z: 4.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#e53935" }
      },
      {
        id: "s10-fence-r3",
        type: "decoration",
        position: { x: 8.5, y: 0.4, z: -4.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", color: "#00e5ff" }
      },
      // BATERÍAS Y COHETES PIROTÉCNICOS ARTIFICIALES (3D Firework Rockets)
      {
        id: "s10-rocket-1",
        type: "decoration",
        position: { x: -6.5, y: 0.4, z: 8.0 },
        rotation: { x: -0.15, y: 0.3, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "firework_rocket", color: "#e53935" }
      },
      {
        id: "s10-rocket-2",
        type: "decoration",
        position: { x: -6.2, y: 0.4, z: 8.6 },
        rotation: { x: -0.1, y: 0.1, z: 0 },
        scale: { x: 1.1, y: 1.1, z: 1.1 },
        properties: { subType: "firework_rocket", color: "#ffd700" }
      },
      {
        id: "s10-rocket-3",
        type: "decoration",
        position: { x: 6.5, y: 0.4, z: 8.0 },
        rotation: { x: -0.15, y: -0.3, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "firework_rocket", color: "#00e5ff" }
      },
      {
        id: "s10-rocket-4",
        type: "decoration",
        position: { x: 6.2, y: 0.4, z: 8.6 },
        rotation: { x: -0.1, y: -0.1, z: 0 },
        scale: { x: 1.1, y: 1.1, z: 1.1 },
        properties: { subType: "firework_rocket", color: "#e040fb" }
      },
      {
        id: "s10-rocket-5",
        type: "decoration",
        position: { x: -6.5, y: 0.4, z: -2.0 },
        rotation: { x: -0.1, y: 0.4, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "firework_rocket", color: "#76ff03" }
      },
      {
        id: "s10-rocket-6",
        type: "decoration",
        position: { x: 6.5, y: 0.4, z: -2.0 },
        rotation: { x: -0.1, y: -0.4, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "firework_rocket", color: "#ff1744" }
      },
      // Farolas festivas
      {
        id: "s10-lamp-1",
        type: "decoration",
        position: { x: -7.5, y: 0.4, z: 15.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s10-lamp-2",
        type: "decoration",
        position: { x: 7.5, y: 0.4, z: 15.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s10-lamp-3",
        type: "decoration",
        position: { x: -7.5, y: 0.4, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s10-lamp-4",
        type: "decoration",
        position: { x: 7.5, y: 0.4, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      // Árboles y flores
      {
        id: "s10-tree-1",
        type: "decoration",
        position: { x: -7.2, y: 0.4, z: 1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.1, y: 1.1, z: 1.1 },
        properties: { subType: "tree" }
      },
      {
        id: "s10-flower-1",
        type: "decoration",
        position: { x: -5.0, y: 0.4, z: -8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "flower" }
      },
      {
        id: "s10-flower-2",
        type: "decoration",
        position: { x: 5.0, y: 0.4, z: -8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "flower" }
      },
      // Coleccionables en disposición estelar festiva
      {
        id: "s10-col-1",
        type: "collectible",
        position: { x: 0, y: 1.2, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s10-col-2",
        type: "collectible",
        position: { x: -2.5, y: 1.2, z: 4.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s10-col-3",
        type: "collectible",
        position: { x: 2.5, y: 1.2, z: 4.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s10-col-4",
        type: "collectible",
        position: { x: -1.5, y: 1.2, z: -3.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        id: "s10-col-5",
        type: "collectible",
        position: { x: 1.5, y: 1.2, z: -3.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      // Meta situada triunfalmente delante de la entrada de la Parroquia Santa Catalina
      {
        id: "s10-goal",
        type: "goal",
        position: { x: 0, y: 0.8, z: -11.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  }
};

// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('1_2_')) Object.assign(WORLD_01_LEVEL_02_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(1,2,WORLD_01_LEVEL_02_STAGES);

