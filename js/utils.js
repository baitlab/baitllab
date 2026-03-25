/**
 * utils.js — Shared utility functions
 */
(function () {
  'use strict';

  var Utils = {
    /**
     * Throttle a function to run at most once per `limit` ms.
     */
    throttle: function (fn, limit) {
      var last = 0;
      return function () {
        var now = Date.now();
        if (now - last >= limit) {
          last = now;
          fn.apply(this, arguments);
        }
      };
    },

    /**
     * Escape HTML special characters.
     */
    escapeHtml: function (str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    },

    /**
     * Scroll an element to its bottom.
     */
    scrollToBottom: function (el) {
      if (el) el.scrollTop = el.scrollHeight;
    },
  };

  window.BaitlabUtils = Utils;
})();
