import { assetUrl } from "../core/AssetUrl";
import {collectibleKind,drawCollectibleArt} from './CollectibleArt';
import * as THREE from "three";
import {SharedTextureCache} from './StageResources';
import {characterSpritePath, getCharacterSkin} from "../player/CharacterSkins";
import {CharacterFrameCache} from './CharacterFrameCache';
import type {LevelData} from '../levels/LevelTypes';

export type CharacterState = "normal" | "move1" | "move2" | "scary1" | "scary2" | "happy";

/**
 * Procedural and high-definition sprite generator for characters, collectibles, and textures.
 * Supports character animation states (normal, move1, move2, scary1, scary2, happy) with real artwork.
 */
export class SpriteTextures {
  private static cachedTextures = new SharedTextureCache<THREE.CanvasTexture>();
  private static characterFrames?:CharacterFrameCache;
  private static cachedFullCanvases = new Map<string, HTMLCanvasElement>();
  private static cachedAvatarCanvases = new Map<string, HTMLCanvasElement>();
  private static avatarReadiness = new Map<string, Promise<void>>();

  static async waitForUIPortraits():Promise<void>{
    let timer:ReturnType<typeof setTimeout>|undefined;
    try{await Promise.race([Promise.all(this.avatarReadiness.values()),new Promise<void>(resolve=>{timer=setTimeout(resolve,8000);})]);}
    finally{clearTimeout(timer);}
  }
  private static cachedEyesCanvases = new Map<string, HTMLCanvasElement>();
  private static cachedColoringTextures = new SharedTextureCache<THREE.Texture>();
  private static cachedColoringReady=new Map<string,Promise<void>>();
  private static textureLoader = new THREE.TextureLoader();

  /**
   * Startup only needs four portraits; animation sets load when their form is selected.
   */
  static preloadCharacterTextures(): void {
    const ids = ["rony", "adri", "misi", "pao"];
    for (const id of ids) {
      this.getCharacterTexture(id);
    }
  }

  static preloadCharacterSkin(id: string, skinId = 'normal'): void {
    const states: CharacterState[] = ['normal','move1','move2','scary1','scary2','happy'];
    for (const state of states) this.getCharacterTexture(id, state, skinId);
  }

  static async waitForCharacterSkin(id:string,skinId='normal'):Promise<void> {
    this.getCharacterTexture(id,'normal',skinId);
    await this.characterFrames!.waitForSkin(id,skinId);
  }
  static keepCharacterSkin(id:string,skinId='normal'):void{this.characterFrames?.keepSkin(id,skinId);}

  static async prepareLevelAssets(stages:readonly LevelData[]):Promise<void> {
    const drawings=new Set<number>(),sets=new Set<string>();
    for(const stage of stages) {
      const key=`${stage.world}:${stage.level}`;
      if(!sets.has(key)){this.getWorldBlockSet(stage.world,stage.level);sets.add(key);}
      stage.objects.forEach((object,index)=>{
        const props=object.properties;
        if(props?.variant==='a4_sheet'||props?.theme==='drawing_sheet'||props?.theme==='coloring_sheet')drawings.add(Number(props.sheetIndex)||(index+1));
      });
    }
    const pending=[...drawings].map(index=>{
      this.getColoringPageTexture(index);
      const page=((((index-1)%3)+3)%3)+1;
      return this.cachedColoringReady.get(`coloring_page_${page}`)??Promise.resolve();
    });
    if(!pending.length)return;
    let timer:ReturnType<typeof setTimeout>|undefined;
    try {await Promise.race([Promise.all(pending),new Promise<void>(resolve=>{timer=setTimeout(resolve,8000);})]);}
    finally {clearTimeout(timer);}
  }

  /**
   * Generates a 512x512 full-body procedural sprite canvas for character inside the ball (used as fallback).
   */
  static getCharacterFullCanvas(id: string): HTMLCanvasElement {
    const cached = this.cachedFullCanvases.get(id);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.clearRect(0, 0, 512, 512);

    switch (id) {
      case "rony":
        this.drawRony(ctx);
        break;
      case "adri":
        this.drawAdri(ctx);
        break;
      case "misi":
        this.drawMisi(ctx);
        break;
      case "pao":
        this.drawPao(ctx);
        break;
      default:
        this.drawRony(ctx);
        break;
    }

    this.cachedFullCanvases.set(id, canvas);
    return canvas;
  }

  /**
   * Generates a character billboard sprite texture based on character id and state (normal, move1, move2, scary1, scary2, happy).
   * Loads high-definition transparent PNG and falls back gracefully to procedural art if offline.
   */
  static getCharacterTexture(id: string, state: CharacterState = "normal", skinId = "normal"): THREE.Texture {
    this.characterFrames??=new CharacterFrameCache({
      canvas:()=>document.createElement('canvas'),
      fallback:character=>this.getCharacterFullCanvas(character),
      load:(url,loaded,failed)=>{
        // The loader's temporary Texture is never rendered or uploaded to the GPU.
        this.textureLoader.load(url,source=>{loaded(source.image);source.dispose();},undefined,failed);
      }
    });
    return this.characterFrames.get(id.toLowerCase(),state,skinId);
  }

  /**
   * Generates a high-definition circular avatar canvas for UI selection and title screen.
   * Accurately cropped to focus on the face and head of the real character artwork.
   */
  static getCharacterAvatarCanvas(id: string, size: number = 128, skinId = "normal"): HTMLCanvasElement {
    const normId = id.toLowerCase();
    const cacheKey = `avatar_${getCharacterSkin(normId, skinId).spriteBase}_${size}`;
    const cached = this.cachedAvatarCanvases.get(cacheKey);
    if (cached) return cached;

    const avatarCanvas = document.createElement("canvas");
    avatarCanvas.width = size;
    avatarCanvas.height = size;
    const ctx = avatarCanvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Immediate fallback while real image loads
    const fallbackCanvas = this.getCharacterFullCanvas(normId);
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(fallbackCanvas, 120, 50, 272, 272, 0, 0, size, size);
    ctx.restore();

    if (typeof Image !== "undefined") {
      let ready:()=>void=()=>{};
      this.avatarReadiness.set(cacheKey,new Promise<void>(resolve=>{ready=resolve;}));
      const img = new Image();
      img.src = characterSpritePath(normId, skinId);
      const renderRealAvatar = () => {
        ctx.clearRect(0, 0, size, size);

        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();

        const imgW = img.naturalWidth || 1024;
        const imgH = img.naturalHeight || 1024;

        // Crop focused on character's head/face
        let cropSize = imgW * 0.58;
        let cropX = (imgW - cropSize) / 2;
        let cropY = imgH * 0.05;

        if (normId === "misi") {
          cropSize = imgW * 0.56;
          cropX = (imgW - cropSize) / 2;
          cropY = imgH * 0.08;
        } else if (normId === "adri") {
          cropSize = imgW * 0.56;
          cropX = (imgW - cropSize) / 2;
          cropY = imgH * 0.03;
        } else if (normId === "pao") {
          cropSize = imgW * 0.56;
          cropX = (imgW - cropSize) / 2;
          cropY = imgH * 0.04;
        } else if (normId === "rony") {
          cropSize = imgW * 0.58;
          cropX = (imgW - cropSize) / 2;
          cropY = imgH * 0.05;
        }

        const skinCrop = getCharacterSkin(normId, skinId).avatar;
        if (skinCrop) {
          cropX = skinCrop[0] * imgW;
          cropY = skinCrop[1] * imgH;
          cropSize = skinCrop[2] * imgW;
        }

        ctx.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, size, size);
        ctx.restore();
        ready();
      };

      if (img.complete && img.naturalWidth > 0) {
        renderRealAvatar();
      } else {
        img.onload = renderRealAvatar;
        img.onerror = ()=>ready(); // The already-painted portrait is a complete fallback.
      }
    }

