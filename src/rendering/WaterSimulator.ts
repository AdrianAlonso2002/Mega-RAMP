import * as THREE from "three";
import {ambientWaterWave} from "./WaterAppearance";

/**
 * High-performance 2D wave equation heightfield simulator for ultra-realistic water physics.
 * Employs an unconditionally stable 2-buffer discrete wave scheme with damping and
 * hard displacement bounding to guarantee zero divergence or erratic spikes.
 * Supports continuous cluster fusion, splash disturbance, and analytical normal calculation.
 */
export class WaterWaveSimulator {
  readonly width: number;
  readonly depth: number;
  readonly gridX: number;
  readonly gridZ: number;
  readonly dx: number;
  readonly dz: number;
  centerX: number;
  centerZ: number;

  // Double buffered height arrays for unconditional numerical stability
  private current: Float32Array;
  private previous: Float32Array;

  // Wave physics parameters
  damping: number = 0.985; // Wave energy retention per tick (0.985 = smooth natural dissipation)
  private timeAccumulator: number = 0;
  private readonly fixedDt: number = 1 / 60;
  private readonly ambientSlope = new THREE.Vector2();

  constructor(
    width: number,
    depth: number,
    maxResolution: number = 32,
    centerX: number = 0,
    centerZ: number = 0
  ) {
    this.width = Math.max(1, width);
    this.depth = Math.max(1, depth);
    this.centerX = centerX;
    this.centerZ = centerZ;

    // Calculate grid points based on physical dimensions, clamped for 60 FPS performance
    this.gridX = Math.min(maxResolution, Math.max(14, Math.round(this.width * 4.5)));
    this.gridZ = Math.min(maxResolution, Math.max(14, Math.round(this.depth * 4.5)));

    this.dx = this.width / (this.gridX - 1);
    this.dz = this.depth / (this.gridZ - 1);

    const totalPoints = this.gridX * this.gridZ;
    this.current = new Float32Array(totalPoints);
    this.previous = new Float32Array(totalPoints);
  }

  /**
   * Helper factory to create a matching Three.js PlaneGeometry oriented horizontally.
   */
  createSurfaceGeometry(): THREE.PlaneGeometry {
    const geo = new THREE.PlaneGeometry(
      this.width,
      this.depth,
      this.gridX - 1,
      this.gridZ - 1
    );
    geo.rotateX(-Math.PI / 2);
    return geo;
  }

