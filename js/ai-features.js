/**
 * Baitlab — AI Features
 *
 * Orchestrates AI-powered text generation simulation,
 * colour-scheme generation, and smart recommendation display.
 */

import { TypingEffect } from './typing-effect.js';
import { StreamingText } from './streaming-text.js';
import { toast } from './utils.js';

/* ── AI Text Generation Simulation ─────────────────────────── */

/** Sample AI response templates */
const AI_RESPONSES = [
  'Analysing your query… processing with neural pathways…',
  'Generating optimal response — cross-referencing {N} knowledge nodes…',
  'AI confidence: {PCT}% — synthesising answer from {N} data points…',
  'Running inference pipeline… ETA {N}ms…',
  'Context window loaded — drafting response with {N} tokens…',
];

/**
 * Display a simulated AI typing response in a target element.
 * @param {string|Element} target
 * @param {string} prompt       The user prompt text
 * @param {object} [opts]
 * @param {'fast'|'medium'|'slow'} [opts.speed='medium']
 * @param {Function} [opts.onDone]
 * @returns {TypingEffect}
 */
export function aiRespond(target, prompt, opts = {}) {
  // Build a fake AI response
  const n   = Math.floor(Math.random() * 900 + 100);
  const pct = Math.floor(Math.random() * 15 + 84);
  const template = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
  const thinking = template.replace('{N}', n).replace('{PCT}', pct);

  const lines = [
    `> ${prompt}`,
    thinking,
    '',
    generateAIContent(prompt),
  ];

  const effect = new TypingEffect(target, { speed: opts.speed ?? 'medium', append: true, onDone: opts.onDone });
  effect.typeLines(lines, 400);
  return effect;
}

function generateAIContent(prompt) {
  const responses = [
    `Based on your input, I recommend a modular approach with three core phases: initialisation, processing, and output validation. Each phase benefits from isolated error handling and telemetry.`,
    `Excellent question. The optimal solution involves leveraging asynchronous pipelines with backpressure control, ensuring throughput scales linearly with available compute resources.`,
    `My analysis suggests: (1) implement a streaming buffer, (2) apply adaptive rate limiting, and (3) cache frequently accessed embeddings for sub-10ms response times.`,
    `I've identified ${Math.floor(Math.random() * 7) + 3} relevant patterns in your dataset. The dominant signal indicates a ${['positive', 'upward', 'accelerating'][Math.floor(Math.random() * 3)]} trend with ${Math.floor(Math.random() * 20) + 80}% confidence.`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

/* ── AI Colour Scheme Generator ─────────────────────────────── */

const COLOR_PALETTES = [
  { name: 'Cyber Teal',    bg: '#050505', accent: '#00e5ff', secondary: '#00ff66', text: '#c7f6c7' },
  { name: 'Neon Violet',   bg: '#06020f', accent: '#a855f7', secondary: '#ec4899', text: '#e9d5ff' },
  { name: 'Solar Orange',  bg: '#080400', accent: '#f97316', secondary: '#fbbf24', text: '#fef3c7' },
  { name: 'Arctic Blue',   bg: '#02040a', accent: '#38bdf8', secondary: '#818cf8', text: '#e0f2fe' },
  { name: 'Bio Green',     bg: '#010a04', accent: '#4ade80', secondary: '#86efac', text: '#dcfce7' },
];

/**
 * Generate a random AI colour palette and optionally apply it to the page.
 * @param {boolean} [apply=false]  Apply the palette as CSS custom properties
 * @returns {{ name: string, bg: string, accent: string, secondary: string, text: string }}
 */
export function generateColorScheme(apply = false) {
  const palette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
  if (apply) {
    const root = document.documentElement;
    root.style.setProperty('--bg',    palette.bg);
    root.style.setProperty('--cyan',  palette.accent);
    root.style.setProperty('--lime',  palette.secondary);
    root.style.setProperty('--text',  palette.text);
    toast(`AI applied palette: ${palette.name}`, 'success');
  }
  return palette;
}

/* ── AI Navigation Predictor ────────────────────────────────── */

const NAV_SUGGESTIONS = {
  '/':               ['pages/ai-features.html', 'pages/3d-showcase.html', 'pages/slides.html'],
  'ai-features':     ['pages/3d-showcase.html', 'pages/demo.html', 'pages/portfolio.html'],
  '3d-showcase':     ['pages/ai-features.html', 'pages/portfolio.html', 'pages/demo.html'],
  'slides':          ['pages/info-hub.html', 'pages/portfolio.html', 'pages/demo.html'],
  'info-hub':        ['pages/slides.html', 'pages/ai-features.html', 'pages/demo.html'],
  'portfolio':       ['pages/demo.html', 'pages/ai-features.html', 'pages/3d-showcase.html'],
  'demo':            ['pages/portfolio.html', 'pages/ai-features.html', 'pages/3d-showcase.html'],
};

/**
 * Get AI-suggested next pages for a given current page key.
 * @param {string} currentPage
 * @returns {string[]}
 */
export function getNavSuggestions(currentPage) {
  const key = currentPage.replace(/.*\//, '').replace('.html', '') || '/';
  return NAV_SUGGESTIONS[key] ?? NAV_SUGGESTIONS['/'];
}

/* ── AI Stream Demo ──────────────────────────────────────────── */

const STREAM_DEMO_LINES = [
  { text: '$ baitlab init --mode=ai --verbose', type: 'cmd' },
  { text: '[INFO]  Bootstrapping AI engine…',   type: 'info' },
  { text: '[INFO]  Loading language models…',    type: 'info' },
  { text: '[OK]    Models loaded (128M params)', type: 'success' },
  { text: '[INFO]  Connecting to inference API…',type: 'info' },
  { text: '[OK]    API connected (latency: 14ms)',type: 'success' },
  { text: '[INFO]  Warming up neural pathways…', type: 'info' },
  { text: '[OK]    Ready — 0 errors detected',   type: 'success' },
  { text: '',                                    type: 'dim' },
  { text: '$ baitlab run --task="analyse data"', type: 'cmd' },
  { text: '[AI]    Parsing input dataset…',      type: 'info' },
  { text: '[AI]    Running feature extraction…', type: 'info' },
  { text: '[AI]    Cross-referencing 847 nodes', type: 'info' },
  { text: '[AI]    Confidence threshold: 94.7%', type: 'success' },
  { text: '[DONE]  Task complete in 342ms',      type: 'success' },
];

/**
 * Start the AI boot-sequence stream demo.
 * @param {string|Element} container
 * @param {object} [opts]
 * @returns {StreamingText}
 */
export function startAIStreamDemo(container, opts = {}) {
  const { StreamingText: ST } = window.__baitlab__ ?? {};

  // Dynamic import fallback — module may already be imported
  const stream = new StreamingText(container, STREAM_DEMO_LINES, {
    delay: opts.delay ?? 320,
    autoScroll: true,
    showProgress: opts.showProgress ?? false,
    onComplete: opts.onComplete,
  });
  return stream.start();
}

// Re-export StreamingText for inline use if needed
export { StreamingText } from './streaming-text.js';
