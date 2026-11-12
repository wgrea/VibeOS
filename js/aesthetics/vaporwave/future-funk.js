import * as THREE from 'three';

export function createFutureFunk() {
  const group = new THREE.Group();

  // 1. Glossy 80s Nightclub Dancefloor Grid
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.MeshPhysicalMaterial({ color: 0x1e1b4b, roughness: 0.1, clearcoat: 1.0 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.3;
  group.add(floor);

  const neonGrid = new THREE.GridHelper(14, 14, 0xfacc15, 0xf43f5e);
  neonGrid.position.y = -1.29;
  group.add(neonGrid);

  // 2. Faceted Chrome Disco Ball Suspended Overhead
  const discoBall = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.15, 2),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.95,
      flatShading: true
    })
  );
  discoBall.position.y = 0.55;
  group.add(discoBall);

  // Hanging Cord
  const cord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8),
    new THREE.MeshBasicMaterial({ color: 0x94a3b8 })
  );
  cord.position.y = 2.1;
  group.add(cord);

  // 3. Energetic Magenta & Gold Club Spotlights
  const pinkSpot = new THREE.PointLight(0xff007f, 6, 12);
  pinkSpot.position.set(-2.2, 0.8, 2);
  group.add(pinkSpot);

  const goldSpot = new THREE.PointLight(0xfacc15, 6, 12);
  goldSpot.position.set(2.2, 0.8, 2);
  group.add(goldSpot);

  return {
    group,
    background: 'radial-gradient(circle at 50% 25%, #831843 0%, #311042 55%, #09090b 100%)',
    update(t, bounce, spring) {
      discoBall.rotation.y = t * 1.1;
      discoBall.scale.setScalar(1 + spring * 0.25);

      // Orbiting club light flares
      pinkSpot.position.x = Math.cos(t * 2.2) * 2.5;
      pinkSpot.position.z = Math.sin(t * 2.2) * 2.5;
      goldSpot.position.x = Math.cos(t * 2.2 + Math.PI) * 2.5;
      goldSpot.position.z = Math.sin(t * 2.2 + Math.PI) * 2.5;
    }
  };
}
