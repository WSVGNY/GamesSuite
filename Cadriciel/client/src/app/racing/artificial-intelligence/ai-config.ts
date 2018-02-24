import { Difficulty } from "../../../../../common/crossword/difficulty";

export class AIConfig {

    private readonly DISTANCE_FROM_VEHICULE_HARD: number = 20;
    private readonly DISTANCE_FROM_VEHICULE_MEDIUM: number = 12;
    private readonly DISTANCE_FROM_VEHICULE_EASY: number = 7;

    private readonly DISTANCE_BEFORE_REPLACEMENT_HARD: number = 1;
    private readonly DISTANCE_BEFORE_REPLACEMENT_MEDIUM: number = 2;
    private readonly DISTANCE_BEFORE_REPLACEMENT_EASY: number = 3;

    private readonly TURNING_POINT_DISTANCE: number = 0.1;
    private readonly TURNING_POINT_BUFFER: number = 2;
    private readonly START_INDEX: number = 0;

    public constructor(private _difficulty: Difficulty) {
    }

    public get distanceFromVehicule(): number {
        if (this._difficulty === Difficulty.Hard) {
            return this.DISTANCE_FROM_VEHICULE_HARD;
        } else if (this._difficulty === Difficulty.Medium) {
            return this.DISTANCE_FROM_VEHICULE_MEDIUM;
        } else {
            return this.DISTANCE_FROM_VEHICULE_EASY;
        }
    }

    public get distanceBeforeReplacement(): number {
        if (this._difficulty === Difficulty.Hard) {
            return this.DISTANCE_BEFORE_REPLACEMENT_HARD;
        } else if (this._difficulty === Difficulty.Medium) {
            return this.DISTANCE_BEFORE_REPLACEMENT_MEDIUM;
        } else {
            return this.DISTANCE_BEFORE_REPLACEMENT_EASY;
        }
    }

    public get turningPointDistance(): number {
        return this.TURNING_POINT_DISTANCE;
    }

    public get startIndex(): number {
        return this.START_INDEX;
    }

    public get turningPointBuffer(): number {
        return this.TURNING_POINT_BUFFER;
    }
}
