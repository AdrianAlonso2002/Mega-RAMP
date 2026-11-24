import { assetUrl } from "../core/AssetUrl";
import { optionalReadiness } from './OptionalReadiness';
import {readProgressBackup} from '../progression/ProgressBackup';
import { CHARACTERS, getCharacterById } from "../player/Characters";
import { getWorldById } from "../levels/WorldDefinitions";
import {stageMetadata as getBakedStage} from '../levels/StageRegistry';
import type { ProgressionManager } from "../progression/ProgressionManager";
import type { GameState, GameScreen } from "../game/GameState";
import { AudioManager } from "../audio/AudioManager";
import { SpriteTextures } from "../rendering/SpriteTextures";
import { OverworldMap } from "./OverworldMap";
import { CharacterPreview } from "./CharacterPreview";
import {getCharacterSkins, getCharacterSkin} from '../player/CharacterSkins';
import {revealUIBackdrop,loadUIImage} from './UIAssets';
import {CloudTransition} from './CloudTransition';
import {menuIcon} from './MenuIcons';
import {LoadingTipPicker} from './LoadingTips';

export interface UICallbacks {
  onStartStage: (world: number, level: number, stage: number) => void;
  onSelectCharacter: (charId: string) => void;
  onOpenEditor: () => void;
  onResume: () => void;
  onRestartStage: () => void;
  onRestartLevel?: () => void;
  onNextStage: () => void;
  onReturnToMenu: () => void;
  onChangeBGM?: (trackId: string) => void;
  onChangeBackground?: (skyThemeId: string) => void;
  onQualityChange?: (quality: "low" | "medium" | "high") => void;
  onCameraModeChange?: (mode:1|2)=>void;
}

export class UIManager {
  private readonly loadingTips=new LoadingTipPicker();
  private readonly root: HTMLElement;
  private readonly audio = AudioManager.getInstance();
  private overworldMap: OverworldMap | null = null;
  private characterPreview: CharacterPreview | null = null;
  private charSelectOrigin: "title" | "pause" = "title";
  private titleEntered = false;
  private titleEntryFocusTimer?: ReturnType<typeof setTimeout>;
  private readonly clouds?:CloudTransition;
  private displayedScreen?:GameScreen;
  private screenReadiness:Promise<unknown>[]=[];
  private destroyed=false;

  constructor(
    container: HTMLElement,
    private readonly state: GameState,
    private readonly progression: ProgressionManager,
    private readonly callbacks: UICallbacks
  ) {
    this.root = document.createElement("div");
    this.root.className = "ui-root";
    container.appendChild(this.root);
    this.clouds=new CloudTransition(container);
    window.addEventListener('mega-ramp-save-error',this.saveWarning);
    const warning=this.progression.getStorageWarning();if(warning)queueMicrotask(()=>{if(!this.destroyed)this.notice(warning);});
  }

  private noticeTimer?:ReturnType<typeof setTimeout>;
  private readonly saveWarning=()=>this.notice('No se ha podido guardar la partida. Conservamos esta sesión; exporta una copia desde Opciones.');
  private notice(message:string):void{let note=this.root.parentElement?.querySelector<HTMLElement>('.game-notice');if(!note){note=document.createElement('div');note.className='game-notice';note.setAttribute('role','status');note.setAttribute('aria-live','polite');this.root.parentElement?.append(note);}note.textContent=message;clearTimeout(this.noticeTimer);const current=note;this.noticeTimer=setTimeout(()=>current.remove(),10000);}
  showScreen(screen: GameScreen): void {
    if(this.destroyed)return;
    // Test/render-only consumers can keep using the synchronous screen renderer.
    if(!this.clouds){this.renderScreen(screen);return;}
    const menus:GameScreen[]=['title','character-select','world-select','level-select','stage-select','options'];
    const initial=this.displayedScreen===undefined;
    const characterReturn=screen==='pause'&&this.displayedScreen==='character-select';
    if(initial||menus.includes(screen)||characterReturn){
      if(this.clouds.active)return;
      const ranks:Partial<Record<GameScreen,number>>={title:0,options:1,'character-select':1,'world-select':1,'level-select':2,'stage-select':3};
      const back=characterReturn||screen==='title'||(ranks[screen]??0)<(ranks[this.displayedScreen!]??0);
      this.root.inert=true;this.root.setAttribute('aria-busy','true');
      void this.clouds.run(back?'back':'forward',async signal=>{
        this.renderScreen(screen);
        this.root.inert=true;this.root.setAttribute('aria-busy','true');
        await this.waitForScreenAssets(screen,signal);
      },initial).catch(error=>console.error('No se ha podido preparar el menú.',error)).finally(()=>{
        if(this.destroyed)return;
        this.root.inert=false;this.root.removeAttribute('inert');this.root.removeAttribute('aria-busy');
        const entry=this.root.querySelector<HTMLButtonElement>('#btn-enter-menu');
        if(entry)entry.focus({preventScroll:true});
        else this.root.querySelector<HTMLElement>('button:not([disabled])')?.focus({preventScroll:true});
      });
      return;
    }
    this.renderScreen(screen);
  }

  async prepareEditor(prepare:()=>Promise<void>):Promise<void>{
    if(this.destroyed||this.clouds?.active)return;
    this.state.screen='loading';this.root.inert=true;this.root.setAttribute('aria-busy','true');
    try{const work=async()=>{if(this.destroyed)return;this.renderScreen('editor');await prepare();};if(this.clouds)await this.clouds.run('forward',work);else await work();}
    finally{if(!this.destroyed){this.root.inert=false;this.root.removeAttribute('aria-busy');}}
  }
  private async waitForScreenAssets(screen:GameScreen,signal:AbortSignal):Promise<void>{
    const imagePromises=Array.from(this.root.querySelectorAll<HTMLImageElement>('img')).map(async image=>{
      if(image.complete&&image.naturalWidth>0)return;
      const loaded=await loadUIImage(image.currentSrc||image.src);
      if(!loaded){image.style.visibility='hidden';return;}
      if(image.decode)await optionalReadiness(image.decode(),signal);
    });
    const pending:Promise<unknown>[]=[...this.screenReadiness,...imagePromises,loadUIImage(assetUrl('/assets/ui/cloud-bank.svg')),SpriteTextures.waitForUIPortraits()];
    if(document.fonts)pending.push(optionalReadiness(document.fonts.ready,signal));
    if(screen==='character-select'||screen==='pause')pending.push(SpriteTextures.waitForCharacterSkin(this.state.selectedCharacter,this.state.selectedSkin));
    await Promise.allSettled(pending);
    if(signal.aborted||this.destroyed)return;
    // Allow portraits to repaint and the character preview to upload its first frame.
    await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
  }

