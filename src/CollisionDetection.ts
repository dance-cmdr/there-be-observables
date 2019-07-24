import { Raycaster, Object3D, Mesh, Group } from 'three';
import { SpaceCraft } from './Spacecraft/SpaceCraft';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Collision Detection
const raycaster = new Raycaster();

export interface Collision {
  index: number;
  type: string;
  object: Object3D;
  spaceCraft?: SpaceCraft;
}

const detectCollision = (
  origin: Mesh | Group | Object3D,
  object: Object3D,
  radius: number,
): boolean => {
  raycaster.set(origin.position, object.position.clone().normalize());
  const collisions = raycaster.intersectObject(object);
  const collision = collisions.find(
    collision => collision.object.uuid === object.uuid && collision.distance < radius,
  );

  return !!collision;
};

export const COLLISION_TYPES = {
  EARTH: 'earth',
  PLAYER: 'player',
};

export const collitionDetection = (
  gameClock$: Observable<number>,
  EARTH: Mesh,
  activeProjectiles: Map<number, Object3D>,
  spaceCrafts: SpaceCraft[],
): Observable<Collision[]> =>
  gameClock$.pipe(
    map(() => {
      // Raycast for collisions and return if the current projectile collides
      const collisionsList: Collision[] = [];

      for (let [index, object] of activeProjectiles.entries()) {
        // projectile to earth collision
        if (detectCollision(EARTH, object, EARTH.geometry.boundingSphere.radius)) {
          collisionsList.push({
            index,
            type: COLLISION_TYPES.EARTH,
            object,
          });
        }

        // spaceCraft to Projectile Collision detection
        spaceCrafts.forEach(spaceCraft => {
          if (detectCollision(spaceCraft.model, object, 0.75)) {
            collisionsList.push({
              index,
              type: COLLISION_TYPES.PLAYER,
              object: spaceCraft.model,
              spaceCraft,
            });
          }
        });
      }

      return collisionsList.reverse();
    }),
  );
