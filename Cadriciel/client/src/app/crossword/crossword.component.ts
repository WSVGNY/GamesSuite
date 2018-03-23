import { Component, HostListener } from "@angular/core";
import { CommonGridBox } from "../../../../common/crossword/commonGridBox";
import { CommonWord } from "../../../../common/crossword/commonWord";
import { ConfigurationService } from "./configuration/configuration.service";
import { MultiplayerCommunicationService } from "./multiplayer-communication.service";
import { SocketEvents } from "../../../../common/communication/socketEvents";
import { ListChecker } from "./listChecker";
import { Comparator } from "./comparator";
import { Updater } from "./updater";

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
        public configuration: ConfigurationService, private multiplayerCommunicationService: MultiplayerCommunicationService) {

    }

    public subscribeToMessages(): void {
        this.multiplayerCommunicationService.getMessagesCrosswordComponent().subscribe((message: string) => {
            if (message === SocketEvents.PlayerUpdate) {
                this.configuration.updateOtherPlayer(this.multiplayerCommunicationService.updatedPlayer);
                Updater.updateInputCharInBoxes(this.configuration);
                this.inputGridBox = Updater.setInputBox(this.configuration, this.inputGridBox);
            }
        });
    }

    public isConfigurationDone(): boolean {
        if (!this._hasSubscribed && this.multiplayerCommunicationService.isSocketDefined) {
            this.subscribeToMessages();
            this._hasSubscribed = true;
        }
        if (this.configuration.configurationDone && this.configuration.currentPlayer.foundWords === undefined) {
            ListChecker.setConfiguration(this.configuration);
            this.configuration.currentPlayer.foundBoxes = [];
            this.configuration.currentPlayer.foundWords = [];
            this.configuration.currentPlayer.selectedBoxes = [];
            if (this.configuration.isTwoPlayerGame) {
                this.configuration.otherPlayer.foundBoxes = [];
                this.configuration.otherPlayer.foundWords = [];
                this.configuration.otherPlayer.selectedBoxes = [];
            }
        }

        return this.configuration.configurationDone;
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
        if (ListChecker.playersFoundWord(word)) {
            return State.FOUND;
        }
        if (Comparator.compareWords(this.configuration.currentPlayer.selectedWord, word)) {
            return State.SELECTED;
        }

        return State.FREE;
    }

    public setSelectedWordOfBox(gridBox: CommonGridBox): void {
        if (gridBox.constraints[0] !== undefined) {
            this.setSelectedWord(Comparator.findEquivalent(gridBox.constraints[0], this.configuration));
        }
    }

    public setSelectedWord(word: CommonWord): void {
        if (!ListChecker.playersFoundWord(word)) {
            this.configuration.currentPlayer.selectedWord = word;
        }
        this.updateGrid();
    }

    public getWordValue(word: CommonWord): string {
        let value: string = "";
        if (word.isHorizontal) {
            for (let i: number = 0; i < word.length; i++) {
                value += this.configuration.grid.boxes[word.startPosition.y][word.startPosition.x + i].char.value;
            }
        } else {
            for (let i: number = 0; i < word.length; i++) {
                value += this.configuration.grid.boxes[word.startPosition.y + i][word.startPosition.x].char.value;
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
        if (this.configuration.isTwoPlayerGame) {
            if (Comparator.compareWords(this.configuration.currentPlayer.selectedWord, word)
                || ListChecker.listContainsWord(this.configuration.currentPlayer.foundWords, word)) {
                return this.configuration.currentPlayer.color;
            } else if (Comparator.compareWords(this.configuration.otherPlayer.selectedWord, word)
                || ListChecker.listContainsWord(this.configuration.otherPlayer.foundWords, word)) {
                return this.configuration.otherPlayer.color;
            } else {
                return "transparent";
            }
        } else {
            if (this.configuration.currentPlayer.selectedWord === word ||
                ListChecker.listContainsWord(this.configuration.currentPlayer.foundWords, word)) {
                return this.configuration.currentPlayer.color;
            } else {
                return "transparent";
            }
        }
    }

    public getPlayerColorForBox(box: CommonGridBox): string {
        if (box.isBlack) {
            return "black";
        } else {
            if (this.configuration.isTwoPlayerGame) {
                if (ListChecker.listContainsBox(this.configuration.currentPlayer.foundBoxes, box) &&
                    ListChecker.listContainsBox(this.configuration.otherPlayer.foundBoxes, box)) {
                    return "repeating-linear-gradient(45deg, " + this.configuration.currentPlayer.color +
                        ", " + this.configuration.otherPlayer.color + " 25px)";
                }
            }
            if (ListChecker.listContainsBox(this.configuration.currentPlayer.foundBoxes, box)) {
                return this.configuration.currentPlayer.color;
            }
            if (this.configuration.isTwoPlayerGame) {
                if (ListChecker.listContainsBox(this.configuration.otherPlayer.foundBoxes, box)) {
                    return this.configuration.otherPlayer.color;
                }
            }
        }

        return "white";
    }

    public getPlayerBorderColorForBox(box: CommonGridBox): string {
        if (this.configuration.isTwoPlayerGame) {
            if (ListChecker.listContainsBox(this.configuration.currentPlayer.selectedBoxes, box) && !ListChecker.playersFoundBox(box)) {
                return this.configuration.currentPlayer.color;
            } else if (ListChecker.listContainsBox(this.configuration.otherPlayer.selectedBoxes, box) &&
                !ListChecker.playersFoundBox(box)) {
                return this.configuration.otherPlayer.color;
            } else {
                return "black";
            }
        } else {
            if (ListChecker.listContainsBox(this.configuration.currentPlayer.selectedBoxes, box) &&
                !ListChecker.playersFoundBox(box)) {
                return this.configuration.currentPlayer.color;
            } else {
                return "black";
            }
        }
    }

    public getPlayerOutlineColor(box: CommonGridBox): string {
        if (this.configuration.isTwoPlayerGame) {
            if (ListChecker.listContainsBox(this.configuration.currentPlayer.selectedBoxes, box) && !ListChecker.playersFoundBox(box) &&
                ListChecker.listContainsBox(this.configuration.otherPlayer.selectedBoxes, box) && !ListChecker.playersFoundBox(box)) {
                return "4px dashed " + this.configuration.otherPlayer.color;
            }
        }

        return "";
    }

    public resetInputBox(): void {
        this.inputGridBox = undefined;
        this.configuration.currentPlayer.selectedWord = undefined;
        this.updateGrid();
    }

    private updateGrid(): void {
        this.inputGridBox = Updater.updateGrid(this.configuration, this.inputGridBox);
        this.multiplayerCommunicationService.playerUpdate(this.configuration.currentPlayer);
    }

    private verifyCompletedWords(): void {
        for (const word of this.configuration.grid.words) {
            this.verifyCompletedWord(word);
        }
    }

    private verifyCompletedWord(word: CommonWord): CommonWord {
        let wordValue: string = "";
        for (let i: number = 0; i < word.length; i++) {
            if (word.isHorizontal) {
                if (this.configuration.grid.boxes[word.startPosition.y][word.startPosition.x + i].inputChar.value !== undefined) {
                    wordValue += this.configuration.grid.boxes[word.startPosition.y][word.startPosition.x + i].inputChar.value;
                }
            } else {
                if (this.configuration.grid.boxes[word.startPosition.y + i][word.startPosition.x].inputChar.value !== undefined) {
                    wordValue += this.configuration.grid.boxes[word.startPosition.y + i][word.startPosition.x].inputChar.value;
                }
            }
        }
        if (wordValue === this.getWordValue(word) && !ListChecker.playersFoundWord(word)) {
            this.configuration.currentPlayer.foundWords.push(word);
            this.addToScore();
            Updater.setFoundBoxes(this.configuration);
            if (Comparator.compareWords(this.configuration.currentPlayer.selectedWord, word)) {
                this.resetInputBox();
            }
        }

        return word;
    }

    @HostListener("window:keydown", ["$event"])
    public inputChar(event: KeyboardEvent): void {
        if (this.configuration.configurationDone && this.configuration.grid !== undefined) {
            if (this.inputGridBox !== undefined && !ListChecker.playersFoundWord(this.configuration.currentPlayer.selectedWord)) {
                if (event.key.match(/^[a-z]$/i) !== null) {
                    this.enterNextCharacter(event.key.toUpperCase());
                    this.inputGridBox = Updater.setInputBox(this.configuration, this.inputGridBox);
                }
                if (event.keyCode === BACKSPACE_KEYCODE) {
                    this.eraseLastCharacter();
                    this.inputGridBox = Updater.setInputBox(this.configuration, this.inputGridBox);
                }
            }
            this.verifyCompletedWords();
        }
    }

    private isStartingBox(gridBox: CommonGridBox, index: number): boolean {
        return gridBox.id.x === gridBox.constraints[index].startPosition.x
            && gridBox.id.y === gridBox.constraints[index].startPosition.y;
    }

    private addToScore(): void {
        this.configuration.currentPlayer.score++;
        this.updateGrid();
    }

    private enterNextCharacter(char: string): void {
        this.configuration.grid.boxes[this.configuration.getY()][this.configuration.getX()].inputChar.value = char;
        Comparator.goToNextAvailableBox(this.configuration);
    }

    private eraseLastCharacter(): void {
        Comparator.goBackOneCharacter(this.configuration);
        this.configuration.grid.boxes[this.configuration.getY()][this.configuration.getX()].inputChar.value = "";
    }

    public playersSelectedBox(box: CommonGridBox): boolean {
        return ListChecker.playersSelectedBox(box);
    }

}
