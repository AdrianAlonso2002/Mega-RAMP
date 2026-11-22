import fs from 'fs';

const stepMap = JSON.parse(fs.readFileSync('scripts/extracted_step_map.json', 'utf8'));
const extractedMethods = JSON.parse(fs.readFileSync('scripts/extracted_methods.json', 'utf8'));

// Special methods manually handled
const goalPortalCode = `
  private createGoalPortal(
    obj: LevelObjectData,
    physics: PhysicsWorld,
    tempEuler: THREE.Euler,
    tempQuat: THREE.Quaternion
  ): { group: THREE.Group; portalMesh: THREE.Mesh } {
    const goalY = Math.abs(obj.position.y - 1.6) < 0.1 ? 0.4 : obj.position.y;
    const group = new THREE.Group();
    group.position.set(obj.position.x, goalY, obj.position.z);
    group.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);

    tempEuler.set(obj.rotation.x, obj.rotation.y, obj.rotation.z, "YXZ");
    tempQuat.setFromEuler(tempEuler);
    const quat = { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w };

    // --- Physical Colliders for Square Posts & Top Lintel (Non-traversable, resting on ground) ---
    // Uses exact quaternion 3D transformation so rotated goals at any angle have 100% accurate physical colliders
    const goalOrigin = new THREE.Vector3(obj.position.x, goalY, obj.position.z);
    const leftWorld = new THREE.Vector3(-1.7, 1.59, 0).applyQuaternion(tempQuat).add(goalOrigin);
    physics.createBoxCollider(leftWorld, quat, { x: 0.22, y: 1.59, z: 0.22 }, 0.75, 0.4);

    const rightWorld = new THREE.Vector3(1.7, 1.59, 0).applyQuaternion(tempQuat).add(goalOrigin);
    physics.createBoxCollider(rightWorld, quat, { x: 0.22, y: 1.59, z: 0.22 }, 0.75, 0.4);

    const beamWorld = new THREE.Vector3(0, 3.40, 0).applyQuaternion(tempQuat).add(goalOrigin);
    physics.createBoxCollider(beamWorld, quat, { x: 1.95, y: 0.22, z: 0.24 }, 0.75, 0.4);

    const postMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.85, roughness: 0.25 });
    const neonMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });

    const leftPost = new THREE.Mesh(new THREE.BoxGeometry(0.44, 3.18, 0.44), postMat);
    leftPost.position.set(-1.7, 1.59, 0);
    const leftNeon = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.18, 0.46), neonMat);
    leftPost.add(leftNeon);
    group.add(leftPost);

    const rightPost = new THREE.Mesh(new THREE.BoxGeometry(0.44, 3.18, 0.44), postMat);
    rightPost.position.set(1.7, 1.59, 0);
    const rightNeon = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.18, 0.46), neonMat);
    rightPost.add(rightNeon);
    group.add(rightPost);

    const topBeamMat = new THREE.MeshStandardMaterial({ color: 0xc62828, metalness: 0.6, roughness: 0.3 });
    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.44, 0.48), topBeamMat);
    topBeam.position.set(0, 3.40, 0);
    group.add(topBeam);

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, "rgba(0, 229, 255, 0.75)");
    grad.addColorStop(0.35, "rgba(255, 255, 255, 0.9)");
    grad.addColorStop(0.65, "rgba(124, 58, 237, 0.7)");
    grad.addColorStop(1, "rgba(0, 229, 255, 0.35)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    const portalTex = new THREE.CanvasTexture(canvas);
    portalTex.wrapS = THREE.RepeatWrapping;
    portalTex.wrapT = THREE.RepeatWrapping;

    const portalMat = new THREE.MeshBasicMaterial({
      map: portalTex,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const portalMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.96, 3.16), portalMat);
    portalMesh.name = "goalPortal";
    portalMesh.renderOrder = 8;
    portalMesh.position.set(0, 1.58, 0);
    group.add(portalMesh);

    return { group, portalMesh };
  }
`;

