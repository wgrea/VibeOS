// js/aesthetics/frutiger-aero/bloomcore.js
import * as THREE from 'three';

export function createBloomcore() {
  const group = new THREE.Group();

  // 1. Warm Sun-Dappled Nectar Core
  const sunCoreMat = new THREE.MeshPhysicalMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.55,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });

  const core = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), sunCoreMat);
  group.add(core);

  // 2. Sculpted Translucent Blossom Petals (Outer & Inner Layers)
  const outerPetalMat = new THREE.MeshPhysicalMaterial({
    color: 0xfda4af,
    emissive: 0xf43f5e,
    emissiveIntensity: 0.22,
    roughness: 0.15,
    clearcoat: 0.9,
    transparent: true,
    opacity: 0.88,
  });

  const innerPetalMat = new THREE.MeshPhysicalMaterial({
    color: 0xfef08a,
    emissive: 0xfacc15,
    emissiveIntensity: 0.25,
    roughness: 0.18,
    clearcoat: 0.85,
    transparent: true,
    opacity: 0.92,
  });

  const outerPetalRing = new THREE.Group();
  const outerPetalGeo = new THREE.SphereGeometry(0.46, 20, 20);
  outerPetalGeo.scale(0.68, 1.4, 0.22);

  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const petal = new THREE.Mesh(outerPetalGeo, outerPetalMat);
    petal.position.set(Math.cos(a) * 0.88, Math.sin(a) * 0.88, 0);
    petal.rotation.z = a - Math.PI / 2;
    petal.rotation.x = 0.22; // Slight natural cup curve
    outerPetalRing.add(petal);
  }
  outerPetalRing.rotation.x = -0.35;
  group.add(outerPetalRing);

  const innerPetalRing = new THREE.Group();
  const innerPetalGeo = new THREE.SphereGeometry(0.32, 16, 16);
  innerPetalGeo.scale(0.62, 1.25, 0.2);

  for (let i = 0; i < 8; i++) {
    const a = ((i + 0.5) / 8) * Math.PI * 2;
    const petal = new THREE.Mesh(innerPetalGeo, innerPetalMat);
    petal.position.set(Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0.12);
    petal.rotation.z = a - Math.PI / 2;
    petal.rotation.x = 0.35;
    innerPetalRing.add(petal);
  }
  innerPetalRing.rotation.x = -0.35;
  group.add(innerPetalRing);

  // 3. Glossy Morning Dewdrops & Floating Golden Pollen Motes
  const dewMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.02,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.85,
  });

  const pollenMat = new THREE.MeshBasicMaterial({
    color: 0xfef9c3,
  });

  const motes = [];
  for (let i = 0; i < 12; i++) {
    const isDew = i % 3 === 0;
    const mote = new THREE.Mesh(
      new THREE.SphereGeometry(isDew ? 0.075 : 0.045, 12, 12),
      isDew ? dewMat : pollenMat
    );
    const a = (i / 12) * Math.PI * 2;
    const r = 1.25 + (i % 3) * 0.18;
    const baseY = ((i % 4) - 1.5) * 0.35;
    mote.position.set(Math.cos(a) * r, baseY, Math.sin(a) * r);
    group.add(mote);
    motes.push({ mesh: mote, angle: a, r, baseY, phase: i * 0.6 });
  }

  return {
    group,
    description:
      'Blending cottagecore warmth, botanical photography, and sunlit digital optimism, Bloomcore centers on translucent floral geometry, golden-hour gradients, morning dewdrops, and organic slow-motion bloom.',
    background: 'radial-gradient(circle at 50% 30%, #fef08a 0%, #fdba74 45%, #fb7185 100%)',
    update(t, bounce, spring) {
      core.scale.setScalar(1 + Math.sin(t * 2.2) * 0.05);

      outerPetalRing.rotation.z = t * 0.32;
      innerPetalRing.rotation.z = -t * 0.45;

      // Gentle breathing bloom tilt
      const breathe = -0.35 + Math.sin(t * 1.4) * 0.08;
      outerPetalRing.rotation.x = breathe;
      innerPetalRing.rotation.x = breathe;

      motes.forEach((m) => {
        const a = m.angle + t * 0.35;
        m.mesh.position.x = Math.cos(a) * m.r;
        m.mesh.position.z = Math.sin(a) * m.r;
        m.mesh.position.y = m.baseY + Math.sin(t * 1.8 + m.phase) * 0.12;
      });

      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
