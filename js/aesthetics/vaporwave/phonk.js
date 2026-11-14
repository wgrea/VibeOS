import * as THREE from 'three';

export function createPhonk() {
  const group = new THREE.Group();

  // Midnight JDM Drift Wheel Rim Core
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.88, 0.24, 16, 36),
    new THREE.MeshPhysicalMaterial({
      color: 0x18181b,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
    })
  );
  group.add(rim);

  // Glowing Crimson-Violet Brake Caliper & Cowbell Core
  const hub = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.48, 0),
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 1.1,
      metalness: 0.7,
      roughness: 0.2,
    })
  );
  group.add(hub);

  // Orbiting 808 Cowbell / Drift Tire Smoke Rings
  const driftRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.42, 0.045, 12, 48),
    new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.85,
    })
  );
  driftRing.rotation.x = Math.PI / 2.4;
  group.add(driftRing);

  return {
    group,
    background: 'radial-gradient(circle at 50% 35%, #7f1d1d 0%, #3b0764 55%, #09090b 100%)',
    update(t, bounce, spring) {
      // Aggressive 808 cowbell / sub-bass thump + high-RPM wheel spin
      const kick = Math.pow(Math.abs(Math.sin(t * 5.6)), 8);
      rim.rotation.z = -t * 3.2;
      rim.rotation.y = Math.sin(t * 0.8) * 0.35;

      hub.rotation.y = t * 2.2;
      hub.scale.setScalar(1 + kick * 0.22);

      driftRing.rotation.z = t * 1.4;

      group.scale.setScalar(1 + spring * 0.28);
    },
  };
}
