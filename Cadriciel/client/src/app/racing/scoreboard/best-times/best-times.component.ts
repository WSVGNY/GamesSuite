import { Component } from "@angular/core";
import { HighscoreService } from "./highscore.service";
import { CommonHighscore } from "../../../../../../common/racing/commonHighscore";

const HUNDREDTH_TO_MINUTES: number = 6000;
const SECONDS_TO_MINUTES: number = 100;

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

    public getTime(score: CommonHighscore): string {
        let time: string = "";
        const minutes: number = Math.floor(score.time / HUNDREDTH_TO_MINUTES);
        const seconds: number = Math.floor(Math.floor(score.time - minutes * HUNDREDTH_TO_MINUTES) / SECONDS_TO_MINUTES);
        time += minutes;
        time += ":";
        time += seconds;
        time += ":";
        time += score.time - minutes * HUNDREDTH_TO_MINUTES - seconds * SECONDS_TO_MINUTES;

        return time;
    }
}