const rouletteCode = `
  static createCasinoRouletteMesh(
    radius = 7.5,
    dishHeight = 0.6,
    _quality: "low" | "medium" | "high" = "medium"
  ): { group: THREE.Group; meshes: THREE.Mesh[]; hubMesh: THREE.Mesh } {
    const group = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    const numSectors = 12;
    const secAngle = (Math.PI * 2) / numSectors;
    const innerR = 1.4;

    // Central brass hub cone
    const centerHubGeo = new THREE.CylinderGeometry(0.8, 1.4, 1.0, 16);
    centerHubGeo.translate(0, dishHeight / 2 + 0.5, 0);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.2, metalness: 0.8 });
    const hubMesh = new THREE.Mesh(centerHubGeo, goldMat);
    group.add(hubMesh);
    meshes.push(hubMesh);

    // Cross bars on central hub
    const crossGeo1 = new THREE.BoxGeometry(2.4, 0.12, 0.18);
    crossGeo1.translate(0, dishHeight / 2 + 1.0, 0);
    group.add(new THREE.Mesh(crossGeo1, goldMat));
    const crossGeo2 = new THREE.BoxGeometry(0.18, 0.12, 2.4);
    crossGeo2.translate(0, dishHeight / 2 + 1.0, 0);
    group.add(new THREE.Mesh(crossGeo2, goldMat));

    // Outer Mahogany wooden rim (only around sectors 1..11, leaving sector 0 completely open!)
    // Sector 0 spans from -secAngle/2 to +secAngle/2.
    // The wooden rim covers the remaining 11 sectors from +secAngle/2 to 2*PI - secAngle/2.
    const rimArc = Math.PI * 2 - secAngle;
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.4 });
    const rimGeo = new THREE.TorusGeometry(radius, 0.4, 8, 28, rimArc);
    rimGeo.rotateX(Math.PI / 2);
    rimGeo.rotateZ(secAngle / 2);
    rimGeo.translate(0, dishHeight / 2 + 0.3, 0);
    const rimMesh = new THREE.Mesh(rimGeo, woodMat);
    group.add(rimMesh);
    meshes.push(rimMesh);

    const greenMat = new THREE.MeshStandardMaterial({
      color: 0x00e676,
      roughness: 0.35,
      emissive: new THREE.Color(0x00e676),
      emissiveIntensity: 0.3
    });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xc62828, roughness: 0.35 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.35 });

    for (let i = 0; i < numSectors; i++) {
      const angle = i * secAngle;
      const isZero = i === 0;
      const isRed = i % 2 === 1;
      const mat = isZero ? greenMat : isRed ? redMat : blackMat;

      // In Three.js CylinderGeometry, angle theta is measured from +Z towards +X:
      // vertex.x = radius * sin(theta), vertex.z = radius * cos(theta).
      const gap = 0.015;
      const thetaStart = angle - secAngle / 2 + gap;
      const thetaLength = secAngle - 2 * gap;

      if (isZero) {
        // Sector 0 is the OPEN CHUTE / HOLE: DO NOT ADD FLOOR GEOMETRY!
        // Green illuminated portal arches marking the drop hole entrance:
        const holeX = Math.sin(angle) * (radius - 0.3);
        const holeZ = Math.cos(angle) * (radius - 0.3);

        // Neon "0" beacon sign at the rim entrance
        const zeroSignGeo = new THREE.BoxGeometry(1.2, 0.48, 0.18);
        zeroSignGeo.rotateY(angle);
        zeroSignGeo.translate(holeX, dishHeight / 2 + 0.65, holeZ);
        group.add(new THREE.Mesh(zeroSignGeo, greenMat));

        // Twin glowing neon entrance pillars on left and right of the chute
        for (const side of [-1, 1]) {
          const sideAngle = angle + side * (secAngle / 2);
          const px = Math.sin(sideAngle) * (radius - 0.15);
          const pz = Math.cos(sideAngle) * (radius - 0.15);
          const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.2, 8), greenMat);
          pillar.position.set(px, dishHeight / 2 + 0.6, pz);
          group.add(pillar);
        }
      } else {
        // True non-overlapping circular wedge sector (for sectors 1..11)
        const wedgeGeo = new THREE.CylinderGeometry(
          radius - 0.25,
          radius - 0.25,
          dishHeight,
          8,
          1,
          false,
          thetaStart,
          thetaLength
        );
        wedgeGeo.translate(0, 0, 0);
        const wedgeMesh = new THREE.Mesh(wedgeGeo, mat);
        group.add(wedgeMesh);
        meshes.push(wedgeMesh);

        // Golden Fret Divider between sectors
        const fretAngle = angle + secAngle / 2;
        const fx = Math.sin(fretAngle) * ((radius + innerR) / 2);
        const fz = Math.cos(fretAngle) * ((radius + innerR) / 2);
        const fretLen = radius - innerR;
        const fretGeo = new THREE.BoxGeometry(0.08, dishHeight + 0.1, fretLen);
        fretGeo.rotateY(fretAngle);
        fretGeo.translate(fx, dishHeight / 2 + 0.05, fz);
        group.add(new THREE.Mesh(fretGeo, goldMat));
      }
    }

    return { group, meshes, hubMesh };
  }
`;

