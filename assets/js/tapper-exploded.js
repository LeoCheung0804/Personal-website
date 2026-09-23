/* Local CAD-derived model; reconstructed guards. Offsets illustrate subsystem
 * relationships, not joint motion or a physical disassembly sequence. */
const root = document.querySelector('[data-tapper-explorer]');
if (root) {
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    initialize().catch(() => showFallback());
  }, { rootMargin: '400px' });
  observer.observe(root);
}

function showFallback() {
  root.classList.remove('is-ready');
  root.querySelector('canvas')?.remove();
  root.querySelector('[data-explorer-controls]').hidden = true;
  root.querySelectorAll('[data-part-label]').forEach(label => label.hidden = true);
  const message = root.querySelector('[data-explorer-fallback]');
  message.hidden = false;
  message.dataset.i18n = 'explorer.unavailable';
  message.textContent = window.getTranslation('explorer.unavailable');
}

async function initialize() {
  const THREE = await import('../vendor/three/three.module.min.js');
  const container = root.querySelector('[data-explorer-viewport]');
  const panel = root.querySelector('.tapper-explorer__panel');
  const slider = root.querySelector('input[type="range"]');
  const output = root.querySelector('output');
  const status = root.querySelector('[data-explorer-status]');
  const followButton = root.querySelector('[data-explorer-follow]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const compactScreen = matchMedia('(max-width: 700px)');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x101b19, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute('role', 'slider');
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-valuemin', '-180');
  canvas.setAttribute('aria-valuemax', '180');
  canvas.setAttribute('aria-label', window.getTranslation('explorer.canvas'));
  canvas.setAttribute('aria-describedby', 'explorer-interaction');
  container.append(canvas);

  const scene = new THREE.Scene();
  const { RoomEnvironment } = await import('../vendor/three/addons/environments/RoomEnvironment.js');
  const studio = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(studio, .04);
  scene.environment = environment.texture;
  scene.environmentIntensity = .85;
  studio.dispose();
  pmrem.dispose();
  const camera = new THREE.OrthographicCamera(-5, 5, 4, -4, .1, 100);
  camera.position.set(7, 5, 9);
  camera.lookAt(0, .2, 0);
  scene.add(new THREE.HemisphereLight(0xf0f4ff, 0x303944, .7));
  const keyLight = new THREE.DirectionalLight(0xfff0df, 2.5);
  keyLight.position.set(-3, 6, 5);
  scene.add(keyLight);
  const rim = new THREE.DirectionalLight(0xd3e8ec, .8);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  const [{ GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
    import('../vendor/three/addons/loaders/GLTFLoader.js'),
    import('../vendor/three/addons/libs/meshopt_decoder.module.js')
  ]);
  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
    .loadAsync(new URL('../models/robosun-tapper.glb', import.meta.url).href);
  const assembly = new THREE.Group();
  const asset = gltf.scene;
  assembly.add(asset);
  scene.add(assembly);
  let source = asset;
  while (source.children.length === 1 && !source.children[0].isMesh) source = source.children[0];
  const sourceNodes = [...source.children];
  const groups = Object.fromEntries(['frame', 'thrusters', 'drives', 'arm', 'tool'].map(name => {
    const group = new THREE.Group(); group.name = name; source.add(group); return [name, group];
  }));
  // Source assembly names are retained in the GLB. Keep whole subassemblies together.
  for (const node of sourceNodes) {
    const name = node.name;
    const key = /^New_propeller_V2/.test(name) ? 'thrusters'
      : /^(MG4010|inafag)/.test(name) ? 'drives'
      : /^EF_V2_ASM_TAP/.test(name) ? 'tool'
      : /^(Frame_V3|counter_assem|motor_cover|Part1)/.test(name) ? 'frame' : 'arm';
    groups[key].add(node);
  }
  if (Object.values(groups).some(group => !group.children.length)) throw new Error('Incomplete subsystem mapping');
  const { createTapperFinishes } = await import('./tapper-materials.js?v=20260923-2');
  const { materials: finishes, mapSurface } = createTapperFinishes(THREE, renderer);
  assembly.updateMatrixWorld(true);
  for (const [name, group] of Object.entries(groups)) {
    group.traverse(node => {
      if (!node.isMesh) return;
      const hardware = /shaft|bearing|rod|bolt|screw|nut/i.test(node.name);
      const rubber = /wheel|tire|caster/i.test(node.name);
      const motor = /U7Rotor|U7Stator|motor/i.test(node.name);
      const finish = rubber ? 'rubber' : hardware ? 'hardware' : motor ? 'motor'
        : name === 'frame' ? 'aluminum' : name === 'arm' || name === 'thrusters' ? 'carbon' : 'motor';
      node.material = finishes[finish];
      if (finish !== 'aluminum' && finish !== 'carbon') return;
      mapSurface(node);
    });
  }
  // Rotate the CAD coordinate system upright and center it in the page.
  asset.rotation.z = Math.PI + Math.atan2(.4327485235, .9015146784);
  asset.scale.setScalar(5);
  const center = new THREE.Box3().setFromObject(asset).getCenter(new THREE.Vector3());
  asset.position.sub(center);
  assembly.updateMatrixWorld(true);
  const parts = [];
  function part(name, group) { parts.push({ name, group }); }
  // The two thrusters move apart as complete modules, sharing one legend entry.
  const thrusters = [...groups.thrusters.children];
  thrusters.forEach((node, index) => part(index ? null : 'thrusters', node));
  part('drives', groups.drives);
  part('arm', groups.arm);
  part('tool', groups.tool);
  // Tip-facing view, with the two thrusters spanning the screen.
  const tipCenter = new THREE.Box3().setFromObject(groups.tool).getCenter(new THREE.Vector3());
  const frameCenter = new THREE.Box3().setFromObject(groups.frame).getCenter(new THREE.Vector3());
  // Frame_V3 local vertical from the CAD transform, independent of the arm pose.
  const yawAxis = new THREE.Vector3(.9015146784, -.4327485235, 0)
    .applyQuaternion(asset.quaternion).normalize();
  const tipDirection = tipCenter.sub(frameCenter);
  tipDirection.addScaledVector(yawAxis, -tipDirection.dot(yawAxis)).normalize();
  // Look down the frame-to-tip axis: the contact wheels point toward the screen.
  camera.position.copy(tipDirection).multiplyScalar(10);
  camera.up.copy(yawAxis);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  const frontLight = new THREE.DirectionalLight(0xf4f6ff, .9);
  frontLight.position.copy(camera.position).addScaledVector(camera.up, 5).add(new THREE.Vector3(0, 0, -4));
  scene.add(frontLight);
  scene.add(new THREE.AmbientLight(0xdbe4ed, .25));
  // The paired scissor planes open along the CAD frame's normal (E).
  // Link lengths stay rigid; only their center positions and joint angles change.
  const extensionAxis = new THREE.Vector3(.4327485235, .9015146784, 0);
  const crossAxis = new THREE.Vector3(.9015146784, -.4327485235, 0);
  const anchorE = -.3581, anchorU = .3952;
  const sourceInverse = source.matrixWorld.clone().invert();
  const armNodes = sourceNodes.filter(node => /^(SBar|Long_bar|Thrust_bearing|ROD_middle|slider|Driving_bar|Driven_bar|Extend_assem|EF_V2_ASM_TAP)/.test(node.name));
  const mechanisms = armNodes.map(node => {
    const min = new THREE.Vector3(Infinity, Infinity, Infinity), max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    let count = 0, sumE = 0, sumU = 0, ee = 0, uu = 0, eu = 0;
    node.traverse(mesh => {
      if (!mesh.isMesh) return;
      const matrix = sourceInverse.clone().multiply(mesh.matrixWorld);
      const points = mesh.geometry.attributes.position;
      for (let i = 0; i < points.count; i++) {
        const point = new THREE.Vector3().fromBufferAttribute(points, i).applyMatrix4(matrix);
        const e = point.dot(extensionAxis), u = point.dot(crossAxis);
        const local = new THREE.Vector3(e, u, point.z);
        min.min(local); max.max(local);
        count++; sumE += e; sumU += u; ee += e * e; uu += u * u; eu += e * u;
      }
    });
    const center = min.add(max).multiplyScalar(.5);
    const angle = .5 * Math.atan2(2 * (eu - sumE * sumU / count), ee - sumE * sumE / count - uu + sumU * sumU / count);
    return { node, center, angle, bar: /^(SBar|Long_bar)/.test(node.name), tip: /^(Extend_assem|EF_V2_ASM_TAP)/.test(node.name), original: node.matrix.clone() };
  });
  function extendLinkage(amount) {
    const stretch = 1 + 2.8 * amount;
    // Hole spacing measured from the CAD: 249 mm transverse, 22.36 mm axial.
    const compress = Math.sqrt(.249 ** 2 + .02236 ** 2 - (.02236 * stretch) ** 2) / .249;
    for (const item of mechanisms) {
      const { node, center, angle, bar, tip } = item;
      node.matrixAutoUpdate = false;
      if (!tip && (center.x < -.37 || center.x > -.19 || center.y < .13 || center.y > .42)) { node.matrix.copy(item.original); continue; }
      const oldCenter = extensionAxis.clone().multiplyScalar(center.x).addScaledVector(crossAxis, center.y).add(new THREE.Vector3(0, 0, center.z));
      const newCenter = oldCenter.clone();
      if (tip) {
        // Both the end carriage and head translate identically: their mounting planes remain parallel.
        newCenter.addScaledVector(extensionAxis, (-.2015 - anchorE) * (stretch - 1));
      } else {
        newCenter.addScaledVector(extensionAxis, (center.x - anchorE) * (stretch - 1));
        newCenter.addScaledVector(crossAxis, (center.y - anchorU) * (compress - 1));
      }
      const rotation = new THREE.Quaternion();
      if (bar) {
        const from = extensionAxis.clone().multiplyScalar(Math.cos(angle)).addScaledVector(crossAxis, Math.sin(angle)).normalize();
        const to = extensionAxis.clone().multiplyScalar(Math.cos(angle) * stretch).addScaledVector(crossAxis, Math.sin(angle) * compress).normalize();
        rotation.setFromUnitVectors(from, to);
      }
      const translation = newCenter.sub(oldCenter.clone().applyQuaternion(rotation));
      node.matrix.compose(translation, rotation, new THREE.Vector3(1, 1, 1)).multiply(item.original);
      node.matrixWorldNeedsUpdate = true;
    }
    source.updateMatrixWorld(true);
  }
  const layoutItems = [{ name: 'frame', group: groups.frame }, ...parts];
  for (const item of layoutItems) item.basePosition = item.group.position.clone();
  const screenRight = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
  const screenUp = camera.up.clone();
  const meshViewBox = new THREE.Box3();
  const meshViewMatrix = new THREE.Matrix4();
  function footprint(item) {
    // Transform each mesh's bounds straight into camera space. Rotating a world
    // bounding box first adds empty corners and unnecessarily shrinks the robot.
    const bounds = new THREE.Box3();
    item.group.traverse(node => {
      if (!node.isMesh) return;
      if (!node.geometry.boundingBox) node.geometry.computeBoundingBox();
      meshViewMatrix.multiplyMatrices(camera.matrixWorldInverse, node.matrixWorld);
      bounds.union(meshViewBox.copy(node.geometry.boundingBox).applyMatrix4(meshViewMatrix));
    });
    return bounds;
  }
  let meshCount = 0;
  asset.traverse(node => { if (node.isMesh) meshCount++; });
  root.dataset.meshCount = String(meshCount);
  root.dataset.subsystems = 'frame,thrusters,drives,arm,tool';

  let yaw = 0;
  let progress = 0;
  let follow = !motion.matches;
  let frameRequest = 0;
  let failed = false;
  const smooth = value => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };
  function render() {
    frameRequest = 0;
    if (failed) return;
    if (follow) {
      const rect = root.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(root.querySelector('.tapper-explorer__panel')).top) || 0;
      const travel = root.offsetHeight - root.querySelector('.tapper-explorer__panel').offsetHeight;
      progress = Math.max(0, Math.min(1, (top - rect.top) / Math.max(1, travel)));
    }
    const aspect = container.clientWidth / Math.max(1, container.clientHeight);
    // Layout stays in the viewing plane while individual modules retain their CAD yaw.
    for (const item of layoutItems) item.group.position.copy(item.basePosition);
    extendLinkage(smooth(progress));
    assembly.updateMatrixWorld(true);
    // A compact assembly reveal: keep drive hardware mounted and move the
    // linkage and tapping head as a pair, rather than distributing a parts grid.
    const reveal = smooth(progress);
    parts.forEach((part, index) => {
      let delta = new THREE.Vector3();
      if (index < 2) {
        const side = footprint(part).getCenter(new THREE.Vector3()).x < footprint(layoutItems[0]).getCenter(new THREE.Vector3()).x ? -1 : 1;
        delta.copy(screenRight).multiplyScalar(side * .32 * reveal);
      }
      const parent = part.group.parent;
      const origin = parent.worldToLocal(new THREE.Vector3());
      part.group.position.copy(part.basePosition).add(parent.worldToLocal(delta).sub(origin));
    });
    assembly.updateMatrixWorld(true);
    const displayBoxes = layoutItems.map(footprint);
    const total = new THREE.Box3();
    displayBoxes.forEach(box => total.union(box));
    const focus = total.getCenter(new THREE.Vector3());
    const size = total.getSize(new THREE.Vector3());
    // Fit the complete pose into the canvas, independently of the label rows.
    // Proportional margins keep small screens useful at every yaw and extension.
    const viewHeight = Math.max(.1, size.y / .92, size.x / (aspect * .94));
    camera.left = focus.x - viewHeight * aspect / 2;
    camera.right = focus.x + viewHeight * aspect / 2;
    camera.top = focus.y + viewHeight / 2;
    camera.bottom = focus.y - viewHeight / 2;
    camera.updateProjectionMatrix();
    slider.value = String(Math.round(progress * 100));
    output.value = `${Math.round(progress * 100)}%`;
    followButton.setAttribute('aria-pressed', String(follow));
    canvas.setAttribute('aria-label', window.getTranslation('explorer.canvas'));
    const key = progress < .05 ? 'assembledStatus' : progress > .96 ? 'explodedStatus' : 'movingStatus';
    status.textContent = window.getTranslation(`explorer.${follow ? key : 'manualStatus'}`);
    const degrees = Math.round(THREE.MathUtils.radToDeg(yaw));
    root.querySelector('[data-explorer-yaw]').value = `ψ = ${degrees}°`;
    canvas.setAttribute('aria-valuenow', String(degrees));
    canvas.setAttribute('aria-valuetext', `ψ = ${degrees}°`);
    renderer.render(scene, camera);
  }
  function requestRender() { if (!frameRequest && !failed) frameRequest = requestAnimationFrame(render); }
  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, width < 600 ? 1.5 : 1.75));
    renderer.setSize(width, height);
    updatePresentation();
    requestRender();
  }
  slider.addEventListener('input', () => { follow = false; progress = Number(slider.value) / 100; requestRender(); });
  root.querySelectorAll('[data-explorer-pose]').forEach(button => button.addEventListener('click', () => {
    follow = false;
    progress = Number(button.dataset.explorerPose);
    requestRender();
  }));
  followButton.addEventListener('click', () => { follow = !follow; requestRender(); });
  function setYaw(value) {
    yaw = THREE.MathUtils.euclideanModulo(value + Math.PI, Math.PI * 2) - Math.PI;
    assembly.quaternion.setFromAxisAngle(yawAxis, yaw);
    requestRender();
  }
  canvas.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) return;
    event.preventDefault();
    setYaw(event.key === 'Home' ? 0 : yaw + (event.key === 'ArrowRight' ? 1 : -1) * Math.PI / 36);
  });
  // Horizontal drag only; vertical touch movement remains native page scrolling.
  let pointer = null;
  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    pointer = { id: event.pointerId, x: event.clientX, rotation: yaw };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (!pointer || event.pointerId !== pointer.id) return;
    setYaw(pointer.rotation + (event.clientX - pointer.x) * .006);
    requestRender();
  });
  const endDrag = () => { pointer = null; };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  root.querySelector('[data-explorer-reset]').addEventListener('click', () => { setYaw(0); });
  function updatePresentation() {
    // Actual panel height includes translated/wrapped text and browser zoom.
    // Keep controls reachable instead of pinning an oversized panel offscreen.
    const stickyTop = parseFloat(getComputedStyle(root).getPropertyValue('--explorer-sticky-top')) || 0;
    const manualOnly = motion.matches || compactScreen.matches;
    followButton.hidden = manualOnly;
    const canFollow = !manualOnly && panel.offsetHeight + stickyTop + 16 <= document.documentElement.clientHeight;
    root.classList.toggle('is-inline', !canFollow);
    followButton.disabled = !canFollow;
    if (!canFollow) follow = false;
    requestRender();
  }
  motion.addEventListener('change', updatePresentation);
  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('site-language-change', resize);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resizeObserver.observe(panel);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    failed = true;
    cancelAnimationFrame(frameRequest);
    resizeObserver.disconnect();
    window.removeEventListener('scroll', requestRender);
    window.removeEventListener('resize', resize);
    window.removeEventListener('site-language-change', resize);
    motion.removeEventListener('change', updatePresentation);
    showFallback();
  });
  root.querySelector('[data-explorer-fallback]').hidden = true;
  root.querySelector('[data-explorer-controls]').hidden = false;
  root.classList.add('is-ready');
  resize();
}
