import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';

const gameElement = document.getElementById('game');
console.log(gameElement.clientHeight);
const width = gameElement.clientWidth;
const height = gameElement.clientHeight;

const scene = new Scene();
const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
const renderer = new WebGLRenderer();
var geometry = new BoxGeometry(1, 1, 1);
var material = new MeshBasicMaterial({ color: 0x00ff00 });
var cube = new Mesh(geometry, material);

scene.add(cube);
camera.position.z = 5;

renderer.setSize(width, height);
gameElement.appendChild(renderer.domElement);

function animate(): void {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

setInterval((): void => {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
}, 1000 / 60);
