const SECONDS_TO_HUNDREDTH: number = 100;
const SECONDS_TO_MINUTES: number = 60;

export class Score {
    public totalTime: number;
    public firstLap: number;
    public secondLap: number;
    public thirdLap: number;

    public getFormatedTime(score: number): string {
        let time: string = "";
        const minutes: number = Math.floor(score / SECONDS_TO_MINUTES);
        const seconds: number = Math.floor(score - minutes * SECONDS_TO_MINUTES);
        const hundredth: number = Math.round((score - minutes * SECONDS_TO_MINUTES - seconds) * SECONDS_TO_HUNDREDTH);
        time += minutes;
        time += ":";
        time += seconds;
        time += ":";
        time += hundredth;

        return time;
    }
}
