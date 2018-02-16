import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import {
    PerspectiveCamera, WebGLRenderer, Scene, AmbientLight, /*Matrix4,*/
    Mesh, PlaneGeometry, Color, TextureLoader, Geometry,
    MeshLambertMaterial, VertexColors, Texture, FogExp2, Vector3, MeshBasicMaterial, Vector2, BoxGeometry, BackSide
} from "three";
import { Car } from "../car/car";
import { Track, ITrack } from "../../../../../common/racing/track";
import { TrackService } from "../track-service/track.service";
import { DEG_TO_RAD, /*RAD_TO_DEG*/ } from "../constants";
import { CarAiService } from "../ai/car-ai.service";
import { ActivatedRoute } from "@angular/router";

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
const TEMP_GRID_SIZE: number = 300;
const TEMP_GRID_ORIENTATION: number = 90;
const TABLEAU: Array<Vector2> = new Array<Vector2>();
const SKYBOX_SIZE: number = 1000;
const PLAYER_CAMERA: string = "PLAYER_CAMERA";
const AI_CARS_NUMBER: number = 1;

@Injectable()
export class RenderService {
    private _camera: PerspectiveCamera;
    private _container: HTMLDivElement;
    private _playerCar: Car;
    private _renderer: WebGLRenderer;
    private _scene: Scene;
    private _stats: Stats;
    private _lastDate: number;
    private _dayTime: boolean = true;
    private _carAiService: CarAiService[];
    private _aiCars: Car[];
    private _track: Track;

    public get playerCar(): Car {
        return this._playerCar;
    }

    public constructor(private trackService: TrackService, private route: ActivatedRoute) {
        this._playerCar = new Car();
        this._carAiService = [];
        this._aiCars = [];
        // this._track = new Track;
        for (let i: number = 0; i < AI_CARS_NUMBER; ++i) {
            this._aiCars.push(new Car());
            this._carAiService.push(new CarAiService(this._aiCars[i], this._track));
        }
    }
    public getTrack(): void {
        this.trackService.getTrackFromId(this.route.snapshot.paramMap.get("5a7fc1173cb1de3b7ce47a4a"))
            .subscribe((trackFromServer: string) => {
                const iTrack: ITrack = JSON.parse(JSON.stringify(trackFromServer));
                this._track = new Track(iTrack);
            });
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this._container = container;
        }

