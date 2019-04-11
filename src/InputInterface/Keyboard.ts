import { fromEvent, merge, Observable, combineLatest } from 'rxjs';
import { filter, mapTo, distinctUntilChanged, map, debounceTime } from 'rxjs/operators';

const keyDown$ = fromEvent(window, 'keydown');
const keyUp$ = fromEvent(window, 'keyup');

const filterKey = (value: string): (({  }: KeyboardEvent) => boolean) => ({ key }: KeyboardEvent): boolean =>
  key === value;

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

export const opposingValues = (negative$: Observable<boolean>, positive$: Observable<boolean>): Observable<number> =>
  combineLatest(
    negative$.pipe(map((value): number => (value ? -1 : 0))),
    positive$.pipe(map((value): number => (value ? 1 : 0))),
  ).pipe(
    map(([negative, positive]): number => negative + positive),
    debounceTime(0),
  );

export const playerAInterface = {
  throttling$: keyPressed('w'),
  yaw$: opposingValues(keyPressed('a'), keyPressed('d')),
};
