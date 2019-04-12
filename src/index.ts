import { GameScene } from './Game/Scene/GameScene';
import { rocketFactory } from './Rocket/RocketModel';
import { interval, fromEvent, animationFrameScheduler } from 'rxjs';

const ROCKET_SIZE = 1;

const animationClock$ = interval(1000 / 60, animationFrameScheduler);
const windowSize$ = fromEvent(window, 'resize');

const gameScene = new GameScene(animationClock$, windowSize$);
gameScene.mount(document.getElementById('game'));

const rocket = rocketFactory(ROCKET_SIZE, 0xffffff);
gameScene.addPlayer(rocket);
