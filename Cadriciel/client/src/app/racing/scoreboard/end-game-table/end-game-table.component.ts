import { Component } from "@angular/core";
import { EndGameTableService } from "./end-game-table.service";
import { InputTimeService } from "../input-time/input-time.service";
import { HighscoreService } from "../best-times/highscore.service";
import { Formater } from "../formater";

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

        return this.endGameTableService.showTable;
    }

    public goToNextView(): void {
        this.endGameTableService.showTable = false;
    }

    public getFormatedTime(time: number): string {
        return Formater.formatTime(time);
    }

}
