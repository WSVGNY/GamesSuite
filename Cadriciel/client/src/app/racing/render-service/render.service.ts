import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import {
    PerspectiveCamera, WebGLRenderer, Scene, AmbientLight, /*Matrix4,*/
    Mesh, PlaneGeometry, Color, TextureLoader, Geometry, LineBasicMaterial, Line, Shape,
    MeshLambertMaterial, VertexColors, Texture, FogExp2, Vector3, MeshBasicMaterial, Vector2, BoxGeometry, BackSide, ShapeGeometry, Path
} from "three";
import { Car } from "../car/car";
// import { Track } from "../../../../../common/racing/track";
// import { TrackService } from "../track-service/track.service";
import { DEG_TO_RAD, /*RAD_TO_DEG*/ } from "../constants";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d

const INITIAL_CAMERA_POSITION_Z: number = 10;
const INITIAL_CAMERA_POSITION_Y: number = 5;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
const TEMP_GRID_ORIENTATION: number = 90;

const PLAYER_CAMERA: string = "PLAYER_CAMERA";

@Injectable()
export class RenderService {
    private camera: PerspectiveCamera;
    private container: HTMLDivElement;
    private _car: Car;
    private renderer: WebGLRenderer;
    private scene: Scene;
    private stats: Stats;
    private lastDate: number;
    /*private tracks: Track[];
    private trackService: TrackService;*/

    public get car(): Car {
        return this._car;
    }

    public constructor() {
        this._car = new Car();
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this.container = container;
        }

