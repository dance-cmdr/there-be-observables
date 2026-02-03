import {
  Mesh,
  BackSide,
  TextureLoader,
  MeshBasicMaterial,
  SphereGeometry,
  LinearFilter,
  LinearMipmapLinearFilter,
  SRGBColorSpace,
} from 'three';

import starField from './starfield.jpg';

const textureLoader = new TextureLoader();

export const starfieldFactory = (radius: number = 5): Mesh => {
  // create the geometry sphere with more segments for smoother rendering
  const geometry = new SphereGeometry(radius, 64, 64);
  // create the material, using a texture of startfield
  const material = new MeshBasicMaterial();
  const texture = textureLoader.load(starField);
  // Apply texture filtering to reduce pixelation
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = true;
  texture.colorSpace = SRGBColorSpace;
  material.map = texture;
  material.side = BackSide;
  // create the mesh based on geometry and material
  return new Mesh(geometry, material);
};
