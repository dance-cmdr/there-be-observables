import { Mesh, SphereGeometry, MeshPhongMaterial, ImageUtils, Color } from 'three';
import { athmoshpereFactory } from '../Atmoshpere/Atmoshpere';

import * as earthMap from './earthmap1k.jpg';
import * as earthBump from './earthbump1k.jpg';
import * as earthSpec from './earthspec1k.jpg';
import * as earthCloudMap from './earthcloudmap.jpg';
import * as earthCloudMapTrans from './earthcloudmaptrans.jpg';

export const earthMeshFactory = (earthSize: number = 2): Mesh => {
  console.log('earthMap', earthMap);

  const geometry = new SphereGeometry(earthSize, 32, 32);
  const material = new MeshPhongMaterial();
  material.map = ImageUtils.loadTexture(earthMap);
  material.bumpMap = ImageUtils.loadTexture(earthBump);
  material.bumpScale = 0.05;

  material.specularMap = ImageUtils.loadTexture(earthSpec);
  material.specular = new Color('grey');

  const earth = new Mesh(geometry, material);
  earth.rotateY(-2);
  earth.rotateZ(-0.4);

  earth.add(athmoshpereFactory(earthSize, earthCloudMap, earthCloudMapTrans));
  return earth;
};
