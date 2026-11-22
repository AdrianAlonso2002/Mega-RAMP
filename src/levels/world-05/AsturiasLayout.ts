import type { LevelObjectData, Vector3Data } from "../LevelTypes";

export const v = (x: number, y: number, z: number): Vector3Data => ({ x, y, z });

export class AsturiasLayout {
  readonly objects: LevelObjectData[] = [];
  constructor(private readonly stageNumber: number, private readonly levelNumber: number) {}

  add(name: string, type: LevelObjectData["type"], position: Vector3Data, scale = v(1, 1, 1), properties?: LevelObjectData["properties"], rotation = v(0, 0, 0)) {
    this.objects.push({ id: `w5s${this.levelNumber}${this.stageNumber}-${name}`, type, position, rotation, scale, properties });
  }

  block(name: string, position: Vector3Data, scale: Vector3Data, color: string, properties: LevelObjectData["properties"] = {}, rotation = v(0, 0, 0)) {
    this.add(name, "platform", position, scale, { theme: "custom_color", customColor: color, ...properties }, rotation);
  }

  decor(name: string, model: string, position: Vector3Data, scale = v(1, 1, 1), properties: LevelObjectData["properties"] = {}, yaw = 0) {
    this.add(name, "decoration", position, scale, { subType: `asturias_${model}`, ...properties }, v(0, yaw, 0));
  }

  route(name: string, from: Vector3Data, to: Vector3Data, width: number, color: string, thickness = 0.5) {
    const dx = to.x - from.x, dy = to.y - from.y, dz = to.z - from.z;
    const pitch = -Math.atan2(dy, Math.hypot(dx, dz));
    const yaw = Math.atan2(dx, dz);
    this.block(name, v((from.x + to.x) / 2, (from.y + to.y) / 2, (from.z + to.z) / 2),
      v(width, thickness, Math.hypot(dx, dy, dz) + 0.24), color, {}, v(pitch, yaw, 0));
  }

  coins(points: Vector3Data[]) {
    const offset = this.objects.filter(object => object.type === "collectible").length;
    points.forEach((position, index) => this.add(`col-${offset + index + 1}`, "collectible", position, v(0.42, 0.42, 0.42)));
  }

  goal(position: Vector3Data) {
    this.add("goal", "goal", position);
  }
}
