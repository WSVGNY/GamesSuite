import { DEG_TO_RAD } from "./math.constants";

export const FRONT_LEFT_INDEX: number = 0;
export const FRONT_RIGHT_INDEX: number = 1;
export const BACK_LEFT_INDEX: number = 2;
export const BACK_RIGHT_INDEX: number = 3;

export const POSITION_Y: number = -0.4;
export const POSITION_RIGHT: number = 0.5;
export const POSITION_LEFT: number = -POSITION_RIGHT;
export const POSITION_FRONT: number = -1.5;
export const POSITION_BACK: number = 1.5;

export const TARGET_DISTANCE_FROM_CAR: number = 30;

export const FRONT_INTENSITY: number = 1;

export const FRONT_MAX_DISTANCE: number = 70;
export const FRONT_OPENING: number = 30;
export const FRONT_ANGLE: number = FRONT_OPENING * DEG_TO_RAD;
export const FRONT_PENUMBRA: number = 0.5;

export const BACK_INTENSITY_HIGH: number = 0.5;
export const BACK_INTENSITY_LOW: number = 0.2;

export const BACK_MAX_DISTANCE: number = 35;
export const BACK_OPENING: number = 30;
export const BACK_ANGLE: number = BACK_OPENING * DEG_TO_RAD;
export const BACK_PENUMBRA: number = 0.2;
