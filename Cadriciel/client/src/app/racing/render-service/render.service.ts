import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import {
    PerspectiveCamera, WebGLRenderer, Scene, AmbientLight, Mesh, PlaneGeometry, Shape,
    MeshBasicMaterial, ShapeGeometry, Path, Vector3, Geometry, LineBasicMaterial, Line, Raycaster,
    TextureLoader, Texture, BoxGeometry, MeshLambertMaterial, VertexColors, BackSide
} from "three";
import { Car } from "../car/car";
import { Track, ITrack } from "../../../../../common/racing/track";
import { TrackService } from "../track-service/track.service";
import { CarAiService } from "../ai/car-ai.service";
import { ActivatedRoute } from "@angular/router";
import { DEG_TO_RAD, TRACK_WIDTH, SQUARED, LOWER_GROUND, PI_OVER_2, SKYBOX_SIZE } from "../constants";
import { MOCK_TRACK } from "./mock-track";

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
const TEMP_GRID_SIZE: number = 1000;
// const SKYBOX_SIZE: number = 1000;
const PLAYER_CAMERA: string = "PLAYER_CAMERA";
const AI_CARS_NUMBER: number = 1;

@Injectable()
export class RenderService {
    /*private tracks: Track[];
    private trackService: TrackService;*/
    // private _dayTime: any;
    private _camera: PerspectiveCamera;
    private _container: HTMLDivElement;
    private _playerCar: Car;
    private _renderer: WebGLRenderer;
    private _scene: Scene;
    private _stats: Stats;
    private _lastDate: number;
    private _carAiService: CarAiService[];
    private _aiCars: Car[];
    private _track: Track;
    private _dayTime: boolean = true;

    private trackCenterPoints: Vector3[] = MOCK_TRACK;
    private trackExteriorPoints: Vector3[] = [];
    private trackInteriorPoints: Vector3[] = [];

    public get playerCar(): Car {
        return this._playerCar;
    }

    public constructor(private trackService: TrackService, private route: ActivatedRoute) {
        this._playerCar = new Car();
        this._playerCar.position.add(new Vector3(this.trackCenterPoints[0].x, 0, this.trackCenterPoints[0].z));
        this.rotateCarToFaceStart(this._playerCar);
        this._carAiService = [];
        this._aiCars = [];
        // this._track = new Track;
        for (let i: number = 0; i < AI_CARS_NUMBER; ++i) {
            this._aiCars.push(new Car());
            this._carAiService.push(new CarAiService(this._aiCars[i], this._track));
            this._aiCars[i].position.add(new Vector3(this.trackCenterPoints[0].x, 0, this.trackCenterPoints[0].z));
            this.rotateCarToFaceStart(this._aiCars[i]);
        }
    }

