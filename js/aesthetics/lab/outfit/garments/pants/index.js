import * as THREE from 'three';
import { 
  createPantsPelvisGeometry, 
  createPantLegGeometry, 
  createCargoPocketMesh, 
  createTrackStripeGroup, 
  createMotoKneeRibbing 
} from './geometries.js';
import { morphPelvisVertices } from './sizing.js';

export function buildPants(initialHex = 0x111318) {
  const garmentGroup = new THREE.Group();

  const mainMat = new THREE.MeshPhysicalMaterial({
    color: initialHex,
    side: THREE.DoubleSide
  });

  const trimMat = new THREE.MeshPhysicalMaterial({
    color: 0xf1f5f9,
    side: THREE.DoubleSide
  });

  const hardwareMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.85,
    roughness: 0.25
  });

  const pelvisGeo = createPantsPelvisGeometry();
  const pelvis = new THREE.Mesh(pelvisGeo, mainMat);
  pelvis.castShadow = true;
  pelvis.receiveShadow = true;
  garmentGroup.add(pelvis);

  const waistY = 0.218;
  const waistGroup = new THREE.Group();
  waistGroup.position.y = waistY;

  const waistBandGeo = new THREE.CylinderGeometry(0.260, 0.257, 0.072, 48);
  waistBandGeo.userData.basePositions = new Float32Array(waistBandGeo.attributes.position.array);
  const waistBand = new THREE.Mesh(waistBandGeo, trimMat);
  waistBand.castShadow = true;
  waistGroup.add(waistBand);

  const morphedWaistRings = [
    { geo: waistBandGeo, yOffset: waistY }
  ];

  [
    { y: -0.033, r: 0.2575 },
    { y: 0.033, r: 0.2605 }
  ].forEach(({ y, r }) => {
    const stitchGeo = new THREE.TorusGeometry(r, 0.0028, 8, 48);
    stitchGeo.rotateX(Math.PI / 2);
    stitchGeo.userData.basePositions = new Float32Array(stitchGeo.attributes.position.array);
    const stitch = new THREE.Mesh(stitchGeo, trimMat);
    stitch.position.y = y;
    waistGroup.add(stitch);
    morphedWaistRings.push({ geo: stitchGeo, yOffset: waistY + y });
  });

  const waistDetails = new THREE.Group();

  const waistBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.010, 0.007, 16), hardwareMat);
  waistBtn.rotation.x = Math.PI / 2;
  waistBtn.position.set(0, 0.005, 0.259);
  waistDetails.add(waistBtn);

  [-2.35, -1.15, -0.38, 0.38, 1.15, 2.35].forEach((angle) => {
    const loop = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.076, 0.008), trimMat);
    loop.position.set(Math.sin(angle) * 0.259, 0, Math.cos(angle) * 0.259);
    loop.rotation.y = angle;
    waistDetails.add(loop);
  });

  waistGroup.add(waistDetails);
  garmentGroup.add(waistGroup);

  const flyPlacket = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.142, 0.012), mainMat);
  flyPlacket.position.set(0.008, 0.112, 0.268);
  flyPlacket.rotation.x = -0.09;
  garmentGroup.add(flyPlacket);

  const legs = [];
  const cargoPockets = [];
  const trackStripes = [];
  const motoRibs = [];
  const snowGaiters = [];

  const legGeo = createPantLegGeometry({
    topR: 0.140,
    midR: 0.129,
    bottomR: 0.121,
    length: 0.92
  });

  let activeProfile = null;
  let currentVariant = 'cargo';

  [-1, 1].forEach((side) => {
    const legPivot = new THREE.Group();
    legPivot.position.set(side * 0.155, -0.62, 0);
    legPivot.rotation.z = side * -0.04;

    const leg = new THREE.Mesh(legGeo, mainMat);
    leg.castShadow = true;
    leg.receiveShadow = true;
    legPivot.add(leg);

    const hipCap = new THREE.Mesh(new THREE.SphereGeometry(0.140, 20, 14), mainMat);
    hipCap.position.y = 0.46;
    legPivot.add(hipCap);

    const ankleHem = new THREE.Mesh(new THREE.CylinderGeometry(0.123, 0.123, 0.055, 24), trimMat);
    ankleHem.position.y = -0.465;
    legPivot.add(ankleHem);

    const hemLip = new THREE.Mesh(new THREE.TorusGeometry(0.123, 0.0035, 8, 24), trimMat);
    hemLip.rotation.x = Math.PI / 2;
    hemLip.position.y = -0.437;
    legPivot.add(hemLip);

    const ankleCap = new THREE.Mesh(new THREE.SphereGeometry(0.122, 18, 12), trimMat);
    ankleCap.position.y = -0.492;
    legPivot.add(ankleCap);

    const pocket = createCargoPocketMesh(side, mainMat, trimMat, hardwareMat);
    legPivot.add(pocket);
    cargoPockets.push(pocket);

    const stripe = createTrackStripeGroup(side, trimMat);
    legPivot.add(stripe);
    trackStripes.push(stripe);

    const kneeRib = createMotoKneeRibbing(trimMat);
    legPivot.add(kneeRib);
    motoRibs.push(kneeRib);

    const snowCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.127, 0.129, 0.12, 24), trimMat);
    snowCuff.position.y = -0.43;
    legPivot.add(snowCuff);
    snowGaiters.push(snowCuff);

    garmentGroup.add(legPivot);
    legs.push({ mesh: legPivot, side });
  });

  function applyLegScaling() {
    const baseRadius = activeProfile ? activeProfile.legRadius : 0.102;
    const bulk = currentVariant === 'snow' ? 1.18 : 1.0;
    const legScale = ((baseRadius + 0.028) / 0.126) * bulk;

    legs.forEach(({ mesh, side }) => {
      if (activeProfile) {
        mesh.position.x = side * activeProfile.legOffset;
      }
      mesh.scale.set(legScale, 1, legScale);
    });
  }

  function setVariant(variant) {
    currentVariant = variant;
    cargoPockets.forEach((m) => (m.visible = variant === 'cargo'));
    trackStripes.forEach((m) => (m.visible = variant === 'track'));
    motoRibs.forEach((m) => (m.visible = variant === 'leather-moto'));
    snowGaiters.forEach((m) => (m.visible = variant === 'snow'));
    applyLegScaling();
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

    if (mainMat.sheenColor) {
      mainMat.sheenColor.setHex(mainHex).lerp(new THREE.Color(0xffffff), 0.35);
    }
    if (trimMat.sheenColor) {
      trimMat.sheenColor.setHex(trimHex).lerp(new THREE.Color(0xffffff), 0.3);
    }
  }

  function syncBody(profile) {
    activeProfile = profile;
    const [chestX, , chestZ] = profile.chestScale;
    const [hipX, , hipZ] = profile.hipScale;

    morphPelvisVertices(pelvisGeo, profile.chestScale, profile.hipScale, 0);
    morphedWaistRings.forEach(({ geo, yOffset }) => {
      morphPelvisVertices(geo, profile.chestScale, profile.hipScale, yOffset);
    });

    const waistT = THREE.MathUtils.smoothstep(waistY, 0.14, 0.56);
    waistDetails.scale.set(
      THREE.MathUtils.lerp(hipX, chestX, waistT),
      1,
      THREE.MathUtils.lerp(hipZ, chestZ, waistT)
    );

    flyPlacket.position.z = 0.268 * hipZ + 0.004;
    applyLegScaling();
  }

  setVariant(currentVariant);
  return { garmentGroup, applyStyle, syncBody, setVariant };
}