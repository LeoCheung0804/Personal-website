/* Keep the chosen project photos until hover intent or explicit activation.
 * Cache CAD after the first request, and return to the photo on pointer leave.
 * There is no animation loop: render only for input, resize, or theme changes. */
const t = key => window.getTranslation(`homepage.${key}`);
const hoverDevice = matchMedia('(hover: hover) and (pointer: fine)');
const HOVER_DELAY = 500;

document.querySelectorAll('[data-robot-preview]').forEach(root => {
  const stage = root.querySelector('.robot-preview__stage');
  const viewport = root.querySelector('[data-preview-viewport]');
  const photo = viewport.querySelector('img');
  const button = root.querySelector('[data-preview-activate]');
  const hint = root.querySelector('[data-preview-hint]');
  const reset = root.querySelector('[data-preview-reset]');
  const back = root.querySelector('[data-preview-photo]');
  const status = root.querySelector('[data-preview-status]');
  let preview, loading, mode = null, timer = 0, pointerInside = false, anchor;
  root.dataset.state = 'poster';

  function clearDwell() { clearTimeout(timer); timer = 0; }
  function paint() {
    const visible = Boolean(preview && mode && (mode !== 'hover' || pointerInside));
    const failed = root.dataset.state === 'fallback';
    const focusModel = visible && mode === 'keyboard' && document.activeElement === button;
    root.classList.toggle('is-previewing', visible);
    photo.setAttribute('aria-hidden', String(visible));
    button.hidden = visible || failed;
    button.setAttribute('aria-expanded', String(visible));
    button.setAttribute('aria-disabled', String(root.dataset.state === 'loading'));
    const label = root.dataset.state === 'loading' ? 'loading' : hoverDevice.matches ? 'hover' : 'activate';
    button.querySelector('span').dataset.i18n = `homepage.${label}`;
    button.querySelector('span').textContent = t(label);
    // Do not strand focus in an invisible canvas or toolbar control.
    if (!visible && preview && [preview.canvas, reset, back].includes(document.activeElement)) {
      if (failed) document.activeElement.blur();
      else button.focus({ preventScroll: true });
    }
    hint.hidden = reset.hidden = back.hidden = !visible;
    status.hidden = !failed;
    preview?.setVisible(visible);
    if (focusModel) preview.canvas.focus({ preventScroll: true });
  }
  function showPhoto() { clearDwell(); mode = null; paint(); }
  function fallback() {
    clearDwell(); mode = null; preview = null;
    root.dataset.state = 'fallback'; root.removeAttribute('aria-busy');
    status.dataset.i18n = 'homepage.fallback'; status.textContent = t('fallback');
    paint();
  }
  async function activate(nextMode) {
    if (root.dataset.state === 'fallback') return;
    clearDwell(); mode = nextMode;
    if (!preview && !loading) {
      root.dataset.state = 'loading'; root.setAttribute('aria-busy', 'true');
      loading = initialize(root, fallback).then(value => {
        preview = value; root.dataset.state = 'ready';
      }).catch(fallback).finally(() => root.removeAttribute('aria-busy'));
    }
    paint();
    await loading;
    // A late response must not reveal 3D or steal focus after the visitor leaves.
    paint();
  }
  function inside(element, event) {
    const box = element.getBoundingClientRect();
    return event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
  }
  function considerHover(event) {
    if (event.pointerType !== 'mouse' || !hoverDevice.matches) return;
    pointerInside = inside(stage, event);
    if (!pointerInside) { if (mode === 'hover') showPhoto(); else clearDwell(); return; }
    if (mode || root.dataset.state === 'fallback') return;
    if (!inside(viewport, event)) { clearDwell(); anchor = null; return; }
    if (timer && anchor && Math.hypot(event.clientX - anchor.x, event.clientY - anchor.y) < 3) return;
    anchor = { x: event.clientX, y: event.clientY };
    clearDwell();
    timer = setTimeout(() => { timer = 0; if (pointerInside) activate('hover'); }, HOVER_DELAY);
  }
  stage.addEventListener('pointerenter', considerHover);
  stage.addEventListener('pointermove', considerHover);
  stage.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'mouse') return;
    pointerInside = false; anchor = null; clearDwell();
    if (mode === 'hover') showPhoto();
  });
  button.addEventListener('click', event => {
    const keyboard = event.detail === 0;
    activate(keyboard ? 'keyboard' : hoverDevice.matches && event.pointerType !== 'touch' ? 'hover' : 'touch');
  });
  back.addEventListener('click', showPhoto);
  stage.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !mode) return;
    event.preventDefault(); showPhoto(); button.focus({ preventScroll: true });
  });
  stage.addEventListener('focusout', () => {
    queueMicrotask(() => { if (mode === 'keyboard' && !stage.contains(document.activeElement)) showPhoto(); });
  });
  // Scrolling past a stationary cursor is not an intention to explore a model.
  window.addEventListener('scroll', () => {
    clearDwell(); pointerInside = false; anchor = null;
    if (mode === 'hover') showPhoto();
  }, { passive: true });
  hoverDevice.addEventListener('change', () => { clearDwell(); if (mode === 'hover') showPhoto(); else paint(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) showPhoto(); });
  const visibility = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) { pointerInside = false; showPhoto(); }
  });
  visibility.observe(stage);
  paint();
});

