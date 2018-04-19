import { Component } from "@angular/core";
import { EndGameTableService } from "./end-game-table.service";
import { Formater } from "../formater";

@Component({
    selector: "app-end-game-table",
    templateUrl: "./end-game-table.component.html",
    styleUrls: ["./end-game-table.component.css"]
})
export class EndGameTableComponent {

    public changeState: boolean;

    public constructor(
        private endGameTableService: EndGameTableService) {
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