  private renderScreen(screen:GameScreen):void {
    this.displayedScreen=screen;this.screenReadiness=[];
    if(this.titleEntryFocusTimer!==undefined){clearTimeout(this.titleEntryFocusTimer);this.titleEntryFocusTimer=undefined;}
    if(screen==='title'&&!this.titleEntered)this.audio.stopMenuBGM();
    else if(['title','world-select','level-select','stage-select','options'].includes(screen)||(screen==='character-select'&&this.charSelectOrigin==='title'))this.audio.startMenuBGM();
    else if(['gameplay','loading','editor'].includes(screen))this.audio.stopMenuBGM();
    if (this.overworldMap) {
      this.overworldMap.destroy();
      this.overworldMap = null;
    }
    if (this.characterPreview) {
      this.characterPreview.destroy();
      this.characterPreview = null;
    }

    this.state.screen = screen;
    this.root.removeAttribute('aria-busy');
    if(screen!=='gameplay')this.audio.updateRoll(0);
    this.audio.playClick();
    this.root.innerHTML = "";

    switch (screen) {
      case "title":
        this.renderTitleScreen();
        break;
      case "character-select":
        this.renderCharacterSelectScreen();
        break;
      case "world-select":
        this.renderWorldSelectScreen();
        break;
      case "level-select":
        this.renderLevelSelectScreen();
        break;
      case "stage-select":
        this.renderStageSelectScreen();
        break;
      case "victory":
        this.renderVictoryScreen();
        break;
      case "level-clear":
        this.renderLevelClearScreen();
        break;
      case 'game-clear':
        this.renderGameClearScreen();break;
      case "gameover":
        this.renderGameOverScreen();
        break;
      case "pause":
        this.renderPauseScreen();
        break;
      case "options":
        this.renderOptionsScreen();
        break;
      case "gameplay":
      case "loading":
      case "editor":
        break;
    }
    this.root.querySelectorAll<HTMLElement>('[data-collectible-icon]').forEach(slot=>{
      const canvas=SpriteTextures.getCollectibleCanvas(slot.dataset.collectibleIcon!,20);
      canvas.style.cssText='display:inline-block;width:20px;height:20px;vertical-align:middle';slot.appendChild(canvas);
    });
  }

  // 1. Title Screen (Branding: Mega RAMP)
  private renderTitleScreen(): void {
    const intro = !this.titleEntered;
    const activeChar = getCharacterById(this.state.selectedCharacter);
    const activeSkin = getCharacterSkin(activeChar.id, this.progression.getSelectedSkin(activeChar.id));
    const orbitForms=CHARACTERS.flatMap(character=>getCharacterSkins(character.id)
      .filter(skin=>this.progression.isSkinUnlocked(character.id,skin.id))
      .map(skin=>({character,skin})));

    this.root.innerHTML = `
      <section class="screen title-screen title-screen-refined ${intro?'has-title-entry is-title-intro':''}" aria-label="${intro?'Bienvenido a MEGA RAMP':'Menú principal'}">
        <div class="menu-landscape" aria-hidden="true"></div>
        <div class="title-shell">
        <div class="title-brand">
          <div class="title-logo-stage">
          <div class="title-logo-copy">
          <h1 class="logo-title">
            <span class="logo-mega">MEGA</span>
            <span class="logo-ramp">RAMP</span>
          </h1>
          <p class="title-tagline">Rony Adri Misi Pao</p>
          </div>
          <div class="title-character-orbit" aria-hidden="true">${orbitForms.map(({character,skin},i)=>`
            <span class="title-character-ball" data-orbit-char="${character.id}" data-orbit-skin="${skin.id}" style="--orbit-phase:${i/orbitForms.length*100}%;animation-delay:${-i/orbitForms.length*48}s"><span class="title-ball-face"></span></span>`).join('')}</div>
          </div>
          ${intro?`<button class="btn btn-main title-entry-play" id="btn-enter-menu" type="button" aria-label="Play: entrar al menú">${menuIcon('play')}<span>Play</span></button>`:''}
        </div>
        <div class="title-menu-panel" ${intro?'inert aria-hidden="true"':''}>

          <div class="active-char-preview">
            <div class="char-avatar-ring" id="title-char-avatar">
              <!-- Canvas rendered dynamically -->
            </div>
            <div class="char-preview-info">
              <div class="char-preview-name">${activeChar.name}</div>
              <div class="char-preview-item">${activeSkin.name}</div>
            </div>
          </div>

          <nav class="menu-button-group" aria-label="Acciones principales">
            <button class="btn btn-main" id="btn-play-game">
              ${menuIcon('play')}<span class="menu-action-copy"><strong>Jugar</strong></span>
            </button>
            <button class="btn btn-menu" id="btn-char-select">
              ${menuIcon('ball')}<span class="menu-action-copy"><strong>Personajes</strong></span>
            </button>
            <button class="btn btn-menu" id="btn-world-select">
              ${menuIcon('map')}<span class="menu-action-copy"><strong>Mundos</strong></span>
            </button>
            <button class="btn btn-menu" id="btn-open-editor">
              ${menuIcon('hammer')}<span class="menu-action-copy"><strong>Editor 3D</strong></span>
            </button>
            <button class="btn btn-menu btn-secondary" id="btn-options">
              ${menuIcon('gear')}<span class="menu-action-copy"><strong>Opciones</strong></span>
            </button>
          </nav>
          <div class="title-panel-footer"><span>MEGA RAMP</span><span>Versión 1.0.0</span></div>
        </div>
        </div>
      </section>
    `;
    const entryButton=this.root.querySelector<HTMLButtonElement>('#btn-enter-menu');
    entryButton?.addEventListener('click',()=>this.enterTitleMenu());
    entryButton?.focus({preventScroll:true});
    this.root.querySelectorAll<HTMLElement>('.title-character-ball').forEach(ball=>{
      ball.querySelector('.title-ball-face')!.appendChild(SpriteTextures.getCharacterAvatarCanvas(ball.dataset.orbitChar!,80,ball.dataset.orbitSkin!));
    });
    this.screenReadiness.push(revealUIBackdrop(this.root.querySelector<HTMLElement>('.menu-landscape')!,[
      getWorldById(this.state.selectedWorld).image??assetUrl('/assets/maps/overworld_master.jpg'),assetUrl('/assets/maps/overworld_master.jpg')
    ]));

    // Render active character sprite thumbnail on title
    const avatarRing = this.root.querySelector<HTMLElement>("#title-char-avatar");
    if (avatarRing) {
      avatarRing.innerHTML = "";
      const c = SpriteTextures.getCharacterAvatarCanvas(activeChar.id, 96, activeSkin.id);
      c.style.cssText =
        "width: 48px; height: 48px; max-width: 48px; max-height: 48px; border-radius: 50%; display: block; position: static !important; pointer-events: none;";
      avatarRing.appendChild(c);
    }

    this.root.querySelector("#btn-play-game")?.addEventListener("click", () => {
      this.showScreen("world-select");
    });

    this.root.querySelector("#btn-char-select")?.addEventListener("click", () => {
      this.charSelectOrigin='title';
      this.showScreen("character-select");
    });

    this.root.querySelector("#btn-world-select")?.addEventListener("click", () => {
      this.showScreen("world-select");
    });

    this.root.querySelector("#btn-open-editor")?.addEventListener("click", () => {
      this.callbacks.onOpenEditor();
    });

    this.root.querySelector("#btn-options")?.addEventListener("click", () => {
      this.showScreen("options");
    });
  }

