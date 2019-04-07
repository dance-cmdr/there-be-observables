import { Scene, PerspectiveCamera, WebGLRenderer, PointLight } from 'three';

import { earthMeshFactory } from './Planets/Earth/Planet';
import { starfieldFactory } from './Planets/Starfield/Starfield';

const cameraDistance = 5;
const earthSize = 1;

const gameElement = document.getElementById('game');
console.log(gameElement.clientHeight);
const width = gameElement.clientWidth;
const height = gameElement.clientHeight;

const scene = new Scene();
const renderer = new WebGLRenderer();

const camera = new PerspectiveCamera(45, width / height, 0.1, 1000);
camera.position.z = cameraDistance;

var pLight = new PointLight(0xffffff, 1, 10000, 2);
pLight.position.set(1000, 5, 1000);

scene.add(pLight);

renderer.setSize(width, height);
gameElement.appendChild(renderer.domElement);

const sky = starfieldFactory(cameraDistance);
scene.add(sky);

const earthMesh = earthMeshFactory(earthSize);
scene.add(earthMesh);

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
