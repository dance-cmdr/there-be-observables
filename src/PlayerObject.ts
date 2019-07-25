import { Group, Object3D, MeshPhongMaterial, Color, Mesh, Material } from 'three';

export const playerObjectFactory = (model: Object3D, scale: number, color?: number): Object3D => {
  const object = new Group();
  model.scale.set(scale, scale, scale);
  model.rotateY(90);
  object.add(model);

  if (color) {
    for (let i = 0; i < 4; i++) {
      // @ts-ignore
      model.children[i].material.color.setHex(color);
    }
  }

  return object;
};
