// js/aesthetics/dark/emo.js
import * as THREE from 'three';

export function createEmo() {
  const group = new THREE.Group();

  // Materials: Matte Black Leather, Brushed Chrome Studs, Deep Crimson Heart
  const leatherMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.65,
    metalness: 0.15,
  });

  const chromeStudMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.92,
    roughness: 0.18,
  });

  const crimsonHeartMat = new THREE.MeshPhysicalMaterial({
    color: 0xbe123c,
    emissive: 0x881337,
    emissiveIntensity: 0.45,
    roughness: 0.25,
    metalness: 0.1,
    clearcoat: 0.85,
  });

  const fractureMat = new THREE.MeshBasicMaterial({
    color: 0x09090b,
  });

  // 1. Studded Leather Wristband / Choker Assembly
  const bandGroup = new THREE.Group();
  bandGroup.rotation.x = 0.55;

  const band = new THREE.Mesh(
    new THREE.TorusGeometry(0.82, 0.15, 20, 48),
    leatherMat
  );
  bandGroup.add(band);

  // Double-row or bold single-row pyramid studs parented directly to bandGroup
  const studGeo = new THREE.ConeGeometry(0.115, 0.23, 4);
  const studCount = 14;

  for (let i = 0; i < studCount; i++) {
    const a = (i / studCount) * Math.PI * 2;
    const stud = new THREE.Mesh(studGeo, chromeStudMat);
    stud.position.set(Math.cos(a) * 1.02, Math.sin(a) * 1.02, 0);
    stud.rotation.z = a - Math.PI / 2;
    // Rotate pyramid base 45 deg so flat edges align along the strap
    stud.rotation.y = Math.PI / 4;
    bandGroup.add(stud);
  }

  group.add(bandGroup);

  // 2. Sculpted 3D Crimson Heart Centerpiece
  const heartShape = new THREE.Shape();
  const x = 0;
  const y = 0;
  heartShape.moveTo(x, y + 0.18);
  heartShape.bezierCurveTo(x, y + 0.18, x - 0.04, y + 0.34, x - 0.22, y + 0.34);
  heartShape.bezierCurveTo(x - 0.44, y + 0.34, x - 0.44, y + 0.06, x - 0.44, y + 0.06);
  heartShape.bezierCurveTo(x - 0.44, y - 0.12, x - 0.26, y - 0.28, x, y - 0.44);
  heartShape.bezierCurveTo(x + 0.26, y - 0.28, x + 0.44, y - 0.12, x + 0.44, y + 0.06);
  heartShape.bezierCurveTo(x + 0.44, y + 0.06, x + 0.44, y + 0.34, x + 0.22, y + 0.34);
  heartShape.bezierCurveTo(x + 0.08, y + 0.34, x, y + 0.18, x, y + 0.18);

  const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  });
  heartGeo.center();

  const heartGroup = new THREE.Group();
  const heartMesh = new THREE.Mesh(heartGeo, crimsonHeartMat);
  heartGroup.add(heartMesh);

  // Jagged dark fracture bolt across the heart face
  const crack1 = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.28, 0.26), fractureMat);
  crack1.position.set(-0.02, 0.08, 0);
  crack1.rotation.z = -0.35;

  const crack2 = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.28, 0.26), fractureMat);
  crack2.position.set(0.02, -0.1, 0);
  crack2.rotation.z = 0.3;

  heartGroup.add(crack1, crack2);
  group.add(heartGroup);

  // 3. Silver Safety-Pin / Chain Accent Ring
  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.015, 10, 48),
    chromeStudMat
  );
  innerRing.rotation.x = -0.45;
  group.add(innerRing);

  return {
    group,
    description:
      'Born from 2000s emotional hardcore music, MySpace profiles, and mall-goth fashion, Emo pairs jet-black aesthetics with crimson accents, pyramid-studded belts, checkered patterns, and raw emotional expression.',
    background: 'radial-gradient(circle at 50% 30%, #881337 0%, #27272a 55%, #09090b 100%)',
    update(t, bounce, spring) {
      // Leather band and its parented pyramid studs rotate together cleanly
      bandGroup.rotation.z = t * 0.55;

      // Heartbeat pulse + gentle counter-rotation
      const heartbeat = 1 + Math.pow(Math.sin(t * 3.2), 4) * 0.12;
      heartGroup.scale.setScalar(heartbeat);
      heartGroup.rotation.y = -t * 0.85;

      // Subtle sway on the silver chain ring
      innerRing.rotation.y = t * 0.65;

      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
