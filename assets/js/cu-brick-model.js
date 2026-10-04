/* Simplified site hardware follows the CU_BRICK_CAD subsystem inventory and the
 * supplied site plan/photos. The close-up uses the separate v9 STEP derivative.
 * Distances and exploded offsets in the site overview are illustrative. */
export function createBrickModels(THREE, cad) {
  const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const finishes = {
    metal: new THREE.MeshStandardMaterial({ color: 0xc8cbcc, metalness: .78, roughness: .34 }),
    steel: new THREE.MeshStandardMaterial({ color: 0xa4a8aa, metalness: .75, roughness: .30 }),
    orange: new THREE.MeshStandardMaterial({ color: 0xff5b19, metalness: 0, roughness: .57 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x171b1e, metalness: .02, roughness: .65 }),
    blue: new THREE.MeshStandardMaterial({ color: 0x008fe3, metalness: 0, roughness: .52 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x1a2932, metalness: .3, roughness: .16 }),
    concrete: new THREE.MeshStandardMaterial({ color: 0x8d8c84, metalness: 0, roughness: 1 }),
    brick: new THREE.MeshStandardMaterial({ color: 0x9b4938, metalness: 0, roughness: .96 })
  };
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 20);
  function box(parent, size, position, finish = 'metal') {
    const mesh = new THREE.Mesh(boxGeometry, finishes[finish]);
    mesh.scale.set(...size); mesh.position.set(...position); parent.add(mesh); return mesh;
  }
  function cylinder(parent, radius, length, position, finish = 'metal', axis = 'y') {
    const mesh = new THREE.Mesh(cylinderGeometry, finishes[finish]);
    mesh.scale.set(radius, length, radius); mesh.position.set(...position);
    if (axis === 'x') mesh.rotation.z = Math.PI / 2;
    if (axis === 'z') mesh.rotation.x = Math.PI / 2;
    parent.add(mesh); return mesh;
  }
  function beam(parent, a, b, thickness, finish = 'steel') {
    const from = V(...a), to = V(...b), direction = to.clone().sub(from);
    const mesh = box(parent, [thickness, direction.length(), thickness], from.add(to).multiplyScalar(.5).toArray(), finish);
    mesh.quaternion.setFromUnitVectors(V(0, 1, 0), direction.normalize());
    return mesh;
  }
  function createModel() {
    const object = new THREE.Group(), parts = [], moving = [];
    function part(id, group, anchor, offset = [0, 0, 0]) {
      const entry = { id, group, anchor: V(...anchor), rest: group.position.clone(), offset: V(...offset) };
      parts.push(entry); moving.push(entry); object.add(group); return entry;
    }
    function move(progress) {
      moving.forEach(item => item.group.position.copy(item.rest).addScaledVector(item.offset, progress));
    }
    return { object, parts, part, move };
  }

  const detail = createModel();
  // Separate complete functions, not individual pieces of hardware. Neutral
  // parents preserve the transforms of the photo-corrected web derivative.
  const modules = {
    support: new THREE.Group(), power: new THREE.Group(),
    rotation: new THREE.Group(), grip: new THREE.Group(), vision: new THREE.Group()
  };
  const functions = {
    frame: 'support', anchors: 'support', enclosure: 'power', batteryMount: 'power', rotation: 'rotation',
    drive: 'grip', gripper: 'grip', jaws: 'grip', release: 'grip'
  };
  for (const [id, module] of Object.entries(functions)) {
    const node = cad.getObjectByName(id);
    if (!node) throw new Error(`Missing CU-Brick group: ${id}`);
    // Keep the compression transforms inside their original nodes.
    modules[module].add(node);
    // Match EE_Pic_2: satin aluminium, orange printed housings, black electronics
    // and battery holder. Preserve the CAD geometry and source material names.
    const sourceFinishes = { aluminum: 'metal', steel: 'steel', black: 'dark', orange: 'orange' };
    const releasePusher = id === 'release' ? node.getObjectByName('releasePusher') : null;
    node.traverse(mesh => {
      if (!mesh.material) return;
      const finish = source => {
        const material = source.clone();
        let key = sourceFinishes[source.name] ?? 'metal';
        if (source.name === 'orange') {
          if (id === 'batteryMount' || id === 'frame') key = 'dark';
          // The converter groups the moving release plates with printed parts;
          // the photographed plates are silver metal, unlike their orange mounts.
          if (releasePusher?.getObjectById(mesh.id)) key = 'steel';
        }
        material.color.copy(finishes[key].color);
        material.metalness = finishes[key].metalness;
        material.roughness = finishes[key].roughness;
        return material;
      };
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(finish) : finish(mesh.material);
    });
  }
  // Accessories follow EE_Pic_2. The actual printed battery holder has a
  // 95 x 65 mm pocket: X +/-47.5, Z -136.85..-71.85, floor Y 84.378 mm.
  // Keep the pack seated inside that pocket, not floating beside the housing.
  const electronics = new THREE.Group();
  const battery = box(electronics, [.09, .108, .06], [0, .139, -.10435], 'blue');
  battery.name = 'battery';
  // A short power lead connects the exposed pack top to the enclosure.
  beam(electronics, [.022, .193, -.102], [.022, .204, -.079], .0025, 'dark');
  beam(electronics, [.022, .204, -.079], [.022, .178, -.045], .0025, 'dark');
  electronics.name = 'electronics'; modules.power.add(electronics);
  const raspberryPi = new THREE.Group();
  raspberryPi.name = 'raspberryPi';
  box(raspberryPi, [.10, .052, .04], [0, .138, .166], 'dark');
  for (let i = 0; i < 5; i++) box(raspberryPi, [.003, .023, .001], [-.034 + i * .008, .143, .1865], 'steel');
  box(raspberryPi, [.014, .005, .002], [.029, .12, .187], 'steel');
  modules.vision.add(raspberryPi);
  const camera = new THREE.Group();
  box(camera, [.09, .029, .025], [.1, -.087, .197], 'dark');
  cylinder(camera, .008, .005, [.1, -.087, .212], 'glass', 'z');
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) box(camera, [.016, .001, .001], [.1 + side * .029, -.092 + i * .005, .21], 'steel');
  }
  box(camera, [.045, .014, .044], [.1, -.103, .18], 'steel');
  camera.name = 'camera'; modules.vision.add(camera);
  const payload = new THREE.Group();
  // The posed CAD pads face inward at Z +/-47.5 mm. The brick's long
  // axis runs across X, so both pads grip its long vertical faces.
  // Its top meets the release plates, leaving 25 mm beneath the jaws.
  box(payload, [.156, .065, .095], [0, -.132, 0], 'brick');
  // Keep the held brick with the jaws when separating by function.
  payload.name = 'payload'; modules.grip.add(payload);
  const turntable = new THREE.Group(); turntable.name = 'gripTurntable';
  turntable.add(...modules.grip.children); modules.grip.add(turntable);
  const joint = name => {
    const node = Object.values(modules).map(group => group.getObjectByName(name)).find(Boolean);
    if (!node) throw new Error(`Missing CU-Brick joint: ${name}`);
    return { node, rest: node.position.clone() };
  };
  const rotor = joint('rotationRotor'), pinion = joint('gripPinion'), pusher = joint('releasePusher');
  const jaws = [-1, 1].flatMap(side => ['jaw', 'gripperJaw'].map(prefix => ({
    ...joint(`${prefix}${side < 0 ? 'Negative' : 'Positive'}`), side
  })));
  const payloadRest = payload.position.clone();
  const smooth = (value, from = 0, to = 1) => {
    const x = THREE.MathUtils.clamp((value - from) / (to - from), 0, 1);
    return x * x * (3 - 2 * x);
  };
  let releasedHeading = 0, detached = false;
  detail.part('support', modules.support, [-.18, .1, .18], [-.22, .01, 0]);
  detail.part('power', modules.power, [0, .18, -.03], [.24, .15, -.06]);
  detail.part('rotation', modules.rotation, [0, .055, .04], [.34, .055, -.08]);
  const grippingPart = detail.part('grip', modules.grip, [0, -.10, .09], [.34, -.13, -.06]);
  const gripAnchor = grippingPart.anchor.clone();
  detail.part('vision', modules.vision, [.1, -.087, .215], [-.16, -.12, .03]);
  detail.update = (progress, { rotation = 0, release = 0 } = {}) => {
    detail.move(progress);
    const angle = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(rotation, -180, 180));
    const phase = THREE.MathUtils.clamp(release, 0, 1);
    const travel = .0305 * smooth(phase, 0, .55);
    const drop = .055 * smooth(phase, .25, 1);
    jaws.forEach(({ node, rest, side }) => node.position.copy(rest).add(V(0, 0, side * travel)));
    pinion.node.rotation.y = -travel / .026;
    rotor.node.rotation.y = turntable.rotation.y = angle;
    grippingPart.anchor.copy(gripAnchor).applyAxisAngle(V(0, 1, 0), angle);
    // The guided pushers follow the initial descent, then retract once clear.
    pusher.node.position.copy(pusher.rest).add(V(0, -Math.min(drop, .016) * (1 - smooth(phase, .75, 1)), 0));
    if (!detached || phase <= .25) releasedHeading = angle;
    detached = phase > .25;
    payload.position.copy(payloadRest).add(V(0, -drop, 0));
    // A released brick keeps its heading when the empty gripper turns. Returning
    // the control smoothly aligns it with the jaws for the illustrative re-grip.
    payload.rotation.y = (releasedHeading - angle) * smooth(phase, .25, 1);
    modules.grip.userData.motion = { rotation, release: phase };
  };
  detail.yaw = .72; detail.pitch = .32;

  const site = createModel();
  // Plan positions from the saved SolidWorks assembly transforms. The site is
  // centered at (-5.712, -7.501) in CAD X/Z, with Z reversed to match the plan.
  const poles = [[-3.646, 0, 8.406], [6.805, 0, 4.694], [6.246, 0, -8.406], [-6.805, 0, -6.813]];
  const poleParts = [], motors = [], lower = [], upper = [];
  const winches = new THREE.Group(), pulleys = new THREE.Group();
  const pulley = (parent, position) => {
    const carrier = new THREE.Group(); carrier.position.set(...position); parent.add(carrier);
    box(carrier, [.32, .26, .13], [0, 0, 0], 'orange');
    cylinder(carrier, .10, .10, [0, 0, .115], 'steel', 'z');
    cylinder(carrier, .065, .11, [0, 0, .12], 'metal', 'z');
    return carrier;
  };
  poles.forEach((position, index) => {
    const [x, , z] = position;
    const outward = V(x, 0, z).normalize();
    const group = new THREE.Group(); group.position.set(...position);
    box(group, [1.05, .22, 1.1], [0, .01, 0], 'concrete');
    box(group, [.10, 4.35, .28], [0, 2.27, 0], 'steel');
    box(group, [.34, 4.35, .055], [0, 2.27, -.145], 'metal');
    box(group, [.34, 4.35, .055], [0, 2.27, .145], 'metal');
    box(group, [.065, 3.75, .07], [-.1, 2.3, .21], 'dark');
    box(group, [.024, 3.75, .05], [.09, 2.3, .205], 'metal');
    beam(group, [-.4, .1, -.4], [0, 1.5, -.15], .08);
    beam(group, [.4, .1, -.4], [0, 1.5, -.15], .08);
    upper.push(pulley(group, [0, 4.16, .24]));
    poleParts.push(site.part(`pole${index}`, group, [0, 4.45, 0], outward.multiplyScalar(.85).toArray()));
    const carriage = pulley(pulleys, [x, 1.15, z + .24]);
    lower.push(carriage);
    const pair = new THREE.Group(); pair.position.set(x, .45, z + .39); winches.add(pair);
    for (let j = 0; j < 2; j++) {
      const y = j * 2.1;
      box(pair, [.43, .08, .35], [0, y - .18, 0], 'steel');
      box(pair, [.24, .24, .28], [-.19, y, 0], 'dark');
      cylinder(pair, .14, .25, [.13, y, 0], 'metal', 'x');
      cylinder(pair, .16, .035, [.02, y, 0], 'orange', 'x');
      cylinder(pair, .16, .035, [.255, y, 0], 'orange', 'x');
    }
    motors.push(pair);
  });
  site.part('winches', winches, [-3.4, .5, 8.8]);
  site.part('pulleys', pulleys, [6.805, 1.15, 4.934]);
  const effector = detail.object.clone(true);
  effector.position.set(.65, 2.7, .35);
  // At site scale the 380 mm frame is enlarged 2.2x for legibility.
  effector.scale.setScalar(2.2);
  const effectorPart = site.part('effector', effector, [0, .14, 0], [0, 1.3, 0]);
  effectorPart.screenOffset = [-32, -28];

  const pickup = new THREE.Group(); pickup.position.set(6.925, 0, .072);
  box(pickup, [.95, .22, .95], [0, .01, 0], 'concrete');
  box(pickup, [.16, 4.0, .25], [0, 2.1, 0], 'steel');
  box(pickup, [.29, 4.0, .06], [0, 2.1, .14], 'metal');
  box(pickup, [.045, 3.7, .055], [-.08, 2.1, .20], 'metal');
  box(pickup, [.045, 3.7, .055], [.08, 2.1, .20], 'metal');
  box(pickup, [.075, 3.7, .08], [-.23, 2.1, 0], 'dark');
  beam(pickup, [.0, .18, -.4], [0, 1.7, 0], .08);
  const pickupCarriage = new THREE.Group(); pickupCarriage.position.y = 1.65; pickup.add(pickupCarriage);
  box(pickupCarriage, [.34, .36, .15], [0, 0, .26], 'metal');
  box(pickupCarriage, [1.3, .11, .16], [-.65, -.06, .26], 'metal');
  box(pickupCarriage, [.40, .08, .48], [-1.19, .015, .26], 'orange');
  box(pickupCarriage, [.24, .115, .12], [-1.19, .115, .26], 'brick');
  box(pickup, [.38, .52, .23], [.40, .6, 0], 'steel');
  site.part('pickup', pickup, [0, 3.1, .15], [1.3, 0, 0]);
  const conveyor = new THREE.Group(); conveyor.position.set(7.660, 0, -1.480);
  for (const x of [-.34, .34]) {
    box(conveyor, [.075, .85, .075], [x, .45, -.5]);
    box(conveyor, [.075, .85, .075], [x, .45, .8]);
    box(conveyor, [.065, .16, 2], [x, .91, .1]);
  }
  box(conveyor, [.64, .08, 2], [0, .86, .1], 'dark');
  for (let i = 0; i < 12; i++) cylinder(conveyor, .045, .60, [0, .94, -.80 + i * .16], 'steel', 'x');
  for (let i = 0; i < 4; i++) box(conveyor, [.25, .115, .12], [0, 1.04, -.6 + i * .38], 'brick');
  site.part('conveyor', conveyor, [.1, 1.05, .7], [1.3, 0, 1]);

  const cables = new THREE.Group(), cableLines = [];
  const upperMaterial = new THREE.LineBasicMaterial({ color: 0xa98e68 });
  const lowerMaterial = new THREE.LineBasicMaterial({ color: 0x97a2a8 });
  for (let i = 0; i < 8; i++) {
    const geometry = new THREE.BufferGeometry().setFromPoints([V(), V(), V()]);
    const line = new THREE.Line(geometry, i < 4 ? upperMaterial : lowerMaterial);
    cables.add(line); cableLines.push(line);
  }
  site.part('cables', cables, [-1.65, 3.6, -2.0]);
  const backdrop = new THREE.Group();
  const slab = box(backdrop, [16.8, .08, 18.5], [.4, -.15, 0], 'dark');
  slab.material = new THREE.MeshBasicMaterial({ color: 0x191d1f });
  const grid = new THREE.GridHelper(19, 19, 0x383e41, 0x282e31); grid.position.y = -.10;
  const gridColors = grid.geometry.getAttribute('color');
  const darkGridColors = gridColors.array.slice(), lightGridColor = new THREE.Color(0xbac4be);
  backdrop.add(grid);
  // A few curved courses locate the pavilion without obscuring the cable system.
  const paths = [
    [[-3.5, 0, -4.3], [-3.7, 0, -2.6], [-2.5, 0, -.9], [-.5, 0, 0], [.2, 0, 1.8], [-1, 0, 3.8], [-3, 0, 5.4]],
    [[-.5, 0, 0], [1.5, 0, -.7], [3.1, 0, -3], [4.1, 0, -4.1]],
    [[.1, 0, 1.6], [1.6, 0, 2.5], [3.4, 0, 2.3], [4.5, 0, 3.8]]
  ].map(points => new THREE.CatmullRomCurve3(points.map(p => V(...p))));
  const samples = paths.map(curve => Math.floor(curve.getLength() / .28));
  const wall = new THREE.InstancedMesh(boxGeometry, finishes.brick, samples.reduce((sum, n) => sum + n * 4, 0));
  const dummy = new THREE.Object3D(); let brickIndex = 0;
  for (let branch = 0; branch < 3; branch++) {
    for (let layer = 0; layer < 4; layer++) {
      for (let i = 0; i < samples[branch]; i++) {
        const fraction = (i + (layer % 2) * .45) / samples[branch];
        const point = paths[branch].getPointAt(fraction), tangent = paths[branch].getTangentAt(fraction);
        dummy.position.copy(point); dummy.position.y = .075 + layer * .14;
        dummy.rotation.y = Math.atan2(tangent.x, tangent.z); dummy.scale.set(.12, .12, .25); dummy.updateMatrix();
        wall.setMatrixAt(brickIndex++, dummy.matrix);
      }
    }
  }
  backdrop.add(wall); site.object.add(backdrop);
  const siteOrder = ['pole0', 'pole1', 'pole2', 'pole3', 'winches', 'pulleys', 'cables', 'effector', 'pickup', 'conveyor'];
  site.parts.sort((a, b) => siteOrder.indexOf(a.id) - siteOrder.indexOf(b.id));
  site.yaw = .62; site.pitch = .55;
  site.update = (progress, elevation) => {
    site.move(progress);
    poleParts.forEach((part, i) => {
      const offset = part.group.position.clone().sub(part.rest);
      lower[i].position.copy(V(...poles[i])).add(offset).add(V(0, 1.15 + elevation * 1.45, .24 + progress * .5));
      motors[i].position.copy(V(...poles[i])).add(offset).add(V(progress * .42, .45, .39 + progress * .55));
    });
    pickupCarriage.position.y = 1.65 + elevation * 1.3;
    site.parts.find(part => part.id === 'pulleys').anchor.copy(lower[1].position);
    site.object.updateMatrixWorld(true);
    for (let i = 0; i < 8; i++) {
      const index = i % 4, isUpper = i < 4;
      const start = motors[index].localToWorld(V(.13, isUpper ? 2.1 : 0, 0));
      const pulleyPosition = (isUpper ? upper[index] : lower[index]).getWorldPosition(V()).add(V(0, 0, .15));
      const end = effectorPart.group.localToWorld(V(poles[index][0] < 0 ? -.22 : .22, isUpper ? .10 : -.10, poles[index][2] < 0 ? -.18 : .18));
      const attribute = cableLines[i].geometry.attributes.position;
      [start, pulleyPosition, end].forEach((p, j) => attribute.setXYZ(j, p.x, p.y, p.z));
      attribute.needsUpdate = true; cableLines[i].geometry.computeBoundingSphere();
    }
  };
  // Clone materials by subsystem so selections never change another subsystem
  // or the corresponding object in the other view.
  for (const model of [detail, site]) {
    for (const part of model.parts) {
      const materials = new Map();
      part.group.traverse(node => {
        node.userData.partId = part.id;
        if (!node.material) return;
        const clone = material => {
          if (!materials.has(material)) materials.set(material, material.clone());
          return materials.get(material);
        };
        node.material = Array.isArray(node.material) ? node.material.map(clone) : clone(node.material);
      });
    }
  }
  // The site backdrop and thin cable spans need their own contrast on a light
  // stage. Keep the CAD finishes and all geometry independent of the theme.
  site.setTheme = isLight => {
    slab.material.color.setHex(isLight ? 0xe3e7e4 : 0x191d1f);
    if (isLight) {
      for (let i = 0; i < gridColors.count; i++) gridColors.setXYZ(i, lightGridColor.r, lightGridColor.g, lightGridColor.b);
    } else gridColors.array.set(darkGridColors);
    gridColors.needsUpdate = true;
    cableLines.forEach((line, i) => {
      const color = isLight ? (i < 4 ? 0x80613c : 0x56646b) : (i < 4 ? 0xa98e68 : 0x97a2a8);
      line.material.color.setHex(color);
      line.material.userData.originalColor = color;
    });
  };
  site.update(0, 0); detail.update(0);
  return { site, detail };
}
