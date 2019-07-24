import { playerInterface, PlayerControls } from './Keyboard';
import { Observable } from 'rxjs';

export const playerControls = (gameClock$: Observable<number>): PlayerControls[] => [
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
