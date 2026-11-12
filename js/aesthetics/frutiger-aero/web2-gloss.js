import * as THREE from 'three';

export function createWeb2Gloss() {
  const group = new THREE.Group();

  // 16-Point Glossy Sticker Badge
  const badgeShape = new THREE.Shape();
  for (let i = 0; i < 32; i++) {
    const angle = (i / 32) * Math.PI * 2;
    const radius = i % 2 === 0 ? 1.55 : 1.28;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    i === 0 ? badgeShape.moveTo(x, y) : badgeShape.lineTo(x, y);
  }
  badgeShape.closePath();

  const badgeGeo = new THREE.ExtrudeGeometry(badgeShape, {
    depth: 0.2, bevelEnabled: true, bevelSegments: 5, bevelSize: 0.08, bevelThickness: 0.08
  });
  badgeGeo.center();

  const web2Badge = new THREE.Mesh(
    badgeGeo,
    new THREE.MeshPhysicalMaterial({ color: 0xf97316, roughness: 0.06, clearcoat: 1.0, clearcoatRoughness: 0.02 })
  );

  // Sculpted White RSS Icon
  const rssMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const rssDot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), rssMat);
  rssDot.position.set(-0.45, -0.45, 0.18);
  web2Badge.add(rssDot);

  [0.52, 0.88].forEach((arcRadius) => {
    const arcGeo = new THREE.TorusGeometry(arcRadius, 0.09, 12, 24, Math.PI / 2);
    const arcMesh = new THREE.Mesh(arcGeo, rssMat);
    arcMesh.position.set(-0.45, -0.45, 0.18);
    web2Badge.add(arcMesh);
  });

  // Top Gloss Reflection Band
  const topShine = new THREE.Mesh(
    new THREE.CircleGeometry(1.22, 32, 0, Math.PI),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })
  );
  topShine.position.set(0, 0.05, 0.19);
  web2Badge.add(topShine);

  group.add(web2Badge);

  return {
    group,
    background: 'radial-gradient(circle at 50% 30%, #fff7ed, #fed7aa 65%, #fb923c 100%)',
    update(t, bounce, spring) {
      web2Badge.rotation.y = Math.sin(t * 1.4) * 0.45;
      web2Badge.scale.setScalar(1 - spring * 0.3);
    }
  };
}
