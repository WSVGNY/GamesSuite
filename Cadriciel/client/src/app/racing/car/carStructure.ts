import { Engine } from "./engine";
import { Wheel } from "./wheel";
import { CarLights } from "./carLights";
import { DEFAULT_WHEELBASE, DEFAULT_MASS, DEFAULT_DRAG_COEFFICIENT } from "../constants/car.constants";

export class CarStructure {
    public weightRear: number;
    public lights: CarLights;

    public constructor(
        public engine: Engine = new Engine(),
        public rearWheel: Wheel = new Wheel(),
        public wheelbase: number = DEFAULT_WHEELBASE,
        public mass: number = DEFAULT_MASS,
        public dragCoefficient: number = DEFAULT_DRAG_COEFFICIENT) {
    }
}