  private enterTitleMenu():void {
    if(this.titleEntered||this.state.screen!=='title')return;
    this.titleEntered=true;
    // Playback is requested within the Play gesture, before the visual transition.
    try{this.audio.startMenuBGM(true);}catch(error){console.warn('La música no ha podido iniciarse; el menú sigue disponible.',error);}
    const screen=this.root.querySelector<HTMLElement>('.title-screen-refined'),
      panel=this.root.querySelector<HTMLElement>('.title-menu-panel'),
      button=this.root.querySelector<HTMLButtonElement>('#btn-enter-menu');
    screen?.classList.remove('is-title-intro');
    screen?.setAttribute('aria-label','Menú principal');
    if(panel){panel.inert=false;panel.removeAttribute('inert');panel.removeAttribute('aria-hidden');}
    if(button){button.inert=true;button.setAttribute('aria-hidden','true');}
    const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
    this.titleEntryFocusTimer=setTimeout(()=>{
      this.titleEntryFocusTimer=undefined;
      if(this.state.screen==='title'&&screen?.isConnected)this.root.querySelector<HTMLButtonElement>('#btn-play-game')?.focus({preventScroll:true});
    },reduce?0:800);
  }

  beginStageTransition():void {
    // Keep the victory view in place for the short swap; never insert the level loading cover.
    this.state.screen='loading';this.audio.updateRoll(0);this.root.setAttribute('aria-busy','true');
    this.root.querySelectorAll<HTMLButtonElement>('button').forEach(button=>{button.disabled=true;});
  }

  showLevelLoading(world:number,level:number,stage:number):void {
    this.showScreen('loading');
    const worldDef=getWorldById(world),levelDef=worldDef.levels?.find(item=>item.level===level);
    const character=getCharacterById(this.state.selectedCharacter),skin=getCharacterSkin(character.id,this.state.selectedSkin);
    this.root.innerHTML=`<section class="screen level-loading-screen" aria-label="Cargando nivel" aria-busy="true">
      <div class="loading-landscape" aria-hidden="true"></div>
      <div class="loading-heading"><span class="loading-brand">MEGA RAMP</span><span>MUNDO ${world} · NIVEL ${level}</span></div>
      <div class="loading-content"><p class="loading-eyebrow">${worldDef.icon} ${worldDef.name}</p><h1>${levelDef?.name??`Nivel ${level}`}</h1><div class="loading-separator"></div>
      <p class="loading-tip" id="loading-tip"></p></div>
      <div class="loading-bottom"><div class="loading-avatar-spin" aria-hidden="true"><div class="loading-avatar-face"></div></div>
      <div class="loading-status" role="status" aria-live="polite">Preparando tu aventura<span aria-hidden="true">…</span></div><div class="loading-character">${character.name} · ${skin.name}</div>
      <div class="loading-trail" aria-hidden="true"><span></span></div></div>
      <span class="loading-stage">ETAPA ${String(stage).padStart(2,'0')}</span>
    </section>`;
    this.root.querySelector('#loading-tip')!.textContent=this.loadingTips.next(world,level);
    this.root.querySelector('.loading-avatar-face')!.appendChild(SpriteTextures.getCharacterAvatarCanvas(character.id,128,skin.id));
    void revealUIBackdrop(this.root.querySelector<HTMLElement>('.loading-landscape')!,[
      levelDef?.image??assetUrl(`/assets/maps/world${world}level${level}.jpg`),worldDef.image??assetUrl(`/assets/maps/world${world}.jpg`)
    ]);
  }

  showLoadingError(retry:()=>void,back:()=>void):void {
    const screen=this.root.querySelector('.level-loading-screen');if(!screen)return;
    screen.setAttribute('aria-busy','false');screen.classList.add('has-load-error');
    const content=this.root.querySelector('.loading-content')!;
    content.innerHTML='<h1>No se ha podido cargar</h1><p class="loading-tip">Puedes volver a intentarlo o regresar al menú.</p><div class="loading-error-actions"><button id="btn-load-retry" class="btn btn-main">Reintentar</button><button id="btn-load-back" class="btn btn-menu">Volver al menú</button></div>';
    this.root.querySelector('.loading-status')!.textContent='La carga se ha interrumpido';
    this.root.querySelector('#btn-load-retry')!.addEventListener('click',retry,{once:true});
    this.root.querySelector('#btn-load-back')!.addEventListener('click',back,{once:true});
  }

