import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { Camera } from "../src/rendering/Camera";
import { GameState } from "../src/game/GameState";
import { ProgressionManager } from "../src/progression/ProgressionManager";

describe("Camera Collision and SpringArm", () => {
  it("frames cannon and basilica together from a horizontal side view throughout the shot",()=>{
    const camera=new Camera(),origin=new THREE.Vector3(0,30,11),goal=new THREE.Vector3(0,39,-210);
    camera.object.aspect=16/9;camera.object.updateProjectionMatrix();camera.snapTo(origin);
    camera.setCannonScene(origin,goal);camera.follow(origin,new THREE.Vector3(),1/60,[]);camera.object.updateMatrixWorld(true);
    const direction=camera.object.getWorldDirection(new THREE.Vector3());expect(Math.abs(direction.y)).toBeLessThan(.12);
    for(const point of [origin,goal]) {const screen=point.clone().project(camera.object);expect(Math.abs(screen.x)).toBeLessThan(.9);expect(Math.abs(screen.y)).toBeLessThan(.9);}
    const position=camera.object.position.clone();camera.follow(new THREE.Vector3(0,52,-90),new THREE.Vector3(0,4,-80),1/60,[]);
    expect(camera.object.position.distanceTo(position)).toBeLessThan(.01);
    camera.setCannonScene(null,null);camera.snapTo(origin);expect(camera.object.position.distanceTo(origin)).toBeLessThan(10);
  });
  it("frames MegaBajada almost overhead while preserving E7's wider cinematic angle",()=>{
    const camera=new Camera(),target=new THREE.Vector3(),velocity=new THREE.Vector3();camera.snapTo(target);
    for(let i=0;i<120;i++) {camera.setCanoeHeading(0,1/60,true,true);camera.follow(target,velocity,1/60,[]);}
    expect(camera.object.position.y).toBeGreaterThan(23);
    expect(Math.hypot(camera.object.position.x,camera.object.position.z)).toBeLessThan(5);
    const view=new THREE.Vector3();camera.object.getWorldDirection(view);
    expect(-view.y).toBeGreaterThan(.97);
    for(let i=0;i<120;i++) {camera.setCanoeHeading(0,1/60,true);camera.follow(target,velocity,1/60,[]);}
    expect(camera.object.position.z).toBeGreaterThan(16);
    expect(camera.object.position.y).toBeCloseTo(12.5,1);
  });

  it("frames SuperBajada higher and farther away, then restores the normal canoe and ball framing",()=>{
    const camera=new Camera(),target=new THREE.Vector3(),velocity=new THREE.Vector3();
    camera.snapTo(target);
    for(let i=0;i<120;i++) {camera.setCanoeHeading(0,1/60,true);camera.follow(target,velocity,1/60,[]);}
    expect(camera.object.position.y).toBeGreaterThan(12);
    expect(camera.object.position.z).toBeGreaterThan(16);
    for(let i=0;i<120;i++) {camera.setCanoeHeading(0,1/60);camera.follow(target,velocity,1/60,[]);}
    expect(camera.object.position.y).toBeCloseTo(4.2,1);
    expect(camera.object.position.z).toBeCloseTo(9,1);
    camera.setCanoeHeading(null,0);
    for(let i=0;i<120;i++) camera.follow(target,velocity,1/60,[]);
    expect(camera.object.position.z).toBeCloseTo(6.5,1);
  });

  it("stays outside a newly appearing wall on the first frame",()=>{
    const camera=new Camera(),target=new THREE.Vector3();camera.snapTo(target);
    const wall=new THREE.Mesh(new THREE.BoxGeometry(20,12,1),new THREE.MeshBasicMaterial());
    wall.position.set(0,2,2.5);wall.updateMatrixWorld(true);
    camera.follow(target,new THREE.Vector3(),1/120,[wall]);
    expect(camera.object.position.z).toBeLessThan(2);
  });

  it("tracks moving targets consistently at 30 and 120 frames per second",()=>{
    const simulate=(fps:number)=>{
      const camera=new Camera();camera.snapTo(new THREE.Vector3());
      for(let i=1;i<=fps*2;i++) camera.follow(new THREE.Vector3(i/fps*5,0,-i/fps*8),new THREE.Vector3(5,0,-8),1/fps,[]);
      return camera;
    };
    const slow=simulate(30),fast=simulate(120);
    expect(slow.object.position.distanceTo(fast.object.position)).toBeLessThan(.3);
    expect(slow.object.quaternion.angleTo(fast.object.quaternion)).toBeLessThan(.045);
  });

  it("keeps full distance in open space without obstacles", () => {
    const cam = new Camera();
    const playerPos = new THREE.Vector3(0, 0, 0);
    const playerVel = new THREE.Vector3(0, 0, 0);

    cam.snapTo(playerPos);
    expect(cam.object.position.distanceTo(playerPos)).toBeGreaterThan(6.0);

    // Follow in open space
    for (let i = 0; i < 20; i++) {
      cam.follow(playerPos, playerVel, 0.016, []);
    }
    expect(cam.object.position.distanceTo(playerPos)).toBeGreaterThan(6.0);
  });

  it("pulls camera closer to player when a wall is behind the player", () => {
    const cam = new Camera();
    const playerPos = new THREE.Vector3(0, 0, 0);
    const playerVel = new THREE.Vector3(0, 0, 0);

    // Initial snap
    cam.snapTo(playerPos);

    // Create a solid wall behind the player at Z = 2.5
    // Camera naturally wants to be at Z = 6.5, Y = 3.2
    const wallGeo = new THREE.BoxGeometry(10, 8, 1);
    const wallMat = new THREE.MeshBasicMaterial();
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(0, 2, 2.5);
    wallMesh.updateMatrixWorld(true);

    const collidableMeshes = [wallMesh];

    // Follow with wall obstacle
    for (let i = 0; i < 15; i++) {
      cam.follow(playerPos, playerVel, 0.016, collidableMeshes);
    }

    const distToPlayer = cam.object.position.distanceTo(playerPos);
    // Camera must pull in closer to the player than the wall (wall is at Z=2.0 front face)
    expect(distToPlayer).toBeLessThan(3.0);
    // Camera must be in front of the wall (Z < 2.5)
    expect(cam.object.position.z).toBeLessThan(2.5);
  });

  it("smoothly extends back out when player rolls away from the wall", () => {
    const cam = new Camera();
    const playerPos = new THREE.Vector3(0, 0, 0);
    const playerVel = new THREE.Vector3(0, 0, 0);

    const wallGeo = new THREE.BoxGeometry(10, 8, 1);
    const wallMat = new THREE.MeshBasicMaterial();
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(0, 2, 2.0);
    wallMesh.updateMatrixWorld(true);

    // First pull in close to wall
    for (let i = 0; i < 20; i++) {
      cam.follow(playerPos, playerVel, 0.016, [wallMesh]);
    }
    const closeDist = cam.object.position.distanceTo(playerPos);
    expect(closeDist).toBeLessThan(2.5);

    // Now player moves away into open space (no walls in range)
    for (let i = 0; i < 60; i++) {
      cam.follow(playerPos, playerVel, 0.016, []);
    }
    const extendedDist = cam.object.position.distanceTo(playerPos);
    expect(extendedDist).toBeGreaterThan(closeDist + 3.0);
  });

  it("does not pull camera in or bounce when climbing an inclined ramp (normal.y > 0.40)", () => {
    const cam = new Camera();
    const playerPos = new THREE.Vector3(0, 1.5, 0);
    const playerVel = new THREE.Vector3(0, 1.0, -3.0);

    cam.snapTo(playerPos);

    // Create an inclined ramp underneath and behind the player
    // Ramp inclined by 20 degrees (-0.35 rad) along X axis
    const rampGeo = new THREE.BoxGeometry(8, 0.6, 20);
    const rampMat = new THREE.MeshBasicMaterial();
    const rampMesh = new THREE.Mesh(rampGeo, rampMat);
    rampMesh.rotation.x = -0.35;
    rampMesh.position.set(0, 1.0, 2.0);
    rampMesh.updateMatrixWorld(true);

    const collidableMeshes = [rampMesh];

    for (let i = 0; i < 30; i++) {
      playerPos.y += 0.04;
      playerPos.z -= 0.1;
      cam.follow(playerPos, playerVel, 0.016, collidableMeshes);
    }

    // Camera must NOT collapse or jump closer to the player due to the ramp surface
    const distToPlayer = cam.object.position.distanceTo(playerPos);
    expect(distToPlayer).toBeGreaterThan(5.8);
  });

  it("maintains panoramic framing in cinematic tram mode and never collapses inside tram cabin", () => {
    const cam = new Camera();
    const playerPos = new THREE.Vector3(0, 1.6, 12.0);
    const playerVel = new THREE.Vector3(0, 0, -3.5);

    // Activate Tranvia mode
    cam.setCinematicTramMode("tranvia1");
    expect(cam.getCinematicTramMode()).toBe("tranvia1");

    cam.snapTo(playerPos);
    const initialDist = cam.object.position.distanceTo(playerPos);
    expect(initialDist).toBeGreaterThan(11.0);

    // Place tram cabin walls all around the player (left, right, roof, back)
    const tramWallGeo = new THREE.BoxGeometry(4, 3, 0.4);
    const tramWallMesh = new THREE.Mesh(tramWallGeo, new THREE.MeshBasicMaterial());
    tramWallMesh.position.set(0, 2.5, 13.5); // Directly behind player!
    tramWallMesh.updateMatrixWorld(true);

    for (let i = 0; i < 30; i++) {
      cam.follow(playerPos, playerVel, 0.016, [tramWallMesh]);
    }

    // Must remain at cinematic distance (> 10.0m) and never pull into character!
    const postDist = cam.object.position.distanceTo(playerPos);
    expect(postDist).toBeGreaterThan(10.0);

    // Test Tranvia2
    cam.setCinematicTramMode("tranvia2");
    expect(cam.getCinematicTramMode()).toBe("tranvia2");
    cam.snapTo(playerPos);
    expect(cam.object.position.distanceTo(playerPos)).toBeGreaterThan(11.0);
    // Camera is positioned horizontally on the right (+X) looking across to the sea on the left (-X)
    expect(cam.object.position.x).toBeGreaterThan(playerPos.x + 10.0);
  });

  it("smoothly dampens vertical micro-steps on ramps without sudden jerks", () => {
    const cam = new Camera();
    const playerPos = new THREE.Vector3(0, 0, 0);
    const playerVel = new THREE.Vector3(0, 0.8, -2.5);

    cam.snapTo(playerPos);

    const yPositions: number[] = [];
    // Simulate player climbing a ramp with physics normal step noise
    for (let i = 0; i < 40; i++) {
      const noise = (i % 2 === 0 ? 0.02 : -0.01);
      playerPos.y += 0.05 + noise;
      playerPos.z -= 0.12;
      cam.follow(playerPos, playerVel, 0.016, []);
      yPositions.push(cam.object.position.y);
    }

    // Camera height should ascend continuously without sudden downward snap or jitter
    for (let i = 5; i < yPositions.length - 1; i++) {
      const step = yPositions[i + 1] - yPositions[i];
      // Step delta must be non-negative and smooth (no negative drop bounces)
      expect(step).toBeGreaterThanOrEqual(-0.001);
      expect(step).toBeLessThan(0.15); // No violent snap leaps
    }
  });
});

