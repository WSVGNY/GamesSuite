import { Component } from "@angular/core";
import { HighscoreService } from "./highscore.service";
import { Formater } from "../formater";

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

    public getFormatedTime(time: number): string {
        return Formater.formatTime(time);
    }
}
