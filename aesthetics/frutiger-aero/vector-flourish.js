// js/aesthetics/frutiger-aero/vector-flourish.js
import * as THREE from 'three';

export function createVectorFlourish() {
  const group = new THREE.Group();

  // 1. Glossy Eco-Office Sky-Blue Globe Core
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(0.74, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      emissive: 0x0369a1,
      emissiveIntensity: 0.3,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    })
  );
  group.add(globe);

  // 2. Clean White Vector Latitude Rings around the Globe
  const vectorRingMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.55,
  });

  const eqRing = new THREE.Mesh(new THREE.TorusGeometry(0.84, 0.012, 8, 64), vectorRingMat);
  eqRing.rotation.x = Math.PI / 2.2;
  group.add(eqRing);

  const tiltRing = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.01, 8, 64), vectorRingMat);
  tiltRing.rotation.set(Math.PI / 3, 0.45, 0);
  group.add(tiltRing);

  // 3. Sweeping Lime-Green Vector Flourish Swoosh Ribbon
  const swooshPoints = [];
  for (let i = 0; i <= 48; i++) {
    const u = i / 48;
    const angle = u * Math.PI * 2.4;
    const r = 1.05 + Math.sin(u * Math.PI) * 0.32;
    const y = (u - 0.5) * 1.15;
    swooshPoints.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
  }
  const swooshCurve = new THREE.CatmullRomCurve3(swooshPoints);
  const flourish = new THREE.Mesh(
    new THREE.TubeGeometry(swooshCurve, 96, 0.055, 12, false),
    new THREE.MeshPhysicalMaterial({
      color: 0x84cc16,
      emissive: 0x4d7c0f,
      emissiveIntensity: 0.35,
      roughness: 0.06,
      clearcoat: 1.0,
    })
  );
  group.add(flourish);

  // 4. Floating Glossy Vector Leaves & Dew Drops
  const leafMat = new THREE.MeshPhysicalMaterial({
    color: 0x4ade80,
    emissive: 0x16a34a,
    emissiveIntensity: 0.3,
    roughness: 0.06,
    clearcoat: 1.0,
  });

  const dewMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.35,
    roughness: 0.03,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.88,
  });

  const orbiters = [];
  for (let i = 0; i < 8; i++) {
    const isLeaf = i % 2 === 0;
    const mesh = isLeaf
      ? new THREE.Mesh(new THREE.OctahedronGeometry(0.15, 0), leafMat)
      : new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 20), dewMat);

    if (isLeaf) {
      mesh.scale.set(0.6, 1.55, 0.22);
    }

    const a = (i / 8) * Math.PI * 2;
    const r = 1.52;
    const baseY = Math.sin(i * 1.4) * 0.42;
    mesh.position.set(Math.cos(a) * r, baseY, Math.sin(a) * r);
    group.add(mesh);
    orbiters.push({ mesh, angle: a, baseY, isLeaf });
  }

  return {
    group,
    description:
      'Defined by mid-2000s stock vector graphics, corporate eco-initiatives, and Adobe Illustrator pen-tool curves, Vector Flourish pairs glossy blue globes with sweeping lime-green vine ribbons, crisp vector rings, and floating dew-kissed leaves.',
    background: 'radial-gradient(circle at 50% 25%, #ffffff 0%, #dcfce7 50%, #38bdf8 100%)',
    update(t, bounce, spring) {
      globe.rotation.y = t * 0.45;
      eqRing.rotation.z = t * 0.3;
      tiltRing.rotation.y = -t * 0.4;

      flourish.rotation.y = -t * 0.5;
      flourish.rotation.x = Math.sin(t * 0.4) * 0.2;

      orbiters.forEach((item, idx) => {
        const a = item.angle + t * 0.55;
        item.mesh.position.x = Math.cos(a) * 1.52;
        item.mesh.position.z = Math.sin(a) * 1.52;
        item.mesh.position.y = item.baseY + Math.sin(t * 2 + idx) * 0.13;
        if (item.isLeaf) {
          item.mesh.rotation.z = t * 1.1 + idx;
        }
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
