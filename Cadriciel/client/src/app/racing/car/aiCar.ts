import { AbstractCar } from "./abstractCar";
import { Personality } from "../constants/ai.constants";
import { CarStructure } from "./carStructure";
import { CarControls } from "./carControls";
import { AIDebug } from "../artificial-intelligence/ai-debug";

export class AICar extends AbstractCar {

    private _aiDebug: AIDebug;

    public constructor(
        _id: number,
        private _aiPersonality: Personality = Personality.Curly,
        public trackPortionIndex: number = 0,
        _carStructure: CarStructure = new CarStructure(),
        _carControls: CarControls = new CarControls(),
        lapCounter: number = 0) {
        super(_id, _carStructure, _carControls, lapCounter);
        this.trackPortionIndex = 0;
        this._aiDebug = new AIDebug();
    }

    public get aiPersonality(): Personality {
        return this._aiPersonality;
    }

    public get aiDebug(): AIDebug {
        return this._aiDebug;
    }

}
