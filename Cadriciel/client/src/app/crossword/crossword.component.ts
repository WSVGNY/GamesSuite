import { Component, HostListener } from "@angular/core";
import { CommonGridBox } from "../../../../common/crossword/commonGridBox";
import { CommonWord } from "../../../../common/crossword/commonWord";
import { ConfigurationService } from "./configuration/configuration.service";
import { MultiplayerCommunicationService } from "./multiplayer-communication.service";
import { SocketEvents } from "../../../../common/communication/socketEvents";
import { ListChecker } from "./listChecker";
import { Comparator } from "./comparator";
import { Updater } from "./updater";
import { Player } from "../../../../common/crossword/player";
import { CompletedWordControler } from "./completedWordControler";
import { HORIZONTAL, State, VERTICAL, NOT_COLORED_DEFINITION, BLACK, WHITE, BACKSPACE_KEYCODE } from "./crosswordConstants";

@Component({
    selector: "app-crossword",
    templateUrl: "./crossword.component.html",
    styleUrls: ["./crossword.component.css"]
})
export class CrosswordComponent {

    public inputGridBox: CommonGridBox;
    public isInCheatMode: boolean;
    private _hasSubscribed: boolean;
    public hasOtherPlayerDisconnected: boolean;
    public isGameFinished: boolean;

    public constructor(
        public configuration: ConfigurationService, private multiplayerCommunicationService: MultiplayerCommunicationService) {
        this.isInCheatMode = false;
        this._hasSubscribed = false;
        this.hasOtherPlayerDisconnected = false;
        this.isGameFinished = false;

    }

    public subscribeToMessages(): void {
        this.multiplayerCommunicationService.getMessagesCrosswordComponent().subscribe((message: string) => {
            switch (message) {
                case SocketEvents.PlayerUpdate:
                    this.handlePlayerUpdate();
                    break;
                case SocketEvents.RestartGame:
                    this.configuration.handleGameStart(
                        this.multiplayerCommunicationService.grid,
                        this.multiplayerCommunicationService.currentGame.players);
                    break;
                case SocketEvents.DisconnectionAlert:
                    this.hasOtherPlayerDisconnected = true;
                    break;
                case SocketEvents.ReinitializeGame:
                    this.resetGameStats();
                    break;
                default:
            }
        });
    }

    private handlePlayerUpdate(): void {
        this.configuration.updateOtherPlayer(this.multiplayerCommunicationService.updatedPlayer);
        Updater.updateInputCharInBoxes(this.configuration);
        this.inputGridBox = Updater.setInputBox(this.configuration, this.inputGridBox);
    }

    public isConfigurationDone(): boolean {
        if (!this._hasSubscribed && this.multiplayerCommunicationService.isSocketDefined) {
            this.subscribeToMessages();
            this._hasSubscribed = true;
        }
        if (this.configuration.configurationDone && this.configuration.currentPlayer.foundWords === undefined) {
            this.initializePlayersArrays(this.configuration.currentPlayer);
            if (this.configuration.isTwoPlayerGame) {
                this.initializePlayersArrays(this.configuration.otherPlayer);
            }
        }

        return this.configuration.configurationDone;
    }

    private initializePlayersArrays(player: Player): void {
        player.foundBoxes = [];
        player.foundWords = [];
        player.selectedBoxes = [];
    }

    public getMySelectedGridBox(): CommonGridBox {
        return this.inputGridBox;
    }

    public changeMode(): void {
        this.isInCheatMode ? this.isInCheatMode = false : this.isInCheatMode = true;
    }

    public getState(word: CommonWord): State {
        if (ListChecker.playersFoundWord(word, this.configuration)) {
            return State.Found;
        }
        if (Comparator.compareWords(this.configuration.currentPlayer.selectedWord, word)) {
            return State.Selected;
        }

        return State.Free;
    }

    public setSelectedWordOfBox(gridBox: CommonGridBox): void {
        if (gridBox.constraints[HORIZONTAL] !== undefined) {
            this.setSelectedWord(Comparator.findEquivalent(gridBox.constraints[HORIZONTAL], this.configuration.grid.words));
        }
    }

    public setSelectedWord(word: CommonWord): void {
        if (!ListChecker.playersFoundWord(word, this.configuration)) {
            this.configuration.currentPlayer.selectedWord = word;
            this.inputGridBox = Updater.setInputBox(this.configuration, this.inputGridBox);
        }
        this.updateGrid();
    }

    public getWordValue(word: CommonWord): string {
        return CompletedWordControler.getWordValue(word, this.configuration);
    }

    public getGridBoxID(gridBox: CommonGridBox): number {
        if (gridBox.constraints[HORIZONTAL] !== undefined) {
            if (gridBox.constraints[VERTICAL] !== undefined && this.isStartingBox(gridBox, VERTICAL)) {
                return gridBox.constraints[VERTICAL].definitionID;
            } else if (this.isStartingBox(gridBox, HORIZONTAL)) {
                return gridBox.constraints[HORIZONTAL].definitionID;
            }
        }

        return undefined;
    }

