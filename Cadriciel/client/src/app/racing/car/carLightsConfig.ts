import { DEG_TO_RAD } from "../constants";

export class CarLightConfig {
    public static readonly FRONT_LEFT_INDEX: number = 0;
    public static readonly FRONT_RIGHT_INDEX: number = 1;
    public static readonly BACK_LEFT_INDEX: number = 2;
    public static readonly BACK_RIGHT_INDEX: number = 3;

    public static readonly POSITION_Y: number = -0.4;
    public static readonly POSITION_RIGHT: number = 0.5;
    public static readonly POSITION_LEFT: number = -CarLightConfig.POSITION_RIGHT;
    public static readonly POSITION_FRONT: number = -1.5;
    public static readonly POSITION_BACK: number = 1.5;

    public static readonly TARGET_DISTANCE_FROM_CAR: number = 30;

    public static readonly FRONT_INTENSITY: number = 1;

    public static readonly FRONT_MAX_DISTANCE: number = 70;
    public static readonly FRONT_OPENING: number = 30;
    public static readonly FRONT_ANGLE: number = CarLightConfig.FRONT_OPENING * DEG_TO_RAD;
    public static readonly FRONT_PENUMBRA: number = 0.5;

    public static readonly BACK_INTENSITY_HIGH: number = 0.5;
    public static readonly BACK_INTENSITY_LOW: number = 0.2;

    public static readonly BACK_MAX_DISTANCE: number = 35;
    public static readonly BACK_OPENING: number = 30;
    public static readonly BACK_ANGLE: number = CarLightConfig.BACK_OPENING * DEG_TO_RAD;
    public static readonly BACK_PENUMBRA: number = 0.2;

}
