import { Component } from "@angular/core";
import { EndGameTableService } from "./end-game-table.service";
import { InputTimeService } from "../input-time/input-time.service";
import { HighscoreService } from "../best-times/highscore.service";

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

    public readyToView(): boolean {
        // if (this.carTrackingManagerService.isCompleted && this.changeState) {
        //     this.endGameTableService.showTable = true;
        // }

        return this.endGameTableService.showTable;
    }

    public goToNextView(): void {
        this.endGameTableService.showTable = false;
        this.changeState = false;
        if (this.highscoreService.isNewHighScore(this.endGameTableService.getHumanPlayer())) {
            this.inputTimeService.showInput = true;
        } else {
            this.highscoreService.showTable = true;
        }
    }

}
