import { Injectable } from "@angular/core";
import { Vector2, PerspectiveCamera, WebGLRenderer, Scene, AmbientLight } from "three";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const INITIAL_CAMERA_POSITION_Y: number = 25;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;

@Injectable()
export class EditorRenderService {

  private mouse: THREE.Vector2;
  private camera: PerspectiveCamera;
  private containerEditor: HTMLDivElement;
  private scene: THREE.Scene;
  private renderer: WebGLRenderer;
  private xScrollPos: number;
  private yScrollPos: number;

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

  this.camera = new PerspectiveCamera(
      FIELD_OF_VIEW,
      this.getAspectRatio(),
      NEAR_CLIPPING_PLANE,
      FAR_CLIPPING_PLANE
  );

  this.camera.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
  this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
}

  private startRenderingLoop(): void {
  this.renderer = new WebGLRenderer();
  this.renderer.setPixelRatio(devicePixelRatio);
  this.renderer.setSize(this.containerEditor.clientWidth, this.containerEditor.clientHeight);
  this.containerEditor.appendChild(this.renderer.domElement);
  this.render();
}

  private getAspectRatio(): number {
  return this.containerEditor.clientWidth / this.containerEditor.clientHeight;
}

  private render(): void {
  requestAnimationFrame(() => this.render());
  this.renderer.render(this.scene, this.camera);
}

  public handleMouseDown(event: MouseEvent): void {

    // We'll keep the mouse position offset algorithm like
    // follow for the time being in order to keep developing.
    // TO BE REVISED
    this.xScrollPos = this.containerEditor.scrollLeft;
    this.yScrollPos = this.containerEditor.scrollTop;
    const offsetX: number = this.containerEditor.offsetLeft - this.xScrollPos + this.containerEditor.clientLeft;
    const offsetY: number = this.containerEditor.offsetTop - this.yScrollPos + this.containerEditor.clientTop;
    if (event.clientX - offsetX >= 0 && event.clientY - offsetY >= 0) {
      this.mouse.x = event.clientX - offsetX;
      this.mouse.y = event.clientY - offsetY;
    }
  }
}
