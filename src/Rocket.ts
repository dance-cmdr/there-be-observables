import { Mesh, Object3D, MeshLambertMaterial, BoxGeometry, SphereGeometry, CylinderGeometry } from 'three';

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

export const rocketFactory = (): Object3D => {
  const rocket = new Object3D();

  const bodyMat = new MeshLambertMaterial({
    color: 0x1d836a,
  });
  const ringMat = new MeshLambertMaterial({
    color: 0x3a1b19,
  });
  const metalMat = new MeshLambertMaterial({
    color: 0x81878d,
  });
  var footGeom = new BoxGeometry(30, 10, 30);

  const top = new Object3D();
  const mid = new Object3D();
  const bot = new Object3D();
  const engine = new Object3D();
  const legs = new Object3D();

  const bodyTopRing = makeCylinder(35, 35, 10, 10, 1, ringMat);
  bodyTopRing.position.y = 0;

  const bodyTopBase = makeCylinder(25, 30, 10, 10, 1, bodyMat);
  bodyTopBase.position.y = 10;

  const bodyTop = makeCylinder(5, 25, 30, 10, 1, bodyMat);
  bodyTop.position.y = 30;

  const bodyTopNippleBase = makeCylinder(5, 5, 5, 10, 1, ringMat);
  bodyTopNippleBase.position.y = 47;

  const bodyTopNipple = makeCylinder(2, 5, 5, 10, 1, ringMat);
  bodyTopNipple.position.y = 52;

  const bodyTopAntenna = makeCylinder(1, 1, 25, 5, 1, ringMat);
  bodyTopAntenna.position.y = 63;

  const bodyTopAntennaBall = new Mesh(new SphereGeometry(2, 20, 10), ringMat);
  bodyTopAntennaBall.position.y = 76;

  top.add(bodyTopRing);
  top.add(bodyTopBase);
  top.add(bodyTop);
  top.add(bodyTopNippleBase);
  top.add(bodyTopNipple);
  top.add(bodyTopAntenna);
  top.add(bodyTopAntennaBall);

  const bodyMidRing = makeCylinder(87, 87, 12, 12, 1, ringMat);
  bodyMidRing.position.y = 0;
  const bodyMidBase = makeCylinder(60, 80, 50, 12, 1, bodyMat);
  bodyMidBase.position.y = 31;

  const bodyMid = makeCylinder(30, 60, 120, 12, 1, bodyMat);
  bodyMid.position.y = 116;

  mid.add(bodyMid);
  mid.add(bodyMidBase);
  mid.add(bodyMidRing);

  const bodyBotRing = makeCylinder(45, 45, 5, 12, 1, ringMat);
  bodyBotRing.position.y = 0;
  const bodyBot = makeCylinder(80, 45, 25, 12, 1, bodyMat);
  bodyBot.position.y = 15;
  bot.add(bodyBotRing);
  bot.add(bodyBot);

  const bodyEngineTop = makeCylinder(45, 50, 5, 12, 1, bodyMat);
  bodyEngineTop.position.y = 0;
  const bodyEngineRingTop = makeCylinder(55, 50, 10, 12, 1, ringMat);
  bodyEngineRingTop.position.y = -8;
  const bodyEngineMid = makeCylinder(45, 45, 10, 8, 1, bodyMat);
  bodyEngineMid.position.y = -18;
  const bodyEngineRingBot = makeCylinder(50, 40, 10, 12, 1, ringMat);
  bodyEngineRingBot.position.y = -28;
  const bodyEngineNozzle = makeCylinder(45, 55, 25, 12, 1, metalMat);
  bodyEngineNozzle.position.y = -44;
  const bodyEngineNozzleEnd = makeCylinder(60, 60, 5, 12, 1, metalMat);
  bodyEngineNozzleEnd.position.y = -59;

  engine.add(bodyEngineTop);
  engine.add(bodyEngineRingTop);
  engine.add(bodyEngineMid);
  engine.add(bodyEngineRingBot);
  engine.add(bodyEngineNozzle);
  engine.add(bodyEngineNozzleEnd);

  const legA = makeCylinder(5, 5, 170, 6, 1, ringMat);
  legA.position.set(0, 0, -75);
  legA.rotation.x = (20 * Math.PI) / 180;
  const legB = makeCylinder(5, 5, 170, 6, 1, ringMat);
  legB.position.set(75, 0, 0);
  legB.rotation.z = (20 * Math.PI) / 180;
  const legY = makeCylinder(5, 5, 170, 6, 1, ringMat);
  legY.position.set(0, 0, 75);
  legY.rotation.x = (-20 * Math.PI) / 180;
  const legZ = makeCylinder(5, 5, 170, 6, 1, ringMat);
  legZ.position.set(-75, 0, 0);
  legZ.rotation.z = (-20 * Math.PI) / 180;

  legs.add(legA);
  legs.add(legB);
  legs.add(legZ);
  legs.add(legY);

  const legASock = makeCylinder(6, 6, 50, 6, 1, metalMat);
  legASock.position.set(0, -37, -89);
  legASock.rotation.x = (20 * Math.PI) / 180;

  const legBSock = makeCylinder(6, 6, 50, 6, 1, metalMat);
  legBSock.position.set(89, -37, 0);
  legBSock.rotation.z = (20 * Math.PI) / 180;

  const legYSock = makeCylinder(6, 6, 50, 6, 1, metalMat);
  legYSock.position.set(0, -37, 89);
  legYSock.rotation.x = (-20 * Math.PI) / 180;

  const legZSock = makeCylinder(6, 6, 50, 6, 1, metalMat);
  legZSock.position.set(-89, -37, 0);
  legZSock.rotation.z = (-20 * Math.PI) / 180;

  legs.add(legASock);
  legs.add(legBSock);
  legs.add(legYSock);
  legs.add(legZSock);

  const legAFoot = new Mesh(footGeom, metalMat);
  legAFoot.position.set(0, -45, 0);
  legAFoot.rotation.x = (-20 * Math.PI) / 180;

  const legBFoot = new Mesh(footGeom, metalMat);
  legBFoot.position.set(0, -45, 0);
  legBFoot.rotation.z = (-20 * Math.PI) / 180;

  const legYFoot = new Mesh(footGeom, metalMat);
  legYFoot.position.set(0, -45, 0);
  legYFoot.rotation.x = (20 * Math.PI) / 180;

  const legZFoot = new Mesh(footGeom, metalMat);
  legZFoot.position.set(0, -45, 0);
  legZFoot.rotation.z = (20 * Math.PI) / 180;

  legASock.add(legAFoot);
  legBSock.add(legBFoot);
  legYSock.add(legYFoot);
  legZSock.add(legZFoot);

  const windowXTop = makeCylinder(14, 14, 2, 10, 1, ringMat);
  windowXTop.position.set(0, -45, 57);
  windowXTop.rotation.x = (75 * Math.PI) / 180;

  const windowXInnerTop = makeCylinder(9, 9, 2, 10, 1, metalMat);
  windowXInnerTop.position.set(0, 2, 0);

  const windowXBot = makeCylinder(12, 12, 2, 10, 1, ringMat);
  windowXBot.position.set(0, 0, 46);
  windowXBot.rotation.x = (75 * Math.PI) / 180;

  const windowXInnerBot = makeCylinder(7, 7, 2, 10, 1, metalMat);
  windowXInnerBot.position.set(0, 2, 0);

  windowXTop.add(windowXInnerTop);
  windowXBot.add(windowXInnerBot);
  bodyMid.add(windowXTop);
  bodyMid.add(windowXBot);

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
