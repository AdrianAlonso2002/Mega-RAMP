import * as THREE from "three";
import {
  GRAPHICS_PROFILES,
  graphicsPixelRatio,
  type GraphicsQuality,
} from "./GraphicsQuality";
import { SceneQuality } from "./SceneQuality";

export class Renderer {
  readonly object: THREE.WebGLRenderer;

  private resolutionScale = 1;
  getResolutionScale(): number {
    return this.resolutionScale;
  }
  setResolutionScale(value: number): void {
    const next = THREE.MathUtils.clamp(value, 0.55, 1);
    if (Math.abs(next - this.resolutionScale) < 0.001) return;
    this.resolutionScale = next;
    this.resize();
  }
  private width = 1;
  private height = 1;
  private camera?: THREE.PerspectiveCamera;
  private readonly visuals: SceneQuality;
  private readonly shadowFocus = new THREE.Vector3();
  private readonly shadowDirection = new THREE.Vector3();

  constructor(private readonly container: HTMLElement) {
    this.object = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      stencil: true,
      powerPreference: "high-performance",
    });

    this.object.outputColorSpace = THREE.SRGBColorSpace;
    this.object.toneMapping = THREE.NoToneMapping;
    this.object.shadowMap.enabled = false;
    this.object.shadowMap.type = THREE.PCFSoftShadowMap;
    this.visuals = new SceneQuality(
      this.object.capabilities.getMaxAnisotropy(),
    );

    this.container.appendChild(this.object.domElement);

    this.resize();

    window.addEventListener("resize", this.resize, {
      passive: true,
    });
  }

  private quality: GraphicsQuality = "medium";

  setQuality(quality: "low" | "medium" | "high"): void {
    this.quality = quality;
    this.visuals.setQuality(quality);
    this.object.shadowMap.enabled = GRAPHICS_PROFILES[quality].shadows;
    this.object.toneMapping =
      quality === "low"
        ? THREE.ReinhardToneMapping
        : THREE.ACESFilmicToneMapping;
    this.object.toneMappingExposure = 1.12;
    this.resize();
  }

  attachCamera(camera: THREE.Camera): void {
    this.object.setViewport(0, 0, this.width, this.height);

    if (camera instanceof THREE.PerspectiveCamera) {
      this.camera = camera;
      camera.aspect = this.width / this.height;
      camera.updateProjectionMatrix();
    }
  }

  private readonly resize = (): void => {
    const rect = this.container.getBoundingClientRect();

    this.width = Math.max(1, Math.floor(rect.width));
    this.height = Math.max(1, Math.floor(rect.height));

    const targetPR = graphicsPixelRatio(this.width, this.height, this.quality);

    this.object.setPixelRatio(targetPR * this.resolutionScale);
    this.object.setSize(this.width, this.height, false);
    if (this.camera) {
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
    }
  };

  async prepareScene(scene:THREE.Scene,camera:THREE.Camera):Promise<void>{
    this.visuals.prepare(scene);
    await this.object.compileAsync(scene,camera);
  }

  render(scene: THREE.Scene, camera: THREE.Camera): void {
    this.visuals.prepare(scene);
    const art = scene.userData.artDirection as
      { exposure: number; sunOffset: [number, number, number] } | undefined;
    this.object.toneMappingExposure = scene.userData.artDark
      ? 1.12
      : (art?.exposure ?? 1.08);
    const sun = scene.children.find(
      (child) =>
        child instanceof THREE.DirectionalLight &&
        child.userData.graphicsSun === true,
    ) as THREE.DirectionalLight | undefined;
    if (sun) {
      sun.castShadow =
        GRAPHICS_PROFILES[this.quality].shadows && sun.intensity > 0;
      if (sun.castShadow) {
        const size = GRAPHICS_PROFILES.high.shadowSize;
        if (sun.shadow.mapSize.x !== size) {
          sun.shadow.map?.dispose();
          sun.shadow.map = null;
          sun.shadow.mapSize.set(size, size);
        }
        const shadowCamera = sun.shadow.camera;
        shadowCamera.left = -36;
        shadowCamera.right = 36;
        shadowCamera.top = 36;
        shadowCamera.bottom = -36;
        shadowCamera.near = 1;
        shadowCamera.far = 150;
        shadowCamera.updateProjectionMatrix();
        sun.shadow.normalBias = 0.035;
        sun.shadow.bias = -0.00012;
        sun.shadow.radius = 2;
        camera.getWorldDirection(this.shadowDirection);
        this.shadowFocus
          .copy(camera.position)
          .addScaledVector(this.shadowDirection, 12);
        const texel = 72 / size;
        this.shadowFocus.x = Math.round(this.shadowFocus.x / texel) * texel;
        this.shadowFocus.z = Math.round(this.shadowFocus.z / texel) * texel;
        sun.position
          .copy(this.shadowFocus)
          .add(this.shadowDirection.set(...(art?.sunOffset ?? [20, 35, 15])));
        sun.target.position.copy(this.shadowFocus);
        if (sun.target.parent !== scene) scene.add(sun.target);
        sun.target.updateMatrixWorld();
      }
    }
    this.object.render(scene, camera);
  }

  destroy(): void {
    this.visuals.dispose();
    window.removeEventListener("resize", this.resize);

    this.object.dispose();
    this.object.domElement.remove();
  }

  getPixelRatio(): number {
    return this.object.getPixelRatio();
  }
}
