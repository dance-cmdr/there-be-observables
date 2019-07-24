import { Object3D, Vector3, ObjectLoader } from 'three';

import { spaceObjectFactory } from './Spacecraft/SpaceObject';

import { acceleration } from './Physics/physics';

import { WORLD_SCALE } from './Physics/constants';
import { GameScene } from './Client/GameScene';
import projectileModel from './Graphics/Projectile/icosahedron.json';
import { Observable } from 'rxjs';
import { orientation } from './Physics/trigonometry';

const projectileLoader = new ObjectLoader();

const PROJECTILES_LENGTH = 1000;
const projectile = projectileLoader.parse(projectileModel);
const projectiles: Object3D[] = new Array(PROJECTILES_LENGTH);
const activeProjectiles: Map<number, Object3D> = new Map();
var cp = 0;

export const initialiseProjectiles = (
  gameScene: GameScene,
): { projectiles: Object3D[]; activeProjectiles: Map<number, Object3D> } => {
  for (let i = 0; i < PROJECTILES_LENGTH; i++) {
    const prj = projectile.clone(false);
    projectiles[i] = prj;
    prj.visible = false;
    prj.userData.index = i;
    gameScene.add(prj);
  }

  return { projectiles, activeProjectiles };
};

export const destroyProjectileWithIndex = (index: number): void => {
  const projectile = projectiles[index];
  projectile.visible = false;
  if (projectile.userData.spaceObject) {
    projectile.userData.spaceObject.dispose();
  }
  activeProjectiles.delete(index);
};

export const createProjectile = (
  gameClock$: Observable<number>,
  originator: Object3D,
  velocity: Vector3 = new Vector3(0, 0, 0),
): void => {
  const prj = projectiles[cp];
  prj.userData.spaceObject = spaceObjectFactory({
    gameClock$,
    model: prj,
    velocity: acceleration(
      1,
      1000000 / WORLD_SCALE,
      orientation(originator.up, originator.rotation),
    ).add(velocity),
    position: originator.position.clone().add(orientation(originator.up, originator.rotation)),
    mass: 1000,
  });

  prj.visible = true;

  activeProjectiles.set(cp, prj);

  cp++;

  if (cp > projectiles.length - 1) {
    cp = 0;
  }
};
