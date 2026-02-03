import { Mesh, SphereGeometry, MeshPhongMaterial, TextureLoader, Color, SRGBColorSpace } from 'three';
import { atmosphereFactory, atmosphereCloudsFactory } from '../Atmosphere/Atmosphere';

import earthMap from './earthmap1k.jpg';
import earthBump from './earthbump1k.jpg';
import earthSpec from './earthspec1k.jpg';
import earthCloudMap from './earthcloudmap.jpg';
import earthCloudMapTrans from './earthcloudmaptrans.jpg';

const textureLoader = new TextureLoader();

export const earthMeshFactory = (earthRadius: number = 1): Mesh => {
  const geometry = new SphereGeometry(earthRadius, 32, 32);
  const material = new MeshPhongMaterial({});
  
  // Load and configure textures with proper color space
  const mapTexture = textureLoader.load(earthMap);
  mapTexture.colorSpace = SRGBColorSpace;
  material.map = mapTexture;
  
  material.bumpMap = textureLoader.load(earthBump);
  material.bumpScale = 0.05;

  material.specularMap = textureLoader.load(earthSpec);
  material.specular = new Color('grey');

  const earth = new Mesh(geometry, material);
  earth.rotateY(-1);
  earth.rotateZ(-0.4);

  earth.add(atmosphereCloudsFactory(earthRadius, earthCloudMap, earthCloudMapTrans));
  earth.add(atmosphereFactory(earthRadius, earthCloudMap, earthCloudMapTrans));

  return earth;
};
