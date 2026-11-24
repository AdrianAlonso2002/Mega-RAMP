import publishedEditorStages from '../editor-saved/world-04.json';
import {registerStageSet} from '../StageRegistry';
import {rebuildBikeCourse} from "../BikeCourse";
import type { LevelData } from "../LevelTypes";

// =============================================================================
// MUNDO 4: CARABANCHEL (Madrid) - NIVEL 3: LAS CRUCES
// Gran Parque Urbano y Lago.
// 10 Etapas completamente diseñadas, ambientadas e interactivas:
//  E1: Bici2 (Ruedas colosales de 11m y 12m, pedales y cuadro de bicicleta)
//  E2: Alba de Tormes (Plataforma circular repleta de bumpers de dados de membrillo de alto rebote)
//  E3: Correr4 (Sprint de 90m por el parque con curvas peraltadas y desniveles)
//  E4: Padel3 (Pista de pádel 100% vertical con pala catapulta hacia terraza superior en el cielo)
//  E5: Objetos15 (Parque infantil con obstáculos urbanos y 5 coleccionables selectos)
//  E6: Parque Pirata (Barco pirata de madera con mástiles y plataformas móviles horizontales)
//  E7: Carrefour (Laberinto gigante de 100m x 50m con muros de sobres de cartas Pokémon)
//  E8: Escaleras Republicanas (Escalinata tricolor rojo-amarillo-morado con escalones alternados)
//  E9: Parque Aluche (Descenso en carril bici cada vez más empinado y salto a meta en el aire)
//  E10: Lago (Estanque gigante con chorro géiser propulsor que te catapulta a la meta aérea)
// =============================================================================

