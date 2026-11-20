// js/aesthetics/frutiger-aero/vector-garden.js
import * as THREE from 'three';

export function createVectorGarden() {
  const group = new THREE.Group();

  // 1. Rolling Lime-Green Vector Hill Mound
  const hill = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshPhysicalMaterial({
      color: 0x4ade80,
      emissive: 0x15803d,
      emissiveIntensity: 0.25,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    })
  );
  hill.position.y = -0.68;
  group.add(hill);

  // 2. Curved Glossy Stem & Botanical Leaves
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.35, 0),
    new THREE.Vector3(-0.06, 0.58, 0.02),
    new THREE.Vector3(0, 0.85, 0),
  ]);
  const stem = new THREE.Mesh(
    new THREE.TubeGeometry(stemCurve, 24, 0.032, 12, false),
    new THREE.MeshPhysicalMaterial({
      color: 0x22c55e,
      emissive: 0x15803d,
      emissiveIntensity: 0.25,
      roughness: 0.08,
      clearcoat: 1.0,
    })
  );
  group.add(stem);

  // Stylized Vector Grass Blades / Side Leaves
  const bladeMat = new THREE.MeshPhysicalMaterial({
    color: 0x84cc16,
    emissive: 0x4d7c0f,
    emissiveIntensity: 0.25,
    roughness: 0.08,
    clearcoat: 1.0,
  });

  const bladeConfigs = [
    { x: -0.36, y: 0.48, z: 0.18, rz: 0.42, rx: 0.15, scale: [0.35, 1.35, 0.12] },
    { x: 0.38, y: 0.46, z: -0.14, rz: -0.45, rx: -0.12, scale: [0.35, 1.3, 0.12] },
    { x: -0.18, y: 0.52, z: -0.32, rz: 0.28, rx: -0.25, scale: [0.3, 1.15, 0.1] },
    { x: 0.22, y: 0.5, z: 0.34, rz: -0.3, rx: 0.22, scale: [0.3, 1.2, 0.1] },
  ];

  bladeConfigs.forEach((cfg) => {
    const blade = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), bladeMat);
    blade.scale.set(...cfg.scale);
    blade.position.set(cfg.x, cfg.y, cfg.z);
    blade.rotation.set(cfg.rx, 0, cfg.rz);
    group.add(blade);
  });

  // 3. Glossy Vector Daisy / Pinwheel Flower Head
  const flowerGroup = new THREE.Group();
  flowerGroup.position.set(0, 0.85, 0.04);

  const petalMat = new THREE.MeshPhysicalMaterial({
    color: 0xfacc15,
    emissive: 0xeab308,
    emissiveIntensity: 0.3,
    roughness: 0.06,
    clearcoat: 1.0,
  });

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), petalMat);
    petal.scale.set(0.62, 1.4, 0.26);
    petal.position.set(Math.cos(angle) * 0.33, Math.sin(angle) * 0.33, 0);
    petal.rotation.z = angle - Math.PI / 2;
    flowerGroup.add(petal);
  }

  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 24, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
      roughness: 0.04,
      clearcoat: 1.0,
    })
  );
  flowerGroup.add(center);
  group.add(flowerGroup);

  // 4. Floating Glossy Dew Drops & Sunlit Pollen Orbs
  const dewDrops = [];
  const dewMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.25,
    roughness: 0.02,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.88,
  });

  for (let i = 0; i < 8; i++) {
    const dew = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), dewMat);
    const a = (i / 8) * Math.PI * 2;
    dew.position.set(Math.cos(a) * 1.28, 0.15 + (i % 3) * 0.35, Math.sin(a) * 1.28);
    group.add(dew);
    dewDrops.push({ mesh: dew, baseY: dew.position.y, phase: i });
  }

  return {
    group,
    description:
      'Blending mid-2000s vector nature illustrations with playful early-web eco-optimism, Vector Garden pairs rolling lime-green hills and stylized grass blades with glossy daisy blooms, sky-blue centers, and floating morning dew drops.',
    background: 'radial-gradient(circle at 50% 25%, #e0f2fe 0%, #7dd3fc 50%, #22c55e 100%)',
    update(t, bounce, spring) {
      flowerGroup.rotation.z = t * 0.65;
      group.rotation.y = Math.sin(t * 0.4) * 0.28;

      dewDrops.forEach((d) => {
        d.mesh.position.y = d.baseY + Math.sin(t * 2.4 + d.phase) * 0.12;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