const applyContinuousUVsCode = `
  static applyContinuousWorldUVs(
    geo: THREE.BufferGeometry,
    worldPos: { x: number; y: number; z: number },
    worldRot: { x: number; y: number; z: number },
    worldScale: { x: number; y: number; z: number },
    textureTileSize = 4.0
  ): void {
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
    const normAttr = geo.getAttribute("normal") as THREE.BufferAttribute;
    const uvAttr = geo.getAttribute("uv") as THREE.BufferAttribute;
    if (!posAttr || !normAttr || !uvAttr) return;

    const euler = new THREE.Euler(worldRot.x, worldRot.y, worldRot.z, "YXZ");
    const localPos = new THREE.Vector3();
    const localNorm = new THREE.Vector3();

    for (let i = 0; i < posAttr.count; i++) {
      localPos.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      localNorm.set(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));

      localPos.applyEuler(euler);
      localNorm.applyEuler(euler);

      const wx = worldPos.x + localPos.x;
      const wy = worldPos.y + localPos.y;
      const wz = worldPos.z + localPos.z;

      const nx = Math.abs(localNorm.x);
      const ny = Math.abs(localNorm.y);
      const nz = Math.abs(localNorm.z);

      if (ny >= nx && ny >= nz) {
        // Top / Bottom faces: world X and world Z
        uvAttr.setXY(i, wx / textureTileSize, wz / textureTileSize);
      } else if (nx >= nz) {
        // Left / Right faces: world Z and relative height
        uvAttr.setXY(i, wz / textureTileSize, (wy - (worldPos.y - worldScale.y / 2)) / textureTileSize);
      } else {
        // Front / Back faces: world X and relative height
        uvAttr.setXY(i, wx / textureTileSize, (wy - (worldPos.y - worldScale.y / 2)) / textureTileSize);
      }
    }
    uvAttr.needsUpdate = true;
  }
`;

const sharedWaterLavaCode = `
  private static chalkboardTex: THREE.CanvasTexture | null = null;
  private static dogTongueTex: THREE.CanvasTexture | null = null;
  private static ronyFaceTex: THREE.CanvasTexture | null = null;
  private static tramDestTex: THREE.CanvasTexture | null = null;
  private static cachedWaterTex: THREE.CanvasTexture | null = null;
  private static cachedLavaTex: THREE.CanvasTexture | null = null;
  private static cachedHoneyTex: THREE.CanvasTexture | null = null;

  static getSharedWaterTexture(): THREE.CanvasTexture {
    if (this.cachedWaterTex) return this.cachedWaterTex;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    ctx.fillStyle = "#0284c7";
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = "#0ea5e9";
    for (let y = 0; y < 256; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 256; x += 32) {
        ctx.quadraticCurveTo(x + 16, y + Math.sin((x * Math.PI * 4) / 256) * 12, x + 32, y);
      }
      ctx.lineTo(256, y + 20);
      ctx.lineTo(0, y + 20);
      ctx.closePath();
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(224, 242, 254, 0.75)";
    ctx.lineWidth = 3;
    const highlights = [
      { x: 40, y: 50, r: 24 },
      { x: 140, y: 70, r: 28 },
      { x: 210, y: 40, r: 20 },
      { x: 80, y: 160, r: 30 },
      { x: 190, y: 150, r: 26 },
      { x: 50, y: 220, r: 22 },
      { x: 150, y: 230, r: 25 },
      { x: 230, y: 210, r: 24 }
    ];
    highlights.forEach(h => {
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.fillStyle = "#ffffff";
    highlights.forEach(h => {
      ctx.beginPath();
      ctx.arc(h.x + 8, h.y - 6, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;

    this.cachedWaterTex = tex;
    return tex;
  }

  static getSharedLavaTexture(): THREE.CanvasTexture {
    if (this.cachedLavaTex) return this.cachedLavaTex;

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#d00000";
    ctx.fillRect(0, 0, 128, 128);

    ctx.fillStyle = "#ff5400";
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc((i * 35) % 128, (i * 47) % 128, 28, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#ffb703";
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(((i * 29) + 10) % 128, ((i * 41) + 15) % 128, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#220000";
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(((i * 43) + 20) % 128, ((i * 37) + 10) % 128, 16, 10, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;

    this.cachedLavaTex = tex;
    return tex;
  }
`;

