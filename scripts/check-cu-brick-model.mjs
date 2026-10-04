// Geometry/kinematic invariants; uses the same local modules as the browser.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as THREE from '../assets/vendor/three/three.module.min.js';
import { GLTFLoader } from '../assets/vendor/three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from '../assets/vendor/three/addons/libs/meshopt_decoder.module.js';
import { createBrickModels } from '../assets/js/cu-brick-model.js';

const bytes = await readFile(new URL('../assets/models/cu-brick-end-effector.glb', import.meta.url));
const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
  .parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
gltf.scene.updateMatrixWorld(true);
const sourceTransforms = new Map();
gltf.scene.traverse(node => { if (node.isMesh) sourceTransforms.set(node, node.matrixWorld.clone()); });
const { site, detail } = createBrickModels(THREE, gltf.scene);
assert.equal(site.parts.length, 11);
assert.equal(detail.parts.length, 5);
const find = (model, id) => model.parts.find(part => part.id === id);
const close = (actual, expected, tolerance = .0001) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);
detail.object.updateMatrixWorld(true);
sourceTransforms.forEach((matrix, node) => {
  assert.ok(detail.object.getObjectById(node.id), 'Every retained CAD mesh must survive regrouping');
  assert.deepEqual(node.matrixWorld.elements, matrix.elements, 'The assembled CAD pose must not change');
});
const frame = find(detail, 'support');
const frameBounds = new THREE.Box3();
frame.group.traverse(node => {
  if (node.material?.name === 'aluminum') frameBounds.union(new THREE.Box3().setFromObject(node));
});
const frameSize = frameBounds.getSize(new THREE.Vector3());
// Allow 1 mm for tessellation, quantization and the short rail overhang.
close(frameSize.x, .38, .001); close(frameSize.y, .22, .001); close(frameSize.z, .38, .001);

// Photo correction: the housing loses the separate 100 mm extension and the
// lid seats on its 188 mm top. The pack must fit the actual STEP mount pocket.
const enclosureBounds = new THREE.Box3().setFromObject(detail.object.getObjectByName('enclosure'));
close(enclosureBounds.min.y, .055, .001);
close(enclosureBounds.max.y, .192, .001);
const batteryBounds = new THREE.Box3().setFromObject(detail.object.getObjectByName('battery'));
assert.ok(batteryBounds.min.x > -.0475 && batteryBounds.max.x < .0475, 'Battery fits between the mount side walls');
assert.ok(batteryBounds.min.z > -.13685 && batteryBounds.max.z < -.07185, 'Battery fits between the mount front/back walls');
assert.ok(batteryBounds.min.y >= .084378 && batteryBounds.min.y < .086378, 'Battery rests on the printed pocket floor');
assert.ok(batteryBounds.max.y > .144378 && batteryBounds.max.y < .20, 'Only the upper part of the battery protrudes from its mount');

// Check contact against the two retained CAD pads, not just the payload's
// rotation: its long faces must touch the jaws with useful vertical overlap.
const turntable = detail.object.getObjectByName('gripTurntable');
function localBounds(name) {
  detail.object.updateMatrixWorld(true);
  const inverse = turntable.matrixWorld.clone().invert(), bounds = new THREE.Box3();
  detail.object.getObjectByName(name).traverse(node => {
    if (!node.geometry) return;
    node.geometry.computeBoundingBox();
    bounds.union(node.geometry.boundingBox.clone().applyMatrix4(inverse.clone().multiply(node.matrixWorld)));
  });
  return bounds;
}
function checkLongFaceGrip() {
  const brick = localBounds('payload');
  const size = brick.getSize(new THREE.Vector3());
  assert.ok(size.x > size.z * 1.5, 'Brick length runs across the jaws, perpendicular to their travel');
  for (const [name, face] of [['gripPadNegative', 'min'], ['gripPadPositive', 'max']]) {
    const pad = localBounds(name);
    close(face === 'min' ? pad.max.z : pad.min.z, brick[face].z, .0005);
    assert.ok(pad.min.x > brick.min.x && pad.max.x < brick.max.x, 'Each pad contacts a long face inside the brick ends');
    assert.ok(Math.min(pad.max.y, brick.max.y) - Math.max(pad.min.y, brick.min.y) > .035, 'Pads grip at least 35 mm of the brick height');
  }
}
checkLongFaceGrip();

