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
enum Action {
  ADD_POINT = 1,
  SET_SELECTED_VERTEX,
  COMPLETE_LOOP,
  NONE
}

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

  public computeMouseCoordinates(posX: number, posY: number): boolean {
    const offset: Vector2 = new Vector2();
    offset.x = this.containerEditor.offsetLeft + this.containerEditor.clientLeft;
    offset.y = this.containerEditor.offsetTop - document.documentElement.scrollTop + this.containerEditor.clientTop;

    const center: Vector2 = new Vector2();
    // tslint:disable-next-line:no-magic-numbers
    center.x = this.containerEditor.clientWidth / 2;
    // tslint:disable-next-line:no-magic-numbers
    center.y = this.containerEditor.clientHeight / 2;

    this.mouseVector.x = (posX - offset.x - center.x) * VIEW_SIZE / this.containerEditor.clientHeight;
    this.mouseVector.y = -(posY - offset.y - center.y) * VIEW_SIZE / this.containerEditor.clientHeight;

    return (posX > offset.x && posY > offset.y) ? true : false;
  }

  private computeLeftClickAction(): Action {
    const direction: Vector3 = this.mouseVector.clone().sub(this.camera.position).normalize();
    this.raycaster.set(this.camera.position, direction);
    if (this.listOfPoints.isEmpty()) {
      return Action.ADD_POINT;
    } else {
      if (this.raycaster.intersectObject(this.listOfPoints.getFirstVertex(), true).length) {
        if (this.listOfPoints.$isComplete()) {
          return Action.SET_SELECTED_VERTEX;
        } else {
          return Action.COMPLETE_LOOP;
        }
      } else if (this.raycaster.intersectObjects(this.listOfPoints.getVertices(), true).length) {
        return Action.SET_SELECTED_VERTEX ;
      } else {
        if (!this.listOfPoints.$isComplete()) {
            return Action.ADD_POINT;
        }
      }
    }

    return Action.NONE;
  }

  private computeAction(actionId: Action): void {
    switch (actionId) {
      case Action.ADD_POINT:
      this.listOfPoints.addVertex(this.mouseVector);
      break;
      case Action.SET_SELECTED_VERTEX:
      this.selectedVertexName = this.raycaster.intersectObjects(this.listOfPoints.getVertices(), true)[0].object.name;
      break;
      case Action.COMPLETE_LOOP:
      this.listOfPoints.completeLoop();
      break;
      default:
    }
  }
  public handleMouseDown(buttonId: number, x: number, y: number): void {
    if (this.computeMouseCoordinates(x, y)) {
      this.isMouseDown = true;
      switch (buttonId) {
        case LEFT_CLICK_KEYCODE:
            const operation: Action = this.computeLeftClickAction();
            this.computeAction(operation);
            break;
        case RIGHT_CLICK_KEYCODE:
            this.listOfPoints.removeLastVertex();
            break;
        default:
      }
    }
  }
  public handleMouseMove (x: number, y: number): void {
    if (this.computeMouseCoordinates(x, y)) {
      if (this.isMouseDown === true && this.selectedVertexName !== "none") {
        this.listOfPoints.setVertexPosition(this.selectedVertexName, this.mouseVector);
      }
    }
  }

  public handleMouseUp (x: number, y: number): void {
    if (this.computeMouseCoordinates(x, y)) {
      this.isMouseDown = false;
      this.selectedVertexName = "none";
    }
  }

  public onContextMenu(event: MouseEvent): void {
    event.preventDefault();
  }
}
