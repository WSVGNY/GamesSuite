import { Component } from "@angular/core";
import { GridService } from "../grid.service";
import { ConfigurationService } from "../configuration/configuration.service";
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
    public choseGridDifficulty: boolean = false;
    private _hasSubscribed: boolean = false;
    public waitingForRoom: boolean = false;

    public constructor(
        private _gridService: GridService,
        public configurationService: ConfigurationService,
        private _multiplayerCommunicationService: MultiplayerCommunicationService) {
    }

    public setNewGame(): void {
        this.isNewGame = true;
    }

    public setJoinGame(): void {
        this.isJoinGame = true;
        this.configurationService.isTwoPlayerGame = true;
        this._multiplayerCommunicationService.connectToSocket();
        this.subscribeToMessages();
        this._multiplayerCommunicationService.roomListQuery();
        this.configurationService.isSocketConnected = true;
    }

    public setGameType(isTwoPlayerGame: boolean): void {
        this.configurationService.isTwoPlayerGame = isTwoPlayerGame;
        if (isTwoPlayerGame) {
            this._multiplayerCommunicationService.connectToSocket();
        }
    }

    public subscribeToMessages(): void {
        if (!this._hasSubscribed) {
            this._multiplayerCommunicationService.getMessagesConfigurationComponent().subscribe((message: string) => {
                if (message === SocketEvents.StartGame) {
                    this.configurationService.handleGameStart(
                        this._multiplayerCommunicationService.grid,
                        this._multiplayerCommunicationService.currentGame.players);
                }
            });
            this._hasSubscribed = true;
        }
    }

    public onRoomSelect(room: MultiplayerCrosswordGame, playerName: string): void {
        this.waitingForRoom = true;
        this.configurationService.currentPlayerName = playerName;
        this._multiplayerCommunicationService.connectToRoom({ roomInfo: room, playerName: playerName });
    }

    public createGrid(): void {
        if (!this.configurationService.isTwoPlayerGame) {
            this._gridService.gridGet(this.configurationService.difficulty).subscribe((grid: CommonGrid) => {
                this.configurationService.grid = grid;
            });
        }
    }

    private makeGrid(): void {
        this.choseGridDifficulty = true;
        this.createGrid();
    }

    public makeEasyGrid(): void {
        this.configurationService.difficulty = Difficulty.Easy;
        this.makeGrid();
    }

    public makeMediumGrid(): void {
        this.configurationService.difficulty = Difficulty.Medium;
        this.makeGrid();
    }

    public makeHardGrid(): void {
        this.configurationService.difficulty = Difficulty.Hard;
        this.makeGrid();
    }

    public submitName(playerName: string): void {
        this.configurationService.playerOne = { name: playerName, color: "teal", score: 0 };
        this.configurationService.currentPlayerName = this.configurationService.playerOne.name;
        this.configurationService.configurationDone = true;
    }

    public createRoom(name: string): void {
        this._multiplayerCommunicationService.connectToSocket();
        this.configurationService.currentPlayerName = name;
        this.subscribeToMessages();
        this._multiplayerCommunicationService.createRoom(name, this.configurationService.difficulty);
        this.configurationService.isSocketConnected = true;
    }

}
