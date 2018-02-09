import { Component } from "@angular/core";
import { } from "@angular/";
import { GridBox } from "../../../../common/crossword/gridBox";
import { GridService } from "./grid.service";
import {Difficulty} from "../../../../common/crossword/difficulty";

@Component({
    selector: "app-crossword",
    templateUrl: "./crossword.component.html",
    styleUrls: ["./crossword.component.css"]
})
export class CrosswordComponent {

    public selectedGridBox: GridBox;
    private grid: GridBox[][];
    private difficulty: Difficulty;

    public constructor(private gridService: GridService) {
    }

    public createGrid(): boolean {
        this.gridService.gridGet(this.difficulty).subscribe((grid: GridBox[][]) => this.grid = grid);

        return true;
    }

    public onSelect(gridBox: GridBox): void {
        this.selectedGridBox = gridBox;
    }

    public makeEasyGrid(): void {
        this.difficulty = Difficulty.easy;
        this.createGrid();
    }

    public makeMediumGrid(): void {
        this.difficulty = Difficulty.medium;
        this.createGrid();
    }

    public makeHardGrid(): void {
        this.difficulty = Difficulty.hard;
        this.createGrid();
    }
}
