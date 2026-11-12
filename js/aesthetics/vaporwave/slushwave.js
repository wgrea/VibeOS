import * as THREE from 'three';

export function createSlushwave() {
  const group = new THREE.Group();

  // 1. Glossy Turquoise Vaporwave Pool Water + Tiled Grid
  const poolWater = new THREE.Mesh(
    new THREE.PlaneGeometry(11, 9),
    new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4, transparent: true, opacity: 0.78, roughness: 0.05, clearcoat: 1.0
    })
  );
  poolWater.rotation.x = -Math.PI / 2;
  poolWater.position.y = -1.1;
  group.add(poolWater);

  const tileGrid = new THREE.GridHelper(11, 22, 0xffffff, 0x67e8f9);
  tileGrid.position.y = -1.09;
  group.add(tileGrid);

  // Classic White Ceramic Pool Steps on the Left Edge
  const stepMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 });
  for (let i = 0; i < 3; i++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.1 - i * 0.25, 0.22, 3.2), stepMat);
    step.position.set(-3.4 - i * 0.1, -1.05 + i * 0.22, -0.5);
    group.add(step);
  }

  // 2. Draggable Pink Pool Flamingo
  const flamingo = new THREE.Group();
  const pinkMat = new THREE.MeshPhysicalMaterial({ color: 0xff4da6, roughness: 0.15, clearcoat: 0.9 });

  // Plump Flamingo Body & Tail
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 24), pinkMat);
  body.scale.set(1.35, 0.85, 0.9);
  body.position.y = -0.65;
  flamingo.add(body);

  // Curved S-Neck + Head + Two-Tone Beak
  const neckCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.42, -0.55, 0),
    new THREE.Vector3(0.58, -0.1, 0),
    new THREE.Vector3(0.38, 0.35, 0),
    new THREE.Vector3(0.55, 0.55, 0)
  ]);
  const neck = new THREE.Mesh(new THREE.TubeGeometry(neckCurve, 16, 0.065, 12, false), pinkMat);
  flamingo.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), pinkMat);
  head.position.set(0.58, 0.56, 0);
  flamingo.add(head);

  const beak = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, 0.22, 12),
    new THREE.MeshStandardMaterial({ color: 0x0f172a })
  );
  beak.rotation.z = -Math.PI / 1.6;
  beak.position.set(0.72, 0.51, 0);
  flamingo.add(beak);

  group.add(flamingo);

  return {
    group,
    draggable: flamingo,
    background: 'linear-gradient(180deg, #a855f7 0%, #f472b6 48%, #22d3ee 100%)',
    update(t) {
      // Gentle water bobbing on the pool surface
      flamingo.position.y = Math.sin(t * 2.2) * 0.06;
      flamingo.rotation.z = Math.sin(t * 1.5) * 0.06;
    }
  };
}
