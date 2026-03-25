# Streaming Text — Documentation

The `StreamingText` class streams an array of text lines into a container element one-by-one, with configurable delay, auto-scroll, progress tracking, and event callbacks.

## Quick Start

```html
<div id="stream" class="stream-box"></div>

<script type="module">
  import { StreamingText } from './js/streaming-text.js';

  const stream = new StreamingText('#stream', [
    { text: '$ baitlab init', type: 'cmd' },
    { text: 'AI engine ready', type: 'success' },
    { text: 'All systems nominal', type: 'success' },
  ], { delay: 400 });

  stream.start();
</script>
```

## Constructor

```js
new StreamingText(container, lines, options)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `container` | `string \| Element` | CSS selector or DOM element |
| `lines` | `Array<string \| { text, type }>` | Lines to stream |
| `options.delay` | `number` | ms between lines (default: `350`) |
| `options.autoScroll` | `boolean` | Scroll to latest line (default: `true`) |
| `options.showProgress` | `boolean` | Render a progress bar after the container (default: `false`) |
| `options.onLine` | `Function` | Called after each line: `(line, index) => void` |
| `options.onComplete` | `Function` | Called when streaming finishes |

## Line Types

Strings are treated as `'info'` type. Objects specify a `type` for styling:

| Type | CSS class | Colour |
|------|-----------|--------|
| `'cmd'` | `.stream-line.cmd` | Cyan |
| `'info'` | `.stream-line.info` | Default text |
| `'success'` | `.stream-line.success` | Lime green |
| `'error'` | `.stream-line.error` | Red |
| `'warn'` | `.stream-line.warn` | Amber |
| `'dim'` | `.stream-line.dim` | Muted |

## Methods

### `start(): this`
Begin streaming from the current position. No-op if already running.

### `pause(): this`
Pause the stream. Resumes from the same position with `.resume()`.

### `resume(): this`
Resume a paused stream.

### `stop(): this`
Stop streaming permanently.

### `reset(): this`
Clear the container and reset the line index to 0. Call `.start()` to replay.

### `append(lines): this`
Add more lines after construction (even while streaming).

```js
stream.append([
  { text: 'New line added dynamically', type: 'info' },
]);
```

### `progress` (getter)
Returns current progress as a float `0–1`.

### `isRunning` (getter)
`true` while streaming is active.

## Convenience Factory

```js
import { streamIn } from './js/streaming-text.js';

streamIn('#stream', [
  '$ connecting…',
  'Connected!',
], { delay: 300 });
```

## Progress Bar

Set `showProgress: true` to automatically insert a styled `<div class="progress-wrap">` after the container:

```js
new StreamingText('#stream', lines, {
  showProgress: true,
  delay: 300,
}).start();
```

Or connect your own:

```js
const bar = document.querySelector('.progress-bar');
new StreamingText('#stream', lines, {
  onLine: (_, i) => {
    bar.style.width = `${((i + 1) / lines.length) * 100}%`;
  },
}).start();
```

## Multiple Concurrent Streams

Each `StreamingText` instance is independent, so you can run multiple streams simultaneously:

```js
const s1 = new StreamingText('#stream-1', lines1, { delay: 200 }).start();
const s2 = new StreamingText('#stream-2', lines2, { delay: 500 }).start();
```

## CSS Reference

```css
.stream-box {
  background: rgba(0,0,0,0.65);
  border: 1px solid rgba(255,255,255,0.05);
  border-top: 2px solid #00ff66;
  border-radius: 10px;
  padding: 16px 18px;
  min-height: 120px;
  max-height: 280px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.7;
}

.stream-line.cmd     { color: #00e5ff; }
.stream-line.success { color: #00ff66; }
.stream-line.error   { color: #f87171; }
.stream-line.dim     { color: rgba(200,246,200,0.35); }
```
