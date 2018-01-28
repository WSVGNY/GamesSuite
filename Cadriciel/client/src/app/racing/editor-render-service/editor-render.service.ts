import { Injectable } from "@angular/core";
import { Vector2, Vector3, PerspectiveCamera, WebGLRenderer, Scene, AmbientLight,BoxGeometry, MeshBasicMaterial, Mesh, SphereGeometry, Geometry, PointsMaterial, Points } from "three";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

//const INITIAL_CAMERA_POSITION_Y: number = 25;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;

@Injectable()
export class EditorRenderService {

  private mouse: THREE.Vector2;
  private camera: PerspectiveCamera;
  private containerEditor: HTMLDivElement;
  private scene: THREE.Scene;
  private renderer: WebGLRenderer;
  private point: Points;
  private geomerty: SphereGeometry;
  private material: MeshBasicMaterial;
  private ballon: Mesh;
  private cube: Mesh;
  private geometry2 : Geometry;
  private material2 : PointsMaterial;

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
  // this.cube.rotation.x += 0.1;
  // this.cube.rotation.y += 0.1;
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
      // Créér un cube de test lors du click de souris
      const geometry: BoxGeometry = new BoxGeometry( 1, 1, 0 );
      const material: MeshBasicMaterial = new MeshBasicMaterial( { color: 0X00FF00 } );
      this.cube = new Mesh( geometry, material );
      this.cube.position.set(0, 0, 0);
      this.scene.add( this.cube );
      this.createPoint (this.mouse.x, this.mouse.y);
      this.createPoint(255, 366);
    }
  }

  public createPoint (x:number, y: number) : void {

    this.geometry2.vertices.push(new Vector3( 2, 3, 3));
    /*this.geometry2.addAttribute( 'position', new BufferAttribute( 0xff10000,3 ) );
    this.geometry2.addAttribute( 'customColor', new BufferAttribute( colors, 3 ) );
    this.geometry2.addAttribute( 'size', new BufferAttribute( sizes, 1 ) );*/
    this.material2 = new PointsMaterial( { size: 30, sizeAttenuation: false, color: 0x881080 } );
    this.point = new Points(this.geometry2, this.material);
    this.point.position.set( x, y, 0 );
    this.scene.add( this.point );

  }

  public createBall () : void {
    this.geomerty = new SphereGeometry(5,  32, 32);
    this.material = new MeshBasicMaterial ( {color : 0xffff00});
    this.ballon = new Mesh(this.geomerty, this.material);
    this.scene.add (this.ballon);
  }
}

