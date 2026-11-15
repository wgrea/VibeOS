import * as THREE from 'three';

export function createGlam() {
  const group = new THREE.Group();

  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0xfbcfe8,
    emissive: 0xf472b6,
    emissiveIntensity: 0.2,
    transmission: 0.75,
    roughness: 0.05,
    ior: 2.1,
    thickness: 1.0,
    clearcoat: 1.0,
  });

  const roseGoldMat = new THREE.MeshStandardMaterial({
    color: 0xfda4af,
    metalness: 0.92,
    roughness: 0.12,
  });

  // Faceted diamond centerpiece
  const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.62, 0), crystalMat);
  diamond.scale.set(1, 1.25, 1);
  group.add(diamond);

  // Orbiting rose-gold sequin halo
  const halo = new THREE.Group();
  const facetGeo = new THREE.OctahedronGeometry(0.11, 0);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const gem = new THREE.Mesh(facetGeo, roseGoldMat);
    gem.position.set(Math.cos(a) * 1.12, Math.sin(a) * 1.12, 0);
    halo.add(gem);
  }
  halo.rotation.x = 0.45;
  group.add(halo);

  return {
    group,
    draggable: diamond,
    background: 'radial-gradient(circle at 50% 30%, #fdf2f8 0%, #f472b6 45%, #831843 100%)',
    update(t, bounce, spring) {
      diamond.rotation.y = t * 0.85;
      halo.rotation.z = -t * 0.65;
      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
