/**
 * Baitlab — AI Typing Effect
 *
 * Simulates character-by-character AI typing with configurable speed,
 * blinking cursor, pause/resume/reset, and callback hooks.
 *
 * Usage:
 *   import { TypingEffect } from './typing-effect.js';
 *   const t = new TypingEffect('#output', { speed: 'fast' });
 *   t.type('Hello, world!').then(() => console.log('done'));
 */

/** Speed presets in ms per character */
export const SPEED_PRESETS = {
  fast:   18,
  medium: 45,
  slow:   100,
};

export class TypingEffect {
  /**
   * @param {string|Element} target  CSS selector or DOM element
   * @param {object}  [opts]
   * @param {'fast'|'medium'|'slow'|number} [opts.speed='medium']  Characters per ms
   * @param {boolean} [opts.cursor=true]   Show blinking cursor
   * @param {boolean} [opts.append=false]  Append to existing text
   * @param {Function} [opts.onChar]       Called after each character is typed
   * @param {Function} [opts.onDone]       Called when typing completes
   */
  constructor(target, opts = {}) {
    this._el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!this._el) throw new Error(`TypingEffect: element not found — "${target}"`);

    const {
      speed = 'medium',
      cursor = true,
      append = false,
      onChar = null,
      onDone = null,
    } = opts;

    this._speed   = typeof speed === 'number' ? speed : (SPEED_PRESETS[speed] ?? SPEED_PRESETS.medium);
    this._cursor  = cursor;
    this._append  = append;
    this._onChar  = onChar;
    this._onDone  = onDone;

    this._paused   = false;
    this._stopped  = false;
    this._queue    = [];
    this._running  = false;

    if (cursor) this._buildCursor();
  }

  /* ── Private ──────────────────────────────────────────────── */

  _buildCursor() {
    this._cursorEl = document.createElement('span');
    this._cursorEl.className = 'typing-cursor';
    this._cursorEl.setAttribute('aria-hidden', 'true');
    this._el.insertAdjacentElement('afterend', this._cursorEl);
  }

  _showCursor(v) {
    if (this._cursorEl) this._cursorEl.style.display = v ? '' : 'none';
  }

  async _typeString(text) {
    this._stopped = false;
    if (!this._append) this._el.textContent = '';

    for (let i = 0; i < text.length; i++) {
      if (this._stopped) return;

      // Wait while paused
      while (this._paused) {
        await this._wait(50);
      }
      if (this._stopped) return;

      this._el.textContent += text[i];
      if (typeof this._onChar === 'function') this._onChar(text[i], i, this._el);

      // Vary speed slightly for realism
      const jitter = (Math.random() - 0.5) * this._speed * 0.4;
      await this._wait(this._speed + jitter);
    }
  }

  _wait(ms) {
    return new Promise((r) => setTimeout(r, Math.max(0, ms)));
  }

  /* ── Public API ───────────────────────────────────────────── */

  /**
   * Type a string. Returns a Promise that resolves when done.
   * @param {string} text
   * @returns {Promise<void>}
   */
  async type(text) {
    this._running = true;
    this._showCursor(true);
    await this._typeString(text);
    this._running = false;
    if (!this._stopped) {
      this._showCursor(false);
      if (typeof this._onDone === 'function') this._onDone(this._el);
    }
  }

  /**
   * Type multiple strings sequentially with a delay between each.
   * @param {string[]} lines
   * @param {number} [lineDelay=800]  ms between lines
   * @returns {Promise<void>}
   */
  async typeLines(lines, lineDelay = 800) {
    this._running = true;
    this._showCursor(true);
    if (!this._append) this._el.textContent = '';

    for (let i = 0; i < lines.length; i++) {
      if (this._stopped) break;
      await this._typeString(lines[i]);
      if (i < lines.length - 1) {
        this._el.textContent += '\n';
        await this._wait(lineDelay);
      }
    }

    this._running = false;
    if (!this._stopped) {
      this._showCursor(false);
      if (typeof this._onDone === 'function') this._onDone(this._el);
    }
  }

  /** Pause typing (resumes from current position). */
  pause() { this._paused = true; }

  /** Resume paused typing. */
  resume() { this._paused = false; }

  /** Stop typing entirely. */
  stop() { this._stopped = true; this._paused = false; }

  /** Reset the output element and stop any ongoing animation. */
  reset() {
    this.stop();
    this._el.textContent = '';
    this._running = false;
    this._showCursor(false);
  }

  /** True while a typing animation is in progress. */
  get isRunning() { return this._running; }

  /** Change typing speed on the fly.
   * @param {'fast'|'medium'|'slow'|number} speed
   */
  setSpeed(speed) {
    this._speed = typeof speed === 'number' ? speed : (SPEED_PRESETS[speed] ?? SPEED_PRESETS.medium);
  }
}

/* ── Convenience factory ─────────────────────────────────────── */

/**
 * Quick one-shot typing animation.
 * @param {string|Element} target
 * @param {string|string[]} text
 * @param {object} [opts]
 * @returns {TypingEffect}
 */
export function typeIn(target, text, opts = {}) {
  const effect = new TypingEffect(target, opts);
  if (Array.isArray(text)) {
    effect.typeLines(text, opts.lineDelay ?? 800);
  } else {
    effect.type(text);
  }
  return effect;
}
