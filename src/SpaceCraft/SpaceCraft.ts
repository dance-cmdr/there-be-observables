import { Vector3, Object3D, Euler } from 'three';
import { Observable, zip } from 'rxjs';
import { map, withLatestFrom, scan, tap, combineLatest } from 'rxjs/operators';

const G = 9.8;
const WORLD_SCALE = 10000000;

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
  throttling$: Observable<boolean>;
  yaw$: Observable<number>;
  gameClock$: Observable<number>;
  enginePower: number;
  mass: number;
  rocket: Object3D;
  initialVelocity: Vector3;
}

export function spaceCraftFactory(config: SpaceCraftConfig): void {
  const acceleration$: Observable<Vector3> = config.throttling$.pipe(
    map(
      (throttles): Vector3 => {
        if (throttles) {
          return acceleration(
            config.mass,
            config.enginePower / WORLD_SCALE,
            orientation(config.rocket.up, config.rocket.rotation),
          );
        }
        return new Vector3(0, 0, 0);
      },
    ),
  );

  const velocity$: Observable<Vector3> = config.gameClock$.pipe(
    withLatestFrom(acceleration$),
    map(([_, acceleration]): Vector3 => acceleration),
    scan(
      (velocity, acceleration): Vector3 =>
        velocity
          .clone()
          .add(acceleration)
          .add(gAcceleration(config.rocket.position, config.mass).divideScalar(WORLD_SCALE)),
      config.initialVelocity,
    ),
    tap(() => console.log(directionOfAFromB(config.rocket.position, new Vector3(0, 0, 0)))),
    tap(console.log),
  );

  const position$: Observable<Vector3> = velocity$.pipe(
    scan((position, velocity): Vector3 => position.clone().add(velocity), config.rocket.position.clone()),
  );

  velocity$.subscribe(
    (velocity: Vector3): void => {
      config.rocket.position.add(velocity);
    },
  );

  const realisticSpinVelocity$: Observable<number> = config.gameClock$.pipe(
    withLatestFrom(config.yaw$),
    map(([_, yaw]): number => yaw),
    scan((yawVelocity, yawForce): number => yawVelocity + (yawForce * config.enginePower) / config.mass, 0),
    tap(console.log),
  );

  const spinVelocity$: Observable<number> = config.gameClock$.pipe(
    withLatestFrom(config.yaw$),
    map(([_, yaw]): number => yaw / 150),
  );

  spinVelocity$.subscribe(
    (spinVelocity: number): void => {
      config.rocket.rotateZ(spinVelocity);
    },
  );
}
