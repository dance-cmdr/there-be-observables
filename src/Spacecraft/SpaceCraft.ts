import { Vector3, Object3D } from 'three';
import { Observable, Subscription, timer } from 'rxjs';
import { map, withLatestFrom, scan, startWith } from 'rxjs/operators';
import { acceleration, gAcceleration } from '../Physics/physics';
import { directionOfAFromB, orientation } from '../Physics/trigonometry';
import { PlayerControls } from '../Client/Keyboard';
import { StartingPosition } from '../Game/constants';
import { createProjectile } from '../Projectiles';
import { setObjectPositon } from '../utils/setPosition';
import { WORLD_SCALE } from '../Physics/constants';

const EARTH = new Vector3(0, 0, 0);

interface SpaceCraftConfig {
  id: number;
  throttling$: Observable<boolean>;
  yaw$: Observable<number>;
  gameClock$: Observable<number>;
  enginePower: number;
  mass: number;
  model: Object3D;
  initialVelocity: Vector3;
}

export interface SpaceCraft {
  id: number;
  velocity$?: Observable<Vector3>;
  model: Object3D;
  subscriptions: Subscription[];
}

export function spaceCraftFactory(config: SpaceCraftConfig): SpaceCraft {
  const acceleration$: Observable<Vector3> = config.throttling$.pipe(
    map(
      (throttles): Vector3 => {
        if (throttles) {
          return acceleration(
            config.mass,
            config.enginePower / WORLD_SCALE,
            orientation(config.model.up, config.model.rotation),
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
          .add(
            gAcceleration(
              directionOfAFromB(config.model.position, EARTH),
              config.mass,
            ).divideScalar(WORLD_SCALE),
          ),
      config.initialVelocity,
    ),
    startWith(config.initialVelocity),
  );
  const spinVelocity$: Observable<number> = config.gameClock$.pipe(
    withLatestFrom(config.yaw$),
     
    map(([_, yaw]): number => yaw / 40),
  );

  const subscriptions = [
    velocity$.subscribe((velocity: Vector3): void => {
      config.model.position.add(velocity);
    }),
    spinVelocity$.subscribe((spinVelocity: number): void => {
      config.model.rotateZ(spinVelocity);
    }),
  ];

  return {
    velocity$,
    id: config.id,
    model: config.model,
    subscriptions,
  };
}

export const spaceCraftDestroyed = (
  spaceCraft: SpaceCraft,
  spawnSpaceCraftWithId: (id: number) => SpaceCraft,
  spaceCrafts: SpaceCraft[],
): void => {
  if (!spaceCraft.model.visible) {
    return;
  }

  spaceCraft.model.visible = false;
  spaceCraft.subscriptions.forEach(sub => {
    sub.unsubscribe();
  });
  console.log(`Player ${spaceCraft.id} is DEAD`);

  const sub = timer(5000).subscribe(() => {
    spaceCrafts[spaceCraft.id] = spawnSpaceCraftWithId(spaceCraft.id);
    sub.unsubscribe();
  });
};

export const spawnSpaceCraft = (
  id: number,
  playerControls: PlayerControls,
  model: Object3D,
  startingPosition: StartingPosition,
  gameClock$: Observable<number>,
) => {
  const { yaw$, throttling$, fire$ } = playerControls;

  //create
  const spaceCraft = spaceCraftFactory({
    id,
    throttling$,
    yaw$,
    gameClock$,
    enginePower: 3000000,
    mass: 500,
    model,
    initialVelocity: startingPosition.velocity,
  });

  spaceCraft.subscriptions.push(
    fire$
      .pipe(withLatestFrom(spaceCraft.velocity$))
      .subscribe(([, velocity]) => createProjectile(gameClock$, model, velocity)),
  );

  setObjectPositon(spaceCraft.model, startingPosition);

  return spaceCraft;
};

export const prepareSpawnSpaceCraftWithId = (
  PLAYER_CONTROLS: PlayerControls[],
  PLAYER_OBJECTS: Object3D[],
  PLAYER_STARTING_POSITIONS: StartingPosition[],
  gameClock$: Observable<number>,
) => (id: number): SpaceCraft =>
  spawnSpaceCraft(
    id,
    PLAYER_CONTROLS[id],
    PLAYER_OBJECTS[id],
    PLAYER_STARTING_POSITIONS[id],
    gameClock$,
  );
