import * as THREE from 'three';

export function createVaportrap() {
  const group = new THREE.Group();

  // Heavy Metallic Chrome 808 Sub-Speaker Cube
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 1.3, 1.3),
    new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
    })
  );
  group.add(box);

  // Neon Magenta & Cyan Bass Woofer Cone
  const woofer = new THREE.Mesh(
    new THREE.TorusGeometry(0.45, 0.08, 16, 48),
    new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 1.2,
    })
  );
  woofer.position.z = 0.66;
  group.add(woofer);

  // Floating Trap Hi-Hat / Synth Pyramids
  const pyramids = [];
  const pyrMat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.8,
    metalness: 0.6,
    roughness: 0.2,
  });

  for (let i = 0; i < 4; i++) {
    const pyr = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.38, 4), pyrMat);
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    pyr.position.set(Math.cos(a) * 1.45, 0, Math.sin(a) * 1.45);
    group.add(pyr);
    pyramids.push({ mesh: pyr, angle: a });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #4c1d95 0%, #1e1b4b 55%, #090d16 100%)',
    update(t, bounce, spring) {
      // Rhythmic 808 bass pulse
      const beat = Math.pow(Math.abs(Math.sin(t * 4.2)), 6);
      const pulse = 1 + beat * 0.22;

      woofer.scale.set(pulse, pulse, 1);
      box.rotation.y = t * 0.5;
      box.rotation.x = Math.sin(t * 0.7) * 0.2;

      pyramids.forEach((p, idx) => {
        const a = p.angle + t * 0.9;
        p.mesh.position.x = Math.cos(a) * 1.45;
        p.mesh.position.z = Math.sin(a) * 1.45;
        p.mesh.position.y = Math.sin(t * 4.2 + idx) * 0.25;
        p.mesh.rotation.y = -t * 1.8;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
