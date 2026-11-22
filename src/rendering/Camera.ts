import * as THREE from "three";

export type CinematicTramMode = "tranvia1" | "tranvia2" | "bus35" | "bus34" | "mina" | "fixed_padel" | null;

export class Camera {
  readonly object: THREE.PerspectiveCamera;

  private readonly desiredPos = new THREE.Vector3();
  private readonly lookTarget = new THREE.Vector3();
  private readonly currentLookAt = new THREE.Vector3();
  private readonly smoothedTarget = new THREE.Vector3();
  private isInitialized = false;

  private distance = 6.5;
  private height = 3.2;
  private yaw = 0; // Horizontal rotation angle in radians
  private stageYaw=0;
  private chaseYawVelocity=0;
  private mode:1|2=2;
  private steerHeadingHold=0;
  setMode(mode:1|2):void {
    if(this.mode===mode)return;
    this.mode=mode;this.manualYawCooldown=0;this.chaseYawVelocity=0;this.steerHeadingHold=0;
    if(mode===2&&!this.isCinematicTram&&!this.canoeFollowing){this.distance=6.5;this.height=3.2;}
  }
  setStageHeading(yaw:number):void {this.stageYaw=Number.isFinite(yaw)?yaw:0;this.yaw=this.stageYaw;this.lastMovingAngle=this.stageYaw;this.chaseYawVelocity=0;this.steerHeadingHold=0;}
  private stillTimer = 0;
  private lastMovingAngle = 0;
  private manualYawCooldown = 0;
  private readonly lookAhead = new THREE.Vector3();
  private canoeFollowing=false;
  private canoeCinematic=false;
  private cannonScene=false;
  private readonly cannonOrigin=new THREE.Vector3();
  private readonly cannonGoal=new THREE.Vector3();
  private cannonSceneInitialized=false;
  private museumChase=false;
  private museumChaseInitialized=false;
  private naraTrainView=false;
  private machineOverhead=false;
  private naraTrainInitialized=false;
  private readonly naraTrainOrigin=new THREE.Vector3();
  private readonly naraTrainPrevious=new THREE.Vector3();
  setNaraTrainView(origin:THREE.Vector3|null,overhead=false):void {
    const active=origin!==null;
    if(active!==this.naraTrainView||overhead!==this.machineOverhead){this.naraTrainInitialized=false;this.isInitialized=false;}
    this.machineOverhead=overhead;
    this.naraTrainView=active;if(origin)this.naraTrainOrigin.copy(origin);
  }
  setMuseumChase(active:boolean):void {
    if(active!==this.museumChase) {this.museumChaseInitialized=false;this.isInitialized=false;}
    this.museumChase=active;
  }

  setCannonScene(origin:THREE.Vector3|null,goal:THREE.Vector3|null):void {
    this.cannonScene=origin!==null && goal!==null;
    if(origin && goal) {this.cannonOrigin.copy(origin);this.cannonGoal.copy(goal);}
    else this.cannonSceneInitialized=false;
  }

  setCanoeHeading(heading:number|null,delta:number,cinematic=false,overhead=false):void {
    if(heading===null) {
      this.canoeCinematic=false;
      if(this.canoeFollowing) {this.distance=6.5;this.height=3.2;this.canoeFollowing=false;}
      return;
    }
    this.canoeFollowing=true;this.canoeCinematic=cinematic;
    this.distance=overhead ? 4.5:cinematic ? 17:9;this.height=overhead ? 24:cinematic ? 12.5:4.2;
    let angle=-heading-this.yaw;
    angle=Math.atan2(Math.sin(angle),Math.cos(angle));
    this.yaw+=angle*(1-Math.exp(-(overhead ? 1.6:cinematic ? 2.4:4)*delta));
    this.lastMovingAngle=this.yaw;this.stillTimer=0;
  }
  setFlightView(active:boolean):void {if(active) {this.distance=38;this.height=18;}}

  // Cinematic Tram Framing (M2-N2-E4 'Tranvia' and M2-N4-E1 'Tranvia2')
  private cinematicTramMode: CinematicTramMode = null;
  private isCinematicTram = false;

