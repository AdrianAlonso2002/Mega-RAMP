import {applyPlazaFinale} from "./PlazaFinale";
import {registerStageSet} from '../StageRegistry';
import type { LevelData } from "../LevelTypes";

// =============================================================================
// WORLD 1 - LEVEL 4: PLAZA DE VILLAMANTA (ETAPAS 1 A 10)
// =============================================================================

export const WORLD_01_LEVEL_04_STAGES: Record<number, LevelData> = {
  // ---------------------------------------------------------------------------
  // ETAPA 1: Bar
  // Un bar tradicional de pueblo con terraza circular de piedra, barra de madera
  // con copas y botellas, mesas redondas, taburetes y jardineras.
  // ---------------------------------------------------------------------------
  1: {
    id: "world-01-level-04-stage-01",
    world: 1,
    level: 4,
    stage: 1,
    name: "Bar",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 7.2 },
    objects: [
      // Base terraza circular del bar (Cilindro diámetro 18m)
      {
        id: "s1-bar-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 18.0, y: 0.8, z: 18.0 },
        properties: { theme: "custom_color", customColor: "#d7ccc8", shape: "cylinder" }
      },

      // Barra de bar en forma de 'L' de madera y mármol
      {
        id: "s1-bar-counter-main",
        type: "platform",
        position: { x: 3.5, y: 0.9, z: -1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.2, y: 1.0, z: 7.0 },
        properties: { theme: "custom_color", customColor: "#5d4037" }
      },
      {
        id: "s1-bar-counter-wing",
        type: "platform",
        position: { x: 1.6, y: 0.9, z: -4.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.8, y: 1.0, z: 1.2 },
        properties: { theme: "custom_color", customColor: "#5d4037" }
      },
      // Encimera brillante de la barra
      {
        id: "s1-bar-top-main",
        type: "platform",
        position: { x: 3.5, y: 1.45, z: -1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.4, y: 0.1, z: 7.2 },
        properties: { theme: "custom_color", customColor: "#eceff1" }
      },
      {
        id: "s1-bar-top-wing",
        type: "platform",
        position: { x: 1.6, y: 1.45, z: -4.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.0, y: 0.1, z: 1.4 },
        properties: { theme: "custom_color", customColor: "#eceff1" }
      },
      // Botellero tras la barra
      {
        id: "s1-bar-shelf",
        type: "platform",
        position: { x: 5.5, y: 1.5, z: -1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.8, y: 2.2, z: 6.0 },
        properties: { theme: "custom_color", customColor: "#3e2723" }
      },

      // Mesas de bar redondas con taburetes (Obstáculos)
      {
        id: "s1-table-1",
        type: "platform",
        position: { x: -3.8, y: 0.8, z: 2.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.2, y: 0.8, z: 2.2 },
        properties: { theme: "custom_color", customColor: "#8d6e63", shape: "cylinder" }
      },
      {
        id: "s1-table-2",
        type: "platform",
        position: { x: -4.2, y: 0.8, z: -2.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.2, y: 0.8, z: 2.2 },
        properties: { theme: "custom_color", customColor: "#8d6e63", shape: "cylinder" }
      },
      {
        id: "s1-table-3",
        type: "platform",
        position: { x: -1.0, y: 0.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.0, y: 0.8, z: 2.0 },
        properties: { theme: "custom_color", customColor: "#8d6e63", shape: "cylinder" }
      },

      // Barandillas de madera en el perímetro circular
      {
        id: "s1-fence-w1",
        type: "decoration",
        position: { x: -6.5, y: 0.4, z: 4.5 },
        rotation: { x: 0, y: 0.8, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", customColor: "#5d4037" }
      },
      {
        id: "s1-fence-w2",
        type: "decoration",
        position: { x: -8.0, y: 0.4, z: 0.0 },
        rotation: { x: 0, y: 1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", customColor: "#5d4037" }
      },
      {
        id: "s1-fence-w3",
        type: "decoration",
        position: { x: -6.5, y: 0.4, z: -4.5 },
        rotation: { x: 0, y: 2.356, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", customColor: "#5d4037" }
      },
      {
        id: "s1-fence-e1",
        type: "decoration",
        position: { x: 6.5, y: 0.4, z: 4.5 },
        rotation: { x: 0, y: -0.8, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", customColor: "#5d4037" }
      },
      {
        id: "s1-fence-e2",
        type: "decoration",
        position: { x: 8.0, y: 0.4, z: 0.0 },
        rotation: { x: 0, y: -1.571, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "fence", customColor: "#5d4037" }
      },

      // Farolas de terraza
      {
        id: "s1-lamp-1",
        type: "decoration",
        position: { x: -7.2, y: 0.4, z: 3.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s1-lamp-2",
        type: "decoration",
        position: { x: 7.2, y: 0.4, z: 3.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },

      // Coleccionables (distribuidos por el bar, mesas y barra)
      { id: "s1-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s1-col-2", type: "collectible", position: { x: -3.8, y: 1.6, z: 2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s1-col-3", type: "collectible", position: { x: 3.5, y: 1.8, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s1-col-4", type: "collectible", position: { x: -1.0, y: 1.6, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al fondo de la terraza
      {
        id: "s1-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -7.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 2: Panadería
  // Panadería artesanal con baldosas cálidas, sacos de harina, horno de leña y
  // panes gigantes de hogaza que se mueven de un lado a otro molestando el paso.
  // ---------------------------------------------------------------------------
  2: {
    id: "world-01-level-04-stage-02",
    world: 1,
    level: 4,
    stage: 2,
    name: "Panadería",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 14.0 },
    objects: [
      // Suelo de baldosas de panadería
      {
        id: "s2-bakery-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.0, y: 0.8, z: 32.0 },
        properties: { theme: "custom_color", customColor: "#ffe0b2" }
      },
      // Muro izquierdo de ladrillo
      {
        id: "s2-wall-l",
        type: "platform",
        position: { x: -4.3, y: 1.2, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 1.6, z: 32.0 },
        properties: { theme: "custom_color", customColor: "#8d6e63" }
      },
      // Muro derecho de ladrillo
      {
        id: "s2-wall-r",
        type: "platform",
        position: { x: 4.3, y: 1.2, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 1.6, z: 32.0 },
        properties: { theme: "custom_color", customColor: "#8d6e63" }
      },
      // Muro de fondo
      {
        id: "s2-wall-b",
        type: "platform",
        position: { x: 0.0, y: 1.2, z: 15.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.0, y: 1.6, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#8d6e63" }
      },

      // PANES MÓVILES QUE MOLESTAN (Movimiento horizontal de vaivén de un lado a otro)
      {
        id: "s2-bread-1",
        type: "moving-platform",
        position: { x: 0.0, y: 0.8, z: 8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.2, y: 0.9, z: 1.6 },
        properties: {
          isMoving: true,
          variant: "bread_roller",
          movementType: "bread_roller",
          axis: "x",
          distance: 2.6,
          speed: 2.2,
          customColor: "#d78f44"
        }
      },
      {
        id: "s2-bread-2",
        type: "moving-platform",
        position: { x: 0.0, y: 0.8, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.2, y: 0.9, z: 1.6 },
        properties: {
          isMoving: true,
          variant: "bread_roller",
          movementType: "bread_roller",
          axis: "x",
          distance: 2.6,
          speed: 2.8,
          direction: -1,
          customColor: "#d78f44"
        }
      },
      {
        id: "s2-bread-3",
        type: "moving-platform",
        position: { x: 0.0, y: 0.8, z: -4.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.4, y: 0.9, z: 1.6 },
        properties: {
          isMoving: true,
          variant: "bread_roller",
          movementType: "bread_roller",
          axis: "x",
          distance: 2.6,
          speed: 3.2,
          customColor: "#d78f44"
        }
      },
      {
        id: "s2-bread-4",
        type: "moving-platform",
        position: { x: 0.0, y: 0.8, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.2, y: 0.9, z: 1.6 },
        properties: {
          isMoving: true,
          variant: "bread_roller",
          movementType: "bread_roller",
          axis: "x",
          distance: 2.6,
          speed: 2.5,
          direction: -1,
          customColor: "#d78f44"
        }
      },

      // Horno de leña rústico al fondo (tras la meta)
      {
        id: "s2-oven-hearth",
        type: "platform",
        position: { x: 0.0, y: 1.5, z: -15.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.0, y: 2.2, z: 1.5 },
        properties: { theme: "custom_color", customColor: "#4e342e" }
      },

      // Coleccionables (dispuestos para recoger entre los panes móviles)
      { id: "s2-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s2-col-2", type: "collectible", position: { x: -2.0, y: 1.2, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s2-col-3", type: "collectible", position: { x: 2.0, y: 1.2, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s2-col-4", type: "collectible", position: { x: 0.0, y: 1.2, z: -7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al final junto al horno
      {
        id: "s2-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -13.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 3: Cuesta
  // Subida empedrada con fuerte pendiente de 0.35 rad (35% desnivel) y rocas
  // graníticas en el camino que desvían o frenan, hasta la cima con la meta.
  // ---------------------------------------------------------------------------
  3: {
    id: "world-01-level-04-stage-03",
    world: 1,
    level: 4,
    stage: 3,
    name: "Cuesta",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 22.0 },
    objects: [
      // Plataforma llana de salida (Y = 0.0, Z = 22.0)
      {
        id: "s3-plat-start",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 22.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.8, z: 8.0 },
        properties: { theme: "custom_color", customColor: "#b0bec5" }
      },
      // Bordillos de salida
      {
        id: "s3-curb-start-b",
        type: "platform",
        position: { x: 0.0, y: 0.6, z: 25.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.5, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },

      // LA GRAN CUESTA EMPINADA (Pendiente 0.35 rad = ~20 grados, longitud 38m)
      {
        id: "s3-plat-slope",
        type: "platform",
        position: { x: 0.0, y: 6.5, z: 3.5 },
        rotation: { x: -0.35, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.8, z: 38.0 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },

      // Muros laterales quitamiedos de la cuesta
      {
        id: "s3-guard-l",
        type: "platform",
        position: { x: -3.3, y: 7.0, z: 3.5 },
        rotation: { x: -0.35, y: 0, z: 0 },
        scale: { x: 0.4, y: 1.0, z: 38.0 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },
      {
        id: "s3-guard-r",
        type: "platform",
        position: { x: 3.3, y: 7.0, z: 3.5 },
        rotation: { x: -0.35, y: 0, z: 0 },
        scale: { x: 0.4, y: 1.0, z: 38.0 },
        properties: { theme: "custom_color", customColor: "#546e7a" }
      },

      // PIEDRAS Y ROCAS EN EL CAMINO (Obstáculos sólidos a esquivar durante la subida)
      {
        id: "s3-rock-1",
        type: "platform",
        position: { x: -1.6, y: 2.4, z: 14.0 },
        rotation: { x: 0.1, y: 0.4, z: 0 },
        scale: { x: 1.4, y: 1.1, z: 1.4 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },
      {
        id: "s3-rock-2",
        type: "platform",
        position: { x: 1.8, y: 4.2, z: 9.0 },
        rotation: { x: -0.1, y: 0.6, z: 0.2 },
        scale: { x: 1.5, y: 1.2, z: 1.3 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },
      {
        id: "s3-rock-3",
        type: "platform",
        position: { x: -1.5, y: 6.2, z: 3.5 },
        rotation: { x: 0.2, y: -0.3, z: 0 },
        scale: { x: 1.6, y: 1.3, z: 1.5 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },
      {
        id: "s3-rock-4",
        type: "platform",
        position: { x: 1.6, y: 8.5, z: -2.5 },
        rotation: { x: -0.2, y: 0.8, z: -0.1 },
        scale: { x: 1.4, y: 1.1, z: 1.4 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },
      {
        id: "s3-rock-5",
        type: "platform",
        position: { x: -1.4, y: 10.8, z: -8.5 },
        rotation: { x: 0.15, y: 0.2, z: 0 },
        scale: { x: 1.5, y: 1.2, z: 1.5 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },

      // Meseta superior de la cima (Y = 13.0, Z = -16.5)
      {
        id: "s3-plat-summit",
        type: "platform",
        position: { x: 0.0, y: 13.0, z: -16.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.0, y: 0.8, z: 8.0 },
        properties: { theme: "custom_color", customColor: "#b0bec5" }
      },
      // Bordillo de la cima
      {
        id: "s3-curb-summit-f",
        type: "platform",
        position: { x: 0.0, y: 13.6, z: -20.3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.0, y: 0.5, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },

      // Farolas a lo largo de la cuesta
      { id: "s3-lamp-1", type: "decoration", position: { x: -4.0, y: 0.4, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "s3-lamp-2", type: "decoration", position: { x: 4.0, y: 0.4, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "s3-lamp-3", type: "decoration", position: { x: -4.0, y: 13.4, z: -16.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "s3-lamp-4", type: "decoration", position: { x: 4.0, y: 13.4, z: -16.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },

      // Coleccionables en zigzag
      { id: "s3-col-1", type: "collectible", position: { x: 1.5, y: 2.2, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s3-col-2", type: "collectible", position: { x: -1.5, y: 5.2, z: 7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s3-col-3", type: "collectible", position: { x: 1.5, y: 8.5, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s3-col-4", type: "collectible", position: { x: 0.0, y: 14.2, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta en la cima
      {
        id: "s3-goal",
        type: "goal",
        position: { x: 0.0, y: 13.8, z: -17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 4: Muro1
  // Gran muro divisorio con 3 agujeros redondos. Una maquinaria con un tubo
  // transportador se detiene 1 segundo en cada agujero; el jugador debe calcular el
  // timing para entrar al tubo y pasar al otro lado del muro hacia la meta.
  // ---------------------------------------------------------------------------
  4: {
    id: "world-01-level-04-stage-04",
    world: 1,
    level: 4,
    stage: 4,
    name: "Muro1",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 9.0 },
    objects: [
      // Zona A: Patio de salida
      {
        id: "s4-plat-side-a",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 7.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 13.0, y: 0.8, z: 12.0 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      // Bordillos de seguridad Zona A
      {
        id: "s4-curb-a-back",
        type: "platform",
        position: { x: 0.0, y: 0.6, z: 12.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 13.0, y: 0.6, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      {
        id: "s4-curb-a-left",
        type: "platform",
        position: { x: -6.3, y: 0.6, z: 7.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.6, z: 12.0 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      {
        id: "s4-curb-a-right",
        type: "platform",
        position: { x: 6.3, y: 0.6, z: 7.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.6, z: 12.0 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },

      // EL ENORME MURO (Z = 0.0, Altura 7m, con 3 arcos/huecos circulares en X = -4.0, 0.0, 4.0)
      // Pilar extremo izquierdo
      {
        id: "s4-wall-post-l",
        type: "platform",
        position: { x: -5.8, y: 3.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.0, y: 7.0, z: 1.6 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },
      // Pilar intermedio 1 (entre agujero 1 y 2)
      {
        id: "s4-wall-col-1",
        type: "platform",
        position: { x: -2.0, y: 3.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.6, y: 7.0, z: 1.6 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },
      // Pilar intermedio 2 (entre agujero 2 y 3)
      {
        id: "s4-wall-col-2",
        type: "platform",
        position: { x: 2.0, y: 3.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.6, y: 7.0, z: 1.6 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },
      // Pilar extremo derecho
      {
        id: "s4-wall-post-r",
        type: "platform",
        position: { x: 5.8, y: 3.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.0, y: 7.0, z: 1.6 },
        properties: { theme: "custom_color", customColor: "#455a64" }
      },
      // Dintel superior continuo del muro (por encima de los 3 agujeros)
      {
        id: "s4-wall-lintel",
        type: "platform",
        position: { x: 0.0, y: 5.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 13.6, y: 3.0, z: 1.8 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },

      // LA MAQUINARIA CON TUBO MÓVIL EN FORMA DE CIRCUNFERENCIA HUECA
      // Tubo abierto por ambos extremos para poder entrar rodando y cruzar al otro lado del muro
      {
        id: "s4-pipe-machinery",
        type: "moving-platform",
        position: { x: 0.0, y: 1.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.9, y: 2.9, z: 3.6 },
        properties: {
          isMoving: true,
          variant: "pipe_shuttle",
          movementType: "pipe_shuttle",
          customColor: "#ff9800"
        }
      },

      // Zona B: Patio de llegada con la meta (Z < 0)
      {
        id: "s4-plat-side-b",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -7.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 13.0, y: 0.8, z: 12.0 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      {
        id: "s4-curb-b-front",
        type: "platform",
        position: { x: 0.0, y: 0.6, z: -12.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 13.0, y: 0.6, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },

      // Coleccionables
      { id: "s4-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s4-col-2", type: "collectible", position: { x: -4.0, y: 1.2, z: 3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s4-col-3", type: "collectible", position: { x: 4.0, y: 1.2, z: 3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s4-col-4", type: "collectible", position: { x: 0.0, y: 1.2, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al otro lado del muro
      {
        id: "s4-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -9.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos4
  // Circuito de precisión en la plaza con obstáculos arquitectónicos y
  // coleccionables distribuidos en patrones nuevos en altura y curvas.
  // ---------------------------------------------------------------------------
  5: {
    id: "world-01-level-04-stage-05",
    world: 1,
    level: 4,
    stage: 5,
    name: "Objetos4",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 10.5 },
    objects: [
      {
        id: "s5-plat-main",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 26.0, y: 0.8, z: 26.0 },
        properties: { theme: "custom_color", customColor: "#eceff1" }
      },
      // Pista interior empedrada
      {
        id: "s5-plat-court",
        type: "platform",
        position: { x: 0.0, y: 0.42, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 18.0, y: 0.04, z: 18.0 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      // Vallas perimetrales
      { id: "s5-fence-1", type: "decoration", position: { x: -12.5, y: 0.4, z: 8.0 }, rotation: { x: 0, y: 1.571, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "fence" } },
      { id: "s5-fence-2", type: "decoration", position: { x: -12.5, y: 0.4, z: -8.0 }, rotation: { x: 0, y: 1.571, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "fence" } },
      { id: "s5-fence-3", type: "decoration", position: { x: 12.5, y: 0.4, z: 8.0 }, rotation: { x: 0, y: 1.571, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "fence" } },
      { id: "s5-fence-4", type: "decoration", position: { x: 12.5, y: 0.4, z: -8.0 }, rotation: { x: 0, y: 1.571, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "fence" } },

      // Fuentes decorativas secas gemelas
      {
        id: "s5-basin-l",
        type: "platform",
        position: { x: -6.0, y: 0.7, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.5, y: 0.6, z: 3.5 },
        properties: { theme: "custom_color", customColor: "#90a4ae", shape: "cylinder" }
      },
      {
        id: "s5-basin-r",
        type: "platform",
        position: { x: 6.0, y: 0.7, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.5, y: 0.6, z: 3.5 },
        properties: { theme: "custom_color", customColor: "#90a4ae", shape: "cylinder" }
      },

      // Farolas
      { id: "s5-lamp-1", type: "decoration", position: { x: -8.0, y: 0.4, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "s5-lamp-2", type: "decoration", position: { x: 8.0, y: 0.4, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "s5-lamp-3", type: "decoration", position: { x: -8.0, y: 0.4, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "s5-lamp-4", type: "decoration", position: { x: 8.0, y: 0.4, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },

      // Coleccionables (distribución renovada en estrella)
      { id: "s5-col-1", type: "collectible", position: { x: -6.0, y: 1.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-2", type: "collectible", position: { x: 6.0, y: 1.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-3", type: "collectible", position: { x: 0.0, y: 1.2, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-4", type: "collectible", position: { x: 0.0, y: 1.2, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-5", type: "collectible", position: { x: -4.0, y: 1.2, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-6", type: "collectible", position: { x: 4.0, y: 1.2, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-7", type: "collectible", position: { x: -4.0, y: 1.2, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s5-col-8", type: "collectible", position: { x: 4.0, y: 1.2, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al norte
      {
        id: "s5-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -10.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 6: Día
  // Supermercado DÍA con pasillo refrigerado de 42m (>35m), estanterías del frío
  // iluminadas con cristal, y packs gigantes de yogures de sabores que esquivar.
  // ---------------------------------------------------------------------------
  6: {
    id: "world-01-level-04-stage-06",
    world: 1,
    level: 4,
    stage: 6,
    name: "Día",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 18.5 },
    objects: [
      // Pasillo central del supermercado (Longitud 42m, mayor a los 35m solicitados)
      {
        id: "s6-dia-aisle",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.5, y: 0.8, z: 42.0 },
        properties: { theme: "custom_color", customColor: "#ffffff" }
      },
      // Estantería de frío izquierda con vitrinas y leds azules
      {
        id: "s6-fridge-left",
        type: "platform",
        position: { x: -3.5, y: 1.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.8, y: 2.8, z: 42.0 },
        properties: { theme: "custom_color", customColor: "#b0bec5" }
      },
      // Friso superior rojo corporativo DÍA izquierdo
      {
        id: "s6-dia-header-l",
        type: "platform",
        position: { x: -3.5, y: 3.4, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 0.6, z: 42.0 },
        properties: { theme: "custom_color", customColor: "#d32f2f" }
      },
      // Estantería de frío derecha
      {
        id: "s6-fridge-right",
        type: "platform",
        position: { x: 3.5, y: 1.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.8, y: 2.8, z: 42.0 },
        properties: { theme: "custom_color", customColor: "#b0bec5" }
      },
      // Friso superior rojo corporativo DÍA derecho
      {
        id: "s6-dia-header-r",
        type: "platform",
        position: { x: 3.5, y: 3.4, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 0.6, z: 42.0 },
        properties: { theme: "custom_color", customColor: "#d32f2f" }
      },

      // OBSTÁCULOS DE YOGURES EN EL PASILLO (Packs gigantes de sabores que hay que esquivar)
      // Pack Yogur Fresa (Rosa vibrante)
      {
        id: "s6-yogurt-fresa-1",
        type: "platform",
        position: { x: -1.6, y: 0.8, z: 12.0 },
        rotation: { x: 0, y: 0.2, z: 0 },
        scale: { x: 2.0, y: 0.9, z: 1.8 },
        properties: { theme: "custom_color", customColor: "#f06292" }
      },
      // Pack Yogur Plátano (Amarillo)
      {
        id: "s6-yogurt-platano-1",
        type: "platform",
        position: { x: 1.6, y: 0.8, z: 6.0 },
        rotation: { x: 0, y: -0.25, z: 0 },
        scale: { x: 2.0, y: 0.9, z: 1.8 },
        properties: { theme: "custom_color", customColor: "#ffee58" }
      },
      // Pack Yogur Griego (Azul intenso)
      {
        id: "s6-yogurt-griego-1",
        type: "platform",
        position: { x: -1.4, y: 0.8, z: 0.0 },
        rotation: { x: 0, y: 0.3, z: 0 },
        scale: { x: 2.2, y: 0.9, z: 1.8 },
        properties: { theme: "custom_color", customColor: "#1e88e5" }
      },
      // Pack Yogur Natural (Blanco crema)
      {
        id: "s6-yogurt-natural-1",
        type: "platform",
        position: { x: 1.5, y: 0.8, z: -6.0 },
        rotation: { x: 0, y: -0.15, z: 0 },
        scale: { x: 2.0, y: 0.9, z: 1.8 },
        properties: { theme: "custom_color", customColor: "#fff9c4" }
      },
      // Pack Yogur Muesli / Fibras
      {
        id: "s6-yogurt-muesli-1",
        type: "platform",
        position: { x: -1.5, y: 0.8, z: -12.0 },
        rotation: { x: 0, y: 0.2, z: 0 },
        scale: { x: 2.0, y: 0.9, z: 1.8 },
        properties: { theme: "custom_color", customColor: "#8d6e63" }
      },

      // RÓTULOS OFICIALES SUPERMERCADOS DÍA %
      // Gran portal de entrada con el logotipo corporativo DÍA %
      {
        id: "s6-dia-entrance-logo",
        type: "decoration",
        position: { x: 0.0, y: 2.2, z: 20.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.1, y: 1.1, z: 1.1 },
        properties: { subType: "dia_sign", hasCollision: false }
      },
      // Cartel luminoso suspendido en mitad del pasillo
      {
        id: "s6-dia-mid-logo",
        type: "decoration",
        position: { x: 0.0, y: 4.4, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.9, y: 0.9, z: 0.9 },
        properties: { subType: "dia_sign", hasCollision: false }
      },
      // Cartel de salida / cajas sobre la meta
      {
        id: "s6-dia-goal-logo",
        type: "decoration",
        position: { x: 0.0, y: 2.2, z: -20.0 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: { x: 1.1, y: 1.1, z: 1.1 },
        properties: { subType: "dia_sign", hasCollision: false }
      },

      // Carritos de compra rojos en el pasillo
      {
        id: "s6-cart-1",
        type: "platform",
        position: { x: 1.8, y: 0.8, z: 15.0 },
        rotation: { x: 0, y: 0.4, z: 0 },
        scale: { x: 1.2, y: 1.1, z: 1.6 },
        properties: { theme: "custom_color", customColor: "#d32f2f" }
      },

      // Coleccionables a lo largo del pasillo
      { id: "s6-col-1", type: "collectible", position: { x: 1.5, y: 1.2, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s6-col-2", type: "collectible", position: { x: -1.5, y: 1.2, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s6-col-3", type: "collectible", position: { x: 1.5, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s6-col-4", type: "collectible", position: { x: 0.0, y: 1.2, z: -9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta en la zona de cajas al final
      {
        id: "s6-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -18.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 7: Ayuntamiento
  // Plataforma redonda con la esfera de un reloj antiguo del Ayuntamiento.
  // Dos agujas cinemáticas (horaria y minutera) giran intentando tirarte de la torre.
  // ---------------------------------------------------------------------------
  7: {
    id: "world-01-level-04-stage-07",
    world: 1,
    level: 4,
    stage: 7,
    name: "Ayuntamiento",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 8.0 },
    objects: [
      // Plataforma redonda: Esfera del reloj antiguo (Diámetro 19m)
      {
        id: "s7-clock-face",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 19.0, y: 0.8, z: 19.0 },
        properties: { theme: "custom_color", customColor: "#f5f5f5", shape: "cylinder" }
      },
      // Marco perimetral de bronce del reloj
      {
        id: "s7-clock-rim",
        type: "platform",
        position: { x: 0.0, y: 0.45, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 19.4, y: 0.15, z: 19.4 },
        properties: { theme: "custom_color", customColor: "#b8860b", shape: "cylinder" }
      },

      // Eje central de las agujas
      {
        id: "s7-clock-pinion",
        type: "platform",
        position: { x: 0.0, y: 0.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.6, y: 0.8, z: 1.6 },
        properties: { theme: "custom_color", customColor: "#b8860b", shape: "cylinder" }
      },

      // AGUJA HORARIA (Más corta y gruesa, gira a velocidad constante)
      {
        id: "s7-hour-hand",
        type: "moving-platform",
        position: { x: 0.0, y: 0.65, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.6, y: 0.4, z: 5.6 },
        properties: {
          isMoving: true,
          variant: "clock_hand",
          movementType: "clock_hand",
          rotSpeed: 0.55,
          customColor: "#212121"
        }
      },

      // AGUJA MINUTERA (Más larga y rápida, barre toda la esfera intentando tirarte)
      {
        id: "s7-minute-hand",
        type: "moving-platform",
        position: { x: 0.0, y: 0.85, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 8.6 },
        properties: {
          isMoving: true,
          variant: "clock_hand",
          movementType: "clock_hand",
          rotSpeed: 1.25,
          customColor: "#b71c1c"
        }
      },

      // Pasarela hacia el balcón del Ayuntamiento (Salida con la meta)
      {
        id: "s7-balcony-bridge",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -10.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.0, y: 0.8, z: 4.0 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      // Barandillas del balcón
      { id: "s7-fence-b1", type: "decoration", position: { x: -2.0, y: 0.4, z: -11.0 }, rotation: { x: 0, y: 1.571, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "fence" } },
      { id: "s7-fence-b2", type: "decoration", position: { x: 2.0, y: 0.4, z: -11.0 }, rotation: { x: 0, y: 1.571, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "fence" } },

      // Coleccionables (en los 4 cuadrantes del reloj: a las 3, 6, 9 y 12)
      { id: "s7-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s7-col-2", type: "collectible", position: { x: -6.0, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s7-col-3", type: "collectible", position: { x: 6.0, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s7-col-4", type: "collectible", position: { x: 0.0, y: 1.2, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta en el balcón del ayuntamiento
      {
        id: "s7-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -11.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 8: Cojera
  // Plataforma rectangular por la que avanza un personaje con muletas y la pierna
  // con escayola que se te acerca y lanza una patada; tienes que esquivarlo y continuar.
  // ---------------------------------------------------------------------------
  8: {
    id: "world-01-level-04-stage-08",
    world: 1,
    level: 4,
    stage: 8,
    name: "Cojera",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 16.0 },
    objects: [
      // Calle empedrada recta
      {
        id: "s8-street-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.5, y: 0.8, z: 38.0 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },
      // Bordillo izquierdo con acera
      {
        id: "s8-curb-left",
        type: "platform",
        position: { x: -4.0, y: 0.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.5, z: 38.0 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      // Bordillo derecho con acera
      {
        id: "s8-curb-right",
        type: "platform",
        position: { x: 4.0, y: 0.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.5, z: 38.0 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },

      // EL PERSONAJE CON MULETAS Y ESCAYOLA (Avanza cojeando y mete una patada física)
      {
        id: "s8-kicking-character",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.4, y: 2.2, z: 2.0 },
        properties: {
          isMoving: true,
          variant: "limp_kicker",
          movementType: "limp_kicker",
          speed: 1.2
        }
      },

      // Farolas a los lados
      { id: "s8-lamp-1", type: "decoration", position: { x: -3.6, y: 0.4, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "s8-lamp-2", type: "decoration", position: { x: 3.6, y: 0.4, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "s8-lamp-3", type: "decoration", position: { x: -3.6, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "s8-lamp-4", type: "decoration", position: { x: 3.6, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },

      // Coleccionables
      { id: "s8-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s8-col-2", type: "collectible", position: { x: -2.8, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s8-col-3", type: "collectible", position: { x: 2.8, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s8-col-4", type: "collectible", position: { x: 0.0, y: 1.2, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al final de la calle
      {
        id: "s8-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -16.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 9: Concierto
  // Escenario de concierto con batería, guitarra eléctrica, micrófono y torres de
  // altavoces gigantes; todo vibra con potentes ondas de sonido de graves que te mueven.
  // ---------------------------------------------------------------------------
  9: {
    id: "world-01-level-04-stage-09",
    world: 1,
    level: 4,
    stage: 9,
    name: "Concierto",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.6, z: 9.0 },
    objects: [
      // Tarima del escenario del concierto
      {
        id: "s9-stage-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 14.0, y: 1.0, z: 22.0 },
        properties: { theme: "custom_color", customColor: "#212121" }
      },
      // Perímetro metálico truss del escenario
      {
        id: "s9-truss-l",
        type: "platform",
        position: { x: -6.8, y: 0.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.6, z: 22.0 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },
      {
        id: "s9-truss-r",
        type: "platform",
        position: { x: 6.8, y: 0.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.6, z: 22.0 },
        properties: { theme: "custom_color", customColor: "#90a4ae" }
      },

      // PLATAFORMA DE VIBRACIÓN RÍTMICA DEL CONCIERTO ("todo vibra y te mueve")
      {
        id: "s9-concert-vibrator",
        type: "moving-platform",
        position: { x: 0.0, y: 0.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 13.0, y: 0.2, z: 20.0 },
        properties: {
          isMoving: true,
          variant: "concert_vibe",
          movementType: "concert_vibe",
          speed: 1.33
        }
      },

      // Torres de amplificadores gigantes a los flancos
      {
        id: "s9-amp-stack-l",
        type: "platform",
        position: { x: -5.4, y: 1.8, z: -2.0 },
        rotation: { x: 0, y: 0.2, z: 0 },
        scale: { x: 1.6, y: 2.6, z: 3.5 },
        properties: { theme: "custom_color", customColor: "#111111" }
      },
      {
        id: "s9-amp-stack-r",
        type: "platform",
        position: { x: 5.4, y: 1.8, z: -2.0 },
        rotation: { x: 0, y: -0.2, z: 0 },
        scale: { x: 1.6, y: 2.6, z: 3.5 },
        properties: { theme: "custom_color", customColor: "#111111" }
      },

      // Batería en el centro del escenario (tarima y tambores)
      {
        id: "s9-drum-riser",
        type: "platform",
        position: { x: 0.0, y: 0.8, z: -4.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.8, y: 0.6, z: 3.2 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },

      // Coleccionables
      { id: "s9-col-1", type: "collectible", position: { x: 0.0, y: 1.5, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s9-col-2", type: "collectible", position: { x: -3.5, y: 1.5, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s9-col-3", type: "collectible", position: { x: 3.5, y: 1.5, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s9-col-4", type: "collectible", position: { x: 0.0, y: 1.8, z: -4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta en la salida del backstage
      {
        id: "s9-goal",
        type: "goal",
        position: { x: 0.0, y: 1.0, z: -8.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 10: Banderitas
  // Réplica de la histórica Plaza Mayor de Villamanta en fiestas patronales, con
  // la gran fuente de piedra central, guirnaldas de banderitas de España cruzando
  // la plaza y un apoteósico espectáculo de fuegos artificiales por todos lados.
  // ---------------------------------------------------------------------------
  10: {
    id: "world-01-level-04-stage-10",
    world: 1,
    level: 4,
    stage: 10,
    name: "Banderitas",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 13.0 },
    objects: [
      // Pavimento empedrado de la Plaza Mayor de Villamanta
      {
        id: "s10-plaza-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 26.0, y: 0.8, z: 32.0 },
        properties: { theme: "custom_color", customColor: "#cfd8dc" }
      },

      // Bordillos ornamentales de la plaza
      {
        id: "s10-plaza-curb-s",
        type: "platform",
        position: { x: 0.0, y: 0.6, z: 15.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 26.0, y: 0.6, z: 0.4 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      {
        id: "s10-plaza-curb-w",
        type: "platform",
        position: { x: -12.8, y: 0.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.6, z: 32.0 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },
      {
        id: "s10-plaza-curb-e",
        type: "platform",
        position: { x: 12.8, y: 0.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.6, z: 32.0 },
        properties: { theme: "custom_color", customColor: "#78909c" }
      },

      // LA GRAN FUENTE MONUMENTAL DE PIEDRA (Centro de la plaza)
      {
        id: "s10-fountain-basin",
        type: "platform",
        position: { x: 0.0, y: 0.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.6, z: 7.0 },
        properties: { theme: "custom_color", customColor: "#90a4ae", shape: "cylinder" }
      },
      // Agua de la fuente
      {
        id: "s10-fountain-water",
        type: "water",
        position: { x: 0.0, y: 0.85, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.6, y: 0.3, z: 5.6 }
      },
      // Columna central de la fuente
      {
        id: "s10-fountain-spire",
        type: "platform",
        position: { x: 0.0, y: 1.6, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.2, y: 1.8, z: 1.2 },
        properties: { theme: "custom_color", customColor: "#607d8b", shape: "cylinder" }
      },

      // Guirnaldas de Banderitas de España en la plaza
      {
        id: "s10-garland-1",
        type: "platform",
        position: { x: -6.0, y: 3.2, z: 6.0 },
        rotation: { x: 0, y: 0.35, z: -0.05 },
        scale: { x: 12.0, y: 0.3, z: 0.05 },
        properties: { theme: "custom_color", customColor: "#ffeb3b" }
      },
      {
        id: "s10-garland-2",
        type: "platform",
        position: { x: 6.0, y: 3.2, z: 6.0 },
        rotation: { x: 0, y: -0.35, z: 0.05 },
        scale: { x: 12.0, y: 0.3, z: 0.05 },
        properties: { theme: "custom_color", customColor: "#f44336" }
      },
      {
        id: "s10-garland-3",
        type: "platform",
        position: { x: -6.0, y: 3.2, z: -6.0 },
        rotation: { x: 0, y: -0.35, z: -0.05 },
        scale: { x: 12.0, y: 0.3, z: 0.05 },
        properties: { theme: "custom_color", customColor: "#ffeb3b" }
      },
      {
        id: "s10-garland-4",
        type: "platform",
        position: { x: 6.0, y: 3.2, z: -6.0 },
        rotation: { x: 0, y: 0.35, z: 0.05 },
        scale: { x: 12.0, y: 0.3, z: 0.05 },
        properties: { theme: "custom_color", customColor: "#f44336" }
      },

      // Farolas festivas
      { id: "s10-lamp-1", type: "decoration", position: { x: -10.0, y: 0.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "s10-lamp-2", type: "decoration", position: { x: 10.0, y: 0.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "s10-lamp-3", type: "decoration", position: { x: -10.0, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },
      { id: "s10-lamp-4", type: "decoration", position: { x: 10.0, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "lantern" } },

      // EL HISTÓRICO AYUNTAMIENTO DE VILLAMANTA (Fondo monumental detrás de la meta)
      {
        id: "s10-ayuntamiento-villamanta",
        type: "decoration",
        position: { x: 0.0, y: 0.4, z: -19.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "town_hall", hasCollision: true }
      },

      // Bancos tradicionales de la Plaza Mayor de Villamanta
      { id: "s10-bench-1", type: "decoration", position: { x: -8.8, y: 0.4, z: 6.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "bench", hasCollision: true } },
      { id: "s10-bench-2", type: "decoration", position: { x: 8.8, y: 0.4, z: 6.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "bench", hasCollision: true } },
      { id: "s10-bench-3", type: "decoration", position: { x: -8.8, y: 0.4, z: -6.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "bench", hasCollision: true } },
      { id: "s10-bench-4", type: "decoration", position: { x: 8.8, y: 0.4, z: -6.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "bench", hasCollision: true } },

      // Baterías de cohetes pirotécnicos en los bordes de la plaza
      { id: "s10-rocket-1", type: "decoration", position: { x: -11.5, y: 0.4, z: 4.0 }, rotation: { x: -0.15, y: 0.2, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "firework_rocket", customColor: "#e53935" } },
      { id: "s10-rocket-2", type: "decoration", position: { x: -11.5, y: 0.4, z: -4.0 }, rotation: { x: 0.15, y: -0.2, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "firework_rocket", customColor: "#ffd54f" } },
      { id: "s10-rocket-3", type: "decoration", position: { x: 11.5, y: 0.4, z: 4.0 }, rotation: { x: -0.15, y: -0.2, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "firework_rocket", customColor: "#00e5ff" } },
      { id: "s10-rocket-4", type: "decoration", position: { x: 11.5, y: 0.4, z: -4.0 }, rotation: { x: 0.15, y: 0.2, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "firework_rocket", customColor: "#76ff03" } },

      // Coleccionables (alrededor de la fuente monumental)
      { id: "s10-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s10-col-2", type: "collectible", position: { x: -4.5, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s10-col-3", type: "collectible", position: { x: 4.5, y: 1.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s10-col-4", type: "collectible", position: { x: 0.0, y: 2.6, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta festiva al norte de la plaza
      {
        id: "s10-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  }
};

for(const stage of [9,10])applyPlazaFinale(WORLD_01_LEVEL_04_STAGES[stage]);
registerStageSet(1,4,WORLD_01_LEVEL_04_STAGES);