const stationaryNames = ['frame', 'anchors', 'enclosure', 'batteryMount', 'camera', 'raspberryPi', 'rotationGeometry'];
const stationary = new Map(stationaryNames.map(name => [name, detail.object.getObjectByName(name).matrixWorld.clone()]));
const initialBrickSize = localBounds('payload').getSize(new THREE.Vector3());
const initialNegative = localBounds('gripPadNegative');
const initialPositive = localBounds('gripPadPositive');
const pusher = detail.object.getObjectByName('releasePusher');
const pusherRest = pusher.position.clone();
const carriers = ['jawNegative', 'jawPositive', 'gripperJawNegative', 'gripperJawPositive'];
const carrierRest = carriers.map(name => detail.object.getObjectByName(name).position.clone());
for (const separation of [0, .5, 1]) {
  for (const angle of [-180, -90, 0, 45, 90, 180]) {
    detail.update(separation, { rotation: angle, release: 0 });
    checkLongFaceGrip();
    const heading = new THREE.Vector3(1, 0, 0).applyQuaternion(turntable.getWorldQuaternion(new THREE.Quaternion()));
    close(heading.x, Math.cos(angle * Math.PI / 180)); close(heading.z, -Math.sin(angle * Math.PI / 180));
    const held = localBounds('payload');
    for (const phase of [.1, .4, .7, 1]) {
      detail.update(separation, { rotation: angle, release: phase });
      const negative = localBounds('gripPadNegative'), positive = localBounds('gripPadPositive');
      const brick = localBounds('payload');
      if (separation === 0) {
        for (const [name, matrix] of stationary) assert.deepEqual(detail.object.getObjectByName(name).matrixWorld.elements, matrix.elements, `${name} stays fixed while the tool rotates and releases`);
      }
      assert.ok(negative.max.z < initialNegative.max.z && positive.min.z > initialPositive.min.z, 'Jaws open symmetrically away from the long faces');
      close(initialNegative.max.z - negative.max.z, positive.min.z - initialPositive.min.z, .0005);
      assert.ok(brick.getSize(new THREE.Vector3()).distanceTo(initialBrickSize) < .0001, 'Articulation never stretches the brick');
      assert.ok(pusher.position.y <= pusherRest.y && pusher.position.y >= pusherRest.y - .0161, 'Release pushers stay within their guided stroke');
      if (phase === 1) {
        close(positive.min.z - negative.max.z, .156, .001);
        assert.ok(brick.max.y < negative.min.y - .01, 'Released brick clears both pads');
        close(held.min.y - brick.min.y, .055);
        assert.ok(pusher.position.distanceTo(pusherRest) < .0001, 'Pushers retract after release');
        carriers.forEach((name, i) => {
          const node = detail.object.getObjectByName(name);
          close(node.position.z - carrierRest[i].z, name.endsWith('Negative') ? -.0305 : .0305);
        });
      }
    }
  }
}
detail.update(0, { rotation: 90, release: 0 });
detail.update(0, { rotation: 90, release: 1 });
const releasedBrick = detail.object.getObjectByName('payload');
const releasedQuaternion = releasedBrick.getWorldQuaternion(new THREE.Quaternion());
detail.update(0, { rotation: -90, release: 1 });
assert.ok(releasedBrick.getWorldQuaternion(new THREE.Quaternion()).angleTo(releasedQuaternion) < .0001, 'An empty gripper can rotate without rotating the released brick');
detail.update(0);
checkLongFaceGrip();
detail.object.updateMatrixWorld(true);
for (const [name, matrix] of stationary) assert.deepEqual(detail.object.getObjectByName(name).matrixWorld.elements, matrix.elements, `${name} stays fixed during tool motion`);
sourceTransforms.forEach((matrix, node) => assert.deepEqual(node.matrixWorld.elements, matrix.elements, 'Re-gripping at zero restores every CAD body'));