const buildWaterClustersCode = `
  private buildWaterClusters(
    waterObjects: LevelObjectData[],
    physics: PhysicsWorld,
    root: THREE.Group,
    waterBlocks: ActiveWaterBlock[],
    tempEuler: THREE.Euler,
    tempQuat: THREE.Quaternion,
    activeQuality: "low" | "medium" | "high" = "medium"
  ): void {
    if (waterObjects.length === 0) return;

    // Cluster discovery: find connected/adjacent water blocks
    const visited = new Set<string>();
    const clusters: LevelObjectData[][] = [];

    for (let i = 0; i < waterObjects.length; i++) {
      const startObj = waterObjects[i];
      if (visited.has(startObj.id)) continue;

      const cluster: LevelObjectData[] = [startObj];
      visited.add(startObj.id);
      const queue: LevelObjectData[] = [startObj];

      while (queue.length > 0) {
        const curr = queue.shift()!;
        const currTop = curr.position.y + curr.scale.y / 2;
        const currMinX = curr.position.x - curr.scale.x / 2;
        const currMaxX = curr.position.x + curr.scale.x / 2;
        const currMinZ = curr.position.z - curr.scale.z / 2;
        const currMaxZ = curr.position.z + curr.scale.z / 2;

        for (let j = 0; j < waterObjects.length; j++) {
          const other = waterObjects[j];
          if (visited.has(other.id)) continue;

          const otherTop = other.position.y + other.scale.y / 2;
          if (Math.abs(currTop - otherTop) > 0.25) continue;

          const otherMinX = other.position.x - other.scale.x / 2;
          const otherMaxX = other.position.x + other.scale.x / 2;
          const otherMinZ = other.position.z - other.scale.z / 2;
          const otherMaxZ = other.position.z + other.scale.z / 2;

          const touchX = currMinX <= otherMaxX + 0.1 && currMaxX >= otherMinX - 0.1;
          const touchZ = currMinZ <= otherMaxZ + 0.1 && currMaxZ >= otherMinZ - 0.1;

          if (touchX && touchZ) {
            visited.add(other.id);
            cluster.push(other);
            queue.push(other);
          }
        }
      }
      clusters.push(cluster);
    }

    const waterTex = LevelBuilder.getSharedWaterTexture();

    for (const cluster of clusters) {
      const minX = Math.min(...cluster.map(o => o.position.x - o.scale.x / 2));
      const maxX = Math.max(...cluster.map(o => o.position.x + o.scale.x / 2));
      const minZ = Math.min(...cluster.map(o => o.position.z - o.scale.z / 2));
      const maxZ = Math.max(...cluster.map(o => o.position.z + o.scale.z / 2));

      const clusterWidth = Math.max(1, maxX - minX);
      const clusterDepth = Math.max(1, maxZ - minZ);
      const clusterCenterX = (minX + maxX) / 2;
      const clusterCenterZ = (minZ + maxZ) / 2;

      const density = activeQuality === "low" ? 2 : activeQuality === "medium" ? 3 : 4;
      const simRes = Math.min(
        activeQuality === "low" ? 20 : activeQuality === "medium" ? 32 : 48,
        Math.max(14, Math.round(Math.max(clusterWidth, clusterDepth) * density))
      );
      const simulator = new WaterWaveSimulator(clusterWidth, clusterDepth, simRes, clusterCenterX, clusterCenterZ);

      for (const obj of cluster) {
        tempEuler.set(obj.rotation.x, obj.rotation.y, obj.rotation.z, "YXZ");
        tempQuat.setFromEuler(tempEuler);

        const surfaceY = obj.position.y + obj.scale.y / 2;
        const isCircular =
          obj.properties?.shape === "cylinder" ||
          obj.properties?.shape === "circle" ||
          obj.properties?.platformShape === "cylinder" ||
          obj.properties?.platformShape === "circle";
        const radius = Math.max(obj.scale.x, obj.scale.z) / 2;

        let surfaceGeo: THREE.BufferGeometry;
        let bodyGeo: THREE.BufferGeometry;

        if (isCircular) {
          surfaceGeo = new THREE.CircleGeometry(radius, 48);
          surfaceGeo.rotateX(-Math.PI / 2);
          bodyGeo = new THREE.CylinderGeometry(radius, radius, Math.max(0.1, obj.scale.y - 0.04), 48);
        } else {
          const segX = Math.min(24, Math.max(4, Math.round(obj.scale.x * density)));
          const segZ = Math.min(24, Math.max(4, Math.round(obj.scale.z * density)));
          surfaceGeo = new THREE.PlaneGeometry(obj.scale.x, obj.scale.z, segX, segZ);
          surfaceGeo.rotateX(-Math.PI / 2);
          bodyGeo = new THREE.BoxGeometry(obj.scale.x, Math.max(0.1, obj.scale.y - 0.04), obj.scale.z);
        }

        const uvAttr = surfaceGeo.getAttribute("uv") as THREE.BufferAttribute;
        const posAttr = surfaceGeo.getAttribute("position") as THREE.BufferAttribute;
        for (let k = 0; k < uvAttr.count; k++) {
          const wx = obj.position.x + posAttr.getX(k);
          const wz = obj.position.z + posAttr.getZ(k);
          uvAttr.setXY(k, wx / 4.0, wz / 4.0);
        }
        uvAttr.needsUpdate = true;

        const isHoney = obj.type === "honey" || obj.properties?.fluidType === "honey" || obj.properties?.theme === "honey";
        const fluidTex = isHoney ? LevelBuilder.getSharedHoneyTexture() : waterTex;
        const fluidColor = isHoney ? 0xf59e0b : 0x00b4d8;
        const fluidBodyColor = isHoney ? 0xb45309 : 0x0077b6;

        let surfaceMat: THREE.Material;
        if (activeQuality === "low") {
          surfaceMat = new THREE.MeshBasicMaterial({
            map: fluidTex,
            color: new THREE.Color(fluidColor),
            transparent: true,
            opacity: isHoney ? 0.88 : 0.82,
            depthWrite: false,
            side: THREE.DoubleSide
          });
        } else if (activeQuality === "medium") {
          surfaceMat = new THREE.MeshPhongMaterial({
            map: fluidTex,
            color: new THREE.Color(fluidColor),
            shininess: isHoney ? 90 : 70,
            specular: new THREE.Color(isHoney ? 0xfff0aa : 0xffffff),
            transparent: true,
            opacity: isHoney ? 0.88 : 0.82,
            depthWrite: false,
            side: THREE.DoubleSide
          });
        } else {
          surfaceMat = new THREE.MeshStandardMaterial({
            map: fluidTex,
            roughnessMap: fluidTex,
            color: new THREE.Color(fluidColor),
            roughness: isHoney ? 0.05 : 0.08,
            metalness: isHoney ? 0.18 : 0.12,
            transparent: true,
            opacity: isHoney ? 0.88 : 0.82,
            depthWrite: false,
            side: THREE.DoubleSide
          });
        }

        const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
        surfaceMesh.renderOrder = 6;
        surfaceMesh.position.set(obj.position.x, surfaceY, obj.position.z);
        surfaceMesh.rotation.copy(tempEuler);
        root.add(surfaceMesh);

        LevelBuilder.applyContinuousWorldUVs(bodyGeo, obj.position, obj.rotation, obj.scale, 4.0);

        const bodyMat: THREE.Material = activeQuality === "high"
          ? new THREE.MeshStandardMaterial({
              color: new THREE.Color(fluidBodyColor),
              roughness: 0.20,
              metalness: 0.05,
              transparent: true,
              opacity: isHoney ? 0.72 : 0.55,
              depthWrite: false,
              side: THREE.DoubleSide
            })
          : new THREE.MeshLambertMaterial({
              color: new THREE.Color(fluidBodyColor),
              transparent: true,
              opacity: isHoney ? 0.72 : 0.55,
              depthWrite: false,
              side: THREE.DoubleSide
            });

        const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
        bodyMesh.renderOrder = 5;
        bodyMesh.position.set(obj.position.x, obj.position.y - 0.02, obj.position.z);
        bodyMesh.rotation.copy(tempEuler);
        root.add(bodyMesh);

        const hasCollision =
          obj.properties?.hasCollision === true ||
          obj.properties?.passable === false ||
          obj.properties?.solid === true;
        const passable = !hasCollision;

        waterBlocks.push({
          id: obj.id,
          position: new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z),
          scale: new THREE.Vector3(obj.scale.x, obj.scale.y, obj.scale.z),
          mesh: bodyMesh,
          surfaceMesh,
          simulator,
          material: surfaceMat,
          clusterCenterX,
          clusterCenterZ,
          passable,
          fluidType: isHoney ? "honey" : "water",
          dragFactor: isHoney ? 8.5 : 3.4
        });

        if (hasCollision) {
          if (isCircular) {
            physics.createCylinderCollider(
              obj.position,
              radius,
              obj.scale.y / 2,
              0.6,
              0.15
            );
          } else {
            physics.createBoxCollider(
              obj.position,
              { x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w },
              { x: obj.scale.x / 2, y: obj.scale.y / 2, z: obj.scale.z / 2 },
              0.6,
              0.15
            );
          }
        }
      }
    }
  }
`;

