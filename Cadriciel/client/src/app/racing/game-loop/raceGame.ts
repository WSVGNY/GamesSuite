import { RenderService } from "./../render-service/render.service";
import { Car } from "./../car/car";
import { AICarService } from "./../artificial-intelligence/ai-car.service";
import { TrackPointList, TrackPoint } from "./../render-service/trackPoint";
import { MOCK_TRACK } from "./../render-service/mock-track";
import { Vector3, PerspectiveCamera, Group, LineBasicMaterial, Line, Geometry } from "three";
import { Difficulty } from "../../../../../common/crossword/difficulty";
import { TrackType } from "../../../../../common/racing/trackType";
import { ElementRef } from "@angular/core";
import { TrackStructure } from "../../../../../common/racing/track";
import { RaceGameConfig } from "./raceGameConfig";
import { SkyBox } from "../render-service/skybox";
import { TrackLights } from "../render-service/light";

export class RaceGame {
    private _camera: PerspectiveCamera;
    private _playerCar: Car = new Car();
    private _aiCarService: AICarService[] = [];
    private _aiCars: Car[] = [];
    private _aiCarsDebug: Group = new Group();
    private _trackType: TrackType;
    private _trackPoints: TrackPointList = new TrackPointList(MOCK_TRACK);
    private _lastDate: number;
    private _debug: boolean;
    private _centerLine: Line;
    private _lighting: TrackLights;

    public constructor(private renderService: RenderService) { }

    public async initialize(track: TrackStructure, containerRef: ElementRef): Promise<void> {
        this._trackType = track.type;
        this._trackPoints = new TrackPointList(track.vertices);
        this.initializeCamera(containerRef.nativeElement);
        await this.initializePlayerCar();
        await this.initializeAICars();
        this.initializeLights(this._trackType);
        this.setCenterLine();
        this.addObjectsToRenderScene();
        this.setSkyBox(this._trackType);
        await this.renderService.initialize(containerRef.nativeElement, this._camera);
        this.startGameLoop();
    }

    private addObjectsToRenderScene(): void {
        this.renderService.addObjectToScene(this._playerCar);
        this._aiCars.forEach((aiCar: Car) => this.renderService.addObjectToScene(aiCar));
        this.renderService.addObjectToScene(this.renderService.createTrackMesh(this._trackPoints));
        this.renderService.addObjectToScene(this._lighting);
    }

    private initializeCamera(containerRef: HTMLDivElement): void {
        this._camera = new PerspectiveCamera(
            RaceGameConfig.FIELD_OF_VIEW,
            containerRef.clientWidth / containerRef.clientHeight,
            RaceGameConfig.NEAR_CLIPPING_PLANE,
            RaceGameConfig.FAR_CLIPPING_PLANE
        );

        this._camera.name = RaceGameConfig.PLAYER_CAMERA;
        this._camera.position.z = RaceGameConfig.INITIAL_CAMERA_POSITION_Z;
        this._camera.position.y = RaceGameConfig.INITIAL_CAMERA_POSITION_Y;
    }

    private async initializePlayerCar(): Promise<void> {
        this._playerCar = new Car();
        const startPos: Vector3 = new Vector3(
            this._trackPoints.first.coordinates.x + RaceGameConfig.START_POSITION_OFFSET,
            this._trackPoints.first.coordinates.y,
            this._trackPoints.first.coordinates.z + RaceGameConfig.START_POSITION_OFFSET);
        await this._playerCar.init(startPos, this.findFirstTrackSegmentAngle());
        this._playerCar.attachCamera(this._camera);
    }

    private async initializeAICars(): Promise<void> {
        for (let i: number = 0; i < RaceGameConfig.AI_CARS_NUMBER; ++i) {
            this._aiCars.push(new Car());

            const startPos: Vector3 = new Vector3(
                this._trackPoints.first.coordinates.x - i * RaceGameConfig.START_POSITION_OFFSET,
                this._trackPoints.first.coordinates.y,
                this._trackPoints.first.coordinates.z - i * RaceGameConfig.START_POSITION_OFFSET);

            await this._aiCars[i].init(startPos, this.findFirstTrackSegmentAngle());
            this._aiCarService.push(new AICarService(
                this._aiCars[i],
                this._trackPoints.pointVectors,
                this.isPair(i) ? Difficulty.Hard : Difficulty.Easy));
            this._aiCarsDebug.add(this._aiCarService[i].debugGroup);
        }
    }

    private isPair(num: number): boolean {
        // tslint:disable-next-line:no-magic-numbers
        return num % 2 === 0;
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

    private initializeLights(trackType: TrackType): void {
        this._lighting = new TrackLights(trackType);
    }

    private setLights(trackType: TrackType): void {
        this._lighting.updateLightsToTrackType(trackType);
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
            for (let i: number = 0; i < RaceGameConfig.AI_CARS_NUMBER; ++i) {
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
        if (isDay) {
            this.setSkyBox(this._trackType);
            this.setLights(this._trackType);
            this._playerCar.dettachLights();
        } else {
            this.setSkyBox(TrackType.Night);
            this.setLights(TrackType.Night);
            this._playerCar.attachLights();
        }
    }

    public get debug(): boolean {
        return this._debug;
    }

    public set debug(debug: boolean) {
        this._debug = debug;
        if (debug) {
            this.renderService.addDebugObject(this._aiCarsDebug);
            this.renderService.addDebugObject(this._centerLine);
        } else {
            this.renderService.removeDebugObject(this._aiCarsDebug);
            this.renderService.removeDebugObject(this._centerLine);
        }
    }

    private setCenterLine(): void {
        const geometryPoints: Geometry = new Geometry();
        this._trackPoints.points.forEach((currentPoint: TrackPoint) => geometryPoints.vertices.push(currentPoint.coordinates));
        geometryPoints.vertices.push(this._trackPoints.points[0].coordinates);

        this._centerLine = new Line(geometryPoints, new LineBasicMaterial({ color: 0x00FF00, linewidth: 3 }));
    }
}