const cables = find(site, 'cables').group.children;
const pulleys = find(site, 'pulleys').group.children;
assert.equal(cables.length, 8);
assert.equal(pulleys.length, 4);
const lowerPositions = pulleys.map(p => p.position.clone());
const initialCables = cables.map(line => [...line.geometry.attributes.position.array]);
site.update(0, 1);
pulleys.forEach((p, i) => {
  close(p.position.x, lowerPositions[i].x);
  close(p.position.y, lowerPositions[i].y + 1.45);
  close(p.position.z, lowerPositions[i].z);
});
cables.forEach((line, i) => {
  const positions = line.geometry.attributes.position.array;
  assert.equal(positions.length, 9, 'Winch -> pulley -> effector');
  assert.ok([...positions].every(Number.isFinite));
  // Upper cables stay fixed. Lower pulley vertices move vertically, while both
  // the drum and end-effector connections remain fixed.
  close(positions[4], initialCables[i][4] + (i < 4 ? 0 : 1.45));
  for (const j of [0, 1, 2, 3, 5, 6, 7, 8]) close(positions[j], initialCables[i][j]);
});
site.update(1, 1);
const effector = find(site, 'effector');
close(effector.group.position.y, effector.rest.y + 1.3);
cables.forEach((line, i) => {
  const expected = effector.group.localToWorld(new THREE.Vector3(
    i % 4 === 0 || i % 4 === 3 ? -.22 : .22, i < 4 ? .1 : -.1, i % 4 < 2 ? .18 : -.18));
  const actual = new THREE.Vector3().fromBufferAttribute(line.geometry.attributes.position, 2);
  assert.ok(actual.distanceTo(expected) < .0001, 'Cable must remain attached in every pose');
});
const before = detail.parts.map(p => new THREE.Box3().setFromObject(p.group).getSize(new THREE.Vector3()));
const functionalMembers = {
  support: ['frame', 'anchors'], power: ['enclosure', 'batteryMount', 'electronics', 'battery'], rotation: ['rotation'],
  grip: ['drive', 'gripper', 'jaws', 'release', 'payload'], vision: ['camera', 'raspberryPi']
};
const memberRest = new Map();
for (const [id, names] of Object.entries(functionalMembers)) {
  for (const name of names) {
    const member = find(detail, id).group.getObjectByName(name);
    assert.ok(member, `${name} belongs to the ${id} function`);
    memberRest.set(member, member.getWorldPosition(new THREE.Vector3()));
  }
}
detail.update(1);
checkLongFaceGrip();
detail.parts.forEach((p, i) => {
  const size = new THREE.Box3().setFromObject(p.group).getSize(new THREE.Vector3());
  assert.ok(size.distanceTo(before[i]) < .0001, 'Exploding must not stretch CAD geometry');
  assert.ok(p.group.position.distanceTo(p.rest.clone().add(p.offset)) < .0001);
  for (const name of functionalMembers[p.id]) {
    const member = p.group.getObjectByName(name);
    const displacement = member.getWorldPosition(new THREE.Vector3()).sub(memberRest.get(member));
    assert.ok(displacement.distanceTo(p.offset) < .0001, 'Hardware in a functional module must move together');
  }
});
const siteMaterials = new Set();
site.object.traverse(node => { if (node.material) siteMaterials.add(node.material); });
detail.object.traverse(node => {
  if (node.material) assert.ok(!siteMaterials.has(node.material), 'Highlighting must not leak between views');
});
site.update(0, 0); detail.update(0);
detail.object.updateMatrixWorld(true);
sourceTransforms.forEach((matrix, node) => assert.deepEqual(node.matrixWorld.elements, matrix.elements, 'Reassembly restores the original CAD'));
cables.forEach((line, i) => assert.deepEqual([...line.geometry.attributes.position.array], initialCables[i]));

