import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export default class Engine {
  public thrust$: Observable<number>;
  /** in Newtons */
  private enginePower: number;
  private throttling$: Observable<boolean>;

  public constructor(enginePower: number, throttling$: Observable<boolean>) {
    this.enginePower = enginePower;
    this.throttling$ = throttling$;
    this.thrust$ = from(throttling$).pipe(map(throttle => (throttle ? this.enginePower : 0)));
  }
}
