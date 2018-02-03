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
  private isMouseDown: boolean;
  private selectedVertexName: string;

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
    // tslint:disable-next-line:no-magic-numbers
    -this.ASPECT_RATIO * VIEW_SIZE / 2,
    // tslint:disable-next-line:no-magic-numbers
    this.ASPECT_RATIO * VIEW_SIZE / 2,
    // tslint:disable-next-line:no-magic-numbers
    VIEW_SIZE / 2,
    // tslint:disable-next-line:no-magic-numbers
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

    const center: Vector2 = new Vector2();
    // tslint:disable-next-line:no-magic-numbers
    center.x = this.containerEditor.clientWidth / 2;
    // tslint:disable-next-line:no-magic-numbers
    center.y = this.containerEditor.clientHeight / 2;

    this.mouseVector.x = (event.clientX - offset.x - center.x) * VIEW_SIZE / this.containerEditor.clientHeight;
    this.mouseVector.y = -(event.clientY - offset.y - center.y) * VIEW_SIZE / this.containerEditor.clientHeight;

    return (event.clientX > offset.x && event.clientY > offset.y) ? true : false;
  }

  public computeLeftClickAction(event: MouseEvent): void {
    const direction: Vector3 = this.mouseVector.clone().sub(this.camera.position).normalize();
    this.raycaster.set(this.camera.position, direction);
    if (!this.listOfPoints.isEmpty()) {
      if (this.raycaster.intersectObject(this.listOfPoints.getFirstVertex(), true).length) {
        // Code pour sauvegarder la boucle
        this.listOfPoints.createConnection(this.listOfPoints.getFirstVertex(), this.listOfPoints.getLastVertex());
        alert("La boucle est bouclée comme JAJA frero !");
      } else if (this.raycaster.intersectObjects(this.listOfPoints.getVertices(), true).length) {
        this.selectedVertexName = this.raycaster.intersectObjects(this.listOfPoints.getVertices(), true)[0].object.name;
        

      } else {
        this.listOfPoints.addVertex(this.mouseVector);
      }
    } else {
      this.listOfPoints.addVertex(this.mouseVector);
    }
  }

  public handleMouseDown(event: MouseEvent): void {
    if (this.computeMouseCoordinates(event)) {
      this.isMouseDown = true;
      switch (event.which) {
        case LEFT_CLICK_KEYCODE:
            this.computeLeftClickAction(event);
            break;
        case RIGHT_CLICK_KEYCODE:
            this.listOfPoints.removeLastVertex();
            break;
        default:
      }
    }
  }
  public handleMouseMove (event: MouseEvent): void {
    if (this.computeMouseCoordinates(event)) {
      if (this.isMouseDown === true && this.selectedVertexName !== "none") {
        this.listOfPoints.setVertexPosition(this.selectedVertexName, this.mouseVector);
        this.listOfPoints.updateConnection(this.selectedVertexName, this.mouseVector);
      }
    }
  }

  public handleMouseUp (event: MouseEvent): void {
    if (this.computeMouseCoordinates(event)) {
      this.isMouseDown = false;
      this.selectedVertexName = "none";
    }
  }
}
