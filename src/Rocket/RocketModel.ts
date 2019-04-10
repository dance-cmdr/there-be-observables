import { Mesh, Object3D, MeshLambertMaterial, BoxGeometry, SphereGeometry, CylinderGeometry, Colors } from 'three';

function makeCylinder(
  radiusTop: number,
  radiusBottom: number,
  height: number,
  radiusSegments: number,
  heightSegments: number,
  mat: MeshLambertMaterial,
): Mesh {
  const geom = new CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments);
  const mesh = new Mesh(geom, mat);
  return mesh;
}

const makeComponent = (
  modFn: (v: number) => number,
  top: number,
  radiusTop: number,
  radiusBottom: number,
  height: number,
  radiusSegments: number,
  heightSegments: number,
  mat: MeshLambertMaterial,
): Mesh => {
  const component = makeCylinder(
    modFn(radiusTop),
    modFn(radiusBottom),
    modFn(height),
    modFn(radiusSegments),
    modFn(heightSegments),
    mat,
  );
  component.position.y = modFn(top);
  return component;
};

export const rocketFactory = (size: number = 1, color: Colors = 0xeeeeee): Object3D => {
  const mod = size / 210;

  const sn = (value: number): number => value * mod;

  const rocket = new Object3D();

  const bodyMat = new MeshLambertMaterial({
    color,
  });
  const ringMat = new MeshLambertMaterial({
    color: 0x3a1b19,
  });
  const metalMat = new MeshLambertMaterial({
    color: 0x81878d,
  });
  var footGeom = new BoxGeometry(sn(30), sn(10), sn(30));

  const top = new Object3D();
  const mid = new Object3D();
  const bot = new Object3D();
  const engine = new Object3D();
  const legs = new Object3D();

  const bodyTopRing = makeComponent(sn, 0, 35, 35, 10, 10, 1, ringMat);
  const bodyTopBase = makeComponent(sn, 10, 25, 30, 10, 10, 1, bodyMat);
  const bodyTop = makeComponent(sn, 30, 5, 25, 30, 10, 1, bodyMat);
  const bodyTopNippleBase = makeComponent(sn, 47, 5, 5, 5, 10, 1, ringMat);
  const bodyTopNipple = makeComponent(sn, 52, 2, 5, 5, 10, 1, ringMat);
  const bodyTopAntenna = makeComponent(sn, 63, 1, 1, 25, 5, 1, ringMat);

  const bodyTopAntennaBall = new Mesh(new SphereGeometry(sn(2), sn(20), sn(10)), ringMat);
  bodyTopAntennaBall.position.y = sn(76);

  top.add(bodyTopRing);
  top.add(bodyTopBase);
  top.add(bodyTop);
  top.add(bodyTopNippleBase);
  top.add(bodyTopNipple);
  top.add(bodyTopAntenna);
  top.add(bodyTopAntennaBall);

  const bodyMidRing = makeComponent(sn, 0, 87, 87, 12, 12, 1, ringMat);
  const bodyMidBase = makeComponent(sn, 31, 60, 80, 50, 12, 1, bodyMat);
  const bodyMid = makeComponent(sn, 116, 30, 60, 120, 12, 1, bodyMat);

  mid.add(bodyMid);
  mid.add(bodyMidBase);
  mid.add(bodyMidRing);

  const bodyBotRing = makeComponent(sn, 0, 45, 45, 5, 12, 1, ringMat);
  const bodyBot = makeComponent(sn, 15, 80, 45, 25, 12, 1, bodyMat);
  bot.add(bodyBotRing);
  bot.add(bodyBot);

  const bodyEngineTop = makeComponent(sn, 0, 45, 50, 5, 12, 1, bodyMat);
  const bodyEngineRingTop = makeComponent(sn, -8, 55, 50, 10, 12, 1, ringMat);
  const bodyEngineMid = makeComponent(sn, -18, 45, 45, 10, 8, 1, bodyMat);
  const bodyEngineRingBot = makeComponent(sn, -28, 50, 40, 10, 12, 1, ringMat);
  const bodyEngineNozzle = makeComponent(sn, -44, 45, 55, 25, 12, 1, metalMat);
  const bodyEngineNozzleEnd = makeComponent(sn, -59, 60, 60, 5, 12, 1, metalMat);

  engine.add(bodyEngineTop);
  engine.add(bodyEngineRingTop);
  engine.add(bodyEngineMid);
  engine.add(bodyEngineRingBot);
  engine.add(bodyEngineNozzle);
  engine.add(bodyEngineNozzleEnd);

  const legA = makeCylinder(sn(5), sn(5), sn(170), sn(6), sn(1), ringMat);
  legA.position.set(0, 0, sn(-75));
  legA.rotation.x = (20 * Math.PI) / 180;
  const legB = makeCylinder(sn(5), sn(5), sn(170), sn(6), sn(1), ringMat);
  legB.position.set(sn(75), 0, 0);
  legB.rotation.z = (20 * Math.PI) / 180;
  const legY = makeCylinder(sn(5), sn(5), sn(170), sn(6), sn(1), ringMat);
  legY.position.set(0, 0, sn(75));
  legY.rotation.x = (-20 * Math.PI) / 180;
  const legZ = makeCylinder(sn(5), sn(5), sn(170), sn(6), sn(1), ringMat);
  legZ.position.set(sn(-75), 0, 0);
  legZ.rotation.z = (-20 * Math.PI) / 180;

  legs.add(legA);
  legs.add(legB);
  legs.add(legZ);
  legs.add(legY);

  const legASock = makeCylinder(sn(6), sn(6), sn(50), sn(6), sn(1), metalMat);
  legASock.position.set(0, sn(-37), sn(-89));
  legASock.rotation.x = (20 * Math.PI) / 180;

  const legBSock = makeCylinder(sn(6), sn(6), sn(50), sn(6), sn(1), metalMat);
  legBSock.position.set(sn(89), sn(-37), 0);
  legBSock.rotation.z = (20 * Math.PI) / 180;

  const legYSock = makeCylinder(sn(6), sn(6), sn(50), sn(6), sn(1), metalMat);
  legYSock.position.set(0, -sn(37), sn(89));
  legYSock.rotation.x = (-20 * Math.PI) / 180;

  const legZSock = makeCylinder(sn(6), sn(6), sn(50), sn(6), sn(1), metalMat);
  legZSock.position.set(sn(-89), sn(-37), 0);
  legZSock.rotation.z = (-20 * Math.PI) / 180;

  legs.add(legASock);
  legs.add(legBSock);
  legs.add(legYSock);
  legs.add(legZSock);

  const legAFoot = new Mesh(footGeom, metalMat);
  legAFoot.position.set(0, sn(-45), 0);
  legAFoot.rotation.x = (-20 * Math.PI) / 180;

  const legBFoot = new Mesh(footGeom, metalMat);
  legBFoot.position.set(0, sn(-45), 0);
  legBFoot.rotation.z = (-20 * Math.PI) / 180;

  const legYFoot = new Mesh(footGeom, metalMat);
  legYFoot.position.set(0, sn(-45), 0);
  legYFoot.rotation.x = (20 * Math.PI) / 180;

  const legZFoot = new Mesh(footGeom, metalMat);
  legZFoot.position.set(0, sn(-45), 0);
  legZFoot.rotation.z = (20 * Math.PI) / 180;

  legASock.add(legAFoot);
  legBSock.add(legBFoot);
  legYSock.add(legYFoot);
  legZSock.add(legZFoot);

  //   const windowXTop = makeCylinder(14, 14, 2, 10, 1, ringMat);
  //   windowXTop.position.set(0, -45, 57);
  //   windowXTop.rotation.x = (75 * Math.PI) / 180;

  //   const windowXInnerTop = makeCylinder(9, 9, 2, 10, 1, metalMat);
  //   windowXInnerTop.position.set(0, 2, 0);

  //   const windowXBot = makeCylinder(12, 12, 2, 10, 1, ringMat);
  //   windowXBot.position.set(0, 0, 46);
  //   windowXBot.rotation.x = (75 * Math.PI) / 180;

  //   const windowXInnerBot = makeCylinder(7, 7, 2, 10, 1, metalMat);
  //   windowXInnerBot.position.set(0, 2, 0);

  //   windowXTop.add(windowXInnerTop);
  //   windowXBot.add(windowXInnerBot);
  //   bodyMid.add(windowXTop);
  //   bodyMid.add(windowXBot);

  top.position.y = 170;
  mid.position.y = 0;
  bot.position.y = -33;
  engine.position.y = -38;
  legs.position.y = -40;

  rocket.add(top);
  rocket.add(mid);
  rocket.add(bot);
  rocket.add(engine);
  rocket.add(legs);

  return rocket;
};
