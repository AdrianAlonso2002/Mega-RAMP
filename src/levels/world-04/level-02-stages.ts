import publishedEditorStages from '../editor-saved/world-04.json';
import {registerStageSet} from '../StageRegistry';
import type { LevelData } from "../LevelTypes";

// =============================================================================
// MUNDO 4: CARABANCHEL (Madrid) - NIVEL 2: SAN MELITÓN
// 10 Etapas completamente diseñadas, ambientadas e interactivas.
// =============================================================================

export const WORLD_04_LEVEL_02_STAGES: Record<number, LevelData> = {
  // ---------------------------------------------------------------------------
  // ETAPA 1: Bus34
  // Calle San Melitón más estrecha, flanqueada exclusivamente por edificios
  // residenciales amarillos y naranjas sin tiendas comerciales.
  // Autobús EMT Línea 34 ("34 LAS AGUILAS") con apertura en el techo, espera 2s
  // y avanza lentamente con el personaje dentro. Cámara alejada cinematográfica.
  // ---------------------------------------------------------------------------
  1: {
    id: "world-04-level-02-stage-01",
    world: 4,
    level: 2,
    stage: 1,
    name: "Bus34",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 75,
    properties: {
      cameraMode: "cinematic_bus34"
    },
    spawn: { x: 0.0, y: 5.4, z: 24.0 },
    objects: [
      // Plataforma de salida aérea con barandillas para caer dentro del autobús
      {
        id: "w4s21-start-gantry",
        type: "platform",
        position: { x: 0.0, y: 4.2, z: 24.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.4, y: 0.4, z: 4.0 },
        properties: { theme: "carabanchel" }
      },
      {
        id: "w4s21-start-ramp-drop",
        type: "ramp",
        position: { x: 0.0, y: 3.6, z: 21.0 },
        rotation: { x: 0.28, y: 0, z: 0 },
        scale: { x: 2.8, y: 0.3, z: 3.2 },
        properties: { theme: "custom_color", customColor: "#ffca28" }
      },
      { id: "w4s21-gantry-rail-l", type: "platform", position: { x: -1.8, y: 4.7, z: 23.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.2, y: 0.8, z: 5.0 }, properties: { theme: "custom_color", customColor: "#37474f" } },
      { id: "w4s21-gantry-rail-r", type: "platform", position: { x: 1.8, y: 4.7, z: 23.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.2, y: 0.8, z: 5.0 }, properties: { theme: "custom_color", customColor: "#37474f" } },

      // Calle San Melitón (calzada estrecha de 7.2m de ancho, 96m de longitud)
      {
        id: "w4s21-street-roadway",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -20.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.2, y: 0.8, z: 96.0 },
        properties: { theme: "carabanchel" }
      },

      // Bordillos de granito pulido
      { id: "w4s21-curb-l", type: "platform", position: { x: -3.7, y: 0.45, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.35, y: 0.35, z: 96.0 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w4s21-curb-r", type: "platform", position: { x: 3.7, y: 0.45, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.35, y: 0.35, z: 96.0 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },

      // Aceras estrechas laterales
      { id: "w4s21-sidewalk-l", type: "platform", position: { x: -5.4, y: 0.55, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 0.55, z: 96.0 }, properties: { theme: "carabanchel" } },
      { id: "w4s21-sidewalk-r", type: "platform", position: { x: 5.4, y: 0.55, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 0.55, z: 96.0 }, properties: { theme: "carabanchel" } },

      // Edificios residenciales exclusivos en tonos amarillos y naranjas (sin tiendas, portales residenciales)
      // Acera izquierda (X = -8.6)
      { id: "w4s21-bldg-l1", type: "decoration", position: { x: -8.6, y: 0.55, z: 22.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "yellow", shopType: "portal" } },
      { id: "w4s21-bldg-l2", type: "decoration", position: { x: -8.6, y: 0.55, z: 8.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "orange", shopType: "portal" } },
      { id: "w4s21-bldg-l3", type: "decoration", position: { x: -8.6, y: 0.55, z: -6.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "yellow", shopType: "portal" } },
      { id: "w4s21-bldg-l4", type: "decoration", position: { x: -8.6, y: 0.55, z: -20.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "orange", shopType: "portal" } },
      { id: "w4s21-bldg-l5", type: "decoration", position: { x: -8.6, y: 0.55, z: -34.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "yellow", shopType: "portal" } },
      { id: "w4s21-bldg-l6", type: "decoration", position: { x: -8.6, y: 0.55, z: -48.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "orange", shopType: "portal" } },
      { id: "w4s21-bldg-l7", type: "decoration", position: { x: -8.6, y: 0.55, z: -62.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "yellow", shopType: "portal" } },

      // Acera derecha (X = 8.6)
      { id: "w4s21-bldg-r1", type: "decoration", position: { x: 8.6, y: 0.55, z: 22.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "orange", shopType: "portal" } },
      { id: "w4s21-bldg-r2", type: "decoration", position: { x: 8.6, y: 0.55, z: 8.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "yellow", shopType: "portal" } },
      { id: "w4s21-bldg-r3", type: "decoration", position: { x: 8.6, y: 0.55, z: -6.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "orange", shopType: "portal" } },
      { id: "w4s21-bldg-r4", type: "decoration", position: { x: 8.6, y: 0.55, z: -20.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "yellow", shopType: "portal" } },
      { id: "w4s21-bldg-r5", type: "decoration", position: { x: 8.6, y: 0.55, z: -34.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "orange", shopType: "portal" } },
      { id: "w4s21-bldg-r6", type: "decoration", position: { x: 8.6, y: 0.55, z: -48.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "yellow", shopType: "portal" } },
      { id: "w4s21-bldg-r7", type: "decoration", position: { x: 8.6, y: 0.55, z: -62.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "orange", shopType: "portal" } },

      // Farolas urbanas de Madrid
      { id: "w4s21-lamp-1", type: "decoration", position: { x: -4.4, y: 0.55, z: 16.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s21-lamp-2", type: "decoration", position: { x: 4.4, y: 0.55, z: 2.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s21-lamp-3", type: "decoration", position: { x: -4.4, y: 0.55, z: -14.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s21-lamp-4", type: "decoration", position: { x: 4.4, y: 0.55, z: -28.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s21-lamp-5", type: "decoration", position: { x: -4.4, y: 0.55, z: -42.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s21-lamp-6", type: "decoration", position: { x: 4.4, y: 0.55, z: -56.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },

      // Placa de calle tradicional madrileña: Calle de San Melitón
      { id: "w4s21-street-sign", type: "decoration", position: { x: -4.2, y: 0.55, z: 23.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_sign_carabanchel" } },

      // Contenedores y marquesina de autobús EMT al final de la línea
      { id: "w4s21-recycle-bins", type: "decoration", position: { x: -4.6, y: 0.55, z: -58.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_recycle_bins" } },
      { id: "w4s21-bus-stop", type: "decoration", position: { x: 4.6, y: 0.55, z: -62.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_bus_stop" } },

      // =======================================================================
      // AUTOBÚS EMT MADRID LÍNEA 34 (Scania N280UB GNC)
      // Espera 2 segundos quieto con el jugador dentro y viaja suavemente hacia -Z
      // =======================================================================
      {
        id: "w4s21-bus-34",
        type: "moving-platform",
        position: { x: 0.0, y: 0.45, z: 18.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.4, y: 0.45, z: 8.6 },
        properties: {
          isMoving: true,
          variant: "emt_bus_34",
          movementType: "emt_bus_34",
          speed: 4.6,
          distance: 82.0,
          direction: -1,
          startDelay: 2.0,
          customColor: "#0072ce"
        }
      },

      // 10 Coleccionables
      // 5 dentro del autobús en sincronía
      { id: "w4s21-col-1", type: "collectible", position: { x: 0.0, y: 1.1, z: 20.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 }, properties: { startDelay: 2.0 } },
      { id: "w4s21-col-2", type: "collectible", position: { x: -0.7, y: 1.1, z: 19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 }, properties: { startDelay: 2.0 } },
      { id: "w4s21-col-3", type: "collectible", position: { x: 0.7, y: 1.1, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 }, properties: { startDelay: 2.0 } },
      { id: "w4s21-col-4", type: "collectible", position: { x: -0.7, y: 1.1, z: 17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 }, properties: { startDelay: 2.0 } },
      { id: "w4s21-col-5", type: "collectible", position: { x: 0.0, y: 1.1, z: 15.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 }, properties: { startDelay: 2.0 } },
      // 5 en la calzada y llegada a la parada final
      { id: "w4s21-col-6", type: "collectible", position: { x: 0.0, y: 0.8, z: -25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s21-col-7", type: "collectible", position: { x: -1.2, y: 0.8, z: -38.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s21-col-8", type: "collectible", position: { x: 1.2, y: 0.8, z: -48.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s21-col-9", type: "collectible", position: { x: 0.0, y: 0.8, z: -58.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s21-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -63.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta al final de la línea en la marquesina de San Melitón
      {
        id: "w4s21-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -66.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 2: Salto4
  // Como Salto3 pero mejorado: cuádruple salto acrobático sobre las azoteas de
  // Carabanchel con rampas de aceleración optimizadas, guías protectoras
  // y pendientes de aterrizaje amortiguadas que canalizan la velocidad.
  // ---------------------------------------------------------------------------
  2: {
    id: "world-04-level-02-stage-02",
    world: 4,
    level: 2,
    stage: 2,
    name: "Salto4",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 32.0 },
    objects: [
      // PISTA 1: Despegue Azotea 1
      { id: "w4s22-run-1", type: "platform", position: { x: 0.0, y: 0.0, z: 27.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.5, y: 0.8, z: 12.0 }, properties: { theme: "carabanchel" } },
      { id: "w4s22-ramp-1", type: "ramp", position: { x: 0.0, y: 0.8, z: 18.5 }, rotation: { x: 0.22, y: 0, z: 0 }, scale: { x: 6.5, y: 0.8, z: 6.0 }, properties: { theme: "custom_color", customColor: "#f59e0b" } },

      // ATERRIZAJE 1 / PISTA 2: Azotea 2
      { id: "w4s22-catch-1", type: "ramp", position: { x: 0.0, y: 1.3, z: 11.0 }, rotation: { x: -0.15, y: 0, z: 0 }, scale: { x: 7.2, y: 0.8, z: 5.5 }, properties: { theme: "carabanchel" } },
      { id: "w4s22-run-2", type: "platform", position: { x: 0.0, y: 1.3, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.2, y: 0.8, z: 5.5 }, properties: { theme: "carabanchel" } },
      { id: "w4s22-ramp-2", type: "ramp", position: { x: 0.0, y: 2.2, z: 0.5 }, rotation: { x: 0.24, y: 0, z: 0 }, scale: { x: 6.8, y: 0.8, z: 6.0 }, properties: { theme: "custom_color", customColor: "#ea580c" } },

      // ATERRIZAJE 2 / PISTA 3: Azotea 3
      { id: "w4s22-catch-2", type: "ramp", position: { x: 0.0, y: 2.8, z: -6.5 }, rotation: { x: -0.16, y: 0, z: 0 }, scale: { x: 7.8, y: 0.8, z: 5.5 }, properties: { theme: "carabanchel" } },
      { id: "w4s22-run-3", type: "platform", position: { x: 0.0, y: 2.8, z: -11.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.8, y: 0.8, z: 5.5 }, properties: { theme: "carabanchel" } },
      { id: "w4s22-ramp-3", type: "ramp", position: { x: 0.0, y: 3.8, z: -17.0 }, rotation: { x: 0.26, y: 0, z: 0 }, scale: { x: 7.2, y: 0.8, z: 6.0 }, properties: { theme: "custom_color", customColor: "#f59e0b" } },

      // ATERRIZAJE 3 / PISTA 4: Azotea 4
      { id: "w4s22-catch-3", type: "ramp", position: { x: 0.0, y: 4.6, z: -24.5 }, rotation: { x: -0.16, y: 0, z: 0 }, scale: { x: 8.2, y: 0.8, z: 5.5 }, properties: { theme: "carabanchel" } },
      { id: "w4s22-run-4", type: "platform", position: { x: 0.0, y: 4.6, z: -29.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.2, y: 0.8, z: 5.5 }, properties: { theme: "carabanchel" } },
      { id: "w4s22-ramp-4", type: "ramp", position: { x: 0.0, y: 5.8, z: -35.0 }, rotation: { x: 0.28, y: 0, z: 0 }, scale: { x: 7.6, y: 0.8, z: 6.0 }, properties: { theme: "custom_color", customColor: "#ea580c" } },

      // GRAN ATERRIZAJE FINAL Y PLATAFORMA DE META
      { id: "w4s22-catch-final", type: "ramp", position: { x: 0.0, y: 6.6, z: -43.0 }, rotation: { x: -0.15, y: 0, z: 0 }, scale: { x: 9.5, y: 0.8, z: 6.0 }, properties: { theme: "carabanchel" } },
      { id: "w4s22-goal-plaza", type: "platform", position: { x: 0.0, y: 6.6, z: -49.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 10.0, y: 0.8, z: 8.0 }, properties: { theme: "carabanchel" } },
      { id: "w4s22-back-cushion", type: "bumper", position: { x: 0.0, y: 7.6, z: -53.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 10.0, y: 1.8, z: 0.6 }, properties: { theme: "custom_color", customColor: "#f59e0b" } },

      // Elementos urbanos de azotea madrileña
      { id: "w4s22-antenna-1", type: "decoration", position: { x: -4.5, y: 6.6, z: -49.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s22-antenna-2", type: "decoration", position: { x: 4.5, y: 6.6, z: -49.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },

      // 10 Coleccionables en las parábolas aéreas
      { id: "w4s22-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 29.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s22-col-2", type: "collectible", position: { x: 0.0, y: 1.6, z: 19.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s22-col-3", type: "collectible", position: { x: 0.0, y: 2.6, z: 14.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s22-col-4", type: "collectible", position: { x: 0.0, y: 2.2, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s22-col-5", type: "collectible", position: { x: 0.0, y: 3.2, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s22-col-6", type: "collectible", position: { x: 0.0, y: 4.2, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s22-col-7", type: "collectible", position: { x: 0.0, y: 3.8, z: -11.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s22-col-8", type: "collectible", position: { x: 0.0, y: 5.0, z: -16.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s22-col-9", type: "collectible", position: { x: 0.0, y: 6.2, z: -21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s22-col-10", type: "collectible", position: { x: 0.0, y: 7.2, z: -38.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta
      {
        id: "w4s22-goal",
        type: "goal",
        position: { x: 0.0, y: 7.4, z: -50.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 3: Padel2
  // Como la etapa Padel original, pero tanto la pista reglamentaria como la
  // pala de pádel catapulta son exactamente el doble de grandes (22x44m).
  // La monumental pala te rebaña en la zona de saque y te catapulta sobre la red.
  // ---------------------------------------------------------------------------
  3: {
    id: "world-04-level-02-stage-03",
    world: 4,
    level: 2,
    stage: 3,
    name: "Padel2",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 17.0 },
    objects: [
      // PISTA DE PÁDEL GIGANTE (22.0m de ancho x 44.0m de largo: 2x oficial)
      {
        id: "w4s23-court-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 22.0, y: 0.8, z: 44.0 },
        properties: { theme: "custom_color", customColor: "#1565c0" }
      },

      // LÍNEAS BLANCAS REGLAMENTARIAS (escala 2x)
      { id: "w4s23-line-srv-a", type: "platform", position: { x: 0.0, y: 0.41, z: 9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20.0, y: 0.02, z: 0.24 }, properties: { theme: "custom_color", customColor: "#ffffff" } },
      { id: "w4s23-line-srv-b", type: "platform", position: { x: 0.0, y: 0.41, z: -9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20.0, y: 0.02, z: 0.24 }, properties: { theme: "custom_color", customColor: "#ffffff" } },
      { id: "w4s23-line-ctr-a", type: "platform", position: { x: 0.0, y: 0.41, z: 4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.24, y: 0.02, z: 9.0 }, properties: { theme: "custom_color", customColor: "#ffffff" } },
      { id: "w4s23-line-ctr-b", type: "platform", position: { x: 0.0, y: 0.41, z: -4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.24, y: 0.02, z: 9.0 }, properties: { theme: "custom_color", customColor: "#ffffff" } },

      // MUROS DE CRISTAL Y VALLAS METÁLICAS (escala 2x)
      { id: "w4s23-glass-back-a", type: "platform", position: { x: 0.0, y: 2.8, z: 21.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 22.0, y: 4.8, z: 0.3 }, properties: { theme: "custom_color", customColor: "#80deea" } },
      { id: "w4s23-glass-back-b", type: "platform", position: { x: 0.0, y: 2.8, z: -21.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 22.0, y: 4.8, z: 0.3 }, properties: { theme: "custom_color", customColor: "#80deea" } },
      { id: "w4s23-fence-l", type: "platform", position: { x: -10.9, y: 2.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.3, y: 4.8, z: 44.0 }, properties: { theme: "custom_color", customColor: "#37474f" } },
      { id: "w4s23-fence-r", type: "platform", position: { x: 10.9, y: 2.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.3, y: 4.8, z: 44.0 }, properties: { theme: "custom_color", customColor: "#37474f" } },

      // RED CENTRAL DE PÁDEL GIGANTE (Z = 0.0)
      { id: "w4s23-net-post-l", type: "platform", position: { x: -10.5, y: 2.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.5, y: 3.6, z: 0.5 }, properties: { theme: "custom_color", customColor: "#ffffff" } },
      { id: "w4s23-net-post-r", type: "platform", position: { x: 10.5, y: 2.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.5, y: 3.6, z: 0.5 }, properties: { theme: "custom_color", customColor: "#ffffff" } },
      { id: "w4s23-net-mesh", type: "platform", position: { x: 0.0, y: 1.6, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 21.0, y: 2.6, z: 0.25 }, properties: { theme: "custom_color", customColor: "#eceff1" } },
      { id: "w4s23-net-tape", type: "platform", position: { x: 0.0, y: 3.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 21.0, y: 0.3, z: 0.35 }, properties: { theme: "custom_color", customColor: "#ffffff" } },

      // =======================================================================
      // LA PALA DE PÁDEL GIGANTE CATAPULTA (2X TAMAÑO ORIGINAL)
      // Escala 7.6 x 0.35 x 8.4m
      // =======================================================================
      {
        id: "w4s23-giant-padel-racket",
        type: "moving-platform",
        position: { x: 0.0, y: 0.45, z: 9.6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.6, y: 0.35, z: 8.4 },
        properties: {
          isMoving: true,
          variant: "padel_racket",
          movementType: "padel_racket",
          customColor: "#00e5ff"
        }
      },

      // Focos de iluminación de la pista
      { id: "w4s23-light-1", type: "decoration", position: { x: -11.8, y: 0.4, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.5, z: 1.2 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s23-light-2", type: "decoration", position: { x: 11.8, y: 0.4, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.5, z: 1.2 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s23-light-3", type: "decoration", position: { x: -11.8, y: 0.4, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.5, z: 1.2 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s23-light-4", type: "decoration", position: { x: 11.8, y: 0.4, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.5, z: 1.2 }, properties: { subType: "madrid_street_lamp_urban" } },

      // 10 Coleccionables
      { id: "w4s23-col-1", type: "collectible", position: { x: -4.5, y: 0.8, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s23-col-2", type: "collectible", position: { x: 4.5, y: 0.8, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s23-col-3", type: "collectible", position: { x: 0.0, y: 0.9, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s23-col-4", type: "collectible", position: { x: -3.0, y: 2.2, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s23-col-5", type: "collectible", position: { x: 3.0, y: 2.2, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s23-col-6", type: "collectible", position: { x: 0.0, y: 4.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s23-col-7", type: "collectible", position: { x: -3.0, y: 2.2, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s23-col-8", type: "collectible", position: { x: 3.0, y: 2.2, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s23-col-9", type: "collectible", position: { x: -5.0, y: 0.8, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s23-col-10", type: "collectible", position: { x: 5.0, y: 0.8, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta al fondo del Campo Rival
      {
        id: "w4s23-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -18.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 4: La Mina
  // Gran laberinto estrecho y oscuro de callejones madrileños de ladrillo visto.
  // Cámara alejada cenital/cinematográfica donde los callejones se estrechan y
  // apenas se percibe el camino entre las sombras y farolas ámbar.
  // ---------------------------------------------------------------------------
  4: {
    id: "world-04-level-02-stage-04",
    world: 4,
    level: 2,
    stage: 4,
    name: "La Mina",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 75,
    properties: {
      cameraMode: "cinematic_mina"
    },
    spawn: { x: 0.0, y: 1.5, z: 18.0 },
    objects: [
      // Pavimento del laberinto (44.0m x 44.0m de piedra oscura de callejón)
      {
        id: "w4s24-maze-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 44.0, y: 0.8, z: 44.0 },
        properties: { theme: "custom_color", customColor: "#263238" }
      },

      // Muros perimetrales altos de ladrillo oscuro (altura 4.2m)
      { id: "w4s24-wall-back", type: "platform", position: { x: 0.0, y: 2.1, z: 21.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 44.0, y: 4.2, z: 0.8 }, properties: { theme: "carabanchel" } },
      { id: "w4s24-wall-front", type: "platform", position: { x: 0.0, y: 2.1, z: -21.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 44.0, y: 4.2, z: 0.8 }, properties: { theme: "carabanchel" } },
      { id: "w4s24-wall-left", type: "platform", position: { x: -21.6, y: 2.1, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 4.2, z: 44.0 }, properties: { theme: "carabanchel" } },
      { id: "w4s24-wall-right", type: "platform", position: { x: 21.6, y: 2.1, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 4.2, z: 44.0 }, properties: { theme: "carabanchel" } },

      // Paredes interiores del laberinto (creando callejones estrechos de 2.6m de anchura)
      // Sector Sur (Z = 12 a 18)
      { id: "w4s24-maze-w1", type: "platform", position: { x: -7.0, y: 2.1, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 18.0, y: 4.2, z: 0.8 }, properties: { theme: "carabanchel" } },
      { id: "w4s24-maze-w2", type: "platform", position: { x: 11.0, y: 2.1, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 12.0, y: 4.2, z: 0.8 }, properties: { theme: "carabanchel" } },
      { id: "w4s24-maze-w3", type: "platform", position: { x: 5.0, y: 2.1, z: 17.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 4.2, z: 7.0 }, properties: { theme: "carabanchel" } },

      // Sector Central (Z = 4 a -4)
      { id: "w4s24-maze-w4", type: "platform", position: { x: -14.0, y: 2.1, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 4.2, z: 16.0 }, properties: { theme: "carabanchel" } },
      { id: "w4s24-maze-w5", type: "platform", position: { x: -4.0, y: 2.1, z: 7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 12.0, y: 4.2, z: 0.8 }, properties: { theme: "carabanchel" } },
      { id: "w4s24-maze-w6", type: "platform", position: { x: 2.0, y: 2.1, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 4.2, z: 10.0 }, properties: { theme: "carabanchel" } },
      { id: "w4s24-maze-w7", type: "platform", position: { x: 12.0, y: 2.1, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 12.0, y: 4.2, z: 0.8 }, properties: { theme: "carabanchel" } },
      { id: "w4s24-maze-w8", type: "platform", position: { x: -6.0, y: 2.1, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 4.2, z: 0.8 }, properties: { theme: "carabanchel" } },
      { id: "w4s24-maze-w9", type: "platform", position: { x: 14.0, y: 2.1, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 4.2, z: 14.0 }, properties: { theme: "carabanchel" } },

      // Sector Norte (Z = -8 a -18)
      { id: "w4s24-maze-w10", type: "platform", position: { x: -14.0, y: 2.1, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 4.2, z: 12.0 }, properties: { theme: "carabanchel" } },
      { id: "w4s24-maze-w11", type: "platform", position: { x: -2.0, y: 2.1, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 16.0, y: 4.2, z: 0.8 }, properties: { theme: "carabanchel" } },
      { id: "w4s24-maze-w12", type: "platform", position: { x: 6.0, y: 2.1, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 4.2, z: 8.0 }, properties: { theme: "carabanchel" } },
      { id: "w4s24-maze-w13", type: "platform", position: { x: -6.0, y: 2.1, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 4.2, z: 0.8 }, properties: { theme: "carabanchel" } },

      // Farolas de callejón madrileño proyectando conos de luz cálida en la penumbra
      { id: "w4s24-lamp-1", type: "decoration", position: { x: 0.0, y: 0.4, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s24-lamp-2", type: "decoration", position: { x: -11.0, y: 0.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s24-lamp-3", type: "decoration", position: { x: 8.0, y: 0.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s24-lamp-4", type: "decoration", position: { x: 18.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s24-lamp-5", type: "decoration", position: { x: -8.0, y: 0.4, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s24-lamp-6", type: "decoration", position: { x: 2.0, y: 0.4, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },

      // 10 Coleccionables en los recovecos y bifurcaciones del laberinto
      { id: "w4s24-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 15.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s24-col-2", type: "collectible", position: { x: -8.0, y: 0.8, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s24-col-3", type: "collectible", position: { x: -18.0, y: 0.8, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s24-col-4", type: "collectible", position: { x: -8.0, y: 0.8, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s24-col-5", type: "collectible", position: { x: 7.0, y: 0.8, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s24-col-6", type: "collectible", position: { x: 18.0, y: 0.8, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s24-col-7", type: "collectible", position: { x: 8.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s24-col-8", type: "collectible", position: { x: -9.0, y: 0.8, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s24-col-9", type: "collectible", position: { x: -18.0, y: 0.8, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s24-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta al fondo del laberinto en la salida del callejón
      {
        id: "w4s24-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -19.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos14
  // Como Objetos13 pero con menos coleccionables (6 en lugar de 10) colocados
  // en ubicaciones estratégicas y trazado con obstáculos urbanos alternativos:
  // bolardos de granito rebotadores en formación zig-zag, tornos giratorios y
  // bocas de riego de Carabanchel.
  // ---------------------------------------------------------------------------
  5: {
    id: "world-04-level-02-stage-05",
    world: 4,
    level: 2,
    stage: 5,
    name: "Objetos14",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 26.0 },
    objects: [
      // Pasarela principal de trazado curvado y escalonado
      {
        id: "w4s25-floor-1",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 20.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.5, y: 0.8, z: 16.0 },
        properties: { theme: "carabanchel" }
      },
      {
        id: "w4s25-floor-2",
        type: "platform",
        position: { x: -3.5, y: 0.0, z: 6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.5, y: 0.8, z: 16.0 },
        properties: { theme: "carabanchel" }
      },
      {
        id: "w4s25-floor-3",
        type: "platform",
        position: { x: 3.5, y: 0.0, z: -8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.5, y: 0.8, z: 16.0 },
        properties: { theme: "carabanchel" }
      },
      {
        id: "w4s25-floor-4",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -22.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.5, y: 0.8, z: 16.0 },
        properties: { theme: "carabanchel" }
      },

      // Obstáculos: Bolardos esféricos de granito rebotadores (bumpers)
      { id: "w4s25-bollard-1", type: "bumper", position: { x: -2.0, y: 0.65, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w4s25-bollard-2", type: "bumper", position: { x: 2.0, y: 0.65, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w4s25-bollard-3", type: "bumper", position: { x: -4.5, y: 0.65, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w4s25-bollard-4", type: "bumper", position: { x: -1.5, y: 0.65, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w4s25-bollard-5", type: "bumper", position: { x: 1.5, y: 0.65, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w4s25-bollard-6", type: "bumper", position: { x: 4.5, y: 0.65, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },

      // Obstáculos: Bocas de riego madrileñas (cilindros de fundición roja)
      { id: "w4s25-hydrant-1", type: "cylinder", position: { x: -2.8, y: 0.8, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1.5, z: 0.7 }, properties: { theme: "custom_color", customColor: "#d32f2f" } },
      { id: "w4s25-hydrant-2", type: "cylinder", position: { x: 2.8, y: 0.8, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.7, y: 1.5, z: 0.7 }, properties: { theme: "custom_color", customColor: "#d32f2f" } },

      // Obstáculos: Torno giratorio de metro de Carabanchel
      {
        id: "w4s25-metro-turnstile",
        type: "rotating-platform",
        position: { x: 0.0, y: 0.4, z: -20.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.5, y: 0.35, z: 0.8 },
        properties: { isRotating: true, rotationAxis: "y", speed: 1.8, customColor: "#0072ce" }
      },

      // Farolas y bancos de adorno
      { id: "w4s25-lamp-1", type: "decoration", position: { x: 4.2, y: 0.4, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s25-lamp-2", type: "decoration", position: { x: -4.2, y: 0.4, z: -24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },

      // Menos coleccionables (6 en lugar de 10) colocados en puntos clave
      { id: "w4s25-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s25-col-2", type: "collectible", position: { x: -3.5, y: 0.8, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s25-col-3", type: "collectible", position: { x: -5.0, y: 0.8, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s25-col-4", type: "collectible", position: { x: 3.5, y: 0.8, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s25-col-5", type: "collectible", position: { x: 5.0, y: 0.8, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s25-col-6", type: "collectible", position: { x: 0.0, y: 0.8, z: -26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta al final del recorrido
      {
        id: "w4s25-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -28.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 6: Galway
  // Plataforma monumental en forma de pizarra de clase escolar (verde mate,
  // marco de madera y fórmulas matemáticas en tiza).
  // Dos guantes gigantes de color verde aplauden periódicamente; si la palma
  // choca con el personaje, lo manda volando fuertemente.
  // ---------------------------------------------------------------------------
  6: {
    id: "world-04-level-02-stage-06",
    world: 4,
    level: 2,
    stage: 6,
    name: "Galway",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 18.0 },
    objects: [
      // Plataforma con forma de pizarra escolar (superficie verde mate oscuro)
      {
        id: "w4s26-chalkboard-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 11.0, y: 0.8, z: 42.0 },
        properties: { variant: "chalkboard_platform", theme: "custom_color", customColor: "#1a382b" }
      },

      // Marco perimetral de madera barnizada de la pizarra
      { id: "w4s26-wood-frame-l", type: "platform", position: { x: -5.6, y: 0.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 42.0 }, properties: { theme: "custom_color", customColor: "#8d6e63" } },
      { id: "w4s26-wood-frame-r", type: "platform", position: { x: 5.6, y: 0.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.5, z: 42.0 }, properties: { theme: "custom_color", customColor: "#8d6e63" } },
      { id: "w4s26-wood-frame-b", type: "platform", position: { x: 0.0, y: 0.5, z: 21.1 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 11.6, y: 0.5, z: 0.4 }, properties: { theme: "custom_color", customColor: "#8d6e63" } },
      { id: "w4s26-wood-frame-t", type: "platform", position: { x: 0.0, y: 0.5, z: -21.1 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 11.6, y: 0.5, z: 0.4 }, properties: { theme: "custom_color", customColor: "#8d6e63" } },

      // Repisa portalápices con tizas y borrador de fieltro
      { id: "w4s26-chalk-ledge", type: "platform", position: { x: 0.0, y: 0.55, z: 20.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.0, y: 0.15, z: 0.5 }, properties: { theme: "custom_color", customColor: "#6d4c41" } },

      // =======================================================================
      // DOS GUANTES VERDES GIGANTES APLAUDIENDO (CLAPPING GLOVES)
      // Se cierran velozmente hacia X = 0 aplaudiendo y mandan volando al jugador
      // =======================================================================
      {
        id: "w4s26-glove-left",
        type: "moving-platform",
        position: { x: -4.8, y: 1.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.2, y: 2.2, z: 3.2 },
        properties: {
          isMoving: true,
          variant: "clapping_gloves",
          movementType: "clapping_gloves",
          side: "left",
          cycleTime: 2.2,
          speed: 1.0,
          customColor: "#2e7d32"
        }
      },
      {
        id: "w4s26-glove-right",
        type: "moving-platform",
        position: { x: 4.8, y: 1.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.2, y: 2.2, z: 3.2 },
        properties: {
          isMoving: true,
          variant: "clapping_gloves",
          movementType: "clapping_gloves",
          side: "right",
          cycleTime: 2.2,
          speed: 1.0,
          customColor: "#2e7d32"
        }
      },

      // Elementos de aula y decoraciones
      { id: "w4s26-lamp-1", type: "decoration", position: { x: -6.0, y: 0.4, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s26-lamp-2", type: "decoration", position: { x: 6.0, y: 0.4, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },

      // 10 Coleccionables
      { id: "w4s26-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s26-col-2", type: "collectible", position: { x: -2.5, y: 0.8, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s26-col-3", type: "collectible", position: { x: 2.5, y: 0.8, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s26-col-4", type: "collectible", position: { x: 0.0, y: 0.8, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Coleccionables en la zona crítica del aplauso
      { id: "w4s26-col-5", type: "collectible", position: { x: -1.5, y: 0.8, z: 1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s26-col-6", type: "collectible", position: { x: 1.5, y: 0.8, z: 1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s26-col-7", type: "collectible", position: { x: 0.0, y: 0.8, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s26-col-8", type: "collectible", position: { x: -2.5, y: 0.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s26-col-9", type: "collectible", position: { x: 2.5, y: 0.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s26-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta al fondo de la pizarra
      {
        id: "w4s26-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -18.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 7: 13 2B
  // Edificio residencial madrileño con ascensor de 2 plantas: empieza abajo en el
  // portal, sube al primer piso y luego al segundo. Dentro del 2ºB hay una puerta
  // que da paso a un salón donde dos personas (un hombre con la camiseta del Real
  // Madrid y una mujer delgada de pelo rubio rizado con vestido de tigre vintage)
  // te empujan rítmicamente como un muelle (mecánica Litos).
  // ---------------------------------------------------------------------------
  7: {
    id: "world-04-level-02-stage-07",
    world: 4,
    level: 2,
    stage: 7,
    name: "13 2B",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 75,
    spawn: { x: 0.0, y: 1.5, z: 12.0 },
    objects: [
      // Portal / Planta Baja del edificio residencial
      {
        id: "w4s27-ground-lobby",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.8, z: 8.0 },
        properties: { theme: "carabanchel" }
      },

      // =======================================================================
      // ASCENSOR DE DOS PLANTAS (Sube de Y=0 a Y=4.5 y luego a Y=9.0)
      // =======================================================================
      {
        id: "w4s27-elevator-car",
        type: "moving-platform",
        position: { x: 0.0, y: 0.0, z: 3.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.2, y: 0.45, z: 4.2 },
        properties: {
          isMoving: true,
          variant: "residential_elevator_2f",
          movementType: "residential_elevator_2f",
          speed: 2.4,
          cycleTime: 12.0,
          customColor: "#cfd8dc"
        }
      },

      // Rellano de la Segunda Planta (Y = 9.0)
      {
        id: "w4s27-floor2-landing",
        type: "platform",
        position: { x: 0.0, y: 9.0, z: 1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.5, y: 0.8, z: 4.0 },
        properties: { theme: "carabanchel" }
      },

      // Puerta del piso 13 2ºB con marco de madera y mirilla
      {
        id: "w4s27-door-portal",
        type: "moving-platform",
        position: { x: 0.0, y: 9.4, z: -1.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: {
          variant: "slamming_door",
          movementType: "slamming_door",
          speed: 1.0,
          cycleTime: 3.2,
          isMoving: true
        }
      },

      // Salón del piso 13 2ºB (tarima clásica de parquet de roble, 8x22m)
      {
        id: "w4s27-salon-floor",
        type: "platform",
        position: { x: 0.0, y: 9.0, z: -12.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.5, y: 0.8, z: 20.0 },
        properties: { theme: "custom_color", customColor: "#a16207" }
      },

      // Muros laterales del salón
      { id: "w4s27-wall-l", type: "platform", position: { x: -4.3, y: 10.5, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.35, y: 2.4, z: 20.0 }, properties: { theme: "custom_color", customColor: "#fef3c7" } },
      { id: "w4s27-wall-r", type: "platform", position: { x: 4.3, y: 10.5, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.35, y: 2.4, z: 20.0 }, properties: { theme: "custom_color", customColor: "#fef3c7" } },

      // =======================================================================
      // PAREJA DEL 13 2ºB (Hombre del Real Madrid y Mujer rubia vestido de tigre)
      // Empujan rítmicamente al jugador a través del umbral
      // =======================================================================
      {
        id: "w4s27-madrid-duo",
        type: "moving-platform",
        position: { x: 0.0, y: 9.4, z: -5.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: {
          variant: "madrid_duo_132b",
          movementType: "litos_duo",
          axis: "z",
          direction: 1,
          distance: 10.0,
          speed: 1.0,
          cycleTime: 3.2,
          isMoving: true
        }
      },

      // Lámparas y mobiliario del rellano y salón
      { id: "w4s27-lamp-ground", type: "decoration", position: { x: -2.8, y: 0.4, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s27-lamp-balcony", type: "decoration", position: { x: 3.5, y: 9.4, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },

      // 10 Coleccionables
      { id: "w4s27-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s27-col-2", type: "collectible", position: { x: -1.5, y: 0.8, z: 8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s27-col-3", type: "collectible", position: { x: 1.5, y: 0.8, z: 8.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s27-col-4", type: "collectible", position: { x: 0.0, y: 5.2, z: 3.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s27-col-5", type: "collectible", position: { x: 0.0, y: 9.8, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s27-col-6", type: "collectible", position: { x: 0.0, y: 9.8, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s27-col-7", type: "collectible", position: { x: -1.6, y: 9.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s27-col-8", type: "collectible", position: { x: 1.6, y: 9.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s27-col-9", type: "collectible", position: { x: 0.0, y: 9.8, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s27-col-10", type: "collectible", position: { x: 0.0, y: 9.8, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta en la terraza / balcón del 13 2ºB
      {
        id: "w4s27-goal",
        type: "goal",
        position: { x: 0.0, y: 9.8, z: -21.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 8: Rony
  // Monumental perro Yorkshire Terrier ("Yorsai") con pelo sedoso canela y gris
  // azulado, hocico tierno, orejas erguidas y moño rojo.
  // Empiezas desde la punta de una lengua rosa serpenteada muy larga (36 metros,
  // mínimo 30m) que serpentea hasta la cara; te metes por la boca y encuentras una
  // rampa de lanzamiento para dar un salto espectacular sobre el abismo a la meta.
  // ---------------------------------------------------------------------------
  8: {
    id: "world-04-level-02-stage-08",
    world: 4,
    level: 2,
    stage: 8,
    name: "Rony",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 2.2, z: 33.0 },
    objects: [
      // =======================================================================
      // LENGUA SERPENTEADA CONTINUA DE RONY (LONGITUD >= 30m, 39m DE PUNTA A BOCA)
      // Una única plataforma continua orgánica con caída libre en los bordes
      // =======================================================================
      {
        id: "w4s28-continuous-tongue",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: {
          variant: "continuous_tongue",
          width: 4.2,
          pathPoints: [
            { x: 0.0, y: 1.60, z: 34.0 },  // Punta redondeada frontal (spawn a Y = 2.2, Z = 33.0)
            { x: 0.6, y: 1.52, z: 30.0 },
            { x: 1.6, y: 1.42, z: 25.0 },
            { x: 2.4, y: 1.32, z: 20.0 },  // Primer meandro serpenteado a la derecha
            { x: 1.8, y: 1.22, z: 15.0 },
            { x: 0.2, y: 1.12, z: 10.0 },
            { x: -1.4, y: 1.02, z: 5.0 },  // Segundo meandro serpenteado a la izquierda
            { x: -1.8, y: 0.94, z: 1.0 },
            { x: -0.6, y: 0.86, z: -1.5 },
            { x: 0.0, y: 0.80, z: -4.5 }   // Entrada limpia en la boca de Rony a Y = 0.80
          ]
        }
      },

      // Monumental estatua 3D del Yorkshire Terrier Rony (boca abierta formando túnel)
      {
        id: "w4s28-yorkshire-rony-portal",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -5.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "yorkshire_rony_statue" }
      },

      // =======================================================================
      // GRAN RAMPA DE LANZAMIENTO DENTRO DE LA GARGANTA DE RONY
      // Salto 100% físico natural por inercia hacia la isla dorada de meta
      // =======================================================================
      {
        id: "w4s28-mouth-launch-ramp",
        type: "ramp",
        position: { x: 0.0, y: 1.59, z: -10.34 },
        rotation: { x: 0.30, y: 0, z: 0 },
        scale: { x: 4.2, y: 0.5, z: 7.0 },
        properties: {
          variant: "mouth_booster",
          theme: "custom_color",
          customColor: "#ff4081"
        }
      },

      // Plataforma flotante de aterrizaje de meta al otro lado del abismo
      {
        id: "w4s28-landing-island",
        type: "platform",
        position: { x: 0.0, y: 1.6, z: -23.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.8, z: 10.0 },
        properties: { platformShape: "cylinder", theme: "custom_color", customColor: "#ffd54f" }
      },

      // Muro de contención trasero acolchado
      { id: "w4s28-catcher-bumper", type: "bumper", position: { x: 0.0, y: 2.8, z: -27.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.5, y: 2.0, z: 0.8 }, properties: { theme: "custom_color", customColor: "#ffb300" } },

      // 10 Coleccionables distribuidos a lo largo del recorrido y el salto
      { id: "w4s28-col-1", type: "collectible", position: { x: 0.0, y: 1.95, z: 31.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s28-col-2", type: "collectible", position: { x: 1.4, y: 1.80, z: 25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s28-col-3", type: "collectible", position: { x: 2.3, y: 1.70, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s28-col-4", type: "collectible", position: { x: 1.6, y: 1.60, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s28-col-5", type: "collectible", position: { x: 0.1, y: 1.50, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s28-col-6", type: "collectible", position: { x: -1.5, y: 1.40, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s28-col-7", type: "collectible", position: { x: 0.0, y: 1.25, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s28-col-8", type: "collectible", position: { x: 0.0, y: 2.30, z: -10.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s28-col-9", type: "collectible", position: { x: 0.0, y: 3.60, z: -17.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s28-col-10", type: "collectible", position: { x: 0.0, y: 2.40, z: -21.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta en la isla de aterrizaje
      {
        id: "w4s28-goal",
        type: "goal",
        position: { x: 0.0, y: 2.2, z: -23.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 9: Pao
  // Acogedora estancia con gran chimenea de ladrillo tradicional. Al estar quieto
  // dentro de la chimenea durante 5 segundos exactos, brotan polvos Floo con
  // partículas verdes mágicas y un fogonazo de teletransporte te transporta
  // directamente a la meta en un callejón suspendido en las alturas (Y = 28.0).
  // ---------------------------------------------------------------------------
  9: {
    id: "world-04-level-02-stage-09",
    world: 4,
    level: 2,
    stage: 9,
    name: "Pao",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 75,
    spawn: { x: 0.0, y: 1.5, z: 4.0 },
    objects: [
      // Estancia inferior con suelo de madera tradicional
      {
        id: "w4s29-hearth-room-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 12.0, y: 0.8, z: 14.0 },
        properties: { theme: "carabanchel" }
      },

      // Muros de la estancia
      { id: "w4s29-room-wall-l", type: "platform", position: { x: -6.0, y: 2.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 3.5, z: 14.0 }, properties: { theme: "custom_color", customColor: "#efebe9" } },
      { id: "w4s29-room-wall-r", type: "platform", position: { x: 6.0, y: 2.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 3.5, z: 14.0 }, properties: { theme: "custom_color", customColor: "#efebe9" } },
      { id: "w4s29-room-wall-b", type: "platform", position: { x: 0.0, y: 2.0, z: 7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 12.0, y: 3.5, z: 0.4 }, properties: { theme: "custom_color", customColor: "#efebe9" } },

      // =======================================================================
      // LA CHIMENEA TRADICIONAL CON POLVOS FLOO (FLOO FIREPLACE)
      // Quédate dentro 5 segundos inmóvil para teletransportarte al callejón alto
      // =======================================================================
      {
        id: "w4s29-floo-fireplace",
        type: "platform",
        position: { x: 0.0, y: 0.4, z: -5.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.2, y: 4.5, z: 3.2 },
        properties: {
          variant: "floo_fireplace",
          hearthBounds: { minX: -1.4, maxX: 1.4, minZ: -6.2, maxZ: -3.8 },
          teleportTarget: { x: 0.0, y: 28.5, z: -20.0 }
        }
      },

      // =======================================================================
      // CALLEJÓN ELEVADO SUSPENDIDO EN LAS ALTURAS (Y = 28.0)
      // Destino del teletransporte de los Polvos Floo
      // =======================================================================
      {
        id: "w4s29-high-alley-landing",
        type: "platform",
        position: { x: 0.0, y: 28.0, z: -22.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.5, y: 0.8, z: 8.0 },
        properties: { theme: "carabanchel" }
      },
      {
        id: "w4s29-high-alley-runway",
        type: "platform",
        position: { x: 0.0, y: 28.0, z: -34.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.0, y: 0.8, z: 18.0 },
        properties: { theme: "carabanchel" }
      },

      // Barandillas de forja en el callejón de las alturas
      { id: "w4s29-high-rail-l", type: "platform", position: { x: -2.6, y: 28.8, z: -32.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.25, y: 0.8, z: 28.0 }, properties: { theme: "custom_color", customColor: "#37474f" } },
      { id: "w4s29-high-rail-r", type: "platform", position: { x: 2.6, y: 28.8, z: -32.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.25, y: 0.8, z: 28.0 }, properties: { theme: "custom_color", customColor: "#37474f" } },

      // Chimeneas de Carabanchel en los tejados circundantes
      { id: "w4s29-chimney-1", type: "cylinder", position: { x: -4.5, y: 28.8, z: -25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 2.4, z: 0.8 }, properties: { theme: "custom_color", customColor: "#b03a2e" } },
      { id: "w4s29-chimney-2", type: "cylinder", position: { x: 4.5, y: 28.8, z: -35.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 2.4, z: 0.8 }, properties: { theme: "custom_color", customColor: "#b03a2e" } },
      { id: "w4s29-lamp-high", type: "decoration", position: { x: 3.2, y: 28.4, z: -40.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },

      // 10 Coleccionables
      // 4 en la sala inferior alrededor de la chimenea
      { id: "w4s29-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s29-col-2", type: "collectible", position: { x: -2.5, y: 0.8, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s29-col-3", type: "collectible", position: { x: 2.5, y: 0.8, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s29-col-4", type: "collectible", position: { x: 0.0, y: 0.8, z: -4.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // 6 en el callejón de las alturas tras el viaje de polvos Floo
      { id: "w4s29-col-5", type: "collectible", position: { x: 0.0, y: 28.8, z: -23.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s29-col-6", type: "collectible", position: { x: -1.2, y: 28.8, z: -28.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s29-col-7", type: "collectible", position: { x: 1.2, y: 28.8, z: -32.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s29-col-8", type: "collectible", position: { x: -1.2, y: 28.8, z: -36.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s29-col-9", type: "collectible", position: { x: 1.2, y: 28.8, z: -40.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s29-col-10", type: "collectible", position: { x: 0.0, y: 28.8, z: -43.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta al fondo del callejón en las alturas
      {
        id: "w4s29-goal",
        type: "goal",
        position: { x: 0.0, y: 28.8, z: -46.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 10: Ninanos
  // Misma calle y plataforma que la etapa Bus34 (Calle San Melitón), pero sin bus.
  // El personaje debe avanzar hasta la meta sorteando a 6 personas de piel morena,
  // pelo negro, barba y sudaderas, junto a 3 perros en constante patrulla.
  // Si cualquiera de ellos te pilla, te eliminan y pierdes una vida.
  // ---------------------------------------------------------------------------
  10: {
    id: "world-04-level-02-stage-10",
    world: 4,
    level: 2,
    stage: 10,
    name: "Ninanos",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 75,
    spawn: { x: 0.0, y: 1.5, z: 24.0 },
    objects: [
      // Calle San Melitón (idéntica a Bus34 pero a nivel peatonal)
      {
        id: "w4s210-street-roadway",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -20.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.2, y: 0.8, z: 96.0 },
        properties: { theme: "carabanchel" }
      },

      // Bordillos de granito pulido
      { id: "w4s210-curb-l", type: "platform", position: { x: -3.7, y: 0.45, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.35, y: 0.35, z: 96.0 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w4s210-curb-r", type: "platform", position: { x: 3.7, y: 0.45, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.35, y: 0.35, z: 96.0 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },

      // Aceras laterales
      { id: "w4s210-sidewalk-l", type: "platform", position: { x: -5.4, y: 0.55, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 0.55, z: 96.0 }, properties: { theme: "carabanchel" } },
      { id: "w4s210-sidewalk-r", type: "platform", position: { x: 5.4, y: 0.55, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 0.55, z: 96.0 }, properties: { theme: "carabanchel" } },

      // Edificios residenciales amarillos y naranjas de Calle San Melitón
      // Acera izquierda (X = -8.6)
      { id: "w4s210-bldg-l1", type: "decoration", position: { x: -8.6, y: 0.55, z: 22.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "yellow", shopType: "portal" } },
      { id: "w4s210-bldg-l2", type: "decoration", position: { x: -8.6, y: 0.55, z: 8.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "orange", shopType: "portal" } },
      { id: "w4s210-bldg-l3", type: "decoration", position: { x: -8.6, y: 0.55, z: -6.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "yellow", shopType: "portal" } },
      { id: "w4s210-bldg-l4", type: "decoration", position: { x: -8.6, y: 0.55, z: -20.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "orange", shopType: "portal" } },
      { id: "w4s210-bldg-l5", type: "decoration", position: { x: -8.6, y: 0.55, z: -34.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "yellow", shopType: "portal" } },
      { id: "w4s210-bldg-l6", type: "decoration", position: { x: -8.6, y: 0.55, z: -48.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "orange", shopType: "portal" } },
      { id: "w4s210-bldg-l7", type: "decoration", position: { x: -8.6, y: 0.55, z: -62.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "yellow", shopType: "portal" } },

      // Acera derecha (X = 8.6)
      { id: "w4s210-bldg-r1", type: "decoration", position: { x: 8.6, y: 0.55, z: 22.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "orange", shopType: "portal" } },
      { id: "w4s210-bldg-r2", type: "decoration", position: { x: 8.6, y: 0.55, z: 8.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "yellow", shopType: "portal" } },
      { id: "w4s210-bldg-r3", type: "decoration", position: { x: 8.6, y: 0.55, z: -6.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "orange", shopType: "portal" } },
      { id: "w4s210-bldg-r4", type: "decoration", position: { x: 8.6, y: 0.55, z: -20.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "yellow", shopType: "portal" } },
      { id: "w4s210-bldg-r5", type: "decoration", position: { x: 8.6, y: 0.55, z: -34.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "orange", shopType: "portal" } },
      { id: "w4s210-bldg-r6", type: "decoration", position: { x: 8.6, y: 0.55, z: -48.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "yellow", shopType: "portal" } },
      { id: "w4s210-bldg-r7", type: "decoration", position: { x: 8.6, y: 0.55, z: -62.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_residential_building", facadeColor: "orange", shopType: "portal" } },

      // Farolas de la calle
      { id: "w4s210-lamp-1", type: "decoration", position: { x: -4.4, y: 0.55, z: 16.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s210-lamp-2", type: "decoration", position: { x: 4.4, y: 0.55, z: 2.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s210-lamp-3", type: "decoration", position: { x: -4.4, y: 0.55, z: -14.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s210-lamp-4", type: "decoration", position: { x: 4.4, y: 0.55, z: -28.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s210-lamp-5", type: "decoration", position: { x: -4.4, y: 0.55, z: -42.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s210-lamp-6", type: "decoration", position: { x: 4.4, y: 0.55, z: -56.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },

      // =======================================================================
      // 6 HOMBRES EN SUDADERA (Piel morena, pelo negro, barba) QUE ELIMINAN AL JUGADOR
      // =======================================================================
      {
        id: "w4s210-man-1",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: 14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: {
          variant: "carabanchel_hooded_man",
          movementType: "street_patrol_man",
          axis: "x",
          distance: 5.2,
          speed: 2.2,
          phase: 0.0,
          hoodieColor: "#1e293b", // sudadera gris oscuro
          isMoving: true,
          eliminatesPlayer: true
        }
      },
      {
        id: "w4s210-man-2",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: {
          variant: "carabanchel_hooded_man",
          movementType: "street_patrol_man",
          axis: "x",
          distance: 5.2,
          speed: 2.6,
          phase: 1.4,
          hoodieColor: "#b91c1c", // sudadera roja
          isMoving: true,
          eliminatesPlayer: true
        }
      },
      {
        id: "w4s210-man-3",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: {
          variant: "carabanchel_hooded_man",
          movementType: "street_patrol_man",
          axis: "x",
          distance: 5.2,
          speed: 2.4,
          phase: 2.8,
          hoodieColor: "#1e3a8a", // sudadera azul marino
          isMoving: true,
          eliminatesPlayer: true
        }
      },
      {
        id: "w4s210-man-4",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: -22.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: {
          variant: "carabanchel_hooded_man",
          movementType: "street_patrol_man",
          axis: "x",
          distance: 5.2,
          speed: 2.8,
          phase: 0.7,
          hoodieColor: "#047857", // sudadera verde
          isMoving: true,
          eliminatesPlayer: true
        }
      },
      {
        id: "w4s210-man-5",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: -34.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: {
          variant: "carabanchel_hooded_man",
          movementType: "street_patrol_man",
          axis: "x",
          distance: 5.2,
          speed: 2.3,
          phase: 2.1,
          hoodieColor: "#334155", // sudadera gris marengo
          isMoving: true,
          eliminatesPlayer: true
        }
      },
      {
        id: "w4s210-man-6",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: -46.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: {
          variant: "carabanchel_hooded_man",
          movementType: "street_patrol_man",
          axis: "x",
          distance: 5.2,
          speed: 2.7,
          phase: 3.5,
          hoodieColor: "#0f172a", // sudadera negra
          isMoving: true,
          eliminatesPlayer: true
        }
      },

      // =======================================================================
      // 3 PERROS QUE PATRULLAN LA CALLE Y ELIMINAN AL JUGADOR SI LO TOCAN
      // =======================================================================
      {
        id: "w4s210-dog-1",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: 8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: {
          variant: "carabanchel_dog",
          movementType: "village_dogs",
          axis: "x",
          distance: 5.0,
          speed: 4.2,
          phase: 0.5,
          isMoving: true,
          eliminatesPlayer: true
        }
      },
      {
        id: "w4s210-dog-2",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: -16.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: {
          variant: "carabanchel_dog",
          movementType: "village_dogs",
          axis: "x",
          distance: 5.0,
          speed: 4.6,
          phase: 1.8,
          isMoving: true,
          eliminatesPlayer: true
        }
      },
      {
        id: "w4s210-dog-3",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: -40.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: {
          variant: "carabanchel_dog",
          movementType: "village_dogs",
          axis: "x",
          distance: 5.0,
          speed: 4.4,
          phase: 3.0,
          isMoving: true,
          eliminatesPlayer: true
        }
      },

      // 10 Coleccionables distribuidos entre los patrulleros
      { id: "w4s210-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s210-col-2", type: "collectible", position: { x: -2.0, y: 0.8, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s210-col-3", type: "collectible", position: { x: 2.0, y: 0.8, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s210-col-4", type: "collectible", position: { x: -2.0, y: 0.8, z: -3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s210-col-5", type: "collectible", position: { x: 2.0, y: 0.8, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s210-col-6", type: "collectible", position: { x: -2.0, y: 0.8, z: -25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s210-col-7", type: "collectible", position: { x: 2.0, y: 0.8, z: -31.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s210-col-8", type: "collectible", position: { x: -2.0, y: 0.8, z: -37.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s210-col-9", type: "collectible", position: { x: 2.0, y: 0.8, z: -49.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s210-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -58.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta al final de Calle San Melitón
      {
        id: "w4s210-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -64.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  }
};

// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('4_2_')) Object.assign(WORLD_04_LEVEL_02_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(4,2,WORLD_04_LEVEL_02_STAGES);

