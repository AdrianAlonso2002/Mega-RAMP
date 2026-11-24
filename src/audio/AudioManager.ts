import { assetUrl } from "../core/AssetUrl";
import {levelSound,soundFromId,type LevelSound} from './LevelSound';
/**
 * Retro Web Audio API sound synthesizer & BGM Sequencer.
 * Produces Nintendo DS style 8-bit / 16-bit sound effects and looped background music
 * with zero external dependencies.
 */

export interface BGMTrackInfo {
  id: string;
  name: string;
  bpm: number;
}

export class AudioManager {
  private static instance?: AudioManager;
  private ctx?: AudioContext;
  private isMuted = false;
  private rollOsc?: OscillatorNode;
  private rollGain?: GainNode;

  // Audio Node Hierarchy
  private masterGain?: GainNode;
  private bgmGain?: GainNode;
  private sfxGain?: GainNode;

  // Volume levels (0.0 to 1.0)
  private bgmVolume = 0.8;
  private sfxVolume = 0.8;

  // BGM sequencer properties
  private currentTrackId = "jungle_groove";
  private bgmIntervalId: number | null = null;
  private bgmStep = 0;
  private profile?:LevelSound;private nextNoteTime=0;private ambientSource?:AudioBufferSourceNode;private ambientFilter?:BiquadFilterNode;private ambientGain?:GainNode;private noise?:AudioBuffer;
  startLevel(world:number,level:number):void{this.startBGM(levelSound(world,level).id);}
  private warningAt=-10;
  playWarning():void{const ctx=this.initContext();if(!ctx||ctx.currentTime-this.warningAt<.8)return;this.warningAt=ctx.currentTime;this.note(740,ctx.currentTime,.075,.06,'sine',this.sfxGain!);}
  private note(frequency:number,time:number,duration:number,volume:number,type:OscillatorType,destination:AudioNode):void{const ctx=this.ctx!;const oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type=type;oscillator.frequency.value=frequency;gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(volume,time+.015);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);oscillator.connect(gain);gain.connect(destination);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};oscillator.start(time);oscillator.stop(time+duration+.02);}
  private startAmbience(kind:LevelSound['ambient']):void{const ctx=this.ctx;if(!ctx||!this.bgmGain)return;if(!this.noise){this.noise=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const data=this.noise.getChannelData(0);let seed=17;for(let i=0;i<data.length;i++){seed=(seed*16807)%2147483647;data[i]=seed/1073741824-1;}}const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=this.noise;source.loop=true;filter.type=kind==='wind'?'lowpass':'bandpass';filter.frequency.value=kind==='water'?900:kind==='city'?220:kind==='room'?120:450;filter.Q.value=.4;gain.gain.setValueAtTime(0,ctx.currentTime);gain.gain.linearRampToValueAtTime(kind==='room'?.035:.07,ctx.currentTime+1.5);source.connect(filter);filter.connect(gain);gain.connect(this.bgmGain);source.start();this.ambientSource=source;this.ambientFilter=filter;this.ambientGain=gain;}

  static readonly TRACKS: BGMTrackInfo[] = [
    { id: "jungle_groove", name: "🌴 Calypso Island (Tropical)", bpm: 128 },
    { id: "arcade_rush", name: "⚡ Mega RAMP Rush (Arcade)", bpm: 140 },
    { id: "sky_waltz", name: "☁️ Sky Dreams (Relajante)", bpm: 115 },
    { id: "cyber_wave", name: "🌐 Neon Grid (Sintetizador)", bpm: 130 }
  ];

  static getInstance(): AudioManager {
    if (!this.instance) {
      this.instance = new AudioManager();
    }
    return this.instance;
  }

  private resumePending = false;
  private bgmRequested = false;
  private menuRequested = false;
  private menuAudio?: HTMLAudioElement;
  private menuPlayPending = false;
  private audioUnlocked = false;
  private menuRecoveryTimer?: number;

  private constructor() {
    // Restore saved volume preferences
    try {
      const storedBGM = localStorage.getItem("megaramp_bgm_vol");
      if (storedBGM !== null) this.bgmVolume = Math.max(0, Math.min(1, parseFloat(storedBGM)));

      const storedSFX = localStorage.getItem("megaramp_sfx_vol");
      if (storedSFX !== null) this.sfxVolume = Math.max(0, Math.min(1, parseFloat(storedSFX)));
    } catch {
      // LocalStorage fallback
    }

    const unlock = (event:Event) => {
      if (!event.isTrusted || this.isMuted) return;
      if(typeof navigator!=='undefined'&&navigator.userActivation&&!navigator.userActivation.isActive)return;
      this.audioUnlocked = true;
      this.unlockContext();
      this.playMenuAudio();
    };

    if(typeof document!=='undefined')document.addEventListener?.('visibilitychange',()=>{
      if(document.hidden){this.menuAudio?.pause();void this.ctx?.suspend().catch(()=>{});}
      else if(this.audioUnlocked)this.playMenuAudio();
    });
    // Capture creates/resumes audio inside the gesture, before button handlers and async scene loads.
    window.addEventListener("pointerdown", unlock, { passive: true, capture: true });
    window.addEventListener("keydown", unlock, { passive: true, capture: true });
    window.addEventListener("touchstart", unlock, { passive: true, capture: true });
  }

  private unlockContext(): void {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // BGM Gain
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(this.bgmVolume * 0.12, this.ctx.currentTime);
        this.bgmGain.connect(this.masterGain);

        // SFX Gain
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxVolume * 0.35, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === "suspended" && !this.resumePending) {
      this.resumePending=true;
      void this.ctx.resume().then(()=>{
        if(this.bgmRequested)this.startBGM();
      }).catch(()=>{
        // A later real gesture can retry; timers and rendering never call resume().
      }).finally(()=>{this.resumePending=false;});
    }
    if(this.ctx?.state==='running'&&this.bgmRequested)this.startBGM();
  }

  private initContext(): AudioContext | null {
    return !this.isMuted&&this.ctx?.state==='running' ? this.ctx:null;
  }

  // -------------------------------------------------------------
  // Volume Controls (0.0 to 1.0)
  // -------------------------------------------------------------

  setBGMVolume(volume: number): void {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if(this.menuAudio)this.menuAudio.volume=this.bgmVolume;
    try {
      localStorage.setItem("megaramp_bgm_vol", this.bgmVolume.toString());
    } catch {
      // Ignored
    }
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.bgmVolume * 0.12, this.ctx.currentTime);
    }
  }

  getBGMVolume(): number {
    return this.bgmVolume;
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    try {
      localStorage.setItem("megaramp_sfx_vol", this.sfxVolume.toString());
    } catch {
      // Ignored
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume * 0.35, this.ctx.currentTime);
    }
  }

  getSFXVolume(): number {
    return this.sfxVolume;
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if(!muted&&typeof navigator!=='undefined'&&navigator.userActivation?.isActive)this.unlockContext();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
    }
    if (this.isMuted) {
      const menuRequested=this.menuRequested;
      this.stopBGM();
      this.menuRequested=menuRequested;
      if (this.rollGain && this.ctx) {
        this.rollGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      }
    } else {
      if(this.menuRequested)this.playMenuAudio();else this.startBGM();
    }
  }

  // -------------------------------------------------------------
  // SFX: Sound Effects
  // -------------------------------------------------------------

  playCollect(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05); // A5
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.1); // D6

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain ?? ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  playLifeUp(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, index) => {
      const noteTime = now + index * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.22, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain ?? ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.18);
    });
  }

  playBounce(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain ?? ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  playGoal(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fanfare = [
      { f: 392.0, d: 0.1 },
      { f: 523.25, d: 0.1 },
      { f: 659.25, d: 0.1 },
      { f: 783.99, d: 0.15 },
      { f: 1046.5, d: 0.45 }
    ];

    let t = now;
    fanfare.forEach(({ f, d }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + d);

      osc.connect(gain);
      gain.connect(this.sfxGain ?? ctx.destination);

      osc.start(t);
      osc.stop(t + d);
      t += d * 0.85;
    });
  }

  playTeleport(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Futuristic Sci-Fi Resonant Warp Frequency Sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.6);
    osc.frequency.exponentialRampToValueAtTime(2200, now + 1.1);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(260, now);
    filter.frequency.exponentialRampToValueAtTime(2800, now + 0.85);
    filter.Q.setValueAtTime(3.8, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain ?? ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);

    // 2. Cosmic shimmer / sparkle chord
    const shimmerNotes = [880, 1174.66, 1760, 2349.32];
    shimmerNotes.forEach((freq, idx) => {
      const sOsc = ctx.createOscillator();
      const sGain = ctx.createGain();
      const startTime = now + 0.12 + idx * 0.07;

      sOsc.type = "sine";
      sOsc.frequency.setValueAtTime(freq, startTime);
      sOsc.frequency.exponentialRampToValueAtTime(freq * 1.45, startTime + 0.38);

      sGain.gain.setValueAtTime(0.08, startTime);
      sGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.42);

      sOsc.connect(sGain);
      sGain.connect(this.sfxGain ?? ctx.destination);

      sOsc.start(startTime);
      sOsc.stop(startTime + 0.42);
    });
  }

  playFall(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.55);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(this.sfxGain ?? ctx.destination);

    osc.start(now);
    osc.stop(now + 0.55);
  }

  playClick(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain ?? ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  playWaterSplash(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Aquatic bubble pop & splash whoosh
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain ?? ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);

    // Subtle high-pitch aquatic droplet
    const dropOsc = ctx.createOscillator();
    const dropGain = ctx.createGain();
    dropOsc.type = "triangle";
    dropOsc.frequency.setValueAtTime(680, now + 0.04);
    dropOsc.frequency.exponentialRampToValueAtTime(320, now + 0.16);

    dropGain.gain.setValueAtTime(0.14, now + 0.04);
    dropGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    dropOsc.connect(dropGain);
    dropGain.connect(this.sfxGain ?? ctx.destination);

    dropOsc.start(now + 0.04);
    dropOsc.stop(now + 0.16);
  }

  playLavaBurn(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Sizzling fire crackle & descending hiss
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.45);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain ?? ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  updateRoll(speed: number): void {
    const ctx = this.initContext();
    if (!ctx) return;

    if (speed < 0.3) {
      if (this.rollGain) {
        this.rollGain.gain.setValueAtTime(0.0, ctx.currentTime);
      }
      return;
    }

    if (!this.rollOsc) {
      this.rollOsc = ctx.createOscillator();
      this.rollGain = ctx.createGain();
      this.rollOsc.type = "triangle";
      this.rollOsc.frequency.setValueAtTime(60, ctx.currentTime);
      this.rollGain.gain.setValueAtTime(0.0, ctx.currentTime);
      this.rollOsc.connect(this.rollGain);
      this.rollGain.connect(this.sfxGain ?? ctx.destination);
      this.rollOsc.start();
    }

    const targetGain = Math.min(0.06, speed * 0.005);
    const targetFreq = 45 + Math.min(160, speed * 7);

    this.rollGain?.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.05);
    this.rollOsc?.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.05);
  }

  // -------------------------------------------------------------
  // BGM: Background Music Sequencer
  // -------------------------------------------------------------

  startMenuBGM(fromGesture = false): void {
    if(this.menuRequested){if(this.audioUnlocked)this.playMenuAudio();return;}
    this.stopBGM();
    this.menuRequested=true;
    // The first trusted gesture unlocks playback; page loading never calls resume().
    if(fromGesture||this.ctx?.state==='running')this.playMenuAudio();
  }

  private playMenuAudio(): void {
    if(!this.menuRequested||this.isMuted||this.menuPlayPending)return;
    if(typeof document!=='undefined'&&document.hidden)return;
    if(!this.menuAudio){
      this.menuAudio=new Audio(assetUrl('/audio/menu1.mp3'));
      if(this.menuAudio.canPlayType?.('audio/webm; codecs=opus'))this.menuAudio.src=assetUrl('/audio/menu1.webm');
      this.menuAudio.loop=true;
      this.menuAudio.preload='auto';
      this.menuAudio.volume=this.bgmVolume;
      this.menuAudio.addEventListener?.('ended',()=>{
        if(!this.menuRequested)return;
        this.menuAudio!.currentTime=0;
        this.playMenuAudio();
      });
      this.menuAudio.addEventListener?.('error',()=>{
        if(!this.menuAudio?.src.endsWith('.webm'))return;
        this.menuAudio.src=assetUrl('/audio/menu1.mp3');
        if(this.audioUnlocked)this.playMenuAudio();
      });
    }
    if(this.menuRecoveryTimer===undefined&&this.audioUnlocked){
      this.menuRecoveryTimer=window.setInterval(()=>{if(this.audioUnlocked)this.playMenuAudio();},2500);
    }
    this.menuAudio.loop=true;
    if(this.menuAudio.ended)this.menuAudio.currentTime=0;
    if(!this.menuAudio.paused)return;
    this.menuPlayPending=true;
    void this.menuAudio.play().catch(()=>{
      // Autoplay denial or an interrupted play can be retried on the next gesture.
    }).finally(()=>{this.menuPlayPending=false;});
  }

  stopMenuBGM(): void {
    this.menuRequested=false;
    if(this.menuRecoveryTimer!==undefined){window.clearInterval(this.menuRecoveryTimer);this.menuRecoveryTimer=undefined;}
    if(this.menuAudio){this.menuAudio.pause();this.menuAudio.currentTime=0;}
  }

  startBGM(trackId?: string, forceRestart = false): void {
    const targetTrackId = trackId || this.currentTrackId;

    // If already playing this exact track seamlessly, do not interrupt or restart between stages!
    if (!forceRestart && this.bgmIntervalId !== null && this.currentTrackId === targetTrackId) {
      return;
    }

    this.currentTrackId = targetTrackId;
    this.stopBGM();
    this.bgmRequested = true;

    const ctx = this.initContext();
    if (!ctx) return;

    this.profile=soundFromId(targetTrackId);
    const track = this.profile??AudioManager.TRACKS.find(t => t.id === this.currentTrackId) ?? AudioManager.TRACKS[0];
    const stepIntervalMs = (60 / track.bpm / 4) * 1000; // 16th notes

    this.bgmStep=0;this.nextNoteTime=ctx.currentTime+.04;
    this.bgmGain?.gain.setValueAtTime(.001,ctx.currentTime);
    this.bgmGain?.gain.setTargetAtTime(this.bgmVolume*.12,ctx.currentTime,.25);
    if(this.profile)this.startAmbience(this.profile.ambient);
    const schedule=()=>{if(ctx.state!=='running')return;if(this.nextNoteTime<ctx.currentTime-.1)this.nextNoteTime=ctx.currentTime+.02;while(this.nextNoteTime<ctx.currentTime+.12){this.tickBGM(this.nextNoteTime);this.nextNoteTime+=stepIntervalMs/1000;}};
    schedule();this.bgmIntervalId=window.setInterval(schedule,25);
  }
  private tickBGM(scheduledTime?:number): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.bgmGain) return;

    const now=scheduledTime??ctx.currentTime;
    if(this.profile){const i=this.bgmStep++%32,melody=this.profile.melody[i],bass=this.profile.bass[i];if(melody)this.note(melody,now,.24,.045,this.profile.wave,this.bgmGain);if(bass)this.note(bass,now,.32,.035,'sine',this.bgmGain);return;}
    const step = this.bgmStep % 16;
    this.bgmStep++;

    // Notes for tracks (frequencies in Hz)
    const notesJungleMelody = [261.6, 0, 329.6, 0, 392.0, 440.0, 392.0, 0, 329.6, 0, 261.6, 293.7, 329.6, 0, 293.7, 0];
    const notesJungleBass = [130.8, 130.8, 0, 130.8, 164.8, 0, 196.0, 0, 146.8, 0, 146.8, 0, 196.0, 0, 130.8, 0];

    const notesArcadeMelody = [440.0, 493.9, 523.3, 587.3, 659.3, 587.3, 523.3, 493.9, 440.0, 392.0, 440.0, 523.3, 659.3, 0, 783.9, 0];
    const notesArcadeBass = [110.0, 0, 110.0, 0, 130.8, 0, 146.8, 0, 110.0, 0, 110.0, 0, 164.8, 0, 146.8, 0];

    const notesSkyMelody = [392.0, 0, 0, 440.0, 523.3, 0, 587.3, 0, 659.3, 0, 587.3, 0, 523.3, 0, 440.0, 0];
    const notesSkyBass = [98.0, 0, 0, 0, 130.8, 0, 0, 0, 146.8, 0, 0, 0, 164.8, 0, 0, 0];

    const notesCyberMelody = [293.7, 329.6, 349.2, 0, 440.0, 0, 523.3, 440.0, 349.2, 0, 293.7, 0, 329.6, 349.2, 392.0, 0];
    const notesCyberBass = [73.4, 73.4, 0, 73.4, 87.3, 87.3, 0, 87.3, 98.0, 98.0, 0, 98.0, 110.0, 0, 73.4, 0];

    let melodyFreq = 0;
    let bassFreq = 0;

    switch (this.currentTrackId) {
      case "arcade_rush":
        melodyFreq = notesArcadeMelody[step];
        bassFreq = notesArcadeBass[step];
        break;
      case "sky_waltz":
        melodyFreq = notesSkyMelody[step];
        bassFreq = notesSkyBass[step];
        break;
      case "cyber_wave":
        melodyFreq = notesCyberMelody[step];
        bassFreq = notesCyberBass[step];
        break;
      case "jungle_groove":
      default:
        melodyFreq = notesJungleMelody[step];
        bassFreq = notesJungleBass[step];
        break;
    }

    // Play melody note
    if (melodyFreq > 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = this.currentTrackId === "cyber_wave" ? "sawtooth" : "triangle";
      osc.frequency.setValueAtTime(melodyFreq, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start(now);
      osc.stop(now + 0.14);
    }

    // Play bass note
    if (bassFreq > 0) {
      const bOsc = ctx.createOscillator();
      const bGain = ctx.createGain();
      bOsc.type = "square";
      bOsc.frequency.setValueAtTime(bassFreq, now);

      bGain.gain.setValueAtTime(0.04, now);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      bOsc.connect(bGain);
      bGain.connect(this.bgmGain);
      bOsc.start(now);
      bOsc.stop(now + 0.12);
    }
  }

  stopBGM(): void {
    this.ambientSource?.stop();this.ambientSource?.disconnect();this.ambientFilter?.disconnect();this.ambientGain?.disconnect();this.ambientSource=undefined;this.ambientFilter=undefined;this.ambientGain=undefined;
    this.stopMenuBGM();
    this.bgmRequested = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  setBGMTrack(trackId: string): void {
    if (this.bgmIntervalId !== null) {
      this.startBGM(trackId);
    }else this.currentTrackId = trackId;
  }

  getCurrentBGMTrack(): string {
    return this.currentTrackId;
  }

  toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  getMuted(): boolean {
    return this.isMuted;
  }
}