  // 2. Character Select Screen (4 Characters + 3D Interactive Roll Preview)
  private renderCharacterSelectScreen(): void {
    if (this.characterPreview) {
      this.characterPreview.destroy();
      this.characterPreview = null;
    }

    const activeCharId = this.state.selectedCharacter || CHARACTERS[0].id;
    // Warm only the neutral portrait of each form; six-pose sets remain lazy on selection.
    for(const character of CHARACTERS)for(const skin of getCharacterSkins(character.id)) {
      SpriteTextures.getCharacterTexture(character.id,'normal',skin.id);
    }

    this.root.innerHTML = `
      <section class="screen char-screen">
        <div class="char-screen-layout">
          <!-- LEFT PANE: Character Cards Selection (Oriented to the left) -->
          <div class="char-selection-pane">
            <div class="menu-header">
              <button class="btn btn-back" id="btn-back">⬅ Volver</button>
              <h2>Elige a tu Personaje</h2>
            </div>

            <div class="char-grid-compact">
              ${CHARACTERS.map(
                c => {
                  const isSelected = c.id === activeCharId;
                  return `
                  <div class="char-card ${isSelected ? "selected" : ""}" data-char="${c.id}" style="--char-color: ${c.themeColor}">
                    <div class="char-header" style="background: ${c.themeColor}; display: flex; align-items: center; justify-content: center; position: relative;">
                      <div class="char-canvas-slot" data-slot="${c.id}"></div>
                    </div>
                    <div class="char-body">
                      <div class="char-name-row">
                        <h3>${c.name}</h3>
                        ${isSelected ? '<span class="char-active-pill">En Uso</span>' : ""}
                      </div>
                      <p class="char-desc">${c.description}</p>
                      
                      <div class="stat-bars">
                        <div class="stat-row">
                          <span class="stat-label">Velocidad</span>
                          <div class="bar-track">
                            <div class="bar-fill" style="width: ${c.speed * 100}%;"></div>
                          </div>
                        </div>
                        <div class="stat-row">
                          <span class="stat-label">Aceleración</span>
                          <div class="bar-track">
                            <div class="bar-fill" style="width: ${c.acceleration * 100}%;"></div>
                          </div>
                        </div>
                        <div class="stat-row">
                          <span class="stat-label">Manejo</span>
                          <div class="bar-track">
                            <div class="bar-fill" style="width: ${c.handling * 100}%;"></div>
                          </div>
                        </div>
                      </div>

                      <div class="char-item-badge">
                        <span class="char-item-name">${c.collectibleName}</span>
                        <div class="char-item-slot" data-item-slot="${c.collectibleId}"></div>
                      </div>
                      <div class="char-skins" role="group" aria-label="Formas de ${c.name}">
                        ${getCharacterSkins(c.id).map(skin => `
                          <button type="button" class="char-skin" data-skin="${skin.id}" data-skin-char="${c.id}"
                            ${this.progression.isSkinUnlocked(c.id,skin.id)?'':'disabled aria-disabled="true"'}
                            aria-label="${c.name}: ${skin.name}${this.progression.isSkinUnlocked(c.id,skin.id)?'':' · Bloqueada'}" title="${skin.unlock&&!this.progression.isSkinUnlocked(c.id,skin.id)?`${skin.name} · Consigue el 80 % en ${getWorldById(skin.unlock.world).name} (${this.progression.getWorldCollectionProgress(skin.unlock.world).collected}/320)`:skin.name}"
                            aria-pressed="${skin.id === this.progression.getSelectedSkin(c.id)}">
                            <span class="char-skin-eyes" aria-hidden="true" data-eyes-char="${c.id}" data-eyes-skin="${skin.id}"></span>
                          </button>`).join('')}
                      </div>
                      <div class="char-skin-name" aria-live="polite">${getCharacterSkin(c.id, this.progression.getSelectedSkin(c.id)).name}</div>
                    </div>
                  </div>
                `;
                }
              ).join("")}
            </div>
          </div>

          <!-- RIGHT PANE: 3D Live Interactive Ball Preview with Real-time Physics & WASD / Joystick -->
          <div class="char-preview-pane" id="char-preview-container">
            <!-- Rendered by CharacterPreview class -->
          </div>
        </div>
      </section>
    `;

    this.root.querySelectorAll<HTMLElement>('[data-eyes-char]').forEach(slot => {
      slot.appendChild(SpriteTextures.getCharacterEyesCanvas(slot.dataset.eyesChar!, slot.dataset.eyesSkin!));
    });

    // Render character preview canvas in each card header and collectible icon in badge
    CHARACTERS.forEach(c => {
      const slot = this.root.querySelector<HTMLElement>(`[data-slot="${c.id}"]`);
      if (slot) {
        slot.innerHTML = "";
        const cvs = SpriteTextures.getCharacterAvatarCanvas(c.id, 140, this.progression.getSelectedSkin(c.id));
        cvs.style.cssText =
          "width: 48px; height: 48px; max-width: 48px; max-height: 48px; border-radius: 50%; display: block; position: static !important; pointer-events: none; background: rgba(255, 255, 255, 0.28); border: 2px solid rgba(255, 255, 255, 0.85); box-shadow: 0 4px 10px rgba(0,0,0,0.35);";
        slot.appendChild(cvs);
      }

      const itemSlot = this.root.querySelector<HTMLElement>(`[data-item-slot="${c.collectibleId}"]`);
      if (itemSlot) {
        itemSlot.innerHTML = "";
        const itemCvs = SpriteTextures.getCollectibleCanvas(c.collectibleId, 28);
        itemCvs.style.cssText = "display: block; width: 28px; height: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.45));";
        itemSlot.appendChild(itemCvs);
      }
    });

    // Mount 3D Interactive Character Preview on the right
    const previewContainer = this.root.querySelector<HTMLElement>("#char-preview-container");
    if (previewContainer) {
      this.characterPreview = new CharacterPreview(previewContainer, activeCharId, {
        onCharacterChanged: (charId) => {
          this.updateCardSelectionVisuals(charId);
        }
      }, this.progression.getSelectedSkin(activeCharId),this.progression.getGraphicsQuality());
    }

    this.root.querySelector("#btn-back")?.addEventListener("click", () => {
      if (this.charSelectOrigin === "pause") {
        this.showScreen("pause");
      } else {
        this.showScreen("title");
      }
    });

    // Handle character card clicks (selecting switches the 3D preview and state)
    this.root.querySelectorAll<HTMLElement>(".char-card").forEach(card => {
      card.addEventListener("click", () => {
        const charId = card.getAttribute("data-char")!;
        this.applyCharacterSelection(charId);
        this.characterPreview?.setCharacter(charId, this.progression.getSelectedSkin(charId));
        this.updateCardSelectionVisuals(charId);
        this.audio.playClick();
      });
    });
    this.root.querySelectorAll<HTMLButtonElement>('.char-skin').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation();
        const charId = button.dataset.skinChar!;
        if(!this.progression.isSkinUnlocked(charId,button.dataset.skin!))return;
        this.progression.setSelectedSkin(charId, button.dataset.skin!);
        this.applyCharacterSelection(charId);
        this.characterPreview?.setCharacter(charId, this.state.selectedSkin);
        this.updateCardSelectionVisuals(charId);
        this.audio.playClick();
      });
    });
  }

  private applyCharacterSelection(charId: string): void {
    this.state.selectedCharacter = charId;
    this.state.selectedSkin = this.progression.getSelectedSkin(charId);
    this.progression.setSelectedCharacter(charId);
    this.callbacks.onSelectCharacter(charId);
  }

  private updateCardSelectionVisuals(selectedCharId: string): void {
    this.root.querySelectorAll<HTMLElement>(".char-card").forEach(card => {
      const id = card.getAttribute("data-char");
      const isSelected = id === selectedCharId;
      card.classList.toggle("selected", isSelected);
      if (id) {
        const skin = getCharacterSkin(id, this.progression.getSelectedSkin(id));
        card.querySelectorAll<HTMLButtonElement>('.char-skin').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.skin === skin.id)));
        const skinName = card.querySelector('.char-skin-name');
        if (skinName) skinName.textContent = skin.name;
        const avatar = card.querySelector('[data-slot]');
        if (avatar && avatar.getAttribute('data-current-skin') !== skin.id) {
          const canvas = SpriteTextures.getCharacterAvatarCanvas(id, 140, skin.id);
          canvas.style.cssText = 'width:48px;height:48px;border-radius:50%;pointer-events:none';
          avatar.replaceChildren(canvas);
          avatar.setAttribute('data-current-skin', skin.id);
        }
      }

      const nameRow = card.querySelector(".char-name-row");
      if (nameRow) {
        const existingPill = nameRow.querySelector(".char-active-pill");
        if (isSelected && !existingPill) {
          const pill = document.createElement("span");
          pill.className = "char-active-pill";
          pill.textContent = "En Uso";
          nameRow.appendChild(pill);
        } else if (!isSelected && existingPill) {
          existingPill.remove();
        }
      }
    });
  }

  // 3. Interactive Overworld Map Screen (Villamanta & 8 Worlds)
  private renderWorldSelectScreen(): void {
    if (this.overworldMap) {
      this.overworldMap.destroy();
      this.overworldMap = null;
    }

    this.overworldMap = new OverworldMap(
      this.root,
      this.state,
      this.progression,
      {
        onStartStage: (world, level, stage) => {
          this.callbacks.onStartStage(world, level, stage);
        },
        onBackToTitle: () => {
          this.showScreen("title");
        }
      }
    );
  }

  // 4. Level Select Screen redirects to Overworld Map
  private renderLevelSelectScreen(): void {
    this.renderWorldSelectScreen();
  }

  // 5. Stage Select Screen (10 Stages per Level)
  private renderStageSelectScreen(): void {
    const worldDef = getWorldById(this.state.selectedWorld);

    this.root.innerHTML = `
      <section class="screen stage-screen">
        <div class="menu-container">
          <div class="menu-header">
            <button class="btn btn-back" id="btn-back">⬅ Niveles</button>
            <h2>${worldDef.icon} ${worldDef.name} - N${this.state.selectedLevel}: Subniveles (1 a 10)</h2>
          </div>

          <div class="stage-grid">
            ${Array.from({ length: 10 }, (_, i) => i + 1).map(stg => {
              const isUnlocked = this.progression.isStageUnlocked(
                this.state.selectedWorld,
                this.state.selectedLevel,
                stg
              );
              const data = this.progression.getStage(
                this.state.selectedWorld,
                this.state.selectedLevel,
                stg
              );
              const baked = getBakedStage(this.state.selectedWorld, this.state.selectedLevel, stg);
              const stageName = baked?.name ? `: ${baked.name}` : "";

              return `
                <div class="stage-card ${isUnlocked ? "unlocked" : "locked"} ${data?.completed ? "completed" : ""}">
                  <div class="stage-header">Etapa ${stg}${stageName}</div>
                  <div class="stage-status">
                    ${data?.completed ? "🏆 Completado" : isUnlocked ? "Desbloqueado" : "🔒"}
                  </div>
                  ${data?.bestTime ? `<div class="stage-time">Récord: ${data.bestTime.toFixed(2)}s</div>` : ""}
                  ${data?.collectibles !== undefined ? `<div class="stage-time">⭐ ${data.collectibles}/${this.progression.getStageMaxCollectibles(this.state.selectedWorld, this.state.selectedLevel, stg)}</div>` : ""}
                  ${
                    isUnlocked
                      ? `<button class="btn btn-stage-start" data-play-stage="${stg}">Iniciar</button>`
                      : ""
                  }
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </section>
    `;

    this.root.querySelector("#btn-back")?.addEventListener("click", () => {
      this.showScreen("level-select");
    });

    this.root.querySelectorAll("[data-play-stage]").forEach(btn => {
      btn.addEventListener("click", () => {
        const stg = Number(btn.getAttribute("data-play-stage"));
        this.state.selectedStage = stg;
        this.callbacks.onStartStage(
          this.state.selectedWorld,
          this.state.selectedLevel,
          stg
        );
      });
    });
  }

  // 6. Victory Screen (GOAL!)
  private renderVictoryScreen(): void {
    const char = getCharacterById(this.state.selectedCharacter);

    this.root.innerHTML = `
      <section class="screen victory-screen">
        <div class="modal-card victory-card">
          <div class="goal-ribbon-badge">¡META!</div>
          <h2>¡ETAPA COMPLETADA!</h2>
          <p class="victory-subtitle">
            Mundo ${this.state.selectedWorld} • Nivel ${this.state.selectedLevel} • Etapa ${this.state.selectedStage}
          </p>

          <div class="victory-stats">
            <div class="vstat-item">
              <span class="vstat-label">Tiempo</span>
              <span class="vstat-val">${this.state.elapsedTime.toFixed(2)}s</span>
            </div>
            <div class="vstat-item">
              <span class="vstat-label"><span data-collectible-icon="${char.collectibleId}"></span> ${char.collectibleName}</span>
              <span class="vstat-val">${this.state.stageCollectibles} / ${this.progression.getStageMaxCollectibles(this.state.selectedWorld, this.state.selectedLevel, this.state.selectedStage)}</span>
            </div>
            <div class="vstat-item">
              <span class="vstat-label">Vidas Restantes</span>
              <span class="vstat-val">❤️ x${this.state.lives}</span>
            </div>
          </div>

          <div class="victory-buttons">
            <button class="btn btn-main" id="btn-next-stage">⏩ Siguiente Etapa</button>
            <button class="btn btn-secondary" id="btn-repeat-stage">🔄 Repetir</button>
            <button class="btn btn-menu" id="btn-return-stages">📋 Selección de Etapas</button>
          </div>
        </div>
      </section>
    `;

    this.root.querySelector("#btn-next-stage")?.addEventListener("click", () => {
      this.callbacks.onNextStage();
    });

    this.root.querySelector("#btn-repeat-stage")?.addEventListener("click", () => {
      this.callbacks.onRestartStage();
    });

    this.root.querySelector("#btn-return-stages")?.addEventListener("click", () => {
      this.showScreen("stage-select");
    });
  }

  private confettiAnimationId: number | null = null;

  // 6.5. Level Clear Celebration Screen (When beating Stage 10!)
  private renderLevelClearScreen(): void {
    const skinRewards=this.progression.getUnannouncedSkinRewards(this.state.selectedWorld);
    if (this.confettiAnimationId !== null) {
      cancelAnimationFrame(this.confettiAnimationId);
      this.confettiAnimationId = null;
    }

    const worldDef = getWorldById(this.state.selectedWorld);
    const char = getCharacterById(this.state.selectedCharacter);

    const totalLevelTime = this.state.levelRunTime;
    const totalCollectibles = this.state.levelRunCollectibles;

    const maxLevelCollectibles = this.progression.getLevelMaxCollectibles(
      this.state.selectedWorld,
      this.state.selectedLevel
    );

    const mins = Math.floor(totalLevelTime / 60);
    const secs = (totalLevelTime % 60).toFixed(2);
    const timeDisplay = `${mins > 0 ? `${mins}m ` : ""}${secs}s`;

    const record = this.progression.getLevelRecord(
      this.state.selectedWorld,
      this.state.selectedLevel
    );
    const isNewTimeRecord = record.bestTime !== null && totalLevelTime <= record.bestTime;
    const isNewCollectiblesRecord = totalCollectibles >= record.totalCollectibles && totalCollectibles > 0;

    this.root.innerHTML = `
      <section class="screen victory-screen level-clear-screen">
        <div class="modal-card victory-card" style="position: relative; overflow: hidden; max-width: 520px; border: 2px solid #ffd700; box-shadow: 0 0 35px rgba(255, 215, 0, 0.45);">
          <canvas id="confetti-canvas" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;"></canvas>
          
          <div style="position: relative; z-index: 2;">
            <div class="goal-ribbon-badge" style="background: linear-gradient(90deg, #ff1744, #d500f9); font-size: 1.3rem;">
              🎉 ¡ENHORABUENA! 🎉
            </div>
            <h2 style="color: #ffd700; font-size: 1.6rem; margin: 8px 0;">¡NIVEL COMPLETADO!</h2>
            <p class="victory-subtitle" style="font-size: 1.05rem; color: #fff; margin-bottom: 16px;">
              ¡Has superado con éxito las <strong>10 etapas</strong> del Nivel ${this.state.selectedLevel} en <strong>${worldDef.name}</strong>!
            </p>

            ${skinRewards.map(reward=>{
              const rewardCharacter=getCharacterById(reward.characterId),rewardSkin=getCharacterSkin(reward.characterId,reward.skinId);
              return `<div class="skin-reward-card" role="status" aria-live="polite">
                <div class="skin-reward-portrait" data-reward-character="${reward.characterId}" data-reward-skin="${reward.skinId}" aria-hidden="true"></div>
                <div><p class="skin-reward-heading">¡Nueva skin desbloqueada!</p><p class="skin-reward-name">${rewardCharacter.name} · ${rewardSkin.name}</p><p class="skin-reward-detail">Has conseguido el 80 % de los coleccionables de ${worldDef.name}.</p></div>
              </div>`;
            }).join('')}
            <div class="victory-stats">
              <div class="vstat-item">
                <span class="vstat-label">Tiempo de este Intento</span>
                <span class="vstat-val" style="color: ${isNewTimeRecord ? "#ffd700" : "#fff"}">
                  ${timeDisplay} ${isNewTimeRecord ? "⭐" : ""}
                </span>
              </div>
              <div class="vstat-item">
                <span class="vstat-label"><span data-collectible-icon="${char.collectibleId}"></span> ${char.collectibleName} de este Intento</span>
                <span class="vstat-val" style="color: ${isNewCollectiblesRecord ? "#00e676" : "#fff"}">
                  ${totalCollectibles} / ${maxLevelCollectibles} ${isNewCollectiblesRecord ? "⭐" : ""}
                </span>
              </div>
              <div class="vstat-item">
                <span class="vstat-label">Vidas Restantes</span>
                <span class="vstat-val">❤️ x${this.state.lives}</span>
              </div>
            </div>

            <div class="victory-buttons" style="margin-top: 18px;">
              <button class="btn btn-main btn-glow" id="btn-return-levels" style="font-size: 1rem; padding: 12px 20px;">
                🏆 Volver a Selección de Niveles (¡Siguiente Nivel Desbloqueado!)
              </button>
            </div>
          </div>
        </div>
      </section>
    `;

    this.root.querySelectorAll<HTMLElement>('[data-reward-character]').forEach(slot=>{
      slot.appendChild(SpriteTextures.getCharacterAvatarCanvas(slot.dataset.rewardCharacter!,160,slot.dataset.rewardSkin!));
    });
    this.progression.markSkinRewardsAnnounced(skinRewards);

    // Confetti animation on canvas
    const canvas = this.root.querySelector<HTMLCanvasElement>("#confetti-canvas");
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 480;
      canvas.height = canvas.parentElement?.clientHeight || 420;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const colors = ["#ff1744", "#ffd700", "#00e5ff", "#00e676", "#d500f9", "#ff9100", "#ffffff"];
        const confettiPieces = Array.from({ length: 90 }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * -canvas.height,
          size: 5 + Math.random() * 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 3.5,
          vy: 2.5 + Math.random() * 4,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.15
        }));

        const animateConfetti = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (const p of confettiPieces) {
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.rotSpeed;
            if (p.y > canvas.height) {
              p.y = -10;
              p.x = Math.random() * canvas.width;
            }
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
          }
          this.confettiAnimationId = requestAnimationFrame(animateConfetti);
        };
        this.confettiAnimationId = requestAnimationFrame(animateConfetti);
      }
    }

    this.root.querySelector("#btn-return-levels")?.addEventListener("click", () => {
      if (this.confettiAnimationId !== null) {
        cancelAnimationFrame(this.confettiAnimationId);
        this.confettiAnimationId = null;
      }
      this.showScreen("level-select");
    });
  }

  // 7. Game Over Screen (Restart from Stage 1 of current Level!)
  private renderGameOverScreen(): void {
    if (this.confettiAnimationId !== null) {
      cancelAnimationFrame(this.confettiAnimationId);
      this.confettiAnimationId = null;
    }

    this.root.innerHTML = `
      <section class="screen gameover-screen">
        <div class="modal-card gameover-card">
          <h2 style="color: #ff5252; margin: 12px 0 24px 0; font-size: 2.2rem; font-weight: 900; letter-spacing: 1px;">¡FIN!</h2>

          <div class="victory-buttons">
            <button class="btn btn-main btn-glow" id="btn-retry-5lives">Reiniciar</button>
            <button class="btn btn-menu" id="btn-go-menu">Menú</button>
          </div>
        </div>
      </section>
    `;

    this.root.querySelector("#btn-retry-5lives")?.addEventListener("click", () => {
      this.state.lives = 5;
      this.state.elapsedTime = 0;
      this.state.stageCollectibles = 0;
      this.state.resetLevelRun();
      this.state.selectedStage = 1;
      this.callbacks.onStartStage(
        this.state.selectedWorld,
        this.state.selectedLevel,
        1
      );
    });

    this.root.querySelector("#btn-go-menu")?.addEventListener("click", () => {
      this.callbacks.onReturnToMenu();
    });
  }

  // 8. Pause Screen
  private renderPauseScreen(): void {
    this.root.innerHTML = `
      <section class="screen pause-screen">
        <div class="modal-card">
          <h2>⏸️ JUEGO EN PAUSA</h2>

          <div style="margin: 16px 0; text-align: left; background: rgba(0,0,0,0.35); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15);">
            <div style="margin-bottom: 14px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-weight: 700; font-size: 0.9rem;">
                <span>🎵 Volumen de Música:</span>
                <span id="pause-val-bgm" style="color: #00e5ff; font-weight: 800;">${Math.round(this.audio.getBGMVolume() * 100)}%</span>
              </div>
              <input type="range" min="0" max="100" value="${Math.round(this.audio.getBGMVolume() * 100)}" id="pause-slider-bgm" style="width: 100%; cursor: pointer;" />
            </div>

            <div style="margin-bottom: 14px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-weight: 700; font-size: 0.9rem;">
                <span>🔊 Volumen de Efectos (SFX):</span>
                <span id="pause-val-sfx" style="color: #ffd700; font-weight: 800;">${Math.round(this.audio.getSFXVolume() * 100)}%</span>
              </div>
              <input type="range" min="0" max="100" value="${Math.round(this.audio.getSFXVolume() * 100)}" id="pause-slider-sfx" style="width: 100%; cursor: pointer;" />
            </div>

            <label class="toggle-row" style="margin-bottom: 0;">
              <span>Silenciar audio:</span>
              <input type="checkbox" id="pause-chk-mute" ${this.audio.getMuted() ? "checked" : ""} />
            </label>
          </div>

          <div class="menu-button-group">
            <button class="btn btn-main" id="btn-resume">Continuar</button>
            <button class="btn btn-secondary" id="btn-pause-restart">Reiniciar Nivel</button>
            <button class="btn btn-secondary" id="btn-pause-char">Cambiar Personaje</button>
            <button class="btn btn-danger" id="btn-pause-exit">Salir al Menú</button>
          </div>
        </div>
      </section>
    `;

    const bgmSlider = this.root.querySelector<HTMLInputElement>("#pause-slider-bgm");
    const bgmVal = this.root.querySelector<HTMLElement>("#pause-val-bgm");
    bgmSlider?.addEventListener("input", () => {
      const vol = Number(bgmSlider.value) / 100;
      this.audio.setBGMVolume(vol);
      if (bgmVal) bgmVal.textContent = `${bgmSlider.value}%`;
    });

    const sfxSlider = this.root.querySelector<HTMLInputElement>("#pause-slider-sfx");
    const sfxVal = this.root.querySelector<HTMLElement>("#pause-val-sfx");
    sfxSlider?.addEventListener("input", () => {
      const vol = Number(sfxSlider.value) / 100;
      this.audio.setSFXVolume(vol);
      if (sfxVal) sfxVal.textContent = `${sfxSlider.value}%`;
    });

    this.root.querySelector("#pause-chk-mute")?.addEventListener("change", e => {
      const isMuted = (e.target as HTMLInputElement).checked;
      this.audio.setMuted(isMuted);
    });

    this.root.querySelector("#btn-resume")?.addEventListener("click", () => {
      this.callbacks.onResume();
    });

    this.root.querySelector("#btn-pause-restart")?.addEventListener("click", () => {
      this.state.lives = 5;
      this.state.elapsedTime = 0;
      this.state.stageCollectibles = 0;
      this.state.resetLevelRun();
      if (this.callbacks.onRestartLevel) {
        this.callbacks.onRestartLevel();
      } else {
        this.callbacks.onRestartStage();
      }
    });

    this.root.querySelector("#btn-pause-char")?.addEventListener("click", () => {
      this.charSelectOrigin = "pause";
      this.showScreen("character-select");
    });

    this.root.querySelector("#btn-pause-exit")?.addEventListener("click", () => {
      this.callbacks.onReturnToMenu();
    });
  }

  // 9. Options Screen (Volume controls, CRT filter, test unlock)
  private renderGameClearScreen():void {
    const summary=this.progression.getSummary(),hours=Math.floor(summary.time/3600),minutes=Math.floor(summary.time%3600/60),seconds=Math.floor(summary.time%60);
    this.root.innerHTML=`<section class="screen game-clear-screen"><div class="modal-card finale-card"><p class="finale-eyebrow">EL VIAJE COMPLETO</p><h1>MEGA RAMP</h1><h2>¡Has llegado al final!</h2><p>Ocho mundos. Un viaje desde Villamanta hasta las auroras de Noruega.</p><div class="finale-stats"><div><strong>${summary.completed}/320</strong><span>Etapas superadas</span></div><div><strong>${summary.collectibles}</strong><span>Coleccionables registrados</span></div><div><strong>${hours}h ${minutes}m ${seconds}s</strong><span>Suma de tus mejores tiempos</span></div><div><strong>${summary.characters}/4</strong><span>Personajes con niveles completados</span></div></div><p>Siempre queda una nueva ruta, un récord que superar o un personaje con el que volver.</p><div class="finale-credits"><h3>Créditos</h3><p>MEGA RAMP · Una aventura creada con cariño.</p><p>Motor gráfico: Three.js · Física: Rapier<br>Inspiración jugable: Super Monkey Ball</p><p>Gracias por jugar.</p></div><button class="btn btn-primary" id="finale-worlds">Seguir explorando</button><button class="btn btn-secondary" id="finale-menu">Volver al menú</button></div></section>`;
    this.root.querySelector('#finale-worlds')?.addEventListener('click',()=>this.showScreen('world-select'));
    this.root.querySelector('#finale-menu')?.addEventListener('click',()=>this.callbacks.onReturnToMenu());
    this.audio.playLifeUp();
  }
  private renderOptionsScreen(): void {
    const allUnlocked = this.progression.isAllUnlocked();

    this.root.innerHTML = `
      <section class="screen options-screen">
        <div class="modal-card">
          <div class="menu-header">
            <button class="btn btn-back" id="btn-back">⬅ Volver</button>
            <h2>Opciones</h2>
          </div>

          <div class="options-group">
            <div class="options-volume">
              <div class="options-volume-heading">
                <label for="opt-slider-bgm">Volumen de música:</label>
                <span id="opt-val-bgm">${Math.round(this.audio.getBGMVolume() * 100)}%</span>
              </div>
              <input type="range" min="0" max="100" value="${Math.round(this.audio.getBGMVolume() * 100)}" id="opt-slider-bgm" />
            </div>

            <div class="options-volume">
              <div class="options-volume-heading">
                <label for="opt-slider-sfx">Volumen de efectos:</label>
                <span id="opt-val-sfx">${Math.round(this.audio.getSFXVolume() * 100)}%</span>
              </div>
              <input type="range" min="0" max="100" value="${Math.round(this.audio.getSFXVolume() * 100)}" id="opt-slider-sfx" />
            </div>

            <label class="toggle-row options-toggle">
              <span>Silenciar audio:</span>
              <input type="checkbox" id="chk-sfx" ${this.audio.getMuted() ? "checked" : ""} />
            </label>

            <div class="options-toggles">
              <label class="toggle-row options-toggle">
                <span>Mostrar FPS:</span>
                <input type="checkbox" id="chk-show-fps" ${this.progression.isShowFPS() ? "checked" : ""} />
              </label>

              <label class="toggle-row options-toggle">
                <span>Mostrar velocidad:</span>
                <input type="checkbox" id="chk-show-speed" ${this.progression.isShowSpeed() ? "checked" : ""} />
              </label>

            </div>

            <div class="options-display-row">
              <label class="options-control" for="select-fps-limit"><span>Límite FPS:</span>
                <select id="select-fps-limit">
                  <option value="60" ${this.progression.getFPSLimit() === "60" ? "selected" : ""}>60 FPS</option>
                  <option value="30" ${this.progression.getFPSLimit() === "30" ? "selected" : ""}>30 FPS</option>
                </select>
              </label>
              <label class="options-control" for="select-graphics-quality"><span>Gráficos:</span>
                <select id="select-graphics-quality">
                  <option value="low" ${this.progression.getGraphicsQuality() === "low" ? "selected" : ""}>Bajo</option>
                  <option value="medium" ${this.progression.getGraphicsQuality() === "medium" ? "selected" : ""}>Medio</option>
                  <option value="high" ${this.progression.getGraphicsQuality() === "high" ? "selected" : ""}>Alto</option>
                </select>
              </label>
            </div>
            <label class="options-camera-row" for="select-camera-mode"><span>Cámara:</span>
              <select id="select-camera-mode" aria-describedby="camera-1-description camera-2-description">
                <option value="1" ${this.progression.getCameraMode()===1?'selected':''}>Cámara 1</option>
                <option value="2" ${this.progression.getCameraMode()===2?'selected':''}>Cámara 2</option>
              </select>
            </label>
          </div>
          <div class="options-summary">
            <div class="options-camera-note ${this.progression.getCameraMode()===1?'is-active':''}" data-camera-note="1" id="camera-1-description"><strong>Cámara 1</strong><p>Sigue tu movimiento, gira suavemente con izquierda o derecha y se aleja al ganar velocidad.</p></div>
            <div class="options-camera-note ${this.progression.getCameraMode()===2?'is-active':''}" data-camera-note="2" id="camera-2-description"><strong>Cámara 2</strong><p>Mantiene el encuadre clásico durante el movimiento y se orienta al detenerte.</p></div>
          </div>
          <div class="options-group backup-options">
            <h3>Tu partida</h3><p>Guarda una copia para conservar tus récords, coleccionables y personajes.</p>
            <button class="btn btn-secondary" id="backup-export">Exportar partida</button>
            <button class="btn btn-secondary" id="backup-pick">Importar partida</button>
            <input id="backup-file" type="file" accept="application/json,.json" hidden />
            <p id="backup-preview" role="status" aria-live="polite"></p>
            <button class="btn btn-primary" id="backup-apply" hidden>Sustituir mi partida con esta copia</button>
          </div>
          <div class="options-footer">
            <button class="btn ${allUnlocked ? "btn-danger" : "btn-secondary"}" id="btn-cheat-unlock" style="width: 100%; font-weight: 800;">
              ${
                allUnlocked
                  ? "🔒 Bloquear Niveles (Restablecer Nubes / Solo Superados)"
                  : "⭐ Desbloquear Todos los Niveles (Modo Test)"
              }
            </button>
          </div>
        </div>
      </section>
    `;

    const optBgmSlider = this.root.querySelector<HTMLInputElement>("#opt-slider-bgm");
    const optBgmVal = this.root.querySelector<HTMLElement>("#opt-val-bgm");
    optBgmSlider?.addEventListener("input", () => {
      const vol = Number(optBgmSlider.value) / 100;
      this.audio.setBGMVolume(vol);
      if (optBgmVal) optBgmVal.textContent = `${optBgmSlider.value}%`;
    });

    let pendingBackup:string|undefined;
    this.root.querySelector('#backup-export')?.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([this.progression.exportBackup()],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`Mega-RAMP-partida-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    const file=this.root.querySelector<HTMLInputElement>('#backup-file'),preview=this.root.querySelector<HTMLElement>('#backup-preview'),apply=this.root.querySelector<HTMLButtonElement>('#backup-apply');
    this.root.querySelector('#backup-pick')?.addEventListener('click',()=>file?.click());
    file?.addEventListener('change',async()=>{pendingBackup=undefined;if(apply)apply.hidden=true;const selected=file.files?.[0];if(!selected)return;try{if(selected.size>2_000_000)throw new Error('La copia es demasiado grande.');const text=await selected.text(),data=readProgressBackup(text);let completed=0;for(const levels of Object.values(data.worlds))for(const stages of Object.values(levels))for(const stage of Object.values(stages))if(stage.completed)completed++;pendingBackup=text;if(preview)preview.textContent=`Copia válida: ${completed} ${completed===1?'etapa superada':'etapas superadas'}. Importarla sustituirá tu progreso actual. Puedes exportarlo antes de continuar.`;if(apply)apply.hidden=false;}catch(error){if(preview)preview.textContent=error instanceof Error?error.message:'No se ha podido leer la copia.';}});
    apply?.addEventListener('click',()=>{if(!pendingBackup)return;try{this.progression.importBackup(pendingBackup);this.state.selectedCharacter=this.progression.getSelectedCharacter();this.state.selectedSkin=this.progression.getSelectedSkin(this.state.selectedCharacter);this.callbacks.onSelectCharacter(this.state.selectedCharacter);pendingBackup=undefined;apply.hidden=true;if(preview)preview.textContent='Partida importada y guardada correctamente.';}catch{if(preview)preview.textContent='No se ha podido guardar la copia. Tu partida anterior sigue intacta.';}});    const optSfxSlider = this.root.querySelector<HTMLInputElement>("#opt-slider-sfx");
    const optSfxVal = this.root.querySelector<HTMLElement>("#opt-val-sfx");
    optSfxSlider?.addEventListener("input", () => {
      const vol = Number(optSfxSlider.value) / 100;
      this.audio.setSFXVolume(vol);
      if (optSfxVal) optSfxVal.textContent = `${optSfxSlider.value}%`;
    });

    this.root.querySelector("#btn-back")?.addEventListener("click", () => {
      this.showScreen("title");
    });

    this.root.querySelector("#chk-sfx")?.addEventListener("change", e => {
      const isMuted = (e.target as HTMLInputElement).checked;
      this.audio.setMuted(isMuted);
    });

    this.root.querySelector("#chk-show-fps")?.addEventListener("change", e => {
      const isShow = (e.target as HTMLInputElement).checked;
      this.progression.setShowFPS(isShow);
    });

    this.root.querySelector("#chk-show-speed")?.addEventListener("change", e => {
      this.progression.setShowSpeed((e.target as HTMLInputElement).checked);
    });

    this.root.querySelector("#select-fps-limit")?.addEventListener("change", e => {
      const limit = (e.target as HTMLInputElement).value as "60" | "30";
      this.progression.setFPSLimit(limit);
    });

    this.root.querySelector("#select-graphics-quality")?.addEventListener("change", e => {
      const q = (e.target as HTMLSelectElement).value as "low" | "medium" | "high";
      this.progression.setGraphicsQuality(q);
      if (this.callbacks.onQualityChange) {
        this.callbacks.onQualityChange(q);
      }
    });
    this.root.querySelector('#select-camera-mode')?.addEventListener('change',e=>{
      const mode=(e.target as HTMLSelectElement).value==='2'?2:1;this.progression.setCameraMode(mode);this.callbacks.onCameraModeChange?.(mode);
      this.root.querySelectorAll<HTMLElement>('[data-camera-note]').forEach(note=>note.classList.toggle('is-active',note.dataset.cameraNote===String(mode)));
    });

    this.root.querySelector("#btn-cheat-unlock")?.addEventListener("click", () => {
      if (this.progression.isAllUnlocked()) {
        this.progression.resetToDefaultProgression();
        alert("¡Nubes restablecidas! Solo los niveles superados permanecen desbloqueados.");
      } else {
        this.progression.unlockAll();
        alert("¡Todos los 8 Mundos y Niveles desbloqueados para pruebas!");
      }
      this.renderOptionsScreen();
    });
  }

  destroy(): void {
    this.destroyed=true;this.clouds?.destroy();
    window.removeEventListener('mega-ramp-save-error',this.saveWarning);clearTimeout(this.noticeTimer);this.root.parentElement?.querySelector('.game-notice')?.remove();
    if(this.titleEntryFocusTimer!==undefined)clearTimeout(this.titleEntryFocusTimer);
    this.audio.stopMenuBGM();
    this.characterPreview?.destroy();this.characterPreview=null;
    if (this.overworldMap) {
      this.overworldMap.destroy();
      this.overworldMap = null;
    }
    this.root.remove();
  }
}






