export enum Personality {
    Larry, Curly, Moe, Player
}

export class AIConfig {

    public static readonly TURNING_POINT_DISTANCE: number = 0.1;
    public static readonly TURNING_POINT_BUFFER: number = 20;
    public static readonly START_INDEX: number = 0;

    private static readonly DISTANCE_FROM_VEHICULE_LARRY: number = 28;
    private static readonly DISTANCE_FROM_VEHICULE_CURLY: number = 25;
    private static readonly DISTANCE_FROM_VEHICULE_MOE: number = 22;

    private static readonly DISTANCE_BEFORE_REPLACEMENT_LARRY: number = 3;
    private static readonly DISTANCE_BEFORE_REPLACEMENT_CURLY: number = 2;
    private static readonly DISTANCE_BEFORE_REPLACEMENT_MOE: number = 1;

    public static getDistanceFromVehicule(personality: Personality): number {
        switch (personality) {
            case Personality.Larry:
                return this.DISTANCE_FROM_VEHICULE_LARRY;
            case Personality.Curly:
                return this.DISTANCE_FROM_VEHICULE_CURLY;
            case Personality.Moe:
                return this.DISTANCE_FROM_VEHICULE_MOE;
            default:
                return 0;
        }
    }

    public static getDistanceBeforeReplacement(personality: Personality): number {
        switch (personality) {
            case Personality.Larry:
                return this.DISTANCE_BEFORE_REPLACEMENT_LARRY;
            case Personality.Curly:
                return this.DISTANCE_BEFORE_REPLACEMENT_CURLY;
            case Personality.Moe:
                return this.DISTANCE_BEFORE_REPLACEMENT_MOE;
            default:
                return 0;
        }
    }
}
