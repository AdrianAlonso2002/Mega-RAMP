import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CloudTransition } from "../src/ui/CloudTransition";
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
function setup(reduce = false) {
  const frames: Keyframe[][] = [];
  const wings = Array.from({ length: 2 }, () => ({
    style: { transform: "" },
    animate: vi.fn((f: Keyframe[], options: { duration: number }) => {
      frames.push(f);
      let finish: () => void = () => {};
      const finished = new Promise<void>((resolve) => {
        finish = resolve;
      });
      const timer = setTimeout(finish, options.duration);
      return {
        finished,
        cancel: vi.fn(() => {
          clearTimeout(timer);
          finish();
        }),
      };
    }),
  }));
  const overlay = {
    id: "startup-clouds",
    className: "",
    innerHTML: "",
    style: { background: "#eaf8fc" },
    children: wings,
    isConnected: true,
    hidden: false,
    setAttribute: vi.fn(),
    remove: vi.fn(),
  };
  vi.stubGlobal("document", { getElementById: () => overlay });
  vi.stubGlobal("window", { matchMedia: () => ({ matches: reduce }) });
  const appendChild = vi.fn(),
    clouds = new CloudTransition({ appendChild } as unknown as HTMLElement);
  return { clouds, overlay, wings, frames, appendChild };
}
describe("Cloud curtain navigation", () => {
  it("covers the old screen before preparing the next and holds opaque clouds until readiness", async () => {
    const f = setup();
    let ready: () => void = () => {};
    const prepare = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          ready = resolve;
        }),
    );
    const pending = f.clouds.run("forward", prepare);
    expect(f.frames[0]).toEqual([
      { transform: "translateX(-145vw)" },
      { transform: "translateX(0vw)" },
    ]);
    await vi.advanceTimersByTimeAsync(619);
    expect(prepare).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(prepare).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(6000);
    expect(f.overlay.hidden).toBe(false);
    expect(f.clouds.active).toBe(true);
    expect(f.frames).toHaveLength(2);
    ready();
    await vi.advanceTimersByTimeAsync(0);
    expect(f.frames[2]).toEqual([
      { transform: "translateX(0vw)" },
      { transform: "translateX(145vw)" },
    ]);
    await vi.advanceTimersByTimeAsync(620);
    await pending;
    expect(f.overlay.hidden).toBe(true);
    expect(f.clouds.active).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
  it("reuses the initial HTML cover and opens to both edges only after the first screen is ready", async () => {
    const f = setup();
    let ready: () => void = () => {};
    const pending = f.clouds.run(
      "forward",
      () =>
        new Promise<void>((resolve) => {
          ready = resolve;
        }),
      true,
    );
    expect(f.appendChild).not.toHaveBeenCalled();
    expect(f.frames).toHaveLength(0);
    expect(f.overlay.hidden).toBe(false);
    ready();
    await vi.advanceTimersByTimeAsync(0);
    expect(f.frames.map((frames) => frames[1].transform)).toEqual([
      "translateX(-145vw)",
      "translateX(145vw)",
    ]);
    await vi.advanceTimersByTimeAsync(620);
    await pending;
    expect(f.overlay.style.background).toBe("none");
    expect(f.overlay.hidden).toBe(true);
  });
  it("reverses direction on return, ignores repeated clicks, and cancels completed animation effects", async () => {
    const f = setup(),
      prepare = vi.fn(async () => {});
    const pending = f.clouds.run("back", prepare);
    await f.clouds.run("forward", prepare);
    await vi.advanceTimersByTimeAsync(1240);
    await pending;
    expect(prepare).toHaveBeenCalledOnce();
    expect(f.frames[0][0].transform).toBe("translateX(145vw)");
    expect(f.frames[2][1].transform).toBe("translateX(-145vw)");
    for (const wing of f.wings)
      for (const call of wing.animate.mock.results)
        expect(call.value.cancel).toHaveBeenCalledOnce();
  });
  it("uses a short fade for reduced motion and cleans up on destruction while assets are still loading", async () => {
    const f = setup(true),
      pending = f.clouds.run("forward", () => new Promise<void>(() => {}));
    expect(f.frames[0]).toEqual([{ opacity: 0 }, { opacity: 1 }]);
    await vi.advanceTimersByTimeAsync(100);
    f.clouds.destroy();
    await pending;
    expect(f.overlay.remove).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
    expect(f.clouds.active).toBe(false);
  });
});
