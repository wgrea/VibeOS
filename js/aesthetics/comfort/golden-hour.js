// js/aesthetics/comfort/golden-hour.js
import * as THREE from 'three';

export function createGoldenhour() {
  const group = new THREE.Group();

  // 1. Warm Plaster / Stucco Backdrop Wall
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xfde68a,
    roughness: 0.85,
    metalness: 0.02,
  });

  const wall = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 0.14), wallMat);
  wall.position.set(0, 0, -0.45);
  wall.receiveShadow = true;
  group.add(wall);

  // Minimalist Warm Baseboard / Trim Accent
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    roughness: 0.6,
  });
  const trim = new THREE.Mesh(new THREE.BoxGeometry(2.64, 0.14, 0.18), trimMat);
  trim.position.set(0, -1.03, -0.44);
  trim.receiveShadow = true;
  group.add(trim);

  // 2. Low-Angle Golden Sun Orb & Window Blind Shadow Casters
  const sunOrbMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.9,
  });
  const sunOrb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), sunOrbMat);
  sunOrb.position.set(-1.35, 0.95, 0.85);
  group.add(sunOrb);

  // Translucent Window Slats casting diagonal shadows onto the wall
  const slatGroup = new THREE.Group();
  const slatMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.4,
    transparent: true,
    opacity: 0.35,
  });

  for (let i = 0; i < 6; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.035, 0.06), slatMat);
    slat.position.set(0, (i - 2.5) * 0.22, 0);
    slat.rotation.x = 0.35;
    slat.castShadow = true;
    slatGroup.add(slat);
  }
  slatGroup.position.set(-0.55, 0.35, 0.25);
  slatGroup.rotation.y = 0.45;
  slatGroup.rotation.z = -0.25;
  group.add(slatGroup);

    // Silhouette Casters (Human Profile + Potted Flower Stem)
  const silhouetteGroup = new THREE.Group();
  const casterMat = new THREE.MeshStandardMaterial({
    color: 0x1c1008, // Deep warm black-brown silhouette
    roughness: 0.95,
    metalness: 0.0,
  });


  // Human Head & Shoulders Silhouette
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 20), casterMat);
  head.position.set(0.28, -0.05, 0);
  head.castShadow = true;

  const shoulders = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.34, 0.38, 20), casterMat);
  shoulders.scale.set(1.2, 1, 0.45);
  shoulders.position.set(0.28, -0.36, 0);
  shoulders.castShadow = true;

  // Potted Flower Silhouette on the left
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.55, 8), casterMat);
  stem.position.set(-0.35, -0.28, 0.05);
  stem.rotation.z = 0.12;
  stem.castShadow = true;

  const flowerHead = new THREE.Group();
  flowerHead.position.set(-0.38, 0.02, 0.05);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), casterMat);
    petal.scale.set(0.6, 1.3, 0.25);
    petal.position.set(Math.cos(a) * 0.09, Math.sin(a) * 0.09, 0);
    petal.rotation.z = a - Math.PI / 2;
    petal.castShadow = true;
    flowerHead.add(petal);
  }

  silhouetteGroup.add(head, shoulders, stem, flowerHead);
  silhouetteGroup.position.set(-0.25, -0.1, 0.35);
  group.add(silhouetteGroup);


  // Local Directional Light for crisp afternoon shadows
  const sunLight = new THREE.DirectionalLight(0xffb703, 2.4);
  sunLight.position.set(-2.2, 1.6, 1.8);
  sunLight.target = wall;
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 6;
  sunLight.shadow.camera.left = -2;
  sunLight.shadow.camera.right = 2;
  sunLight.shadow.camera.top = 2;
  sunLight.shadow.camera.bottom = -2;
  sunLight.shadow.bias = -0.001;
  group.add(sunLight);
  group.add(sunLight.target);

  // 3. Drifting Sunbeam Dust Motes
  const moteMat = new THREE.MeshBasicMaterial({
    color: 0xfef9c3,
    transparent: true,
    opacity: 0.85,
  });

  const motes = [];
  for (let i = 0; i < 16; i++) {
    const mote = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), moteMat);
    const x = ((i * 37) % 100) / 50 - 1.0;
    const y = ((i * 53) % 100) / 55 - 0.85;
    const z = -0.2 + (i % 5) * 0.14;
    mote.position.set(x, y, z);
    group.add(mote);
    motes.push({ mesh: mote, baseX: x, baseY: y, phase: i * 0.7 });
  }

  return {
    group,
    description:
      'Capturing the nostalgic warmth of late-afternoon sunlight, Golden Hour pairs low-angle amber beams and diagonal window-blind shadows across warm walls with floating dust motes and serene stillness.',
    background: 'radial-gradient(circle at 25% 25%, #fef08a 0%, #f59e0b 50%, #b45309 100%)',
    update(t, bounce, spring) {
      sunLight.position.x = -2.2 + Math.sin(t * 0.5) * 0.35;
      sunLight.position.y = 1.6 + Math.cos(t * 0.4) * 0.15;
      sunOrb.position.x = -1.35 + Math.sin(t * 0.5) * 0.15;

      slatGroup.children.forEach((slat, idx) => {
        slat.rotation.x = 0.35 + Math.sin(t * 1.3 + idx * 0.4) * 0.06;
      });

            // Gentle breeze sway on the flower shadow
      flowerHead.rotation.z = Math.sin(t * 1.1) * 0.12;
      head.position.y = -0.05 + Math.sin(t * 0.8) * 0.015;


      motes.forEach((m) => {
        m.mesh.position.y = m.baseY + Math.sin(t * 0.9 + m.phase) * 0.08;
        m.mesh.position.x = m.baseX + Math.cos(t * 0.6 + m.phase) * 0.06;
      });

      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}

export { createGoldenhour as createGoldenHour };