async function initialize(root, onFailure) {
  const [THREE, { GLTFLoader }, { MeshoptDecoder }, { RoomEnvironment }] = await Promise.all([
    import('../vendor/three/three.module.min.js'),
    import('../vendor/three/addons/loaders/GLTFLoader.js'),
    import('../vendor/three/addons/libs/meshopt_decoder.module.js'),
    import('../vendor/three/addons/environments/RoomEnvironment.js')
  ]);
  const key = root.dataset.robotPreview;
  const viewport = root.querySelector('[data-preview-viewport]');
  const reset = root.querySelector('[data-preview-reset]');
  let renderer, environment;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = key === 'tapper' ? THREE.ACESFilmicToneMapping : THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.05;
    const scene = new THREE.Scene();
    const studio = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(renderer);
    environment = generator.fromScene(studio, .04);
    scene.environment = environment.texture;
    scene.environmentIntensity = .85;
    studio.dispose(); generator.dispose();
    scene.add(new THREE.HemisphereLight(0xf2f4f5, 0x484b4e, .7));
    const light = new THREE.DirectionalLight(0xfff9f2, 2.5);
    light.position.set(5, 12, 8); scene.add(light);
    const rim = new THREE.DirectionalLight(0xe2e8ed, .8);
    rim.position.set(-7, 6, -4); scene.add(rim);
    const front = key === 'tapper' ? new THREE.DirectionalLight(0xf4f6ff, .9) : null;
    if (front) scene.add(front);
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .01, 1000);
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    let model, bounds, initialYaw, pitch, fitGroups, updateTheme = () => {};

    if (key === 'tapper') {
      const asset = (await loader.loadAsync(new URL('../models/robosun-tapper.glb', import.meta.url).href)).scene;
      let source = asset;
      while (source.children.length === 1 && !source.children[0].isMesh) source = source.children[0];
      const { createTapperFinishes } = await import('./tapper-materials.js?v=20260923-2');
      const { materials, mapSurface } = createTapperFinishes(THREE, renderer);
      asset.updateMatrixWorld(true);
      for (const part of source.children) {
        const group = /^(Frame_V3|counter_assem|motor_cover|Part1)/.test(part.name) ? 'frame'
          : /^(MG4010|inafag|EF_V2_ASM_TAP)/.test(part.name) ? 'motor' : 'carbon';
        part.traverse(mesh => {
          if (!mesh.isMesh) return;
          const finish = /wheel|tire|caster/i.test(mesh.name) ? 'rubber'
            : /shaft|bearing|rod|bolt|screw|nut/i.test(mesh.name) ? 'hardware'
            : /U7Rotor|U7Stator|motor/i.test(mesh.name) ? 'motor'
            : group === 'frame' ? 'aluminum' : group;
          mesh.material = materials[finish];
          if (finish === 'aluminum' || finish === 'carbon') mapSurface(mesh);
        });
      }
      asset.rotation.z = Math.PI + Math.atan2(.4327485235, .9015146784);
      asset.scale.setScalar(5);
      // Normalize the same CAD frame used by the full Tapper explorer to Y-up.
      const up = new THREE.Vector3(.9015146784, -.4327485235, 0).applyQuaternion(asset.quaternion).normalize();
      model = new THREE.Group(); model.add(asset);
      model.quaternion.setFromUnitVectors(up, new THREE.Vector3(0, 1, 0));
      model.updateMatrixWorld(true);
      const tool = source.children.find(node => /^EF_V2_ASM_TAP/.test(node.name));
      const frame = source.children.find(node => /^Frame_V3/.test(node.name));
      if (!tool || !frame) throw new Error('Missing Tapper assembly');
      const direction = new THREE.Box3().setFromObject(tool).getCenter(new THREE.Vector3())
        .sub(new THREE.Box3().setFromObject(frame).getCenter(new THREE.Vector3()));
      initialYaw = Math.atan2(direction.x, direction.z) + .12;
      pitch = .06;
      bounds = new THREE.Box3().setFromObject(model);
      fitGroups = [model];
    } else if (key === 'cuBrick') {
      const cad = (await loader.loadAsync(new URL('../models/cu-brick-end-effector.glb?v=20261004-3', import.meta.url).href)).scene;
      const { createBrickModels } = await import('./cu-brick-model.js?v=20261005-1');
      const site = createBrickModels(THREE, cad).site;
      model = site.object;
      bounds = new THREE.Box3();
      site.parts.forEach(part => bounds.union(new THREE.Box3().setFromObject(part.group)));
      initialYaw = site.yaw; pitch = site.pitch;
      updateTheme = site.setTheme;
      fitGroups = site.parts.map(part => part.group);
    } else throw new Error('Unknown homepage model');

    scene.add(model);
    const target = bounds.getCenter(new THREE.Vector3());
    const radius = bounds.getSize(new THREE.Vector3()).length() * 2;
    const canvas = renderer.domElement;
    let yaw = initialYaw, zoom = 1, frame = 0, drag = null, alive = true, visible = false, lastWidth = 0, lastHeight = 0;
    const listeners = new AbortController();
    const on = (element, event, handler, options = {}) => element.addEventListener(event, handler, { ...options, signal: listeners.signal });
    const resizeObserver = new ResizeObserver(() => requestRender());
    // Fit each mesh directly in camera space. A rotated world bounding box
    // includes empty corners and makes this thin CAD assembly look too small.
    const fitObjects = new Set();
    fitGroups.forEach(group => group.traverse(node => {
      if (!node.geometry) return;
      if (node.isInstancedMesh) node.computeBoundingBox();
      else if (!node.geometry.boundingBox) node.geometry.computeBoundingBox();
      fitObjects.add(node);
    }));
    model.updateMatrixWorld(true);
    const viewBox = new THREE.Box3(), transform = new THREE.Matrix4(), corner = new THREE.Vector3();
    canvas.id = `${key}-preview-canvas`;
    canvas.tabIndex = -1;
    canvas.inert = true;
    canvas.setAttribute('aria-hidden', 'true');
    canvas.setAttribute('role', 'slider');
    canvas.setAttribute('aria-orientation', 'horizontal');
    canvas.setAttribute('aria-valuemin', '-180');
    canvas.setAttribute('aria-valuemax', '180');
    canvas.dataset.i18nAriaLabel = `homepage.${key}Canvas`;
    canvas.setAttribute('aria-label', t(`${key}Canvas`));
    canvas.setAttribute('aria-describedby', `${key}-preview-instructions`);
    viewport.append(canvas);

    function render() {
      frame = 0;
      if (!alive || document.hidden || !viewport.clientWidth || !viewport.clientHeight) return;
      const width = viewport.clientWidth, height = viewport.clientHeight;
      if (width !== lastWidth || height !== lastHeight) {
        renderer.setSize(width, height, false);
        lastWidth = width; lastHeight = height;
      }
      camera.position.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch))
        .multiplyScalar(radius).add(target);
      camera.lookAt(target); camera.updateMatrixWorld(true);
      if (front) front.position.copy(camera.position).add(new THREE.Vector3(0, radius * .5, 0));
      viewBox.makeEmpty();
      for (const node of fitObjects) {
        const box = node.isInstancedMesh ? node.boundingBox : node.geometry.boundingBox;
        transform.multiplyMatrices(camera.matrixWorldInverse, node.matrixWorld);
        for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
          viewBox.expandByPoint(corner.set(x, y, z).applyMatrix4(transform));
        }
      }
      const aspect = width / height;
      const halfHeight = Math.max((viewBox.max.y - viewBox.min.y) / 2, (viewBox.max.x - viewBox.min.x) / (2 * aspect)) * 1.08 / zoom;
      const centerX = (viewBox.min.x + viewBox.max.x) / 2, centerY = (viewBox.min.y + viewBox.max.y) / 2;
      camera.left = centerX - halfHeight * aspect; camera.right = centerX + halfHeight * aspect;
      camera.top = centerY + halfHeight; camera.bottom = centerY - halfHeight;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
      // Keep the accessible angle in its declared range through full revolutions.
      const degrees = (yaw - initialYaw) * 180 / Math.PI;
      canvas.setAttribute('aria-valuenow', String(Math.round(((degrees + 180) % 360 + 360) % 360 - 180)));
    }
    function requestRender() { if (alive && visible && !frame) frame = requestAnimationFrame(render); }
    function setVisible(value) {
      visible = value;
      canvas.inert = !visible;
      canvas.tabIndex = visible ? 0 : -1;
      canvas.setAttribute('aria-hidden', String(!visible));
      if (!visible && drag) {
        if (canvas.hasPointerCapture(drag.id)) canvas.releasePointerCapture(drag.id);
        drag = null;
      }
      if (visible) requestRender();
      else { cancelAnimationFrame(frame); frame = 0; }
    }
    function resetView() { yaw = initialYaw; zoom = 1; requestRender(); }
    function setTheme() { updateTheme(document.documentElement.classList.contains('light-theme')); requestRender(); }
    function dispose() {
      if (!alive) return;
      alive = false; cancelAnimationFrame(frame);
      listeners.abort(); resizeObserver.disconnect(); themeObserver.disconnect();
      const resources = new Set();
      scene.traverse(node => {
        if (node.geometry) resources.add(node.geometry);
        for (const material of [node.material].flat().filter(Boolean)) {
          resources.add(material);
          for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
        }
      });
      resources.forEach(resource => resource.dispose());
      environment.dispose(); renderer.dispose(); canvas.remove();
    }
    on(canvas, 'pointerdown', event => {
      if (event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw, moved: false };
    });
    on(canvas, 'pointermove', event => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (!drag.moved && (Math.abs(dx) < 6 || Math.abs(dy) > Math.abs(dx))) return;
      drag.moved = true; canvas.setPointerCapture(event.pointerId);
      yaw = drag.yaw + dx / Math.max(1, viewport.clientWidth) * Math.PI * 1.6;
      requestRender();
    });
    const release = event => {
      if (drag?.id !== event.pointerId) return;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      drag = null;
    };
    on(canvas, 'pointerup', release); on(canvas, 'pointercancel', release); on(canvas, 'lostpointercapture', () => { drag = null; });
    on(canvas, 'keydown', event => {
      if (event.key === 'ArrowLeft') yaw -= .15;
      else if (event.key === 'ArrowRight') yaw += .15;
      else if (event.key === '+' || event.key === '=') zoom = Math.min(1.3, zoom + .05);
      else if (event.key === '-' || event.key === '−') zoom = Math.max(.75, zoom - .05);
      else if (event.key === 'Home') resetView();
      else return;
      event.preventDefault(); requestRender();
    });
    on(reset, 'click', resetView);
    on(document, 'visibilitychange', requestRender);
    on(window, 'site-language-change', () => canvas.setAttribute('aria-label', t(`${key}Canvas`)));
    on(canvas, 'webglcontextlost', event => {
      event.preventDefault(); dispose(); onFailure();
    });
    // A BFCache navigation retains resources. A real unload releases them.
    on(window, 'pagehide', event => { if (!event.persisted) dispose(); });
    const themeObserver = new MutationObserver(setTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    resizeObserver.observe(viewport);
    setTheme(); render();
    return { canvas, setVisible };
  } catch (error) {
    environment?.dispose(); renderer?.dispose(); viewport.querySelector('canvas')?.remove();
    throw error;
  }
}
