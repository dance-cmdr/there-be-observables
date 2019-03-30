import { Observable } from 'rxjs';

export interface PhPosition {
  x: number;
  y: number;
}

/**
 * direction 1-360
 */
export interface PhVelocity {
  speed: number;
  direction: number;
}

/**
 * direction 1-360
 */
export interface PhForce {
  magnitude: number;
  direction: number;
}

export interface PhObject {
  mass: number;
  direction$: Observable<number>;
  position$: Observable<PhPosition>;
  velocity$: Observable<PhForce>;
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function acceleration(force: PhForce, object: PhObject): PhVelocity {
  return {
    speed: force.magnitude / object.mass,
    direction: force.direction,
  };
}

export function netForce(a: PhForce, b: PhForce): PhForce {
  const Ax = a.magnitude * Math.cos(degreesToRadians(a.direction));
  const Ay = a.magnitude * Math.sin(degreesToRadians(a.direction));

  const Bx = b.magnitude * Math.cos(degreesToRadians(b.direction));
  const By = b.magnitude * Math.sin(degreesToRadians(b.direction));

  const Xx = Ax + Bx;
  const Xy = Ay + By;

  const direction = Math.round(radiansToDegrees(Math.atan(Xy / Xx))); // tan-1(y/x)
  const magnitude = Number(Math.sqrt(Math.pow(Xx, 2) + Math.pow(Xy, 2)).toFixed(1));

  console.log({
    Ax,
    Ay,
    Bx,
    By,
  });

  return {
    magnitude,
    direction,
  };
}

export function applyAcceleration(acceleration: PhVelocity, velocity: PhVelocity): PhVelocity {
  const netSpeed: Infinity;
  const netDirection: Infinity;

  return {
    speed: netSpeed,
    direction: netDirection,
  };
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
