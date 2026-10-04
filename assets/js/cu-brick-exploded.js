const root = document.querySelector('[data-brick-explorer]');
const t = key => window.getTranslation(`brick.${key}`);
const q = selector => root.querySelector(selector);
let teardown = () => {};

function fallback() {
  teardown();
  root.classList.remove('is-ready');
  root.dataset.state = 'fallback';
  root.querySelector('canvas')?.remove();
  q('[data-brick-markers]').replaceChildren();
  root.querySelectorAll('[data-brick-controls], [data-brick-description]').forEach(el => { el.hidden = true; });
  root.querySelectorAll('[data-brick-parts] button').forEach(button => { button.disabled = true; });
  const status = q('[data-brick-status]');
  status.dataset.i18n = 'brick.fallback'; status.textContent = t('fallback'); status.hidden = false;
}

if (root) {
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    root.dataset.state = 'loading';
    q('[data-brick-status]').dataset.i18n = 'brick.loading';
    q('[data-brick-status]').textContent = t('loading');
    initialize().catch(fallback);
  }, { rootMargin: '350px' });
  observer.observe(root);
}

async function initialize() {
  const [THREE, { GLTFLoader }, { MeshoptDecoder }, { createBrickModels }, { RoomEnvironment }] = await Promise.all([
    import('../vendor/three/three.module.min.js'),
    import('../vendor/three/addons/loaders/GLTFLoader.js'),
    import('../vendor/three/addons/libs/meshopt_decoder.module.js'),
    import('./cu-brick-model.js?v=20261005-1'),
    import('../vendor/three/addons/environments/RoomEnvironment.js')
  ]);
  const viewport = q('[data-brick-viewport]');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  teardown = () => renderer.dispose();
  const canvas = renderer.domElement;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Neutral tone mapping keeps the photographed orange/blue plastics saturated
  // under the studio lights while gently compressing silver metal highlights.
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', t('canvas'));
  viewport.prepend(canvas);
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fallback(); });
  const scene = new THREE.Scene();
  const environmentScene = new RoomEnvironment();
  const generator = new THREE.PMREMGenerator(renderer);
  const environment = generator.fromScene(environmentScene, .04);
  scene.environment = environment.texture; scene.environmentIntensity = .85;
  environmentScene.dispose(); generator.dispose();
  scene.add(new THREE.HemisphereLight(0xf2f4f5, 0x484b4e, .65));
  const light = new THREE.DirectionalLight(0xfff9f2, 1.8);
  light.position.set(5, 12, 8); scene.add(light);
  const rim = new THREE.DirectionalLight(0xe2e8ed, .8);
  rim.position.set(-7, 6, -4); scene.add(rim);
  // Install cleanup before fetching so an unavailable model releases the context.
  teardown = () => { environment.dispose(); renderer.dispose(); };
  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
    .loadAsync(new URL('../models/cu-brick-end-effector.glb?v=20261004-3', import.meta.url).href);
  if (root.dataset.state === 'fallback') return;
  const models = createBrickModels(THREE, gltf.scene);
  Object.values(models).forEach(model => scene.add(model.object));
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .01, 150);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const listeners = new AbortController();
  const on = (element, event, handler, options = {}) => element.addEventListener(event, handler, { ...options, signal: listeners.signal });
  let view = 'site', model = models.site, progress = 0, elevation = 0;
  let rotation = 0, grip = 0;
  let cycleProgress = 0, cyclePlaying = false, cycleLastTime = null, focusAction = false;
  const cycleStops = [0, .12, .34, .48, .65, .78, .90, 1];
  const actionBounds = new THREE.Box3(new THREE.Vector3(-.2, -.2, -2.8), new THREE.Vector3(8.8, 4.5, 4.2));
  const motionAnimations = { rotation: null, grip: null };
  let yaw = model.yaw, pitch = model.pitch, zoom = 1, selected = null, labels = true;
  let lightTheme = document.documentElement.classList.contains('light-theme');
  let frame = 0, animation = null, alive = true;
  let width = 1, height = 1, buttons = [];
  let annotation, leader, endpoint, hovered = null;
  const bounds = new THREE.Box3(), viewBounds = new THREE.Box3(), corner = new THREE.Vector3(), projected = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const separationSlider = q('#brick-separation'), elevationSlider = q('#brick-elevation');
  const zoomSlider = q('#brick-zoom');
  const rotationSlider = q('#brick-rotation'), gripSlider = q('#brick-grip');
  const cycleSlider = q('#brick-cycle'), cyclePlay = q('[data-brick-cycle-play]');
  const selectionTitle = q('[data-brick-part-title]'), selectionText = q('[data-brick-part-text]');
  const picker = q('[data-brick-picker]');

  function requestRender() {
    if (!frame && alive) frame = requestAnimationFrame(render);
  }
  function fitCamera() {
    const focused = view === 'site' && focusAction;
    if (focused) bounds.copy(actionBounds); else bounds.setFromObject(model.object);
    const center = bounds.getCenter(new THREE.Vector3());
    camera.position.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch))
      .multiplyScalar(35).add(center);
    camera.lookAt(center); camera.updateMatrixWorld(true);
    // Fit each mesh in camera space, avoiding empty corners of the combined
    // world box that made the exploded view unnecessarily small on phones.
    viewBounds.makeEmpty();
    const includeBounds = (box, matrix) => {
      for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
        corner.set(x, y, z).applyMatrix4(matrix).applyMatrix4(camera.matrixWorldInverse);
        viewBounds.expandByPoint(corner);
      }
    };
    if (focused) includeBounds(actionBounds, model.object.matrixWorld);
    else model.object.traverse(node => {
      if (!node.geometry) return;
      const source = node.isInstancedMesh ? node : node.geometry;
      if (!source.boundingBox || node.isLine) source.computeBoundingBox();
      const box = source.boundingBox;
      includeBounds(box, node.matrixWorld);
    });
    const extentX = (viewBounds.max.x - viewBounds.min.x) / 2, extentY = (viewBounds.max.y - viewBounds.min.y) / 2;
    const centerX = (viewBounds.max.x + viewBounds.min.x) / 2, centerY = (viewBounds.max.y + viewBounds.min.y) / 2;
    const aspect = width / height;
    const halfHeight = Math.max(extentY, extentX / aspect) * 1.08 / zoom;
    camera.left = centerX - halfHeight * aspect; camera.right = centerX + halfHeight * aspect;
    camera.top = centerY + halfHeight; camera.bottom = centerY - halfHeight; camera.updateProjectionMatrix();
  }
  function updateControls() {
    const percent = Math.round(progress * 100);
    separationSlider.value = String(percent);
    separationSlider.style.setProperty('--range-progress', `${percent}%`);
    zoomSlider.value = String(Math.round(zoom * 100));
    zoomSlider.style.setProperty('--range-progress', `${(zoom - .7) / 1.5 * 100}%`);
    q('[data-brick-zoom-output]').value = `${Math.round(zoom * 100)}%`;
    elevationSlider.style.setProperty('--range-progress', `${Math.round(elevation * 100)}%`);
    q('[data-brick-separation-output]').value = `${percent}%`;
    q('[data-brick-elevation-output]').value = `${Math.round(elevation * 100)}%`;
    const degrees = Math.round(rotation), gripPercent = Math.round(grip * 100);
    const gripState = grip < .001 ? 'gripped' : grip > .999 ? 'released' : grip <= .25 ? 'opening' : 'releasing';
    rotationSlider.value = String(degrees);
    rotationSlider.style.setProperty('--range-progress', `${(rotation + 180) / 3.6}%`);
    rotationSlider.setAttribute('aria-valuetext', `${degrees}°`);
    q('[data-brick-rotation-output]').value = `${degrees}°`;
    gripSlider.value = String(gripPercent);
    gripSlider.style.setProperty('--range-progress', `${gripPercent}%`);
    gripSlider.setAttribute('aria-valuetext', `${t(gripState)}, ${gripPercent}%`);
    q('[data-brick-grip-output]').value = t(gripState);
    root.dataset.rotation = String(degrees); root.dataset.grip = String(gripPercent); root.dataset.gripState = gripState;
    root.querySelectorAll('[data-brick-rotation]').forEach(button => button.setAttribute('aria-pressed', String(Math.abs(rotation - Number(button.dataset.brickRotation)) < .001)));
    root.querySelectorAll('[data-brick-grip]').forEach(button => button.setAttribute('aria-pressed', String(Math.abs(grip - Number(button.dataset.brickGrip)) < .001)));
    root.dataset.explode = String(percent);
    root.dataset.elevation = String(Math.round(elevation * 100));
    const cyclePercent = Math.round(cycleProgress * 100);
    cycleSlider.value = String(Math.round(cycleProgress * 1000));
    cycleSlider.style.setProperty('--range-progress', `${cyclePercent}%`);
    q('[data-brick-cycle-output]').value = `${cyclePercent}%`;
    const stage = t(`cycle.${models.site.cycle.stage}`);
    cycleSlider.setAttribute('aria-valuetext', `${stage}, ${cyclePercent}%`);
    const stageLabel = q('[data-brick-cycle-stage]');
    if (stageLabel.textContent !== stage) stageLabel.textContent = stage;
    cyclePlay.textContent = t(reducedMotion.matches ? 'cycleNext' : cyclePlaying ? 'cyclePause' : cycleProgress === 1 ? 'cycleReplay' : 'cyclePlay');
    cyclePlay.setAttribute('aria-pressed', String(cyclePlaying));
    q('[data-brick-cycle-reset]').disabled = cycleProgress === 0 && !cyclePlaying;
    q('[data-brick-action-focus]').setAttribute('aria-pressed', String(focusAction));
    const stepButtons = [...root.querySelectorAll('[data-brick-cycle-step]')];
    stepButtons.forEach((button, i) => {
      const current = cycleProgress >= Number(button.dataset.brickCycleStep) && (i === stepButtons.length - 1 || cycleProgress < Number(stepButtons[i + 1].dataset.brickCycleStep));
      if (current) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
    });
    root.dataset.cycle = String(cyclePercent); root.dataset.cyclePlaying = String(cyclePlaying);
    root.dataset.cycleStage = models.site.cycle.stage; root.dataset.brickOwner = models.site.cycle.owner;
    root.dataset.actionFocus = String(focusAction);
    root.querySelectorAll('[data-brick-pose]').forEach(button => {
      button.setAttribute('aria-pressed', String(Math.abs(progress - Number(button.dataset.brickPose)) < .001));
    });
    q('[data-brick-zoom="out"]').disabled = zoom <= .70;
    q('[data-brick-zoom="in"]').disabled = zoom >= 2.2;
  }
  function render(time) {
    frame = 0;
    if (!alive) return;
    if (cyclePlaying && view === 'site') {
      if (cycleLastTime !== null) cycleProgress = Math.min(1, cycleProgress + Math.min(time - cycleLastTime, 100) * 1.2 / 26000);
      cycleLastTime = time;
      if (cycleProgress === 1) { cyclePlaying = false; cycleLastTime = null; }
    }
    if (animation) {
      const fraction = Math.min(1, (time - animation.start) / 650);
      progress = THREE.MathUtils.lerp(animation.from, animation.to, fraction * fraction * (3 - 2 * fraction));
      if (fraction === 1) animation = null;
    }
    for (const [name, motion] of Object.entries(motionAnimations)) {
      if (!motion) continue;
      const fraction = Math.min(1, (time - motion.start) / 650);
      const value = THREE.MathUtils.lerp(motion.from, motion.to, fraction * fraction * (3 - 2 * fraction));
      if (name === 'rotation') rotation = value; else grip = value;
      if (fraction === 1) motionAnimations[name] = null;
    }
    if (view === 'detail') model.update(progress, { rotation, release: grip });
    else model.update(0, elevation, cycleProgress);
    model.object.updateMatrixWorld(true);
    fitCamera();
    const part = model.parts.find(item => item.id === selected);
    annotation.hidden = !labels || !part;
    leader.style.display = endpoint.style.display = 'none';
    if (labels && part) {
      projected.copy(part.anchor); part.group.localToWorld(projected); projected.project(camera);
      const anchorX = (projected.x + 1) * width / 2;
      const anchorY = (1 - projected.y) * height / 2 + 82;
      const offscreen = Math.abs(projected.x) > 1 || Math.abs(projected.y) > 1 || projected.z < -1 || projected.z > 1;
      if (!offscreen) {
        const x = annotation.offsetLeft + 2, y = annotation.offsetTop + annotation.offsetHeight + 8;
        leader.setAttribute('d', `M ${x} ${y} H ${Math.max(x + 24, anchorX - 32)} L ${anchorX} ${anchorY}`);
        endpoint.setAttribute('d', `M ${anchorX - 3} ${anchorY} h 6 M ${anchorX} ${anchorY - 3} v 6`);
        leader.style.display = endpoint.style.display = '';
      }
    }
    updateControls(); renderer.render(scene, camera);
    if (cyclePlaying || animation || Object.values(motionAnimations).some(Boolean)) requestRender();
  }
  function describe() {
    selectionTitle.textContent = t(selected ? `part.${selected}` : view === 'detail' ? 'functions' : 'choose');
    selectionText.textContent = t(selected ? `part.${selected}Text` : view === 'detail' ? 'functionsText' : 'chooseText');
    if (annotation) annotation.textContent = selected ? t(`part.${selected}`) : '';
    q('[data-brick-inspect]').hidden = selected !== 'effector';
  }
  function highlight() {
    model.parts.forEach(part => part.group.traverse(node => {
      if (!node.material) return;
      for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
        if (material.emissive) material.emissive.setHex(part.id === selected ? (lightTheme ? 0x080808 : 0x101010) : part.id === hovered ? (lightTheme ? 0x040506 : 0x080a0b) : 0x000000);
        else if (node.isLine) {
          material.userData.originalColor ??= material.color.getHex();
          material.color.setHex(part.id === selected ? (lightTheme ? 0x644728 : 0xe7d2b3) : material.userData.originalColor);
        }
      }
    }));
    requestRender();
  }
  function syncTheme() {
    const next = document.documentElement.classList.contains('light-theme');
    const name = next ? 'light' : 'dark';
    if (root.dataset.theme === name) return;
    lightTheme = next; root.dataset.theme = name;
    renderer.toneMappingExposure = lightTheme ? .95 : 1.05;
    scene.environmentIntensity = lightTheme ? .75 : .85;
    models.site.setTheme(lightTheme);
    highlight();
  }
  function select(id) {
    selected = id; root.dataset.selected = id || '';
    picker.value = id || '';
    highlight();
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.part === id));
    });
    describe(); requestRender();
  }
  function localize() {
    canvas.setAttribute('aria-label', t('canvas'));
    q('[data-brick-meta]').dataset.i18n = `brick.${view}Meta`;
    q('[data-brick-meta]').textContent = t(`${view}Meta`);
    buttons.forEach(button => { button.querySelector('[data-part-name]').textContent = t(`part.${button.dataset.part}`); });
    Array.from(picker.options).forEach(option => { option.textContent = t(option.value ? `part.${option.value}` : 'choose'); });
    describe(); requestRender();
  }
  function showView(next) {
    cyclePlaying = false; cycleLastTime = null;
    // Clear highlight before hiding the previous model.
    hovered = null; select(null);
    view = next; model = models[view]; root.dataset.view = view;
    Object.entries(models).forEach(([key, item]) => { item.object.visible = key === view; });
    progress = 0; elevationSlider.value = String(Math.round(elevation * 100)); animation = null;
    motionAnimations.rotation = motionAnimations.grip = null;
    yaw = view === 'site' && focusAction ? -.58 : model.yaw; pitch = model.pitch; zoom = 1;
    q('[data-brick-elevation-control]').hidden = view !== 'site';
    q('[data-brick-zoom-control]').hidden = view !== 'site';
    q('[data-brick-cycle-control]').hidden = view !== 'site';
    q('[data-brick-separation-control]').hidden = view !== 'detail';
    q('[data-brick-rotation-control]').hidden = view !== 'detail';
    q('[data-brick-grip-control]').hidden = view !== 'detail';
    q('[data-brick-motion-note]').hidden = view !== 'detail';
    root.querySelectorAll('[data-brick-view]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.brickView === view));
    });
    const partsElement = q('[data-brick-parts]'), markersElement = q('[data-brick-markers]');
    partsElement.replaceChildren(); markersElement.replaceChildren(); buttons = [];
    picker.replaceChildren(new Option(t('choose'), ''));
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%'); svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute'; markersElement.append(svg);
    leader = document.createElementNS(svg.namespaceURI, 'path');
    endpoint = document.createElementNS(svg.namespaceURI, 'path');
    svg.append(leader, endpoint);
    annotation = document.createElement('span'); annotation.className = 'brick-explorer__annotation';
    annotation.hidden = true; markersElement.append(annotation);
    model.parts.forEach(part => {
      picker.add(new Option(t(`part.${part.id}`), part.id));
      const item = document.createElement('li'), button = document.createElement('button');
      button.type = 'button'; button.className = 'brick-explorer__part'; button.dataset.part = part.id;
      button.setAttribute('aria-pressed', 'false');
      const name = document.createElement('span');
      name.dataset.partName = ''; name.dataset.i18n = `brick.part.${part.id}`;
      button.append(name); item.append(button); partsElement.append(item); buttons.push(button);
      // Node-owned listeners disappear with these nodes when switching views.
      button.addEventListener('click', () => select(part.id));
      button.addEventListener('pointerenter', () => { hovered = part.id; highlight(); });
      button.addEventListener('pointerleave', () => { hovered = null; highlight(); });
      button.addEventListener('focus', () => { hovered = part.id; highlight(); });
      button.addEventListener('blur', () => { hovered = null; highlight(); });
    });
    localize(); resize();
  }
  function resize() {
    const rect = viewport.getBoundingClientRect();
    // Canvas is physically below the annotation rail, including while zoomed.
    width = Math.max(rect.width, 1); height = Math.max(rect.height - 82, 1);
    renderer.setPixelRatio(Math.min(devicePixelRatio, width < 600 ? 1.5 : 1.75));
    renderer.setSize(width, height, false); requestRender();
  }
  function setPose(to) {
    if (view !== 'detail') return;
    if (reducedMotion.matches) { progress = to; animation = null; }
    else animation = { start: performance.now(), from: progress, to };
    requestRender();
  }
  function setZoom(value) { zoom = THREE.MathUtils.clamp(value, .7, 2.2); requestRender(); }
  function setMotion(name, to) {
    if (view !== 'detail') return;
    if (reducedMotion.matches) {
      if (name === 'rotation') rotation = to; else grip = to;
      motionAnimations[name] = null;
    } else motionAnimations[name] = { start: performance.now(), from: name === 'rotation' ? rotation : grip, to };
    requestRender();
  }
  function reset() { yaw = model.yaw; pitch = model.pitch; zoom = 1; if (view === 'site') focusAction = false; requestRender(); }
  function seekCycle(value) {
    cyclePlaying = false; cycleLastTime = null;
    cycleProgress = THREE.MathUtils.clamp(value, 0, 1); requestRender();
  }
  function focusCycle() {
    // View from the open side so the pick-up mast does not hide the transfer arm.
    if (!focusAction) { yaw = -.58; pitch = .55; zoom = 1; }
    focusAction = true;
  }
  on(cyclePlay, 'click', () => {
    if (view !== 'site') return;
    if (reducedMotion.matches) {
      focusCycle(); seekCycle(cycleStops.find(stop => stop > cycleProgress + .001) ?? 0); return;
    }
    if (!cyclePlaying && cycleProgress === 1) cycleProgress = 0;
    cyclePlaying = !cyclePlaying; cycleLastTime = null;
    if (cyclePlaying) focusCycle();
    requestRender();
  });
  on(cycleSlider, 'input', () => seekCycle(Number(cycleSlider.value) / 1000));
  on(q('[data-brick-cycle-reset]'), 'click', () => seekCycle(0));
  on(q('[data-brick-action-focus]'), 'click', () => {
    if (focusAction) { focusAction = false; yaw = model.yaw; pitch = model.pitch; zoom = 1; }
    else focusCycle();
    requestRender();
  });
  root.querySelectorAll('[data-brick-cycle-step]').forEach(button => on(button, 'click', () => seekCycle(Number(button.dataset.brickCycleStep))));
  on(document, 'visibilitychange', () => { if (document.hidden && cyclePlaying) seekCycle(cycleProgress); });
  root.querySelectorAll('[data-brick-view]').forEach(button => on(button, 'click', () => showView(button.dataset.brickView)));
  root.querySelectorAll('[data-brick-pose]').forEach(button => on(button, 'click', () => setPose(Number(button.dataset.brickPose))));
  on(separationSlider, 'input', () => {
    if (view !== 'detail') return;
    animation = null; progress = Number(separationSlider.value) / 100; requestRender();
  });
  on(zoomSlider, 'input', () => setZoom(Number(zoomSlider.value) / 100));
  on(rotationSlider, 'input', () => {
    if (view !== 'detail') return;
    motionAnimations.rotation = null; rotation = Number(rotationSlider.value); requestRender();
  });
  on(gripSlider, 'input', () => {
    if (view !== 'detail') return;
    motionAnimations.grip = null; grip = Number(gripSlider.value) / 100; requestRender();
  });
  root.querySelectorAll('[data-brick-rotation]').forEach(button => on(button, 'click', () => setMotion('rotation', Number(button.dataset.brickRotation))));
  root.querySelectorAll('[data-brick-grip]').forEach(button => on(button, 'click', () => setMotion('grip', Number(button.dataset.brickGrip))));
  on(elevationSlider, 'input', () => { elevation = Number(elevationSlider.value) / 100; requestRender(); });
  on(q('[data-brick-reset]'), 'click', reset);
  on(picker, 'change', () => select(picker.value || null));
  on(q('[data-brick-inspect]'), 'click', () => { showView('detail'); q('[data-brick-view="detail"]').focus(); });
  on(q('[data-brick-zoom="in"]'), 'click', () => setZoom(zoom * 1.2));
  on(q('[data-brick-zoom="out"]'), 'click', () => setZoom(zoom / 1.2));
  on(q('[data-brick-labels]'), 'click', event => {
    labels = !labels; event.currentTarget.setAttribute('aria-pressed', String(labels)); requestRender();
  });
  let pointer = null;
  on(canvas, 'pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw, pitch, moved: false };
    canvas.setPointerCapture(event.pointerId);
  });
  on(canvas, 'pointermove', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
    if (Math.hypot(dx, dy) > 5) pointer.moved = true;
    if (!pointer.moved) return;
    yaw = pointer.yaw - dx * .009;
    // Vertical touch gestures remain available for normal page scrolling.
    if (event.pointerType !== 'touch') pitch = THREE.MathUtils.clamp(pointer.pitch + dy * .005, -.15, 1.25);
    requestRender();
  });
  on(canvas, 'pointerup', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    if (!pointer.moved) {
      const rect = canvas.getBoundingClientRect();
      raycaster.params.Line.threshold = view === 'site' ? .065 : .002;
      raycaster.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / width * 2 - 1, 1 - (event.clientY - rect.top) / height * 2), camera);
      const hit = raycaster.intersectObject(model.object, true).find(hit => hit.object.userData.partId);
      select(hit?.object.userData.partId || null);
    }
    pointer = null;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  });
  on(canvas, 'pointercancel', () => { pointer = null; });
  on(canvas, 'lostpointercapture', () => { pointer = null; });
  on(canvas, 'keydown', event => {
    const actions = {
      ArrowLeft: () => { yaw -= .15; }, ArrowRight: () => { yaw += .15; },
      ArrowUp: () => { pitch = Math.min(1.25, pitch + .1); }, ArrowDown: () => { pitch = Math.max(-.15, pitch - .1); },
      '+': () => setZoom(zoom * 1.2), '=': () => setZoom(zoom * 1.2), '-': () => setZoom(zoom / 1.2), Home: reset
    };
    if (actions[event.key]) { event.preventDefault(); actions[event.key](); requestRender(); }
  });
  on(window, 'site-language-change', localize);
  on(reducedMotion, 'change', () => {
    if (reducedMotion.matches && animation) { progress = animation.to; animation = null; requestRender(); }
    if (reducedMotion.matches) {
      cyclePlaying = false; cycleLastTime = null;
      for (const [name, motion] of Object.entries(motionAnimations)) {
        if (!motion) continue;
        if (name === 'rotation') rotation = motion.to; else grip = motion.to;
        motionAnimations[name] = null;
      }
      requestRender();
    }
  });
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(viewport);
  const activityObserver = new IntersectionObserver(entries => {
    const visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .15;
    if (!visible) {
      if (cyclePlaying) seekCycle(cycleProgress);
      return;
    }
    if (view !== 'site' || reducedMotion.matches || document.hidden) return;
    if (cycleProgress === 1) cycleProgress = 0;
    cyclePlaying = true; cycleLastTime = null;
    focusCycle(); requestRender();
  }, { threshold: .15 });
  activityObserver.observe(viewport);
  const themeObserver = new MutationObserver(syncTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  teardown = () => {
    if (!alive) return;
    alive = false; cancelAnimationFrame(frame); listeners.abort(); resizeObserver.disconnect(); themeObserver.disconnect(); activityObserver.disconnect();
    const geometries = new Set(), materials = new Set();
    scene.traverse(node => {
      if (node.geometry) geometries.add(node.geometry);
      if (node.material) (Array.isArray(node.material) ? node.material : [node.material]).forEach(m => materials.add(m));
    });
    geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
    environment.dispose(); renderer.dispose();
  };
  root.querySelectorAll('[data-brick-controls], [data-brick-description]').forEach(el => { el.hidden = false; });
  q('[data-brick-status]').hidden = true;
  root.classList.add('is-ready'); root.dataset.state = 'ready';
  showView('site');
  syncTheme();
}