  // Camera SpringArm / Collision avoidance
  private currentArmFraction = 1.0;
  private readonly raycaster = new THREE.Raycaster();
  private readonly playerCenter = new THREE.Vector3();
  private readonly camDir = new THREE.Vector3();
  private readonly probeOrigin = new THREE.Vector3();
  private readonly rightVec = new THREE.Vector3();
  private readonly upVec = new THREE.Vector3(0, 1, 0);
  private readonly tempCheckVec = new THREE.Vector3();
  private readonly tempNormal = new THREE.Vector3();
  private readonly hits:THREE.Intersection[]=[];

  constructor() {
    this.object = new THREE.PerspectiveCamera(56, 1, 0.1, 800);
    this.object.position.set(0, 8, 10);
    this.object.lookAt(0, 0, 0);
  }

  /**
   * Sets or clears cinematic tram mode for stages 'Tranvia' and 'Tranvia2'.
   * In cinematic mode, the camera maintains a panoramic, elevated framing perspective
   * and never pulls in close against the tram cabin or character.
   */
  setCinematicTramMode(mode: CinematicTramMode): void {
    this.cinematicTramMode = mode;
    this.isCinematicTram = mode !== null;

    if (mode === "tranvia1") {
      // Tranvia (M2-N2-E4): 24x24m square track with 90 deg corners around plaza
      this.distance = 12.5;
      this.height = 6.0;
      this.yaw = 0;
      this.currentArmFraction = 1.0;
    } else if (mode === "tranvia2") {
      // Tranvia2 (M2-N4-E1): 144m long straight coastal railway journey
      // Horizontal side-scrolling cinematic view looking towards -X with Mediterranean sea in background!
      this.distance = 11.5;
      this.height = 3.6;
      this.yaw = -Math.PI / 2; // -90 deg: camera placed at +X looking across track to -X with water in background
      this.currentArmFraction = 1.0;
    } else if (mode === "bus35") {
      // EMT Bus 35 in Calle Piqueñas (M4-N1-E2)
      // Elevated, expansive cinematic perspective giving a grand view of the EMT bus, street, and Carabanchel city
      this.distance = 18.0;
      this.height = 8.5;
      this.yaw = 0; // Directly behind bus looking forward along Calle Piqueñas
      this.currentArmFraction = 1.0;
    } else if (mode === "bus34") {
      // EMT Bus 34 in Calle San Melitón (M4-N2-E1)
      // Elevated cinematic perspective on the narrower street between orange/yellow buildings
      this.distance = 17.5;
      this.height = 8.8;
      this.yaw = 0;
      this.currentArmFraction = 1.0;
    } else if (mode === "mina") {
      // La Mina (M4-N2-E4)
      // Elevated atmospheric overview over the narrow Carabanchel alley labyrinth
      this.distance = 25.0;
      this.height = 18.0;
      this.yaw = 0;
      this.currentArmFraction = 1.0;
    } else if (mode === "fixed_padel") {
      // Padel3 (M4-N3-E4): Vertical padel court catapult launch
      // Fixed, still & pulled-back panoramic view framing the entire court from ground (Y=0, Z=14) to sky goal (Y=28, Z=-10)
      this.distance = 40.0;
      this.height = 16.5;
      this.yaw = 0;
      this.currentArmFraction = 1.0;
      this.object.position.set(0.0, 16.5, 40.0);
      this.currentLookAt.set(0.0, 13.0, 0.0);
      this.object.lookAt(this.currentLookAt);
    } else {
      // Standard gameplay camera
      this.distance = 6.5;
      this.height = 3.2;
      this.yaw = 0;
      this.currentArmFraction = 1.0;
    }
  }

  getCinematicTramMode(): CinematicTramMode {
    return this.cinematicTramMode;
  }

  /**
   * Computes the collision fraction along the camera arm to avoid clipping into vertical walls.
   * Ramps and floors (surfaces with normal pointing mostly upwards, Ny > 0.40) are ignored
   * so climbing ramps never triggers unwanted camera jumps or snaps.
   * In cinematic tram mode, arm fraction is always 1.0 so the camera never pulls in close.
   */
  private terrainBlocksArm = false;

