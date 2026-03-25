/**
 * animations.js — Typing animation and UI effects
 */
(function () {
  'use strict';

  /**
   * Typewriter effect.
   * @param {HTMLElement} el  - Target element
   * @param {string[]}    lines - Lines to type
   * @param {number}      speed - Milliseconds per character
   */
  function typewriter(el, lines, speed) {
    if (!el || !lines || lines.length === 0) return;
    speed = speed || 28;
    var li = 0, ci = 0;

    function step() {
      if (li >= lines.length) return;
      var line = lines[li];
      if (ci < line.length) {
        el.textContent += line[ci++];
        setTimeout(step, speed);
      } else {
        el.textContent += '\n';
        ci = 0;
        li++;
        setTimeout(step, 700);
      }
    }
    step();
  }

  // Expose globally so pages can call it
  window.BaitlabAnimations = { typewriter: typewriter };

  // Auto-run if a #typeout element is present (home page terminal)
  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('typeout');
    if (!el) return;
    var lines = [
      'root@baitlab:~$ echo "Welcome to Baitlab"',
      'Welcome to Baitlab \u2014 AI that talks, works, and runs things for you.',
      'root@baitlab:~$ baitlab --start',
      'Initialising AI engine... done.',
      'Ready. Type a command or try the Live Demo.',
    ];
    typewriter(el, lines, 28);
  });
})();
