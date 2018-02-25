import { Difficulty } from "../../../../../common/crossword/difficulty";

export class AIConfig {

    public static TURNING_POINT_DISTANCE: number = 0.1;
    public static TURNING_POINT_BUFFER: number = 2;
    public static readonly START_INDEX: number = 0;

    private readonly DISTANCE_FROM_VEHICULE_HARD: number = 20;
    private readonly DISTANCE_FROM_VEHICULE_MEDIUM: number = 12;
    private readonly DISTANCE_FROM_VEHICULE_EASY: number = 7;

    private readonly DISTANCE_BEFORE_REPLACEMENT_HARD: number = 1;
    private readonly DISTANCE_BEFORE_REPLACEMENT_MEDIUM: number = 2;
    private readonly DISTANCE_BEFORE_REPLACEMENT_EASY: number = 3;

    public constructor(private _difficulty: Difficulty) {
    }

    public get distanceFromVehicule(): number {
        switch (this._difficulty) {
            case Difficulty.Hard:
                return this.DISTANCE_FROM_VEHICULE_HARD;
            case Difficulty.Medium:
                return this.DISTANCE_FROM_VEHICULE_MEDIUM;
            default:
                return this.DISTANCE_FROM_VEHICULE_EASY;
        }
    }

    public get distanceBeforeReplacement(): number {
        switch (this._difficulty) {
            case Difficulty.Hard:
                return this.DISTANCE_BEFORE_REPLACEMENT_HARD;
            case Difficulty.Medium:
                return this.DISTANCE_BEFORE_REPLACEMENT_MEDIUM;
            default:
                return this.DISTANCE_BEFORE_REPLACEMENT_EASY;
        }
    }
}
