import { fromEvent, merge, Observable, combineLatest } from 'rxjs';
import {
  filter,
  mapTo,
  distinctUntilChanged,
  map,
  debounceTime,
  startWith,
  withLatestFrom,
  throttleTime,
} from 'rxjs/operators';

const keyDown$ = fromEvent(window, 'keydown');
const keyUp$ = fromEvent(window, 'keyup');

const filterKey = (value: string): (({  }: KeyboardEvent) => boolean) => ({
  code,
}: KeyboardEvent): boolean => code === value;

export const keyPressed = (key: string): Observable<boolean> =>
  merge(
    keyDown$.pipe(
      filter(filterKey(key)),
      mapTo(true),
    ),
    keyUp$.pipe(
      filter(filterKey(key)),
      mapTo(false),
    ),
  ).pipe(distinctUntilChanged());

export const keyHold = (gameClock$: Observable<number>, key: string): Observable<boolean> =>
  gameClock$.pipe(
    withLatestFrom(keyPressed(key)),
    map(([_, pressed]) => pressed),
    filter(val => val === true),
    throttleTime(100),
  );

export const opposingValues = (
  negative$: Observable<boolean>,
  positive$: Observable<boolean>,
): Observable<number> =>
  combineLatest(
    negative$.pipe(
      map((value): number => (value ? 1 : 0)),
      startWith(0),
    ),
    positive$.pipe(
      map((value): number => (value ? -1 : 0)),
      startWith(0),
    ),
  ).pipe(
    map(([negative, positive]): number => negative + positive),
    debounceTime(0),
  );

export interface PlayerControls {
  throttling$: Observable<boolean>;
  yaw$: Observable<number>;
  fire$: Observable<boolean>;
}

export interface PlayerControlKeys {
  throttlingKey: string;
  yawLeftKey: string;
  yawRightKey: string;
  fireKey: string;
  gameClock$: Observable<number>;
}

export const playerInterface = (keys: PlayerControlKeys): PlayerControls => ({
  throttling$: keyPressed(keys.throttlingKey),
  yaw$: opposingValues(keyPressed(keys.yawLeftKey), keyPressed(keys.yawRightKey)),
  fire$: keyHold(keys.gameClock$, keys.fireKey),
});
