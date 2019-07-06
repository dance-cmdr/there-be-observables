import { normaliseDeg, axisEfficiencyModifier, acceleration, netForce, velocityDisplacement } from './utils.spare';

describe('physics', () => {
  describe('normaliseDeg', () => {
    it('should return 0', () => {
      expect(normaliseDeg(360)).toBe(0);
      expect(normaliseDeg(0)).toBe(0);
    });

    it('should return 270', () => {
      expect(normaliseDeg(-90)).toBe(270);
    });

    it('should return 180', () => {
      expect(normaliseDeg(180)).toBe(180);
      expect(normaliseDeg(-180)).toBe(180);
    });
  });

  describe('axisEfficiencyModifier', () => {
    it('should return 1', () => {
      expect(axisEfficiencyModifier(0, 0)).toEqual(1);
      expect(axisEfficiencyModifier(90, 90)).toEqual(1);
    });

    it('should return -1', () => {
      expect(axisEfficiencyModifier(0, 180)).toEqual(-1);
      expect(axisEfficiencyModifier(90, 270)).toEqual(-1);
      expect(axisEfficiencyModifier(270, 90)).toEqual(-1);
      expect(axisEfficiencyModifier(180, 0)).toEqual(-1);
    });

    it('should return 0.5', () => {
      expect(axisEfficiencyModifier(0, 45)).toEqual(0.5);
      expect(axisEfficiencyModifier(0, 315)).toEqual(0.5);
      expect(axisEfficiencyModifier(90, 45)).toEqual(0.5);
      expect(axisEfficiencyModifier(90, 135)).toEqual(0.5);
    });
    it('should return 0', () => {
      expect(axisEfficiencyModifier(0, 90)).toEqual(0);
      expect(axisEfficiencyModifier(0, 270)).toEqual(0);
      expect(axisEfficiencyModifier(90, 180)).toEqual(0);
    });

    it('should return -0.5', () => {
      expect(axisEfficiencyModifier(0, 135)).toEqual(-0.5);
      expect(axisEfficiencyModifier(0, 225)).toEqual(-0.5);
      expect(axisEfficiencyModifier(90, 225)).toEqual(-0.5);
      expect(axisEfficiencyModifier(90, 315)).toEqual(-0.5);
    });
  });

  describe('acceleration', () => {
    it('should throw', () => {
      expect(acceleration).toThrow();
    });

    it('should return infinity', () => {
      expect(
        acceleration(
          {
            magnitude: 0,
            direction: 0,
          },
          1,
        ),
      ).toEqual({
        speed: 0,
        direction: 0,
      });
    });

    it('should return 1', () => {
      expect(
        acceleration(
          {
            magnitude: 1,
            direction: 0,
          },
          1,
        ),
      ).toEqual({
        speed: 1,
        direction: 0,
      });
    });

    it('should return 2', () => {
      expect(
        acceleration(
          {
            magnitude: 2,
            direction: 0,
          },
          1,
        ),
      ).toEqual({
        speed: 2,
        direction: 0,
      });
    });

    it('should return 0.5', () => {
      expect(
        acceleration(
          {
            magnitude: 1,
            direction: 0,
          },
          2,
        ),
      ).toEqual({
        speed: 0.5,
        direction: 0,
      });
    });

    it('should return the same direction', () => {
      expect(
        acceleration(
          {
            magnitude: 1,
            direction: 90,
          },
          2,
        ),
      ).toEqual({
        speed: 0.5,
        direction: 90,
      });
    });
  });

  describe('netForce', () => {
    it('calulates', () => {
      expect(
        netForce(
          {
            magnitude: 9,
            direction: 0,
          },
          {
            magnitude: 14,
            direction: 45,
          },
        ),
      ).toEqual({
        magnitude: 21.3,
        direction: 28,
      });
    });

    it('calulates too', () => {
      expect(
        netForce(
          {
            magnitude: 10,
            direction: 0,
          },
          {
            magnitude: 10,
            direction: 180,
          },
        ),
      ).toEqual({
        magnitude: 0,
        direction: 90,
      });
    });
  });

  describe('velocityDisplacement', () => {
    it('should return the displacement of the object after velocity is applied', () => {
      expect(velocityDisplacement({ speed: 1, direction: 0 })).toEqual({ x: 0, y: 1 });
      expect(velocityDisplacement({ speed: 1, direction: 45 })).toEqual({ x: 0.5, y: 0.5 });
      expect(velocityDisplacement({ speed: 1, direction: 90 })).toEqual({ x: 1, y: 0 });
    });
  });
});
