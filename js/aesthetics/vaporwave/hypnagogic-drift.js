import * as THREE from 'three';

export function createHypnagogicDrift() {
  const group = new THREE.Group();

  // Dreamlike Translucent Violet-Rose Mist Cloud Core
  const hazeOrb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.95, 3),
    new THREE.MeshPhysicalMaterial({
      color: 0xc084fc,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.45,
      roughness: 0.2,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.68,
    })
  );
  group.add(hazeOrb);

  // Slow-Drifting Melted Ribbon Halo
  const driftHalo = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.15, 0.14, 96, 20, 2, 3),
    new THREE.MeshPhysicalMaterial({
      color: 0xf472b6,
      emissive: 0xbe185d,
      emissiveIntensity: 0.4,
      roughness: 0.15,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.82,
    })
  );
  group.add(driftHalo);

  // Echoing Soft Memory Orbs
  const echoes = [];
  const echoMat = new THREE.MeshBasicMaterial({
    color: 0xe9d5ff,
    transparent: true,
    opacity: 0.55,
  });

  for (let i = 0; i < 10; i++) {
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), echoMat);
    const a = (i / 10) * Math.PI * 2;
    orb.position.set(Math.cos(a) * 1.55, Math.sin(i * 1.3) * 0.5, Math.sin(a) * 1.55);
    group.add(orb);
    echoes.push({ mesh: orb, angle: a, baseY: orb.position.y });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #581c87 0%, #3b0764 55%, #090d16 100%)',
    update(t, bounce, spring) {
      // Very slow, woozy post-slush drift
      hazeOrb.rotation.y = t * 0.22;
      driftHalo.rotation.x = t * 0.18;
      driftHalo.rotation.y = -t * 0.25;

      echoes.forEach((e, idx) => {
        const a = e.angle + t * 0.25;
        e.mesh.position.x = Math.cos(a) * 1.55;
        e.mesh.position.z = Math.sin(a) * 1.55;
        e.mesh.position.y = e.baseY + Math.sin(t * 1.1 + idx) * 0.18;
      });

      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
