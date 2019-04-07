import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  SphereGeometry,
  MeshPhongMaterial,
  PointLight,
  PointLightHelper,
} from 'three';

import { earthMeshFactory } from './Planets/Earth/Planet';

const gameElement = document.getElementById('game');
console.log(gameElement.clientHeight);
const width = gameElement.clientWidth;
const height = gameElement.clientHeight;

const scene = new Scene();
const renderer = new WebGLRenderer();

const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;

var pLight = new PointLight(0xffffff, 1);
pLight.position.set(30, 5, 100);

scene.add(pLight);

renderer.setSize(width, height);
gameElement.appendChild(renderer.domElement);

function animate(): void {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

const earthMesh = earthMeshFactory(1);
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
  earthMesh.children[0].rotateX(wind.x);
  earthMesh.children[0].rotateY(wind.y);
  earthMesh.children[0].rotateZ(wind.z);
}, 1000 / 60);
