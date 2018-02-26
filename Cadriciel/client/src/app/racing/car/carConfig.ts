export class CarConfig {
    public static readonly DEFAULT_WHEELBASE: number = 2.78;
    public static readonly DEFAULT_MASS: number = 1515;
    public static readonly DEFAULT_DRAG_COEFFICIENT: number = 0.35;
    public static readonly MAXIMUM_STEERING_ANGLE: number = 0.15;
    public static readonly INITIAL_WEIGHT_DISTRIBUTION: number = 0.5;
    public static readonly MINIMUM_SPEED: number = 0.05;
    public static readonly NUMBER_REAR_WHEELS: number = 2;
    public static readonly NUMBER_WHEELS: number = 4;
    public static readonly TARGET_DISTANCE_FROM_CAR: number = 30;
    public static readonly SPOTLIGHT_MAX_DISTANCE: number = 100;
    public static readonly SPOTLIGHT_OPENING: number = 5;
    public static readonly SPOTLIGHT_ANGLE: number = Math.PI / CarConfig.SPOTLIGHT_OPENING;
    public static readonly SPOTLIGHT_PENUMBRA: number = 0.5;
    public static readonly SPOTLIGHT_FRONT_LEFT: number = 0;
    public static readonly SPOTLIGHT_FRONT_RIGHT: number = 1;
    public static readonly SPOTLIGHT_BACK_LEFT: number = 2;
    public static readonly SPOTLIGHT_BACK_RIGHT: number = 3;
}
