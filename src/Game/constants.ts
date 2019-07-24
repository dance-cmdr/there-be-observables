import { Vector3 } from 'three';

export const PLAYER_OBJECT_SCALE = 0.1;
export const FPS = 60;
export const EARTH_RADIUS = 5;

export interface StartingPosition {
  position: Vector3;
  angle: Vector3;
  velocity: Vector3;
}

export const PLAYER_STARTING_POSITIONS: StartingPosition[] = [
  {
    position: new Vector3(0, EARTH_RADIUS * 1.25, 0),
    angle: new Vector3(0, 0, 0),
    velocity: new Vector3(0.06, 0, 0),
  },
  {
    position: new Vector3(0, EARTH_RADIUS * 1.25 * -1, 0),
    angle: new Vector3(0, 0, 0.4),
    velocity: new Vector3(-0.06, 0, 0),
  },
];
