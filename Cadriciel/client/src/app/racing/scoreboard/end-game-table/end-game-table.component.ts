import { Component } from "@angular/core";
import { EndGameTableService } from "./end-game-table.service";
import { InputTimeService } from "../input-time/input-time.service";
import { HighscoreService } from "../best-times/highscore.service";
import { Score } from "../score";

const HUNDREDTH_TO_MINUTES: number = 6000;
const SECONDS_TO_MINUTES: number = 100;

@Component({
    selector: "app-end-game-table",
    templateUrl: "./end-game-table.component.html",
    styleUrls: ["./end-game-table.component.css"]
})
export class EndGameTableComponent {

    public changeState: boolean;

    public constructor(
        public endGameTableService: EndGameTableService,
        public inputTimeService: InputTimeService,
        public highscoreService: HighscoreService) {
        this.changeState = true;
    }

    public getTime(score: Score): string {
        let time: string = "";
        const minutes: number = Math.floor(score.totalTime / HUNDREDTH_TO_MINUTES);
        const seconds: number = Math.floor(Math.floor(score.totalTime - minutes * HUNDREDTH_TO_MINUTES) / SECONDS_TO_MINUTES);
        time += minutes;
        time += ":";
        time += seconds;
        time += ":";
        time += score.totalTime - minutes * HUNDREDTH_TO_MINUTES - seconds * SECONDS_TO_MINUTES;

        return time;
    }

    public readyToView(): boolean {
        // if (this.carTrackingManagerService.isCompleted && this.changeState) {
        //     this.endGameTableService.showTable = true;
        // }

        return this.endGameTableService.showTable;
    }

    public goToNextView(): void {
        this.endGameTableService.showTable = false;
        this.changeState = false;
        if (this.highscoreService.isNewHighScore(this.endGameTableService.getPlayerScore())) {
            this.inputTimeService.showInput = true;
        } else {
            this.highscoreService.showTable = true;
        }
    }

}
