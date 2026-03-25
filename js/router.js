/**
 * router.js — Lightweight client-side router
 * Highlights the active nav link based on the current page URL.
 */
(function () {
  'use strict';

  function setActiveLink() {
    var path = window.location.pathname;
    var links = document.querySelectorAll('.navbar-links a');
    links.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      // Normalise: strip trailing slash and leading path
      var linkPath = href.replace(/\/$/, '');
      var currentPath = path.replace(/\/$/, '');

      if (
        (linkPath && currentPath.endsWith(linkPath)) ||
        (linkPath === '' && (currentPath === '' || currentPath === '/'))
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function initMobileMenu() {
    var toggle = document.querySelector('.navbar-toggle');
    var menu = document.querySelector('.navbar-links');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close menu on link click
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setActiveLink();
    initMobileMenu();
  });
})();
