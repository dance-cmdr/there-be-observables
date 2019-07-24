import { Object3D } from 'three';

import { StartingPosition } from '../Game/constants';

export const setObjectPositon = (object: Object3D, { position, angle }: StartingPosition): void => {
  object.position.x = position.x;
  object.position.y = position.y;
  object.position.z = position.z;
  object.rotation.set(angle.x, angle.y, angle.z);
  object.visible = true;
};
