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

export function convertToVectorCoordinates(force: PhForce): PhPosition {
  return {
    x: force.magnitude * Math.cos(degreesToRadians(force.direction)),
    y: force.magnitude * Math.sin(degreesToRadians(force.direction)),
  };
}

export function addVectors(a: PhPosition, b: PhPosition): PhPosition {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

/***
 * Calculating net force
 * https://www.dummies.com/education/science/physics/calculating-net-force-and-acceleration/
 * netDirection = tan^-1(y/x)
 * Math.atan = tan^-1
 */
export function netForce(a: PhForce, b: PhForce): PhForce {
  const { x, y } = addVectors(convertToVectorCoordinates(a), convertToVectorCoordinates(b));

  const direction = Math.round(radiansToDegrees(Math.atan(y / x)));
  const magnitude = Number(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)).toFixed(1));

  return {
    magnitude,
    direction,
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
