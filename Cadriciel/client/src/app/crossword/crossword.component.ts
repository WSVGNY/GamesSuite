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
    public boxes: CommonGridBox[][];
    public words: CommonWord[];
    private difficulty: Difficulty;
    private isInCheatMode: boolean = false;
    public showLoader: boolean = false;
    public playerName: string = "";
    public correctWordCount: number = 0;

    public constructor(private gridService: GridService) {
    }

    public createGrid(): void {
        document.getElementById("input").style.visibility = "visible";
        this.words = undefined;
        this.gridService.gridGet(this.difficulty).subscribe((grid: Grid) => {
            this.grid = grid;
            this.boxes = this.grid.boxes;
            this.words = this.grid.words;
            this.showLoader = false;
            document.getElementById("gridHider").style.visibility = "hidden";
        });
    }

    public hideModeSelector(): void {
        document.getElementById("modeSelection").style.display = "none";
    }

    public onSelect(gridBox: CommonGridBox): void {
        this.selectedGridBox = gridBox;
    }

    public makeEasyGrid(): void {
        this.difficulty = Difficulty.Easy;
        this.showLoader = true;
        document.getElementById("gridHider").style.visibility = "visible";
        this.createGrid();
    }

    public makeMediumGrid(): void {
        this.difficulty = Difficulty.Medium;
        this.createGrid();
        this.showLoader = true;
        document.getElementById("gridHider").style.visibility = "visible";
    }

    public makeHardGrid(): void {
        this.difficulty = Difficulty.Hard;
        this.createGrid();
        this.showLoader = true;
        document.getElementById("gridHider").style.visibility = "visible";
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

    public highlightedWord(word: CommonWord): boolean {
        if (word._isHorizontal) {
            if (this.grid.boxes[word._startPosition._y][word._startPosition._x]._isColored &&
                this.grid.boxes[word._startPosition._y][word._startPosition._x + 1]._isColored) {
                return true;
            }

            return false;
        } else {
            if (this.grid.boxes[word._startPosition._y][word._startPosition._x]._isColored &&
                this.grid.boxes[word._startPosition._y + 1][word._startPosition._x]._isColored) {
                return true;
            }

            return false;
        }
    }

    public highlightWordOfBox(gridBox: CommonGridBox): void {
        if (gridBox._constraints[0] !== undefined) {
            this.highlightWord((gridBox as CommonGridBox)._constraints[0]);
        }
    }

    public highlightWord(word: CommonWord): void {
        this.deselectWords();
        if (word._isHorizontal) {
            for (let i: number = 0; i < word._length; i++) {
                this.grid.boxes[word._startPosition._y][i + word._startPosition._x]._isColored = true;
            }
        } else {
            for (let i: number = 0; i < word._length; i++) {
                this.grid.boxes[word._startPosition._y + i][word._startPosition._x]._isColored = true;
            }
        }
    }

    public newGame(): void {
        document.getElementById("buttongroup").style.visibility = "visible";
    }

    public joinGame(): void {
        document.getElementById("buttongroup").style.visibility = "hidden";
    }

    public play(): void {
        document.getElementById("buttongroupp").style.visibility = "visible";
        document.getElementById("secondPlayer").style.visibility = "visible";
    }

    public playAlone(): void {
        document.getElementById("secondPlayer").style.visibility = "hidden";
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
            for (let i: number = 0; i < word._length; i++) {
                value += this.grid.boxes[word._startPosition._y][i + word._startPosition._x]._char._value;
            }
        } else {
            for (let i: number = 0; i < word._length; i++) {
                value += this.grid.boxes[word._startPosition._y + i][word._startPosition._x]._char._value;
            }
        }

        return value;
    }

    public getGridBoxID(gridBox: CommonGridBox): number {
        if (gridBox._constraints[0] !== undefined) {
            if (gridBox._constraints[1] !== undefined) {
                if (gridBox._id._x === gridBox._constraints[1]._startPosition._x
                    && gridBox._id._y === gridBox._constraints[1]._startPosition._y) {
                    return gridBox._constraints[1]._definitionID;
                }
                if (gridBox._id._x === gridBox._constraints[0]._startPosition._x
                    && gridBox._id._y === gridBox._constraints[0]._startPosition._y) {
                    return gridBox._constraints[0]._definitionID;
                }
            }
            if (gridBox._id._x === gridBox._constraints[0]._startPosition._x
                && gridBox._id._y === gridBox._constraints[0]._startPosition._y) {
                return gridBox._constraints[0]._definitionID;
            }
        }

        return undefined;
    }

}
