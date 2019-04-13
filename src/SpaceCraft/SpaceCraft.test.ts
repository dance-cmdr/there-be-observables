import { acceleration } from './SpaceCraft';
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
