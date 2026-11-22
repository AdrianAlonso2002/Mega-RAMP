import {registerStageSet} from '../StageRegistry';
import type { LevelData } from "../LevelTypes";

export const WORLD_01_LEVEL_01_STAGES: Record<number, LevelData> = {
  1: {
  "id": "world-01-level-01-stage-01",
  "world": 1,
  "level": 1,
  "stage": 1,
  "name": "Cuadrado1",
  "theme": "countryside",
  "musicTrack": "jungle_groove",
  "timeLimit": 60,
  "spawn": {
    "x": 0,
    "y": 1.5,
    "z": 5.2
  },
  "objects": [
    {
      "id": "platform-100",
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
        "x": 14,
        "y": 0.8,
        "z": 14
      }
    },
    {
      "id": "platform-101",
      "type": "platform",
      "position": {
        "x": -6.7,
        "y": 0.4,
        "z": 0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.6,
        "y": 0.8,
        "z": 14
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#8d6e63"
      }
    },
    {
      "id": "decoration-102",
      "type": "decoration",
      "position": {
        "x": -6.7,
        "y": 0.8,
        "z": -4
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-103",
      "type": "decoration",
      "position": {
        "x": -6.7,
        "y": 0.8,
        "z": 0
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-104",
      "type": "decoration",
      "position": {
        "x": -6.7,
        "y": 0.8,
        "z": 4
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
        "subType": "fence"
      }
    },
    {
      "id": "platform-105",
      "type": "platform",
      "position": {
        "x": 6.7,
        "y": 0.4,
        "z": 0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.6,
        "y": 0.8,
        "z": 14
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#8d6e63"
      }
    },
    {
      "id": "decoration-106",
      "type": "decoration",
      "position": {
        "x": 6.7,
        "y": 0.8,
        "z": -4
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-107",
      "type": "decoration",
      "position": {
        "x": 6.7,
        "y": 0.8,
        "z": 0
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-108",
      "type": "decoration",
      "position": {
        "x": 6.7,
        "y": 0.8,
        "z": 4
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
        "subType": "fence"
      }
    },
    {
      "id": "platform-109",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 0.4,
        "z": 6.7
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 14,
        "y": 0.8,
        "z": 0.6
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#8d6e63"
      }
    },
    {
      "id": "decoration-110",
      "type": "decoration",
      "position": {
        "x": -3.5,
        "y": 0.8,
        "z": 6.7
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-111",
      "type": "decoration",
      "position": {
        "x": 3.5,
        "y": 0.8,
        "z": 6.7
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
        "subType": "fence"
      }
    },
    {
      "id": "platform-112",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 0.4,
        "z": -6.7
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 14,
        "y": 0.8,
        "z": 0.6
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#8d6e63"
      }
    },
    {
      "id": "decoration-113",
      "type": "decoration",
      "position": {
        "x": -3.5,
        "y": 0.8,
        "z": -6.7
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-114",
      "type": "decoration",
      "position": {
        "x": 3.5,
        "y": 0.8,
        "z": -6.7
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-115",
      "type": "decoration",
      "position": {
        "x": -5.4,
        "y": 0.4,
        "z": 5.4
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
      "id": "decoration-116",
      "type": "decoration",
      "position": {
        "x": 5.4,
        "y": 0.4,
        "z": 5.4
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
      "id": "decoration-117",
      "type": "decoration",
      "position": {
        "x": -5.4,
        "y": 0.4,
        "z": -5.4
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
      "id": "decoration-118",
      "type": "decoration",
      "position": {
        "x": 5.4,
        "y": 0.4,
        "z": -5.4
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
      "id": "decoration-119",
      "type": "decoration",
      "position": {
        "x": -5.2,
        "y": 0.4,
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
      },
      "properties": {
        "subType": "flower"
      }
    },
    {
      "id": "decoration-120",
      "type": "decoration",
      "position": {
        "x": 5.2,
        "y": 0.4,
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
      },
      "properties": {
        "subType": "flower"
      }
    },
    {
      "id": "decoration-121",
      "type": "decoration",
      "position": {
        "x": -5.2,
        "y": 0.4,
        "z": -3
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
        "subType": "bush"
      }
    },
    {
      "id": "decoration-122",
      "type": "decoration",
      "position": {
        "x": 5.2,
        "y": 0.4,
        "z": -3
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
        "subType": "bush"
      }
    },
    {
      "id": "decoration-123",
      "type": "decoration",
      "position": {
        "x": -5.2,
        "y": 0.4,
        "z": 0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.9,
        "y": 0.9,
        "z": 0.9
      },
      "properties": {
        "subType": "tree"
      }
    },
    {
      "id": "decoration-124",
      "type": "decoration",
      "position": {
        "x": 5.2,
        "y": 0.4,
        "z": 0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.9,
        "y": 0.9,
        "z": 0.9
      },
      "properties": {
        "subType": "tree"
      }
    },
    {
      "id": "decoration-125",
      "type": "decoration",
      "position": {
        "x": 6.5,
        "y": 0.8,
        "z": 1.8
      },
      "rotation": {
        "x": 0,
        "y": -1.2,
        "z": 0
      },
      "scale": {
        "x": 1,
        "y": 1,
        "z": 1
      },
      "properties": {
        "subType": "bird",
        "variant": "canary"
      }
    },
    {
      "id": "collectible-126",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 1.2,
        "z": 2.6
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
      "id": "collectible-127",
      "type": "collectible",
      "position": {
        "x": 0,
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
      "id": "collectible-128",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 1.2,
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
      "id": "goal-129",
      "type": "goal",
      "position": {
        "x": 0,
        "y": 0.4,
        "z": -5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 3.2,
        "y": 3.4,
        "z": 0.6
      }
    }
  ]
},
  2: {
  "id": "world-01-level-01-stage-02",
  "world": 1,
  "level": 1,
  "stage": 2,
  "name": "Piscina",
  "theme": "countryside",
  "musicTrack": "jungle_groove",
  "timeLimit": 60,
  "spawn": {
    "x": 0,
    "y": 2.2,
    "z": 7
  },
  "objects": [
    {
      "id": "platform-200",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 0.8,
        "z": 7
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
      }
    },
    {
      "id": "decoration-201",
      "type": "decoration",
      "position": {
        "x": -3.2,
        "y": 1.2,
        "z": 9.2
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
      "id": "decoration-202",
      "type": "decoration",
      "position": {
        "x": 3.2,
        "y": 1.2,
        "z": 9.2
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
      "id": "decoration-203",
      "type": "decoration",
      "position": {
        "x": 0,
        "y": 1.2,
        "z": 9.6
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
        "subType": "fence"
      }
    },
    {
      "id": "platform-204",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 0.4,
        "z": 3
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 6,
        "y": 0.4,
        "z": 2
      }
    },
    {
      "id": "platform-205",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 0,
        "z": 1
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 6,
        "y": 0.4,
        "z": 2
      }
    },
    {
      "id": "platform-206",
      "type": "platform",
      "position": {
        "x": 0,
        "y": -0.4,
        "z": -4
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 9,
        "y": 0.4,
        "z": 8
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#b2ebf2"
      }
    },
    {
      "id": "platform-207",
      "type": "platform",
      "position": {
        "x": -4.8,
        "y": 0.4,
        "z": -4
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.6,
        "y": 1.2,
        "z": 8
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#00838f"
      }
    },
    {
      "id": "water-208",
      "type": "water",
      "position": {
        "x": 0,
        "y": 0.1,
        "z": -4
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 8.8,
        "y": 0.6,
        "z": 7.8
      }
    },
    {
      "id": "platform-209",
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
        "x": 6,
        "y": 0.4,
        "z": 2
      }
    },
    {
      "id": "platform-210",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 0.4,
        "z": -11
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 6,
        "y": 0.4,
        "z": 2
      }
    },
    {
      "id": "platform-211",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 0.8,
        "z": -15
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
      }
    },
    {
      "id": "decoration-212",
      "type": "decoration",
      "position": {
        "x": -3.2,
        "y": 1.2,
        "z": -17.2
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
      "id": "decoration-213",
      "type": "decoration",
      "position": {
        "x": 3.2,
        "y": 1.2,
        "z": -17.2
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
      "id": "decoration-214",
      "type": "decoration",
      "position": {
        "x": 0,
        "y": 1.2,
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
      },
      "properties": {
        "subType": "fence"
      }
    },
    {
      "id": "goal-215",
      "type": "goal",
      "position": {
        "x": 0,
        "y": 1.2,
        "z": -15
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 3.2,
        "y": 3.4,
        "z": 0.6
      }
    },
    {
      "id": "platform-216",
      "type": "platform",
      "position": {
        "x": 7.5,
        "y": 0.8,
        "z": -4
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 6,
        "y": 0.8,
        "z": 14
      },
      "properties": {
        "theme": "villamanta"
      }
    },
    {
      "id": "decoration-217",
      "type": "decoration",
      "position": {
        "x": 9.2,
        "y": 1.2,
        "z": -8
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.1,
        "y": 1.1,
        "z": 1.1
      },
      "properties": {
        "subType": "tree"
      }
    },
    {
      "id": "decoration-218",
      "type": "decoration",
      "position": {
        "x": 9.2,
        "y": 1.2,
        "z": 0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.1,
        "y": 1.1,
        "z": 1.1
      },
      "properties": {
        "subType": "tree"
      }
    },
    {
      "id": "decoration-220",
      "type": "decoration",
      "position": {
        "x": 8.5,
        "y": 1.2,
        "z": -4
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
      "id": "decoration-221",
      "type": "decoration",
      "position": {
        "x": 6.8,
        "y": 1.2,
        "z": 1.5
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
      "id": "decoration-222",
      "type": "decoration",
      "position": {
        "x": 6.8,
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
      },
      "properties": {
        "subType": "flower"
      }
    },
    {
      "id": "decoration-223",
      "type": "decoration",
      "position": {
        "x": 9.5,
        "y": 1.2,
        "z": -4
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-224",
      "type": "decoration",
      "position": {
        "x": 8.8,
        "y": 1.2,
        "z": -2.5
      },
      "rotation": {
        "x": 0,
        "y": -0.8,
        "z": 0
      },
      "scale": {
        "x": 1,
        "y": 1,
        "z": 1
      },
      "properties": {
        "subType": "bird",
        "variant": "bluebird"
      }
    },
    {
      "id": "collectible-226",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 1,
        "z": -4
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
      "id": "collectible-227",
      "type": "collectible",
      "position": {
        "x": 7.5,
        "y": 2,
        "z": -4
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
      "id": "collectible-228",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 2,
        "z": -13
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
  3: {
  "id": "world-01-level-01-stage-03",
  "world": 1,
  "level": 1,
  "stage": 3,
  "name": "Guitarra",
  "theme": "countryside",
  "musicTrack": "jungle_groove",
  "timeLimit": 60,
  "spawn": {
    "x": 0,
    "y": 1.5,
    "z": 12
  },
  "objects": [
    {
      "id": "platform-300",
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
        "x": 11,
        "y": 0.8,
        "z": 8
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#1f1f1f",
        "color": "#1f1f1f"
      }
    },
    {
      "id": "platform-301",
      "type": "platform",
      "position": {
        "x": 1.5,
        "y": 0,
        "z": 3
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 2,
        "y": 0.8,
        "z": 6
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#a1887f"
      }
    },
    {
      "id": "platform-302",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 0,
        "z": -4
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
        "customColor": "#171717",
        "color": "#171717"
      }
    },
    {
      "id": "platform-303",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 0.2,
        "z": -1
      },
      "rotation": {
        "x": 0,
        "y": 0.785,
        "z": 0
      },
      "scale": {
        "x": 6,
        "y": 0.8,
        "z": 6
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#5d4037"
      }
    },
    {
      "id": "platform-304",
      "type": "platform",
      "position": {
        "x": 0.75,
        "y": 0,
        "z": -16
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.5,
        "y": 0.8,
        "z": 16
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#8d6e63"
      }
    },
    {
      "id": "decoration-305",
      "type": "decoration",
      "position": {
        "x": -1.6,
        "y": 0.4,
        "z": -12
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-306",
      "type": "decoration",
      "position": {
        "x": 1.6,
        "y": 0.4,
        "z": -12
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-307",
      "type": "decoration",
      "position": {
        "x": -1.6,
        "y": 0.4,
        "z": -18
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-308",
      "type": "decoration",
      "position": {
        "x": 1.6,
        "y": 0.4,
        "z": -18
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
        "subType": "fence"
      }
    },
    {
      "id": "platform-309",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 0,
        "z": -26.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 5,
        "y": 0.8,
        "z": 5
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#5d4037"
      }
    },
    {
      "id": "decoration-310",
      "type": "decoration",
      "position": {
        "x": -2.4,
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
      "id": "decoration-311",
      "type": "decoration",
      "position": {
        "x": 2.4,
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
      "id": "decoration-312",
      "type": "decoration",
      "position": {
        "x": -2.4,
        "y": 0.4,
        "z": -28
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
      "id": "decoration-313",
      "type": "decoration",
      "position": {
        "x": 2.4,
        "y": 0.4,
        "z": -28
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
      "id": "decoration-314",
      "type": "decoration",
      "position": {
        "x": 0,
        "y": 0.4,
        "z": -28.6
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-315",
      "type": "decoration",
      "position": {
        "x": 2.1,
        "y": 0.4,
        "z": -26.5
      },
      "rotation": {
        "x": 0,
        "y": -0.6,
        "z": 0
      },
      "scale": {
        "x": 1,
        "y": 1,
        "z": 1
      },
      "properties": {
        "subType": "bird",
        "variant": "robin"
      }
    },
    {
      "id": "decoration-316",
      "type": "decoration",
      "position": {
        "x": -4.8,
        "y": 0.4,
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
      },
      "properties": {
        "subType": "flower"
      }
    },
    {
      "id": "decoration-317",
      "type": "decoration",
      "position": {
        "x": 4.8,
        "y": 0.4,
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
      },
      "properties": {
        "subType": "flower"
      }
    },
    {
      "id": "decoration-318",
      "type": "decoration",
      "position": {
        "x": -4,
        "y": 0.4,
        "z": -4
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
        "subType": "bush"
      }
    },
    {
      "id": "decoration-319",
      "type": "decoration",
      "position": {
        "x": 4,
        "y": 0.4,
        "z": -4
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
        "subType": "bush"
      }
    },
    {
      "id": "goal-320",
      "type": "goal",
      "position": {
        "x": 0,
        "y": 0.4,
        "z": -26.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 3.2,
        "y": 3.4,
        "z": 0.6
      }
    },
    {
      "id": "collectible-322",
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
      "id": "collectible-323",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 1.2,
        "z": -1
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
      "id": "collectible-324",
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
      "id": "collectible-325",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 1.2,
        "z": -18
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
      "id": "obj-custom-1792506108090",
      "type": "platform",
      "position": {
        "x": -1.5,
        "y": 0,
        "z": 3
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 2,
        "y": 0.8,
        "z": 6
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#a1887f"
      }
    },
    {
      "id": "obj-custom-1792506139109",
      "type": "platform",
      "position": {
        "x": 4.5,
        "y": 0,
        "z": 3
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.5,
        "y": 0.8,
        "z": 6
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#a1887f"
      }
    },
    {
      "id": "obj-custom-1792506155494",
      "type": "platform",
      "position": {
        "x": -4.5,
        "y": 0,
        "z": 3
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.5,
        "y": 0.8,
        "z": 6
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#a1887f"
      }
    },
    {
      "id": "obj-custom-1792506231360",
      "type": "platform",
      "position": {
        "x": -0.75,
        "y": 0,
        "z": -16
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.5,
        "y": 0.8,
        "z": 16
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#8d6e63"
      }
    },
    {
      "id": "obj-custom-1792506245016",
      "type": "platform",
      "position": {
        "x": -1.75,
        "y": 0,
        "z": -16
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.5,
        "y": 0.8,
        "z": 16
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#8d6e63"
      }
    },
    {
      "id": "obj-custom-1792506258304",
      "type": "platform",
      "position": {
        "x": 1.75,
        "y": 0,
        "z": -16
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.5,
        "y": 0.8,
        "z": 16
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#8d6e63"
      }
    }
  ]
},
  4: {
  "id": "world-01-level-01-stage-04",
  "world": 1,
  "level": 1,
  "stage": 4,
  "name": "Río",
  "theme": "countryside",
  "musicTrack": "jungle_groove",
  "timeLimit": 60,
  "spawn": {
    "x": 6,
    "y": 1.5,
    "z": 12
  },
  "objects": [
    {
      "id": "water-400",
      "type": "water",
      "position": {
        "x": 0,
        "y": -1.2,
        "z": -2
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 22,
        "y": 0.8,
        "z": 38
      }
    },
    {
      "id": "platform-401",
      "type": "platform",
      "position": {
        "x": 6,
        "y": 0,
        "z": 12
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
      }
    },
    {
      "id": "decoration-402",
      "type": "decoration",
      "position": {
        "x": 8.2,
        "y": 0.4,
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
      },
      "properties": {
        "subType": "lantern"
      }
    },
    {
      "id": "decoration-403",
      "type": "decoration",
      "position": {
        "x": 6,
        "y": 0.4,
        "z": 14.5
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-404",
      "type": "decoration",
      "position": {
        "x": 7.8,
        "y": 0.4,
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
      },
      "properties": {
        "subType": "flower"
      }
    },
    {
      "id": "platform-405",
      "type": "platform",
      "position": {
        "x": 1,
        "y": 0,
        "z": 7.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 8,
        "y": 0.8,
        "z": 4
      }
    },
    {
      "id": "decoration-406",
      "type": "decoration",
      "position": {
        "x": 1,
        "y": 0.4,
        "z": 9.2
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
        "subType": "fence"
      }
    },
    {
      "id": "platform-407",
      "type": "platform",
      "position": {
        "x": -5,
        "y": 0,
        "z": 3
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 4,
        "y": 0.8,
        "z": 7
      }
    },
    {
      "id": "decoration-408",
      "type": "decoration",
      "position": {
        "x": -6.5,
        "y": 0.4,
        "z": 3
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.1,
        "y": 1.1,
        "z": 1.1
      },
      "properties": {
        "subType": "tree"
      }
    },
    {
      "id": "decoration-409",
      "type": "decoration",
      "position": {
        "x": -6.5,
        "y": 0.4,
        "z": 6
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
        "subType": "bush"
      }
    },
    {
      "id": "decoration-410",
      "type": "decoration",
      "position": {
        "x": -6.5,
        "y": 0.4,
        "z": 0.5
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
      "id": "decoration-411",
      "type": "decoration",
      "position": {
        "x": -5.5,
        "y": 0.4,
        "z": 1.5
      },
      "rotation": {
        "x": 0,
        "y": 0.7,
        "z": 0
      },
      "scale": {
        "x": 1,
        "y": 1,
        "z": 1
      },
      "properties": {
        "subType": "bird",
        "variant": "canary"
      }
    },
    {
      "id": "platform-412",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 0,
        "z": -2
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 8,
        "y": 0.8,
        "z": 4
      }
    },
    {
      "id": "platform-413",
      "type": "platform",
      "position": {
        "x": 5,
        "y": 0,
        "z": -7.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 4,
        "y": 0.8,
        "z": 7
      }
    },
    {
      "id": "decoration-414",
      "type": "decoration",
      "position": {
        "x": 6.5,
        "y": 0.4,
        "z": -7.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.1,
        "y": 1.1,
        "z": 1.1
      },
      "properties": {
        "subType": "tree"
      }
    },
    {
      "id": "decoration-415",
      "type": "decoration",
      "position": {
        "x": 6.5,
        "y": 0.4,
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
      },
      "properties": {
        "subType": "flower"
      }
    },
    {
      "id": "decoration-416",
      "type": "decoration",
      "position": {
        "x": 6.5,
        "y": 0.4,
        "z": -10
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
      "id": "platform-417",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 0,
        "z": -13
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 8,
        "y": 0.8,
        "z": 4
      }
    },
    {
      "id": "decoration-418",
      "type": "decoration",
      "position": {
        "x": 0,
        "y": 0.4,
        "z": -14.6
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
        "subType": "fence"
      }
    },
    {
      "id": "platform-419",
      "type": "platform",
      "position": {
        "x": -6,
        "y": 0,
        "z": -17
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
      }
    },
    {
      "id": "decoration-420",
      "type": "decoration",
      "position": {
        "x": -8.2,
        "y": 0.4,
        "z": -17
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
      "id": "decoration-421",
      "type": "decoration",
      "position": {
        "x": -6,
        "y": 0.4,
        "z": -19.5
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-422",
      "type": "decoration",
      "position": {
        "x": -4.2,
        "y": 0.4,
        "z": -19
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
      "id": "decoration-423",
      "type": "decoration",
      "position": {
        "x": -7.5,
        "y": 0.4,
        "z": -15.5
      },
      "rotation": {
        "x": 0,
        "y": -0.6,
        "z": 0
      },
      "scale": {
        "x": 1,
        "y": 1,
        "z": 1
      },
      "properties": {
        "subType": "bird",
        "variant": "bluebird"
      }
    },
    {
      "id": "goal-424",
      "type": "goal",
      "position": {
        "x": -6,
        "y": 0.4,
        "z": -17
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 3.2,
        "y": 3.4,
        "z": 0.6
      }
    },
    {
      "id": "collectible-426",
      "type": "collectible",
      "position": {
        "x": 1,
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
      "id": "collectible-427",
      "type": "collectible",
      "position": {
        "x": -5,
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
      "id": "collectible-428",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 1.2,
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
      }
    },
    {
      "id": "collectible-429",
      "type": "collectible",
      "position": {
        "x": 5,
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
      "id": "collectible-430",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 1.2,
        "z": -13
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
  5: {
  "id": "world-01-level-01-stage-05",
  "world": 1,
  "level": 1,
  "stage": 5,
  "name": "Objetos1",
  "theme": "countryside",
  "musicTrack": "jungle_groove",
  "timeLimit": 60,
  "spawn": {
    "x": 0,
    "y": 1.5,
    "z": 9.5
  },
  "objects": [
    {
      "id": "platform-500",
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
        "x": 24,
        "y": 0.8,
        "z": 24
      }
    },
    {
      "id": "decoration-501",
      "type": "decoration",
      "position": {
        "x": -11.4,
        "y": 0.4,
        "z": -11.4
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
      "id": "decoration-502",
      "type": "decoration",
      "position": {
        "x": 11.4,
        "y": 0.4,
        "z": -11.4
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
      "id": "decoration-503",
      "type": "decoration",
      "position": {
        "x": -11.4,
        "y": 0.4,
        "z": 11.4
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
      "id": "decoration-504",
      "type": "decoration",
      "position": {
        "x": 11.4,
        "y": 0.4,
        "z": 11.4
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
      "id": "decoration-505",
      "type": "decoration",
      "position": {
        "x": -11.5,
        "y": 0.4,
        "z": 0
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-506",
      "type": "decoration",
      "position": {
        "x": 11.5,
        "y": 0.4,
        "z": 0
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-507",
      "type": "decoration",
      "position": {
        "x": 0,
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-508",
      "type": "decoration",
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
        "x": 1,
        "y": 1,
        "z": 1
      },
      "properties": {
        "subType": "fence"
      }
    },
    {
      "id": "decoration-509",
      "type": "decoration",
      "position": {
        "x": -9.5,
        "y": 0.4,
        "z": -9.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.1,
        "y": 1.1,
        "z": 1.1
      },
      "properties": {
        "subType": "tree"
      }
    },
    {
      "id": "decoration-510",
      "type": "decoration",
      "position": {
        "x": 9.5,
        "y": 0.4,
        "z": -9.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.1,
        "y": 1.1,
        "z": 1.1
      },
      "properties": {
        "subType": "tree"
      }
    },
    {
      "id": "decoration-511",
      "type": "decoration",
      "position": {
        "x": -9.5,
        "y": 0.4,
        "z": 9.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.1,
        "y": 1.1,
        "z": 1.1
      },
      "properties": {
        "subType": "tree"
      }
    },
    {
      "id": "decoration-512",
      "type": "decoration",
      "position": {
        "x": 9.5,
        "y": 0.4,
        "z": 9.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.1,
        "y": 1.1,
        "z": 1.1
      },
      "properties": {
        "subType": "tree"
      }
    },
    {
      "id": "decoration-513",
      "type": "decoration",
      "position": {
        "x": -9.5,
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
        "subType": "bush"
      }
    },
    {
      "id": "decoration-514",
      "type": "decoration",
      "position": {
        "x": 9.5,
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
        "subType": "bush"
      }
    },
    {
      "id": "decoration-515",
      "type": "decoration",
      "position": {
        "x": -11,
        "y": 0.4,
        "z": 3.5
      },
      "rotation": {
        "x": 0,
        "y": 0.8,
        "z": 0
      },
      "scale": {
        "x": 1,
        "y": 1,
        "z": 1
      },
      "properties": {
        "subType": "bird",
        "variant": "canary"
      }
    },
    {
      "id": "decoration-516",
      "type": "decoration",
      "position": {
        "x": 11,
        "y": 0.4,
        "z": 3.5
      },
      "rotation": {
        "x": 0,
        "y": -0.8,
        "z": 0
      },
      "scale": {
        "x": 1,
        "y": 1,
        "z": 1
      },
      "properties": {
        "subType": "bird",
        "variant": "robin"
      }
    },
    {
      "id": "collectible-517",
      "type": "collectible",
      "position": {
        "x": -6,
        "y": 1.2,
        "z": -6
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
      "id": "collectible-518",
      "type": "collectible",
      "position": {
        "x": -6,
        "y": 1.2,
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
      }
    },
    {
      "id": "collectible-519",
      "type": "collectible",
      "position": {
        "x": -6,
        "y": 1.2,
        "z": 2
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
      "id": "collectible-520",
      "type": "collectible",
      "position": {
        "x": -6,
        "y": 1.2,
        "z": 6
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
      "id": "collectible-521",
      "type": "collectible",
      "position": {
        "x": -2,
        "y": 1.2,
        "z": -6
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
      "id": "collectible-522",
      "type": "collectible",
      "position": {
        "x": -2,
        "y": 1.2,
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
      }
    },
    {
      "id": "collectible-523",
      "type": "collectible",
      "position": {
        "x": -2,
        "y": 1.2,
        "z": 2
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
      "id": "collectible-524",
      "type": "collectible",
      "position": {
        "x": -2,
        "y": 1.2,
        "z": 6
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
      "id": "collectible-525",
      "type": "collectible",
      "position": {
        "x": 2,
        "y": 1.2,
        "z": -6
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
      "id": "collectible-526",
      "type": "collectible",
      "position": {
        "x": 2,
        "y": 1.2,
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
      }
    },
    {
      "id": "collectible-527",
      "type": "collectible",
      "position": {
        "x": 2,
        "y": 1.2,
        "z": 2
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
      "id": "collectible-528",
      "type": "collectible",
      "position": {
        "x": 2,
        "y": 1.2,
        "z": 6
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
      "id": "collectible-529",
      "type": "collectible",
      "position": {
        "x": 6,
        "y": 1.2,
        "z": -6
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
      "id": "collectible-530",
      "type": "collectible",
      "position": {
        "x": 6,
        "y": 1.2,
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
      }
    },
    {
      "id": "collectible-531",
      "type": "collectible",
      "position": {
        "x": 6,
        "y": 1.2,
        "z": 2
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
      "id": "collectible-532",
      "type": "collectible",
      "position": {
        "x": 6,
        "y": 1.2,
        "z": 6
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
      "id": "goal-533",
      "type": "goal",
      "position": {
        "x": 0,
        "y": 0.4,
        "z": -9
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 3.2,
        "y": 3.4,
        "z": 0.6
      }
    }
  ]
},
  6: {
  "id": "world-01-level-01-stage-06",
  "world": 1,
  "level": 1,
  "stage": 6,
  "name": "Parque",
  "theme": "countryside",
  "musicTrack": "jungle_groove",
  "timeLimit": 60,
  "spawn": {
    "x": 0,
    "y": 1.5,
    "z": 11.5
  },
  "objects": [
    {
      "id": "platform-600",
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
        "x": 16,
        "y": 0.8,
        "z": 28
      }
    },
    {
      "id": "decoration-601",
      "type": "decoration",
      "position": {
        "x": -7.5,
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-602",
      "type": "decoration",
      "position": {
        "x": -7.5,
        "y": 0.4,
        "z": 0
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-603",
      "type": "decoration",
      "position": {
        "x": -7.5,
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-604",
      "type": "decoration",
      "position": {
        "x": 7.5,
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-605",
      "type": "decoration",
      "position": {
        "x": 7.5,
        "y": 0.4,
        "z": 0
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-606",
      "type": "decoration",
      "position": {
        "x": 7.5,
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-607",
      "type": "decoration",
      "position": {
        "x": 0,
        "y": 0.4,
        "z": 13.5
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-608",
      "type": "decoration",
      "position": {
        "x": 0,
        "y": 0.4,
        "z": -13.5
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-609",
      "type": "decoration",
      "position": {
        "x": -6.5,
        "y": 0.4,
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
      },
      "properties": {
        "subType": "lantern"
      }
    },
    {
      "id": "decoration-610",
      "type": "decoration",
      "position": {
        "x": 6.5,
        "y": 0.4,
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
      },
      "properties": {
        "subType": "lantern"
      }
    },
    {
      "id": "decoration-611",
      "type": "decoration",
      "position": {
        "x": -6.5,
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
      "id": "decoration-612",
      "type": "decoration",
      "position": {
        "x": 6.5,
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
      "id": "ramp-613",
      "type": "ramp",
      "position": {
        "x": -3.5,
        "y": 0.6,
        "z": 5
      },
      "rotation": {
        "x": -0.22,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 3.2,
        "y": 0.8,
        "z": 6
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#ff5722"
      }
    },
    {
      "id": "platform-614",
      "type": "platform",
      "position": {
        "x": -3.5,
        "y": 1.2,
        "z": 8.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 3.2,
        "y": 0.8,
        "z": 1.5
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#ffeb3b"
      }
    },
    {
      "id": "platform-615",
      "type": "platform",
      "position": {
        "x": 2.2,
        "y": 1.4,
        "z": 5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.4,
        "y": 2.8,
        "z": 0.4
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#795548"
      }
    },
    {
      "id": "platform-616",
      "type": "platform",
      "position": {
        "x": 4.8,
        "y": 1.4,
        "z": 5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.4,
        "y": 2.8,
        "z": 0.4
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#795548"
      }
    },
    {
      "id": "platform-617",
      "type": "platform",
      "position": {
        "x": 3.5,
        "y": 2.7,
        "z": 5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 3,
        "y": 0.3,
        "z": 0.4
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#f44336"
      }
    },
    {
      "id": "bumper-618",
      "type": "bumper",
      "position": {
        "x": -3,
        "y": 0.8,
        "z": -3
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.8,
        "y": 1.4,
        "z": 1.8
      },
      "properties": {
        "color": "#e91e63"
      }
    },
    {
      "id": "bumper-619",
      "type": "bumper",
      "position": {
        "x": 3,
        "y": 0.8,
        "z": -3
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.8,
        "y": 1.4,
        "z": 1.8
      },
      "properties": {
        "color": "#00bcd4"
      }
    },
    {
      "id": "decoration-620",
      "type": "decoration",
      "position": {
        "x": -6,
        "y": 0.4,
        "z": -7
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.1,
        "y": 1.1,
        "z": 1.1
      },
      "properties": {
        "subType": "tree"
      }
    },
    {
      "id": "decoration-621",
      "type": "decoration",
      "position": {
        "x": 6,
        "y": 0.4,
        "z": -7
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.1,
        "y": 1.1,
        "z": 1.1
      },
      "properties": {
        "subType": "tree"
      }
    },
    {
      "id": "decoration-622",
      "type": "decoration",
      "position": {
        "x": -5.5,
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
        "subType": "flower"
      }
    },
    {
      "id": "decoration-623",
      "type": "decoration",
      "position": {
        "x": 5.5,
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
        "subType": "flower"
      }
    },
    {
      "id": "decoration-624",
      "type": "decoration",
      "position": {
        "x": -7.2,
        "y": 0.4,
        "z": 4
      },
      "rotation": {
        "x": 0,
        "y": 0.6,
        "z": 0
      },
      "scale": {
        "x": 1,
        "y": 1,
        "z": 1
      },
      "properties": {
        "subType": "bird",
        "variant": "canary"
      }
    },
    {
      "id": "goal-625",
      "type": "goal",
      "position": {
        "x": 0,
        "y": 0.4,
        "z": -11
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 3.2,
        "y": 3.4,
        "z": 0.6
      }
    },
    {
      "id": "collectible-627",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 1.2,
        "z": 1
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
      "id": "collectible-628",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 1.2,
        "z": -6
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
      "id": "collectible-629",
      "type": "collectible",
      "position": {
        "x": -3.5,
        "y": 1.8,
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
    }
  ]
},
  7: {
  "id": "world-01-level-01-stage-07",
  "world": 1,
  "level": 1,
  "stage": 7,
  "name": "Toros",
  "theme": "countryside",
  "musicTrack": "jungle_groove",
  "timeLimit": 60,
  "spawn": {
    "x": 0,
    "y": 1.5,
    "z": 20
  },
  "objects": [
    {
      "id": "platform-700",
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
        "x": 9.5,
        "y": 0.8,
        "z": 46
      }
    },
    {
      "id": "decoration-701",
      "type": "decoration",
      "position": {
        "x": -4.5,
        "y": 0.4,
        "z": -20
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-702",
      "type": "decoration",
      "position": {
        "x": 4.5,
        "y": 0.4,
        "z": -20
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-703",
      "type": "decoration",
      "position": {
        "x": -4.5,
        "y": 0.4,
        "z": -15
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-704",
      "type": "decoration",
      "position": {
        "x": 4.5,
        "y": 0.4,
        "z": -15
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-705",
      "type": "decoration",
      "position": {
        "x": -4.5,
        "y": 0.4,
        "z": -10
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-706",
      "type": "decoration",
      "position": {
        "x": 4.5,
        "y": 0.4,
        "z": -10
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-707",
      "type": "decoration",
      "position": {
        "x": -4.5,
        "y": 0.4,
        "z": -5
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-708",
      "type": "decoration",
      "position": {
        "x": 4.5,
        "y": 0.4,
        "z": -5
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-709",
      "type": "decoration",
      "position": {
        "x": -4.5,
        "y": 0.4,
        "z": 0
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-710",
      "type": "decoration",
      "position": {
        "x": 4.5,
        "y": 0.4,
        "z": 0
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-711",
      "type": "decoration",
      "position": {
        "x": -4.5,
        "y": 0.4,
        "z": 5
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-712",
      "type": "decoration",
      "position": {
        "x": 4.5,
        "y": 0.4,
        "z": 5
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-713",
      "type": "decoration",
      "position": {
        "x": -4.5,
        "y": 0.4,
        "z": 10
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-714",
      "type": "decoration",
      "position": {
        "x": 4.5,
        "y": 0.4,
        "z": 10
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-715",
      "type": "decoration",
      "position": {
        "x": -4.5,
        "y": 0.4,
        "z": 15
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-716",
      "type": "decoration",
      "position": {
        "x": 4.5,
        "y": 0.4,
        "z": 15
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-717",
      "type": "decoration",
      "position": {
        "x": -4.5,
        "y": 0.4,
        "z": 20
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-718",
      "type": "decoration",
      "position": {
        "x": 4.5,
        "y": 0.4,
        "z": 20
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-719",
      "type": "decoration",
      "position": {
        "x": -4.2,
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
      "id": "decoration-720",
      "type": "decoration",
      "position": {
        "x": 4.2,
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
      "id": "decoration-721",
      "type": "decoration",
      "position": {
        "x": -4.2,
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
      "id": "decoration-722",
      "type": "decoration",
      "position": {
        "x": 4.2,
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
      "id": "bumper-723",
      "type": "bumper",
      "position": {
        "x": 0,
        "y": 0.6,
        "z": 13
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
        "color": "#1a1a1a",
        "bounce": 1.35,
        "distance": 3.2,
        "speed": 1.0,
        "phase": 0.0
      }
    },
    {
      "id": "bumper-724",
      "type": "bumper",
      "position": {
        "x": 0,
        "y": 0.6,
        "z": 6
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
        "color": "#1a1a1a",
        "bounce": 1.35,
        "distance": 3.2,
        "speed": 1.0,
        "phase": 2.0
      }
    },
    {
      "id": "bumper-725",
      "type": "bumper",
      "position": {
        "x": 0,
        "y": 0.6,
        "z": -1
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
        "color": "#1a1a1a",
        "bounce": 1.35,
        "distance": 3.2,
        "speed": 1.0,
        "phase": 0.9
      }
    },
    {
      "id": "bumper-726",
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
        "color": "#1a1a1a",
        "bounce": 1.35,
        "distance": 3.2,
        "speed": 1.0,
        "phase": 2.9
      }
    },
    {
      "id": "bumper-727",
      "type": "bumper",
      "position": {
        "x": 0,
        "y": 0.6,
        "z": -15
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
        "color": "#1a1a1a",
        "bounce": 1.35,
        "distance": 3.2,
        "speed": 1.0,
        "phase": 1.4
      }
    },
    {
      "id": "decoration-728",
      "type": "decoration",
      "position": {
        "x": 4.5,
        "y": 0.4,
        "z": 10
      },
      "rotation": {
        "x": 0,
        "y": -1,
        "z": 0
      },
      "scale": {
        "x": 1,
        "y": 1,
        "z": 1
      },
      "properties": {
        "subType": "bird",
        "variant": "canary"
      }
    },
    {
      "id": "decoration-729",
      "type": "decoration",
      "position": {
        "x": -4.5,
        "y": 0.4,
        "z": -10
      },
      "rotation": {
        "x": 0,
        "y": 1,
        "z": 0
      },
      "scale": {
        "x": 1,
        "y": 1,
        "z": 1
      },
      "properties": {
        "subType": "bird",
        "variant": "robin"
      }
    },
    {
      "id": "goal-730",
      "type": "goal",
      "position": {
        "x": 0,
        "y": 0.4,
        "z": -20.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 3.2,
        "y": 3.4,
        "z": 0.6
      }
    },
    {
      "id": "collectible-732",
      "type": "collectible",
      "position": {
        "x": 2,
        "y": 1.2,
        "z": 13
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
      "id": "collectible-733",
      "type": "collectible",
      "position": {
        "x": -2,
        "y": 1.2,
        "z": 6
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
      "id": "collectible-734",
      "type": "collectible",
      "position": {
        "x": 2,
        "y": 1.2,
        "z": -1
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
      "id": "collectible-735",
      "type": "collectible",
      "position": {
        "x": -2,
        "y": 1.2,
        "z": -8
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
      "id": "collectible-736",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 1.2,
        "z": -18
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
  8: {
  "id": "world-01-level-01-stage-08",
  "world": 1,
  "level": 1,
  "stage": 8,
  "name": "Membrillo",
  "theme": "countryside",
  "musicTrack": "jungle_groove",
  "timeLimit": 60,
  "spawn": {
    "x": 0,
    "y": 1.5,
    "z": 13
  },
  "objects": [
    {
      "id": "platform-800",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 0,
        "z": 13
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
      }
    },
    {
      "id": "decoration-801",
      "type": "decoration",
      "position": {
        "x": -3.4,
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
      "id": "decoration-802",
      "type": "decoration",
      "position": {
        "x": 3.4,
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
      "id": "decoration-803",
      "type": "decoration",
      "position": {
        "x": 0,
        "y": 0.4,
        "z": 15.6
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
        "subType": "fence"
      }
    },
    {
      "id": "ramp-804",
      "type": "ramp",
      "position": {
        "x": 0,
        "y": 0.5,
        "z": 8
      },
      "rotation": {
        "x": 0.165,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 5,
        "y": 0.8,
        "z": 6
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#aed581"
      }
    },
    {
      "id": "platform-805",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 1,
        "z": 3
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
        "theme": "villamanta"
      }
    },
    {
      "id": "decoration-806",
      "type": "decoration",
      "position": {
        "x": -3.4,
        "y": 1.4,
        "z": 3
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.1,
        "y": 1.1,
        "z": 1.1
      },
      "properties": {
        "subType": "tree"
      }
    },
    {
      "id": "decoration-807",
      "type": "decoration",
      "position": {
        "x": 3.4,
        "y": 1.4,
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
      },
      "properties": {
        "subType": "flower"
      }
    },
    {
      "id": "ramp-808",
      "type": "ramp",
      "position": {
        "x": 0,
        "y": 1.5,
        "z": -2
      },
      "rotation": {
        "x": 0.165,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 5,
        "y": 0.8,
        "z": 6
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#9dd35f",
        "color": "#9dd35f"
      }
    },
    {
      "id": "platform-809",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 2,
        "z": -7
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
        "theme": "villamanta"
      }
    },
    {
      "id": "decoration-810",
      "type": "decoration",
      "position": {
        "x": 3.4,
        "y": 2.4,
        "z": -7
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.1,
        "y": 1.1,
        "z": 1.1
      },
      "properties": {
        "subType": "tree"
      }
    },
    {
      "id": "decoration-811",
      "type": "decoration",
      "position": {
        "x": -3.4,
        "y": 2.4,
        "z": -7
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
        "subType": "bush"
      }
    },
    {
      "id": "decoration-812",
      "type": "decoration",
      "position": {
        "x": -3.2,
        "y": 2.4,
        "z": -5.5
      },
      "rotation": {
        "x": 0,
        "y": 0.8,
        "z": 0
      },
      "scale": {
        "x": 1,
        "y": 1,
        "z": 1
      },
      "properties": {
        "subType": "bird",
        "variant": "canary"
      }
    },
    {
      "id": "ramp-813",
      "type": "ramp",
      "position": {
        "x": 0,
        "y": 2.5,
        "z": -12
      },
      "rotation": {
        "x": 0.165,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 5,
        "y": 0.8,
        "z": 6
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#8cd03e",
        "color": "#8cd03e"
      }
    },
    {
      "id": "platform-814",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 3,
        "z": -18
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
      }
    },
    {
      "id": "decoration-815",
      "type": "decoration",
      "position": {
        "x": -3.8,
        "y": 3.4,
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
      "id": "decoration-816",
      "type": "decoration",
      "position": {
        "x": 3.8,
        "y": 3.4,
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
      "id": "decoration-817",
      "type": "decoration",
      "position": {
        "x": -3.8,
        "y": 3.4,
        "z": -18
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
      "id": "decoration-818",
      "type": "decoration",
      "position": {
        "x": 3.8,
        "y": 3.4,
        "z": -18
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
      "id": "decoration-819",
      "type": "decoration",
      "position": {
        "x": 0,
        "y": 3.4,
        "z": -21.5
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
        "subType": "fence"
      }
    },
    {
      "id": "goal-820",
      "type": "goal",
      "position": {
        "x": 0,
        "y": 3.4,
        "z": -18
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 3.2,
        "y": 3.4,
        "z": 0.6
      }
    },
    {
      "id": "collectible-822",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 1.8,
        "z": 8
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
      "id": "collectible-823",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 2.2,
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
      "id": "collectible-824",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 2.8,
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
      }
    },
    {
      "id": "collectible-825",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 3.2,
        "z": -7
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
      "id": "collectible-826",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 3.8,
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
    }
  ]
},
  9: {
  "id": "world-01-level-01-stage-09",
  "world": 1,
  "level": 1,
  "stage": 9,
  "name": "Blue",
  "theme": "countryside",
  "musicTrack": "jungle_groove",
  "timeLimit": 60,
  "spawn": {
    "x": 0,
    "y": 5,
    "z": 15
  },
  "objects": [
    {
      "id": "platform-900",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 3.6,
        "z": 15
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
      }
    },
    {
      "id": "decoration-901",
      "type": "decoration",
      "position": {
        "x": -3.4,
        "y": 4,
        "z": 17
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
      "id": "decoration-902",
      "type": "decoration",
      "position": {
        "x": 3.4,
        "y": 4,
        "z": 17
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
      "id": "decoration-903",
      "type": "decoration",
      "position": {
        "x": 0,
        "y": 4,
        "z": 17.6
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
        "subType": "fence"
      }
    },
    {
      "id": "platform-904",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 3.6,
        "z": 9.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 6,
        "y": 0.8,
        "z": 5
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#fafafa"
      }
    },
    {
      "id": "platform-905",
      "type": "platform",
      "position": {
        "x": -3.6,
        "y": 4.8,
        "z": 9.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.4,
        "y": 3.4,
        "z": 4
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#f5f5f5"
      }
    },
    {
      "id": "platform-906",
      "type": "platform",
      "position": {
        "x": 3.6,
        "y": 4.8,
        "z": 9.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 1.4,
        "y": 3.4,
        "z": 4
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#f5f5f5"
      }
    },
    {
      "id": "platform-907",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 6.4,
        "z": 9.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 6,
        "y": 0.8,
        "z": 5
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#fafafa"
      }
    },
    {
      "id": "bumper-908",
      "type": "bumper",
      "position": {
        "x": -1.5,
        "y": 6,
        "z": 11.8
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.8,
        "y": 0.6,
        "z": 0.8
      },
      "properties": {
        "color": "#111111"
      }
    },
    {
      "id": "bumper-909",
      "type": "bumper",
      "position": {
        "x": 1.5,
        "y": 6,
        "z": 11.8
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.8,
        "y": 0.6,
        "z": 0.8
      },
      "properties": {
        "color": "#111111"
      }
    },
    {
      "id": "bumper-910",
      "type": "bumper",
      "position": {
        "x": 0,
        "y": 4.4,
        "z": 12
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.9,
        "y": 0.6,
        "z": 0.9
      },
      "properties": {
        "color": "#212121"
      }
    },
    {
      "id": "ramp-911",
      "type": "ramp",
      "position": {
        "x": 0,
        "y": 1.8,
        "z": -2.5
      },
      "rotation": {
        "x": -0.18,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 3.5,
        "y": 0.8,
        "z": 20
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#0288d1"
      }
    },
    {
      "id": "ramp-912",
      "type": "ramp",
      "position": {
        "x": -1.8,
        "y": 2.2,
        "z": -2.5
      },
      "rotation": {
        "x": -0.18,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.4,
        "y": 1.6,
        "z": 20
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#01579b"
      }
    },
    {
      "id": "ramp-913",
      "type": "ramp",
      "position": {
        "x": 1.8,
        "y": 2.2,
        "z": -2.5
      },
      "rotation": {
        "x": -0.18,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.4,
        "y": 1.6,
        "z": 20
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#01579b"
      }
    },
    {
      "id": "platform-914",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 0,
        "z": -17
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
      }
    },
    {
      "id": "decoration-915",
      "type": "decoration",
      "position": {
        "x": -3.4,
        "y": 0.4,
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
      },
      "properties": {
        "subType": "lantern"
      }
    },
    {
      "id": "decoration-916",
      "type": "decoration",
      "position": {
        "x": 3.4,
        "y": 0.4,
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
      },
      "properties": {
        "subType": "lantern"
      }
    },
    {
      "id": "decoration-917",
      "type": "decoration",
      "position": {
        "x": -3.4,
        "y": 0.4,
        "z": -17
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
      "id": "decoration-918",
      "type": "decoration",
      "position": {
        "x": 3.4,
        "y": 0.4,
        "z": -17
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
      "id": "decoration-919",
      "type": "decoration",
      "position": {
        "x": 0,
        "y": 0.4,
        "z": -20.6
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-920",
      "type": "decoration",
      "position": {
        "x": 3.2,
        "y": 0.4,
        "z": -15.5
      },
      "rotation": {
        "x": 0,
        "y": -0.8,
        "z": 0
      },
      "scale": {
        "x": 1,
        "y": 1,
        "z": 1
      },
      "properties": {
        "subType": "bird",
        "variant": "bluebird"
      }
    },
    {
      "id": "goal-921",
      "type": "goal",
      "position": {
        "x": 0,
        "y": 0.4,
        "z": -17
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 3.2,
        "y": 3.4,
        "z": 0.6
      }
    },
    {
      "id": "collectible-923",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 4.8,
        "z": 9.5
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
      "id": "collectible-924",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 3.8,
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
      "id": "collectible-925",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 2.6,
        "z": -3
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
      "id": "collectible-926",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 1.6,
        "z": -9
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
  10: {
  "id": "world-01-level-01-stage-10",
  "world": 1,
  "level": 1,
  "stage": 10,
  "name": "Garaje",
  "theme": "countryside",
  "musicTrack": "jungle_groove",
  "timeLimit": 60,
  "spawn": {
    "x": 0,
    "y": 1.5,
    "z": 5
  },
  "objects": [
    {
      "id": "platform-1000",
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
        "x": 16,
        "y": 0.8,
        "z": 16
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#78909c"
      }
    },
    {
      "id": "platform-1001",
      "type": "platform",
      "position": {
        "x": 0,
        "y": 2.8,
        "z": 7.8
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 16,
        "y": 4.8,
        "z": 0.6
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#cfd8dc"
      }
    },
    {
      "id": "platform-1002",
      "type": "platform",
      "position": {
        "x": -7.8,
        "y": 2.8,
        "z": 0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 0.6,
        "y": 4.8,
        "z": 16
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#cfd8dc"
      }
    },
    {
      "id": "platform-1003",
      "type": "platform",
      "position": {
        "x": -5.5,
        "y": 0.8,
        "z": 4.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 3,
        "y": 0.8,
        "z": 4
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#546e7a"
      }
    },
    {
      "id": "decoration-1004",
      "type": "decoration",
      "position": {
        "x": -5.5,
        "y": 1.2,
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
      "id": "decoration-1005",
      "type": "decoration",
      "position": {
        "x": -6.5,
        "y": 0.4,
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
      },
      "properties": {
        "subType": "lantern"
      }
    },
    {
      "id": "platform-1006",
      "type": "platform",
      "position": {
        "x": 5.5,
        "y": 0.6,
        "z": 4.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 2.8,
        "y": 0.6,
        "z": 2.2
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#8d6e63"
      }
    },
    {
      "id": "platform-1007",
      "type": "platform",
      "position": {
        "x": 5.5,
        "y": 1.5,
        "z": 0.5
      },
      "rotation": {
        "x": 0.32,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 2.8,
        "y": 0.6,
        "z": 6
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#8d6e63"
      }
    },
    {
      "id": "platform-1009",
      "type": "platform",
      "position": {
        "x": 5.5,
        "y": 2.4,
        "z": -4
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 3.2,
        "y": 0.8,
        "z": 3.2
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#8d6e63"
      }
    },
    {
      "id": "decoration-1010",
      "type": "decoration",
      "position": {
        "x": 6.2,
        "y": 2.8,
        "z": -4
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
      "id": "platform-1012",
      "type": "platform",
      "position": {
        "x": 0.2,
        "y": 3.8,
        "z": -4
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": -0.34
      },
      "scale": {
        "x": 7.5,
        "y": 0.6,
        "z": 2.8
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#8d6e63"
      }
    },
    {
      "id": "platform-1014",
      "type": "platform",
      "position": {
        "x": -5.5,
        "y": 4.8,
        "z": 0
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 4.2,
        "y": 0.8,
        "z": 12
      },
      "properties": {
        "theme": "custom_color",
        "customColor": "#5d4037"
      }
    },
    {
      "id": "decoration-1015",
      "type": "decoration",
      "position": {
        "x": -3.5,
        "y": 5.2,
        "z": -2
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-1016",
      "type": "decoration",
      "position": {
        "x": -3.5,
        "y": 5.2,
        "z": 2
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-1017",
      "type": "decoration",
      "position": {
        "x": -5.5,
        "y": 5.2,
        "z": 5.6
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
        "subType": "fence"
      }
    },
    {
      "id": "decoration-1018",
      "type": "decoration",
      "position": {
        "x": -7,
        "y": 5.2,
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
      "id": "decoration-1019",
      "type": "decoration",
      "position": {
        "x": -4,
        "y": 5.2,
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
      "id": "decoration-1020",
      "type": "decoration",
      "position": {
        "x": -3.6,
        "y": 5.2,
        "z": 0
      },
      "rotation": {
        "x": 0,
        "y": -1.2,
        "z": 0
      },
      "scale": {
        "x": 1,
        "y": 1,
        "z": 1
      },
      "properties": {
        "subType": "bird",
        "variant": "canary"
      }
    },
    {
      "id": "goal-1021",
      "type": "goal",
      "position": {
        "x": -5.5,
        "y": 5.2,
        "z": 3.5
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "scale": {
        "x": 3.2,
        "y": 3.4,
        "z": 0.6
      }
    },
    {
      "id": "collectible-1023",
      "type": "collectible",
      "position": {
        "x": 5.5,
        "y": 2,
        "z": 2
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
      "id": "collectible-1024",
      "type": "collectible",
      "position": {
        "x": 5.5,
        "y": 3.6,
        "z": -4
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
      "id": "collectible-1025",
      "type": "collectible",
      "position": {
        "x": 0,
        "y": 4.8,
        "z": -4
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
      "id": "collectible-1026",
      "type": "collectible",
      "position": {
        "x": -5.5,
        "y": 6,
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
      "id": "obj-custom-1792507179776",
      "type": "decoration",
      "position": {
        "x": 6.9,
        "y": 1,
        "z": 4
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
        "subType": "fence"
      }
    }
  ]
},
};

export function getWorld01Level01Stage(stageNum: number): LevelData {
  return WORLD_01_LEVEL_01_STAGES[stageNum] || WORLD_01_LEVEL_01_STAGES[1];
}

registerStageSet(1,1,WORLD_01_LEVEL_01_STAGES);

