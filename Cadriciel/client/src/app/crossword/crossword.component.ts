import { Component, HostListener } from "@angular/core";
import { CommonGridBox } from "../../../../common/crossword/commonGridBox";
import { CommonWord } from "../../../../common/crossword/commonWord";
import { ConfigurationService } from "./configuration/configuration.service";
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
    public isInCheatMode: boolean;
    private _hasSubscribed: boolean;

    public constructor(
        public configurationService: ConfigurationService, private multiplayerCommunicationService: MultiplayerCommunicationService) {
        this.isInCheatMode = false;
        this._hasSubscribed = false;
    }

    public subscribeToMessages(): void {
        this.multiplayerCommunicationService.getMessagesCrosswordComponent().subscribe((message: string) => {
            if (message === SocketEvents.PlayerUpdate) {
                this.configurationService.updateOtherPlayer(this.multiplayerCommunicationService.updatedPlayer);
                this.updateInputCharInBoxes();
                this.setInputBox();
            }
        });
    }

    public isConfigurationDone(): boolean {
        if (!this._hasSubscribed && this.multiplayerCommunicationService.isSocketDefined) {
            this.subscribeToMessages();
            this._hasSubscribed = true;
        }
        if (this.configurationService.configurationDone && this.configurationService.currentPlayer.foundWords === undefined) {
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
        if (this.foundListContainsWord(word)) {
            return State.FOUND;
        }
        if (this.wordEqualsWord(this.configurationService.currentPlayer.selectedWord, word)) {
            return State.SELECTED;
        }

        return State.FREE;
    }

    public setSelectedWordOfBox(gridBox: CommonGridBox): void {
        if (gridBox.constraints[0] !== undefined) {
            this.setSelectedWord(this.findEquivalent(gridBox.constraints[0]));
        }
    }

    public setSelectedWord(word: CommonWord): void {
        this.configurationService.currentPlayer.selectedWord = word;
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
            if (this.configurationService.currentPlayer.selectedWord === word ||
                this.listContainsWord(this.configurationService.currentPlayer.foundWords, word)) {
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
            if (this.listContainsBox(this.configurationService.currentPlayer.selectedBoxes, box) && !this.foundListContainsBox(box)) {
                return this.configurationService.currentPlayer.color;
            } else if (this.listContainsBox(this.configurationService.otherPlayer.selectedBoxes, box) && !this.foundListContainsBox(box)) {
                return this.configurationService.otherPlayer.color;
            } else {
                return "black";
            }
        } else {
            if (this.listContainsBox(this.configurationService.currentPlayer.selectedBoxes, box) && !this.foundListContainsBox(box)) {
                return this.configurationService.currentPlayer.color;
            } else {
                return "black";
            }
        }
    }

    public resetInputBox(): void {
        this.inputGridBox = undefined;
        this.configurationService.currentPlayer.selectedWord = undefined;
        this.updateGrid();
    }

    private updateGrid(): void {
        this.resetGrid();
        this.setSelectedBoxes(this.configurationService.currentPlayer.selectedWord);
        this.setFoundBoxes();
        this.setInputBox();
        this.multiplayerCommunicationService.playerUpdate(this.configurationService.currentPlayer);
    }

    private resetGrid(): void {
        if (this.configurationService.grid !== undefined && this.configurationService.configurationDone) {
            this.configurationService.currentPlayer.selectedBoxes = [];
        }
    }

    private setSelectedBoxes(word: CommonWord): void {
        if (word !== undefined) {
            for (let i: number = 0; i < word.length; i++) {
                word.isHorizontal ?
                    this.configurationService.currentPlayer.selectedBoxes.push(
                        this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x + i]
                    ) :
                    this.configurationService.currentPlayer.selectedBoxes.push(
                        this.configurationService.grid.boxes[word.startPosition.y + i][word.startPosition.x]
                    );
            }
        }
    }

    private setFoundBoxes(): void {
        for (const word of this.configurationService.currentPlayer.foundWords) {
            for (let i: number = 0; i < word.length; i++) {
                let box: CommonGridBox;
                word.isHorizontal ?
                    box = this.configurationService.grid.boxes[word.startPosition.y][word.startPosition.x + i] :
                    box = this.configurationService.grid.boxes[word.startPosition.y + i][word.startPosition.x];
                this.configurationService.currentPlayer.foundBoxes.push(box);
            }
        }
    }

    private setInputBox(): void {
        if (this.configurationService.currentPlayer.selectedWord !== undefined &&
            !this.foundListContainsWord(this.configurationService.currentPlayer.selectedWord)) {
            if (this.foundListContainsBox(this.configurationService.grid.boxes[this.getY()][this.getX()])) {
                this.goToNextAvailableBox();
                this.setInputBox();
            } else {
                this.inputGridBox = this.configurationService.grid.boxes[this.getY()][this.getX()];
            }
        }
    }

    private updateInputCharInBoxes(): void {
        if (this.configurationService.isTwoPlayerGame) {
            for (const line of this.configurationService.grid.boxes) {
                for (const box1 of line) {
                    for (const box2 of this.configurationService.otherPlayer.foundBoxes) {
                        if (box1.id.x === box2.id.x && box1.id.y === box2.id.y) {
                            box1.inputChar = box2.inputChar;
                        }
                    }
                }
            }
        }
    }

    private isStartingBox(gridBox: CommonGridBox, index: number): boolean {
        return gridBox.id.x === gridBox.constraints[index].startPosition.x
            && gridBox.id.y === gridBox.constraints[index].startPosition.y;
    }

    private addToScore(): void {
        this.configurationService.currentPlayer.score++;
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
        if (wordValue === this.getWordValue(word) && !this.foundListContainsWord(word)) {
            this.configurationService.currentPlayer.foundWords.push(word);
            this.addToScore();
            this.setFoundBoxes();
            if (this.wordEqualsWord(this.configurationService.currentPlayer.selectedWord, word)) {
                this.resetInputBox();
            }
        }

        return word;
    }

    @HostListener("window:keydown", ["$event"])
    public inputChar(event: KeyboardEvent): void {
        if (this.configurationService.configurationDone && this.configurationService.grid !== undefined) {
            if (this.inputGridBox !== undefined && !this.foundListContainsWord(this.configurationService.currentPlayer.selectedWord)) {
                if (event.key.match(/^[a-z]$/i) !== null) {
                    this.enterNextCharacter(event.key.toUpperCase());
                    this.setInputBox();
                }
                if (event.keyCode === BACKSPACE_KEYCODE) {
                    this.eraseLastCharacter();
                    this.setInputBox();
                }
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
        if (this.foundListContainsBox(this.configurationService.grid.boxes[this.getY()][this.getX()])) {
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
        if (this.foundListContainsBox(this.configurationService.grid.boxes[this.getY()][this.getX()])) {
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

    private foundListContainsWord(word: CommonWord): boolean {
        let contains: boolean = false;
        contains = this.listContainsWord(this.configurationService.currentPlayer.foundWords, word);
        if (!contains && this.configurationService.isTwoPlayerGame) {
            contains = this.listContainsWord(this.configurationService.otherPlayer.foundWords, word);
        }

        return contains;
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

    private foundListContainsBox(box: CommonGridBox): boolean {
        for (const box1 of this.configurationService.currentPlayer.foundBoxes) {
            if (box1.id.x === box.id.x && box1.id.y === box.id.y) {
                return true;
            }
        }
        if (this.configurationService.isTwoPlayerGame) {
            for (const box1 of this.configurationService.otherPlayer.foundBoxes) {
                if (box1.id.x === box.id.x && box1.id.y === box.id.y) {
                    return true;
                }
            }
        }

        return false;
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
