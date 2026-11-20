// js/aesthetics/frutiger-aero/urbling.js

import * as THREE from 'three';

function createArrowGeometry() {
  const shape = new THREE.Shape();
  // Chunky 2008 Illustrator-style street vector arrow
  shape.moveTo(-0.22, -0.07);
  shape.lineTo(0.04, -0.07);
  shape.lineTo(0.04, -0.17);
  shape.lineTo(0.26, 0.0);
  shape.lineTo(0.04, 0.17);
  shape.lineTo(0.04, 0.07);
  shape.lineTo(-0.22, 0.07);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });
  geo.center();
  return geo;
}

function createBlingSparkleGeometry() {
  const shape = new THREE.Shape();
  const points = 8;
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const radius = i % 2 === 0 ? 0.22 : 0.065;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.05,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.018,
    bevelThickness: 0.018,
  });
  geo.center();
  return geo;
}

function createCrownMesh() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.26, -0.14);
  shape.lineTo(-0.32, 0.16);
  shape.lineTo(-0.14, 0.02);
  shape.lineTo(0.0, 0.22);
  shape.lineTo(0.14, 0.02);
  shape.lineTo(0.32, 0.16);
  shape.lineTo(0.26, -0.14);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: 0.025,
    bevelThickness: 0.025,
  });
  geo.center();

  const crown = new THREE.Mesh(
    geo,
    new THREE.MeshPhysicalMaterial({
      color: 0xfacc15,
      emissive: 0xca8a04,
      emissiveIntensity: 0.35,
      metalness: 0.65,
      roughness: 0.12,
      clearcoat: 1.0,
    })
  );

  // Glossy Jewel Studs on Crown Base
  const jewelColors = [0xec4899, 0x22d3ee, 0x84cc16];
  [-0.15, 0, 0.15].forEach((x, idx) => {
    const jewel = new THREE.Mesh(
      new THREE.SphereGeometry(0.036, 12, 12),
      new THREE.MeshPhysicalMaterial({
        color: jewelColors[idx],
        emissive: jewelColors[idx],
        emissiveIntensity: 0.4,
        roughness: 0.05,
        clearcoat: 1.0,
      })
    );
    jewel.position.set(x, -0.06, 0.075);
    crown.add(jewel);
  });

  return crown;
}

