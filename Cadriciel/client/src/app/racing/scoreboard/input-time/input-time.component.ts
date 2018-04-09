import { Component } from "@angular/core";
import { HighscoreService } from "../highscore.service";

@Component({
    selector: "app-input-time",
    templateUrl: "./input-time.component.html",
    styleUrls: ["./input-time.component.css"]
})
export class InputTimeComponent {

    public constructor(public highscoreService: HighscoreService) { }

    public loadLeaderBoard(name: string): void {
        this.highscoreService.addNewScore(name);
    }

    public isScoreAdded(): boolean {
        return this.highscoreService.addedScore;
    }
}
