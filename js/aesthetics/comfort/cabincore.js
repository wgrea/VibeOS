// js/aesthetics/comfort/cabincore.js
import * as THREE from 'three';

export function createCabincore() {
  const group = new THREE.Group();

  const barkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.9 });
  const timberMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.75 });
  const mossMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.85 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.9 });
  const emberMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xea580c,
    emissiveIntensity: 0.9,
    roughness: 0.25,
  });

  // 1. Crossed Hearth Timber Logs
  const logGeo = new THREE.CylinderGeometry(0.15, 0.16, 1.55, 14);
  const log1 = new THREE.Mesh(logGeo, barkMat);
  log1.rotation.set(0, 0.45, Math.PI / 2);
  log1.position.y = -0.46;

  const log2 = new THREE.Mesh(logGeo, barkMat);
  log2.rotation.set(0, -0.52, Math.PI / 2);
  log2.position.y = -0.36;

  group.add(log1, log2);

  // 2. Mossy Stone Firepit Ring
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const isMossy = i % 2 === 0;
    const stone = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.18 + (i % 3) * 0.03, 0),
      isMossy ? mossMat : stoneMat
    );
    stone.scale.set(1.2, 0.75, 1.0);
    stone.position.set(Math.cos(a) * 1.12, -0.52, Math.sin(a) * 1.12);
    stone.rotation.y = a;
    group.add(stone);
  }

  // 3. Minimalist A-Frame Timber Cabin Silhouette Framing the Hearth
  const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.65, 12);
  const leftRafter = new THREE.Mesh(beamGeo, timberMat);
  leftRafter.position.set(-0.55, 0.28, -0.55);
  leftRafter.rotation.z = -0.58;

  const rightRafter = new THREE.Mesh(beamGeo, timberMat);
  rightRafter.position.set(0.55, 0.28, -0.55);
  rightRafter.rotation.z = 0.58;

  const ridgeBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 10), barkMat);
  ridgeBeam.rotation.x = Math.PI / 2;
  ridgeBeam.position.set(0, 0.92, -0.2);

  group.add(leftRafter, rightRafter, ridgeBeam);

    // 3B. Miniature Log Cabin Wall, Glowing Amber Window & Stone Chimney
  const cabinGroup = new THREE.Group();

  // Horizontal Stacked Log Cabin Back Wall
  for (let row = 0; row < 5; row++) {
    const wallLog = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 1.38, 12),
      row % 2 === 0 ? barkMat : timberMat
    );
    wallLog.rotation.z = Math.PI / 2;
    wallLog.position.set(0, -0.42 + row * 0.125, -0.68);
    cabinGroup.add(wallLog);
  }

  // Warm Glowing Cabin Window Pane
  const windowFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.36, 0.06),
    barkMat
  );
  windowFrame.position.set(0, -0.14, -0.64);

  const windowGlass = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.28, 0.07),
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  windowGlass.position.set(0, -0.14, -0.64);

  // Window Crossbar Panes
  const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.28, 0.08), barkMat);
  vBar.position.set(0, -0.14, -0.64);
  const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.025, 0.08), barkMat);
  hBar.position.set(0, -0.14, -0.64);

  // Stone Chimney on the Right Slope
  const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.55, 0.22),
    stoneMat
  );
  chimney.position.set(0.45, 0.65, -0.58);

  cabinGroup.add(windowFrame, windowGlass, vBar, hBar, chimney);
  group.add(cabinGroup);

  // 4. Layered Hearth Flame Gem & Warm Point Light
  const flame = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), emberMat);
  flame.scale.set(0.85, 1.3, 0.85);
  flame.position.y = 0.18;
  group.add(flame);

  const innerFlame = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.24, 0),
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  innerFlame.scale.set(0.8, 1.25, 0.8);
  innerFlame.position.y = 0.14;
  group.add(innerFlame);

  const hearthLight = new THREE.PointLight(0xf97316, 2.2, 4.5);
  hearthLight.position.set(0, 0.25, 0.2);
  group.add(hearthLight);

  // 5. Rising Hearth Ember Sparks
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0xfdba74 });
  const sparks = [];
  for (let i = 0; i < 10; i++) {
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), sparkMat);
    const a = (i / 10) * Math.PI * 2;
    const r = 0.25 + (i % 3) * 0.18;
    spark.position.set(Math.cos(a) * r, 0.3 + i * 0.08, Math.sin(a) * r);
    group.add(spark);
    sparks.push({ mesh: spark, angle: a, r, offset: i * 0.1 });
  }

  return {
    group,
    description:
      'Rooted in rustic woodland refuge and hearthside warmth, Cabincore pairs notched timber A-frames, mossy stone firepits, crackling amber embers, and quiet forest solitude.',
    background: 'radial-gradient(circle at 50% 35%, #78350f 0%, #451a03 55%, #1c1917 100%)',
    update(t, bounce, spring) {
      flame.rotation.y = t * 0.9;
      flame.position.y = 0.18 + Math.sin(t * 3) * 0.06;
      flame.scale.set(
        0.85 + Math.sin(t * 6) * 0.05,
        1.3 + Math.cos(t * 5) * 0.08,
        0.85 + Math.sin(t * 6) * 0.05
      );

      innerFlame.rotation.y = -t * 1.4;
      innerFlame.position.y = 0.14 + Math.sin(t * 3.5) * 0.05;

      hearthLight.intensity = 2.0 + Math.sin(t * 8) * 0.35;

      sparks.forEach((s) => {
        const cycle = (t * 0.45 + s.offset) % 1;
        s.mesh.position.y = 0.1 + cycle * 1.15;
        s.mesh.position.x = Math.cos(s.angle + t * 0.6) * (s.r * (1 - cycle * 0.4));
        s.mesh.position.z = Math.sin(s.angle + t * 0.6) * (s.r * (1 - cycle * 0.4));
        s.mesh.scale.setScalar(1 - cycle * 0.8);
      });

      group.scale.setScalar(1 + spring * 0.22);
    },
  };
}