    this.cachedAvatarCanvases.set(cacheKey, avatarCanvas);
    return avatarCanvas;
  }

  /** A dedicated crop per form keeps hats, infant faces and fur out of the eye selector. */
  static getCharacterEyesCanvas(id: string, skinId = 'normal'): HTMLCanvasElement {
    const skin = getCharacterSkin(id, skinId), key = skin.spriteBase;
    const cached = this.cachedEyesCanvases.get(key);
    if (cached) return cached;
    const canvas = document.createElement('canvas');
    canvas.width = 132; canvas.height = 54;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const eyeY = id === 'rony' ? .326 : id === 'misi' ? .32 : .36;
    const rect = skin.eyes ?? [.34, eyeY-.04, .32, .08];
    const image = new Image();
    image.onload = () => {
      ctx.clearRect(0,0,132,54);
      ctx.drawImage(image,rect[0]*image.naturalWidth,rect[1]*image.naturalHeight,
        rect[2]*image.naturalWidth,rect[3]*image.naturalHeight,0,0,132,54);
    };
    image.src = characterSpritePath(id, skin.id);
    this.cachedEyesCanvases.set(key,canvas);
    return canvas;
  }

  /**
   * Rony: Perro Yorkshire terrier ("yorsai") con la lengua fuera (Matching Photo!).
   * Full body arcade sprite (512x512) for ball & UI.
   */
  private static drawRony(ctx: CanvasRenderingContext2D): void {
    // 0. Ground contact shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    ctx.beginPath();
    ctx.ellipse(256, 460, 105, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. Silky steel-blue / slate body and flanks
    const bodyGrad = ctx.createLinearGradient(190, 310, 320, 440);
    bodyGrad.addColorStop(0, "#475569");
    bodyGrad.addColorStop(0.5, "#334155");
    bodyGrad.addColorStop(1, "#1E293B");
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(256, 375, 76, 68, 0, 0, Math.PI * 2);
    ctx.fill();

    // Silky steel-blue fur directional texture strokes
    ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
    ctx.lineWidth = 3;
    for (let i = -45; i <= 45; i += 15) {
      ctx.beginPath();
      ctx.moveTo(256 + i, 335);
      ctx.quadraticCurveTo(256 + i * 1.2, 380, 256 + i * 1.35, 425);
      ctx.stroke();
    }

    // 2. Fluffy wagging tail arching to the right
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(315, 395);
    ctx.quadraticCurveTo(375, 370, 368, 305);
    ctx.stroke();
    // Golden tip of tail
    ctx.strokeStyle = "#E0AA53";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(366, 330);
    ctx.quadraticCurveTo(372, 310, 368, 305);
    ctx.stroke();

    // 3. Fluffy golden-tan chest bib fur
    const chestGrad = ctx.createRadialGradient(256, 335, 10, 256, 365, 65);
    chestGrad.addColorStop(0, "#FFF0BD");
    chestGrad.addColorStop(0.5, "#EDB868");
    chestGrad.addColorStop(1, "#D99B41");
    ctx.fillStyle = chestGrad;
    ctx.beginPath();
    ctx.ellipse(256, 355, 46, 52, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Paws: fluffy golden-tan front paws
    const drawPaw = (px: number, py: number) => {
      ctx.fillStyle = "#EDB868";
      ctx.beginPath();
      ctx.ellipse(px, py, 26, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#D99B41";
      // Toe creases
      ctx.beginPath();
      ctx.ellipse(px - 12, py + 2, 7, 10, -0.15, 0, Math.PI * 2);
      ctx.ellipse(px, py + 4, 8, 11, 0, 0, Math.PI * 2);
      ctx.ellipse(px + 12, py + 2, 7, 10, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFF0BD";
      ctx.beginPath();
      ctx.arc(px, py - 4, 10, 0, Math.PI * 2);
      ctx.fill();
    };
    drawPaw(205, 442);
    drawPaw(307, 442);

    // 5. Upright Pointy V-Shaped Yorkie Ears!
    const drawYorkieEar = (isLeft: boolean) => {
      const sign = isLeft ? -1 : 1;
      const bx = 256 + sign * 68;
      const by = 165;
      const tipX = 256 + sign * 105;
      const tipY = 82;
      const inX = 256 + sign * 36;
      const inY = 150;

      // Outer ear (dark chestnut and cinnamon fur)
      ctx.fillStyle = "#78350F";
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(tipX, tipY);
      ctx.lineTo(inX, inY);
      ctx.closePath();
      ctx.fill();

      // Golden fringe on outer ear rim
      ctx.strokeStyle = "#D99B41";
      ctx.lineWidth = 6;
      ctx.lineJoin = "round";
      ctx.stroke();

      // Soft pink/tan velvet inside
      ctx.fillStyle = "#FED7AA";
      ctx.beginPath();
      ctx.moveTo(bx - sign * 6, by - 6);
      ctx.lineTo(tipX - sign * 5, tipY + 14);
      ctx.lineTo(inX + sign * 4, inY - 4);
      ctx.closePath();
      ctx.fill();

      // Inner fluffy tuft
      ctx.fillStyle = "rgba(255, 247, 237, 0.75)";
      ctx.beginPath();
      ctx.ellipse(bx - sign * 8, by - 12, 10, 16, sign * 0.3, 0, Math.PI * 2);
      ctx.fill();
    };
    drawYorkieEar(true);
    drawYorkieEar(false);

    // 6. Big round fluffy head with layered silky fur
    const headGrad = ctx.createRadialGradient(256, 195, 20, 256, 215, 92);
    headGrad.addColorStop(0, "#FFF0BD");
    headGrad.addColorStop(0.35, "#EDB868");
    headGrad.addColorStop(0.8, "#D99B41");
    headGrad.addColorStop(1, "#B45309");
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.arc(256, 210, 86, 0, Math.PI * 2);
    ctx.fill();

    // Silky blonde / golden head fur feathering
    ctx.strokeStyle = "rgba(255, 240, 189, 0.6)";
    ctx.lineWidth = 3;
    for (let a = 0; a < Math.PI * 2; a += 0.22) {
      const rx = 256 + Math.cos(a) * 82;
      const ry = 210 + Math.sin(a) * 82;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + Math.cos(a) * 12, ry + Math.sin(a) * 12);
      ctx.stroke();
    }

    // 7. Fluffy Yorkie Mustache & Beard (parted at the nose, flowing down)
    const beardGrad = ctx.createLinearGradient(256, 230, 256, 320);
    beardGrad.addColorStop(0, "#FFF5D1");
    beardGrad.addColorStop(0.4, "#EDB868");
    beardGrad.addColorStop(1, "#D99B41");
    ctx.fillStyle = beardGrad;

    // Left mustache wing
    ctx.beginPath();
    ctx.moveTo(256, 235);
    ctx.quadraticCurveTo(175, 245, 185, 305);
    ctx.quadraticCurveTo(230, 315, 256, 280);
    ctx.fill();

    // Right mustache wing
    ctx.beginPath();
    ctx.moveTo(256, 235);
    ctx.quadraticCurveTo(337, 245, 327, 305);
    ctx.quadraticCurveTo(282, 315, 256, 280);
    ctx.fill();

    // Chin beard locks
    ctx.beginPath();
    ctx.moveTo(230, 275);
    ctx.quadraticCurveTo(256, 325, 282, 275);
    ctx.fill();

    // Beard hair strands
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(246, 245); ctx.quadraticCurveTo(210, 270, 215, 300);
    ctx.moveTo(266, 245); ctx.quadraticCurveTo(302, 270, 297, 300);
    ctx.moveTo(256, 255); ctx.lineTo(256, 305);
    ctx.stroke();

    // 8. Glossy Puppy Eyes (with warm brow arches)
    // Golden brow tufts
    ctx.fillStyle = "#FFF0BD";
    ctx.beginPath();
    ctx.ellipse(212, 178, 18, 9, -0.15, 0, Math.PI * 2);
    ctx.ellipse(300, 178, 18, 9, 0.15, 0, Math.PI * 2);
    ctx.fill();

    const drawEye = (ex: number, ey: number) => {
      // Eyelid shadow
      ctx.fillStyle = "#451A03";
      ctx.beginPath();
      ctx.arc(ex, ey, 16, 0, Math.PI * 2);
      ctx.fill();

      // Deep dark iris
      ctx.fillStyle = "#090D16";
      ctx.beginPath();
      ctx.arc(ex, ey, 14, 0, Math.PI * 2);
      ctx.fill();

      // Warm brown reflection rim
      ctx.strokeStyle = "#92400E";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(ex, ey, 12, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();

      // Dual white sparkling catchlights
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(ex - 4, ey - 4, 4.5, 0, Math.PI * 2);
      ctx.arc(ex + 4, ey + 4, 2, 0, Math.PI * 2);
      ctx.fill();
    };
    drawEye(212, 195);
    drawEye(300, 195);

    // 9. Black button nose (Truffe)
    ctx.fillStyle = "#0F172A";
    ctx.beginPath();
    ctx.ellipse(256, 235, 15, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    // Nostril cleft
    ctx.strokeStyle = "#020617";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(256, 235);
    ctx.lineTo(256, 245);
    ctx.stroke();
    // Specular wet shine on nose
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.beginPath();
    ctx.ellipse(252, 231, 5, 3, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // 10. LENGUA FUERA! (User requested signature trait)
    // Dark mouth opening behind tongue
    ctx.fillStyle = "#450A0A";
    ctx.beginPath();
    ctx.ellipse(262, 256, 12, 9, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Joyful bright pink tongue sticking out & curving right
    ctx.fillStyle = "#FB7185";
    ctx.beginPath();
    ctx.moveTo(250, 252);
    ctx.quadraticCurveTo(248, 282, 260, 298);
    ctx.quadraticCurveTo(278, 305, 280, 288);
    ctx.quadraticCurveTo(278, 262, 270, 252);
    ctx.closePath();
    ctx.fill();

    // Tongue rim shadow
    ctx.strokeStyle = "#E11D48";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Tongue center indentation crease
    ctx.strokeStyle = "#F43F5E";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(258, 256);
    ctx.quadraticCurveTo(262, 278, 268, 294);
    ctx.stroke();

    // Glossy wet shine on tongue tip
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.beginPath();
    ctx.ellipse(268, 292, 5, 2.5, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Adri: Chico moreno, pelo rizado, camiseta de tirantes blanca, pantalón corto negro,
   * zapatillas negras, calcetines negros (Matching Photo!).
   * Full body arcade sprite (512x512) for ball & UI.
   */
  private static drawAdri(ctx: CanvasRenderingContext2D): void {
    // 0. Ground contact shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.ellipse(256, 475, 95, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. ZAPATILLAS NEGRAS (Black athletic sneakers with white midsole trim)
    const drawSneaker = (sx: number, sy: number, flip: boolean) => {
      ctx.save();
      ctx.translate(sx, sy);
      if (flip) ctx.scale(-1, 1);

      // Black sneaker upper
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.roundRect(-22, -18, 44, 26, [8, 12, 4, 4]);
      ctx.fill();

      // White athletic midsole
      ctx.fillStyle = "#F8FAFC";
      ctx.beginPath();
      ctx.roundRect(-24, 4, 48, 8, [2, 2, 4, 4]);
      ctx.fill();

      // Grey outsole tread
      ctx.fillStyle = "#94A3B8";
      ctx.fillRect(-22, 10, 44, 2.5);

      // Grey laces & eyelets
      ctx.strokeStyle = "#4B5563";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, -10); ctx.lineTo(10, -6);
      ctx.moveTo(-10, -4);  ctx.lineTo(10, 0);
      ctx.stroke();

      ctx.restore();
    };
    drawSneaker(212, 458, false);
    drawSneaker(300, 458, true);

    // 2. CALCETINES NEGROS (Black crew socks up to mid-calf)
    ctx.fillStyle = "#1F2937";
    // Left sock
    ctx.beginPath();
    ctx.roundRect(196, 408, 32, 40, [4, 4, 2, 2]);
    ctx.fill();
    // Right sock
    ctx.beginPath();
    ctx.roundRect(284, 408, 32, 40, [4, 4, 2, 2]);
    ctx.fill();

    // Sock ribbing texture
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 1.5;
    for (let y = 414; y <= 438; y += 6) {
      ctx.beginPath();
      ctx.moveTo(198, y); ctx.lineTo(226, y);
      ctx.moveTo(286, y); ctx.lineTo(314, y);
      ctx.stroke();
    }

    // 3. PIERNAS ATLÉTICAS (Tan skin tone with toned muscular calves & knees)
    const skinGrad = ctx.createLinearGradient(0, 100, 0, 450);
    skinGrad.addColorStop(0, "#EFC2A6"); // Highlight
    skinGrad.addColorStop(0.5, "#DFAC89"); // Tan base
    skinGrad.addColorStop(1, "#C28B65"); // Muscle shadow

    ctx.fillStyle = skinGrad;
    // Left calf
    ctx.beginPath();
    ctx.roundRect(200, 335, 26, 78, 12);
    ctx.fill();
    // Right calf
    ctx.beginPath();
    ctx.roundRect(286, 335, 26, 78, 12);
    ctx.fill();

    // Knee muscle definition
    ctx.strokeStyle = "rgba(194, 139, 101, 0.7)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(213, 345, 6, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.arc(299, 345, 6, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    // 4. PANTALÓN CORTO NEGRO (Black athletic shorts)
    ctx.fillStyle = "#18181B";
    ctx.beginPath();
    // Left short leg
    ctx.moveTo(186, 265);
    ctx.lineTo(180, 345);
    ctx.lineTo(245, 345);
    ctx.lineTo(256, 305);
    // Right short leg
    ctx.lineTo(267, 345);
    ctx.lineTo(332, 345);
    ctx.lineTo(326, 265);
    ctx.closePath();
    ctx.fill();

    // Shorts fabric fold shadows & highlights
    ctx.strokeStyle = "#27272A";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(180, 345); ctx.lineTo(245, 345);
    ctx.moveTo(267, 345); ctx.lineTo(332, 345);
    ctx.stroke();

    // Elastic waistband with dark drawstring knot
    ctx.fillStyle = "#27272A";
    ctx.fillRect(186, 262, 140, 10);
    ctx.fillStyle = "#52525B";
    ctx.beginPath();
    ctx.arc(256, 270, 4, 0, Math.PI * 2);
    ctx.fill();

    // 5. CAMISETA DE TIRANTES BLANCA (Athletic ribbed white tank top)
    // Exposed tan chest skin visible in deep scooped U-neckline
    ctx.fillStyle = skinGrad;
    ctx.beginPath();
    ctx.ellipse(256, 205, 38, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    // Clavicle lines
    ctx.strokeStyle = "rgba(194, 139, 101, 0.8)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(226, 195); ctx.quadraticCurveTo(242, 200, 252, 205);
    ctx.moveTo(286, 195); ctx.quadraticCurveTo(270, 200, 260, 205);
    ctx.stroke();

    // White tank top body
    const tankGrad = ctx.createLinearGradient(200, 175, 312, 275);
    tankGrad.addColorStop(0, "#FFFFFF");
    tankGrad.addColorStop(0.7, "#F8FAFC");
    tankGrad.addColorStop(1, "#E2E8F0");
    ctx.fillStyle = tankGrad;

    ctx.beginPath();
    // Left strap over shoulder
    ctx.moveTo(202, 172);
    ctx.lineTo(226, 172);
    // Scoop U-neckline
    ctx.quadraticCurveTo(256, 218, 286, 172);
    // Right strap over shoulder
    ctx.lineTo(310, 172);
    // Right athletic armhole cut
    ctx.quadraticCurveTo(328, 225, 318, 268);
    // Waist
    ctx.lineTo(194, 268);
    // Left athletic armhole cut
    ctx.quadraticCurveTo(184, 225, 202, 172);
    ctx.closePath();
    ctx.fill();

    // Tank top border ribbing & folds
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pectoral and athletic abdominal seam lines on white fabric
    ctx.strokeStyle = "rgba(203, 213, 225, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(256, 220); ctx.lineTo(256, 266);
    ctx.moveTo(228, 235); ctx.lineTo(250, 240);
    ctx.moveTo(284, 235); ctx.lineTo(262, 240);
    ctx.stroke();

    // 6. BRAZOS ATLÉTICOS TONIFICADOS (Muscular arms emerging from tank top)
    const drawArm = (isLeft: boolean) => {
      const sign = isLeft ? -1 : 1;
      const shX = 256 + sign * 60;
      const shY = 175;
      const elbX = 256 + sign * 95;
      const elbY = 225;
      const wrX = 256 + sign * 98;
      const wrY = 275;

      ctx.fillStyle = skinGrad;
      // Deltoid & bicep
      ctx.beginPath();
      ctx.ellipse(shX + sign * 14, shY + 18, 20, 28, sign * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Forearm
      ctx.beginPath();
      ctx.ellipse(elbX + sign * 4, elbY + 24, 16, 28, sign * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Bicep contour shadow
      ctx.strokeStyle = "rgba(194, 139, 101, 0.7)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(shX + sign * 18, shY + 24, 12, sign > 0 ? 0 : Math.PI * 0.6, sign > 0 ? Math.PI * 0.4 : Math.PI);
      ctx.stroke();

      // Clenched athletic hand / fist
      ctx.fillStyle = "#DFAC89";
      ctx.beginPath();
      ctx.arc(wrX, wrY + 6, 14, 0, Math.PI * 2);
      ctx.fill();
    };
    drawArm(true);
    drawArm(false);

    // Smartwatch on left wrist (from mirror selfie!)
    ctx.fillStyle = "#1E293B";
    ctx.beginPath();
    ctx.roundRect(144, 268, 16, 12, 3);
    ctx.fill();
    ctx.fillStyle = "#38BDF8";
    ctx.fillRect(147, 271, 10, 6);

    // 7. CUELLO Y ROSTRO (Tan skin, strong masculine jawline)
    // Neck
    ctx.fillStyle = skinGrad;
    ctx.beginPath();
    ctx.roundRect(238, 145, 36, 42, 8);
    ctx.fill();
    // Neck shadow under chin
    ctx.fillStyle = "rgba(182, 126, 90, 0.4)";
    ctx.beginPath();
    ctx.ellipse(256, 160, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head / Jaw oval
    ctx.fillStyle = skinGrad;
    ctx.beginPath();
    ctx.ellipse(256, 135, 48, 52, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = "#DFAC89";
    ctx.beginPath();
    ctx.ellipse(204, 136, 10, 16, -0.15, 0, Math.PI * 2);
    ctx.ellipse(308, 136, 10, 16, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#C08862";
    ctx.beginPath();
    ctx.ellipse(205, 136, 6, 10, -0.15, 0, Math.PI * 2);
    ctx.ellipse(307, 136, 6, 10, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // 8. ROSTRO: Ojos hazel, cejas masculinas, sonrisa segura
    // Eyebrows
    ctx.fillStyle = "#201611";
    ctx.beginPath();
    ctx.roundRect(220, 116, 26, 6, 3);
    ctx.roundRect(266, 116, 26, 6, 3);
    ctx.fill();

    // Eyes (Almond-shaped masculine eyes)
    const drawAdriEye = (ex: number, flip: boolean) => {
      // Sclera
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.ellipse(ex, 130, 11, 8, flip ? 0.1 : -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Warm hazel-brown iris
      ctx.fillStyle = "#3E2723";
      ctx.beginPath();
      ctx.arc(ex, 130, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Dark pupil
      ctx.fillStyle = "#0F172A";
      ctx.beginPath();
      ctx.arc(ex, 130, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Sharp catchlight
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(ex - 2.5, 128, 2, 0, Math.PI * 2);
      ctx.fill();

      // Eyelid crease
      ctx.strokeStyle = "#201611";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(ex, 129, 11, 1.1 * Math.PI, 1.9 * Math.PI);
      ctx.stroke();
    };
    drawAdriEye(232, false);
    drawAdriEye(280, true);

    // Nose
    ctx.strokeStyle = "#C08862";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(254, 125);
    ctx.lineTo(254, 145);
    ctx.lineTo(260, 145);
    ctx.stroke();

    // Confident smirk smile
    ctx.strokeStyle = "#991B1B";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(256, 156, 12, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
    // Warm lip color
    ctx.fillStyle = "rgba(180, 107, 85, 0.6)";
    ctx.beginPath();
    ctx.ellipse(256, 163, 10, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 9. PELO RIZADO MORENO (Exact curly hair volume from mirror selfie!)
    // Short tapered hair along ears & sides
    ctx.fillStyle = "#1C1410";
    ctx.beginPath();
    ctx.ellipse(206, 120, 14, 24, -0.2, 0, Math.PI * 2);
    ctx.ellipse(306, 120, 14, 24, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Voluminous curly mop on top (layered rich dark curls)
    const curls = [
      // Base crown volume
      { x: 256, y: 72, r: 36 },
      { x: 224, y: 74, r: 32 }, { x: 288, y: 74, r: 32 },
      { x: 198, y: 88, r: 28 }, { x: 314, y: 88, r: 28 },
      { x: 238, y: 55, r: 26 }, { x: 274, y: 55, r: 26 },
      // Defined spiral curl clumps tumbling down
      { x: 216, y: 100, r: 22 }, { x: 296, y: 100, r: 22 },
      { x: 242, y: 88, r: 24 },  { x: 270, y: 88, r: 24 },
      // FRONT CURLS falling over forehead (signature trait!)
      { x: 236, y: 108, r: 18 }, { x: 258, y: 104, r: 19 },
      { x: 278, y: 108, r: 18 }, { x: 248, y: 114, r: 14 }
    ];

    curls.forEach(c => {
      ctx.fillStyle = "#1E1612";
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();

      // Curl strand highlight arc (gives authentic 3D curly bounce)
      ctx.strokeStyle = "#4E372C";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(c.x - c.r * 0.2, c.y - c.r * 0.2, c.r * 0.65, 0.8 * Math.PI, 1.8 * Math.PI);
      ctx.stroke();

      // Deep dark curl core
      ctx.strokeStyle = "#120E0C";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(c.x + c.r * 0.15, c.y + c.r * 0.15, c.r * 0.5, 0, Math.PI);
      ctx.stroke();
    });
  }

  /**
   * Misi: Gatita carey con manchas tricolor, grandes ojos azul zafiro,
   * jersey rosa y pajarita roja (Matching Photo!).
   * Full body arcade sprite (512x512) for ball & UI.
   */
  private static drawMisi(ctx: CanvasRenderingContext2D): void {
    // 0. Ground contact shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    ctx.beginPath();
    ctx.ellipse(256, 460, 100, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. Graceful sweeping Calico Tail (arching up on the right)
    ctx.strokeStyle = "#2D2D3A"; // Charcoal base
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(310, 395);
    ctx.quadraticCurveTo(375, 370, 365, 290);
    ctx.stroke();
    // Warm ginger patch on tail
    ctx.strokeStyle = "#D97706";
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(350, 350);
    ctx.quadraticCurveTo(372, 330, 366, 310);
    ctx.stroke();
    // White tail tip
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(367, 305);
    ctx.lineTo(365, 290);
    ctx.stroke();

    // 2. ROPITA: Jersey rosa suave de punto (From Photo!)
    const sweaterGrad = ctx.createLinearGradient(190, 260, 320, 390);
    sweaterGrad.addColorStop(0, "#FBCFE8");
    sweaterGrad.addColorStop(0.5, "#F472B6");
    sweaterGrad.addColorStop(1, "#DB2777");
    ctx.fillStyle = sweaterGrad;

    ctx.beginPath();
    ctx.ellipse(256, 350, 72, 65, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sweater knitted rib texture lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 2.5;
    for (let x = 205; x <= 307; x += 14) {
      ctx.beginPath();
      ctx.moveTo(x, 295); ctx.lineTo(x, 405);
      ctx.stroke();
    }

    // White fluffy cat paws emerging from sweater
    const drawCatPaw = (px: number) => {
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.ellipse(px, 440, 24, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FBCFE8";
      // Pink toe cushion pads
      ctx.beginPath();
      ctx.arc(px - 10, 442, 4.5, 0, Math.PI * 2);
      ctx.arc(px, 444, 5, 0, Math.PI * 2);
      ctx.arc(px + 10, 442, 4.5, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCatPaw(218);
    drawCatPaw(294);

    // 3. LAZO ROJO DE TERCIOPELO (Bold Red Velvet Bow Tie from Photo!)
    const drawRedBowTie = () => {
      const cx = 256;
      const cy = 265;

      // Left bow loop
      ctx.fillStyle = "#DC2626";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.quadraticCurveTo(cx - 50, cy - 35, cx - 48, cy);
      ctx.quadraticCurveTo(cx - 50, cy + 35, cx, cy);
      ctx.closePath();
      ctx.fill();

      // Right bow loop
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.quadraticCurveTo(cx + 50, cy - 35, cx + 48, cy);
      ctx.quadraticCurveTo(cx + 50, cy + 35, cx, cy);
      ctx.closePath();
      ctx.fill();

      // Velvet shading & highlights
      ctx.strokeStyle = "#991B1B";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Ribbon tails
      ctx.fillStyle = "#B91C1C";
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy); ctx.lineTo(cx - 24, cy + 42); ctx.lineTo(cx - 6, cy + 35); ctx.lineTo(cx, cy + 5);
      ctx.moveTo(cx + 8, cy); ctx.lineTo(cx + 24, cy + 42); ctx.lineTo(cx + 6, cy + 35); ctx.lineTo(cx, cy + 5);
      ctx.fill();

      // Center golden ribbon knot
      ctx.fillStyle = "#F59E0B";
      ctx.beginPath();
      ctx.ellipse(cx, cy, 11, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FEF3C7";
      ctx.beginPath();
      ctx.arc(cx - 3, cy - 3, 3, 0, Math.PI * 2);
      ctx.fill();
    };
    drawRedBowTie();

    // 4. Orejas puntiagudas (Left ear dark charcoal, Right ear cream/tan!)
    // Left ear (Dark charcoal/slate)
    ctx.fillStyle = "#1E1F29";
    ctx.beginPath();
    ctx.moveTo(180, 160); ctx.lineTo(152, 70); ctx.lineTo(225, 120); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#FBCFE8";
    ctx.beginPath();
    ctx.moveTo(180, 150); ctx.lineTo(160, 85); ctx.lineTo(215, 122); ctx.closePath();
    ctx.fill();

    // Right ear (Cream/tan with ginger patch)
    ctx.fillStyle = "#FDFBF7";
    ctx.beginPath();
    ctx.moveTo(332, 160); ctx.lineTo(360, 70); ctx.lineTo(287, 120); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#D97706";
    ctx.beginPath();
    ctx.moveTo(320, 140); ctx.lineTo(358, 72); ctx.lineTo(340, 110); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#FED7AA";
    ctx.beginPath();
    ctx.moveTo(332, 150); ctx.lineTo(352, 85); ctx.lineTo(297, 122); ctx.closePath();
    ctx.fill();

    // 5. Cabeza redondeada con MANCHAS CAREY / TRICOLOR (From Photo!)
    // Base head: cream / soft white
    ctx.fillStyle = "#FDFBF7";
    ctx.beginPath();
    ctx.arc(256, 185, 78, 0, Math.PI * 2);
    ctx.fill();

    // DISTINCTIVE CAREY PATCHES (Matching Photo!):
    // Left side: Dark slate-black patch covering left eye, ear base and temple
    ctx.fillStyle = "#1E1F29";
    ctx.beginPath();
    ctx.moveTo(256, 107);
    ctx.quadraticCurveTo(170, 115, 178, 185);
    ctx.quadraticCurveTo(185, 230, 240, 215);
    ctx.quadraticCurveTo(248, 165, 256, 107);
    ctx.closePath();
    ctx.fill();

    // Right side: Ginger-amber patches on cheek and crown
    ctx.fillStyle = "#D97706";
    ctx.beginPath();
    ctx.moveTo(270, 115);
    ctx.quadraticCurveTo(335, 125, 330, 185);
    ctx.quadraticCurveTo(315, 235, 275, 215);
    ctx.quadraticCurveTo(265, 175, 270, 115);
    ctx.closePath();
    ctx.fill();

    // Honey-tan soft cheek patch
    ctx.fillStyle = "#F59E0B";
    ctx.beginPath();
    ctx.ellipse(310, 195, 18, 24, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // White chin & muzzle
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.ellipse(256, 218, 38, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // 6. GRANDES OJOS AZUL ZAFIRO (From Photo!)
    const drawMisiEye = (ex: number) => {
      // Dark eyeliner ring
      ctx.fillStyle = "#0F172A";
      ctx.beginPath();
      ctx.arc(ex, 178, 20, 0, Math.PI * 2);
      ctx.fill();

      // Radiant Sky/Sapphire blue gradient iris
      const eyeGrad = ctx.createRadialGradient(ex, 176, 2, ex, 178, 18);
      eyeGrad.addColorStop(0, "#BAE6FD");
      eyeGrad.addColorStop(0.35, "#38BDF8");
      eyeGrad.addColorStop(0.8, "#0284C7");
      eyeGrad.addColorStop(1, "#0369A1");
      ctx.fillStyle = eyeGrad;
      ctx.beginPath();
      ctx.arc(ex, 178, 18, 0, Math.PI * 2);
      ctx.fill();

      // Deep dark round pupil (curious wide-eyed feline expression)
      ctx.fillStyle = "#020617";
      ctx.beginPath();
      ctx.ellipse(ex, 178, 8, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dual sparkling white catchlights
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(ex - 5, 172, 5, 0, Math.PI * 2);
      ctx.arc(ex + 5, 184, 2.5, 0, Math.PI * 2);
      ctx.fill();
    };
    drawMisiEye(216);
    drawMisiEye(296);

    // 7. Hocico, naricita rosa con lunar oscuro (From Photo!)
    // Cute pink nose
    ctx.fillStyle = "#F472B6";
    ctx.beginPath();
    ctx.moveTo(250, 208); ctx.lineTo(262, 208); ctx.lineTo(256, 216);
    ctx.closePath();
    ctx.fill();

    // Dark calico smudge on nose (from photo!)
    ctx.fillStyle = "#1E1F29";
    ctx.beginPath();
    ctx.arc(253, 210, 3, 0, Math.PI * 2);
    ctx.fill();

    // Feline mouth
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(256, 216); ctx.lineTo(256, 222);
    ctx.arc(250, 224, 7, 0, Math.PI * 0.9, false);
    ctx.moveTo(256, 222);
    ctx.arc(262, 224, 7, 0.1 * Math.PI, Math.PI, false);
    ctx.stroke();

    // 8. Bigotes blancos finos
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(230, 218); ctx.lineTo(165, 210);
    ctx.moveTo(230, 224); ctx.lineTo(160, 226);
    ctx.moveTo(230, 230); ctx.lineTo(168, 242);
    ctx.moveTo(282, 218); ctx.lineTo(347, 210);
    ctx.moveTo(282, 224); ctx.lineTo(352, 226);
    ctx.moveTo(282, 230); ctx.lineTo(344, 242);
    ctx.stroke();
  }

  /**
   * Pao: Chica con flequillo recto, camiseta lila, pantalones cargo beis,
   * zapatillas blancas (Matching Oxford Photo!).
   * Full body arcade sprite (512x512) for ball & UI.
   */
  private static drawPao(ctx: CanvasRenderingContext2D): void {
    // 0. Ground contact shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    ctx.beginPath();
    ctx.ellipse(256, 475, 88, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. ZAPATILLAS BLANCAS (Crisp white trendy chunky sneakers)
    const drawWhiteSneaker = (sx: number, sy: number, flip: boolean) => {
      ctx.save();
      ctx.translate(sx, sy);
      if (flip) ctx.scale(-1, 1);

      // Clean white sneaker upper
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(-22, -18, 44, 26, [8, 12, 4, 4]);
      ctx.fill();

      // Grey sole rim & rubber tread
      ctx.fillStyle = "#E2E8F0";
      ctx.beginPath();
      ctx.roundRect(-24, 4, 48, 8, [2, 2, 4, 4]);
      ctx.fill();
      ctx.fillStyle = "#CBD5E1";
      ctx.fillRect(-22, 10, 44, 2.5);

      // Laces & stitch outline
      ctx.strokeStyle = "#CBD5E1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, -10); ctx.lineTo(10, -6);
      ctx.moveTo(-10, -4);  ctx.lineTo(10, 0);
      ctx.stroke();

      ctx.restore();
    };
    drawWhiteSneaker(212, 458, false);
    drawWhiteSneaker(300, 458, true);

    // 2. PANTALONES CARGO BEIS (Beige cargo pants with side flap pockets)
    const cargoGrad = ctx.createLinearGradient(200, 265, 312, 450);
    cargoGrad.addColorStop(0, "#E8DFCF");
    cargoGrad.addColorStop(0.5, "#D4C5A9");
    cargoGrad.addColorStop(1, "#B8A584");
    ctx.fillStyle = cargoGrad;

    // Loose relaxed cargo legs
    ctx.beginPath();
    // Left leg
    ctx.moveTo(194, 265);
    ctx.lineTo(182, 448);
    ctx.lineTo(240, 448);
    ctx.lineTo(256, 315);
    // Right leg
    ctx.lineTo(272, 448);
    ctx.lineTo(330, 448);
    ctx.lineTo(318, 265);
    ctx.closePath();
    ctx.fill();

    // Cargo gather cuffs at ankles
    ctx.strokeStyle = "#9E8C6D";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(182, 446); ctx.lineTo(240, 446);
    ctx.moveTo(272, 446); ctx.lineTo(330, 446);
    ctx.stroke();

    // BOLSAS CARGO LATERALES (Iconic flap pockets on both thighs!)
    const drawCargoPocket = (px: number, py: number) => {
      // Pocket body
      ctx.fillStyle = "#C9B99A";
      ctx.strokeStyle = "#9E8C6D";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(px, py, 36, 42, 4);
      ctx.fill();
      ctx.stroke();

      // Pocket top flap
      ctx.fillStyle = "#D4C5A9";
      ctx.beginPath();
      ctx.roundRect(px - 2, py - 4, 40, 14, 3);
      ctx.fill();
      ctx.stroke();

      // Button / stitch detail
      ctx.fillStyle = "#786B52";
      ctx.beginPath();
      ctx.arc(px + 18, py + 3, 3, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCargoPocket(170, 322); // Left thigh pocket
    drawCargoPocket(306, 322); // Right thigh pocket

    // Cargo seam lines along knees
    ctx.strokeStyle = "rgba(158, 140, 109, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(188, 385); ctx.lineTo(234, 385);
    ctx.moveTo(278, 385); ctx.lineTo(324, 385);
    ctx.stroke();

    // 3. Background brunette hair flowing past shoulders
    ctx.fillStyle = "#2A1D16";
    ctx.beginPath();
    ctx.ellipse(256, 185, 76, 95, 0, 0, Math.PI * 2);
    ctx.fill();
    // Long hair locks spilling down to chest (Y ~ 290)
    ctx.beginPath();
    ctx.moveTo(180, 180);
    ctx.quadraticCurveTo(168, 250, 188, 290);
    ctx.quadraticCurveTo(212, 280, 205, 200);
    ctx.moveTo(332, 180);
    ctx.quadraticCurveTo(344, 250, 324, 290);
    ctx.quadraticCurveTo(300, 280, 307, 200);
    ctx.fill();

    // 4. CAMISETA LILA (Lilac / lavender top with short sleeves)
    const lilacGrad = ctx.createLinearGradient(200, 175, 312, 275);
    lilacGrad.addColorStop(0, "#DDD6FE");
    lilacGrad.addColorStop(0.5, "#C084FC");
    lilacGrad.addColorStop(1, "#A855F7");
    ctx.fillStyle = lilacGrad;

    // Lilac shirt body
    ctx.beginPath();
    ctx.roundRect(200, 175, 112, 95, [14, 14, 8, 8]);
    ctx.fill();

    // Short sleeves
    ctx.beginPath();
    ctx.ellipse(185, 195, 20, 28, -0.35, 0, Math.PI * 2);
    ctx.ellipse(327, 195, 20, 28, 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Crew neckline ribbing
    ctx.strokeStyle = "#E9D5FF";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(256, 178, 22, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // Shirt soft drape folds
    ctx.strokeStyle = "rgba(147, 51, 234, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(215, 240); ctx.quadraticCurveTo(256, 255, 297, 240);
    ctx.stroke();

    // 5. Brazos y manos delicadas (Fair porcelain skin)
    const paoSkinGrad = ctx.createLinearGradient(0, 120, 0, 300);
    paoSkinGrad.addColorStop(0, "#FFF1E8");
    paoSkinGrad.addColorStop(0.5, "#FDE2D2");
    paoSkinGrad.addColorStop(1, "#F3BEA2");

    ctx.fillStyle = paoSkinGrad;
    // Forearms resting softly near hips
    ctx.beginPath();
    ctx.ellipse(178, 245, 12, 26, 0.15, 0, Math.PI * 2);
    ctx.ellipse(334, 245, 12, 26, -0.15, 0, Math.PI * 2);
    ctx.fill();
    // Hands
    ctx.beginPath();
    ctx.arc(180, 275, 11, 0, Math.PI * 2);
    ctx.arc(332, 275, 11, 0, Math.PI * 2);
    ctx.fill();

    // 6. Cuello y Rostro femenino dulce
    // Neck
    ctx.fillStyle = paoSkinGrad;
    ctx.beginPath();
    ctx.roundRect(242, 148, 28, 36, 6);
    ctx.fill();

    // Head oval
    ctx.beginPath();
    ctx.ellipse(256, 136, 44, 48, 0, 0, Math.PI * 2);
    ctx.fill();

    // Soft rosy blush on cheeks (From Oxford photo!)
    ctx.fillStyle = "rgba(244, 114, 182, 0.38)";
    ctx.beginPath();
    ctx.ellipse(224, 144, 14, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(288, 144, 14, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // 7. ROSTRO: Ojos almendrados amables, sonrisa cálida
    // Eyes
    const drawPaoEye = (ex: number, flip: boolean) => {
      // Sclera
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.ellipse(ex, 130, 11, 8, flip ? 0.08 : -0.08, 0, Math.PI * 2);
      ctx.fill();

      // Warm brown iris
      ctx.fillStyle = "#3D2619";
      ctx.beginPath();
      ctx.arc(ex, 130, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = "#0F172A";
      ctx.beginPath();
      ctx.arc(ex, 130, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Dual sparkle catchlights
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(ex - 3, 128, 2.5, 0, Math.PI * 2);
      ctx.arc(ex + 3, 132, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Winged eyeliner & eyelashes
      ctx.strokeStyle = "#1A110D";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(ex, 129, 11, 1.1 * Math.PI, 1.95 * Math.PI);
      ctx.stroke();
    };
    drawPaoEye(230, false);
    drawPaoEye(282, true);

    // Delicate nose
    ctx.strokeStyle = "#F3BEA2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(255, 130);
    ctx.lineTo(255, 144);
    ctx.lineTo(259, 144);
    ctx.stroke();

    // Warm, genuine closed-mouth smile (From Oxford photo!)
    ctx.strokeStyle = "#E11D48";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(256, 153, 9, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    // Soft lip sheen
    ctx.fillStyle = "rgba(251, 113, 133, 0.55)";
    ctx.beginPath();
    ctx.ellipse(256, 159, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 8. FLEQUILLO RECTO Y DEFINIDO (User requested signature trait from Oxford Photo!)
    ctx.fillStyle = "#2A1D16";

    // Cúpula superior del cabello
    ctx.beginPath();
    ctx.arc(256, 110, 48, Math.PI, 0, false);
    ctx.fill();

    // ¡FLEQUILLO RECTO CRUZANDO LA FRENTE!
    // Horizontal blunt fringe cleanly framing forehead just above eyebrows
    ctx.beginPath();
    ctx.moveTo(206, 88);
    ctx.lineTo(306, 88);
    ctx.lineTo(306, 121);
    // Subtle natural feathering along bottom edge of fringe
    ctx.lineTo(294, 123);
    ctx.lineTo(282, 121);
    ctx.lineTo(270, 123);
    ctx.lineTo(256, 121);
    ctx.lineTo(242, 123);
    ctx.lineTo(230, 121);
    ctx.lineTo(218, 123);
    ctx.lineTo(206, 121);
    ctx.closePath();
    ctx.fill();

    // Glossy silk shine band across bangs
    ctx.strokeStyle = "rgba(93, 67, 53, 0.55)";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(214, 105);
    ctx.quadraticCurveTo(256, 112, 298, 105);
    ctx.stroke();

    // Longer side-curtain locks framing cheeks
    ctx.fillStyle = "#2A1D16";
    ctx.beginPath();
    ctx.ellipse(208, 135, 9, 24, -0.1, 0, Math.PI * 2);
    ctx.ellipse(304, 135, 9, 24, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Generates custom collectible texture for the given collectible id.
   */
  static getCollectibleTexture(id: string): THREE.CanvasTexture {
    const kind=collectibleKind(id),key='item_v2_'+kind,cached=this.cachedTextures.get(key);
    if(cached)return cached;
    const canvas=typeof document==='undefined'?{width:256,height:256} as HTMLCanvasElement:document.createElement('canvas');
    canvas.width=256;canvas.height=256;
    if(typeof document!=='undefined')drawCollectibleArt(canvas.getContext('2d')!,kind,256);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    texture.minFilter=THREE.LinearMipmapLinearFilter;texture.magFilter=THREE.LinearFilter;
    this.cachedTextures.set(key,texture);return texture;
  }

  /** Every UI surface samples the same cached high-resolution artwork. */
  static getCollectibleCanvas(id:string,size=32):HTMLCanvasElement {
    const canvas=document.createElement('canvas');canvas.width=size*2;canvas.height=size*2;
    canvas.style.width=size+'px';canvas.style.height=size+'px';
    const ctx=canvas.getContext('2d')!;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
    const art=this.getCollectibleTexture(id).image;
    if(art)ctx.drawImage(art,0,0,canvas.width,canvas.height);else drawCollectibleArt(ctx,id,canvas.width);
    return canvas;
  }

  static getTrackTexture(color1: string, color2: string): THREE.CanvasTexture {
    const key = `track_${color1}_${color2}`;
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, 64, 64);

    ctx.fillStyle = color2;
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillRect(32, 32, 32, 32);

    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * Glossy monkey ball sphere texture with crystal-clear translucent body and
   * character-customized equatorial stripe (Adri: Rojo, Misi: Rosa, Pao: Lila, Rony: Amarillo anaranjado).
   */
  static getSphereTexture(charId?: string): THREE.CanvasTexture {
    const key = `sphere_${charId ?? "default"}`;
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(4,2);

    ctx.clearRect(0, 0, 128, 128);

    // Ultra-clear glass body with subtle glossy sheen
    // Independent of longitude: no visible seam as the sphere rolls.
    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.16)");
    grad.addColorStop(0.3, "rgba(255, 255, 255, 0.02)");
    grad.addColorStop(0.7, "rgba(200, 235, 255, 0.04)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0.14)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    // Custom stripe color per character:
    // Adri: Rojo vibrante
    // Misi: Rosa radiante
    // Pao: Lila / Púrpura
    // Rony: Amarillo anaranjado
    let stripeMain = "rgba(229, 57, 53, 0.78)"; // Adri / Default Red
    let stripeCore = "rgba(255, 82, 82, 0.95)";

    switch (charId) {
      case "misi":
        stripeMain = "rgba(236, 72, 153, 0.78)"; // Rosa
        stripeCore = "rgba(244, 114, 182, 0.95)";
        break;
      case "pao":
        stripeMain = "rgba(168, 85, 247, 0.78)"; // Lila
        stripeCore = "rgba(192, 132, 252, 0.95)";
        break;
      case "rony":
        stripeMain = "rgba(245, 158, 11, 0.80)"; // Amarillo anaranjado
        stripeCore = "rgba(251, 191, 36, 0.95)";
        break;
      case "adri":
      default:
        stripeMain = "rgba(229, 57, 53, 0.78)"; // Rojo
        stripeCore = "rgba(255, 82, 82, 0.95)";
        break;
    }

    // Main equatorial stripe band
    ctx.fillStyle = stripeMain;
    ctx.fillRect(0, 56, 128, 16);

    // Glowing vibrant core center line
    ctx.fillStyle = stripeCore;
    ctx.fillRect(0, 60, 128, 8);

    // Crisp white border rings (top & bottom)
    ctx.fillStyle = "rgba(255, 255, 255, 0.90)";
    ctx.fillRect(0, 54, 128, 2);
    ctx.fillRect(0, 72, 128, 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * Grass top texture for World 1 platforms (lush green grass).
   */
  static getGrassTopTexture(): THREE.CanvasTexture {
    const cached = this.cachedTextures.get("grass_top");
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    // Base lush grass green
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(0, 0, 64, 64);

    // Subtle checkered pattern for depth
    ctx.fillStyle = "#43a047";
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillRect(32, 32, 32, 32);

    // Pixel grass blade highlights
    ctx.fillStyle = "#81c784";
    for (let x = 4; x < 64; x += 8) {
      for (let y = 4; y < 64; y += 8) {
        if ((x + y) % 16 === 0) {
          ctx.fillRect(x, y, 2, 4);
          ctx.fillRect(x + 2, y + 2, 2, 2);
        }
      }
    }

    // Grass border outline
    ctx.strokeStyle = "rgba(27, 94, 32, 0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    this.cachedTextures.set("grass_top", texture);
    return texture;
  }

  /**
   * Dirt side texture for World 1 platforms with top grass fringe.
   */
  static getGrassSideTexture(): THREE.CanvasTexture {
    const cached = this.cachedTextures.get("grass_side");
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    // Base rich dirt brown
    ctx.fillStyle = "#6d4c41";
    ctx.fillRect(0, 0, 64, 64);

    // Dirt pebbles and variation
    ctx.fillStyle = "#5d4037";
    ctx.fillRect(8, 28, 8, 8);
    ctx.fillRect(36, 40, 10, 8);
    ctx.fillRect(20, 48, 6, 6);
    ctx.fillStyle = "#8d6e63";
    ctx.fillRect(48, 24, 6, 6);
    ctx.fillRect(16, 36, 6, 6);

    // Top grass layer
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(0, 0, 64, 16);

    // Overhanging grass blades (wavy drip pattern)
    ctx.fillStyle = "#43a047";
    for (let x = 0; x < 64; x += 8) {
      const h = x % 16 === 0 ? 12 : 7;
      ctx.fillRect(x, 16, 6, h);
    }
    ctx.fillStyle = "#81c784";
    ctx.fillRect(0, 0, 64, 3);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    this.cachedTextures.set("grass_side", texture);
    return texture;
  }

  /**
   * Dirt bottom texture for World 1 platforms.
   */
  static getDirtTexture(): THREE.CanvasTexture {
    const cached = this.cachedTextures.get("dirt_bottom");
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = "#5d4037";
    ctx.fillRect(0, 0, 64, 64);

    ctx.fillStyle = "#4e342e";
    ctx.fillRect(10, 12, 12, 10);
    ctx.fillRect(40, 36, 14, 12);

    ctx.fillStyle = "#6d4c41";
    ctx.fillRect(28, 22, 10, 8);
    ctx.fillRect(8, 44, 8, 8);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    this.cachedTextures.set("dirt_bottom", texture);
    return texture;
  }

  /**
   * Countryside and River panoramic background for World 1.
   * Features rolling green hills, a winding sparkling blue river, and bright sunny sky with fluffy clouds.
   */
  static getCountrysideRiverBackground(): THREE.CanvasTexture {
    const cached = this.cachedTextures.get("bg_countryside_river");
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // 1. Bright sunny sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 300);
    skyGrad.addColorStop(0, "#42a5f5"); // Deep sky blue
    skyGrad.addColorStop(0.5, "#90caf9"); // Soft azure
    skyGrad.addColorStop(1, "#e1f5fe"); // Horizon glow
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 1024, 300);

    // 2. Fluffy stylized Nintendo DS clouds
    const drawCloud = (cx: number, cy: number, scale: number) => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
      ctx.beginPath();
      ctx.arc(cx, cy, 26 * scale, 0, Math.PI * 2);
      ctx.arc(cx + 25 * scale, cy - 8 * scale, 34 * scale, 0, Math.PI * 2);
      ctx.arc(cx + 55 * scale, cy, 28 * scale, 0, Math.PI * 2);
      ctx.arc(cx + 80 * scale, cy + 4 * scale, 20 * scale, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCloud(120, 80, 1.1);
    drawCloud(420, 110, 0.8);
    drawCloud(720, 75, 1.2);
    drawCloud(950, 120, 0.7);

    // 3. Distant green rolling hills
    ctx.fillStyle = "#81c784";
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.bezierCurveTo(200, 230, 350, 280, 520, 240);
    ctx.bezierCurveTo(680, 200, 840, 260, 1024, 230);
    ctx.lineTo(1024, 512);
    ctx.lineTo(0, 512);
    ctx.fill();

    // 4. Midground lush grassy meadows
    ctx.fillStyle = "#4caf50";
    ctx.beginPath();
    ctx.moveTo(0, 290);
    ctx.bezierCurveTo(240, 260, 400, 330, 640, 280);
    ctx.bezierCurveTo(800, 250, 960, 310, 1024, 275);
    ctx.lineTo(1024, 512);
    ctx.lineTo(0, 512);
    ctx.fill();

    // 5. Winding River through the countryside valley
    ctx.fillStyle = "#0288d1";
    ctx.beginPath();
    ctx.moveTo(480, 270);
    ctx.bezierCurveTo(460, 330, 360, 380, 280, 512);
    ctx.lineTo(440, 512);
    ctx.bezierCurveTo(510, 420, 530, 340, 540, 270);
    ctx.closePath();
    ctx.fill();

    // River sparkling highlights & reflections
    ctx.strokeStyle = "#81d4fa";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(490, 295);
    ctx.bezierCurveTo(475, 340, 400, 400, 340, 512);
    ctx.stroke();

    ctx.strokeStyle = "#e1f5fe";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(505, 320);
    ctx.bezierCurveTo(480, 380, 430, 440, 390, 512);
    ctx.stroke();

    // 6. Foreground meadow hillocks
    ctx.fillStyle = "#388e3c";
    ctx.beginPath();
    ctx.moveTo(0, 400);
    ctx.bezierCurveTo(150, 360, 250, 440, 320, 512);
    ctx.lineTo(0, 512);
    ctx.fill();

    ctx.fillStyle = "#2e7d32";
    ctx.beginPath();
    ctx.moveTo(460, 512);
    ctx.bezierCurveTo(580, 390, 780, 380, 1024, 390);
    ctx.lineTo(1024, 512);
    ctx.fill();

    // Stylized trees on hills
    const drawTree = (tx: number, ty: number) => {
      ctx.fillStyle = "#5d4037";
      ctx.fillRect(tx - 3, ty, 6, 14);
      ctx.fillStyle = "#2e7d32";
      ctx.beginPath();
      ctx.arc(tx, ty - 8, 12, 0, Math.PI * 2);
      ctx.arc(tx - 6, ty - 4, 10, 0, Math.PI * 2);
      ctx.arc(tx + 6, ty - 4, 10, 0, Math.PI * 2);
      ctx.fill();
    };
    drawTree(160, 340);
    drawTree(200, 355);
    drawTree(720, 360);
    drawTree(840, 345);
    drawTree(890, 355);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    this.cachedTextures.set("bg_countryside_river", texture);
    return texture;
  }

  /**
   * Generates high-definition canvas texture for Supermercados DÍA signage.
   * Features the classic corporate red background (#d9251d), white "Día" wordmark,
   * discount "%" emblem and "SUPERMERCADO" banner.
   */
  static getDiaLogoTexture(): THREE.CanvasTexture {
    const key = "dia_logo_sign";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Corporate DÍA Red Background with subtle glossy bevel
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 256);
    bgGrad.addColorStop(0, "#e5251e");
    bgGrad.addColorStop(1, "#c01712");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 256);

    // Outer white border
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(8, 8, 496, 240);

    // White rounded card in center-left for "Día"
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(30, 32, 280, 140, 24);
    ctx.fill();

    // Stylized bold red "Día" text
    ctx.fillStyle = "#d9251d";
    ctx.font = "900 102px 'Arial Black', Impact, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Día", 170, 102);

    // Discount percentage circle badge on the right
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(400, 102, 65, 0, Math.PI * 2);
    ctx.fill();

    // "%" in bold corporate red
    ctx.fillStyle = "#d9251d";
    ctx.font = "900 78px 'Arial Black', sans-serif";
    ctx.fillText("%", 400, 105);

    // Subtitle yellow/white ribbon: "SUPERMERCADO"
    ctx.fillStyle = "#ffeb3b";
    ctx.font = "900 24px 'Arial Black', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SUPERMERCADO", 256, 212);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * Supermercado Carrefour Logo & Sign Texture (M4-N3-E7 Carrefour)
   * Iconic Carrefour emblem: Left red arrow and Right blue arrow forming the white "C" in negative space,
   * plus crisp "Carrefour" typography.
   */
  static getCarrefourLogoTexture(): THREE.CanvasTexture {
    const key = "carrefour_logo_sign";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Clean white glossy background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 256);
    bgGrad.addColorStop(0, "#ffffff");
    bgGrad.addColorStop(1, "#f1f5f9");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 256);

    // Carrefour blue & red border
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#004e9a";
    ctx.strokeRect(6, 6, 500, 244);

    // Carrefour Diamond Logo (Negative space "C" in center)
    const cx = 110;
    const cy = 115;
    const size = 58;

    // Left Red Curved Triangle
    ctx.fillStyle = "#e5251e";
    ctx.beginPath();
    ctx.moveTo(cx - size, cy);
    ctx.lineTo(cx - 10, cy - size);
    ctx.quadraticCurveTo(cx - 28, cy, cx - 10, cy + size);
    ctx.closePath();
    ctx.fill();

    // Right Blue Curved Arrow
    ctx.fillStyle = "#004e9a";
    ctx.beginPath();
    ctx.moveTo(cx + size, cy);
    ctx.lineTo(cx + 10, cy - size);
    ctx.quadraticCurveTo(cx + 28, cy, cx + 10, cy + size);
    ctx.closePath();
    ctx.fill();

    // Bold "Carrefour" Text
    ctx.fillStyle = "#004e9a";
    ctx.font = "900 64px 'Arial Black', Impact, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Carrefour", 200, 115);

    // Subtitle ribbon: "HIPERMERCADO · POKÉMON CORNER"
    ctx.fillStyle = "#e5251e";
    ctx.font = "900 19px 'Arial Black', sans-serif";
    ctx.fillText("HIPERMERCADO · POKÉMON CORNER", 60, 215);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * Sobres Pokémon (Pokémon Booster Packs) Foil Sachet Texture (M4-N3-E7 Carrefour)
   * 4 vibrant collector pack editions:
   *  0: Charizard Red (Fuego)
   *  1: Blastoise Blue (Agua)
   *  2: Venusaur Green (Planta)
   *  3: Pikachu Gold (Eléctrico)
   */
  static getPokemonBoosterTexture(variant: number = 0): THREE.CanvasTexture {
    const packIdx = typeof variant === "number" && !isNaN(variant) ? ((Math.floor(variant) % 4) + 4) % 4 : 0;
    const key = `pokemon_booster_pack_${packIdx}`;
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Palette per edition
    const palettes = [
      { main: "#b71c1c", accent: "#ff1744", glow: "#ffca28", text: "CHARIZARD ED.", iconColor: "#ff7043" },
      { main: "#0d47a1", accent: "#00b0ff", glow: "#80d8ff", text: "BLASTOISE ED.", iconColor: "#29b6f6" },
      { main: "#1b5e20", accent: "#00e676", glow: "#b9f6ca", text: "VENUSAUR ED.", iconColor: "#66bb6a" },
      { main: "#e65100", accent: "#ffd600", glow: "#ffffff", text: "PIKACHU ED.", iconColor: "#ffee58" }
    ];
    const p = palettes[packIdx];

    // 1. Metallic Foil Holographic Gradient Background
    const foilGrad = ctx.createLinearGradient(0, 0, 256, 512);
    foilGrad.addColorStop(0, p.accent);
    foilGrad.addColorStop(0.35, p.main);
    foilGrad.addColorStop(0.70, p.accent);
    foilGrad.addColorStop(1, p.main);
    ctx.fillStyle = foilGrad;
    ctx.fillRect(0, 0, 256, 512);

    // Diagonal Holographic Sheen Streaks
    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    for (let x = -100; x < 350; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 50, 0);
      ctx.lineTo(x + 130, 512);
      ctx.lineTo(x + 80, 512);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Top & Bottom Metallic Crimped Foil Ribbons (Sachet Seals)
    const drawCrimpedFoil = (y: number, h: number) => {
      const grad = ctx.createLinearGradient(0, y, 0, y + h);
      grad.addColorStop(0, "#d1d5db");
      grad.addColorStop(0.5, "#9ca3af");
      grad.addColorStop(1, "#4b5563");
      ctx.fillStyle = grad;
      ctx.fillRect(0, y, 256, h);

      // Serrated vertical crimp lines
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let x = 4; x < 256; x += 8) {
        ctx.fillRect(x, y, 2, h);
      }
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      for (let x = 6; x < 256; x += 8) {
        ctx.fillRect(x, y, 2, h);
      }
    };
    drawCrimpedFoil(0, 28);
    drawCrimpedFoil(484, 28);

    // 3. Official-Style "POKÉMON" Logo Header
    ctx.save();
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 10;
    ctx.textAlign = "center";

    // Dark blue outer stroke
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#1b3a6e";
    ctx.font = "900 36px 'Arial Black', sans-serif";
    ctx.strokeText("POKÉMON", 128, 70);

    // Golden Yellow text fill
    ctx.fillStyle = "#ffcb05";
    ctx.fillText("POKÉMON", 128, 70);

    // Inner bright yellow highlight
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fffde7";
    ctx.strokeText("POKÉMON", 128, 70);
    ctx.restore();

    // "TRADING CARD GAME" Banner
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 13px 'Arial Black', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("TRADING CARD GAME", 128, 96);

    // 4. Central Creature Emblem Badge / Holographic Aura
    ctx.save();
    const auraGrad = ctx.createRadialGradient(128, 250, 20, 128, 250, 105);
    auraGrad.addColorStop(0, p.glow);
    auraGrad.addColorStop(0.6, p.iconColor);
    auraGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(128, 250, 105, 0, Math.PI * 2);
    ctx.fill();

    // Pokeball / Emblem Silhouette in center
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.beginPath();
    ctx.arc(128, 250, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = p.main;
    ctx.beginPath();
    ctx.arc(128, 250, 60, 0, Math.PI, true);
    ctx.fill();

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(68, 246, 120, 8);
    ctx.beginPath();
    ctx.arc(128, 250, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(128, 250, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Edition Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 20px 'Arial Black', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(p.text, 128, 385);

    // Holo sparkle stars
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("✦", 45, 140);
    ctx.fillText("✦", 215, 175);
    ctx.fillText("✦", 38, 330);
    ctx.fillText("✦", 220, 345);

    // Bottom Sachet Badge: "10 CARDS / CARTAS"
    ctx.fillStyle = "#ffcb05";
    ctx.font = "900 14px 'Arial Black', sans-serif";
    ctx.fillText("10 ADITIONAL CARDS · CARTAS", 128, 430);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("SUPERMERCADO CARREFOUR EXCLUSIVE", 128, 452);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * Spanish Dulce de Membrillo Jelly Texture (M4-N3-E2 Alba de Tormes)
   * Deep ruby-amber quince jelly with crystalline sugar sparkles.
   */
  static getMembrilloTexture(): THREE.CanvasTexture {
    const key = "dulce_membrillo_texture";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Rich translucent ruby-caramel gelatinous gradient
    const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 130);
    grad.addColorStop(0, "#c62828");
    grad.addColorStop(0.7, "#8e0000");
    grad.addColorStop(1, "#5f0909");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Granulated crystalline sugar sparkles across surface
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    for (let i = 0; i < 280; i++) {
      const sx = Math.floor((Math.sin(i * 12.3) * 0.5 + 0.5) * 256);
      const sy = Math.floor((Math.cos(i * 17.7) * 0.5 + 0.5) * 256);
      const sz = (i % 3 === 0) ? 2 : 1;
      ctx.fillRect(sx, sy, sz, sz);
    }

    // Outer candied cut bevel border
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(255, 235, 59, 0.35)";
    ctx.strokeRect(4, 4, 248, 248);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * Carril Bici (Madrid Red Bike Lane) Texture (M4-N3-E9 Parque Aluche)
   * Terracotta red asphalt with white lane border and painted bicycle silhouettes.
   */
  static getBikeLaneTexture(): THREE.CanvasTexture {
    const key = "carril_bici_red_lane";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Madrid terracotta bike lane asphalt
    ctx.fillStyle = "#b71c1c";
    ctx.fillRect(0, 0, 512, 512);

    // Subtle asphalt grain
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    for (let y = 0; y < 512; y += 4) {
      for (let x = (y % 8 === 0 ? 0 : 2); x < 512; x += 4) {
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // White continuous side lane demarcations
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(16, 0, 14, 512);
    ctx.fillRect(482, 0, 14, 512);

    // White dashed center line
    for (let y = 30; y < 512; y += 90) {
      ctx.fillRect(250, y, 12, 50);
    }

    // White Painted Bicycle Silhouettes
    const drawBicycleSymbol = (cy: number) => {
      ctx.save();
      ctx.strokeStyle = "#ffffff";
      ctx.fillStyle = "#ffffff";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";

      // Wheels
      ctx.beginPath();
      ctx.arc(180, cy, 32, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(332, cy, 32, 0, Math.PI * 2);
      ctx.stroke();

      // Frame
      ctx.beginPath();
      ctx.moveTo(180, cy);
      ctx.lineTo(235, cy);
      ctx.lineTo(290, cy - 36);
      ctx.lineTo(215, cy - 36);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(235, cy);
      ctx.lineTo(215, cy - 36);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(332, cy);
      ctx.lineTo(290, cy - 36);
      ctx.stroke();

      // Handlebars
      ctx.beginPath();
      ctx.moveTo(290, cy - 36);
      ctx.lineTo(285, cy - 54);
      ctx.lineTo(305, cy - 54);
      ctx.stroke();

      // Saddle
      ctx.beginPath();
      ctx.moveTo(205, cy - 42);
      ctx.lineTo(230, cy - 42);
      ctx.stroke();
      ctx.restore();
    };

    drawBicycleSymbol(140);
    drawBicycleSymbol(390);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * Water Geyser / Hydro Jet Spray Texture (M4-N3-E10 Lago)
   * High-pressure foaming aquatic column with upward spray particles.
   */
  static getWaterGeyserTexture(): THREE.CanvasTexture {
    const key = "water_geyser_spray_texture";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Upward hydraulic spray gradient (Deep aqua at base to frothy white mist at top)
    const grad = ctx.createLinearGradient(0, 512, 0, 0);
    grad.addColorStop(0, "#0288d1");
    grad.addColorStop(0.35, "#29b6f6");
    grad.addColorStop(0.70, "#b3e5fc");
    grad.addColorStop(1, "#ffffff");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 512);

    // Vertical hydro-jet streaks
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    for (let x = 10; x < 256; x += 18) {
      const sw = (x % 36 === 0) ? 6 : 3;
      ctx.fillRect(x, 0, sw, 512);
    }

    // Foaming mist bubbles
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    for (let i = 0; i < 220; i++) {
      const bx = Math.floor((Math.sin(i * 19.3) * 0.5 + 0.5) * 256);
      const by = Math.floor((Math.cos(i * 23.7) * 0.5 + 0.5) * 512);
      const br = (i % 4 === 0) ? 5 : 2.5;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  // -------------------------------------------------------------------------
  // WORLD 4 LEVEL 4 (ISLAZUL) CUSTOM TEXTURES
  // -------------------------------------------------------------------------

  /**
   * Official Centro Comercial Islazul Signboard Texture.
   * Features vanguard cyan/blue waves, modern typography and vibrant glow.
   */
  static getIslazulLogoTexture(): THREE.CanvasTexture {
    const key = "islazul_mall_logo";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    ctx.fillStyle = "#145c86";
    ctx.fillRect(0, 0, 512, 256);
    ctx.font = "900 112px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff9f0";
    ctx.fillText("islaZul", 256, 128, 382);
    const colors = ["#f3a632", "#fa7444", "#a7c957", "#55bcd2"];
    for (let i = 0; i < colors.length; i++) {
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.arc(226 + i * 20, 204, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /** Soft white bread crumb, also used as the base of the filled surfaces. */
  static getRodillaFillingTexture(filling: string): THREE.CanvasTexture {
    const key = "rodilla_filling_" + filling;
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const palette = filling === "ensaladilla"
      ? ["#f6e5ab", "#dd8749", "#7c974f", "#fff0c8"]
      : filling === "tuna_tomato"
      ? ["#ca9474", "#b7402c", "#e26a4f", "#efd0ad"]
      : ["#efc683", "#c78370", "#e5a395", "#ffe5a0"];

    if (filling) {
      ctx.drawImage(this.getRodillaFillingTexture("").image, 0, 0);
    } else {
      let seed = 18371;
      const random = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      const pixels = ctx.createImageData(512, 512);
      for (let y = 0; y < 512; y++) {
        for (let x = 0; x < 512; x++) {
          const variation = 3 * Math.sin(x * 0.075 + Math.cos(y * 0.046))
            + 3 * Math.cos(y * 0.083 + x * 0.037) + (random() - 0.5) * 19;
          const offset = (y * 512 + x) * 4;
          pixels.data[offset] = 246 + variation;
          pixels.data[offset + 1] = 226 + variation;
          pixels.data[offset + 2] = 191 + variation;
          pixels.data[offset + 3] = 255;
        }
      }
      ctx.putImageData(pixels, 0, 0);

      for (let i = 0; i < 2200; i++) {
        const x = random() * 512;
        const y = random() * 512;
        const radius = 0.45 + Math.pow(random(), 3) * 4.8;
        const aspect = 0.42 + random() * 0.5;
        const angle = random() * Math.PI;
        ctx.fillStyle = "#fff5de9c";
        ctx.beginPath();
        ctx.ellipse(x, y + radius * 0.34, radius * 1.08, radius * aspect, angle, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = radius > 2.2 ? "#9b6e4770" : "#ad835543";
        ctx.beginPath();
        ctx.ellipse(x, y, radius, radius * aspect, angle, 0, Math.PI * 2);
        ctx.fill();
        if (radius > 2.2) {
          ctx.fillStyle = "#79523360";
          ctx.beginPath();
          ctx.ellipse(x, y - radius * 0.10, radius * 0.66, radius * aspect * 0.58, angle, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    if (filling) {
      ctx.beginPath();
      for (let y = 0; y <= 512; y += 4) {
        const x = 184 + 5 * Math.sin(y / 16) + 3 * Math.cos(y / 6);
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      for (let y = 512; y >= 0; y -= 4) {
        ctx.lineTo(328 + 5 * Math.sin(y / 18) + 3 * Math.cos(y / 7), y);
      }
      ctx.closePath();
      ctx.save();
      ctx.clip();
      ctx.fillStyle = palette[0];
      ctx.fillRect(170, 0, 170, 512);
      for (let i = 0; i < 460; i++) {
        const x = 174 + (i * 61.39) % 166;
        const y = (i * 73.51) % 512;
        ctx.fillStyle = palette[1 + i % 3];
        const slice = filling === "turkey_cheese";
        ctx.beginPath();
        ctx.ellipse(x, y, (slice ? 9 : 3) + i % 7, (slice ? 2 : 3) + i % 4, Math.sin(i) * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  static getQuesaritoTexture(cutEnd: boolean): THREE.CanvasTexture {
    const key = cutEnd ? "quesarito_cut_end" : "quesarito_toasted_tortilla";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;
    const canvas = document.createElement("canvas");
    canvas.width = cutEnd ? 256 : 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = "#eac28a";
    ctx.fillRect(0, 0, w, h);
    if (!cutEnd) {
      const seam = ctx.createLinearGradient(w * 0.33, 0, w * 0.43, 0);
      seam.addColorStop(0, "#94512700");
      seam.addColorStop(0.48, "#94512799");
      seam.addColorStop(0.62, "#ffe0aecc");
      seam.addColorStop(1, "#ffe0ae00");
      ctx.fillStyle = seam;
      ctx.fillRect(w * 0.33, 0, w * 0.10, h);
    }
    if (cutEnd) {
      for (const [radius, color] of [[115, "#b37b45"], [109, "#f6d99e"], [98, "#e7a737"], [86, "#80513a"]] as const) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(128, 128, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const ingredients = ["#bd8b52", "#573727", "#a95d3a", "#f3c365", "#f7e7ba", "#8f9a53"];
    for (let i = 0; i < (cutEnd ? 540 : 1050); i++) {
      const x = (i * 137.51) % w;
      const y = (i * 91.71) % h;
      if (cutEnd && Math.hypot(x - 128, y - 128) > 84) continue;
      const rx = 1.2 + i % (cutEnd ? 6 : 12);
      const ry = 1 + i % 5;
      if (cutEnd) {
        ctx.fillStyle = ingredients[i % ingredients.length];
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, Math.sin(i), 0, Math.PI * 2);
        ctx.fill();
      } else {
        const offsets = x < rx ? [0, w] : x > w - rx ? [0, -w] : [0];
        for (const offset of offsets) {
          const center = x + offset;
          const toast = ctx.createRadialGradient(center, y, 0, center, y, rx);
          toast.addColorStop(0, i % 5 ? "#a25c32a0" : "#fff2c7b0");
          toast.addColorStop(1, "#a25c3200");
          ctx.fillStyle = toast;
          ctx.fillRect(center - rx, y - rx, rx * 2, rx * 2);
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  static getVivaGymTexture(): THREE.CanvasTexture {
    const key = "vivagym_treadmill_belt";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Textured black rubber base
    ctx.fillStyle = "#111418";
    ctx.fillRect(0, 0, 512, 512);

    // Treadmill grip diamond pattern
    ctx.strokeStyle = "#1e232a";
    ctx.lineWidth = 2;
    for (let x = -512; x < 1024; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 512, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, 512);
      ctx.lineTo(x + 512, 0);
      ctx.stroke();
    }

    // VivaGym-style orange safety border rails.
    ctx.fillStyle = "#f47b20";
    ctx.fillRect(7, 0, 4, 512);
    ctx.fillRect(501, 0, 4, 512);

    // Dynamic Chevron Speed Indicators
    ctx.fillStyle = "rgba(244, 123, 32, 0.48)";
    for (let y = 60; y < 512; y += 120) {
      ctx.beginPath();
      ctx.moveTo(256, y - 24);
      ctx.lineTo(296, y + 16);
      ctx.lineTo(256, y + 4);
      ctx.lineTo(216, y + 16);
      ctx.closePath();
      ctx.fill();
    }

    // High contrast orange athletic mark.
    ctx.save();
    ctx.translate(256, 256);
    ctx.rotate(-Math.PI / 2);
    ctx.font = "900 48px 'Arial Black', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#f47b20";
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#f47b20";
    ctx.fillText("VIVAGYM", 0, 0);
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * Funko Pop Box Collector Packaging Front Texture.
   */
  static getFunkoBoxTexture(series: "dragon_ball" | "harry_potter" | "disney" = "dragon_ball"): THREE.CanvasTexture {
    const key = `funko_pop_box_art_${series}`;
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Clean white and sky blue collector box
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 512, 512);

    // Series art varies per box while keeping a collector-toy packaging layout.
    const theme = {
      dragon_ball: { name: "DRAGON BALL", hero: "GOKU", color: "#ef6c00", accent: "#1565c0", skin: "#ffd8ad", hair: "#171717", outfit: "#e53935", icon: "悟" },
      harry_potter: { name: "WIZARDING WORLD", hero: "HOGWARTS", color: "#5d4037", accent: "#c9a227", skin: "#f2c9a5", hair: "#3e2723", outfit: "#263238", icon: "H" },
      disney: { name: "DISNEY CLASSICS", hero: "MICKEY", color: "#263238", accent: "#f5c542", skin: "#f3c6a4", hair: "#171717", outfit: "#c62828", icon: "D" }
    }[series];
    ctx.fillStyle = theme.color;
    ctx.fillRect(0, 0, 512, 100);

    // POP! Vinyl Badge
    ctx.fillStyle = theme.accent;
    ctx.beginPath();
    ctx.roundRect(24, 18, 120, 64, 12);
    ctx.fill();
    ctx.font = "900 42px 'Arial Black', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("POP!", 84, 50);

    // Collector Number Badge
    ctx.fillStyle = "#fff8e1";
    ctx.beginPath();
    ctx.arc(440, 50, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "900 32px 'Arial Black', sans-serif";
    ctx.fillStyle = "#1a237e";
    ctx.fillText(String(401 + ["dragon_ball", "harry_potter", "disney"].indexOf(series)), 440, 50);

    // Clear Vinyl Window (simulated deep showcase interior)
    const winGrad = ctx.createLinearGradient(0, 110, 0, 410);
    winGrad.addColorStop(0, theme.accent);
    winGrad.addColorStop(1, "#101827");
    ctx.fillStyle = winGrad;
    ctx.beginPath();
    ctx.roundRect(40, 115, 432, 290, 16);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#81d4fa";
    ctx.stroke();

    // Stylized Toy Silhouette inside box
    ctx.fillStyle = "rgba(220, 239, 255, 0.22)";
    ctx.fillRect(50, 125, 412, 270);
    // Stylized character silhouette, coordinated with each franchise-inspired series.
    ctx.fillStyle = theme.hair;
    ctx.beginPath();
    ctx.arc(256, 205, 66, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = theme.skin;
    ctx.beginPath();
    ctx.arc(256, 218, 54, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#151515";
    ctx.beginPath();
    ctx.ellipse(232, 220, 8, 13, 0, 0, Math.PI * 2);
    ctx.ellipse(280, 220, 8, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = theme.outfit;
    ctx.beginPath();
    ctx.roundRect(211, 274, 90, 92, 18);
    ctx.fill();
    ctx.fillStyle = theme.accent;
    ctx.beginPath();
    ctx.arc(256, 320, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 22px Arial";
    ctx.textAlign = "center";
    ctx.fillText(theme.icon, 256, 328);
    // Window glare and folded carton edge details.
    ctx.fillStyle = "rgba(255,255,255,0.23)";
    ctx.beginPath();
    ctx.moveTo(405, 125); ctx.lineTo(458, 125); ctx.lineTo(305, 395); ctx.lineTo(272, 395);
    ctx.closePath(); ctx.fill();

    // Bottom Character Nameplate Banner
    ctx.fillStyle = theme.color;
    ctx.fillRect(0, 420, 512, 92);
    ctx.font = "900 36px 'Arial Black', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(theme.name, 256, 452);
    ctx.font = "700 24px Arial";
    ctx.fillStyle = "#fff3c4";
    ctx.fillText(theme.hero, 256, 487);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * Primark Vibrant Brand Header Texture.
   */
  static getPrimarkLogoTexture(): THREE.CanvasTexture {
    const key = "primark_brand_logo";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;

    // Primark iconic cyan color
    ctx.fillStyle = "#00a8e8";
    ctx.fillRect(0, 0, 512, 256);

    // Border highlight
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(8, 8, 496, 240);

    // Crisp white bold "PRIMARK" text
    ctx.font = "900 86px 'Arial Black', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PRIMARK", 256, 128);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * Yelmo Cines Colossal Cinema Screen Blockbuster Texture.
   */
  static getYelmoScreenTexture(): THREE.CanvasTexture {
    const key = "yelmo_cines_screen_art";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 288;
    const ctx = canvas.getContext("2d")!;

    // Premium dark cinema canvas with restrained light and a single title.
    const grad = ctx.createLinearGradient(0, 0, 512, 288);
    grad.addColorStop(0, "#10131c");
    grad.addColorStop(0.5, "#24324a");
    grad.addColorStop(1, "#080a10");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 288);
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 3;
    ctx.strokeRect(14, 14, 484, 260);
    ctx.font = "900 54px 'Arial Black', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#f47b20";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("MEGA RAMP", 256, 151);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * The Good Burger (TGB) Vintage Chalkboard Logo Texture.
   */
  static getTGBLogoTexture(): THREE.CanvasTexture {
    const key = "tgb_burger_logo";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;

    // Black chalkboard circle
    ctx.fillStyle = "#1e1e1e";
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fill();

    // Gold outer ring
    ctx.strokeStyle = "#e6af2e";
    ctx.lineWidth = 6;
    ctx.stroke();

    // Bold "TGB"
    ctx.font = "900 58px 'Arial Black', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("TGB", 128, 105);

    // "THE GOOD BURGER"
    ctx.font = "700 16px 'Arial Black', sans-serif";
    ctx.fillStyle = "#e6af2e";
    ctx.fillText("THE GOOD BURGER", 128, 162);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  /**
   * Classic Spanish Rodilla Artisan Sandwiches Crest Texture.
   */
  static getRodillaLogoTexture(): THREE.CanvasTexture {
    const key = "rodilla_sandwiches_logo";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;

    // Cream parchment background
    ctx.fillStyle = "#fff8e1";
    ctx.fillRect(0, 0, 256, 256);

    // Burgundy red border
    ctx.strokeStyle = "#8b0000";
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 236, 236);

    // Red banner
    ctx.fillStyle = "#8b0000";
    ctx.fillRect(20, 85, 216, 75);

    // White bold "RODILLA"
    ctx.font = "900 38px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("RODILLA", 128, 122);

    // Subtitle
    ctx.font = "700 14px sans-serif";
    ctx.fillStyle = "#8b0000";
    ctx.fillText("SANDWICHES DESDE 1939", 128, 190);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  // =========================================================================
  // THEMED WORLD PLATFORM & RAMP BLOCKS (8 WORLDS)
  // =========================================================================

  /**
   * Returns the complete themed block texture set for a world and level.
   * Includes top, sideX, sideZ, bottom, and emissive colors.
   */
  static getWorldBlockSet(worldId: number, levelId: number = 1): WorldBlockSet {
    switch (worldId) {
      case 1:
        return this.getVillamantaBlockSet();
      case 2:
        return this.getAlicanteBlockSet();
      case 3:
        return this.getMesegalBlockSet();
      case 4:
        return this.getCarabanchelBlockSet();
      case 5:
        return this.getAsturiasBlockSet();
      case 6:
        return this.getLondonBlockSet();
      case 7:
        return this.getJapanBlockSet(levelId);
      case 8:
        return this.getNorwayBlockSet();
      default:
        return this.getVillamantaBlockSet();
    }
  }

  // --- COLORING PAGE A4 DRAWING TEXTURES (M3-N2-E7 DIBUJOS) ---
  static getColoringPageTexture(sheetIndex: number = 1): THREE.Texture {
    const pageNum = ((((sheetIndex - 1) % 3) + 3) % 3) + 1;
    const key = `coloring_page_${pageNum}`;
    const cached = this.cachedColoringTextures.get(key);
    if (cached) return cached;

    if (typeof document === "undefined") {
      const tex = new THREE.CanvasTexture({ width: 64, height: 64 } as any);
      this.cachedColoringTextures.set(key, tex);
      return tex;
    }

    const fallbackCanvas = this.createProceduralColoringPageCanvas(pageNum);
    const url = assetUrl(`/assets/drawings/coloring_page_${pageNum}.jpg`);

    // Always visible and fixed-size; asynchronous uploads never resize GPU storage.
    const texture=new THREE.CanvasTexture(fallbackCanvas);
    let resolveReady:()=>void=()=>{};
    this.cachedColoringReady.set(key,new Promise<void>(resolve=>{resolveReady=resolve;}));
    this.textureLoader.load(url,source=>{
      const context=fallbackCanvas.getContext('2d')!;
      context.clearRect(0,0,fallbackCanvas.width,fallbackCanvas.height);
      context.drawImage(source.image,0,0,fallbackCanvas.width,fallbackCanvas.height);
      texture.needsUpdate=true;source.dispose();resolveReady();
    },undefined,()=>resolveReady());

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = true;

    this.cachedColoringTextures.set(key, texture);
    return texture;
  }

  static createProceduralColoringPageCanvas(pageNum: number): HTMLCanvasElement {
    if (typeof document === "undefined") {
      return { width: 512, height: 724 } as any;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 724;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // 1. Crisp white paper base
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 512, 724);

    // 2. Outer decorative margin & framing (classic coloring book format)
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 3.5;
    ctx.strokeRect(22, 22, 468, 680);
    ctx.lineWidth = 1.2;
    ctx.strokeRect(28, 28, 456, 668);

    // Corner rosettes
    const corners = [[22, 22], [490, 22], [22, 702], [490, 702]];
    for (const [cx, cy] of corners) {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.stroke();
    }

    const strokePetal = (cx: number, cy: number, ang: number, len: number, w: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-w, len * 0.35, -w, len * 0.85, 0, len);
      ctx.bezierCurveTo(w, len * 0.85, w, len * 0.35, 0, 0);
      ctx.lineWidth = 2.4;
      ctx.stroke();
      // Inner vein hatching
      ctx.beginPath();
      ctx.moveTo(0, len * 0.15);
      ctx.lineTo(0, len * 0.85);
      ctx.lineWidth = 1.0;
      ctx.stroke();
      ctx.restore();
    };

    const strokeLeaf = (x1: number, y1: number, x2: number, y2: number, w: number) => {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.hypot(dx, dy) || 1;
      const nx = -dy / dist;
      const ny = dx / dist;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(mx + nx * w, my + ny * w, x2, y2);
      ctx.quadraticCurveTo(mx - nx * w, my - ny * w, x1, y1);
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Midrib and lateral veins
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      for (let t = 0.25; t <= 0.8; t += 0.2) {
        const px = x1 + dx * t;
        const py = y1 + dy * t;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + nx * w * 0.65, py + ny * w * 0.65);
        ctx.moveTo(px, py);
        ctx.lineTo(px - nx * w * 0.65, py - ny * w * 0.65);
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
    };

    if (pageNum === 1) {
      // PAGE 1: Botanical Wild Flowers & Anemones (matching user image 1)
      const drawFlower = (cx: number, cy: number, numPetals: number, petalLen: number, petalW: number, rCenter: number) => {
        for (let i = 0; i < numPetals; i++) {
          strokePetal(cx, cy, (i * Math.PI * 2) / numPetals, petalLen, petalW);
        }
        // Center pistil / floret disc
        ctx.beginPath();
        ctx.arc(cx, cy, rCenter, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.stroke();
        // Stippled disk florets
        ctx.fillStyle = "#1a1a1a";
        for (let r = 4; r < rCenter - 2; r += 5) {
          const count = Math.floor((r * 2 * Math.PI) / 6);
          for (let j = 0; j < count; j++) {
            const a = (j * Math.PI * 2) / count;
            ctx.beginPath();
            ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      };

      // Leaves
      strokeLeaf(90, 480, 190, 410, 26);
      strokeLeaf(330, 420, 430, 490, 28);
      strokeLeaf(80, 240, 170, 200, 22);
      strokeLeaf(360, 220, 440, 250, 24);
      strokeLeaf(200, 520, 310, 550, 25);

      // Main large flower
      drawFlower(256, 340, 8, 92, 34, 25);
      // Secondary flowers
      drawFlower(140, 160, 6, 62, 24, 18);
      drawFlower(370, 165, 6, 58, 22, 16);
      drawFlower(145, 545, 7, 54, 20, 15);
      drawFlower(365, 535, 7, 60, 24, 17);

    } else if (pageNum === 2) {
      // PAGE 2: Intricate Garden Butterfly & Mandala (matching user image 2)
      const bx = 256;
      const by = 210;

      // Symmetrical butterfly wings
      for (const sign of [-1, 1]) {
        // Forewing
        ctx.beginPath();
        ctx.moveTo(bx + sign * 6, by - 12);
        ctx.bezierCurveTo(bx + sign * 60, by - 90, bx + sign * 140, by - 65, bx + sign * 125, by);
        ctx.bezierCurveTo(bx + sign * 115, by + 40, bx + sign * 50, by + 25, bx + sign * 6, by + 8);
        ctx.lineWidth = 2.8;
        ctx.stroke();

        // Forewing cell veins
        for (const [tx, ty] of [[50, -45], [95, -35], [85, 5], [45, 12]]) {
          ctx.beginPath();
          ctx.moveTo(bx + sign * 15, by - 4);
          ctx.lineTo(bx + sign * tx, by + ty);
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }

        // Hindwing
        ctx.beginPath();
        ctx.moveTo(bx + sign * 6, by + 8);
        ctx.bezierCurveTo(bx + sign * 85, by + 30, bx + sign * 110, by + 85, bx + sign * 70, by + 115);
        ctx.bezierCurveTo(bx + sign * 35, by + 120, bx + sign * 20, by + 75, bx + sign * 6, by + 35);
        ctx.lineWidth = 2.6;
        ctx.stroke();

        // Antenna
        ctx.beginPath();
        ctx.moveTo(bx + sign * 4, by - 25);
        ctx.quadraticCurveTo(bx + sign * 25, by - 55, bx + sign * 40, by - 62);
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(bx + sign * 41, by - 63, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#1a1a1a";
        ctx.fill();
      }

      // Butterfly thorax and abdomen
      ctx.beginPath();
      ctx.ellipse(bx, by - 12, 7, 16, 0, 0, Math.PI * 2);
      ctx.ellipse(bx, by + 16, 5, 22, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = 2.4;
      ctx.stroke();

      // Lower Mandala / Sunflower
      const mx = 256;
      const my = 470;
      for (let ring = 1; ring <= 3; ring++) {
        const count = ring * 8;
        const rad = ring * 32;
        for (let i = 0; i < count; i++) {
          const a = (i * Math.PI * 2) / count;
          strokePetal(mx, my, a, rad, 12 + ring * 4);
        }
      }
      ctx.beginPath();
      ctx.arc(mx, my, 22, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.stroke();

    } else {
      // PAGE 3: Herbarium Botanical Floral Study (matching user image 3)
      const gx = 180;
      const gy = 260;
      ctx.beginPath();
      const numLobes = 9;
      for (let i = 0; i <= numLobes; i++) {
        const a1 = (i * Math.PI * 1.8) / numLobes - Math.PI * 0.9;
        const a2 = ((i + 0.5) * Math.PI * 1.8) / numLobes - Math.PI * 0.9;
        const r1 = 82;
        const r2 = 68;
        if (i === 0) ctx.moveTo(gx + Math.cos(a1) * r1, gy + Math.sin(a1) * r1);
        else ctx.lineTo(gx + Math.cos(a1) * r1, gy + Math.sin(a1) * r1);
        ctx.lineTo(gx + Math.cos(a2) * r2, gy + Math.sin(a2) * r2);
      }
      ctx.closePath();
      ctx.lineWidth = 2.6;
      ctx.stroke();
      for (let i = 0; i < numLobes; i++) {
        const a = (i * Math.PI * 1.8) / numLobes - Math.PI * 0.9;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(gx + Math.cos(a) * 75, gy + Math.sin(a) * 75);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Hydrangea blossom cluster
      const hx = 350;
      const hy = 230;
      for (let dx = -50; dx <= 50; dx += 26) {
        for (let dy = -50; dy <= 50; dy += 26) {
          if (dx * dx + dy * dy < 55 * 55) {
            const fx = hx + dx;
            const fy = hy + dy;
            for (let p = 0; p < 4; p++) {
              strokePetal(fx, fy, (p * Math.PI) / 2, 14, 7);
            }
          }
        }
      }

      // Fiddlehead fern spiral
      const fx = 210;
      const fy = 500;
      ctx.beginPath();
      ctx.moveTo(fx, fy + 80);
      for (let t = 0; t < 18; t += 0.2) {
        const r = 2 + t * 2.2;
        const a = t * 0.85;
        const px = fx + Math.cos(a) * r;
        const py = fy - Math.sin(a) * r;
        ctx.lineTo(px, py);
      }
      ctx.lineWidth = 2.8;
      ctx.stroke();

      // Drooping bellflowers
      for (const [cx, cy] of [[340, 480], [390, 520], [130, 480]]) {
        ctx.beginPath();
        ctx.moveTo(cx, cy - 25);
        ctx.bezierCurveTo(cx - 22, cy, cx - 18, cy + 30, cx, cy + 35);
        ctx.bezierCurveTo(cx + 18, cy + 30, cx + 22, cy, cx, cy - 25);
        ctx.lineWidth = 2.4;
        ctx.stroke();
      }
    }

    // Artist caption in bottom margin
    ctx.font = "bold 11px sans-serif";
    ctx.fillStyle = "#333333";
    ctx.textAlign = "center";
    ctx.fillText("FLORA DE LAS HURDES - LÁMINA BOTÁNICA A4 Nº " + pageNum, 256, 688);

    return canvas;
  }

  // --- ERA DE MESEGAL (Rustic Radial Slate Flagstones & Lichen Mosaic - M3-N2-E10) ---
  static getEraSlateBlockSet(): WorldBlockSet {
    return {
      top: this.getEraSlateTop(),
      sideX: this.getEraSlateSide(),
      sideZ: this.getEraSlateSide(),
      bottom: this.getEraSlateBottom(),
      emissiveColor: new THREE.Color(0x000000),
      movingEmissiveColor: new THREE.Color(0x1a1505)
    };
  }

  static getEraSlateTop(): THREE.CanvasTexture {
    const key = "block_era_slate_top";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    if (typeof document === "undefined") {
      const tex = new THREE.CanvasTexture({ width: 256, height: 256 } as any);
      this.cachedTextures.set(key, tex);
      return tex;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // 1. Earthy slate bed with moss and soil undertones
    ctx.fillStyle = "#2d3748";
    ctx.fillRect(0, 0, 256, 256);

    // 2. Large rustic slate slabs (like the flagstones radiating in the photo)
    const stones = [
      { x: 8, y: 8, w: 112, h: 112, c: "#3b4859" },
      { x: 128, y: 8, w: 120, h: 106, c: "#4a586d" },
      { x: 8, y: 128, w: 118, h: 120, c: "#425063" },
      { x: 134, y: 122, w: 114, h: 126, c: "#374455" }
    ];

    stones.forEach(st => {
      // Base slab with rounded natural corners
      ctx.fillStyle = st.c;
      ctx.beginPath();
      ctx.roundRect(st.x, st.y, st.w, st.h, 10);
      ctx.fill();

      // Slate layered cleavage gradient
      const grad = ctx.createLinearGradient(st.x, st.y, st.x + st.w, st.y + st.h);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.18)");
      grad.addColorStop(0.4, "rgba(255, 255, 255, 0.03)");
      grad.addColorStop(0.7, "rgba(120, 90, 60, 0.15)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0.38)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(st.x, st.y, st.w, st.h, 10);
      ctx.fill();

      // Slate cleavage lines
      ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
      ctx.lineWidth = 1.2;
      for (let l = 16; l < st.w; l += 24) {
        ctx.beginPath();
        ctx.moveTo(st.x + l, st.y + 4);
        ctx.lineTo(st.x + l - 8, st.y + st.h - 4);
        ctx.stroke();
      }
    });

    // 3. Lichen patches (pale cream-grey lichen circles exactly like the photo)
    const lichens = [
      { x: 64, y: 72, r: 16 },
      { x: 180, y: 55, r: 12 },
      { x: 210, y: 160, r: 20 },
      { x: 48, y: 190, r: 14 },
      { x: 155, y: 205, r: 15 },
      { x: 100, y: 135, r: 10 }
    ];

    lichens.forEach(lic => {
      const lGrad = ctx.createRadialGradient(lic.x, lic.y, 1, lic.x, lic.y, lic.r);
      lGrad.addColorStop(0, "rgba(241, 245, 249, 0.85)");
      lGrad.addColorStop(0.6, "rgba(203, 213, 225, 0.75)");
      lGrad.addColorStop(0.9, "rgba(148, 163, 184, 0.45)");
      lGrad.addColorStop(1, "rgba(148, 163, 184, 0)");
      ctx.fillStyle = lGrad;
      ctx.beginPath();
      ctx.arc(lic.x, lic.y, lic.r, 0, Math.PI * 2);
      ctx.fill();

      // Spore specks
      ctx.fillStyle = "rgba(71, 85, 105, 0.5)";
      ctx.beginPath();
      ctx.arc(lic.x + 2, lic.y - 1, 2, 0, Math.PI * 2);
      ctx.arc(lic.x - 3, lic.y + 3, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Wild mountain grass & moss in the crevices between stones
    ctx.fillStyle = "#365314";
    ctx.fillRect(120, 0, 8, 256);
    ctx.fillRect(0, 118, 256, 8);

    ctx.fillStyle = "#4d7c0f";
    for (let py = 4; py < 256; py += 18) {
      ctx.fillRect(122 + ((py * 7) % 5) - 2, py, 4, 3);
      ctx.fillRect(py, 120 + ((py * 11) % 5) - 2, 3, 4);
    }

    ctx.fillStyle = "#65a30d";
    ctx.beginPath();
    ctx.arc(124, 122, 14, 0, Math.PI * 2);
    ctx.fill();

    return this.finalizeBlockTexture(canvas, key);
  }

  static getEraSlateSide(): THREE.CanvasTexture {
    const key = "block_era_slate_side";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    if (typeof document === "undefined") {
      const tex = new THREE.CanvasTexture({ width: 256, height: 256 } as any);
      this.cachedTextures.set(key, tex);
      return tex;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Dark rustic foundation
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 256, 256);

    // Stratified slate courses (dry stone wall)
    const rowH = 32;
    const rowColors = ["#334155", "#475569", "#3f4d61", "#2d3748", "#4a586d"];
    for (let y = 0; y < 256; y += rowH) {
      const c = rowColors[(y / rowH) % rowColors.length];
      ctx.fillStyle = c;
      ctx.fillRect(0, y + 2, 256, rowH - 4);

      // Chiseled highlights
      const g = ctx.createLinearGradient(0, y, 0, y + rowH);
      g.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      g.addColorStop(1, "rgba(0, 0, 0, 0.4)");
      ctx.fillStyle = g;
      ctx.fillRect(0, y + 2, 256, rowH - 4);
    }

    // Moss creeping up the side
    ctx.fillStyle = "rgba(77, 124, 15, 0.65)";
    for (let x = 8; x < 256; x += 28) {
      ctx.beginPath();
      ctx.arc(x, 256, 12 + (x % 7), 0, Math.PI * 2);
      ctx.fill();
    }

    return this.finalizeBlockTexture(canvas, key);
  }

  static getEraSlateBottom(): THREE.CanvasTexture {
    const key = "block_era_slate_bottom";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    if (typeof document === "undefined") {
      const tex = new THREE.CanvasTexture({ width: 256, height: 256 } as any);
      this.cachedTextures.set(key, tex);
      return tex;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#1a202c";
    ctx.fillRect(0, 0, 256, 256);
    return this.finalizeBlockTexture(canvas, key);
  }

  // --- PEBBLES / ROQUITAS (Rustic River Stones & Cobblestones Mosaic) ---
  static getPebblesBlockSet(): WorldBlockSet {
    return {
      top: this.getPebblesTop(),
      sideX: this.getPebblesSide(),
      sideZ: this.getPebblesSide(),
      bottom: this.getPebblesBottom(),
      emissiveColor: new THREE.Color(0x000000),
      movingEmissiveColor: new THREE.Color(0x221105)
    };
  }

  private static getPebblesTop(): THREE.CanvasTexture {
    const key = "block_pebbles_top";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Mortar bedding in warm slate/mortar tone
    ctx.fillStyle = "#3e3835";
    ctx.fillRect(0, 0, 256, 256);

    // Natural stone colors (quartz, river slate, amber ochre, terracotta)
    const colors = [
      "#d6d3d1", "#a8a29e", "#78716c", "#d97706",
      "#b45309", "#92400e", "#64748b", "#475569",
      "#e7e5e4", "#713f12", "#ca8a04", "#57534e"
    ];

    const step = 20;
    for (let py = 6; py < 256; py += step) {
      for (let px = 6; px < 256; px += step) {
        const offX = ((py * 13 + px * 7) % 7) - 3;
        const offY = ((px * 11 + py * 5) % 7) - 3;
        const rx = 6 + ((px * 17 + py * 19) % 5);
        const ry = 5 + ((px * 23 + py * 11) % 4);
        const colIdx = Math.abs((px * 31 + py * 47) % colors.length);

        const cx = px + offX;
        const cy = py + offY;

        // Shadow behind pebble
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.beginPath();
        ctx.ellipse(cx + 2, cy + 2, rx, ry, (px + py) * 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Pebble body
        ctx.fillStyle = colors[colIdx];
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, (px + py) * 0.1, 0, Math.PI * 2);
        ctx.fill();

        // 3D highlight
        const hl = ctx.createRadialGradient(cx - rx * 0.3, cy - ry * 0.3, 1, cx, cy, rx);
        hl.addColorStop(0, "rgba(255, 255, 255, 0.45)");
        hl.addColorStop(0.5, "rgba(255, 255, 255, 0.05)");
        hl.addColorStop(1, "rgba(0, 0, 0, 0.25)");
        ctx.fillStyle = hl;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, (px + py) * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getPebblesSide(): THREE.CanvasTexture {
    const key = "block_pebbles_side";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Rustic stone foundation
    ctx.fillStyle = "#292524";
    ctx.fillRect(0, 0, 256, 256);

    // Stone curbing at top
    ctx.fillStyle = "#78716c";
    ctx.fillRect(0, 0, 256, 42);

    const curbGrad = ctx.createLinearGradient(0, 0, 0, 42);
    curbGrad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
    curbGrad.addColorStop(1, "rgba(0, 0, 0, 0.45)");
    ctx.fillStyle = curbGrad;
    ctx.fillRect(0, 0, 256, 42);

    // Embedded stones in the wall face
    const sideColors = ["#a8a29e", "#78716c", "#d97706", "#475569", "#d6d3d1"];
    for (let sy = 56; sy < 250; sy += 32) {
      for (let sx = 12; sx < 256; sx += 40) {
        const c = sideColors[(sx + sy) % sideColors.length];
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.roundRect(sx, sy, 30, 22, 6);
        ctx.fill();
      }
    }

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getPebblesBottom(): THREE.CanvasTexture {
    const key = "block_pebbles_bottom";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#1c1917";
    ctx.fillRect(0, 0, 256, 256);
    return this.finalizeBlockTexture(canvas, key);
  }

  // --- WORLD 1: VILLAMANTA (Earth & Terracotta Clay) ---
  private static getVillamantaBlockSet(): WorldBlockSet {
    return {
      top: this.getVillamantaTop(),
      sideX: this.getVillamantaSide(),
      sideZ: this.getVillamantaSide(),
      bottom: this.getVillamantaBottom(),
      emissiveColor: new THREE.Color(0x000000),
      movingEmissiveColor: new THREE.Color(0x331805)
    };
  }

  private static finalizeBlockTexture(canvas: HTMLCanvasElement, key: string): THREE.CanvasTexture {
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    this.cachedTextures.set(key, texture);
    return texture;
  }

  // --- WORLD 1: VILLAMANTA (Spanish Terracotta & Artisan Stone Pavers) ---
  private static getVillamantaTop(): THREE.CanvasTexture {
    const key = "block_w1_top";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Rich warm Spanish clay earth background mortar
    ctx.fillStyle = "#5a3215";
    ctx.fillRect(0, 0, 256, 256);

    // Terracotta pavers in seamless running bond (4 rows of 64px, paver width 128px)
    const brickPalette = ["#c85a32", "#b24d29", "#d46b43", "#a84322"];
    for (let row = 0; row < 4; row++) {
      const y = row * 64;
      const xOffset = (row % 2) * 64;
      for (let col = -1; col <= 2; col++) {
        const x = col * 128 + xOffset;
        const color = brickPalette[(row * 2 + (col + 2)) % brickPalette.length];

        // Paver body with subtle mortar margin (4px)
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, 124, 60, 4);
        ctx.fill();

        // Paver surface warm gradient & highlights (sunlit bevel)
        const grad = ctx.createLinearGradient(x + 2, y + 2, x + 126, y + 62);
        grad.addColorStop(0, "rgba(255, 235, 200, 0.22)");
        grad.addColorStop(0.35, "rgba(255, 255, 255, 0.05)");
        grad.addColorStop(0.7, "rgba(0, 0, 0, 0.08)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0.25)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, 124, 60, 4);
        ctx.fill();
      }
    }

    // Micro river pebbles scattered along mortar joints (wrapping coordinates)
    const pebbles = [
      { x: 32, y: 64, r: 3 }, { x: 96, y: 128, r: 2.5 }, { x: 160, y: 192, r: 3 },
      { x: 224, y: 64, r: 2 }, { x: 64, y: 0, r: 2.5 }, { x: 192, y: 256, r: 2.5 }
    ];
    ctx.fillStyle = "#e0d6ce";
    pebbles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y % 256, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getVillamantaSide(): THREE.CanvasTexture {
    const key = "block_w1_side";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Spanish earth strata layers
    ctx.fillStyle = "#6f3e1b";
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = "#8d5524";
    ctx.fillRect(0, 56, 256, 80);

    ctx.fillStyle = "#5a3015";
    ctx.fillRect(0, 136, 256, 72);

    ctx.fillStyle = "#4a2810";
    ctx.fillRect(0, 208, 256, 48);

    // Terracotta architectural curb coping at top edge
    ctx.fillStyle = "#b24d29";
    ctx.fillRect(0, 0, 256, 48);

    // Bevel highlights
    const bevelGrad = ctx.createLinearGradient(0, 0, 0, 48);
    bevelGrad.addColorStop(0, "rgba(255, 230, 200, 0.45)");
    bevelGrad.addColorStop(0.15, "rgba(255, 255, 255, 0.1)");
    bevelGrad.addColorStop(0.9, "rgba(0, 0, 0, 0.15)");
    bevelGrad.addColorStop(1, "rgba(0, 0, 0, 0.5)");
    ctx.fillStyle = bevelGrad;
    ctx.fillRect(0, 0, 256, 48);

    // Sedimentary limestone pebbles
    ctx.fillStyle = "#a1887f";
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.ellipse((i * 37 + 15) % 256, 90 + (i * 23) % 120, 12, 6, 0.15, 0, Math.PI * 2);
      ctx.fill();
    }

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getVillamantaBottom(): THREE.CanvasTexture {
    const key = "block_w1_bottom";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    ctx.fillStyle = "#4a2810";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#361c0a";
    ctx.fillRect(32, 32, 80, 64);
    ctx.fillRect(144, 144, 88, 72);

    return this.finalizeBlockTexture(canvas, key);
  }

  // --- WORLD 2: ALICANTE / SAN JUAN (Sunlit Travertine Marble & Sandstone) ---
  private static getAlicanteBlockSet(): WorldBlockSet {
    return {
      top: this.getAlicanteTop(),
      sideX: this.getAlicanteSide(),
      sideZ: this.getAlicanteSide(),
      bottom: this.getAlicanteBottom(),
      emissiveColor: new THREE.Color(0x000000),
      movingEmissiveColor: new THREE.Color(0x002c3b)
    };
  }

  private static getAlicanteTop(): THREE.CanvasTexture {
    const key = "block_w2_top";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Golden sunlit Mediterranean travertine marble base
    ctx.fillStyle = "#f6df95";
    ctx.fillRect(0, 0, 256, 256);

    // Seamless dunes and marble vein waves
    for (let y = 0; y < 256; y += 32) {
      ctx.fillStyle = (y % 64 === 0) ? "rgba(230, 190, 80, 0.35)" : "rgba(250, 233, 179, 0.45)";
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 256; x += 16) {
        const wave = Math.sin((x * Math.PI * 4) / 256) * 6;
        ctx.lineTo(x, y + wave);
      }
      ctx.lineTo(256, y + 16);
      ctx.lineTo(0, y + 16);
      ctx.closePath();
      ctx.fill();
    }

    // Polished travertine paver joint accents (seamless 128px tiles)
    ctx.strokeStyle = "rgba(181, 131, 62, 0.35)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(128, 0); ctx.lineTo(128, 256);
    ctx.moveTo(0, 128); ctx.lineTo(256, 128);
    ctx.stroke();

    // Sparkling quartz and mother-of-pearl specks
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    const specks = [
      { x: 48, y: 36 }, { x: 180, y: 72 }, { x: 92, y: 160 }, { x: 210, y: 220 }
    ];
    specks.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getAlicanteSide(): THREE.CanvasTexture {
    const key = "block_w2_side";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Coastal sandstone strata
    ctx.fillStyle = "#d4a359";
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = "#b5833e";
    ctx.fillRect(0, 64, 256, 56);
    ctx.fillRect(0, 176, 256, 48);

    ctx.fillStyle = "#edd197";
    ctx.fillRect(0, 120, 256, 56);

    // Polished sandstone curb coping at top
    ctx.fillStyle = "#f5d77f";
    ctx.fillRect(0, 0, 256, 48);

    const bevelGrad = ctx.createLinearGradient(0, 0, 0, 48);
    bevelGrad.addColorStop(0, "rgba(255, 255, 255, 0.5)");
    bevelGrad.addColorStop(0.2, "rgba(255, 255, 255, 0.15)");
    bevelGrad.addColorStop(0.9, "rgba(181, 131, 62, 0.2)");
    bevelGrad.addColorStop(1, "rgba(138, 98, 42, 0.5)");
    ctx.fillStyle = bevelGrad;
    ctx.fillRect(0, 0, 256, 48);

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getAlicanteBottom(): THREE.CanvasTexture {
    const key = "block_w2_bottom";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    ctx.fillStyle = "#8a622a";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#6d4c1d";
    ctx.fillRect(40, 40, 96, 72);
    ctx.fillRect(144, 144, 80, 80);

    return this.finalizeBlockTexture(canvas, key);
  }

  // --- WORLD 3: MESEGAL (Mountain Slate & Rustic Granite Slab) ---
  private static getMesegalBlockSet(): WorldBlockSet {
    return {
      top: this.getMesegalTop(),
      sideX: this.getMesegalSide(),
      sideZ: this.getMesegalSide(),
      bottom: this.getMesegalBottom(),
      emissiveColor: new THREE.Color(0x000000),
      movingEmissiveColor: new THREE.Color(0x0a3318)
    };
  }

  private static getMesegalTop(): THREE.CanvasTexture {
    const key = "block_w3_top";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Dark rustic slate background
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 256, 256);

    // Natural interlocking slate slabs (4 quadrants of 128px)
    const slabs = [
      { x: 4, y: 4, w: 120, h: 120, c: "#334155" },
      { x: 132, y: 4, w: 120, h: 120, c: "#475569" },
      { x: 4, y: 132, w: 120, h: 120, c: "#475569" },
      { x: 132, y: 132, w: 120, h: 120, c: "#334155" }
    ];

    slabs.forEach(s => {
      ctx.fillStyle = s.c;
      ctx.beginPath();
      ctx.roundRect(s.x, s.y, s.w, s.h, 4);
      ctx.fill();

      // Slate cleavage lines
      const sGrad = ctx.createLinearGradient(s.x, s.y, s.x + s.w, s.y + s.h);
      sGrad.addColorStop(0, "rgba(255, 255, 255, 0.16)");
      sGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.02)");
      sGrad.addColorStop(1, "rgba(0, 0, 0, 0.35)");
      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.roundRect(s.x, s.y, s.w, s.h, 4);
      ctx.fill();
    });

    // Forest moss along the stone crevices
    ctx.fillStyle = "rgba(77, 124, 15, 0.75)";
    ctx.fillRect(124, 0, 8, 256);
    ctx.fillRect(0, 124, 256, 8);

    ctx.fillStyle = "#84cc16";
    ctx.beginPath();
    ctx.arc(128, 128, 12, 0, Math.PI * 2);
    ctx.fill();

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getMesegalSide(): THREE.CanvasTexture {
    const key = "block_w3_side";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Slate rock cliff
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = "#334155";
    ctx.fillRect(0, 48, 256, 64);
    ctx.fillRect(0, 144, 256, 64);

    // Chiseled slate curb at top
    ctx.fillStyle = "#475569";
    ctx.fillRect(0, 0, 256, 48);

    const bevelGrad = ctx.createLinearGradient(0, 0, 0, 48);
    bevelGrad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
    bevelGrad.addColorStop(0.3, "rgba(255, 255, 255, 0.08)");
    bevelGrad.addColorStop(1, "rgba(0, 0, 0, 0.45)");
    ctx.fillStyle = bevelGrad;
    ctx.fillRect(0, 0, 256, 48);

    // Hanging mountain moss
    ctx.fillStyle = "#4d7c0f";
    ctx.fillRect(0, 48, 256, 12);
    for (let x = 16; x < 256; x += 48) {
      ctx.beginPath();
      ctx.arc(x, 60, 16, 0, Math.PI);
      ctx.fill();
    }

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getMesegalBottom(): THREE.CanvasTexture {
    const key = "block_w3_bottom";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(40, 40, 88, 88);
    ctx.fillRect(144, 144, 88, 88);

    return this.finalizeBlockTexture(canvas, key);
  }

  // --- WORLD 4: CARABANCHEL (Madrid Urban Granite Pavers & Red Brick) ---
  private static getCarabanchelBlockSet(): WorldBlockSet {
    return {
      top: this.getCarabanchelTop(),
      sideX: this.getCarabanchelSide(),
      sideZ: this.getCarabanchelSide(),
      bottom: this.getCarabanchelBottom(),
      emissiveColor: new THREE.Color(0x000000),
      movingEmissiveColor: new THREE.Color(0x3d2800)
    };
  }

  private static getCarabanchelTop(): THREE.CanvasTexture {
    const key = "block_w4_top";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Madrid granite adoquines sidewalk mortar
    ctx.fillStyle = "#4b5563";
    ctx.fillRect(0, 0, 256, 256);

    // Granite cobblestones in running bond (4 rows of 64px, cobblestone width 64px)
    const tones = ["#9ca3af", "#cbd5e1", "#848d9a", "#b0b8c4"];
    for (let row = 0; row < 4; row++) {
      const y = row * 64;
      const xOffset = (row % 2) * 32;
      for (let col = -1; col <= 4; col++) {
        const x = col * 64 + xOffset;
        const color = tones[(row + col + 10) % tones.length];

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, 60, 60, 4);
        ctx.fill();

        // Bevel lighting
        const grad = ctx.createLinearGradient(x + 2, y + 2, x + 62, y + 62);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
        grad.addColorStop(0.35, "rgba(255, 255, 255, 0.05)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0.25)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, 60, 60, 4);
        ctx.fill();
      }
    }

    // Granite feldspar mineral specks
    ctx.fillStyle = "#1f2937";
    for (let i = 0; i < 16; i++) {
      ctx.fillRect((i * 47 + 10) % 256, (i * 31 + 15) % 256, 3, 3);
    }
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 16; i++) {
      ctx.fillRect((i * 59 + 25) % 256, (i * 41 + 8) % 256, 2, 2);
    }

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getCarabanchelSide(): THREE.CanvasTexture {
    const key = "block_w4_side";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Classic Madrid red-brick facade
    ctx.fillStyle = "#57534e"; // mortar
    ctx.fillRect(0, 0, 256, 256);

    const brickTones = ["#991b1b", "#b91c1c", "#7f1d1d", "#a82020"];
    for (let row = 1; row < 6; row++) {
      const y = row * 38 + 10;
      const xOffset = (row % 2) * 48;
      for (let col = -1; col <= 3; col++) {
        const x = col * 96 + xOffset;
        ctx.fillStyle = brickTones[(row + col + 10) % brickTones.length];
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, 92, 34, 3);
        ctx.fill();
      }
    }

    // Heavy Madrid granite curb coping at top
    ctx.fillStyle = "#9ca3af";
    ctx.fillRect(0, 0, 256, 48);

    const bevelGrad = ctx.createLinearGradient(0, 0, 0, 48);
    bevelGrad.addColorStop(0, "rgba(255, 255, 255, 0.45)");
    bevelGrad.addColorStop(0.2, "rgba(255, 255, 255, 0.1)");
    bevelGrad.addColorStop(1, "rgba(0, 0, 0, 0.4)");
    ctx.fillStyle = bevelGrad;
    ctx.fillRect(0, 0, 256, 48);

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getCarabanchelBottom(): THREE.CanvasTexture {
    const key = "block_w4_bottom";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    ctx.fillStyle = "#1c1917";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#292524";
    ctx.fillRect(36, 36, 88, 88);
    ctx.fillRect(144, 144, 88, 88);

    return this.finalizeBlockTexture(canvas, key);
  }

  // --- WORLD 5: ASTURIAS (Lush Alpine Meadow & Limestone) ---
  private static getAsturiasBlockSet(): WorldBlockSet {
    return {
      top: this.getAsturiasTop(),
      sideX: this.getAsturiasSide(),
      sideZ: this.getAsturiasSide(),
      bottom: this.getAsturiasBottom(),
      emissiveColor: new THREE.Color(0x000000),
      movingEmissiveColor: new THREE.Color(0x05441a)
    };
  }

  private static getAsturiasTop(): THREE.CanvasTexture {
    const key = "block_w5_top";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Ultra-lush emerald green alpine turf
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(0, 0, 256, 256);

    // Natural undulating lawn turf variation (seamless periodic waves)
    for (let y = 0; y < 256; y += 32) {
      for (let x = 0; x < 256; x += 32) {
        const factor = Math.sin((x * Math.PI * 4) / 256) * Math.cos((y * Math.PI * 4) / 256);
        ctx.fillStyle = factor > 0 ? "rgba(34, 197, 94, 0.45)" : "rgba(21, 128, 61, 0.4)";
        ctx.beginPath();
        ctx.arc(x + 16, y + 16, 18, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Delicate alpine clover and microscopic wildflower blossoms
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    const blossoms = [
      { x: 40, y: 50 }, { x: 190, y: 70 }, { x: 110, y: 170 }, { x: 220, y: 210 }
    ];
    blossoms.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getAsturiasSide(): THREE.CanvasTexture {
    const key = "block_w5_side";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Picos de Europa limestone rock
    ctx.fillStyle = "#64748b";
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(0, 72, 256, 64);

    ctx.fillStyle = "#475569";
    ctx.fillRect(0, 168, 256, 56);

    // Thick overhanging alpine grass sod rim
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(0, 0, 256, 48);

    const bevelGrad = ctx.createLinearGradient(0, 0, 0, 48);
    bevelGrad.addColorStop(0, "rgba(74, 222, 128, 0.6)");
    bevelGrad.addColorStop(0.3, "rgba(34, 197, 94, 0.15)");
    bevelGrad.addColorStop(1, "rgba(21, 128, 61, 0.5)");
    ctx.fillStyle = bevelGrad;
    ctx.fillRect(0, 0, 256, 48);

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getAsturiasBottom(): THREE.CanvasTexture {
    const key = "block_w5_bottom";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    ctx.fillStyle = "#334155";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(40, 40, 88, 88);
    ctx.fillRect(144, 144, 88, 88);

    return this.finalizeBlockTexture(canvas, key);
  }

  // --- WORLD 6: LONDRES (Snow-Dusted Victorian Flagstone) ---
  private static getLondonBlockSet(): WorldBlockSet {
    return {
      top: this.getLondonTop(),
      sideX: this.getLondonSide(),
      sideZ: this.getLondonSide(),
      bottom: this.getLondonBottom(),
      emissiveColor: new THREE.Color(0x000000),
      movingEmissiveColor: new THREE.Color(0x352800)
    };
  }

  private static getLondonTop(): THREE.CanvasTexture {
    const key = "block_w6_top";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Pristine winter snow blanket
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 256, 256);

    // Victorian flagstones showing through snow (seamless 128px quadrants)
    ctx.fillStyle = "rgba(203, 213, 225, 0.55)";
    ctx.beginPath();
    ctx.roundRect(16, 16, 96, 96, 8);
    ctx.roundRect(144, 144, 96, 96, 8);
    ctx.fill();

    // Soft blue snow drift shadows
    ctx.fillStyle = "rgba(226, 232, 240, 0.65)";
    ctx.beginPath();
    ctx.arc(64, 192, 48, 0, Math.PI * 2);
    ctx.arc(192, 64, 48, 0, Math.PI * 2);
    ctx.fill();

    // Ice crystal sparkles
    ctx.fillStyle = "#ffffff";
    const sparkles = [{ x: 32, y: 32 }, { x: 160, y: 48 }, { x: 80, y: 160 }, { x: 210, y: 200 }];
    sparkles.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getLondonSide(): THREE.CanvasTexture {
    const key = "block_w6_side";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Victorian dark brick masonry
    ctx.fillStyle = "#334155";
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = "#475569";
    for (let row = 1; row < 5; row++) {
      const y = row * 44 + 8;
      const xOffset = (row % 2) * 64;
      for (let col = -1; col <= 3; col++) {
        ctx.fillRect(col * 128 + xOffset, y, 120, 36);
      }
    }

    // Snow blanket cap on top
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 256, 48);

    // Hanging frost icicles
    ctx.fillStyle = "#bae6fd";
    for (let x = 16; x < 256; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x - 8, 48);
      ctx.lineTo(x + 8, 48);
      ctx.lineTo(x, 76);
      ctx.closePath();
      ctx.fill();
    }

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getLondonBottom(): THREE.CanvasTexture {
    const key = "block_w6_bottom";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(40, 40, 88, 88);
    ctx.fillRect(144, 144, 88, 88);

    return this.finalizeBlockTexture(canvas, key);
  }

  // --- WORLD 7: JAPÓN (Cherry Blossom Wood & Cyber Neon) ---
  private static getJapanBlockSet(levelId: number): WorldBlockSet {
    if (levelId >= 3) {
      return {
        top: this.getJapanNeonTop(),
        sideX: this.getJapanNeonSide(),
        sideZ: this.getJapanNeonSide(),
        bottom: this.getJapanNeonBottom(),
        emissiveColor: new THREE.Color(0x051b2a),
        movingEmissiveColor: new THREE.Color(0x28003a)
      };
    }

    return {
      top: this.getJapanSakuraTop(),
      sideX: this.getJapanSakuraSide(),
      sideZ: this.getJapanSakuraSide(),
      bottom: this.getJapanSakuraBottom(),
      emissiveColor: new THREE.Color(0x000000),
      movingEmissiveColor: new THREE.Color(0x380022)
    };
  }

  private static getJapanSakuraTop(): THREE.CanvasTexture {
    const key = "block_w7_sakura_top";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Polished Japanese cherry wood base
    ctx.fillStyle = "#92400e";
    ctx.fillRect(0, 0, 256, 256);

    // Seamless cherry wood planks (4 planks of 64px height)
    for (let y = 0; y < 256; y += 64) {
      ctx.fillStyle = (y % 128 === 0) ? "#b45309" : "#d97706";
      ctx.fillRect(0, y + 2, 256, 60);

      // Wood grain lines
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.fillRect(0, y + 16, 256, 3);
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, y + 42, 256, 3);
    }

    // Delicate scattered pink sakura petals
    const drawPetal = (px: number, py: number, rot: number) => {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);
      ctx.fillStyle = "#f472b6";
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fbcfe8";
      ctx.beginPath();
      ctx.ellipse(-3, 0, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawPetal(48, 56, 0.4);
    drawPetal(104, 176, -0.6);
    drawPetal(192, 88, 1.2);
    drawPetal(208, 208, 0.8);

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getJapanSakuraSide(): THREE.CanvasTexture {
    const key = "block_w7_sakura_side";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Torii shrine vermilion lacquer
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = "#b91c1c";
    ctx.fillRect(0, 64, 256, 128);

    // Black Japanese lacquer coping curb
    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, 256, 48);

    const bevelGrad = ctx.createLinearGradient(0, 0, 0, 48);
    bevelGrad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
    bevelGrad.addColorStop(0.2, "rgba(255, 255, 255, 0.08)");
    bevelGrad.addColorStop(1, "rgba(0, 0, 0, 0.4)");
    ctx.fillStyle = bevelGrad;
    ctx.fillRect(0, 0, 256, 48);

    // Gold decorative rivets
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(32, 24, 6, 0, Math.PI * 2);
    ctx.arc(224, 24, 6, 0, Math.PI * 2);
    ctx.fill();

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getJapanSakuraBottom(): THREE.CanvasTexture {
    const key = "block_w7_sakura_bottom";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    ctx.fillStyle = "#1c1917";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#292524";
    ctx.fillRect(40, 40, 88, 88);
    ctx.fillRect(144, 144, 88, 88);

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getJapanNeonTop(): THREE.CanvasTexture {
    const key = "block_w7_neon_top";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Dark cyber carbon chassis
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, 256, 256);

    // Carbon weave grid
    ctx.fillStyle = "#18181b";
    for (let x = 8; x < 256; x += 32) {
      for (let y = 8; y < 256; y += 32) {
        ctx.fillRect(x, y, 24, 24);
      }
    }

    // Glowing cyan & magenta circuit conduits meeting at borders
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, 128); ctx.lineTo(256, 128);
    ctx.moveTo(128, 0); ctx.lineTo(128, 256);
    ctx.stroke();

    ctx.strokeStyle = "#d946ef";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.rect(64, 64, 128, 128);
    ctx.stroke();

    ctx.fillStyle = "#22d3ee";
    ctx.beginPath();
    ctx.arc(128, 128, 12, 0, Math.PI * 2);
    ctx.fill();

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getJapanNeonSide(): THREE.CanvasTexture {
    const key = "block_w7_neon_side";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Cyber alloy
    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, 256, 256);

    // Glowing neon cyan side stripe
    ctx.fillStyle = "#06b6d4";
    ctx.fillRect(0, 112, 256, 16);
    ctx.fillStyle = "#22d3ee";
    ctx.fillRect(0, 116, 256, 8);

    // Top magenta neon rim
    ctx.fillStyle = "#d946ef";
    ctx.fillRect(0, 0, 256, 12);

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getJapanNeonBottom(): THREE.CanvasTexture {
    const key = "block_w7_neon_bottom";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#18181b";
    ctx.fillRect(40, 40, 88, 88);
    ctx.fillRect(144, 144, 88, 88);

    return this.finalizeBlockTexture(canvas, key);
  }

  // --- WORLD 8: NORUEGA (Glacial Blue Ice & Arctic Snow) ---
  private static getNorwayBlockSet(): WorldBlockSet {
    return {
      top: this.getNorwayTop(),
      sideX: this.getNorwaySide(),
      sideZ: this.getNorwaySide(),
      bottom: this.getNorwayBottom(),
      emissiveColor: new THREE.Color(0x001524),
      movingEmissiveColor: new THREE.Color(0x003828)
    };
  }

  private static getNorwayTop(): THREE.CanvasTexture {
    const key = "block_w8_top";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Glacial crystalline sapphire blue ice
    ctx.fillStyle = "#7dd3fc";
    ctx.fillRect(0, 0, 256, 256);

    // Arctic ice slabs (seamless 128px quadrants)
    ctx.fillStyle = "#e0f2fe";
    ctx.beginPath();
    ctx.roundRect(8, 8, 112, 112, 12);
    ctx.roundRect(136, 136, 112, 112, 12);
    ctx.fill();

    ctx.fillStyle = "#bae6fd";
    ctx.beginPath();
    ctx.roundRect(136, 8, 112, 112, 12);
    ctx.roundRect(8, 136, 112, 112, 12);
    ctx.fill();

    // Glacial crystalline fissures
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(40, 16); ctx.lineTo(96, 104); ctx.lineTo(64, 168); ctx.lineTo(136, 232);
    ctx.stroke();

    // Diamond glints
    ctx.fillStyle = "#ffffff";
    const glints = [{ x: 32, y: 48 }, { x: 176, y: 72 }, { x: 104, y: 184 }, { x: 208, y: 160 }];
    glints.forEach(g => {
      ctx.beginPath();
      ctx.arc(g.x, g.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getNorwaySide(): THREE.CanvasTexture {
    const key = "block_w8_side";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    // Glacial ice cliff
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(24, 64, 72, 160);
    ctx.fillRect(152, 88, 80, 144);

    // Arctic snow cap rim
    ctx.fillStyle = "#e0f2fe";
    ctx.fillRect(0, 0, 256, 48);

    // Sharp hanging icicles
    ctx.fillStyle = "#7dd3fc";
    for (let x = 16; x < 256; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x - 8, 48);
      ctx.lineTo(x + 8, 48);
      ctx.lineTo(x, 88);
      ctx.closePath();
      ctx.fill();
    }

    return this.finalizeBlockTexture(canvas, key);
  }

  private static getNorwayBottom(): THREE.CanvasTexture {
    const key = "block_w8_bottom";
    const cached = this.cachedTextures.get(key);
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    ctx.fillStyle = "#082f49";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#0c4a6e";
    ctx.fillRect(40, 40, 88, 88);
    ctx.fillRect(144, 144, 88, 88);

    return this.finalizeBlockTexture(canvas, key);
  }
}

export interface WorldBlockSet {
  top: THREE.CanvasTexture;
  sideX: THREE.CanvasTexture;
  sideZ: THREE.CanvasTexture;
  bottom: THREE.CanvasTexture;
  emissiveColor: THREE.Color;
  movingEmissiveColor: THREE.Color;
}
