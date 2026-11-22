import * as THREE from "three";
import type RAPIER from "@dimforge/rapier3d-compat";
import type { LevelData, LevelObjectData } from "../LevelTypes";
import type { ActiveCollectible, ActiveGoal } from "../LevelBuilder";
import type { PhysicsWorld } from "../../physics/PhysicsWorld";
import type { Player } from "../../player/Player";
import type { InputAxis } from "../../input/InputManager";
import {
  TEA_PIVOT,
  teaTilt,
  kitsuneFireActive,
  kitsuneEliminationActive,
} from "./KyotoRoutes";
import { previewKyotoKatana } from "./KyotoModels";

interface Sword {
  obj: LevelObjectData;
  mesh: THREE.Group;
  blade: THREE.Object3D;
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
  striking: boolean;
  body?: RAPIER.RigidBody;
  cooldown: number;
}
/** One deterministic gameplay clock; no timers, geometry rebuilds or per-frame GPU uploads. */
export class KyotoLevel {
  private time = 0;
  private stopped = false;
  private road?: THREE.Group;
  private roadBody?: RAPIER.RigidBody;
  private readonly swords: Sword[] = [];
  private readonly fires: THREE.Object3D[] = [];
  private goal?: ActiveGoal;
  private goalBase?: THREE.Vector3;
  private goalRotation?: THREE.Quaternion;
  private readonly goalBodies: RAPIER.RigidBody[] = [];
  private coins: ActiveCollectible[] = [];
  private readonly pivot = new THREE.Vector3(
    TEA_PIVOT.x,
    TEA_PIVOT.y,
    TEA_PIVOT.z,
  );
  private readonly q = new THREE.Quaternion();
  private readonly axis = new THREE.Vector3(0, 0, 1);
  private readonly point = new THREE.Vector3();
  private readonly inverse = new THREE.Matrix4();
  blueActive = false;
  collapsed = false;
  constructor(
    private readonly data: LevelData,
    private readonly physics: PhysicsWorld,
  ) {}
  get elapsed(): number {
    return this.time;
  }
  attach(
    obj: LevelObjectData,
    mesh: THREE.Group,
    solids: THREE.Mesh[],
  ): boolean {
    if (obj.properties?.subType === "kyoto_kitsune") {
      const fire = mesh.getObjectByName("kyoto-blue-fire");
      if (fire) this.fires.push(fire);
      return false;
    }
    if (
      obj.properties?.kyotoAction === "katana" ||
      obj.properties?.subType === "kyoto_sweeping_katana"
    ) {
      const blade = mesh.getObjectByName("kyoto-katana-blade");
      if (!blade) return false;
      const actor: Sword = {
        obj,
        mesh,
        blade,
        position: new THREE.Vector3(),
        rotation: new THREE.Quaternion(),
        striking: false,
        cooldown: -10,
      };
      this.poseSword(actor, 0, true);
      const scale = blade.getWorldScale(new THREE.Vector3());
      if (obj.properties?.hasCollision !== false)
        actor.body = this.physics.createKinematicBox(
          actor.position,
          actor.rotation,
          {
            x: 3.25 * Math.abs(scale.x),
            y: 0.2 * Math.abs(scale.y),
            z: 0.15 * Math.abs(scale.z),
          },
          0.1,
          0,
          { x: -3.75 * scale.x, y: 0.04 * scale.y, z: 0 },
        )?.body;
      this.swords.push(actor);
      this.poseSword(actor, 0, true);
      return true;
    }
    if (
      obj.properties?.subType !== "kyoto_path" ||
      ![7, 10].includes(this.data.stage)
    )
      return false;
    this.road = mesh;
    const pivot = this.data.stage === 7 ? this.pivot : new THREE.Vector3();
    for (const solid of solids) {
      solid.updateWorldMatrix(true, false);
      const geometry = solid.geometry
        .clone()
        .applyMatrix4(solid.matrixWorld)
        .translate(-pivot.x, -pivot.y, -pivot.z);
      const positions = new Float32Array(
          geometry.getAttribute("position").array,
        ),
        indices = geometry.index
          ? new Uint32Array(geometry.index.array)
          : Uint32Array.from({ length: positions.length / 3 }, (_, i) => i);
      if (!this.roadBody)
        this.roadBody = this.physics.createKinematicTrimesh(
          pivot,
          positions,
          indices,
          0.01,
          0.72,
        )?.body;
      else
        this.physics.addTrimeshColliderToBody(
          this.roadBody,
          positions,
          indices,
          0.72,
          0.01,
        );
      geometry.dispose();
    }
    return true;
  }
  attachCoins(coins: ActiveCollectible[]): void {
    this.coins = coins;
  }
  attachGoal(goal: ActiveGoal): void {
    this.goal = goal;
    this.goalBase = goal.position.clone();
    this.goalRotation = goal.mesh.quaternion.clone();
    if (this.data.stage === 7)
      for (const [x, y, hx, hy] of [
        [-1.65, 1.6, 0.2, 1.6],
        [1.65, 1.6, 0.2, 1.6],
        [0, 3.3, 1.85, 0.2],
      ]) {
        const gate = this.physics.createKinematicBox(
          goal.position,
          goal.mesh.quaternion,
          { x: hx, y: hy, z: 0.2 },
          0.02,
          0.4,
          { x, y, z: 0 },
        );
        if (gate) this.goalBodies.push(gate.body);
      }
  }
  private poseSword(s: Sword, time: number, immediate = false): void {
    const pose = previewKyotoKatana(s.obj, s.mesh, time);
    s.striking = pose?.striking ?? false;
    s.mesh.updateWorldMatrix(true, true);
    s.blade.getWorldPosition(s.position);
    s.blade.getWorldQuaternion(s.rotation);
    if (immediate) {
      s.body?.setTranslation(s.position, true);
      s.body?.setRotation(s.rotation, true);
    }
    s.body?.setNextKinematicTranslation(s.position);
    s.body?.setNextKinematicRotation(s.rotation);
  }
  update(
    delta: number,
    player: Player,
    input: InputAxis = { horizontal: 0, vertical: 0 },
  ): void {
    if (this.stopped) return;
    this.time += delta;
    if (this.data.stage === 7) {
      this.q.setFromAxisAngle(this.axis, teaTilt(this.time));
      if (this.road) {
        this.road.quaternion.copy(this.q);
        this.road.position
          .copy(this.pivot)
          .sub(this.point.copy(this.pivot).applyQuaternion(this.q));
        this.road.updateWorldMatrix(true, true);
      }
      this.roadBody?.setNextKinematicRotation(this.q);
    }
    for (const sword of this.swords) {
      this.poseSword(sword, this.time);
      if (!sword.body || !sword.striking || this.time - sword.cooldown < 0.8)
        continue;
      const body = player.getBody();
      if (!body) continue;
      this.point
        .copy(body.translation())
        .applyMatrix4(this.inverse.copy(sword.blade.matrixWorld).invert());
      const contact =
        sword.body && this.physics.hasBodyContact(body, sword.body);
      const dx = Math.max(-7 - this.point.x, 0, this.point.x + 0.5),
        dy = Math.max(Math.abs(this.point.y - 0.04) - 0.2, 0),
        dz = Math.max(Math.abs(this.point.z) - 0.15, 0);
      if (contact || dx * dx + dy * dy + dz * dz <= 0.75 * 0.75) {
        sword.cooldown = this.time;
        this.point.set(1, 0, 0).applyQuaternion(sword.rotation);
        const length = Math.hypot(this.point.x, this.point.z) || 1;
        player.setLinearVelocity({
          x: (this.point.x / length) * 18,
          y: 10,
          z: (this.point.z / length) * 18,
        });
      }
    }
    if (this.data.stage === 10) {
      this.blueActive = kitsuneFireActive(this.time);
      if (
        kitsuneEliminationActive(this.time) &&
        (input.anyKey ||
          input.action ||
          Math.abs(input.horizontal) > 0.01 ||
          Math.abs(input.vertical) > 0.01)
      ) {
        this.collapsed = true;
        if (this.road) this.road.visible = false;
        this.roadBody?.setEnabled(false);
      }
      this.animateFire();
    }
  }
  /** Runs after the ordinary hover update so prizes and pickup coordinates stay in sync. */
  syncAssets(): void {
    if (this.data.stage === 7) {
      for (const coin of this.coins) {
        this.point
          .set(coin.baseX, coin.baseY, coin.baseZ)
          .sub(this.pivot)
          .applyQuaternion(this.q)
          .add(this.pivot);
        coin.mesh.position.copy(this.point);
        coin.position.copy(this.point);
      }
      if (this.goal && this.goalBase && this.goalRotation) {
        this.goal.position
          .copy(this.goalBase)
          .sub(this.pivot)
          .applyQuaternion(this.q)
          .add(this.pivot);
        this.goal.mesh.position.copy(this.goal.position);
        this.goal.mesh.quaternion.copy(this.q).multiply(this.goalRotation);
        this.goal.quaternion?.copy(this.goal.mesh.quaternion);
        for (const body of this.goalBodies) {
          body.setNextKinematicTranslation(this.goal.position);
          body.setNextKinematicRotation(this.goal.mesh.quaternion);
        }
      }
    }
    if (this.data.stage === 10 && this.collapsed) {
      if (this.goal) this.goal.mesh.visible = false;
      for (const coin of this.coins) coin.mesh.visible = false;
    }
  }
  private animateFire(): void {
    for (let i = 0; i < this.fires.length; i++) {
      const fire = this.fires[i];
      fire.visible = this.blueActive;
      fire.scale.set(
        1 + 0.08 * Math.sin(this.time * 13 + i),
        1 + 0.16 * Math.sin(this.time * 17 + i * 2),
        1,
      );
    }
  }
  stop(): void {
    this.stopped = true;
    this.blueActive = false;
    this.animateFire();
  }
  reset(): void {
    this.time = 0;
    this.stopped = false;
    this.blueActive = false;
    this.collapsed = false;
    this.q.identity();
    if (this.road) {
      this.road.visible = true;
      this.road.position.set(0, 0, 0);
      this.road.quaternion.identity();
      this.road.updateWorldMatrix(true, true);
    }
    if (this.roadBody) {
      this.roadBody.setEnabled(true);
      this.roadBody.setRotation(this.q, true);
      this.roadBody.setNextKinematicRotation(this.q);
    }
    for (const sword of this.swords) {
      sword.cooldown = -10;
      this.poseSword(sword, 0, true);
    }
    if (this.goal) this.goal.mesh.visible = true;
    for (const coin of this.coins)
      if (!coin.collected) coin.mesh.visible = true;
    this.animateFire();
    this.syncAssets();
    for (const body of this.goalBodies)
      if (this.goal) {
        body.setTranslation(this.goal.position, true);
        body.setRotation(this.goal.mesh.quaternion, true);
      }
  }
  destroy(): void {
    this.swords.length = 0;
    this.fires.length = 0;
    this.goalBodies.length = 0;
    this.coins = [];
  }
}
