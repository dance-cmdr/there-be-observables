import { Scene, PerspectiveCamera, WebGLRenderer, PointLight, Vector3 } from 'three';

import { earthMeshFactory } from './Planets/Earth/Planet';
import { starfieldFactory } from './Planets/Starfield/Starfield';
import { rocketFactory } from './Rocket';

const cameraDistance = 50;
const earthSize = 10;
const RocketSize = 1;

const gameElement = document.getElementById('game');
console.log(gameElement.clientHeight);
const width = gameElement.clientWidth;
const height = gameElement.clientHeight;

const scene = new Scene();
const renderer = new WebGLRenderer();

const camera = new PerspectiveCamera(45, width / height, 1, cameraDistance * 2);
camera.position.z = cameraDistance;

var pLight = new PointLight(0xffffff, 1, 10000, 2);
pLight.position.set(1000, 5, 1000);

renderer.setSize(width, height);
gameElement.appendChild(renderer.domElement);

const sky = starfieldFactory(cameraDistance);

const earthMesh = earthMeshFactory(earthSize);

function getRandomCloudDirection(max: number): number {
  return Math.floor(Math.random() * Math.floor(max) - max / 2) / 10000;
}

const wind = {
  x: 0.0002,
  y: -0.0005,
  z: 0.0001,
};

setInterval((): void => {
  wind.x = getRandomCloudDirection(10);
  wind.y = getRandomCloudDirection(20);
  wind.z = getRandomCloudDirection(10);
}, 60000);
//clock
setInterval((): void => {
  earthMesh.rotateY(0.0005);
  sky.rotateY(0.0003);
  earthMesh.children[0].rotateX(wind.x);
  earthMesh.children[0].rotateY(wind.y);
  earthMesh.children[0].rotateZ(wind.z);
}, 1000 / 60);

function animate(): void {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

function onWindowResize(): void {
  const width = gameElement.clientWidth;
  const height = gameElement.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', onWindowResize, false);

const rocket = rocketFactory(RocketSize);
rocket.position.y = earthSize * 1.02;
console.log(rocket);

scene.add(pLight);
scene.add(sky);
scene.add(earthMesh);
scene.add(rocket);
