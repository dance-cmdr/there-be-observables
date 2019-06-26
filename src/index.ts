import { GameScene } from './Game/Scene/GameScene';
import { interval, fromEvent, animationFrameScheduler } from 'rxjs';
import { playerInterface } from './InputInterface/Keyboard';
import { spaceCraftFactory } from './SpaceCraft/SpaceCraft';
import { Vector3, ObjectLoader, Group } from 'three';
import rocketModel from './Rocket/model.json';

const ROCKET_SIZE = 0.1;

const gameClock$ = interval(1, animationFrameScheduler);
const windowSize$ = fromEvent(window, 'resize');

const gameScene = new GameScene(gameClock$, windowSize$);
gameScene.mount(document.getElementById('game'));

const { throttling$, yaw$ } = playerInterface({
  throttlingKey: 'w',
  yawLeftKey: 'a',
  yawRightKey: 'd',
});

const loader = new ObjectLoader();
const rocket = loader.parse(rocketModel);
const player = new Group();
rocket.scale.set(ROCKET_SIZE, ROCKET_SIZE, ROCKET_SIZE);
rocket.rotateY(90);
player.add(rocket);

gameScene.addPlayer(player);

spaceCraftFactory({
  throttling$,
  yaw$,
  gameClock$,
  enginePower: 200000,
  mass: 100,
  rocket: player,
  initialVelocity: new Vector3(0, 0, 0),
});

// gameClock$.subscribe(() => {
//   //   const direction = rocket.up.clone().applyEuler(rocket.rotation);
//   //   const thrust = direction.clone().multiplyScalar(0.005);
//   //   //   rocket.position.addVectors(rocket.position, velocity);
// });
