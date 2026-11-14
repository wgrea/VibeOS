import * as THREE from 'three';

export function createOceanGrunge() {
  const group = new THREE.Group();

  // Deep Abyssal Teal Wireframe Seafloor Terrain
  const seaPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 2.6, 18, 18),
    new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    })
  );
  seaPlane.rotation.x = -Math.PI / 2.3;
  seaPlane.position.y = -0.55;
  group.add(seaPlane);

  // Sunken Oxidized Bust / Monolith Crystal
  const monolith = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.75, 0),
    new THREE.MeshPhysicalMaterial({
      color: 0x0f766e,
      emissive: 0x115e59,
      emissiveIntensity: 0.5,
      roughness: 0.35,
      metalness: 0.4,
      clearcoat: 0.6,
    })
  );
  monolith.position.y = 0.25;
  group.add(monolith);

  // Drifting Bioluminescent Sea-Foam Particles
  const particles = [];
  const pMat = new THREE.MeshBasicMaterial({
    color: 0x99f6e4,
    transparent: true,
    opacity: 0.75,
  });

  for (let i = 0; i < 16; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), pMat);
    p.position.set(
      (Math.random() - 0.5) * 2.2,
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 2.2
    );
    group.add(p);
    particles.push({ mesh: p, baseY: p.position.y, phase: i * 0.65 });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #0d9488 0%, #115e59 55%, #042f2e 100%)',
    update(t, bounce, spring) {
      monolith.rotation.y = t * 0.35;
      monolith.position.y = 0.25 + Math.sin(t * 1.3) * 0.12;
      seaPlane.rotation.z = t * 0.15;

      particles.forEach((pt) => {
        pt.mesh.position.y = pt.baseY + Math.sin(t * 1.6 + pt.phase) * 0.16;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
