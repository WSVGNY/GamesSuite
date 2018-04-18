import {
    DISTANCE_FROM_VEHICULE_LARRY,
    DISTANCE_FROM_VEHICULE_CURLY,
    DISTANCE_FROM_VEHICULE_MOE,
    DISTANCE_BEFORE_REORIENTATION_LARRY,
    DISTANCE_BEFORE_REORIENTATION_CURLY,
    DISTANCE_BEFORE_REORIENTATION_MOE,
    Personality
} from "../constants/ai.constants";

export class AIConfig {

    public static getDistanceFromVehicule(personality: Personality): number {
        switch (personality) {
            case Personality.Larry:
                return DISTANCE_FROM_VEHICULE_LARRY;
            case Personality.Curly:
                return DISTANCE_FROM_VEHICULE_CURLY;
            case Personality.Moe:
                return DISTANCE_FROM_VEHICULE_MOE;
            default:
                return 0;
        }
    }

    public static getDistanceBeforeReplacement(personality: Personality): number {
        switch (personality) {
            case Personality.Larry:
                return DISTANCE_BEFORE_REORIENTATION_LARRY;
            case Personality.Curly:
                return DISTANCE_BEFORE_REORIENTATION_CURLY;
            case Personality.Moe:
                return DISTANCE_BEFORE_REORIENTATION_MOE;
            default:
                return 0;
        }
    }
}
