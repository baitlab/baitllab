/**
 * Baitlab — UI Components
 *
 * Tabs, collapsibles, modals, carousels, dropdowns, progress bars,
 * ripple buttons, and toast notifications.
 */

import { toast } from './utils.js';

/* ── Tabs ────────────────────────────────────────────────────── */

/**
 * Initialise all tab groups on the page.
 * Each group needs:
 *   <div class="tabs"> <button class="tab-btn active" data-tab="id">…</button> </div>
 *   <div class="tab-content active" id="id">…</div>
 */
export function initTabs() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.tab;
      if (!id) return;

      // Deactivate siblings
      const group = btn.closest('.tabs');
      if (group) {
        group.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      }
      btn.classList.add('active');

      // Show corresponding content
      const scope = btn.closest('[data-tabs-scope]') ?? document;
      scope.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
      const target = scope.querySelector(`#${id}`);
      if (target) target.classList.add('active');
    });
  });
}

/* ── Collapsibles ────────────────────────────────────────────── */

/**
 * Initialise collapsible sections.
 * Expects: <button class="collapsible-btn" data-target="id">
 *          <div class="collapsible-content" id="id">
 */
export function initCollapsibles() {
  document.querySelectorAll('.collapsible-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.target;
      const content = id ? document.getElementById(id) : btn.nextElementSibling;
      if (!content) return;

      const isOpen = content.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

/* ── Modals ──────────────────────────────────────────────────── */

/**
 * Open a modal overlay by id.
 * @param {string} id
 */
export function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Close on overlay click
  const onOverlayClick = (e) => {
    if (e.target === overlay) closeModal(id);
  };
  overlay.addEventListener('click', onOverlayClick, { once: true });

  // Close on Escape
  const onKey = (e) => { if (e.key === 'Escape') closeModal(id); };
  document.addEventListener('keydown', onKey, { once: true });
}

/**
 * Close a modal overlay by id.
 * @param {string} id
 */
export function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/** Initialise all modal triggers.
 * <button data-modal-open="modalId">
 * <button data-modal-close>
 */
export function initModals() {
  document.querySelectorAll('[data-modal-open]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.modalOpen));
  });
  document.querySelectorAll('[data-modal-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const overlay = btn.closest('.modal-overlay');
      if (overlay) closeModal(overlay.id);
    });
  });
}

/* ── Carousels ───────────────────────────────────────────────── */

/**
 * Initialise a carousel element.
 * @param {Element} el  Container element with class `carousel-wrap`
 */
export function initCarousel(el) {
  const track  = el.querySelector('.carousel-track');
  const slides = el.querySelectorAll('.carousel-slide');
  const dots   = el.querySelectorAll('.carousel-dot');
  const prevBtn= el.querySelector('[data-carousel-prev]');
  const nextBtn= el.querySelector('[data-carousel-next]');

  if (!track || slides.length === 0) return;

  let current = 0;

  const goTo = (index) => {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  };

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  // Touch/swipe support
  let touchStartX = 0;
  el.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend',   (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
  });

  // Auto-play option
  const delay = parseInt(el.dataset.autoplay, 10);
  if (delay > 0) setInterval(() => goTo(current + 1), delay);

  goTo(0);
}

/** Initialise all carousels on the page. */
export function initCarousels() {
  document.querySelectorAll('.carousel-wrap').forEach(initCarousel);
}

/* ── Dropdowns ───────────────────────────────────────────────── */

/** Initialise all dropdown toggle buttons. */
export function initDropdowns() {
  document.querySelectorAll('[data-dropdown-toggle]').forEach((btn) => {
    const id = btn.dataset.dropdownToggle;
    const dropdown = id ? document.getElementById(id) : btn.closest('.dropdown');
    if (!dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.open').forEach((d) => d.classList.remove('open'));
  });
}

/* ── Progress Bars ───────────────────────────────────────────── */

/**
 * Animate a progress bar to a target percentage.
 * @param {string|Element} selector
 * @param {number} targetPct  0–100
 * @param {number} [duration=600]
 */
export function animateProgress(selector, targetPct, duration = 600) {
  const bar = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!bar) return;

  const start = parseFloat(bar.style.width) || 0;
  const diff  = targetPct - start;
  const t0    = performance.now();

  const step = (now) => {
    const elapsed = now - t0;
    const progress = Math.min(elapsed / duration, 1);
    const eased   = 1 - (1 - progress) ** 3; // ease-out cubic
    bar.style.width = `${start + diff * eased}%`;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/** Animate all progress bars with data-value attribute on page load. */
export function initProgressBars() {
  document.querySelectorAll('.progress-bar[data-value]').forEach((bar) => {
    const target = parseFloat(bar.dataset.value);
    bar.style.width = '0%';
    setTimeout(() => animateProgress(bar, target, 900), 200);
  });
}

/* ── Ripple Buttons ──────────────────────────────────────────── */

export function initRippleButtons() {
  document.querySelectorAll('.btn-ripple').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect  = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.top  = `${e.clientY - rect.top}px`;
      ripple.style.left = `${e.clientX - rect.left}px`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* ── Master init ─────────────────────────────────────────────── */

/** Initialise all UI components in one call. */
export function initComponents() {
  initTabs();
  initCollapsibles();
  initModals();
  initCarousels();
  initDropdowns();
  initProgressBars();
  initRippleButtons();
}

export { toast };
