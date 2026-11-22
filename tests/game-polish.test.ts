import { afterEach, describe, it, expect, vi } from "vitest";
import { PerformanceManager } from "../src/core/PerformanceManager";
import type { Renderer } from "../src/rendering/Renderer";
import { InputManager } from "../src/input/InputManager";
import { readProgressBackup } from "../src/progression/ProgressBackup";
import { ProgressionManager } from "../src/progression/ProgressionManager";
import { levelSound } from "../src/audio/LevelSound";
import { Camera } from "../src/rendering/Camera";
import * as THREE from "three";
vi.mock("../src/physics/PhysicsWorld", () => ({ PhysicsWorld: class {} }));
vi.mock("../src/game/SceneManager", () => ({ SceneManager: class {} }));
afterEach(() => vi.unstubAllGlobals());
function performanceFixture() {
  let scale = 1;
  const renderer = {
    getResolutionScale: () => scale,
    setResolutionScale: (n: number) => {
      scale = Math.max(0.55, Math.min(1, n));
    },
  };
  return {
    manager: new PerformanceManager(renderer as unknown as Renderer),
    scale: () => scale,
  };
}
function tick(m: PerformanceManager, fps: number, seconds: number, cap = "60") {
  for (let i = 0; i < fps * seconds; i++) m.update(1 / fps, cap);
}
describe("Stable performance and background controls", () => {
  it("respects intentional 30 FPS and recovers gradually after sustained pressure", () => {
    const f = performanceFixture();
    tick(f.manager, 30, 15, "30");
    expect(f.scale()).toBe(1);
    tick(f.manager, 18, 6, "30");
    const reduced = f.scale();
    expect(reduced).toBeLessThan(1);
    tick(f.manager, 30, 4, "30");
    expect(f.scale()).toBe(reduced);
    tick(f.manager, 30, 24, "30");
    expect(f.scale()).toBeGreaterThan(reduced);
    expect(f.scale()).toBeLessThanOrEqual(1);
  });
  it("ignores loading or menu frame samples", () => {
    const f = performanceFixture();
    for (let i = 0; i < 100; i++) f.manager.update(0.1, "60", false);
    expect(f.scale()).toBe(1);
  });
  it("clears keyboard state after losing focus or hiding the tab", () => {
    const window = new EventTarget(),
      document = Object.assign(new EventTarget(), { hidden: false });
    vi.stubGlobal("window", window);
    vi.stubGlobal("document", document);
    const input = new InputManager();
    const event = new Event("keydown");
    Object.defineProperty(event, "code", { value: "KeyW" });
    window.dispatchEvent(event);
    input.update();
    expect(input.getAxis().vertical).toBe(1);
    window.dispatchEvent(new Event("blur"));
    expect(input.getAxis().vertical).toBe(0);
    window.dispatchEvent(event);
    document.hidden = true;
    document.dispatchEvent(new Event("visibilitychange"));
    input.update();
    expect(input.isAnyKeyPressed()).toBe(false);
    input.destroy();
  });
  it("keeps the camera below a thin double-sided roof whose top normal points upward", () => {
    const c = new Camera(),
      target = new THREE.Vector3(0, 0, 0),
      roof = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
      );
    roof.rotation.x = -Math.PI / 2;
    roof.position.y = 2;
    roof.updateMatrixWorld(true);
    c.snapTo(target);
    for (let i = 0; i < 90; i++)
      c.follow(target, new THREE.Vector3(), 1 / 60, [roof]);
    expect(c.object.position.y).toBeLessThan(2);
  });
});
function storage() {
  const data = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value),
  });
  return data;
}
describe("Validated progress backups", () => {
  it("round trips characters, unique prizes and records without stage data", () => {
    storage();
    const p = new ProgressionManager();
    p.completeStage(1, 1, 1, 12, 8);
    p.recordLevelCompletion(1, 1, 125, 50, "rony");
    const file = p.exportBackup(),
      other = new ProgressionManager();
    other.importBackup(file);
    expect(other.getStage(1, 1, 1)?.bestTime).toBe(12);
    expect(other.getSummary().completed).toBe(1);
    expect(other.getLevelRecord(1, 1).bestTime).toBe(125);
  });
  it("rejects corrupt values, future formats and unsafe object keys before replacing progress", () => {
    const data = storage(),
      p = new ProgressionManager();
    p.completeStage(1, 1, 1, 12, 8);
    const before = p.exportBackup();
    for (const text of [
      "{}",
      '{"format":"mega-ramp-progress","version":9}',
      '{"selectedCharacter":"rony","worlds":{"__proto__":{}}}',
    ])
      expect(() => p.importBackup(text)).toThrow();
    expect(p.getStage(1, 1, 1)?.completed).toBe(true);
    expect(readProgressBackup(before).selectedCharacter).toBe("rony");
    expect(data.get("monkey-ball-progress-v1")).toContain("12");
  });
  it("keeps the current session when persisting an imported backup fails", () => {
    storage();
    const p = new ProgressionManager(),
      file = p.exportBackup();
    p.completeStage(1, 1, 1, 12, 8);
    vi.stubGlobal("localStorage", {
      setItem: () => {
        throw new Error("full");
      },
    });
    expect(() => p.importBackup(file)).toThrow();
    expect(p.getStage(1, 1, 1)?.completed).toBe(true);
  });
  it("notifies save failure and preserves a damaged original before writing fresh progress", () => {
    const data = storage();
    data.set("monkey-ball-progress-v1", "broken");
    const window = new EventTarget(),
      notice = vi.fn();
    window.addEventListener("mega-ramp-save-error", notice);
    vi.stubGlobal("window", window);
    const p = new ProgressionManager();
    expect(p.getStorageWarning()).not.toBe("");
    p.save();
    expect(data.get("monkey-ball-progress-v1-recovery")).toBe("broken");
    vi.stubGlobal("localStorage", {
      setItem: () => {
        throw new Error("full");
      },
    });
    p.save();
    expect(notice).toHaveBeenCalledOnce();
  });
});
it("provides 32 different finite loop arrangements with ambient profiles", () => {
  const signatures = new Set<string>();
  for (let w = 1; w <= 8; w++)
    for (let l = 1; l <= 4; l++) {
      const p = levelSound(w, l);
      signatures.add(JSON.stringify([p.bpm, p.melody, p.bass]));
      expect(p.melody).toHaveLength(32);
      expect([...p.melody, ...p.bass].every(Number.isFinite)).toBe(true);
    }
  expect(signatures.size).toBe(32);
});

