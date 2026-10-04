// An illustrative, reversible cycle. Positions use the simplified site model;
// this is not a controller trajectory or a reach/tension feasibility calculation.
export function createBrickSequence(THREE, { site, effector, pickup, pickupCarriage, conveyor, paths, box, cylinder, beam }) {
  const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const smooth = (t, a, b) => {
    const x = THREE.MathUtils.clamp((t - a) / (b - a), 0, 1);
    return x * x * (3 - 2 * x);
  };
  const track = (t, keys) => {
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) return keys[i - 1][1].clone().lerp(keys[i][1], smooth(t, keys[i - 1][0], keys[i][0]));
    }
    return keys.at(-1)[1].clone();
  };
  const scale = effector.scale.x;
  const brickSize = [.156 * scale, .065 * scale, .095 * scale];
  const halfHeight = brickSize[1] / 2, heldOffset = .132 * scale;
  // Use one visible brick throughout: conveyor -> arm -> holder -> gripper -> wall.
  effector.getObjectByName('payload').visible = false;
  const brick = box(site.object, brickSize, [0, 0, 0], 'brick');
  brick.name = 'cycleBrick';

  // The TX2-60WithTAble origin in the saved site assembly. Link proportions and
  // reach are enlarged for the schematic, as is the cable-driven end effector.
  const arm = new THREE.Group(); arm.position.set(5.8115, 0, -1.1541); arm.name = 'transferArm';
  box(arm, [.72, .10, .72], [0, .68, 0], 'steel');
  for (const x of [-.28, .28]) for (const z of [-.28, .28]) box(arm, [.075, .64, .075], [x, .32, z], 'steel');
  cylinder(arm, .20, .18, [0, .82, 0], 'orange');
  cylinder(arm, .17, .12, [0, .97, 0], 'dark');
  const upperLink = beam(arm, [0, 0, 0], [0, 1, 0], .19, 'orange'); upperLink.name = 'transferUpperLink';
  const foreLink = beam(arm, [0, 0, 0], [0, 1, 0], .15, 'orange'); foreLink.name = 'transferForeLink';
  const shoulderJoint = cylinder(arm, .18, .25, [0, 1.08, 0], 'orange', 'z');
  const elbowJoint = cylinder(arm, .15, .21, [0, 0, 0], 'dark', 'z'); elbowJoint.name = 'transferElbow';
  const tool = new THREE.Group(); tool.name = 'transferTool'; arm.add(tool);
  cylinder(tool, .09, .14, [0, .10, 0], 'steel');
  box(tool, [.20, .06, .31], [0, 0, 0], 'dark');
  const fingers = [-1, 1].map(side => ({ side, mesh: box(tool, [.10, .18, .028], [0, -.12, side * .12], 'steel') }));
  const armPart = site.part('arm', arm, [0, 1.3, 0]);
  const shoulder = V(0, 1.08, 0), linkLength = 1.2;
  function aimLink(mesh, from, to) {
    const direction = to.clone().sub(from);
    mesh.position.copy(from).add(to).multiplyScalar(.5);
    mesh.scale.y = direction.length();
    mesh.quaternion.setFromUnitVectors(V(0, 1, 0), direction.normalize());
  }
  function poseArm(target, openness) {
    const wrist = target.clone().sub(arm.position).add(V(0, .18, 0));
    const delta = wrist.clone().sub(shoulder), distance = delta.length();
    const along = delta.clone().normalize();
    // Bend the elbow upward in the shoulder/wrist plane, retaining link lengths.
    const bend = V(0, 1, 0).addScaledVector(along, -along.y).normalize();
    const height = Math.sqrt(Math.max(0, linkLength ** 2 - (distance / 2) ** 2));
    const elbow = shoulder.clone().addScaledVector(along, distance / 2).addScaledVector(bend, height);
    aimLink(upperLink, shoulder, elbow); aimLink(foreLink, elbow, wrist);
    elbowJoint.position.copy(elbow); tool.position.copy(wrist);
    shoulderJoint.rotation.y = elbowJoint.rotation.y = -Math.atan2(delta.z, delta.x);
    fingers.forEach(({ side, mesh }) => { mesh.position.z = side * (brickSize[2] / 2 + .014 + .07 * openness); });
    armPart.anchor.copy(elbow);
  }
  const turntable = effector.getObjectByName('gripTurntable');
  const rotor = effector.getObjectByName('rotationRotor'), pinion = effector.getObjectByName('gripPinion');
  const pushers = effector.getObjectByName('releasePusher'), pusherRest = pushers.position.clone();
  const jaws = [-1, 1].flatMap(side => ['jaw', 'gripperJaw'].map(prefix => {
    const node = effector.getObjectByName(`${prefix}${side < 0 ? 'Negative' : 'Positive'}`);
    return { side, node, rest: node.position.clone() };
  }));
  const stages = [
    [0, 'feed'], [.12, 'transfer'], [.34, 'present'], [.48, 'collect'],
    [.65, 'transport'], [.78, 'place'], [.90, 'return'], [1, 'complete']
  ];
  const wallPoint = paths[2].getPointAt(.62), wallTangent = paths[2].getTangentAt(.62);
  const wallHeading = Math.atan2(-wallTangent.z, wallTangent.x);
  const wallCenter = wallPoint.clone(); wallCenter.y = .075 + 3 * .14 + .06 + halfHeight;
  const parked = V(5.0, 1.60, -1.8);
  const state = { progress: 0, stage: 'feed', owner: 'conveyor' };
  return {
    state,
    update(value, elevation) {
      const t = THREE.MathUtils.clamp(value, 0, 1);
      const home = effector.position.clone();
      const feed = conveyor.position.clone().add(V(0, .985 + halfHeight, .72));
      const load = pickup.position.clone().add(V(-1.19, 1.10 + .055 + halfHeight, .26));
      pickupCarriage.position.y = THREE.MathUtils.lerp(1.10, 1.65 + elevation * 1.3, smooth(t, .40, .48));
      const presented = pickup.position.clone().add(V(-1.19, pickupCarriage.position.y + .055 + halfHeight, .26));
      const handoff = pickup.position.clone().add(V(-1.19, 1.65 + elevation * 1.3 + .055 + halfHeight, .26));
      const toolTarget = track(t, [
        [0, feed.clone().add(V(0, .40, 0))], [.07, feed], [.12, feed],
        [.20, feed.clone().add(V(0, .65, 0))], [.28, load.clone().add(V(0, .65, 0))],
        [.34, load], [.37, load], [.40, load.clone().add(V(0, .65, 0))], [.46, parked], [1, parked]
      ]);
      const armOpen = 1 - smooth(t, .07, .12) + smooth(t, .34, .37);
      poseArm(toolTarget, armOpen);
      const gripCenter = handoff.clone().add(V(0, heldOffset, 0));
      const cruise = Math.max(3.05, gripCenter.y + .42);
      const approach = gripCenter.clone(); approach.y = cruise;
      const placeCenter = wallCenter.clone().add(V(0, heldOffset, 0));
      const aboveWall = placeCenter.clone(); aboveWall.y = cruise;
      effector.position.copy(track(t, [
        [0, home], [.38, home], [.48, approach], [.54, gripCenter], [.58, gripCenter],
        [.65, approach], [.78, aboveWall], [.86, placeCenter], [.90, placeCenter],
        [.96, aboveWall], [1, home]
      ]));
      const openness = 1 - smooth(t, .54, .58) + smooth(t, .86, .90);
      const travel = .0305 * openness;
      jaws.forEach(({ side, node, rest }) => node.position.copy(rest).add(V(0, 0, side * travel)));
      pinion.rotation.y = -travel / .026;
      const heading = wallHeading * smooth(t, .65, .78);
      rotor.rotation.y = turntable.rotation.y = heading;
      // Release plates press briefly against the supported brick, then retract.
      pushers.position.copy(pusherRest).add(V(0, -.008 * Math.sin(Math.PI * smooth(t, .86, .90)), 0));
      let owner;
      if (t < .12) { owner = 'conveyor'; brick.position.copy(feed); }
      else if (t < .34) { owner = 'arm'; brick.position.copy(toolTarget); }
      else if (t < .58) { owner = 'pickup'; brick.position.copy(presented); }
      else if (t < .88) { owner = 'effector'; brick.position.copy(effector.position).add(V(0, -heldOffset, 0)); }
      else { owner = 'wall'; brick.position.copy(wallCenter); }
      brick.rotation.y = t < .58 ? 0 : t < .88 ? heading : wallHeading;
      brick.userData.partId = owner === 'wall' ? 'effector' : owner;
      Object.assign(state, { progress: t, stage: stages.filter(([start]) => t >= start).at(-1)[1], owner });
    }
  };
}
