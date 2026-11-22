import { describe, expect, it } from 'vitest';
import { MapBackdrop } from '../src/ui/MapBackdrop';

class Video extends EventTarget {
  style = { opacity: '' };
  muted = false;
  playsInline = false;
  readyState = 0;
  paused = true;
  requests: { resolve: () => void; reject: () => void }[] = [];
  querySelector() { return null; }
  pause() { this.paused = true; }
  play() {
    return new Promise<void>((resolve, reject) => this.requests.push({
      resolve: () => { this.paused = false; resolve(); }, reject: () => reject(new Error('Interrupted')),
    }));
  }
}
function fixture() {
  const video = new Video();
  const visibility = Object.assign(new EventTarget(), { hidden: false });
  const backdrop = new MapBackdrop(video as unknown as HTMLVideoElement, visibility as unknown as Document);
  return { video, visibility, backdrop };
}
const tick = async () => { await Promise.resolve(); await Promise.resolve(); };

describe('World map video lifecycle', () => {
  it('keeps the still visible until a decoded playing frame exists', async () => {
    const { video, backdrop } = fixture();
    backdrop.setMode(true);
    expect(video.style.opacity).toBe('0');
    video.requests[0].resolve(); await tick();
    expect(video.style.opacity).toBe('0');
    video.readyState = 2; video.dispatchEvent(new Event('loadeddata'));
    expect(video.style.opacity).toBe('1');
    expect(video.muted && video.playsInline).toBe(true);
    backdrop.destroy();
  });
  it('pauses when animation is disabled and ignores late playing events', async () => {
    const { video, backdrop } = fixture();
    video.readyState = 2;
    backdrop.setMode(true);
    video.requests[0].resolve(); await tick();
    expect(video.style.opacity).toBe('1');
    backdrop.setMode(false);
    video.dispatchEvent(new Event('playing'));
    expect(video.style.opacity).toBe('0'); expect(video.paused).toBe(true);
    backdrop.setMode(true); video.requests[1].resolve(); await tick();
    expect(video.style.opacity).toBe('1');
    backdrop.destroy();
  });
  it('ignores old playback rejections after a new request succeeds', async () => {
    const { video, backdrop } = fixture(); video.readyState = 2;
    backdrop.setMode(true); backdrop.setMode(false); backdrop.setMode(true);
    video.requests[1].resolve(); await tick();
    video.requests[0].reject(); await tick();
    expect(video.style.opacity).toBe('1'); backdrop.destroy();
  });
  it('suspends in a hidden tab and resumes on return, without revealing while animation is disabled', () => {
    const { video, visibility, backdrop } = fixture();
    backdrop.setMode(true);
    visibility.hidden = true; visibility.dispatchEvent(new Event('visibilitychange'));
    expect(video.paused).toBe(true); expect(video.style.opacity).toBe('0');
    visibility.hidden = false; visibility.dispatchEvent(new Event('visibilitychange'));
    expect(video.requests).toHaveLength(2);
    backdrop.setMode(false);
    visibility.dispatchEvent(new Event('visibilitychange'));
    expect(video.requests).toHaveLength(2); backdrop.destroy();
  });
  it('retains the still on decoding failure and stops listening when closed', () => {
    const { video, visibility, backdrop } = fixture();
    backdrop.setMode(true); video.dispatchEvent(new Event('error'));
    expect(video.paused).toBe(true); expect(video.style.opacity).toBe('0');
    backdrop.setMode(true); expect(video.requests).toHaveLength(1);
    backdrop.destroy(); visibility.dispatchEvent(new Event('visibilitychange'));
    video.readyState = 2; video.paused = false; video.dispatchEvent(new Event('playing'));
    expect(video.style.opacity).toBe('0'); expect(video.requests).toHaveLength(1);
  });
});