export const WORLD_04_LEVEL_03_STAGES: Record<number, LevelData> = {
  // ---------------------------------------------------------------------------
  // ETAPA 1: Bici2
  // Versión mejorada y más desafiante de Bici: ruedas verticales gigantes
  // (11m y 12m de diámetro) con radios, cuadro rojo carrera, sillín basculante,
  // pedales giratorios a cadencia, manillar con frenos y meta en el buje frontal.
  // ---------------------------------------------------------------------------
  1: {
    id: "world-04-level-03-stage-01",
    world: 4,
    level: 3,
    stage: 1,
    name: "Bici2",
    theme: "city",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 12.0, z: 42.0 },
    objects: [
      // Muelle de salida elevado a la altura de la cumbre de la rueda trasera
      {
        id: "w4s31-start-dock",
        type: "platform",
        position: { x: 0.0, y: 11.0, z: 42.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.5, y: 0.8, z: 6.0 },
        properties: { theme: "carabanchel" }
      },
      { id: "w4s31-start-curb", type: "platform", position: { x: 0.0, y: 11.6, z: 44.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.5, y: 0.4, z: 0.4 }, properties: { theme: "custom_color", customColor: "#e53935" } },

      // 1. RUEDA TRASERA VERTICAL GIGANTE (Radio 5.5m = Diámetro 11.0m)
      {
        id: "w4s31-rear-vertical-wheel",
        type: "moving-platform",
        position: { x: 0.0, y: 5.5, z: 32.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.2, y: 0.5, z: 3.2 },
        properties: {
          variant: "bike_wheel_vertical",
          movementType: "bike_wheel_vertical",
          radius: 5.5,
          distance: 14.0,
          speed: 2.0
        }
      },

      // 2. VAINAS TRASERAS Y CUADRO DE BICICLETA (Rojo carrera deportivo)
      {
        id: "w4s31-chainstays",
        type: "platform",
        position: { x: 0.0, y: 9.8, z: 20.0 },
        rotation: { x: -0.22, y: 0, z: 0 },
        scale: { x: 2.8, y: 0.7, z: 10.0 },
        properties: { theme: "custom_color", customColor: "#d32f2f" }
      },

      // 3. SILLÍN DE BICICLETA (Cuero negro con remaches)
      {
        id: "w4s31-saddle",
        type: "platform",
        position: { x: 0.0, y: 11.8, z: 14.5 },
        rotation: { x: 0.06, y: 0, z: 0 },
        scale: { x: 3.2, y: 0.6, z: 4.8 },
        properties: { theme: "custom_color", customColor: "#212121" }
      },

      // 4. EJE DEL PEDALIER Y PLATOS
      {
        id: "w4s31-crank-hub",
        type: "platform",
        position: { x: 0.0, y: 6.8, z: 11.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.2, y: 0.9, z: 4.2 },
        properties: { theme: "custom_color", customColor: "#37474f", shape: "cylinder" }
      },

      // 5. PEDALES GIRATORIOS CON CADENCIA REALISTA
      {
        id: "w4s31-pedal-left",
        type: "moving-platform",
        position: { x: -3.2, y: 6.8, z: 11.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.6, y: 0.4, z: 2.0 },
        properties: {
          variant: "bike_pedal",
          movementType: "bike_pedal",
          radius: 2.2,
          speed: 2.0,
          phase: Math.PI
        }
      },
      {
        id: "w4s31-pedal-right",
        type: "moving-platform",
        position: { x: 3.2, y: 6.8, z: 11.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.6, y: 0.4, z: 2.0 },
        properties: {
          variant: "bike_pedal",
          movementType: "bike_pedal",
          radius: 2.2,
          speed: 2.0,
          phase: 0.0
        }
      },

      // 6. BARRA HORIZONTAL SUPERIOR DEL CUADRO (Tubo superior)
      {
        id: "w4s31-top-tube",
        type: "platform",
        position: { x: 0.0, y: 11.5, z: 4.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.4, y: 0.6, z: 15.0 },
        properties: { theme: "custom_color", customColor: "#d32f2f" }
      },

      // 7. MANILLAR GIGANTE DE CARRERAS (Con puños negros y manetas de freno)
      {
        id: "w4s31-handlebar-stem",
        type: "platform",
        position: { x: 0.0, y: 12.8, z: -4.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.8, y: 0.6, z: 1.8 },
        properties: { theme: "custom_color", customColor: "#263238" }
      },
      { id: "w4s31-grip-l", type: "platform", position: { x: -4.2, y: 12.8, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.0, y: 0.7, z: 2.4 }, properties: { theme: "custom_color", customColor: "#e53935" } },
      { id: "w4s31-grip-r", type: "platform", position: { x: 4.2, y: 12.8, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.0, y: 0.7, z: 2.4 }, properties: { theme: "custom_color", customColor: "#e53935" } },

      // 8. HORQUILLA DELANTERA DESCENDENTE HACIA EL BUJE
      {
        id: "w4s31-front-fork",
        type: "platform",
        position: { x: 0.0, y: 9.4, z: -10.5 },
        rotation: { x: 0.38, y: 0, z: 0 },
        scale: { x: 2.8, y: 0.6, z: 12.0 },
        properties: { theme: "custom_color", customColor: "#d32f2f" }
      },

      // 9. RUEDA DELANTERA VERTICAL COLOSAL (Radio 6.0m = Diámetro 12.0m)
      {
        id: "w4s31-front-vertical-wheel",
        type: "moving-platform",
        position: { x: 0.0, y: 6.0, z: -18.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.2, y: 0.5, z: 3.2 },
        properties: {
          variant: "bike_wheel_vertical",
          movementType: "bike_wheel_vertical",
          radius: 6.0,
          distance: 16.0,
          speed: 2.2
        }
      },

      // 10. PLATAFORMA DE META FINAL
      {
        id: "w4s31-goal-dock",
        type: "platform",
        position: { x: 0.0, y: 11.5, z: -32.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.8, z: 8.0 },
        properties: { platformShape: "cylinder", theme: "custom_color", customColor: "#ffd54f" }
      },

      // 10 Coleccionables
      { id: "w4s31-col-1", type: "collectible", position: { x: 0.0, y: 12.2, z: 36.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s31-col-2", type: "collectible", position: { x: 0.0, y: 12.2, z: 28.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s31-col-3", type: "collectible", position: { x: 0.0, y: 11.0, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s31-col-4", type: "collectible", position: { x: 0.0, y: 12.8, z: 14.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s31-col-5", type: "collectible", position: { x: -3.2, y: 8.0, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s31-col-6", type: "collectible", position: { x: 3.2, y: 8.0, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s31-col-7", type: "collectible", position: { x: 0.0, y: 12.6, z: 3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s31-col-8", type: "collectible", position: { x: 0.0, y: 13.8, z: -4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s31-col-9", type: "collectible", position: { x: 0.0, y: 13.0, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s31-col-10", type: "collectible", position: { x: 0.0, y: 12.5, z: -30.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta
      {
        id: "w4s31-goal",
        type: "goal",
        position: { x: 0.0, y: 12.3, z: -32.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 2: Alba de Tormes
  // Plataforma circular totalmente recubierta de parachoques que parecen
  // membrillos cuadrados cortados (dados de dulce de membrillo con azúcar)
  // con rebote ultraenérgico (bounce: 1.85). En el centro exacto, la meta.
  // ---------------------------------------------------------------------------
  2: {
    id: "world-04-level-03-stage-02",
    world: 4,
    level: 3,
    stage: 2,
    name: "Alba de Tormes",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 19.5 },
    objects: [
      // Gran arena circular de Alba de Tormes (Diámetro 44m)
      {
        id: "w4s32-circular-arena",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 44.0, y: 0.8, z: 44.0 },
        properties: { platformShape: "cylinder", theme: "carabanchel" }
      },

      // Anillo perimetral de seguridad para evitar caídas directas al spawn
      { id: "w4s32-dock-curb", type: "platform", position: { x: 0.0, y: 0.65, z: 21.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.0, y: 0.5, z: 0.6 }, properties: { theme: "custom_color", customColor: "#ffd54f" } },

      // PARACHOQUES DADOS DE MEMBRILLO CORTADOS (Anillo Exterior - R = 15.0m)
      { id: "w4s32-membrillo-ext-1", type: "bumper", position: { x: -14.2, y: 0.4, z: -4.6 }, rotation: { x: 0, y: 0.32, z: 0 }, scale: { x: 2.6, y: 1.4, z: 2.6 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-ext-2", type: "bumper", position: { x: -10.6, y: 0.4, z: -10.6 }, rotation: { x: 0, y: 0.78, z: 0 }, scale: { x: 2.6, y: 1.4, z: 2.6 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-ext-3", type: "bumper", position: { x: 0.0, y: 0.4, z: -15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.6, y: 1.4, z: 2.6 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-ext-4", type: "bumper", position: { x: 10.6, y: 0.4, z: -10.6 }, rotation: { x: 0, y: -0.78, z: 0 }, scale: { x: 2.6, y: 1.4, z: 2.6 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-ext-5", type: "bumper", position: { x: 14.2, y: 0.4, z: -4.6 }, rotation: { x: 0, y: -0.32, z: 0 }, scale: { x: 2.6, y: 1.4, z: 2.6 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-ext-6", type: "bumper", position: { x: 14.2, y: 0.4, z: 4.6 }, rotation: { x: 0, y: 0.32, z: 0 }, scale: { x: 2.6, y: 1.4, z: 2.6 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-ext-7", type: "bumper", position: { x: 10.6, y: 0.4, z: 10.6 }, rotation: { x: 0, y: 0.78, z: 0 }, scale: { x: 2.6, y: 1.4, z: 2.6 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-ext-8", type: "bumper", position: { x: -10.6, y: 0.4, z: 10.6 }, rotation: { x: 0, y: -0.78, z: 0 }, scale: { x: 2.6, y: 1.4, z: 2.6 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-ext-9", type: "bumper", position: { x: -14.2, y: 0.4, z: 4.6 }, rotation: { x: 0, y: -0.32, z: 0 }, scale: { x: 2.6, y: 1.4, z: 2.6 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },

      // PARACHOQUES DADOS DE MEMBRILLO (Anillo Medio - R = 10.0m)
      { id: "w4s32-membrillo-mid-1", type: "bumper", position: { x: -7.0, y: 0.4, z: -7.0 }, rotation: { x: 0, y: 0.45, z: 0 }, scale: { x: 2.4, y: 1.4, z: 2.4 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-mid-2", type: "bumper", position: { x: 0.0, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.4, y: 1.4, z: 2.4 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-mid-3", type: "bumper", position: { x: 7.0, y: 0.4, z: -7.0 }, rotation: { x: 0, y: -0.45, z: 0 }, scale: { x: 2.4, y: 1.4, z: 2.4 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-mid-4", type: "bumper", position: { x: 10.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.4, y: 1.4, z: 2.4 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-mid-5", type: "bumper", position: { x: 7.0, y: 0.4, z: 7.0 }, rotation: { x: 0, y: 0.45, z: 0 }, scale: { x: 2.4, y: 1.4, z: 2.4 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-mid-6", type: "bumper", position: { x: -7.0, y: 0.4, z: 7.0 }, rotation: { x: 0, y: -0.45, z: 0 }, scale: { x: 2.4, y: 1.4, z: 2.4 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-mid-7", type: "bumper", position: { x: -10.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.4, y: 1.4, z: 2.4 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },

      // PARACHOQUES DADOS DE MEMBRILLO (Anillo Interior Defensivo - R = 5.2m)
      { id: "w4s32-membrillo-inn-1", type: "bumper", position: { x: 0.0, y: 0.4, z: -5.2 }, rotation: { x: 0, y: 0.2, z: 0 }, scale: { x: 2.2, y: 1.4, z: 2.2 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-inn-2", type: "bumper", position: { x: 4.8, y: 0.4, z: -2.0 }, rotation: { x: 0, y: -0.3, z: 0 }, scale: { x: 2.2, y: 1.4, z: 2.2 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-inn-3", type: "bumper", position: { x: 3.8, y: 0.4, z: 3.6 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 2.2, y: 1.4, z: 2.2 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-inn-4", type: "bumper", position: { x: -3.8, y: 0.4, z: 3.6 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 2.2, y: 1.4, z: 2.2 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },
      { id: "w4s32-membrillo-inn-5", type: "bumper", position: { x: -4.8, y: 0.4, z: -2.0 }, rotation: { x: 0, y: 0.3, z: 0 }, scale: { x: 2.2, y: 1.4, z: 2.2 }, properties: { variant: "membrillo_cube", bounce: 1.85 } },

      // Pedestal dorado central para la meta
      { id: "w4s32-center-dais", type: "platform", position: { x: 0.0, y: 0.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.8, y: 0.4, z: 3.8 }, properties: { platformShape: "cylinder", theme: "custom_color", customColor: "#ffd54f" } },

      // 10 Coleccionables
      { id: "w4s32-col-1", type: "collectible", position: { x: 0.0, y: 1.0, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s32-col-2", type: "collectible", position: { x: -9.5, y: 1.0, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s32-col-3", type: "collectible", position: { x: 9.5, y: 1.0, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s32-col-4", type: "collectible", position: { x: -12.5, y: 1.0, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s32-col-5", type: "collectible", position: { x: 12.5, y: 1.0, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s32-col-6", type: "collectible", position: { x: -4.0, y: 1.0, z: -8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s32-col-7", type: "collectible", position: { x: 4.0, y: 1.0, z: -8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s32-col-8", type: "collectible", position: { x: 0.0, y: 1.0, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s32-col-9", type: "collectible", position: { x: -1.8, y: 1.0, z: 1.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s32-col-10", type: "collectible", position: { x: 1.8, y: 1.0, z: 1.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta en el centro de la plataforma circular
      {
        id: "w4s32-goal",
        type: "goal",
        position: { x: 0.0, y: 1.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 3: Correr4
  // Versión evolucionada y más larga de Correr 3: 90 metros continuos de
  // velocidad con subidas, bajadas peraltadas, crestas y chicanes en el parque.
  // ---------------------------------------------------------------------------
  3: {
    id: "world-04-level-03-stage-03",
    world: 4,
    level: 3,
    stage: 3,
    name: "Correr4",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 48.0 },
    objects: [
      // Tramo 1: Salida rápida
      { id: "w4s33-sec-1", type: "platform", position: { x: 0.0, y: 0.0, z: 42.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.5, y: 0.8, z: 18.0 }, properties: { theme: "carabanchel" } },

      // Tramo 2: Rampa ascendente hacia la cresta derecha
      { id: "w4s33-sec-2", type: "ramp", position: { x: 2.2, y: 1.4, z: 24.0 }, rotation: { x: 0.18, y: -0.15, z: 0 }, scale: { x: 6.0, y: 0.8, z: 18.0 }, properties: { theme: "carabanchel" } },

      // Tramo 3: Terraza alta del parque
      { id: "w4s33-sec-3", type: "platform", position: { x: 4.8, y: 2.8, z: 8.0 }, rotation: { x: 0, y: -0.15, z: 0 }, scale: { x: 6.5, y: 0.8, z: 16.0 }, properties: { theme: "carabanchel" } },

      // Tramo 4: Descenso peraltado hacia la izquierda
      { id: "w4s33-sec-4", type: "ramp", position: { x: 2.0, y: 1.4, z: -8.0 }, rotation: { x: -0.18, y: 0.22, z: 0 }, scale: { x: 6.0, y: 0.8, z: 16.0 }, properties: { theme: "carabanchel" } },

      // Tramo 5: Chicane central a nivel del suelo
      { id: "w4s33-sec-5", type: "platform", position: { x: -2.5, y: 0.0, z: -24.0 }, rotation: { x: 0, y: 0.20, z: 0 }, scale: { x: 6.5, y: 0.8, z: 18.0 }, properties: { theme: "carabanchel" } },

      // Tramo 6: Rampa final veloz hacia la meta
      { id: "w4s33-sec-6", type: "ramp", position: { x: -0.8, y: 0.8, z: -40.0 }, rotation: { x: 0.14, y: -0.12, z: 0 }, scale: { x: 6.0, y: 0.8, z: 16.0 }, properties: { theme: "carabanchel" } },

      // Tramo 7: Plataforma de meta
      { id: "w4s33-sec-7", type: "platform", position: { x: 0.0, y: 1.8, z: -52.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.0, y: 0.8, z: 12.0 }, properties: { theme: "carabanchel" } },

      // Pinos urbanos de Las Cruces y farolas
      { id: "w4s33-pine-1", type: "decoration", position: { x: -4.8, y: 0.0, z: 40.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.4, y: 1.5, z: 1.4 }, properties: { subType: "pine_hurdes" } },
      { id: "w4s33-pine-2", type: "decoration", position: { x: 9.0, y: 2.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.4, y: 1.5, z: 1.4 }, properties: { subType: "pine_hurdes" } },
      { id: "w4s33-lamp-1", type: "decoration", position: { x: -5.5, y: 0.0, z: -24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },

      // 10 Coleccionables
      { id: "w4s33-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 46.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s33-col-2", type: "collectible", position: { x: 0.0, y: 0.8, z: 36.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s33-col-3", type: "collectible", position: { x: 1.8, y: 1.8, z: 26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s33-col-4", type: "collectible", position: { x: 4.2, y: 3.4, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s33-col-5", type: "collectible", position: { x: 5.2, y: 3.4, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s33-col-6", type: "collectible", position: { x: 2.5, y: 2.2, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s33-col-7", type: "collectible", position: { x: -2.0, y: 0.8, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s33-col-8", type: "collectible", position: { x: -1.0, y: 1.6, z: -32.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s33-col-9", type: "collectible", position: { x: 0.0, y: 2.4, z: -44.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s33-col-10", type: "collectible", position: { x: 0.0, y: 2.4, z: -50.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta
      {
        id: "w4s33-goal",
        type: "goal",
        position: { x: 0.0, y: 2.6, z: -53.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 4: Padel3
  // Pista de pádel en orientación 100% vertical. La pala de pádel catapulta
  // te propulsa hacia arriba con un smash vertical para alcanzar la meta
  // situada horizontalmente en una terraza flotante a gran altura (Y = 26.0m).
  // ---------------------------------------------------------------------------
  4: {
    id: "world-04-level-03-stage-04",
    world: 4,
    level: 3,
    stage: 4,
    name: "Padel3",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 12.0 },
    properties: {
      cameraMode: "fixed_padel"
    },
    objects: [
      // Plataforma horizontal de servicio en la base
      {
        id: "w4s34-base-court",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 18.0, y: 0.8, z: 12.0 },
        properties: { theme: "custom_color", customColor: "#1565c0" }
      },

      // PISTA DE PÁDEL VERTICAL (Azul oficial alzado 90 grados hacia el cielo)
      {
        id: "w4s34-vertical-court-turf",
        type: "platform",
        position: { x: 0.0, y: 18.0, z: 0.0 },
        rotation: { x: -Math.PI / 2, y: 0, z: 0 },
        scale: { x: 20.0, y: 0.6, z: 36.0 },
        properties: { theme: "custom_color", customColor: "#0d47a1" }
      },

      // Muros laterales verticales de cristal y verja
      { id: "w4s34-vert-glass-l", type: "platform", position: { x: -10.2, y: 18.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 36.0, z: 3.0 }, properties: { theme: "custom_color", customColor: "#80deea" } },
      { id: "w4s34-vert-glass-r", type: "platform", position: { x: 10.2, y: 18.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 36.0, z: 3.0 }, properties: { theme: "custom_color", customColor: "#80deea" } },

      // Línea de red de pádel a media altura vertical (Y = 18.0m)
      { id: "w4s34-vert-net-ribbon", type: "platform", position: { x: 0.0, y: 18.0, z: 0.35 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20.0, y: 0.35, z: 0.35 }, properties: { theme: "custom_color", customColor: "#ffffff" } },

      // PALA DE PÁDEL CATAPULTA VERTICAL (LaunchMode = vertical: smash hacia arriba)
      {
        id: "w4s34-vertical-padel-racket",
        type: "moving-platform",
        position: { x: 0.0, y: 0.45, z: 4.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.8, y: 0.35, z: 7.2 },
        properties: {
          isMoving: true,
          variant: "padel_racket",
          movementType: "padel_racket",
          launchMode: "vertical",
          verticalImpulse: 25.5,
          isVerticalLaunch: true,
          customColor: "#00e5ff"
        }
      },

      // TERRAZA HORIZONTAL SUPERIOR SUSPENDIDA EN EL CIELO (Y = 26.0m)
      {
        id: "w4s34-sky-goal-terrace",
        type: "platform",
        position: { x: 0.0, y: 26.0, z: -5.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 14.0, y: 0.8, z: 12.0 },
        properties: { platformShape: "cylinder", theme: "custom_color", customColor: "#ffd54f" }
      },

      // Muro de contención trasero acolchado en la terraza del cielo
      { id: "w4s34-sky-backstop", type: "bumper", position: { x: 0.0, y: 27.5, z: -10.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 10.0, y: 2.2, z: 0.8 }, properties: { theme: "custom_color", customColor: "#ffb300" } },

      // 10 Coleccionables
      { id: "w4s34-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s34-col-2", type: "collectible", position: { x: -3.5, y: 0.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s34-col-3", type: "collectible", position: { x: 3.5, y: 0.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Coleccionables aéreos en el ascenso vertical
      { id: "w4s34-col-4", type: "collectible", position: { x: 0.0, y: 6.5, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.45, y: 0.45, z: 0.45 } },
      { id: "w4s34-col-5", type: "collectible", position: { x: 0.0, y: 13.0, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.45, y: 0.45, z: 0.45 } },
      { id: "w4s34-col-6", type: "collectible", position: { x: 0.0, y: 19.5, z: 0.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.45, y: 0.45, z: 0.45 } },
      { id: "w4s34-col-7", type: "collectible", position: { x: 0.0, y: 25.5, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.45, y: 0.45, z: 0.45 } },
      // Coleccionables en la terraza superior
      { id: "w4s34-col-8", type: "collectible", position: { x: -3.0, y: 26.8, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s34-col-9", type: "collectible", position: { x: 3.0, y: 26.8, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s34-col-10", type: "collectible", position: { x: 0.0, y: 26.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta horizontalmente colocada en la terraza del cielo
      {
        id: "w4s34-goal",
        type: "goal",
        position: { x: 0.0, y: 26.8, z: -5.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos15
  // Como Objetos 14 pero ambientado en el parque con menos coleccionables
  // (5 coleccionables selectos) y disposición renovada con banco, fuente y torno.
  // ---------------------------------------------------------------------------
  5: {
    id: "world-04-level-03-stage-05",
    world: 4,
    level: 3,
    stage: 5,
    name: "Objetos15",
    theme: "city",
    musicTrack: "city_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 28.0 },
    objects: [
      // Plataforma 1 (Entrada de paseo)
      { id: "w4s35-floor-1", type: "platform", position: { x: 0.0, y: 0.0, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.0, y: 0.8, z: 16.0 }, properties: { theme: "carabanchel" } },

      // Plataforma 2 (Plaza lateral derecha)
      { id: "w4s35-floor-2", type: "platform", position: { x: 4.5, y: 0.4, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.5, y: 0.8, z: 16.0 }, properties: { theme: "carabanchel" } },

      // Plataforma 3 (Plaza lateral izquierda con escalón)
      { id: "w4s35-floor-3", type: "platform", position: { x: -4.5, y: 0.8, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.5, y: 0.8, z: 16.0 }, properties: { theme: "carabanchel" } },

      // Plataforma 4 (Explanada final de meta)
      { id: "w4s35-floor-4", type: "platform", position: { x: 0.0, y: 1.2, z: -26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 9.0, y: 0.8, z: 14.0 }, properties: { theme: "carabanchel" } },

      // Rampa de enlace 1 -> 2
      { id: "w4s35-ramp-12", type: "ramp", position: { x: 2.2, y: 0.2, z: 14.0 }, rotation: { x: 0, y: -0.25, z: 0 }, scale: { x: 5.0, y: 0.8, z: 4.0 }, properties: { theme: "carabanchel" } },
      // Rampa de enlace 2 -> 3
      { id: "w4s35-ramp-23", type: "ramp", position: { x: 0.0, y: 0.6, z: -2.0 }, rotation: { x: 0, y: 0.35, z: 0 }, scale: { x: 6.0, y: 0.8, z: 5.0 }, properties: { theme: "carabanchel" } },
      // Rampa de enlace 3 -> 4
      { id: "w4s35-ramp-34", type: "ramp", position: { x: -2.2, y: 1.0, z: -18.0 }, rotation: { x: 0, y: -0.25, z: 0 }, scale: { x: 5.0, y: 0.8, z: 4.0 }, properties: { theme: "carabanchel" } },

      // Obstáculos de Parque: Bancos de madera y granito
      { id: "w4s35-bench-1", type: "platform", position: { x: -2.8, y: 0.8, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.0, y: 0.7, z: 3.2 }, properties: { theme: "custom_color", customColor: "#5d4037" } },
      { id: "w4s35-bench-2", type: "platform", position: { x: 7.2, y: 1.2, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.0, y: 0.7, z: 3.2 }, properties: { theme: "custom_color", customColor: "#5d4037" } },

      // Obstáculo: Torno giratorio de juegos infantiles (carrusel)
      {
        id: "w4s35-carousel-spinner",
        type: "rotating-platform",
        position: { x: -4.5, y: 1.2, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.35, z: 0.8 },
        properties: { isRotating: true, rotationAxis: "y", speed: 2.0, customColor: "#f59e0b" }
      },

      // Farolas clásicas de parque
      { id: "w4s35-lamp-1", type: "decoration", position: { x: 3.2, y: 0.4, z: 24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s35-lamp-2", type: "decoration", position: { x: -3.8, y: 1.6, z: -26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },

      // Exactamente 5 coleccionables (menos coleccionables que Objetos 14)
      { id: "w4s35-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s35-col-2", type: "collectible", position: { x: 4.5, y: 1.2, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s35-col-3", type: "collectible", position: { x: 0.0, y: 1.4, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s35-col-4", type: "collectible", position: { x: -4.5, y: 1.6, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s35-col-5", type: "collectible", position: { x: 0.0, y: 2.0, z: -28.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta
      {
        id: "w4s35-goal",
        type: "goal",
        position: { x: 0.0, y: 2.0, z: -30.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 6: Parque Pirata
  // Espectacular galeón pirata de madera con mástiles, velas negras con calavera
  // y cañones. El personaje debe avanzar saltando entre plataformas con
  // movimiento horizontal para llegar a la cubierta del capitán donde está la meta.
  // ---------------------------------------------------------------------------
  6: {
    id: "world-04-level-03-stage-06",
    world: 4,
    level: 3,
    stage: 6,
    name: "Parque Pirata",
    theme: "city",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 3.2, z: 24.0 },
    objects: [
      // Muelle de embarque pirata
      {
        id: "w4s36-start-quay",
        type: "platform",
        position: { x: 0.0, y: 2.0, z: 24.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.8, z: 6.0 },
        properties: { theme: "carabanchel" }
      },

      // PLATAFORMA MÓVIL HORIZONTAL 1 (Entre el muelle y el castillo de popa)
      {
        id: "w4s36-moving-plank-1",
        type: "moving-platform",
        position: { x: 0.0, y: 2.0, z: 18.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.8, y: 0.5, z: 3.8 },
        properties: {
          isMoving: true,
          movementType: "horizontal",
          axis: "x",
          distance: 7.0,
          speed: 1.8,
          customColor: "#8d6e63"
        }
      },

      // ESTRUCTURA MONUMENTAL DEL BARCO PIRATA (Casco, cubiertas, mástiles, velas con calavera)
      {
        id: "w4s36-pirate-ship-hull",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "pirate_ship" }
      },

      // PLATAFORMA MÓVIL HORIZONTAL 2 (Cruzando la cubierta principal a babor y estribor)
      {
        id: "w4s36-moving-plank-2",
        type: "moving-platform",
        position: { x: 0.0, y: 1.2, z: -2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.2, y: 0.5, z: 4.0 },
        properties: {
          isMoving: true,
          movementType: "horizontal",
          axis: "x",
          distance: 8.0,
          speed: 2.2,
          customColor: "#d97706"
        }
      },

      // PLATAFORMA MÓVIL HORIZONTAL 3 (Cruzando desde la proa hacia la isla de meta)
      {
        id: "w4s36-moving-plank-3",
        type: "moving-platform",
        position: { x: 0.0, y: 1.8, z: -17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.0, y: 0.5, z: 3.8 },
        properties: {
          isMoving: true,
          movementType: "horizontal",
          axis: "x",
          distance: 7.5,
          speed: 2.0,
          customColor: "#8d6e63"
        }
      },

      // Isla del Tesoro / Muelle de meta al final del barco
      {
        id: "w4s36-goal-island",
        type: "platform",
        position: { x: 0.0, y: 2.0, z: -26.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.5, y: 0.8, z: 8.5 },
        properties: { platformShape: "cylinder", theme: "custom_color", customColor: "#ffd54f" }
      },

      // 10 Coleccionables
      { id: "w4s36-col-1", type: "collectible", position: { x: 0.0, y: 2.8, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s36-col-2", type: "collectible", position: { x: 0.0, y: 2.8, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s36-col-3", type: "collectible", position: { x: 0.0, y: 2.6, z: 10.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s36-col-4", type: "collectible", position: { x: -3.0, y: 1.6, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s36-col-5", type: "collectible", position: { x: 3.0, y: 1.6, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s36-col-6", type: "collectible", position: { x: 0.0, y: 2.0, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s36-col-7", type: "collectible", position: { x: 0.0, y: 2.4, z: -10.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s36-col-8", type: "collectible", position: { x: 0.0, y: 2.6, z: -17.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s36-col-9", type: "collectible", position: { x: -2.5, y: 2.8, z: -25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s36-col-10", type: "collectible", position: { x: 2.5, y: 2.8, z: -25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta en la Isla del Tesoro
      {
        id: "w4s36-goal",
        type: "goal",
        position: { x: 0.0, y: 2.6, z: -26.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 7: Carrefour
  // Hipermercado Carrefour monumental: laberinto gigante de al menos 100m de
  // ancho x 50m de largo donde todos los muros del laberinto son sobres de cartas
  // coleccionables Pokémon (Charizard, Blastoise, Venusaur y Pikachu).
  // ---------------------------------------------------------------------------
  7: {
    id: "world-04-level-03-stage-07",
    world: 4,
    level: 3,
    stage: 7,
    name: "Carrefour",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 75,
    spawn: { x: 0.0, y: 1.5, z: 23.0 },
    objects: [
      // Suelo pulido del hipermercado Carrefour (100.0m de ancho x 50.0m de largo)
      {
        id: "w4s37-carrefour-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 100.0, y: 0.8, z: 50.0 },
        properties: { theme: "carabanchel" }
      },

      // Gran Pórtico Monumental Carrefour con Logotipo oficial a la entrada
      {
        id: "w4s37-entrance-arch",
        type: "platform",
        position: { x: 0.0, y: 0.4, z: 22.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 16.0, y: 6.5, z: 1.2 },
        properties: { variant: "carrefour_arch" }
      },

      // MUROS PERIMETRALES DE SOBRES POKÉMON
      { id: "w4s37-wall-n", type: "platform", position: { x: 0.0, y: 0.4, z: -24.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 99.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 0 } },
      { id: "w4s37-wall-s-l", type: "platform", position: { x: -30.0, y: 0.4, z: 24.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 38.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 1 } },
      { id: "w4s37-wall-s-r", type: "platform", position: { x: 30.0, y: 0.4, z: 24.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 38.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 2 } },
      { id: "w4s37-wall-w", type: "platform", position: { x: -49.5, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.6, y: 3.4, z: 49.0 }, properties: { variant: "pokemon_booster_wall", packIndex: 3 } },
      { id: "w4s37-wall-e", type: "platform", position: { x: 49.5, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.6, y: 3.4, z: 49.0 }, properties: { variant: "pokemon_booster_wall", packIndex: 0 } },

      // LABERINTO INTERIOR: PASILLOS FORMADOS POR SOBRES POKÉMON (Charizard, Blastoise, Venusaur, Pikachu)
      // Pasillo Fila 1 (Z = 16.0)
      { id: "w4s37-poke-1a", type: "platform", position: { x: -28.0, y: 0.4, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 26.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 0 } },
      { id: "w4s37-poke-1b", type: "platform", position: { x: 10.0, y: 0.4, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 1 } },
      { id: "w4s37-poke-1c", type: "platform", position: { x: 38.0, y: 0.4, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 16.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 2 } },

      // Pasillo Fila 2 (Z = 8.0)
      { id: "w4s37-poke-2a", type: "platform", position: { x: -40.0, y: 0.4, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 3 } },
      { id: "w4s37-poke-2b", type: "platform", position: { x: -14.0, y: 0.4, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 22.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 0 } },
      { id: "w4s37-poke-2c", type: "platform", position: { x: 24.0, y: 0.4, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 32.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 1 } },

      // Pasillo Fila 3 (Z = 0.0)
      { id: "w4s37-poke-3a", type: "platform", position: { x: -24.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 30.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 2 } },
      { id: "w4s37-poke-3b", type: "platform", position: { x: 6.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 16.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 3 } },
      { id: "w4s37-poke-3c", type: "platform", position: { x: 35.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 24.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 0 } },

      // Pasillo Fila 4 (Z = -8.0)
      { id: "w4s37-poke-4a", type: "platform", position: { x: -38.0, y: 0.4, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 16.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 1 } },
      { id: "w4s37-poke-4b", type: "platform", position: { x: -8.0, y: 0.4, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 26.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 2 } },
      { id: "w4s37-poke-4c", type: "platform", position: { x: 22.0, y: 0.4, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 3 } },

      // Pasillo Fila 5 (Z = -16.0)
      { id: "w4s37-poke-5a", type: "platform", position: { x: -20.0, y: 0.4, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 34.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 0 } },
      { id: "w4s37-poke-5b", type: "platform", position: { x: 14.0, y: 0.4, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 22.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 1 } },
      { id: "w4s37-poke-5c", type: "platform", position: { x: 38.0, y: 0.4, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 2 } },

      // Tabiques transversales que forman el laberinto
      { id: "w4s37-poke-t1", type: "platform", position: { x: -32.0, y: 0.4, z: 12.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 8.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 3 } },
      { id: "w4s37-poke-t2", type: "platform", position: { x: -6.0, y: 0.4, z: 4.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 8.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 0 } },
      { id: "w4s37-poke-t3", type: "platform", position: { x: 18.0, y: 0.4, z: 12.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 8.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 1 } },
      { id: "w4s37-poke-t4", type: "platform", position: { x: -16.0, y: 0.4, z: -4.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 8.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 2 } },
      { id: "w4s37-poke-t5", type: "platform", position: { x: 10.0, y: 0.4, z: -12.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 8.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 3 } },
      { id: "w4s37-poke-t6", type: "platform", position: { x: 30.0, y: 0.4, z: -4.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 8.0, y: 3.4, z: 0.6 }, properties: { variant: "pokemon_booster_wall", packIndex: 0 } },

      // Cajas de salida Carrefour (Línea de cajas)
      { id: "w4s37-checkout-l", type: "platform", position: { x: -8.0, y: 0.4, z: -21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.0, y: 1.1, z: 1.8 }, properties: { theme: "custom_color", customColor: "#004e9a" } },
      { id: "w4s37-checkout-r", type: "platform", position: { x: 8.0, y: 0.4, z: -21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.0, y: 1.1, z: 1.8 }, properties: { theme: "custom_color", customColor: "#004e9a" } },

      // 10 Coleccionables repartidos por los pasillos de sobres Pokémon
      { id: "w4s37-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s37-col-2", type: "collectible", position: { x: -20.0, y: 0.8, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s37-col-3", type: "collectible", position: { x: -42.0, y: 0.8, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s37-col-4", type: "collectible", position: { x: 28.0, y: 0.8, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s37-col-5", type: "collectible", position: { x: 42.0, y: 0.8, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s37-col-6", type: "collectible", position: { x: 0.0, y: 0.8, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s37-col-7", type: "collectible", position: { x: -28.0, y: 0.8, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s37-col-8", type: "collectible", position: { x: 24.0, y: 0.8, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s37-col-9", type: "collectible", position: { x: -6.0, y: 0.8, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s37-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta en la salida de cajas del Carrefour
      {
        id: "w4s37-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -23.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 8: Escaleras Republicanas
  // El icónico anfiteatro monumental junto al lago del Parque de las Cruces
  // (Carabanchel), pintado con los colores de la bandera republicana.
  // 24 escalones descendentes organizados en 3 franjas de 8 escalones (Rojo,
  // Amarillo y Morado). Empieza arriba y cada escalón se va haciendo menos grueso
  // (reduciendo 1/4 por cuarto de escalera: grosor de 1.2m a 0.3m, y huella de
  // 3.2m a 0.8m) mientras se ensancha en abanico (14m a 34m). La meta está colocada
  // abajo directamente en el último escalón (el 24), frente al lago.
  // ---------------------------------------------------------------------------
  8: {
    id: "world-04-level-03-stage-08",
    world: 4,
    level: 3,
    stage: 8,
    name: "Escaleras Republicanas",
    theme: "city",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 11.2, z: 34.0 },
    objects: [
      // Plataforma mirador superior (Cresta del anfiteatro)
      {
        id: "w4s38-summit-terrace",
        type: "platform",
        position: { x: 0.0, y: 10.0, z: 34.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 14.0, y: 0.8, z: 5.0 },
        properties: { theme: "carabanchel" }
      },

      // Frontón superior curvo rojo ("VIVA LA TERCERA REPUBLICA" de la foto)
      {
        id: "w4s38-top-red-parapet",
        type: "platform",
        position: { x: 0.0, y: 11.2, z: 36.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 18.0, y: 2.8, z: 0.8 },
        properties: { variant: "republican_fronton", theme: "custom_color", customColor: "#c62828" }
      },

      // =======================================================================
      // FRANJA ROJA REPUBLICANA (Escalones 1 a 8 - Rojo Carmesí)
      // Empiezan más gruesos y anchos en Z, fanning out en X
      // =======================================================================
      { id: "w4s38-step-01", type: "platform", position: { x: 0.0, y: 9.40, z: 29.90 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 1.20, z: 3.20 }, properties: { theme: "custom_color", customColor: "#e53935", stepNumber: 1, variant: "republican_step", band: "rojo" } },
      { id: "w4s38-step-02", type: "platform", position: { x: 0.0, y: 9.02, z: 26.75 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.9, y: 1.16, z: 3.10 }, properties: { theme: "custom_color", customColor: "#d32f2f", stepNumber: 2, variant: "republican_step", band: "rojo" } },
      { id: "w4s38-step-03", type: "platform", position: { x: 0.0, y: 8.64, z: 23.70 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 15.7, y: 1.12, z: 2.99 }, properties: { theme: "custom_color", customColor: "#e53935", stepNumber: 3, variant: "republican_step", band: "rojo" } },
      { id: "w4s38-step-04", type: "platform", position: { x: 0.0, y: 8.26, z: 20.77 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 16.6, y: 1.08, z: 2.89 }, properties: { theme: "custom_color", customColor: "#d32f2f", stepNumber: 4, variant: "republican_step", band: "rojo" } },
      { id: "w4s38-step-05", type: "platform", position: { x: 0.0, y: 7.88, z: 17.93 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 17.5, y: 1.04, z: 2.78 }, properties: { theme: "custom_color", customColor: "#e53935", stepNumber: 5, variant: "republican_step", band: "rojo" } },
      { id: "w4s38-step-06", type: "platform", position: { x: 0.0, y: 7.50, z: 15.20 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 18.3, y: 1.00, z: 2.68 }, properties: { theme: "custom_color", customColor: "#d32f2f", stepNumber: 6, variant: "republican_step", band: "rojo" } },
      { id: "w4s38-step-07", type: "platform", position: { x: 0.0, y: 7.11, z: 12.57 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 19.2, y: 0.97, z: 2.57 }, properties: { theme: "custom_color", customColor: "#e53935", stepNumber: 7, variant: "republican_step", band: "rojo" } },
      { id: "w4s38-step-08", type: "platform", position: { x: 0.0, y: 6.74, z: 10.05 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20.1, y: 0.93, z: 2.47 }, properties: { theme: "custom_color", customColor: "#d32f2f", stepNumber: 8, variant: "republican_step", band: "rojo" } },

      // =======================================================================
      // FRANJA AMARILLA GUALDA (Escalones 9 a 16 - Amarillo Gualda)
      // Reducción progresiva de espesor y huella, mayor amplitud en X
      // =======================================================================
      { id: "w4s38-step-09", type: "platform", position: { x: 0.0, y: 6.35, z: 7.63 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 21.0, y: 0.89, z: 2.37 }, properties: { theme: "custom_color", customColor: "#fbc02d", stepNumber: 9, variant: "republican_step", band: "amarillo" } },
      { id: "w4s38-step-10", type: "platform", position: { x: 0.0, y: 5.98, z: 5.32 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 21.8, y: 0.85, z: 2.26 }, properties: { theme: "custom_color", customColor: "#ffeb3b", stepNumber: 10, variant: "republican_step", band: "amarillo" } },
      { id: "w4s38-step-11", type: "platform", position: { x: 0.0, y: 5.59, z: 3.11 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 22.7, y: 0.81, z: 2.16 }, properties: { theme: "custom_color", customColor: "#fbc02d", stepNumber: 11, variant: "republican_step", band: "amarillo" } },
      { id: "w4s38-step-12", type: "platform", position: { x: 0.0, y: 5.21, z: 1.00 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 23.6, y: 0.77, z: 2.05 }, properties: { theme: "custom_color", customColor: "#ffeb3b", stepNumber: 12, variant: "republican_step", band: "amarillo" } },
      { id: "w4s38-step-13", type: "platform", position: { x: 0.0, y: 4.83, z: -0.99 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 24.4, y: 0.73, z: 1.95 }, properties: { theme: "custom_color", customColor: "#fbc02d", stepNumber: 13, variant: "republican_step", band: "amarillo" } },
      { id: "w4s38-step-14", type: "platform", position: { x: 0.0, y: 4.46, z: -2.89 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 25.3, y: 0.69, z: 1.84 }, properties: { theme: "custom_color", customColor: "#ffeb3b", stepNumber: 14, variant: "republican_step", band: "amarillo" } },
      { id: "w4s38-step-15", type: "platform", position: { x: 0.0, y: 4.08, z: -4.68 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 26.2, y: 0.65, z: 1.74 }, properties: { theme: "custom_color", customColor: "#fbc02d", stepNumber: 15, variant: "republican_step", band: "amarillo" } },
      { id: "w4s38-step-16", type: "platform", position: { x: 0.0, y: 3.69, z: -6.37 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 27.0, y: 0.61, z: 1.63 }, properties: { theme: "custom_color", customColor: "#ffeb3b", stepNumber: 16, variant: "republican_step", band: "amarillo" } },

      // =======================================================================
      // FRANJA MORADA REPUBLICANA (Escalones 17 a 24 - Morado / Violeta)
      // Escalones más delgados y veloces hacia el borde del lago
      // =======================================================================
      { id: "w4s38-step-17", type: "platform", position: { x: 0.0, y: 3.31, z: -7.94 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 27.9, y: 0.57, z: 1.53 }, properties: { theme: "custom_color", customColor: "#7b1fa2", stepNumber: 17, variant: "republican_step", band: "morado" } },
      { id: "w4s38-step-18", type: "platform", position: { x: 0.0, y: 2.94, z: -9.43 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 28.8, y: 0.53, z: 1.43 }, properties: { theme: "custom_color", customColor: "#6a1b9a", stepNumber: 18, variant: "republican_step", band: "morado" } },
      { id: "w4s38-step-19", type: "platform", position: { x: 0.0, y: 2.55, z: -10.80 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 29.7, y: 0.50, z: 1.32 }, properties: { theme: "custom_color", customColor: "#7b1fa2", stepNumber: 19, variant: "republican_step", band: "morado" } },
      { id: "w4s38-step-20", type: "platform", position: { x: 0.0, y: 2.17, z: -12.07 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 30.5, y: 0.46, z: 1.22 }, properties: { theme: "custom_color", customColor: "#6a1b9a", stepNumber: 20, variant: "republican_step", band: "morado" } },
      { id: "w4s38-step-21", type: "platform", position: { x: 0.0, y: 1.79, z: -13.23 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 31.4, y: 0.42, z: 1.11 }, properties: { theme: "custom_color", customColor: "#7b1fa2", stepNumber: 21, variant: "republican_step", band: "morado" } },
      { id: "w4s38-step-22", type: "platform", position: { x: 0.0, y: 1.41, z: -14.29 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 32.3, y: 0.38, z: 1.01 }, properties: { theme: "custom_color", customColor: "#6a1b9a", stepNumber: 22, variant: "republican_step", band: "morado" } },
      { id: "w4s38-step-23", type: "platform", position: { x: 0.0, y: 1.03, z: -15.25 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 33.1, y: 0.34, z: 0.90 }, properties: { theme: "custom_color", customColor: "#7b1fa2", stepNumber: 23, variant: "republican_step", band: "morado" } },
      { id: "w4s38-step-24", type: "platform", position: { x: 0.0, y: 0.65, z: -16.10 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 34.0, y: 0.30, z: 0.80 }, properties: { theme: "custom_color", customColor: "#6a1b9a", stepNumber: 24, variant: "republican_step", band: "morado" } },

      // =======================================================================
      // META EN EL ÚLTIMO ESCALÓN (Escalón 24 a Y = 0.80)
      // =======================================================================
      {
        id: "w4s38-goal",
        type: "goal",
        position: { x: 0.0, y: 0.80, z: -16.10 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },

      // Paseo marítimo/orilla del lago frente al anfiteatro con barandilla (como en la foto)
      {
        id: "w4s38-lake-promenade",
        type: "platform",
        position: { x: 0.0, y: 0.40, z: -19.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 38.0, y: 0.80, z: 4.5 },
        properties: { theme: "carabanchel" }
      },
      // Muros laterales curvos escalonados (de la foto, conteniendo las gradas)
      {
        id: "w4s38-wing-left",
        type: "platform",
        position: { x: -16.5, y: 5.2, z: 6.0 },
        rotation: { x: 0, y: 0.12, z: 0 },
        scale: { x: 1.6, y: 8.5, z: 52.0 },
        properties: { variant: "amphitheater_wing", theme: "custom_color", customColor: "#cfd8dc" }
      },
      {
        id: "w4s38-wing-right",
        type: "platform",
        position: { x: 16.5, y: 5.2, z: 6.0 },
        rotation: { x: 0, y: -0.12, z: 0 },
        scale: { x: 1.6, y: 8.5, z: 52.0 },
        properties: { variant: "amphitheater_wing", theme: "custom_color", customColor: "#cfd8dc" }
      },

      // Barandilla rústica de madera del paseo del lago (de la foto)
      {
        id: "w4s38-lake-railing",
        type: "platform",
        position: { x: 0.0, y: 1.10, z: -21.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 38.0, y: 1.10, z: 0.35 },
        properties: { variant: "lake_wooden_railing", theme: "custom_color", customColor: "#8d6e63" }
      },

      // Gran lámina de agua del lago de Las Cruces (reflejando el anfiteatro de la foto)
      {
        id: "w4s38-lake-water",
        type: "water",
        position: { x: 0.0, y: 0.0, z: -38.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 60.0, y: 1.0, z: 32.0 },
        properties: { theme: "lake_cruces" }
      },

      // Cipreses y pinos de Las Cruces (de la foto, destacando el ciprés alto detrás del frontón)
      { id: "w4s38-cypress-main", type: "decoration", position: { x: 4.8, y: 11.5, z: 38.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.3, y: 1.6, z: 1.3 }, properties: { subType: "cruces_cypress" } },
      { id: "w4s38-cypress-left", type: "decoration", position: { x: -6.5, y: 11.2, z: 38.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.1, y: 1.3, z: 1.1 }, properties: { subType: "cruces_cypress" } },
      { id: "w4s38-tree-l1", type: "decoration", position: { x: -10.0, y: 10.0, z: 34.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_urban_pine" } },
      { id: "w4s38-tree-r1", type: "decoration", position: { x: 10.0, y: 10.0, z: 34.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_urban_pine" } },
      { id: "w4s38-tree-l2", type: "decoration", position: { x: -16.0, y: 5.0, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_urban_pine" } },
      { id: "w4s38-tree-r2", type: "decoration", position: { x: 16.0, y: 5.0, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_urban_pine" } },
      { id: "w4s38-tree-l3", type: "decoration", position: { x: -21.0, y: 0.8, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_urban_pine" } },
      { id: "w4s38-tree-r3", type: "decoration", position: { x: 21.0, y: 0.8, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_urban_pine" } },

      // 10 Coleccionables distribuidos por los 24 escalones
      { id: "w4s38-col-1", type: "collectible", position: { x: 0.0, y: 10.1, z: 26.75 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s38-col-2", type: "collectible", position: { x: 0.0, y: 9.3, z: 20.77 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s38-col-3", type: "collectible", position: { x: 0.0, y: 8.1, z: 12.57 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s38-col-4", type: "collectible", position: { x: 0.0, y: 7.3, z: 7.63 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s38-col-5", type: "collectible", position: { x: 0.0, y: 6.1, z: 1.00 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s38-col-6", type: "collectible", position: { x: 0.0, y: 5.3, z: -2.89 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s38-col-7", type: "collectible", position: { x: 0.0, y: 4.5, z: -6.37 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s38-col-8", type: "collectible", position: { x: 0.0, y: 3.3, z: -10.80 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s38-col-9", type: "collectible", position: { x: 0.0, y: 2.5, z: -13.23 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s38-col-10", type: "collectible", position: { x: 0.0, y: 1.7, z: -15.25 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 9: Parque Aluche
  // Gran bajada veloz por carril bici (asfalto rojo y pintura vial) que se va
  // empinando progresivamente. La meta está colocada por debajo (Y = 30.0) al final
  // de las rampas, con la colina inicial elevada a Y = 68.5 (+20m sobre 48.5).
  // ---------------------------------------------------------------------------
  9: {
    id: "world-04-level-03-stage-09",
    world: 4,
    level: 3,
    stage: 9,
    name: "Parque Aluche",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 69.5, z: 32.0 },
    objects: [
      // Plataforma mirador inicial de salida en la colina de Aluche (elevada a Y = 68.5)
      {
        id: "w4s39-start-hill",
        type: "platform",
        position: { x: 0.0, y: 68.5, z: 32.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.8, z: 6.0 },
        properties: { theme: "carabanchel" }
      },

      // TRAMO 1: Descenso suave inicial por carril bici (Pendiente suave ~8°)
      {
        id: "w4s39-bici-slope-1",
        type: "ramp",
        position: { x: 0.0, y: 66.8, z: 22.0 },
        rotation: { x: -0.15, y: 0, z: 0 },
        scale: { x: 6.5, y: 0.7, z: 14.0 },
        properties: { theme: "carril_bici" }
      },

      // TRAMO 2: Descenso moderado acelerado (Pendiente media ~18°)
      {
        id: "w4s39-bici-slope-2",
        type: "ramp",
        position: { x: 0.0, y: 62.6, z: 9.5 },
        rotation: { x: -0.32, y: 0, z: 0 },
        scale: { x: 6.5, y: 0.7, z: 14.0 },
        properties: { theme: "carril_bici" }
      },

      // TRAMO 3: Descenso muy pronunciado (Pendiente fuerte ~28°)
      {
        id: "w4s39-bici-slope-3",
        type: "ramp",
        position: { x: 0.0, y: 56.8, z: -3.5 },
        rotation: { x: -0.50, y: 0, z: 0 },
        scale: { x: 6.5, y: 0.7, z: 15.0 },
        properties: { theme: "carril_bici" }
      },

      // TRAMO 4: Caída continua a máxima velocidad por carril bici
      {
        id: "w4s39-bici-slope-4",
        type: "ramp",
        position: { x: 0.0, y: 49.0, z: -15.5 },
        rotation: { x: -0.66, y: 0, z: 0 },
        scale: { x: 6.5, y: 0.7, z: 12.0 },
        properties: { theme: "carril_bici" }
      },

      // Coleccionables a lo largo de la bajada
      { id: "w4s39-col-2", type: "collectible", position: { x: 0.0, y: 66.5, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s39-col-3", type: "collectible", position: { x: 0.0, y: 63.5, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s39-col-4", type: "collectible", position: { x: 0.0, y: 59.8, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s39-col-5", type: "collectible", position: { x: 0.0, y: 55.5, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s39-col-6", type: "collectible", position: { x: 0.0, y: 51.8, z: -15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Rampa de extensión final hacia la meta por debajo
      {
        id: "obj-custom-1793897491143",
        type: "ramp",
        position: { x: 0.0, y: 41.0, z: -26.0 },
        rotation: { x: -0.66, y: 0, z: 0 },
        scale: { x: 6.5, y: 0.7, z: 12.0 },
        properties: { theme: "carril_bici" }
      },

      // META POR DEBAJO (Alcanzada al final de la gran bajada)
      {
        id: "w4s39-goal",
        type: "goal",
        position: { x: 0.0, y: 30.0, z: -43.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 10: Lago
  // Lago colosal de Parque de las Cruces con lámina de agua transparente.
  // En el centro un chorro géiser propulsor hacia arriba con potente fuerza
  // hidrodinámica que catapulta a la bola directamente hacia la meta en el cielo.
  // ---------------------------------------------------------------------------
  10: {
    id: "world-04-level-03-stage-10",
    world: 4,
    level: 3,
    stage: 10,
    name: "Lago",
    theme: "city",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 26.0 },
    objects: [
      // Muelle de entrada al lago
      {
        id: "w4s310-start-pier",
        type: "platform",
        position: { x: 0.0, y: 0.4, z: 26.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.8, z: 6.0 },
        properties: { theme: "carabanchel" }
      },

      // LÁMINA GIGANTE DE AGUA DEL LAGO (56.0m de ancho x 56.0m de largo)
      {
        id: "w4s310-lake-water",
        type: "water",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 56.0, y: 1.2, z: 56.0 },
        properties: { passable: true, theme: "water" }
      },

      // Bloques circulares móviles en órbita alrededor de la fuente a diferentes velocidades
      // Anillo exterior: Radio 19.0m, velocidad 0.55 rad/s, sentido antihorario
      {
        id: "w4s310-step-stone-1",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: 19.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.2, y: 0.6, z: 4.2 },
        properties: {
          platformShape: "cylinder",
          movementType: "circular",
          centerX: 0.0,
          centerZ: 0.0,
          radius: 19.0,
          speed: 0.55,
          direction: 1,
          baseAngle: Math.PI / 2,
          theme: "carabanchel"
        }
      },
      // Anillo intermedio: Radio 12.0m, velocidad 0.90 rad/s, sentido horario (rotación inversa)
      {
        id: "w4s310-step-stone-2",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: 12.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.2, y: 0.6, z: 4.2 },
        properties: {
          platformShape: "cylinder",
          movementType: "circular",
          centerX: 0.0,
          centerZ: 0.0,
          radius: 12.0,
          speed: 0.90,
          direction: -1,
          baseAngle: Math.PI / 2,
          theme: "carabanchel"
        }
      },
      // Anillo interior: Radio 5.5m, velocidad 1.30 rad/s, sentido antihorario (junto al chorro propulsor)
      {
        id: "w4s310-step-stone-3",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: 5.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.4, y: 0.6, z: 4.4 },
        properties: {
          platformShape: "cylinder",
          movementType: "circular",
          centerX: 0.0,
          centerZ: 0.0,
          radius: 5.5,
          speed: 1.30,
          direction: 1,
          baseAngle: Math.PI / 2,
          theme: "carabanchel"
        }
      },

      // CHORRO PROPULSOR ACUÁTICO DEL LAGO (Columna de agua a presión que propulsa hacia arriba)
      {
        id: "w4s310-lake-geyser",
        type: "platform",
        position: { x: 0.0, y: 0.2, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.8, y: 16.0, z: 4.8 },
        properties: { variant: "water_geyser", geyserForce: 21.0 }
      },

      // Plataformas de paseo perimetrales del lago
      { id: "w4s310-bank-n", type: "platform", position: { x: 0.0, y: 0.4, z: -27.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 58.0, y: 0.8, z: 4.0 }, properties: { theme: "carabanchel" } },
      { id: "w4s310-bank-s", type: "platform", position: { x: 0.0, y: 0.4, z: 27.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 58.0, y: 0.8, z: 4.0 }, properties: { theme: "carabanchel" } },
      { id: "w4s310-bank-w", type: "platform", position: { x: -27.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.0, y: 0.8, z: 58.0 }, properties: { theme: "carabanchel" } },
      { id: "w4s310-bank-e", type: "platform", position: { x: 27.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 4.0, y: 0.8, z: 58.0 }, properties: { theme: "carabanchel" } },

      // Farolas de paseo y sauces llorones del parque
      { id: "w4s310-lamp-1", type: "decoration", position: { x: -24.0, y: 0.8, z: 24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s310-lamp-2", type: "decoration", position: { x: 24.0, y: 0.8, z: 24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s310-tree-1", type: "decoration", position: { x: -24.0, y: 0.8, z: -24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.5, y: 1.5, z: 1.5 }, properties: { subType: "pine_hurdes" } },
      { id: "w4s310-tree-2", type: "decoration", position: { x: 24.0, y: 0.8, z: -24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.5, y: 1.5, z: 1.5 }, properties: { subType: "pine_hurdes" } },

      // 10 Coleccionables (los coleccionables 2, 3 y 4 van sobre los bloques móviles circulares)
      { id: "w4s310-col-1", type: "collectible", position: { x: 0.0, y: 1.0, z: 23.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s310-col-2", type: "collectible", position: { x: 0.0, y: 1.0, z: 19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s310-col-3", type: "collectible", position: { x: 0.0, y: 1.0, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s310-col-4", type: "collectible", position: { x: 0.0, y: 1.0, z: 5.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Coleccionables aéreos en la columna del chorro
      { id: "w4s310-col-5", type: "collectible", position: { x: 0.0, y: 4.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.45, y: 0.45, z: 0.45 } },
      { id: "w4s310-col-6", type: "collectible", position: { x: 0.0, y: 8.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.45, y: 0.45, z: 0.45 } },
      { id: "w4s310-col-7", type: "collectible", position: { x: 0.0, y: 11.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.45, y: 0.45, z: 0.45 } },
      { id: "w4s310-col-8", type: "collectible", position: { x: -1.5, y: 14.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.45, y: 0.45, z: 0.45 } },
      { id: "w4s310-col-9", type: "collectible", position: { x: 1.5, y: 14.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.45, y: 0.45, z: 0.45 } },
      { id: "w4s310-col-10", type: "collectible", position: { x: 0.0, y: 16.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.45, y: 0.45, z: 0.45 } },

      // META SUSPENDIDA EN EL AIRE ENCIMA DEL CHORRO GÉISER (Y = 15.5m)
      {
        id: "w4s310-goal",
        type: "goal",
        position: { x: 0.0, y: 15.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  }
};

WORLD_04_LEVEL_03_STAGES[1]=rebuildBikeCourse(WORLD_04_LEVEL_03_STAGES[1]);
// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('4_3_')) Object.assign(WORLD_04_LEVEL_03_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(4,3,WORLD_04_LEVEL_03_STAGES);

