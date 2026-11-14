import * as THREE from 'three';

export function createAblaAero() {
  const group = new THREE.Group();

  // Warm Sunset-Coral & Gold Translucent Ribbon Spheres
  const coralMat = new THREE.MeshPhysicalMaterial({
    color: 0xfb7185,
    emissive: 0xe11d48,
    emissiveIntensity: 0.35,
    roughness: 0.08,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.88,
  });

  const goldMat = new THREE.MeshPhysicalMaterial({
    color: 0xfbbf24,
    emissive: 0xd97706,
    emissiveIntensity: 0.3,
    roughness: 0.1,
    clearcoat: 1.0,
  });

  const coreOrb = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 32), coralMat);
  group.add(coreOrb);

  // Interlocking Glossy Wave Rings
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.07, 16, 64), goldMat);
  ring1.rotation.x = Math.PI / 3;
  group.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.06, 16, 64), coralMat);
  ring2.rotation.y = Math.PI / 2.5;
  group.add(ring2);

  // Floating Warm Bubbles
  const bubbles = [];
  for (let i = 0; i < 8; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), goldMat);
    const a = (i / 8) * Math.PI * 2;
    b.position.set(Math.cos(a) * 1.5, Math.sin(i) * 0.4, Math.sin(a) * 1.5);
    group.add(b);
    bubbles.push({ mesh: b, baseY: b.position.y, phase: i * 0.8 });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #ffe4e6 0%, #fda4af 45%, #f59e0b 100%)',
    update(t, bounce, spring) {
      coreOrb.rotation.y = t * 0.4;
      ring1.rotation.z = t * 0.55;
      ring2.rotation.x = -t * 0.65;

      bubbles.forEach((b) => {
        b.mesh.position.y = b.baseY + Math.sin(t * 2 + b.phase) * 0.14;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
