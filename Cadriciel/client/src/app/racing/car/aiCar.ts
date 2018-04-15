import { AbstractCar } from "./abstractCar";
import { Personality } from "../artificial-intelligence/ai-config";

export class AICar extends AbstractCar {

    public constructor(
        _id: number,
        _carStructure: CarStructure,
        _carControls: CarControls,
        lapCounter: number = 0,
        public trackPortionIndex: number = 0,
        private _aiPersonality: Personality = Personality.Player) {
        super();
        this.trackPortionIndex = 0;
    }

    public get aiPersonality(): Personality {
        return this._aiPersonality;
    }

}
