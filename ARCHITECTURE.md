# Game Architecture

## Objective

Build a browser-based 3D platform game inspired by the classic
ball-platform gameplay of Super Monkey Ball DS.

The project must work correctly on:

- Desktop browsers
- Mobile browsers
- Tablets
- Touch devices
- Gamepads
- Keyboard

The game is not a native mobile application.

## Core technologies

- TypeScript
- Three.js
- Rapier 3D
- Vite
- HTML
- CSS
- JSON

## Architecture

The project must maintain strict separation between:

- Rendering
- Physics
- Input
- Gameplay
- UI
- Audio
- Level data
- Progression
- Editor

Gameplay code must not directly manipulate DOM elements.

UI code must not directly implement physics.

Level JSON must contain data only.

Levels must never be hardcoded into gameplay classes.

## Rendering

Three.js is responsible for:

- Scene rendering
- Camera
- Meshes
- Sprites
- Materials
- Lighting

Graphics must prioritize performance.

Avoid unnecessary:

- Dynamic shadows
- High polygon models
- Large textures
- Post-processing
- Excessive transparency
- Excessive draw calls

Use sprites where appropriate.

## Physics

Rapier is responsible for:

- Dynamic bodies
- Static colliders
- Collision detection
- Gravity
- Movement physics

Physics must be independent from rendering.

## Player

Characters use 2D sprites inside the 3D environment.

The player physics body must be independent from the visual sprite.

## Levels

Levels are JSON data.

Structure:

World
→ Level
→ Stage

There are:

- 8 worlds
- 4 levels per world
- 10 stages per level

Total:

320 stages.

The game engine must use the same level loader for every stage.

## Characters

There are 4 characters.

Character differences must be data-driven.

Do not duplicate gameplay classes for individual characters.

## Collectibles

Each character can have a different visual collectible.

Internally all life collectibles use the same gameplay interface.

10 collectibles grant 1 additional life.

Default starting lives:

5.

## Responsive rendering

The game must support different aspect ratios.

Do not assume:

1920x1080.

The renderer must adapt to:

- 16:9
- 16:10
- 4:3
- mobile landscape
- tablet landscape

Device pixel ratio must be capped.

Rendering resolution should be dynamically adjustable.

## Mobile

Touch controls must use Pointer Events.

Touch input must not be implemented separately from the gameplay input abstraction.

The game must support:

- virtual joystick
- touch buttons where necessary
- landscape orientation

## Performance

Primary target:

60 FPS.

Secondary target:

30 FPS on low-end devices.

Avoid unnecessary allocations inside the game loop.

Do not create objects every frame.

Reuse:

- vectors
- geometries
- materials
- temporary objects

Use object pooling for frequently spawned objects.

## Data

Game progress is stored locally.

Progression must be versioned.

Storage key:

monkey-ball-progress-v1

Future migrations must be supported.

## Code quality

TypeScript strict mode is mandatory.

Avoid:

- any
- duplicated code
- global mutable state
- hardcoded level logic
- magic numbers
- unnecessary dependencies

Every new system must have a clear responsibility.

## AI development rules

Never rewrite an entire subsystem to solve a local bug.

Before modifying architecture:

1. Identify the existing system.
2. Explain the conflict.
3. Modify the smallest possible surface.
4. Preserve existing public interfaces.
5. Run tests.
6. Verify desktop and mobile behavior.

Never remove existing functionality without explicit justification.

Never create a second system that duplicates an existing responsibility.

Do not add dependencies unless they provide a clear technical benefit.

All new functionality must be modular.

All level content must remain data-driven.

## Production order

1. Architecture
2. Renderer
3. Responsive rendering
4. Input
5. Physics
6. Player
7. Level loader
8. Level builder
9. Editor
10. Collectibles
11. Lives
12. Goal
13. Progression
14. Menus
15. Audio
16. Optimization
17. PWA
18. Testing
19. Content
20. Final polish