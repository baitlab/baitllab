# 3D Viewer — Documentation

The `ThreeDViewer` class provides an interactive Three.js 3D scene with orbit controls, lighting presets, procedural AI-themed models, and mobile touch support.

## Requirements

Include Three.js before importing the viewer module:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script type="module">
  import { ThreeDViewer } from './js/3d-viewer.js';
</script>
```

## Quick Start

```html
<div id="viewer" style="width:100%;height:480px;position:relative">
  <canvas id="canvas"></canvas>
</div>

<script type="module">
  import { ThreeDViewer } from './js/3d-viewer.js';

  const viewer = new ThreeDViewer('#canvas', { lighting: 'studio' });
</script>
```

## Constructor

```js
new ThreeDViewer(canvas, options)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `canvas` | `string \| HTMLCanvasElement` | CSS selector or canvas element |
| `options.lighting` | `'studio' \| 'outdoor' \| 'dramatic'` | Initial lighting preset (default: `'studio'`) |

## Lighting Presets

| Preset | Description |
|--------|-------------|
| `'studio'` | Cyan key light, green fill, purple rim — AI/tech aesthetic |
| `'outdoor'` | Hemisphere sky light + warm directional sun |
| `'dramatic'` | Dark ambient with orange and blue spotlights |

## Methods

### `setLighting(preset)`
Change the active lighting preset at runtime.

```js
viewer.setLighting('dramatic');
```

### `toggleRotation(): boolean`
Toggle the auto-rotation. Returns `true` if rotation is now on.

```js
const isRotating = viewer.toggleRotation();
```

### `loadModel(type)`
Switch to a different procedural model.

| Type | Geometry |
|------|----------|
| `'brain'` | Icosahedron cluster (default AI brain) |
| `'torus'` | Torus knot |
| `'sphere'` | Sphere |
| `'box'` | Cube |

```js
viewer.loadModel('torus');
```

### `dispose()`
Clean up the renderer and resize observer. Call when removing the viewer from the DOM.

```js
viewer.dispose();
```

## User Controls

| Action | Mouse | Touch |
|--------|-------|-------|
| Orbit | Drag | Single finger drag |
| Zoom | Scroll wheel | Pinch (scroll fallback) |

## Performance Notes

- Pixel ratio is clamped at `2×` to maintain performance on high-DPI screens.
- The renderer uses `ACESFilmicToneMapping` for cinematic colour grading.
- A `ResizeObserver` automatically adjusts the canvas and camera aspect ratio.
- Shadow map resolution is `1024×1024` (soft PCF shadows).

## Fallback

If Three.js is not loaded, the viewer renders a plain canvas message instead of throwing. This ensures graceful degradation in offline or restricted environments.

## CSS

Add these styles to size the viewer correctly:

```css
.viewer-wrap {
  position: relative;
  width: 100%;
  height: 480px;
  overflow: hidden;
  border-radius: 12px;
}

#canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
```

## Full Example (with controls)

```html
<div class="viewer-wrap" id="viewer">
  <canvas id="canvas"></canvas>
</div>

<div>
  <button onclick="viewer.setLighting('studio')">Studio</button>
  <button onclick="viewer.setLighting('outdoor')">Outdoor</button>
  <button onclick="viewer.setLighting('dramatic')">Dramatic</button>
  <button onclick="viewer.loadModel('torus')">Torus Knot</button>
  <button onclick="viewer.toggleRotation()">Toggle Rotation</button>
</div>

<script type="module">
  import { ThreeDViewer } from './js/3d-viewer.js';
  window.viewer = new ThreeDViewer('#canvas', { lighting: 'studio' });
</script>
```
