import * as THREE from 'three';

export function createBrightTertiaries() {
  const group = new THREE.Group();
  const coreGroup = new THREE.Group();
  group.add(coreGroup);

  // 1. Procedural Glossy Studio Reflection Map (gives wet candy-shell highlights)
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 256;
  envCanvas.height = 128;
  const ctx = envCanvas.getContext('2d');
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 128);
  skyGrad.addColorStop(0.0, '#ffffff');
  skyGrad.addColorStop(0.35, '#e0f2fe');
  skyGrad.addColorStop(0.55, '#ffffff');
  skyGrad.addColorStop(1.0, '#fef08a');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 256, 128);

  // Crisp studio softbox strips for high-gloss specular bands
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fillRect(20, 14, 90, 18);
  ctx.fillRect(145, 22, 85, 14);
  ctx.fillRect(50, 88, 150, 10);

  const envTex = new THREE.CanvasTexture(envCanvas);
  envTex.mapping = THREE.EquirectangularReflectionMapping;
  envTex.colorSpace = THREE.SRGBColorSpace;

  // 2. Four-Color Tertiary Palette (Chartreuse-Lime, Coral-Magenta, Aqua-Turquoise, Marigold-Amber)
  const palette = [
    { color: 0xa3e635, core: 0xecfccb, pos: [-0.66, 0.58, 0.16] },  // Lime-Chartreuse
    { color: 0xf43f5e, core: 0xffe4e6, pos: [0.66, 0.58, -0.16] },  // Coral-Magenta
    { color: 0x06b6d4, core: 0xcffafe, pos: [-0.66, -0.58, -0.16] }, // Aqua-Turquoise
    { color: 0xf59e0b, core: 0xfef3c7, pos: [0.66, -0.58, 0.16] },  // Marigold-Amber
  ];

  const orbs = palette.map((item, idx) => {
    const orbHolder = new THREE.Group();
    orbHolder.position.set(...item.pos);

    // Outer translucent candy-gel shell
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 36, 36),
      new THREE.MeshPhysicalMaterial({
        color: item.color,
        emissive: item.color,
        emissiveIntensity: 0.24,
        roughness: 0.04,
        metalness: 0.02,
        transmission: 0.55,
        thickness: 0.8,
        ior: 1.48,
        clearcoat: 1.0,
        clearcoatRoughness: 0.01,
        envMap: envTex,
        envMapIntensity: 1.35,
      })
    );
    orbHolder.add(shell);

    // Inner glowing pigment nucleus (creates depth inside each orb)
    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 24, 24),
      new THREE.MeshBasicMaterial({
        color: item.core,
      })
    );
    orbHolder.add(nucleus);

    // Glossy white Aero bezel ring tilted around each orb
    const bezel = new THREE.Mesh(
      new THREE.TorusGeometry(0.51, 0.022, 12, 48),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.05,
        clearcoat: 1.0,
        envMap: envTex,
      })
    );
    bezel.rotation.set(idx % 2 === 0 ? 0.65 : -0.65, idx < 2 ? 0.5 : -0.5, 0);
    orbHolder.add(bezel);

    // Glossy white connector spoke linking each orb to the central hub
    const spokeDir = new THREE.Vector3(...item.pos);
    const spokeLen = spokeDir.length();
    const spoke = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.024, spokeLen, 12),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.06,
        clearcoat: 1.0,
        envMap: envTex,
      })
    );
    spoke.position.copy(spokeDir).multiplyScalar(0.5);
    spoke.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      spokeDir.clone().normalize()
    );
    coreGroup.add(spoke);

    coreGroup.add(orbHolder);
    return {
      holder: orbHolder,
      nucleus,
      bezel,
      spoke,
      basePos: new THREE.Vector3(...item.pos),
      phase: idx * (Math.PI / 2),
    };
  });

  // 3. Central Glossy White Hub Ring + Prismatic Core
  const hubRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.92, 0.065, 20, 72),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      envMap: envTex,
      envMapIntensity: 1.4,
    })
  );
  coreGroup.add(hubRing);

  const centerPrism = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.24, 1),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xe0f2fe,
      emissiveIntensity: 0.35,
      roughness: 0.02,
      transmission: 0.85,
      ior: 1.55,
      iridescence: 1.0,
      iridescenceIOR: 1.35,
      clearcoat: 1.0,
      envMap: envTex,
    })
  );
  coreGroup.add(centerPrism);

  // 4. Orbiting Chromatic Gel Droplets (micro-accents in all 4 tertiary hues)
  const droplets = Array.from({ length: 12 }, (_, i) => {
    const entry = palette[i % palette.length];
    const drop = new THREE.Mesh(
      new THREE.SphereGeometry(0.065 + (i % 3) * 0.022, 16, 16),
      new THREE.MeshPhysicalMaterial({
        color: entry.color,
        emissive: entry.color,
        emissiveIntensity: 0.3,
        roughness: 0.03,
        clearcoat: 1.0,
        envMap: envTex,
      })
    );
    const orbitR = 1.18 + (i % 3) * 0.16;
    const angle = (i / 12) * Math.PI * 2;
    const baseY = ((i % 5) - 2) * 0.24;
    drop.position.set(Math.cos(angle) * orbitR, baseY, Math.sin(angle) * orbitR);
    group.add(drop);

    return { mesh: drop, orbitR, angle, baseY, speed: 0.35 + (i % 3) * 0.12, phase: i * 0.7 };
  });

  return {
    group,
    description:
      'A hyper-saturated celebration of Web 2.0 color theory, Bright Tertiaries pairs translucent lime, coral-magenta, aqua-teal, and marigold gel orbs with glossy white hardware rings and floating chromatic droplets.',
    background: 'radial-gradient(circle at 50% 30%, #fef9c3 0%, #bae6fd 50%, #fbcfe8 100%)',
    update(t, bounce, spring) {
      coreGroup.rotation.y = Math.sin(t * 0.5) * 0.38;
      coreGroup.position.y = Math.sin(t * 1.9) * 0.05 - bounce * 0.4;

      hubRing.rotation.z = t * 0.55;
      centerPrism.rotation.y = -t * 0.9;
      centerPrism.rotation.x = t * 0.6;
      centerPrism.scale.setScalar(1 + Math.sin(t * 3.0) * 0.08);

      orbs.forEach((o) => {
        const floatY = Math.sin(t * 2.2 + o.phase) * 0.09;
        const floatZ = Math.cos(t * 1.8 + o.phase) * 0.11;

        o.holder.position.set(o.basePos.x, o.basePos.y + floatY, o.basePos.z + floatZ);
        o.bezel.rotation.z = t * 0.8 + o.phase;
        o.nucleus.scale.setScalar(1 + Math.sin(t * 2.8 + o.phase) * 0.1);

        // Keep white connector spokes locked onto each floating orb
        const currentPos = o.holder.position;
        o.spoke.position.copy(currentPos).multiplyScalar(0.5);
        o.spoke.scale.y = currentPos.length() / o.basePos.length();
        o.spoke.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          currentPos.clone().normalize()
        );
      });

      droplets.forEach((d) => {
        const a = d.angle + t * d.speed;
        d.mesh.position.x = Math.cos(a) * d.orbitR;
        d.mesh.position.z = Math.sin(a) * d.orbitR;
        d.mesh.position.y = d.baseY + Math.sin(t * 2.1 + d.phase) * 0.12;
      });

      group.scale.setScalar(1 + spring * 0.26);
    },
  };
}
