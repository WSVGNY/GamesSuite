import { VectorHelper } from "./vectorHelper";
import { PINK, WHITE, RED, GREEN, BLUE } from "../constants";
import { Vector3, BoxHelper, Group } from "three";
import { Car } from "../car/car";

export class AIDebug {
    private readonly AXIS_LENGTH: number = 5;
    private readonly X_AXIS: number = 0;
    private readonly Y_AXIS: number = 1;
    private readonly Z_AXIS: number = 2;

    private _debugGroup: Group;
    private _carHelper: BoxHelper;
    private _axis: VectorHelper[] = [];
    private _carVectorHelper: VectorHelper;
    private _distanceVectorHelper: VectorHelper;
    private _turningVectorHelper: VectorHelper;

    public constructor(private _car: Car) {
        this.initializeDebugMode();
    }
    private initializeDebugMode(): void {
        this._debugGroup = new Group;
        this._axis.push(new VectorHelper(RED));
        this._axis.push(new VectorHelper(GREEN));
        this._axis.push(new VectorHelper(BLUE));

        this._carVectorHelper = new VectorHelper(PINK);
        this._distanceVectorHelper = new VectorHelper(WHITE);
        this._turningVectorHelper = new VectorHelper(PINK);
        this._carHelper = new BoxHelper(this._car);

        this._debugGroup.add(this._carHelper);
        for (const axis of this._axis) {
            this._debugGroup.add(axis);
        }
        this._debugGroup.add(this._carVectorHelper);
        this._debugGroup.add(this._distanceVectorHelper);
        this._debugGroup.add(this._turningVectorHelper);
    }

    public updateDebugMode(carPosition: Vector3, projection: Vector3, pointOnLine: Vector3, turningPoint: Vector3, vertice: Vector3): void {
        this._axis[this.X_AXIS].update(carPosition, carPosition.clone().add(new Vector3(this.AXIS_LENGTH, 0, 0)));
        this._axis[this.Y_AXIS].update(carPosition, carPosition.clone().add(new Vector3(0, this.AXIS_LENGTH, 0)));
        this._axis[this.Z_AXIS].update(carPosition, carPosition.clone().add(new Vector3(0, 0, this.AXIS_LENGTH)));
        this._carHelper.update(this._car);
        this._carVectorHelper.update(carPosition, projection);
        this._distanceVectorHelper.update(projection, pointOnLine);
        this._turningVectorHelper.update(new Vector3(vertice.x, 0, vertice.z), turningPoint);
    }

    public get debugGroup(): Group {
        return this._debugGroup;
    }
}
