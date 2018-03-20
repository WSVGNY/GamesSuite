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
        this.configurationService.currentPlayer.selectedWord = word;
        //TODO: Envoie a l'autre joueur
        if (!this.configurationService.currentPlayer.selectedWord.isComplete) {
            this.deselectWords();
            if (this.configurationService.currentPlayer.selectedWord.isHorizontal) {
                for (let i: number = 0; i < this.configurationService.currentPlayer.selectedWord.length; i++) {
                    this.configurationService.grid.boxes[this.configurationService.currentPlayer.selectedWord.startPosition.y]
                    [this.configurationService.currentPlayer.selectedWord.startPosition.x + i].isColored = true;
                }
            } else {
                for (let i: number = 0; i < this.configurationService.currentPlayer.selectedWord.length; i++) {
                    this.configurationService.grid.boxes[this.configurationService.currentPlayer.selectedWord.startPosition.y + i]
                    [this.configurationService.currentPlayer.selectedWord.startPosition.x].isColored = true;
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

    private addToScore(word: CommonWord): void {
        this.configurationService.currentPlayer.score++;
        //TODO: Envoie a l'autre joueur
    }

    public setInputOnFirstBox(gridBox: CommonGridBox): void {
        if (!gridBox.isBlack) {
            this.setInputOnWord(this.findEquivalent(gridBox.constraints[0]));
        }
    }

    public getMySelectedGridBox(): CommonGridBox {
        return this.configurationService.currentPlayer.selectedGridBox;
    }

    public setInputOnWord(word: CommonWord): void {
        word = this.verifyCompletedWord(word);
        this.configurationService.currentPlayer.selectedWord = word;
        //TODO: Envoie a l'autre joueur
        this.resetInputBoxes();
        if (!word.isComplete) {
            if (this.configurationService.grid.boxes[this.getY()][this.getX()].isFound) {
                this.configurationService.currentPlayer.selectedWord.enteredCharacters++;
                this.setInputOnWord(word);
            } else {
                this.configurationService.currentPlayer.selectedGridBox = this.configurationService.grid.boxes[this.getY()][this.getX()];
                //TODO: Envoie a l'autre joueur
            }
        }
    }

    private resetInputBoxes(): void {
        this.configurationService.currentPlayer.selectedGridBox = undefined;
        //TODO: Envoie a l'autre joueur
    }

    private colorFoundBoxes(word: CommonWord): void {
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

    private verifyCompletedWords(): void {
        for (const word of this.configurationService.grid.words) {
            this.verifyCompletedWord(word);
        }
    }

    private verifyCompletedWord(word: CommonWord): CommonWord {
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
        if (this.configurationService.grid !== undefined) {
            if (this.configurationService.currentPlayer.selectedGridBox !== undefined &&
                !this.configurationService.currentPlayer.selectedWord.isComplete) {
                if (event.key.match(/^[a-z]$/i) !== null) {
                    this.enterNextCharacter(event.key.toUpperCase());
                    this.setInputOnWord(this.configurationService.currentPlayer.selectedWord);
                }
                if (event.keyCode === BACKSPACE_KEYCODE) {
                    this.eraseLastCharacter();
                    this.setInputOnWord(this.configurationService.currentPlayer.selectedWord);
                }
            } else {
                this.deselectWords();
            }
            this.verifyCompletedWords();
        }
    }

    private enterNextCharacter(char: string): void {
        this.configurationService.grid.boxes[this.getY()][this.getX()].inputChar.value = char;
        this.goToNextAvailableBox();
    }

    private goToNextAvailableBox(): void {
        this.configurationService.currentPlayer.selectedWord.enteredCharacters + 1 <
            this.configurationService.currentPlayer.selectedWord.length ?
            this.configurationService.currentPlayer.selectedWord.enteredCharacters++ :
            this.configurationService.currentPlayer.selectedWord.enteredCharacters = 0;
        if (this.configurationService.grid.boxes[this.getY()][this.getX()].isFound) {
            this.goToNextAvailableBox();
        }
    }

    private eraseLastCharacter(): void {
        this.goBackOneCharacter();
        this.configurationService.grid.boxes[this.getY()][this.getX()].inputChar.value = "";
    }

    private goBackOneCharacter(): void {
        this.configurationService.currentPlayer.selectedWord.enteredCharacters > 0 ?
            this.configurationService.currentPlayer.selectedWord.enteredCharacters-- :
            this.configurationService.currentPlayer.selectedWord.enteredCharacters =
            this.configurationService.currentPlayer.selectedWord.length - 1;
        if (this.configurationService.grid.boxes[this.getY()][this.getX()].isFound) {
            this.goBackOneCharacter();
        }
    }

    private getX(): number {
        return this.configurationService.currentPlayer.selectedWord.isHorizontal ?
            this.configurationService.currentPlayer.selectedWord.startPosition.x +
            this.configurationService.currentPlayer.selectedWord.enteredCharacters :
            this.configurationService.currentPlayer.selectedWord.startPosition.x;
    }

    private getY(): number {
        return this.configurationService.currentPlayer.selectedWord.isHorizontal ?
            this.configurationService.currentPlayer.selectedWord.startPosition.y :
            this.configurationService.currentPlayer.selectedWord.startPosition.y +
            this.configurationService.currentPlayer.selectedWord.enteredCharacters;
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
