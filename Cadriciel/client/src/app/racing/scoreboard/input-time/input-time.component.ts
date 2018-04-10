import { Component } from "@angular/core";
import { HighscoreService } from "../best-times/highscore.service";
import { InputTimeService } from "./input-time.service";

@Component({
    selector: "app-input-time",
    templateUrl: "./input-time.component.html",
    styleUrls: ["./input-time.component.css"]
})
export class InputTimeComponent {

    public constructor(public highscoreService: HighscoreService, public inputTimeService: InputTimeService) { }

    public loadLeaderBoard(name: string): void {
        this.highscoreService.addNewScore(name);
        this.inputTimeService.showInput = false;
    }

    public readyToView(): boolean {
        return this.inputTimeService.showInput;
    }
}
