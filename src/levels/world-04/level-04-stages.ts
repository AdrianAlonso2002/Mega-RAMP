import publishedEditorStages from '../editor-saved/world-04.json';
import {registerStageSet} from '../StageRegistry';
import type { LevelData } from "../LevelTypes";

// =============================================================================
// MUNDO 4: CARABANCHEL (Madrid) - NIVEL 4: ISLAZUL
// Centro Comercial Islazul y Gran Cúpula.
// 10 Etapas completamente diseñadas, ambientadas e interactivas:
//  E1: 2Bus35 (Calle urbana con alta densidad de edificios y C.C. Islazul monumental detrás de meta)
//  E2: Primark (Laberinto gigante con muros de percheros de ropa y peluches por el suelo)
//  E3: ToyPlanet (5 cajas de figuras Funko Pop móviles: X, Y, círculo vertical tipo reloj, X, Y)
//  E4: Muro4 (4 murallas de ladrillo y granito de Carabanchel con elevadores mecánicos a la azotea)
//  E5: Objetos16 (Galería comercial de Islazul con fuentes, carruseles y 8 coleccionables)
//  E6: Rodilla (3 sándwiches triangulares gigantes en pico >80m largo, >20m ancho y empujadores)
//  E7: TacoBell (Cilindro gigante Quesarito de 68m que gira continuamente sobre su eje y meta en esquina)
//  E8: TGB (4 hamburguesas gigantes de brioche elásticas con físicas de rebote de colchón >50m)
//  E9: YelmoCines (Anfiteatro de butacas de cine en bajada pronunciada y pantalla de cine monumental 16:9)
//  E10: VivaGYM (Cinta de correr gigante de 84m x 22m con arrastre hacia atrás, logo y obstáculos móviles)
// =============================================================================

