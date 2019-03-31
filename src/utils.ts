import { TestScheduler } from 'rxjs/testing';

export const schedulerFactory = (): TestScheduler =>
  new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
