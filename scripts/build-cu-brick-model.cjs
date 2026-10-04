/* One-time, offline STEP -> web derivative. The website needs only the output GLB.
 * Usage: node scripts/build-cu-brick-model.cjs source.step /path/to/tools/node_modules
 * Tools: occt-import-js@0.0.23, @gltf-transform/{core,extensions,functions}@4,
 * meshoptimizer. Install these outside the static website.
 */
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

async function main() {
  const [source, modules] = process.argv.slice(2);
  if (!source || !modules) throw new Error('Provide the original STEP path and a conversion node_modules directory.');
  const dependency = createRequire(path.join(path.resolve(modules), '../package.json'));
  const occt = await dependency('occt-import-js')();
  const { Document, NodeIO } = dependency('@gltf-transform/core');
  const { ALL_EXTENSIONS } = dependency('@gltf-transform/extensions');
  const { weld, simplify, dedup, prune, meshopt, joinPrimitives } = dependency('@gltf-transform/functions');
  const { MeshoptEncoder, MeshoptSimplifier } = dependency('meshoptimizer');
  await Promise.all([MeshoptEncoder.ready, MeshoptSimplifier.ready]);
  const imported = occt.ReadStepFile(fs.readFileSync(source), {
    linearUnit: 'millimeter', linearDeflectionType: 'absolute_value',
    linearDeflection: 0.6, angularDeflection: 0.4
  });
  if (!imported.success) throw new Error('STEP import failed.');
  // This mapping is specific to the supplied v9 export. Fail instead of silently
  // assigning parts to the wrong subsystem when a different revision is supplied.
  if (imported.meshes.length !== 163 || imported.meshes[21].name !== '2020FrameAdapter with Battery v2'
      || imported.meshes[51].name !== 'ee_cover'
      || imported.meshes[44].name !== 'grip_pad_v2' || imported.meshes[45].name !== 'grip_pad_v2'
      || imported.meshes[74].name !== 'gripper_spur v1') {
    throw new Error('Unexpected STEP revision. Review the subsystem mapping before rebuilding.');
  }
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene('CU-Brick end effector');
  const finishes = {
    aluminum: [0.64, 0.69, 0.72, 1], steel: [0.36, 0.40, 0.43, 1],
    orange: [1, 0.08, 0.006, 1], black: [0.025, 0.035, 0.042, 1]
  };
  const materials = Object.fromEntries(Object.entries(finishes).map(([name, rgba]) => [name,
    doc.createMaterial(name).setBaseColorFactor(rgba)
      .setMetallicFactor(/aluminum|steel/.test(name) ? 0.7 : 0.05)
      .setRoughnessFactor(/aluminum|steel/.test(name) ? 0.36 : 0.55)
  ]));
  const groups = Object.fromEntries(['frame', 'anchors', 'batteryMount', 'rotation', 'enclosure', 'drive', 'gripper', 'jaws', 'release']
    .map(name => [name, { node: doc.createNode(name), primitives: {}, sources: [] }]));
  // Preserve articulated parts inside their functional subsystem. Neutral
  // parents let the website move rigid CAD bodies without stretching meshes.
  const joints = Object.fromEntries(Object.entries({
    rotationRotor: 'rotation', gripperJawPositive: 'gripper', gripperJawNegative: 'gripper',
    gripPinion: 'gripper', jawPositive: 'jaws', jawNegative: 'jaws',
    gripPadPositive: 'jawPositive', gripPadNegative: 'jawNegative', releasePusher: 'release'
  }).map(([name, parent]) => [name, { node: doc.createNode(name), parent, primitives: {}, sources: [] }]));
  // Close each sliding jaw by 30.5 mm: the saved 156 mm opening becomes
  // 95 mm, holding the long faces of the illustrative brick. Move the pads,
  // uprights, bearing blocks, carriers and opposing racks together; leave
  // the fixed motor and guides in place. This is a posed web derivative.
  const positiveJaw = new Set([33, 34, 36, 45, 73, 76, 77]);
  const negativeJaw = new Set([32, 35, 37, 44, 72, 75, 78]);
  function joint(i) {
    if ([46, 47, 56, 57].includes(i)) return 'rotationRotor';
    if (i === 44) return 'gripPadNegative';
    if (i === 45) return 'gripPadPositive';
    if (i === 36) return 'jawPositive';
    if (i === 37) return 'jawNegative';
    if (positiveJaw.has(i)) return 'gripperJawPositive';
    if (negativeJaw.has(i)) return 'gripperJawNegative';
    if (i === 74) return 'gripPinion';
    if ([41, 42, 43, 69, 70, 71].includes(i)) return 'releasePusher';
  }
  function subsystem(i) {
    if (i === 21) return 'batteryMount';
    if (i < 12 || i >= 138 || (i >= 20 && i <= 22)) return 'frame';
    if (i < 20) return 'anchors';
    if ([46, 47, 48, 49, 50, 56, 57].includes(i)) return 'rotation';
    if ([51, 52, 53, 80].includes(i)) return 'enclosure';
    if ([27, 54, 55].includes(i)) return 'drive';
    if ([36, 37, 44, 45].includes(i)) return 'jaws';
    if ((i >= 38 && i <= 43) || (i >= 66 && i <= 71)) return 'release';
    return 'gripper';
  }
  let omitted = 0;
  for (const [i, mesh] of imported.meshes.entries()) {
    // The photographed housing has no 100 mm extension (body 80). Seat its lid
    // on the original cover below. Also omit the coincident cover duplicate and
    // small internal motor/fastener details; the source STEP remains untouched.
    if (i === 79 || i === 80 || (i >= 82 && i <= 137)) { omitted++; continue; }
    const group = groups[subsystem(i)];
    const target = joints[joint(i)] || group;
    const name = mesh.name || `v9-body-${i}`;
    const finish = i === 27 || i === 52 ? 'black'
      : /Framing|^2020_|^M[68]_/.test(name) ? 'aluminum'
        : /Eyebolt|Bearing|SC8UU|LM6UU|spur gear/.test(name) ? 'steel' : 'orange';
    const position = new Float32Array(mesh.attributes.position.array.length);
    const normal = new Float32Array(mesh.attributes.normal.array.length);
    const jawSlide = positiveJaw.has(i) ? -30.5 : negativeJaw.has(i) ? 30.5 : 0;
    for (let j = 0; j < position.length; j += 3) {
      const p = mesh.attributes.position.array, n = mesh.attributes.normal.array;
      // CAD Z is vertical. Center the 380 x 380 x 220 mm outer frame; use metres.
      position[j] = (p[j] - 37.6) / 1000;
      position[j + 1] = (p[j + 2] + 50 - (i === 53 ? 100 : 0)) / 1000;
      position[j + 2] = (180 - p[j + 1] + jawSlide) / 1000;
      normal[j] = n[j]; normal[j + 1] = n[j + 2]; normal[j + 2] = -n[j + 1];
    }
    const primitive = doc.createPrimitive()
      .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(position).setBuffer(buffer))
      .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(normal).setBuffer(buffer))
      .setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(mesh.index.array)).setBuffer(buffer))
      .setMaterial(materials[finish]);
    (target.primitives[finish] ||= []).push(primitive);
    group.sources.push(name);
    if (target !== group) target.sources.push(name);
  }
  for (const [name, group] of Object.entries({ ...groups, ...joints })) {
    if (Object.keys(group.primitives).length) {
      const mesh = doc.createMesh(name);
      for (const primitives of Object.values(group.primitives)) mesh.addPrimitive(joinPrimitives(primitives));
      // Keep quantization transforms below an unscaled physical joint.
      group.node.addChild(doc.createNode(`${name}Geometry`).setMesh(mesh));
    }
    group.node.setExtras({ sourceParts: group.sources });
    if (group.parent) (groups[group.parent] || joints[group.parent]).node.addChild(group.node);
    else scene.addChild(group.node);
  }
  await doc.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: 0.4, error: 0.001 }),
    dedup(), prune(), meshopt({ encoder: MeshoptEncoder, level: 'high' }));
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
  const output = path.resolve(__dirname, '../assets/models/cu-brick-end-effector.glb');
  await io.write(output, doc);
  const triangles = doc.getRoot().listMeshes().reduce((sum, mesh) =>
    sum + mesh.listPrimitives().reduce((n, primitive) => n + primitive.getIndices().getCount() / 3, 0), 0);
  console.log(JSON.stringify({ output, bytes: fs.statSync(output).size, triangles, omitted,
    groups: Object.fromEntries(Object.entries(groups).map(([name, group]) => [name, group.sources.length])) }, null, 2));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
