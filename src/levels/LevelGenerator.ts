import type { LevelData, LevelObjectData } from "./LevelTypes";
import { getWorldById } from "./WorldDefinitions";
import { getWorld01Level01Stage } from "./world-01/level-01-stages";

/**
 * Authentic Super Monkey Ball DS level generator.
 * Generates geometric challenge courses:
 * - Diamond arenas (Rombos rotados a 45º)
 * - Varied platform sizes (grandes, medianas y peldaños de precisión)
 * - Moving platforms (plataformas móviles deslizantes o elevadores)
 * - Narrow balance beams, S-curves, and bumper arenas
 */
export class LevelGenerator {
  static generateStage(
    worldNum: number,
    levelNum: number,
    stageNum: number
  ): LevelData {
    if (worldNum === 1 && levelNum === 1) {
      return JSON.parse(JSON.stringify(getWorld01Level01Stage(stageNum)));
    }

    const worldDef = getWorldById(worldNum);
    const stageId = `world-${String(worldNum).padStart(2, "0")}-level-${String(
      levelNum
    ).padStart(2, "0")}-stage-${String(stageNum).padStart(2, "0")}`;

    const objects: LevelObjectData[] = [];
    let objectCounter = 1;

    const addObject = (
      type: LevelObjectData["type"],
      x: number,
      y: number,
      z: number,
      sx: number,
      sy: number,
      sz: number,
      rx = 0,
      ry = 0,
      rz = 0,
      props?: Record<string, unknown>
    ) => {
      objects.push({
        id: `obj-${objectCounter++}`,
        type,
        position: { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)), z: Number(z.toFixed(2)) },
        rotation: { x: Number(rx.toFixed(3)), y: Number(ry.toFixed(3)), z: Number(rz.toFixed(3)) },
        scale: { x: Number(sx.toFixed(2)), y: Number(sy.toFixed(2)), z: Number(sz.toFixed(2)) },
        properties: props
      });
    };

    let stageName = `${worldDef.name} - Etapa ${stageNum}`;

    // Archetype selection based on stage number
    switch (stageNum) {
      // ----------------------------------------------------
      // ETAPA 1: EL ROMBO CLÁSICO (The Diamond Arena)
      // ----------------------------------------------------
      case 1: {
        stageName = `${worldDef.name} - El Rombo`;
        // Plataforma inicial
        addObject("platform", 0, 0, 0, 6, 0.8, 6);
        // Puente de entrada (conecta limpiamente sin solapar el rombo)
        addObject("platform", 0, 0, -5.26, 3, 0.8, 4.52);
        // Gran Rombo (Plataforma cuadrada rotada 45 grados en Y)
        addObject("platform", 0, 0, -16, 12, 0.8, 12, 0, Math.PI / 4, 0);

        // Coleccionables en los 4 vértices del Rombo y en el centro
        addObject("collectible", 0, 1.2, -16, 1, 1, 1);
        addObject("collectible", 0, 1.2, -22, 1, 1, 1); // Vértice frontal
        addObject("collectible", 0, 1.2, -10, 1, 1, 1); // Vértice trasero
        addObject("collectible", -6, 1.2, -16, 1, 1, 1); // Vértice izquierdo
        addObject("collectible", 6, 1.2, -16, 1, 1, 1); // Vértice derecho
        // Coleccionables intermedios
        addObject("collectible", -3, 1.2, -19, 1, 1, 1);
        addObject("collectible", 3, 1.2, -19, 1, 1, 1);
        addObject("collectible", -3, 1.2, -13, 1, 1, 1);
        addObject("collectible", 3, 1.2, -13, 1, 1, 1);
        addObject("collectible", 0, 1.2, -5.26, 1, 1, 1);
        addObject("collectible", 0, 1.2, -3.2, 1, 1, 1);

        // Puente de salida (conecta con el vértice sin penetrar el rombo)
        addObject("platform", 0, 0, -26.74, 3, 0.8, 4.52);
        // Meta final
        addObject("platform", 0, 0, -32, 7, 0.8, 6);
        addObject("goal", 0, 0.4, -32, 3.2, 3.4, 0.6);
        break;
      }

      // ----------------------------------------------------
      // ETAPA 2: ISLAS Y PELDAÑOS DE DIFERENTES TAMAÑOS
      // ----------------------------------------------------
      case 2: {
        stageName = `${worldDef.name} - Islas Variadas`;
        // Isla grande inicio
        addObject("platform", 0, 0, 0, 8, 0.8, 8);
        addObject("collectible", -2, 1.2, -1, 1, 1, 1);
        addObject("collectible", 2, 1.2, -1, 1, 1, 1);

        // Peldaño mediano
        addObject("platform", 0, 0, -8, 5.0, 0.8, 5.0);
        addObject("collectible", 0, 1.2, -8, 1, 1, 1);

        // Peldaño de precisión (misma altura y = 0)
        addObject("platform", 3, 0, -14, 4.0, 0.8, 4.0);
        addObject("collectible", 3, 1.2, -14, 1, 1, 1);

        // Isla mediana central (misma altura y = 0)
        addObject("platform", 0, 0, -20, 6.0, 0.8, 6.0);
        addObject("collectible", -1.5, 1.2, -20, 1, 1, 1);
        addObject("collectible", 1.5, 1.2, -20, 1, 1, 1);

        // Otro peldaño lateral (misma altura y = 0)
        addObject("platform", -3, 0, -26, 4.0, 0.8, 4.0);
        addObject("collectible", -3, 1.2, -26, 1, 1, 1);

        // Pasarela conectora
        addObject("platform", 0, 0, -32, 3.0, 0.8, 6.0);
        addObject("collectible", 0, 1.2, -31, 1, 1, 1);
        addObject("collectible", 0, 1.2, -33, 1, 1, 1);

        // Isla de Meta grande
        addObject("platform", 0, 0, -38, 8, 0.8, 6);
        addObject("collectible", -2, 1.2, -38, 1, 1, 1);
        addObject("collectible", 2, 1.2, -38, 1, 1, 1);
        addObject("goal", 0, 0.4, -38, 3.2, 3.4, 0.6);
        break;
      }

      // ----------------------------------------------------
      // ETAPA 3: LA PLATAFORMA MÓVIL (Moving Shuttle)
      // ----------------------------------------------------
      case 3: {
        stageName = `${worldDef.name} - Puente Móvil`;
        // Isla inicio
        addObject("platform", 0, 0, 0, 8, 0.8, 8);
        addObject("collectible", 0, 1.2, -2, 1, 1, 1);
        addObject("collectible", -2, 1.2, 0, 1, 1, 1);
        addObject("collectible", 2, 1.2, 0, 1, 1, 1);

        // Plataforma Móvil que oscila lateralmente en X sobre el abismo
        addObject(
          "moving-platform",
          0,
          0,
          -12,
          5.0,
          0.8,
          6.0,
          0,
          0,
          0,
          { axis: "x", distance: 7.0, speed: 1.8 }
        );
        // Coleccionable sobre la plataforma móvil
        addObject("collectible", 0, 1.2, -12, 1, 1, 1);

        // Isla intermedia
        addObject("platform", 0, 0, -22, 7, 0.8, 6);
        addObject("collectible", -1.5, 1.2, -22, 1, 1, 1);
        addObject("collectible", 1.5, 1.2, -22, 1, 1, 1);

        // Segunda plataforma móvil oscilante
        addObject(
          "moving-platform",
          0,
          0,
          -30,
          5.0,
          0.8,
          5.0,
          0,
          0,
          0,
          { axis: "x", distance: -6.0, speed: 2.2 }
        );
        addObject("collectible", 0, 1.2, -30, 1, 1, 1);

        // Isla final con meta
        addObject("platform", 0, 0, -39, 8, 0.8, 7);
        addObject("collectible", -2, 1.2, -39, 1, 1, 1);
        addObject("collectible", 2, 1.2, -39, 1, 1, 1);
        addObject("goal", 0, 0.4, -39, 3.2, 3.4, 0.6);
        break;
      }

      // ----------------------------------------------------
      // ETAPA 4: EL ANILLO Y PARACHOQUES (Donut Ring)
      // ----------------------------------------------------
      case 4: {
        stageName = `${worldDef.name} - El Anillo`;
        // Entrada
        addObject("platform", 0, 0, 0, 6, 0.8, 6);
        addObject("platform", 0, 0, -6, 2.8, 0.8, 6);

        // Anillo / Perímetro octogonal alrededor de un hueco
        const ringZ = -18;
        addObject("platform", 0, 0, ringZ + 6, 8, 0.8, 2.8); // Norte
        addObject("platform", 0, 0, ringZ - 6, 8, 0.8, 2.8); // Sur
        addObject("platform", -6, 0, ringZ, 2.8, 0.8, 10); // Oeste
        addObject("platform", 6, 0, ringZ, 2.8, 0.8, 10); // Este

        // Parachoques en el centro y esquinas
        addObject("bumper", 0, 0.8, ringZ, 2.0, 1.5, 2.0);
        addObject("bumper", -4, 0.8, ringZ - 4, 1.4, 1.2, 1.4);
        addObject("bumper", 4, 0.8, ringZ + 4, 1.4, 1.2, 1.4);

        // Coleccionables alrededor del anillo
        addObject("collectible", -5, 1.2, ringZ + 4, 1, 1, 1);
        addObject("collectible", 5, 1.2, ringZ + 4, 1, 1, 1);
        addObject("collectible", -5, 1.2, ringZ - 4, 1, 1, 1);
        addObject("collectible", 5, 1.2, ringZ - 4, 1, 1, 1);
        addObject("collectible", -6, 1.2, ringZ, 1, 1, 1);
        addObject("collectible", 6, 1.2, ringZ, 1, 1, 1);
        addObject("collectible", 0, 1.2, -6, 1, 1, 1);

        // Salida
        addObject("platform", 0, 0, -28, 2.8, 0.8, 6);
        addObject("platform", 0, 0, -34, 7, 0.8, 6);
        addObject("collectible", -1.5, 1.2, -34, 1, 1, 1);
        addObject("collectible", 1.5, 1.2, -34, 1, 1, 1);
        addObject("goal", 0, 0.4, -34, 3.2, 3.4, 0.6);
        break;
      }

      // ----------------------------------------------------
      // ETAPA 5: PASARELA CURVA EN S (S-Curve Precision)
      // ----------------------------------------------------
      case 5: {
        stageName = `${worldDef.name} - Curva en S`;
        addObject("platform", 0, 0, 0, 6, 0.8, 6);

        // Tramo 1 recto
        addObject("platform", 0, 0, -6, 2.5, 0.8, 6);
        addObject("collectible", 0, 1.2, -5, 1, 1, 1);
        addObject("collectible", 0, 1.2, -8, 1, 1, 1);

        // Giro a la izquierda
        addObject("platform", -3, 0, -10, 6, 0.8, 2.5);
        addObject("collectible", -4, 1.2, -10, 1, 1, 1);

        // Tramo medio
        addObject("platform", -6, 0, -16, 2.5, 0.8, 10);
        addObject("collectible", -6, 1.2, -14, 1, 1, 1);
        addObject("collectible", -6, 1.2, -18, 1, 1, 1);

        // Giro a la derecha
        addObject("platform", -1, 0, -22, 10, 0.8, 2.5);
        addObject("collectible", -1, 1.2, -22, 1, 1, 1);
        addObject("collectible", 3, 1.2, -22, 1, 1, 1);

        // Tramo recto final
        addObject("platform", 4, 0, -28, 2.5, 0.8, 10);
        addObject("collectible", 4, 1.2, -26, 1, 1, 1);
        addObject("collectible", 4, 1.2, -30, 1, 1, 1);

        // Giro hacia la meta
        addObject("platform", 0, 0, -34, 8, 0.8, 2.5);
        addObject("platform", -2, 0, -39, 7, 0.8, 6);
        addObject("collectible", -2, 1.2, -37, 1, 1, 1);
        addObject("goal", -2, 0.4, -39, 3.2, 3.4, 0.6);
        break;
      }

      // ----------------------------------------------------
      // ETAPA 6: EL ESLALON DE PARACHOQUES (Horizontal Obstacle Course)
      // ----------------------------------------------------
      case 6: {
        stageName = `${worldDef.name} - El Eslalon`;
        addObject("platform", 0, 0, 0, 7, 0.8, 7);
        addObject("collectible", -1.5, 1.2, -1, 1, 1, 1);
        addObject("collectible", 1.5, 1.2, -1, 1, 1, 1);

        // Tramo 1 con bumper eslalon
        addObject("platform", 0, 0, -8, 8, 0.8, 8);
        addObject("bumper", -2, 0.8, -8, 1.6, 1.4, 1.6);
        addObject("collectible", 2, 1.2, -8, 1, 1, 1);

        // Tramo 2 con bumper contrario
        addObject("platform", 0, 0, -17, 7, 0.8, 8);
        addObject("bumper", 2, 0.8, -17, 1.6, 1.4, 1.6);
        addObject("collectible", -2, 1.2, -17, 1, 1, 1);

        // Plataforma móvil horizontal a la misma altura (y = 0)
        addObject(
          "moving-platform",
          0,
          0,
          -25,
          5.0,
          0.8,
          5.0,
          0,
          0,
          0,
          { axis: "x", distance: 4.5, speed: 2.0 }
        );
        addObject("collectible", 0, 1.2, -25, 1, 1, 1);

        // Isla final con meta a la misma altura
        addObject("platform", 0, 0, -34, 7, 0.8, 6);
        addObject("collectible", 0, 1.2, -33, 1, 1, 1);
        addObject("goal", 0, 0.4, -34, 3.2, 3.4, 0.6);
        break;
      }

      // ----------------------------------------------------
      // ETAPA 7: ROMBO DOBLE CON PARACHOQUES
      // ----------------------------------------------------
      case 7: {
        stageName = `${worldDef.name} - Rombo de Rebote`;
        addObject("platform", 0, 0, 0, 6, 0.8, 6);
        addObject("platform", 0, 0, -3.96, 2.5, 0.8, 3.93);

        // Rombo 1
        addObject("platform", 0, 0, -13, 10, 0.8, 10, 0, Math.PI / 4, 0);
        addObject("bumper", 0, 0.8, -13, 1.8, 1.4, 1.8);
        addObject("collectible", -3.5, 1.2, -13, 1, 1, 1);
        addObject("collectible", 3.5, 1.2, -13, 1, 1, 1);
        addObject("collectible", 0, 1.2, -17, 1, 1, 1);

        // Conector estrecho entre rombos
        addObject("platform", 0, 0, -20.64, 2.2, 0.8, 1.15);

        // Rombo 2
        addObject("platform", 0, 0, -29, 11, 0.8, 11, 0, Math.PI / 4, 0);
        addObject("bumper", -2, 0.8, -29, 1.4, 1.2, 1.4);
        addObject("bumper", 2, 0.8, -29, 1.4, 1.2, 1.4);
        addObject("collectible", -4, 1.2, -29, 1, 1, 1);
        addObject("collectible", 4, 1.2, -29, 1, 1, 1);
        addObject("collectible", 0, 1.2, -33, 1, 1, 1);

        // Meta
        addObject("platform", 0, 0, -38, 7, 0.8, 6);
        addObject("collectible", 0, 1.2, -37, 1, 1, 1);
        addObject("goal", 0, 0.4, -38, 3.2, 3.4, 0.6);
        break;
      }

      // ----------------------------------------------------
      // ETAPA 8: BIFURCACIÓN (Fork: Atajo vs Seguro)
      // ----------------------------------------------------
      case 8: {
        stageName = `${worldDef.name} - Doble Ruta`;
        addObject("platform", 0, 0, 0, 7, 0.8, 7);
        addObject("collectible", 0, 1.2, -2, 1, 1, 1);

        // Ruta Izquierda (Pasarela estrecha rápida con muchos ítems)
        addObject("platform", -5, 0, -8, 1.6, 0.8, 10);
        addObject("collectible", -5, 1.2, -6, 1, 1, 1);
        addObject("collectible", -5, 1.2, -10, 1, 1, 1);
        addObject("platform", -5, 0, -18, 1.6, 0.8, 10);
        addObject("collectible", -5, 1.2, -16, 1, 1, 1);
        addObject("collectible", -5, 1.2, -20, 1, 1, 1);

        // Ruta Derecha (Plataformas amplias más seguras)
        addObject("platform", 6, 0, -8, 5, 0.8, 5);
        addObject("collectible", 6, 1.2, -8, 1, 1, 1);
        addObject("platform", 6, 0, -18, 5, 0.8, 5);
        addObject("collectible", 6, 1.2, -18, 1, 1, 1);

        // Confluencia final
        addObject("platform", 0, 0, -26, 14, 0.8, 4);
        addObject("collectible", 0, 1.2, -26, 1, 1, 1);

        addObject("platform", 0, 0, -33, 7, 0.8, 6);
        addObject("goal", 0, 0.4, -33, 3.2, 3.4, 0.6);
        break;
      }

      // ----------------------------------------------------
      // ETAPA 9: DOBLE PLATAFORMA MÓVIL
      // ----------------------------------------------------
      case 9: {
        stageName = `${worldDef.name} - Plataformas Cruzadas`;
        addObject("platform", 0, 0, 0, 7, 0.8, 7);
        addObject("collectible", -1.5, 1.2, 0, 1, 1, 1);
        addObject("collectible", 1.5, 1.2, 0, 1, 1, 1);

        // Plataforma móvil 1
        addObject(
          "moving-platform",
          -3,
          0,
          -10,
          4.5,
          0.8,
          5.0,
          0,
          0,
          0,
          { axis: "x", distance: 4.5, speed: 2.0 }
        );
        addObject("collectible", -3, 1.2, -10, 1, 1, 1);

        // Plataforma central fija pequeña
        addObject("platform", 0, 0, -18, 4.0, 0.8, 4.0);
        addObject("collectible", 0, 1.2, -18, 1, 1, 1);

        // Plataforma móvil 2
        addObject(
          "moving-platform",
          3,
          0,
          -26,
          4.5,
          0.8,
          5.0,
          0,
          0,
          0,
          { axis: "x", distance: -4.5, speed: 2.2 }
        );
        addObject("collectible", 3, 1.2, -26, 1, 1, 1);

        // Isla final
        addObject("platform", 0, 0, -34, 7, 0.8, 6);
        addObject("collectible", -1.5, 1.2, -34, 1, 1, 1);
        addObject("collectible", 1.5, 1.2, -34, 1, 1, 1);
        addObject("goal", 0, 0.4, -34, 3.2, 3.4, 0.6);
        break;
      }

      // ----------------------------------------------------
      // ETAPA 10: EL DESAFÍO CUMBRE (The Master Course)
      // ----------------------------------------------------
      case 10:
      default: {
        stageName = `${worldDef.name} - El Desafío Cumbre`;
        // Plataforma inicial
        addObject("platform", 0, 0, 0, 6, 0.8, 6);
        addObject("collectible", 0, 1.2, -1, 1, 1, 1);

        // Gran Rombo
        addObject("platform", 0, 0, -11, 10, 0.8, 10, 0, Math.PI / 4, 0);
        addObject("collectible", -3.5, 1.2, -11, 1, 1, 1);
        addObject("collectible", 3.5, 1.2, -11, 1, 1, 1);
        addObject("collectible", 0, 1.2, -15, 1, 1, 1);

        // Conector a plataforma móvil
        addObject("platform", 0, 0, -18, 3.0, 0.8, 4);

        // Plataforma móvil oscilante horizontal (y = 0)
        addObject(
          "moving-platform",
          0,
          0,
          -25,
          5.0,
          0.8,
          5.0,
          0,
          0,
          0,
          { axis: "x", distance: 5.5, speed: 2.4 }
        );
        addObject("collectible", 0, 1.2, -25, 1, 1, 1);

        // Pasarela estrecha de precisión (y = 0)
        addObject("platform", 0, 0, -33, 2.8, 0.8, 8);
        addObject("collectible", 0, 1.2, -31, 1, 1, 1);
        addObject("collectible", 0, 1.2, -35, 1, 1, 1);

        // Gran Meta (y = 0)
        addObject("platform", 0, 0, -40, 8, 0.8, 6);
        addObject("collectible", -2, 1.2, -40, 1, 1, 1);
        addObject("collectible", 2, 1.2, -40, 1, 1, 1);
        addObject("goal", 0, 0.4, -40, 3.2, 3.4, 0.6);
        break;
      }
    }

    return {
      id: stageId,
      world: worldNum,
      level: levelNum,
      stage: stageNum,
      name: stageName,
      theme: worldDef.theme,
      timeLimit: 60,
      spawn: { x: 0, y: 2, z: 0 },
      objects
    };
  }
}
