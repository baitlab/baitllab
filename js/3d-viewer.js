/**
 * Baitlab — Three.js 3D Viewer
 *
 * Provides an interactive 3D scene with orbit controls,
 * lighting presets, and procedurally generated AI-styled models.
 *
 * Requires Three.js r160+ loaded globally or via CDN.
 */

export class ThreeDViewer {
  /**
   * @param {string|HTMLElement} canvas  CSS selector or canvas element
   * @param {object} [opts]
   * @param {number} [opts.width]
   * @param {number} [opts.height]
   * @param {'studio'|'outdoor'|'dramatic'} [opts.lighting='studio']
   */
  constructor(canvas, opts = {}) {
    this._canvas = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
    if (!this._canvas) throw new Error(`ThreeDViewer: canvas not found — "${canvas}"`);

    this._opts    = { lighting: 'studio', ...opts };
    this._objects = [];
    this._animId  = null;
    this._rotating = true;

    this._init();
  }

  /* ── Initialisation ──────────────────────────────────────── */

  _init() {
    const THREE = window.THREE;
    if (!THREE) {
      console.warn('ThreeDViewer: Three.js not loaded — rendering fallback.');
      this._renderFallback();
      return;
    }

    const w = this._canvas.parentElement.clientWidth  || 600;
    const h = this._canvas.parentElement.clientHeight || 420;

    // Renderer
    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
      alpha: true,
    });
    this._renderer.setSize(w, h);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this._renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this._renderer.toneMappingExposure = 1.2;

    // Scene
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0x050505);
    this._scene.fog = new THREE.Fog(0x050505, 20, 60);

    // Camera
    this._camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    this._camera.position.set(3.5, 2.5, 5);
    this._camera.lookAt(0, 0, 0);

    // Controls (orbit)
    this._setupOrbitControls(THREE);

    // Lighting
    this._applyLighting(this._opts.lighting);

    // Grid
    const grid = new THREE.GridHelper(20, 20, 0x002222, 0x001a1a);
    this._scene.add(grid);

    // Default model
    this._loadDefaultScene(THREE);

    // Resize observer
    this._ro = new ResizeObserver(() => this._onResize());
    this._ro.observe(this._canvas.parentElement);

    // Start render loop
    this._animate();
  }

  _setupOrbitControls(THREE) {
    // Minimal orbit controls without importing OrbitControls module
    this._mouse   = { x: 0, y: 0, down: false };
    this._spherical = { theta: 0.3, phi: 1.1, radius: 6 };

    const onMouseDown = (e) => {
      this._mouse.down = true;
      this._mouse.x = e.clientX;
      this._mouse.y = e.clientY;
    };
    const onMouseUp   = () => { this._mouse.down = false; };
    const onMouseMove = (e) => {
      if (!this._mouse.down) return;
      const dx = (e.clientX - this._mouse.x) * 0.008;
      const dy = (e.clientY - this._mouse.y) * 0.008;
      this._spherical.theta -= dx;
      this._spherical.phi   = Math.max(0.2, Math.min(Math.PI - 0.2, this._spherical.phi + dy));
      this._mouse.x = e.clientX;
      this._mouse.y = e.clientY;
      this._rotating = false;
    };
    const onWheel = (e) => {
      this._spherical.radius = Math.max(2, Math.min(18, this._spherical.radius + e.deltaY * 0.01));
    };

    // Touch support
    const onTouchStart = (e) => { if (e.touches.length === 1) { this._mouse.down = true; this._mouse.x = e.touches[0].clientX; this._mouse.y = e.touches[0].clientY; } };
    const onTouchEnd   = () => { this._mouse.down = false; };
    const onTouchMove  = (e) => { if (!this._mouse.down || e.touches.length !== 1) return; const dx = (e.touches[0].clientX - this._mouse.x) * 0.008; const dy = (e.touches[0].clientY - this._mouse.y) * 0.008; this._spherical.theta -= dx; this._spherical.phi = Math.max(0.2, Math.min(Math.PI - 0.2, this._spherical.phi + dy)); this._mouse.x = e.touches[0].clientX; this._mouse.y = e.touches[0].clientY; };

    this._canvas.addEventListener('mousedown',  onMouseDown);
    this._canvas.addEventListener('mouseup',    onMouseUp);
    this._canvas.addEventListener('mousemove',  onMouseMove);
    this._canvas.addEventListener('wheel',      onWheel, { passive: true });
    this._canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    this._canvas.addEventListener('touchend',   onTouchEnd);
    this._canvas.addEventListener('touchmove',  onTouchMove, { passive: true });
  }

  _updateCameraFromSpherical(THREE) {
    const { theta, phi, radius } = this._spherical;
    this._camera.position.set(
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.cos(theta)
    );
    this._camera.lookAt(0, 0, 0);
  }

  _applyLighting(preset) {
    const THREE = window.THREE;
    if (!THREE || !this._scene) return;

    // Remove existing lights
    const toRemove = this._scene.children.filter((c) => c.isLight);
    toRemove.forEach((l) => this._scene.remove(l));

    if (preset === 'studio') {
      const ambient  = new THREE.AmbientLight(0x112233, 0.8);
      const key      = new THREE.DirectionalLight(0x00e5ff, 2.5);
      key.position.set(3, 6, 4);
      key.castShadow = true;
      key.shadow.mapSize.width  = 1024;
      key.shadow.mapSize.height = 1024;
      const fill     = new THREE.DirectionalLight(0x00ff66, 0.6);
      fill.position.set(-4, 2, -3);
      const rim      = new THREE.PointLight(0xa855f7, 1.2, 15);
      rim.position.set(0, 4, -6);
      this._scene.add(ambient, key, fill, rim);

    } else if (preset === 'outdoor') {
      const sky      = new THREE.HemisphereLight(0x335577, 0x111111, 1.2);
      const sun      = new THREE.DirectionalLight(0xffeedd, 3);
      sun.position.set(8, 12, 6);
      sun.castShadow = true;
      this._scene.add(sky, sun);

    } else if (preset === 'dramatic') {
      const ambient  = new THREE.AmbientLight(0x000000, 0.2);
      const spot1    = new THREE.SpotLight(0xff6600, 3, 20, Math.PI / 6, 0.3);
      spot1.position.set(5, 8, 2);
      spot1.castShadow = true;
      const spot2    = new THREE.SpotLight(0x0044ff, 2, 20, Math.PI / 5, 0.4);
      spot2.position.set(-5, 4, -3);
      this._scene.add(ambient, spot1, spot2);
    }
  }

  _loadDefaultScene(THREE) {
    // AI-brain inspired icosahedron cluster
    const geo1  = new THREE.IcosahedronGeometry(1.1, 1);
    const mat1  = new THREE.MeshStandardMaterial({
      color: 0x003344,
      emissive: 0x001122,
      metalness: 0.85,
      roughness: 0.15,
      wireframe: false,
    });
    const mesh1 = new THREE.Mesh(geo1, mat1);
    mesh1.castShadow = true;
    this._scene.add(mesh1);

    // Wireframe shell
    const geo2  = new THREE.IcosahedronGeometry(1.35, 1);
    const mat2  = new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.18 });
    const mesh2 = new THREE.Mesh(geo2, mat2);
    this._scene.add(mesh2);

    // Orbiting rings
    for (let i = 0; i < 3; i++) {
      const rg = new THREE.TorusGeometry(1.8 + i * 0.5, 0.018, 8, 64);
      const rm = new THREE.MeshBasicMaterial({ color: i === 0 ? 0x00e5ff : i === 1 ? 0x00ff66 : 0xa855f7, transparent: true, opacity: 0.55 });
      const ring = new THREE.Mesh(rg, rm);
      ring.rotation.x = Math.PI / 2 + i * 0.55;
      ring.rotation.z = i * 0.4;
      this._scene.add(ring);
    }

    // Satellite spheres
    for (let i = 0; i < 8; i++) {
      const sg  = new THREE.SphereGeometry(0.12, 8, 8);
      const sm  = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 0.7, metalness: 0.5 });
      const sp  = new THREE.Mesh(sg, sm);
      const angle = (i / 8) * Math.PI * 2;
      sp.position.set(Math.cos(angle) * 2.2, Math.sin(i * 0.7) * 0.6, Math.sin(angle) * 2.2);
      this._scene.add(sp);
      this._objects.push(sp);
    }

    // Ground plane
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 1, metalness: 0 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.7;
    floor.receiveShadow = true;
    this._scene.add(floor);

    this._mainMesh  = mesh1;
    this._shellMesh = mesh2;
  }

  _animate() {
    this._animId = requestAnimationFrame(() => this._animate());
    const THREE = window.THREE;

    const t = Date.now() * 0.001;

    // Auto-rotate when user isn't dragging
    if (this._rotating) {
      this._spherical.theta += 0.004;
    }
    if (THREE) this._updateCameraFromSpherical(THREE);

    // Animate main mesh
    if (this._mainMesh) {
      this._mainMesh.rotation.y = t * 0.25;
      this._mainMesh.rotation.x = Math.sin(t * 0.4) * 0.15;
    }
    if (this._shellMesh) {
      this._shellMesh.rotation.y = -t * 0.18;
    }

    // Animate satellites
    this._objects.forEach((sp, i) => {
      const angle = (i / 8) * Math.PI * 2 + t * 0.55;
      sp.position.x = Math.cos(angle) * 2.2;
      sp.position.z = Math.sin(angle) * 2.2;
      sp.position.y = Math.sin(t + i) * 0.4;
    });

    if (this._renderer) this._renderer.render(this._scene, this._camera);
  }

  _onResize() {
    const THREE = window.THREE;
    if (!this._renderer || !THREE) return;
    const w = this._canvas.parentElement.clientWidth;
    const h = this._canvas.parentElement.clientHeight || 420;
    this._camera.aspect = w / h;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(w, h);
  }

  _renderFallback() {
    const ctx = this._canvas.getContext ? this._canvas.getContext('2d') : null;
    if (!ctx) return;
    this._canvas.width  = this._canvas.parentElement.clientWidth  || 600;
    this._canvas.height = this._canvas.parentElement.clientHeight || 420;
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(0,229,255,0.5)';
    ctx.textAlign = 'center';
    ctx.fillText('3D viewer — load Three.js for full experience', this._canvas.width / 2, this._canvas.height / 2);
  }

  /* ── Public API ───────────────────────────────────────────── */

  /**
   * Change the lighting preset.
   * @param {'studio'|'outdoor'|'dramatic'} preset
   */
  setLighting(preset) {
    this._applyLighting(preset);
  }

  /** Toggle auto-rotation. */
  toggleRotation() {
    this._rotating = !this._rotating;
    return this._rotating;
  }

  /**
   * Switch to a different procedural model.
   * @param {'brain'|'torus'|'sphere'|'box'} type
   */
  loadModel(type) {
    const THREE = window.THREE;
    if (!THREE || !this._scene) return;

    // Clear existing meshes (keep grid, lights, floor)
    const toRemove = this._scene.children.filter((c) => c.isMesh);
    toRemove.forEach((m) => this._scene.remove(m));
    this._objects = [];
    this._mainMesh = null;
    this._shellMesh = null;

    let geo;
    switch (type) {
      case 'torus':  geo = new THREE.TorusKnotGeometry(1, 0.35, 128, 16); break;
      case 'sphere': geo = new THREE.SphereGeometry(1.3, 32, 32);         break;
      case 'box':    geo = new THREE.BoxGeometry(1.8, 1.8, 1.8);          break;
      default:       geo = new THREE.IcosahedronGeometry(1.2, 2);
    }

    const mat = new THREE.MeshStandardMaterial({
      color: 0x003344,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x001122,
    });

    this._mainMesh = new THREE.Mesh(geo, mat);
    this._mainMesh.castShadow = true;
    this._scene.add(this._mainMesh);

    const wireMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.2 });
    this._shellMesh = new THREE.Mesh(geo.clone(), wireMat);
    this._shellMesh.scale.setScalar(1.08);
    this._scene.add(this._shellMesh);
  }

  /** Dispose renderer and remove resize observer. */
  dispose() {
    if (this._animId) cancelAnimationFrame(this._animId);
    if (this._ro) this._ro.disconnect();
    if (this._renderer) this._renderer.dispose();
  }
}
