import { spaceCraftFactory, positionObservable } from './SpaceCraft';
import { schedulerFactory } from '../utils';

describe('', () => {
  describe('position$', () => {
    it('position$ should have initial position', () => {
      const scheduler = schedulerFactory();
      scheduler.run(helpers => {
        const { cold, expectObservable } = helpers;

        const initialPosition = { x: 0, y: 0 };
        const { position$ } = spaceCraftFactory(
          {
            throttling$: cold('------|', { t: true, f: false }),
            gameClock$: cold('a-b-c-|', { a: 1, b: 2, c: 3 }),
          },
          {
            enginePower: 1,
            initialPosition,
          },
        );

        const expected = 'a-----|';
        const values = { a: initialPosition };

        expectObservable(position$).toBe(expected, values);
      });
    });
  });

  describe('positionObservable', () => {
    it('position$ should update by constant velocity', () => {
      const scheduler = schedulerFactory();
      scheduler.run(helpers => {
        const { cold, expectObservable } = helpers;

        const initialPosition = { x: 0, y: 0 };
        const position$ = positionObservable(
          initialPosition,
          cold('-a-b-c-|', { a: 1, b: 2, c: 3 }),
          cold('ab-----|', {
            a: { speed: 0, direction: 0 },
            b: { speed: 1, direction: 0 },
          }),
        );

        const expected = 'ab-c-d-|';
        const values = { a: { x: 0, y: 0 }, b: { x: 0, y: 1 }, c: { x: 0, y: 2 }, d: { x: 0, y: 3 } };

        expectObservable(position$).toBe(expected, values);

        scheduler.flush();
      });
    });

    it('position$ should update by with volatile velocity', () => {
      const scheduler = schedulerFactory();
      scheduler.run(helpers => {
        const { cold, expectObservable, flush } = helpers;

        const initialPosition = { x: 0, y: 0 };
        const position$ = positionObservable(
          initialPosition,
          cold('-a-b-c-d-|', { a: 1, b: 2, c: 3 }),
          cold('a-b-c-d--|', {
            a: { speed: 1, direction: 0 },
            b: { speed: 3, direction: 0 },
            c: { speed: 3, direction: 180 },
            d: { speed: 1, direction: 180 },
          }),
        );

        const expected = 'ab-c-d-e-|';
        const values = {
          a: { x: 0, y: 0 },
          b: { x: 0, y: 1 },
          c: { x: 0, y: 4 },
          d: { x: 0, y: 1 },
          e: { x: 0, y: 0 },
        };

        expectObservable(position$).toBe(expected, values);

        flush();
      });
    });
  });
});
