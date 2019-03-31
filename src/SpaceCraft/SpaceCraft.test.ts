import { spaceCraftFactory } from './SpaceCraft';
import { schedulerFactory } from '../utils';

describe('spaceCraft', () => {
  describe('position$', () => {
    it('should position$ have initial position', () => {
      const scheduler = schedulerFactory();
      scheduler.run(helpers => {
        const { cold, expectObservable } = helpers;

        const initialPosition = { x: 0, y: 0 };
        const { position$ } = spaceCraftFactory(
          {
            throttling$: cold('(-|)'),
          },
          {
            enginePower: 1,
            initialPosition,
          },
        );

        const expected = '(a|)';
        const values = { a: initialPosition };

        expectObservable(position$).toBe(expected, values);
      });
    });
  });
});
