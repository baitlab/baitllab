/**
 * Baitlab — Streaming Text
 *
 * Streams text arrays line-by-line into a container element,
 * with configurable delay, progress tracking, and event callbacks.
 *
 * Usage:
 *   import { StreamingText } from './streaming-text.js';
 *   const s = new StreamingText('#stream-box', lines, { delay: 400 });
 *   s.start();
 */

export class StreamingText {
  /**
   * @param {string|Element} container  CSS selector or DOM element
   * @param {Array<{text:string, type?:string}>|string[]} lines
   * @param {object} [opts]
   * @param {number}   [opts.delay=350]        ms between lines
   * @param {boolean}  [opts.autoScroll=true]  Scroll to latest line
   * @param {boolean}  [opts.showProgress=false] Show progress indicator
   * @param {Function} [opts.onLine]           Called after each line (line, index)
   * @param {Function} [opts.onComplete]       Called when all lines have streamed
   */
  constructor(container, lines, opts = {}) {
    this._el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this._el) throw new Error(`StreamingText: container not found — "${container}"`);

    // Normalise lines to { text, type } objects
    this._lines = lines.map((l) =>
      typeof l === 'string' ? { text: l, type: 'info' } : l
    );

    const {
      delay       = 350,
      autoScroll  = true,
      showProgress= false,
      onLine      = null,
      onComplete  = null,
    } = opts;

    this._delay        = delay;
    this._autoScroll   = autoScroll;
    this._showProgress = showProgress;
    this._onLine       = onLine;
    this._onComplete   = onComplete;

    this._index    = 0;
    this._timer    = null;
    this._paused   = false;
    this._stopped  = false;
    this._running  = false;
  }

  /* ── Private ──────────────────────────────────────────────── */

  _appendLine({ text, type = 'info' }) {
    const el = document.createElement('div');
    el.className = `stream-line ${type}`;
    el.textContent = text;
    this._el.appendChild(el);

    if (this._autoScroll) {
      this._el.scrollTop = this._el.scrollHeight;
    }
  }

  _buildProgressBar() {
    this._progressWrap = document.createElement('div');
    this._progressWrap.className = 'progress-wrap';
    this._progressBar  = document.createElement('div');
    this._progressBar.className = 'progress-bar';
    this._progressBar.style.width = '0%';
    this._progressWrap.appendChild(this._progressBar);
    this._el.parentNode.insertBefore(this._progressWrap, this._el.nextSibling);
  }

  _updateProgress() {
    if (this._progressBar) {
      const pct = Math.round((this._index / this._lines.length) * 100);
      this._progressBar.style.width = `${pct}%`;
    }
  }

  _schedule() {
    if (this._stopped || this._paused) return;

    if (this._index >= this._lines.length) {
      // Stream complete
      this._running = false;
      if (this._progressBar) this._progressBar.style.width = '100%';
      if (typeof this._onComplete === 'function') this._onComplete();
      return;
    }

    const line = this._lines[this._index];
    this._appendLine(line);
    if (typeof this._onLine === 'function') this._onLine(line, this._index);
    this._updateProgress();
    this._index++;

    this._timer = setTimeout(() => this._schedule(), this._delay);
  }

  /* ── Public API ───────────────────────────────────────────── */

  /** Begin streaming from the start (or from a reset position). */
  start() {
    if (this._running) return this;
    this._stopped = false;
    this._paused  = false;
    this._running = true;
    if (this._showProgress && !this._progressBar) this._buildProgressBar();
    this._schedule();
    return this;
  }

  /** Pause streaming (resume with .resume()). */
  pause() {
    this._paused = true;
    clearTimeout(this._timer);
    return this;
  }

  /** Resume a paused stream. */
  resume() {
    if (!this._paused) return this;
    this._paused = false;
    this._schedule();
    return this;
  }

  /** Stop streaming permanently (call .reset() then .start() to restart). */
  stop() {
    this._stopped = true;
    this._paused  = false;
    this._running = false;
    clearTimeout(this._timer);
    return this;
  }

  /** Clear the container and reset the index. */
  reset() {
    this.stop();
    this._el.innerHTML = '';
    this._index = 0;
    if (this._progressBar) this._progressBar.style.width = '0%';
    return this;
  }

  /** Add more lines to stream after construction.
   * @param {Array<{text:string,type?:string}>|string[]} lines
   */
  append(lines) {
    const normalised = lines.map((l) =>
      typeof l === 'string' ? { text: l, type: 'info' } : l
    );
    this._lines.push(...normalised);
    return this;
  }

  /** Current progress 0–1. */
  get progress() {
    return this._lines.length ? this._index / this._lines.length : 0;
  }

  /** True while streaming is active. */
  get isRunning() { return this._running; }
}

/* ── Convenience factory ─────────────────────────────────────── */

/**
 * Quick one-shot stream into a container.
 * @param {string|Element} container
 * @param {string[]} lines
 * @param {object} [opts]
 * @returns {StreamingText}
 */
export function streamIn(container, lines, opts = {}) {
  const s = new StreamingText(container, lines, opts);
  s.start();
  return s;
}
