import { Component } from "@angular/core";
import { } from "@angular/";
import { GridBox } from "../../../../common/crossword/gridBox";
import { Word } from "../../../../common/crossword/word";
import { GridService } from "./grid.service";
import { Difficulty } from "../../../../common/crossword/difficulty";
// import { WordFiller } from "../../../../server/app/crossword/wordFiller";

@Component({
    selector: "app-crossword",
    templateUrl: "./crossword.component.html",
    styleUrls: ["./crossword.component.css"]
})
export class CrosswordComponent {

    public selectedGridBox: GridBox;
    public defs: Word;
    private grid: GridBox[][];
    private difficulty: Difficulty;
   // private wordFiller: WordFiller;

    public constructor(private gridService: GridService) {
    }

    public createGrid(): void {
        this.gridService.gridGet(this.difficulty).subscribe((grid: GridBox[][]) => this.grid = grid);
    }

    public onSelect(gridBox: GridBox): void {
        this.selectedGridBox = gridBox;
    }

    public makeEasyGrid(): void {
        this.difficulty = Difficulty.Easy;
        this.show();
        this.createGrid();

        // while (!this.wordFiller.isGenerated) {
        //     this.show();
        // }
    }

    public makeMediumGrid(): void {
        this.difficulty = Difficulty.Medium;
        this.createGrid();
        this.show();
    }

    public makeHardGrid(): void {
        this.difficulty = Difficulty.Hard;
        this.createGrid();
        this.show();
    }

    public show(): void {
        document.getElementById("loader").style.display = "block";
        const loader: HTMLElement = document.getElementById("loader");
        loader.addEventListener("animationend", (event: Event) => { loader.style.display = "none"; }, false);
    }

    public hide(): void {
        document.getElementById("loader").style.display = "none";
    }

    public hider(): void {
        document.getElementById("image1").style.display = "none";
        document.getElementById("image2").style.display = "none";
    }

}
