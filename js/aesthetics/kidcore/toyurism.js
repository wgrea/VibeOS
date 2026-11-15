import * as THREE from 'three';

export function createToyurism() {
  const group = new THREE.Group();

  const blueBodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7,
    roughness: 0.2,
    clearcoat: 0.85,
  });

  const redTrimMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    roughness: 0.35,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    metalness: 0.7,
    roughness: 0.25,
  });

  const trackMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.7,
  });

  // Circular wooden railway track
  const track = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.08, 12, 40), trackMat);
  track.rotation.x = Math.PI / 2;
  track.position.y = -0.35;
  group.add(track);

  // Miniature scale-model locomotive on track
  const trainPivot = new THREE.Group();
  const engine = new THREE.Group();

  const boiler = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.68, 20), blueBodyMat);
  boiler.rotation.z = Math.PI / 2;
  boiler.position.y = 0.05;

  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.48, 0.46), blueBodyMat);
  cab.position.set(-0.28, 0.14, 0);

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.1, 0.5), redTrimMat);
  chassis.position.y = -0.15;

  const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.22, 14), brassMat);
  funnel.position.set(0.22, 0.34, 0);

  engine.add(boiler, cab, chassis, funnel);
  engine.position.set(0, -0.1, 1.15);
  trainPivot.add(engine);
  group.add(trainPivot);

  return {
    group,
    background: 'linear-gradient(180deg, #7dd3fc 0%, #bae6fd 52%, #4ade80 53%, #16a34a 100%)',
    update(t, bounce, spring) {
      trainPivot.rotation.y = t * 0.85;
      engine.position.y = -0.1 + Math.abs(Math.sin(t * 10)) * 0.02;
      group.scale.setScalar(1 + spring * 0.22);
    },
  };
}
