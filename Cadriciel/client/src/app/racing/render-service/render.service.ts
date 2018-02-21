import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import {
    PerspectiveCamera, WebGLRenderer, Scene, AmbientLight, Mesh, Shape,
    MeshBasicMaterial, ShapeGeometry, Path, Vector3, Geometry, LineBasicMaterial, Line,
    BackSide,
    TextureLoader,
    Texture,
    RepeatWrapping,
    PlaneGeometry,
    CubeTextureLoader
} from "three";
import { CarAiService } from "../artificial-intelligence/car-ai.service";
import { Car } from "../car/car";
import { PI_OVER_2, LOWER_GROUND } from "../constants";
import { MOCK_TRACK } from "./mock-track";
import { TrackPoint, TrackPointList } from "./trackPoint";
import { Difficulty } from "../../../../../common/crossword/difficulty";

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
// const TEMP_GRID_ORIENTATION: number = 90;
// const TEMP_GRID_SIZE: number = 1000;
// const SKYBOX_SIZE: number = 1000;
const PLAYER_CAMERA: string = "PLAYER_CAMERA";
const AI_CARS_NUMBER: number = 3;

@Injectable()
export class RenderService {
    private _camera: PerspectiveCamera;
    private _container: HTMLDivElement;
    private _playerCar: Car;
    private _renderer: WebGLRenderer;
    private _scene: Scene;
    private _stats: Stats;
    private _lastDate: number;
    private _carAiService: CarAiService[];
    private _aiCars: Car[];
    // private _dayTime: boolean = true;
    private _trackPoints: TrackPointList;

    public get playerCar(): Car {
        return this._playerCar;
    }

    public constructor() {
        this._trackPoints = new TrackPointList(MOCK_TRACK);
        this._playerCar = new Car();
        this._scene = new Scene();
        this._carAiService = [];
        this._aiCars = [];

        const points: Vector3[] = new Array();

        this._trackPoints.points.forEach((currentPoint: TrackPoint) => {
            points.push(new Vector3(
                currentPoint.coordinates.x,
                currentPoint.coordinates.y,
                currentPoint.coordinates.z,
            ));
        });

        for (let i: number = 0; i < AI_CARS_NUMBER; ++i) {
            this._aiCars.push(new Car());
            let diff: Difficulty = Difficulty.Hard;
            if (i === 1 ) {
                diff = Difficulty.Medium;
            } else if (i === 2) {
                diff = Difficulty.Easy;
            }
            this._carAiService.push(new CarAiService(this._aiCars[i], points, this._scene, diff));
        }
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this._container = container;
        }

