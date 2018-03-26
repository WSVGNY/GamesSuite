import { Vector3 } from "three";

export class CarControls {
    public isAcceleratorPressed: boolean;
    public speed: Vector3;
    public isBraking: boolean;
    public isReversing: boolean;
    public steeringWheelDirection: number;
    public initialDirection: Vector3 = new Vector3(0, 0, -1);
}
