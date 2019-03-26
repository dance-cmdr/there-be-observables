import { SOPosition } from '../Physics/physics';

export interface ApplyThrustFunc {
  (thrust: number, momentum: SOPosition): SOPosition;
}

export interface ApplyRollFunc {
  (roll: number, momentum: SOPosition): SOPosition;
}

export interface ApplyMomentum {
  (position: SOPosition, momentume: SOPosition): SOPosition;
}

export interface SpaceObject {
  momentum: SOPosition;
  position: SOPosition;
}

export interface SpaceCraft {
  thrust: (thrust: number) => SpaceCraft;
  roll: (roll: number) => SpaceCraft;
}

export class SpaceShip implements SpaceObject, SpaceCraft {
  private _momentum: SOPosition;
  private _position: SOPosition;

  public constructor(wholeObject: { position: SOPosition; momentum?: SOPosition }) {
    let { position, momentum = { x: 0, y: 0, angle: 0 } } = wholeObject;

    this._position = position;
    this._momentum = momentum;
  }

  public get momentum(): SOPosition {
    return this._momentum;
  }

  public get position(): SOPosition {
    return this._position;
  }

  public thrust(thrust: number): SpaceShip {
    return this;
  }

  public roll(roll: number): SpaceShip {
    return this;
  }
}
