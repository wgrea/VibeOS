// js/aesthetics/comfort/cottagecore.js
import * as THREE from 'three';

export function createCottagecore() {
  const group = new THREE.Group();

  const grassMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.75 });
  const wickerMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
  const wickerRimMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.65 });
  const clothWhiteMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.6 });
  const clothRedMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.6 });
  const breadMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.55 });
  const jamMat = new THREE.MeshPhysicalMaterial({
    color: 0xe11d48,
    roughness: 0.15,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.88,
  });

  // 1. Sunlit Meadow Mound & Gingham Picnic Blanket
  const meadow = new THREE.Mesh(new THREE.CylinderGeometry(1.38, 1.48, 0.22, 32), grassMat);
  meadow.position.y = -0.55;
  group.add(meadow);

  const blanketGroup = new THREE.Group();
  blanketGroup.position.set(0.22, -0.43, 0.38);
  blanketGroup.rotation.y = 0.25;

  const baseCloth = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.02, 1.15), clothWhiteMat);
  blanketGroup.add(baseCloth);

  // Classic Red-and-White Gingham Checkered Squares
  const tileGeo = new THREE.BoxGeometry(0.22, 0.024, 0.22);
  for (let gx = -2; gx <= 2; gx++) {
    for (let gz = -2; gz <= 2; gz++) {
      if ((gx + gz) % 2 === 0) {
        const tile = new THREE.Mesh(tileGeo, clothRedMat);
        tile.position.set(gx * 0.22, 0.002, gz * 0.22);
        blanketGroup.add(tile);
      }
    }
  }
  group.add(blanketGroup);

    // 1B. Storybook English Country Cottage Backdrop
  const cottageGroup = new THREE.Group();
  const plasterMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.7 });
  const thatchMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85 });
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.55 });
  const windowGlowMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

  // Whitewashed Cottage Walls
  const cottageBody = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.52, 0.62), plasterMat);
  cottageBody.position.y = 0.26;

  // Steep Pitched Thatched Roof (4-sided prism)
  const roofGeo = new THREE.ConeGeometry(0.68, 0.44, 4);
  const cottageRoof = new THREE.Mesh(roofGeo, thatchMat);
  cottageRoof.rotation.y = Math.PI / 4;
  cottageRoof.scale.set(1.05, 1.0, 0.82);
  cottageRoof.position.y = 0.72;

  // Stone Chimney
  const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.32, 0.14),
    new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.9 })
  );
  chimney.position.set(0.26, 0.82, -0.08);

  // Sage-Green Cottage Front Door & Glowing Pane Windows
  const frontDoor = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.32, 0.04), doorMat);
  frontDoor.position.set(-0.14, 0.16, 0.32);

  const windowPane = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.04), windowGlowMat);
  windowPane.position.set(0.18, 0.26, 0.32);

  // Mini Window Flower Box
  const flowerBox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.08), thatchMat);
  flowerBox.position.set(0.18, 0.15, 0.34);

  cottageGroup.add(cottageBody, cottageRoof, chimney, frontDoor, windowPane, flowerBox);
  cottageGroup.position.set(-0.22, -0.45, -0.48);
  cottageGroup.rotation.y = 0.25;
  group.add(cottageGroup);


  // 2. Woven Wicker Picnic Basket with Open Lid & Handle
  const basketGroup = new THREE.Group();
  basketGroup.position.set(-0.48, -0.24, 0.28);
  basketGroup.rotation.y = 0.35;

  const basketBody = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.36, 0.44), wickerMat);
  const basketRim = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.05, 0.48), wickerRimMat);
  basketRim.position.y = 0.18;

  // Slightly Tilted Open Lid
  const basketLid = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.04, 0.46), wickerMat);
  basketLid.position.set(0, 0.26, -0.16);
  basketLid.rotation.x = -0.45;

  // Arched Wicker Handle
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.028, 10, 28, Math.PI), wickerRimMat);
  handle.position.y = 0.18;

  basketGroup.add(basketBody, basketRim, basketLid, handle);
  group.add(basketGroup);

  // 3. Fresh-Baked Bread Loaf & Strawberry Jam Jar on the Blanket
  const loaf = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.22, 10, 16), breadMat);
  loaf.rotation.set(0, 0.5, Math.PI / 2);
  loaf.scale.set(0.75, 1, 1.1);
  loaf.position.set(0.28, -0.34, 0.42);

  const jamJar = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.09, 0.18, 18), jamMat);
  jamJar.position.set(0.46, -0.33, 0.24);

  const jamLid = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.035, 18), clothRedMat);
  jamLid.position.set(0.46, -0.23, 0.24);


  group.add(loaf, jamJar, jamLid);

  // 4. Meadow Daisies & Drifting Sunlit Pollen Motes
  const petalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const centerMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });

  const daisyCoords = [
    [-0.85, -0.42, 0.42],
    [0.88, -0.42, -0.32],
    [0.68, -0.42, 0.65],
    [-0.78, -0.42, -0.62],
  ];

  daisyCoords.forEach(([dx, dy, dz]) => {
    const daisy = new THREE.Group();
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), centerMat);
    daisy.add(center);

    for (let p = 0; p < 6; p++) {
      const a = (p / 6) * Math.PI * 2;
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), petalMat);
      petal.scale.set(1.3, 0.4, 0.7);
      petal.position.set(Math.cos(a) * 0.065, 0, Math.sin(a) * 0.065);
      petal.rotation.y = -a;
      daisy.add(petal);
    }

    daisy.position.set(dx, dy, dz);
    group.add(daisy);
  });

  const pollenMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const motes = [];
  for (let i = 0; i < 10; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), pollenMat);
    const a = (i / 10) * Math.PI * 2;
    s.position.set(Math.cos(a) * 1.15, (i % 3) * 0.3 - 0.1, Math.sin(a) * 1.15);
    group.add(s);
    motes.push({ mesh: s, baseY: s.position.y, phase: i * 0.7 });
  }

  return {
    group,
    description:
      'Romanticizing slow pastoral living and handmade domestic warmth, Cottagecore pairs woven picnic baskets, gingham blankets, fresh-baked bread, berry preserves, and sunlit meadow daisies.',
    background: 'radial-gradient(circle at 50% 30%, #fef9c3 0%, #bef264 48%, #4d7c0f 100%)',
    update(t, bounce, spring) {
      group.rotation.y = Math.sin(t * 0.5) * 0.25;
      motes.forEach((s) => {
        s.mesh.position.y = s.baseY + Math.sin(t * 1.8 + s.phase) * 0.12;
      });
      group.scale.setScalar(1 + spring * 0.25);
    },
  };
}
