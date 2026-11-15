import * as THREE from 'three';

export function createY2k() {
  const group = new THREE.Group();

  const chromeMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    metalness: 0.95,
    roughness: 0.08,
    clearcoat: 1.0,
  });

  const cyberPinkMat = new THREE.MeshPhysicalMaterial({
    color: 0xf472b6,
    emissive: 0xdb2777,
    emissiveIntensity: 0.25,
    roughness: 0.15,
    clearcoat: 0.9,
  });

  const iceBlueMat = new THREE.MeshPhysicalMaterial({
    color: 0x7dd3fc,
    transmission: 0.55,
    roughness: 0.1,
    thickness: 0.6,
  });

  // Liquid chrome torus knot
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.55, 0.18, 96, 20), chromeMat);
  group.add(knot);

  // Orbiting translucent Y2K baubles
  const orbit = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const mat = i % 2 === 0 ? cyberPinkMat : iceBlueMat;
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), mat);
    orb.position.set(Math.cos(a) * 1.2, Math.sin(a) * 1.2, 0);
    orbit.add(orb);
  }
  orbit.rotation.x = 0.5;
  group.add(orbit);

  return {
    group,
    background: 'radial-gradient(circle at 50% 25%, #f8fafc 0%, #bae6fd 45%, #818cf8 100%)',
    update(t, bounce, spring) {
      knot.rotation.x = t * 0.55;
      knot.rotation.y = t * 0.8;
      orbit.rotation.z = -t * 0.95;
      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
