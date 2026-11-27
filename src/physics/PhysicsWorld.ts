import RAPIER from "@dimforge/rapier3d-compat";

export class PhysicsWorld {
  private world?: RAPIER.World;
  private readonly initPromise: Promise<void>;
  private staticColliders: RAPIER.Collider[] = [];
  private kinematicBodies: RAPIER.RigidBody[] = [];

  private colliderCapture?: RAPIER.Collider[];

  /** Capture only colliders created for one level object, without scanning the world. */
  beginColliderCapture(): RAPIER.Collider[] {
    if (this.colliderCapture) throw new Error("Nested collider capture");
    return this.colliderCapture = [];
  }

  endColliderCapture(): void { this.colliderCapture = undefined; }

  /** One compound kinematic body for a gently rocking stage. Keep every authored collider shape. */
  createStageAssembly(pivot: {x:number;y:number;z:number}): RAPIER.RigidBody | undefined {
    if (!this.world) return;
    const body = this.world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(pivot.x,pivot.y,pivot.z));
    for (const old of this.staticColliders) {
      const p = old.translation();
      const description = new RAPIER.ColliderDesc(old.shape)
        .setTranslation(p.x-pivot.x,p.y-pivot.y,p.z-pivot.z).setRotation(old.rotation())
        .setFriction(old.friction()).setRestitution(old.restitution())
        .setFrictionCombineRule(old.frictionCombineRule()).setRestitutionCombineRule(old.restitutionCombineRule()).setContactSkin(old.contactSkin())
        .setCollisionGroups(old.collisionGroups()).setSolverGroups(old.solverGroups()).setSensor(old.isSensor()).setEnabled(old.isEnabled());
      this.createTrackedCollider(description,body);
      this.world.removeCollider(old,false);
    }
    this.staticColliders = [];
    this.kinematicBodies.push(body);
    return body;
  }

  private createTrackedCollider(description: RAPIER.ColliderDesc, body?: RAPIER.RigidBody): RAPIER.Collider {
    const collider = this.world!.createCollider(description, body);
    this.colliderCapture?.push(collider);
    return collider;
  }

  constructor() {
    this.initPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    const origWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("using deprecated parameters for the initialization function")
      ) {
        return;
      }
      origWarn.apply(console, args);
    };

    try {
      await RAPIER.init();
    } finally {
      console.warn = origWarn;
    }

    this.world = new RAPIER.World({
      x: 0,
      y: -18.0, // Snappy Nintendo DS platformer gravity
      z: 0
    });
  }

  async waitForReady(): Promise<void> {
    await this.initPromise;
  }

  isReady(): boolean {
    return this.world !== undefined;
  }

  private accumulator = 0;
  private readonly fixedDt = 1 / 60;

  step(delta: number): void {
    if (!this.world) {
      return;
    }

    this.accumulator += Math.min(delta, 0.1);
    while (this.accumulator >= this.fixedDt) {
      this.world.timestep = this.fixedDt;
      this.world.step();
      this.accumulator -= this.fixedDt;
    }
  }

  getWorld(): RAPIER.World | undefined {
    return this.world;
  }

  castRayDown(origin: { x: number; y: number; z: number }, maxDistance: number): boolean {
    if (!this.world) return false;
    const ray = new RAPIER.Ray(origin, { x: 0, y: -1, z: 0 });
    const hit = this.world.castRay(ray, maxDistance, true);
    return hit !== null && hit.timeOfImpact <= maxDistance;
  }

  hasBodyContact(first: RAPIER.RigidBody, second: RAPIER.RigidBody): boolean {
    if (!this.world || first.numColliders() === 0 || second.numColliders() === 0) return false;
    let touching = false;
    this.world.contactPair(first.collider(0), second.collider(0), manifold => {
      for (let i = 0; i < manifold.numSolverContacts(); i++) {
        if (manifold.solverContactDist(i) <= 0.06) touching = true;
      }
    });
    return touching;
  }

  getGroundContact(body:RAPIER.RigidBody,distance:number):{normal:RAPIER.Vector;verticalVelocity:number;distance:number}|null {
    if(!this.world) return null;
    const ray=new RAPIER.Ray(body.translation(),{x:0,y:-1,z:0});
    const hit=this.world.castRayAndGetNormal(ray,distance,true,undefined,undefined,undefined,body);
    return hit ? {normal:hit.normal,verticalVelocity:hit.collider.parent()?.linvel().y ?? 0,distance:hit.timeOfImpact} : null;
  }

  /**
   * Creates a dynamic physics sphere for the monkey ball.
   * Zero base restitution prevents phantom bouncing on flat ground and seams.
   * RestitutionCombineRule.Max preserves full bounce on high-restitution bumpers.
   */
  createBallBody(
    radius: number,
    position: { x: number; y: number; z: number }
  ): { body: RAPIER.RigidBody; collider: RAPIER.Collider } | null {
    if (!this.world) return null;

    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(position.x, position.y, position.z)
      .setLinearDamping(0.12)
      .setAngularDamping(0.16)
      .setCcdEnabled(true);

    const body = this.world.createRigidBody(bodyDesc);

    const colliderDesc = RAPIER.ColliderDesc.ball(radius)
      .setFriction(0.65)
      .setRestitution(0.0)
      .setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Max)
      .setContactSkin(0.02);

    const collider = this.createTrackedCollider(colliderDesc, body);

    return { body, collider };
  }

  createCanoeBody(position:{x:number;y:number;z:number},yaw=0,scale=1):RAPIER.RigidBody|null {
    if(!this.world) return null;
    const body=this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(position.x,position.y,position.z)
      .setRotation({x:0,y:Math.sin(yaw/2),z:0,w:Math.cos(yaw/2)}).enabledRotations(false,true,false)
      .setLinearDamping(.035).setAngularDamping(1.0).setCcdEnabled(true));
    const hull=RAPIER.ColliderDesc.capsule(1.75*scale,.52*scale).setRotation({x:Math.SQRT1_2,y:0,z:0,w:Math.SQRT1_2})
      .setMass(90).setFriction(.2).setRestitution(.05);
    this.createTrackedCollider(hull,body);
    body.recomputeMassPropertiesFromColliders();
    body.setEnabled(false);
    return body;
  }

  /** Weighted inflatable: a real free-moving compound body, owned by the stage. */
  createInflatableBody(position:{x:number;y:number;z:number},scale=1):RAPIER.RigidBody|null {
    if(!this.world) return null;
    const body=this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(position.x,position.y,position.z)
      .setLinearDamping(.6).setAngularDamping(2).setCcdEnabled(true));
    this.createTrackedCollider(RAPIER.ColliderDesc.ball(.7*scale).setTranslation(0,.72*scale,0).setMass(1.1).setFriction(.55).setRestitution(.13),body);
    this.createTrackedCollider(RAPIER.ColliderDesc.capsule(.5*scale,.57*scale).setTranslation(0,1.65*scale,0).setMass(.25).setFriction(.35).setRestitution(.2),body);
    this.createTrackedCollider(RAPIER.ColliderDesc.ball(.6*scale).setTranslation(0,2.8*scale,0).setMass(.08).setFriction(.3).setRestitution(.2),body);
    this.kinematicBodies.push(body);return body;
  }
  /** Scripted carriage transport supplies displacement; floor friction must not add it twice. */
  setPassengerFloorFriction(body:RAPIER.RigidBody):void {
    for(let i=0;i<body.numColliders();i++) {const collider=body.collider(i);collider.setFriction(0);collider.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Min);}
  }

  createConvexCollider(vertices:Float32Array,friction=.7,restitution=.02):RAPIER.Collider|null {
    if(!this.world) return null;
    const desc=RAPIER.ColliderDesc.convexHull(vertices);if(!desc) return null;
    const collider=this.createTrackedCollider(desc.setFriction(friction).setRestitution(restitution));
    this.staticColliders.push(collider);return collider;
  }

  /**
   * Creates a static box collider for platforms or obstacles.
   */
  createBoxCollider(
    position: { x: number; y: number; z: number },
    rotation: { x: number; y: number; z: number; w: number },
    halfExtents: { x: number; y: number; z: number },
    friction = 0.65,
    restitution = 0.0
  ): RAPIER.Collider | null {
    if (!this.world) return null;

    const colliderDesc = RAPIER.ColliderDesc.cuboid(
      halfExtents.x,
      halfExtents.y,
      halfExtents.z
    )
      .setTranslation(position.x, position.y, position.z)
      .setRotation({
        x: rotation.x,
        y: rotation.y,
        z: rotation.z,
        w: rotation.w
      })
      .setFriction(friction)
      .setRestitution(restitution)
      .setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Max)
      .setContactSkin(0.02);

    const collider = this.createTrackedCollider(colliderDesc);
    this.staticColliders.push(collider);
    return collider;
  }

  /**
   * Creates a kinematic box body for moving platforms.
   */
  createKinematicBox(
    position: { x: number; y: number; z: number },
    rotation: { x: number; y: number; z: number; w: number },
    halfExtents: { x: number; y: number; z: number },
    friction = 0.85,
    restitution = 0.1,
    colliderOffset?: { x: number; y: number; z: number }
  ): { body: RAPIER.RigidBody; collider: RAPIER.Collider } | null {
    if (!this.world) return null;

    const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
      .setTranslation(position.x, position.y, position.z)
      .setRotation(rotation);

    const body = this.world.createRigidBody(bodyDesc);

    const colliderDesc = RAPIER.ColliderDesc.cuboid(
      halfExtents.x,
      halfExtents.y,
      halfExtents.z
    )
      .setFriction(friction)
      .setRestitution(restitution);

    if (colliderOffset) {
      colliderDesc.setTranslation(colliderOffset.x, colliderOffset.y, colliderOffset.z);
    }

    const collider = this.createTrackedCollider(colliderDesc, body);
    this.kinematicBodies.push(body);
    return { body, collider };
  }

  /**
   * Adds an additional child box collider to an existing rigid body (e.g. walls for a cabin).
   */
  addBoxColliderToBody(
    body: RAPIER.RigidBody,
    offset: { x: number; y: number; z: number },
    halfExtents: { x: number; y: number; z: number },
    friction = 0.85,
    restitution = 0.1,
    rotation?: { x: number; y: number; z: number; w: number }
  ): RAPIER.Collider | null {
    if (!this.world) return null;
    const colliderDesc = RAPIER.ColliderDesc.cuboid(
      halfExtents.x,
      halfExtents.y,
      halfExtents.z
    )
      .setTranslation(offset.x, offset.y, offset.z)
      .setFriction(friction)
      .setRestitution(restitution);
    if (rotation) {
      colliderDesc.setRotation(rotation);
    }
    return this.createTrackedCollider(colliderDesc, body);
  }

  /**
   * Creates a kinematic surface for rotating bowls and other concave moving geometry.
   */
  createKinematicTrimesh(
    position: {x:number;y:number;z:number}, vertices:Float32Array, indices:Uint32Array,
    restitution=0.02, friction=0.62, rotation?:{x:number;y:number;z:number;w:number}, lowGrip=false
  ): {body:RAPIER.RigidBody;collider:RAPIER.Collider}|null {
    if(!this.world) return null;
    const desc=RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(position.x,position.y,position.z);
    if(rotation) desc.setRotation(rotation);
    const body=this.world.createRigidBody(desc);
    const shape=RAPIER.ColliderDesc.trimesh(vertices,indices).setRestitution(restitution).setFriction(friction);
    if(lowGrip) shape.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Min);
    const collider=this.createTrackedCollider(shape,body);
    this.kinematicBodies.push(body);
    return {body,collider};
  }

  addConvexColliderToBody(body:RAPIER.RigidBody,vertices:Float32Array,friction=.3,restitution=.02,lowGrip=false):RAPIER.Collider|null {
    if(!this.world) return null;
    const shape=RAPIER.ColliderDesc.convexHull(vertices);
    if(!shape) return null;
    shape.setFriction(friction).setRestitution(restitution);
    if(lowGrip) shape.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Min);
    return this.createTrackedCollider(shape,body);
  }

  addTrimeshColliderToBody(body:RAPIER.RigidBody,vertices:Float32Array,indices:Uint32Array,friction=.3,restitution=.02,lowGrip=false):RAPIER.Collider|null {
    if(!this.world) return null;
    const shape=RAPIER.ColliderDesc.trimesh(vertices,indices).setFriction(friction).setRestitution(restitution);
    if(lowGrip) shape.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Min);
    return this.createTrackedCollider(shape,body);
  }

  createKinematicSphere(position:{x:number;y:number;z:number},radius:number,friction=.85):{body:RAPIER.RigidBody;collider:RAPIER.Collider}|null {
    if(!this.world) return null;
    const body=this.world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(position.x,position.y,position.z));
    const collider=this.createTrackedCollider(RAPIER.ColliderDesc.ball(radius).setFriction(friction).setRestitution(0).setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Min),body);
    this.kinematicBodies.push(body);return {body,collider};
  }
  addCylinderColliderToBody(body:RAPIER.RigidBody,offset:{x:number;y:number;z:number},radius:number,halfHeight:number,friction=.85):RAPIER.Collider|null {
    if(!this.world) return null;
    return this.createTrackedCollider(RAPIER.ColliderDesc.cylinder(halfHeight,radius).setTranslation(offset.x,offset.y,offset.z).setFriction(friction).setRestitution(0).setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Min),body);
  }
  createKinematicCylinder(
    position: { x: number; y: number; z: number },
    radius: number,
    halfHeight: number,
    restitution = 1.35,
    friction = 0.3,
    rotation?: { x: number; y: number; z: number; w: number },
    lowGrip=false
  ): { body: RAPIER.RigidBody; collider: RAPIER.Collider } | null {
    if (!this.world) return null;

    const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
      .setTranslation(position.x, position.y, position.z);
    if (rotation) {
      bodyDesc.setRotation(rotation);
    }

    const body = this.world.createRigidBody(bodyDesc);

    const colliderDesc = RAPIER.ColliderDesc.cylinder(halfHeight, radius)
      .setRestitution(restitution)
      .setFriction(friction);
    if(lowGrip) colliderDesc.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Min);

    const collider = this.createTrackedCollider(colliderDesc, body);
    this.kinematicBodies.push(body);
    return { body, collider };
  }

  /**
   * Creates a static cylinder collider for poles, bumpers, or obstacles.
   */
  createCylinderCollider(
    position: { x: number; y: number; z: number },
    radius: number,
    halfHeight: number,
    restitution = 0.8,
    friction = 0.5,
    rotation?: { x: number; y: number; z: number; w: number }
  ): RAPIER.Collider | null {
    if (!this.world) return null;

    const colliderDesc = RAPIER.ColliderDesc.cylinder(halfHeight, radius)
      .setTranslation(position.x, position.y, position.z)
      .setRestitution(restitution)
      .setFriction(friction);
    if (rotation) {
      colliderDesc.setRotation(rotation);
    }

    const collider = this.createTrackedCollider(colliderDesc);
    this.staticColliders.push(collider);
    return collider;
  }

  /**
   * Creates a static trimesh collider for continuous curved 3D geometry (e.g. continuous circular Kamehameha tube).
   */
  createTrimeshCollider(
    vertices: Float32Array,
    indices: Uint32Array,
    restitution = 0.5,
    friction = 0.3
  ): RAPIER.Collider | null {
    if (!this.world) return null;

    try {
      const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices)
        .setRestitution(restitution)
        .setFriction(friction);

      const collider = this.createTrackedCollider(colliderDesc);
      this.staticColliders.push(collider);
      return collider;
    } catch (e) {
      console.warn("Failed to create trimesh collider:", e);
      return null;
    }
  }

  /**
   * Removes all stage colliders and kinematic bodies when transitioning between levels.
   */
  clearStageColliders(): void {
    if (!this.world) return;

    for (const collider of this.staticColliders) {
      try {
        if (collider.isValid()) {
          this.world.removeCollider(collider, false);
        }
      } catch {
        // Ignored
      }
    }
    this.staticColliders = [];

    for (const body of this.kinematicBodies) {
      try {
        this.world.removeRigidBody(body);
      } catch {
        // Ignored
      }
    }
    this.kinematicBodies = [];
  }

  removeRigidBody(body: RAPIER.RigidBody): void {
    if (!this.world) return;
    try {
      this.world.removeRigidBody(body);
    } catch {
      // Ignored
    }
  }

  destroy(): void {
    this.clearStageColliders();
    this.world?.free();
    this.world = undefined;
  }
}
