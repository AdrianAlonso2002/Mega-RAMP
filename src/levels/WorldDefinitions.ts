import { assetUrl } from "../core/AssetUrl";
import type { WorldDefinition } from "./LevelTypes";

export interface SkyTheme {
  id: string;
  name: string;
  skyColor: string;
  horizonColor: string;
}

export const SKY_THEMES: SkyTheme[] = [
  { id: "countryside", name: "🏘️ Villamanta", skyColor: "#81D4FA", horizonColor: "#C8E6C9" },
  { id: "beach", name: "🏖️ San Juan", skyColor: "#4FC3F7", horizonColor: "#FFF176" },
  { id: "mountain", name: "🌲 Mesegal", skyColor: "#A5D6A7", horizonColor: "#81C784" },
  { id: "city", name: "🏙️ Carabanchel", skyColor: "#FFE082", horizonColor: "#B0BEC5" },
  { id: "emerald", name: "⛰️ Asturias", skyColor: "#80CBC4", horizonColor: "#C8E6C9" },
  { id: "winter", name: "🕰️ Londres", skyColor: "#90CAF9", horizonColor: "#E0E0E0" },
  { id: "cherry_blossom", name: "🌸 Japón", skyColor: "#F48FB1", horizonColor: "#FFF9C4" },
  { id: "aurora", name: "🌌 Noruega", skyColor: "#0D1B2A", horizonColor: "#1DE9B6" }
];

export function getSkyThemeById(id: string): SkyTheme {
  return SKY_THEMES.find(t => t.id === id) ?? SKY_THEMES[0];
}

