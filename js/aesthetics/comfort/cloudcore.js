import * as THREE from 'three';

export function createCloudcore() {
  const group = new THREE.Group();

  const puffMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xe0f2fe,
    emissiveIntensity: 0.25,
    roughness: 0.65,
  });

  const haloMat = new THREE.MeshPhysicalMaterial({
    color: 0xfef08a,
    emissive: 0xfde047,
    emissiveIntensity: 0.5,
    roughness: 0.1,
    clearcoat: 1.0,
  });

  // Cloud Cluster
  const cloud = new THREE.Group();
  const puffs = [
    [0, 0, 0, 0.68],
    [-0.62, -0.12, 0.1, 0.52],
    [0.65, -0.1, -0.05, 0.55],
    [-0.28, 0.32, -0.15, 0.48],
    [0.3, 0.28, 0.15, 0.45],
  ];

  puffs.forEach(([x, y, z, r]) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 24), puffMat);
    mesh.position.set(x, y, z);
    cloud.add(mesh);
  });
  group.add(cloud);

  // Floating Angelic Halo
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.045, 16, 48), haloMat);
  halo.rotation.x = Math.PI / 2;
  halo.position.y = 0.95;
  group.add(halo);

  return {
    group,
    background: 'radial-gradient(circle at 50% 25%, #ffffff 0%, #bae6fd 50%, #c7d2fe 100%)',
    update(t, bounce, spring) {
      cloud.position.y = Math.sin(t * 1.3) * 0.1;
      halo.position.y = 0.95 + Math.sin(t * 1.3 + 0.5) * 0.12;
      halo.rotation.z = t * 0.6;
      group.scale.setScalar(1 + spring * 0.24);
    },
  };
}
