import {
  normaliseDeg,
  velocityChangeY,
  axisEfficiencyModifier,
  acceleration,
  applyVelocities,
  netForce,
} from './physics';

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

describe('momentumChangeY', () => {
  describe('angle is 0 degrees from N', () => {
    it('should add force to y', () => {
      expect(velocityChangeY(1, 10, 0)).toEqual(11);
    });

    it('should consider 0 === 360', () => {
      expect(velocityChangeY(1, 10, 360)).toEqual(11);
    });
  });

  describe('angle is 45 degrees from N', () => {
    it('should add force to y', () => {
      expect(velocityChangeY(1, 10, 45)).toEqual(6);
      expect(velocityChangeY(1, 10, -45)).toEqual(6);
      expect(velocityChangeY(1, 10, 315)).toEqual(6);
    });
  });

  describe('angle is 90 degrees from N', () => {
    it('should add force to y', () => {
      expect(velocityChangeY(1, 10, 90)).toEqual(1);
      expect(velocityChangeY(1, 10, -90)).toEqual(1);
      expect(velocityChangeY(1, 10, 270)).toEqual(1);
    });
  });

  describe('angle is 135 degrees from N', () => {
    it('should add force to y', () => {
      expect(velocityChangeY(1, 10, 135)).toEqual(-4);
      expect(velocityChangeY(1, 10, -135)).toEqual(-4);
      expect(velocityChangeY(1, 10, 225)).toEqual(-4);
    });
  });

  describe('angle is 180 degrees from N', () => {
    it('should add force to y', () => {
      expect(velocityChangeY(1, 10, 180)).toEqual(-9);
      expect(velocityChangeY(1, 10, -180)).toEqual(-9);
    });
  });
});

describe.skip('acceleration', () => {
  it('should throw', () => {
    expect(acceleration(0, 0)).toThrow(Infinity);
  });

  it('should return infinity', () => {
    expect(acceleration(1, 0)).toBe(Infinity);
  });

  it('should return 1', () => {
    expect(acceleration(1, 1)).toBe(1);
  });

  it('should return 2', () => {
    expect(acceleration(2, 1)).toBe(1);
  });

  it('should return 2', () => {
    expect(acceleration(1, 2)).toBe(0.5);
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
