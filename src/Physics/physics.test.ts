import { acceleration, gAcceleration } from './physics';
import { Vector3 } from 'three';

describe('acceleration', () => {
  it('should accelerate towards y+', () => {
    const result = acceleration(1, 3, new Vector3(0, 1, 0));
    expect(result).toEqual(new Vector3(0, 3, 0));
  });

  it('should accelerate towards y-', () => {
    const result = acceleration(1, 3, new Vector3(0, -1, 0));
    expect(result).toEqual(new Vector3(0, -3, 0));
  });

  it('should accelerate towards x-', () => {
    const result = acceleration(1, 3, new Vector3(-1, 0, 0));
    expect(result).toEqual(new Vector3(-3, 0, 0));
  });

  it('should accelerate towards x+', () => {
    const result = acceleration(2, 3, new Vector3(1, 0, 0));
    expect(result).toEqual(new Vector3(1.5, 0, 0));
  });
});

describe('gAcceleration', () => {
  it('should return the gAcceleration value between A and B where B is earth', () => {
    expect(gAcceleration(new Vector3(0, -1, 0), 1)).toEqual(new Vector3(0, -9.8, 0));
    expect(gAcceleration(new Vector3(-1, 0, 0), 1)).toEqual(new Vector3(-9.8, 0, 0));
    expect(gAcceleration(new Vector3(0, 1, 0), 1)).toEqual(new Vector3(0, 9.8, 0));
    expect(gAcceleration(new Vector3(1, 0, 0), 1)).toEqual(new Vector3(9.8, 0, 0));
    expect(gAcceleration(new Vector3(1, 1, 0), 1)).toMatchObject(new Vector3(9.8, 9.8, 0));
  });
});
