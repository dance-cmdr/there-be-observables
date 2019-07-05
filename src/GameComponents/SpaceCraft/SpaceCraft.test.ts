import { acceleration, directionOfAFromB, gAcceleration } from './SpaceCraft';
import { Vector3 } from 'three';

describe('acceleration', (): void => {
  it('should accelerate towards y+', (): void => {
    const result = acceleration(1, 3, new Vector3(0, 1, 0));
    expect(result).toEqual(new Vector3(0, 3, 0));
  });

  it('should accelerate towards y-', (): void => {
    const result = acceleration(1, 3, new Vector3(0, -1, 0));
    expect(result).toEqual(new Vector3(0, -3, 0));
  });

  it('should accelerate towards x-', (): void => {
    const result = acceleration(1, 3, new Vector3(-1, 0, 0));
    expect(result).toEqual(new Vector3(-3, 0, 0));
  });

  it('should accelerate towards x+', (): void => {
    const result = acceleration(2, 3, new Vector3(1, 0, 0));
    expect(result).toEqual(new Vector3(1.5, 0, 0));
  });
});

describe('directionOfAFromB', (): void => {
  it('should return a vector that points from A to B', (): void => {
    const result = directionOfAFromB(new Vector3(0, 0, 0), new Vector3(0, -5, 0));
    expect(result).toEqual(new Vector3(0, -1, 0));
  });
});

describe('gAcceleration', (): void => {
  it('should return the gAcceleration value between A and B where B is earth', (): void => {
    expect(gAcceleration(new Vector3(0, 1, 0), 1)).toEqual(new Vector3(0, -9.8, 0));
    expect(gAcceleration(new Vector3(1, 0, 0), 1)).toEqual(new Vector3(-9.8, 0, 0));
    expect(gAcceleration(new Vector3(0, -1, 0), 1)).toEqual(new Vector3(0, 9.8, 0));
    expect(gAcceleration(new Vector3(-1, 0, 0), 1)).toEqual(new Vector3(9.8, 0, 0));
    expect(gAcceleration(new Vector3(-1, -1, 0), 1).x).toBeCloseTo(6.929);
    expect(gAcceleration(new Vector3(-1, -1, 0), 1).y).toBeCloseTo(6.929);
  });
});
