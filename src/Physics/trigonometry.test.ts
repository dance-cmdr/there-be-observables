import { directionOfAFromB } from './trigonometry';
import { Vector3 } from 'three';

describe('directionOfAFromB', () => {
  it('should return a vector that points from A to B', () => {
    const result = directionOfAFromB(new Vector3(0, 0, 0), new Vector3(0, -5, 0));
    expect(result).toEqual(new Vector3(0, -1, 0));
  });
});
