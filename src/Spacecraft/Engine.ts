import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export const simpleThrustFactory = (enginePower: number, throttling$: Observable<boolean>): Observable<number> =>
  from(throttling$).pipe(map(throttle => (throttle ? enginePower : 0)));
