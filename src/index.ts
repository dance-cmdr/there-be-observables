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
} from 'three';

import { earthMeshFactory } from './Planets/Planet';

const gameElement = document.getElementById('game');
console.log(gameElement.clientHeight);
const width = gameElement.clientWidth;
const height = gameElement.clientHeight;

const scene = new Scene();
const renderer = new WebGLRenderer();

const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;

var pLight = new PointLight(0xffffaa, 0.7);
pLight.position.set(10, 10, 100);
scene.add(pLight);

renderer.setSize(width, height);
gameElement.appendChild(renderer.domElement);

function animate(): void {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

const earthMesh = earthMeshFactory();
scene.add(earthMesh);
