import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import {
    PerspectiveCamera, WebGLRenderer, Scene, AmbientLight, Vector3, Line, LineBasicMaterial, Geometry,
    Mesh, SphereGeometry, MeshNormalMaterial
} from "three";
import { Car } from "../car/car";
import { Track, ITrack } from "../../../../../common/racing/track";
import { TrackService } from "../track-service/track.service";
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
    private _carAiService: CarAiService[];
    private _aiCars: Car[];
    private _track: Track;
    private _cube: Mesh;

    private mockTrack: Vector3[] = [
        new Vector3(-488, -275, 0),
        new Vector3(-550, 170, 0),
        new Vector3(96, 342, 0),
        new Vector3(748, 70, 0),
        new Vector3(704, -263, 0)
    ];


    public get playerCar(): Car {
        return this._playerCar;
    }

    public constructor(private trackService: TrackService, private route: ActivatedRoute) {
        this._playerCar = new Car();
        this._playerCar.position.add(new Vector3(this.mockTrack[0].x, 0, this.mockTrack[0].y));
        this._playerCar.rotateY(Math.PI);
        this._carAiService = [];
        this._aiCars = [];
        // this._track = new Track;
        for (let i: number = 0; i < AI_CARS_NUMBER; ++i) {
            this._aiCars.push(new Car());
            this._aiCars[i].position.add(new Vector3(this.mockTrack[0].x, 0, this.mockTrack[0].y));
            this._aiCars[i].rotateY(Math.PI);
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
        this._carAiService[0].update();
        //this._aiCars[0].isAcceleratorPressed = true;
        this._aiCars[0].update(timeSinceLastFrame);
        this._lastDate = Date.now();
        const dir: Vector3 = this._aiCars[0].direction.normalize();
        // tslint:disable-next-line:max-line-length
        const posCubeTemp: Vector3 = new Vector3(this._aiCars[0].position.x - this._aiCars[0].currentPosition.x, 0, this._aiCars[0].position.z - this._aiCars[0].currentPosition.z);
        this._cube.position.x = posCubeTemp.x - dir.x * 5;
        this._cube.position.z = posCubeTemp.z - dir.z * 5;
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

        this._cube = new Mesh( new SphereGeometry( 1, 32, 32 ), new MeshNormalMaterial() );
        this._cube.position.y = 0;
        this._cube.position.x = this._aiCars[0].position.x;
        this._cube.position.z = this._aiCars[0].position.z;
        // this._aiCars[0].attachCube(this._cube);
        this._scene.add( this._cube );

        this._scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        await this.renderTrack();
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

    private async renderTrack(): Promise<void> {
        const geometryPoints: Geometry = new Geometry();
        this.mockTrack.forEach((vertex: Vector3) => geometryPoints.vertices.push(vertex));
        geometryPoints.vertices.push(this.mockTrack[0]);
        let line = new Line(geometryPoints, new LineBasicMaterial({ color: 0x00ffff, linewidth: 3 }));
        line.rotateX(Math.PI / 2);
        this._scene.add(line);
    }
}
