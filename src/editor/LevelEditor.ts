import {createConcertModel,concertLift} from "../levels/world-01/ConcertModel";
import {AURORA_DECORATIONS} from '../levels/world-08/AuroraRoutes';
import {OSLO_DECORATIONS} from '../levels/world-08/OsloRoutes';
import {FJORD_DECORATIONS} from '../levels/world-08/FjordRoutes';
import {NORWAY_DECORATIONS} from '../levels/world-08/NorwayRoutes';
import {previewNorwayModel} from '../levels/world-08/NorwayModels';
import {stabilizeNeonSurfaces} from '../levels/world-07/NeonSurfaces';
import * as THREE from "three";
import {stageStartYaw} from '../rendering/StageHeading';
import {createSpawnMarker,SPAWN_SELECTION} from './SpawnMarker';
import {stageStorage as localStorage,retireStageHistory} from '../storage/StageStorage';
import {bikeWheelPose} from '../levels/BikeCourse';
import type { LevelData, LevelObjectData,Vector3Data } from "../levels/LevelTypes";
import { LevelGenerator } from "../levels/LevelGenerator";
import { getBakedStage } from "../levels/BakedStages";
import { WORLDS, getWorldById, getWorldBGMTrack } from "../levels/WorldDefinitions";
import { SpriteTextures, type WorldBlockSet } from "../rendering/SpriteTextures";
import {CollectibleVisual} from '../rendering/CollectibleVisual';
import { LevelBuilder } from "../levels/LevelBuilder";
import { applyRequestedStageUpdates, sampleVivaGymObstacle } from "../levels/RequestedStageUpdates";
import { getAsturiasFinish } from "../levels/world-05/AsturiasModels";
import { previewOviedoActor } from "../levels/world-05/OviedoActions";
import { previewCangasActor } from "../levels/world-05/CangasActions";
import { previewSellaActor } from "../levels/world-05/SellaModels";
import type { SellaWater } from "../levels/world-05/SellaWater";
import {previewCovadongaActor} from "../levels/world-05/CovadongaModels";
import {previewLondonActor} from "../levels/world-06/LondonModels";
import {previewMuseumActor} from "../levels/world-06/MuseumModels";
import {MUSEUM_ANIMALS} from "../levels/world-06/MuseumRoutes";
import {OXFORD_DECORATIONS} from "../levels/world-06/OxfordRoutes";
import {BIG_BEN_DECORATIONS} from '../levels/world-06/BigBenRoutes';
import {KYOTO_DECORATIONS} from '../levels/world-07/KyotoRoutes';
import {previewKyotoKatana} from '../levels/world-07/KyotoModels';
import {NARA_DECORATIONS} from '../levels/world-07/NaraRoutes';
import {previewNaraModel} from '../levels/world-07/NaraModels';
import {previewOsakaModel} from '../levels/world-07/OsakaModels';
import {TOKYO_DECORATIONS} from '../levels/world-07/TokyoRoutes';
import {previewTokyoModel} from '../levels/world-07/TokyoModels';
import {OSAKA_DECORATIONS} from '../levels/world-07/OsakaRoutes';
import {previewBigBenActor} from '../levels/world-06/BigBenModels';
import {previewOxfordActor,createOxfordSkyGoal} from "../levels/world-06/OxfordModels";
import {LONDON_DECORATIONS,CHRISTMAS_DECORATIONS} from "../levels/world-06/level-01-stages";
import {buildRiverFrames,sampleSellaRiver,type RiverFrame} from "../levels/world-05/SellaRiver";
import { AudioManager } from "../audio/AudioManager";

export interface EditorCallbacks {
  onPlaytest: (levelData: LevelData) => void;
  onExit: () => void;
  onEnvironmentChange?: (world: number, level: number) => void;
}

export interface StageSnapshot {
  id: string;
  timestamp: number;
  dateStr: string;
  name: string;
  data: LevelData;
}

export class LevelEditor {
  private readonly container: HTMLElement;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly originalCameraFar:number;
  private readonly editorGroup = new THREE.Group();
  private covadongaPreviewRoad?:{points:Vector3Data[];frames:RiverFrame[];width:number};
  private readonly audio = AudioManager.getInstance();

  private levelData: LevelData;
  private currentWorld = 1;
  private currentLevel = 1;
  private currentStage = 1;

  private selectedObjectIndex = -1;
  private spawnHeading=0;
  private originalPreview=false;
  private isOrbiting = false;
  private previousMouseX = 0;
  private previousMouseY = 0;
  private orbitYaw = 0.6;
  private orbitPitch = 0.5;
  private orbitDistance = 35;
  private orbitTarget = new THREE.Vector3(0, 0, -10);

  private previewingBGM: string | null = null;
  private skyboxTexture: THREE.CanvasTexture | null = null;

  // Moving platforms in editor for live preview
  private movingObjects: Array<{
    obj: LevelObjectData;
    group: THREE.Object3D;
    basePosition: THREE.Vector3;
    baseRotation: THREE.Euler;
  }> = [];
  private editorAnimTime = 0;

  // Store window listener cleanup functions
  private cleanupListeners: Array<() => void> = [];

  constructor(
    root: HTMLElement,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    private readonly callbacks: EditorCallbacks,
    initialWorld = 1,
    initialLevel = 1,
    initialStage = 1
  ) {
    this.scene = scene;
    this.camera = camera;
    this.originalCameraFar=camera.far;
    this.camera.far=Math.max(camera.far,6000);this.camera.updateProjectionMatrix();
    this.currentWorld = initialWorld;
    this.currentLevel = initialLevel;
    this.currentStage = initialStage;

    LevelEditor.syncOfficialStagesIfNeeded();
    this.levelData = applyRequestedStageUpdates(
      this.getOrUpdateStageData(this.currentWorld, this.currentLevel, this.currentStage),
      this.currentWorld,
      this.currentLevel,
      this.currentStage
    );
    this.frameAsturiasStage();

    // Apply level sky/panorama background
    this.applyEditorBackground(
      this.levelData.world || this.currentWorld,
      this.levelData.level || this.currentLevel
    );

    // Create editor UI overlay
    this.container = document.createElement("div");
    this.container.className = "editor-ui";
    root.appendChild(this.container);

    this.scene.add(this.editorGroup);

    this.setupOrbitControls();
    this.setupKeyboardShortcuts();
    this.render3DObjects();
    this.renderUI();
  }

  getCurrentWorld(): number {
    return this.currentWorld;
  }

  private frameAsturiasStage(): void {
    if(this.currentWorld===7&&(this.currentLevel===2||this.currentLevel===3||this.currentLevel===4)) {
      const box=new THREE.Box3();
      for(const obj of this.levelData.objects){box.expandByPoint(new THREE.Vector3(obj.position.x,obj.position.y,obj.position.z));const points=obj.properties?.points as {x:number;y:number;z:number}[]|undefined;if(points)for(const p of points)box.expandByPoint(new THREE.Vector3(p.x,p.y,p.z));}
      box.getCenter(this.orbitTarget);this.orbitDistance=Math.max(95,box.getSize(new THREE.Vector3()).length()*1.1);this.orbitPitch=.8;this.orbitYaw=.3;return;
    }
    if(this.currentWorld===7&&this.currentLevel===1) {
      const points=this.levelData.objects.find(o=>o.properties?.subType==='kyoto_path')?.properties?.points as {x:number;y:number;z:number}[]|undefined;
      if(points?.length) {
        const box=new THREE.Box3().setFromPoints(points.map(p=>new THREE.Vector3(p.x,p.y,p.z)));
        box.getCenter(this.orbitTarget);this.orbitDistance=Math.max(95,box.getSize(new THREE.Vector3()).length()*1.3);
        this.orbitYaw=.3;this.orbitPitch=.8;
      }
      return;
    }
    if(this.currentWorld===6&&this.currentLevel===2) {
      const floor=this.levelData.objects.filter(o=>o.type==="platform"||o.type==="goal"),box=new THREE.Box3();
      for(const o of floor) {box.expandByPoint(new THREE.Vector3(o.position.x-o.scale.x/2,o.position.y,o.position.z-o.scale.z/2));box.expandByPoint(new THREE.Vector3(o.position.x+o.scale.x/2,o.position.y,o.position.z+o.scale.z/2));}
      if(this.currentStage===10) {this.orbitTarget.set(0,3,-55);this.orbitDistance=140;}
      else if(box.isEmpty()) {this.orbitTarget.copy(this.levelData.spawn);this.orbitTarget.z-=35;this.orbitDistance=130;}
      else {box.getCenter(this.orbitTarget);this.orbitDistance=Math.max(95,box.getSize(new THREE.Vector3()).length()*1.1);}
      this.orbitPitch=.8;this.orbitYaw=.35;this.camera.far=Math.max(this.camera.far,3000);this.camera.updateProjectionMatrix();return;
    }
    if(this.currentWorld===6&&this.currentLevel===1) {
      const span=this.currentStage===3 ? 370:this.currentStage===6 ? 130:this.currentStage===9 ? 170:50;
      this.orbitTarget.copy(this.levelData.spawn);this.orbitTarget.z-=span*.4;
      this.orbitDistance=this.currentStage===2 ? 210:Math.max(65,span*1.15);
      this.orbitPitch=.7;this.orbitYaw=.35;this.camera.far=Math.max(this.camera.far,2000);this.camera.updateProjectionMatrix();return;
    }
    if (this.currentWorld !== 5 || this.currentLevel > 4) return;
    const stage = this.currentStage;
    if(this.currentLevel===4) {
      const points=this.levelData.objects.find(o=>["asturias_cov_road","asturias_cov_mine"].includes(String(o.properties?.subType)))?.properties?.points as {x:number;y:number;z:number}[]|undefined;
      if(points?.length) {
        const box=new THREE.Box3().setFromPoints(points.slice(0,stage===6 ? 40:points.length).map(p=>new THREE.Vector3(p.x,p.y,p.z)));
        box.getCenter(this.orbitTarget);const size=box.getSize(new THREE.Vector3());this.orbitDistance=Math.max(90,Math.max(size.x,size.y,size.z)*1.25);
      } else {this.orbitTarget.copy(this.levelData.spawn);this.orbitDistance=stage===9 ? 290:stage===8 ? 95:110;}
      this.orbitYaw=.35;this.orbitPitch=.7;this.camera.far=Math.max(this.camera.far,3000);this.camera.updateProjectionMatrix();return;
    }
    if(this.currentLevel===3) {
      const points=this.levelData.objects.find(object=>object.properties?.subType==="asturias_sella_river")?.properties?.points as {x:number;y:number;z:number}[]|undefined;
      if(points?.length) {
        const limit=stage===10 ? 45:points.length;
        const selected=points.slice(0,limit),box=new THREE.Box3().setFromPoints(selected.map(p=>new THREE.Vector3(p.x,p.y,p.z)));
        box.getCenter(this.orbitTarget);const size=box.getSize(new THREE.Vector3());
        this.orbitDistance=Math.max(90,Math.max(size.x,size.y,size.z)*1.3);
        this.orbitYaw=.42;this.orbitPitch=.72;
      }
      return;
    }
    if (this.currentLevel === 2) {
      const overview = [
        [3,31,-92,218], [0,3,-23,118], [2,1,-20,81], [0,1,-20,81], [0,2,0,52],
        [0,11,0,47], [0,15,-41,122], [0,19,2,63], [0,-1,3,72], [7,11,24,145]
      ][stage - 1];
      if (overview) {
        const [x,y,z,distance] = overview;
        this.orbitTarget.set(x,y,z);
        this.orbitDistance = distance;
        this.orbitYaw = .46;
        this.orbitPitch = .64;
      }
      return;
    }
    this.orbitTarget.set(stage === 2 ? 10 : 0, stage === 2 ? 34 : stage === 8 ? 10 : 0,
      stage === 2 ? -73 : stage === 8 ? -27 : stage === 10 ? -26 : stage === 3 || stage === 9 ? -21 : -8);
    this.orbitDistance = stage === 2 ? 177 : stage === 10 ? 104 : stage === 3 || stage === 6 || stage === 8 || stage === 9 ? 78 : 49;
    this.orbitYaw = 0.45;
    this.orbitPitch = 0.64;
  }

  getCurrentLevel(): number {
    return this.currentLevel;
  }

  getCurrentStage(): number {
    return this.currentStage;
  }

  getLevelData(): LevelData {
    return this.levelData;
  }

  private applyEditorBackground(world: number, level: number): void {
    // Notify Game and SceneManager to wrap the 3D world with the matching panorama skydome & lighting
    this.callbacks.onEnvironmentChange?.(world, level);
    this.scene.background = null;
  }

