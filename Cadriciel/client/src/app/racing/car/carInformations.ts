import { Vector3, Object3D } from "three";
import { Engine } from "./engine";
import { Wheel } from "./wheel";
import { CarLights } from "./carLights";
import { CarConfig } from "./carConfig";

export class CarStructure {
    public weightRear: number;
    public lights: CarLights;

    public constructor(
        public engine: Engine = new Engine(),
        public rearWheel: Wheel = new Wheel(),
        public wheelbase: number = CarConfig.DEFAULT_WHEELBASE,
        public mass: number = CarConfig.DEFAULT_MASS,
        public dragCoefficient: number = CarConfig.DEFAULT_DRAG_COEFFICIENT) {
    }
}

export class CarControls {
    public isAcceleratorPressed: boolean;
    public speed: Vector3;
    public isBraking: boolean;
    public isReversing: boolean;
    public steeringWheelDirection: number;
    public initialDirection: Vector3 = new Vector3(0, 0, -1);
}