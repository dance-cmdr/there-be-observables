export interface SOPosition {
  x: number;
  y: number;
  angle: number;
}

export function normaliseDeg(degrees: number): number {
  const deg = degrees % 360;
  return deg < 0 ? deg + 360 : deg;
}

export function axisEfficiencyModifier(dirA: number, dirB: number): number {
  const directions = [dirA, dirB].sort((a, b) => a - b);
  const [a, b] = directions;

  if (a === b) {
    return 1;
  }
  if (b - a > 180) {
    return (b - a) / 90 - 3;
  }
  return (a - b) / 90 + 1;
}

export function momentumChangeY(force: number, y: number, angle: number): number {
  const angleMod = 180 / ((angle % 360) + 360 - 180);

  return y + force / angleMod;
}

export function applyThurst(thrust: number, momentum: SOPosition): SOPosition {
  return { x: 0, y: 0, angle: 0 };
}
