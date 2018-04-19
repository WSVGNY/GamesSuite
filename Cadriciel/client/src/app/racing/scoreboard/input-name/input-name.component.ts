import { Component } from "@angular/core";
import { HighscoreService } from "../highscores/highscore.service";
import { InputNameService } from "./input-name.service";

@Component({
    selector: "app-input-name",
    templateUrl: "./input-name.component.html",
    styleUrls: ["./input-name.component.css"]
})
export class InputNameComponent {

    public constructor(private highscoreService: HighscoreService, private inputTimeService: InputNameService) { }

    public loadLeaderBoard(name: string): void {
        this.highscoreService.addNewScore(name);
        this.inputTimeService.showInput = false;
    }

    public readyToViewInput(): boolean {
        return this.inputTimeService.showInput;
    }
}
