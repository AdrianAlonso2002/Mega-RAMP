import * as THREE from "three";
import {AudioManager} from '../../audio/AudioManager';
import type RAPIER from "@dimforge/rapier3d-compat";
import type { LevelData, LevelObjectData } from "../LevelTypes";
import type { ActiveCollectible, ActiveGoal } from "../LevelBuilder";
import type { PhysicsWorld } from "../../physics/PhysicsWorld";
import type { InputAxis } from "../../input/InputManager";
import type { Player } from "../../player/Player";
import { previewNorwayModel } from "./NorwayModels";
import { osloFerryPose } from "./OsloRoutes";
import type { Vector3Data } from "../LevelTypes";
interface Actor {
  obj: LevelObjectData;
  group: THREE.Object3D;
  body?: RAPIER.RigidBody;
  cooldown: number;
  sink?: number;
}
/** Geometry is uploaded once. A single deterministic clock drives visual and native poses. */
export class NorwayLevel {
  private time = 0;
  private stopped = false;
  private actors: Actor[] = [];
  private goal?: ActiveGoal;
  private coins: {
    coin: ActiveCollectible;
    owner: THREE.Object3D;
    local: THREE.Vector3;
  }[] = [];
  private readonly position = new THREE.Vector3();
  private readonly quaternion = new THREE.Quaternion();
  private readonly velocity = new THREE.Vector3();
  constructor(
    private readonly physics: PhysicsWorld,
    private readonly data: LevelData,
  ) {}
  get elapsed() {
    return this.time;
  }
  get mechanicHint() {
    if(this.data.level===4)return ({
      1:'Sube los cuatro escalones con velocidad controlada.',
      2:'Sigue la hélice y centra los impulsores antes de cada hueco.',
      3:'Desciende por cada torre y apunta al impulsor estrecho para saltar a la siguiente.',
      4:'Muro8: cada pareja de muros tiene un ritmo distinto. Espera una abertura.',
      5:'Recoge los cinco brazos del cristal de nieve.',
      6:'Espera a que los fondos de los aros coincidan para pasar al siguiente.',
      7:'Frena antes de los giros: el camino se cierra cada vez más.',
      8:'Cambia de pasarela cuando ambas estén abajo; evita los soportes centrales.',
      9:'Los engranajes contiguos giran en sentidos alternos. Busca el contacto entre sus dientes.',
      10:'Cruza la recta elevada y desciende por la espiral hasta la última meta.',
    } as Record<number,string>)[this.data.stage]??null;
    if (this.data.level === 3)
      return (
        (
          {
            1: "Cruza los puentes suspendidos y usa sus impulsores para saltar al siguiente.",
            3: "Correr8: controla la velocidad en los pasos del ancho de la bola.",
            4: "Centra cada paso antes de pasar a las baldosas diagonales.",
            6: "Los tambores giran en sentidos alternos. Corrige la deriva lateral.",
            7: "Busca los descansillos y los impulsores entre las baldosas puntiagudas.",
            8: "Espera a que una pasarela radial llegue al anillo y avanza hacia el centro.",
            9: "Cambia de brazo cuando las plataformas se junten. La última plataforma te lleva a la meta.",
            10: "Los impulsores permiten saltar por los huecos. Espera la alineación del puente móvil.",
          } as Record<number, string>
        )[this.data.stage] ?? null
      );
    if (this.data.level === 2)
      return (
        (
          {
            2: "Los impulsores saltan automáticamente. Centra la bola antes de despegar.",
            4: "Las columnas se hunden al pisarlas y se recuperan al dejarlas.",
            6: "Entra centrado en el impulsor para completar el rizo vertical.",
            9: "Espera al fondo de los tubos y cruza antes de que llegue la abertura.",
            10: "Cruza la espiral y mide el ritmo de las pasarelas basculantes.",
          } as Record<number, string>
        )[this.data.stage] ?? null
      );
    return this.data.stage === 9
      ? "La torre y la meta giran juntas. Busca la entrada de la espiral y asciende con cuidado."
      : this.data.stage === 10
        ? "Espera a que las curvas móviles alcancen los descansillos para cambiar de plataforma."
        : this.data.stage === 7
          ? "Aprovecha las placas quietas para preparar el siguiente paso."
          : null;
  }
  attach(
    obj: LevelObjectData,
    group: THREE.Object3D,
    meshes: THREE.Mesh[],
  ): boolean {
    const action = obj.properties?.norwayAction,
      solid =
        obj.properties?.hasCollision === true ||
        obj.properties?.norwayGoal === true,
      actor: Actor = { obj, group, cooldown: -10 };
    if (solid) {
      group.updateWorldMatrix(true, true);
      const pose = new THREE.Matrix4().compose(
          group.getWorldPosition(this.position),
          group.getWorldQuaternion(this.quaternion),
          new THREE.Vector3(1, 1, 1),
        ),
        inverse = pose.invert(),
        friction = Number(
          obj.properties?.friction ?? (action === "spin" ? 0.95 : 0.48),
        );
      for (const mesh of meshes) {
        mesh.updateWorldMatrix(true, false);
        const geometry = mesh.geometry
            .clone()
            .applyMatrix4(
              action
                ? inverse.clone().multiply(mesh.matrixWorld)
                : mesh.matrixWorld,
            ),
          vertices = new Float32Array(geometry.getAttribute("position").array),
          indices = geometry.index
            ? new Uint32Array(geometry.index.array)
            : Uint32Array.from({ length: vertices.length / 3 }, (_, i) => i);
        if (action) {
          if (actor.body)
            this.physics.addTrimeshColliderToBody(
              actor.body,
              vertices,
              indices,
              friction,
              Number(obj.properties?.restitution ?? 0.015),
            );
          else
            actor.body = this.physics.createKinematicTrimesh(
              group.getWorldPosition(this.position),
              vertices,
              indices,
              Number(obj.properties?.restitution ?? 0.015),
              friction,
              group.getWorldQuaternion(this.quaternion),
            )?.body;
        } else
          this.physics.createTrimeshCollider(
            vertices,
            indices,
            Number(obj.properties?.restitution ?? 0.015),
            friction,
          );
        geometry.dispose();
      }
    }
    if (action) this.actors.push(actor);
    return true;
  }
  attachGoal(obj: LevelObjectData, goal: ActiveGoal) {
    if (!obj.properties?.norwayGoal) return;
    this.goal = goal;
    const meshes: THREE.Mesh[] = [];
    goal.mesh.traverse((node) => {
      if (node instanceof THREE.Mesh && node !== goal.portalMesh)
        meshes.push(node);
    });
    this.attach(obj, goal.mesh, meshes);
  }
  attachCoins(coins: ActiveCollectible[]) {
    for (const actor of this.actors) {
      const owner = this.actors.find(
        (a) => a.obj.id === actor.obj.properties?.osloAnchor,
      );
      if (owner && owner !== actor) owner.group.attach(actor.group);
    }
    for (const coin of coins) {
      const object = this.data.objects.find((o) => o.id === coin.id),
        owner = this.actors.find(
          (a) => a.obj.id === object?.properties?.norwayAnchor,
        )?.group;
      if (owner) {
        owner.updateWorldMatrix(true, true);
        this.coins.push({
          coin,
          owner,
          local: owner.worldToLocal(coin.position.clone()),
        });
      }
    }
  }
  private pose(actor: Actor, immediate = false) {
    previewNorwayModel(actor.obj, actor.group, this.time);
    if (actor.obj.properties?.norwayAction === "sink")
      actor.group.position.y = actor.obj.position.y - (actor.sink ?? 0);
    actor.group.updateWorldMatrix(true, true);
    if (actor.body) {
      actor.group.getWorldPosition(this.position);
      actor.group.getWorldQuaternion(this.quaternion);
      if (immediate) {
        actor.body.setTranslation(this.position, true);
        actor.body.setRotation(this.quaternion, true);
      }
      actor.body.setNextKinematicTranslation(this.position);
      actor.body.setNextKinematicRotation(this.quaternion);
    }
  }
  private updateCoins() {
    for (const item of this.coins) {
      this.position.copy(item.local);
      item.owner.localToWorld(this.position);
      item.coin.baseX = this.position.x;
      item.coin.baseY = this.position.y;
      item.coin.baseZ = this.position.z;
      item.coin.position.copy(this.position);
      item.coin.mesh.position.copy(this.position);
    }
  }
  update(delta: number, player: Player, input?: InputAxis) {
    if (this.stopped) return;
    this.time += delta;
    for (const actor of this.actors) {
      if (actor.obj.properties?.norwayAction === "sink") {
        const touching =
            actor.body &&
            player.getBody() &&
            this.physics.hasBodyContact(player.getBody()!, actor.body),
          p = actor.obj.properties;
        actor.sink = THREE.MathUtils.clamp(
          (actor.sink ?? 0) +
            delta * (touching ? Number(p.sinkSpeed ?? 0.7) : -1.2),
          0,
          Number(p.sinkMax ?? 1.6),
        );
      }
      this.pose(actor);
      if(actor.obj.properties?.norwayAction==='wall'&&this.time-actor.cooldown>2){
        const p=actor.obj.properties,speed=Number(p.speed??.5),phase=this.time*speed+Number(p.index??0)*1.1,point=player.getPosition();
        if(Math.abs(point.x-actor.obj.position.x)<12&&Math.abs(point.y-actor.obj.position.y)<5&&Math.abs(Math.sin(phase))>.55&&Math.abs(Math.sin(phase+speed*.45))<.4){if(typeof window!=='undefined')AudioManager.getInstance().playWarning();actor.cooldown=this.time;}
      }
      const action = actor.obj.properties?.norwayAction,
        p = actor.obj.properties ?? {};
      const arrivalOwner = p.waitForArrival
        ? this.actors.find((a) => a.obj.id === p.osloAnchor)
        : undefined;
      const canLaunch =
        !p.waitForArrival ||
        (arrivalOwner &&
          osloFerryPose(
            this.time,
            arrivalOwner.obj.properties!.points as Vector3Data[],
            Number(arrivalOwner.obj.properties!.period ?? 36),
          ).arrival);
      if (action === "jump" && canLaunch && this.time - actor.cooldown > 1) {
        actor.group.worldToLocal(this.position.copy(player.getPosition()));
        if (
          Math.abs(this.position.x) <
            Number(p.triggerLength ?? p.length ?? 2) / 2 &&
          Math.abs(this.position.z) <
            Number(p.triggerWidth ?? p.width ?? 2) / 2 &&
          this.position.y > 0.25 &&
          this.position.y < 1.8 &&
          player.linvel().y < 3
        ) {
          const target = p.target as
            { x: number; y: number; z: number } | undefined;
          if (target) {
            const origin = player.getPosition(),
              vy = Number(p.launchY ?? 11),
              dy = target.y + 0.85 - origin.y;
            const flight =
              (vy + Math.sqrt(Math.max(1, vy * vy - 36 * dy))) / 18;
            player.setLinearVelocity({
              x: (target.x - origin.x) / flight,
              y: vy,
              z: (target.z - origin.z) / flight,
            });
            actor.cooldown = this.time;
          }
        }
      }
      if (
        (action === "ferry" || action === "bypass") &&
        actor.body &&
        player.getBody() &&
        this.physics.hasBodyContact(player.getBody()!, actor.body)
      ) {
        const velocity = player.linvel(),
          carry = actor.body.linvel(),
          blend =
            1 -
            Math.exp(
              -delta *
                (input &&
                Math.abs(input.horizontal) + Math.abs(input.vertical) > 0.02
                  ? 1
                  : 7),
            );
        player.setLinearVelocity({
          x: velocity.x + (carry.x - velocity.x) * blend,
          y: velocity.y,
          z: velocity.z + (carry.z - velocity.z) * blend,
        });
      }
      if (
        action === "spin" &&
        actor.body &&
        !p.norwayGoal &&
        player.getBody() &&
        this.physics.hasBodyContact(player.getBody()!, actor.body)
      ) {
        const point = player.getPosition(),
          velocity = player.linvel(),
          speed = Number(p.speed ?? 0.42),
          blend =
            1 -
            Math.exp(
              -delta *
                (input &&
                Math.abs(input.horizontal) + Math.abs(input.vertical) > 0.02
                  ? 1.2
                  : 7),
            );
        player.setLinearVelocity({
          x:
            velocity.x +
            (speed * (point.z - actor.group.position.z) - velocity.x) * blend,
          y: velocity.y,
          z:
            velocity.z +
            (-speed * (point.x - actor.group.position.x) - velocity.z) * blend,
        });
      }
      if (action === "boost" && this.time - actor.cooldown > 0.45) {
        actor.group.worldToLocal(this.position.copy(player.getPosition()));
        if (
          Math.abs(this.position.x) < Number(p.length ?? 3) / 2 &&
          Math.abs(this.position.z) < Number(p.width ?? 3) / 2 &&
          this.position.y > -0.1 &&
          this.position.y < 3.5
        ) {
          const direction = p.direction as
            { x: number; y: number; z: number } | undefined;
          this.velocity
            .set(direction?.x ?? 1, direction?.y ?? 0, direction?.z ?? 0)
            .normalize()
            .applyQuaternion(actor.group.getWorldQuaternion(this.quaternion))
            .multiplyScalar(Number(p.speed ?? 28));
          player.setLinearVelocity({
            x: this.velocity.x,
            y: Math.max(player.linvel().y, this.velocity.y),
            z: this.velocity.z,
          });
          actor.cooldown = this.time;
        }
      }
      if (
        (action === "orbit" || action === "avalanche") &&
        actor.body &&
        player.getBody() &&
        this.time - actor.cooldown > 0.75
      ) {
        const position = player.getPosition(),
          r = Number(p.size ?? 1.4) + player.radius;
        actor.group.getWorldPosition(this.position);
        if (
          this.position.distanceToSquared(position) < (r + 0.08) ** 2 ||
          this.physics.hasBodyContact(player.getBody()!, actor.body)
        ) {
          this.velocity.copy(position).sub(this.position).setY(0);
          if (this.velocity.lengthSq() < 0.01) this.velocity.set(0, 0, 1);
          this.velocity.normalize();
          player.teleportTo(
            this.position.x + this.velocity.x * (r + 0.3),
            Math.max(position.y, this.position.y + 0.3),
            this.position.z + this.velocity.z * (r + 0.3),
          );
          player.setLinearVelocity({
            x: this.velocity.x * 24,
            y: 8,
            z: this.velocity.z * 24,
          });
          actor.cooldown = this.time;
        }
      }
    }
    this.updateCoins();
    if (this.goal) {
      this.goal.position.copy(this.goal.mesh.position);
      this.goal.mesh.getWorldQuaternion(this.quaternion);
      this.goal.quaternion?.copy(this.quaternion);
      this.goal.rotationY = this.goal.mesh.rotation.y;
    }
  }
  stop() {
    this.stopped = true;
  }
  reset() {
    this.time = 0;
    this.stopped = false;
    for (const actor of this.actors) {
      actor.cooldown = -10;
      actor.sink = 0;
      this.pose(actor, true);
    }
    this.updateCoins();
    if (this.goal) {
      this.goal.quaternion?.copy(this.goal.mesh.quaternion);
      this.goal.rotationY = this.goal.mesh.rotation.y;
    }
  }
  destroy() {
    this.actors.length = 0;
    this.coins.length = 0;
  }
}
