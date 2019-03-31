import { simpleThrustFactory } from './Engine';
import { schedulerFactory } from '../utils';

describe('Engine', () => {
  describe('throttle', () => {
    it('thrust is 1 as long as throttling is true', () => {
      const scheduler = schedulerFactory();
      scheduler.run(helpers => {
        const { cold, expectObservable } = helpers;

        const throttling$ = cold('a-b-a-|', { a: false, b: true });
        const expected = 'a-b-a-|';
        const values = { a: 0, b: 1 };

        const thrust$ = simpleThrustFactory(1, throttling$);

        expectObservable(thrust$).toBe(expected, values);
      });
    });
  });
});
