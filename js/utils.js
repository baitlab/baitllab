/**
 * Baitlab — Utility Functions
 * Shared helpers used across all JS modules.
 */

/**
 * Select a single element (or throw if missing).
 * @param {string} selector
 * @param {Document|Element} [root=document]
 * @returns {Element}
 */
export function qs(selector, root = document) {
  return root.querySelector(selector);
}

/**
 * Select multiple elements as an Array.
 * @param {string} selector
 * @param {Document|Element} [root=document]
 * @returns {Element[]}
 */
export function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

/**
 * Clamp a number between min and max.
 * @param {number} v
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

/**
 * Linear interpolation.
 * @param {number} a
 * @param {number} b
 * @param {number} t  0–1
 * @returns {number}
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Map a value from one range to another.
 * @param {number} v
 * @param {number} inMin
 * @param {number} inMax
 * @param {number} outMin
 * @param {number} outMax
 * @returns {number}
 */
export function mapRange(v, inMin, inMax, outMin, outMax) {
  return outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/**
 * Return a promise that resolves after `ms` milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce a function.
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle a function.
 * @param {Function} fn
 * @param {number} limit
 * @returns {Function}
 */
export function throttle(fn, limit) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      fn(...args);
    }
  };
}

/**
 * Format a number with optional decimal places.
 * @param {number} n
 * @param {number} [decimals=2]
 * @returns {string}
 */
export function fmt(n, decimals = 2) {
  return n.toFixed(decimals);
}

/**
 * Generate a random float in [min, max).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a random integer in [min, max].
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}

/**
 * Emit a custom DOM event.
 * @param {string} name
 * @param {*} detail
 * @param {Element} [target=document]
 */
export function emit(name, detail, target = document) {
  target.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
}

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'info'|'success'|'error'|'warning'} [type='info']
 * @param {number} [duration=3000]
 */
export function toast(message, type = 'info', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  container.appendChild(el);

  setTimeout(() => {
    el.remove();
  }, duration);
}

/**
 * Observe elements entering the viewport and add a `.revealed` class.
 * @param {string} selector  CSS selector for elements to observe
 */
export function initRevealOnScroll(selector = '.js-reveal') {
  if (!('IntersectionObserver' in window)) {
    // Fallback: reveal everything immediately
    document.querySelectorAll(selector).forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(selector).forEach((el) => observer.observe(el));
}
