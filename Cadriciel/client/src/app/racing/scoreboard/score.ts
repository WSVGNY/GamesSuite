import { Formater } from "./formater";

export class Score {
    public lapTimes: number[];

    public constructor() {
        this.lapTimes = [];
    }

    public getFormatedTime(score: number): string {
        return Formater.formatTime(score);
    }

    public get firstLap(): number {
        return this.lapTimes[0];
    }

    public get secondLap(): number {
        return this.lapTimes[1] - this.lapTimes[0];
    }

    public get thirdLap(): number {
        return this.lapTimes[2] - this.lapTimes[1];
    }

    public get totalTime(): number {
        return this.lapTimes[2];
    }
}
