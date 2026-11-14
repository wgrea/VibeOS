import * as THREE from 'three';

export function createVoidgaze() {
  const group = new THREE.Group();

  // Abyssal Pitch-Black Event Horizon Sphere
  const blackHole = new THREE.Mesh(
    new THREE.SphereGeometry(0.88, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  group.add(blackHole);

  // Haunting Pale-Silver & Cobalt Accretion Halo
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(1.22, 0.055, 16, 64),
    new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      emissive: 0x60a5fa,
      emissiveIntensity: 0.9,
      roughness: 0.1,
    })
  );
  halo.rotation.x = Math.PI / 2.5;
  group.add(halo);

  // Drifting Shoegaze Static Distortion Shards
  const shards = [];
  const shardMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    emissive: 0x3b82f6,
    emissiveIntensity: 0.45,
    wireframe: true,
  });

  for (let i = 0; i < 12; i++) {
    const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), shardMat);
    const a = (i / 12) * Math.PI * 2;
    const r = 1.45 + (i % 3) * 0.2;
    s.position.set(Math.cos(a) * r, Math.sin(i * 1.6) * 0.45, Math.sin(a) * r);
    group.add(s);
    shards.push({ mesh: s, angle: a, radius: r, baseY: s.position.y });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #1e293b 0%, #090d16 60%, #000000 100%)',
    update(t, bounce, spring) {
      halo.rotation.z = t * 0.45;
      halo.rotation.y = Math.sin(t * 0.4) * 0.25;

      shards.forEach((sh, idx) => {
        const a = sh.angle + t * 0.35;
        sh.mesh.position.x = Math.cos(a) * sh.radius;
        sh.mesh.position.z = Math.sin(a) * sh.radius;
        sh.mesh.position.y = sh.baseY + Math.sin(t * 1.5 + idx) * 0.14;
        sh.mesh.rotation.x = t * 1.2;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
