import {createWheelTrainMesh} from './WheelTrain';
import {createConcertModel,concertLift,createPlazaGarland} from "./world-01/ConcertModel";
import { createClosedTramRails, TramPassengerGuard, tramTrack } from './TramTrack';
import {fanMotion} from './FanMotion';
import { mattressLaunchSpeed } from "./MattressBounce";
import { meshColliderData } from '../physics/MeshColliderData';
import {createIcecreamRamp} from './world-02/IcecreamRamp';
import {popeyeArtwork} from '../rendering/PopeyeArtwork';
import {palmLaunchSpeed} from './world-02/PalmBounce';
import { createStaticStallShadow } from '../rendering/StaticStallShadow';
import { artDirection } from '../rendering/ArtDirection';
import {createNorwayModel} from './world-08/NorwayModels';
import {NorwayLevel} from './world-08/NorwayLevel';
import * as THREE from "three";
import {coastalYacht,coastalStall,coastalShop,attachCoastalPhysics} from "./world-02/CoastalModels";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { sampleVivaGymObstacle } from "./RequestedStageUpdates";
import {bikeWheelPose} from './BikeCourse';
import {surfaceFamily} from '../rendering/ArtDirection';
import type RAPIER from "@dimforge/rapier3d-compat";
import type { LevelData, LevelObjectData } from "./LevelTypes";
import type { PhysicsWorld } from "../physics/PhysicsWorld";
import { SpriteTextures } from "../rendering/SpriteTextures";
import {CollectibleVisual} from '../rendering/CollectibleVisual';
import { WaterWaveSimulator } from "../rendering/WaterSimulator";
import {disposeStageResources,retainSharedTexture} from '../rendering/StageResources';
import { createNaturalWaterTexture } from "../rendering/WaterAppearance";
import { createCovadongaModel } from "./world-05/CovadongaModels";
import { CovadongaLevel } from "./world-05/CovadongaLevel";
import { createLondonModel } from "./world-06/LondonModels";
import { LondonLevel } from "./world-06/LondonLevel";
import { createMuseumModel } from "./world-06/MuseumModels";
import { MuseumLevel } from "./world-06/MuseumLevel";
import { createOxfordModel } from "./world-06/OxfordModels";
import { OxfordLevel } from "./world-06/OxfordLevel";
import {BigBenLevel} from './world-06/BigBenLevel';
import {createBigBenModel} from './world-06/BigBenModels';
import {createKyotoModel} from './world-07/KyotoModels';
import {KyotoLevel} from './world-07/KyotoLevel';
import {stabilizeNeonSurfaces} from './world-07/NeonSurfaces';
import {createNaraModel} from './world-07/NaraModels';
import {NaraLevel} from './world-07/NaraLevel';
import {createOsakaModel} from './world-07/OsakaModels';
import {TokyoLevel} from './world-07/TokyoLevel';
import {createTokyoModel} from './world-07/TokyoModels';
import {OsakaLevel} from './world-07/OsakaLevel';
import { createAsturiasModel, getAsturiasFinish } from "./world-05/AsturiasModels";
import { OviedoActions } from "./world-05/OviedoActions";
import { CangasActions } from "./world-05/CangasActions";
import { createCangasModel } from "./world-05/CangasModels";
import { createSellaModel } from "./world-05/SellaModels";
import { SellaLevel } from "./world-05/SellaLevel";
import { attachSellaTrees } from "./world-05/SellaTrees";
import type { SellaWater } from "./world-05/SellaWater";

export interface ActiveCollectible {
  id: string;
  position: THREE.Vector3;
  mesh: THREE.Object3D;
  collected: boolean;
  baseX: number;
  baseY: number;
  baseZ: number;
  axis?: "x" | "y" | "z";
  distance?: number;
  speed?: number;
  movementType?: "sine" | "forward" | "linear" | "loop" | "gate" | "teleferico";
  direction?: number;
  startDelay?: number;
}

export interface ActiveMovingPlatform {
  id: string;
  mesh: THREE.Mesh | THREE.Group;
  body: RAPIER.RigidBody;
  basePosition: THREE.Vector3;
  axis: "x" | "y" | "z" | "yz" | "none";
  distance: number;
  speed: number;
  movementType?:
    | "sine"
    | "forward"
    | "linear"
    | "loop"
    | "gate"
    | "teleferico"
    | "circular"
    | "orbit"
    | "olla"
    | "padel_racket"
    | "bread_roller"
    | "pipe_shuttle"
    | "clock_hand"
    | "limp_kicker"
    | "concert_vibe"
    | "lifeguard_sweeper"
    | "sea_urchin"
    | "apartment_elevator"
    | "mattress_bouncer"
    | "fan_5blades"
    | "tram_circle"
    | "tram_square"
    | "tram_linear"
    | "emt_bus_35"
    | "emt_bus_34"
    | "clapping_gloves"
    | "residential_elevator_2f"
    | "street_patrol_man"
    | "casino_roulette"
    | "bike_pedal"
    | "bike_wheel_vertical"
    | "giant_umbrella"
    | "icecream_spin"
    | "palm_bouncer"
    | "towel_wave"
    | "wave_pusher"
    | "popeye_pizza"
    | "village_dogs"
    | "village_girls"
    | "village_boys"
    | "slamming_door"
    | "turron_cat"
    | "tilt_x"
    | "litos_duo"
    | "accelerating_wall"
    | "vertical_circle"
    | "quesarito_roll"
    | "vivagym_treadmill"
    | "vivagym_obstacle";
  continuousRoll?: boolean;
  side?: "left" | "right";
  eliminatesPlayer?: boolean;
  direction?: number;
  startDelay?: number;
  cycleTime?: number;
  waveAmplitude?: number;
  waveSpeed?: number;
  slopeY?: number;
  rotSpeed?: number;
  rollSpeed?: number;
  pushSpeed?: number;
  tiltSpeed?: number;
  maxTilt?: number;
  lastBoostTime?: number;
  centerX?: number;
  centerY?: number;
  centerZ?: number;
  radius?: number;
  phase?: number;
  baseAngle?: number;
  trackWidth?: number;
  trackLength?: number;
  cornerRadius?: number;
  subMeshes?: Record<string, THREE.Object3D>;
  // World 4 Padel Racket & Dynamic Interactive Fields
  baseRotation?: THREE.Euler;
  baseQuaternion?: THREE.Quaternion;
  headWidth?: number;
  headDepth?: number;
  targetPosition?: THREE.Vector3;
  launchMode?: string;
  // World 2 Elevator & Interactive State Fields
  currentFloor?: number;
  targetFloor?: number;
  elevatorState?: string;
  floorTimer?: number;
  playerWasInside?: boolean;
  spikesOut?: boolean;
  tramPassenger?: TramPassengerGuard;
  tramPath?: ReturnType<typeof tramTrack>;
  bounceCount?: number;
  lastBounceTime?: number;
  // Tilting Ramp (tilt_x) Fields
  minAngle?: number;
  maxAngle?: number;
  hingeZ?: number;
  hingeY?: number;
  pauseBottom?: number;
  pauseTop?: number;
  riseTime?: number;
  fallTime?: number;
  linkedCollectibles?: { item: ActiveCollectible; localOffset: THREE.Vector3 }[];
}

export interface ActiveBull {
  id: string;
  group: THREE.Group;
  headGroup: THREE.Group;
  body: RAPIER.RigidBody;
  baseX: number;
  baseY: number;
  baseZ: number;
  distance: number;
  speed: number;
  phase: number;
  axis?: "x" | "z";
}

export interface ActiveGoal {
  position: THREE.Vector3;
  mesh: THREE.Object3D;
  bannerMesh?: THREE.Mesh;
  portalMesh?: THREE.Mesh;
  reached: boolean;
  rotationY?: number;
  quaternion?: THREE.Quaternion;
}

export interface ActiveWaterBlock {
  river?:SellaWater;
  id: string;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  mesh: THREE.Mesh;
  surfaceMesh: THREE.Mesh;
  simulator: WaterWaveSimulator;
  material: THREE.Material;
  clusterCenterX?: number;
  clusterCenterZ?: number;
  passable?: boolean;
  fluidType?: "water" | "honey";
  dragFactor?: number;
}

export interface ActiveLavaBlock {
  id: string;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  mesh: THREE.Mesh;
  material: THREE.Material;
}

export interface ActiveDecoration {
  id: string;
  subType: string;
  group: THREE.Group;
  baseY: number;
  baseRotY: number;
  animOffset: number;
  wings?: [THREE.Mesh, THREE.Mesh];
}

export interface BuiltLevel {
  osaka?:OsakaLevel;
  norway?:NorwayLevel;
  tokyo?:TokyoLevel;
  nara?:NaraLevel;
  kyoto?:KyotoLevel;
  bigben?:BigBenLevel;
  museum?:MuseumLevel;
  oxford?:OxfordLevel;
  london?:LondonLevel;
  covadonga?:CovadongaLevel;
  canoe?:SellaLevel;
  group: THREE.Group;
  collectibles: ActiveCollectible[];
  movingPlatforms: ActiveMovingPlatform[];
  waterBlocks: ActiveWaterBlock[];
  lavaBlocks: ActiveLavaBlock[];
  decorations?: ActiveDecoration[];
  bulls?: ActiveBull[];
  collidableMeshes: THREE.Mesh[];
  goal: ActiveGoal | null;
  spawnPoint: THREE.Vector3;
  destroy: () => void;
  update: (delta: number, isIntroActive?: boolean, playerPos?: THREE.Vector3, player?: any) => true | void;
  setQuality?: (quality: "low" | "medium" | "high") => void;
  reset?: () => void;
}

export class LevelBuilder {
  build(
    data: LevelData,
    physics: PhysicsWorld,
    collectibleId: string,
    currentQuality: "low" | "medium" | "high" = "medium"
  ): BuiltLevel {
    // Visual profiles must never rebuild a different collision mesh or change a platform's silhouette.
    let activeQuality = 'medium' as 'low'|'medium'|'high';
    const root = new THREE.Group();
    const oviedo = data.world === 5 && data.level === 1 ? new OviedoActions(root, physics) : null;
    const cangas = data.world === 5 && data.level === 2 ? new CangasActions(physics) : null;
    const canoe = data.world===5 && data.level===3 || data.properties?.sellaCanoe===true ? new SellaLevel(data,physics) : undefined;
    const covadonga=data.world===5 && data.level===4 ? new CovadongaLevel(data,physics):undefined;
    const london=data.world===6&&data.level===1 ? new LondonLevel(data,physics,root):undefined;
    const museum=data.world===6&&data.level===2 ? new MuseumLevel(data,physics):undefined;
    const oxford=data.world===6&&data.level===3 ? new OxfordLevel(data,physics):undefined;
    const bigben=data.world===6&&data.level===4 ? new BigBenLevel(data,physics):undefined;
    const kyoto=data.world===7&&data.level===1 ? new KyotoLevel(data,physics):undefined;
    const nara=data.world===7&&(data.level===2||data.level===3||data.level===4) ? new NaraLevel(data,physics):undefined;
    const norway=data.world===8&&(data.level>=1&&data.level<=4)?new NorwayLevel(physics,data):undefined;
    const tokyo=data.world===7&&data.level===4 ? new TokyoLevel(physics,data):undefined;
    const osaka=data.world===7&&data.level===3 ? new OsakaLevel(physics):undefined;
    const collectibles: ActiveCollectible[] = [];
    const movingPlatforms: ActiveMovingPlatform[] = [];
    const waterBlocks: ActiveWaterBlock[] = [];
    const lavaBlocks: ActiveLavaBlock[] = [];
    const decorations: ActiveDecoration[] = [];
    const activeBulls: ActiveBull[] = [];
    const collidableMeshes: THREE.Mesh[] = [];
    const platformMeshes: Array<{
      mesh: THREE.Mesh;
      isMoving: boolean;
      properties?: Record<string, unknown>;
      objIndex: number;
    }> = [];
    let goal: ActiveGoal | null = null;
    let palmApex=0;
    const palmLaunchY=data.world===2&&data.level===4&&data.stage===2?Math.min(...data.objects.filter(o=>o.type==='bumper').map(o=>o.position.y+o.scale.y/2+.75)):0;

    const bumperMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0055,
      specular: 0xffffff,
      shininess: 80
    });


    const tempEuler = new THREE.Euler(0, 0, 0, "YXZ");
    const tempQuat = new THREE.Quaternion();

    const blockSet = SpriteTextures.getWorldBlockSet(data.world, data.level);

    // High-performance material cache: avoids creating hundreds of redundant shader programs
    const materialCache = new Map<string, THREE.Material | THREE.Material[]>();

    const createPlatformMeshMaterial = (
      _sx: number,
      _sy: number,
      _sz: number,
      isMoving = false,
      properties?: Record<string, unknown>,
      objIndex = 0
    ): THREE.Material | THREE.Material[] => {
      const propTheme = (properties?.theme as string) || "default";
      const customColor = (properties?.customColor as string) || (properties?.color as string);
      const offsetIndex = objIndex % 4;
      const finish = properties?.asturiasFinish;
      const cacheKey = `${propTheme}_${customColor || ""}_${finish ?? ""}_${isMoving ? "mov" : "sta"}_${activeQuality}_${offsetIndex}_${surfaceFamily(data.objects[objIndex]?.id??'')}`;

      const cached = materialCache.get(cacheKey);
      if (cached) return cached;

      const applyPolygonOffset = (mat: THREE.Material) => {
        mat.polygonOffset = true;
        mat.polygonOffsetFactor = -1 * (offsetIndex + 1);
        mat.polygonOffsetUnits = -1 * (offsetIndex + 1);
      };

      const makeMaterial = (
        map: THREE.Texture | null,
        colorVal: number | string | null,
        emissiveColor: THREE.Color,
        roughnessVal = 0.5,
        metalnessVal = 0.05
      ): THREE.Material => {
        const color = colorVal !== null ? new THREE.Color(colorVal as any) : new THREE.Color(0xffffff);
        const mat=new THREE.MeshStandardMaterial({color,emissive:emissiveColor,roughness:roughnessVal,metalness:metalnessVal,map});
        applyPolygonOffset(mat);
        return mat;
      };

      if (propTheme === "custom_color" && customColor) {
        const texture = typeof finish === "string" ? getAsturiasFinish(finish) : null;
        const mat = makeMaterial(texture, texture ? null : customColor, isMoving ? new THREE.Color(0x222233) : new THREE.Color(0x000000), 0.4, 0.1);
        materialCache.set(cacheKey, mat);
        return mat;
      }

      if (propTheme === "gold") {
        const mat = makeMaterial(null, 0xffd700, isMoving ? new THREE.Color(0x332200) : new THREE.Color(0x000000), 0.25, 0.85);
        materialCache.set(cacheKey, mat);
        return mat;
      }

      if (propTheme === "chrome") {
        const mat = makeMaterial(null, 0xcccccc, isMoving ? new THREE.Color(0x222222) : new THREE.Color(0x000000), 0.15, 0.95);
        materialCache.set(cacheKey, mat);
        return mat;
      }

      if (propTheme === "drawing_sheet" || propTheme === "coloring_sheet") {
        const sheetIndex = (properties?.sheetIndex as number) || (objIndex + 1);
        const coloringTex = SpriteTextures.getColoringPageTexture(sheetIndex);
        const sideMat = makeMaterial(null, 0xf7f5ee, isMoving ? new THREE.Color(0x111111) : new THREE.Color(0x000000), 0.88, 0.02);
        const botMat = makeMaterial(null, 0xeeebe2, isMoving ? new THREE.Color(0x111111) : new THREE.Color(0x000000), 0.92, 0.01);
        const topMat = makeMaterial(coloringTex, 0xffffff, isMoving ? new THREE.Color(0x222222) : new THREE.Color(0x000000), 0.78, 0.02);
        const matArray = [sideMat, sideMat, topMat, botMat, sideMat, sideMat];
        materialCache.set(cacheKey, matArray);
        return matArray;
      }

      if (propTheme === "carril_bici") {
        const bikeTex = SpriteTextures.getBikeLaneTexture();
        const topMat = makeMaterial(bikeTex, null, isMoving ? new THREE.Color(0x330000) : new THREE.Color(0x000000), 0.5, 0.05);
        const curbMat = makeMaterial(null, 0x1b5e20, isMoving ? new THREE.Color(0x002200) : new THREE.Color(0x000000), 0.6, 0.05);
        const matArray = [curbMat, curbMat, topMat, curbMat, curbMat, curbMat];
        materialCache.set(cacheKey, matArray);
        return matArray;
      }

      let targetSet = blockSet;
      if (propTheme === "villamanta") targetSet = SpriteTextures.getWorldBlockSet(1);
      else if (propTheme === "alicante") targetSet = SpriteTextures.getWorldBlockSet(2);
      else if (propTheme === "mesegal") targetSet = SpriteTextures.getWorldBlockSet(3);
      else if (propTheme === "era_slate") targetSet = SpriteTextures.getEraSlateBlockSet();
      else if (propTheme === "pebbles") targetSet = SpriteTextures.getPebblesBlockSet();
      else if (propTheme === "carabanchel") targetSet = SpriteTextures.getWorldBlockSet(4);
      else if (propTheme === "asturias") targetSet = SpriteTextures.getWorldBlockSet(5);
      else if (propTheme === "londres") targetSet = SpriteTextures.getWorldBlockSet(6);
      else if (propTheme === "sakura") targetSet = SpriteTextures.getWorldBlockSet(7, 1);
      else if (propTheme === "neon") targetSet = SpriteTextures.getWorldBlockSet(7, 3);
      else if (propTheme === "noruega") targetSet = SpriteTextures.getWorldBlockSet(8);

      const emissive = isMoving ? targetSet.movingEmissiveColor : targetSet.emissiveColor;

      const topMat = makeMaterial(targetSet.top, null, emissive, 0.45, 0.08);
      const botMat = makeMaterial(targetSet.bottom, null, emissive, 0.65, 0.05);
      const sideXMat = makeMaterial(targetSet.sideX, null, emissive, 0.55, 0.06);
      const sideZMat = makeMaterial(targetSet.sideZ, null, emissive, 0.55, 0.06);

      const matArray = [sideXMat, sideXMat, topMat, botMat, sideZMat, sideZMat];
      materialCache.set(cacheKey, matArray);
      return matArray;
    };

    const attachTerrain = (mesh: THREE.Mesh, blocksCameraOnSlopes = false) => {
      mesh.updateWorldMatrix(true, false);
      const points = mesh.geometry.getAttribute("position");
      const vertices = new Float32Array(points.count * 3);
      const vertex = new THREE.Vector3();
      for (let i = 0; i < points.count; i++) {
        vertex.fromBufferAttribute(points, i).applyMatrix4(mesh.matrixWorld).toArray(vertices, i * 3);
      }
      const index = mesh.geometry.getIndex();
      const indices = index
        ? new Uint32Array(index.array)
        : Uint32Array.from({ length: points.count }, (_, i) => i);
      const collider=physics.createTrimeshCollider(vertices, indices, .035, .72);
      mesh.userData.blocksCameraOnSlopes = blocksCameraOnSlopes;
      collidableMeshes.push(mesh);
      return collider;
    };

    data.objects.forEach((obj, objIdx) => {
      tempEuler.set(obj.rotation.x, obj.rotation.y, obj.rotation.z, "YXZ");
      tempQuat.setFromEuler(tempEuler);

      if(obj.properties?.subType==="asturias_sella_river") {
        const model=LevelBuilder.createDecorationMesh(obj,activeQuality);root.add(model.group);canoe?.attach(obj,model.group);
        if(obj.properties.bankCollision!==false) {
          for(const mesh of model.meshes) canoe?.addHazard(attachTerrain(mesh,true));
          attachSellaTrees(model.group,physics,collidableMeshes,collider=>canoe?.addHazard(collider));
        }
        const river=model.group.userData.sellaWater as SellaWater,surface=model.group.getObjectByName("sella-water") as THREE.Mesh;
        waterBlocks.push({id:obj.id,position:new THREE.Vector3().copy(obj.position),scale:new THREE.Vector3(river.width,6,river.arc[river.arc.length-1]),
          mesh:surface,surfaceMesh:surface,material:river.material,simulator:river.simulator,passable:true,fluidType:"water",dragFactor:3.4,river});
        return;
      }

      if (oviedo && obj.type === "platform" && obj.properties?.asturiasAction === "hatch") {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(obj.scale.x, obj.scale.y, obj.scale.z),
          createPlatformMeshMaterial(obj.scale.x, obj.scale.y, obj.scale.z, false, obj.properties, objIdx));
        mesh.position.copy(obj.position);
        mesh.rotation.copy(tempEuler);
        root.add(mesh);
        oviedo.attach(obj, mesh);
        return;
      }

      switch (obj.type) {
        case "platform":
        case "moving-platform": {
          const isSlammingDoor = obj.properties?.variant === "slamming_door" || obj.properties?.movementType === "slamming_door";
          if (isSlammingDoor) {
            const doorRes = LevelBuilder.createDoorMesh(activeQuality);
            const doorGroup = doorRes.group;
            doorGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            doorGroup.rotation.copy(tempEuler);
            root.add(doorGroup);
            collidableMeshes.push(...doorRes.meshes);
            platformMeshes.push({ mesh: doorRes.doorLeaf, isMoving: true, properties: obj.properties, objIndex: objIdx });

            const frame = meshColliderData(doorRes.meshes.filter(m => m.parent === doorGroup), root);
            physics.createTrimeshCollider(frame.vertices, frame.indices, .02, .6);
            const leaf = meshColliderData(doorRes.meshes.filter(m => m.parent === doorRes.doorPivot), doorRes.doorPivot);
            const hinge = doorRes.doorPivot.getWorldPosition(new THREE.Vector3());
            const kinematic = physics.createKinematicTrimesh(hinge, leaf.vertices, leaf.indices, .02, .4, tempQuat);
            if (kinematic) {
              movingPlatforms.push({
                id: obj.id,
                mesh: doorGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "none",
                distance: 0,
                speed: typeof obj.properties?.speed === "number" ? obj.properties.speed : 1.0,
                phase: typeof obj.properties?.phase === "number" ? obj.properties.phase : 0,
                baseQuaternion: tempQuat.clone(),
                subMeshes: { doorPivot: doorRes.doorPivot },
                movementType: "slamming_door"
              });
            }
            break;
          }

          const isLitosDuo = obj.properties?.variant === "litos_duo" || obj.properties?.movementType === "litos_duo" || obj.properties?.variant === "madrid_duo_132b";
          if (isLitosDuo) {
            const is132B = obj.properties?.variant === "madrid_duo_132b";
            const duoRes = is132B
              ? LevelBuilder.createMadridDuo132BMesh(activeQuality)
              : LevelBuilder.createLitosDuoMesh(activeQuality);
            const duoGroup = duoRes.group;
            duoGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            duoGroup.rotation.copy(tempEuler);

            root.add(duoGroup);
            collidableMeshes.push(...duoRes.meshes);
            platformMeshes.push({ mesh: duoRes.meshes[0] || (duoGroup as any), isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              { x: obj.position.x, y: obj.position.y + 0.95, z: obj.position.z },
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: 0.85, y: 0.95, z: 0.35 },
              0.9,
              0.3
            );
            if (kinematic) {
              movingPlatforms.push({
                id: obj.id,
                mesh: duoGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: (obj.properties?.axis as any) || "z",
                distance: typeof obj.properties?.distance === "number" ? obj.properties.distance : 10.0,
                speed: typeof obj.properties?.speed === "number" ? obj.properties.speed : 1.0,
                direction: typeof obj.properties?.direction === "number" ? obj.properties.direction : 1,
                phase: typeof obj.properties?.phase === "number" ? obj.properties.phase : 0,
                movementType: "litos_duo",
                cycleTime: typeof obj.properties?.cycleTime === "number" ? obj.properties.cycleTime : 3.2
              });
            }
            break;
          }

          // -----------------------------------------------------------------
          // Variant: Galway Clapping Gloves (M4-N2-E6 Galway)
          // -----------------------------------------------------------------
          const isClappingGloves = obj.properties?.variant === "clapping_gloves" || obj.properties?.movementType === "clapping_gloves";
          if (isClappingGloves) {
            const side = (obj.properties?.side as "left" | "right") || (obj.position.x < 0 ? "left" : "right");
            const gloveRes = LevelBuilder.createClappingGlovesMesh(side, activeQuality);
            const gloveGroup = gloveRes.group;
            gloveGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            gloveGroup.rotation.copy(tempEuler);

            root.add(gloveGroup);
            collidableMeshes.push(...gloveRes.meshes);
            platformMeshes.push({ mesh: gloveRes.meshes[0] || (gloveGroup as any), isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              { x: obj.position.x, y: obj.position.y + 0.8, z: obj.position.z },
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: 1.1, y: 1.1, z: 1.6 },
              0.9,
              0.3
            );
            if (kinematic) {
              movingPlatforms.push({
                id: obj.id,
                mesh: gloveGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "x",
                distance: 4.2,
                speed: typeof obj.properties?.speed === "number" ? obj.properties.speed : 1.0,
                side,
                movementType: "clapping_gloves",
                cycleTime: typeof obj.properties?.cycleTime === "number" ? obj.properties.cycleTime : 2.2
              });
            }
            break;
          }

          // -----------------------------------------------------------------
          // Variant: 2-Stop Residential Elevator (M4-N2-E7 13 2ºB)
          // -----------------------------------------------------------------
          const isElevator2F = obj.properties?.variant === "residential_elevator_2f" || obj.properties?.movementType === "residential_elevator_2f";
          if (isElevator2F) {
            const elevRes = LevelBuilder.createElevator2FMesh(obj.scale.x || 4.2, obj.scale.y || 0.45, obj.scale.z || 4.2, activeQuality);
            const elevGroup = elevRes.group;
            elevGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            elevGroup.rotation.copy(tempEuler);

            root.add(elevGroup);
            collidableMeshes.push(...elevRes.meshes);
            platformMeshes.push({ mesh: elevRes.floorMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              { x: obj.position.x, y: obj.position.y + 0.15, z: obj.position.z },
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: 2.1, y: 0.15, z: 2.1 },
              0.8,
              0.2
            );
            if (kinematic) {
              physics.addBoxColliderToBody(kinematic.body, { x: -2.0, y: 1.25, z: 0 }, { x: 0.1, y: 1.25, z: 2.0 });
              physics.addBoxColliderToBody(kinematic.body, { x: 2.0, y: 1.25, z: 0 }, { x: 0.1, y: 1.25, z: 2.0 });
              physics.addBoxColliderToBody(kinematic.body, { x: 0, y: 1.25, z: 2.0 }, { x: 2.0, y: 1.25, z: 0.1 });

              movingPlatforms.push({
                id: obj.id,
                mesh: elevGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "y",
                distance: 9.0,
                speed: typeof obj.properties?.speed === "number" ? obj.properties.speed : 2.4,
                cycleTime: typeof obj.properties?.cycleTime === "number" ? obj.properties.cycleTime : 12.0,
                movementType: "residential_elevator_2f"
              });
            }
            break;
          }

          // -----------------------------------------------------------------
          // Variant: Street Patrol Hooded Man (M4-N2-E10 Ninanos)
          // -----------------------------------------------------------------
          const isHoodedMan = obj.properties?.variant === "carabanchel_hooded_man" || obj.properties?.movementType === "street_patrol_man";
          if (isHoodedMan) {
            const hoodieColor = (obj.properties?.hoodieColor as string) || "#1e293b";
            const manRes = LevelBuilder.createHoodedManMesh(hoodieColor, activeQuality);
            const manGroup = manRes.group;
            manGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            manGroup.rotation.copy(tempEuler);

            root.add(manGroup);
            collidableMeshes.push(...manRes.meshes);
            platformMeshes.push({ mesh: manRes.meshes[0] || (manGroup as any), isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              { x: obj.position.x, y: obj.position.y + 0.9, z: obj.position.z },
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: 0.45, y: 0.9, z: 0.4 },
              0.8,
              0.2
            );
            if (kinematic) {
              movingPlatforms.push({
                id: obj.id,
                mesh: manGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "x",
                distance: typeof obj.properties?.distance === "number" ? obj.properties.distance : 5.2,
                speed: typeof obj.properties?.speed === "number" ? obj.properties.speed : 2.2,
                phase: typeof obj.properties?.phase === "number" ? obj.properties.phase : 0,
                movementType: "street_patrol_man",
                eliminatesPlayer: Boolean(obj.properties?.eliminatesPlayer)
              });
            }
            break;
          }

          // -----------------------------------------------------------------
          // Variant: Funko Pop Box (M4-N4-E3 ToyPlanet)
          // -----------------------------------------------------------------
          const isFunkoBox = obj.properties?.variant === "funko_pop_box";
          if (isFunkoBox) {
            const w = obj.scale.x || 4.2;
            const h = obj.scale.y || 5.2;
            const d = obj.scale.z || 3.8;
            const funkoSeries = (obj.properties?.series as "dragon_ball" | "harry_potter" | "disney") || "dragon_ball";
            const funkoRes = LevelBuilder.createFunkoBoxMesh(w, h, d, activeQuality, funkoSeries);
            const funkoGroup = funkoRes.group;
            funkoGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            funkoGroup.rotation.copy(tempEuler);

            root.add(funkoGroup);
            collidableMeshes.push(...funkoRes.meshes);
            platformMeshes.push({ mesh: funkoRes.meshes[0] || (funkoGroup as any), isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: w / 2, y: h / 2, z: d / 2 },
              0.25,
              0.75
            );
            if (kinematic) {
              kinematic.collider.setTranslationWrtParent({ x: 0, y: h / 2, z: 0 });
              const axis = (obj.properties?.axis as "x" | "y" | "z" | "yz") || "x";
              const distance = typeof obj.properties?.distance === "number" ? obj.properties.distance : 10.0;
              const speed = typeof obj.properties?.speed === "number" ? obj.properties.speed : 2.0;
              const movementType = (obj.properties?.movementType as any) || "sine";
              const direction = typeof obj.properties?.direction === "number" ? obj.properties.direction : 1;
              const radius = typeof obj.properties?.radius === "number" ? obj.properties.radius : 5.5;
              const centerY = typeof obj.properties?.centerY === "number" ? obj.properties.centerY : obj.position.y;
              const centerZ = typeof obj.properties?.centerZ === "number" ? obj.properties.centerZ : obj.position.z;
              const phase = typeof obj.properties?.phase === "number" ? obj.properties.phase : 0;

              movingPlatforms.push({
                id: obj.id,
                mesh: funkoGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                baseRotation: tempEuler.clone(),
                baseQuaternion: tempQuat.clone(),
                axis,
                distance,
                speed,
                movementType,
                direction,
                radius,
                centerY,
                centerZ,
                phase
              });
            }
            break;
          }

          // -----------------------------------------------------------------
          // Variant: Quesarito Continuous Roll (M4-N4-E7 TacoBell)
          // -----------------------------------------------------------------
          const isQuesarito = obj.properties?.variant === "quesarito_cylinder" || obj.properties?.movementType === "quesarito_roll";
          if (isQuesarito) {
            const rad = typeof obj.properties?.radius === "number" ? obj.properties.radius : (obj.scale.x ? obj.scale.x / 2 : 4.6);
            const len = obj.scale.z || 68.0;
            const quesaritoRes = LevelBuilder.createQuesaritoMesh(rad, len, activeQuality);
            const qGroup = quesaritoRes.group;
            qGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            qGroup.rotation.copy(tempEuler);

            root.add(qGroup);
            collidableMeshes.push(...quesaritoRes.meshes);
            platformMeshes.push({ mesh: quesaritoRes.meshes[0] || (qGroup as any), isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicCylinder(
              obj.position,
              rad,
              len / 2,
              0.12,
              0.48,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }
            );
            if (kinematic) {
              kinematic.collider.setRotationWrtParent({ x: Math.SQRT1_2, y: 0, z: 0, w: Math.SQRT1_2 });
              const speed = typeof obj.properties?.speed === "number" ? obj.properties.speed : 0.7;
              const rollSpeed = typeof obj.properties?.rollSpeed === "number" ? obj.properties.rollSpeed : speed;

              movingPlatforms.push({
                id: obj.id,
                mesh: qGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                baseRotation: tempEuler.clone(),
                baseQuaternion: tempQuat.clone(),
                axis: "z",
                distance: 0,
                speed,
                rollSpeed,
                radius: rad,
                movementType: "quesarito_roll"
              });
            }
            break;
          }

          // -----------------------------------------------------------------
          // Variant: VivaGYM Active Treadmill (M4-N4-E10 VivaGYM)
          // -----------------------------------------------------------------
          const isVivaGymTreadmill = obj.properties?.variant === "vivagym_treadmill" || obj.properties?.movementType === "vivagym_treadmill";
          if (isVivaGymTreadmill) {
            const w = obj.scale.x || 22.0;
            const h = obj.scale.y || 4.2;
            const len = obj.scale.z || 84.0;
            const millRes = LevelBuilder.createVivaGymTreadmillMesh(w, h, len, activeQuality);
            const millGroup = millRes.group;
            millGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            millGroup.rotation.copy(tempEuler);

            root.add(millGroup);
            collidableMeshes.push(...millRes.meshes);
            platformMeshes.push({ mesh: millRes.meshes[0] || (millGroup as any), isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              { x: obj.position.x, y: obj.position.y + 0.45, z: obj.position.z },
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: w / 2, y: 0.45, z: len / 2 },
              0.85,
              0.1
            );
            if (kinematic) {
              const pushSpeed = typeof obj.properties?.pushSpeed === "number" ? obj.properties.pushSpeed : 1.0;
              movingPlatforms.push({
                id: obj.id,
                mesh: millGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                baseRotation: tempEuler.clone(),
                baseQuaternion: tempQuat.clone(),
                axis: "none",
                distance: 0,
                speed: pushSpeed,
                pushSpeed,
                movementType: "vivagym_treadmill"
              });
            }
            break;
          }

          const isMoving = obj.type === "moving-platform" || Boolean(obj.properties?.isMoving);

          if (!isMoving) {
            // Chalkboard Platform (M4-N2-E6 Galway)
            if (obj.properties?.variant === "chalkboard_platform") {
              const w = obj.scale.x || 11.0;
              const h = obj.scale.y || 0.8;
              const d = obj.scale.z || 42.0;
              const chalkRes = LevelBuilder.createChalkboardMesh(w, h, d, activeQuality);
              chalkRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              chalkRes.group.rotation.copy(tempEuler);
              root.add(chalkRes.group);
              collidableMeshes.push(...chalkRes.meshes);
              platformMeshes.push({ mesh: chalkRes.boardMesh, isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: w / 2, y: h / 2, z: d / 2 },
                0.6,
                0.2
              );
              break;
            }

            // Continuous Serpentine Tongue of Yorkshire Rony (M4-N2-E8 Rony)
            if (obj.properties?.variant === "continuous_tongue") {
              const pathPts = (obj.properties?.pathPoints as Array<{ x: number; y: number; z: number }>) || undefined;
              const tongueWidth = typeof obj.properties?.width === "number" ? obj.properties.width : 4.2;
              const tongueRes = LevelBuilder.createContinuousTongueMesh(pathPts, tongueWidth, activeQuality);
              tongueRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              tongueRes.group.rotation.copy(tempEuler);
              root.add(tongueRes.group);
              collidableMeshes.push(...tongueRes.meshes);
              platformMeshes.push({ mesh: tongueRes.platformMesh, isMoving: false, properties: obj.properties, objIndex: objIdx });

              // Puntos de la trayectoria serpenteada para la física continua sin bordes invisibles
              const pts = pathPts || [
                { x: 0.0, y: 1.60, z: 34.0 },
                { x: 0.6, y: 1.52, z: 30.0 },
                { x: 1.6, y: 1.42, z: 25.0 },
                { x: 2.4, y: 1.32, z: 20.0 },
                { x: 1.8, y: 1.22, z: 15.0 },
                { x: 0.2, y: 1.12, z: 10.0 },
                { x: -1.4, y: 1.02, z: 5.0 },
                { x: -1.8, y: 0.94, z: 1.0 },
                { x: -0.6, y: 0.86, z: -1.5 },
                { x: 0.0, y: 0.80, z: -4.5 }
              ];

              const curvePoints = pts.map(p => new THREE.Vector3(p.x, p.y, p.z));
              const curve = new THREE.CatmullRomCurve3(curvePoints, false, "centripetal", 0.15);
              const sampleCount = 42;
              const sampled = curve.getPoints(sampleCount);

              for (let i = 0; i < sampled.length - 1; i++) {
                const p1 = sampled[i];
                const p2 = sampled[i + 1];
                const midX = (p1.x + p2.x) / 2 + obj.position.x;
                const midY = (p1.y + p2.y) / 2 + obj.position.y - 0.08;
                const midZ = (p1.z + p2.z) / 2 + obj.position.z;
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const dz = p2.z - p1.z;
                const len = Math.hypot(dx, dy, dz);
                const yaw = Math.atan2(dx, dz);
                const pitch = -Math.atan2(dy, Math.hypot(dx, dz));
                const segEuler = new THREE.Euler(pitch, yaw, 0, 'YXZ');
                const segQuat = new THREE.Quaternion().setFromEuler(segEuler);

                // Superficie de rodadura física pura (cero muros invisibles laterales para que el jugador pueda caerse libremente si no maniobra con pericia)
                physics.createBoxCollider(
                  { x: midX, y: midY, z: midZ },
                  { x: segQuat.x, y: segQuat.y, z: segQuat.z, w: segQuat.w },
                  { x: (tongueWidth / 2) * 0.96, y: 0.15, z: (len / 2) * 1.04 },
                  0.45,
                  0.25
                );
              }
              break;
            }

            // Yorkshire Terrier Rony Giant Head Statue (M4-N2-E8 Rony)
            // Boca 100% hueca y transitable con enlace rasante continuo lengua -> suelo boca -> rampa
            if (obj.properties?.variant === "yorkshire_rony_statue") {
              const ronyRes = LevelBuilder.createYorkshireRonyMesh(activeQuality);
              ronyRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              ronyRes.group.rotation.copy(tempEuler);
              root.add(ronyRes.group);
              collidableMeshes.push(...ronyRes.meshes);
              platformMeshes.push({ mesh: ronyRes.meshes[0] || (ronyRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              // Pared lateral izquierda del carrillo (deja corredor libre de 3.8m entre X = -1.9 y +1.9)
              physics.createBoxCollider(
                { x: obj.position.x - 2.8, y: obj.position.y + 2.5, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: 0.9, y: 2.0, z: 2.0 },
                0.6,
                0.2
              );
              // Pared lateral derecha del carrillo
              physics.createBoxCollider(
                { x: obj.position.x + 2.8, y: obj.position.y + 2.5, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: 0.9, y: 2.0, z: 2.0 },
                0.6,
                0.2
              );
              // Techo del paladar y cráneo superior (y > 4.6m de despeje vertical)
              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + 5.5, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: 1.9, y: 0.9, z: 2.0 },
                0.6,
                0.2
              );
              // Suelo de paso continuo y liso por la boca (superficie a Y = 0.80, perfecto enlace rasante)
              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + 0.65, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: 1.9, y: 0.15, z: 2.0 },
                0.6,
                0.2
              );
              break;
            }

            // Floo Powder Fireplace (M4-N2-E9 Pao)
            if (obj.properties?.variant === "floo_fireplace") {
              const fireRes = LevelBuilder.createFlooFireplaceMesh(activeQuality);
              fireRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              fireRes.group.rotation.copy(tempEuler);
              root.add(fireRes.group);
              collidableMeshes.push(...fireRes.meshes);
              platformMeshes.push({ mesh: fireRes.meshes[0] || (fireRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              const pos = obj.position;
              physics.createBoxCollider(
                { x: pos.x, y: pos.y + 2.2, z: pos.z - 1.4 },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: 2.2, y: 2.2, z: 0.25 },
                0.7,
                0.1
              );
              physics.createBoxCollider(
                { x: pos.x - 1.8, y: pos.y + 2.2, z: pos.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: 0.4, y: 2.2, z: 1.4 },
                0.7,
                0.1
              );
              physics.createBoxCollider(
                { x: pos.x + 1.8, y: pos.y + 2.2, z: pos.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: 0.4, y: 2.2, z: 1.4 },
                0.7,
                0.1
              );
              physics.createBoxCollider(
                { x: pos.x, y: pos.y + 4.3, z: pos.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: 2.3, y: 0.25, z: 1.5 },
                0.7,
                0.1
              );
              // Leña con físicas dentro de la chimenea (Rapier colliders)
              physics.createBoxCollider(
                { x: pos.x, y: pos.y + 0.70, z: pos.z - 0.55 },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: 1.05, y: 0.35, z: 0.45 },
                0.7,
                0.3
              );
              break;
            }

            // Sobres Pokémon Maze Wall (M4-N3-E7 Carrefour)
            if (obj.properties?.variant === "pokemon_booster_wall") {
              const w = obj.scale.x || 8.0;
              const h = obj.scale.y || 3.4;
              const d = obj.scale.z || 0.6;
              const packIdx = typeof obj.properties?.packIndex === "number" ? obj.properties.packIndex : (objIdx % 4);
              const wallRes = LevelBuilder.createPokemonBoosterWallMesh(w, h, d, packIdx, activeQuality);
              wallRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              wallRes.group.rotation.copy(tempEuler);
              root.add(wallRes.group);
              collidableMeshes.push(...wallRes.meshes);
              platformMeshes.push({ mesh: wallRes.meshes[0] || (wallRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + h / 2, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: w / 2, y: h / 2, z: d / 2 },
                0.3,
                0.3
              );
              break;
            }

            // 3D Pirate Ship Structure (M4-N3-E6 Parque Pirata)
            if (obj.properties?.variant === "pirate_ship") {
              const shipRes = LevelBuilder.createPirateShipMesh(activeQuality);
              shipRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              shipRes.group.rotation.copy(tempEuler);
              root.add(shipRes.group);
              collidableMeshes.push(...shipRes.meshes);
              platformMeshes.push({ mesh: shipRes.meshes[0] || (shipRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              const createShipCollider = (
                localX: number,
                localY: number,
                localZ: number,
                halfX: number,
                halfY: number,
                halfZ: number,
                localRotQuat?: THREE.Quaternion,
                friction = 0.65,
                restitution = 0.2
              ) => {
                const worldPos = new THREE.Vector3(localX, localY, localZ).applyQuaternion(tempQuat).add(obj.position);
                const worldQuat = localRotQuat ? tempQuat.clone().multiply(localRotQuat) : tempQuat;
                physics.createBoxCollider(
                  worldPos,
                  { x: worldQuat.x, y: worldQuat.y, z: worldQuat.z, w: worldQuat.w },
                  { x: halfX, y: halfY, z: halfZ },
                  friction,
                  restitution
                );
              };

              // 1. Cubierta principal transitable
              createShipCollider(0, 0.45, 0, 4.45, 0.35, 13.9, undefined, 0.65, 0.2);

              // 2. Castillo de popa elevado (puente de mando)
              createShipCollider(0, 1.4, 10.2, 4.4, 0.6, 3.6, undefined, 0.65, 0.2);

              // 3. Cubierta de proa
              createShipCollider(0, 1.3, -10.2, 4.4, 0.5, 3.6, undefined, 0.65, 0.2);

              // 4. Muros y bordas laterales de babor y estribor (paredes sólidas continuas de 3m de altura)
              // Babor (izquierda): impide totalmente que el jugador caiga por el lateral al agua
              createShipCollider(-4.675, 1.6, 0, 0.3, 1.4, 14.1, undefined, 0.65, 0.2);
              // Estribor (derecha): impide totalmente que el jugador caiga por el lateral al agua
              createShipCollider(4.675, 1.6, 0, 0.3, 1.4, 14.1, undefined, 0.65, 0.2);

              // 5. Muro de detrás (Popa / Espejo de popa continuo y sólido de 9.3m de ancho)
              createShipCollider(0, 1.8, 13.9, 4.65, 1.4, 0.25, undefined, 0.65, 0.2);

              // 6. Muro de alante (Proa / Mamparo frontal continuo de 9m y tajamar afilado)
              createShipCollider(0, 2.3, -13.9, 4.5, 0.7, 0.25, undefined, 0.65, 0.2);
              createShipCollider(0, 1.5, -14.6, 0.9, 1.5, 0.8, undefined, 0.65, 0.2);

              // 7. Palo de alante (Bauprés / Bowsprit inclinado con colisiones físicas sólidas)
              const bowspritQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 3.2, 0, 0, "YXZ"));
              createShipCollider(0, 3.2, -16.5, 0.35, 3.5, 0.35, bowspritQuat, 0.7, 0.2);

              // 8. Mástil y Vela de Trinquete (Palo y Vela de alante en la cubierta)
              createShipCollider(0, 6.5, -5.5, 0.40, 5.75, 0.40, undefined, 0.6, 0.2); // Mástil de trinquete
              createShipCollider(0, 9.03, -5.5, 3.4, 0.20, 0.20, undefined, 0.6, 0.2); // Verga horizontal
              createShipCollider(0, 7.1, -5.4, 3.0, 2.0, 0.15, undefined, 0.6, 0.2); // Vela de trinquete

              // 9. Mástil y Vela Mayor (Palo mayor, verga, vela Jolly Roger y cofa de vigía)
              createShipCollider(0, 7.5, 2.0, 0.40, 7.0, 0.40, undefined, 0.6, 0.2); // Mástil mayor
              createShipCollider(0, 10.58, 2.0, 3.9, 0.20, 0.20, undefined, 0.6, 0.2); // Verga horizontal mayor
              createShipCollider(0, 8.2, 2.1, 3.5, 2.4, 0.15, undefined, 0.6, 0.2); // Vela mayor con calavera
              createShipCollider(0, 13.38, 2.0, 1.1, 0.6, 1.1, undefined, 0.7, 0.3); // Cofa de vigía

              // 10. Cañones de cubierta (4 cañones a babor y estribor con cureñas)
              const cannonPositions = [
                { x: -4.3, z: 2.0 },
                { x: -4.3, z: -4.0 },
                { x: 4.3, z: 2.0 },
                { x: 4.3, z: -4.0 }
              ];
              for (const cp of cannonPositions) {
                createShipCollider(cp.x, 1.1, cp.z, 0.65, 0.45, 0.75, undefined, 0.7, 0.3);
              }

              // 11. Timón de mando del capitán en el castillo de popa
              createShipCollider(0, 2.65, 12.0, 0.45, 0.75, 0.45, undefined, 0.7, 0.3);

              // 12. Quilla y carena inferior sólida del barco
              createShipCollider(0, -0.6, 0, 0.4, 0.7, 14.1, undefined, 0.65, 0.2);
              break;
            }

            // Arco Monumental Carrefour (M4-N3-E7 Carrefour)
            if (obj.properties?.variant === "carrefour_arch") {
              const w = obj.scale.x || 16.0;
              const h = obj.scale.y || 6.5;
              const archRes = LevelBuilder.createCarrefourArchMesh(w, h, activeQuality);
              archRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              archRes.group.rotation.copy(tempEuler);
              root.add(archRes.group);
              collidableMeshes.push(...archRes.meshes);
              platformMeshes.push({ mesh: archRes.meshes[0] || (archRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              // Pilares laterales con colisiones físicas
              for (const px of [-w / 2 + 0.6, w / 2 - 0.6]) {
                physics.createBoxCollider(
                  { x: obj.position.x + px, y: obj.position.y + h / 2, z: obj.position.z },
                  { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                  { x: 0.6, y: h / 2, z: 0.6 },
                  0.5,
                  0.2
                );
              }
              break;
            }

            // Chorro Propulsor Acuático del Lago (M4-N3-E10 Lago)
            if (obj.properties?.variant === "water_geyser") {
              const rad = obj.scale.x ? obj.scale.x / 2 : 2.4;
              const ht = obj.scale.y || 16.0;
              const geyserRes = LevelBuilder.createWaterGeyserMesh(rad, ht, activeQuality);
              geyserRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              geyserRes.group.rotation.copy(tempEuler);
              root.add(geyserRes.group);
              collidableMeshes.push(...geyserRes.meshes);
              platformMeshes.push({ mesh: geyserRes.meshes[0] || (geyserRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              // Brocal circular de granito en la base del lago
              physics.createCylinderCollider(
                { x: obj.position.x, y: obj.position.y + 0.35, z: obj.position.z },
                rad * 1.5,
                0.35,
                0.6,
                0.2
              );
              break;
            }

            // Kamehameha Tubular Round Energy Beam (Single continuous connected tube or individual segment)
            if (obj.properties?.variant === "kamehameha_beam") {
              const isContinuous =
                obj.id === "w4s19-kame-continuous-beam" ||
                Boolean(obj.properties?.continuous) ||
                (Array.isArray(obj.properties?.pathPoints) && obj.properties.pathPoints.length >= 2);

              if (isContinuous) {
                const pathPts = (obj.properties?.pathPoints as Array<{ x: number; y: number; z: number }>) || undefined;
                const beamRadius = typeof obj.properties?.beamRadius === "number" ? obj.properties.beamRadius : 1.8;
                const contRes = LevelBuilder.createContinuousKamehamehaMesh(pathPts, beamRadius, activeQuality);
                root.add(contRes.group);
                collidableMeshes.push(...contRes.meshes);
                platformMeshes.push({ mesh: contRes.platformMesh, isMoving: false, properties: obj.properties, objIndex: objIdx });

                // True circular 3D physics using Rapier trimesh collider
                if (typeof (physics as any).createTrimeshCollider === "function") {
                  const geo = contRes.tubeGeometry;
                  const v = geo.attributes.position.array instanceof Float32Array
                    ? geo.attributes.position.array
                    : new Float32Array(geo.attributes.position.array);
                  const idx = geo.index
                    ? (geo.index.array instanceof Uint32Array ? geo.index.array : new Uint32Array(geo.index.array))
                    : new Uint32Array();
                  (physics as any).createTrimeshCollider(v, idx, 0.45, 0.25);
                } else {
                  physics.createBoxCollider(
                    { x: 0, y: 2.0, z: -37.0 },
                    { x: 0, y: 0, z: 0, w: 1 },
                    { x: 3.5, y: 1.8, z: 60.0 },
                    0.55,
                    0.2
                  );
                }
                break;
              }

              // Individual segment
              const beamRes = LevelBuilder.createKamehamehaBeamMesh(obj.scale.x || 4.0, obj.scale.y || 0.8, obj.scale.z || 10.0, activeQuality);
              beamRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              beamRes.group.rotation.copy(tempEuler);
              root.add(beamRes.group);
              collidableMeshes.push(...beamRes.meshes);
              platformMeshes.push({ mesh: beamRes.platformMesh, isMoving: false, properties: obj.properties, objIndex: objIdx });

              const rad = (obj.scale.x || 4.0) / 2;
              const len = obj.scale.z || 10.0;
              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: rad * 0.92, y: (obj.scale.y || 0.8) / 2, z: len / 2 },
                0.55,
                0.2
              );
              break;
            }

            // Kamehameha Detonation Burst Sphere with Goal
            if (obj.properties?.variant === "kamehameha_burst") {
              const burstRes = LevelBuilder.createKamehamehaBurstMesh(obj.scale.x || 9.0, obj.scale.z || 9.0, activeQuality);
              burstRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              burstRes.group.rotation.copy(tempEuler);
              root.add(burstRes.group);
              collidableMeshes.push(...burstRes.meshes);
              platformMeshes.push({ mesh: burstRes.platformMesh, isMoving: false, properties: obj.properties, objIndex: objIdx });

              const rad = (obj.scale.x || 9.0) / 2;
              physics.createCylinderCollider(
                obj.position,
                rad * 0.95,
                (obj.scale.y || 0.8) / 2,
                0.55,
                0.2,
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }
              );
              break;
            }

            // Kamehameha Charge Origin Sphere
            if (obj.properties?.variant === "kamehameha_charge") {
              const chargeRes = LevelBuilder.createKamehamehaChargeMesh(obj.scale.x || 5.5, activeQuality);
              chargeRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              chargeRes.group.rotation.copy(tempEuler);
              root.add(chargeRes.group);
              collidableMeshes.push(...chargeRes.meshes);
              platformMeshes.push({ mesh: chargeRes.platformMesh, isMoving: false, properties: obj.properties, objIndex: objIdx });

              const rad = (obj.scale.x || 5.5) / 2;
              physics.createCylinderCollider(
                obj.position,
                rad * 0.95,
                (obj.scale.y || 0.8) / 2,
                0.55,
                0.2,
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }
              );
              break;
            }

            // 3D Luxury Yacht
            if (obj.properties?.variant === "yacht") {
              const yachtRes = LevelBuilder.createYachtMesh(activeQuality, obj.properties?.customColor as string, obj.properties?.cabinColor as string, obj.properties?.stripeColor as string);
              yachtRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              yachtRes.group.rotation.copy(tempEuler);
              root.add(yachtRes.group);
              collidableMeshes.push(...yachtRes.meshes);
              platformMeshes.push({ mesh: yachtRes.meshes[0] || yachtRes.group as any, isMoving: false, properties: obj.properties, objIndex: objIdx });

              attachCoastalPhysics(yachtRes.group,obj,physics);
              break;
            }

            // 3D Market Stall
            if (obj.properties?.variant === "market_stall") {
              const stallType = (obj.properties?.stallType as string) || "fruit";
              const c1 = (obj.properties?.customColor as string) || "#e53935";
              const c2 = (obj.properties?.stripeColor as string) || "#ffffff";
              const stallRes = LevelBuilder.createMarketStallMesh(activeQuality, stallType, c1, c2);
              stallRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              stallRes.group.rotation.copy(tempEuler);
              root.add(stallRes.group);
              if(data.world===2&&data.level===2&&data.stage===9) {
                const plaza=data.objects.find(object=>object.id==='w2s9-market-street');
                if(plaza) {
                  const bounds=new THREE.Box3(new THREE.Vector3(-.5,-.5,-.5),new THREE.Vector3(.5,.5,.5));
                  const transform=new THREE.Matrix4().compose(new THREE.Vector3().copy(plaza.position),new THREE.Quaternion().setFromEuler(new THREE.Euler(plaza.rotation.x,plaza.rotation.y,plaza.rotation.z)),new THREE.Vector3().copy(plaza.scale));
                  bounds.applyMatrix4(transform);
                  const shadow=createStaticStallShadow(stallRes.group,artDirection(data.world,data.level,data).sunOffset,bounds);
                  if(shadow)root.add(shadow);
                }
              }
              collidableMeshes.push(...stallRes.meshes);
              platformMeshes.push({ mesh: stallRes.meshes[0] || stallRes.group as any, isMoving: false, properties: obj.properties, objIndex: objIdx });

              attachCoastalPhysics(stallRes.group,obj,physics);
              break;
            }

            // 3D Shopping Mall Store
            if (obj.properties?.variant === "shop" || obj.properties?.variant === "store") {
              const shopType = (obj.properties?.shopType as string) || "icecream";
              const c1 = (obj.properties?.customColor as string) || "#00bcd4";
              const shopRes = LevelBuilder.createShopMesh(activeQuality, shopType, c1);
              shopRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              shopRes.group.rotation.copy(tempEuler);
              root.add(shopRes.group);
              collidableMeshes.push(...shopRes.meshes);
              platformMeshes.push({ mesh: shopRes.meshes[0] || shopRes.group as any, isMoving: false, properties: obj.properties, objIndex: objIdx });

              attachCoastalPhysics(shopRes.group,obj,physics);
              break;
            }

            // 3D Tram Rails and Ties
            if (obj.properties?.variant === "tram_rails") {
              const rails = LevelBuilder.createTramRailsMesh(obj.scale.x || 24.0, obj.scale.z || 24.0, (obj.properties?.cornerRadius as number) || 4.0);
              rails.position.set(obj.position.x, obj.position.y, obj.position.z);
              rails.rotation.copy(tempEuler);
              root.add(rails);
              break;
            }

            // 3D Beach Kiosk / Chiringuito del Sol (M2-N3-E1)
            if (obj.properties?.variant === "beach_kiosk") {
              const c1 = (obj.properties?.customColor as string) || "#00b4d8";
              const c2 = (obj.properties?.stripeColor as string) || "#ffffff";
              const kioskRes = LevelBuilder.createBeachKioskMesh(activeQuality, c1, c2);
              kioskRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              kioskRes.group.rotation.copy(tempEuler);
              root.add(kioskRes.group);
              collidableMeshes.push(...kioskRes.meshes);
              platformMeshes.push({ mesh: kioskRes.meshes[0] || kioskRes.group as any, isMoving: false, properties: obj.properties, objIndex: objIdx });

              const createKioskCollider = (localOffset: { x: number; y: number; z: number }, halfExtents: { x: number; y: number; z: number }) => {
                const wOff = new THREE.Vector3(localOffset.x, localOffset.y, localOffset.z).applyQuaternion(tempQuat);
                physics.createBoxCollider(
                  { x: obj.position.x + wOff.x, y: obj.position.y + wOff.y, z: obj.position.z + wOff.z },
                  { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                  halfExtents,
                  0.75,
                  0.1
                );
              };

              // 1. Solid floor deck under the kiosk
              createKioskCollider({ x: 0, y: 0.15, z: 0 }, { x: 3.2, y: 0.15, z: 2.4 });
              // 2. Kiosk counter table
              createKioskCollider({ x: 0, y: 0.85, z: 0.4 }, { x: 2.7, y: 0.25, z: 0.7 });
              // 3. Rear wall / backdrop
              createKioskCollider({ x: 0, y: 1.5, z: -2.2 }, { x: 3.0, y: 1.3, z: 0.12 });
              break;
            }

            // 3D Hippie Beach Artisan Stall (M2-N3-E9)
            if (obj.properties?.variant === "hippie_stall") {
              const stallIdx = (obj.properties?.stallIndex as number) || 1;
              const c1 = (obj.properties?.customColor as string) || "#ab47bc";
              const isGoal = Boolean(obj.properties?.isGoalStall);
              const stallRes = LevelBuilder.createHippieStallMesh(activeQuality, stallIdx, c1, isGoal);
              stallRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              stallRes.group.rotation.copy(tempEuler);
              root.add(stallRes.group);
              collidableMeshes.push(...stallRes.meshes);
              platformMeshes.push({ mesh: stallRes.meshes[0] || stallRes.group as any, isMoving: false, properties: obj.properties, objIndex: objIdx });

              const createHippieCollider = (localOffset: { x: number; y: number; z: number }, halfExtents: { x: number; y: number; z: number }) => {
                const wOff = new THREE.Vector3(localOffset.x, localOffset.y, localOffset.z).applyQuaternion(tempQuat);
                physics.createBoxCollider(
                  { x: obj.position.x + wOff.x, y: obj.position.y + wOff.y, z: obj.position.z + wOff.z },
                  { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                  halfExtents,
                  0.75,
                  0.1
                );
              };

              // 1. Solid floor deck under the stall (Scale x: 4.8, z: 3.6 -> halfExtents x: 2.4, z: 1.8)
              createHippieCollider({ x: 0, y: 0.125, z: 0 }, { x: 2.4, y: 0.125, z: 1.8 });
              // Every visible corner post is solid, including the open sides.
              for(const x of [-2.2,2.2])for(const z of [-1.6,1.6])
                createHippieCollider({x,y:1.4,z},{x:.09,y:1.4,z:.09});
              createHippieCollider({x:0,y:1.4,z:-1.6},{x:2.2,y:1.1,z:.04});
              // Match the tilted canopy instead of letting balls pass through it.
              const roofRotation=tempQuat.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(.12,0,0)));
              const roofOffset=new THREE.Vector3(0,2.7,0).applyQuaternion(tempQuat).add(new THREE.Vector3().copy(obj.position));
              physics.createBoxCollider(roofOffset,roofRotation,{x:2.5,y:.06,z:1.9},.75,.02);
              if (isGoal) {
                // In goal stall, keep center open so monkey ball can roll straight into the goal!
                for(const x of [-1.2,1.2])createHippieCollider({x,y:1.2,z:1.3},{x:.1,y:1.2,z:.1});
                createHippieCollider({x:0,y:2.4,z:1.3},{x:1.3,y:.1,z:.1});
                for(const x of [-1.5,1.5]) {
                  const position=new THREE.Vector3(x,.5,0).applyQuaternion(tempQuat).add(new THREE.Vector3().copy(obj.position));
                  physics.createCylinderCollider(position,.35,.4,.02,.75,tempQuat);
                }
              } else {
                // Normal hippie stall with front artisan table counter and rear shelf
                createHippieCollider({ x: 0, y: 0.8, z: 0.2 }, { x: 2.0, y: 0.09, z: 0.6 });
              }
              break;
            }

            // 3D Straight Tram Rails & Ties (M2-N4-E1)
            if (obj.properties?.variant === "tram_straight_rails") {
              const length = (obj.properties?.length as number) || obj.scale.z || 144.0;
              const rails = LevelBuilder.createTramStraightRailsMesh(length, obj.scale.x || 4.8);
              rails.position.set(obj.position.x, obj.position.y, obj.position.z);
              rails.rotation.copy(tempEuler);
              root.add(rails);
              break;
            }

            // 3D Giant Bouncy Palm (M2-N4-E2)
            if (obj.properties?.variant === "giant_bouncy_palm") {
              const palmRes = LevelBuilder.createGiantBouncyPalmMesh(activeQuality, (obj.properties?.palmIndex as number) || 1);
              palmRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              palmRes.group.rotation.copy(tempEuler);
              root.add(palmRes.group);
              collidableMeshes.push(...palmRes.meshes);
              platformMeshes.push({ mesh: palmRes.meshes[0] || palmRes.group as any, isMoving: false, properties: obj.properties, objIndex: objIdx });

              const shape=meshColliderData(palmRes.meshes,root);
              physics.createTrimeshCollider(shape.vertices,shape.indices,.02,.75);
              palmApex=Math.max(palmApex,new THREE.Box3().setFromObject(palmRes.group).max.y+3);
              break;
            }

            // 3D Mercadona Supermarket Shelving Gondolas (M2-N4-E3)
            if (obj.properties?.variant === "mercadona_shelves") {
              const dept = (obj.properties?.department as string) || "fruit";
              const shelfRes = LevelBuilder.createMercadonaShelvesMesh(obj.scale.x || 3.6, obj.scale.y || 2.4, obj.scale.z || 12.0, dept, activeQuality);
              shelfRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              shelfRes.group.rotation.copy(tempEuler);
              root.add(shelfRes.group);
              collidableMeshes.push(...shelfRes.meshes);
              platformMeshes.push({ mesh: shelfRes.meshes[0] || shelfRes.group as any, isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + (obj.scale.y || 2.4) / 2, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: (obj.scale.x || 3.6) / 2, y: (obj.scale.y || 2.4) / 2, z: (obj.scale.z || 12.0) / 2 },
                0.7,
                0.1
              );
              break;
            }

            // 3D Supermarket Checkout Lanes (M2-N4-E3)
            if (obj.properties?.variant === "supermarket_checkout") {
              const chkRes = LevelBuilder.createSupermarketCheckoutMesh(activeQuality);
              chkRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              chkRes.group.rotation.copy(tempEuler);
              root.add(chkRes.group);
              collidableMeshes.push(...chkRes.meshes);
              platformMeshes.push({ mesh: chkRes.meshes[0] || chkRes.group as any, isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + 0.45, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: 1.2, y: 0.45, z: 1.8 },
                0.7,
                0.1
              );
              break;
            }

            // 3D Shopping Carts Bay (M2-N4-E3)
            if (obj.properties?.variant === "shopping_carts") {
              const cartRes = LevelBuilder.createShoppingCartBayMesh(activeQuality);
              cartRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              cartRes.group.rotation.copy(tempEuler);
              root.add(cartRes.group);
              collidableMeshes.push(...cartRes.meshes);
              platformMeshes.push({ mesh: cartRes.meshes[0] || cartRes.group as any, isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + 0.4, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: 1.6, y: 0.4, z: 2.0 },
                0.7,
                0.2
              );
              break;
            }

            // Centro Comercial Islazul Monumental Facade (M4-N4-E1 2Bus35)
            if (obj.properties?.variant === "islazul_mall_facade") {
              const w = obj.scale.x || 44.0;
              const h = obj.scale.y || 18.0;
              const d = obj.scale.z || 10.0;
              const mallRes = LevelBuilder.createIslazulMallFacadeMesh(w, h, d, activeQuality);
              mallRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              mallRes.group.rotation.copy(tempEuler);
              root.add(mallRes.group);
              collidableMeshes.push(...mallRes.meshes);
              platformMeshes.push({ mesh: mallRes.meshes[0] || (mallRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + h / 2, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: w / 2, y: h / 2, z: d / 2 },
                0.7,
                0.1
              );
              break;
            }

            // Primark Clothes Wall (M4-N4-E2 Primark)
            if (obj.properties?.variant === "primark_clothes_wall") {
              const w = obj.scale.x || 8.0;
              const h = obj.scale.y || 3.4;
              const d = obj.scale.z || 0.8;
              const wallRes = LevelBuilder.createPrimarkClothesWallMesh(w, h, d, activeQuality);
              wallRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              wallRes.group.rotation.copy(tempEuler);
              root.add(wallRes.group);
              collidableMeshes.push(...wallRes.meshes);
              platformMeshes.push({ mesh: wallRes.meshes[0] || (wallRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + h / 2, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: w / 2, y: h / 2, z: d / 2 },
                0.5,
                0.2
              );
              break;
            }

            // Primark Entrance Portal (M4-N4-E2 Primark)
            if (obj.properties?.variant === "primark_portal") {
              const w = obj.scale.x || 16.0;
              const h = obj.scale.y || 7.0;
              const d = obj.scale.z || 1.6;
              const portalRes = LevelBuilder.createPrimarkPortalMesh(w, h, d, activeQuality);
              portalRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              portalRes.group.rotation.copy(tempEuler);
              root.add(portalRes.group);
              collidableMeshes.push(...portalRes.meshes);
              platformMeshes.push({ mesh: portalRes.meshes[0] || (portalRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + h / 2, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: w / 2, y: h / 2, z: d / 2 },
                0.6,
                0.2
              );
              break;
            }

            // Rodilla Triangular Sandwich (M4-N4-E6 Rodilla)
            if (obj.properties?.variant === "rodilla_sandwich") {
              const w = obj.scale.x || 22.0;
              const h = obj.scale.y || 15.0;
              const d = obj.scale.z || 50.0;
              const sandRes = LevelBuilder.createRodillaSandwichMesh(w, h, d, activeQuality, String(obj.properties?.filling ?? ""));
              sandRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              sandRes.group.rotation.copy(tempEuler);
              root.add(sandRes.group);
              collidableMeshes.push(...sandRes.meshes);
              platformMeshes.push({ mesh: sandRes.meshes[0] || (sandRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              const halfD = d / 2;
              const slopeLen = Math.hypot(h, halfD);
              const angle = Math.atan2(h, halfD);

              // 1. Rampa de subida frontal (de z=+halfD, y=0 a z=0, y=h)
              const frontEuler = new THREE.Euler(angle, 0, 0, "YXZ");
              const frontQuat = new THREE.Quaternion().setFromEuler(frontEuler).premultiply(tempQuat);
              const frontPos = new THREE.Vector3(0, h / 2, halfD / 2).applyQuaternion(tempQuat).add(obj.position);
              physics.createBoxCollider(
                frontPos,
                { x: frontQuat.x, y: frontQuat.y, z: frontQuat.z, w: frontQuat.w },
                { x: w / 2, y: 0.28, z: slopeLen / 2 },
                0.7,
                0.15
              );

              // 2. Rampa de bajada trasera (de z=0, y=h a z=-halfD, y=0)
              const backEuler = new THREE.Euler(-angle, 0, 0, "YXZ");
              const backQuat = new THREE.Quaternion().setFromEuler(backEuler).premultiply(tempQuat);
              const backPos = new THREE.Vector3(0, h / 2, -halfD / 2).applyQuaternion(tempQuat).add(obj.position);
              physics.createBoxCollider(
                backPos,
                { x: backQuat.x, y: backQuat.y, z: backQuat.z, w: backQuat.w },
                { x: w / 2, y: 0.28, z: slopeLen / 2 },
                0.7,
                0.15
              );

              // 3. Base inferior plana (por abajo plano)
              const basePos = new THREE.Vector3(0, 0.2, 0).applyQuaternion(tempQuat).add(obj.position);
              physics.createBoxCollider(
                basePos,
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: w / 2, y: 0.2, z: d / 2 },
                0.7,
                0.15
              );
              break;
            }

            // TGB Burger Platform (M4-N4-E8 TGB)
            if (obj.properties?.variant === "tgb_burger") {
              const r = (obj.scale.x || 12.0) / 2;
              const h = obj.scale.y || 5.2;
              const burgerRes = LevelBuilder.createTGBBurgerMesh(r, h, activeQuality);
              burgerRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              burgerRes.group.rotation.copy(tempEuler);
              root.add(burgerRes.group);
              collidableMeshes.push(...burgerRes.meshes);
              platformMeshes.push({ mesh: burgerRes.meshes[0] || (burgerRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              const bounce = typeof obj.properties?.bounce === "number" ? obj.properties.bounce : 2.15;
              physics.createCylinderCollider(
                { x: obj.position.x, y: obj.position.y + h / 2, z: obj.position.z },
                r,
                h / 2,
                bounce,
                0.05
              );
              break;
            }

            // Yelmo Cines Cinema Seat Row (M4-N4-E9 YelmoCines)
            if (obj.properties?.variant === "cinema_seat_row") {
              const w = obj.scale.x || 24.0;
              const h = obj.scale.y || 2.6;
              const d = obj.scale.z || 2.2;
              const seatCount = typeof obj.properties?.seatCount === "number" ? obj.properties.seatCount : 8;
              const missingSeat = Number(obj.properties?.missingSeat ?? -1);
              const seatRes = LevelBuilder.createCinemaSeatRowMesh(w, h, d, seatCount, activeQuality, missingSeat);
              seatRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              seatRes.group.rotation.copy(tempEuler);
              root.add(seatRes.group);
              collidableMeshes.push(...seatRes.meshes);
              platformMeshes.push({ mesh: seatRes.meshes[0] || (seatRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              const bounce = typeof obj.properties?.bounce === "number" ? obj.properties.bounce : 0.35;
              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + 0.2, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: w / 2, y: 0.2, z: d / 2 },
                bounce,
                0.2
              );
            const seatW = (w - 1.2) / seatCount;
            for (let seat = 0; seat < seatCount; seat++) {
              if (seat === missingSeat) continue;
              const sx = -w / 2 + 0.6 + seat * seatW + seatW / 2;
                const backPos = new THREE.Vector3(sx, 1.28, -d * 0.24).applyQuaternion(tempQuat).add(obj.position);
              physics.createBoxCollider(
                  backPos,
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: seatW * 0.4, y: 0.675, z: 0.17 },
                0.2,
                0.45
              );
            }
              break;
            }

            // Yelmo Cines Monumental Cinema Screen (M4-N4-E9 YelmoCines)
            if (obj.properties?.variant === "cinema_screen_monumental") {
              const w = obj.scale.x || 36.0;
              const h = obj.scale.y || 20.0;
              const d = obj.scale.z || 3.0;
              const screenRes = LevelBuilder.createCinemaScreenMesh(w, h, d, activeQuality);
              screenRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              screenRes.group.rotation.copy(tempEuler);
              root.add(screenRes.group);
              collidableMeshes.push(...screenRes.meshes);
              platformMeshes.push({ mesh: screenRes.meshes[0] || (screenRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + h / 2, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: w / 2, y: h / 2, z: d / 2 },
                0.6,
                0.2
              );
              break;
            }

            // VivaGYM Static Treadmill Platform Deck (M4-N4-E10 VivaGYM)
            if (obj.properties?.variant === "vivagym_treadmill" && !obj.properties?.isMoving && obj.type === "platform") {
              const w = obj.scale.x || 22.0;
              const h = obj.scale.y || 4.2;
              const len = obj.scale.z || 84.0;
              const millRes = LevelBuilder.createVivaGymTreadmillMesh(w, h, len, activeQuality);
              millRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              millRes.group.rotation.copy(tempEuler);
              root.add(millRes.group);
              collidableMeshes.push(...millRes.meshes);
              platformMeshes.push({ mesh: millRes.meshes[0] || (millRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + 0.45, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: w / 2, y: 0.45, z: len / 2 },
                0.7,
                0.2
              );
              break;
            }

            // Republican Frontón ("VIVA LA TERCERA REPUBLICA" mural wall - M4-N3-E8)
            if (obj.properties?.variant === "republican_fronton") {
              const w = obj.scale.x || 18.0;
              const h = obj.scale.y || 2.8;
              const d = obj.scale.z || 0.8;
              const frontonRes = LevelBuilder.createRepublicanFrontonMesh(w, h, d, activeQuality);
              frontonRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              frontonRes.group.rotation.copy(tempEuler);
              root.add(frontonRes.group);
              collidableMeshes.push(...frontonRes.meshes);
              platformMeshes.push({ mesh: frontonRes.meshes[0] || (frontonRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + h / 2, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: w / 2, y: h / 2, z: d / 2 },
                0.2,
                0.8
              );
              break;
            }

            // Republican Amphitheater Step (Tricolor bleachers with 3 concrete aisles - M4-N3-E8)
            if (obj.properties?.variant === "republican_step") {
              const w = obj.scale.x || 18.0;
              const h = obj.scale.y || 0.8;
              const d = obj.scale.z || 2.0;
              const col = (obj.properties?.customColor as string) || (obj.properties?.color as string) || "#e53935";
              const stepNum = typeof obj.properties?.stepNumber === "number" ? obj.properties.stepNumber : 1;
              const stepRes = LevelBuilder.createRepublicanStepMesh(w, h, d, col, stepNum, activeQuality);
              stepRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              stepRes.group.rotation.copy(tempEuler);
              root.add(stepRes.group);
              collidableMeshes.push(...stepRes.meshes);
              platformMeshes.push({ mesh: stepRes.meshes[0] || (stepRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + h / 2, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: w / 2, y: h / 2, z: d / 2 },
                0.3,
                0.7
              );
              break;
            }

            // Amphitheater Lateral Wing (Curved stepped retaining wall enclosing stands - M4-N3-E8)
            if (obj.properties?.variant === "amphitheater_wing") {
              const side = (obj.properties?.side as any) || "left";
              const len = obj.scale.z || 46.0;
              const h = obj.scale.y || 11.0;
              const wingRes = LevelBuilder.createAmphitheaterWingMesh(side, len, h, activeQuality);
              wingRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              wingRes.group.rotation.copy(tempEuler);
              root.add(wingRes.group);
              collidableMeshes.push(...wingRes.meshes);
              platformMeshes.push({ mesh: wingRes.meshes[0] || (wingRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + h / 2, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: (obj.scale.x || 2.2) / 2, y: h / 2, z: len / 2 },
                0.2,
                0.8
              );
              break;
            }

            // Rustic Lake Wooden Railing (matching photo along the water promenade - M4-N3-E8)
            if (obj.properties?.variant === "lake_wooden_railing") {
              const len = obj.scale.x || 38.0;
              const h = obj.scale.y || 1.0;
              const railRes = LevelBuilder.createLakeWoodenRailingMesh(len, h, activeQuality);
              railRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              railRes.group.rotation.copy(tempEuler);
              root.add(railRes.group);
              collidableMeshes.push(...railRes.meshes);
              platformMeshes.push({ mesh: railRes.meshes[0] || (railRes.group as any), isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + h / 2, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: len / 2, y: h / 2, z: (obj.scale.z || 0.4) / 2 },
                0.2,
                0.8
              );
              break;
            }

            // 3D Bazar Shelving Units (M2-N4-E7)
            if (obj.properties?.variant === "bazar_shelves") {
              const bazarRes = LevelBuilder.createBazarShelfMesh(obj.scale.x || 1.6, obj.scale.y || 2.8, obj.scale.z || 12.0, activeQuality);
              bazarRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              bazarRes.group.rotation.copy(tempEuler);
              root.add(bazarRes.group);
              collidableMeshes.push(...bazarRes.meshes);
              platformMeshes.push({ mesh: bazarRes.meshes[0] || bazarRes.group as any, isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + (obj.scale.y || 2.8) / 2, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: (obj.scale.x || 1.6) / 2, y: (obj.scale.y || 2.8) / 2, z: (obj.scale.z || 12.0) / 2 },
                0.7,
                0.1
              );
              break;
            }

            // 3D Clothesline with Fabric Laundry (M2-N4-E8)
            if (obj.properties?.variant === "clothesline") {
              const w = obj.scale.x || 6.2;
              const col = (obj.properties?.clothColor as string) || "#ffffff";
              const lineRes = LevelBuilder.createClotheslineMesh(w, col, activeQuality);
              lineRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              lineRes.group.rotation.copy(tempEuler);
              root.add(lineRes.group);
              collidableMeshes.push(...lineRes.meshes);
              platformMeshes.push({ mesh: lineRes.meshes[0] || lineRes.group as any, isMoving: false, properties: obj.properties, objIndex: objIdx });

              // 2 Post colliders at the sides, leaving middle completely clear to roll through the cloth!
              const createPostCollider = (px: number) => {
                const wOff = new THREE.Vector3(px, 1.3, 0).applyQuaternion(tempQuat);
                physics.createBoxCollider(
                  { x: obj.position.x + wOff.x, y: obj.position.y + wOff.y, z: obj.position.z + wOff.z },
                  { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                  { x: 0.15, y: 1.3, z: 0.15 },
                  0.7,
                  0.1
                );
              };
              createPostCollider(-w / 2);
              createPostCollider(w / 2);
              break;
            }

            if(obj.properties?.variant==='icecream_spiral') {
              const mesh=createIcecreamRamp();mesh.position.copy(obj.position);mesh.rotation.copy(tempEuler);root.add(mesh);
              collidableMeshes.push(mesh);platformMeshes.push({mesh,isMoving:false,properties:obj.properties,objIndex:objIdx});
              const shape=meshColliderData([mesh],root);physics.createTrimeshCollider(shape.vertices,shape.indices,.02,.75);break;
            }

            // 3D Illuminated Pizzeria Popeye Billboard (M2-N4-E9)
            if (obj.properties?.variant === "popeye_billboard") {
              const billboard = LevelBuilder.createPopeyeBillboardMesh(activeQuality);
              billboard.position.set(obj.position.x, obj.position.y, obj.position.z);
              billboard.rotation.copy(tempEuler);
              root.add(billboard);
              break;
            }

            // 3D Monumental Stracciatella Cone (M2-N4-E10)
            if (obj.properties?.variant === "stracciatella_cone") {
              const cH = (obj.properties?.coneHeight as number) || 10.0;
              const sR = (obj.properties?.scoopRadius as number) || 4.8;
              const coneRes = LevelBuilder.createStracciatellaConeMesh(cH, sR, activeQuality);
              coneRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              coneRes.group.rotation.copy(tempEuler);
              root.add(coneRes.group);
              collidableMeshes.push(...coneRes.meshes);
              platformMeshes.push({ mesh: coneRes.meshes[0] || coneRes.group as any, isMoving: false, properties: obj.properties, objIndex: objIdx });

              if(cangas && obj.properties?.cangasAction==="icecream") {
                for(const mesh of coneRes.meshes) mesh.userData.blocksCameraOnSlopes=true;
                cangas.attach(obj,coneRes.group,coneRes.meshes);
                break;
              }

              if(data.world===2&&data.level===4&&data.stage===10) {
                const shape=meshColliderData(coneRes.meshes,coneRes.group);
                const body=physics.createKinematicTrimesh(obj.position,shape.vertices,shape.indices,.02,.6,tempQuat);
                if(body)movingPlatforms.push({id:obj.id,mesh:coneRes.group,body:body.body,basePosition:new THREE.Vector3().copy(obj.position),axis:'none',distance:0,speed:1,rotSpeed:Number(obj.properties?.spinSpeed??.24),baseQuaternion:tempQuat.clone(),movementType:'icecream_spin'});
                break;
              }

              physics.createCylinderCollider(
                { x: obj.position.x, y: obj.position.y + cH / 2, z: obj.position.z },
                sR * 0.8,
                cH / 2,
                0.5,
                0.2,
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }
              );
              physics.createCylinderCollider(
                { x: obj.position.x, y: obj.position.y + cH + sR * 0.75, z: obj.position.z },
                sR * 0.95,
                sR * 0.6,
                0.5,
                0.2,
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }
              );
              break;
            }

            // 3D Fire Salamander Platform (M3-N1-E7)
            if (obj.properties?.variant === "salamander_platform") {
              const len = (obj.properties?.length as number) || obj.scale.z || 74.0;
              const salRes = LevelBuilder.createSalamanderMesh(len, activeQuality);
              salRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              salRes.group.rotation.copy(tempEuler);
              root.add(salRes.group);
              collidableMeshes.push(...salRes.meshes);
              platformMeshes.push({ mesh: salRes.platformMesh, isMoving: false, properties: obj.properties, objIndex: objIdx });

              // Create precise Rapier colliders for all body segments, legs, head, and tail tip
              if (salRes.colliderData) {
                for (const box of salRes.colliderData.boxes) {
                  const bPos = new THREE.Vector3(box.position.x, box.position.y, box.position.z)
                    .applyEuler(tempEuler)
                    .add(obj.position);
                  const bEuler = new THREE.Euler(tempEuler.x, tempEuler.y + box.rotationY, tempEuler.z, "YXZ");
                  const bQuat = new THREE.Quaternion().setFromEuler(bEuler);
                  physics.createBoxCollider(
                    bPos,
                    { x: bQuat.x, y: bQuat.y, z: bQuat.z, w: bQuat.w },
                    { x: box.size.x / 2, y: box.size.y / 2, z: box.size.z / 2 },
                    0.7,
                    0.15
                  );
                }
                for (const cyl of salRes.colliderData.cylinders) {
                  const cPos = new THREE.Vector3(cyl.position.x, cyl.position.y, cyl.position.z)
                    .applyEuler(tempEuler)
                    .add(obj.position);
                  physics.createCylinderCollider(
                    cPos,
                    cyl.radius,
                    cyl.height / 2,
                    0.7,
                    0.15
                  );
                }
              }
              break;
            }

            // 3D Misina White Cat Portal Entrance (M3-N1-E10)
            if (obj.properties?.variant === "misina_cat") {
              const catRes = LevelBuilder.createMisinaCatMesh(activeQuality);
              catRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              catRes.group.rotation.copy(tempEuler);
              root.add(catRes.group);
              collidableMeshes.push(...catRes.meshes);
              platformMeshes.push({ mesh: catRes.mouthPortal, isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                { x: obj.position.x, y: obj.position.y + 0.3, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: 1.9, y: 0.3, z: 2.0 },
                0.65,
                0.2
              );
              physics.createBoxCollider(
                { x: obj.position.x - 2.8, y: obj.position.y + 2.4, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: 0.9, y: 2.4, z: 1.8 },
                0.65,
                0.2
              );
              physics.createBoxCollider(
                { x: obj.position.x + 2.8, y: obj.position.y + 2.4, z: obj.position.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: 0.9, y: 2.4, z: 1.8 },
                0.65,
                0.2
              );
              break;
            }

            // 3D A4 Coloring Drawing Sheet Platform (Static variant)
            if (obj.properties?.variant === "a4_sheet" || obj.properties?.theme === "drawing_sheet" || obj.properties?.theme === "coloring_sheet") {
              const sheetIndex = (obj.properties?.sheetIndex as number) || (objIdx + 1);
              const pencilColor = (obj.properties?.pencilColor as string) || (obj.properties?.customColor as string) || "#e53935";
              const a4Res = LevelBuilder.createA4SheetMesh(obj.scale.x, obj.scale.y, obj.scale.z, activeQuality, sheetIndex, pencilColor);
              a4Res.group.position.set(obj.position.x, obj.position.y, obj.position.z);
              a4Res.group.rotation.copy(tempEuler);
              root.add(a4Res.group);
              collidableMeshes.push(...a4Res.meshes);
              platformMeshes.push({ mesh: a4Res.platformMesh, isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                obj.position,
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: obj.scale.x / 2, y: obj.scale.y / 2, z: obj.scale.z / 2 },
                0.7,
                0.15
              );
              break;
            }

            const shape = (obj.properties?.shape as string) || (obj.properties?.platformShape as string) || "box";

            // 1. Hollow Platform with customizable center/offset hole (Frame Platform)
            if (shape === "hollow_rect" || Boolean(obj.properties?.hole)) {
              const holeW = (obj.properties?.holeWidth as number) || (obj.properties?.holeSizeX as number) || (obj.scale.x * 0.45);
              const holeD = (obj.properties?.holeDepth as number) || (obj.properties?.holeLength as number) || (obj.properties?.holeSizeZ as number) || (obj.scale.z * 0.45);
              const holeOffX = (obj.properties?.holeOffsetX as number) || 0;
              const holeOffZ = (obj.properties?.holeOffsetZ as number) || 0;

              const slabGroup = new THREE.Group();
              slabGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
              slabGroup.rotation.copy(tempEuler);

              const bWLeft = Math.max(0.1, (obj.scale.x - holeW) / 2 - holeOffX);
              const bWRight = Math.max(0.1, (obj.scale.x - holeW) / 2 + holeOffX);
              const bDFront = Math.max(0.1, (obj.scale.z - holeD) / 2 - holeOffZ);
              const bDBack = Math.max(0.1, (obj.scale.z - holeD) / 2 + holeOffZ);

              const mat = createPlatformMeshMaterial(obj.scale.x, obj.scale.y, obj.scale.z, false, obj.properties, objIdx);

              // Left slab
              const gLeft = new THREE.BoxGeometry(bWLeft, obj.scale.y, obj.scale.z);
              const mLeft = new THREE.Mesh(gLeft, mat);
              const xLeft = -obj.scale.x / 2 + bWLeft / 2;
              mLeft.position.set(xLeft, 0, 0);
              slabGroup.add(mLeft);
              collidableMeshes.push(mLeft);

              // Right slab
              const gRight = new THREE.BoxGeometry(bWRight, obj.scale.y, obj.scale.z);
              const mRight = new THREE.Mesh(gRight, mat);
              const xRight = obj.scale.x / 2 - bWRight / 2;
              mRight.position.set(xRight, 0, 0);
              slabGroup.add(mRight);
              collidableMeshes.push(mRight);

              // Front slab
              const gFront = new THREE.BoxGeometry(holeW, obj.scale.y, bDFront);
              const mFront = new THREE.Mesh(gFront, mat);
              const zFront = -obj.scale.z / 2 + bDFront / 2;
              mFront.position.set(holeOffX, 0, zFront);
              slabGroup.add(mFront);
              collidableMeshes.push(mFront);

              // Back slab
              const gBack = new THREE.BoxGeometry(holeW, obj.scale.y, bDBack);
              const mBack = new THREE.Mesh(gBack, mat);
              const zBack = obj.scale.z / 2 - bDBack / 2;
              mBack.position.set(holeOffX, 0, zBack);
              slabGroup.add(mBack);
              collidableMeshes.push(mBack);

              root.add(slabGroup);
              platformMeshes.push({ mesh: mLeft, isMoving: false, properties: obj.properties, objIndex: objIdx });
              platformMeshes.push({ mesh: mRight, isMoving: false, properties: obj.properties, objIndex: objIdx });
              platformMeshes.push({ mesh: mFront, isMoving: false, properties: obj.properties, objIndex: objIdx });
              platformMeshes.push({ mesh: mBack, isMoving: false, properties: obj.properties, objIndex: objIdx });

              const pLeft = new THREE.Vector3(xLeft, 0, 0).applyEuler(tempEuler).add(obj.position);
              physics.createBoxCollider(pLeft, { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }, { x: bWLeft / 2, y: obj.scale.y / 2, z: obj.scale.z / 2 }, 0.65, 0.15);

              const pRight = new THREE.Vector3(xRight, 0, 0).applyEuler(tempEuler).add(obj.position);
              physics.createBoxCollider(pRight, { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }, { x: bWRight / 2, y: obj.scale.y / 2, z: obj.scale.z / 2 }, 0.65, 0.15);

              const pFront = new THREE.Vector3(holeOffX, 0, zFront).applyEuler(tempEuler).add(obj.position);
              physics.createBoxCollider(pFront, { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }, { x: holeW / 2, y: obj.scale.y / 2, z: bDFront / 2 }, 0.65, 0.15);

              const pBack = new THREE.Vector3(holeOffX, 0, zBack).applyEuler(tempEuler).add(obj.position);
              physics.createBoxCollider(pBack, { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }, { x: holeW / 2, y: obj.scale.y / 2, z: bDBack / 2 }, 0.65, 0.15);
              break;
            }

            // 2. Hexagonal Platform
            if (shape === "hexagon") {
              const radius = Math.max(obj.scale.x, obj.scale.z) / 2;
              const height = obj.scale.y;
              const geo = new THREE.CylinderGeometry(radius, radius, height, 6);
              geo.rotateY(Math.PI / 6);
              const mat = createPlatformMeshMaterial(obj.scale.x, obj.scale.y, obj.scale.z, false, obj.properties, objIdx);
              const mesh = new THREE.Mesh(geo, Array.isArray(mat) ? mat[2] || mat[0] : mat);
              mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
              mesh.rotation.copy(tempEuler);
              root.add(mesh);
              collidableMeshes.push(mesh);
              platformMeshes.push({ mesh, isMoving: false, properties: obj.properties, objIndex: objIdx });

              const restitution = typeof obj.properties?.bounce === "number" ? obj.properties.bounce : 0.65;
              const friction = typeof obj.properties?.friction === "number" ? obj.properties.friction : 0.2;
              physics.createCylinderCollider(
                obj.position,
                radius,
                height / 2,
                restitution,
                friction,
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }
              );
              break;
            }

            // 3. L-Shaped Corner Platform
            if (shape === "l_shape") {
              const armW = (obj.properties?.armWidth as number) || (obj.scale.x * 0.5);
              const armD = (obj.properties?.armDepth as number) || (obj.scale.z * 0.5);
              const lGroup = new THREE.Group();
              lGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
              lGroup.rotation.copy(tempEuler);
              const mat = createPlatformMeshMaterial(obj.scale.x, obj.scale.y, obj.scale.z, false, obj.properties, objIdx);

              const g1 = new THREE.BoxGeometry(obj.scale.x, obj.scale.y, armD);
              const m1 = new THREE.Mesh(g1, mat);
              const z1 = -obj.scale.z / 2 + armD / 2;
              m1.position.set(0, 0, z1);
              lGroup.add(m1);
              collidableMeshes.push(m1);

              const wingD = obj.scale.z - armD;
              const g2 = new THREE.BoxGeometry(armW, obj.scale.y, wingD);
              const m2 = new THREE.Mesh(g2, mat);
              const x2 = -obj.scale.x / 2 + armW / 2;
              const z2 = armD / 2;
              m2.position.set(x2, 0, z2);
              lGroup.add(m2);
              collidableMeshes.push(m2);

              root.add(lGroup);
              platformMeshes.push({ mesh: m1, isMoving: false, properties: obj.properties, objIndex: objIdx });

              const p1 = new THREE.Vector3(0, 0, z1).applyEuler(tempEuler).add(obj.position);
              physics.createBoxCollider(p1, { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }, { x: obj.scale.x / 2, y: obj.scale.y / 2, z: armD / 2 }, 0.65, 0.15);

              const p2 = new THREE.Vector3(x2, 0, z2).applyEuler(tempEuler).add(obj.position);
              physics.createBoxCollider(p2, { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }, { x: armW / 2, y: obj.scale.y / 2, z: wingD / 2 }, 0.65, 0.15);
              break;
            }

            // 4. Triangular Platform (Peak / Wedge)
            if (shape === "triangle" || shape === "wedge") {
              const radius = (obj.scale.x + obj.scale.z) / 4;
              const height = obj.scale.y;
              const geo = new THREE.CylinderGeometry(radius, radius, height, 3);
              const mat = createPlatformMeshMaterial(obj.scale.x, obj.scale.y, obj.scale.z, false, obj.properties, objIdx);
              const mesh = new THREE.Mesh(geo, Array.isArray(mat) ? mat[2] || mat[0] : mat);
              mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
              mesh.rotation.copy(tempEuler);
              root.add(mesh);
              collidableMeshes.push(mesh);
              platformMeshes.push({ mesh, isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createBoxCollider(
                obj.position,
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: obj.scale.x * 0.45, y: obj.scale.y / 2, z: obj.scale.z * 0.45 },
                0.65,
                0.15
              );
              break;
            }

            const isCylinder = shape === "cylinder";
            if (isCylinder) {
              const radius = (obj.scale.x + obj.scale.z) / 4;
              const height = obj.scale.y;
              const geo = new THREE.CylinderGeometry(radius, radius, height, 36);
              const mat = createPlatformMeshMaterial(obj.scale.x, obj.scale.y, obj.scale.z, false, obj.properties, objIdx);
              const mesh = new THREE.Mesh(geo, Array.isArray(mat) ? mat[2] || mat[0] : mat);
              mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
              mesh.rotation.copy(tempEuler);
              root.add(mesh);
              collidableMeshes.push(mesh);
              platformMeshes.push({ mesh, isMoving: false, properties: obj.properties, objIndex: objIdx });

              physics.createCylinderCollider(
                obj.position,
                radius,
                height / 2,
                0.15,
                0.75,
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }
              );
              break;
            }

            const geo = new THREE.BoxGeometry(obj.scale.x, obj.scale.y, obj.scale.z);
            LevelBuilder.applyContinuousWorldUVs(geo, obj.position, obj.rotation, obj.scale, 4.0);
            const mat = createPlatformMeshMaterial(obj.scale.x, obj.scale.y, obj.scale.z, false, obj.properties, objIdx);

            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
            mesh.rotation.copy(tempEuler);
            root.add(mesh);
            collidableMeshes.push(mesh);
            platformMeshes.push({ mesh, isMoving: false, properties: obj.properties, objIndex: objIdx });

            physics.createBoxCollider(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: obj.scale.x / 2, y: obj.scale.y / 2, z: obj.scale.z / 2 },
              0.65,
              0.15
            );
            break;
          }

          const isTeleferico = obj.properties?.variant === "teleferico" || obj.properties?.movementType === "teleferico";

          if (isTeleferico) {
            const cabinGroup = new THREE.Group();
            cabinGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            cabinGroup.rotation.copy(tempEuler);

            // 1. Floor
            const floorGeo = new THREE.BoxGeometry(obj.scale.x, obj.scale.y, obj.scale.z);
            LevelBuilder.applyContinuousWorldUVs(floorGeo, obj.position, obj.rotation, obj.scale, 4.0);
            const floorMat = createPlatformMeshMaterial(obj.scale.x, obj.scale.y, obj.scale.z, true, obj.properties, objIdx);
            const floorMesh = new THREE.Mesh(floorGeo, floorMat);
            cabinGroup.add(floorMesh);
            collidableMeshes.push(floorMesh);

            // 2. Cabin enclosure walls, posts, roof and suspension arm
            const cabinColor = (obj.properties?.customColor as string) || (obj.properties?.color as string) || "#d32f2f";
            const cabinMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(cabinColor), roughness: 0.35, metalness: 0.2 });
            const steelMat = new THREE.MeshStandardMaterial({ color: 0x546e7a, roughness: 0.3, metalness: 0.6 });
            const yellowRoofMat = new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.3, metalness: 0.1 });

            const halfW = obj.scale.x / 2;
            const halfD = obj.scale.z / 2;
            const floorH = obj.scale.y;

            // Left Wall
            const wallLGeo = new THREE.BoxGeometry(0.25, 1.4, obj.scale.z - 0.2);
            wallLGeo.translate(-halfW + 0.125, 0.7 + floorH / 2, 0);
            const wallL = new THREE.Mesh(wallLGeo, cabinMat);
            cabinGroup.add(wallL);
            collidableMeshes.push(wallL);

            // Right Wall
            const wallRGeo = new THREE.BoxGeometry(0.25, 1.4, obj.scale.z - 0.2);
            wallRGeo.translate(halfW - 0.125, 0.7 + floorH / 2, 0);
            const wallR = new THREE.Mesh(wallRGeo, cabinMat);
            cabinGroup.add(wallR);
            collidableMeshes.push(wallR);

            // Front Lip (protective curb during descent)
            const lipFGeo = new THREE.BoxGeometry(obj.scale.x, 0.45, 0.25);
            lipFGeo.translate(0, 0.225 + floorH / 2, -halfD + 0.125);
            const lipF = new THREE.Mesh(lipFGeo, cabinMat);
            cabinGroup.add(lipF);
            collidableMeshes.push(lipF);

            // Rear Lip
            const lipBGeo = new THREE.BoxGeometry(obj.scale.x, 0.45, 0.25);
            lipBGeo.translate(0, 0.225 + floorH / 2, halfD - 0.125);
            const lipB = new THREE.Mesh(lipBGeo, cabinMat);
            cabinGroup.add(lipB);
            collidableMeshes.push(lipB);

            // 4 Corner Pillars
            const pillarOffsets = [
              [-halfW + 0.12, -halfD + 0.12],
              [halfW - 0.12, -halfD + 0.12],
              [-halfW + 0.12, halfD - 0.12],
              [halfW - 0.12, halfD - 0.12]
            ];
            for (const [px, pz] of pillarOffsets) {
              const pGeo = new THREE.BoxGeometry(0.2, 2.2, 0.2);
              pGeo.translate(px, 1.1 + floorH / 2, pz);
              cabinGroup.add(new THREE.Mesh(pGeo, steelMat));
            }

            // Yellow Roof
            const roofGeo = new THREE.BoxGeometry(obj.scale.x + 0.3, 0.25, obj.scale.z + 0.3);
            roofGeo.translate(0, 2.2 + floorH / 2, 0);
            cabinGroup.add(new THREE.Mesh(roofGeo, yellowRoofMat));

            // Suspension Hanger Arm
            const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 6);
            armGeo.translate(0, 3.0 + floorH / 2, 0);
            cabinGroup.add(new THREE.Mesh(armGeo, steelMat));

            // Trolley Pulley Wheel
            const wheelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.15, 8);
            wheelGeo.rotateZ(Math.PI / 2);
            wheelGeo.translate(0, 3.75 + floorH / 2, 0);
            cabinGroup.add(new THREE.Mesh(wheelGeo, steelMat));

            root.add(cabinGroup);
            platformMeshes.push({ mesh: floorMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            // Create Kinematic Body with all 5 protective colliders attached
            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: obj.scale.x / 2, y: obj.scale.y / 2, z: obj.scale.z / 2 }
            );

            if (kinematic) {
              // Attach left wall collider
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: -halfW + 0.125, y: 0.7 + floorH / 2, z: 0 },
                { x: 0.125, y: 0.7, z: halfD - 0.1 }
              );
              // Attach right wall collider
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: halfW - 0.125, y: 0.7 + floorH / 2, z: 0 },
                { x: 0.125, y: 0.7, z: halfD - 0.1 }
              );
              // Attach front lip collider
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: 0, y: 0.225 + floorH / 2, z: -halfD + 0.125 },
                { x: halfW, y: 0.225, z: 0.125 }
              );
              // Attach rear lip collider
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: 0, y: 0.225 + floorH / 2, z: halfD - 0.125 },
                { x: halfW, y: 0.225, z: 0.125 }
              );

              const distance = typeof obj.properties?.distance === "number" ? obj.properties.distance : 12.5;
              const speed = typeof obj.properties?.speed === "number" ? obj.properties.speed : 1.0;

              movingPlatforms.push({
                id: obj.id,
                mesh: cabinGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "yz",
                distance,
                speed,
                movementType: "teleferico",
                direction: 1,
                startDelay: 0,
                slopeY: 0.28
              });
            }
            break;
          }

          const isOlla = obj.properties?.variant === "olla" || obj.properties?.movementType === "olla";
          if (isOlla) {
            const ollaGroup = new THREE.Group();
            ollaGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            ollaGroup.rotation.copy(tempEuler);

            const radius = Math.max(3.0, (obj.scale.x || 11.0) / 2);
            const dishHeight = obj.scale.y || 0.6;

            // 1. Central floor dish (18-sided cylinder for smooth circular floor)
            const dishGeo = new THREE.CylinderGeometry(radius, radius, dishHeight, 20);
            const dishMat = new THREE.MeshStandardMaterial({
              color: 0x3949ab, // Tagadá vibrant blue floor
              roughness: 0.35,
              metalness: 0.2
            });
            const dishMesh = new THREE.Mesh(dishGeo, dishMat);
            ollaGroup.add(dishMesh);
            collidableMeshes.push(dishMesh);

            // 2. Perimeter padded seats / safety barrier ring
            const ringGeo = new THREE.TorusGeometry(radius - 0.25, 0.45, 8, 24);
            ringGeo.rotateX(Math.PI / 2);
            ringGeo.translate(0, dishHeight / 2 + 0.35, 0);
            const ringMat = new THREE.MeshStandardMaterial({
              color: 0xe53935, // Feria red padded perimeter
              roughness: 0.4,
              metalness: 0.1
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ollaGroup.add(ringMesh);
            collidableMeshes.push(ringMesh);

            // 3. Central decorative fairground hub
            const hubGeo = new THREE.CylinderGeometry(0.8, 1.2, 0.8, 12);
            hubGeo.translate(0, dishHeight / 2 + 0.4, 0);
            const hubMat = new THREE.MeshStandardMaterial({
              color: 0xffd54f, // Golden center hub
              roughness: 0.25,
              metalness: 0.3
            });
            const hubMesh = new THREE.Mesh(hubGeo, hubMat);
            ollaGroup.add(hubMesh);
            collidableMeshes.push(hubMesh);

            // Cabochon fairground lights around the perimeter
            const numLights = 12;
            const lightColors = [0xff1744, 0x00e5ff, 0xffeb3b, 0x76ff03, 0xd500f9];
            for (let i = 0; i < numLights; i++) {
              const angle = (i / numLights) * Math.PI * 2;
              const lx = Math.cos(angle) * (radius - 0.25);
              const lz = Math.sin(angle) * (radius - 0.25);
              const lGeo = new THREE.SphereGeometry(0.18, 6, 6);
              lGeo.translate(lx, dishHeight / 2 + 0.75, lz);
              const lMat = new THREE.MeshStandardMaterial({
                color: lightColors[i % lightColors.length],
                emissive: new THREE.Color(lightColors[i % lightColors.length]),
                emissiveIntensity: 0.8
              });
              const lMesh = new THREE.Mesh(lGeo, lMat);
              ollaGroup.add(lMesh);
            }

            root.add(ollaGroup);
            platformMeshes.push({ mesh: dishMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            // Kinematic Rapier cylinder body
            const kinematic = physics.createKinematicCylinder(
              obj.position,
              radius,
              dishHeight / 2,
              0.4,
              0.7,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }
            );

            if (kinematic) {
              const rotSpeed = typeof obj.properties?.rotSpeed === "number" ? obj.properties.rotSpeed : 1.25;
              const tiltSpeed = typeof obj.properties?.tiltSpeed === "number" ? obj.properties.tiltSpeed : 2.1;
              const maxTilt = typeof obj.properties?.maxTilt === "number" ? obj.properties.maxTilt : 0.17;

              movingPlatforms.push({
                id: obj.id,
                mesh: ollaGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "none",
                distance: 0,
                speed: 1.0,
                movementType: "olla",
                rotSpeed,
                tiltSpeed,
                maxTilt
              });
            }
            break;
          }

          const isPadelRacket = obj.properties?.variant === "padel_racket" || obj.properties?.movementType === "padel_racket";
          if (isPadelRacket) {
            const racketGroup = new THREE.Group();
            racketGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            racketGroup.rotation.copy(tempEuler);

            // Colors & Materials for Professional Padel Racket Catapult
            const frameColor = (obj.properties?.customColor as string) || "#00e5ff"; // Electric cyan
            const frameMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(frameColor), roughness: 0.25, metalness: 0.35 });
            const faceMat = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.6, metalness: 0.15 }); // Matte carbon weave
            const gripMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0.0 }); // White grip tape
            const railMat = new THREE.MeshStandardMaterial({ color: 0x00b0ff, roughness: 0.3, metalness: 0.2 });
            const dotMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a }); // Perforations

            const headW = obj.scale.x || 3.8;
            const headH = obj.scale.y || 0.20;
            const headD = obj.scale.z || 4.2;

            // 1. Rear Entrance Ramp (smooth transition from court turf to racket bed)
            const rampGeo = new THREE.BoxGeometry(headW - 0.2, headH, 0.6);
            rampGeo.rotateX(-0.18);
            rampGeo.translate(0, headH * 0.25, 0.2);
            const rampMesh = new THREE.Mesh(rampGeo, frameMat);
            racketGroup.add(rampMesh);
            collidableMeshes.push(rampMesh);

            // 2. Main Scoop Floor Bed (Width ~3.8, Length ~4.2 extending towards -Z)
            const bedGeo = new THREE.BoxGeometry(headW, headH, headD);
            bedGeo.translate(0, headH / 2, -headD / 2);
            const bedMesh = new THREE.Mesh(bedGeo, frameMat);
            racketGroup.add(bedMesh);
            collidableMeshes.push(bedMesh);
            platformMeshes.push({ mesh: bedMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            // 3. Carbon Fiber Face Plate
            const faceGeo = new THREE.BoxGeometry(headW - 0.3, 0.02, headD - 0.4);
            faceGeo.translate(0, headH + 0.01, -headD / 2);
            const faceMesh = new THREE.Mesh(faceGeo, faceMat);
            racketGroup.add(faceMesh);
            collidableMeshes.push(faceMesh);

            // 4. Padel Holes Pattern (athletic perforations on the face)
            const dotGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.025, 6);
            for (let rx = -headW / 2 + 0.6; rx <= headW / 2 - 0.6; rx += 0.55) {
              for (let rz = -headD + 0.6; rz <= -0.6; rz += 0.55) {
                const dot = new THREE.Mesh(dotGeo, dotMat);
                dot.position.set(rx, headH + 0.02, rz);
                racketGroup.add(dot);
              }
            }

            // 5. Left & Right Guide Rails (Prevent ball slipping off sideways during scoop)
            const railThick = 0.16;
            const railH = 0.45;
            const leftRailGeo = new THREE.BoxGeometry(railThick, railH, headD);
            leftRailGeo.translate(-headW / 2 + railThick / 2, headH + railH / 2 - 0.05, -headD / 2);
            const leftRailMesh = new THREE.Mesh(leftRailGeo, railMat);
            racketGroup.add(leftRailMesh);
            collidableMeshes.push(leftRailMesh);

            const rightRailGeo = new THREE.BoxGeometry(railThick, railH, headD);
            rightRailGeo.translate(headW / 2 - railThick / 2, headH + railH / 2 - 0.05, -headD / 2);
            const rightRailMesh = new THREE.Mesh(rightRailGeo, railMat);
            racketGroup.add(rightRailMesh);
            collidableMeshes.push(rightRailMesh);

            // 6. Handle & Throat (Extending backwards along +Z behind the pivot)
            const handleGeo = new THREE.CylinderGeometry(0.14, 0.16, 1.6, 8);
            handleGeo.rotateX(Math.PI / 2);
            handleGeo.translate(0, headH / 2 + 0.05, 0.9);
            racketGroup.add(new THREE.Mesh(handleGeo, gripMat));

            const throatGeoL = new THREE.BoxGeometry(0.12, 0.16, 0.6);
            throatGeoL.rotateY(0.3);
            throatGeoL.translate(-0.35, headH / 2, 0.2);
            racketGroup.add(new THREE.Mesh(throatGeoL, frameMat));

            const throatGeoR = new THREE.BoxGeometry(0.12, 0.16, 0.6);
            throatGeoR.rotateY(-0.3);
            throatGeoR.translate(0.35, headH / 2, 0.2);
            racketGroup.add(new THREE.Mesh(throatGeoR, frameMat));

            root.add(racketGroup);

            // Kinematic Multi-Collider in Rapier centered at the pivot point
            const kinematic = physics.createKinematicBox(
              { x: obj.position.x, y: obj.position.y, z: obj.position.z },
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: headW / 2, y: headH / 2, z: headD / 2 },
              0.85,
              0.15,
              { x: 0, y: headH / 2, z: -headD / 2 }
            );

            if (kinematic) {
              // Add side wall colliders to kinematic body
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: -headW / 2 + railThick / 2, y: headH + railH / 2 - 0.05, z: -headD / 2 },
                { x: railThick / 2, y: railH / 2, z: headD / 2 },
                0.85,
                0.15
              );
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: headW / 2 - railThick / 2, y: headH + railH / 2 - 0.05, z: -headD / 2 },
                { x: railThick / 2, y: railH / 2, z: headD / 2 },
                0.85,
                0.15
              );

              const goalObj = data.objects.find(o => o && o.type === "goal");
              movingPlatforms.push({
                id: obj.id,
                mesh: racketGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                baseRotation: new THREE.Euler(obj.rotation.x, obj.rotation.y, obj.rotation.z, "YXZ"),
                baseQuaternion: new THREE.Quaternion().copy(tempQuat),
                headWidth: headW,
                headDepth: headD,
                targetPosition: goalObj ? new THREE.Vector3(goalObj.position.x, goalObj.position.y, goalObj.position.z) : undefined,
                axis: "z",
                distance: headD,
                speed: (obj.properties?.speed as number) || 1.0,
                movementType: "padel_racket",
                launchMode: (obj.properties?.launchMode as string) || (obj.properties?.isVerticalLaunch ? "vertical" : undefined),
                direction: 1,
                startDelay: 0
              });
            }
            break;
          }

          // Panadería Moving Bread Loaves (M1-N4-E2)
          const isBreadLoaf = obj.properties?.variant === "bread_roller" || obj.properties?.movementType === "bread_roller";
          if (isBreadLoaf) {
            const breadGroup = new THREE.Group();
            breadGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            breadGroup.rotation.copy(tempEuler);

            const crustMat = new THREE.MeshStandardMaterial({ color: 0xd78f44, roughness: 0.75, metalness: 0.05 });
            const flourMat = new THREE.MeshStandardMaterial({ color: 0xfff9c4, roughness: 0.9, metalness: 0.0 });

            const bw = obj.scale.x || 3.2;
            const bh = obj.scale.y || 0.9;
            const bd = obj.scale.z || 1.6;

            const loafGeo = new THREE.CylinderGeometry(bd / 2, bd / 2, bw, 12);
            loafGeo.rotateZ(Math.PI / 2);
            loafGeo.scale(1, bh / bd, 1);
            const loafMesh = new THREE.Mesh(loafGeo, crustMat);
            breadGroup.add(loafMesh);
            collidableMeshes.push(loafMesh);

            // Scored flour cuts on top
            for (let c = -bw * 0.35; c <= bw * 0.35; c += 0.7) {
              const cutGeo = new THREE.BoxGeometry(0.12, 0.04, bd * 0.7);
              cutGeo.translate(c, bh / 2 + 0.01, 0);
              breadGroup.add(new THREE.Mesh(cutGeo, flourMat));
            }

            root.add(breadGroup);
            platformMeshes.push({ mesh: loafMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: bw / 2, y: bh / 2, z: bd / 2 },
              0.85,
              0.35
            );
            if (kinematic) {
              movingPlatforms.push({
                id: obj.id,
                mesh: breadGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "x",
                distance: typeof obj.properties?.distance === "number" ? obj.properties.distance : 2.6,
                speed: typeof obj.properties?.speed === "number" ? obj.properties.speed : 2.5,
                movementType: "bread_roller",
                direction: typeof obj.properties?.direction === "number" ? obj.properties.direction : 1
              });
            }
            break;
          }

          // Muro1 Moving Pipe Machinery Shuttle (M1-N4-E4)
          // Open-ended hollow circumference cylinder tube so player ball rolls physically inside!
          const isPipeShuttle = obj.properties?.variant === "pipe_shuttle" || obj.properties?.movementType === "pipe_shuttle";
          if (isPipeShuttle) {
            const pipeGroup = new THREE.Group();
            pipeGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            pipeGroup.rotation.copy(tempEuler);

            const brassMat = new THREE.MeshStandardMaterial({
              color: (obj.properties?.customColor as string) || 0xffa000,
              metalness: 0.7,
              roughness: 0.28
            });
            const innerMat = new THREE.MeshStandardMaterial({
              color: 0x263238,
              metalness: 0.65,
              roughness: 0.35,
              side: THREE.DoubleSide
            });
            const ironMat = new THREE.MeshStandardMaterial({ color: 0x37474f, metalness: 0.8, roughness: 0.35 });
            const neonMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });

            const pipeOuterR = 1.45;
            const pipeInnerR = 1.25;
            const pipeL = 3.6;

            // 1. Outer open-ended cylinder (circumference shell)
            const outerGeo = new THREE.CylinderGeometry(pipeOuterR, pipeOuterR, pipeL, 24, 1, true);
            outerGeo.rotateX(Math.PI / 2);
            const outerMesh = new THREE.Mesh(outerGeo, brassMat);
            pipeGroup.add(outerMesh);
            collidableMeshes.push(outerMesh);

            // 2. Inner open-ended cylinder (tunnel interior shell)
            const innerGeo = new THREE.CylinderGeometry(pipeInnerR, pipeInnerR, pipeL, 24, 1, true);
            innerGeo.rotateX(Math.PI / 2);
            const innerMesh = new THREE.Mesh(innerGeo, innerMat);
            pipeGroup.add(innerMesh);

            // 3. Front and rear collar rings connecting outer and inner rims
            const frontRingGeo = new THREE.RingGeometry(pipeInnerR, pipeOuterR, 24);
            frontRingGeo.translate(0, 0, pipeL / 2);
            pipeGroup.add(new THREE.Mesh(frontRingGeo, ironMat));

            const backRingGeo = new THREE.RingGeometry(pipeInnerR, pipeOuterR, 24);
            backRingGeo.rotateY(Math.PI);
            backRingGeo.translate(0, 0, -pipeL / 2);
            pipeGroup.add(new THREE.Mesh(backRingGeo, ironMat));

            // 4. Exterior reinforcing Torus flanges
            const flangeGeo1 = new THREE.TorusGeometry(pipeOuterR + 0.08, 0.1, 8, 24);
            flangeGeo1.translate(0, 0, pipeL / 2);
            pipeGroup.add(new THREE.Mesh(flangeGeo1, ironMat));

            const flangeGeo2 = new THREE.TorusGeometry(pipeOuterR + 0.08, 0.1, 8, 24);
            flangeGeo2.translate(0, 0, -pipeL / 2);
            pipeGroup.add(new THREE.Mesh(flangeGeo2, ironMat));

            const midFlange = new THREE.TorusGeometry(pipeOuterR + 0.08, 0.1, 8, 24);
            pipeGroup.add(new THREE.Mesh(midFlange, ironMat));

            // 5. Glowing neon entrance guidance rings
            const glowRingGeo1 = new THREE.TorusGeometry(pipeInnerR - 0.02, 0.06, 8, 24);
            glowRingGeo1.translate(0, 0, pipeL / 2);
            pipeGroup.add(new THREE.Mesh(glowRingGeo1, neonMat));

            const glowRingGeo2 = new THREE.TorusGeometry(pipeInnerR - 0.02, 0.06, 8, 24);
            glowRingGeo2.translate(0, 0, -pipeL / 2);
            pipeGroup.add(new THREE.Mesh(glowRingGeo2, neonMat));

            // 6. Smooth rolling floor runway inside the cylinder
            const floorGeo = new THREE.BoxGeometry(pipeInnerR * 1.5, 0.08, pipeL);
            floorGeo.translate(0, -pipeInnerR + 0.06, 0);
            const floorMesh = new THREE.Mesh(floorGeo, innerMat);
            pipeGroup.add(floorMesh);

            root.add(pipeGroup);
            platformMeshes.push({ mesh: floorMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            // Kinematic physics with completely open front & back apertures so ball rolls straight in
            const floorY = -pipeInnerR + 0.06;
            const kinematic = physics.createKinematicBox(
              { x: obj.position.x, y: obj.position.y + floorY, z: obj.position.z },
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: pipeInnerR * 0.75, y: 0.08, z: pipeL / 2 },
              0.85,
              0.15
            );
            if (kinematic) {
              // Left inner wall
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: -pipeOuterR + 0.15, y: pipeInnerR * 0.7 - floorY, z: 0 },
                { x: 0.15, y: pipeInnerR * 0.7, z: pipeL / 2 }
              );
              // Right inner wall
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: pipeOuterR - 0.15, y: pipeInnerR * 0.7 - floorY, z: 0 },
                { x: 0.15, y: pipeInnerR * 0.7, z: pipeL / 2 }
              );
              // Ceiling
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: 0, y: pipeInnerR * 1.8 - floorY, z: 0 },
                { x: pipeInnerR * 0.75, y: 0.12, z: pipeL / 2 }
              );

              movingPlatforms.push({
                id: obj.id,
                mesh: pipeGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y + floorY, obj.position.z),
                axis: "x",
                distance: 4.0,
                speed: 1.0,
                movementType: "pipe_shuttle"
              });
            }
            break;
          }

          // Ayuntamiento Clock Hands (M1-N4-E7)
          const isClockHand = obj.properties?.variant === "clock_hand" || obj.properties?.movementType === "clock_hand";
          if (isClockHand) {
            const handGroup = new THREE.Group();
            handGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            handGroup.rotation.copy(tempEuler);

            const handMat = new THREE.MeshStandardMaterial({
              color: (obj.properties?.customColor as string) || 0x212121,
              metalness: 0.8,
              roughness: 0.2
            });

            const hw = obj.scale.x || 0.5;
            const hh = obj.scale.y || 0.4;
            const hl = obj.scale.z || 6.0;

            const bladeGeo = new THREE.BoxGeometry(hw, hh, hl);
            bladeGeo.translate(0, 0, -hl / 2);
            const bladeMesh = new THREE.Mesh(bladeGeo, handMat);
            handGroup.add(bladeMesh);
            collidableMeshes.push(bladeMesh);

            const tipGeo = new THREE.ConeGeometry(hw * 1.5, 1.2, 4);
            tipGeo.rotateY(Math.PI / 4);
            tipGeo.rotateX(-Math.PI / 2);
            tipGeo.translate(0, 0, -hl - 0.5);
            handGroup.add(new THREE.Mesh(tipGeo, handMat));

            root.add(handGroup);
            platformMeshes.push({ mesh: bladeMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              { x: obj.position.x, y: obj.position.y, z: obj.position.z },
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: hw / 2, y: hh / 2, z: hl / 2 },
              0.8,
              0.2,
              { x: 0, y: 0, z: -hl / 2 }
            );
            if (kinematic) {
              movingPlatforms.push({
                id: obj.id,
                mesh: handGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "y",
                distance: 0,
                speed: 1.0,
                rotSpeed: typeof obj.properties?.rotSpeed === "number" ? obj.properties.rotSpeed : 0.8,
                movementType: "clock_hand"
              });
            }
            break;
          }

          // Cojera Character with Crutches and Plaster Cast (M1-N4-E8)
          const isLimpKicker = obj.properties?.variant === "limp_kicker" || obj.properties?.movementType === "limp_kicker" || obj.properties?.variant === "cojo";
          if (isLimpKicker) {
            const kickerRes = LevelBuilder.createLimpKickerMesh(activeQuality);
            const kickerGroup = kickerRes.group;
            kickerGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            kickerGroup.rotation.copy(tempEuler);

            root.add(kickerGroup);
            collidableMeshes.push(...kickerRes.meshes);
            platformMeshes.push({ mesh: kickerRes.torso, isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: 1.0, y: 1.2, z: 0.8 },
              0.8,
              0.3
            );
            if (kinematic) {
              movingPlatforms.push({
                id: obj.id,
                mesh: kickerGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "z",
                distance: 6.0,
                speed: 1.0,
                movementType: "limp_kicker",
                subMeshes: {
                  castLeg: kickerRes.castLeg,
                  crutchL: kickerRes.crutchL,
                  crutchR: kickerRes.crutchR
                }
              });
            }
            break;
          }

          // Concierto Stage Vibration & Equipment (M1-N4-E9)
          const isConcertVibe = obj.properties?.variant === "concert_vibe" || obj.properties?.movementType === "concert_vibe";
          if (isConcertVibe) {
            const model=createConcertModel(),concertGroup=model.group;
            concertGroup.position.set(obj.position.x,obj.position.y,obj.position.z);concertGroup.rotation.copy(tempEuler);
            root.add(concertGroup);collidableMeshes.push(...model.meshes);
            const geometry=model.collisionGeometry;
            const vertices=geometry.getAttribute('position').array as Float32Array;
            const indices=Uint32Array.from({length:vertices.length/3},(_,i)=>i);
            const kinematic=physics.createKinematicTrimesh(obj.position,vertices,indices,.015,.65,tempQuat);
            geometry.dispose();
            if(kinematic)movingPlatforms.push({id:obj.id,mesh:concertGroup as any,body:kinematic.body,
              basePosition:new THREE.Vector3(obj.position.x,obj.position.y,obj.position.z),axis:'y',distance:.045,
              speed:Number(obj.properties?.speed??1.33),movementType:'concert_vibe'});
            break;
          }

          // Lifeguard Sweeper Character with Broom (M2-N1-E4)
          const isLifeguardSweeper = obj.properties?.variant === "lifeguard_sweeper" || obj.properties?.movementType === "lifeguard_sweeper";
          if (isLifeguardSweeper) {
            const sweeperGroup = new THREE.Group();
            sweeperGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            sweeperGroup.rotation.copy(tempEuler);

            const redMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.5 });
            const skinMat = new THREE.MeshStandardMaterial({ color: 0xedbb99, roughness: 0.7 });
            const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
            const woodMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.8 });
            const bristleMat = new THREE.MeshStandardMaterial({ color: 0xfbc02d, roughness: 0.9 });

            // Muscular torso with red cross badge
            const torso = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.8, 0.8), whiteMat);
            torso.position.y = 2.4;
            sweeperGroup.add(torso);

            // Red cross on chest
            const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.05), redMat);
            crossH.position.set(0, 2.5, 0.42);
            const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.05), redMat);
            crossV.position.set(0, 2.5, 0.42);
            sweeperGroup.add(crossH, crossV);

            // Head and visor cap
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), skinMat);
            head.position.y = 3.65;
            const visor = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.5, 0.15, 8), redMat);
            visor.position.set(0, 3.9, 0.1);
            sweeperGroup.add(head, visor);

            // Legs with red trunks
            const shorts = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.9, 0.82), redMat);
            shorts.position.y = 1.25;
            sweeperGroup.add(shorts);

            const legL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.0, 0.5), skinMat);
            legL.position.set(-0.4, 0.5, 0);
            const legR = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.0, 0.5), skinMat);
            legR.position.set(0.4, 0.5, 0);
            sweeperGroup.add(legL, legR);

            // The Giant Pool Broom (Held out front to sweep)
            const broomGroup = new THREE.Group();
            broomGroup.position.set(0, 1.2, 0.6);

            const broomPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 4.2, 8), woodMat);
            broomPole.rotation.x = Math.PI / 3;
            broomPole.position.set(0, 0.6, 0.8);

            const broomHead = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.35, 0.5), woodMat);
            broomHead.position.set(0, -0.6, 1.8);

            const bristles = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.3, 0.45), bristleMat);
            bristles.position.set(0, -0.9, 1.8);

            broomGroup.add(broomPole, broomHead, bristles);
            sweeperGroup.add(broomGroup);

            root.add(sweeperGroup);
            collidableMeshes.push(torso);
            platformMeshes.push({ mesh: torso, isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: 1.8, y: 1.8, z: 1.5 },
              0.8,
              0.2
            );
            if (kinematic) {
              movingPlatforms.push({
                id: obj.id,
                mesh: sweeperGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "x",
                distance: typeof obj.properties?.distance === "number" ? obj.properties.distance : 4.5,
                speed: typeof obj.properties?.speed === "number" ? obj.properties.speed : 1.8,
                movementType: "lifeguard_sweeper",
                subMeshes: { broomGroup }
              });
            }
            break;
          }

          // Animal Hedgehog with Retractable Quills (M2-N1-E6)
          const isSeaUrchin = obj.properties?.variant === "sea_urchin" || obj.properties?.movementType === "sea_urchin";
          if (isSeaUrchin) {
            const urchinGroup = new THREE.Group();
            urchinGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            urchinGroup.rotation.copy(tempEuler);

            // Hedgehog color palette
            const bellyMat = new THREE.MeshStandardMaterial({ color: 0xdecbb5, roughness: 0.8, metalness: 0.05 });
            const snoutMat = new THREE.MeshStandardMaterial({ color: 0xeadcc9, roughness: 0.85 });
            const noseMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.5 });
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a });
            const eyeGlintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const earMat = new THREE.MeshStandardMaterial({ color: 0xbcaaa4, roughness: 0.7 });
            const earInnerMat = new THREE.MeshStandardMaterial({ color: 0xffcdd2, roughness: 0.8 });
            const pawMat = new THREE.MeshStandardMaterial({ color: 0xbcaaa4, roughness: 0.8 });
            const quillBodyMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.6, metalness: 0.2 });
            const quillSpikeMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.4, metalness: 0.3 });
            const quillTipMat = new THREE.MeshStandardMaterial({ color: 0xf5f5dc, roughness: 0.3 });

            // 1. Chubby Hedgehog Body
            const torsoGeo = new THREE.SphereGeometry(1.05, 16, 14);
            torsoGeo.scale(1.0, 0.85, 1.25);
            torsoGeo.translate(0, 0.7, -0.1);
            const torsoMesh = new THREE.Mesh(torsoGeo, bellyMat);
            urchinGroup.add(torsoMesh);

            // 2. Cute Tapered Snout / Head pointing forward
            const snoutGeo = new THREE.ConeGeometry(0.55, 1.0, 14);
            snoutGeo.rotateX(Math.PI / 2);
            snoutGeo.translate(0, 0.65, 1.3);
            const snoutMesh = new THREE.Mesh(snoutGeo, snoutMat);
            urchinGroup.add(snoutMesh);

            // Black button truffle nose
            const noseMesh = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), noseMat);
            noseMesh.position.set(0, 0.65, 1.82);
            urchinGroup.add(noseMesh);

            // Two beady eyes with shiny highlights and cute rounded ears
            for (const eyeX of [-0.32, 0.32]) {
              const eyeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), eyeMat);
              eyeMesh.position.set(eyeX, 0.82, 1.15);
              const glint = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), eyeGlintMat);
              glint.position.set(eyeX > 0 ? 0.05 : -0.05, 0.05, 0.07);
              eyeMesh.add(glint);
              urchinGroup.add(eyeMesh);

              const earOuter = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), earMat);
              earOuter.scale.set(0.6, 1.0, 0.3);
              earOuter.position.set(eyeX * 1.5, 0.95, 0.8);
              earOuter.rotation.y = eyeX > 0 ? 0.3 : -0.3;
              const earInner = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), earInnerMat);
              earInner.scale.set(0.5, 0.8, 0.2);
              earInner.position.set(0, 0, 0.06);
              earOuter.add(earInner);
              urchinGroup.add(earOuter);
            }

            // 3. Cute Little Paws (4 paws resting on ground)
            const pawGeo = new THREE.SphereGeometry(0.18, 8, 8);
            pawGeo.scale(1.1, 0.6, 1.4);
            for (const [px, pz] of [[-0.65, 0.65], [0.65, 0.65], [-0.68, -0.65], [0.68, -0.65]]) {
              const paw = new THREE.Mesh(pawGeo, pawMat);
              paw.position.set(px, 0.1, pz);
              urchinGroup.add(paw);
            }

            // 4. Hedgehog Spine Mantle (dorsal cape & dynamic quills)
            const mantleGeo = new THREE.SphereGeometry(1.08, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.65);
            mantleGeo.scale(1.02, 0.92, 1.3);
            mantleGeo.translate(0, 0.72, -0.15);
            const mantleMesh = new THREE.Mesh(mantleGeo, quillBodyMat);
            urchinGroup.add(mantleMesh);

            // Spikes container group (scales for extending/retracting bristled defense)
            // Complete 360-degree radial sphere covering vertical, horizontal and all diagonal angles
            const spikesGroup = new THREE.Group();
            spikesGroup.position.set(0, 0.75, -0.1);

            const quillOffsets: { pos: [number, number, number]; dir: [number, number, number] }[] = [];

            // 1. Zenith & Top Crest (Vertical spines pointing straight up +Y)
            quillOffsets.push({ pos: [0, 1.15, 0.2], dir: [0, 1.0, 0.15] });
            quillOffsets.push({ pos: [0, 1.2, -0.15], dir: [0, 1.0, 0] });
            quillOffsets.push({ pos: [0, 1.15, -0.55], dir: [0, 1.0, -0.2] });
            quillOffsets.push({ pos: [0, 1.0, -0.95], dir: [0, 0.9, -0.45] });

            // 2. High Dome Ring (pitch ~65 deg, 10 quills pointing steep up & outwards)
            for (let i = 0; i < 10; i++) {
              const a = (i * Math.PI * 2) / 10;
              const qx = Math.sin(a) * 0.55;
              const qz = Math.cos(a) * 0.7 - 0.15;
              const qy = 1.05;
              quillOffsets.push({ pos: [qx, qy, qz], dir: [Math.sin(a) * 0.42, 0.9, Math.cos(a) * 0.42] });
            }

            // 3. Mid Flanks Ring (pitch ~40 deg, 14 quills pointing diagonally up & outwards)
            for (let i = 0; i < 14; i++) {
              const a = (i * Math.PI * 2) / 14;
              const qx = Math.sin(a) * 0.9;
              const qz = Math.cos(a) * 1.1 - 0.15;
              const qy = 0.75;
              quillOffsets.push({ pos: [qx, qy, qz], dir: [Math.sin(a) * 0.75, 0.65, Math.cos(a) * 0.75] });
            }

            // 4. Horizontal Equatorial Perimeter (pitch 0 deg, 16 quills pointing HORIZONTALLY outward in all 360 deg)
            for (let i = 0; i < 16; i++) {
              const a = (i * Math.PI * 2) / 16;
              const qx = Math.sin(a) * 1.12;
              const qz = Math.cos(a) * 1.35 - 0.15;
              const qy = 0.45;
              quillOffsets.push({ pos: [qx, qy, qz], dir: [Math.sin(a) * 1.0, 0.05, Math.cos(a) * 1.0] });
            }

            // 5. Lower Skirt (pitch ~ -15 deg, 10 quills pointing outward & slightly down skirting the flanks and rear)
            for (let i = 0; i < 10; i++) {
              const a = Math.PI * 0.3 + (i * Math.PI * 1.4) / 9;
              const qx = Math.sin(a) * 1.05;
              const qz = Math.cos(a) * 1.25 - 0.15;
              const qy = 0.22;
              quillOffsets.push({ pos: [qx, qy, qz], dir: [Math.sin(a) * 0.95, -0.25, Math.cos(a) * 0.95] });
            }

            // 6. Front Brow Visor (4 quills pointing forward over the snout)
            quillOffsets.push({ pos: [-0.4, 0.85, 0.65], dir: [-0.45, 0.35, 0.82] });
            quillOffsets.push({ pos: [-0.15, 0.95, 0.75], dir: [-0.2, 0.4, 0.9] });
            quillOffsets.push({ pos: [0.15, 0.95, 0.75], dir: [0.2, 0.4, 0.9] });
            quillOffsets.push({ pos: [0.4, 0.85, 0.65], dir: [0.45, 0.35, 0.82] });

            const quillConeGeo = new THREE.ConeGeometry(0.14, 1.4, 7);
            quillConeGeo.translate(0, 0.7, 0);
            const quillTipGeo = new THREE.ConeGeometry(0.08, 0.4, 6);
            quillTipGeo.translate(0, 1.4, 0);

            const upVec = new THREE.Vector3(0, 1, 0);
            const quillDir = new THREE.Vector3();

            for (const { pos, dir } of quillOffsets) {
              const quill = new THREE.Group();
              quill.position.set(pos[0], pos[1], pos[2]);
              quillDir.set(dir[0], dir[1], dir[2]).normalize();
              quill.quaternion.setFromUnitVectors(upVec, quillDir);

              const shaft = new THREE.Mesh(quillConeGeo, quillSpikeMat);
              const tip = new THREE.Mesh(quillTipGeo, quillTipMat);
              quill.add(shaft, tip);
              spikesGroup.add(quill);
            }

            urchinGroup.add(spikesGroup);
            root.add(urchinGroup);
            collidableMeshes.push(torsoMesh);
            platformMeshes.push({ mesh: torsoMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              { x: obj.position.x, y: obj.position.y + 0.6, z: obj.position.z },
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: 1.1, y: 0.7, z: 1.3 },
              0.5,
              1.6
            );
            if (kinematic) {
              movingPlatforms.push({
                id: obj.id,
                mesh: urchinGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "none",
                distance: 0,
                speed: 1.0,
                movementType: "sea_urchin",
                subMeshes: { spikesGroup }
              });
            }
            break;
          }

          // Apartment 9-Story Panoramic Elevator (M2-N1-E7)
          // Open observation cage design: chrome stanchions & waist safety balustrades.
          // Zero occluding full-height glass so the character is 100% visible from all camera angles!
          const isApartmentElevator = obj.properties?.variant === "apartment_elevator" || obj.properties?.movementType === "apartment_elevator";
          if (isApartmentElevator) {
            const cabinGroup = new THREE.Group();
            cabinGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            cabinGroup.rotation.copy(tempEuler);

            const steelMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.9, roughness: 0.15 });
            const chromeMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, metalness: 0.95, roughness: 0.1 });
            const floorMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.65 });
            const lightMat = new THREE.MeshBasicMaterial({ color: 0xfff9c4 });

            const cW = 2.6;
            const cH = 3.2;
            const cD = 2.6;
            const railH = 0.95;

            // 1. Non-slip elevator platform floor
            const cabinFloor = new THREE.Mesh(new THREE.BoxGeometry(cW, 0.2, cD), floorMat);
            cabinFloor.position.y = 0.1;
            const floorTrim = new THREE.Mesh(new THREE.BoxGeometry(cW + 0.08, 0.06, cD + 0.08), chromeMat);
            floorTrim.position.y = 0.2;
            cabinGroup.add(cabinFloor, floorTrim);

            // 2. Open ceiling canopy with warm fixture
            const cabinCeil = new THREE.Mesh(new THREE.BoxGeometry(cW, 0.18, cD), steelMat);
            cabinCeil.position.y = cH;
            const ceilLight = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 1.2), lightMat);
            ceilLight.position.set(0, cH - 0.08, 0);
            cabinGroup.add(cabinCeil, ceilLight);

            // 3. Four corner chrome structural posts
            const postGeo = new THREE.CylinderGeometry(0.045, 0.045, cH, 12);
            for (const [px, pz] of [[-cW / 2 + 0.04, -cD / 2 + 0.04], [cW / 2 - 0.04, -cD / 2 + 0.04], [-cW / 2 + 0.04, cD / 2 - 0.04], [cW / 2 - 0.04, cD / 2 - 0.04]]) {
              const post = new THREE.Mesh(postGeo, chromeMat);
              post.position.set(px, cH / 2, pz);
              cabinGroup.add(post);
            }

            // 4. Waist-high safety balustrades (Left, Right, Back sides) - 100% open vista
            // Left Railing
            const topRailL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, cD - 0.1), chromeMat);
            topRailL.position.set(-cW / 2 + 0.04, railH, 0);
            const midRailL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, cD - 0.1), chromeMat);
            midRailL.position.set(-cW / 2 + 0.04, railH / 2, 0);
            cabinGroup.add(topRailL, midRailL);

            // Right Railing
            const topRailR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, cD - 0.1), chromeMat);
            topRailR.position.set(cW / 2 - 0.04, railH, 0);
            const midRailR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, cD - 0.1), chromeMat);
            midRailR.position.set(cW / 2 - 0.04, railH / 2, 0);
            cabinGroup.add(topRailR, midRailR);

            // Back Railing
            const topRailB = new THREE.Mesh(new THREE.BoxGeometry(cW - 0.1, 0.06, 0.06), chromeMat);
            topRailB.position.set(0, railH, cD / 2 - 0.04);
            const midRailB = new THREE.Mesh(new THREE.BoxGeometry(cW - 0.1, 0.04, 0.04), chromeMat);
            midRailB.position.set(0, railH / 2, cD / 2 - 0.04);
            cabinGroup.add(topRailB, midRailB);

            // Vertical pickets every 0.45m
            const picketGeo = new THREE.CylinderGeometry(0.018, 0.018, railH - 0.1, 8);
            for (let z = -cD / 2 + 0.45; z <= cD / 2 - 0.45; z += 0.45) {
              const pL = new THREE.Mesh(picketGeo, chromeMat);
              pL.position.set(-cW / 2 + 0.04, railH / 2, z);
              const pR = new THREE.Mesh(picketGeo, chromeMat);
              pR.position.set(cW / 2 - 0.04, railH / 2, z);
              cabinGroup.add(pL, pR);
            }
            for (let x = -cW / 2 + 0.45; x <= cW / 2 - 0.45; x += 0.45) {
              const pB = new THREE.Mesh(picketGeo, chromeMat);
              pB.position.set(x, railH / 2, cD / 2 - 0.04);
              cabinGroup.add(pB);
            }

            root.add(cabinGroup);
            collidableMeshes.push(cabinFloor);
            platformMeshes.push({ mesh: cabinFloor, isMoving: true, properties: obj.properties, objIndex: objIdx });

            // Create Kinematic body with floor and protective side waist balustrades
            const kinematic = physics.createKinematicBox(
              { x: obj.position.x, y: obj.position.y + 0.1, z: obj.position.z },
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: cW / 2, y: 0.1, z: cD / 2 },
              0.85,
              0.1
            );
            if (kinematic) {
              // Waist-high containment barriers so player cannot roll off left/right/back while ascending
              physics.addBoxColliderToBody(kinematic.body, { x: -cW / 2 + 0.04, y: railH / 2, z: 0 }, { x: 0.08, y: railH / 2, z: cD / 2 });
              physics.addBoxColliderToBody(kinematic.body, { x: cW / 2 - 0.04, y: railH / 2, z: 0 }, { x: 0.08, y: railH / 2, z: cD / 2 });
              physics.addBoxColliderToBody(kinematic.body, { x: 0, y: railH / 2, z: cD / 2 - 0.04 }, { x: cW / 2, y: railH / 2, z: 0.08 });
              physics.addBoxColliderToBody(kinematic.body, { x: 0, y: cH, z: 0 }, { x: cW / 2, y: 0.1, z: cD / 2 });

              movingPlatforms.push({
                id: obj.id,
                mesh: cabinGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "y",
                distance: 28.0,
                speed: 1.0,
                movementType: "apartment_elevator",
                currentFloor: 0,
                targetFloor: 0,
                elevatorState: "idle",
                floorTimer: 0
              });
            }
            break;
          }

          // Mattress Bouncer (M2-N1-E9)
          const isMattressBouncer = obj.properties?.variant === "mattress_bouncer" || obj.properties?.movementType === "mattress_bouncer";
          if (isMattressBouncer) {
            const mW = obj.scale.x || 12.0;
            const mH = obj.scale.y || 1.2;
            const mD = obj.scale.z || 20.0;

            const mattressGroup = new THREE.Group();
            mattressGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            mattressGroup.rotation.copy(tempEuler);

            const coverMat = new THREE.MeshStandardMaterial({ color: 0xe3f2fd, roughness: 0.7 });
            const stripeMat = new THREE.MeshStandardMaterial({ color: 0x1976d2, roughness: 0.6 });
            const springMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, metalness: 0.85, roughness: 0.2 });

            const baseBody = new THREE.Mesh(new THREE.BoxGeometry(mW, mH, mD), coverMat);
            baseBody.position.y = mH / 2;
            mattressGroup.add(baseBody);

            // Nautical stripes along the mattress surface
            for (let zOff = -mD / 2 + 2.0; zOff < mD / 2; zOff += 4.0) {
              const stripe = new THREE.Mesh(new THREE.BoxGeometry(mW - 0.4, 0.04, 1.2), stripeMat);
              stripe.position.set(0, mH + 0.02, zOff);
              mattressGroup.add(stripe);
            }

            // Visible oversized spring coils underneath
            for (const sx of [-mW / 3, 0, mW / 3]) {
              for (const sz of [-mD / 3, 0, mD / 3]) {
                const springMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.6, 8), springMat);
                springMesh.position.set(sx, -0.3, sz);
                mattressGroup.add(springMesh);
              }
            }

            root.add(mattressGroup);
            collidableMeshes.push(baseBody);
            platformMeshes.push({ mesh: baseBody, isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: mW / 2, y: mH / 2, z: mD / 2 },
              0.4,
              0 // Launch is controlled below; restitution must not amplify falls.
            );
            if (kinematic) {
              movingPlatforms.push({
                id: obj.id,
                mesh: mattressGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "none",
                distance: 0,
                speed: 1.0,
                movementType: "mattress_bouncer"
              });
            }
            break;
          }

          // 5-Blade Rotating Fan with Rounded Cowl (M2-N1-E10)
          const isFan5Blades = obj.properties?.variant === "fan_5blades" || obj.properties?.movementType === "fan_5blades";
          if (isFan5Blades) {
            const fanGroup = new THREE.Group();
            fanGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            fanGroup.rotation.copy(tempEuler);

            const hubMat = new THREE.MeshStandardMaterial({ color: 0x263238, metalness: 0.85, roughness: 0.2 });
            const cowlMat = new THREE.MeshStandardMaterial({ color: 0x37474f, metalness: 0.75, roughness: 0.25 });
            const rimMat = new THREE.MeshStandardMaterial({ color: 0x00bcd4, metalness: 0.85, roughness: 0.15 });
            const bladeMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, metalness: 0.55, roughness: 0.25 });
            const tipMat = new THREE.MeshBasicMaterial({ color: 0xffeb3b });

            const bladeLen = obj.scale.x || 4.5;
            const outerR = bladeLen + 0.35;

            // 1. Stationary Outer Circular Cowl with smooth rounded toroidal rims
            const cowlGroup = new THREE.Group();
            // Shroud cylinder sleeve
            const shroudGeo = new THREE.CylinderGeometry(outerR, outerR, 0.8, 48, 1, true);
            shroudGeo.rotateX(Math.PI / 2);
            const shroudMesh = new THREE.Mesh(shroudGeo, cowlMat);
            cowlGroup.add(shroudMesh);

            // Front & Rear smooth rounded torus lips
            const torusGeo = new THREE.TorusGeometry(outerR, 0.22, 16, 48);
            const frontLip = new THREE.Mesh(torusGeo, rimMat);
            frontLip.position.z = 0.4;
            const backLip = new THREE.Mesh(torusGeo, rimMat);
            backLip.position.z = -0.4;
            cowlGroup.add(frontLip, backLip);

            // 4 Radial structural mounting struts at cardinal angles
            const strutGeo = new THREE.CylinderGeometry(0.08, 0.08, outerR - 0.65, 8);
            for (let i = 0; i < 4; i++) {
              const strut = new THREE.Mesh(strutGeo, hubMat);
              const angle = (i * Math.PI) / 2;
              strut.position.set((Math.cos(angle) * (outerR + 0.65)) / 2, (Math.sin(angle) * (outerR + 0.65)) / 2, 0);
              strut.rotation.z = angle - Math.PI / 2;
              cowlGroup.add(strut);
            }
            fanGroup.add(cowlGroup);

            // 2. Rotating Rotor (Central motor hub + 5 aerodynamic blades)
            const rotorGroup = new THREE.Group();

            // Central motor hub
            const hubGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.75, 24);
            hubGeo.rotateX(Math.PI / 2);
            const hubMesh = new THREE.Mesh(hubGeo, hubMat);
            const hubNoseGeo = new THREE.ConeGeometry(0.5, 0.5, 20);
            hubNoseGeo.rotateX(Math.PI / 2);
            hubNoseGeo.translate(0, 0, 0.5);
            const hubNose = new THREE.Mesh(hubNoseGeo, rimMat);
            rotorGroup.add(hubMesh, hubNose);

            // 5 Aerodynamic blades evenly spaced at 72 degrees (with wide clear gaps between them)
            for (let i = 0; i < 5; i++) {
              const angle = (i * Math.PI * 2) / 5;
              const bladeHolder = new THREE.Group();
              bladeHolder.rotation.z = angle;

              // Blade root and main airfoil
              const bladeGeo = new THREE.BoxGeometry(0.72, bladeLen, 0.06);
              bladeGeo.translate(0, bladeLen / 2 + 0.35, 0);
              const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
              bladeMesh.rotation.y = 0.24;

              // High-vis yellow aerodynamic blade tip
              const tipGeo = new THREE.BoxGeometry(0.76, 0.25, 0.08);
              tipGeo.translate(0, bladeLen + 0.35, 0);
              const tipMesh = new THREE.Mesh(tipGeo, tipMat);

              bladeHolder.add(bladeMesh, tipMesh);
              rotorGroup.add(bladeHolder);
            }
            fanGroup.add(rotorGroup);

            fanGroup.name='fan-assembly';rotorGroup.name='fan-rotor';cowlGroup.name='fan-cowl';
            root.add(fanGroup);
            const rotorMeshes:THREE.Mesh[]=[],cowlMeshes:THREE.Mesh[]=[];
            rotorGroup.traverse(node=>{if(node instanceof THREE.Mesh)rotorMeshes.push(node);});
            cowlGroup.traverse(node=>{if(node instanceof THREE.Mesh)cowlMeshes.push(node);});
            collidableMeshes.push(...rotorMeshes,...cowlMeshes);
            platformMeshes.push({mesh:hubMesh,isMoving:true,properties:obj.properties,objIndex:objIdx});
            const shell=meshColliderData(cowlMeshes,root);
            physics.createTrimeshCollider(shell.vertices,shell.indices,.02,.7);
            const rotor=meshColliderData(rotorMeshes,rotorGroup);
            const kinematic=physics.createKinematicTrimesh(obj.position,rotor.vertices,rotor.indices,.02,.7,tempQuat);
            if(kinematic)movingPlatforms.push({
              id:obj.id,mesh:fanGroup,subMeshes:{rotor:rotorGroup},body:kinematic.body,
              basePosition:new THREE.Vector3().copy(obj.position),baseQuaternion:tempQuat.clone(),
              axis:'z',distance:0,speed:1,movementType:'fan_5blades',rotSpeed:0,
              direction:typeof obj.properties?.direction==='number'?obj.properties.direction:1,
              startDelay:typeof obj.properties?.startDelay==='number'?obj.properties.startDelay:0
            });
            break;
          }

          // -----------------------------------------------------------------
          // Variant: Tramway Cabin (Alicante TRAM - Supports Square, Circle & Linear Rails)
          // -----------------------------------------------------------------
          const isTram = obj.properties?.variant === "tram_square" || obj.properties?.variant === "tram_circle" || obj.properties?.variant === "tram_linear" || obj.properties?.movementType === "tram_square" || obj.properties?.movementType === "tram_circle" || obj.properties?.movementType === "tram_linear";
          if (isTram) {
            const tramW = obj.scale.x || 3.6;
            const tramH = obj.scale.y || 0.4;
            const tramL = obj.scale.z || 7.2;
            const halfW = tramW / 2;
            const halfL = tramL / 2;
            const cabinH = 2.6; // High, spacious clearance (much taller than before!)

            const tramRes = LevelBuilder.createTramMesh(tramW, tramH, tramL, activeQuality);
            const tramGroup = tramRes.group;
            tramGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            tramGroup.rotation.copy(tempEuler);

            root.add(tramGroup);
            collidableMeshes.push(...tramRes.meshes);
            platformMeshes.push({ mesh: tramRes.floorMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: halfW, y: tramH / 2, z: halfL }
            );

            if (kinematic) {
              // Solid roof collider (entire top ceiling of cabin): prevents ball escaping out of the top!
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: 0, y: cabinH + tramH / 2, z: 0 },
                { x: halfW, y: 0.15, z: halfL }
              );

              // Solid left wall: full height from floor to roof!
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: -halfW + 0.12, y: cabinH / 2 + tramH / 2, z: 0 },
                { x: 0.12, y: cabinH / 2, z: halfL }
              );

              // Solid right wall: full height from floor to roof!
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: halfW - 0.12, y: cabinH / 2 + tramH / 2, z: 0 },
                { x: 0.12, y: cabinH / 2, z: halfL }
              );

              // Solid front wall: full height from floor to roof!
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: 0, y: cabinH / 2 + tramH / 2, z: -halfL + 0.12 },
                { x: halfW, y: cabinH / 2, z: 0.12 }
              );

              // Solid rear wall: full height from floor to roof!
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: 0, y: cabinH / 2 + tramH / 2, z: halfL - 0.12 },
                { x: halfW, y: cabinH / 2, z: 0.12 }
              );

              const mType = (obj.properties?.movementType as any) || (obj.properties?.variant as any) || "tram_square";
              const speed = typeof obj.properties?.speed === "number" ? obj.properties.speed : (mType === "tram_square" ? 3.5 : 0.4);
              const startDelay = typeof obj.properties?.startDelay === "number" ? obj.properties.startDelay : 2.0;
              const direction = typeof obj.properties?.direction === "number" ? obj.properties.direction : 1;
              const trackWidth = typeof obj.properties?.trackWidth === "number" ? obj.properties.trackWidth : 24.0;
              const trackLength = typeof obj.properties?.trackLength === "number" ? obj.properties.trackLength : 24.0;
              const cornerRadius = typeof obj.properties?.cornerRadius === "number" ? obj.properties.cornerRadius : 4.0;
              const cx = typeof obj.properties?.centerX === "number" ? obj.properties.centerX : 0;
              const cz = typeof obj.properties?.centerZ === "number" ? obj.properties.centerZ : 0;
              const radius = typeof obj.properties?.radius === "number" ? obj.properties.radius : 14.0;
              const baseAngle = typeof obj.properties?.baseAngle === "number" ? obj.properties.baseAngle : Math.atan2(obj.position.z - cz, obj.position.x - cx);

              const distance = typeof obj.properties?.distance === "number" ? obj.properties.distance : 136.0;

              movingPlatforms.push({
                id: obj.id,
                mesh: tramGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: mType === "tram_linear" ? "z" : "none",
                distance,
                speed,
                direction,
                startDelay,
                movementType: mType,
                centerX: cx,
                centerZ: cz,
                radius,
                baseAngle,
                trackWidth,
                trackLength,
                tramPassenger: new TramPassengerGuard(tramW,tramH,tramL),
                tramPath: mType==="tram_square"?tramTrack(trackWidth,trackLength,cornerRadius):undefined,
                cornerRadius
              });
            }
            break;
          }

          // -----------------------------------------------------------------
          // Variant: EMT Madrid Line 35 Blue Bus (Scania N280UB CNG)
          // -----------------------------------------------------------------
          const isBus34 = obj.properties?.variant === "emt_bus_34" || obj.properties?.movementType === "emt_bus_34";
          const isEMTBus = isBus34 || obj.properties?.variant === "emt_bus_35" || obj.properties?.movementType === "emt_bus_35";
          if (isEMTBus) {
            const busW = obj.scale.x || 3.4;
            const busH = obj.scale.y || 0.45;
            const busL = obj.scale.z || 8.6;
            const halfW = busW / 2;
            const halfL = busL / 2;
            const cabinH = 2.45;

            const busRes = LevelBuilder.createEMTBus35Mesh(busW, busH, busL, activeQuality, isBus34 ? "34" : "35");
            const busGroup = busRes.group;
            busGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            busGroup.rotation.copy(tempEuler);

            root.add(busGroup);
            collidableMeshes.push(...busRes.meshes);
            platformMeshes.push({ mesh: busRes.floorMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: halfW - 0.1, y: busH / 2, z: halfL - 0.1 }
            );

            if (kinematic) {
              // Left wall: full height 2.45m
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: -halfW + 0.14, y: cabinH / 2 + busH / 2, z: 0 },
                { x: 0.14, y: cabinH / 2, z: halfL }
              );

              // Right wall: full height 2.45m
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: halfW - 0.14, y: cabinH / 2 + busH / 2, z: 0 },
                { x: 0.14, y: cabinH / 2, z: halfL }
              );

              // Front cab / windshield wall: full height 2.45m
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: 0, y: cabinH / 2 + busH / 2, z: -halfL + 0.18 },
                { x: halfW, y: cabinH / 2, z: 0.18 }
              );

              // Rear motor wall: full height 2.45m
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: 0, y: cabinH / 2 + busH / 2, z: halfL - 0.18 },
                { x: halfW, y: cabinH / 2, z: 0.18 }
              );

              // Front roof over driver cab
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: 0, y: cabinH + busH / 2, z: -halfL + 0.95 },
                { x: halfW, y: 0.12, z: 0.95 }
              );

              // Rear roof over engine
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: 0, y: cabinH + busH / 2, z: halfL - 0.8 },
                { x: halfW, y: 0.12, z: 0.8 }
              );

              // NOTICE: Central passenger cabin has NO top collider so the ball drops in from spawn!

              const speed = typeof obj.properties?.speed === "number" ? obj.properties.speed : 3.2;
              const startDelay = typeof obj.properties?.startDelay === "number" ? obj.properties.startDelay : 2.0;
              const direction = typeof obj.properties?.direction === "number" ? obj.properties.direction : -1;
              const distance = typeof obj.properties?.distance === "number" ? obj.properties.distance : 78.0;

              movingPlatforms.push({
                id: obj.id,
                mesh: busGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "z",
                distance,
                speed,
                direction,
                startDelay,
                movementType: isBus34 ? "emt_bus_34" : "emt_bus_35"
              });
            }
            break;
          }

          // -----------------------------------------------------------------
          // Variant: Giant Casino Roulette with Hole at Pocket 0
          // -----------------------------------------------------------------
          const isCasinoRoulette = obj.properties?.variant === "casino_roulette" || obj.properties?.movementType === "casino_roulette";
          if (isCasinoRoulette) {
            const radius = Math.max(5.0, (obj.scale.x || 15.0) / 2);
            const dishHeight = obj.scale.y || 0.6;
            const rouletteRes = LevelBuilder.createCasinoRouletteMesh(radius, dishHeight, activeQuality);
            const rouletteGroup = rouletteRes.group;
            rouletteGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            rouletteGroup.rotation.copy(tempEuler);

            root.add(rouletteGroup);
            collidableMeshes.push(...rouletteRes.meshes);
            platformMeshes.push({ mesh: rouletteRes.hubMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            // Central hub kinematic cylinder
            const kinematic = physics.createKinematicCylinder(
              obj.position,
              1.4,
              dishHeight / 2,
              0.3,
              0.4,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }
            );

            if (kinematic) {
              const body = kinematic.body;
              // The rotating body uses the same geometry as the visible sectors and walls.
              // This preserves the open zero sector without gaps in the other eleven.
              for(const mesh of rouletteRes.meshes){
                mesh.updateMatrix();
                const shape=mesh.geometry.clone().applyMatrix4(mesh.matrix);
                const vertices=Float32Array.from(shape.getAttribute('position').array);
                const indices=shape.index ? Uint32Array.from(shape.index.array):Uint32Array.from({length:vertices.length/3},(_,i)=>i);
                physics.addTrimeshColliderToBody(body,vertices,indices,.55,.03);
                shape.dispose();
              }
              const rotSpeed = typeof obj.properties?.rotSpeed === "number" ? obj.properties.rotSpeed : 0.65;
              movingPlatforms.push({
                id: obj.id,
                mesh: rouletteGroup as any,
                body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "none",
                distance: 0,
                speed: 1.0,
                rotSpeed,
                movementType: "casino_roulette"
              });
            }
            break;
          }

          // -----------------------------------------------------------------
          // Variant: Giant Vertical Bicycle Wheel Rolling Forward
          // -----------------------------------------------------------------
          const isVerticalWheel = obj.properties?.variant === "bike_wheel_vertical" || obj.properties?.movementType === "bike_wheel_vertical";
          if (isVerticalWheel) {
            const radius = typeof obj.properties?.radius === "number" ? obj.properties.radius : 3.5;
            const width = obj.scale.x || 2.4;
            const wheelRes = obj.properties?.continuousRoll ? createWheelTrainMesh(radius,width,activeQuality) : LevelBuilder.createVerticalWheelMesh(radius, width, activeQuality);
            const wheelGroup = wheelRes.group;
            wheelGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            wheelGroup.rotation.copy(tempEuler);

            root.add(wheelGroup);
            collidableMeshes.push(...wheelRes.meshes);
            platformMeshes.push({ mesh: wheelRes.tireMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            if(obj.properties?.continuousRoll) {
              const shape=meshColliderData(wheelRes.meshes,wheelGroup);
              const kinematic=physics.createKinematicTrimesh(obj.position,shape.vertices,shape.indices,0,.9,tempQuat);
              if(kinematic)movingPlatforms.push({id:obj.id,mesh:wheelGroup as any,body:kinematic.body,basePosition:new THREE.Vector3().copy(obj.position),baseQuaternion:tempQuat.clone(),axis:'none',distance:0,speed:Number(obj.properties.speed??-.4),radius,continuousRoll:true,movementType:'bike_wheel_vertical'});
              break;
            }

            // Kinematic body located at the wheel axle center so it rotates (pitch) and translates synchronously!
            const halfW = width / 2;
            const kinematic = physics.createKinematicBox(
              { x: obj.position.x, y: obj.position.y, z: obj.position.z },
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: halfW, y: 0.25, z: 0.25 }, // Central axle hub
              0.85,
              0.1
            );

            if (kinematic) {
              const body = kinematic.body;
              const numTreads = 48;
              const treadAngle = (Math.PI * 2) / numTreads;

              for (let i = 0; i < numTreads; i++) {
                const angle = i * treadAngle;
                const treadEuler = new THREE.Euler(angle, 0, 0);
                const treadQuat = new THREE.Quaternion().setFromEuler(treadEuler);

                // 1. Protruding step block (escalón): matches visual yellow/black block around circumference
                const ty = Math.cos(angle) * (radius + 0.05);
                const tz = Math.sin(angle) * (radius + 0.05);
                if(i%3===0) physics.addBoxColliderToBody(
                  body,
                  { x: 0, y: ty, z: tz },
                  { x: (width - 0.1) / 2, y: 0.12, z: 0.25 },
                  0.9,
                  0.05,
                  { x: treadQuat.x, y: treadQuat.y, z: treadQuat.z, w: treadQuat.w }
                );

                // 2. Continuous curved tire base underneath between tread blocks
                const by = Math.cos(angle) * (radius - 0.12);
                const bz = Math.sin(angle) * (radius - 0.12);
                physics.addBoxColliderToBody(
                  body,
                  { x: 0, y: by, z: bz },
                  { x: (width - 0.12) / 2, y: 0.16, z: (radius-.12)*Math.tan(Math.PI/numTreads)+.025 },
                  0.85,
                  0.05,
                  { x: treadQuat.x, y: treadQuat.y, z: treadQuat.z, w: treadQuat.w }
                );

                // 3. Hollow raised rim lip borders on both left and right sides (Bordes huecos con físicas)
                // Raised above tire tread by 0.35m with bounce (0.5) to keep the ball inside the tire channel!
                const ly = Math.cos(angle) * (radius + 0.2);
                const lz = Math.sin(angle) * (radius + 0.2);
                physics.addBoxColliderToBody(
                  body,
                  { x: -halfW - 0.06, y: ly, z: lz },
                  { x: 0.1, y: 0.28, z: (radius+.2)*Math.tan(Math.PI/numTreads)+.025 },
                  0.8,
                  0.5,
                  { x: treadQuat.x, y: treadQuat.y, z: treadQuat.z, w: treadQuat.w }
                );
                physics.addBoxColliderToBody(
                  body,
                  { x: halfW + 0.06, y: ly, z: lz },
                  { x: 0.1, y: 0.28, z: (radius+.2)*Math.tan(Math.PI/numTreads)+.025 },
                  0.8,
                  0.5,
                  { x: treadQuat.x, y: treadQuat.y, z: treadQuat.z, w: treadQuat.w }
                );
              }

              const distance = typeof obj.properties?.distance === "number" ? obj.properties.distance : 10.0;
              const speed = typeof obj.properties?.speed === "number" ? obj.properties.speed : 2.4;

              movingPlatforms.push({
                id: obj.id,
                mesh: wheelGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "none",
                distance,
                speed,
                radius,
                movementType: "bike_wheel_vertical"
              });
            }
            break;
          }

          // -----------------------------------------------------------------
          // Variant: Giant Bicycle Pedal moving in a pedaling cadence cycle
          // -----------------------------------------------------------------
          const isBikePedal = obj.properties?.variant === "bike_pedal" || obj.properties?.movementType === "bike_pedal";
          if (isBikePedal) {
            const pedalW = obj.scale.x || 2.0;
            const pedalH = obj.scale.y || 0.35;
            const pedalL = obj.scale.z || 1.8;
            const isLeft = (obj.properties?.phase as number) !== 0;

            const pedalRes = LevelBuilder.createBicyclePedalMesh(pedalW, pedalH, pedalL, isLeft, activeQuality);
            const pedalGroup = pedalRes.group;
            pedalGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            pedalGroup.rotation.copy(tempEuler);

            root.add(pedalGroup);
            collidableMeshes.push(...pedalRes.meshes);
            platformMeshes.push({ mesh: pedalRes.pedalMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: pedalW / 2, y: pedalH / 2, z: pedalL / 2 }
            );

            if (kinematic) {
              const radius = typeof obj.properties?.radius === "number" ? obj.properties.radius : 1.6;
              const speed = typeof obj.properties?.speed === "number" ? obj.properties.speed : 1.8;
              const phase = typeof obj.properties?.phase === "number" ? obj.properties.phase : 0;

              movingPlatforms.push({
                id: obj.id,
                mesh: pedalGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "none",
                distance: radius,
                speed,
                phase,
                radius,
                movementType: "bike_pedal"
              });
            }
            break;
          }

          // -----------------------------------------------------------------
          // Variant: Giant Rotating Beach Umbrella (M2-N3-E6)
          // -----------------------------------------------------------------
          const isGiantUmbrella = obj.properties?.variant === "giant_umbrella" || obj.properties?.movementType === "giant_umbrella";
          if (isGiantUmbrella) {
            const radius = typeof obj.properties?.radius === "number" ? obj.properties.radius : (obj.scale.x || 15.0) / 2;
            const c1 = (obj.properties?.customColor as string) || "#ff3d00";
            const c2 = (obj.properties?.stripeColor as string) || "#ffea00";
            const umbrellaRes = LevelBuilder.createGiantUmbrellaMesh(radius, activeQuality, c1, c2);
            const umbrellaGroup = umbrellaRes.group;
            umbrellaGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            umbrellaGroup.rotation.copy(tempEuler);

            root.add(umbrellaGroup);
            collidableMeshes.push(...umbrellaRes.meshes);
            platformMeshes.push({ mesh: umbrellaRes.canopyMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            // Follow the actual sloped canopy, perimeter, mast and finial.
            const umbrellaCollider=meshColliderData(umbrellaRes.meshes);
            const kinematic = physics.createKinematicTrimesh(
              obj.position,
              umbrellaCollider.vertices,
              umbrellaCollider.indices,
              0.02,
              0.75,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }
            );

            if (kinematic) {
              const rotSpeed = typeof obj.properties?.rotSpeed === "number" ? obj.properties.rotSpeed : 0.45;
              const direction = typeof obj.properties?.direction === "number" ? obj.properties.direction : 1;

              movingPlatforms.push({
                id: obj.id,
                mesh: umbrellaGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "none",
                distance: 0,
                speed: 1.0,
                rotSpeed,
                direction,
                baseQuaternion: tempQuat.clone(),
                movementType: "giant_umbrella"
              });
            }
            break;
          }

          // -----------------------------------------------------------------
          // Variant: Beach Towel with Undulating Wave Motion (M2-N3-E7)
          // -----------------------------------------------------------------
          const isBeachTowel = obj.properties?.variant === "beach_towel" || obj.properties?.movementType === "towel_wave";
          if (isBeachTowel) {
            const towelW = obj.scale.x || 5.8;
            const towelL = obj.scale.z || 24.0;
            const towelRes = LevelBuilder.createBeachTowelMesh(towelW, towelL, activeQuality);
            const towelGroup = towelRes.group;
            towelGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            towelGroup.rotation.copy(tempEuler);

            root.add(towelGroup);
            collidableMeshes.push(...towelRes.meshes);
            platformMeshes.push({ mesh: towelRes.towelMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: towelW / 2, y: 0.25, z: towelL / 2 },
              0.75,
              0.2
            );

            if (kinematic) {
              const speed = typeof obj.properties?.speed === "number" ? obj.properties.speed : 2.0;
              const distance = typeof obj.properties?.distance === "number" ? obj.properties.distance : 0.8;

              movingPlatforms.push({
                id: obj.id,
                mesh: towelGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "y",
                distance,
                speed,
                movementType: "towel_wave"
              });
            }
            break;
          }

          // -----------------------------------------------------------------
          // Variant: Ocean Wave Pusher Hazard (M2-N3-E8 & M2-N3-E10)
          // -----------------------------------------------------------------
          const isWavePusher = obj.properties?.movementType === "wave_pusher" || obj.properties?.variant === "wave_pusher";
          if (isWavePusher) {
            const waveW = obj.scale.x || 2.8;
            const waveH = obj.scale.y || 0.55;
            const waveL = obj.scale.z || 4.5;
            const waveRes = LevelBuilder.createWaveMesh(waveW, waveH, waveL, activeQuality);
            const waveGroup = waveRes.group;
            waveGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            waveGroup.rotation.copy(tempEuler);

            root.add(waveGroup);
            collidableMeshes.push(...waveRes.meshes);
            platformMeshes.push({ mesh: waveRes.waveMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: waveW / 2, y: waveH / 2, z: waveL / 2 },
              0.9,
              0.1
            );

            if (kinematic) {
              const distance = typeof obj.properties?.distance === "number" ? obj.properties.distance : 9.5;
              const cycleTime = typeof obj.properties?.cycleTime === "number" ? obj.properties.cycleTime : 3.5;

              movingPlatforms.push({
                id: obj.id,
                mesh: waveGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "x",
                distance,
                speed: 1.0,
                cycleTime,
                movementType: "wave_pusher"
              });
            }
            break;
          }

          // -----------------------------------------------------------------
          // Variant: Giant 8-Slice Rotating & Undulating Popeye Pizza (M2-N4-E9)
          // -----------------------------------------------------------------
          const isPopeyePizza = obj.properties?.variant === "popeye_pizza" || obj.properties?.movementType === "popeye_pizza";
          if (isPopeyePizza) {
            const radius = typeof obj.properties?.radius === "number" ? obj.properties.radius : (obj.scale.x || 16.0) / 2;
            const pizzaRes = LevelBuilder.createPopeyePizzaMesh(radius, activeQuality);
            const pizzaGroup = pizzaRes.group;
            pizzaGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            pizzaGroup.rotation.copy(tempEuler);

            root.add(pizzaGroup);
            collidableMeshes.push(...pizzaRes.meshes);
            platformMeshes.push({ mesh: pizzaRes.meshes[0] || (pizzaGroup as any), isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicCylinder(
              obj.position,
              radius,
              0.45,
              0.4,
              0.75,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }
            );

            if (kinematic) {
              movingPlatforms.push({
                id: obj.id,
                mesh: pizzaGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "y",
                distance: 0,
                speed: 1.0,
                rotSpeed: typeof obj.properties?.rotSpeed === "number" ? obj.properties.rotSpeed : 0.45,
                waveAmplitude: typeof obj.properties?.waveAmplitude === "number" ? obj.properties.waveAmplitude : 0.65,
                waveSpeed: typeof obj.properties?.waveSpeed === "number" ? obj.properties.waveSpeed : 2.2,
                movementType: "popeye_pizza"
              });
            }
            break;
          }

          // -----------------------------------------------------------------
          // WORLD 3 SPECIAL MOVING PLATFORMS & HAZARDS
          // -----------------------------------------------------------------
          const isVillageDog = obj.properties?.variant === "village_dog" || obj.properties?.variant === "village_dogs" || obj.properties?.movementType === "village_dogs" || obj.properties?.variant === "carabanchel_dog";
          if (isVillageDog) {
            const breedIdx = (obj.properties?.breedIdx as number) || 0;
            const dogRes = LevelBuilder.createDogMesh(activeQuality, breedIdx);
            const dogGroup = dogRes.group;
            dogGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            dogGroup.rotation.copy(tempEuler);
            root.add(dogGroup);
            collidableMeshes.push(...dogRes.meshes);
            platformMeshes.push({ mesh: dogRes.meshes[0] || (dogGroup as any), isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: 0.55, y: 0.55, z: 0.75 },
              1.25,
              0.2
            );
            if (kinematic) {
              movingPlatforms.push({
                id: obj.id,
                mesh: dogGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: (obj.properties?.axis as any) || "x",
                distance: typeof obj.properties?.distance === "number" ? obj.properties.distance : 9.0,
                speed: typeof obj.properties?.speed === "number" ? obj.properties.speed : 4.0,
                phase: typeof obj.properties?.phase === "number" ? obj.properties.phase : 0,
                direction: typeof obj.properties?.direction === "number" ? obj.properties.direction : (obj.position.x > 0 ? -1 : 1),
                movementType: "village_dogs",
                eliminatesPlayer: Boolean(obj.properties?.eliminatesPlayer),
                subMeshes: { tailMesh: dogRes.tailMesh, headGroup: dogRes.headGroup, legs: dogRes.legs as any }
              });
            }
            break;
          }

          const isVillageGirls = obj.properties?.variant === "village_girl" || obj.properties?.movementType === "village_girls";
          if (isVillageGirls) {
            const isG2 = Boolean(obj.properties?.isGirl2);
            const girlRes = LevelBuilder.createGirlMesh(activeQuality, isG2);
            const girlGroup = girlRes.group;
            girlGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            girlGroup.rotation.copy(tempEuler);
            root.add(girlGroup);
            collidableMeshes.push(...girlRes.meshes);
            platformMeshes.push({ mesh: girlRes.meshes[0] || (girlGroup as any), isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: 0.45, y: 0.85, z: 0.45 },
              0.8,
              0.3
            );
            if (kinematic) {
              movingPlatforms.push({
                id: obj.id,
                mesh: girlGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: (obj.properties?.axis as any) || "x",
                distance: typeof obj.properties?.distance === "number" ? obj.properties.distance : 4.5,
                speed: typeof obj.properties?.speed === "number" ? obj.properties.speed : 2.2,
                phase: typeof obj.properties?.phase === "number" ? obj.properties.phase : 0,
                movementType: "village_girls"
              });
            }
            break;
          }

          const isVillageBoys = obj.properties?.variant === "village_boy" || obj.properties?.movementType === "village_boys";
          if (isVillageBoys) {
            const isB2 = Boolean(obj.properties?.isBoy2);
            const boyRes = LevelBuilder.createBoyMesh(activeQuality, isB2);
            const boyGroup = boyRes.group;
            boyGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            boyGroup.rotation.copy(tempEuler);
            root.add(boyGroup);
            collidableMeshes.push(...boyRes.meshes);
            platformMeshes.push({ mesh: boyRes.meshes[0] || (boyGroup as any), isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: 0.5, y: 0.85, z: 0.45 },
              0.85,
              0.3
            );
            if (kinematic) {
              movingPlatforms.push({
                id: obj.id,
                mesh: boyGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: (obj.properties?.axis as any) || "x",
                distance: typeof obj.properties?.distance === "number" ? obj.properties.distance : 5.5,
                speed: typeof obj.properties?.speed === "number" ? obj.properties.speed : 3.8,
                phase: typeof obj.properties?.phase === "number" ? obj.properties.phase : 0,
                movementType: "village_boys"
              });
            }
            break;
          }

          const isTurronCat = obj.properties?.variant === "turron_cat" || obj.properties?.movementType === "turron_cat";
          if (isTurronCat) {
            // Slender ginger tabby cat
            const catRes = LevelBuilder.createDogMesh(activeQuality, 1, "#ff9800");
            const catGroup = catRes.group;
            catGroup.scale.set(0.7, 0.7, 0.7);
            catGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            catGroup.rotation.copy(tempEuler);
            root.add(catGroup);
            collidableMeshes.push(...catRes.meshes);
            platformMeshes.push({ mesh: catRes.meshes[0] || (catGroup as any), isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: 0.35, y: 0.4, z: 0.45 },
              0.8,
              0.3
            );
            if (kinematic) {
              movingPlatforms.push({
                id: obj.id,
                mesh: catGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "z",
                distance: typeof obj.properties?.distance === "number" ? obj.properties.distance : 18.0,
                speed: typeof obj.properties?.speed === "number" ? obj.properties.speed : 3.5,
                phase: typeof obj.properties?.phase === "number" ? obj.properties.phase : 0,
                movementType: "turron_cat"
              });
            }
            break;
          }

          // 3D A4 Coloring Drawing Sheet Moving Platform (M3-N2-E7 Dibujos)
          const isA4Sheet = obj.properties?.variant === "a4_sheet" || obj.properties?.theme === "drawing_sheet" || obj.properties?.theme === "coloring_sheet";
          if (isA4Sheet) {
            const sheetIndex = (obj.properties?.sheetIndex as number) || (objIdx + 1);
            const pencilColor = (obj.properties?.pencilColor as string) || (obj.properties?.customColor as string) || "#e53935";
            const a4Res = LevelBuilder.createA4SheetMesh(obj.scale.x, obj.scale.y, obj.scale.z, activeQuality, sheetIndex, pencilColor);
            const a4Group = a4Res.group;
            a4Group.position.set(obj.position.x, obj.position.y, obj.position.z);
            a4Group.rotation.copy(tempEuler);
            root.add(a4Group);
            collidableMeshes.push(...a4Res.meshes);
            platformMeshes.push({ mesh: a4Res.platformMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: obj.scale.x / 2, y: obj.scale.y / 2, z: obj.scale.z / 2 }
            );

            if (kinematic) {
              const axis = (obj.properties?.axis as "x" | "y" | "z" | "yz") || "x";
              const distance = typeof obj.properties?.distance === "number" ? obj.properties.distance : 4.2;
              const speed = typeof obj.properties?.speed === "number" ? obj.properties.speed : 1.2;
              const movementType = (obj.properties?.movementType as any) || "sine";
              const direction = typeof obj.properties?.direction === "number" ? obj.properties.direction : 1;
              const startDelay = typeof obj.properties?.startDelay === "number" ? obj.properties.startDelay : 0;
              const slopeY = typeof obj.properties?.slopeY === "number" ? obj.properties.slopeY : undefined;
              const phase = typeof obj.properties?.phase === "number" ? obj.properties.phase : undefined;

              movingPlatforms.push({
                id: obj.id,
                mesh: a4Group as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                baseRotation: tempEuler.clone(),
                baseQuaternion: tempQuat.clone(),
                axis,
                distance,
                speed,
                movementType,
                direction,
                startDelay,
                slopeY,
                phase
              });
            }
            break;
          }

          // Standard Moving Platform (e.g. gates / moving slabs / boardwalk planks / circular stepping stones)
          const isCylinder = obj.properties?.shape === "cylinder" || obj.properties?.platformShape === "cylinder";
          let mesh: THREE.Mesh;
          let kinematic: { body: RAPIER.RigidBody; collider: RAPIER.Collider } | null = null;

          if (isCylinder) {
            const radius = (obj.scale.x + obj.scale.z) / 4;
            const height = obj.scale.y;
            const geo = new THREE.CylinderGeometry(radius, radius, height, 36);
            const mat = createPlatformMeshMaterial(obj.scale.x, obj.scale.y, obj.scale.z, true, obj.properties, objIdx);
            mesh = new THREE.Mesh(geo, Array.isArray(mat) ? mat[2] || mat[0] : mat);
            mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
            mesh.rotation.copy(tempEuler);
            root.add(mesh);
            collidableMeshes.push(mesh);
            platformMeshes.push({ mesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            kinematic = physics.createKinematicCylinder(
              obj.position,
              radius,
              height / 2,
              0.15,
              0.75,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }
            );
          } else {
            if (obj.properties?.movementType === "vivagym_obstacle") {
              mesh = LevelBuilder.createVivaGymObstacleMesh(obj.scale, obj.properties.obstacleForm);
            } else {
              const geo = new THREE.BoxGeometry(obj.scale.x, obj.scale.y, obj.scale.z);
              LevelBuilder.applyContinuousWorldUVs(geo, obj.position, obj.rotation, obj.scale, 4.0);
              const mat = createPlatformMeshMaterial(obj.scale.x, obj.scale.y, obj.scale.z, true, obj.properties, objIdx);
              mesh = new THREE.Mesh(geo, mat);
            }
            mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
            mesh.rotation.copy(tempEuler);
            root.add(mesh);
            collidableMeshes.push(mesh);
            platformMeshes.push({ mesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            if (obj.properties?.movementType === "vivagym_obstacle") {
              const { y, z } = sampleVivaGymObstacle(
                0, Number(obj.properties.speed), Number(obj.properties.distance), Number(obj.properties.phase),
                Number(obj.properties.centerY), Number(obj.properties.centerZ)
              );
              mesh.position.set(obj.position.x, y, z);
              mesh.visible = y > Number(obj.properties.centerY) - 2.1;
            }
            kinematic = obj.properties?.obstacleForm === "drum" && obj.properties.movementType === "vivagym_obstacle"
              ? physics.createKinematicCylinder(mesh.position, obj.scale.x / 2, obj.scale.y / 2, 0.12, 0.7)
              : physics.createKinematicBox(
              mesh.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: obj.scale.x / 2, y: obj.scale.y / 2, z: obj.scale.z / 2 }
            );
          }

          if (kinematic) {
            const axis = (obj.properties?.axis as "x" | "y" | "z" | "yz") || "x";
            const distance = typeof obj.properties?.distance === "number" ? obj.properties.distance : 6.0;
            const speed = typeof obj.properties?.speed === "number" ? obj.properties.speed : 2.0;
            const movementType = (obj.properties?.movementType as any) || "sine";
            const direction = typeof obj.properties?.direction === "number" ? obj.properties.direction : 1;
            const startDelay = typeof obj.properties?.startDelay === "number" ? obj.properties.startDelay : 0;
            const slopeY = typeof obj.properties?.slopeY === "number" ? obj.properties.slopeY : undefined;
            const phase = typeof obj.properties?.phase === "number" ? obj.properties.phase : undefined;
            const waveAmplitude = typeof obj.properties?.waveAmplitude === "number" ? obj.properties.waveAmplitude : undefined;
            const cycleTime = typeof obj.properties?.cycleTime === "number" ? obj.properties.cycleTime : undefined;
            const isOrbital = movementType === "circular" || movementType === "orbit";
            const isTramCircle = movementType === "tram_circle";
            const isVerticalCircle = movementType === "vertical_circle";
            const centerX = typeof obj.properties?.centerX === "number" ? obj.properties.centerX : (isOrbital || isTramCircle ? 0 : undefined);
            const centerY = typeof obj.properties?.centerY === "number" ? obj.properties.centerY : (isVerticalCircle ? obj.position.y : undefined);
            const centerZ = typeof obj.properties?.centerZ === "number" ? obj.properties.centerZ : (isOrbital || isTramCircle ? 0 : isVerticalCircle ? obj.position.z : undefined);
            const rollSpeed = typeof obj.properties?.rollSpeed === "number" ? obj.properties.rollSpeed : undefined;
            const pushSpeed = typeof obj.properties?.pushSpeed === "number" ? obj.properties.pushSpeed : undefined;

            let radius: number | undefined;
            let baseAngle: number | undefined;

            if (isOrbital) {
              const cx = centerX ?? 0;
              const cz = centerZ ?? 0;
              const distFromCenter = Math.hypot(obj.position.x - cx, obj.position.z - cz);
              // Dynamic calculation: orbital radius and base angle are strictly aligned with actual placed position
              radius = distFromCenter > 0.01 ? distFromCenter : (typeof obj.properties?.radius === "number" ? obj.properties.radius : 12.0);
              baseAngle = distFromCenter > 0.01 ? Math.atan2(obj.position.z - cz, obj.position.x - cx) : (typeof obj.properties?.baseAngle === "number" ? obj.properties.baseAngle : 0);
            } else if (isTramCircle) {
              radius = typeof obj.properties?.radius === "number" ? obj.properties.radius : 14.0;
              baseAngle = typeof obj.properties?.baseAngle === "number" ? obj.properties.baseAngle : (centerX !== undefined && centerZ !== undefined ? Math.atan2(obj.position.z - centerZ, obj.position.x - centerX) : 0);
            } else if (isVerticalCircle) {
              const cy = centerY ?? obj.position.y;
              const cz = centerZ ?? obj.position.z;
              const distFromCenter = Math.hypot(obj.position.y - cy, obj.position.z - cz);
              radius = typeof obj.properties?.radius === "number" ? obj.properties.radius : (distFromCenter > 0.01 ? distFromCenter : 5.5);
              baseAngle = typeof obj.properties?.baseAngle === "number" ? obj.properties.baseAngle : (distFromCenter > 0.01 ? Math.atan2(obj.position.y - cy, obj.position.z - cz) : 0);
            }

            movingPlatforms.push({
              id: obj.id,
              mesh,
              body: kinematic.body,
              basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
              baseRotation: tempEuler.clone(),
              baseQuaternion: tempQuat.clone(),
              axis,
              distance,
              speed,
              movementType,
              direction,
              startDelay,
              slopeY,
              phase,
              waveAmplitude,
              cycleTime,
              centerX,
              centerY,
              centerZ,
              radius,
              baseAngle,
              rollSpeed,
              pushSpeed
            });
          }
          break;
        }

        case "ramp": {
          const isTiltingRamp =
            obj.properties?.movementType === "tilt_x" ||
            obj.properties?.variant === "tilting_ramp" ||
            Boolean(obj.properties?.isMoving);

          if (isTiltingRamp) {
            const rampGroup = new THREE.Group();
            const geo = new THREE.BoxGeometry(obj.scale.x, obj.scale.y, obj.scale.z);
            LevelBuilder.applyContinuousWorldUVs(geo, obj.position, obj.rotation, obj.scale, 4.0);
            const mat = createPlatformMeshMaterial(obj.scale.x, obj.scale.y, obj.scale.z, false, obj.properties, objIdx);
            const deckMesh = new THREE.Mesh(geo, mat);
            rampGroup.add(deckMesh);
            collidableMeshes.push(deckMesh);
            platformMeshes.push({ mesh: deckMesh, isMoving: true, properties: obj.properties, objIndex: objIdx });

            // Bordillos de contención laterales (curbs) que basculan solidariamente con la rampa
            const curbW = 0.45;
            const curbH = 0.65;
            const curbGeo = new THREE.BoxGeometry(curbW, curbH, obj.scale.z);
            const curbMat = new THREE.MeshStandardMaterial({
              color: 0x475569,
              roughness: 0.85,
              metalness: 0.15
            });
            const curbL = new THREE.Mesh(curbGeo, curbMat);
            curbL.position.set(-obj.scale.x / 2 - curbW / 2 + 0.05, (obj.scale.y + curbH) / 2 - 0.1, 0);
            rampGroup.add(curbL);
            collidableMeshes.push(curbL);

            const curbR = new THREE.Mesh(curbGeo, curbMat);
            curbR.position.set(obj.scale.x / 2 + curbW / 2 - 0.05, (obj.scale.y + curbH) / 2 - 0.1, 0);
            rampGroup.add(curbR);
            collidableMeshes.push(curbR);

            // Travesaños de madera de castaño para tracción (steps)
            const stepW = obj.scale.x - 0.2;
            const stepH = 0.22;
            const stepL = 1.2;
            const stepGeo = new THREE.BoxGeometry(stepW, stepH, stepL);
            const stepMat = new THREE.MeshStandardMaterial({
              color: 0x6d4c41,
              roughness: 0.8,
              metalness: 0.1
            });
            const stepOffsetsZ = [-obj.scale.z * 0.28, 0, obj.scale.z * 0.28];
            for (const sZ of stepOffsetsZ) {
              const stepMesh = new THREE.Mesh(stepGeo, stepMat);
              stepMesh.position.set(0, obj.scale.y / 2 + stepH / 2, sZ);
              rampGroup.add(stepMesh);
              collidableMeshes.push(stepMesh);
            }

            // Eje cilíndrico de acero de la bisagra en la base
            const hingeMat = new THREE.MeshStandardMaterial({
              color: 0x263238,
              roughness: 0.4,
              metalness: 0.8
            });
            const axleGeo = new THREE.CylinderGeometry(0.38, 0.38, obj.scale.x + 1.2, 16);
            axleGeo.rotateZ(Math.PI / 2);
            const axleMesh = new THREE.Mesh(axleGeo, hingeMat);
            axleMesh.position.set(0, -obj.scale.y * 0.25, obj.scale.z / 2);
            rampGroup.add(axleMesh);

            rampGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            rampGroup.rotation.copy(tempEuler);
            root.add(rampGroup);

            // Cuerpo cinemático Rapier para la rampa basculante
            const kinematic = physics.createKinematicBox(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: obj.scale.x / 2, y: obj.scale.y / 2, z: obj.scale.z / 2 },
              0.85,
              0.05
            );

            if (kinematic) {
              // Colliders físicos de los bordillos laterales
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: -obj.scale.x / 2 - curbW / 2 + 0.05, y: (obj.scale.y + curbH) / 2 - 0.1, z: 0 },
                { x: curbW / 2, y: curbH / 2, z: obj.scale.z / 2 },
                0.85,
                0.05
              );
              physics.addBoxColliderToBody(
                kinematic.body,
                { x: obj.scale.x / 2 + curbW / 2 - 0.05, y: (obj.scale.y + curbH) / 2 - 0.1, z: 0 },
                { x: curbW / 2, y: curbH / 2, z: obj.scale.z / 2 },
                0.85,
                0.05
              );

              // Colliders físicos de los peldaños de tracción
              for (const sZ of stepOffsetsZ) {
                physics.addBoxColliderToBody(
                  kinematic.body,
                  { x: 0, y: obj.scale.y / 2 + stepH / 2, z: sZ },
                  { x: stepW / 2, y: stepH / 2, z: stepL / 2 },
                  0.85,
                  0.05
                );
              }

              const Hz = obj.scale.z / 2;
              const minAngle = typeof obj.properties?.minAngle === "number" ? obj.properties.minAngle : 0.03;
              const maxAngle = typeof obj.properties?.maxAngle === "number" ? obj.properties.maxAngle : (Math.abs(obj.rotation.x) || 0.388);
              const hingeZ = typeof obj.properties?.hingeZ === "number" ? obj.properties.hingeZ : (obj.position.z + Hz * Math.cos(maxAngle));
              const hingeY = typeof obj.properties?.hingeY === "number" ? obj.properties.hingeY : (obj.position.y - Hz * Math.sin(maxAngle));
              const cycleTime = typeof obj.properties?.cycleTime === "number" ? obj.properties.cycleTime : 8.0;
              const pauseBottom = typeof obj.properties?.pauseBottom === "number" ? obj.properties.pauseBottom : 1.5;
              const riseTime = typeof obj.properties?.riseTime === "number" ? obj.properties.riseTime : 2.5;
              const pauseTop = typeof obj.properties?.pauseTop === "number" ? obj.properties.pauseTop : 1.5;
              const fallTime = typeof obj.properties?.fallTime === "number" ? obj.properties.fallTime : 2.5;

              movingPlatforms.push({
                id: obj.id,
                mesh: rampGroup as any,
                body: kinematic.body,
                basePosition: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
                axis: "none",
                distance: obj.scale.z,
                speed: 1.0,
                movementType: "tilt_x",
                minAngle,
                maxAngle,
                hingeZ,
                hingeY,
                cycleTime,
                pauseBottom,
                riseTime,
                pauseTop,
                fallTime
              });
            }
            break;
          }

          const geo = new THREE.BoxGeometry(obj.scale.x, obj.scale.y, obj.scale.z);
          LevelBuilder.applyContinuousWorldUVs(geo, obj.position, obj.rotation, obj.scale, 4.0);
          const mat = createPlatformMeshMaterial(obj.scale.x, obj.scale.y, obj.scale.z, false, obj.properties, objIdx);
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
          mesh.rotation.copy(tempEuler);
          root.add(mesh);
          collidableMeshes.push(mesh);
          platformMeshes.push({ mesh, isMoving: false, properties: obj.properties, objIndex: objIdx });

          physics.createBoxCollider(
            obj.position,
            { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
            { x: obj.scale.x / 2, y: obj.scale.y / 2, z: obj.scale.z / 2 },
            0.7,
            0.1
          );
          break;
        }

        case "bumper":
        case "cylinder": {
          const isBull =
            obj.properties?.variant === "bull" ||
            obj.properties?.subType === "bull" ||
            (data.stage === 7 && data.name === "Toros" && obj.type === "bumper");

          if (isBull) {
            const customBumperColor = (obj.properties?.color as string) || (obj.properties?.customColor as string);
            const bullRes = LevelBuilder.createBullMesh(activeQuality, customBumperColor);
            const bullGroup = bullRes.group;
            bullGroup.position.set(obj.position.x, obj.position.y, obj.position.z);
            bullGroup.rotation.copy(tempEuler);
            root.add(bullGroup);
            collidableMeshes.push(...bullRes.meshes);

            const radius = Math.max(0.85, (obj.scale.x || 2.0) / 2);
            const height = obj.scale.y || 1.5;
            const bounce = typeof obj.properties?.bounce === "number" ? obj.properties.bounce : 1.35;
            const distance = typeof obj.properties?.distance === "number" ? obj.properties.distance : 3.2;
            const speed = typeof obj.properties?.speed === "number" ? obj.properties.speed : 1.0;
            const phase = typeof obj.properties?.phase === "number" ? obj.properties.phase : 0.0;

            const kinematic = physics.createKinematicCylinder(
              obj.position,
              radius,
              height / 2,
              bounce
            );

            if (kinematic) {
              activeBulls.push({
                id: obj.id,
                group: bullGroup,
                headGroup: bullRes.headGroup,
                body: kinematic.body,
                baseX: obj.position.x,
                baseY: obj.position.y,
                baseZ: obj.position.z,
                distance,
                speed,
                phase,
                axis: (obj.properties?.axis as "x" | "z") || "x"
              });
            }
            break;
          }

          // Dulce de Membrillo Jelly Bumper Cube (M4-N3-E2 Alba de Tormes)
          if (obj.properties?.variant === "membrillo_cube") {
            const w = obj.scale.x || 2.4;
            const h = obj.scale.y || 1.4;
            const d = obj.scale.z || 2.4;
            const membrilloRes = LevelBuilder.createMembrilloBumperMesh(w, h, d, activeQuality);
            membrilloRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
            membrilloRes.group.rotation.copy(tempEuler);
            root.add(membrilloRes.group);
            collidableMeshes.push(...membrilloRes.meshes);

            const bounce = typeof obj.properties?.bounce === "number" ? obj.properties.bounce : 1.85;
            physics.createBoxCollider(
              { x: obj.position.x, y: obj.position.y + h / 2, z: obj.position.z },
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: w / 2, y: h / 2, z: d / 2 },
              bounce,
              0.05
            );
            break;
          }

          // The Good Burger (TGB) Bouncy Brioche Bumper (M4-N4-E8 TGB)
          if (obj.properties?.variant === "tgb_burger") {
            const r = (obj.scale.x || 12.0) / 2;
            const h = obj.scale.y || 5.2;
            const burgerRes = LevelBuilder.createTGBBurgerMesh(r, h, activeQuality);
            burgerRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
            burgerRes.group.rotation.copy(tempEuler);
            root.add(burgerRes.group);
            collidableMeshes.push(...burgerRes.meshes);

            const bounce = typeof obj.properties?.bounce === "number" ? obj.properties.bounce : 2.15;
            physics.createCylinderCollider(
              { x: obj.position.x, y: obj.position.y + h / 2, z: obj.position.z },
              r,
              h / 2,
              bounce,
              0.05
            );
            break;
          }

          // Rodilla Arcade Bumper (M4-N4-E6 Rodilla)
          if (obj.properties?.variant === "rodilla_bumper") {
            const r = (obj.scale.x || 2.4) / 2;
            const h = obj.scale.y || 1.4;
            const bumperRes = LevelBuilder.createRodillaBumperMesh(r, h, activeQuality);
            bumperRes.group.position.set(obj.position.x, obj.position.y, obj.position.z);
            bumperRes.group.rotation.copy(tempEuler);
            root.add(bumperRes.group);
            collidableMeshes.push(...bumperRes.meshes);

            const bounce = typeof obj.properties?.bounce === "number" ? obj.properties.bounce : 1.75;
            physics.createCylinderCollider(
              obj.position,
              r,
              h / 2,
              bounce,
              0.4,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }
            );
            break;
          }

          const bShape = (obj.properties?.shape as string) || (obj.properties?.platformShape as string) || "cylinder";
          const radius = Math.max(obj.scale.x, obj.scale.z) / 2;
          const height = obj.scale.y;
          let geo: THREE.BufferGeometry;

          if (bShape === "hexagon") {
            geo = new THREE.CylinderGeometry(radius, radius, height, 6);
            geo.rotateY(Math.PI / 6);
          } else if (bShape === "box") {
            geo = new THREE.BoxGeometry(obj.scale.x, obj.scale.y, obj.scale.z);
          } else {
            geo = new THREE.CylinderGeometry(obj.scale.x / 2, obj.scale.x / 2, height, 16);
          }

          const customBumperColor = (obj.properties?.color as string) || (obj.properties?.customColor as string);
          const meshMat = customBumperColor
            ? new THREE.MeshPhongMaterial({
                color: new THREE.Color(customBumperColor),
                specular: 0xffffff,
                shininess: 90
              })
            : bumperMaterial;
          const mesh = new THREE.Mesh(geo, meshMat);
          if(obj.type==='cylinder'&&data.world===7&&(data.level===3||data.level===4)){mesh.userData.neonSurface=obj.id;mesh.userData.neonPath=true;}
          mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
          mesh.rotation.copy(tempEuler);
          root.add(mesh);
          collidableMeshes.push(mesh);

          if(data.world===2&&data.level===4&&data.stage===2&&obj.type==='bumper') {
            const shape=meshColliderData([mesh],mesh);
            const body=physics.createKinematicTrimesh(obj.position,shape.vertices,shape.indices,0,.5,tempQuat);
            if(body)movingPlatforms.push({id:obj.id,mesh,body:body.body,basePosition:new THREE.Vector3().copy(obj.position),axis:'none',distance:0,speed:1,movementType:'palm_bouncer'});
            break;
          }
          const restitution = typeof obj.properties?.bounce === "number" ? obj.properties.bounce : 0.95;

          if (bShape === "box") {
            physics.createBoxCollider(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: obj.scale.x / 2, y: height / 2, z: obj.scale.z / 2 },
              restitution
            );
          } else {
            physics.createCylinderCollider(
              obj.position,
              radius,
              height / 2,
              restitution,
              0.5,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }
            );
          }
          break;
        }

        case "water":
        case "honey": {
          // Handled in buildWaterClusters pass for seamless cluster fusion
          break;
        }

        case "lava": {
          const geo = new THREE.BoxGeometry(obj.scale.x, obj.scale.y, obj.scale.z);
          const lavaTex = LevelBuilder.getSharedLavaTexture();
          let lavaMat: THREE.Material;
          if (activeQuality === "low") {
            lavaMat = new THREE.MeshLambertMaterial({
              map: lavaTex,
              color: new THREE.Color(0xff3300),
              emissive: new THREE.Color(0xff2200)
            });
          } else if (activeQuality === "medium") {
            lavaMat = new THREE.MeshPhongMaterial({
              map: lavaTex,
              color: new THREE.Color(0xff3300),
              emissive: new THREE.Color(0xff2200),
              shininess: 35
            });
          } else {
            lavaMat = new THREE.MeshStandardMaterial({
              map: lavaTex,
              color: new THREE.Color(0xff3300),
              emissive: new THREE.Color(0xff2200),
              emissiveIntensity: 0.85,
              roughness: 0.35,
              metalness: 0.2
            });
          }
          const mesh = new THREE.Mesh(geo, lavaMat);
          mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
          mesh.rotation.copy(tempEuler);
          root.add(mesh);
          collidableMeshes.push(mesh);

          lavaBlocks.push({
            id: obj.id,
            position: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
            scale: new THREE.Vector3(obj.scale.x, obj.scale.y, obj.scale.z),
            mesh,
            material: lavaMat
          });

          physics.createBoxCollider(
            obj.position,
            { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
            { x: obj.scale.x / 2, y: obj.scale.y / 2, z: obj.scale.z / 2 },
            0.6,
            0.15
          );
          break;
        }

        case "collectible": {
          const sprite = new CollectibleVisual(collectibleId,activeQuality);
          sprite.position.set(obj.position.x, obj.position.y, obj.position.z);
          sprite.renderOrder = 1;
          root.add(sprite);

          collectibles.push({
            id: obj.id,
            position: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
            mesh: sprite,
            collected: false,
            baseX: obj.position.x,
            baseY: obj.position.y,
            baseZ: obj.position.z,
            axis: obj.properties?.axis as any,
            distance: typeof obj.properties?.distance === "number" ? obj.properties.distance : undefined,
            speed: typeof obj.properties?.speed === "number" ? obj.properties.speed : undefined,
            movementType: obj.properties?.movementType as any,
            direction: typeof obj.properties?.direction === "number" ? obj.properties.direction : undefined,
            startDelay: typeof obj.properties?.startDelay === "number" ? obj.properties.startDelay : undefined
          });
          break;
        }

        case "goal": {
          const { group: goalGroup, portalMesh } = this.createGoalPortal(
            obj,
            physics,
            tempEuler,
            tempQuat,
            !obj.properties?.norwayGoal&&!museum?.chasing&&obj.properties?.oxfordGoal!=='sky'&&!(kyoto&&data.stage===7)&&!(tokyo&&(data.stage===2||data.stage===3))
          );
          root.add(goalGroup);
          goalGroup.userData.searchHidden=obj.properties?.searchHidden===true;

          goalGroup.traverse(child => {
            if (!museum?.chasing && obj.properties?.oxfordGoal!=='sky' && child instanceof THREE.Mesh && child !== portalMesh) {
              collidableMeshes.push(child);
            }
          });

          const goalY = Math.abs(obj.position.y - 1.6) < 0.1 ? 0.4 : obj.position.y;
          goal = {
            position: new THREE.Vector3(obj.position.x, goalY, obj.position.z),
            mesh: goalGroup,
            portalMesh,
            reached: false,
            rotationY: obj.rotation.y || 0,
            quaternion: tempQuat.clone()
          };
          if(obj.properties?.cangasAction === "fabadaGoal") cangas?.attachGoal(goal);
          if(canoe) canoe.attachGoal(obj,goal);
          covadonga?.attachGoal(obj,goal);
          london?.attachGoal(goal);
          museum?.attachGoal(obj,goal);
          oxford?.attachGoal(obj,goal);
          bigben?.attachGoal(goal);
          kyoto?.attachGoal(goal);
          tokyo?.attachGoal(goal);
          norway?.attachGoal(obj,goal);
          break;
        }

        case "decoration": {
          const decResult = LevelBuilder.createDecorationMesh(obj, activeQuality, {world:data.world,level:data.level});
          decResult.group.userData.levelObjectId=obj.id;
          decResult.group.traverse(child=>{
            if(!(child instanceof THREE.Mesh)) return;
            for(const material of Array.isArray(child.material)?child.material:[child.material]) {
              const family=surfaceFamily(material.name)||'neutral',objectFamily=surfaceFamily(`${obj.id} ${String(obj.properties?.subType??'')}`);
              if(!material.userData.graphicsSurface) material.userData.graphicsSurface=family!=='neutral' ? family:objectFamily;
            }
          });
          root.add(decResult.group);
          const asturiasModel = obj.properties?.subType;
          if(typeof asturiasModel==='string'&&(asturiasModel.startsWith('norway_')||asturiasModel.startsWith('fjord_')||asturiasModel.startsWith('oslo_')||asturiasModel.startsWith('aurora_'))) {norway?.attach(obj,decResult.group,decResult.meshes);if(obj.properties?.hasCollision===true)collidableMeshes.push(...decResult.meshes);break;}
          if(typeof asturiasModel==='string'&&asturiasModel.startsWith('tokyo_')) {
            const owns=tokyo?.attach(obj,decResult.group,decResult.meshes);
            if(owns){if(obj.properties?.hasCollision===true)collidableMeshes.push(...decResult.meshes);}
            else if(obj.properties?.hasCollision===true)for(const mesh of decResult.meshes)attachTerrain(mesh,true);
            break;
          }
          if(typeof asturiasModel==='string'&&asturiasModel.startsWith('osaka_')) {
            const owns=osaka?.attach(obj,decResult.group,decResult.meshes);
            if(owns){if(obj.properties?.hasCollision===true)collidableMeshes.push(...decResult.meshes);}
            else if(obj.properties?.hasCollision===true)for(const mesh of decResult.meshes)attachTerrain(mesh,true);
            break;
          }
          if(typeof asturiasModel==='string'&&asturiasModel.startsWith('nara_')) {
            const owns=nara?.attach(obj,decResult.group,decResult.meshes);
            if(owns){if(obj.properties?.hasCollision===true)collidableMeshes.push(...decResult.meshes);}
            else if(obj.properties?.hasCollision===true)for(const mesh of decResult.meshes)attachTerrain(mesh,true);
            break;
          }
          if(typeof asturiasModel==='string'&&asturiasModel.startsWith('kyoto_')) {
            const owns=kyoto?.attach(obj,decResult.group,decResult.meshes);
            if(owns){if(obj.properties?.hasCollision===true)collidableMeshes.push(...decResult.meshes);}
            else if(obj.properties?.hasCollision===true)for(const mesh of decResult.meshes)attachTerrain(mesh,true);
            break;
          }
          if(bigben&&typeof asturiasModel==='string'&&asturiasModel.startsWith('bigben_')) {
            const owns=bigben.attach(obj,decResult.group,decResult.meshes);
            if(owns){if(obj.properties?.hasCollision===true)collidableMeshes.push(...decResult.meshes);}
            else if(obj.properties?.hasCollision===true)for(const mesh of decResult.meshes)attachTerrain(mesh,true);
            break;
          }
          if(oxford&&typeof asturiasModel==='string'&&(asturiasModel.startsWith('oxford_')||asturiasModel.startsWith('london_'))) {
            const owns=oxford.attach(obj,decResult.group,decResult.meshes);
            if(owns) {if(obj.properties?.hasCollision===true) collidableMeshes.push(...decResult.meshes);}
            else if(obj.properties?.hasCollision===true) for(const m of decResult.meshes) attachTerrain(m,true);
            break;
          }
          if(museum&&typeof asturiasModel==="string"&&(asturiasModel.startsWith("museum_")||asturiasModel.startsWith("london_"))) {
            const owns=museum.attach(obj,decResult.group,decResult.meshes);
            if(owns) collidableMeshes.push(...decResult.meshes);
            else if(obj.properties?.hasCollision===true) for(const m of decResult.meshes) attachTerrain(m,true);
            collidableMeshes.push(...(decResult.group.userData.museumCameraMeshes??[]));break;
          }
          if(london && typeof asturiasModel==="string" && asturiasModel.startsWith("london_")) {
            const ownsCollision=london.attach(obj,decResult.group,decResult.meshes);
            if(ownsCollision) collidableMeshes.push(...decResult.meshes);
            else if(obj.properties?.hasCollision===true) for(const mesh of decResult.meshes) attachTerrain(mesh,true);
            break;
          }
          if(covadonga && typeof asturiasModel==="string") {
            covadonga.attach(obj,decResult.group,decResult.meshes);
            if(asturiasModel.startsWith("asturias_cov_")) {
              if(obj.properties?.covadongaAction==="fountain") collidableMeshes.push(...decResult.meshes);
              else if(obj.properties?.hasCollision===true) for(const mesh of decResult.meshes) attachTerrain(mesh,true);
              break;
            }
            if(asturiasModel==="asturias_sella_rock" && obj.properties?.hasCollision!==false) {
              for(const mesh of decResult.meshes) attachTerrain(mesh,true);break;
            }
          }
          if ((data.world === 5 || canoe&&typeof asturiasModel==='string'&&asturiasModel.startsWith('asturias_sella_')) && typeof asturiasModel === "string" && asturiasModel.startsWith("asturias_")) {
            if(asturiasModel.startsWith("asturias_sella_")) {
              canoe?.attach(obj,decResult.group);
              if(obj.properties?.hasCollision!==false) for(const mesh of decResult.meshes) {
                if(asturiasModel==="asturias_sella_river" || asturiasModel==="asturias_sella_rock") canoe?.addHazard(attachTerrain(mesh,true));
              }
              if(asturiasModel==="asturias_sella_river" && obj.properties?.hasCollision!==false) attachSellaTrees(decResult.group,physics,collidableMeshes,collider=>canoe?.addHazard(collider));
              break;
            }
            if (obj.properties?.asturiasAction) oviedo?.attach(obj, decResult.group);
            if (obj.properties?.cangasAction) cangas?.attach(obj, decResult.group);
            if (asturiasModel === "asturias_shelf" && obj.properties?.hasCollision !== false) {
              const halfHeight = 1.49 * obj.scale.y;
              physics.createBoxCollider({ ...obj.position, y: obj.position.y + halfHeight }, tempQuat,
                { x: obj.scale.x / 2, y: halfHeight, z: .41 * obj.scale.z }, .7, 0);
              collidableMeshes.push(...decResult.meshes);
            } else if (asturiasModel === "asturias_peak" && obj.properties?.hasCollision !== false && decResult.meshes[0]) {
              attachTerrain(decResult.meshes[0], true);
            } else if (asturiasModel === "asturias_cangas_track" && obj.properties?.hasCollision !== false && decResult.meshes[0]) {
              attachTerrain(decResult.meshes[0]);
            } else if (asturiasModel === "asturias_cangas_fabada" && obj.properties?.hasCollision !== false) {
              collidableMeshes.push(...decResult.meshes);
            }
            break;
          }
          if (decResult.decoration) {
            decorations.push(decResult.decoration);
          }

          const subType = (obj.properties?.subType as string) || "tree";
          const isDefaultSolid =
            subType === "tree" ||
            subType === "cruces_cypress" ||
            subType === "cypress" ||
            subType === "madrid_urban_pine" ||
            subType === "fence" ||
            subType === "lantern" ||
            subType === "town_hall" ||
            subType === "bench" ||
            subType === "palm_tree" ||
            subType === "lifeguard_chair" ||
            subType === "beach_umbrella" ||
            subType === "float_ring" ||
            subType === "sunbed" ||
            subType === "plush_bear" ||
            subType === "jewelry_bust" ||
            subType === "store_shelf" ||
            subType === "surf_rack" ||
            subType === "arcade_cabinet" ||
            subType === "gelato_display" ||
            subType === "bakery_counter" ||
            subType === "fashion_mannequin" ||
            subType === "sneaker_rack" ||
            subType === "checkout_counter" ||
            subType === "hurdes_stone_wall" ||
            subType === "village_fountain" ||
            subType === "stone_bridge_arch" ||
            subType === "pine_hurdes" ||
            subType === "village_church_tower" ||
            subType === "terrace_table_set" ||
            subType === "village_lantern_post" ||
            subType === "wooden_bench_rustic" ||
            subType === "spar_supermarket_sign" ||
            subType === "hurdes_mountain_house" ||
            subType === "pergola_green_post" ||
            subType === "waterfall_rock_cliff" ||
            subType === "madrid_metro_sign" ||
            subType === "madrid_street_sign_carabanchel" ||
            subType === "madrid_street_lamp_urban" ||
            subType === "madrid_recycle_bins" ||
            subType === "madrid_granite_bollard" ||
            subType === "madrid_terrace_bar_umbrella" ||
            subType === "madrid_residential_building" ||
            subType === "madrid_parked_car" ||
            subType === "madrid_bus_stop" ||
            subType === "madrid_traffic_light" ||
            subType === "bazar_shelf_display" ||
            subType === "madrid_kiosk_press" ||
            subType === "giant_goku_saiyan";
          const hasCollision = obj.properties?.hasCollision !== undefined
            ? Boolean(obj.properties.hasCollision)
            : isDefaultSolid;

          if (hasCollision) {
            const sx = obj.scale.x || 1;
            const sy = obj.scale.y || 1;
            const sz = obj.scale.z || 1;

            if (subType === "stone_bridge_arch") {
              const archSpan = 5.6;
              const pierW = 1.4;
              const archH = 3.6;
              const deckThick = 0.5;
              const totalW = archSpan + pierW * 2;
              const archThick = 5.0;

              // 1. Left pier collider: covers the solid left stone pillar
              const leftPierOffset = new THREE.Vector3(-(archSpan / 2 + pierW / 2) * sx, (archH / 2) * sy, 0).applyQuaternion(tempQuat);
              physics.createBoxCollider(
                { x: obj.position.x + leftPierOffset.x, y: obj.position.y + leftPierOffset.y, z: obj.position.z + leftPierOffset.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: (pierW / 2) * sx, y: (archH / 2) * sy, z: (archThick / 2) * sz },
                0.6,
                0.2
              );

              // 2. Right pier collider: covers the solid right stone pillar
              const rightPierOffset = new THREE.Vector3((archSpan / 2 + pierW / 2) * sx, (archH / 2) * sy, 0).applyQuaternion(tempQuat);
              physics.createBoxCollider(
                { x: obj.position.x + rightPierOffset.x, y: obj.position.y + rightPierOffset.y, z: obj.position.z + rightPierOffset.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: (pierW / 2) * sx, y: (archH / 2) * sy, z: (archThick / 2) * sz },
                0.6,
                0.2
              );

              // 3. Top deck / lintel collider: covers the road deck above the archway
              const deckOffset = new THREE.Vector3(0, (archH + deckThick / 2) * sy, 0).applyQuaternion(tempQuat);
              physics.createBoxCollider(
                { x: obj.position.x + deckOffset.x, y: obj.position.y + deckOffset.y, z: obj.position.z + deckOffset.z },
                { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                { x: (totalW / 2) * sx, y: (deckThick / 2) * sy, z: (archThick / 2) * sz },
                0.6,
                0.2
              );

              // 4. Parapet guardrails on the deck edges
              for (const pz of [-(archThick / 2 - 0.15), (archThick / 2 - 0.15)]) {
                const parapetOffset = new THREE.Vector3(0, (archH + deckThick + 0.35) * sy, pz * sz).applyQuaternion(tempQuat);
                physics.createBoxCollider(
                  { x: obj.position.x + parapetOffset.x, y: obj.position.y + parapetOffset.y, z: obj.position.z + parapetOffset.z },
                  { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
                  { x: (totalW / 2) * sx, y: 0.35 * sy, z: 0.15 * sz },
                  0.6,
                  0.2
                );
              }

              collidableMeshes.push(...decResult.meshes);
              break;
            }

            let halfExtents: { x: number; y: number; z: number };
            let centerOffsetY: number;

            if (subType === "tree") {
              // Solid trunk & base obstacle: trunk radius ~0.35, height 1.8
              halfExtents = { x: 0.35 * sx, y: 0.9 * sy, z: 0.35 * sz };
              centerOffsetY = 0.9 * sy;
            } else if (subType === "palm_tree") {
              // Palm tree trunk collision: radius ~0.35, height 3.8
              halfExtents = { x: 0.35 * sx, y: 1.9 * sy, z: 0.35 * sz };
              centerOffsetY = 1.9 * sy;
            } else if (subType === "lifeguard_chair") {
              // Lifeguard tower base: width 1.4, height 3.2, depth 1.4
              halfExtents = { x: 0.7 * sx, y: 1.6 * sy, z: 0.7 * sz };
              centerOffsetY = 1.6 * sy;
            } else if (subType === "beach_umbrella") {
              // Beach umbrella pole: height 2.4, radius 0.2
              halfExtents = { x: 0.25 * sx, y: 1.2 * sy, z: 0.25 * sz };
              centerOffsetY = 1.2 * sy;
            } else if (subType === "float_ring") {
              // Float ring: radius ~0.65, height ~0.35
              halfExtents = { x: 0.65 * sx, y: 0.2 * sy, z: 0.65 * sz };
              centerOffsetY = 0.2 * sy;
            } else if (subType === "sunbed") {
              // Sunbed lounger: width 0.9, height 0.6, depth 2.2
              halfExtents = { x: 0.45 * sx, y: 0.3 * sy, z: 1.1 * sz };
              centerOffsetY = 0.3 * sy;
            } else if (subType === "fence") {
              // Fence barrier: width 3.0, height 0.85, thickness 0.25
              halfExtents = { x: 1.5 * sx, y: 0.425 * sy, z: 0.15 * sz };
              centerOffsetY = 0.425 * sy;
            } else if (subType === "lantern") {
              // Street lamp / lantern post: height 2.0, base radius 0.25
              halfExtents = { x: 0.25 * sx, y: 1.0 * sy, z: 0.25 * sz };
              centerOffsetY = 1.0 * sy;
            } else if (subType === "town_hall") {
              // Town Hall facade backdrop: width 22.0, height 8.0, depth 5.0
              halfExtents = { x: 11.0 * sx, y: 4.0 * sy, z: 2.5 * sz };
              centerOffsetY = 4.0 * sy;
            } else if (subType === "bench") {
              // Plaza wooden bench: width 2.2, height 0.85, depth 0.8
              halfExtents = { x: 1.1 * sx, y: 0.425 * sy, z: 0.4 * sz };
              centerOffsetY = 0.425 * sy;
            } else if (subType === "plush_bear") {
              // Teddy bear plush toy: width 0.7, height 0.9, depth 0.7
              halfExtents = { x: 0.35 * sx, y: 0.45 * sy, z: 0.35 * sz };
              centerOffsetY = 0.45 * sy;
            } else if (subType === "jewelry_bust") {
              // Velvet necklace display bust: width 0.7, height 1.0, depth 0.7
              halfExtents = { x: 0.35 * sx, y: 0.5 * sy, z: 0.35 * sz };
              centerOffsetY = 0.5 * sy;
            } else if (subType === "store_shelf") {
              // Commercial 3-tier merchandise display rack: width 1.3, height 1.5, depth 0.8
              halfExtents = { x: 0.65 * sx, y: 0.75 * sy, z: 0.4 * sz };
              centerOffsetY = 0.75 * sy;
            } else if (subType === "surf_rack") {
              // Surfboard storage rack with 2 boards: width 1.1, height 2.2, depth 0.7
              halfExtents = { x: 0.55 * sx, y: 1.1 * sy, z: 0.35 * sz };
              centerOffsetY = 1.1 * sy;
            } else if (subType === "arcade_cabinet") {
              // Retro arcade gaming cabinet: width 0.9, height 1.8, depth 0.9
              halfExtents = { x: 0.45 * sx, y: 0.9 * sy, z: 0.45 * sz };
              centerOffsetY = 0.9 * sy;
            } else if (subType === "gelato_display") {
              // Gelato ice cream freezer counter: width 1.6, height 1.1, depth 1.0
              halfExtents = { x: 0.8 * sx, y: 0.55 * sy, z: 0.5 * sz };
              centerOffsetY = 0.55 * sy;
            } else if (subType === "bakery_counter") {
              // Espresso coffee machine & pastry counter: width 1.4, height 1.2, depth 0.9
              halfExtents = { x: 0.7 * sx, y: 0.6 * sy, z: 0.45 * sz };
              centerOffsetY = 0.6 * sy;
            } else if (subType === "fashion_mannequin") {
              // Haute couture dress mannequin: width 0.7, height 1.8, depth 0.7
              halfExtents = { x: 0.35 * sx, y: 0.9 * sy, z: 0.35 * sz };
              centerOffsetY = 0.9 * sy;
            } else if (subType === "sneaker_rack") {
              // Angled sneaker display rack with boxes: width 1.2, height 1.4, depth 0.8
              halfExtents = { x: 0.6 * sx, y: 0.7 * sy, z: 0.4 * sz };
              centerOffsetY = 0.7 * sy;
            } else if (subType === "checkout_counter") {
              // Cash register and POS checkout desk: width 1.4, height 1.2, depth 1.0
              halfExtents = { x: 0.7 * sx, y: 0.6 * sy, z: 0.5 * sz };
              centerOffsetY = 0.6 * sy;
            } else if (subType === "hurdes_stone_wall") {
              halfExtents = { x: 1.2 * sx, y: 0.6 * sy, z: 0.25 * sz };
              centerOffsetY = 0.6 * sy;
            } else if (subType === "village_fountain") {
              halfExtents = { x: 0.7 * sx, y: 0.7 * sy, z: 0.5 * sz };
              centerOffsetY = 0.7 * sy;
            } else if (subType === "pine_hurdes") {
              halfExtents = { x: 0.35 * sx, y: 2.4 * sy, z: 0.35 * sz };
              centerOffsetY = 2.4 * sy;
            } else if (subType === "village_church_tower") {
              halfExtents = { x: 1.8 * sx, y: 4.5 * sy, z: 1.8 * sz };
              centerOffsetY = 4.5 * sy;
            } else if (subType === "terrace_table_set") {
              halfExtents = { x: 0.65 * sx, y: 0.45 * sy, z: 0.85 * sz };
              centerOffsetY = 0.45 * sy;
            } else if (subType === "village_lantern_post" || subType === "pergola_green_post") {
              halfExtents = { x: 0.15 * sx, y: 2.0 * sy, z: 0.15 * sz };
              centerOffsetY = 2.0 * sy;
            } else if (subType === "wooden_bench_rustic") {
              halfExtents = { x: 0.9 * sx, y: 0.45 * sy, z: 0.35 * sz };
              centerOffsetY = 0.45 * sy;
            } else if (subType === "spar_supermarket_sign") {
              halfExtents = { x: 0.95 * sx, y: 2.0 * sy, z: 0.2 * sz };
              centerOffsetY = 2.0 * sy;
            } else if (subType === "hurdes_mountain_house") {
              halfExtents = { x: 2.3 * sx, y: 2.0 * sy, z: 2.0 * sz };
              centerOffsetY = 2.0 * sy;
            } else if (subType === "waterfall_rock_cliff") {
              halfExtents = { x: 1.8 * sx, y: 2.0 * sy, z: 1.2 * sz };
              centerOffsetY = 2.0 * sy;
            } else if (subType === "madrid_metro_sign") {
              halfExtents = { x: 0.45 * sx, y: 1.6 * sy, z: 0.3 * sz };
              centerOffsetY = 1.6 * sy;
            } else if (subType === "madrid_street_sign_carabanchel") {
              halfExtents = { x: 0.4 * sx, y: 1.2 * sy, z: 0.2 * sz };
              centerOffsetY = 1.2 * sy;
            } else if (subType === "madrid_street_lamp_urban") {
              halfExtents = { x: 0.25 * sx, y: 1.9 * sy, z: 0.25 * sz };
              centerOffsetY = 1.9 * sy;
            } else if (subType === "madrid_recycle_bins") {
              halfExtents = { x: 1.4 * sx, y: 0.85 * sy, z: 0.55 * sz };
              centerOffsetY = 0.85 * sy;
            } else if (subType === "madrid_granite_bollard") {
              halfExtents = { x: 0.25 * sx, y: 0.45 * sy, z: 0.25 * sz };
              centerOffsetY = 0.45 * sy;
            } else if (subType === "madrid_terrace_bar_umbrella") {
              halfExtents = { x: 1.1 * sx, y: 1.3 * sy, z: 1.1 * sz };
              centerOffsetY = 1.3 * sy;
            } else if (subType === "madrid_residential_building") {
              halfExtents = { x: 3.5 * sx, y: 6.0 * sy, z: 2.2 * sz };
              centerOffsetY = 6.0 * sy;
            } else if (subType === "madrid_parked_car") {
              const isVan = obj.properties?.carType === "van";
              halfExtents = { x: 1.1 * sx, y: (isVan ? 1.1 : 0.8) * sy, z: 2.3 * sz };
              centerOffsetY = (isVan ? 1.1 : 0.8) * sy;
            } else if (subType === "madrid_bus_stop") {
              halfExtents = { x: 1.8 * sx, y: 1.4 * sy, z: 0.9 * sz };
              centerOffsetY = 1.4 * sy;
            } else if (subType === "madrid_traffic_light") {
              halfExtents = { x: 0.3 * sx, y: 1.6 * sy, z: 0.3 * sz };
              centerOffsetY = 1.6 * sy;
            } else if (subType === "bazar_shelf_display") {
              halfExtents = { x: 1.2 * sx, y: 1.1 * sy, z: 0.5 * sz };
              centerOffsetY = 1.1 * sy;
            } else if (subType === "madrid_kiosk_press") {
              halfExtents = { x: 1.3 * sx, y: 1.4 * sy, z: 1.3 * sz };
              centerOffsetY = 1.4 * sy;
            } else if (subType === "giant_goku_saiyan") {
              halfExtents = { x: 1.6 * sx, y: 2.4 * sy, z: 1.4 * sz };
              centerOffsetY = 2.4 * sy;
            } else {
              halfExtents = { x: 0.5 * sx, y: 0.5 * sy, z: 0.5 * sz };
              centerOffsetY = 0.5 * sy;
            }

            // Offset the center along the local upright axis
            const localOffset = new THREE.Vector3(0, centerOffsetY, 0).applyQuaternion(tempQuat);
            const colliderPos = {
              x: obj.position.x + localOffset.x,
              y: obj.position.y + localOffset.y,
              z: obj.position.z + localOffset.z
            };

            physics.createBoxCollider(
              colliderPos,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              halfExtents,
              0.5,
              0.3
            );
            collidableMeshes.push(...decResult.meshes);
          }
          break;
        }
      }
    });

    // Build and seamlessly fuse all connected water / honey blocks into unified clusters
    const waterObjects = data.objects.filter(obj => (obj.type === "water" || obj.type === "honey") && obj.properties?.subType!=="asturias_sella_river");
    if (waterObjects.length > 0) {
      this.buildWaterClusters(waterObjects, physics, root, waterBlocks, tempEuler, tempQuat, activeQuality);
    }

    // Fireworks celebration for Stage 10 (Fuegos Artificiales & Banderitas)
    const isFireworksStage =
      (data.world === 1 && data.level === 2 && data.stage === 10) ||
      (data.world === 1 && data.level === 4 && data.stage === 10) ||
      Boolean(data.name && (data.name.includes("Fuegos") || data.name.includes("Banderitas")));

    interface ActiveFirework {
      group: THREE.Group;
      sparks: THREE.Points;
      posArray: Float32Array;
      velArray: Float32Array;
      colorArray: Float32Array;
      originY: number;
      period: number;
      phase: number;
      baseColor: THREE.Color;
      flareMesh: THREE.Mesh;
      index: number;
    }

    const fireworks: ActiveFirework[] = [];

    if (isFireworksStage) {
      const burstConfigs = [
        // Fuegos bajos en la plaza (visibles en primer plano sobre la bola del jugador)
        { x: -5.0, y: 9.0, z: 9.0, period: 2.7, phase: 0.1, color: 0xffd700 },
        { x: 5.0, y: 10.0, z: 9.0, period: 3.0, phase: 1.4, color: 0x00e5ff },
        { x: -3.5, y: 8.5, z: 2.0, period: 2.5, phase: 2.0, color: 0xff1744 },
        { x: 3.5, y: 9.5, z: 2.0, period: 2.8, phase: 0.7, color: 0x76ff03 },
        { x: 0.0, y: 10.5, z: -4.0, period: 2.9, phase: 1.8, color: 0xe040fb },

        // Fuegos a media altura sobre la fachada y tejados de la parroquia
        { x: -5.5, y: 14.0, z: -12.0, period: 3.2, phase: 0.3, color: 0xff6d00 },
        { x: 5.5, y: 14.5, z: -12.0, period: 3.4, phase: 2.2, color: 0xffd700 },
        { x: -7.5, y: 13.0, z: -6.0, period: 3.1, phase: 1.0, color: 0x00e5ff },
        { x: 7.5, y: 13.5, z: -6.0, period: 3.3, phase: 2.6, color: 0xff1744 },
        { x: -1.0, y: 16.0, z: -15.0, period: 3.5, phase: 0.5, color: 0xffffff },

        // Fuegos altos en el cielo sobre el campanario histórico y la cruz
        { x: 6.2, y: 22.5, z: -17.5, period: 3.7, phase: 1.6, color: 0xffd700 },
        { x: 6.2, y: 19.5, z: -15.5, period: 3.1, phase: 2.9, color: 0xff1744 },
        { x: -5.5, y: 20.5, z: -18.0, period: 3.9, phase: 2.1, color: 0x7c4dff },
        { x: 0.0, y: 24.0, z: -19.0, period: 3.6, phase: 0.8, color: 0x00e5ff }
      ];

      const sparkCount = 48;
      burstConfigs.forEach((cfg, idx) => {
        const fwGroup = new THREE.Group();
        fwGroup.position.set(cfg.x, 0, cfg.z);

        const posArray = new Float32Array(sparkCount * 3);
        const velArray = new Float32Array(sparkCount * 3);
        const colorArray = new Float32Array(sparkCount * 3);
        const baseColor = new THREE.Color(cfg.color);

        for (let i = 0; i < sparkCount; i++) {
          const phi = Math.acos(-1 + (2 * i) / sparkCount);
          const theta = Math.sqrt(sparkCount * Math.PI) * phi;
          const speed = 3.6 + (i % 6) * 0.45;

          velArray[i * 3 + 0] = Math.cos(theta) * Math.sin(phi) * speed;
          velArray[i * 3 + 1] = Math.cos(phi) * speed;
          velArray[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * speed;

          colorArray[i * 3 + 0] = baseColor.r;
          colorArray[i * 3 + 1] = baseColor.g;
          colorArray[i * 3 + 2] = baseColor.b;
        }

        const sparkGeo = new THREE.BufferGeometry();
        sparkGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
        sparkGeo.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

        const sparkMat = new THREE.PointsMaterial({
          size: 0.55,
          vertexColors: true,
          transparent: true,
          opacity: 0.0,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });
        const sparks = new THREE.Points(sparkGeo, sparkMat);
        fwGroup.add(sparks);

        const flareGeo = new THREE.SphereGeometry(0.25, 5, 4);
        const flareMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const flareMesh = new THREE.Mesh(flareGeo, flareMat);
        flareMesh.visible = false;
        fwGroup.add(flareMesh);

        root.add(fwGroup);

        fireworks.push({
          group: fwGroup,
          sparks,
          posArray,
          velArray,
          colorArray,
          originY: cfg.y,
          period: cfg.period,
          phase: cfg.phase,
          baseColor,
          flareMesh,
          index: idx
        });
      });
    }

    // Vincular coleccionables que se encuentren a lo largo de una rampa basculante (tilt_x)
    for (const p of movingPlatforms) {
      if (p.movementType === "tilt_x") {
        p.linkedCollectibles = [];
        const rampQuatInv = p.mesh.quaternion.clone().invert();
        const Hz = (p.distance ?? 42.0) / 2;
        for (const item of collectibles) {
          const dx = item.baseX - p.basePosition.x;
          const dz = item.baseZ - p.basePosition.z;
          if (Math.abs(dx) <= 3.5 && Math.abs(dz) <= Hz) {
            const localOffset = new THREE.Vector3(
              item.baseX - p.basePosition.x,
              item.baseY - p.basePosition.y,
              item.baseZ - p.basePosition.z
            ).applyQuaternion(rampQuatInv);
            p.linkedCollectibles.push({ item, localOffset });
          }
        }
      }
    }

    // Vincular coleccionables que se encuentren dentro del autobús EMT 35 (emt_bus_35)
    for (const p of movingPlatforms) {
      if (p.movementType === "emt_bus_35" || p.movementType === "emt_bus_34") {
        p.linkedCollectibles = [];
        const busQuatInv = p.mesh.quaternion.clone().invert();
        for (const item of collectibles) {
          const dx = item.baseX - p.basePosition.x;
          const dz = item.baseZ - p.basePosition.z;
          if (Math.abs(dx) <= 2.0 && Math.abs(dz) <= 4.3) {
            const localOffset = new THREE.Vector3(
              item.baseX - p.basePosition.x,
              item.baseY - p.basePosition.y,
              item.baseZ - p.basePosition.z
            ).applyQuaternion(busQuatInv);
            p.linkedCollectibles.push({ item, localOffset });
          }
        }
      }
    }

    // Vincular coleccionables que se encuentren sobre plataformas móviles circulares/orbitales
    for (const p of movingPlatforms) {
      if (p.movementType === "circular" || p.movementType === "orbit") {
        p.linkedCollectibles = [];
        for (const item of collectibles) {
          const dx = item.baseX - p.basePosition.x;
          const dz = item.baseZ - p.basePosition.z;
          const rPlate = p.mesh instanceof THREE.Mesh && p.mesh.geometry instanceof THREE.CylinderGeometry
            ? (p.mesh.geometry.parameters.radiusTop || 2.5)
            : 2.8;
          if (Math.hypot(dx, dz) <= rPlate && Math.abs(item.baseY - (p.basePosition.y + 0.6)) <= 1.8) {
            p.linkedCollectibles.push({
              item,
              localOffset: new THREE.Vector3(dx, item.baseY - p.basePosition.y, dz)
            });
          }
        }
      }
    }

    let animTime = 0;
    const palmImpulse=palmLaunchSpeed(palmApex-palmLaunchY,Math.abs(physics.getWorld()?.gravity.y??-18));
    let gameplayMoveTime = 0;
    const rollCarryAxis = new THREE.Vector3();
    const tramPose={x:0,z:0,yaw:0};
    const fanPose={angle:0,speed:0,slow:false},fanLocal=new THREE.Vector3(),fanGust=new THREE.Vector3();
    const fanInverse=new THREE.Quaternion();

    const update = (delta: number, isIntroActive = false, playerPos?: THREE.Vector3, player?: any) => {
      animTime += delta;
      let playerRespawned: true | void = undefined;
      if (!isIntroActive) {
        gameplayMoveTime += delta;
        playerRespawned = oviedo?.update(gameplayMoveTime, delta, playerPos, player);
        cangas?.update(gameplayMoveTime, delta, playerPos, player);
      }
      canoe?.animate(isIntroActive ? animTime:gameplayMoveTime);
      covadonga?.animate(isIntroActive ? animTime:gameplayMoveTime,!isIntroActive);
      if(isIntroActive) london?.animatePreview(0);
      if(isIntroActive) museum?.animatePreview(0);
      if(isIntroActive) oxford?.animatePreview(0);
      if(isIntroActive) bigben?.animatePreview(0);

      // Animate collectibles hover and motion
      for (const item of collectibles) {
        if (!item.collected) {
          if(item.mesh instanceof CollectibleVisual)item.mesh.animate(animTime,item.baseX*.2);
          let offsetY = Math.sin(animTime * 4 + item.baseX) * 0.18;
          let offsetX = 0;
          let offsetZ = 0;

          if (item.axis && typeof item.distance === "number" && typeof item.speed === "number") {
            const effectiveItemTime = Math.max(0, gameplayMoveTime - (item.startDelay ?? 0));
            let moveOffset = 0;
            if (effectiveItemTime > 0) {
              if (item.movementType === "forward" || item.movementType === "linear") {
                const dir = item.direction ?? 1;
                moveOffset = dir * Math.min(item.distance, effectiveItemTime * item.speed);
              } else if (item.movementType === "loop") {
                const dir = item.direction ?? 1;
                moveOffset = dir * ((effectiveItemTime * item.speed) % item.distance);
              } else {
                moveOffset = Math.sin(effectiveItemTime * item.speed) * item.distance;
              }
            }

            if (item.axis === "x") offsetX = moveOffset;
            else if (item.axis === "y") offsetY += moveOffset;
            else if (item.axis === "z") offsetZ = moveOffset;
          }

          item.mesh.position.set(
            item.baseX + offsetX,
            item.baseY + offsetY,
            item.baseZ + offsetZ
          );
          item.position.copy(item.mesh.position);
        }
      }

      london?.updateCollectibles(collectibles,animTime);
      museum?.updateCollectibles(collectibles,animTime);
      // Animate physical moving platforms in Three.js and Rapier
      for (const p of movingPlatforms) {
        const effectiveTime = Math.max(0, gameplayMoveTime - (p.startDelay ?? 0));

        if(p.tramPassenger&&!isIntroActive&&player&&playerPos) {
          const velocity=player.getVelocity();
          if(p.tramPassenger.constrain(playerPos,velocity,p.body.translation(),p.body.rotation(),player.radius??.75)) {
            player.getBody()?.setTranslation(playerPos,true);player.setLinearVelocity(velocity);
          }
        }
        if(p.movementType==='palm_bouncer') {
          if(player&&playerPos&&effectiveTime-(p.lastBounceTime??-1)>.25&&player.getVelocity().y<=.5&&playerPos.y>=p.basePosition.y&&player.getBody()&&physics.hasBodyContact(player.getBody(),p.body)) {
            const velocity=player.getVelocity();
            player.setLinearVelocity({x:velocity.x,y:palmImpulse,z:velocity.z});p.lastBounceTime=effectiveTime;
          }
          continue;
        }
        if (p.movementType === "vivagym_obstacle") {
          const top = p.centerY ?? p.basePosition.y;
          const { y, z } = sampleVivaGymObstacle(effectiveTime, p.speed, p.distance, p.phase ?? 0, top, p.centerZ ?? p.basePosition.z);
          p.mesh.position.set(p.basePosition.x, y, z);
          p.mesh.visible = y > top - 2.1;
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicTranslation(p.mesh.position);
          continue;
        }

        if (p.movementType === "olla") {
          const rotSpeed = p.rotSpeed ?? 1.25;
          const tiltSpeed = p.tiltSpeed ?? 2.1;
          const maxTilt = p.maxTilt ?? 0.17;
          const yaw = effectiveTime * rotSpeed;
          const tilt = Math.sin(effectiveTime * tiltSpeed) * maxTilt;
          tempEuler.set(tilt, yaw, 0, "YXZ");
          tempQuat.setFromEuler(tempEuler);
          const targetY = p.basePosition.y + Math.sin(effectiveTime * 3.8) * 0.15;
          p.mesh.position.set(p.basePosition.x, targetY, p.basePosition.z);
          p.mesh.quaternion.copy(tempQuat);
          p.body.setNextKinematicTranslation({ x: p.basePosition.x, y: targetY, z: p.basePosition.z });
          p.body.setNextKinematicRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w });
          continue;
        } else if (p.movementType === "padel_racket") {
          const cycleTime = 5.2;
          const tInCycle = effectiveTime % cycleTime;
          const cycleIndex = Math.floor(effectiveTime / cycleTime);
          let pitch = 0;
          let yOffset = 0;
          let zOffset = 0;

          const headD = p.headDepth ?? (p.distance || 4.2);
          const headW = p.headWidth ?? 3.8;
          const scaleFactor = headD > 6.0 ? 1.5 : 1.0;

          if (tInCycle < 2.4) {
            // 1. Ground Rest Phase: lies flat on the court turf so player rolls right onto it
            pitch = 0;
            yOffset = 0;
            zOffset = 0;
          } else if (tInCycle < 3.1) {
            // 2. Rapid Scoop Phase: "la pala lo rebaña y se pone casi vertical rápidamente y le empuja al otro lado"
            const u = (tInCycle - 2.4) / 0.70;
            const scoopCurve = Math.pow(u, 2.2);
            pitch = scoopCurve * 1.38; // ~79 degrees (nearly vertical!)
            yOffset = scoopCurve * 0.85 * scaleFactor;
            zOffset = -scoopCurve * 1.6 * scaleFactor;

            // Catapult Impulse when reaching vertical scoop apex
            if (u >= 0.65 && p.lastBoostTime !== cycleIndex && player && playerPos) {
              const baseQuat = p.baseQuaternion ?? new THREE.Quaternion().setFromEuler(p.baseRotation ?? new THREE.Euler());

              // Vector from racket basePosition to player
              const toPlayer = new THREE.Vector3().subVectors(playerPos, p.basePosition);
              // Transform into racket's local coordinate space
              const invBaseQuat = baseQuat.clone().invert();
              const localPlayer = toPlayer.applyQuaternion(invBaseQuat);

              // Check if player is on or above the scoop blade in local space
              // Blade spans: X in [-headW/2, headW/2], Z in [-headD, 0], Y above blade
              const isOverBlade =
                Math.abs(localPlayer.x) <= headW / 2 + 0.6 &&
                localPlayer.z >= -headD - 1.0 &&
                localPlayer.z <= 1.2 &&
                localPlayer.y >= -0.3 &&
                localPlayer.y <= 4.2;

              if (isOverBlade) {
                p.lastBoostTime = cycleIndex;

                // Center player along local X
                const centeringVx = -localPlayer.x * 0.45;

                // Forward vector in world coordinates
                const forwardDir = new THREE.Vector3(0, 0, -1).applyQuaternion(baseQuat);

                // Upward velocity: high arching trajectory over net (or skyward launch for vertical padel court)
                const isVertical = p.launchMode === "vertical";
                const upwardSpeed = isVertical ? 25.5 : (headD > 6.0 ? 14.5 : 13.0);
                // Flight time with g = 18 m/s^2
                const flightTime = 2 * (upwardSpeed / 18.0);

                let forwardSpeed = isVertical ? 2.5 : (headD > 6.0 ? 17.5 : 7.5);
                if (!isVertical && p.targetPosition) {
                  const vecToTarget = new THREE.Vector3().subVectors(p.targetPosition, p.basePosition);
                  const distAlongForward = vecToTarget.dot(forwardDir);
                  if (distAlongForward > 4.0) {
                    const targetDistance = Math.max(5.0, distAlongForward - 1.2);
                    forwardSpeed = Math.max(7.5, Math.min(28.0, targetDistance / flightTime));
                  }
                } else if (headD > 6.0) {
                  const extraZ = Math.max(0, p.basePosition.z - 9.6);
                  forwardSpeed = 17.5 + extraZ * 0.65;
                }

                // Local launch velocity vector
                const localLaunch = new THREE.Vector3(centeringVx, upwardSpeed, -forwardSpeed);
                // Rotate local launch into world coordinates using base orientation
                const worldLaunch = localLaunch.applyQuaternion(baseQuat);
                if (worldLaunch.y < upwardSpeed * 0.8) {
                  worldLaunch.y = upwardSpeed;
                }

                player.setLinearVelocity(worldLaunch);
              }
            }
          } else if (tInCycle < 3.5) {
            // 3. Peak Follow-Through Hold
            pitch = 1.38;
            yOffset = 0.85 * scaleFactor;
            zOffset = -1.6 * scaleFactor;
          } else if (tInCycle < 4.8) {
            // 4. Smooth Reset back down to ground
            const u = (tInCycle - 3.5) / 1.3;
            const returnCurve = 0.5 * (1 + Math.cos(u * Math.PI));
            pitch = returnCurve * 1.38;
            yOffset = returnCurve * 0.85 * scaleFactor;
            zOffset = -returnCurve * 1.6 * scaleFactor;
          } else {
            // 5. Ground rest settling
            pitch = 0;
            yOffset = 0;
            zOffset = 0;
          }

          // Preserve base orientation and apply pitch locally around racket's local X-axis
          const baseQuat = p.baseQuaternion ?? new THREE.Quaternion().setFromEuler(p.baseRotation ?? new THREE.Euler());
          const localPitchQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch);
          const currentQuat = baseQuat.clone().multiply(localPitchQuat);

          // Apply local displacement rotated by base orientation
          const localDisp = new THREE.Vector3(0, yOffset, zOffset).applyQuaternion(baseQuat);
          const curX = p.basePosition.x + localDisp.x;
          const curY = p.basePosition.y + localDisp.y;
          const curZ = p.basePosition.z + localDisp.z;

          p.mesh.position.set(curX, curY, curZ);
          p.mesh.quaternion.copy(currentQuat);
          p.body.setNextKinematicTranslation({ x: curX, y: curY, z: curZ });
          p.body.setNextKinematicRotation({ x: currentQuat.x, y: currentQuat.y, z: currentQuat.z, w: currentQuat.w });
          continue;
        } else if (p.movementType === "bread_roller") {
          const dir = p.direction ?? 1;
          const xOff = Math.sin(effectiveTime * p.speed) * p.distance * dir;
          const curX = p.basePosition.x + xOff;
          p.mesh.position.set(curX, p.basePosition.y, p.basePosition.z);
          p.body.setNextKinematicTranslation({ x: curX, y: p.basePosition.y, z: p.basePosition.z });
          continue;
        } else if (p.movementType === "pipe_shuttle") {
          // Shuttle cycle across 3 hole positions: X = -4.0, X = 0.0, X = 4.0
          // Stops for 1.0s at each hole, moves for 0.8s between holes
          const stops = [-4.0, 0.0, 4.0, 0.0];
          const pauseDur = 1.0;
          const moveDur = 0.8;
          const legDur = pauseDur + moveDur;
          const cycleDur = legDur * 4;
          const tCycle = effectiveTime % cycleDur;
          const legIdx = Math.floor(tCycle / legDur);
          const tInLeg = tCycle % legDur;

          const fromX = stops[legIdx];
          const toX = stops[(legIdx + 1) % 4];

          let curX = fromX;
          if (tInLeg < pauseDur) {
            curX = fromX;
          } else {
            const u = (tInLeg - pauseDur) / moveDur;
            const smoothU = 0.5 * (1 - Math.cos(u * Math.PI));
            curX = fromX + (toX - fromX) * smoothU;
          }

          p.mesh.position.set(curX, p.mesh.position.y, p.mesh.position.z);
          p.body.setNextKinematicTranslation({ x: curX, y: p.basePosition.y, z: p.basePosition.z });

          // When player enters inside the open hollow circumference tube or reaches mouth:
          if (player && playerPos) {
            const dx = playerPos.x - curX;
            const dz = playerPos.z - p.mesh.position.z;
            const dy = playerPos.y - p.mesh.position.y;
            // The hollow pipe extends along Z from -1.8 to +1.8
            if (Math.abs(dx) < 1.15 && Math.abs(dy) < 1.4 && dz >= -2.0 && dz <= 2.4) {
              player.setLinearVelocity({ x: 0, y: 1.5, z: -14.5 });
            }
          }
          continue;
        } else if (p.movementType === "clock_hand") {
          const rotSpeed = p.rotSpeed ?? 0.8;
          const yaw = -effectiveTime * rotSpeed;
          tempEuler.set(0, yaw, 0);
          tempQuat.setFromEuler(tempEuler);
          p.mesh.quaternion.copy(tempQuat);
          p.body.setNextKinematicRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w });
          continue;
        } else if (p.movementType === "limp_kicker") {
          const cycleTime = 3.6;
          const tInCycle = effectiveTime % cycleTime;
          const cycleIndex = Math.floor(effectiveTime / cycleTime);
          const travel = Math.sin(effectiveTime * 0.4) * 6.0;
          const curZ = p.basePosition.z + travel;

          let kickPitch = 0;
          if (tInCycle < 2.0) {
            // Limping walk bob with crutches
            kickPitch = Math.sin(tInCycle * 6.0) * 0.15;
            if (p.subMeshes?.crutchL && p.subMeshes?.crutchR) {
              p.subMeshes.crutchL.rotation.x = Math.sin(tInCycle * 6.0) * 0.12;
              p.subMeshes.crutchR.rotation.x = -Math.sin(tInCycle * 6.0) * 0.12;
            }
          } else if (tInCycle < 2.5) {
            // Windup: tension build-up, plaster cast pulled far back
            const u = (tInCycle - 2.0) / 0.5;
            kickPitch = -0.75 * u;
            if (p.subMeshes?.crutchL && p.subMeshes?.crutchR) {
              p.subMeshes.crutchL.rotation.x = -0.28;
              p.subMeshes.crutchR.rotation.x = -0.28;
            }
          } else if (tInCycle < 3.0) {
            // EXPLOSIVE FORWARD ARCADE WHIP KICK ("EL PATADÓN")
            const u = (tInCycle - 2.5) / 0.5;
            kickPitch = -0.75 + 2.3 * Math.sin((u * Math.PI) / 2);

            if (p.subMeshes?.crutchL && p.subMeshes?.crutchR) {
              p.subMeshes.crutchL.rotation.x = 0.22;
              p.subMeshes.crutchR.rotation.x = 0.22;
            }

            if (u > 0.25 && p.lastBoostTime !== cycleIndex && player && playerPos) {
              const dx = playerPos.x - p.basePosition.x;
              const dz = playerPos.z - curZ;
              const dy = playerPos.y - p.basePosition.y;
              // Check hit box in front of the plaster cast leg
              if (Math.abs(dx) < 2.2 && dz > 0.0 && dz < 4.2 && dy < 3.0) {
                p.lastBoostTime = cycleIndex;
                const kickDirX = dx >= 0 ? 9.0 : -9.0;
                // UN AUTÉNTICO PATADÓN ARCADE: Enorme impulso retroceso hacia arriba y hacia atrás!
                player.setLinearVelocity({ x: kickDirX, y: 14.5, z: 25.0 });
              }
            }
          } else {
            // Recovery
            const u = (tInCycle - 3.0) / 0.6;
            kickPitch = 1.55 * (1 - u);
            if (p.subMeshes?.crutchL && p.subMeshes?.crutchR) {
              p.subMeshes.crutchL.rotation.x = 0.1 * (1 - u);
              p.subMeshes.crutchR.rotation.x = 0.1 * (1 - u);
            }
          }

          if (p.subMeshes?.castLeg) {
            p.subMeshes.castLeg.rotation.x = kickPitch;
          }

          p.mesh.position.set(p.basePosition.x, p.basePosition.y, curZ);
          p.body.setNextKinematicTranslation({ x: p.basePosition.x, y: p.basePosition.y, z: curZ });
          continue;
        } else if (p.movementType === "concert_vibe") {
          const yVibe=concertLift(effectiveTime,p.speed);
          const curY = p.basePosition.y + yVibe;
          p.mesh.position.set(p.basePosition.x, curY, p.basePosition.z);
          p.body.setNextKinematicTranslation({ x: p.basePosition.x, y: curY, z: p.basePosition.z });
          continue;
        } else if (p.movementType === "lifeguard_sweeper") {
          const travel = Math.sin(effectiveTime * p.speed) * p.distance;
          const curX = p.basePosition.x + travel;
          const broomYaw = Math.sin(effectiveTime * p.speed * 2.0) * 0.4;
          if (p.subMeshes?.broomGroup) {
            p.subMeshes.broomGroup.rotation.y = broomYaw;
          }
          p.mesh.position.set(curX, p.basePosition.y, p.basePosition.z);
          p.body.setNextKinematicTranslation({ x: curX, y: p.basePosition.y, z: p.basePosition.z });

          // If player ball is swept by the broom or lifeguard
          if (player && playerPos) {
            const dx = playerPos.x - curX;
            const dz = playerPos.z - p.basePosition.z;
            const dy = playerPos.y - p.basePosition.y;
            if (Math.abs(dx) < 2.5 && dz > -0.5 && dz < 2.8 && dy < 3.2) {
              const sweepDir = Math.cos(effectiveTime * p.speed) >= 0 ? 1 : -1;
              player.setLinearVelocity({ x: sweepDir * 14.0, y: 6.5, z: 11.0 });
            }
          }
          continue;
        } else if (p.movementType === "sea_urchin") {
          // Cycle: 3.0s spikes out, 0.3s retract, 1.5s retracted pause, 0.2s snap out!
          const cycleTime = 5.0;
          const tInCycle = effectiveTime % cycleTime;
          let spikesScale = 1.0;
          let isSpikesActive = true;

          if (tInCycle < 3.0) {
            spikesScale = 1.0;
            isSpikesActive = true;
          } else if (tInCycle < 3.3) {
            const u = (tInCycle - 3.0) / 0.3;
            spikesScale = 1.0 - 0.9 * u;
            isSpikesActive = false;
          } else if (tInCycle < 4.8) {
            spikesScale = 0.1;
            isSpikesActive = false;
          } else {
            const u = (tInCycle - 4.8) / 0.2;
            spikesScale = 0.1 + 0.9 * u;
            isSpikesActive = true;
          }

          if (p.subMeshes?.spikesGroup) {
            p.subMeshes.spikesGroup.scale.set(spikesScale, spikesScale, spikesScale);
          }

          if (isSpikesActive && player && playerPos) {
            const dx = playerPos.x - p.basePosition.x;
            const dz = playerPos.z - p.basePosition.z;
            const dy = playerPos.y - p.basePosition.y;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < 2.7 && Math.abs(dy) < 2.2) {
              const nx = dist > 0.01 ? dx / dist : 1;
              const nz = dist > 0.01 ? dz / dist : 0;
              // Gran salto por los aires!
              player.setLinearVelocity({ x: nx * 14.5, y: 16.5, z: nz * 14.5 });
            }
          }
          continue;
        } else if (p.movementType === "apartment_elevator") {
          const floorHeights = [0.0, 3.5, 7.0, 10.5, 14.0, 17.5, 21.0, 24.5, 28.0];
          p.currentFloor = p.currentFloor ?? 0;
          p.targetFloor = p.targetFloor ?? 0;
          p.elevatorState = p.elevatorState ?? "idle";
          p.floorTimer = p.floorTimer ?? 0;

          const curPos = p.mesh.position;

          // Fall detection & auto-reset:
          // If the player falls off the building or respawns at the bottom, elevator returns down and resets sequence
          const playerHasFallen =
            (player && playerPos && playerPos.y < -3.5) ||
            (player && playerPos && playerPos.z > 5.0 && playerPos.y < 2.5 && curPos.y > p.basePosition.y + 2.0);

          if (playerHasFallen && p.elevatorState !== "resetting") {
            p.elevatorState = "resetting";
            p.floorTimer = 0;
            p.targetFloor = 0;
            p.currentFloor = 0;
          }

          if (p.elevatorState === "resetting") {
            const diff = p.basePosition.y - curPos.y;
            if (Math.abs(diff) < 0.1) {
              curPos.y = p.basePosition.y;
              p.currentFloor = 0;
              p.targetFloor = 0;
              p.elevatorState = "idle";
              p.floorTimer = 0;
            } else {
              curPos.y += Math.sign(diff) * Math.min(Math.abs(diff), delta * 14.0);
            }
            p.mesh.position.set(p.basePosition.x, curPos.y, p.basePosition.z);
            p.body.setNextKinematicTranslation({ x: p.basePosition.x, y: curPos.y, z: p.basePosition.z });
            continue;
          }

          let isInside = false;
          if (player && playerPos) {
            const dx = playerPos.x - curPos.x;
            const dz = playerPos.z - curPos.z;
            const dy = playerPos.y - curPos.y;
            isInside = Math.abs(dx) < 1.15 && Math.abs(dz) < 1.15 && dy >= -0.2 && dy < 2.4;
          }

          if (p.elevatorState === "idle") {
            if (isInside) {
              p.floorTimer = (p.floorTimer ?? 0) + delta;
              if (p.floorTimer >= 0.5 && p.targetFloor < 8) {
                p.targetFloor = p.currentFloor + 1;
                p.elevatorState = "moving";
                p.floorTimer = 0;
              }
            } else {
              p.floorTimer = 0;
            }
          } else if (p.elevatorState === "moving") {
            const targetY = p.basePosition.y + floorHeights[p.targetFloor];
            const diff = targetY - curPos.y;
            if (Math.abs(diff) < 0.05) {
              curPos.y = targetY;
              p.currentFloor = p.targetFloor;
              p.elevatorState = "waiting_for_exit";
              p.floorTimer = 0;
            } else {
              const moveDir = Math.sign(diff);
              curPos.y += moveDir * Math.min(Math.abs(diff), delta * 3.8);
            }
          } else if (p.elevatorState === "waiting_for_exit") {
            p.floorTimer = (p.floorTimer ?? 0) + delta;
            if (!isInside) {
              p.elevatorState = "waiting_for_reentry";
              p.floorTimer = 0;
            } else if (p.floorTimer > 3.5 && p.targetFloor < 8) {
              p.targetFloor = p.currentFloor + 1;
              p.elevatorState = "moving";
              p.floorTimer = 0;
            }
          } else if (p.elevatorState === "waiting_for_reentry") {
            if (isInside) {
              p.floorTimer = (p.floorTimer ?? 0) + delta;
              if (p.floorTimer >= 0.5 && p.targetFloor < 8) {
                p.targetFloor = p.currentFloor + 1;
                p.elevatorState = "moving";
                p.floorTimer = 0;
              }
            } else {
              p.floorTimer = 0;
            }
          }

          p.mesh.position.set(p.basePosition.x, curPos.y, p.basePosition.z);
          p.body.setNextKinematicTranslation({ x: p.basePosition.x, y: curPos.y, z: p.basePosition.z });
          continue;
        } else if (p.movementType === "mattress_bouncer") {
          // Dynamic trampoline mattress impulse: accumulates bounce count, each bounce goes higher!
          if (player && playerPos) {
            const dx = playerPos.x - p.basePosition.x;
            const dz = playerPos.z - p.basePosition.z;
            const dy = playerPos.y - p.basePosition.y;
            const halfW = 6.2;
            const halfD = 10.2;
            if (Math.abs(dx) < halfW && Math.abs(dz) < halfD && dy >= 0.15 && dy < 1.9) {
              const linVel = typeof player.getVelocity === "function"
                ? player.getVelocity()
                : typeof player.linvel === "function"
                ? player.linvel()
                : { x: 0, y: 0, z: 0 };
              if (linVel.y <= 0.8 && effectiveTime - (p.lastBounceTime ?? -10) > 0.25) {
                // Accumulate consecutive bounces if touched within 4.5s
                const timeSinceLast = effectiveTime - (p.lastBounceTime ?? -10.0);
                if (timeSinceLast < 4.5) {
                  p.bounceCount = Math.min(5, (p.bounceCount ?? 0) + 1);
                } else {
                  p.bounceCount = 1;
                }
                p.lastBounceTime = effectiveTime;

                const bounceForce = mattressLaunchSpeed(
                  p.bounceCount ?? 1, playerPos.y,
                  goal?.position.y ?? p.basePosition.y + 12.8,
                  physics.getWorld()?.gravity.y ?? -18,
                );
                player.setLinearVelocity({ x: linVel.x * 0.92, y: bounceForce, z: linVel.z * 0.92 });
              }
            }
          }
          continue;
        } else if (p.movementType === "fan_5blades") {
          const pose=fanMotion(effectiveTime,p.direction??1,fanPose),rotor=p.subMeshes!.rotor;
          p.rotSpeed=pose.angle;
          rotor.rotation.set(0,0,pose.angle);
          p.mesh.position.copy(p.basePosition);p.mesh.updateMatrixWorld(true);
          tempEuler.set(0,0,pose.angle);tempQuat.setFromEuler(tempEuler);
          if(p.baseQuaternion)tempQuat.premultiply(p.baseQuaternion);
          p.body.setNextKinematicTranslation(p.basePosition);p.body.setNextKinematicRotation(tempQuat);
          // Actual contact drives the gust. Empty gaps never act as invisible walls.
          if(!isIntroActive&&!pose.slow&&player&&playerPos&&player.getBody?.()&&effectiveTime-(p.lastBoostTime??-1)>.25&&physics.hasBodyContact(player.getBody(),p.body)) {
            fanInverse.copy(p.baseQuaternion??p.mesh.quaternion).invert();
            fanLocal.copy(playerPos).sub(p.basePosition).applyQuaternion(fanInverse);
            fanGust.set(fanLocal.x>=0?9:-9,7,fanLocal.z>=0?14:-14).applyQuaternion(p.baseQuaternion??p.mesh.quaternion);
            player.setLinearVelocity(fanGust);p.lastBoostTime=effectiveTime;
          }
          continue;
        }

        if (p.movementType === "tram_square") {
          const path=p.tramPath ??=tramTrack(p.trackWidth??24,p.trackLength??24,p.cornerRadius??4);
          const dir=p.direction??1;
          path.sample(effectiveTime*(p.speed??3.5)*dir,tramPose);
          const targetX=(p.centerX??0)+tramPose.x,targetZ=(p.centerZ??0)+tramPose.z;
          const yaw=tramPose.yaw+(dir<0?Math.PI:0);
          const targetY = p.basePosition.y;

          tempEuler.set(0, yaw, 0, "YXZ");
          tempQuat.setFromEuler(tempEuler);
          p.mesh.position.set(targetX, targetY, targetZ);
          p.mesh.quaternion.copy(tempQuat);
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicTranslation({ x: targetX, y: targetY, z: targetZ });
          p.body.setNextKinematicRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w });
          continue;
        } else if (p.movementType === "bike_wheel_vertical") {
          const dist = p.distance || 10.0;
          const spd = p.speed || 2.4;
          const r = p.radius || 3.5;
          const pose=p.continuousRoll ? {offset:0,pitch:effectiveTime*p.speed} : bikeWheelPose(effectiveTime,dist,spd,r),offsetZ=pose.offset;
          const targetX = p.basePosition.x;
          const targetY = p.basePosition.y;
          const targetZ = p.basePosition.z + offsetZ;

          // Continuous dynamic pitch rotation: rolls proportionally to distance travelled with visible spin!
          const pitch = pose.pitch;
          tempEuler.set(pitch, 0, 0, "XYZ");
          tempQuat.setFromEuler(tempEuler);
          if(p.continuousRoll && p.baseQuaternion)tempQuat.premultiply(p.baseQuaternion);

          p.mesh.position.set(targetX, targetY, targetZ);
          p.mesh.quaternion.copy(tempQuat);
          p.mesh.updateMatrixWorld(true);

          // Body translates and rotates in 1:1 synchronization with the visual wheel!
          p.body.setNextKinematicTranslation({ x: targetX, y: targetY, z: targetZ });
          p.body.setNextKinematicRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w });
          continue;
        } else if (p.movementType === "tram_circle") {
          const dir = p.direction ?? 1;
          const ang = (p.baseAngle ?? 0) + (effectiveTime > 0 ? dir * p.speed * effectiveTime : 0);
          const r = p.radius ?? 14.0;
          const cx = p.centerX ?? 0;
          const cz = p.centerZ ?? 0;
          const targetX = cx + Math.cos(ang) * r;
          const targetZ = cz + Math.sin(ang) * r;
          const targetY = p.basePosition.y;
          const yaw = -ang + (dir > 0 ? -Math.PI / 2 : Math.PI / 2);
          tempEuler.set(0, yaw, 0, "YXZ");
          tempQuat.setFromEuler(tempEuler);
          p.mesh.position.set(targetX, targetY, targetZ);
          p.mesh.quaternion.copy(tempQuat);
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicTranslation({ x: targetX, y: targetY, z: targetZ });
          p.body.setNextKinematicRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w });
          continue;
        } else if (p.movementType === "circular" || p.movementType === "orbit") {
          const dir = p.direction ?? 1;
          const cx = p.centerX ?? 0;
          const cz = p.centerZ ?? 0;
          const r = p.radius ?? Math.hypot(p.basePosition.x - cx, p.basePosition.z - cz);
          const baseAng = p.baseAngle ?? Math.atan2(p.basePosition.z - cz, p.basePosition.x - cx);
          const ang = baseAng + (effectiveTime > 0 ? dir * p.speed * effectiveTime : 0);
          const targetX = cx + Math.cos(ang) * r;
          const targetZ = cz + Math.sin(ang) * r;
          const targetY = p.basePosition.y;

          if (p.baseQuaternion) {
            tempQuat.copy(p.baseQuaternion);
          } else if (p.baseRotation) {
            tempEuler.copy(p.baseRotation);
            tempQuat.setFromEuler(tempEuler);
          } else {
            tempEuler.set(0, 0, 0, "YXZ");
            tempQuat.setFromEuler(tempEuler);
          }

          p.mesh.position.set(targetX, targetY, targetZ);
          p.mesh.quaternion.copy(tempQuat);
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicTranslation({ x: targetX, y: targetY, z: targetZ });
          p.body.setNextKinematicRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w });

          if (p.linkedCollectibles && p.linkedCollectibles.length > 0) {
            for (const { item, localOffset } of p.linkedCollectibles) {
              if (!item.collected) {
                item.position.set(targetX + localOffset.x, targetY + localOffset.y, targetZ + localOffset.z);
                item.mesh.position.copy(item.position);
              }
            }
          }
          continue;
        } else if (p.movementType === "casino_roulette") {
          const rotSpeed = p.rotSpeed ?? 0.65;
          const yaw = effectiveTime * rotSpeed;
          tempEuler.set(0, yaw, 0, "YXZ");
          tempQuat.setFromEuler(tempEuler);
          p.mesh.quaternion.copy(tempQuat);
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w });
          continue;
        } else if (p.movementType === "vertical_circle") {
          const dir = p.direction ?? 1;
          const cy = p.centerY ?? p.basePosition.y;
          const cz = p.centerZ ?? p.basePosition.z;
          const r = p.radius ?? 5.5;
          const baseAng = p.baseAngle ?? 0;
          const ang = baseAng + (p.phase ?? 0) + (effectiveTime > 0 ? dir * p.speed * effectiveTime : 0);
          const targetX = p.basePosition.x;
          const targetY = cy + Math.sin(ang) * r;
          const targetZ = cz + Math.cos(ang) * r;

          if (p.baseQuaternion) {
            tempQuat.copy(p.baseQuaternion);
          } else if (p.baseRotation) {
            tempEuler.copy(p.baseRotation);
            tempQuat.setFromEuler(tempEuler);
          } else {
            tempEuler.set(0, 0, 0, "YXZ");
            tempQuat.setFromEuler(tempEuler);
          }

          p.mesh.position.set(targetX, targetY, targetZ);
          p.mesh.quaternion.copy(tempQuat);
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicTranslation({ x: targetX, y: targetY, z: targetZ });
          p.body.setNextKinematicRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w });
          continue;
        } else if (p.movementType === "quesarito_roll") {
          const spd = p.rollSpeed ?? p.speed ?? 0.7;
          const roll = effectiveTime > 0 ? effectiveTime * spd : 0;
          tempEuler.set(0, 0, roll, "XYZ");
          tempQuat.setFromEuler(tempEuler);
          if (p.baseQuaternion) tempQuat.premultiply(p.baseQuaternion);
          p.mesh.position.copy(p.basePosition);
          p.mesh.quaternion.copy(tempQuat);
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicTranslation(p.basePosition);
          p.body.setNextKinematicRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w });
          // A ball can spin in place on a round collider. Carry its center sideways on contact.
          const playerBody = player?.getBody();
          if (!isIntroActive && playerBody && playerPos && playerPos.y > p.basePosition.y &&
              physics.hasBodyContact(playerBody, p.body)) {
            const side = rollCarryAxis.set(-Math.sign(spd), 0, 0);
            if (p.baseQuaternion) side.applyQuaternion(p.baseQuaternion);
            side.y = 0;
            side.normalize();
            const velocity = player.linvel();
            const sidewaysSpeed = velocity.x * side.x + velocity.z * side.z;
            const surfaceSpeed = Math.abs(spd) * (p.radius ?? 4.6) * 0.6;
            const carry = THREE.MathUtils.clamp((surfaceSpeed - sidewaysSpeed) * 3, 0, 8) * delta;
            if (carry > 0) {
              player.setLinearVelocity({
                x: velocity.x + side.x * carry,
                y: velocity.y,
                z: velocity.z + side.z * carry
              });
            }
          }
          continue;
        } else if (p.movementType === "vivagym_treadmill") {
          // Conveyor belt backward push against the player towards +Z
          if (player && playerPos) {
            const dx = playerPos.x - p.basePosition.x;
            const dz = playerPos.z - p.basePosition.z;
            const dy = playerPos.y - p.basePosition.y;
            // Running deck bounds (halfW ~ 11.5m, halfL ~ 43m, dy ~ [-0.3, 2.8])
            if (Math.abs(dx) <= 11.5 && Math.abs(dz) <= 43.0 && dy >= -0.3 && dy <= 2.8) {
              const curVel = typeof player.linvel === "function" ? player.linvel() : player.getVelocity?.() || { x: 0, y: 0, z: 0 };
              const conveyorPush = p.pushSpeed ?? p.speed ?? 1.0;
              const pushDelta = Math.min(conveyorPush * delta * 2.0, 0.12);
              player.setLinearVelocity({ x: curVel.x, y: curVel.y, z: curVel.z + pushDelta });
            }
          }
          continue;
        } else if (p.movementType === "bike_pedal") {
          const r = p.radius ?? 1.6;
          const spd = p.speed ?? 1.8;
          const ph = p.phase ?? 0;
          const yOffset = Math.sin(effectiveTime * spd + ph) * r;
          const zOffset = Math.cos(effectiveTime * spd + ph) * r;
          const targetX = p.basePosition.x;
          const targetY = p.basePosition.y + yOffset;
          const targetZ = p.basePosition.z + zOffset;
          p.mesh.position.set(targetX, targetY, targetZ);
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicTranslation({ x: targetX, y: targetY, z: targetZ });
          continue;
        } else if (p.movementType === "giant_umbrella" || p.movementType==='icecream_spin') {
          const rotSpeed = p.rotSpeed ?? 0.45;
          const dir = p.direction ?? 1;
          const yaw = effectiveTime * rotSpeed * dir;
          tempEuler.set(0, yaw, 0, "YXZ");
          tempQuat.setFromEuler(tempEuler);
          if(p.baseQuaternion)tempQuat.premultiply(p.baseQuaternion);
          p.mesh.quaternion.copy(tempQuat);
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w });
          p.body.setNextKinematicTranslation({ x: p.basePosition.x, y: p.basePosition.y, z: p.basePosition.z });
          continue;
        } else if (p.movementType === "towel_wave") {
          const waveFreq = p.speed ?? 2.0;
          const waveAmpY = (p.distance ?? 0.8) * 0.4;
          const waveTilt = Math.sin(effectiveTime * waveFreq) * 0.12;
          const waveSurgeY = Math.sin(effectiveTime * waveFreq * 1.5) * waveAmpY;
          tempEuler.set(waveTilt, 0, 0, "XYZ");
          tempQuat.setFromEuler(tempEuler);
          const targetY = p.basePosition.y + waveSurgeY;
          p.mesh.position.set(p.basePosition.x, targetY, p.basePosition.z);
          p.mesh.quaternion.copy(tempQuat);
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w });
          p.body.setNextKinematicTranslation({ x: p.basePosition.x, y: targetY, z: p.basePosition.z });
          continue;
        } else if (p.movementType === "wave_pusher") {
          const cycle = p.cycleTime ?? 3.5;
          const travelDist = p.distance ?? 9.5;
          const tInCycle = ((effectiveTime % cycle) + cycle) % cycle;
          let pushProgress = 0;
          if (tInCycle < 0.45 * cycle) {
            const u = tInCycle / (0.45 * cycle);
            pushProgress = Math.sin((u * Math.PI) / 2);
          } else if (tInCycle < 0.55 * cycle) {
            pushProgress = 1.0;
          } else {
            const u = (tInCycle - 0.55 * cycle) / (0.45 * cycle);
            pushProgress = 1.0 - Math.sin((u * Math.PI) / 2);
          }
          const targetX = p.basePosition.x - pushProgress * travelDist;
          const waveBobY = Math.sin(tInCycle * 4.0) * 0.08;
          const targetY = p.basePosition.y + waveBobY;
          p.mesh.position.set(targetX, targetY, p.basePosition.z);
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicTranslation({ x: targetX, y: targetY, z: p.basePosition.z });
          continue;
        } else if (p.movementType === "tram_linear") {
          const delay = p.startDelay ?? 3.5;
          let offset = 0;
          if (effectiveTime > delay) {
            const activeT = effectiveTime - delay;
            const travel = Math.min(p.distance, activeT * p.speed);
            offset = (p.direction ?? -1) * travel;
          }
          const targetX = p.basePosition.x;
          const targetY = p.basePosition.y;
          const targetZ = p.basePosition.z + offset;
          p.mesh.position.set(targetX, targetY, targetZ);
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicTranslation({ x: targetX, y: targetY, z: targetZ });
          continue;
        } else if (p.movementType === "emt_bus_35" || p.movementType === "emt_bus_34") {
          let offset = 0;
          if (effectiveTime > 0) {
            const travel = Math.min(p.distance, effectiveTime * p.speed);
            offset = (p.direction ?? -1) * travel;
          }
          const targetX = p.basePosition.x;
          const targetY = p.basePosition.y;
          const targetZ = p.basePosition.z + offset;
          p.mesh.position.set(targetX, targetY, targetZ);
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicTranslation({ x: targetX, y: targetY, z: targetZ });

          if (p.linkedCollectibles) {
            for (const { item, localOffset } of p.linkedCollectibles) {
              if (!item.collected) {
                item.mesh.position.set(
                  targetX + localOffset.x,
                  targetY + localOffset.y,
                  targetZ + localOffset.z
                );
                item.position.copy(item.mesh.position);
              }
            }
          }
          continue;
        } else if (p.movementType === "popeye_pizza") {
          const rotSpeed = p.rotSpeed ?? 0.45;
          const yaw = effectiveTime * rotSpeed;
          tempEuler.set(0, yaw, 0, "YXZ");
          tempQuat.setFromEuler(tempEuler);
          p.mesh.quaternion.copy(tempQuat);

          const waveAmp = p.waveAmplitude ?? 0.65;
          const waveSpd = p.waveSpeed ?? 2.2;
          const waveOffset = Math.sin(effectiveTime * waveSpd) * waveAmp;
          const targetY = p.basePosition.y + waveOffset;

          p.mesh.position.set(p.basePosition.x, targetY, p.basePosition.z);
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w });
          p.body.setNextKinematicTranslation({ x: p.basePosition.x, y: targetY, z: p.basePosition.z });
          continue;
        } else if (p.movementType === "village_dogs") {
          const isAxisZ = p.axis === "z";
          const span = isAxisZ ? p.basePosition.z : p.basePosition.x;
          const D = Math.abs(span) > 1.0
            ? Math.abs(span)
            : (p.distance > 6.0 ? p.distance / 2 : p.distance);
          const centerX = isAxisZ ? p.basePosition.x : (Math.abs(p.basePosition.x) > 1.0 ? 0.0 : p.basePosition.x);
          const centerZ = isAxisZ ? (Math.abs(p.basePosition.z) > 1.0 ? 0.0 : p.basePosition.z) : p.basePosition.z;

          // Realistic canine patrol cycle (like fighting bulls):
          // Galloping/running across platform facing travel direction, smooth braking before edge, 180° turn, then charging back
          const dogSpeed = p.speed || 4.0;
          const Th = Math.max(0.85, 8.5 / dogSpeed); // Half-cycle duration per crossing
          const T = Th * 2;
          const t = effectiveTime + (p.phase ?? 0);
          const cycle = ((t % T) + T) % T;
          let isForward = cycle < Th;
          if ((p.direction ?? 1) < 0) {
            isForward = !isForward;
          }
          const tau = (cycle < Th ? cycle : (cycle - Th)) / Th; // 0 to 1

          const chargeDuration = 0.72; // 72% galloping across, 28% braking and 180° turning
          let targetX = centerX;
          let targetZ = centerZ;
          let yaw = 0;
          let pitch = 0;
          let headBob = 0;
          let runCycle = 0;
          let chargeDirX = 0;
          let chargeDirZ = 0;

          if (tau < chargeDuration) {
            // Galloping phase across the street/corral
            const u = tau / chargeDuration;
            const progress = 3 * u * u - 2 * u * u * u;
            runCycle = u * Math.PI * 14;

            if (isAxisZ) {
              const fromZ = isForward ? centerZ - D : centerZ + D;
              const toZ = isForward ? centerZ + D : centerZ - D;
              targetZ = fromZ + (toZ - fromZ) * progress;
              targetX = centerX;
              yaw = isForward ? Math.PI : 0;
              chargeDirZ = isForward ? 1 : -1;
            } else {
              const fromX = isForward ? centerX - D : centerX + D;
              const toX = isForward ? centerX + D : centerX - D;
              targetX = fromX + (toX - fromX) * progress;
              targetZ = centerZ;
              yaw = isForward ? -Math.PI / 2 : Math.PI / 2;
              chargeDirX = isForward ? 1 : -1;
            }

            // Gallop tilt and head bounce while running
            pitch = Math.sin(runCycle) * 0.08;
            headBob = Math.abs(Math.sin(runCycle)) * 0.08;
          } else {
            // Braking & smooth 180° turn at the border
            const turnU = (tau - chargeDuration) / (1 - chargeDuration);
            const turnProgress = 3 * turnU * turnU - 2 * turnU * turnU * turnU;

            if (isAxisZ) {
              targetZ = isForward ? centerZ + D : centerZ - D;
              targetX = centerX;
              const startYaw = isForward ? Math.PI : 0;
              yaw = startYaw + (isForward ? -Math.PI : Math.PI) * turnProgress;
            } else {
              targetX = isForward ? centerX + D : centerX - D;
              targetZ = centerZ;
              const startYaw = isForward ? -Math.PI / 2 : Math.PI / 2;
              yaw = startYaw + (isForward ? Math.PI : -Math.PI) * turnProgress;
            }

            headBob = Math.sin(turnU * Math.PI * 2) * 0.06;
            pitch = -Math.sin(turnU * Math.PI) * 0.06;
          }

          const targetY = p.basePosition.y + (tau < chargeDuration ? Math.abs(Math.sin(runCycle)) * 0.05 : 0);

          // Animate happy energetic tail wagging
          if (p.subMeshes?.tailMesh) {
            const wagFreq = tau < chargeDuration ? 22.0 : 12.0;
            p.subMeshes.tailMesh.rotation.y = Math.sin(effectiveTime * wagFreq) * 0.55;
            p.subMeshes.tailMesh.rotation.z = Math.cos(effectiveTime * wagFreq) * 0.22;
          }

          // Animate head bob & alertness
          if (p.subMeshes?.headGroup) {
            p.subMeshes.headGroup.position.y = 0.72 + headBob;
            p.subMeshes.headGroup.rotation.x = -headBob * 1.5;
          }

          // Animate 4 running paws swinging in trot cadence
          if (p.subMeshes?.legs && Array.isArray(p.subMeshes.legs)) {
            const swing = tau < chargeDuration ? Math.sin(runCycle) * 0.5 : 0;
            p.subMeshes.legs[0].rotation.x = swing;
            p.subMeshes.legs[1].rotation.x = -swing;
            p.subMeshes.legs[2].rotation.x = -swing;
            p.subMeshes.legs[3].rotation.x = swing;
          }

          // Synchronize 3D mesh & physical Rapier collider orientation and position
          tempEuler.set(pitch, yaw, 0, "YXZ");
          tempQuat.setFromEuler(tempEuler);

          p.mesh.position.set(targetX, targetY, targetZ);
          p.mesh.rotation.copy(tempEuler);
          p.mesh.updateMatrixWorld(true);

          p.body.setNextKinematicTranslation({ x: targetX, y: targetY, z: targetZ });
          p.body.setNextKinematicRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w });

          // Player collision: barking charge knockback (stronger and directional impulse!)
          if (player && playerPos) {
            const dx = playerPos.x - targetX;
            const dz = playerPos.z - targetZ;
            const dy = playerPos.y - targetY;
            const distXZ = Math.sqrt(dx * dx + dz * dz);

            if (distXZ < 1.6 && dy >= -0.3 && dy < 2.0) {
              const normX = distXZ > 0.05 ? dx / distXZ : (chargeDirX || 1);
              const normZ = distXZ > 0.05 ? dz / distXZ : (chargeDirZ || 1);

              let pushX = normX * 18.0;
              let pushZ = normZ * 18.0;

              if (tau < chargeDuration) {
                if (isAxisZ) {
                  pushZ = chargeDirZ * 16.0 + normZ * 10.0;
                  pushX = normX * 18.0;
                } else {
                  pushX = chargeDirX * 16.0 + normX * 10.0;
                  pushZ = normZ * 18.0;
                }
              }

              const pushY = 9.2; // Stronger upward pop (up from 7.5)
              player.setLinearVelocity({ x: pushX, y: pushY, z: pushZ });
            }
          }
          continue;
        } else if (p.movementType === "village_girls") {
          const travel = Math.sin(effectiveTime * p.speed + (p.phase ?? 0)) * p.distance;
          const targetX = p.axis === "z" ? p.basePosition.x : p.basePosition.x + travel;
          const targetZ = p.axis === "z" ? p.basePosition.z + travel : p.basePosition.z;

          p.mesh.position.set(targetX, p.basePosition.y, targetZ);
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicTranslation({ x: targetX, y: p.basePosition.y, z: targetZ });

          if (player && playerPos) {
            const dx = playerPos.x - targetX;
            const dz = playerPos.z - targetZ;
            const dy = playerPos.y - p.basePosition.y;
            if (Math.abs(dx) < 1.5 && Math.abs(dz) < 1.5 && dy >= -0.2 && dy < 2.2) {
              const pushX = Math.sign(dx || 1) * 11.0;
              const pushZ = Math.sign(dz || 1) * 11.0;
              player.setLinearVelocity({ x: pushX, y: 6.0, z: pushZ });
            }
          }
          continue;
        } else if (p.movementType === "village_boys") {
          const travel = Math.sin(effectiveTime * p.speed + (p.phase ?? 0)) * p.distance;
          const targetX = p.axis === "z" ? p.basePosition.x : p.basePosition.x + travel;
          const targetZ = p.axis === "z" ? p.basePosition.z + travel : p.basePosition.z;

          p.mesh.position.set(targetX, p.basePosition.y, targetZ);
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicTranslation({ x: targetX, y: p.basePosition.y, z: targetZ });

          if (player && playerPos) {
            const dx = playerPos.x - targetX;
            const dz = playerPos.z - targetZ;
            const dy = playerPos.y - p.basePosition.y;
            if (Math.abs(dx) < 1.5 && Math.abs(dz) < 1.5 && dy >= -0.2 && dy < 2.2) {
              // Boys are faster and have higher knockback!
              const pushX = Math.sign(dx || 1) * 16.0;
              const pushZ = Math.sign(dz || 1) * 16.0;
              player.setLinearVelocity({ x: pushX, y: 8.5, z: pushZ });
            }
          }
          continue;
        } else if (p.movementType === "slamming_door") {
          // Door cycle: 2.2s slow opening, 0.18s sudden slam shut, 0.8s closed pause
          const cycleTime = 3.2;
          const tInCycle = ((effectiveTime * p.speed + (p.phase ?? 0)) % cycleTime + cycleTime) % cycleTime;
          let doorAngle = 0;
          let isSlamming = false;

          if (tInCycle < 2.2) {
            // Opening slowly
            const u = tInCycle / 2.2;
            doorAngle = Math.sin((u * Math.PI) / 2) * Math.PI / 2;
          } else if (tInCycle < 2.38) {
            // Sudden violent slam shut!
            const u = (tInCycle - 2.2) / 0.18;
            doorAngle = Math.PI / 2 * (1 - u);
            isSlamming = true;
          } else {
            // Closed pause
            doorAngle = 0;
          }

          if (p.subMeshes?.doorPivot) {
            p.subMeshes.doorPivot.rotation.y = doorAngle;
          }

          p.mesh.updateMatrixWorld(true);
          const pivot = p.subMeshes!.doorPivot;
          pivot.getWorldPosition(fanLocal);
          pivot.getWorldQuaternion(tempQuat);
          p.body.setNextKinematicTranslation(fanLocal);
          p.body.setNextKinematicRotation(tempQuat);
          // Empty space never triggers a slam: require real contact with leaf or handle.
          if (!isIntroActive && isSlamming && player && playerPos && player.getBody?.() &&
              effectiveTime - (p.lastBoostTime ?? -1) > .25 && physics.hasBodyContact(player.getBody(), p.body)) {
            fanInverse.copy(p.baseQuaternion!).invert();
            fanLocal.copy(playerPos).sub(p.basePosition).applyQuaternion(fanInverse);
            fanGust.set(8, 5, (fanLocal.z >= 0 ? 1 : -1) * 18).applyQuaternion(p.baseQuaternion!);
            player.setLinearVelocity(fanGust);
            p.lastBoostTime = effectiveTime;
          }
          continue;
        } else if (p.movementType === "turron_cat") {
          const travel = Math.sin(effectiveTime * p.speed + (p.phase ?? 0)) * p.distance;
          const targetZ = p.basePosition.z + travel;
          p.mesh.position.set(p.basePosition.x, p.basePosition.y, targetZ);
          p.mesh.updateMatrixWorld(true);
          p.body.setNextKinematicTranslation({ x: p.basePosition.x, y: p.basePosition.y, z: targetZ });

          if (player && playerPos) {
            const dx = playerPos.x - p.basePosition.x;
            const dz = playerPos.z - targetZ;
            const dy = playerPos.y - p.basePosition.y;
            if (Math.abs(dx) < 1.3 && Math.abs(dz) < 1.3 && dy >= -0.2 && dy < 1.5) {
              // Pushes player off the path towards negative X into the river water!
              player.setLinearVelocity({ x: -16.0, y: 6.5, z: 0 });
            }
          }
          continue;
        } else if (p.movementType === "litos_duo") {
          // Litos duo spring cycle of 3.2s:
          // [0 to 0.6s]: Wait behind closed door at base Z
          // [0.6s to 1.2s]: Door opens, fast sprint forward crossing the doorway (baseZ -> baseZ + dir * distance)
          // [1.2s to 2.1s]: Slow recoil back to base like a spring retracting
          // [2.1s to 3.2s]: Door slams shut at 2.2s, wait safely behind door
          const cycleTime = p.cycleTime ?? 3.2;
          const tInCycle = ((effectiveTime * p.speed + (p.phase ?? 0)) % cycleTime + cycleTime) % cycleTime;
          const dist = p.distance ?? 10.0;
          const dir = p.direction ?? 1;
          let travel = 0;

          if (tInCycle < 0.6) {
            travel = 0;
          } else if (tInCycle < 1.2) {
            // Explosive dash forward
            const u = (tInCycle - 0.6) / 0.6;
            travel = dist * Math.sin((u * Math.PI) / 2);
          } else if (tInCycle < 2.1) {
            // Slow spring return
            const u = (tInCycle - 1.2) / 0.9;
            travel = dist * (1 - u);
          } else {
            travel = 0;
          }

          const targetZ = p.basePosition.z + dir * travel;
          p.mesh.position.set(p.basePosition.x, p.basePosition.y, targetZ);
          p.mesh.updateMatrixWorld(true);
          if (p.body) {
            p.body.setNextKinematicTranslation({ x: p.basePosition.x, y: p.basePosition.y, z: targetZ });
          }

          if (player && playerPos) {
            const dx = playerPos.x - p.basePosition.x;
            const dz = playerPos.z - targetZ;
            const dy = playerPos.y - p.basePosition.y;
            if (Math.abs(dx) < 1.6 && Math.abs(dz) < 1.4 && dy >= -0.2 && dy < 2.2) {
              player.setLinearVelocity({ x: (dx >= 0 ? 1 : -1) * 14.0, y: 10.0, z: dir * 18.0 });
            }
          }
          continue;
        } else if (p.movementType === "accelerating_wall") {
          // Accelerating kinematic wall: v(t) = v0 + a * t => distance = v0 * t + 0.5 * a * t^2
          const dir = p.direction ?? -1;
          const v0 = p.speed ?? 1.8;
          const a = p.waveAmplitude ?? 0.45;
          const maxDist = p.distance ?? 72.0;
          const travel = Math.min(maxDist, v0 * effectiveTime + 0.5 * a * effectiveTime * effectiveTime);
          const targetZ = p.basePosition.z + dir * travel;

          p.mesh.position.set(p.basePosition.x, p.basePosition.y, targetZ);
          p.mesh.updateMatrixWorld(true);
          if (p.body) {
            p.body.setNextKinematicTranslation({ x: p.basePosition.x, y: p.basePosition.y, z: targetZ });
          }

          if (player && playerPos) {
            const dx = playerPos.x - p.basePosition.x;
            const dz = playerPos.z - targetZ;
            const dy = playerPos.y - p.basePosition.y;
            if (Math.abs(dx) < 4.0 && Math.abs(dz) < 2.0 && dy >= -0.5 && dy < 4.0) {
              player.setLinearVelocity({ x: dx * 1.5, y: 8.0, z: dir * 32.0 });
            }
          }
          continue;
        } else if (p.movementType === "clapping_gloves") {
          // Clapping gloves cycle: open position -> rapid inwards clap slap -> recoil
          const cycle = p.cycleTime ?? 2.2;
          const tInCycle = ((effectiveTime * p.speed + (p.phase ?? 0)) % cycle + cycle) % cycle;
          const isLeft = p.side === "left";
          const maxInward = p.distance ?? 4.2; // brings palm close to center (X = 0)
          let inward = 0;

          if (tInCycle < 1.1) {
            inward = 0;
          } else if (tInCycle < 1.4) {
            const u = (tInCycle - 1.1) / 0.3;
            inward = maxInward * Math.sin((u * Math.PI) / 2);
          } else if (tInCycle < 1.6) {
            inward = maxInward;
          } else {
            const u = (tInCycle - 1.6) / (cycle - 1.6);
            inward = maxInward * (1 - u);
          }

          const targetX = isLeft ? p.basePosition.x + inward : p.basePosition.x - inward;
          p.mesh.position.set(targetX, p.basePosition.y, p.basePosition.z);
          p.mesh.updateMatrixWorld(true);
          if (p.body) {
            p.body.setNextKinematicTranslation({ x: targetX, y: p.basePosition.y, z: p.basePosition.z });
          }

          // If the glove collides with player during clap or contact, slap player flying!
          if (player && playerPos) {
            const dx = playerPos.x - targetX;
            const dz = playerPos.z - p.basePosition.z;
            const dy = playerPos.y - p.basePosition.y;
            if (Math.abs(dx) < 1.4 && Math.abs(dz) < 1.8 && dy >= -0.5 && dy < 2.5) {
              const flyX = isLeft ? 22.0 : -22.0;
              player.setLinearVelocity({ x: flyX, y: 16.0, z: -12.0 });
            }
          }
          continue;
        } else if (p.movementType === "residential_elevator_2f") {
          // 2-stop elevator cycle: Ground (Y=0) -> 1st Floor (Y=4.5) -> 2nd Floor (Y=9.0) -> Ground
          const cycle = p.cycleTime ?? 12.0;
          const tInCycle = ((effectiveTime * p.speed + (p.phase ?? 0)) % cycle + cycle) % cycle;
          let elevY = 0;

          if (tInCycle < 2.5) {
            elevY = 0;
          } else if (tInCycle < 4.5) {
            const u = (tInCycle - 2.5) / 2.0;
            const smoothU = 0.5 * (1 - Math.cos(u * Math.PI));
            elevY = 4.5 * smoothU;
          } else if (tInCycle < 6.5) {
            elevY = 4.5;
          } else if (tInCycle < 8.5) {
            const u = (tInCycle - 6.5) / 2.0;
            const smoothU = 0.5 * (1 - Math.cos(u * Math.PI));
            elevY = 4.5 + 4.5 * smoothU;
          } else if (tInCycle < 10.5) {
            elevY = 9.0;
          } else {
            const u = (tInCycle - 10.5) / 1.5;
            const smoothU = 0.5 * (1 - Math.cos(u * Math.PI));
            elevY = 9.0 * (1 - smoothU);
          }

          const targetY = p.basePosition.y + elevY;
          p.mesh.position.set(p.basePosition.x, targetY, p.basePosition.z);
          p.mesh.updateMatrixWorld(true);
          if (p.body) {
            p.body.setNextKinematicTranslation({ x: p.basePosition.x, y: targetY, z: p.basePosition.z });
          }
          continue;
        } else if (p.movementType === "street_patrol_man") {
          const dist = p.distance ?? 5.2;
          const halfDist = dist / 2;
          const phase = p.phase ?? 0;
          const omega = p.speed ?? 2.2;
          const offset = Math.sin(effectiveTime * omega + phase) * halfDist;
          const targetX = p.basePosition.x + offset;

          p.mesh.position.set(targetX, p.basePosition.y, p.basePosition.z);
          const walkingDir = Math.cos(effectiveTime * omega + phase) >= 0 ? 1 : -1;
          p.mesh.rotation.y = walkingDir > 0 ? Math.PI / 2 : -Math.PI / 2;
          p.mesh.updateMatrixWorld(true);

          if (p.body) {
            p.body.setNextKinematicTranslation({ x: targetX, y: p.basePosition.y, z: p.basePosition.z });
          }
          continue;
        } else if (p.movementType === "tilt_x") {
          const cycle = p.cycleTime ?? 8.0;
          const pBottom = p.pauseBottom ?? 1.5;
          const rTime = p.riseTime ?? 2.5;
          const pTop = p.pauseTop ?? 1.5;
          const t1 = pBottom;
          const t2 = t1 + rTime;
          const t3 = t2 + pTop;
          const tInCycle = ((effectiveTime % cycle) + cycle) % cycle;

          const minA = p.minAngle ?? 0.03;
          const maxA = p.maxAngle ?? 0.388;

          let currentAngle = minA;
          if (tInCycle < t1) {
            // Reposo en la plataforma inferior de salida: el jugador puede subirse a la rampa sin esfuerzo
            currentAngle = minA;
          } else if (tInCycle < t2) {
            // Ascenso progresivo hidráulico: eleva la inclinación X de la rampa
            const u = (tInCycle - t1) / (t2 - t1);
            const smoothU = 0.5 * (1 - Math.cos(u * Math.PI));
            currentAngle = minA + (maxA - minA) * smoothU;
          } else if (tInCycle < t3) {
            // Reposo en la cima superior: la rampa conecta con la cima a 16m para alcanzar la meta
            currentAngle = maxA;
          } else {
            // Descenso suave de regreso hacia la base
            const u = (tInCycle - t3) / (cycle - t3);
            const smoothU = 0.5 * (1 - Math.cos(u * Math.PI));
            currentAngle = maxA - (maxA - minA) * smoothU;
          }

          tempEuler.set(currentAngle, 0, 0, "YXZ");
          tempQuat.setFromEuler(tempEuler);

          // Mantener la bisagra fija en la base mientras la rampa oscila su inclinación
          const Hz = (p.distance ?? 42.0) / 2;
          const hZ = p.hingeZ ?? (p.basePosition.z + Hz);
          const hY = p.hingeY ?? 0.4;
          const hX = p.basePosition.x;

          const localVec = new THREE.Vector3(0, 0, -Hz).applyQuaternion(tempQuat);
          const targetX = hX;
          const targetY = hY + localVec.y;
          const targetZ = hZ + localVec.z;

          p.mesh.position.set(targetX, targetY, targetZ);
          p.mesh.quaternion.copy(tempQuat);
          p.mesh.updateMatrixWorld(true);

          p.body.setNextKinematicTranslation({ x: targetX, y: targetY, z: targetZ });
          p.body.setNextKinematicRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w });

          // Sincronizar coleccionables en la superficie de la rampa
          if (p.linkedCollectibles) {
            for (const { item, localOffset } of p.linkedCollectibles) {
              if (!item.collected) {
                const itemPos = localOffset.clone().applyQuaternion(tempQuat).add(p.mesh.position);
                item.mesh.position.copy(itemPos);
                item.position.copy(itemPos);
              }
            }
          }
          continue;
        }

        let offset = 0;
        if (effectiveTime > 0) {
          if (p.movementType === "forward" || p.movementType === "linear") {
            const dir = p.direction ?? 1;
            const travel = Math.min(p.distance, effectiveTime * p.speed);
            offset = dir * travel;
          } else if (p.movementType === "loop") {
            const dir = p.direction ?? 1;
            offset = dir * ((effectiveTime * p.speed) % p.distance);
          } else if (p.movementType === "gate") {
            // Smooth vertical gate cycle: rests closed on floor (offset = 0) and raises to p.distance
            const phase = (effectiveTime * p.speed) % (Math.PI * 2);
            offset = ((1 - Math.cos(phase)) / 2) * p.distance;
          } else if (p.movementType === "teleferico") {
            // Teleférico shuttle cycle:
            // 1. Wait at top station (+distance) for 2.8s
            // 2. Glide down smoothly to bottom station (-distance) over 5.2s
            // 3. Wait at bottom station (-distance) for 3.2s
            // 4. Glide back up smoothly to top station (+distance) over 5.2s
            const tWaitTop = 2.8;
            const tTravel = 5.2 / (p.speed || 1.0);
            const tWaitBot = 3.2;
            const halfCycle = tWaitTop + tTravel;
            const totalCycle = halfCycle + tWaitBot + tTravel;
            const tInCycle = effectiveTime % totalCycle;

            const topOffset = p.distance;
            const botOffset = -p.distance;

            if (tInCycle < tWaitTop) {
              offset = topOffset;
            } else if (tInCycle < tWaitTop + tTravel) {
              const u = (tInCycle - tWaitTop) / tTravel;
              const smoothU = (1 - Math.cos(Math.PI * u)) / 2;
              offset = topOffset + (botOffset - topOffset) * smoothU;
            } else if (tInCycle < tWaitTop + tTravel + tWaitBot) {
              offset = botOffset;
            } else {
              const u = (tInCycle - (tWaitTop + tTravel + tWaitBot)) / tTravel;
              const smoothU = (1 - Math.cos(Math.PI * u)) / 2;
              offset = botOffset + (topOffset - botOffset) * smoothU;
            }
          } else {
            offset = Math.sin(effectiveTime * p.speed + (p.phase ?? 0)) * p.distance;
          }
        } else if (p.movementType === "teleferico") {
          // While waiting before start delay: stay at top station
          offset = p.distance;
        } else if (p.phase !== undefined) {
          offset = Math.sin(p.phase) * p.distance;
        }

        const targetX = p.axis === "x" ? p.basePosition.x + offset : p.basePosition.x;
        const targetZ = (p.axis === "z" || p.axis === "yz") ? p.basePosition.z + offset : p.basePosition.z;
        const targetY = p.axis === "y"
          ? p.basePosition.y + offset
          : p.axis === "yz"
          ? p.basePosition.y + offset * (p.slopeY ?? 0.28)
          : p.basePosition.y;

        p.mesh.position.set(targetX, targetY, targetZ);
        if (p.baseQuaternion) {
          p.mesh.quaternion.copy(p.baseQuaternion);
          if (p.body) {
            p.body.setNextKinematicRotation({
              x: p.baseQuaternion.x,
              y: p.baseQuaternion.y,
              z: p.baseQuaternion.z,
              w: p.baseQuaternion.w
            });
          }
        }
        p.mesh.updateMatrixWorld(true);
        if (p.body) {
          p.body.setNextKinematicTranslation({ x: targetX, y: targetY, z: targetZ });
        }
      }

      // Animate goal portal shimmer & teleport warp overdrive
      if (goal && goal.portalMesh) {
        const pMat = goal.portalMesh.material as THREE.MeshBasicMaterial;
        if (goal.reached) {
          // Intense cosmic portal warp spin when player crosses
          if (pMat.map) {
            pMat.map.offset.y = (animTime * 2.8) % 1;
          }
          pMat.opacity = 0.82 + Math.sin(animTime * 16) * 0.16;
        } else {
          if (pMat.map) {
            pMat.map.offset.y = (animTime * 0.35) % 1;
          }
          pMat.opacity = 0.45 + Math.sin(animTime * 4) * 0.12;
        }
      }

      // Animate flowing physical water waves on water blocks (step simulator once per cluster)
      const steppedSimulators = new Set<WaterWaveSimulator>();
      const computeNormals = activeQuality !== "low";
      for (const wb of waterBlocks) {
        if(wb.river) {if(!canoe) wb.river.update(animTime);continue;}
        if (!steppedSimulators.has(wb.simulator)) {
          steppedSimulators.add(wb.simulator);
          wb.simulator.step(delta);
        }
        wb.simulator.applyToMesh(wb.surfaceMesh, wb.position.x, wb.position.z, animTime, computeNormals);
        const map = (wb.material as any).map;
        if (map) {
          map.offset.x = (animTime * 0.04) % 1;
          map.offset.y = (animTime * 0.03) % 1;
        }
      }

      // Animate molten lava pulse and glow
      for (const lb of lavaBlocks) {
        const map = (lb.material as any).map;
        if (map) {
          map.offset.x = (animTime * 0.035) % 1;
          map.offset.y = (animTime * 0.025) % 1;
        }
        if ((lb.material as any).emissiveIntensity !== undefined) {
          (lb.material as any).emissiveIntensity = 0.72 + Math.sin(animTime * 4.5) * 0.28;
        }
      }

      // Animate lively decorations (birds hopping and wing flutter, flowers swaying in the breeze)
      for (const dec of decorations) {
        if (dec.subType === "bird") {
          const cycle = (animTime * 1.6 + dec.animOffset) % 3.6;
          if (cycle < 0.5) {
            const hop = Math.sin((cycle / 0.5) * Math.PI);
            dec.group.position.y = dec.baseY + hop * 0.25;
            if (dec.wings) {
              const flap = Math.sin(cycle * 38) * 0.7;
              dec.wings[0].rotation.z = 0.2 + flap;
              dec.wings[1].rotation.z = -0.2 - flap;
            }
          } else {
            dec.group.position.y = dec.baseY;
            if (dec.wings) {
              dec.wings[0].rotation.z = 0.12;
              dec.wings[1].rotation.z = -0.12;
            }
            if (cycle > 1.8 && cycle < 2.3) {
              dec.group.rotation.y = dec.baseRotY + Math.sin((cycle - 1.8) * Math.PI * 2) * 0.35;
            } else {
              dec.group.rotation.y = dec.baseRotY;
            }
          }
        } else if (dec.subType === "flower") {
          const breeze = Math.sin(animTime * 2.2 + dec.animOffset) * 0.08;
          dec.group.rotation.z = breeze;
          dec.group.rotation.x = Math.cos(animTime * 1.7 + dec.animOffset) * 0.05;
        }
      }

      // Animate realistic charging and braking fighting bulls (Toros bravos)
      for (const bull of activeBulls) {
        const effectiveTime = Math.max(0, gameplayMoveTime);
        const t = effectiveTime * bull.speed + bull.phase;
        const Th = 2.0; // 2 seconds per half cycle (4.0s full back-and-forth cycle)
        const T = Th * 2;
        const cycle = ((t % T) + T) % T;
        const isForward = cycle < Th;
        const tau = (isForward ? cycle : (cycle - Th)) / Th; // 0 to 1

        let x = 0;
        let z = 0;
        let yaw = 0;
        let pitch = 0;
        let headBob = 0;
        const D = bull.distance;
        const chargeDuration = 0.70; // 70% charge & brake, 30% skid-stop & 180° turn
        const isAxisZ = bull.axis === "z";

        if (tau < chargeDuration) {
          const u = tau / chargeDuration;
          // Rapid acceleration across platform, smooth braking before reaching edge
          const progress = 1 - Math.pow(1 - u, 2.2);

          if (isAxisZ) {
            // Charging down/up along Z
            const fromZ = isForward ? D : -D;
            const toZ = isForward ? -D : D;
            z = fromZ + (toZ - fromZ) * progress;
            yaw = isForward ? Math.PI : 0;
          } else {
            // Charging left/right along X
            const fromX = isForward ? -D : D;
            const toX = isForward ? D : -D;
            x = fromX + (toX - fromX) * progress;
            // Facing direction: +X = Math.PI / 2, -X = -Math.PI / 2
            yaw = isForward ? Math.PI / 2 : -Math.PI / 2;
          }

          // Gallop tilt while running, braking pitch back when digging in hoofs
          if (u < 0.6) {
            pitch = Math.sin(u * Math.PI * 8) * 0.05;
            headBob = Math.sin(u * Math.PI * 8) * 0.04;
          } else {
            const brakeU = (u - 0.6) / 0.4;
            pitch = -Math.sin(brakeU * Math.PI) * 0.14; // skid back
            headBob = -Math.sin(brakeU * Math.PI) * 0.09;
          }
        } else {
          // Skid stop at edge, snorting and turning around
          const turnU = (tau - chargeDuration) / (1 - chargeDuration);
          headBob = -Math.sin(turnU * Math.PI * 2) * 0.12;

          if (isAxisZ) {
            z = isForward ? -D : D;
            const startYaw = isForward ? Math.PI : 0;
            const turnProgress = turnU * turnU * (3 - 2 * turnU);
            yaw = startYaw + (isForward ? Math.PI : -Math.PI) * turnProgress;
          } else {
            x = isForward ? D : -D;
            const startYaw = isForward ? Math.PI / 2 : -Math.PI / 2;
            const turnProgress = turnU * turnU * (3 - 2 * turnU);
            yaw = startYaw + (isForward ? Math.PI : -Math.PI) * turnProgress;
          }
        }

        const curX = bull.baseX + x;
        const curY = bull.baseY;
        const curZ = bull.baseZ + z;

        bull.group.position.set(curX, curY, curZ);
        bull.group.rotation.set(pitch, yaw, 0);
        bull.headGroup.position.y = 0.55 + headBob;
        bull.headGroup.rotation.x = -headBob * 1.5;

        tempEuler.set(pitch, yaw, 0);
        tempQuat.setFromEuler(tempEuler);
        bull.body.setNextKinematicTranslation({ x: curX, y: curY, z: curZ });
        bull.body.setNextKinematicRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w });
      }

      // Animate festive fireworks display with randomized burst heights
      for (const fw of fireworks) {
        const rawTime = animTime + fw.phase;
        const cycleCount = Math.floor(rawTime / fw.period);
        const cycle = (rawTime % fw.period) / fw.period;
        const launchFrac = 0.35;
        const posAttr = fw.sparks.geometry.getAttribute("position") as THREE.BufferAttribute;
        const colorAttr = fw.sparks.geometry.getAttribute("color") as THREE.BufferAttribute;
        const mat = fw.sparks.material as THREE.PointsMaterial;

        // Dynamic height variation per shot: some explode lower down over the plaza, some higher in the sky
        const heightJitter = Math.sin(cycleCount * 17.37 + fw.index * 4.19) * 3.6;
        const currentOriginY = Math.max(6.5, fw.originY + heightJitter);

        if (cycle < launchFrac) {
          const u = cycle / launchFrac;
          fw.flareMesh.visible = true;
          fw.flareMesh.position.set(0, u * currentOriginY, 0);
          mat.opacity = 0.0;
        } else {
          fw.flareMesh.visible = false;
          const explodeU = (cycle - launchFrac) / (1 - launchFrac);
          const spread = explodeU * (1.9 - 0.7 * explodeU);
          const gravityDrop = -4.5 * explodeU * explodeU;
          const alpha = Math.max(0, 1.0 - explodeU * 1.15);

          mat.opacity = alpha;
          mat.size = 0.55 * (1.0 + explodeU * 0.45);

          const count = fw.posArray.length / 3;
          for (let i = 0; i < count; i++) {
            fw.posArray[i * 3 + 0] = fw.velArray[i * 3 + 0] * spread;
            fw.posArray[i * 3 + 1] = currentOriginY + fw.velArray[i * 3 + 1] * spread + gravityDrop;
            fw.posArray[i * 3 + 2] = fw.velArray[i * 3 + 2] * spread;

            const twinkle = 0.8 + 0.25 * Math.sin(animTime * 28 + i * 2);
            fw.colorArray[i * 3 + 0] = fw.baseColor.r * twinkle;
            fw.colorArray[i * 3 + 1] = fw.baseColor.g * twinkle;
            fw.colorArray[i * 3 + 2] = fw.baseColor.b * twinkle;
          }
          posAttr.needsUpdate = true;
          colorAttr.needsUpdate = true;
        }
      }
      kyoto?.syncAssets();
      return playerRespawned;
    };

    const setQuality = (newQuality: "low" | "medium" | "high") => {
      activeQuality = newQuality;
      root.userData.graphicsQuality=newQuality;
      root.traverse(node=>node.userData.sellaWater?.setQuality(newQuality));
      root.traverse(node=>node.userData.naraSetQuality?.(newQuality));
      for(const item of collectibles)if(item.mesh instanceof CollectibleVisual)item.mesh.setQuality(newQuality);
    };
    const destroy = () => {
      norway?.destroy();
      tokyo?.destroy();
      osaka?.destroy();
      nara?.destroy();
      kyoto?.destroy();
      bigben?.destroy();
      museum?.destroy();
      oxford?.destroy();
      london?.destroy();
      covadonga?.destroy();
      canoe?.destroy();
      physics.clearStageColliders();
      collidableMeshes.length = 0;
      platformMeshes.length = 0;
      activeBulls.length = 0;
      materialCache.clear();
      disposeStageResources(root);
      root.clear();
    };

    const spawnPoint = new THREE.Vector3(
      data.spawn?.x ?? 0,
      data.spawn?.y ?? 2,
      data.spawn?.z ?? 0
    );

    const reset = () => {
      norway?.reset();
      tokyo?.reset();
      osaka?.reset();
      nara?.reset();
      kyoto?.reset();
      gameplayMoveTime = 0;
      cangas?.reset();
      canoe?.reset();
      covadonga?.reset();
      london?.reset();
      museum?.reset();
      oxford?.reset();
      bigben?.reset();
      for (const p of movingPlatforms) {
        p.tramPassenger?.reset();
        if(p.movementType === "slamming_door") { p.subMeshes!.doorPivot.rotation.y = 0; p.lastBoostTime = undefined; }
        if(p.movementType==="fan_5blades"){p.rotSpeed=0;p.lastBoostTime=undefined;p.subMeshes!.rotor.position.set(0,0,0);p.subMeshes!.rotor.quaternion.identity();}
        p.mesh.position.copy(p.basePosition);
        if (p.movementType === "tram_square") {
          tempEuler.set(0, Math.PI / 2, 0, "YXZ");
          tempQuat.setFromEuler(tempEuler);
        } else if (p.movementType === "tram_circle") {
          const dir = p.direction ?? 1;
          const baseAng = p.baseAngle ?? 0;
          const yaw = -baseAng + (dir > 0 ? -Math.PI / 2 : Math.PI / 2);
          tempEuler.set(0, yaw, 0, "YXZ");
          tempQuat.setFromEuler(tempEuler);
        } else if (p.movementType === "circular" || p.movementType === "orbit") {
          if (p.baseQuaternion) tempQuat.copy(p.baseQuaternion);
          else if (p.baseRotation) { tempEuler.copy(p.baseRotation); tempQuat.setFromEuler(tempEuler); }
          else { tempEuler.set(0, 0, 0, "YXZ"); tempQuat.setFromEuler(tempEuler); }
        } else if (p.movementType === "tilt_x") {
          tempEuler.set(p.minAngle ?? 0.03, 0, 0, "YXZ");
          tempQuat.setFromEuler(tempEuler);
        } else if (p.baseQuaternion) {
          tempQuat.copy(p.baseQuaternion);
        } else if (p.baseRotation) {
          tempEuler.copy(p.baseRotation);
          tempQuat.setFromEuler(tempEuler);
        } else {
          tempEuler.set(0, 0, 0, "YXZ");
          tempQuat.setFromEuler(tempEuler);
        }
        p.mesh.quaternion.copy(tempQuat);
        p.mesh.updateMatrixWorld(true);
        if (p.body) {
          p.body.setTranslation({ x: p.basePosition.x, y: p.basePosition.y, z: p.basePosition.z }, true);
          p.body.setRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w }, true);
          p.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
          p.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
        }
      }
      update(0, true);
      // Restore the initial phase without sweeping from the frame origin after death.
      for(const p of movingPlatforms) if(p.movementType === "slamming_door") {
        p.subMeshes!.doorPivot.getWorldPosition(fanLocal);
        p.subMeshes!.doorPivot.getWorldQuaternion(tempQuat);
        p.body.setTranslation(fanLocal, true); p.body.setRotation(tempQuat, true);
      }
    };

    if((data.world===7&&(data.level===3||data.level===4))||(data.world===8&&(data.level>=1&&data.level<=4))){for(const item of platformMeshes){const object=data.objects[item.objIndex];item.mesh.userData.neonSurface=object?.id??String(item.objIndex);if(object&&['platform','ramp'].includes(object.type)&&!item.isMoving)item.mesh.userData.neonPath=true;}stabilizeNeonSurfaces(root);}
    root.updateMatrixWorld(true);
    for(const p of platformMeshes) {
      const obj=data.objects[p.objIndex];if(!obj) continue;
      p.mesh.userData.levelObjectId=obj.id;
      for(const material of Array.isArray(p.mesh.material)?p.mesh.material:[p.mesh.material]) if(!material.userData.graphicsSurface) material.userData.graphicsSurface=surfaceFamily(`${obj.id} ${String(obj.properties?.theme??'')} ${String(obj.properties?.variant??'')}`);
    }
    norway?.attachCoins(collectibles);
    kyoto?.attachCoins(collectibles);
    setQuality(currentQuality);

    return {
      nara,
      osaka,
      norway,
      tokyo,
      kyoto,
      bigben,
      museum,
      oxford,
      london,
      covadonga,
      canoe,
      group: root,
      collectibles,
      movingPlatforms,
      waterBlocks,
      lavaBlocks,
      decorations,
      bulls: activeBulls,
      collidableMeshes,
      goal,
      spawnPoint,
      destroy,
      update,
      setQuality,
      reset
    };
  }

  static createBullMesh(
    quality: "low" | "medium" | "high" = "medium",
    customColor?: string
  ): { group: THREE.Group; headGroup: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const makeMat = (colorVal: number | string, roughness = 0.4, metalness = 0.1, emissive = 0x000000): THREE.Material => {
      const c = new THREE.Color(colorVal as any);
      let mat: THREE.Material;
      if (quality === "low") {
        mat = new THREE.MeshLambertMaterial({ color: c, emissive: new THREE.Color(emissive) });
      } else if (quality === "medium") {
        mat = new THREE.MeshPhongMaterial({
          color: c,
          shininess: 35,
          specular: new THREE.Color(0x333333),
          emissive: new THREE.Color(emissive)
        });
      } else {
        mat = new THREE.MeshStandardMaterial({
          color: c,
          roughness,
          metalness,
          emissive: new THREE.Color(emissive)
        });
      }
      mat.transparent = false;
      mat.depthWrite = true;
      mat.depthTest = true;
      return mat;
    };

    const bodyMat = makeMat(customColor || 0x1a1a1a);
    const headMat = makeMat(0x222222);
    const muzzleMat = makeMat(0x2d2d2d);
    const hornBaseMat = makeMat(0xfffde7, 0.3, 0.05);
    const hornTipMat = makeMat(0x261c14, 0.5, 0.1);
    const goldRingMat = makeMat(0xffd700, 0.2, 0.85);
    const eyeMat = makeMat(0xd50000, 0.2, 0.1, 0xb71c1c);
    const hoofMat = makeMat(0x111111);

    // 1. Torso (muscular barrel body)
    const torsoGeo = new THREE.BoxGeometry(1.05, 0.8, 1.55);
    torsoGeo.translate(0, 0.48, 0);
    const torso = new THREE.Mesh(torsoGeo, bodyMat);
    group.add(torso);
    meshes.push(torso);

    // 2. Muscular Hump (morrillo del toro bravo)
    const humpGeo = new THREE.SphereGeometry(0.45, 8, 6);
    humpGeo.scale(1.1, 0.75, 1.0);
    humpGeo.translate(0, 0.85, 0.35);
    const hump = new THREE.Mesh(humpGeo, bodyMat);
    group.add(hump);
    meshes.push(hump);

    // 3. Head & Brow Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.55, 0.85);

    const headGeo = new THREE.BoxGeometry(0.68, 0.58, 0.65);
    headGeo.translate(0, 0, 0.25);
    const head = new THREE.Mesh(headGeo, headMat);
    headGroup.add(head);
    meshes.push(head);

    // Muzzle / Snout
    const muzzleGeo = new THREE.BoxGeometry(0.48, 0.38, 0.42);
    muzzleGeo.translate(0, -0.1, 0.68);
    const muzzle = new THREE.Mesh(muzzleGeo, muzzleMat);
    headGroup.add(muzzle);
    meshes.push(muzzle);

    // Golden nose ring
    const ringGeo = new THREE.TorusGeometry(0.12, 0.032, 6, 12);
    ringGeo.rotateX(Math.PI / 4);
    ringGeo.translate(0, -0.25, 0.88);
    const ring = new THREE.Mesh(ringGeo, goldRingMat);
    headGroup.add(ring);
    meshes.push(ring);

    // Eyes (fierce glowing red)
    const eyeLGeo = new THREE.SphereGeometry(0.065, 5, 4);
    eyeLGeo.translate(-0.35, 0.1, 0.35);
    const eyeL = new THREE.Mesh(eyeLGeo, eyeMat);
    headGroup.add(eyeL);
    meshes.push(eyeL);

    const eyeRGeo = new THREE.SphereGeometry(0.065, 5, 4);
    eyeRGeo.translate(0.35, 0.1, 0.35);
    const eyeR = new THREE.Mesh(eyeRGeo, eyeMat);
    headGroup.add(eyeR);
    meshes.push(eyeR);

    // Ears
    const earLGeo = new THREE.ConeGeometry(0.08, 0.26, 4);
    earLGeo.rotateZ(Math.PI / 3);
    earLGeo.rotateX(-0.2);
    earLGeo.translate(-0.42, 0.18, 0.1);
    const earL = new THREE.Mesh(earLGeo, headMat);
    headGroup.add(earL);
    meshes.push(earL);

    const earRGeo = new THREE.ConeGeometry(0.08, 0.26, 4);
    earRGeo.rotateZ(-Math.PI / 3);
    earRGeo.rotateX(-0.2);
    earRGeo.translate(0.42, 0.18, 0.1);
    const earR = new THREE.Mesh(earRGeo, headMat);
    headGroup.add(earR);
    meshes.push(earR);

    // Left Horn
    const hornLBaseGeo = new THREE.CylinderGeometry(0.065, 0.09, 0.32, 6);
    hornLBaseGeo.rotateZ(Math.PI / 3);
    hornLBaseGeo.rotateX(0.35);
    hornLBaseGeo.translate(-0.34, 0.28, 0.35);
    const hornLBase = new THREE.Mesh(hornLBaseGeo, hornBaseMat);
    headGroup.add(hornLBase);
    meshes.push(hornLBase);

    const hornLTipGeo = new THREE.ConeGeometry(0.065, 0.35, 6);
    hornLTipGeo.rotateX(-0.5);
    hornLTipGeo.rotateZ(-0.2);
    hornLTipGeo.translate(-0.48, 0.52, 0.52);
    const hornLTip = new THREE.Mesh(hornLTipGeo, hornTipMat);
    headGroup.add(hornLTip);
    meshes.push(hornLTip);

    // Right Horn
    const hornRBaseGeo = new THREE.CylinderGeometry(0.065, 0.09, 0.32, 6);
    hornRBaseGeo.rotateZ(-Math.PI / 3);
    hornRBaseGeo.rotateX(0.35);
    hornRBaseGeo.translate(0.34, 0.28, 0.35);
    const hornRBase = new THREE.Mesh(hornRBaseGeo, hornBaseMat);
    headGroup.add(hornRBase);
    meshes.push(hornRBase);

    const hornRTipGeo = new THREE.ConeGeometry(0.065, 0.35, 6);
    hornRTipGeo.rotateX(-0.5);
    hornRTipGeo.rotateZ(0.2);
    hornRTipGeo.translate(0.48, 0.52, 0.52);
    const hornRTip = new THREE.Mesh(hornRTipGeo, hornTipMat);
    headGroup.add(hornRTip);
    meshes.push(hornRTip);

    group.add(headGroup);

    // 4. Sturdy Legs & Hoofs
    const legPositions = [
      [-0.38, -0.55],
      [0.38, -0.55],
      [-0.38, 0.5],
      [0.38, 0.5]
    ];
    for (const [lx, lz] of legPositions) {
      const legGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.52, 6);
      legGeo.translate(lx, 0.16, lz);
      const leg = new THREE.Mesh(legGeo, bodyMat);
      group.add(leg);
      meshes.push(leg);

      const hoofGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.14, 6);
      hoofGeo.translate(lx, -0.12, lz);
      const hoof = new THREE.Mesh(hoofGeo, hoofMat);
      group.add(hoof);
      meshes.push(hoof);
    }

    // 5. Tail
    const tailGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.58, 4);
    tailGeo.rotateX(-0.25);
    tailGeo.translate(0, 0.3, -0.85);
    const tail = new THREE.Mesh(tailGeo, bodyMat);
    group.add(tail);
    meshes.push(tail);

    const tuftGeo = new THREE.ConeGeometry(0.07, 0.22, 5);
    tuftGeo.rotateX(-0.35);
    tuftGeo.translate(0, 0.02, -0.92);
    const tuft = new THREE.Mesh(tuftGeo, hoofMat);
    group.add(tuft);
    meshes.push(tuft);

    group.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.renderOrder = 0;
      }
    });

    return { group, headGroup, meshes };
  }

  static createDecorationMesh(
    obj: LevelObjectData,
    quality: "low" | "medium" | "high" = "medium",
    context?: {world:number;level:number}
  ): { group: THREE.Group; decoration?: ActiveDecoration; meshes: THREE.Mesh[] } {
    if(context&&obj.properties?.subType==='nara_rotor')obj={...obj,properties:{...obj.properties,neonRotor:context.world===7&&(context.level===3||context.level===4),neonAccent:context.level===3?0xff79d5:0x73e5f2}};
    if(obj.properties?.subType==='plaza_finale_garland'){
      const result=createPlazaGarland(obj.scale.x);result.group.position.copy(obj.position);result.group.rotation.set(obj.rotation.x,obj.rotation.y,obj.rotation.z,'YXZ');return result;
    }
    const norway=createNorwayModel(obj,quality);if(norway)return norway;
    const tokyo=createTokyoModel(obj,quality);if(tokyo)return tokyo;
    const osaka=createOsakaModel(obj,quality);if(osaka)return osaka;
    const nara=createNaraModel(obj,quality);if(nara){if(context?.world===7&&(context.level===3||context.level===4)&&['nara_path','nara_bowl'].includes(String(obj.properties?.subType)))nara.group.userData.neonSurface=obj.id;return nara;}
    const kyoto=createKyotoModel(obj,quality);if(kyoto)return kyoto;
    const bigben=createBigBenModel(obj);if(bigben)return bigben;
    const museum=createMuseumModel(obj);if(museum) return museum;
    const oxford=createOxfordModel(obj);if(oxford) return oxford;
    const london=createLondonModel(obj);if(london) return london;
    const covadonga=createCovadongaModel(obj);if(covadonga) return covadonga;
    const sella=createSellaModel(obj);
    if(sella) {
      const water=sella.group.userData.sellaWater as SellaWater|undefined;
      if(water) {water.material.map=LevelBuilder.getSharedWaterTexture();water.material.bumpMap=water.material.map;water.material.needsUpdate=true;}
      return sella;
    }
    const cangas = createCangasModel(obj);
    if (cangas) return cangas;
    const asturias = createAsturiasModel(obj);
    if (asturias) return asturias;
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];
    const subType = (obj.properties?.subType as string) || "tree";

    const makeMat = (colorVal: number | string, roughness = 0.5, metalness = 0.05, emissive = 0x000000): THREE.Material => {
      const c = new THREE.Color(colorVal as any);
      let mat: THREE.Material;
      if (quality === "low") {
        mat = new THREE.MeshLambertMaterial({ color: c, emissive: new THREE.Color(emissive) });
      } else if (quality === "medium") {
        mat = new THREE.MeshPhongMaterial({
          color: c,
          shininess: 25,
          specular: new THREE.Color(0x222222),
          emissive: new THREE.Color(emissive)
        });
      } else {
        mat = new THREE.MeshStandardMaterial({
          color: c,
          roughness,
          metalness,
          emissive: new THREE.Color(emissive)
        });
      }
      mat.transparent = false;
      mat.depthWrite = true;
      mat.depthTest = true;
      return mat;
    };

    let wings: [THREE.Mesh, THREE.Mesh] | undefined;

    switch (subType) {
      case "cruces_cypress":
      case "cypress": {
        const h = (obj.scale.y || 1.0) * 9.0;
        const cypressRes = LevelBuilder.createCrucesCypressMesh(h, quality);
        group.add(cypressRes.group);
        meshes.push(...cypressRes.meshes);
        break;
      }

      case "tree": {
        const trunkGeo = new THREE.CylinderGeometry(0.18, 0.24, 1.4, 7);
        trunkGeo.translate(0, 0.7, 0);
        const trunk = new THREE.Mesh(trunkGeo, makeMat(0x5d4037));
        group.add(trunk);
        meshes.push(trunk);

        const fol1Geo = new THREE.SphereGeometry(1.05, 8, 6);
        fol1Geo.scale(1, 0.72, 1);
        fol1Geo.translate(0, 1.55, 0);
        const fol1 = new THREE.Mesh(fol1Geo, makeMat(0x2e7d32));
        group.add(fol1);
        meshes.push(fol1);

        const fol2Geo = new THREE.SphereGeometry(0.75, 8, 6);
        fol2Geo.scale(1, 0.75, 1);
        fol2Geo.translate(0, 2.2, 0);
        const fol2 = new THREE.Mesh(fol2Geo, makeMat(0x43a047));
        group.add(fol2);
        meshes.push(fol2);

        const fol3Geo = new THREE.SphereGeometry(0.45, 7, 5);
        fol3Geo.translate(0, 2.7, 0);
        const fol3 = new THREE.Mesh(fol3Geo, makeMat(0x66bb6a));
        group.add(fol3);
        meshes.push(fol3);

        const fruits = [
          [0.65, 1.6, 0.5],
          [-0.7, 1.5, -0.4],
          [0.45, 2.2, -0.5],
          [-0.5, 2.15, 0.45],
          [0.1, 1.7, 0.85]
        ];
        const fruitMat = makeMat(0xff5722);
        for (const [fx, fy, fz] of fruits) {
          const fg = new THREE.SphereGeometry(0.08, 5, 4);
          fg.translate(fx, fy, fz);
          const fm = new THREE.Mesh(fg, fruitMat);
          group.add(fm);
          meshes.push(fm);
        }
        break;
      }

      case "bush": {
        const b1Geo = new THREE.SphereGeometry(0.55, 8, 6);
        b1Geo.translate(0, 0.4, 0);
        const b1 = new THREE.Mesh(b1Geo, makeMat(0x388e3c));
        group.add(b1);
        meshes.push(b1);

        const b2Geo = new THREE.SphereGeometry(0.42, 7, 5);
        b2Geo.translate(-0.38, 0.32, 0.1);
        const b2 = new THREE.Mesh(b2Geo, makeMat(0x43a047));
        group.add(b2);
        meshes.push(b2);

        const b3Geo = new THREE.SphereGeometry(0.45, 7, 5);
        b3Geo.translate(0.38, 0.35, -0.1);
        const b3 = new THREE.Mesh(b3Geo, makeMat(0x2e7d32));
        group.add(b3);
        meshes.push(b3);

        const berries = [
          [-0.2, 0.55, 0.35],
          [0.25, 0.58, 0.3],
          [-0.45, 0.45, 0.05],
          [0.45, 0.48, -0.05],
          [0.0, 0.65, -0.2]
        ];
        const berryMat = makeMat(0xe53935);
        for (const [bx, by, bz] of berries) {
          const bg = new THREE.SphereGeometry(0.065, 5, 4);
          bg.translate(bx, by, bz);
          const bm = new THREE.Mesh(bg, berryMat);
          group.add(bm);
          meshes.push(bm);
        }
        break;
      }

      case "flower": {
        const stemMat = makeMat(0x4caf50);
        const flowers = [
          { x: -0.25, z: 0.12, h: 0.38, color: 0xf44336, center: 0xffeb3b },
          { x: 0.22, z: -0.15, h: 0.45, color: 0xffc107, center: 0x795548 },
          { x: 0.05, z: 0.22, h: 0.34, color: 0xffffff, center: 0xfbc02d },
          { x: -0.12, z: -0.2, h: 0.3, color: 0xab47bc, center: 0xffeb3b }
        ];
        for (const f of flowers) {
          const stemGeo = new THREE.CylinderGeometry(0.025, 0.025, f.h, 5);
          stemGeo.translate(f.x, f.h / 2, f.z);
          const stem = new THREE.Mesh(stemGeo, stemMat);
          group.add(stem);
          meshes.push(stem);

          const petalGeo = new THREE.SphereGeometry(0.1, 6, 5);
          petalGeo.scale(1, 0.5, 1);
          petalGeo.translate(f.x, f.h, f.z);
          const petal = new THREE.Mesh(petalGeo, makeMat(f.color));
          group.add(petal);
          meshes.push(petal);

          const heartGeo = new THREE.SphereGeometry(0.045, 5, 4);
          heartGeo.translate(f.x, f.h + 0.03, f.z);
          const heart = new THREE.Mesh(heartGeo, makeMat(f.center));
          group.add(heart);
          meshes.push(heart);
        }
        break;
      }

      case "bird": {
        const birdColor =
          (obj.properties?.color as number | string) ||
          (obj.properties?.variant === "robin"
            ? 0xe53935
            : obj.properties?.variant === "bluebird"
            ? 0x0288d1
            : 0xfbc02d);
        const bodyMat = makeMat(birdColor);
        const bellyMat = makeMat(0xfff9c4);
        const beakMat = makeMat(0xff9800);
        const eyeMat = makeMat(0x111111);
        const legMat = makeMat(0xff9800);

        const bodyGeo = new THREE.SphereGeometry(0.16, 7, 6);
        bodyGeo.scale(1, 0.85, 1.3);
        bodyGeo.translate(0, 0.24, 0);
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        group.add(body);
        meshes.push(body);

        const bellyGeo = new THREE.SphereGeometry(0.13, 6, 5);
        bellyGeo.scale(0.9, 0.7, 1.0);
        bellyGeo.translate(0, 0.21, 0.05);
        const belly = new THREE.Mesh(bellyGeo, bellyMat);
        group.add(belly);
        meshes.push(belly);

        const headGeo = new THREE.SphereGeometry(0.11, 7, 6);
        headGeo.translate(0, 0.34, 0.16);
        const head = new THREE.Mesh(headGeo, bodyMat);
        group.add(head);
        meshes.push(head);

        const beakGeo = new THREE.ConeGeometry(0.04, 0.12, 5);
        beakGeo.rotateX(Math.PI / 2);
        beakGeo.translate(0, 0.34, 0.28);
        const beak = new THREE.Mesh(beakGeo, beakMat);
        group.add(beak);
        meshes.push(beak);

        const eyeLGeo = new THREE.SphereGeometry(0.02, 4, 4);
        eyeLGeo.translate(-0.08, 0.36, 0.2);
        const eyeL = new THREE.Mesh(eyeLGeo, eyeMat);
        group.add(eyeL);
        meshes.push(eyeL);

        const eyeRGeo = new THREE.SphereGeometry(0.02, 4, 4);
        eyeRGeo.translate(0.08, 0.36, 0.2);
        const eyeR = new THREE.Mesh(eyeRGeo, eyeMat);
        group.add(eyeR);
        meshes.push(eyeR);

        const wingLGeo = new THREE.BoxGeometry(0.03, 0.12, 0.22);
        const wingL = new THREE.Mesh(wingLGeo, bodyMat);
        wingL.position.set(-0.16, 0.24, -0.02);
        group.add(wingL);
        meshes.push(wingL);

        const wingRGeo = new THREE.BoxGeometry(0.03, 0.12, 0.22);
        const wingR = new THREE.Mesh(wingRGeo, bodyMat);
        wingR.position.set(0.16, 0.24, -0.02);
        group.add(wingR);
        meshes.push(wingR);

        wings = [wingL, wingR];

        const tailGeo = new THREE.BoxGeometry(0.08, 0.03, 0.16);
        tailGeo.rotateX(0.2);
        tailGeo.translate(0, 0.24, -0.22);
        const tail = new THREE.Mesh(tailGeo, bodyMat);
        group.add(tail);
        meshes.push(tail);

        const leg1Geo = new THREE.CylinderGeometry(0.02, 0.02, 0.14, 4);
        leg1Geo.translate(-0.06, 0.07, 0);
        const leg1 = new THREE.Mesh(leg1Geo, legMat);
        group.add(leg1);
        meshes.push(leg1);

        const leg2Geo = new THREE.CylinderGeometry(0.02, 0.02, 0.14, 4);
        leg2Geo.translate(0.06, 0.07, 0);
        const leg2 = new THREE.Mesh(leg2Geo, legMat);
        group.add(leg2);
        meshes.push(leg2);
        break;
      }

      case "fence": {
        const customFenceColor = (obj.properties?.color as string | number) || (obj.properties?.customColor as string | number);
        const postMat = makeMat(customFenceColor || 0x795548);
        const railMat = makeMat(customFenceColor || 0x8d6e63);

        const p1Geo = new THREE.BoxGeometry(0.16, 0.85, 0.16);
        p1Geo.translate(-1.4, 0.425, 0);
        const p1 = new THREE.Mesh(p1Geo, postMat);
        group.add(p1);
        meshes.push(p1);

        const p2Geo = new THREE.BoxGeometry(0.16, 0.85, 0.16);
        p2Geo.translate(1.4, 0.425, 0);
        const p2 = new THREE.Mesh(p2Geo, postMat);
        group.add(p2);
        meshes.push(p2);

        const r1Geo = new THREE.BoxGeometry(3.0, 0.1, 0.07);
        r1Geo.translate(0, 0.32, 0);
        const r1 = new THREE.Mesh(r1Geo, railMat);
        group.add(r1);
        meshes.push(r1);

        const r2Geo = new THREE.BoxGeometry(3.0, 0.1, 0.07);
        r2Geo.translate(0, 0.65, 0);
        const r2 = new THREE.Mesh(r2Geo, railMat);
        group.add(r2);
        meshes.push(r2);
        break;
      }

      case "firework_rocket": {
        const bodyColor = (obj.properties?.color as string | number) || (obj.properties?.customColor as string | number) || 0xe53935;
        const rocketMat = makeMat(bodyColor);
        const stickMat = makeMat(0xd7ccc8);
        const coneMat = makeMat(0xffeb3b);
        const fuseMat = makeMat(0x212121);

        // Guide wooden stick
        const stickGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 4);
        stickGeo.translate(0, 0.5, 0);
        const stick = new THREE.Mesh(stickGeo, stickMat);
        group.add(stick);
        meshes.push(stick);

        // Rocket body cylinder
        const tubeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8);
        tubeGeo.translate(0, 0.95, 0);
        const tube = new THREE.Mesh(tubeGeo, rocketMat);
        group.add(tube);
        meshes.push(tube);

        // Aerodynamic nose cone
        const coneGeo = new THREE.ConeGeometry(0.09, 0.22, 8);
        coneGeo.translate(0, 1.3, 0);
        const cone = new THREE.Mesh(coneGeo, coneMat);
        group.add(cone);
        meshes.push(cone);

        // Fuse cord
        const fuseGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.12, 4);
        fuseGeo.translate(0, 0.65, 0);
        const fuse = new THREE.Mesh(fuseGeo, fuseMat);
        group.add(fuse);
        meshes.push(fuse);
        break;
      }

      case "lantern": {
        const ironMat = makeMat(0x263238);
        const postMat = makeMat(0x37474f);

        const baseGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.2, 6);
        baseGeo.translate(0, 0.1, 0);
        const baseMesh = new THREE.Mesh(baseGeo, ironMat);
        group.add(baseMesh);
        meshes.push(baseMesh);

        const poleGeo = new THREE.CylinderGeometry(0.07, 0.07, 1.6, 6);
        poleGeo.translate(0, 0.9, 0);
        const poleMesh = new THREE.Mesh(poleGeo, postMat);
        group.add(poleMesh);
        meshes.push(poleMesh);

        const capGeo = new THREE.ConeGeometry(0.26, 0.2, 4);
        capGeo.rotateY(Math.PI / 4);
        capGeo.translate(0, 2.05, 0);
        const capMesh = new THREE.Mesh(capGeo, ironMat);
        group.add(capMesh);
        meshes.push(capMesh);

        const glassGeo = new THREE.BoxGeometry(0.22, 0.26, 0.22);
        glassGeo.translate(0, 1.82, 0);
        let glowMat: THREE.Material;
        if (quality === "low") {
          glowMat = new THREE.MeshLambertMaterial({
            color: 0xffd54f,
            emissive: new THREE.Color(0xffb300)
          });
        } else if (quality === "medium") {
          glowMat = new THREE.MeshPhongMaterial({
            color: 0xffd54f,
            emissive: new THREE.Color(0xffb300),
            shininess: 90
          });
        } else {
          glowMat = new THREE.MeshStandardMaterial({
            color: 0xffd54f,
            emissive: new THREE.Color(0xffb300),
            emissiveIntensity: 0.95,
            roughness: 0.2,
            metalness: 0.1
          });
        }
        glowMat.transparent = false;
        glowMat.depthWrite = true;
        glowMat.depthTest = true;
        const glassMesh = new THREE.Mesh(glassGeo, glowMat);
        group.add(glassMesh);
        meshes.push(glassMesh);
        break;
      }

      case "dia_sign": {
        const signW = 5.2;
        const signH = 2.4;
        const signThick = 0.16;

        // Sign housing box
        const frameMat = makeMat(0xd32f2f, 0.4, 0.2);
        const casingGeo = new THREE.BoxGeometry(signW + 0.12, signH + 0.12, signThick);
        casingGeo.translate(0, signH / 2, 0);
        const casingMesh = new THREE.Mesh(casingGeo, frameMat);
        group.add(casingMesh);
        meshes.push(casingMesh);

        // Sign face with authentic Supermercados DÍA % branding texture
        const diaTex = SpriteTextures.getDiaLogoTexture();
        const faceMat = diaTex ? new THREE.MeshBasicMaterial({ map: diaTex }) : new THREE.MeshBasicMaterial({ color: 0xd32f2f });

        const frontFaceGeo = new THREE.PlaneGeometry(signW, signH);
        frontFaceGeo.translate(0, signH / 2, signThick / 2 + 0.01);
        const frontFace = new THREE.Mesh(frontFaceGeo, faceMat);
        group.add(frontFace);
        meshes.push(frontFace);

        const backFaceGeo = new THREE.PlaneGeometry(signW, signH);
        backFaceGeo.rotateY(Math.PI);
        backFaceGeo.translate(0, signH / 2, -signThick / 2 - 0.01);
        const backFace = new THREE.Mesh(backFaceGeo, faceMat);
        group.add(backFace);
        meshes.push(backFace);

        // Supporting portal legs
        const poleMat = makeMat(0x37474f, 0.5, 0.6);
        const pole1Geo = new THREE.CylinderGeometry(0.06, 0.06, 3.8, 6);
        pole1Geo.translate(-signW / 2 + 0.2, -1.9 + signH / 2, 0);
        const pole1 = new THREE.Mesh(pole1Geo, poleMat);
        group.add(pole1);
        meshes.push(pole1);

        const pole2Geo = new THREE.CylinderGeometry(0.06, 0.06, 3.8, 6);
        pole2Geo.translate(signW / 2 - 0.2, -1.9 + signH / 2, 0);
        const pole2 = new THREE.Mesh(pole2Geo, poleMat);
        group.add(pole2);
        meshes.push(pole2);
        break;
      }

      case "town_hall": {
        const whiteWallMat = makeMat(0xf5f5f5, 0.8, 0.05);
        const graniteMat = makeMat(0x607d8b, 0.7, 0.1);
        const darkWoodMat = makeMat(0x3e2723, 0.85, 0.05);
        const ironMat = makeMat(0x212121, 0.6, 0.8);
        const roofMat = makeMat(0xbf360c, 0.7, 0.05);
        const flagRed = makeMat(0xd32f2f, 0.6, 0.05);
        const flagGold = makeMat(0xfbc02d, 0.6, 0.05);
        const bellMat = makeMat(0xffd54f, 0.3, 0.85);

        const bW = 22.0;
        const bH = 7.2;
        const bD = 6.0;

        // 1. Granite plinth foundation
        const plinthGeo = new THREE.BoxGeometry(bW + 0.4, 0.9, bD + 0.4);
        plinthGeo.translate(0, 0.45, 0);
        const plinthMesh = new THREE.Mesh(plinthGeo, graniteMat);
        group.add(plinthMesh);
        meshes.push(plinthMesh);

        // 2. Main Building Two-Story Facade Body
        const bodyGeo = new THREE.BoxGeometry(bW, bH, bD);
        bodyGeo.translate(0, bH / 2, 0);
        const bodyMesh = new THREE.Mesh(bodyGeo, whiteWallMat);
        group.add(bodyMesh);
        meshes.push(bodyMesh);

        // 3. Ground floor Porticoed Gallery (Soportales con columnas)
        const porticoDepth = 2.4;
        const colZ = bD / 2 + porticoDepth;
        const colXs = [-8.8, -5.3, -1.8, 1.8, 5.3, 8.8];
        for (const cx of colXs) {
          const colGeo = new THREE.CylinderGeometry(0.2, 0.24, 3.6, 8);
          colGeo.translate(cx, 1.8, colZ);
          const colMesh = new THREE.Mesh(colGeo, graniteMat);
          group.add(colMesh);
          meshes.push(colMesh);
        }

        // Portico upper architrave beam
        const beamGeo = new THREE.BoxGeometry(bW + 0.2, 0.5, porticoDepth + 0.4);
        beamGeo.translate(0, 3.65, bD / 2 + porticoDepth / 2);
        const beamMesh = new THREE.Mesh(beamGeo, graniteMat);
        group.add(beamMesh);
        meshes.push(beamMesh);

        // Ground-floor wooden main doors
        const doorGeo = new THREE.BoxGeometry(2.4, 2.7, 0.15);
        doorGeo.translate(0, 1.35, bD / 2 + 0.08);
        const doorMesh = new THREE.Mesh(doorGeo, darkWoodMat);
        group.add(doorMesh);
        meshes.push(doorMesh);

        // 4. Upper Floor Continuous Balcony (Balcón corrido del Ayuntamiento)
        const balconyGeo = new THREE.BoxGeometry(19.2, 0.2, 1.4);
        balconyGeo.translate(0, 3.9, bD / 2 + porticoDepth + 0.5);
        const balconyMesh = new THREE.Mesh(balconyGeo, graniteMat);
        group.add(balconyMesh);
        meshes.push(balconyMesh);

        // Wrought-iron railing
        const railGeo = new THREE.BoxGeometry(19.2, 0.85, 0.08);
        railGeo.translate(0, 4.42, bD / 2 + porticoDepth + 1.15);
        const railMesh = new THREE.Mesh(railGeo, ironMat);
        group.add(railMesh);
        meshes.push(railMesh);

        // Spanish flags draped over the balcony
        const flagWidth = 3.6;
        const fStrip1 = new THREE.Mesh(new THREE.BoxGeometry(flagWidth, 0.22, 0.02), flagRed);
        fStrip1.position.set(0, 4.65, bD / 2 + porticoDepth + 1.2);
        const fStrip2 = new THREE.Mesh(new THREE.BoxGeometry(flagWidth, 0.38, 0.02), flagGold);
        fStrip2.position.set(0, 4.35, bD / 2 + porticoDepth + 1.2);
        const fStrip3 = new THREE.Mesh(new THREE.BoxGeometry(flagWidth, 0.22, 0.02), flagRed);
        fStrip3.position.set(0, 4.05, bD / 2 + porticoDepth + 1.2);
        group.add(fStrip1, fStrip2, fStrip3);
        meshes.push(fStrip1, fStrip2, fStrip3);

        // 5 Balcony French windows
        const winXs = [-7.0, -3.5, 0.0, 3.5, 7.0];
        for (const wx of winXs) {
          const winGeo = new THREE.BoxGeometry(1.6, 2.4, 0.12);
          winGeo.translate(wx, 5.2, bD / 2 + 0.06);
          const winMesh = new THREE.Mesh(winGeo, darkWoodMat);
          group.add(winMesh);
          meshes.push(winMesh);
        }

        // 5. Traditional Terracotta Hip Roof
        const roofGeo = new THREE.ConeGeometry((bW + 2.0) * 0.65, 2.6, 4);
        roofGeo.rotateY(Math.PI / 4);
        roofGeo.scale(1.2, 1, 0.65);
        roofGeo.translate(0, bH + 1.3, 0);
        const roofMesh = new THREE.Mesh(roofGeo, roofMat);
        group.add(roofMesh);
        meshes.push(roofMesh);

        // 6. Central Pediment / Frontón with the Historic Clock
        const pedimentGeo = new THREE.BoxGeometry(7.0, 2.0, 0.8);
        pedimentGeo.translate(0, bH + 1.0, bD / 2 - 0.2);
        const pedimentMesh = new THREE.Mesh(pedimentGeo, whiteWallMat);
        group.add(pedimentMesh);
        meshes.push(pedimentMesh);

        // Circular Clock Dial
        const clockDialGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.12, 24);
        clockDialGeo.rotateX(Math.PI / 2);
        clockDialGeo.translate(0, bH + 1.1, bD / 2 + 0.25);
        const clockDial = new THREE.Mesh(clockDialGeo, makeMat(0xffffff, 0.2, 0.1));
        group.add(clockDial);
        meshes.push(clockDial);

        const clockRimGeo = new THREE.TorusGeometry(0.85, 0.07, 8, 24);
        clockRimGeo.translate(0, bH + 1.1, bD / 2 + 0.31);
        const clockRim = new THREE.Mesh(clockRimGeo, ironMat);
        group.add(clockRim);
        meshes.push(clockRim);

        // Clock hands pointing to 12:00
        const handHGeo = new THREE.BoxGeometry(0.06, 0.45, 0.02);
        handHGeo.translate(0, bH + 1.25, bD / 2 + 0.33);
        const handH = new THREE.Mesh(handHGeo, ironMat);
        group.add(handH);
        meshes.push(handH);

        const handMGeo = new THREE.BoxGeometry(0.04, 0.65, 0.02);
        handMGeo.translate(0, bH + 1.35, bD / 2 + 0.33);
        const handM = new THREE.Mesh(handMGeo, ironMat);
        group.add(handM);
        meshes.push(handM);

        // 7. Wrought-Iron Espadaña / Bell Tower with Bronze Bell
        const espCol1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.2, 0.3), graniteMat);
        espCol1.position.set(-0.8, bH + 2.9, bD / 2 - 0.2);
        const espCol2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.2, 0.3), graniteMat);
        espCol2.position.set(0.8, bH + 2.9, bD / 2 - 0.2);
        const espArch = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.35, 0.35), graniteMat);
        espArch.position.set(0, bH + 4.1, bD / 2 - 0.2);
        group.add(espCol1, espCol2, espArch);
        meshes.push(espCol1, espCol2, espArch);

        // Bronze Bell
        const bellGeo = new THREE.CylinderGeometry(0.2, 0.4, 0.55, 12);
        bellGeo.translate(0, bH + 3.2, bD / 2 - 0.2);
        const bellMesh = new THREE.Mesh(bellGeo, bellMat);
        group.add(bellMesh);
        meshes.push(bellMesh);

        // Iron Cross at Pinnacle
        const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.75, 0.06), ironMat);
        crossV.position.set(0, bH + 4.6, bD / 2 - 0.2);
        const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.06, 0.06), ironMat);
        crossH.position.set(0, bH + 4.75, bD / 2 - 0.2);
        group.add(crossV, crossH);
        meshes.push(crossV, crossH);
        break;
      }

      case "bench": {
        const ironMat = makeMat(0x1b5e20, 0.5, 0.7);
        const woodMat = makeMat(0x8d6e63, 0.7, 0.1);

        const bW = 2.2;
        // Iron legs
        const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.65), ironMat);
        leg1.position.set(-bW / 2 + 0.2, 0.275, 0);
        const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.65), ironMat);
        leg2.position.set(bW / 2 - 0.2, 0.275, 0);
        group.add(leg1, leg2);
        meshes.push(leg1, leg2);

        // Seat wood slats
        for (let i = 0; i < 3; i++) {
          const slat = new THREE.Mesh(new THREE.BoxGeometry(bW, 0.05, 0.16), woodMat);
          slat.position.set(0, 0.52, -0.2 + i * 0.2);
          group.add(slat);
          meshes.push(slat);
        }

        // Backrest wood slats
        for (let i = 0; i < 2; i++) {
          const backSlat = new THREE.Mesh(new THREE.BoxGeometry(bW, 0.14, 0.05), woodMat);
          backSlat.position.set(0, 0.72 + i * 0.18, -0.28);
          group.add(backSlat);
          meshes.push(backSlat);
        }
        break;
      }

      case "palm_tree": {
        const trunkMat = makeMat(0x6d4c41, 0.85, 0.05);
        const leafMat = makeMat(0x2e7d32, 0.6, 0.05);
        const nutMat = makeMat(0x33691e, 0.7, 0.05);

        // Segmented organic curved trunk
        const segments = 5;
        let curY = 0;
        let curX = 0;
        const lean = (Math.random() - 0.5) * 0.15;
        for (let i = 0; i < segments; i++) {
          const segH = 0.75;
          const rBase = 0.28 - i * 0.02;
          const rTop = 0.26 - i * 0.02;
          const segGeo = new THREE.CylinderGeometry(rTop, rBase, segH, 8);
          segGeo.translate(0, segH / 2, 0);
          const segMesh = new THREE.Mesh(segGeo, trunkMat);
          segMesh.position.set(curX, curY, 0);
          segMesh.rotation.z = lean * (i + 1) * 0.2;
          group.add(segMesh);
          meshes.push(segMesh);
          curY += segH;
          curX += lean * 0.15;
        }

        // Coconuts at crown
        for (let a = 0; a < 4; a++) {
          const nutGeo = new THREE.SphereGeometry(0.15, 6, 6);
          const nAngle = (a * Math.PI) / 2;
          nutGeo.translate(curX + Math.cos(nAngle) * 0.22, curY - 0.1, Math.sin(nAngle) * 0.22);
          const nutMesh = new THREE.Mesh(nutGeo, nutMat);
          group.add(nutMesh);
          meshes.push(nutMesh);
        }

        // 7 Arching palm fronds (single continuous tapered geometry - zero loose floating leaves!)
        for (let f = 0; f < 7; f++) {
          const fAngle = (f * Math.PI * 2) / 7;
          const frondHolder = new THREE.Group();
          frondHolder.position.set(curX, curY + 0.1, 0);
          frondHolder.rotation.y = fAngle;

          // Arched palm leaf blade tapering naturally from crown to tip
          const leafLen = 2.6;
          const leafGeo = new THREE.ConeGeometry(0.55, leafLen, 4);
          leafGeo.rotateX(Math.PI / 2);
          leafGeo.scale(1, 0.08, 1);
          leafGeo.translate(0, 0, leafLen / 2);
          const leafMesh = new THREE.Mesh(leafGeo, leafMat);
          leafMesh.rotation.x = -0.42; // graceful natural downward arch
          frondHolder.add(leafMesh);

          group.add(frondHolder);
          meshes.push(leafMesh);
        }
        break;
      }

      case "seashell": {
        const shellMat = makeMat(0xffe0b2, 0.35, 0.1);
        const rimMat = makeMat(0xffccbc, 0.4, 0.05);

        // Fluted scallop fan shape
        const shellBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.12, 0.08, 12), shellMat);
        shellBase.scale.set(1.1, 1, 0.85);
        shellBase.position.y = 0.04;
        group.add(shellBase);
        meshes.push(shellBase);

        // Radial ridges
        for (let r = -3; r <= 3; r++) {
          const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.32), rimMat);
          ridge.rotation.y = r * 0.22;
          ridge.position.set(r * 0.06, 0.06, 0.05);
          group.add(ridge);
          meshes.push(ridge);
        }
        break;
      }

      case "lifeguard_chair": {
        const whiteMat = makeMat(0xf5f5f5, 0.6, 0.1);
        const redMat = makeMat(0xd32f2f, 0.5, 0.1);
        const woodMat = makeMat(0x8d6e63, 0.8, 0.05);

        const cH = 2.6;
        // 4 Angled legs
        for (const [lx, lz] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]]) {
          const legGeo = new THREE.CylinderGeometry(0.04, 0.05, cH, 6);
          legGeo.translate(lx * 1.1, cH / 2, lz * 1.1);
          const legMesh = new THREE.Mesh(legGeo, whiteMat);
          group.add(legMesh);
          meshes.push(legMesh);
        }

        // Ladder rungs
        for (let y = 0.5; y < cH; y += 0.5) {
          const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 6), redMat);
          rung.rotation.z = Math.PI / 2;
          rung.position.set(0, y, -0.55);
          group.add(rung);
          meshes.push(rung);
        }

        // High watch platform
        const platform = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 1.2), woodMat);
        platform.position.y = cH;
        group.add(platform);
        meshes.push(platform);

        // Seat & backrest
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.7), whiteMat);
        seat.position.set(0, cH + 0.45, 0);
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.08), whiteMat);
        back.position.set(0, cH + 0.8, 0.35);
        group.add(seat, back);
        meshes.push(seat, back);

        // Lifebuoy ring hanging on the side
        const ringGeo = new THREE.TorusGeometry(0.3, 0.08, 8, 16);
        ringGeo.rotateY(Math.PI / 2);
        ringGeo.translate(0.65, cH - 0.4, 0);
        const lifebuoy = new THREE.Mesh(ringGeo, redMat);
        group.add(lifebuoy);
        meshes.push(lifebuoy);

        // Sun canopy overhead
        const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.4, 8), redMat);
        canopy.position.set(0, cH + 1.8, 0);
        const canopyPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6), whiteMat);
        canopyPole.position.set(0, cH + 1.1, 0.35);
        group.add(canopy, canopyPole);
        meshes.push(canopy, canopyPole);
        break;
      }

      case "beach_umbrella": {
        const poleMat = makeMat(0xf5f5f5, 0.5, 0.3);
        const canopyMat1 = makeMat(0x00bcd4, 0.5, 0.1);
        const canopyMat2 = makeMat(0xfff9c4, 0.5, 0.1);

        // Heavy round base
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.08, 12), poleMat);
        base.position.y = 0.04;
        group.add(base);
        meshes.push(base);

        // Pole
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.5, 6), poleMat);
        pole.position.y = 1.25;
        group.add(pole);
        meshes.push(pole);

        // Striped 8-panel parasol canopy
        const canopy1 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 0.55, 8), canopyMat1);
        canopy1.position.y = 2.45;
        group.add(canopy1);
        meshes.push(canopy1);

        const canopy2 = new THREE.Mesh(new THREE.ConeGeometry(1.52, 0.53, 4), canopyMat2);
        canopy2.position.y = 2.44;
        group.add(canopy2);
        meshes.push(canopy2);
        break;
      }

      case "float_ring": {
        const ringMat = makeMat(0xd32f2f, 0.4, 0.2);
        const whiteMat = makeMat(0xffffff, 0.4, 0.2);

        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.18, 10, 20), ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.18;
        group.add(ring);
        meshes.push(ring);

        // 4 White safety strap accents
        for (let s = 0; s < 4; s++) {
          const strap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.14, 8), whiteMat);
          const sAngle = (s * Math.PI) / 2;
          strap.position.set(Math.cos(sAngle) * 0.55, 0.18, Math.sin(sAngle) * 0.55);
          group.add(strap);
          meshes.push(strap);
        }
        break;
      }

      case "sunbed": {
        const frameMat = makeMat(0xf5f5f5, 0.6, 0.1);
        const towelMat = makeMat(0x0288d1, 0.7, 0.05);

        // Lounger frame
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.35, 2.2), frameMat);
        frame.position.y = 0.175;
        group.add(frame);
        meshes.push(frame);

        // Reclined backrest
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.08, 0.9), frameMat);
        back.position.set(0, 0.55, -0.7);
        back.rotation.x = -0.55;
        group.add(back);
        meshes.push(back);

        // Blue resort towel draped on bed
        const towel = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.04, 1.8), towelMat);
        towel.position.set(0, 0.37, 0.1);
        group.add(towel);
        meshes.push(towel);
        break;
      }

      case "plush_bear": {
        const furMat = makeMat(0x8d5b4c, 0.85, 0.0);
        const snoutMat = makeMat(0xd7ccc8, 0.85, 0.0);
        const noseMat = makeMat(0x212121, 0.3, 0.1);
        const innerEarMat = makeMat(0xf48fb1, 0.85, 0.0);
        const bowMat = makeMat(0xe53935, 0.5, 0.1);

        // Body / Torso
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 10), furMat);
        body.scale.set(1.0, 1.25, 0.9);
        body.position.y = 0.35;
        group.add(body);
        meshes.push(body);

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), furMat);
        head.position.y = 0.65;
        group.add(head);
        meshes.push(head);

        // Snout
        const snout = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), snoutMat);
        snout.scale.set(1.1, 0.8, 1.0);
        snout.position.set(0, 0.63, 0.17);
        group.add(snout);
        meshes.push(snout);

        // Nose
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), noseMat);
        nose.position.set(0, 0.67, 0.24);
        group.add(nose);
        meshes.push(nose);

        // Eyes & Ears & Limbs
        for (const side of [-1, 1]) {
          const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), noseMat);
          eye.position.set(side * 0.08, 0.7, 0.18);
          group.add(eye);
          meshes.push(eye);

          // Ears
          const ear = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), furMat);
          ear.position.set(side * 0.16, 0.82, 0.02);
          const innerEar = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), innerEarMat);
          innerEar.position.set(side * 0.16, 0.82, 0.06);
          group.add(ear, innerEar);
          meshes.push(ear, innerEar);

          // Arms
          const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.25, 8), furMat);
          arm.position.set(side * 0.25, 0.42, 0.08);
          arm.rotation.z = -side * 0.4;
          group.add(arm);
          meshes.push(arm);

          // Feet
          const foot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), furMat);
          foot.scale.set(0.9, 0.7, 1.3);
          foot.position.set(side * 0.18, 0.1, 0.16);
          group.add(foot);
          meshes.push(foot);
        }

        // Red bow tie
        const bowCenter = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), bowMat);
        bowCenter.position.set(0, 0.52, 0.2);
        const bowLeft = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 6), bowMat);
        bowLeft.position.set(-0.07, 0.52, 0.2);
        bowLeft.rotation.z = Math.PI / 2;
        const bowRight = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 6), bowMat);
        bowRight.position.set(0.07, 0.52, 0.2);
        bowRight.rotation.z = -Math.PI / 2;
        group.add(bowCenter, bowLeft, bowRight);
        meshes.push(bowCenter, bowLeft, bowRight);
        break;
      }

      case "jewelry_bust": {
        const pedMat = makeMat(0x1a1a1a, 0.4, 0.3);
        const velvetMat = makeMat(0x212121, 0.9, 0.0);
        const goldMat = makeMat(0xffd700, 0.25, 0.85);
        const rubyMat = makeMat(0xd50000, 0.15, 0.9);

        // Circular pedestal base
        const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.08, 16), pedMat);
        pedestal.position.y = 0.04;
        group.add(pedestal);
        meshes.push(pedestal);

        // Chrome/brass stand stem
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.22, 10), goldMat);
        stem.position.y = 0.18;
        group.add(stem);
        meshes.push(stem);

        // Black velvet mannequin bust (shoulders & chest)
        const bustBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 0.4, 12), velvetMat);
        bustBody.position.y = 0.48;
        bustBody.scale.set(1.3, 1.0, 0.7);
        group.add(bustBody);
        meshes.push(bustBody);

        // Neck
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.22, 12), velvetMat);
        neck.position.y = 0.74;
        neck.scale.set(1.0, 1.0, 0.85);
        group.add(neck);
        meshes.push(neck);

        // Golden luxury necklace draped around neck
        const necklace = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 8, 20), goldMat);
        necklace.position.set(0, 0.65, 0.04);
        necklace.rotation.x = 0.45;
        group.add(necklace);
        meshes.push(necklace);

        // Ruby gemstone pendant
        const ruby = new THREE.Mesh(new THREE.OctahedronGeometry(0.05, 0), rubyMat);
        ruby.position.set(0, 0.52, 0.18);
        ruby.rotation.y = Math.PI / 4;
        group.add(ruby);
        meshes.push(ruby);

        // Velvet ring box beside pedestal
        const ringBox = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.12), velvetMat);
        ringBox.position.set(0.24, 0.04, 0.15);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.008, 6, 12), goldMat);
        ring.position.set(0.24, 0.09, 0.15);
        ring.rotation.x = Math.PI / 2;
        group.add(ringBox, ring);
        meshes.push(ringBox, ring);
        break;
      }

      case "store_shelf": {
        const frameMat = makeMat(0x5d4037, 0.6, 0.1);
        const woodMat = makeMat(0xd7ccc8, 0.7, 0.05);
        const foldMat1 = makeMat(0xff7043, 0.8, 0.0);
        const foldMat2 = makeMat(0x42a5f5, 0.8, 0.0);
        const jarMat = makeMat(0x80deea, 0.2, 0.3);
        const goldCap = makeMat(0xffb300, 0.3, 0.7);

        // 4 Vertical wooden corner pillars
        for (const sx of [-0.6, 0.6]) {
          for (const sz of [-0.35, 0.35]) {
            const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.5, 0.08), frameMat);
            pillar.position.set(sx, 0.75, sz);
            group.add(pillar);
            meshes.push(pillar);
          }
        }

        // 3 Shelf boards
        const shelfHeights = [0.25, 0.75, 1.25];
        shelfHeights.forEach(y => {
          const plank = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.05, 0.76), woodMat);
          plank.position.y = y;
          group.add(plank);
          meshes.push(plank);
        });

        // Bottom shelf: stacks of folded clothes
        for (let i = 0; i < 3; i++) {
          const mat = i % 2 === 0 ? foldMat1 : foldMat2;
          const stack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.4), mat);
          stack.position.set(-0.35 + i * 0.35, 0.37, 0);
          group.add(stack);
          meshes.push(stack);
        }

        // Middle shelf: 4 Glass perfume/cosmetic bottles with gold caps
        for (let j = 0; j < 4; j++) {
          const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 10), jarMat);
          bottle.position.set(-0.45 + j * 0.3, 0.88, 0);
          const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 8), goldCap);
          cap.position.set(-0.45 + j * 0.3, 1.01, 0);
          group.add(bottle, cap);
          meshes.push(bottle, cap);
        }

        // Top shelf: Gift boxes with bows
        for (let k = 0; k < 2; k++) {
          const boxMat = k === 0 ? foldMat2 : foldMat1;
          const box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.3), boxMat);
          box.position.set(-0.25 + k * 0.5, 1.39, 0);
          group.add(box);
          meshes.push(box);
        }
        break;
      }

      case "surf_rack": {
        const woodMat = makeMat(0x6d4c41, 0.7, 0.1);
        const boardMat1 = makeMat(0x00e5ff, 0.35, 0.2);
        const stripeMat1 = makeMat(0xffeb3b, 0.4, 0.1);
        const boardMat2 = makeMat(0xff4081, 0.35, 0.2);
        const stripeMat2 = makeMat(0xffffff, 0.4, 0.1);

        // Rack frame: base beam and 2 side upright A-arms
        const baseBeam = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 0.7), woodMat);
        baseBeam.position.y = 0.05;
        group.add(baseBeam);
        meshes.push(baseBeam);

        for (const sx of [-0.48, 0.48]) {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.6, 0.08), woodMat);
          post.position.set(sx, 0.85, 0);
          group.add(post);
          meshes.push(post);
        }
        const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.08, 0.08), woodMat);
        crossBeam.position.set(0, 1.35, 0);
        group.add(crossBeam);
        meshes.push(crossBeam);

        // Surfboard 1 (Cyan & Yellow stripes)
        const board1 = new THREE.Group();
        const bMesh1 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 2.0, 0.08), boardMat1);
        bMesh1.scale.set(1.0, 1.0, 0.8);
        const stripe1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.98, 0.09), stripeMat1);
        const noseCone1 = new THREE.Mesh(new THREE.ConeGeometry(0.21, 0.35, 4), boardMat1);
        noseCone1.position.y = 1.05;
        noseCone1.scale.set(1.0, 1.0, 0.3);
        board1.add(bMesh1, stripe1, noseCone1);
        meshes.push(bMesh1, stripe1, noseCone1);
        board1.position.set(-0.2, 1.05, -0.05);
        board1.rotation.set(0.1, 0.15, -0.08);
        group.add(board1);

        // Surfboard 2 (Coral Pink & White stripes)
        const board2 = new THREE.Group();
        const bMesh2 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.85, 0.08), boardMat2);
        const stripe2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.83, 0.09), stripeMat2);
        const noseCone2 = new THREE.Mesh(new THREE.ConeGeometry(0.21, 0.32, 4), boardMat2);
        noseCone2.position.y = 0.98;
        noseCone2.scale.set(1.0, 1.0, 0.3);
        board2.add(bMesh2, stripe2, noseCone2);
        meshes.push(bMesh2, stripe2, noseCone2);
        board2.position.set(0.22, 0.98, 0.08);
        board2.rotation.set(-0.08, -0.2, 0.06);
        group.add(board2);
        break;
      }

      case "arcade_cabinet": {
        const bodyMat = makeMat(0x1a1a24, 0.4, 0.1);
        const screenMat = makeMat(0x00e676, 0.2, 0.3); // Bright retro CRT green screen
        const marqueeMat = makeMat(0xff1744, 0.3, 0.4);
        const deskMat = makeMat(0x263238, 0.5, 0.2);
        const stickMat = makeMat(0xd50000, 0.3, 0.7);
        const coinMat = makeMat(0xffa000, 0.3, 0.6);

        // Lower body pedestal
        const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.88, 0.8), bodyMat);
        lowerBody.position.set(0, 0.44, 0);
        group.add(lowerBody);
        meshes.push(lowerBody);

        // Control desk (angled outward)
        const desk = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.12, 0.36), deskMat);
        desk.position.set(0, 0.9, 0.32);
        desk.rotation.x = 0.15;
        group.add(desk);
        meshes.push(desk);

        // Joystick
        const stickStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.1, 6), makeMat(0xcccccc, 0.2, 0.8));
        stickStem.position.set(-0.2, 0.98, 0.32);
        const stickBall = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), stickMat);
        stickBall.position.set(-0.2, 1.04, 0.32);
        group.add(stickStem, stickBall);
        meshes.push(stickStem, stickBall);

        // 4 Action arcade buttons
        const buttonColors = [0x00e5ff, 0xffeb3b, 0xff1744, 0x76ff03];
        buttonColors.forEach((col, idx) => {
          const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.03, 8), makeMat(col, 0.3, 0.5));
          const bx = 0.05 + (idx % 2) * 0.09;
          const bz = 0.28 + Math.floor(idx / 2) * 0.08;
          btn.position.set(bx, 0.96, bz);
          group.add(btn);
          meshes.push(btn);
        });

        // Upper cabinet housing
        const upperHousing = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.86, 0.75), bodyMat);
        upperHousing.position.set(0, 1.34, -0.02);
        group.add(upperHousing);
        meshes.push(upperHousing);

        // Angled CRT Screen
        const screen = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.48, 0.04), screenMat);
        screen.position.set(0, 1.3, 0.26);
        screen.rotation.x = -0.22;
        group.add(screen);
        meshes.push(screen);

        // Illuminated Marquee sign on top
        const marquee = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.2, 0.2), marqueeMat);
        marquee.position.set(0, 1.68, 0.28);
        group.add(marquee);
        meshes.push(marquee);

        // Coin door (twin slots)
        const coinDoor = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.42, 0.03), makeMat(0x37474f, 0.5, 0.4));
        coinDoor.position.set(0, 0.45, 0.41);
        const slot1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.02), coinMat);
        slot1.position.set(-0.08, 0.52, 0.43);
        const slot2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.02), coinMat);
        slot2.position.set(0.08, 0.52, 0.43);
        group.add(coinDoor, slot1, slot2);
        meshes.push(coinDoor, slot1, slot2);
        break;
      }

      case "gelato_display": {
        const baseMat = makeMat(0xf5f5f5, 0.3, 0.4);
        const metalMat = makeMat(0xb0bec5, 0.3, 0.7);
        const glassMat = makeMat(0x80deea, 0.1, 0.2);
        const coneMat = makeMat(0xffb74d, 0.7, 0.0);

        // Insulated counter base
        const base = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.65, 0.95), baseMat);
        base.position.y = 0.325;
        group.add(base);
        meshes.push(base);

        // Glass display case upper hood
        const glass = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 0.88), glassMat);
        glass.position.set(0, 0.85, 0);
        group.add(glass);
        meshes.push(glass);

        // 4 Stainless tubs of gelato scoops inside
        const flavors = [
          { name: "pistachio", col: 0x81c784 },
          { name: "strawberry", col: 0xf06292 },
          { name: "chocolate", col: 0x4e342e },
          { name: "vanilla", col: 0xfff9c4 }
        ];
        flavors.forEach((f, idx) => {
          const tub = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.32), metalMat);
          const tx = -0.48 + idx * 0.32;
          tub.position.set(tx, 0.72, 0);
          const scoop = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), makeMat(f.col, 0.6, 0.0));
          scoop.scale.set(1.1, 0.8, 1.2);
          scoop.position.set(tx, 0.82, 0);
          group.add(tub, scoop);
          meshes.push(tub, scoop);
        });

        // Waffle cones holder on corner
        for (let c = 0; c < 3; c++) {
          const cone = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 6), coneMat);
          cone.rotation.x = Math.PI;
          cone.position.set(0.68, 0.72 + c * 0.06, 0.3);
          group.add(cone);
          meshes.push(cone);
        }
        break;
      }

      case "bakery_counter": {
        const woodMat = makeMat(0x4e342e, 0.6, 0.1);
        const graniteMat = makeMat(0x37474f, 0.3, 0.3);
        const chromeMat = makeMat(0xdcdcdc, 0.15, 0.85);
        const pastryMat = makeMat(0xffb74d, 0.5, 0.0);
        const cupMat = makeMat(0xffffff, 0.2, 0.1);

        // Counter base with dark wood
        const counter = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.82, 0.85), woodMat);
        counter.position.y = 0.41;
        group.add(counter);
        meshes.push(counter);

        // Polished granite countertop
        const topSlab = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.9), graniteMat);
        topSlab.position.y = 0.84;
        group.add(topSlab);
        meshes.push(topSlab);

        // Chrome dual-group espresso machine
        const espresso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.4), chromeMat);
        espresso.position.set(-0.35, 1.04, 0);
        group.add(espresso);
        meshes.push(espresso);

        // 2 Coffee cups on saucers
        for (const cx of [-0.42, -0.28]) {
          const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.06, 8), cupMat);
          cup.position.set(cx, 1.24, 0);
          group.add(cup);
          meshes.push(cup);
        }

        // Pastry cloche / glass dome
        const clocheGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.2, 12), makeMat(0x80deea, 0.1, 0.2));
        clocheGlass.position.set(0.35, 0.96, 0);
        // Golden croissants inside
        for (const cy of [-0.06, 0.06]) {
          const croissant = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.025, 6, 10, Math.PI * 1.3), pastryMat);
          croissant.rotation.x = Math.PI / 2;
          croissant.position.set(0.35 + cy, 0.88, 0);
          group.add(croissant);
          meshes.push(croissant);
        }
        group.add(clocheGlass);
        meshes.push(clocheGlass);
        break;
      }

      case "fashion_mannequin": {
        const standMat = makeMat(0xcfd8dc, 0.2, 0.8);
        const fabricMat = makeMat(0x00bcd4, 0.7, 0.0);
        const strawMat = makeMat(0xd7ccc8, 0.8, 0.0);
        const beltMat = makeMat(0xffb300, 0.3, 0.7);

        // Circular floor stand
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.04, 16), standMat);
        base.position.y = 0.02;
        group.add(base);
        meshes.push(base);

        // Chrome pole
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.1, 8), standMat);
        pole.position.y = 0.58;
        group.add(pole);
        meshes.push(pole);

        // Mannequin torso & dress
        const dressSkirt = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.65, 12), fabricMat);
        dressSkirt.position.y = 1.05;
        dressSkirt.scale.set(1.0, 1.0, 0.8);
        const dressTop = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.45, 12), fabricMat);
        dressTop.position.y = 1.4;
        dressTop.scale.set(1.15, 1.0, 0.75);
        group.add(dressSkirt, dressTop);
        meshes.push(dressSkirt, dressTop);

        // Gold waist belt
        const belt = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 8, 16), beltMat);
        belt.position.set(0, 1.25, 0);
        belt.scale.set(1.1, 0.75, 1.0);
        group.add(belt);
        meshes.push(belt);

        // Chic wide-brim sun hat on top
        const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.03, 16), strawMat);
        hatBrim.position.set(0, 1.7, 0);
        hatBrim.rotation.z = -0.12;
        const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.12, 12), strawMat);
        hatCrown.position.set(0, 1.76, 0);
        hatCrown.rotation.z = -0.12;
        group.add(hatBrim, hatCrown);
        meshes.push(hatBrim, hatCrown);
        break;
      }

      case "sneaker_rack": {
        const frameMat = makeMat(0x212121, 0.4, 0.6);
        const metalShelf = makeMat(0x37474f, 0.5, 0.4);
        const redSneaker = makeMat(0xd50000, 0.6, 0.1);
        const voltSneaker = makeMat(0x76ff03, 0.5, 0.2);
        const soleMat = makeMat(0xffffff, 0.3, 0.05);
        const boxMat1 = makeMat(0xff6d00, 0.7, 0.0);
        const boxMat2 = makeMat(0x00b0ff, 0.7, 0.0);

        // Side ladder frame
        for (const sx of [-0.55, 0.55]) {
          const sideFrame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.35, 0.65), frameMat);
          sideFrame.position.set(sx, 0.68, 0);
          group.add(sideFrame);
          meshes.push(sideFrame);
        }

        // 3 Tilted display shelves
        const rackY = [0.25, 0.68, 1.1];
        rackY.forEach(y => {
          const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.04, 0.6), metalShelf);
          shelf.position.set(0, y, 0);
          shelf.rotation.x = 0.18;
          group.add(shelf);
          meshes.push(shelf);
        });

        // Top shelf sneakers (Red & White retro)
        for (const side of [-0.25, 0.25]) {
          const sneakerUpper = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.28), redSneaker);
          sneakerUpper.position.set(side, 1.22, 0);
          sneakerUpper.rotation.x = 0.18;
          const sole = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.29), soleMat);
          sole.position.set(side, 1.16, 0);
          sole.rotation.x = 0.18;
          group.add(sneakerUpper, sole);
          meshes.push(sneakerUpper, sole);
        }

        // Middle shelf sneakers (Neon Volt green runners)
        for (const side of [-0.25, 0.25]) {
          const sneakerUpper = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.28), voltSneaker);
          sneakerUpper.position.set(side, 0.8, 0);
          sneakerUpper.rotation.x = 0.18;
          const sole = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.29), soleMat);
          sole.position.set(side, 0.74, 0);
          sole.rotation.x = 0.18;
          group.add(sneakerUpper, sole);
          meshes.push(sneakerUpper, sole);
        }

        // Bottom shelf: 2 Stacked branded shoeboxes
        const box1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.45), boxMat1);
        box1.position.set(-0.22, 0.35, 0);
        box1.rotation.x = 0.18;
        const box2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.45), boxMat2);
        box2.position.set(0.22, 0.35, 0);
        box2.rotation.x = 0.18;
        group.add(box1, box2);
        meshes.push(box1, box2);
        break;
      }

      case "checkout_counter": {
        const deskMat = makeMat(0x3e2723, 0.6, 0.1);
        const topMat = makeMat(0xefebe9, 0.4, 0.2);
        const screenMat = makeMat(0x212121, 0.3, 0.5);
        const posMat = makeMat(0x0277bd, 0.4, 0.3);
        const brassMat = makeMat(0xffd54f, 0.25, 0.8);

        // Counter desk
        const desk = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.82, 0.9), deskMat);
        desk.position.y = 0.41;
        group.add(desk);
        meshes.push(desk);

        // Desk top counter
        const topPlank = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.95), topMat);
        topPlank.position.y = 0.84;
        group.add(topPlank);
        meshes.push(topPlank);

        // Touchscreen POS terminal
        const posStem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.16, 8), screenMat);
        posStem.position.set(-0.25, 0.94, 0.05);
        const posScreen = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.04), screenMat);
        posScreen.position.set(-0.25, 1.08, 0.05);
        posScreen.rotation.x = -0.25;
        group.add(posStem, posScreen);
        meshes.push(posStem, posScreen);

        // Card reader pinpad terminal facing client
        const pinpad = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.18), posMat);
        pinpad.position.set(0.25, 0.89, 0.25);
        pinpad.rotation.x = 0.25;
        group.add(pinpad);
        meshes.push(pinpad);

        // Brass customer counter bell
        const bellBase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.03, 10), screenMat);
        bellBase.position.set(0.38, 0.88, -0.2);
        const bellDome = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), brassMat);
        bellDome.position.set(0.38, 0.91, -0.2);
        group.add(bellBase, bellDome);
        meshes.push(bellBase, bellDome);
        break;
      }

      // =======================================================================
      // WORLD 3 (MESEGAL, PINOFRANQUEADO, LAS HURDES) AUTHENTIC VILLAGE DECORATIONS
      // =======================================================================
      case "village_stones": {
        const stoneMat1 = makeMat(0x607d8b, 0.7, 0.1);
        const stoneMat2 = makeMat(0x455a64, 0.75, 0.1);
        const stoneMat3 = makeMat(0x78909c, 0.65, 0.1);
        const pebbleOffsets = [
          { x: 0, z: 0, r: 0.28, ry: 0.4, m: stoneMat1 },
          { x: -0.35, z: 0.2, r: 0.18, ry: 1.2, m: stoneMat2 },
          { x: 0.32, z: -0.22, r: 0.22, ry: -0.6, m: stoneMat3 },
          { x: 0.28, z: 0.32, r: 0.14, ry: 0.8, m: stoneMat1 },
          { x: -0.26, z: -0.28, r: 0.16, ry: -1.1, m: stoneMat2 }
        ];
        pebbleOffsets.forEach(p => {
          const pGeo = new THREE.DodecahedronGeometry(p.r, 0);
          pGeo.scale(1.2, 0.6, 1.0);
          const pMesh = new THREE.Mesh(pGeo, p.m);
          pMesh.position.set(p.x, p.r * 0.4, p.z);
          pMesh.rotation.y = p.ry;
          group.add(pMesh);
          meshes.push(pMesh);
        });
        break;
      }

      case "moss_patch": {
        const mossMat1 = makeMat(0x2e7d32, 0.85, 0.0);
        const mossMat2 = makeMat(0x388e3c, 0.8, 0.0);
        const sproutMat = makeMat(0x7cb342, 0.7, 0.0);
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          const dist = 0.22 + (i % 2) * 0.15;
          const mGeo = new THREE.SphereGeometry(0.24 + (i % 3) * 0.08, 6, 5);
          mGeo.scale(1.3, 0.35, 1.1);
          const mMesh = new THREE.Mesh(mGeo, i % 2 === 0 ? mossMat1 : mossMat2);
          mMesh.position.set(Math.cos(angle) * dist, 0.06, Math.sin(angle) * dist);
          group.add(mMesh);
          meshes.push(mMesh);
        }
        const sGeo = new THREE.ConeGeometry(0.04, 0.12, 4);
        const sMesh = new THREE.Mesh(sGeo, sproutMat);
        sMesh.position.set(0.08, 0.12, -0.05);
        group.add(sMesh);
        meshes.push(sMesh);
        break;
      }

      case "hurdes_stone_wall": {
        const slateMat = makeMat(0x37474f, 0.75, 0.15);
        const mortarMat = makeMat(0x455a64, 0.8, 0.05);
        const capMat = makeMat(0x263238, 0.7, 0.1);
        const mossCorner = makeMat(0x2e7d32, 0.85, 0.0);
        const wMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 0.45), slateMat);
        wMesh.position.y = 0.55;
        group.add(wMesh);
        meshes.push(wMesh);
        const capMesh = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.1, 0.52), capMat);
        capMesh.position.y = 1.15;
        group.add(capMesh);
        meshes.push(capMesh);
        for (let ly = 0.25; ly <= 0.85; ly += 0.3) {
          const seam = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.03, 0.46), mortarMat);
          seam.position.y = ly;
          group.add(seam);
          meshes.push(seam);
        }
        const mGeo = new THREE.SphereGeometry(0.16, 5, 4);
        mGeo.scale(1.2, 0.4, 0.8);
        const mMesh = new THREE.Mesh(mGeo, mossCorner);
        mMesh.position.set(-0.95, 1.18, 0.15);
        group.add(mMesh);
        meshes.push(mMesh);
        break;
      }

      case "village_fountain": {
        // Authentic Mesegal Stone Fountain from Photo 4
        const archStoneMat = makeMat(0x4e342e, 0.8, 0.1);
        const pebbleMat = makeMat(0x78909c, 0.75, 0.15);
        const brassMat = makeMat(0xffb300, 0.25, 0.85);
        const ironGrateMat = makeMat(0x212121, 0.5, 0.7);
        const waterFlowMat = makeMat(0x00b4d8, 0.1, 0.2);

        const nicheBack = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.3, 16, 1, false, 0, Math.PI), archStoneMat);
        nicheBack.rotation.x = Math.PI / 2;
        nicheBack.rotation.z = Math.PI / 2;
        nicheBack.position.set(0, 1.25, -0.15);
        group.add(nicheBack);
        meshes.push(nicheBack);

        const nichePillarL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.25, 0.3), archStoneMat);
        nichePillarL.position.set(-0.62, 0.62, -0.15);
        group.add(nichePillarL);
        meshes.push(nichePillarL);

        const nichePillarR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.25, 0.3), archStoneMat);
        nichePillarR.position.set(0.62, 0.62, -0.15);
        group.add(nichePillarR);
        meshes.push(nichePillarR);

        const pebWall = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.1, 0.12), pebbleMat);
        pebWall.position.set(0, 0.65, -0.12);
        group.add(pebWall);
        meshes.push(pebWall);

        const tapPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.32, 8), brassMat);
        tapPipe.rotation.x = Math.PI / 2;
        tapPipe.position.set(0, 0.85, 0.08);
        group.add(tapPipe);
        meshes.push(tapPipe);

        const jet = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.45, 6), waterFlowMat);
        jet.position.set(0, 0.55, 0.22);
        group.add(jet);
        meshes.push(jet);

        const basin = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.4, 0.65), archStoneMat);
        basin.position.set(0, 0.2, 0.25);
        group.add(basin);
        meshes.push(basin);

        const grate = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.55), ironGrateMat);
        grate.position.set(0, 0.02, 0.72);
        group.add(grate);
        meshes.push(grate);
        break;
      }

      case "stone_bridge_arch": {
        // Medieval / Romanesque multi-span stone bridge of Pinofranqueado over Río Los Ángeles
        // Inspired by the user photo: authentic hollow archway with cutwaters (tajamares) and stone parapets.
        const stoneSideTex = SpriteTextures.getEraSlateSide();
        const stoneTopTex = SpriteTextures.getEraSlateTop();

        const masonryMat = new THREE.MeshStandardMaterial({
          map: stoneSideTex,
          color: 0xcdbca9,
          roughness: 0.8,
          metalness: 0.05
        });
        const pierStoneMat = new THREE.MeshStandardMaterial({
          map: stoneSideTex,
          color: 0x9e9e9e,
          roughness: 0.85,
          metalness: 0.05
        });
        const deckMat = new THREE.MeshStandardMaterial({
          map: stoneTopTex,
          color: 0x8d6e63,
          roughness: 0.75,
          metalness: 0.05
        });
        const parapetMat = new THREE.MeshStandardMaterial({
          map: stoneSideTex,
          color: 0xbcaaa4,
          roughness: 0.75,
          metalness: 0.05
        });
        const trimMat = new THREE.MeshStandardMaterial({
          color: 0xa1887f,
          roughness: 0.7,
          metalness: 0.1
        });

        const archSpan = 5.6;
        const pierW = 1.4;
        const totalW = archSpan + pierW * 2; // 8.4
        const archH = 3.6;
        const deckThick = 0.5;
        const totalH = archH + deckThick; // 4.1
        const r = archSpan / 2; // 2.8
        const springY = archH - r; // 0.8
        const archThick = 5.0;

        // 1. Hollow Arch Extrusion: Spandrel wall + curved barrel vault tunnel + road deck
        const shape = new THREE.Shape();
        shape.moveTo(-totalW / 2, 0);
        shape.lineTo(totalW / 2, 0);
        shape.lineTo(totalW / 2, totalH);
        shape.lineTo(-totalW / 2, totalH);
        shape.closePath();

        const hole = new THREE.Path();
        hole.moveTo(-r, 0);
        hole.lineTo(-r, springY);
        hole.absarc(0, springY, r, Math.PI, 0, true);
        hole.lineTo(r, 0);
        hole.closePath();
        shape.holes.push(hole);

        const bridgeGeo = new THREE.ExtrudeGeometry(shape, {
          depth: archThick,
          bevelEnabled: false,
          curveSegments: 20
        });
        bridgeGeo.translate(0, 0, -archThick / 2);

        const bridgeMesh = new THREE.Mesh(bridgeGeo, masonryMat);
        group.add(bridgeMesh);
        meshes.push(bridgeMesh);

        // 2. Roadway asphalt/cobblestone surface on top of deck
        const roadSurface = new THREE.Mesh(
          new THREE.BoxGeometry(totalW, 0.06, archThick - 0.5),
          deckMat
        );
        roadSurface.position.set(0, totalH + 0.03, 0);
        group.add(roadSurface);
        meshes.push(roadSurface);

        // 3. Stone Parapets (Pretiles de sillería) along front (+Z) and back (-Z) edges of the deck
        for (const pz of [-(archThick / 2 - 0.15), archThick / 2 - 0.15]) {
          const parapetWall = new THREE.Mesh(
            new THREE.BoxGeometry(totalW, 0.65, 0.3),
            parapetMat
          );
          parapetWall.position.set(0, totalH + 0.325, pz);
          group.add(parapetWall);
          meshes.push(parapetWall);

          // Coping stone (albardilla)
          const coping = new THREE.Mesh(
            new THREE.BoxGeometry(totalW + 0.1, 0.1, 0.38),
            trimMat
          );
          coping.position.set(0, totalH + 0.65 + 0.05, pz);
          group.add(coping);
          meshes.push(coping);
        }

        // 4. Tajamares (Triangular Cutwaters) protruding upstream (+Z) and downstream (-Z) on piers
        const tajH = springY + 1.6; // 2.4m
        const tajShape = new THREE.Shape();
        tajShape.moveTo(-pierW / 2, 0);
        tajShape.lineTo(pierW / 2, 0);
        tajShape.lineTo(0, 1.3); // triangular apex pointing out
        tajShape.closePath();

        const tajGeo = new THREE.ExtrudeGeometry(tajShape, { depth: tajH, bevelEnabled: false });
        tajGeo.rotateX(-Math.PI / 2); // vertical prism

        for (const px of [-(archSpan / 2 + pierW / 2), (archSpan / 2 + pierW / 2)]) {
          // Front tajamar (+Z)
          const tajFront = new THREE.Mesh(tajGeo, pierStoneMat);
          tajFront.rotation.y = Math.PI;
          tajFront.position.set(px, 0, archThick / 2);
          group.add(tajFront);
          meshes.push(tajFront);

          // Sloped triangular cap on front tajamar
          const capFrontGeo = new THREE.ConeGeometry(0.85, 0.6, 3);
          capFrontGeo.rotateY(Math.PI / 6);
          const capFront = new THREE.Mesh(capFrontGeo, trimMat);
          capFront.position.set(px, tajH + 0.3, archThick / 2 + 0.45);
          group.add(capFront);
          meshes.push(capFront);

          // Back tajamar (-Z)
          const tajBack = new THREE.Mesh(tajGeo, pierStoneMat);
          tajBack.position.set(px, 0, -archThick / 2);
          group.add(tajBack);
          meshes.push(tajBack);

          // Sloped triangular cap on back tajamar
          const capBack = new THREE.Mesh(capFrontGeo, trimMat);
          capBack.rotation.y = Math.PI;
          capBack.position.set(px, tajH + 0.3, -(archThick / 2 + 0.45));
          group.add(capBack);
          meshes.push(capBack);
        }

        // 5. Arched Archivolt / Voussoir Trim (Dovelas de sillería) outlining front & back arch edges
        const ringGeo = new THREE.RingGeometry(r, r + 0.32, 24, 1, 0, Math.PI);
        for (const fz of [archThick / 2 + 0.02, -(archThick / 2 + 0.02)]) {
          const archTrim = new THREE.Mesh(ringGeo, trimMat);
          archTrim.position.set(0, springY, fz);
          if (fz < 0) archTrim.rotation.y = Math.PI;
          group.add(archTrim);
          meshes.push(archTrim);
        }

        break;
      }

      case "pine_hurdes": {
        // Hurdes Mountain Pine (Photo 1 & Photo 2)
        const barkMat = makeMat(0x6d4c41, 0.85, 0.05);
        const needleMat = makeMat(0x1b5e20, 0.75, 0.0);
        const trunkH = 4.8;

        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.38, trunkH, 8), barkMat);
        trunk.position.y = trunkH / 2;
        trunk.rotation.z = 0.06;
        group.add(trunk);
        meshes.push(trunk);

        const canopyConfigs = [
          { y: 3.2, r: 1.8, h: 1.2 },
          { y: 4.2, r: 1.5, h: 1.1 },
          { y: 5.1, r: 1.1, h: 1.0 }
        ];
        canopyConfigs.forEach(c => {
          const cMesh = new THREE.Mesh(new THREE.ConeGeometry(c.r, c.h, 7), needleMat);
          cMesh.position.y = c.y;
          group.add(cMesh);
          meshes.push(cMesh);
        });
        break;
      }

      case "village_church_tower": {
        // Church Belfry Tower of Pinofranqueado from Photo 3
        const whiteWallMat = makeMat(0xf5f5f5, 0.6, 0.05);
        const stoneTrimMat = makeMat(0x78909c, 0.7, 0.15);
        const bellBronzeMat = makeMat(0xcd7f32, 0.3, 0.8);
        const tileRoofMat = makeMat(0xd84315, 0.7, 0.05);
        const crossGoldMat = makeMat(0xffd54f, 0.2, 0.9);

        const towerW = 3.6;
        const towerH = 7.5;

        const tower = new THREE.Mesh(new THREE.BoxGeometry(towerW, towerH, towerW), whiteWallMat);
        tower.position.y = towerH / 2;
        group.add(tower);
        meshes.push(tower);

        const quoinL = new THREE.Mesh(new THREE.BoxGeometry(0.25, towerH, 0.25), stoneTrimMat);
        quoinL.position.set(-towerW / 2 + 0.1, towerH / 2, towerW / 2 - 0.1);
        const quoinR = new THREE.Mesh(new THREE.BoxGeometry(0.25, towerH, 0.25), stoneTrimMat);
        quoinR.position.set(towerW / 2 - 0.1, towerH / 2, towerW / 2 - 0.1);
        group.add(quoinL, quoinR);
        meshes.push(quoinL, quoinR);

        const belfryArch = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, towerW + 0.1), stoneTrimMat);
        belfryArch.position.set(0, towerH - 1.5, 0);
        group.add(belfryArch);
        meshes.push(belfryArch);

        const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.45, 0.65, 12), bellBronzeMat);
        bell.position.set(0, towerH - 1.4, 0);
        group.add(bell);
        meshes.push(bell);

        const roof = new THREE.Mesh(new THREE.ConeGeometry(towerW * 0.78, 2.2, 4), tileRoofMat);
        roof.rotation.y = Math.PI / 4;
        roof.position.y = towerH + 1.1;
        group.add(roof);
        meshes.push(roof);

        const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.8, 0.08), crossGoldMat);
        crossV.position.y = towerH + 2.4;
        const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.08), crossGoldMat);
        crossH.position.y = towerH + 2.55;
        group.add(crossV, crossH);
        meshes.push(crossV, crossH);
        break;
      }

      case "terrace_table_set": {
        // Bar Terrace Table & Chairs from Photo 3 (Plaza de Pinofranqueado)
        const darkRattanMat = makeMat(0x212121, 0.7, 0.1);
        const tableTopMat = makeMat(0x37474f, 0.5, 0.3);
        const ceramicCupMat = makeMat(0xffffff, 0.3, 0.1);

        const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 1.1), tableTopMat);
        tableTop.position.y = 0.82;
        const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.82, 8), darkRattanMat);
        tableLeg.position.y = 0.41;
        const tableBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.04, 12), darkRattanMat);
        tableBase.position.y = 0.02;
        group.add(tableTop, tableLeg, tableBase);
        meshes.push(tableTop, tableLeg, tableBase);

        for (const cz of [-0.95, 0.95]) {
          const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.05, 0.52), darkRattanMat);
          seat.position.set(0, 0.48, cz);
          const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.48, 0.05), darkRattanMat);
          backrest.position.set(0, 0.72, cz + (cz > 0 ? 0.24 : -0.24));
          for (const lx of [-0.22, 0.22]) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.48, 6), darkRattanMat);
            leg.position.set(lx, 0.24, cz);
            group.add(leg);
            meshes.push(leg);
          }
          group.add(seat, backrest);
          meshes.push(seat, backrest);
        }

        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.08, 8), ceramicCupMat);
        cup.position.set(0.15, 0.89, -0.1);
        group.add(cup);
        meshes.push(cup);
        break;
      }

      case "village_lantern_post": {
        // Classic Wrought-Iron Village Street Lamp
        const wroughtIronMat = makeMat(0x1a1a1a, 0.5, 0.8);
        const glassLanternMat = makeMat(0xffd54f, 0.2, 0.1, 0xffa000);

        const postH = 3.6;
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 0.45, 8), wroughtIronMat);
        base.position.y = 0.22;
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, postH, 8), wroughtIronMat);
        mast.position.y = postH / 2;
        group.add(base, mast);
        meshes.push(base, mast);

        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 0.06), wroughtIronMat);
        arm.position.set(0.3, postH - 0.1, 0);
        group.add(arm);
        meshes.push(arm);

        const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.12, 0.38, 6), glassLanternMat);
        lantern.position.set(0.55, postH - 0.28, 0);
        const lCap = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.16, 6), wroughtIronMat);
        lCap.position.set(0.55, postH - 0.05, 0);
        group.add(lantern, lCap);
        meshes.push(lantern, lCap);
        break;
      }

      case "wooden_bench_rustic": {
        // Traditional Chestnut Wood Village Bench
        const woodSlatMat = makeMat(0x5d4037, 0.7, 0.05);
        const castIronLegMat = makeMat(0x212121, 0.5, 0.7);

        for (let sz = -0.18; sz <= 0.18; sz += 0.12) {
          const slat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.08), woodSlatMat);
          slat.position.set(0, 0.52, sz);
          group.add(slat);
          meshes.push(slat);
        }

        for (let by = 0.72; by <= 0.96; by += 0.12) {
          const slat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.04), woodSlatMat);
          slat.position.set(0, by, -0.22);
          group.add(slat);
          meshes.push(slat);
        }

        for (const lx of [-0.78, 0.78]) {
          const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.52, 0.48), castIronLegMat);
          leg.position.set(lx, 0.26, 0);
          const backSupport = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 0.06), castIronLegMat);
          backSupport.position.set(lx, 0.76, -0.22);
          group.add(leg, backSupport);
          meshes.push(leg, backSupport);
        }
        break;
      }

      case "spar_supermarket_sign": {
        // Rural SPAR Supermarket Icon Totem
        const sparGreenMat = makeMat(0x007a3d, 0.5, 0.1);
        const sparRedMat = makeMat(0xee3124, 0.4, 0.1);
        const whiteBoxMat = makeMat(0xffffff, 0.3, 0.1);
        const postMat = makeMat(0x455a64, 0.4, 0.6);

        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8), postMat);
        pole.position.y = 1.6;
        group.add(pole);
        meshes.push(pole);

        const box = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 0.35), whiteBoxMat);
        box.position.y = 3.6;
        group.add(box);
        meshes.push(box);

        const redTrim = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.1, 0.37), sparRedMat);
        redTrim.position.y = 4.2;
        group.add(redTrim);
        meshes.push(redTrim);

        const firTree = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.65, 6), sparGreenMat);
        firTree.position.set(0, 3.6, 0.19);
        group.add(firTree);
        meshes.push(firTree);
        break;
      }

      case "hurdes_mountain_house": {
        // Traditional Hurdes Mountain House from Photo 2
        const stoneWallMat = makeMat(0x3e2723, 0.8, 0.05);
        const whitewashMat = makeMat(0xeeeeee, 0.65, 0.05);
        const terracottaRoof = makeMat(0xd84315, 0.7, 0.05);
        const woodDoorMat = makeMat(0x4e342e, 0.7, 0.05);

        const houseW = 4.6;
        const houseH = 3.2;
        const houseD = 4.0;

        const baseFloor = new THREE.Mesh(new THREE.BoxGeometry(houseW, houseH * 0.55, houseD), stoneWallMat);
        baseFloor.position.y = houseH * 0.275;
        const upperFloor = new THREE.Mesh(new THREE.BoxGeometry(houseW, houseH * 0.45, houseD), whitewashMat);
        upperFloor.position.y = houseH * 0.55 + houseH * 0.225;
        group.add(baseFloor, upperFloor);
        meshes.push(baseFloor, upperFloor);

        const door = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.08), woodDoorMat);
        door.position.set(0, 0.8, houseD / 2 + 0.04);
        group.add(door);
        meshes.push(door);

        const roof = new THREE.Mesh(new THREE.ConeGeometry(houseW * 0.78, 1.8, 4), terracottaRoof);
        roof.rotation.y = Math.PI / 4;
        roof.position.y = houseH + 0.9;
        group.add(roof);
        meshes.push(roof);

        const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.2, 0.65), stoneWallMat);
        chimney.position.set(houseW * 0.28, houseH + 1.2, houseD * 0.2);
        group.add(chimney);
        meshes.push(chimney);
        break;
      }

      case "pergola_green_post": {
        // Green Pergola Post from Photo 3 (Plaza de Pinofranqueado)
        const greenSteelMat = makeMat(0x2e7d32, 0.35, 0.5);
        const cableMat = makeMat(0x78909c, 0.4, 0.8);
        const postH = 4.5;

        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, postH, 8), greenSteelMat);
        post.position.y = postH / 2;
        group.add(post);
        meshes.push(post);

        const arm = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.08), greenSteelMat);
        arm.position.y = postH - 0.2;
        group.add(arm);
        meshes.push(arm);

        const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 3.2, 4), cableMat);
        cable.rotation.z = Math.PI / 2;
        cable.position.set(0.6, postH - 0.15, 0);
        group.add(cable);
        meshes.push(cable);
        break;
      }

      case "waterfall_rock_cliff": {
        // Stepped Slate Cliff with Mist from Photo 5 (Chorrito de Ovejuela)
        const slateCliffMat = makeMat(0x263238, 0.8, 0.2);
        const wetRockMat = makeMat(0x1a2327, 0.4, 0.3);
        const mossMat = makeMat(0x2e7d32, 0.85, 0.0);

        const s1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 2.4), slateCliffMat);
        s1.position.set(0, 0.6, 0);
        const s2 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.6, 1.8), wetRockMat);
        s2.position.set(0.2, 1.8, -0.3);
        const s3 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.8, 1.4), slateCliffMat);
        s3.position.set(-0.1, 3.3, -0.6);
        group.add(s1, s2, s3);
        meshes.push(s1, s2, s3);

        const m1 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 5, 4), mossMat);
        m1.scale.set(1.5, 0.3, 1.1);
        m1.position.set(1.1, 1.25, 0.4);
        group.add(m1);
        meshes.push(m1);
        break;
      }

      case "madrid_metro_sign": {
        // Madrid Metro traditional diamond totem
        const steelMat = makeMat(0x37474f, 0.35, 0.6);
        const baseMat = makeMat(0x78909c, 0.8, 0.1);
        const redMat = makeMat(0xd32f2f, 0.4, 0.1);
        const whiteMat = makeMat(0xffffff, 0.3, 0.05);
        const blueMat = makeMat(0x0d47a1, 0.35, 0.1);
        const lightMat = makeMat(0xffee58, 0.2, 0.1, 0xffd54f);

        // Concrete base plinth
        const basePlinth = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.3, 8), baseMat);
        basePlinth.position.y = 0.15;
        group.add(basePlinth);
        meshes.push(basePlinth);

        // Steel totem pole
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.6, 8), steelMat);
        pole.position.y = 1.45;
        group.add(pole);
        meshes.push(pole);

        // Outer red rhombus frame (rotated square box)
        const outerDiamond = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.14), redMat);
        outerDiamond.position.y = 2.75;
        outerDiamond.rotation.z = Math.PI / 4;
        group.add(outerDiamond);
        meshes.push(outerDiamond);

        // Inner white diamond
        const innerDiamond = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.72, 0.15), whiteMat);
        innerDiamond.position.y = 2.75;
        innerDiamond.rotation.z = Math.PI / 4;
        group.add(innerDiamond);
        meshes.push(innerDiamond);

        // Blue horizontal METRO bar
        const blueBar = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.32, 0.18), blueMat);
        blueBar.position.y = 2.75;
        group.add(blueBar);
        meshes.push(blueBar);

        // Central white stripe simulation
        const whiteBar = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 0.19), whiteMat);
        whiteBar.position.y = 2.75;
        group.add(whiteBar);
        meshes.push(whiteBar);

        // Small illuminated topper
        const topper = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.18), lightMat);
        topper.position.y = 3.35;
        group.add(topper);
        meshes.push(topper);
        break;
      }

      case "madrid_street_sign_carabanchel": {
        // Madrid Ceramic Street Plaque on Wrought-Iron Post (C/ de las Piqueñas - Carabanchel)
        const ironMat = makeMat(0x212121, 0.5, 0.7);
        const tileMat = makeMat(0xfafafa, 0.2, 0.05);
        const navyMat = makeMat(0x0d47a1, 0.3, 0.1);
        const goldMat = makeMat(0xc67d0a, 0.3, 0.5);

        // Cast iron post with decorative rings
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 2.2, 8), ironMat);
        post.position.y = 1.1;
        const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.06, 8), ironMat);
        ring.position.y = 1.8;
        group.add(post, ring);
        meshes.push(post, ring);

        // Iron bracket frame
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.82, 0.08), ironMat);
        frame.position.y = 2.25;
        group.add(frame);
        meshes.push(frame);

        // Glazed ceramic tile face
        const tile = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.72, 0.09), tileMat);
        tile.position.y = 2.25;
        group.add(tile);
        meshes.push(tile);

        // Upper header stripe (coat of arms bar)
        const header = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.15, 0.1), navyMat);
        header.position.set(0, 2.45, 0);
        group.add(header);
        meshes.push(header);

        // Street name line: C/ DE LAS PIQUEÑAS
        const streetText = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.12, 0.1), navyMat);
        streetText.position.set(0, 2.26, 0);
        group.add(streetText);
        meshes.push(streetText);

        // District subtitle line: CARABANCHEL
        const districtText = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.08, 0.1), goldMat);
        districtText.position.set(0, 2.1, 0);
        group.add(districtText);
        meshes.push(districtText);
        break;
      }

      case "madrid_street_lamp_urban": {
        // Classic Madrid "Farola Fernandina" Dark Green Street Lamp
        const lampIronMat = makeMat(0x1b2820, 0.45, 0.5); // Traditional Madrid dark green
        const glassGlowMat = makeMat(0xffecb3, 0.2, 0.1, 0xffa000); // Warm lantern glow

        // Octagonal base
        const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.75, 8), lampIronMat);
        lampBase.position.y = 0.375;
        group.add(lampBase);
        meshes.push(lampBase);

        // Fluted tapered shaft
        const column = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 2.6, 8), lampIronMat);
        column.position.y = 1.95;
        group.add(column);
        meshes.push(column);

        // Capital bracket
        const capital = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.1, 0.2, 8), lampIronMat);
        capital.position.y = 3.25;
        group.add(capital);
        meshes.push(capital);

        // Horizontal ornate double arm
        const armBar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.07, 0.07), lampIronMat);
        armBar.position.y = 3.32;
        group.add(armBar);
        meshes.push(armBar);

        // Two lantern heads with glowing glass
        for (const dx of [-0.48, 0.48]) {
          const lanternGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.11, 0.42, 6), glassGlowMat);
          lanternGlass.position.set(dx, 3.5, 0);
          const lanternCap = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.22, 6), lampIronMat);
          lanternCap.position.set(dx, 3.76, 0);
          group.add(lanternGlass, lanternCap);
          meshes.push(lanternGlass, lanternCap);
        }
        break;
      }

      case "madrid_recycle_bins": {
        // Trio of Municipal Recycling Bins: Green Glass Igloo, Yellow Packaging, Blue Paper
        const greenIglooMat = makeMat(0x2e7d32, 0.6, 0.1);
        const yellowBinMat = makeMat(0xfbc02d, 0.55, 0.1);
        const yellowLidMat = makeMat(0xf57f17, 0.6, 0.1);
        const blueBinMat = makeMat(0x1976d2, 0.55, 0.1);
        const blueLidMat = makeMat(0x0d47a1, 0.6, 0.1);
        const darkSlotMat = makeMat(0x212121, 0.8, 0.2);

        // 1. Green glass igloo (left, x = -0.95)
        const iglooBase = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.7, 12), greenIglooMat);
        iglooBase.position.set(-0.95, 0.35, 0);
        const iglooDome = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), greenIglooMat);
        iglooDome.position.set(-0.95, 0.7, 0);
        const iglooSlot = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 8), darkSlotMat);
        iglooSlot.rotation.x = Math.PI / 2;
        iglooSlot.position.set(-0.95, 0.75, 0.38);
        group.add(iglooBase, iglooDome, iglooSlot);
        meshes.push(iglooBase, iglooDome, iglooSlot);

        // 2. Yellow packaging bin (center, x = 0.0)
        const yellowBody = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.05, 0.72), yellowBinMat);
        yellowBody.position.set(0, 0.525, 0);
        const yellowLid = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.14, 0.76), yellowLidMat);
        yellowLid.position.set(0, 1.1, 0);
        const yellowSlot = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.12, 0.05), darkSlotMat);
        yellowSlot.position.set(0, 0.9, 0.37);
        group.add(yellowBody, yellowLid, yellowSlot);
        meshes.push(yellowBody, yellowLid, yellowSlot);

        // 3. Blue paper/cardboard bin (right, x = 0.95)
        const blueBody = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.05, 0.72), blueBinMat);
        blueBody.position.set(0.95, 0.525, 0);
        const blueLid = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.14, 0.76), blueLidMat);
        blueLid.position.set(0.95, 1.1, 0);
        const blueSlot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.05), darkSlotMat);
        blueSlot.position.set(0.95, 0.88, 0.37);
        group.add(blueBody, blueLid, blueSlot);
        meshes.push(blueBody, blueLid, blueSlot);
        break;
      }

      case "madrid_granite_bollard": {
        // Madrid Municipal Granite Spherical Bollard
        const graniteMat = makeMat(0x9e9e9e, 0.85, 0.15);
        const whiteStripeMat = makeMat(0xf5f5f5, 0.5, 0.05);

        const stub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.32, 10), graniteMat);
        stub.position.y = 0.16;
        const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.225, 0.225, 0.06, 10), whiteStripeMat);
        stripe.position.y = 0.24;
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), graniteMat);
        ball.position.y = 0.44;
        group.add(stub, stripe, ball);
        meshes.push(stub, stripe, ball);
        break;
      }

      case "madrid_terrace_bar_umbrella": {
        // Spanish Bar Terrace Parasol with Café Table and Metal Chairs
        const mastMat = makeMat(0x424242, 0.4, 0.6);
        const canvasMat = makeMat(0x1b5e20, 0.8, 0.05); // Mahou dark green canopy
        const valanceMat = makeMat(0x2e7d32, 0.8, 0.05);
        const tableAluMat = makeMat(0xb0bec5, 0.3, 0.7);
        const chairMat = makeMat(0x546e7a, 0.4, 0.5);

        // Mast and heavy concrete plinth
        const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.35, 0.1, 10), mastMat);
        plinth.position.y = 0.05;
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.65, 8), mastMat);
        mast.position.y = 1.35;
        group.add(plinth, mast);
        meshes.push(plinth, mast);

        // Large octagonal fabric canopy
        const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.65, 0.55, 8), canvasMat);
        canopy.position.y = 2.45;
        const valance = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.65, 0.18, 8, 1, true), valanceMat);
        valance.position.y = 2.14;
        group.add(canopy, valance);
        meshes.push(canopy, valance);

        // Café round table underneath
        const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.04, 12), tableAluMat);
        tableTop.position.y = 0.75;
        const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.72, 8), tableAluMat);
        tableLeg.position.y = 0.37;
        group.add(tableTop, tableLeg);
        meshes.push(tableTop, tableLeg);

        // 2 Terrace Chairs
        for (const dx of [-0.65, 0.65]) {
          const seat = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.38), chairMat);
          seat.position.set(dx, 0.44, 0);
          const back = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.35, 0.04), chairMat);
          back.position.set(dx, 0.64, (dx < 0 ? -0.17 : 0.17));
          group.add(seat, back);
          meshes.push(seat, back);
        }
        break;
      }

      case "madrid_residential_building": {
        // Carabanchel Multi-Story Brick Apartment Block
        // Facade color support: Brick red, White/cream, Warm yellow/ochre, Warm orange/terracotta
        const rawColor = (obj.properties?.facadeColor || obj.properties?.color || obj.properties?.buildingColor || "brick") as string;
        let facadeHex = 0xb03a2e; // default Madrid brick caravista
        let plinthHex = 0x546e7a; // stone plinth
        let trimHex = 0xf5f5f5;   // window surrounds / cornice
        let blindHex = 0xf5f5dc;  // ivory persianas

        const lowerColor = String(rawColor).toLowerCase().trim();
        if (lowerColor === "white" || lowerColor === "blanco" || lowerColor === "#ffffff" || lowerColor === "#f8fafc" || lowerColor === "#f5f5f0") {
          facadeHex = 0xf2f2ec; // Clean Madrid warm white / cream stucco
          plinthHex = 0x37474f; // Dark charcoal granite base for crisp contrast
          trimHex = 0xe0e0e0;
          blindHex = 0xededdb;
        } else if (lowerColor === "yellow" || lowerColor === "amarillo" || lowerColor === "ochre" || lowerColor === "#eab308" || lowerColor === "#dfa552") {
          facadeHex = 0xdfa552; // Warm Madrid albero / golden-ochre caravista
          plinthHex = 0x455a64; // Slate gray granite base
          trimHex = 0xfffbeb;
          blindHex = 0xfef3c7;
        } else if (lowerColor === "orange" || lowerColor === "naranja" || lowerColor === "terracotta" || lowerColor === "#f97316" || lowerColor === "#cc5c34") {
          facadeHex = 0xcc5c34; // Warm terracotta / salmon-orange caravista
          plinthHex = 0x3e2723; // Dark umber stone base
          trimHex = 0xffedd5;
          blindHex = 0xfaf5eb;
        } else if (rawColor.startsWith("#")) {
          facadeHex = parseInt(rawColor.replace("#", "0x"), 16) || 0xb03a2e;
          plinthHex = 0x546e7a;
        }

        const facadeMat = makeMat(facadeHex, 0.85, 0.05);
        const plinthMat = makeMat(plinthHex, 0.8, 0.15);
        const corniceMat = makeMat(trimHex, 0.7, 0.1);
        const balconyIronMat = makeMat(0x212121, 0.5, 0.7);
        const glassMat = makeMat(0x80deea, 0.2, 0.2, 0x003344);
        const blindMat = makeMat(blindHex, 0.7, 0.05);
        const greenAwningMat = makeMat(0x1b5e20, 0.75, 0.05); // Madrid balcony forest green fabric
        const greenValanceMat = makeMat(0x2e7d32, 0.75, 0.05);
        const awningArmMat = makeMat(0xd4d4d4, 0.5, 0.6);
        const cassetteMat = makeMat(0xe0e0e0, 0.4, 0.5); // Aluminum awning cassette
        const pharmacyGreenMat = makeMat(0x00c853, 0.3, 0.1, 0x00e676);
        const bazarBlueMat = makeMat(0x0284c7, 0.4, 0.1);
        const shutterMat = makeMat(0x795548, 0.6, 0.2);

        // Main building body (7.0m wide, 12.0m tall, 4.4m deep)
        const buildingBody = new THREE.Mesh(new THREE.BoxGeometry(7.0, 12.0, 4.4), facadeMat);
        buildingBody.position.y = 6.0;
        group.add(buildingBody);
        meshes.push(buildingBody);

        // Ground floor plinth in granite (7.1m wide, 2.5m tall, 4.5m deep)
        const plinth = new THREE.Mesh(new THREE.BoxGeometry(7.1, 2.5, 4.5), plinthMat);
        plinth.position.y = 1.25;
        group.add(plinth);
        meshes.push(plinth);

        // Rooftop parapet & cornice trim (gives authentic architectural finish)
        const cornice = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.35, 4.6), corniceMat);
        cornice.position.y = 12.15;
        group.add(cornice);
        meshes.push(cornice);

        // Ground floor storefront / portal
        const shopType = (obj.properties?.shopType as string) || "portal";
        if (shopType === "farmacia") {
          const farmSign = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.65, 0.12), pharmacyGreenMat);
          farmSign.position.set(0, 2.0, 2.28);
          // Glowing green cross
          const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.85, 0.15), pharmacyGreenMat);
          crossV.position.set(2.4, 1.9, 2.3);
          const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.15), pharmacyGreenMat);
          crossH.position.set(2.4, 1.9, 2.3);
          const shopGlass = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.5, 0.1), glassMat);
          shopGlass.position.set(0, 0.95, 2.27);
          group.add(farmSign, crossV, crossH, shopGlass);
          meshes.push(farmSign, crossV, crossH, shopGlass);
        } else if (shopType === "bazar") {
          const bazarSign = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.65, 0.12), bazarBlueMat);
          bazarSign.position.set(0, 2.0, 2.28);
          const shopGlass = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.5, 0.1), glassMat);
          shopGlass.position.set(0, 0.95, 2.27);
          group.add(bazarSign, shopGlass);
          meshes.push(bazarSign, shopGlass);
        } else if (shopType === "garage") {
          const shutter = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.0, 0.12), shutterMat);
          shutter.position.set(0, 1.05, 2.27);
          group.add(shutter);
          meshes.push(shutter);
        } else {
          // Residential entrance portal door
          const portal = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.1, 0.15), balconyIronMat);
          portal.position.set(0, 1.05, 2.26);
          const portalGlass = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.7, 0.16), glassMat);
          portalGlass.position.set(0, 1.15, 2.26);
          group.add(portal, portalGlass);
          meshes.push(portal, portalGlass);
        }

        // 3 tiers of spacious, non-overlapping balconies on upper floors
        // Floor 0: y = 4.2 | Floor 1: y = 7.3 | Floor 2: y = 10.3 (generous 3.0m - 3.1m breathing room)
        const floorHeights = [4.2, 7.3, 10.3];
        floorHeights.forEach((y, floor) => {
          for (const dx of [-1.8, 1.8]) {
            // Window Frame Molding (Recessed facade detail)
            const frame = new THREE.Mesh(new THREE.BoxGeometry(1.46, 1.86, 0.05), corniceMat);
            frame.position.set(dx, y + 0.35, 2.22);

            // Window Glass (Recessed inside frame, z = 2.21, zero z-fighting)
            const windowGlass = new THREE.Mesh(new THREE.BoxGeometry(1.30, 1.70, 0.02), glassMat);
            windowGlass.position.set(dx, y + 0.35, 2.21);

            // Persiana / Roller Blind (Ivory Madrid blind placed in front of glass at z = 2.24)
            const blindH = floor === 0 ? 0.70 : floor === 1 ? 0.45 : 0.60;
            const blind = new THREE.Mesh(new THREE.BoxGeometry(1.30, blindH, 0.03), blindMat);
            blind.position.set(dx, y + 1.20 - blindH / 2, 2.24);

            // Balcony Granite Base Slab (Cleanly anchored into wall, extends z = 2.18 to 3.00)
            const balconySlab = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.12, 0.82), plinthMat);
            balconySlab.position.set(dx, y - 0.58, 2.59);

            // Clean Non-Overlapping Wrought Iron Railings (Corner posts + framed panels, NO intersecting geometry!)
            const postGeo = new THREE.BoxGeometry(0.035, 0.70, 0.035);
            const postL = new THREE.Mesh(postGeo, balconyIronMat);
            postL.position.set(dx - 0.77, y - 0.22, 2.97);
            const postR = new THREE.Mesh(postGeo, balconyIronMat);
            postR.position.set(dx + 0.77, y - 0.22, 2.97);

            // Front panel (fitted cleanly between posts, z = 2.97, thickness 0.02)
            const railingFront = new THREE.Mesh(new THREE.BoxGeometry(1.50, 0.66, 0.02), balconyIronMat);
            railingFront.position.set(dx, y - 0.22, 2.97);

            // Side panels (fitted cleanly between wall and posts, x = dx - 0.77 and dx + 0.77)
            const sideGeo = new THREE.BoxGeometry(0.02, 0.66, 0.74);
            const railingSideL = new THREE.Mesh(sideGeo, balconyIronMat);
            railingSideL.position.set(dx - 0.77, y - 0.22, 2.59);
            const railingSideR = new THREE.Mesh(sideGeo, balconyIronMat);
            railingSideR.position.set(dx + 0.77, y - 0.22, 2.59);

            group.add(frame, windowGlass, blind, balconySlab, postL, postR, railingFront, railingSideL, railingSideR);
            meshes.push(frame, windowGlass, blind, balconySlab, postL, postR, railingFront, railingSideL, railingSideR);

            // Authentic Madrid toldo distribution:
            // Deployed on Floor 1 (middle floor) and top right bay; retracted in aluminum cassette on others!
            const hasDeployedAwning = floor === 1 || (floor === 2 && dx > 0);

            if (hasDeployedAwning) {
              // Gracefully sloped Madrid toldo verde with generous breathing room above railing
              const awningSlope = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.03, 0.88), greenAwningMat);
              awningSlope.rotation.x = 0.38;
              awningSlope.position.set(dx, y + 0.85, 2.58);

              // Scalloped valance border hanging at front
              const valance = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.16, 0.02), greenValanceMat);
              valance.position.set(dx, y + 0.60, 2.96);

              // Diagonal metal support arms
              for (const armX of [dx - 0.78, dx + 0.78]) {
                const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.78, 6), awningArmMat);
                arm.rotation.x = 0.46;
                arm.position.set(armX, y + 0.56, 2.62);
                group.add(arm);
                meshes.push(arm);
              }

              group.add(awningSlope, valance);
              meshes.push(awningSlope, valance);
            } else {
              // Retracted toldo in sleek aluminum header cassette (leaves balcony open and bright)
              const cassette = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.12, 0.14), cassetteMat);
              cassette.position.set(dx, y + 1.28, 2.27);
              group.add(cassette);
              meshes.push(cassette);
            }
          }
        });
        break;
      }

      case "madrid_parked_car": {
        const isVan = obj.properties?.carType === "van";
        const colorHex = obj.properties?.color ? parseInt(String(obj.properties.color).replace("#", "0x"), 16) : (isVan ? 0xf3f4f6 : 0x475569);
        const bodyMat = makeMat(colorHex, 0.4, 0.15);
        const blackMat = makeMat(0x1e293b, 0.6, 0.1);
        const glassMat = makeMat(0x38bdf8, 0.1, 0.3, 0x0284c7);
        const chromeMat = makeMat(0xd1d5db, 0.3, 0.8);
        const tireMat = makeMat(0x111827, 0.9, 0.05);
        const headMat = makeMat(0xffffff, 0.2, 0.1, 0xffffff);
        const tailMat = makeMat(0xd50000, 0.2, 0.1, 0xd50000);

        if (isVan) {
          // White Madrid commercial delivery van (Renault Master / Ford Transit)
          const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.5, 4.8), bodyMat);
          chassis.position.y = 0.55;
          const cab = new THREE.Mesh(new THREE.BoxGeometry(2.05, 1.2, 1.6), bodyMat);
          cab.position.set(0, 1.35, -1.3);
          const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.85, 0.08), glassMat);
          windshield.rotation.x = 0.42;
          windshield.position.set(0, 1.45, -2.05);
          const cargoBox = new THREE.Mesh(new THREE.BoxGeometry(2.12, 1.6, 3.2), bodyMat);
          cargoBox.position.set(0, 1.55, 0.8);
          const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.25, 0.2), blackMat);
          rearBumper.position.set(0, 0.4, 2.42);
          const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.35, 0.25), blackMat);
          frontBumper.position.set(0, 0.45, -2.42);
          for (const sx of [-1.15, 1.15]) {
            const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.14), blackMat);
            mirror.position.set(sx, 1.4, -1.3);
            group.add(mirror);
            meshes.push(mirror);
          }
          for (const [wx, wz] of [[-1.02, -1.3], [1.02, -1.3], [-1.02, 1.4], [1.02, 1.4]]) {
            const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.24, 16), tireMat);
            tire.rotation.z = Math.PI / 2;
            tire.position.set(wx, 0.36, wz);
            const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.25, 12), chromeMat);
            rim.rotation.z = Math.PI / 2;
            rim.position.set(wx, 0.36, wz);
            group.add(tire, rim);
            meshes.push(tire, rim);
          }
          for (const hx of [-0.75, 0.75]) {
            const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.08), headMat);
            head.position.set(hx, 0.75, -2.45);
            const tail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.08), tailMat);
            tail.position.set(hx, 1.2, 2.42);
            group.add(head, tail);
            meshes.push(head, tail);
          }
          group.add(chassis, cab, windshield, cargoBox, rearBumper, frontBumper);
          meshes.push(chassis, cab, windshield, cargoBox, rearBumper, frontBumper);
        } else {
          // Compact urban sedan / hatchback
          const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.45, 4.2), bodyMat);
          chassis.position.y = 0.45;
          const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.75, 2.3), bodyMat);
          cabin.position.set(0, 1.0, 0.1);
          const windshieldF = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.7, 0.08), glassMat);
          windshieldF.rotation.x = 0.5;
          windshieldF.position.set(0, 1.0, -1.1);
          const windshieldR = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.65, 0.08), glassMat);
          windshieldR.rotation.x = -0.45;
          windshieldR.position.set(0, 1.0, 1.28);
          const sideWindows = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.5, 1.9), glassMat);
          sideWindows.position.set(0, 1.02, 0.1);
          for (const [wx, wz] of [[-0.96, -1.2], [0.96, -1.2], [-0.96, 1.2], [0.96, 1.2]]) {
            const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16), tireMat);
            tire.rotation.z = Math.PI / 2;
            tire.position.set(wx, 0.32, wz);
            const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.23, 12), chromeMat);
            rim.rotation.z = Math.PI / 2;
            rim.position.set(wx, 0.32, wz);
            group.add(tire, rim);
            meshes.push(tire, rim);
          }
          for (const hx of [-0.68, 0.68]) {
            const head = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.08), headMat);
            head.position.set(hx, 0.6, -2.12);
            const tail = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.08), tailMat);
            tail.position.set(hx, 0.65, 2.12);
            group.add(head, tail);
            meshes.push(head, tail);
          }
          group.add(chassis, cabin, windshieldF, windshieldR, sideWindows);
          meshes.push(chassis, cabin, windshieldF, windshieldR, sideWindows);
        }
        break;
      }

      case "madrid_street_marking_piquenas": {
        const tex = LevelBuilder.getCPiquenasStreetMarkingTexture();
        const markMat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0.9,
          depthWrite: false
        });
        const markPlane = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.1), markMat);
        markPlane.rotation.x = -Math.PI / 2;
        markPlane.position.y = 0.02;
        markPlane.renderOrder = 2;
        group.add(markPlane);
        meshes.push(markPlane);
        break;
      }

      case "madrid_bus_stop": {
        // EMT Madrid Bus Stop Shelter (Marquesina Línea 35)
        const emtRedMat = makeMat(0xd32f2f, 0.45, 0.3);
        const glassShelterMat = makeMat(0xbbdefb, 0.2, 0.3);
        const frameSteelMat = makeMat(0x37474f, 0.4, 0.6);
        const benchWoodMat = makeMat(0x8d6e63, 0.75, 0.05);
        const emtBlueMat = makeMat(0x0055b8, 0.35, 0.1);

        // Steel frame uprights
        const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.6, 8), emtRedMat);
        postL.position.set(-1.6, 1.3, 0);
        const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.6, 8), emtRedMat);
        postR.position.set(1.6, 1.3, 0);
        group.add(postL, postR);
        meshes.push(postL, postR);

        // Rear tempered glass windbreak
        const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(3.3, 2.1, 0.06), glassShelterMat);
        rearGlass.position.set(0, 1.25, -0.4);
        group.add(rearGlass);
        meshes.push(rearGlass);

        // Curved roof canopy (slightly inclined forward)
        const roof = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 1.6), frameSteelMat);
        roof.position.set(0, 2.55, 0.2);
        roof.rotation.x = 0.08;
        group.add(roof);
        meshes.push(roof);

        // Integrated waiting bench
        const bench = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 0.4), benchWoodMat);
        bench.position.set(0, 0.48, -0.15);
        group.add(bench);
        meshes.push(bench);

        // Advertising totem on the side
        const adPanel = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.3, 0.95), frameSteelMat);
        adPanel.position.set(1.7, 1.25, 0.0);
        const adPoster = new THREE.Mesh(new THREE.BoxGeometry(0.17, 1.8, 0.8), makeMat(0xffffff, 0.3, 0.0, 0x333333));
        adPoster.position.set(1.7, 1.25, 0.0);
        group.add(adPanel, adPoster);
        meshes.push(adPanel, adPoster);

        // Official EMT Madrid 35 Stop Header Plaque
        const headerSign = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.32, 0.08), emtBlueMat);
        headerSign.position.set(-0.8, 2.75, 0.2);
        const bus35Badge = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.09), makeMat(0xffeb3b, 0.3, 0.1));
        bus35Badge.position.set(-0.4, 2.75, 0.2);
        group.add(headerSign, bus35Badge);
        meshes.push(headerSign, bus35Badge);
        break;
      }

      case "madrid_traffic_light": {
        // Madrid Urban Traffic Light Post
        const poleMat = makeMat(0x263238, 0.4, 0.6);
        const housingMat = makeMat(0x1a1a1a, 0.5, 0.3);
        const redLightMat = makeMat(0xff1744, 0.2, 0.1, 0xff1744);
        const amberLightMat = makeMat(0xff9100, 0.2, 0.1, 0xff9100);
        const greenLightMat = makeMat(0x00e676, 0.2, 0.1, 0x00e676);

        // Steel post
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 3.2, 8), poleMat);
        pole.position.y = 1.6;
        group.add(pole);
        meshes.push(pole);

        // Traffic light housing (upper for vehicles)
        const housing = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.82, 0.28), housingMat);
        housing.position.set(0, 2.8, 0.12);
        group.add(housing);
        meshes.push(housing);

        // Red, Amber, Green light lenses
        const redLens = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), redLightMat);
        redLens.position.set(0, 3.08, 0.25);
        const ambLens = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), amberLightMat);
        ambLens.position.set(0, 2.8, 0.25);
        const grnLens = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), greenLightMat);
        grnLens.position.set(0, 2.52, 0.25);
        group.add(redLens, ambLens, grnLens);
        meshes.push(redLens, ambLens, grnLens);

        // Pedestrian module below
        const pedHousing = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.44, 0.22), housingMat);
        pedHousing.position.set(0, 1.45, 0.1);
        const pedRed = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), redLightMat);
        pedRed.position.set(0, 1.55, 0.2);
        const pedGreen = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), greenLightMat);
        pedGreen.position.set(0, 1.35, 0.2);
        group.add(pedHousing, pedRed, pedGreen);
        meshes.push(pedHousing, pedRed, pedGreen);
        break;
      }

      case "primark_plush_toy": {
        const color = (obj.properties?.color as string) || (obj.properties?.customColor as string) || "#f48fb1";
        const aType = (obj.properties?.animalType as any) || "bear";
        const plushRes = LevelBuilder.createPrimarkPlushToyMesh(color, aType, quality);
        group.add(plushRes.group);
        meshes.push(...plushRes.meshes);
        break;
      }

      case "islazul_mall_facade": {
        const w = obj.scale.x || 44.0;
        const h = obj.scale.y || 18.0;
        const d = obj.scale.z || 10.0;
        const facadeRes = LevelBuilder.createIslazulMallFacadeMesh(w, h, d, quality);
        group.add(facadeRes.group);
        meshes.push(...facadeRes.meshes);
        break;
      }

      case "bazar_shelf_display": {
        // Chinese Bazaar Multi-Tier Product Shelf Display
        const rackFrameMat = makeMat(0xcfd8dc, 0.5, 0.4);
        const shelfBoardMat = makeMat(0x90a4ae, 0.6, 0.3);
        const bottleRedMat = makeMat(0xe53935, 0.4, 0.1);
        const bottleBlueMat = makeMat(0x1e88e5, 0.4, 0.1);
        const bottleYellowMat = makeMat(0xfdd835, 0.4, 0.1);
        const boxCyanMat = makeMat(0x00bcd4, 0.4, 0.1);
        const boxPinkMat = makeMat(0xec407a, 0.4, 0.1);

        // Outer steel shelf frame (width 2.4, height 2.2, depth 0.8)
        const frame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 0.8), rackFrameMat);
        frame.position.y = 1.1;
        group.add(frame);
        meshes.push(frame);

        // 4 Shelves
        for (let s = 0; s < 4; s++) {
          const sy = 0.35 + s * 0.52;
          const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.05, 0.78), shelfBoardMat);
          shelf.position.y = sy;
          group.add(shelf);
          meshes.push(shelf);

          // Merchandise items on shelves
          if (s === 0) {
            // Detergents & cleaners
            for (let i = -1.0; i <= 1.0; i += 0.35) {
              const mat = Math.abs(i) < 0.2 ? bottleYellowMat : (i < 0 ? bottleRedMat : bottleBlueMat);
              const b = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.28, 8), mat);
              b.position.set(i, sy + 0.16, 0.1);
              group.add(b);
              meshes.push(b);
            }
          } else if (s === 1) {
            // Plastic storage boxes
            for (let i = -0.8; i <= 0.8; i += 0.5) {
              const mat = i < 0 ? boxCyanMat : boxPinkMat;
              const box = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.5), mat);
              box.position.set(i, sy + 0.13, 0);
              group.add(box);
              meshes.push(box);
            }
          } else if (s === 2) {
            // Tools & hardware packs
            for (let i = -0.9; i <= 0.9; i += 0.45) {
              const pack = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.25, 0.1), bottleRedMat);
              pack.position.set(i, sy + 0.15, -0.15);
              group.add(pack);
              meshes.push(pack);
            }
          }
        }

        // Top price banner
        const banner = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.22, 0.05), bottleRedMat);
        banner.position.set(0, 2.25, 0.4);
        group.add(banner);
        meshes.push(banner);
        break;
      }

      case "madrid_kiosk_press": {
        // Traditional Madrid Street Newspaper & Magazine Kiosk
        const kioskGreenMat = makeMat(0x1b3b22, 0.55, 0.2); // Madrid dark green kiosk
        const awningMat = makeMat(0x2e7d32, 0.65, 0.1);
        const glassMat = makeMat(0x80deea, 0.2, 0.2);
        const magCover1 = makeMat(0xd32f2f, 0.4, 0.05); // Marca / red cover
        const magCover2 = makeMat(0x1976d2, 0.4, 0.05); // General press / blue cover
        const magCover3 = makeMat(0xfbc02d, 0.4, 0.05); // Entertainment / yellow cover

        // Kiosk cabin
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.5, 2.1), kioskGreenMat);
        cabin.position.y = 1.25;
        group.add(cabin);
        meshes.push(cabin);

        // Service window hatch
        const hatch = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 0.1), glassMat);
        hatch.position.set(0, 1.35, 1.06);
        group.add(hatch);
        meshes.push(hatch);

        // Canopy roof overhang
        const roof = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.3, 2.3), awningMat);
        roof.position.y = 2.6;
        group.add(roof);
        meshes.push(roof);

        // Front and side newspaper / magazine display racks
        for (let r = 0; r < 2; r++) {
          const ry = 0.5 + r * 0.4;
          for (let col = -0.9; col <= 0.9; col += 0.4) {
            const coverMat = col < -0.3 ? magCover1 : (col > 0.3 ? magCover2 : magCover3);
            const mag = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.32, 0.04), coverMat);
            mag.position.set(col, ry, 1.08);
            group.add(mag);
            meshes.push(mag);
          }
        }
        break;
      }

      case "giant_goku_saiyan": {
        const gokuRes = LevelBuilder.createGokuMesh(quality);
        group.add(gokuRes.group);
        meshes.push(...gokuRes.meshes);
        break;
      }

      default: {
        const boxGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const box = new THREE.Mesh(boxGeo, makeMat(0x81c784));
        group.add(box);
        meshes.push(box);
      }
    }

    if (obj.scale && (obj.scale.x !== 1 || obj.scale.y !== 1 || obj.scale.z !== 1)) {
      group.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
    }

    group.position.set(obj.position.x, obj.position.y, obj.position.z);
    group.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);

    const isAnimated = subType === "bird" || subType === "flower";
    const decoration: ActiveDecoration | undefined = isAnimated
      ? {
          id: obj.id,
          subType,
          group,
          baseY: obj.position.y,
          baseRotY: obj.rotation.y,
          animOffset: Math.random() * Math.PI * 2,
          wings
        }
      : undefined;

    group.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.renderOrder = 0;
      }
    });

    return { group, decoration, meshes };
  }

  // ===========================================================================
  // ADVANCED 3D WORLD 2 MODELS (SHARED BETWEEN GAME AND 3D EDITOR)
  // ===========================================================================

  static createYachtMesh(quality: "low"|"medium"|"high"="medium",hullColor="#ffffff",cabinColor="#0277bd",stripeColor="#01579b"): {group:THREE.Group;meshes:THREE.Mesh[]} { return coastalYacht(quality,hullColor,cabinColor,stripeColor); }

static createMarketStallMesh(quality: "low"|"medium"|"high"="medium",stallType="fruit",color="#e53935",stripe="#ffffff"): {group:THREE.Group;meshes:THREE.Mesh[]} { return coastalStall(quality,stallType,color,stripe); }

static createShopMesh(quality: "low"|"medium"|"high"="medium",shopType="icecream",color="#00bcd4"): {group:THREE.Group;meshes:THREE.Mesh[]} { return coastalShop(quality,shopType,color); }

static createVerticalWheelMesh(
    radius = 3.5,
    width = 2.4,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[]; topTreadMesh: THREE.Mesh; tireMesh: THREE.Mesh } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const tireMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7 });
    const yellowTreadMat = new THREE.MeshStandardMaterial({ color: 0xffd600, roughness: 0.4 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.2, metalness: 0.85 });
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.3, metalness: 0.7 });
    const spokeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.9 });
    const reflectorMat = new THREE.MeshStandardMaterial({ color: 0xff6d00, roughness: 0.3, emissive: new THREE.Color(0xff6d00), emissiveIntensity: 0.35 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xffb300, roughness: 0.3, metalness: 0.8 });

    // 1. Outer Hollow Rubber Tire Tube (open ended along X)
    const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 36, 1, true);
    tireGeo.rotateZ(Math.PI / 2);
    const tire = new THREE.Mesh(tireGeo, tireMat);
    group.add(tire);
    meshes.push(tire);

    // Inner tire wall
    const innerTireGeo = new THREE.CylinderGeometry(radius - 0.35, radius - 0.35, width, 36, 1, true);
    innerTireGeo.rotateZ(Math.PI / 2);
    group.add(new THREE.Mesh(innerTireGeo, tireMat));

    // 2. High-visibility chunky rubber tread blocks around circumference (16 alternating blocks)
    const numTreads = 16;
    for (let i = 0; i < numTreads; i++) {
      const angle = (i * Math.PI * 2) / numTreads;
      const isYellow = i % 2 === 0;
      const tGeo = new THREE.BoxGeometry(width + 0.08, 0.22, 0.45);
      tGeo.translate(0, radius, 0);
      tGeo.rotateX(angle);
      const tMesh = new THREE.Mesh(tGeo, isYellow ? yellowTreadMat : tireMat);
      group.add(tMesh);
      meshes.push(tMesh);
    }

    // Top collision tread mesh
    const topTreadGeo = new THREE.BoxGeometry(width, 0.4, 3.2);
    topTreadGeo.translate(0, radius - 0.1, 0);
    const topTreadMesh = new THREE.Mesh(topTreadGeo, tireMat);
    group.add(topTreadMesh);
    meshes.push(topTreadMesh);

    // 3. Hollow Silver Alloy Rims (Left and Right flanges as Toruses so you can see right through the wheel!)
    const rimRadius = radius - 0.42;
    const rimTube = 0.16;
    for (const rx of [-width / 2 + 0.1, width / 2 - 0.1]) {
      const rimTorus = new THREE.Mesh(new THREE.TorusGeometry(rimRadius, rimTube, 12, 36), rimMat);
      rimTorus.rotateY(Math.PI / 2);
      rimTorus.position.x = rx;
      group.add(rimTorus);
      meshes.push(rimTorus);
    }

    // 4. Central Hub Axle
    const hubGeo = new THREE.CylinderGeometry(0.48, 0.48, width + 0.4, 16);
    hubGeo.rotateZ(Math.PI / 2);
    group.add(new THREE.Mesh(hubGeo, hubMat));

    // Axle nuts on both ends
    for (const nx of [-width / 2 - 0.25, width / 2 + 0.25]) {
      const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.15, 6), brassMat);
      nut.rotateZ(Math.PI / 2);
      nut.position.x = nx;
      group.add(nut);
    }

    // 5. Radial Metallic Spokes (20 pairs)
    const numSpokes = 20;
    const spokeLen = radius - 0.5;
    for (let i = 0; i < numSpokes; i++) {
      const angle = (i * Math.PI * 2) / numSpokes;
      const sGeo = new THREE.CylinderGeometry(0.035, 0.035, spokeLen, 6);
      sGeo.translate(0, spokeLen / 2, 0);
      sGeo.rotateX(angle);

      const spokeL = new THREE.Mesh(sGeo, spokeMat);
      spokeL.position.x = -width / 2 + 0.12;
      group.add(spokeL);

      const spokeR = new THREE.Mesh(sGeo, spokeMat);
      spokeR.position.x = width / 2 - 0.12;
      group.add(spokeR);

      // Spoke Reflectors at 90° and 270°
      if (i === 5 || i === 15) {
        const refGeo = new THREE.BoxGeometry(0.12, 0.38, 0.18);
        refGeo.translate(0, spokeLen * 0.55, 0);
        refGeo.rotateX(angle);
        const refL = new THREE.Mesh(refGeo, reflectorMat);
        refL.position.x = -width / 2 + 0.12;
        group.add(refL);
        const refR = new THREE.Mesh(refGeo, reflectorMat);
        refR.position.x = width / 2 - 0.12;
        group.add(refR);
      }
    }

    // 6. Brass Valve Stem
    const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8), brassMat);
    valve.position.set(0, radius - 0.55, 0);
    group.add(valve);

    return { group, meshes, topTreadMesh, tireMesh: tire };
  }

static getEMTBusDestinationTexture(line: string = "35", dest?: string): THREE.CanvasTexture {
    const key = `${line}_${dest || ""}`;
    const cached = this.emtBusDestMap.get(key);
    if (cached) return cached;

    if (typeof document === "undefined") {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.emtBusDestMap.set(key, retainSharedTexture(dummyTex));
      return dummyTex;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0c1017";
        ctx.fillRect(0, 0, 512, 128);

        // EMT Blue route badge
        ctx.fillStyle = "#0072ce";
        if (typeof ctx.roundRect === "function") {
          ctx.beginPath();
          ctx.roundRect(14, 14, 90, 100, 14);
          ctx.fill();
        } else {
          ctx.fillRect(14, 14, 90, 100);
        }

        // Line number
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 68px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(line, 59, 66);

        // Amber LED text
        const destinationText = dest || (line === "34" ? "34 LAS AGUILAS" : "CARABANCHEL ALTO");
        ctx.fillStyle = "#ffb700";
        ctx.font = "bold 34px monospace";
        ctx.textAlign = "left";
        ctx.fillText(destinationText, 120, 68);

        // Scanline effect
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        for (let y = 0; y < 128; y += 4) {
          ctx.fillRect(0, y, 512, 1.5);
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      this.emtBusDestMap.set(key, retainSharedTexture(tex));
      return tex;
    } catch {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.emtBusDestMap.set(key, retainSharedTexture(dummyTex));
      return dummyTex;
    }
  }

static getCPiquenasStreetMarkingTexture(): THREE.CanvasTexture {
    if (this.streetMarkingPiquenasTex) return this.streetMarkingPiquenasTex;

    if (typeof document === "undefined") {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.streetMarkingPiquenasTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 512, 256);
        ctx.fillStyle = "rgba(240, 240, 240, 0.95)";
        ctx.font = "bold 56px 'Arial Black', Impact, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("C. Piqueñas", 256, 128);
      }
      const tex = new THREE.CanvasTexture(canvas);
      this.streetMarkingPiquenasTex = retainSharedTexture(tex);
      return tex;
    } catch {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.streetMarkingPiquenasTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }
  }

static getAtletiJerseyTexture(): THREE.CanvasTexture {
    if (this.atletiJerseyTex) return this.atletiJerseyTex;

    if (typeof document === "undefined") {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.atletiJerseyTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Red background
        ctx.fillStyle = "#cb1313";
        ctx.fillRect(0, 0, 256, 256);

        // White vertical stripes (colchonero)
        ctx.fillStyle = "#ffffff";
        const stripeWidth = 32;
        for (let x = stripeWidth; x < 256; x += stripeWidth * 2) {
          ctx.fillRect(x, 0, stripeWidth, 256);
        }

        // Blue collar and shoulder accents
        ctx.fillStyle = "#1e3a8a";
        ctx.fillRect(0, 0, 256, 36);

        // Atlético Madrid crest on chest (left chest: approx x=65, y=95)
        ctx.save();
        ctx.translate(70, 95);
        // Shield shape
        ctx.beginPath();
        ctx.moveTo(-16, -20);
        ctx.lineTo(16, -20);
        ctx.lineTo(16, 6);
        ctx.quadraticCurveTo(16, 22, 0, 28);
        ctx.quadraticCurveTo(-16, 22, -16, 6);
        ctx.closePath();
        ctx.fillStyle = "#1e3a8a";
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#fbbf24"; // gold border
        ctx.stroke();

        // White-red mini stripes on lower part of crest
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-12, 2, 24, 18);
        ctx.fillStyle = "#cb1313";
        ctx.fillRect(-8, 2, 5, 18);
        ctx.fillRect(3, 2, 5, 18);

        // Blue upper area with bear/tree and stars suggestion
        ctx.fillStyle = "#1e3a8a";
        ctx.fillRect(-14, -18, 28, 18);
        ctx.fillStyle = "#ffffff";
        // 7 stars dots
        ctx.fillRect(-10, -14, 2, 2);
        ctx.fillRect(-4, -15, 2, 2);
        ctx.fillRect(2, -15, 2, 2);
        ctx.fillRect(8, -14, 2, 2);
        ctx.fillRect(-7, -7, 2, 2);
        ctx.fillRect(0, -6, 2, 2);
        ctx.fillRect(6, -7, 2, 2);
        ctx.restore();
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      this.atletiJerseyTex = retainSharedTexture(tex);
      return tex;
    } catch {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.atletiJerseyTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }
  }

static getGreenFloralDressTexture(): THREE.CanvasTexture {
    if (this.greenFloralDressTex) return this.greenFloralDressTex;

    if (typeof document === "undefined") {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.greenFloralDressTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Vibrant emerald / forest green background
        ctx.fillStyle = "#1b5e20";
        ctx.fillRect(0, 0, 256, 256);

        // Subtle leafy vine shade pattern
        ctx.fillStyle = "#2e7d32";
        for (let i = 0; i < 40; i++) {
          const x = (i * 47) % 256;
          const y = (i * 59) % 256;
          ctx.beginPath();
          ctx.ellipse(x, y, 9, 5, (i * 0.7), 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw scattered floral daisies / flowers (white petals with golden/orange center, and some pink/coral flowers)
        const flowers = [
          { x: 30, y: 35, r: 7, c: "#ffffff", center: "#f59e0b" },
          { x: 95, y: 25, r: 6, c: "#fbcfe8", center: "#fbbf24" },
          { x: 160, y: 40, r: 8, c: "#ffffff", center: "#f59e0b" },
          { x: 220, y: 30, r: 6, c: "#fef08a", center: "#ea580c" },
          { x: 50, y: 95, r: 7, c: "#fed7aa", center: "#c2410c" },
          { x: 125, y: 85, r: 9, c: "#ffffff", center: "#f59e0b" },
          { x: 190, y: 105, r: 7, c: "#fbcfe8", center: "#e11d48" },
          { x: 35, y: 160, r: 8, c: "#ffffff", center: "#f59e0b" },
          { x: 100, y: 150, r: 6, c: "#fef08a", center: "#d97706" },
          { x: 165, y: 175, r: 8, c: "#ffffff", center: "#f59e0b" },
          { x: 230, y: 160, r: 7, c: "#fed7aa", center: "#ea580c" },
          { x: 65, y: 225, r: 8, c: "#ffffff", center: "#f59e0b" },
          { x: 135, y: 215, r: 7, c: "#fbcfe8", center: "#be185d" },
          { x: 205, y: 220, r: 8, c: "#ffffff", center: "#f59e0b" },
        ];

        flowers.forEach(f => {
          // Petals (5 petals around center)
          ctx.fillStyle = f.c;
          for (let p = 0; p < 5; p++) {
            const angle = (p * Math.PI * 2) / 5;
            const px = f.x + Math.cos(angle) * (f.r * 0.7);
            const py = f.y + Math.sin(angle) * (f.r * 0.7);
            ctx.beginPath();
            ctx.arc(px, py, f.r * 0.55, 0, Math.PI * 2);
            ctx.fill();
          }
          // Center
          ctx.fillStyle = f.center;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r * 0.35, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      this.greenFloralDressTex = retainSharedTexture(tex);
      return tex;
    } catch {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.greenFloralDressTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }
  }

static getRealMadridJerseyTexture(): THREE.CanvasTexture {
    if (this.realMadridJerseyTex) return this.realMadridJerseyTex;

    if (typeof document === "undefined") {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.realMadridJerseyTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Pure crisp white jersey
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 256, 256);

        // Subtle athletic texture micro-stripes
        ctx.fillStyle = "#f8fafc";
        for (let x = 0; x < 256; x += 8) {
          ctx.fillRect(x, 0, 4, 256);
        }

        // Royal blue / purple diagonal sash & collar trim
        ctx.strokeStyle = "#1e3a8a";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(30, 240);
        ctx.lineTo(220, 20);
        ctx.stroke();

        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(35, 245);
        ctx.lineTo(225, 25);
        ctx.stroke();

        // Collar accent
        ctx.fillStyle = "#1e3a8a";
        ctx.fillRect(90, 0, 76, 12);

        // Real Madrid golden crest badge on left chest (x: ~68, y: ~75)
        ctx.fillStyle = "#f59e0b"; // Gold crown & circle
        ctx.beginPath();
        ctx.arc(68, 75, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(68, 75, 16, 0, Math.PI * 2);
        ctx.fill();

        // Diagonal purple band inside crest
        ctx.strokeStyle = "#7c3aed";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(56, 65);
        ctx.lineTo(80, 85);
        ctx.stroke();

        // Gold crown atop crest
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.moveTo(56, 56);
        ctx.lineTo(62, 50);
        ctx.lineTo(68, 54);
        ctx.lineTo(74, 50);
        ctx.lineTo(80, 56);
        ctx.closePath();
        ctx.fill();
      }
      const tex = new THREE.CanvasTexture(canvas);
      this.realMadridJerseyTex = retainSharedTexture(tex);
      return tex;
    } catch {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.realMadridJerseyTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }
  }

static getVintageTigerDressTexture(): THREE.CanvasTexture {
    if (this.vintageTigerDressTex) return this.vintageTigerDressTex;

    if (typeof document === "undefined") {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.vintageTigerDressTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Warm tawny golden-amber animal coat background
        ctx.fillStyle = "#d97706";
        ctx.fillRect(0, 0, 256, 256);

        // Shaded tiger gradients
        ctx.fillStyle = "#b45309";
        for (let y = 0; y < 256; y += 32) {
          ctx.fillRect(0, y, 256, 12);
        }

        // Dark brown / black elongated tiger stripes & leopard rosettes
        ctx.fillStyle = "#1c1917";
        const stripes = [
          { x: 15, y: 25, w: 55, h: 8, rot: 0.2 },
          { x: 120, y: 15, w: 70, h: 9, rot: -0.15 },
          { x: 200, y: 35, w: 45, h: 7, rot: 0.3 },
          { x: 40, y: 65, w: 65, h: 10, rot: -0.2 },
          { x: 150, y: 75, w: 80, h: 9, rot: 0.1 },
          { x: 10, y: 115, w: 75, h: 10, rot: 0.15 },
          { x: 110, y: 125, w: 60, h: 8, rot: -0.25 },
          { x: 190, y: 135, w: 55, h: 9, rot: 0.2 },
          { x: 35, y: 175, w: 70, h: 9, rot: -0.1 },
          { x: 130, y: 180, w: 85, h: 10, rot: 0.18 },
          { x: 20, y: 225, w: 60, h: 8, rot: 0.22 },
          { x: 115, y: 230, w: 75, h: 9, rot: -0.15 },
          { x: 205, y: 220, w: 45, h: 7, rot: 0.1 }
        ];

        stripes.forEach(s => {
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.rot);
          ctx.beginPath();
          ctx.ellipse(0, 0, s.w * 0.5, s.h * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          // Subtle inner tawny core of rosette
          ctx.fillStyle = "#78350f";
          ctx.beginPath();
          ctx.ellipse(0, 0, s.w * 0.25, s.h * 0.3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#1c1917";
          ctx.restore();
        });
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      this.vintageTigerDressTex = retainSharedTexture(tex);
      return tex;
    } catch {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.vintageTigerDressTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }
  }

static getChalkboardTexture(): THREE.CanvasTexture {
    if (this.chalkboardTex) return this.chalkboardTex;

    if (typeof document === "undefined") {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.chalkboardTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Deep matte school chalkboard green
        ctx.fillStyle = "#162e24";
        ctx.fillRect(0, 0, 512, 512);

        // Chalk dust clouds / eraser smudges
        ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
        for (let i = 0; i < 24; i++) {
          const cx = (i * 73) % 512;
          const cy = (i * 89) % 512;
          ctx.beginPath();
          ctx.arc(cx, cy, 35 + (i % 5) * 12, 0, Math.PI * 2);
          ctx.fill();
        }

        // Coordinate axes and math formulas in chalk white
        ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
        ctx.lineWidth = 2;

        // Coordinate axes
        ctx.beginPath();
        ctx.moveTo(40, 220);
        ctx.lineTo(160, 220);
        ctx.moveTo(60, 140);
        ctx.lineTo(60, 240);
        ctx.stroke();

        // Math text
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.font = "bold 24px serif";
        ctx.fillText("E = mc²", 70, 70);
        ctx.fillText("∫ f(x)dx = F(x)", 280, 80);
        ctx.fillText("α + β + γ = 180°", 60, 310);
        ctx.fillText("lim [sin x / x] = 1", 260, 310);
        ctx.fillText("∇ × B = μ₀J", 70, 440);
        ctx.fillText("f'(x) = 2x + C", 290, 440);

        // Geometry triangle sketch
        ctx.strokeStyle = "rgba(255, 235, 59, 0.65)"; // Yellow chalk
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(340, 210);
        ctx.lineTo(440, 210);
        ctx.lineTo(390, 130);
        ctx.closePath();
        ctx.stroke();
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      this.chalkboardTex = retainSharedTexture(tex);
      return tex;
    } catch {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.chalkboardTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }
  }

static getDogTongueTexture(): THREE.CanvasTexture {
    if (this.dogTongueTex) return this.dogTongueTex;

    if (typeof document === "undefined") {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.dogTongueTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Healthy canine pink gradient from center to edges
        const grad = ctx.createLinearGradient(0, 0, 512, 0);
        grad.addColorStop(0.0, "#ff4081"); // darker edge
        grad.addColorStop(0.12, "#ff6b9d");
        grad.addColorStop(0.48, "#ff80ab");
        grad.addColorStop(0.50, "#e91e63"); // Deep central sulcus groove
        grad.addColorStop(0.52, "#ff80ab");
        grad.addColorStop(0.88, "#ff6b9d");
        grad.addColorStop(1.0, "#ff4081");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        // Natural longitudinal striations
        ctx.fillStyle = "rgba(233, 30, 99, 0.15)";
        for (let i = 0; i < 40; i++) {
          const x = 30 + (i * 12.3) % 452;
          ctx.fillRect(x, 0, 1.8, 512);
        }

        // Papillae (filiform & fungiform taste buds)
        for (let i = 0; i < 500; i++) {
          const px = (i * 97) % 512;
          const py = (i * 149) % 512;
          const r = 1.2 + ((i % 5) * 0.4);
          // lighter highlight on top
          ctx.fillStyle = "rgba(255, 235, 238, 0.6)";
          ctx.beginPath();
          ctx.arc(px, py - 0.5, r, 0, Math.PI * 2);
          ctx.fill();
          // soft shadow below
          ctx.fillStyle = "rgba(194, 24, 91, 0.4)";
          ctx.beginPath();
          ctx.arc(px, py + 0.8, r * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 8);
      this.dogTongueTex = retainSharedTexture(tex);
      return tex;
    } catch {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.dogTongueTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }
  }

static getRonyFaceTexture(): THREE.CanvasTexture {
    if (this.ronyFaceTex) return this.ronyFaceTex;

    if (typeof document === "undefined") {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.ronyFaceTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // 1. Fondo con degradado radial de pelaje rubio canela dulce
        const bgGrad = ctx.createRadialGradient(256, 230, 30, 256, 256, 250);
        bgGrad.addColorStop(0, "#FFF0BD");
        bgGrad.addColorStop(0.35, "#EDB868");
        bgGrad.addColorStop(0.75, "#D99B41");
        bgGrad.addColorStop(1, "#B45309");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 512, 512);

        // Manto gris azulado oscuro superior en la coronilla / nuca
        const craniumGrad = ctx.createLinearGradient(0, 0, 0, 130);
        craniumGrad.addColorStop(0, "rgba(51, 65, 85, 0.95)");
        craniumGrad.addColorStop(0.65, "rgba(71, 85, 105, 0.6)");
        craniumGrad.addColorStop(1, "rgba(217, 155, 65, 0.0)");
        ctx.fillStyle = craniumGrad;
        ctx.fillRect(0, 0, 512, 130);

        // Pinceladas direccionales de pelo sedoso
        ctx.strokeStyle = "rgba(255, 240, 189, 0.45)";
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 65; i++) {
          const fx = 40 + (i * 17) % 432;
          const fy = 50 + (i * 23) % 400;
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.quadraticCurveTo(fx + (fx < 256 ? -15 : 15), fy + 22, fx + (fx < 256 ? -25 : 25), fy + 50);
          ctx.stroke();
        }

        // 2. Arcos de cejas rubias doradas suaves
        ctx.fillStyle = "#FFF0BD";
        ctx.beginPath();
        ctx.ellipse(175, 195, 36, 16, -0.15, 0, Math.PI * 2);
        ctx.ellipse(337, 195, 36, 16, 0.15, 0, Math.PI * 2);
        ctx.fill();

        // 3. Ojos de cachorro vivos, tiernos y brillantes (idénticos al sprite de Rony)
        const drawPuppyEye = (ex: number, ey: number) => {
          // Sombra oscura del párpado
          ctx.fillStyle = "#451A03";
          ctx.beginPath();
          ctx.arc(ex, ey, 38, 0, Math.PI * 2);
          ctx.fill();

          // Iris oscuro profundo
          ctx.fillStyle = "#090D16";
          ctx.beginPath();
          ctx.arc(ex, ey, 34, 0, Math.PI * 2);
          ctx.fill();

          // Borde ámbar cálido
          ctx.strokeStyle = "#92400E";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(ex, ey, 28, 0.2 * Math.PI, 0.8 * Math.PI);
          ctx.stroke();

          // Doble destello blanco especular brillante
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(ex - 9, ey - 9, 10, 0, Math.PI * 2);
          ctx.arc(ex + 10, ey + 10, 4.5, 0, Math.PI * 2);
          ctx.fill();
        };
        drawPuppyEye(175, 235);
        drawPuppyEye(337, 235);

        // 4. Bigote sedoso partido y perilla tierna
        const beardGrad = ctx.createLinearGradient(256, 290, 256, 490);
        beardGrad.addColorStop(0, "#FFF5D1");
        beardGrad.addColorStop(0.45, "#EDB868");
        beardGrad.addColorStop(1, "#D99B41");
        ctx.fillStyle = beardGrad;

        // Ala izquierda del bigote
        ctx.beginPath();
        ctx.moveTo(256, 305);
        ctx.quadraticCurveTo(80, 325, 95, 455);
        ctx.quadraticCurveTo(195, 475, 256, 390);
        ctx.fill();

        // Ala derecha del bigote
        ctx.beginPath();
        ctx.moveTo(256, 305);
        ctx.quadraticCurveTo(432, 325, 417, 455);
        ctx.quadraticCurveTo(317, 475, 256, 390);
        ctx.fill();

        // Mechones sedosos del bigote
        ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(240, 320); ctx.quadraticCurveTo(150, 370, 160, 435);
        ctx.moveTo(272, 320); ctx.quadraticCurveTo(362, 370, 352, 435);
        ctx.moveTo(256, 335); ctx.lineTo(256, 435);
        ctx.stroke();

        // 5. Trufa / Nariz negra de botón
        ctx.fillStyle = "#0F172A";
        ctx.beginPath();
        ctx.ellipse(256, 305, 34, 24, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hendidura nasal vertical
        ctx.strokeStyle = "#020617";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(256, 305);
        ctx.lineTo(256, 326);
        ctx.stroke();

        // Fosas nasales
        ctx.fillStyle = "#020617";
        ctx.beginPath();
        ctx.arc(242, 310, 5, 0, Math.PI * 2);
        ctx.arc(270, 310, 5, 0, Math.PI * 2);
        ctx.fill();

        // Brillo húmedo especular
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.beginPath();
        ctx.ellipse(247, 297, 10, 6, -0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      const tex = new THREE.CanvasTexture(canvas);
      this.ronyFaceTex = retainSharedTexture(tex);
      return tex;
    } catch {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.ronyFaceTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }
  }

static getTramDestinationTexture(): THREE.CanvasTexture {
    if (this.tramDestTex) return this.tramDestTex;

    if (typeof document === "undefined") {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.tramDestTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Dark matrix casing
      ctx.fillStyle = "#0c1017";
      ctx.fillRect(0, 0, 512, 128);

      // Route badge on left (Orange square with rounded corners)
      ctx.fillStyle = "#f37021";
      if (typeof ctx.roundRect === "function") {
        ctx.beginPath();
        ctx.roundRect(14, 14, 90, 100, 16);
        ctx.fill();
      } else {
        ctx.fillRect(14, 14, 90, 100);
      }

      // Line number "2"
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 80px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("2", 59, 66);

      // Amber glowing LED dot matrix text "LUCEROS - ALACANT"
      ctx.fillStyle = "#ffb300";
      ctx.font = "bold 44px monospace";
      ctx.textAlign = "left";
      ctx.fillText("LUCEROS - ALACANT", 125, 68);

      // Subtle horizontal scanline effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      for (let y = 0; y < 128; y += 4) {
        ctx.fillRect(0, y, 512, 1.5);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    this.tramDestTex = retainSharedTexture(tex);
    return tex;
  }

static createTramMesh(
    width = 3.6,
    height = 0.4,
    length = 7.2,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[]; floorMesh: THREE.Mesh } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const halfW = width / 2;
    const halfL = length / 2;
    const cabinH = 2.6; // High, spacious clearance (much taller than before!)
    const floorTopY = height / 2;

    // 1. Floor (dark transit non-slip floor)
    // Tuck the floor into the body shell: its outer faces must not coincide
    // with the skirts/rear panels as the moving carriage changes viewing angle.
    const floorGeo = new THREE.BoxGeometry(Math.max(.2,width - 0.28), height, Math.max(.2,length - 0.28));
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.7, metalness: 0.1 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    group.add(floorMesh);
    meshes.push(floorMesh);

    // Alicante TRAM signature materials (from user reference image):
    // Warm vibrant orange
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf37021, roughness: 0.35, metalness: 0.12 });
    // Clean modern white body panels
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf6f7f9, roughness: 0.38, metalness: 0.08 });
    // Dark anthracite / charcoal lower skirts and trims
    const darkSkirtMat = new THREE.MeshStandardMaterial({ color: 0x212529, roughness: 0.6, metalness: 0.2 });
    const blackTrimMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.45 });
    // Crystal clear panoramic glass: depthWrite: false and renderOrder = 25 ensures character inside is 100% visible!
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x80d8ff,
      roughness: 0.08,
      metalness: 0.12,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    // Chrome / steel
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x78909c, roughness: 0.25, metalness: 0.85 });
    // Warning yellow (door safety edge and interior grab rails)
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffb300, roughness: 0.35 });
    // Headlights (high intensity LED)
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffee, emissiveIntensity: 1.6, roughness: 0.1 });
    const amberMat = new THREE.MeshStandardMaterial({ color: 0xff9800, emissive: 0xff9800, emissiveIntensity: 1.2 });
    const tailMat = new THREE.MeshStandardMaterial({ color: 0xd50000, emissive: 0xd50000, emissiveIntensity: 1.5 });
    // Destination LED board
    const destTex = LevelBuilder.getTramDestinationTexture();
    const destMat = new THREE.MeshBasicMaterial({ map: destTex });

    const addMesh = (geo: THREE.BufferGeometry, mat: THREE.Material, isGlass = false): THREE.Mesh => {
      const m = new THREE.Mesh(geo, mat);
      if (isGlass) {
        m.renderOrder = 25; // Render after player so character is visible through glass!
      }
      group.add(m);
      meshes.push(m);
      return m;
    };

    // 2. Lower Charcoal Skirts (along left and right lower chassis)
    const skirtL = new THREE.BoxGeometry(0.2, 0.45, length - 0.08);
    skirtL.translate(-halfW + 0.065, floorTopY - 0.15, 0);
    addMesh(skirtL, darkSkirtMat);

    const skirtR = new THREE.BoxGeometry(0.2, 0.45, length - 0.08);
    skirtR.translate(halfW - 0.065, floorTopY - 0.15, 0);
    addMesh(skirtR, darkSkirtMat);

    // 3. Side Lower Body Walls (White panels with Alicante TRAM styling)
    const wallLGeo = new THREE.BoxGeometry(0.18, 0.9, length - 0.32);
    wallLGeo.translate(-halfW + 0.09, floorTopY + 0.45, -0.06);
    addMesh(wallLGeo, whiteMat);

    const wallRGeo = new THREE.BoxGeometry(0.18, 0.9, length - 0.32);
    wallRGeo.translate(halfW - 0.09, floorTopY + 0.45, -0.06);
    addMesh(wallRGeo, whiteMat);

    // Orange accent swoosh strips along the lower body
    const orangeStripeL = new THREE.BoxGeometry(0.22, 0.16, length * 0.55);
    orangeStripeL.translate(-halfW + 0.08, floorTopY + 0.25, -length * 0.15);
    addMesh(orangeStripeL, orangeMat);

    const orangeStripeR = new THREE.BoxGeometry(0.22, 0.16, length * 0.55);
    orangeStripeR.translate(halfW - 0.08, floorTopY + 0.25, -length * 0.15);
    addMesh(orangeStripeR, orangeMat);

    // Stylized TRAM "A" emblems on sides
    for (const sideX of [-halfW - 0.03, halfW + 0.03]) {
      const emblemGeo = new THREE.BoxGeometry(0.04, 0.45, 0.45);
      emblemGeo.translate(sideX, floorTopY + 0.55, 0.6);
      addMesh(emblemGeo, orangeMat);
    }

    // 4. Panoramic Side Glass Windows (Large, tall panoramic windows!)
    const glassH = 1.35;
    const glassCenterY = floorTopY + 0.9 + (glassH / 2);

    const glassLGeo = new THREE.BoxGeometry(0.08, glassH, length - 0.8);
    glassLGeo.translate(-halfW + 0.09, glassCenterY, 0);
    addMesh(glassLGeo, glassMat, true);

    const glassRGeo = new THREE.BoxGeometry(0.08, glassH, length - 0.8);
    glassRGeo.translate(halfW - 0.09, glassCenterY, 0);
    addMesh(glassRGeo, glassMat, true);

    // Black window pillars dividing the windows into bays
    for (const pz of [-2.0, -0.6, 0.8, 2.2]) {
      const pillarL = new THREE.BoxGeometry(0.19, glassH, 0.14);
      pillarL.translate(-halfW + 0.09, glassCenterY, pz);
      addMesh(pillarL, blackTrimMat);

      const pillarR = new THREE.BoxGeometry(0.19, glassH, 0.14);
      pillarR.translate(halfW - 0.09, glassCenterY, pz);
      addMesh(pillarR, blackTrimMat);
    }

    // Passenger doors with glass and yellow safety frame
    for (const dz of [-1.3, 1.5]) {
      const doorBorder1 = new THREE.BoxGeometry(0.195, glassH + 0.9, 0.1);
      doorBorder1.translate(halfW - 0.0525, floorTopY + (glassH + 0.9) / 2, dz - 0.45);
      addMesh(doorBorder1, yellowMat);

      const doorBorder2 = new THREE.BoxGeometry(0.195, glassH + 0.9, 0.1);
      doorBorder2.translate(halfW - 0.0525, floorTopY + (glassH + 0.9) / 2, dz + 0.45);
      addMesh(doorBorder2, yellowMat);
    }

    // 5. Upper Side Lintel (White band connecting windows to roof)
    const lintelH = 0.35;
    const lintelCenterY = floorTopY + 0.9 + glassH + lintelH / 2;

    const lintelL = new THREE.BoxGeometry(0.18, lintelH, length + 0.1);
    lintelL.translate(-halfW + 0.09, lintelCenterY, 0);
    addMesh(lintelL, whiteMat);

    const lintelR = new THREE.BoxGeometry(0.18, lintelH, length + 0.1);
    lintelR.translate(halfW - 0.09, lintelCenterY, 0);
    addMesh(lintelR, whiteMat);

    // 6. AERODYNAMIC FRONT CABIN (TRAM d'Alacant Signature Nose)
    // Curved orange front bumper
    const frontBumper = new THREE.BoxGeometry(width, 0.75, 0.5);
    frontBumper.translate(0, floorTopY + 0.35, -halfL - 0.15);
    addMesh(frontBumper, orangeMat);

    // Aerodynamic orange curved apron / nose pillar (curving upwards)
    const frontApron = new THREE.BoxGeometry(width, 0.55, 0.3);
    frontApron.translate(0, floorTopY + 0.75, -halfL - 0.05);
    addMesh(frontApron, orangeMat);

    // Dual modern wrap-around headlights
    for (const hx of [-halfW + 0.45, halfW - 0.45]) {
      const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.18, 0.08), headMat);
      headMesh.position.set(hx, floorTopY + 0.38, -halfL - 0.41);
      group.add(headMesh);
      meshes.push(headMesh);

      // Amber turn indicator
      const amberMesh = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.18, 0.08), amberMat);
      amberMesh.position.set(hx + (hx > 0 ? 0.22 : -0.22), floorTopY + 0.38, -halfL - 0.41);
      group.add(amberMesh);
      meshes.push(amberMesh);
    }

    // Front fleet number plate "4213"
    const plateGeo = new THREE.BoxGeometry(0.65, 0.15, 0.04);
    plateGeo.translate(0, floorTopY + 0.38, -halfL - 0.41);
    addMesh(plateGeo, blackTrimMat);

    // Front Panoramic Windscreen (Slanted back, crystal clear view!)
    const frontGlass = new THREE.BoxGeometry(width - 0.35, glassH + 0.2, 0.08);
    frontGlass.rotateX(0.12); // Sleek aerodynamic rake
    frontGlass.translate(0, glassCenterY + 0.05, -halfL + 0.02);
    addMesh(frontGlass, glassMat, true);

    // Windshield wiper
    const wiperArm = new THREE.BoxGeometry(0.04, 0.75, 0.04);
    wiperArm.rotateZ(0.25);
    wiperArm.translate(0.1, glassCenterY - 0.1, -halfL - 0.04);
    addMesh(wiperArm, blackTrimMat);

    // Top Destination LED Display ("2 LUCEROS - ALACANT")
    const destBox = new THREE.BoxGeometry(width * 0.75, 0.38, 0.12);
    destBox.translate(0, lintelCenterY, -halfL + 0.06);
    addMesh(destBox, blackTrimMat);

    const destScreen = new THREE.PlaneGeometry(width * 0.7, 0.32);
    destScreen.translate(0, lintelCenterY, -halfL - 0.01);
    addMesh(destScreen, destMat);

    // Orange aerodynamic cowl wrapping the roof over the cab
    const frontCowl = new THREE.BoxGeometry(width + 0.04, 0.32, 0.85);
    frontCowl.translate(0, lintelCenterY + 0.18, -halfL + 0.25);
    addMesh(frontCowl, orangeMat);

    // 7. REAR CABIN
    const rearWall = new THREE.BoxGeometry(width, 0.9, 0.22);
    rearWall.translate(0, floorTopY + 0.45, halfL - 0.11);
    addMesh(rearWall, whiteMat);

    const rearOrange = new THREE.BoxGeometry(width + 0.14, 0.25, 0.32);
    rearOrange.translate(0, floorTopY + 0.3, halfL - 0.11);
    addMesh(rearOrange, orangeMat);

    const rearGlass = new THREE.BoxGeometry(width - 0.5, glassH, 0.08);
    rearGlass.translate(0, glassCenterY, halfL - 0.11);
    addMesh(rearGlass, glassMat, true);

    const rearLintel = new THREE.BoxGeometry(width, lintelH, 0.22);
    rearLintel.translate(0, lintelCenterY, halfL - 0.11);
    addMesh(rearLintel, whiteMat);

    // Rear red tail lights
    for (const rx of [-halfW + 0.45, halfW - 0.45]) {
      const tailMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.06), tailMat);
      tailMesh.position.set(rx, floorTopY + 0.35, halfL + 0.02);
      group.add(tailMesh);
      meshes.push(tailMesh);
    }

    // 8. ROOF (Aerodynamic, enclosing the cabin from above)
    const roofY = floorTopY + cabinH;
    const roofGeo = new THREE.BoxGeometry(width + 0.12, 0.22, length + 0.15);
    roofGeo.translate(0, roofY, 0);
    addMesh(roofGeo, whiteMat);

    // Rooftop HVAC Air Conditioning Units
    for (const acZ of [-1.5, 1.5]) {
      const acGeo = new THREE.BoxGeometry(width * 0.58, 0.32, 1.6);
      acGeo.translate(0, roofY + 0.22, acZ);
      addMesh(acGeo, new THREE.MeshStandardMaterial({ color: 0xb0bec5, roughness: 0.5 }));

      // AC vent vents
      const ventGeo = new THREE.BoxGeometry(width * 0.5, 0.04, 1.3);
      ventGeo.translate(0, roofY + 0.39, acZ);
      addMesh(ventGeo, blackTrimMat);
    }

    // 9. MODERN ARTICULATED SINGLE-ARM PANTOGRAPH
    const pantoBase = new THREE.BoxGeometry(0.7, 0.1, 1.1);
    pantoBase.translate(0, roofY + 0.15, -0.1);
    addMesh(pantoBase, steelMat);

    // Articulated orange arms
    const lowerArm = new THREE.CylinderGeometry(0.045, 0.045, 1.1, 6);
    lowerArm.rotateX(0.45);
    lowerArm.translate(0, roofY + 0.58, -0.35);
    addMesh(lowerArm, orangeMat);

    const upperArm = new THREE.CylinderGeometry(0.04, 0.04, 1.25, 6);
    upperArm.rotateX(-0.55);
    upperArm.translate(0, roofY + 1.25, 0.15);
    addMesh(upperArm, orangeMat);

    // Collector head (overhead wire contact bar)
    const pantoHead = new THREE.BoxGeometry(1.85, 0.07, 0.22);
    pantoHead.translate(0, roofY + 1.72, 0.45);
    addMesh(pantoHead, steelMat);

    const hornL = new THREE.BoxGeometry(0.06, 0.15, 0.22);
    hornL.rotateZ(0.4);
    hornL.translate(-0.95, roofY + 1.68, 0.45);
    addMesh(hornL, steelMat);

    const hornR = new THREE.BoxGeometry(0.06, 0.15, 0.22);
    hornR.rotateZ(-0.4);
    hornR.translate(0.95, roofY + 1.68, 0.45);
    addMesh(hornR, steelMat);

    // 10. INTERIOR SAFETY DETAILS (Grab poles & Ceiling Light)
    for (const [px, pz] of [
      [-halfW + 0.65, -1.8],
      [halfW - 0.65, -1.8],
      [-halfW + 0.65, 0.2],
      [halfW - 0.65, 0.2],
      [-halfW + 0.65, 2.0],
      [halfW - 0.65, 2.0]
    ]) {
      const poleGeo = new THREE.CylinderGeometry(0.035, 0.035, cabinH - 0.1, 6);
      poleGeo.translate(px, floorTopY + (cabinH - 0.1) / 2, pz);
      addMesh(poleGeo, yellowMat);
    }

    // Overhead warm LED ceiling light strip (illuminates player and cabin interior)
    const ceilLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.06, length - 1.2),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xfff9c4,
        emissiveIntensity: 1.2,
        roughness: 0.2
      })
    );
    ceilLight.position.set(0, roofY - 0.12, 0);
    group.add(ceilLight);
    meshes.push(ceilLight);

    return { group, meshes, floorMesh };
  }

static createEMTBus35Mesh(
    width = 3.4,
    height = 0.45,
    length = 8.6,
    _quality: "low" | "medium" | "high" = "medium",
    _line: string = "35"
  ): { group: THREE.Group; meshes: THREE.Mesh[]; floorMesh: THREE.Mesh } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const halfW = width / 2;
    const halfL = length / 2;
    const cabinH = 2.45;
    const floorTopY = height / 2;

    // 1. Floor (transit non-slip dark floor)
    const floorGeo = new THREE.BoxGeometry(width - 0.2, height, length - 0.2);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.75, metalness: 0.1 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    group.add(floorMesh);
    meshes.push(floorMesh);

    // Materials
    const emtBlueMat = new THREE.MeshStandardMaterial({ color: 0x0072ce, roughness: 0.35, metalness: 0.12 });
    const darkSkirtMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.6, metalness: 0.2 });
    const whitePanelMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.08 });
    const blackTrimMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x80d8ff,
      roughness: 0.08,
      metalness: 0.15,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const yellowSafetyMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.35 });
    const seatBlueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5 });
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffee, emissiveIntensity: 1.8, roughness: 0.1 });
    const amberMat = new THREE.MeshStandardMaterial({ color: 0xff9800, emissive: 0xff9800, emissiveIntensity: 1.4 });
    const tailMat = new THREE.MeshStandardMaterial({ color: 0xd50000, emissive: 0xd50000, emissiveIntensity: 1.6 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.85 });

    const addMesh = (geo: THREE.BufferGeometry, mat: THREE.Material, isGlass = false): THREE.Mesh => {
      const m = new THREE.Mesh(geo, mat);
      if (isGlass) {
        m.renderOrder = 25;
      }
      group.add(m);
      meshes.push(m);
      return m;
    };

    // 2. Lower Dark Charcoal Skirt along sides
    const skirtH = 0.25;
    const skirtCenterY = floorTopY - skirtH / 2;
    const skirtL = new THREE.BoxGeometry(0.14, skirtH, length - 0.3);
    skirtL.translate(-halfW + 0.07, skirtCenterY, 0);
    addMesh(skirtL, darkSkirtMat);
    const skirtR = new THREE.BoxGeometry(0.14, skirtH, length - 0.3);
    skirtR.translate(halfW - 0.07, skirtCenterY, 0);
    addMesh(skirtR, darkSkirtMat);

    // 3. Side Lower Blue Body Panels
    const wallH = 0.85;
    const wallCenterY = floorTopY + wallH / 2;
    const wallLGeo = new THREE.BoxGeometry(0.16, wallH, length - 0.3);
    wallLGeo.translate(-halfW + 0.08, wallCenterY, 0);
    addMesh(wallLGeo, emtBlueMat);
    const wallRGeo = new THREE.BoxGeometry(0.16, wallH, length - 0.3);
    wallRGeo.translate(halfW - 0.08, wallCenterY, 0);
    addMesh(wallRGeo, emtBlueMat);

    // White EMT Corporate Arrow Graphics (chevron graphic on sides)
    for (const sideX of [-halfW - 0.012, halfW + 0.012]) {
      const arrowUpper = new THREE.BoxGeometry(0.03, 0.16, 0.9);
      arrowUpper.rotateX(-0.5);
      arrowUpper.translate(sideX, wallCenterY + 0.18, 0.8);
      addMesh(arrowUpper, whitePanelMat);
      const arrowLower = new THREE.BoxGeometry(0.03, 0.16, 0.9);
      arrowLower.rotateX(0.5);
      arrowLower.translate(sideX, wallCenterY - 0.18, 0.8);
      addMesh(arrowLower, whitePanelMat);

      // Fleet number "4339" on side
      const numDecal = new THREE.BoxGeometry(0.03, 0.16, 0.6);
      numDecal.translate(sideX, wallCenterY + 0.1, -1.8);
      addMesh(numDecal, whitePanelMat);
    }

    // 4. Large Panoramic Side Glass Windows
    const glassH = 1.35;
    const glassCenterY = floorTopY + wallH + (glassH / 2);
    const glassL = new THREE.BoxGeometry(0.06, glassH, length - 0.8);
    glassL.translate(-halfW + 0.06, glassCenterY, 0);
    addMesh(glassL, glassMat, true);
    const glassR = new THREE.BoxGeometry(0.06, glassH, length - 0.8);
    glassR.translate(halfW - 0.06, glassCenterY, 0);
    addMesh(glassR, glassMat, true);

    // Black Window Pillars
    for (const pz of [-2.4, -0.9, 0.6, 2.1]) {
      const pilL = new THREE.BoxGeometry(0.16, glassH, 0.14);
      pilL.translate(-halfW + 0.08, glassCenterY, pz);
      addMesh(pilL, blackTrimMat);
      const pilR = new THREE.BoxGeometry(0.16, glassH, 0.14);
      pilR.translate(halfW - 0.08, glassCenterY, pz);
      addMesh(pilR, blackTrimMat);
    }

    // Passenger Double Doors on Right Side with Yellow Safety Frame
    for (const dz of [-1.6, 1.4]) {
      const doorF1 = new THREE.BoxGeometry(0.16, wallH + glassH, 0.08);
      doorF1.translate(halfW - 0.07, floorTopY + (wallH + glassH) / 2, dz - 0.45);
      addMesh(doorF1, yellowSafetyMat);
      const doorF2 = new THREE.BoxGeometry(0.16, wallH + glassH, 0.08);
      doorF2.translate(halfW - 0.07, floorTopY + (wallH + glassH) / 2, dz + 0.45);
      addMesh(doorF2, yellowSafetyMat);
    }

    // 5. Upper Side Lintels (Connecting windows to roof)
    const lintelH = 0.25;
    const lintelCenterY = floorTopY + wallH + glassH + lintelH / 2;
    const lintelL = new THREE.BoxGeometry(0.22, lintelH, length + 0.05);
    lintelL.translate(-halfW + 0.11, lintelCenterY, 0);
    addMesh(lintelL, emtBlueMat);
    const lintelR = new THREE.BoxGeometry(0.22, lintelH, length + 0.05);
    lintelR.translate(halfW - 0.11, lintelCenterY, 0);
    addMesh(lintelR, emtBlueMat);

    // 6. FRONT CABIN (Scania N280UB Front)
    const frontBumper = new THREE.BoxGeometry(width, 0.65, 0.45);
    frontBumper.translate(0, floorTopY + 0.3, -halfL - 0.15);
    addMesh(frontBumper, emtBlueMat);
    const frontSkirt = new THREE.BoxGeometry(width, 0.22, 0.45);
    frontSkirt.translate(0, floorTopY - 0.08, -halfL - 0.15);
    addMesh(frontSkirt, darkSkirtMat);
    const grille = new THREE.BoxGeometry(1.6, 0.38, 0.06);
    grille.translate(0, floorTopY + 0.35, -halfL - 0.39);
    addMesh(grille, blackTrimMat);
    const scaniaBadge = new THREE.BoxGeometry(0.6, 0.08, 0.04);
    scaniaBadge.translate(0, floorTopY + 0.45, -halfL - 0.43);
    addMesh(scaniaBadge, chromeMat);
    const plate = new THREE.BoxGeometry(0.85, 0.16, 0.04);
    plate.translate(0, floorTopY + 0.16, -halfL - 0.39);
    addMesh(plate, whitePanelMat);
    const frontNum = new THREE.BoxGeometry(0.4, 0.12, 0.04);
    frontNum.translate(-1.1, floorTopY + 0.38, -halfL - 0.39);
    addMesh(frontNum, whitePanelMat);

    for (const hx of [-halfW + 0.45, halfW - 0.45]) {
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.08), headMat);
      head.position.set(hx, floorTopY + 0.36, -halfL - 0.39);
      const amb = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.08), amberMat);
      amb.position.set(hx + (hx > 0 ? 0.24 : -0.24), floorTopY + 0.36, -halfL - 0.39);
      group.add(head, amb);
      meshes.push(head, amb);
    }

    const frontGlass = new THREE.BoxGeometry(width - 0.3, glassH + 0.2, 0.08);
    frontGlass.rotateX(0.14);
    frontGlass.translate(0, glassCenterY + 0.05, -halfL + 0.04);
    addMesh(frontGlass, glassMat, true);

    const wiper1 = new THREE.BoxGeometry(0.04, 0.8, 0.04);
    wiper1.rotateZ(0.28);
    wiper1.translate(-0.4, glassCenterY - 0.1, -halfL - 0.06);
    addMesh(wiper1, blackTrimMat);
    const wiper2 = new THREE.BoxGeometry(0.04, 0.8, 0.04);
    wiper2.rotateZ(0.28);
    wiper2.translate(0.4, glassCenterY - 0.1, -halfL - 0.06);
    addMesh(wiper2, blackTrimMat);

    const destBox = new THREE.BoxGeometry(width * 0.82, 0.42, 0.14);
    destBox.translate(0, lintelCenterY + 0.04, -halfL + 0.06);
    addMesh(destBox, blackTrimMat);
    const destTex = LevelBuilder.getEMTBusDestinationTexture();
    const destScreen = new THREE.PlaneGeometry(width * 0.78, 0.36);
    destScreen.translate(0, lintelCenterY + 0.04, -halfL - 0.02);
    addMesh(destScreen, new THREE.MeshBasicMaterial({ map: destTex }));

    // 7. ROOF & CURVED WHITE CNG GAS POD
    const roofY = floorTopY + cabinH;
    const frontRoof = new THREE.BoxGeometry(width + 0.06, 0.2, 1.9);
    frontRoof.translate(0, roofY, -halfL + 0.95);
    addMesh(frontRoof, emtBlueMat);

    const cngPod = new THREE.BoxGeometry(width * 0.78, 0.48, 2.4);
    cngPod.translate(0, roofY + 0.28, -halfL + 1.35);
    addMesh(cngPod, whitePanelMat);
    const cngNose = new THREE.BoxGeometry(width * 0.72, 0.32, 0.5);
    cngNose.rotateX(0.35);
    cngNose.translate(0, roofY + 0.22, -halfL + 0.15);
    addMesh(cngNose, whitePanelMat);

    const rearRoof = new THREE.BoxGeometry(width + 0.06, 0.2, 1.6);
    rearRoof.translate(0, roofY, halfL - 0.8);
    addMesh(rearRoof, emtBlueMat);

    const rearAc = new THREE.BoxGeometry(width * 0.65, 0.3, 1.4);
    rearAc.translate(0, roofY + 0.2, halfL - 0.8);
    addMesh(rearAc, darkSkirtMat);

    // OPEN SKYLIGHT APERTURE: Side frame beams only, leaving center wide open for ball to drop in!
    const skylightFrameL = new THREE.BoxGeometry(0.35, 0.15, length - 3.5);
    skylightFrameL.translate(-halfW + 0.18, roofY, 0.15);
    addMesh(skylightFrameL, emtBlueMat);
    const skylightFrameR = new THREE.BoxGeometry(0.35, 0.15, length - 3.5);
    skylightFrameR.translate(halfW - 0.18, roofY, 0.15);
    addMesh(skylightFrameR, emtBlueMat);

    // 8. REAR CABIN & ENGINE
    const rearWall = new THREE.BoxGeometry(width, 1.1, 0.2);
    rearWall.translate(0, floorTopY + 0.55, halfL - 0.1);
    addMesh(rearWall, emtBlueMat);

    const rearGrille = new THREE.BoxGeometry(width * 0.65, 0.45, 0.04);
    rearGrille.translate(0, floorTopY + 0.45, halfL + 0.02);
    addMesh(rearGrille, blackTrimMat);

    const rearPlate = new THREE.BoxGeometry(0.85, 0.16, 0.04);
    rearPlate.translate(0, floorTopY + 0.18, halfL + 0.02);
    addMesh(rearPlate, whitePanelMat);

    const rearGlass = new THREE.BoxGeometry(width - 0.5, glassH * 0.75, 0.08);
    rearGlass.translate(0, glassCenterY + 0.15, halfL - 0.1);
    addMesh(rearGlass, glassMat, true);

    const rearRouteBox = new THREE.BoxGeometry(0.65, 0.32, 0.06);
    rearRouteBox.translate(0, lintelCenterY, halfL + 0.02);
    addMesh(rearRouteBox, blackTrimMat);

    for (const rx of [-halfW + 0.45, halfW - 0.45]) {
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.42, 0.06), tailMat);
      tail.position.set(rx, floorTopY + 0.45, halfL + 0.02);
      group.add(tail);
      meshes.push(tail);
    }

    // 9. INTERIOR PASSENGER DETAILS
    for (const sz of [-1.0, 0.4, 1.8]) {
      const seatBaseL = new THREE.BoxGeometry(0.85, 0.35, 0.45);
      seatBaseL.translate(-halfW + 0.65, floorTopY + 0.25, sz);
      const seatBackL = new THREE.BoxGeometry(0.85, 0.55, 0.1);
      seatBackL.translate(-halfW + 0.65, floorTopY + 0.65, sz + 0.22);
      addMesh(seatBaseL, seatBlueMat);
      addMesh(seatBackL, seatBlueMat);

      const seatBaseR = new THREE.BoxGeometry(0.85, 0.35, 0.45);
      seatBaseR.translate(halfW - 0.65, floorTopY + 0.25, sz);
      const seatBackR = new THREE.BoxGeometry(0.85, 0.55, 0.1);
      seatBackR.translate(halfW - 0.65, floorTopY + 0.65, sz + 0.22);
      addMesh(seatBaseR, seatBlueMat);
      addMesh(seatBackR, seatBlueMat);
    }

    // Yellow Safety Grab Poles
    for (const [px, pz] of [
      [-0.55, -1.8], [0.55, -1.8],
      [-0.55, 0.2], [0.55, 0.2],
      [-0.55, 2.2], [0.55, 2.2]
    ]) {
      const pole = new THREE.CylinderGeometry(0.035, 0.035, cabinH - 0.1, 6);
      pole.translate(px, floorTopY + (cabinH - 0.1) / 2, pz);
      addMesh(pole, yellowSafetyMat);
    }

    // Driver dashboard & steering wheel
    const dash = new THREE.BoxGeometry(0.9, 0.65, 0.7);
    dash.translate(-halfW + 0.65, floorTopY + 0.4, -halfL + 0.9);
    addMesh(dash, blackTrimMat);
    const wheel = new THREE.TorusGeometry(0.22, 0.03, 6, 12);
    wheel.rotateX(Math.PI / 4);
    wheel.translate(-halfW + 0.65, floorTopY + 0.82, -halfL + 0.8);
    addMesh(wheel, blackTrimMat);

    // 10. Wheels & Hubs
    for (const wz of [-halfL + 2.0, halfL - 2.1]) {
      for (const wx of [-halfW + 0.2, halfW - 0.2]) {
        const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.32, 16), tireMat);
        tire.rotation.z = Math.PI / 2;
        tire.position.set(wx, 0.0, wz);
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.34, 12), chromeMat);
        hub.rotation.z = Math.PI / 2;
        hub.position.set(wx, 0.0, wz);
        group.add(tire, hub);
        meshes.push(tire, hub);
      }
    }

    return { group, meshes, floorMesh };
  }


  static createCasinoRouletteMesh(
    radius = 7.5,
    dishHeight = 0.6,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[]; hubMesh: THREE.Mesh } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const numSectors = 12;
    const secAngle = (Math.PI * 2) / numSectors;
    const innerR = 1.4;

    // Central brass hub cone
    const centerHubGeo = new THREE.CylinderGeometry(0.8, 1.4, 1.0, 16);
    centerHubGeo.translate(0, dishHeight / 2 + 0.5, 0);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.2, metalness: 0.8 });
    const hubMesh = new THREE.Mesh(centerHubGeo, goldMat);
    group.add(hubMesh);
    meshes.push(hubMesh);

    // Cross bars on central hub
    const crossGeo1 = new THREE.BoxGeometry(2.4, 0.12, 0.18);
    crossGeo1.translate(0, dishHeight / 2 + 1.0, 0);
    group.add(new THREE.Mesh(crossGeo1, goldMat));
    const crossGeo2 = new THREE.BoxGeometry(0.18, 0.12, 2.4);
    crossGeo2.translate(0, dishHeight / 2 + 1.0, 0);
    group.add(new THREE.Mesh(crossGeo2, goldMat));

    // Outer Mahogany wooden rim (only around sectors 1..11, leaving sector 0 completely open!)
    // Sector 0 spans from -secAngle/2 to +secAngle/2.
    // The wooden rim covers the remaining 11 sectors from +secAngle/2 to 2*PI - secAngle/2.
    const rimArc = Math.PI * 2 - secAngle;
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.4 });
    const rimGeo = new THREE.TorusGeometry(radius, 0.2, 8, 44, rimArc);
    rimGeo.rotateZ(Math.PI / 2 + secAngle / 2);
    rimGeo.rotateX(Math.PI / 2);
    rimGeo.translate(0, dishHeight / 2 + 0.15, 0);
    const rimMesh = new THREE.Mesh(rimGeo, woodMat);
    group.add(rimMesh);
    meshes.push(rimMesh);

    const greenMat = new THREE.MeshStandardMaterial({
      color: 0x00e676,
      roughness: 0.35,
      emissive: new THREE.Color(0x00e676),
      emissiveIntensity: 0.3
    });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xc62828, roughness: 0.35 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.35 });

    for (let i = 0; i < numSectors; i++) {
      const angle = i * secAngle;
      const isZero = i === 0;
      const isRed = i % 2 === 1;
      const mat = isZero ? greenMat : isRed ? redMat : blackMat;

      // In Three.js CylinderGeometry, angle theta is measured from +Z towards +X:
      // vertex.x = radius * sin(theta), vertex.z = radius * cos(theta).
      const gap = 0.015;
      const thetaStart = angle - secAngle / 2 + gap;
      const thetaLength = secAngle - 2 * gap;

      if (isZero) {
        // Sector 0 is the OPEN CHUTE / HOLE: DO NOT ADD FLOOR GEOMETRY!
        // Green illuminated portal arches marking the drop hole entrance:
        const holeX = Math.sin(angle) * (radius - 0.3);
        const holeZ = Math.cos(angle) * (radius - 0.3);

        // Neon "0" beacon sign at the rim entrance
        const zeroSignGeo = new THREE.BoxGeometry(1.2, 0.48, 0.18);
        zeroSignGeo.rotateY(angle);
        zeroSignGeo.translate(holeX, dishHeight / 2 + 0.65, holeZ);
        group.add(new THREE.Mesh(zeroSignGeo, greenMat));

        // Twin glowing neon entrance pillars on left and right of the chute
        for (const side of [-1, 1]) {
          const sideAngle = angle + side * (secAngle / 2);
          const px = Math.sin(sideAngle) * (radius - 0.15);
          const pz = Math.cos(sideAngle) * (radius - 0.15);
          const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.2, 8), greenMat);
          pillar.position.set(px, dishHeight / 2 + 0.6, pz);
          group.add(pillar);
        }
      } else {
        // True non-overlapping circular wedge sector (for sectors 1..11)
        const wedgeGeo = new THREE.CylinderGeometry(
          radius - 0.25,
          radius - 0.25,
          dishHeight,
          8,
          1,
          false,
          thetaStart,
          thetaLength
        );
        wedgeGeo.translate(0, 0, 0);
        const wedgeMesh = new THREE.Mesh(wedgeGeo, mat);
        group.add(wedgeMesh);
        meshes.push(wedgeMesh);

        // Golden Fret Divider between sectors
        const fretAngle = angle + secAngle / 2;
        const fx = Math.sin(fretAngle) * ((radius + innerR) / 2);
        const fz = Math.cos(fretAngle) * ((radius + innerR) / 2);
        const fretLen = radius - innerR;
        const dividerHeight=(dishHeight+.2)*.25;
        const fretGeo = new THREE.BoxGeometry(0.08, dividerHeight, fretLen);
        fretGeo.rotateY(fretAngle);
        fretGeo.translate(fx, dishHeight / 2 + dividerHeight / 2, fz);
        const divider=new THREE.Mesh(fretGeo,goldMat);divider.name='roulette-divider';group.add(divider);meshes.push(divider);
      }
    }

    return { group, meshes, hubMesh };
  }


static createBicyclePedalMesh(
    width = 2.0,
    height = 0.35,
    length = 1.8,
    isLeft = false,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[]; pedalMesh: THREE.Mesh } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const pedalBodyGeo = new THREE.BoxGeometry(width, height, length);
    const pedalMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.5 });
    const pedalMesh = new THREE.Mesh(pedalBodyGeo, pedalMat);
    group.add(pedalMesh);
    meshes.push(pedalMesh);

    const reflMat = new THREE.MeshStandardMaterial({ color: 0xffb300, emissive: 0xff8f00, emissiveIntensity: 0.6 });
    const reflFGeo = new THREE.BoxGeometry(width * 0.8, 0.12, 0.06);
    reflFGeo.translate(0, 0, -length / 2 - 0.03);
    group.add(new THREE.Mesh(reflFGeo, reflMat));
    const reflBGeo = new THREE.BoxGeometry(width * 0.8, 0.12, 0.06);
    reflBGeo.translate(0, 0, length / 2 + 0.03);
    group.add(new THREE.Mesh(reflBGeo, reflMat));

    const crankGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 8);
    crankGeo.rotateZ(Math.PI / 2);
    const crankMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.2, metalness: 0.8 });
    const crankMesh = new THREE.Mesh(crankGeo, crankMat);
    crankMesh.position.set(isLeft ? width / 2 + 0.7 : -width / 2 - 0.7, 0, 0);
    group.add(crankMesh);

    return { group, meshes, pedalMesh };
  }

static createTramRailsMesh(
    width = 24.0,
    length = 24.0,
    cornerRadius = 4.0
  ): THREE.Group {
    return createClosedTramRails(width,length,cornerRadius);
  }

static createLimpKickerMesh(
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[]; castLeg: THREE.Group; crutchL: THREE.Group; crutchR: THREE.Group; torso: THREE.Mesh } {
    const kickerGroup = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const jacketMat = new THREE.MeshStandardMaterial({ color: 0x1976d2, roughness: 0.6 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcc80, roughness: 0.8 });
    const castMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.9 });
    const aluMat = new THREE.MeshStandardMaterial({ color: 0xb0bec5, metalness: 0.8, roughness: 0.2 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.5 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.55), jacketMat);
    torso.position.y = 1.5;
    kickerGroup.add(torso);
    meshes.push(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 6), skinMat);
    head.position.y = 2.35;
    kickerGroup.add(head);

    const boina = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.35, 0.12, 8), capMat);
    boina.position.set(0, 2.55, 0.05);
    kickerGroup.add(boina);

    // Crutches
    const crutchL = new THREE.Group();
    const crutchPoleL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.0, 6), aluMat);
    crutchPoleL.position.y = 1.0;
    const crutchCuffL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.18, 6, 1, true), aluMat);
    crutchCuffL.position.y = 1.7;
    const crutchHandleL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.2), jacketMat);
    crutchHandleL.position.y = 1.1;
    crutchL.add(crutchPoleL, crutchCuffL, crutchHandleL);
    crutchL.position.set(-0.75, 0, 0.1);
    kickerGroup.add(crutchL);

    const crutchR = new THREE.Group();
    const crutchPoleR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.0, 6), aluMat);
    crutchPoleR.position.y = 1.0;
    const crutchCuffR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.18, 6, 1, true), aluMat);
    crutchCuffR.position.y = 1.7;
    const crutchHandleR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.2), jacketMat);
    crutchHandleR.position.y = 1.1;
    crutchR.add(crutchPoleR, crutchCuffR, crutchHandleR);
    crutchR.position.set(0.75, 0, 0.1);
    kickerGroup.add(crutchR);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.9, 0.3), pantsMat);
    legR.position.set(0.25, 0.45, 0);
    kickerGroup.add(legR);

    // Left leg with white plaster cast
    const castLeg = new THREE.Group();
    castLeg.position.set(-0.25, 0.9, 0);
    const castThigh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.45, 0.32), pantsMat);
    castThigh.position.y = -0.22;
    const castMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.65, 8), castMat);
    castMesh.position.y = -0.55;
    const castFoot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.45), castMat);
    castFoot.position.set(0, -0.82, 0.1);
    castLeg.add(castThigh, castMesh, castFoot);
    kickerGroup.add(castLeg);

    return { group: kickerGroup, meshes, castLeg, crutchL, crutchR, torso };
  }

static createBeachKioskMesh(
    _quality: "low" | "medium" | "high" = "medium",
    stripeColor1 = "#00b4d8",
    stripeColor2 = "#ffffff"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const woodDeckMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.6 });
    const woodPostMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.65 });
    const woodCounterMat = new THREE.MeshStandardMaterial({ color: 0xbcaaa4, roughness: 0.45 });
    const c1 = new THREE.MeshStandardMaterial({ color: new THREE.Color(stripeColor1), roughness: 0.35 });
    const c2 = new THREE.MeshStandardMaterial({ color: new THREE.Color(stripeColor2), roughness: 0.35 });
    const signMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.7 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0xb2ebf2, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.65 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.25, metalness: 0.8 });
    const lanternMat = new THREE.MeshStandardMaterial({ color: 0xfff9c4, emissive: new THREE.Color(0xffd54f), emissiveIntensity: 0.8 });

    // 1. Solid Wooden Deck Platform (Scale 6.4 x 0.3 x 4.8)
    const deckGeo = new THREE.BoxGeometry(6.4, 0.3, 4.8);
    deckGeo.translate(0, 0.15, 0);
    const deck = new THREE.Mesh(deckGeo, woodDeckMat);
    group.add(deck);
    meshes.push(deck);

    // Deck edge perimeter curb
    const curbGeo = new THREE.BoxGeometry(6.6, 0.15, 5.0);
    curbGeo.translate(0, 0.075, 0);
    group.add(new THREE.Mesh(curbGeo, woodPostMat));

    // 2. 4 Timber/Bamboo Corner Posts
    const postGeo = new THREE.CylinderGeometry(0.09, 0.09, 3.2, 8);
    const postOffsets = [
      [-2.95, -2.15],
      [2.95, -2.15],
      [-2.95, 2.15],
      [2.95, 2.15]
    ];
    for (const [px, pz] of postOffsets) {
      const post = new THREE.Mesh(postGeo, woodPostMat);
      post.position.set(px, 1.6, pz);
      group.add(post);
      meshes.push(post);
    }

    // Rear wall wooden enclosure
    const rearGeo = new THREE.BoxGeometry(6.0, 2.6, 0.15);
    rearGeo.translate(0, 1.6, -2.2);
    const rearMesh = new THREE.Mesh(rearGeo, woodPostMat);
    group.add(rearMesh);
    meshes.push(rearMesh);

    // 3. Front Serving Counter & Lower Cabinet
    const counterBaseGeo = new THREE.BoxGeometry(5.6, 0.85, 1.3);
    counterBaseGeo.translate(0, 0.425 + 0.15, 0.4);
    const counterBase = new THREE.Mesh(counterBaseGeo, woodDeckMat);
    group.add(counterBase);
    meshes.push(counterBase);

    // Counter Top Surface
    const counterTopGeo = new THREE.BoxGeometry(5.8, 0.12, 1.5);
    counterTopGeo.translate(0, 0.85 + 0.21, 0.4);
    const counterTop = new THREE.Mesh(counterTopGeo, woodCounterMat);
    group.add(counterTop);
    meshes.push(counterTop);

    // 4. Striped Canvas Awning with Beach Slant
    const numStripes = 8;
    const stripeW = 6.4 / numStripes;
    for (let i = 0; i < numStripes; i++) {
      const sGeo = new THREE.BoxGeometry(stripeW, 0.1, 4.8);
      sGeo.rotateX(0.18);
      sGeo.translate(-3.2 + stripeW / 2 + i * stripeW, 3.0, 0.1);
      const sMesh = new THREE.Mesh(sGeo, i % 2 === 0 ? c1 : c2);
      group.add(sMesh);
      meshes.push(sMesh);
    }

    // Scalloped Front Valance
    const valanceGeo = new THREE.BoxGeometry(6.4, 0.35, 0.08);
    valanceGeo.translate(0, 2.6, -2.3);
    group.add(new THREE.Mesh(valanceGeo, c1));

    // Wooden Signboard "CHIRINGUITO DEL SOL"
    const signGeo = new THREE.BoxGeometry(4.2, 0.55, 0.12);
    signGeo.translate(0, 3.4, -2.25);
    const signMesh = new THREE.Mesh(signGeo, signMat);
    group.add(signMesh);

    // 4 Hanging Festoon Lanterns along the awning front
    for (const lx of [-2.4, -0.8, 0.8, 2.4]) {
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 4), woodPostMat);
      cord.position.set(lx, 2.65, -2.2);
      group.add(cord);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), lanternMat);
      bulb.position.set(lx, 2.45, -2.2);
      group.add(bulb);
    }

    // 5. Authentic Beach Merchandise Props
    // Gelato Display Case on left counter
    const gelatoCaseGeo = new THREE.BoxGeometry(1.6, 0.45, 0.9);
    gelatoCaseGeo.translate(-1.8, 1.25, 0.4);
    group.add(new THREE.Mesh(gelatoCaseGeo, glassMat));

    // 4 Gelato Scoops inside
    const flavorColors = [0xe91e63, 0xffeb3b, 0x4caf50, 0xff9800];
    for (let i = 0; i < 4; i++) {
      const scoopGeo = new THREE.SphereGeometry(0.12, 6, 6);
      scoopGeo.translate(-2.25 + i * 0.3, 1.2, 0.4);
      const scoopMat = new THREE.MeshStandardMaterial({ color: flavorColors[i], roughness: 0.5 });
      group.add(new THREE.Mesh(scoopGeo, scoopMat));
    }

    // Refreshment Drink Cans & Bottles on right counter
    const canColors = [0xd32f2f, 0x1976d2, 0x388e3c, 0xf57c00];
    for (let i = 0; i < 4; i++) {
      const canGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 8);
      canGeo.translate(1.2 + i * 0.28, 1.2, 0.4);
      const canMat = new THREE.MeshStandardMaterial({ color: canColors[i], roughness: 0.3, metalness: 0.6 });
      group.add(new THREE.Mesh(canGeo, canMat));
    }

    // Sunglasses Stand in center
    const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 6), metalMat);
    standPole.position.set(0.0, 1.3, 0.4);
    group.add(standPole);
    for (let i = 0; i < 3; i++) {
      const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.04), new THREE.MeshBasicMaterial({ color: 0x00e5ff }));
      glasses.position.set(0.0, 1.15 + i * 0.12, 0.42);
      group.add(glasses);
    }

    return { group, meshes };
  }

static createGiantUmbrellaMesh(
    radius = 7.5,
    _quality: "low" | "medium" | "high" = "medium",
    customColor = "#ff3d00",
    stripeColor = "#ffea00"
  ): { group: THREE.Group; canopyMesh: THREE.Mesh; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const mastMat = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.35, metalness: 0.25 });
    const c1 = new THREE.MeshStandardMaterial({ color: new THREE.Color(customColor), roughness: 0.4 });
    const c2 = new THREE.MeshStandardMaterial({ color: new THREE.Color(stripeColor), roughness: 0.4 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2, metalness: 0.5 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

    // 1. Central Mast
    const mastH = 4.8;
    const mastGeo = new THREE.CylinderGeometry(0.25, 0.28, mastH, 12);
    mastGeo.translate(0, mastH / 2, 0);
    const mast = new THREE.Mesh(mastGeo, mastMat);
    group.add(mast);
    meshes.push(mast);

    // 2. Umbrella Canopy Cone (16 alternating stripe segments)
    const numSlices = 16;
    const arc = (Math.PI * 2) / numSlices;
    const coneH = 1.1;

    for (let i = 0; i < numSlices; i++) {
      const thetaStart = i * arc;
      const coneGeo = new THREE.CylinderGeometry(0.6, radius, coneH, 1, 1, false, thetaStart, arc);
      coneGeo.translate(0, 0.2 + coneH / 2, 0);
      const coneMesh = new THREE.Mesh(coneGeo, i % 2 === 0 ? c1 : c2);
      group.add(coneMesh);
      meshes.push(coneMesh);
    }

    // Walking Platform Deck (Flush sturdy disk near the top so player rolls with high traction)
    const walkGeo = new THREE.CylinderGeometry(radius * 0.98, radius * 0.98, 0.35, 24);
    walkGeo.translate(0, 0.175, 0);
    const walkMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.35, metalness: 0.1 });
    const canopyMesh = new THREE.Mesh(walkGeo, walkMat);
    group.add(canopyMesh);
    meshes.push(canopyMesh);

    // Outer Perimeter Protective Lip / Trim
    const trimGeo = new THREE.TorusGeometry(radius - 0.15, 0.22, 8, 24);
    trimGeo.rotateX(Math.PI / 2);
    trimGeo.translate(0, 0.35, 0);
    const trimMesh = new THREE.Mesh(trimGeo, rimMat);
    group.add(trimMesh);
    meshes.push(trimMesh);

    // Golden Top Cap / Finial
    const topCapGeo = new THREE.SphereGeometry(0.55, 12, 12);
    topCapGeo.translate(0, mastH + 0.2, 0);
    const topCap = new THREE.Mesh(topCapGeo, capMat);
    group.add(topCap);
    meshes.push(topCap);

    return { group, canopyMesh, meshes };
  }

static createBeachTowelMesh(
    width = 5.8,
    length = 24.0,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; towelMesh: THREE.Mesh; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const navyMat = new THREE.MeshStandardMaterial({ color: 0x01579b, roughness: 0.7 });
    const cyanMat = new THREE.MeshStandardMaterial({ color: 0x00b0ff, roughness: 0.6 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const tasselMat = new THREE.MeshStandardMaterial({ color: 0xfff9c4, roughness: 0.8 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3, metalness: 0.4 });

    const towelH = 0.25;

    // 1. Alternating Terrycloth Beach Towel Stripes along Length
    const numStripes = 16;
    const stripeL = length / numStripes;
    const halfL = length / 2;

    for (let i = 0; i < numStripes; i++) {
      const sGeo = new THREE.BoxGeometry(width, towelH, stripeL);
      sGeo.translate(0, towelH / 2, -halfL + stripeL / 2 + i * stripeL);
      const mat = i % 3 === 0 ? navyMat : i % 3 === 1 ? cyanMat : whiteMat;
      const sMesh = new THREE.Mesh(sGeo, mat);
      group.add(sMesh);
      meshes.push(sMesh);
    }

    // 2. Underlying Solid Towel Bed Mesh
    const bedGeo = new THREE.BoxGeometry(width, towelH * 0.9, length);
    bedGeo.translate(0, (towelH * 0.9) / 2, 0);
    const towelMesh = new THREE.Mesh(bedGeo, navyMat);
    group.add(towelMesh);
    meshes.push(towelMesh);

    // 3. Fringed Tassels at Both Ends (-Z and +Z)
    const numTassels = 14;
    const tasselSpacing = (width - 0.4) / numTassels;
    for (let i = 0; i <= numTassels; i++) {
      const tx = -(width - 0.4) / 2 + i * tasselSpacing;
      // Front tassels (+Z)
      const tFrontGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.45, 6);
      tFrontGeo.rotateX(Math.PI / 2);
      tFrontGeo.translate(tx, towelH / 2, halfL + 0.22);
      group.add(new THREE.Mesh(tFrontGeo, tasselMat));

      // Back tassels (-Z)
      const tBackGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.45, 6);
      tBackGeo.rotateX(Math.PI / 2);
      tBackGeo.translate(tx, towelH / 2, -halfL - 0.22);
      group.add(new THREE.Mesh(tBackGeo, tasselMat));
    }

    // 4. Center Embroidered Sun Crest
    const sunGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.04, 16);
    sunGeo.translate(0, towelH + 0.02, 0);
    const sunMesh = new THREE.Mesh(sunGeo, goldMat);
    group.add(sunMesh);

    return { group, towelMesh, meshes };
  }

static createHippieStallMesh(
    _quality: "low" | "medium" | "high" = "medium",
    stallIndex = 1,
    customColor = "#ab47bc",
    isGoalStall = false
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const woodDeckMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 });
    const woodPostMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.75 });
    const canopyMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(customColor), roughness: 0.5 });
    const fringeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2, metalness: 0.6 });
    const crystalColors = [0x9c27b0, 0x00e5ff, 0x76ff03, 0xff1744, 0xffeb3b];

    const stallW = 4.8;
    const stallD = 3.6;

    // 1. Solid Driftwood Platform Deck (Elevated floor so player NEVER falls through!)
    const deckGeo = new THREE.BoxGeometry(stallW, 0.25, stallD);
    deckGeo.translate(0, 0.125, 0);
    const deck = new THREE.Mesh(deckGeo, woodDeckMat);
    group.add(deck);
    meshes.push(deck);

    // 2. 4 Rustic Timber Corner Posts
    const halfW = stallW / 2 - 0.2;
    const halfD = stallD / 2 - 0.2;
    const postGeo = new THREE.BoxGeometry(0.18, 2.8, 0.18);
    const offsets = [
      [-halfW, -halfD],
      [halfW, -halfD],
      [-halfW, halfD],
      [halfW, halfD]
    ];
    for (const [px, pz] of offsets) {
      const post = new THREE.Mesh(postGeo, woodPostMat);
      post.position.set(px, 1.4, pz);
      group.add(post);
      meshes.push(post);
    }

    // Rear Bohemian Tapestry Backdrop
    const rearGeo = new THREE.BoxGeometry(stallW - 0.4, 2.2, 0.08);
    rearGeo.translate(0, 1.4, -halfD);
    const rearMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(customColor).offsetHSL(0.08, 0, -0.1), roughness: 0.6 });
    const rear = new THREE.Mesh(rearGeo, rearMat);
    group.add(rear);
    meshes.push(rear);

    // 3. Draped Tie-Dye Bohemian Canopy
    const roofGeo = new THREE.BoxGeometry(stallW + 0.2, 0.12, stallD + 0.2);
    roofGeo.rotateX(0.12);
    roofGeo.translate(0, 2.7, 0);
    const roof = new THREE.Mesh(roofGeo, canopyMat);
    group.add(roof);
    meshes.push(roof);

    // Hanging Valance Fringe
    const valanceGeo = new THREE.BoxGeometry(stallW, 0.25, 0.06);
    valanceGeo.translate(0, 2.45, halfD + 0.05);
    group.add(new THREE.Mesh(valanceGeo, fringeMat));

    // Bohemian Dreamcatcher hanging from center roof
    const ringGeo = new THREE.TorusGeometry(0.28, 0.03, 6, 16);
    ringGeo.translate(0, 2.2, halfD - 0.2);
    group.add(new THREE.Mesh(ringGeo, goldMat));
    for (let f = -1; f <= 1; f++) {
      const featherGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.28, 4);
      featherGeo.translate(f * 0.12, 1.88, halfD - 0.2);
      group.add(new THREE.Mesh(featherGeo, fringeMat));
    }

    if (isGoalStall) {
      // 4. GOAL STALL: Grand mystical bohemian gateway concealing the goal portal!
      const archL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.4, 0.2), goldMat);
      archL.position.set(-1.2, 1.2, halfD - 0.3);
      group.add(archL);
      const archR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.4, 0.2), goldMat);
      archR.position.set(1.2, 1.2, halfD - 0.3);
      group.add(archR);
      const archTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.2, 0.2), goldMat);
      archTop.position.set(0, 2.4, halfD - 0.3);
      group.add(archTop);
      meshes.push(archL,archR,archTop);

      // Shimmering mystical crystals on side pedestals
      for (const sx of [-1.5, 1.5]) {
        const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.8, 8), woodDeckMat);
        ped.position.set(sx, 0.5, 0);
        group.add(ped);
        meshes.push(ped);
        const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.22), new THREE.MeshStandardMaterial({
          color: 0xffd700,
          emissive: new THREE.Color(0xffd700),
          emissiveIntensity: 0.85
        }));
        crystal.position.set(sx, 1.05, 0);
        group.add(crystal);
      }
    } else {
      // 5. NORMAL HIPPIE STALL: Authentic artisanal market merchandise!
      // Artisan wooden counter table
      const tableGeo = new THREE.BoxGeometry(stallW - 0.8, 0.18, 1.2);
      tableGeo.translate(0, 0.8, 0.2);
      const table = new THREE.Mesh(tableGeo, woodDeckMat);
      group.add(table);
      meshes.push(table);

      // Velvet jewelry display trays with healing crystals & gemstones
      const trayGeo = new THREE.BoxGeometry(1.2, 0.08, 0.8);
      const trayMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.8 });
      for (let tx = -1.2; tx <= 1.2; tx += 1.2) {
        const tray = new THREE.Mesh(trayGeo, trayMat);
        tray.position.set(tx, 0.92, 0.2);
        group.add(tray);

        // Gemstones in tray
        for (let gx = -0.35; gx <= 0.35; gx += 0.35) {
          const gemGeo = new THREE.OctahedronGeometry(0.08);
          gemGeo.translate(tx + gx, 1.02, 0.2);
          const gemMat = new THREE.MeshStandardMaterial({
            color: crystalColors[(stallIndex + Math.abs(Math.round(gx * 10))) % crystalColors.length],
            roughness: 0.15,
            metalness: 0.3
          });
          group.add(new THREE.Mesh(gemGeo, gemMat));
        }
      }

      // Incense burner with burning ember
      const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.12, 6), goldMat);
      burner.position.set(-1.8, 0.95, 0.5);
      group.add(burner);
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.35, 4), new THREE.MeshBasicMaterial({ color: 0xff3d00 }));
      stick.rotation.z = 0.2;
      stick.position.set(-1.78, 1.12, 0.5);
      group.add(stick);

      // Acoustic Spanish Guitar leaning against side timber post
      const guitarBody = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.12, 10), new THREE.MeshStandardMaterial({ color: 0xd78f44, roughness: 0.4 }));
      guitarBody.rotation.x = Math.PI / 2;
      guitarBody.rotation.z = 0.25;
      guitarBody.position.set(halfW - 0.2, 0.55, -0.4);
      group.add(guitarBody);

      const guitarNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.65, 6), woodPostMat);
      guitarNeck.rotation.z = -0.3;
      guitarNeck.position.set(halfW - 0.12, 0.95, -0.4);
      group.add(guitarNeck);
    }

    return { group, meshes };
  }

static createWaveMesh(
    width = 2.8,
    height = 0.55,
    depth = 4.5,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; waveMesh: THREE.Mesh; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x00b4d8,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const foamMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.75,
      metalness: 0.05
    });

    // 1. Curling ocean wave ramp body
    const waveGeo = new RoundedBoxGeometry(width, height, depth, 2, Math.min(.08,height*.15));
    waveGeo.translate(0, height / 2, 0);
    const waveMesh = new THREE.Mesh(waveGeo, waterMat);
    group.add(waveMesh);
    meshes.push(waveMesh);

    // 2. White froth foam crest curling over the peak
    // A single rounded crest has no flat caps coplanar with the water ends.
    const foamGeo = new THREE.CapsuleGeometry(0.18, Math.max(.01,depth-.36), 4, 12);
    foamGeo.rotateX(Math.PI / 2);
    foamGeo.translate(-width / 2 + 0.1, height + 0.05, 0);
    const foamMesh = new THREE.Mesh(foamGeo, foamMat);
    group.add(foamMesh);
    meshes.push(foamMesh);

    return { group, waveMesh, meshes };
  }

static createTramStraightRailsMesh(
    length = 144.0,
    width = 4.8
  ): THREE.Group {
    const group = new THREE.Group();
    const steelMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.25, metalness: 0.85 });
    const tieMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 });
    const ballastMat = new THREE.MeshStandardMaterial({ color: 0x455a64, roughness: 0.85 });
    const catenaryMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.4, metalness: 0.75 });
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xff7043, roughness: 0.3, metalness: 0.85 });

    // 1. Ballast Stone Bed
    const ballastGeo = new THREE.BoxGeometry(width, 0.16, length);
    ballastGeo.translate(0, 0.08, 0);
    group.add(new THREE.Mesh(ballastGeo, ballastMat));

    // 2. Wooden Railroad Ties
    const tieStep = 1.5;
    const tieCount = Math.floor(length / tieStep);
    const startZ = -length / 2 + tieStep / 2;
    for (let i = 0; i < tieCount; i++) {
      const z = startZ + i * tieStep;
      const tie = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.12, 0.35), tieMat);
      tie.position.set(0, 0.14, z);
      group.add(tie);
    }

    // 3. Double Steel Rails
    for (const rx of [-0.75, 0.75]) {
      const railGeo = new THREE.BoxGeometry(0.1, 0.14, length);
      railGeo.translate(rx, 0.24, 0);
      group.add(new THREE.Mesh(railGeo, steelMat));
    }

    // 4. Overhead Catenary Posts and Contact Wire
    const poleStep = 24.0;
    const poleCount = Math.floor(length / poleStep);
    for (let i = 0; i <= poleCount; i++) {
      const pz = -length / 2 + i * poleStep;
      // Mast
      const mastGeo = new THREE.CylinderGeometry(0.09, 0.11, 4.6, 8);
      mastGeo.translate(2.8, 2.3, pz);
      group.add(new THREE.Mesh(mastGeo, catenaryMat));

      // Horizontal Cantilever Arm
      const armGeo = new THREE.BoxGeometry(3.2, 0.08, 0.08);
      armGeo.translate(1.3, 4.4, pz);
      group.add(new THREE.Mesh(armGeo, catenaryMat));

      // Insulator
      const insGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.22, 6);
      insGeo.translate(0, 4.25, pz);
      group.add(new THREE.Mesh(insGeo, catenaryMat));
    }

    // Contact Wire along the whole track
    const wireGeo = new THREE.CylinderGeometry(0.02, 0.02, length, 6);
    wireGeo.rotateX(Math.PI / 2);
    wireGeo.translate(0, 4.14, 0);
    group.add(new THREE.Mesh(wireGeo, wireMat));

    return group;
  }

static createGiantBouncyPalmMesh(
    _quality: "low" | "medium" | "high" = "medium",
    palmIndex = 1
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const barkMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.8 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.5 });
    const nutMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.8 });

    // Curved Coconut Trunk
    const trunkHeight = 6.0;
    const numSegs = 6;
    const segH = trunkHeight / numSegs;
    const curveSign = palmIndex % 2 === 0 ? 1 : -1;

    for (let i = 0; i < numSegs; i++) {
      const rBottom = 0.85 - i * 0.08;
      const rTop = 0.77 - i * 0.08;
      const segGeo = new THREE.CylinderGeometry(rTop, rBottom, segH, 10);
      segGeo.translate(0, segH / 2, 0);
      const seg = new THREE.Mesh(segGeo, barkMat);
      seg.position.set(curveSign * Math.sin(i * 0.25) * 0.4, i * segH, 0);
      seg.rotation.z = -curveSign * i * 0.04;
      group.add(seg);
      meshes.push(seg);
    }

    // Coconuts Cluster
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      const nut = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), nutMat);
      nut.position.set(curveSign * 0.4 + Math.cos(a) * 0.35, trunkHeight - 0.2, Math.sin(a) * 0.35);
      group.add(nut);meshes.push(nut);
    }

    // 6 Spreading Giant Palm Fronds
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const leafGeo = new THREE.BoxGeometry(1.6, 0.12, 4.2);
      leafGeo.rotateX(0.35);
      leafGeo.translate(0, 0.2, 2.1);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      const pivot = new THREE.Group();
      pivot.position.set(curveSign * 0.4, trunkHeight, 0);
      pivot.rotation.y = angle;
      pivot.add(leaf);
      group.add(pivot);
      meshes.push(leaf);
    }

    return { group, meshes };
  }

static createMercadonaShelvesMesh(
    width = 3.6,
    height = 2.4,
    depth = 12.0,
    department = "fruit",
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const mGreen = new THREE.MeshStandardMaterial({ color: 0x007a3d, roughness: 0.35 });
    const mYellow = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.35 });
    const shelfWhite = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.4 });
    const darkBase = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.7 });

    // 1. Central Double-Sided Divider Spine
    const spineGeo = new THREE.BoxGeometry(0.18, height, depth);
    spineGeo.translate(0, height / 2, 0);
    const spine = new THREE.Mesh(spineGeo, mGreen);
    group.add(spine);
    meshes.push(spine);

    // 2. Base Pedestal
    const baseGeo = new THREE.BoxGeometry(width, 0.2, depth + 0.2);
    baseGeo.translate(0, 0.1, 0);
    const base = new THREE.Mesh(baseGeo, darkBase);
    group.add(base);
    meshes.push(base);

    // 3. Shelves (3 Tiers on both sides)
    const tiers = [0.45, 1.15, 1.85];
    for (const ty of tiers) {
      const sGeo = new THREE.BoxGeometry(width - 0.2, 0.08, depth);
      sGeo.translate(0, ty, 0);
      const sMesh = new THREE.Mesh(sGeo, shelfWhite);
      group.add(sMesh);
      meshes.push(sMesh);
    }

    // 4. Yellow Header Banner Strip
    const bannerGeo = new THREE.BoxGeometry(width + 0.1, 0.35, depth + 0.2);
    bannerGeo.translate(0, height - 0.15, 0);
    const banner = new THREE.Mesh(bannerGeo, mYellow);
    group.add(banner);
    meshes.push(banner);

    // 5. Endcaps (Cabeceras de Góndola) at -Z and +Z
    for (const sign of [-1, 1]) {
      const capGeo = new THREE.BoxGeometry(width + 0.05, height, 0.2);
      capGeo.translate(0, height / 2, sign * (depth / 2 + 0.1));
      const cap = new THREE.Mesh(capGeo, mGreen);
      group.add(cap);
      meshes.push(cap);
    }

    // 6. Department 3D Products
    const prodCount = 8;
    const prodStep = depth / prodCount;
    const prodColors =
      department === "fruit"
        ? [0xff9800, 0xffeb3b, 0x4caf50, 0xe91e63]
        : department === "fish"
        ? [0x80deea, 0x00bcd4, 0xb0bec5, 0x0288d1]
        : department === "meat"
        ? [0xd32f2f, 0xc2185b, 0x880e4f, 0xe57373]
        : department === "dairy"
        ? [0xffffff, 0x0288d1, 0xffeb3b, 0x4caf50]
        : department === "perfume"
        ? [0xe040fb, 0x7c4dff, 0x00e5ff, 0xff4081]
        : [0x81d4fa, 0x29b6f6, 0x0288d1, 0x01579b];

    for (let i = 0; i < prodCount; i++) {
      const z = -depth / 2 + prodStep / 2 + i * prodStep;
      for (const side of [-1, 1]) {
        for (const ty of [0.55, 1.25]) {
          const col = prodColors[(i + (side > 0 ? 1 : 0)) % prodColors.length];
          const prodMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.4 });
          const prod = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, prodStep * 0.75), prodMat);
          prod.position.set(side * (width / 4), ty + 0.15, z);
          group.add(prod);
        }
      }
    }

    return { group, meshes };
  }

static createSupermarketCheckoutMesh(
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const grayMat = new THREE.MeshStandardMaterial({ color: 0xb0bec5, roughness: 0.35 });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x007a3d, roughness: 0.35 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.8 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x80deea, roughness: 0.1, transparent: true, opacity: 0.65 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });

    // Counter Body
    const bodyGeo = new THREE.BoxGeometry(2.4, 0.85, 3.6);
    bodyGeo.translate(0, 0.425, 0);
    const body = new THREE.Mesh(bodyGeo, grayMat);
    group.add(body);
    meshes.push(body);

    // Green Trim Skirt
    const skirtGeo = new THREE.BoxGeometry(2.45, 0.15, 3.65);
    skirtGeo.translate(0, 0.075, 0);
    group.add(new THREE.Mesh(skirtGeo, greenMat));

    // Black Conveyor Belt on Top
    const beltGeo = new THREE.BoxGeometry(1.4, 0.05, 3.4);
    beltGeo.translate(-0.35, 0.88, 0);
    const belt = new THREE.Mesh(beltGeo, beltMat);
    group.add(belt);
    meshes.push(belt);

    // Scanner Window Plate
    const scanGeo = new THREE.BoxGeometry(0.45, 0.04, 0.45);
    scanGeo.translate(-0.35, 0.92, -0.4);
    group.add(new THREE.Mesh(scanGeo, glassMat));

    // POS Screen on Pole
    const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.55, 6);
    poleGeo.translate(0.65, 1.15, -0.4);
    group.add(new THREE.Mesh(poleGeo, blackMat));

    const screenGeo = new THREE.BoxGeometry(0.35, 0.25, 0.05);
    screenGeo.translate(0.65, 1.45, -0.4);
    group.add(new THREE.Mesh(screenGeo, blackMat));

    return { group, meshes };
  }

static createShoppingCartBayMesh(
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const wireMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.25, metalness: 0.85 });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x007a3d, roughness: 0.35 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.8 });

    // 4 Nested Shopping Carts
    for (let i = 0; i < 4; i++) {
      const z = -1.2 + i * 0.8;
      // Basket Wire Box
      const basketGeo = new THREE.BoxGeometry(1.1, 0.65, 1.3);
      basketGeo.translate(0, 0.65, z);
      const basket = new THREE.Mesh(basketGeo, wireMat);
      group.add(basket);
      meshes.push(basket);

      // Green Handle
      const handleGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.0, 8);
      handleGeo.rotateZ(Math.PI / 2);
      handleGeo.translate(0, 0.95, z + 0.6);
      group.add(new THREE.Mesh(handleGeo, greenMat));

      // Wheels
      for (const wx of [-0.5, 0.5]) {
        for (const wz of [-0.5, 0.5]) {
          const w = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 8), wheelMat);
          w.rotateZ(Math.PI / 2);
          w.position.set(wx, 0.1, z + wz);
          group.add(w);
        }
      }
    }

    return { group, meshes };
  }

static createBazarShelfMesh(
    width = 1.6,
    height = 2.8,
    depth = 12.0,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.45 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.25, metalness: 0.6 });
    const carpetMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.7 });
    const vaseMat = new THREE.MeshStandardMaterial({ color: 0x0288d1, roughness: 0.2, metalness: 0.3 });

    // 1. Tall Wooden Shelf Body
    const bodyGeo = new THREE.BoxGeometry(width, height, depth);
    bodyGeo.translate(0, height / 2, 0);
    const body = new THREE.Mesh(bodyGeo, woodMat);
    group.add(body);
    meshes.push(body);

    // 2. Gold Crown Cornice
    const crownGeo = new THREE.BoxGeometry(width + 0.15, 0.2, depth + 0.15);
    crownGeo.translate(0, height + 0.1, 0);
    const crown = new THREE.Mesh(crownGeo, goldMat);
    group.add(crown);
    meshes.push(crown);

    // 3. Display Items (Rolled oriental carpets and vases on top/sides)
    const itemCount = 6;
    const step = depth / itemCount;
    for (let i = 0; i < itemCount; i++) {
      const z = -depth / 2 + step / 2 + i * step;
      if (i % 2 === 0) {
        // Rolled Rug
        const rug = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, width * 0.8, 8), carpetMat);
        rug.rotateZ(Math.PI / 2);
        rug.position.set(0, height + 0.35, z);
        group.add(rug);
      } else {
        // Porcelain Vase
        const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 0.6, 8), vaseMat);
        vase.position.set(0, height + 0.4, z);
        group.add(vase);
      }
    }

    return { group, meshes };
  }

static createClotheslineMesh(
    width = 6.2,
    clothColor = "#ffffff",
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const postMat = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.7 });
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x78909c, roughness: 0.3, metalness: 0.8 });
    const cloth1Mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(clothColor), roughness: 0.65, side: THREE.DoubleSide });
    const cloth2Mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.65, side: THREE.DoubleSide });
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xa1887f, roughness: 0.8 });

    const postH = 2.6;
    const halfW = width / 2;

    // 1. Two Side Wall Anchor Posts
    for (const px of [-halfW, halfW]) {
      const pGeo = new THREE.BoxGeometry(0.25, postH, 0.25);
      pGeo.translate(px, postH / 2, 0);
      const post = new THREE.Mesh(pGeo, postMat);
      group.add(post);
      meshes.push(post);
    }

    // 2. Horizontal Wire Line
    const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, width, 6);
    wireGeo.rotateZ(Math.PI / 2);
    wireGeo.translate(0, postH - 0.2, 0);
    group.add(new THREE.Mesh(wireGeo, wireMat));

    // 3. Hanging Cloth Panels (Bedsheets, shirts, towels that obscure vision)
    const numSheets = 3;
    const sheetW = (width - 1.0) / numSheets;
    for (let i = 0; i < numSheets; i++) {
      const sx = -(width - 1.0) / 2 + sheetW / 2 + i * sheetW;
      const sH = 1.7;
      const sheetGeo = new THREE.BoxGeometry(sheetW * 0.9, sH, 0.04);
      sheetGeo.translate(sx, postH - 0.2 - sH / 2, 0);
      const sheet = new THREE.Mesh(sheetGeo, i % 2 === 0 ? cloth1Mat : cloth2Mat);
      group.add(sheet);
      // We don't add sheet to solid colliders so player can pass through smoothly like fabric!

      // Clothespins along the top edge
      for (const pinX of [sx - sheetW * 0.3, sx + sheetW * 0.3]) {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.06), pinMat);
        pin.position.set(pinX, postH - 0.18, 0);
        group.add(pin);
      }
    }

    return { group, meshes };
  }

static createPopeyePizzaMesh(
    radius = 8.0,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; slices: THREE.Mesh[]; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const slices: THREE.Mesh[] = [];
    const meshes: THREE.Mesh[] = [];

    const crustMat = new THREE.MeshStandardMaterial({ color: 0xd78f44, roughness: 0.65 });
    const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b, roughness: 0.45 });
    const pepMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.4 });
    const oliveMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.5 });
    const pepGreenMat = new THREE.MeshStandardMaterial({ color: 0x388e3c, roughness: 0.5 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xbf360c, roughness: 0.7 });

    const numSlices = 8;
    const sliceAngle = (Math.PI * 2) / numSlices;
    const sliceH = 0.45;

    // Outer Crust Rim
    const rimGeo = new THREE.TorusGeometry(radius, 0.4, 8, 32);
    rimGeo.rotateX(Math.PI / 2);
    rimGeo.translate(0, sliceH, 0);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    group.add(rim);
    meshes.push(rim);

    // 8 Individual Pizza Slices
    for (let i = 0; i < numSlices; i++) {
      const slicePivot = new THREE.Group();
      const thetaStart = i * sliceAngle;

      const wedgeGeo = new THREE.CylinderGeometry(radius * 0.98, radius * 0.98, sliceH, 8, 1, false, thetaStart, sliceAngle);
      wedgeGeo.translate(0, sliceH / 2, 0);
      const wedgeMesh = new THREE.Mesh(wedgeGeo, i % 2 === 0 ? cheeseMat : crustMat);
      slicePivot.add(wedgeMesh);
      slices.push(wedgeMesh);
      meshes.push(wedgeMesh);

      // Toppings scattered on the slice
      const midAngle = thetaStart + sliceAngle / 2;
      for (const rDist of [radius * 0.35, radius * 0.65]) {
        // Pepperoni
        const pep = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.04, 8), pepMat);
        pep.position.set(Math.cos(midAngle) * rDist, sliceH + 0.02, Math.sin(midAngle) * rDist);
        slicePivot.add(pep);

        // Black Olive
        const olive = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.08, 6, 8), oliveMat);
        olive.rotateX(Math.PI / 2);
        olive.position.set(Math.cos(midAngle + 0.15) * (rDist + 0.6), sliceH + 0.04, Math.sin(midAngle + 0.15) * (rDist + 0.6));
        slicePivot.add(olive);

        // Green Bell Pepper strip
        const gp = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.5), pepGreenMat);
        gp.rotation.y = midAngle;
        gp.position.set(Math.cos(midAngle - 0.15) * (rDist + 0.4), sliceH + 0.03, Math.sin(midAngle - 0.15) * (rDist + 0.4));
        slicePivot.add(gp);
      }

      group.add(slicePivot);
    }

    // Center Pizza Hub
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, sliceH + 0.08, 16), crustMat);
    hub.position.y = (sliceH + 0.08) / 2;
    group.add(hub);
    meshes.push(hub);

    return { group, slices, meshes };
  }

static createPopeyeBillboardMesh(
    _quality: "low" | "medium" | "high" = "medium"
  ): THREE.Group {
    const group = new THREE.Group();

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.35, metalness: 0.8 });
    const signBoardMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.4 });
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b, emissive: new THREE.Color(0xffd600), emissiveIntensity: 0.6 });
    const spotMat = new THREE.MeshStandardMaterial({ color: 0xfff9c4, emissive: new THREE.Color(0xfff59d), emissiveIntensity: 0.9 });

    // 2 Steel Lattice Support Masts
    for (const px of [-5.5, 5.5]) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5.0, 0.4), frameMat);
      p.position.set(px, 2.5, 0);
      group.add(p);
    }

    // Main Red Signboard Panel
    const board = new THREE.Mesh(new THREE.BoxGeometry(13.6, 5.0, 0.35), signBoardMat);
    board.position.set(0, 4.2, 0);
    group.add(board);

    // Golden Neon Border Frame
    const border = new THREE.Mesh(new THREE.BoxGeometry(13.9, 5.3, 0.25), yellowMat);
    border.position.set(0, 4.2, -0.05);
    group.add(border);

    const illustration=new THREE.Mesh(new THREE.PlaneGeometry(13.3,4.95),new THREE.MeshBasicMaterial({map:popeyeArtwork(),toneMapped:false}));
    illustration.position.set(0,4.2,.2);illustration.name='popeye-pizza-artwork';group.add(illustration);

    // Spotlights pointing down
    for (const sx of [-4.5, 0, 4.5]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6), frameMat);
      arm.rotateX(0.4);
      arm.position.set(sx, 7.0, 0.5);
      group.add(arm);

      const lamp = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.4, 8), spotMat);
      lamp.rotateX(-0.8);
      lamp.position.set(sx, 6.7, 0.9);
      group.add(lamp);
    }

    return group;
  }

static createStracciatellaConeMesh(
    coneHeight = 10.0,
    scoopRadius = 4.8,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const waffleMat = new THREE.MeshStandardMaterial({ color: 0xc58f59, roughness: 0.65 });
    const waffleGridMat = new THREE.MeshStandardMaterial({ color: 0x8d5b2d, roughness: 0.75 });
    const icecreamMat = new THREE.MeshStandardMaterial({ color: 0xfffde7, roughness: 0.35 });
    const chocMat = new THREE.MeshStandardMaterial({ color: 0x21100b, roughness: 0.25, metalness: 0.1 });
    const waferMat = new THREE.MeshStandardMaterial({ color: 0xa16839, roughness: 0.5 });
    const cherryMat = new THREE.MeshStandardMaterial({ color: 0xd50000, roughness: 0.15, metalness: 0.25 });
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x33691e, roughness: 0.6 });

    // 1. Giant Waffle Cone
    const coneGeo = new THREE.CylinderGeometry(scoopRadius * 0.95, 0.4, coneHeight, 20);
    coneGeo.translate(0, coneHeight / 2, 0);
    const cone = new THREE.Mesh(coneGeo, waffleMat);
    group.add(cone);
    meshes.push(cone);

    // Waffle Rim Collar
    const collarGeo = new THREE.TorusGeometry(scoopRadius * 0.96, 0.3, 8, 24);
    collarGeo.rotateX(Math.PI / 2);
    collarGeo.translate(0, coneHeight, 0);
    const collar = new THREE.Mesh(collarGeo, waffleGridMat);
    group.add(collar);
    meshes.push(collar);

    // 2. Giant Stracciatella Ice Cream Scoop
    const scoopGeo = new THREE.SphereGeometry(scoopRadius, 24, 20);
    scoopGeo.translate(0, coneHeight + scoopRadius * 0.75, 0);
    const scoop = new THREE.Mesh(scoopGeo, icecreamMat);
    group.add(scoop);
    meshes.push(scoop);

    // Dark Chocolate Chips studded all around the scoop
    const chipGeo = new THREE.OctahedronGeometry(0.24);
    const numChips = 28;
    for (let i = 0; i < numChips; i++) {
      const phi = Math.acos(-1 + (2 * i) / numChips);
      const theta = Math.sqrt(numChips * Math.PI) * phi;
      const chip = new THREE.Mesh(chipGeo, chocMat);
      chip.position.set(
        Math.cos(theta) * Math.sin(phi) * (scoopRadius * 0.98),
        coneHeight + scoopRadius * 0.75 + Math.cos(phi) * (scoopRadius * 0.98),
        Math.sin(theta) * Math.sin(phi) * (scoopRadius * 0.98)
      );
      chip.rotation.set(i * 0.5, i * 0.3, i * 0.7);
      group.add(chip);
    }

    // 3. Giant Rolled Wafer Stick (Barquillo Pirouline)
    const waferGeo = new THREE.CylinderGeometry(0.28, 0.28, 4.5, 8);
    waferGeo.rotateZ(0.35);
    waferGeo.translate(1.4, coneHeight + scoopRadius * 1.35, 0);
    const wafer = new THREE.Mesh(waferGeo, waferMat);
    group.add(wafer);
    meshes.push(wafer);

    // 4. Glazed Red Cherry at the Peak
    const cherry = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 12), cherryMat);
    cherry.position.set(0, coneHeight + scoopRadius * 1.65, 0);
    group.add(cherry);
    meshes.push(cherry);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6), stemMat);
    stem.rotateZ(0.25);
    stem.position.set(0.12, coneHeight + scoopRadius * 1.65 + 0.45, 0);
    group.add(stem);

    return { group, meshes };
  }


  private createGoalPortal(
    obj: LevelObjectData,
    physics: PhysicsWorld,
    tempEuler: THREE.Euler,
    tempQuat: THREE.Quaternion,
    physical = true
  ): { group: THREE.Group; portalMesh: THREE.Mesh } {
    const goalY = Math.abs(obj.position.y - 1.6) < 0.1 ? 0.4 : obj.position.y;
    const group = new THREE.Group();
    group.position.set(obj.position.x, goalY, obj.position.z);
    group.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);

    tempEuler.set(obj.rotation.x, obj.rotation.y, obj.rotation.z, "YXZ");
    tempQuat.setFromEuler(tempEuler);
    const quat = { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w };

    // --- Physical Colliders for Square Posts & Top Lintel (Non-traversable, resting on ground) ---
    const goalScale=obj.properties?.searchHidden===true?new THREE.Vector3(obj.scale.x,obj.scale.y,obj.scale.z):new THREE.Vector3(1,1,1);
    group.scale.copy(goalScale);
    // Uses exact quaternion 3D transformation so rotated goals at any angle have 100% accurate physical colliders
    const goalOrigin = new THREE.Vector3(obj.position.x, goalY, obj.position.z);
    const leftWorld = new THREE.Vector3(-1.7, 1.59, 0).multiply(goalScale).applyQuaternion(tempQuat).add(goalOrigin);
    if(physical && obj.properties?.museumGoal!=="pyramid" && obj.properties?.cangasAction !== "fabadaGoal" && obj.properties?.sellaAction!=="landingGoal" && obj.properties?.covadongaAction!=="cannonGoal") physics.createBoxCollider(leftWorld, quat, { x: 0.22*goalScale.x, y: 1.59*goalScale.y, z: 0.22*goalScale.z }, 0.75, 0.4);

    const rightWorld = new THREE.Vector3(1.7, 1.59, 0).multiply(goalScale).applyQuaternion(tempQuat).add(goalOrigin);
    if(physical && obj.properties?.museumGoal!=="pyramid" && obj.properties?.cangasAction !== "fabadaGoal" && obj.properties?.sellaAction!=="landingGoal" && obj.properties?.covadongaAction!=="cannonGoal") physics.createBoxCollider(rightWorld, quat, { x: 0.22*goalScale.x, y: 1.59*goalScale.y, z: 0.22*goalScale.z }, 0.75, 0.4);

    const beamWorld = new THREE.Vector3(0, 3.40, 0).multiply(goalScale).applyQuaternion(tempQuat).add(goalOrigin);
    if(physical && obj.properties?.museumGoal!=="pyramid" && obj.properties?.cangasAction !== "fabadaGoal" && obj.properties?.sellaAction!=="landingGoal" && obj.properties?.covadongaAction!=="cannonGoal") physics.createBoxCollider(beamWorld, quat, { x: 1.95*goalScale.x, y: 0.22*goalScale.y, z: 0.24*goalScale.z }, 0.75, 0.4);

    const postMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.85, roughness: 0.25 });
    const neonMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });

    const leftPost = new THREE.Mesh(new THREE.BoxGeometry(0.44, 3.18, 0.44), postMat);
    leftPost.position.set(-1.7, 1.59, 0);
    const leftNeon = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.18, 0.46), neonMat);
    leftPost.add(leftNeon);
    group.add(leftPost);

    const rightPost = new THREE.Mesh(new THREE.BoxGeometry(0.44, 3.18, 0.44), postMat);
    rightPost.position.set(1.7, 1.59, 0);
    const rightNeon = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.18, 0.46), neonMat);
    rightPost.add(rightNeon);
    group.add(rightPost);

    const topBeamMat = new THREE.MeshStandardMaterial({ color: 0xc62828, metalness: 0.6, roughness: 0.3 });
    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.44, 0.48), topBeamMat);
    topBeam.position.set(0, 3.40, 0);
    group.add(topBeam);

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, "rgba(0, 229, 255, 0.75)");
    grad.addColorStop(0.35, "rgba(255, 255, 255, 0.9)");
    grad.addColorStop(0.65, "rgba(124, 58, 237, 0.7)");
    grad.addColorStop(1, "rgba(0, 229, 255, 0.35)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    const portalTex = new THREE.CanvasTexture(canvas);
    portalTex.wrapS = THREE.RepeatWrapping;
    portalTex.wrapT = THREE.RepeatWrapping;

    const portalMat = new THREE.MeshBasicMaterial({
      map: portalTex,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const portalMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.96, 3.16), portalMat);
    portalMesh.name = "goalPortal";
    portalMesh.renderOrder = 8;
    portalMesh.position.set(0, 1.58, 0);
    group.add(portalMesh);

    return { group, portalMesh };
  }


static createDogMesh(
    quality: "low" | "medium" | "high" = "medium",
    breedIdx = 0,
    customFurColor?: string
  ): { group: THREE.Group; headGroup: THREE.Group; tailMesh: THREE.Mesh; legs: THREE.Group[]; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const makeMat = (colorVal: number | string, roughness = 0.5, metalness = 0.05): THREE.Material => {
      const c = new THREE.Color(colorVal as any);
      if (quality === "low") return new THREE.MeshLambertMaterial({ color: c });
      if (quality === "medium") return new THREE.MeshPhongMaterial({ color: c, shininess: 25, specular: new THREE.Color(0x222222) });
      return new THREE.MeshStandardMaterial({ color: c, roughness, metalness });
    };

    // 6 Authentic village dog breeds / fur patterns
    const breedFurs = [
      { body: 0xd7ccc8, muzzle: 0x4e342e, collar: 0xd32f2f, pointy: false }, // 0: Mastín de Las Hurdes (sand/beige)
      { body: 0xd84315, muzzle: 0xd7ccc8, collar: 0x0288d1, pointy: true },  // 1: Podenco ibérico (cinnamon ginger)
      { body: 0x212121, muzzle: 0x8d6e63, collar: 0x388e3c, pointy: false }, // 2: Pastor de montaña (black & tan)
      { body: 0xffffff, muzzle: 0x212121, collar: 0xf57c00, pointy: false }, // 3: Chucho manchado (white with black spots)
      { body: 0x4e342e, muzzle: 0xffffff, collar: 0x7b1fa2, pointy: true },  // 4: Perro cazador (chocolate brown)
      { body: 0xffb74d, muzzle: 0x5d4037, collar: 0xc2185b, pointy: false }  // 5: Perro pachón (golden wheat)
    ];
    const b = breedFurs[breedIdx % breedFurs.length];

    const bodyMat = makeMat(customFurColor || b.body);
    const muzzleMat = makeMat(b.muzzle);
    const noseMat = makeMat(0x111111, 0.3, 0.1);
    const eyeMat = makeMat(0x1a1a1a, 0.2, 0.1);
    const collarMat = makeMat(b.collar, 0.4, 0.3);
    const tagMat = makeMat(0xffd54f, 0.2, 0.85);

    // Torso (sturdy canine body)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.52, 0.95), bodyMat);
    torso.position.y = 0.52;
    group.add(torso);
    meshes.push(torso);

    // Collar
    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.12, 0.22), collarMat);
    collar.position.set(0, 0.65, -0.42);
    const tag = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 8), tagMat);
    tag.position.set(0, 0.58, -0.54);
    group.add(collar, tag);
    meshes.push(collar, tag);

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.72, -0.55);

    const skull = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.38, 0.42), bodyMat);
    skull.position.set(0, 0, 0);
    headGroup.add(skull);
    meshes.push(skull);

    // Muzzle & Black Wet Nose
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.32), muzzleMat);
    snout.position.set(0, -0.06, -0.32);
    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.08), noseMat);
    nose.position.set(0, 0.02, -0.48);
    headGroup.add(snout, nose);
    meshes.push(snout, nose);

    // Two expressive eyes
    for (const ex of [-0.14, 0.14]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), eyeMat);
      eye.position.set(ex, 0.08, -0.2);
      headGroup.add(eye);
      meshes.push(eye);
    }

    // Ears (Pointy upright or Floppy folded down)
    for (const side of [-1, 1]) {
      if (b.pointy) {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.28, 4), bodyMat);
        ear.position.set(side * 0.18, 0.3, 0);
        ear.rotation.z = side * -0.2;
        headGroup.add(ear);
        meshes.push(ear);
      } else {
        const ear = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.18), muzzleMat);
        ear.position.set(side * 0.24, 0.02, -0.04);
        ear.rotation.z = side * 0.25;
        headGroup.add(ear);
        meshes.push(ear);
      }
    }
    group.add(headGroup);

    // Tail (happy wagging tail)
    const tailMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.06, 0.42, 6), bodyMat);
    tailMesh.position.set(0, 0.65, 0.52);
    tailMesh.rotation.x = -0.65;
    group.add(tailMesh);
    meshes.push(tailMesh);

    // 4 Running Legs
    const legs: THREE.Group[] = [];
    const legPositions = [
      [-0.22, 0.24, -0.32],
      [0.22, 0.24, -0.32],
      [-0.22, 0.24, 0.32],
      [0.22, 0.24, 0.32]
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(lx, ly, lz);
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.48, 6), bodyMat);
      leg.position.y = 0;
      const paw = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.14), muzzleMat);
      paw.position.set(0, -0.21, -0.02);
      legGroup.add(leg, paw);
      group.add(legGroup);
      legs.push(legGroup);
      meshes.push(leg, paw);
    });

    return { group, headGroup, tailMesh, legs, meshes };
  }

static createGirlMesh(
    quality: "low" | "medium" | "high" = "medium",
    isGirl2 = false
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const makeMat = (colorVal: number | string, roughness = 0.6, metalness = 0.05): THREE.Material => {
      const c = new THREE.Color(colorVal as any);
      if (quality === "low") return new THREE.MeshLambertMaterial({ color: c });
      if (quality === "medium") return new THREE.MeshPhongMaterial({ color: c, shininess: 25, specular: new THREE.Color(0x333333) });
      return new THREE.MeshStandardMaterial({ color: c, roughness, metalness });
    };

    const dressColor = isGirl2 ? 0x00bcd4 : 0xe91e63;
    const ribbonColor = isGirl2 ? 0xffeb3b : 0xff4081;

    const dressMat = makeMat(dressColor);
    const skinMat = makeMat(0xffccbc, 0.7, 0.0);
    const blondeHairMat = makeMat(0xffd54f, 0.5, 0.1);
    const glassesMat = makeMat(0xb71c1c, 0.3, 0.7);
    const shoeMat = makeMat(0x212121, 0.4, 0.2);
    const whiteSockMat = makeMat(0xffffff, 0.8, 0.0);
    const ribbonMat = makeMat(ribbonColor);

    // Dress Skirt & Torso
    const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.48, 0.62, 10), dressMat);
    skirt.position.y = 0.72;
    const blouse = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.45, 8), dressMat);
    blouse.position.y = 1.15;
    group.add(skirt, blouse);
    meshes.push(skirt, blouse);

    // Legs with white socks & black shoes
    for (const lx of [-0.14, 0.14]) {
      const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.35, 6), whiteSockMat);
      sock.position.set(lx, 0.35, 0);
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.2), shoeMat);
      shoe.position.set(lx, 0.05, 0.04);
      group.add(sock, shoe);
      meshes.push(sock, shoe);
    }

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), skinMat);
    head.position.y = 1.55;
    group.add(head);
    meshes.push(head);

    // Blonde Hair Cap
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 8, 0, Math.PI * 2, 0, Math.PI / 1.7), blondeHairMat);
    hair.position.y = 1.58;
    group.add(hair);
    meshes.push(hair);

    // Two cute blonde pigtails (coletitas) with bows
    for (const side of [-1, 1]) {
      const pigtail = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.38, 6), blondeHairMat);
      pigtail.position.set(side * 0.32, 1.52, -0.05);
      pigtail.rotation.z = side * -0.4;
      const bow = new THREE.Mesh(new THREE.SphereGeometry(0.065, 6, 6), ribbonMat);
      bow.position.set(side * 0.28, 1.62, -0.05);
      group.add(pigtail, bow);
      meshes.push(pigtail, bow);
    }

    // Cute round spectacles / glasses
    for (const gx of [-0.09, 0.09]) {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.014, 6, 12), glassesMat);
      rim.position.set(gx, 1.55, 0.22);
      group.add(rim);
      meshes.push(rim);
    }
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.015, 0.02), glassesMat);
    bridge.position.set(0, 1.55, 0.22);
    group.add(bridge);
    meshes.push(bridge);

    return { group, meshes };
  }

static createBoyMesh(
    quality: "low" | "medium" | "high" = "medium",
    isBoy2 = false
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const makeMat = (colorVal: number | string, roughness = 0.6, metalness = 0.05): THREE.Material => {
      const c = new THREE.Color(colorVal as any);
      if (quality === "low") return new THREE.MeshLambertMaterial({ color: c });
      if (quality === "medium") return new THREE.MeshPhongMaterial({ color: c, shininess: 25, specular: new THREE.Color(0x333333) });
      return new THREE.MeshStandardMaterial({ color: c, roughness, metalness });
    };

    const skinMat = makeMat(0xffccbc, 0.7, 0.0);
    const shoeMat = makeMat(0xd32f2f, 0.4, 0.2); // Sporty red sneakers

    if (!isBoy2) {
      // Boy 1: Slender, dark hair, green striped t-shirt, wearing glasses
      const shirtMat = makeMat(0x388e3c);
      const shortsMat = makeMat(0x1976d2);
      const hairMat = makeMat(0x212121);
      const glassesMat = makeMat(0x111111, 0.3, 0.8);

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.58, 0.28), shirtMat);
      torso.position.y = 1.12;
      const shorts = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.35, 0.3), shortsMat);
      shorts.position.y = 0.72;
      group.add(torso, shorts);
      meshes.push(torso, shorts);

      for (const lx of [-0.12, 0.12]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.055, 0.45, 6), skinMat);
        leg.position.set(lx, 0.32, 0);
        const sneaker = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.22), shoeMat);
        sneaker.position.set(lx, 0.05, 0.04);
        group.add(leg, sneaker);
        meshes.push(leg, sneaker);
      }

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), skinMat);
      head.position.y = 1.55;
      const hair = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.25, 7), hairMat);
      hair.position.y = 1.72;
      group.add(head, hair);
      meshes.push(head, hair);

      // Glasses
      for (const gx of [-0.08, 0.08]) {
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 12), glassesMat);
        rim.position.set(gx, 1.55, 0.2);
        group.add(rim);
        meshes.push(rim);
      }
    } else {
      // Boy 2: Sturdier / Chubby, short blonde hair, orange t-shirt, no glasses
      const shirtMat = makeMat(0xff9800);
      const shortsMat = makeMat(0x5d4037);
      const blondeMat = makeMat(0xffd54f);

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.58, 0.38), shirtMat);
      torso.position.y = 1.1;
      const shorts = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.35, 0.4), shortsMat);
      shorts.position.y = 0.7;
      group.add(torso, shorts);
      meshes.push(torso, shorts);

      for (const lx of [-0.16, 0.16]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.075, 0.42, 6), skinMat);
        leg.position.set(lx, 0.3, 0);
        const sneaker = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.24), shoeMat);
        sneaker.position.set(lx, 0.05, 0.04);
        group.add(leg, sneaker);
        meshes.push(leg, sneaker);
      }

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 8), skinMat);
      head.position.y = 1.54;
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8, 0, Math.PI * 2, 0, Math.PI / 1.8), blondeMat);
      hair.position.y = 1.58;
      group.add(head, hair);
      meshes.push(head, hair);
    }

    return { group, meshes };
  }

static createDoorMesh(
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; doorPivot: THREE.Group; doorLeaf: THREE.Mesh; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const frameMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.6 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.25, metalness: 0.85 });

    // Ball diameter 1.5 + .2 clearance, including the open leaf and handle.
    const doorW = 1.9;
    const doorH = 2.6;

    // Outer Door Frame
    const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.12, doorH + 0.1, 0.18), frameMat);
    frameL.position.set(-doorW / 2 - 0.06, (doorH + 0.1) / 2, 0);
    const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.12, doorH + 0.1, 0.18), frameMat);
    frameR.position.set(doorW / 2 + 0.06, (doorH + 0.1) / 2, 0);
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(doorW + 0.36, 0.12, 0.18), frameMat);
    frameTop.position.set(0, doorH + 0.06, 0);
    group.add(frameL, frameR, frameTop);
    meshes.push(frameL, frameR, frameTop);

    // Door Pivot at left hinge
    const doorPivot = new THREE.Group();
    doorPivot.name = "doorPivot";
    doorPivot.position.set(-doorW / 2, 0, 0);

    // Door Leaf
    const doorGeo = new THREE.BoxGeometry(doorW, doorH, 0.08);
    doorGeo.translate(doorW / 2, doorH / 2, 0);
    const doorLeaf = new THREE.Mesh(doorGeo, leafMat);
    doorPivot.add(doorLeaf);
    meshes.push(doorLeaf);

    // Brass Handle
    const handleStem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.12, 6), brassMat);
    handleStem.rotation.x = Math.PI / 2;
    handleStem.position.set(doorW - 0.15, doorH / 2, 0.08);
    const handleLever = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.03), brassMat);
    handleLever.position.set(doorW - 0.22, doorH / 2, 0.14);
    doorPivot.add(handleStem, handleLever);
    meshes.push(handleStem, handleLever);

    group.add(doorPivot);
    return { group, doorPivot, doorLeaf, meshes };
  }

static createLitosDuoMesh(
    quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "litos_duo_group";
    const meshes: THREE.Mesh[] = [];

    const seg = quality === "low" ? 8 : quality === "medium" ? 14 : 20;

    // --- MATERIALS ---
    // Man Materials (~50 years old, taller, short dark hair, Atleti jersey, blue shorts)
    const manSkinMat = new THREE.MeshStandardMaterial({ color: 0xdfb091, roughness: 0.7 });
    const manDarkHairMat = new THREE.MeshStandardMaterial({ color: 0x1f140e, roughness: 0.85 }); // pelo corto moreno
    const manBlueShortsMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.6 }); // pantalon corto de color azul
    const atletiJerseyMat = new THREE.MeshStandardMaterial({
      map: LevelBuilder.getAtletiJerseyTexture(),
      roughness: 0.55
    });
    const sneakerWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.4 });
    const sneakerRedMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 });
    const sneakerSoleMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.9 });
    const watchBandMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.5 });
    const watchFaceMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.8, roughness: 0.2 });

    // Woman Materials (~50 years old, slightly shorter, curly chestnut hair with blonde highlights, green floral dress)
    const womanSkinMat = new THREE.MeshStandardMaterial({ color: 0xedc7ac, roughness: 0.65 });
    const chestnutHairMat = new THREE.MeshStandardMaterial({ color: 0x4a2a16, roughness: 0.8 }); // pelo castaño rizado
    const blondeHighlightMat = new THREE.MeshStandardMaterial({ color: 0xdfa037, roughness: 0.75 }); // mechas rubias
    const greenFloralDressMat = new THREE.MeshStandardMaterial({
      map: LevelBuilder.getGreenFloralDressTexture(),
      roughness: 0.5
    });
    const dressBeltMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.6 });
    const goldJewelryMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.25 });
    const sandalSoleMat = new THREE.MeshStandardMaterial({ color: 0xbb7837, roughness: 0.85 });
    const sandalStrapMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 });

    // Facial features
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const eyeIrisBrownMat = new THREE.MeshStandardMaterial({ color: 0x2e190e, roughness: 0.4 });
    const mouthMatMan = new THREE.MeshStandardMaterial({ color: 0xa05e46, roughness: 0.7 });
    const mouthMatWoman = new THREE.MeshStandardMaterial({ color: 0xb9475d, roughness: 0.5 });

    // -------------------------------------------------------------
    // 1. MAN (~1.85m tall, taller than the woman, Madrid fan)
    // -------------------------------------------------------------
    const manGroup = new THREE.Group();
    manGroup.name = "man_atleti";
    manGroup.position.set(-0.44, 0, 0);

    // Head: y = 1.62
    const manHead = new THREE.Mesh(new THREE.SphereGeometry(0.19, seg, seg), manSkinMat);
    manHead.position.set(0, 1.62, 0);
    manHead.scale.set(0.92, 1.05, 0.95);
    manGroup.add(manHead);
    meshes.push(manHead);

    // Man Neck
    const manNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.12, seg), manSkinMat);
    manNeck.position.set(0, 1.48, 0);
    manGroup.add(manNeck);
    meshes.push(manNeck);

    // Man Ears
    const earGeo = new THREE.SphereGeometry(0.045, 6, 6);
    earGeo.scale(0.4, 1.1, 0.8);
    const manEarL = new THREE.Mesh(earGeo, manSkinMat);
    manEarL.position.set(-0.19, 1.62, 0);
    const manEarR = new THREE.Mesh(earGeo, manSkinMat);
    manEarR.position.set(0.19, 1.62, 0);
    manGroup.add(manEarL, manEarR);
    meshes.push(manEarL, manEarR);

    // Short dark brown/black hair ("pelo corto moreno"): cap with styled locks
    const manHairCap = new THREE.Mesh(new THREE.SphereGeometry(0.20, seg, seg), manDarkHairMat);
    manHairCap.position.set(0, 1.66, -0.02);
    manHairCap.scale.set(0.96, 0.98, 0.98);
    manGroup.add(manHairCap);
    meshes.push(manHairCap);

    // Short hair tufts on top/front (short styled cut)
    const tuftGeo = new THREE.BoxGeometry(0.06, 0.04, 0.08);
    for (let i = -2; i <= 2; i++) {
      const tuft = new THREE.Mesh(tuftGeo, manDarkHairMat);
      tuft.position.set(i * 0.05, 1.76, 0.05 - Math.abs(i) * 0.02);
      tuft.rotation.x = -0.2;
      manGroup.add(tuft);
      meshes.push(tuft);
    }
    // Neat sideburns
    const sideburnL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.09, 0.04), manDarkHairMat);
    sideburnL.position.set(-0.185, 1.60, 0.03);
    const sideburnR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.09, 0.04), manDarkHairMat);
    sideburnR.position.set(0.185, 1.60, 0.03);
    manGroup.add(sideburnL, sideburnR);
    meshes.push(sideburnL, sideburnR);

    // Man Eyes & Eyebrows
    const eyeGeo = new THREE.SphereGeometry(0.025, 6, 6);
    const irisGeo = new THREE.SphereGeometry(0.014, 6, 6);
    const eyeL = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    eyeL.position.set(-0.065, 1.63, 0.16);
    const irisL = new THREE.Mesh(irisGeo, eyeIrisBrownMat);
    irisL.position.set(-0.065, 1.63, 0.18);

    const eyeR = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    eyeR.position.set(0.065, 1.63, 0.16);
    const irisR = new THREE.Mesh(irisGeo, eyeIrisBrownMat);
    irisR.position.set(0.065, 1.63, 0.18);
    manGroup.add(eyeL, irisL, eyeR, irisR);
    meshes.push(eyeL, irisL, eyeR, irisR);

    // Eyebrows
    const browGeo = new THREE.BoxGeometry(0.06, 0.018, 0.03);
    const browL = new THREE.Mesh(browGeo, manDarkHairMat);
    browL.position.set(-0.065, 1.66, 0.165);
    browL.rotation.z = 0.08;
    const browR = new THREE.Mesh(browGeo, manDarkHairMat);
    browR.position.set(0.065, 1.66, 0.165);
    browR.rotation.z = -0.08;
    manGroup.add(browL, browR);
    meshes.push(browL, browR);

    // Nose
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.06, 5), manSkinMat);
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 1.605, 0.19);
    manGroup.add(nose);
    meshes.push(nose);

    // Friendly mature smile
    const smile = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.015, 0.02), mouthMatMan);
    smile.position.set(0, 1.555, 0.17);
    manGroup.add(smile);
    meshes.push(smile);

    // Torso: Atlético de Madrid Jersey
    const manTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.54, seg), atletiJerseyMat);
    manTorso.position.set(0, 1.18, 0);
    manTorso.scale.set(1.15, 1.0, 0.72);
    manGroup.add(manTorso);
    meshes.push(manTorso);

    // Jersey Collar (Dark blue round collar)
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.022, 6, 12), new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 }));
    collar.position.set(0, 1.43, 0.02);
    collar.rotation.x = Math.PI / 2;
    manGroup.add(collar);
    meshes.push(collar);

    // Arms & Sleeves
    const sleeveGeo = new THREE.CylinderGeometry(0.08, 0.075, 0.18, seg);
    const armGeo = new THREE.CylinderGeometry(0.06, 0.055, 0.32, seg);
    const handGeo = new THREE.SphereGeometry(0.055, 8, 8);
    handGeo.scale(0.8, 1.1, 0.8);

    // Left Arm (with watch)
    const sleeveL = new THREE.Mesh(sleeveGeo, atletiJerseyMat);
    sleeveL.position.set(-0.31, 1.34, 0);
    sleeveL.rotation.z = 0.18;
    const armL = new THREE.Mesh(armGeo, manSkinMat);
    armL.position.set(-0.34, 1.12, 0.04);
    armL.rotation.z = 0.12;
    armL.rotation.x = 0.15;
    // Watch on left wrist
    const watchBand = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.03, 10), watchBandMat);
    watchBand.position.set(-0.355, 0.98, 0.06);
    const watchFace = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.015, 8), watchFaceMat);
    watchFace.position.set(-0.38, 0.98, 0.08);
    watchFace.rotation.z = Math.PI / 2;
    const handL = new THREE.Mesh(handGeo, manSkinMat);
    handL.position.set(-0.36, 0.93, 0.07);
    manGroup.add(sleeveL, armL, watchBand, watchFace, handL);
    meshes.push(sleeveL, armL, watchBand, watchFace, handL);

    // Right Arm
    const sleeveR = new THREE.Mesh(sleeveGeo, atletiJerseyMat);
    sleeveR.position.set(0.31, 1.34, 0);
    sleeveR.rotation.z = -0.18;
    const armR = new THREE.Mesh(armGeo, manSkinMat);
    armR.position.set(0.34, 1.12, 0.04);
    armR.rotation.z = -0.12;
    armR.rotation.x = 0.15;
    const handR = new THREE.Mesh(handGeo, manSkinMat);
    handR.position.set(0.36, 0.93, 0.07);
    manGroup.add(sleeveR, armR, handR);
    meshes.push(sleeveR, armR, handR);

    // Blue shorts (Pantalón corto azul)
    const shortsWaist = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.24, 0.22, seg), manBlueShortsMat);
    shortsWaist.position.set(0, 0.83, 0);
    shortsWaist.scale.set(1.1, 1.0, 0.75);
    const shortLegGeo = new THREE.CylinderGeometry(0.12, 0.125, 0.22, seg);
    const shortLegL = new THREE.Mesh(shortLegGeo, manBlueShortsMat);
    shortLegL.position.set(-0.12, 0.68, 0);
    const shortLegR = new THREE.Mesh(shortLegGeo, manBlueShortsMat);
    shortLegR.position.set(0.12, 0.68, 0);
    manGroup.add(shortsWaist, shortLegL, shortLegR);
    meshes.push(shortsWaist, shortLegL, shortLegR);

    // Bare legs
    const manLegGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.44, seg);
    const legL = new THREE.Mesh(manLegGeo, manSkinMat);
    legL.position.set(-0.12, 0.40, 0);
    const legR = new THREE.Mesh(manLegGeo, manSkinMat);
    legR.position.set(0.12, 0.40, 0);
    manGroup.add(legL, legR);
    meshes.push(legL, legR);

    // Athletic running sneakers (white + red trim + dark sole)
    const shoeGeo = new THREE.BoxGeometry(0.14, 0.12, 0.26);
    const soleGeo = new THREE.BoxGeometry(0.15, 0.03, 0.28);
    const stripeGeo = new THREE.BoxGeometry(0.145, 0.03, 0.08);

    const shoeL = new THREE.Mesh(shoeGeo, sneakerWhiteMat);
    shoeL.position.set(-0.12, 0.09, 0.03);
    const soleL = new THREE.Mesh(soleGeo, sneakerSoleMat);
    soleL.position.set(-0.12, 0.015, 0.03);
    const stripeL = new THREE.Mesh(stripeGeo, sneakerRedMat);
    stripeL.position.set(-0.12, 0.09, 0.03);

    const shoeR = new THREE.Mesh(shoeGeo, sneakerWhiteMat);
    shoeR.position.set(0.12, 0.09, 0.03);
    const soleR = new THREE.Mesh(soleGeo, sneakerSoleMat);
    soleR.position.set(0.12, 0.015, 0.03);
    const stripeR = new THREE.Mesh(stripeGeo, sneakerRedMat);
    stripeR.position.set(0.12, 0.09, 0.03);

    manGroup.add(shoeL, soleL, stripeL, shoeR, soleR, stripeR);
    meshes.push(shoeL, soleL, stripeL, shoeR, soleR, stripeR);

    group.add(manGroup);

    // -------------------------------------------------------------
    // 2. WOMAN (~1.68m tall, slightly shorter than man, curly chestnut hair with blonde highlights, green floral dress)
    // -------------------------------------------------------------
    const womanGroup = new THREE.Group();
    womanGroup.name = "woman_floral";
    womanGroup.position.set(0.44, 0, 0);

    // Head: y = 1.48
    const womanHead = new THREE.Mesh(new THREE.SphereGeometry(0.175, seg, seg), womanSkinMat);
    womanHead.position.set(0, 1.48, 0);
    womanHead.scale.set(0.9, 1.02, 0.92);
    womanGroup.add(womanHead);
    meshes.push(womanHead);

    // Neck
    const womanNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.12, seg), womanSkinMat);
    womanNeck.position.set(0, 1.36, 0);
    womanGroup.add(womanNeck);
    meshes.push(womanNeck);

    // Gold delicate necklace
    const necklace = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 6, 12), goldJewelryMat);
    necklace.position.set(0, 1.33, 0.02);
    necklace.rotation.x = Math.PI / 2;
    womanGroup.add(necklace);
    meshes.push(necklace);

    // Ears & Gold hoop earrings
    const womanEarL = new THREE.Mesh(earGeo, womanSkinMat);
    womanEarL.position.set(-0.175, 1.48, 0);
    const womanEarR = new THREE.Mesh(earGeo, womanSkinMat);
    womanEarR.position.set(0.175, 1.48, 0);
    const earringGeo = new THREE.TorusGeometry(0.025, 0.007, 6, 10);
    const earringL = new THREE.Mesh(earringGeo, goldJewelryMat);
    earringL.position.set(-0.18, 1.45, 0);
    const earringR = new THREE.Mesh(earringGeo, goldJewelryMat);
    earringR.position.set(0.18, 1.45, 0);
    womanGroup.add(womanEarL, womanEarR, earringL, earringR);
    meshes.push(womanEarL, womanEarR, earringL, earringR);

    // Eyes with subtle lashes & eyebrows
    const wEyeL = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    wEyeL.position.set(-0.058, 1.49, 0.15);
    const wIrisL = new THREE.Mesh(irisGeo, eyeIrisBrownMat);
    wIrisL.position.set(-0.058, 1.49, 0.17);

    const wEyeR = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    wEyeR.position.set(0.058, 1.49, 0.15);
    const wIrisR = new THREE.Mesh(irisGeo, eyeIrisBrownMat);
    wIrisR.position.set(0.058, 1.49, 0.17);
    womanGroup.add(wEyeL, wIrisL, wEyeR, wIrisR);
    meshes.push(wEyeL, wIrisL, wEyeR, wIrisR);

    const wBrowGeo = new THREE.BoxGeometry(0.05, 0.015, 0.02);
    const wBrowL = new THREE.Mesh(wBrowGeo, chestnutHairMat);
    wBrowL.position.set(-0.058, 1.52, 0.155);
    wBrowL.rotation.z = 0.06;
    const wBrowR = new THREE.Mesh(wBrowGeo, chestnutHairMat);
    wBrowR.position.set(0.058, 1.52, 0.155);
    wBrowR.rotation.z = -0.06;
    womanGroup.add(wBrowL, wBrowR);
    meshes.push(wBrowL, wBrowR);

    // Nose
    const wNose = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.05, 5), womanSkinMat);
    wNose.rotation.x = Math.PI / 2;
    wNose.position.set(0, 1.465, 0.175);
    womanGroup.add(wNose);
    meshes.push(wNose);

    // Smile with lipstick
    const wSmile = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.016, 0.02), mouthMatWoman);
    wSmile.position.set(0, 1.42, 0.155);
    womanGroup.add(wSmile);
    meshes.push(wSmile);

    // --- VERY CURLY CHESTNUT HAIR WITH BLONDE HIGHLIGHTS (Pelo medio rizado con mechas rubias) ---
    // Volumetric base cap
    const womanHairBase = new THREE.Mesh(new THREE.SphereGeometry(0.21, seg, seg), chestnutHairMat);
    womanHairBase.position.set(0, 1.52, -0.04);
    womanHairBase.scale.set(1.08, 1.05, 1.06);
    womanGroup.add(womanHairBase);
    meshes.push(womanHairBase);

    // Medium-length curly spiral clusters cascading down both sides and framing face
    const curlClusterCoords = [
      // Top crown curls
      { x: 0.0, y: 1.64, z: 0.04, r: 0.075, mat: blondeHighlightMat },
      { x: -0.11, y: 1.62, z: 0.03, r: 0.07, mat: chestnutHairMat },
      { x: 0.11, y: 1.62, z: 0.03, r: 0.07, mat: blondeHighlightMat },
      { x: -0.06, y: 1.63, z: -0.06, r: 0.08, mat: blondeHighlightMat },
      { x: 0.06, y: 1.63, z: -0.06, r: 0.08, mat: chestnutHairMat },

      // Forehead curly fringe
      { x: -0.09, y: 1.57, z: 0.14, r: 0.055, mat: blondeHighlightMat },
      { x: -0.03, y: 1.59, z: 0.15, r: 0.05, mat: chestnutHairMat },
      { x: 0.04, y: 1.59, z: 0.15, r: 0.05, mat: blondeHighlightMat },
      { x: 0.09, y: 1.57, z: 0.14, r: 0.055, mat: chestnutHairMat },

      // Left curly cascade (shoulder length)
      { x: -0.19, y: 1.54, z: 0.06, r: 0.07, mat: chestnutHairMat },
      { x: -0.21, y: 1.48, z: 0.05, r: 0.075, mat: blondeHighlightMat },
      { x: -0.22, y: 1.41, z: 0.04, r: 0.08, mat: chestnutHairMat },
      { x: -0.20, y: 1.34, z: 0.03, r: 0.075, mat: blondeHighlightMat },
      { x: -0.17, y: 1.28, z: 0.02, r: 0.07, mat: chestnutHairMat },

      // Right curly cascade (shoulder length)
      { x: 0.19, y: 1.54, z: 0.06, r: 0.07, mat: blondeHighlightMat },
      { x: 0.21, y: 1.48, z: 0.05, r: 0.075, mat: chestnutHairMat },
      { x: 0.22, y: 1.41, z: 0.04, r: 0.08, mat: blondeHighlightMat },
      { x: 0.20, y: 1.34, z: 0.03, r: 0.075, mat: chestnutHairMat },
      { x: 0.17, y: 1.28, z: 0.02, r: 0.07, mat: blondeHighlightMat },

      // Back volume curls
      { x: -0.12, y: 1.46, z: -0.14, r: 0.085, mat: chestnutHairMat },
      { x: 0.0, y: 1.47, z: -0.16, r: 0.09, mat: blondeHighlightMat },
      { x: 0.12, y: 1.46, z: -0.14, r: 0.085, mat: chestnutHairMat },
      { x: -0.09, y: 1.36, z: -0.13, r: 0.08, mat: blondeHighlightMat },
      { x: 0.09, y: 1.36, z: -0.13, r: 0.08, mat: chestnutHairMat },
      { x: 0.0, y: 1.29, z: -0.12, r: 0.075, mat: blondeHighlightMat }
    ];

    curlClusterCoords.forEach(c => {
      const curlMesh = new THREE.Mesh(new THREE.SphereGeometry(c.r, 8, 8), c.mat);
      curlMesh.position.set(c.x, c.y, c.z);
      womanGroup.add(curlMesh);
      meshes.push(curlMesh);
    });

    // --- GREEN FLORAL DRESS (Vestido de flores verde) ---
    // Fitted Bodice
    const bodice = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.38, seg), greenFloralDressMat);
    bodice.position.set(0, 1.13, 0);
    bodice.scale.set(1.1, 1.0, 0.72);
    womanGroup.add(bodice);
    meshes.push(bodice);

    // Green belt / waistband
    const dressBelt = new THREE.Mesh(new THREE.CylinderGeometry(0.195, 0.195, 0.05, seg), dressBeltMat);
    dressBelt.position.set(0, 0.95, 0);
    dressBelt.scale.set(1.08, 1.0, 0.72);
    womanGroup.add(dressBelt);
    meshes.push(dressBelt);

    // Flared A-line bell skirt down to knees
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.36, 0.46, seg), greenFloralDressMat);
    skirt.position.set(0, 0.70, 0);
    skirt.scale.set(1.06, 1.0, 0.76);
    womanGroup.add(skirt);
    meshes.push(skirt);

    // Arms
    const wArmGeo = new THREE.CylinderGeometry(0.05, 0.045, 0.42, seg);
    const wHandGeo = new THREE.SphereGeometry(0.045, 8, 8);
    wHandGeo.scale(0.8, 1.1, 0.8);

    // Left Arm
    const wArmL = new THREE.Mesh(wArmGeo, womanSkinMat);
    wArmL.position.set(-0.25, 1.10, 0.02);
    wArmL.rotation.z = 0.12;
    wArmL.rotation.x = 0.10;
    const wHandL = new THREE.Mesh(wHandGeo, womanSkinMat);
    wHandL.position.set(-0.29, 0.88, 0.06);
    womanGroup.add(wArmL, wHandL);
    meshes.push(wArmL, wHandL);

    // Right Arm with gold bracelet
    const wArmR = new THREE.Mesh(wArmGeo, womanSkinMat);
    wArmR.position.set(0.25, 1.10, 0.02);
    wArmR.rotation.z = -0.12;
    wArmR.rotation.x = 0.10;
    const bracelet = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.008, 6, 10), goldJewelryMat);
    bracelet.position.set(0.28, 0.94, 0.05);
    bracelet.rotation.x = Math.PI / 2;
    const wHandR = new THREE.Mesh(wHandGeo, womanSkinMat);
    wHandR.position.set(0.29, 0.88, 0.06);
    womanGroup.add(wArmR, bracelet, wHandR);
    meshes.push(wArmR, bracelet, wHandR);

    // Legs below skirt
    const wLegGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.42, seg);
    const wLegL = new THREE.Mesh(wLegGeo, womanSkinMat);
    wLegL.position.set(-0.11, 0.32, 0);
    const wLegR = new THREE.Mesh(wLegGeo, womanSkinMat);
    wLegR.position.set(0.11, 0.32, 0);
    womanGroup.add(wLegL, wLegR);
    meshes.push(wLegL, wLegR);

    // Summer sandals (cork base + stylish green straps)
    const sandalSoleGeo = new THREE.BoxGeometry(0.12, 0.04, 0.23);
    const strapGeo = new THREE.BoxGeometry(0.125, 0.03, 0.06);

    const sandalL = new THREE.Mesh(sandalSoleGeo, sandalSoleMat);
    sandalL.position.set(-0.11, 0.02, 0.02);
    const strapL = new THREE.Mesh(strapGeo, sandalStrapMat);
    strapL.position.set(-0.11, 0.05, 0.03);

    const sandalR = new THREE.Mesh(sandalSoleGeo, sandalSoleMat);
    sandalR.position.set(0.11, 0.02, 0.02);
    const strapR = new THREE.Mesh(strapGeo, sandalStrapMat);
    strapR.position.set(0.11, 0.05, 0.03);

    womanGroup.add(sandalL, strapL, sandalR, strapR);
    meshes.push(sandalL, strapL, sandalR, strapR);

    group.add(womanGroup);

    return { group, meshes };
  }

static createSalamanderMesh(
    length = 74.0,
    quality: "low" | "medium" | "high" = "medium"
  ): {
    group: THREE.Group;
    meshes: THREE.Mesh[];
    platformMesh: THREE.Mesh;
    colliderData: {
      boxes: Array<{ position: { x: number; y: number; z: number }; size: { x: number; y: number; z: number }; rotationY: number }>;
      cylinders: Array<{ position: { x: number; y: number; z: number }; radius: number; height: number }>;
    };
  } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];
    const colliderData: {
      boxes: Array<{ position: { x: number; y: number; z: number }; size: { x: number; y: number; z: number }; rotationY: number }>;
      cylinders: Array<{ position: { x: number; y: number; z: number }; radius: number; height: number }>;
    } = { boxes: [], cylinders: [] };

    // Authentic Fire Salamander materials (glossy black skin with vibrant golden yellow markings)
    const blackSkinMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.28,
      metalness: 0.12
    });
    const yellowSpotMat = new THREE.MeshStandardMaterial({
      color: 0xffd600,
      roughness: 0.22,
      metalness: 0.05
    });
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x060608,
      roughness: 0.06,
      metalness: 0.85
    });
    const eyeGlintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const limbMat = new THREE.MeshStandardMaterial({
      color: 0x161619,
      roughness: 0.32,
      metalness: 0.1
    });

    const numSpineSegments = quality === "low" ? 24 : 36;

    // Organic S-curve spine function matching the natural crawling gait of Salamandra salamandra
    const getSpinePoint = (t: number) => {
      let x = 0;
      if (t < 0.42) {
        // Torso S-wave: swings right then left
        x = Math.sin((t / 0.42) * Math.PI * 2) * 2.4;
      } else {
        // Tail sweeping curve: curves outwards and tapers back to center
        const tTail = (t - 0.42) / 0.58;
        x = Math.sin(tTail * Math.PI) * 3.8 * (1 - tTail * 0.35);
      }
      const z = -t * length;
      return { x, z };
    };

    // Width profile: broad head -> plump ribcage -> progressive taper down to thin tail tip
    const getWidth = (t: number) => {
      if (t < 0.08) {
        return 5.6 - (t / 0.08) * 0.6;
      } else if (t < 0.42) {
        const tTorso = (t - 0.08) / 0.34;
        return 5.0 + Math.sin(tTorso * Math.PI) * 1.3;
      } else {
        const tTail = (t - 0.42) / 0.58;
        return 5.0 * Math.pow(Math.max(0, 1 - tTail), 0.75) + 1.15 * tTail;
      }
    };

    // 1. ANATOMICAL HEAD & SNOUT
    // Rounded broad snout platform (Spawn Area)
    const snoutGeo = new THREE.CylinderGeometry(2.8, 2.9, 0.8, 24);
    const snoutMesh = new THREE.Mesh(snoutGeo, blackSkinMat);
    snoutMesh.position.set(0, 0.4, 1.2);
    group.add(snoutMesh);
    meshes.push(snoutMesh);
    colliderData.cylinders.push({ position: { x: 0, y: 0.4, z: 1.2 }, radius: 2.8, height: 0.8 });

    // Cranium / Neck connection block
    const craniumGeo = new THREE.BoxGeometry(5.4, 0.8, 4.0);
    const craniumMesh = new THREE.Mesh(craniumGeo, blackSkinMat);
    craniumMesh.position.set(0, 0.4, -0.8);
    group.add(craniumMesh);
    meshes.push(craniumMesh);
    colliderData.boxes.push({ position: { x: 0, y: 0.4, z: -0.8 }, size: { x: 5.4, y: 0.8, z: 4.0 }, rotationY: 0 });

    // Prominent bulbous black eyes with corneal specular glint
    for (const sign of [-1, 1]) {
      const eyeSocket = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 12), blackSkinMat);
      eyeSocket.position.set(sign * 2.4, 0.55, 1.4);
      eyeSocket.scale.set(1.0, 0.8, 1.2);
      group.add(eyeSocket);
      meshes.push(eyeSocket);

      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), eyeMat);
      eye.position.set(sign * 2.5, 0.72, 1.45);
      group.add(eye);
      meshes.push(eye);

      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), eyeGlintMat);
      glint.position.set(sign * 2.38, 0.95, 1.7);
      group.add(glint);

      // Yellow spots on snout
      const snoutSpot = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.08, 12), yellowSpotMat);
      snoutSpot.position.set(sign * 1.1, 0.82, 2.2);
      group.add(snoutSpot);
      meshes.push(snoutSpot);

      // Parotoid glands (large kidney-shaped yellow patches behind each eye)
      const glandGeo = new THREE.CylinderGeometry(0.7, 0.75, 0.12, 16);
      glandGeo.scale(0.85, 1.0, 1.8);
      const gland = new THREE.Mesh(glandGeo, yellowSpotMat);
      gland.position.set(sign * 2.05, 0.83, -0.7);
      gland.rotation.y = sign * 0.15;
      group.add(gland);
      meshes.push(gland);
    }

    // 2. SINUOUS SPINE, TORSO & PROGRESSIVELY TAPERING TAIL
    for (let i = 1; i <= numSpineSegments; i++) {
      const tPrev = (i - 1) / numSpineSegments;
      const tCur = i / numSpineSegments;
      const pPrev = getSpinePoint(tPrev);
      const pCur = getSpinePoint(tCur);
      const midT = (tPrev + tCur) / 2;
      const w = getWidth(midT);

      const dx = pCur.x - pPrev.x;
      const dz = pCur.z - pPrev.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const yaw = Math.atan2(dx, dz);

      const midX = (pPrev.x + pCur.x) / 2;
      const midZ = (pPrev.z + pCur.z) / 2;

      // Overlapping box segment: creates seamless zero-gap roadway
      const sGeo = new THREE.BoxGeometry(w, 0.8, dist * 1.08);
      const sMesh = new THREE.Mesh(sGeo, blackSkinMat);
      sMesh.position.set(midX, 0.4, midZ);
      sMesh.rotation.y = yaw;
      group.add(sMesh);
      meshes.push(sMesh);

      colliderData.boxes.push({
        position: { x: midX, y: 0.4, z: midZ },
        size: { x: w, y: 0.8, z: dist * 1.08 },
        rotationY: yaw
      });

      // Flank rib contours (costal grooves) for authentic amphibian body
      if (midT >= 0.12 && midT <= 0.42 && i % 2 === 0) {
        for (const sign of [-1, 1]) {
          const ribGeo = new THREE.BoxGeometry(0.35, 0.7, dist * 0.7);
          const ribMesh = new THREE.Mesh(ribGeo, blackSkinMat);
          ribMesh.position.set(midX + sign * (w / 2 + 0.1), 0.35, midZ);
          ribMesh.rotation.y = yaw;
          group.add(ribMesh);
          meshes.push(ribMesh);
        }
      }

      // Yellow spots down the spine (matching the double row in the photo)
      const spotScale = Math.max(0.3, Math.min(1.0, (w - 0.5) / 4.5));
      const leftSpotRadius = (0.35 + (i % 3) * 0.08) * spotScale;
      const rightSpotRadius = (0.32 + ((i + 1) % 3) * 0.08) * spotScale;

      if (w > 1.8) {
        // Paired spots
        const spotGeoL = new THREE.CylinderGeometry(leftSpotRadius, leftSpotRadius, 0.08, 12);
        spotGeoL.scale(0.85, 1.0, 1.25);
        const spotL = new THREE.Mesh(spotGeoL, yellowSpotMat);
        const offsetL = (w * 0.28) * Math.cos(yaw);
        const offsetLZ = -(w * 0.28) * Math.sin(yaw);
        spotL.position.set(midX - offsetL, 0.82, midZ - offsetLZ);
        spotL.rotation.y = yaw + 0.1;
        group.add(spotL);
        meshes.push(spotL);

        const spotGeoR = new THREE.CylinderGeometry(rightSpotRadius, rightSpotRadius, 0.08, 12);
        spotGeoR.scale(0.85, 1.0, 1.25);
        const spotR = new THREE.Mesh(spotGeoR, yellowSpotMat);
        const offsetR = (w * 0.28) * Math.cos(yaw);
        const offsetRZ = -(w * 0.28) * Math.sin(yaw);
        spotR.position.set(midX + offsetR, 0.82, midZ + offsetRZ);
        spotR.rotation.y = yaw - 0.1;
        group.add(spotR);
        meshes.push(spotR);
      } else {
        // Narrow tail: single central golden dot
        const tailSpotGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.08, 10);
        const tailSpot = new THREE.Mesh(tailSpotGeo, yellowSpotMat);
        tailSpot.position.set(midX, 0.82, midZ);
        group.add(tailSpot);
        meshes.push(tailSpot);
      }
    }

    // 3. FOUR SPRAWLED LIMBS WITH AUTHENTIC FEET & TOES
    const limbConfigs = [
      // Forelimbs
      { hip: { x: -2.6, z: -11.5 }, foot: { x: -8.8, z: -9.5 }, isFront: true, side: -1 },
      { hip: { x: 2.6, z: -11.5 }, foot: { x: 8.8, z: -9.5 }, isFront: true, side: 1 },
      // Hindlimbs
      { hip: { x: -2.5, z: -29.5 }, foot: { x: -8.8, z: -32.5 }, isFront: false, side: -1 },
      { hip: { x: 2.5, z: -29.5 }, foot: { x: 8.8, z: -32.5 }, isFront: false, side: 1 }
    ];

    limbConfigs.forEach(leg => {
      const midLX = (leg.hip.x + leg.foot.x) / 2;
      const midLZ = (leg.hip.z + leg.foot.z) / 2;
      const dx = leg.foot.x - leg.hip.x;
      const dz = leg.foot.z - leg.hip.z;
      const legDist = Math.sqrt(dx * dx + dz * dz);
      const legYaw = Math.atan2(dx, dz);

      // Limb bridge walkway
      const limbGeo = new THREE.BoxGeometry(1.8, 0.7, legDist * 1.05);
      const limbMesh = new THREE.Mesh(limbGeo, limbMat);
      limbMesh.position.set(midLX, 0.35, midLZ);
      limbMesh.rotation.y = legYaw;
      group.add(limbMesh);
      meshes.push(limbMesh);

      colliderData.boxes.push({
        position: { x: midLX, y: 0.35, z: midLZ },
        size: { x: 1.8, y: 0.7, z: legDist * 1.05 },
        rotationY: legYaw
      });

      // Shoulder / Hip yellow joint patch
      const jointPatch = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.8, 0.1, 14), yellowSpotMat);
      jointPatch.position.set(leg.hip.x + leg.side * 0.4, 0.81, leg.hip.z);
      group.add(jointPatch);
      meshes.push(jointPatch);

      // Circular Foot Platform Pad
      const footGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.7, 20);
      const footMesh = new THREE.Mesh(footGeo, blackSkinMat);
      footMesh.position.set(leg.foot.x, 0.35, leg.foot.z);
      group.add(footMesh);
      meshes.push(footMesh);

      colliderData.cylinders.push({
        position: { x: leg.foot.x, y: 0.35, z: leg.foot.z },
        radius: 1.6,
        height: 0.7
      });

      // Foot yellow star accent
      const footDeco = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.08, 16), yellowSpotMat);
      footDeco.position.set(leg.foot.x, 0.72, leg.foot.z);
      group.add(footDeco);
      meshes.push(footDeco);

      // Splayed toes around the outer foot rim
      const numToes = leg.isFront ? 4 : 5;
      for (let tIdx = 0; tIdx < numToes; tIdx++) {
        const toeAngle = leg.side < 0
          ? Math.PI + (tIdx - (numToes - 1) / 2) * 0.4
          : (tIdx - (numToes - 1) / 2) * 0.4;
        const toeX = leg.foot.x + Math.cos(toeAngle) * 1.8;
        const toeZ = leg.foot.z + Math.sin(toeAngle) * 1.8;
        const toeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), blackSkinMat);
        toeMesh.position.set(toeX, 0.35, toeZ);
        toeMesh.scale.set(1.2, 0.7, 1.2);
        group.add(toeMesh);
        meshes.push(toeMesh);
      }
    });

    // 4. TAIL TIP & INTEGRATED GOAL DOCK
    const tailTipPt = getSpinePoint(1.0);
    const dockGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.8, 24);
    const dockMesh = new THREE.Mesh(dockGeo, blackSkinMat);
    dockMesh.position.set(tailTipPt.x, 0.4, tailTipPt.z);
    group.add(dockMesh);
    meshes.push(dockMesh);

    // Golden goal pedestal ring
    const ringGeo = new THREE.TorusGeometry(1.4, 0.15, 12, 24);
    ringGeo.rotateX(Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, yellowSpotMat);
    ringMesh.position.set(tailTipPt.x, 0.81, tailTipPt.z);
    group.add(ringMesh);
    meshes.push(ringMesh);

    colliderData.cylinders.push({
      position: { x: tailTipPt.x, y: 0.4, z: tailTipPt.z },
      radius: 1.6,
      height: 0.8
    });

    return { group, meshes, platformMesh: snoutMesh, colliderData };
  }

static createMisinaCatMesh(
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; mouthPortal: THREE.Mesh; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const whiteFurMat = new THREE.MeshStandardMaterial({ color: 0xfcfcfc, roughness: 0.4, metalness: 0.05 });
    const pinkEarMat = new THREE.MeshStandardMaterial({ color: 0xff80ab, roughness: 0.5 });
    const emeraldEyeMat = new THREE.MeshStandardMaterial({ color: 0x00e676, emissive: 0x00c853, emissiveIntensity: 0.7 });
    const toothMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 });
    const tongueMat = new THREE.MeshStandardMaterial({ color: 0xd81b60, roughness: 0.4 });

    const headW = 7.5;
    const headH = 5.8;
    const headD = 3.6;

    // Cat Face Arch
    const head = new THREE.Mesh(new THREE.BoxGeometry(headW, headH, headD), whiteFurMat);
    head.position.y = headH / 2;
    group.add(head);
    meshes.push(head);

    // Pointy Triangular Ears
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2.2, 4), whiteFurMat);
      ear.position.set(side * (headW / 2 - 0.8), headH + 0.9, 0);
      ear.rotation.z = side * -0.25;
      const innerEar = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.6, 4), pinkEarMat);
      innerEar.position.set(side * (headW / 2 - 0.8), headH + 0.9, 0.25);
      innerEar.rotation.z = side * -0.25;
      group.add(ear, innerEar);
      meshes.push(ear, innerEar);
    }

    // Glowing Emerald Cat Eyes
    for (const ex of [-1.8, 1.8]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 10), emeraldEyeMat);
      eye.scale.set(1.2, 0.8, 0.5);
      eye.position.set(ex, headH * 0.65, headD / 2 + 0.05);
      group.add(eye);
      meshes.push(eye);
    }

    // Open Maw / Mouth Entrance
    const mouthW = 3.8;
    const mouthH = 2.4;
    const mouthPortal = new THREE.Mesh(new THREE.BoxGeometry(mouthW, mouthH, headD + 0.4), tongueMat);
    mouthPortal.position.set(0, mouthH / 2 + 0.3, 0);
    group.add(mouthPortal);
    meshes.push(mouthPortal);

    // Sharp White Teeth framing the mouth opening
    for (let t = -1.4; t <= 1.4; t += 0.7) {
      // Upper incisors & canines
      const upperTooth = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.45, 4), toothMat);
      upperTooth.rotation.x = Math.PI;
      upperTooth.position.set(t, mouthH + 0.25, headD / 2 + 0.1);
      // Lower teeth
      const lowerTooth = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.38, 4), toothMat);
      lowerTooth.position.set(t, 0.35, headD / 2 + 0.1);
      group.add(upperTooth, lowerTooth);
      meshes.push(upperTooth, lowerTooth);
    }

    return { group, mouthPortal, meshes };
  }

static createA4SheetMesh(
    width: number = 3.8,
    height: number = 0.16,
    length: number = 5.38,
    quality: "low" | "medium" | "high" = "medium",
    sheetIndex: number = 1,
    pencilColor: string = "#e53935"
  ): { group: THREE.Group; platformMesh: THREE.Mesh; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    // 1. Materials for the authentic A4 paper sheet
    const paperTexture = SpriteTextures.getColoringPageTexture(sheetIndex);

    const sideMat = quality === "low"
      ? new THREE.MeshLambertMaterial({ color: 0xf7f5ee })
      : quality === "medium"
      ? new THREE.MeshPhongMaterial({ color: 0xf7f5ee, shininess: 8 })
      : new THREE.MeshStandardMaterial({ color: 0xf7f5ee, roughness: 0.88, metalness: 0.02 });

    const botMat = quality === "low"
      ? new THREE.MeshLambertMaterial({ color: 0xeeebe2 })
      : quality === "medium"
      ? new THREE.MeshPhongMaterial({ color: 0xeeebe2, shininess: 5 })
      : new THREE.MeshStandardMaterial({ color: 0xeeebe2, roughness: 0.92, metalness: 0.01 });

    // Top face has the crisp botanical coloring page artwork!
    const topMat = quality === "low"
      ? new THREE.MeshLambertMaterial({ map: paperTexture, color: 0xffffff })
      : quality === "medium"
      ? new THREE.MeshPhongMaterial({ map: paperTexture, color: 0xffffff, shininess: 10, specular: new THREE.Color(0x1a1a1a) })
      : new THREE.MeshStandardMaterial({ map: paperTexture, color: 0xffffff, roughness: 0.78, metalness: 0.02 });

    // 2. The main A4 paper block (face order: +X, -X, +Y, -Y, +Z, -Z)
    const paperGeo = new THREE.BoxGeometry(width, height, length);
    const platformMesh = new THREE.Mesh(paperGeo, [sideMat, sideMat, topMat, botMat, sideMat, sideMat]);
    platformMesh.castShadow = true;
    platformMesh.receiveShadow = true;
    group.add(platformMesh);
    meshes.push(platformMesh);

    // 3. Cardboard drafting backing board (sits directly beneath paper block)
    const backingMat = quality === "low"
      ? new THREE.MeshLambertMaterial({ color: 0xbcaaa4 })
      : new THREE.MeshStandardMaterial({ color: 0xbcaaa4, roughness: 0.85, metalness: 0.05 });
    const backingGeo = new THREE.BoxGeometry(width + 0.14, 0.03, length + 0.14);
    const backingMesh = new THREE.Mesh(backingGeo, backingMat);
    backingMesh.position.y = -height / 2 - 0.015;
    group.add(backingMesh);
    meshes.push(backingMesh);

    // 4. Metallic Brass Paperclip (Sujetapapeles de Oficina) clipping the top-left edge
    const clipColor = 0xd4af37;
    const clipMat = quality === "low"
      ? new THREE.MeshLambertMaterial({ color: clipColor })
      : new THREE.MeshStandardMaterial({ color: clipColor, roughness: 0.22, metalness: 0.92 });

    const clipGroup = new THREE.Group();
    const clipX = -width / 2 + 0.55;
    const clipY = height / 2 + 0.008;
    const clipZ = -length / 2 + 0.35;
    clipGroup.position.set(clipX, clipY, clipZ);

    const wireR = 0.014;
    const outerL = 0.52;
    const outerW = 0.18;
    const wire1 = new THREE.Mesh(new THREE.CylinderGeometry(wireR, wireR, outerL, 6), clipMat);
    wire1.position.set(-outerW / 2, 0, 0);
    const wire2 = new THREE.Mesh(new THREE.CylinderGeometry(wireR, wireR, outerL - 0.1, 6), clipMat);
    wire2.position.set(outerW / 2, 0, -0.05);

    const topCurve = new THREE.Mesh(new THREE.TorusGeometry(outerW / 2, wireR, 6, 12, Math.PI), clipMat);
    topCurve.rotateX(Math.PI / 2);
    topCurve.position.set(0, 0, -outerL / 2);

    const botCurve = new THREE.Mesh(new THREE.TorusGeometry(outerW / 2 - wireR * 1.5, wireR, 6, 12, Math.PI), clipMat);
    botCurve.rotateX(Math.PI / 2);
    botCurve.rotateZ(Math.PI);
    botCurve.position.set(wireR * 0.75, 0, outerL / 2);

    const innerWire = new THREE.Mesh(new THREE.CylinderGeometry(wireR, wireR, outerL * 0.65, 6), clipMat);
    innerWire.position.set(0, 0, 0.04);

    clipGroup.add(wire1, wire2, topCurve, botCurve, innerWire);
    group.add(clipGroup);
    meshes.push(wire1, wire2, topCurve, botCurve, innerWire);

    // 5. Sharpened Wooden Colored Pencil (Lápiz de Madera de Color) resting on top-right margin
    const pencilGroup = new THREE.Group();
    const pX = width / 2 - 0.38;
    const pY = height / 2 + 0.045;
    const pZ = -length / 2 + 1.15;
    pencilGroup.position.set(pX, pY, pZ);
    pencilGroup.rotation.y = -0.16;

    const pCol = new THREE.Color(pencilColor);
    const bodyMat = quality === "low"
      ? new THREE.MeshLambertMaterial({ color: pCol })
      : new THREE.MeshStandardMaterial({ color: pCol, roughness: 0.35, metalness: 0.08 });
    const woodMat = quality === "low"
      ? new THREE.MeshLambertMaterial({ color: 0xd7ccc8 })
      : new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.75, metalness: 0.02 });
    const leadMat = quality === "low"
      ? new THREE.MeshLambertMaterial({ color: pCol })
      : new THREE.MeshStandardMaterial({ color: pCol, roughness: 0.5, metalness: 0.1 });
    const ferruleMat = new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.25, metalness: 0.85 });
    const eraserMat = new THREE.MeshStandardMaterial({ color: 0xf48fb1, roughness: 0.85 });

    const pBodyLen = 1.1;
    const pR = 0.045;

    // Hexagonal pencil barrel
    const pBarrel = new THREE.Mesh(new THREE.CylinderGeometry(pR, pR, pBodyLen, 6), bodyMat);
    pBarrel.rotateX(Math.PI / 2);
    pencilGroup.add(pBarrel);
    meshes.push(pBarrel);

    // Sharpened cone
    const coneLen = 0.18;
    const pCone = new THREE.Mesh(new THREE.ConeGeometry(pR, coneLen, 6), woodMat);
    pCone.rotateX(-Math.PI / 2);
    pCone.position.set(0, 0, pBodyLen / 2 + coneLen / 2);
    pencilGroup.add(pCone);
    meshes.push(pCone);

    // Pigment lead tip
    const tipLen = 0.07;
    const pTip = new THREE.Mesh(new THREE.ConeGeometry(pR * 0.38, tipLen, 6), leadMat);
    pTip.rotateX(-Math.PI / 2);
    pTip.position.set(0, 0, pBodyLen / 2 + coneLen + tipLen / 2 - 0.02);
    pencilGroup.add(pTip);
    meshes.push(pTip);

    // Rear metal ferrule
    const fLen = 0.08;
    const pFerrule = new THREE.Mesh(new THREE.CylinderGeometry(pR * 1.03, pR * 1.03, fLen, 8), ferruleMat);
    pFerrule.rotateX(Math.PI / 2);
    pFerrule.position.set(0, 0, -pBodyLen / 2 - fLen / 2);
    pencilGroup.add(pFerrule);
    meshes.push(pFerrule);

    // Pink rubber eraser
    const eLen = 0.10;
    const pEraser = new THREE.Mesh(new THREE.CylinderGeometry(pR * 0.98, pR * 0.98, eLen, 8), eraserMat);
    pEraser.rotateX(Math.PI / 2);
    pEraser.position.set(0, 0, -pBodyLen / 2 - fLen - eLen / 2);
    pencilGroup.add(pEraser);
    meshes.push(pEraser);

    group.add(pencilGroup);

    return { group, platformMesh, meshes };
  }

static createGokuMesh(
    quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "giant_goku_saiyan_group";
    const meshes: THREE.Mesh[] = [];

    const segs = quality === "high" ? 16 : quality === "medium" ? 10 : 8;

    const makeM = (color: number, rough = 0.5, metal = 0.05, emissive = 0x000000, emissiveInt = 0) => {
      if (quality === "low") {
        return new THREE.MeshLambertMaterial({
          color,
          emissive: emissive !== 0 ? emissive : 0x000000
        });
      }
      return new THREE.MeshStandardMaterial({
        color,
        roughness: rough,
        metalness: metal,
        emissive: emissive !== 0 ? emissive : 0x000000,
        emissiveIntensity: emissive !== 0 ? emissiveInt : 0
      });
    };

    // Authentic Akira Toriyama DBZ Color Palette
    const giOrangeMat = makeM(0xff6d00, 0.55, 0.05); // Classic Dragon Ball Dogi orange
    const giShadowMat = makeM(0xe65100, 0.65, 0.05); // Shadow orange for folds
    const navyMat = makeM(0x0d47a1, 0.55, 0.08); // Turtle School dark navy undershirt, sash & wristbands
    const skinMat = makeM(0xffd1a4, 0.58, 0.02); // Peach anime skin tone
    const skinShadowMat = makeM(0xf5b584, 0.62, 0.02); // Muscle contour shadow
    const hairMat = makeM(0xffea00, 0.25, 0.15, 0xffd600, 0.55); // Glowing golden Super Saiyan hair
    const hairHighlightMat = makeM(0xfff9c4, 0.2, 0.1, 0xfff59d, 0.7); // Light gold hair highlight
    const eyeCyanMat = makeM(0x00e676, 0.2, 0.0, 0x00e676, 0.95); // Emerald-cyan SSJ irises
    const eyeWhiteMat = makeM(0xffffff, 0.3, 0.0);
    const blackMat = makeM(0x1a1a1a, 0.85, 0.05); // DBZ outlines, eyebrows, boot soles
    const mouthMat = makeM(0x880e4f, 0.7, 0.0); // Battle cry mouth cavity
    const teethMat = makeM(0xffffff, 0.2, 0.0);
    const redPipingMat = makeM(0xd50000, 0.45, 0.1); // Red boot piping
    const goldRopeMat = makeM(0xffd700, 0.3, 0.7); // Gold boot rope wrap
    const rockMat = makeM(0x37474f, 0.88, 0.15); // Granite chiseled base
    const kiAuraMat = new THREE.MeshBasicMaterial({
      color: 0xffee58,
      transparent: true,
      opacity: 0.65
    });
    const kiSparksMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.95
    });
    const energyGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.85
    });
    const energyCoreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });

    // 1. CHISELED ROCK PEDESTAL & GROUND FRACTURE CRATER
    const pedestalGeo = new THREE.CylinderGeometry(2.3, 2.7, 0.6, 12);
    const pedestal = new THREE.Mesh(pedestalGeo, rockMat);
    pedestal.position.y = 0.3;
    group.add(pedestal);
    meshes.push(pedestal);

    const stepGeo = new THREE.CylinderGeometry(2.6, 2.9, 0.2, 12);
    const step = new THREE.Mesh(stepGeo, rockMat);
    step.position.y = 0.1;
    group.add(step);
    meshes.push(step);

    // Radiating Golden Ki Aura Disc on Ground
    const auraDiscGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.04, 20);
    const auraDisc = new THREE.Mesh(auraDiscGeo, hairMat);
    auraDisc.position.y = 0.61;
    group.add(auraDisc);
    meshes.push(auraDisc);

    // Crater impact rocks lifted by ki pressure
    const rockOffsets = [
      { x: -1.7, z: 1.1, s: 0.35, r: 0.2 },
      { x: 1.8, z: 0.9, s: 0.38, r: -0.3 },
      { x: -1.5, z: -1.3, s: 0.32, r: 0.4 },
      { x: 1.6, z: -1.2, s: 0.36, r: -0.25 }
    ];
    for (const rk of rockOffsets) {
      const rockChunk = new THREE.Mesh(new THREE.DodecahedronGeometry(rk.s, 0), rockMat);
      rockChunk.position.set(rk.x, 0.65 + rk.s * 0.4, rk.z);
      rockChunk.rotation.set(rk.r, rk.r * 2, rk.r * 1.5);
      group.add(rockChunk);
      meshes.push(rockChunk);
    }

    // 2. LEGS & AUTHENTIC DBZ BOOTS IN ZENKUTSU-DACHI COMBAT STANCE
    const legConfigs = [
      {
        side: "left",
        hipX: -0.48, hipZ: 0.18,
        kneeX: -0.55, kneeY: 1.35, kneeZ: 0.25,
        bootX: -0.58, bootY: 0.75, bootZ: 0.32,
        rotY: 0.25, rotX: -0.15
      },
      {
        side: "right",
        hipX: 0.52, hipZ: -0.22,
        kneeX: 0.62, kneeY: 1.32, kneeZ: -0.32,
        bootX: 0.68, bootY: 0.75, bootZ: -0.42,
        rotY: -0.35, rotX: 0.2
      }
    ];

    for (const lc of legConfigs) {
      // Billowing orange Dogi thigh / quad
      const thighGeo = new THREE.CylinderGeometry(0.32, 0.28, 0.85, segs);
      const thigh = new THREE.Mesh(thighGeo, giOrangeMat);
      thigh.position.set((lc.hipX + lc.kneeX) / 2, (1.9 + lc.kneeY) / 2, (lc.hipZ + lc.kneeZ) / 2);
      thigh.rotation.set(lc.rotX, lc.rotY, 0);
      group.add(thigh);
      meshes.push(thigh);

      // Thigh fabric fold shadow
      const foldRingGeo = new THREE.TorusGeometry(0.33, 0.05, 6, 12);
      foldRingGeo.rotateX(Math.PI / 2);
      const foldRing = new THREE.Mesh(foldRingGeo, giShadowMat);
      foldRing.position.copy(thigh.position);
      group.add(foldRing);
      meshes.push(foldRing);

      // Knee joint
      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.28, segs, segs), giOrangeMat);
      knee.position.set(lc.kneeX, lc.kneeY, lc.kneeZ);
      group.add(knee);
      meshes.push(knee);

      // Calf tucked into boot
      const calfGeo = new THREE.CylinderGeometry(0.26, 0.23, 0.65, segs);
      const calf = new THREE.Mesh(calfGeo, giOrangeMat);
      calf.position.set((lc.kneeX + lc.bootX) / 2, (lc.kneeY + lc.bootY) / 2, (lc.kneeZ + lc.bootZ) / 2);
      calf.rotation.set(lc.rotX * 0.8, lc.rotY, 0);
      group.add(calf);
      meshes.push(calf);

      // --- AUTHENTIC DBZ BOOT ---
      const bootGroup = new THREE.Group();
      bootGroup.position.set(lc.bootX, 0.6, lc.bootZ);
      bootGroup.rotation.y = lc.rotY * 1.5;

      // Dark navy boot shaft
      const shaftGeo = new THREE.CylinderGeometry(0.22, 0.20, 0.55, segs);
      const shaft = new THREE.Mesh(shaftGeo, navyMat);
      shaft.position.y = 0.32;
      bootGroup.add(shaft);
      meshes.push(shaft);

      // Boot foot box
      const footGeo = new THREE.BoxGeometry(0.34, 0.28, 0.62);
      const foot = new THREE.Mesh(footGeo, navyMat);
      foot.position.set(0, 0.16, 0.12);
      bootGroup.add(foot);
      meshes.push(foot);

      // Curved toe tip
      const toeGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.34, segs);
      toeGeo.rotateZ(Math.PI / 2);
      const toe = new THREE.Mesh(toeGeo, navyMat);
      toe.position.set(0, 0.14, 0.38);
      bootGroup.add(toe);
      meshes.push(toe);

      // Red vertical piping running up the front center of the boot
      const pipingGeo = new THREE.BoxGeometry(0.045, 0.56, 0.05);
      const piping = new THREE.Mesh(pipingGeo, redPipingMat);
      piping.position.set(0, 0.32, 0.21);
      bootGroup.add(piping);
      meshes.push(piping);

      const footPipingGeo = new THREE.BoxGeometry(0.045, 0.06, 0.42);
      const footPiping = new THREE.Mesh(footPipingGeo, redPipingMat);
      footPiping.position.set(0, 0.29, 0.18);
      bootGroup.add(footPiping);
      meshes.push(footPiping);

      // Gold rope ankle wraps (2 rings)
      for (const yRope of [0.18, 0.28]) {
        const ropeGeo = new THREE.TorusGeometry(0.21, 0.035, 6, 12);
        ropeGeo.rotateX(Math.PI / 2);
        const rope = new THREE.Mesh(ropeGeo, goldRopeMat);
        rope.position.y = yRope;
        bootGroup.add(rope);
        meshes.push(rope);
      }

      // Black rubber sole
      const soleGeo = new THREE.BoxGeometry(0.36, 0.06, 0.68);
      const sole = new THREE.Mesh(soleGeo, blackMat);
      sole.position.set(0, 0.03, 0.14);
      bootGroup.add(sole);
      meshes.push(sole);

      group.add(bootGroup);
    }

    // 3. WAIST, SASH (OBI) & FLUTTERING TAILS
    const sashGeo = new THREE.CylinderGeometry(0.58, 0.55, 0.32, segs);
    const sash = new THREE.Mesh(sashGeo, navyMat);
    sash.position.y = 2.05;
    group.add(sash);
    meshes.push(sash);

    // Sash knot on left hip
    const knot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), navyMat);
    knot.position.set(-0.52, 2.05, 0.1);
    group.add(knot);
    meshes.push(knot);

    // Dynamic fluttering sash tails trailing backward
    const tail1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.72, 0.04), navyMat);
    tail1.position.set(-0.56, 1.68, 0.15);
    tail1.rotation.set(-0.25, 0.3, 0.15);
    const tail2 = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.82, 0.04), navyMat);
    tail2.position.set(-0.52, 1.62, 0.22);
    tail2.rotation.set(-0.35, 0.45, 0.1);
    group.add(tail1, tail2);
    meshes.push(tail1, tail2);

    // 4. MUSCULAR TORSO, CHEST & ORANGE DOGI
    const torsoGeo = new THREE.BoxGeometry(1.15, 1.25, 0.72);
    const torso = new THREE.Mesh(torsoGeo, giOrangeMat);
    torso.position.y = 2.75;
    group.add(torso);
    meshes.push(torso);

    const latL = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.15, 0.95, 8), giShadowMat);
    latL.position.set(-0.54, 2.75, 0);
    latL.rotation.z = -0.15;
    const latR = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.15, 0.95, 8), giShadowMat);
    latR.position.set(0.54, 2.75, 0);
    latR.rotation.z = 0.15;
    group.add(latL, latR);
    meshes.push(latL, latR);

    // Dark Navy Blue Undershirt visible at the chest and neck V-opening
    const undershirtGeo = new THREE.BoxGeometry(0.58, 0.85, 0.75);
    const undershirt = new THREE.Mesh(undershirtGeo, navyMat);
    undershirt.position.set(0, 2.9, 0.02);
    group.add(undershirt);
    meshes.push(undershirt);

    // Chiseled Anime Pectorals & Collarbone in Peach Skin Tone
    const pecL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.32, 0.77), skinMat);
    pecL.position.set(-0.13, 2.92, 0.03);
    pecL.rotation.z = 0.08;
    const pecR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.32, 0.77), skinMat);
    pecR.position.set(0.13, 2.92, 0.03);
    pecR.rotation.z = -0.08;
    const sternum = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.78), skinShadowMat);
    sternum.position.set(0, 2.9, 0.035);
    group.add(pecL, pecR, sternum);
    meshes.push(pecL, pecR, sternum);

    // Neck with muscle definition
    const neckGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.45, segs);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.set(0, 3.42, 0.02);
    group.add(neck);
    meshes.push(neck);

    // 5. MUSCULAR ARMS IN KAMEHAMEHA CHARGING STANCE
    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.28, segs, segs), skinMat);
    shoulderR.position.set(0.68, 3.15, -0.05);
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.28, segs, segs), skinMat);
    shoulderL.position.set(-0.65, 3.15, 0.02);
    group.add(shoulderR, shoulderL);
    meshes.push(shoulderR, shoulderL);

    // Right Arm (pulled back deeply to the right hip)
    const bicepR = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.18, 0.65, segs), skinMat);
    bicepR.position.set(0.72, 2.7, -0.22);
    bicepR.rotation.set(-0.6, 0.25, -0.3);

    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 0.68, segs), skinMat);
    forearmR.position.set(0.65, 2.38, -0.45);
    forearmR.rotation.set(-0.75, 0.4, -0.2);

    const wristbandR = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.18, 0.24, segs), navyMat);
    wristbandR.position.set(0.62, 2.22, -0.56);
    wristbandR.rotation.set(-0.75, 0.4, -0.2);

    group.add(bicepR, forearmR, wristbandR);
    meshes.push(bicepR, forearmR, wristbandR);

    // Left Arm (crossing chest to right hip)
    const bicepL = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.17, 0.72, segs), skinMat);
    bicepL.position.set(-0.25, 2.85, -0.15);
    bicepL.rotation.set(-0.4, 0.8, -0.65);

    const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 0.70, segs), skinMat);
    forearmL.position.set(0.32, 2.45, -0.42);
    forearmL.rotation.set(-0.55, 0.65, -0.3);

    const wristbandL = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.18, 0.24, segs), navyMat);
    wristbandL.position.set(0.46, 2.26, -0.54);
    wristbandL.rotation.set(-0.55, 0.65, -0.3);

    group.add(bicepL, forearmL, wristbandL);
    meshes.push(bicepL, forearmL, wristbandL);

    // 6. SCULPTED HANDS CUPPED AT RIGHT HIP CHANNELING THE CHARGE
    const handsGroup = new THREE.Group();
    handsGroup.position.set(0.58, 2.22, -0.68);

    // Palm base for both hands
    const palmR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.12), skinMat);
    palmR.position.set(0.08, -0.04, 0.05);
    palmR.rotation.set(0.3, -0.4, 0.2);

    const palmL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.12), skinMat);
    palmL.position.set(-0.08, 0.04, 0.05);
    palmL.rotation.set(-0.3, 0.4, -0.2);

    handsGroup.add(palmR, palmL);
    meshes.push(palmR, palmL);

    // Sculpted curved fingers grasping the ki sphere
    const fingerGeo = new THREE.CylinderGeometry(0.038, 0.032, 0.22, 6);
    fingerGeo.rotateX(Math.PI / 4);

    const fingerPositions = [
      { x: 0.14, y: 0.12, z: -0.08, rx: 0.5, ry: -0.3 },
      { x: 0.16, y: 0.04, z: -0.10, rx: 0.4, ry: -0.2 },
      { x: 0.15, y: -0.05, z: -0.09, rx: 0.3, ry: -0.1 },
      { x: 0.12, y: -0.13, z: -0.06, rx: 0.2, ry: 0.0 },
      { x: -0.14, y: 0.14, z: -0.08, rx: -0.5, ry: 0.3 },
      { x: -0.16, y: 0.05, z: -0.10, rx: -0.4, ry: 0.2 },
      { x: -0.15, y: -0.04, z: -0.09, rx: -0.3, ry: 0.1 },
      { x: -0.12, y: -0.12, z: -0.06, rx: -0.2, ry: 0.0 }
    ];
    for (const fp of fingerPositions) {
      const finger = new THREE.Mesh(fingerGeo, skinMat);
      finger.position.set(fp.x, fp.y, fp.z);
      finger.rotation.set(fp.rx, fp.ry, 0);
      handsGroup.add(finger);
      meshes.push(finger);
    }

    // Kamehameha Concentrated Charging Core Orb
    const coreSphere = new THREE.Mesh(new THREE.SphereGeometry(0.28, segs, segs), energyCoreMat);
    const auraSphere = new THREE.Mesh(new THREE.SphereGeometry(0.55, segs, segs), energyGlowMat);
    handsGroup.add(coreSphere, auraSphere);
    meshes.push(coreSphere, auraSphere);

    // Orbiting Ki Ring
    const orbitRingGeo = new THREE.TorusGeometry(0.62, 0.035, 6, 16);
    orbitRingGeo.rotateX(Math.PI / 3);
    const orbitRing = new THREE.Mesh(orbitRingGeo, kiSparksMat);
    handsGroup.add(orbitRing);
    meshes.push(orbitRing);

    group.add(handsGroup);

    // 7. HIGH-FIDELITY ANIME HEAD SCULPT, FACE & BATTLE-CRY EXPRESSION
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 3.75, 0.06);

    // Cranium / Face base
    const craniumGeo = new THREE.BoxGeometry(0.48, 0.52, 0.46);
    const cranium = new THREE.Mesh(craniumGeo, skinMat);
    headGroup.add(cranium);
    meshes.push(cranium);

    // Chiseled Dragon Ball Anime Jawline & Pointed Chin
    const jawGeo = new THREE.ConeGeometry(0.32, 0.38, 4);
    jawGeo.rotateX(Math.PI);
    jawGeo.rotateY(Math.PI / 4);
    const jaw = new THREE.Mesh(jawGeo, skinMat);
    jaw.position.set(0, -0.28, 0.08);
    jaw.scale.set(1.0, 1.0, 0.85);
    headGroup.add(jaw);
    meshes.push(jaw);

    // Sculpted Anime Ears (Left & Right)
    for (const earX of [-0.27, 0.27]) {
      const earGeo = new THREE.BoxGeometry(0.06, 0.22, 0.16);
      const ear = new THREE.Mesh(earGeo, skinMat);
      ear.position.set(earX, -0.05, -0.04);
      ear.rotation.y = earX > 0 ? 0.25 : -0.25;
      headGroup.add(ear);
      meshes.push(ear);
    }

    // Sharp DBZ Nose Bridge & Pointed Tip
    const noseGeo = new THREE.ConeGeometry(0.06, 0.16, 4);
    noseGeo.rotateX(Math.PI / 2.3);
    const nose = new THREE.Mesh(noseGeo, skinShadowMat);
    nose.position.set(0, -0.06, 0.28);
    headGroup.add(nose);
    meshes.push(nose);

    // Battle Cry Open Yelling Mouth
    const mouthFrameGeo = new THREE.BoxGeometry(0.24, 0.16, 0.08);
    const mouthFrame = new THREE.Mesh(mouthFrameGeo, blackMat);
    mouthFrame.position.set(0, -0.21, 0.25);

    const mouthInnerGeo = new THREE.BoxGeometry(0.20, 0.12, 0.09);
    const mouthInner = new THREE.Mesh(mouthInnerGeo, mouthMat);
    mouthInner.position.set(0, -0.21, 0.255);

    const teethTopGeo = new THREE.BoxGeometry(0.18, 0.035, 0.092);
    const teethTop = new THREE.Mesh(teethTopGeo, teethMat);
    teethTop.position.set(0, -0.17, 0.26);

    const teethBotGeo = new THREE.BoxGeometry(0.16, 0.032, 0.092);
    const teethBot = new THREE.Mesh(teethBotGeo, teethMat);
    teethBot.position.set(0, -0.25, 0.26);

    headGroup.add(mouthFrame, mouthInner, teethTop, teethBot);
    meshes.push(mouthFrame, mouthInner, teethTop, teethBot);

    // Fierce Piercing Super Saiyan Eyes & Golden Brow Ridge
    const browGeo = new THREE.BoxGeometry(0.38, 0.07, 0.14);
    const brow = new THREE.Mesh(browGeo, hairMat);
    brow.position.set(0, 0.12, 0.26);
    headGroup.add(brow);
    meshes.push(brow);

    for (const eyeX of [-0.13, 0.13]) {
      const eyeContour = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.04), blackMat);
      eyeContour.position.set(eyeX, 0.04, 0.25);
      eyeContour.rotation.z = eyeX > 0 ? -0.15 : 0.15;

      const eyeWhite = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.055, 0.045), eyeWhiteMat);
      eyeWhite.position.set(eyeX, 0.04, 0.255);
      eyeWhite.rotation.z = eyeX > 0 ? -0.15 : 0.15;

      const iris = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.055, 0.05), eyeCyanMat);
      iris.position.set(eyeX + (eyeX > 0 ? -0.015 : 0.015), 0.04, 0.26);

      headGroup.add(eyeContour, eyeWhite, iris);
      meshes.push(eyeContour, eyeWhite, iris);
    }

    // 8. ICONIC SUPER SAIYAN SPIKY HAIR (18+ TIERED MAJESTIC GOLDEN CONES)
    const crownSpikes = [
      { pos: [0.0, 0.65, -0.12], rot: [-0.22, 0, 0], scale: [0.46, 1.35, 0.46] },
      { pos: [-0.34, 0.58, -0.04], rot: [-0.12, 0.1, 0.38], scale: [0.42, 1.25, 0.42] },
      { pos: [0.34, 0.58, -0.04], rot: [-0.12, -0.1, -0.38], scale: [0.42, 1.25, 0.42] }
    ];
    for (const cs of crownSpikes) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(cs.scale[0], cs.scale[1], 7), hairMat);
      cone.position.set(cs.pos[0], cs.pos[1], cs.pos[2]);
      cone.rotation.set(cs.rot[0], cs.rot[1], cs.rot[2]);
      headGroup.add(cone);
      meshes.push(cone);

      const tip = new THREE.Mesh(new THREE.ConeGeometry(cs.scale[0] * 0.45, cs.scale[1] * 0.4, 7), hairHighlightMat);
      tip.position.set(cs.pos[0], cs.pos[1] + cs.scale[1] * 0.3, cs.pos[2]);
      tip.rotation.set(cs.rot[0], cs.rot[1], cs.rot[2]);
      headGroup.add(tip);
      meshes.push(tip);
    }

    const midSpikes = [
      { pos: [-0.48, 0.36, 0.06], rot: [0.1, 0.1, 0.72], scale: [0.36, 1.05, 0.36] },
      { pos: [0.48, 0.36, 0.06], rot: [0.1, -0.1, -0.72], scale: [0.36, 1.05, 0.36] },
      { pos: [-0.55, 0.12, 0.08], rot: [0.2, 0.15, 0.95], scale: [0.32, 0.95, 0.32] },
      { pos: [0.55, 0.12, 0.08], rot: [0.2, -0.15, -0.95], scale: [0.32, 0.95, 0.32] },
      { pos: [-0.22, 0.48, -0.28], rot: [-0.55, -0.2, 0.22], scale: [0.38, 1.1, 0.38] },
      { pos: [0.22, 0.48, -0.28], rot: [-0.55, 0.2, -0.22], scale: [0.38, 1.1, 0.38] },
      { pos: [0.0, 0.42, -0.32], rot: [-0.65, 0, 0], scale: [0.38, 1.05, 0.38] }
    ];
    for (const ms of midSpikes) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(ms.scale[0], ms.scale[1], 6), hairMat);
      cone.position.set(ms.pos[0], ms.pos[1], ms.pos[2]);
      cone.rotation.set(ms.rot[0], ms.rot[1], ms.rot[2]);
      headGroup.add(cone);
      meshes.push(cone);
    }

    const frontBangs = [
      { pos: [0.0, 0.02, 0.34], rot: [0.35, 0, 0.02], scale: [0.18, 0.72, 0.18] },
      { pos: [-0.22, 0.06, 0.28], rot: [0.3, 0.2, 0.45], scale: [0.17, 0.65, 0.17] },
      { pos: [0.22, 0.06, 0.28], rot: [0.3, -0.2, -0.45], scale: [0.17, 0.65, 0.17] }
    ];
    for (const fb of frontBangs) {
      const bang = new THREE.Mesh(new THREE.ConeGeometry(fb.scale[0], fb.scale[1], 5), hairMat);
      bang.position.set(fb.pos[0], fb.pos[1], fb.pos[2]);
      bang.rotation.set(fb.rot[0], fb.rot[1], fb.rot[2]);
      headGroup.add(bang);
      meshes.push(bang);
    }

    group.add(headGroup);

    // 9. SUPER SAIYAN AURA FLAMES & CYAN BIO-ELECTRICITY SPARKS
    const auraFlames = [
      { x: -1.4, y: 1.8, z: 0.2, scale: [0.45, 2.2, 0.45], rot: [0, 0, -0.15] },
      { x: 1.4, y: 1.8, z: -0.2, scale: [0.45, 2.2, 0.45], rot: [0, 0, 0.15] },
      { x: -0.8, y: 2.2, z: -0.8, scale: [0.38, 2.0, 0.38], rot: [0.1, 0, -0.1] },
      { x: 0.8, y: 2.2, z: 0.8, scale: [0.38, 2.0, 0.38], rot: [-0.1, 0, 0.1] }
    ];
    for (const af of auraFlames) {
      const flame = new THREE.Mesh(new THREE.ConeGeometry(af.scale[0], af.scale[1], 5), kiAuraMat);
      flame.position.set(af.x, af.y, af.z);
      flame.rotation.set(af.rot[0], af.rot[1], af.rot[2]);
      group.add(flame);
      meshes.push(flame);
    }

    const lightningArcs = [
      { pos: [0.85, 2.6, -0.3], rot: [0.5, 0.2, 0.8], rad: 0.28 },
      { pos: [-0.75, 2.8, 0.2], rot: [-0.4, 0.6, -0.5], rad: 0.32 },
      { pos: [0.0, 3.8, -0.2], rot: [0.2, 0.8, 0.1], rad: 0.35 }
    ];
    for (const la of lightningArcs) {
      const arcGeo = new THREE.TorusGeometry(la.rad, 0.025, 4, 8, Math.PI * 1.2);
      const arc = new THREE.Mesh(arcGeo, kiSparksMat);
      arc.position.set(la.pos[0], la.pos[1], la.pos[2]);
      arc.rotation.set(la.rot[0], la.rot[1], la.rot[2]);
      group.add(arc);
      meshes.push(arc);
    }

    return { group, meshes };
  }

static createContinuousKamehamehaMesh(
    customPoints?: Array<{ x: number; y: number; z: number }>,
    radius: number = 1.8,
    quality: "low" | "medium" | "high" = "medium"
  ): {
    group: THREE.Group;
    platformMesh: THREE.Mesh;
    tubeGeometry: THREE.TubeGeometry;
    meshes: THREE.Mesh[];
  } {
    const group = new THREE.Group();
    group.name = "kamehameha_continuous_tube_group";
    const meshes: THREE.Mesh[] = [];

    // The 14 exact waypoints of the winding S-curve Kamehameha path
    const rawPoints = customPoints && customPoints.length >= 2 ? customPoints : [
      { x: 0.0, y: 3.5, z: 20.0 },
      { x: -1.75, y: 3.2, z: 12.5 },
      { x: -5.5, y: 2.9, z: 3.5 },
      { x: -2.0, y: 2.6, z: -5.5 },
      { x: 2.25, y: 2.4, z: -14.5 },
      { x: 6.2, y: 2.2, z: -23.5 },
      { x: 2.5, y: 2.0, z: -32.5 },
      { x: -2.25, y: 1.8, z: -41.5 },
      { x: -5.8, y: 1.6, z: -50.5 },
      { x: -1.2, y: 1.4, z: -59.5 },
      { x: 3.5, y: 1.2, z: -68.5 },
      { x: 2.2, y: 1.0, z: -77.5 },
      { x: 0.0, y: 0.8, z: -86.0 },
      { x: 0.0, y: 0.6, z: -94.0 }
    ];

    // Offset curve points so that the top crest of the circular tube touches (p.y + 0.4)
    const curvePoints = rawPoints.map(p => new THREE.Vector3(p.x, p.y + 0.4 - radius, p.z));
    const curve = new THREE.CatmullRomCurve3(curvePoints, false, "centripetal", 0.15);

    const tubularSegments = quality === "high" ? 140 : quality === "medium" ? 100 : 70;
    const radialSegments = quality === "high" ? 28 : quality === "medium" ? 20 : 16;

    // 1. Radiant Outer Cyan Plasma Tube Geometry
    const tubeGeometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);

    const outerMat = quality === "low"
      ? new THREE.MeshLambertMaterial({
          color: 0x00e5ff,
          emissive: 0x00b0ff,
          transparent: true,
          opacity: 0.88
        })
      : new THREE.MeshStandardMaterial({
          color: 0x00e5ff,
          emissive: 0x00e5ff,
          emissiveIntensity: 0.90,
          roughness: 0.15,
          metalness: 0.05,
          transparent: true,
          opacity: 0.88
        });

    const outerMesh = new THREE.Mesh(tubeGeometry, outerMat);
    group.add(outerMesh);
    meshes.push(outerMesh);

    // 2. Blinding Inner White Core Tube
    const coreSegments = quality === "high" ? 20 : 14;
    const coreGeo = new THREE.TubeGeometry(curve, tubularSegments, radius * 0.52, coreSegments, false);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);
    meshes.push(coreMesh);

    // 3. Concentric Shockwave Energy Rings along the continuous 3D curve
    const ringCount = quality === "high" ? 26 : quality === "medium" ? 20 : 14;
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x80d8ff,
      transparent: true,
      opacity: 0.8
    });
    for (let r = 1; r < ringCount; r++) {
      const t = r / ringCount;
      const pt = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();

      const ringGeo = new THREE.TorusGeometry(radius * 1.08, 0.08, 8, quality === "high" ? 20 : 16);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pt);

      const quat = new THREE.Quaternion();
      quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      ringMesh.quaternion.copy(quat);

      group.add(ringMesh);
      meshes.push(ringMesh);
    }

    // 4. Spiraling Ki Particle Tendrils along the 3D tube
    if (quality !== "low") {
      const spiralMat = new THREE.MeshBasicMaterial({
        color: 0x00b0ff,
        transparent: true,
        opacity: 0.7
      });
      const spiralTurns = 18;
      const spiralSteps = quality === "high" ? 180 : 120;
      for (let s = 0; s < spiralSteps; s++) {
        const t = s / spiralSteps;
        const pt = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t).normalize();

        const up = new THREE.Vector3(0, 1, 0);
        let normal = new THREE.Vector3().crossVectors(tangent, up).normalize();
        if (normal.lengthSq() < 0.01) normal.set(1, 0, 0);
        const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

        const angle = t * Math.PI * 2 * spiralTurns;
        const offset = new THREE.Vector3()
          .addScaledVector(normal, Math.cos(angle) * (radius * 1.06))
          .addScaledVector(binormal, Math.sin(angle) * (radius * 1.06));

        const pGeo = new THREE.SphereGeometry(0.14, 6, 6);
        const pMesh = new THREE.Mesh(pGeo, spiralMat);
        pMesh.position.copy(pt).add(offset);
        group.add(pMesh);
        meshes.push(pMesh);
      }
    }

    // PlatformMesh for raycasting and selection
    const platformMesh = outerMesh;

    return { group, platformMesh, tubeGeometry, meshes };
  }

static createKamehamehaBeamMesh(
    width: number = 4.0,
    height: number = 0.8,
    length: number = 10.0,
    quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; platformMesh: THREE.Mesh; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "kamehameha_beam_group";
    const meshes: THREE.Mesh[] = [];

    const radius = width / 2;
    const centerY = (height / 2) - radius; // Top crest exactly at y = height / 2

    // 1. Radiant Outer Energy Shell (Glowing cyan plasma tube)
    const shellSegments = quality === "high" ? 36 : quality === "medium" ? 28 : 20;
    const shellGeo = new THREE.CylinderGeometry(radius, radius, length + 0.15, shellSegments, 1, false);
    shellGeo.rotateX(Math.PI / 2);

    const shellMat = quality === "low"
      ? new THREE.MeshLambertMaterial({
          color: 0x00e5ff,
          emissive: 0x00b0ff,
          emissiveIntensity: 0.75,
          transparent: true,
          opacity: 0.85
        })
      : new THREE.MeshStandardMaterial({
          color: 0x00e5ff,
          emissive: 0x00e5ff,
          emissiveIntensity: 0.88,
          roughness: 0.15,
          metalness: 0.05,
          transparent: true,
          opacity: 0.88
        });

    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    shellMesh.position.set(0, centerY, 0);
    group.add(shellMesh);
    meshes.push(shellMesh);

    // 2. Blinding Inner White Core Cylinder (The dense ki blast core)
    const coreRadius = radius * 0.52;
    const coreGeo = new THREE.CylinderGeometry(coreRadius, coreRadius, length + 0.25, shellSegments, 1, false);
    coreGeo.rotateX(Math.PI / 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, centerY, 0);
    group.add(coreMesh);
    meshes.push(coreMesh);

    // 3. Electric Ki Sheath / Concentric Shockwave Rings along the beam
    const ringCount = quality === "high" ? 4 : 3;
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x80d8ff,
      transparent: true,
      opacity: 0.75
    });
    const zStep = length / (ringCount + 1);
    for (let i = 1; i <= ringCount; i++) {
      const ringZ = -length / 2 + i * zStep;
      const ringGeo = new THREE.TorusGeometry(radius * 1.06, 0.065, 8, quality === "high" ? 24 : 16);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(0, centerY, ringZ);
      group.add(ringMesh);
      meshes.push(ringMesh);
    }

    // 4. Spiral Energy Tendril (Ki spiral wound around the tubular beam)
    if (quality !== "low") {
      const spiralMat = new THREE.MeshBasicMaterial({
        color: 0x00b0ff,
        transparent: true,
        opacity: 0.65
      });
      const turns = 2.5;
      const steps = quality === "high" ? 28 : 20;
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        const angle = t * Math.PI * 2 * turns;
        const sz = -length / 2 + t * length;
        const sx = Math.cos(angle) * (radius * 1.04);
        const sy = centerY + Math.sin(angle) * (radius * 1.04);

        const particleGeo = new THREE.SphereGeometry(0.12, 6, 6);
        const particleMesh = new THREE.Mesh(particleGeo, spiralMat);
        particleMesh.position.set(sx, sy, sz);
        group.add(particleMesh);
        meshes.push(particleMesh);
      }
    }

    // 5. Subtle deck at crest for level editor selection & collision tracking
    const deckGeo = new THREE.BoxGeometry(width * 0.9, 0.05, length);
    const deckMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });
    const platformMesh = new THREE.Mesh(deckGeo, deckMat);
    platformMesh.position.set(0, height / 2 - 0.025, 0);
    group.add(platformMesh);
    meshes.push(platformMesh);

    return { group, platformMesh, meshes };
  }

static createKamehamehaBurstMesh(
    width: number = 9.0,
    depth: number = 9.0,
    quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; platformMesh: THREE.Mesh; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "kamehameha_burst_group";
    const meshes: THREE.Mesh[] = [];

    const radius = Math.max(width, depth) / 2;
    const height = 0.8;
    const centerY = (height / 2) - radius;

    // 1. Massive Detonation Blast Sphere
    const segs = quality === "high" ? 36 : 28;
    const blastGeo = new THREE.SphereGeometry(radius, segs, segs);
    const blastMat = quality === "low"
      ? new THREE.MeshLambertMaterial({ color: 0x00e5ff, emissive: 0x00b0ff, emissiveIntensity: 0.85, transparent: true, opacity: 0.88 })
      : new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 0.95, roughness: 0.1, transparent: true, opacity: 0.9 });
    const blastMesh = new THREE.Mesh(blastGeo, blastMat);
    blastMesh.position.set(0, centerY, 0);
    group.add(blastMesh);
    meshes.push(blastMesh);

    // 2. Huge Blinding Supernova Core
    const coreGeo = new THREE.SphereGeometry(radius * 0.62, segs, segs);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, centerY, 0);
    group.add(coreMesh);
    meshes.push(coreMesh);

    // 3. Dual Shockwave Detonation Rings
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x80d8ff, transparent: true, opacity: 0.85 });
    const rGeo1 = new THREE.TorusGeometry(radius * 1.12, 0.14, 8, segs);
    rGeo1.rotateX(Math.PI / 2);
    const r1 = new THREE.Mesh(rGeo1, ringMat1);
    r1.position.set(0, centerY, 0);

    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.65 });
    const rGeo2 = new THREE.TorusGeometry(radius * 1.32, 0.09, 8, segs);
    rGeo2.rotateX(Math.PI / 2);
    const r2 = new THREE.Mesh(rGeo2, ringMat2);
    r2.position.set(0, centerY, 0);

    group.add(r1, r2);
    meshes.push(r1, r2);

    // 4. Platform disc for Goal placement
    const deckGeo = new THREE.CylinderGeometry(radius * 0.95, radius * 0.95, 0.05, segs);
    const deckMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.0, depthWrite: false });
    const platformMesh = new THREE.Mesh(deckGeo, deckMat);
    platformMesh.position.set(0, height / 2 - 0.025, 0);
    group.add(platformMesh);
    meshes.push(platformMesh);

    return { group, platformMesh, meshes };
  }

static createKamehamehaChargeMesh(
    diameter: number = 5.5,
    quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; platformMesh: THREE.Mesh; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "kamehameha_charge_group";
    const meshes: THREE.Mesh[] = [];

    const radius = diameter / 2;
    const height = 0.8;
    const centerY = (height / 2) - radius;

    // 1. Outer Cyan Ki Sphere
    const segs = quality === "high" ? 32 : 24;
    const sphereGeo = new THREE.SphereGeometry(radius, segs, segs);
    const shellMat = quality === "low"
      ? new THREE.MeshLambertMaterial({ color: 0x00e5ff, emissive: 0x00b0ff, emissiveIntensity: 0.75, transparent: true, opacity: 0.85 })
      : new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 0.9, roughness: 0.15, transparent: true, opacity: 0.88 });

    const sphereMesh = new THREE.Mesh(sphereGeo, shellMat);
    sphereMesh.position.set(0, centerY, 0);
    group.add(sphereMesh);
    meshes.push(sphereMesh);

    // 2. Inner Blinding White Core Sphere
    const coreGeo = new THREE.SphereGeometry(radius * 0.58, segs, segs);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, centerY, 0);
    group.add(coreMesh);
    meshes.push(coreMesh);

    // 3. Concentric Equatorial Ki Shockwave Ring
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x80d8ff, transparent: true, opacity: 0.8 });
    const eqRingGeo = new THREE.TorusGeometry(radius * 1.05, 0.08, 8, segs);
    eqRingGeo.rotateX(Math.PI / 2);
    const eqRing = new THREE.Mesh(eqRingGeo, ringMat);
    eqRing.position.set(0, centerY, 0);
    group.add(eqRing);
    meshes.push(eqRing);

    // 4. Subtle platform disc on top crest
    const deckGeo = new THREE.CylinderGeometry(radius * 0.95, radius * 0.95, 0.05, segs);
    const deckMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.0, depthWrite: false });
    const platformMesh = new THREE.Mesh(deckGeo, deckMat);
    platformMesh.position.set(0, height / 2 - 0.025, 0);
    group.add(platformMesh);
    meshes.push(platformMesh);

    return { group, platformMesh, meshes };
  }

static createChalkboardMesh(
    width = 11.0,
    height = 0.8,
    length = 42.0,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; boardMesh: THREE.Mesh; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "chalkboard_platform_group";
    const meshes: THREE.Mesh[] = [];

    const frameWoodMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.75, metalness: 0.1 });
    const chalkTex = LevelBuilder.getChalkboardTexture();
    const boardMat = new THREE.MeshStandardMaterial({
      map: chalkTex,
      color: 0x1e392a,
      roughness: 0.85,
      metalness: 0.05
    });
    const chalkWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
    const chalkYellowMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b, roughness: 0.9 });
    const eraserFeltMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.95 });

    // Main chalkboard surface
    const boardGeo = new THREE.BoxGeometry(width - 0.4, height, length - 0.4);
    const boardMesh = new THREE.Mesh(boardGeo, boardMat);
    group.add(boardMesh);
    meshes.push(boardMesh);

    // Beveled frame border along left and right
    const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.35, height + 0.1, length), frameWoodMat);
    frameL.position.set(-width / 2 + 0.17, 0.05, 0);
    const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.35, height + 0.1, length), frameWoodMat);
    frameR.position.set(width / 2 - 0.17, 0.05, 0);
    group.add(frameL, frameR);
    meshes.push(frameL, frameR);

    // End frames
    const frameStart = new THREE.Mesh(new THREE.BoxGeometry(width, height + 0.1, 0.35), frameWoodMat);
    frameStart.position.set(0, 0.05, length / 2 - 0.17);
    const frameEnd = new THREE.Mesh(new THREE.BoxGeometry(width, height + 0.1, 0.35), frameWoodMat);
    frameEnd.position.set(0, 0.05, -length / 2 + 0.17);
    group.add(frameStart, frameEnd);
    meshes.push(frameStart, frameEnd);

    // Chalk tray with chalk sticks and eraser at southern start
    const trayGeo = new THREE.BoxGeometry(6.0, 0.12, 0.45);
    const tray = new THREE.Mesh(trayGeo, frameWoodMat);
    tray.position.set(0, height / 2 + 0.06, length / 2 - 0.6);
    group.add(tray);
    meshes.push(tray);

    const eraser = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.18, 0.3), eraserFeltMat);
    eraser.position.set(-1.8, height / 2 + 0.15, length / 2 - 0.6);
    group.add(eraser);
    meshes.push(eraser);

    for (let c = 0; c < 5; c++) {
      const chalk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 6), c % 2 === 0 ? chalkWhiteMat : chalkYellowMat);
      chalk.rotation.z = Math.PI / 2;
      chalk.position.set(0.4 + c * 0.25, height / 2 + 0.12, length / 2 - 0.6);
      group.add(chalk);
      meshes.push(chalk);
    }

    return { group, boardMesh, meshes };
  }

static createClappingGlovesMesh(
    side: "left" | "right" = "left",
    quality: "low" | "medium" | "high" = "medium",
    customColor: string = "#2e7d32"
  ): { group: THREE.Group; meshes: THREE.Mesh[]; palmMesh: THREE.Mesh } {
    const group = new THREE.Group();
    group.name = `clapping_glove_${side}`;
    const meshes: THREE.Mesh[] = [];

    const isRight = side === "right";
    const facingSign = isRight ? -1 : 1;
    const seg = quality === "low" ? 8 : quality === "medium" ? 14 : 20;

    const gloveMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(customColor),
      roughness: 0.35,
      metalness: 0.1
    });
    const cuffTrimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const palmPadMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.5 });

    // Main Palm Block
    const palmGeo = new THREE.BoxGeometry(0.65, 2.2, 2.0);
    const palmMesh = new THREE.Mesh(palmGeo, gloveMat);
    palmMesh.position.set(0, 0, 0);
    group.add(palmMesh);
    meshes.push(palmMesh);

    // Inner Palm Striking Pad (cushioned striking surface)
    const padGeo = new THREE.BoxGeometry(0.12, 1.8, 1.6);
    const padMesh = new THREE.Mesh(padGeo, palmPadMat);
    padMesh.position.set(facingSign * 0.34, 0, 0);
    group.add(padMesh);
    meshes.push(padMesh);

    // 4 Finger Segments extending upward
    const fingerSpacing = 0.42;
    for (let f = 0; f < 4; f++) {
      const zOffset = -0.63 + f * fingerSpacing;
      const fingerLen = 1.05 + (f === 1 || f === 2 ? 0.2 : 0.0);
      const fingerGeo = new THREE.CylinderGeometry(0.16, 0.18, fingerLen, seg);
      const fingerMesh = new THREE.Mesh(fingerGeo, gloveMat);
      fingerMesh.position.set(0, 1.1 + fingerLen / 2, zOffset);
      group.add(fingerMesh);
      meshes.push(fingerMesh);

      // Fingertip cap
      const tipGeo = new THREE.SphereGeometry(0.16, seg, 8);
      const tipMesh = new THREE.Mesh(tipGeo, gloveMat);
      tipMesh.position.set(0, 1.1 + fingerLen, zOffset);
      group.add(tipMesh);
      meshes.push(tipMesh);
    }

    // Angled Thumb
    const thumbLen = 0.95;
    const thumbGeo = new THREE.CylinderGeometry(0.18, 0.20, thumbLen, seg);
    thumbGeo.rotateZ(facingSign * 0.45);
    thumbGeo.rotateX(0.35);
    const thumbMesh = new THREE.Mesh(thumbGeo, gloveMat);
    thumbMesh.position.set(facingSign * 0.42, 0.35, 0.95);
    group.add(thumbMesh);
    meshes.push(thumbMesh);

    // Wrist cuff
    const cuffGeo = new THREE.CylinderGeometry(0.65, 0.72, 0.65, seg);
    const cuffMesh = new THREE.Mesh(cuffGeo, cuffTrimMat);
    cuffMesh.position.set(0, -1.35, 0);
    group.add(cuffMesh);
    meshes.push(cuffMesh);

    return { group, meshes, palmMesh };
  }

static createMadridDuo132BMesh(
    quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "madrid_duo_132b_group";
    const meshes: THREE.Mesh[] = [];

    const seg = quality === "low" ? 8 : quality === "medium" ? 14 : 20;

    // Materials
    const manSkinMat = new THREE.MeshStandardMaterial({ color: 0xdfb091, roughness: 0.7 });
    const manDarkHairMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.85 });
    const realMadridJerseyMat = new THREE.MeshStandardMaterial({
      map: LevelBuilder.getRealMadridJerseyTexture(),
      roughness: 0.5
    });
    const manNavyShortsMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 });
    const whiteShoeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });

    const womanSkinMat = new THREE.MeshStandardMaterial({ color: 0xedd0bc, roughness: 0.65 });
    const blondeHairMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.75 }); // rubio rizado
    const vintageTigerDressMat = new THREE.MeshStandardMaterial({
      map: LevelBuilder.getVintageTigerDressTexture(),
      roughness: 0.5
    });
    const goldJewelryMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.25 });
    const sandalMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });

        
    // 1. MAN (Real Madrid fan, taller, 1.85m)
    const manGroup = new THREE.Group();
    manGroup.name = "man_real_madrid";
    manGroup.position.set(-0.46, 0, 0);

    const manHead = new THREE.Mesh(new THREE.SphereGeometry(0.19, seg, seg), manSkinMat);
    manHead.position.set(0, 1.62, 0);
    manHead.scale.set(0.92, 1.05, 0.95);
    manGroup.add(manHead);
    meshes.push(manHead);

    const manHair = new THREE.Mesh(new THREE.SphereGeometry(0.20, seg, seg), manDarkHairMat);
    manHair.position.set(0, 1.66, -0.02);
    manHair.scale.set(0.96, 0.98, 0.98);
    manGroup.add(manHair);
    meshes.push(manHair);

    // Torso with Real Madrid Jersey
    const manTorso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.55, 0.26), realMadridJerseyMat);
    manTorso.position.set(0, 1.18, 0);
    manGroup.add(manTorso);
    meshes.push(manTorso);

    // Navy Shorts
    const manShorts = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.32, 0.24), manNavyShortsMat);
    manShorts.position.set(0, 0.82, 0);
    manGroup.add(manShorts);
    meshes.push(manShorts);

    // Legs & Shoes
    for (const lx of [-0.12, 0.12]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.65, seg), manSkinMat);
      leg.position.set(lx, 0.38, 0);
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.24), whiteShoeMat);
      shoe.position.set(lx, 0.05, 0.04);
      manGroup.add(leg, shoe);
      meshes.push(leg, shoe);
    }

    // Arms
    for (const ax of [-0.28, 0.28]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.62, seg), manSkinMat);
      arm.position.set(ax, 1.1, 0);
      manGroup.add(arm);
      meshes.push(arm);
    }
    group.add(manGroup);

    // 2. WOMAN (Slender, blonde curly hair, vintage tiger print dress)
    const womanGroup = new THREE.Group();
    womanGroup.name = "woman_vintage_tiger";
    womanGroup.position.set(0.46, 0, 0);

    const womanHead = new THREE.Mesh(new THREE.SphereGeometry(0.175, seg, seg), womanSkinMat);
    womanHead.position.set(0, 1.54, 0);
    womanHead.scale.set(0.9, 1.02, 0.92);
    womanGroup.add(womanHead);
    meshes.push(womanHead);

    // Voluminous curly blonde hair
    for (let c = 0; c < 14; c++) {
      const curlGeo = new THREE.SphereGeometry(0.08, 6, 6);
      const curl = new THREE.Mesh(curlGeo, blondeHairMat);
      const a = (c / 14) * Math.PI * 1.6 - Math.PI * 0.8;
      curl.position.set(Math.sin(a) * 0.18, 1.56 + Math.cos(c * 0.9) * 0.08, -0.05 + Math.cos(a) * 0.14);
      womanGroup.add(curl);
      meshes.push(curl);
    }

    // Gold earrings
    for (const ex of [-0.18, 0.18]) {
      const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 6, 12), goldJewelryMat);
      hoop.position.set(ex, 1.52, 0);
      womanGroup.add(hoop);
      meshes.push(hoop);
    }

    // Vintage Tiger Print Dress (slender fitted bodice & flared skirt)
    const dressBodice = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.46, 0.22), vintageTigerDressMat);
    dressBodice.position.set(0, 1.15, 0);
    const dressSkirt = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.58, seg), vintageTigerDressMat);
    dressSkirt.position.set(0, 0.72, 0);
    womanGroup.add(dressBodice, dressSkirt);
    meshes.push(dressBodice, dressSkirt);

    // Slender legs & chic sandals
    for (const lx of [-0.09, 0.09]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.042, 0.62, seg), womanSkinMat);
      leg.position.set(lx, 0.35, 0);
      const sandal = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.05, 0.20), sandalMat);
      sandal.position.set(lx, 0.03, 0.03);
      womanGroup.add(leg, sandal);
      meshes.push(leg, sandal);
    }

    // Slender arms with gold bangle
    for (const ax of [-0.22, 0.22]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.038, 0.58, seg), womanSkinMat);
      arm.position.set(ax, 1.08, 0);
      womanGroup.add(arm);
      meshes.push(arm);
    }
    const bangle = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.01, 6, 12), goldJewelryMat);
    bangle.position.set(0.22, 0.88, 0);
    womanGroup.add(bangle);
    meshes.push(bangle);

    group.add(womanGroup);
    return { group, meshes };
  }

static createElevator2FMesh(
    width = 4.2,
    height = 0.45,
    length = 4.2,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; floorMesh: THREE.Mesh; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "residential_elevator_2f_group";
    const meshes: THREE.Mesh[] = [];

    const floorMat = new THREE.MeshStandardMaterial({ color: 0x455a64, roughness: 0.6, metalness: 0.2 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xb0bec5, roughness: 0.2, metalness: 0.85 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x80deea, transparent: true, opacity: 0.35, depthWrite: false });
    const buttonOnMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b, emissive: 0xffeb3b, emissiveIntensity: 1.5 });
        const ceilLightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff9c4, emissiveIntensity: 1.2 });

    // Platform floor
    const floorGeo = new THREE.BoxGeometry(width, height, length);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    group.add(floorMesh);
    meshes.push(floorMesh);

    // Glass side walls & chrome railings (Left, Right, Back)
    const wallH = 2.4;
    const halfW = width / 2;
    const halfL = length / 2;

    const glassL = new THREE.Mesh(new THREE.BoxGeometry(0.08, wallH, length - 0.2), glassMat);
    glassL.position.set(-halfW + 0.05, wallH / 2 + height / 2, 0);
    const glassR = new THREE.Mesh(new THREE.BoxGeometry(0.08, wallH, length - 0.2), glassMat);
    glassR.position.set(halfW - 0.05, wallH / 2 + height / 2, 0);
    const glassB = new THREE.Mesh(new THREE.BoxGeometry(width - 0.2, wallH, 0.08), glassMat);
    glassB.position.set(0, wallH / 2 + height / 2, halfL - 0.05);
    group.add(glassL, glassR, glassB);
    meshes.push(glassL, glassR, glassB);

    // Handrails
    const railL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, length - 0.4, 8), chromeMat);
    railL.rotateX(Math.PI / 2);
    railL.position.set(-halfW + 0.16, 1.05 + height / 2, 0);
    const railR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, length - 0.4, 8), chromeMat);
    railR.rotateX(Math.PI / 2);
    railR.position.set(halfW - 0.16, 1.05 + height / 2, 0);
    group.add(railL, railR);
    meshes.push(railL, railR);

    // Modern Elevator Control Column with Floor buttons "1" and "2"
    const panelGeo = new THREE.BoxGeometry(0.08, 1.2, 0.45);
    const panel = new THREE.Mesh(panelGeo, chromeMat);
    panel.position.set(halfW - 0.12, 1.35 + height / 2, -0.6);
    group.add(panel);
    meshes.push(panel);

    const btn1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 12), buttonOnMat);
    btn1.rotateZ(Math.PI / 2);
    btn1.position.set(halfW - 0.17, 1.45 + height / 2, -0.6);
    const btn2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 12), buttonOnMat);
    btn2.rotateZ(Math.PI / 2);
    btn2.position.set(halfW - 0.17, 1.6 + height / 2, -0.6);
    group.add(btn1, btn2);
    meshes.push(btn1, btn2);

    // Ceiling Light Panel
    const ceilLight = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 1.6), ceilLightMat);
    ceilLight.position.set(0, wallH + height / 2, 0);
    group.add(ceilLight);
    meshes.push(ceilLight);

    return { group, floorMesh, meshes };
  }

static createContinuousTongueMesh(
    customPoints?: Array<{ x: number; y: number; z: number }>,
    width: number = 4.2,
    quality: "low" | "medium" | "high" = "medium"
  ): {
    group: THREE.Group;
    platformMesh: THREE.Mesh;
    ribbonGeometry: THREE.BufferGeometry;
    meshes: THREE.Mesh[];
  } {
    const group = new THREE.Group();
    group.name = "continuous_tongue_group";
    const meshes: THREE.Mesh[] = [];

    // Puntos de la trayectoria serpenteada desde la punta (spawn) hasta el interior de la boca de Rony
    const rawPoints = customPoints && customPoints.length >= 2 ? customPoints : [
      { x: 0.0, y: 0.45, z: 34.0 },  // Punta redondeada frontal (spawn)
      { x: 0.6, y: 0.48, z: 30.0 },
      { x: 1.6, y: 0.52, z: 25.0 },
      { x: 2.4, y: 0.55, z: 20.0 },  // Primer meandro a la derecha
      { x: 1.8, y: 0.58, z: 15.0 },
      { x: 0.2, y: 0.62, z: 10.0 },
      { x: -1.4, y: 0.66, z: 5.0 },  // Segundo meandro a la izquierda
      { x: -1.8, y: 0.70, z: 1.0 },
      { x: -0.8, y: 0.74, z: -2.0 },
      { x: 0.0, y: 0.78, z: -5.0 }   // Entrada fluida dentro de la boca de Rony
    ];

    const curvePoints = rawPoints.map(p => new THREE.Vector3(p.x, p.y, p.z));
    const curve = new THREE.CatmullRomCurve3(curvePoints, false, "centripetal", 0.15);

    const slices = quality === "high" ? 110 : quality === "medium" ? 75 : 45;
    const segmentsU = quality === "high" ? 16 : quality === "medium" ? 12 : 8;

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const tongueTex = LevelBuilder.getDogTongueTexture();
    const tongueMat = new THREE.MeshStandardMaterial({
      map: tongueTex,
      roughness: 0.35,
      metalness: 0.05
    });

    const undersideMat = new THREE.MeshStandardMaterial({
      color: 0xf06292,
      roughness: 0.55,
      metalness: 0.05
    });

    // Generar malla 3D de la lengua continua: superficie superior con labios laterales curvados
    for (let s = 0; s <= slices; s++) {
      const t = s / slices;
      const pt = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const worldUp = new THREE.Vector3(0, 1, 0);
      const binormal = new THREE.Vector3().crossVectors(tangent, worldUp).normalize();
      const localUp = new THREE.Vector3().crossVectors(binormal, tangent).normalize();

      // En la punta frontal de la lengua se afina suavemente formando contorno redondeado canino
      let currentWidth = width;
      if (t < 0.08) {
        currentWidth = width * Math.sin((t / 0.08) * Math.PI * 0.5);
      }

      for (let j = 0; j <= segmentsU; j++) {
        const u = (j / segmentsU) * 2 - 1; // [-1, 1]
        const lateral = u * (currentWidth / 2);
        // Perfil anatómico de lengua: labios laterales elevados (+0.38m) y surco medio sutil (-0.05m)
        const profileY = Math.pow(Math.abs(u), 2.2) * 0.38 - (1.0 - Math.abs(u)) * 0.05;

        const vx = pt.x + binormal.x * lateral + localUp.x * profileY;
        const vy = pt.y + binormal.y * lateral + localUp.y * profileY;
        const vz = pt.z + binormal.z * lateral + localUp.z * profileY;

        positions.push(vx, vy, vz);
        normals.push(localUp.x, localUp.y, localUp.z);
        uvs.push((u + 1) * 0.5, t * 8.0);
      }
    }

    const stride = segmentsU + 1;
    for (let s = 0; s < slices; s++) {
      for (let j = 0; j < segmentsU; j++) {
        const a = s * stride + j;
        const b = (s + 1) * stride + j;
        const c = (s + 1) * stride + (j + 1);
        const d = s * stride + (j + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    const ribbonGeometry = new THREE.BufferGeometry();
    ribbonGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    ribbonGeometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    ribbonGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    ribbonGeometry.setIndex(indices);
    ribbonGeometry.computeVertexNormals();

    const platformMesh = new THREE.Mesh(ribbonGeometry, tongueMat);
    platformMesh.name = "continuous_tongue_platform";
    group.add(platformMesh);
    meshes.push(platformMesh);

    // Malla inferior para otorgar espesor carnoso 3D a la lengua
    const underPositions: number[] = [];
    const underIndices: number[] = [];
    for (let s = 0; s <= slices; s++) {
      const t = s / slices;
      const pt = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const worldUp = new THREE.Vector3(0, 1, 0);
      const binormal = new THREE.Vector3().crossVectors(tangent, worldUp).normalize();
      const localUp = new THREE.Vector3().crossVectors(binormal, tangent).normalize();

      let currentWidth = width;
      if (t < 0.08) currentWidth = width * Math.sin((t / 0.08) * Math.PI * 0.5);

      for (let j = 0; j <= segmentsU; j++) {
        const u = (j / segmentsU) * 2 - 1;
        const lateral = u * (currentWidth / 2);
        const profileY = Math.pow(Math.abs(u), 2.2) * 0.38 - (1.0 - Math.abs(u)) * 0.05 - 0.35;

        underPositions.push(
          pt.x + binormal.x * lateral + localUp.x * profileY,
          pt.y + binormal.y * lateral + localUp.y * profileY,
          pt.z + binormal.z * lateral + localUp.z * profileY
        );
      }
    }

    for (let s = 0; s < slices; s++) {
      for (let j = 0; j < segmentsU; j++) {
        const a = s * stride + j;
        const b = (s + 1) * stride + j;
        const c = (s + 1) * stride + (j + 1);
        const d = s * stride + (j + 1);
        underIndices.push(a, d, b);
        underIndices.push(b, d, c);
      }
    }

    const underGeo = new THREE.BufferGeometry();
    underGeo.setAttribute("position", new THREE.Float32BufferAttribute(underPositions, 3));
    underGeo.setIndex(underIndices);
    underGeo.computeVertexNormals();
    const underMesh = new THREE.Mesh(underGeo, undersideMat);
    group.add(underMesh);
    meshes.push(underMesh);

    return { group, platformMesh, ribbonGeometry, meshes };
  }

static createYorkshireRonyMesh(
    quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; mouthPortal: THREE.Mesh; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "yorkshire_rony_statue_group";
    const meshes: THREE.Mesh[] = [];

    const seg = quality === "low" ? 16 : quality === "medium" ? 24 : 32;

    // Materiales auténticos del personaje Rony el Yorkshire Terrier
    const tanFurMat = new THREE.MeshStandardMaterial({ color: 0xedb868, roughness: 0.65, metalness: 0.05 });
    const darkTanFurMat = new THREE.MeshStandardMaterial({ color: 0xd99b41, roughness: 0.68 });
    const blondeFurMat = new THREE.MeshStandardMaterial({ color: 0xfff0bd, roughness: 0.70 });
    const blueSteelFurMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.75, metalness: 0.12 });
    const chestnutEarMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.75 });
    const pinkEarMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.55 });
    const creamTuftMat = new THREE.MeshStandardMaterial({ color: 0xfff7ed, roughness: 0.80 });
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.15, metalness: 0.25 });
    const eyeIrisMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.20 });
    const eyeDarkMat = new THREE.MeshStandardMaterial({ color: 0x050810, roughness: 0.10, metalness: 0.10 });
    const eyeGlintMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.05, emissive: 0xffffff, emissiveIntensity: 0.9 });
    const redBowMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.35, metalness: 0.10 });
    const mouthCavityMat = new THREE.MeshStandardMaterial({ color: 0x3b0712, roughness: 0.80 });
    const toothMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });

    const headW = 7.6;
    const headD = 3.6;

    // =======================================================================
    // 1. ESTRUCTURA ARQUITECTÓNICA DEL ARCO PORTAL (CARRILOS Y DINTEL)
    // =======================================================================
    // One continuous portal avoids coplanar cheek/header faces at the upper corners.
    const outline = new THREE.Shape();
    outline.moveTo(-3.7, .5); outline.lineTo(-1.9, .5);
    outline.lineTo(-1.9, 4.4); outline.lineTo(1.9, 4.4);
    outline.lineTo(1.9, .5); outline.lineTo(3.7, .5);
    outline.lineTo(3.7, 6); outline.lineTo(-3.7, 6); outline.closePath();
    const portalGeo = new THREE.ExtrudeGeometry(outline, {
      depth: headD - .12, steps: 1, bevelEnabled: true,
      bevelThickness: .06, bevelSize: .06, bevelSegments: 2
    });
    portalGeo.translate(0, 0, -headD / 2 + .06);
    const portalFrame = new THREE.Mesh(portalGeo, tanFurMat);
    portalFrame.name = "rony-continuous-portal";
    group.add(portalFrame); meshes.push(portalFrame);

    // Almohadillas frontales redondeadas de los mofletes
    const cheekPadL = new THREE.Mesh(new THREE.SphereGeometry(1.0, seg, seg), tanFurMat);
    cheekPadL.scale.set(0.85, 1.2, 0.7);
    cheekPadL.position.set(-2.7, 2.8, 1.6);
    const cheekPadR = new THREE.Mesh(new THREE.SphereGeometry(1.0, seg, seg), tanFurMat);
    cheekPadR.scale.set(0.85, 1.2, 0.7);
    cheekPadR.position.set(2.7, 2.8, 1.6);
    group.add(cheekPadL, cheekPadR);
    meshes.push(cheekPadL, cheekPadR);

    // Manto occipital y cráneo superior (manto gris azulado / pizarra de Yorkie)
    const cranialCap = new THREE.Mesh(new RoundedBoxGeometry(headW + 0.1, 0.8, headD + 0.1, 2, .12), blueSteelFurMat);
    cranialCap.position.set(0, 6.4, 0.0);
    const napeDrape = new THREE.Mesh(new THREE.BoxGeometry(headW, 2.4, 0.2), blueSteelFurMat);
    napeDrape.position.set(0, 5.2, -1.8);
    group.add(cranialCap, napeDrape);
    meshes.push(cranialCap, napeDrape);

    // =======================================================================
    // 2. OREJAS ERGUIDAS PUNTIAGUDAS EN V (LIMPIAS, SIN Z-FIGHTING)
    // =======================================================================
    for (const earX of [-2.6, 2.6]) {
      const earSign = earX > 0 ? 1 : -1;

      // Cono exterior de la oreja: castaño oscuro
      const earOuter = new THREE.Mesh(new THREE.ConeGeometry(1.15, 2.4, 4), chestnutEarMat);
      earOuter.rotation.y = Math.PI / 4;
      earOuter.rotation.z = earSign * -0.25;
      earOuter.position.set(earX, 7.4, 0.0);

      // Terciopelo interior melocotón suave (colocado de forma frontal limpia sin superposición)
      const earInsetGeo = new THREE.BufferGeometry();
      // Follow the sloped front of the four-sided ear, with a real surface gap.
      const earFront = (y: number) => Math.SQRT1_2 * 1.15 * (1.2 - y) / 2.4 + .035;
      earInsetGeo.setAttribute("position", new THREE.Float32BufferAttribute([
        -.48, -.85, earFront(-.85), .48, -.85, earFront(-.85), 0, .65, earFront(.65)
      ], 3));
      earInsetGeo.computeVertexNormals();
      const earInner = new THREE.Mesh(earInsetGeo, pinkEarMat);
      earInner.rotation.z = earSign * -0.25;
      earInner.position.copy(earOuter.position);

      // Mechón interior de pelo crema suave en la base
      const earTuft = new THREE.Mesh(new THREE.SphereGeometry(0.35, seg, 12), creamTuftMat);
      earTuft.scale.set(0.8, 1.3, 0.8);
      earTuft.position.set(earX * 0.85, 6.6, 0.4);

      group.add(earOuter, earInner, earTuft);
      meshes.push(earOuter, earInner, earTuft);
    }

    // =======================================================================
    // 3. MOÑO DE PELO TOPKNOT CON LAZO ROJO DE YORKSHIRE
    // =======================================================================
    const topknot = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.2, 12), blondeFurMat);
    topknot.rotation.x = 0.2;
    topknot.position.set(0, 7.2, 0.5);
    group.add(topknot);
    meshes.push(topknot);

    // Lazo rojo coqueto de Rony
    const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.24, seg, 12), redBowMat);
    bowKnot.position.set(0, 6.8, 1.3);
    const bowLoopL = new THREE.Mesh(new THREE.SphereGeometry(0.30, seg, 12), redBowMat);
    bowLoopL.scale.set(1.4, 0.8, 0.6);
    bowLoopL.rotation.z = 0.35;
    bowLoopL.position.set(-0.40, 6.9, 1.25);
    const bowLoopR = new THREE.Mesh(new THREE.SphereGeometry(0.30, seg, 12), redBowMat);
    bowLoopR.scale.set(1.4, 0.8, 0.6);
    bowLoopR.rotation.z = -0.35;
    bowLoopR.position.set(0.40, 6.9, 1.25);
    group.add(bowKnot, bowLoopL, bowLoopR);
    meshes.push(bowKnot, bowLoopL, bowLoopR);

    // =======================================================================
    // 4. OJOS TIERNOS DE CACHORRO 3D (MIRADA VIVA Y BRILLANTE)
    // =======================================================================
    for (const ex of [-1.4, 1.4]) {
      // Iris avellana / ámbar cálido
      const eyeIris = new THREE.Mesh(new THREE.SphereGeometry(0.50, seg, 16), eyeIrisMat);
      eyeIris.scale.set(1.0, 1.05, 0.4);
      eyeIris.position.set(ex, 5.2, 1.85);

      // Pupila negra brillante
      const eyePupil = new THREE.Mesh(new THREE.SphereGeometry(0.44, seg, 16), eyeDarkMat);
      eyePupil.scale.set(1.0, 1.05, 0.3);
      eyePupil.position.set(ex, 5.2, 2.06);

      // Destello especular principal superior
      const glint1 = new THREE.Mesh(new THREE.SphereGeometry(0.10, 8, 8), eyeGlintMat);
      glint1.position.set(ex - 0.12, 5.38, 2.21);

      // Segundo destello tierno inferior
      const glint2 = new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 6), eyeGlintMat);
      glint2.position.set(ex + 0.10, 5.08, 2.21);

      // Cejas doradas suaves arqueadas
      const brow = new THREE.Mesh(new RoundedBoxGeometry(0.8, 0.18, 0.25, 2, .06), blondeFurMat);
      brow.rotation.z = (ex > 0 ? -1 : 1) * 0.15;
      brow.position.set(ex, 5.75, 1.85);

      group.add(eyeIris, eyePupil, glint1, glint2, brow);
      meshes.push(eyeIris, eyePupil, glint1, glint2, brow);
    }

    // =======================================================================
    // 5. HOCICO, TRUFA NEGRA DE BOTÓN Y BIGOTE SEDOSO PARTIDO DE YORKSHIRE
    // =======================================================================
    // Puente del hocico
    const snoutBridge = new THREE.Mesh(new RoundedBoxGeometry(2.2, 1.0, 1.2, 2, .15), darkTanFurMat);
    snoutBridge.position.set(0, 4.2, 2.1);
    group.add(snoutBridge);
    meshes.push(snoutBridge);

    // Trufa / Nariz negra de botón con brillo húmedo
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.40, 16, 12), noseMat);
    nose.scale.set(1.25, 0.85, 0.9);
    nose.position.set(0, 4.4, 2.7);
    const noseGlint = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), eyeGlintMat);
    noseGlint.position.set(-0.10, 4.55, 3.07);
    group.add(nose, noseGlint);
    meshes.push(nose, noseGlint);

    // Bigote sedoso partido a izquierda y derecha
    for (const sx of [-1.35, 1.35]) {
      const sSign = sx > 0 ? 1 : -1;
      const mustacheWing = new THREE.Mesh(new THREE.SphereGeometry(0.80, seg, seg), tanFurMat);
      mustacheWing.scale.set(0.9, 1.3, 0.7);
      mustacheWing.rotation.z = sSign * 0.20;
      mustacheWing.position.set(sx, 3.6, 2.1);

      const mustacheTip = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.1, 8), blondeFurMat);
      mustacheTip.rotation.z = sSign * 0.35;
      mustacheTip.position.set(sx * 1.15, 2.8, 2.1);

      group.add(mustacheWing, mustacheTip);
      meshes.push(mustacheWing, mustacheTip);
    }

    // =======================================================================
    // 6. BOCA HUECA COMPLETAMENTE TRANSITABLE Y TÚNEL DE GARGANTA
    // Despeje total: ancho 3.8m, alto 3.6m. Sin bordes ni colmillos en el suelo
    // Suelo rasante a Y = 0.80 para tránsito suave de la bola sin frenados
    // =======================================================================
    // Paladar superior abovedado
    const palateRoof = new THREE.Mesh(new THREE.BoxGeometry(3.78, 0.25, headD - .12), mouthCavityMat);
    palateRoof.position.set(0, 4.4, 0.0);

    // Dientes caninos superiores y colmillos
    for (let t = -4; t <= 4; t++) {
      const isFang = Math.abs(t) === 3;
      const toothLen = isFang ? 0.50 : 0.30;
      const toothRadius = isFang ? 0.14 : 0.08;
      const tooth = new THREE.Mesh(new THREE.ConeGeometry(toothRadius, toothLen, 6), toothMat);
      tooth.rotation.x = Math.PI;
      tooth.position.set(t * 0.38, 4.25, 1.7);
      group.add(tooth);
      meshes.push(tooth);
    }

    // Suelo de paso continuo por la boca (Y = 0.70 con espesor 0.20, superficie Y = 0.80)
    const mouthFloorGeo = new THREE.BoxGeometry(3.78, 0.20, headD + 0.4);
    const mouthPortal = new THREE.Mesh(mouthFloorGeo, mouthCavityMat);
    mouthPortal.position.set(0, 0.70, 0.0);

    group.add(palateRoof, mouthPortal);
    meshes.push(palateRoof, mouthPortal);

    return { group, mouthPortal, meshes };
  }

static createFlooFlameGroup(): THREE.Group {
    const group = new THREE.Group();
    group.name = "floo_green_flame_group";

    // Verde esmeralda puro intenso (cero azul)
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0x00d410,       // Verde vibrante (R: 0, G: 212, B: 16)
      emissive: 0x00cc11,    // Emisivo verde esmeralda (R: 0, G: 204, B: 17)
      emissiveIntensity: 1.8,
      roughness: 0.25,
      transparent: true,
      opacity: 0.95
    });
    // Núcleo verde lima fluorescente
    const coreFlameMat = new THREE.MeshStandardMaterial({
      color: 0x76ff03,       // Lima vivo (R: 118, G: 255, B: 3 - cero azul)
      emissive: 0x64dd17,    // Emisivo lima brillante
      emissiveIntensity: 2.0,
      roughness: 0.15
    });

    for (let i = 0; i < 7; i++) {
      const fx = (i - 3) * 0.34;
      const fz = (i % 2 === 0 ? 0.18 : -0.18);
      const h = 1.3 + (3.5 - Math.abs(i - 3)) * 0.45;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.24, h, 8), flameMat);
      cone.position.set(fx, h / 2, fz);
      const core = new THREE.Mesh(new THREE.ConeGeometry(0.12, h * 0.65, 8), coreFlameMat);
      core.position.set(fx, (h * 0.65) / 2, fz);
      group.add(cone, core);
    }

    // Luz de llama verde pura espectral
    const flameLight = new THREE.PointLight(0x00ff11, 4.0, 9.0);
    flameLight.name = "floo_flame_light";
    flameLight.position.set(0, 1.2, 0);
    group.add(flameLight);

    return group;
  }

static createFlooFireplaceMesh(
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; hearthMesh: THREE.Mesh; flooFlameGroup: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "floo_fireplace_group";
    const meshes: THREE.Mesh[] = [];

    const brickMat = new THREE.MeshStandardMaterial({ color: 0xb03a2e, roughness: 0.85, metalness: 0.05 });
    const stoneHearthMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, roughness: 0.75, metalness: 0.15 });
    const oakMantelMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.65, metalness: 0.1 });
    const firebackMat = new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.9 });
    const logMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.95 });
    const emberMat = new THREE.MeshStandardMaterial({ color: 0xff3d00, emissive: 0xff6d00, emissiveIntensity: 1.6 });

    // 1. Stone Hearth Floor (Ground level entrance)
    const hearthGeo = new THREE.BoxGeometry(4.4, 0.35, 3.2);
    const hearthMesh = new THREE.Mesh(hearthGeo, stoneHearthMat);
    hearthMesh.position.set(0, 0.175, 0);
    group.add(hearthMesh);
    meshes.push(hearthMesh);

    // 2. Brick Side Jambs (Left & Right)
    const jambGeo = new THREE.BoxGeometry(0.9, 3.2, 2.6);
    const jambL = new THREE.Mesh(jambGeo, brickMat);
    jambL.position.set(-1.75, 1.775, 0);
    const jambR = new THREE.Mesh(jambGeo, brickMat);
    jambR.position.set(1.75, 1.775, 0);
    group.add(jambL, jambR);
    meshes.push(jambL, jambR);

    // 3. Dark Cast Iron Fireback Wall
    const backGeo = new THREE.BoxGeometry(4.4, 3.2, 0.45);
    const backWall = new THREE.Mesh(backGeo, firebackMat);
    backWall.position.set(0, 1.775, -1.35);
    group.add(backWall);
    meshes.push(backWall);

    // 4. Brick Chimney Breast over firebox
    const breastGeo = new THREE.BoxGeometry(4.4, 1.2, 2.6);
    const breast = new THREE.Mesh(breastGeo, brickMat);
    breast.position.set(0, 3.975, 0);
    group.add(breast);
    meshes.push(breast);

    // 5. Carved Dark Oak Mantelpiece
    const mantelGeo = new THREE.BoxGeometry(4.8, 0.35, 1.2);
    const mantel = new THREE.Mesh(mantelGeo, oakMantelMat);
    mantel.position.set(0, 3.375, 0.8);
    group.add(mantel);
    meshes.push(mantel);

    // 6. Glowing Logs and Embers on andirons inside firebox (Leña con físicas)
    for (const lx of [-0.6, 0.6]) {
      const andiron = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 1.2), firebackMat);
      andiron.position.set(lx, 0.45, -0.5);
      group.add(andiron);
      meshes.push(andiron);
    }

    const log1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.20, 2.0, 8), logMat);
    log1.rotateZ(Math.PI / 2);
    log1.position.set(0, 0.65, -0.6);
    const log2 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.17, 1.8, 8), logMat);
    log2.rotateZ(Math.PI / 2);
    log2.rotateY(0.25);
    log2.position.set(0, 0.85, -0.5);
    group.add(log1, log2);
    meshes.push(log1, log2);

    const ember = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.9), emberMat);
    ember.position.set(0, 0.42, -0.5);
    group.add(ember);
    meshes.push(ember);

    // 7. Llamas verdes Floo integradas en el hogar (inicialmente inactivas hasta pasar 5s)
    const flooFlameGroup = LevelBuilder.createFlooFlameGroup();
    flooFlameGroup.position.set(0, 0.45, -0.55);
    flooFlameGroup.visible = false;
    flooFlameGroup.scale.set(0.001, 0.001, 0.001);
    const light = flooFlameGroup.getObjectByName("floo_flame_light") as THREE.PointLight | undefined;
    if (light) light.intensity = 0;
    group.add(flooFlameGroup);

    return { group, hearthMesh, flooFlameGroup, meshes };
  }

static createHoodedManMesh(
    hoodieColor: string = "#1e293b",
    quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "carabanchel_hooded_man_group";
    const meshes: THREE.Mesh[] = [];

    const seg = quality === "low" ? 8 : quality === "medium" ? 12 : 18;

    const skinMat = new THREE.MeshStandardMaterial({ color: 0x784724, roughness: 0.75 }); // piel morena
    const darkHairMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 }); // pelo negro / barba
    const hoodieMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(hoodieColor), roughness: 0.7 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const sneakerMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 });

    // Head with neat black beard
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, seg, seg), skinMat);
    head.position.set(0, 1.58, 0);
    group.add(head);
    meshes.push(head);

    // Full black beard and mustache
    const beard = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.22), darkHairMat);
    beard.position.set(0, 1.48, 0.08);
    group.add(beard);
    meshes.push(beard);

    // Hoodie Hood over the head (sphere shell covering back, sides and top)
    const hood = new THREE.Mesh(new THREE.SphereGeometry(0.24, seg, seg), hoodieMat);
    hood.position.set(0, 1.60, -0.04);
    hood.scale.set(0.98, 1.05, 1.05);
    group.add(hood);
    meshes.push(hood);

    // Torso with Hoodie (kangaroo pouch)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.62, 0.32), hoodieMat);
    torso.position.set(0, 1.15, 0);
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.08), hoodieMat);
    pocket.position.set(0, 0.98, 0.18);
    group.add(torso, pocket);
    meshes.push(torso, pocket);

    // Legs with dark joggers
    for (const lx of [-0.14, 0.14]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.68, seg), pantsMat);
      leg.position.set(lx, 0.42, 0);
      const sneaker = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.26), sneakerMat);
      sneaker.position.set(lx, 0.05, 0.04);
      group.add(leg, sneaker);
      meshes.push(leg, sneaker);
    }

    // Arms in hoodie sleeves
    for (const ax of [-0.34, 0.34]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.64, seg), hoodieMat);
      arm.position.set(ax, 1.1, 0);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 6, 6), skinMat);
      hand.position.set(ax, 0.74, 0);
      group.add(arm, hand);
      meshes.push(arm, hand);
    }

    return { group, meshes };
  }

static createMembrilloBumperMesh(
    width: number = 2.4,
    height: number = 1.4,
    depth: number = 2.4,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "membrillo_cube_group";
    const meshes: THREE.Mesh[] = [];

    const tex = SpriteTextures.getMembrilloTexture();
    const jellyMat = new THREE.MeshStandardMaterial({
      map: tex,
      color: 0x991b1b,
      roughness: 0.12,
      metalness: 0.08,
      transparent: true,
      opacity: 0.94
    });

    const cubeGeo = new THREE.BoxGeometry(width, height, depth);
    const mainCube = new THREE.Mesh(cubeGeo, jellyMat);
    mainCube.position.set(0, height / 2, 0);
    group.add(mainCube);
    meshes.push(mainCube);

    // Candied Sugar Garnish Crystals on top surface
    const sugarMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.5,
      emissive: 0xffffff,
      emissiveIntensity: 0.25
    });

    const sugarCount = 10;
    const crystalGeo = new THREE.BoxGeometry(0.12, 0.08, 0.12);
    for (let i = 0; i < sugarCount; i++) {
      const rx = (Math.sin(i * 3.7) * 0.38) * width;
      const rz = (Math.cos(i * 5.1) * 0.38) * depth;
      const crystal = new THREE.Mesh(crystalGeo, sugarMat);
      crystal.position.set(rx, height + 0.04, rz);
      crystal.rotation.y = i * 0.6;
      group.add(crystal);
      meshes.push(crystal);
    }

    return { group, meshes };
  }

static createPokemonBoosterWallMesh(
    width: number = 8.0,
    height: number = 3.4,
    depth: number = 0.6,
    packIndex: number = 0,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "pokemon_booster_wall_group";
    const meshes: THREE.Mesh[] = [];

    const packTex = SpriteTextures.getPokemonBoosterTexture(packIndex);
    const foilMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.88,
      roughness: 0.22
    });
    const frontBackMat = new THREE.MeshStandardMaterial({
      map: packTex,
      metalness: 0.42,
      roughness: 0.24
    });

    // Box faces: [Right, Left, Top, Bottom, Front, Back]
    const materials = [foilMat, foilMat, foilMat, foilMat, frontBackMat, frontBackMat];
    const wallGeo = new THREE.BoxGeometry(width, height, depth);
    const wallMesh = new THREE.Mesh(wallGeo, materials);
    wallMesh.position.set(0, height / 2, 0);
    group.add(wallMesh);
    meshes.push(wallMesh);

    // Overhanging Crimped Metallic Foil Header & Footer Lips
    const crimpGeo = new THREE.BoxGeometry(width + 0.12, 0.18, depth + 0.08);
    const crimpTop = new THREE.Mesh(crimpGeo, foilMat);
    crimpTop.position.set(0, height + 0.09, 0);
    const crimpBottom = new THREE.Mesh(crimpGeo, foilMat);
    crimpBottom.position.set(0, 0.09, 0);
    group.add(crimpTop, crimpBottom);
    meshes.push(crimpTop, crimpBottom);

    return { group, meshes };
  }

static createPirateShipMesh(
    quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "pirate_ship_structure_group";
    const meshes: THREE.Mesh[] = [];

    const seg = quality === "low" ? 8 : quality === "medium" ? 14 : 20;

    const darkOakMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.78 });
    const deckPlankMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.70 });
    const mastWoodMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.82 });
    const blackSailMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.90 });
    const whiteSkullMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.50, emissive: 0xffffff, emissiveIntensity: 0.1 });
    const ironCannonMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.35, metalness: 0.85 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.30, metalness: 0.80 });

    // 1. Main Walkable Deck
    const mainDeck = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.8, 28.0), deckPlankMat);
    mainDeck.position.set(0, 0.4, 0);
    group.add(mainDeck);
    meshes.push(mainDeck);

    // 2. Elevated Stern Castle (Poop Deck) with Captain's Bridge
    const sternDeck = new THREE.Mesh(new THREE.BoxGeometry(8.6, 1.2, 7.5), darkOakMat);
    sternDeck.position.set(0, 1.4, 10.25);
    group.add(sternDeck);
    meshes.push(sternDeck);

    // 3. Elevated Bow Prow Deck with Bowsprit Spar
    const bowDeck = new THREE.Mesh(new THREE.BoxGeometry(8.6, 1.0, 7.5), darkOakMat);
    bowDeck.position.set(0, 1.2, -10.25);
    const bowsprit = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.32, 7.0, seg), mastWoodMat);
    bowsprit.rotation.x = -Math.PI / 3.2;
    bowsprit.position.set(0, 3.2, -16.5);
    group.add(bowDeck, bowsprit);
    meshes.push(bowDeck, bowsprit);

    // 4. Outer Hull Ribs (Port & Starboard)
    for (const hx of [-4.7, 4.7]) {
      const hullWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.6, 28.0), darkOakMat);
      hullWall.position.set(hx, 1.5, 0);
      group.add(hullWall);
      meshes.push(hullWall);
    }

    // 5. Tall Main Mast & Foremast with Black Pirate Sails
    const mastConfigs = [
      { x: 0, y: 7.5, z: 2.0, h: 14.0, sailW: 7.0, sailH: 4.8 },
      { x: 0, y: 6.5, z: -5.5, h: 11.5, sailW: 6.0, sailH: 4.0 }
    ];

    for (const mc of mastConfigs) {
      const mastPole = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.35, mc.h, seg), mastWoodMat);
      mastPole.position.set(mc.x, mc.y, mc.z);

      const yardArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, mc.sailW + 0.8, seg), mastWoodMat);
      yardArm.rotation.z = Math.PI / 2;
      yardArm.position.set(mc.x, mc.y + mc.h * 0.22, mc.z);

      const blackSail = new THREE.Mesh(new THREE.BoxGeometry(mc.sailW, mc.sailH, 0.08), blackSailMat);
      blackSail.position.set(mc.x, mc.y + mc.h * 0.05, mc.z + 0.1);

      // Skull on main sail
      if (mc.z > 0) {
        const skullHead = new THREE.Mesh(new THREE.SphereGeometry(0.65, seg, seg), whiteSkullMat);
        skullHead.position.set(mc.x, mc.y + mc.h * 0.08, mc.z + 0.2);
        const skullJaw = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.40, 0.25), whiteSkullMat);
        skullJaw.position.set(mc.x, mc.y + mc.h * 0.08 - 0.5, mc.z + 0.2);

        // Crossbones behind skull
        const bone1 = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.18, 0.12), whiteSkullMat);
        bone1.rotation.z = Math.PI / 4;
        bone1.position.set(mc.x, mc.y + mc.h * 0.08, mc.z + 0.16);
        const bone2 = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.18, 0.12), whiteSkullMat);
        bone2.rotation.z = -Math.PI / 4;
        bone2.position.set(mc.x, mc.y + mc.h * 0.08, mc.z + 0.16);

        group.add(skullHead, skullJaw, bone1, bone2);
        meshes.push(skullHead, skullJaw, bone1, bone2);
      }

      // Crow's nest on main mast
      if (mc.z > 0) {
        const crowsNest = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.9, 1.2, seg, 1, true), mastWoodMat);
        crowsNest.position.set(mc.x, mc.y + mc.h * 0.42, mc.z);
        group.add(crowsNest);
        meshes.push(crowsNest);
      }

      group.add(mastPole, yardArm, blackSail);
      meshes.push(mastPole, yardArm, blackSail);
    }

    // 6. Brass Ship Wheel (Timón) on Stern
    const wheelStand = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 1.1, seg), darkOakMat);
    wheelStand.position.set(0, 2.35, 12.0);
    const wheelRim = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.06, 8, seg), brassMat);
    wheelRim.position.set(0, 2.9, 12.0);
    group.add(wheelStand, wheelRim);
    meshes.push(wheelStand, wheelRim);

    // 7. Cast Iron Cannons along Deck
    const cannonPositions = [
      { x: -4.3, z: 2.0, rotY: -Math.PI / 2 },
      { x: -4.3, z: -4.0, rotY: -Math.PI / 2 },
      { x: 4.3, z: 2.0, rotY: Math.PI / 2 },
      { x: 4.3, z: -4.0, rotY: Math.PI / 2 }
    ];
    for (const cp of cannonPositions) {
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 1.8, seg), ironCannonMat);
      barrel.rotation.z = Math.PI / 2;
      barrel.rotation.y = cp.rotY;
      barrel.position.set(cp.x, 1.2, cp.z);
      const carriage = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 1.2), darkOakMat);
      carriage.position.set(cp.x, 0.95, cp.z);
      group.add(barrel, carriage);
      meshes.push(barrel, carriage);
    }

    return { group, meshes };
  }

static createWaterGeyserMesh(
    radius: number = 2.4,
    height: number = 16.0,
    quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "water_geyser_group";
    const meshes: THREE.Mesh[] = [];

    const seg = quality === "low" ? 12 : quality === "medium" ? 20 : 32;

    const graniteRimMat = new THREE.MeshStandardMaterial({ color: 0x546e7a, roughness: 0.65 });
    const brassNozzleMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35, metalness: 0.80 });

    const geyserTex = SpriteTextures.getWaterGeyserTexture();
    const geyserMat = new THREE.MeshStandardMaterial({
      map: geyserTex,
      color: 0x00e5ff,
      emissive: 0x00b0ff,
      emissiveIntensity: 0.65,
      roughness: 0.08,
      transparent: true,
      opacity: 0.85
    });

    const foamMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.78,
      roughness: 0.15
    });

    // 1. Granite Basin Ring on Lake Floor
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.5, radius * 1.6, 0.7, seg), graniteRimMat);
    basin.position.set(0, 0.35, 0);
    group.add(basin);
    meshes.push(basin);

    // 2. Brass Jet Nozzles Ring
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const nx = Math.cos(angle) * (radius * 0.85);
      const nz = Math.sin(angle) * (radius * 0.85);
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.5, 8), brassNozzleMat);
      nozzle.position.set(nx, 0.8, nz);
      group.add(nozzle);
      meshes.push(nozzle);
    }

    // 3. Central Foaming Water Column (Tapering Hydro-Jet)
    const geyserColumn = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.9, radius * 1.2, height, seg), geyserMat);
    geyserColumn.position.set(0, height / 2 + 0.6, 0);
    group.add(geyserColumn);
    meshes.push(geyserColumn);

    // 4. Foaming Spray Mist Discs expanding with height
    for (const hFrac of [0.35, 0.70, 0.98]) {
      const discR = radius * (1.1 + hFrac * 0.8);
      const mistDisc = new THREE.Mesh(new THREE.CylinderGeometry(discR, discR * 0.85, 0.45, seg), foamMat);
      mistDisc.position.set(0, height * hFrac + 0.6, 0);
      group.add(mistDisc);
      meshes.push(mistDisc);
    }

    // 5. Pulsing Upward Cyan Light
    const geyserLight = new THREE.PointLight(0x00e5ff, 2.5, 24.0);
    geyserLight.position.set(0, height * 0.65, 0);
    group.add(geyserLight);

    return { group, meshes };
  }

static createCarrefourArchMesh(
    width: number = 16.0,
    height: number = 6.5,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "carrefour_arch_group";
    const meshes: THREE.Mesh[] = [];

    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.15 });
    const blueHeaderMat = new THREE.MeshStandardMaterial({ color: 0x004e9a, roughness: 0.40 });
    const logoTex = SpriteTextures.getCarrefourLogoTexture();
    const signMat = new THREE.MeshStandardMaterial({ map: logoTex, roughness: 0.25 });

    // 1. Two Modern Supermarket Pillars
    for (const px of [-width / 2 + 0.6, width / 2 - 0.6]) {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.2, height, 1.2), pillarMat);
      pillar.position.set(px, height / 2, 0);
      group.add(pillar);
      meshes.push(pillar);
    }

    // 2. Horizontal Header Beam
    const headerBeam = new THREE.Mesh(new THREE.BoxGeometry(width, 1.2, 1.4), blueHeaderMat);
    headerBeam.position.set(0, height - 0.6, 0);
    group.add(headerBeam);
    meshes.push(headerBeam);

    // 3. Central Illuminated Carrefour Logo Signboard
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(width * 0.65, 2.2, 0.2), signMat);
    signBoard.position.set(0, height + 0.9, 0.4);
    group.add(signBoard);
    meshes.push(signBoard);

    return { group, meshes };
  }


  static applyContinuousWorldUVs(
    geo: THREE.BufferGeometry,
    worldPos: { x: number; y: number; z: number },
    worldRot: { x: number; y: number; z: number },
    worldScale: { x: number; y: number; z: number },
    textureTileSize = 4.0
  ): void {
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
    const normAttr = geo.getAttribute("normal") as THREE.BufferAttribute;
    const uvAttr = geo.getAttribute("uv") as THREE.BufferAttribute;
    if (!posAttr || !normAttr || !uvAttr) return;

    const euler = new THREE.Euler(worldRot.x, worldRot.y, worldRot.z, "YXZ");
    const localPos = new THREE.Vector3();
    const localNorm = new THREE.Vector3();

    for (let i = 0; i < posAttr.count; i++) {
      localPos.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      localNorm.set(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));

      localPos.applyEuler(euler);
      localNorm.applyEuler(euler);

      const wx = worldPos.x + localPos.x;
      const wy = worldPos.y + localPos.y;
      const wz = worldPos.z + localPos.z;

      const nx = Math.abs(localNorm.x);
      const ny = Math.abs(localNorm.y);
      const nz = Math.abs(localNorm.z);

      if (ny >= nx && ny >= nz) {
        // Top / Bottom faces: world X and world Z
        uvAttr.setXY(i, wx / textureTileSize, wz / textureTileSize);
      } else if (nx >= nz) {
        // Left / Right faces: world Z and relative height
        uvAttr.setXY(i, wz / textureTileSize, (wy - (worldPos.y - worldScale.y / 2)) / textureTileSize);
      } else {
        // Front / Back faces: world X and relative height
        uvAttr.setXY(i, wx / textureTileSize, (wy - (worldPos.y - worldScale.y / 2)) / textureTileSize);
      }
    }
    uvAttr.needsUpdate = true;
  }



  private static chalkboardTex: THREE.CanvasTexture | null = null;
  private static dogTongueTex: THREE.CanvasTexture | null = null;
  private static ronyFaceTex: THREE.CanvasTexture | null = null;
  private static tramDestTex: THREE.CanvasTexture | null = null;
  private static emtBusDestMap: Map<string, THREE.CanvasTexture> = new Map();
  private static streetMarkingPiquenasTex: THREE.CanvasTexture | null = null;
  private static atletiJerseyTex: THREE.CanvasTexture | null = null;
  private static greenFloralDressTex: THREE.CanvasTexture | null = null;
  private static realMadridJerseyTex: THREE.CanvasTexture | null = null;
  private static vintageTigerDressTex: THREE.CanvasTexture | null = null;
  private static cachedWaterTex: THREE.CanvasTexture | null = null;
  private static cachedLavaTex: THREE.CanvasTexture | null = null;
  private static cachedHoneyTex: THREE.CanvasTexture | null = null;

  static getSharedWaterTexture(): THREE.CanvasTexture {
    if (this.cachedWaterTex) return this.cachedWaterTex;
    this.cachedWaterTex=retainSharedTexture(createNaturalWaterTexture());
    return this.cachedWaterTex;
  }

  static getSharedLavaTexture(): THREE.CanvasTexture {
    if (this.cachedLavaTex) return this.cachedLavaTex;

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#d00000";
    ctx.fillRect(0, 0, 128, 128);

    ctx.fillStyle = "#ff5400";
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc((i * 35) % 128, (i * 47) % 128, 28, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#ffb703";
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(((i * 29) + 10) % 128, ((i * 41) + 15) % 128, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#220000";
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(((i * 43) + 20) % 128, ((i * 37) + 10) % 128, 16, 10, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;

    this.cachedLavaTex = retainSharedTexture(tex);
    return tex;
  }


static getSharedHoneyTexture(): THREE.CanvasTexture {
    if (this.cachedHoneyTex) return this.cachedHoneyTex;

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;

    // Rich golden amber honey base
    ctx.fillStyle = "#d97706";
    ctx.fillRect(0, 0, 128, 128);

    // Warm bright honey swirls
    ctx.fillStyle = "#f59e0b";
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc((i * 37) % 128, (i * 43) % 128, 32, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glowing golden viscous highlights
    ctx.fillStyle = "#fbbf24";
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.arc((i * 31 + 12) % 128, (i * 39 + 18) % 128, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tiny suspended honey bubbles with shine
    ctx.fillStyle = "#fef08a";
    for (let i = 0; i < 12; i++) {
      const bx = (i * 23 + 7) % 128;
      const by = (i * 29 + 11) % 128;
      ctx.beginPath();
      ctx.arc(bx, by, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    this.cachedHoneyTex = retainSharedTexture(tex);
    return tex;
  }


  private buildWaterClusters(
    waterObjects: LevelObjectData[],
    physics: PhysicsWorld,
    root: THREE.Group,
    waterBlocks: ActiveWaterBlock[],
    tempEuler: THREE.Euler,
    tempQuat: THREE.Quaternion,
    activeQuality: "low" | "medium" | "high" = "medium"
  ): void {
    if (waterObjects.length === 0) return;

    // Cluster discovery: find connected/adjacent water blocks
    const visited = new Set<string>();
    const clusters: LevelObjectData[][] = [];

    for (let i = 0; i < waterObjects.length; i++) {
      const startObj = waterObjects[i];
      if (visited.has(startObj.id)) continue;

      const cluster: LevelObjectData[] = [startObj];
      visited.add(startObj.id);
      const queue: LevelObjectData[] = [startObj];

      while (queue.length > 0) {
        const curr = queue.shift()!;
        const currTop = curr.position.y + curr.scale.y / 2;
        const currMinX = curr.position.x - curr.scale.x / 2;
        const currMaxX = curr.position.x + curr.scale.x / 2;
        const currMinZ = curr.position.z - curr.scale.z / 2;
        const currMaxZ = curr.position.z + curr.scale.z / 2;

        for (let j = 0; j < waterObjects.length; j++) {
          const other = waterObjects[j];
          if (visited.has(other.id)) continue;

          const otherTop = other.position.y + other.scale.y / 2;
          if (Math.abs(currTop - otherTop) > 0.25) continue;

          const otherMinX = other.position.x - other.scale.x / 2;
          const otherMaxX = other.position.x + other.scale.x / 2;
          const otherMinZ = other.position.z - other.scale.z / 2;
          const otherMaxZ = other.position.z + other.scale.z / 2;

          const touchX = currMinX <= otherMaxX + 0.1 && currMaxX >= otherMinX - 0.1;
          const touchZ = currMinZ <= otherMaxZ + 0.1 && currMaxZ >= otherMinZ - 0.1;

          if (touchX && touchZ) {
            visited.add(other.id);
            cluster.push(other);
            queue.push(other);
          }
        }
      }
      clusters.push(cluster);
    }

    const waterTex = LevelBuilder.getSharedWaterTexture();

    for (const cluster of clusters) {
      const minX = Math.min(...cluster.map(o => o.position.x - o.scale.x / 2));
      const maxX = Math.max(...cluster.map(o => o.position.x + o.scale.x / 2));
      const minZ = Math.min(...cluster.map(o => o.position.z - o.scale.z / 2));
      const maxZ = Math.max(...cluster.map(o => o.position.z + o.scale.z / 2));

      const clusterWidth = Math.max(1, maxX - minX);
      const clusterDepth = Math.max(1, maxZ - minZ);
      const clusterCenterX = (minX + maxX) / 2;
      const clusterCenterZ = (minZ + maxZ) / 2;

      const density = activeQuality === "low" ? 2 : activeQuality === "medium" ? 3 : 4;
      const simRes = Math.min(
        activeQuality === "low" ? 20 : activeQuality === "medium" ? 32 : 48,
        Math.max(14, Math.round(Math.max(clusterWidth, clusterDepth) * density))
      );
      const simulator = new WaterWaveSimulator(clusterWidth, clusterDepth, simRes, clusterCenterX, clusterCenterZ);

      for (const obj of cluster) {
        tempEuler.set(obj.rotation.x, obj.rotation.y, obj.rotation.z, "YXZ");
        tempQuat.setFromEuler(tempEuler);

        const surfaceY = obj.position.y + obj.scale.y / 2;
        const isCircular =
          obj.properties?.shape === "cylinder" ||
          obj.properties?.shape === "circle" ||
          obj.properties?.platformShape === "cylinder" ||
          obj.properties?.platformShape === "circle";
        const radius = Math.max(obj.scale.x, obj.scale.z) / 2;

        let surfaceGeo: THREE.BufferGeometry;
        let bodyGeo: THREE.BufferGeometry;

        if (isCircular) {
          // Interior rings let waves travel across the whole pool, not just its rim.
          surfaceGeo = new THREE.RingGeometry(0,radius,activeQuality === "low" ? 24:48,activeQuality === "low" ? 4:activeQuality === "medium" ? 8:12);
          surfaceGeo.rotateX(-Math.PI / 2);
          bodyGeo = new THREE.CylinderGeometry(radius, radius, Math.max(0.1, obj.scale.y - 0.04), 48);
        } else {
          const segX = Math.min(24, Math.max(4, Math.round(obj.scale.x * density)));
          const segZ = Math.min(24, Math.max(4, Math.round(obj.scale.z * density)));
          surfaceGeo = new THREE.PlaneGeometry(obj.scale.x, obj.scale.z, segX, segZ);
          surfaceGeo.rotateX(-Math.PI / 2);
          bodyGeo = new THREE.BoxGeometry(obj.scale.x, Math.max(0.1, obj.scale.y - 0.04), obj.scale.z);
        }

        const uvAttr = surfaceGeo.getAttribute("uv") as THREE.BufferAttribute;
        const posAttr = surfaceGeo.getAttribute("position") as THREE.BufferAttribute;
        for (let k = 0; k < uvAttr.count; k++) {
          const wx = obj.position.x + posAttr.getX(k);
          const wz = obj.position.z + posAttr.getZ(k);
          uvAttr.setXY(k, wx / 4.0, wz / 4.0);
        }
        uvAttr.needsUpdate = true;

        const isHoney = obj.type === "honey" || obj.properties?.fluidType === "honey" || obj.properties?.theme === "honey";
        const fluidTex = isHoney ? LevelBuilder.getSharedHoneyTexture() : waterTex;
        const fluidColor = isHoney ? 0xf59e0b : 0xc2e4e5;
        const fluidBodyColor = isHoney ? 0xb45309 : 0x176575;

        let surfaceMat: THREE.Material;
        if (activeQuality === "low") {
          surfaceMat = new THREE.MeshBasicMaterial({
            map: fluidTex,
            color: new THREE.Color(fluidColor),
            transparent: true,
            opacity: isHoney ? 0.88 : 0.82,
            depthWrite: false,
            side: THREE.DoubleSide
          });
        } else if (activeQuality === "medium") {
          surfaceMat = new THREE.MeshPhongMaterial({
            map: fluidTex,
            bumpMap:isHoney ? null:fluidTex,
            bumpScale:.06,
            color: new THREE.Color(fluidColor),
            shininess: isHoney ? 90 : 70,
            specular: new THREE.Color(isHoney ? 0xfff0aa : 0xffffff),
            transparent: true,
            opacity: isHoney ? 0.88 : 0.82,
            depthWrite: false,
            side: THREE.DoubleSide
          });
        } else {
          surfaceMat = new THREE.MeshStandardMaterial({
            map: fluidTex,
            bumpMap:isHoney ? null:fluidTex,
            bumpScale:.06,
            roughnessMap: isHoney ? fluidTex:null,
            color: new THREE.Color(fluidColor),
            roughness: isHoney ? 0.05 : 0.2,
            metalness: isHoney ? 0.18 : 0,
            transparent: true,
            opacity: isHoney ? 0.88 : 0.82,
            depthWrite: false,
            side: THREE.DoubleSide
          });
        }

        if(typeof obj.properties?.surfaceOpacity==="number") surfaceMat.opacity=THREE.MathUtils.clamp(obj.properties.surfaceOpacity,0,1);
        const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
        surfaceMesh.renderOrder = 6;
        surfaceMesh.position.set(obj.position.x, surfaceY, obj.position.z);
        surfaceMesh.rotation.copy(tempEuler);
        root.add(surfaceMesh);

        LevelBuilder.applyContinuousWorldUVs(bodyGeo, obj.position, obj.rotation, obj.scale, 4.0);

        const bodyMat: THREE.Material = activeQuality === "high"
          ? new THREE.MeshStandardMaterial({
              color: new THREE.Color(fluidBodyColor),
              roughness: 0.20,
              metalness: 0.05,
              transparent: true,
              opacity: isHoney ? 0.72 : 0.55,
              depthWrite: false,
              side: THREE.DoubleSide
            })
          : new THREE.MeshLambertMaterial({
              color: new THREE.Color(fluidBodyColor),
              transparent: true,
              opacity: isHoney ? 0.72 : 0.55,
              depthWrite: false,
              side: THREE.DoubleSide
            });

        if(typeof obj.properties?.bodyOpacity==="number") bodyMat.opacity=THREE.MathUtils.clamp(obj.properties.bodyOpacity,0,1);
        const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
        bodyMesh.renderOrder = 5;
        bodyMesh.position.set(obj.position.x, obj.position.y - 0.02, obj.position.z);
        bodyMesh.rotation.copy(tempEuler);
        root.add(bodyMesh);

        const hasCollision =
          obj.properties?.hasCollision === true ||
          obj.properties?.passable === false ||
          obj.properties?.solid === true;
        const passable = !hasCollision;

        waterBlocks.push({
          id: obj.id,
          position: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
          scale: new THREE.Vector3(obj.scale.x, obj.scale.y, obj.scale.z),
          mesh: bodyMesh,
          surfaceMesh,
          simulator,
          material: surfaceMat,
          clusterCenterX,
          clusterCenterZ,
          passable,
          fluidType: isHoney ? "honey" : "water",
          dragFactor: typeof obj.properties?.dragFactor==="number" ? THREE.MathUtils.clamp(obj.properties.dragFactor,0,20) : isHoney ? 8.5 : 3.4
        });

        if (hasCollision) {
          if (isCircular) {
            physics.createCylinderCollider(
              obj.position,
              radius,
              obj.scale.y / 2,
              0.6,
              0.15
            );
          } else {
            physics.createBoxCollider(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: obj.scale.x / 2, y: obj.scale.y / 2, z: obj.scale.z / 2 },
              0.6,
              0.15
            );
          }
        }
      }
    }
  }


static createIslazulMallFacadeMesh(
    width = 44,
    height = 18,
    depth = 10,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "islazul_mall_facade_group";
    const meshes: THREE.Mesh[] = [];

    const bronze = new THREE.MeshStandardMaterial({ color: 0xae875b, roughness: 0.57, metalness: 0.23 });
    const cladding = new THREE.MeshStandardMaterial({ color: 0xb2aba0, roughness: 0.78 });
    const timber = new THREE.MeshStandardMaterial({ color: 0x875f42, roughness: 0.83 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x294858, roughness: 0.27, metalness: 0.25 });
    const frame = new THREE.MeshStandardMaterial({ color: 0x353c41, roughness: 0.64 });
    const fascia = new THREE.MeshStandardMaterial({ color: 0xc6cbc8, roughness: 0.64 });
    const sign = new THREE.MeshBasicMaterial({ map: SpriteTextures.getIslazulLogoTexture() });

    const add = (geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      group.add(mesh);
      meshes.push(mesh);
      return mesh;
    };
    const bodyHeight = height * 0.72;
    const front = depth / 2;
    add(new RoundedBoxGeometry(width, bodyHeight, depth, 2, Math.min(depth * 0.18, 1.8)), cladding, 0, bodyHeight / 2, 0);
    add(new THREE.BoxGeometry(width * 0.87, height * 0.25, 0.18), glass, 0, height * 0.14, front);
    add(new THREE.BoxGeometry(width * 0.93, height * 0.055, depth * 0.24), fascia, 0, height * 0.30, front + depth * 0.09);

    const fins: THREE.BoxGeometry[] = [];
    const mullions: THREE.BoxGeometry[] = [];
    for (let i = 0; i < 32; i++) {
      const x = width * (i / 31 - 0.5) * 0.88;
      const z = front + 0.16 - 0.65 * Math.pow(x / (width * 0.44), 4);
      fins.push(new THREE.BoxGeometry(width * 0.015, height * 0.34, 0.36).translate(x, height * 0.49, z));
      mullions.push(new THREE.BoxGeometry(0.10, height * 0.25, 0.15).translate(x, height * 0.14, front + 0.12));
    }
    add(mergeGeometries(fins), timber, 0, 0, 0);
    add(mergeGeometries(mullions), frame, 0, 0, 0);
    for (const geometry of [...fins, ...mullions]) geometry.dispose();

    // Cylindrical entrance tower and the two intersecting families of woven ribs.
    const radius = Math.min(width * 0.12, depth * 0.49);
    const towerX = -width * 0.22;
    const towerZ = front + radius * 0.53;
    const towerHeight = height * 1.23;
    const segments = _quality === "low" ? 24 : 40;
    add(new THREE.CylinderGeometry(radius * 0.91, radius * 0.94, towerHeight, segments, 1, true), glass, towerX, towerHeight / 2, towerZ);
    const ribs: THREE.TubeGeometry[] = [];
    for (const direction of [-1, 1]) {
      for (let i = 0; i < 14; i++) {
        const points: THREE.Vector3[] = [];
        for (let j = 0; j <= 20; j++) {
          const u = j / 20;
          const angle = i * Math.PI * 2 / 14 + direction * u * 3.4;
          const r = radius + direction * 0.09;
          points.push(new THREE.Vector3(Math.sin(angle) * r, u * towerHeight, Math.cos(angle) * r));
        }
        ribs.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, radius * 0.022, 4, false));
      }
    }
    add(mergeGeometries(ribs), bronze, towerX, 0, towerZ);
    for (const geometry of ribs) geometry.dispose();
    const bandRadius = radius * 1.045;
    add(new THREE.CylinderGeometry(bandRadius, bandRadius, towerHeight * 0.16, segments, 1, true, -1.12, 2.24),
      sign, towerX, towerHeight * 0.73, towerZ);
    // Round entrance badge echoes the cylindrical sign on the tower.
    const badge = add(new THREE.CircleGeometry(height * 0.12, 32), sign, width * 0.20, height * 0.50, front + 0.52);
    badge.rotation.y = 0.08;

    return { group, meshes };
  }

static createPrimarkClothesWallMesh(
    width = 8.0,
    height = 3.4,
    depth = 0.8,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "primark_clothes_wall_group";
    const meshes: THREE.Mesh[] = [];

    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.18 });
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const primarkCyanMat = new THREE.MeshStandardMaterial({ color: 0x00a8e8, roughness: 0.35 });

    // 1. Lower Display Shelf Plinth
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, depth), plinthMat);
    plinth.position.set(0, 0.2, 0);
    group.add(plinth);
    meshes.push(plinth);

    // 2. Vertical Stanchions & Upper Chrome Hang Rail
    for (const sx of [-width / 2 + 0.15, width / 2 - 0.15]) {
      const stanchion = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, height, 8), chromeMat);
      stanchion.position.set(sx, height / 2, 0);
      group.add(stanchion);
      meshes.push(stanchion);
    }
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, width - 0.2, 8), chromeMat);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, height - 0.35, 0);
    group.add(rail);
    meshes.push(rail);

    // 3. Top Header Bar with Primark Cyan
    const header = new THREE.Mesh(new THREE.BoxGeometry(width + 0.1, 0.3, depth * 0.6), primarkCyanMat);
    header.position.set(0, height + 0.15, 0);
    group.add(header);
    meshes.push(header);

    // 4. Rows of colorful clothes hanging on the rack
    const clothesPalette = [0x00a8e8, 0xe91e63, 0xffca28, 0x4caf50, 0x9c27b0, 0xff5722, 0xf8fafc, 0x374151];
    const itemsCount = Math.max(4, Math.floor(width / 0.55));
    const stepX = (width - 0.6) / itemsCount;
    for (let i = 0; i < itemsCount; i++) {
      const cx = -width / 2 + 0.3 + i * stepX + stepX / 2;
      const colorVal = clothesPalette[i % clothesPalette.length];
      const garmentMat = new THREE.MeshStandardMaterial({ color: colorVal, roughness: 0.75 });
      const garmentH = 1.3 + Math.sin(i * 1.7) * 0.25;
      const garmentW = stepX * 0.88;
      const garmentMesh = new THREE.Mesh(new THREE.BoxGeometry(garmentW, garmentH, depth * 0.72), garmentMat);
      garmentMesh.position.set(cx, height - 0.35 - garmentH / 2, 0);
      group.add(garmentMesh);
      meshes.push(garmentMesh);
    }

    // 5. Folded knitwear/denim stacks on the plinth
    const denimMat = new THREE.MeshStandardMaterial({ color: 0x1a237e, roughness: 0.8 });
    const knitMat = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.85 });
    const stackCount = Math.max(2, Math.floor(width / 1.8));
    for (let s = 0; s < stackCount; s++) {
      const sx = -width / 2 + 0.9 + s * 1.8;
      const stack = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.35, depth * 0.75), s % 2 === 0 ? denimMat : knitMat);
      stack.position.set(sx, 0.55, 0);
      group.add(stack);
      meshes.push(stack);
    }

    return { group, meshes };
  }

static createPrimarkPortalMesh(
    width = 16.0,
    height = 7.0,
    depth = 1.6,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "primark_portal_group";
    const meshes: THREE.Mesh[] = [];

    const cyanMat = new THREE.MeshStandardMaterial({ color: 0x00a8e8, roughness: 0.35 });

    // Portal Posts (Left & Right)
    const pillarW = 2.0;
    for (const px of [-width / 2 + pillarW / 2, width / 2 - pillarW / 2]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(pillarW, height, depth), cyanMat);
      post.position.set(px, height / 2, 0);
      group.add(post);
      meshes.push(post);
    }

    // Upper Lintel Arch
    const lintelH = 2.2;
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(width, lintelH, depth), cyanMat);
    lintel.position.set(0, height - lintelH / 2, 0);
    group.add(lintel);
    meshes.push(lintel);

    // Front Primark Signboard with texture
    const signTex = SpriteTextures.getPrimarkLogoTexture();
    const signMat = new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.25, metalness: 0.1 });
    const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.65, lintelH * 0.8), signMat);
    signMesh.position.set(0, height - lintelH / 2, depth / 2 + 0.05);
    group.add(signMesh);
    meshes.push(signMesh);

    return { group, meshes };
  }

static createPrimarkPlushToyMesh(
    color = "#f48fb1",
    animalType: "bear" | "rabbit" | "dino" = "bear",
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "primark_plush_toy_group";
    const meshes: THREE.Mesh[] = [];

    const plushMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.92 });
    const whitePlush = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.92 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.2 });

    // 1. Plump squishy body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), plushMat);
    body.scale.set(1.1, 0.9, 1.2);
    body.position.set(0, 0.28, 0);
    group.add(body);
    meshes.push(body);

    // 2. Cute round head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), plushMat);
    head.position.set(0, 0.52, -0.15);
    group.add(head);
    meshes.push(head);

    // 3. Muzzle & dark button eyes
    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.12, 7, 7), whitePlush);
    muzzle.position.set(0, 0.49, -0.38);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyeMat);
    nose.position.set(0, 0.54, -0.47);
    group.add(muzzle, nose);
    meshes.push(muzzle, nose);

    for (const ex of [-0.09, 0.09]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), eyeMat);
      eye.position.set(ex, 0.58, -0.36);
      group.add(eye);
      meshes.push(eye);
    }

    // 4. Ears according to animalType
    if (animalType === "rabbit") {
      for (const ex of [-0.09, 0.09]) {
        const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.32, 6), plushMat);
        ear.rotation.z = ex > 0 ? -0.2 : 0.2;
        ear.position.set(ex, 0.82, -0.12);
        group.add(ear);
        meshes.push(ear);
      }
    } else {
      // Teddy bear ears
      for (const ex of [-0.18, 0.18]) {
        const ear = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), plushMat);
        ear.position.set(ex, 0.72, -0.12);
        group.add(ear);
        meshes.push(ear);
      }
    }

    // 5. Little paws
    for (const px of [-0.28, 0.28]) {
      const paw = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), plushMat);
      paw.position.set(px, 0.16, 0.12);
      group.add(paw);
      meshes.push(paw);
    }

    return { group, meshes };
  }

static createFunkoBoxMesh(
    width = 4.2,
    height = 5.2,
    depth = 3.8,
    _quality: "low" | "medium" | "high" = "medium",
    series: "dragon_ball" | "harry_potter" | "disney" = "dragon_ball"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "funko_pop_box_group";
    // The artwork includes window reflections. Each face has exactly one surface.
    const cardboard = new THREE.MeshStandardMaterial({ color: 0xf5efe3, roughness: 0.82 });
    const ink = new THREE.MeshStandardMaterial({ color: 0x172554, roughness: 0.78 });
    const front = new THREE.MeshStandardMaterial({ map: SpriteTextures.getFunkoBoxTexture(series), roughness: 0.65 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), [cardboard, cardboard, ink, ink, front, cardboard]);
    box.position.y = height / 2;
    group.add(box);
    const meshes = [box];

    return { group, meshes };
  }

  static createRodillaBumperMesh(
    radius = 1.2,
    height = 1.4,
    quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "rodilla_bumper_group";
    const meshes: THREE.Mesh[] = [];

    const seg = quality === "low" ? 14 : quality === "medium" ? 22 : 32;

    // 1. Base ring metálica cromada
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.85, roughness: 0.2 });
    const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.15, radius * 1.25, height * 0.22, seg), baseMat);
    baseRing.position.y = height * 0.11;
    group.add(baseRing);
    meshes.push(baseRing);

    // 2. Núcleo cilíndrico granate oficial Rodilla
    const redMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.35, metalness: 0.3 });
    const coreMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height * 0.58, seg), redMat);
    coreMesh.position.y = height * 0.5;
    group.add(coreMesh);
    meshes.push(coreMesh);

    // 3. Anillo de contacto elástico iluminado (mostaza / ensaladilla)
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffd54f });
    const glowRing = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.02, 0.08, 8, seg), glowMat);
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = height * 0.5;
    group.add(glowRing);
    meshes.push(glowRing);

    // 4. Cúpula superior esférica brillante
    const domeMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.2, metalness: 0.4 });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.95, seg, Math.max(6, Math.floor(seg / 2)), 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
    dome.position.y = height * 0.78;
    group.add(dome);
    meshes.push(dome);

    return { group, meshes };
  }

  static createRodillaSandwichMesh(
    width = 22.0,
    height = 15.0,
    depth = 50.0,
    _quality: "low" | "medium" | "high" = "medium",
    filling = ""
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "rodilla_sandwich_group";
    const meshes: THREE.Mesh[] = [];

    const crumb = SpriteTextures.getRodillaFillingTexture("");
    const breadMat = new THREE.MeshStandardMaterial({
      map: crumb, bumpMap: crumb, bumpScale: 0.08, roughness: 0.95, side: THREE.DoubleSide
    });
    const cut = SpriteTextures.getRodillaFillingTexture(filling);
    const fillingMat = new THREE.MeshStandardMaterial({
      map: cut, bumpMap: cut, bumpScale: 0.08,
      roughness: 0.92
    });
    const slopeMaterials = [breadMat, breadMat, fillingMat, breadMat, breadMat, breadMat];

    const halfD = depth / 2;
    const slopeLen = Math.hypot(height, halfD);
    const angle = Math.atan2(height, halfD);

    // 1. Base inferior plana ("por abajo plano")
    const basePlate = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, depth), breadMat);
    basePlate.position.set(0, 0.2, 0);
    group.add(basePlate);
    meshes.push(basePlate);

    // Smooth, uninterrupted bread ramp; remove the three oversized filling rails
    // that read as stripes from the playable camera angle.
    const buildSlope = (isFront: boolean): THREE.Group => {
      const slopeGroup = new THREE.Group();
      slopeGroup.position.set(0, height / 2, isFront ? halfD / 2 : -halfD / 2);
      slopeGroup.rotation.x = isFront ? angle : -angle;

      const breadSurface = new THREE.Mesh(new THREE.BoxGeometry(width, 0.5, slopeLen), slopeMaterials);
      slopeGroup.add(breadSurface);
      meshes.push(breadSurface);

      return slopeGroup;
    };

    // 2. Rampa de subida frontal hacia el corte superior
    const frontGroup = buildSlope(true);
    group.add(frontGroup);

    // 3. Rampa de bajada trasera desde el corte superior
    const backGroup = buildSlope(false);
    group.add(backGroup);

    // 5. Perfil lateral triangular del corte del sándwich (con capas de relleno)
    const triShape = new THREE.Shape();
    triShape.moveTo(-halfD, 0);
    triShape.lineTo(0, height);
    triShape.lineTo(halfD, 0);
    triShape.closePath();
    const sideGeo = new THREE.ShapeGeometry(triShape);
    const positions = sideGeo.getAttribute("position");
    const uv = sideGeo.getAttribute("uv");
    for (let i = 0; i < positions.count; i++) {
      uv.setXY(i, (positions.getX(i) + halfD) / depth, positions.getY(i) / height);
    }

    // Lateral izquierdo
    const leftFace = new THREE.Mesh(sideGeo, breadMat);
    leftFace.position.set(-width / 2, 0, 0);
    leftFace.rotation.y = -Math.PI / 2;
    group.add(leftFace);
    meshes.push(leftFace);

    // Lateral derecho
    const rightFace = new THREE.Mesh(sideGeo, breadMat);
    rightFace.position.set(width / 2, 0, 0);
    rightFace.rotation.y = Math.PI / 2;
    group.add(rightFace);
    meshes.push(rightFace);

    return { group, meshes };
  }

static createQuesaritoMesh(
    radius = 4.6,
    length = 68.0,
    quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "quesarito_cylinder_group";
    const meshes: THREE.Mesh[] = [];

    const seg = quality === "low" ? 14 : quality === "medium" ? 22 : 32;

    const tortilla = new THREE.MeshStandardMaterial({
      map: SpriteTextures.getQuesaritoTexture(false),
      roughness: 0.86
    });
    const filling = new THREE.MeshStandardMaterial({
      map: SpriteTextures.getQuesaritoTexture(true),
      roughness: 0.91
    });
    const geometry = new THREE.CylinderGeometry(radius, radius, length, seg);
    geometry.rotateX(Math.PI / 2);
    const roll = new THREE.Mesh(geometry, [tortilla, filling, filling]);
    group.add(roll);
    meshes.push(roll);

    return { group, meshes };
  }

static createTGBBurgerMesh(
    radius = 6.0,
    height = 5.2,
    quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "tgb_burger_group";
    const meshes: THREE.Mesh[] = [];

    const seg = quality === "low" ? 14 : quality === "medium" ? 22 : 32;

    const briocheMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.42 });
    const heelMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.55 });
    const beefMat = new THREE.MeshStandardMaterial({ color: 0x3f1d14, roughness: 0.88 });
    const cheddarMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.45 });
    const lettuceMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.65 });
    const tomatoMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
    const sesameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

    // 1. Brioche Bottom Bun (Heel)
    const heelH = height * 0.22;
    const heel = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.95, radius * 0.92, heelH, seg), heelMat);
    heel.position.set(0, heelH / 2, 0);
    group.add(heel);
    meshes.push(heel);

    // 2. Double Char-Grilled Beef Patties
    const pattyH = height * 0.16;
    const patty1 = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.02, radius * 1.02, pattyH, seg), beefMat);
    patty1.position.set(0, heelH + pattyH / 2 + 0.05, 0);
    const patty2 = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.02, radius * 1.02, pattyH, seg), beefMat);
    patty2.position.set(0, heelH + pattyH * 1.6 + 0.15, 0);
    group.add(patty1, patty2);
    meshes.push(patty1, patty2);

    // 3. Melted Cheddar Cheese Draped in between
    const cheeseSquare = new THREE.Mesh(new THREE.BoxGeometry(radius * 1.85, 0.12, radius * 1.85), cheddarMat);
    cheeseSquare.rotation.y = Math.PI / 4;
    cheeseSquare.position.set(0, heelH + pattyH + 0.1, 0);
    group.add(cheeseSquare);
    meshes.push(cheeseSquare);

    // 4. Fresh Sliced Red Tomatoes & Wavy Lettuce
    const tomato = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.98, radius * 0.98, height * 0.08, seg), tomatoMat);
    tomato.position.set(0, heelH + pattyH * 2.3 + 0.15, 0);
    const lettuce = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.08, radius * 1.04, height * 0.08, seg), lettuceMat);
    lettuce.position.set(0, heelH + pattyH * 2.3 + height * 0.12, 0);
    group.add(tomato, lettuce);
    meshes.push(tomato, lettuce);

    // 5. Glazed Brioche Crown Bun (Dome)
    const crownH = height * 0.38;
    const crownGeo = new THREE.SphereGeometry(radius * 1.02, seg, Math.floor(seg / 2), 0, Math.PI * 2, 0, Math.PI / 2);
    const crown = new THREE.Mesh(crownGeo, briocheMat);
    crown.scale.set(1.0, crownH / radius, 1.0);
    crown.position.set(0, height - crownH, 0);
    group.add(crown);
    meshes.push(crown);

    // 6. Scattered White Sesame Seeds on the Crown
    const seedCount = quality === "low" ? 20 : 45;
    for (let s = 0; s < seedCount; s++) {
      const phi = 0.2 + (s / seedCount) * 0.85;
      const theta = s * 2.399;
      const sx = Math.sin(phi) * Math.cos(theta) * (radius * 0.95);
      const sz = Math.sin(phi) * Math.sin(theta) * (radius * 0.95);
      const sy = height - crownH + Math.cos(phi) * crownH * 1.01;
      const seed = new THREE.Mesh(new THREE.SphereGeometry(0.12, 5, 5), sesameMat);
      seed.scale.set(1.4, 0.6, 0.8);
      seed.position.set(sx, sy, sz);
      group.add(seed);
      meshes.push(seed);
    }

    // 7. Vintage TGB Chalkboard Logo Seal on Bun Crown
    const tgbTex = SpriteTextures.getTGBLogoTexture();
    const tgbMat = new THREE.MeshStandardMaterial({ map: tgbTex, roughness: 0.35 });
    const logoMesh = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.42, 18), tgbMat);
    logoMesh.rotation.x = -Math.PI / 2;
    logoMesh.position.set(0, height + 0.02, 0);
    group.add(logoMesh);
    meshes.push(logoMesh);

    return { group, meshes };
  }

static createCinemaSeatRowMesh(
    width = 24.0,
    _height = 2.6,
    depth = 2.2,
    seatCount = 8,
    _quality: "low" | "medium" | "high" = "medium",
    missingSeat = -1
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "cinema_seat_row_group";
    const meshes: THREE.Mesh[] = [];

    const velvetMat = new THREE.MeshStandardMaterial({ color: 0x721c2c, roughness: 0.96 });
    const armrestMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.65 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.75, roughness: 0.35 });
    const cupMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.5 });
    const floorStepMat = new THREE.MeshStandardMaterial({ color: 0x202127, roughness: 0.88 });

    // 1. Tier Step Floor (Tread)
    const floorStep = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, depth), floorStepMat);
    floorStep.position.set(0, 0.2, 0);
    group.add(floorStep);
    meshes.push(floorStep);

    // 2. Row of plush velvet armchairs
    const seatW = (width - 1.2) / seatCount;
    for (let i = 0; i < seatCount; i++) {
      if (i === missingSeat) continue;
      const sx = -width / 2 + 0.6 + i * seatW + seatW / 2;

      // Padded velvet seat cushion
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(seatW * 0.8, 0.38, depth * 0.58), velvetMat);
      cushion.position.set(sx, 0.62, depth * 0.12);
      group.add(cushion);
      meshes.push(cushion);

      // Velvet backrest (reclined slightly)
      const backrest = new THREE.Mesh(new THREE.BoxGeometry(seatW * 0.8, 1.35, 0.34), velvetMat);
      backrest.rotation.x = -0.12;
      backrest.position.set(sx, 1.28, -depth * 0.24);
      group.add(backrest);
      meshes.push(backrest);

      // Left & Right Armrests with Cup Holders
      for (const ax of [sx - seatW * 0.44, sx + seatW * 0.44]) {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.6, depth * 0.58), armrestMat);
        arm.position.set(ax, 0.88, depth * 0.08);
        if (i % 2 === 0) {
          const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.2, 10), cupMat);
          cup.position.set(ax, 1.2, depth * 0.3);
          group.add(cup);
          meshes.push(cup);
        }
        group.add(arm);
        meshes.push(arm);
      }

      // Steel support leg
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.12), steelMat);
      leg.position.set(sx, 0.45, 0);
      group.add(leg);
      meshes.push(leg);
    }

    return { group, meshes };
  }

static createCinemaScreenMesh(
    width = 36.0,
    height = 20.0,
    depth = 3.0,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "cinema_screen_monumental_group";
    const meshes: THREE.Mesh[] = [];

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.95 });
    const screenTex = SpriteTextures.getYelmoScreenTexture();
    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTex,
      emissive: 0xffffff,
      emissiveMap: screenTex,
      emissiveIntensity: 0.65,
      roughness: 0.15
    });
    const subMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });

    // 1. Proscenium Masking Frame (Top, Bottom, Left, Right)
    const frame = new THREE.Mesh(new THREE.BoxGeometry(width + 2.0, height + 2.0, depth), frameMat);
    frame.position.set(0, height / 2, 0);
    group.add(frame);
    meshes.push(frame);

    // 2. Colossal 16:9 Cinema Projection Screen Surface
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), screenMat);
    screenMesh.position.set(0, height / 2, depth / 2 + 0.05);
    group.add(screenMesh);
    meshes.push(screenMesh);

    // 3. Sound stage / Subwoofers underneath
    const subLeft = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.2, depth * 0.8), subMat);
    subLeft.position.set(-width / 3, 1.1, depth / 2 + 0.2);
    const subRight = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.2, depth * 0.8), subMat);
    subRight.position.set(width / 3, 1.1, depth / 2 + 0.2);
    group.add(subLeft, subRight);
    meshes.push(subLeft, subRight);

    return { group, meshes };
  }

  static createVivaGymObstacleMesh(size: { x: number; y: number; z: number }, form?: unknown): THREE.Mesh {
    const shell = new THREE.MeshStandardMaterial({ color: 0x25282d, roughness: 0.68 });
    const pad = new THREE.MeshStandardMaterial({ color: 0xf47b20, roughness: 0.54 });
    if (form === "drum") {
      const drum = new THREE.CylinderGeometry(size.x / 2, size.x / 2, size.y, 16);
      return new THREE.Mesh(drum, [shell, pad, shell]);
    }
    const edge = form === "bar" ? 0.30 : 0.12;
    const geometry = new RoundedBoxGeometry(size.x, size.y, size.z, 1, Math.min(edge, size.x / 2, size.y / 2, size.z / 2));
    return new THREE.Mesh(geometry, [shell, shell, pad, shell, pad, pad]);
  }

static createVivaGymTreadmillMesh(
    width = 22.0,
    height = 4.2,
    length = 84.0,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "vivagym_treadmill_group";
    const meshes: THREE.Mesh[] = [];

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.7, roughness: 0.35 });
    const orangeMat = new THREE.MeshStandardMaterial({
      color: 0xf47b20,
      emissive: 0xf47b20,
      emissiveIntensity: 0.35,
      roughness: 0.25
    });
    const consoleMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4 });
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0xf47b20,
      emissive: 0xf47b20,
      emissiveIntensity: 0.65,
      roughness: 0.1
    });

    const beltTex = SpriteTextures.getVivaGymTexture().clone();
    beltTex.repeat.set(1, Math.max(1, Math.round(length / 18)));
    const beltMat = new THREE.MeshStandardMaterial({
      map: beltTex,
      roughness: 0.82,
      metalness: 0.1
    });

    // 1. Heavy Base Frame Chassis
    const baseChassis = new THREE.Mesh(new THREE.BoxGeometry(width, 0.8, length), frameMat);
    baseChassis.position.set(0, 0.4, 0);
    group.add(baseChassis);
    meshes.push(baseChassis);

    // 2. Textured Running Belt Deck
    const belt = new THREE.Mesh(new THREE.BoxGeometry(width * 0.88, 0.1, length * 0.96), [frameMat, frameMat, beltMat, frameMat, frameMat, frameMat]);
    belt.position.set(0, 0.85, 0);
    group.add(belt);
    meshes.push(belt);

    // 3. Safety rails and deck edges
    for (const rx of [-width / 2 + 0.4, width / 2 - 0.4]) {
      const sideRail = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, length), orangeMat);
      sideRail.position.set(rx, 0.9, 0);
      group.add(sideRail);
      meshes.push(sideRail);

      // Elevated Tubular Handrails along the sides
      const handrail = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, length * 0.9, 8), orangeMat);
      handrail.rotation.x = Math.PI / 2;
      handrail.position.set(rx, 2.4, 0);
      group.add(handrail);
      meshes.push(handrail);

      // Vertical Support Stanchions
      const stanchionCount = 8;
      for (let s = 0; s < stanchionCount; s++) {
        const sz = -length / 2 + 6.0 + (s * (length - 12.0)) / (stanchionCount - 1);
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.6, 8), frameMat);
        post.position.set(rx, 1.6, sz);
        group.add(post);
        meshes.push(post);
      }
    }

    // 4. Front High-Tech Digital Console Bridge (at Z = -length/2)
    const consoleBridge = new THREE.Mesh(new THREE.BoxGeometry(width * 0.85, 1.6, 1.8), consoleMat);
    consoleBridge.rotation.x = -0.32;
    consoleBridge.position.set(0, height - 0.8, -length / 2 + 1.2);
    group.add(consoleBridge);
    meshes.push(consoleBridge);

    // Digital Dash Screens with metrics
    for (const sx of [-4.5, 0, 4.5]) {
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.1), screenMat);
      screen.rotation.x = -0.32;
      screen.position.set(sx, height - 0.75, -length / 2 + 2.1);
      group.add(screen);
      meshes.push(screen);
    }

    return { group, meshes };
  }

  // WORLD 4 LEVEL 3 STAGE 8: ESCALERAS REPUBLICANAS (PARQUE DE LAS CRUCES)
  // Replicating the authentic monument photo with high-fidelity 3D assets
  // =========================================================================

  private static republicanFrontonTex: THREE.CanvasTexture | null = null;
  static getRepublicanFrontonTexture(): THREE.CanvasTexture {
    if (this.republicanFrontonTex) return this.republicanFrontonTex;
    if (typeof document === "undefined") {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.republicanFrontonTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Deep carmine red wall background gradient
        const grad = ctx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0, "#a81b1b");
        grad.addColorStop(0.5, "#c62828");
        grad.addColorStop(1, "#8e1515");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 256);

        // Weathered horizontal concrete mortar seams
        ctx.strokeStyle = "rgba(0, 0, 0, 0.22)";
        ctx.lineWidth = 3;
        for (let y = 36; y < 256; y += 48) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(1024, y);
          ctx.stroke();
        }

        // Mural painted text: "VIVA LA TERCERA REPUBLICA"
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = '900 58px "Impact", "Arial Black", "Montserrat", sans-serif';

        // Deep red/maroon drop outline
        ctx.fillStyle = "#4a0000";
        ctx.fillText("VIVA LA TERCERA REPUBLICA", 512 + 3, 128 + 4);

        // Dark red stencil stroke
        ctx.lineWidth = 7;
        ctx.strokeStyle = "#6b0000";
        ctx.strokeText("VIVA LA TERCERA REPUBLICA", 512, 128);

        // Bright golden yellow paint fill (matching the photo)
        ctx.fillStyle = "#ffeb3b";
        ctx.fillText("VIVA LA TERCERA REPUBLICA", 512, 128);

        // Highlight layer
        ctx.fillStyle = "#fff59d";
        ctx.font = '900 56px "Impact", "Arial Black", "Montserrat", sans-serif';
        ctx.fillText("VIVA LA TERCERA REPUBLICA", 512, 126);

        // Weathered spray speckles
        ctx.fillStyle = "rgba(255, 235, 59, 0.3)";
        for (let i = 0; i < 70; i++) {
          const px = 100 + Math.random() * 824;
          const py = 80 + Math.random() * 96;
          ctx.fillRect(px, py, 2, 2);
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      this.republicanFrontonTex = retainSharedTexture(tex);
      return tex;
    } catch {
      const dummyTex = new THREE.CanvasTexture({} as any);
      this.republicanFrontonTex = retainSharedTexture(dummyTex);
      return dummyTex;
    }
  }

  /**
   * Arched Republican Frontón with painted mural "VIVA LA TERCERA REPUBLICA"
   * Replicates the Parque de las Cruces amphitheater top crest wall from the photo.
   */
  static createRepublicanFrontonMesh(
    width = 18.0,
    height = 2.8,
    depth = 0.8,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "republican_fronton_group";
    const meshes: THREE.Mesh[] = [];

    const redMat = new THREE.MeshStandardMaterial({
      color: 0xc62828,
      roughness: 0.85,
      metalness: 0.05
    });

    const copingMat = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      roughness: 0.7,
      metalness: 0.05
    });

    const textTex = LevelBuilder.getRepublicanFrontonTexture();
    const faceMat = new THREE.MeshStandardMaterial({
      map: textTex,
      roughness: 0.8,
      metalness: 0.05
    });

    // Multi-material for front face text mural: [right, left, top, bottom, front, back]
    const centerWallMats = [redMat, redMat, copingMat, redMat, faceMat, redMat];

    // Central curved fronton arch
    const centerW = width * 0.58;
    const centerGeo = new THREE.BoxGeometry(centerW, height, depth);
    const centerMesh = new THREE.Mesh(centerGeo, centerWallMats);
    centerMesh.position.set(0, height / 2, 0);
    group.add(centerMesh);
    meshes.push(centerMesh);

    // Top coping albardilla stone
    const copingGeo = new THREE.BoxGeometry(centerW + 0.3, 0.22, depth + 0.16);
    const copingMesh = new THREE.Mesh(copingGeo, copingMat);
    copingMesh.position.set(0, height + 0.11, 0);
    group.add(copingMesh);
    meshes.push(copingMesh);

    // Left angled wing (sweeping slightly forward to match amphitheater arc)
    const wingW = width * 0.24;
    const wingH = height * 0.86;
    const leftWingGeo = new THREE.BoxGeometry(wingW, wingH, depth);
    const leftWing = new THREE.Mesh(leftWingGeo, redMat);
    const leftWingX = -centerW / 2 - (wingW / 2) * Math.cos(0.18);
    const leftWingZ = (wingW / 2) * Math.sin(0.18);
    leftWing.position.set(leftWingX, wingH / 2, leftWingZ);
    leftWing.rotation.y = 0.18;
    group.add(leftWing);
    meshes.push(leftWing);

    const leftCoping = new THREE.Mesh(new THREE.BoxGeometry(wingW + 0.2, 0.2, depth + 0.14), copingMat);
    leftCoping.position.set(leftWingX, wingH + 0.1, leftWingZ);
    leftCoping.rotation.y = 0.18;
    group.add(leftCoping);
    meshes.push(leftCoping);

    // Right angled wing
    const rightWingGeo = new THREE.BoxGeometry(wingW, wingH, depth);
    const rightWing = new THREE.Mesh(rightWingGeo, redMat);
    const rightWingX = centerW / 2 + (wingW / 2) * Math.cos(0.18);
    const rightWingZ = (wingW / 2) * Math.sin(0.18);
    rightWing.position.set(rightWingX, wingH / 2, rightWingZ);
    rightWing.rotation.y = -0.18;
    group.add(rightWing);
    meshes.push(rightWing);

    const rightCoping = new THREE.Mesh(new THREE.BoxGeometry(wingW + 0.2, 0.2, depth + 0.14), copingMat);
    rightCoping.position.set(rightWingX, wingH + 0.1, rightWingZ);
    rightCoping.rotation.y = -0.18;
    group.add(rightCoping);
    meshes.push(rightCoping);

    return { group, meshes };
  }

  /**
   * Amphitheater step bleacher replicating the photo:
   * - Tricolor paint (Red, Yellow, or Purple)
   * - Curved crescent shape (center + left/right angled wings)
   * - 3 Concrete Access Aisles (grey stairs at center and lateral flanks)
   * - Step edge lip
   */
  static createRepublicanStepMesh(
    width = 18.0,
    height = 0.8,
    depth = 2.0,
    colorHex = "#e53935",
    stepNumber = 1,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = `republican_step_${stepNumber}_group`;
    const meshes: THREE.Mesh[] = [];

    const resolvedColor = colorHex === "rojo" ? 0xe53935 : colorHex === "amarillo" ? 0xffeb3b : colorHex === "morado" ? 0x7b1fa2 : colorHex;
    const seatMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(resolvedColor),
      roughness: 0.6,
      metalness: 0.08
    });

    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x90a4ae,
      roughness: 0.85,
      metalness: 0.05
    });

    const darkConcreteMat = new THREE.MeshStandardMaterial({
      color: 0x607d8b,
      roughness: 0.9,
      metalness: 0.05
    });

    const centerW = width * 0.58;
    const wingW = width * 0.23;
    const wingAngle = 0.14; // amphitheater arc

    // Center bleacher seating block
    const centerGeo = new THREE.BoxGeometry(centerW, height, depth);
    const centerMesh = new THREE.Mesh(centerGeo, seatMat);
    centerMesh.position.set(0, height / 2, 0);
    group.add(centerMesh);
    meshes.push(centerMesh);

    // Center Concrete Access Stairway (cutting through the middle of the tier)
    const centerAisleW = Math.min(1.4, centerW * 0.12);
    const centerAisleGeo = new THREE.BoxGeometry(centerAisleW, height + 0.02, depth + 0.02);
    const centerAisle = new THREE.Mesh(centerAisleGeo, concreteMat);
    centerAisle.position.set(0, (height + 0.02) / 2, 0);
    group.add(centerAisle);
    meshes.push(centerAisle);

    // Left and Right Concrete Access Aisles (stairs between bleachers)
    const lateralAisleW = Math.min(1.1, centerW * 0.09);
    const aisleOffset = centerW * 0.34;

    const leftAisle = new THREE.Mesh(new THREE.BoxGeometry(lateralAisleW, height + 0.02, depth + 0.02), concreteMat);
    leftAisle.position.set(-aisleOffset, (height + 0.02) / 2, 0);
    group.add(leftAisle);
    meshes.push(leftAisle);

    const rightAisle = new THREE.Mesh(new THREE.BoxGeometry(lateralAisleW, height + 0.02, depth + 0.02), concreteMat);
    rightAisle.position.set(aisleOffset, (height + 0.02) / 2, 0);
    group.add(rightAisle);
    meshes.push(rightAisle);

    // Left curved wing
    const leftWingGeo = new THREE.BoxGeometry(wingW, height, depth);
    const leftWing = new THREE.Mesh(leftWingGeo, seatMat);
    const leftWingX = -centerW / 2 - (wingW / 2) * Math.cos(wingAngle);
    const leftWingZ = (wingW / 2) * Math.sin(wingAngle);
    leftWing.position.set(leftWingX, height / 2, leftWingZ);
    leftWing.rotation.y = wingAngle;
    group.add(leftWing);
    meshes.push(leftWing);

    // Right curved wing
    const rightWingGeo = new THREE.BoxGeometry(wingW, height, depth);
    const rightWing = new THREE.Mesh(rightWingGeo, seatMat);
    const rightWingX = centerW / 2 + (wingW / 2) * Math.cos(wingAngle);
    const rightWingZ = (wingW / 2) * Math.sin(wingAngle);
    rightWing.position.set(rightWingX, height / 2, rightWingZ);
    rightWing.rotation.y = -wingAngle;
    group.add(rightWing);
    meshes.push(rightWing);

    // Step front riser lip trim
    const lipGeo = new THREE.BoxGeometry(centerW, Math.min(0.08, height * 0.15), 0.06);
    const lipMesh = new THREE.Mesh(lipGeo, darkConcreteMat);
    lipMesh.position.set(0, height - 0.04, depth / 2 + 0.03);
    group.add(lipMesh);
    meshes.push(lipMesh);

    return { group, meshes };
  }

  /**
   * Lateral curved stepped retaining wall flanking the amphitheater stands (from photo).
   */
  static createAmphitheaterWingMesh(
    sideOrWidth: "left" | "right" | number = "left",
    lengthOrHeight = 46.0,
    heightOrLength = 11.0,
    qualityOrIsLeft: "low" | "medium" | "high" | boolean = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    let side: "left" | "right" = "left";
    let length = 46.0;
    let height = 11.0;
    let isLegacy = false;

    if (typeof sideOrWidth === "number") {
      isLegacy = true;
      height = lengthOrHeight;
      length = heightOrLength;
      side = qualityOrIsLeft === false ? "right" : "left";
    } else {
      side = sideOrWidth;
      length = lengthOrHeight;
      height = heightOrLength;
    }

    const group = new THREE.Group();
    group.name = isLegacy ? "amphitheater_wing_group" : `amphitheater_wing_${side}_group`;
    const meshes: THREE.Mesh[] = [];

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x90a4ae,
      roughness: 0.85,
      metalness: 0.05
    });

    const copingMat = new THREE.MeshStandardMaterial({
      color: 0xdce775,
      roughness: 0.7,
      metalness: 0.05
    });

    const segmentCount = 12;
    const segLen = length / segmentCount;
    const dir = side === "left" ? 1 : -1;

    for (let i = 0; i < segmentCount; i++) {
      const t = i / (segmentCount - 1);
      const segH = THREE.MathUtils.lerp(height, 0.8, t);
      const segZ = -length / 2 + (i + 0.5) * segLen;
      const segX = dir * Math.sin(t * Math.PI * 0.45) * 3.5;

      const segGeo = new THREE.BoxGeometry(1.6, segH, segLen * 0.98);
      const segMesh = new THREE.Mesh(segGeo, stoneMat);
      segMesh.position.set(segX, segH / 2, segZ);
      group.add(segMesh);
      meshes.push(segMesh);

      const copGeo = new THREE.BoxGeometry(1.9, 0.2, segLen);
      const copMesh = new THREE.Mesh(copGeo, copingMat);
      copMesh.position.set(segX, segH + 0.1, segZ);
      group.add(copMesh);
      meshes.push(copMesh);
    }

    return { group, meshes };
  }

  /**
   * Rustic wooden post-and-rail barrier along the lake promenade (from photo).
   */
  static createLakeWoodenRailingMesh(
    length = 38.0,
    height = 1.0,
    _depthOrQuality: "low" | "medium" | "high" | number = "medium",
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "lake_wooden_railing_group";
    const meshes: THREE.Mesh[] = [];

    const timberMat = new THREE.MeshStandardMaterial({
      color: 0x5d4037,
      roughness: 0.85,
      metalness: 0.02
    });

    const postCount = Math.max(4, Math.floor(length / 2.8));
    const postGeo = new THREE.BoxGeometry(0.18, height, 0.18);

    for (let p = 0; p <= postCount; p++) {
      const px = -length / 2 + (p * length) / postCount;
      const post = new THREE.Mesh(postGeo, timberMat);
      post.position.set(px, height / 2, 0);
      group.add(post);
      meshes.push(post);
    }

    const railGeo = new THREE.BoxGeometry(length, 0.12, 0.12);
    const topRail = new THREE.Mesh(railGeo, timberMat);
    topRail.position.set(0, height - 0.08, 0);
    group.add(topRail);
    meshes.push(topRail);

    const midRail = new THREE.Mesh(railGeo, timberMat);
    midRail.position.set(0, height * 0.52, 0);
    group.add(midRail);
    meshes.push(midRail);

    return { group, meshes };
  }

  /**
   * Tall Mediterranean Cypress (Cupressus sempervirens) from the photo behind the amphitheater.
   */
  static createCrucesCypressMesh(
    height = 9.0,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    group.name = "cruces_cypress_group";
    const meshes: THREE.Mesh[] = [];

    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x4e342e,
      roughness: 0.9,
      metalness: 0.05
    });

    const cypressFoliageMat1 = new THREE.MeshStandardMaterial({
      color: 0x1b381e,
      roughness: 0.85,
      metalness: 0.02
    });

    const cypressFoliageMat2 = new THREE.MeshStandardMaterial({
      color: 0x244b28,
      roughness: 0.8,
      metalness: 0.02
    });

    const trunkH = height * 0.22;
    const trunkGeo = new THREE.CylinderGeometry(0.22, 0.32, trunkH, 7);
    trunkGeo.translate(0, trunkH / 2, 0);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    group.add(trunk);
    meshes.push(trunk);

    const tiers = [
      { y: height * 0.15, rBottom: 0.95, rTop: 0.85, h: height * 0.26, mat: cypressFoliageMat1 },
      { y: height * 0.36, rBottom: 0.88, rTop: 0.72, h: height * 0.28, mat: cypressFoliageMat2 },
      { y: height * 0.58, rBottom: 0.74, rTop: 0.48, h: height * 0.26, mat: cypressFoliageMat1 },
      { y: height * 0.78, rBottom: 0.50, rTop: 0.08, h: height * 0.24, mat: cypressFoliageMat2 }
    ];

    for (const tier of tiers) {
      const coneGeo = new THREE.CylinderGeometry(tier.rTop, tier.rBottom, tier.h, 8);
      coneGeo.translate(0, tier.h / 2, 0);
      const cone = new THREE.Mesh(coneGeo, tier.mat);
      cone.position.y = tier.y;
      group.add(cone);
      meshes.push(cone);
    }

    return { group, meshes };
  }

}



