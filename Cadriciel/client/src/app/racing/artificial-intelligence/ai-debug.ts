import { VectorHelper } from "./vectorHelper";
import { Vector3, Group } from "three";
import { RED, GREEN, BLUE, PINK, WHITE } from "../constants/color.constants";

export class AIDebug {
    private readonly AXIS_LENGTH: number = 5;
    private readonly X_AXIS: number = 0;
    private readonly Y_AXIS: number = 1;
    private readonly Z_AXIS: number = 2;

    private _debugGroup: Group;
    private _axis: VectorHelper[];
    private _carVectorHelper: VectorHelper;
    private _distanceVectorHelper: VectorHelper;

    public constructor() {
        this._axis = [];
        this._debugGroup = new Group;
        this.initializeHelpers();
        this.initializeAxis();
    }
    private initializeHelpers(): void {
        this._carVectorHelper = new VectorHelper(PINK);
        this._debugGroup.add(this._carVectorHelper);
        this._distanceVectorHelper = new VectorHelper(WHITE);
        this._debugGroup.add(this._distanceVectorHelper);
    }

    private initializeAxis(): void {
        this._axis.push(new VectorHelper(RED));
        this._axis.push(new VectorHelper(GREEN));
        this._axis.push(new VectorHelper(BLUE));
        for (const axis of this._axis) {
            this._debugGroup.add(axis);
        }
    }

    public updateDebugMode(carPosition: Vector3, projection: Vector3, pointOnLine: Vector3): void {
        this.updateAxis(carPosition);
        this.updateHelpers(carPosition, projection, pointOnLine);
    }

    private updateAxis(carPosition: Vector3): void {
        this._axis[this.X_AXIS].update(carPosition, carPosition.clone().add(new Vector3(this.AXIS_LENGTH, 0, 0)));
        this._axis[this.Y_AXIS].update(carPosition, carPosition.clone().add(new Vector3(0, this.AXIS_LENGTH, 0)));
        this._axis[this.Z_AXIS].update(carPosition, carPosition.clone().add(new Vector3(0, 0, this.AXIS_LENGTH)));
    }

    private updateHelpers(carPosition: Vector3, projection: Vector3, pointOnLine: Vector3): void {
        this._carVectorHelper.update(carPosition, projection);
        this._distanceVectorHelper.update(projection, pointOnLine);
    }

    public get debugGroup(): Group {
        return this._debugGroup;
    }
}
