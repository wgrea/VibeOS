import * as THREE from 'three';

export function createGhostPop() {
  const group = new THREE.Group();

  // Translucent Spectral Porcelain / Pearl Ghost Orb
  const spiritOrb = new THREE.Mesh(
    new THREE.SphereGeometry(0.88, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0xfef3c7,
      emissive: 0xfde68a,
      emissiveIntensity: 0.3,
      roughness: 0.15,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.62,
    })
  );
  group.add(spiritOrb);

  // Tarnished Antique Brass Gramophone / Halo Ring
  const antiqueRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.28, 0.055, 16, 64),
    new THREE.MeshStandardMaterial({
      color: 0xd97706,
      emissive: 0x92400e,
      emissiveIntensity: 0.4,
      metalness: 0.85,
      roughness: 0.3,
    })
  );
  antiqueRing.rotation.x = Math.PI / 2.8;
  group.add(antiqueRing);

  // Fading Sepia Memory Wisps
  const wisps = [];
  const wispMat = new THREE.MeshBasicMaterial({
    color: 0xfef9c3,
    transparent: true,
    opacity: 0.5,
  });

  for (let i = 0; i < 10; i++) {
    const w = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), wispMat);
    const a = (i / 10) * Math.PI * 2;
    w.position.set(Math.cos(a) * 1.48, Math.sin(i * 1.5) * 0.55, Math.sin(a) * 1.48);
    group.add(w);
    wisps.push({ mesh: w, angle: a, baseY: w.position.y });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #78350f 0%, #451a03 55%, #0c0a09 100%)',
    update(t, bounce, spring) {
      spiritOrb.position.y = Math.sin(t * 1.2) * 0.14;
      spiritOrb.rotation.y = t * 0.3;

      antiqueRing.rotation.z = t * 0.35;
      antiqueRing.rotation.y = Math.sin(t * 0.4) * 0.2;

      wisps.forEach((wp, idx) => {
        const a = wp.angle + t * 0.28;
        wp.mesh.position.x = Math.cos(a) * 1.48;
        wp.mesh.position.z = Math.sin(a) * 1.48;
        wp.mesh.position.y = wp.baseY + Math.sin(t * 1.3 + idx) * 0.18;
      });

      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
