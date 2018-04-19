import { SECONDS_TO_MINUTES, SECONDS_TO_HUNDREDTH } from "../constants/math.constants";

export abstract class Formater {
    public static formatTime(score: number): string {
        const time: string[] = ["00", "00", "00"];
        const minutes: number = Math.floor(score / SECONDS_TO_MINUTES);
        const seconds: number = Math.floor(score - minutes * SECONDS_TO_MINUTES);
        const hundredth: number = Math.round((score - minutes * SECONDS_TO_MINUTES - seconds) * SECONDS_TO_HUNDREDTH);

        time[0] = (time[0] + minutes.toString()).substring(minutes.toString().length);
        time[1] = (time[1] + seconds.toString()).substring(seconds.toString().length);
        time[2] = (time[2] + hundredth.toString()).substring(hundredth.toString().length);

        return time.join(":");
    }
}
