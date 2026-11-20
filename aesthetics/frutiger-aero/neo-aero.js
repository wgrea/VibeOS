// js/aesthetics/frutiger-aero/neo-aero.js
import * as THREE from 'three';

export function createNeoAero() {
  const group = new THREE.Group();

  // 1. Back Tinted Mint-Aqua Frosted Glass Card
  const cardGeo = new THREE.BoxGeometry(2.35, 1.48, 0.08);
  const backCard = new THREE.Mesh(
    cardGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.45,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      depthWrite: false,
    })
  );
  backCard.position.set(0.35, -0.22, -0.24);
  backCard.rotation.z = -0.12;
  group.add(backCard);

  // 2. Front Frosted Glassmorphism Hero Card + Crisp White Hairline Rim
  const frontCard = new THREE.Mesh(
    cardGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xe0f2fe,
      emissiveIntensity: 0.18,
      transparent: true,
      opacity: 0.56,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      depthWrite: false,
    })
  );
  frontCard.position.set(0, 0, 0.2);

  const frontEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(cardGeo),
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    })
  );
  frontCard.add(frontEdges);

  // Subtle Modern Glassmorphism UI Pill & Avatar Accent on the Hero Card
  const uiMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.72,
  });

  const uiAvatar = new THREE.Mesh(new THREE.CircleGeometry(0.18, 24), uiMat);
  uiAvatar.position.set(-0.72, 0.24, 0.042);
  frontCard.add(uiAvatar);

  const uiTitleBar = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.1), uiMat);
  uiTitleBar.position.set(0.12, 0.3, 0.042);
  frontCard.add(uiTitleBar);

  const uiSubBar = new THREE.Mesh(
    new THREE.PlaneGeometry(0.85, 0.07),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.48,
    })
  );
  uiSubBar.position.set(-0.03, 0.14, 0.042);
  frontCard.add(uiSubBar);

  group.add(frontCard);

  // 3. Glossy Floating Aqua Water Droplets & Glass Spheres
  const droplets = [];
  const dropGeo = new THREE.SphereGeometry(1, 24, 24);
  const dropMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.25,
    roughness: 0.03,
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
    transparent: true,
    opacity: 0.9,
  });

  const dropSpecs = [
    { pos: [-1.3, 0.7, 0.45], scale: 0.22 },
    { pos: [1.35, 0.55, 0.5], scale: 0.17 },
    { pos: [-1.05, -0.75, 0.4], scale: 0.15 },
    { pos: [1.15, -0.65, 0.45], scale: 0.25 },
    { pos: [0.0, 1.02, 0.32], scale: 0.13 },
  ];

  dropSpecs.forEach((d) => {
    const mesh = new THREE.Mesh(dropGeo, dropMat);
    mesh.position.set(...d.pos);
    mesh.scale.setScalar(d.scale);
    group.add(mesh);
    droplets.push({ mesh, baseY: d.pos[1] });
  });

  return {
    group,
    description:
      'Emerging in the 2020s alongside macOS Big Sur, Windows 11 Mica/Acrylic, and modern glassmorphism, Neo Aero revives Frutiger Aero’s aquatic optimism and frosted translucency within sleek, minimalist contemporary UI cards.',
    background: 'radial-gradient(circle at 50% 30%, #ecfeff 0%, #a5f3fc 60%, #34d399 100%)',
    update(t, bounce, spring) {
      frontCard.rotation.y = Math.sin(t * 1.1) * 0.24;
      backCard.rotation.y = Math.sin(t * 1.1 - 0.5) * 0.24;

      droplets.forEach((d, i) => {
        d.mesh.position.y = d.baseY + Math.sin(t * 1.8 + i) * 0.12 + bounce * 0.25;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
