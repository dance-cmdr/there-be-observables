import { Vector3, Object3D, Euler } from 'three';
import { Observable } from 'rxjs';
import { map, withLatestFrom, scan } from 'rxjs/operators';

export function acceleration(mass: number, force: number, orientation: Vector3): Vector3 {
  return orientation.multiplyScalar(force / mass);
}

export function direction(up: Vector3, rotation: Euler): Vector3 {
  return up.clone().applyEuler(rotation);
}

interface SpaceCraftConfig {
  throttling$: Observable<boolean>;
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
          return acceleration(config.mass, config.enginePower, direction(config.rocket.up, config.rocket.rotation));
        }
        return new Vector3(0, 0, 0);
      },
    ),
  );

  const velocity$: Observable<Vector3> = config.gameClock$.pipe(
    withLatestFrom(acceleration$),
    map(([_, acceleration]): Vector3 => acceleration),
    scan((velocity, acceleration): Vector3 => velocity.clone().add(acceleration), config.initialVelocity),
  );

  const position$: Observable<Vector3> = velocity$.pipe(
    scan((position, velocity): Vector3 => position.clone().add(velocity), config.rocket.position.clone()),
  );

  velocity$.subscribe(
    (velocity: Vector3): void => {
      config.rocket.position.add(velocity);
    },
  );
}
