import { Mesh, SphereGeometry, MeshPhongMaterial, ImageUtils } from 'three';

import * as earthMap from './Earth/earthmap1k.jpg';

export const earthMeshFactory = (): Mesh => {
  console.log('earthMap', earthMap);

  const geometry = new SphereGeometry(1, 32, 32);
  const material = new MeshPhongMaterial();
  material.map = ImageUtils.loadTexture(earthMap);

  const earth = new Mesh(geometry, material);
  earth.rotateY(-2);
  earth.rotateZ(-0.4);
  return earth;
};
