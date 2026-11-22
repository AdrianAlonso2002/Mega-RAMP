# Mega RAMP - Super Monkey Ball DS Web 🐒🔴

Juego de plataformas 3D y bola rodante inspirado en el clásico **Super Monkey Ball DS**, combinando un personaje 2D billboard con física 3D en tiempo real (Three.js + Rapier 3D), audio retro sintetizado (Web Audio API) y un Editor 3D interactivo con generador de niveles para IA.

---

## 🎮 Características del Juego

- **4 Personajes Jugables**:
  - **Rony** (🥖 Pan crujiente): Perro Yorkshire terrier con la lengua fuera.
  - **Adri** (🧶 Bolas de lana): Chico con pelo rizado medio largo y en camiseta de tirantes.
  - **Misi** (🍗 Pavo asado): Gata blanca de ojos azules.
  - **Pao** (🪄 Varita estrella): Chica con flequillo y ropa morada.
- **8 Mundos Temáticos (320 Etapas en Total)**:
  - 8 Mundos × 4 Niveles × 10 Subniveles (Etapas).
  - Niveles auténticos estilo **Super Monkey Ball DS**: arenas en rombo a 45°, islotes flotantes, vigas estrechas, parachoques y **plataformas móviles cinemáticas** en las que la bola se desplaza en tiempo real.
  - Desbloqueo progresivo por superación de etapas y guardado en `LocalStorage`.
  - Temáticas: *Isla Selva, Ruta Volcánica, Ruinas Antiguas, Parque Neón, Glaciar Helado, Valle Dulce, Tormenta Mecánica, Cúspide Maestra*.
- **Personalización Visual y Sonora en Vivo**:
  - Selector de cielo/fondo (8 temas: *Tropical, Sunset, Cosmic, Volcano, Glacier, Candy, Cyber, Emerald*).
  - Selector de música BGM polifónica sintetizada en tiempo real (*Calypso Island, Mega RAMP Rush, Sky Dreams, Neon Grid*).
- **Mecánica de Vidas y Coleccionables**:
  - Comienzas con **5 Vidas**.
  - Cada personaje recoge su objeto distintivo personalizado.
  - **10 objetos = ¡1UP! (+1 Vida extra)**.
  - Caída fuera del circuito (*FALL OUT!*) resta 1 vida. Si llegas a 0 vidas: *Game Over*.
- **Estética Nintendo DS Retro**:
  - Personaje 2D con renderizado billboarding dentro de una esfera de cristal 3D translúcida reflectante.
  - Pistas con texturas cuadriculadas estilo DS y sombreado retro.
  - Efectos de sonido estilo chiptune/16-bit generados proceduralmente sin archivos de audio externos.
  - Opciones de visualización: **Modo Marco Nintendo DS (Doble Pantalla)** y **Filtro CRT Scanlines**.
- **Editor 3D de Niveles & Asistente IA**:
  - Viewport 3D en tiempo real con controles orbitales.
  - Añade, edita, mueve, rota y escala plataformas, rampas, parachoques elásticos, coleccionables y metas (*GOAL*).
  - Botón **"¡Probar Nivel!"** para jugar y testear tu creación al instante con la bola.
  - **Asistente IA**:
    - Generación procedural instantánea por niveles de dificultad.
    - Exportación e importación de JSON.
    - Copiado de System Prompt estructurado para usar en **ChatGPT / Claude / Gemini** y generar niveles personalizados en formato JSON listos para jugar.

---

## 🚀 Instalación y Ejecución

### Publicar en GitHub Pages

En el repositorio, entra en **Settings → Pages → Build and deployment → Source**
y selecciona **GitHub Actions**. El flujo `.github/workflows/pages.yml` compila el
juego y publica únicamente `dist` al subir cambios a `develop`, la rama usada
para esta web. También se puede
ejecutar manualmente desde **Actions → Publicar Mega RAMP → Run workflow**.
No publiques directamente el código fuente: GitHub Pages no compila TypeScript.

La compilación utiliza rutas relativas para que imágenes, música, manifiesto y
archivos del juego funcionen tanto en `/Mega-RAMP/` como en otros alojamientos.

### Requisitos
- Node.js (v18 o superior)
- Navegador web moderno con soporte WebGL (Chrome, Edge, Firefox, Safari)

### Comandos

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción (TypeScript estricto + Vite)
npm run build

# Previsualizar build de producción
npm run preview

# Ejecutar suite de tests unitarios (Vitest)
npm test
```

---

## 🕹️ Controles

- **Teclado (PC)**:
  - `W` / `Flecha Arriba`: Avanzar / Empujar bola adelante
  - `S` / `Flecha Abajo`: Frenar / Retroceder
  - `A` / `Flecha Izquierda`: Girar a la izquierda
  - `D` / `Flecha Derecha`: Girar a la derecha
- **Táctil (Móviles / Tablets)**:
  - **Joystick Virtual Flotante Dinámico**: Toca en cualquier punto de la pantalla y el joystick aparecerá instantáneamente bajo tu dedo, siguiendo suavemente el movimiento con retroalimentación háptica y visual.
- **Física y Conducción**:
  - Aceleración progresiva y controlada (curva cuadrática de suavizado), frenado activo responsivo y velocidad máxima equilibrada para maniobrar en plataformas estrechas.
- **Cámara**:
  - Seguimiento dinámico y suave detrás de la bola con amortiguación y auto-alineación.

---

## 🏗️ Arquitectura Modular

El proyecto está diseñado bajo una estricta separación de responsabilidades:

- `src/rendering/`: Renderizador Three.js optimizado, cámara en tercera persona y generador procedural de sprites y texturas retro.
- `src/physics/`: Motor físico Rapier 3D WebAssembly con cuerpos rígidos dinámicos, detección continua de colisiones (CCD) y colliders estáticos.
- `src/player/`: Lógica del jugador (esfera 3D + sprite 2D billboard + físicas de rodadura dependientes de las estadísticas de cada personaje).
- `src/levels/`: Generador determinista de las 320 etapas, cargador de JSON y constructor de geometrías y triggers.
- `src/editor/`: Editor 3D interactivo con controles de cámara, inspector de propiedades y generador para IA.
- `src/progression/`: Sistema de persistencia y desbloqueo progresivo versionado en LocalStorage.
- `src/audio/`: Sintetizador Web Audio API para efectos de sonido retro sin dependencias externas.
- `src/ui/`: Pantallas de inicio, selección de personajes, selección de mundo/nivel, HUD y menús contextuales.
