/** Keeps the still underneath the video, including while decoding or resuming playback. */
export class MapBackdrop {
  private readonly events = new AbortController();
  private generation = 0;
  private animated = true;
  private failed = false;
  private destroyed = false;

  constructor(private readonly video: HTMLVideoElement, private readonly visibility: Document = document) {
    video.muted = true;
    video.playsInline = true;
    video.style.opacity = '0';
    const options = { signal: this.events.signal };
    video.addEventListener('playing', () => this.reveal(), options);
    video.addEventListener('loadeddata', () => this.reveal(), options);
    const fallback = () => { this.failed = true; this.sync(); };
    video.addEventListener('error', fallback, options);
    video.querySelector('source')?.addEventListener('error', fallback, options);
    visibility.addEventListener('visibilitychange', () => this.sync(), options);
  }

  setMode(animated: boolean): void {
    this.animated = animated;
    this.sync();
  }

  private wantsVideo(): boolean {
    return !this.destroyed && this.animated && !this.failed && !this.visibility.hidden;
  }

  private reveal(): void {
    if (this.wantsVideo() && this.video.readyState >= 2 && !this.video.paused) this.video.style.opacity = '1';
  }

  private sync(): void {
    const generation = ++this.generation;
    if (!this.wantsVideo()) {
      this.video.style.opacity = '0';
      this.video.pause();
      return;
    }
    this.reveal();
    // A rejection from a previous play request must never hide a newer successful frame.
    void this.video.play().then(() => {
      if (generation === this.generation) this.reveal();
    }).catch(() => {
      if (generation === this.generation) this.video.style.opacity = '0';
    });
  }

  destroy(): void {
    this.destroyed = true;
    ++this.generation;
    this.events.abort();
    this.video.style.opacity = '0';
    this.video.pause();
  }
}
