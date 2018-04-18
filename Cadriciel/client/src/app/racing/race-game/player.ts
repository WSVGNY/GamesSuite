import { Score } from "../scoreboard/score";

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
        if (this._score.lapTimes.length < 3) {
            this._score.lapTimes.push(lapTime);
        }
    }

    public setTotalTime(time: number): void {
        this._score.totalTime = time;
    }

    public setFirstLapTime(time: number): void {
        this._score.firstLap = time;
    }

    public setSecondLapTime(time: number): void {
        this._score.secondLap = time;
    }

    public setThirdLapTime(time: number): void {
        this._score.thirdLap = time;
    }

    public get score(): Score {
        return this._score;
    }

    public get name(): string {
        return this._name;
    }

}
