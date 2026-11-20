// js/aesthetics/frutiger-aero/frutiger-paleo.js

import * as THREE from 'three';

function createAmmoniteGeometry() {
  const points = [];
  const turns = 2.75;
  const totalSteps = 90;

  for (let i = 0; i <= totalSteps; i++) {
    const t = i / totalSteps;
    const angle = t * Math.PI * 2 * turns;
    const radius = 0.04 + Math.pow(t, 1.35) * 0.44;
    const zOffset = (t - 0.5) * 0.06;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, zOffset));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeo = new THREE.TubeGeometry(curve, 110, 0.095, 16, false);

  // Taper the tube radius along the curve so it widens like a real nautilus/ammonite shell
  const pos = tubeGeo.attributes.position;
  const v = new THREE.Vector3();
  const center = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    const ringIndex = Math.floor(i / 17);
    const u = Math.min(ringIndex / 110, 1);
    const scale = 0.18 + Math.pow(u, 1.1) * 1.15;

    curve.getPointAt(u, center);
    v.fromBufferAttribute(pos, i).sub(center).multiplyScalar(scale).add(center);
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  tubeGeo.computeVertexNormals();
  return tubeGeo;
}

function createWaterDropletGeometry() {
  const geo = new THREE.SphereGeometry(0.085, 18, 18);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    if (v.y > 0) {
      const taper = 1 - v.y / 0.085;
      v.x *= 0.35 + 0.65 * taper;
      v.z *= 0.35 + 0.65 * taper;
      v.y *= 1.65;
    }
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  return geo;
}

function createFernFrond() {
  const frondGroup = new THREE.Group();
  const leafMat = new THREE.MeshPhysicalMaterial({
    color: 0x22c55e,
    emissive: 0x14532d,
    emissiveIntensity: 0.25,
    roughness: 0.18,
    clearcoat: 1.0,
    side: THREE.DoubleSide,
  });

  // Central stem
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.014, 0.42, 8), leafMat);
  frondGroup.add(stem);

  // Paired leaflets tapering toward the tip
  const pairs = 5;
  for (let i = 0; i < pairs; i++) {
    const progress = i / (pairs - 1);
    const y = -0.14 + progress * 0.28;
    const size = (1 - progress * 0.55) * 0.085;

    [-1, 1].forEach((dir) => {
      const leaflet = new THREE.Mesh(new THREE.SphereGeometry(size, 10, 10), leafMat);
      leaflet.scale.set(1.6, 0.45, 0.18);
      leaflet.position.set(dir * (size * 1.15), y, 0);
      leaflet.rotation.z = dir * -0.35;
      frondGroup.add(leaflet);
    });
  }

  return frondGroup;
}

export function createFrutigerPaleo() {
  const group = new THREE.Group();

  // 1. Thick Refractive Amber Resin Orb (IOR ~1.54 matches real fossil amber)
  const amberGroup = new THREE.Group();
  const amber = new THREE.Mesh(
    new THREE.SphereGeometry(1.06, 40, 40),
    new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.22,
      roughness: 0.04,
      transmission: 0.88,
      thickness: 1.35,
      ior: 1.54,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
    })
  );
  amberGroup.add(amber);

  // 2. Suspended Air Bubbles Trapped Inside the Amber
  const bubbleMat = new THREE.MeshPhysicalMaterial({
    color: 0xfef3c7,
    roughness: 0.02,
    transmission: 0.92,
    ior: 1.1,
    clearcoat: 1.0,
  });

  const bubbleCoords = [
    [-0.48, 0.42, 0.35, 0.055],
    [0.54, -0.36, 0.28, 0.042],
    [-0.32, -0.52, -0.38, 0.048],
    [0.38, 0.48, -0.32, 0.035],
    [0.12, 0.65, 0.25, 0.028],
    [-0.62, -0.08, -0.22, 0.038],
  ];

  bubbleCoords.forEach(([x, y, z, r]) => {
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 14), bubbleMat);
    bubble.position.set(x, y, z);
    amberGroup.add(bubble);
  });

  group.add(amberGroup);

  // 3. Procedural Logarithmic Ammonite Fossil Core
  const fossilGroup = new THREE.Group();
  const ammonite = new THREE.Mesh(
    createAmmoniteGeometry(),
    new THREE.MeshPhysicalMaterial({
      color: 0x4ade80,
      emissive: 0x15803d,
      emissiveIntensity: 0.45,
      roughness: 0.16,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    })
  );
  fossilGroup.add(ammonite);
  group.add(fossilGroup);

  // 4. Orbiting Glossy Water Droplets & Prehistoric Fern Fronds
  const orbiters = [];
  const dropletGeo = createWaterDropletGeometry();
  const dropletMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.25,
    roughness: 0.03,
    transmission: 0.88,
    thickness: 0.4,
    ior: 1.33,
    clearcoat: 1.0,
  });

  const totalOrbiters = 8;
  for (let i = 0; i < totalOrbiters; i++) {
    const isFern = i % 2 === 0;
    const mesh = isFern ? createFernFrond() : new THREE.Mesh(dropletGeo, dropletMat);
    const angle = (i / totalOrbiters) * Math.PI * 2;
    const baseY = (i % 2 === 0 ? 1 : -1) * 0.34;

    mesh.position.set(Math.cos(angle) * 1.52, baseY, Math.sin(angle) * 1.52);
    if (isFern) {
      mesh.rotation.z = 0.25;
    }

    group.add(mesh);
    orbiters.push({ mesh, angle, baseY, isFern });
  }

  return {
    group,
    description:
      'Blending prehistoric natural history with early-2000s glossy optimism, Frutiger Paleo encases ancient ammonites, ferns, and earth tones inside translucent amber resin, crystal water droplets, and sunlit moss.',
    background: 'radial-gradient(circle at 50% 35%, #fef3c7 0%, #86efac 50%, #065f46 100%)',
    update(t, bounce, spring) {
      fossilGroup.rotation.y = t * 0.55;
      fossilGroup.rotation.x = Math.sin(t * 0.45) * 0.28;
      fossilGroup.position.y = Math.sin(t * 1.8) * 0.04 - bounce * 0.35;

      amberGroup.rotation.y = -t * 0.18;

      orbiters.forEach((item, idx) => {
        const a = item.angle + t * 0.48;
        item.mesh.position.x = Math.cos(a) * 1.52;
        item.mesh.position.z = Math.sin(a) * 1.52;
        item.mesh.position.y = item.baseY + Math.sin(t * 2 + idx) * 0.08;

        if (item.isFern) {
          item.mesh.rotation.y = -a + Math.PI / 2;
        } else {
          item.mesh.rotation.y = t * 1.2 + idx;
        }
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