  private computeArmFraction(
    target: THREE.Vector3,
    collidableMeshes?: THREE.Object3D[],
    desired?:THREE.Vector3
  ): number {
    this.terrainBlocksArm = false;
    if (this.isCinematicTram) {
      return 1.0;
    }

    if (!collidableMeshes || collidableMeshes.length === 0) {
      return 1.0;
    }

    this.playerCenter.set(target.x, target.y + 0.65, target.z);

    const behindX = desired?.x??target.x - Math.sin(this.yaw) * this.distance;
    const behindZ = desired?.z??target.z + Math.cos(this.yaw) * this.distance;
    const behindY = desired?.y??target.y + this.height;

    this.camDir.set(
      behindX - this.playerCenter.x,
      behindY - this.playerCenter.y,
      behindZ - this.playerCenter.z
    );
    const maxDist = this.camDir.length();
    if (maxDist < 0.1) return 1.0;
    this.camDir.divideScalar(maxDist);

    // Compute camera right vector perpendicular to camDir and up
    this.rightVec.crossVectors(this.camDir, this.upVec).normalize();
    if (this.rightVec.lengthSq() < 0.01) {
      this.rightVec.set(1, 0, 0);
    }

    // 4 Probe ray offsets to account for camera volume without probing down into the floor/ramp
    let minFraction = 1.0;
    const margin = 0.45; // Safety distance away from wall surface to prevent near-plane clipping
    const minAllowedDist = 1.4; // Minimum distance camera can approach character

    for (let probe=0;probe<4;probe++) {
      const side=probe===1 ? .28 : probe===2 ? -.28 : 0;
      this.probeOrigin.set(
        this.playerCenter.x + this.rightVec.x*side,
        this.playerCenter.y + (probe===3 ? .25 : 0),
        this.playerCenter.z + this.rightVec.z*side
      );

      this.raycaster.set(this.probeOrigin, this.camDir);
      this.raycaster.near = 0.25;
      this.raycaster.far = maxDist;

      this.hits.length=0;
      this.raycaster.intersectObjects(collidableMeshes,false,this.hits);
      for (const hit of this.hits) {
        const terrain = hit.object.userData.blocksCameraOnSlopes === true;
        // Inspect surface normal: filter out floors and ramps!
        if (hit.face && !terrain) {
          this.tempNormal.copy(hit.face.normal);
          this.tempNormal.transformDirection(hit.object.matrixWorld);
          // If normal points upward (Ny > 0.40), it is a ramp or floor underneath, NOT an obstruction wall!
          if (this.tempNormal.y > 0.40 && hit.point.y<=this.playerCenter.y+.15) {
            continue;
          }
        }

        const safeDist = Math.max(terrain ? 0.22 : minAllowedDist, hit.distance - margin);
        const fraction = Math.min(1.0, safeDist / maxDist);
        if (fraction < minFraction) {
          minFraction = fraction;
          this.terrainBlocksArm = terrain;
        }
        break; // Only closest valid wall hit on this probe
      }
    }

    return this.terrainBlocksArm ? minFraction : Math.max(minAllowedDist / maxDist, minFraction);
  }

  snapTo(target: THREE.Vector3, collidableMeshes?: THREE.Object3D[]): void {
    this.chaseYawVelocity=0;
    this.steerHeadingHold=0;
    if(this.naraTrainView){this.naraTrainInitialized=false;this.follow(target,this.lookAhead.set(0,0,0),0,collidableMeshes);return;}
    this.museumChaseInitialized=false;
    this.lookAhead.set(0,0,0);
    this.manualYawCooldown=0;
    if (this.cinematicTramMode === "fixed_padel") {
      this.yaw = 0;
      this.stillTimer = 0;
      this.lastMovingAngle = 0;
      this.smoothedTarget.copy(target);
      this.isInitialized = true;
      this.currentArmFraction = 1.0;
      this.object.position.set(0.0, 16.5, 40.0);
      this.currentLookAt.set(0.0, 13.0, 0.0);
      this.object.lookAt(this.currentLookAt);
      return;
    }

    this.yaw = this.cinematicTramMode === "tranvia2" ? -Math.PI / 2 : this.isCinematicTram?0:this.stageYaw;
    this.stillTimer = 0;
    this.lastMovingAngle = this.yaw;
    this.smoothedTarget.copy(target);
    this.isInitialized = true;

    const targetFraction = this.computeArmFraction(target, collidableMeshes);
    this.currentArmFraction = targetFraction;

    const effectiveDist = this.distance * this.currentArmFraction;
    const effectiveHeight = this.terrainBlocksArm
      ? 0.65 + (this.height - 0.65) * this.currentArmFraction
      : this.height * Math.max(0.65, this.currentArmFraction);

    const behindX = target.x - Math.sin(this.yaw) * effectiveDist;
    const behindZ = target.z + Math.cos(this.yaw) * effectiveDist;
    const behindY = target.y + effectiveHeight;

    this.desiredPos.set(behindX, behindY, behindZ);

    this.object.position.copy(this.desiredPos);
    this.lookTarget.set(target.x, target.y + (this.isCinematicTram ? 0.8 : 0.5), target.z);
    this.currentLookAt.copy(this.lookTarget);
    this.object.lookAt(this.currentLookAt);
  }

