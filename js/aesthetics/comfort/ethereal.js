// js/aesthetics/comfort/ethereal.js
import * as THREE from 'three';

export function createEthereal() {
  const group = new THREE.Group();

  const pearlMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    emissive: 0xe0e7ff,
    emissiveIntensity: 0.35,
    roughness: 0.06,
    metalness: 0.1,
    clearcoat: 1.0,
    iridescence: 1.0,
    iridescenceIOR: 1.4,
  });

  const haloMat = new THREE.MeshPhysicalMaterial({
    color: 0xfef08a,
    emissive: 0xfde047,
    emissiveIntensity: 0.55,
    roughness: 0.1,
    metalness: 0.4,
    clearcoat: 1.0,
  });

  const gossamerMat = new THREE.MeshPhysicalMaterial({
    color: 0xe9d5ff,
    emissive: 0xc084fc,
    emissiveIntensity: 0.25,
    roughness: 0.15,
    transparent: true,
    opacity: 0.65,
    clearcoat: 1.0,
  });

  // 1. Iridescent Pearl Core
  const pearlCore = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 32), pearlMat);
  group.add(pearlCore);

  // 2. Floating Angelic Crown Halo
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.038, 16, 64), haloMat);
  halo.rotation.x = Math.PI / 2;
  halo.position.y = 0.78;
  group.add(halo);

  // 3. Intersecting Celestial Gossamer Rings
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.022, 16, 64), gossamerMat);
  ring1.rotation.set(0.65, 0.3, 0);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.018, 16, 64), haloMat);
  ring2.rotation.set(-0.55, -0.4, 0.25);

  group.add(ring1, ring2);

  // 4. Stylized Translucent Angelic Wing Blades
  const wingGeo = new THREE.SphereGeometry(0.45, 18, 18);
  wingGeo.scale(1.45, 0.38, 0.08);

  const leftWing = new THREE.Mesh(wingGeo, pearlMat);
  leftWing.position.set(-0.78, 0.12, -0.15);
  leftWing.rotation.set(0.15, 0.25, 0.42);

  const rightWing = new THREE.Mesh(wingGeo, pearlMat);
  rightWing.position.set(0.78, 0.12, -0.15);
  rightWing.rotation.set(0.15, -0.25, -0.42);

  group.add(leftWing, rightWing);

  // 5. Orbiting Celestial Light Motes
  const moteMat = new THREE.MeshBasicMaterial({ color: 0xfef9c3 });
  const motes = [];
  for (let i = 0; i < 10; i++) {
    const mote = new THREE.Mesh(new THREE.OctahedronGeometry(0.04, 0), moteMat);
    const a = (i / 10) * Math.PI * 2;
    const r = 1.28;
    mote.position.set(Math.cos(a) * r, ((i % 3) - 1) * 0.35, Math.sin(a) * r);
    group.add(mote);
    motes.push({ mesh: mote, angle: a, r, baseY: mote.position.y, phase: i * 0.7 });
  }

  return {
    group,
    description:
      'Defined by celestial stillness, pearlescent light, and weightless grace, Ethereal combines golden halos, iridescent spheres, gossamer orbital rings, and soft angelic silhouettes.',
    background: 'radial-gradient(circle at 50% 25%, #fdf4ff 0%, #e0e7ff 50%, #c7d2fe 100%)',
    update(t, bounce, spring) {
      pearlCore.position.y = Math.sin(t * 1.4) * 0.06;

      halo.position.y = 0.78 + Math.sin(t * 1.4 + 0.5) * 0.08;
      halo.rotation.z = t * 0.6;

      ring1.rotation.z = t * 0.35;
      ring1.rotation.x = 0.65 + Math.sin(t * 0.9) * 0.12;

      ring2.rotation.z = -t * 0.28;
      ring2.rotation.y = -0.4 + Math.cos(t * 0.8) * 0.12;

      // Gentle wing breath
      const flap = Math.sin(t * 1.8) * 0.12;
      leftWing.rotation.z = 0.42 + flap;
      rightWing.rotation.z = -0.42 - flap;

      motes.forEach((m) => {
        const a = m.angle + t * 0.32;
        m.mesh.position.x = Math.cos(a) * m.r;
        m.mesh.position.z = Math.sin(a) * m.r;
        m.mesh.position.y = m.baseY + Math.sin(t * 1.6 + m.phase) * 0.1;
        m.mesh.rotation.y = t * 1.5;
      });

      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
