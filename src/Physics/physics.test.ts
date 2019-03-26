import { normaliseDeg, applyThurst, momentumChangeY, axisEfficiencyModifier } from './physics';

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

describe.skip('momentumChangeY', () => {
  describe('angle is 0 degrees from N', () => {
    it('should add force to y', () => {
      expect(momentumChangeY(10, 1, 0)).toEqual(11);
    });

    it('should consider 0 === 360', () => {
      expect(momentumChangeY(10, 1, 360)).toEqual(11);
    });
  });

  describe('angle is 45 degrees from N', () => {
    it('should add force to y', () => {
      expect(momentumChangeY(10, 1, 45)).toEqual(6);
      expect(momentumChangeY(10, 1, -45)).toEqual(6);
      expect(momentumChangeY(10, 1, 315)).toEqual(6);
    });
  });

  describe('angle is 90 degrees from N', () => {
    it('should add force to y', () => {
      expect(momentumChangeY(10, 1, 90)).toEqual(1);
      expect(momentumChangeY(10, 1, -90)).toEqual(1);
      expect(momentumChangeY(10, 1, 270)).toEqual(1);
    });
  });

  describe('angle is 135 degrees from N', () => {
    it('should add force to y', () => {
      expect(momentumChangeY(10, 1, 135)).toEqual(-4);
      expect(momentumChangeY(10, 1, -135)).toEqual(-4);
      expect(momentumChangeY(10, 1, 225)).toEqual(-4);
    });
  });

  describe('angle is 180 degrees from N', () => {
    it('should add force to y', () => {
      expect(momentumChangeY(10, 1, 180)).toEqual(-4);
      expect(momentumChangeY(10, 1, -180)).toEqual(-4);
    });
  });
});

describe.skip('applyThurst', () => {
  it('should apply thrust to momentum skywards', () => {
    expect(applyThurst(10, { x: 1, y: 1, angle: 0 })).toEqual({ x: 1, y: 11, angle: 0 });
  });
});
