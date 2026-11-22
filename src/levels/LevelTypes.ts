export type LevelObjectType =
  | "platform"
  | "ramp"
  | "cylinder"
  | "moving-platform"
  | "rotating-platform"
  | "bumper"
  | "obstacle"
  | "water"
  | "honey"
  | "lava"
  | "collectible"
  | "goal"
  | "spawn"
  | "decoration";

export interface Vector3Data {
  x: number;
  y: number;
  z: number;
}

export interface LevelObjectData {
  id: string;
  type: LevelObjectType;
  position: Vector3Data;
  rotation: Vector3Data;
  scale: Vector3Data;
  properties?: Record<string, unknown>;
}

export interface LandmarkLevelDefinition {
  level: number;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  mapX: number;
  mapY: number;
}

export interface WorldDefinition {
  id: number;
  name: string;
  subtitle?: string;
  description: string;
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  skyColor: string;
  horizonColor: string;
  icon: string;
  image?: string;
  mapX?: number;
  mapY?: number;
  levels?: LandmarkLevelDefinition[];
}

export interface LevelData {
  id: string;
  world: number;
  level: number;
  stage: number;
  name: string;
  theme?: string;
  musicTrack?: string;
  skyTheme?: string;
  timeLimit: number;
  spawn: Vector3Data;
  objects: LevelObjectData[];
  properties?: Record<string, unknown>;
  customSaved?: boolean;
  lastModified?: number;
}