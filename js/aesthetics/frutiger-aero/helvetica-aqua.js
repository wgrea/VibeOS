// js/aesthetics/frutiger-aero/helvetica-aqua.js

import * as THREE from 'three';

function createRoundedRectShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x, y + radius);
  shape.lineTo(x, y + height - radius);
  shape.quadraticCurveTo(x, y + height, x + radius, y + height);
  shape.lineTo(x + width - radius, y + height);
  shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  shape.lineTo(x + width, y + radius);
  shape.quadraticCurveTo(x + width, y, x + width - radius, y);
  shape.lineTo(x + radius, y);
  shape.quadraticCurveTo(x, y, x, y + radius);
  return shape;
}

function createMinimalOkGlyph() {
  const glyphGroup = new THREE.Group();
  const glyphMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    emissive: 0xe0f2fe,
    emissiveIntensity: 0.35,
    roughness: 0.12,
    clearcoat: 1.0,
  });

  // Clean Helvetica-style "O" ring
  const oRing = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.036, 16, 36), glyphMat);
  oRing.position.set(-0.18, 0, 0);
  glyphGroup.add(oRing);

  // Clean Helvetica-style "K" strokes
  const kStem = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.31, 0.06), glyphMat);
  kStem.position.set(0.08, 0, 0);

  const kUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.064, 0.21, 0.06), glyphMat);
  kUpperArm.position.set(0.19, 0.065, 0);
  kUpperArm.rotation.z = -Math.PI / 4;

  const kLowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.064, 0.22, 0.06), glyphMat);
  kLowerArm.position.set(0.2, -0.062, 0);
  kLowerArm.rotation.z = Math.PI / 4;

  glyphGroup.add(kStem, kUpperArm, kLowerArm);
  return glyphGroup;
}

export function createHelveticaAqua() {
  const group = new THREE.Group();

  // 1. Swiss Grid & Mac OS X Pinstripe Frosted Backing Panel
  const gridPanelGroup = new THREE.Group();

  const panelShape = createRoundedRectShape(2.9, 1.95, 0.16);
  const panelGeo = new THREE.ExtrudeGeometry(panelShape, {
    depth: 0.05,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  });
  panelGeo.center();

  const frostedBackplate = new THREE.Mesh(
    panelGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.22,
      transmission: 0.65,
      thickness: 0.3,
      ior: 1.42,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.85,
    })
  );
  gridPanelGroup.add(frostedBackplate);

  // Classic OS X Aqua Horizontal Pinstripes
  const stripeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.25,
    metalness: 0.05,
  });

  const stripeCount = 9;
  for (let i = 0; i < stripeCount; i++) {
    const y = -0.76 + (i / (stripeCount - 1)) * 1.52;
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.68, 0.032, 0.075), stripeMat);
    stripe.position.set(0, y, 0);
    gridPanelGroup.add(stripe);
  }

  // Swiss International Style Corner Registration Crosshairs
  const tickMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
  const corners = [
    [-1.24, 0.78],
    [1.24, 0.78],
    [-1.24, -0.78],
    [1.24, -0.78],
  ];

  corners.forEach(([cx, cy]) => {
    const hTick = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.018, 0.085), tickMat);
    hTick.position.set(cx, cy, 0);
    const vTick = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.14, 0.085), tickMat);
    vTick.position.set(cx, cy, 0);
    gridPanelGroup.add(hTick, vTick);
  });

  gridPanelGroup.position.set(0, 0, -0.45);
  group.add(gridPanelGroup);

  // 2. Dual-Layer Refractive Mac OS X Aqua Gel Pill
  const pillAssembly = new THREE.Group();

  // Inner Glowing Azure Liquid Core
  const innerCoreGeo = new THREE.CapsuleGeometry(0.41, 1.08, 20, 32);
  innerCoreGeo.rotateZ(Math.PI / 2);
  const innerCore = new THREE.Mesh(
    innerCoreGeo,
    new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.42,
      roughness: 0.18,
    })
  );
  pillAssembly.add(innerCore);

  // Embedded Geometric Helvetica "OK" Typography Inside the Gel
  const okGlyph = createMinimalOkGlyph();
  pillAssembly.add(okGlyph);

  // Outer Thick Refractive Glass Shell (No detached floating tubes)
  const outerShellGeo = new THREE.CapsuleGeometry(0.52, 1.16, 24, 36);
  outerShellGeo.rotateZ(Math.PI / 2);
  const outerShell = new THREE.Mesh(
    outerShellGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.02,
      transmission: 0.92,
      thickness: 0.85,
      ior: 1.46,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
    })
  );
  pillAssembly.add(outerShell);

  pillAssembly.position.set(0, 0, 0.18);
  group.add(pillAssembly);

  return {
    group,
    description:
      'Marrying Swiss modernist grid rigor and clean neo-grotesque typography with early-2000s liquid UI, Helvetica Aqua balances crisp pinstripe architecture against luminous, water-filled glass gel buttons.',
    background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #bae6fd 55%, #38bdf8 100%)',
    update(t, bounce, spring) {
      group.rotation.y = Math.sin(t * 0.6) * 0.26;
      group.rotation.x = Math.cos(t * 0.5) * 0.1;

      pillAssembly.position.y = Math.sin(t * 1.8) * 0.06 - bounce * 0.45;
      pillAssembly.scale.set(1 + spring * 0.35, 1 - spring * 0.28, 1 + spring * 0.15);

      group.scale.setScalar(1 + spring * 0.18);
    },
  };
}
