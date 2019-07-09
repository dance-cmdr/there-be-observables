import { GameScene } from './Client/GameScene';
import { interval, fromEvent, animationFrameScheduler, empty } from 'rxjs';
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
import { spaceCraftFactory } from './Spacecraft/SpaceCraft';
import { Vector3, ObjectLoader, Group, Raycaster, Object3D, Mesh } from 'three';

import { spaceObjectFactory } from './Spacecraft/SpaceObject';

import rocketModel from './Graphics/Rocket/model.json';
import projectileModel from './Graphics/Projectile/icosahedron.json';

import { WORLD_SCALE } from './Physics/constants';
import { acceleration } from './Physics/physics';
import { orientation } from './Physics/trigonometry';

const ROCKET_SIZE = 0.1;
const FPS = 100;

const gameClock$ = interval(1000 / FPS, animationFrameScheduler);
const windowSize$ = fromEvent(window, 'resize');

const gameScene = new GameScene(gameClock$, windowSize$);
const { EARTH_RADIUS } = gameScene;
gameScene.mount(document.getElementById('game'));

const { throttling$, yaw$, fire$ } = playerInterface({
  throttlingKey: 'w',
  yawLeftKey: 'a',
  yawRightKey: 'd',
  fireKey: 'f',
  gameClock$,
});

const rocketLoader = new ObjectLoader();
const rocket = rocketLoader.parse(rocketModel);

const projectileLoader = new ObjectLoader();

const player = new Group();
rocket.scale.set(ROCKET_SIZE, ROCKET_SIZE, ROCKET_SIZE);
rocket.rotateY(90);
player.add(rocket);

gameScene.addPlayer(player);

const { velocity$ } = spaceCraftFactory({
  WORLD_SCALE,
  throttling$,
  yaw$,
  gameClock$,
  enginePower: 3000000,
  mass: 500,
  rocket: player,
  initialVelocity: new Vector3(0.06, 0, 0),
});

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

const createProjectile = (velocity: Vector3 = new Vector3(0, 0, 0)): void => {
  const prj = projectiles[cp];
  prj.userData.spaceObject = spaceObjectFactory({
    gameClock$,
    model: prj,
    velocity: acceleration(1, 1000000 / WORLD_SCALE, orientation(player.up, player.rotation)).add(
      velocity,
    ),
    position: player.position.clone().add(orientation(player.up, player.rotation)),
    mass: 1000,
  });

  prj.visible = true;

  activeProjectiles.set(cp, prj);

  cp++;

  if (cp > projectiles.length - 1) {
    cp = 0;
  }
};

fire$.pipe(withLatestFrom(velocity$)).subscribe(([_, velocity]) => createProjectile(velocity));

// collider
const raycaster = new Raycaster();

const detectCollision = (origin: Mesh | Group, object: Object3D, radius: number): boolean => {
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

const collisions$ = gameClock$.pipe(
  map(() => {
    // Raycast for collisions and return if the current projectile collides
    const earth = gameScene.earth;
    const collisionsList = [];

    for (let [index, object] of activeProjectiles.entries()) {
      if (detectCollision(earth, object, earth.geometry.boundingSphere.radius)) {
        collisionsList.push({
          index,
          type: COLLISION_TYPES.EARTH,
        });
      }

      if (detectCollision(player, object, 0.75)) {
        collisionsList.push({
          index,
          type: COLLISION_TYPES.PLAYER,
        });
      }
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
    collisions.forEach(({ index }) => destroyProjectileWithIndex(index));
    console.log(collisions, 'YOU ARE DEAD');
  });
