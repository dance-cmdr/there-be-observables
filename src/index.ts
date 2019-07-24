import { GameScene, StartingPosition } from './Client/GameScene';
import { interval, fromEvent, animationFrameScheduler, empty, timer } from 'rxjs';
import {
  withLatestFrom,
  throttleTime,
  map,
  distinctUntilChanged,
  filter,
  tap,
  delay,
  mapTo,
} from 'rxjs/operators';
import { playerInterface } from './Client/Keyboard';
import { spaceCraftFactory, SpaceCraft } from './Spacecraft/SpaceCraft';
import { Vector3, ObjectLoader, Group, Raycaster, Object3D, Mesh } from 'three';

import { spaceObjectFactory } from './Spacecraft/SpaceObject';

import rocketModel from './Graphics/Rocket/model.json';
import projectileModel from './Graphics/Projectile/icosahedron.json';

import { WORLD_SCALE } from './Physics/constants';
import { acceleration } from './Physics/physics';
import { orientation } from './Physics/trigonometry';

const ROCKET_SIZE = 0.1;
const FPS = 100;

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

const gameScene = new GameScene(gameClock$, windowSize$);

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
const projectileLoader = new ObjectLoader();

//
const playerObjects = [
  playerObjectFactory(rocketLoader.parse(rocketModel)),
  playerObjectFactory(rocketLoader.parse(rocketModel)),
];

const PROJECTILES_LENGTH = 1000;
const projectile = projectileLoader.parse(projectileModel);
const projectiles: Object3D[] = new Array(PROJECTILES_LENGTH);
const activeProjectiles: Map<number, Object3D> = new Map();

for (let i = 0; i < PROJECTILES_LENGTH; i++) {
  const prj = projectile.clone(false);
  projectiles[i] = prj;
  prj.visible = false;
  prj.userData.index = i;
  gameScene.add(prj);
}
let cp = 0;

const destroyProjectileWithIndex = (index: number): void => {
  const projectile = projectiles[index];
  projectile.visible = false;
  if (projectile.userData.spaceObject) {
    projectile.userData.spaceObject.dispose();
  }
  activeProjectiles.delete(index);
};

const createProjectile = (originator: Object3D, velocity: Vector3 = new Vector3(0, 0, 0)): void => {
  const prj = projectiles[cp];
  prj.userData.spaceObject = spaceObjectFactory({
    gameClock$,
    model: prj,
    velocity: acceleration(
      1,
      1000000 / WORLD_SCALE,
      orientation(originator.up, originator.rotation),
    ).add(velocity),
    position: originator.position.clone().add(orientation(originator.up, originator.rotation)),
    mass: 1000,
  });

  prj.visible = true;

  activeProjectiles.set(cp, prj);

  cp++;

  if (cp > projectiles.length - 1) {
    cp = 0;
  }
};

// initialise spaceCrafts
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
    .subscribe(([_, velocity]) => createProjectile(playerObject, velocity));

  // initialise
  gameScene.add(spaceCraft.model);
  spawn(spaceCraft.model, gameScene.PLAYER_STARTING_POSITIONS[spaceCraft.id]);

  return spaceCraft;
});

// Collision Detection
const raycaster = new Raycaster();

const detectCollision = (
  origin: Mesh | Group | Object3D,
  object: Object3D,
  radius: number,
): boolean => {
  raycaster.set(origin.position, object.position.clone().normalize());
  const collisions = raycaster.intersectObject(object);
  const collision = collisions.find(
    collision => collision.object.uuid === object.uuid && collision.distance < radius,
  );

  return !!collision;
};

const COLLISION_TYPES = {
  EARTH: 'earth',
  PLAYER: 'player',
};

interface Collision {
  index: number;
  type: string;
  object: Object3D;
  spaceCraft?: SpaceCraft;
}

const collisions$ = gameClock$.pipe(
  map(() => {
    // Raycast for collisions and return if the current projectile collides
    const earth = gameScene.earth;
    const collisionsList: Collision[] = [];

    for (let [index, object] of activeProjectiles.entries()) {
      // projectile to earth collision
      if (detectCollision(earth, object, earth.geometry.boundingSphere.radius)) {
        collisionsList.push({
          index,
          type: COLLISION_TYPES.EARTH,
          object,
        });
      }

      // spaceCraft to Projectile Collision detection
      spaceCrafts.forEach(spaceCraft => {
        if (detectCollision(spaceCraft.model, object, 0.75)) {
          collisionsList.push({
            index,
            type: COLLISION_TYPES.PLAYER,
            object: spaceCraft.model,
            spaceCraft,
          });
        }
      });
    }

    return collisionsList.reverse();
  }),
);

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
        spawn(spaceCraft.model, gameScene.PLAYER_STARTING_POSITIONS[spaceCraft.id]);
      });
    });
  });
