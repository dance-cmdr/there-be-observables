import { GameScene } from './Client/GameScene';
import { interval, fromEvent, animationFrameScheduler, empty } from 'rxjs';
import { withLatestFrom, throttleTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
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
const FPS = 120;

const gameClock$ = interval(1000 / FPS, animationFrameScheduler);
const windowSize$ = fromEvent(window, 'resize');

const gameScene = new GameScene(gameClock$, windowSize$);
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

spaceCraftFactory({
  WORLD_SCALE,
  throttling$,
  yaw$,
  gameClock$,
  enginePower: 3000000,
  mass: 500,
  rocket: player,
  initialVelocity: new Vector3(0.06, 0, 0),
});

const projectiles: Object3D[] = [];
fire$.subscribe(() => {
  const projectile = projectileLoader.parse(projectileModel);

  spaceObjectFactory({
    gameClock$,
    model: projectile,
    velocity: acceleration(1, 1000000 / WORLD_SCALE, orientation(player.up, player.rotation)),
    position: player.position.clone().add(orientation(player.up, player.rotation)),
    mass: 1000,
  });

  gameScene.add(projectile);
  projectiles.push(projectile);
});

// collider

const raycaster = new Raycaster();

gameClock$
  .pipe(
    map(() => {
      // TODO improve the observable maps
      const earth = gameScene.earth;

      return projectiles.reduce((acc, object) => {
        raycaster.set(earth.children[0].position, object.position.clone().normalize());
        const collision = raycaster.intersectObject(object);
        if (collision[0] && collision[0].distance < 4) {
          return [...acc, ...raycaster.intersectObject(object)];
        }
        return acc;
      }, []);
    }),
    filter(val => val.length > 1),
  )
  .subscribe(colisions => {
    //  TODO fix filtering code
    console.log(colisions);
    colisions.forEach(colision => {
      console.log(colision);
      console.log(projectiles.indexOf(colision.object));
      projectiles.splice(projectiles.indexOf(colision.object), 1);
      gameScene.remove(colision.object);
    });
  });
