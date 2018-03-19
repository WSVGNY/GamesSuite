import { Component } from "@angular/core";
import { GridService } from "../grid.service";
import { ConfigurationService } from "../configuration.service";
import { CommonGrid } from "../../../../../common/crossword/commonGrid";
import { Difficulty } from "../../../../../common/crossword/difficulty";
import { MultiplayerCommunicationService } from "../multiplayer-communication.service";
import { SocketEvents } from "../../../../../common/communication/socketEvents";
import { MultiplayerCrosswordGame } from "../../../../../common/crossword/multiplayerCrosswordGame";

@Component({
    selector: "app-configuration",
    templateUrl: "./configuration.component.html",
    styleUrls: ["./configuration.component.css"]
})
export class ConfigurationComponent {
    public isNewGame: boolean = false;
    public isJoinGame: boolean = false;
    public difficulty: Difficulty;
    public choseGridDifficulty: boolean = false;
    private messages: string[] = [];
    private _hasSubscribed: boolean = false;

    public constructor(
        private _gridService: GridService,
        public configurationService: ConfigurationService,
        private multiplayerCommunicationService: MultiplayerCommunicationService) {
    }

    public setNewGame(): void {
        this.isNewGame = true;
    }

    public setJoinGame(): void {
        this.isJoinGame = true;
        this.multiplayerCommunicationService.connectToSocket();
        this.subscribeToMessages();
        this.multiplayerCommunicationService.roomListQuery();
        this.configurationService.isSocketConnected = true;
    }

    public subscribeToMessages(): void {
        if (!this._hasSubscribed) {
            this.multiplayerCommunicationService.getMessages().subscribe((message: string) => {
                this.messages.push(message);
                console.log(message);
                if (message === SocketEvents.StartGame) {
                    this.configurationService.grid = this.multiplayerCommunicationService.grid;
                    this.configurationService.configurationDone = true;
                }
            });
            this._hasSubscribed = true;

        }
    }

    public onRoomSelect(room: MultiplayerCrosswordGame): void {
        console.log(room);
        this.multiplayerCommunicationService.connectToRoom({ roomInfo: room, playerName: this.configurationService.playerName });
    }

    public createGrid(): void {
        if (this.configurationService.isTwoPlayerGame) {
            // this.multiplayerCommunicationService.gridQuery()
        } else {
            this._gridService.gridGet(this.difficulty).subscribe((grid: CommonGrid) => {
                this.configurationService.grid = grid;
            });
        }

    }

    private makeGrid(): void {
        this.choseGridDifficulty = true;
        this.createGrid();
    }

    public makeEasyGrid(): void {
        this.difficulty = Difficulty.Easy;
        this.makeGrid();
    }

    public makeMediumGrid(): void {
        this.difficulty = Difficulty.Medium;
        this.makeGrid();
    }

    public makeHardGrid(): void {
        this.difficulty = Difficulty.Hard;
        this.makeGrid();
    }

    public submitName(): void {
        this.configurationService.configurationDone = true;
    }

    public createRoom(): void {
        this.multiplayerCommunicationService.connectToSocket();
        this.subscribeToMessages();
        this.multiplayerCommunicationService.createRoom(this.configurationService.playerName, this.difficulty);
        this.configurationService.isSocketConnected = true;
    }

}
