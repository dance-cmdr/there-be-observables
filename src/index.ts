import { GameScene } from './Client/GameScene';
import { interval, fromEvent, animationFrameScheduler, empty, timer } from 'rxjs';
import { withLatestFrom, map, filter } from 'rxjs/operators';
import { playerInterface } from './Client/Keyboard';
import { spaceCraftFactory, SpaceCraft } from './Spacecraft/SpaceCraft';
import { Vector3, ObjectLoader, Group, Object3D } from 'three';

import { spaceObjectFactory } from './Spacecraft/SpaceObject';

import rocketModel from './Graphics/Rocket/model.json';

import { WORLD_SCALE } from './Physics/constants';
import { acceleration } from './Physics/physics';
import { orientation } from './Physics/trigonometry';
import { collitionDetection, COLLISION_TYPES } from './CollisionDetection';
import { createProjectile, initialiseProjectiles, destroyProjectileWithIndex } from './Projectiles';

const ROCKET_SIZE = 0.1;
const FPS = 100;
const EARTH_RADIUS = 5;

interface StartingPosition {
  position: Vector3;
  angle: Vector3;
}

const PLAYER_STARTING_POSITIONS: StartingPosition[] = [
  {
    position: new Vector3(0, EARTH_RADIUS * 1.25, 0),
    angle: new Vector3(0, 0, 0),
  },
  {
    position: new Vector3(0, EARTH_RADIUS * 1.25 * -1, 0),
    angle: new Vector3(0, 0, 0),
  },
];

const spawn = (object: Object3D, { position, angle }: StartingPosition): void => {
  object.position.x = position.x;
  object.position.y = position.y;
  object.position.z = position.z;
  object.rotation.set(angle.x, angle.y, angle.z);
  object.visible = true;
};

const spaceCraftDestroyed = (spaceCraft: SpaceCraft): void => {
  spaceCraft.model.visible = false;
};

const playerObjectFactory = (model: Object3D): Object3D => {
  const player = new Group();
  model.scale.set(ROCKET_SIZE, ROCKET_SIZE, ROCKET_SIZE);
  model.rotateY(90);
  player.add(model);
  return player;
};

const gameClock$ = interval(1000 / FPS, animationFrameScheduler);
const windowSize$ = fromEvent(window, 'resize');

const gameScene = new GameScene(gameClock$, windowSize$, EARTH_RADIUS);

gameScene.mount(document.getElementById('game'));

const playerInterfaces = [
  playerInterface({
    throttlingKey: 'KeyW',
    yawLeftKey: 'KeyA',
    yawRightKey: 'KeyD',
    fireKey: 'KeyF',
    gameClock$,
  }),
  playerInterface({
    throttlingKey: 'ArrowUp',
    yawLeftKey: 'ArrowLeft',
    yawRightKey: 'ArrowRight',
    fireKey: 'AltRight',
    gameClock$,
  }),
];

// Model Loaders
const rocketLoader = new ObjectLoader();

const playerObjects = [
  playerObjectFactory(rocketLoader.parse(rocketModel)),
  playerObjectFactory(rocketLoader.parse(rocketModel)),
];

/**
 * Initialise SpaceCraft
 */
const spaceCrafts = playerObjects.map((playerObject, index) => {
  const { yaw$, throttling$, fire$ } = playerInterfaces[index];

  //create
  const spaceCraft = spaceCraftFactory({
    id: index,
    WORLD_SCALE,
    throttling$,
    yaw$,
    gameClock$,
    enginePower: 3000000,
    mass: 500,
    model: playerObject,
    initialVelocity: new Vector3(0.06, 0, 0),
  });

  fire$
    .pipe(withLatestFrom(spaceCraft.velocity$))
    .subscribe(([_, velocity]) => createProjectile(gameClock$, playerObject, velocity));

  // initialise
  gameScene.add(spaceCraft.model);
  spawn(spaceCraft.model, PLAYER_STARTING_POSITIONS[spaceCraft.id]);

  return spaceCraft;
});

/**
 * Projectiles
 */

const { activeProjectiles } = initialiseProjectiles(gameScene);

/**
 * Collision Detection
 */
const collisions$ = collitionDetection(gameClock$, gameScene.earth, activeProjectiles, spaceCrafts);

collisions$
  .pipe(
    map(collisions => collisions.filter(({ type }) => type === COLLISION_TYPES.EARTH)),
    filter(collidingIndeces => !!collidingIndeces.length),
  )
  .subscribe(collisions => {
    collisions.forEach(({ index }) => destroyProjectileWithIndex(index));
  });

collisions$
  .pipe(
    map(collisions => collisions.filter(({ type }) => type === COLLISION_TYPES.PLAYER)),
    filter(collidingIndeces => !!collidingIndeces.length),
  )
  .subscribe(collisions => {
    collisions.forEach(({ index, spaceCraft }) => {
      destroyProjectileWithIndex(index);
      console.log(collisions, `Player ${spaceCraft.id} is DEAD`);
      spaceCraftDestroyed(spaceCraft);
      timer(5000).subscribe(() => {
        spawn(spaceCraft.model, PLAYER_STARTING_POSITIONS[spaceCraft.id]);
      });
    });
  });
