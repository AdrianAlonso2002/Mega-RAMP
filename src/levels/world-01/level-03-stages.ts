import {registerStageSet} from '../StageRegistry';
import type { LevelData } from "../LevelTypes";

// =============================================================================
// WORLD 1 - LEVEL 3: POLIDEPORTIVO VILLAMANTA (ETAPAS 1 A 10)
// =============================================================================

export const WORLD_01_LEVEL_03_STAGES: Record<number, LevelData> = {
  // ---------------------------------------------------------------------------
  // ETAPA 1: Arroyo
  // ---------------------------------------------------------------------------
  1: {
    "id": "world-01-level-03-stage-01",
    "world": 1,
    "level": 3,
    "stage": 1,
    "name": "Arroyo",
    "theme": "countryside",
    "musicTrack": "jungle_groove",
    "timeLimit": 60,
    "spawn": {
      "x": 0,
      "y": 17.5,
      "z": 26
    },
    "objects": [
      {
        "id": "s1-plat-start",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 16,
          "z": 26
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 8,
          "y": 0.8,
          "z": 8
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#90a4ae"
        }
      },
      {
        "id": "s1-curb-start-b",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 16.5,
          "z": 29.8
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 8,
          "y": 0.4,
          "z": 0.4
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#607d8b"
        }
      },
      {
        "id": "s1-curb-start-l",
        "type": "platform",
        "position": {
          "x": -3.8,
          "y": 16.5,
          "z": 26
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 0.4,
          "z": 8
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#607d8b"
        }
      },
      {
        "id": "s1-curb-start-r",
        "type": "platform",
        "position": {
          "x": 3.8,
          "y": 16.5,
          "z": 26
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 0.4,
          "z": 8
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#607d8b"
        }
      },
      {
        "id": "s1-water-1",
        "type": "water",
        "position": {
          "x": 0,
          "y": 14.2,
          "z": 19.5
        },
        "rotation": {
          "x": -0.1,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 5.5,
          "y": 0.8,
          "z": 5.5
        }
      },
      {
        "id": "s1-bank-1l",
        "type": "platform",
        "position": {
          "x": -3.1,
          "y": 14.6,
          "z": 19.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.7,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-bank-1r",
        "type": "platform",
        "position": {
          "x": 3.1,
          "y": 14.6,
          "z": 19.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.7,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-water-2",
        "type": "water",
        "position": {
          "x": 0.5,
          "y": 12.4,
          "z": 13.5
        },
        "rotation": {
          "x": -0.1,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 5.5,
          "y": 0.8,
          "z": 5.5
        }
      },
      {
        "id": "s1-bank-2l",
        "type": "platform",
        "position": {
          "x": -2.6,
          "y": 12.8,
          "z": 13.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.7,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-bank-2r",
        "type": "platform",
        "position": {
          "x": 3.6,
          "y": 12.8,
          "z": 13.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.7,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-rock-1",
        "type": "bumper",
        "position": {
          "x": 0.8,
          "y": 13.2,
          "z": 13.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 2,
          "y": 1.2,
          "z": 2
        },
        "properties": {
          "color": "#546e7a",
          "bounce": 0.8
        }
      },
      {
        "id": "s1-water-3",
        "type": "water",
        "position": {
          "x": -0.5,
          "y": 10.6,
          "z": 7.5
        },
        "rotation": {
          "x": -0.1,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 5.5,
          "y": 0.8,
          "z": 5.5
        }
      },
      {
        "id": "s1-bank-3l",
        "type": "platform",
        "position": {
          "x": -3.6,
          "y": 11,
          "z": 7.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.7,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-bank-3r",
        "type": "platform",
        "position": {
          "x": 2.6,
          "y": 11,
          "z": 7.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.7,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-col-1",
        "type": "collectible",
        "position": {
          "x": -1.8,
          "y": 11.8,
          "z": 7.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s1-water-4",
        "type": "water",
        "position": {
          "x": 0,
          "y": 8.8,
          "z": 1.5
        },
        "rotation": {
          "x": -0.1,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 5.5,
          "y": 0.8,
          "z": 5.5
        }
      },
      {
        "id": "s1-bank-4l",
        "type": "platform",
        "position": {
          "x": -3.1,
          "y": 9.2,
          "z": 1.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.7,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-bank-4r",
        "type": "platform",
        "position": {
          "x": 3.1,
          "y": 9.2,
          "z": 1.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.7,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-rock-2",
        "type": "bumper",
        "position": {
          "x": -0.8,
          "y": 9.6,
          "z": 1.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 2,
          "y": 1.2,
          "z": 2
        },
        "properties": {
          "color": "#455a64",
          "bounce": 0.8
        }
      },
      {
        "id": "s1-water-5",
        "type": "water",
        "position": {
          "x": 0.8,
          "y": 7,
          "z": -4.5
        },
        "rotation": {
          "x": -0.1,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 5.5,
          "y": 0.8,
          "z": 5.5
        }
      },
      {
        "id": "s1-bank-5l",
        "type": "platform",
        "position": {
          "x": -2.3,
          "y": 7.4,
          "z": -4.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.7,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-bank-5r",
        "type": "platform",
        "position": {
          "x": 3.9,
          "y": 7.4,
          "z": -4.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.7,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-col-2",
        "type": "collectible",
        "position": {
          "x": 1.8,
          "y": 8.2,
          "z": -4.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s1-water-6",
        "type": "water",
        "position": {
          "x": 0,
          "y": 5.2,
          "z": -10.5
        },
        "rotation": {
          "x": -0.1,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 5.5,
          "y": 0.8,
          "z": 5.5
        }
      },
      {
        "id": "s1-bank-6l",
        "type": "platform",
        "position": {
          "x": -3.1,
          "y": 5.6,
          "z": -10.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.7,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-bank-6r",
        "type": "platform",
        "position": {
          "x": 3.1,
          "y": 5.6,
          "z": -10.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.7,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-rock-3",
        "type": "bumper",
        "position": {
          "x": 0.5,
          "y": 6,
          "z": -10.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 2,
          "y": 1.2,
          "z": 2
        },
        "properties": {
          "color": "#546e7a",
          "bounce": 0.8
        }
      },
      {
        "id": "s1-water-7",
        "type": "water",
        "position": {
          "x": -0.6,
          "y": 3.4,
          "z": -16.5
        },
        "rotation": {
          "x": -0.1,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 5.5,
          "y": 0.8,
          "z": 5.5
        }
      },
      {
        "id": "s1-bank-7l",
        "type": "platform",
        "position": {
          "x": -3.7,
          "y": 3.8,
          "z": -16.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.7,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-bank-7r",
        "type": "platform",
        "position": {
          "x": 2.5,
          "y": 3.8,
          "z": -16.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.7,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-col-3",
        "type": "collectible",
        "position": {
          "x": -1.6,
          "y": 4.6,
          "z": -16.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s1-water-8",
        "type": "water",
        "position": {
          "x": 0,
          "y": 1.8,
          "z": -22.5
        },
        "rotation": {
          "x": -0.1,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 5.5,
          "y": 0.8,
          "z": 5.5
        }
      },
      {
        "id": "s1-bank-8l",
        "type": "platform",
        "position": {
          "x": -3.1,
          "y": 2.2,
          "z": -22.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.7,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-bank-8r",
        "type": "platform",
        "position": {
          "x": 3.1,
          "y": 2.2,
          "z": -22.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.7,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-rock-4",
        "type": "bumper",
        "position": {
          "x": -0.6,
          "y": 2.6,
          "z": -22.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 2,
          "y": 1.2,
          "z": 2
        },
        "properties": {
          "color": "#455a64",
          "bounce": 0.8
        }
      },
      {
        "id": "s1-water-9",
        "type": "water",
        "position": {
          "x": 0,
          "y": 0.6,
          "z": -28.5
        },
        "rotation": {
          "x": -0.1,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6,
          "y": 0.8,
          "z": 5.5
        }
      },
      {
        "id": "s1-bank-9l",
        "type": "platform",
        "position": {
          "x": -3.4,
          "y": 1,
          "z": -28.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-bank-9r",
        "type": "platform",
        "position": {
          "x": 3.4,
          "y": 1,
          "z": -28.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-col-4",
        "type": "collectible",
        "position": {
          "x": 1.4,
          "y": 1.8,
          "z": -28.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s1-water-10",
        "type": "water",
        "position": {
          "x": 0,
          "y": 0,
          "z": -34.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 8.5,
          "y": 0.8,
          "z": 6.5
        }
      },
      {
        "id": "s1-bank-10l",
        "type": "platform",
        "position": {
          "x": -4.6,
          "y": 0.4,
          "z": -34.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-bank-10r",
        "type": "platform",
        "position": {
          "x": 4.6,
          "y": 0.4,
          "z": -34.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s1-plat-finish",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0,
          "z": -41
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 9,
          "y": 0.8,
          "z": 7
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#b0bec5"
        }
      },
      {
        "id": "s1-curb-fin-b",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0.5,
          "z": -44.8
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 9,
          "y": 0.4,
          "z": 0.4
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#546e7a"
        }
      },
      {
        "id": "s1-curb-fin-l",
        "type": "platform",
        "position": {
          "x": -4.3,
          "y": 0.5,
          "z": -41
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 0.4,
          "z": 7
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#546e7a"
        }
      },
      {
        "id": "s1-curb-fin-r",
        "type": "platform",
        "position": {
          "x": 4.3,
          "y": 0.5,
          "z": -41
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 0.4,
          "z": 7
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#546e7a"
        }
      },
      {
        "id": "s1-lamp-1",
        "type": "decoration",
        "position": {
          "x": -3.8,
          "y": 0.4,
          "z": -42
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s1-lamp-2",
        "type": "decoration",
        "position": {
          "x": 3.8,
          "y": 0.4,
          "z": -42
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s1-goal",
        "type": "goal",
        "position": {
          "x": 0,
          "y": 0.8,
          "z": -41.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 2: Callejón
  // ---------------------------------------------------------------------------
  2: {
    "id": "world-01-level-03-stage-02",
    "world": 1,
    "level": 3,
    "stage": 2,
    "name": "Callejón",
    "theme": "countryside",
    "musicTrack": "jungle_groove",
    "timeLimit": 60,
    "spawn": {
      "x": 7,
      "y": 1.5,
      "z": 14
    },
    "objects": [
      {
        "id": "s2-plat-entry",
        "type": "platform",
        "position": {
          "x": 7,
          "y": 0,
          "z": 14
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#cfd8dc"
        }
      },
      {
        "id": "s2-curb-entry-b",
        "type": "platform",
        "position": {
          "x": 7,
          "y": 0.6,
          "z": 16.8
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6,
          "y": 0.6,
          "z": 0.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#546e7a"
        }
      },
      {
        "id": "s2-curb-entry-r",
        "type": "platform",
        "position": {
          "x": 9.8,
          "y": 0.6,
          "z": 14
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.5,
          "y": 0.6,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#546e7a"
        }
      },
      {
        "id": "s2-floor-t1",
        "type": "platform",
        "position": {
          "x": 7,
          "y": 0,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 2.6,
          "y": 0.8,
          "z": 22
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#b0bec5"
        }
      },
      {
        "id": "s2-wall-t1-l",
        "type": "platform",
        "position": {
          "x": 5.5,
          "y": 1.7,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 3.4,
          "z": 22
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s2-wall-t1-r",
        "type": "platform",
        "position": {
          "x": 8.5,
          "y": 1.7,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 3.4,
          "z": 22
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s2-roof-t1",
        "type": "platform",
        "position": {
          "x": 7,
          "y": 3.6,
          "z": 0.7
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 3.4,
          "y": 0.3,
          "z": 22
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#5d4037"
        }
      },
      {
        "id": "s2-lamp-t1a",
        "type": "decoration",
        "position": {
          "x": 5.9,
          "y": 0.4,
          "z": 6
        },
        "rotation": {
          "x": 0,
          "y": 1.571,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 0.8
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s2-lamp-t1b",
        "type": "decoration",
        "position": {
          "x": 8.1,
          "y": 0.4,
          "z": -4
        },
        "rotation": {
          "x": 0,
          "y": -1.571,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 0.8
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s2-col-1",
        "type": "collectible",
        "position": {
          "x": 7,
          "y": 1.2,
          "z": 3
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s2-floor-t2",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0,
          "z": -12
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 16.6,
          "y": 0.8,
          "z": 2.6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#b0bec5"
        }
      },
      {
        "id": "s2-wall-t2-n",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 1.7,
          "z": -13.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 17.4,
          "y": 3.4,
          "z": 0.4
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s2-wall-t2-s",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 1.7,
          "z": -10.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 11.4,
          "y": 3.4,
          "z": 0.4
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s2-roof-t2",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 3.6,
          "z": -12
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 17.4,
          "y": 0.3,
          "z": 3.4
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#5d4037"
        }
      },
      {
        "id": "s2-lamp-t2",
        "type": "decoration",
        "position": {
          "x": 0,
          "y": 0.4,
          "z": -13.1
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 0.8
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s2-col-2",
        "type": "collectible",
        "position": {
          "x": 0,
          "y": 1.2,
          "z": -12
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s2-floor-t3",
        "type": "platform",
        "position": {
          "x": -7,
          "y": 0,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 2.6,
          "y": 0.8,
          "z": 22
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#b0bec5"
        }
      },
      {
        "id": "s2-wall-t3-l",
        "type": "platform",
        "position": {
          "x": -8.5,
          "y": 1.7,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 3.4,
          "z": 22
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s2-wall-t3-r",
        "type": "platform",
        "position": {
          "x": -5.5,
          "y": 1.7,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 3.4,
          "z": 22
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s2-roof-t3",
        "type": "platform",
        "position": {
          "x": -7,
          "y": 3.6,
          "z": 0.7
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 3.4,
          "y": 0.3,
          "z": 22
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#5d4037"
        }
      },
      {
        "id": "s2-lamp-t3a",
        "type": "decoration",
        "position": {
          "x": -8.1,
          "y": 0.4,
          "z": -4
        },
        "rotation": {
          "x": 0,
          "y": 1.571,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 0.8
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s2-lamp-t3b",
        "type": "decoration",
        "position": {
          "x": -5.9,
          "y": 0.4,
          "z": 6
        },
        "rotation": {
          "x": 0,
          "y": -1.571,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 0.8
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s2-col-3",
        "type": "collectible",
        "position": {
          "x": -7,
          "y": 1.2,
          "z": 3
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s2-plat-exit",
        "type": "platform",
        "position": {
          "x": -7,
          "y": 0,
          "z": 14.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#cfd8dc"
        }
      },
      {
        "id": "s2-curb-exit-b",
        "type": "platform",
        "position": {
          "x": -7,
          "y": 0.6,
          "z": 17.3
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6,
          "y": 0.6,
          "z": 0.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#546e7a"
        }
      },
      {
        "id": "s2-curb-exit-l",
        "type": "platform",
        "position": {
          "x": -9.8,
          "y": 0.6,
          "z": 14.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.5,
          "y": 0.6,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#546e7a"
        }
      },
      {
        "id": "s2-lamp-exit",
        "type": "decoration",
        "position": {
          "x": -9.2,
          "y": 0.4,
          "z": 16.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s2-flower-exit",
        "type": "decoration",
        "position": {
          "x": -4.8,
          "y": 0.4,
          "z": 16.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "flower"
        }
      },
      {
        "id": "s2-goal",
        "type": "goal",
        "position": {
          "x": -7,
          "y": 0.8,
          "z": 15.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 3: Correr1
  // ---------------------------------------------------------------------------
  3: {
    "id": "world-01-level-03-stage-03",
    "world": 1,
    "level": 3,
    "stage": 3,
    "name": "Correr1",
    "theme": "countryside",
    "musicTrack": "jungle_groove",
    "timeLimit": 60,
    "spawn": {
      "x": 0,
      "y": 1.5,
      "z": 29
    },
    "objects": [
      {
        "id": "s3-plat-track",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 5.6,
          "y": 0.8,
          "z": 66
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#90a4ae"
        }
      },
      {
        "id": "s3-curb-back",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0.6,
          "z": 32.8
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 5.6,
          "y": 0.6,
          "z": 0.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s3-fence-l1",
        "type": "platform",
        "position": {
          "x": -2.9,
          "y": 0.5,
          "z": 24
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 0.4,
          "z": 12
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#546e7a"
        }
      },
      {
        "id": "s3-fence-r1",
        "type": "platform",
        "position": {
          "x": 2.9,
          "y": 0.5,
          "z": 24
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 0.4,
          "z": 12
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#546e7a"
        }
      },
      {
        "id": "s3-fence-l2",
        "type": "platform",
        "position": {
          "x": -2.9,
          "y": 0.5,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 0.4,
          "z": 12
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#546e7a"
        }
      },
      {
        "id": "s3-fence-r2",
        "type": "platform",
        "position": {
          "x": 2.9,
          "y": 0.5,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 0.4,
          "z": 12
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#546e7a"
        }
      },
      {
        "id": "s3-fence-l3",
        "type": "platform",
        "position": {
          "x": -2.9,
          "y": 0.5,
          "z": -24
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 0.4,
          "z": 12
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#546e7a"
        }
      },
      {
        "id": "s3-fence-r3",
        "type": "platform",
        "position": {
          "x": 2.9,
          "y": 0.5,
          "z": -24
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 0.4,
          "z": 12
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#546e7a"
        }
      },
      {
        "id": "s3-bull-1",
        "type": "bumper",
        "position": {
          "x": 0,
          "y": 0.6,
          "z": 32
        },
        "rotation": {
          "x": 0,
          "y": 3.1416,
          "z": 0
        },
        "scale": {
          "x": 2,
          "y": 1.5,
          "z": 2
        },
        "properties": {
          "variant": "bull",
          "axis": "z",
          "color": "#1a1a1a",
          "bounce": 1.45,
          "distance": 14,
          "speed": 1.5,
          "phase": 0
        }
      },
      {
        "id": "s3-bull-2",
        "type": "bumper",
        "position": {
          "x": -0.5,
          "y": 0.6,
          "z": 10
        },
        "rotation": {
          "x": 0,
          "y": 3.1416,
          "z": 0
        },
        "scale": {
          "x": 2,
          "y": 1.5,
          "z": 2
        },
        "properties": {
          "variant": "bull",
          "axis": "z",
          "color": "#263238",
          "bounce": 1.45,
          "distance": 12,
          "speed": 1.8,
          "phase": 1.2
        }
      },
      {
        "id": "s3-bull-3",
        "type": "bumper",
        "position": {
          "x": 0.5,
          "y": 0.6,
          "z": -10
        },
        "rotation": {
          "x": 0,
          "y": 3.1416,
          "z": 0
        },
        "scale": {
          "x": 2,
          "y": 1.5,
          "z": 2
        },
        "properties": {
          "variant": "bull",
          "axis": "z",
          "color": "#1a1a1a",
          "bounce": 1.45,
          "distance": 12,
          "speed": 2,
          "phase": 2.4
        }
      },
      {
        "id": "s3-lamp-1",
        "type": "decoration",
        "position": {
          "x": -3.5,
          "y": 0.4,
          "z": 20
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s3-lamp-2",
        "type": "decoration",
        "position": {
          "x": 3.5,
          "y": 0.4,
          "z": 5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s3-lamp-3",
        "type": "decoration",
        "position": {
          "x": -3.5,
          "y": 0.4,
          "z": -12
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s3-lamp-4",
        "type": "decoration",
        "position": {
          "x": 3.5,
          "y": 0.4,
          "z": -25
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s3-col-1",
        "type": "collectible",
        "position": {
          "x": 0,
          "y": 1.2,
          "z": 20
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s3-col-2",
        "type": "collectible",
        "position": {
          "x": 0,
          "y": 1.2,
          "z": 5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s3-col-3",
        "type": "collectible",
        "position": {
          "x": 0,
          "y": 1.2,
          "z": -12
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s3-col-4",
        "type": "collectible",
        "position": {
          "x": 0,
          "y": 1.2,
          "z": -25
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s3-goal",
        "type": "goal",
        "position": {
          "x": 0,
          "y": 0.8,
          "z": -30
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 4: Feria
  // ---------------------------------------------------------------------------
  4: {
    "id": "world-01-level-03-stage-04",
    "world": 1,
    "level": 3,
    "stage": 4,
    "name": "Feria",
    "theme": "countryside",
    "musicTrack": "jungle_groove",
    "timeLimit": 60,
    "spawn": {
      "x": 0,
      "y": 1.5,
      "z": 13.5
    },
    "objects": [
      {
        "id": "s4-plat-start",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0,
          "z": 13.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7.5,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#cfd8dc"
        }
      },
      {
        "id": "s4-curb-start-b",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0.5,
          "z": 16
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7.5,
          "y": 0.4,
          "z": 0.4
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#e53935"
        }
      },
      {
        "id": "s4-curb-start-l",
        "type": "platform",
        "position": {
          "x": -3.6,
          "y": 0.5,
          "z": 13.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 0.4,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#e53935"
        }
      },
      {
        "id": "s4-curb-start-r",
        "type": "platform",
        "position": {
          "x": 3.6,
          "y": 0.5,
          "z": 13.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 0.4,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#e53935"
        }
      },
      {
        "id": "s4-la-olla",
        "type": "moving-platform",
        "position": {
          "x": 0,
          "y": -0.5,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 20,
          "y": 0.6,
          "z": 11.6
        },
        "properties": {
          "isMoving": true,
          "variant": "olla",
          "movementType": "olla",
          "rotSpeed": 1.3,
          "tiltSpeed": 2.2,
          "maxTilt": 0.17
        }
      },
      {
        "id": "s4-plat-goal",
        "type": "platform",
        "position": {
          "x": 0,
          "y": -2,
          "z": -13.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7.5,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#cfd8dc"
        }
      },
      {
        "id": "s4-curb-goal-b",
        "type": "platform",
        "position": {
          "x": 0,
          "y": -1.5,
          "z": -16
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7.5,
          "y": 0.4,
          "z": 0.4
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#00e5ff"
        }
      },
      {
        "id": "s4-curb-goal-l",
        "type": "platform",
        "position": {
          "x": -3.6,
          "y": -1.5,
          "z": -13.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 0.4,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#00e5ff"
        }
      },
      {
        "id": "s4-curb-goal-r",
        "type": "platform",
        "position": {
          "x": 3.6,
          "y": -1.5,
          "z": -13.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 0.4,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#00e5ff"
        }
      },
      {
        "id": "s4-lamp-1",
        "type": "decoration",
        "position": {
          "x": -3,
          "y": 0.4,
          "z": 15
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s4-lamp-2",
        "type": "decoration",
        "position": {
          "x": 3,
          "y": 0.4,
          "z": 15
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s4-lamp-3",
        "type": "decoration",
        "position": {
          "x": -3,
          "y": -1.6,
          "z": -15
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s4-lamp-4",
        "type": "decoration",
        "position": {
          "x": 3,
          "y": -1.6,
          "z": -15
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s4-col-1",
        "type": "collectible",
        "position": {
          "x": 0,
          "y": 1.2,
          "z": 12
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s4-col-2",
        "type": "collectible",
        "position": {
          "x": -7,
          "y": 1,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s4-col-3",
        "type": "collectible",
        "position": {
          "x": 7,
          "y": 1,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s4-col-4",
        "type": "collectible",
        "position": {
          "x": 0,
          "y": -0.8,
          "z": -12
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s4-goal",
        "type": "goal",
        "position": {
          "x": 0,
          "y": -1.2,
          "z": -14.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 5: Objetos3
  // ---------------------------------------------------------------------------
  5: {
    "id": "world-01-level-03-stage-05",
    "world": 1,
    "level": 3,
    "stage": 5,
    "name": "Objetos3",
    "theme": "countryside",
    "musicTrack": "jungle_groove",
    "timeLimit": 60,
    "spawn": {
      "x": 0,
      "y": 1.5,
      "z": 10.5
    },
    "objects": [
      {
        "id": "s5-plat-main",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 26,
          "y": 0.8,
          "z": 26
        },
        "properties": {
          "theme": "villamanta",
          "customColor": "#eceff1"
        }
      },
      {
        "id": "s5-plat-court",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0.42,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 18,
          "y": 0.04,
          "z": 18
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#cfd8dc"
        }
      },
      {
        "id": "s5-fence-1",
        "type": "decoration",
        "position": {
          "x": -12.5,
          "y": 0.4,
          "z": 8
        },
        "rotation": {
          "x": 0,
          "y": 1.571,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "fence",
          "color": "#1976d2"
        }
      },
      {
        "id": "s5-fence-2",
        "type": "decoration",
        "position": {
          "x": -12.5,
          "y": 0.4,
          "z": -8
        },
        "rotation": {
          "x": 0,
          "y": 1.571,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "fence",
          "color": "#1976d2"
        }
      },
      {
        "id": "s5-fence-3",
        "type": "decoration",
        "position": {
          "x": 12.5,
          "y": 0.4,
          "z": 8
        },
        "rotation": {
          "x": 0,
          "y": 1.571,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "fence",
          "color": "#1976d2"
        }
      },
      {
        "id": "s5-fence-4",
        "type": "decoration",
        "position": {
          "x": 12.5,
          "y": 0.4,
          "z": -8
        },
        "rotation": {
          "x": 0,
          "y": 1.571,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "fence",
          "color": "#1976d2"
        }
      },
      {
        "id": "s5-fence-5",
        "type": "decoration",
        "position": {
          "x": 0,
          "y": 0.4,
          "z": 12.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "fence",
          "color": "#1976d2"
        }
      },
      {
        "id": "s5-fence-6",
        "type": "decoration",
        "position": {
          "x": 0,
          "y": 0.4,
          "z": -12.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "fence",
          "color": "#1976d2"
        }
      },
      {
        "id": "s5-lamp-1",
        "type": "decoration",
        "position": {
          "x": -11.5,
          "y": 0.4,
          "z": 11.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s5-lamp-2",
        "type": "decoration",
        "position": {
          "x": 11.5,
          "y": 0.4,
          "z": 11.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s5-lamp-3",
        "type": "decoration",
        "position": {
          "x": -11.5,
          "y": 0.4,
          "z": -11.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s5-lamp-4",
        "type": "decoration",
        "position": {
          "x": 11.5,
          "y": 0.4,
          "z": -11.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s5-tree-1",
        "type": "decoration",
        "position": {
          "x": -11,
          "y": 0.4,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "tree"
        }
      },
      {
        "id": "s5-tree-2",
        "type": "decoration",
        "position": {
          "x": 11,
          "y": 0.4,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "tree"
        }
      },
      {
        "id": "s5-col-1",
        "type": "collectible",
        "position": {
          "x": -7.5,
          "y": 1.2,
          "z": 7.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s5-col-2",
        "type": "collectible",
        "position": {
          "x": 7.5,
          "y": 1.2,
          "z": 7.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s5-col-3",
        "type": "collectible",
        "position": {
          "x": -7.5,
          "y": 1.2,
          "z": -7.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s5-col-4",
        "type": "collectible",
        "position": {
          "x": 7.5,
          "y": 1.2,
          "z": -7.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s5-col-5",
        "type": "collectible",
        "position": {
          "x": 0,
          "y": 1.2,
          "z": 5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s5-col-6",
        "type": "collectible",
        "position": {
          "x": 0,
          "y": 1.2,
          "z": -5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s5-col-7",
        "type": "collectible",
        "position": {
          "x": -5,
          "y": 1.2,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s5-col-8",
        "type": "collectible",
        "position": {
          "x": 5,
          "y": 1.2,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s5-goal",
        "type": "goal",
        "position": {
          "x": 0,
          "y": 0.8,
          "z": -11
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 6: Chiringuito
  // ---------------------------------------------------------------------------
  6: {
    "id": "world-01-level-03-stage-06",
    "world": 1,
    "level": 3,
    "stage": 6,
    "name": "Chiringuito",
    "theme": "countryside",
    "musicTrack": "jungle_groove",
    "timeLimit": 60,
    "spawn": {
      "x": -4,
      "y": 9.5,
      "z": 14
    },
    "objects": [
      {
        "id": "s6-plat-terrace",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 8,
          "z": 10
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 15,
          "y": 0.8,
          "z": 15
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#8d6e63"
        }
      },
      {
        "id": "s6-curb-t-back",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 8.6,
          "z": 17.2
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 15,
          "y": 0.6,
          "z": 0.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#5d4037"
        }
      },
      {
        "id": "s6-curb-t-left",
        "type": "platform",
        "position": {
          "x": -7.2,
          "y": 8.6,
          "z": 10
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.5,
          "y": 0.6,
          "z": 15
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#5d4037"
        }
      },
      {
        "id": "s6-curb-t-front",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 8.6,
          "z": 2.8
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 14,
          "y": 0.6,
          "z": 0.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#5d4037"
        }
      },
      {
        "id": "s6-curb-t-right",
        "type": "platform",
        "position": {
          "x": 7.2,
          "y": 8.6,
          "z": 10
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.5,
          "y": 0.6,
          "z": 15
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#5d4037"
        }
      },
      {
        "id": "s6-bar-counter",
        "type": "platform",
        "position": {
          "x": 3.5,
          "y": 9.1,
          "z": 8
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1.2,
          "y": 1.4,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#4e342e"
        }
      },
      {
        "id": "s6-bar-front",
        "type": "platform",
        "position": {
          "x": 5.5,
          "y": 9.1,
          "z": 10.2
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 3.5,
          "y": 1.4,
          "z": 1.2
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#4e342e"
        }
      },
      {
        "id": "s6-bar-roof",
        "type": "platform",
        "position": {
          "x": 4.5,
          "y": 11.5,
          "z": 9
        },
        "rotation": {
          "x": 0.05,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 5.5,
          "y": 0.3,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#ffb74d"
        }
      },
      {
        "id": "s6-post-1",
        "type": "platform",
        "position": {
          "x": 2.2,
          "y": 10,
          "z": 6.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.2,
          "y": 3.2,
          "z": 0.2
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#5d4037"
        }
      },
      {
        "id": "s6-post-2",
        "type": "platform",
        "position": {
          "x": 6.8,
          "y": 10,
          "z": 6.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.2,
          "y": 3.2,
          "z": 0.2
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#5d4037"
        }
      },
      {
        "id": "s6-lamp-1",
        "type": "decoration",
        "position": {
          "x": -5.5,
          "y": 8.4,
          "z": 15.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s6-lamp-2",
        "type": "decoration",
        "position": {
          "x": -5.5,
          "y": 8.4,
          "z": 4.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s6-flower-1",
        "type": "decoration",
        "position": {
          "x": -2,
          "y": 8.4,
          "z": 15
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "flower"
        }
      },
      {
        "id": "s6-funnel-guide-l",
        "type": "platform",
        "position": {
          "x": 3.6,
          "y": 8.9,
          "z": 4.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 1.2,
          "z": 2.8
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#0288d1"
        }
      },
      {
        "id": "s6-pipe-roof",
        "type": "ramp",
        "position": {
          "x": 4.8,
          "y": 5.4,
          "z": -2.6
        },
        "rotation": {
          "x": -0.52,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 2.2,
          "y": 0.3,
          "z": 16.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#0288d1"
        }
      },
      {
        "id": "s6-plat-lower",
        "type": "platform",
        "position": {
          "x": 4.8,
          "y": 0,
          "z": -14
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7,
          "y": 0.8,
          "z": 7
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#cfd8dc"
        }
      },
      {
        "id": "s6-curb-low-b",
        "type": "platform",
        "position": {
          "x": 4.8,
          "y": 0.5,
          "z": -17.2
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7,
          "y": 0.4,
          "z": 0.4
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#546e7a"
        }
      },
      {
        "id": "s6-curb-low-l",
        "type": "platform",
        "position": {
          "x": 1.5,
          "y": 0.5,
          "z": -14
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 0.4,
          "z": 7
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#546e7a"
        }
      },
      {
        "id": "s6-curb-low-r",
        "type": "platform",
        "position": {
          "x": 8.1,
          "y": 0.5,
          "z": -14
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.4,
          "y": 0.4,
          "z": 7
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#546e7a"
        }
      },
      {
        "id": "s6-lamp-low",
        "type": "decoration",
        "position": {
          "x": 2.2,
          "y": 0.4,
          "z": -15.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s6-col-1",
        "type": "collectible",
        "position": {
          "x": -2,
          "y": 9.2,
          "z": 10
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s6-col-2",
        "type": "collectible",
        "position": {
          "x": 4.8,
          "y": 9.2,
          "z": 5.8
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s6-col-3",
        "type": "collectible",
        "position": {
          "x": 4.8,
          "y": 4.5,
          "z": -2.6
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s6-col-4",
        "type": "collectible",
        "position": {
          "x": 4.8,
          "y": 1.2,
          "z": -12
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s6-goal",
        "type": "goal",
        "position": {
          "x": 4.8,
          "y": 0.8,
          "z": -15.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 7: Piscina2
  // ---------------------------------------------------------------------------
  7: {
    "id": "world-01-level-03-stage-07",
    "world": 1,
    "level": 3,
    "stage": 7,
    "name": "Piscina2",
    "theme": "countryside",
    "musicTrack": "jungle_groove",
    "timeLimit": 60,
    "spawn": {
      "x": 0,
      "y": 2.8,
      "z": 16
    },
    "objects": [
      {
        "id": "s7-plat-start",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 1.6,
          "z": 16
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#cfd8dc"
        }
      },
      {
        "id": "s7-curb-start-b",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 2.2,
          "z": 18.8
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 8,
          "y": 0.6,
          "z": 0.4
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#0288d1"
        }
      },
      {
        "id": "s7-step-d1",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 1.2,
          "z": 12
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6,
          "y": 0.4,
          "z": 1.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#b0bec5"
        }
      },
      {
        "id": "s7-step-d2",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0.8,
          "z": 10.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6,
          "y": 0.4,
          "z": 1.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#90a4ae"
        }
      },
      {
        "id": "s7-step-d3",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0.4,
          "z": 9
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6,
          "y": 0.4,
          "z": 1.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s7-water-main-1",
        "type": "water",
        "position": {
          "x": -3.5,
          "y": 0,
          "z": 3
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7,
          "y": 0.8,
          "z": 9
        }
      },
      {
        "id": "s7-water-main-2",
        "type": "water",
        "position": {
          "x": 3.5,
          "y": 0,
          "z": 3
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7,
          "y": 0.8,
          "z": 9
        }
      },
      {
        "id": "s7-water-main-3",
        "type": "water",
        "position": {
          "x": -3.5,
          "y": 0,
          "z": -6
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7,
          "y": 0.8,
          "z": 9
        }
      },
      {
        "id": "s7-water-main-4",
        "type": "water",
        "position": {
          "x": 3.5,
          "y": 0,
          "z": -6
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7,
          "y": 0.8,
          "z": 9
        }
      },
      {
        "id": "s7-pool-wall-l",
        "type": "platform",
        "position": {
          "x": -7.5,
          "y": 0.5,
          "z": -1.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 1,
          "z": 20
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#0288d1"
        }
      },
      {
        "id": "s7-pool-wall-r",
        "type": "platform",
        "position": {
          "x": 7.5,
          "y": 0.5,
          "z": -1.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 1,
          "z": 20
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#0288d1"
        }
      },
      {
        "id": "s7-island-mid",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0.45,
          "z": -1.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 3.4,
          "y": 0.4,
          "z": 3.4
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#ffd54f"
        }
      },
      {
        "id": "s7-bumper-mid",
        "type": "bumper",
        "position": {
          "x": 0,
          "y": 0.95,
          "z": -1.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1.2,
          "y": 1.2,
          "z": 1.2
        },
        "properties": {
          "color": "#e53935",
          "bounce": 1.2
        }
      },
      {
        "id": "s7-float-l",
        "type": "bumper",
        "position": {
          "x": -4,
          "y": 0.5,
          "z": 3
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 5,
          "y": 1,
          "z": 5
        },
        "properties": {
          "color": "#ff9800",
          "bounce": 1.35
        }
      },
      {
        "id": "s7-float-r",
        "type": "bumper",
        "position": {
          "x": 4,
          "y": 0.5,
          "z": -5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 3,
          "y": 1,
          "z": 3
        },
        "properties": {
          "color": "#ff9800",
          "bounce": 1.35
        }
      },
      {
        "id": "s7-step-u1",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0.4,
          "z": -11.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6,
          "y": 0.4,
          "z": 1.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#78909c"
        }
      },
      {
        "id": "s7-step-u2",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0.8,
          "z": -13
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6,
          "y": 0.4,
          "z": 1.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#90a4ae"
        }
      },
      {
        "id": "s7-step-u3",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 1.2,
          "z": -14.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6,
          "y": 0.4,
          "z": 1.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#b0bec5"
        }
      },
      {
        "id": "s7-plat-goal",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 1.6,
          "z": -17.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 8,
          "y": 0.8,
          "z": 5.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#cfd8dc"
        }
      },
      {
        "id": "s7-curb-goal-b",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 2.2,
          "z": -20
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 8,
          "y": 0.6,
          "z": 0.4
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#0288d1"
        }
      },
      {
        "id": "s7-garden-plat",
        "type": "platform",
        "position": {
          "x": 12,
          "y": 0.5,
          "z": -1.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7,
          "y": 0.8,
          "z": 24
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#66bb6a"
        }
      },
      {
        "id": "s7-tree-1",
        "type": "decoration",
        "position": {
          "x": 12.5,
          "y": 0.9,
          "z": 8
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1.2,
          "y": 1.2,
          "z": 1.2
        },
        "properties": {
          "subType": "tree"
        }
      },
      {
        "id": "s7-tree-2",
        "type": "decoration",
        "position": {
          "x": 12.5,
          "y": 0.9,
          "z": -8
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1.2,
          "y": 1.2,
          "z": 1.2
        },
        "properties": {
          "subType": "tree"
        }
      },
      {
        "id": "s7-flower-1",
        "type": "decoration",
        "position": {
          "x": 10.5,
          "y": 0.9,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "flower"
        }
      },
      {
        "id": "s7-lamp-1",
        "type": "decoration",
        "position": {
          "x": -3.5,
          "y": 2,
          "z": 16.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s7-lamp-2",
        "type": "decoration",
        "position": {
          "x": 3.5,
          "y": 2,
          "z": 16.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s7-lamp-3",
        "type": "decoration",
        "position": {
          "x": -3.5,
          "y": 2,
          "z": -18.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s7-lamp-4",
        "type": "decoration",
        "position": {
          "x": 3.5,
          "y": 2,
          "z": -18.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s7-col-1",
        "type": "collectible",
        "position": {
          "x": 0,
          "y": 1.8,
          "z": 10.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s7-col-2",
        "type": "collectible",
        "position": {
          "x": -3.5,
          "y": 1.2,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s7-col-3",
        "type": "collectible",
        "position": {
          "x": 3.5,
          "y": 1.2,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s7-col-4",
        "type": "collectible",
        "position": {
          "x": 0,
          "y": 2.4,
          "z": -14.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s7-goal",
        "type": "goal",
        "position": {
          "x": 0,
          "y": 2.4,
          "z": -17.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "obj-custom-1792574924898",
        "type": "platform",
        "position": {
          "x": -12,
          "y": 0.5,
          "z": -1.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7,
          "y": 0.8,
          "z": 24
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#66bb6a"
        }
      },
      {
        "id": "obj-custom-1792574946027",
        "type": "decoration",
        "position": {
          "x": -12.5,
          "y": 0.9,
          "z": -10
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1.2,
          "y": 1.2,
          "z": 1.2
        },
        "properties": {
          "subType": "tree"
        }
      },
      {
        "id": "obj-custom-1792574957987",
        "type": "decoration",
        "position": {
          "x": -12.5,
          "y": 0.9,
          "z": 6
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1.2,
          "y": 1.2,
          "z": 1.2
        },
        "properties": {
          "subType": "tree"
        }
      },
      {
        "id": "obj-custom-1792574968913",
        "type": "decoration",
        "position": {
          "x": -10.5,
          "y": 0.9,
          "z": -2
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "bird",
          "hasCollision": false
        }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 8: Futbol
  // ---------------------------------------------------------------------------
  8: {
    "id": "world-01-level-03-stage-08",
    "world": 1,
    "level": 3,
    "stage": 8,
    "name": "Futbol",
    "theme": "countryside",
    "musicTrack": "jungle_groove",
    "timeLimit": 60,
    "spawn": {
      "x": 0,
      "y": 1.5,
      "z": 18.5
    },
    "objects": [
      {
        "id": "s8-pitch-sec1",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0,
          "z": 19
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 18,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#2e7d32"
        }
      },
      {
        "id": "s8-pitch-mid-strip1",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0,
          "z": 10
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 12,
          "y": 0.8,
          "z": 4
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#388e3c"
        }
      },
      {
        "id": "s8-pitch-wing1-l",
        "type": "platform",
        "position": {
          "x": -7.5,
          "y": 0,
          "z": 12
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 3,
          "y": 0.8,
          "z": 8
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#2e7d32"
        }
      },
      {
        "id": "s8-pitch-wing1-r",
        "type": "platform",
        "position": {
          "x": 7.5,
          "y": 0,
          "z": 7.7
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 3,
          "y": 0.8,
          "z": 8.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#2e7d32"
        }
      },
      {
        "id": "s8-pitch-center",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 18,
          "y": 0.8,
          "z": 7
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#2e7d32"
        }
      },
      {
        "id": "s8-pitch-mid-strip2",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0,
          "z": -9
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 12,
          "y": 0.8,
          "z": 4
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#388e3c"
        }
      },
      {
        "id": "s8-pitch-wing2-l",
        "type": "platform",
        "position": {
          "x": -7.5,
          "y": 0,
          "z": -11.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 3,
          "y": 0.8,
          "z": 9
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#2e7d32"
        }
      },
      {
        "id": "s8-pitch-wing2-r",
        "type": "platform",
        "position": {
          "x": 7.5,
          "y": 0,
          "z": -7.3
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 3,
          "y": 0.8,
          "z": 7.3
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#2e7d32"
        }
      },
      {
        "id": "s8-pitch-sec5",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0,
          "z": -19
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 18,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#2e7d32"
        }
      },
      {
        "id": "s8-goal1-post-l",
        "type": "platform",
        "position": {
          "x": -3.5,
          "y": 1.8,
          "z": 20
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.25,
          "y": 2.8,
          "z": 0.25
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#ffffff"
        }
      },
      {
        "id": "s8-goal1-post-r",
        "type": "platform",
        "position": {
          "x": 3.5,
          "y": 1.8,
          "z": 20
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.25,
          "y": 2.8,
          "z": 0.25
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#ffffff"
        }
      },
      {
        "id": "s8-goal1-crossbar",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 3.1,
          "z": 20
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7.25,
          "y": 0.25,
          "z": 0.25
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#ffffff"
        }
      },
      {
        "id": "s8-goal1-backnet",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 1.8,
          "z": 21.8
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7.25,
          "y": 2.8,
          "z": 0.2
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#cfd8dc"
        }
      },
      {
        "id": "s8-goal2-post-l",
        "type": "platform",
        "position": {
          "x": -3.5,
          "y": 1.8,
          "z": -20
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.25,
          "y": 2.8,
          "z": 0.25
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#ffffff"
        }
      },
      {
        "id": "s8-goal2-post-r",
        "type": "platform",
        "position": {
          "x": 3.5,
          "y": 1.8,
          "z": -20
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.25,
          "y": 2.8,
          "z": 0.25
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#ffffff"
        }
      },
      {
        "id": "s8-goal2-crossbar",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 3.1,
          "z": -20
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7.25,
          "y": 0.25,
          "z": 0.25
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#ffffff"
        }
      },
      {
        "id": "s8-goal2-backnet",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 1.8,
          "z": -21.8
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7.25,
          "y": 2.8,
          "z": 0.2
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#cfd8dc"
        }
      },
      {
        "id": "s8-bull-1",
        "type": "bumper",
        "position": {
          "x": 0,
          "y": 0.6,
          "z": 9
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 2,
          "y": 1.5,
          "z": 2
        },
        "properties": {
          "variant": "bull",
          "axis": "x",
          "color": "#1a1a1a",
          "bounce": 1.45,
          "distance": 6.5,
          "speed": 1.4,
          "phase": 0
        }
      },
      {
        "id": "s8-bull-2",
        "type": "bumper",
        "position": {
          "x": 0,
          "y": 0.6,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 2,
          "y": 1.5,
          "z": 2
        },
        "properties": {
          "variant": "bull",
          "axis": "x",
          "color": "#263238",
          "bounce": 1.45,
          "distance": 7,
          "speed": 1.6,
          "phase": 1.5
        }
      },
      {
        "id": "s8-bull-3",
        "type": "bumper",
        "position": {
          "x": 0,
          "y": 0.6,
          "z": -8
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 2,
          "y": 1.5,
          "z": 2
        },
        "properties": {
          "variant": "bull",
          "axis": "x",
          "color": "#1a1a1a",
          "bounce": 1.45,
          "distance": 6.5,
          "speed": 1.5,
          "phase": 3
        }
      },
      {
        "id": "s8-lamp-1",
        "type": "decoration",
        "position": {
          "x": -8.5,
          "y": 0.4,
          "z": 21
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s8-lamp-2",
        "type": "decoration",
        "position": {
          "x": 8.5,
          "y": 0.4,
          "z": 21
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s8-lamp-3",
        "type": "decoration",
        "position": {
          "x": -8.5,
          "y": 0.4,
          "z": -21
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s8-lamp-4",
        "type": "decoration",
        "position": {
          "x": 8.5,
          "y": 0.4,
          "z": -21
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s8-col-1",
        "type": "collectible",
        "position": {
          "x": -8,
          "y": 1.2,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s8-col-2",
        "type": "collectible",
        "position": {
          "x": -6,
          "y": 1.2,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s8-col-3",
        "type": "collectible",
        "position": {
          "x": -5,
          "y": 1.2,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s8-col-4",
        "type": "collectible",
        "position": {
          "x": -7,
          "y": 1.2,
          "z": 0
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s8-goal",
        "type": "goal",
        "position": {
          "x": 0,
          "y": 0.8,
          "z": -20.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      }
    ]
  },

  9: {
    id: "world-01-level-03-stage-09",
    world: 1,
    level: 3,
    stage: 9,
    name: "Padel",
    theme: "countryside",
    musicTrack: "jungle_groove",
    timeLimit: 60,
    spawn: { x: 0.0, y: 1.5, z: 8.5 },
    objects: [
      // PISTA DE PÁDEL: Suelo azul oficial de césped sintético
      {
        id: "s9-plat-court",
        type: "platform",
        position: { x: 0, y: 0.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 11.0, y: 0.8, z: 22.0 },
        properties: { theme: "custom_color", customColor: "#1565c0" }
      },

      // LÍNEAS BLANCAS REGLAMENTARIAS DE LA PISTA
      // Línea de saque Campo A (Z = 4.5)
      {
        id: "s9-line-service-a",
        type: "platform",
        position: { x: 0, y: 0.41, z: 4.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.02, z: 0.12 },
        properties: { theme: "custom_color", customColor: "#ffffff" }
      },
      // Línea de saque Campo B (Z = -4.5)
      {
        id: "s9-line-service-b",
        type: "platform",
        position: { x: 0, y: 0.41, z: -4.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.0, y: 0.02, z: 0.12 },
        properties: { theme: "custom_color", customColor: "#ffffff" }
      },
      // Línea central perpendicular de saque
      {
        id: "s9-line-center-b",
        type: "platform",
        position: { x: 0, y: 0.41, z: -2.25 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.12, y: 0.02, z: 4.5 },
        properties: { theme: "custom_color", customColor: "#ffffff" }
      },

      // MUROS DE CRISTAL Y VALLAS DE PÁDEL
      // Muro de cristal fondo propio (Z = 11.0)
      {
        id: "s9-glass-back-a",
        type: "platform",
        position: { x: 0, y: 1.8, z: 10.9 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 11.0, y: 2.8, z: 0.2 },
        properties: { theme: "custom_color", customColor: "#80deea" }
      },
      // Muro de cristal fondo rival (Z = -11.0)
      {
        id: "s9-glass-back-b",
        type: "platform",
        position: { x: 0, y: 1.8, z: -10.9 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 11.0, y: 2.8, z: 0.2 },
        properties: { theme: "custom_color", customColor: "#80deea" }
      },
      // Valla lateral izquierda
      {
        id: "s9-fence-l",
        type: "platform",
        position: { x: -5.4, y: 1.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.2, y: 2.8, z: 22.0 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },
      // Valla lateral derecha
      {
        id: "s9-fence-r",
        type: "platform",
        position: { x: 5.4, y: 1.8, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.2, y: 2.8, z: 22.0 },
        properties: { theme: "custom_color", customColor: "#37474f" }
      },

      // RED CENTRAL DE PÁDEL (Z = 0.0, Altura 2.2m que bloquea el paso por abajo)
      // Poste izquierdo de la red
      {
        id: "s9-net-post-l",
        type: "platform",
        position: { x: -5.2, y: 1.4, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.3, y: 2.2, z: 0.3 },
        properties: { theme: "custom_color", customColor: "#ffffff" }
      },
      // Poste derecho de la red
      {
        id: "s9-net-post-r",
        type: "platform",
        position: { x: 5.2, y: 1.4, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 0.3, y: 2.2, z: 0.3 },
        properties: { theme: "custom_color", customColor: "#ffffff" }
      },
      // Malla de la red de pádel
      {
        id: "s9-net-mesh",
        type: "platform",
        position: { x: 0, y: 1.1, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.6, y: 1.6, z: 0.2 },
        properties: { theme: "custom_color", customColor: "#eceff1" }
      },
      // Cinta blanca superior de la red
      {
        id: "s9-net-toptape",
        type: "platform",
        position: { x: 0, y: 2.0, z: 0.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 10.6, y: 0.2, z: 0.25 },
        properties: { theme: "custom_color", customColor: "#ffffff" }
      },

      // LA PALA DE PÁDEL GIGANTE CATAPULTA (Empieza horizontal en el suelo, te rebaña y se pone casi vertical catapultándote)
      {
        id: "s9-giant-padel-racket",
        type: "moving-platform",
        position: { x: 0.0, y: 0.42, z: 4.8 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3.8, y: 0.20, z: 4.2 },
        properties: {
          isMoving: true,
          variant: "padel_racket",
          movementType: "padel_racket",
          customColor: "#00e5ff"
        }
      },

      // Farolas / Focos de pádel del estadio
      {
        id: "s9-lamp-1",
        type: "decoration",
        position: { x: -6.0, y: 0.4, z: 8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s9-lamp-2",
        type: "decoration",
        position: { x: 6.0, y: 0.4, z: 8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s9-lamp-3",
        type: "decoration",
        position: { x: -6.0, y: 0.4, z: -8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },
      {
        id: "s9-lamp-4",
        type: "decoration",
        position: { x: 6.0, y: 0.4, z: -8.0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        properties: { subType: "lantern" }
      },

      // Coleccionables (uno al inicio, uno sobre la pala en reposo, uno en el aire sobre la red al volar, uno en la recepción de la meta)
      { id: "s9-col-1", type: "collectible", position: { x: 0.0, y: 1.2, z: 7.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s9-col-2", type: "collectible", position: { x: 0.0, y: 1.0, z: 2.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s9-col-3", type: "collectible", position: { x: 0.0, y: 4.8, z: -1.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      { id: "s9-col-4", type: "collectible", position: { x: 0.0, y: 1.2, z: -5.5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },

      // Meta al otro lado de la red en el Campo B
      {
        id: "s9-goal",
        type: "goal",
        position: { x: 0, y: 0.8, z: -7.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ETAPA 10: Dana
  // ---------------------------------------------------------------------------
  10: {
    "id": "world-01-level-03-stage-10",
    "world": 1,
    "level": 3,
    "stage": 10,
    "name": "Dana",
    "theme": "countryside",
    "musicTrack": "jungle_groove",
    "timeLimit": 60,
    "spawn": {
      "x": 0,
      "y": 25.5,
      "z": 38
    },
    "objects": [
      {
        "id": "s10-plat-start",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 24,
          "z": 38
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 9,
          "y": 0.8,
          "z": 8
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#455a64"
        }
      },
      {
        "id": "s10-curb-start-b",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 24.6,
          "z": 41.8
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 9,
          "y": 0.5,
          "z": 0.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#263238"
        }
      },
      {
        "id": "s10-curb-start-l",
        "type": "platform",
        "position": {
          "x": -4.3,
          "y": 24.6,
          "z": 38
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.5,
          "y": 0.5,
          "z": 8
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#263238"
        }
      },
      {
        "id": "s10-curb-start-r",
        "type": "platform",
        "position": {
          "x": 4.3,
          "y": 24.6,
          "z": 38
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.5,
          "y": 0.5,
          "z": 8
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#263238"
        }
      },
      {
        "id": "s10-water-1",
        "type": "water",
        "position": {
          "x": 0,
          "y": 22,
          "z": 31.5
        },
        "rotation": {
          "x": -0.25,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6.5,
          "y": 0.8,
          "z": 6
        }
      },
      {
        "id": "s10-bank-1l",
        "type": "platform",
        "position": {
          "x": -3.7,
          "y": 22.5,
          "z": 31.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-bank-1r",
        "type": "platform",
        "position": {
          "x": 3.7,
          "y": 22.5,
          "z": 31.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-water-2",
        "type": "water",
        "position": {
          "x": 0.8,
          "y": 20,
          "z": 25
        },
        "rotation": {
          "x": -0.25,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6.5,
          "y": 0.8,
          "z": 6
        }
      },
      {
        "id": "s10-bank-2l",
        "type": "platform",
        "position": {
          "x": -2.9,
          "y": 20.5,
          "z": 25
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-bank-2r",
        "type": "platform",
        "position": {
          "x": 4.5,
          "y": 20.5,
          "z": 25
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-log-1",
        "type": "platform",
        "position": {
          "x": 1,
          "y": 20.8,
          "z": 25
        },
        "rotation": {
          "x": 0,
          "y": 0.35,
          "z": 0
        },
        "scale": {
          "x": 3.8,
          "y": 0.6,
          "z": 0.8
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#4e342e"
        }
      },
      {
        "id": "s10-water-3",
        "type": "water",
        "position": {
          "x": -0.8,
          "y": 18,
          "z": 18.5
        },
        "rotation": {
          "x": -0.25,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6.5,
          "y": 0.8,
          "z": 6
        }
      },
      {
        "id": "s10-bank-3l",
        "type": "platform",
        "position": {
          "x": -4.5,
          "y": 18.5,
          "z": 18.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-bank-3r",
        "type": "platform",
        "position": {
          "x": 2.9,
          "y": 18.5,
          "z": 18.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-col-1",
        "type": "collectible",
        "position": {
          "x": -2.5,
          "y": 19.2,
          "z": 18.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s10-water-4",
        "type": "water",
        "position": {
          "x": 0,
          "y": 16,
          "z": 12
        },
        "rotation": {
          "x": -0.25,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6.5,
          "y": 0.8,
          "z": 6
        }
      },
      {
        "id": "s10-bank-4l",
        "type": "platform",
        "position": {
          "x": -3.7,
          "y": 16.5,
          "z": 12
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-bank-4r",
        "type": "platform",
        "position": {
          "x": 3.7,
          "y": 16.5,
          "z": 12
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-debris-1",
        "type": "bumper",
        "position": {
          "x": -1,
          "y": 16.8,
          "z": 12
        },
        "rotation": {
          "x": 0.1,
          "y": 0.4,
          "z": 0
        },
        "scale": {
          "x": 3,
          "y": 1.4,
          "z": 3
        },
        "properties": {
          "color": "#78909c",
          "bounce": 1.35
        }
      },
      {
        "id": "s10-water-5",
        "type": "water",
        "position": {
          "x": 1.2,
          "y": 14,
          "z": 5.5
        },
        "rotation": {
          "x": -0.25,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6.5,
          "y": 0.8,
          "z": 6
        }
      },
      {
        "id": "s10-bank-5l",
        "type": "platform",
        "position": {
          "x": -2.5,
          "y": 14.5,
          "z": 5.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-bank-5r",
        "type": "platform",
        "position": {
          "x": 4.9,
          "y": 14.5,
          "z": 5.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-col-2",
        "type": "collectible",
        "position": {
          "x": 2.6,
          "y": 15.2,
          "z": 5.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s10-water-6",
        "type": "water",
        "position": {
          "x": 0,
          "y": 12,
          "z": -1
        },
        "rotation": {
          "x": -0.25,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6.5,
          "y": 0.8,
          "z": 6
        }
      },
      {
        "id": "s10-bank-6l",
        "type": "platform",
        "position": {
          "x": -3.7,
          "y": 12.5,
          "z": -1
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-bank-6r",
        "type": "platform",
        "position": {
          "x": 3.7,
          "y": 12.5,
          "z": -1
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-debris-2",
        "type": "bumper",
        "position": {
          "x": 0.8,
          "y": 12.8,
          "z": -1
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 3,
          "y": 1.4,
          "z": 3
        },
        "properties": {
          "color": "#37474f",
          "bounce": 1.35
        }
      },
      {
        "id": "s10-water-7",
        "type": "water",
        "position": {
          "x": -1,
          "y": 10,
          "z": -7.5
        },
        "rotation": {
          "x": -0.25,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6.5,
          "y": 0.8,
          "z": 6
        }
      },
      {
        "id": "s10-bank-7l",
        "type": "platform",
        "position": {
          "x": -4.7,
          "y": 10.5,
          "z": -7.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-bank-7r",
        "type": "platform",
        "position": {
          "x": 2.7,
          "y": 10.5,
          "z": -7.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-log-2",
        "type": "platform",
        "position": {
          "x": -1.2,
          "y": 10.8,
          "z": -7.5
        },
        "rotation": {
          "x": 0,
          "y": -0.4,
          "z": 0
        },
        "scale": {
          "x": 3.8,
          "y": 0.6,
          "z": 0.8
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#4e342e"
        }
      },
      {
        "id": "s10-col-3",
        "type": "collectible",
        "position": {
          "x": 1.5,
          "y": 11.2,
          "z": -7.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s10-water-8",
        "type": "water",
        "position": {
          "x": 0,
          "y": 8,
          "z": -14
        },
        "rotation": {
          "x": -0.25,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6.5,
          "y": 0.8,
          "z": 6
        }
      },
      {
        "id": "s10-bank-8l",
        "type": "platform",
        "position": {
          "x": -3.7,
          "y": 8.5,
          "z": -14
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-bank-8r",
        "type": "platform",
        "position": {
          "x": 3.7,
          "y": 8.5,
          "z": -14
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-debris-3",
        "type": "bumper",
        "position": {
          "x": -0.8,
          "y": 8.8,
          "z": -14
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 4,
          "y": 1.4,
          "z": 4
        },
        "properties": {
          "color": "#e53935",
          "bounce": 1.35
        }
      },
      {
        "id": "s10-water-9",
        "type": "water",
        "position": {
          "x": 1,
          "y": 6,
          "z": -20.5
        },
        "rotation": {
          "x": -0.25,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6.5,
          "y": 0.8,
          "z": 6
        }
      },
      {
        "id": "s10-bank-9l",
        "type": "platform",
        "position": {
          "x": -2.7,
          "y": 6.5,
          "z": -20.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-bank-9r",
        "type": "platform",
        "position": {
          "x": 4.7,
          "y": 6.5,
          "z": -20.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-col-4",
        "type": "collectible",
        "position": {
          "x": 2.2,
          "y": 7.2,
          "z": -20.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s10-water-10",
        "type": "water",
        "position": {
          "x": -0.8,
          "y": 4,
          "z": -27
        },
        "rotation": {
          "x": -0.25,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 6.5,
          "y": 0.8,
          "z": 6
        }
      },
      {
        "id": "s10-bank-10l",
        "type": "platform",
        "position": {
          "x": -4.5,
          "y": 4.5,
          "z": -27
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-bank-10r",
        "type": "platform",
        "position": {
          "x": 2.9,
          "y": 4.5,
          "z": -27
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-debris-4",
        "type": "bumper",
        "position": {
          "x": -0.5,
          "y": 4.8,
          "z": -27
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 3,
          "y": 1.4,
          "z": 3
        },
        "properties": {
          "color": "#546e7a",
          "bounce": 1.35
        }
      },
      {
        "id": "s10-water-11",
        "type": "water",
        "position": {
          "x": 0,
          "y": 2,
          "z": -33.5
        },
        "rotation": {
          "x": -0.25,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 7.5,
          "y": 0.8,
          "z": 6
        }
      },
      {
        "id": "s10-bank-11l",
        "type": "platform",
        "position": {
          "x": -4.2,
          "y": 2.5,
          "z": -33.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-bank-11r",
        "type": "platform",
        "position": {
          "x": 4.2,
          "y": 2.5,
          "z": -33.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 6
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-col-5",
        "type": "collectible",
        "position": {
          "x": 0,
          "y": 3.2,
          "z": -33.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      },
      {
        "id": "s10-water-12",
        "type": "water",
        "position": {
          "x": 0,
          "y": -0.9,
          "z": -40
        },
        "rotation": {
          "x": 0.25,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 10,
          "y": 0.8,
          "z": 7
        }
      },
      {
        "id": "s10-bank-12l",
        "type": "platform",
        "position": {
          "x": -5.4,
          "y": 0.5,
          "z": -40
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 7
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-bank-12r",
        "type": "platform",
        "position": {
          "x": 5.4,
          "y": 0.5,
          "z": -40
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.8,
          "y": 0.8,
          "z": 7
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#37474f"
        }
      },
      {
        "id": "s10-plat-rescue",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0,
          "z": -47
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 10,
          "y": 0.8,
          "z": 7
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#b0bec5"
        }
      },
      {
        "id": "s10-curb-res-b",
        "type": "platform",
        "position": {
          "x": 0,
          "y": 0.6,
          "z": -50.8
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 10,
          "y": 0.6,
          "z": 0.5
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#e53935"
        }
      },
      {
        "id": "s10-curb-res-l",
        "type": "platform",
        "position": {
          "x": -4.8,
          "y": 0.6,
          "z": -47
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.5,
          "y": 0.6,
          "z": 7
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#e53935"
        }
      },
      {
        "id": "s10-curb-res-r",
        "type": "platform",
        "position": {
          "x": 4.8,
          "y": 0.6,
          "z": -47
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 0.5,
          "y": 0.6,
          "z": 7
        },
        "properties": {
          "theme": "custom_color",
          "customColor": "#e53935"
        }
      },
      {
        "id": "s10-lamp-1",
        "type": "decoration",
        "position": {
          "x": -4,
          "y": 0.4,
          "z": -48
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s10-lamp-2",
        "type": "decoration",
        "position": {
          "x": 4,
          "y": 0.4,
          "z": -48
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        },
        "properties": {
          "subType": "lantern"
        }
      },
      {
        "id": "s10-goal",
        "type": "goal",
        "position": {
          "x": 0,
          "y": 0.8,
          "z": -47.5
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "scale": {
          "x": 1,
          "y": 1,
          "z": 1
        }
      }
    ]
  },

};

registerStageSet(1,3,WORLD_01_LEVEL_03_STAGES);

