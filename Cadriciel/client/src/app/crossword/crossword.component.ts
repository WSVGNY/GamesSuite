import { Component } from "@angular/core";
import { CommonGridBox } from "../../../../common/crossword/commonGridBox";
import { Grid } from "../../../../common/crossword/grid";
import { CommonWord } from "../../../../common/crossword/commonWord";
import { ConfigurationService } from "./configuration.service";

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
    private isInCheatMode: boolean = false;
    public playerName: string = "";
    public correctWordCount: number = 0;
    public configurationDone: boolean = false;
    public isTwoPlayerGame: boolean = false;

    public constructor(private configurationService: ConfigurationService) {
    }

    public isConfigurationDone(): boolean {
        this.words = this.configurationService.words;
        this.boxes = this.configurationService.boxes;
        this.grid = this.configurationService.grid;
        this.isTwoPlayerGame = this.configurationService.isTwoPlayerGame;
        this.playerName = this.configurationService.playerName;

        return this.configurationService.configurationDone;
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
        if (!word._isComplete) {
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

    public isCompletedWord(word: CommonWord, wordEntered: string): boolean {
        return this.getWordValue(word) === wordEntered;
    }

    public addToScore(word: CommonWord): void {
        word._isComplete = true;
        this.correctWordCount++;
    }

}
