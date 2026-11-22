// js/aesthetics/kidcore/toyurism.js
import * as THREE from 'three';

export function createToyurism(options = {}) {

  const group = new THREE.Group();

  // Materials
  const blueEngineMat = new THREE.MeshPhysicalMaterial({ color: 0x0284c7, roughness: 0.2, clearcoat: 0.85 });
  const redEngineMat = new THREE.MeshPhysicalMaterial({ color: 0xdc2626, roughness: 0.2, clearcoat: 0.85 });
  const greenEngineMat = new THREE.MeshPhysicalMaterial({ color: 0x16a34a, roughness: 0.2, clearcoat: 0.85 });
  const coachOrangeMat = new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.28, clearcoat: 0.65 });
  const coachRoofMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.45 });
  const redChassisMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.35 });
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.75, roughness: 0.22 });
  const faceGreyMat = new THREE.MeshPhysicalMaterial({ color: 0xd1d5db, roughness: 0.38, clearcoat: 0.3 });
  const truckWoodMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.65 });
  const coalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
  const railMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.65 });
  const steelMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6, roughness: 0.3 });
  const grassMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.65 });
  const hillGreenMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 });
  const brickMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.6 });
  const roofTerracottaMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.5 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.75 });
  const windowBlueMat = new THREE.MeshPhysicalMaterial({ color: 0xbae6fd, roughness: 0.15, clearcoat: 0.9 });
  const steamMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.4,
    transparent: true,
    opacity: 0.82,
  });
  const inkBlackMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const TRACK_Y = -0.45;
  const TRACK_RADII = [1.48, 1.18, 0.88];

  // 1. Sodor Train Table Base & Three Dedicated Circular Tracks
  const sodorBase = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 2.0, 0.2, 40), grassMat);
  sodorBase.position.y = TRACK_Y - 0.13;
  group.add(sodorBase);

  const tieGeo = new THREE.BoxGeometry(0.18, 0.018, 0.04);

  TRACK_RADII.forEach((radius, laneIdx) => {
    const outerRail = new THREE.Mesh(new THREE.TorusGeometry(radius + 0.055, 0.018, 8, 56), railMat);
    outerRail.rotation.x = Math.PI / 2;
    outerRail.position.y = TRACK_Y;

    const innerRail = new THREE.Mesh(new THREE.TorusGeometry(radius - 0.055, 0.018, 8, 56), railMat);
    innerRail.rotation.x = Math.PI / 2;
    innerRail.position.y = TRACK_Y;
    group.add(outerRail, innerRail);

    const tieCount = 28 + laneIdx * 6;
    for (let i = 0; i < tieCount; i++) {
      const a = (i / tieCount) * Math.PI * 2;
      const tie = new THREE.Mesh(tieGeo, truckWoodMat);
      tie.position.set(Math.cos(a) * radius, TRACK_Y - 0.012, Math.sin(a) * radius);
      tie.rotation.y = -a;
      group.add(tie);
    }
  });

  // 2. Sodor Village Station House & Platform (Inside Inner Loop)
  const village = new THREE.Group();
  village.position.y = TRACK_Y - 0.03;

  const platform = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.07, 0.46), stoneMat);
  platform.position.set(-0.08, 0.035, 0.1);

  const stationBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.28), brickMat);
  stationBody.position.set(-0.08, 0.22, 0.05);

  const stationRoof = new THREE.Mesh(new THREE.ConeGeometry(0.39, 0.19, 4), roofTerracottaMat);
  stationRoof.position.set(-0.08, 0.46, 0.05);
  stationRoof.rotation.y = Math.PI / 4;

  const awning = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.02, 0.14), redEngineMat);
  awning.position.set(-0.08, 0.27, 0.24);
  awning.rotation.x = 0.25;

  const cottageBody = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.2, 0.22), brickMat);
  cottageBody.position.set(0.36, 0.1, -0.18);
  const cottageRoof = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.14, 4), roofTerracottaMat);
  cottageRoof.position.set(0.36, 0.27, -0.18);
  cottageRoof.rotation.y = Math.PI / 4;

  village.add(platform, stationBody, stationRoof, awning, cottageBody, cottageRoof);

  const treePositions = [
    [-0.48, -0.22],
    [0.12, -0.36],
    [0.44, 0.18],
    [-0.42, 0.34],
  ];
  treePositions.forEach(([tx, tz]) => {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.13, 8), truckWoodMat);
    trunk.position.y = 0.065;
    const foliage = new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 12), hillGreenMat);
    foliage.position.y = 0.17;
    tree.add(trunk, foliage);
    tree.position.set(tx, 0, tz);
    village.add(tree);
  });

  group.add(village);

  // 3. Helper: Build a Cheerful Grey Train Face
  function buildTrainFace(radius = 0.105) {
    const face = new THREE.Group();

    const disc = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.032, 18), faceGreyMat);
    disc.rotation.z = Math.PI / 2;
    face.add(disc);

    [-radius * 0.34, radius * 0.34].forEach((zEye) => {
      const eyeW = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.2, 10, 10), whiteMat);
      eyeW.position.set(0.016, radius * 0.22, zEye);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.11, 8, 8), inkBlackMat);
      pupil.position.set(0.03, radius * 0.22, zEye);
      const brow = new THREE.Mesh(
        new THREE.BoxGeometry(0.008, radius * 0.09, radius * 0.32),
        inkBlackMat
      );
      brow.position.set(0.022, radius * 0.5, zEye);
      face.add(eyeW, pupil, brow);
    });

    const nose = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.15, 10, 10), faceGreyMat);
    nose.position.set(0.026, -radius * 0.04, 0);

    const smile = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 0.28, radius * 0.06, 8, 14, Math.PI),
      inkBlackMat
    );
    smile.rotation.y = Math.PI / 2;
    smile.rotation.x = Math.PI;
    smile.position.set(0.02, -radius * 0.2, 0);

    face.add(nose, smile);
    return face;
  }

  // 4. Helper: Build a Thomas-Style Engine (+X = Forward)
  function buildEngine(bodyMat, scale = 0.78) {
    const eng = new THREE.Group();

    const boiler = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.38, 18), bodyMat);
    boiler.rotation.z = Math.PI / 2;
    boiler.position.set(0.05, 0.15, 0);

    const cab = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.28), bodyMat);
    cab.position.set(-0.16, 0.21, 0);
    const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.028, 0.31), inkBlackMat);
    cabRoof.position.set(-0.16, 0.37, 0);

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.055, 0.3), redChassisMat);
    chassis.position.set(0, 0.045, 0);

    const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.034, 0.13, 12), inkBlackMat);
    funnel.position.set(0.16, 0.32, 0);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 12), brassMat);
    dome.position.set(0.01, 0.29, 0);

    const face = buildTrainFace(0.125);
    face.position.set(0.245, 0.15, 0);

    const wheelGeo = new THREE.CylinderGeometry(0.058, 0.058, 0.028, 14);
    wheelGeo.rotateX(Math.PI / 2);
    [-0.14, 0, 0.14].forEach((wx) => {
      [-0.14, 0.14].forEach((wz) => {
        const wheel = new THREE.Mesh(wheelGeo, steelMat);
        wheel.position.set(wx, 0.038, wz);
        eng.add(wheel);
      });
    });

    eng.add(boiler, cab, cabRoof, chassis, funnel, dome, face);
    eng.scale.setScalar(scale);
    return eng;
  }

  // 5. Helper: Build an Annie/Clarabel-Style Passenger Coach with a Face (+X = Forward)
  function buildCoach(scale = 0.78) {
    const coach = new THREE.Group();

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.26), coachOrangeMat);
    body.position.y = 0.16;

    const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.44, 14), coachRoofMat);
    roof.rotation.z = Math.PI / 2;
    roof.scale.set(0.45, 1, 1);
    roof.position.y = 0.29;

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.045, 0.28), inkBlackMat);
    chassis.position.y = 0.04;

    const winGeo = new THREE.BoxGeometry(0.08, 0.08, 0.27);
    [-0.11, 0, 0.11].forEach((wx) => {
      const win = new THREE.Mesh(winGeo, windowBlueMat);
      win.position.set(wx, 0.18, 0);
      coach.add(win);
    });

    const face = buildTrainFace(0.095);
    face.position.set(0.215, 0.16, 0);

    const wheelGeo = new THREE.CylinderGeometry(0.052, 0.052, 0.026, 12);
    wheelGeo.rotateX(Math.PI / 2);
    [-0.13, 0.13].forEach((wx) => {
      [-0.13, 0.13].forEach((wz) => {
        const w = new THREE.Mesh(wheelGeo, steelMat);
        w.position.set(wx, 0.035, wz);
        coach.add(w);
      });
    });

    coach.add(body, roof, chassis, face);
    coach.scale.setScalar(scale);
    return coach;
  }

  // 6. Helper: Build a Troublesome Truck
  function buildTruck(scale = 0.78) {
    const truck = new THREE.Group();
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.17, 0.24), truckWoodMat);
    box.position.y = 0.12;
    const coal = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), coalMat);
    coal.scale.set(1.3, 0.55, 0.9);
    coal.position.y = 0.2;

    const wheelGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.026, 12);
    wheelGeo.rotateX(Math.PI / 2);
    [-0.09, 0.09].forEach((wx) => {
      [-0.12, 0.12].forEach((wz) => {
        const w = new THREE.Mesh(wheelGeo, steelMat);
        w.position.set(wx, 0.035, wz);
        truck.add(w);
      });
    });

    truck.add(box, coal);
    truck.scale.setScalar(scale);