        await this.createScene();
        this.initStats();
        this.startRenderingLoop();
    }

    private initStats(): void {
        this._stats = new Stats();
        this._stats.dom.style.position = "absolute";
        this._container.appendChild(this._stats.dom);
    }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this._lastDate;
        this._playerCar.update(timeSinceLastFrame);
        // TODO: Remove this instruction, only for testing
        this._carAiService[0].calculateNewPosition();
        //this._aiCars[0].isAcceleratorPressed = true;
        this._aiCars[0].update(timeSinceLastFrame);
        this._lastDate = Date.now();
    }

    private async createScene(): Promise<void> {
        this._scene = new Scene();
        await this._playerCar.init();
        this._scene.add(this._playerCar);
        for (const car of this._aiCars) {
            await car.init();
            this._scene.add(car);
        }

        this._camera = new PerspectiveCamera(
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        this._camera.name = PLAYER_CAMERA;
        this._camera.position.z = INITIAL_CAMERA_POSITION_Z;
        this._camera.position.y = INITIAL_CAMERA_POSITION_Y;
        this._playerCar.attachCamera(this._camera);

        this._scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        await this.renderTrack();
        await this.renderSkyBox();
        await this.initTrack();
    }

    private getAspectRatio(): number {
        return this._container.clientWidth / this._container.clientHeight;
    }

    private startRenderingLoop(): void {
        this._renderer = new WebGLRenderer();
        this._renderer.setPixelRatio(devicePixelRatio);
        this._renderer.setSize(this._container.clientWidth, this._container.clientHeight);

        this._lastDate = Date.now();
        this._container.appendChild(this._renderer.domElement);
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update();
        this._renderer.render(this._scene, this._camera);
        this._stats.update();
    }

    public onResize(): void {
        this._camera.aspect = this.getAspectRatio();
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(this._container.clientWidth, this._container.clientHeight);
    }

    public handleKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._playerCar.isAcceleratorPressed = true;
                break;
            case LEFT_KEYCODE:
                this._playerCar.steerLeft();
                break;
            case RIGHT_KEYCODE:
                this._playerCar.steerRight();
                break;
            case BRAKE_KEYCODE:
                this._playerCar.brake();
                break;
            default:
                break;
        }
    }

    public handleKeyUp(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._playerCar.isAcceleratorPressed = false;
                break;
            case LEFT_KEYCODE:
            case RIGHT_KEYCODE:
                this._playerCar.releaseSteering();
                break;
            case BRAKE_KEYCODE:
                this._playerCar.releaseBrakes();
                break;
            default:
                break;
        }
    }

    /*private getTracksFromServer(): void {
        this.trackService.getTrackList()
            .subscribe((tracks: Track[]) => this.tracks = tracks);
    }*/

    private async renderTrack(): Promise<void> {
        // this.getTracksFromServer();
        this._scene.background = new Color(0xB3F0FF);
        this._scene.fog = new FogExp2(0xFFFFFF, 0.00015);
        const ambientLight: AmbientLight = new AmbientLight(0xCCCCCC);
        this._scene.add(ambientLight);
        // const image = new Image();
        this.renderGround();
        /*this.initTrack();
        const trackWall: Mesh = new Mesh(piste, new MeshLambertMaterial({ map: texture, vertexColors: VertexColors }));
        this.scene.add(trackWall);*/
        /*const piste: Geometry = new Geometry();
        piste.vertices.push(
            new Vector3(-10, 10, 0),
            new Vector3(-8, 12, 0),
            new Vector3(-2, 12, 0),
            new Vector3(4, 10, 0),
            new Vector3(10, 0, 0),
            new Vector3(8, -2, 0),
            new Vector3(2, -8, 0),
            new Vector3(-1, -10, 0),
            new Vector3(-1, -10, 0),
            new Vector3(-8, -4, 0),
        );
        piste.faces.push(new Face3(-10, 10, 0),
            new Face3(-8, 12, 0),
            new Face3(-2, 12, 0),
            new Face3(4, 10, 0),
            new Face3(10, 0, 0),
            new Face3(8, -2, 0),
            new Face3(2, -8, 0),
            new Face3(-1, -10, 0),
            new Face3(-1, -10, 0),
            new Face3(-8, -4, 0));
        const texture: Texture = await this.load2();
        const track: Mesh = new Mesh(piste, new MeshLambertMaterial({ map: texture, vertexColors: VertexColors }));
        track.translate(10, new Vector3(0, 1, 1));
        track.drawMode = TriangleStripDrawMode;
        this.scene.add(track);*/

        /*const heartShape: Shape = new Shape(TABLEAU);
        const extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

        const geometry = new ExtrudeGeometry(heartShape, extrudeSettings);

        const shapeOfYou = new Mesh(geometry, new MeshPhongMaterial());
        this.scene.add(shapeOfYou);*/

        const wallGeometry: PlaneGeometry = new PlaneGeometry(50, 10);
        const texture2: Texture = await this.load1();
        const trackPlane: Mesh = new Mesh(wallGeometry, new MeshLambertMaterial({ map: texture2, vertexColors: VertexColors }));
        trackPlane.translate(5, new Vector3(0, 0, 1));
        this._scene.add(trackPlane);
    }
    private async renderGround(): Promise<void> {
        const groundGeometry: PlaneGeometry = new PlaneGeometry(TEMP_GRID_SIZE, TEMP_GRID_SIZE, TEMP_GRID_SIZE, TEMP_GRID_SIZE);
        const groundMaterial: MeshBasicMaterial = new MeshBasicMaterial({ wireframe: true, color: 0x00FFFF });
        const ground: Mesh = new Mesh(groundGeometry, groundMaterial);
        ground.rotateX(DEG_TO_RAD * TEMP_GRID_ORIENTATION);
        // ground.position = new Vector3(0, 0 , -1); marche po !! better use ground.translate()
        this._scene.add(ground);
    }

    private async renderSkyBox(): Promise<void> {
        let textureSky: Texture;
        if (this._dayTime) {
            textureSky = await this.load3();
        } else {
            textureSky = await this.load2();
        }
        const boxbox: BoxGeometry = new BoxGeometry(SKYBOX_SIZE, SKYBOX_SIZE, SKYBOX_SIZE);
        const skyBox: Mesh = new Mesh(boxbox, new MeshLambertMaterial({ map: textureSky, vertexColors: VertexColors, side: BackSide }));
        this._scene.add(skyBox);
    }

    private async load1(): Promise<Texture> {
        return new Promise<Texture>((resolve, reject) => {
            const loader: TextureLoader = new TextureLoader();
            loader.load("assets/textures/green.png", (object) => {
                resolve(object);
            });
        });
    }

    private async load2(): Promise<Texture> {
        return new Promise<Texture>((resolve, reject) => {
            const loader: TextureLoader = new TextureLoader();
            loader.load("assets/textures/space.jpg", (object) => {
                resolve(object);
            });
        });
    }
    private async load3(): Promise<Texture> {
        return new Promise<Texture>((resolve, reject) => {
            const loader: TextureLoader = new TextureLoader();
            loader.load("assets/textures/sky.jpg", (object) => {
                resolve(object);
            });
        });
    }

    public remplirTableau(): void {
        TABLEAU.push(new Vector2(0, 1));
        TABLEAU.push(new Vector2(1, 5));
        TABLEAU.push(new Vector2(2, 8));
        TABLEAU.push(new Vector2(4, 8));

    }

    private async addPlane(dist: number, angle: number): Promise<void> {
        const texture: Texture = await this.load1();
        const trackPlane: Mesh = new Mesh(this.createGeometry(), new MeshLambertMaterial({ map: texture, vertexColors: VertexColors }));
        trackPlane.translate(5, new Vector3(0, 0, 1));
        trackPlane.rotateY(-3.14 / 2);
        trackPlane.rotateX(-3.14 / 2);
        trackPlane.rotateZ(3.14 / 2);
        trackPlane.translate(5, new Vector3(0, 1, 0));
        trackPlane.translate(dist, new Vector3(1, 0, 0));
        trackPlane.rotateZ(angle);
        trackPlane.translate(4, new Vector3(-1, 0, 0));
        trackPlane.translate(20, new Vector3(0, -1, 0));
        this._scene.add(trackPlane);
    }
    private async initTrack(): Promise<void> {
        const texture1: Texture = await this.load1();
        const texture2: Texture = await this.load2();
        const trackWall: Mesh = new Mesh(this.createGeometry(), new MeshLambertMaterial({ map: texture1, vertexColors: VertexColors }));
        const trackWall2: Mesh = new Mesh(this.createGeometry(), new MeshLambertMaterial({ map: texture2, vertexColors: VertexColors }));
        trackWall.translate(5, new Vector3(0, 0, 1));
        trackWall.rotateY(-3.14 / 2);
        trackWall.rotateX(-3.14 / 2);
        trackWall.rotateZ(3.14 / 2);
        trackWall.translate(5, new Vector3(0, 1, 0));
        trackWall.translate(120, new Vector3(1, 0, 0));

        trackWall2.translate(5, new Vector3(1, 1, 1));
        trackWall2.translate(150, new Vector3(1, 0, 0));
        trackWall2.rotateY(-3.14 / 2);
        this._scene.add(trackWall);
        this._scene.add(trackWall2);
        // this._car.position = new Vector3(-100, 0, 0 );  !!! Modifier la position de l appel pour que ça marche
        this.addPlane(70, 3.14 / 4);
        this.addPlane(50, 0);
        this.addPlane(20, -3.14 / 4);
        this.addPlane(-20, 3.14 / 4);
        this.addPlane(-50, 0);
    }

    private createGeometry(): Geometry {
        // const matrix: Matrix4 = new Matrix4();
        // const light: Color = new Color(0xFFFFFF);
        // const shadow: Color = new Color(0x505050);
        const wallGeometry: PlaneGeometry = new PlaneGeometry(50, 10);
        // wallGeometry.rotateY(Math.PI / 2);

        return wallGeometry;
    }
}
