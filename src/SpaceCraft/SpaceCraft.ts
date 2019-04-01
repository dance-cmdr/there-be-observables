import { simpleThrustFactory } from '../Engine/Engine';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, withLatestFrom, startWith, scan, distinctUntilChanged } from 'rxjs/operators';
import {
  PhPosition,
  PhVelocity,
  velocityDisplacement,
  addVectors,
  compareVectors,
  netVelocity,
} from '../Physics/physics';

export interface SpaceCraft {
  position$: Observable<PhPosition>;
  thrust$: Observable<number>;
  velocity$: Observable<PhVelocity>;
}

export interface SpaceCraftConfig {
  enginePower: number;
  mass: number;
  initialPosition: PhPosition;
  initialVelocity?: PhVelocity;
}

export interface SpaceCraftCommandInterface {
  throttling$: Observable<boolean>;
  gameClock$: Observable<number>;
}

export const positionObservable = (
  initialPosition: PhPosition,
  clock$: Observable<number>,
  velocity$: Observable<PhVelocity>,
): Observable<PhPosition> => {
  const velocityDisplacement$ = clock$.pipe(
    withLatestFrom(velocity$),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map(([_, velocity]) => velocity),
    map(velocityDisplacement),
  );

  const position$ = velocityDisplacement$.pipe(
    scan((position, displacement) => addVectors(position, displacement), { x: 0, y: 0 }),
    startWith(initialPosition),
    distinctUntilChanged(compareVectors),
  );

  return position$;
};

export const velocityObservable = (
  mass: number,
  thrust$: Observable<number>,
  initialVelocity: PhVelocity = { speed: 0, direction: 0 },
): Observable<PhVelocity> => {
  const velocity$: Observable<PhVelocity> = new BehaviorSubject(initialVelocity);

  const acceleration$: Observable<PhVelocity> = thrust$.pipe(
    withLatestFrom(velocity$),
    map(([thrust, velocity]) => ({
      speed: thrust / mass,
      direction: velocity.direction,
    })),
  );

  return acceleration$.pipe(
    scan(netVelocity, { speed: 0, direction: 0 }),
    startWith(initialVelocity),
  );
};

export const spaceCraftFactory = (CI: SpaceCraftCommandInterface, config: SpaceCraftConfig): SpaceCraft => {
  const thrust$ = simpleThrustFactory(config.enginePower, CI.throttling$);
  const velocity$: Observable<PhVelocity> = velocityObservable(config.mass, thrust$, config.initialVelocity);

  const position$ = positionObservable(config.initialPosition, CI.gameClock$, velocity$);

  return {
    position$,
    velocity$,
    thrust$,
  };
};
