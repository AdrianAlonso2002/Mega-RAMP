export class TouchControls {
  private readonly root: HTMLElement;
  private readonly stickEl: HTMLElement;
  private readonly knobEl: HTMLElement;

  private activePointerId: number | null = null;
  private startX = 0;
  private startY = 0;
  private horizontal = 0;
  private vertical = 0;
  private isVisible = false;

  private readonly maxRadius = 55;

  private boundPointerDown: (e: PointerEvent) => void;
  private boundPointerMove: (e: PointerEvent) => void;
  private boundPointerUp: (e: PointerEvent) => void;

  constructor(container: HTMLElement) {
    this.root = document.createElement("div");
    this.root.className = "floating-touch-zone";

    this.root.innerHTML = `
      <div class="dynamic-joystick" style="display: none;">
        <div class="dynamic-joystick-ring"></div>
        <div class="dynamic-joystick-knob"></div>
      </div>
    `;

    container.appendChild(this.root);

    this.stickEl = this.root.querySelector<HTMLElement>(".dynamic-joystick")!;
    this.knobEl = this.root.querySelector<HTMLElement>(
      ".dynamic-joystick-knob",
    )!;

    this.boundPointerDown = this.onPointerDown.bind(this);
    this.boundPointerMove = this.onPointerMove.bind(this);
    this.boundPointerUp = this.onPointerUp.bind(this);

    this.initialize();
  }

  private initialize(): void {
    this.root.addEventListener("pointerdown", this.boundPointerDown);
    window.addEventListener("pointermove", this.boundPointerMove);
    window.addEventListener("pointerup", this.boundPointerUp);
    window.addEventListener("pointercancel", this.boundPointerUp);
    window.addEventListener("blur", this.reset);
  }

  private onPointerDown(e: PointerEvent): void {
    if (!this.isVisible) return;
    if (this.activePointerId !== null) return;

    // Ignore touches on UI buttons, HUD controls, modals, or the top-right button zone
    const target = e.target as HTMLElement;
    const isTopRightButtonZone =
      e.clientY < 80 && e.clientX > window.innerWidth - 180;
    if (
      target.closest("button") ||
      target.closest(".hud-actions") ||
      target.closest(".modal-card") ||
      target.closest(".btn-hud") ||
      isTopRightButtonZone
    ) {
      return;
    }

    this.activePointerId = e.pointerId;
    try {
      this.root.setPointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    this.startX = e.clientX;
    this.startY = e.clientY;

    // Spawn floating joystick centered exactly where clicked/touched
    this.stickEl.style.left = `${this.startX}px`;
    this.stickEl.style.top = `${this.startY}px`;
    this.stickEl.style.display = "block";
    this.stickEl.classList.add("joystick-active");

    // Progressive start: Start with gentle initial roll (not an electric car burst!)
    this.vertical = 0;
    this.horizontal = 0;
    this.knobEl.style.transform = "translate(0px, -12px)";
  }

  private onPointerMove(e: PointerEvent): void {
    if (this.activePointerId !== e.pointerId) return;

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    const dist = Math.hypot(dx, dy);

    if (dist < 6) {
      this.horizontal = 0;
      this.vertical = 0;
      this.knobEl.style.transform = "translate(0px,0px)";
      return;
    }
    let clampedX = dx;
    let clampedY = dy;

    if (dist > this.maxRadius) {
      clampedX = (dx / dist) * this.maxRadius;
      clampedY = (dy / dist) * this.maxRadius;
    }

    this.knobEl.style.transform = `translate(${clampedX}px, ${clampedY}px)`;

    const normX = clampedX / this.maxRadius;
    const normY = clampedY / this.maxRadius; // positive = downward pull, negative = upward push

    const dead = 0.1;
    const axis = (n: number) =>
      Math.abs(n) <= dead
        ? 0
        : (Math.sign(n) * (Math.abs(n) - dead)) / (1 - dead);
    this.horizontal = axis(normX);
    this.vertical = axis(-normY);
  }
  private onPointerUp(e: PointerEvent): void {
    if (this.activePointerId === e.pointerId) {
      try {
        if (this.root.hasPointerCapture(e.pointerId)) {
          this.root.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignored
      }
      this.activePointerId = null;
      this.horizontal = 0;
      this.vertical = 0;
      this.stickEl.style.display = "none";
      this.stickEl.classList.remove("joystick-active");
    }
  }

  setVisible(visible: boolean): void {
    this.isVisible = visible;
    this.root.style.display = visible ? "block" : "none";
    if (!visible) {
      this.reset();
      this.activePointerId = null;
      this.horizontal = 0;
      this.vertical = 0;
      this.stickEl.style.display = "none";
    }
  }
  readonly reset = (): void => {
    if (this.activePointerId !== null) {
      try {
        this.root.releasePointerCapture(this.activePointerId);
      } catch {
        /* Pointer may already have been cancelled. */
      }
    }
    this.activePointerId = null;
    this.horizontal = 0;
    this.vertical = 0;
    this.stickEl.style.display = "none";
    this.stickEl.classList.remove("joystick-active");
  };

  isPressed(): boolean {
    return this.activePointerId !== null;
  }

  getAxis(): { horizontal: number; vertical: number } {
    return {
      horizontal: this.horizontal,
      vertical: this.vertical,
    };
  }

  destroy(): void {
    this.root.removeEventListener("pointerdown", this.boundPointerDown);
    window.removeEventListener("pointermove", this.boundPointerMove);
    window.removeEventListener("pointerup", this.boundPointerUp);
    window.removeEventListener("pointercancel", this.boundPointerUp);
    window.removeEventListener("blur", this.reset);
    this.root.remove();
  }
}
