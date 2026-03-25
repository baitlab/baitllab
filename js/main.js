/**
 * Baitlab — Main Entry Point
 *
 * Bootstraps all UI components, animations, and AI features
 * for the main index page.
 */

import { TypingEffect } from './typing-effect.js';
import { initComponents } from './components.js';
import { initAnimations  } from './animations.js';
import { initRevealOnScroll } from './utils.js';

/* ── Terminal typewriter ─────────────────────────────────────── */

function startTerminal() {
  const out = document.getElementById('typeout');
  if (!out) return;

  const lines = [
    'root@baitlab:~$ echo "Welcome to Baitlab"',
    'Welcome to Baitlab — AI that talks, works, and runs things for you.',
    '',
    'root@baitlab:~$ baitlab status',
    '[✓] AI engine online',
    '[✓] 3D renderer ready',
    '[✓] Streaming pipeline active',
    '[✓] All systems operational',
    '',
    'Type "Get Started" to begin your journey →',
  ];

  const effect = new TypingEffect(out, {
    speed: 'fast',
    cursor: true,
    append: false,
  });

  effect.typeLines(lines, 550);
}

/* ── Nav button behaviour ────────────────────────────────────── */

function initNavButtons() {
  // Smooth scroll to sections
  document.querySelectorAll('[data-scroll-to]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.scrollTo);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── CTA primary button ──────────────────────────────────────── */

function initCTAs() {
  const cta = document.querySelector('.btn-primary[data-cta="start"]');
  if (cta) {
    cta.addEventListener('click', () => {
      window.location.href = 'pages/demo.html';
    });
  }
}

/* ── Bootstrap ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initComponents();
  initAnimations();
  initRevealOnScroll();
  initNavButtons();
  initCTAs();
  startTerminal();
});
