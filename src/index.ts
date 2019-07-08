import { GameScene } from './Client/GameScene';
import { interval, fromEvent, animationFrameScheduler, empty } from 'rxjs';
import {
  withLatestFrom,
  throttleTime,
  map,
  distinctUntilChanged,
  filter,
  tap,
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
const FPS = 60;

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

for (let i = 0; i < PROJECTILES_LENGTH; i++) {
  console.log(i);
  const prj = projectile.clone(false);
  projectiles[i] = prj;
  prj.visible = false;
  gameScene.add(prj);
}
let cp = 0;

fire$.pipe(withLatestFrom(velocity$)).subscribe(([_, velocity]) => {
  const prj = projectiles[cp];

  console.log(prj);

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

  cp++;
  if (cp > projectiles.length - 1) {
    cp = 0;
  }

  console.log(cp);
});

// collider
const raycaster = new Raycaster();

const destroyProjectileWithIndex = (index: number): void => {
  const projectile = projectiles[index];
  projectile.visible = false;
  projectile.userData.spaceObject.dispose();
  console.log('projectiles ', projectiles.length);
};

gameClock$
  .pipe(
    map(() => {
      // Raycast for collisions and return if the current projectile collides
      const earth = gameScene.earth;

      return projectiles.reduce((acc, object) => {
        raycaster.set(earth.children[0].position, object.position.clone().normalize());
        const collisions = raycaster.intersectObject(object);
        const collision = collisions.find(collision => collision.object === object);
        return [...acc, ...(collision ? [collision] : [])];
      }, []);
    }),
    map(collisions => collisions.filter(({ distance }) => distance < EARTH_RADIUS)),
    map(collisions => collisions.map(({ object }) => object)),
    map(collidingObjects =>
      projectiles.reduce((acc, projectile, index) => {
        if (collidingObjects.indexOf(projectile) > -1) {
          return [index, ...acc];
        }
        return acc;
      }, []),
    ),
  )
  .subscribe(collidingProjectileIndeces => {
    collidingProjectileIndeces.forEach(destroyProjectileWithIndex);
  });