// Full-site handoffs are deterministic, including reverse scrubbing. Test the
// actual transforms at every phase, not just the displayed stage labels.
const cycleBrick = site.object.getObjectByName('cycleBrick');
const cycleBrickSize = cycleBrick.scale.clone();
const transferTool = site.object.getObjectByName('transferTool');
const carriage = site.object.getObjectByName('pickupCarriage');
const arm = find(site, 'arm');
const feedCenter = cycleBrick.position.clone();
const siteTurntable = effector.group.getObjectByName('gripTurntable');
const up = new THREE.Vector3(0, 1, 0);
const world = node => node.getWorldPosition(new THREE.Vector3());
assert.equal(effector.group.getObjectByName('payload').visible, false, 'The static payload must not duplicate the moving brick');
for (const elevation of [0, .5, 1]) {
  for (let step = 0; step <= 100; step++) {
    const phase = step / 100;
    site.update(0, elevation, phase);
    assert.deepEqual(cycleBrick.scale, cycleBrickSize, 'The same brick size survives every handoff');
    assert.ok([...cycleBrick.position, ...effector.group.position].every(Number.isFinite));
    for (const name of ['transferUpperLink', 'transferForeLink']) close(site.object.getObjectByName(name).scale.y, 1.2);
    cables.forEach((line, i) => {
      const start = new THREE.Vector3().fromBufferAttribute(line.geometry.attributes.position, 0);
      const expected = effector.group.localToWorld(new THREE.Vector3(i % 4 === 0 || i % 4 === 3 ? -.22 : .22, i < 4 ? .1 : -.1, i % 4 < 2 ? .18 : -.18));
      const end = new THREE.Vector3().fromBufferAttribute(line.geometry.attributes.position, 2);
      assert.ok(end.distanceTo(expected) < .00001, 'Each cable follows its own moving frame attachment');
      assert.ok(start.distanceTo(new THREE.Vector3(...initialCables[i].slice(0, 3))) < .00001, 'Winch endpoints remain fixed');
    });
    if (site.cycle.owner === 'arm') {
      assert.ok(world(cycleBrick).distanceTo(world(transferTool).addScaledVector(up, -.18)) < .00001, 'Transfer jaws carry the brick');
    } else if (site.cycle.owner === 'pickup') {
      assert.ok(world(cycleBrick).distanceTo(carriage.localToWorld(new THREE.Vector3(-1.19, .055 + cycleBrickSize.y / 2, .26))) < .00001, 'The brick sits on the moving holder');
    } else if (site.cycle.owner === 'effector') {
      assert.ok(world(cycleBrick).distanceTo(effector.group.localToWorld(new THREE.Vector3(0, -.132, 0))) < .00001, 'The suspended gripper carries the brick');
      assert.ok(cycleBrick.getWorldQuaternion(new THREE.Quaternion()).angleTo(siteTurntable.getWorldQuaternion(new THREE.Quaternion())) < .00001, 'The held brick rotates with the gripper');
    } else if (site.cycle.owner === 'wall') {
      close(cycleBrick.position.y - cycleBrickSize.y / 2, .555);
    }
  }
}
for (const phase of [.12, .34, .58, .88]) {
  site.update(0, .5, phase - .00001); const beforeHandoff = world(cycleBrick);
  site.update(0, .5, phase + .00001);
  assert.ok(world(cycleBrick).distanceTo(beforeHandoff) < .001, 'Brick handoffs must not teleport');
}
site.update(0, .5, .7);
const forward = world(cycleBrick), forwardCables = cables.map(line => [...line.geometry.attributes.position.array]);
site.update(0, .5, 1); site.update(0, .5, .7);
assert.ok(world(cycleBrick).distanceTo(forward) < .00001, 'Scrubbing backward restores the same brick pose');
cables.forEach((line, i) => assert.deepEqual([...line.geometry.attributes.position.array], forwardCables[i]));
site.update(0, 0, 0);
assert.ok(cycleBrick.position.distanceTo(feedCenter) < .00001, 'Replay restores the conveyor brick');
cables.forEach((line, i) => assert.deepEqual([...line.geometry.attributes.position.array], initialCables[i]));
assert.equal(site.cycle.stage, 'feed');
console.log('CU-Brick model checks passed: detail rotation/grip/release; 303 site-cycle poses; fixed arm link lengths; continuous and reversible brick handoffs; wall contact; all 8 moving cable attachments; 4 rising pulleys; isolated materials.');
