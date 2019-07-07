import { Scene, WebGLRenderer, PerspectiveCamera, PointLight, Mesh, Object3D } from 'three';
import { starfieldFactory } from '../Graphics/Planets/Starfield/Starfield';
import { earthMeshFactory } from '../Graphics/Planets/Earth/Planet';
import { fromEvent, Observable, Subscription } from 'rxjs';

function getRandomCloudDirection(max: number): number {
  return Math.floor(Math.random() * Math.floor(max) - max / 2) / 10000;
}

export class GameScene extends Scene {
  public EARTH_SIZE = 5;
  public CAMERA_DISTANCE = 50;
  private gameElement?: Element;
  private renderer: WebGLRenderer;
  private subscriptions: Subscription[] = [];
  public camera: PerspectiveCamera;
  private sky: Mesh;
  public earth: Mesh;
  private windVelocity: { x: number; y: number; z: number };

  public constructor(
    animationFrame$: Observable<number>,
    windowResize$ = fromEvent(window, 'resize'),
  ) {
    super();
    this.renderer = new WebGLRenderer();
    this.setupCamera();

    this.setupLight();
    this.setupSky();
    this.setupEarth();

    this.subscriptions.push(windowResize$.subscribe(this.updateSceneSize.bind(this)));
    this.subscriptions.push(animationFrame$.subscribe(this.render.bind(this)));
    this.subscriptions.push(animationFrame$.subscribe(this.animation.bind(this)));
  }

  public mount(domElement: Element): this {
    this.gameElement = domElement;

    const { renderer, height, width } = this;
    renderer.setSize(width, height);
    domElement.appendChild(renderer.domElement);
    this.updateSceneSize();
    return this;
  }

  public get width(): number {
    if (!this.gameElement) {
      return 0;
    }
    return this.gameElement.clientWidth;
  }

  public get height(): number {
    if (!this.gameElement) {
      return 0;
    }
    return this.gameElement.clientHeight;
  }

  public addPlayer(object: Object3D): this {
    object.position.y = this.EARTH_SIZE * 1.25;
    this.add(object);
    return this;
  }

  private setupCamera(): void {
    const { width, height, CAMERA_DISTANCE } = this;
    const camera = new PerspectiveCamera(45, width / height, 1, CAMERA_DISTANCE * 2);
    camera.position.z = CAMERA_DISTANCE;
    this.camera = camera;
  }

  private setupLight(): void {
    const pLight = new PointLight(0xffffff, 1, 10000, 2);
    pLight.position.set(1000, 5, 1000);
    this.add(pLight);
  }

  private setupSky(): void {
    const sky = starfieldFactory(this.CAMERA_DISTANCE);
    this.add(sky);
    this.sky = sky;
  }

  private setupEarth(): void {
    const earth = earthMeshFactory(this.EARTH_SIZE);
    this.add(earth);
    this.earth = earth;

    this.windVelocity = {
      x: 0.0002,
      y: -0.0005,
      z: 0.0001,
    };
  }

  private updateSceneSize(): void {
    const { width, height } = this;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private render(): void {
    const { renderer, camera } = this;
    renderer.render(this, camera);
  }

  private updateWindVelocity(): void {
    this.windVelocity = {
      x: getRandomCloudDirection(10),
      y: getRandomCloudDirection(20),
      z: getRandomCloudDirection(10),
    };
  }

  private get clouds(): Object3D | null {
    if (this.earth !== null) {
      return this.earth.children[0];
    }
    null;
  }

  private animation(frame: number): void {
    if (frame % 60) {
      this.updateWindVelocity();
    }
    const { earth, sky, windVelocity, clouds } = this;
    earth.rotateY(0.0005);
    sky.rotateY(0.0003);
    clouds.rotateX(windVelocity.x);
    clouds.rotateY(windVelocity.y);
    clouds.rotateZ(windVelocity.z);
  }
}
