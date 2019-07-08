import { Vector3, Object3D } from 'three';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';
import { map, withLatestFrom, startWith } from 'rxjs/operators';
import { gAccelerationTowardsEarth } from '../Physics/physics';
import { orientation } from '../Physics/trigonometry';

interface SpaceObjectConfig {
  model: Object3D;
  mass: number;

  gameClock$: Observable<number>;

  position?: Vector3;
  //   orientation?: Vector3;
  velocity?: Vector3;
}

interface SpaceObject {
  position$: Observable<Vector3>;
  orientation$: Observable<Vector3>;
  velocity$: Observable<Vector3>;
  subscriptions: Subscription[];
  dispose: () => void;
}

export const spaceObjectFactory = ({
  gameClock$,
  model,
  velocity = new Vector3(0, 0, 0),
  position,
  mass,
}: SpaceObjectConfig): SpaceObject => {
  const orientation$: Subject<Vector3> = new BehaviorSubject(orientation(model.up, model.rotation));
  const velocity$: Subject<Vector3> = new BehaviorSubject(velocity);

  const position$: Observable<Vector3> = gameClock$.pipe(
    withLatestFrom(velocity$),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map(([_, velocity]) => {
      return model.position.clone().add(velocity);
    }),
    startWith(position || model.position.clone()),
  );

  const accelerationUpdate = position$
    .pipe(withLatestFrom(velocity$))
    .subscribe(([position, velocity]) => {
      const gAcc = gAccelerationTowardsEarth(position, mass);
      velocity$.next(velocity.clone().add(gAcc));
    });

  const positionUpdate = position$.subscribe(position => {
    model.position.copy(position);
  });

  const subscriptions = [accelerationUpdate, positionUpdate];

  const dispose = () => subscriptions.forEach(sub => sub.unsubscribe());

  return {
    position$,
    orientation$,
    velocity$,
    subscriptions,
    dispose,
  };
};
