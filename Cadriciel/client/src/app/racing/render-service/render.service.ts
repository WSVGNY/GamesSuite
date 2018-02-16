import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import {
    PerspectiveCamera, WebGLRenderer, Scene, AmbientLight, /*Matrix4,*/
    Mesh, PlaneGeometry, TextureLoader, Shape,
    MeshLambertMaterial, VertexColors, Texture, MeshBasicMaterial, BoxGeometry, ShapeGeometry, Path, BackSide
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
const TEMP_GRID_ORIENTATION: number = 90;
const TEMP_GRID_SIZE: number = 100;
const SKYBOX_SIZE: number = 1000;
const PLAYER_CAMERA: string = "PLAYER_CAMERA";
const AI_CARS_NUMBER: number = 1;

@Injectable()
export class RenderService {
    /*private tracks: Track[];
    private trackService: TrackService;*/
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
        this._lastDate = Date.now();
    }

    private async createScene(): Promise<void> {
        this._scene = new Scene();
        await this._playerCar.init();
        this._scene.add(this._playerCar);

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
        await this.renderGround();
        await this.renderSkyBox();
        this.renderTrack();
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

    poly= [[-488, -275], [-550, 170], [96, 342], [748, 70], [704, -263]];
    poly2 = [[-245, -63], [-159, 127], [78, 149], [66, -64]];
    private async renderTrack(): Promise<void> {
        const shape: Shape = new Shape();
        shape.moveTo(this.poly[0][0], this.poly[0][1]);
        for (let i: number = 1; i < this.poly.length; ++i) {
            shape.lineTo(this.poly[i][0], this.poly[i][1]);
        }
        shape.lineTo(this.poly[0][0], this.poly[0][1]);

        const holePath: Path = new Path();

        holePath.moveTo(this.poly2[this.poly2.length - 1][0], this.poly2[this.poly2.length - 1][1]);
        for (let i: number = this.poly2.length - 2; i >= 0; --i){
            holePath.lineTo(this.poly2[i][0], this.poly2[i][1]);
        }
        holePath.lineTo(this.poly2[this.poly2.length - 1][0], this.poly2[this.poly2.length - 1][1]);
        shape.holes.push(holePath);
        const geometry: ShapeGeometry = new ShapeGeometry(shape);
        const groundMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: 0x00FFFF });
        const ground: Mesh = new Mesh(geometry, groundMaterial);
        ground.rotateX(-Math.PI / 2);
        // ground.position = new Vector3(0, 0 , -1); marche po !! better use ground.translate()
        this._scene.add(ground);
    }

    private async renderGround(): Promise<void> {
        const groundGeometry: PlaneGeometry = new PlaneGeometry(TEMP_GRID_SIZE, TEMP_GRID_SIZE, TEMP_GRID_SIZE, TEMP_GRID_SIZE);
        const groundMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: 0x00FFFF });
        const ground: Mesh = new Mesh(groundGeometry, groundMaterial);
        ground.rotateX(DEG_TO_RAD * TEMP_GRID_ORIENTATION);
        // ground.position = new Vector3(0, 0 , -1); marche po !! better use ground.translate()
        this._scene.add(ground);
    }

    private async renderSkyBox(): Promise<void> {
        let textureSky: Texture;
        if (this._dayTime) {
            textureSky = await this.loadTexture("sky");
        } else {
            textureSky = await this.loadTexture("space");
        }
        const boxbox: BoxGeometry = new BoxGeometry(SKYBOX_SIZE, SKYBOX_SIZE, SKYBOX_SIZE);
        const skyBox: Mesh = new Mesh(boxbox, new MeshLambertMaterial({ map: textureSky, vertexColors: VertexColors, side: BackSide }));
        this._scene.add(skyBox);
    }

    private async loadTexture(textureName: String): Promise<Texture> {
        return new Promise<Texture>((resolve, reject) => {
            const loader: TextureLoader = new TextureLoader();
            loader.load("assets/textures/" + textureName + ".jpg", (object) => {
                resolve(object);
            });
        });
    }
}
