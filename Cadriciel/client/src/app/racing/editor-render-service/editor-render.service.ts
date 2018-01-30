import { Injectable } from "@angular/core";
import { Vector2, Vector3, PerspectiveCamera, OrthographicCamera,
  WebGLRenderer, Scene, AmbientLight, BoxGeometry, Line, MeshBasicMaterial,
  Mesh, SphereGeometry, Geometry, PointsMaterial, Points, LineBasicMaterial } from "three";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;

@Injectable()
export class EditorRenderService {

  private mouse: THREE.Vector2;
  private camera: OrthographicCamera;
  private containerEditor: HTMLDivElement;
  private scene: THREE.Scene;
  private renderer: WebGLRenderer;
  private point: Points;
  private ballon: Mesh;
  private cube: Mesh;
  private line: Line;

  private LEFT_PLANE: number;
  private RIGHT_PLANE: number;
  private TOP_PLANE: number;
  private BOTTOM_PLANE: number;


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
      this.mouse.x = (event.clientX - offsetX) - (this.containerEditor.clientWidth/2)
      this.mouse.y = -((event.clientY - offsetY) - (this.containerEditor.clientHeight/2));
      // Créér un cube de test lors du click de souris
      const geometry: BoxGeometry = new BoxGeometry( 10, 10, 0 );
      const material: MeshBasicMaterial = new MeshBasicMaterial( { color: 0X00FF00 } );
      this.cube = new Mesh( geometry, material );
      this.cube.position.set(this.mouse.x, this.mouse.y, 0);
      this.scene.add( this.cube );
      this.createPoint (this.mouse.x/100, this.mouse.y/100);
      this.createBall(this.mouse.x, this.mouse.y); 
      this.DrawLine(this.mouse.x, this.mouse.y);
    }
  }

  public createPoint (x:number, y: number) : void {

    const geometry2 = new Geometry();
    geometry2.vertices.push(new Vector3( 2, 3, 3));
    /*this.geometry2.addAttribute( 'position', new BufferAttribute( 0xff10000,3 ) );
    this.geometry2.addAttribute( 'customColor', new BufferAttribute( colors, 3 ) );
    this.geometry2.addAttribute( 'size', new BufferAttribute( sizes, 1 ) );*/
    const material2 = new PointsMaterial( { size: 30, sizeAttenuation: false, color: 0x881080 } );
    this.point = new Points(geometry2, material2);
    this.point.position.set( x, y, 0 );
    this.scene.add( this.point );

  }

  public createBall (x : number, y : number) : void {
    const geomerty = new SphereGeometry(1,  1, 1);
    const material = new MeshBasicMaterial ( {color : 0xffff00});
    this.ballon = new Mesh(geomerty, material);
    this.ballon.position.set(x ,y ,0);
    this.scene.add (this.ballon);
  }

  public DrawLine (x : number, y : number) {
    const LineMaterial = new LineBasicMaterial ({ color: 0x0110ff });
    const geometry = new Geometry();
    geometry.vertices.push(new Vector3(this.point.position.x,this.point.position.y , 0));
    geometry.vertices.push(new Vector3(x, y, 0));
    //geometry.vertices.push(new Vector3(10, 0, 0));
    //lines are drawn between each consecutive pair of vertices, but not between the first and last (the line is not closed)
    this.line = new Line(geometry, LineMaterial);
    this.scene.add(this.line);
  }
}