return truck;
}
// 7. Three Separate Track Consists (Parked by Default, Coaches & Trucks Trailing Behind)
const tracksData = [
{
radius: 1.48,
direction: 1, // Travels toward -angle
velocity: 0,
tapBounce: 0,
pivot: new THREE.Group(),
cars: [
{ mesh: buildEngine(blueEngineMat, 0.8), offset: 1.4, isEngine: true },
{ mesh: buildCoach(0.78), offset: 1.74, isEngine: false }, // Annie behind
{ mesh: buildCoach(0.78), offset: 2.08, isEngine: false }, // Clarabel behind
],
},
{
radius: 1.18,
direction: -1, // Travels toward +angle
velocity: 0,
tapBounce: 0,
pivot: new THREE.Group(),
cars: [
{ mesh: buildEngine(greenEngineMat, 0.76), offset: 1.8, isEngine: true },
{ mesh: buildTruck(0.76), offset: 1.44, isEngine: false }, // Truck 1 behind
{ mesh: buildTruck(0.76), offset: 1.14, isEngine: false }, // Truck 2 behind
],
},
{
radius: 0.88,
direction: 1, // Travels toward -angle
velocity: 0,
tapBounce: 0,
pivot: new THREE.Group(),
cars: [
{ mesh: buildEngine(redEngineMat, 0.72), offset: 1.1, isEngine: true },
{ mesh: buildCoach(0.7), offset: 1.56, isEngine: false }, // Coach behind
{ mesh: buildTruck(0.7), offset: 1.96, isEngine: false }, // Truck behind
],
},
];
const clickableMeshes = [];
const steamPuffs = [];
tracksData.forEach((trackInfo, tIdx) => {
trackInfo.cars.forEach((car) => {
const a = car.offset;
car.mesh.position.set(
Math.cos(a) * trackInfo.radius,
TRACK_Y + 0.015,
Math.sin(a) * trackInfo.radius
);
car.mesh.rotation.y =
trackInfo.direction === 1 ? -a + Math.PI / 2 : -a - Math.PI / 2;
// Invisible enlarged hit-box per car so tapping on mobile phones is effortless
const hitBox = new THREE.Mesh(
new THREE.BoxGeometry(0.58, 0.45, 0.42),
new THREE.MeshBasicMaterial({ visible: false })
);
hitBox.position.y = 0.2;
hitBox.userData.trackIndex = tIdx;
car.mesh.add(hitBox);
clickableMeshes.push(hitBox);
car.mesh.traverse((child) => {
if (child.isMesh) {
child.userData.trackIndex = tIdx;
clickableMeshes.push(child);
}
});
trackInfo.pivot.add(car.mesh);
if (car.isEngine) {
for (let p = 0; p < 3; p++) {
const puff = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 10), steamMat);
puff.scale.setScalar(0);
trackInfo.pivot.add(puff);
steamPuffs.push({
mesh: puff,
trackIndex: tIdx,
radius: trackInfo.radius,
baseA: a,
direction: trackInfo.direction,
phase: tIdx * 0.65 + p * 0.33,
});
}
}
});
trackInfo.angle = 0;
group.add(trackInfo.pivot);
});
    // 8. Click-to-Toggle Cruise + Keyboard Forward/Reverse Controls
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const targetElement = options.domElement || document.querySelector('canvas') || window;
  const activeCamera = options.camera || null;

  let selectedTrack = 0;

  function toggleTrainCruise(trackIdx) {
    const trackInfo = tracksData[trackIdx];
    if (!trackInfo) return;
    selectedTrack = trackIdx;
    trackInfo.tapBounce = 0.055;

    // Toggle between parked (0) and steady cruise (0.85)
    if (Math.abs(trackInfo.velocity) > 0.1) {
      trackInfo.velocity = 0;
    } else {
      trackInfo.velocity = 0.85;
    }
  }

  function handlePointerDown(e) {
    if (!group.visible || !activeCamera) return;

    const rect = targetElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    group.updateWorldMatrix(true, true);
    activeCamera.updateMatrixWorld();
    raycaster.setFromCamera(pointer, activeCamera);

    const hits = raycaster.intersectObjects(clickableMeshes, false);
    if (hits.length > 0) {
      const hitTrack = hits[0].object.userData.trackIndex;
      if (typeof hitTrack === 'number') {
        toggleTrainCruise(hitTrack);
      }
    }
  }

  const keysPressed = {};
  const onKeyDown = (e) => {
    const k = e.key.toLowerCase();
    if (['a', 'd', 'arrowleft', 'arrowright'].includes(k)) {
      keysPressed[k] = true;
    }
  };
  const onKeyUp = (e) => {
    const k = e.key.toLowerCase();
    keysPressed[k] = false;
  };

  targetElement.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  return {
    group,
    description:
      'Step into a wooden railway play table—click or tap any blue, red, or green train to start or stop its cruise, and use A/D or Left/Right arrow keys to drive the active train forward or in reverse.',
    background: 'linear-gradient(180deg, #7dd3fc 0%, #bae6fd 52%, #4ade80 53%, #16a34a 100%)',
    dispose() {
      targetElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    },
    update(t, bounce, spring) {
      // Keyboard Forward / Reverse control for whichever train was clicked last
      const activeTrain = tracksData[selectedTrack];
      if (activeTrain) {
        if (keysPressed['d'] || keysPressed['arrowright']) {
          activeTrain.velocity = THREE.MathUtils.lerp(activeTrain.velocity, 1.35, 0.1);
        } else if (keysPressed['a'] || keysPressed['arrowleft']) {
          activeTrain.velocity = THREE.MathUtils.lerp(activeTrain.velocity, -1.25, 0.1);
        }
      }

      tracksData.forEach((trackInfo, tIdx) => {
        trackInfo.tapBounce *= 0.85;

        // Trains now keep moving steadily until clicked again to stop!
        const step = trackInfo.velocity * trackInfo.direction * 0.016;
        trackInfo.angle += step;
        trackInfo.pivot.rotation.y = trackInfo.angle;

        const speedAbs = Math.abs(trackInfo.velocity);
        trackInfo.cars.forEach((car, cIdx) => {
          const chug = speedAbs > 0.02 ? Math.abs(Math.sin(t * 12 * speedAbs + tIdx + cIdx)) * 0.01 : 0;
          car.mesh.position.y = TRACK_Y + 0.015 + chug + trackInfo.tapBounce;
        });
      });

      steamPuffs.forEach((sp) => {
        const trackInfo = tracksData[sp.trackIndex];
        const speedAbs = Math.abs(trackInfo.velocity);
        if (speedAbs < 0.05) {
          sp.mesh.scale.setScalar(0);
          return;
        }

        const life = (t * 0.9 + sp.phase) % 1;
        const lagDir = sp.direction * Math.sign(trackInfo.velocity);
        const lagAngle = sp.baseA + life * 0.2 * lagDir;
        sp.mesh.position.set(
          Math.cos(lagAngle) * sp.radius,
          TRACK_Y + 0.34 + life * 0.28,
          Math.sin(lagAngle) * sp.radius
        );
        const s = Math.min(speedAbs, 1) * (1 - life * 0.5) * (0.55 + life * 0.85);
        sp.mesh.scale.setScalar(s);
      });

      group.scale.setScalar(1 + spring * 0.22);
    },
  };
}
