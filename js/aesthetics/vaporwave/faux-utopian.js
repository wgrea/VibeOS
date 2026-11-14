import * as THREE from 'three';

export function createFauxUtopian() {
  const group = new THREE.Group();

  // Sterile Corporate 90s CAD Wireframe-Gloss Globe
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(0.85, 24, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.25,
      roughness: 0.15,
      metalness: 0.4,
      clearcoat: 1.0,
    })
  );
  group.add(globe);

  // Clean Corporate Synergy Orbit Rings
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    emissive: 0x0369a1,
    emissiveIntensity: 0.45,
    metalness: 0.7,
    roughness: 0.2,
  });

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.045, 16, 64), ringMat);
  ring1.rotation.x = Math.PI / 3;
  group.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.045, 16, 64), ringMat);
  ring2.rotation.x = -Math.PI / 3;
  group.add(ring2);

  // Floating Monochrome Corporate Step Pillars
  const pillars = [];
  const pillarMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.2,
    metalness: 0.3,
  });

  for (let i = 0; i < 4; i++) {
    const h = 0.45 + i * 0.22;
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.24, h, 0.24), pillarMat);
    const a = (i / 4) * Math.PI * 2;
    p.position.set(Math.cos(a) * 1.65, -0.35 + h / 2, Math.sin(a) * 1.65);
    group.add(p);
    pillars.push({ mesh: p, baseY: p.position.y, phase: i * 0.7 });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #f1f5f9 0%, #93c5fd 55%, #1e3a8a 100%)',
    update(t, bounce, spring) {
      globe.rotation.y = t * 0.45;
      ring1.rotation.z = t * 0.6;
      ring2.rotation.z = -t * 0.6;

      pillars.forEach((p) => {
        p.mesh.position.y = p.baseY + Math.sin(t * 2 + p.phase) * 0.08;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
