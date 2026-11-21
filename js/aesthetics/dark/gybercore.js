// js/aesthetics/dark/gybercore.js
import * as THREE from 'three';

export function createGybercore() {
  const group = new THREE.Group();

  // 1. Iridescent Liquid-Chrome Core (Hyper-reflective Y2K Cyber Relic)
  const chromeMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0e7ff,
    emissive: 0x4c1d95,
    emissiveIntensity: 0.45,
    metalness: 0.95,
    roughness: 0.06,
    iridescence: 1.0,
    iridescenceIOR: 1.8,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });

  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.52, 2),
    chromeMat
  );
  group.add(core);

  // 2. Electric Magenta & Cyan Interlocking Plasma Rings
  const magentaRingMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0xec4899,
    emissiveIntensity: 0.9,
    roughness: 0.15,
    metalness: 0.4,
  });

  const cyanRingMat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.9,
    roughness: 0.15,
    metalness: 0.4,
  });

  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(0.88, 0.026, 16, 80),
    magentaRingMat
  );
  ring1.rotation.set(Math.PI / 3, 0.25, 0);
  group.add(ring1);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.04, 0.022, 16, 80),
    cyanRingMat
  );
  ring2.rotation.set(-Math.PI / 3.5, -0.4, 0.3);
  group.add(ring2);

  // 3. Clean Hyper-Violet Vector Lattice Shell
  const shellGeo = new THREE.DodecahedronGeometry(1.26, 0);
  const shellEdges = new THREE.EdgesGeometry(shellGeo);
  const vectorShell = new THREE.LineSegments(
    shellEdges,
    new THREE.LineBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.55,
    })
  );
  group.add(vectorShell);

  // 4. Orbiting Neon Cyber-Sigil Diamonds (Magenta, Cyan, & Acid Lime)
  const prismColors = [0xec4899, 0x22d3ee, 0xa3e635];
  const prismGeo = new THREE.ConeGeometry(0.075, 0.24, 4);
  const prisms = [];
  const prismCount = 9;

  for (let i = 0; i < prismCount; i++) {
    const color = prismColors[i % prismColors.length];
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.85,
      roughness: 0.2,
    });

    const prism = new THREE.Mesh(prismGeo, mat);
    const angle = (i / prismCount) * Math.PI * 2;
    const radius = 1.38;
    const baseY = Math.sin(i * 1.8) * 0.35;

    prism.position.set(Math.cos(angle) * radius, baseY, Math.sin(angle) * radius);
    prism.rotation.z = Math.PI; // Point downward like cyber-glyph needles
    group.add(prism);

    prisms.push({ mesh: prism, angle, radius, baseY, speed: 0.75 });
  }

  return {
    group,
    description:
      'An evolved, maximalist offshoot of Cybercore that amplifies Y2K futurism with hyper-saturated neon gradients, liquid-chrome hardware, rave-inspired plasma rings, and high-energy digital surrealism.',
    background: 'radial-gradient(circle at 50% 35%, #3b0764 0%, #17082e 52%, #05020d 100%)',
    update(t, bounce, spring) {
      // Iridescent chrome core spins and pulses
      core.rotation.x = t * 0.55;
      core.rotation.y = t * 0.85;

      // High-energy dual gyroscopic plasma rings
      ring1.rotation.x = Math.PI / 3 + Math.sin(t * 0.9) * 0.35;
      ring1.rotation.y = t * 0.95;

      ring2.rotation.y = -t * 0.85;
      ring2.rotation.z = 0.3 + Math.cos(t * 0.75) * 0.35;

      // Outer dodecahedron vector lattice counter-rotation
      vectorShell.rotation.y = -t * 0.3;
      vectorShell.rotation.x = t * 0.2;

      // Orbiting neon cyber-sigil prisms
      prisms.forEach((p, idx) => {
        const a = p.angle + t * p.speed;
        p.mesh.position.x = Math.cos(a) * p.radius;
        p.mesh.position.z = Math.sin(a) * p.radius;
        p.mesh.position.y = p.baseY + Math.sin(t * 2.8 + idx) * 0.09;
        p.mesh.rotation.y = t * 2.2;
      });

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
