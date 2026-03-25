/**
 * Baitlab — Animation Controllers
 *
 * Handles parallax, number counters, element reveals,
 * and gradient animations.
 */

import { debounce, throttle } from './utils.js';

/* ── Parallax ────────────────────────────────────────────────── */

/**
 * Apply a simple CSS parallax effect to elements with data-parallax.
 * @param {number} [depth=0.3]  Speed factor (0 = stationary, 1 = full speed)
 */
export function initParallax(depth = 0.3) {
  const els = Array.from(document.querySelectorAll('[data-parallax]'));
  if (els.length === 0) return;

  const onScroll = throttle(() => {
    const scrollY = window.scrollY;
    els.forEach((el) => {
      const factor = parseFloat(el.dataset.parallax) || depth;
      el.style.transform = `translateY(${scrollY * factor}px)`;
    });
  }, 16);

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── Number Counter ──────────────────────────────────────────── */

/**
 * Animate a number from 0 to its data-count value when visible.
 * Add class `counter-el` and `data-count="N"` to an element.
 */
export function initCounters() {
  const els = document.querySelectorAll('.counter-el[data-count]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      animateCounter(entry.target);
    });
  }, { threshold: 0.5 });

  els.forEach((el) => observer.observe(el));
}

function animateCounter(el) {
  const target   = parseFloat(el.dataset.count) || 0;
  const suffix   = el.dataset.suffix ?? '';
  const prefix   = el.dataset.prefix ?? '';
  const duration = parseFloat(el.dataset.duration) || 1800;
  const decimals = parseInt(el.dataset.decimals ?? '0', 10);
  const t0 = performance.now();

  const step = (now) => {
    const progress = Math.min((now - t0) / duration, 1);
    const eased    = 1 - (1 - progress) ** 3;
    el.textContent = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/* ── Staggered Reveal ────────────────────────────────────────── */

/**
 * Reveal child elements with a staggered delay.
 * Parent needs class `stagger-parent`, children `.stagger-child`.
 */
export function initStaggerReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const children = entry.target.querySelectorAll('.stagger-child');
      children.forEach((child, i) => {
        child.style.animationDelay = `${i * 0.1}s`;
        child.classList.add('anim-fade-in-up');
      });
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.stagger-parent').forEach((el) => observer.observe(el));
}

/* ── Gradient Text Animation ────────────────────────────────── */

/**
 * Apply animated gradient to elements with `.gradient-animate`.
 * (CSS keyframe defined in animations.css — this handles JS fallback.)
 */
export function initGradientText() {
  // CSS handles the animation; this function is a no-op for browsers that
  // support background-clip: text. For others, we fall back to cyan.
  const supportsClip = CSS.supports('-webkit-background-clip', 'text') ||
                       CSS.supports('background-clip', 'text');

  if (!supportsClip) {
    document.querySelectorAll('.gradient-animate').forEach((el) => {
      el.style.color = '#00e5ff';
    });
  }
}

/* ── Scroll Progress Bar ─────────────────────────────────────── */

/**
 * Create and manage a thin scroll-progress indicator at the top of the page.
 */
export function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id    = 'scroll-progress-bar';
  Object.assign(bar.style, {
    position:   'fixed',
    top:        '0',
    left:       '0',
    height:     '2px',
    width:      '0%',
    background: 'linear-gradient(90deg, #00e5ff, #00ff66)',
    zIndex:     '9999',
    transition: 'width 0.1s linear',
    pointerEvents: 'none',
  });
  document.body.prepend(bar);

  const onScroll = throttle(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const pct = scrollTop / (scrollHeight - clientHeight) * 100;
    bar.style.width = `${Math.min(pct, 100)}%`;
  }, 16);

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── Master init ─────────────────────────────────────────────── */

export function initAnimations() {
  initParallax();
  initCounters();
  initStaggerReveal();
  initGradientText();
  initScrollProgress();
}
