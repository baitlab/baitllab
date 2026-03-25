/**
 * demo-handler.js — Interactive Live Demo logic
 * Handles command parsing and simulated AI responses.
 */
(function () {
  'use strict';

  var outputEl = document.getElementById('demo-output');
  var inputEl  = document.getElementById('demo-input');
  var runBtn   = document.getElementById('demo-run-btn');

  if (!outputEl || !inputEl || !runBtn) return;

  var initialLines = [
    { text: '[ Baitlab Live Demo ]', cls: 'log-system' },
    { text: 'Type a command below and press Run or Enter.', cls: 'log-system' },
    { text: '', cls: '' },
  ];

  function appendLine(text, cls) {
    var line = document.createElement('div');
    if (cls) line.className = cls;
    line.textContent = text;
    outputEl.appendChild(line);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function renderInitial() {
    outputEl.innerHTML = '';
    initialLines.forEach(function (l) { appendLine(l.text, l.cls); });
  }

  function getResponse(cmd) {
    var lower = cmd.toLowerCase();
    if (lower.includes('call')) {
      return [
        '[AI] Calling...',
        '[AI] Connected.',
        '[AI] Appointment booked \u2705',
      ];
    }
    if (lower.includes('schedule') || lower.includes('meeting')) {
      return [
        '[AI] Checking calendar...',
        '[AI] Meeting scheduled \uD83D\uDCC5',
      ];
    }
    if (lower.includes('remind')) {
      return ['[AI] Reminder set \u23F0'];
    }
    if (lower.includes('automate') || lower.includes('workflow')) {
      return [
        '[AI] Building workflow...',
        '[AI] Automation active \uD83D\uDD04',
      ];
    }
    if (lower.includes('execute') || lower.includes('run')) {
      return [
        '[AI] Executing task...',
        '[AI] Task completed \u2705',
      ];
    }
    return ['[AI] Processing...', '[AI] Task completed \u2705'];
  }

  function runCommand() {
    var cmd = (inputEl.value || '').trim();
    if (!cmd) return;

    appendLine('> ' + cmd, 'log-user');
    inputEl.value = '';
    inputEl.disabled = true;
    runBtn.disabled = true;

    appendLine('[AI] Thinking...', 'log-ai');

    setTimeout(function () {
      // Remove the "Thinking..." line
      var last = outputEl.lastChild;
      if (last) outputEl.removeChild(last);

      var responses = getResponse(cmd);
      var delay = 0;
      responses.forEach(function (resp) {
        setTimeout(function () {
          appendLine(resp, 'log-ai');
        }, delay);
        delay += 350;
      });

      setTimeout(function () {
        appendLine('', '');
        inputEl.disabled = false;
        runBtn.disabled = false;
        inputEl.focus();
      }, delay);
    }, 1200);
  }

  runBtn.addEventListener('click', runCommand);
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') runCommand();
  });

  // Hint chips — click to populate input
  document.querySelectorAll('.hint-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      inputEl.value = chip.textContent.replace(/^>\s*/, '');
      inputEl.focus();
    });
  });

  renderInitial();
})();
