import * as THREE from 'three';

export function createProps(marbleMat) {
  const props = new THREE.Group();

  // ---------- Shared materials ----------
  const planterMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    roughness: 0.35,
  });
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x92400e,
    roughness: 0.8,
  });
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.5,
  });
  const benchMat = new THREE.MeshStandardMaterial({
    color: 0xfbcfe8,
    roughness: 0.4,
    metalness: 0.05,
  });
  const benchLegMat = new THREE.MeshStandardMaterial({
    color: 0x9ca3af,
    roughness: 0.4,
    metalness: 0.5,
  });
  const trashMat = new THREE.MeshStandardMaterial({
    color: 0x2dd4bf,
    roughness: 0.5,
    metalness: 0.2,
  });
  const trashLidMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    roughness: 0.4,
  });

  // ---------- Pillars + palms ----------
  // Four colonnade pillars with a palm in front of each. Pillars at ±4.2,
  // palms offset slightly outward and forward so they don't clip the marble.
  const pillarPositions = [
    [-4.2, -1],
    [ 4.2, -1],
    [-4.2, -5.5],
    [ 4.2, -5.5],
  ];

  const pillarGeo = new THREE.CylinderGeometry(0.28, 0.32, 4.2, 16);
  pillarPositions.forEach(([x, z]) => {
    const pillar = new THREE.Mesh(pillarGeo, marbleMat);
    pillar.position.set(x, 0.9, z);
    props.add(pillar);

    const palm = createPalm({
      planterMat,
      trunkMat,
      leafMat,
      height: 1.0,     // trunk height
      frondCount: 6,
    });
    palm.position.set(x * 0.78, 0, z + 0.6);
    props.add(palm);
  });

  // ---------- Free-standing palm (taller) ----------
  // A second palm variant with a longer trunk and more fronds, placed away
  // from the pillars so the space doesn't feel like a grid of identical props.
  const tallPalm = createPalm({
    planterMat,
    trunkMat,
    leafMat,
    height: 1.6,
    frondCount: 8,
  });
  tallPalm.position.set(-6.5, 0, 2.8);
  props.add(tallPalm);

  const tallPalm2 = createPalm({
    planterMat,
    trunkMat,
    leafMat,
    height: 1.4,
    frondCount: 7,
  });
  tallPalm2.position.set(6.4, 0, -5.0);
  props.add(tallPalm2);

  // ---------- Benches ----------
  // Simple bench: seat slab + two cylindrical legs. Placed in pairs facing
  // the fountain so they read as seating, not obstacles.
  const benchPositions = [
    { x: -2.6, z: 1.2, ry:  0.0 },
    { x:  2.6, z: 1.2, ry:  0.0 },
    { x: -2.6, z: -4.6, ry: Math.PI },
    { x:  2.6, z: -4.6, ry: Math.PI },
  ];
  benchPositions.forEach(({ x, z, ry }) => {
    const bench = createBench(benchMat, benchLegMat);
    bench.position.set(x, -0.9, z);
    bench.rotation.y = ry;
    props.add(bench);
  });

  // ---------- Trash cans ----------
  // Small bins next to the benches, slightly offset so they don't block the
  // bench seat.
  const trashPositions = [
    { x: -3.0, z: 1.2 },
    { x:  3.0, z: 1.2 },
    { x: -3.0, z: -4.6 },
    { x:  3.0, z: -4.6 },
  ];
  trashPositions.forEach(({ x, z }) => {
    const can = createTrashCan(trashMat, trashLidMat);
    can.position.set(x, -1.0, z);
    props.add(can);
  });

  return { group: props };
}

// ---------------------------------------------------------------------------
// Palm: planter + trunk + fronds. Height and frond count are tunable so we
// can have short colonnade palms and a taller free-standing variant.
// ---------------------------------------------------------------------------
function createPalm({ planterMat, trunkMat, leafMat, height, frondCount }) {
  const palm = new THREE.Group();

  const planter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.32, 0.42, 8),
    planterMat
  );
  planter.position.y = -1.0;
  palm.add(planter);

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.12, height, 8),
    trunkMat
  );
  trunk.position.y = -1.0 + 0.42 / 2 + height / 2;
  palm.add(trunk);

  const frondY = trunk.position.y + height / 2 - 0.1;
  for (let i = 0; i < frondCount; i++) {
    const frond = new THREE.Mesh(
      new THREE.ConeGeometry(0.25, 0.95, 5),
      leafMat
    );
    frond.position.y = frondY;
    frond.rotation.z = 0.85;
    frond.rotation.y = (i / frondCount) * Math.PI * 2;
    palm.add(frond);
  }

  return palm;
}

// ---------------------------------------------------------------------------
// Bench: pale pink seat slab on two cylindrical metal legs.
// Origin is at the floor (bench top sits at y + 0.4).
// ---------------------------------------------------------------------------
function createBench(seatMat, legMat) {
  const bench = new THREE.Group();

  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.1, 0.5),
    seatMat
  );
  seat.position.y = 0.4;
  bench.add(seat);

  const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8);
  for (const x of [-0.55, 0.55]) {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, 0.2, 0);
    bench.add(leg);
  }

  return bench;
}

// ---------------------------------------------------------------------------
// Trash can: teal cylinder with a slightly wider pink lid.
// Origin is at the floor (can top sits at y + 0.5).
// ---------------------------------------------------------------------------
function createTrashCan(bodyMat, lidMat) {
  const can = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.16, 0.5, 10),
    bodyMat
  );
  body.position.y = 0.25;
  can.add(body);

  const lid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.05, 10),
    lidMat
  );
  lid.position.y = 0.52;
  can.add(lid);

  return can;
}