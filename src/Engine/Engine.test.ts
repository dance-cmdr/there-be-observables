import { simpleThrustFactory } from './Engine';
import { TestScheduler } from 'rxjs/testing';

const scheduler = new TestScheduler((actual, expected) => {
  console.log(actual, expected);
  expect(actual).toEqual(expected);
});

describe('Engine', () => {
  describe('throttle', () => {
    it('thrust is 1 as long as throttling is true', () => {
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
