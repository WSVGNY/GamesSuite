import { Injectable } from "@angular/core";
import { Vector2, Vector3, PerspectiveCamera, WebGLRenderer, Scene, AmbientLight, BoxGeometry, MeshBasicMaterial, Mesh } from "three";

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
  private cube: Mesh;

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

  this.camera.position.set(0, 0, 10);
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
  // this.update();
  //this.cube.rotation.x += 0.1;
  //this.cube.rotation.y += 0.1;
  this.renderer.render(this.scene, this.camera);
}

  public onResize(): void {
  this.camera.aspect = this.getAspectRatio();
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(this.containerEditor.clientWidth, this.containerEditor.clientHeight);
}

  public handleMouseDown(event: MouseEvent): void {
    const offsetX: number = this.containerEditor.offsetLeft + this.containerEditor.clientLeft;
    const offsetY: number = this.containerEditor.offsetTop - document.documentElement.scrollTop + this.containerEditor.clientTop;
    if (event.clientX > offsetX && event.clientY > offsetY) {
      this.mouse.x = event.clientX - offsetX;
      this.mouse.y = event.clientY - offsetY;
      // Call point creation logic here
      const geometry: BoxGeometry = new BoxGeometry( 1, 1, 0 );
      const material: MeshBasicMaterial = new MeshBasicMaterial( { color: 0X00FF00 } );
      this.cube = new Mesh( geometry, material );
      this.cube.position.set(0, 0, 0);
      this.scene.add( this.cube );
    }
  }
}