export const WORLD_04_LEVEL_04_STAGES: Record<number, LevelData> = {
  // ---------------------------------------------------------------------------
  // ETAPA 1: 2Bus35
  // Calle urbana madrileña con mayor densidad de edificios residenciales de ladrillo,
  // farmacia, panadería, bazar, toldos verdes, coches estacionados, marquesina EMT 35,
  // y detrás de la meta la fachada monumental del Centro Comercial Islazul
  // con su visera ETFE, paneles ondulados y gran letrero luminoso.
  // ---------------------------------------------------------------------------
  1: {
    id: "world-04-level-04-stage-01",
    world: 4,
    level: 4,
    stage: 1,
    name: "2Bus35",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 75,
    properties: {
      cameraMode: "cinematic_bus35"
    },
    spawn: { x: 0.0, y: 4.2, z: 34.0 },
    objects: [
      // Calzada de asfalto continuo (92m de longitud)
      {
        id: "w4s41-street-asphalt",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.2, y: 0.6, z: 92.0 },
        properties: { theme: "custom_color", customColor: "#263238" }
      },
      // Línea central de pintura vial
      {
        id: "w4s41-lane-stripe",
        type: "platform",
        position: { x: 0.0, y: 0.32, z: -6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.25, y: 0.05, z: 92.0 },
        properties: { theme: "custom_color", customColor: "#eceff1" }
      },
      // Marcaje vial "C. Piqueñas"
      {
        id: "w4s41-marking-piquenas",
        type: "decoration",
        position: { x: 0.0, y: 0.32, z: 36.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "madrid_street_marking_piquenas" }
      },
      // Aceras de granito izquierda y derecha
      {
        id: "w4s41-sidewalk-l",
        type: "platform",
        position: { x: -4.9, y: 0.2, z: -6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.8, y: 0.8, z: 92.0 },
        properties: { theme: "carabanchel" }
      },
      {
        id: "w4s41-sidewalk-r",
        type: "platform",
        position: { x: 4.9, y: 0.2, z: -6.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 2.8, y: 0.8, z: 92.0 },
        properties: { theme: "carabanchel" }
      },

      // EDIFICIOS RESIDENCIALES Y COMERCIALES (ALTA DENSIDAD MADRILEÑA)
      { id: "w4s41-bldg-r1-farmacia", type: "decoration", position: { x: 8.4, y: 0.6, z: 28.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1.1, y: 1.25, z: 1.1 }, properties: { subType: "madrid_residential_building", shopType: "farmacia", facadeColor: "brick" } },
      { id: "w4s41-bldg-l1-bazar", type: "decoration", position: { x: -8.4, y: 0.6, z: 28.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.1, y: 1.25, z: 1.1 }, properties: { subType: "madrid_residential_building", shopType: "bazar", facadeColor: "light_brick" } },
      { id: "w4s41-bldg-r2-panaderia", type: "decoration", position: { x: 8.4, y: 0.6, z: 12.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1.15, y: 1.3, z: 1.15 }, properties: { subType: "madrid_residential_building", shopType: "panaderia", facadeColor: "brick" } },
      { id: "w4s41-bldg-l2-portal", type: "decoration", position: { x: -8.4, y: 0.6, z: 12.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.15, y: 1.3, z: 1.15 }, properties: { subType: "madrid_residential_building", shopType: "portal", facadeColor: "sandstone" } },
      { id: "w4s41-bldg-r3-res", type: "decoration", position: { x: 8.4, y: 0.6, z: -4.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1.1, y: 1.2, z: 1.1 }, properties: { subType: "madrid_residential_building", shopType: "portal", facadeColor: "brick" } },
      { id: "w4s41-bldg-l3-res", type: "decoration", position: { x: -8.4, y: 0.6, z: -4.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.1, y: 1.2, z: 1.1 }, properties: { subType: "madrid_residential_building", shopType: "portal", facadeColor: "brick" } },
      { id: "w4s41-bldg-r4-res", type: "decoration", position: { x: 8.4, y: 0.6, z: -20.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1.15, y: 1.3, z: 1.15 }, properties: { subType: "madrid_residential_building", shopType: "portal", facadeColor: "light_brick" } },
      { id: "w4s41-bldg-l4-res", type: "decoration", position: { x: -8.4, y: 0.6, z: -20.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1.15, y: 1.3, z: 1.15 }, properties: { subType: "madrid_residential_building", shopType: "portal", facadeColor: "brick" } },

      // Vehículos estacionados
      { id: "w4s41-van-white", type: "decoration", position: { x: -4.6, y: 0.6, z: 22.0 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_parked_car", carType: "van", color: "#f8fafc" } },
      { id: "w4s41-car-grey", type: "decoration", position: { x: 4.6, y: 0.6, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_parked_car", carType: "compact", color: "#374151" } },
      { id: "w4s41-car-slate", type: "decoration", position: { x: 4.6, y: 0.6, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_parked_car", carType: "compact", color: "#1e293b" } },
      { id: "w4s41-van-white2", type: "decoration", position: { x: -4.6, y: 0.6, z: -14.0 }, rotation: { x: 0, y: Math.PI, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_parked_car", carType: "van", color: "#f1f5f9" } },

      // Mobiliario urbano
      { id: "w4s41-recycle-bins", type: "decoration", position: { x: 4.8, y: 0.6, z: 24.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_recycle_bins" } },
      { id: "w4s41-bus-shelter", type: "decoration", position: { x: 5.2, y: 0.6, z: -36.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 }, properties: { subType: "madrid_bus_stop" } },
      { id: "w4s41-lamp-1", type: "decoration", position: { x: -5.4, y: 0.6, z: 20.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s41-lamp-2", type: "decoration", position: { x: 5.4, y: 0.6, z: 0.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s41-lamp-3", type: "decoration", position: { x: -5.4, y: 0.6, z: -20.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_street_lamp_urban" } },
      { id: "w4s41-traffic-light", type: "decoration", position: { x: 5.4, y: 0.6, z: -34.0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "madrid_traffic_light" } },

      // AUTOBÚS AZUL EMT LÍNEA 35 (SCANIA N280UB GNC)
      {
        id: "w4s41-bus-chassis",
        type: "moving-platform",
        position: { x: 0.0, y: 0.45, z: 34.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.4, y: 0.45, z: 8.6 },
        properties: {
          variant: "emt_bus_35",
          movementType: "emt_bus_35",
          theme: "custom_color",
          customColor: "#0055b8",
          axis: "z",
          direction: -1,
          distance: 78.0,
          speed: 3.2,
          startDelay: 2.0,
          isMoving: true
        }
      },

      // META FINAL FRENTE A LA PARADA
      {
        id: "w4s41-goal-dock",
        type: "platform",
        position: { x: 0.0, y: 0.25, z: -42.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.2, y: 0.5, z: 6.0 },
        properties: { theme: "custom_color", customColor: "#ffd54f" }
      },
      {
        id: "w4s41-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -42.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },

      // CENTRO COMERCIAL ISLAZUL MONUMENTAL RECREADO DETRÁS DE LA META
      {
        id: "w4s41-islazul-mall-facade",
        type: "platform",
        position: { x: 0.0, y: 0.2, z: -58.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 44.0, y: 18.0, z: 10.0 },
        properties: { variant: "islazul_mall_facade" }
      },

      // 10 Coleccionables (6 en el autobús, 4 en la calle y llegada)
      { id: "w4s41-col-1", type: "collectible", position: { x: 0.0, y: 1.1, z: 36.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 }, properties: { axis: "z", direction: -1, distance: 78.0, speed: 3.2, startDelay: 2.0, movementType: "forward" } },
      { id: "w4s41-col-2", type: "collectible", position: { x: 0.0, y: 1.1, z: 35.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 }, properties: { axis: "z", direction: -1, distance: 78.0, speed: 3.2, startDelay: 2.0, movementType: "forward" } },
      { id: "w4s41-col-3", type: "collectible", position: { x: 0.0, y: 1.1, z: 33.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 }, properties: { axis: "z", direction: -1, distance: 78.0, speed: 3.2, startDelay: 2.0, movementType: "forward" } },
      { id: "w4s41-col-4", type: "collectible", position: { x: 0.0, y: 1.1, z: 32.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 }, properties: { axis: "z", direction: -1, distance: 78.0, speed: 3.2, startDelay: 2.0, movementType: "forward" } },
      { id: "w4s41-col-5", type: "collectible", position: { x: -0.6, y: 1.1, z: 31.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 }, properties: { axis: "z", direction: -1, distance: 78.0, speed: 3.2, startDelay: 2.0, movementType: "forward" } },
      { id: "w4s41-col-6", type: "collectible", position: { x: 0.6, y: 1.1, z: 31.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 }, properties: { axis: "z", direction: -1, distance: 78.0, speed: 3.2, startDelay: 2.0, movementType: "forward" } },
      { id: "w4s41-col-7", type: "collectible", position: { x: -4.8, y: 0.8, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s41-col-8", type: "collectible", position: { x: 4.8, y: 0.8, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s41-col-9", type: "collectible", position: { x: 0.0, y: 0.8, z: -35.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s41-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -40.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 2: Primark
  // Gran laberinto comercial (68m x 54m) donde todos los muros son percheros
  // dobles repletos de prendas de ropa colgadas de colores y bases con jerséis.
  // El suelo está lleno de peluches blandos caídos (desorden de tienda).
  // ---------------------------------------------------------------------------
  2: {
    id: "world-04-level-04-stage-02",
    world: 4,
    level: 4,
    stage: 2,
    name: "Primark",
    theme: "city",
    musicTrack: "city_groove",
    timeLimit: 75,
    spawn: { x: 0.0, y: 1.5, z: 27.0 },
    objects: [
      // Suelo pulido de la macrotienda Primark (54m de ancho x 68m de largo)
      {
        id: "w4s42-floor",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 54.0, y: 0.8, z: 68.0 },
        properties: { theme: "custom_color", customColor: "#f1f5f9" }
      },

      // Pórtico monumental de entrada Primark con logotipo
      {
        id: "w4s42-entrance-portal",
        type: "platform",
        position: { x: 0.0, y: 0.4, z: 27.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 16.0, y: 7.0, z: 1.6 },
        properties: { variant: "primark_portal" }
      },

      // MUROS PERIMETRALES DE PERCHEROS PRIMARK
      { id: "w4s42-wall-n", type: "platform", position: { x: 0.0, y: 0.4, z: -33.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 53.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },
      { id: "w4s42-wall-s-l", type: "platform", position: { x: -18.0, y: 0.4, z: 33.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 17.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },
      { id: "w4s42-wall-s-r", type: "platform", position: { x: 18.0, y: 0.4, z: 33.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 17.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },
      { id: "w4s42-wall-w", type: "platform", position: { x: -26.5, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 3.4, z: 67.0 }, properties: { variant: "primark_clothes_wall" } },
      { id: "w4s42-wall-e", type: "platform", position: { x: 26.5, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.8, y: 3.4, z: 67.0 }, properties: { variant: "primark_clothes_wall" } },

      // PASILLOS INTERIORES DE PERCHEROS PRIMARK
      // Fila 1 (Z = 20.0)
      { id: "w4s42-rack-1a", type: "platform", position: { x: -14.0, y: 0.4, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 18.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },
      { id: "w4s42-rack-1b", type: "platform", position: { x: 12.0, y: 0.4, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 16.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },

      // Fila 2 (Z = 10.0)
      { id: "w4s42-rack-2a", type: "platform", position: { x: -6.0, y: 0.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 22.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },
      { id: "w4s42-rack-2b", type: "platform", position: { x: 18.0, y: 0.4, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 12.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },

      // Fila 3 (Z = 0.0)
      { id: "w4s42-rack-3a", type: "platform", position: { x: -16.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },
      { id: "w4s42-rack-3b", type: "platform", position: { x: 6.0, y: 0.4, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },

      // Fila 4 (Z = -10.0)
      { id: "w4s42-rack-4a", type: "platform", position: { x: -10.0, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },
      { id: "w4s42-rack-4b", type: "platform", position: { x: 14.0, y: 0.4, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },

      // Fila 5 (Z = -20.0)
      { id: "w4s42-rack-5a", type: "platform", position: { x: -16.0, y: 0.4, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },
      { id: "w4s42-rack-5b", type: "platform", position: { x: 8.0, y: 0.4, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 24.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },

      // Tabiques transversales del laberinto
      { id: "w4s42-rack-t1", type: "platform", position: { x: -18.0, y: 0.4, z: 15.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 10.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },
      { id: "w4s42-rack-t2", type: "platform", position: { x: 8.0, y: 0.4, z: 5.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 10.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },
      { id: "w4s42-rack-t3", type: "platform", position: { x: -4.0, y: 0.4, z: -5.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 10.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },
      { id: "w4s42-rack-t4", type: "platform", position: { x: 18.0, y: 0.4, z: -15.0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 10.0, y: 3.4, z: 0.8 }, properties: { variant: "primark_clothes_wall" } },

      // PELUCHES POR EL SUELO (DESORDEN PRIMARK)
      { id: "w4s42-plush-1", type: "decoration", position: { x: -2.0, y: 0.4, z: 24.0 }, rotation: { x: 0, y: 0.5, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "primark_plush_toy", color: "#f48fb1", animalType: "bear" } },
      { id: "w4s42-plush-2", type: "decoration", position: { x: 3.5, y: 0.4, z: 23.5 }, rotation: { x: 0, y: -0.8, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "primark_plush_toy", color: "#80deea", animalType: "rabbit" } },
      { id: "w4s42-plush-3", type: "decoration", position: { x: -10.0, y: 0.4, z: 15.0 }, rotation: { x: 0, y: 1.2, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "primark_plush_toy", color: "#ffe082", animalType: "bear" } },
      { id: "w4s42-plush-4", type: "decoration", position: { x: 16.0, y: 0.4, z: 14.0 }, rotation: { x: 0, y: -0.3, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "primark_plush_toy", color: "#c8e6c9", animalType: "bear" } },
      { id: "w4s42-plush-5", type: "decoration", position: { x: -18.0, y: 0.4, z: 6.0 }, rotation: { x: 0, y: 2.1, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "primark_plush_toy", color: "#e1bee7", animalType: "rabbit" } },
      { id: "w4s42-plush-6", type: "decoration", position: { x: 0.0, y: 0.4, z: 4.0 }, rotation: { x: 0, y: -1.4, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "primark_plush_toy", color: "#ffccbc", animalType: "bear" } },
      { id: "w4s42-plush-7", type: "decoration", position: { x: 14.0, y: 0.4, z: -2.0 }, rotation: { x: 0, y: 0.7, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "primark_plush_toy", color: "#b3e5fc", animalType: "rabbit" } },
      { id: "w4s42-plush-8", type: "decoration", position: { x: -8.0, y: 0.4, z: -6.0 }, rotation: { x: 0, y: -0.9, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "primark_plush_toy", color: "#f8bbd0", animalType: "bear" } },
      { id: "w4s42-plush-9", type: "decoration", position: { x: 10.0, y: 0.4, z: -14.0 }, rotation: { x: 0, y: 1.5, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "primark_plush_toy", color: "#fff9c4", animalType: "bear" } },
      { id: "w4s42-plush-10", type: "decoration", position: { x: -20.0, y: 0.4, z: -16.0 }, rotation: { x: 0, y: -2.0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "primark_plush_toy", color: "#d1c4e9", animalType: "rabbit" } },

      // Cajas registradoras Primark de salida
      { id: "w4s42-checkout-l", type: "platform", position: { x: -7.5, y: 0.4, z: -27.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.0, y: 1.1, z: 1.8 }, properties: { theme: "custom_color", customColor: "#00a8e8" } },
      { id: "w4s42-checkout-r", type: "platform", position: { x: 7.5, y: 0.4, z: -27.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 8.0, y: 1.1, z: 1.8 }, properties: { theme: "custom_color", customColor: "#00a8e8" } },

      // Meta en la salida de la tienda Primark
      {
        id: "w4s42-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -29.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },

      // 10 Coleccionables
      { id: "w4s42-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 23.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s42-col-2", type: "collectible", position: { x: -14.0, y: 0.8, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s42-col-3", type: "collectible", position: { x: 20.0, y: 0.8, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s42-col-4", type: "collectible", position: { x: -22.0, y: 0.8, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s42-col-5", type: "collectible", position: { x: 0.0, y: 0.8, z: 5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s42-col-6", type: "collectible", position: { x: 22.0, y: 0.8, z: -5.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s42-col-7", type: "collectible", position: { x: -10.0, y: 0.8, z: -15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s42-col-8", type: "collectible", position: { x: 6.0, y: 0.8, z: -15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s42-col-9", type: "collectible", position: { x: -2.0, y: 0.8, z: -25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s42-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -28.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 3: ToyPlanet
  // 5 Cajas gigantes de figuras Funko Pop móviles:
  //  Caja 1: izquierda a derecha (eje X)
  //  Caja 2: arriba a abajo (eje Y)
  //  Caja 3: verticalmente en círculos como las agujas de un reloj (vertical_circle)
  //  Caja 4: izquierda a derecha (eje X)
  //  Caja 5: arriba a abajo (eje Y)
  // La meta está colocada arriba en el pedestal cumbre donde llega la 5ª caja.
  // ---------------------------------------------------------------------------
  3: {
    id: "world-04-level-04-stage-03",
    world: 4,
    level: 4,
    stage: 3,
    name: "ToyPlanet",
    theme: "city",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 32.0 },
    objects: [
      // Plataforma muelle de salida
      {
        id: "w4s43-start-dock",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 30.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.0, y: 0.8, z: 8.0 },
        properties: { theme: "custom_color", customColor: "#0288d1" }
      },

      // CAJA 1: Desplazamiento de Izquierda a Derecha (eje X)
      {
        id: "w4s43-funko-1",
        type: "moving-platform",
        position: { x: 0.0, y: 1.8, z: 20.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.4, y: 5.2, z: 3.8 },
        properties: {
          variant: "funko_pop_box",
          series: "dragon_ball",
          movementType: "sine",
          axis: "x",
          distance: 10.0,
          speed: 2.0
        }
      },

      // CAJA 2: Desplazamiento de Arriba a Abajo (eje Y)
      {
        id: "w4s43-funko-2",
        type: "moving-platform",
        position: { x: 0.0, y: 4.8, z: 10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.4, y: 5.2, z: 3.8 },
        properties: {
          variant: "funko_pop_box",
          series: "harry_potter",
          movementType: "sine",
          axis: "y",
          distance: 6.0,
          speed: 1.8,
          phase: Math.PI / 2
        }
      },

      // CAJA 3: Como un reloj verticalmente en círculos (vertical_circle)
      {
        id: "w4s43-funko-3",
        type: "moving-platform",
        position: { x: 0.0, y: 8.5, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.4, y: 5.2, z: 3.8 },
        properties: {
          variant: "funko_pop_box",
          series: "disney",
          movementType: "vertical_circle",
          radius: 5.2,
          centerY: 8.5,
          centerZ: 0.0,
          speed: 1.6
        }
      },

      // CAJA 4: Desplazamiento de Izquierda a Derecha (eje X)
      {
        id: "w4s43-funko-4",
        type: "moving-platform",
        position: { x: 0.0, y: 11.5, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.4, y: 5.2, z: 3.8 },
        properties: {
          variant: "funko_pop_box",
          series: "dragon_ball",
          movementType: "sine",
          axis: "x",
          distance: 10.0,
          speed: 2.2,
          direction: -1
        }
      },

      // CAJA 5: Desplazamiento de Arriba a Abajo (eje Y) que eleva hasta la cumbre
      {
        id: "w4s43-funko-5",
        type: "moving-platform",
        position: { x: 0.0, y: 14.5, z: -20.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 4.4, y: 5.2, z: 3.8 },
        properties: {
          variant: "funko_pop_box",
          series: "harry_potter",
          movementType: "sine",
          axis: "y",
          distance: 7.0,
          speed: 1.8
        }
      },

      // PLATAFORMA CUMBRE DE META (A la altura máxima donde llega la 5ª caja)
      {
        id: "w4s43-summit-dock",
        type: "platform",
        position: { x: 0.0, y: 17.5, z: -29.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.0, y: 0.8, z: 8.0 },
        properties: { theme: "custom_color", customColor: "#ffd600" }
      },
      {
        id: "w4s43-goal",
        type: "goal",
        position: { x: 0.0, y: 18.3, z: -29.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },

      // 10 Coleccionables
      { id: "w4s43-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 27.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s43-col-2", type: "collectible", position: { x: 0.0, y: 4.8, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s43-col-3", type: "collectible", position: { x: -3.5, y: 4.8, z: 20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s43-col-4", type: "collectible", position: { x: 0.0, y: 8.0, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s43-col-5", type: "collectible", position: { x: 0.0, y: 13.8, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s43-col-6", type: "collectible", position: { x: 0.0, y: 6.0, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s43-col-7", type: "collectible", position: { x: 3.5, y: 14.5, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s43-col-8", type: "collectible", position: { x: 0.0, y: 14.5, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s43-col-9", type: "collectible", position: { x: 0.0, y: 18.0, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s43-col-10", type: "collectible", position: { x: 0.0, y: 18.3, z: -27.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 4: Muro4
  // Como la etapa Muro3 pero mejorada y ambientada en Carabanchel.
  // 4 grandes murallas escalonadas de ladrillo rojo y granito con 4 elevadores
  // verticales suaves que ascienden más de 18m hasta la terraza superior con meta.
  // ---------------------------------------------------------------------------
  4: {
    id: "world-04-level-04-stage-04",
    world: 4,
    level: 4,
    stage: 4,
    name: "Muro4",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 28.0 },
    objects: [
      // Plataforma Nivel 1 (Y = 0.0)
      { id: "w4s44-plat-1", type: "platform", position: { x: 0.0, y: 0.0, z: 24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 0.8, z: 12.0 }, properties: { theme: "carabanchel" } },
      // Muro divisorio móvil 1 (Sube y baja rítmicamente abriendo y cerrando el paso)
      {
        id: "w4s44-wall-1",
        type: "moving-platform",
        position: { x: 0.0, y: 0.5, z: 17.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 14.0, y: 5.0, z: 0.8 },
        properties: {
          movementType: "sine",
          axis: "y",
          distance: 3.0,
          speed: 1.2,
          phase: 0,
          isMoving: true,
          theme: "custom_color",
          customColor: "#b71c1c"
        }
      },
      // Elevador 1 (Sube de Y = 0 a Y = 4.5)
      {
        id: "w4s44-lift-1",
        type: "moving-platform",
        position: { x: 0.0, y: 2.25, z: 14.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.5, z: 5.0 },
        properties: {
          movementType: "sine",
          axis: "y",
          distance: 2.25,
          speed: 1.4,
          slopeY: 1.0,
          isMoving: true,
          theme: "custom_color",
          customColor: "#cfd8dc"
        }
      },

      // Plataforma Nivel 2 (Y = 4.5)
      { id: "w4s44-plat-2", type: "platform", position: { x: 0.0, y: 4.5, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 0.8, z: 12.0 }, properties: { theme: "carabanchel" } },
      // Muro divisorio móvil 2 (Sube y baja)
      {
        id: "w4s44-wall-2",
        type: "moving-platform",
        position: { x: 0.0, y: 5.0, z: -0.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 14.0, y: 5.0, z: 0.8 },
        properties: {
          movementType: "sine",
          axis: "y",
          distance: 3.0,
          speed: 1.3,
          phase: Math.PI / 2,
          isMoving: true,
          theme: "custom_color",
          customColor: "#455a64"
        }
      },
      // Elevador 2 (Sube de Y = 4.5 a Y = 9.0)
      {
        id: "w4s44-lift-2",
        type: "moving-platform",
        position: { x: 0.0, y: 6.75, z: -4.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.5, z: 5.0 },
        properties: {
          movementType: "sine",
          axis: "y",
          distance: 2.25,
          speed: 1.5,
          slopeY: 1.0,
          direction: -1,
          isMoving: true,
          theme: "custom_color",
          customColor: "#cfd8dc"
        }
      },

      // Plataforma Nivel 3 (Y = 9.0)
      { id: "w4s44-plat-3", type: "platform", position: { x: 0.0, y: 9.0, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 0.8, z: 12.0 }, properties: { theme: "carabanchel" } },
      // Muro divisorio móvil 3 (Sube y baja)
      {
        id: "w4s44-wall-3",
        type: "moving-platform",
        position: { x: 0.0, y: 9.5, z: -18.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 14.0, y: 5.0, z: 0.8 },
        properties: {
          movementType: "sine",
          axis: "y",
          distance: 3.0,
          speed: 1.4,
          phase: Math.PI,
          isMoving: true,
          theme: "custom_color",
          customColor: "#b71c1c"
        }
      },
      // Elevador 3 (Sube de Y = 9.0 a Y = 13.5)
      {
        id: "w4s44-lift-3",
        type: "moving-platform",
        position: { x: 0.0, y: 11.25, z: -22.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.5, z: 5.0 },
        properties: {
          movementType: "sine",
          axis: "y",
          distance: 2.25,
          speed: 1.6,
          slopeY: 1.0,
          isMoving: true,
          theme: "custom_color",
          customColor: "#cfd8dc"
        }
      },

      // Plataforma Nivel 4 (Y = 13.5)
      { id: "w4s44-plat-4", type: "platform", position: { x: 0.0, y: 13.5, z: -30.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 0.8, z: 12.0 }, properties: { theme: "carabanchel" } },
      // Muro divisorio móvil 4 (Sube y baja antes del elevador final a la cumbre)
      {
        id: "w4s44-wall-4",
        type: "moving-platform",
        position: { x: 0.0, y: 14.0, z: -36.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 14.0, y: 5.0, z: 0.8 },
        properties: {
          movementType: "sine",
          axis: "y",
          distance: 3.0,
          speed: 1.5,
          phase: Math.PI * 1.5,
          isMoving: true,
          theme: "custom_color",
          customColor: "#455a64"
        }
      },
      // Elevador 4 hacia la gran terraza cumbre (Sube de Y = 13.5 a Y = 18.0)
      {
        id: "w4s44-lift-4",
        type: "moving-platform",
        position: { x: 0.0, y: 15.75, z: -40.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 6.0, y: 0.5, z: 5.0 },
        properties: {
          movementType: "sine",
          axis: "y",
          distance: 2.25,
          speed: 1.7,
          slopeY: 1.0,
          direction: -1,
          isMoving: true,
          theme: "custom_color",
          customColor: "#ffd54f"
        }
      },

      // Gran Terraza Superior con Vista Panorámica y Meta (Y = 18.0)
      { id: "w4s44-plat-top", type: "platform", position: { x: 0.0, y: 18.0, z: -48.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 16.0, y: 0.8, z: 12.0 }, properties: { theme: "carabanchel" } },
      {
        id: "w4s44-goal",
        type: "goal",
        position: { x: 0.0, y: 18.8, z: -49.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },

      // 10 Coleccionables
      { id: "w4s44-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s44-col-2", type: "collectible", position: { x: 0.0, y: 2.8, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s44-col-3", type: "collectible", position: { x: 0.0, y: 5.3, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s44-col-4", type: "collectible", position: { x: -4.0, y: 5.3, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s44-col-5", type: "collectible", position: { x: 0.0, y: 7.3, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s44-col-6", type: "collectible", position: { x: 0.0, y: 9.8, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s44-col-7", type: "collectible", position: { x: 4.0, y: 9.8, z: -12.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s44-col-8", type: "collectible", position: { x: 0.0, y: 11.8, z: -22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s44-col-9", type: "collectible", position: { x: 0.0, y: 14.3, z: -30.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s44-col-10", type: "collectible", position: { x: 0.0, y: 18.8, z: -46.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos16
  // Como Objetos 15 pero mejorado: gran plaza comercial de Islazul con suelo
  // de terrazo brillante, fuente decorativa, jardineras con palmeras,
  // carruseles giratorios con expositores y 8 coleccionables selectos.
  // ---------------------------------------------------------------------------
  5: {
    id: "world-04-level-04-stage-05",
    world: 4,
    level: 4,
    stage: 5,
    name: "Objetos16",
    theme: "city",
    musicTrack: "sky_waltz",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 28.0 },
    objects: [
      // Plataforma 1: Atrio de Entrada
      { id: "w4s45-floor-1", type: "platform", position: { x: 0.0, y: 0.0, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 12.0, y: 0.8, z: 16.0 }, properties: { theme: "custom_color", customColor: "#eceff1" } },
      // Plataforma 2: Plaza Central con Fuente
      { id: "w4s45-floor-2", type: "platform", position: { x: 0.0, y: 0.5, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20.0, y: 0.8, z: 20.0 }, properties: { theme: "custom_color", customColor: "#cfd8dc" } },
      // Plataforma 3: Terraza Mezzanine Superior de Meta
      { id: "w4s45-floor-3", type: "platform", position: { x: 0.0, y: 1.2, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 14.0, y: 0.8, z: 16.0 }, properties: { theme: "custom_color", customColor: "#eceff1" } },

      // Rampas de enlace entre niveles
      { id: "w4s45-ramp-12", type: "ramp", position: { x: 0.0, y: 0.25, z: 13.0 }, rotation: { x: -0.15, y: 0, z: 0 }, scale: { x: 8.0, y: 0.8, z: 4.0 }, properties: { theme: "carabanchel" } },
      { id: "w4s45-ramp-23", type: "ramp", position: { x: 0.0, y: 0.85, z: -9.0 }, rotation: { x: -0.18, y: 0, z: 0 }, scale: { x: 8.0, y: 0.8, z: 4.0 }, properties: { theme: "carabanchel" } },

      // Fuente central decorativa de Islazul
      { id: "w4s45-fountain-rim", type: "platform", position: { x: 0.0, y: 0.9, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 6.4, y: 0.8, z: 6.4 }, properties: { shape: "cylinder", theme: "custom_color", customColor: "#00acc1" } },
      { id: "w4s45-fountain-water", type: "water", position: { x: 0.0, y: 1.2, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 5.6, y: 0.4, z: 5.6 }, properties: { theme: "lake_cruces" } },

      // Carruseles giratorios con expositores comerciales
      {
        id: "w4s45-spinner-l",
        type: "rotating-platform",
        position: { x: -6.5, y: 1.1, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.0, y: 0.35, z: 0.8 },
        properties: { isRotating: true, rotationAxis: "y", speed: 2.0, customColor: "#ff007f" }
      },
      {
        id: "w4s45-spinner-r",
        type: "rotating-platform",
        position: { x: 6.5, y: 1.1, z: 2.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 5.0, y: 0.35, z: 0.8 },
        properties: { isRotating: true, rotationAxis: "y", speed: -2.0, customColor: "#00e5ff" }
      },

      // Jardineras con palmeras interiores
      { id: "w4s45-palm-l", type: "decoration", position: { x: -8.0, y: 0.9, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree" } },
      { id: "w4s45-palm-r", type: "decoration", position: { x: 8.0, y: 0.9, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, properties: { subType: "palm_tree" } },

      // Meta en la terraza superior
      {
        id: "w4s45-goal",
        type: "goal",
        position: { x: 0.0, y: 2.0, z: -22.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },

      // Exactamente 8 coleccionables selectos
      { id: "w4s45-col-1", type: "collectible", position: { x: 0.0, y: 0.8, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s45-col-2", type: "collectible", position: { x: -4.0, y: 1.3, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s45-col-3", type: "collectible", position: { x: 4.0, y: 1.3, z: 10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s45-col-4", type: "collectible", position: { x: 0.0, y: 2.2, z: 2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s45-col-5", type: "collectible", position: { x: -7.5, y: 1.4, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s45-col-6", type: "collectible", position: { x: 7.5, y: 1.4, z: -4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s45-col-7", type: "collectible", position: { x: 0.0, y: 2.0, z: -14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s45-col-8", type: "collectible", position: { x: 0.0, y: 2.0, z: -20.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 6: Rodilla
  // 3 sándwiches cortados gigantes en vertical (pirámides /\ /\ /\) de Rodilla.
  // Plataforma inicial donde empieza el personaje, delante 3 sándwiches cortados gigantes
  // (22m de ancho, 90m de longitud de sándwiches, >80m). Por abajo plano y por arriba
  // el corte superior en arista. El personaje sube y baja cada sándwich (3 veces).
  // La bola es diminuta frente a las cimas de 8.5m. A lo largo del camino hay parachoques
  // con rebote elástico para esquivar y 10 coleccionables en crestas y pendientes.
  // ---------------------------------------------------------------------------
  6: {
    id: "world-04-level-04-stage-06",
    world: 4,
    level: 4,
    stage: 6,
    name: "Rodilla",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 85.0 },
    objects: [
      // Plataforma de salida
      {
        id: "w4s46-start-dock",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 83.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 22.0, y: 0.8, z: 10.0 },
        properties: { theme: "custom_color", customColor: "#ffd54f" }
      },

      // SÁNDWICH 1 — centro Z=50, cubre Z=25..75, cima Y=15
      {
        id: "w4s46-sandwich-1",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 50.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 22.0, y: 15.0, z: 50.0 },
        properties: { variant: "rodilla_sandwich" }
      },
      // Bumpers subida S1: dz=+15→y=6.0, dz=+8→y=10.2  (+1.5 radio)
      { id: "w4s46-b1", type: "bumper", position: { x: -6.0, y:  7.5, z: 65.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 2.0, z: 3.0 }, properties: { variant: "rodilla_bumper", bounce: 1.8 } },
      { id: "w4s46-b2", type: "bumper", position: { x:  6.0, y: 11.7, z: 58.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 2.0, z: 3.0 }, properties: { variant: "rodilla_bumper", bounce: 1.8 } },
      // Bumpers bajada S1: dz=-8→y=10.2, dz=-15→y=6.0
      { id: "w4s46-b3", type: "bumper", position: { x:  6.0, y: 11.7, z: 42.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 2.0, z: 3.0 }, properties: { variant: "rodilla_bumper", bounce: 1.8 } },
      { id: "w4s46-b4", type: "bumper", position: { x: -6.0, y:  7.5, z: 35.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 2.0, z: 3.0 }, properties: { variant: "rodilla_bumper", bounce: 1.8 } },

      // SÁNDWICH 2 — centro Z=0, cubre Z=-25..25
      {
        id: "w4s46-sandwich-2",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 22.0, y: 15.0, z: 50.0 },
        properties: { variant: "rodilla_sandwich" }
      },
      { id: "w4s46-b5", type: "bumper", position: { x:  6.0, y:  7.5, z: 15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 2.0, z: 3.0 }, properties: { variant: "rodilla_bumper", bounce: 1.8 } },
      { id: "w4s46-b6", type: "bumper", position: { x: -6.0, y: 11.7, z:  8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 2.0, z: 3.0 }, properties: { variant: "rodilla_bumper", bounce: 1.8 } },
      { id: "w4s46-b7", type: "bumper", position: { x: -6.0, y: 11.7, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 2.0, z: 3.0 }, properties: { variant: "rodilla_bumper", bounce: 1.8 } },
      { id: "w4s46-b8", type: "bumper", position: { x:  6.0, y:  7.5, z: -15.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 2.0, z: 3.0 }, properties: { variant: "rodilla_bumper", bounce: 1.8 } },

      // SÁNDWICH 3 — centro Z=-50, cubre Z=-75..-25
      {
        id: "w4s46-sandwich-3",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -50.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 22.0, y: 15.0, z: 50.0 },
        properties: { variant: "rodilla_sandwich" }
      },
      { id: "w4s46-b9",  type: "bumper", position: { x: -6.0, y:  7.5, z: -35.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 2.0, z: 3.0 }, properties: { variant: "rodilla_bumper", bounce: 1.8 } },
      { id: "w4s46-b10", type: "bumper", position: { x:  6.0, y: 11.7, z: -42.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 2.0, z: 3.0 }, properties: { variant: "rodilla_bumper", bounce: 1.8 } },
      { id: "w4s46-b11", type: "bumper", position: { x:  6.0, y: 11.7, z: -58.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 2.0, z: 3.0 }, properties: { variant: "rodilla_bumper", bounce: 1.8 } },
      { id: "w4s46-b12", type: "bumper", position: { x: -6.0, y:  7.5, z: -65.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 3.0, y: 2.0, z: 3.0 }, properties: { variant: "rodilla_bumper", bounce: 1.8 } },

      // Plataforma de llegada + meta
      {
        id: "w4s46-goal-dock",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -83.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 22.0, y: 0.8, z: 10.0 },
        properties: { theme: "custom_color", customColor: "#ffd54f" }
      },
      { id: "w4s46-goal", type: "goal", position: { x: 0.0, y: 0.8, z: -83.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // 10 coleccionables: inicio, medias laderas (y≈7.5), cimas (y≈16), valles y final
      { id: "w4s46-col-1",  type: "collectible", position: { x:  0.0, y:  1.2, z:  79.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s46-col-2",  type: "collectible", position: { x:  3.0, y:  7.8, z:  63.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s46-col-3",  type: "collectible", position: { x:  0.0, y: 16.0, z:  50.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s46-col-4",  type: "collectible", position: { x: -3.0, y:  7.8, z:  37.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s46-col-5",  type: "collectible", position: { x:  0.0, y:  7.8, z:  13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s46-col-6",  type: "collectible", position: { x:  0.0, y: 16.0, z:   0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s46-col-7",  type: "collectible", position: { x:  0.0, y:  7.8, z: -13.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s46-col-8",  type: "collectible", position: { x:  3.0, y:  7.8, z: -37.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s46-col-9",  type: "collectible", position: { x:  0.0, y: 16.0, z: -50.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s46-col-10", type: "collectible", position: { x:  0.0, y:  1.2, z: -79.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 7: TacoBell
  // Quesarito gigante (68m de largo >60m, radio 4.6m) que da vueltas sobre
  // su propio eje longitudinal (quesarito_roll).
  // La meta está colocada de forma segura en una plataforma en una esquina al final.
  // ---------------------------------------------------------------------------
  7: {
    id: "world-04-level-04-stage-07",
    world: 4,
    level: 4,
    stage: 7,
    name: "TacoBell",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 5.5, z: 38.0 },
    objects: [
      // Plataforma de salida
      {
        id: "w4s47-start-dock",
        type: "platform",
        position: { x: 0.0, y: 4.0, z: 38.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.8, z: 6.0 },
        properties: { theme: "custom_color", customColor: "#7c3aed" }
      },

      // CILINDRO GIGANTE QUESARITO TACO BELL GIRATORIO (68m de largo, radio 4.6m)
      {
        id: "w4s47-quesarito-cylinder",
        type: "moving-platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.2, y: 9.2, z: 68.0 },
        properties: {
          variant: "quesarito_cylinder",
          movementType: "quesarito_roll",
          radius: 4.6,
          speed: 0.7,
          rollSpeed: 0.7
        }
      },

      // PLATAFORMA DE META EN LA ESQUINA FINAL (X = 5.6m, Z = -37.0m)
      {
        id: "w4s47-corner-goal-dock",
        type: "platform",
        position: { x: 5.6, y: 3.5, z: -37.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 7.0, y: 0.8, z: 7.0 },
        properties: { theme: "custom_color", customColor: "#ffd54f" }
      },
      {
        id: "w4s47-goal",
        type: "goal",
        position: { x: 5.6, y: 4.3, z: -37.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },

      // 10 Coleccionables a lo largo del Quesarito
      { id: "w4s47-col-1", type: "collectible", position: { x: 0.0, y: 5.2, z: 32.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s47-col-2", type: "collectible", position: { x: 0.0, y: 5.2, z: 24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s47-col-3", type: "collectible", position: { x: 0.0, y: 5.2, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s47-col-4", type: "collectible", position: { x: 0.0, y: 5.2, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s47-col-5", type: "collectible", position: { x: 0.0, y: 5.2, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s47-col-6", type: "collectible", position: { x: 0.0, y: 5.2, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s47-col-7", type: "collectible", position: { x: 0.0, y: 5.2, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s47-col-8", type: "collectible", position: { x: 0.0, y: 5.2, z: -24.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s47-col-9", type: "collectible", position: { x: 2.0, y: 5.2, z: -32.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s47-col-10", type: "collectible", position: { x: 5.6, y: 4.3, z: -35.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 8: TGB
  // 4 Hamburguesas gigantes de brioche del TGB (diámetro 12m) que rebotan con
  // elasticidad extrema (bounce: 2.15, físicas de colchón) suspendidas sobre
  // el vacío a lo largo de más de 65m (>50m). Tienes que saltar de una a otra.
  // ---------------------------------------------------------------------------
  8: {
    id: "world-04-level-04-stage-08",
    world: 4,
    level: 4,
    stage: 8,
    name: "TGB",
    theme: "city",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 2.0, z: 38.0 },
    objects: [
      // Muelle de salida
      {
        id: "w4s48-start-dock",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: 38.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.8, z: 6.0 },
        properties: { theme: "custom_color", customColor: "#1e1e1e" }
      },

      // HAMBURGUESA GIGANTE 1 (Z = 22.0)
      {
        id: "w4s48-burger-1",
        type: "bumper",
        position: { x: 0.0, y: 1.0, z: 22.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 12.0, y: 5.2, z: 12.0 },
        properties: { variant: "tgb_burger", bounce: 2.15 }
      },

      // HAMBURGUESA GIGANTE 2 (Z = 6.0, X = -4.0, Elevada a Y = 3.5)
      {
        id: "w4s48-burger-2",
        type: "bumper",
        position: { x: -4.0, y: 3.5, z: 6.0 },
        rotation: { x: 0, y: 0.5, z: 0 },
        scale: { x: 12.0, y: 5.2, z: 12.0 },
        properties: { variant: "tgb_burger", bounce: 2.15 }
      },

      // HAMBURGUESA GIGANTE 3 (Z = -10.0, X = 4.0, Elevada a Y = 6.0)
      {
        id: "w4s48-burger-3",
        type: "bumper",
        position: { x: 4.0, y: 6.0, z: -10.0 },
        rotation: { x: 0, y: -0.5, z: 0 },
        scale: { x: 12.0, y: 5.2, z: 12.0 },
        properties: { variant: "tgb_burger", bounce: 2.15 }
      },

      // HAMBURGUESA GIGANTE 4 (Z = -26.0, X = 0.0, Elevada a Y = 8.5)
      {
        id: "w4s48-burger-4",
        type: "bumper",
        position: { x: 0.0, y: 8.5, z: -26.0 },
        rotation: { x: 0, y: 0.8, z: 0 },
        scale: { x: 12.0, y: 5.2, z: 12.0 },
        properties: { variant: "tgb_burger", bounce: 2.15 }
      },

      // PLATAFORMA FINAL DE META
      {
        id: "w4s48-goal-dock",
        type: "platform",
        position: { x: 0.0, y: 11.0, z: -38.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.0, y: 0.8, z: 8.0 },
        properties: { theme: "custom_color", customColor: "#ffd54f" }
      },
      {
        id: "w4s48-goal",
        type: "goal",
        position: { x: 0.0, y: 11.8, z: -38.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },

      // 10 Coleccionables
      { id: "w4s48-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 32.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s48-col-2", type: "collectible", position: { x: 0.0, y: 7.2, z: 22.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s48-col-3", type: "collectible", position: { x: -2.0, y: 8.0, z: 14.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s48-col-4", type: "collectible", position: { x: -4.0, y: 9.8, z: 6.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s48-col-5", type: "collectible", position: { x: 0.0, y: 11.0, z: -2.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s48-col-6", type: "collectible", position: { x: 4.0, y: 12.2, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s48-col-7", type: "collectible", position: { x: 2.0, y: 13.5, z: -18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s48-col-8", type: "collectible", position: { x: 0.0, y: 14.8, z: -26.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s48-col-9", type: "collectible", position: { x: 0.0, y: 14.0, z: -33.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s48-col-10", type: "collectible", position: { x: 0.0, y: 11.8, z: -36.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 9: YelmoCines
  // Parecido a la etapa Escaleras Republicanas (anfiteatro), pero los escalones
  // son ahora filas de butacas de cine de terciopelo rojo, con bajada mucho más
  // pronunciada hacia la meta, y de fondo una pantalla de cine monumental 16:9.
  // ---------------------------------------------------------------------------
  9: {
    id: "world-04-level-04-stage-09",
    world: 4,
    level: 4,
    stage: 9,
    name: "YelmoCines",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 60,
    spawn: { x: 0.0, y: 17.5, z: 24.0 },
    objects: [
      // Plataforma superior de acceso al anfiteatro de cine
      {
        id: "w4s49-start-tier",
        type: "platform",
        position: { x: 0.0, y: 16.0, z: 24.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 18.0, y: 0.8, z: 6.0 },
        properties: { theme: "custom_color", customColor: "#212121" }
      },

      // 16 FILAS ESCALONADAS DE BUTACAS DE CINE YELMO EN DESCENSO PRONUNCIADO
      { id: "w4s49-seat-01", type: "platform", position: { x: 0.0, y: 15.0, z: 20.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 19.0, y: 2.6, z: 2.2 }, properties: { variant: "cinema_seat_row", seatCount: 7 } },
      { id: "w4s49-seat-02", type: "platform", position: { x: 0.0, y: 14.0, z: 18.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20.0, y: 2.6, z: 2.2 }, properties: { variant: "cinema_seat_row", seatCount: 7 } },
      { id: "w4s49-seat-03", type: "platform", position: { x: 0.0, y: 13.0, z: 15.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 21.0, y: 2.6, z: 2.2 }, properties: { variant: "cinema_seat_row", seatCount: 8 } },
      { id: "w4s49-seat-04", type: "platform", position: { x: 0.0, y: 12.0, z: 12.4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 22.0, y: 2.6, z: 2.2 }, properties: { variant: "cinema_seat_row", seatCount: 8 } },
      { id: "w4s49-seat-05", type: "platform", position: { x: 0.0, y: 11.0, z: 9.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 23.0, y: 2.6, z: 2.2 }, properties: { variant: "cinema_seat_row", seatCount: 8 } },
      { id: "w4s49-seat-06", type: "platform", position: { x: 0.0, y: 10.0, z: 6.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 24.0, y: 2.6, z: 2.2 }, properties: { variant: "cinema_seat_row", seatCount: 9 } },
      { id: "w4s49-seat-07", type: "platform", position: { x: 0.0, y: 9.0, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 25.0, y: 2.6, z: 2.2 }, properties: { variant: "cinema_seat_row", seatCount: 9 } },
      { id: "w4s49-seat-08", type: "platform", position: { x: 0.0, y: 8.0, z: 1.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 26.0, y: 2.6, z: 2.2 }, properties: { variant: "cinema_seat_row", seatCount: 9 } },
      { id: "w4s49-seat-09", type: "platform", position: { x: 0.0, y: 7.0, z: -1.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 27.0, y: 2.6, z: 2.2 }, properties: { variant: "cinema_seat_row", seatCount: 10 } },
      { id: "w4s49-seat-10", type: "platform", position: { x: 0.0, y: 6.0, z: -4.4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 28.0, y: 2.6, z: 2.2 }, properties: { variant: "cinema_seat_row", seatCount: 10 } },
      { id: "w4s49-seat-11", type: "platform", position: { x: 0.0, y: 5.0, z: -7.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 29.0, y: 2.6, z: 2.2 }, properties: { variant: "cinema_seat_row", seatCount: 10 } },
      { id: "w4s49-seat-12", type: "platform", position: { x: 0.0, y: 4.0, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 30.0, y: 2.6, z: 2.2 }, properties: { variant: "cinema_seat_row", seatCount: 11 } },
      { id: "w4s49-seat-13", type: "platform", position: { x: 0.0, y: 3.0, z: -12.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 31.0, y: 2.6, z: 2.2 }, properties: { variant: "cinema_seat_row", seatCount: 11 } },
      { id: "w4s49-seat-14", type: "platform", position: { x: 0.0, y: 2.0, z: -15.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 32.0, y: 2.6, z: 2.2 }, properties: { variant: "cinema_seat_row", seatCount: 11 } },
      { id: "w4s49-seat-15", type: "platform", position: { x: 0.0, y: 1.0, z: -18.4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 33.0, y: 2.6, z: 2.2 }, properties: { variant: "cinema_seat_row", seatCount: 12 } },
      { id: "w4s49-seat-16", type: "platform", position: { x: 0.0, y: 0.2, z: -21.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 34.0, y: 2.6, z: 2.2 }, properties: { variant: "cinema_seat_row", seatCount: 12 } },

      // FOSO ORQUESTA / PLATAFORMA DE META FINAL FRENTE A LA PANTALLA
      {
        id: "w4s49-goal-dock",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -24.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 36.0, y: 0.8, z: 4.5 },
        properties: { theme: "custom_color", customColor: "#ffd54f" }
      },
      {
        id: "w4s49-goal",
        type: "goal",
        position: { x: 0.0, y: 0.8, z: -24.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },

      // PANTALLA DE CINE MONUMENTAL 16:9 EN EL FONDO (YELMO CINES ISLAZUL)
      {
        id: "w4s49-cinema-screen",
        type: "platform",
        position: { x: 0.0, y: 0.0, z: -30.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 36.0, y: 20.0, z: 3.0 },
        properties: { variant: "cinema_screen_monumental" }
      },

      // 10 Coleccionables
      { id: "w4s49-col-1", type: "collectible", position: { x: 0.0, y: 16.5, z: 20.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s49-col-2", type: "collectible", position: { x: -4.0, y: 14.5, z: 15.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s49-col-3", type: "collectible", position: { x: 4.0, y: 12.5, z: 9.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s49-col-4", type: "collectible", position: { x: 0.0, y: 10.5, z: 4.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s49-col-5", type: "collectible", position: { x: -6.0, y: 8.5, z: -1.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s49-col-6", type: "collectible", position: { x: 6.0, y: 7.5, z: -4.4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s49-col-7", type: "collectible", position: { x: 0.0, y: 5.5, z: -10.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s49-col-8", type: "collectible", position: { x: -4.0, y: 3.5, z: -15.6 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s49-col-9", type: "collectible", position: { x: 4.0, y: 2.0, z: -18.4 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s49-col-10", type: "collectible", position: { x: 0.0, y: 0.8, z: -22.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 10: VivaGYM
  // Macro cinta de correr colosal (84m de largo >70m, 22m de ancho >20m).
  // Durante el recorrido el tapiz rodante te empuja continuamente hacia atrás
  // y tienes que contrarrestarlo corriendo hacia adelante.
  // Plataformas de obstáculos móviles barren de adelante hacia atrás en bucle.
  // Letreros luminosos y logotipo oficial de VivaGYM en la cinta.
  // La meta está colocada al final en la consola de mando de la cinta.
  // ---------------------------------------------------------------------------
  10: {
    id: "world-04-level-04-stage-10",
    world: 4,
    level: 4,
    stage: 10,
    name: "VivaGYM",
    theme: "city",
    musicTrack: "arcade_rush",
    timeLimit: 75,
    spawn: { x: 0.0, y: 2.0, z: 40.0 },
    objects: [
      // Muelle de salida inicial
      {
        id: "w4s410-start-dock",
        type: "platform",
        position: { x: 0.0, y: 0.4, z: 42.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 22.0, y: 0.8, z: 6.0 },
        properties: { theme: "custom_color", customColor: "#f47b20" }
      },

      // MACRO CINTA DE CORRER VIVAGYM (84m de largo x 22m de ancho)
      // Con físicas de cinta transportadora inversa (vivagym_treadmill)
      {
        id: "w4s410-treadmill-main",
        type: "moving-platform",
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 22.0, y: 4.2, z: 84.0 },
        properties: {
          variant: "vivagym_treadmill",
          movementType: "vivagym_treadmill",
          speed: 1.0,
          pushSpeed: 1.0
        }
      },

      // OBSTÁCULOS MÓVILES QUE AVANZAN DE ADELANTE HACIA ATRÁS EN BUCLE
      // Obstáculo 1: Barrera móvil carril izquierdo
      {
        id: "w4s410-obstacle-loop-1",
        type: "moving-platform",
        position: { x: -6.0, y: 1.2, z: -20.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.9, z: 2.5 },
        properties: {
          movementType: "loop",
          axis: "z",
          direction: 1,
          distance: 55.0,
          speed: 8.5,
          theme: "custom_color",
          customColor: "#f47b20"
        }
      },
      // Obstáculo 2: Barrera móvil carril derecho (desfasada)
      {
        id: "w4s410-obstacle-loop-2",
        type: "moving-platform",
        position: { x: 6.0, y: 1.2, z: -35.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 8.0, y: 0.9, z: 2.5 },
        properties: {
          movementType: "loop",
          axis: "z",
          direction: 1,
          distance: 55.0,
          speed: 9.0,
          theme: "custom_color",
          customColor: "#f47b20"
        }
      },
      // Obstáculo 3: Rodillo central móvil
      {
        id: "w4s410-obstacle-loop-3",
        type: "moving-platform",
        position: { x: 0.0, y: 1.2, z: -10.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 9.0, y: 0.9, z: 2.5 },
        properties: {
          movementType: "loop",
          axis: "z",
          direction: 1,
          distance: 55.0,
          speed: 8.0,
          theme: "custom_color",
          customColor: "#f47b20"
        }
      },

      // PLATAFORMA DE META EN LA CONSOLA DE CABECERA DE LA CINTA
      {
        id: "w4s410-goal-dock",
        type: "platform",
        position: { x: 0.0, y: 0.4, z: -43.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 22.0, y: 0.8, z: 6.0 },
        properties: { theme: "custom_color", customColor: "#f47b20" }
      },
      {
        id: "w4s410-goal",
        type: "goal",
        position: { x: 0.0, y: 1.2, z: -43.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },

      // 10 Coleccionables
      { id: "w4s410-col-1", type: "collectible", position: { x: 0.0, y: 1.5, z: 34.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s410-col-2", type: "collectible", position: { x: -5.0, y: 1.5, z: 25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s410-col-3", type: "collectible", position: { x: 5.0, y: 1.5, z: 16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s410-col-4", type: "collectible", position: { x: 0.0, y: 1.5, z: 8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s410-col-5", type: "collectible", position: { x: -6.0, y: 1.5, z: 0.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s410-col-6", type: "collectible", position: { x: 6.0, y: 1.5, z: -8.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s410-col-7", type: "collectible", position: { x: 0.0, y: 1.5, z: -16.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s410-col-8", type: "collectible", position: { x: -5.0, y: 1.5, z: -25.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s410-col-9", type: "collectible", position: { x: 5.0, y: 1.5, z: -34.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } },
      { id: "w4s410-col-10", type: "collectible", position: { x: 0.0, y: 1.5, z: -41.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.4, y: 0.4, z: 0.4 } }
    ]
  }
};

// Saved editor designs are the published source of truth.
for (const [key, saved] of Object.entries(publishedEditorStages)) {
  if (key.startsWith('4_4_')) Object.assign(WORLD_04_LEVEL_04_STAGES[Number(key.split('_')[2])], structuredClone(saved));
}
registerStageSet(4,4,WORLD_04_LEVEL_04_STAGES);

