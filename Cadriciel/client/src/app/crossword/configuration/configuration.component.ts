import { Component } from "@angular/core";
import { GridService } from "../grid.service";
import { ConfigurationService } from "../configuration.service";
import { Grid } from "../../../../../common/crossword/grid";
import { Difficulty } from "../../../../../common/crossword/difficulty";

@Component({
    selector: "app-configuration",
    templateUrl: "./configuration.component.html",
    styleUrls: ["./configuration.component.css"]
})
export class ConfigurationComponent {
    public isNewGame: boolean = false;
    public isJoinGame: boolean = false;
    public difficulty: Difficulty;
    public difficultySetter: number;
    public choseGridDifficulty: boolean = false;
    public constructor(private gridService: GridService, public configurationService: ConfigurationService) {
    }

    public setNewGame(): void {
        this.isNewGame = true;
    }

    public setJoinGame(): void {
        this.isJoinGame = true;
    }

    public createGrid(): void {
        this.gridService.gridGet(this.difficulty).subscribe((grid: Grid) => {
            this.configurationService.grid = grid;
        });
    }

    private makeGrid(): void {
        this.choseGridDifficulty = true;
        this.createGrid();
    }

    public makeEasyGrid(): void {
        this.difficulty = Difficulty.Easy;
        this.makeGrid();
        this.difficultySetter = 0;
    }

    public makeMediumGrid(): void {
        this.difficulty = Difficulty.Medium;
        this.makeGrid();
        this.difficultySetter = 1;
    }

    public makeHardGrid(): void {
        this.difficulty = Difficulty.Hard;
        this.makeGrid();
        this.difficultySetter = 2;
    }

    public submitName(): void {
        this.configurationService.configurationDone = true;
    }

}
