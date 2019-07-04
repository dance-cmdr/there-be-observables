import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

const isRatioWhole = (ratio: number) => (_: any, index: number): boolean => Number.isInteger(index / (1 / ratio));

export default function filterRatio<T>(i$: Observable<T>, ratio: number): Observable<T> {
  return i$.pipe(filter(isRatioWhole(ratio)));
}
