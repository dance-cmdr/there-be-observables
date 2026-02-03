import { opposingValues } from './Keyboard';
import { schedulerFactory } from '../utils';

describe('describe keyboard', (): void => {
  describe('opposingValues', (): void => {
    it('returns positive when only positive input is pressed', (): void => {
      const scheduler = schedulerFactory();

      scheduler.run(
        ({ cold, expectObservable }): void => {
          // When only one input changes, we get clean emissions
          const expected = 'a-b-a-|';
          const values = { a: 0, b: 1 };

          const n$ = cold('a-a-a-|', { a: false }); // never pressed
          const p$ = cold('a-b-a-|', { a: false, b: true });

          const balance$ = opposingValues(n$, p$);

          expectObservable(balance$).toBe(expected, values);
          return;
        },
      );
    });

    it('returns negative when only negative input is pressed', (): void => {
      const scheduler = schedulerFactory();

      scheduler.run(
        ({ cold, expectObservable }): void => {
          const expected = 'a-b-a-|';
          const values = { a: 0, b: -1 };

          const n$ = cold('a-b-a-|', { a: false, b: true });
          const p$ = cold('a-a-a-|', { a: false }); // never pressed

          const balance$ = opposingValues(n$, p$);

          expectObservable(balance$).toBe(expected, values);
          return;
        },
      );
    });

    it('returns zero when both inputs start false', (): void => {
      const scheduler = schedulerFactory();

      scheduler.run(
        ({ cold, expectObservable }): void => {
          const expected = 'a-|';
          const values = { a: 0 };

          const n$ = cold('a-|', { a: false });
          const p$ = cold('a-|', { a: false });

          const balance$ = opposingValues(n$, p$);

          expectObservable(balance$).toBe(expected, values);
          return;
        },
      );
    });
  });
});
