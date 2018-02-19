import { Component } from "@angular/core";
import { CommonGridBox } from "../../../../common/crossword/commonGridBox";
import { Grid } from "../../../../common/crossword/grid";
import { CommonWord } from "../../../../common/crossword/commonWord";
import { GridService } from "./grid.service";
import { Difficulty } from "../../../../common/crossword/difficulty";

@Component({
    selector: "app-crossword",
    templateUrl: "./crossword.component.html",
    styleUrls: ["./crossword.component.css"]
})
export class CrosswordComponent {

    public selectedGridBox: CommonGridBox;
    public defs: CommonWord;
    private grid: Grid;
    private boxes: CommonGridBox[][];
    private words: CommonWord[];
    private difficulty: Difficulty;
    private isInCheatMode: boolean = false;

    public constructor(private gridService: GridService) {
    }

    public createGrid(): void {
        this.gridService.gridGet(this.difficulty).subscribe((grid: Grid) => {
            this.grid = grid;
            this.boxes = this.grid.boxes;
            this.words = this.grid.words;
        });
    }

    public onSelect(gridBox: CommonGridBox): void {
        this.selectedGridBox = gridBox;
    }

    public makeEasyGrid(): void {
        this.difficulty = Difficulty.Easy;
        this.show();
        this.createGrid();
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

    public hideLoader(): void {
        document.getElementById("loader").style.display = "none";
    }

    public hide(): void {
        document.getElementById("image1").style.display = "none";
        document.getElementById("image2").style.display = "none";
    }

    public changeMode(): void {
        this.isInCheatMode ?
            this.isInCheatMode = false :
            this.isInCheatMode = true;
    }

    public highlightWord(word: CommonWord): void {
        this.deselectWords();
        if (word._isHorizontal) {
            for (let i: number = 0; i < word["_length"]; i++) {
                this.grid.boxes[word._startPosition._y][i + word._startPosition._x]._isColored = true;
            }
        } else {
            for (let i: number = 0; i < word["_length"]; i++) {
                this.grid.boxes[word._startPosition._y + i][word._startPosition._x]._isColored = true;
            }
        }

    }

    public deselectWords(): void {
        if (this.grid !== undefined) {
            for (const line of this.grid.boxes) {
                for (const box of line) {
                    box._isColored = false;
                }
            }
        }
    }

    public getWordValue(word: CommonWord): string {
        let value: string = "";
        if (word._isHorizontal) {
            for (let i: number = 0; i < word["_length"]; i++) {
                value += this.grid.boxes[word._startPosition._y][i + word._startPosition._x]._char._value;
            }
        } else {
            for (let i: number = 0; i < word["_length"]; i++) {
                value += this.grid.boxes[word._startPosition._y + i][word._startPosition._x]._char._value;
            }
        }

        return value;
    }

    public getGridBoxID(gridBox: CommonGridBox): number {
        if (gridBox["_constraints"][0] !== undefined) {
            if (gridBox["_constraints"][1] !== undefined) {
                if (gridBox["_id"]["_x"] === gridBox["_constraints"][1]["_startPosition"]["_x"]
                    && gridBox["_id"]["_y"] === gridBox["_constraints"][1]["_startPosition"]["_y"]) {
                    return gridBox["_constraints"][1]["_definitionID"];
                }
                if (gridBox["_id"]["_x"] === gridBox["_constraints"][0]["_startPosition"]["_x"]
                    && gridBox["_id"]["_y"] === gridBox["_constraints"][0]["_startPosition"]["_y"]) {
                    return gridBox["_constraints"][0]["_definitionID"];
                }
            }
            if (gridBox["_id"]["_x"] === gridBox["_constraints"][0]["_startPosition"]["_x"]
                && gridBox["_id"]["_y"] === gridBox["_constraints"][0]["_startPosition"]["_y"]) {
                return gridBox["_constraints"][0]["_definitionID"];
            }
        }

        return undefined;
    }

}
