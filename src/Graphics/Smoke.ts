import { Mesh, IcosahedronGeometry, MeshLambertMaterial } from 'three';

export const SmokeParticle = (): Mesh => {
  const geometry = new IcosahedronGeometry(75, 1);
  const material = new MeshLambertMaterial({
    color: 'white',
    flatShading: true,
    transparent: true,
  });
  return new Mesh(geometry, material);
};
