import { schedulerFactory } from '../utils';
import filterRatio from './filterRatio';

it('should return half the values', (): void => {
  const scheduler = schedulerFactory();

  scheduler.run(
    ({ cold, expectObservable }): void => {
      const input = 'aaaaaaaa';
      const expected = 'a-a-a-a-';

      const map = { a: 0 };
      const input$ = cold(input, map);

      expectObservable(filterRatio(input$, 0.5)).toBe(expected, map);
    },
  );
});

it('should return quorter of the values', (): void => {
  const scheduler = schedulerFactory();

  scheduler.run(
    ({ cold, expectObservable }): void => {
      const input = 'aaaaaaaa';
      const expected = 'a---a---';

      const map = { a: 0 };
      const input$ = cold(input, map);

      expectObservable(filterRatio(input$, 0.25)).toBe(expected, map);
    },
  );
});
