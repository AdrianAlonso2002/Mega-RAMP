import * as THREE from "three";
import type RAPIER from "@dimforge/rapier3d-compat";
import type { CharacterDefinition } from "./PlayerTypes";
import type { PhysicsWorld } from "../physics/PhysicsWorld";
import type { InputAxis } from "../input/InputManager";
import { SpriteTextures, type CharacterState } from "../rendering/SpriteTextures";
import { PLAYER_TOP_SPEED, PLAYER_DRIVE_FORCE, PLAYER_ROLLING_TORQUE } from "./PlayerTuning";

export class Player {
  readonly object = new THREE.Group();
  readonly radius = 0.75;
  private fallHeight=-12;
  setFallHeight(height:number):void {this.fallHeight=height;}
  private readonly baseScale = this.radius * 1.85;

  private readonly ballMesh: THREE.Mesh;
  private readonly sprite: THREE.Sprite;
  private body: RAPIER.RigidBody | null = null;

  private spawnPosition = new THREE.Vector3(0, 2, 0);

  // Progressive input & tilt accumulators
  private smoothedInputX = 0;
  private smoothedInputZ = 0;
  private throttleFactor = 0; // Smooth 3-tier progressive acceleration accumulator

  // Animation state machine (normal, move, scary, happy)
  private animState: CharacterState = "normal";
  private currentTextureKey = "";
  private isHappy = false;
  private animTimer = 0;
  private flipTimer = 0;

  // Pre-allocated vectors to avoid garbage collection allocations in game loop
  private readonly tempCamForward = new THREE.Vector3();
  private readonly tempCamRight = new THREE.Vector3();
  private readonly tempForce = new THREE.Vector3();
  private readonly steeringDirection = new THREE.Vector3();
  private readonly currentVel = new THREE.Vector3();
  private readonly rollAxis = new THREE.Vector3();
  private readonly worldUp = new THREE.Vector3(0,1,0);
  private rollingSlope = 0;
  private vehicleMounted = false;

  isInVehicle():boolean {return this.vehicleMounted;}

  get characterId():string{return this.character.id;}

  setVehicleMounted(mounted:boolean,showBall=false):void {
    this.vehicleMounted=mounted;
    this.body?.setEnabled(!mounted);
    this.ballMesh.visible=!mounted||showBall;
    this.sprite.scale.setScalar(this.baseScale*(mounted ? .83 : 1));
    this.sprite.position.set(0,0,0);
  }

  setVehiclePose(position:{x:number;y:number;z:number},velocity:{x:number;y:number;z:number}):void {
    this.object.position.copy(position);
    this.currentVel.copy(velocity);
    this.body?.setTranslation(position,true);
    this.sprite.material.rotation=0;
    this.setAnimationState(Math.hypot(velocity.x,velocity.z)>3 ? "move1":"normal");
  }

