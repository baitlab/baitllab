/**
 * Baitlab Shared Utilities
 * Navbar setup, typing effects, shared helpers.
 */

/* ── Mobile nav hamburger ── */
document.addEventListener('DOMContentLoaded', () => {
  const ham = document.querySelector('.hamburger');
  const nav = document.querySelector('.navbar nav');
  if (ham && nav) {
    ham.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  // Mark active nav link based on current page
  const links = document.querySelectorAll('.nav-btn[href]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    const path = location.pathname;
    if (
      (href === '../index.html' && (path.endsWith('/') || path.endsWith('index.html'))) ||
      (href !== '../index.html' && path.includes(href.replace('../', '').replace('.html', '')))
    ) {
      link.classList.add('active');
    }
  });
});

/* ── Typewriter helper ── */
function typewriter(element, lines, speed = 28, lineDelay = 600) {
  return new Promise(resolve => {
    let li = 0, ci = 0;
    function step() {
      if (li >= lines.length) { resolve(); return; }
      const line = lines[li];
      if (ci < line.length) {
        element.textContent += line[ci++];
        setTimeout(step, speed);
      } else {
        element.textContent += '\n';
        ci = 0; li++;
        setTimeout(step, lineDelay);
      }
    }
    step();
  });
}

/* ── Intersection Observer for scroll animations ── */
function initScrollAnimations() {
  const items = document.querySelectorAll('.anim-on-scroll');
  if (!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('anim-fade-in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);

/* ── Terminal helpers (used by console + demo pages) ── */
function createTerminalLine(text, type = '') {
  const div = document.createElement('div');
  div.className = 'terminal-line' + (type ? ' ' + type : '');
  div.textContent = text;
  return div;
}

function scrollTerminalToBottom(outputEl) {
  outputEl.scrollTop = outputEl.scrollHeight;
}

/* ── Export for pages ── */
window.BaitlabUtils = { typewriter, initScrollAnimations, createTerminalLine, scrollTerminalToBottom };
