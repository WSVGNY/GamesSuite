import { Component } from "@angular/core";
import { HighscoreService } from "../highscore.service";
import { CommonHighscore } from "../../../../../../common/racing/commonHighscore";

@Component({
    selector: "app-best-times",
    templateUrl: "./best-times.component.html",
    styleUrls: ["./best-times.component.css"]
})
export class BestTimesComponent {

    public constructor(public highscoreService: HighscoreService) { }

    public readyToView(): boolean {
        return this.highscoreService.addedScore;
    }

    public getTime(score: CommonHighscore): string {
        let time: string = "";
        const minutes: number = Math.floor(score.time / 6000);
        const seconds: number = Math.floor(Math.floor(score.time - minutes * 6000) / 100);
        time += minutes;
        time += ":";
        time += seconds;
        time += ":";
        time += score.time - minutes * 6000 - seconds * 100;

        return time;
    }
}
