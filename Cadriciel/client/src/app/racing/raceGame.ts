import { RenderService } from "./render-service/render.service";
import { Car } from "./car/car";
import { CarAiService } from "./artificial-intelligence/car-ai.service";
import { TrackPointList } from "./render-service/trackPoint";
import { MOCK_TRACK } from "./render-service/mock-track";
import { Vector3, PerspectiveCamera } from "three";
import { Difficulty } from "../../../../common/crossword/difficulty";
import { TrackType } from "../../../../common/racing/trackType";
import { ElementRef } from "@angular/core";
import { Track } from "../../../../common/racing/track";
import { SkyBox } from "./skybox";

const AI_CARS_NUMBER: number = 3;
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const INITIAL_CAMERA_POSITION_Z: number = 10;
const INITIAL_CAMERA_POSITION_Y: number = 5;
const PLAYER_CAMERA: string = "PLAYER_CAMERA";

export class RaceGame {
    private _camera: PerspectiveCamera;
    private _playerCar: Car = new Car();
    private _aiCarService: CarAiService[] = [];
    private _aiCars: Car[] = [];
    private _isDay: boolean = true;
    private _trackType: TrackType;
    private _trackPoints: TrackPointList = new TrackPointList(MOCK_TRACK);
    private _lastDate: number;

    public constructor(private renderService: RenderService) { }

    public async initialize(track: Track, containerRef: ElementRef): Promise<void> {
        this._trackType = track.type;
        this._trackPoints = new TrackPointList(MOCK_TRACK);
        this.initializeCamera(containerRef.nativeElement);
        await this.initializePlayerCar();
        await this.initializeAICars();
        this.addObjectsToRenderScene();
        this.setSkyBox(this._trackType);
        await this.renderService.initialize(containerRef.nativeElement, this._camera);
        this.startGameLoop();
    }

    private addObjectsToRenderScene(): void {
        this.renderService.addObjectToScene(this._playerCar);
        this._aiCars.forEach((aiCar: Car) => this.renderService.addObjectToScene(aiCar));
        this.renderService.addObjectToScene(this.renderService.createTrackMesh(this._trackPoints));
    }

    private initializeCamera(containerRef: HTMLDivElement): void {
        this._camera = new PerspectiveCamera(
            FIELD_OF_VIEW,
            containerRef.clientWidth / containerRef.clientHeight,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        this._camera.name = PLAYER_CAMERA;
        this._camera.position.z = INITIAL_CAMERA_POSITION_Z;
        this._camera.position.y = INITIAL_CAMERA_POSITION_Y;
    }

    private async initializePlayerCar(): Promise<void> {
        this._playerCar = new Car();
        await this._playerCar.init(this._trackPoints.first.coordinates, this.findFirstTrackSegmentAngle());
        this._playerCar.attachCamera(this._camera);
    }

    private async initializeAICars(): Promise<void> {
        for (let i: number = 0; i < AI_CARS_NUMBER; ++i) {
            let diff: Difficulty = Difficulty.Hard;
            if (i === 1) {
                diff = Difficulty.Medium;
            } else if (i === 2) {
                diff = Difficulty.Easy;
            }
            this._aiCars.push(new Car());
            this._aiCarService.push(new CarAiService(this._aiCars[i], this._trackPoints.pointVectors, diff));
            await this._aiCars[i].init(this._trackPoints.first.coordinates, this.findFirstTrackSegmentAngle());
        }
    }

    private findFirstTrackSegmentAngle(): number {
        const carfinalFacingVector: Vector3 = this._trackPoints.points[1].coordinates.clone()
            .sub(this._trackPoints.points[0].coordinates)
            .normalize();

        return new Vector3(0, 0, -1).cross(carfinalFacingVector).y > 0 ?
            new Vector3(0, 0, -1).angleTo(carfinalFacingVector) :
            - new Vector3(0, 0, -1).angleTo(carfinalFacingVector);
    }

    private setSkyBox(trackType: TrackType): void {
        this.renderService.loadSkyBox(SkyBox.getPath(trackType));
    }

    public startGameLoop(): void {
        this._lastDate = Date.now();
        this.renderService.setupRenderer();
        this.update();
    }

    private update(): void {
        requestAnimationFrame(() => {
            const timeSinceLastFrame: number = Date.now() - this._lastDate;
            this._lastDate = Date.now();

            this.renderService.render();
            this._playerCar.update(timeSinceLastFrame);
            for (let i: number = 0; i < AI_CARS_NUMBER; ++i) {
                this._aiCars[i].update(timeSinceLastFrame);
                this._aiCarService[i].update();
            }

            this.update();
        });
    }

    public get playerCar(): Car {
        return this._playerCar;
    }

    public set isDay(isDay: boolean) {
        this._isDay = isDay;
        isDay ? this.setSkyBox(TrackType.Default) : this.setSkyBox(TrackType.Night);
    }
}
