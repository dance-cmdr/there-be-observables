import { Vector3, Object3D, Euler } from 'three';
import { Observable } from 'rxjs';
import { map, withLatestFrom, scan, tap, startWith } from 'rxjs/operators';
import { G } from '../Physics/constants';

export function acceleration(mass: number, force: number, orientation: Vector3): Vector3 {
  return orientation.multiplyScalar(force / mass);
}

export function orientation(up: Vector3, rotation: Euler): Vector3 {
  return up.clone().applyEuler(rotation);
}

export function directionOfAFromB(a: Vector3, b: Vector3): Vector3 {
  return new Vector3().subVectors(b, a).normalize();
}

export function gAcceleration(position: Vector3, mass: number): Vector3 {
  return directionOfAFromB(position, new Vector3(0, 0, 0)).multiplyScalar(mass * G);
}

interface SpaceCraftConfig {
  WORLD_SCALE: number;
  throttling$: Observable<boolean>;
  yaw$: Observable<number>;
  gameClock$: Observable<number>;
  enginePower: number;
  mass: number;
  rocket: Object3D;
  initialVelocity: Vector3;
  velocity$?: Observable<Vector3>;
  position$?: Observable<Vector3>;
}

export function spaceCraftFactory(config: SpaceCraftConfig): SpaceCraftConfig {
  const acceleration$: Observable<Vector3> = config.throttling$.pipe(
    map(
      (throttles): Vector3 => {
        if (throttles) {
          return acceleration(
            config.mass,
            config.enginePower / config.WORLD_SCALE,
            orientation(config.rocket.up, config.rocket.rotation),
          );
        }
        return new Vector3(0, 0, 0);
      },
    ),
    startWith(new Vector3(0, 0, 0)),
  );

  const velocity$: Observable<Vector3> = config.gameClock$.pipe(
    withLatestFrom(acceleration$),
    map(([_, acceleration]): Vector3 => acceleration),
    scan(
      (velocity, acceleration): Vector3 =>
        velocity
          .clone()
          .add(acceleration)
          .add(gAcceleration(config.rocket.position, config.mass).divideScalar(config.WORLD_SCALE)),
      config.initialVelocity,
    ),
    startWith(config.initialVelocity),
  );

  velocity$.subscribe(
    (velocity: Vector3): void => {
      config.rocket.position.add(velocity);
    },
  );

  const spinVelocity$: Observable<number> = config.gameClock$.pipe(
    withLatestFrom(config.yaw$),
    map(([_, yaw]): number => yaw / 50),
  );

  spinVelocity$.subscribe(
    (spinVelocity: number): void => {
      config.rocket.rotateZ(spinVelocity);
    },
  );

  return {
    ...config,
    velocity$,
  };
}
