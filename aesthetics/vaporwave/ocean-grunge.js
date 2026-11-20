// js/aesthetics/vaporwave/ocean-grunge.js

import * as THREE from 'three';

export function createOceanGrunge() {
  const group = new THREE.Group();

  // 1. Deep Abyssal Teal Wireframe Seafloor Terrain (with Animated Swells)
  const seaGeo = new THREE.PlaneGeometry(3.2, 3.2, 20, 20);
  const seaPlane = new THREE.Mesh(
    seaGeo,
    new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    })
  );
  seaPlane.rotation.x = -Math.PI / 2.25;
  seaPlane.position.y = -0.75;
  group.add(seaPlane);

  // Store original Z heights for undulating underwater wave displacement
  const seaPos = seaGeo.attributes.position;
  const baseZ = new Float32Array(seaPos.count);
  for (let i = 0; i < seaPos.count; i++) {
    baseZ[i] = seaPos.getZ(i);
  }

  // 2. Sunken Oxidized Monolith Crystal & Ruined Column (Draggable / Arrow-Key Interactive)
  const relicGroup = new THREE.Group();

  const monolith = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.72, 0),
    new THREE.MeshPhysicalMaterial({
      color: 0x0f766e,
      emissive: 0x115e59,
      emissiveIntensity: 0.55,
      roughness: 0.32,
      metalness: 0.45,
      clearcoat: 0.7,
    })
  );
  monolith.position.y = 0.25;
  relicGroup.add(monolith);

  // Outer Low-Poly Wireframe Lattice around Monolith
  const relicCage = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.84, 0),
    new THREE.MeshBasicMaterial({
      color: 0x5eead4,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
  );
  relicCage.position.y = 0.25;
  relicGroup.add(relicCage);

  // Tilted Sunken Classical Column Drum at Base
  const ruinMat = new THREE.MeshStandardMaterial({
    color: 0x134e4a,
    roughness: 0.75,
    metalness: 0.2,
  });
  const sunkenColumn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.32, 0.95, 12),
    ruinMat
  );
  sunkenColumn.position.set(-0.58, -0.35, 0.25);
  sunkenColumn.rotation.set(0.25, 0.4, 0.62);
  relicGroup.add(sunkenColumn);

  group.add(relicGroup);

  // 3. Drifting Bioluminescent Sea-Foam & Bubble Particles
  const particles = [];
  const pMat = new THREE.MeshBasicMaterial({
    color: 0x99f6e4,
    transparent: true,
    opacity: 0.75,
  });

  for (let i = 0; i < 20; i++) {
    const radius = 0.025 + (i % 3) * 0.015;
    const p = new THREE.Mesh(new THREE.SphereGeometry(radius, 10, 10), pMat);
    p.position.set(
      (Math.random() - 0.5) * 2.4,
      (Math.random() - 0.5) * 1.6,
      (Math.random() - 0.5) * 2.4
    );
    group.add(p);
    particles.push({
      mesh: p,
      baseX: p.position.x,
      baseY: p.position.y,
      phase: i * 0.65,
    });
  }

  // 4. Underwater Caustic Top Light & Abyssal Rim Lighting
  const causticLight = new THREE.PointLight(0x5eead4, 9, 10);
  causticLight.position.set(0.5, 2.2, 1.8);
  group.add(causticLight);

  const deepRim = new THREE.PointLight(0x0d9488, 7, 10);
  deepRim.position.set(-1.8, -0.8, 1.5);
  group.add(deepRim);

  return {
    group,
    draggable: relicGroup,
    description:
      'Subaquatic vaporwave drenched in cavernous reverb—slowed-down 90s grunge guitars, murky deep-sea teal palettes, and sunken classical ruins.',
    background: 'radial-gradient(circle at 50% 30%, #0d9488 0%, #115e59 55%, #042f2e 100%)',
    update(t, bounce, spring) {
      monolith.rotation.y = t * 0.35;
      relicCage.rotation.y = -t * 0.25;
      relicGroup.position.y = Math.sin(t * 1.3) * 0.1 - bounce * 0.2;

      // Rolling underwater wireframe wave swells
      for (let i = 0; i < seaPos.count; i++) {
        const x = seaPos.getX(i);
        const y = seaPos.getY(i);
        const wave = Math.sin(x * 2.6 + t * 1.5) * 0.08 + Math.cos(y * 2.6 + t * 1.2) * 0.08;
        seaPos.setZ(i, baseZ[i] + wave);
      }
      seaPos.needsUpdate = true;

      // Gently rising & swaying bioluminescent sea-foam particles
      particles.forEach((pt) => {
        pt.mesh.position.y = pt.baseY + Math.sin(t * 1.6 + pt.phase) * 0.18;
        pt.mesh.position.x = pt.baseX + Math.cos(t * 1.1 + pt.phase) * 0.06;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
