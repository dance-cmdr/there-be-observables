import { Group, Object3D } from 'three';

export const playerObjectFactory = (model: Object3D, scale: number): Object3D => {
  const object = new Group();
  model.scale.set(scale, scale, scale);
  model.rotateY(90);
  object.add(model);
  return object;
};
