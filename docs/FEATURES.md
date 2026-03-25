# Features

This document includes the features of the project.

## Pages

### `index.html` — Main Landing Page
- Hero section with typewriter terminal animation
- Navigation links to all new pages (3D Viewer, Slides, Features)
- Feature cards: AI Calling, Business Automation, Personal Assistant
- Integrations, Pricing, Testimonials, Security, and Contact sections
- Responsive grid layout with dark design and JetBrains Mono font

### `viewer.html` — AI 3D Viewer
Powered by **Three.js r128** (WebGL renderer).

**Scene Controls:**
- Choose object shape: Cube, Sphere, Torus, Cone, Cylinder, Octahedron, Torus Knot
- Switch material: Standard, Wireframe, Phong, Normal Map
- Select object colour from colour swatches
- Adjust rotation speed, object scale, and ambient light intensity via sliders
- Animation modes: Rotate, Bounce, Pulse, Pause

**Environment Controls:**
- Toggle grid helper
- Toggle procedurally-generated star field (1,200 points)
- Toggle exponential fog

**Camera Controls (manual orbit):**
- Left-drag to orbit
- Right-drag to pan
- Scroll to zoom
- Touch/swipe support for mobile

**Rendering:**
- Shadow maps (PCFSoftShadowMap)
- Directional key light (cyan) + fill light (lime)
- Responsive canvas that resizes with the browser window

### `slides.html` — Slide Presentation
A 6-slide carousel presenting Baitlab's core capabilities:
1. Introduction
2. AI Calling
3. Business Automation
4. Personal Assistant
5. Integrations
6. Get Started / CTA

**Controls:**
- Previous / Next arrow buttons
- Dot pagination indicators
- Autoplay (4.5 s interval) with play/pause toggle
- Touch/swipe navigation on mobile
- Animated progress bar above slides

**Information Elements:**
- Key Metrics stat cards (10K+ calls, 98% uptime, 40% time saved, 500+ integrations)
- FAQ accordion (collapsible/expandable)
- Interactive tooltips on hover
- Product roadmap timeline

### `features.html` — Features & Components Library
Complete interactive UI component showcase:

**Feature Cards:**
- 9 clickable cards opening a modal with detailed feature description
- Hover animation and gradient overlay effect

**Info Cards:**
- Horizontal icon + text layout for platform differentiators

**Button Library:**
- Primary (gradient), Outline, Ghost, Danger, Lime variants
- Small, Default, Large sizes
- Icon buttons, Loading spinner demo

**Tabbed Content:**
- Overview, API, SDK, Pricing tabs

**Progress Bars:**
- Animated on scroll-into-view via IntersectionObserver
- Cyan, Lime, Purple, Red gradient fills

**Badges & Tags:**
- Cyan, Lime, Red, Yellow, Purple, Solid variants

**Alert Messages:**
- Info, Success, Warning, Error contextual alerts

**Toggle Switches:**
- Custom CSS toggles with accent colour

**Modal Dialog:**
- Opens on feature card click or button click
- Keyboard accessible (Escape to close), overlay click to dismiss

**Contact Form:**
- Full name, email, company, plan selector, message textarea, terms checkbox
- Client-side success feedback with form reset

## Design System
- **Colour palette:** `--bg: #000`, `--cyan: #00e5ff`, `--lime: #00ff66`, `--text: #c7f6c7`
- **Font:** JetBrains Mono (Google Fonts)
- **Animations:** CSS transitions, keyframe blink cursor, progress fill, modal scale-in
- **Responsive:** All pages adapt to mobile via CSS grid and media queries
- **Accessibility:** ARIA labels, roles, and keyboard navigation throughout
