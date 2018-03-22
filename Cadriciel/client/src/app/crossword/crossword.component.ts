import { Component, HostListener } from "@angular/core";
import { CommonGridBox } from "../../../../common/crossword/commonGridBox";
import { CommonWord } from "../../../../common/crossword/commonWord";
import { ConfigurationService } from "./configuration.service";
import { MultiplayerCommunicationService } from "./multiplayer-communication.service";
import { SocketEvents } from "../../../../common/communication/socketEvents";

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

    public inputGridBox: CommonGridBox;
    public isInCheatMode: boolean = false;
    private _hasSubscribed: boolean = false;

    public constructor(
        public configurationService: ConfigurationService, private multiplayerCommunicationService: MultiplayerCommunicationService) {

    }

    public subscribeToMessages(): void {
        this.multiplayerCommunicationService.getMessagesCrosswordComponent().subscribe((message: string) => {
            console.log(message);
            if (message === SocketEvents.PlayerUpdate) {
                this.configurationService.updateOtherPlayer(this.multiplayerCommunicationService.updatedPlayer);
                // console.log(this.configurationService.otherPlayer.color);
                // console.log(this.configurationService.otherPlayer.selectedBoxes);
                // console.log(this.configurationService.otherPlayer.selectedWord);
                // console.log(this.configurationService.otherPlayer.foundBoxes);
                // console.log(this.configurationService.otherPlayer.foundWords);
                this.updateGrid();
            }
        });
    }

    public isConfigurationDone(): boolean {
        if (!this._hasSubscribed && this.multiplayerCommunicationService.isSocketDefined) {
            this.subscribeToMessages();
            this._hasSubscribed = true;
        }
        if (this.configurationService.configurationDone && this.configurationService.currentPlayer.foundBoxes === undefined) {
            this.configurationService.currentPlayer.foundBoxes = [];
            this.configurationService.currentPlayer.foundWords = [];
            this.configurationService.currentPlayer.selectedBoxes = [];
            if (this.configurationService.isTwoPlayerGame) {
                this.configurationService.otherPlayer.foundBoxes = [];
                this.configurationService.otherPlayer.foundWords = [];
                this.configurationService.otherPlayer.selectedBoxes = [];
            }
        }

        return this.configurationService.configurationDone;
    }

    public getMySelectedGridBox(): CommonGridBox {
        return this.inputGridBox;
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

    public setSelectedWordOfBox(gridBox: CommonGridBox): void {
        if (gridBox.constraints[0] !== undefined) {
            this.setSelectedWord(this.findEquivalent(gridBox.constraints[0]));
        }
    }

    public setSelectedWord(word: CommonWord): void {
        this.configurationService.currentPlayer.selectedWord = word;
        this.multiplayerCommunicationService.playerUpdate(this.configurationService.currentPlayer);
        this.updateGrid();
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

    public getPlayerColorForDefinition(word: CommonWord): string {
        if (this.configurationService.isTwoPlayerGame) {
            if (this.wordEqualsWord(this.configurationService.currentPlayer.selectedWord, word)
                || this.listContainsWord(this.configurationService.currentPlayer.foundWords, word)) {
                return this.configurationService.currentPlayer.color;
            } else if (this.wordEqualsWord(this.configurationService.otherPlayer.selectedWord, word)
                || this.listContainsWord(this.configurationService.otherPlayer.foundWords, word)) {
                return this.configurationService.otherPlayer.color;
            } else {
                return "transparent";
            }
        } else {
            if (this.configurationService.currentPlayer.selectedWord === word || word.isComplete) {
                return this.configurationService.currentPlayer.color;
            } else {
                return "transparent";
            }
        }
    }

    public getPlayerColorForBox(box: CommonGridBox): string {
        if (box.isBlack) {
            return "black";
        } else {
            if (this.listContainsBox(this.configurationService.currentPlayer.foundBoxes, box)) {
                return this.configurationService.currentPlayer.color;
            }
            if (this.configurationService.isTwoPlayerGame) {
                if (this.listContainsBox(this.configurationService.otherPlayer.foundBoxes, box)) {
                    return this.configurationService.otherPlayer.color;
                }
            }
        }

        return "white";
    }

    public getPlayerBorderColorForBox(box: CommonGridBox): string {
        if (this.configurationService.isTwoPlayerGame) {
            if (this.listContainsBox(this.configurationService.currentPlayer.selectedBoxes, box)) {
                return this.configurationService.currentPlayer.color;
            } else if (this.listContainsBox(this.configurationService.otherPlayer.selectedBoxes, box)) {
                return this.configurationService.otherPlayer.color;
            } else {
                return "black";
            }
        } else {
            if (box.isColored && !box.isFound) {
                return this.configurationService.currentPlayer.color;
            } else {
                return "black";
            }
        }
    }

    public resetInputBox(): void {
        this.inputGridBox = undefined;
        this.configurationService.currentPlayer.selectedWord = undefined;
    }

    private updateGrid(): void {
        this.resetGrid();
        this.updateCompletedWords();
        this.highlightWords();
        this.darkenFoundWords();
        this.setInputBox();
    }

    private resetGrid(): void {
        if (this.configurationService.grid !== undefined && this.configurationService.configurationDone) {
            for (const line of this.configurationService.grid.boxes) {
                for (const box of line) {
                    box.isColored = false;
                    box.isFound = false;
                }
            }
            this.configurationService.currentPlayer.selectedBoxes = [];
            this.configurationService.currentPlayer.foundBoxes = [];
        }
    }

    private updateCompletedWords(): void {
        for (const word of this.configurationService.grid.words) {
            if (this.listContainsWord(this.configurationService.currentPlayer.foundWords, word)) {
                word.isComplete = true;
            }
            if (this.configurationService.isTwoPlayerGame) {
                if (this.listContainsWord(this.configurationService.otherPlayer.foundWords, word)) {
                    word.isComplete = true;
                }
            }
        }
    }

    private highlightWords(): void {
        for (const word of this.configurationService.grid.words) {
            if (!word.isComplete) {
                if (this.configurationService.currentPlayer.selectedWord === word) {
                    this.highlightWord(word);
                }
                if (this.configurationService.isTwoPlayerGame) {
                    if (this.configurationService.otherPlayer.selectedWord === word) {
                        this.highlightWord(word);
                    }
                }
            }
        }
    }

    private highlightWord(word: CommonWord): void {
        if (word.isHorizontal) {
            for (let i: number = 0; i < word.length; i++) {
                this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x + i].isColored = true;
                this.configurationService.currentPlayer.selectedBoxes.push(
                    this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x + i]
                );
            }
        } else {
            for (let i: number = 0; i < word.length; i++) {
                this.configurationService.grid.boxes[word.startPosition.y + i][word.startPosition.x].isColored = true;
                this.configurationService.currentPlayer.selectedBoxes.push(
                    this.configurationService.grid.boxes[word.startPosition.y + i][word.startPosition.x]
                );
            }
        }
    }

    private darkenFoundWords(): void {
        for (const word of this.configurationService.grid.words) {
            if (word.isComplete) {
                if (this.listContainsWord(this.configurationService.currentPlayer.foundWords, word)) {
                    this.setFoundBoxes(word);
                }
                if (this.configurationService.isTwoPlayerGame) {
                    if (this.listContainsWord(this.configurationService.otherPlayer.foundWords, word)) {
                        this.setFoundBoxes(word);
                    }
                }
            }
        }
    }

    private setFoundBoxes(word: CommonWord): void {
        for (let i: number = 0; i < word.length; i++) {
            let box: CommonGridBox;
            word.isHorizontal ?
                box = this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x + i] :
                box = this.configurationService.grid.boxes[word.startPosition.y + i][word.startPosition.x];
            box.isFound = true;
            this.configurationService.currentPlayer.foundBoxes.push(box);
        }
        word.isComplete = true;
    }

    private setInputBox(): void {
        if (this.configurationService.currentPlayer.selectedWord !== undefined) {
            if (this.configurationService.grid.boxes[this.getY()][this.getX()].isFound) {
                this.configurationService.currentPlayer.selectedWord.enteredCharacters++;
                this.setInputBox();
            } else {
                this.inputGridBox = this.configurationService.grid.boxes[this.getY()][this.getX()];
            }
        }
    }

    private isStartingBox(gridBox: CommonGridBox, index: number): boolean {
        return gridBox.id.x === gridBox.constraints[index].startPosition.x
            && gridBox.id.y === gridBox.constraints[index].startPosition.y;
    }

    private addToScore(word: CommonWord): void {
        this.configurationService.currentPlayer.score++;
        this.multiplayerCommunicationService.playerUpdate(this.configurationService.currentPlayer);
        this.updateGrid();
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
            this.configurationService.currentPlayer.foundWords.push(word);
            this.addToScore(word);
            this.setFoundBoxes(word);
        }

        return word;
    }

    @HostListener("window:keydown", ["$event"])
    public inputChar(event: KeyboardEvent): void {
        if (this.configurationService.grid !== undefined) {
            if (this.inputGridBox !== undefined &&
                !this.configurationService.currentPlayer.selectedWord.isComplete) {
                if (event.key.match(/^[a-z]$/i) !== null) {
                    this.enterNextCharacter(event.key.toUpperCase());
                    this.setInputBox();
                }
                if (event.keyCode === BACKSPACE_KEYCODE) {
                    this.eraseLastCharacter();
                    this.setInputBox();
                }
            } else {
                this.resetInputBox();
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

    private listContainsWord(words: CommonWord[], word: CommonWord): boolean {
        for (const word1 of words) {
            if (word1.id === word.id) {
                return true;
            }
        }

        return false;
    }

    private wordEqualsWord(word1: CommonWord, word2: CommonWord): boolean {
        if (word1 === undefined || word2 === undefined) {
            return false;
        } else if (word1.id === word2.id) {
            return true;
        } else {
            return false;
        }
    }

    private listContainsBox(boxes: CommonGridBox[], box: CommonGridBox): boolean {
        for (const box1 of boxes) {
            if (box1.id.x === box.id.x && box1.id.y === box.id.y) {
                return true;
            }
        }

        return false;
    }
}
