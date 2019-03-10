export interface Momentum {
  x: number;
  y: number;
}

export function apply(a:Momentum, b:Momentum):Momentum {
    return {
      x: a.x + b.x,
      y: a.y + b.y,
    };
}