        await this.createScene();
        this.initStats();
        this.startRenderingLoop();
    }

    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.container.appendChild(this.stats.dom);
    }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this._car.update(timeSinceLastFrame);
        this.lastDate = Date.now();
    }

    private async createScene(): Promise<void> {
        this.scene = new Scene();
        await this._car.init();
        this.scene.add(this._car);

        this.camera = new PerspectiveCamera(
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        this.camera.name = PLAYER_CAMERA;
        this.camera.position.z = INITIAL_CAMERA_POSITION_Z;
        this.camera.position.y = INITIAL_CAMERA_POSITION_Y;
        this._car.attachCamera(this.camera);

        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        // await this.renderGround();
        // await this.renderTrack();
        // await this.renderSkyBox();
        // await this.initTrack();
        // this.createShape();
        // this.renderGround();
        this.allo();
    }

    private getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    private startRenderingLoop(): void {
        this.renderer = new WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.lastDate = Date.now();
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update();
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    }

    public onResize(): void {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public handleKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._car.isAcceleratorPressed = true;
                break;
            case LEFT_KEYCODE:
                this._car.steerLeft();
                break;
            case RIGHT_KEYCODE:
                this._car.steerRight();
                break;
            case BRAKE_KEYCODE:
                this._car.brake();
                break;
            default:
                break;
        }
    }

    public handleKeyUp(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._car.isAcceleratorPressed = false;
                break;
            case LEFT_KEYCODE:
            case RIGHT_KEYCODE:
                this._car.releaseSteering();
                break;
            case BRAKE_KEYCODE:
                this._car.releaseBrakes();
                break;
            default:
                break;
        }
    }

    poly = [[-488, -275], [-550, 170], [96, 342], [748, 70], [704, -263]];
    poly2 = [[-245, -63], [-159, 127], [78, 149], [66, -64]];

    private async allo(): Promise<void> {
        let shape: Shape = new Shape();
        shape.moveTo(this.poly[0][0], this.poly[0][1]);
        for (let i = 1; i < this.poly.length; ++i)
            shape.lineTo(this.poly[i][0], this.poly[i][1]);
        shape.lineTo(this.poly[0][0], this.poly[0][1]);

        let holePath = new Path();

        holePath.moveTo(this.poly2[this.poly2.length - 1][0], this.poly2[this.poly2.length - 1][1]);
        for (let i = this.poly2.length - 2; i >= 0; --i)
            holePath.lineTo(this.poly2[i][0], this.poly2[i][1]);

        holePath.lineTo(this.poly2[this.poly2.length - 1][0], this.poly2[this.poly2.length - 1][1]);
        shape.holes.push(holePath);
        let geometry = new ShapeGeometry(shape);
        const groundMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: 0x00FFFF });
        const ground: Mesh = new Mesh(geometry, groundMaterial);
        ground.rotateX(-Math.PI / 2);
        // ground.position = new Vector3(0, 0 , -1); marche po !! better use ground.translate()
        this.scene.add(ground);
    }

    // private async renderTrack(): Promise<void> {
    //     // this.getTracksFromServer();
    //     this.scene.background = new Color(0xB3F0FF);
    //     this.scene.fog = new FogExp2(0xFFFFFF, 0.00015);
    //     const ambientLight: AmbientLight = new AmbientLight(0xCCCCCC);
    //     this.scene.add(ambientLight);
    //     // const image = new Image();

    //     /*this.initTrack();
    //     const trackWall: Mesh = new Mesh(piste, new MeshLambertMaterial({ map: texture, vertexColors: VertexColors }));
    //     this.scene.add(trackWall);*/
    //     /*const piste: Geometry = new Geometry();
    //     piste.vertices.push(
    //         new Vector3(-10, 10, 0),
    //         new Vector3(-8, 12, 0),
    //         new Vector3(-2, 12, 0),
    //         new Vector3(4, 10, 0),
    //         new Vector3(10, 0, 0),
    //         new Vector3(8, -2, 0),
    //         new Vector3(2, -8, 0),
    //         new Vector3(-1, -10, 0),
    //         new Vector3(-1, -10, 0),
    //         new Vector3(-8, -4, 0),
    //     );
    //     piste.faces.push(new Face3(-10, 10, 0),
    //         new Face3(-8, 12, 0),
    //         new Face3(-2, 12, 0),
    //         new Face3(4, 10, 0),
    //         new Face3(10, 0, 0),
    //         new Face3(8, -2, 0),
    //         new Face3(2, -8, 0),
    //         new Face3(-1, -10, 0),
    //         new Face3(-1, -10, 0),
    //         new Face3(-8, -4, 0));
    //     const texture: Texture = await this.load2();
    //     const track: Mesh = new Mesh(piste, new MeshLambertMaterial({ map: texture, vertexColors: VertexColors }));
    //     track.translate(10, new Vector3(0, 1, 1));
    //     track.drawMode = TriangleStripDrawMode;
    //     this.scene.add(track);*/

    //     const wallGeometry: PlaneGeometry = new PlaneGeometry(50, 10);
    //     const texture2: Texture = await this.load1();
    //     const trackPlane: Mesh = new Mesh(wallGeometry, new MeshLambertMaterial({ map: texture2, vertexColors: VertexColors }));
    //     trackPlane.translate(5, new Vector3(0, 0, 1));
    //     this.scene.add(trackPlane);
    // }
    // private async renderGround(): Promise<void> {
    //     const groundGeometry: PlaneGeometry = new PlaneGeometry(TEMP_GRID_SIZE, TEMP_GRID_SIZE, TEMP_GRID_SIZE, TEMP_GRID_SIZE);
    //     const groundMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: 0x00FFFF });
    //     const ground: Mesh = new Mesh(groundGeometry, groundMaterial);
    //     ground.rotateX(DEG_TO_RAD * TEMP_GRID_ORIENTATION);
    //     // ground.position = new Vector3(0, 0 , -1); marche po !! better use ground.translate()
    //     this.scene.add(ground);
    // }

    // private async renderSkyBox(): Promise<void> {
    //     let textureSky: Texture;
    //     if (this.dayTime) {
    //         textureSky = await this.load3();
    //     } else {
    //         textureSky = await this.load2();
    //     }
    //     const boxbox: BoxGeometry = new BoxGeometry(SKYBOX_SIZE, SKYBOX_SIZE, SKYBOX_SIZE);
    //     const skyBox: Mesh = new Mesh(boxbox, new MeshLambertMaterial({ map: textureSky, vertexColors: VertexColors, side: BackSide }));
    //     this.scene.add(skyBox);
    // }

    // private async load1(): Promise<Texture> {
    //     return new Promise<Texture>((resolve, reject) => {
    //         const loader: TextureLoader = new TextureLoader();
    //         loader.load("assets/textures/green.png", (object) => {
    //             resolve(object);
    //         });
    //     });
    // }

    // private async load2(): Promise<Texture> {
    //     return new Promise<Texture>((resolve, reject) => {
    //         const loader: TextureLoader = new TextureLoader();
    //         loader.load("assets/textures/space.jpg", (object) => {
    //             resolve(object);
    //         });
    //     });
    // }
    // private async load3(): Promise<Texture> {
    //     return new Promise<Texture>((resolve, reject) => {
    //         const loader: TextureLoader = new TextureLoader();
    //         loader.load("assets/textures/sky.jpg", (object) => {
    //             resolve(object);
    //         });
    //     });
    // }

    // public remplirTableau(): void {
    //     TABLEAU.push(new Vector2(0, 1));
    //     TABLEAU.push(new Vector2(1, 5));
    //     TABLEAU.push(new Vector2(2, 8));
    //     TABLEAU.push(new Vector2(4, 8));

    // }
    // /* tslint:disable */
    // private createShape(): void {
    //     // Méthode 1 qui pue :(((
    //     const geo: Geometry = new Geometry();
    //     geo.vertices.push(new Vector3(0, 5, 0));
    //     geo.vertices.push(new Vector3(5, -5, -2));
    //     geo.vertices.push(new Vector3(-5, -5, 2));
    //     geo.vertices.push(new Vector3(0, 5, 0)); // close the loop

    //     // material
    //     const material: LineBasicMaterial = new LineBasicMaterial({ color: 0xff00ff, linewidth: 1 });
    //     // line
    //     const line: Line = new Line(geo, material);
    //     this.scene.add(line);
    //     // Méthode 2 qui à l air d'être la BONNE !!! Let s gooooooooo !!!
    //     let poly = [[-400, -200], [-450, 70], [-5, 242], [640, -30], [604, -363]];
    //     let shape: Shape = new Shape();
    //     shape.moveTo(poly[0][0], poly[0][1]);
    //     let i: number;
    //     for (i = 1; i < poly.length; ++i) {
    //         shape.lineTo(poly[i][0], poly[i][1]);
    //     }
    //     shape.lineTo(poly[0][0], poly[0][1]);

    //     const geometry: ShapeGeometry = new ShapeGeometry(shape);
    //     const material2: MeshBasicMaterial = new MeshBasicMaterial({
    //         color: 0x800000
    //     });
    //     const shapeOfYou: Mesh = new Mesh(geometry, material2);
    //     shapeOfYou.rotateX(- Math.PI / 2);
    //     this.scene.add(shapeOfYou);

    //     let poly2 = [[-300, -100], [-200, 150], [100, 200], [100, -98]];
    //     let shape2: Shape = new Shape();
    //     shape2.moveTo(poly2[0][0], poly2[0][1]);
    //     let j: number;
    //     for (j = 1; j < poly2.length; ++j) {
    //         shape2.lineTo(poly2[j][0], poly2[j][1]);
    //     }
    //     shape.lineTo(poly2[0][0], poly2[0][1]);
    //     const geometry2: ShapeGeometry = new ShapeGeometry(shape2);
    //     const material3: MeshBasicMaterial = new MeshBasicMaterial({
    //         color: 0x8000ff
    //     });
    //     const shapeOfYou2: Mesh = new Mesh(geometry2, material3);
    //     shapeOfYou2.rotateX(- Math.PI / 2);
    //     shapeOfYou2.translateZ(0.005);
    //     this.scene.add(shapeOfYou2);
    // }

    // /*private async addPlane(dist: number, angle: number): Promise<void> {
    //     const texture: Texture = await this.load1();
    //     const trackPlane: Mesh = new Mesh(this.createGeometry(), new MeshLambertMaterial({ map: texture, vertexColors: VertexColors }));
    //     trackPlane.translate(5, new Vector3(0, 0, 1));
    //     trackPlane.rotateY(-3.14 / 2);
    //     trackPlane.rotateX(-3.14 / 2);
    //     trackPlane.rotateZ(3.14 / 2);
    //     trackPlane.translate(5, new Vector3(0, 1, 0));
    //     trackPlane.translate(dist, new Vector3(1, 0, 0));
    //     trackPlane.rotateZ(angle);
    //     trackPlane.translate(4, new Vector3(-1, 0, 0));
    //     trackPlane.translate(20, new Vector3(0, -1, 0));
    //     this.scene.add(trackPlane);
    // }
    // private async initTrack(): Promise<void> {
    //     const texture1: Texture = await this.load1();
    //     const texture2: Texture = await this.load2();
    //     const trackWall: Mesh = new Mesh(this.createGeometry(), new MeshLambertMaterial({ map: texture1, vertexColors: VertexColors }));
    //     const trackWall2: Mesh = new Mesh(this.createGeometry(), new MeshLambertMaterial({ map: texture2, vertexColors: VertexColors }));
    //     trackWall.translate(5, new Vector3(0, 0, 1));
    //     trackWall.rotateY(-3.14 / 2);
    //     trackWall.rotateX(-3.14 / 2);
    //     trackWall.rotateZ(3.14 / 2);
    //     trackWall.translate(5, new Vector3(0, 1, 0));
    //     trackWall.translate(120, new Vector3(1, 0, 0));

    //     trackWall2.translate(5, new Vector3(1, 1, 1));
    //     trackWall2.translate(150, new Vector3(1, 0, 0));
    //     trackWall2.rotateY(-3.14 / 2);
    //     this.scene.add(trackWall);
    //     this.scene.add(trackWall2);
    //     // this._car.position = new Vector3(-100, 0, 0 );  !!! Modifier la position de l appel pour que ça marche
    //     this.addPlane(70, 3.14 / 4);
    //     this.addPlane(50, 0);
    //     this.addPlane(20, -3.14 / 4);
    //     this.addPlane(-20, 3.14 / 4);
    //     this.addPlane(-50, 0);
    // }

    // private createGeometry(): Geometry {
    //     // const matrix: Matrix4 = new Matrix4();
    //     // const light: Color = new Color(0xFFFFFF);
    //     // const shadow: Color = new Color(0x505050);
    //     const wallGeometry: PlaneGeometry = new PlaneGeometry(50, 10);
    //     // wallGeometry.rotateY(Math.PI / 2);

    //     return wallGeometry;
    // }*/
}
