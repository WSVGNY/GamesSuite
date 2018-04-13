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