export const WORLDS: WorldDefinition[] = [
  // ========================================================
  // MUNDO 1: VILLAMANTA (Campo, río, pueblo)
  // Ubicación: Centro-Izquierda
  // ========================================================
  {
    id: 1,
    name: "Villamanta",
    subtitle: "Pueblo madrileño",
    description: "Pueblo tradicional entre verdes campos en Madrid, casa de los abuelos, la histórica Parroquia, el polideportivo y la animada plaza.",
    theme: "countryside",
    primaryColor: "#4CAF50",
    secondaryColor: "#388E3C",
    skyColor: "#81D4FA",
    horizonColor: "#C8E6C9",
    icon: "🏘️",
    image: assetUrl("/assets/maps/world1.jpg"),
    mapX: 32.5,
    mapY: 63.0,
    levels: [
      {
        level: 1,
        name: "Calle Río Tajo",
        subtitle: "Casa de los Abuelos de Pao",
        description: "Una calle de unas cuantas que hay con nombres de ríos, pero esta en concreto es especial al existir la Casa de los Abuelos de Pao",
        image: assetUrl("/assets/maps/world1level1.jpg"),
        mapX: 43.5,
        mapY: 68.0
      },
      {
        level: 2,
        name: "Parroquia Santa Catalina",
        subtitle: "Religión y fuegos articiales",
        description: "La majestuosa iglesia de piedra con su emblemático campanario, arcos rústicos y fuegos artificiales.",
        image: assetUrl("/assets/maps/world1level2.jpg"),
        mapX: 35.5,
        mapY: 56.5
      },
      {
        level: 3,
        name: "Polideportivo Villmanta",
        subtitle: "Restaurado después de la Dana",
        description: "El complejo deportivo municipal con pistas de pádel, fútbol y piscina",
        image: assetUrl("/assets/maps/world1level3.jpg"),
        mapX: 45.0,
        mapY: 59.0
      },
      {
        level: 4,
        name: "Plaza de villamanta",
        subtitle: "Plaza Mayor y ayuntamiento",
        description: "El corazón del pueblo con suelo de piedras, conciertos y banderitas de España.",
        image: assetUrl("/assets/maps/world1level4.jpg"),
        mapX: 39.0,
        mapY: 63.5
      }
    ]
  },

  // ========================================================
  // MUNDO 2: SAN JUAN (Playa, sol, piscina)
  // Ubicación: Centro-Derecha
  // ========================================================
  {
    id: 2,
    name: "San Juan",
    subtitle: "Sol y Playa",
    description: "Costa mediterránea radiante, extensa playa de arena dorada y complejo residencial con piscina y paseo marítimo.",
    theme: "beach",
    primaryColor: "#00BCD4",
    secondaryColor: "#FFB300",
    skyColor: "#4FC3F7",
    horizonColor: "#FFF176",
    icon: "🏖️",
    image: assetUrl("/assets/maps/world2.jpg"),
    mapX: 60.0,
    mapY: 68.0,
    levels: [
      {
        level: 1,
        name: "Apartamento",
        subtitle: "Un noveno",
        description: "Un apartamento en un noveno piso con piscina.",
        image: assetUrl("/assets/maps/world2level1.jpg"),
        mapX: 65.0,
        mapY: 59.0
      },
      {
        level: 2,
        name: "Alicante",
        subtitle: "Puerto y mucho más",
        description: "Paseo por las icónicas avenidas costeras de mosaicos ondulados con vistas al mar y la bahía alicantina.",
        image: assetUrl("/assets/maps/world2level2.jpg"),
        mapX: 53.0,
        mapY: 74.0
      },
      {
        level: 3,
        name: "Playa San Juan",
        subtitle: "Aguas Cristalinas e Hippies",
        description: "Kilómetros de arena fina bañada por olas cristalinas y de noche puestos llamados Hippies.",
        image: assetUrl("/assets/maps/world2level3.jpg"),
        mapX: 66.0,
        mapY: 69.0
      },
      {
        level: 4,
        name: "Fontana",
        subtitle: "Mercado famoso de San Juan",
        description: "El mítico mercado de la playa de San Juan, con sus animados puestos, terrazas al aire libre y tiendas mediterráneas.",
        image: assetUrl("/assets/maps/world2level4.jpg"),
        mapX: 58.0,
        mapY: 78.0
      }
    ]
  },

  // ========================================================
  // MUNDO 3: MESEGAL (Pueblo, montañas verdes, incendio)
  // Ubicación: Extremo Izquierda (a la izquierda de Villamanta)
  // ========================================================
  {
    id: 3,
    name: "Mesegal",
    subtitle: "Pueblo y Montañas de Las Hurdes",
    description: "Auténtico pueblo serrano enclavado en valles verdes y pinares, con casas de pizarra, bancales ancestrales y senderos de montaña.",
    theme: "mountain",
    primaryColor: "#2E7D32",
    secondaryColor: "#E65100",
    skyColor: "#A5D6A7",
    horizonColor: "#81C784",
    icon: "🌲",
    image: assetUrl("/assets/maps/world3.jpg"),
    mapX: 13.0,
    mapY: 57.0,
    levels: [
      {
        level: 1,
        name: "La casina",
        subtitle: "Entre las callejuelas y pequeñina",
        description: "Casita pequeña donde se encuentran animales de todo tipo como Misi",
        image: assetUrl("/assets/maps/world3level1.jpg"),
        mapX: 8.5,
        mapY: 48.0
      },
      {
        level: 2,
        name: "La Era",
        subtitle: "Lugar muy antiguo",
        description: "Antigua era circular de piedra donde se celebra la Carvochá.",
        image: assetUrl("/assets/maps/world3level2.jpg"),
        mapX: 17.5,
        mapY: 49.0
      },
      {
        level: 3,
        name: "Pinofranqueado",
        subtitle: "Piscina Natural y Mirador",
        description: "Paso junto al caudaloso río de aguas bravas y un mirador que domina todo el valle verde.",
        image: assetUrl("/assets/maps/world3level3.jpg"),
        mapX: 26.5,
        mapY: 48.0
      },
      {
        level: 4,
        name: "Chorrito de Ovejuela",
        subtitle: "Cascada Escondida en la naturaleza",
        description: "Espectacular salto de agua entre cañones estrechos sin cobertura.",
        image: assetUrl("/assets/maps/world3level4.jpg"),
        mapX: 20.0,
        mapY: 68.0
      }
    ]
  },

  // ========================================================
  // MUNDO 4: CARABANCHEL (Ciudad, barrio, vehículos)
  // Ubicación: Centro / Avenida urbana
  // ========================================================
  {
    id: 4,
    name: "Carabanchel",
    subtitle: "Barrio de Madrid",
    description: "Castizo y dinámico distrito madrileño, repleto de edificios residenciales de ladrillo, avenidas arboladas con tráfico urbano y grandes parques.",
    theme: "city",
    primaryColor: "#FF9800",
    secondaryColor: "#546E7A",
    skyColor: "#FFE082",
    horizonColor: "#B0BEC5",
    icon: "🏙️",
    image: assetUrl("/assets/maps/world4.jpg"),
    mapX: 51.0,
    mapY: 45.0,
    levels: [
      {
        level: 1,
        name: "Piqueñas",
        subtitle: "Calle transitada",
        description: "Tiendas, pisos y sobre todo un pinar.",
        image: assetUrl("/assets/maps/world4level1.jpg"),
        mapX: 43.5,
        mapY: 43.0
      },
      {
        level: 2,
        name: "San Melitón",
        subtitle: "Calle jitana",
        description: "Jitanos y perros encontraras.",
        image: assetUrl("/assets/maps/world4level2.jpg"),
        mapX: 47.5,
        mapY: 37.0
      },
      {
        level: 3,
        name: "Las Cruces",
        subtitle: "Gran Parque y Lago",
        description: "Gran explanada de naturaleza y un lago icónico en el centro",
        image: assetUrl("/assets/maps/world4level3.jpg"),
        mapX: 54.0,
        mapY: 53.0
      },
      {
        level: 4,
        name: "Islazul",
        subtitle: "Centro Comercial Islazul",
        description: "El icónico centro comercial de Carabanchel lleno de tiendas y muy transitada",
        image: assetUrl("/assets/maps/world4level4.jpg"),
        mapX: 61.0,
        mapY: 41.0
      }
    ]
  },

  // ========================================================
  // MUNDO 5: ASTURIAS (Montañas verdes, precioso, animales)
  // Ubicación: Arriba de Villamanta y Mesegal (Noroeste)
  // ========================================================
  {
    id: 5,
    name: "Asturias",
    subtitle: "Paraíso Natural",
    description: "Majestuoso paisaje verde esmeralda del norte, con altas cumbres calcáreas, vacas pastando en praderas infinitas y ríos cristalinos.",
    theme: "emerald",
    primaryColor: "#00897B",
    secondaryColor: "#43A047",
    skyColor: "#80CBC4",
    horizonColor: "#C8E6C9",
    icon: "⛰️",
    image: assetUrl("/assets/maps/world5.jpg"),
    mapX: 27.0,
    mapY: 27.0,
    levels: [
      {
        level: 1,
        name: "Oviedo",
        subtitle: "Casco Histórico y Catedral",
        description: "Calles señoriales de adoquines pulidos, estatuas de bronce y elegantes plazas rodeadas de sidrerías tradicionales.",
        image: assetUrl("/assets/maps/world5level1.jpg"),
        mapX: 21.0,
        mapY: 31.0
      },
      {
        level: 2,
        name: "Cangas de Onis",
        subtitle: "Puente Romano y Cruz de la Victoria",
        description: "Puente monumental de piedra sobre las aguas cantarinas del Sella con un trazado de curvas de gran peralte.",
        image: assetUrl("/assets/maps/world5level2.jpg"),
        mapX: 30.0,
        mapY: 34.5
      },
      {
        level: 3,
        name: "Descenso del Sella",
        subtitle: "Cañón Fluvial y Rápidos",
        description: "Descenso trepidante siguiendo el curso del río entre rocas mojadas, canoas de colores y corrientes rápidas.",
        image: assetUrl("/assets/maps/world5level3.jpg"),
        mapX: 32.5,
        mapY: 42.0
      },
      {
        level: 4,
        name: "Picos de Covadonga",
        subtitle: "Santuario y Lagos Enol y Ercina",
        description: "Ascensión mítica hacia los lagos glaciares rodeados de vacas asturianas y niebla mágica entre cumbres alpinas.",
        image: assetUrl("/assets/maps/world5level4.jpg"),
        mapX: 26.0,
        mapY: 19.0
      }
    ]
  },

  // ========================================================
  // MUNDO 6: LONDRES (Underground, Big Ben, Navidad)
  // Ubicación: Arriba a la Derecha (Noreste)
  // ========================================================
  {
    id: 6,
    name: "Londres",
    subtitle: "Navidad, Big Ben y Underground",
    description: "Mágica metrópoli británica cubierta de nieve navideña, farolas victorianas encendidas, autobuses rojos y el emblemático Big Ben.",
    theme: "winter",
    primaryColor: "#D32F2F",
    secondaryColor: "#1976D2",
    skyColor: "#90CAF9",
    horizonColor: "#E0E0E0",
    icon: "🕰️",
    image: assetUrl("/assets/maps/world6.jpg"),
    mapX: 80.0,
    mapY: 33.0,
    levels: [
      {
        level: 1,
        name: "Queens Park",
        subtitle: "Undergraund y zonas reconocidas",
        description: "Parque inglés cubierto por un fino manto de nieve con quiosco de música iluminado y ambiente invernal.",
        image: assetUrl("/assets/maps/world6level1.jpg"),
        mapX: 73.0,
        mapY: 41.0
      },
      {
        level: 2,
        name: "Museum",
        subtitle: "Arte e historia de todas las culturas",
        description: "Bibliotecas monumentales, galerías de arte y salas de la Antigüedad. Una visita navideña que termina huyendo de un T-Rex con gorro de Santa Claus.",
        image: assetUrl("/assets/maps/world6level2.jpg"),
        mapX: 68.5,
        mapY: 33.0
      },
      {
        level: 3,
        name: "Oxford",
        subtitle: "Torres Universitarias y Bibliotecas",
        description: "Claustros góticos ancestrales, puentes de piedra sobre el Támesis y pasarelas de madera noble.",
        image: assetUrl("/assets/maps/world6level3.jpg"),
        mapX: 75.0,
        mapY: 23.5
      },
      {
        level: 4,
        name: "Big Ben",
        subtitle: "Londres y todo su encanto",
        description: "Circuito de altura alrededor de la célebre esfera dorada del reloj con las campanadas resonando sobre el Támesis.",
        image: assetUrl("/assets/maps/world6level4.jpg"),
        mapX: 83.5,
        mapY: 22.0
      }
    ]
  },

  // ========================================================
  // MUNDO 7: JAPÓN (Cerezos, templos, anime)
  // Ubicación: Abajo a la Derecha (Sureste)
  // ========================================================
  {
    id: 7,
    name: "Japón",
    subtitle: "Cerezos, Pagodas y Monte Fuji",
    description: "Tierra fascinante de sakura en flor, templos milenarios con techos de tejas bermellón, puertas torii flotantes y el majestuoso Monte Fuji.",
    theme: "cherry_blossom",
    primaryColor: "#E91E63",
    secondaryColor: "#FF4081",
    skyColor: "#F48FB1",
    horizonColor: "#FFF9C4",
    icon: "🌸",
    image: assetUrl("/assets/maps/world7.jpg"),
    mapX: 75.0,
    mapY: 64.0,
    levels: [
      {
        level: 1,
        name: "Kioto",
        subtitle: "Bosque de Bambú y Santuario Fushimi",
        description: "Túneles infinitos de toriis rojos y cañas de bambú gigantes susurrando con el viento al compás de la bola.",
        image: assetUrl("/assets/maps/world7level1.jpg"),
        mapX: 80.0,
        mapY: 72.0
      },
      {
        level: 2,
        name: "Nara",
        subtitle: "Parque de los Ciervos Sagrados",
        description: "Caminos bordeados por linternas de piedra y ciervos mansos entre jardines zen meticulosamente cuidados.",
        image: assetUrl("/assets/maps/world7level2.jpg"),
        mapX: 71.0,
        mapY: 55.0
      },
      {
        level: 3,
        name: "Osaka",
        subtitle: "Castillo Dorado y Dotonbori",
        description: "Murallas ciclópeas del castillo feudal contrastadas con vibrantes letreros de neón y canales festivos.",
        image: assetUrl("/assets/maps/world7level3.jpg"),
        mapX: 83.0,
        mapY: 58.0
      },
      {
        level: 4,
        name: "Tokio",
        subtitle: "Cruce de Shibuya y Torre de Tokio",
        description: "Rascacielos vanguardistas coronados por pistas flotantes de neón con el Monte Fuji recortado en el horizonte.",
        image: assetUrl("/assets/maps/world7level4.jpg"),
        mapX: 90.0,
        mapY: 51.0
      }
    ]
  },

  // ========================================================
  // MUNDO 8: NORUEGA (Montañas nevadas, auroras boreales)
  // Ubicación: Arriba del todo (Norte / Ártico)
  // ========================================================
  {
    id: 8,
    name: "Noruega",
    subtitle: "Picos Nevados, Fiordos y Auroras",
    description: "El reino ártico supremo en el confín septentrional, con colosales montañas nevadas, aguas profundas en los fiordos y mágicas auroras boreales.",
    theme: "aurora",
    primaryColor: "#7C4DFF",
    secondaryColor: "#00E5FF",
    skyColor: "#0D1B2A",
    horizonColor: "#1DE9B6",
    icon: "🌌",
    image: assetUrl("/assets/maps/world8.jpg"),
    mapX: 54.0,
    mapY: 15.0,
    levels: [
      {
        level: 1,
        name: "Picos y Montañas",
        subtitle: "Crestas Heladas y Agujas de Roca",
        description: "Caminos tallados en roca alpina cubierta de nieve polvo con pendientes de aceleración vertiginosa.",
        image: assetUrl("/assets/maps/world8level1.jpg"),
        mapX: 46.5,
        mapY: 12.0
      },
      {
        level: 2,
        name: "Fiordos",
        subtitle: "Aguas Glaciares y Cabañas Rorbu",
        description: "Pasarelas de madera sobre aguas azul zafiro entre paredes verticales de roca que caen al abismo marino.",
        image: assetUrl("/assets/maps/world8level2.jpg"),
        mapX: 52.5,
        mapY: 22.0
      },
      {
        level: 3,
        name: "Oslo",
        subtitle: "Trampolín de Holmenkollen y Ópera",
        description: "La rampa de salto de esquí más famosa del mundo convertida en una pista de lanzamiento aéreo a gran velocidad.",
        image: assetUrl("/assets/maps/world8level3.jpg"),
        mapX: 61.5,
        mapY: 17.0
      },
      {
        level: 4,
        name: "Auroras Boreales",
        subtitle: "Danza Celestial de Luz Esmeralda y Violeta",
        description: "La cima absoluta del juego: un circuito cósmico iluminado únicamente por cortinas ondulantes de Aurora Borealis.",
        image: assetUrl("/assets/maps/world8level4.jpg"),
        mapX: 57.0,
        mapY: 6.5
      }
    ]
  }
];

export function getWorldById(id: number): WorldDefinition {
  return WORLDS.find(w => w.id === id) ?? WORLDS[0];
}

export function getWorldBGMTrack(worldId: number): string {
  switch (worldId) {
    case 1:
      return "jungle_groove"; // Villamanta
    case 2:
      return "sky_waltz";     // San Juan (Playa)
    case 3:
      return "jungle_groove"; // Mesegal (Monte)
    case 4:
      return "arcade_rush";   // Carabanchel (Ciudad)
    case 5:
      return "sky_waltz";     // Asturias (Naturaleza)
    case 6:
      return "arcade_rush";   // Londres (Navidad)
    case 7:
      return "cyber_wave";    // Japón (Anime/Cerezos)
    case 8:
      return "cyber_wave";    // Noruega (Auroras Boreales)
    default:
      return "jungle_groove";
  }
}
