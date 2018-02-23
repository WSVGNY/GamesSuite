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
    public _isNewGame: boolean = false;
    public _isJoinGame: boolean = false;
    public _isTwoPlayerGame: boolean = false;
    public _choseNumberOfPlayers: boolean = false;
    public _difficulty: Difficulty;
    public _choseGridDifficulty: boolean = false;
    public _playerName: string = "";

    public constructor(private gridService: GridService, private configurationService: ConfigurationService) {
    }

    public setNewGame(): void {
        this._isNewGame = true;
    }

    public setJoinGame(): void {
        this._isJoinGame = true;
    }

    public setTwoPlayerGame(): void {
        this._isTwoPlayerGame = true;
    }

    public chooseNumberOfPlayers(): void {
        this._choseNumberOfPlayers = true;
    }

    public createGrid(): void {
        this.configurationService.words = undefined;
        this.gridService.gridGet(this._difficulty).subscribe((grid: Grid) => {
            this.configurationService.grid = grid;
            this.configurationService.boxes = this.configurationService.grid.boxes;
            this.configurationService.words = this.configurationService.grid.words;
            this.configurationService.isTwoPlayerGame = this._isTwoPlayerGame;
        });
    }

    private makeGrid(): void {
        this._choseGridDifficulty = true;
        this.createGrid();
    }

    public makeEasyGrid(): void {
        this._difficulty = Difficulty.Easy;
        this.makeGrid();
    }

    public makeMediumGrid(): void {
        this._difficulty = Difficulty.Medium;
        this.makeGrid();
    }

    public makeHardGrid(): void {
        this._difficulty = Difficulty.Hard;
        this.makeGrid();
    }

    public submitName(): void {
        this.configurationService.playerName = this._playerName;
        this.configurationService.configurationDone = true;
    }

}
