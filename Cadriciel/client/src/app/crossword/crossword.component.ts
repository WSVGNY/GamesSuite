import { Component } from "@angular/core";
import { CommonGridBox } from "../../../../common/crossword/commonGridBox";
import { CommonWord } from "../../../../common/crossword/commonWord";
import { ConfigurationService } from "./configuration.service";
import { MultiplayerCommunicationService } from "./multiplayer-communication.service";

@Component({
    selector: "app-crossword",
    templateUrl: "./crossword.component.html",
    styleUrls: ["./crossword.component.css"]
})
export class CrosswordComponent {

    public selectedGridBox: CommonGridBox;
    public correctWordCount: number = 0;
    public isInCheatMode: boolean = false;

    private message: string;
    private messages: string[] = [];
    private _hasSubscribed: boolean = false;

    public constructor(
        public configurationService: ConfigurationService,
        private multiplayerCommunicationService: MultiplayerCommunicationService) {
    }

    public subscribeToMessages(): void {
        if (!this._hasSubscribed) {
            this.multiplayerCommunicationService.getMessages().subscribe((message: string) => {
                this.messages.push(message);
                console.log(message);
            });
            this._hasSubscribed = true;

        }
    }

    public sendMessage(): void {
        this.multiplayerCommunicationService.sendMessage(this.message);
        this.message = "";
    }

    public isConfigurationDone(): boolean {
        return this.configurationService.configurationDone;
    }

    public isSocketConnected(): boolean {
        if (this.configurationService.isSocketConnected) {
            this.subscribeToMessages();
        }

        return this.configurationService.isSocketConnected;
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
        word.isComplete = true;
        this.correctWordCount++;
    }

    public getFirstLetter(): void {

    }

}