  constructor(
    private character: CharacterDefinition,
    private readonly physics: PhysicsWorld,
    spawnPos?: { x: number; y: number; z: number }
  ) {
    if (spawnPos) {
      this.spawnPosition.set(spawnPos.x, spawnPos.y, spawnPos.z);
    }

    // 1. Inner 2D Billboard Sprite for Character (created first so id is lower than ballMesh for local layering)
    SpriteTextures.preloadCharacterSkin(character.id, character.skinId);
    const spriteTexture = SpriteTextures.getCharacterTexture(character.id, "normal", character.skinId);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: spriteTexture,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      alphaTest: 0.20
    });

    this.sprite = new THREE.Sprite(spriteMaterial);
    this.sprite.scale.set(this.baseScale, this.baseScale, 1);
    this.sprite.position.set(0, 0, 0);
    this.sprite.renderOrder = 20; // Ensure character is rendered clearly above water and ground effects
    this.object.add(this.sprite);

    // 2. Transparent Glossy Outer Ball Mesh (created second so id is higher, blends over inner sprite)
    const sphereGeometry = new THREE.SphereGeometry(this.radius, 32, 24);
    const sphereTexture = SpriteTextures.getSphereTexture(character.id);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      map: sphereTexture,
      transparent: true,
      opacity: 0.55,
      shininess: 95,
      specular: new THREE.Color(0xffffff),
      depthWrite: false,
      side: THREE.FrontSide
    });
    sphereMaterial.userData.graphicsSurface='glass';sphereMaterial.userData.graphicsPlayerBall=true;

    this.ballMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.ballMesh.renderOrder = 21; // Ensure glossy outer ball renders above character sprite and water
    this.object.add(this.ballMesh);

    // 3. Initialize Rapier Physics Body
    this.initPhysics();
  }

  private initPhysics(): void {
    const created = this.physics.createBallBody(this.radius, this.spawnPosition);
    if (created) {
      this.body = created.body;
      // Rolling resistance is configured once by PhysicsWorld; releasing input preserves momentum.
    }
  }

  private frozen = false;

  setSpawnPosition(pos: { x: number; y: number; z: number }): void {
    this.spawnPosition.set(pos.x, pos.y, pos.z);
    this.respawn();
  }

  setFrozen(frozen: boolean): void {
    this.frozen = frozen;
    if (frozen) {
      if (this.body) {
        this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
      this.smoothedInputX = 0;
      this.smoothedInputZ = 0;
      this.throttleFactor = 0;
    }
  }

  isFrozen(): boolean {
    return this.frozen;
  }

  setHappy(happy: boolean): void {
    this.isHappy = happy;
    if (happy) {
      this.setAnimationState("happy");
    }
  }

  isHappyState(): boolean {
    return this.isHappy;
  }

  getAnimationState(): CharacterState {
    return this.animState;
  }

  private setAnimationState(state: CharacterState, force = false): void {
    if (!force && this.currentTextureKey === state) return;
    this.currentTextureKey = state;
    this.animState = state;
    const tex = SpriteTextures.getCharacterTexture(this.character.id, state, this.character.skinId);
    this.sprite.material.map = tex;
    this.sprite.material.needsUpdate = true;
  }

  /**
   * Seamlessly switches the player to a new character in real-time,
   * updating stats, outer sphere custom stripe, and inner sprite textures.
   */
  setCharacter(newChar: CharacterDefinition): void {
    this.character = newChar;
    SpriteTextures.preloadCharacterSkin(newChar.id, newChar.skinId);
    const sphereTexture = SpriteTextures.getSphereTexture(newChar.id);
    (this.ballMesh.material as THREE.MeshPhongMaterial).map = sphereTexture;
    (this.ballMesh.material as THREE.MeshPhongMaterial).needsUpdate = true;
    this.setAnimationState(this.animState, true);
  }

  respawn(): void {
    this.teleportVersion++;
    this.fallHeight=-12;
    this.setVehicleMounted(false);
    this.frozen = false;
    this.isHappy = false;
    this.smoothedInputX = 0;
    this.smoothedInputZ = 0;
    this.throttleFactor = 0;
    this.rollingSlope = 0;
    this.animTimer = 0;
    this.flipTimer = 0;
    this.setAnimationState("normal");

    if (!this.body) {
      this.initPhysics();
    }
    if (this.body) {
      this.body.setTranslation(
        { x: this.spawnPosition.x, y: this.spawnPosition.y, z: this.spawnPosition.z },
        true
      );
      this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    this.object.position.copy(this.spawnPosition);
    this.ballMesh.rotation.set(0, 0, 0);
  }

  update(
    delta: number,
    input: InputAxis,
    camera: THREE.Camera
  ): { position: THREE.Vector3; velocity: THREE.Vector3; fellOut: boolean } {
    if (!this.body) {
      this.initPhysics();
    }

    if (!this.body) {
      return {
        position: this.object.position,
        velocity: this.currentVel.set(0, 0, 0),
        fellOut: false
      };
    }

    // When frozen (e.g. at Goal portal during teleportation), ball stops dead in its tracks
    if (this.frozen) {
      this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      return {
        position: this.object.position,
        velocity: this.currentVel.set(0, 0, 0),
        fellOut: false
      };
    }

    // Read current translation from Rapier
    const t = this.body.translation();
    this.object.position.set(t.x, t.y, t.z);

    const lv = this.body.linvel();
    this.currentVel.set(lv.x, lv.y, lv.z);
    const speed = Math.hypot(lv.x, lv.z);
    const ground=this.physics.getGroundContact(this.body,this.radius+.12);
    let downhill=0;
    if(ground && ground.normal.y>.2 && ground.normal.y<.995) {
      const normal=ground.normal,slope=Math.hypot(normal.x,normal.z);
      const direction=(normal.x*lv.x+normal.z*lv.z)/(Math.max(speed,1)*Math.max(slope,.001));
      downhill=THREE.MathUtils.smoothstep(direction,.1,.75)*THREE.MathUtils.smoothstep(1-normal.y,.005,.04);
    }
    this.rollingSlope+=(downhill-this.rollingSlope)*(1-Math.exp(-8*delta));
    // Less resistance while descending; flat-ground handling and explicit braking remain unchanged.
    this.body.setLinearDamping(THREE.MathUtils.lerp(.12,.018,this.rollingSlope));
    this.body.setAngularDamping(THREE.MathUtils.lerp(.16,.025,this.rollingSlope));

    // Progressive input smoothing (simulates stage tilt inertia with fine precision)
    // Faster responsiveness when releasing or reversing direction
    const isReversingX = (input.horizontal > 0 && this.smoothedInputX < 0) || (input.horizontal < 0 && this.smoothedInputX > 0);
    const isReversingZ = (input.vertical > 0 && this.smoothedInputZ < 0) || (input.vertical < 0 && this.smoothedInputZ > 0);

    const handlingMod = 0.55 + 0.55 * this.character.handling;
    const rampSpeed = ((input.horizontal === 0 && input.vertical === 0) ? 6.0 : (isReversingX || isReversingZ) ? 8.5 : 2.5) * handlingMod;
    const lerpFactor = 1-Math.exp(-delta*rampSpeed);

    this.smoothedInputX += (input.horizontal - this.smoothedInputX) * lerpFactor;
    this.smoothedInputZ += (input.vertical - this.smoothedInputZ) * lerpFactor;

    // Progressive magnitude calculation:
    // 3-Stage progressive build-up so clicking/pressing accelerates gradually,
    // avoiding sudden rocket/electric car bursts.
    const inputMagnitude = Math.hypot(this.smoothedInputX, this.smoothedInputZ);
    const rawMagnitude=Math.min(1,Math.hypot(input.horizontal,input.vertical));

    if (inputMagnitude > 0.02 && rawMagnitude > .02) {
      // Build up throttle progressively: starts gentle, keeps ramping up speed steadily
      this.throttleFactor = Math.min(1.0, this.throttleFactor + delta * 0.85);

      camera.getWorldDirection(this.tempCamForward);
      this.tempCamForward.y = 0;
      this.tempCamForward.normalize();

      this.tempCamRight.crossVectors(this.tempCamForward, this.worldUp).normalize();

      // Normalized direction vector
      const normX = this.smoothedInputX / inputMagnitude;
      const normZ = this.smoothedInputZ / inputMagnitude;

      // Staged progressive curve:
      // Tier 1 (micro-corrections): gentle 24% power floor for delicate platform edges
      // Tier 2 (steady roll): progressive rise as throttle accumulates
      // Tier 3 (fast cruise speed): high exhilarating top speed on continuous sustained push
      const progressivePower = (0.24 + 0.86 * Math.pow(this.throttleFactor, 1.25)) * Math.min(1.0, Math.pow(inputMagnitude, 1.1));
      const baseForce = PLAYER_DRIVE_FORCE * this.character.acceleration;
      const appliedForce = baseForce * progressivePower * delta;

      this.tempForce.set(0, 0, 0)
        .addScaledVector(this.tempCamForward, normZ * appliedForce)
        .addScaledVector(this.tempCamRight, normX * appliedForce);

      // Active Counter-Braking: If user steers opposite to moving direction, apply responsive braking scaled by handling
      const moveDot = (lv.x * this.tempForce.x + lv.z * this.tempForce.z);
      if (moveDot < 0 && speed > 0.6) {
        this.tempForce.multiplyScalar(1.0 + 2.5 * Math.pow(this.character.handling, 2));
      }
      this.steeringDirection.copy(this.tempForce).normalize();

      // Limit propulsion, not velocity gained from gravity, jump pads or moving obstacles.
      const maxDrivenSpeed=PLAYER_TOP_SPEED*this.character.speed;
      if(speed>maxDrivenSpeed*.85) {
        const forwardImpulse=(lv.x*this.tempForce.x+lv.z*this.tempForce.z)/speed;
        if(forwardImpulse>0) {
          const reduction=THREE.MathUtils.smoothstep(speed,maxDrivenSpeed*.85,maxDrivenSpeed);
          // Sustain the requested cruise speed against rolling resistance instead of tapering to zero
          // below the stated top speed. No compensation in the air or beyond the driven range.
          const overspeed=1-THREE.MathUtils.smoothstep(speed,maxDrivenSpeed,maxDrivenSpeed*1.08);
          const resistance=this.body.linearDamping()+.4*this.body.angularDamping();
          const maintenance=ground ? this.body.mass()*speed*resistance*delta*rawMagnitude*
            Math.min(1,inputMagnitude)*overspeed/(1+PLAYER_ROLLING_TORQUE*this.character.handling) : 0;
          const removed=Math.max(0,forwardImpulse-maintenance)*reduction;
          this.tempForce.x-=lv.x/speed*removed;
          this.tempForce.z-=lv.z/speed*removed;
        }
      }

      this.body.applyImpulse(
        { x: this.tempForce.x, y: 0, z: this.tempForce.z },
        true
      );

      // Active Handling Mechanics: Lateral Grip vs Centrifugal Drift
      // High handling (Misi 0.95, Pao 0.90) grips and snaps trajectory tightly into corners.
      // Lower handling (Adri 0.75) drifts outwards with heavier momentum in fast turns.
      if (speed > 0.6) {
        if (this.steeringDirection.lengthSq() > .001) {
          // Steering follows the requested direction, even when forward propulsion has tapered off.
          const uFx = this.steeringDirection.x;
          const uFz = this.steeringDirection.z;

          // Decompose linear velocity into parallel and lateral components
          const forwardDot = (lv.x * uFx + lv.z * uFz);
          const lateralVelX = lv.x - forwardDot * uFx;
          const lateralVelZ = lv.z - forwardDot * uFz;

          // Grip power: Misi (0.95) -> 1.05; Adri (0.75) -> 0.48
          const gripFactor = Math.pow(this.character.handling, 3.2) * 1.25;
          const lateralCorrection = 1-Math.exp(-delta*4.8*gripFactor*rawMagnitude);
          const mass=this.body.mass();

          // Damps lateral drift towards the steering line
          this.body.applyImpulse(
            { x: -lateralVelX * lateralCorrection * mass, y: 0, z: -lateralVelZ * lateralCorrection * mass },
            true
          );
        }
      }

      // Progressive rolling torque
      const torqueMag = PLAYER_ROLLING_TORQUE*this.radius*this.character.handling;
      this.body.applyTorqueImpulse(
        { x: this.tempForce.z * torqueMag, y: 0, z: -this.tempForce.x * torqueMag },
        true
      );
    } else {
      // Fade throttle accumulator when input is released
      this.throttleFactor = Math.max(0, this.throttleFactor - delta * 2.5);
    }

    // Suppress phantom vertical bounce impulses on flat ground (ghost seam collisions between blocks)
    const curLv = this.body.linvel();
    if (curLv.y > 0.01 && curLv.y < 3.2) {
      const relativeRise=curLv.y-(ground?.verticalVelocity ?? 0);
      if (ground && ground.normal.y>.985 && relativeRise>0 && relativeRise<.6 &&
          ground.distance<=this.radius+.08) {
        // Ball is rolling on flat ground, cancel phantom upward hop from tile seams
        this.body.setLinvel({ x: curLv.x, y: ground.verticalVelocity, z: curLv.z }, true);
        this.currentVel.y = ground.verticalVelocity;
      }
    }

    // Rotate ball mesh visually to match rolling motion
    if (speed > 0.01) {
      const rollAngle = (speed * delta) / this.radius;
      this.rollAxis.set(-lv.z,0,lv.x).normalize();
      this.ballMesh.rotateOnWorldAxis(this.rollAxis, rollAngle);
    }

    // Dynamic Character Animation State Machine inside the ball:
    // 1. happy: Goal crossed / victory celebration
    // 2. scary1 / scary2: High speed (>= 9.2) or rapid falling (lv.y <= -4.8), alternating frames
    // 3. move1 / move2: Walking/running, alternating stride steps
    // 4. normal: Idle breathing / bobbing
    this.animTimer += delta;
    if (this.isHappy) {
      this.setAnimationState("happy");
      this.sprite.position.x = 0;
      this.sprite.position.y = Math.abs(Math.sin(this.animTimer * 10.0)) * 0.035;
    } else if (speed >= 9.2 || lv.y <= -4.8) {
      // Scary State: High-speed running & free-fall panic
      this.flipTimer += delta * 12.0;
      const isAlt = (Math.floor(this.flipTimer) % 2) === 1;
      this.setAnimationState(isAlt ? "scary2" : "scary1");
      this.sprite.position.x = 0;
      this.sprite.position.y = Math.abs(Math.sin(this.flipTimer * Math.PI)) * 0.008;
    } else if (speed >= 0.35) {
      // Move State: Walking / Running stride alternating
      const stepRate = 3.2 + (speed / 9.0) * 6.5;
      this.flipTimer += delta * stepRate;
      const isAlt = (Math.floor(this.flipTimer) % 2) === 1;
      this.setAnimationState(isAlt ? "move2" : "move1");
      this.sprite.position.x = 0;
      this.sprite.position.y = Math.abs(Math.sin(this.flipTimer * Math.PI)) * 0.012;
    } else {
      // Normal / Idle State
      this.setAnimationState("normal");
      this.sprite.position.x = 0;
      this.sprite.position.y = Math.sin(this.animTimer * 3.5) * 0.006;
    }

    // The illustrated character faces the camera; rolling belongs to the outer ball.
    this.sprite.material.rotation = 0;

    const fellOut = t.y < this.fallHeight;

    return {
      position: this.object.position,
      velocity: this.currentVel,
      fellOut
    };
  }

  getPosition(): THREE.Vector3 {
    return this.object.position;
  }

  getBody(): RAPIER.RigidBody | null {
    return this.body;
  }

  private teleportVersion=0;
  getTeleportVersion():number {return this.teleportVersion;}
  teleportTo(x: number, y: number, z: number): void {
    this.teleportVersion++;
    if (this.body) {
      this.body.setTranslation({ x, y, z }, true);
      this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
    this.object.position.set(x, y, z);
    this.currentVel.set(0, 0, 0);
  }

  setLinearVelocity(vel: { x: number; y: number; z: number }): void {
    if (!this.body) return;
    this.body.setLinvel(vel, true);
    this.currentVel.set(vel.x, vel.y, vel.z);
  }

  getVelocity(): THREE.Vector3 {
    return this.currentVel;
  }

  linvel(): { x: number; y: number; z: number } {
    if(this.vehicleMounted) return this.currentVel;
    if (this.body) {
      return this.body.linvel();
    }
    return { x: this.currentVel.x, y: this.currentVel.y, z: this.currentVel.z };
  }

  getSpeed(): number {
    return this.currentVel.length();
  }

  getCharacter(): CharacterDefinition {
    return this.character;
  }

  applyDrag(dragFactor: number): void {
    if (!this.body) return;
    const lv = this.body.linvel();
    const retain = Math.max(0.05, 1 - Math.min(0.95, dragFactor));
    this.body.setLinvel({ x: lv.x * retain, y: lv.y, z: lv.z * retain }, true);
    this.currentVel.set(lv.x * retain, lv.y, lv.z * retain);
  }

  destroy(): void {
    if (this.body) {
      this.physics.removeRigidBody(this.body);
      this.body = null;
    }
    this.ballMesh.geometry.dispose();
    if (this.ballMesh.material instanceof THREE.Material) {
      this.ballMesh.material.dispose();
    }
    this.sprite.material.dispose();
    this.object.clear();
  }
}
