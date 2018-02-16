import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import {
    PerspectiveCamera, WebGLRenderer, Scene, AmbientLight, /*Matrix4,*/
    Mesh, MeshBasicMaterial, Shape, ShapeGeometry, Path
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
        await this.renderGround();
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

    private async renderGround(): Promise<void> {
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
}
