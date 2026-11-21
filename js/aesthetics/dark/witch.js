// js/aesthetics/dark/witch.js
import * as THREE from 'three';

export function createWitch() {
  const group = new THREE.Group();

  // Materials: Translucent Amethyst, Tarnished Brass, Obsidian Altar, Beeswax & Candle Flame
  const amethystMat = new THREE.MeshPhysicalMaterial({
    color: 0x9333ea,
    emissive: 0x6b21a8,
    emissiveIntensity: 0.4,
    transmission: 0.45,
    roughness: 0.14,
    thickness: 0.85,
    clearcoat: 1.0,
  });

  const brassRingMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.88,
    roughness: 0.22,
  });

  const obsidianMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.55,
    metalness: 0.35,
  });

  const waxMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    emissive: 0x78350f,
    emissiveIntensity: 0.18,
    roughness: 0.65,
  });

  const flameMat = new THREE.MeshBasicMaterial({
    color: 0xfde047,
  });

  // 1. Central Floating Amethyst Crystal Obelisk
  const crystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.48, 0),
    amethystMat
  );
  crystal.scale.set(0.75, 1.45, 0.75);
  crystal.position.y = 0.12;
  group.add(crystal);

  // 2. Celestial Brass Astrolabe Rings
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(0.88, 0.024, 12, 56),
    brassRingMat
  );
  ring1.position.y = 0.12;

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.04, 0.018, 12, 56),
    brassRingMat
  );
  ring2.position.y = 0.12;

  group.add(ring1, ring2);

  // 3. Obsidian Ritual Base & Three Flickering Taper Candles
  const altarDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 1.05, 0.08, 32),
    obsidianMat
  );
  altarDisc.position.y = -0.82;
  group.add(altarDisc);

  const brassTrim = new THREE.Mesh(
    new THREE.TorusGeometry(0.98, 0.015, 10, 48),
    brassRingMat
  );
  brassTrim.rotation.x = Math.PI / 2;
  brassTrim.position.y = -0.78;
  group.add(brassTrim);

  const candleConfigs = [
    { angle: Math.PI * 0.2, radius: 0.72, height: 0.42 },
    { angle: Math.PI * 0.85, radius: 0.75, height: 0.52 },
    { angle: Math.PI * 1.5, radius: 0.7, height: 0.36 },
  ];

  const flames = [];

  candleConfigs.forEach((cfg, idx) => {
    const candleGroup = new THREE.Group();
    const x = Math.cos(cfg.angle) * cfg.radius;
    const z = Math.sin(cfg.angle) * cfg.radius;

    // Brass candle holder saucer
    const holder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.11, 0.03, 16),
      brassRingMat
    );
    holder.position.y = -0.76;

    // Taper wax cylinder
    const wax = new THREE.Mesh(
      new THREE.CylinderGeometry(0.048, 0.055, cfg.height, 16),
      waxMat
    );
    wax.position.y = -0.76 + cfg.height / 2;

    // Teardrop flame
    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.035, 0.11, 12),
      flameMat
    );
    flame.position.y = -0.76 + cfg.height + 0.07;

    candleGroup.add(holder, wax, flame);
    candleGroup.position.set(x, 0, z);
    group.add(candleGroup);

    flames.push({ mesh: flame, baseY: flame.position.y, phase: idx * 2.1 });
  });

  return {
    group,
    description:
      'Rooted in occult symbolism, lunar cycles, and herbal folklore, Witch pairs midnight-violet mysticism with glowing amethyst crystals, brass celestial astrolabes, and flickering ritual candles.',
    background: 'radial-gradient(circle at 50% 30%, #581c87 0%, #1e1b4b 55%, #020617 100%)',
    update(t, bounce, spring) {
      // Levitating amethyst obelisk
      crystal.rotation.y = t * 0.65;
      crystal.position.y = 0.12 + Math.sin(t * 2.0) * 0.07;

      // Gyroscopic astrolabe rings
      ring1.rotation.x = t * 0.5;
      ring1.rotation.y = t * 0.3;
      ring2.rotation.y = -t * 0.45;
      ring2.rotation.z = t * 0.25;

      // Organic candle flame flicker
      flames.forEach((f) => {
        const flicker = 1 + Math.sin(t * 9.0 + f.phase) * 0.14 + Math.cos(t * 14.0 + f.phase) * 0.08;
        f.mesh.scale.set(1, flicker, 1);
        f.mesh.position.y = f.baseY + (flicker - 1) * 0.04;
      });

      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
