import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import {
    PerspectiveCamera, WebGLRenderer, Scene, Mesh, Shape,
    ShapeGeometry, Path, Vector3,
    BackSide,
    TextureLoader,
    Texture,
    RepeatWrapping,
    PlaneGeometry,
    CubeTextureLoader,
    MeshLambertMaterial,
    DirectionalLight,
    DirectionalLightHelper,
    AmbientLight
} from "three";
import { CarAiService } from "../artificial-intelligence/car-ai.service";
import { Car } from "../car/car";
import { PI_OVER_2, LOWER_GROUND, WHITE } from "../constants";
import { MOCK_TRACK } from "./mock-track";
import { TrackPoint, TrackPointList } from "./trackPoint";
import { Difficulty } from "../../../../../common/crossword/difficulty";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const INITIAL_CAMERA_POSITION_Z: number = 10;
const INITIAL_CAMERA_POSITION_Y: number = 5;
const AMBIENT_LIGHT_OPACITY: number = 0.2;
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
    private _carAiService: CarAiService[] = [];
    private _aiCars: Car[] = [];
    // private _dayTime: boolean = true;
    private _trackPoints: TrackPointList;

    public get playerCar(): Car {
        return this._playerCar;
    }

    public constructor() {
        this._trackPoints = new TrackPointList(MOCK_TRACK);
        this._scene = new Scene();
        this._playerCar = new Car();

        for (let i: number = 0; i < AI_CARS_NUMBER; ++i) {
            // this._aiCars.push(new Car());
        }
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this._container = container;
        }

        await this.createScene();
        this.initializeCars();
        this.initStats();
        this.startRenderingLoop();
    }

    private initializeCars(): void {
        this._playerCar.position.add(new Vector3(
            this._trackPoints.points[0].coordinates.x, 0,
            this._trackPoints.points[0].coordinates.z)
        );
        this.rotateCarToFaceStart(this._playerCar);
        const points: Vector3[] = new Array(this._trackPoints.length);
        this._trackPoints.points.forEach((currentPoint: TrackPoint, i: number) => {
            points[i] = new Vector3(
                currentPoint.coordinates.x,
                currentPoint.coordinates.y,
                currentPoint.coordinates.z,
            );
        });
        for (let i: number = 0; i < AI_CARS_NUMBER; ++i) {
            let diff: Difficulty = Difficulty.Hard;
            if (i === 1) {
                diff = Difficulty.Medium;
            } else if (i === 2) {
                diff = Difficulty.Easy;
            }
            // this._carAiService.push(new CarAiService(this._aiCars[i], points, this._scene, diff));
            this._carAiService.push(new CarAiService(this._playerCar, points, this._scene, Difficulty.Hard));
            // this._aiCars[i].position.add(new Vector3(
            //     this._trackPoints.points[0].coordinates.x + i, 0,
            //     this._trackPoints.points[0].coordinates.z
            // ));
            // this.rotateCarToFaceStart(this._aiCars[i]);
        }
    }

    private rotateCarToFaceStart(car: Car): void {
        const carfinalFacingVector: Vector3 = new Vector3(
            this._trackPoints.points[1].coordinates.x - this._trackPoints.points[0].coordinates.x,
            this._trackPoints.points[1].coordinates.y - this._trackPoints.points[0].coordinates.y,
            this._trackPoints.points[1].coordinates.z - this._trackPoints.points[0].coordinates.z
        ).normalize();
        const angle: number = new Vector3(-1, 0, 0).cross(carfinalFacingVector).y > 0 ?
            new Vector3(-1, 0, 0).angleTo(carfinalFacingVector) :
            - new Vector3(-1, 0, 0).angleTo(carfinalFacingVector);
        car.rotate(new Vector3(0, 1, 0), angle);
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
            // this._aiCars[i].update(timeSinceLastFrame);
            this._carAiService[i].update();
        }
        this._lastDate = Date.now();
    }

    private async createScene(): Promise<void> {
        await this._playerCar.init();
        this._scene.add(this._playerCar);
        // for (const car of this._aiCars) {
        //     await car.init();
        //     this._scene.add(car);
        // }

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

        this.lighting();
        this.renderTrack();
        this.renderGround();
        this.renderSkyBox();
    }

    public lighting(): void {

        this._scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        const dirLight: DirectionalLight = new DirectionalLight(0xffffff, 0.8);
        dirLight.color.setHSL(0.1, 1, 0.95);
        dirLight.position.set(-1, 0.8, 1);
        dirLight.position.multiplyScalar(30);
        this._scene.add(dirLight);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        const d: number = 50;
        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;
        dirLight.shadow.camera.far = 3500;
        dirLight.shadow.bias = -0.0001;
        const dirLightHeper: DirectionalLightHelper = new DirectionalLightHelper(dirLight, 10)
        this._scene.add(dirLightHeper);
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

    private renderTrack(): void {
        this._trackPoints = new TrackPointList(MOCK_TRACK);
        this.renderTrackShape();
        // this.renderCenterLine();
    }

    private renderTrackShape(): void {
        const shape: Shape = new Shape();
        const firstPoint: TrackPoint = this._trackPoints.points[0];
        shape.moveTo(firstPoint.exterior.x, firstPoint.exterior.z);
        for (let i: number = 1; i < this._trackPoints.length; ++i) {
            shape.lineTo(this._trackPoints.points[i].exterior.x, this._trackPoints.points[i].exterior.z);
        }
        shape.lineTo(firstPoint.exterior.x, firstPoint.exterior.z);

        const holePath: Path = new Path();
        holePath.moveTo(firstPoint.interior.x, firstPoint.interior.z);
        for (let i: number = this._trackPoints.length - 1; i > 0; --i) {
            holePath.lineTo(this._trackPoints.points[i].interior.x, this._trackPoints.points[i].interior.z);
        }
        holePath.lineTo(firstPoint.interior.x, firstPoint.interior.z);

        shape.holes.push(holePath);
        const geometry: ShapeGeometry = new ShapeGeometry(shape);

        const texture: Texture = new TextureLoader().load("assets/textures/asphalte.jpg");
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(0.045, 0.045);
        const groundMaterial: MeshLambertMaterial = new MeshLambertMaterial({ side: BackSide, map: texture });

        const ground: Mesh = new Mesh(geometry, groundMaterial);
        ground.rotateX(PI_OVER_2);
        this._scene.add(ground);
    }

    // private renderCenterLine(): void {
    //     const geometryPoints: Geometry = new Geometry();
    //     this._trackPoints.points.forEach((currentPoint: TrackPoint) => geometryPoints.vertices.push(currentPoint.coordinates));
    //     geometryPoints.vertices.push(this._trackPoints.points[0].coordinates);
    //     const line: Line = new Line(geometryPoints, new LineBasicMaterial({ color: 0x00FF00, linewidth: 3 }));
    //     this._scene.add(line);
    // }

    private async renderGround(): Promise<void> {
        const groundGeometry: PlaneGeometry = new PlaneGeometry(10000, 10000, 1, 1);

        const texture: Texture = new TextureLoader().load("assets/textures/green-grass-texture.jpg");
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(1000, 1000);
        const groundMaterial: MeshLambertMaterial = new MeshLambertMaterial({ side: BackSide, map: texture });

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
            // .setPath("assets/textures/Tropical/")
            // .load([
            //     "TropicalSunnyDay_px.jpg", // 'px.png',
            //     "TropicalSunnyDay_nx.jpg", // 'nx.png',
            //     "TropicalSunnyDay_py.jpg", // 'py.png',
            //     "TropicalSunnyDay_ny.jpg", // 'ny.png',
            //     "TropicalSunnyDay_pz.jpg", // 'pz.png',
            //     "TropicalSunnyDay_nz.jpg"// 'nz.png'
            // ]);

            .setPath("assets/textures/night/")
            .load([
                "night_px.jpg", // 'px.png',
                "night_nx.jpg", // 'nx.png',
                "night_py.jpg", // 'py.png',
                "night_ny.jpg", // 'ny.png',
                "night_pz.jpg", // 'pz.png',
                "night_nz.jpg"// 'nz.png'
            ]);
    }
}
