// js/aesthetics/vaporwave/pluggnb.js

import * as THREE from 'three';

export function createPluggnb() {
  const group = new THREE.Group();

  // 1. Unified Angelic R&B Heart & Chime Halo Assembly (Draggable / Arrow-Key Interactive)
  const pluggGroup = new THREE.Group();

  // Sculpted 3D Glossy Pastel-Pink Heart Core
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, -0.45);
  heartShape.bezierCurveTo(-0.55, -0.05, -0.78, 0.42, -0.38, 0.65);
  heartShape.bezierCurveTo(-0.15, 0.78, 0, 0.58, 0, 0.44);
  heartShape.bezierCurveTo(0, 0.58, 0.15, 0.78, 0.38, 0.65);
  heartShape.bezierCurveTo(0.78, 0.42, 0.55, -0.05, 0, -0.45);

  const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
    depth: 0.28,
    bevelEnabled: true,
    bevelSegments: 10,
    steps: 2,
    bevelSize: 0.12,
    bevelThickness: 0.12,
  });
  heartGeo.center();

  const dreamHeart = new THREE.Mesh(
    heartGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xf9a8d4,
      emissive: 0xec4899,
      emissiveIntensity: 0.45,
      roughness: 0.06,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    })
  );
  pluggGroup.add(dreamHeart);

  // Silky Sky-Blue R&B Synth Bell Halo Ring
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(1.32, 0.048, 16, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0x7dd3fc,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.65,
      roughness: 0.05,
      clearcoat: 1.0,
    })
  );
  halo.rotation.x = Math.PI / 2.55;
  pluggGroup.add(halo);

  // Inner Angelic Lavender-Gold Chime Ring
  const innerHalo = new THREE.Mesh(
    new THREE.TorusGeometry(1.06, 0.026, 14, 56),
    new THREE.MeshPhysicalMaterial({
      color: 0xfef08a,
      emissive: 0xeab308,
      emissiveIntensity: 0.55,
      roughness: 0.08,
      clearcoat: 1.0,
    })
  );
  innerHalo.rotation.x = -Math.PI / 2.8;
  pluggGroup.add(innerHalo);

  group.add(pluggGroup);

  // 2. Floating Glossy Pastel Chime Stars & Mini Dream Clouds
  const stars = [];
  const starMat = new THREE.MeshPhysicalMaterial({
    color: 0xfef08a,
    emissive: 0xfacc15,
    emissiveIntensity: 0.65,
    roughness: 0.08,
    clearcoat: 1.0,
  });

  for (let i = 0; i < 8; i++) {
    const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.13, 0), starMat);
    const a = (i / 8) * Math.PI * 2;
    s.position.set(Math.cos(a) * 1.54, Math.sin(i * 1.4) * 0.45, Math.sin(a) * 1.54);
    group.add(s);
    stars.push({ mesh: s, angle: a, baseY: s.position.y, phase: i * 0.85 });
  }

  // Soft Pastel Dream Clouds Flanking the Heart
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfbcfe8,
    emissiveIntensity: 0.25,
    roughness: 0.65,
    transparent: true,
    opacity: 0.88,
  });

  const clouds = [];
  [
    { x: -1.45, y: -0.58, z: 0.45, s: 0.72 },
    { x: 1.45, y: 0.62, z: -0.35, s: 0.68 },
  ].forEach(({ x, y, z, s }) => {
    const cGroup = new THREE.Group();
    [
      [0, 0, 0, 0.24],
      [-0.2, -0.04, 0.03, 0.18],
      [0.2, -0.04, -0.03, 0.19],
      [0.05, 0.12, 0.02, 0.17],
    ].forEach(([px, py, pz, r]) => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 14), cloudMat);
      puff.position.set(px, py, pz);
      cGroup.add(puff);
    });
    cGroup.position.set(x, y, z);
    cGroup.scale.setScalar(s);
    group.add(cGroup);
    clouds.push({ mesh: cGroup, baseY: y });
  });

  // 3. Angelic Pastel Pink, Sky-Blue & Warm Gold Studio Lighting
  const pinkLight = new THREE.PointLight(0xf472b6, 10, 11);
  pinkLight.position.set(-2.0, 1.8, 2.4);
  group.add(pinkLight);

  const skyLight = new THREE.PointLight(0x38bdf8, 10, 11);
  skyLight.position.set(2.0, -1.4, 2.4);
  group.add(skyLight);

  return {
    group,
    description:
      'Silky 90s and Y2K R&B chord progressions, angelic synth bells, and bouncy Zay-808 Plugg drums wrapped in dreamy pastel pink-and-sky-blue aesthetics.',
    background: 'radial-gradient(circle at 50% 30%, #fbcfe8 0%, #c084fc 50%, #1e1b4b 100%)',
    update(t, bounce, spring) {
      // Gentle Zay-808 sub-bass heartbeat pulse on the glossy heart
      const pluggBeat = Math.pow(Math.abs(Math.sin(t * 3.4)), 6);
      dreamHeart.scale.setScalar(1 + pluggBeat * 0.12);
      dreamHeart.rotation.y = Math.sin(t * 0.75) * 0.35;

      halo.rotation.z = t * 0.55;
      innerHalo.rotation.z = -t * 0.75;
      pluggGroup.position.y = Math.sin(t * 1.3) * 0.08 - bounce * 0.2;

      // Sparkling R&B chime stars orbiting the halo
      stars.forEach((st, idx) => {
        const a = st.angle + t * 0.6;
        st.mesh.position.x = Math.cos(a) * 1.54;
        st.mesh.position.z = Math.sin(a) * 1.54;
        st.mesh.position.y = st.baseY + Math.sin(t * 2.2 + idx) * 0.14 - bounce * 0.16;
        st.mesh.rotation.y = t * 1.8;
        st.mesh.scale.setScalar(0.85 + Math.sin(t * 4.5 + st.phase) * 0.22);
      });

      clouds.forEach((c, idx) => {
        c.mesh.position.y = c.baseY + Math.sin(t * 1.1 + idx * 1.8) * 0.09;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
