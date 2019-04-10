import { fromEvent, merge, Observable } from 'rxjs';

import { filter, mapTo, distinctUntilChanged } from 'rxjs/operators';

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
