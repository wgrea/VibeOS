// js/aesthetics/frutiger-aero/dark-aero.js
import * as THREE from 'three';

export function createDarkAero() {
  const group = new THREE.Group();

  // 1. Glowing Cyan Energy Core (visible inside the smoked glass)
  const coreMesh = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.52, 2),
    new THREE.MeshPhysicalMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.35,
      roughness: 0.08,
      clearcoat: 1.0,
    })
  );
  group.add(coreMesh);

  // 2. Translucent Smoked Obsidian Glass Prism
  const prismGeo = new THREE.OctahedronGeometry(1.12, 0);
  const prismMat = new THREE.MeshPhysicalMaterial({
    color: 0x090d16,
    metalness: 0.15,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
  });
  const prism = new THREE.Mesh(prismGeo, prismMat);
  group.add(prism);

  // 3. Crisp Cyan Edge Specular Trim (Windows Vista / Zune glass bevel feel)
  const prismEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(prismGeo),
    new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
    })
  );
  prism.add(prismEdges);

  // 4. Glossy Aurora & Teal Orbital Rings
  const outerRingMat = new THREE.MeshPhysicalMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.55,
    roughness: 0.06,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.88,
  });
  const ringOuter = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.032, 16, 64), outerRingMat);
  ringOuter.rotation.x = Math.PI / 2.6;
  group.add(ringOuter);

  const innerRingMat = new THREE.MeshPhysicalMaterial({
    color: 0x0ea5e9,
    emissive: 0x0284c7,
    emissiveIntensity: 0.6,
    roughness: 0.06,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.85,
  });
  const ringInner = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.024, 16, 64), innerRingMat);
  ringInner.rotation.set(Math.PI / 4, 0.35, 0);
  group.add(ringInner);

  // 5. Orbiting Bioluminescent Glass Droplets
  const dropMat = new THREE.MeshPhysicalMaterial({
    color: 0x67e8f9,
    emissive: 0x10b981,
    emissiveIntensity: 0.45,
    roughness: 0.04,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.9,
  });

  const droplets = [];
  for (let i = 0; i < 8; i++) {
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 20), dropMat);
    const angle = (i / 8) * Math.PI * 2;
    const radius = 1.62;
    const baseY = (i % 2 === 0 ? 1 : -1) * 0.22;
    drop.position.set(Math.cos(angle) * radius, baseY, Math.sin(angle) * radius);
    group.add(drop);
    droplets.push({ mesh: drop, angle, baseY });
  }

  return {
    group,
    description:
      'Popularized around 2006–2009 by Windows Vista’s smoked Aero Glass, Zune media players, and dark-mode desktop skins, Dark Aero reimagines Frutiger Aero’s sunlit optimism as nocturnal translucent obsidian, glowing cyan cores, and bioluminescent emerald auroras.',
    background: 'radial-gradient(circle at 50% 35%, #0c4a6e 0%, #090d16 65%, #020617 100%)',
    update(t, bounce, spring) {
      coreMesh.rotation.y = -t * 1.1;
      coreMesh.scale.setScalar(1 + Math.sin(t * 2.4) * 0.06);

      prism.rotation.y = t * 0.45;
      prism.rotation.x = Math.sin(t * 0.5) * 0.2;

      ringOuter.rotation.z = t * 0.35;
      ringInner.rotation.y = -t * 0.55;

      droplets.forEach((d, idx) => {
        const a = d.angle + t * 0.5;
        d.mesh.position.x = Math.cos(a) * 1.62;
        d.mesh.position.z = Math.sin(a) * 1.62;
        d.mesh.position.y = d.baseY + Math.sin(t * 1.8 + idx) * 0.12;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