  private setupOrbitControls(): void {
    let downX = 0;
    let downY = 0;
    let isClickCandidate = false;

    const onMouseDown = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement).closest(".editor-panel") ||
        (e.target as HTMLElement).closest(".editor-header") ||
        (e.target as HTMLElement).closest(".modal-backdrop") ||
        (e.target as HTMLElement).closest(".editor-toast")
      ) {
        return;
      }
      this.isOrbiting = true;
      this.previousMouseX = e.clientX;
      this.previousMouseY = e.clientY;
      downX = e.clientX;
      downY = e.clientY;
      isClickCandidate = e.button === 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (this.isOrbiting) {
        const dx = e.clientX - this.previousMouseX;
        const dy = e.clientY - this.previousMouseY;
        this.previousMouseX = e.clientX;
        this.previousMouseY = e.clientY;

        if (Math.hypot(e.clientX - downX, e.clientY - downY) > 5) {
          isClickCandidate = false;
        }

        this.orbitYaw -= dx * 0.008;
        this.orbitPitch = Math.max(0.1, Math.min(Math.PI / 2.1, this.orbitPitch + dy * 0.008));
        this.updateCameraTransform();
      } else {
        if (
          (e.target as HTMLElement).closest(".editor-panel") ||
          (e.target as HTMLElement).closest(".editor-header") ||
          (e.target as HTMLElement).closest(".modal-backdrop") ||
          (e.target as HTMLElement).closest(".editor-toast")
        ) {
          document.body.style.cursor = "default";
          return;
        }
        const hasObj = this.checkObjectUnderCursor(e.clientX, e.clientY);
        document.body.style.cursor = hasObj ? "pointer" : "default";
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      this.isOrbiting = false;
      document.body.style.cursor = "default";

      if (
        (e.target as HTMLElement).closest(".editor-panel") ||
        (e.target as HTMLElement).closest(".editor-header") ||
        (e.target as HTMLElement).closest(".modal-backdrop") ||
        (e.target as HTMLElement).closest(".editor-toast")
      ) {
        return;
      }

      if (isClickCandidate && Math.hypot(e.clientX - downX, e.clientY - downY) < 6) {
        this.handleClickRaycast(e.clientX, e.clientY);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (
        (e.target as HTMLElement).closest(".editor-panel") ||
        (e.target as HTMLElement).closest(".modal-backdrop") ||
        (e.target as HTMLElement).closest(".editor-header")
      ) {
        return;
      }
      const sella=this.currentWorld===5 && this.currentLevel===3;
      this.orbitDistance = Math.max(8, Math.min(sella ? 3000:120, this.orbitDistance + e.deltaY * (sella ? Math.max(.04,this.orbitDistance*.0009):.04)));
      this.updateCameraTransform();
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("wheel", onWheel, { passive: true });

    this.cleanupListeners.push(
      () => window.removeEventListener("mousedown", onMouseDown),
      () => window.removeEventListener("mousemove", onMouseMove),
      () => window.removeEventListener("mouseup", onMouseUp),
      () => window.removeEventListener("wheel", onWheel),
      () => { document.body.style.cursor = "default"; }
    );

    this.updateCameraTransform();
  }

  private checkObjectUnderCursor(clientX: number, clientY: number): boolean {
    const mouse = new THREE.Vector2(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.editorGroup.children, true);
    for (const hit of intersects) {
      let cur: THREE.Object3D | null = hit.object;
      while (cur && cur !== this.editorGroup) {
        if (typeof cur.userData?.objectIndex === "number") {
          return true;
        }
        cur = cur.parent;
      }
    }
    return false;
  }

  private handleClickRaycast(clientX: number, clientY: number): void {
    const mouse = new THREE.Vector2(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.editorGroup.children, true);

    for (const hit of intersects) {
      let cur: THREE.Object3D | null = hit.object;
      while (cur && cur !== this.editorGroup) {
        if (typeof cur.userData?.objectIndex === "number") {
          const idx = cur.userData.objectIndex;
          if (idx === SPAWN_SELECTION || (idx >= 0 && idx < this.levelData.objects.length)) {
            this.selectObject(idx);
            return;
          }
        }
        cur = cur.parent;
      }
    }

    // Clicked empty space: deselect
    this.selectObject(-1);
  }

  selectObject(idx: number): void {
    if (this.selectedObjectIndex === idx) return;
    this.selectedObjectIndex = idx;
    this.render3DObjects();
    this.renderUI();
    if (idx >= 0 || idx===SPAWN_SELECTION) {
      const el = this.container.querySelector(`.object-item[data-idx="${idx}"]`);
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  private setupKeyboardShortcuts(): void {
    const onKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl instanceof HTMLSelectElement;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        this.saveCurrentLevel();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        this.duplicateSelectedObject();
        return;
      }

      if (!isTyping) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (this.selectedObjectIndex >= 0 && this.selectedObjectIndex < this.levelData.objects.length) {
            e.preventDefault();
            this.deleteSelectedObject();
          }
        } else if (e.key.toLowerCase() === "f") {
          if (this.selectedObjectIndex >= 0 && this.selectedObjectIndex < this.levelData.objects.length) {
            e.preventDefault();
            const obj = this.levelData.objects[this.selectedObjectIndex];
            this.orbitTarget.set(obj.position.x, obj.position.y, obj.position.z);
            this.updateCameraTransform();
          }
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    this.cleanupListeners.push(() => window.removeEventListener("keydown", onKeyDown));
  }

  private updateCameraTransform(): void {
    const x = this.orbitTarget.x + this.orbitDistance * Math.sin(this.orbitYaw) * Math.cos(this.orbitPitch);
    const y = this.orbitTarget.y + this.orbitDistance * Math.sin(this.orbitPitch);
    const z = this.orbitTarget.z + this.orbitDistance * Math.cos(this.orbitYaw) * Math.cos(this.orbitPitch);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.orbitTarget);
  }

  private getObjectVariantInfo(obj: LevelObjectData): {
    badge: string;
    title: string;
    description: string;
    isCustom: boolean;
  } {
    const v = (obj.properties?.variant as string) || (obj.properties?.movementType as string);
    const sub = (obj.properties?.subType as string) || (obj.properties?.stallType as string) || (obj.properties?.shopType as string);
    const shape = obj.properties?.shape as string;
    if(sub?.startsWith('aurora_')) {const title=AURORA_DECORATIONS.find(([id])=>id===sub.slice(7))?.[1]??'Auroras';return {badge:title,title,description:'Mecanismos y paisaje del final ártico. La vista previa reproduce su movimiento.',isCustom:true};}
    if(sub?.startsWith('oslo_')) {const title=OSLO_DECORATIONS.find(([id])=>id===sub.slice(5))?.[1]??'Oslo';return {badge:title,title,description:'Arquitectura y mecanismos de Oslo. La vista previa reproduce su movimiento.',isCustom:true};}
    if(sub?.startsWith('fjord_')) {const title=FJORD_DECORATIONS.find(([id])=>id===sub.slice(6))?.[1]??'Fiordos';return {badge:title,title,description:'Paisaje noruego y mecanismos de los fiordos. La vista previa reproduce su movimiento.',isCustom:true};}
    if(sub?.startsWith('norway_')) {const title=NORWAY_DECORATIONS.find(([id])=>id===sub.slice(7))?.[1].replace('Noruega · ','')??'Pasarela nevada';return {badge:title,title,description:obj.properties?.norwayAction?'Elemento móvil de Noruega. La vista previa reproduce su movimiento durante la partida.':'Paisaje y estructuras de la montaña noruega.',isCustom:true};}
    if(sub?.startsWith('tokyo_')) {
      const title=TOKYO_DECORATIONS.find(([id])=>id===sub.slice(6))?.[1].replace('Tokio · ','')??'Pasarela de Tokio';
      return {badge:title,title,description:'Elemento de Tokio. La vista previa comparte el movimiento y la geometría utilizados durante la partida.',isCustom:true};
    }
    if(sub?.startsWith('osaka_')) {
      const kind=sub.slice(6),title=OSAKA_DECORATIONS.find(([id])=>id===kind)?.[1].replace('Osaka · ','')??'Pasarela de neón';
      const descriptions:Record<string,string>={roller:'Rodillo transitable que gira sobre su eje. Su superficie desplaza lateralmente la bola.',ninja_blade:'Hoja suspendida con pausa visible, corte rápido y retorno lento. Un golpe impulsa la bola.',sushi_belt:'Mostrador japonés con platos de sushi que circulan por la cinta.',ramen_stall:'Puesto tradicional con cuenco, fideos, faroles y vapor.',castle:'Castillo de Osaka con base de piedra, muros blancos, tejados verdes y remates dorados.',dome:'Plataforma abombada y transitable para crear pasos de precisión.',path:'Pasarela continua de Osaka con bordes luminosos.'};
      return {badge:title,title,description:descriptions[kind]??'Decoración japonesa del distrito nocturno de Osaka.',isCustom:true};
    }

    if (v === "casino_roulette") {
      return {
        badge: "🎰 Ruleta 3D",
        title: "Ruleta de Casino Interactiva",
        description: "Plataforma giratoria con rueda de casino, divisiones roja/negra y orificio en el número 0 que actúa como trampilla para descender a la meta.",
        isCustom: true
      };
    }
    if (v === "limp_kicker" || v === "cojo") {
      return {
        badge: "🦵 Cojo",
        title: "Muñeco Cojo con Muletas y Escayola (Nivel Cojera)",
        description: "Personaje con pierna escayolada y muletas que oscila y patea a los jugadores cuando se aproximan.",
        isCustom: true
      };
    }
    if (v === "yacht") {
      return {
        badge: "🛥️ Yate 3D",
        title: "Yate de Lujo de Puerto Deportivo",
        description: "Embarcación de recreo de gran escala con casco en V, cubierta de teca, cabina panorámica con cristales tintados y flybridge superior navegable.",
        isCustom: true
      };
    }
    if (v === "market_stall") {
      const typeLabel = sub ? sub.toUpperCase() : "GENERAL";
      return {
        badge: "🎪 Puesto 3D",
        title: `Puesto de Mercadillo 3D (${typeLabel})`,
        description: "Puesto de mercado artesanal con tarima de madera, 4 postes, toldo de lona a rayas, farolillos cálidos y exposición de productos en 3D.",
        isCustom: true
      };
    }
    if (v === "beach_kiosk") {
      return {
        badge: "🏖️ Kiosko Playa",
        title: "Kiosko de Playa / Chiringuito del Sol 3D",
        description: "Chiringuito playero con tarima de madera, toldo de rayas azules y blancas, vitrina de helados, refrescos, expositor de gafas de sol y farolillos cálidos.",
        isCustom: true
      };
    }
    if (v === "hippie_stall") {
      const isGoal = Boolean(obj.properties?.isGoalStall);
      return {
        badge: isGoal ? "☮️ Puesto Meta" : "☮️ Puesto Hippie",
        title: isGoal ? "Puesto Hippie Secreto (Oculta la Meta) 3D" : "Puesto de Mercadillo Hippie 3D",
        description: isGoal
          ? "Puesto artesano hippie con arco dorado místico y gemas que alberga en su interior el Portal de Meta secreto."
          : "Puesto artesanal con toldo tie-dye, atrapasueños, bandejas de cristales de cuarzo, incienso aromático y guitarra española.",
        isCustom: true
      };
    }
    if (v === "giant_umbrella") {
      return {
        badge: "⛱️ Sombrilla 3D",
        title: "Sombrilla Gigante Giratoria 3D",
        description: "Gran sombrilla playera cónica de gajos de colores que rota continuamente en el mar mientras el jugador busca alcanzar la meta exterior.",
        isCustom: true
      };
    }
    if (v === "beach_towel" || v === "towel_wave") {
      return {
        badge: "🌊 Toalla Olas",
        title: "Toalla de Playa con Oleaje Ondulante 3D",
        description: "Toalla gigante de rizo a rayas con flecos en los extremos que oscila y cabecea simulando olas marinas en contra del jugador.",
        isCustom: true
      };
    }
    if (v === "wave_pusher") {
      return {
        badge: "🌊 Ola Marina",
        title: "Ola Marina Empujadora 3D",
        description: "Cresta de ola con espuma blanca que barre transversalmente empujando la bola hacia el agua y el vacío.",
        isCustom: true
      };
    }
    if (v === "shop" || v === "store") {
      const shopLabel = sub ? sub.toUpperCase() : "COMERCIO";
      return {
        badge: "🏬 Tienda 3D",
        title: `Tienda Comercial 3D (${shopLabel})`,
        description: "Local comercial cerrado con suelo de gres, paredes, escaparates de cristal, letrero luminoso con logotipo y entrada abierta para entrar.",
        isCustom: true
      };
    }
    if (v === "emt_bus_35") {
      return {
        badge: "🚌 Autobús EMT Línea 35",
        title: "Autobús EMT Madrid Línea 35 (Scania N280UB GNC)",
        description: "Autobús oficial de la EMT de Madrid en color azul con letrero LED '35 CARABANCHEL ALTO', domo superior blanco GNC, cristales transparentes, asientos interiores, 2s de espera al arrancar y techo abierto para caída del jugador.",
        isCustom: true
      };
    }
    if (v === "emt_bus_34") {
      return {
        badge: "🚌 Autobús EMT Línea 34",
        title: "Autobús EMT Madrid Línea 34 (Las Águilas)",
        description: "Autobús oficial de la EMT de Madrid en color azul con letrero LED '34 LAS AGUILAS', calle estrecha San Melitón con edificios amarillos y naranjas y cámara cinematográfica.",
        isCustom: true
      };
    }
    if (v === "clapping_gloves") {
      return {
        badge: "🧤 Guantes Galway",
        title: "Guantes Gigantes Verdes Clapping (Galway)",
        description: "Dos guantes gigantes verdes aplaudiendo sobre la plataforma de pizarra de clase escolar que mandan volando al jugador al recibir el aplauso.",
        isCustom: true
      };
    }
    if (v === "residential_elevator_2f") {
      return {
        badge: "🛗 Ascensor 2 Plantas",
        title: "Ascensor Residencial 2 Plantas (13 2ºB)",
        description: "Ascensor residencial de 2 paradas que sube de planta baja a 1ª planta y 2ª planta con puerta al piso 13 2ºB.",
        isCustom: true
      };
    }
    if (v === "madrid_duo_132b") {
      return {
        badge: "👥 Pareja 13 2ºB",
        title: "Hombre del Real Madrid y Mujer Vestido de Tigre",
        description: "Hombre con equipación del Real Madrid y mujer con vestido vintage de tigre que empujan al jugador rítmicamente en el umbral.",
        isCustom: true
      };
    }
    if (v === "continuous_tongue") {
      return {
        badge: "👅 Lengua Continua Rony",
        title: "Lengua Rosa Serpenteada Continua (Rony)",
        description: "Lengua canina continua de 39m con labios curvados elevados, textura orgánica con papilas y entrada a la boca.",
        isCustom: true
      };
    }
    if (v === "yorkshire_rony_statue") {
      return {
        badge: "🐶 Yorkshire Rony",
        title: "Estatua Monumental de Rony el Yorkshire",
        description: "Perrito Yorkshire con lengua serpenteada de más de 30m de longitud, entrada por la boca y salto final a la meta.",
        isCustom: true
      };
    }
    if (v === "floo_fireplace") {
      return {
        badge: "🔥 Chimenea Polvos Floo",
        title: "Chimenea de Ladrillo con Polvos Floo (Pao)",
        description: "Chimenea mágica estilo Harry Potter; permanecer quieto 5 segundos desata los polvos floo y teletransporta al callejón elevado.",
        isCustom: true
      };
    }
    if (v === "membrillo_cube") {
      return {
        badge: "🍮 Membrillo Bumper",
        title: "Dado de Membrillo Bumper (Alba de Tormes)",
        description: "Parachoques cúbico con textura de dulce de membrillo y rebote ultraenérgico que cubre la plataforma circular.",
        isCustom: true
      };
    }
    if (v === "pokemon_booster_wall") {
      return {
        badge: "🃏 Sobre Pokémon",
        title: "Muro de Sobres Pokémon (Carrefour)",
        description: "Muro de laberinto formado por sobres de cartas Pokémon con brillo holográfico y bordes metalizados.",
        isCustom: true
      };
    }
    if (v === "pirate_ship") {
      return {
        badge: "🏴‍☠️ Barco Pirata",
        title: "Estructura de Barco Pirata (Parque Pirata)",
        description: "Barco pirata de madera con mástiles, velas negras con calavera y puente de mando.",
        isCustom: true
      };
    }
    if (v === "water_geyser") {
      return {
        badge: "🌊 Chorro Propulsor",
        title: "Chorro Géiser del Lago (Lago)",
        description: "Columna de agua a presión que propulsa a la bola verticalmente hacia la meta suspendida en el aire.",
        isCustom: true
      };
    }
    if (v === "carrefour_arch") {
      return {
        badge: "🛒 Arco Carrefour",
        title: "Pórtico Monumental Carrefour (Carrefour)",
        description: "Gran arco arquitectónico de entrada al hipermercado con logotipo corporativo iluminado.",
        isCustom: true
      };
    }
    if (v === "carabanchel_hooded_man") {
      return {
        badge: "🚶 Vecino con Sudadera",
        title: "Patrullero con Sudadera (Ninanos)",
        description: "Persona en sudadera con capucha patrullando la calle que elimina al jugador al contacto costándole una vida.",
        isCustom: true
      };
    }
    if (v === "kamehameha_beam") {
      return {
        badge: "⚡ Kamehameha Haz",
        title: "Haz Tubular Radiante de Kamehameha (Super Saiyan)",
        description: "Haz cilíndrico de energía mística con núcleo de plasma blanco incandescente, envoltura cian resplandeciente, anillos de choque de energía y espiral de ki enrollada.",
        isCustom: true
      };
    }
    if (v === "kamehameha_burst") {
      return {
        badge: "💥 Kamehameha Detonación",
        title: "Esfera de Impacto y Detonación Kamehameha",
        description: "Gran esfera de energía concentrada con anillos de choque concéntricos, destellos de plasma y el portal de meta final integrado.",
        isCustom: true
      };
    }
    if (v === "kamehameha_charge") {
      return {
        badge: "🌀 Kamehameha Origen",
        title: "Esfera de Concentración de Energía de Goku",
        description: "Esfera de ki cargada directamente entre las manos de Goku Super Saiyan al inicio del Kamehameha.",
        isCustom: true
      };
    }
    if (v === "tram_square") {
      return {
        badge: "🚊 TRAM Alicante 90°",
        title: "TRAM d'Alacant (L2 Luceros - Alacant) 90°",
        description: "Vagón oficial del TRAM de Alicante en blanco y naranja con letrero LED '2 LUCEROS - ALACANT', cristales transparentes con vista al personaje, techo cerrado y giros de 90°.",
        isCustom: true
      };
    }
    if (v === "tram_circle") {
      return {
        badge: "🚊 TRAM Circular",
        title: "TRAM d'Alacant (L2 Luceros - Alacant) Circular",
        description: "Vagón oficial del TRAM de Alicante en blanco y naranja con letrero LED '2 LUCEROS - ALACANT', cristales transparentes con vista al personaje y techo cerrado en órbita continua.",
        isCustom: true
      };
    }
    if (v === "tram_rails") {
      return {
        badge: "🛤️ Raíles Tranvía",
        title: "Vía Férrea con Raíles y Traviesas",
        description: "Doble raíl de acero con perfil I, traviesas de madera espaciadas y lecho de balasto en circuito con 4 curvas a 90°.",
        isCustom: true
      };
    }
    if (v === "tram_linear") {
      return {
        badge: "🚊 TRAM Recto 144m",
        title: "TRAM d'Alacant (Recorrido Recto Lineal)",
        description: "Vagón oficial del TRAM de Alicante en blanco y naranja con letrero LED '2 LUCEROS - ALACANT', cristales transparentes y avance recto de 144 metros hacia Estación Fontana.",
        isCustom: true
      };
    }
    if (v === "tram_straight_rails") {
      return {
        badge: "🛤️ Raíles Rectos 144m",
        title: "Vía Férrea Recta con Catenaria y Traviesas",
        description: "Doble raíl de acero continuo con traviesas espaciadas y postes de catenaria aérea a lo largo de 144 metros.",
        isCustom: true
      };
    }
    if (v === "giant_bouncy_palm") {
      return {
        badge: "🌴 Palmera Gigante Rebote",
        title: "Palmera Gigante con Hojas Trampolín",
        description: "Palmera monumental con 6 hojas verdes provistas de bumpers elásticos que catapultan al jugador entre palmeras.",
        isCustom: true
      };
    }
    if (v === "mercadona_shelves") {
      return {
        badge: "🛒 Lineal Mercadona",
        title: "Estanterías de Supermercado Mercadona",
        description: "Mueble de estantes verde y amarillo corporativo con productos tematizados (fruta, pescado, carne, lácteos, perfumería o congelados).",
        isCustom: true
      };
    }
    if (v === "supermarket_checkout") {
      return {
        badge: "💳 Caja Supermercado",
        title: "Línea de Caja y Cinta Transportadora",
        description: "Mostrador con cinta transportadora negra, terminal TPV, lector de código de barras y monitor.",
        isCustom: true
      };
    }
    if (v === "shopping_carts") {
      return {
        badge: "🛒 Carros Compra",
        title: "Batería de Carros de Supermercado",
        description: "Hilera de carros metálicos anidados con asidero amarillo corporativo y ruedas orientables.",
        isCustom: true
      };
    }
    if (v === "bazar_shelves") {
      return {
        badge: "🏺 Estantería Bazar",
        title: "Estanterías Laberínticas de Bazar",
        description: "Módulos de bazar repletos de alfombras enrolladas, jarrones de cerámica, lámparas de cristal y abanicos tradicionales.",
        isCustom: true
      };
    }
    if (v === "clothesline") {
      return {
        badge: "👕 Tendedero Ropa",
        title: "Tendedero con Prendas Colgadas",
        description: "Cuerda tendida entre postes con prendas de ropa colgadas con pinzas que tapan la visión de posibles agujeros en el suelo.",
        isCustom: true
      };
    }
    if (v === "popeye_pizza") {
      return {
        badge: "🍕 Pizza Popeye 3D",
        title: "Pizza Gigante Popeye Giratoria y Ondulante",
        description: "Pizza de 8 porciones con masa crujiente, queso fundido, pepperoni y albahaca que rota sobre su eje y sube/baja con ondulación vertical.",
        isCustom: true
      };
    }
    if (v === "popeye_billboard") {
      return {
        badge: "🪧 Cartel Popeye",
        title: "Rótulo Luminoso Pizzería Popeye",
        description: "Gran letrero publicitario retro con marco dorado, focos superiores y texto 'PIZZERÍA POPEYE - SAN JUAN ALICANTE'.",
        isCustom: true
      };
    }
    if (v === "stracciatella_cone") {
      return {
        badge: "🍦 Helado Stracciatella",
        title: "Cucurucho Monumental de Stracciatella",
        description: "Cucurucho de galleta barquillo con textura de rombos, bola de helado gigante con virutas de chocolate negro y cereza roja en la cumbre.",
        isCustom: true
      };
    }
    if (v === "bike_wheel_vertical") {
      return {
        badge: "🚲 Rueda Bici",
        title: "Rueda Vertical de Bicicleta Gigante",
        description: "Rueda de radios y llanta de aleación que gira sobre su propio eje horizontal mientras avanza y transporta al jugador sobre su banda superior.",
        isCustom: true
      };
    }
    if (v === "bike_pedal") {
      return {
        badge: "🚴 Pedal Bici",
        title: "Pedal de Bicicleta con Reflectores",
        description: "Pedal metálico con estrías de adherencia, reflectores ámbar y biela cromada que sube y baja en cadencia de pedaleo.",
        isCustom: true
      };
    }
    if (v === "teleferico") {
      return {
        badge: "🚡 Teleférico",
        title: "Cabina Aérea de Teleférico",
        description: "Cabina acristalada con tirantes superiores y puerta que transporta al jugador a través de grandes vanos aéreos.",
        isCustom: true
      };
    }
    if (v === "padel_racket") {
      return {
        badge: "🎾 Pala Pádel",
        title: "Pala de Pádel Catapulta",
        description: "Pala de pádel con cordón y empuñadura que se eleva rápidamente catapultando la bola por encima de la red.",
        isCustom: true
      };
    }
    if (v === "olla") {
      return {
        badge: "🎡 La Olla",
        title: "Atracción Mecánica La Olla",
        description: "Plataforma circular con barrotes que gira e inclina a alta velocidad con oleadas de balanceo rítmico.",
        isCustom: true
      };
    }
    if (v === "bull") {
      return {
        badge: "🐂 Toro Bravo",
        title: "Toro Bravo Móvil",
        description: "Toro de lidia con cuernos y lomo que embiste frontalmente y sale despedido en colisión.",
        isCustom: true
      };
    }
    if (v === "bread_roller") {
      return {
        badge: "🥖 Barra Pan",
        title: "Barra de Pan Rodante",
        description: "Barra de pan tradicional de panadería que rota continuamente obligando al jugador a mantener el equilibrio.",
        isCustom: true
      };
    }
    if (v === "fan_5blades") {
      return {
        badge: "🌀 Ventilador",
        title: "Ventilador Industrial de 5 Aspas",
        description: "Hélice de 5 aspas aerodinámicas con carcasa circular que rota y empuja al jugador.",
        isCustom: true
      };
    }
    if (v === "lifeguard_sweeper") {
      return {
        badge: "🏖️ Barredora",
        title: "Barredora de Puesto de Socorrista",
        description: "Brazo móvil horizontal que barre la arena de la playa de lado a lado.",
        isCustom: true
      };
    }
    if (v === "slamming_door") {
      return {
        badge: "🚪 Puerta Blanca",
        title: "Puerta Batiente con Portazo",
        description: "Puerta blanca de pueblo que abre lentamente y se cierra de golpe con un portazo que proyecta la bola.",
        isCustom: true
      };
    }
    if (v === "litos_duo") {
      return {
        badge: "👫 Litos Dúo",
        title: "Pareja de Carabanchel (Litos)",
        description: "Hombre con camiseta del Atlético de Madrid y mujer con vestido verde de flores que cruzan la puerta disparados y vuelven lentamente.",
        isCustom: true
      };
    }
    if (v === "misina_cat") {
      return {
        badge: "🐱 Misina",
        title: "Cabeza de Gata Blanca Misina",
        description: "Entrada monumental con colmillos y ojos brillantes que da paso a la cámara interior.",
        isCustom: true
      };
    }
    if (v === "salamander_platform") {
      return {
        badge: "🦎 Salamandra",
        title: "Plataforma Salamandra de Las Hurdes",
        description: "Gran plataforma viviente con cabeza, lomo y patas recorribles de cabeza a cola.",
        isCustom: true
      };
    }
    if (v === "village_dogs") {
      return {
        badge: "🐕 Perros de Pueblo",
        title: "Perro de Las Hurdes",
        description: "Perro tradicional de pueblo que patrulla transversalmente con ladrido y empuje.",
        isCustom: true
      };
    }
    if (v === "islazul_mall_facade") {
      return {
        badge: "🏢 C.C. Islazul",
        title: "Fachada Centro Comercial Islazul",
        description: "Fachada vanguardista con visera ETFE, paneles ondulados, cristalera y el gran letrero luminoso de Islazul.",
        isCustom: true
      };
    }
    if (v === "primark_clothes_wall") {
      return {
        badge: "👗 Muro Ropa Primark",
        title: "Perchero Doble de Ropa Primark",
        description: "Muro de laberinto formado por percheros de acero cromado con ropa colgada en perchas y prendas dobladas.",
        isCustom: true
      };
    }
    if (v === "primark_portal") {
      return {
        badge: "🛍️ Portal Primark",
        title: "Pórtico de Entrada Primark",
        description: "Gran arco arquitectónico con logotipo oficial en azul cian de Primark.",
        isCustom: true
      };
    }
    if (v === "primark_plush_toy" || sub === "primark_plush_toy") {
      return {
        badge: "🧸 Peluche Primark",
        title: "Peluche por el Suelo (Desorden Primark)",
        description: "Peluches blandos de animales (osos, conejos, dinosaurios) caídos por los pasillos de la tienda.",
        isCustom: true
      };
    }
    if (v === "funko_pop_box") {
      return {
        badge: "📦 Caja Funko Pop",
        title: "Caja de Figura Funko Pop! Móvil",
        description: "Caja coleccionable de vinilo con ventana transparente y figura en su interior que se desplaza como plataforma móvil.",
        isCustom: true
      };
    }
    if (v === "rodilla_sandwich") {
      return {
        badge: "🥪 Sándwich Rodilla",
        title: "Sándwich Triangular Rodilla (Pirámide /\\)",
        description: "Sándwich gigante cortado en pirámide con base plana, cima en arista, franjas de relleno visibles (ensaladilla/tomate/lechuga) en el centro y pan blanco a los lados. Pendientes de subida y bajada en cada montaña /\\.",
        isCustom: true
      };
    }
    if (v === "rodilla_bumper") {
      return {
        badge: "🔴 Parachoques Rodilla",
        title: "Bumper Arcade Cromado Rodilla",
        description: "Parachoques de alta elasticidad con cúpula roja, anillo de contacto amarillo luminoso y base cromada. Rebota la bola con impulso fuerte al impactar.",
        isCustom: true
      };
    }
    if (v === "quesarito_cylinder") {
      return {
        badge: "🌯 Quesarito Taco Bell",
        title: "Cilindro Gigante Quesarito Rodante",
        description: "Burrito gigante de 60m+ con marcas de tostado a la parrilla, salsa de queso cheddar y giro continuo sobre su propio eje longitudinal.",
        isCustom: true
      };
    }
    if (v === "tgb_burger") {
      return {
        badge: "🍔 Hamburguesa TGB",
        title: "Hamburguesa Brioche Rebotadora TGB",
        description: "Hamburguesa gigante de brioche glaseado con sésamo, lechuga rizada, tomate, queso fundido y físicas de rebote elástico de colchón.",
        isCustom: true
      };
    }
    if (v === "cinema_seat_row") {
      return {
        badge: "💺 Butacas Yelmo",
        title: "Fila de Butacas de Cine Yelmo",
        description: "Fila de cómodas butacas de terciopelo rojo carmesí con posavasos y peldaño acolchado con ligero rebote.",
        isCustom: true
      };
    }
    if (v === "cinema_screen_monumental") {
      return {
        badge: "🎬 Pantalla Yelmo Cines",
        title: "Pantalla de Cine Monumental 16:9",
        description: "Gran pantalla de proyección curva con cartel luminoso de cartelera Yelmo Islazul 3D.",
        isCustom: true
      };
    }
    if (v === "vivagym_treadmill") {
      return {
        badge: "🏃 Cinta VivaGYM",
        title: "Cinta de Correr Gigante VivaGYM",
        description: "Cinta de correr de 80m+ con tapiz rodante hacia atrás, remates en verde lima neón, consola digital y obstáculos.",
        isCustom: true
      };
    }
    if (v === "republican_fronton") {
      return {
        badge: "🏛️ Frontón Republicano",
        title: "Frontón Rojo con Rótulo Viva la República",
        description: "Muro curvo frontal superior con inscripción en letras doradas y remate curvado según fotografía real de Las Cruces.",
        isCustom: true
      };
    }
    if (v === "republican_step") {
      return {
        badge: "📐 Grada Republicana",
        title: "Escalón Tricolor con Pasillos",
        description: "Peldaño de anfiteatro con división en 3 pasillos de hormigón y bandas de color de la bandera republicana.",
        isCustom: true
      };
    }
    if (v === "amphitheater_wing") {
      return {
        badge: "🧱 Muro Curvo Graderío",
        title: "Muro Lateral de Contención Las Cruces",
        description: "Muro escalonado curvo que bordea y encierra el graderío del anfiteatro.",
        isCustom: true
      };
    }
    if (v === "lake_wooden_railing") {
      return {
        badge: "🪵 Barandilla de Madera",
        title: "Valla Rústica del Lago Las Cruces",
        description: "Barandilla rústica de postes y travesaños de madera frente al paseo del lago.",
        isCustom: true
      };
    }
    if (v === "cruces_cypress" || sub === "cruces_cypress" || sub === "cypress") {
      return {
        badge: "🌲 Ciprés Mediterráneo",
        title: "Ciprés Esbelto de Las Cruces",
        description: "Ciprés estilizado de parque urbano que corona el frontón según la foto auténtica.",
        isCustom: true
      };
    }
    if (v === "village_girls") {
      return {
        badge: "👧 Niñas con Coletas",
        title: "Niñas Pequeñas de Pueblo",
        description: "Niñas con gafas y coletitas rubias que patrullan y empujan al jugador fuera.",
        isCustom: true
      };
    }
    if (v === "village_boys") {
      return {
        badge: "👦 Niños de Pueblo",
        title: "Niños Rápidos de Montaña",
        description: "Dos niños veloces que embisten con rapidez para tirar la bola de la repisa.",
        isCustom: true
      };
    }
    if (v === "turron_cat") {
      return {
        badge: "🐈 Gato Turrón",
        title: "Gato Naranja Turrón",
        description: "Gato atigrado que patrulla la orilla del río y empuja al jugador al agua.",
        isCustom: true
      };
    }
    if (obj.type === "decoration") {
      if (sub === "plush_bear") {
        return {
          badge: "🧸 Peluche 3D",
          title: "Oso de Peluche Gigante",
          description: "Muñeco de peluche suave con lazo rojo y orejas acolchadas con físicas de colisión.",
          isCustom: true
        };
      }
      if (sub === "jewelry_bust") {
        return {
          badge: "💎 Joyas 3D",
          title: "Busto de Terciopelo con Joyas",
          description: "Expositor de joyería de lujo con collar de oro y gema rubí tallada.",
          isCustom: true
        };
      }
      if (sub === "store_shelf") {
        return {
          badge: "📦 Estantería 3D",
          title: "Estantería Comercial de Tienda",
          description: "Mueble de madera de 3 baldas con productos, tarros de cristal y ropa doblada.",
          isCustom: true
        };
      }
      if (sub === "surf_rack") {
        return {
          badge: "🏄 Soporte Surf",
          title: "Expositor de Tablas de Surf",
          description: "Caballete náutico con 2 tablas de surf estilizadas de colores vivos y quillas.",
          isCustom: true
        };
      }
      if (sub === "arcade_cabinet") {
        return {
          badge: "🕹️ Recreativa 3D",
          title: "Máquina Recreativa Arcade Retro",
          description: "Cabina arcade con marquesina luminosa, joystick de bola roja, botones de acción y pantalla CRT verde.",
          isCustom: true
        };
      }
      if (sub === "gelato_display") {
        return {
          badge: "🍨 Heladería 3D",
          title: "Vitrina de Helados Artesanales",
          description: "Vitrina refrigerada con 4 cubetas de helado (pistacho, fresa, chocolate, vainilla) y soporte con cucuruchos.",
          isCustom: true
        };
      }
      if (sub === "bakery_counter") {
        return {
          badge: "☕ Cafetería 3D",
          title: "Mostrador de Café y Repostería",
          description: "Mostrador con cafetera espresso profesional cromada, tazas y vitrina con croissants dorados.",
          isCustom: true
        };
      }
      if (sub === "fashion_mannequin") {
        return {
          badge: "👗 Maniquí 3D",
          title: "Maniquí de Moda con Vestido",
          description: "Busto de sastrería sobre soporte metálico con vestido veraniego turquesa y pamela playera.",
          isCustom: true
        };
      }
      if (sub === "sneaker_rack") {
        return {
          badge: "👟 Zapatero 3D",
          title: "Expositor de Zapatillas Deportivas",
          description: "Expositor inclinado con zapatillas sneakers de colección y cajas apiladas.",
          isCustom: true
        };
      }
      if (sub === "checkout_counter") {
        return {
          badge: "💳 Caja Cobro 3D",
          title: "Mostrador de Caja Registradora",
          description: "Mostrador de cobro con terminal TPV para tarjetas, pantalla táctil y timbre de llamada.",
          isCustom: true
        };
      }
      if (sub === "palm_tree") {
        return {
          badge: "🌴 Palmera",
          title: "Palmera Costera Tropical",
          description: "Tronco leñoso curvado con copa de hojas de palmera tropical.",
          isCustom: true
        };
      }
      if (sub === "beach_umbrella") {
        return {
          badge: "⛱️ Sombrilla",
          title: "Sombrilla Playera Rayada",
          description: "Sombrilla de playa con lona a rayas, mástil y base pesada.",
          isCustom: true
        };
      }
      if (sub === "lifeguard_chair") {
        return {
          badge: "🪑 Socorrista",
          title: "Torreta de Vigilancia de Socorrista",
          description: "Silla alta con escalera, asiento elevado y salvavidas náutico colgado.",
          isCustom: true
        };
      }
      if (sub === "float_ring") {
        return {
          badge: "🛟 Flotador",
          title: "Flotador Salvavidas Náutico",
          description: "Aro salvavidas rojo y blanco con correas de sujeción.",
          isCustom: true
        };
      }
      if (sub === "sunbed") {
        return {
          badge: "🏖️ Tumbona",
          title: "Tumbona de Playa con Toalla",
          description: "Tumbona reclinada de descanso con toalla de resort.",
          isCustom: true
        };
      }
      return {
        badge: "🌸 Decoración",
        title: `Elemento Decorativo (${sub || "Estándar"})`,
        description: "Objeto decorativo del escenario.",
        isCustom: true
      };
    }
    if (shape === "cylinder") {
      return {
        badge: "🔘 Cilindro",
        title: "Plataforma Cilíndrica Redonda",
        description: "Plataforma circular con colisionador cilíndrico de 36 caras.",
        isCustom: true
      };
    }
    if (obj.type === "goal") {
      return {
        badge: "🏁 Meta",
        title: "Arco de Meta / Llegada",
        description: "Arco de meta con postes dorados, dintel con luces neón y anillo giratorio de paso para completar la etapa.",
        isCustom: false
      };
    }
    if (obj.type === "collectible") {
      return {
        badge: '<span data-editor-collectible></span> Coleccionable',
        title: "Objeto Coleccionable del Personaje",
        description: "Ítem flotante característico de cada personaje que otorga puntos y vida extra al reunir 10 unidades.",
        isCustom: false
      };
    }
    if (obj.type === "water" || (obj.type as string) === "honey") {
      const isHoney = (obj.type as string) === "honey" || obj.properties?.fluidType === "honey";
      const isPassable =
        obj.properties?.passable !== false &&
        obj.properties?.hasCollision !== true &&
        obj.properties?.solid !== true;
      return {
        badge: isHoney
          ? (isPassable ? "🍯 Miel Traspasable" : "🍯 Miel Sólida")
          : (isPassable ? "💧 Agua Traspasable" : "🌊 Agua Sólida"),
        title: isHoney
          ? (isPassable ? "Líquido de Miel Viscosa (Ralentización extrema)" : "Plataforma de Miel Sólida")
          : (isPassable ? "Volumen de Agua Traspasable (Caída / Sin colisión sólida)" : "Volumen de Agua Sólida (Caminable / Plataforma)"),
        description: isHoney
          ? "Fluido de miel ámbar dorado ultradenso de Las Hurdes que frena fuertemente el avance de la bola por alta resistencia viscosa."
          : (isPassable
            ? "Superficie de agua permeable con simulación hidrodinámica 3D de ondas: la bola puede atravesar el agua, salpicar y caer al vacío para perder vidas."
            : "Superficie de agua con colisión física sólida: la bola rueda sobre la superficie del agua como una plataforma sólida impenetrable."),
        isCustom: isHoney || !isPassable
      };
    }
    if (obj.type === "bumper") {
      return {
        badge: "🔴 Parachoques",
        title: "Rebotador / Bumper Arcade",
        description: "Obstáculo cilíndrico de alta elasticidad que impulsa la bola en cualquier dirección de impacto.",
        isCustom: false
      };
    }
    if (obj.type === "ramp") {
      return {
        badge: "📐 Rampa",
        title: "Rampa Inclinada",
        description: "Plataforma con pendiente inclinada para ascensos, descensos o saltos de velocidad.",
        isCustom: false
      };
    }
    if (obj.type === "moving-platform") {
      return {
        badge: "🔄 Móvil",
        title: "Plataforma Móvil Cinemática",
        description: "Plataforma cinemática guiada por física Rapier que se desplaza en bucle entre dos extremos.",
        isCustom: false
      };
    }

    return {
      badge: "📦 Bloque",
      title: "Plataforma Estándar",
      description: "Plataforma prismática estándar sólida con mapeo de texturas continuo por bioma.",
      isCustom: false
    };
  }

  private getEditorBlockMaterial(
    obj: LevelObjectData,
    isSelected: boolean,
    objIdx = 0
  ): THREE.Material | THREE.Material[] {
    const propTheme = (obj.properties?.theme as string) || "default";
    const customColor = (obj.properties?.customColor as string) || (obj.properties?.color as string);

    const applyPolygonOffset = (mat: THREE.Material) => {
      mat.polygonOffset = true;
      mat.polygonOffsetFactor = -1 * ((objIdx % 8) + 1);
      mat.polygonOffsetUnits = -1 * ((objIdx % 8) + 1);
    };

    if (propTheme === "custom_color" && customColor) {
      const finish = obj.properties?.asturiasFinish;
      const mat = new THREE.MeshLambertMaterial({
        map: typeof finish === "string" ? getAsturiasFinish(finish) : null,
        color: new THREE.Color(typeof finish === "string" ? 0xffffff : customColor),
        emissive: isSelected ? new THREE.Color(0x333311) : new THREE.Color(0x000000)
      });
      applyPolygonOffset(mat);
      return mat;
    }

    if (propTheme === "gold") {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.85,
        roughness: 0.25,
        emissive: isSelected ? new THREE.Color(0x332200) : new THREE.Color(0x000000)
      });
      applyPolygonOffset(mat);
      return mat;
    }

    if (propTheme === "chrome") {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.95,
        roughness: 0.15,
        emissive: isSelected ? new THREE.Color(0x222222) : new THREE.Color(0x000000)
      });
      applyPolygonOffset(mat);
      return mat;
    }

    if (propTheme === "drawing_sheet" || propTheme === "coloring_sheet") {
      const sheetIndex = (obj.properties?.sheetIndex as number) || (objIdx + 1);
      const coloringTex = SpriteTextures.getColoringPageTexture(sheetIndex);
      const sideMat = new THREE.MeshStandardMaterial({ color: 0xf7f5ee, roughness: 0.88, metalness: 0.02 });
      const botMat = new THREE.MeshStandardMaterial({ color: 0xeeebe2, roughness: 0.92, metalness: 0.01 });
      const topMat = new THREE.MeshStandardMaterial({
        map: coloringTex,
        color: 0xffffff,
        roughness: 0.78,
        metalness: 0.02,
        emissive: isSelected ? new THREE.Color(0x222211) : new THREE.Color(0x000000)
      });
      const matArray = [sideMat, sideMat, topMat, botMat, sideMat, sideMat];
      matArray.forEach(applyPolygonOffset);
      return matArray;
    }

    if (propTheme === "carril_bici") {
      const bikeTex = SpriteTextures.getBikeLaneTexture();
      const topMat = new THREE.MeshStandardMaterial({
        map: bikeTex,
        roughness: 0.5,
        metalness: 0.05,
        emissive: isSelected ? new THREE.Color(0x221111) : new THREE.Color(0x000000)
      });
      const curbMat = new THREE.MeshStandardMaterial({
        color: 0x1b5e20,
        roughness: 0.6,
        metalness: 0.05,
        emissive: isSelected ? new THREE.Color(0x002200) : new THREE.Color(0x000000)
      });
      const matArray = [curbMat, curbMat, topMat, curbMat, curbMat, curbMat];
      matArray.forEach(applyPolygonOffset);
      return matArray;
    }

    let targetSet: WorldBlockSet;
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
    else {
      targetSet = SpriteTextures.getWorldBlockSet(
        this.levelData.world || this.currentWorld,
        this.levelData.level || this.currentLevel
      );
    }

    const isMoving = obj.type === "moving-platform";
    const emissive = isMoving
      ? targetSet.movingEmissiveColor
      : isSelected
      ? new THREE.Color(0x333300)
      : targetSet.emissiveColor;

    const createMat = (map: THREE.Texture | undefined, roughness: number, metalness: number) => {
      const p: THREE.MeshStandardMaterialParameters = { roughness, metalness, emissive };
      if (map) p.map = map;
      return new THREE.MeshStandardMaterial(p);
    };

    const mats = [
      createMat(targetSet.sideX, 0.55, 0.06), // +X
      createMat(targetSet.sideX, 0.55, 0.06), // -X
      createMat(targetSet.top, 0.45, 0.08),   // +Y
      createMat(targetSet.bottom, 0.65, 0.05),// -Y
      createMat(targetSet.sideZ, 0.55, 0.06), // +Z
      createMat(targetSet.sideZ, 0.55, 0.06), // -Z
    ];
    mats.forEach(applyPolygonOffset);
    return mats;
  }

  private createVariantMesh(
    obj: LevelObjectData,
    isSelected: boolean,
    idx: number
  ): THREE.Mesh | THREE.Group | null {
    const v = obj.properties?.variant as string | undefined;
    const sub = obj.properties?.subType as string | undefined;
    const mov = obj.properties?.movementType as string | undefined;
    const theme = obj.properties?.theme as string | undefined;

    if(v==='concert_vibe'||mov==='concert_vibe'){const model=createConcertModel();model.collisionGeometry.dispose();return model.group;}

    // 1. World 4 Level 4 (Islazul) Variants
    if (v === "islazul_mall_facade" || sub === "islazul_mall_facade") {
      return LevelBuilder.createIslazulMallFacadeMesh(obj.scale.x || 44.0, obj.scale.y || 18.0, obj.scale.z || 10.0, "medium").group;
    }
    if (v === "primark_clothes_wall") {
      return LevelBuilder.createPrimarkClothesWallMesh(obj.scale.x || 8.0, obj.scale.y || 3.4, obj.scale.z || 0.8, "medium").group;
    }
    if (v === "primark_portal") {
      return LevelBuilder.createPrimarkPortalMesh(obj.scale.x || 16.0, obj.scale.y || 7.0, obj.scale.z || 1.6, "medium").group;
    }
    if (v === "primark_plush_toy" || sub === "primark_plush_toy") {
      const col = (obj.properties?.color as string) || (obj.properties?.customColor as string) || "#f48fb1";
      const aType = (obj.properties?.animalType as any) || "bear";
      return LevelBuilder.createPrimarkPlushToyMesh(col, aType, "medium").group;
    }
    if (v === "funko_pop_box") {
      const series = (obj.properties?.series as "dragon_ball" | "harry_potter" | "disney") || "dragon_ball";
      return LevelBuilder.createFunkoBoxMesh(obj.scale.x || 4.2, obj.scale.y || 5.2, obj.scale.z || 3.8, "medium", series).group;
    }
    if (mov === "vivagym_obstacle") {
      return LevelBuilder.createVivaGymObstacleMesh(obj.scale, obj.properties?.obstacleForm);
    }
    if (v === "rodilla_sandwich") {
      return LevelBuilder.createRodillaSandwichMesh(obj.scale.x || 22.0, obj.scale.y || 15.0, obj.scale.z || 50.0, "medium", String(obj.properties?.filling ?? "")).group;
    }
    if (v === "rodilla_bumper") {
      const r = (obj.scale.x || 2.4) / 2;
      const h = obj.scale.y || 1.4;
      return LevelBuilder.createRodillaBumperMesh(r, h, "medium").group;
    }
    if (v === "quesarito_cylinder" || mov === "quesarito_roll") {
      const rad = typeof obj.properties?.radius === "number" ? obj.properties.radius : (obj.scale.x ? obj.scale.x / 2 : 4.6);
      return LevelBuilder.createQuesaritoMesh(rad, obj.scale.z || 68.0, "medium").group;
    }
    if (v === "tgb_burger") {
      const rad = (obj.scale.x || 12.0) / 2;
      return LevelBuilder.createTGBBurgerMesh(rad, obj.scale.y || 5.2, "medium").group;
    }
    if (v === "cinema_seat_row") {
      const seatCount = typeof obj.properties?.seatCount === "number" ? obj.properties.seatCount : 8;
      return LevelBuilder.createCinemaSeatRowMesh(obj.scale.x || 24.0, obj.scale.y || 2.6, obj.scale.z || 2.2, seatCount, "medium", Number(obj.properties?.missingSeat ?? -1)).group;
    }
    if (v === "cinema_screen_monumental") {
      return LevelBuilder.createCinemaScreenMesh(obj.scale.x || 36.0, obj.scale.y || 20.0, obj.scale.z || 3.0, "medium").group;
    }
    if (v === "vivagym_treadmill" || mov === "vivagym_treadmill") {
      return LevelBuilder.createVivaGymTreadmillMesh(obj.scale.x || 22.0, obj.scale.y || 4.2, obj.scale.z || 84.0, "medium").group;
    }

    // 1b. World 4 Level 3 Stage 8: Escaleras Republicanas (Parque de las Cruces Photo Replica)
    if (v === "republican_fronton") {
      return LevelBuilder.createRepublicanFrontonMesh(obj.scale.x || 18.0, obj.scale.y || 2.8, obj.scale.z || 0.8, "medium").group;
    }
    if (v === "republican_step") {
      const stepNum = typeof obj.properties?.stepNumber === "number" ? obj.properties.stepNumber : 1;
      const band = (obj.properties?.band as "rojo" | "amarillo" | "morado") || (stepNum <= 8 ? "rojo" : stepNum <= 16 ? "amarillo" : "morado");
      const hexColor = (obj.properties?.customColor as string) || (band === "rojo" ? "#e53935" : band === "amarillo" ? "#ffeb3b" : "#7b1fa2");
      return LevelBuilder.createRepublicanStepMesh(obj.scale.x || 20.0, obj.scale.y || 0.8, obj.scale.z || 2.0, hexColor, stepNum, "medium").group;
    }
    if (v === "amphitheater_wing") {
      const side = (obj.properties?.side as any) || (obj.position.x < 0 ? "left" : "right");
      return LevelBuilder.createAmphitheaterWingMesh(side, obj.scale.z || 52.0, obj.scale.y || 8.5, "medium").group;
    }
    if (v === "lake_wooden_railing") {
      return LevelBuilder.createLakeWoodenRailingMesh(obj.scale.x || 38.0, obj.scale.y || 1.1, obj.scale.z || 0.35, "medium").group;
    }
    if (v === "cruces_cypress" || sub === "cruces_cypress" || sub === "cypress") {
      const h = (obj.scale.y || 1.0) * 9.0;
      return LevelBuilder.createCrucesCypressMesh(h, "medium").group;
    }

    // 2. Previous Worlds & Madrid / Aluche / Las Cruces / San Melitón Variants
    if (v === "yacht") {
      return LevelBuilder.createYachtMesh("medium", obj.properties?.customColor as string, obj.properties?.cabinColor as string, obj.properties?.stripeColor as string).group;
    }
    if (v === "market_stall") {
      return LevelBuilder.createMarketStallMesh("medium", obj.properties?.stallType as string, obj.properties?.customColor as string, obj.properties?.stripeColor as string).group;
    }
    if (v === "shop" || v === "store") {
      return LevelBuilder.createShopMesh("medium", obj.properties?.shopType as string, obj.properties?.customColor as string).group;
    }
    if (v === "tram_rails") {
      return LevelBuilder.createTramRailsMesh(obj.scale.x || 24, obj.scale.z || 24, (obj.properties?.cornerRadius as number) || 4.0);
    }
    if (v === "limp_kicker" || v === "cojo" || mov === "limp_kicker") {
      return LevelBuilder.createLimpKickerMesh("medium").group;
    }
    if (v === "beach_kiosk") {
      return LevelBuilder.createBeachKioskMesh("medium", obj.properties?.customColor as string, obj.properties?.stripeColor as string).group;
    }
    if (v === "hippie_stall") {
      return LevelBuilder.createHippieStallMesh("medium", (obj.properties?.stallIndex as number) || 1, obj.properties?.customColor as string, Boolean(obj.properties?.isGoalStall)).group;
    }
    if (v === "tram_straight_rails") {
      return LevelBuilder.createTramStraightRailsMesh((obj.properties?.length as number) || obj.scale.z || 144, obj.scale.x || 4.8);
    }
    if (v === "giant_bouncy_palm") {
      return LevelBuilder.createGiantBouncyPalmMesh("medium", (obj.properties?.palmIndex as number) || 1).group;
    }
    if (v === "mercadona_shelves") {
      return LevelBuilder.createMercadonaShelvesMesh(obj.scale.x || 4.0, obj.scale.y || 2.4, obj.scale.z || 1.8, (obj.properties?.department as string) || "fruit", "medium").group;
    }
    if (v === "supermarket_checkout") {
      return LevelBuilder.createSupermarketCheckoutMesh("medium").group;
    }
    if (v === "shopping_carts") {
      return LevelBuilder.createShoppingCartBayMesh("medium").group;
    }
    if (v === "bazar_shelves") {
      return LevelBuilder.createBazarShelfMesh(obj.scale.x || 4.0, obj.scale.y || 2.6, obj.scale.z || 1.6, "medium").group;
    }
    if (v === "clothesline") {
      return LevelBuilder.createClotheslineMesh(obj.scale.x || 5.0, obj.properties?.clothColor as string, "medium").group;
    }
    if (v === "popeye_billboard") {
      return LevelBuilder.createPopeyeBillboardMesh("medium");
    }
    if (v === "stracciatella_cone") {
      return LevelBuilder.createStracciatellaConeMesh((obj.properties?.coneHeight as number) || 10.0, (obj.properties?.scoopRadius as number) || 4.8, "medium").group;
    }
    if (v === "misina_cat") {
      return LevelBuilder.createMisinaCatMesh("medium").group;
    }
    if (v === "salamander_platform") {
      return LevelBuilder.createSalamanderMesh((obj.properties?.length as number) || obj.scale.z || 74.0, "medium").group;
    }
    if (v === "slamming_door" || mov === "slamming_door") {
      return LevelBuilder.createDoorMesh("medium").group;
    }
    if (v === "litos_duo" || mov === "litos_duo") {
      return LevelBuilder.createLitosDuoMesh("medium").group;
    }
    if (v === "madrid_duo_132b") {
      return LevelBuilder.createMadridDuo132BMesh("medium").group;
    }
    if (v === "clapping_gloves" || mov === "clapping_gloves") {
      return LevelBuilder.createClappingGlovesMesh((obj.properties?.side as any) || (obj.position.x < 0 ? "left" : "right"), "medium").group;
    }
    if (v === "residential_elevator_2f" || mov === "residential_elevator_2f") {
      return LevelBuilder.createElevator2FMesh(obj.scale.x || 4.2, obj.scale.y || 0.45, obj.scale.z || 4.2, "medium").group;
    }
    if (v === "chalkboard_platform") {
      return LevelBuilder.createChalkboardMesh(obj.scale.x || 11.0, obj.scale.y || 0.8, obj.scale.z || 42.0, "medium").group;
    }
    if (v === "continuous_tongue") {
      const pathPts = (obj.properties?.pathPoints as Array<{ x: number; y: number; z: number }>) || undefined;
      const tongueW = typeof obj.properties?.width === "number" ? obj.properties.width : 4.2;
      return LevelBuilder.createContinuousTongueMesh(pathPts, tongueW, "medium").group;
    }
    if (v === "yorkshire_rony_statue") {
      return LevelBuilder.createYorkshireRonyMesh("medium").group;
    }
    if (v === "floo_fireplace") {
      return LevelBuilder.createFlooFireplaceMesh("medium").group;
    }
    if (v === "membrillo_cube") {
      return LevelBuilder.createMembrilloBumperMesh(obj.scale.x || 2.4, obj.scale.y || 1.4, obj.scale.z || 2.4, "medium").group;
    }
    if (v === "pokemon_booster_wall") {
      const packIdx = typeof obj.properties?.packIndex === "number" ? obj.properties.packIndex : (idx % 4);
      return LevelBuilder.createPokemonBoosterWallMesh(obj.scale.x || 8.0, obj.scale.y || 3.4, obj.scale.z || 0.6, packIdx, "medium").group;
    }
    if (v === "pirate_ship") {
      return LevelBuilder.createPirateShipMesh("medium").group;
    }
    if (v === "water_geyser") {
      const rad = obj.scale.x ? obj.scale.x / 2 : 2.4;
      return LevelBuilder.createWaterGeyserMesh(rad, obj.scale.y || 16.0, "medium").group;
    }
    if (v === "carrefour_arch") {
      return LevelBuilder.createCarrefourArchMesh(obj.scale.x || 16.0, obj.scale.y || 6.5, "medium").group;
    }
    if (v === "carabanchel_hooded_man" || mov === "street_patrol_man") {
      return LevelBuilder.createHoodedManMesh((obj.properties?.hoodieColor as string) || "#1e293b", "medium").group;
    }
    if (v === "carabanchel_dog") {
      return LevelBuilder.createDogMesh("medium", 0).group;
    }
    if (v === "village_dogs" || mov === "village_dogs") {
      return LevelBuilder.createDogMesh("medium", (obj.properties?.breedIdx as number) || 0).group;
    }
    if (v === "village_girls" || mov === "village_girls") {
      return LevelBuilder.createGirlMesh("medium", Boolean(obj.properties?.isGirl2)).group;
    }
    if (v === "village_boys" || mov === "village_boys") {
      return LevelBuilder.createBoyMesh("medium", Boolean(obj.properties?.isBoy2)).group;
    }
    if (v === "turron_cat" || mov === "turron_cat") {
      return LevelBuilder.createDogMesh("medium", 1, "#ff9800").group;
    }
    if (v === "emt_bus_35" || mov === "emt_bus_35" || v === "emt_bus_34" || mov === "emt_bus_34") {
      const isB34 = v === "emt_bus_34" || mov === "emt_bus_34";
      return LevelBuilder.createEMTBus35Mesh(obj.scale.x || 3.4, obj.scale.y || 0.45, obj.scale.z || 8.6, "medium", isB34 ? "34" : "35").group;
    }
    if (v === "tram_circle" || v === "tram_square" || v === "tram_linear" || mov === "tram_circle" || mov === "tram_square" || mov === "tram_linear") {
      return LevelBuilder.createTramMesh(obj.scale.x || 3.6, obj.scale.y || 0.4, obj.scale.z || 6.8).group;
    }
    if (v === "casino_roulette" || mov === "casino_roulette") {
      return LevelBuilder.createCasinoRouletteMesh((obj.scale.x || 15) / 2, obj.scale.y || 0.6).group;
    }
    if (v === "bike_wheel_vertical" || mov === "bike_wheel_vertical") {
      return LevelBuilder.createVerticalWheelMesh((obj.properties?.radius as number) || 3.5, obj.scale.x || 2.4).group;
    }
    if (v === "bike_pedal" || mov === "bike_pedal") {
      return LevelBuilder.createBicyclePedalMesh(obj.scale.x || 2.0, obj.scale.y || 0.35, obj.scale.z || 1.8, (obj.properties?.phase as number) !== 0).group;
    }
    if (v === "giant_umbrella" || mov === "giant_umbrella") {
      const radius = typeof obj.properties?.radius === "number" ? obj.properties.radius : (obj.scale.x || 15) / 2;
      return LevelBuilder.createGiantUmbrellaMesh(radius, "medium", obj.properties?.customColor as string, obj.properties?.stripeColor as string).group;
    }
    if (v === "beach_towel" || mov === "towel_wave") {
      return LevelBuilder.createBeachTowelMesh(obj.scale.x || 5.8, obj.scale.z || 24, "medium").group;
    }
    if (v === "wave_pusher" || mov === "wave_pusher") {
      return LevelBuilder.createWaveMesh(obj.scale.x || 2.8, obj.scale.y || 0.55, obj.scale.z || 4.5, "medium").group;
    }
    if (v === "popeye_pizza" || mov === "popeye_pizza") {
      const radius = typeof obj.properties?.radius === "number" ? obj.properties.radius : (obj.scale.x || 16) / 2;
      return LevelBuilder.createPopeyePizzaMesh(radius, "medium").group;
    }
    if (v === "a4_sheet" || theme === "drawing_sheet" || theme === "coloring_sheet") {
      const sheetIndex = (obj.properties?.sheetIndex as number) || (idx + 1);
      const pencilColor = (obj.properties?.pencilColor as string) || (obj.properties?.customColor as string) || "#e53935";
      return LevelBuilder.createA4SheetMesh(obj.scale.x, obj.scale.y, obj.scale.z, "medium", sheetIndex, pencilColor).group;
    }
    if (v === "kamehameha_beam") {
      const isContinuous =
        obj.id === "w4s19-kame-continuous-beam" ||
        Boolean(obj.properties?.continuous) ||
        (Array.isArray(obj.properties?.pathPoints) && obj.properties.pathPoints.length >= 2);
      if (isContinuous) {
        const pathPts = (obj.properties?.pathPoints as Array<{ x: number; y: number; z: number }>) || undefined;
        const beamRadius = typeof obj.properties?.beamRadius === "number" ? obj.properties.beamRadius : 1.8;
        return LevelBuilder.createContinuousKamehamehaMesh(pathPts, beamRadius, "medium").group;
      }
      return LevelBuilder.createKamehamehaBeamMesh(obj.scale.x || 4.0, obj.scale.y || 0.8, obj.scale.z || 10.0, "medium").group;
    }
    if (v === "kamehameha_burst") {
      return LevelBuilder.createKamehamehaBurstMesh(obj.scale.x || 9.0, obj.scale.z || 9.0, "medium").group;
    }
    if (v === "kamehameha_charge") {
      return LevelBuilder.createKamehamehaChargeMesh(obj.scale.x || 5.5, "medium").group;
    }
    if (v === "bull" || (this.currentWorld === 1 && this.currentLevel === 1 && this.currentStage === 7 && obj.type === "bumper")) {
      const customColor = (obj.properties?.customColor as string) || (obj.properties?.color as string);
      return LevelBuilder.createBullMesh("medium", customColor).group;
    }
    if (v === "teleferico" || mov === "teleferico") {
      const group = new THREE.Group();
      const cabinColor = (obj.properties?.customColor as string) || (obj.properties?.color as string) || "#d32f2f";
      const cabinMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(cabinColor), roughness: 0.35, metalness: 0.2 });
      const steelMat = new THREE.MeshStandardMaterial({ color: 0x546e7a, roughness: 0.3, metalness: 0.6 });
      const yellowRoofMat = new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.3, metalness: 0.1 });
      const geo = new THREE.BoxGeometry(obj.scale.x, obj.scale.y, obj.scale.z);
      const mat = this.getEditorBlockMaterial(obj, isSelected, idx);
      const floorMesh = new THREE.Mesh(geo, mat);
      group.add(floorMesh);
      const halfW = obj.scale.x / 2;
      const halfD = obj.scale.z / 2;
      const floorH = obj.scale.y;
      const wallLGeo = new THREE.BoxGeometry(0.25, 1.4, obj.scale.z - 0.2);
      wallLGeo.translate(-halfW + 0.125, 0.7 + floorH / 2, 0);
      group.add(new THREE.Mesh(wallLGeo, cabinMat));
      const wallRGeo = new THREE.BoxGeometry(0.25, 1.4, obj.scale.z - 0.2);
      wallRGeo.translate(halfW - 0.125, 0.7 + floorH / 2, 0);
      group.add(new THREE.Mesh(wallRGeo, cabinMat));
      const lipFGeo = new THREE.BoxGeometry(obj.scale.x, 0.45, 0.25);
      lipFGeo.translate(0, 0.225 + floorH / 2, -halfD + 0.125);
      group.add(new THREE.Mesh(lipFGeo, cabinMat));
      const lipBGeo = new THREE.BoxGeometry(obj.scale.x, 0.45, 0.25);
      lipBGeo.translate(0, 0.225 + floorH / 2, halfD - 0.125);
      group.add(new THREE.Mesh(lipBGeo, cabinMat));
      for (const [px, pz] of [[-halfW + 0.12, -halfD + 0.12], [halfW - 0.12, -halfD + 0.12], [-halfW + 0.12, halfD - 0.12], [halfW - 0.12, halfD - 0.12]]) {
        const pGeo = new THREE.BoxGeometry(0.2, 2.2, 0.2);
        pGeo.translate(px, 1.1 + floorH / 2, pz);
        group.add(new THREE.Mesh(pGeo, steelMat));
      }
      const roofGeo = new THREE.BoxGeometry(obj.scale.x + 0.3, 0.25, obj.scale.z + 0.3);
      roofGeo.translate(0, 2.2 + floorH / 2, 0);
      group.add(new THREE.Mesh(roofGeo, yellowRoofMat));
      const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 6);
      armGeo.translate(0, 3.0 + floorH / 2, 0);
      group.add(new THREE.Mesh(armGeo, steelMat));
      const wheelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.15, 8);
      wheelGeo.rotateZ(Math.PI / 2);
      wheelGeo.translate(0, 3.75 + floorH / 2, 0);
      group.add(new THREE.Mesh(wheelGeo, steelMat));
      return group;
    }
    if (v === "olla" || mov === "olla") {
      const group = new THREE.Group();
      const radius = Math.max(3.0, (obj.scale.x || 11.0) / 2);
      const dishHeight = obj.scale.y || 0.6;
      const dishGeo = new THREE.CylinderGeometry(radius, radius, dishHeight, 20);
      const dishMat = new THREE.MeshStandardMaterial({ color: 0x3949ab, roughness: 0.35, metalness: 0.2 });
      group.add(new THREE.Mesh(dishGeo, dishMat));
      const ringGeo = new THREE.TorusGeometry(radius - 0.25, 0.45, 8, 24);
      ringGeo.rotateX(Math.PI / 2);
      ringGeo.translate(0, dishHeight / 2 + 0.35, 0);
      group.add(new THREE.Mesh(ringGeo, new THREE.MeshStandardMaterial({ color: 0xe53935, roughness: 0.4 })));
      const hubGeo = new THREE.CylinderGeometry(0.8, 1.2, 0.8, 12);
      hubGeo.translate(0, dishHeight / 2 + 0.4, 0);
      group.add(new THREE.Mesh(hubGeo, new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.25 })));
      return group;
    }
    if (v === "padel_racket" || mov === "padel_racket") {
      const group = new THREE.Group();
      const frameColor = (obj.properties?.customColor as string) || "#00e5ff";
      const frameMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(frameColor), roughness: 0.25, metalness: 0.35 });
      const faceMat = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.6, metalness: 0.15 });
      const gripMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
      const railMat = new THREE.MeshStandardMaterial({ color: 0x00b0ff, roughness: 0.3, metalness: 0.2 });
      const headW = obj.scale.x || 3.8;
      const headH = obj.scale.y || 0.20;
      const headD = obj.scale.z || 4.2;
      const rampGeo = new THREE.BoxGeometry(headW - 0.2, headH, 0.6);
      rampGeo.rotateX(-0.18);
      rampGeo.translate(0, headH * 0.25, 0.2);
      group.add(new THREE.Mesh(rampGeo, frameMat));
      const bedGeo = new THREE.BoxGeometry(headW, headH, headD);
      bedGeo.translate(0, headH / 2, -headD / 2);
      group.add(new THREE.Mesh(bedGeo, frameMat));
      const faceGeo = new THREE.BoxGeometry(headW - 0.3, 0.02, headD - 0.4);
      faceGeo.translate(0, headH + 0.01, -headD / 2);
      group.add(new THREE.Mesh(faceGeo, faceMat));
      const railThick = 0.16;
      const railH = 0.45;
      const leftRailGeo = new THREE.BoxGeometry(railThick, railH, headD);
      leftRailGeo.translate(-headW / 2 + railThick / 2, headH + railH / 2 - 0.05, -headD / 2);
      group.add(new THREE.Mesh(leftRailGeo, railMat));
      const rightRailGeo = new THREE.BoxGeometry(railThick, railH, headD);
      rightRailGeo.translate(headW / 2 - railThick / 2, headH + railH / 2 - 0.05, -headD / 2);
      group.add(new THREE.Mesh(rightRailGeo, railMat));
      const handleGeo = new THREE.CylinderGeometry(0.14, 0.16, 1.6, 8);
      handleGeo.rotateX(Math.PI / 2);
      handleGeo.translate(0, headH / 2 + 0.05, 0.9);
      group.add(new THREE.Mesh(handleGeo, gripMat));
      return group;
    }
    if (v === "bread_roller" || mov === "bread_roller") {
      const group = new THREE.Group();
      const crustMat = new THREE.MeshStandardMaterial({ color: 0xd78f44, roughness: 0.75 });
      const bw = obj.scale.x || 3.2;
      const bh = obj.scale.y || 0.9;
      const bd = obj.scale.z || 1.6;
      const loafGeo = new THREE.CylinderGeometry(bd / 2, bd / 2, bw, 12);
      loafGeo.rotateZ(Math.PI / 2);
      loafGeo.scale(1, bh / bd, 1);
      group.add(new THREE.Mesh(loafGeo, crustMat));
      return group;
    }
    if (v === "pipe_shuttle" || mov === "pipe_shuttle") {
      const group = new THREE.Group();
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xffa000, metalness: 0.7, roughness: 0.3 });
      const innerMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.4, side: THREE.DoubleSide });
      const outerGeo = new THREE.CylinderGeometry(1.45, 1.45, 3.6, 24, 1, true);
      outerGeo.rotateX(Math.PI / 2);
      group.add(new THREE.Mesh(outerGeo, brassMat));
      const innerGeo = new THREE.CylinderGeometry(1.25, 1.25, 3.6, 24, 1, true);
      innerGeo.rotateX(Math.PI / 2);
      group.add(new THREE.Mesh(innerGeo, innerMat));
      const neonMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
      const glow1 = new THREE.TorusGeometry(1.23, 0.05, 8, 24);
      glow1.translate(0, 0, 1.8);
      const glow2 = new THREE.TorusGeometry(1.23, 0.05, 8, 24);
      glow2.translate(0, 0, -1.8);
      group.add(new THREE.Mesh(glow1, neonMat), new THREE.Mesh(glow2, neonMat));
      return group;
    }
    if (v === "clock_hand" || mov === "clock_hand") {
      const group = new THREE.Group();
      const handMat = new THREE.MeshStandardMaterial({ color: 0x212121, metalness: 0.8, roughness: 0.2 });
      const hw = obj.scale.x || 0.5;
      const hh = obj.scale.y || 0.4;
      const hl = obj.scale.z || 6.0;
      const bladeGeo = new THREE.BoxGeometry(hw, hh, hl);
      bladeGeo.translate(0, 0, -hl / 2);
      group.add(new THREE.Mesh(bladeGeo, handMat));
      return group;
    }
    if (v === "lifeguard_sweeper" || mov === "lifeguard_sweeper") {
      const group = new THREE.Group();
      const redMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.5 });
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
      const broomMat = new THREE.MeshStandardMaterial({ color: 0xfbc02d, roughness: 0.8 });
      const torso = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.8, 0.8), whiteMat);
      torso.position.y = 1.8;
      const shorts = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.8, 0.82), redMat);
      shorts.position.y = 0.8;
      const broom = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.35, 0.5), broomMat);
      broom.position.set(0, 0.4, 1.2);
      group.add(torso, shorts, broom);
      return group;
    }
    if (v === "sea_urchin" || mov === "sea_urchin") {
      const group = new THREE.Group();
      const bellyMat = new THREE.MeshStandardMaterial({ color: 0xdecbb5, roughness: 0.8 });
      const snoutMat = new THREE.MeshStandardMaterial({ color: 0xeadcc9, roughness: 0.85 });
      const noseMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a });
      const earMat = new THREE.MeshStandardMaterial({ color: 0xbcaaa4, roughness: 0.7 });
      const quillMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.5 });
      const tipMat = new THREE.MeshStandardMaterial({ color: 0xf5f5dc, roughness: 0.3 });
      const body = new THREE.Mesh(new THREE.SphereGeometry(1.05, 12, 10), bellyMat);
      body.scale.set(1.0, 0.85, 1.25);
      body.position.set(0, 0.7, -0.1);
      group.add(body);
      const snout = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.0, 10), snoutMat);
      snout.rotateX(Math.PI / 2);
      snout.position.set(0, 0.65, 1.3);
      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), noseMat);
      nose.position.set(0, 0.65, 1.82);
      group.add(snout, nose);
      for (const eyeX of [-0.32, 0.32]) {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), eyeMat);
        eye.position.set(eyeX, 0.82, 1.15);
        const ear = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), earMat);
        ear.scale.set(0.6, 1.0, 0.3);
        ear.position.set(eyeX * 1.5, 0.95, 0.8);
        group.add(eye, ear);
      }
      const mantle = new THREE.Mesh(new THREE.SphereGeometry(1.08, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.65), quillMat);
      mantle.scale.set(1.02, 0.92, 1.3);
      mantle.position.set(0, 0.72, -0.15);
      group.add(mantle);
      const upVec = new THREE.Vector3(0, 1, 0);
      for (let i = 0; i < 14; i++) {
        const spikeH = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.2, 6), tipMat);
        const a = (i * Math.PI * 2) / 14;
        spikeH.position.set(Math.sin(a) * 1.15, 0.45, Math.cos(a) * 1.35 - 0.15);
        spikeH.quaternion.setFromUnitVectors(upVec, new THREE.Vector3(Math.sin(a), 0.05, Math.cos(a)).normalize());
        group.add(spikeH);
      }
      for (let i = 0; i < 10; i++) {
        const spikeD = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.2, 6), tipMat);
        const a = (i * Math.PI * 2) / 10;
        spikeD.position.set(Math.sin(a) * 0.75, 0.95, Math.cos(a) * 0.95 - 0.15);
        spikeD.quaternion.setFromUnitVectors(upVec, new THREE.Vector3(Math.sin(a) * 0.6, 0.85, Math.cos(a) * 0.6).normalize());
        group.add(spikeD);
      }
      for (const [vx, vy, vz] of [[0, 1.25, -0.15], [0, 1.2, 0.2], [0, 1.15, -0.55]]) {
        const spikeV = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.3, 6), tipMat);
        spikeV.position.set(vx, vy, vz);
        group.add(spikeV);
      }
      return group;
    }
    if (v === "apartment_elevator" || mov === "apartment_elevator") {
      const group = new THREE.Group();
      const steelMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.9 });
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, metalness: 0.95 });
      const floorMat = new THREE.MeshStandardMaterial({ color: 0x37474f });
      const floor = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.2, 2.6), floorMat);
      floor.position.y = 0.1;
      const ceil = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.18, 2.6), steelMat);
      ceil.position.y = 3.2;
      const postGeo = new THREE.CylinderGeometry(0.045, 0.045, 3.2, 8);
      for (const [px, pz] of [[-1.25, -1.25], [1.25, -1.25], [-1.25, 1.25], [1.25, 1.25]]) {
        const p = new THREE.Mesh(postGeo, chromeMat);
        p.position.set(px, 1.6, pz);
        group.add(p);
      }
      const railL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 2.5), chromeMat);
      railL.position.set(-1.25, 0.95, 0);
      const railR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 2.5), chromeMat);
      railR.position.set(1.25, 0.95, 0);
      const railB = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.06, 0.06), chromeMat);
      railB.position.set(0, 0.95, 1.25);
      group.add(floor, ceil, railL, railR, railB);
      return group;
    }
    if (v === "mattress_bouncer" || mov === "mattress_bouncer") {
      const group = new THREE.Group();
      const mW = obj.scale.x || 12.0;
      const mH = obj.scale.y || 1.2;
      const mD = obj.scale.z || 20.0;
      const matMat = new THREE.MeshStandardMaterial({ color: 0xe3f2fd, roughness: 0.7 });
      const stripeMat = new THREE.MeshStandardMaterial({ color: 0x1976d2, roughness: 0.6 });
      const bed = new THREE.Mesh(new THREE.BoxGeometry(mW, mH, mD), matMat);
      bed.position.y = mH / 2;
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(mW - 0.4, 0.05, mD - 0.4), stripeMat);
      stripe.position.y = mH + 0.02;
      group.add(bed, stripe);
      return group;
    }
    if (v === "fan_5blades" || mov === "fan_5blades") {
      const group = new THREE.Group();
      const customCol = (obj.properties?.customColor as string) || (obj.properties?.color as string);
      const fanColor = customCol ? new THREE.Color(customCol) : new THREE.Color(0x00e5ff);
      const hubMat = new THREE.MeshStandardMaterial({ color: 0x263238, metalness: 0.8 });
      const cowlMat = new THREE.MeshStandardMaterial({ color: customCol ? new THREE.Color(customCol).multiplyScalar(0.7) : 0x37474f, metalness: 0.7 });
      const rimMat = new THREE.MeshStandardMaterial({ color: fanColor, metalness: 0.8 });
      const bladeMat = new THREE.MeshStandardMaterial({ color: fanColor, metalness: 0.5 });
      const bLen = Math.max(obj.scale.x && obj.scale.x > 1.5 ? obj.scale.x : 4.8, 4.0);
      const outerR = bLen + 0.35;
      const shroudGeo = new THREE.CylinderGeometry(outerR, outerR, 0.8, 32, 1, true);
      shroudGeo.rotateX(Math.PI / 2);
      const shroud = new THREE.Mesh(shroudGeo, cowlMat);
      const torusLip = new THREE.Mesh(new THREE.TorusGeometry(outerR, 0.2, 12, 32), rimMat);
      torusLip.position.z = 0.4;
      group.add(shroud, torusLip);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.8, 16), hubMat);
      hub.rotateX(Math.PI / 2);
      group.add(hub);
      for (let i = 0; i < 5; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.72, bLen, 0.06), bladeMat);
        blade.position.y = bLen / 2 + 0.35;
        const bHolder = new THREE.Group();
        bHolder.rotation.z = (i * Math.PI * 2) / 5;
        bHolder.add(blade);
        group.add(bHolder);
      }
      return group;
    }
    if (v === "tilting_ramp" || mov === "tilt_x") {
      const rampGroup = new THREE.Group();
      const geo = new THREE.BoxGeometry(obj.scale.x, obj.scale.y, obj.scale.z);
      LevelBuilder.applyContinuousWorldUVs(geo, obj.position, obj.rotation, obj.scale, 4.0);
      const mat = this.getEditorBlockMaterial(obj, isSelected, idx);
      const deckMesh = new THREE.Mesh(geo, mat);
      rampGroup.add(deckMesh);
      const curbW = 0.45;
      const curbH = 0.65;
      const curbGeo = new THREE.BoxGeometry(curbW, curbH, obj.scale.z);
      const curbMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85, metalness: 0.15 });
      const curbL = new THREE.Mesh(curbGeo, curbMat);
      curbL.position.set(-obj.scale.x / 2 - curbW / 2 + 0.05, (obj.scale.y + curbH) / 2 - 0.1, 0);
      rampGroup.add(curbL);
      const curbR = new THREE.Mesh(curbGeo, curbMat);
      curbR.position.set(obj.scale.x / 2 + curbW / 2 - 0.05, (obj.scale.y + curbH) / 2 - 0.1, 0);
      rampGroup.add(curbR);
      const stepW = obj.scale.x - 0.2;
      const stepH = 0.22;
      const stepL = 1.2;
      const stepGeo = new THREE.BoxGeometry(stepW, stepH, stepL);
      const stepMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41, roughness: 0.8, metalness: 0.1 });
      const stepOffsetsZ = [-obj.scale.z * 0.28, 0, obj.scale.z * 0.28];
      for (const sZ of stepOffsetsZ) {
        const stepMesh = new THREE.Mesh(stepGeo, stepMat);
        stepMesh.position.set(0, obj.scale.y / 2 + stepH / 2, sZ);
        rampGroup.add(stepMesh);
      }
      const hingeMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.4, metalness: 0.8 });
      const axleGeo = new THREE.CylinderGeometry(0.38, 0.38, obj.scale.x + 1.2, 16);
      axleGeo.rotateZ(Math.PI / 2);
      const axleMesh = new THREE.Mesh(axleGeo, hingeMat);
      axleMesh.position.set(0, -obj.scale.y * 0.25, obj.scale.z / 2);
      rampGroup.add(axleMesh);
      return rampGroup;
    }

    return null;
  }

  private render3DObjects(): void {
    this.scene.userData.artPreviewData=this.levelData;
    const road=this.levelData.objects.find(o=>o.properties?.subType==="asturias_cov_road");
    const roadPoints=road?.properties?.points as Vector3Data[]|undefined;
    this.covadongaPreviewRoad=roadPoints ? {points:roadPoints,frames:buildRiverFrames(roadPoints),width:Number(road?.properties?.width??8)}:undefined;
    this.clearEditorGroupResources();
    this.editorGroup.clear();
    this.movingObjects = [];

    // Editor lighting to ensure materials look vibrant
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.editorGroup.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(20, 40, 20);
    this.editorGroup.add(dirLight);

    const isLargeStage = (this.currentWorld === 4 && this.currentLevel === 4);
    const gridSize = isLargeStage ? 160 : 80;
    const gridDivs = isLargeStage ? 80 : 40;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivs, 0x00e5ff, 0x374151);
    const baseY = (this.currentWorld === 4 && this.currentLevel === 3 && this.currentStage === 9) ? 29.5 : -0.5;
    gridHelper.position.y = baseY;
    this.editorGroup.add(gridHelper);

    this.levelData.objects.forEach((obj, idx) => {
      const isSelected = idx === this.selectedObjectIndex;
      let mesh: THREE.Mesh | THREE.Group;

      const variantMesh = this.createVariantMesh(obj, isSelected, idx);
      if(obj.properties?.subType==="asturias_sella_river" || String(obj.properties?.subType??"").startsWith("asturias_cov_")) {
        mesh=LevelBuilder.createDecorationMesh(obj).group;
      } else if (variantMesh) {
        mesh = variantMesh;
        if (isSelected) {
          const box = new THREE.Box3().setFromObject(mesh);
          const size = new THREE.Vector3();
          box.getSize(size);
          const center = new THREE.Vector3();
          box.getCenter(center);
          const selGeo = new THREE.BoxGeometry(Math.max(size.x, 0.4), Math.max(size.y, 0.4), Math.max(size.z, 0.4));
          const wire = new THREE.LineSegments(
            new THREE.EdgesGeometry(selGeo),
            new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 2 })
          );
          wire.position.copy(center);
          mesh.add(wire);
        }
      } else if (obj.type === "platform" || obj.type === "ramp") {
        const isCylinder = obj.properties?.shape === "cylinder" || obj.properties?.platformShape === "cylinder";
        const pShape = (obj.properties?.shape as string) || (obj.properties?.platformShape as string) || (isCylinder ? "cylinder" : "box");

        if (pShape === "hollow_rect" || Boolean(obj.properties?.hole)) {
          const hw = (obj.properties?.holeWidth as number) || (obj.properties?.holeSizeX as number) || (obj.scale.x * 0.45);
          const hl = (obj.properties?.holeDepth as number) || (obj.properties?.holeLength as number) || (obj.properties?.holeSizeZ as number) || (obj.scale.z * 0.45);
          const offX = (obj.properties?.holeOffsetX as number) || 0;
          const offZ = (obj.properties?.holeOffsetZ as number) || 0;
          const groupHollow = new THREE.Group();
          const mat = this.getEditorBlockMaterial(obj, isSelected, idx);
          const w = obj.scale.x;
          const h = obj.scale.y;
          const l = obj.scale.z;

          const bWLeft = Math.max(0.1, (w - hw) / 2 - offX);
          const bWRight = Math.max(0.1, (w - hw) / 2 + offX);
          const bDFront = Math.max(0.1, (l - hl) / 2 - offZ);
          const bDBack = Math.max(0.1, (l - hl) / 2 + offZ);

          const mLeft = new THREE.Mesh(new THREE.BoxGeometry(bWLeft, h, l), mat);
          mLeft.position.set(-w / 2 + bWLeft / 2, 0, 0);
          groupHollow.add(mLeft);

          const mRight = new THREE.Mesh(new THREE.BoxGeometry(bWRight, h, l), mat);
          mRight.position.set(w / 2 - bWRight / 2, 0, 0);
          groupHollow.add(mRight);

          const mFront = new THREE.Mesh(new THREE.BoxGeometry(hw, h, bDFront), mat);
          mFront.position.set(offX, 0, -l / 2 + bDFront / 2);
          groupHollow.add(mFront);

          const mBack = new THREE.Mesh(new THREE.BoxGeometry(hw, h, bDBack), mat);
          mBack.position.set(offX, 0, l / 2 - bDBack / 2);
          groupHollow.add(mBack);

          mesh = groupHollow;
        } else if (pShape === "hexagon") {
          const radius = Math.max(obj.scale.x, obj.scale.z) / 2;
          const geoHex = new THREE.CylinderGeometry(radius, radius, obj.scale.y, 6);
          geoHex.rotateY(Math.PI / 6);
          const mat = this.getEditorBlockMaterial(obj, isSelected, idx);
          mesh = new THREE.Mesh(geoHex, Array.isArray(mat) ? mat[2] || mat[0] : mat);
        } else if (pShape === "l_shape") {
          const armW = (obj.properties?.armWidth as number) || (obj.scale.x * 0.5);
          const armD = (obj.properties?.armDepth as number) || (obj.scale.z * 0.5);
          const lGroup = new THREE.Group();
          const mat = this.getEditorBlockMaterial(obj, isSelected, idx);
          const m1 = new THREE.Mesh(new THREE.BoxGeometry(obj.scale.x, obj.scale.y, armD), mat);
          m1.position.set(0, 0, -obj.scale.z / 2 + armD / 2);
          lGroup.add(m1);
          const wingD = obj.scale.z - armD;
          const m2 = new THREE.Mesh(new THREE.BoxGeometry(armW, obj.scale.y, wingD), mat);
          m2.position.set(-obj.scale.x / 2 + armW / 2, 0, armD / 2);
          lGroup.add(m2);
          mesh = lGroup;
        } else {
          let geo: THREE.BufferGeometry;
          if (isCylinder) {
            const radius = (obj.scale.x + obj.scale.z) / 4;
            const height = obj.scale.y;
            geo = new THREE.CylinderGeometry(radius, radius, height, 32);
          } else {
            const boxGeo = new THREE.BoxGeometry(obj.scale.x, obj.scale.y, obj.scale.z);
            LevelBuilder.applyContinuousWorldUVs(boxGeo, obj.position, obj.rotation, obj.scale, 4.0);
            geo = boxGeo;
          }
          const mat = this.getEditorBlockMaterial(obj, isSelected, idx);
          const platformMesh = new THREE.Mesh(geo, isCylinder && Array.isArray(mat) ? (mat[2] || mat[0]) : mat);

          if (isSelected) {
            const edges = new THREE.EdgesGeometry(geo);
            const lineMat = new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 2 });
            const wire = new THREE.LineSegments(edges, lineMat);
            platformMesh.add(wire);
          }

          mesh = platformMesh;
        }
      } else if (obj.type === "moving-platform" || Boolean(obj.properties?.isMoving)) {
        const group = new THREE.Group();
        if (obj.properties?.shape === "cylinder" || obj.properties?.platformShape === "cylinder") {
          const radius = (obj.scale.x + obj.scale.z) / 4;
          const height = obj.scale.y;
          const geo = new THREE.CylinderGeometry(radius, radius, height, 32);
          const mat = this.getEditorBlockMaterial(obj, isSelected, idx);
          const cylMesh = new THREE.Mesh(geo, mat);
          group.add(cylMesh);
        } else if (obj.properties?.shape === "hexagon" || obj.properties?.platformShape === "hexagon") {
          const radius = Math.max(obj.scale.x, obj.scale.z) / 2;
          const height = obj.scale.y;
          const geo = new THREE.CylinderGeometry(radius, radius, height, 6);
          geo.rotateY(Math.PI / 6);
          const mat = this.getEditorBlockMaterial(obj, isSelected, idx);
          const hexMesh = new THREE.Mesh(geo, Array.isArray(mat) ? mat[2] || mat[0] : mat);
          group.add(hexMesh);
        } else if (obj.properties?.shape === "hollow_rect" || obj.properties?.platformShape === "hollow_rect" || Boolean(obj.properties?.hole)) {
          const totalW = obj.scale.x;
          const totalH = obj.scale.y;
          const totalL = obj.scale.z;
          const holeW = (obj.properties?.holeWidth as number) || (obj.properties?.holeSizeX as number) || (totalW * 0.45);
          const holeL = (obj.properties?.holeDepth as number) || (obj.properties?.holeLength as number) || (obj.properties?.holeSizeZ as number) || (totalL * 0.45);
          const offX = (obj.properties?.holeOffsetX as number) || 0;
          const offZ = (obj.properties?.holeOffsetZ as number) || 0;
          const bWLeft = Math.max(0.1, (totalW - holeW) / 2 - offX);
          const bWRight = Math.max(0.1, (totalW - holeW) / 2 + offX);
          const bDFront = Math.max(0.1, (totalL - holeL) / 2 - offZ);
          const bDBack = Math.max(0.1, (totalL - holeL) / 2 + offZ);
          const mat = this.getEditorBlockMaterial(obj, isSelected, idx);

          const mLeft = new THREE.Mesh(new THREE.BoxGeometry(bWLeft, totalH, totalL), mat);
          mLeft.position.set(-totalW / 2 + bWLeft / 2, 0, 0);
          group.add(mLeft);

          const mRight = new THREE.Mesh(new THREE.BoxGeometry(bWRight, totalH, totalL), mat);
          mRight.position.set(totalW / 2 - bWRight / 2, 0, 0);
          group.add(mRight);

          const mFront = new THREE.Mesh(new THREE.BoxGeometry(holeW, totalH, bDFront), mat);
          mFront.position.set(offX, 0, -totalL / 2 + bDFront / 2);
          group.add(mFront);

          const mBack = new THREE.Mesh(new THREE.BoxGeometry(holeW, totalH, bDBack), mat);
          mBack.position.set(offX, 0, totalL / 2 - bDBack / 2);
          group.add(mBack);
        } else {
          const geo = new THREE.BoxGeometry(obj.scale.x, obj.scale.y, obj.scale.z);
          LevelBuilder.applyContinuousWorldUVs(geo, obj.position, obj.rotation, obj.scale, 4.0);
          const mat = this.getEditorBlockMaterial(obj, isSelected, idx);
          const boxMesh = new THREE.Mesh(geo, mat);
          group.add(boxMesh);
        }

        if (isSelected) {
          const selGeo = new THREE.BoxGeometry(obj.scale.x, obj.scale.y, obj.scale.z);
          const edges = new THREE.EdgesGeometry(selGeo);
          const lineMat = new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 2 });
          const wire = new THREE.LineSegments(edges, lineMat);
          group.add(wire);
        }

        mesh = group;
      } else if (obj.type === "cylinder" || obj.type === "bumper") {
        const bShape = (obj.properties?.shape as string) || (obj.properties?.platformShape as string) || "cylinder";
        let geo: THREE.BufferGeometry;
        if (bShape === "hexagon") {
          const rad = Math.max(obj.scale.x, obj.scale.z) / 2;
          geo = new THREE.CylinderGeometry(rad, rad, obj.scale.y, 6);
          geo.rotateY(Math.PI / 6);
        } else if (bShape === "box") {
          geo = new THREE.BoxGeometry(obj.scale.x, obj.scale.y, obj.scale.z);
        } else {
          geo = new THREE.CylinderGeometry(obj.scale.x / 2, obj.scale.x / 2, obj.scale.y, 16);
        }
        const customColor = (obj.properties?.customColor as string) || (obj.properties?.color as string);
        const mat = new THREE.MeshPhongMaterial({
          color: customColor ? new THREE.Color(customColor) : (isSelected ? 0xffeb3b : 0xe91e63),
          specular: 0xffffff,
          shininess: 90
        });
        const bMesh = new THREE.Mesh(geo, mat);

        if (isSelected) {
          const edges = new THREE.EdgesGeometry(geo);
          const lineMat = new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 2 });
          bMesh.add(new THREE.LineSegments(edges, lineMat));
        }

        mesh = bMesh;
      } else if (obj.type === "collectible") {
        const group = new THREE.Group();
        const sprite = new CollectibleVisual('pan','medium');
        sprite.renderOrder = 1;
        group.add(sprite);

        // Raycasting proxy sphere
        const hitGeo = new THREE.SphereGeometry(0.6, 8, 8);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitMesh = new THREE.Mesh(hitGeo, hitMat);
        group.add(hitMesh);

        if (isSelected) {
          const selGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
          const edges = new THREE.EdgesGeometry(selGeo);
          const lineMat = new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 2 });
          const wire = new THREE.LineSegments(edges, lineMat);
          group.add(wire);
        }

        mesh = group;
      } else if (obj.type === "goal"&&obj.properties?.oxfordGoal==='sky') {
        mesh=createOxfordSkyGoal();
      } else if (obj.type === "goal") {
        const group = new THREE.Group();

        const postMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xffd700 : 0xd4af37,
          metalness: 0.8,
          roughness: 0.25
        });

        // Left post (square, sits on ground)
        const leftPost = new THREE.Mesh(new THREE.BoxGeometry(0.44, 3.18, 0.44), postMat);
        leftPost.position.set(-1.7, 1.59, 0);
        group.add(leftPost);

        // Right post (square, sits on ground)
        const rightPost = new THREE.Mesh(new THREE.BoxGeometry(0.44, 3.18, 0.44), postMat);
        rightPost.position.set(1.7, 1.59, 0);
        group.add(rightPost);

        // Top lintel beam (depth 0.48 crowns posts cleanly at y=3.18 without z-fighting)
        const beamMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xffd700 : 0xc62828,
          metalness: 0.6,
          roughness: 0.3
        });
        const topBeam = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.44, 0.48), beamMat);
        topBeam.position.set(0, 3.40, 0);
        group.add(topBeam);

        // Shimmering clean energy portal membrane inside (flush to ground)
        const portalGeo = new THREE.PlaneGeometry(2.96, 3.16);
        const portalMat = new THREE.MeshBasicMaterial({
          color: 0x00e5ff,
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
          side: THREE.DoubleSide
        });
        const portalMesh = new THREE.Mesh(portalGeo, portalMat);
        portalMesh.renderOrder = 8;
        portalMesh.position.set(0, 1.58, 0);
        group.add(portalMesh);

        if (isSelected) {
          const goalBoxGeo = new THREE.BoxGeometry(3.9, 3.65, 0.6);
          const edges = new THREE.EdgesGeometry(goalBoxGeo);
          const lineMat = new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 2 });
          const wire = new THREE.LineSegments(edges, lineMat);
          wire.position.set(0, 1.82, 0);
          group.add(wire);
        }

        mesh = group;
      } else if (obj.type === "water" || obj.type === "honey") {
        const isPassable =
          obj.properties?.passable !== false &&
          obj.properties?.hasCollision !== true &&
          obj.properties?.solid !== true;
        const isHoney = obj.type === "honey" || obj.properties?.fluidType === "honey";
        const isCircular = obj.properties?.shape === "cylinder" || obj.properties?.shape === "circle" || obj.properties?.platformShape === "cylinder" || obj.properties?.platformShape === "circle";
        const radius = Math.max(obj.scale.x, obj.scale.z) / 2;
        const geo = isCircular
          ? new THREE.CylinderGeometry(radius, radius, obj.scale.y, 48)
          : new THREE.BoxGeometry(obj.scale.x, obj.scale.y, obj.scale.z);
        if (!isCircular) {
          LevelBuilder.applyContinuousWorldUVs(geo, obj.position, obj.rotation, obj.scale, 4.0);
        }
        const fluidTex = isHoney ? LevelBuilder.getSharedHoneyTexture() : LevelBuilder.getSharedWaterTexture();
        const fluidColor = isHoney ? (isPassable ? new THREE.Color(0xf59e0b) : new THREE.Color(0xb45309)) : new THREE.Color(0xc2e4e5);
        const waterMat = new THREE.MeshStandardMaterial({
          map: fluidTex,
          bumpMap:isHoney ? null:fluidTex,
          bumpScale:.06,
          color: fluidColor,
          roughness: isHoney ? 0.05 : 0.2,
          metalness: isHoney ? .1:0,
          transparent: true,
          opacity: typeof obj.properties?.surfaceOpacity==="number" ? THREE.MathUtils.clamp(obj.properties.surfaceOpacity,0,1) : isPassable ? (isHoney ? 0.85 : 0.68) : 0.9,
          depthWrite: false
        });
        const boxMesh = new THREE.Mesh(geo, waterMat);
        boxMesh.renderOrder = 5;
        if (isSelected) {
          const edges = new THREE.EdgesGeometry(geo);
          boxMesh.add(
            new THREE.LineSegments(
              edges,
              new THREE.LineBasicMaterial({
                color: isPassable ? 0x00e5ff : 0xffd700,
                linewidth: 2
              })
            )
          );
        }
        mesh = boxMesh;
      } else if (obj.type === "lava") {
        const geo = new THREE.BoxGeometry(obj.scale.x, obj.scale.y, obj.scale.z);
        const lavaMat = new THREE.MeshStandardMaterial({
          color: 0xff3300,
          emissive: isSelected ? new THREE.Color(0xff9900) : new THREE.Color(0xff2200),
          emissiveIntensity: 0.85,
          roughness: 0.35,
          metalness: 0.2
        });
        const boxMesh = new THREE.Mesh(geo, lavaMat);
        if (isSelected) {
          const edges = new THREE.EdgesGeometry(geo);
          boxMesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 2 })));
        }
        mesh = boxMesh;
      } else if (obj.type === "decoration") {
        const decRes = LevelBuilder.createDecorationMesh(obj, "medium", {world:this.currentWorld,level:this.currentLevel});
        mesh = decRes.group;
        if (isSelected) {
          const subType = (obj.properties?.subType as string) || "tree";
          let bounds = { w: 1.0, h: 1.0, d: 1.0, cy: 0.5 };
          if (subType === "tree") {
            bounds = { w: 2.2, h: 3.2, d: 2.2, cy: 1.6 };
          } else if (subType === "bush") {
            bounds = { w: 1.7, h: 1.0, d: 1.2, cy: 0.5 };
          } else if (subType === "flower") {
            bounds = { w: 0.8, h: 0.65, d: 0.8, cy: 0.32 };
          } else if (subType === "bird") {
            bounds = { w: 0.45, h: 0.5, d: 0.65, cy: 0.25 };
          } else if (subType === "fence") {
            bounds = { w: 3.0, h: 0.85, d: 0.25, cy: 0.425 };
          } else if (subType === "lantern") {
            bounds = { w: 0.55, h: 2.25, d: 0.55, cy: 1.1 };
          } else if (subType === "firework_rocket") {
            bounds = { w: 0.45, h: 1.5, d: 0.45, cy: 0.75 };
          } else if (subType === "town_hall") {
            bounds = { w: 22.0, h: 12.0, d: 7.0, cy: 6.0 };
          } else if (subType === "dia_sign") {
            bounds = { w: 5.2, h: 2.4, d: 0.3, cy: 1.2 };
          } else if (subType === "bench") {
            bounds = { w: 2.2, h: 0.9, d: 0.8, cy: 0.45 };
          } else if (subType === "palm_tree") {
            bounds = { w: 3.5, h: 4.2, d: 3.5, cy: 2.1 };
          } else if (subType === "seashell") {
            bounds = { w: 0.8, h: 0.25, d: 0.8, cy: 0.12 };
          } else if (subType === "lifeguard_chair") {
            bounds = { w: 1.6, h: 3.6, d: 1.6, cy: 1.8 };
          } else if (subType === "beach_umbrella") {
            bounds = { w: 2.5, h: 2.8, d: 2.5, cy: 1.4 };
          } else if (subType === "float_ring") {
            bounds = { w: 1.2, h: 0.4, d: 1.2, cy: 0.2 };
          } else if (subType === "sunbed") {
            bounds = { w: 1.0, h: 0.9, d: 2.4, cy: 0.45 };
          } else if (subType === "village_fountain") {
            bounds = { w: 1.5, h: 1.8, d: 1.2, cy: 0.9 };
          } else if (subType === "village_church_tower") {
            bounds = { w: 3.8, h: 10.0, d: 3.8, cy: 5.0 };
          } else if (subType === "stone_bridge_arch") {
            bounds = { w: 8.4, h: 4.8, d: 5.4, cy: 2.4 };
          } else if (subType === "pine_hurdes") {
            bounds = { w: 2.6, h: 6.0, d: 2.6, cy: 3.0 };
          } else if (subType === "hurdes_stone_wall") {
            bounds = { w: 2.6, h: 1.3, d: 0.6, cy: 0.65 };
          } else if (subType === "hurdes_mountain_house") {
            bounds = { w: 4.8, h: 4.5, d: 4.2, cy: 2.25 };
          } else if (subType === "terrace_table_set") {
            bounds = { w: 1.4, h: 1.0, d: 1.8, cy: 0.5 };
          } else if (subType === "village_lantern_post" || subType === "pergola_green_post") {
            bounds = { w: 0.8, h: 4.5, d: 0.8, cy: 2.25 };
          } else if (subType === "wooden_bench_rustic") {
            bounds = { w: 2.0, h: 1.0, d: 0.8, cy: 0.5 };
          } else if (subType === "spar_supermarket_sign") {
            bounds = { w: 2.0, h: 4.5, d: 0.6, cy: 2.25 };
          } else if (subType === "waterfall_rock_cliff") {
            bounds = { w: 4.0, h: 4.5, d: 2.8, cy: 2.25 };
          } else if (subType === "village_stones") {
            bounds = { w: 1.2, h: 0.4, d: 1.2, cy: 0.2 };
          } else if (subType === "moss_patch") {
            bounds = { w: 1.0, h: 0.25, d: 1.0, cy: 0.12 };
          } else if (subType === "madrid_metro_sign") {
            bounds = { w: 1.2, h: 3.5, d: 0.8, cy: 1.75 };
          } else if (subType === "madrid_street_sign_carabanchel") {
            bounds = { w: 1.4, h: 2.5, d: 0.4, cy: 1.25 };
          } else if (subType === "madrid_street_lamp_urban") {
            bounds = { w: 1.2, h: 4.0, d: 1.2, cy: 2.0 };
          } else if (subType === "madrid_recycle_bins") {
            bounds = { w: 3.0, h: 1.8, d: 1.2, cy: 0.9 };
          } else if (subType === "madrid_granite_bollard") {
            bounds = { w: 0.6, h: 0.9, d: 0.6, cy: 0.45 };
          } else if (subType === "madrid_terrace_bar_umbrella") {
            bounds = { w: 3.3, h: 2.8, d: 3.3, cy: 1.4 };
          } else if (subType === "madrid_residential_building") {
            bounds = { w: 7.2, h: 12.2, d: 4.6, cy: 6.1 };
          } else if (subType === "madrid_bus_stop") {
            bounds = { w: 3.8, h: 2.8, d: 1.8, cy: 1.4 };
          } else if (subType === "madrid_traffic_light") {
            bounds = { w: 0.8, h: 3.5, d: 0.8, cy: 1.75 };
          } else if (subType === "bazar_shelf_display") {
            bounds = { w: 2.5, h: 2.3, d: 1.0, cy: 1.15 };
          } else if (subType === "madrid_kiosk_press") {
            bounds = { w: 2.8, h: 2.8, d: 2.5, cy: 1.4 };
          } else if (subType === "giant_goku_saiyan") {
            bounds = { w: 3.2, h: 4.8, d: 2.8, cy: 2.4 };
          } else if (subType === "islazul_mall_facade") {
            bounds = { w: obj.scale.x || 44.0, h: obj.scale.y || 18.0, d: obj.scale.z || 10.0, cy: (obj.scale.y || 18.0) / 2 };
          } else if (subType === "primark_plush_toy") {
            bounds = { w: 0.9, h: 0.8, d: 0.9, cy: 0.4 };
          } else if (subType === "madrid_street_marking_piquenas") {
            bounds = { w: 3.2, h: 0.1, d: 52.0, cy: 0.05 };
          }

          const boxGeo = new THREE.BoxGeometry(bounds.w, bounds.h, bounds.d);
          const edges = new THREE.EdgesGeometry(boxGeo);
          const lineMat = new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 2 });
          const wire = new THREE.LineSegments(edges, lineMat);
          wire.position.set(0, bounds.cy, 0);
          mesh.add(wire);
        }
      } else {
        const geo = new THREE.BoxGeometry(obj.scale.x || 1, obj.scale.y || 1, obj.scale.z || 1);
        mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x9e9e9e }));
      }

      const posX = obj.position.x;
      const posY = obj.type === "goal"
        ? (Math.abs(obj.position.y - 1.6) < 0.1 ? 0.4 : obj.position.y)
        : obj.position.y;
      const posZ = obj.position.z;

      mesh.position.set(posX, posY, posZ);
      mesh.rotation.set(Number(obj.properties?.pitch ?? obj.rotation.x), obj.rotation.y, obj.rotation.z, "YXZ");

      if(obj.properties?.covadongaAction==="cannonGoal") mesh.scale.copy(obj.scale);
      mesh.userData = { ...mesh.userData,objectIndex: idx };
      mesh.traverse(child => {
        child.userData = child.userData || {};
        child.userData.objectIndex = idx;
      });

      const isMovingObj =
        obj.type === "moving-platform" ||
        Boolean(obj.properties?.isMoving) ||
        Boolean(obj.properties?.movementType) ||
        Boolean(obj.properties?.asturiasAction && obj.properties.asturiasAction !== "hatch") ||
        Boolean(obj.properties?.cangasAction && obj.properties.cangasAction !== "launch") ||
        Boolean(obj.properties?.sellaAction && ["canoe","gull","landingGoal"].includes(String(obj.properties.sellaAction))) ||
        Boolean(obj.properties?.covadongaAction) ||
        Boolean(obj.properties?.londonAction || obj.properties?.londonTrain) ||
        Boolean(obj.properties?.museumAction || obj.properties?.museumGoal || obj.properties?.museumTier!==undefined) ||
        Boolean(obj.properties?.oxfordAction || obj.properties?.oxfordGoal) ||
        obj.properties?.subType==='kyoto_sweeping_katana' ||
        Boolean(obj.properties?.naraAction) || Boolean(obj.properties?.norwayAction) || Boolean(obj.properties?.tokyoAction) || Boolean(obj.properties?.osakaAction) || ['nara_deer','nara_mochi','nara_pond','osaka_sushi_belt','osaka_ramen_stall'].includes(String(obj.properties?.subType)) ||
        obj.properties?.subType==="asturias_sella_river";

      if (isMovingObj) {
        const movType = obj.properties?.movementType;
        if (movType === "vertical_circle") {
          const r = (obj.properties?.radius as number) ?? 5.5;
          const cy = (obj.properties?.centerY as number) ?? posY;
          const cz = (obj.properties?.centerZ as number) ?? posZ;
          const pts: THREE.Vector3[] = [];
          for (let a = 0; a <= Math.PI * 2 + 0.1; a += Math.PI / 16) {
            pts.push(new THREE.Vector3(0, cy - posY + Math.sin(a) * r, cz - posZ + Math.cos(a) * r));
          }
          const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
          const trackLine = new THREE.Line(
            lineGeo,
            new THREE.LineDashedMaterial({ color: isSelected ? 0xffd700 : 0x00e5ff, dashSize: 0.6, gapSize: 0.3 })
          );
          trackLine.computeLineDistances();
          mesh.add(trackLine);
        } else if (movType === "circular" || movType === "orbit" || movType === "tram_circle") {
          const cx = (obj.properties?.centerX as number) ?? 0;
          const cz = (obj.properties?.centerZ as number) ?? 0;
          const distFromCenter = Math.hypot(posX - cx, posZ - cz);
          const r = (obj.properties?.radius as number) ?? (distFromCenter > 0.01 ? distFromCenter : 12.0);
          const pts: THREE.Vector3[] = [];
          for (let a = 0; a <= Math.PI * 2 + 0.1; a += Math.PI / 16) {
            pts.push(new THREE.Vector3(cx - posX + Math.cos(a) * r, 0.1, cz - posZ + Math.sin(a) * r));
          }
          const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
          const trackLine = new THREE.Line(
            lineGeo,
            new THREE.LineDashedMaterial({ color: isSelected ? 0xffd700 : 0x00e5ff, dashSize: 0.6, gapSize: 0.3 })
          );
          trackLine.computeLineDistances();
          mesh.add(trackLine);
        } else if (movType === "quesarito_roll") {
          const rad = typeof obj.properties?.radius === "number" ? obj.properties.radius : (obj.scale.x ? obj.scale.x / 2 : 4.6);
          const ringGeo = new THREE.TorusGeometry(rad + 0.35, 0.08, 8, 24);
          const ring = new THREE.Line(
            ringGeo,
            new THREE.LineDashedMaterial({ color: isSelected ? 0xffd700 : 0xffa000, dashSize: 0.5, gapSize: 0.3 })
          );
          ring.computeLineDistances();
          mesh.add(ring);
        } else if (!obj.properties?.oxfordAction && !obj.properties?.oxfordGoal && !obj.properties?.londonAction && !obj.properties?.londonTrain && !obj.properties?.asturiasAction && !obj.properties?.cangasAction && !obj.properties?.sellaAction && obj.properties?.subType!=="asturias_sella_river" && movType !== "slamming_door" && movType !== "tilt_x" && movType !== "vivagym_treadmill" && movType !== "vivagym_obstacle") {
          const axis = (obj.properties?.axis as "x" | "y" | "z" | "yz") || "x";
          const dist = typeof obj.properties?.distance === "number" ? obj.properties.distance : 6.0;
          const slopeY = typeof obj.properties?.slopeY === "number" ? obj.properties.slopeY : 0.28;
          const pts = [
            new THREE.Vector3(
              axis === "x" ? -dist : 0,
              axis === "y" ? -dist : axis === "yz" ? -dist * slopeY : 0,
              axis === "z" || axis === "yz" ? -dist : 0
            ),
            new THREE.Vector3(
              axis === "x" ? dist : 0,
              axis === "y" ? dist : axis === "yz" ? dist * slopeY : 0,
              axis === "z" || axis === "yz" ? dist : 0
            )
          ];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
          const trackLine = new THREE.Line(
            lineGeo,
            new THREE.LineDashedMaterial({
              color: isSelected ? 0xffd700 : 0x00e5ff,
              dashSize: 0.6,
              gapSize: 0.3
            })
          );
          trackLine.computeLineDistances();
          mesh.add(trackLine);
        }

        this.movingObjects.push({
          obj,
          group: mesh,
          basePosition: new THREE.Vector3(posX, posY, posZ),
          baseRotation: new THREE.Euler(obj.rotation.x, obj.rotation.y, obj.rotation.z, "YXZ")
        });
      }

      if(this.currentWorld===7&&(this.currentLevel===3||this.currentLevel===4)&&['platform','ramp','cylinder','moving-platform','rotating-platform'].includes(obj.type)){mesh.userData.neonSurface=obj.id;if(['platform','ramp','cylinder'].includes(obj.type))mesh.userData.neonPath=true;}
      this.editorGroup.add(mesh);
    });
    if(((this.currentWorld===7&&(this.currentLevel===3||this.currentLevel===4))||(this.currentWorld===8&&(this.currentLevel>=1&&this.currentLevel<=4))))stabilizeNeonSurfaces(this.editorGroup);
    this.editorGroup.updateMatrixWorld(true);
    this.spawnHeading=stageStartYaw(this.levelData);
    this.editorGroup.add(createSpawnMarker(this.levelData.spawn,this.spawnHeading,this.selectedObjectIndex===SPAWN_SELECTION));
    const headingInput=this.container.querySelector<HTMLInputElement>('#inp-spawn-heading');
    if(headingInput&&document.activeElement!==headingInput&&this.levelData.properties?.spawnYaw===undefined)headingInput.value=(this.spawnHeading*180/Math.PI).toFixed(1);
  }

  static syncOfficialStagesIfNeeded(): void {
    retireStageHistory();
    if (typeof localStorage === "undefined") return;
    const SYNC_KEY = "megaramp_w1_l1_sync_restored_v1";
    if (localStorage.getItem(SYNC_KEY) !== "true") {
      for (let s = 1; s <= 10; s++) {
        const baked = getBakedStage(1, 1, s);
        if (baked) {
          localStorage.setItem(`custom_stage_1_1_${s}`, JSON.stringify(baked));
        }
      }
      const busBaked = getBakedStage(1, 2, 1);
      if (busBaked) {
        localStorage.setItem("custom_stage_1_2_1", JSON.stringify(busBaked));
      }
      localStorage.setItem(SYNC_KEY, "true");
    }

    const SYNC_KEY_W1L2 = "megaramp_w1_l2_sync_stages_v2";
    if (localStorage.getItem(SYNC_KEY_W1L2) !== "true") {
      for (let s = 2; s <= 10; s++) {
        const baked = getBakedStage(1, 2, s);
        if (baked) {
          localStorage.setItem(`custom_stage_1_2_${s}`, JSON.stringify(baked));
          const snapshotsKey = `stage_snapshots_1_2_${s}`;
          const snap: StageSnapshot = {
            id: `snap_${Date.now()}`,
            timestamp: Date.now(),
            dateStr: "Oficial",
            name: baked.name,
            data: baked
          };
          localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
        }
      }
      localStorage.setItem(SYNC_KEY_W1L2, "true");
    }

    const SYNC_KEY_W1L3 = "megaramp_w1_l3_restore_user_stages_v3";
    if (localStorage.getItem(SYNC_KEY_W1L3) !== "true") {
      for (let s = 1; s <= 10; s++) {
        const baked = getBakedStage(1, 3, s);
        if (baked) {
          localStorage.setItem(`custom_stage_1_3_${s}`, JSON.stringify(baked));
          const snapshotsKey = `stage_snapshots_1_3_${s}`;
          const snap: StageSnapshot = {
            id: `snap_${Date.now()}`,
            timestamp: Date.now(),
            dateStr: s === 9 ? "Pala Nueva" : "Restaurado",
            name: baked.name,
            data: baked
          };
          const raw = localStorage.getItem(snapshotsKey);
          let list: StageSnapshot[] = [];
          if (raw) {
            try { list = JSON.parse(raw); } catch {}
          }
          list.unshift(snap);
          if (list.length > 4) list = list.slice(0, 4);
          localStorage.setItem(snapshotsKey, JSON.stringify(list));
        }
      }
      localStorage.setItem(SYNC_KEY_W1L3, "true");
    }

    const SYNC_KEY_W1L4 = "megaramp_w1_l4_init_stages_v1";
    if (localStorage.getItem(SYNC_KEY_W1L4) !== "true") {
      for (let s = 1; s <= 10; s++) {
        // Safe sync: Only set if user hasn't created custom edits for this stage!
        if (!localStorage.getItem(`custom_stage_1_4_${s}`)) {
          const baked = getBakedStage(1, 4, s);
          if (baked) {
            localStorage.setItem(`custom_stage_1_4_${s}`, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_1_4_${s}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}`,
              timestamp: Date.now(),
              dateStr: "Oficial",
              name: baked.name,
              data: baked
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
          }
        }
      }
      localStorage.setItem(SYNC_KEY_W1L4, "true");
    }

    const SYNC_KEY_W1L4_POLISH = "megaramp_w1_l4_polish_stages_v2";
    if (localStorage.getItem(SYNC_KEY_W1L4_POLISH) !== "true") {
      const polishStages = [4, 6, 8, 10];
      for (const s of polishStages) {
        const baked = getBakedStage(1, 4, s);
        if (baked) {
          localStorage.setItem(`custom_stage_1_4_${s}`, JSON.stringify(baked));
          const snapshotsKey = `stage_snapshots_1_4_${s}`;
          const snap: StageSnapshot = {
            id: `snap_${Date.now()}`,
            timestamp: Date.now(),
            dateStr: "Mejora Oficial",
            name: baked.name,
            data: baked
          };
          const raw = localStorage.getItem(snapshotsKey);
          let list: StageSnapshot[] = [];
          if (raw) {
            try { list = JSON.parse(raw); } catch {}
          }
          list.unshift(snap);
          if (list.length > 4) list = list.slice(0, 4);
          localStorage.setItem(snapshotsKey, JSON.stringify(list));
        }
      }
      localStorage.setItem(SYNC_KEY_W1L4_POLISH, "true");
    }

    const SYNC_KEY_W2L1 = "megaramp_w2_l1_init_stages_v1";
    if (localStorage.getItem(SYNC_KEY_W2L1) !== "true") {
      for (let s = 1; s <= 10; s++) {
        if (!localStorage.getItem(`custom_stage_2_1_${s}`)) {
          const baked = getBakedStage(2, 1, s);
          if (baked) {
            localStorage.setItem(`custom_stage_2_1_${s}`, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_2_1_${s}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}`,
              timestamp: Date.now(),
              dateStr: "Oficial",
              name: baked.name,
              data: baked
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
          }
        }
      }
      localStorage.setItem(SYNC_KEY_W2L1, "true");
    }

    const SYNC_KEY_W2L1_V4 = "megaramp_w2_l1_master_arpon_lagoon_v4";
    if (localStorage.getItem(SYNC_KEY_W2L1_V4) !== "true") {
      for (let s = 1; s <= 10; s++) {
        const baked = getBakedStage(2, 1, s);
        if (baked) {
          const customKey = `custom_stage_2_1_${s}`;
          const currentCustom = localStorage.getItem(customKey);
          let shouldUpdate = !currentCustom || s === 2;
          if (currentCustom && s === 2) {
            try {
              const p = JSON.parse(currentCustom);
              if (!p.objects?.some((o: any) => o.id === "w2s2-lagoon-water")) {
                shouldUpdate = true;
              }
            } catch {
              shouldUpdate = true;
            }
          }
          if (shouldUpdate) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_2_1_${s}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}`,
              timestamp: Date.now(),
              dateStr: "Oficial",
              name: baked.name,
              data: baked
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
          }
        }
      }
      localStorage.setItem(SYNC_KEY_W2L1_V4, "true");
    }

    const SYNC_KEY_W3L4_S8 = "megaramp_w3_l4_s8_tilting_ramp_v2";
    if (localStorage.getItem(SYNC_KEY_W3L4_S8) !== "true") {
      const baked = getBakedStage(3, 4, 8);
      if (baked) {
        localStorage.setItem("custom_stage_3_4_8", JSON.stringify(baked));
        const snapshotsKey = "stage_snapshots_3_4_8";
        const snap: StageSnapshot = {
          id: `snap_${Date.now()}`,
          timestamp: Date.now(),
          dateStr: "Rampa Basculante",
          name: baked.name,
          data: baked
        };
        localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
      }
      localStorage.setItem(SYNC_KEY_W3L4_S8, "true");
    }

    const SYNC_KEY_W3L4_S9 = "megaramp_w3_l4_s9_pitch_black_v2";
    if (localStorage.getItem(SYNC_KEY_W3L4_S9) !== "true") {
      const baked = getBakedStage(3, 4, 9);
      if (baked) {
        localStorage.setItem("custom_stage_3_4_9", JSON.stringify(baked));
        const snapshotsKey = "stage_snapshots_3_4_9";
        const snap: StageSnapshot = {
          id: `snap_${Date.now()}`,
          timestamp: Date.now(),
          dateStr: "Ruta Nocturna",
          name: baked.name,
          data: baked
        };
        localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
      }
      localStorage.setItem(SYNC_KEY_W3L4_S9, "true");
    }

    const SYNC_KEY_W4L1 = "megaramp_w4_l1_piqueñas_carabanchel_v1";
    if (localStorage.getItem(SYNC_KEY_W4L1) !== "true") {
      for (let s = 1; s <= 10; s++) {
        const customKey = `custom_stage_4_1_${s}`;
        const currentCustom = localStorage.getItem(customKey);
        let shouldSet = true;
        if (currentCustom) {
          try {
            const parsed = JSON.parse(currentCustom);
            if (parsed.customSaved || parsed.properties?.userSaved || parsed.objects?.some((o: any) => o.id?.startsWith("obj-custom"))) {
              shouldSet = false;
            }
          } catch {
            shouldSet = true;
          }
        }
        if (shouldSet) {
          const baked = getBakedStage(4, 1, s);
          if (baked) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_4_1_${s}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}_init_w4_l1_s${s}`,
              timestamp: Date.now(),
              dateStr: "Oficial Carabanchel",
              name: baked.name,
              data: JSON.parse(JSON.stringify(baked))
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
          }
        }
      }
      localStorage.setItem(SYNC_KEY_W4L1, "true");
    }

    const SYNC_KEY_W4L1_V2 = "megaramp_w4_l1_stage10_id_fix_v2";
    if (localStorage.getItem(SYNC_KEY_W4L1_V2) !== "true") {
      const baked10 = getBakedStage(4, 1, 10);
      if (baked10) {
        const customKey = "custom_stage_4_1_10";
        const currentCustom = localStorage.getItem(customKey);
        let shouldUpdate = true;
        if (currentCustom) {
          try {
            const parsed = JSON.parse(currentCustom);
            if (parsed.customSaved || parsed.properties?.userSaved || parsed.objects?.some((o: any) => o.id?.startsWith("obj-custom"))) {
              shouldUpdate = false;
            }
          } catch {
            shouldUpdate = true;
          }
        }
        if (shouldUpdate) {
          localStorage.setItem(customKey, JSON.stringify(baked10));
          const snapshotsKey = "stage_snapshots_4_1_10";
          const snap: StageSnapshot = {
            id: `snap_${Date.now()}_fix_w4_l1_s10`,
            timestamp: Date.now(),
            dateStr: "Oficial Carabanchel",
            name: baked10.name,
            data: JSON.parse(JSON.stringify(baked10))
          };
          localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
        }
      }
      localStorage.setItem(SYNC_KEY_W4L1_V2, "true");
    }

    const SYNC_KEY_W4L1_V3 = "megaramp_w4_l1_bus35_emt_piquenas_v3";
    if (localStorage.getItem(SYNC_KEY_W4L1_V3) !== "true") {
      const baked2 = getBakedStage(4, 1, 2);
      if (baked2) {
        const customKey = "custom_stage_4_1_2";
        const currentCustom = localStorage.getItem(customKey);
        let shouldUpdate = true;
        if (currentCustom) {
          try {
            const parsed = JSON.parse(currentCustom);
            if (parsed.customSaved || parsed.properties?.userSaved || parsed.objects?.some((o: any) => o.id?.startsWith("obj-custom"))) {
              shouldUpdate = false;
            }
          } catch {
            shouldUpdate = true;
          }
        }
        if (shouldUpdate) {
          localStorage.setItem(customKey, JSON.stringify(baked2));
          const snapshotsKey = "stage_snapshots_4_1_2";
          const snap: StageSnapshot = {
            id: `snap_${Date.now()}_emt_bus_35`,
            timestamp: Date.now(),
            dateStr: "Oficial Carabanchel",
            name: baked2.name,
            data: JSON.parse(JSON.stringify(baked2))
          };
          localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
        }
      }
      localStorage.setItem(SYNC_KEY_W4L1_V3, "true");
    }

    const SYNC_KEY_W4L1_V4 = "megaramp_w4_l1_s8_litos_pair_door_v4";
    if (localStorage.getItem(SYNC_KEY_W4L1_V4) !== "true") {
      const baked8 = getBakedStage(4, 1, 8);
      if (baked8) {
        const customKey = "custom_stage_4_1_8";
        const currentCustom = localStorage.getItem(customKey);
        let shouldUpdate = true;
        if (currentCustom) {
          try {
            const parsed = JSON.parse(currentCustom);
            if (parsed.customSaved || parsed.properties?.userSaved || parsed.objects?.some((o: any) => o.id?.startsWith("obj-custom"))) {
              shouldUpdate = false;
            }
          } catch {
            shouldUpdate = true;
          }
        }
        if (shouldUpdate) {
          localStorage.setItem(customKey, JSON.stringify(baked8));
          const snapshotsKey = "stage_snapshots_4_1_8";
          const snap: StageSnapshot = {
            id: `snap_${Date.now()}_litos_duo_v4`,
            timestamp: Date.now(),
            dateStr: "Oficial Carabanchel",
            name: baked8.name,
            data: JSON.parse(JSON.stringify(baked8))
          };
          localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
        }
      }
      localStorage.setItem(SYNC_KEY_W4L1_V4, "true");
    }

    const SYNC_KEY_W4L1_V5 = "megaramp_w4_l1_s2_bus35_cinematic_colors_v5";
    if (localStorage.getItem(SYNC_KEY_W4L1_V5) !== "true") {
      const baked2 = getBakedStage(4, 1, 2);
      if (baked2) {
        const customKey = "custom_stage_4_1_2";
        const currentCustom = localStorage.getItem(customKey);
        let shouldUpdate = true;
        if (currentCustom) {
          try {
            const parsed = JSON.parse(currentCustom);
            if (parsed.customSaved || parsed.properties?.userSaved || parsed.objects?.some((o: any) => o.id?.startsWith("obj-custom"))) {
              shouldUpdate = false;
            }
          } catch {
            shouldUpdate = true;
          }
        }
        if (shouldUpdate) {
          localStorage.setItem(customKey, JSON.stringify(baked2));
          const snapshotsKey = "stage_snapshots_4_1_2";
          const snap: StageSnapshot = {
            id: `snap_${Date.now()}_bus35_v5`,
            timestamp: Date.now(),
            dateStr: "Oficial Carabanchel",
            name: baked2.name,
            data: JSON.parse(JSON.stringify(baked2))
          };
          localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
        }
      }
      localStorage.setItem(SYNC_KEY_W4L1_V5, "true");
    }

    const SYNC_KEY_W4L1_V6 = "megaramp_w4_l1_s9_kamehameha_goku_v6";
    if (localStorage.getItem(SYNC_KEY_W4L1_V6) !== "true") {
      const baked9 = getBakedStage(4, 1, 9);
      if (baked9) {
        const customKey = "custom_stage_4_1_9";
        const currentCustom = localStorage.getItem(customKey);
        let shouldUpdate = true;
        if (currentCustom) {
          try {
            const parsed = JSON.parse(currentCustom);
            if (parsed.customSaved || parsed.properties?.userSaved || parsed.objects?.some((o: any) => o.id?.startsWith("obj-custom"))) {
              shouldUpdate = false;
            }
          } catch {
            shouldUpdate = true;
          }
        }
        if (shouldUpdate) {
          localStorage.setItem(customKey, JSON.stringify(baked9));
          const snapshotsKey = "stage_snapshots_4_1_9";
          const snap: StageSnapshot = {
            id: `snap_${Date.now()}_kamehameha_goku_v6`,
            timestamp: Date.now(),
            dateStr: "Oficial Carabanchel",
            name: baked9.name,
            data: JSON.parse(JSON.stringify(baked9))
          };
          localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
        }
      }
      localStorage.setItem(SYNC_KEY_W4L1_V6, "true");
    }

    const SYNC_KEY_W4L1_V7 = "megaramp_w4_l1_s9_connected_kamehameha_goku_v7";
    if (localStorage.getItem(SYNC_KEY_W4L1_V7) !== "true") {
      const baked9 = getBakedStage(4, 1, 9);
      if (baked9) {
        const customKey = "custom_stage_4_1_9";
        const currentCustom = localStorage.getItem(customKey);
        let shouldUpdate = true;
        if (currentCustom) {
          try {
            const parsed = JSON.parse(currentCustom);
            if (parsed.customSaved || parsed.properties?.userSaved || parsed.objects?.some((o: any) => o.id?.startsWith("obj-custom"))) {
              shouldUpdate = false;
            }
          } catch {
            shouldUpdate = true;
          }
        }
        if (shouldUpdate) {
          localStorage.setItem(customKey, JSON.stringify(baked9));
          const snapshotsKey = "stage_snapshots_4_1_9";
          const snap: StageSnapshot = {
            id: `snap_${Date.now()}_connected_kamehameha_goku_v7`,
            timestamp: Date.now(),
            dateStr: "Oficial Carabanchel",
            name: baked9.name,
            data: JSON.parse(JSON.stringify(baked9))
          };
          localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
        }
      }
      localStorage.setItem(SYNC_KEY_W4L1_V7, "true");
    }

    const SYNC_KEY_W4L2_V1 = "megaramp_w4_l2_san_meliton_stages_v1";
    if (localStorage.getItem(SYNC_KEY_W4L2_V1) !== "true") {
      for (let st = 1; st <= 10; st++) {
        const baked = getBakedStage(4, 2, st);
        if (baked) {
          const customKey = `custom_stage_4_2_${st}`;
          const currentCustom = localStorage.getItem(customKey);
          let shouldUpdate = true;
          if (currentCustom) {
            try {
              const parsed = JSON.parse(currentCustom);
              if (parsed.customSaved || parsed.properties?.userSaved || parsed.objects?.some((o: any) => o.id?.startsWith("obj-custom"))) {
                shouldUpdate = false;
              }
            } catch {
              shouldUpdate = true;
            }
          }
          if (shouldUpdate) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_4_2_${st}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}_san_meliton_s${st}_v1`,
              timestamp: Date.now(),
              dateStr: "Oficial San Melitón",
              name: baked.name,
              data: JSON.parse(JSON.stringify(baked))
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
          }
        }
      }
      localStorage.setItem(SYNC_KEY_W4L2_V1, "true");
    }

    const SYNC_KEY_W4L2_V5 = "megaramp_w4_l2_s8_smooth_physics_no_static_v5";
    if (localStorage.getItem(SYNC_KEY_W4L2_V5) !== "true") {
      for (const st of [8, 9]) {
        const baked = getBakedStage(4, 2, st);
        if (baked) {
          const customKey = `custom_stage_4_2_${st}`;
          localStorage.setItem(customKey, JSON.stringify(baked));
          const snapshotsKey = `stage_snapshots_4_2_${st}`;
          const snap: StageSnapshot = {
            id: `snap_${Date.now()}_san_meliton_s${st}_v5`,
            timestamp: Date.now(),
            dateStr: "Oficial San Melitón V5",
            name: baked.name,
            data: JSON.parse(JSON.stringify(baked))
          };
          localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
        }
      }
      localStorage.setItem(SYNC_KEY_W4L2_V5, "true");
    }

    const SYNC_KEY_W4L2_V6 = "megaramp_w4_l2_s8_natural_jump_no_curbs_v6";
    if (localStorage.getItem(SYNC_KEY_W4L2_V6) !== "true") {
      const baked = getBakedStage(4, 2, 8);
      if (baked) {
        const customKey = `custom_stage_4_2_8`;
        localStorage.setItem(customKey, JSON.stringify(baked));
        const snapshotsKey = `stage_snapshots_4_2_8`;
        const snap: StageSnapshot = {
          id: `snap_${Date.now()}_san_meliton_s8_v6`,
          timestamp: Date.now(),
          dateStr: "Oficial San Melitón V6",
          name: baked.name,
          data: JSON.parse(JSON.stringify(baked))
        };
        localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
      }
      localStorage.setItem(SYNC_KEY_W4L2_V6, "true");
    }

    const SYNC_KEY_W4L3_V2 = "megaramp_w4_l3_las_cruces_stages_v2";
    if (localStorage.getItem(SYNC_KEY_W4L3_V2) !== "true") {
      for (let st = 1; st <= 10; st++) {
        const baked = getBakedStage(4, 3, st);
        if (baked) {
          const customKey = `custom_stage_4_3_${st}`;
          const currentCustom = localStorage.getItem(customKey);
          let shouldUpdate = true;
          if (currentCustom) {
            try {
              const parsed = JSON.parse(currentCustom);
              if (parsed.customSaved || parsed.properties?.userSaved || parsed.objects?.some((o: any) => o.id?.startsWith("obj-custom"))) {
                shouldUpdate = false;
              }
            } catch {
              shouldUpdate = true;
            }
          }
          if (shouldUpdate) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_4_3_${st}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}_las_cruces_s${st}_v2`,
              timestamp: Date.now(),
              dateStr: "Oficial Las Cruces",
              name: baked.name,
              data: JSON.parse(JSON.stringify(baked))
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
          }
        }
      }
      localStorage.setItem(SYNC_KEY_W4L3_V2, "true");
    }

    const SYNC_KEY_W4L3_V4 = "megaramp_w4_l3_parque_aluche_restored_user_68_5_v4";
    if (localStorage.getItem(SYNC_KEY_W4L3_V4) !== "true") {
      const baked9 = getBakedStage(4, 3, 9);
      if (baked9) {
        const customKey = "custom_stage_4_3_9";
        localStorage.setItem(customKey, JSON.stringify(baked9));
        const snapshotsKey = "stage_snapshots_4_3_9";
        const snap: StageSnapshot = {
          id: `snap_${Date.now()}_aluche_restored_68_v4`,
          timestamp: Date.now(),
          dateStr: "Guardado Recuperado +20m",
          name: baked9.name,
          data: JSON.parse(JSON.stringify(baked9))
        };
        localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
      }
      localStorage.setItem(SYNC_KEY_W4L3_V4, "true");
    }

    const SYNC_KEY_W4L3_V5 = "megaramp_w4_l3_escaleras_republicanas_24_steps_v5";
    if (localStorage.getItem(SYNC_KEY_W4L3_V5) !== "true") {
      const baked8 = getBakedStage(4, 3, 8);
      if (baked8) {
        const customKey = "custom_stage_4_3_8";
        localStorage.setItem(customKey, JSON.stringify(baked8));
        const snapshotsKey = "stage_snapshots_4_3_8";
        const snap: StageSnapshot = {
          id: `snap_${Date.now()}_escaleras_24_v5`,
          timestamp: Date.now(),
          dateStr: "24 Escalones Republicanos",
          name: baked8.name,
          data: JSON.parse(JSON.stringify(baked8))
        };
        localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
      }
      localStorage.setItem(SYNC_KEY_W4L3_V5, "true");
    }

    const SYNC_KEY_W4L3_V6 = "megaramp_w4_l3_lago_circular_stepping_stones_v6";
    if (localStorage.getItem(SYNC_KEY_W4L3_V6) !== "true") {
      const baked10 = getBakedStage(4, 3, 10);
      if (baked10) {
        const customKey = "custom_stage_4_3_10";
        localStorage.setItem(customKey, JSON.stringify(baked10));
        const snapshotsKey = "stage_snapshots_4_3_10";
        const snap: StageSnapshot = {
          id: `snap_${Date.now()}_lago_circular_v6`,
          timestamp: Date.now(),
          dateStr: "Plataformas Circulares Móviles",
          name: baked10.name,
          data: JSON.parse(JSON.stringify(baked10))
        };
        localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
      }
      localStorage.setItem(SYNC_KEY_W4L3_V6, "true");
    }

    const SYNC_KEY_W4L3_V7 = "megaramp_w4_l3_escaleras_republicanas_amphitheater_photo_replica_v7";
    if (localStorage.getItem(SYNC_KEY_W4L3_V7) !== "true") {
      const baked8 = getBakedStage(4, 3, 8);
      if (baked8) {
        const customKey = "custom_stage_4_3_8";
        localStorage.setItem(customKey, JSON.stringify(baked8));
        const snapshotsKey = "stage_snapshots_4_3_8";
        const snap: StageSnapshot = {
          id: `snap_${Date.now()}_amphitheater_photo_replica_v7`,
          timestamp: Date.now(),
          dateStr: "Anfiteatro Las Cruces Foto Réplica V7",
          name: baked8.name,
          data: JSON.parse(JSON.stringify(baked8))
        };
        localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
      }
      localStorage.setItem(SYNC_KEY_W4L3_V7, "true");
    }

    const SYNC_KEY_W4L4_V2 = "megaramp_w4_l4_islazul_stages_v2";
    if (localStorage.getItem(SYNC_KEY_W4L4_V2) !== "true") {
      for (let st = 1; st <= 10; st++) {
        const baked = getBakedStage(4, 4, st);
        if (baked) {
          const customKey = `custom_stage_4_4_${st}`;
          localStorage.setItem(customKey, JSON.stringify(baked));
          const snapshotsKey = `stage_snapshots_4_4_${st}`;
          const snap: StageSnapshot = {
            id: `snap_${Date.now()}_islazul_s${st}_v2`,
            timestamp: Date.now(),
            dateStr: "Oficial Islazul V2",
            name: baked.name,
            data: JSON.parse(JSON.stringify(baked))
          };
          localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
        }
      }
      localStorage.setItem(SYNC_KEY_W4L4_V2, "true");
    }

    const SYNC_KEY_W4L4_S4 = "megaramp_w4_l4_s4_muro4_moving_walls_v3";
    if (localStorage.getItem(SYNC_KEY_W4L4_S4) !== "true") {
      const baked4 = getBakedStage(4, 4, 4);
      if (baked4) {
        const customKey = "custom_stage_4_4_4";
        localStorage.setItem(customKey, JSON.stringify(baked4));
        const snapshotsKey = "stage_snapshots_4_4_4";
        const snap: StageSnapshot = {
          id: `snap_${Date.now()}_muro4_moving_walls_v3`,
          timestamp: Date.now(),
          dateStr: "Muro4 Murallas Móviles V3",
          name: baked4.name,
          data: JSON.parse(JSON.stringify(baked4))
        };
        localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
      }
      localStorage.setItem(SYNC_KEY_W4L4_S4, "true");
    }

    const SYNC_KEY_W4L4_S6 = "megaramp_w4_l4_s6_rodilla_15h50z_v7";
    if (localStorage.getItem(SYNC_KEY_W4L4_S6) !== "true") {
      const baked6 = getBakedStage(4, 4, 6);
      if (baked6) {
        const customKey = "custom_stage_4_4_6";
        localStorage.setItem(customKey, JSON.stringify(baked6));
        const snapshotsKey = "stage_snapshots_4_4_6";
        const snap: StageSnapshot = {
          id: `snap_${Date.now()}_rodilla_3sandwiches_bumpers_v5`,
          timestamp: Date.now(),
          dateStr: "Rodilla 3 Sándwiches Pirámide + Parachoques V5",
          name: baked6.name,
          data: JSON.parse(JSON.stringify(baked6))
        };
        localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
      }
      localStorage.setItem(SYNC_KEY_W4L4_S6, "true");
    }
  }

  getStageDisplayName(world: number, level: number, stage: number): string {
    const baked = getBakedStage(world, level, stage);
    if (baked?.name) return baked.name;
    try {
      const generated = LevelGenerator.generateStage(world, level, stage);
      return generated.name || `Etapa ${stage}`;
    } catch {
      return `Etapa ${stage}`;
    }
  }

  private getOrUpdateStageData(world: number, level: number, stage: number): LevelData {
    LevelEditor.syncOfficialStagesIfNeeded();
    const baked = getBakedStage(world, level, stage);
    const customKey = `custom_stage_${world}_${level}_${stage}`;
    const customJson = localStorage.getItem(customKey);

    if (customJson) {
      try {
        const parsed = JSON.parse(customJson);

        // If explicitly customized or saved by user in the 3D editor, NEVER overwrite it!
        const hasCustomObjects = Array.isArray(parsed?.objects) && parsed.objects.some((o: any) => o.id?.startsWith("obj-custom"));
        if (parsed.customSaved || parsed.properties?.userSaved || hasCustomObjects) {
          return parsed;
        }
        if(baked?.properties?.editorPublished)return structuredClone(baked);
        if ((world === 5 && level<=4 || world===6&&level<=4 || world===7&&level<=4) && baked) return structuredClone(baked);

        // If baked stage exists (such as M1-N2-E1 Bus or M1-N1 decorated stages) and the saved custom level is an obsolete pre-baked draft
        if (baked && world === 1 && level === 2 && stage === 1) {
          const hasBus = Array.isArray(parsed?.objects) && parsed.objects.some((o: any) => o.id?.startsWith("bus-"));
          if (!hasBus) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_${world}_${level}_${stage}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}`,
              timestamp: Date.now(),
              dateStr: "Oficial",
              name: baked.name,
              data: baked
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
            return JSON.parse(JSON.stringify(baked));
          }
        }

        if (baked && world === 1 && level === 1 && stage === 7) {
          const hasBulls = Array.isArray(parsed?.objects) && parsed.objects.some((o: any) => o.properties?.variant === "bull");
          if (!hasBulls) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_${world}_${level}_${stage}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}`,
              timestamp: Date.now(),
              dateStr: "Oficial",
              name: baked.name,
              data: baked
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
            return JSON.parse(JSON.stringify(baked));
          }
        }
        if (baked && world === 1 && level === 2 && stage === 6) {
          const hasMovingGates = Array.isArray(parsed?.objects) && parsed.objects.some((o: any) => o.id?.startsWith("s6-gate") && o.type === "moving-platform");
          if (!hasMovingGates) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_${world}_${level}_${stage}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}`,
              timestamp: Date.now(),
              dateStr: "Oficial",
              name: baked.name,
              data: baked
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
            return JSON.parse(JSON.stringify(baked));
          }
        }
        if (baked && world === 1 && level === 2 && stage === 9) {
          const hasTeleferico = Array.isArray(parsed?.objects) && parsed.objects.some((o: any) => o.properties?.variant === "teleferico" && o.type === "moving-platform");
          if (!hasTeleferico) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_${world}_${level}_${stage}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}`,
              timestamp: Date.now(),
              dateStr: "Oficial",
              name: baked.name,
              data: baked
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
            return JSON.parse(JSON.stringify(baked));
          }
        }
        if (baked && world === 2 && level === 1 && stage === 2) {
          const hasLagoon = Array.isArray(parsed?.objects) && parsed.objects.some((o: any) => o.id === "w2s2-lagoon-water");
          if (!hasLagoon) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_${world}_${level}_${stage}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}`,
              timestamp: Date.now(),
              dateStr: "Oficial",
              name: baked.name,
              data: baked
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
            return JSON.parse(JSON.stringify(baked));
          }
        }
        if (baked && world === 3 && level === 4 && stage === 8) {
          const hasTiltingRamp =
            Array.isArray(parsed?.objects) &&
            parsed.objects.some(
              (o: any) =>
                o.id === "w3s38-mega-slope" &&
                o.properties?.movementType === "tilt_x" &&
                Number(o.properties?.maxAngle) > 0
            );
          if (!hasTiltingRamp) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_${world}_${level}_${stage}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}`,
              timestamp: Date.now(),
              dateStr: "Rampa Basculante",
              name: baked.name,
              data: baked
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
            return JSON.parse(JSON.stringify(baked));
          }
        }
        if (baked && world === 3 && level === 4 && stage === 9) {
          const hasPitchBlack = Boolean(parsed?.properties?.pitchBlack);
          if (!hasPitchBlack) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_${world}_${level}_${stage}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}`,
              timestamp: Date.now(),
              dateStr: "Ruta Nocturna",
              name: baked.name,
              data: baked
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
            return JSON.parse(JSON.stringify(baked));
          }
        }
        if (baked && world === 4 && level === 1) {
          const hasW4Objects = Array.isArray(parsed?.objects) && parsed.objects.some((o: any) => o.id?.startsWith("w4s") || o.id?.startsWith("obj-custom"));
          if (!hasW4Objects) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_${world}_${level}_${stage}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}`,
              timestamp: Date.now(),
              dateStr: "Carabanchel Oficial",
              name: baked.name,
              data: baked
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
            return JSON.parse(JSON.stringify(baked));
          }
        }
        if (baked && world === 2 && level === 2 && stage === 4) {
          const hasUpdatedTram = Array.isArray(parsed?.objects) && parsed.objects.some((o: any) => o.id === "w2s4-tram-cabin" && o.scale?.z >= 7.0);
          if (!hasUpdatedTram) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_${world}_${level}_${stage}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}`,
              timestamp: Date.now(),
              dateStr: "Oficial",
              name: baked.name,
              data: baked
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
            return JSON.parse(JSON.stringify(baked));
          }
        }

        if (baked && world === 4 && level === 3 && stage === 8) {
          const has24Steps = Array.isArray(parsed?.objects) && parsed.objects.some((o: any) => o.id === "w4s38-step-24");
          if (!has24Steps) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_${world}_${level}_${stage}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}_escaleras_24_v5`,
              timestamp: Date.now(),
              dateStr: "24 Escalones Republicanos Oficial",
              name: baked.name,
              data: baked
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
            return JSON.parse(JSON.stringify(baked));
          }
        }

        if (baked && world === 4 && level === 3 && stage === 9) {
          const isElevated = (parsed?.spawn?.y ?? 0) >= 60.0;
          if (!isElevated) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_${world}_${level}_${stage}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}_aluche_restored_68_v4`,
              timestamp: Date.now(),
              dateStr: "Guardado Recuperado +20m",
              name: baked.name,
              data: baked
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
            return JSON.parse(JSON.stringify(baked));
          }
        }

        if (baked && world === 4 && level === 3 && stage === 6) {
          const hasHull = Array.isArray(parsed?.objects) && parsed.objects.some((o: any) => o.id === "w4s36-pirate-ship-hull");
          if (!hasHull) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_${world}_${level}_${stage}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}_pirata_hull_v3`,
              timestamp: Date.now(),
              dateStr: "Barco Pirata Oficial",
              name: baked.name,
              data: baked
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
            return JSON.parse(JSON.stringify(baked));
          }
        }

        if (baked && world === 4 && level === 3 && stage === 10) {
          const hasMovingStones = Array.isArray(parsed?.objects) && parsed.objects.some((o: any) => o.id === "w4s310-step-stone-1" && o.type === "moving-platform");
          if (!hasMovingStones) {
            localStorage.setItem(customKey, JSON.stringify(baked));
            const snapshotsKey = `stage_snapshots_${world}_${level}_${stage}`;
            const snap: StageSnapshot = {
              id: `snap_${Date.now()}_lago_circular_v6`,
              timestamp: Date.now(),
              dateStr: "Plataformas Circulares Oficial",
              name: baked.name,
              data: baked
            };
            localStorage.setItem(snapshotsKey, JSON.stringify([snap]));
            return JSON.parse(JSON.stringify(baked));
          }
        }

        return parsed;
      } catch {
        return baked ? JSON.parse(JSON.stringify(baked)) : LevelGenerator.generateStage(world, level, stage);
      }
    }

    return baked ? JSON.parse(JSON.stringify(baked)) : LevelGenerator.generateStage(world, level, stage);
  }

  loadStage(world: number, level: number, stage: number,version:'saved'|'original'='saved'): void {
    this.currentWorld = world;
    this.currentLevel = level;
    this.currentStage = stage;

    this.originalPreview=version==='original';
    this.levelData = applyRequestedStageUpdates(this.originalPreview ? structuredClone(getBakedStage(world,level,stage)??LevelGenerator.generateStage(world,level,stage)):this.getOrUpdateStageData(world, level, stage), world, level, stage);
    if(this.originalPreview){delete this.levelData.customSaved;if(this.levelData.properties)delete this.levelData.properties.userSaved;}

    // Apply level sky/panorama background
    this.applyEditorBackground(world, level);

    this.selectedObjectIndex = -1;
    if (this.currentWorld === 4 && this.currentLevel === 3 && this.currentStage === 4) {
      this.orbitTarget.set(0, 14, 0);
      this.orbitDistance = 42;
      this.orbitPitch = 0.08;
      this.orbitYaw = 0;
    } else if (this.currentWorld === 4 && this.currentLevel === 3 && this.currentStage === 8) {
      this.orbitTarget.set(0, 5.5, 8.0);
      this.orbitDistance = 55;
      this.orbitPitch = 0.40;
      this.orbitYaw = 0.55;
    } else if (this.currentWorld === 4 && this.currentLevel === 3 && this.currentStage === 9) {
      this.orbitTarget.set(0, 52, -5);
      this.orbitDistance = 65;
      this.orbitPitch = 0.40;
      this.orbitYaw = 0.6;
    } else if (this.currentWorld === 4 && this.currentLevel === 4) {
      if (this.currentStage === 1) { // 2Bus35
        this.orbitTarget.set(0, 4, -15);
        this.orbitDistance = 70;
        this.orbitPitch = 0.35;
        this.orbitYaw = 0.45;
      } else if (this.currentStage === 2) { // Primark
        this.orbitTarget.set(0, 3, 0);
        this.orbitDistance = 75;
        this.orbitPitch = 0.65;
        this.orbitYaw = 0.4;
      } else if (this.currentStage === 3) { // ToyPlanet
        this.orbitTarget.set(0, 10, 0);
        this.orbitDistance = 55;
        this.orbitPitch = 0.35;
        this.orbitYaw = 0.55;
      } else if (this.currentStage === 4) { // Muro4
        this.orbitTarget.set(0, 16, -10);
        this.orbitDistance = 65;
        this.orbitPitch = 0.35;
        this.orbitYaw = 0.5;
      } else if (this.currentStage === 6) { // Rodilla
        this.orbitTarget.set(0, 8, 0);
        this.orbitDistance = 85;
        this.orbitPitch = 0.4;
        this.orbitYaw = 0.55;
      } else if (this.currentStage === 7) { // TacoBell
        this.orbitTarget.set(0, 5, 0);
        this.orbitDistance = 75;
        this.orbitPitch = 0.35;
        this.orbitYaw = 0.65;
      } else if (this.currentStage === 8) { // TGB
        this.orbitTarget.set(0, 6, 0);
        this.orbitDistance = 68;
        this.orbitPitch = 0.45;
        this.orbitYaw = 0.5;
      } else if (this.currentStage === 9) { // YelmoCines
        this.orbitTarget.set(0, 10, -5);
        this.orbitDistance = 65;
        this.orbitPitch = 0.4;
        this.orbitYaw = 0.35;
      } else if (this.currentStage === 10) { // VivaGYM
        this.orbitTarget.set(0, 6, 0);
        this.orbitDistance = 85;
        this.orbitPitch = 0.38;
        this.orbitYaw = 0.5;
      } else {
        this.orbitTarget.set(0, 0, -10);
        this.orbitDistance = 45;
        this.orbitPitch = 0.5;
        this.orbitYaw = 0.6;
      }
    } else {
      this.orbitTarget.set(0, 0, -10);
      this.orbitDistance = 35;
      this.orbitPitch = 0.5;
      this.orbitYaw = 0.6;
    }
    this.updateCameraTransform();
    this.render3DObjects();
    this.renderUI();
    this.frameAsturiasStage();
    if (world === 5 && level <= 4 || world===6&&level<=3 || world===7&&level<=4) this.updateCameraTransform();
    this.showToast(
      `🗺️ Nivel cargado: M${world}-N${level}-E${stage} (${this.levelData.name})`,
      "#00e5ff"
    );
  }

  saveCurrentLevel(): void {
    this.levelData.world = this.currentWorld;
    this.levelData.level = this.currentLevel;
    this.levelData.stage = this.currentStage;
    this.levelData.customSaved = true;
    this.levelData.lastModified = Date.now();
    this.levelData.properties = {...this.levelData.properties,userSaved:true};
    const customKey = `custom_stage_${this.currentWorld}_${this.currentLevel}_${this.currentStage}`;
    try {
      localStorage.setItem(customKey,JSON.stringify(this.levelData));
      this.originalPreview=false;
      localStorage.removeItem(`stage_snapshots_${this.currentWorld}_${this.currentLevel}_${this.currentStage}`);
      this.renderUI();
      this.showToast(`💾 Versión guardada actualizada (M${this.currentWorld}-N${this.currentLevel}-E${this.currentStage})`,"#00e676");
    } catch(error) {
      alert("Error al guardar el nivel en almacenamiento local: "+error);
    }
  }

  revertCurrentLevel(): void {
    const customKey = `custom_stage_${this.currentWorld}_${this.currentLevel}_${this.currentStage}`;
    const snapshotsKey = `stage_snapshots_${this.currentWorld}_${this.currentLevel}_${this.currentStage}`;
    localStorage.removeItem(customKey);
    localStorage.removeItem(snapshotsKey);

    const baked = getBakedStage(this.currentWorld, this.currentLevel, this.currentStage);
    this.levelData = baked ? JSON.parse(JSON.stringify(baked)) : LevelGenerator.generateStage(this.currentWorld, this.currentLevel, this.currentStage);
    this.levelData = applyRequestedStageUpdates(this.levelData, this.currentWorld, this.currentLevel, this.currentStage);
    this.showToast("🔄 Nivel restablecido al diseño oficial del juego.", "#00e5ff");

    this.selectedObjectIndex = -1;
    if (this.currentWorld === 4 && this.currentLevel === 3 && this.currentStage === 4) {
      this.orbitTarget.set(0, 14, 0);
      this.orbitDistance = 42;
      this.orbitPitch = 0.08;
      this.orbitYaw = 0;
    } else if (this.currentWorld === 4 && this.currentLevel === 3 && this.currentStage === 8) {
      this.orbitTarget.set(0, 5.5, 8.0);
      this.orbitDistance = 55;
      this.orbitPitch = 0.40;
      this.orbitYaw = 0.55;
    } else if (this.currentWorld === 4 && this.currentLevel === 3 && this.currentStage === 9) {
      this.orbitTarget.set(0, 52, -5);
      this.orbitDistance = 65;
      this.orbitPitch = 0.40;
      this.orbitYaw = 0.6;
    } else if (this.currentWorld === 4 && this.currentLevel === 4) {
      if (this.currentStage === 1) { // 2Bus35
        this.orbitTarget.set(0, 4, -15);
        this.orbitDistance = 70;
        this.orbitPitch = 0.35;
        this.orbitYaw = 0.45;
      } else if (this.currentStage === 2) { // Primark
        this.orbitTarget.set(0, 3, 0);
        this.orbitDistance = 75;
        this.orbitPitch = 0.65;
        this.orbitYaw = 0.4;
      } else if (this.currentStage === 3) { // ToyPlanet
        this.orbitTarget.set(0, 10, 0);
        this.orbitDistance = 55;
        this.orbitPitch = 0.35;
        this.orbitYaw = 0.55;
      } else if (this.currentStage === 4) { // Muro4
        this.orbitTarget.set(0, 16, -10);
        this.orbitDistance = 65;
        this.orbitPitch = 0.35;
        this.orbitYaw = 0.5;
      } else if (this.currentStage === 6) { // Rodilla
        this.orbitTarget.set(0, 8, 0);
        this.orbitDistance = 85;
        this.orbitPitch = 0.4;
        this.orbitYaw = 0.55;
      } else if (this.currentStage === 7) { // TacoBell
        this.orbitTarget.set(0, 5, 0);
        this.orbitDistance = 75;
        this.orbitPitch = 0.35;
        this.orbitYaw = 0.65;
      } else if (this.currentStage === 8) { // TGB
        this.orbitTarget.set(0, 6, 0);
        this.orbitDistance = 68;
        this.orbitPitch = 0.45;
        this.orbitYaw = 0.5;
      } else if (this.currentStage === 9) { // YelmoCines
        this.orbitTarget.set(0, 10, -5);
        this.orbitDistance = 65;
        this.orbitPitch = 0.4;
        this.orbitYaw = 0.35;
      } else if (this.currentStage === 10) { // VivaGYM
        this.orbitTarget.set(0, 6, 0);
        this.orbitDistance = 85;
        this.orbitPitch = 0.38;
        this.orbitYaw = 0.5;
      } else {
        this.orbitTarget.set(0, 0, -10);
        this.orbitDistance = 45;
        this.orbitPitch = 0.5;
        this.orbitYaw = 0.6;
      }
    } else {
      this.orbitTarget.set(0, 0, -10);
      this.orbitDistance = 35;
      this.orbitPitch = 0.5;
      this.orbitYaw = 0.6;
    }
    this.updateCameraTransform();
    this.render3DObjects();
    this.renderUI();
  }

  private deleteSelectedObject(): void {
    if (this.selectedObjectIndex < 0 || this.selectedObjectIndex >= this.levelData.objects.length) return;
    this.levelData.objects.splice(this.selectedObjectIndex, 1);
    this.selectedObjectIndex = -1;
    this.render3DObjects();
    this.renderUI();
    this.showToast("🗑️ Objeto eliminado.", "#ff5252");
  }

  private duplicateSelectedObject(): void {
    if (this.selectedObjectIndex < 0 || this.selectedObjectIndex >= this.levelData.objects.length) {
      this.showToast("Selecciona un objeto para duplicarlo.", "#ffd700");
      return;
    }

    const orig = this.levelData.objects[this.selectedObjectIndex];
    const offsetZ = -Math.max(2, orig.scale.z);

    const clone: LevelObjectData = {
      id: `obj-custom-${Date.now()}`,
      type: orig.type,
      position: {
        x: Number(orig.position.x.toFixed(2)),
        y: Number(orig.position.y.toFixed(2)),
        z: Number((orig.position.z + offsetZ).toFixed(2))
      },
      rotation: { ...orig.rotation },
      scale: { ...orig.scale },
      properties: orig.properties ? JSON.parse(JSON.stringify(orig.properties)) : undefined
    };

    this.levelData.objects.push(clone);
    this.selectedObjectIndex = this.levelData.objects.length - 1;
    this.render3DObjects();
    this.renderUI();
    this.showToast("📑 ¡Bloque duplicado con éxito!", "#00e676");
  }

  private setSpawnAtSelected(): void {
    if (this.selectedObjectIndex < 0 || this.selectedObjectIndex >= this.levelData.objects.length) return;
    const obj = this.levelData.objects[this.selectedObjectIndex];
    this.levelData.spawn = {
      x: Number(obj.position.x.toFixed(2)),
      y: Number((obj.position.y + obj.scale.y / 2 + 1.2).toFixed(2)),
      z: Number(obj.position.z.toFixed(2))
    };
    this.render3DObjects();
    this.renderUI();
    this.showToast(
      `📍 Spawn establecido en (${this.levelData.spawn.x}, ${this.levelData.spawn.y}, ${this.levelData.spawn.z})`,
      "#00e5ff"
    );
  }

  private showToast(msg: string, color = "#00e5ff"): void {
    let toast = this.container.querySelector<HTMLElement>(".editor-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "editor-toast";
      this.container.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.borderColor = color;
    toast.style.display = "block";
    toast.style.opacity = "1";

    setTimeout(() => {
      if (toast) {
        toast.style.opacity = "0";
        setTimeout(() => {
          if (toast) toast.style.display = "none";
        }, 300);
      }
    }, 2600);
  }

  private showLevelSettingsModal(): void {
    const modal = document.createElement("div");
    modal.className = "modal-backdrop";

    const currentMusic = this.levelData.musicTrack || getWorldBGMTrack(this.currentWorld);
    const spawnPos = this.levelData.spawn || { x: 0, y: 1.5, z: 0 };

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 580px; width: 95%;">
        <h2>⚙️ Ajustes y Música del Nivel</h2>
        <p style="font-size: 0.85rem; opacity: 0.85; margin-bottom: 14px;">
          Personaliza la música de fondo, el bioma visual del cielo y el punto de inicio del jugador.
        </p>

        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px;">
          <div>
            <label style="display:block; font-size:0.8rem; margin-bottom:4px;"><strong>🏷️ Nombre del Nivel / Etapa:</strong></label>
            <input type="text" id="setting-level-name" class="form-select" style="padding: 8px 12px;" value="${this.levelData.name || "Nivel Personalizado"}" />
          </div>

          <div>
            <label style="display:block; font-size:0.8rem; margin-bottom:4px;"><strong>🎵 Música de Fondo (BGM Track):</strong></label>
            <div style="display: flex; gap: 8px; align-items: center;">
              <select id="setting-music-track" class="form-select" style="flex: 1;">
                ${AudioManager.TRACKS.map(
                  t => `
                  <option value="${t.id}" ${t.id === currentMusic ? "selected" : ""}>
                    ${t.name} (${t.bpm} BPM)
                  </option>
                `
                ).join("")}
              </select>
              <button class="btn btn-secondary" id="btn-preview-bgm" style="white-space: nowrap; padding: 8px 12px;">
                ▶️ Escuchar
              </button>
            </div>
          </div>

          <div>
            <label style="display:block; font-size:0.8rem; margin-bottom:4px;"><strong>🌄 Bioma y Cielo (Mundo):</strong></label>
            <select id="setting-world-theme" class="form-select" style="padding: 8px 12px;">
              ${WORLDS.map(
                w => `
                <option value="${w.id}" ${w.id === (this.levelData.world || this.currentWorld) ? "selected" : ""}>
                  ${w.icon} ${w.name}
                </option>
              `
              ).join("")}
            </select>
          </div>

          <div style="background: rgba(0, 0, 0, 0.28); padding: 10px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
            <label style="display:block; font-size:0.8rem; margin-bottom:6px; color: #00e5ff;"><strong>📍 Coordenadas de Spawn Inicial (Jugador):</strong></label>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
              <div>
                <span style="font-size: 0.72rem; opacity: 0.7;">X</span>
                <input type="number" step="0.5" id="setting-spawn-x" class="form-select" style="padding: 6px;" value="${spawnPos.x}" />
              </div>
              <div>
                <span style="font-size: 0.72rem; opacity: 0.7;">Y</span>
                <input type="number" step="0.5" id="setting-spawn-y" class="form-select" style="padding: 6px;" value="${spawnPos.y}" />
              </div>
              <div>
                <span style="font-size: 0.72rem; opacity: 0.7;">Z</span>
                <input type="number" step="0.5" id="setting-spawn-z" class="form-select" style="padding: 6px;" value="${spawnPos.z}" />
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 15px;">
          <button class="btn btn-secondary" id="btn-settings-cancel">Cancelar</button>
          <button class="btn btn-primary" id="btn-settings-save">💾 Aplicar Ajustes</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const musicSel = modal.querySelector<HTMLSelectElement>("#setting-music-track")!;
    const btnPreview = modal.querySelector<HTMLButtonElement>("#btn-preview-bgm")!;

    btnPreview.addEventListener("click", () => {
      const selectedTrack = musicSel.value;
      if (this.previewingBGM === selectedTrack) {
        this.audio.stopBGM();
        this.previewingBGM = null;
        btnPreview.textContent = "▶️ Escuchar";
      } else {
        this.audio.startBGM(selectedTrack);
        this.previewingBGM = selectedTrack;
        btnPreview.textContent = "⏹️ Detener";
      }
    });

    const cleanupModalAudio = () => {
      if (this.previewingBGM) {
        this.audio.stopBGM();
        this.previewingBGM = null;
      }
    };

    modal.querySelector("#btn-settings-cancel")?.addEventListener("click", () => {
      cleanupModalAudio();
      modal.remove();
    });

    modal.querySelector("#btn-settings-save")?.addEventListener("click", () => {
      cleanupModalAudio();
      const nameInp = modal.querySelector<HTMLInputElement>("#setting-level-name");
      const worldInp = modal.querySelector<HTMLSelectElement>("#setting-world-theme");
      const sxInp = modal.querySelector<HTMLInputElement>("#setting-spawn-x");
      const syInp = modal.querySelector<HTMLInputElement>("#setting-spawn-y");
      const szInp = modal.querySelector<HTMLInputElement>("#setting-spawn-z");

      if (nameInp) this.levelData.name = nameInp.value.trim() || this.levelData.name;
      this.levelData.musicTrack = musicSel.value;

      if (worldInp) {
        const wId = Number(worldInp.value);
        this.levelData.world = wId;
        this.currentWorld = wId;
      }

      this.levelData.spawn = {
        x: parseFloat(sxInp?.value || "0") || 0,
        y: parseFloat(syInp?.value || "1.5") || 1.5,
        z: parseFloat(szInp?.value || "0") || 0
      };

      modal.remove();
      this.applyEditorBackground(
        this.levelData.world || this.currentWorld,
        this.levelData.level || this.currentLevel
      );
      this.render3DObjects();
      this.renderUI();
      this.showToast("⚙️ ¡Ajustes del nivel actualizados con éxito!", "#00e676");
    });
  }

  private showLoadLevelModal(): void {
    const modal = document.createElement("div");
    modal.className = "modal-backdrop";

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 580px; width: 95%;">
        <h2>📂 Seleccionar y Cargar Nivel</h2>
        <p style="font-size: 0.85rem; opacity: 0.85; margin-bottom: 12px;">
          Elige el Mundo, Nivel y Etapa. Cada etapa tiene una versión original y una única versión guardada:
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 14px;">
          <div>
            <label style="display:block; font-size:0.8rem; margin-bottom:4px;"><strong>Mundo (1-8):</strong></label>
            <select id="modal-sel-world" class="form-select">
              ${WORLDS.map(
                w => `
                <option value="${w.id}" ${w.id === this.currentWorld ? "selected" : ""}>
                  ${w.icon} ${w.id}. ${w.name}
                </option>
              `
              ).join("")}
            </select>
          </div>

          <div>
            <label style="display:block; font-size:0.8rem; margin-bottom:4px;"><strong>Nivel (1-4):</strong></label>
            <select id="modal-sel-level" class="form-select">
              ${[1, 2, 3, 4]
                .map(
                  lvl => `
                <option value="${lvl}" ${lvl === this.currentLevel ? "selected" : ""}>
                  Nivel ${lvl}
                </option>
              `
                )
                .join("")}
            </select>
          </div>

          <div>
            <label style="display:block; font-size:0.8rem; margin-bottom:4px;"><strong>Etapa (1-10):</strong></label>
            <select id="modal-sel-stage" class="form-select">
              ${Array.from({ length: 10 }, (_, i) => i + 1)
                .map(
                  stg => {
                    const name = this.getStageDisplayName(this.currentWorld, this.currentLevel, stg);
                    return `<option value="${stg}" ${stg === this.currentStage ? "selected" : ""}>Etapa ${stg}: ${name}</option>`;
                  }
                )
                .join("")}
            </select>
          </div>
        </div>

        <div id="modal-stage-status" style="padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px; font-size: 0.85rem; margin-bottom: 14px;">
        </div>

        <div id="modal-stage-saved-container"></div>

        <!-- Copiar Etapa a otra Etapa -->
        <div style="margin-top: 14px; padding: 12px; background: rgba(0, 229, 255, 0.08); border: 1px solid rgba(0, 229, 255, 0.28); border-radius: 8px;">
          <label style="display: block; font-size: 0.82rem; font-weight: bold; color: #00e5ff; margin-bottom: 8px;">
            📋 Copiar diseño actual a otra etapa:
          </label>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 8px;">
            <div>
              <span style="font-size:0.72rem; opacity:0.75; display:block; margin-bottom:2px;">Mundo Destino:</span>
              <select id="modal-copy-w" class="form-select" style="padding: 5px 8px; font-size: 0.8rem;">
                ${WORLDS.map(w => `<option value="${w.id}">${w.icon} ${w.id}. ${w.name}</option>`).join("")}
              </select>
            </div>
            <div>
              <span style="font-size:0.72rem; opacity:0.75; display:block; margin-bottom:2px;">Nivel Destino:</span>
              <select id="modal-copy-l" class="form-select" style="padding: 5px 8px; font-size: 0.8rem;">
                ${[1, 2, 3, 4].map(lvl => `<option value="${lvl}">Nivel ${lvl}</option>`).join("")}
              </select>
            </div>
            <div>
              <span style="font-size:0.72rem; opacity:0.75; display:block; margin-bottom:2px;">Etapa Destino:</span>
              <select id="modal-copy-s" class="form-select" style="padding: 5px 8px; font-size: 0.8rem;">
                ${Array.from({ length: 10 }, (_, i) => i + 1).map(stg => `<option value="${stg}">Etapa ${stg}</option>`).join("")}
              </select>
            </div>
          </div>
          <button class="btn btn-secondary" id="btn-modal-copy-exec" style="width: 100%; font-size: 0.8rem; background: rgba(0, 229, 255, 0.22); border-color: #00e5ff; font-weight: bold;">
            📋 Copiar y Pegar en Destino
          </button>
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 15px;">
          <button class="btn btn-secondary" id="btn-modal-cancel">Cancelar</button>
          <button class="btn btn-primary" id="btn-modal-confirm">📂 Cargar Seleccionado</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const worldSel = modal.querySelector<HTMLSelectElement>("#modal-sel-world")!;
    const levelSel = modal.querySelector<HTMLSelectElement>("#modal-sel-level")!;
    const stageSel = modal.querySelector<HTMLSelectElement>("#modal-sel-stage")!;
    const statusBox = modal.querySelector<HTMLElement>("#modal-stage-status")!;
    const savedContainer = modal.querySelector<HTMLElement>("#modal-stage-saved-container")!;

    const renderStageVersions = () => {
      const w=Number(worldSel.value),l=Number(levelSel.value),s=Number(stageSel.value);
      const customKey=`custom_stage_${w}_${l}_${s}`;
      let saved:LevelData|undefined;
      try {
        const raw=localStorage.getItem(customKey);
        if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed.objects))saved=parsed;}
      } catch { /* A damaged saved entry does not hide the original version. */ }
      savedContainer.innerHTML=`
        <div style="display:grid;gap:12px;margin-bottom:14px">
          <div style="padding:12px;background:rgba(76,175,80,.08);border:1px solid #4caf5060;border-radius:8px">
            <strong>🌱 Versión original (sin guardar)</strong>
            <p style="font-size:.8rem;opacity:.8">Diseño base del juego. Cargarlo conserva tu versión guardada.</p>
            <button class="btn btn-secondary" id="btn-load-official-stage">Cargar versión original</button>
          </div>
          <div style="padding:12px;background:rgba(0,229,255,.05);border:1px solid #00e5ff40;border-radius:8px">
            <strong>💾 Versión guardada</strong>
            <p data-saved-version-info style="font-size:.8rem;opacity:.8"></p>
            <button class="btn btn-primary" id="btn-load-saved-stage" ${saved?'':'disabled'}>Cargar versión guardada</button>
            ${saved?'<button class="btn btn-secondary" id="btn-delete-saved-stage" style="margin-left:6px">Eliminar guardado</button>':''}
          </div>
        </div>`;
      savedContainer.querySelector('[data-saved-version-info]')!.textContent=saved
        ? `${saved.name} · ${saved.objects.length} elementos${saved.lastModified?' · '+new Date(saved.lastModified).toLocaleString('es-ES'):''}`
        : 'No hay una versión guardada de esta etapa.';
      savedContainer.querySelector('#btn-load-official-stage')?.addEventListener('click',()=>{
        modal.remove();this.loadStage(w,l,s,'original');
        this.showToast(`🌱 Versión original cargada: M${w}-N${l}-E${s}`,'#69f0ae');
      });
      savedContainer.querySelector('#btn-load-saved-stage')?.addEventListener('click',()=>{
        modal.remove();this.loadStage(w,l,s);
        this.showToast(`💾 Versión guardada cargada: M${w}-N${l}-E${s}`,'#00e5ff');
      });
      savedContainer.querySelector('#btn-delete-saved-stage')?.addEventListener('click',()=>{
        localStorage.removeItem(customKey);updateStatus();
        this.showToast('🗑️ Versión guardada eliminada. El diseño original sigue disponible.','#ff5252');
      });
    };

    const updateStatus = () => {
      const w = Number(worldSel.value);
      const l = Number(levelSel.value);
      const s = Number(stageSel.value);
      const isSaved = !!localStorage.getItem(`custom_stage_${w}_${l}_${s}`);
      const worldDef = getWorldById(w);

      statusBox.innerHTML = `
        <strong>${worldDef.icon} ${worldDef.name} - Nivel ${l} - Etapa ${s}</strong><br/>
        Estado: ${
          isSaved
            ? `<span style="color:#00e5ff; font-weight:bold;">✨ Guardado personalizado para el juego final</span>`
            : `<span style="color:#a5d6a7;">🌱 Diseño original del juego</span>`
        }
      `;

      renderStageVersions();
    };

    const updateModalStageOptions = () => {
      const w = Number(worldSel.value);
      const l = Number(levelSel.value);
      const curStage = Number(stageSel.value) || 1;
      stageSel.innerHTML = Array.from({ length: 10 }, (_, i) => i + 1)
        .map(stg => {
          const name = this.getStageDisplayName(w, l, stg);
          return `<option value="${stg}" ${stg === curStage ? "selected" : ""}>Etapa ${stg}: ${name}</option>`;
        })
        .join("");
    };

    worldSel.addEventListener("change", () => {
      updateModalStageOptions();
      updateStatus();
    });
    levelSel.addEventListener("change", () => {
      updateModalStageOptions();
      updateStatus();
    });
    stageSel.addEventListener("change", updateStatus);
    updateStatus();

    // Copy stage to another stage listener
    modal.querySelector("#btn-modal-copy-exec")?.addEventListener("click", () => {
      const dw = Number((modal.querySelector("#modal-copy-w") as HTMLSelectElement).value);
      const dl = Number((modal.querySelector("#modal-copy-l") as HTMLSelectElement).value);
      const ds = Number((modal.querySelector("#modal-copy-s") as HTMLSelectElement).value);

      const targetCustomKey = `custom_stage_${dw}_${dl}_${ds}`;
      const targetSnapKey = `stage_snapshots_${dw}_${dl}_${ds}`;

      const clonedData: LevelData = JSON.parse(JSON.stringify(this.levelData));
      clonedData.world = dw;
      clonedData.level = dl;
      clonedData.stage = ds;
      clonedData.customSaved = true;
      clonedData.lastModified=Date.now();
      if (!clonedData.properties) clonedData.properties = {};
      clonedData.properties.userSaved = true;

      localStorage.setItem(targetCustomKey, JSON.stringify(clonedData));

      // One saved version per destination; the baked original needs no storage.
      localStorage.removeItem(targetSnapKey);

      this.showToast(
        `📋 ¡Etapa M${this.currentWorld}-N${this.currentLevel}-E${this.currentStage} copiada con éxito a M${dw}-N${dl}-E${ds}!`,
        "#00e676"
      );

      // Refresh if the active selection in the modal matches destination
      if (
        dw === Number(worldSel.value) &&
        dl === Number(levelSel.value) &&
        ds === Number(stageSel.value)
      ) {
        updateStatus();
      }
    });

    modal.querySelector("#btn-modal-cancel")?.addEventListener("click", () => {
      modal.remove();
    });

    modal.querySelector("#btn-modal-confirm")?.addEventListener("click", () => {
      const w = Number(worldSel.value);
      const l = Number(levelSel.value);
      const s = Number(stageSel.value);
      modal.remove();
      this.loadStage(w, l, s);
    });
  }

  private renderUI(): void {
    const selected = this.levelData.objects[this.selectedObjectIndex];

    this.container.innerHTML = `
      <div class="editor-header">
        <div class="editor-title-wrap" style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1 1 auto;">
          <div class="editor-title" style="flex: 0 0 auto; font-weight: 800; font-size: 0.85rem;" title="Mundo ${this.currentWorld} - Nivel ${this.currentLevel}">
            🛠️ M${this.currentWorld}-N${this.currentLevel}
          </div>
          <div class="editor-stage-nav" style="display: flex; align-items: center; gap: 4px; min-width: 0;">
            <button class="btn btn-secondary" id="btn-prev-stage" title="Etapa anterior" ${this.currentStage <= 1 ? "disabled" : ""} style="padding: 4px 8px; font-size: 0.75rem; line-height: 1;">
              ◀
            </button>
            <select id="header-stage-select" class="form-select" style="padding: 4px 8px; font-size: 0.82rem; font-weight: bold; background: #1a2234; color: #00e5ff; border: 1px solid #00e5ff; border-radius: 6px; cursor: pointer; max-width: 220px; text-overflow: ellipsis;">
              ${Array.from({ length: 10 }, (_, i) => i + 1)
                .map(stg => {
                  const name = this.getStageDisplayName(this.currentWorld, this.currentLevel, stg);
                  return `<option value="${stg}" ${stg === this.currentStage ? "selected" : ""}>E${stg}: ${name}</option>`;
                })
                .join("")}
            </select>
            <button class="btn btn-secondary" id="btn-next-stage" title="Etapa siguiente" ${this.currentStage >= 10 ? "disabled" : ""} style="padding: 4px 8px; font-size: 0.75rem; line-height: 1;">
              ▶
            </button>
          </div>
        </div>
        <div class="editor-buttons">
          <button class="btn btn-primary" id="btn-level-settings" style="background: linear-gradient(135deg, #0288d1, #00b0ff); border-color: #00e5ff; font-weight: bold;">
            ⚙️ Ajustes
          </button>
          <button class="btn btn-secondary" id="btn-load-modal">📂 Cargar</button>
          <button class="btn btn-primary" id="btn-save-level" style="background: linear-gradient(135deg, #2e7d32, #00c853); border-color: #00e676; font-weight: bold;">
            💾 Guardar
          </button>
          <button class="btn btn-secondary" id="btn-revert-level">🔄 Restablecer</button>
          <button class="btn btn-primary" id="btn-playtest">▶️ Probar</button>
          <button class="btn btn-danger" id="btn-exit">❌ Salir</button>
        </div>
      </div>

      <div class="editor-panel editor-toolbox">
        <h3>Añadir Elemento</h3>
        <div class="tool-grid">
          <button class="btn-tool" data-add="platform">🟩 Plataforma</button>
          <button class="btn-tool" data-add="moving-platform">↔️ Plataforma Móvil</button>
          <button class="btn-tool" data-add="ramp">📐 Rampa</button>
          <button class="btn-tool" data-add="bumper">🔴 Parachoques</button>
          <button class="btn-tool" data-add="water">🌊 Bloque de Agua</button>
          <button class="btn-tool" data-add="honey">🍯 Bloque de Miel</button>
          <button class="btn-tool" data-add="lava">🌋 Bloque de Lava</button>
          <button class="btn-tool" data-add="decoration">🌸 Decoración</button>
          <button class="btn-tool" data-add="collectible"><span data-editor-collectible></span> Coleccionable</button>
          <button class="btn-tool" data-add="goal">🏁 Meta (Goal)</button>
        </div>

        <h3>Lista de Objetos (${this.levelData.objects.length})</h3>
        <div class="object-list">
          <div class="object-item ${this.selectedObjectIndex===SPAWN_SELECTION?'active':''}" data-idx="${SPAWN_SELECTION}"><strong>Punto de aparición · Spawn</strong></div>
          ${this.levelData.objects
            .map(
              (o, idx) => {
                const vInfo = this.getObjectVariantInfo(o);
                return `
              <div class="object-item ${idx === this.selectedObjectIndex ? "active" : ""}" data-idx="${idx}">
                <span style="display:flex; align-items:center; gap: 5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                  <strong>${idx + 1}.</strong>
                  <span class="badge" style="background:${vInfo.isCustom ? 'rgba(0, 229, 255, 0.25)' : 'rgba(255,255,255,0.1)'}; color:${vInfo.isCustom ? '#00e5ff' : '#ddd'}; font-size: 0.68rem; padding: 1px 5px; border-radius: 3px; font-weight: bold;">
                    ${vInfo.badge}
                  </span>
                  <span style="opacity: 0.75; font-size: 0.72rem;">(${o.position.x}, ${o.position.z})</span>
                </span>
                <button class="btn-del" data-del="${idx}">🗑️</button>
              </div>
            `;
              }
            )
            .join("")}
        </div>
      </div>

      ${
        this.selectedObjectIndex===SPAWN_SELECTION
          ? `<div class="editor-panel editor-inspector">
              <h3>Punto de aparición</h3>
              <p style="font-size:.8rem;opacity:.8;">La flecha amarilla indica la dirección inicial del juego.</p>
              ${(['x','y','z'] as const).map(axis=>`<label style="display:block;margin:10px 0;">Posición ${axis.toUpperCase()}<input class="form-select" id="inp-spawn-${axis}" type="number" step="0.25" value="${this.levelData.spawn[axis]}" /></label>`).join('')}
              <label>Dirección de salida (grados)<input class="form-select" id="inp-spawn-heading" type="number" step="5" value="${(this.spawnHeading*180/Math.PI).toFixed(1)}" /></label>
              <p style="font-size:.75rem;opacity:.75;">0° hacia −Z · 90° hacia +X</p>
            </div>`
          : selected
          ? (() => {
              const vInfo = this.getObjectVariantInfo(selected);
              return `
        <div class="editor-panel editor-inspector">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <h3 style="margin:0; border:none; padding:0;">Propiedades (${selected.type})</h3>
            <button class="btn btn-secondary" id="btn-duplicate" style="padding: 4px 8px; font-size: 0.75rem; background: rgba(0, 229, 255, 0.2); border-color: #00e5ff;">
              📑 Duplicar
            </button>
          </div>

          <!-- Special Type / 3D Model Badge & Information Card -->
          <div class="prop-group" style="background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(124, 77, 255, 0.15)); padding: 10px; border-radius: 8px; border: 1px solid rgba(0, 229, 255, 0.4); margin-bottom: 10px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold; color: #00e5ff;">✨ Tipo Especial / Modelo 3D:</span>
              <span class="badge" style="background: ${vInfo.isCustom ? '#00e5ff' : 'rgba(255,255,255,0.2)'}; color: ${vInfo.isCustom ? '#000' : '#fff'}; font-weight: bold; padding: 2px 7px; border-radius: 4px; font-size: 0.75rem;">${vInfo.badge}</span>
            </div>
            <div style="font-size: 0.95rem; font-weight: bold; color: #fff; margin-bottom: 4px;">
              ${vInfo.title}
            </div>
            <div style="font-size: 0.76rem; opacity: 0.85; line-height: 1.35; margin-bottom: 8px;">
              ${vInfo.description}
            </div>

            ${
              selected.type === "platform" || selected.type === "moving-platform"
                ? `
            <label style="font-size: 0.75rem; margin-bottom: 3px; display: block;"><strong>🔄 Asignar / Cambiar Variante:</strong></label>
            <select id="inp-object-variant" class="form-select" style="padding: 5px; font-size: 0.8rem;">
              <option value="" ${!selected.properties?.variant ? "selected" : ""}>📦 Normal (Sin variante especial)</option>
              <option value="casino_roulette" ${selected.properties?.variant === "casino_roulette" ? "selected" : ""}>🎰 Ruleta de Casino 3D</option>
              <option value="yacht" ${selected.properties?.variant === "yacht" ? "selected" : ""}>🛥️ Yate de Lujo 3D</option>
              <option value="market_stall" ${selected.properties?.variant === "market_stall" ? "selected" : ""}>🎪 Puesto de Mercadillo 3D</option>
              <option value="shop" ${selected.properties?.variant === "shop" || selected.properties?.variant === "store" ? "selected" : ""}>🏬 Tienda Comercial 3D</option>
              <option value="tram_square" ${selected.properties?.variant === "tram_square" ? "selected" : ""}>🚊 Tranvía (Circuito Cuadrado 90°)</option>
              <option value="tram_circle" ${selected.properties?.variant === "tram_circle" ? "selected" : ""}>🚊 Tranvía (Giro Circular)</option>
              <option value="tram_rails" ${selected.properties?.variant === "tram_rails" ? "selected" : ""}>🛤️ Raíles de Tranvía</option>
              <option value="bike_wheel_vertical" ${selected.properties?.variant === "bike_wheel_vertical" ? "selected" : ""}>🚲 Rueda Vertical Bici</option>
              <option value="bike_pedal" ${selected.properties?.variant === "bike_pedal" ? "selected" : ""}>🚴 Pedal de Bicicleta</option>
              <option value="limp_kicker" ${selected.properties?.variant === "limp_kicker" || selected.properties?.variant === "cojo" ? "selected" : ""}>🦵 Cojo / Pateador con Escayola</option>
              <option value="teleferico" ${selected.properties?.variant === "teleferico" ? "selected" : ""}>🚡 Cabina de Teleférico</option>
              <option value="padel_racket" ${selected.properties?.variant === "padel_racket" ? "selected" : ""}>🎾 Pala de Pádel Catapulta</option>
              <option value="olla" ${selected.properties?.variant === "olla" ? "selected" : ""}>🎡 La Olla Giratoria</option>
              <option value="fan_5blades" ${selected.properties?.variant === "fan_5blades" ? "selected" : ""}>🌀 Ventilador de 5 Aspas</option>
              <option value="beach_kiosk" ${selected.properties?.variant === "beach_kiosk" ? "selected" : ""}>🏖️ Kiosko de Playa 3D</option>
              <option value="hippie_stall" ${selected.properties?.variant === "hippie_stall" ? "selected" : ""}>☮️ Puesto Hippie 3D</option>
              <option value="giant_umbrella" ${selected.properties?.variant === "giant_umbrella" || selected.properties?.movementType === "giant_umbrella" ? "selected" : ""}>⛱️ Sombrilla Gigante 3D</option>
              <option value="beach_towel" ${selected.properties?.variant === "beach_towel" || selected.properties?.movementType === "towel_wave" ? "selected" : ""}>🌊 Toalla de Playa 3D</option>
              <option value="wave_pusher" ${selected.properties?.variant === "wave_pusher" || selected.properties?.movementType === "wave_pusher" ? "selected" : ""}>🌊 Ola Empujadora 3D</option>
              <option value="emt_bus_35" ${selected.properties?.variant === "emt_bus_35" || selected.properties?.movementType === "emt_bus_35" ? "selected" : ""}>🚌 Autobús EMT Línea 35 (Madrid)</option>
              <option value="tram_linear" ${selected.properties?.variant === "tram_linear" || selected.properties?.movementType === "tram_linear" ? "selected" : ""}>🚊 Tranvía Recto (144m)</option>
              <option value="tram_straight_rails" ${selected.properties?.variant === "tram_straight_rails" ? "selected" : ""}>🛤️ Raíles Rectos con Catenaria</option>
              <option value="giant_bouncy_palm" ${selected.properties?.variant === "giant_bouncy_palm" ? "selected" : ""}>🌴 Palmera Gigante con Hojas Rebote</option>
              <option value="mercadona_shelves" ${selected.properties?.variant === "mercadona_shelves" ? "selected" : ""}>🛒 Estanterías Mercadona</option>
              <option value="supermarket_checkout" ${selected.properties?.variant === "supermarket_checkout" ? "selected" : ""}>💳 Caja de Supermercado</option>
              <option value="shopping_carts" ${selected.properties?.variant === "shopping_carts" ? "selected" : ""}>🛒 Carros de Compra</option>
              <option value="bazar_shelves" ${selected.properties?.variant === "bazar_shelves" ? "selected" : ""}>🏺 Estanterías de Bazar</option>
              <option value="clothesline" ${selected.properties?.variant === "clothesline" ? "selected" : ""}>👕 Tendedero con Ropa</option>
              <option value="popeye_pizza" ${selected.properties?.variant === "popeye_pizza" || selected.properties?.movementType === "popeye_pizza" ? "selected" : ""}>🍕 Pizza Gigante Popeye 3D</option>
              <option value="popeye_billboard" ${selected.properties?.variant === "popeye_billboard" ? "selected" : ""}>🪧 Cartel Luminoso Popeye</option>
              <option value="stracciatella_cone" ${selected.properties?.variant === "stracciatella_cone" ? "selected" : ""}>🍦 Cucurucho Helado Stracciatella</option>
              <option value="slamming_door" ${selected.properties?.variant === "slamming_door" || selected.properties?.movementType === "slamming_door" ? "selected" : ""}>🚪 Puerta Blanca con Portazo</option>
              <option value="litos_duo" ${selected.properties?.variant === "litos_duo" || selected.properties?.movementType === "litos_duo" ? "selected" : ""}>👫 Pareja Litos (Carabanchel)</option>
              <option value="misina_cat" ${selected.properties?.variant === "misina_cat" ? "selected" : ""}>🐱 Portal Gata Misina</option>
              <option value="salamander_platform" ${selected.properties?.variant === "salamander_platform" ? "selected" : ""}>🦎 Plataforma Salamandra</option>
              <option value="village_dogs" ${selected.properties?.variant === "village_dogs" || selected.properties?.movementType === "village_dogs" ? "selected" : ""}>🐕 Perro de Pueblo</option>
              <option value="village_girls" ${selected.properties?.variant === "village_girls" || selected.properties?.movementType === "village_girls" ? "selected" : ""}>👧 Niña con Coletitas</option>
              <option value="village_boys" ${selected.properties?.variant === "village_boys" || selected.properties?.movementType === "village_boys" ? "selected" : ""}>👦 Niño de Montaña</option>
              <option value="turron_cat" ${selected.properties?.variant === "turron_cat" || selected.properties?.movementType === "turron_cat" ? "selected" : ""}>🐈 Gato Turrón</option>
              <option value="a4_sheet" ${selected.properties?.variant === "a4_sheet" ? "selected" : ""}>📄 Lámina A4 para Colorear (Dibujo)</option>
              <option value="kamehameha_beam" ${selected.properties?.variant === "kamehameha_beam" ? "selected" : ""}>⚡ Haz Kamehameha Tubular 3D</option>
              <option value="kamehameha_burst" ${selected.properties?.variant === "kamehameha_burst" ? "selected" : ""}>💥 Detonación Kamehameha 3D</option>
              <option value="kamehameha_charge" ${selected.properties?.variant === "kamehameha_charge" ? "selected" : ""}>🌀 Carga Kamehameha (Origen Goku)</option>
            </select>
            `
                : ""
            }

            ${
              selected.type === "water"
                ? `
            <div style="background: rgba(0, 180, 216, 0.2); border: 1px solid rgba(0, 180, 216, 0.5); padding: 8px 10px; border-radius: 6px; margin-top: 6px;">
              <label style="display: flex; align-items: center; gap: 8px; margin: 0; cursor: pointer; font-weight: bold; color: #e0f7fa; font-size: 0.82rem;">
                <input type="checkbox" id="inp-water-passable" style="width: 17px; height: 17px; cursor: pointer;"
                  ${(selected.properties?.passable !== false && selected.properties?.hasCollision !== true && selected.properties?.solid !== true) ? "checked" : ""} />
                <span>🌊 Traspasable (Caerse al agua / Sin colisión sólida)</span>
              </label>
              <div style="font-size: 0.72rem; opacity: 0.85; margin-top: 4px; line-height: 1.35;">
                ${(selected.properties?.passable !== false && selected.properties?.hasCollision !== true && selected.properties?.solid !== true)
                  ? "✅ <strong>Traspasable activo:</strong> La bola traspasa el agua, salpica y cae al vacío para perder vidas."
                  : "⛔ <strong>Sólido activo:</strong> El agua actúa como plataforma sólida sobre la que puedes caminar/rodar."}
              </div>
            </div>
            `
                : ""
            }
          </div>

          <!-- Color / Texture biome customization for blocks -->
          ${
            selected.type === "platform" || selected.type === "moving-platform" || selected.type === "ramp"
              ? `
            <div class="prop-group" style="background: rgba(255, 255, 255, 0.05); padding: 8px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.15);">
              <label><strong>🎨 Textura / Bioma del Bloque:</strong></label>
              <select id="inp-block-theme" class="form-select" style="padding: 6px; font-size: 0.8rem;">
                <option value="default" ${(!selected.properties?.theme || selected.properties.theme === "default") ? "selected" : ""}>🌍 Bioma Actual del Nivel</option>
                <option value="villamanta" ${selected.properties?.theme === "villamanta" ? "selected" : ""}>🌾 Villamanta (Tierra y Arcilla)</option>
                <option value="alicante" ${selected.properties?.theme === "alicante" ? "selected" : ""}>🏖️ Alicante (Arena Dorada y Playa)</option>
                <option value="mesegal" ${selected.properties?.theme === "mesegal" ? "selected" : ""}>🌲 Mesegal (Pizarra y Musgo)</option>
                <option value="pebbles" ${selected.properties?.theme === "pebbles" ? "selected" : ""}>🪨 Piedrecitas / Fuente (Rocallosas)</option>
                <option value="era_slate" ${selected.properties?.theme === "era_slate" ? "selected" : ""}>🪨 Era de Pizarra (Mesegal)</option>
                <option value="carabanchel" ${selected.properties?.theme === "carabanchel" ? "selected" : ""}>🧱 Carabanchel (Ladrillo Urbano)</option>
                <option value="asturias" ${selected.properties?.theme === "asturias" ? "selected" : ""}>🍃 Asturias (Césped Esmeralda)</option>
                <option value="londres" ${selected.properties?.theme === "londres" ? "selected" : ""}>❄️ Londres (Adoquines Nevados)</option>
                <option value="sakura" ${selected.properties?.theme === "sakura" ? "selected" : ""}>🌸 Japón (Madera Sakura)</option>
                <option value="neon" ${selected.properties?.theme === "neon" ? "selected" : ""}>⚡ Japón Neón (Cyberpunk)</option>
                <option value="noruega" ${selected.properties?.theme === "noruega" ? "selected" : ""}>🧊 Noruega (Hielo Ártico)</option>
                <option value="gold" ${selected.properties?.theme === "gold" ? "selected" : ""}>✨ Oro Metálico Arcade</option>
                <option value="chrome" ${selected.properties?.theme === "chrome" ? "selected" : ""}>🪞 Cromo Metálico Reflectante</option>
                <option value="drawing_sheet" ${selected.properties?.theme === "drawing_sheet" || selected.properties?.theme === "coloring_sheet" ? "selected" : ""}>📄 Folio A4 (Dibujos para Colorear)</option>
                <option value="custom_color" ${selected.properties?.theme === "custom_color" ? "selected" : ""}>🎨 Color Sólido Personalizado...</option>
              </select>

              <div id="wrap-custom-color" class="color-picker-row" style="${selected.properties?.theme === "custom_color" ? "" : "display:none;"}">
                <input type="color" id="inp-custom-color" value="${(selected.properties?.customColor as string) || (selected.properties?.color as string) || "#4caf50"}" />
                <input type="text" id="inp-custom-color-text" style="flex:1; margin-bottom:0;" value="${(selected.properties?.customColor as string) || (selected.properties?.color as string) || "#4caf50"}" />
              </div>
            </div>

            <!-- Huecos y Forma Geométrica -->
            <div class="prop-group" style="background: rgba(33, 150, 243, 0.08); padding: 8px; border-radius: 8px; border: 1px solid rgba(33, 150, 243, 0.25); margin-top: 6px;">
              <label><strong>🕳️ Huecos y Forma Geométrica:</strong></label>
              <select id="inp-platform-shape" class="form-select" style="padding: 6px; font-size: 0.8rem;">
                <option value="box" ${(!selected.properties?.shape && !selected.properties?.platformShape) || selected.properties?.shape === "box" || selected.properties?.platformShape === "box" ? "selected" : ""}>📦 Sólido Rectangular / Caja</option>
                <option value="hollow_rect" ${selected.properties?.shape === "hollow_rect" || selected.properties?.platformShape === "hollow_rect" || Boolean(selected.properties?.hole) ? "selected" : ""}>🕳️ Marco con Hueco Central (Fuente / Rejilla)</option>
                <option value="hexagon" ${selected.properties?.shape === "hexagon" || selected.properties?.platformShape === "hexagon" ? "selected" : ""}>🔷 Hexagonal (6 Caras)</option>
                <option value="cylinder" ${selected.properties?.shape === "cylinder" || selected.properties?.platformShape === "cylinder" ? "selected" : ""}>⚪ Cilíndrica / Circular</option>
                <option value="l_shape" ${selected.properties?.shape === "l_shape" || selected.properties?.platformShape === "l_shape" ? "selected" : ""}>📐 Forma de L</option>
              </select>

              <div id="wrap-hole-settings" style="${(selected.properties?.shape === "hollow_rect" || selected.properties?.platformShape === "hollow_rect" || Boolean(selected.properties?.hole)) ? "display:block; margin-top: 6px;" : "display:none; margin-top: 6px;"}">
                <div style="font-size: 0.72rem; opacity: 0.85; margin-bottom: 4px; color: #90caf9;">Configuración del Hueco (Apertura por donde caer/atravesar):</div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                  <div>
                    <label style="font-size: 0.7rem; margin-bottom: 2px;">Ancho Hueco (X)</label>
                    <input type="number" step="0.5" id="inp-hole-width" value="${(selected.properties?.holeWidth as number) ?? (selected.properties?.holeSizeX as number) ?? Math.max(1, selected.scale.x * 0.5)}" />
                  </div>
                  <div>
                    <label style="font-size: 0.7rem; margin-bottom: 2px;">Largo Hueco (Z)</label>
                    <input type="number" step="0.5" id="inp-hole-length" value="${(selected.properties?.holeLength as number) ?? (selected.properties?.holeDepth as number) ?? (selected.properties?.holeSizeZ as number) ?? Math.max(1, selected.scale.z * 0.5)}" />
                  </div>
                  <div>
                    <label style="font-size: 0.7rem; margin-bottom: 2px;">Desplazamiento X</label>
                    <input type="number" step="0.5" id="inp-hole-offset-x" value="${(selected.properties?.holeOffsetX as number) ?? 0}" />
                  </div>
                  <div>
                    <label style="font-size: 0.7rem; margin-bottom: 2px;">Desplazamiento Z</label>
                    <input type="number" step="0.5" id="inp-hole-offset-z" value="${(selected.properties?.holeOffsetZ as number) ?? 0}" />
                  </div>
                </div>
              </div>
            </div>
          `
              : ""
          }

          ${
            selected.type === "bumper" || selected.type === "cylinder"
              ? `
            <div class="prop-group" style="background: rgba(233, 30, 99, 0.12); padding: 8px; border-radius: 8px; border: 1px solid rgba(233, 30, 99, 0.3);">
              <label><strong>🔴 Color del Parachoques:</strong></label>
              <div class="color-picker-row">
                <input type="color" id="inp-bumper-color" value="${(selected.properties?.customColor as string) || (selected.properties?.color as string) || "#e91e63"}" />
                <input type="text" id="inp-bumper-color-text" style="flex:1; margin-bottom:0;" value="${(selected.properties?.customColor as string) || (selected.properties?.color as string) || "#e91e63"}" />
              </div>

              <label style="margin-top: 6px;"><strong>⚡ Potencia de Rebote:</strong></label>
              <select id="inp-bumper-bounce" class="form-select" style="padding: 6px; font-size: 0.8rem;">
                <option value="0.5" ${Number(selected.properties?.bounce ?? 0.95) <= 0.6 ? "selected" : ""}>Amortiguado (0.5x)</option>
                <option value="0.95" ${Number(selected.properties?.bounce ?? 0.95) > 0.6 && Number(selected.properties?.bounce ?? 0.95) < 1.3 ? "selected" : ""}>Estándar Arcade (0.95x)</option>
                <option value="1.35" ${Number(selected.properties?.bounce ?? 0.95) >= 1.3 && Number(selected.properties?.bounce ?? 0.95) < 1.8 ? "selected" : ""}>Fuerte Impulso Toro (1.35x)</option>
                <option value="2.5" ${Number(selected.properties?.bounce ?? 0.95) >= 1.8 ? "selected" : ""}>🚀 Super Cañón (2.5x)</option>
              </select>

              <label style="margin-top: 6px;"><strong>🐂 Modelo / Variante:</strong></label>
              <select id="inp-bumper-variant" class="form-select" style="padding: 6px; font-size: 0.8rem;">
                <option value="cylinder" ${selected.properties?.variant !== "bull" ? "selected" : ""}>Cilindro Clásico</option>
                <option value="bull" ${selected.properties?.variant === "bull" ? "selected" : ""}>Toro Bravo (Móvil)</option>
              </select>

              <label style="margin-top: 6px;"><strong>🔷 Forma Geométrica:</strong></label>
              <select id="inp-bumper-shape" class="form-select" style="padding: 6px; font-size: 0.8rem;">
                <option value="cylinder" ${(!selected.properties?.shape && !selected.properties?.platformShape) || selected.properties?.shape === "cylinder" || selected.properties?.platformShape === "cylinder" ? "selected" : ""}>⚪ Cilíndrico Clásico (Círculo)</option>
                <option value="hexagon" ${selected.properties?.shape === "hexagon" || selected.properties?.platformShape === "hexagon" ? "selected" : ""}>🔷 Hexagonal (6 Caras - Quesos / Miel)</option>
                <option value="box" ${selected.properties?.shape === "box" || selected.properties?.platformShape === "box" ? "selected" : ""}>📦 Cuadrado / Bloque de Rebote</option>
              </select>
            </div>
          `
              : ""
          }
          
          <div class="prop-group">
            <label>Posición X</label>
            <input type="number" step="0.5" id="inp-px" value="${selected.position.x}" />
            <label>Posición Y</label>
            <input type="number" step="0.5" id="inp-py" value="${selected.position.y}" />
            <label>Posición Z</label>
            <input type="number" step="0.5" id="inp-pz" value="${selected.position.z}" />
          </div>

          <div class="prop-group">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <label>Dimensiones (Escala X, Y, Z)</label>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px;">
              <input type="number" step="0.5" id="inp-sx" placeholder="X" value="${selected.scale.x}" />
              <input type="number" step="0.5" id="inp-sy" placeholder="Y" value="${selected.scale.y}" />
              <input type="number" step="0.5" id="inp-sz" placeholder="Z" value="${selected.scale.z}" />
            </div>

            ${
              selected.type === "platform" || selected.type === "moving-platform" || selected.type === "ramp"
                ? `
              <div style="margin-top: 4px;">
                <span style="font-size: 0.72rem; opacity: 0.7;">Presets de tamaño rápido:</span>
                <div class="preset-btn-row">
                  <button class="btn-preset" data-size="8,0.8,8">8×8 Cubo</button>
                  <button class="btn-preset" data-size="2.5,0.8,16">2.5×16 Pasarela</button>
                  <button class="btn-preset" data-size="14,0.8,14">14×14 Plaza</button>
                  <button class="btn-preset" data-size="6,0.8,24">6×24 Pista</button>
                  <button class="btn-preset" data-size="4,0.8,4">4×4 Salto</button>
                </div>
              </div>
            `
                : ""
            }
          </div>

          <div class="prop-group" style="background: rgba(255, 255, 255, 0.04); padding: 8px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.12);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <label style="margin: 0;"><strong>📐 Inclinación y Giro (Rotación 3D):</strong></label>
              <span style="font-size: 0.68rem; opacity: 0.8; color: #4fc3f7;">Orden YXZ (Desacoplado)</span>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px;">
              <div>
                <label style="font-size: 0.68rem; margin-bottom: 2px;" title="Inclinación longitudinal de subida o bajada (Pitch)">
                  Subida X (rad)
                </label>
                <input type="number" step="0.02" id="inp-rx" placeholder="X (Subida)" value="${Number((selected.rotation.x || 0).toFixed(3))}" />
                <div style="font-size: 0.66rem; opacity: 0.7; text-align: center;">${((selected.rotation.x || 0) * 180 / Math.PI).toFixed(0)}°</div>
              </div>

              <div>
                <label style="font-size: 0.68rem; margin-bottom: 2px;" title="Giro o dirección horizontal de la plataforma / rampa (Yaw)">
                  Giro Y (rad)
                </label>
                <input type="number" step="0.05" id="inp-ry" placeholder="Y (Giro)" value="${Number((selected.rotation.y || 0).toFixed(3))}" />
                <div style="font-size: 0.66rem; opacity: 0.7; text-align: center;">${((selected.rotation.y || 0) * 180 / Math.PI).toFixed(0)}°</div>
              </div>

              <div>
                <label style="font-size: 0.68rem; margin-bottom: 2px;" title="Peralte o inclinación lateral (Roll)">
                  Peralte Z (rad)
                </label>
                <input type="number" step="0.02" id="inp-rz" placeholder="Z (Peralte)" value="${Number((selected.rotation.z || 0).toFixed(3))}" />
                <div style="font-size: 0.66rem; opacity: 0.7; text-align: center;">${((selected.rotation.z || 0) * 180 / Math.PI).toFixed(0)}°</div>
              </div>
            </div>

            ${
              selected.type === "ramp" || selected.type === "platform"
                ? `
              <div style="margin-top: 6px;">
                <span style="font-size: 0.7rem; opacity: 0.75; display: block; margin-bottom: 2px;">⚡ Presets de Inclinación (Subida/Bajada X):</span>
                <div class="preset-btn-row">
                  <button class="btn-preset" data-rx="0">0° Plana</button>
                  <button class="btn-preset" data-rx="0.28">16° Subida (+)</button>
                  <button class="btn-preset" data-rx="0.52">30° Empinada</button>
                  <button class="btn-preset" data-rx="-0.28">-16° Bajada (-)</button>
                  <button class="btn-preset" data-rx="-0.52">-30° Bajada</button>
                </div>

                <span style="font-size: 0.7rem; opacity: 0.75; display: block; margin-top: 5px; margin-bottom: 2px;">🧭 Presets de Giro / Rumbo (Dirección Y):</span>
                <div class="preset-btn-row">
                  <button class="btn-preset" data-ry="0">0° Norte (Frente)</button>
                  <button class="btn-preset" data-ry="1.5708">90° Este (+X)</button>
                  <button class="btn-preset" data-ry="3.1416">180° Sur (Atrás)</button>
                  <button class="btn-preset" data-ry="-1.5708">-90° Oeste (-X)</button>
                </div>
              </div>
            `
                : ""
            }
          </div>

          ${
            selected.type === "moving-platform"
              ? `
            <div class="prop-group" style="background: rgba(2, 136, 209, 0.15); border: 1px solid rgba(0, 229, 255, 0.4); padding: 10px; border-radius: 8px; margin-top: 10px;">
              <h4 style="margin: 0 0 8px 0; font-size: 0.85rem; color: #00e5ff;">⚙️ Parámetros Plataforma Móvil</h4>
              
              <label>Tipo de Trayectoria</label>
              <select id="inp-prop-movement-type" class="form-select" style="padding: 6px; font-size: 0.85rem; margin-top: 2px;">
                <option value="sine" ${(selected.properties?.movementType ?? "sine") === "sine" ? "selected" : ""}>Oscilación Lineal (Vaivén)</option>
                <option value="circular" ${selected.properties?.movementType === "circular" || selected.properties?.movementType === "orbit" ? "selected" : ""}>Órbita Circular (Alrededor de centro)</option>
              </select>

              <label>Velocidad de Movimiento ${(selected.properties?.movementType === "circular" || selected.properties?.movementType === "orbit") ? "(rad/s)" : "(m/s)"}</label>
              <input type="number" step="0.1" min="0.1" max="15" id="inp-prop-speed" value="${selected.properties?.speed ?? 2.0}" />

              ${(selected.properties?.movementType === "circular" || selected.properties?.movementType === "orbit") ? `
                <label>Radio Orbital (metros)</label>
                <input type="number" step="0.5" min="1" max="50" id="inp-prop-radius" value="${selected.properties?.radius ?? 12.0}" />

                <label>Sentido de Giro</label>
                <select id="inp-prop-direction" class="form-select" style="padding: 6px; font-size: 0.85rem; margin-top: 2px;">
                  <option value="1" ${Number(selected.properties?.direction ?? 1) >= 0 ? "selected" : ""}>Antihorario (+)</option>
                  <option value="-1" ${Number(selected.properties?.direction ?? 1) < 0 ? "selected" : ""}>Horario (-)</option>
                </select>
              ` : `
                <label>Distancia de Recorrido (metros)</label>
                <input type="number" step="1" min="1" max="40" id="inp-prop-distance" value="${selected.properties?.distance ?? 6.0}" />

                <label>Eje de Recorrido</label>
                <select id="inp-prop-axis" class="form-select" style="padding: 6px; font-size: 0.85rem; margin-top: 2px;">
                  <option value="x" ${(selected.properties?.axis ?? "x") === "x" ? "selected" : ""}>X (Izquierda ↔ Derecha)</option>
                  <option value="y" ${(selected.properties?.axis ?? "x") === "y" ? "selected" : ""}>Y (Arriba ↕ Abajo / Ascensor)</option>
                  <option value="z" ${(selected.properties?.axis ?? "x") === "z" ? "selected" : ""}>Z (Adelante ↔ Atrás)</option>
                </select>
              `}
            </div>
          `
              : ""
          }

          ${
            selected.type === "decoration"
              ? `
            <div class="prop-group" style="background: rgba(76, 175, 80, 0.15); border: 1px solid rgba(76, 175, 80, 0.4); padding: 10px; border-radius: 8px; margin-top: 10px;">
              <h4 style="margin: 0 0 8px 0; font-size: 0.85rem; color: #81c784;">🌸 Tipo de Decoración</h4>
              <label>Elemento Decorativo</label>
              <select id="inp-prop-subtype" class="form-select" style="padding: 6px; font-size: 0.85rem; margin-top: 2px;">
                <option value="madrid_metro_sign" ${(selected.properties?.subType ?? "tree") === "madrid_metro_sign" ? "selected" : ""}>🚇 Tótem Metro de Madrid (Chocable)</option>
                <option value="madrid_street_sign_carabanchel" ${(selected.properties?.subType ?? "tree") === "madrid_street_sign_carabanchel" ? "selected" : ""}>🪧 Placa Cerámica C/ Piqueñas Carabanchel (Chocable)</option>
                <option value="madrid_street_lamp_urban" ${(selected.properties?.subType ?? "tree") === "madrid_street_lamp_urban" ? "selected" : ""}>🏮 Farola Fernandina Madrid (Chocable)</option>
                <option value="madrid_recycle_bins" ${(selected.properties?.subType ?? "tree") === "madrid_recycle_bins" ? "selected" : ""}>♻️ Trío Contenedores Reciclaje Madrid (Chocable)</option>
                <option value="madrid_granite_bollard" ${(selected.properties?.subType ?? "tree") === "madrid_granite_bollard" ? "selected" : ""}>⚪ Bolardo Esférico de Granito (Chocable)</option>
                <option value="madrid_terrace_bar_umbrella" ${(selected.properties?.subType ?? "tree") === "madrid_terrace_bar_umbrella" ? "selected" : ""}>⛱️ Sombrilla y Terraza de Bar Madrileño (Chocable)</option>
                <option value="madrid_residential_building" ${(selected.properties?.subType ?? "tree") === "madrid_residential_building" ? "selected" : ""}>🏢 Edificio de Ladrillo Carabanchel (Chocable)</option>
                <option value="madrid_bus_stop" ${(selected.properties?.subType ?? "tree") === "madrid_bus_stop" ? "selected" : ""}>🚏 Marquesina EMT Madrid L35 (Chocable)</option>
                <option value="madrid_traffic_light" ${(selected.properties?.subType ?? "tree") === "madrid_traffic_light" ? "selected" : ""}>🚦 Semáforo Urbano de Madrid (Chocable)</option>
                <option value="bazar_shelf_display" ${(selected.properties?.subType ?? "tree") === "bazar_shelf_display" ? "selected" : ""}>📦 Estantería Góndola Bazar Chino (Chocable)</option>
                <option value="madrid_kiosk_press" ${(selected.properties?.subType ?? "tree") === "madrid_kiosk_press" ? "selected" : ""}>📰 Quiosco de Prensa Madrileño (Chocable)</option>
                <option value="giant_goku_saiyan" ${(selected.properties?.subType ?? "tree") === "giant_goku_saiyan" ? "selected" : ""}>⚡ Escultura Monumental Goku Super Saiyan (Chocable)</option>
                <option value="village_fountain" ${(selected.properties?.subType ?? "tree") === "village_fountain" ? "selected" : ""}>⛲ Fuente de Piedra de Mesegal (Chocable)</option>
                <option value="village_church_tower" ${(selected.properties?.subType ?? "tree") === "village_church_tower" ? "selected" : ""}>⛪ Torre y Campanario de Pinofranqueado (Chocable)</option>
                <option value="stone_bridge_arch" ${(selected.properties?.subType ?? "tree") === "stone_bridge_arch" ? "selected" : ""}>🌉 Arco de Puente de Piedra de Pinofranqueado (Atravesable por dentro)</option>
                <option value="pine_hurdes" ${(selected.properties?.subType ?? "tree") === "pine_hurdes" ? "selected" : ""}>🌲 Pino Serrano de Las Hurdes (Chocable)</option>
                <option value="hurdes_stone_wall" ${(selected.properties?.subType ?? "tree") === "hurdes_stone_wall" ? "selected" : ""}>🧱 Muro Tradicional de Pizarra Hurdana (Chocable)</option>
                <option value="hurdes_mountain_house" ${(selected.properties?.subType ?? "tree") === "hurdes_mountain_house" ? "selected" : ""}>🏡 Casa Rústica Hurdana de Montaña (Chocable)</option>
                <option value="terrace_table_set" ${(selected.properties?.subType ?? "tree") === "terrace_table_set" ? "selected" : ""}>☕ Mesa y Sillas de Terraza de Bar (Chocable)</option>
                <option value="village_lantern_post" ${(selected.properties?.subType ?? "tree") === "village_lantern_post" ? "selected" : ""}>🏮 Farola Clásica de Forja de Pueblo (Chocable)</option>
                <option value="wooden_bench_rustic" ${(selected.properties?.subType ?? "tree") === "wooden_bench_rustic" ? "selected" : ""}>🪑 Banco Rústico de Castaño (Chocable)</option>
                <option value="spar_supermarket_sign" ${(selected.properties?.subType ?? "tree") === "spar_supermarket_sign" ? "selected" : ""}>🏪 Rótulo Supermercado SPAR (Chocable)</option>
                <option value="pergola_green_post" ${(selected.properties?.subType ?? "tree") === "pergola_green_post" ? "selected" : ""}>🟢 Poste Verde de Pérgola y Cables (Chocable)</option>
                <option value="waterfall_rock_cliff" ${(selected.properties?.subType ?? "tree") === "waterfall_rock_cliff" ? "selected" : ""}>🧗 Risco Rocoso Cascada El Chorrito (Chocable)</option>
                <option value="village_stones" ${(selected.properties?.subType ?? "tree") === "village_stones" ? "selected" : ""}>🪨 Piedritas de Río y Pizarra</option>
                <option value="moss_patch" ${(selected.properties?.subType ?? "tree") === "moss_patch" ? "selected" : ""}>🌱 Parche de Musgo Verde Serrano</option>
                <option value="plush_bear" ${(selected.properties?.subType ?? "tree") === "plush_bear" ? "selected" : ""}>🧸 Oso de Peluche 3D (Chocable)</option>
                <option value="jewelry_bust" ${(selected.properties?.subType ?? "tree") === "jewelry_bust" ? "selected" : ""}>💎 Busto de Joyas con Collar (Chocable)</option>
                <option value="store_shelf" ${(selected.properties?.subType ?? "tree") === "store_shelf" ? "selected" : ""}>📦 Estantería Comercial de Tienda (Chocable)</option>
                <option value="surf_rack" ${(selected.properties?.subType ?? "tree") === "surf_rack" ? "selected" : ""}>🏄 Expositor de Tablas de Surf (Chocable)</option>
                <option value="arcade_cabinet" ${(selected.properties?.subType ?? "tree") === "arcade_cabinet" ? "selected" : ""}>🕹️ Máquina Recreativa Arcade (Chocable)</option>
                <option value="gelato_display" ${(selected.properties?.subType ?? "tree") === "gelato_display" ? "selected" : ""}>🍨 Vitrina de Helados 3D (Chocable)</option>
                <option value="bakery_counter" ${(selected.properties?.subType ?? "tree") === "bakery_counter" ? "selected" : ""}>☕ Mostrador Cafetería & Croissants (Chocable)</option>
                <option value="fashion_mannequin" ${(selected.properties?.subType ?? "tree") === "fashion_mannequin" ? "selected" : ""}>👗 Maniquí de Moda con Vestido (Chocable)</option>
                <option value="sneaker_rack" ${(selected.properties?.subType ?? "tree") === "sneaker_rack" ? "selected" : ""}>👟 Expositor Zapatillas Sneakers (Chocable)</option>
                <option value="checkout_counter" ${(selected.properties?.subType ?? "tree") === "checkout_counter" ? "selected" : ""}>💳 Mostrador Caja Registradora (Chocable)</option>
                <option value="palm_tree" ${(selected.properties?.subType ?? "tree") === "palm_tree" ? "selected" : ""}>🌴 Palmera Costera (Chocable)</option>
                <option value="beach_umbrella" ${(selected.properties?.subType ?? "tree") === "beach_umbrella" ? "selected" : ""}>⛱️ Sombrilla de Playa (Chocable)</option>
                <option value="lifeguard_chair" ${(selected.properties?.subType ?? "tree") === "lifeguard_chair" ? "selected" : ""}>🪑 Torre de Socorrista (Chocable)</option>
                <option value="float_ring" ${(selected.properties?.subType ?? "tree") === "float_ring" ? "selected" : ""}>🛟 Flotador Salvavidas (Chocable)</option>
                <option value="sunbed" ${(selected.properties?.subType ?? "tree") === "sunbed" ? "selected" : ""}>🏖️ Tumbona con Toalla (Chocable)</option>
                <optgroup label="Asturias · Oviedo">
                  ${[
                    ["cathedral", "Catedral de Oviedo"], ["fountain", "Fuente de piedra"], ["sidreria", "Sidrería"],
                    ["bronze", "Estatua de bronce"], ["flag", "Bandera de Asturias"], ["lamp", "Farola de Oviedo"],
                    ["bench", "Banco de madera"], ["apple_tree", "Manzano"], ["horreo", "Hórreo"],
                    ["cider", "Barril y botellas de sidra"], ["cheese", "Queso asturiano"], ["bagpipe", "Gaita"],
                    ["cow", "Vaca"], ["stone_wall", "Muro de piedra"], ["cart", "Carro de madera"],
                    ["peak", "Pico de caliza"], ["sign", "Cartel"], ["marking", "Marca vial"],
                    ["car", "Coche"], ["beach", "Sombrilla de playa"], ["lighthouse", "Faro"],
                    ["buoy", "Boya"], ["gull", "Gaviota"], ["shelf", "Estantería amarilla"],
                    ["pan", "Sartén con tallarines"], ["mafalda", "Mafalda"], ["plate", "Plato"],
                    ["cangas_chapel", "Ermita de la Santa Cruz"], ["cangas_dolmen", "Dolmen"],
                    ["cangas_cross", "Cruz de la Victoria"], ["cangas_kayak", "Piragua del Sella"],
                    ["cangas_aircon", "Aire acondicionado"], ["cangas_magnet", "Imán de Asturias"],
                    ["cangas_open_horreo", "Hórreo con entrada"], ["cangas_fabada", "Plato de fabada"],
                    ["cangas_bridge", "Arcos del puente de Cangas"],
                    ...(["asturias_cangas_track", "asturias_cangas_air_jet", "asturias_cangas_jump_pad", "asturias_cangas_magnet_zone"]
                      .includes(String(selected.properties?.subType))
                      ? [[String(selected.properties?.subType).slice(9), "Pieza de recorrido de Cangas"]] : [])
                  ].map(([id, label]) => `<option value="asturias_${id}" ${selected.properties?.subType === "asturias_" + id ? "selected" : ""}>${label}</option>`).join("")}
                </optgroup>
                <optgroup label="🛶 Descenso del Sella">
                  ${[["river","Río y orillas"],["canoe","Canoa de remos"],["rock","Roca peligrosa"],["gull","Gaviota del Sella"],["waterfall","Cascada"]].map(([id,label])=>`<option value="asturias_sella_${id}" ${selected.properties?.subType===`asturias_sella_${id}` ? "selected":""}>${label}</option>`).join("")}
                </optgroup>
                <optgroup label="⛰️ Picos de Covadonga">
                  ${[["bus","Autobús asturiano"],["road","Carretera de montaña"],["cow","Vaca asturiana"],["cart","Vagoneta minera"],["mine","Mina y desvíos"],["cannon","Cañón del mirador"],["basilica","Basílica de Covadonga"],["fountain","Fuente de los siete caños"],["landscape","Paisaje de los Picos"],["beech","Haya"],["sheep","Oveja"],["chamois","Rebeco"],["spring","Fuente de piedra"],["waymarker","Hito de sendero"]].map(([id,label])=>`<option value="asturias_cov_${id}" ${selected.properties?.subType===`asturias_cov_${id}` ? "selected":""}>${label}</option>`).join("")}
                </optgroup>
                <optgroup label="Londres · Queens Park">
                  ${[...LONDON_DECORATIONS,...[["plane","Avión Iberia"],["train","Tren Underground"],["station","Estación"],["crow","Cuervo"],["punch","Primo Punch"],["hair","Plancha de pelo"],["trap","Trampa retráctil"],["path","Camino londinense"],["maze","Laberinto"],["street","Calle nevada"],["scenery","Barrio de fondo"]]].map(([id,label])=>`<option value="london_${id}" ${selected.properties?.subType===`london_${id}` ? "selected":""}>${label}</option>`).join("")}
                </optgroup>
                <optgroup label="Navidad en Londres">
                  ${CHRISTMAS_DECORATIONS.map(([id,label])=>`<option value="london_${id}" ${selected.properties?.subType===`london_${id}` ? "selected":""}>${label}</option>`).join("")}
                </optgroup>
                <optgroup label="Oxford · Colleges y Navidad">
                  ${OXFORD_DECORATIONS.map(([id,label])=>`<option value="oxford_${id}" ${selected.properties?.subType===`oxford_${id}` ? 'selected':''}>${label}</option>`).join('')}
                  ${BIG_BEN_DECORATIONS.map(([id,label])=>`<option value="bigben_${id}" ${selected.properties?.subType===`bigben_${id}` ? 'selected':''}>${label}</option>`).join('')}
                  ${KYOTO_DECORATIONS.map(([id,label])=>`<option value="kyoto_${id}" ${selected.properties?.subType===`kyoto_${id}` ? 'selected':''}>${label}</option>`).join('')}
                  ${NARA_DECORATIONS.map(([id,label])=>`<option value="nara_${id}" ${selected.properties?.subType===`nara_${id}` ? 'selected':''}>${label}</option>`).join('')}
                  ${AURORA_DECORATIONS.map(([id,label])=>`<option value="aurora_${id}" ${selected.properties?.subType===`aurora_${id}` ? 'selected':''}>${label}</option>`).join('')}
                  ${OSLO_DECORATIONS.map(([id,label])=>`<option value="oslo_${id}" ${selected.properties?.subType===`oslo_${id}` ? 'selected':''}>${label}</option>`).join('')}

                  ${FJORD_DECORATIONS.map(([id,label])=>`<option value="fjord_${id}" ${selected.properties?.subType===`fjord_${id}` ? 'selected':''}>${label}</option>`).join('')}

                  ${NORWAY_DECORATIONS.map(([id,label])=>`<option value="norway_${id}" ${selected.properties?.subType===`norway_${id}` ? 'selected':''}>${label}</option>`).join('')}
                  ${TOKYO_DECORATIONS.map(([id,label])=>`<option value="tokyo_${id}" ${selected.properties?.subType===`tokyo_${id}` ? 'selected':''}>${label}</option>`).join('')}
                  ${OSAKA_DECORATIONS.map(([id,label])=>`<option value="osaka_${id}" ${selected.properties?.subType===`osaka_${id}` ? 'selected':''}>${label}</option>`).join('')}
                </optgroup>
                <optgroup label="Museum · Salas y Antigüedad">
                  ${[["diamond","Hollow Diamond · Biblioteca"],["reading_room","Reading Room"],["pyramid","Pirámide de ocho alturas"],["parthenon","Partenón"],["statue","Escultura griega"],["column","Columna clásica"],["roman_arch","Arco romano"],["amphora","Ánfora"],["sarcophagus","Sarcófago"],["obelisk","Obelisco"],["bookshelf","Librería"],["fossil","Fósil"],["display_case","Vitrina"],["basin","Plato profundo"],["coffee","Taza de café"],["painting_wall","Galería de cuadros"],["gem_disk","Plataforma de gema"],["goal_glass","Cristal de meta"],["hall","Sala monumental"],["chase_hall","Hintze Hall · Persecución"],["jump_pad","Impulsor Salto6"],["reflecting_pool","Estanque de galería"]].map(([id,label])=>`<option value="museum_${id}" ${selected.properties?.subType===`museum_${id}` ? "selected":""}>${label}</option>`).join("")}
                  <option value="museum_animal" ${selected.properties?.subType==="museum_animal" ? "selected":""}>Animal prehistórico</option>
                </optgroup>
                <option value="tree" ${(selected.properties?.subType ?? "tree") === "tree" ? "selected" : ""}>🌳 Arbolito con Fruta (Chocable)</option>
                <option value="fence" ${(selected.properties?.subType ?? "tree") === "fence" ? "selected" : ""}>🪵 Valla Rústica (Chocable)</option>
                <option value="lantern" ${(selected.properties?.subType ?? "tree") === "lantern" ? "selected" : ""}>🏮 Farolillo de Campo (Chocable)</option>
                <option value="town_hall" ${(selected.properties?.subType ?? "tree") === "town_hall" ? "selected" : ""}>🏛️ Ayuntamiento de Villamanta</option>
                <option value="dia_sign" ${(selected.properties?.subType ?? "tree") === "dia_sign" ? "selected" : ""}>🏪 Rótulo Supermercados DÍA</option>
                <option value="bench" ${(selected.properties?.subType ?? "tree") === "bench" ? "selected" : ""}>🪑 Banco de la Plaza Mayor</option>
                <option value="seashell" ${(selected.properties?.subType ?? "tree") === "seashell" ? "selected" : ""}>🐚 Concha Marina</option>
                <option value="bush" ${(selected.properties?.subType ?? "tree") === "bush" ? "selected" : ""}>🌿 Arbusto con Bayas</option>
                <option value="flower" ${(selected.properties?.subType ?? "tree") === "flower" ? "selected" : ""}>🌸 Flores Silvestres</option>
                <option value="bird" ${(selected.properties?.subType ?? "tree") === "bird" ? "selected" : ""}>🐦 Pajarito Animado</option>
              </select>

              <div style="margin-top: 8px; display: flex; align-items: center; gap: 8px;">
                <input type="checkbox" id="inp-prop-collision" style="width: 16px; height: 16px; cursor: pointer;" ${
                  (selected.properties?.hasCollision !== undefined
                    ? selected.properties.hasCollision
                    : (selected.properties?.subType === "asturias_cangas_track" ||
                       selected.properties?.subType === "asturias_cangas_fabada" ||
                       selected.properties?.subType === "asturias_peak" ||
                       selected.properties?.subType === "asturias_shelf" ||
                       selected.properties?.subType === "tree" ||
                       selected.properties?.subType === "fence" ||
                       (selected.properties?.subType ?? "tree") === "lantern" ||
                       selected.properties?.subType === "town_hall" ||
                       selected.properties?.subType === "bench" ||
                       selected.properties?.subType === "palm_tree" ||
                       selected.properties?.subType === "lifeguard_chair" ||
                       selected.properties?.subType === "beach_umbrella" ||
                       selected.properties?.subType === "float_ring" ||
                       selected.properties?.subType === "sunbed" ||
                       selected.properties?.subType === "plush_bear" ||
                       selected.properties?.subType === "jewelry_bust" ||
                       selected.properties?.subType === "store_shelf" ||
                       selected.properties?.subType === "surf_rack" ||
                       selected.properties?.subType === "arcade_cabinet" ||
                       selected.properties?.subType === "gelato_display" ||
                       selected.properties?.subType === "bakery_counter" ||
                       selected.properties?.subType === "fashion_mannequin" ||
                       selected.properties?.subType === "sneaker_rack" ||
                       selected.properties?.subType === "checkout_counter" ||
                       selected.properties?.subType === "hurdes_stone_wall" ||
                       selected.properties?.subType === "village_fountain" ||
                       selected.properties?.subType === "stone_bridge_arch" ||
                       selected.properties?.subType === "pine_hurdes" ||
                       selected.properties?.subType === "village_church_tower" ||
                       selected.properties?.subType === "terrace_table_set" ||
                       selected.properties?.subType === "village_lantern_post" ||
                       selected.properties?.subType === "wooden_bench_rustic" ||
                       selected.properties?.subType === "spar_supermarket_sign" ||
                       selected.properties?.subType === "hurdes_mountain_house" ||
                       selected.properties?.subType === "pergola_green_post" ||
                       selected.properties?.subType === "waterfall_rock_cliff" ||
                       selected.properties?.subType === "madrid_metro_sign" ||
                       selected.properties?.subType === "madrid_street_sign_carabanchel" ||
                       selected.properties?.subType === "madrid_street_lamp_urban" ||
                       selected.properties?.subType === "madrid_recycle_bins" ||
                       selected.properties?.subType === "madrid_granite_bollard" ||
                       selected.properties?.subType === "madrid_terrace_bar_umbrella" ||
                       selected.properties?.subType === "madrid_residential_building" ||
                       selected.properties?.subType === "madrid_bus_stop" ||
                       selected.properties?.subType === "madrid_traffic_light" ||
                       selected.properties?.subType === "bazar_shelf_display" ||
                       selected.properties?.subType === "madrid_kiosk_press" ||
                       selected.properties?.subType === "giant_goku_saiyan"))
                    ? "checked"
                    : ""
                } />
                <label for="inp-prop-collision" style="font-size: 0.82rem; cursor: pointer; margin: 0;">💥 Colisión física (Chocable)</label>
              </div>
            </div>

            ${
              selected.properties?.subType === "asturias_cov_cow"
                ? `<div class="prop-group"><label>Pelaje de la vaca</label><select id="inp-cow-breed">${[["brown","Marrón asturiana"],["dairy","Lechera con manchas"],["black","Negra"],["white","Blanca"]].map(([value,label])=>`<option value="${value}" ${(selected.properties?.cowBreed??"brown")===value ? "selected":""}>${label}</option>`).join("")}</select></div>` : ""
            }
            ${selected.properties?.subType==="museum_animal" ? `<div class="prop-group"><label>Animal prehistórico</label><select id="inp-museum-species">${[...MUSEUM_ANIMALS,"trex"].map(species=>`<option value="${species}" ${selected.properties?.species===species ? "selected":""}>${species.replaceAll("_"," ")}</option>`).join("")}</select><label><input type="checkbox" id="inp-museum-santa" ${selected.properties?.santa ? "checked":""}> Gorro de Santa Claus</label></div>`:""}
            ${
              selected.properties?.subType === "madrid_residential_building"
                ? `
            <div class="prop-group" style="background: rgba(176, 58, 46, 0.15); border: 1px solid rgba(176, 58, 46, 0.4); padding: 10px; border-radius: 8px; margin-top: 10px;">
              <h4 style="margin: 0 0 8px 0; font-size: 0.85rem; color: #ff8a80;">🏢 Edificio Residencial Carabanchel</h4>
              <div style="margin-bottom: 8px;">
                <label style="font-size: 0.78rem; opacity: 0.85; display: block; margin-bottom: 4px;">🎨 Color de la Fachada:</label>
                <select id="sel-building-facade-color" style="width: 100%; background: #1e293b; color: #fff; border: 1px solid #475569; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">
                  <option value="brick" ${(selected.properties?.facadeColor ?? "brick") === "brick" ? "selected" : ""}>🧱 Ladrillo Rojo Caravista (Clásico)</option>
                  <option value="white" ${selected.properties?.facadeColor === "white" ? "selected" : ""}>🏛️ Blanco / Crema Estucado</option>
                  <option value="yellow" ${selected.properties?.facadeColor === "yellow" ? "selected" : ""}>🌞 Amarillo / Albero Madrileño</option>
                  <option value="orange" ${selected.properties?.facadeColor === "orange" ? "selected" : ""}>🍊 Naranja / Salmón Caravista</option>
                </select>
              </div>
              <div>
                <label style="font-size: 0.78rem; opacity: 0.85; display: block; margin-bottom: 4px;">🏪 Comercio en Planta Baja:</label>
                <select id="sel-building-shop-type" style="width: 100%; background: #1e293b; color: #fff; border: 1px solid #475569; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">
                  <option value="portal" ${(selected.properties?.shopType ?? "portal") === "portal" ? "selected" : ""}>🚪 Portal Residencial</option>
                  <option value="farmacia" ${selected.properties?.shopType === "farmacia" ? "selected" : ""}>💊 Farmacia (Cruz Verde)</option>
                  <option value="bazar" ${selected.properties?.shopType === "bazar" ? "selected" : ""}>🏺 Bazar Chino / Alimentación</option>
                  <option value="garage" ${selected.properties?.shopType === "garage" ? "selected" : ""}>🚗 Vado / Portón de Garaje</option>
                </select>
              </div>
            </div>
            `
                : ""
            }
          `
              : ""
          }

          ${
            selected.type === "water" || (selected.type as string) === "honey"
              ? `
            <div class="prop-group" style="background: ${(selected.type as string) === "honey" || selected.properties?.fluidType === "honey" ? "rgba(245, 158, 11, 0.15)" : "rgba(0, 180, 216, 0.15)"}; border: 1px solid ${(selected.type as string) === "honey" || selected.properties?.fluidType === "honey" ? "rgba(245, 158, 11, 0.4)" : "rgba(0, 180, 216, 0.4)"}; padding: 10px; border-radius: 8px; margin-top: 10px;">
              <h4 style="margin: 0 0 8px 0; font-size: 0.85rem; color: ${(selected.type as string) === "honey" || selected.properties?.fluidType === "honey" ? "#f59e0b" : "#00b4d8"};">${(selected.type as string) === "honey" || selected.properties?.fluidType === "honey" ? "🍯 Propiedades del Bloque de Miel" : "💧 Propiedades del Bloque de Agua"}</h4>
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="checkbox" id="inp-water-passable-group" style="width: 16px; height: 16px; cursor: pointer;"
                  ${(selected.properties?.passable !== false && selected.properties?.hasCollision !== true && selected.properties?.solid !== true) ? "checked" : ""} />
                <label for="inp-water-passable-group" style="font-size: 0.82rem; cursor: pointer; margin: 0; font-weight: bold;">
                  🌊 Traspasable (Caerse al líquido / Sin colisión sólida)
                </label>
              </div>
              <p style="font-size: 0.72rem; opacity: 0.75; margin: 6px 0 0 0; line-height: 1.35;">
                Si está marcado, la bola atraviesa la superficie líquida y cae al abismo perdiendo vidas. Si se desmarca, se comporta como una plataforma sólida sobre la que puedes caminar.
              </p>
            </div>
          `
              : ""
          }

          <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 4px;">
            <button class="btn btn-secondary editor-action-btn" id="btn-focus">🎯 Centrar Cámara</button>
            <button class="btn btn-secondary editor-action-btn" id="btn-set-spawn-here" style="background: rgba(0, 229, 255, 0.15); border-color: #00e5ff;">📍 Colocar Spawn Aquí</button>
            <button class="btn btn-danger editor-action-btn" id="btn-delete-current">🗑️ Eliminar Bloque (Supr)</button>
          </div>
        </div>
      `;
            })()
          : `
        <div class="editor-panel editor-inspector">
          <p style="opacity: 0.7;">Selecciona un objeto de la lista para editar sus coordenadas, bioma/textura, color y dimensiones.</p>
        </div>
      `
      }
    `;

    this.container.querySelectorAll<HTMLElement>('[data-editor-collectible]').forEach(slot=>{
      const icon=SpriteTextures.getCollectibleCanvas('pan',18);icon.style.cssText='display:inline-block;width:18px;height:18px;vertical-align:middle';slot.appendChild(icon);
    });
    this.attachUIEvents();
  }

  private attachUIEvents(): void {
    this.container.querySelector("#btn-level-settings")?.addEventListener("click", () => {
      this.showLevelSettingsModal();
    });

    this.container.querySelector("#btn-duplicate")?.addEventListener("click", () => {
      this.duplicateSelectedObject();
    });

    this.container.querySelector("#btn-delete-current")?.addEventListener("click", () => {
      this.deleteSelectedObject();
    });

    this.container.querySelector("#btn-set-spawn-here")?.addEventListener("click", () => {
      this.setSpawnAtSelected();
    });

    // Actions Header
    this.container.querySelector("#header-stage-select")?.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
      const newStage = Number(target.value);
      if (newStage && newStage !== this.currentStage) {
        this.loadStage(this.currentWorld, this.currentLevel, newStage);
      }
    });

    this.container.querySelector("#btn-prev-stage")?.addEventListener("click", () => {
      if (this.currentStage > 1) {
        this.loadStage(this.currentWorld, this.currentLevel, this.currentStage - 1);
      }
    });

    this.container.querySelector("#btn-next-stage")?.addEventListener("click", () => {
      if (this.currentStage < 10) {
        this.loadStage(this.currentWorld, this.currentLevel, this.currentStage + 1);
      }
    });

    this.container.querySelector("#btn-load-modal")?.addEventListener("click", () => {
      this.showLoadLevelModal();
    });

    this.container.querySelector("#btn-save-level")?.addEventListener("click", () => {
      this.saveCurrentLevel();
    });

    this.container.querySelector("#btn-revert-level")?.addEventListener("click", () => {
      this.revertCurrentLevel();
    });

    this.container.querySelector("#btn-playtest")?.addEventListener("click", () => {
      if(!this.originalPreview)this.saveCurrentLevel();
      this.callbacks.onPlaytest(this.levelData);
    });

    this.container.querySelector("#btn-exit")?.addEventListener("click", () => {
      this.callbacks.onExit();
    });

    // Add Object buttons
    this.container.querySelectorAll("[data-add]").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.getAttribute("data-add") as LevelObjectData["type"];
        const defaultScale =
          type === "platform"
            ? { x: 8, y: 0.8, z: 8 }
            : type === "moving-platform"
            ? { x: 6, y: 0.8, z: 6 }
            : type === "ramp"
            ? { x: 6, y: 0.8, z: 12 }
            : type === "bumper"
            ? { x: 1.5, y: 1.5, z: 1.5 }
            : type === "water" || (type as string) === "honey"
            ? { x: 8, y: 0.8, z: 8 }
            : type === "lava"
            ? { x: 8, y: 0.8, z: 8 }
            : type === "decoration"
            ? { x: 1, y: 1, z: 1 }
            : type === "collectible"
            ? { x: 1, y: 1, z: 1 }
            : { x: 3, y: 2.5, z: 0.6 };

        const newObj: LevelObjectData = {
          id: `obj-custom-${Date.now()}`,
          type,
          position: { x: this.orbitTarget.x, y: 0, z: this.orbitTarget.z },
          rotation: { x: 0, y: 0, z: 0 },
          scale: defaultScale,
          properties:
            type === "moving-platform"
              ? { speed: 2.0, distance: 6.0, axis: "x" }
              : type === "decoration"
              ? { subType: "tree" }
              : type === "water"
              ? { passable: true, hasCollision: false }
              : (type as string) === "honey"
              ? { fluidType: "honey", passable: true, hasCollision: false }
              : undefined
        };
        this.levelData.objects.push(newObj);
        this.selectedObjectIndex = this.levelData.objects.length - 1;
        this.render3DObjects();
        this.renderUI();
      });
    });

    // Select object
    this.container.querySelectorAll(".object-item").forEach(item => {
      item.addEventListener("click", e => {
        if ((e.target as HTMLElement).closest(".btn-del")) return;
        const idx = Number(item.getAttribute("data-idx"));
        this.selectObject(idx);
      });
    });

    // Delete object from list
    this.container.querySelectorAll(".btn-del").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-del"));
        this.levelData.objects.splice(idx, 1);
        if (this.selectedObjectIndex === idx) this.selectedObjectIndex = -1;
        else if (this.selectedObjectIndex > idx) this.selectedObjectIndex--;
        this.render3DObjects();
        this.renderUI();
      });
    });

    // Property inputs
    const bindInput = (id: string, callback: (val: number) => void) => {
      const inp = this.container.querySelector<HTMLInputElement>(id);
      inp?.addEventListener("input", () => {
        const val = parseFloat(inp.value) || 0;
        callback(val);
        this.render3DObjects();
      });
    };
    if(this.selectedObjectIndex===SPAWN_SELECTION) {
      for(const axis of ['x','y','z'] as const)bindInput(`#inp-spawn-${axis}`,value=>{this.levelData.spawn[axis]=value;});
      bindInput('#inp-spawn-heading',value=>{this.levelData.properties={...this.levelData.properties,spawnYaw:value*Math.PI/180};});

    }

    if (this.selectedObjectIndex >= 0 && this.selectedObjectIndex < this.levelData.objects.length) {
      const obj = this.levelData.objects[this.selectedObjectIndex];

      // Special variant dropdown
      const variantSel = this.container.querySelector<HTMLSelectElement>("#inp-object-variant");
      variantSel?.addEventListener("change", () => {
        obj.properties = obj.properties || {};
        if (variantSel.value) {
          obj.properties.variant = variantSel.value;
          if (
            variantSel.value === "tram_square" ||
            variantSel.value === "tram_circle" ||
            variantSel.value === "bike_wheel_vertical" ||
            variantSel.value === "bike_pedal" ||
            variantSel.value === "casino_roulette" ||
            variantSel.value === "limp_kicker" ||
            variantSel.value === "giant_umbrella" ||
            variantSel.value === "beach_towel" ||
            variantSel.value === "wave_pusher" ||
            variantSel.value === "slamming_door" ||
            variantSel.value === "litos_duo" ||
            variantSel.value === "village_dogs" ||
            variantSel.value === "village_girls" ||
            variantSel.value === "village_boys" ||
            variantSel.value === "turron_cat"
          ) {
            obj.type = "moving-platform";
            obj.properties.movementType = variantSel.value === "beach_towel" ? "towel_wave" : variantSel.value;
          }
        } else {
          delete obj.properties.variant;
          delete obj.properties.movementType;
        }
        this.render3DObjects();
        this.renderUI();
      });

      bindInput("#inp-px", v => {
        obj.position.x = v;
        if (obj.properties?.movementType === "circular" || obj.properties?.movementType === "orbit") {
          const cx = typeof obj.properties.centerX === "number" ? obj.properties.centerX : 0;
          const cz = typeof obj.properties.centerZ === "number" ? obj.properties.centerZ : 0;
          const r = Number(Math.hypot(obj.position.x - cx, obj.position.z - cz).toFixed(2));
          obj.properties.radius = r;
          obj.properties.baseAngle = Math.atan2(obj.position.z - cz, obj.position.x - cx);
          const radInp = this.container.querySelector<HTMLInputElement>("#inp-prop-radius");
          if (radInp) radInp.value = r.toString();
        }
      });
      bindInput("#inp-py", v => (obj.position.y = v));
      bindInput("#inp-pz", v => {
        obj.position.z = v;
        if (obj.properties?.movementType === "circular" || obj.properties?.movementType === "orbit") {
          const cx = typeof obj.properties.centerX === "number" ? obj.properties.centerX : 0;
          const cz = typeof obj.properties.centerZ === "number" ? obj.properties.centerZ : 0;
          const r = Number(Math.hypot(obj.position.x - cx, obj.position.z - cz).toFixed(2));
          obj.properties.radius = r;
          obj.properties.baseAngle = Math.atan2(obj.position.z - cz, obj.position.x - cx);
          const radInp = this.container.querySelector<HTMLInputElement>("#inp-prop-radius");
          if (radInp) radInp.value = r.toString();
        }
      });
      bindInput("#inp-sx", v => (obj.scale.x = Math.max(0.2, v)));
      bindInput("#inp-sy", v => (obj.scale.y = Math.max(0.1, v)));
      bindInput("#inp-sz", v => (obj.scale.z = Math.max(0.2, v)));
      bindInput("#inp-rx", v => (obj.rotation.x = v));
      bindInput("#inp-ry", v => (obj.rotation.y = v));
      bindInput("#inp-rz", v => (obj.rotation.z = v));

      // Theme / Texture dropdown
      const themeSel = this.container.querySelector<HTMLSelectElement>("#inp-block-theme");
      const customWrap = this.container.querySelector<HTMLElement>("#wrap-custom-color");
      const customColorPicker = this.container.querySelector<HTMLInputElement>("#inp-custom-color");
      const customColorText = this.container.querySelector<HTMLInputElement>("#inp-custom-color-text");

      themeSel?.addEventListener("change", () => {
        obj.properties = obj.properties || {};
        obj.properties.theme = themeSel.value;
        if (themeSel.value === "custom_color") {
          if (customWrap) customWrap.style.display = "flex";
          obj.properties.customColor = customColorPicker?.value || "#4caf50";
        } else {
          if (customWrap) customWrap.style.display = "none";
        }
        this.render3DObjects();
      });

      const updateCustomColor = (color: string) => {
        obj.properties = obj.properties || {};
        obj.properties.customColor = color;
        obj.properties.color = color;
        if (customColorPicker) customColorPicker.value = color;
        if (customColorText) customColorText.value = color;
        this.render3DObjects();
      };

      customColorPicker?.addEventListener("input", () => updateCustomColor(customColorPicker.value));
      customColorText?.addEventListener("change", () => updateCustomColor(customColorText.value));

      // Shape / Hole controls for platforms
      const shapeSel = this.container.querySelector<HTMLSelectElement>("#inp-platform-shape");
      const holeWrap = this.container.querySelector<HTMLElement>("#wrap-hole-settings");

      shapeSel?.addEventListener("change", () => {
        obj.properties = obj.properties || {};
        obj.properties.shape = shapeSel.value;
        obj.properties.platformShape = shapeSel.value;
        if (shapeSel.value === "hollow_rect") {
          if (holeWrap) holeWrap.style.display = "block";
          if (obj.properties.holeWidth === undefined) {
            obj.properties.holeWidth = Math.max(1, Math.round(obj.scale.x * 0.5 * 10) / 10);
            obj.properties.holeSizeX = obj.properties.holeWidth;
          }
          if (obj.properties.holeLength === undefined && obj.properties.holeDepth === undefined) {
            obj.properties.holeLength = Math.max(1, Math.round(obj.scale.z * 0.5 * 10) / 10);
            obj.properties.holeDepth = obj.properties.holeLength;
            obj.properties.holeSizeZ = obj.properties.holeLength;
          }
        } else {
          if (holeWrap) holeWrap.style.display = "none";
        }
        this.render3DObjects();
      });

      bindInput("#inp-hole-width", v => {
        obj.properties = obj.properties || {};
        obj.properties.holeWidth = Math.max(0.2, v);
        obj.properties.holeSizeX = obj.properties.holeWidth;
      });
      bindInput("#inp-hole-length", v => {
        obj.properties = obj.properties || {};
        obj.properties.holeLength = Math.max(0.2, v);
        obj.properties.holeDepth = obj.properties.holeLength;
        obj.properties.holeSizeZ = obj.properties.holeLength;
      });
      bindInput("#inp-hole-offset-x", v => {
        obj.properties = obj.properties || {};
        obj.properties.holeOffsetX = v;
      });
      bindInput("#inp-hole-offset-z", v => {
        obj.properties = obj.properties || {};
        obj.properties.holeOffsetZ = v;
      });

      // Bumper controls
      const bumperColor = this.container.querySelector<HTMLInputElement>("#inp-bumper-color");
      const bumperColorText = this.container.querySelector<HTMLInputElement>("#inp-bumper-color-text");
      const bumperBounce = this.container.querySelector<HTMLSelectElement>("#inp-bumper-bounce");

      const updateBumperColor = (color: string) => {
        obj.properties = obj.properties || {};
        obj.properties.customColor = color;
        obj.properties.color = color;
        if (bumperColor) bumperColor.value = color;
        if (bumperColorText) bumperColorText.value = color;
        this.render3DObjects();
      };

      bumperColor?.addEventListener("input", () => updateBumperColor(bumperColor.value));
      bumperColorText?.addEventListener("change", () => updateBumperColor(bumperColorText.value));

      bumperBounce?.addEventListener("change", () => {
        obj.properties = obj.properties || {};
        obj.properties.bounce = parseFloat(bumperBounce.value) || 0.95;
      });

      const bumperVariant = this.container.querySelector<HTMLSelectElement>("#inp-bumper-variant");
      bumperVariant?.addEventListener("change", () => {
        obj.properties = obj.properties || {};
        obj.properties.variant = bumperVariant.value;
        this.render3DObjects();
      });

      const bumperShape = this.container.querySelector<HTMLSelectElement>("#inp-bumper-shape");
      bumperShape?.addEventListener("change", () => {
        obj.properties = obj.properties || {};
        obj.properties.shape = bumperShape.value;
        obj.properties.platformShape = bumperShape.value;
        this.render3DObjects();
      });

      // Quick size presets
      this.container.querySelectorAll<HTMLButtonElement>("[data-size]").forEach(btn => {
        btn.addEventListener("click", () => {
          const [sx, sy, sz] = btn.getAttribute("data-size")!.split(",").map(Number);
          obj.scale.x = sx;
          obj.scale.y = sy;
          obj.scale.z = sz;
          this.render3DObjects();
          this.renderUI();
        });
      });

      // Quick ramp angle presets
      this.container.querySelectorAll<HTMLButtonElement>("[data-rx]").forEach(btn => {
        btn.addEventListener("click", () => {
          const rx = parseFloat(btn.getAttribute("data-rx")!) || 0;
          obj.rotation.x = rx;
          this.render3DObjects();
          this.renderUI();
        });
      });

      // Quick heading direction presets
      this.container.querySelectorAll<HTMLButtonElement>("[data-ry]").forEach(btn => {
        btn.addEventListener("click", () => {
          const ry = parseFloat(btn.getAttribute("data-ry")!) || 0;
          obj.rotation.y = ry;
          this.render3DObjects();
          this.renderUI();
        });
      });

      if (obj.type === "moving-platform") {
        const speedInp = this.container.querySelector<HTMLInputElement>("#inp-prop-speed");
        speedInp?.addEventListener("input", () => {
          obj.properties = obj.properties || {};
          obj.properties.speed = Math.max(0.1, parseFloat(speedInp.value) || 2.0);
        });

        const mTypeSel = this.container.querySelector<HTMLSelectElement>("#inp-prop-movement-type");
        mTypeSel?.addEventListener("change", () => {
          obj.properties = obj.properties || {};
          obj.properties.movementType = mTypeSel.value;
          this.renderUI();
          this.render3DObjects();
        });

        const radiusInp = this.container.querySelector<HTMLInputElement>("#inp-prop-radius");
        radiusInp?.addEventListener("input", () => {
          obj.properties = obj.properties || {};
          const newR = Math.max(0.5, parseFloat(radiusInp.value) || 12.0);
          obj.properties.radius = newR;
          const cx = typeof obj.properties.centerX === "number" ? obj.properties.centerX : 0;
          const cz = typeof obj.properties.centerZ === "number" ? obj.properties.centerZ : 0;
          const curAng = Math.atan2(obj.position.z - cz, obj.position.x - cx);
          obj.position.x = Number((cx + Math.cos(curAng) * newR).toFixed(2));
          obj.position.z = Number((cz + Math.sin(curAng) * newR).toFixed(2));
          obj.properties.baseAngle = curAng;
          this.render3DObjects();
          const pxInp = this.container.querySelector<HTMLInputElement>("#inp-px");
          const pzInp = this.container.querySelector<HTMLInputElement>("#inp-pz");
          if (pxInp) pxInp.value = obj.position.x.toString();
          if (pzInp) pzInp.value = obj.position.z.toString();
        });

        const dirSel = this.container.querySelector<HTMLSelectElement>("#inp-prop-direction");
        dirSel?.addEventListener("change", () => {
          obj.properties = obj.properties || {};
          obj.properties.direction = parseInt(dirSel.value, 10) || 1;
        });

        const distInp = this.container.querySelector<HTMLInputElement>("#inp-prop-distance");
        distInp?.addEventListener("input", () => {
          obj.properties = obj.properties || {};
          obj.properties.distance = Math.max(1, parseFloat(distInp.value) || 6.0);
          this.render3DObjects();
        });

        const axisSel = this.container.querySelector<HTMLSelectElement>("#inp-prop-axis");
        axisSel?.addEventListener("change", () => {
          obj.properties = obj.properties || {};
          obj.properties.axis = axisSel.value as "x" | "y" | "z";
          this.render3DObjects();
        });
      }

      if (obj.type === "decoration") {
        const subSel = this.container.querySelector<HTMLSelectElement>("#inp-prop-subtype");
        const collCheck = this.container.querySelector<HTMLInputElement>("#inp-prop-collision");
        const breed=this.container.querySelector<HTMLSelectElement>("#inp-cow-breed");
        breed?.addEventListener("change",()=>{obj.properties={...obj.properties,cowBreed:breed.value};this.render3DObjects();});
        const species=this.container.querySelector<HTMLSelectElement>("#inp-museum-species"),santa=this.container.querySelector<HTMLInputElement>("#inp-museum-santa");
        species?.addEventListener("change",()=>{obj.properties={...obj.properties,species:species.value,museumAction:species.value==="trex" ? "rex":"animal"};this.render3DObjects();});
        santa?.addEventListener("change",()=>{obj.properties={...obj.properties,santa:santa.checked};this.render3DObjects();});

        subSel?.addEventListener("change", () => {
          obj.properties = obj.properties || {};
          obj.properties.subType = subSel.value;
          const norwayKind=subSel.value.startsWith('norway_')?subSel.value.slice(7):subSel.value.startsWith('fjord_')?subSel.value.slice(6):subSel.value.startsWith('oslo_')?subSel.value.slice(5):subSel.value.startsWith('aurora_')?subSel.value.slice(7):'';const norwayAction:Record<string,string>={tower:'spin',swing_arc:'spin',tile:'flip',snowball:'avalanche',boost:'boost',loop:'',pipe:'pipe',shifter:'slide',pontoon:'sink',stair:'stairs',roll:'roll',jump:'jump',whale:'whale',waterfalls:'waterfall',swing:'swing',drum:'drum',spokes:'spin',orbit_arm:'spin',ferry:'ferry',bridge:'sway',rotor:'spin',sauna:'steam',bypass:'bypass',pendulum:'pendulum',wall:'wall',gear:'spin',ribbons:'aurora'};if(norwayAction[norwayKind]&&subSel.value!=='oslo_tile')obj.properties.norwayAction=norwayAction[norwayKind];else delete obj.properties.norwayAction;
          const tokyoKind=subSel.value.startsWith('tokyo_')?subSel.value.slice(6):'';
          if(tokyoKind==='pulse_emitter')obj.properties.tokyoAction='pulse';else if(['stripe','pedestrian','tile','flipper','car','claw'].includes(tokyoKind))obj.properties.tokyoAction=tokyoKind;else delete obj.properties.tokyoAction;
          if(subSel.value==='osaka_roller'||subSel.value==='osaka_ninja_blade') {
            obj.properties.osakaAction=subSel.value==='osaka_roller'?'roller':'blade';obj.properties.hasCollision=true;
          }else delete obj.properties.osakaAction;
          if(subSel.value.startsWith("museum_")) {
            const kind=subSel.value.slice(7),actions:Record<string,string>={pyramid:"pyramid",gem_disk:"gem",goal_glass:"glass",painting_wall:"painting",animal:"animal",jump_pad:"jump"};
            obj.properties.museumAction=actions[kind];if(kind==="animal") obj.properties.species??="triceratops";
          } else delete obj.properties.museumAction;
            if(subSel.value.startsWith('bigben_')) {
              const kind=subSel.value.slice(7),actions:Record<string,string>={toy_plane:'plane',guard:'guard',wheel:'wheel',cabin:'cabin',trap:'trap',chocolate_fall:'chocolate'};
              obj.properties.benAction=actions[kind];obj.properties.index??=0;
              if(kind==='trap')obj.properties.direction??={x:1,y:0,z:0};
              obj.properties.hasCollision=!['station','wheel','chocolate_fall'].includes(kind);
            } else delete obj.properties.benAction;
            if(subSel.value.startsWith('oxford_')) {
            const kind=subSel.value.slice(7),actions:Record<string,string>={train:'traffic',buzz:'buzz',magnet:'magnet',table:'table',bear:'bear',milk_ring:'ring',straw:'straw'};
            obj.properties.oxfordAction=actions[kind];obj.properties.index??=0;
          } else delete obj.properties.oxfordAction;
          if(subSel.value.startsWith("london_")) {
            const kind=subSel.value.slice(7);obj.properties.londonAction=["plane","train","crow","punch","hair","trap"].includes(kind) ? kind:undefined;
          } else delete obj.properties.londonAction;
          if(subSel.value.startsWith("asturias_sella_")) {
            const type=subSel.value.slice(15);
            obj.properties.sellaAction=type;
            if(type==="river") {
              obj.properties.points??=[{x:0,y:0,z:0},{x:0,y:0,z:-40}];
              obj.properties.width??=24;obj.properties.breaks??=[];
            }
          } else delete obj.properties.sellaAction;
          const isSolid =
            ['aurora_bypass','aurora_pendulum','aurora_wall','aurora_gear','aurora_scraper','oslo_swing','oslo_tile','oslo_drum','oslo_studded','oslo_spokes','oslo_orbit_arm','oslo_ferry','oslo_gate','oslo_bridge','oslo_rotor','fjord_loop','fjord_pipe','fjord_shifter','fjord_pontoon','fjord_stair','fjord_roll','norway_disc','norway_tile','norway_snowball','norway_tower','norway_swing_arc','norway_funnel','tokyo_stripe','tokyo_pedestrian','tokyo_tile','tokyo_flipper','tokyo_car','osaka_roller','osaka_ninja_blade','osaka_dome'].includes(subSel.value) ||
              (subSel.value.startsWith('bigben_')&&!['bigben_station','bigben_wheel','bigben_chocolate_fall'].includes(subSel.value)) ||
            (subSel.value.startsWith("museum_")&&!["museum_hall","museum_reading_room","museum_reflecting_pool","museum_jump_pad"].includes(subSel.value)) ||
            (subSel.value.startsWith("london_") && !["london_plane","london_scenery","london_garland","london_star"].includes(subSel.value)) ||
            ["asturias_sella_river","asturias_sella_rock","asturias_sella_canoe"].includes(subSel.value) ||
            subSel.value === "asturias_peak" ||
            subSel.value === "asturias_shelf" ||
            subSel.value === "tree" ||
            subSel.value === "fence" ||
            subSel.value === "lantern" ||
            subSel.value === "town_hall" ||
            subSel.value === "bench" ||
            subSel.value === "palm_tree" ||
            subSel.value === "lifeguard_chair" ||
            subSel.value === "beach_umbrella" ||
            subSel.value === "float_ring" ||
            subSel.value === "sunbed" ||
            subSel.value === "plush_bear" ||
            subSel.value === "jewelry_bust" ||
            subSel.value === "store_shelf" ||
            subSel.value === "surf_rack" ||
            subSel.value === "arcade_cabinet" ||
            subSel.value === "gelato_display" ||
            subSel.value === "bakery_counter" ||
            subSel.value === "fashion_mannequin" ||
            subSel.value === "sneaker_rack" ||
            subSel.value === "checkout_counter" ||
            subSel.value === "hurdes_stone_wall" ||
            subSel.value === "village_fountain" ||
            subSel.value === "stone_bridge_arch" ||
            subSel.value === "pine_hurdes" ||
            subSel.value === "village_church_tower" ||
            subSel.value === "terrace_table_set" ||
            subSel.value === "village_lantern_post" ||
            subSel.value === "wooden_bench_rustic" ||
            subSel.value === "spar_supermarket_sign" ||
            subSel.value === "hurdes_mountain_house" ||
            subSel.value === "pergola_green_post" ||
            subSel.value === "waterfall_rock_cliff" ||
            subSel.value === "madrid_metro_sign" ||
            subSel.value === "madrid_street_sign_carabanchel" ||
            subSel.value === "madrid_street_lamp_urban" ||
            subSel.value === "madrid_recycle_bins" ||
            subSel.value === "madrid_granite_bollard" ||
            subSel.value === "madrid_terrace_bar_umbrella" ||
            subSel.value === "madrid_residential_building" ||
            subSel.value === "madrid_bus_stop" ||
            subSel.value === "madrid_traffic_light" ||
            subSel.value === "bazar_shelf_display" ||
            subSel.value === "madrid_kiosk_press" ||
            subSel.value === "giant_goku_saiyan";
          obj.properties.hasCollision = isSolid;
          if (collCheck) collCheck.checked = isSolid;
          this.render3DObjects();
        });

        collCheck?.addEventListener("change", () => {
          obj.properties = obj.properties || {};
          obj.properties.hasCollision = collCheck.checked;
        });

        const facadeSel = this.container.querySelector<HTMLSelectElement>("#sel-building-facade-color");
        facadeSel?.addEventListener("change", () => {
          obj.properties = obj.properties || {};
          obj.properties.facadeColor = facadeSel.value;
          this.render3DObjects();
        });

        const shopSel = this.container.querySelector<HTMLSelectElement>("#sel-building-shop-type");
        shopSel?.addEventListener("change", () => {
          obj.properties = obj.properties || {};
          obj.properties.shopType = shopSel.value;
          this.render3DObjects();
        });
      }

      if (obj.type === "water" || obj.type === "honey") {
        const toggleWaterPassable = (isPassable: boolean) => {
          obj.properties = obj.properties || {};
          obj.properties.passable = isPassable;
          obj.properties.hasCollision = !isPassable;
          obj.properties.solid = !isPassable;
          this.render3DObjects();
          this.renderUI();
        };

        const waterPassCheck = this.container.querySelector<HTMLInputElement>("#inp-water-passable");
        waterPassCheck?.addEventListener("change", () => {
          toggleWaterPassable(waterPassCheck.checked);
        });

        const waterPassGroupCheck = this.container.querySelector<HTMLInputElement>("#inp-water-passable-group");
        waterPassGroupCheck?.addEventListener("change", () => {
          toggleWaterPassable(waterPassGroupCheck.checked);
        });
      }

      this.container.querySelector("#btn-focus")?.addEventListener("click", () => {
        this.orbitTarget.set(obj.position.x, obj.position.y, obj.position.z);
        this.updateCameraTransform();
      });
    }
  }

  update(delta: number): void {
    this.editorAnimTime += delta;
    const previewCanoe=this.movingObjects.find(item=>item.obj.properties?.sellaAction==="canoe")?.group;
    if(previewCanoe) previewCanoe.updateWorldMatrix(true,false);
    for (const item of this.movingObjects) {
      const { obj, group } = item;
      if(obj.properties?.movementType==='bike_wheel_vertical') {
        const pose=bikeWheelPose(this.editorAnimTime,Number(obj.properties.distance??12),Number(obj.properties.speed??1),Number(obj.properties.radius??3.5));
        group.position.copy(item.basePosition);group.position.z+=pose.offset;group.rotation.x=pose.pitch;continue;
      }
      if(obj.properties?.movementType==='bike_pedal') {
        const a=this.editorAnimTime*Number(obj.properties.speed??.6)+Number(obj.properties.phase??0),r=Number(obj.properties.radius??6);
        group.position.set(item.basePosition.x,item.basePosition.y+Math.sin(a)*r,item.basePosition.z+Math.cos(a)*r);continue;
      }
      if(previewKyotoKatana(obj,group,this.editorAnimTime)) continue;
      if(previewNorwayModel(obj,group,this.editorAnimTime)) continue;
      if(previewTokyoModel(obj,group,this.editorAnimTime)) continue;
      if(previewOsakaModel(obj,group,this.editorAnimTime)) continue;
      if(previewNaraModel(obj,group,this.editorAnimTime)) continue;
      if(previewMuseumActor(obj,group,this.editorAnimTime)) continue;
      if(previewBigBenActor(obj,group,this.editorAnimTime)) continue;
      if(previewOxfordActor(obj,group,this.editorAnimTime)) continue;
      if(previewLondonActor(obj,group,this.editorAnimTime)) continue;
      if(previewCovadongaActor(obj,group,this.editorAnimTime)) {
        const road=this.covadongaPreviewRoad;
        if(obj.properties?.covadongaAction==="cow" && road) {
          const ground=sampleSellaRiver(road.points,group.position,[],Number(group.userData.covadongaGroundHint??-1),road.frames,road.width);
          if(ground) {group.userData.covadongaGroundHint=ground.segment;if(ground.distance<road.width/2) group.position.y=ground.y;}
        }
        continue;
      }
      if(obj.properties?.subType==="asturias_sella_river") {
        (group.userData.sellaWater as SellaWater|undefined)?.setCanoeTransform(previewCanoe?.matrixWorld??null);
      }
      if(obj.properties?.movementType==='concert_vibe'){
        group.position.y=obj.position.y+concertLift(this.editorAnimTime,Number(obj.properties.speed??1.33));continue;
      }
      if (previewOviedoActor(obj, group, this.editorAnimTime)) continue;
      if (previewCangasActor(obj, group, this.editorAnimTime)) continue;
      if (previewSellaActor(obj,group,this.editorAnimTime)) continue;
      if (obj.properties?.movementType === "tilt_x") {
        const cycle = (obj.properties?.cycleTime as number) ?? 8.0;
        const pBottom = (obj.properties?.pauseBottom as number) ?? 1.5;
        const rTime = (obj.properties?.riseTime as number) ?? 2.5;
        const pTop = (obj.properties?.pauseTop as number) ?? 1.5;
        const t1 = pBottom;
        const t2 = t1 + rTime;
        const t3 = t2 + pTop;
        const tInCycle = ((this.editorAnimTime % cycle) + cycle) % cycle;

        const minA = (obj.properties?.minAngle as number) ?? 0.03;
        const maxA = (obj.properties?.maxAngle as number) ?? (Math.abs(obj.rotation.x) || 0.388);

        let currentAngle = minA;
        if (tInCycle < t1) {
          currentAngle = minA;
        } else if (tInCycle < t2) {
          const u = (tInCycle - t1) / (t2 - t1);
          const smoothU = 0.5 * (1 - Math.cos(u * Math.PI));
          currentAngle = minA + (maxA - minA) * smoothU;
        } else if (tInCycle < t3) {
          currentAngle = maxA;
        } else {
          const u = (tInCycle - t3) / (cycle - t3);
          const smoothU = 0.5 * (1 - Math.cos(u * Math.PI));
          currentAngle = maxA - (maxA - minA) * smoothU;
        }

        const tempEuler = new THREE.Euler(currentAngle, 0, 0, "YXZ");
        const tempQuat = new THREE.Quaternion().setFromEuler(tempEuler);

        const Hz = (obj.scale.z ?? 42.0) / 2;
        const hZ = (obj.properties?.hingeZ as number) ?? (obj.position.z + Hz * Math.cos(maxA));
        const hY = (obj.properties?.hingeY as number) ?? 0.4;
        const hX = obj.position.x;

        const localVec = new THREE.Vector3(0, 0, -Hz).applyQuaternion(tempQuat);
        group.position.set(hX, hY + localVec.y, hZ + localVec.z);
        group.quaternion.copy(tempQuat);
      } else if (obj.properties?.movementType === "slamming_door" || obj.properties?.variant === "slamming_door") {
        const cycle = (obj.properties?.cycleTime as number) ?? 3.2;
        const tInCycle = ((this.editorAnimTime % cycle) + cycle) % cycle;
        let doorAngle = 0;
        if (tInCycle < 2.2) {
          const u = tInCycle / 2.2;
          doorAngle = Math.sin((u * Math.PI) / 2) * 1.45;
        } else if (tInCycle < 2.38) {
          const u = (tInCycle - 2.2) / 0.18;
          doorAngle = 1.45 * (1 - u);
        } else {
          doorAngle = 0;
        }
        const doorPivot = group.getObjectByName("doorPivot");
        if (doorPivot) {
          doorPivot.rotation.y = doorAngle;
        }
      } else if (obj.properties?.movementType === "litos_duo") {
        const cycle = (obj.properties?.cycleTime as number) ?? 3.2;
        const tInCycle = ((this.editorAnimTime % cycle) + cycle) % cycle;
        const dist = (obj.properties?.distance as number) ?? 10.0;
        const dir = (obj.properties?.direction as number) ?? 1;
        let travel = 0;
        if (tInCycle < 0.6) {
          travel = 0;
        } else if (tInCycle < 1.2) {
          const u = (tInCycle - 0.6) / 0.6;
          travel = dist * Math.sin((u * Math.PI) / 2);
        } else if (tInCycle < 2.1) {
          const u = (tInCycle - 1.2) / 0.9;
          travel = dist * (1 - u);
        } else {
          travel = 0;
        }
        group.position.set(obj.position.x, obj.position.y, obj.position.z + dir * travel);
      } else if (obj.properties?.movementType === "accelerating_wall") {
        const dir = (obj.properties?.direction as number) ?? -1;
        const v0 = (obj.properties?.speed as number) ?? 1.8;
        const a = (obj.properties?.waveAmplitude as number) ?? 0.45;
        const maxDist = (obj.properties?.distance as number) ?? 72.0;
        const cycle = 16.0;
        const t = ((this.editorAnimTime % cycle) + cycle) % cycle;
        const travel = Math.min(maxDist, v0 * t + 0.5 * a * t * t);
        group.position.set(obj.position.x, obj.position.y, obj.position.z + dir * travel);
      } else if (obj.properties?.movementType === "emt_bus_35" || obj.properties?.variant === "emt_bus_35" || obj.properties?.movementType === "emt_bus_34" || obj.properties?.variant === "emt_bus_34") {
        const isB34 = obj.properties?.movementType === "emt_bus_34" || obj.properties?.variant === "emt_bus_34";
        const dist = (obj.properties?.distance as number) ?? (isB34 ? 82.0 : 78.0);
        const dir = (obj.properties?.direction as number) ?? -1;
        const spd = (obj.properties?.speed as number) ?? (isB34 ? 3.0 : 3.2);
        const delay = (obj.properties?.startDelay as number) ?? 2.0;
        const cycle = delay + dist / spd + 4.0;
        const t = ((this.editorAnimTime % cycle) + cycle) % cycle;
        const activeT = Math.max(0, t - delay);
        const travel = Math.min(dist, activeT * spd);
        group.position.set(obj.position.x, obj.position.y, obj.position.z + dir * travel);
      } else if (obj.properties?.movementType === "clapping_gloves") {
        const cycle = (obj.properties?.cycleTime as number) ?? 2.2;
        const tInCycle = ((this.editorAnimTime % cycle) + cycle) % cycle;
        const isLeft = obj.properties?.side === "left" || obj.position.x < 0;
        const maxInward = (obj.properties?.distance as number) ?? 4.2;
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
        const targetX = isLeft ? obj.position.x + inward : obj.position.x - inward;
        group.position.set(targetX, obj.position.y, obj.position.z);
      } else if (obj.properties?.movementType === "residential_elevator_2f") {
        const cycle = (obj.properties?.cycleTime as number) ?? 12.0;
        const tInCycle = ((this.editorAnimTime % cycle) + cycle) % cycle;
        let elevY = 0;
        if (tInCycle < 2.5) {
          elevY = 0;
        } else if (tInCycle < 4.5) {
          const u = (tInCycle - 2.5) / 2.0;
          elevY = 4.5 * 0.5 * (1 - Math.cos(u * Math.PI));
        } else if (tInCycle < 6.5) {
          elevY = 4.5;
        } else if (tInCycle < 8.5) {
          const u = (tInCycle - 6.5) / 2.0;
          elevY = 4.5 + 4.5 * 0.5 * (1 - Math.cos(u * Math.PI));
        } else if (tInCycle < 10.5) {
          elevY = 9.0;
        } else {
          const u = (tInCycle - 10.5) / 1.5;
          elevY = 9.0 * (1 - 0.5 * (1 - Math.cos(u * Math.PI)));
        }
        group.position.set(obj.position.x, obj.position.y + elevY, obj.position.z);
      } else if (obj.properties?.movementType === "street_patrol_man") {
        const dist = (obj.properties?.distance as number) ?? 5.2;
        const omega = (obj.properties?.speed as number) ?? 2.2;
        const phase = (obj.properties?.phase as number) ?? 0;
        const offset = Math.sin(this.editorAnimTime * omega + phase) * (dist / 2);
        group.position.set(obj.position.x + offset, obj.position.y, obj.position.z);
        const walkingDir = Math.cos(this.editorAnimTime * omega + phase) >= 0 ? 1 : -1;
        group.rotation.y = walkingDir > 0 ? Math.PI / 2 : -Math.PI / 2;
      } else if (obj.properties?.movementType === "vertical_circle") {
        const dir = (obj.properties?.direction as number) ?? 1;
        const cy = (obj.properties?.centerY as number) ?? item.basePosition.y;
        const cz = (obj.properties?.centerZ as number) ?? item.basePosition.z;
        const r = (obj.properties?.radius as number) ?? 5.5;
        const spd = (obj.properties?.speed as number) ?? 1.4;
        const phase = (obj.properties?.phase as number) ?? 0;
        const ang = phase + dir * spd * this.editorAnimTime;
        group.position.set(item.basePosition.x, cy + Math.sin(ang) * r, cz + Math.cos(ang) * r);
      } else if (obj.properties?.movementType === "vivagym_obstacle") {
        const top = Number(obj.properties.centerY ?? item.basePosition.y);
        const { y, z } = sampleVivaGymObstacle(
          this.editorAnimTime, Number(obj.properties.speed), Number(obj.properties.distance),
          Number(obj.properties.phase), top, Number(obj.properties.centerZ ?? item.basePosition.z)
        );
        group.position.set(item.basePosition.x, y, z);
        group.visible = y > top - 2.1;
      } else if (obj.properties?.movementType === "vivagym_treadmill") {
        group.position.copy(item.basePosition);
      } else if (obj.properties?.movementType === "quesarito_roll") {
        const rollSpeed = (obj.properties?.rollSpeed as number) ?? (obj.properties?.speed as number) ?? 0.75;
        group.rotation.z = item.baseRotation.z + this.editorAnimTime * rollSpeed;
      } else if (
        obj.properties?.movementType === "circular" ||
        obj.properties?.movementType === "orbit" ||
        obj.properties?.movementType === "tram_circle"
      ) {
        const cx = (obj.properties?.centerX as number) ?? 0;
        const cz = (obj.properties?.centerZ as number) ?? 0;
        const distFromCenter = Math.hypot(item.basePosition.x - cx, item.basePosition.z - cz);
        const r = (obj.properties?.radius as number) ?? (distFromCenter > 0.01 ? distFromCenter : 12.0);
        const baseAng = (obj.properties?.baseAngle as number) ?? (distFromCenter > 0.01 ? Math.atan2(item.basePosition.z - cz, item.basePosition.x - cx) : 0);
        const spd = (obj.properties?.speed as number) ?? 1.0;
        const phase = (obj.properties?.phase as number) ?? 0;
        const dir = (obj.properties?.direction as number) ?? 1;
        const ang = baseAng + phase + dir * spd * this.editorAnimTime;
        group.position.set(cx + Math.cos(ang) * r, item.basePosition.y, cz + Math.sin(ang) * r);
      } else if (obj.type === "moving-platform" || Boolean(obj.properties?.isMoving)) {
        const axis = (obj.properties?.axis as "x" | "y" | "z" | "yz") || "x";
        const dist = typeof obj.properties?.distance === "number" ? obj.properties.distance : 6.0;
        const spd = typeof obj.properties?.speed === "number" ? obj.properties.speed : 1.2;
        const phase = typeof obj.properties?.phase === "number" ? obj.properties.phase : 0;
        const slopeY = typeof obj.properties?.slopeY === "number" ? obj.properties.slopeY : 0.28;
        const offset = Math.sin(this.editorAnimTime * spd + phase) * dist;

        if (axis === "x") {
          group.position.set(item.basePosition.x + offset, item.basePosition.y, item.basePosition.z);
        } else if (axis === "y") {
          group.position.set(item.basePosition.x, item.basePosition.y + offset, item.basePosition.z);
        } else if (axis === "z") {
          group.position.set(item.basePosition.x, item.basePosition.y, item.basePosition.z + offset);
        } else if (axis === "yz") {
          group.position.set(item.basePosition.x, item.basePosition.y + offset * slopeY, item.basePosition.z + offset);
        }
      }
    }
  }

  private clearEditorGroupResources(): void {
    this.editorGroup.traverse(child => {
      child.userData.sellaWater?.dispose();
      if (child instanceof THREE.InstancedMesh) child.dispose();
      if (child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.Points) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(material => {
            if (material.map) material.map.dispose();
            material.dispose();
          });
        } else if (child.material) {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
      } else if (child instanceof THREE.Sprite && child.material) {
        if (child.material.map) child.material.map.dispose();
        child.material.dispose();
      }
    });
  }

  destroy(): void {
    this.camera.far=this.originalCameraFar;this.camera.updateProjectionMatrix();
    if (document?.body?.style) {
      document.body.style.cursor = "default";
    }
    if (this.previewingBGM) {
      this.audio.stopBGM();
      this.previewingBGM = null;
    }
    this.skyboxTexture?.dispose();
    this.skyboxTexture = null;
    this.scene.background = null;
    this.cleanupListeners.forEach(cleanup => cleanup());
    this.cleanupListeners = [];
    this.scene.remove(this.editorGroup);
    this.clearEditorGroupResources();
    this.editorGroup.clear();
    this.container.remove();
  }
}





