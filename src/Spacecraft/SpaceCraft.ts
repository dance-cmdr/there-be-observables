import { Vector3, Object3D } from 'three';
import { Observable } from 'rxjs';
import { map, withLatestFrom, scan, startWith } from 'rxjs/operators';
import { acceleration, gAcceleration } from '../Physics/physics';
import { directionOfAFromB, orientation } from '../Physics/trigonometry';

const EARTH = new Vector3(0, 0, 0);

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map(([_, acceleration]): Vector3 => acceleration),
    scan(
      (velocity, acceleration): Vector3 =>
        velocity
          .clone()
          .add(acceleration)
          .add(
            gAcceleration(
              directionOfAFromB(config.rocket.position, EARTH),
              config.mass,
            ).divideScalar(config.WORLD_SCALE),
          ),
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
