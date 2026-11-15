import * as THREE from 'three';

export function create2000sFps() {
  const group = new THREE.Group();

  const bloomGoldMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xd97706,
    emissiveIntensity: 0.65,
    roughness: 0.3,
  });

  const tacticalOliveMat = new THREE.MeshStandardMaterial({
    color: 0x57534e,
    metalness: 0.5,
    roughness: 0.55,
  });

  const reticleMat = new THREE.MeshBasicMaterial({
    color: 0x84cc16,
    wireframe: true,
  });

  // 7th-gen sepia/bloom sun sphere
  const bloomSun = new THREE.Mesh(new THREE.SphereGeometry(0.46, 24, 24), bloomGoldMat);
  bloomSun.position.set(0, 0.2, -0.35);
  group.add(bloomSun);

  // Tactical HUD crosshair rings
  const outerReticle = new THREE.Mesh(new THREE.RingGeometry(0.78, 0.84, 32), reticleMat);
  const innerReticle = new THREE.Mesh(new THREE.RingGeometry(0.32, 0.36, 4), reticleMat);
  group.add(outerReticle, innerReticle);

  // Brushed gunmetal armor plates
  const plateL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.72, 0.14), tacticalOliveMat);
  plateL.position.set(-1.05, 0, 0);
  const plateR = plateL.clone();
  plateR.position.x = 1.05;
  group.add(plateL, plateR);

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #fef08a 0%, #b45309 45%, #292524 100%)',
    update(t, bounce, spring) {
      outerReticle.rotation.z = t * 0.45;
      innerReticle.rotation.z = -t * 1.1;
      bloomSun.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
      group.scale.setScalar(1 + spring * 0.22);
    },
  };
}
