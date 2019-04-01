import { simpleThrustFactory } from '../Engine/Engine';
import { Observable, of } from 'rxjs';
import { map, withLatestFrom, startWith, scan, distinctUntilChanged } from 'rxjs/operators';
import { PhPosition, PhVelocity, velocityDisplacement, addVectors, compareVectors } from '../Physics/physics';

export interface SpaceCraft {
  position$: Observable<PhPosition>;
  thrust$: Observable<number>;
  velocity$: Observable<PhVelocity>;
}

export interface SpaceCraftConfig {
  enginePower: number;
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
    scan((position, displacement) => addVectors(position, displacement), initialPosition),
    startWith(initialPosition),
    distinctUntilChanged(compareVectors),
  );

  return position$;
};

export const spaceCraftFactory = (CI: SpaceCraftCommandInterface, config: SpaceCraftConfig): SpaceCraft => {
  const thrust$ = simpleThrustFactory(config.enginePower, CI.throttling$);
  const velocity$ = of(config.initialVelocity || { speed: 0, direction: 0 });
  const position$ = positionObservable(config.initialPosition, CI.gameClock$, velocity$);

  return {
    position$,
    velocity$,
    thrust$,
  };
};
