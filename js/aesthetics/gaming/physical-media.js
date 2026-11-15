import * as THREE from 'three';

export function createPhysicalMedia() {
  const group = new THREE.Group();

  const jewelCaseMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    transmission: 0.72,
    roughness: 0.08,
    thickness: 0.3,
    transparent: true,
    opacity: 0.85,
  });

  const discMat = new THREE.MeshPhysicalMaterial({
    color: 0xc084fc,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.25,
    metalness: 0.9,
    roughness: 0.1,
    iridescence: 1.0,
    iridescenceIOR: 1.3,
  });

  const spineMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
  });

  // Clear acrylic jewel case frame
  const caseGroup = new THREE.Group();
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.25, 0.16), spineMat);
  spine.position.x = -0.62;
  const frontCover = new THREE.Mesh(new THREE.BoxGeometry(1.22, 1.25, 0.12), jewelCaseMat);
  caseGroup.add(spine, frontCover);
  group.add(caseGroup);

  // Iridescent optical CD / GameCube / Blu-ray disc peeking out
  const disc = new THREE.Mesh(new THREE.RingGeometry(0.14, 0.54, 36), discMat);
  disc.material.side = THREE.DoubleSide;
  disc.position.set(0.45, 0, 0.12);
  group.add(disc);

  return {
    group,
    draggable: caseGroup,
    background: 'radial-gradient(circle at 50% 30%, #f1f5f9 0%, #cbd5e1 50%, #475569 100%)',
    update(t, bounce, spring) {
      caseGroup.rotation.y = Math.sin(t * 0.7) * 0.35;
      disc.rotation.z = t * 1.4;
      disc.position.x = 0.42 + Math.sin(t * 1.5) * 0.14;
      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