  follow(
    target: THREE.Vector3,
    velocity: THREE.Vector3,
    delta: number,
    collidableMeshes?: THREE.Object3D[],
    horizontalInput=0
  ): void {
    if(this.naraTrainView) {
      // Travel compensation follows the fast train exactly; easing only adjusts the framing.
      if(this.naraTrainInitialized){this.tempCheckVec.subVectors(this.naraTrainOrigin,this.naraTrainPrevious);this.object.position.add(this.tempCheckVec);this.currentLookAt.add(this.tempCheckVec);}
      if(this.machineOverhead){
        const height=Math.max(25,14/(Math.tan(this.object.fov*Math.PI/360)*Math.max(.4,this.object.aspect))-5);
        this.desiredPos.copy(this.naraTrainOrigin).add(this.tempCheckVec.set(0,height,16));
        this.lookTarget.copy(this.naraTrainOrigin).add(this.tempCheckVec.set(0,-1,0));
      }else {
        this.desiredPos.copy(this.naraTrainOrigin).add(this.tempCheckVec.set(22,27,29));
        this.lookTarget.copy(this.naraTrainOrigin).add(this.tempCheckVec.set(3,1,-2));
      }
      const blend=this.naraTrainInitialized?1-Math.exp(-5*delta):1;
      this.object.position.lerp(this.desiredPos,blend);this.currentLookAt.lerp(this.lookTarget,blend);this.object.lookAt(this.currentLookAt);
      this.naraTrainPrevious.copy(this.naraTrainOrigin);this.naraTrainInitialized=true;return;
    }
    if(this.cannonScene) {
      this.lookTarget.copy(this.cannonOrigin).lerp(this.cannonGoal,.5);
      const dx=this.cannonGoal.x-this.cannonOrigin.x,dz=this.cannonGoal.z-this.cannonOrigin.z,length=Math.hypot(dx,dz)||1;
      const distance=(length+55)/(2*Math.tan(this.object.fov*Math.PI/360)*Math.max(.4,this.object.aspect));
      this.desiredPos.set(this.lookTarget.x-dz/length*distance,this.lookTarget.y+8,this.lookTarget.z+dx/length*distance);
      const t=this.cannonSceneInitialized ? 1-Math.exp(-3*delta):1;
      this.object.position.lerp(this.desiredPos,t);this.currentLookAt.lerp(this.lookTarget,t);this.object.lookAt(this.currentLookAt);
      this.cannonSceneInitialized=true;return;
    }
    if(this.museumChase) {
      const t=this.museumChaseInitialized ? 1-Math.exp(-12*delta):1;
      this.smoothedTarget.lerp(target,t);this.desiredPos.set(this.smoothedTarget.x+10,this.smoothedTarget.y+8,this.smoothedTarget.z-24);
      const fraction=this.computeArmFraction(this.smoothedTarget,collidableMeshes,this.desiredPos);
      this.desiredPos.lerpVectors(this.smoothedTarget,this.desiredPos,fraction);this.object.position.lerp(this.desiredPos,t);
      this.currentLookAt.set(this.smoothedTarget.x,this.smoothedTarget.y+1,this.smoothedTarget.z+13);this.object.lookAt(this.currentLookAt);
      this.museumChaseInitialized=true;return;
    }
    if (this.cinematicTramMode === "fixed_padel") {
      this.object.position.set(0.0, 16.5, 40.0);
      this.currentLookAt.set(0.0, 13.0, 0.0);
      this.object.lookAt(this.currentLookAt);
      return;
    }

    if (!this.isInitialized) {
      this.smoothedTarget.copy(target);
      this.isInitialized = true;
    }

    // Smooth target filtering:
    // X and Z are brisk and direct (factor 22.0 * delta) for immediate player steering feel
    // Y is smoothly critically-damped (factor 10.0 * delta) to absorb physics contact micro-steps on ramps
    const smoothXZ = 1 - Math.exp(-26.0 * delta);
    const smoothY = target.y < -12.0 ? 1 - Math.exp(-25.0 * delta) : 1 - Math.exp(-10.0 * delta);

    this.smoothedTarget.x += (target.x - this.smoothedTarget.x) * smoothXZ;
    this.smoothedTarget.z += (target.z - this.smoothedTarget.z) * smoothXZ;
    this.smoothedTarget.y += (target.y - this.smoothedTarget.y) * smoothY;

    const speed = Math.hypot(velocity.x, velocity.z);
    this.manualYawCooldown=Math.max(0,this.manualYawCooldown-delta);

    // Classic mode waits for a settled pause; chase mode follows meaningful movement continuously.
    if (!this.isCinematicTram && !this.canoeFollowing) {
      if(this.mode===1) {
        this.steerHeadingHold=Math.max(0,this.steerHeadingHold-delta);
        if(Math.abs(horizontalInput)>.12&&this.manualYawCooldown===0){this.lastMovingAngle+=THREE.MathUtils.clamp(horizontalInput,-1,1)*.85*Math.min(delta,.1);this.steerHeadingHold=.5;}
        else if(speed>1.1&&this.steerHeadingHold===0){const heading=Math.atan2(velocity.x,-velocity.z),change=Math.atan2(Math.sin(heading-this.lastMovingAngle),Math.cos(heading-this.lastMovingAngle));if(Math.abs(change)>.07)this.lastMovingAngle=heading;}
        // Critically damped turning, with a bounded angular speed: ignore small steering
        // corrections and ease into/out of larger turns instead of snapping after each contact.
        if(this.manualYawCooldown===0){let remaining=Math.min(delta,.1);while(remaining>0){const dt=Math.min(remaining,1/120),diff=Math.atan2(Math.sin(this.lastMovingAngle-this.yaw),Math.cos(this.lastMovingAngle-this.yaw));this.chaseYawVelocity=THREE.MathUtils.clamp(this.chaseYawVelocity+(5.76*diff-4.8*this.chaseYawVelocity)*dt,-1.1,1.1);this.yaw+=this.chaseYawVelocity*dt;remaining-=dt;}}
        const pullback=THREE.MathUtils.smoothstep(speed,2,28);
        this.distance+=(6.5+pullback*3-this.distance)*(1-Math.exp(-2.5*delta));
        this.height+=(3.2+pullback*.9-this.height)*(1-Math.exp(-2.5*delta));
      } else {
      if (speed > 0.45) {
        // Actively moving: reset still timer and record heading
        this.stillTimer = 0;
        // Ignore contact jitter, but retain even a deliberate slow turn before stopping.
        if(speed>.65) this.lastMovingAngle = Math.atan2(velocity.x, -velocity.z);
      } else {
        // Character is still: accumulate time
        this.stillTimer += delta;
        if (this.stillTimer >= .65 && this.manualYawCooldown===0) {
          // Smoothly rotate camera yaw to sit behind the character's last facing direction
          let diff = this.lastMovingAngle - this.yaw;
          diff=Math.atan2(Math.sin(diff),Math.cos(diff));
          this.yaw += diff * (1-Math.exp(-delta*2.2));
        }
      }
      }
    } else {
      // In cinematic tram mode: maintain stable, majestic framing
      this.stillTimer = 0;
      if (this.cinematicTramMode === "tranvia1") {
        // Tram in Tranvia1 loops around (0, 0)
        // Camera smoothly adjusts yaw to follow the tram cabin rotation
        if (speed > 0.3) {
          const moveAngle = Math.atan2(-velocity.x, -velocity.z);
          let diff = moveAngle - this.yaw;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          this.yaw += diff * (1-Math.exp(-delta*1.8));
        }
      } else if (this.cinematicTramMode === "tranvia2") {
        // Straight 144m railway track heading -Z
        // Maintain horizontal side angle: yaw = -Math.PI / 2 (placed at +X, looking across track to -X with sea in background)
        const targetYaw = -Math.PI / 2;
        let diff = targetYaw - this.yaw;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        this.yaw += diff * (1-Math.exp(-delta*5));
      } else if (this.cinematicTramMode === "bus35" || this.cinematicTramMode === "bus34") {
        // Bus travels along the street in -Z direction
        // Smoothly maintain forward cinematic perspective behind-above the bus
        const targetYaw = 0;
        let diff = targetYaw - this.yaw;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        this.yaw += diff * (1-Math.exp(-delta*4));
      } else if (this.cinematicTramMode === "mina") {
        const targetYaw = 0;
        let diff = targetYaw - this.yaw;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        this.yaw += diff * (1-Math.exp(-delta*3));
      }
    }

    const targetFraction = this.computeArmFraction(this.smoothedTarget, collidableMeshes);

    if (targetFraction < this.currentArmFraction) {
      // Retract immediately; final-position collision keeps interpolation outside the obstruction.
      this.currentArmFraction=targetFraction;
    } else {
      // Smoothly zoom back out as player moves away from the wall
      const zoomOutRate = 4.2;
      this.currentArmFraction += (targetFraction - this.currentArmFraction) * (1-Math.exp(-zoomOutRate*delta));
    }

    const effectiveDist = this.distance * this.currentArmFraction;
    const effectiveHeight = this.terrainBlocksArm
      ? 0.65 + (this.height - 0.65) * this.currentArmFraction
      : this.height * Math.max(0.65, this.currentArmFraction);

    const behindX = this.smoothedTarget.x - Math.sin(this.yaw) * effectiveDist;
    const behindZ = this.smoothedTarget.z + Math.cos(this.yaw) * effectiveDist;
    const behindY = this.smoothedTarget.y + effectiveHeight;

    this.desiredPos.set(behindX, behindY, behindZ);

    // Keep translation responsive with a single smooth trailing motion.
    const wallPushFactor=Math.max(0,1-this.currentArmFraction);
    const trackingRate=this.isCinematicTram ? 6.5 : 18+wallPushFactor*10;
    this.object.position.lerp(this.desiredPos,1-Math.exp(-trackingRate*delta));

    // Constrain the FINAL interpolated position, so smoothing cannot leave the camera inside a wall.
    if (!this.isCinematicTram && collidableMeshes && collidableMeshes.length > 0) {
      this.playerCenter.set(target.x,target.y+.65,target.z);
      this.tempCheckVec.subVectors(this.object.position, this.playerCenter);
      const directDist = this.tempCheckVec.length();
      if (directDist > 0.1) {
        this.tempCheckVec.divideScalar(directDist);
        this.raycaster.set(this.playerCenter, this.tempCheckVec);
        this.raycaster.near = 0.25;
        this.raycaster.far = directDist;
        this.hits.length=0;
        this.raycaster.intersectObjects(collidableMeshes,false,this.hits);
        for (const hit of this.hits) {
          const terrain = hit.object.userData.blocksCameraOnSlopes === true;
          if (hit.face && !terrain) {
            this.tempNormal.copy(hit.face.normal);
            this.tempNormal.transformDirection(hit.object.matrixWorld);
            // Ignore floors and ramps!
            if (this.tempNormal.y > 0.40 && hit.point.y<=this.playerCenter.y+.15) {
              continue;
            }
          }
          if (hit.distance < directDist) {
            const safeLen = Math.max(.22, hit.distance - 0.45);
            this.object.position.copy(this.playerCenter).addScaledVector(this.tempCheckVec, safeLen);
            if (terrain) this.terrainBlocksArm = true;
          }
          break;
        }
      }
    }

    // Smooth look target
    const lookElevation = this.isCinematicTram
      ? (this.cinematicTramMode === "bus35" ? 2.2 : this.cinematicTramMode === "tranvia2" ? 1.0 : 0.8)
      : 0.5;
    const anticipation=this.isCinematicTram ? 0 : this.canoeCinematic
      ? Math.min(.3,4/Math.max(speed,.001)) : Math.min(.075,1.1/Math.max(speed,.001));
    const leadT=1-Math.exp(-5*delta);
    this.lookAhead.x+=(velocity.x*anticipation-this.lookAhead.x)*leadT;
    this.lookAhead.z+=(velocity.z*anticipation-this.lookAhead.z)*leadT;
    this.lookTarget.set(this.smoothedTarget.x+this.lookAhead.x,this.smoothedTarget.y+lookElevation,this.smoothedTarget.z+this.lookAhead.z);
    const lookT = 1 - Math.exp(-(this.isCinematicTram ? 8.0 : 14.0) * delta);
    this.currentLookAt.lerp(this.lookTarget, lookT);
    this.object.lookAt(this.currentLookAt);
  }

  rotateYaw(deltaYaw: number): void {
    if (this.cinematicTramMode === "fixed_padel") return;
    this.yaw += deltaYaw;
    this.chaseYawVelocity=0;
    this.manualYawCooldown=2;
    this.stillTimer=0;
    this.lastMovingAngle=this.yaw;
  }
}
