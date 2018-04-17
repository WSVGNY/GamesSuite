import { AbstractScene } from "./abstractRacingScene";
import { Group, Vector3, Geometry, Line, Camera, LineBasicMaterial, } from "three";
import { TrackType } from "../../../../../common/racing/trackType";
import { TrackLights } from "../render-service/light";
import { AbstractCar } from "../car/abstractCar";
import { AIDebug } from "../artificial-intelligence/ai-debug";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { Track } from "../../../../../common/racing/track";
import { TrackMesh } from "../track/track";
import { TrackPoint } from "../track/trackPoint";
import { START_CAR_DISTANCE } from "../constants/scene.constants";
import { DAY_KEYCODE, DEBUG_KEYCODE, CHANGE_CAMERA_KEYCODE } from "../constants/keycode.constants";
import { YELLOW } from "../constants/color.constants";
import { HumanCar } from "../car/humanCar";

const LATHERAL_OFFSET: number = 2;
const VERTICAL_OFFSET: number = 5;

export class GameScene extends AbstractScene {

    private _trackMesh: TrackMesh;
    private _lighting: TrackLights;
    private _centerLine: Group;
    private _debugMode: boolean;
    private _debugElements: Group;
    private _isDay: boolean;

    public constructor(private _keyBoardHandler: KeyboardEventHandlerService) {
        super();
        this._skyBoxTextures = new Map();
        this._debugElements = new Group();
    }

    public loadTrack(track: Track): void {
        if (this._trackMesh !== undefined) {
            this.remove(this._trackMesh);
        }
        this._isDay = track.type === TrackType.Default ? true : false;
        this._trackMesh = new TrackMesh(track);
        this.add(this._trackMesh);
        this.addGround();
        this.setSkyBox(track.type);
        this.loadLights(track.type);
        this.setCenterLine();
    }

    public async loadCars(cars: AbstractCar[], camera: Camera, trackType: TrackType): Promise<AIDebug[]> {
        this.shuffle(cars);
        const aiCarsDebugs: AIDebug[] = [];
        for (let i: number = 0; i < cars.length; ++i) {
            await this.placeCarOnStartingGrid(cars[i], i);
            if (cars[i] instanceof HumanCar) {
                cars[i].attachCamera(camera);
            } else {
                this._debugElements.add(new AIDebug().debugGroup);
                aiCarsDebugs.push(new AIDebug);
            }
            this.add(cars[i]);
        }
        this.setTimeOfDay(cars, trackType);

        return aiCarsDebugs;
    }

    private shuffle(array: AbstractCar[]): void {
        for (let i: number = array.length - 1; i > 0; i--) {
            const j: number = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    private async placeCarOnStartingGrid(car: AbstractCar, index: number): Promise<void> {
        await car.init(this.computeCarPosition(this.computeCarOffset(index)), this.findFirstTrackSegmentAngle());
    }

    private computeCarOffset(index: number): Vector3 {
        const offset: Vector3 = new Vector3(0, 0, 0);
        offset.x = (index < 2) ? -LATHERAL_OFFSET : LATHERAL_OFFSET;
        offset.z = (index % 2 === 0) ? -VERTICAL_OFFSET : VERTICAL_OFFSET;

        return offset.applyAxisAngle(new Vector3(0, 1, 0), this.findFirstTrackSegmentAngle());
    }

    private computeCarPosition(offset: Vector3): Vector3 {
        const startingVector: Vector3 = this._trackMesh.trackPoints.toTrackPoints[1].coordinate.clone().
            sub(this._trackMesh.trackPoints.toTrackPoints[0].coordinate.clone());
        const startingLenght: number = startingVector.length() / 2 - START_CAR_DISTANCE;
        startingVector.normalize();
        const position: Vector3 = this._trackMesh.trackPoints.toTrackPoints[0].coordinate.clone().
            add(startingVector.clone().multiplyScalar(startingLenght));

        return position.add(offset);
    }

    private setTimeOfDay(cars: AbstractCar[], trackType: TrackType): void {
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

    public bindGameSceneKeys(cars: AbstractCar[]): void {
        this._keyBoardHandler.bindFunctionToKeyDown(DAY_KEYCODE, () => this.changeTimeOfDay(cars));
        this._keyBoardHandler.bindFunctionToKeyDown(DEBUG_KEYCODE, () => this.changeDebugMode());
    }

    private loadLights(trackType: TrackType): void {
        this._lighting = new TrackLights(trackType);
        this._keyBoardHandler.bindFunctionToKeyDown(CHANGE_CAMERA_KEYCODE, () => this._lighting.changePerspective());
        this.add(this._lighting);
    }

    private findFirstTrackSegmentAngle(): number {
        const carfinalFacingVector: Vector3 = this._trackMesh.trackPoints.toTrackPoints[1].coordinate.clone()
            .sub(this._trackMesh.trackPoints.toTrackPoints[0].coordinate)
            .normalize();

        return new Vector3(0, 0, -1).cross(carfinalFacingVector).y > 0 ?
            new Vector3(0, 0, -1).angleTo(carfinalFacingVector) :
            -new Vector3(0, 0, -1).angleTo(carfinalFacingVector);
    }

    private setCenterLine(): void {
        const material: LineBasicMaterial = new LineBasicMaterial({ color: YELLOW, linewidth: 3 });
        this._centerLine = new Group();

        this._trackMesh.trackPoints.toTrackPoints.forEach((currentPoint: TrackPoint) => {
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
            const offset: number = i / LINE_OFFSET + i / LINE_OFFSET + i / LINE_OFFSET;

            routerLineGeometry.vertices.push(new Vector3(currentPoint.x + offset, currentPoint.y, currentPoint.z + offset));
            routerLineGeometry.vertices.push(new Vector3(nextPoint.x + offset, nextPoint.y, nextPoint.z + offset));

            dashedLine.add(new Line(routerLineGeometry, lineMaterial));
        }

        return dashedLine;
    }

    public changeTimeOfDay(cars: AbstractCar[]): void {
        this._isDay = !this._isDay;
        this._isDay ? this.setDay(cars) : this.setNight(cars);
    }

    private setDay(cars: AbstractCar[]): void {
        this.setSkyBox(TrackType.Default);
        this._lighting.updateLightsToTrackType(TrackType.Default);
        cars.forEach((car: AbstractCar) => car.turnLightsOff());
    }

    private setNight(cars: AbstractCar[]): void {
        this.setSkyBox(TrackType.Night);
        this._lighting.updateLightsToTrackType(TrackType.Night);
        cars.forEach((car: AbstractCar) => car.turnLightsOn());
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

    public get trackMesh(): TrackMesh {
        return this._trackMesh;
    }
}
