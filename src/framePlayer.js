/**
 * ============================================================
 *  CINEMATIC FRAME PLAYER
 *  Renders the 240-frame JPG sequence at 30 FPS on a <canvas>.
 *  - Batch preloads to avoid memory spike
 *  - object-fit: cover scaling (fills viewport, no distortion)
 *  - Seamless loop from frame 240 → frame 1
 *  - Mobile: 15 FPS fallback for performance
 * ============================================================
 */

const TOTAL_FRAMES   = 240;
const FRAME_DIR      = 'ezgif-3c5773385383a0b5-jpg/ezgif-frame-';
const FRAME_EXT      = '.jpg';
const TARGET_FPS     = 30;
const MOBILE_FPS     = 15;
const BATCH_SIZE     = 40;
const PLAY_THRESHOLD = 30;   // start playback after this many frames are loaded

export class FramePlayer {
  constructor(canvasId) {
    this.canvas     = document.getElementById(canvasId);
    this.ctx        = this.canvas.getContext('2d', { alpha: false });
    this.frames     = new Array(TOTAL_FRAMES).fill(null);
    this.loadedCount = 0;
    this.currentFrame = 0;
    this.lastTimestamp = 0;
    this.playing    = false;
    this.rafId      = null;

    // Mobile check
    this.isMobile   = window.innerWidth < 768;
    this.fps        = this.isMobile ? MOBILE_FPS : TARGET_FPS;
    this.frameInterval = 1000 / this.fps;
    // On mobile, advance 2 frames per tick (equivalent to skipping alternate frames)
    this.frameStep  = this.isMobile ? 2 : 1;

    // Image natural dimensions (detected from first loaded frame)
    this.imgW = 0;
    this.imgH = 0;

    // Draw dimensions (cached on resize)
    this.drawX = 0;
    this.drawY = 0;
    this.drawW = 0;
    this.drawH = 0;

    this._resize  = this._resize.bind(this);
    this._animate = this._animate.bind(this);

    window.addEventListener('resize', this._resize, { passive: true });
    this._resize();
    this._loadBatch(0);
  }

  /* ── Helpers ───────────────────────────────────────────── */

  _pad(i) {
    // 1 → "001", 10 → "010", 240 → "240"
    return String(i).padStart(3, '0');
  }

  _updateDrawRect() {
    const cw = this.canvasW;
    const ch = this.canvasH;
    if (!this.imgW || !this.imgH) return;

    // object-fit: cover — scale so both dimensions fill
    const scale = Math.max(cw / this.imgW, ch / this.imgH);
    this.drawW = this.imgW * scale;
    this.drawH = this.imgH * scale;
    this.drawX = (cw - this.drawW) / 2;
    this.drawY = (ch - this.drawH) / 2;
  }

  /* ── Resize ─────────────────────────────────────────────── */

  _resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvasW = w;
    this.canvasH = h;

    // Setting canvas.width resets the context transform
    this.canvas.width  = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this._updateDrawRect();

    // Immediately redraw current frame so there is no blank on resize
    const frame = this._getNearestLoadedFrame(this.currentFrame);
    if (frame) this._drawFrame(frame);
  }

  /* ── Frame loading ──────────────────────────────────────── */

  _loadBatch(startIndex) {
    const end = Math.min(startIndex + BATCH_SIZE, TOTAL_FRAMES);
    let done  = 0;
    const total = end - startIndex;

    for (let i = startIndex; i < end; i++) {
      const img = new Image();
      const idx  = i; // capture for closure

      img.onload = () => {
        this.frames[idx] = img;
        this.loadedCount++;
        done++;

        // Detect image dimensions from the first successful load
        if (!this.imgW && img.naturalWidth) {
          this.imgW = img.naturalWidth;
          this.imgH = img.naturalHeight;
          this._updateDrawRect();
        }

        // Start playback as soon as we have enough frames buffered
        if (!this.playing && this.loadedCount >= PLAY_THRESHOLD) {
          this.playing = true;
          this.rafId   = requestAnimationFrame(this._animate);
        }

        // Kick off next batch when this one is complete
        if (done === total && end < TOTAL_FRAMES) {
          this._loadBatch(end);
        }
      };

      img.onerror = () => {
        done++;
        if (done === total && end < TOTAL_FRAMES) {
          this._loadBatch(end);
        }
      };

      img.src = `${FRAME_DIR}${this._pad(i + 1)}${FRAME_EXT}`;
    }
  }

  /* ── Rendering ──────────────────────────────────────────── */

  _getNearestLoadedFrame(index) {
    // Try current
    if (this.frames[index]) return this.frames[index];
    // Scan backward
    for (let i = index - 1; i >= 0; i--) {
      if (this.frames[i]) return this.frames[i];
    }
    // Scan forward (startup edge case)
    for (let i = index + 1; i < TOTAL_FRAMES; i++) {
      if (this.frames[i]) return this.frames[i];
    }
    return null;
  }

  _drawFrame(img) {
    this.ctx.drawImage(
      img,
      this.drawX,
      this.drawY,
      this.drawW,
      this.drawH
    );
  }

  /* ── Animation loop ─────────────────────────────────────── */

  _animate(timestamp) {
    if (!this.playing) return;
    this.rafId = requestAnimationFrame(this._animate);

    const elapsed = timestamp - this.lastTimestamp;
    if (elapsed < this.frameInterval) return;

    // Advance frame index (wrap at TOTAL_FRAMES for seamless loop)
    this.currentFrame = (this.currentFrame + this.frameStep) % TOTAL_FRAMES;

    const frame = this._getNearestLoadedFrame(this.currentFrame);
    if (frame) this._drawFrame(frame);

    // Absorb any drift rather than letting it accumulate
    this.lastTimestamp = timestamp - (elapsed % this.frameInterval);
  }

  /* ── Public API ─────────────────────────────────────────── */

  pause() {
    this.playing = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  resume() {
    if (this.playing) return;
    this.playing = true;
    this.rafId   = requestAnimationFrame(this._animate);
  }

  destroy() {
    this.pause();
    window.removeEventListener('resize', this._resize);
  }
}