export function createUrbling() {
  const group = new THREE.Group();

  // 1. Glossy Designer Vinyl Toy Centerpiece (Kidrobot / Urban Vinyl Figure Silhouette)
  const toyGroup = new THREE.Group();

  const vinylOrangeMat = new THREE.MeshPhysicalMaterial({
    color: 0xf97316,
    emissive: 0xc2410c,
    emissiveIntensity: 0.25,
    roughness: 0.07,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
  });

  // Plump Vinyl Toy Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.64, 36, 36), vinylOrangeMat);
  head.scale.set(1.06, 0.96, 0.95);
  toyGroup.add(head);

  // Rounded Bear/Bunny Vinyl Toy Ears
  [-0.44, 0.44].forEach((x) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), vinylOrangeMat);
    ear.position.set(x, 0.56, 0);
    ear.scale.set(1, 1.15, 0.65);
    toyGroup.add(ear);
  });

  // Glossy White Visor / Street Sunglasses
  const visorShape = new THREE.Shape();
  visorShape.absarc(-0.2, 0, 0.18, 0, Math.PI * 2, false);
  const visorGeo = new THREE.ExtrudeGeometry(
    new THREE.Shape()
      .moveTo(-0.46, -0.1)
      .lineTo(0.46, -0.1)
      .quadraticCurveTo(0.5, 0.14, 0.24, 0.15)
      .lineTo(0.06, 0.08)
      .lineTo(-0.06, 0.08)
      .lineTo(-0.24, 0.15)
      .quadraticCurveTo(-0.5, 0.14, -0.46, -0.1),
    {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    }
  );
  visorGeo.center();

  const visor = new THREE.Mesh(
    visorGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    })
  );
  visor.position.set(0, 0.05, 0.6);
  toyGroup.add(visor);

  // Oversized Cyan & Lime DJ Headphones
  const band = new THREE.Mesh(
    new THREE.TorusGeometry(0.71, 0.065, 16, 40, Math.PI),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.12,
      clearcoat: 1.0,
    })
  );
  band.position.y = 0.05;
  toyGroup.add(band);

  const cupMat = new THREE.MeshPhysicalMaterial({
    color: 0x0ea5e9,
    emissive: 0x0369a1,
    emissiveIntensity: 0.3,
    roughness: 0.08,
    clearcoat: 1.0,
  });
  const rimMat = new THREE.MeshPhysicalMaterial({
    color: 0x84cc16,
    emissive: 0x4d7c0f,
    emissiveIntensity: 0.3,
    roughness: 0.08,
    clearcoat: 1.0,
  });

  [-0.72, 0.72].forEach((x, idx) => {
    const dir = idx === 0 ? -1 : 1;
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.16, 28), cupMat);
    cup.rotation.z = Math.PI / 2;
    cup.position.set(x, 0.02, 0);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.035, 12, 28), rimMat);
    rim.rotation.y = Math.PI / 2;
    rim.position.set(x + dir * 0.08, 0.02, 0);

    toyGroup.add(cup, rim);
  });

  // Tilted Floating Gold Street Crown Above Head
  const crown = createCrownMesh();
  crown.position.set(0.24, 0.92, 0.12);
  crown.rotation.z = -0.24;
  toyGroup.add(crown);

  group.add(toyGroup);

  // 2. Grooved Vinyl Turntable & Glossy Equalizer Ring
  const turntableGroup = new THREE.Group();

  const vinylDisc = new THREE.Mesh(
    new THREE.RingGeometry(0.96, 1.48, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0x090d16,
      roughness: 0.18,
      metalness: 0.35,
      clearcoat: 1.0,
      side: THREE.DoubleSide,
    })
  );
  vinylDisc.rotation.x = Math.PI / 2;
  turntableGroup.add(vinylDisc);

  const outerRim = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.06, 16, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0x22d3ee,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      roughness: 0.06,
      clearcoat: 1.0,
    })
  );
  outerRim.rotation.x = Math.PI / 2;
  turntableGroup.add(outerRim);

  turntableGroup.rotation.x = 0.42;
  turntableGroup.rotation.z = -0.18;
  group.add(turntableGroup);

  // 3. Orbiting Extruded Vector Graffiti Arrows & Bling Sparkle Stars
  const arrowGeo = createArrowGeometry();
  const sparkleGeo = createBlingSparkleGeometry();
  const tagColors = [0x84cc16, 0xec4899, 0xfacc15, 0x22d3ee];
  const tags = [];

  for (let i = 0; i < 8; i++) {
    const isArrow = i % 2 === 0;
    const color = tagColors[i % tagColors.length];
    const tag = new THREE.Mesh(
      isArrow ? arrowGeo : sparkleGeo,
      new THREE.MeshPhysicalMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.32,
        roughness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
      })
    );

    const a = (i / 8) * Math.PI * 2;
    const baseY = Math.sin(i * 1.5) * 0.48;
    tag.position.set(Math.cos(a) * 1.72, baseY, Math.sin(a) * 1.72);
    group.add(tag);
    tags.push({ mesh: tag, angle: a, baseY, isArrow });
  }

  return {
    group,
    description:
      'Fusing late-2000s urban streetwear, vinyl designer toys, and hip-hop vector graphics with Frutiger Aero gloss, Urbling pairs plump vinyl figures, oversized DJ headphones, gold crowns, and candy-coated graffiti arrows.',
    background: 'radial-gradient(circle at 50% 30%, #fef08a 0%, #fb923c 50%, #0284c7 100%)',
    update(t, bounce, spring) {
      toyGroup.rotation.y = Math.sin(t * 0.85) * 0.38;
      toyGroup.position.y = Math.sin(t * 2.2) * 0.05 - bounce * 0.45;

      crown.position.y = 0.92 + Math.sin(t * 3.1) * 0.04;
      crown.rotation.y = t * 1.1;

      turntableGroup.rotation.y = -t * 0.65;
      outerRim.scale.setScalar(1 + Math.sin(t * 4) * 0.025 + spring * 0.18);

      tags.forEach((tg, idx) => {
        const a = tg.angle + t * 0.78;
        tg.mesh.position.x = Math.cos(a) * 1.72;
        tg.mesh.position.z = Math.sin(a) * 1.72;
        tg.mesh.position.y = tg.baseY + Math.sin(t * 2.6 + idx) * 0.14;

        if (tg.isArrow) {
          // Point arrows tangentially along their orbit like dynamic vector motion graphics
          tg.mesh.rotation.y = -a;
          tg.mesh.rotation.z = Math.sin(t * 2 + idx) * 0.25;
        } else {
          tg.mesh.rotation.y = t * 2.1 + idx;
          tg.mesh.rotation.z = t * 1.4;
        }
      });

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
