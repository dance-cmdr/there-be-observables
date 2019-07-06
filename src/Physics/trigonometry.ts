import { Vector3, Euler } from 'three';
import { G } from './constants';

export function orientation(up: Vector3, rotation: Euler): Vector3 {
  return up.clone().applyEuler(rotation);
}

export function directionOfAFromB(a: Vector3, b: Vector3): Vector3 {
  return new Vector3().subVectors(b, a).normalize();
}
