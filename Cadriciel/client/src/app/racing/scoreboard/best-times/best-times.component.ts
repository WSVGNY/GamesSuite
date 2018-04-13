import { Component } from "@angular/core";
import { HighscoreService } from "./highscore.service";

const SECONDS_TO_HUNDREDTH: number = 100;
const SECONDS_TO_MINUTES: number = 60;

@Component({
    selector: "app-best-times",
    templateUrl: "./best-times.component.html",
    styleUrls: ["./best-times.component.css"]
})
export class BestTimesComponent {

    public constructor(public highscoreService: HighscoreService) { }

    public readyToView(): boolean {
        return this.highscoreService.showTable;
    }

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
