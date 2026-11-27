import * as THREE from 'three';

export function createFrutigerAurora() {
  const group = new THREE.Group();
  // const coreGroup = new THREE.Group();
  // group.add(coreGroup);

  // 1. Procedural Aurora Sky Reflection Map (for wet glass specular bands on the dew orb)
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 256;
  envCanvas.height = 128;
  const ctx = envCanvas.getContext('2d');
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 128);
  skyGrad.addColorStop(0.0, '#ecfdf5');
  skyGrad.addColorStop(0.3, '#6ee7b7');
  skyGrad.addColorStop(0.6, '#38bdf8');
  skyGrad.addColorStop(1.0, '#818cf8');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 256, 128);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(25, 16, 100, 14);
  ctx.fillRect(140, 24, 90, 12);

  const envTex = new THREE.CanvasTexture(envCanvas);
  envTex.mapping = THREE.EquirectangularReflectionMapping;
  envTex.colorSpace = THREE.SRGBColorSpace;

  // 0. Full-screen sky dome (aurora gradient sphere you can look around inside)
  const skyGeo = new THREE.SphereGeometry(60, 64, 32);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new THREE.Color('#818cf8') },
      midColor: { value: new THREE.Color('#38bdf8') },
      lowColor: { value: new THREE.Color('#6ee7b7') },
      horizonColor: { value: new THREE.Color('#ecfdf5') },
      time: { value: 0 },
    },
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 midColor;
      uniform vec3 lowColor;
      uniform vec3 horizonColor;
      uniform float time;
      varying vec3 vWorldPos;
      void main() {
        float h = normalize(vWorldPos).y; // -1..1
        // aurora bands sweeping across the sky
        float band = sin(vWorldPos.x * 0.06 + time * 0.15)
                   * cos(vWorldPos.z * 0.05 - time * 0.1) * 0.5 + 0.5;
        float aurora = smoothstep(0.05, 0.35, h) * (1.0 - smoothstep(0.75, 1.0, h));
        vec3 sky = mix(horizonColor, lowColor, smoothstep(-0.05, 0.15, h));
        sky = mix(sky, midColor, smoothstep(0.15, 0.45, h));
        sky = mix(sky, topColor, smoothstep(0.45, 0.9, h));
        vec3 glow = mix(vec3(0.35, 0.95, 0.7), vec3(0.55, 0.85, 1.0), band);
        sky += glow * aurora * 0.35 * band;
        gl_FragColor = vec4(sky, 1.0);
      }
    `,
  });
  const skyDome = new THREE.Mesh(skyGeo, skyMat);
  skyDome.renderOrder = -1;
  group.add(skyDome);

  // 2. Central Refractive Iridescent Dew Orb + Inner Aurora Core
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.66, 48, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.03,
      metalness: 0.0,
      transmission: 0.9,
      thickness: 1.1,
      ior: 1.46,
      iridescence: 1.0,
      iridescenceIOR: 1.38,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      envMap: envTex,
      envMapIntensity: 1.4,
    })
  );
  // coreGroup.add(orb);

  const innerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xa7f3d0,
      transparent: true,
      opacity: 0.85,
    })
  );
  // coreGroup.add(innerGlow);

  const haloRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.86, 0.018, 16, 72),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0x6ee7b7,
      emissiveIntensity: 0.35,
      roughness: 0.05,
      clearcoat: 1.0,
      envMap: envTex,
    })
  );
  haloRing.rotation.set(Math.PI / 2.6, 0.25, 0);
  // coreGroup.add(haloRing);

  // 3. Flowing Translucent Silk Aurora Curtains — now much wider, wrapping the sky
const ribbonSpecs = [
  // Only keep one main band, placed far away in the sky on one side
  { 
    color: 0x34d399, 
    emissive: 0x10b981, 
    yOffset: 6.0,   // raise it a bit so it hangs in the sky
    zOffset: -18.0, // push it farther away
    xOffset: -6.0,  // shift to the left, forming a "one-sided aurora"
    width: 2.2,     // narrow the ribbon itself
    height: 6.0,    // keep some vertical presence
    phase: 0.0 
  },
  // Optional: a very faint secondary band, as a layer
  { 
    color: 0x22d3ee, 
    emissive: 0x06b6d4, 
    yOffset: 7.5, 
    zOffset: -22.0, 
    xOffset: -4.5, 
    width: 1.6, 
    height: 5.0, 
    phase: 1.4 
  },
];

  const ribbons = ribbonSpecs.map((spec) => {
    const segX = 128;
    const segY = 24;
    const geom = new THREE.PlaneGeometry(spec.width * 6.0, spec.height, segX, segY);
    const pos = geom.attributes.position;
    const baseCoords = new Float32Array(pos.array.length);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const nx = x / (spec.width * 2.0);

      const waveY = Math.sin(nx * Math.PI * 1.35 + spec.phase) * 0.9;
      const waveZ = Math.cos(nx * Math.PI * 1.15 + spec.phase) * 0.9;

      pos.setXYZ(i, x, y + waveY, waveZ);
    }
    pos.needsUpdate = true;
    baseCoords.set(pos.array);
    geom.computeVertexNormals();

    const mat = new THREE.MeshPhysicalMaterial({
      color: spec.color,
      emissive: spec.emissive,
      emissiveIntensity: 0.35,
      roughness: 0.14,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
      depthWrite: false,
      envMap: envTex,
    });

    const mesh = new THREE.Mesh(geom, mat);
   mesh.position.set(spec.xOffset ?? 0, spec.yOffset, spec.zOffset);
    mesh.rotation.z = (spec.phase - 1.4) * 0.08;
    group.add(mesh);

    return { mesh, geom, baseCoords, spec };
  });

  // 4. Drifting Bioluminescent Bokeh Motes — spread across the sky
  const moteColors = [0xa7f3d0, 0x67e8f9, 0xe9d5ff, 0xffffff];
  const motes = Array.from({ length: 60 }, (_, i) => {
    const hex = moteColors[i % moteColors.length];
    const mote = new THREE.Mesh(
      new THREE.SphereGeometry(0.08 + (i % 3) * 0.04, 10, 10),
      new THREE.MeshBasicMaterial({
        color: hex,
        transparent: true,
        opacity: 0.75,
      })
    );

    const x = (Math.random() - 0.5) * 28;
    const y = Math.random() * 10 - 0.5;
    const z = -Math.random() * 22 - 2;
    mote.position.set(x, y, z);
    group.add(mote);

    return { mesh: mote, baseX: x, baseY: y, baseZ: z, phase: i * 0.65 };
  });

  // 5. Frutiger Aero ground: glossy reflective disc with soft radial tint
  const groundCanvas = document.createElement('canvas');
  groundCanvas.width = 512;
  groundCanvas.height = 512;
  const gctx = groundCanvas.getContext('2d');
  const gGrad = gctx.createRadialGradient(256, 256, 40, 256, 256, 256);
  gGrad.addColorStop(0.0, '#e0f7ef');
  gGrad.addColorStop(0.4, '#a7f3d0');
  gGrad.addColorStop(0.75, '#22d3ee');
  gGrad.addColorStop(1.0, '#0f172a');
  gctx.fillStyle = gGrad;
  gctx.fillRect(0, 0, 512, 512);

  // subtle glass streaks on the ground
  gctx.strokeStyle = 'rgba(255,255,255,0.35)';
  gctx.lineWidth = 3;
  for (let i = 0; i < 14; i++) {
    gctx.beginPath();
    gctx.moveTo(Math.random() * 512, 0);
    gctx.bezierCurveTo(
      Math.random() * 512, 170,
      Math.random() * 512, 340,
      Math.random() * 512, 512
    );
    gctx.stroke();
  }
  const groundTex = new THREE.CanvasTexture(groundCanvas);
  groundTex.colorSpace = THREE.SRGBColorSpace;

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(28, 96),
    new THREE.MeshPhysicalMaterial({
      map: groundTex,
      roughness: 0.18,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMap: envTex,
      envMapIntensity: 1.2,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.0;
  group.add(ground);

  return {
    group,
    description:
      'Frutiger Aurora wraps the viewer in a full-screen aurora sky with glossy emerald, cyan, and twilight-violet silk curtains drifting over an iridescent dew sphere and a wet-glass aero ground.',

    // Neutral so the scene doesn't fight the sky dome
    background: 'radial-gradient(circle at 50% 30%, #ecfdf5 0%, #6ee7b7 45%, #0284c7 100%)',

    // Optional helpers for the host app
    // Put your camera at roughly (0, 1.5, 12) and enable OrbitControls with target (0, 2, 0).
    cameraHints: {
      position: [0, 1.5, 12],
      target: [0, 2, 0],
    },

    update(t, bounce, spring) {
      // coreGroup.position.y = Math.sin(t * 1.6) * 0.05 - bounce * 0.35;
      // coreGroup.rotation.y = t * 0.25;

      orb.scale.setScalar(1 + spring * 0.32);
      innerGlow.scale.setScalar(1 + Math.sin(t * 2.6) * 0.12);
      haloRing.rotation.z = t * 0.4;

      // animate sky dome
      skyMat.uniforms.time.value = t;

      ribbons.forEach(({ mesh, geom, baseCoords, spec }, idx) => {
        const pos = geom.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const ix = i * 3;
          const bx = baseCoords[ix];
          const by = baseCoords[ix + 1];
          const bz = baseCoords[ix + 2];

          const rippleY = Math.sin(bx * 0.4 + t * 1.0 + spec.phase) * 0.35;
          const rippleZ = Math.cos(bx * 0.35 + t * 0.85 + spec.phase) * 0.4;

          pos.setXYZ(i, bx, by + rippleY, bz + rippleZ);
        }
        pos.needsUpdate = true;

        mesh.position.y = spec.yOffset + Math.sin(t * 1.3 + idx) * 0.25 + bounce * 0.2;
        mesh.rotation.y = Math.sin(t * 0.7 + idx * 0.9) * 0.12;
        mesh.rotation.x = Math.sin(t * 0.5 + idx * 1.3) * 0.06;
      });

      motes.forEach((m) => {
        m.mesh.position.y = m.baseY + Math.sin(t * 1.5 + m.phase) * 0.4;
        m.mesh.position.x = m.baseX + Math.cos(t * 1.1 + m.phase) * 0.35;
        m.mesh.position.z = m.baseZ + Math.sin(t * 0.9 + m.phase) * 0.25;
        m.mesh.scale.setScalar(0.85 + Math.sin(t * 3.0 + m.phase) * 0.25);
      });

      group.scale.setScalar(1 + spring * 0.22);
    },
  };
}