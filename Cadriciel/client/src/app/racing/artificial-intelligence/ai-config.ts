export enum Personality {
    Larry, Curly, Moe, Player
}

export class AIConfig {

    private static readonly DISTANCE_FROM_VEHICULE_LARRY: number = 28;
    private static readonly DISTANCE_FROM_VEHICULE_CURLY: number = 25;
    private static readonly DISTANCE_FROM_VEHICULE_MOE: number = 22;

    private static readonly DISTANCE_BEFORE_REORIENTATION_LARRY: number = 3;
    private static readonly DISTANCE_BEFORE_REORIENTATION_CURLY: number = 2;
    private static readonly DISTANCE_BEFORE_REORIENTATION_MOE: number = 1;

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
                return this.DISTANCE_BEFORE_REORIENTATION_LARRY;
            case Personality.Curly:
                return this.DISTANCE_BEFORE_REORIENTATION_CURLY;
            case Personality.Moe:
                return this.DISTANCE_BEFORE_REORIENTATION_MOE;
            default:
                return 0;
        }
    }
}
