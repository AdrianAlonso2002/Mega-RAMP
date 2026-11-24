import publishedEditorStages from '../editor-saved/world-04.json';
import {registerStageSet} from '../StageRegistry';
import type { LevelData } from "../LevelTypes";

// =============================================================================
// MUNDO 4: CARABANCHEL (Madrid) - NIVEL 1: PIQUEÑAS
// 10 Etapas completamente diseñadas, ambientadas e interactivas.
// =============================================================================

export const WORLD_04_LEVEL_01_STAGES: Record<number, LevelData> = {
  // ---------------------------------------------------------------------------
  // ETAPA 1: Cuadrado4
  // Plaza urbana cuadrada de Carabanchel (18x18m) con pavimento castizo de adoquín
  // granítico, ladrillo rojo madrileño, farolas fernandinas, bancos, contenedores
  // de reciclaje y totem del Metro de Madrid.
  // ---------------------------------------------------------------------------
  1: {
    id: "world-04-level-01-stage-01",
    world: 4,
    level: 1,
    stage: 1,
    name: "Cuadrado4",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 7.0 },
    objects: [
      // Plaza principal de adoquín de granito urbano
      {
        id: "w4s11-plaza-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 18.0, y: 0.8, z: 18.0 },
        properties: { theme: "carabanchel" }
      },

      // Bordillos de granito perimetrales
      { id: "w4s11-curb-back", type: "platform", position: { x: 0.0, y: 0.5, z: 8.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 18.0, y: 0.4, z: 0.4 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w4s11-curb-left", type: "platform", position: { x: -8.8, y: 0.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 18.0 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w4s11-curb-right", type: "platform", position: { x: 8.8, y: 0.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 18.0 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },

      // Totem icónico de entrada al Metro de Madrid
      { id: "w4s11-metro-sign", type: "decoration", position: { x: -7.0, y: 0.4, z: -7.0 }, rotation: { x: 0, y: Math.PI / 4, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_metro_sign" } },

      // Placa de calle tradicional madrileña: Calle de las Piqueñas
      { id: "w4s11-street-sign", type: "decoration", position: { x: 0.0, y: 0.4, z: 8.2 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_sign_carabanchel" } },

      // Farolas urbanas de Madrid
      { id: "w4s11-lamp-1", type: "decoration", position: { x: -7.5, y: 0.4, z: 7.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s11-lamp-2", type: "decoration", position: { x: 7.5, y: 0.4, z: 7.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s11-lamp-3", type: "decoration", position: { x: 7.5, y: 0.4, z: -7.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },

      // Trío de contenedores de reciclaje de Madrid (verde, amarillo, azul)
      { id: "w4s11-recycle-bins", type: "decoration", position: { x: 6.2, y: 0.4, z: -2.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_recycle_bins" } },

      // Bancos urbanos y bolardos de granito
      { id: "w4s11-bench-1", type: "decoration", position: { x: -5.0, y: 0.4, z: 7.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "bench" } },
      { id: "w4s11-bench-2", type: "decoration", position: { x: 5.0, y: 0.4, z: 7.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "bench" } },
      { id: "w4s11-bollard-1", type: "decoration", position: { x: -8.0, y: 0.4, z: 2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_granite_bollard" } },
      { id: "w4s11-bollard-2", type: "decoration", position: { x: -8.0, y: 0.4, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_granite_bollard" } },

      // Terraza de bar madrileña con sombrilla
      { id: "w4s11-terrace-bar", type: "decoration", position: { x: -5.5, y: 0.4, z: 2.0 }, rotation: { x: 0, y: 0.3, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_terrace_bar_umbrella" } },

      // 10 Coleccionables
      { id: "w4s11-col-1", type: "collectible", position: { x: -5.0, y: 0.8, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s11-col-2", type: "collectible", position: { x: 0.0, y: 0.8, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s11-col-3", type: "collectible", position: { x: 5.0, y: 0.8, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s11-col-4", type: "collectible", position: { x: -5.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s11-col-5", type: "collectible", position: { x: 0.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s11-col-6", type: "collectible", position: { x: 5.0, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s11-col-7", type: "collectible", position: { x: -5.0, y: 0.8, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s11-col-8", type: "collectible", position: { x: 5.0, y: 0.8, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s11-col-9", type: "collectible", position: { x: -2.5, y: 0.8, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s11-col-10", type: "collectible", position: { x: 2.5, y: 0.8, z: -2.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta al fondo de la plaza
      {
        id: "w4s11-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -7.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 2: Bus35
  // Calle de las Piqueñas reconstruida a partir del Portal 4 (más de 88m de longitud).
  // El personaje cae desde arriba dentro del autobús azul de la EMT Línea 35
  // (Scania N280UB GNC), el autobús espera 2 segundos y avanza lentamente
  // llevando al personaje en su interior por la calle flanqueada por aceras de
  // granito, edificios de ladrillo con toldos verdes, farmacia, bazar, furgoneta
  // blanca, coches y contenedores de reciclaje hasta la meta en la cabecera.
  // ---------------------------------------------------------------------------
  2: {
    id: "world-04-level-01-stage-02",
    world: 4,
    level: 1,
    stage: 2,
    name: "Bus35",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 75,
    properties: {
      cameraMode: "cinematic_bus35"
    },
    // El personaje cae directamente desde arriba dentro del habitáculo del autobús
    spawn: { x: 0.0, y: 4.2, z: 34.0 },
    objects: [
      // Calzada de asfalto continuo de Calle de las Piqueñas (Longitud 88.0m >= 80m)
      {
        id: "w4s12-street-asphalt",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -4.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.2, y: 0.6, z: 88.0 },
        properties: { theme: "custom_color", customColor: "#263238" }
      },

      // Línea central discontinua de pintura vial
      {
        id: "w4s12-lane-stripe",
        type: "platform",
        position: { x: 0.0, y: 0.32, z: -4.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.25, y: 0.05, z: 88.0 },
        properties: { theme: "custom_color", customColor: "#eceff1" }
      },

      // Marcaje vial en el asfalto: "C. Piqueñas" en stencil blanco (según foto adjunta)
      {
        id: "w4s12-marking-piquenas",
        type: "decoration",
        position: { x: 0.0, y: 0.32, z: 36.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "madrid_street_marking_piquenas" }
      },

      // Acera izquierda de baldosas de granito con bordillo
      {
        id: "w4s12-sidewalk-l",
        type: "platform",
        position: { x: -4.9, y: 0.2, z: -4.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.6, y: 0.8, z: 88.0 },
        properties: { theme: "carabanchel" }
      },

      // Acera derecha de baldosas de granito con bordillo
      {
        id: "w4s12-sidewalk-r",
        type: "platform",
        position: { x: 4.9, y: 0.2, z: -4.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.6, y: 0.8, z: 88.0 },
        properties: { theme: "carabanchel" }
      },

      // Placa oficial del Portal 4 de Calle de las Piqueñas
      {
        id: "w4s12-sign-portal4",
        type: "decoration",
        position: { x: -5.8, y: 0.6, z: 36.0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "madrid_street_sign_carabanchel" }
      },

      // =======================================================================
      // EDIFICIOS RESIDENCIALES DE LADRILLO CON TOLDOS VERDES Y COMERCIOS
      // Recreados fielmente según foto de Calle de las Piqueñas
      // =======================================================================
      // Edificio acera derecha 1: Con Farmacia y cruz verde luminosa en planta baja
      {
        id: "w4s12-building-r-farmacia",
        type: "decoration",
        position: { x: 8.2, y: 0.6, z: 26.0 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1.15, y: 1.25, z: 1.15 },
        properties: { subType: "madrid_residential_building", shopType: "farmacia", facadeColor: "brick" }
      },
      // Edificio acera derecha 2: Con portón de garaje marrón y toldos verdes (Color amarillo albero)
      {
        id: "w4s12-building-r-garage",
        type: "decoration",
        position: { x: 8.2, y: 0.6, z: 8.0 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1.15, y: 1.25, z: 1.15 },
        properties: { subType: "madrid_residential_building", shopType: "garage", facadeColor: "yellow" }
      },
      // Edificio acera derecha 3: Con Bazar / Alimentación (Color blanco/crema)
      {
        id: "w4s12-building-r-bazar",
        type: "decoration",
        position: { x: 8.2, y: 0.6, z: -10.0 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1.15, y: 1.25, z: 1.15 },
        properties: { subType: "madrid_residential_building", shopType: "bazar", facadeColor: "white" }
      },
      // Edificio acera derecha 4: Portal residencial (Color naranja caravista)
      {
        id: "w4s12-building-r-portal",
        type: "decoration",
        position: { x: 8.2, y: 0.6, z: -28.0 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1.15, y: 1.25, z: 1.15 },
        properties: { subType: "madrid_residential_building", shopType: "portal", facadeColor: "orange" }
      },

      // Edificio acera izquierda 1: Portal 4 (Color blanco/crema según foto)
      {
        id: "w4s12-building-l-portal4",
        type: "decoration",
        position: { x: -8.2, y: 0.6, z: 32.0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1.15, y: 1.25, z: 1.15 },
        properties: { subType: "madrid_residential_building", shopType: "portal", facadeColor: "white" }
      },
      // Edificio acera izquierda 2: Bazar y toldos verdes (Color amarillo albero)
      {
        id: "w4s12-building-l-bazar",
        type: "decoration",
        position: { x: -8.2, y: 0.6, z: 14.0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1.15, y: 1.25, z: 1.15 },
        properties: { subType: "madrid_residential_building", shopType: "bazar", facadeColor: "yellow" }
      },
      // Edificio acera izquierda 3: Garaje y toldos verdes (Color naranja caravista)
      {
        id: "w4s12-building-l-garage",
        type: "decoration",
        position: { x: -8.2, y: 0.6, z: -4.0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1.15, y: 1.25, z: 1.15 },
        properties: { subType: "madrid_residential_building", shopType: "garage", facadeColor: "orange" }
      },
      // Edificio acera izquierda 4: Residencial (Color ladrillo rojo clásico)
      {
        id: "w4s12-building-l-res",
        type: "decoration",
        position: { x: -8.2, y: 0.6, z: -22.0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        scale: { x: 1.15, y: 1.25, z: 1.15 },
        properties: { subType: "madrid_residential_building", shopType: "portal", facadeColor: "brick" }
      },

      // =======================================================================
      // VEHÍCULOS ESTACIONADOS EN LA CALZADA (Según foto Calle Piqueñas)
      // =======================================================================
      // Furgoneta de reparto blanca estacionada a la izquierda (foto Piqueñas)
      {
        id: "w4s12-van-white",
        type: "decoration",
        position: { x: -4.6, y: 0.6, z: 24.0 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "madrid_parked_car", carType: "van", color: "#f8fafc" }
      },
      // Coche compacto gris oscuro estacionado a la derecha
      {
        id: "w4s12-car-grey",
        type: "decoration",
        position: { x: 4.6, y: 0.6, z: 18.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "madrid_parked_car", carType: "compact", color: "#374151" }
      },
      // Coche sedán azul pizarra estacionado a la derecha
      {
        id: "w4s12-car-slate",
        type: "decoration",
        position: { x: 4.6, y: 0.6, z: -2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "madrid_parked_car", carType: "compact", color: "#1e293b" }
      },
      // Furgoneta blanca adicional al fondo a la izquierda
      {
        id: "w4s12-van-white2",
        type: "decoration",
        position: { x: -4.6, y: 0.6, z: -16.0 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "madrid_parked_car", carType: "van", color: "#f1f5f9" }
      },

      // Contenedores de reciclaje de Madrid (verde, amarillo, azul) en la acera derecha
      {
        id: "w4s12-recycle-bins",
        type: "decoration",
        position: { x: 4.8, y: 0.6, z: 24.0 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "madrid_recycle_bins" }
      },

      // Marquesina oficial de autobús de la EMT Madrid Línea 35 en la parada de destino
      {
        id: "w4s12-bus-shelter",
        type: "decoration",
        position: { x: 5.2, y: 0.6, z: -38.0 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: { x: 1.1, y: 1.1, z: 1.1 },
        properties: { subType: "madrid_bus_stop" }
      },

      // Farolas clásicas de Madrid y semáforo urbano
      { id: "w4s12-lamp-1", type: "decoration", position: { x: -5.4, y: 0.6, z: 20.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s12-lamp-2", type: "decoration", position: { x: 5.4, y: 0.6, z: 0.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s12-lamp-3", type: "decoration", position: { x: -5.4, y: 0.6, z: -20.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s12-traffic-light", type: "decoration", position: { x: 5.4, y: 0.6, z: -36.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_traffic_light" } },

      // =======================================================================
      // AUTOBÚS AZUL EMT MADRID LÍNEA 35 (SCANIA N280UB GNC)
      // Plataforma cinemática integral con interior transitable y techo abierto.
      // Espera 2 segundos (startDelay: 2.0) y avanza lentamente (speed: 3.2 m/s)
      // transportando al personaje dentro de su habitáculo de forma segura.
      // =======================================================================
      {
        id: "w4s12-bus-chassis",
        type: "moving-platform",
        position: { x: 0.0, y: 0.45, z: 34.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.4, y: 0.45, z: 8.6 },
        properties: {
          variant: "emt_bus_35",
          movementType: "emt_bus_35",
          theme: "custom_color",
          customColor: "#0055b8", // Azul corporativo EMT Madrid
          axis: "z",
          direction: -1,
          distance: 78.0,
          speed: 3.2,
          startDelay: 2.0,
          isMoving: true
        }
      },

      // =======================================================================
      // 10 COLECCIONABLES
      // 6 sincronizados en el interior del autobús que se mueven con él
      // 4 en la calle y parada final
      // =======================================================================
      {
        id: "w4s12-col-1",
        type: "collectible",
        position: { x: 0.0, y: 1.1, z: 36.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
        properties: { axis: "z", direction: -1, distance: 78.0, speed: 3.2, startDelay: 2.0, movementType: "forward" }
      },
      {
        id: "w4s12-col-2",
        type: "collectible",
        position: { x: 0.0, y: 1.1, z: 35.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
        properties: { axis: "z", direction: -1, distance: 78.0, speed: 3.2, startDelay: 2.0, movementType: "forward" }
      },
      {
        id: "w4s12-col-3",
        type: "collectible",
        position: { x: 0.0, y: 1.1, z: 33.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
        properties: { axis: "z", direction: -1, distance: 78.0, speed: 3.2, startDelay: 2.0, movementType: "forward" }
      },
      {
        id: "w4s12-col-4",
        type: "collectible",
        position: { x: 0.0, y: 1.1, z: 32.6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
        properties: { axis: "z", direction: -1, distance: 78.0, speed: 3.2, startDelay: 2.0, movementType: "forward" }
      },
      {
        id: "w4s12-col-5",
        type: "collectible",
        position: { x: 0.0, y: 1.1, z: 31.4 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
        properties: { axis: "z", direction: -1, distance: 78.0, speed: 3.2, startDelay: 2.0, movementType: "forward" }
      },
      {
        id: "w4s12-col-6",
        type: "collectible",
        position: { x: 0.0, y: 1.1, z: 30.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.4, y: 0.4, z: 0.4 },
        properties: { axis: "z", direction: -1, distance: 78.0, speed: 3.2, startDelay: 2.0, movementType: "forward" }
      },
      // Coleccionables en la calle cerca del destino y marquesina
      { id: "w4s12-col-7", type: "collectible", position: { x: 0.0, y: 1.0, z: -38.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s12-col-8", type: "collectible", position: { x: -1.8, y: 1.0, z: -40.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s12-col-9", type: "collectible", position: { x: 1.8, y: 1.0, z: -40.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s12-col-10", type: "collectible", position: { x: 0.0, y: 1.0, z: -43.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta en la cabecera final de línea al llegar el autobús
      {
        id: "w4s12-goal",
        type: "goal",
        position: { x: 0.0, y: 1.2, z: -44.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 3: Día2
  // Supermercado DÍA ampliado (más de 62m de nave comercial), con muebles,
  // estanterías de productos y transpalets en continuo movimiento oscilante.
  // ---------------------------------------------------------------------------
  3: {
    id: "world-04-level-01-stage-03",
    world: 4,
    level: 1,
    stage: 3,
    name: "Día2",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 28.0 },
    objects: [
      // Pasillo central blanco brillante del supermercado DÍA (64m de longitud)
      {
        id: "w4s13-dia-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.6, y: 0.8, z: 64.0 },
        properties: { theme: "custom_color", customColor: "#f5f5f5" }
      },

      // Frisos y murales rojos corporativos de DÍA en ambos laterales
      { id: "w4s13-wall-l", type: "platform", position: { x: -4.6, y: 1.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.6, y: 2.8, z: 64.0 }, properties: { theme: "custom_color", customColor: "#d32f2f" } },
      { id: "w4s13-wall-r", type: "platform", position: { x: 4.6, y: 1.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.6, y: 2.8, z: 64.0 }, properties: { theme: "custom_color", customColor: "#d32f2f" } },

      // Cartel luminoso oficial de DÍA
      { id: "w4s13-dia-sign", type: "decoration", position: { x: 0.0, y: 3.4, z: 26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "dia_sign" } },

      // =======================================================================
      // MUEBLES Y ESTANTERÍAS MÓVILES EN CONTINUO DESPLAZAMIENTO LATERAL
      // =======================================================================
      // Mueble góndola móvil 1 (Lácteos): oscila de izquierda a derecha
      {
        id: "w4s13-shelf-mov-1",
        type: "moving-platform",
        position: { x: 0.0, y: 1.1, z: 18.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.2, y: 1.8, z: 1.6 },
        properties: {
          theme: "custom_color",
          customColor: "#e0e0e0",
          axis: "x",
          distance: 2.4,
          speed: 2.4,
          phase: 0,
          isMoving: true
        }
      },
      // Mueble móvil 2 (Bebidas): oscila en contrafase
      {
        id: "w4s13-shelf-mov-2",
        type: "moving-platform",
        position: { x: 0.0, y: 1.1, z: 6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.2, y: 1.8, z: 1.6 },
        properties: {
          theme: "custom_color",
          customColor: "#b0bec5",
          axis: "x",
          distance: 2.4,
          speed: 2.8,
          phase: Math.PI / 2,
          isMoving: true
        }
      },
      // Mueble móvil 3 (Despensa y conservas): velocidad superior
      {
        id: "w4s13-shelf-mov-3",
        type: "moving-platform",
        position: { x: 0.0, y: 1.1, z: -6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.2, y: 1.8, z: 1.6 },
        properties: {
          theme: "custom_color",
          customColor: "#e0e0e0",
          axis: "x",
          distance: 2.5,
          speed: 3.0,
          phase: Math.PI,
          isMoving: true
        }
      },
      // Transpalet móvil con cajas y palé de productos
      {
        id: "w4s13-pallet-mov-4",
        type: "moving-platform",
        position: { x: 0.0, y: 0.7, z: -18.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.6, y: 1.0, z: 2.0 },
        properties: {
          theme: "custom_color",
          customColor: "#f57c00",
          axis: "x",
          distance: 2.6,
          speed: 3.2,
          phase: Math.PI * 1.5,
          isMoving: true
        }
      },

      // Mostrador de cajas de salida DÍA
      { id: "w4s13-checkout", type: "decoration", position: { x: -1.8, y: 0.4, z: -27.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 }, properties: { subType: "checkout_counter" } },

      // 10 Coleccionables
      { id: "w4s13-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s13-col-2", type: "collectible", position: { x: -2.2, y: 0.8, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s13-col-3", type: "collectible", position: { x: 2.2, y: 0.8, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s13-col-4", type: "collectible", position: { x: 0.0, y: 0.8, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s13-col-5", type: "collectible", position: { x: -2.2, y: 0.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s13-col-6", type: "collectible", position: { x: 2.2, y: 0.8, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s13-col-7", type: "collectible", position: { x: 0.0, y: 0.8, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s13-col-8", type: "collectible", position: { x: -2.2, y: 0.8, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s13-col-9", type: "collectible", position: { x: 2.2, y: 0.8, z: -24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s13-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -27.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta en la zona de cajas
      {
        id: "w4s13-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -30.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 4: Droguería
  // Auténtico bazar chino y droguería tradicional de barrio dividido en 3 carriles
  // paralelos repletos de artículos, farolillos y obstáculos alternados.
  // ---------------------------------------------------------------------------
  4: {
    id: "world-04-level-01-stage-04",
    world: 4,
    level: 1,
    stage: 4,
    name: "Droguería",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 24.0 },
    objects: [
      // Plataforma principal del bazar dividida en 3 carriles (10.5m ancho, 54m largo)
      {
        id: "w4s14-bazar-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.5, y: 0.8, z: 54.0 },
        properties: { theme: "custom_color", customColor: "#fff8e1" }
      },

      // Muro divisor carril izquierdo / central
      { id: "w4s14-div-l1", type: "platform", position: { x: -1.75, y: 1.0, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 1.6, z: 12.0 }, properties: { theme: "custom_color", customColor: "#ffb300" } },
      { id: "w4s14-div-l2", type: "platform", position: { x: -1.75, y: 1.0, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 1.6, z: 16.0 }, properties: { theme: "custom_color", customColor: "#ffb300" } },

      // Muro divisor carril derecho / central
      { id: "w4s14-div-r1", type: "platform", position: { x: 1.75, y: 1.0, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 1.6, z: 16.0 }, properties: { theme: "custom_color", customColor: "#ffb300" } },
      { id: "w4s14-div-r2", type: "platform", position: { x: 1.75, y: 1.0, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 1.6, z: 12.0 }, properties: { theme: "custom_color", customColor: "#ffb300" } },

      // Paredes exteriores decoradas
      { id: "w4s14-wall-ext-l", type: "platform", position: { x: -5.1, y: 1.2, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 2.0, z: 54.0 }, properties: { theme: "custom_color", customColor: "#c62828" } },
      { id: "w4s14-wall-ext-r", type: "platform", position: { x: 5.1, y: 1.2, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 2.0, z: 54.0 }, properties: { theme: "custom_color", customColor: "#c62828" } },

      // Estantes expositores de bazar con farolillos chinos
      { id: "w4s14-bazar-shelf-1", type: "decoration", position: { x: -3.5, y: 0.4, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "bazar_shelf_display" } },
      { id: "w4s14-bazar-shelf-2", type: "decoration", position: { x: 3.5, y: 0.4, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "bazar_shelf_display" } },
      { id: "w4s14-bazar-shelf-3", type: "decoration", position: { x: -3.5, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "bazar_shelf_display" } },

      // Bloqueos de carril estratégicos (obligan al jugador a cambiar entre los 3 carriles)
      // Bloqueo 1: cierra carril izquierdo en Z=8
      { id: "w4s14-block-lane-l", type: "bumper", position: { x: -3.5, y: 0.7, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.4, y: 1.0, z: 1.2 }, properties: { theme: "custom_color", customColor: "#f44336" } },
      // Bloqueo 2: cierra carril central en Z=-2
      { id: "w4s14-block-lane-c", type: "bumper", position: { x: 0.0, y: 0.7, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.4, y: 1.0, z: 1.2 }, properties: { theme: "custom_color", customColor: "#f44336" } },
      // Bloqueo 3: cierra carril derecho en Z=-10
      { id: "w4s14-block-lane-r", type: "bumper", position: { x: 3.5, y: 0.7, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 2.4, y: 1.0, z: 1.2 }, properties: { theme: "custom_color", customColor: "#f44336" } },

      // 10 Coleccionables distribuidos entre los 3 carriles
      { id: "w4s14-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s14-col-2", type: "collectible", position: { x: -3.5, y: 0.8, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s14-col-3", type: "collectible", position: { x: 3.5, y: 0.8, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s14-col-4", type: "collectible", position: { x: 0.0, y: 0.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s14-col-5", type: "collectible", position: { x: 3.5, y: 0.8, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s14-col-6", type: "collectible", position: { x: -3.5, y: 0.8, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s14-col-7", type: "collectible", position: { x: 0.0, y: 0.8, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s14-col-8", type: "collectible", position: { x: -3.5, y: 0.8, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s14-col-9", type: "collectible", position: { x: 3.5, y: 0.8, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s14-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -23.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Caja mostrador de cobro del bazar
      { id: "w4s14-checkout", type: "decoration", position: { x: 2.2, y: 0.4, z: -22.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "checkout_counter" } },

      // Meta al fondo del bazar
      {
        id: "w4s14-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -26.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos13
  // Circuito de obstáculos dinámico ambientado en el mobiliario urbano de Carabanchel:
  // bolardos esféricos de granito rebotadores, bocas de riego rojas, tornos de metro
  // giratorios y vallas de obras madrileñas.
  // ---------------------------------------------------------------------------
  5: {
    id: "world-04-level-01-stage-05",
    world: 4,
    level: 1,
    stage: 5,
    name: "Objetos13",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 25.0 },
    objects: [
      // Pasarela principal de asfalto y granito (8.0m ancho, 56m largo)
      {
        id: "w4s15-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.8, z: 56.0 },
        properties: { theme: "carabanchel" }
      },

      // Bordillos de protección
      { id: "w4s15-curb-l", type: "platform", position: { x: -3.9, y: 0.5, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.3, y: 0.4, z: 56.0 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w4s15-curb-r", type: "platform", position: { x: 3.9, y: 0.5, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.3, y: 0.4, z: 56.0 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },

      // Obstáculos urbanos: Bocas de riego rojas (Bumpers cilíndricos rebotadores)
      { id: "w4s15-hydrant-1", type: "bumper", position: { x: -2.0, y: 0.6, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { shape: "cylinder", customColor: "#e53935" } },
      { id: "w4s15-hydrant-2", type: "bumper", position: { x: 2.0, y: 0.6, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { shape: "cylinder", customColor: "#e53935" } },
      { id: "w4s15-hydrant-3", type: "bumper", position: { x: 0.0, y: 0.6, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.2, y: 1.1, z: 1.2 }, properties: { shape: "cylinder", customColor: "#e53935" } },

      // Bolardos de granito madrileño (bumpers de impacto)
      { id: "w4s15-bollard-1", type: "bumper", position: { x: -2.2, y: 0.55, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.9, y: 0.9, z: 0.9 }, properties: { shape: "cylinder", customColor: "#90a4ae" } },
      { id: "w4s15-bollard-2", type: "bumper", position: { x: 2.2, y: 0.55, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.9, y: 0.9, z: 0.9 }, properties: { shape: "cylinder", customColor: "#90a4ae" } },

      // Aspas giratorias estilo torno de Metro de Madrid
      {
        id: "w4s15-turnstile-rot",
        type: "rotating-platform",
        position: { x: 0.0, y: 0.5, z: -14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.4, y: 0.4, z: 0.45 },
        properties: {
          customColor: "#0288d1",
          speed: 2.0,
          axis: "y"
        }
      },

      // Quiosco de prensa y farolas decorativas en la meta
      { id: "w4s15-kiosk", type: "decoration", position: { x: -2.8, y: 0.4, z: -24.0 }, rotation: { x: 0, y: Math.PI / 4, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_kiosk_press" } },
      { id: "w4s15-lamp-fin", type: "decoration", position: { x: 2.8, y: 0.4, z: -24.0 }, rotation: { x: 0, y: -Math.PI / 4, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },

      // 10 Coleccionables
      { id: "w4s15-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s15-col-2", type: "collectible", position: { x: 2.0, y: 0.8, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s15-col-3", type: "collectible", position: { x: -2.0, y: 0.8, z: 12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s15-col-4", type: "collectible", position: { x: 2.0, y: 0.8, z: 7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s15-col-5", type: "collectible", position: { x: -2.0, y: 0.8, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s15-col-6", type: "collectible", position: { x: 0.0, y: 0.8, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s15-col-7", type: "collectible", position: { x: 0.0, y: 0.8, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s15-col-8", type: "collectible", position: { x: 0.0, y: 0.8, z: -17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s15-col-9", type: "collectible", position: { x: -1.8, y: 0.8, z: -21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s15-col-10", type: "collectible", position: { x: 1.8, y: 0.8, z: -21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta
      {
        id: "w4s15-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -26.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 6: Misina2
  // La monumental gata blanca Misina regresa en Carabanchel con su lengua rosa,
  // culminando en un salto final espectacular sobre un gran abismo urbano hasta
  // una plataforma flotante donde aguarda la meta.
  // ---------------------------------------------------------------------------
  6: {
    id: "world-04-level-01-stage-06",
    world: 4,
    level: 1,
    stage: 6,
    name: "Misina2",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 24.0 },
    objects: [
      // Plaza de entrada urbana
      { id: "w4s16-plaza", type: "platform", position: { x: 0.0, y: 0.0, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.5, y: 0.8, z: 7.5 }, properties: { theme: "carabanchel" } },

      // Monumental cabeza 3D de la gata Misina (portal de acceso)
      {
        id: "w4s16-misina-portal",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 16.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { variant: "misina_cat" }
      },

      // Pista sobre la lengua rosa de Misina (longitud 26m)
      {
        id: "w4s16-tongue-runway",
        type: "platform",
        position: { x: 0.0, y: 0.4, z: 1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.4, y: 0.5, z: 26.0 },
        properties: { theme: "custom_color", customColor: "#e91e63" }
      },

      // Bordillos de encauce
      { id: "w4s16-curb-l", type: "platform", position: { x: -1.8, y: 0.7, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.25, y: 0.35, z: 26.0 }, properties: { theme: "custom_color", customColor: "#ff80ab" } },
      { id: "w4s16-curb-r", type: "platform", position: { x: 1.8, y: 0.7, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.25, y: 0.35, z: 26.0 }, properties: { theme: "custom_color", customColor: "#ff80ab" } },

      // =======================================================================
      // GRAN RAMPA DE LANZAMIENTO PARA EL SALTO ESPECTACULAR
      // =======================================================================
      {
        id: "w4s16-mega-jump-ramp",
        type: "ramp",
        position: { x: 0.0, y: 1.8, z: -15.5 },
        rotation: { x: 0.38, y: 0, z: 0 }, // Inclinación ascendente hacia -Z
        scale: { x: 4.2, y: 0.6, z: 7.5 },
        properties: { theme: "custom_color", customColor: "#ff4081" }
      },

      // Gran abismo vacío de 15 metros entre Z = -19 y Z = -34 sobre los tejados

      // Plataforma flotante de aterrizaje de meta al otro lado del abismo
      {
        id: "w4s16-landing-island",
        type: "platform",
        position: { x: 0.0, y: 2.2, z: -37.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.5, y: 0.8, z: 8.5 },
        properties: { platformShape: "cylinder", theme: "custom_color", customColor: "#ffd54f" }
      },

      // Muro de contención trasero en la plataforma de aterrizaje para recibir el salto
      { id: "w4s16-catcher-wall", type: "bumper", position: { x: 0.0, y: 3.2, z: -40.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.0, y: 1.6, z: 0.6 }, properties: { theme: "custom_color", customColor: "#ffb300" } },

      // 10 Coleccionables
      { id: "w4s16-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s16-col-2", type: "collectible", position: { x: 0.0, y: 0.9, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s16-col-3", type: "collectible", position: { x: -0.8, y: 0.9, z: 9.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s16-col-4", type: "collectible", position: { x: 0.8, y: 0.9, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s16-col-5", type: "collectible", position: { x: 0.0, y: 0.9, z: -1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s16-col-6", type: "collectible", position: { x: 0.0, y: 0.9, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s16-col-7", type: "collectible", position: { x: 0.0, y: 1.5, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Coleccionables aéreos flotando en el arco del mega salto
      { id: "w4s16-col-8", type: "collectible", position: { x: 0.0, y: 4.2, z: -23.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.45, y: 0.45, z: 0.45 } },
      { id: "w4s16-col-9", type: "collectible", position: { x: 0.0, y: 4.6, z: -29.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.45, y: 0.45, z: 0.45 } },
      { id: "w4s16-col-10", type: "collectible", position: { x: 0.0, y: 3.0, z: -35.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta en la isla de aterrizaje
      {
        id: "w4s16-goal",
        type: "goal",
        position: { x: 0.0, y: 3.0, z: -37.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 7: vidas tiene el gato
  // Edificio residencial madrileño de 4 terrazas escalonadas.
  // Empiezas en la terraza superior (4ª) y debes dejarte caer con precisión
  // de terraza en terraza (4 -> 3 -> 2 -> 1) esquivando la caída al vacío.
  // ---------------------------------------------------------------------------
  7: {
    id: "world-04-level-01-stage-07",
    world: 4,
    level: 1,
    stage: 7,
    name: "vidas tiene el gato",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 19.5, z: 18.0 },
    objects: [
      // =======================================================================
      // TERRAZA 4 (Azotea superior, Y = 18.0m)
      // =======================================================================
      {
        id: "w4s17-terrace-4",
        type: "platform",
        position: { x: 0.0, y: 18.0, z: 18.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.5, y: 0.8, z: 7.5 },
        properties: { theme: "carabanchel" }
      },
      // Antepechos de protección en terraza 4 (con apertura frontal para el salto)
      { id: "w4s17-t4-wall-back", type: "platform", position: { x: 0.0, y: 18.7, z: 21.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 7.5, y: 0.8, z: 0.4 }, properties: { theme: "custom_color", customColor: "#9c3d28" } },
      { id: "w4s17-t4-wall-l", type: "platform", position: { x: -3.55, y: 18.7, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.8, z: 7.5 }, properties: { theme: "custom_color", customColor: "#9c3d28" } },
      { id: "w4s17-t4-wall-r", type: "platform", position: { x: 3.55, y: 18.7, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.8, z: 7.5 }, properties: { theme: "custom_color", customColor: "#9c3d28" } },

      // =======================================================================
      // TERRAZA 3 (3ª planta, Y = 12.0m, caída de 6m hacia Z = 8.0m)
      // =======================================================================
      {
        id: "w4s17-terrace-3",
        type: "platform",
        position: { x: 0.0, y: 12.0, z: 8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.5, y: 0.8, z: 8.5 },
        properties: { theme: "carabanchel" }
      },
      { id: "w4s17-t3-wall-l", type: "platform", position: { x: -4.05, y: 12.7, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.8, z: 8.5 }, properties: { theme: "custom_color", customColor: "#9c3d28" } },
      { id: "w4s17-t3-wall-r", type: "platform", position: { x: 4.05, y: 12.7, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.8, z: 8.5 }, properties: { theme: "custom_color", customColor: "#9c3d28" } },
      { id: "w4s17-t3-furniture", type: "decoration", position: { x: -2.5, y: 12.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "terrace_table_set" } },

      // =======================================================================
      // TERRAZA 2 (2ª planta, Y = 6.0m, caída de 6m hacia Z = -2.0m)
      // =======================================================================
      {
        id: "w4s17-terrace-2",
        type: "platform",
        position: { x: 0.0, y: 6.0, z: -2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.5, y: 0.8, z: 9.5 },
        properties: { theme: "carabanchel" }
      },
      { id: "w4s17-t2-wall-l", type: "platform", position: { x: -4.55, y: 6.7, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.8, z: 9.5 }, properties: { theme: "custom_color", customColor: "#9c3d28" } },
      { id: "w4s17-t2-wall-r", type: "platform", position: { x: 4.55, y: 6.7, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.8, z: 9.5 }, properties: { theme: "custom_color", customColor: "#9c3d28" } },
      { id: "w4s17-t2-bench", type: "decoration", position: { x: 3.0, y: 6.4, z: -0.5 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "bench" } },

      // =======================================================================
      // TERRAZA 1 (Planta baja / Patio de portal, Y = 0.0m, Z = -13.0m con la meta)
      // =======================================================================
      {
        id: "w4s17-terrace-1",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -13.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 11.0, y: 0.8, z: 11.0 },
        properties: { theme: "carabanchel" }
      },
      { id: "w4s17-t1-wall-back", type: "platform", position: { x: 0.0, y: 0.7, z: -18.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 11.0, y: 0.8, z: 0.4 }, properties: { theme: "custom_color", customColor: "#9c3d28" } },
      { id: "w4s17-t1-wall-l", type: "platform", position: { x: -5.3, y: 0.7, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.8, z: 11.0 }, properties: { theme: "custom_color", customColor: "#9c3d28" } },
      { id: "w4s17-t1-wall-r", type: "platform", position: { x: 5.3, y: 0.7, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.8, z: 11.0 }, properties: { theme: "custom_color", customColor: "#9c3d28" } },

      // Farola y buzón en el patio de entrada
      { id: "w4s17-lamp-patio", type: "decoration", position: { x: 4.2, y: 0.4, z: -15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },

      // 10 Coleccionables distribuidos en las 4 terrazas
      { id: "w4s17-col-1", type: "collectible", position: { x: -2.0, y: 18.8, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s17-col-2", type: "collectible", position: { x: 2.0, y: 18.8, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s17-col-3", type: "collectible", position: { x: 0.0, y: 18.8, z: 15.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s17-col-4", type: "collectible", position: { x: -2.2, y: 12.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s17-col-5", type: "collectible", position: { x: 2.2, y: 12.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s17-col-6", type: "collectible", position: { x: 0.0, y: 12.8, z: 5.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s17-col-7", type: "collectible", position: { x: -2.5, y: 6.8, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s17-col-8", type: "collectible", position: { x: 2.5, y: 6.8, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s17-col-9", type: "collectible", position: { x: 0.0, y: 6.8, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s17-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta en la 1ª terraza (planta baja)
      {
        id: "w4s17-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -15.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 8: Litos
  // Plataforma elevada con una puerta central porticada y una pareja de personas
  // (Litos) que se sincronizan con la puerta: cuando se abre la puerta, la cruzan
  // a toda velocidad hacia el jugador y luego regresan lentamente como un muelle.
  // ---------------------------------------------------------------------------
  8: {
    id: "world-04-level-01-stage-08",
    world: 4,
    level: 1,
    stage: 8,
    name: "Litos",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 18.0 },
    objects: [
      // Pista longitudinal elevada de granito
      {
        id: "w4s18-runway",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.2, y: 0.8, z: 42.0 },
        properties: { theme: "carabanchel" }
      },

      // Bordillos de protección
      { id: "w4s18-curb-l", type: "platform", position: { x: -2.5, y: 0.5, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.25, y: 0.4, z: 42.0 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      { id: "w4s18-curb-r", type: "platform", position: { x: 2.5, y: 0.5, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.25, y: 0.4, z: 42.0 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },

      // =======================================================================
      // PUERTA CENTRAL CON PORTAL DE LADRILLO
      // =======================================================================
      {
        id: "w4s18-door-portal",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: {
          variant: "slamming_door",
          movementType: "slamming_door",
          speed: 1.0,
          cycleTime: 3.2,
          phase: 0,
          isMoving: true
        }
      },

      // =======================================================================
      // LITOS: DOS PERSONAS JUNTAS EN MOVIMIENTO TIPO MUELLE
      // Atraviesan la puerta muy rápido y vuelven lentamente
      // =======================================================================
      {
        id: "w4s18-litos-duo",
        type: "moving-platform",
        position: { x: 0.0, y: 0.4, z: -4.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: {
          variant: "litos_duo",
          movementType: "litos_duo",
          axis: "z",
          direction: 1, // Avanzan hacia +Z cruzando la puerta
          distance: 12.0,
          speed: 1.0,
          phase: 0,
          isMoving: true
        }
      },

      // Farolas y bancos urbanos en la salida y en la meta
      { id: "w4s18-lamp-start", type: "decoration", position: { x: -3.2, y: 0.4, z: 16.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s18-lamp-fin", type: "decoration", position: { x: 3.2, y: 0.4, z: -18.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },

      // 10 Coleccionables
      { id: "w4s18-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s18-col-2", type: "collectible", position: { x: -1.2, y: 0.8, z: 11.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s18-col-3", type: "collectible", position: { x: 1.2, y: 0.8, z: 7.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s18-col-4", type: "collectible", position: { x: 0.0, y: 0.8, z: 3.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      // Coleccionables justo tras el umbral de la puerta
      { id: "w4s18-col-5", type: "collectible", position: { x: 0.0, y: 0.8, z: -1.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s18-col-6", type: "collectible", position: { x: -1.2, y: 0.8, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s18-col-7", type: "collectible", position: { x: 1.2, y: 0.8, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s18-col-8", type: "collectible", position: { x: 0.0, y: 0.8, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s18-col-9", type: "collectible", position: { x: -1.2, y: 0.8, z: -17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s18-col-10", type: "collectible", position: { x: 1.2, y: 0.8, z: -17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta al otro lado de la puerta
      {
        id: "w4s18-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -20.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 9: Adri
  // Espectacular escultura monumental de Goku Super Saiyan lanzando un Kamehameha.
  // Empiezas en el origen del ataque entre las manos de Goku y recorres un haz
  // tubular de energía en forma de espiral estirada dando eses (más de 105m de
  // longitud >= 100m) hasta la esfera de impacto final donde se encuentra la meta.
  // ---------------------------------------------------------------------------
  9: {
    id: "world-04-level-01-stage-09",
    world: 4,
    level: 1,
    stage: 9,
    name: "Adri",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 90,
    spawn: { x: 0.0, y: 4.8, z: 20.0 },
    objects: [
      // Plataforma nido de origen junto a las manos de Goku
      {
        id: "w4s19-goku-origin-platform",
        type: "platform",
        position: { x: 0.0, y: 3.5, z: 20.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.5, y: 0.8, z: 5.5 },
        properties: { variant: "kamehameha_charge", platformShape: "cylinder", theme: "custom_color", customColor: "#00e5ff" }
      },

      // Escultura Monumental de Goku Super Saiyan lanzando el Kamehameha hacia adelante
      {
        id: "w4s19-giant-goku",
        type: "decoration",
        position: { x: 0.0, y: 0.8, z: 23.2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.2, y: 2.2, z: 2.2 },
        properties: { subType: "giant_goku_saiyan" }
      },

      // =======================================================================
      // HAZ DE ENERGÍA KAMEHAMEHA CONTINUO Y TUBULAR REDONDO (MÁS DE 122 METROS)
      // Tubo 3D continuo sin cortes con físicas 3D circulares (Rapier Trimesh)
      // siguiendo fielmente el trazado en S hacia la gran detonación final
      // =======================================================================
      {
        id: "w4s19-kame-continuous-beam",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.6, y: 3.6, z: 122.6 },
        properties: {
          variant: "kamehameha_beam",
          continuous: true,
          beamRadius: 1.8,
          theme: "custom_color",
          customColor: "#00e5ff",
          pathPoints: [
            { x: 0.0, y: 3.5, z: 20.0 },
            { x: -1.75, y: 3.2, z: 12.5 },
            { x: -5.5, y: 2.9, z: 3.5 },
            { x: -2.0, y: 2.6, z: -5.5 },
            { x: 2.25, y: 2.4, z: -14.5 },
            { x: 6.2, y: 2.2, z: -23.5 },
            { x: 2.5, y: 2.0, z: -32.5 },
            { x: -2.25, y: 1.8, z: -41.5 },
            { x: -5.8, y: 1.6, z: -50.5 },
            { x: -1.2, y: 1.4, z: -59.5 },
            { x: 3.5, y: 1.2, z: -68.5 },
            { x: 2.2, y: 1.0, z: -77.5 },
            { x: 0.0, y: 0.8, z: -86.0 },
            { x: 0.0, y: 0.6, z: -94.0 }
          ]
        }
      },

      // Gran esfera / disco de detonación del Kamehameha con la meta (Z = -94.0)
      {
        id: "w4s19-kame-burst-sphere",
        type: "platform",
        position: { x: 0.0, y: 0.6, z: -94.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.0, y: 0.8, z: 9.0 },
        properties: { variant: "kamehameha_burst", platformShape: "cylinder", theme: "custom_color", customColor: "#00e5ff" }
      },

      // Anillo de energía exterior en la detonación
      {
        id: "w4s19-kame-burst-outer",
        type: "platform",
        position: { x: 0.0, y: 0.3, z: -94.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 12.0, y: 0.4, z: 12.0 },
        properties: { platformShape: "cylinder", theme: "custom_color", customColor: "#80d8ff" }
      },

      // 10 Coleccionables a lo largo de las eses del Kamehameha
      { id: "w4s19-col-1", type: "collectible", position: { x: 0.0, y: 4.2, z: 17.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s19-col-2", type: "collectible", position: { x: -3.5, y: 3.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s19-col-3", type: "collectible", position: { x: -5.5, y: 3.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s19-col-4", type: "collectible", position: { x: 0.0, y: 3.2, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s19-col-5", type: "collectible", position: { x: 6.2, y: 2.9, z: -21.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s19-col-6", type: "collectible", position: { x: 0.0, y: 2.6, z: -35.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s19-col-7", type: "collectible", position: { x: -5.8, y: 2.3, z: -48.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s19-col-8", type: "collectible", position: { x: 0.0, y: 2.0, z: -62.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s19-col-9", type: "collectible", position: { x: 4.5, y: 1.8, z: -72.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s19-col-10", type: "collectible", position: { x: 0.0, y: 1.4, z: -86.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta en el centro de la detonación
      {
        id: "w4s19-goal",
        type: "goal",
        position: { x: 0.0, y: 1.4, z: -94.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 10: Pinar
  // Recta forestal de Carabanchel (Pinar de San José / Parque de las Cruces)
  // con densos pinos a los lados. Detrás de la salida avanza un muro acelerador
  // que va de menos a más velocidad; si te alcanza, te empuja violentamente hacia
  // la meta del fondo (abierta sin muro de contención).
  // ---------------------------------------------------------------------------
  10: {
    id: "world-04-level-01-stage-10",
    world: 4,
    level: 1,
    stage: 10,
    name: "Pinar",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 28.0 },
    objects: [
      // Recta de asfalto y tierra compacta del pinar (76m longitud, 7.2m ancho)
      {
        id: "w4s110-pinar-avenue",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.2, y: 0.8, z: 76.0 },
        properties: { theme: "carabanchel" }
      },

      // Bordillos laterales de tierra y raíces
      { id: "w4s110-curb-l", type: "platform", position: { x: -3.5, y: 0.5, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.35, y: 0.4, z: 76.0 }, properties: { theme: "custom_color", customColor: "#5d4037" } },
      { id: "w4s110-curb-r", type: "platform", position: { x: 3.5, y: 0.5, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.35, y: 0.4, z: 76.0 }, properties: { theme: "custom_color", customColor: "#5d4037" } },

      // =======================================================================
      // MURO ACELERADOR (AVANZA DE MENOS A MÁS VELOCIDAD EMPUJANDO HACIA LA META)
      // =======================================================================
      {
        id: "w4s110-accelerating-wall",
        type: "moving-platform",
        position: { x: 0.0, y: 2.2, z: 32.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.2, y: 3.6, z: 1.6 },
        properties: {
          theme: "custom_color",
          customColor: "#37474f",
          movementType: "accelerating_wall",
          axis: "z",
          direction: -1, // Empuja hacia -Z (hacia la meta)
          speed: 1.8, // Velocidad inicial v0
          waveAmplitude: 0.45, // Aceleración 'a' en m/s^2 (v(t) = 1.8 + 0.45*t)
          distance: 72.0,
          isMoving: true
        }
      },

      // Pinos madrileños a ambos lados de la avenida
      { id: "w4s110-pine-l1", type: "decoration", position: { x: -4.8, y: 0.4, z: 26.0 }, rotation: { x: 0, y: 0.4, z: 0 }, scale: { x: 1.3, y: 1.4, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      { id: "w4s110-pine-r1", type: "decoration", position: { x: 4.8, y: 0.4, z: 22.0 }, rotation: { x: 0, y: -0.5, z: 0 }, scale: { x: 1.3, y: 1.4, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      { id: "w4s110-pine-l2", type: "decoration", position: { x: -4.8, y: 0.4, z: 12.0 }, rotation: { x: 0, y: 0.2, z: 0 }, scale: { x: 1.4, y: 1.5, z: 1.4 }, properties: { subType: "pine_hurdes" } },
      { id: "w4s110-pine-r2", type: "decoration", position: { x: 4.8, y: 0.4, z: 6.0 }, rotation: { x: 0, y: 0.6, z: 0 }, scale: { x: 1.4, y: 1.5, z: 1.4 }, properties: { subType: "pine_hurdes" } },
      { id: "w4s110-pine-l3", type: "decoration", position: { x: -4.8, y: 0.4, z: -4.0 }, rotation: { x: 0, y: -0.3, z: 0 }, scale: { x: 1.3, y: 1.4, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      { id: "w4s110-pine-r3", type: "decoration", position: { x: 4.8, y: 0.4, z: -12.0 }, rotation: { x: 0, y: 0.4, z: 0 }, scale: { x: 1.4, y: 1.5, z: 1.4 }, properties: { subType: "pine_hurdes" } },
      { id: "w4s110-pine-l4", type: "decoration", position: { x: -4.8, y: 0.4, z: -22.0 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 1.3, y: 1.4, z: 1.3 }, properties: { subType: "pine_hurdes" } },
      { id: "w4s110-pine-r4", type: "decoration", position: { x: 4.8, y: 0.4, z: -30.0 }, rotation: { x: 0, y: -0.2, z: 0 }, scale: { x: 1.4, y: 1.5, z: 1.4 }, properties: { subType: "pine_hurdes" } },

      // 10 Coleccionables
      { id: "w4s110-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s110-col-2", type: "collectible", position: { x: -1.8, y: 0.8, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s110-col-3", type: "collectible", position: { x: 1.8, y: 0.8, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s110-col-4", type: "collectible", position: { x: 0.0, y: 0.8, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s110-col-5", type: "collectible", position: { x: -1.8, y: 0.8, z: -6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s110-col-6", type: "collectible", position: { x: 1.8, y: 0.8, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s110-col-7", type: "collectible", position: { x: 0.0, y: 0.8, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s110-col-8", type: "collectible", position: { x: -1.8, y: 0.8, z: -27.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s110-col-9", type: "collectible", position: { x: 1.8, y: 0.8, z: -34.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s110-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -39.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },

      // Meta al fondo de la avenida (abierta sin muro)
      {
        id: "w4s110-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -42.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  }
};

// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('4_1_')) Object.assign(WORLD_04_LEVEL_01_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(4,1,WORLD_04_LEVEL_01_STAGES);

