export interface InputAxis {
  horizontal: number;
  vertical: number;
  bothPaddles?: boolean;
  action?: boolean;
  anyKey?: boolean;
}

export class InputManager {
  private readonly keys = new Set<string>();
  private pendingKeyPress = false;
  private frameKeyPress = false;

  private axis: InputAxis = {
    horizontal: 0,
    vertical: 0,
  };

  constructor() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.reset);
    if (typeof document !== "undefined")
      document.addEventListener?.("visibilitychange", this.onVisibility);
  }
  readonly reset = (): void => {
    this.keys.clear();
    this.pendingKeyPress = false;
    this.frameKeyPress = false;
    this.axis.horizontal = 0;
    this.axis.vertical = 0;
    this.axis.bothPaddles = false;
  };
  private readonly onVisibility = (): void => {
    if (document.hidden) this.reset();
  };

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    this.keys.add(event.code);
    this.pendingKeyPress = true;
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.code);
  };

  update(): void {
    this.frameKeyPress = this.pendingKeyPress;
    this.pendingKeyPress = false;
    let horizontal = 0;
    let vertical = 0;

    if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) {
      horizontal -= 1;
    }

    if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) {
      horizontal += 1;
    }

    if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) {
      vertical += 1;
    }

    if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) {
      vertical -= 1;
    }

    this.axis.horizontal = horizontal;
    this.axis.vertical = vertical;
    this.axis.bothPaddles =
      (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) &&
      (this.keys.has("KeyD") || this.keys.has("ArrowRight"));
  }

  getAxis(): InputAxis {
    return this.axis;
  }

  isPressed(code: string): boolean {
    return this.keys.has(code);
  }

  isAnyKeyPressed(): boolean {
    return this.keys.size > 0 || this.frameKeyPress;
  }

  isMovementKeyPressed(): boolean {
    return (
      this.keys.has("KeyW") ||
      this.keys.has("KeyA") ||
      this.keys.has("KeyS") ||
      this.keys.has("KeyD") ||
      this.keys.has("ArrowUp") ||
      this.keys.has("ArrowDown") ||
      this.keys.has("ArrowLeft") ||
      this.keys.has("ArrowRight") ||
      this.keys.has("Space") ||
      this.keys.has("Enter")
    );
  }

  destroy(): void {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.reset);
    if (typeof document !== "undefined")
      document.removeEventListener?.("visibilitychange", this.onVisibility);
    this.keys.clear();
    this.pendingKeyPress = false;
    this.frameKeyPress = false;
  }
}
