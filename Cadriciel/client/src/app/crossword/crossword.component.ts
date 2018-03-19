import { Component, HostListener } from "@angular/core";
import { CommonGridBox } from "../../../../common/crossword/commonGridBox";
import { CommonWord } from "../../../../common/crossword/commonWord";
import { ConfigurationService } from "./configuration.service";

const BACKSPACE_KEYCODE: number = 8;

@Component({
    selector: "app-crossword",
    templateUrl: "./crossword.component.html",
    styleUrls: ["./crossword.component.css"]
})
export class CrosswordComponent {

    public selectedGridBox: CommonGridBox;
    public selectedWord: CommonWord;
    public correctWordCount: number = 0;
    public isInCheatMode: boolean = false;

    public constructor(
        public configurationService: ConfigurationService) {
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
            if (this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x].isColored &&
                this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x + 1].isColored) {
                return true;
            }

            return false;
        } else {
            if (this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x].isColored &&
                this.configurationService.grid.boxes[word.startPosition.y + 1][word.startPosition.x].isColored) {
                return true;
            }

            return false;
        }
    }

    public highlightWordOfBox(gridBox: CommonGridBox): void {
        if (gridBox.constraints[0] !== undefined) {
            this.highlightWord((gridBox as CommonGridBox).constraints[0]);
        }
    }

    public highlightWord(word: CommonWord): void {
        if (!word.isComplete) {
            this.deselectWords();
            if (word.isHorizontal) {
                for (let i: number = 0; i < word.length; i++) {
                    this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x + i].isColored = true;
                }
            } else {
                for (let i: number = 0; i < word.length; i++) {
                    this.configurationService.grid.boxes[word.startPosition.y + i][word.startPosition.x].isColored = true;
                }
            }
        }
    }

    public deselectWords(): void {
        if (this.configurationService.grid !== undefined) {
            for (const line of this.configurationService.grid.boxes) {
                for (const box of line) {
                    box.isColored = false;
                }
            }
            this.resetInputBoxes();
        }
    }

    public getWordValue(word: CommonWord): string {
        let value: string = "";
        if (word.isHorizontal) {
            for (let i: number = 0; i < word.length; i++) {
                value += this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x + i].char.value;
            }
        } else {
            for (let i: number = 0; i < word.length; i++) {
                value += this.configurationService.grid.boxes[word.startPosition.y + i][word.startPosition.x].char.value;
            }
        }

        return value;
    }

    public getGridBoxID(gridBox: CommonGridBox): number {
        if (gridBox.constraints[0] !== undefined) {
            if (gridBox.constraints[1] !== undefined) {
                if (this.isStartingBox(gridBox, 1)) {
                    return gridBox.constraints[1].definitionID;
                }
            }
            if (this.isStartingBox(gridBox, 0)) {
                return gridBox.constraints[0].definitionID;
            }
        }

        return undefined;
    }

    private isStartingBox(gridBox: CommonGridBox, index: number): boolean {
        return gridBox.id.x === gridBox.constraints[index].startPosition.x
            && gridBox.id.y === gridBox.constraints[index].startPosition.y;
    }

    public isCompletedWord(word: CommonWord, wordEntered: string): boolean {
        return this.getWordValue(word) === wordEntered;
    }

    public addToScore(word: CommonWord): void {
        this.correctWordCount++;
    }

    public setInputOnFirstBox(gridBox: CommonGridBox): void {
        if (!gridBox.isBlack) {
            this.setInputOnWord(gridBox.constraints[0]);
        }
    }

    public setInputOnWord(word: CommonWord): void {
        word = this.verifyCompletedWord(word);
        this.selectedWord = word;
        this.resetInputBoxes();
        if (!word.isComplete) {
            if (word.isHorizontal) {
                this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x + this.selectedWord.enteredCharacters]
                    .readyForInput = true;
            } else {
                this.configurationService.grid.boxes[word.startPosition.y + this.selectedWord.enteredCharacters][word.startPosition.x]
                    .readyForInput = true;
            }
        }
    }

    public resetInputBoxes(): void {
        for (const line of this.configurationService.grid.boxes) {
            for (const box of line) {
                box.readyForInput = false;
            }
        }
    }

    public colorFoundBoxes(word: CommonWord): void {
        if (word.isHorizontal) {
            for (let i: number = 0; i < word.length; i++) {
                this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x + i].isFound = true;
            }
        } else {
            for (let i: number = 0; i < word.length; i++) {
                this.configurationService.grid.boxes[word.startPosition.y + i][word.startPosition.x].isFound = true;
            }
        }
    }

    public verifyCompletedWord(word: CommonWord): CommonWord {
        let wordValue: string = "";
        for (let i: number = 0; i < word.length; i++) {
            if (word.isHorizontal) {
                if (this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x + i].inputChar.value
                    !== undefined) {
                    wordValue += this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x + i].inputChar.value;
                }
            } else {
                if (this.configurationService.grid.boxes[word.startPosition.y + i][word.startPosition.x].inputChar.value
                    !== undefined) {
                    wordValue += this.configurationService.grid.boxes[word.startPosition.y + i][word.startPosition.x].inputChar.value;
                }
            }
        }
        if (wordValue === this.getWordValue(word)) {
            word.isComplete = true;
            this.addToScore(word);
            this.colorFoundBoxes(word);
        }

        return word;
    }

    @HostListener("window:keydown", ["$event"])
    public inputChar(event: KeyboardEvent): void {
        let gridBox: CommonGridBox;
        if (this.configurationService.grid !== undefined) {
            for (const line of this.configurationService.grid.boxes) {
                for (const box of line) {
                    if (box.readyForInput) {
                        gridBox = box;
                    }
                }
            }
        }
        if (gridBox !== undefined && !this.selectedWord.isComplete) {
            if (event.key.match(/^[a-z]$/i) !== null) {
                gridBox.inputChar.value = event.key.toUpperCase();
                this.selectedWord.enteredCharacters + 1 === this.selectedWord.length ?
                    this.selectedWord.enteredCharacters = 0 :
                    this.selectedWord.enteredCharacters++;
                this.setInputOnWord(this.selectedWord);
            }
            if (event.keyCode === BACKSPACE_KEYCODE) {
                this.eraseLastCharacter();
                this.setInputOnWord(this.selectedWord);
            }
        } else {
            this.deselectWords();
        }
    }

    private eraseLastCharacter(): void {
        if (this.selectedWord.enteredCharacters > 0) {
            this.selectedWord.enteredCharacters--;
        }
        if (this.selectedWord.isHorizontal) {
            this.configurationService.grid.boxes[
                this.selectedWord.startPosition.y][
                this.selectedWord.startPosition.x + this.selectedWord.enteredCharacters]
                .inputChar.value = "";
        } else {
            this.configurationService.grid.boxes[
                this.selectedWord.startPosition.y + this.selectedWord.enteredCharacters][
                this.selectedWord.startPosition.x]
                .inputChar.value = "";
        }
    }
}