describe("Collectible Persistence on Life Loss", () => {
  it("preserves collectibles count and 1UP progress when life is lost", () => {
    const state = new GameState();
    expect(state.lives).toBe(5);
    expect(state.collectibles).toBe(0);
    expect(state.levelRunCollectibles).toBe(0);

    // Collect 4 items
    state.addCollectible();
    state.addCollectible();
    state.addCollectible();
    state.addCollectible();

    expect(state.collectibles).toBe(4);
    expect(state.stageCollectibles).toBe(4);
    expect(state.levelRunCollectibles).toBe(4);

    // Player falls or burns in lava: lose a life
    const isGameOver = state.loseLife();
    expect(isGameOver).toBe(false);
    expect(state.lives).toBe(4);

    // Collectibles MUST NOT be removed or reset
    expect(state.collectibles).toBe(4);
    expect(state.stageCollectibles).toBe(4);
    expect(state.levelRunCollectibles).toBe(4);

    // Continue and collect 6 more items -> trigger 1UP (10 items)
    for (let i = 0; i < 6; i++) {
      state.addCollectible();
    }
    expect(state.lives).toBe(5); // Restored life from 1UP!
    expect(state.levelRunCollectibles).toBe(10);
  });

  it("resets run statistics completely when starting level at stage 1 or on game over", () => {
    const state = new GameState();
    state.lives = 2;
    state.collectibles = 6;
    state.stageCollectibles = 4;
    state.levelRunCollectibles = 18;
    state.levelRunTime = 85.2;
    state.runStageTimes = [0, 20.1, 22.4, 21.3];
    state.runStageCollectibles = [0, 5, 6, 7];

    state.resetLevelRun();

    expect(state.lives).toBe(5);
    expect(state.collectibles).toBe(0);
    expect(state.stageCollectibles).toBe(0);
    expect(state.levelRunCollectibles).toBe(0);
    expect(state.levelRunTime).toBe(0);
    expect(state.runStageTimes.length).toBe(0);
    expect(state.runStageCollectibles.length).toBe(0);
  });
});

describe("Level Statistics Registration", () => {
  it("does not report completed level stats for uncompleted levels", () => {
    const progression = new ProgressionManager();

    // Level 1-1 has not been cleared
    const record = progression.getLevelRecord(1, 1);
    expect(record.completed).toBe(false);
    expect(record.bestTime).toBeNull();
    expect(record.totalCollectibles).toBe(0);
  });

  it("records level statistics only when all 10 stages are completed and level is finished", () => {
    const progression = new ProgressionManager();

    // Complete all 10 stages and record level completion
    for (let s = 1; s <= 10; s++) {
      progression.completeStage(1, 1, s, 10.0, 3);
    }
    progression.recordLevelCompletion(1, 1, 100.0, 30, "rony");

    const record = progression.getLevelRecord(1, 1);
    expect(record.completed).toBe(true);
    expect(record.bestTime).toBe(100.0);
    expect(record.totalCollectibles).toBe(30);
    expect(record.completedCharacters).toContain("rony");
  });
});
