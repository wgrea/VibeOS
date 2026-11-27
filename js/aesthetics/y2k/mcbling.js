// js/aesthetics/y2k/mcbling.js
import * as THREE from 'three';

// Procedural pink-and-gold "bling" reflection map so the metal reads as
// polished gold instead of near-black (metals need something to reflect).
function makeBlingEnvMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 256, 128);
  grad.addColorStop(0.0, '#ffe9b8'); // champagne highlight
  grad.addColorStop(0.3, '#ff3aa8'); // hot pink
  grad.addColorStop(0.55, '#f4c542'); // gold
  grad.addColorStop(0.8, '#ffb6d9'); // baby pink
  grad.addColorStop(1.0, '#7a1f4d'); // deep magenta shadow
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);

  // Sparkle streaks — the "bling" glints
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 128;
    const r = 2 + Math.random() * 5;
    const g2 = ctx.createRadialGradient(x, y, 0, x, y, r);
    g2.addColorStop(0, 'rgba(255,255,255,0.9)');
    g2.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  return tex;
}

export function createMcBling() {
  const group = new THREE.Group();
  const envMap = makeBlingEnvMap();

  // --- Materials ---
  const goldMat = new THREE.MeshPhysicalMaterial({
    color: 0xf4c542,
    metalness: 0.95,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMap,
    envMapIntensity: 1.6,
  });

  const pinkMat = new THREE.MeshPhysicalMaterial({
    color: 0xff3aa8,
    metalness: 0.3,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    envMap,
    envMapIntensity: 1.2,
  });

  const screenMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a0d2e,
    emissive: 0x6b21a8,
    emissiveIntensity: 0.35,
    metalness: 0.1,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    envMap,
    envMapIntensity: 0.9,
  });

  const studMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    envMap,
    envMapIntensity: 2.0,
  });

  // --- 1. Velour cushion (soft pink, dimpled) ---
  const cushion = new THREE.Mesh(
    new THREE.SphereGeometry(1.6, 48, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0xff7ac1,
      roughness: 0.92,
      metalness: 0.0,
      clearcoat: 0.0,
      sheen: 1.0,
      sheenColor: new THREE.Color(0xffc7e3),
      sheenRoughness: 0.7,
      envMap,
      envMapIntensity: 0.3,
    })
  );
  cushion.scale.set(1.0, 0.28, 1.0); // flattened dome = cushion, not a ball
  cushion.position.y = -0.35;
  group.add(cushion);

  // Cushion rim — the velour's edge highlight (a thin torus around the dome)
  const cushionRim = new THREE.Mesh(
    new THREE.TorusGeometry(1.58, 0.04, 12, 64),
    new THREE.MeshStandardMaterial({
      color: 0xffb6d9,
      emissive: 0xff3aa8,
      emissiveIntensity: 0.25,
      roughness: 0.8,
    })
  );
  cushionRim.rotation.x = Math.PI / 2;
  cushionRim.position.y = -0.35;
  group.add(cushionRim);

  // --- 2. Clamshell flip-phone (two halves + hinge) ---
  const phone = new THREE.Group();

  // Lower half (keypad side)
  const lowerHalf = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.16, 1.55),
    goldMat
  );
  lowerHalf.position.y = 0;
  phone.add(lowerHalf);

  // Keypad — a slightly inset dark panel with a 3×4 grid of tiny pink dots
  const keypad = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.02, 1.15),
    new THREE.MeshStandardMaterial({ color: 0x2a0a1a, roughness: 0.4, metalness: 0.2 })
  );
  keypad.position.set(0, 0.09, 0.08);
  phone.add(keypad);

  const keyGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.02, 8);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      const key = new THREE.Mesh(keyGeo, pinkMat);
      key.rotation.x = Math.PI / 2;
      key.position.set(-0.22 + c * 0.22, 0.1, -0.38 + r * 0.26);
      phone.add(key);
    }
  }

  // Upper half (screen side) — hinged open ~110°
  const upperHalf = new THREE.Group();
  upperHalf.position.set(0, 0.08, -0.75); // hinge at the back edge
  upperHalf.rotation.x = -Math.PI * 0.6;  // clamshell opened past 90°

  const upperBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.14, 1.4),
    goldMat
  );
  upperBody.position.z = -0.7;
  upperHalf.add(upperBody);

  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.02, 0.95),
    screenMat
  );
  screen.position.set(0, -0.08, -0.7);
  upperHalf.add(screen);

  phone.add(upperHalf);

  // Hinge — a visible gold barrel between the halves
  const hinge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 0.98, 16),
    goldMat
  );
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, 0.05, -0.75);
  phone.add(hinge);

  // Tiny antenna nub (the 2004 tell)
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.22, 8),
    goldMat
  );
  antenna.position.set(0.32, 0.06, 1.05);
  phone.add(antenna);

  // --- 3. Rhinestone studs (deterministic grid over the lower half's face) ---
  const studGeo = new THREE.SphereGeometry(0.035, 12, 12);
  const studs = [];
  const COLS = 5;
  const ROWS = 7;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      // Skip studs that would land on the keypad
      const u = (c / (COLS - 1)) * 2 - 1; // -1..1
      const v = (r / (ROWS - 1)) * 2 - 1;
      if (Math.abs(u) < 0.62 && Math.abs(v) < 0.78) continue;

      const s = new THREE.Mesh(studGeo, studMat);
      s.position.set(u * 0.44, 0.09, v * 0.7);
      phone.add(s);
      studs.push(s);
    }
  }

  // --- 4. Dangling charm (the McBling signature accessory) ---
  const charmGroup = new THREE.Group();
  charmGroup.position.set(-0.5, 0.0, 0.8);

  const chainLinkGeo = new THREE.TorusGeometry(0.04, 0.012, 8, 16);
  for (let i = 0; i < 4; i++) {
    const link = new THREE.Mesh(chainLinkGeo, goldMat);
    link.position.y = -i * 0.07;
    link.rotation.x = i % 2 === 0 ? 0 : Math.PI / 2;
    charmGroup.add(link);
  }

  // Heart pendant — a small extruded heart shape
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0.1);
  heartShape.bezierCurveTo(0.1, 0.2, 0.2, 0.1, 0.1, -0.02);
  heartShape.bezierCurveTo(0.05, -0.1, 0, -0.12, 0, -0.16);
  heartShape.bezierCurveTo(0, -0.12, -0.05, -0.1, -0.1, -0.02);
  heartShape.bezierCurveTo(-0.2, 0.1, -0.1, 0.2, 0, 0.1);

  const heart = new THREE.Mesh(
    new THREE.ExtrudeGeometry(heartShape, { depth: 0.04, bevelEnabled: false }),
    new THREE.MeshPhysicalMaterial({
      color: 0xff1a8a,
      emissive: 0xff1a8a,
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.08,
      clearcoat: 1.0,
      envMap,
    })
  );
  heart.position.y = -0.34;
  charmGroup.add(heart);

  phone.add(charmGroup);

  phone.position.y = 0.55;
  phone.rotation.y = -0.4;
  group.add(phone);

  // --- 5. Lighting: warm gold key + hot pink rim ---
  const keyLight = new THREE.DirectionalLight(0xfff3d6, 2.0);
  keyLight.position.set(2.5, 4, 3);
  group.add(keyLight);

  const pinkRim = new THREE.DirectionalLight(0xff66cc, 1.6);
  pinkRim.position.set(-3, 2, -2);
  group.add(pinkRim);

  const warmFill = new THREE.PointLight(0xf4c542, 1.0, 10);
  warmFill.position.set(0, 1.2, 2.2);
  group.add(warmFill);

  group.add(new THREE.AmbientLight(0xffd6ea, 0.55));

  return {
    group,
    description:
      'Early-2000s McBling maximalism — a champagne-gold clamshell flip-phone studded with rhinestones, dangling a pink heart charm, resting on a hot-pink velour cushion. Juicy Couture, Paris Hilton, and the last gasp of pre-iPhone hardware glam.',
    background: 'radial-gradient(circle at 50% 35%, #ff9fd4 0%, #ff3aa8 55%, #7a1f4d 100%)',
    update(t, bounce, spring) {
      // Show-off turntable with a slow "glint" tilt — bling, not a spin
      phone.rotation.y = -0.4 + Math.sin(t * 0.5) * 0.55;
      phone.rotation.z = Math.sin(t * 0.7) * 0.04;
      phone.position.y = 0.55 + Math.sin(t * 1.2) * 0.04 - bounce * 0.15;

      // Charm swings independently — the classic dangly charm physics
      charmGroup.rotation.z = Math.sin(t * 2.0) * 0.22;
      charmGroup.rotation.x = Math.cos(t * 1.6) * 0.12;

      // Cushion breathes subtly (velour settles under the phone's weight)
      cushion.scale.y = 0.28 + Math.sin(t * 0.9) * 0.008;

      // Studs twinkle — alternate two groups so it reads as random glint,
      // not a synchronized pulse
      studs.forEach((s, i) => {
        const tw = 0.5 + 0.5 * Math.sin(t * 3.2 + (i % 7) * 1.3);
        s.scale.setScalar(0.9 + tw * 0.25);
      });

      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}