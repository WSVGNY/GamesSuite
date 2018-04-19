import { Score } from "../scoreboard/score";
import { NUMBER_OF_LAPS } from "../constants/car.constants";

export class Player {

    private _score: Score;
    public position: number;

    public constructor(private _uniqueid: number, private _name: string) {
        this._score = new Score();
    }

    public get uniqueid(): number {
        return this._uniqueid;
    }

    public pushLapTime(lapTime: number): void {
        if (this._score.lapTimes.length < NUMBER_OF_LAPS) {
            this._score.lapTimes.push(lapTime);
        }
    }

    public get score(): Score {
        return this._score;
    }

    public get name(): string {
        return this._name;
    }

}
