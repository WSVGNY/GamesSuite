import { Score } from "../scoreboard/score";

export class Player {

    private _score: Score;
    public position: number;

    public constructor(private _id: number, private _name: string) {
        this._score = new Score();
    }

    public get id(): number {
        return this._id;
    }

    public setTotalTime(time: number): void {
        this._score.totalTime = time;
    }

    public get score(): Score {
        return this._score;
    }

    public get name(): string {
        return this._name;
    }

}
