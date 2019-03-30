import { Observable } from 'rxjs';

export interface PhPosition {
  x: number;
  y: number;
  angle: number;
}

export interface PhVelocity {
  speed: number;
  angle: number;
}

export interface PhObject {
  mass: number;
  position$: Observable<PhPosition>;
  velocity$: Observable<PhVelocity>;
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

export function forceForReferenceAngle(referenceAngle: number, forceAngle: number, force: number): number {
  const modifier = axisEfficiencyModifier(referenceAngle, forceAngle);
  return force * modifier;
}

export function velocityChangeY(y: number, force: number, forceAngle: number): number {
  return y + forceForReferenceAngle(0, forceAngle, force);
}
