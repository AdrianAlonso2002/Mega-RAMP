export type CloudDirection = "forward" | "back";
/** Two cached vector layers, animated only during navigation. No canvas or frame loop. */
export class CloudTransition {
  private readonly overlay: HTMLElement;
  private readonly wings: HTMLElement[];
  private animations: Animation[] = [];
  private disposed = false;
  private busy = false;
  private controller?: AbortController;
  constructor(container: HTMLElement) {
    this.overlay =
      document.getElementById("startup-clouds") ??
      document.createElement("div");
    this.overlay.id = "startup-clouds";
    this.overlay.className = "cloud-transition";
    this.overlay.setAttribute("aria-hidden", "true");
    this.overlay.innerHTML =
      '<span class="cloud-transition-wing"></span><span class="cloud-transition-wing"></span>';
    if (!this.overlay.isConnected) container.appendChild(this.overlay);
    this.wings = Array.from(this.overlay.children) as HTMLElement[];
  }
  get active() {
    return this.busy;
  }
  private async move(from: number[], to: number[], signal: AbortSignal) {
    if (signal.aborted) return;
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const duration=reduce?100:620;
    const animations = this.wings
      .map((wing, i) => {
        if(!reduce)wing.style.opacity='1';
        // Reduced motion changes visibility without a sweeping full-screen movement.
        const frames = reduce
          ? [
              { opacity: from[i] === 0 ? 1 : 0 },
              { opacity: to[i] === 0 ? 1 : 0 },
            ]
          : [
              { transform: `translateX(${from[i]}vw)` },
              { transform: `translateX(${to[i]}vw)` },
            ];
        if (!wing.animate) {
          wing.style.transform = `translateX(${to[i]}vw)`;
          wing.style.opacity=reduce?(to[i]===0?'1':'0'):'1';
          return undefined;
        }
        try{return wing.animate(frames, {
          duration,
          easing: "cubic-bezier(.45,0,.2,1)",
          fill: "forwards",
        });}catch{
          wing.style.transform=`translateX(${to[i]}vw)`;
          wing.style.opacity=to[i]===0?'1':'0';
          return undefined;
        }
      })
      .filter((a): a is Animation => Boolean(a));
    const previous = this.animations;
    this.animations = animations;
    previous.forEach((a) => a.cancel());
    // Some standalone WebKit windows fail to settle Animation.finished after suspension.
    // Bound only the animation; asset preparation below must still finish before revealing.
    await Promise.all(animations.map((animation)=>new Promise<void>(resolve=>{
      const finish=()=>{clearTimeout(timer);signal.removeEventListener('abort',finish);resolve();};
      const timer=setTimeout(finish,duration+250);
      signal.addEventListener('abort',finish,{once:true});
      if(animation.finished?.then)void animation.finished.then(finish,finish);
    })));
    if(!signal.aborted)this.wings.forEach((wing,i)=>{
      wing.style.transform=`translateX(${to[i]}vw)`;
      wing.style.opacity=reduce?(to[i]===0?'1':'0'):'1';
    });
  }
  async run(
    direction: CloudDirection,
    prepare: (signal: AbortSignal) => Promise<void>,
    initial = false,
  ): Promise<void> {
    if (this.busy || this.disposed) return;
    this.busy = true;
    this.controller = new AbortController();
    const signal = this.controller.signal;
    this.overlay.hidden = false;
    const sign = direction === "forward" ? 1 : -1;
    try {
      if (!initial) await this.move([-145 * sign, -145 * sign], [0, 0], signal);
      if (signal.aborted) return;
      let abort: () => void = () => {};
      const cancelled = new Promise<void>((resolve) => {
        abort = resolve;
        signal.addEventListener("abort", abort, { once: true });
      });
      try {
        await Promise.race([prepare(signal), cancelled]);
      } finally {
        signal.removeEventListener("abort", abort);
      }
      if (signal.aborted) return;
      // The inline background covers the very first HTML paint, before SVG decoding.
      this.overlay.style.background = "none";
      await this.move(
        [0, 0],
        initial ? [-145, 145] : [145 * sign, 145 * sign],
        signal,
      );
    } finally {
      this.animations.forEach((a) => a.cancel());
      this.animations = [];
      this.overlay.hidden = true;
      this.busy = false;
      this.controller = undefined;
    }
  }
  destroy() {
    this.disposed = true;
    this.controller?.abort();
    this.animations.forEach((a) => a.cancel());
    this.overlay.remove();
  }
}