  /**
   * Backward-compatible fused geometry helper.
   */
  createFusedSurfaceGeometry(
    boxes: Array<{ minX: number; maxX: number; minZ: number; maxZ: number }>,
    clusterCenterX: number,
    clusterCenterZ: number
  ): THREE.BufferGeometry {
    const { gridX, gridZ, width, depth, dx, dz } = this;
    const vertexCount = gridX * gridZ;

    const positions = new Float32Array(vertexCount * 3);
    const normals = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const indices: number[] = [];

    for (let j = 0; j < gridZ; j++) {
      const rowOffset = j * gridX;
      const lz = -depth / 2 + j * dz;
      const wz = clusterCenterZ + lz;

      for (let i = 0; i < gridX; i++) {
        const idx = rowOffset + i;
        const lx = -width / 2 + i * dx;
        const wx = clusterCenterX + lx;

        const vIdx = idx * 3;
        positions[vIdx] = lx;
        positions[vIdx + 1] = 0;
        positions[vIdx + 2] = lz;

        normals[vIdx] = 0;
        normals[vIdx + 1] = 1;
        normals[vIdx + 2] = 0;

        const uvIdx = idx * 2;
        uvs[uvIdx] = wx / 4.0;
        uvs[uvIdx + 1] = wz / 4.0;
      }
    }

    for (let j = 0; j < gridZ - 1; j++) {
      const cz = clusterCenterZ + (-depth / 2 + (j + 0.5) * dz);
      for (let i = 0; i < gridX - 1; i++) {
        const cx = clusterCenterX + (-width / 2 + (i + 0.5) * dx);

        const inWater = boxes.length === 0 || boxes.some(b =>
          cx >= b.minX - 0.05 && cx <= b.maxX + 0.05 &&
          cz >= b.minZ - 0.05 && cz <= b.maxZ + 0.05
        );

        if (inWater) {
          const a = j * gridX + i;
          const b = j * gridX + (i + 1);
          const c = (j + 1) * gridX + i;
          const d = (j + 1) * gridX + (i + 1);

          indices.push(a, c, b);
          indices.push(b, c, d);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    return geo;
  }

  /**
   * Applies an impulse disturbance at local water block coordinates.
   * Strictly bounded to guarantee physical stability without spikes.
   */
  disturb(localX: number, localZ: number, impulse: number, radius: number = 0.65): void {
    const gx = ((localX + this.width / 2) / this.width) * (this.gridX - 1);
    const gz = ((localZ + this.depth / 2) / this.depth) * (this.gridZ - 1);

    const radX = (radius / this.width) * (this.gridX - 1);
    const radZ = (radius / this.depth) * (this.gridZ - 1);
    const radMax = Math.max(1.5, Math.max(radX, radZ));

    const minI = Math.max(1, Math.floor(gx - radMax * 1.6));
    const maxI = Math.min(this.gridX - 2, Math.ceil(gx + radMax * 1.6));
    const minJ = Math.max(1, Math.floor(gz - radMax * 1.6));
    const maxJ = Math.min(this.gridZ - 2, Math.ceil(gz + radMax * 1.6));

    if (minI > maxI || minJ > maxJ) return;

    const sigmaSq = (radMax * 0.5) * (radMax * 0.5);

    for (let j = minJ; j <= maxJ; j++) {
      const dj = j - gz;
      const rowOffset = j * this.gridX;
      for (let i = minI; i <= maxI; i++) {
        const di = i - gx;
        const distSq = di * di + dj * dj;
        const weight = Math.exp(-distSq / (2 * sigmaSq));
        const idx = rowOffset + i;
        const val = this.current[idx] + impulse * weight;
        // Bounded clamp: allows generous 30cm waves, but completely prevents spikes
        this.current[idx] = Math.max(-0.30, Math.min(0.30, val));
      }
    }
  }

  /**
   * Helper to disturb using world coordinates.
   * Supports both 3-4 arguments (using stored centerX/centerZ) and 6 arguments (custom center).
   */
  disturbWorld(
    worldX: number,
    worldZ: number,
    arg3: number,
    arg4?: number,
    arg5?: number,
    arg6?: number
  ): void {
    if (typeof arg5 === "number") {
      // (worldX, worldZ, centerX, centerZ, impulse, radius)
      const localX = worldX - arg3;
      const localZ = worldZ - (arg4 ?? 0);
      this.disturb(localX, localZ, arg5, arg6 ?? 0.65);
    } else {
      // (worldX, worldZ, impulse, radius)
      const localX = worldX - this.centerX;
      const localZ = worldZ - this.centerZ;
      this.disturb(localX, localZ, arg3, arg4 ?? 0.65);
    }
  }

  /**
   * Samples the wave heightfield at arbitrary world coordinates using smooth bilinear interpolation.
   */
  sampleHeight(worldX: number, worldZ: number): number {
    const localX = worldX - this.centerX;
    const localZ = worldZ - this.centerZ;

    const gx = ((localX + this.width / 2) / this.width) * (this.gridX - 1);
    const gz = ((localZ + this.depth / 2) / this.depth) * (this.gridZ - 1);

    if (gx < 0 || gx > this.gridX - 1 || gz < 0 || gz > this.gridZ - 1) {
      return 0;
    }

    const i0 = Math.floor(gx);
    const j0 = Math.floor(gz);
    const i1 = Math.min(this.gridX - 1, i0 + 1);
    const j1 = Math.min(this.gridZ - 1, j0 + 1);

    const fx = gx - i0;
    const fz = gz - j0;

    const h00 = this.current[j0 * this.gridX + i0];
    const h10 = this.current[j0 * this.gridX + i1];
    const h01 = this.current[j1 * this.gridX + i0];
    const h11 = this.current[j1 * this.gridX + i1];

    const hTop = h00 * (1 - fx) + h10 * fx;
    const hBot = h01 * (1 - fx) + h11 * fx;

    return hTop * (1 - fz) + hBot * fz;
  }

  /** Read-only view for a GPU height texture; the simulation swaps this buffer each tick. */
  getHeightData():Float32Array {return this.current;}

  reset():void {this.current.fill(0);this.previous.fill(0);this.timeAccumulator=0;}

  /** Move a local simulation window along a long river without allocating or losing overlapping waves. */
  shiftCenterZ(center:number):void {
    const rows=Math.round((center-this.centerZ)/this.dz);
    if(!rows) return;
    if(Math.abs(rows)>=this.gridZ) {this.reset();this.centerZ=center;return;}
    const offset=Math.abs(rows)*this.gridX;
    for(const buffer of [this.current,this.previous]) {
      if(rows>0) {buffer.copyWithin(0,offset);buffer.fill(0,buffer.length-offset);}
      else {buffer.copyWithin(offset,0,buffer.length-offset);buffer.fill(0,0,offset);}
    }
    this.centerZ+=rows*this.dz;
  }

  /**
   * Computes normalized surface normal at arbitrary world coordinates for specular lighting.
   */
  sampleNormal(worldX: number, worldZ: number, out?: THREE.Vector3): THREE.Vector3 {
    const norm = out || new THREE.Vector3(0, 1, 0);
    const eps = Math.max(0.12, this.dx * 0.8);

    const hL = this.sampleHeight(worldX - eps, worldZ);
    const hR = this.sampleHeight(worldX + eps, worldZ);
    const hD = this.sampleHeight(worldX, worldZ - eps);
    const hU = this.sampleHeight(worldX, worldZ + eps);

    const nx = -(hR - hL) / (2 * eps);
    const nz = -(hU - hD) / (2 * eps);
    const ny = 1.0;
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;

    return norm.set(nx / len, ny / len, nz / len);
  }

  /**
   * Applies the simulated heightfield and computes smooth normal vectors directly into a block's surface mesh.
   * Mesh bounds are strictly preserved so water NEVER overhangs or exceeds block boundaries.
   */
  applyToMesh(
    mesh: THREE.Mesh,
    blockX: number,
    blockZ: number,
    animTime: number,
    computeNormals = true
  ): void {
    const posAttr = mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
    const normAttr = mesh.geometry.getAttribute("normal") as THREE.BufferAttribute;
    if (!posAttr) return;

    const posArray = posAttr.array as Float32Array;
    const count = posAttr.count;

    for (let k = 0; k < count; k++) {
      const k3 = k * 3;
      // In PlaneGeometry rotated -90 deg on X:
      // vertex local X is posArray[k3], vertex local Z is posArray[k3 + 2]
      const lx = posArray[k3];
      const lz = posArray[k3 + 2];
      const wx = blockX + lx;
      const wz = blockZ + lz;

      const waveH = this.sampleHeight(wx, wz);
      const ambient = ambientWaterWave(wx,wz,animTime,computeNormals ? this.ambientSlope:undefined);

      const height = .15*Math.tanh((waveH+ambient)/.15);
      posArray[k3 + 1] = height;

      if (computeNormals && normAttr) {
        const normArray = normAttr.array as Float32Array;
        const eps = Math.max(0.12, this.dx);
        const hL = this.sampleHeight(wx - eps, wz);
        const hR = this.sampleHeight(wx + eps, wz);
        const hD = this.sampleHeight(wx, wz - eps);
        const hU = this.sampleHeight(wx, wz + eps);

        const slopeScale = 1-(height/.15)**2;
        const nx = (-(hR - hL) / (2 * eps)-this.ambientSlope.x)*slopeScale;
        const nz = (-(hU - hD) / (2 * eps)-this.ambientSlope.y)*slopeScale;
        const ny = 1.0;
        const len = Math.sqrt(nx * nx + 1.0 + nz * nz) || 1;

        normArray[k3] = nx / len;
        normArray[k3 + 1] = ny / len;
        normArray[k3 + 2] = nz / len;
      }
    }

    posAttr.needsUpdate = true;
    if (computeNormals && normAttr) {
      normAttr.needsUpdate = true;
    }
  }

  /**
   * Steps the wave equation simulation forward in time.
   */
  step(delta: number): void {
    this.timeAccumulator += Math.min(delta, 0.05);

    // Fixed timestep update for rock-solid stability
    while (this.timeAccumulator >= this.fixedDt) {
      this.timeAccumulator -= this.fixedDt;
      this.stepFixed();
    }
  }

  private stepFixed(): void {
    const { gridX, gridZ, damping } = this;
    const curr = this.current;
    const prev = this.previous;

    // Unconditionally stable discrete wave propagation stencil:
    // H(t+1) = (H(x-1) + H(x+1) + H(z-1) + H(z+1)) * 0.5 - H(t-1)
    // Multiplied by damping < 1.0, guaranteed non-divergent under spectral radius theorem.
    for (let j = 1; j < gridZ - 1; j++) {
      const rowOffset = j * gridX;
      for (let i = 1; i < gridX - 1; i++) {
        const idx = rowOffset + i;
        const sum = curr[idx - 1] + curr[idx + 1] + curr[idx - gridX] + curr[idx + gridX];
        let nextH = (sum * 0.5 - prev[idx]) * damping;

        // Hard clamp displacement (max 30 cm) - keeps waves visible without runaway spikes
        if (nextH > 0.30) nextH = 0.30;
        else if (nextH < -0.30) nextH = -0.30;

        prev[idx] = nextH;
      }
    }

    // Ping-pong buffer swap: prev becomes next current heightfield
    this.previous = curr;
    this.current = prev;

    // Edge boundary absorption to prevent reflection standing waves
    for (let i = 0; i < gridX; i++) {
      this.current[i] *= 0.5;
      this.current[(gridZ - 1) * gridX + i] *= 0.5;
    }
    for (let j = 0; j < gridZ; j++) {
      this.current[j * gridX] *= 0.5;
      this.current[j * gridX + gridX - 1] *= 0.5;
    }
  }

  /**
   * Applies the simulated heightfield and computes smooth normal vectors directly into Three.js BufferGeometry.
   */
  applyToGeometry(geometry: THREE.BufferGeometry, ambientTime: number): void {
    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const normAttr = geometry.getAttribute("normal") as THREE.BufferAttribute;
    if (!posAttr || !normAttr) return;

    const posArray = posAttr.array as Float32Array;
    const normArray = normAttr.array as Float32Array;

    const { gridX, gridZ, dx, dz, current } = this;

    for (let j = 0; j < gridZ; j++) {
      const rowOffset = j * gridX;
      const zRatio = j / (gridZ - 1);
      const lz = (zRatio - 0.5) * this.depth;

      for (let i = 0; i < gridX; i++) {
        const idx = rowOffset + i;
        const xRatio = i / (gridX - 1);
        const lx = (xRatio - 0.5) * this.width;

        const vertIndex = idx * 3;

        const ambient = ambientWaterWave(this.centerX+lx,this.centerZ+lz,ambientTime,this.ambientSlope);
        const totalHeight = .15*Math.tanh((current[idx]+ambient)/.15);

        posArray[vertIndex + 1] = totalHeight;

        const iL = Math.max(0, i - 1);
        const iR = Math.min(gridX - 1, i + 1);
        const jD = Math.max(0, j - 1);
        const jU = Math.min(gridZ - 1, j + 1);

        const hL = current[rowOffset + iL];
        const hR = current[rowOffset + iR];
        const hD = current[jD * gridX + i];
        const hU = current[jU * gridX + i];

        const dh_dx = (hR - hL) / ((iR - iL || 1) * dx);
        const dh_dz = (hU - hD) / ((jU - jD || 1) * dz);

        const slopeScale = 1-(totalHeight/.15)**2;
        const nx = (-dh_dx-this.ambientSlope.x)*slopeScale;
        const ny = 1.0;
        const nz = (-dh_dz-this.ambientSlope.y)*slopeScale;
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;

        normArray[vertIndex] = nx / len;
        normArray[vertIndex + 1] = ny / len;
        normArray[vertIndex + 2] = nz / len;
      }
    }

    posAttr.needsUpdate = true;
    normAttr.needsUpdate = true;
  }
}