import { TouchControls } from "../src/ui/TouchControls";
it("keeps touch centered and allows precise sideways motion without forward acceleration", () => {
  const window = new EventTarget();
  vi.stubGlobal("window", Object.assign(window, { innerWidth: 900 }));
  const listeners = new Map<string, (e: any) => void>(),
    knob = { style: {} },
    stick = { style: {}, classList: { add: () => {}, remove: () => {} } };
  const root = {
    className: "",
    innerHTML: "",
    style: {},
    querySelector: (s: string) => (s === ".dynamic-joystick" ? stick : knob),
    addEventListener: (n: string, f: any) => listeners.set(n, f),
    removeEventListener: () => {},
    setPointerCapture: () => {},
    releasePointerCapture: () => {},
    hasPointerCapture: () => true,
    remove: () => {},
  };
  vi.stubGlobal("document", { createElement: () => root });
  const controls = new TouchControls({
    appendChild: () => {},
  } as unknown as HTMLElement);
  controls.setVisible(true);
  listeners.get("pointerdown")!({
    pointerId: 1,
    clientX: 100,
    clientY: 200,
    target: { closest: () => null },
  });
  expect(controls.getAxis()).toEqual({ horizontal: 0, vertical: 0 });
  const move = new Event("pointermove");
  Object.assign(move, { pointerId: 1, clientX: 122, clientY: 200 });
  window.dispatchEvent(move);
  expect(controls.getAxis().horizontal).toBeGreaterThan(0.2);
  expect(controls.getAxis().horizontal).toBeLessThan(0.5);
  expect(controls.getAxis().vertical).toBe(0);
  window.dispatchEvent(new Event("blur"));
  expect(controls.getAxis()).toEqual({ horizontal: 0, vertical: 0 });
  expect(controls.isPressed()).toBe(false);
  controls.destroy();
});

it("opens the custom celebration after M8-N4-E10 instead of a browser alert", async () => {
  const { Game } = await import("../src/game/Game");
  const game = Object.create(Game.prototype) as any;
  const ui = { showScreen: vi.fn() },
    cleanup = vi.fn(),
    visible = vi.fn();
  Object.assign(game, {
    state: { selectedWorld: 8, selectedLevel: 4, selectedStage: 10 },
    scenes: { cleanupCurrentStage: cleanup },
    hud: { setVisible: visible },
    touchControls: { setVisible: visible },
    ui,
  });
  vi.stubGlobal("window", { addEventListener: () => {} });
  vi.stubGlobal("localStorage", { getItem: () => null });
  await game.nextStage();
  expect(ui.showScreen).toHaveBeenCalledWith("game-clear");
  expect(game.state.screen).toBe("game-clear");
  expect(cleanup).toHaveBeenCalledOnce();
});
