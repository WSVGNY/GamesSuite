import { Injectable } from "@angular/core";
import { Vector2, Vector3, OrthographicCamera,
  WebGLRenderer, Scene, AmbientLight, Raycaster} from "three";
import { TrackVertices } from "../trackVertices";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const CAMERA_Z_POSITION: number = 480;
const VIEW_SIZE: number = 1000;
const LEFT_CLICK_KEYCODE: number = 1;
const RIGHT_CLICK_KEYCODE: number = 3;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;

@Injectable()
export class EditorRenderService {

  private mouseVector: THREE.Vector3;
  private camera: OrthographicCamera;
  private ASPECT_RATIO: number;
  private containerEditor: HTMLDivElement;
  private scene: THREE.Scene;
  private renderer: WebGLRenderer;
  private raycaster: Raycaster;
  private listOfPoints: TrackVertices;

  public constructor() {
        this.mouseVector = new Vector3(0, 0, 0);
  }

  public async initialize(containerEditor: HTMLDivElement): Promise<void> {
    if (containerEditor) {
        this.containerEditor = containerEditor;
    }

    await this.createScene();
    this.startRenderingLoop();
}

  private async createScene(): Promise<void> {
  this.scene = new Scene();
  this.raycaster = new Raycaster();
  this.listOfPoints = new TrackVertices(this.scene);

  this.ASPECT_RATIO = this.containerEditor.clientWidth / this.containerEditor.clientHeight;
  this.camera = new OrthographicCamera(
    -this.ASPECT_RATIO * VIEW_SIZE / 2,
    this.ASPECT_RATIO * VIEW_SIZE / 2,
    VIEW_SIZE / 2,
    -VIEW_SIZE / 2,
    NEAR_CLIPPING_PLANE,
    FAR_CLIPPING_PLANE );
  this.camera.position.set(0, 0, CAMERA_Z_POSITION);
  this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
}

  private startRenderingLoop(): void {
  this.renderer = new WebGLRenderer();
  this.renderer.setPixelRatio(devicePixelRatio);
  this.renderer.setSize(this.containerEditor.clientWidth, this.containerEditor.clientHeight);
  this.containerEditor.appendChild(this.renderer.domElement);
  this.render();
}

  private render(): void {
  requestAnimationFrame(() => this.render());
  this.renderer.render(this.scene, this.camera);
}

  public onResize(): void {
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(this.containerEditor.clientWidth, this.containerEditor.clientHeight);
}

  public computeMouseCoordinates(event: MouseEvent): boolean {
    const offset: Vector2 = new Vector2();
    offset.x = this.containerEditor.offsetLeft + this.containerEditor.clientLeft;
    offset.y = this.containerEditor.offsetTop - document.documentElement.scrollTop + this.containerEditor.clientTop;
    const containerCenter: Vector2 = new Vector2();
    containerCenter.x = this.containerEditor.clientWidth / 2;
    containerCenter.y = this.containerEditor.clientHeight / 2;

    if (event.clientX > offset.x && event.clientY > offset.y) {
      this.mouseVector.x = (event.clientX - offset.x - containerCenter.x) * VIEW_SIZE / this.containerEditor.clientHeight;
      this.mouseVector.y = -(event.clientY - offset.y - containerCenter.y) * VIEW_SIZE / this.containerEditor.clientHeight;

      return true;
    } else {

      return false;
    }
  }

  public handleMouseDown(event: MouseEvent): void {
    if (this.computeMouseCoordinates(event)) {
      switch (event.which) {
        case LEFT_CLICK_KEYCODE:
            const direction: Vector3 = this.mouseVector.clone().sub(this.camera.position).normalize();
            this.raycaster.set(this.camera.position, direction);
            if ( this.raycaster.intersectObjects(this.scene.children, true).length ) {
              alert( "hit!");
            }
            this.listOfPoints.addVertex(this.mouseVector);
            break;
        case RIGHT_CLICK_KEYCODE:
            this.listOfPoints.removeLastVertex();
            break;
        default:
      }
    }
  }
}
