import { opposingValues } from './Keyboard';
import { schedulerFactory } from '../../utils';

describe('describe keyboard', (): void => {
  describe('opposingValues', (): void => {
    it('thrust is 1 as long as throttling is true', (): void => {
      const scheduler = schedulerFactory();

      scheduler.run(
        ({ cold, expectObservable }): void => {
          const expected = 'a-a-a-|';
          const values = { a: 0 };

          const n$ = cold('a-b-a-|', { a: false, b: true });
          const p$ = cold('a-b-a-|', { a: false, b: true });

          const balance$ = opposingValues(n$, p$);

          expectObservable(balance$).toBe(expected, values);
          return;
        },
      );
    });
  });
});
