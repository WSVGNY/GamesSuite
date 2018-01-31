import { Injectable } from "@angular/core";
import { Vector2, OrthographicCamera,
  WebGLRenderer, Scene, AmbientLight} from "three";
import { TrackVertices } from "../trackVertices";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;

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
  private listOfPoints :TrackVertices;



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

  private render(): void {
  requestAnimationFrame(() => this.render());
  this.renderer.render(this.scene, this.camera);
}

  public onResize(): void {
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(this.containerEditor.clientWidth, this.containerEditor.clientHeight);
}

  public handleMouseDown(event: MouseEvent): void {
    const offsetX: number = this.containerEditor.offsetLeft + this.containerEditor.clientLeft;
    const offsetY: number = this.containerEditor.offsetTop - document.documentElement.scrollTop + this.containerEditor.clientTop;
    if (event.clientX > offsetX && event.clientY > offsetY) {
      this.mouse.x = (event.clientX - offsetX) - (this.containerEditor.clientWidth/2)
      this.mouse.y = -((event.clientY - offsetY) - (this.containerEditor.clientHeight/2));
      
      this.listOfPoints.addVertex(this.mouse.x, this.mouse.y); 
    }
  }

  public pressRightClic (event : MouseEvent){
    this.listOfPoints.removeLastVertex();
  }
}