        await this.createScene();
        this.initializeCarsPositions();
        this._carAiService[0]._scene = this._scene;
        this.initStats();
        this.startRenderingLoop();
    }

    private initializeCarsPositions(): void {
        this._playerCar.position.add(new Vector3(
            this._trackPoints.points[0].coordinates.x, 0,
            this._trackPoints.points[0].coordinates.z)
        );
        this.rotateCarToFaceStart(this._playerCar);

        // this._playerCar.position.add(new Vector3(0, 0, 900));
        // this._playerCar.rotateY(-PI_OVER_2);

        for (let i: number = 0; i < AI_CARS_NUMBER; ++i) {
            this._aiCars[i].position.add(new Vector3(
                this._trackPoints.points[0].coordinates.x + i, 0,
                this._trackPoints.points[0].coordinates.z
            ));
            this.rotateCarToFaceStart(this._aiCars[i]);
        }
    }

    private rotateCarToFaceStart(car: Car): void {
        // const carfinalFacingVector: Vector3 = new Vector3(
        //     this._trackPoints.points[1].coordinates.x - this._trackPoints.points[0].coordinates.x,
        //     this._trackPoints.points[1].coordinates.y - this._trackPoints.points[0].coordinates.y,
        //     this._trackPoints.points[1].coordinates.z - this._trackPoints.points[0].coordinates.z
        // ).normalize();
        // const angle: number = carfinalFacingVector.z < 0 ?
        //     Math.acos(carfinalFacingVector.x) :
        //     - Math.acos(carfinalFacingVector.x);
        // car.rotateY(Math.PI + angle);
    }

    private initStats(): void {
        this._stats = new Stats();
        this._stats.dom.style.position = "absolute";
        this._container.appendChild(this._stats.dom);
    }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this._lastDate;
        this._playerCar.update(timeSinceLastFrame);
        for (let i: number = 0; i < AI_CARS_NUMBER; ++i) {
            this._aiCars[i].update(timeSinceLastFrame);
            this._carAiService[i].update();
        }
        this._lastDate = Date.now();
    }

    private async createScene(): Promise<void> {
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
        this.renderTrack();
        this.renderGround();
        this.renderSkyBox();
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
        // this._stats.update();
    }

    public onResize(): void {
        this._camera.aspect = this.getAspectRatio();
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(this._container.clientWidth, this._container.clientHeight);
    }

    public handleKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._playerCar.accelerate();
                break;
            case LEFT_KEYCODE:
                this._playerCar.steerLeft();
                break;
            case RIGHT_KEYCODE:
                this._playerCar.steerRight();
                break;
            case BRAKE_KEYCODE:
                this._playerCar.reverse();
                break;
            default:
                break;
        }
    }

    public handleKeyUp(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._playerCar.releaseAccelerator();
                break;
            case LEFT_KEYCODE:
            case RIGHT_KEYCODE:
                this._playerCar.releaseSteering();
                break;
            case BRAKE_KEYCODE:
                this._playerCar.releaseReverse();
                break;
            default:
                break;
        }
    }

    private renderTrack(): void {
        this._trackPoints = new TrackPointList(MOCK_TRACK);
        this.renderTrackShape();
        this.renderCenterLine();
    }

    private renderTrackShape(): void {
        const shape: Shape = new Shape();
        const lastPoint: TrackPoint = this._trackPoints.points[this._trackPoints.length - 1];
        shape.moveTo(lastPoint.exterior.x, lastPoint.exterior.z);
        for (let i: number = this._trackPoints.length - 2; i >= 0; --i) {
            shape.lineTo(this._trackPoints.points[i].exterior.x, this._trackPoints.points[i].exterior.z);
        }
        shape.lineTo(lastPoint.exterior.x, lastPoint.exterior.z);

        const holePath: Path = new Path();
        holePath.moveTo(lastPoint.interior.x, lastPoint.interior.z);
        for (let i: number = this._trackPoints.length - 2; i >= 0; --i) {
            holePath.lineTo(this._trackPoints.points[i].interior.x, this._trackPoints.points[i].interior.z);
        }
        holePath.lineTo(lastPoint.interior.x, lastPoint.interior.z);

        shape.holes.push(holePath);
        const geometry: ShapeGeometry = new ShapeGeometry(shape);

        const texture: Texture = new TextureLoader().load("assets/textures/asphalte.jpg");
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(0.045, 0.045);
        const groundMaterial: MeshBasicMaterial = new MeshBasicMaterial({ side: BackSide, map: texture });

        const ground: Mesh = new Mesh(geometry, groundMaterial);
        ground.rotateX(PI_OVER_2);
        this._scene.add(ground);
    }

    private renderCenterLine(): void {
        const geometryPoints: Geometry = new Geometry();
        this._trackPoints.points.forEach((currentPoint: TrackPoint) => geometryPoints.vertices.push(currentPoint.coordinates));
        geometryPoints.vertices.push(this._trackPoints.points[0].coordinates);
        const line: Line = new Line(geometryPoints, new LineBasicMaterial({ color: 0x00FF00, linewidth: 3 }));
        // line.position.add(new Vector3(0, 125, 0));
        // line.rotateX(-PI_OVER_2);
        this._scene.add(line);
    }

    private async renderGround(): Promise<void> {
        const groundGeometry: PlaneGeometry = new PlaneGeometry(10000, 10000, 1, 1);

        const texture: Texture = new TextureLoader().load("assets/textures/green-grass-texture.jpg");
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(1000, 1000);
        const groundMaterial: MeshBasicMaterial = new MeshBasicMaterial({ side: BackSide, map: texture });

        const ground: Mesh = new Mesh(groundGeometry, groundMaterial);
        ground.rotateX(PI_OVER_2);
        ground.translateZ(LOWER_GROUND);
        this._scene.add(ground);
    }

    private async renderSkyBox(): Promise<void> {
        this._scene.background = new CubeTextureLoader()
            // .setPath("assets/textures/clouds/")
            // .load([
            //     "CloudyLightRays_px.jpg", // 'px.png',
            //     "CloudyLightRays_nx.jpg", // 'nx.png',
            //     "CloudyLightRays_py.jpg", // 'py.png',
            //     "CloudyLightRays_ny.jpg", // 'ny.png',
            //     "CloudyLightRays_pz.jpg", // 'pz.png',
            //     "CloudyLightRays_nz.jpg"// 'nz.png'
            // ]);
            .setPath("assets/textures/Tropical/")
            .load([
                "TropicalSunnyDay_px.jpg", // 'px.png',
                "TropicalSunnyDay_nx.jpg", // 'nx.png',
                "TropicalSunnyDay_py.jpg", // 'py.png',
                "TropicalSunnyDay_ny.jpg", // 'ny.png',
                "TropicalSunnyDay_pz.jpg", // 'pz.png',
                "TropicalSunnyDay_nz.jpg"// 'nz.png'
            ]);
    }
}
