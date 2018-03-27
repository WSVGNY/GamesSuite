import { AbstractScene } from "./abstractRacingScene";
import { TrackPoint } from "./../render-service/trackPoint";
import {
    Group, Vector3, Geometry, Line, Camera, LineBasicMaterial
} from "three";
import { TrackType } from "../../../../../common/racing/trackType";
import { TrackLights } from "../render-service/light";
import {
    CHANGE_CAMERA_KEYCODE, YELLOW, DAY_KEYCODE, DEBUG_KEYCODE
} from "../constants";
import { Car } from "../car/car";
import { AIDebug } from "../artificial-intelligence/ai-debug";
import { Wall } from "../render-service/wall";
import { TrackPointList } from "../render-service/trackPointList";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { Track } from "../../../../../common/racing/track";
import { TrackMesh } from "../track-service/track";

const START_POSITION_OFFSET: number = -15;

export class GameScene extends AbstractScene {

    private _trackShape: TrackMesh;
    private _group: Group;
    private _lighting: TrackLights;
    private _centerLine: Group;
    private _debugMode: boolean;
    private _debugElements: Group;
    private _isDay: boolean;

    public constructor(private _keyBoardHandler: KeyboardEventHandlerService) {
        super();
        this._skyBoxTextures = new Map();
        this._group = new Group();
        this._debugElements = new Group();
        this.add(this._group);
    }

    public loadTrack(track: Track): void {
        if (this._trackShape !== undefined) {
            this._group.remove(this._trackShape);
        }
        this._isDay = track.type === TrackType.Default ? true : false;
        this._group.add(this.createWalls(new TrackPointList(track.vertices)));
        this._trackShape = new TrackMesh(track);
        this._group.add(this._trackShape);
        this.addGround();
        this.setSkyBox(track.type);
        this.loadLights(track.type);
        this.setCenterLine();
    }

    public async loadCars(cars: Car[], carDebugs: AIDebug[], camera: Camera, trackType: TrackType): Promise<void> {
        for (let i: number = 0; i < cars.length; ++i) {
            const startPos: Vector3 = new Vector3(
                this._trackShape.trackPoints.first.coordinate.x - i * START_POSITION_OFFSET,
                this._trackShape.trackPoints.first.coordinate.y,
                this._trackShape.trackPoints.first.coordinate.z - i * START_POSITION_OFFSET);

            await cars[i].init(startPos, this.findFirstTrackSegmentAngle());
            this._debugElements.add(carDebugs[i].debugGroup);
            if (!cars[i].isAI) {
                cars[i].attachCamera(camera);
            }
            this._group.add(cars[i]);
        }
        switch (trackType) {
            case TrackType.Night:
                this.setNight(cars);
                break;
            case TrackType.Default:
            default:
                this.setDay(cars);
                break;
        }
    }

    public bindGameSceneKeys(cars: Car[]): void {
        this._keyBoardHandler.bindFunctionToKeyDown(DAY_KEYCODE, () => this.changeTimeOfDay(cars));
        this._keyBoardHandler.bindFunctionToKeyDown(DEBUG_KEYCODE, () => this.changeDebugMode());
    }

    private loadLights(trackType: TrackType): void {
        this._lighting = new TrackLights(trackType);
        this._keyBoardHandler.bindFunctionToKeyDown(CHANGE_CAMERA_KEYCODE, () => this._lighting.changePerspective());
        this._group.add(this._lighting);
    }

    public createWalls(trackPoints: TrackPointList): Group {
        const walls: Group = new Group();
        walls.add(Wall.createInteriorWall(trackPoints));
        walls.add(Wall.createExteriorWall(trackPoints));

        return walls;
    }

    private findFirstTrackSegmentAngle(): number {
        const carfinalFacingVector: Vector3 = this._trackShape.trackPoints.points[1].coordinate.clone()
            .sub(this._trackShape.trackPoints.points[0].coordinate)
            .normalize();

        return new Vector3(0, 0, -1).cross(carfinalFacingVector).y > 0 ?
            new Vector3(0, 0, -1).angleTo(carfinalFacingVector) :
            - new Vector3(0, 0, -1).angleTo(carfinalFacingVector);
    }

    private setCenterLine(): void {
        const material: LineBasicMaterial = new LineBasicMaterial({ color: YELLOW, linewidth: 3 });
        this._centerLine = new Group();

        this._trackShape.trackPoints.points.forEach((currentPoint: TrackPoint) => {
            this._centerLine.add(this.drawLine(material, currentPoint.coordinate, currentPoint.next.coordinate, 2));
        });
    }

    // https://stackoverflow.com/questions/21067461/workaround-for-lack-of-line-width-on-windows-when-using-three-js
    private drawLine(
        lineMaterial: LineBasicMaterial,
        currentPoint: Vector3,
        nextPoint: Vector3,
        thickness: number): Group {
        const dashedLine: Group = new Group();
        const LINE_OFFSET: number = 64;

        for (let i: number = 0; i < thickness * 2; i++) {
            const routerLineGeometry: Geometry = new Geometry();
            const offset: number = i / LINE_OFFSET + i / LINE_OFFSET;

            routerLineGeometry.vertices.push(new Vector3(currentPoint.x + offset, currentPoint.y, currentPoint.z + offset));
            routerLineGeometry.vertices.push(new Vector3(nextPoint.x + offset, nextPoint.y, nextPoint.z + offset));

            dashedLine.add(new Line(routerLineGeometry, lineMaterial));
        }

        for (let i: number = 0; i < thickness * 2; i++) {
            const routerLineGeometry: Geometry = new Geometry();
            const offset: number = i / LINE_OFFSET + i / LINE_OFFSET + i / LINE_OFFSET;

            routerLineGeometry.vertices.push(new Vector3(currentPoint.x + offset, currentPoint.y, currentPoint.z + offset));
            routerLineGeometry.vertices.push(new Vector3(nextPoint.x + offset, nextPoint.y, nextPoint.z + offset));

            dashedLine.add(new Line(routerLineGeometry, lineMaterial));
        }

        return dashedLine;
    }

    public changeTimeOfDay(cars: Car[]): void {
        this._isDay = !this._isDay;
        this._isDay ? this.setDay(cars) : this.setNight(cars);
    }

    private setDay(cars: Car[]): void {
        this.setSkyBox(TrackType.Default);
        this._lighting.updateLightsToTrackType(TrackType.Default);
        cars.forEach((car: Car) => car.turnLightsOff());
    }

    private setNight(cars: Car[]): void {
        this.setSkyBox(TrackType.Night);
        this._lighting.updateLightsToTrackType(TrackType.Night);
        cars.forEach((car: Car) => car.turnLightsOn());
    }

    public changeDebugMode(): void {
        this._debugMode = !this._debugMode;
        this._debugMode ? this.enableDebugMode() : this.disableDebugMode();
    }

    private enableDebugMode(): void {
        this.add(this._debugElements);
        this.add(this._centerLine);
    }

    private disableDebugMode(): void {
        this.remove(this._debugElements);
        this.remove(this._centerLine);
    }

    public get debugMode(): boolean {
        return this._debugMode;
    }
}
