import { Component, HostListener } from "@angular/core";
import { CommonGridBox } from "../../../../common/crossword/commonGridBox";
import { CommonWord } from "../../../../common/crossword/commonWord";
import { ConfigurationService } from "./configuration.service";

const BACKSPACE_KEYCODE: number = 8;

enum State {
    FREE = 0,
    SELECTED,
    FOUND
}

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

    public getState(word: CommonWord): State {
        if (word.isComplete) {
            return State.FOUND;
        }

        if (word.isHorizontal) {
            if (this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x].isColored &&
                this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x + 1].isColored) {
                return State.SELECTED;
            }

            return State.FREE;
        } else {
            if (this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x].isColored &&
                this.configurationService.grid.boxes[word.startPosition.y + 1][word.startPosition.x].isColored) {
                return State.SELECTED;
            }

            return State.FREE;
        }
    }

    public highlightWordOfBox(gridBox: CommonGridBox): void {
        if (gridBox.constraints[0] !== undefined) {
            this.highlightWord(this.findEquivalent(gridBox.constraints[0]));
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
            this.setInputOnWord(this.findEquivalent(gridBox.constraints[0]));
        }
    }

    public setInputOnWord(word: CommonWord): void {
        word = this.verifyCompletedWord(word);
        this.selectedWord = word;
        this.resetInputBoxes();
        if (!word.isComplete) {
            let x: number;
            let y: number;
            if (word.isHorizontal) {
                x = word.startPosition.x + this.selectedWord.enteredCharacters;
                y = word.startPosition.y;
            } else {
                x = word.startPosition.x;
                y = word.startPosition.y + this.selectedWord.enteredCharacters;
            }
            if (this.configurationService.grid.boxes[y][x].isFound) {
                this.selectedWord.enteredCharacters++;
                this.setInputOnWord(word);
            } else {
                this.configurationService.grid.boxes[y][x].readyForInput = true;
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
        word.isComplete = true;
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
        if (wordValue === this.getWordValue(word) && !word.isComplete) {
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
        for (const word of this.configurationService.grid.words) {
            this.verifyCompletedWord(word);
        }
    }

    private eraseLastCharacter(): void {
        this.configurationService.grid.boxes[this.getY()][this.getX()].inputChar.value = "";
        if (this.selectedWord.enteredCharacters > 0) {
            this.selectedWord.enteredCharacters--;
        } else {
            this.selectedWord.enteredCharacters = this.selectedWord.length - 1;
        }
        while (this.configurationService.grid.boxes[this.getY()][this.getX()].isFound) {
            this.selectedWord.enteredCharacters--;
        }
        this.configurationService.grid.boxes[this.getY()][this.getX()].inputChar.value = "";
    }

    private getX(): number {
        if (this.selectedWord.isHorizontal) {
            return this.selectedWord.startPosition.x + this.selectedWord.enteredCharacters;
        } else {
            return this.selectedWord.startPosition.x;
        }
    }

    private getY(): number {
        if (this.selectedWord.isHorizontal) {
            return this.selectedWord.startPosition.y;
        } else {
            return this.selectedWord.startPosition.y + this.selectedWord.enteredCharacters;
        }
    }

    private findEquivalent(badWord: CommonWord): CommonWord {
        for (const word of this.configurationService.grid.words) {
            if (this.getWordValue(word) === this.getWordValue(badWord)) {
                return word;
            }
        }

        return undefined;
    }
}
