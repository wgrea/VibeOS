import * as THREE from 'three';

export function createDarkAero() {
  const group = new THREE.Group();

  // Central Obsidian Glass Prism
  const prismGeo = new THREE.OctahedronGeometry(1.15, 0);
  const prismMat = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    metalness: 0.3,
    roughness: 0.06,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
  });
  const prism = new THREE.Mesh(prismGeo, prismMat);
  group.add(prism);

  // Glowing Cyan Inner Core
  const coreMesh = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.55, 1),
    new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00d8ff,
      emissiveIntensity: 1.4,
      roughness: 0.15,
    })
  );
  group.add(coreMesh);

  // Orbiting Aurora Rings
  const ringMat = new THREE.MeshPhysicalMaterial({
    color: 0x10b981,
    emissive: 0x047857,
    emissiveIntensity: 0.6,
    roughness: 0.1,
    clearcoat: 1.0,
  });
  const ringOuter = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.05, 16, 64), ringMat);
  ringOuter.rotation.x = Math.PI / 3;
  group.add(ringOuter);

  const ringInner = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.04, 16, 64), ringMat);
  ringInner.rotation.y = Math.PI / 4;
  group.add(ringInner);

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #0c4a6e 0%, #090d16 70%, #020617 100%)',
    update(t, bounce, spring) {
      prism.rotation.y = t * 0.7;
      prism.rotation.x = Math.sin(t * 0.6) * 0.25;
      coreMesh.rotation.y = -t * 1.4;

      ringOuter.rotation.z = t * 0.5;
      ringInner.rotation.x = -t * 0.8;

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
