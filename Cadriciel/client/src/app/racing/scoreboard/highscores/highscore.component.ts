import { Component } from "@angular/core";
import { HighscoreService } from "./highscore.service";
import { Formater } from "../formater";

@Component({
    selector: "app-highscore",
    templateUrl: "./highscore.component.html",
    styleUrls: ["./highscore.component.css"]
})
export class HighscoreComponent {

    public constructor(private highscoreService: HighscoreService) { }

    public readyToView(): boolean {
        return this.highscoreService.showTable;
    }

    public getFormatedTime(time: number): string {
        return Formater.formatTime(time);
    }
}