const dogMeshCode = extractedMethods['createDogMesh']
  .replace(
    '): { group: THREE.Group; headGroup: THREE.Group; tailMesh: THREE.Mesh; meshes: THREE.Mesh[] }',
    '): { group: THREE.Group; headGroup: THREE.Group; tailMesh: THREE.Mesh; legs: THREE.Group[]; meshes: THREE.Mesh[] }'
  )
  .replace(
    `legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.48, 6), bodyMat);
      leg.position.set(lx, ly, lz);
      const paw = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.14), muzzleMat);
      paw.position.set(lx, 0.03, lz - 0.02);
      group.add(leg, paw);
      meshes.push(leg, paw);
    });

    return { group, headGroup, tailMesh, meshes };`,
    `const legs: THREE.Group[] = [];
    legPositions.forEach(([lx, ly, lz]) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(lx, ly, lz);
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.48, 6), bodyMat);
      leg.position.y = 0;
      const paw = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.14), muzzleMat);
      paw.position.set(0, -0.21, -0.02);
      legGroup.add(leg, paw);
      group.add(legGroup);
      legs.push(legGroup);
      meshes.push(leg, paw);
    });

    return { group, headGroup, tailMesh, legs, meshes };`
  );

const limpKickerCode = extractedMethods['createLimpKickerMesh']
  .replace(
    '): { group: THREE.Group; meshes: THREE.Mesh[]; castLeg: THREE.Group; torso: THREE.Mesh }',
    '): { group: THREE.Group; meshes: THREE.Mesh[]; castLeg: THREE.Group; crutchL: THREE.Group; crutchR: THREE.Group; torso: THREE.Mesh }'
  )
  .replace(
    'return { group: kickerGroup, meshes, castLeg, torso };',
    'return { group: kickerGroup, meshes, castLeg, crutchL, crutchR, torso };'
  );

