import { Mesh, SphereGeometry, MeshPhongMaterial, ImageUtils, Color } from 'three';
import { athmoshpereFactory, athmoshpereCloudsFactory } from '../Atmoshpere/Atmoshpere';

import earthMap from './earthmap1k.jpg';
import earthBump from './earthbump1k.jpg';
import earthSpec from './earthspec1k.jpg';
import earthCloudMap from './earthcloudmap.jpg';
import earthCloudMapTrans from './earthcloudmaptrans.jpg';

export const earthMeshFactory = (earthRadius: number = 1): Mesh => {
  const geometry = new SphereGeometry(earthRadius, 32, 32);
  const material = new MeshPhongMaterial({});
  material.map = ImageUtils.loadTexture(earthMap);
  material.bumpMap = ImageUtils.loadTexture(earthBump);
  material.bumpScale = 0.05;

  material.specularMap = ImageUtils.loadTexture(earthSpec);
  material.specular = new Color('grey');

  const earth = new Mesh(geometry, material);
  earth.rotateY(-1);
  earth.rotateZ(-0.4);

  earth.add(athmoshpereCloudsFactory(earthRadius, earthCloudMap, earthCloudMapTrans));
  earth.add(athmoshpereFactory(earthRadius, earthCloudMap, earthCloudMapTrans));

  return earth;
};
