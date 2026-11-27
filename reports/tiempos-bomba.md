# Límites de tiempo bomba

Edita `seconds` en `src/levels/StageTimeLimits.json` y vuelve a compilar/subir el proyecto. Es la fuente que lee el juego; no se guarda en el navegador. Las etapas personalizadas pueden usar `properties.bombTimeLimit` (segundos).

Primera calibración estimada para recoger todos los objetos y llegar a la meta: recorrido entre coleccionables, rutas definidas, velocidad efectiva prudente de 4 unidades/s, maniobras y esperas de mecanismos. Mínimo 60 s y ampliaciones de 15 s. No equivale a haber completado manualmente las 320 etapas; ajustar con pruebas reales. La pausa, la introducción y la victoria no consumen la mecha. La cuenta atrás se reinicia cada vez que se pierde una vida; el cronómetro total sigue separado y continúa acumulándose. Al explotar la bomba se cortan los efectos, pero la música continúa sin cambiar de pista. Al agotarse: bloqueo inmediato, expresión de miedo durante 1 s y una vida menos.

## Mundo 1

| Nivel | E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10 |
|---|---|---|---|---|---|---|---|---|---|---|
| M1-N1 | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s |
| M1-N2 | 90 s | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s |
| M1-N3 | 60 s | 60 s | 60 s | 60 s | 75 s | 60 s | 60 s | 60 s | 60 s | 75 s |
| M1-N4 | 60 s | 60 s | 60 s | 60 s | 75 s | 60 s | 60 s | 60 s | 60 s | 60 s |

## Mundo 2

| Nivel | E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10 |
|---|---|---|---|---|---|---|---|---|---|---|
| M2-N1 | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s |
| M2-N2 | 60 s | 60 s | 60 s | 60 s | 75 s | 60 s | 60 s | 60 s | 75 s | 60 s |
| M2-N3 | 60 s | 60 s | 60 s | 60 s | 75 s | 60 s | 60 s | 60 s | 60 s | 60 s |
| M2-N4 | 90 s | 60 s | 75 s | 60 s | 75 s | 60 s | 60 s | 60 s | 60 s | 60 s |

## Mundo 3

| Nivel | E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10 |
|---|---|---|---|---|---|---|---|---|---|---|
| M3-N1 | 60 s | 60 s | 60 s | 60 s | 75 s | 60 s | 75 s | 60 s | 60 s | 60 s |
| M3-N2 | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 75 s |
| M3-N3 | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 75 s | 60 s | 60 s |
| M3-N4 | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 120 s | 60 s | 60 s | 60 s |

## Mundo 4

| Nivel | E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10 |
|---|---|---|---|---|---|---|---|---|---|---|
| M4-N1 | 60 s | 60 s | 60 s | 60 s | 75 s | 60 s | 60 s | 60 s | 75 s | 60 s |
| M4-N2 | 60 s | 60 s | 60 s | 75 s | 60 s | 60 s | 60 s | 60 s | 60 s | 75 s |
| M4-N3 | 60 s | 60 s | 60 s | 60 s | 60 s | 60 s | 105 s | 60 s | 60 s | 60 s |
| M4-N4 | 60 s | 75 s | 60 s | 75 s | 75 s | 105 s | 60 s | 60 s | 60 s | 105 s |

## Mundo 5

| Nivel | E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10 |
|---|---|---|---|---|---|---|---|---|---|---|
| M5-N1 | 60 s | 105 s | 60 s | 60 s | 60 s | 75 s | 60 s | 90 s | 60 s | 75 s |
| M5-N2 | 120 s | 75 s | 60 s | 60 s | 60 s | 60 s | 75 s | 75 s | 60 s | 90 s |
| M5-N3 | 75 s | 60 s | 135 s | 210 s | 105 s | 150 s | 120 s | 285 s | 120 s | 240 s |
| M5-N4 | 135 s | 210 s | 195 s | 75 s | 60 s | 180 s | 120 s | 60 s | 120 s | 150 s |

## Mundo 6

| Nivel | E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10 |
|---|---|---|---|---|---|---|---|---|---|---|
| M6-N1 | 60 s | 105 s | 195 s | 75 s | 75 s | 105 s | 120 s | 60 s | 150 s | 90 s |
| M6-N2 | 75 s | 75 s | 60 s | 105 s | 105 s | 105 s | 60 s | 105 s | 105 s | 210 s |
| M6-N3 | 150 s | 60 s | 210 s | 75 s | 90 s | 75 s | 75 s | 60 s | 120 s | 105 s |
| M6-N4 | 75 s | 75 s | 75 s | 75 s | 75 s | 135 s | 105 s | 165 s | 105 s | 300 s |

## Mundo 7

| Nivel | E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10 |
|---|---|---|---|---|---|---|---|---|---|---|
| M7-N1 | 60 s | 135 s | 120 s | 90 s | 60 s | 90 s | 120 s | 105 s | 105 s | 120 s |
| M7-N2 | 135 s | 75 s | 90 s | 60 s | 60 s | 105 s | 90 s | 135 s | 105 s | 90 s |
| M7-N3 | 135 s | 135 s | 255 s | 75 s | 75 s | 120 s | 120 s | 105 s | 120 s | 90 s |
| M7-N4 | 90 s | 60 s | 75 s | 105 s | 75 s | 105 s | 105 s | 105 s | 165 s | 195 s |

## Mundo 8

| Nivel | E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10 |
|---|---|---|---|---|---|---|---|---|---|---|
| M8-N1 | 60 s | 180 s | 120 s | 105 s | 75 s | 105 s | 120 s | 105 s | 90 s | 165 s |
| M8-N2 | 120 s | 75 s | 105 s | 120 s | 75 s | 90 s | 120 s | 120 s | 105 s | 135 s |
| M8-N3 | 120 s | 135 s | 255 s | 120 s | 75 s | 105 s | 120 s | 135 s | 150 s | 135 s |
| M8-N4 | 60 s | 90 s | 90 s | 105 s | 60 s | 75 s | 150 s | 60 s | 90 s | 135 s |

