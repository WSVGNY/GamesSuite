import { Component } from "@angular/core";
import { CommonGridBox } from "../../../../common/crossword/commonGridBox";
import { CommonWord } from "../../../../common/crossword/commonWord";
import { ConfigurationService } from "./configuration.service";

@Component({
    selector: "app-crossword",
    templateUrl: "./crossword.component.html",
    styleUrls: ["./crossword.component.css"]
})
export class CrosswordComponent {

    public selectedGridBox: CommonGridBox;
    public correctWordCount: number = 0;
    public isInCheatMode: boolean = false;

    public constructor(public configurationService: ConfigurationService) {
    }

    public isConfigurationDone(): boolean {
        return this.configurationService.configurationDone;
    }

    public changeMode(): void {
        this.isInCheatMode ?
            this.isInCheatMode = false :
            this.isInCheatMode = true;
    }

    public highlightedWord(word: CommonWord): boolean {
        if (word.isHorizontal) {
            if (this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x]._isColored &&
                this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x + 1]._isColored) {
                return true;
            }

            return false;
        } else {
            if (this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x]._isColored &&
                this.configurationService.grid.boxes[word.startPosition.y + 1][word.startPosition.x]._isColored) {
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
            if (word.isHorizontal) {
                for (let i: number = 0; i < word.length; i++) {
                    this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x + i]._isColored = true;
                }
            } else {
                for (let i: number = 0; i < word.length; i++) {
                    this.configurationService.grid.boxes[word.startPosition.y + i][word.startPosition.x]._isColored = true;
                }
            }
        }
    }

    public deselectWords(): void {
        if (this.configurationService.grid !== undefined) {
            for (const line of this.configurationService.grid.boxes) {
                for (const box of line) {
                    box._isColored = false;
                }
            }
        }
    }

    public getWordValue(word: CommonWord): string {
        let value: string = "";
        if (word.isHorizontal) {
            for (let i: number = 0; i < word.length; i++) {
                value += this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x + i]._char._value;
            }
        } else {
            for (let i: number = 0; i < word.length; i++) {
                value += this.configurationService.grid.boxes[word.startPosition.y + i][word.startPosition.x]._char._value;
            }
        }

        return value;
    }

    public getGridBoxID(gridBox: CommonGridBox): number {
        if (gridBox._constraints[0] !== undefined) {
            if (gridBox._constraints[1] !== undefined) {
                if (this.isStartingBox(gridBox, 1)) {
                    return gridBox._constraints[1].definitionID;
                }
            }
            if (this.isStartingBox(gridBox, 0)) {
                return gridBox._constraints[0].definitionID;
            }
        }

        return undefined;
    }

    private isStartingBox(gridBox: CommonGridBox, index: number): boolean {
        return gridBox._id.x === gridBox._constraints[index].startPosition.x
            && gridBox._id.y === gridBox._constraints[index].startPosition.y;
    }

    public isCompletedWord(word: CommonWord, wordEntered: string): boolean {
        return this.getWordValue(word) === wordEntered;
    }

    public addToScore(word: CommonWord): void {
        word._isComplete = true;
        this.correctWordCount++;
    }

    public getFirstLetter(): void {

    }

}
