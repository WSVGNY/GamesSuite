import { Component } from "@angular/core";
import { CommonHighscore } from "../../../../../../common/racing/commonHighscore";
import { EndGameTableService } from "../end-game-table.service";
import { InputTimeService } from "../input-time.service";
import { HighscoreService } from "../highscore.service";

const HUNDREDTH_TO_MINUTES: number = 6000;
const SECONDS_TO_MINUTES: number = 100;

@Component({
    selector: "app-end-game-table",
    templateUrl: "./end-game-table.component.html",
    styleUrls: ["./end-game-table.component.css"]
})
export class EndGameTableComponent {

    public constructor(
        public endGameTableService: EndGameTableService,
        public inputTimeService: InputTimeService,
        public highscoreService: HighscoreService) { }

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

    public readyToView(): boolean {
        return this.endGameTableService.showTable;
    }

    public goToNextView(): void {
        this.endGameTableService.showTable = false;
        if (this.highscoreService.isNewHighScore()) {
            this.inputTimeService.showInput = true;
        } else {
            this.highscoreService.showTable = true;
        }
    }

}