const cinemaSeatRowMeshCode = extractedMethods['createCinemaSeatRowMesh'].replace('height = 2.6,', '_height = 2.6,');

// Read current LevelBuilder up to end of createYachtMesh
const currentContent = fs.readFileSync('src/levels/LevelBuilder.ts', 'utf8');
const lines = currentContent.split('\n');

// Yacht mesh ends around line 10061
const yachtEndLineIndex = lines.findIndex((l, idx) => idx > 10000 && l.trim() === 'return { group, meshes };');
console.log('Yacht end line index:', yachtEndLineIndex);
const cutIndex = yachtEndLineIndex + 2;
console.log('Cutting after line:', cutIndex, lines[cutIndex - 1]);

const prefix = lines.slice(0, cutIndex).join('\n');

// Find start of Republican methods
const repStartLineIndex = lines.findIndex((l, idx) => idx >= cutIndex && l.includes('WORLD 4 LEVEL 3 STAGE 8: ESCALERAS REPUBLICANAS'));
console.log('Republican methods start at line:', repStartLineIndex);
const republicanSection = lines.slice(repStartLineIndex).join('\n');

// Build middle methods array in order
const middleMethods = [
  extractedMethods['createMarketStallMesh'],
  extractedMethods['createShopMesh'],
  extractedMethods['createVerticalWheelMesh'],
  extractedMethods['getEMTBusDestinationTexture'],
  extractedMethods['getCPiquenasStreetMarkingTexture'],
  extractedMethods['getAtletiJerseyTexture'],
  extractedMethods['getGreenFloralDressTexture'],
  extractedMethods['getRealMadridJerseyTexture'],
  extractedMethods['getVintageTigerDressTexture'],
  extractedMethods['getChalkboardTexture'],
  extractedMethods['getDogTongueTexture'],
  extractedMethods['getRonyFaceTexture'],
  extractedMethods['getTramDestinationTexture'],
  extractedMethods['createTramMesh'],
  extractedMethods['createEMTBus35Mesh'],
  rouletteCode,
  extractedMethods['createBicyclePedalMesh'],
  extractedMethods['createTramRailsMesh'],
  limpKickerCode,
  extractedMethods['createBeachKioskMesh'],
  extractedMethods['createGiantUmbrellaMesh'],
  extractedMethods['createBeachTowelMesh'],
  extractedMethods['createHippieStallMesh'],
  extractedMethods['createWaveMesh'],
  extractedMethods['createTramStraightRailsMesh'],
  extractedMethods['createGiantBouncyPalmMesh'],
  extractedMethods['createMercadonaShelvesMesh'],
  extractedMethods['createSupermarketCheckoutMesh'],
  extractedMethods['createShoppingCartBayMesh'],
  extractedMethods['createBazarShelfMesh'],
  extractedMethods['createClotheslineMesh'],
  extractedMethods['createPopeyePizzaMesh'],
  extractedMethods['createPopeyeBillboardMesh'],
  extractedMethods['createStracciatellaConeMesh'],
  goalPortalCode,
  dogMeshCode,
  extractedMethods['createGirlMesh'],
  extractedMethods['createBoyMesh'],
  extractedMethods['createDoorMesh'],
  extractedMethods['createLitosDuoMesh'],
  extractedMethods['createSalamanderMesh'],
  extractedMethods['createMisinaCatMesh'],
  extractedMethods['createA4SheetMesh'],
  extractedMethods['createGokuMesh'],
  extractedMethods['createContinuousKamehamehaMesh'],
  extractedMethods['createKamehamehaBeamMesh'],
  extractedMethods['createKamehamehaBurstMesh'],
  extractedMethods['createKamehamehaChargeMesh'],
  extractedMethods['createChalkboardMesh'],
  extractedMethods['createClappingGlovesMesh'],
  extractedMethods['createMadridDuo132BMesh'],
  extractedMethods['createElevator2FMesh'],
  extractedMethods['createContinuousTongueMesh'],
  extractedMethods['createYorkshireRonyMesh'],
  extractedMethods['createFlooFlameGroup'],
  extractedMethods['createFlooFireplaceMesh'],
  extractedMethods['createHoodedManMesh'],
  extractedMethods['createMembrilloBumperMesh'],
  extractedMethods['createPokemonBoosterWallMesh'],
  extractedMethods['createPirateShipMesh'],
  extractedMethods['createWaterGeyserMesh'],
  extractedMethods['createCarrefourArchMesh'],
  applyContinuousUVsCode,
  sharedWaterLavaCode,
  extractedMethods['getSharedHoneyTexture'],
  buildWaterClustersCode,
  extractedMethods['createIslazulMallFacadeMesh'],
  extractedMethods['createPrimarkClothesWallMesh'],
  extractedMethods['createPrimarkPortalMesh'],
  extractedMethods['createPrimarkPlushToyMesh'],
  extractedMethods['createFunkoBoxMesh'],
  extractedMethods['createRodillaSandwichMesh'],
  extractedMethods['createQuesaritoMesh'],
  extractedMethods['createTGBBurgerMesh'],
  cinemaSeatRowMeshCode,
  extractedMethods['createCinemaScreenMesh'],
  extractedMethods['createVivaGymTreadmillMesh']
];

console.log('Middle methods count:', middleMethods.length);
for (let i = 0; i < middleMethods.length; i++) {
  if (!middleMethods[i]) {
    console.log('ERROR: Missing method at index', i);
  }
}

const fullReassembled = prefix + '\n\n' + middleMethods.filter(Boolean).join('\n\n') + '\n\n' + republicanSection;
fs.writeFileSync('src/levels/LevelBuilder.ts', fullReassembled, 'utf8');
console.log('Successfully reassembled src/levels/LevelBuilder.ts! Total length:', fullReassembled.length);
