import { GameScene } from './Game/Scene/GameScene';
import { rocketFactory } from './Rocket/RocketModel';
import { interval, fromEvent, animationFrameScheduler } from 'rxjs';
import { playerInterface } from './InputInterface/Keyboard';
import { spaceCraftFactory } from './SpaceCraft/SpaceCraft';
import { Vector3 } from 'three';

const ROCKET_SIZE = 1;

const gameClock$ = interval(1, animationFrameScheduler);
const windowSize$ = fromEvent(window, 'resize');

const gameScene = new GameScene(gameClock$, windowSize$);
gameScene.mount(document.getElementById('game'));

const rocket = rocketFactory(ROCKET_SIZE, 0xffffff);
const { throttling$, yaw$ } = playerInterface({
  throttlingKey: 'w',
  yawLeftKey: 'a',
  yawRightKey: 'd',
});

gameScene.addPlayer(rocket);

spaceCraftFactory({
  throttling$,
  yaw$,
  gameClock$,
  enginePower: 200000,
  mass: 100,
  rocket,
  initialVelocity: new Vector3(0, 0, 0),
});

// gameClock$.subscribe(() => {
//   //   const direction = rocket.up.clone().applyEuler(rocket.rotation);
//   //   const thrust = direction.clone().multiplyScalar(0.005);
//   //   //   rocket.position.addVectors(rocket.position, velocity);
// });
