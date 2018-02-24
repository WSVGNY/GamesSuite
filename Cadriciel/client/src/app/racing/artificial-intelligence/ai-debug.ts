import { VectorHelper } from "./vectorHelper";
import { PINK, WHITE, RED, GREEN, BLUE } from "../constants";
import { Vector3, BoxHelper, Group } from "three";
import { Car } from "../car/car";

export class AIDebug {
    private readonly AXIS_LENGTH: number = 5;

    private _debugGroup: Group;
    private _carHelper: BoxHelper;
    private _axisX: VectorHelper;
    private _axisY: VectorHelper;
    private _axisZ: VectorHelper;
    private _carVectorHelper: VectorHelper;
    private _distanceVectorHelper: VectorHelper;
    private _turningVectorHelper: VectorHelper;

    public constructor(private _car: Car) {
        this.initializeDebugMode();
    }
    private initializeDebugMode(): void {
        this._debugGroup = new Group;
        this._axisX = new VectorHelper(RED);
        this._axisY = new VectorHelper(GREEN);
        this._axisZ = new VectorHelper(BLUE);

        this._carVectorHelper = new VectorHelper(PINK);
        this._distanceVectorHelper = new VectorHelper(WHITE);
        this._turningVectorHelper = new VectorHelper(PINK);
        this._carHelper = new BoxHelper(this._car);

        this._debugGroup.add(this._carHelper);
        this._debugGroup.add(this._axisX);
        this._debugGroup.add(this._axisY);
        this._debugGroup.add(this._axisZ);
        this._debugGroup.add(this._carVectorHelper);
        this._debugGroup.add(this._distanceVectorHelper);
        this._debugGroup.add(this._turningVectorHelper);
    }

    public updateDebugMode(carPosition: Vector3, projection: Vector3, pointOnLine: Vector3, turningPoint: Vector3, vertice: Vector3): void {
        this._axisX.update(carPosition, carPosition.clone().add(new Vector3(this.AXIS_LENGTH, 0, 0)));
        this._axisY.update(carPosition, carPosition.clone().add(new Vector3(0, this.AXIS_LENGTH, 0)));
        this._axisZ.update(carPosition, carPosition.clone().add(new Vector3(0, 0, this.AXIS_LENGTH)));
        this._carHelper.update(this._car);
        this._carVectorHelper.update(carPosition, projection);
        this._distanceVectorHelper.update(projection, pointOnLine);
        this._turningVectorHelper.update( new Vector3( vertice.x, 0, vertice.z), turningPoint);
    }

    public get debugGroup(): Group {
        return this._debugGroup;
    }
}
