import { Mesh, BackSide, ImageUtils, MeshBasicMaterial, SphereGeometry } from 'three';

const starField = require('./starfield.jpg');

export const starfieldFactory = (radius: number = 5): Mesh => {
  // create the geometry sphere
  var geometry = new SphereGeometry(radius, 32, 32);
  // create the material, using a texture of startfield
  var material = new MeshBasicMaterial();
  material.map = ImageUtils.loadTexture(starField);
  material.side = BackSide;
  // create the mesh based on geometry and material
  return new Mesh(geometry, material);
};
