import { spaceCraftFactory, positionObservable, velocityObservable } from './SpaceCraft';
import { schedulerFactory } from '../utils';

describe('spaceCraft', () => {
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
            mass: 1,
          },
        );

        const expected = 'a-----|';
        const values = { a: initialPosition };

        expectObservable(position$).toBe(expected, values);
      });
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
    });
  });

  it('position$ should update by with volatile velocity', () => {
    const scheduler = schedulerFactory();
    scheduler.run(helpers => {
      const { cold, expectObservable } = helpers;

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
    });
  });
});

describe('velocityObservable', () => {
  it('should update velocity when thrust is changing', () => {
    const scheduler = schedulerFactory();
    scheduler.run(helpers => {
      const { cold, expectObservable } = helpers;

      const velocity$ = velocityObservable(1, cold('-a-|', { a: 1 }));

      const expected = 'ab-|';
      const values = { a: { speed: 0, direction: 0 }, b: { speed: 1, direction: 0 } };

      expectObservable(velocity$).toBe(expected, values);
    });
  });

  it('should update velocity by constant thrust', () => {
    const scheduler = schedulerFactory();
    scheduler.run(helpers => {
      const { cold, expectObservable } = helpers;

      const velocity$ = velocityObservable(1, cold('-a-a-a-|', { a: 1 }));

      const expected = 'ab-c-d-|';
      const values = {
        a: { speed: 0, direction: 0 },
        b: { speed: 1, direction: 0 },
        c: { speed: 2, direction: 0 },
        d: { speed: 3, direction: 0 },
      };

      expectObservable(velocity$).toBe(expected, values);
    });
  });
});
