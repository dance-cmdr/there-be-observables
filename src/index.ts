import { GameScene } from './Client/GameScene';
import { interval, fromEvent, animationFrameScheduler, from } from 'rxjs';
import { map, filter, exhaustMap } from 'rxjs/operators';
import { spaceCraftDestroyed, prepareSpawnSpaceCraftWithId } from './Spacecraft/SpaceCraft';
import { ObjectLoader } from 'three';


import rocketModelRaw from './Graphics/Rocket/model.json?raw';
const rocketModel = JSON.parse(rocketModelRaw);

import { collisionDetection, COLLISION_TYPES } from './CollisionDetection';
import { initialiseProjectiles, destroyProjectileWithIndex } from './Projectiles';
import { playerObjectFactory } from './PlayerObject';
import {
  FPS,
  EARTH_RADIUS,
  PLAYER_OBJECT_SCALE,
  PLAYER_STARTING_POSITIONS,
} from './Game/constants';
import { playerControls } from './Client/PlayerControls';
import { scoreBoard } from './Game/ScoreKeeping';

const gameClock$ = interval(1000 / FPS, animationFrameScheduler);

const windowSize$ = fromEvent(window, 'resize');
const gameScene = new GameScene(gameClock$, windowSize$, EARTH_RADIUS);
gameScene.mount(document.getElementById('game'));

// Model Loaders
const rocketLoader = new ObjectLoader();

const PLAYER_OBJECTS = [
  playerObjectFactory(rocketLoader.parse(rocketModel), PLAYER_OBJECT_SCALE),
  playerObjectFactory(rocketLoader.parse(rocketModel), PLAYER_OBJECT_SCALE, 0xff0000),
];

gameScene.add(...PLAYER_OBJECTS);

const PLAYER_CONTROLS = playerControls(gameClock$);

/**
 * Initialise SpaceCraft
 */

const spawnSpaceCraftWithId = prepareSpawnSpaceCraftWithId(
  PLAYER_CONTROLS,
  PLAYER_OBJECTS,
  PLAYER_STARTING_POSITIONS,
  gameClock$,
);

const spaceCrafts = PLAYER_OBJECTS.map((playerObject, index) => spawnSpaceCraftWithId(index));

/**
 * Projectiles
 */

const { activeProjectiles } = initialiseProjectiles(gameScene);

/**
 * Collision Detection
 */
const collisions$ = collisionDetection(gameClock$, gameScene.earth, activeProjectiles, spaceCrafts);

collisions$
  .pipe(
    map(collisions => collisions.filter(({ type }) => type === COLLISION_TYPES.EARTH)),
    filter(collidingIndeces => !!collidingIndeces.length),
  )
  .subscribe(collisions => {
    collisions.forEach(({ index }) => destroyProjectileWithIndex(index));
  });

const playerCollision$ = collisions$.pipe(
  exhaustMap(collisions => from(collisions)),
  filter(({ type }) => type === COLLISION_TYPES.PLAYER),
  filter(({ spaceCraft }) => spaceCraft && spaceCraft.model.visible),
);

const deaths$ = playerCollision$.pipe(map(({ spaceCraft }) => spaceCraft));

scoreBoard(document, spaceCrafts, deaths$);

playerCollision$.subscribe(({ index, spaceCraft }) => {
  destroyProjectileWithIndex(index);
  spaceCraftDestroyed(spaceCraft, spawnSpaceCraftWithId, spaceCrafts);
});