    public getPlayerColorForDefinition(word: CommonWord): string {
        if (this.wordShouldBeColored(this.configuration.currentPlayer, word)) {
            return this.configuration.currentPlayer.color;
        }
        if (this.configuration.isTwoPlayerGame) {
            if (this.wordShouldBeColored(this.configuration.otherPlayer, word)) {
                return this.configuration.otherPlayer.color;
            }
        }

        return NOT_COLORED_DEFINITION;
    }

    private wordShouldBeColored(player: Player, word: CommonWord): boolean {
        return Comparator.compareWords(player.selectedWord, word) || ListChecker.listContainsWord(player.foundWords, word);
    }

    public getPlayerColorForBox(box: CommonGridBox): string {
        if (box.isBlack) {
            return BLACK;
        } else if (this.configuration.isTwoPlayerGame && ListChecker.listContainsBox(this.configuration.otherPlayer.foundBoxes, box)) {
            return this.mixedColor(box);
        }

        return (ListChecker.listContainsBox(this.configuration.currentPlayer.foundBoxes, box)) ?
            this.configuration.currentPlayer.color : WHITE;
    }

    private mixedColor(box: CommonGridBox): string {
        return ListChecker.listContainsBox(this.configuration.currentPlayer.foundBoxes, box) ?
            "repeating-linear-gradient(45deg, " + this.configuration.currentPlayer.color +
            ", " + this.configuration.otherPlayer.color + " 25px)" :
            this.configuration.otherPlayer.color;
    }

    public getPlayerBorderColorForBox(box: CommonGridBox): string {
        if (this.isBoxSelectedAndNotFound(this.configuration.currentPlayer, box)) {
            return this.configuration.currentPlayer.color;
        }
        if (this.configuration.isTwoPlayerGame && this.isBoxSelectedAndNotFound(this.configuration.otherPlayer, box)) {
            return this.configuration.otherPlayer.color;
        }

        return BLACK;
    }

    private isBoxSelectedAndNotFound(player: Player, box: CommonGridBox): boolean {
        return ListChecker.listContainsBox(player.selectedBoxes, box) &&
            !ListChecker.playersFoundBox(box, this.configuration);
    }

    public getPlayerOutlineColor(box: CommonGridBox): string {
        if (this.configuration.isTwoPlayerGame &&
            this.isBoxSelectedAndNotFound(this.configuration.currentPlayer, box) &&
            this.isBoxSelectedAndNotFound(this.configuration.otherPlayer, box)) {
            return "4px dashed " + this.configuration.otherPlayer.color;
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

    @HostListener("window:keydown", ["$event"])
    public inputChar(event: KeyboardEvent): void {
        if (this.configuration.configurationDone && this.configuration.grid !== undefined) {
            if (this.inputGridBox !== undefined &&
                !ListChecker.playersFoundWord(this.configuration.currentPlayer.selectedWord, this.configuration)) {
                if (event.key.match(/^[a-z]$/i) !== null) {
                    this.enterNextCharacter(event.key.toUpperCase());
                    this.inputGridBox = Updater.setInputBox(this.configuration, this.inputGridBox);
                }
                if (event.keyCode === BACKSPACE_KEYCODE) {
                    this.eraseLastCharacter();
                    this.inputGridBox = Updater.setInputBox(this.configuration, this.inputGridBox);
                }
            }
            if (CompletedWordControler.verifyCompletedWords(this.configuration)) {
                this.resetInputBox();
            }
        }
    }

    private isStartingBox(gridBox: CommonGridBox, index: number): boolean {
        return gridBox.id.x === gridBox.constraints[index].startPosition.x
            && gridBox.id.y === gridBox.constraints[index].startPosition.y;
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
        return ListChecker.playersSelectedBox(box, this.configuration);
    }

    public restartGame(): void {
        this.resetGameStats();
        this.configuration.isTwoPlayerGame ?
            this.multiplayerCommunicationService.restartGameWithSameConfig() :
            this.restartGameWithSameConfig();
    }

    private resetGameStats(): void {
        this.configuration.currentPlayer.score = 0;
        this.configuration.grid = undefined;
        this.initializePlayersArrays(this.configuration.currentPlayer);
    }

    public restartGameWithSameConfig(): void {
        this.configuration.createGrid();
    }

    public isEndGame(): boolean {
        if (this.configuration.configurationDone && this.configuration.grid !== undefined) {
            if (!this.configuration.isTwoPlayerGame &&
                this.checkScore(this.configuration.currentPlayer.score)) {
                return true;
            }
            if (this.configuration.isTwoPlayerGame &&
                this.checkScore(this.configuration.currentPlayer.score + this.configuration.otherPlayer.score)) {
                return true;
            }
        }

        return false;
    }
    private checkScore(score: number): boolean {
        return score >= this.configuration.grid.words.length;
    }
}
