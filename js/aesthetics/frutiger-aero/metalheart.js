import * as THREE from 'three';

export function createMetalheart() {
  const group = new THREE.Group();

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.96,
    roughness: 0.08,
  });

  const cobaltMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.5,
    metalness: 0.8,
    roughness: 0.15,
  });

  // Liquid Chrome Core
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.68, 1), chromeMat);
  group.add(core);

  // Y2K Chrome Spikes Radiating Outward
  const spikes = [];
  const spikeGeo = new THREE.ConeGeometry(0.14, 1.35, 6);
  const dirs = [,
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
,
    [0, -1, -1],
  ];

  dirs.forEach(([x, y, z]) => {
    const spike = new THREE.Mesh(spikeGeo, chromeMat);
    const vec = new THREE.Vector3(x, y, z).normalize();
    spike.position.copy(vec).multiplyScalar(0.85);
    spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec);
    group.add(spike);
    spikes.push(spike);
  });

  // Intersecting Vector Rings
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.045, 12, 64), cobaltMat);
  ringA.rotation.set(0.6, 0.4, 0);
  group.add(ringA);

  const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.03, 12, 64), chromeMat);
  ringB.rotation.set(-0.7, 0.5, 0.2);
  group.add(ringB);

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #dbeafe 0%, #93c5fd 45%, #1e3a8a 100%)',
    update(t, bounce, spring) {
      core.rotation.y = t * 0.9;
      core.rotation.z = t * 0.5;
      ringA.rotation.z = t * 1.2;
      ringB.rotation.z = -t * 0.8;
      group.scale.setScalar(1 + spring * 0.3);
    },
  };
}
