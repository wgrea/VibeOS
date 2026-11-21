// js/labs/outfit.js
import * as THREE from 'three';

export const MATERIAL_PRESETS = {
  latex: {
    label: 'Glossy Latex / PVC',
    color: 0x111116,
    roughness: 0.08,
    metalness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
  },
  leather: {
    label: 'Full-Grain Leather',
    color: 0x1c1917,
    roughness: 0.36,
    metalness: 0.12,
    clearcoat: 0.35,
    clearcoatRoughness: 0.28,
  },
  denim: {
    label: 'Raw Indigo Denim',
    color: 0x1e3a8a,
    roughness: 0.85,
    metalness: 0.05,
    clearcoat: 0.0,
    clearcoatRoughness: 0.5,
  },
  snowsuit: {
    label: 'Insulated Snowsuit Nylon',
    color: 0x0284c7,
    roughness: 0.42,
    metalness: 0.18,
    clearcoat: 0.25,
    clearcoatRoughness: 0.3,
  },
  racing: {
    label: 'Moto / Racing Suit',
    color: 0xdc2626,
    roughness: 0.32,
    metalness: 0.22,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
  },
};

export const OUTFIT_ARCHETYPES = {
  twoPieceJacketJeans: {
    label: 'Funnel-Neck Jacket + Jeans',
    mode: 'two-piece',
    defaultTopMat: 'leather',
    defaultBottomMat: 'denim',
    collarHeight: 0.22,
    stripeAccent: false,
  },
  onePieceLatex: {
    label: 'Full-Body Catsuit',
    mode: 'one-piece',
    defaultTopMat: 'latex',
    defaultBottomMat: 'latex',
    collarHeight: 0.18,
    stripeAccent: false,
  },
  snowsuit: {
    label: 'Alpine Snowsuit',
    mode: 'one-piece',
    defaultTopMat: 'snowsuit',
    defaultBottomMat: 'snowsuit',
    collarHeight: 0.26,
    stripeAccent: true,
  },
  racingSuit: {
    label: 'Track Racing Suit',
    mode: 'one-piece',
    defaultTopMat: 'racing',
    defaultBottomMat: 'racing',
    collarHeight: 0.2,
    stripeAccent: true,
  },
};

export function createOutfit() {
  const group = new THREE.Group();

  // Separate Physical Materials for Top/Suit and Bottoms so two-piece outfits mix freely
  const topMat = new THREE.MeshPhysicalMaterial(MATERIAL_PRESETS.leather);
  const bottomMat = new THREE.MeshPhysicalMaterial(MATERIAL_PRESETS.denim);

  const hardwareMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.2,
  });

  const accentStripeMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.25,
    roughness: 0.3,
  });

  const rig = new THREE.Group();

  // 1. Funnel / Mock-Neck Collar
  const collar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.19, 0.22, 24),
    topMat
  );
  collar.position.y = 0.76;
  rig.add(collar);

  // 2. Torso & Shoulders (Jacket / Upper Suit)
  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.26, 0.72, 24),
    topMat
  );
  torso.scale.set(1.15, 1, 0.72);
  torso.position.y = 0.32;
  rig.add(torso);

  // Center Metallic Zipper Track
  const zipper = new THREE.Mesh(
    new THREE.BoxGeometry(0.025, 0.82, 0.03),
    hardwareMat
  );
  zipper.position.set(0, 0.36, 0.22);
  rig.add(zipper);

  // Racing / Snowsuit Chest & Arm Stripes (toggled per archetype)
  const chestStripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.07, 0.46),
    accentStripeMat
  );
  chestStripe.position.set(0, 0.42, 0.01);
  chestStripe.visible = false;
  rig.add(chestStripe);

  // 3. Articulated Sleeves
  const sleeveGeo = new THREE.CylinderGeometry(0.095, 0.078, 0.68, 16);
  const sleeveL = new THREE.Mesh(sleeveGeo, topMat);
  sleeveL.position.set(-0.43, 0.28, 0);
  sleeveL.rotation.z = 0.16;

  const sleeveR = new THREE.Mesh(sleeveGeo, topMat);
  sleeveR.position.set(0.43, 0.28, 0);
  sleeveR.rotation.z = -0.16;
  rig.add(sleeveL, sleeveR);

  // 4. Waist Belt / Seam Divider
  const belt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.275, 0.275, 0.07, 24),
    hardwareMat
  );
  belt.scale.set(1.14, 1, 0.74);
  belt.position.y = -0.05;
  rig.add(belt);

  // 5. Pelvis & Legs (Jeans / Lower Suit)
  const pelvis = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.28, 0.24, 24),
    bottomMat
  );
  pelvis.scale.set(1.15, 1, 0.72);
  pelvis.position.y = -0.18;
  rig.add(pelvis);

  const legGeo = new THREE.CylinderGeometry(0.125, 0.095, 0.86, 18);
  const legL = new THREE.Mesh(legGeo, bottomMat);
  legL.position.set(-0.16, -0.7, 0);

  const legR = new THREE.Mesh(legGeo, bottomMat);
  legR.position.set(0.16, -0.7, 0);
  rig.add(legL, legR);

  group.add(rig);

  // Helper to apply material preset to top or bottom
  function setMaterial(slot, presetKey, customHexColor = null) {
    const preset = MATERIAL_PRESETS[presetKey];
    if (!preset) return;
    const targetMat = slot === 'bottom' ? bottomMat : topMat;

    targetMat.color.setHex(customHexColor !== null ? customHexColor : preset.color);
    targetMat.roughness = preset.roughness;
    targetMat.metalness = preset.metalness;
    targetMat.clearcoat = preset.clearcoat;
    targetMat.clearcoatRoughness = preset.clearcoatRoughness;
    targetMat.needsUpdate = true;
  }

  // Helper to switch between One-Piece Suits and Two-Piece Outfits
  function setArchetype(archetypeKey) {
    const cfg = OUTFIT_ARCHETYPES[archetypeKey];
    if (!cfg) return;

    collar.scale.y = cfg.collarHeight / 0.22;
    chestStripe.visible = cfg.stripeAccent;

    // Puffer snowsuit adds subtle volume to torso & legs
    const bulk = archetypeKey === 'snowsuit' ? 1.12 : 1.0;
    torso.scale.set(1.15 * bulk, 1, 0.72 * bulk);
    legL.scale.set(bulk, 1, bulk);
    legR.scale.set(bulk, 1, bulk);

    setMaterial('top', cfg.defaultTopMat);
    setMaterial('bottom', cfg.defaultBottomMat);
  }

  return {
    group,
    setMaterial,
    setArchetype,
    description:
      'An interactive 3D garment and silhouette lab for experimenting with high-gloss latex, PVC, full-grain leather jackets, raw denim, insulated snowsuits, and track racing suits.',
    background: 'radial-gradient(circle at 50% 30%, #1e293b 0%, #0f172a 55%, #020617 100%)',
    update(t, bounce, spring) {
      rig.rotation.y = Math.sin(t * 0.65) * 0.35;
      rig.position.y = Math.sin(t * 1.4) * 0.03;
      group.scale.setScalar(1 + spring * 0.22);
    },
  };
}
