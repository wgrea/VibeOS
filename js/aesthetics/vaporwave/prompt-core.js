import * as THREE from 'three';

export function createPromptCore() {
  const group = new THREE.Group();

  // Surreal Morphing Latent-Space Torus Knot
  const latentBlob = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.75, 0.24, 96, 20, 3, 5),
    new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.55,
      roughness: 0.12,
      metalness: 0.65,
      clearcoat: 1.0,
    })
  );
  group.add(latentBlob);

  // Brass Jazz-Saxophone & Glitch Wireframe Cage
  const jazzCage = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.32, 0),
    new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    })
  );
  group.add(jazzCage);

  // Orbiting Uncanny Token Cubes
  const tokens = [];
  const tokenColors = [0xec4899, 0x22d3ee, 0xfbbf24, 0xa855f7];

  for (let i = 0; i < 8; i++) {
    const tk = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.18, 0.18),
      new THREE.MeshStandardMaterial({
        color: tokenColors[i % tokenColors.length],
        emissive: tokenColors[i % tokenColors.length],
        emissiveIntensity: 0.6,
      })
    );
    const a = (i / 8) * Math.PI * 2;
    tk.position.set(Math.cos(a) * 1.52, (i % 2 === 0 ? 1 : -1) * 0.38, Math.sin(a) * 1.52);
    group.add(tk);
    tokens.push({ mesh: tk, angle: a });
  }

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #78350f 0%, #4c1d95 55%, #090d16 100%)',
    update(t, bounce, spring) {
      latentBlob.rotation.x = t * 0.75;
      latentBlob.rotation.y = t * 1.05;

      jazzCage.rotation.y = -t * 0.45;
      jazzCage.rotation.z = t * 0.35;

      tokens.forEach((tk, idx) => {
        const a = tk.angle + t * 0.95;
        tk.mesh.position.x = Math.cos(a) * 1.52;
        tk.mesh.position.z = Math.sin(a) * 1.52;
        tk.mesh.rotation.x = t * 2 + idx;
        tk.mesh.rotation.y = -t * 1.7;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
