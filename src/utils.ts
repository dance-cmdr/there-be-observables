import { TestScheduler } from 'rxjs/testing';

export const schedulerFactory = (): TestScheduler =>
  new TestScheduler(
    (actual, expected): void => {
      expect(actual).toEqual(expected);
    },
  );