    private rotateCarToFaceStart(car: Car): void {
        const carfinalFacingVector: Vector3 = new Vector3(
            this.trackCenterPoints[1].x - this.trackCenterPoints[0].x,
            this.trackCenterPoints[1].y - this.trackCenterPoints[0].y,
            this.trackCenterPoints[1].z - this.trackCenterPoints[0].z
        ).normalize();
        const angle: number = carfinalFacingVector.z < 0 ?
            - Math.acos(carfinalFacingVector.x) :
            Math.acos(carfinalFacingVector.x);
        car.rotateY(Math.PI + angle);
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
        this._carAiService[0]._scene = this._scene;
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
        this._carAiService[0].update();
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
        this.renderGround();
        this.renderTrack();
        await this.renderSkyBox();
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
                this._playerCar.accelerate();
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
                this._playerCar.releaseAccelerator();
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

    private renderTrack(): void {
        this.renderTrackShape();
        this.renderCenterLine();
    }

    private renderCenterLine(): void {
        const geometryPoints: Geometry = new Geometry();
        this.trackCenterPoints.forEach((vertex: Vector3) => geometryPoints.vertices.push(vertex));
        geometryPoints.vertices.push(this.trackCenterPoints[0]);
        const line: Line = new Line(geometryPoints, new LineBasicMaterial({ color: 0x00FF00, linewidth: 3 }));
        this._scene.add(line);
    }

    private renderTrackShape(): void {
        this.createExteriorInteriorTrackPoints();
        this.checkInteriorPointsValidity();
        const shape: Shape = new Shape();
        shape.moveTo(
            this.trackExteriorPoints[this.trackExteriorPoints.length - 1].x,
            this.trackExteriorPoints[this.trackExteriorPoints.length - 1].z
        );
        for (let i: number = this.trackExteriorPoints.length - 2; i >= 0; --i) {
            shape.lineTo(this.trackExteriorPoints[i].x, this.trackExteriorPoints[i].z);
        }
        shape.lineTo(this.trackExteriorPoints[0].x, this.trackExteriorPoints[0].z);
        const holePath: Path = new Path();
        holePath.moveTo(
            this.trackInteriorPoints[this.trackInteriorPoints.length - 1].x,
            this.trackInteriorPoints[this.trackInteriorPoints.length - 1].z
        );
        for (let i: number = this.trackInteriorPoints.length - 2; i >= 0; --i) {
            holePath.lineTo(this.trackInteriorPoints[i].x, this.trackInteriorPoints[i].z);
        }
        holePath.lineTo(
            this.trackInteriorPoints[this.trackInteriorPoints.length - 1].x,
            this.trackInteriorPoints[this.trackInteriorPoints.length - 1].z
        );
        shape.holes.push(holePath);
        const geometry: ShapeGeometry = new ShapeGeometry(shape);
        const groundMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: 0x0000FF });
        const ground: Mesh = new Mesh(geometry, groundMaterial);
        ground.rotateX(PI_OVER_2);
        this._scene.add(ground);
    }

    private createExteriorInteriorTrackPoints(): void {
        this.trackCenterPoints.forEach((currentPoint: Vector3, i: number) => {
            const nextPoint: Vector3 = (i + 1) === this.trackCenterPoints.length ?
                this.trackCenterPoints[0] : this.trackCenterPoints[i + 1];
            const previousPoint: Vector3 = i === 0 ?
                this.trackCenterPoints[this.trackCenterPoints.length - 1] : this.trackCenterPoints[i - 1];
            const nextLineLength: number =
                Math.sqrt(Math.pow(nextPoint.x - currentPoint.x, SQUARED) + Math.pow(nextPoint.z - currentPoint.z, SQUARED));
            const previousLineLength: number = Math.sqrt(
                Math.pow(previousPoint.x - currentPoint.x, SQUARED) + Math.pow(previousPoint.z - currentPoint.z, SQUARED)
            );
            this.trackInteriorPoints.push(new Vector3(
                currentPoint.x +
                TRACK_WIDTH * (nextPoint.x - currentPoint.x) / nextLineLength +
                TRACK_WIDTH * (previousPoint.x - currentPoint.x) / previousLineLength,
                0,
                currentPoint.z +
                TRACK_WIDTH * (nextPoint.z - currentPoint.z) / nextLineLength +
                TRACK_WIDTH * (previousPoint.z - currentPoint.z) / previousLineLength
            ));
            this.trackExteriorPoints.push(new Vector3(
                currentPoint.x -
                TRACK_WIDTH * (nextPoint.x - currentPoint.x) / nextLineLength -
                TRACK_WIDTH * (previousPoint.x - currentPoint.x) / previousLineLength,
                0,
                currentPoint.z -
                TRACK_WIDTH * (nextPoint.z - currentPoint.z) / nextLineLength -
                TRACK_WIDTH * (previousPoint.z - currentPoint.z) / previousLineLength
            ));
        });
    }

    private checkInteriorPointsValidity(): void {
        this.trackCenterPoints.forEach((currentPoint: Vector3, i: number) => {
            const previousPoint: Vector3 = i === 0 ?
                this.trackCenterPoints[this.trackCenterPoints.length - 1] :
                this.trackCenterPoints[i - 1];
            const nextPoint: Vector3 = (i + 1) === this.trackCenterPoints.length ?
                this.trackCenterPoints[0] :
                this.trackCenterPoints[i + 1];

            if (this.previousAndNextLineIntersection(currentPoint, previousPoint, nextPoint, i)) {
                const tempPoint: Vector3 = this.trackInteriorPoints[i];
                this.trackInteriorPoints[i] = this.trackExteriorPoints[i];
                this.trackExteriorPoints[i] = tempPoint;
            }
        });
    }

    private previousAndNextLineIntersection(currentPoint: Vector3, previousPoint: Vector3, nextPoint: Vector3, i: number): boolean {
        let geometryPoints: Geometry = new Geometry();
        i === 0 ?
            geometryPoints.vertices.push(this.trackInteriorPoints[this.trackInteriorPoints.length - 1]) :
            geometryPoints.vertices.push(this.trackInteriorPoints[i - 1]);
        geometryPoints.vertices.push(this.trackInteriorPoints[i]);
        const previousLine: Line = new Line(geometryPoints, new LineBasicMaterial());
        const normalizedVectorFromPreviousCenterPoint: Vector3 = new Vector3(
            currentPoint.x - previousPoint.x, currentPoint.y - previousPoint.y, currentPoint.z - previousPoint.z
        ).normalize();
        const raycasterOnPreviousLine: Raycaster = new Raycaster(previousPoint, normalizedVectorFromPreviousCenterPoint);

        geometryPoints = new Geometry();
        i + 1 === this.trackCenterPoints.length ?
            geometryPoints.vertices.push(this.trackInteriorPoints[0]) :
            geometryPoints.vertices.push(this.trackInteriorPoints[i + 1]);
        geometryPoints.vertices.push(this.trackInteriorPoints[i]);
        const nextLine: Line = new Line(geometryPoints, new LineBasicMaterial());
        const normalizedVectorToNextCenterPoint: Vector3 = new Vector3(
            nextPoint.x - currentPoint.x, nextPoint.y - currentPoint.y, nextPoint.z - currentPoint.z
        ).normalize();
        const raycasterOnNextLine: Raycaster = new Raycaster(currentPoint, normalizedVectorToNextCenterPoint);

        if (raycasterOnPreviousLine.intersectObject(previousLine).length !== 0 &&
            raycasterOnNextLine.intersectObject(nextLine).length !== 0) {

            return true;
        }

        return false;
    }

    private async renderGround(): Promise<void> {
        const groundGeometry: PlaneGeometry = new PlaneGeometry(TEMP_GRID_SIZE, TEMP_GRID_SIZE, 1, 1);
        const groundMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: 0x00FFFF });
        const textureGround: Texture = await this.loadTexture("green2");
        const material: MeshLambertMaterial = new MeshLambertMaterial({ map: textureGround, vertexColors: VertexColors });
        const ground: Mesh = new Mesh(groundGeometry, material);
        ground.translateOnAxis(
            this.trackCenterPoints[0],
            Math.sqrt(Math.pow(this.trackCenterPoints[0].x, SQUARED) + Math.pow(this.trackCenterPoints[0].z, SQUARED))
        );
        ground.rotateX(DEG_TO_RAD * TEMP_GRID_ORIENTATION);
        ground.translateZ(LOWER_GROUND);
        this._scene.add(ground);
    }

    private async renderSkyBox(): Promise<void> {
        const textureSky: Texture = this._dayTime ? await this.loadTexture("sky") : await this.loadTexture("space");
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
