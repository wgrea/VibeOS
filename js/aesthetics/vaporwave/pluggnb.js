import * as THREE from 'three';

export function createPluggnb() {
  const group = new THREE.Group();

  // Lush Pastel-Pink & Sky-Blue Glossy Heart/Cloud Sphere
  const dreamCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.88, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0xf9a8d4,
      emissive: 0xec4899,
      emissiveIntensity: 0.45,
      roughness: 0.06,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.9,
    })
  );
  group.add(dreamCore);

  // Silky R&B Synth Bell Halo Ring
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(1.32, 0.055, 16, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0x7dd3fc,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.65,
      roughness: 0.05,
      clearcoat: 1.0,
    })
  );
  halo.rotation.x = Math.PI / 2.6;
  group.add(halo);

  // Floating Glossy Pastel Chime Stars
  const stars = [];
  const starMat = new THREE.MeshPhysicalMaterial({
    color: 0xfef08a,
    emissive: 0xfacc15,
    emissiveIntensity: 0.55,
    roughness: 0.08,
    clearcoat: 1.0,
  });

  for (let i = 0; i < 8; i++) {
    const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), starMat);
    const a = (i / 8) * Math.PI * 2;
    s.position.set(Math.cos(a) * 1.52, Math.sin(i * 1.4) * 0.45, Math.sin(a) * 1.52);
    group.add(s);
    stars.push({ mesh: s, angle: a, baseY: s.position.y });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #fbcfe8 0%, #c084fc 50%, #1e1b4b 100%)',
    update(t, bounce, spring) {
      dreamCore.rotation.y = t * 0.45;
      halo.rotation.z = t * 0.55;

      stars.forEach((st, idx) => {
        const a = st.angle + t * 0.6;
        st.mesh.position.x = Math.cos(a) * 1.52;
        st.mesh.position.z = Math.sin(a) * 1.52;
        st.mesh.position.y = st.baseY + Math.sin(t * 2.2 + idx) * 0.14;
        st.mesh.rotation.y = t * 1.6;
      });

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
