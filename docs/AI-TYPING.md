# AI Typing Effect — Documentation

The `TypingEffect` class simulates character-by-character AI typing with configurable speed, blinking cursor, pause/resume/reset controls, and callbacks.

## Quick Start

```html
<!-- Include the module -->
<div id="output"></div>
<script type="module">
  import { TypingEffect } from './js/typing-effect.js';

  const t = new TypingEffect('#output', { speed: 'fast' });
  t.type('Hello, world!');
</script>
```

## Constructor

```js
new TypingEffect(target, options)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `target` | `string \| Element` | CSS selector or DOM element to type into |
| `options.speed` | `'fast' \| 'medium' \| 'slow' \| number` | Characters per ms (default: `'medium'`) |
| `options.cursor` | `boolean` | Show blinking cursor (default: `true`) |
| `options.append` | `boolean` | Append to existing content (default: `false`) |
| `options.onChar` | `Function` | Callback after each character: `(char, index, el) => void` |
| `options.onDone` | `Function` | Callback when typing completes: `(el) => void` |

## Speed Presets

| Preset | ms / character |
|--------|---------------|
| `'fast'` | 18ms |
| `'medium'` | 45ms |
| `'slow'` | 100ms |

A ±40% random jitter is applied to each character delay to create an organic typing feel.

## Methods

### `type(text): Promise<void>`
Type a single string character by character.

```js
await t.type('Processing your request…');
```

### `typeLines(lines, lineDelay?): Promise<void>`
Type an array of strings with a pause between each line.

```js
await t.typeLines([
  'root@baitlab:~$ status',
  '[OK] All systems operational',
], 600); // 600ms between lines
```

### `pause()`
Pause typing at the current character position.

### `resume()`
Resume from where typing was paused.

### `stop()`
Stop typing permanently (call `reset()` then re-type to restart).

### `reset()`
Clear the output element and stop any ongoing animation.

### `setSpeed(speed)`
Change speed on the fly: `'fast'`, `'medium'`, `'slow'`, or a number in ms.

### `isRunning` (getter)
`true` while a typing animation is in progress.

## Convenience Factory

```js
import { typeIn } from './js/typing-effect.js';

// Single string
typeIn('#output', 'Hello!', { speed: 'fast' });

// Multiple lines
typeIn('#output', ['Line 1', 'Line 2'], { speed: 'medium', lineDelay: 500 });
```

## CSS Integration

The blinking cursor is a `<span class="typing-cursor">` inserted after the target element. Style it via `.typing-cursor` in your CSS.

```css
.typing-cursor {
  display: inline-block;
  width: 9px;
  height: 1.1em;
  background: #00e5ff;
  animation: blink 1s steps(2, start) infinite;
}
```

## Examples

### Speed comparison
```js
const fast   = new TypingEffect('#fast',   { speed: 'fast' });
const medium = new TypingEffect('#medium', { speed: 'medium' });
const slow   = new TypingEffect('#slow',   { speed: 'slow' });

fast.type('Fast typing — 18ms per character');
medium.type('Medium typing — 45ms per character');
slow.type('Slow typing — 100ms per character');
```

### With callbacks
```js
const t = new TypingEffect('#output', {
  speed: 'medium',
  onChar: (char, i) => console.log(`Typed: ${char} at position ${i}`),
  onDone: (el) => console.log('Done! Content:', el.textContent),
});
t.type('Callback example');
```

### Pause and resume
```js
const t = new TypingEffect('#output', { speed: 'slow' });
t.type('This is a very long sentence that we will pause halfway through…');

setTimeout(() => t.pause(),  2000); // pause after 2s
setTimeout(() => t.resume(), 4000); // resume after 4s
```
