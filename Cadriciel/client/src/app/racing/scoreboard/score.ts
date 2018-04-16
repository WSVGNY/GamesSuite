const SECONDS_TO_HUNDREDTH: number = 100;
const SECONDS_TO_MINUTES: number = 60;

export class Score {
    public totalTime: number;
    public firstLap: number;
    public secondLap: number;
    public thirdLap: number;

    public getFormatedTime(score: number): string {
        const time: string[] = ["00", "00", "00"];
        const minutes: number = Math.floor(score / SECONDS_TO_MINUTES);
        const seconds: number = Math.floor(score - minutes * SECONDS_TO_MINUTES);
        const hundredth: number = Math.round((score - minutes * SECONDS_TO_MINUTES - seconds) * SECONDS_TO_HUNDREDTH);
        const minutesString: string = minutes.toString();
        const secondsString: string = seconds.toString();
        const hundredthString: string = hundredth.toString();
        time[0] = (time[0] + minutesString).substring(minutesString.length);
        time[1] = (time[1] + secondsString).substring(secondsString.length);
        time[2] = (time[2] + hundredthString).substring(hundredthString.length);

        return time.join(" : ");
    }
}
