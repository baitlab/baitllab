# UI Components — Documentation

Baitlab includes a comprehensive set of reusable UI components: tabs, collapsibles, modals, carousels, dropdowns, progress bars, and toast notifications.

## Initialisation

```js
import { initComponents } from './js/components.js';

document.addEventListener('DOMContentLoaded', () => {
  initComponents(); // Initialises all components on the page
});
```

---

## Tabs

**HTML:**
```html
<div class="tabs">
  <button class="tab-btn active" data-tab="tab-a">Tab A</button>
  <button class="tab-btn"        data-tab="tab-b">Tab B</button>
</div>

<div class="tab-content active" id="tab-a">Content A</div>
<div class="tab-content"        id="tab-b">Content B</div>
```

Wrap everything in a `[data-tabs-scope]` parent to isolate multiple tab groups on the same page.

---

## Collapsibles

**HTML:**
```html
<button class="collapsible-btn" data-target="section-1" aria-expanded="false">
  Section title <span class="arrow">▼</span>
</button>
<div class="collapsible-content" id="section-1">
  Hidden content that expands with smooth animation.
</div>
```

---

## Modals

**HTML:**
```html
<!-- Trigger -->
<button data-modal-open="my-modal">Open Modal</button>

<!-- Modal -->
<div class="modal-overlay" id="my-modal" role="dialog" aria-modal="true" aria-hidden="true">
  <div class="modal">
    <button class="modal-close" data-modal-close>✕</button>
    <div class="modal-title">Title</div>
    <p>Modal body content.</p>
  </div>
</div>
```

**JS API:**
```js
import { openModal, closeModal } from './js/components.js';

openModal('my-modal');
closeModal('my-modal');
```

Modals close automatically on Escape key or overlay click.

---

## Carousels

**HTML:**
```html
<div class="carousel-wrap" data-autoplay="0">
  <div class="carousel-track">
    <div class="carousel-slide"> Slide 1 </div>
    <div class="carousel-slide"> Slide 2 </div>
    <div class="carousel-slide"> Slide 3 </div>
  </div>
</div>

<div class="carousel-controls">
  <button class="carousel-btn" data-carousel-prev>←</button>
  <div class="carousel-dots">
    <div class="carousel-dot active"></div>
    <div class="carousel-dot"></div>
    <div class="carousel-dot"></div>
  </div>
  <button class="carousel-btn" data-carousel-next>→</button>
</div>
```

Set `data-autoplay="3000"` for auto-advance every 3 seconds. Touch/swipe supported.

---

## Dropdowns

**HTML:**
```html
<div class="dropdown" id="my-dropdown">
  <button class="btn" data-dropdown-toggle="my-dropdown">Options ▾</button>
  <div class="dropdown-menu">
    <a class="dropdown-item" href="#">Option 1</a>
    <a class="dropdown-item" href="#">Option 2</a>
    <button class="dropdown-item">Option 3</button>
  </div>
</div>
```

Dropdowns close automatically when clicking outside.

---

## Progress Bars

**HTML (auto-animated on load):**
```html
<div class="progress-label">
  <span>Skill name</span><span>85%</span>
</div>
<div class="progress-wrap">
  <div class="progress-bar" data-value="85"></div>
</div>
```

**JS API:**
```js
import { animateProgress } from './js/components.js';

animateProgress('#my-bar', 75, 800); // selector, target%, duration ms
```

---

## Toast Notifications

**JS:**
```js
import { toast } from './js/components.js';

toast('Success message', 'success');
toast('Error occurred', 'error');
toast('Warning note',   'warning');
toast('Info message',   'info');  // default
```

**HTML container** (added automatically if missing):
```html
<div id="toast-container"></div>
```

Toast types correspond to left-border colours:
- `success` → lime green
- `error` → red
- `warning` → amber
- `info` → cyan (default)

---

## Ripple Buttons

Add `btn-ripple` class to any button for a click ripple effect:

```html
<button class="btn btn-ripple">Click me</button>
```

---

## Tooltips

Add `data-tooltip` to any element for a CSS-powered tooltip on hover:

```html
<span data-tooltip="This is a tooltip">Hover me</span>
```

---

## Info Cards (Hover Flip)

```html
<div class="info-card-wrap">
  <div class="info-card">
    <div class="info-card-front">
      <div class="info-card-icon">🚀</div>
      <div class="info-card-title">Feature Name</div>
      <div class="info-card-sub">Subtitle</div>
    </div>
    <div class="info-card-back">
      Detailed description shown on hover.
    </div>
  </div>
</div>
```
