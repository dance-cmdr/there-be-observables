import { simpleThrustFactory } from '../Engine/Engine';
import { Observable, of } from 'rxjs';
import { PhPosition } from '../Physics/physics';

export interface SpaceCraft {
  position$: Observable<PhPosition>;
  thrust$: Observable<number>;
}

export interface SpaceCraftConfig {
  enginePower: number;
  initialPosition: PhPosition;
}

export interface SpaceCraftCommandInterface {
  throttling$: Observable<boolean>;
}

export const spaceCraftFactory = (CI: SpaceCraftCommandInterface, config: SpaceCraftConfig): SpaceCraft => {
  return {
    position$: of(config.initialPosition),
    thrust$: simpleThrustFactory(config.enginePower, CI.throttling$),
  };
};
