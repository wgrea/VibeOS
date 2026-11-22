// js/aesthetics/kidcore/kid-candy.js
import * as THREE from 'three';

export function createKidCandy() {
  const group = new THREE.Group();

  const colors = [0xef4444, 0xfacc15, 0x3b82f6, 0x22c55e, 0xec4899, 0xa855f7];
  const faceMaterials = colors.map(
    (hex) =>
      new THREE.MeshPhysicalMaterial({
        color: hex,
        roughness: 0.18,
        clearcoat: 0.9,
      })
  );

  // 1. Central Multi-Color Toy Block with Raised Building-Block Studs
  const toyBlock = new THREE.Group();
  const cube = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.92, 0.92), faceMaterials);
  toyBlock.add(cube);

  // Raised studs on top face
  const studGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16);
  const studOffsets = [
    [-0.22, 0.5, -0.22, 1],
    [0.22, 0.5, -0.22, 2],
    [-0.22, 0.5, 0.22, 3],
    [0.22, 0.5, 0.22, 4],
  ];
  studOffsets.forEach(([x, y, z, matIdx]) => {
    const stud = new THREE.Mesh(studGeo, faceMaterials[matIdx]);
    stud.position.set(x, y, z);
    toyBlock.add(stud);
  });

  group.add(toyBlock);

  // 2. Orbiting Rainbow Candy-Bracelet Beads
  const orbitRing = new THREE.Group();
  const sphereGeo = new THREE.SphereGeometry(0.2, 20, 20);

  colors.forEach((hex, i) => {
    const angle = (i / colors.length) * Math.PI * 2;
    const bead = new THREE.Mesh(sphereGeo, faceMaterials[i]);
    bead.position.set(Math.cos(angle) * 1.28, Math.sin(angle) * 1.28, 0);
    orbitRing.add(bead);
  });

  orbitRing.rotation.x = 0.52;
  group.add(orbitRing);

  // 3. Secondary Counter-Orbiting Star Candies
  const starRing = new THREE.Group();
  const starGeo = new THREE.OctahedronGeometry(0.12, 0);
  colors.forEach((hex, i) => {
    const angle = ((i + 0.5) / colors.length) * Math.PI * 2;
    const star = new THREE.Mesh(starGeo, faceMaterials[(i + 2) % colors.length]);
    star.position.set(Math.cos(angle) * 1.45, Math.sin(angle) * 1.45, 0);
    starRing.add(star);
  });
  starRing.rotation.x = -0.45;
  group.add(starRing);

  // Optional 90s Primary-Color Classroom Rug Floor for kid-candy.js
const floorGroup = new THREE.Group();
floorGroup.position.y = -1.15;

const tileColors = [0xef4444, 0xfacc15, 0x3b82f6, 0x22c55e];
const tileGeo = new THREE.BoxGeometry(0.65, 0.06, 0.65);

for (let row = -1; row <= 1; row++) {
  for (let col = -1; col <= 1; col++) {
    const colorIdx = Math.abs(row * 3 + col) % tileColors.length;
    const tileMat = new THREE.MeshStandardMaterial({
      color: tileColors[colorIdx],
      roughness: 0.75,
    });
    const tile = new THREE.Mesh(tileGeo, tileMat);
    tile.position.set(col * 0.68, 0, row * 0.68);
    floorGroup.add(tile);
  }
}
group.add(floorGroup);


  return {
    group,
    description:
      'Step into pure 90s toy-box energy, sugar-rush color, and carefree recess joy—where primary building blocks, glossy gumballs, and rainbow candy beads bounce with nostalgic childhood excitement.',
    background: 'radial-gradient(circle at 50% 30%, #fef08a 0%, #f472b6 50%, #3b82f6 100%)',
    update(t, bounce, spring) {
      toyBlock.rotation.y = t * 0.55;
      toyBlock.rotation.x = Math.sin(t * 0.9) * 0.28;
      toyBlock.position.y = Math.sin(t * 2.4) * 0.06;

      orbitRing.rotation.z = -t * 0.8;
      starRing.rotation.z = t * 0.65;

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
