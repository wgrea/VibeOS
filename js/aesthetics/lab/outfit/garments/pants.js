// js/aesthetics/lab/outfit/garments/pants.js
import * as THREE from 'three';

export function buildPants(initialHex = 0x111318) {
  const garmentGroup = new THREE.Group();

  const mainMat = new THREE.MeshPhysicalMaterial({ color: initialHex });
  const trimMat = new THREE.MeshPhysicalMaterial({ color: 0xf1f5f9 });

  // Waistband & Hips (clearance +0.032 over mannequin, fits over catsuit)
  const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.232, 0.245, 0.10, 24), trimMat);
  waist.position.y = 0.26;
  garmentGroup.add(waist);

  const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.242, 0.312, 0.44, 24), mainMat);
  hips.position.y = 0.05;
  garmentGroup.add(hips);

  const pelvisCap = new THREE.Mesh(new THREE.SphereGeometry(0.285, 24, 16), mainMat);
  pelvisCap.position.y = -0.15;
  garmentGroup.add(pelvisCap);

  // Legs + Style Detail Groups
  const legs = [];
  const cargoPockets = [];
  const trackStripes = [];
  const motoRibs = [];

  [-1, 1].forEach((side) => {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.126, 0.90, 12, 24), mainMat);
    leg.position.set(side * 0.155, -0.61, 0);
    leg.rotation.z = side * -0.04;
    garmentGroup.add(leg);
    legs.push({ mesh: leg, side });

    // Cargo thigh pocket
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.18, 0.14), mainMat);
    pocket.position.set(side * 0.275, -0.42, 0);
    pocket.rotation.z = side * -0.04;
    garmentGroup.add(pocket);
    cargoPockets.push({ mesh: pocket, side });

    // Track pant side stripe
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.86, 0.04), trimMat);
    stripe.position.set(side * 0.275, -0.61, 0);
    stripe.rotation.z = side * -0.04;
    garmentGroup.add(stripe);
    trackStripes.push({ mesh: stripe, side });

    // Leather/Moto knee ribbing
    const kneeRib = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.045), trimMat);
    kneeRib.position.set(side * 0.155, -0.58, 0.118);
    kneeRib.rotation.z = side * -0.04;
    garmentGroup.add(kneeRib);
    motoRibs.push({ mesh: kneeRib, side });
  });

  let currentVariant = 'cargo';

  function setVariant(variant) {
    currentVariant = variant;
    cargoPockets.forEach(({ mesh }) => (mesh.visible = variant === 'cargo'));
    trackStripes.forEach(({ mesh }) => (mesh.visible = variant === 'track'));
    motoRibs.forEach(({ mesh }) => (mesh.visible = variant === 'leather-moto'));

    // Snow pants get extra insulated volume
    const bulkScale = variant === 'snow' ? 1.18 : 1.0;
    legs.forEach(({ mesh }) => {
      mesh.scale.x = bulkScale;
      mesh.scale.z = bulkScale;
    });
  }

  function applyStyle(fabricPreset, colorPreset, palette) {
    const mainHex = palette && palette.primary !== null ? palette.primary : colorPreset.hex;
    const trimHex = palette && palette.secondary !== null ? palette.secondary : 0x1e293b;

    [mainMat, trimMat].forEach((mat) => {
      Object.assign(mat, fabricPreset.mat);
      mat.needsUpdate = true;
    });

    mainMat.color.setHex(mainHex);
    trimMat.color.setHex(trimHex);
    mainMat.sheenColor?.copy(mainMat.color);
  }

  function syncBody(profile) {
    waist.scale.set(...profile.hipScale);
    hips.scale.set(...profile.hipScale);
    pelvisCap.scale.set(profile.hipScale[0] * 0.98, 0.72, profile.hipScale[2] * 0.96);

    const bulk = currentVariant === 'snow' ? 1.18 : 1.0;
    const legScale = ((profile.legRadius + 0.028) / 0.126) * bulk;

    legs.forEach(({ mesh, side }) => {
      mesh.position.x = side * profile.legOffset;
      mesh.scale.set(legScale, 1, legScale);
    });

    cargoPockets.forEach(({ mesh, side }) => (mesh.position.x = side * (profile.legOffset + 0.12)));
    trackStripes.forEach(({ mesh, side }) => (mesh.position.x = side * (profile.legOffset + 0.12)));
    motoRibs.forEach(({ mesh, side }) => (mesh.position.x = side * profile.legOffset));
  }

  setVariant(currentVariant);

  return { garmentGroup, applyStyle, syncBody, setVariant };
}
