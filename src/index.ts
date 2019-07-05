import { GameScene } from './Game/Scene/GameScene';
import { interval, fromEvent, animationFrameScheduler, empty, from, timer } from 'rxjs';
import { filter, zip, map, withLatestFrom, startWith, throttleTime } from 'rxjs/operators';
import { playerInterface } from './InputInterface/Keyboard';
import { spaceCraftFactory, acceleration, orientation } from './SpaceCraft/SpaceCraft';
import { Vector3, ObjectLoader, Group } from 'three';
import rocketModel from './Rocket/model.json';
import projectileModel from './Projectile/icosahedron.json';
import filterRatio from './utils/filterRatio';

const WORLD_SCALE = 10000000;
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

const projectiles = [];
const fireProjectile$ = fire$.pipe(throttleTime(50));

fireProjectile$.pipe(withLatestFrom(velocity$)).subscribe(
  ([_, velocity]): void => {
    const projectile = projectileLoader.parse(projectileModel);

    projectiles.push(
      spaceCraftFactory({
        WORLD_SCALE,
        throttling$: empty(),
        yaw$: empty(),
        gameClock$,
        enginePower: 0,
        mass: 1000,
        rocket: projectile,
        initialVelocity: acceleration(1, 1200000 / WORLD_SCALE, orientation(player.up, player.rotation)).add(velocity),
      }),
    );

    projectile.position.add(player.position);

    gameScene.add(projectile);
  },
);
// gameClock$.subscribe(console.log.bind(null, 'c'));

// gameClock$.subscribe(() => {
//   //   const direction = rocket.up.clone().applyEuler(rocket.rotation);
//   //   const thrust = direction.clone().multiplyScalar(0.005);
//   //   //   rocket.position.addVectors(rocket.position, velocity);
// });
