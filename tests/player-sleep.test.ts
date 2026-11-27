import {beforeAll,afterAll,it,expect,vi} from 'vitest';
import * as THREE from 'three';
import {PhysicsWorld} from '../src/physics/PhysicsWorld';
import {Player} from '../src/player/Player';
import {CHARACTERS} from '../src/player/Characters';
import {SpriteTextures} from '../src/rendering/SpriteTextures';
vi.mock("@dimforge/rapier3d-compat", async () => {
  const path = "../node_modules/@dimforge/rapier3d-compat/rapier.es.js";
  return import(path);
});
beforeAll(() => {
  vi.spyOn(SpriteTextures, "getCharacterTexture").mockReturnValue(
    new THREE.Texture(),
  );
  vi.spyOn(SpriteTextures, "getSphereTexture").mockReturnValue(
    new THREE.CanvasTexture({ width: 1, height: 1 } as HTMLCanvasElement),
  );
  const gradient = { addColorStop: () => {} },
    context = new Proxy(
      {},
      {
        get: (_t, k) =>
          k === "createLinearGradient" || k === "createRadialGradient"
            ? () => gradient
            : k === "measureText"
              ? () => ({ width: 100 })
              : () => {},
      },
    );
  vi.stubGlobal("document", {
    createElement: () => ({
      width: 128,
      height: 128,
      getContext: () => context,
    }),
  });
});
afterAll(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});


it('sleeps after ten stationary seconds, wakes on steering, and freezes in midair on timeout',async()=>{
 const physics=new PhysicsWorld();await physics.waitForReady();physics.createBoxCollider({x:0,y:-.5,z:0},{x:0,y:0,z:0,w:1},{x:20,y:.5,z:20});
 const player=new Player(CHARACTERS[0],physics,{x:0,y:.78,z:0}),camera=new THREE.PerspectiveCamera();
 try {
  const step=(seconds:number,h=0)=>{for(let i=0;i<seconds*60;i++){physics.step(1/60);player.update(1/60,{horizontal:h,vertical:0},camera);}};
  step(9);expect(player.isSleeping()).toBe(false);step(1.5);expect(player.isSleeping()).toBe(true);
  step(.1,1);expect(player.isSleeping()).toBe(false);
  player.teleportTo(3,12,0);player.setLinearVelocity({x:2,y:-7,z:0});player.showTimeout();
  const frozen=player.getPosition().clone();step(2,1);expect(player.getPosition().distanceTo(frozen)).toBe(0);expect(player.getBody()!.isEnabled()).toBe(false);
  player.respawn();expect(player.getBody()!.isEnabled()).toBe(true);expect(player.isSleeping()).toBe(false);
 } finally{player.destroy();physics.getWorld()?.free();}
});
