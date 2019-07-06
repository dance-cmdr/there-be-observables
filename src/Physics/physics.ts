import { Vector3 } from 'three';
import { directionOfAFromB } from './trigonometry';
import { WORLD_SCALE, G } from './constants';

export function acceleration(mass: number, force: number, orientation: Vector3): Vector3 {
  return orientation.multiplyScalar(force / mass);
}

export function gAcceleration(direction: Vector3, mass: number): Vector3 {
  return direction.multiplyScalar(mass * G);
}

export function gAccelerationTowardsEarth(position: Vector3, mass: number): Vector3 {
  return gAcceleration(directionOfAFromB(position, new Vector3(0, 0, 0)), mass).divideScalar(
    WORLD_SCALE,
  );
}
