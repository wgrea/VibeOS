import * as THREE from 'three';

export function createKidCandy() {
  const group = new THREE.Group();

  const colors = [0xef4444, 0xfacc15, 0x3b82f6, 0x22c55e, 0xec4899, 0xa855f7];
  const blockMat = new THREE.MeshPhysicalMaterial({
    color: 0xef4444,
    roughness: 0.18,
    clearcoat: 0.9,
  });

  // Central glossy toy block
  const cube = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.95), blockMat);
  group.add(cube);

  // Orbiting candy beads & star-like studs
  const orbitRing = new THREE.Group();
  const sphereGeo = new THREE.SphereGeometry(0.24, 20, 20);

  colors.forEach((hex, i) => {
    const angle = (i / colors.length) * Math.PI * 2;
    const mat = new THREE.MeshPhysicalMaterial({
      color: hex,
      roughness: 0.12,
      clearcoat: 1.0,
    });
    const bead = new THREE.Mesh(sphereGeo, mat);
    bead.position.set(Math.cos(angle) * 1.25, Math.sin(angle) * 1.25, 0);
    orbitRing.add(bead);
  });

  orbitRing.rotation.x = 0.45;
  group.add(orbitRing);

  return {
    group,
    draggable: cube,
    background: 'radial-gradient(circle at 50% 30%, #fef08a 0%, #f472b6 50%, #3b82f6 100%)',
    update(t, bounce, spring) {
      cube.rotation.y = t * 0.55;
      cube.rotation.x = Math.sin(t * 0.9) * 0.25;
      orbitRing.rotation.z = -t * 0.8;
      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
