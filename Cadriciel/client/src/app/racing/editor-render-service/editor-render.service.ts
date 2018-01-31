import { Injectable } from "@angular/core";
import { Vector2, OrthographicCamera,
  WebGLRenderer, Scene, AmbientLight} from "three";
import { TrackVertices } from "../trackVertices";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const CAMERA_Z_POSITION: number = 10;

const LEFT_CLICK_KEYCODE: number = 1;
const RIGHT_CLICK_KEYCODE: number = 3;

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;

@Injectable()
export class EditorRenderService {

  private mouse: THREE.Vector2;
  private camera: OrthographicCamera;
  private containerEditor: HTMLDivElement;
  private scene: THREE.Scene;
  private renderer: WebGLRenderer;

  private LEFT_PLANE: number;
  private RIGHT_PLANE: number;
  private TOP_PLANE: number;
  private BOTTOM_PLANE: number;
  private listOfPoints: TrackVertices;

  public constructor() {
        this.mouse = new Vector2(0, 0);
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
  this.listOfPoints = new TrackVertices(this.scene);

  /*this.camera = new PerspectiveCamera(
      FIELD_OF_VIEW,
      this.getAspectRatio(),
      NEAR_CLIPPING_PLANE,
      FAR_CLIPPING_PLANE
  );
  */
  this.LEFT_PLANE = -(this.containerEditor.clientWidth / 2);
  this.RIGHT_PLANE = (this.containerEditor.clientWidth / 2);
  this.TOP_PLANE = (this.containerEditor.clientHeight / 2);
  this.BOTTOM_PLANE = -(this.containerEditor.clientHeight / 2);

  this.camera = new OrthographicCamera(
    this.LEFT_PLANE,
    this.RIGHT_PLANE,
    this.TOP_PLANE,
    this.BOTTOM_PLANE,
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
      this.mouse = new Vector2((event.clientX - offset.x) - containerCenter.x, -((event.clientY - offset.y) - containerCenter.y));

      return true;
    } else {

      return false;
    }
  }

  public handleMouseDown(event: MouseEvent): void {
    if (this.computeMouseCoordinates(event)) {
      switch (event.which) {
        case LEFT_CLICK_KEYCODE:
            this.listOfPoints.addVertex(this.mouse);
            break;
        case RIGHT_CLICK_KEYCODE:
            this.listOfPoints.removeLastVertex();
            break;
        default:
      }
    }
  }
}
